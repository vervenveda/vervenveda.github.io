import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSourceSyncPreview } from '../tools/account-cloud-sync-preview.mjs';
const hash='b'.repeat(64), commit='a'.repeat(40);
const make=()=>({
 schema:'vnv-academy-source-reconciliation-v1',mode:'DRY_RUN_ONLY',status:'SOURCE_INVENTORY_VERIFIED',
 authorizedTransfer:false,accountCloudCommissioned:false,proposedWrites:[],
 repositories:[
  {target:'vnv',repository:'vervenveda/vervenveda.github.io',commit,files:['workflow/README.md','STOS_PUBLIC_BRIDGE.md'].map(path=>({path,bytes:12,sha256:hash}))},
  {target:'academy-account-cloud',repository:'KhaemenesAcademy/Account-Cloud.github.io',commit,files:['STOS_INTAKE_MANIFEST.json','contracts/ACCOUNT_CLOUD_PROTOCOL_V2.md'].map(path=>({path,bytes:22,sha256:hash}))}
 ]
});
test('four source files classified with owners but zero copies or transfers',()=>{
 const preview=buildSourceSyncPreview(make());
 assert.equal(preview.status,'REVIEW_READY');
 assert.equal(preview.summary.verifiedSourceItems,4);
 assert.equal(preview.summary.vnvOwned,2);
 assert.equal(preview.summary.academyOwned,2);
 assert.equal(preview.summary.candidateMirrors,0);
 assert.equal(preview.summary.approvedTransfers,0);
 assert.equal(preview.automatedSync,false);
 assert.equal(preview.transferAuthorized,false);
 assert.equal(preview.accountCloudCommissioned,false);
 assert.deepEqual(preview.proposedWrites,[]);
 assert.ok(preview.candidates.every(x=>x.copyApproved===false&&x.decision==='KEEP_SOURCE_ONLY'));
});
test('a proposed write invalidates the review',()=>{
 const m=make();m.proposedWrites.push({target:'private'});
 assert.equal(buildSourceSyncPreview(m).status,'HOLD');
});
test('incomplete or wrong repository is withheld',()=>{
 const m=make();m.repositories[1].target='other';
 assert.equal(buildSourceSyncPreview(m).status,'HOLD');
 const n=make();n.repositories.pop();
 assert.equal(buildSourceSyncPreview(n).status,'HOLD');
});
test('an extra source file, duplicate or unexpected path is withheld',()=>{
 const m=make();m.repositories[0].files[0].path='secrets.txt';
 assert.equal(buildSourceSyncPreview(m).status,'HOLD');
 const n=make();n.repositories[0].files[1].path=n.repositories[0].files[0].path;
 assert.equal(buildSourceSyncPreview(n).status,'HOLD');
});
test('invalid hash and claims of authorization are withheld',()=>{
 const m=make();m.repositories[1].files[1].sha256='not-a-hash';
 assert.equal(buildSourceSyncPreview(m).status,'HOLD');
 const n=make();n.authorizedTransfer=true;
 assert.equal(buildSourceSyncPreview(n).status,'HOLD');
});
test('no unverified reconciliation can produce a positive preview',()=>{
 assert.equal(buildSourceSyncPreview(null).status,'HOLD');
 const m=make();m.status='HOLD';
 assert.equal(buildSourceSyncPreview(m).status,'HOLD');
});
