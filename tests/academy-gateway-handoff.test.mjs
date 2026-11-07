import assert from "node:assert/strict";
import fs from "node:fs";
const html=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");
const LANDING="https://vervenveda.com/KhaemenesAcademy_Home.github.io/";
const CORE="https://vervenveda.com/Khaemenes_Academy.github.io/";
const contexts=[
 'class="pillar-main-link" href="'+LANDING+'"',
 'class="network-count network-count-action" href="'+LANDING+'"',
 'class="feature-card feature-card-doorway" data-href="'+LANDING+'"',
 'href="'+LANDING+'">Begin Learning'
];
for(const text of contexts)assert.ok(html.includes(text),"Gateway Academy doorway missing: "+text);
assert.ok(html.includes('education:"'+LANDING+'"'),"Education directory hub must use Academy Home");
assert.ok(html.includes('const A="'+CORE+'"'),"Enrolled-student fallback must point to Academy Core");
assert.match(html,/if\(stage==="high"&&\[9,10,11,12\]\.includes\(n\)\)/,
 "High-school learner routing guard must remain explicit");
assert.match(html,/return A\+"student\/"/,"Other learners must retain Academy Student Portal fallback");
assert.match(html,/catch\{return A\+"family\/"\}/,"Invalid local learner data must fail closed to Family Portal");
console.log("PASS: gateway Academy doors and enrolled learner fallback destinations");
