(function directoryAgiRuntime(){
  "use strict";

  const VERSION="1.1.0";
  const CANONICAL_URL="/ecosystem/master-ecosystem-directory.json";
  const APPROVED_CANONICAL_HOSTS=new Set(["vervenveda.com","vervenveda.github.io"]);
  const LIMITS=Object.freeze({
    backupBytes:524288,
    notes:500,
    noteChars:4000,
    records:250,
    title:160,
    url:2048,
    category:80,
    group:100,
    aliases:20,
    aliasChars:80,
    recoveries:20
  });
  const KEYS=Object.freeze({
    cloud:"VNV_DIRECTORY_AGI_CLOUD_V2",
    overlay:"VNV_DIRECTORY_AGI_OVERLAY_V2",
    state:"VNV_DIRECTORY_AGI_STATE_V2",
    canonical:"VNV_DIRECTORY_AGI_CANONICAL_CACHE_V2",
    recovery:"VNV_DIRECTORY_AGI_RECOVERY_V2",
    legacyCloud:"VNV_DIRECTORY_AGI_CLOUD_V1",
    legacyDirectory:"VNV_DIRECTORY_AGI_DIRECTORY_V1",
    legacyState:"VNV_DIRECTORY_AGI_STATE_V1"
  });
  const SCHEMAS=Object.freeze({
    cloud:"vnv-directory-agi-cloud-v2",
    overlay:"vnv-directory-agi-overlay-v2",
    state:"vnv-directory-agi-state-v2",
    canonical:"vnv-directory-agi-canonical-cache-v2",
    recovery:"vnv-directory-agi-recovery-v2"
  });
  const SEED=Array.isArray(window.VNV_DIRECTORY_AGI_SEED_V1)?window.VNV_DIRECTORY_AGI_SEED_V1:[];

  const clone=value=>JSON.parse(JSON.stringify(value));
  const parse=(raw,fallback)=>{try{const v=JSON.parse(raw);return v??fallback}catch{return fallback}};
  const esc=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
  const normalize=value=>String(value??"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();
  const cap=(value,n)=>String(value??"").trim().slice(0,n);
  const now=()=>new Date().toISOString();
  const validIso=value=>typeof value==="string"&&Number.isFinite(Date.parse(value));
  const uuid=()=>globalThis.crypto?.randomUUID?.()||("local-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2));
  const setOutput=text=>{const node=document.getElementById("output");if(node)node.textContent=String(text??"")};

  const knownRevisions=new Map();
  let canonicalDirectory=clone(SEED);
  let canonicalMeta={source:"embedded-seed",baseline:"seed-v1",count:flattenRaw(SEED).length,registryVersion:null,lastSync:null};
  let externalChange=false;

  function envelope(key,schema,fallback){
    const raw=localStorage.getItem(key);
    if(raw===null){knownRevisions.set(key,0);return{schema,revision:0,updatedAt:null,payload:clone(fallback)}}
    const value=parse(raw,null);
    if(!value||value.schema!==schema||!Number.isInteger(value.revision)||value.revision<0||!("payload" in value)){
      knownRevisions.set(key,0);
      return{schema,revision:0,updatedAt:null,payload:clone(fallback)};
    }
    knownRevisions.set(key,value.revision);
    return value;
  }
  function writeRecovery(record){
    try{
      const current=parse(localStorage.getItem(KEYS.recovery),{schema:SCHEMAS.recovery,revision:0,payload:{entries:[]}});
      const entries=Array.isArray(current?.payload?.entries)?current.payload.entries:[];
      const next={
        schema:SCHEMAS.recovery,
        revision:(Number.isInteger(current?.revision)?current.revision:0)+1,
        updatedAt:now(),
        payload:{entries:[...entries,record].slice(-LIMITS.recoveries)}
      };
      const raw=JSON.stringify(next);
      localStorage.setItem(KEYS.recovery,raw);
      return localStorage.getItem(KEYS.recovery)===raw;
    }catch{return false}
  }
  function transactionalWrite(key,schema,payload,action){
    let previousRaw=null;
    try{
      const currentRaw=localStorage.getItem(key);
      previousRaw=currentRaw;
      const current=currentRaw===null?{schema,revision:0,payload:null}:parse(currentRaw,null);
      const currentRevision=current&&current.schema===schema&&Number.isInteger(current.revision)?current.revision:0;
      const expected=knownRevisions.has(key)?knownRevisions.get(key):currentRevision;
      if(currentRevision!==expected){
        externalChange=true;
        return{ok:false,conflict:true,message:"Another tab changed this record. Reload or retry after reviewing the newer data."};
      }
      const next={schema,revision:currentRevision+1,updatedAt:now(),payload:clone(payload)};
      const raw=JSON.stringify(next);
      const recovery={
        id:uuid(),targetKey:key,action:cap(action,120),createdAt:now(),
        previousRaw,currentRevision,nextRevision:next.revision
      };
      if(!writeRecovery(recovery))return{ok:false,message:"Recovery snapshot could not be written. No change was committed."};
      localStorage.setItem(key,raw);
      if(localStorage.getItem(key)!==raw)throw new Error("readback verification failed");
      knownRevisions.set(key,next.revision);
      externalChange=false;
      return{ok:true,revision:next.revision};
    }catch(error){
      try{
        if(previousRaw===null)localStorage.removeItem(key);
        else localStorage.setItem(key,previousRaw);
      }catch{}
      return{ok:false,message:"Verified storage write failed; the previous record was restored.",error};
    }
  }
  function recoverLast(){
    const pack=parse(localStorage.getItem(KEYS.recovery),null);
    const entries=pack?.schema===SCHEMAS.recovery&&Array.isArray(pack?.payload?.entries)?pack.payload.entries:[];
    const record=entries.at(-1);
    if(!record)return{ok:false,message:"No recovery snapshot is available."};
    const current=parse(localStorage.getItem(record.targetKey),null);
    const currentRevision=Number.isInteger(current?.revision)?current.revision:0;
    if(currentRevision!==record.nextRevision)return{ok:false,message:"Recovery refused because the target has changed since that transaction."};
    if(!window.confirm("Restore the most recent pre-mutation snapshot for this Directory AGI record?"))return{ok:false,message:"Recovery cancelled."};
    try{
      if(record.previousRaw===null)localStorage.removeItem(record.targetKey);
      else localStorage.setItem(record.targetKey,record.previousRaw);
      knownRevisions.delete(record.targetKey);
      return{ok:true,message:"Most recent transaction restored from its pre-mutation snapshot."};
    }catch{return{ok:false,message:"Recovery could not be applied."}}
  }

  function sanitizeNote(input){
    if(!input||typeof input!=="object")throw new Error("Invalid Cloud note.");
    const id=cap(input.id||uuid(),120),text=cap(input.text,LIMITS.noteChars),createdAt=String(input.createdAt||"");
    if(!text)throw new Error("Cloud notes cannot be empty.");
    if(!validIso(createdAt))throw new Error("Cloud note timestamp is invalid.");
    return{id,createdAt:new Date(createdAt).toISOString(),text};
  }
  function sanitizeCloud(input){
    if(!Array.isArray(input))throw new Error("Cloud records must be an array.");
    if(input.length>LIMITS.notes)throw new Error("Cloud backup exceeds the "+LIMITS.notes+" note limit.");
    const seen=new Set();
    return input.map(note=>{
      const clean=sanitizeNote(note);
      if(seen.has(clean.id))throw new Error("Cloud backup contains duplicate note IDs.");
      seen.add(clean.id);
      return clean;
    });
  }
  function sanitizeAliases(input){
    if(!Array.isArray(input))return[];
    return [...new Set(input.map(x=>cap(x,LIMITS.aliasChars)).filter(Boolean))].slice(0,LIMITS.aliases);
  }
  function validHttps(url){
    try{const parsed=new URL(url);return parsed.protocol==="https:"}catch{return false}
  }
  function canonicalHostOk(url){
    try{const parsed=new URL(url);return parsed.protocol==="https:"&&APPROVED_CANONICAL_HOSTS.has(parsed.hostname)}catch{return false}
  }
  function sanitizeLocalRecord(input){
    if(!input||typeof input!=="object")throw new Error("Invalid local record.");
    const title=cap(input.title,LIMITS.title),url=cap(input.url,LIMITS.url);
    if(!title||!validHttps(url))throw new Error("Local records require a title and valid HTTPS URL.");
    return{
      id:cap(input.id||("local-"+uuid()),140),
      title,
      url,
      desc:cap(input.desc||"Locally added external reference.",400),
      aliases:sanitizeAliases(input.aliases),
      previousLocations:[],
      category:cap(input.category||"Local",LIMITS.category),
      group:cap(input.group||"Added References",LIMITS.group),
      source:"local-external",
      canonical:false
    };
  }
  function sanitizeOverlay(input){
    const records=Array.isArray(input?.records)?input.records:[];
    if(records.length>LIMITS.records)throw new Error("Local overlay exceeds the "+LIMITS.records+" record limit.");
    const seen=new Set();
    return{records:records.map(record=>{
      const clean=sanitizeLocalRecord(record);
      if(seen.has(clean.id))clean.id="local-"+uuid();
      seen.add(clean.id);
      return clean;
    })};
  }

  function getCloudEnvelope(){return envelope(KEYS.cloud,SCHEMAS.cloud,{notes:[]})}
  function getCloud(){const e=getCloudEnvelope();try{return sanitizeCloud(e.payload?.notes||[])}catch{return[]}}
  function setCloud(notes,action="Update Cloud"){let clean;try{clean=sanitizeCloud(notes)}catch(error){return{ok:false,message:error.message}}return transactionalWrite(KEYS.cloud,SCHEMAS.cloud,{notes:clean},action)}
  function getOverlayEnvelope(){return envelope(KEYS.overlay,SCHEMAS.overlay,{records:[]})}
  function getOverlay(){const e=getOverlayEnvelope();try{return sanitizeOverlay(e.payload||{records:[]})}catch{return{records:[]}}}
  function setOverlay(overlay,action="Update local overlay"){let clean;try{clean=sanitizeOverlay(overlay)}catch(error){return{ok:false,message:error.message}}return transactionalWrite(KEYS.overlay,SCHEMAS.overlay,clean,action)}
  function getState(){return envelope(KEYS.state,SCHEMAS.state,{version:VERSION,canonical:{source:"embedded-seed"}}).payload||{}}
  function setState(payload,action="Update state"){return transactionalWrite(KEYS.state,SCHEMAS.state,{...payload,version:VERSION},action)}
  function getCanonicalCache(){return envelope(KEYS.canonical,SCHEMAS.canonical,{directory:[],meta:null}).payload||{}}
  function setCanonicalCache(directory,meta){return transactionalWrite(KEYS.canonical,SCHEMAS.canonical,{directory:clone(directory),meta:clone(meta)},"Cache canonical directory")}

  function flattenRaw(directory){
    if(!Array.isArray(directory))return[];
    return directory.flatMap(category=>(Array.isArray(category?.groups)?category.groups:[]).flatMap(group=>(Array.isArray(group?.items)?group.items:[]).map(record=>({
      ...record,categoryId:category.id,category:category.label,group:group.title
    }))));
  }
  function categoryLabel(value){
    return cap(String(value||"Other").replace(/[-_]+/g," ").replace(/\b\w/g,m=>m.toUpperCase()),LIMITS.category)||"Other";
  }
  function normalizeRegistry(registry){
    if(!registry||!Array.isArray(registry.entries))throw new Error("Canonical registry entries are missing.");
    const visible=registry.entries.filter(entry=>entry&&entry.directoryVisible===true&&entry.status==="active"&&entry.access==="free-public");
    if(!visible.length)throw new Error("Canonical registry contains no visible active entries.");
    const ids=new Set(),byCategory=new Map();
    for(const entry of visible){
      const id=cap(entry.id,140),title=cap(entry.title,LIMITS.title),url=cap(entry.url,LIMITS.url);
      if(!id||!title||!canonicalHostOk(url))throw new Error("Canonical registry contains an invalid public entry.");
      if(ids.has(id))throw new Error("Canonical registry contains duplicate IDs.");
      ids.add(id);
      const category=categoryLabel(entry.category),group=cap(entry.repository||"Verve N Veda",140);
      if(!byCategory.has(category))byCategory.set(category,new Map());
      const groups=byCategory.get(category);
      if(!groups.has(group))groups.set(group,[]);
      groups.get(group).push({
        id,title,url,
        desc:cap([entry.type,entry.developmentStatus,entry.path].filter(Boolean).join(" · "),400),
        aliases:[],
        previousLocations:[],
        repository:cap(entry.repository,180),
        path:cap(entry.path,260),
        type:cap(entry.type,80),
        status:cap(entry.status,40),
        source:"canonical-ecosystem",
        canonical:true
      });
    }
    const directory=[...byCategory.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([label,groups],ci)=>({
      id:"canonical-"+normalize(label).replace(/\s+/g,"-")+"-"+ci,
      label,
      groups:[...groups.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([title,items])=>({
        title,items:items.sort((a,b)=>a.title.localeCompare(b.title))
      }))
    }));
    return{
      directory,
      meta:{
        source:"canonical-registry",
        baseline:cap(registry.baseline,40)||null,
        registryVersion:cap(registry.schemaVersion,40)||null,
        entryCount:Number(registry.entryCount)||registry.entries.length,
        visibleCount:visible.length,
        repositories:new Set(visible.map(x=>x.repository)).size,
        lastSync:now()
      }
    };
  }
  function combinedDirectory(){
    const base=clone(canonicalDirectory);
    const overlay=getOverlay().records;
    for(const record of overlay){
      let category=base.find(c=>normalize(c.label)===normalize(record.category));
      if(!category){category={id:"local-category-"+normalize(record.category).replace(/\s+/g,"-"),label:record.category,groups:[]};base.push(category)}
      let group=category.groups.find(g=>normalize(g.title)===normalize(record.group));
      if(!group){group={title:record.group,items:[]};category.groups.push(group)}
      group.items.push({...record});
    }
    return base;
  }
  function flatten(directory=combinedDirectory()){return flattenRaw(directory)}
  function searchable(record){
    return normalize([record.title,record.id,record.desc,record.category,record.group,record.repository,record.type,record.source,...(record.aliases||[]),record.url].join(" "));
  }
  function matches(query){
    const q=normalize(query);
    const records=flatten();
    return q?records.filter(record=>searchable(record).includes(q)):records;
  }
  function resolve(name){
    const q=normalize(name);if(!q)return null;
    const records=flatten();
    return records.find(r=>normalize(r.id)===q||normalize(r.title)===q||(r.aliases||[]).some(a=>normalize(a)===q))
      ||records.find(r=>searchable(r).includes(q))||null;
  }
  function formatRecord(r){
    if(!r)return"No matching directory record.";
    const aliases=(r.aliases||[]).length?"\nAliases: "+r.aliases.join(", "):"";
    return r.title+"\nSource: "+(r.source||"unknown")+"\nCategory: "+r.category+" / "+r.group+"\nURL: "+r.url+"\n"+(r.desc||"")+aliases;
  }

  function renderCloud(){
    const list=document.getElementById("cloudData"),cloud=getCloud();
    list.innerHTML=cloud.length?cloud.slice().reverse().map(entry=>"<li><strong>"+esc(new Date(entry.createdAt).toLocaleString())+"</strong><br>"+esc(entry.text)+"</li>").join(""):"<li>Cloud is empty.</li>";
  }
  function renderStats(){
    const records=flatten(),canonical=records.filter(r=>r.source==="canonical-ecosystem").length,local=records.filter(r=>r.source==="local-external").length;
    document.getElementById("stats").innerHTML=
      '<div class="stat"><b>'+canonical+'</b><span>Canonical</span></div>'+
      '<div class="stat"><b>'+local+'</b><span>Local</span></div>'+
      '<div class="stat"><b>'+combinedDirectory().length+'</b><span>Categories</span></div>'+
      '<div class="stat"><b>'+esc(canonicalMeta.source==="canonical-registry"?"Live":"Fallback")+'</b><span>Source</span></div>';
  }
  function renderDirectory(query=""){
    const root=document.getElementById("directoryList"),directory=combinedDirectory(),q=normalize(query),html=[];
    for(const category of directory){
      const groups=[];
      for(const group of category.groups){
        const items=group.items.filter(record=>!q||searchable({...record,category:category.label,group:group.title}).includes(q));
        if(!items.length)continue;
        groups.push("<details open><summary>"+esc(group.title)+" · "+items.length+"</summary><div class=\"group-body\">"+
          items.map(record=>'<div class="item"><strong>'+esc(record.title)+'</strong><span class="record-source '+(record.source==="canonical-ecosystem"?"canonical":"local")+'">'+(record.source==="canonical-ecosystem"?"Canonical":"Local external")+'</span><div class="small">'+esc(record.desc||"")+'</div><a href="'+esc(record.url)+'" target="_blank" rel="noopener noreferrer">'+esc(record.url)+'</a>'+((record.aliases||[]).length?'<div class="aliases">Aliases: '+esc(record.aliases.join(", "))+"</div>":"")+"</div>").join("")+
          "</div></details>");
      }
      if(groups.length)html.push("<h3>"+esc(category.label)+"</h3>"+groups.join(""));
    }
    root.innerHTML=html.join("")||'<p class="small">No matching records.</p>';
    renderStats();
  }
  function renderSyncStatus(message){
    const node=document.getElementById("canonicalSyncStatus");if(!node)return;
    node.textContent=message||(
      canonicalMeta.source==="canonical-registry"
        ?"Canonical registry active · "+canonicalMeta.count+" visible destinations · baseline "+(canonicalMeta.baseline||"unknown")+" · synced "+new Date(canonicalMeta.lastSync).toLocaleString()
        :"Emergency fallback active · "+canonicalMeta.count+" embedded/cache records"
    );
  }

  async function syncCanonical({quiet=false}={}){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
    try{
      renderSyncStatus("Synchronizing read-only canonical ecosystem registry…");
      const response=await fetch(CANONICAL_URL,{cache:"no-store",credentials:"same-origin",signal:controller.signal});
      if(!response.ok)throw new Error("Canonical registry returned HTTP "+response.status);
      const registry=await response.json();
      const normalized=normalizeRegistry(registry);
      canonicalDirectory=normalized.directory;
      canonicalMeta={...normalized.meta,count:flattenRaw(normalized.directory).length};
      const cached=setCanonicalCache(canonicalDirectory,canonicalMeta);
      if(!cached.ok&&!quiet)setOutput("Canonical registry loaded, but its offline cache could not be verified.");
      const state=getState();setState({...state,canonical:canonicalMeta},"Record canonical synchronization");
      renderDirectory(document.getElementById("directorySearch")?.value||"");
      renderSyncStatus();
      if(!quiet)setOutput("Canonical sync complete: "+canonicalMeta.count+" public destinations from "+canonicalMeta.repositories+" repositories. The master registry was read only.");
      return{ok:true,...canonicalMeta};
    }catch(error){
      const cache=getCanonicalCache();
      if(Array.isArray(cache.directory)&&cache.directory.length){
        canonicalDirectory=cache.directory;
        canonicalMeta={...(cache.meta||{}),source:"canonical-cache",count:flattenRaw(cache.directory).length};
      }else{
        canonicalDirectory=clone(SEED);
        canonicalMeta={source:"embedded-seed",baseline:"seed-v1",count:flattenRaw(SEED).length,registryVersion:null,lastSync:null};
      }
      renderDirectory(document.getElementById("directorySearch")?.value||"");
      renderSyncStatus("Canonical network sync unavailable · using "+(canonicalMeta.source==="canonical-cache"?"last verified local cache":"embedded emergency seed")+" · "+canonicalMeta.count+" records");
      if(!quiet)setOutput("Canonical sync unavailable. Local notes and overlays remain available; no write-back was attempted.");
      return{ok:false,error};
    }finally{clearTimeout(timer)}
  }

  function addLocalRecord(){
    const title=cap(document.getElementById("addTitle").value,LIMITS.title);
    const url=cap(document.getElementById("addUrl").value,LIMITS.url);
    const category=cap(document.getElementById("addCategory").value||"Local",LIMITS.category);
    const group=cap(document.getElementById("addGroup").value||"Added References",LIMITS.group);
    const aliases=sanitizeAliases(document.getElementById("addAliases").value.split(","));
    if(!title||!validHttps(url))return setOutput("Title and a valid https:// URL are required.");
    const overlay=getOverlay();
    if(overlay.records.length>=LIMITS.records)return setOutput("Local overlay limit reached. Export the Directory AGI JSON before adding more records.");
    const record=sanitizeLocalRecord({id:"local-"+uuid(),title,url,category,group,aliases,desc:"Locally added external reference."});
    overlay.records.push(record);
    const result=setOverlay(overlay,"Add local external reference");
    if(!result.ok)return setOutput(result.message||"Local reference was not saved.");
    ["addTitle","addUrl","addCategory","addGroup","addAliases"].forEach(id=>document.getElementById(id).value="");
    renderDirectory(document.getElementById("directorySearch").value);
    setOutput("Added local external reference: "+title+". It remains separate from canonical ecosystem authority.");
  }
  function validateDirectory(){
    const records=flatten(),problems=[],ids=new Set();
    for(const record of records){
      if(!record.id||!record.title||!record.url)problems.push("Missing required field: "+(record.title||record.id||"unknown"));
      if(ids.has(record.id))problems.push("Duplicate id: "+record.id);else ids.add(record.id);
      if(record.source==="canonical-ecosystem"){
        if(!canonicalHostOk(record.url))problems.push("Canonical record uses an unapproved host: "+record.title);
      }else if(record.source==="local-external"){
        if(!validHttps(record.url))problems.push("Local external record is not HTTPS: "+record.title);
      }else problems.push("Unknown record source: "+record.title);
    }
    return problems;
  }

  function storageBytes(){
    try{return Object.values(KEYS).filter(k=>!k.startsWith("VNV_DIRECTORY_AGI_")||!k.endsWith("_V1")).reduce((sum,key)=>sum+new Blob([key,localStorage.getItem(key)||""]).size,0)}catch{return 0}
  }
  function formatBytes(bytes){if(bytes<1024)return bytes+" B";if(bytes<1048576)return(bytes/1024).toFixed(1)+" KB";return(bytes/1048576).toFixed(2)+" MB"}
  function updateStorageStatus(ok=true){
    const node=document.getElementById("cloudStorageStatus");if(!node)return;
    node.textContent=ok?"Verified local storage active · "+formatBytes(storageBytes())+" · revisioned recovery enabled":"Local storage unavailable/full · export evidence before leaving";
  }
  function download(name,payload){
    const blob=new Blob([JSON.stringify(payload,null,2)+"\n"],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),700);
  }
  function cloudBackupPayload(){
    return{type:"VNV_DIRECTORY_AGI_CLOUD_BACKUP",version:VERSION,exportedAt:now(),cloud:getCloud(),revision:getCloudEnvelope().revision};
  }
  function exportCloudBackup(){download("vnv-directory-agi-cloud-backup-v1.1.json",cloudBackupPayload());setOutput("Cloud backup exported.")}
  async function importCloudBackupFile(file){
    try{
      if(!file||file.size>LIMITS.backupBytes)throw new Error("Cloud backup is larger than 512 KiB.");
      const payload=JSON.parse(await file.text());
      if(payload?.type!=="VNV_DIRECTORY_AGI_CLOUD_BACKUP"||!Array.isArray(payload.cloud))throw new Error("This is not a Directory AGI Cloud backup.");
      const clean=sanitizeCloud(payload.cloud);
      if(!window.confirm(clean.length+" verified Cloud record"+(clean.length===1?"":"s")+" found. Replace the current local Cloud notes?"))return setOutput("Cloud backup import cancelled.");
      const result=setCloud(clean,"Import bounded Cloud backup");
      if(!result.ok)throw new Error(result.message||"Verified Cloud write failed.");
      renderCloud();updateStorageStatus(true);setOutput("Cloud backup restored and readback-verified: "+clean.length+" record"+(clean.length===1?"":"s")+".");
    }catch(error){setOutput(error?.message||"Cloud backup could not be read or validated.")}
  }
  function exportJson(){
    download("vnv-directory-agi-v1.1-export.json",{
      schema:"vnv-directory-agi-export-v1",
      version:VERSION,
      exportedAt:now(),
      canonical:{meta:canonicalMeta,directory:canonicalDirectory},
      localOverlay:getOverlay(),
      cloud:getCloud(),
      state:getState(),
      recoveryAvailable:!!parse(localStorage.getItem(KEYS.recovery),null)
    });
    setOutput("Complete Directory AGI export created. Canonical data remains read-only; local overlays and Cloud notes are included.");
  }
  function resetLocalOverlay(){
    if(!window.confirm("Remove only the local external references and aliases? Canonical ecosystem records and Cloud notes will not be changed."))return;
    const result=setOverlay({records:[]},"Reset local overlay");
    if(!result.ok)return setOutput(result.message||"Local overlay reset was not committed.");
    renderDirectory();setOutput("Local overlay reset. Canonical ecosystem records were untouched.");
  }

  function processCommand(){
    const field=document.getElementById("userInput"),raw=field.value.trim(),lower=raw.toLowerCase();
    if(!raw)return;
    let output="";
    if(lower==="help")output="Commands:\nfind <term>\nresolve <name>\nshow category <name>\nshow directory\nshow cloud\nvalidate\nstats\nsync canonical\nrecover last\nhelp";
    else if(lower==="show cloud"){const cloud=getCloud();output=cloud.length?cloud.map(x=>x.createdAt+" · "+x.text).join("\n"):"Cloud is empty."}
    else if(lower==="show directory")output=flatten().map(r=>r.source+" · "+r.category+" / "+r.group+" · "+r.title+" · "+r.url).join("\n");
    else if(lower==="validate"){const problems=validateDirectory();output=problems.length?"Validation issues:\n- "+problems.join("\n- "):"Directory validation passed. Canonical and local authority classes remain distinct."}
    else if(lower==="stats")output="Canonical: "+flatten().filter(x=>x.source==="canonical-ecosystem").length+"\nLocal external: "+getOverlay().records.length+"\nCategories: "+combinedDirectory().length+"\nCanonical source: "+canonicalMeta.source+"\nStorage: "+formatBytes(storageBytes());
    else if(lower==="sync canonical"){syncCanonical();return}
    else if(lower==="recover last"){const result=recoverLast();renderCloud();renderDirectory();updateStorageStatus(result.ok);output=result.message}
    else if(lower.startsWith("find ")){const found=matches(raw.slice(5));output=found.length?found.map(formatRecord).join("\n\n---\n\n"):"No matches."}
    else if(lower.startsWith("resolve "))output=formatRecord(resolve(raw.slice(8)));
    else if(lower.startsWith("show category ")){const q=normalize(raw.slice(14)),found=flatten().filter(r=>normalize(r.category).includes(q));output=found.length?found.map(formatRecord).join("\n\n---\n\n"):"No category matches."}
    else output="Unknown command. Type help.";
    setOutput(output);
  }

  function migrateLegacy(){
    try{
      if(localStorage.getItem(KEYS.cloud)===null){
        const legacy=parse(localStorage.getItem(KEYS.legacyCloud),[]);
        if(Array.isArray(legacy)&&legacy.length){
          const clean=sanitizeCloud(legacy.slice(0,LIMITS.notes));
          transactionalWrite(KEYS.cloud,SCHEMAS.cloud,{notes:clean},"Migrate legacy Cloud notes");
        }
      }
      if(localStorage.getItem(KEYS.overlay)===null){
        const legacy=parse(localStorage.getItem(KEYS.legacyDirectory),null);
        if(Array.isArray(legacy)){
          const locals=flattenRaw(legacy).filter(r=>String(r.id||"").startsWith("local-")||/locally added/i.test(String(r.desc||""))).slice(0,LIMITS.records).map(r=>sanitizeLocalRecord({
            id:r.id,title:r.title,url:r.url,desc:r.desc,aliases:r.aliases,category:r.category||"Local",group:r.group||"Added References"
          }));
          if(locals.length)transactionalWrite(KEYS.overlay,SCHEMAS.overlay,{records:locals},"Migrate legacy local directory records");
        }
      }
    }catch(error){console.warn("Directory AGI legacy migration skipped",error)}
  }

  window.addEventListener("storage",event=>{
    if([KEYS.cloud,KEYS.overlay,KEYS.state,KEYS.canonical].includes(event.key)){
      externalChange=true;
      setOutput("Another tab changed Directory AGI data. The next replacement-style write will require the newer revision; append operations will re-read before committing.");
    }
  });

  document.getElementById("cloudStore")?.addEventListener("click",()=>{
    const input=document.getElementById("cloudInput"),text=cap(input.value,LIMITS.noteChars);
    if(!text)return;
    const cloud=getCloud();
    if(cloud.length>=LIMITS.notes)return setOutput("Cloud note limit reached. Export a backup before adding more.");
    cloud.push({id:"note-"+uuid(),createdAt:now(),text});
    const result=setCloud(cloud,"Add Cloud note");
    if(!result.ok)return setOutput(result.message||"Cloud note was not saved.");
    input.value="";renderCloud();updateStorageStatus(true);
  });
  document.getElementById("cloudClear")?.addEventListener("click",()=>{
    if(!window.confirm("Clear only the local Cloud notes?"))return;
    const result=setCloud([],"Clear Cloud notes");if(!result.ok)return setOutput(result.message||"Cloud was not cleared.");
    renderCloud();updateStorageStatus(true);setOutput("Cloud notes cleared. A pre-mutation recovery snapshot was retained.");
  });
  document.getElementById("cloudBackup")?.addEventListener("click",exportCloudBackup);
  document.getElementById("cloudImport")?.addEventListener("click",()=>document.getElementById("cloudImportFile")?.click());
  document.getElementById("cloudImportFile")?.addEventListener("change",event=>{const file=event.target.files?.[0];if(file)importCloudBackupFile(file);event.target.value=""});
  document.getElementById("directorySearch")?.addEventListener("input",event=>renderDirectory(event.target.value));
  document.getElementById("addRecord")?.addEventListener("click",addLocalRecord);
  document.getElementById("resetSeed")?.addEventListener("click",resetLocalOverlay);
  document.getElementById("syncCanonical")?.addEventListener("click",()=>syncCanonical());
  document.getElementById("runCommand")?.addEventListener("click",processCommand);
  document.getElementById("userInput")?.addEventListener("keydown",event=>{if(event.key==="Enter")processCommand()});
  document.getElementById("exportBtn")?.addEventListener("click",exportJson);

  migrateLegacy();

  const cache=getCanonicalCache();
  if(Array.isArray(cache.directory)&&cache.directory.length){
    canonicalDirectory=cache.directory;
    canonicalMeta={...(cache.meta||{}),source:"canonical-cache",count:flattenRaw(cache.directory).length};
  }
  renderCloud();renderDirectory();renderSyncStatus();updateStorageStatus(true);
  syncCanonical({quiet:true});

  Object.defineProperty(window,"VNVDirectoryAGI",{
    value:Object.freeze({
      version:VERSION,
      find:term=>matches(term),
      resolve:name=>resolve(name),
      all:()=>flatten(),
      categories:()=>combinedDirectory().map(c=>({id:c.id,label:c.label})),
      validate:()=>validateDirectory(),
      sync:()=>syncCanonical(),
      status:()=>({version:VERSION,canonical:{...canonicalMeta},localRecords:getOverlay().records.length,cloudNotes:getCloud().length,externalChange}),
      recover:()=>recoverLast(),
      reset:()=>{resetLocalOverlay();return true}
    }),
    enumerable:false,configurable:false,writable:false
  });
})();
