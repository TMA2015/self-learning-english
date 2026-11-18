'use strict';
/** Synthetic-only real Chromium U01 Save–Restore–Fail–Retry QA. */
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os');
const path=require('node:path'),http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime/foundation-writing-u01-browser');
 fs.rmSync(out,{recursive:true,force:true});
 const stub=[
 'export function browserTutorService(){return {available:true,',
 ' async coach(stage,task,answer,ctx){',
 '  if(stage!=="foundation-writing")throw Error("Unexpected AI purpose");',
 '  window.__u01Calls=(window.__u01Calls||0)+1;',
 '  if(answer.unitId!=="FW-U01"||!["FW-U01-A","FW-U01-B","FW-U01-T"].includes(answer.fixtureId))throw Error("Wrong submitted artifact");',
 '  if(answer.text.includes("A-S1")||answer.text.includes("Write a friendly email"))throw Error("Answer key/demo was sent");',
 '  return {provider:"firebase-ai-logic",model:"synthetic-only",',
 '   structuredResult:{summary:"Synthetic QA: exact saved Task Map inspected.",',
 '    strengths:["The topic is stated."],improvements:[],',
 '    quotes:[answer.text.slice(0,Math.min(20,answer.text.length))],',
 '    questions:["Does your boundary make the requested day clear?"],',
 '    nextAction:"Review the day and reader in your Task Map.",',
 '    scores:null,level:null,canEstimateLevel:false}};',
 ' }}}',
 'export function browserTutorConfigured(){return true}',
 'export function readAIFailure(){return null}',
 'export function resetAIFailure(){}',
 ].join('\n');
 await build({root,configFile:false,logLevel:'error',
  plugins:[{
   name:'u01-browser-qa-only-tutor-stub',enforce:'pre',
   resolveId(source,importer){
    if(source==='./english-lesson-tutor'&&importer?.endsWith('/app/foundation-writing-u01.tsx'))
     return '\0sle-u01-knowledge-tutor';
    if(source==='../infrastructure/browser/firebase-ai-browser'&&importer?.endsWith('/app/foundation-writing-u01.tsx'))
     return '\0sle-u01-ai-sdk';
    if(source==='./firebase-ai-browser'&&importer?.endsWith('/infrastructure/browser/client-services.ts'))
     return '\0sle-u01-ai-sdk';
   },
   load(id){
    if(id==='\0sle-u01-knowledge-tutor')
     return "import React from 'react';export function EnglishLessonTutor(){return null}";
    if(id==='\0sle-u01-ai-sdk')return stub;
   },
  }],
  define:{'process.env.NODE_ENV':JSON.stringify('production'),
   'process.env.NEXT_PUBLIC_LEARNING_RUNTIME':JSON.stringify('browser')},
  build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/foundation-writing-u01-browser-entry.tsx'),
    formats:['iife'],name:'SleU01BrowserTest',fileName:()=> 'bundle.js'}},
 });
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 assert(bundle.includes('Saved version'),'U01 saving must be in the real React bundle');
 assert(bundle.includes('Get personal AI Tutor feedback'),'AI Tutor entry must be visible');
 const bin=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(n=>{try{return cp.execFileSync('which',[n],{encoding:'utf8'}).trim()}catch{return ''}})
  .find(Boolean);
 if(!bin)throw Error('Native Chromium missing; browser Save/Restore unverified');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-fw-u01-qa-'));
 const html='<!doctype html><html><head><meta charset="utf-8"></head><body>'+
  '<div id="app"></div><div id="sle-test-result">STARTED</div>'+
  '<script>window.process={env:{NODE_ENV:"production",NEXT_PUBLIC_LEARNING_RUNTIME:"browser"}};window.__u01Calls=0;window.addEventListener("error",e=>'+
  'document.getElementById("sle-test-result").textContent="FAIL_SCRIPT "+String(e.message));'+
  'window.addEventListener("unhandledrejection",e=>'+
  'document.getElementById("sle-test-result").textContent="FAIL_PROMISE "+String(e.reason));</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 const server=http.createServer((_req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});res.end(html);
 });
 async function open(url){
  return new Promise((resolve,reject)=>{
   const child=cp.spawn(bin,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
    '--disable-extensions','--disable-background-networking','--no-first-run',
    '--virtual-time-budget=70000','--dump-dom','--user-data-dir='+profile,url],
    {stdio:['ignore','pipe','pipe']});
   let stdout='',stderr='',expired=false;
   const timer=setTimeout(()=>{expired=true;child.kill('SIGKILL')},55000);
   child.stdout.on('data',d=>stdout+=String(d));child.stderr.on('data',d=>stderr+=String(d));
   child.on('error',reject);
   child.on('close',code=>{
    clearTimeout(timer);
    if(expired||code!==0)return reject(Error('Chromium failed '+code+' '+stderr.slice(-650)));
    const verdict=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]||'';
    if(!verdict.startsWith('PASS_U01_'))return reject(Error('U01 browser FAIL '+verdict.slice(0,1850)));
    resolve(verdict);
   });
  });
 }
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const url='http://127.0.0.1:'+server.address().port;
  const first=await open(url+'/?phase=save');
  const second=await open(url+'/?phase=restore');
  assert.match(first,/^PASS_U01_SAVED/);assert.match(second,/^PASS_U01_RESTORED/);
  console.log(JSON.stringify({result:'PASS',gate:'FW-U01-React-Chromium',
   exactSavedSnapshots:true,restore:true,failedSaveCannotReview:true,retrySave:true,
   historicalLearnerStatePreserved:true,explicitOnlyAI:true,syntheticProvider:true,
   providerRequestsToGoogle:0,realLearnerDataTouched:false,productionWrites:0}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
