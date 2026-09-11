import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const read=name=>JSON.parse(fs.readFileSync(path.join(here,name),"utf8"));
const taxonomy=read("curriculum-objective-taxonomy.json");
const overrides=read("resource-objective-overrides.json");
const anchors=read("curriculum-lesson-anchors.json");
const stageTargets=read("stage-subject-objectives.json");
const examples=read("curriculum-context-examples.json");

const code=fs.readFileSync(path.join(here,"resource-objective-mapper.js"),"utf8");
const sandbox={globalThis:{}};
vm.createContext(sandbox); vm.runInContext(code,sandbox);
const M=sandbox.globalThis.KhaemenesObjectiveMapper;
if(!M) throw new Error("Mapper did not load.");

const data={taxonomy,overrides,anchors,stageTargets,aliasIndex:M.buildAliasIndex(taxonomy)};
for(const ex of examples.examples){
  const ids=M.lessonObjectives(ex,data.aliasIndex,anchors.anchors,stageTargets);
  for(const wanted of ex.expected){
    if(!ids.includes(wanted)) throw new Error(`Example failed: ${ex.title} missing ${wanted}; got ${ids.join(", ")}`);
  }
}

const sample=[
 {id:"vervenveda.khaemenes_elementary.github.io.fraction-picnic",sourceId:"khaemenes.elementary",title:"Fraction Picnic",audiences:["elementary"],mentorEligible:true,recommendable:true,skills:["fractions","equivalence"],domains:["mathematics"]},
 {id:"vervenveda.arcade.github.io.sudoku",sourceId:"verve.arcade",title:"Jenny's Sudoku",audiences:["elementary","middle","high"],mentorEligible:true,recommendable:true,skills:["logic","number-reasoning"],domains:["games","logic"]},
 {id:"vervenveda.aurora.github.io.breath-reset",sourceId:"verve.aurora",title:"Breath Reset",audiences:["elementary","middle","high"],mentorEligible:true,recommendable:true,skills:["paced-breathing","pause"],domains:["wellness"]},
 {id:"vervenveda.proresource_hub.github.io.prose",sourceId:"verve.proresources",title:"PROSE™ Writing Studio",audiences:["high"],mentorEligible:true,recommendable:true,skills:["writing","editing"],domains:["writing"]},
 {id:"vervenveda.arshif.github.io.bible-history",sourceId:"verve.arshif",title:"Bible & History",audiences:["high"],mentorEligible:true,recommendable:true,requiresPreferenceMatch:["faith","biblical-study"],skills:["historical-context","reading"],domains:["history"]}
];

let r=M.rankResources(sample,{stage:"elementary",subjects:["mathematics"],title:"Equivalent Fractions and Visual Models",objective:"Identify equivalent fractions using visual models.",linkedLearner:true,preferences:[]},data,{max:10,minScore:1});
if(!r.length || r[0].resource.title!=="Fraction Picnic") throw new Error("Fraction Picnic should lead equivalent-fraction lesson.");
const sud=r.find(x=>x.resource.title.includes("Sudoku"));
if(sud && sud.canCountAsMasteryEvidence) throw new Error("Sudoku must not count as fraction mastery evidence.");

r=M.rankResources(sample,{stage:"high",subjects:["language-arts"],title:"Research Writing: Question to Thesis",objective:"Draft and revise a sourced argument.",linkedLearner:true,preferences:[]},data,{max:10,minScore:1});
if(!r.some(x=>x.resource.title.includes("PROSE"))) throw new Error("PROSE should support high-school writing.");

r=M.rankResources(sample,{stage:"high",subjects:["social-studies"],title:"Historical Context",objective:"Compare historical texts.",linkedLearner:true,preferences:[]},data,{max:10,minScore:1});
if(r.some(x=>x.resource.title==="Bible & History")) throw new Error("Faith resource leaked without preference.");

console.log(`PASS taxonomy=${taxonomy.objectives.length} overrides=${overrides.overrides.length} examples=${examples.examples.length}`);
