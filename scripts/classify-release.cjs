'use strict';
// Fail closed: only explicitly registered, isolated Knowledge surfaces qualify.
const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const prefix='sites-p0-phase-a-20260926/';
const groups={
 vocabulary:{css:'app/vocabulary-knowledge-v23.css',component:'app/vocabulary-knowledge-v23.tsx',content:['content/vocabulary-knowledge-v23.json'],tests:['vocabulary-knowledge-v23.cjs','vocabulary-knowledge-v23-browser.cjs']},
 grammar:{css:'app/grammar-knowledge-v23.css',component:'app/grammar-knowledge-v23.tsx',content:['wave1','wave2-a1','wave3a-a2','wave3b-a2','wave4a-b1','wave4b-b1-b2'].map(x=>'content/grammar-knowledge-v23-'+x+'.json'),tests:['grammar-knowledge-v23.cjs','grammar-knowledge-v23-browser.cjs']}
};
function plan(changes,read){
 if(!changes.length)return {tier:3,skills:[],reason:'empty or uncertain diff'};
 const skills=new Set();let tier=1;
 for(const {status,path} of changes){
  if(status!=='M'||!path.startsWith(prefix))return {tier:3,skills:[],reason:'unregistered addition/deletion/rename or shared path'};
  const file=path.slice(prefix.length);
  const hit=Object.entries(groups).find(([,g])=>[g.css,g.component,...g.content].includes(file));
  if(!hit)return {tier:3,skills:[],reason:'unregistered/shared/data/audio/test/policy path'};
  const [skill,g]=hit;skills.add(skill);
  if(file===g.css){
   const before=read(path,'base'),after=read(path,'head');
   // Only declaration-value edits in already scoped rules are fast-track.
   // New selectors/rules, removed rules or external resources require full QA.
   const rules=s=>s.replace(/\/\*[\s\S]*?\*\//g,'').match(/[^{}]+(?=\{)/g)?.map(x=>x.trim())??[];
   if(JSON.stringify(rules(before))!==JSON.stringify(rules(after))||/@import|url\s*\(|expression\s*\(|\\|:has\(/i.test(after))return {tier:3,skills:[],reason:'CSS selector/rule or resource change'};
   const leaf=s=>[...s.replace(/\/\*[\s\S]*?\*\//g,'').matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(m=>({selector:m[1].trim(),decl:m[2].split(';').map(x=>x.trim()).filter(Boolean)}));
   const a=leaf(before),b=leaf(after);
   if(a.length!==b.length||a.some((r,i)=>r.selector!==b[i].selector))return {tier:3,skills:[],reason:'CSS structure changed'};
   const allowed=/^(?:color|background-color|border(?:-(?:top|right|bottom|left))?(?:-color|-width|-radius|-style)?|border-radius|font-size|font-weight|line-height|letter-spacing|margin(?:-(?:top|right|bottom|left))?|padding(?:-(?:top|right|bottom|left))?|gap|row-gap|column-gap|(?:min-|max-)?(?:width|height))$/;
   for(let i=0;i<a.length;i++){
    const changed=[...a[i].decl.filter(x=>!b[i].decl.includes(x)),...b[i].decl.filter(x=>!a[i].decl.includes(x))];
    if(changed.some(x=>!allowed.test(x.split(':')[0].trim())||/!important|var\s*\(|url\s*\(/i.test(x)))return {tier:3,skills:[],reason:'non-cosmetic CSS declaration changed'};
    // Reordered unchanged declarations can change the cascade: do not fast-track.
    if(!changed.length&&JSON.stringify(a[i].decl)!==JSON.stringify(b[i].decl))return {tier:3,skills:[],reason:'CSS declaration reorder'};
   }
  }else if(file===g.component){
   // Components are never fast solely by filename. A literal SVG path-only
   // adjustment in the existing Vocabulary button is allowed; all other
   // source edits go FULL until a specific verified adapter is registered.
   const before=read(path,'base'),after=read(path,'head');
   const icon=/<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1\.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">(?:<path d="[MmLlHhVvCcSsQqTtAaZz0-9., +\-]+"\/>)+<\/svg>/g;
   const oldIcons=before.match(icon)||[],newIcons=after.match(icon)||[];
   if(skill!=='vocabulary'||oldIcons.length!==1||newIcons.length!==1||before.replace(icon,'__ICON__')!==after.replace(icon,'__ICON__'))return {tier:3,skills:[],reason:'component logic or unregistered renderer change'};
  }else{
   // Only read-only Knowledge data projections, not cumulative curriculum.
   tier=Math.max(tier,2);
  }
 }
 return {tier,skills:[...skills].sort(),reason:tier===1?'isolated cosmetic changes':'isolated read-only Knowledge change'};
}
function selfTest(){
 const p=prefix,css=groups.vocabulary.css,component=groups.vocabulary.component,content=groups.vocabulary.content[0];
 const mod=x=>({status:'M',path:p+x});
 const read=(path,side)=>'.sle-voc-v23 button{color:'+(side==='base'?'red':'blue')+'}';
 assert.equal(plan([mod(css)],read).tier,1);
 assert.equal(plan([mod(css),mod(content)],read).tier,2);
 assert.equal(plan([mod(content)],read).tier,2);
 for(const x of ['app/foundation.tsx','app/globals.css','domain/academic.ts','content/curriculum-1.28.0-candidate.json','public/foundation-audio/x.mp3','tests/vocabulary-knowledge-v23.cjs','package.json','firebase.json'])assert.equal(plan([mod(css),mod(x)],read).tier,3,x);
 assert.equal(plan([{status:'A',path:p+css}],read).tier,3);
 assert.equal(plan([{status:'M',path:'.github/workflows/english-pr-qa.yml'}],read).tier,3);
 assert.equal(plan([],read).tier,3);
 assert.equal(plan([mod(css)],(p,s)=>s==='base'?'.x{color:red}':'.y{color:blue}').tier,3);
 assert.equal(plan([mod(css)],(p,s)=>s==='base'?'.x{color:red}':'.x{color:url(https://example.invalid)}').tier,3);
 assert.equal(plan([mod(css)],(p,s)=>s==='base'?'.x{display:block}':'.x{display:none}').tier,3);
 const svg=d=>'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="'+d+'"/></svg>';
 assert.equal(plan([mod(component)],(p,s)=>'same'+svg(s==='base'?'M1 1':'M2 2')).tier,1);
 assert.equal(plan([mod(component)],(p,s)=>s+svg('M1 1')).tier,3);
 console.log('QA_CLASSIFIER_SELF_TEST_PASS');
}
async function main(){
 selfTest();
 if(process.argv.includes('--self-test'))return;
 const base=process.env.SLE_QA_BASE,head=process.env.GITHUB_SHA;
 const full=reason=>({tier:3,skills:[],reason});
 let result=full('unverified diff or previous LIVE baseline'),policyChange=false;
 try{
  if(!/^[0-9a-f]{40}$/.test(base||'')||! /^[0-9a-f]{40}$/.test(head||'')||base===head)throw Error('invalid commit');
  const git=(...args)=>cp.execFileSync('git',args,{encoding:'utf8',maxBuffer:16*1024*1024});
  if(git('rev-parse','HEAD').trim()!==head)throw Error('wrong checkout');
  git('merge-base','--is-ancestor',base,head);
  const parts=git('diff','--name-status','--no-renames','-z',base,head).split('\0');parts.pop();
  if(parts.length%2)throw Error('unexpected diff format');
  const changes=[];for(let i=0;i<parts.length;i+=2)changes.push({status:parts[i],path:parts[i+1]});
  policyChange=changes.some(x=>['scripts/classify-release.cjs','scripts/verify-actions-policy.cjs','.github/workflows/english-pr-qa.yml','.github/workflows/english-manual-release-qa.yml',prefix+'scripts/qa-scoped.mjs'].includes(x.path));
  result=plan(changes,(path,side)=>git('show',(side==='base'?base:head)+':'+path));
  if(result.tier<3&&process.env.GITHUB_EVENT_NAME==='push'){
   // A prior main commit is not necessarily deployed. Require exact successful
   // authorized LIVE workflow, not a green PR or an older successful deploy.
   const token=process.env.SLE_ACTIONS_READ_TOKEN,repo=process.env.GITHUB_REPOSITORY;
   if(!token||!repo)throw Error('LIVE baseline evidence unavailable');
   const url='https://api.github.com/repos/'+repo+'/actions/workflows/english-manual-release-qa.yml/runs?event=push&head_sha='+base+'&status=success&per_page=20';
   const response=await fetch(url,{headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(10000)});
   if(!response.ok)throw Error('baseline lookup failed');
   const data=await response.json();
   if(!git('log','-1','--format=%B',base).includes('[release-english]'))throw Error('base has no authorized release marker');
   const previous=data.workflow_runs?.find(r=>r.head_sha===base&&r.event==='push'&&r.head_branch==='main'&&r.conclusion==='success');
   if(!previous||!Number.isSafeInteger(previous.id))throw Error('base not verified LIVE');
   const jobs=await fetch('https://api.github.com/repos/'+repo+'/actions/runs/'+previous.id+'/jobs?filter=latest&per_page=100',{headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(10000)});
   if(!jobs.ok)throw Error('baseline jobs unavailable');
   const detail=await jobs.json();
   if(!detail.jobs?.some(j=>j.conclusion==='success'&&['Deploy Firebase Hosting English LIVE only','Check LIVE English HTML and valid audio'].every(name=>j.steps?.some(step=>step.name===name&&step.conclusion==='success'))))throw Error('base release job skipped or incomplete');
  }
 }catch(e){result=full('uncertain scope or LIVE baseline; full QA required');}
 console.log(JSON.stringify(result));
 if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,'tier='+result.tier+'\nskills='+result.skills.join(',')+'\npolicy_change='+policyChange+'\n');
 if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,'\nQA scope: Level '+result.tier+' — '+result.reason+'; skills: '+(result.skills.join(',')||'all')+'\n');
}
main().catch(e=>{console.error(e);process.exitCode=1});
