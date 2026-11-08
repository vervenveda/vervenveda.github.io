import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../../..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
let failed=false;
const ok=(v,m)=>{if(v)console.log("OK "+m);else{failed=true;console.error("FAIL "+m)}};
const index=read("core/directory-agi/index.html");
const runtime=read("core/directory-agi/directory-agi-v1.1.js");
const registry=JSON.parse(read("ecosystem/master-ecosystem-directory.json"));
const repoEvidence=JSON.parse(read("admin/directory/repositories.json"));
const auditEvidence=JSON.parse(read("admin/directory/directory-audit.json"));
const syncStatus=JSON.parse(read("ecosystem/sync-status.json"));
const entries=Array.isArray(registry.entries)?registry.entries:[];
const visible=entries.filter(x=>x?.directoryVisible===true&&x.status==="active"&&x.access==="free-public");
const normalizedUrl=url=>typeof url==="string"?url.replace(/\/+$/,"").toLowerCase():"";
function approvedPublicUrl(entry){
  try{
    const url=new URL(entry.url);
    if(url.protocol!=="https:"||url.username||url.password)return false;
    if(["vervenveda.com","vervenveda.github.io"].includes(url.hostname))return true;
    // Existing curated mentor gateways use artist1970.github.io, with paths tied to their repository.
    if(url.hostname==="artist1970.github.io"&&/^artist1970\/[^/]+\.github\.io$/.test(entry.repository||"")){
      return url.pathname.startsWith("/"+entry.repository.split("/")[1]+"/");
    }
    return false;
  }catch{return false}
}
ok(entries.length>0,"master registry contains curated entries");
ok(registry.entryCount===entries.length,"master registry entryCount matches entries");
ok(entries.every(x=>x&&typeof x.id==="string"&&x.id.trim()&&typeof x.url==="string"&&x.url.trim()),"curated entries have IDs and URLs");
ok(new Set(entries.map(x=>x.id)).size===entries.length,"curated entry IDs are unique");
ok(new Set(entries.map(x=>normalizedUrl(x.url))).size===entries.length,"curated destination URLs are unique");
ok(visible.length>0,"master registry retains active visible destinations");
ok(visible.every(x=>typeof x.title==="string"&&x.title.trim()&&typeof x.repository==="string"&&x.repository.trim()),"visible entries have titles and repositories");
ok(visible.every(approvedPublicUrl),"visible canonical URLs remain on approved public gateway hosts");
ok(typeof registry.baseline==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(registry.baseline),"master registry has a dated baseline");
ok(registry.pageCatalog?.publicPageCount===syncStatus.publicPageCount,"catalog count agrees with latest sync status");
ok(registry.pageCatalog?.repositoryCount===syncStatus.syncedRepositoryCount,"catalog repository count agrees with latest sync status");
ok(syncStatus.syncedRepositoryCount===syncStatus.approvedRepositoryCount&&syncStatus.syncedRepositoryCount>0,"all approved public repositories synchronized");
ok(syncStatus.driftCount===0&&syncStatus.truncatedTreeCount===0,"sync reports no drift or truncated trees");
ok(syncStatus.stos?.state==="dormant"&&syncStatus.stos?.includedInPublicSync===false,"STOS remains excluded from public directory sync");
ok(visible.some(x=>x.id==="plera-haven"&&x.repository==="vervenveda/PLERA.github.io"&&x.type==="archive"&&x.category==="creative"),"PLERA Hope's Haven is approved as the public creative archive gateway");
ok(index.includes("VNV_DIRECTORY_AGI_SEED_V1"),"embedded v1 seed remains available only as fallback data");
ok(index.includes("./directory-agi-v1.1.js"),"Directory AGI loads the v1.1 runtime");
ok(index.includes("Reset Local Overlay")&&!index.includes("Reset Directory to Seed"),"UI resets only the local overlay");
ok(runtime.includes('const VERSION="1.1.0"'),"runtime reports Directory AGI v1.1.0");
ok(runtime.includes('CANONICAL_URL="/ecosystem/master-ecosystem-directory.json"'),"runtime reads the canonical registry");
ok(runtime.includes('source:"canonical-ecosystem"')&&runtime.includes('source:"local-external"'),"runtime separates canonical and local authority classes");
ok(runtime.includes("transactionalWrite")&&runtime.includes("writeRecovery")&&runtime.includes("readback verification failed"),"local writes are recovery-backed and readback-verified");
ok(runtime.includes("backupBytes:524288")&&runtime.includes("notes:500")&&runtime.includes("noteChars:4000"),"Cloud import and notes are bounded");
ok(runtime.includes('fetch(CANONICAL_URL')&&!runtime.includes("PUT")&&!runtime.includes("PATCH")&&!runtime.includes("POST"),"canonical registry synchronization is read-only");
ok(repoEvidence.schema==="verve-n-veda-visitor-directory","repositories.json is now genuine JSON evidence");
ok(auditEvidence.schema==="verve-n-veda-public-network-forensic-audit","directory-audit.json is now genuine JSON evidence");
if(failed)process.exit(1);
console.log("\nPASS Directory AGI / Mini Cloud v1.1 hardening contract.");
