import test from "node:test";
import assert from "node:assert/strict";
import {
  humanizePath,
  encodePath,
  inferCareerMetadata,
  mergeSupplementalResources
} from "../discovery/repository-file-discovery.js";

test("humanizePath creates readable labels",()=>{
  assert.equal(humanizePath("templates/cover-letter.html"),"Cover Letter");
  assert.equal(humanizePath("Protools/Evidence_Citation_Studio/index.html"),"Evidence Citation Studio");
});

test("encodePath safely encodes path segments",()=>{
  assert.equal(encodePath("Protools/Jenny's Tool.html"),"Protools/Jenny's%20Tool.html".replace("'","'"));
});

test("career metadata inference recognizes employment writing",()=>{
  const meta=inferCareerMetadata("Resume","templates/resume.html",{domains:["writing"],tags:[]});
  assert.ok(meta.skills.includes("career-readiness"));
  assert.ok(meta.domains.includes("employment"));
});

test("manifest/registry URL wins over supplemental duplicate",()=>{
  const existing=[{id:"manifest",url:"https://vervenveda.com/repo/tool.html"}];
  const supplemental=[
    {id:"supp",url:"https://vervenveda.com/repo/tool.html"},
    {id:"new",url:"https://vervenveda.com/repo/new.html"}
  ];
  const merged=mergeSupplementalResources(existing,supplemental);
  assert.equal(merged.length,2);
  assert.equal(merged.find(x=>x.url.endsWith("tool.html")).id,"manifest");
});
