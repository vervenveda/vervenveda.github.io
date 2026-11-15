#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const MANIFEST=JSON.parse(fs.readFileSync(path.join(ROOT,"data/vervenveda-network-standard-manifest.json"),"utf8"));
const OWNER=MANIFEST.owner;
const TOKEN=process.env.GITHUB_TOKEN||"";
const headers={Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"};
if(TOKEN)headers.Authorization="Bearer "+TOKEN;

async function api(url){
  const r=await fetch(url,{headers});
  if(!r.ok)throw new Error(r.status+" "+r.statusText+" "+url);
  return r.json();
}
async function fileText(repo,file,owner=OWNER){
  try{
    const j=await api(`https://api.github.com/repos/${owner}/${repo}/contents/${file}?ref=main`);
    if(!j?.content)return "";
    return Buffer.from(j.content,"base64").toString("utf8");
  }catch{return ""}
}
const yes=v=>v?"PASS":"—";
const has=(text,re)=>re.test(text||"");

async function inspect(entry){
  const repoOwner=entry.owner||OWNER;
  const base={owner:repoOwner,name:entry.name,kind:entry.kind,publicSurface:entry.publicSurface,role:entry.role||null,replaces:entry.replaces||null};
  let tree;
  try{
    tree=await api(`https://api.github.com/repos/${repoOwner}/${entry.name}/git/trees/main?recursive=1`);
  }catch(error){
    return {...base,status:"UNAVAILABLE",error:String(error.message||error)};
  }
  const blobs=(tree.tree||[]).filter(x=>x.type==="blob");
  const paths=blobs.map(x=>x.path);
  const htmlFiles=paths.filter(p=>/\.html?$/i.test(p)).length;
  const protectedIndexCores=paths.filter(p=>/(^|\/)index-core\.txt$/i.test(p)).length;
  const hasIndex=paths.includes("index.html");
  const semanticAudit=paths.includes("tools/semantic-hierarchy-audit.mjs");
  const guardCandidates=paths.filter(p=>/^assets\/.*(?:global|chrome|standard).*\.js$/i.test(p));
  const indexText=hasIndex?await fileText(entry.name,"index.html",repoOwner):"";
  let guardText="";
  for(const p of guardCandidates.slice(0,4))guardText+="\n"+await fileText(entry.name,p,repoOwner);
  const authority=indexText+"\n"+guardText;

  const earlyLearning=entry.ageBandStandard==="early-learning";
  const checks={
    ticker333:has(authority,/vnv-333-ticker\.js|vnv333NetworkTicker|VNV333Ticker/i),
    autoTicker:has(authority,/vnv-ticker-autopopulate\.js|vnvTickerAutoPopulate|VNV_TICKER/i),
    officialHeader:has(authority,/vnv-header-autopopulate\.js|VNV_HEADER/i),
    officialToolbar:has(authority,/vnv-ecosystem-toolbar\.js|vnvEcosystemUtilityDock|VNVEcosystemToolbar/i),
    typography16:has(guardText,/font-size["',:]?\s*16px|font-size:16px|size<16/i),
    typography18:has(guardText,/font-size["',:]?\s*18px|font-size:18px|size<18/i),
    typography33:has(guardText,/font-size:33px!important|ordinaryTitlePx[^\d]*33/i),
    typography66:has(guardText,/font-size:66px!important|primaryHeroTitlePx[^\d]*66/i),
    semanticAuthority:has(guardText,/khaemenesHierarchy="title-description-v1"|__KHAEMENES_SEMANTIC_HIERARCHY_V1__/i),
    semanticAudit
  };
  const required=entry.publicSurface
    ?(earlyLearning
      ?["autoTicker","officialHeader","officialToolbar","typography18","typography33","typography66","semanticAuthority","semanticAudit"]
      :["ticker333","autoTicker","officialHeader","officialToolbar","typography16","typography33","typography66","semanticAuthority","semanticAudit"])
    :[];
  const passCount=required.filter(k=>checks[k]).length;
  const status=!entry.publicSurface?"INFRASTRUCTURE":
    passCount===required.length?"HARDENED":
    passCount>=5?"PARTIAL":"NEEDS STANDARDIZATION";

  return {...base,htmlFiles,protectedIndexCores,hasIndex,guardCandidates,checks,passCount,requiredCount:required.length,status,ageBandStandard:entry.ageBandStandard||"default",intentional333Omission:earlyLearning};
}

const results=[];
for(const entry of MANIFEST.repositories){
  process.stderr.write("Audit "+entry.name+"\n");
  results.push(await inspect(entry));
}
const summary={
  generatedAt:new Date().toISOString(),
  owner:OWNER,
  repositoryCount:results.length,
  publicSurfaceCount:results.filter(x=>x.publicSurface).length,
  infrastructureCount:results.filter(x=>!x.publicSurface).length,
  htmlFiles:results.reduce((n,x)=>n+(x.htmlFiles||0),0),
  protectedIndexCores:results.reduce((n,x)=>n+(x.protectedIndexCores||0),0),
  hardened:results.filter(x=>x.status==="HARDENED").length,
  partial:results.filter(x=>x.status==="PARTIAL").length,
  needsStandardization:results.filter(x=>x.status==="NEEDS STANDARDIZATION").length,
  unavailable:results.filter(x=>x.status==="UNAVAILABLE").length
};
const report={summary,standard:MANIFEST.standard,repositories:results};
fs.mkdirSync(path.join(ROOT,"reports"),{recursive:true});
fs.writeFileSync(path.join(ROOT,"reports/vervenveda-network-standard.json"),JSON.stringify(report,null,2)+"\n");

const rows=results.map(r=>{
  const c=r.checks||{};
  return `| ${r.name} | ${r.kind} | ${r.htmlFiles??"—"} | ${yes(c.ticker333)} | ${yes(c.autoTicker)} | ${yes(c.officialHeader)} | ${yes(c.officialToolbar)} | ${yes(c.typography16&&c.typography33&&c.typography66)} | ${yes(c.semanticAuthority&&c.semanticAudit)} | **${r.status}** |`;
});
const md=`# Verve N Veda Network Standard Audit

Generated: ${summary.generatedAt}

**Repositories:** ${summary.repositoryCount} · **Public surfaces:** ${summary.publicSurfaceCount} · **Infrastructure:** ${summary.infrastructureCount} · **HTML pages:** ${summary.htmlFiles} · **Protected index cores:** ${summary.protectedIndexCores}

**Hardened:** ${summary.hardened} · **Partial:** ${summary.partial} · **Needs standardization:** ${summary.needsStandardization} · **Unavailable:** ${summary.unavailable}

Default standard: readable text ≥16px; ordinary titles 33px; one primary hero title 66px; eyebrow = category/brand; title = heading; description = paragraph.

Early Learning exception (Preschool + Kindergarten): readable text ≥18px; **no 333 ticker**; AutoPopulate ticker remains required with the official header/menu and lower-right toolbar.

| Repository | Type | HTML | 333 | Auto | Header | Toolbar | 16/33/66 | Semantic hierarchy | Status |
|---|---|---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
${rows.join("\n")}
`;
fs.writeFileSync(path.join(ROOT,"reports/vervenveda-network-standard.md"),md);
console.log(JSON.stringify(summary,null,2));
