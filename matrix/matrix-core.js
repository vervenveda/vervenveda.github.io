/* Verve N Veda Mentor Matrix Core · Repair 10
 * Pure structural validation + shared helpers.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports) module.exports=api;
  root.VNMatrixCore=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  const uniq = xs => [...new Set((xs||[]).filter(Boolean))];
  const arr = x => Array.isArray(x)?x:(x==null?[]:[x]);

  function issue(severity,type,message,extra={}){
    return {severity,type,message,...extra};
  }

  function canonicalUrl(value){
    if(!value) return "";
    try{
      const u=new URL(value);
      u.hash="";
      if(u.pathname.length>1) u.pathname=u.pathname.replace(/\/+$/,"/");
      return u.toString();
    }catch{return String(value).trim();}
  }

  function repoKey(fullName){ return String(fullName||"").toLowerCase(); }

  function localResourceId(resource){
    const id=String(resource?.id||"");
    if(!id.includes(".")) return id;
    return id.split(".").pop();
  }

  function isProvisional(repo){
    const a=String(repo?.manifest?.inventoryAuthority||"").toLowerCase();
    return a.includes("provisional")||a.includes("partial");
  }

  function repositoryPathFromPublicUrl(url,repoFullName){
    try{
      const u=new URL(url);
      let p=decodeURIComponent(u.pathname).replace(/^\/+/,"");
      const repoName=String(repoFullName||"").split("/").pop();
      if(repoName && repoName.toLowerCase()!=="vervenveda.github.io"){
        const parts=p.split("/");
        if((parts[0]||"").toLowerCase()===repoName.toLowerCase()) p=parts.slice(1).join("/");
      }
      if(!p) return "index.html";
      if(p.endsWith("/")) p += "index.html";
      return p;
    }catch{return "";}
  }

  function summarize(issues){
    const counts={error:0,warning:0,info:0};
    for(const x of issues||[]) if(counts[x.severity]!=null) counts[x.severity]++;
    return {
      ...counts,
      total:counts.error+counts.warning+counts.info,
      status:counts.error?"FAIL":counts.warning?"PASS_WITH_WARNINGS":"PASS"
    };
  }

  function validateRegistryStructure({repositoriesDoc,resourcesDoc}){
    const issues=[];
    const repos=arr(repositoriesDoc?.repositories);
    const resources=arr(resourcesDoc?.resources);

    const repoIds=new Map(), repoNames=new Map(), sourceOwners=new Map();
    for(const repo of repos){
      const rk=repoKey(repo.fullName);
      if(repo.id){
        if(repoIds.has(repo.id)) issues.push(issue("error","duplicate-repository-id",`Duplicate repository id: ${repo.id}`,{repository:repo.fullName,otherRepository:repoIds.get(repo.id)}));
        else repoIds.set(repo.id,repo.fullName);
      }
      if(rk){
        if(repoNames.has(rk)) issues.push(issue("error","duplicate-repository",`Repository appears more than once: ${repo.fullName}`,{repository:repo.fullName}));
        else repoNames.set(rk,repo);
      }

      if(repo.discoveryStatus!=="manifested" && !repo.archived && !repo.disabled){
        const sev=repo.classification && repo.classification!=="unclassified" ? "warning":"info";
        issues.push(issue(sev,"unmanifested-repository",
          `Repository is not manifested: ${repo.fullName}`,
          {repository:repo.fullName,classification:repo.classification||"",recommendable:!!repo.recommendable,
           suggestion:"Add a verified root mentor-manifest.json only if this repository should participate in Mentor recommendations."}));
      }

      const sid=repo?.manifest?.sourceId;
      if(sid){
        if(sourceOwners.has(sid) && sourceOwners.get(sid)!==rk){
          issues.push(issue("error","duplicate-source-authority",
            `Source authority ${sid} is claimed by multiple repositories.`,
            {sourceId:sid,repository:repo.fullName,otherRepository:sourceOwners.get(sid),
             suggestion:"Choose one source repository or explicitly delegate the nested/secondary manifest."}));
        }else sourceOwners.set(sid,rk);
      }

      if(repo.recommendable && repo.discoveryStatus!=="manifested"){
        issues.push(issue("error","recommendable-without-manifest",
          `Repository is recommendable without a valid manifested authority: ${repo.fullName}`,
          {repository:repo.fullName}));
      }
    }

    const rid=new Map(), rurl=new Map();
    for(const r of resources){
      if(!r.id){
        issues.push(issue("error","resource-missing-id","A normalized resource has no id.",{sourceId:r.sourceId||"",url:r.url||""}));
      }else if(rid.has(r.id)){
        issues.push(issue("error","duplicate-resource-id",`Duplicate resource id: ${r.id}`,{resourceId:r.id,otherResource:rid.get(r.id)}));
      }else rid.set(r.id,r.title||r.url||"");

      const cu=canonicalUrl(r.url);
      if(cu){
        if(rurl.has(cu) && rurl.get(cu).sourceId!==r.sourceId){
          issues.push(issue("warning","duplicate-resource-url",
            `The same URL is claimed by multiple source authorities: ${cu}`,
            {url:cu,sourceId:r.sourceId,otherSourceId:rurl.get(cu).sourceId,resourceId:r.id}));
        }else rurl.set(cu,r);
      }

      if(r.recommendable!==false){
        if(!r.url) issues.push(issue("error","recommendable-resource-missing-url",`Recommendable resource is missing a URL: ${r.id}`,{resourceId:r.id,sourceId:r.sourceId}));
        if(!r.sourceId) issues.push(issue("error","recommendable-resource-missing-source",`Recommendable resource is missing sourceId: ${r.id}`,{resourceId:r.id}));
        if(!r.repository) issues.push(issue("warning","resource-missing-repository",`Resource has no normalized repository: ${r.id}`,{resourceId:r.id,sourceId:r.sourceId}));
      }

      if(r.sourceId && !sourceOwners.has(r.sourceId)){
        issues.push(issue("warning","resource-source-not-in-repository-registry",
          `Resource sourceId is not represented by a manifested repository authority: ${r.sourceId}`,
          {resourceId:r.id,sourceId:r.sourceId,repository:r.repository||""}));
      }else if(r.sourceId && r.repository){
        const expected=sourceOwners.get(r.sourceId);
        if(expected && repoKey(r.repository)!==expected){
          issues.push(issue("error","resource-repository-authority-mismatch",
            `Resource ${r.id} points to ${r.repository}, but ${r.sourceId} belongs to another repository.`,
            {resourceId:r.id,sourceId:r.sourceId,repository:r.repository,expectedRepository:expected}));
        }
      }
    }

    return {issues,sourceOwners};
  }

  function validateObjectiveOverlay({taxonomy,overrides,anchors,stageTargets,examples,resourcesDoc}){
    const issues=[];
    const ids=new Set();
    for(const o of arr(taxonomy?.objectives)){
      if(!o.id){issues.push(issue("error","objective-missing-id","Taxonomy objective missing id."));continue;}
      if(ids.has(o.id)) issues.push(issue("error","duplicate-objective-id",`Duplicate objective id: ${o.id}`,{objectiveId:o.id}));
      ids.add(o.id);
    }
    const valid=id=>ids.has(id);

    const resources=arr(resourcesDoc?.resources);
    const resourceMatches=(ov)=>{
      return resources.filter(r=>{
        if(r.sourceId!==ov.sourceId) return false;
        const lid=localResourceId(r);
        return lid===ov.localId || String(r.id||"").endsWith("."+ov.localId);
      });
    };

    for(const o of arr(overrides?.overrides)){
      for(const id of arr(o.objectiveIds)){
        if(!valid(id)) issues.push(issue("error","invalid-objective-reference",
          `Override ${o.sourceId}/${o.localId} references missing objective ${id}.`,
          {sourceId:o.sourceId,localId:o.localId,objectiveId:id}));
      }
      if(!resourceMatches(o).length){
        issues.push(issue("warning","override-resource-not-in-current-registry",
          `Curated override does not match a resource in the current generated registry: ${o.sourceId}/${o.localId}.`,
          {sourceId:o.sourceId,localId:o.localId,
           suggestion:"If the source manifest was recently updated, rebuild the central registry before deleting the override."}));
      }
      if(!["core","direct-practice","support","transfer-practice","exploration"].includes(o.alignment)){
        issues.push(issue("error","invalid-alignment",`Invalid alignment ${o.alignment} on ${o.sourceId}/${o.localId}.`,{sourceId:o.sourceId,localId:o.localId}));
      }
      if((o.alignment==="support"||o.alignment==="transfer-practice"||o.alignment==="exploration") && o.canCountAsMasteryEvidence===true){
        issues.push(issue("error","weak-alignment-marked-mastery",
          `${o.sourceId}/${o.localId} is ${o.alignment} but is marked as mastery evidence.`,
          {sourceId:o.sourceId,localId:o.localId}));
      }
    }

    for(const a of arr(anchors?.anchors)){
      for(const id of arr(a.objectives)) if(!valid(id)) issues.push(issue("error","anchor-invalid-objective",`Lesson anchor references missing objective ${id}.`,{objectiveId:id,pattern:a.pattern}));
    }

    for(const [stage,stageData] of Object.entries(stageTargets?.stages||{})){
      for(const [subject,list] of Object.entries(stageData?.subjects||{})){
        for(const id of arr(list)) if(!valid(id)) issues.push(issue("error","stage-target-invalid-objective",`${stage}/${subject} references missing objective ${id}.`,{stage,subject,objectiveId:id}));
      }
    }

    for(const ex of arr(examples?.examples)){
      for(const id of arr(ex.expected)) if(!valid(id)) issues.push(issue("error","example-invalid-objective",`Context example "${ex.title}" expects missing objective ${id}.`,{objectiveId:id,title:ex.title}));
    }

    return issues;
  }

  function manifestResourcePathSet(manifest,repoFullName){
    const set=new Set();
    for(const r of arr(manifest?.resources)){
      const p=repositoryPathFromPublicUrl(r.url,repoFullName);
      if(p) set.add(p.toLowerCase());
    }
    return set;
  }

  function candidateEntrypoints(tree,config){
    const inc=arr(config?.deepScan?.candidatePatterns).map(x=>new RegExp(x,"i"));
    const exc=arr(config?.deepScan?.excludePatterns).map(x=>new RegExp(x,"i"));
    return arr(tree?.tree)
      .filter(x=>x.type==="blob" && /\.html$/i.test(x.path||""))
      .map(x=>x.path)
      .filter(p=>inc.some(rx=>rx.test(p)) && !exc.some(rx=>rx.test(p)));
  }

  function detectOrphans({tree,manifest,repo,config}){
    const issues=[];
    const candidates=candidateEntrypoints(tree,config);
    const manifested=manifestResourcePathSet(manifest,repo.fullName);
    const provisional=isProvisional(repo) || String(manifest?.inventoryAuthority||"").toLowerCase().includes("provisional") || String(manifest?.inventoryAuthority||"").toLowerCase().includes("partial");

    for(const p of candidates){
      const lp=p.toLowerCase();
      const equivalent = manifested.has(lp) ||
        (lp.endsWith("/index.html") && manifested.has(lp.replace(/index\.html$/,""))) ||
        [...manifested].some(m=>m===lp || (m.endsWith("/index.html")&&m.slice(0,-10)===lp.slice(0,-10)));
      if(!equivalent){
        issues.push(issue(provisional?"info":"warning","orphan-entrypoint-candidate",
          `Likely app/tool entrypoint is not represented in the source manifest: ${p}`,
          {repository:repo.fullName,path:p,inventoryAuthority:manifest?.inventoryAuthority||repo?.manifest?.inventoryAuthority||"",
           suggestion:provisional?"Deep-inventory this repository before treating the candidate as missing.":"Review whether this entrypoint should be manifested or intentionally excluded."}));
      }
    }
    return issues;
  }

  function validateNestedManifests(entries,rootManifest,repo){
    const issues=[];
    for(const x of entries||[]){
      if(x.path==="mentor-manifest.json") continue;
      const m=x.manifest;
      if(!m) continue;
      const delegated = m.mentorSearchable===false && (m.inventoryAuthority==="delegated-to-root" || m.delegatedTo===rootManifest?.sourceId);
      if(delegated){
        issues.push(issue("info","delegated-nested-manifest",`Nested manifest is safely delegated: ${x.path}`,{repository:repo.fullName,path:x.path,sourceId:m.sourceId||"",delegatedTo:m.delegatedTo||rootManifest?.sourceId}));
        continue;
      }
      if(m.mentorSearchable!==false){
        const same=m.sourceId && m.sourceId===rootManifest?.sourceId;
        issues.push(issue(same?"error":"warning","active-nested-manifest-authority",
          `Active nested Mentor manifest detected at ${x.path}.`,
          {repository:repo.fullName,path:x.path,sourceId:m.sourceId||"",rootSourceId:rootManifest?.sourceId||"",
           suggestion:"Delegate the nested manifest to root or document intentional multi-authority architecture."}));
      }
    }
    return issues;
  }

  return {
    arr,uniq,issue,canonicalUrl,repoKey,localResourceId,isProvisional,
    repositoryPathFromPublicUrl,summarize,validateRegistryStructure,
    validateObjectiveOverlay,manifestResourcePathSet,candidateEntrypoints,
    detectOrphans,validateNestedManifests
  };
});
