import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const match=html.match(/async function fetchPublicRegistryJson\([\s\S]*?\n      \}\n/);
assert.ok(match,'bounded registry helper missing');

function helper(fetch){
 const ctx={fetch,AbortController,setTimeout,clearTimeout};
 return vm.runInNewContext(match[0]+'\nfetchPublicRegistryJson',ctx);
}
function untilAbort(signal){
 return new Promise((resolve,reject)=>{
  if(signal.aborted) reject(new Error('aborted'));
  else signal.addEventListener('abort',()=>reject(new Error('aborted')),{once:true});
 });
}

test('successful public JSON uses unchanged cache and credential policy',async()=>{
 let signal;
 const run=helper(async(path,options)=>{
  assert.equal(path,'/ecosystem/master-ecosystem-directory.json');
  assert.equal(options.cache,'no-store');
  assert.equal(options.credentials,'same-origin');
  signal=options.signal;
  return {ok:true,json:async()=>({entries:[]})};
 });
 const result=await run('/ecosystem/master-ecosystem-directory.json',30);
 assert.equal(result.entries.length,0);
 await new Promise(r=>setTimeout(r,40));
 assert.equal(signal.aborted,false,'completed request timer must be cleared');
});
test('stalled response headers abort',async()=>{
 const run=helper(async(path,{signal})=>untilAbort(signal));
 await assert.rejects(run('/registry/test.json',15),/aborted/);
});
test('stalled response body also aborts',async()=>{
 const run=helper(async(path,{signal})=>({ok:true,json:()=>untilAbort(signal)}));
 await assert.rejects(run('/registry/test.json',15),/aborted/);
});
test('HTTP and malformed body errors propagate to existing fallback',async()=>{
 await assert.rejects(helper(async()=>({ok:false,status:503}))('/registry/test.json',50),/HTTP 503/);
 await assert.rejects(helper(async()=>({ok:true,json:async()=>{throw Error('bad JSON')}}))('/registry/test.json',50),/bad JSON/);
});
test('only the existing directory and catalogue call sites use bounded requests',()=>{
 assert.match(html,/fetchPublicRegistryJson\(source, 8000\)/);
 assert.match(html,/fetchPublicRegistryJson\(url, 15000\)/);
 assert.match(html,/canonical directory fallback active/);
 assert.match(html,/catalog shards disagree on generation/);
 assert.match(html,/canonical catalog count mismatch/);
});
