'use strict';
/** Non-production Chromium integration: React UI Save/Restore/Clear with synthetic work. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime/p0-writing-browser');
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',
  define:{'process.env.NODE_ENV':JSON.stringify('production')},
  build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/p0-writing-review-browser-entry.tsx'),formats:['iife'],
    name:'SleP0WritingBrowser',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 const bin=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(name=>{try{return cp.execFileSync('which',[name],{encoding:'utf8'}).trim()}catch{return ''}})
  .find(Boolean);
 if(!bin)throw Error('Native Chromium missing — real browser QA NOT verified');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-p0-writing-qa-'));
 const html='<!doctype html><html><head><meta charset="utf-8"></head><body>'+
  '<div id="app"></div><div id="sle-test-result">STARTED</div>'+
  '<script>window.addEventListener("error",e=>document.getElementById("sle-test-result").textContent="FAIL_SCRIPT "+e.message);'+
  'window.addEventListener("unhandledrejection",e=>document.getElementById("sle-test-result").textContent="FAIL_REJECTION "+e.reason);</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 const server=http.createServer((_req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});res.end(html);
 });
 async function open(url){
  return await new Promise((resolve,reject)=>{
   const child=cp.spawn(bin,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
    '--disable-extensions','--disable-background-networking','--no-first-run',
    '--virtual-time-budget=65000','--dump-dom','--user-data-dir='+profile,url],
    {stdio:['ignore','pipe','pipe']});
   let stdout='',stderr='',expired=false;
   const timer=setTimeout(()=>{expired=true;child.kill('SIGKILL')},55000);
   child.stdout.on('data',d=>stdout+=String(d));child.stderr.on('data',d=>stderr+=String(d));
   child.on('error',reject);
   child.on('close',code=>{
    clearTimeout(timer);
    if(expired||code!==0)return reject(Error('Chrome exit '+code+' '+stderr.slice(-900)));
    const result=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
    if(!result.startsWith('PASS_'))return reject(Error('React UI browser FAILED: '+result.slice(0,1300)+' '+stderr.slice(-400)));
    resolve(result);
   });
  });
 }
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const url='http://127.0.0.1:'+server.address().port;
  const first=await open(url+'/?phase=save');
  const second=await open(url+'/?phase=restore');
  assert.match(first,/^PASS_SAVED/);assert.match(second,/^PASS_RESTORE_CLEAR/);
  console.log(JSON.stringify({result:'PASS',gate:'P0-Writing-Review-real-Chromium',
   syntheticOnly:true,profileTemporary:true,localSave:true,restore:true,
   clear:true,staleReviewHidden:true,liveSiteTouched:false,productionWrites:0}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
