'use strict';
// Regression: Firebase AI Logic remains available for explicit learner requests.
// SDK is fully mocked. No external HTTP calls, credentials or learner data.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),Module=require('node:module');
const root=path.join(__dirname,'..'),out=path.join(root,'.sites-runtime/issue114-provider-gate');
fs.rmSync(out,{force:true,recursive:true});
cp.execFileSync(process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),
 'infrastructure/browser/firebase-ai-browser.ts','--outDir',out,'--module','commonjs',
 '--target','es2022','--skipLibCheck','--esModuleInterop','--resolveJsonModule'],
 {cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}');
const calls={firebaseApp:0,appCheck:0,attest:0,getAI:0,getModel:0,send:0};
const priorWindow=global.window,priorLocation=global.location,original=Module._load;
global.window={};global.location={hostname:'g-learning-english.web.app'};
const mocks={
 'firebase/app':{getApps:()=>[],initializeApp:()=>{calls.firebaseApp++;return{name:'synthetic-firebase'}}},
 'firebase/app-check':{ReCaptchaEnterpriseProvider:class{},initializeAppCheck:()=>{calls.appCheck++;return{ready:true}},getToken:async()=>{calls.attest++;return{token:'synthetic-app-check'}}},
 'firebase/ai':{GoogleAIBackend:class{},getAI:()=>{calls.getAI++;return{}},getGenerativeModel:()=>{calls.getModel++;return{generateContent:async()=>{calls.send++;return{response:{text:()=> 'A clear practice explanation.'}}}}}},
};
Module._load=function(name,...args){return mocks[name]??original.call(this,name,...args)};
(async()=>{try{
 const bridge=require(path.join(out,'infrastructure/browser/firebase-ai-browser.js'));
 assert.equal(bridge.browserTutorConfigured(),true,'Existing Firebase AI configuration is present');
 assert.equal(bridge.browserTutorService().available,true,'Gemini tutor must be available when configured');
 assert.equal(calls.send,0,'No provider request without user action');
 const answer=await bridge.explainEnglishLessonAI({lesson:'Week 2',focus:'Planning ideas',question:'Give another example'});
 assert.equal(answer.status,'answered');
 assert.match(answer.text,/practice explanation/);
 assert.equal(calls.firebaseApp,1);
 assert.equal(calls.appCheck,1);
 assert.equal(calls.attest,1,'Firebase App Check attestation before request');
 assert.equal(calls.getAI,1);assert.equal(calls.getModel,1);assert.equal(calls.send,1);
 for(const name of ['app/english-lesson-tutor.tsx','app/writing-ai-review.tsx','infrastructure/browser/client-services.ts','infrastructure/browser/firebase-ai-browser.ts']){
  const source=fs.readFileSync(path.join(root,name),'utf8');
  assert(!source.includes('learnerExternalAiEnabled'),'Blanket AI denial removed from '+name);
 }
 console.log(JSON.stringify({result:'PASS',gate:'GEMINI_AVAILABLE_ON_REQUEST',mockRequests:1,realExternalRequests:0,appCheckVerified:true}));
}finally{Module._load=original;global.window=priorWindow;global.location=priorLocation}})().catch(e=>{console.error(e);process.exitCode=1});
