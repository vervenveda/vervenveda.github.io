import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectBoth, TARGETS } from '../tools/account-cloud-source-caller.mjs';
const sha = 'a'.repeat(40);
const encode = s => Buffer.from(s).toString('base64');
function mockFetch(url, opts) {
  assert.equal(opts.method, 'GET');
  assert.equal(opts.redirect, 'error');
  assert.ok(url.startsWith('https://api.github.com/repos/'));
  const target = TARGETS.find(t => url.startsWith('https://api.github.com/repos/' + t.repo + '/'));
  assert.ok(target);
  let response;
  if (url.endsWith('/' + target.repo + '/')) response = {full_name:target.repo, default_branch:'main', private: target.name !== 'vnv', archived:false};
  else if (url.endsWith('/git/ref/heads/main')) response = {object:{sha}};
  else if (url.includes('/contents/')) {
    const content = 'synthetic static file';
    response = {type:'file',encoding:'base64',content:encode(content),size:Buffer.byteLength(content)};
  } else throw Error('unexpected_mock_url');
  return Promise.resolve({ok:true,json:async()=>response});
}
test('two pinned repository identities and only GET requests, no mutation', async()=>{
  const r=await inspectBoth({fetchImpl:mockFetch,env:{}});
  assert.equal(r.bothReadable,true);
  assert.equal(r.mode,'READ_ONLY_NO_SYNC');
  assert.equal(r.authorizedTransfer,false);
  assert.equal(r.accountCloudCommissioned,false);
  assert.equal(r.repositories.length,2);
  for (const item of r.repositories) {
    assert.equal(item.commit,sha);
    assert.equal(item.result,'READ_ONLY_VERIFIED');
    assert.equal(item.files.length,2);
    assert.ok(item.files.every(f=>/^[a-f0-9]{64}$/.test(f.sha256)));
  }
});
test('private repository denial blocks full verification without exposing response',async()=>{
  const r=await inspectBoth({fetchImpl:(url,opts)=>url.includes('KhaemenesAcademy')?Promise.resolve({ok:false,status:404}):mockFetch(url,opts),env:{}});
  assert.equal(r.bothReadable,false);
  assert.equal(r.repositories[1].result,'HOLD');
  assert.equal(r.repositories[1].reason,'access_or_resource_unavailable');
});
test('repository substitution is rejected',async()=>{
  const r=await inspectBoth({fetchImpl:async(url,opts)=>{
    const v=await mockFetch(url,opts);
    if (url.endsWith('/vervenveda/vervenveda.github.io/')) return {ok:true,json:async()=>({...await v.json(),full_name:'attacker/other'})};
    return v;
  },env:{}});
  assert.equal(r.bothReadable,false);
  assert.equal(r.repositories[0].reason,'repository_identity_mismatch');
});
test('non-file payload never enters the report',async()=>{
  const r=await inspectBoth({fetchImpl:async(url,opts)=>{
    if(url.includes('/contents/'))return {ok:true,json:async()=>({type:'dir',encoding:'base64',content:encode('secret'),size:6})};
    return mockFetch(url,opts);
  },env:{}});
  assert.equal(r.bothReadable,false);
  assert.ok(!JSON.stringify(r).includes('secret'));
});
