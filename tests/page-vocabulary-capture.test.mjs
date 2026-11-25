import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../assets/vnv-language.js',import.meta.url),'utf8');
const capture=src.slice(src.indexOf('const PAGE_PAIRS_KEY='),src.indexOf('function shouldTranslateText('));
const ignore=src.match(/function ignored\(el\)\{[^]*?\n\}/)?.[0];
assert.ok(capture.includes('function rememberPagePair(')&&ignore);
function fixture({initial=null,fail=false,lang='fr'}={}){
 let value=initial,writes=0;
 const ctx={lang,normalize:s=>String(s).replace(/\s+/g,' ').trim(),
 location:{pathname:'/synthetic-public-page/'},
 localStorage:{getItem(){return value},setItem(k,v){assert.equal(k,'vnv_page_dictionary_candidates_v1');if(fail)throw Error('quota');value=v;writes++}}};
 const api=vm.runInNewContext(capture+'\n'+ignore+'\n({rememberPagePair,PAGE_PRIVATE_SELECTOR})',ctx);
 const element=({blocked='',surface=true}={})=>({closest(selector){
  if(blocked&&selector.split(',').includes(blocked))return this;
  return surface&&selector==='main,header,nav,footer,[role=\'main\']'?this:null;
 }});
 return {record:(a,b,opts)=>api.rememberPagePair(a,b,element(opts)),rows:()=>Object.values(JSON.parse(value||'{}')),writes:()=>writes};
}
test('exact words and phrases remain unreviewed, with distinct classification and page provenance',()=>{
 const f=fixture();f.record('apple','pomme');f.record('Open the book','Ouvrez le livre');
 const [word,phrase]=f.rows();assert.equal(word.kind,'word-candidate');assert.equal(phrase.kind,'contextual-phrase');
 for(const row of [word,phrase]){assert.equal(row.status,'unreviewed-page-translation');assert.equal(row.from,'en');assert.equal(row.to,'fr');assert.equal(row.page,'/synthetic-public-page/');assert.equal(row.sourceType,'public-rendered-text')}
});
test('marked private and ignored ancestors are excluded by the capture predicate',()=>{
 const f=fixture();
 for(const blocked of ['form','[contenteditable]','[data-private]','[data-learner]','[data-student]','[data-account]','[data-i18n-no-online]','#adminGate','[autocomplete]','dialog',"[role='dialog']",'[data-vnv-no-dictionary]','[data-i18n-ignore]','code','pre']){
  f.record('apple','pomme',{blocked});
 }
 f.record('apple','pomme',{surface:false});assert.equal(f.writes(),0);
});
test('source strings with obvious identifiers or invalid lengths are excluded',()=>{
 const f=fixture();
 for(const source of ['a@example.invalid','https://example.invalid','www.example.invalid','ID 123456','a','x'.repeat(281),'pomme'])f.record(source,'pomme');
 assert.equal(f.writes(),0);
});
test('identical observations do not churn storage; cap remains 900',()=>{
 const f=fixture();f.record('apple','pomme');f.record('apple','pomme');assert.equal(f.writes(),1);
 for(let i=0;i<901;i++)f.record('public phrase '+i,'phrase publique '+i);
 assert.equal(f.rows().length,900);assert.ok(!f.rows().some(r=>r.source==='apple'));
});
test('storage denial and malformed storage do not throw into page translation',()=>{
 for(const f of [fixture({fail:true}),fixture({initial:'not JSON'}),fixture({lang:'en'})]){
  assert.doesNotThrow(()=>f.record('apple','pomme'));assert.equal(f.writes(),0);
 }
});
test('capture is wired to translated text and not directly to a private writer',()=>{
 assert.match(src,/if\(replacement&&lang!=="en"&&replacement!==phrase\)rememberPagePair\(phrase,replacement,parent\)/);
 assert.doesNotMatch(capture,/fetch\(|XMLHttpRequest|KhaemenesVocabularyGitHubBridge|\.put\(/);
});
