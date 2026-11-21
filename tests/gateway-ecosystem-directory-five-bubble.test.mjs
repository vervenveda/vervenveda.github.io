import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const html=read('index.html');
const master=JSON.parse(read('ecosystem/master-ecosystem-directory.json'));
const directory=master.entries;
const ticker=read('assets/vnv-ticker-autopopulate.js');
const header=read('assets/vnv-header-autopopulate.js');
const language=read('assets/vnv-language.js');
const dock=read('assets/vnv-ecosystem-toolbar.js');
function fallbackSites(){
 const m=html.match(/let SITES = (\[[^\n]+\]);\s*\n\s*const GROUP_ORDER/);
 assert.ok(m,'emergency gateway site list must remain present');
 return JSON.parse(m[1]);
}
function fallbackDirectory(){
 const m=html.match(/let ECOSYSTEM_DIRECTORY = (\[[^\n]+\]);\s*\n/);
 assert.ok(m,'emergency category directory must remain present');
 return JSON.parse(m[1]);
}
const associations=directory.filter(e=>e.repository==='vervenveda/Khaemenes_HL_Associates-Level.github.io');
const eligible=e=>e.directoryVisible===true&&e.access==='free-public'&&e.status==='active';
const urls=directory.map(e=>e.url);
const ids=directory.map(e=>e.id);

test('Bubble 1: Associates-Level has exactly one public Education entry, separate from Higher Learning',()=>{
 assert.equal(associations.length,1);
 const a=associations[0];
 assert.equal(a.id,'higher-associates');
 assert.equal(a.type,'gateway');
 assert.equal(a.category,'education');
 assert.equal(a.url,'https://vervenveda.com/Khaemenes_HL_Associates-Level.github.io/');
 assert.equal(a.path,'index.html');
 assert.ok(eligible(a));
 assert.ok(directory.some(e=>e.id==='higher'&&e.repository==='vervenveda/Khaemenes_Higher_Learning.github.io'));
 const index=directory.findIndex(e=>e.id==='higher');
 assert.equal(directory[index+1].id,a.id);
});

test('Bubble 2: full canonical registry remains well-formed without duplicated IDs/URLs',()=>{
 assert.equal(master.entryCount,directory.length);
 assert.ok(directory.length>=197);
 assert.equal(new Set(ids).size,ids.length);
 assert.equal(new Set(urls).size,urls.length);
 for(const e of directory){
  assert.ok(e.id&&e.title&&e.repository&&e.path&&e.url,e.id);
  const u=new URL(e.url);
  assert.equal(u.protocol,'https:',e.id);
  assert.ok(['vervenveda.com','www.vervenveda.com','vervenveda.github.io','artist1970.github.io','jenniferpearl2028.github.io'].includes(u.hostname)||
    e.directoryVisible!==true||e.status!=='active',
    'inspect public domain in '+e.id);
 }
});

