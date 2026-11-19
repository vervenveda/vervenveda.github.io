/* Khaemenes Mathematics Engine · Universal Bootstrap v1.0.0
   Canonical ownership guard and context contract.
   Rendering adapters may extend this object; no duplicate engine may mount. */
(()=>{"use strict";
if(window.KhaemenesMathEngine)return;

const VERSION="1.0.0";
const ROOT_SELECTOR='[data-khaemenes-math-engine],#khaemenesMathWorkspace';

function normalizeContext(input={}){
  return Object.freeze({
    version:VERSION,
    level:String(input.level||"unspecified"),
    courseId:String(input.courseId||""),
    unitId:String(input.unitId||""),
    lessonId:String(input.lessonId||""),
    evidenceMode:String(input.evidenceMode||"procedural"),
    assessmentMode:!!input.assessmentMode,
    closedBook:!!input.closedBook,
    tools:Array.isArray(input.tools)?Object.freeze([...input.tools]):Object.freeze([]),
    resources:Array.isArray(input.resources)?Object.freeze([...input.resources]):Object.freeze([]),
    masteryAuthority:String(input.masteryAuthority||"course-runtime")
  });
}

function findRoot(){
  return document.querySelector(ROOT_SELECTOR);
}

function mount(input={}){
  const root=findRoot();
  if(!root)return {ok:false,reason:"missing-root"};
  if(root.dataset.engineOwner && root.dataset.engineOwner!=="canonical"){
    return {ok:false,reason:"foreign-owner",owner:root.dataset.engineOwner};
  }
  root.dataset.khaemenesMathEngine=VERSION;
  root.dataset.engineOwner="canonical";
  root.classList.add("khaemenes-math-engine");
  document.documentElement.dataset.khaemenesMathEngineActive=VERSION;

  const context=normalizeContext(input);
  window.KhaemenesMathContext=context;
  root.dispatchEvent(new CustomEvent("khaemenes:math-engine-mounted",{bubbles:true,detail:context}));
  return {ok:true,root,context};
}

function audit(){
  const root=findRoot();
  return Object.freeze({
    version:VERSION,
    roots:document.querySelectorAll(ROOT_SELECTOR).length,
    owner:root?.dataset.engineOwner||null,
    classTools:document.querySelectorAll("#vnvClassToolsToolbar").length,
    ecosystemToolbar:document.querySelectorAll("#vnvEcosystemUtilityDock").length,
    ticker333:document.querySelectorAll("#networkTicker,#vnv333NetworkTicker").length,
    autoTicker:document.querySelectorAll("#vnvTickerAutoPopulate").length,
    canonicalHeader:document.querySelectorAll("#vnvHeaderAutoPopulate,body > .site-header").length,
    profileToolbars:document.querySelectorAll(".student-profile-toolbar,.profile-toolbar,[data-student-profile-toolbar],[data-profile-toolbar]").length
  });
}

window.KhaemenesMathEngine=Object.freeze({version:VERSION,mount,audit,normalizeContext});
})();
