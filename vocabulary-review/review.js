import {KEY,readCandidates,buildExport} from "./export-contract.js";
const $=id=>document.getElementById(id);
let raw="",rows=[],selected=new Set();
function update(){$("export").disabled=!selected.size||!$("confirm").checked;$("status").textContent=rows.length+" candidates available · "+selected.size+" selected";}
$("load").addEventListener("click",()=>{
 raw="";try{raw=localStorage.getItem(KEY)||""}catch{}
 rows=readCandidates(raw);selected.clear();$("confirm").checked=false;$("rows").replaceChildren();
 rows.forEach((r,i)=>{
  const label=document.createElement("label"),box=document.createElement("input"),copy=document.createElement("span");
  box.type="checkbox";copy.textContent=r.source+" → "+r.translation+" · "+r.to+" · "+r.kind+" · "+r.page;
  box.addEventListener("change",()=>{if(box.checked)selected.add(i);else selected.delete(i);$("confirm").checked=false;update()});
  label.append(box,copy);$("rows").append(label);
 });update();
});
$("confirm").addEventListener("change",update);
$("export").addEventListener("click",()=>{
 try{
  const data=buildExport(raw,[...selected],$("confirm").checked);
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
  const a=document.createElement("a");a.href=url;a.download="vnv-unreviewed-vocabulary.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  $("confirm").checked=false;update();
 }catch{$("status").textContent="Export refused. Reload and review the candidates."}
});
