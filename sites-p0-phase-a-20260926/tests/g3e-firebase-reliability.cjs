'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
const out=path.join(root,'.sites-runtime/g3e');
fs.rmSync(out,{recursive:true,force:true});
execFileSync(process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),
 'infrastructure/ai/firebase-request-lifecycle.ts','infrastructure/ai/firebase-ai-logic-provider.ts',
 'infrastructure/browser/firebase-model-selection.ts','infrastructure/browser/firebase-ai-browser.ts','ai/service.ts',
 '--outDir',out,'--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}');
const {FirebaseRequestLifecycle}=require(path.join(out,'infrastructure/ai/firebase-request-lifecycle.js'));
const {FirebaseAILogicProvider}=require(path.join(out,'infrastructure/ai/firebase-ai-logic-provider.js'));
const {CachedWritingModel,DEFAULT_WRITING_AI_MODEL}=require(path.join(out,'infrastructure/browser/firebase-model-selection.js'));
const {classifyProviderFailure,SafeProviderError}=require(path.join(out,'ai/provider-diagnostics.js'));
const {createTutorService}=require(path.join(out,'ai/service.js'));
let tests=0;
async function test(name,run){await run();tests++;console.log('PASS '+name)}
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve()};
function deferred(){let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return {promise,resolve,reject}}
function fakeClock(){let time=0,cb=null;return {now:()=>time,set:(f,ms)=>{assert.equal(ms,20000);cb=f;return 1},clear:()=>{cb=null},timeout:()=>{time+=20000;cb?.()},advance:()=>{time+=2000}}}
const request={schemaVersion:1,purpose:'feedback',promptVersion:'1',instructions:'test',input:{studentAnswer:'private learner writing'},temperature:0};
const valid={summary:'Clear idea',strengths:['Relevant'],improvements:['Add an example'],exercise:'Add an example.',tags:[]};
(async()=>{
 await test('successful structured provider response',async()=>{
  const events=[];const tutor=createTutorService(new FirebaseAILogicProvider({available:true,model:'mock',generateJSON:async()=>valid},e=>events.push(e)));
  assert(await tutor.coach('analysis','task',{}));assert.deepEqual(events,[]);
 });
 await test('INTERNAL gives safe fallback classification',async()=>{
  const events=[];const tutor=createTutorService(new FirebaseAILogicProvider({available:true,model:'mock',generateJSON:async()=>{throw {code:'INTERNAL',message:'Overloaded private learner writing token=SECRET key=PRIVATE'}}},e=>events.push(e)));
  assert.equal(await tutor.coach('analysis','task',{}),null);
  assert.deepEqual(events,[{provider:'firebase-ai-logic',classification:'backend-overload',phase:'fallback'}]);
  assert(!/SECRET|PRIVATE|writing|token=|key=/.test(JSON.stringify(events)));
 });
 for(const settles of ['resolve','reject'])await test('20s fallback holds lock until late '+settles,async()=>{
  const timer=fakeClock(),events=[],d=deferred();let calls=0;
  const lifecycle=new FirebaseRequestLifecycle(e=>events.push(e),timer);
  const provider=new FirebaseAILogicProvider({available:true,model:'mock',generateJSON:()=>lifecycle.run(()=>{calls++;return d.promise})},e=>events.push(e));
  const tutor=createTutorService(provider);
  const first=tutor.coach('analysis','task',{});await flush();timer.timeout();
  assert.equal(await first,null);assert.equal(lifecycle.inFlight,true);
  assert.equal(await tutor.coach('analysis','task',{}),null);assert.equal(calls,1);
  assert.equal(events[0].classification,'client-timeout');assert.equal(events[1].classification,'request-pending');
  if(settles==='resolve')d.resolve(valid);else d.reject({code:'DEADLINE_EXCEEDED',message:'private payload SECRET'});
  await flush();assert.equal(lifecycle.inFlight,false);
  if(settles==='reject')assert.deepEqual(events[2],{provider:'firebase-ai-logic',classification:'deadline-exceeded',phase:'settled-after-timeout'});
  assert.equal((await tutor.coach('analysis','task',{}))!==null,settles==='resolve');assert.equal(calls,2);
 });
 await test('synchronous initialization failure clears lock',async()=>{
  const timer=fakeClock();const life=new FirebaseRequestLifecycle(undefined,timer);
  await assert.rejects(life.run(()=>{throw new Error('init')}));assert.equal(life.inFlight,false);
 });
 await test('malformed JSON and malformed schema classify invalid response',async()=>{
  for(const generateJSON of [async()=>{throw new SafeProviderError('invalid-response')},async()=>({summary:1}),async()=>null]){
   const events=[];const tutor=createTutorService(new FirebaseAILogicProvider({available:true,model:'mock',generateJSON},e=>events.push(e)));
   assert.equal(await tutor.coach('analysis','task',{}),null);assert.equal(events.at(-1).classification,'invalid-response');
   assert.equal(await tutor.teachWriting('text','task',{}),null);assert.equal(events.at(-1).classification,'invalid-response');
  }
 });
 await test('Remote Config failure uses default and never refetches per click',async()=>{
  let calls=0;const selection=new CachedWritingModel();
  for(let i=0;i<5;i++)selection.refreshOnce(async()=>{calls++;throw new Error('offline')});
  await flush();assert.equal(calls,1);assert.equal(selection.model,'gemini-3.5-flash');assert.equal(DEFAULT_WRITING_AI_MODEL,'gemini-3.5-flash');
 });
 await test('Remote Config supports 3.8 and rejects malformed model',async()=>{
  const selection=new CachedWritingModel();selection.refreshOnce(async()=> 'gemini-3.8-flash');await flush();assert.equal(selection.model,'gemini-3.8-flash');
  const bad=new CachedWritingModel();bad.refreshOnce(async()=> 'token=PRIVATE');await flush();assert.equal(bad.model,DEFAULT_WRITING_AI_MODEL);
 });
 await test('all requested error classifications',async()=>{
  for(const [code,expected] of [['INTERNAL','backend-overload'],['DEADLINE_EXCEEDED','deadline-exceeded'],['RESOURCE_EXHAUSTED','quota-rate-limit'],['429','quota-rate-limit'],['PERMISSION_DENIED','app-check-permission'],['appCheck/token-error','app-check-permission'],['404','unknown-provider-error']])assert.equal(classifyProviderFailure({code}),expected);
 });
 await test('browser bridge uses English App, protected SDK, selected model and one config fetch',async()=>{
  const Module=require('node:module'),original=Module._load;
  const calls={init:[],appCheck:[],models:[],remote:0,ai:0};
  const app={name:'self-learning-english-ai'};
  const remote={settings:{},defaultConfig:{}};
  const priorWindow=global.window,priorLocation=global.location;
  global.window={};global.location={hostname:'g-learning-english.web.app'};
  const mocks={
   'firebase/app':{getApps:()=>[],initializeApp:(config,name)=>{calls.init.push({config,name});return app}},
   'firebase/app-check':{ReCaptchaEnterpriseProvider:class {constructor(key){this.key=key}},initializeAppCheck:(a,config)=>{assert.equal(a,app);calls.appCheck.push(config)}},
   'firebase/ai':{GoogleAIBackend:class {},getAI:a=>{assert.equal(a,app);return {}},getGenerativeModel:(ai,config)=>{calls.models.push(config.model);return {generateContent:async()=>{calls.ai++;return {response:{text:()=>JSON.stringify(valid)}}}}}},
   'firebase/remote-config':{isSupported:async()=>true,getRemoteConfig:a=>{assert.equal(a,app);return remote},fetchAndActivate:async()=>{calls.remote++},getString:()=> 'gemini-3.8-flash'},
  };
  Module._load=function(name,...args){return mocks[name]??original.call(this,name,...args)};
  try{
   const bridge=require(path.join(out,'infrastructure/browser/firebase-ai-browser.js'));
   const tutor=bridge.browserTutorService();assert(await tutor.coach('analysis','task',{}));await flush();
   assert.equal(calls.init[0].config.appId,'1:789845564404:web:26cfae781851ee7758b7a1');
   assert.equal(calls.init[0].config.projectId,'roadmap-toan-ai');
   assert.equal(calls.models[0],'gemini-3.5-flash');assert.equal(calls.remote,1);assert.equal(calls.ai,1);
   assert.equal(remote.settings.minimumFetchIntervalMillis,43200000);assert.equal(remote.settings.fetchTimeoutMillis,5000);
   assert.equal(calls.appCheck[0].isTokenAutoRefreshEnabled,true);
   assert.equal(global.FIREBASE_APPCHECK_DEBUG_TOKEN,undefined);
  }finally{Module._load=original;global.window=priorWindow;global.location=priorLocation}
 });
 await test('save-before-AI, unchanged App Check guard, conservative remote config wiring',async()=>{
  const read=p=>fs.readFileSync(path.join(root,p),'utf8');
  const client=read('infrastructure/browser/client-services.ts');assert(client.indexOf('await service.recordEvidence(provisionalEvidence)')<client.indexOf('const tutor=browserTutorService()'));
  const bridge=read('infrastructure/browser/firebase-ai-browser.ts');
  assert(bridge.includes('firebaseAppCheckDebugEnabled()&&localDebugAllowed()'));
  assert(bridge.includes('new ReCaptchaEnterpriseProvider(config.appCheckSiteKey)'));
  assert(bridge.includes('isTokenAutoRefreshEnabled:true'));
  assert(bridge.includes('modelSelection.refreshOnce'));
  assert(bridge.includes('minimumFetchIntervalMillis=REMOTE_MODEL_FETCH_INTERVAL_MS'));
  assert(!bridge.includes('console.error'));assert(!bridge.includes('console.log(input'));
 });
 console.log(JSON.stringify({result:'PASS',tests,liveAICalls:0,realRemoteConfigCalls:0}));
})().catch(e=>{console.error(e);process.exit(1)});
