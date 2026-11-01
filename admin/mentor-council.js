/* Verve N Veda admin Mentor Council v1.
   Adds an inactive-admin-page panel only after the existing admin dashboard is displayed.
   Public vetted Q&A references, not live multi-model inference or privileged STOS delegation. */
(()=>{"use strict";
const mentors=[
{id:"naib",name:"NAIB",role:"Public Administrator",url:"https://artist1970.github.io/NAIB.github.io/",bank:"https://artist1970.github.io/NAIB.github.io/knowledge/public-guidance.v1.json",schema:"naib-public-guidance-v1"},
{id:"auren",name:"Auren",role:"Living Archive",url:"https://artist1970.github.io/Auren.github.io/",bank:"https://artist1970.github.io/Auren.github.io/knowledge/public-qa.v1.json",schema:"auren-public-knowledge-v1"},
{id:"pierre",name:"Pierre",role:"Linguistics",url:"https://artist1970.github.io/Pierre.gihub.io/",bank:"https://artist1970.github.io/Pierre.gihub.io/knowledge/public-qa.v1.json",schema:"pierre-public-knowledge-v1"},
{id:"eiren",name:"Eiren",role:"Literature",url:"https://artist1970.github.io/Eiren.github.io/"},
{id:"hope",name:"Hope",role:"Community Support",url:"https://artist1970.github.io/Hope.github.io/"},
{id:"archaemenes",name:"Archaemenes",role:"Education",url:"https://artist1970.github.io/Archaemenes.github.io/"},
{id:"zelle",name:"Zelle",role:"Visual Arts",url:"https://artist1970.github.io/Zelle.github.io/"},
{id:"moirai",name:"Moirai",role:"Music",url:"https://artist1970.github.io/Moirai.github.io/"},
{id:"arshif",name:"ARSHIF",role:"Library Steward",url:"https://vervenveda.com/"},
{id:"aurora",name:"Aurora",role:"Wellness Reflection",url:"https://artist1970.github.io/AuroraCore.github.io/"}
];
const doc=document;const nav=doc.querySelector(".nav[aria-label='Administration sections']"),main=doc.querySelector(".workspace main");if(!nav||!main)return;
const styles=doc.createElement("style");styles.textContent=`
#view-mentors .mentor-intro{color:var(--ink2);line-height:1.7;max-width:920px}
#view-mentors .mentor-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:14px;margin:19px 0 27px}
#view-mentors .mentor-card{border:1px solid var(--line2);background:var(--panel2);padding:17px;border-radius:9px;min-height:171px}
#view-mentors .mentor-card h3{font-family:var(--ceremonial);font-weight:400;color:var(--gold2);margin:0 0 5px}
#view-mentors .mentor-card p{color:var(--ink2);font-size:13px;margin:0 0 12px}
#view-mentors .mentor-card button,#view-mentors .mentor-card a,#view-mentors .mentor-actions button,#view-mentors .mentor-actions a{background:var(--gold2);color:#121923;border:1px solid var(--gold);padding:8px 12px;border-radius:7px;text-decoration:none;display:inline-flex;justify-content:center;align-items:center;min-height:39px;cursor:pointer;font:inherit;font-size:13px}
#view-mentors .mentor-actions{display:flex;gap:10px;flex-wrap:wrap}
#view-mentors .mentor-council{background:var(--panel);border:1px solid var(--line2);border-radius:9px;padding:20px}
#view-mentors .mentor-members{display:flex;flex-wrap:wrap;gap:11px;margin:16px 0}
#view-mentors .mentor-members label{display:flex;gap:6px;align-items:center;padding:7px 10px;background:var(--panel2);border:1px solid var(--line);border-radius:7px;color:var(--ink2)}
#view-mentors .mentor-members input{accent-color:var(--gold2)}
#view-mentors .mentor-log{height:330px;overflow:auto;border:1px solid var(--line2);background:var(--bg2);padding:13px;border-radius:7px;display:flex;flex-direction:column;gap:11px}
#view-mentors .mentor-bubble{max-width:94%;border:1px solid var(--line2);background:var(--panel3);padding:12px;border-radius:7px;white-space:pre-wrap;overflow-wrap:anywhere}
#view-mentors .mentor-bubble.owner{align-self:flex-end;background:var(--forest)}
#view-mentors .mentor-bubble strong{display:block;color:var(--gold2);font-size:12px;letter-spacing:.06em;margin-bottom:4px}
#view-mentors .mentor-compose{display:grid;gap:10px;margin-top:14px}
#view-mentors textarea{width:100%;min-height:86px;padding:12px;border-radius:7px;background:var(--bg2);border:1px solid var(--line2);color:var(--ink)}
#view-mentors .mentor-status{color:var(--gold2);font-size:13px;min-height:20px}
#mentor-modal{width:min(960px,95vw);height:min(790px,91vh);max-width:none;max-height:none;padding:0;border:1px solid #aa92ba;border-radius:9px;background:#111827;color:#f4eee4}
#mentor-modal::backdrop{background:rgba(0,0,0,.78)}
#mentor-modal .modal-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding:12px 16px;background:#242239}
#mentor-modal .modal-head a{color:#f5dba9}
#mentor-modal .modal-head button{background:#ead09e;color:#1a1a20;border:0;border-radius:7px;padding:9px 14px;cursor:pointer}
#mentor-modal iframe{display:block;border:0;width:100%;height:calc(100% - 104px);background:#fff}
#mentor-modal .modal-note{padding:7px 16px;font-size:12px;color:#e2d2e0}
@media(max-width:650px){#view-mentors .mentor-council{padding:12px}#view-mentors .mentor-log{height:280px}}
`;doc.head.append(styles);
const button=doc.createElement("button");button.className="nav-button";button.type="button";button.dataset.view="mentors";button.innerHTML='<span class="nav-icon" aria-hidden="true">✦</span><span class="nav-label">Mentor Council</span>';nav.append(button);
const panel=doc.createElement("section");panel.className="view";panel.dataset.viewPanel="mentors";panel.id="view-mentors";
panel.innerHTML='<div class="view-head"><div><p class="eyebrow">Specialist Conversation Studio</p><h1>Mentor Council</h1><p class="mentor-intro">Open each mentor’s public chat in a pop-up, or invite several specialists into one shared discussion. This first group room uses only approved public reference answers: it is not a live multi-agent AI service. Private memory, CORE records, and STOS authority remain disconnected.</p></div></div><div id="mentor-grid" class="mentor-grid"></div><div class="mentor-council"><h2>Master Conversation Room</h2><p class="mentor-intro">Select invited mentors below. Approved public knowledge answers may appear together in one threaded room. Mentors without a published knowledge bank are shown as unavailable in group mode; open their individual page for direct conversation.</p><div id="mentor-members" class="mentor-members" role="group" aria-label="Invite mentors"></div><div id="mentor-log" class="mentor-log" role="log" aria-label="Mentor council conversation" aria-live="polite"></div><div class="mentor-compose"><label for="mentor-question">Message to the council</label><textarea id="mentor-question" maxlength="900" placeholder="How should we preserve the history behind a collaborative painting?"></textarea><div class="mentor-actions"><button id="mentor-send" type="button">Ask selected mentors</button><button id="mentor-clear" type="button">Clear room</button><button id="mentor-export" type="button">Export transcript</button></div><p id="mentor-status" class="mentor-status" role="status">No conversation is transmitted to a server by the room itself. Approved knowledge files are fetched for replies.</p></div></div>';
main.append(panel);
const modal=doc.createElement("dialog");modal.id="mentor-modal";modal.innerHTML='<div class="modal-head"><strong id="mentor-modal-title">Mentor</strong><div><a id="mentor-modal-link" href="#" target="_blank" rel="noopener noreferrer">Open in new tab</a> <button id="mentor-modal-close" type="button">Close</button></div></div><p class="modal-note">Embedded website view · Some mentor sites may block embedding or need a new browser tab.</p><iframe id="mentor-frame" title="Selected mentor public page" referrerpolicy="no-referrer" loading="lazy"></iframe>';doc.body.append(modal);
const $=s=>doc.getElementById(s);let first=true,cache=new Map(),messages=[],lastFocus=null;
const cards=$("mentor-grid"),members=$("mentor-members");
for(const m of mentors){const card=doc.createElement("article");card.className="mentor-card";const h=doc.createElement("h3");h.textContent=m.name;const p=doc.createElement("p");p.textContent=m.role;const open=doc.createElement("button");open.type="button";open.textContent="Open chat";open.addEventListener("click",()=>openMentor(m));card.append(h,p,open);cards.append(card);
const label=doc.createElement("label");const check=doc.createElement("input");check.type="checkbox";check.value=m.id;check.checked=["auren","pierre","naib"].includes(m.id);const span=doc.createElement("span");span.textContent=m.name+(m.bank?"":" · individual only");label.append(check,span);members.append(label);}
function openMentor(m){lastFocus=doc.activeElement;$("mentor-modal-title").textContent=m.name+" · "+m.role;$("mentor-modal-link").href=m.url;$("mentor-frame").src=m.url;if(typeof modal.showModal==="function")modal.showModal();else window.open(m.url,"_blank","noopener");}
function close(){if(modal.open)modal.close();$("mentor-frame").removeAttribute("src");lastFocus?.focus?.();}
$("mentor-modal-close").addEventListener("click",close);modal.addEventListener("close",()=>{$("mentor-frame").removeAttribute("src");lastFocus?.focus?.();});modal.addEventListener("click",e=>{if(e.target===modal)close();});
button.addEventListener("click",()=>{if(typeof window.showView==="function")window.showView("mentors");else{doc.querySelectorAll("[data-view-panel]").forEach(x=>x.classList.toggle("active",x===panel));doc.querySelectorAll(".nav-button[data-view]").forEach(x=>x.classList.toggle("active",x===button));}const heading=$("topbarViewTitle");if(heading)heading.textContent="Mentor Council";if(first){first=false;append("Council","Choose mentors and ask a question. Public knowledge may be referenced; these are curated entries, not independent live AI responses.");}});
const ignored=new Set(["what","how","where","when","which","does","would","could","should","will","there","about","some","with","from","into","your","have","that","this","them","their","please","tell","want","know","need","like","the","and","for","you","are","can","who","why","our","all"]);
const words=s=>String(s||"").toLowerCase().normalize("NFKC").match(/[\p{L}\p{N}]+/gu)?.filter(w=>w.length>2&&!ignored.has(w))||[];
function match(question,records){const term=new Set(words(question));let best=null,bestScore=0,second=0;const nq=question.trim().toLowerCase();
for(const r of records){const title=String(r.question||"").toLowerCase(),tags=[...(r.keywords||[]),r.topic||""].map(x=>String(x).toLowerCase());let score=title===nq?100:0;const titleWords=new Set(words(title));for(const t of term){if(titleWords.has(t))score+=5;else if(tags.some(k=>words(k).includes(t)))score+=2;}for(const tag of tags)if(tag.length>=6&&nq.includes(tag))score+=7;if(score>bestScore){second=bestScore;bestScore=score;best=r;}else if(score>second)second=score;}
return best&&bestScore>=9&&(bestScore>=second+3||bestScore>=50)?best:null;}
async function getBank(m){if(!m.bank)return null;if(cache.has(m.id))return cache.get(m.id);const url=new URL(m.bank);if(url.protocol!=="https:"||url.hostname!=="artist1970.github.io")return null;const response=await fetch(url.href,{cache:"no-cache",credentials:"omit"});if(!response.ok)throw Error("knowledge unavailable");const data=await response.json();if(data.schema!==m.schema||!Array.isArray(data.records))throw Error("unexpected knowledge schema");const records=data.records.filter(r=>r&&["approved-public","approved-public-seed"].includes(r.status)&&typeof r.question==="string"&&typeof (r.answer||r.response)==="string").slice(0,900);cache.set(m.id,records);return records;}
function append(from,text,kind){const item={speaker:from,text,kind:kind||"reference"};messages.push(item);const box=doc.createElement("div");box.className="mentor-bubble"+(kind==="owner"?" owner":"");const label=doc.createElement("strong");label.textContent=from+(kind==="reference"?" · public reference":"");const p=doc.createElement("div");p.textContent=text;box.append(label,p);$("mentor-log").append(box);$("mentor-log").scrollTop=$("mentor-log").scrollHeight;}
let busy=false;
async function send(){if(busy)return;const input=$("mentor-question"),q=input.value.trim();if(!q)return;const invited=[...members.querySelectorAll("input:checked")].map(x=>mentors.find(m=>m.id===x.value)).filter(Boolean);if(!invited.length){$("mentor-status").textContent="Select at least one mentor.";return;}busy=true;$("mentor-send").disabled=true;append("You",q,"owner");input.value="";$("mentor-status").textContent="Checking approved public knowledge…";
for(const m of invited){if(!m.bank){append(m.name,"No approved public Q&A endpoint is connected to this council. Open my individual public page to use the available chat.","status");continue;}try{const bank=await getBank(m);const r=match(q,bank);append(m.name,r?String(r.answer||r.response):"I have no sufficiently close approved public answer for this question. Use my individual chat for more context.",r?"reference":"status");}catch{append(m.name,"The approved public knowledge file could not be loaded here; try my individual public page.","status");}}
$("mentor-status").textContent="Council replies are curated public references; no private memory or live AI inference was invoked.";busy=false;$("mentor-send").disabled=false;}
$("mentor-send").addEventListener("click",send);$("mentor-question").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}});
$("mentor-clear").addEventListener("click",()=>{messages=[];$("mentor-log").replaceChildren();$("mentor-status").textContent="Local room cleared.";});
$("mentor-export").addEventListener("click",()=>{const data={schema:"vnv-mentor-council-transcript-v1",kind:"curated-public-reference-room",exportedAt:new Date().toISOString(),messages};const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const link=doc.createElement("a");link.href=url;link.download="mentor-council-transcript.json";link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
})();
