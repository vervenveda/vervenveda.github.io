/* Shared mentor feed vocabulary and export contract — no DOM dependencies. */
"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const api=require("../assets/vnv-mentor-chat-shell-v1.js");
test("ordinary social questions work while arbitrary messages remain with the mentor engine",()=>{
 for(const s of ["Hello!","HI","How are you?","What is a noun?","what is 2+2?",
  "who is noema","who is NAIB","do you learn from our conversations","thanks!"])
  assert.equal(typeof api.commonReply(s,"Zelle"),"string",s);
 for(const s of ["I feel like hurting myself","my password is test","unlock the math test",
 "hello and my student number is 1234","what is 5*992"])assert.equal(api.commonReply(s,"Zelle"),null);
});
test("each mentor keeps its own identity",()=>{
 assert.match(api.commonReply("Who are you?","Archaemenes"),/Archaemenes/);
 assert.match(api.commonReply("What is your name?","Pierre"),/Pierre/);
});
test("JSON and text exports include all supplied turns with timestamps and no silent learning",()=>{
 const messages=[
  {role:"user",timestamp:"2026-11-12T12:34:00.000Z",content:"Hello."},
  {role:"mentor",timestamp:"2026-11-12T12:34:01.000Z",content:"Hello!"},
  {role:"user",timestamp:"2026-11-12T12:35:00.000Z",content:"What is a noun?"}
 ];
 const data=JSON.parse(api.exportContent({mentorId:"pierre",mentorName:"Pierre",messages}));
 assert.equal(data.schema,"vnv-mentor-conversation-export-v1");
 assert.equal(data.messages.length,3);
 assert.equal(data.persistentMemory,false);assert.equal(data.autoTraining,false);
 assert.equal(data.messages[2].content,"What is a noun?");
 const txt=api.exportContent({mentorId:"pierre",mentorName:"Pierre",messages,format:"txt"});
 assert.match(txt,/What is a noun\?/);assert.match(txt,/Hello!/);
});
