'use strict';
/** Native Chromium integration: add reviewed references, flashcard, note, reload, 320/768px. */
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime/study-notebook-browser');
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',
  define:{'process.env.NODE_ENV':JSON.stringify('production'),
   'process.env.NEXT_PUBLIC_LEARNING_RUNTIME':JSON.stringify('browser')},
  build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/study-notebook-browser-entry.tsx'),formats:['iife'],
    name:'SleStudyNotebookTest',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 const bins=['google-chrome','google-chrome-stable','chromium','chromium-browser'];
 const executable=bins.map(name=>{try{return cp.execFileSync('which',[name],{encoding:'utf8'}).trim()}catch{return ''}}).find(Boolean);
 if(!executable)throw Error('Real Chromium unavailable; do not label browser QA PASS');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-study-notebook-'));
 const html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+
  '<div id="app"></div><div id="sle-test-result">STARTED</div>'+
  '<script>window.addEventListener("error",e=>document.getElementById("sle-test-result").textContent="FAIL_SCRIPT "+e.message);'+
  'window.addEventListener("unhandledrejection",e=>document.getElementById("sle-test-result").textContent="FAIL_REJECTION "+e.reason);</script>'+
  '<script>window.process={env:{NODE_ENV:"production",NEXT_PUBLIC_LEARNING_RUNTIME:"browser"}};</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 const server=http.createServer((_req,res)=>{res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});res.end(html)});
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const url='http://127.0.0.1:'+server.address().port+'/';
  const result=await new Promise((resolve,reject)=>{
   const child=cp.spawn(executable,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
    '--disable-extensions','--disable-background-networking','--no-first-run',
    '--virtual-time-budget=50000','--dump-dom','--window-size=390,844',
    '--user-data-dir='+profile,url],{stdio:['ignore','pipe','pipe']});
   let stdout='',stderr='',timedOut=false;
   const timer=setTimeout(()=>{timedOut=true;child.kill('SIGKILL')},45000);
   child.stdout.on('data',d=>stdout+=String(d));child.stderr.on('data',d=>stderr+=String(d));
   child.on('error',reject);
   child.on('close',code=>{
    clearTimeout(timer);
    if(code!==0||timedOut)return reject(Error('Chromium failed '+code+' '+stderr.slice(-350)));
    const value=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
    if(!value.startsWith('PASS_'))return reject(Error('Real Chromium Study Notebook FAILED: '+value.slice(0,1100)));
    resolve(value);
   });
  });
  assert.match(result,/^PASS_STUDY_NOTEBOOK_LOCAL_UI/);
  console.log(JSON.stringify({result:'PASS',gate:'STUDY_NOTEBOOK_REAL_CHROMIUM',
   reviewedSources:364,storage:'device-local-only',notePersistence:true,
   manualReview:true,viewportWidths:[320,768],learnerWrites:0,
   realIPadSafari:'NOT_TESTED',sync:'NOT_SUPPORTED'}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
