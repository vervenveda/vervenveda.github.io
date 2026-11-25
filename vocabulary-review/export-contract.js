/* Explicit local review/export only. No network, storage writes or publication. */
export const KEY="vnv_page_dictionary_candidates_v1";
export const LIMIT=900;
const LANGS=new Set(["es","fr","ar","zh","de","ru","pt","hi","ja","ko","it","bn"]);
const PRIVATE=/(?:^|\/)(?:admin|private|account|accounts|profile|student-profile|learner-profile|parent-profile|family|vault|cloud|stos|enrollment|assessment|assessments)(?:\/|$)/i;
const IDENTIFIER=/(?:https?:\/\/|www\.|@|\b\d{5,}\b)/i;
const WORD=/^[\p{L}\p{M}'’-]+$/u;
function textOK(v){return typeof v==="string"&&v.length>=2&&v.length<=280&&v===v.trim()&&/\p{L}/u.test(v)&&!IDENTIFIER.test(v)&&!/[\u0000-\u001f\u007f]/u.test(v)}
function pathOK(v){
 if(typeof v!=="string"||v.length>220||!/^\/(?!\/)[A-Za-z0-9._/-]*$/.test(v))return false;
 return !PRIVATE.test(v)&&!v.split("/").some(p=>p===".."||p==="."||p.startsWith("."));
}
export function readCandidates(raw){
 if(typeof raw!=="string"||raw.length>2000000)return [];
 let rows;try{rows=JSON.parse(raw)}catch{return []}
 if(!rows||typeof rows!=="object"||Array.isArray(rows))return [];
 const out=[];
 for(const [key,r] of Object.entries(rows).slice(-LIMIT)){
  if(!r||r.from!=="en"||!LANGS.has(r.to)||r.status!=="unreviewed-page-translation"||r.sourceType!=="public-rendered-text"||!textOK(r.source)||!textOK(r.translation)||r.source===r.translation||!pathOK(r.page)||key!==r.to+"|"+r.source)continue;
  const kind=WORD.test(r.source)&&WORD.test(r.translation)?"word-candidate":"contextual-phrase";
  out.push({source:r.source,translation:r.translation,from:"en",to:r.to,kind,status:"unreviewed-page-translation",sourceType:"public-rendered-text",page:r.page});
 }
 return out;
}
export function buildExport(raw,selected,confirmed){
 if(confirmed!==true||!Array.isArray(selected)||!selected.length||selected.length>LIMIT||new Set(selected).size!==selected.length)throw Error("Explicit selection and review required");
 const rows=readCandidates(raw);
 if(selected.some(i=>!Number.isInteger(i)||i<0||i>=rows.length))throw Error("Invalid selection");
 return {schema:"vnv-page-vocabulary-review-v1",reviewStatus:"unreviewed",approvedForVault:false,entries:selected.map(i=>rows[i])};
}
