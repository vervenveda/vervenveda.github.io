import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewHandoffProposal,HANDOFF_CONTRACT_VERSION} from '../tools/account-cloud-handoff-review.mjs';
const proposal=()=>({
 requestId:'1'.repeat(32),
 contractVersion:'1.0.0',
 purpose:'SOURCE_PROVENANCE_REVIEW',
 callerRepository:'vervenveda/vervenveda.github.io',
 receiverRepository:'KhaemenesAcademy/Account-Cloud.github.io',
 sourceCommit:'a'.repeat(40),
 sourcePath:'STOS_PUBLIC_BRIDGE.md',
 sourceSha256:'b'.repeat(64),
 sourceBytes:679
});
test('well-formed source proposal is review-only and never authorized',()=>{
 const result=reviewHandoffProposal(proposal());
 assert.equal(HANDOFF_CONTRACT_VERSION,'1.0.0');
 assert.equal(result.status,'SHAPE_REVIEW_ONLY');
 assert.equal(result.authorized,false);
 assert.equal(result.transfer,false);
 assert.equal(result.accountCloudCommissioned,false);
 assert.deepEqual(result.writeActions,[]);
});
test('private record or secret-bearing extra field fails closed',()=>{
 for (const field of ['familyId','learnerId','session','cookie','token','payload','destinationPath','approve','metadata']) {
   const p=proposal();p[field]='synthetic';
   const result=reviewHandoffProposal(p);
   assert.equal(result.status,'HOLD',field);
   assert.equal(result.reason,'unapproved_fields',field);
   assert.ok(!JSON.stringify(result).includes('synthetic'));
 }
});
test('wrong caller, receiver, purpose or version fails closed',()=>{
 for(const [key,value] of [['callerRepository','unknown/other'],['receiverRepository','vervenveda/vervenveda.github.io'],
 ['purpose','ACCOUNT_WRITE'],['contractVersion','2.0.0'],['requestId','x']]){
   const p=proposal();p[key]=value;
   assert.equal(reviewHandoffProposal(p).status,'HOLD',key);
 }
});
test('unlisted paths and malformed hashes cannot obtain review status',()=>{
 for(const [key,value] of [['sourcePath','index.html'],['sourcePath','../../private'],
 ['sourceCommit','xyz'],['sourceSha256','bad'],['sourceBytes',512001],['sourceBytes',-1],
 ['sourceBytes','679']]){
   const p=proposal();p[key]=value;
   assert.equal(reviewHandoffProposal(p).status,'HOLD',key);
 }
});
test('null, array and class instances are rejected',()=>{
 for(const value of [null,[],new Date(),Object.create(null)]){
   assert.equal(reviewHandoffProposal(value).status,'HOLD');
 }
});
test('missing field is rejected',()=>{
 const p=proposal();delete p.requestId;
 assert.equal(reviewHandoffProposal(p).reason,'unapproved_fields');
});
test('second permitted source path remains review-only',()=>{
 const p=proposal();p.sourcePath='workflow/README.md';
 assert.equal(reviewHandoffProposal(p).status,'SHAPE_REVIEW_ONLY');
});
