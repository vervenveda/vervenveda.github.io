import fs from "node:fs";
import assert from "node:assert/strict";

const index=fs.readFileSync("index.html","utf8");
const academy="https://vervenveda.com/Khaemenes_Academy.github.io/";
const higher="https://vervenveda.com/Khaemenes_Higher_Learning.github.io/start/";

assert.ok(index.includes(academy),"Verve N Veda must enter Khaemenes Academy on the canonical shared origin.");
assert.ok(index.includes(higher),"Verve N Veda must enter Higher Learning through Scholar Entry on the canonical shared origin.");
assert.ok(!index.includes("https://vervenveda.github.io/Khaemenes_Academy.github.io/"),"Academy links must not split learner storage onto the github.io origin.");
assert.ok(!index.includes("https://vervenveda.github.io/Khaemenes_Higher_Learning.github.io/"),"Higher Learning links must not split learner storage onto the github.io origin.");

const higherOccurrences=(index.match(/https:\/\/vervenveda\.com\/Khaemenes_Higher_Learning\.github\.io\/start\//g)||[]).length;
assert.ok(higherOccurrences>=2,"Higher Learning should remain reachable from both the primary directory and Education directory.");

console.log("Verve N Veda → Khaemenes continuity: PASS");
