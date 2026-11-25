import test from 'node:test';
import assert from 'node:assert/strict';
import {readCandidates,buildExport} from '../vocabulary-review/export-contract.js';
const r={source:'apple',translation:'pomme',from:'en',to:'fr',status:'unreviewed-page-translation',sourceType:'public-rendered-text',page:'/public/'};
const raw=(x=r)=>JSON.stringify({[x.to+'|'+x.source]:x});
test('only explicit selection, no promotion or extra fields',()=>{
 const result=buildExport(raw({...r,approved:true,secret:'omit'}),[0],true);
 assert.equal(result.approvedForVault,false);assert.equal(result.reviewStatus,'unreviewed');assert.equal(result.entries[0].kind,'word-candidate');assert.ok(!('secret' in result.entries[0]));
});
test('reject invalid consent, duplicate indexes and out-of-range selection',()=>{
 for(const [ids,yes] of [[[0],false],[[],true],[[0,0],true],[[1],true]])assert.throws(()=>buildExport(raw(),ids,yes));
});
test('reject identifier on either side and private or ambiguous paths',()=>{
 for(const x of [{translation:'x@example.invalid'},{source:'ID 123456'},{page:'/student-profile/'},{page:'/admin/'},{page:'/a/../b'},{page:'/a?secret=1'},{page:'/a/%61dmin'},{to:'xx'},{status:'approved'}])assert.equal(readCandidates(raw({...r,...x})).length,0);
});
test('phrases remain contextual even when source is a word',()=>assert.equal(readCandidates(raw({...r,translation:'un fruit'}))[0].kind,'contextual-phrase'));
test('malformed input fails closed',()=>{for(const x of [null,'bad','[]','null','x'.repeat(2000001)])assert.deepEqual(readCandidates(x),[])});
