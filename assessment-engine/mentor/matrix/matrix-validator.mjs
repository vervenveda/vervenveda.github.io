#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const args=new Set(process.argv.slice(2));
const deep=args.has("--deep");
const outArg=process.argv.find(x=>x.startsWith("--out="));
const outPath=outArg?outArg.slice(6):path.join(here,"matrix-report.json");
const registryArg=process.argv.find(x=>x.startsWith("--registry-base="));
const registryBase=registryArg?registryArg.slice("--registry-base=".length):"https://vervenveda.com/assessment-engine/mentor/registry/";
const token=process.env.GITHUB_TOKEN||"";

const coreCode=fs.readFileSync(path.join(here,"matrix-core.js"),"utf8");
const sandbox={globalThis:{},URL};
vm.createContext(sandbox);vm.runInContext(coreCode,sandbox);
const C=sandbox.globalThis.VNMatrixCore;
if(!C) throw new Error("Matrix core failed to load.");

const cfg=JSON.parse(fs.readFileSync(path.join(here,"matrix-config.json"),"utf8"));
const fetchJSON=async url=>{
  const r=await fetch(url); if(!r.ok) throw new Error(`${r.status} ${r.statusText} ${url}`); return r.json();
};
const ghHeaders=()=>({
  "Accept":"application/vnd.github+json",
  "X-GitHub-Api-Version":"2022-11-28",
  ...(token?{"Authorization":`Bearer ${token}`}:{})
});
const decodeB64=s=>Buffer.from(String(s||"").replace(/\n/g,""),"base64").toString("utf8");
const getGh=async url=>{const r=await fetch(url,{headers:ghHeaders()});if(!r.ok)throw new Error(`${r.status} ${r.statusText} ${url}`);return r.json();};

async function pool(items,limit,fn){
  const out=new Array(items.length);let i=0;
  async function worker(){while(true){const n=i++;if(n>=items.length)return;try{out[n]=await fn(items[n],n);}catch(e){out[n]={__error:e};}}}
  await Promise.all(Array.from({length:Math.min(limit,items.length||1)},worker));return out;
}
async function currentManifest(repo){
  const p=repo.manifest?.path||"mentor-manifest.json", ref=repo.defaultBranch||"main";
  const meta=await getGh(`${cfg.githubApiBase}/repos/${repo.fullName}/contents/${encodeURIComponent(p).replace(/%2F/g,"/")}?ref=${encodeURIComponent(ref)}`);
  return {meta,manifest:JSON.parse(decodeB64(meta.content||""))};
}
async function tree(repo){
  return getGh(`${cfg.githubApiBase}/repos/${repo.fullName}/git/trees/${encodeURIComponent(repo.defaultBranch||"main")}?recursive=1`);
}
async function nestedManifest(repo,p){
  const ref=repo.defaultBranch||"main";
  const meta=await getGh(`${cfg.githubApiBase}/repos/${repo.fullName}/contents/${encodeURIComponent(p).replace(/%2F/g,"/")}?ref=${encodeURIComponent(ref)}`);
  return JSON.parse(decodeB64(meta.content||""));
}
async function checkUrl(r){
  const u=C.canonicalUrl(r.url);const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),cfg.urlTimeoutMs||9000);
  try{
    let x=await fetch(u,{method:"HEAD",redirect:"follow",signal:ctl.signal});
    if(x.status===405||x.status===403)x=await fetch(u,{method:"GET",redirect:"follow",signal:ctl.signal});
    return {ok:x.ok,status:x.status,url:u};
  }catch(e){return {ok:false,status:0,url:u,error:String(e.message||e)}}
  finally{clearTimeout(t)}
}

const base=registryBase.replace(/\/?$/,"/");
const [repositoriesDoc,resourcesDoc,taxonomy,overrides,anchors,stageTargets,examples,gaps]=await Promise.all([
  fetchJSON(base+"ecosystem-repositories.json"),fetchJSON(base+"ecosystem-resources.json"),
  fetchJSON(base+"curriculum-objective-taxonomy.json"),fetchJSON(base+"resource-objective-overrides.json"),
  fetchJSON(base+"curriculum-lesson-anchors.json"),fetchJSON(base+"stage-subject-objectives.json"),
  fetchJSON(base+"curriculum-context-examples.json"),fetchJSON(base+"resource-manifest-gaps.json")
]);

