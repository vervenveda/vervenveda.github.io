import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../assets/vnv-class-tools-toolbar.js',import.meta.url),'utf8');
function setup(fetch){
 let now=1000;
 const ctx={fetch,AbortController,setTimeout,clearTimeout,Date:{now:()=>now},console:{warn(){}},window:{},document:{readyState:'loading',addEventListener(){}}};
 vm.runInNewContext(src,ctx);
 return {api:ctx.window.VNVClassToolsToolbar,advance:ms=>now+=ms};
}
const valid={id:'tool',directoryVisible:true,access:'free-public',status:'active',url:'https://vervenveda.com/'};
const json=data=>({ok:true,json:async()=>data});
test('master first, secondary only on failure; successful reads shared',async()=>{
 const calls=[];
 const {api}=setup(async(url,opts)=>{
  calls.push(url);assert.equal(opts.credentials,'omit');assert.equal(opts.cache,'no-store');
  if(calls.length===1)throw Error('offline');
  return json({entries:[valid,{...valid,directoryVisible:false}]});
 });
 const results=await Promise.all([api.directory(),api.directory()]);
 assert.equal(results[0].length,1);assert.equal(results[1].length,1);
 assert.equal(calls.length,2);
 assert.match(calls[0],/^https:\/\/vervenveda\.com\//);
 assert.match(calls[1],/^https:\/\/khaemenesacademy\.github\.io\//);
 await api.directory();assert.equal(calls.length,2);
});
test('failed directory cache retries only after cooldown',async()=>{
 let calls=0;let online=false;
 const {api,advance}=setup(async()=>{calls++;if(!online)throw Error('offline');return json({entries:[valid]})});
 assert.equal((await api.directory()).length,0);assert.equal(calls,2);
 online=true;advance(29999);
 assert.equal((await api.directory()).length,0);assert.equal(calls,2);
 advance(1);assert.equal((await api.directory()).length,1);assert.equal(calls,3);
});
test('mathematics preserves archive source order and recovers after outage',async()=>{
 const calls=[];let online=false;
 const {api,advance}=setup(async(url)=>{calls.push(url);if(!online)throw Error('offline');return json({games:[{id:'g'}]})});
 assert.equal((await api.mathematicsArchive()).games.length,0);
 assert.match(calls[0],/^https:\/\/khaemenesacademy\.github\.io\//);
 assert.match(calls[1],/^https:\/\/vervenveda\.com\//);
 online=true;advance(30000);
 assert.equal((await api.mathematicsArchive()).games.length,1);assert.equal(calls.length,3);
});
test('request deadline covers stalled headers and body',async()=>{
 const match=src.match(/async function fetchPublicToolJson\([\s\S]*?\n\}\n/);
 assert.ok(match);
 const wait=signal=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(Error('aborted')),{once:true}));
 for(const fetch of [async(url,{signal})=>wait(signal),async(url,{signal})=>({ok:true,json:()=>wait(signal)})]){
  const run=vm.runInNewContext(match[0]+'\nfetchPublicToolJson',{fetch,AbortController,setTimeout,clearTimeout});
  await assert.rejects(run('https://vervenveda.com/',15),/aborted/);
 }
});
