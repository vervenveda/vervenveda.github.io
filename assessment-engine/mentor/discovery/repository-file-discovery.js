function headers(token=""){
  const out={
    Accept:"application/vnd.github+json",
    "X-GitHub-Api-Version":"2022-11-28",
    "User-Agent":"khaemenes-mentor-indexer"
  };
  if(token) out.Authorization=`Bearer ${token}`;
  return out;
}

export function humanizePath(path){
  const parts=String(path||"").split("/").filter(Boolean);
  let base=parts.at(-1)||"Resource";
  if(/^index\.html?$/i.test(base) && parts.length>1) base=parts.at(-2);
  base=base
    .replace(/\.html?$/i,"")
    .replace(/[_-]?index$/i,"")
    .replace(/[™®]/g,"")
    .replace(/[_-]+/g," ")
    .replace(/\s+/g," ")
    .trim();
  return base.replace(/\b\w/g,m=>m.toUpperCase());
}

export function encodePath(path){
  return String(path||"").split("/").map(segment=>encodeURIComponent(segment)).join("/");
}

function underRoot(path,root,recursive){
  const cleanRoot=String(root||"").replace(/^\/+|\/+$/g,"");
  if(!cleanRoot){
    return recursive ? true : !String(path).includes("/");
  }
  if(recursive) return path===cleanRoot || path.startsWith(`${cleanRoot}/`);
  const dir=path.includes("/")?path.slice(0,path.lastIndexOf("/")):"";
  return dir===cleanRoot;
}

function excluded(path,fragments=[]){
  const lower=String(path).toLowerCase();
  return fragments.some(fragment=>lower.includes(String(fragment).toLowerCase()));
}

function matchesExtension(path,extensions=[]){
  const lower=String(path).toLowerCase();
  return extensions.some(ext=>lower.endsWith(String(ext).toLowerCase()));
}

export function inferCareerMetadata(title,path,defaults={}){
  const text=`${title} ${path}`.toLowerCase();
  const skills=[],domains=[...(defaults.domains||[])],tags=[...(defaults.tags||[])];

  const add=(arr,...values)=>values.forEach(v=>{if(v&&!arr.includes(v))arr.push(v)});
  if(/resume|cover.?letter|curriculum.?vitae|\bcv\b|professional.?bio|interview|job.?description/.test(text)){
    add(skills,"career-readiness","professional-writing");add(domains,"writing","employment");
  }
  if(/business|strateg|project|proposal|annual.?report|operations|entrepreneur|startup/.test(text)){
    add(skills,"planning","business-communication");add(domains,"business");
  }
  if(/finance|budget|stock|tax|credit|debit|calculator|investment/.test(text)){
    add(skills,"numeracy","financial-literacy");add(domains,"finance");
  }
  if(/code|coding|program|python|javascript|html|css|software|technology/.test(text)){
    add(skills,"coding","digital-literacy");add(domains,"technology");
  }
  if(/cad|engineering|design|architecture|draft|prototype|ohmic/.test(text)){
    add(skills,"design-thinking","technical-design");add(domains,"engineering","design");
  }
  if(/research|citation|evidence|search|bibliograph|literature.?review/.test(text)){
    add(skills,"research","source-evaluation");add(domains,"research");
  }
  if(/chess|sudoku|checkers|connect.?four|\biq\b|logic|strategy|puzzle|game|trivia/.test(text)){
    add(skills,"logic","problem-solving","strategy");add(domains,"reasoning");
  }
  if(/law|legal|policy|public.?service|petition|testimony|public.?records/.test(text)){
    add(skills,"civic-literacy","evidence-reasoning");add(domains,"law","public-service");
  }
  if(/lesson|course|syllabus|education|teaching|teacher|curriculum/.test(text)){
    add(skills,"teaching","instructional-planning");add(domains,"education");
  }
  if(/art|artist|music|audio|video|media|podcast|gallery|exhibition|creative/.test(text)){
    add(skills,"creative-production");add(domains,"creative");
  }
  if(/task|checklist|meeting|handoff|issue.?log|performance.?review|workflow|clean|zip/.test(text)){
    add(skills,"organization","workplace-productivity");add(domains,"productivity");
  }

  add(tags,"supplemental-discovery");
  return {skills,domains,tags};
}