test('Bubble 3: canonical navigation with deliberate emergency fallback, not a second authority',()=>{
 assert.match(html,/const source="\/ecosystem\/master-ecosystem-directory\.json"/);
 assert.match(html,/fetch\(source,\{cache:"no-store",credentials:"same-origin"\}\)/);
 assert.match(html,/console\.warn\("Verve N Veda canonical directory fallback active:"/);
 const sites=fallbackSites(),categories=fallbackDirectory();
 assert.ok(sites.some(e=>e.title==='Khaemenes Academy'));
 assert.ok(categories.some(e=>e.id==='education'));
 assert.equal(new Set(sites.map(s=>s.url)).size,sites.length);
 // The legacy fallback deliberately stays smaller; report its coverage rather than
 // inventing entries or rewriting the frozen index.html.
 const fallbackTitles=new Map();
 for(const s of sites)fallbackTitles.set(s.title,(fallbackTitles.get(s.title)||0)+1);
 const report={
  canonicalEntries:directory.length,
  canonicalPublicEligible:directory.filter(eligible).length,
  emergencySites:sites.length,
  emergencyCategoryItems:categories.flatMap(c=>c.groups.flatMap(g=>g.items)).length,
  fallbackMissingAssociates:!sites.some(s=>s.url===associations[0].url),
  duplicateFallbackTitles:[...fallbackTitles].filter(([,n])=>n>1).map(([title])=>title)
 };
 console.log('VNV_DIRECTORY_PARITY_REPORT='+JSON.stringify(report));
});

test('Bubble 4: all seven stage main entrances and verified adult enrollment use the Academy canonical origin',()=>{
 const stages=['preschool','kinder','elementary','middle','high','higher','higher-associates'];
 const ids=[...stages,'academy-adult','higher-career'];
 const rows=ids.map(id=>{
  const e=directory.find(x=>x.id===id);
  assert.ok(e,'missing canonical Academy entry '+id);
  const url=new URL(e.url);
  assert.equal(url.origin,'https://vervenveda.com',id);
  assert.ok(url.pathname.startsWith('/Khaemenes_'),id);
  return {id,host:url.hostname};
 });
 console.log('VNV_ACADEMY_ORIGIN_AUDIT='+JSON.stringify({rows,originParity:'CANONICAL_PUBLIC_ENTRANCES',migratedRecords:0,liveStudentStorageReadback:'NOT_PERFORMED'}));
});
test('Legacy educational deep links remain an explicit audit HOLD, never an automatic data migration',()=>{
 const primary=new Set(['preschool','kinder','elementary','middle','high','higher','higher-associates','academy-adult','higher-career']);
 const older=directory.filter(e=>e.repository?.startsWith('vervenveda/Khaemenes_')&&!primary.has(e.id)&&new URL(e.url).hostname==='vervenveda.github.io');
 console.log('VNV_UNVERIFIED_DEEP_LINKS='+JSON.stringify({count:older.length,ids:older.map(x=>x.id),storageMigration:'NONE'}));
 assert.ok(!html.includes('localStorage.clear()'));
 assert.ok(!html.includes('sessionStorage.clear()'));
});

test('Bubble 5: gateway retains native ticker, header, hamburger, translator and tool owners',()=>{
 assert.equal((html.match(/id="networkTicker"/g)||[]).length,1);
 assert.equal((html.match(/class="site-header"/g)||[]).length,1);
 assert.equal((html.match(/id="menuButton"/g)||[]).length,1);
 assert.equal((html.match(/id="menuOverlay"/g)||[]).length,1);
 assert.equal((html.match(/id="vnv-language-rail"/g)||[]).length,1);
 assert.equal((html.match(/id="vnvGatewayAutoTickerSlot"/g)||[]).length,1);
 for(const src of ['/assets/vnv-ticker-autopopulate.js','/assets/vnv-class-tools-toolbar.js',
   'https://vervenveda.com/assets/vnv-ecosystem-toolbar.js'])
   assert.equal(html.split('src="'+src).length-1,1,src);
 assert.ok(html.includes('document.documentElement.dataset.vnvTickerGateway = "enabled"'));
 assert.match(html,/window\.VNVGatewayBootstrap\?\.mountTicker\(\)/);
 assert.match(html,/window\.VNVGatewayBootstrap=Object\.freeze\(\{version:"1\.0\.0",mountTicker,verify\}\)/);
 assert.match(html,/id="vnv-gateway-chrome-audit-optin"/);
 assert.match(html,/new URLSearchParams\(location\.search\)\.get\("chrome_audit"\)==="1"/);
 assert.match(ticker,/frozenGateway\(\)/);
 assert.match(header,/Header AutoPopulate/);
 assert.match(dock,/single-source ecosystem utility rail/);
});

test('Bubble 5 continued: menu and translator have distinct fallback owners',()=>{
 assert.match(html,/aria-controls="menuOverlay"/);
 assert.match(html,/function closeMenu\(restoreFocus = true\)/);
 assert.match(html,/id="menuSearch"/);
 assert.match(html,/id="closeMenu"/);
 assert.match(html,/khaemenes-translator-loader\.js\?v=1\.1\.1/);
 assert.match(html,/assets\/vnv-language\.js\?v=20261108-cream-buttons/);
 assert.match(html,/if\(!loader\?\.ensure\)return/);
 assert.match(html,/\.catch\(\(\)=>\{\}\)/);
 assert.match(language,/Page-local learner responses and admin inputs are excluded/);
 assert.match(html,/This convenience gate is not secure authentication/);
});
