import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  discoverRepositoryFiles,
  mergeSupplementalResources
} from "./repository-file-discovery.js";

const here=path.dirname(fileURLToPath(import.meta.url));
const mentorRoot=path.resolve(here,"..");
const policyPath=path.join(here,"supplemental-discovery-policy.json");
const resourcesPath=path.join(mentorRoot,"registry","ecosystem-resources.json");
const token=process.env.GITHUB_TOKEN||"";

const policy=JSON.parse(await fs.readFile(policyPath,"utf8"));
const registry=JSON.parse(await fs.readFile(resourcesPath,"utf8"));
const discovered=[];

for(const repoPolicy of (policy.repositories||[]).filter(x=>x.enabled!==false)){
  try{
    const rows=await discoverRepositoryFiles(repoPolicy,{token});
    discovered.push(...rows);
    console.log(`Supplemental discovery: ${repoPolicy.repository} -> ${rows.length} file resource(s).`);
  }catch(error){
    console.warn(`Supplemental discovery skipped ${repoPolicy.repository}: ${String(error?.message||error)}`);
  }
}

const merged=mergeSupplementalResources(registry.resources||[],discovered);
const existingCount=(registry.resources||[]).length;
const addedCount=merged.length-existingCount;

await fs.writeFile(resourcesPath,JSON.stringify({
  ...registry,
  supplementalDiscovery:{
    version:policy.version||1,
    generatedAt:new Date().toISOString(),
    discoveredCount:discovered.length,
    addedCount,
    policyRepositories:(policy.repositories||[]).filter(x=>x.enabled!==false).map(x=>x.repository)
  },
  resources:merged
},null,2)+"\n");

console.log(`Supplemental discovery inspected ${discovered.length} approved file resource(s).`);
console.log(`Supplemental discovery added ${addedCount} new resource(s) after manifest/url de-duplication.`);
