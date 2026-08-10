/* Repair 10 · browser/live Matrix auditor */
(async function(){
  "use strict";
  const C=globalThis.VNMatrixCore;
  const $=id=>document.getElementById(id);
  const state={report:null,raw:null};

  function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  async function getJSON(url,opts={}){
    const r=await fetch(url,opts);
    if(!r.ok) throw new Error(`${r.status} ${r.statusText} · ${url}`);
    return r.json();
  }
  function ghHeaders(){
    return {"Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"};
  }
  function decodeB64(s){
    try{return decodeURIComponent(escape(atob(String(s||"").replace(/\n/g,""))));}catch{return atob(String(s||"").replace(/\n/g,""));}
  }
  async function fetchCurrentManifest(repo,apiBase){
    const path=repo?.manifest?.path||"mentor-manifest.json";
    const ref=repo.defaultBranch||"main";
    const url=`${apiBase}/repos/${repo.fullName}/contents/${encodeURIComponent(path).replace(/%2F/g,"/")}?ref=${encodeURIComponent(ref)}`;
    const meta=await getJSON(url,{headers:ghHeaders()});
    let manifest=null;
    if(meta.content) manifest=JSON.parse(decodeB64(meta.content));
    return {meta,manifest,url,path};
  }
  async function fetchTree(repo,apiBase){
    const ref=repo.defaultBranch||"main";
    return getJSON(`${apiBase}/repos/${repo.fullName}/git/trees/${encodeURIComponent(ref)}?recursive=1`,{headers:ghHeaders()});
  }
  async function fetchNestedManifest(repo,path,apiBase){
    const ref=repo.defaultBranch||"main";
    const url=`${apiBase}/repos/${repo.fullName}/contents/${encodeURIComponent(path).replace(/%2F/g,"/")}?ref=${encodeURIComponent(ref)}`;
    const meta=await getJSON(url,{headers:ghHeaders()});
    return meta.content?JSON.parse(decodeB64(meta.content)):null;
  }
  async function pool(items,limit,fn){
    const out=new Array(items.length); let i=0;
    async function worker(){
      while(true){const n=i++;if(n>=items.length)return;try{out[n]=await fn(items[n],n);}catch(e){out[n]={__error:e};}}
    }
    await Promise.all(Array.from({length:Math.min(limit,items.length||1)},worker));
    return out;
  }
  async function checkUrl(item,timeoutMs){
    const url=C.canonicalUrl(item.url);
    if(!url) return {ok:false,status:0,url,error:"missing url"};
    const ctl=new AbortController(); const t=setTimeout(()=>ctl.abort(),timeoutMs);
    try{
      let r=await fetch(url,{method:"HEAD",redirect:"follow",cache:"no-store",signal:ctl.signal});
      if(r.status===405||r.status===403) r=await fetch(url,{method:"GET",redirect:"follow",cache:"no-store",signal:ctl.signal});
      return {ok:r.ok,status:r.status,url,finalUrl:r.url};
    }catch(e){return {ok:false,status:0,url,error:String(e.message||e)};}
    finally{clearTimeout(t);}
  }

  async function loadInputs(){
    const cfg=await getJSON("./matrix-config.json");
    const base=cfg.registryBase;
    const [repositoriesDoc,resourcesDoc,taxonomy,overrides,anchors,stageTargets,examples,gaps]=await Promise.all([
      getJSON(base+"ecosystem-repositories.json"),
      getJSON(base+"ecosystem-resources.json"),
      getJSON(base+"curriculum-objective-taxonomy.json"),
      getJSON(base+"resource-objective-overrides.json"),
      getJSON(base+"curriculum-lesson-anchors.json"),
      getJSON(base+"stage-subject-objectives.json"),
      getJSON(base+"curriculum-context-examples.json"),
      getJSON(base+"resource-manifest-gaps.json")
    ]);
    return {cfg,repositoriesDoc,resourcesDoc,taxonomy,overrides,anchors,stageTargets,examples,gaps};
  }

  function render(report){
    state.report=report;
    const s=report.summary;
    $("status").textContent=s.status.replaceAll("_"," ");
    $("status").className="status "+(s.error?"bad":s.warning?"warn":"good");
    $("counts").innerHTML=[
      ["Errors",s.error,"bad"],["Warnings",s.warning,"warn"],["Info",s.info,"info"],["Checks",report.metrics.checks,"good"]
    ].map(([a,b,c])=>`<div class="metric ${c}"><strong>${b}</strong><span>${a}</span></div>`).join("");
    const severity=$("severity").value, query=$("filter").value.toLowerCase().trim();
    const list=report.issues.filter(x=>(severity==="all"||x.severity===severity)&&(!query||JSON.stringify(x).toLowerCase().includes(query)));
    $("issues").innerHTML=list.map(x=>`<article class="issue ${x.severity}">
      <div><span class="badge">${esc(x.severity)}</span><strong>${esc(x.type)}</strong></div>
      <h3>${esc(x.message)}</h3>
      <p>${esc(x.repository||x.sourceId||x.resourceId||x.url||x.path||"")}</p>
      ${x.suggestion?`<p class="suggest"><strong>Suggested:</strong> ${esc(x.suggestion)}</p>`:""}
      <details><summary>Details</summary><pre>${esc(JSON.stringify(x,null,2))}</pre></details>
    </article>`).join("")||"<p class='empty'>No issues match this filter.</p>";
    $("meta").textContent=`Registry generated: ${report.registryGeneratedAt||"unknown"} · Audit: ${report.generatedAt} · Mode: ${report.mode}`;
  }

  async function audit({deep=false}={}){
    $("run").disabled=true;$("deep").disabled=true;$("progress").textContent="Loading registry…";
    try{
      const data=state.raw||await loadInputs(); state.raw=data;
      const {cfg,repositoriesDoc,resourcesDoc,taxonomy,overrides,anchors,stageTargets,examples}=data;
      const issues=[];
      const structural=C.validateRegistryStructure({repositoriesDoc,resourcesDoc});
      issues.push(...structural.issues);
      issues.push(...C.validateObjectiveOverlay({taxonomy,overrides,anchors,stageTargets,examples,resourcesDoc}));

      const manifested=(repositoriesDoc.repositories||[]).filter(r=>r.discoveryStatus==="manifested"&&r.manifest?.path);
      $("progress").textContent=`Checking ${manifested.length} source manifests for freshness…`;

      const manifests=await pool(manifested,4,async repo=>{
        try{
          const cur=await fetchCurrentManifest(repo,cfg.githubApiBase);
          if(cur.meta.sha!==repo.manifest.sha){
            issues.push(C.issue("warning","stale-registry-manifest",
              `Central registry is stale for ${repo.fullName}.`,
              {repository:repo.fullName,sourceId:repo.manifest.sourceId,registeredSha:repo.manifest.sha,currentSha:cur.meta.sha,
               registeredVersion:repo.manifest.version,currentVersion:cur.manifest?.version,
               suggestion:"Rebuild the central Mentor repository/resource registries from current source manifests."}));
          }
          if(cur.manifest?.sourceId && cur.manifest.sourceId!==repo.manifest.sourceId){
            issues.push(C.issue("error","manifest-sourceid-drift",
              `Current sourceId differs from the registered source authority for ${repo.fullName}.`,
              {repository:repo.fullName,registeredSourceId:repo.manifest.sourceId,currentSourceId:cur.manifest.sourceId}));
          }
          if(cur.manifest?.repository && C.repoKey(cur.manifest.repository)!==C.repoKey(repo.fullName)){
            issues.push(C.issue("error","manifest-repository-mismatch",
              `Manifest repository field does not match its GitHub repository.`,
              {repository:repo.fullName,manifestRepository:cur.manifest.repository,sourceId:cur.manifest.sourceId}));
          }
          return {repo,manifest:cur.manifest,meta:cur.meta};
        }catch(e){
          issues.push(C.issue("error","manifest-fetch-failed",`Could not fetch current source manifest for ${repo.fullName}.`,
            {repository:repo.fullName,error:String(e.message||e),suggestion:"Verify manifest path/default branch and repository accessibility."}));
          return {repo,manifest:null,error:e};
        }
      });

      const urlTargets=(resourcesDoc.resources||[]).filter(r=>r.url && r.recommendable!==false);
      $("progress").textContent=`Checking ${urlTargets.length} recommendable routes…`;
      const urlResults=await pool(urlTargets,cfg.urlConcurrency||6,r=>checkUrl(r,cfg.urlTimeoutMs||9000));
      urlResults.forEach((res,i)=>{
        const r=urlTargets[i];
        if(res?.__error||!res?.ok){
          issues.push(C.issue("error","broken-recommendable-route",
            `Recommendable resource route failed: ${r.title||r.id}`,
            {resourceId:r.id,sourceId:r.sourceId,repository:r.repository,url:r.url,status:res?.status||0,error:res?.error||res?.__error?.message||"",
             suggestion:"Repair the route or mark the resource non-recommendable until restored."}));
        }
      });

      if(deep){
        const scan=manifests.filter(x=>x?.manifest).slice(0,cfg.deepScan?.maxRepositories||80);
        $("progress").textContent=`Deep-scanning ${scan.length} repository trees for orphan entrypoints and nested authorities…`;
        const trees=await pool(scan,3,async entry=>{
          try{
            const tree=await fetchTree(entry.repo,cfg.githubApiBase);
            issues.push(...C.detectOrphans({tree,manifest:entry.manifest,repo:entry.repo,config:cfg}));
            const nested=(tree.tree||[]).filter(x=>x.type==="blob"&&/(^|\/)mentor-manifest\.json$/i.test(x.path||"")&&x.path!=="mentor-manifest.json");
            const nestedResults=await pool(nested,2,async x=>{
              try{return {path:x.path,manifest:await fetchNestedManifest(entry.repo,x.path,cfg.githubApiBase)}}
              catch(e){return {path:x.path,error:e}}
            });
            issues.push(...C.validateNestedManifests(nestedResults,entry.manifest,entry.repo));
            return true;
          }catch(e){
            issues.push(C.issue("warning","repository-tree-scan-failed",`Deep scan failed for ${entry.repo.fullName}.`,
              {repository:entry.repo.fullName,error:String(e.message||e),suggestion:"Retry later or run the Node validator with a GITHUB_TOKEN."}));
            return false;
          }
        });
      }

      const report={
        schemaVersion:1,
        generatedAt:new Date().toISOString(),
        mode:deep?"deep":"standard",
        registryGeneratedAt:repositoriesDoc.generatedAt||resourcesDoc.generatedAt||"",
        registrySourceLatestTimestamp:repositoriesDoc.sourceLatestRepositoryTimestamp||"",
        summary:C.summarize(issues),
        metrics:{
          checks:(repositoriesDoc.repositories||[]).length+(resourcesDoc.resources||[]).length+
            (taxonomy.objectives||[]).length+(overrides.overrides||[]).length,
          repositories:(repositoriesDoc.repositories||[]).length,
          manifestedRepositories:manifested.length,
          resources:(resourcesDoc.resources||[]).length,
          objectives:(taxonomy.objectives||[]).length,
          overrides:(overrides.overrides||[]).length,
          urlsChecked:urlTargets.length,
          deepRepositoriesScanned:deep?manifests.filter(x=>x?.manifest).length:0
        },
        issues
      };
      render(report);
      $("progress").textContent=`Audit complete · ${report.summary.status}`;
    }catch(e){
      $("progress").textContent=`Audit failed: ${e.message||e}`;
      console.error(e);
    }finally{$("run").disabled=false;$("deep").disabled=false;}
  }

  $("run").onclick=()=>audit({deep:false});
  $("deep").onclick=()=>audit({deep:true});
  $("download").onclick=()=>{
    if(!state.report)return;
    const blob=new Blob([JSON.stringify(state.report,null,2)],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`mentor-matrix-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  };
  $("print").onclick=()=>print();
  $("severity").onchange=()=>state.report&&render(state.report);
  $("filter").oninput=()=>state.report&&render(state.report);

  await audit({deep:false});
})();
