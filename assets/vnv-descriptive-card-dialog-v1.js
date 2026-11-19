(()=>{"use strict";
const KEY="__VNV_DESCRIPTIVE_CARD_DIALOG_V1__";
if(window[KEY])return;
window[KEY]=true;

const SELECTOR="[data-vnv-descriptive-card]";
const STYLE_ID="vnvDescriptiveCardDialogStyle";
const DIALOG_ID="vnvDescriptiveCardDialog";

function textOf(el,sel){return (el.querySelector(sel)?.textContent||"").trim()}
function pageTitle(){return (document.querySelector("main h1")?.textContent||document.title||"Course").trim()}

function injectStyle(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement("style");
 s.id=STYLE_ID;
 s.textContent=`
  [data-vnv-descriptive-card]{position:relative}
  [data-vnv-descriptive-card] .vnv-card-info-action{
    min-height:44px;margin-top:16px;padding:9px 14px;border:1px solid #b48b45;border-radius:7px;
    background:#252b2b;color:#fff8e9;font:400 16px/1.3 "Brandon Grotesque","Avenir Next",Avenir,"Segoe UI",Arial,sans-serif;
    cursor:pointer
  }
  [data-vnv-descriptive-card] .vnv-card-info-action:hover{background:#1d2323}
  .vnv-descriptive-dialog{
    width:min(92vw,700px);max-height:min(86vh,760px);overflow:auto;padding:0;border:1px solid #b48b45;border-radius:7px;
    background:#fffaf0;color:#252b2b;box-shadow:0 24px 70px rgba(0,0,0,.32)
  }
  .vnv-descriptive-dialog::backdrop{background:rgba(20,22,21,.72)}
  .vnv-descriptive-dialog .vnv-dd-inner{padding:30px;text-align:left}
  .vnv-descriptive-dialog .vnv-dd-eyebrow{
    margin:0 0 8px;color:#5f6662;font:400 16px/1.3 "Brandon Grotesque","Avenir Next",Avenir,"Segoe UI",Arial,sans-serif;
    letter-spacing:.08em;text-transform:uppercase
  }
  .vnv-descriptive-dialog h2{
    margin:0;color:#252b2b;font:400 33px/1.2 Cinzel,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif
  }
  .vnv-descriptive-dialog .vnv-dd-status{margin:14px 0 0;color:#9a7438;font-size:18px}
  .vnv-descriptive-dialog .vnv-dd-body{margin-top:16px}
  .vnv-descriptive-dialog .vnv-dd-body p{margin:0 0 14px;color:#5f6662;font-size:17px;line-height:1.65}
  .vnv-descriptive-dialog .vnv-dd-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}
  .vnv-descriptive-dialog .vnv-dd-actions a,.vnv-descriptive-dialog .vnv-dd-actions button{
    min-height:48px;display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;border:1px solid #b48b45;
    border-radius:7px;background:#252b2b;color:#fff8e9;text-decoration:none;font:400 17px/1.3 "Brandon Grotesque","Avenir Next",Avenir,"Segoe UI",Arial,sans-serif;cursor:pointer
  }
  .vnv-descriptive-dialog .vnv-dd-actions .secondary{background:#f4f0e7;color:#252b2b}
  @media(max-width:520px){.vnv-descriptive-dialog .vnv-dd-inner{padding:22px}.vnv-descriptive-dialog h2{font-size:28px}}
  @media print{.vnv-card-info-action,.vnv-descriptive-dialog{display:none!important}}
 `;
 document.head.append(s);
}

function ensureDialog(){
 let d=document.getElementById(DIALOG_ID);
 if(d)return d;
 d=document.createElement("dialog");
 d.id=DIALOG_ID;
 d.className="vnv-descriptive-dialog";
 d.setAttribute("aria-labelledby","vnvDescriptiveDialogTitle");
 d.innerHTML=`
  <div class="vnv-dd-inner">
   <p class="vnv-dd-eyebrow" id="vnvDescriptiveDialogEyebrow">Course Feature</p>
   <h2 id="vnvDescriptiveDialogTitle">Course Information</h2>
   <p class="vnv-dd-status" id="vnvDescriptiveDialogStatus" hidden></p>
   <div class="vnv-dd-body" id="vnvDescriptiveDialogBody"></div>
   <div class="vnv-dd-actions" id="vnvDescriptiveDialogActions"></div>
  </div>`;
 d.addEventListener("click",e=>{if(e.target===d)d.close()});
 document.body.append(d);
 return d;
}

function openCard(card){
 const d=ensureDialog();
 const title=(card.dataset.vnvTitle||textOf(card,"strong,h3,h2")||"Course Information").trim();
 const summary=(card.dataset.vnvSummary||textOf(card,"span,p")).trim();
 const detail=(card.dataset.vnvDetail||"").trim();
 const status=(card.dataset.vnvStatus||"").trim();
 const eyebrow=(card.dataset.vnvEyebrow||"Course Feature").trim();
 const href=(card.dataset.vnvHref||"").trim();
 const actionLabel=(card.dataset.vnvActionLabel||"Open").trim();
 const context=(card.dataset.vnvContext||`This area is part of ${pageTitle()}. Related lessons, activities, assignments, and mastery evidence are accessed through the learner's class experience.`).trim();

 d.querySelector("#vnvDescriptiveDialogEyebrow").textContent=eyebrow;
 d.querySelector("#vnvDescriptiveDialogTitle").textContent=title;
 const statusEl=d.querySelector("#vnvDescriptiveDialogStatus");
 statusEl.textContent=status; statusEl.hidden=!status;

 const body=d.querySelector("#vnvDescriptiveDialogBody");
 body.replaceChildren();
 for(const txt of [summary,detail,context]){
   if(!txt)continue;
   const p=document.createElement("p");p.textContent=txt;body.append(p);
 }

 const actions=d.querySelector("#vnvDescriptiveDialogActions");
 actions.replaceChildren();
 if(href){
   const a=document.createElement("a");a.href=href;a.textContent=actionLabel;actions.append(a);
 }
 const close=document.createElement("button");
 close.type="button";close.className="secondary";close.textContent="Close";
 close.addEventListener("click",()=>d.close());
 actions.append(close);
 d.showModal();
}

function enhance(card){
 if(card.dataset.vnvDescriptiveBound==="true")return;
 card.dataset.vnvDescriptiveBound="true";
 let btn=card.querySelector(":scope > .vnv-card-info-action");
 if(!btn){
   btn=document.createElement("button");
   btn.type="button";
   btn.className="vnv-card-info-action";
   btn.textContent=card.dataset.vnvButtonLabel||"Learn More";
   card.append(btn);
 }
 btn.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();openCard(card)});
}

function scan(){injectStyle();document.querySelectorAll(SELECTOR).forEach(enhance)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",scan,{once:true});else scan();

const mo=new MutationObserver(()=>scan());
mo.observe(document.documentElement,{subtree:true,childList:true});
})();