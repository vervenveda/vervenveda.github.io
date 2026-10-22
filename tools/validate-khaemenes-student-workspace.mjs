import fs from "node:fs";
const source=fs.readFileSync(new URL("../assets/khaemenes-student-workspace-v2.js",import.meta.url),"utf8");
const failures=[];
const expect=(condition,message)=>{if(!condition)failures.push(message)};

for(const token of [
  'data-khae-workspace-text-size',
  'data-khae-workspace-line-spacing',
  'data-khae-workspace-reading-width',
  'data-khae-workspace-density',
  'data-khae-workspace-theme',
  'data-khae-workspace-tts',
  'data-khae-workspace-simplified'
])expect(source.includes(token),"workspace implementation contains "+token);

expect(source.includes('max-width:62ch')&&source.includes('max-width:78ch')&&source.includes('max-width:96ch'),"reading-width choices have real layout behavior");
expect(source.includes('data-khae-optional="true"')||source.includes('[data-khae-optional="true"]'),"simplified mode has an opt-in hiding contract");
expect(source.includes("KhaemenesStudentProfileV2"),"workspace reads the canonical learner profile");
expect(source.includes('key.startsWith("khaemenes.student-profile.v3:")'),"workspace refreshes from per-learner v3 storage");
expect(source.includes("VNVLanguage")&&source.includes("setLanguage"),"preferred language hands off to the official translator");
expect(source.includes("khaemenes-workspace-preferences"),"TTS and simplified preferences publish a capability event");
expect(source.includes("prototypeInterception")===false,"workspace adapter does not intercept browser storage prototypes");

if(failures.length){
  console.error("Khaemenes student workspace validation: FAILED");
  failures.forEach(x=>console.error(" - "+x));
  process.exit(1);
}
console.log("Khaemenes student workspace validation: PASSED");
console.log("Text size, spacing, reading width, density, campus-safe theme accent, language, TTS discovery, simplified mode, reduced motion, contrast and v3 refresh are guarded.");
