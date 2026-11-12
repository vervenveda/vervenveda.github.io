/* VNV/KA Mentor Conversation Feed v1.0.0 · public browser UI only.
 * One shared standards-based renderer for existing mentor conversation pages.
 * Provides timestamped bubbles, scroll and local file export.
 * Never sends, stores or silently learns from visitor text.
 * Popup-aware: the page's official VNV toolbar is only suspended visually
 * while a nested chat popup is open. The underlying page retains it.
 */
(function(global){"use strict";
const COMMON=Object.freeze({
 "hello":"Hello! I'm here to explore questions and learning with you. What would you like to discuss?",
 "hi":"Hello! What would you like to explore together?",
 "hey":"Hello! What's on your mind?",
 "good morning":"Good morning! What would you like to learn today?",
 "good afternoon":"Good afternoon! What shall we explore?",
 "good evening":"Good evening! What would you like to discuss?",
 "how are you":"Thank you for asking. I'm a digital mentor, so I don't experience days as people do. How can I help you?",
 "who are you":"I'm a Khaemenes Academy digital mentor. I can offer curated guidance in my specialty, and I will tell you when I don't know an answer.",
 "what is your name":"I'm your selected Khaemenes Academy mentor. My name appears above this conversation.",
 "what can you do":"I can help with reviewed learning questions in my specialty, suggest practice activities and point you toward another mentor when a subject is outside my expertise. This public page is not an unrestricted AI model.",
 "can you remember me":"This public conversation stays on this page while it is open. You can export it to your own device, but I do not identify you or keep a permanent private student record here.",
 "do you remember me":"This public conversation does not verify your identity. You can export the visible messages, but previous private sessions are not automatically available.",
 "do you learn from our conversations":"I can use limited context during this session. I do not automatically train myself on your private messages. New public knowledge must be reviewed before it becomes part of my approved answers.",
 "are you chatgpt":"No. I'm a Khaemenes Academy mentor interface using reviewed local explanations and specialized teaching rules. This public chat is not ChatGPT.",
 "who is noema":"NOEMA is the Chancellor who governs the Academy's AI mentor system. Her public gateway does not provide administrative authority.",
 "who is naib":"NAIB is NOEMA's second-in-command and the AI mentor administrator. He organizes and coordinates the mentor system under the Chancellor.",
 "what is two plus two":"Two plus two equals four.",
 "what is 2+2":"2 + 2 = 4.",
 "what is 1+1":"1 + 1 = 2.",
 "what is a noun":"A noun names a person, place, thing or idea. For example: teacher, library, book or kindness.",
 "what is a verb":"A verb expresses an action or a state of being. For example: read, create, think and be.",
 "what is an adjective":"An adjective describes a noun, as in a colorful painting or a thoughtful question.",
 "what is photosynthesis":"Photosynthesis is the process by which plants use light energy, water and carbon dioxide to make sugars, releasing oxygen as a byproduct.",
 "how do i learn something new":"Start with one clear question. Read or observe a short example, try it yourself, explain what you understood, and revisit the difficult part.",
 "what is a fact":"A fact is a claim that can be checked against evidence. We should cite reliable sources and distinguish facts from interpretations.",
 "thank you":"You're welcome! Would you like another example or a different topic?",
 "thanks":"You're welcome! What would you like to explore next?",
 "goodbye":"Goodbye! You can export this conversation before leaving the page.",
 "bye":"Goodbye! Remember to save the conversation if you would like your own copy."
});
function normalize(x){return String(x||"").normalize("NFKC").trim().toLowerCase().replace(/[.!?。！？]+$/u,"").replace(/\s+/gu," ").trim();}
function commonReply(message,mentorName){
 const key=normalize(message);
 if(!Object.prototype.hasOwnProperty.call(COMMON,key))return null;
 const answer=COMMON[key];
 if(key==="who are you"||key==="what is your name")
  return answer.replace("your selected Khaemenes Academy mentor",mentorName||"your selected Khaemenes Academy mentor")
    .replace("I'm a Khaemenes Academy digital mentor","I'm "+(mentorName||"a Khaemenes Academy digital mentor")+", a Khaemenes Academy digital mentor");
 return answer;
}
/* Consent is explicit in the command, not inferred from conversation text.
 * Goal stays in RAM only, never in a shared knowledge bank or student cloud.
 */
function createSessionLearningMemory(){
 let goal="";
 const prohibited=/\b(?:password|passcode|private key|api key|token|secret|bank account|credit card|medical record|student id|student record|suicide|self-harm|diagnosis|address|phone number|birthdate)\b/i;
 return Object.freeze({
  canHandle(message){
   const q=normalize(message);
   return /^my learning goal is\b/.test(q)||/^what is my learning goal$/.test(q)||
     /^(?:forget|clear) my learning goal$/.test(q);
  },
  reply(message){
   const q=normalize(message);
   if(q==="what is my learning goal")
    return goal?"Your learning goal for this page is: "+goal+". You can change it or ask me to forget it.":
      "You haven't chosen a learning goal for this page. Say: My learning goal is to practice French.";
   if(/^(?:forget|clear) my learning goal$/.test(q)){
    goal="";return "I've cleared the learning goal from this page's temporary memory.";
   }
   const m=String(message||"").trim().match(/^my learning goal is\s+(.{5,150}?)\s*[.!?]*$/i);
   if(!m)return null;
   const proposed=m[1].trim().replace(/[.!?]+$/,"");
   if(prohibited.test(proposed)||/@|https?:\/\/|\b\d{5,}\b/i.test(proposed))
    return "Please choose a general, non-personal learning goal. I won't remember private identifying or sensitive details in this public demo.";
   goal=proposed.slice(0,120);
   return "I'll keep this learning goal while this page is open: "+goal+". It won't be automatically uploaded, used for training, or saved after you leave.";
  },
  clear(){goal="";},
  snapshot(){return goal;}
 });
}
const exportSchema="vnv-mentor-conversation-export-v1";
function cleanText(x){return String(x||"").replace(/\r\n?/g,"\n").trim();}
function exportContent({mentorId,mentorName,messages,format="json",page=""}){
 const data={
  schema:exportSchema,version:1,
  mentorId,mentorName,page,exportedAt:new Date().toISOString(),
  source:"visitor-explicit-download",
  persistentMemory:false,autoTraining:false,
  messages:messages.map(m=>({role:m.role==="user"?"user":"mentor",
   timestamp:m.timestamp,content:cleanText(m.content)}))
 };
 if(format==="json")return JSON.stringify(data,null,2)+"\n";
 const lines=[
  "Verve N Veda / Khaemenes Academy — Conversation Export",
  "Mentor: "+mentorName,
  "Exported: "+data.exportedAt,
  "Saved by the visitor; not automatically uploaded or learned.",
  ""
 ];
 for(const msg of data.messages){
  const stamp=new Date(msg.timestamp);
  const when=Number.isFinite(stamp.getTime())?stamp.toLocaleString():msg.timestamp;
  lines.push("["+when+"] "+(msg.role==="user"?"You":mentorName)+":");
  lines.push(msg.content,"");
 }
 return lines.join("\n");
}
const api=Object.freeze({version:"1.1.0",normalize,commonReply,createSessionLearningMemory,exportContent,exportSchema});
global.VNVMentorConversationFeed=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
if(!global.document)return;
const script=document.currentScript,opts=script?.dataset;
if(!opts?.mentorId||!opts?.chatInput||!opts?.chatRoot||!opts?.chatSend)return;
function boot(){
 const root=document.querySelector(opts.chatRoot),input=document.querySelector(opts.chatInput),
  send=document.querySelector(opts.chatSend),clear=opts.chatClear?document.querySelector(opts.chatClear):null;
 if(!root||!input||!send)return;
 let log=opts.chatLog?document.querySelector(opts.chatLog):null;
 const singleSource=opts.chatAnswer?document.querySelector(opts.chatAnswer):null;
 const single=Boolean(singleSource);
 const name=opts.mentorName||opts.mentorId;
 const sessionMemory=createSessionLearningMemory();
 if(single){
  log=document.createElement("div");
  log.setAttribute("role","log");log.setAttribute("aria-live","polite");
  log.setAttribute("aria-label","Conversation with "+name);
  singleSource.parentNode.insertBefore(log,singleSource);
  singleSource.setAttribute("data-vnv-source-answer","");
  singleSource.setAttribute("aria-hidden","true");
  singleSource.setAttribute("role","presentation");
 }
 if(!log)return;
 log.classList.add("vnv-mentor-message-feed");
 log.setAttribute("tabindex","0");
 if(!log.hasAttribute("role"))log.setAttribute("role","log");
 const uiStyle=document.createElement("style");uiStyle.id="vnv-mentor-chat-feed-v1-styles";
 uiStyle.textContent=[
 ".vnv-mentor-message-feed{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:12px!important;min-height:260px!important;height:clamp(300px,48vh,540px)!important;max-height:540px!important;overflow-y:auto!important;overscroll-behavior:contain;padding:18px!important;border:1px solid #b8a57d!important;border-radius:7px!important;background:#fbf7ef!important;color:#27302b!important;scroll-behavior:smooth}",
 ".vnv-mentor-message-feed>*{box-sizing:border-box;align-self:flex-start;max-width:min(95%,700px)!important;min-width:0;overflow-wrap:anywhere;white-space:pre-wrap;border-radius:7px!important;background:#eee6d6!important;border:1px solid #c8b99b!important;color:#222e29!important;padding:12px 14px!important;margin:0!important;font:400 16px/1.55 Nunito,'Brandon Grotesque',Arial,sans-serif!important}",
 ".vnv-mentor-message-feed>[data-vnv-role='user']{align-self:flex-end!important;background:#29473f!important;color:#fff8eb!important;border-color:#29473f!important;text-align:left!important}",
 ".vnv-mentor-message-feed [data-vnv-role='user'] strong,.vnv-mentor-message-feed>[data-vnv-role='user'] strong{color:#fff8eb!important}",
 ".vnv-mentor-turn-time{display:block!important;font:400 16px/1.4 Nunito,Arial,sans-serif!important;opacity:.81;text-align:right;margin-top:8px;white-space:nowrap}",
 ".vnv-mentor-feed-tools{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px;padding:10px 0 14px;font:400 16px/1.4 Nunito,Arial,sans-serif}",
 ".vnv-mentor-feed-tools button{border-radius:7px!important;border:1px solid #9d804e!important;padding:10px 13px!important;min-height:44px!important;background:#273b34!important;color:#fff8e9!important;font:400 16px/1.4 Nunito,Arial,sans-serif!important;cursor:pointer!important}",
 ".vnv-mentor-feed-tools button:hover{background:#425c4f!important}",
 ".vnv-mentor-feed-tools p{flex-basis:100%;margin:0;text-align:center;font:400 16px/1.4 Nunito,Arial,sans-serif;color:inherit}",
 ".vnv-mentor-feedback{max-width:900px;margin:8px auto 18px;border:1px solid #aa925e;border-radius:7px;padding:12px;background:#f9f4e9;color:#27352d;font:400 16px/1.5 Nunito,Arial,sans-serif}",
 ".vnv-mentor-feedback summary{cursor:pointer;font:400 18px/1.5 Cinzel,Georgia,serif}",
 ".vnv-mentor-feedback textarea{display:block;width:100%;min-height:74px;resize:vertical;margin:9px 0;padding:12px;background:#fffdf7;color:#24322a;border:1px solid #a38e65;border-radius:7px;font:400 16px/1.5 Nunito,Arial,sans-serif}",
 ".vnv-mentor-feedback button{border-radius:7px;border:1px solid #9d804e;background:#263e35;color:#fff8ec;font:400 16px/1.4 Nunito,Arial,sans-serif;min-height:44px;padding:10px 12px;margin:6px}",
 "[data-vnv-source-answer]{display:none!important}",
 "body:is(.vnv-mentor-popup-open,.vnv-mentor-chat-focused) #vnvEcosystemUtilityDock,body:is(.vnv-mentor-popup-open,.vnv-mentor-chat-focused) #vnvEcosystemToolbar,body:is(.vnv-mentor-popup-open,.vnv-mentor-chat-focused) .vnv-ecosystem-utility-dock{visibility:hidden!important;pointer-events:none!important}"
 ].join("\n");
 document.head.appendChild(uiStyle);
 const toolbar=document.createElement("div");toolbar.className="vnv-mentor-feed-tools";
 toolbar.setAttribute("aria-label","Conversation export controls");
 for(const kind of ["txt","json"]){
  const btn=document.createElement("button");btn.type="button";
  btn.textContent=kind==="txt"?"Save conversation (.txt)":"Export conversation (.json)";
  btn.addEventListener("click",()=>save(kind));
  toolbar.appendChild(btn);
 }
 /* Suggested improvements are local, unapproved drafts; NEVER self-training.
  * The visitor must explicitly download a JSON for human editorial review.
  * Sensitive / student companion pages intentionally have no feedback intake.
  */
 const suggestions=[];
 if(!["hope","aurora","klasaipeer"].includes(opts.mentorId)){
  const details=document.createElement("details");
  details.className="vnv-mentor-feedback";
  const summary=document.createElement("summary");
  summary.textContent="Suggest a better answer (optional, human review)";
  const explain=document.createElement("p");
  explain.textContent="Public educational facts only. Do not enter names, accounts, private experiences, grades, health details or student records. Suggestions are not automatically learned or uploaded.";
  const q=document.createElement("textarea"),a=document.createElement("textarea");
  q.setAttribute("aria-label","Public learning question to improve");
  q.placeholder="Public learning question";q.maxLength=300;
  a.setAttribute("aria-label","Proposed better answer");
  a.placeholder="Proposed better answer, with a publicly checkable source if possible";
  a.maxLength=1200;
  const add=document.createElement("button");add.type="button";add.textContent="Add local review suggestion";
  const exportSuggestions=document.createElement("button");exportSuggestions.type="button";
  exportSuggestions.textContent="Export suggestions for human review";
  const clearSuggestions=document.createElement("button");clearSuggestions.type="button";
  clearSuggestions.textContent="Delete local suggestions";
  const note=document.createElement("p");note.setAttribute("role","status");
  note.textContent="Suggestions remain in temporary page memory until you export or delete them.";
  const prohibited=/\b(?:password|passcode|secret|api key|private key|access token|student|learner record|grade|account|medical|health|diagnosis|suicide|self-harm|home address|phone number|credit card)\b|@|https?:\/\/[^\s]*@|\b\d{5,}\b/i;
  add.addEventListener("click",()=>{
   const question=q.value.trim(),answer=a.value.trim();
   if(question.length<8||answer.length<20||prohibited.test(question)||prohibited.test(answer)||
     suggestions.length>=20){
    note.textContent="Only non-personal educational corrections (8–300 character question, 20–1200 character answer) are accepted here. Maximum 20 drafts.";
    return;
   }
   suggestions.push(Object.freeze({schema:"vnv-unverified-public-mentor-suggestion-v1",
    mentorId:opts.mentorId,question,proposedAnswer:answer,
    reviewState:"needs-human-verification",submittedAt:new Date().toISOString()}));
   q.value="";a.value="";
   note.textContent=suggestions.length+" unverified suggestion(s) in temporary memory. Export for a reviewer; the mentor has not learned them.";
  });
  exportSuggestions.addEventListener("click",()=>{
   if(!suggestions.length){note.textContent="No suggestions to export.";return;}
   const payload=JSON.stringify({
    schema:"vnv-unverified-public-knowledge-review-bundle-v1",
    trainingApplied:false,published:false,containsOnlyVisitorProposals:true,
    suggestions
   },null,2)+"\n";
   const url=URL.createObjectURL(new Blob([payload],{type:"application/json;charset=utf-8"}));
   const link=document.createElement("a");link.href=url;
   link.download="vnv-"+opts.mentorId+"-unverified-suggestions.json";
   document.body.appendChild(link);link.click();link.remove();
   setTimeout(()=>URL.revokeObjectURL(url),2000);
   note.textContent="Export initiated. A human reviewer must verify sources and approve any future knowledge update.";
  });
  clearSuggestions.addEventListener("click",()=>{
   suggestions.length=0;q.value="";a.value="";note.textContent="Temporary suggestions deleted.";
  });
  details.append(summary,explain,q,a,add,exportSuggestions,clearSuggestions,note);
  toolbar.insertAdjacentElement("afterend",details);
 }
 const hint=document.createElement("p");
 hint.textContent="Save a complete copy to your device or preferred drive. No messages are uploaded or used for automatic training.";
 toolbar.appendChild(hint);
 log.insertAdjacentElement("afterend",toolbar);
 function roleOf(node){
  const value=String(node.dataset.speaker||"").toLowerCase();
  if(["you","user","student","visitor"].includes(value))return "user";
  const className=typeof node.className==="string"?node.className.toLowerCase():"";
  if(/(?:^|[- _])(you|user)(?:$|[- _])/.test(className)||/\beiren-message-student\b/.test(className))return "user";
  const label=node.querySelector("strong,.speaker,.naib-speaker");
  return /^you\b|^visitor\b|^student\b/i.test(label?.textContent?.trim()||"")?"user":"mentor";
 }
 function timestampNode(node){
  if(node.nodeType!==1||node.hasAttribute("data-vnv-time"))return;
  const now=new Date().toISOString();const role=roleOf(node);
  node.dataset.vnvRole=role;node.dataset.vnvTime=now;
  const time=document.createElement("time");time.className="vnv-mentor-turn-time";
  time.dateTime=now;time.textContent=new Date(now).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});
  node.appendChild(time);
 }
 function allRows(){for(const child of Array.from(log.children))timestampNode(child);}
 function messages(){
  allRows();
  return Array.from(log.children).filter(x=>x.dataset.vnvTime).map(node=>{
   const cloned=node.cloneNode(true);
   cloned.querySelectorAll(".vnv-mentor-turn-time,button,input,select,textarea,[data-vnv-skip-export]").forEach(x=>x.remove());
   const content=cleanText(cloned.textContent||"").replace(/^(?:you|visitor|student|[a-z][\w -]{0,28}):\s*/i,"");
   return {role:node.dataset.vnvRole||"mentor",timestamp:node.dataset.vnvTime,content};
  }).filter(x=>x.content);
 }
 function save(format){
  const rows=messages();
  if(!rows.length){hint.textContent="The conversation is empty. Ask a question before saving.";return;}
  const data=exportContent({
   mentorId:opts.mentorId,mentorName:name,messages:rows,format,page:location.origin+location.pathname
  });
  const type=format==="json"?"application/json":"text/plain";
  const file=new Blob([data],{type:type+";charset=utf-8"});
  const url=URL.createObjectURL(file);
  const anchor=document.createElement("a");
  anchor.href=url;anchor.download="vnv-"+opts.mentorId+"-conversation-"+new Date().toISOString().slice(0,10)+"."+format;
  document.body.appendChild(anchor);anchor.click();anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
  hint.textContent="Save initiated. Choose your device's Downloads, iCloud Drive, Google Drive, or another folder in your browser's save dialog.";
 }
 const observer=new MutationObserver(()=>{allRows();log.scrollTop=log.scrollHeight;});
 observer.observe(log,{childList:true});
 allRows();
 let pending=null;
 function add(role,text){
  const div=document.createElement("div");
  div.dataset.vnvRole=role;div.dataset.speaker=role==="user"?"you":name;
  const h=document.createElement("strong");h.textContent=role==="user"?"You":name;
  const p=document.createElement("p");p.textContent=text;
  div.append(h,p);log.appendChild(div);timestampNode(div);log.scrollTop=log.scrollHeight;
 }
 function completeSingle(){
  if(!single||!pending)return;
  const newAnswer=cleanText(singleSource.textContent);
  if(!newAnswer)return;
  pending=null;add("mentor",newAnswer);
 }
 if(single){
  const answerObserver=new MutationObserver(()=>queueMicrotask(completeSingle));
  answerObserver.observe(singleSource,{childList:true,subtree:true,characterData:true});
 }
 function commonAnswer(){
  const q=String(input.value||"").trim();
  return q?(sessionMemory.reply(q)||commonReply(q,name)):null;
 }
 function handleSend(event){
  if(input.disabled||send.disabled)return;
  const q=String(input.value||"").trim();
  if(!q)return;
  const shared=commonAnswer();
  if(shared){
   event.preventDefault();event.stopImmediatePropagation();
   if(single)pending=null;
   add("user",q);add("mentor",shared);
   input.value="";input.focus();return;
  }
  if(single){
   pending={q};add("user",q);
   setTimeout(completeSingle,50);
  }
 }
 document.addEventListener("click",ev=>{
  if(send===ev.target||send.contains(ev.target))handleSend(ev);
 },true);
 if(send.form){
  send.form.addEventListener("submit",ev=>handleSend(ev),true);
 }
 input.addEventListener("keydown",ev=>{
  if(ev.key==="Enter"&&!ev.shiftKey&&!ev.isComposing) {
   const q=String(input.value||"").trim();
   const known=sessionMemory.canHandle(q)||Boolean(commonReply(q,name));
   if(known)handleSend(ev);
   else if(single){ // Original engine handles enter if it supports it.
     // Single-answer controls do not implement Enter; submit ourselves.
     ev.preventDefault();
     send.click();
   }
  }
 },true);
 if(clear){
  clear.addEventListener("click",()=>{
   pending=null;sessionMemory.clear();
   if(single)setTimeout(()=>{log.replaceChildren();},0);
   hint.textContent="Conversation cleared. Previous turns are no longer included in exports.";
  },true);
 }
 /* The toolbar remains on the underlying page, but never intercepts a
  * student's typing or keyboard focus in the chat composer. */
 const setFocus=()=>document.body.classList.add("vnv-mentor-chat-focused");
 const clearFocus=()=>queueMicrotask(()=>{
  if(document.activeElement!==input&&document.activeElement!==log)
   document.body.classList.remove("vnv-mentor-chat-focused");
 });
 input.addEventListener("focus",setFocus);
 input.addEventListener("blur",clearFocus);
 log.addEventListener("focusin",setFocus);
 log.addEventListener("focusout",clearFocus);
 const popup=root.closest("dialog,[role='dialog'],.modal,.popup,[data-feature]");
 if(popup){
  const state=()=>{
   const visible=!popup.hidden&&popup.getAttribute("aria-hidden")!=="true"&&
     getComputedStyle(popup).display!=="none";
   document.body.classList.toggle("vnv-mentor-popup-open",visible);
  };
  new MutationObserver(state).observe(popup,{attributes:true,attributeFilter:["hidden","aria-hidden","style","class"]});
  state();
 }
 global.addEventListener("pagehide",()=>{document.body.classList.remove("vnv-mentor-popup-open","vnv-mentor-chat-focused");observer.disconnect();});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
else boot();
})(typeof window!=="undefined"?window:globalThis);