export async function discoverRepositoryFiles(policy,{token=""}={}){
  const repo=policy.repository;
  const repoResponse=await fetch(`https://api.github.com/repos/${repo}`,{headers:headers(token)});
  if(!repoResponse.ok) throw new Error(`Supplemental discovery repository lookup failed for ${repo}: ${repoResponse.status}`);
  const repoMeta=await repoResponse.json();
  const branch=repoMeta.default_branch||"main";

  const treeResponse=await fetch(
    `https://api.github.com/repos/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
    {headers:headers(token)}
  );
  if(!treeResponse.ok) throw new Error(`Supplemental discovery tree failed for ${repo}: ${treeResponse.status}`);
  const treePayload=await treeResponse.json();
  const tree=Array.isArray(treePayload.tree)?treePayload.tree:[];

  const resources=[];
  for(const root of policy.roots||[]){
    for(const entry of tree){
      if(entry.type!=="blob") continue;
      const path=String(entry.path||"");
      if(!underRoot(path,root.path,root.recursive!==false)) continue;
      if(!matchesExtension(path,root.extensions||[".html"])) continue;
      if(excluded(path,policy.excludePathFragments||[])) continue;
      if(excluded(path,root.excludePathFragments||[])) continue;

      const title=humanizePath(path);
      const inferred=inferCareerMetadata(title,path,root);
      const base=String(policy.baseUrl||repoMeta.homepage||"").replace(/\/?$/,"/");
      const url=`${base}${encodePath(path)}`;
      const id=`supplemental:${repo.toLowerCase()}:${path.toLowerCase()}`;

      resources.push({
        id,
        title,
        description:`Automatically discovered ${root.resourceType||"resource"} from the approved ${root.path||"repository root"} inventory.`,
        url,
        sourceId:`github:${repo.toLowerCase()}`,
        repository:repo,
        classification:root.classification||"professional-practical",
        audiences:[...(root.audiences||["higher-learning","adult"])],
        roles:["student","parent","educator"],
        domains:inferred.domains,
        skills:inferred.skills,
        tags:inferred.tags,
        subjects:[],
        minutes:null,
        energy:"",
        featured:false,
        mentorEligible:true,
        recommendable:true,
        explicitAdultOptIn:false,
        resourceType:root.resourceType||"resource",
        learningValue:"supplemental-discovery",
        curricularWeight:"",
        learningObjectives:[],
        highStakesDomain:"",
        inventoryAuthority:"approved-folder-scan",
        requiresLinkedLearner:false,
        requiredStage:"",
        requiresFreshnessCheck:false,
        dynamicContent:false,
        requiresPreferenceMatch:[],
        requiresAccountAwareness:false,
        sensitiveTopics:[],
        externalInformation:false,
        sourcePriority:-10,
        freshnessWindowMinutes:null,
        contentType:"text/html",
        policyTags:["supplemental-discovery","allowlisted-public-folder"],
        requiresExplicitQuery:false,
        policy:{
          requiresFreshnessCheck:false,
          dynamicContent:false,
          requiresPreferenceMatch:[],
          requiresAccountAwareness:false,
          requiresLinkedLearner:false,
          requiredStage:"",
          sensitiveTopics:[],
          externalInformation:false,
          highStakesDomain:"",
          requiresExplicitQuery:false,
          policyTags:["supplemental-discovery","allowlisted-public-folder"]
        },
        manifestPath:null,
        discoveryMethod:"approved-folder-scan",
        sourcePath:path,
        sourceSha:entry.sha||""
      });
    }
  }
  return resources;
}

export function mergeSupplementalResources(existing,supplemental){
  const normalizeUrl=url=>String(url||"")
    .replace(/^https:\/\/vervenveda\.github\.io\//i,"https://vervenveda.com/")
    .replace(/\/+$/,"")
    .toLowerCase();

  const byUrl=new Map();
  for(const resource of existing||[]){
    const key=normalizeUrl(resource.url);
    if(key) byUrl.set(key,resource);
  }

  for(const resource of supplemental||[]){
    const key=normalizeUrl(resource.url);
    if(!key||byUrl.has(key)) continue; // explicit/older registry entry wins
    byUrl.set(key,resource);
  }
  return [...byUrl.values()];
}
