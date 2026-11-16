'use strict';
/** Issue #114: denial tests use configured-looking mocked Firebase, never a real network. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const Module=require('node:module');
const root=path.join(__dirname,'..'),out=path.join(root,'.sites-runtime/issue114-provider-gate');
fs.rmSync(out,{force:true,recursive:true});
execFileSync(process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),
 'infrastructure/browser/firebase-ai-browser.ts','--outDir',out,'--module','commonjs',
 '--target','es2022','--skipLibCheck','--esModuleInterop','--resolveJsonModule'],
 {cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const gate=require(path.join(out,'domain/learner-external-ai-gate.js'));
assert.equal(gate.learnerExternalAiEnabled(),false,'Policy review is not complete');
const previousFlag=process.env.NEXT_PUBLIC_SLE_LEARNER_AI_APPROVED;
process.env.NEXT_PUBLIC_SLE_LEARNER_AI_APPROVED='1';
assert.equal(gate.learnerExternalAiEnabled(),false,'Environment cannot bypass a code-approval gate');
if(previousFlag===undefined)delete process.env.NEXT_PUBLIC_SLE_LEARNER_AI_APPROVED;
else process.env.NEXT_PUBLIC_SLE_LEARNER_AI_APPROVED=previousFlag;
const calls={firebaseApp:0,appCheck:0,getAI:0,getModel:0,send:0};
const original=Module._load;
const oldWindow=global.window,oldLocation=global.location;
global.window={};global.location={hostname:'g-learning-english.web.app'};
const mocks={
 'firebase/app':{getApps:()=>[],initializeApp:()=>{calls.firebaseApp++;return {name:'mock'}}},
 'firebase/app-check':{ReCaptchaEnterpriseProvider:class{},initializeAppCheck:()=>{calls.appCheck++;return {}},getToken:async()=>({token:'test-only'})},
 'firebase/ai':{GoogleAIBackend:class{},getAI:()=>{calls.getAI++;return{}},getGenerativeModel:()=>{calls.getModel++;return{generateContent:async()=>{calls.send++;return{response:{text:()=>'{ }'}}}}}},
};
Module._load=function(name,...args){return mocks[name]??original.call(this,name,...args)};
(async()=>{
 try{
  const bridge=require(path.join(out,'infrastructure/browser/firebase-ai-browser.js'));
  assert.equal(bridge.browserTutorConfigured(),false,'Public Firebase config does not authorize minors');
  assert.equal(bridge.browserTutorService().available,false,'AI tutor service must be unavailable');
  assert.equal(bridge.browserTutorService().available,false,'Cache cannot re-open provider');
  const result=await bridge.explainEnglishLessonAI({
   lesson:'Week 2',focus:'Learn',question:'Private learner authored question'
  });
  assert.equal(result.status,'unavailable');assert.match(result.reason,/provider eligibility review/);
  assert.deepEqual(calls,{firebaseApp:0,appCheck:0,getAI:0,getModel:0,send:0},
   'No Firebase AI SDK initialized or provider request made');
  const home=read('app/home-client.tsx'),
   lesson=read('app/english-lesson-tutor.tsx'),
   writing=read('app/writing-ai-review.tsx'),
   services=read('infrastructure/browser/client-services.ts'),
   source=read('infrastructure/browser/firebase-ai-browser.ts');
  assert(home.includes("group.items.filter(n=>n.key!=='tutor'||learnerExternalAiEnabled())"));
  assert(home.includes('{learnerExternalAiEnabled()&&<span className="demo-pill"'));
  assert(lesson.includes('if(!learnerExternalAiEnabled())return null;'));
  assert(writing.includes('if(!learnerExternalAiEnabled())return null;'));
  assert(services.includes('if(!learnerExternalAiEnabled())return {status:'));
  assert(source.includes('if(!learnerExternalAiEnabled())return null;'));
  assert(source.includes('if(!learnerExternalAiEnabled())throw new Error('));
  console.log(JSON.stringify({result:'PASS',gate:'ISSUE114_EXTERNAL_AI_CLOSED',
   configuredFirebaseIgnored:true,envBypassDenied:true,uiControlsHidden:true,
   firebaseInitialized:0,appCheckCalls:0,networkProviderRequests:0}));
 }finally{Module._load=original;global.window=oldWindow;global.location=oldLocation}
})().catch(e=>{console.error(e);process.exitCode=1});