const issues=[];
issues.push(...C.validateRegistryStructure({repositoriesDoc,resourcesDoc}).issues);
issues.push(...C.validateObjectiveOverlay({taxonomy,overrides,anchors,stageTargets,examples,resourcesDoc}));

const manifested=(repositoriesDoc.repositories||[]).filter(r=>r.discoveryStatus==="manifested"&&r.manifest?.path);
const manifests=await pool(manifested,5,async repo=>{
  try{
    const cur=await currentManifest(repo);
    if(cur.meta.sha!==repo.manifest.sha)issues.push(C.issue("warning","stale-registry-manifest",
      `Central registry is stale for ${repo.fullName}.`,
      {repository:repo.fullName,sourceId:repo.manifest.sourceId,registeredSha:repo.manifest.sha,currentSha:cur.meta.sha,
       registeredVersion:repo.manifest.version,currentVersion:cur.manifest?.version,
       suggestion:"Rebuild the central Mentor registries."}));
    if(cur.manifest?.sourceId!==repo.manifest.sourceId)issues.push(C.issue("error","manifest-sourceid-drift",
      `Current sourceId differs for ${repo.fullName}.`,{repository:repo.fullName,registeredSourceId:repo.manifest.sourceId,currentSourceId:cur.manifest?.sourceId}));
    if(cur.manifest?.repository&&C.repoKey(cur.manifest.repository)!==C.repoKey(repo.fullName))issues.push(C.issue("error","manifest-repository-mismatch",
      `Manifest repository field mismatch for ${repo.fullName}.`,{repository:repo.fullName,manifestRepository:cur.manifest.repository}));
    return {repo,manifest:cur.manifest};
  }catch(e){
    issues.push(C.issue("error","manifest-fetch-failed",`Could not fetch current manifest for ${repo.fullName}.`,
      {repository:repo.fullName,error:String(e.message||e)}));return {repo,manifest:null};
  }
});

const urlTargets=(resourcesDoc.resources||[]).filter(r=>r.url&&r.recommendable!==false);
const urlResults=await pool(urlTargets,cfg.urlConcurrency||6,checkUrl);
urlResults.forEach((x,i)=>{if(x?.__error||!x?.ok){const r=urlTargets[i];issues.push(C.issue("error","broken-recommendable-route",
  `Recommendable route failed: ${r.title||r.id}`,{resourceId:r.id,sourceId:r.sourceId,repository:r.repository,url:r.url,status:x?.status||0,error:x?.error||x?.__error?.message||""}))}});

if(deep){
  for(const entry of manifests.filter(x=>x.manifest).slice(0,cfg.deepScan.maxRepositories||80)){
    try{
      const tr=await tree(entry.repo);
      issues.push(...C.detectOrphans({tree:tr,manifest:entry.manifest,repo:entry.repo,config:cfg}));
      const nested=(tr.tree||[]).filter(x=>x.type==="blob"&&/(^|\/)mentor-manifest\.json$/i.test(x.path||"")&&x.path!=="mentor-manifest.json");
      const loaded=[];
      for(const n of nested){
        try{loaded.push({path:n.path,manifest:await nestedManifest(entry.repo,n.path)})}
        catch(e){loaded.push({path:n.path,error:e})}
      }
      issues.push(...C.validateNestedManifests(loaded,entry.manifest,entry.repo));
    }catch(e){issues.push(C.issue("warning","repository-tree-scan-failed",`Deep scan failed for ${entry.repo.fullName}.`,{repository:entry.repo.fullName,error:String(e.message||e)}))}
  }
}

const report={
  schemaVersion:1,generatedAt:new Date().toISOString(),mode:deep?"deep":"standard",
  registryGeneratedAt:repositoriesDoc.generatedAt||resourcesDoc.generatedAt||"",
  registrySourceLatestTimestamp:repositoriesDoc.sourceLatestRepositoryTimestamp||"",
  summary:C.summarize(issues),
  metrics:{
    repositories:(repositoriesDoc.repositories||[]).length,
    manifestedRepositories:manifested.length,
    resources:(resourcesDoc.resources||[]).length,
    objectives:(taxonomy.objectives||[]).length,
    overrides:(overrides.overrides||[]).length,
    urlsChecked:urlTargets.length
  },
  issues
};
fs.writeFileSync(outPath,JSON.stringify(report,null,2));
console.log(JSON.stringify({summary:report.summary,metrics:report.metrics,out:outPath},null,2));
process.exitCode=report.summary.error?1:0;
