import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const script=fs.readFileSync("assets/vnv-external-landing.js","utf8");
const css=fs.readFileSync("assets/vnv-external-landing.css","utf8");
assert.match(script,/data-vnv-outer-landing|vnvOuterLanding/);
assert.doesNotMatch(script,/\b(?:localStorage|sessionStorage)\s*(?:\.|\[)/,"No browser storage APIs may be accessed");
assert.match(css,/#vnvBetaProgramLink/,"Existing floating Beta controls suppressed on opted-in pages");
assert.match(css,/\[style\*="position:fixed"\]/,"Existing fixed manual Beta links suppressed");
assert.match(css,/@media\(max-width:590px\)/,"Narrow phones have responsive layout");
assert.match(css,/@media\(max-width:320px\)/,"255px-class devices have a two-column fallback");
assert.match(css,/white-space:nowrap!important/,"Toolbar labels must not wrap");

class FakeElement {
  constructor(tag){
    this.tagName=tag.toUpperCase();this.children=[];this.attrs={};
    this.listeners={};this.open=false;
  }
  setAttribute(name,value){this.attrs[name]=String(value);if(name==="id")this.id=String(value);}
  getAttribute(name){return this.attrs[name]||null;}
  append(...nodes){this.children.push(...nodes);}
  addEventListener(name,fn){this.listeners[name]=fn;}
  showModal(){this.open=true;}
  close(){this.open=false;}
}
const body=new FakeElement("body");body.dataset={vnvOuterLanding:"true"};
const walk=(node,id)=>node.id===id?node:node.children.map(child=>walk(child,id)).find(Boolean);
const document={
  body,readyState:"complete",
  createElement:tag=>new FakeElement(tag),
  getElementById:id=>walk(body,id)
};
const win={location:{assign(url){throw Error("Unexpected navigation "+url)}}};
vm.runInNewContext(script,{document,window:win},{filename:"assets/vnv-external-landing.js",timeout:1500});
const dock=document.getElementById("vnvExternalLandingDock");
assert.ok(dock,"Opted-in pages get one toolbar");
assert.equal(dock.children.length,5,"Exactly five buttons/links");
assert.deepEqual(dock.children.map(x=>x.getAttribute("data-vnv-tool")),["search","updates","mentor","contribute","beta"]);
assert.equal(dock.children[0].getAttribute("href"),"https://vervenveda.com/PLERASearch.github.io/");
assert.equal(dock.children[2].getAttribute("href"),"https://vervenveda.com/Khaemenes_Academy.github.io/mentor/");
assert.equal(dock.children[3].getAttribute("href"),"https://vervenveda.com/#support");
assert.equal(dock.children[4].getAttribute("href"),"https://vervenveda.com/beta/");
dock.children[1].listeners.click();
const dialog=document.getElementById("vnvExternalUpdates");
assert.ok(dialog&&dialog.open,"Updates button opens a real dialog");
assert.equal(dialog.children[2].children.length,6,"Six public links in the Updates panel");
dialog.children[0].children[1].listeners.click();
assert.equal(dialog.open,false,"Dialog can be closed");
console.log("PASS: five accessible actions, dialogs, canonical links, duplicate-Beta CSS and 255px layout safeguards.");
