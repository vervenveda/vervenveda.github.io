#!/usr/bin/env node
/* Verve N Veda public translation integration inventory.
 * Run: node scripts/audit-translation-coverage.mjs [repository-directory]
 * Read-only; no network calls, student data access, or translation service.
 * Classifies integration, not semantic translation completeness.
 */
import fs from "node:fs";
import path from "node:path";
const root=path.resolve(process.argv[2]||".");
const skipped=new Set([".git","node_modules",".next","dist","build","coverage","vendor"]);
const files=[];
function walk(dir){
 for(const item of fs.readdirSync(dir,{withFileTypes:true})){
  if(item.isDirectory()){if(!skipped.has(item.name))walk(path.join(dir,item.name));}
  else if(item.isFile()&&/\.html?$/i.test(item.name))files.push(path.join(dir,item.name));
 }
}
walk(root);
function scriptsOf(html){
 const scripts=[];const re=/<script\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1[^>]*>/gi;let match;
 while((match=re.exec(html)))scripts.push(match[2]);
 return scripts;
}
function inspect(filename){
 const html=fs.readFileSync(filename,"utf8"),scripts=scriptsOf(html);
 const shared=scripts.some(x=>/\bvnv-language\.js(?:[?#]|$)/i.test(x));
 const partial=/\b(?:ARSHIFLanguage|ArcadeLanguage|PreschoolLanguage)\b|\b(?:arshif|arcade|preschool)-language-choice\b/i.test(html)||scripts.some(x=>/arshif-language\.js/i.test(x));
 const other=/\b(?:i18next|google_translate_element|data-i18n|languageSwitcher|translationDictionary)\b/i.test(html);
 const cls=shared?"shared-engine":partial?"curated-navigation-only":other?"other-integration-review":"not-detected";
 return {path:path.relative(root,filename).split(path.sep).join("/"),integration:cls,htmlLang:html.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)/i)?.[1]||null,hasForms:/<form\b/i.test(html),scripts:scripts.filter(s=>/language|translat|i18n/i.test(s)).slice(0,12)};
}
const rows=files.sort().map(inspect);
const counts=Object.fromEntries(["shared-engine","curated-navigation-only","other-integration-review","not-detected"].map(k=>[k,rows.filter(r=>r.integration===k).length]));
const result={schema:"vnv-public-translation-inventory",version:1,repository:path.basename(root),generatedAt:new Date().toISOString(),totalHtml:rows.length,counts,limitations:["HTML source inspection only; not a deployed-browser translation test","Shared engine presence does not prove all visible phrases have reviewed translations","Unrecognized custom translation systems may be marked not-detected","Forms and learner-sensitive areas require separate human privacy review"],pages:rows};
console.log(JSON.stringify(result,null,2));
