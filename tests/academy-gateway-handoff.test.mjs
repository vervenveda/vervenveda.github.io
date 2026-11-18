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

const FAMILY=CORE+"family/";
const STUDENT=CORE+"student/";
const ADULT=CORE+"adult/";
assert.ok(html.includes('id="vnvEnrolledStudentEntry" href="'+FAMILY+'"'),
 "Returning student doorway must fail safely to the Full Academy Family Portal");
assert.ok(html.includes('href="'+FAMILY+'#khaeFamilyParentProfileHero"'),
 "Returning family doorway must open Full Academy Family Portal");
assert.ok(html.includes('href="'+ADULT+'">Enrolled Adults Enter Here'),
 "Adult doorway must open Full Academy adult service");
assert.ok(html.includes('return A+"student/"'),
 "Non-high-school learners retain the Full Academy Student Portal route");
for(const url of [LANDING,FAMILY,STUDENT,ADULT]){
 const parsed=new URL(url);
 assert.equal(parsed.origin,"https://vervenveda.com",
   "Gateway public navigation must preserve the intended shared origin");
}
assert.ok(!html.includes('href="https://github.com/KhaemenesAcademy/KhaemenesAcademy.github.io"'),
 "Visitor navigation must not lead to the private Academy repository editor");
console.log("PASS: gateway Academy doors and enrolled learner fallback destinations");
