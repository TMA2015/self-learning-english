'use strict';
/** Real Chromium React Save/Restore/AI opt-in for reviewed FW-U07/U05/U06, synthetic model only. */
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os');
const path=require('node:path'),http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime/foundation-writing-u07-u09-browser');
 fs.rmSync(out,{recursive:true,force:true});
 const stub=[
  'export function browserTutorService(){return {available:true,async coach(stage,task,answer,context){',
  ' if(stage!=="foundation-writing")throw Error("Unexpected AI purpose");',
  ' if(!["FW-U07","FW-U08","FW-U09"].includes(answer.unitId))throw Error("Unknown unit");',
  ' if(![answer.unitId+"-A",answer.unitId+"-B",answer.unitId+"-T"].includes(answer.fixtureId))throw Error("Cross-unit review request");',
  ' if(answer.text.includes("FW-U07-F01")||answer.text.includes("FW-U08-F01")||answer.text.includes("FW-U09-F01")||answer.text.includes("Key:"))throw Error("Answer key leak");',
  ' window.__aiCalls=(window.__aiCalls||0)+1;',
  ' return {provider:"firebase-ai-logic",model:"synthetic-only",structuredResult:{',
  '  summary:"Synthetic exact saved writing reviewed.",',
  '  strengths:["The learner made a task-related choice."],improvements:[],',
  '  quotes:[answer.text.slice(0,Math.min(23,answer.text.length))],',
  '  questions:["How does this detail support the idea?"],',
  '  nextAction:"Revise your own explanation if you want.",scores:null,level:null,canEstimateLevel:false}};',
  ' }}}',
  'export function browserTutorConfigured(){return true}',
  'export function readAIFailure(){return null}',
  'export function resetAIFailure(){}'
 ].join('\n');
 await build({root,configFile:false,logLevel:'error',
  plugins:[{
   name:'synthetic-only-fw-wave2-browser',enforce:'pre',
   resolveId(source,importer){
    if(source==='./english-lesson-tutor'&&importer?.endsWith('/app/foundation-writing-u07-u09.tsx'))
     return '\0sle-qa-wave3-knowledge-tutor';
    if(source==='../infrastructure/browser/firebase-ai-browser'&&importer?.endsWith('/app/foundation-writing-u07-u09.tsx'))
     return '\0sle-qa-wave3-ai';
    if(source==='./firebase-ai-browser'&&importer?.endsWith('/infrastructure/browser/client-services.ts'))
     return '\0sle-qa-wave3-ai';
   },
   load(id){
    if(id==='\0sle-qa-wave3-knowledge-tutor')
     return "import React from 'react';export function EnglishLessonTutor(){return null}";
    if(id==='\0sle-qa-wave3-ai')return stub;
   },
  }],
  define:{'process.env.NODE_ENV':JSON.stringify('production'),
   'process.env.NEXT_PUBLIC_LEARNING_RUNTIME':JSON.stringify('browser')},
  build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/foundation-writing-u07-u09-browser-entry.tsx'),
    formats:['iife'],name:'SleU07U09Browser',fileName:()=> 'bundle.js'}},
 });
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 assert(bundle.includes('Save & Ask AI Tutor'),'AI Tutor UI is present');
 assert(bundle.includes('Draft V1'),'U09 immutable first draft UI must exist');
 const bin=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(name=>{try{return cp.execFileSync('which',[name],{encoding:'utf8'}).trim()}catch{return ''}})
  .find(Boolean);
 if(!bin)throw Error('Native Chromium missing; refuse to claim real browser PASS');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-fw-wave3-browser-'));
 const html='<!doctype html><html><head><meta charset="utf-8"></head><body>'+
  '<div id="app"></div><div id="sle-test-result">STARTED</div>'+
  '<script>window.process={env:{NODE_ENV:"production",NEXT_PUBLIC_LEARNING_RUNTIME:"browser"}};'+
  'window.__aiCalls=0;window.addEventListener("error",e=>document.getElementById("sle-test-result").textContent="FAIL_SCRIPT "+String(e.message));'+
  'window.addEventListener("unhandledrejection",e=>document.getElementById("sle-test-result").textContent="FAIL_PROMISE "+String(e.reason));</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 const server=http.createServer((_req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});res.end(html);
 });
 async function open(url){
  return new Promise((resolve,reject)=>{
   const child=cp.spawn(bin,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
    '--disable-extensions','--disable-background-networking','--no-first-run',
    '--virtual-time-budget=80000','--dump-dom','--user-data-dir='+profile,url],
    {stdio:['ignore','pipe','pipe']});
   let stdout='',stderr='',expired=false;
   const timer=setTimeout(()=>{expired=true;child.kill('SIGKILL')},55000);
   child.stdout.on('data',d=>stdout+=String(d));child.stderr.on('data',d=>stderr+=String(d));
   child.on('error',reject);child.on('close',code=>{
    clearTimeout(timer);
    if(expired||code!==0)return reject(Error('Chromium failed '+code+' '+stderr.slice(-700)));
    const result=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
    if(!result.startsWith('PASS_FW_'))return reject(Error('Foundation U04/U05/U06 React browser FAIL: '+result.slice(0,1800)));
    resolve(result);
   });
  });
 }
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const host='http://127.0.0.1:'+server.address().port;
  const steps=['07save','07restore','08save','08restore','09save','09restore'];
  const verdict=[];
  for(const step of steps)verdict.push(await open(host+'/?phase='+step));
  assert.match(verdict[0],/^PASS_FW_U07_SAVE/);
  assert.match(verdict[1],/^PASS_FW_U07_RESTORE/);
  assert.match(verdict[2],/^PASS_FW_U08_SAVE/);
  assert.match(verdict[3],/^PASS_FW_U08_RESTORE/);
  assert.match(verdict[4],/^PASS_FW_U09_SAVE/);
  assert.match(verdict[5],/^PASS_FW_U09_RESTORE/);
  console.log(JSON.stringify({result:'PASS',gate:'FW-U07-U09-React-Chromium',
   browserPhases:steps,problemSolutionBridge:true,peerAndOrganizerTone:true,
   immutableFirstDraftV1:true,failedSaveBlockedAI:true,savedVersionHistory:true,reloadContinuity:true,
   unitIsolation:true,legacyPreserved:true,explicitOnlyAI:true,
   syntheticProvider:true,liveProviderCalls:0,realLearnerDataTouched:false,
   productionWrites:0,liveSiteTouched:false}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
