import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReconciliationManifest } from '../tools/account-cloud-reconcile-dry-run.mjs';
const sha='a'.repeat(40), digest='b'.repeat(64);
const mk=(target,repository,paths)=>({target,repository,branch:'main',commit:sha,result:'READ_ONLY_VERIFIED',files:paths.map(path=>({path,bytes:33,sha256:digest}))});
const valid=()=>({schema:'vnv-academy-source-caller-report-v1',mode:'READ_ONLY_NO_SYNC',bothReadable:true,authorizedTransfer:false,accountCloudCommissioned:false,repositories:[
  mk('vnv','vervenveda/vervenveda.github.io',['workflow/README.md','STOS_PUBLIC_BRIDGE.md']),
  mk('academy-account-cloud','KhaemenesAcademy/Account-Cloud.github.io',['STOS_INTAKE_MANIFEST.json','contracts/ACCOUNT_CLOUD_PROTOCOL_V2.md'])
]});
test('approved source inventory remains dry-run and cannot propose writes',()=>{
 const result=buildReconciliationManifest(valid());
 assert.equal(result.status,'SOURCE_INVENTORY_VERIFIED');
 assert.deepEqual(result.proposedWrites,[]);
 assert.equal(result.authorizedTransfer,false);
 assert.equal(result.accountCloudCommissioned,false);
 assert.equal(result.comparison.equivalentPathMappings,0);
 assert.equal(result.comparison.contentComparison,'NOT_APPLICABLE');
});
test('private read missing prevents source inventory acceptance',()=>{
 const x=valid();x.bothReadable=false;x.repositories[1].result='HOLD';
 assert.equal(buildReconciliationManifest(x).status,'HOLD');
});
test('relabelled repository or modified path rejected',()=>{
 const x=valid();x.repositories[1].repository='attacker/other';
 assert.equal(buildReconciliationManifest(x).reason,'untrusted_inventory');
 const y=valid();y.repositories[1].files[0].path='secrets.txt';
 assert.equal(buildReconciliationManifest(y).status,'HOLD');
});
test('invalid digest or extra file is rejected',()=>{
 const x=valid();x.repositories[0].files[0].sha256='invalid';
 assert.equal(buildReconciliationManifest(x).status,'HOLD');
 const y=valid();y.repositories[0].files.push({path:'extra',bytes:5,sha256:digest});
 assert.equal(buildReconciliationManifest(y).status,'HOLD');
});
test('untrusted state claiming transfer authority rejected',()=>{
 const x=valid();x.authorizedTransfer=true;
 assert.equal(buildReconciliationManifest(x).status,'HOLD');
});
