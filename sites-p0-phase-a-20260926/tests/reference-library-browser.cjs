'use strict';
/** Real Chromium, temporary profile, synthetic catalog; NO user data or site writes. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime/reference-browser');
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',
  define:{'process.env.NODE_ENV':JSON.stringify('production'),
    'process.env.NEXT_PUBLIC_LEARNING_RUNTIME':JSON.stringify('browser')},
  build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/reference-library-browser-entry.tsx'),formats:['iife'],
    name:'SleReferenceBrowserTest',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 const bins=['google-chrome','google-chrome-stable','chromium','chromium-browser'];
 const executable=bins.map(name=>{
  try{return cp.execFileSync('which',[name],{encoding:'utf8'}).trim()}
  catch{return ''}
 }).find(Boolean);
 if(!executable)throw Error('Native Chromium missing; real browser reference QA is NOT verified');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-reference-browser-'));
 const html='<!doctype html><html><head><meta charset="utf-8"></head><body>'+
  '<div id="app"></div><div id="sle-test-result">STARTED</div>'+
  '<script>window.addEventListener("error",e=>document.getElementById("sle-test-result").textContent="FAIL_SCRIPT "+e.message);'+
  'window.addEventListener("unhandledrejection",e=>document.getElementById("sle-test-result").textContent="FAIL_REJECTION "+e.reason);</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 const server=http.createServer((_req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});
  res.end(html);
 });
 async function run(url){
  return await new Promise((resolve,reject)=>{
   const child=cp.spawn(executable,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
    '--disable-extensions','--disable-background-networking','--no-first-run',
    '--virtual-time-budget=45000','--dump-dom','--window-size=390,844',
    '--user-data-dir='+profile,url],{stdio:['ignore','pipe','pipe']});
   let stdout='',stderr='',timedout=false;
   const timer=setTimeout(()=>{timedout=true;child.kill('SIGKILL')},40000);
   child.stdout.on('data',d=>stdout+=String(d));
   child.stderr.on('data',d=>stderr+=String(d));
   child.on('error',reject);
   child.on('close',code=>{
    clearTimeout(timer);
    if(timedout||code!==0)return reject(Error('Chrome failed '+code+' '+stderr.slice(-450)));
    const text=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
    if(!text.startsWith('PASS_'))return reject(Error('Real Chromium reference QA FAILED: '+text.slice(0,1500)));
    resolve(text);
   });
  });
 }
 try{
  await new Promise((resolve,reject)=>{
   server.once('error',reject);server.listen(0,'127.0.0.1',resolve);
  });
  const host='http://127.0.0.1:'+server.address().port;
  const results=[];
  for(const phase of ['search','catalog','missing']){
   const result=await run(host+'/?phase='+phase);
   results.push(result);
  }
  assert.match(results[0],/^PASS_SEARCH_FILTERS/);
  assert.match(results[1],/^PASS_CATALOG_LINK/);
  assert.match(results[2],/^PASS_MISSING_CATALOG/);
  console.log(JSON.stringify({result:'PASS',gate:'ReferenceLibrary-real-Chromium',
   syntheticCatalog:true,searchAndFilters:true,
   canonicalRelatedLessonCallback:true,missingCatalogBlocked:true,
   browser:'Chromium',realSafariIpad:'NOT_TESTED',productionWrites:0}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
