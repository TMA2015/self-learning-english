'use strict';
/** Real Chromium, isolated synthetic post-submit review. No learner data or LIVE access. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const cp=require('node:child_process'),http=require('node:http');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime/learner-result-browser');
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',
  define:{'process.env.NODE_ENV':JSON.stringify('production')},
  build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/learner-result-browser-entry.tsx'),
    formats:['iife'],name:'SLEResultBrowser',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 const css=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
 const bin=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(x=>{try{return cp.execFileSync('which',[x],{encoding:'utf8'}).trim()}catch{return ''}}).find(Boolean);
 if(!bin)throw Error('Native Chromium missing; results QA not verified');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-result-review-'));
 const html='<!doctype html><html><head><meta charset="utf-8">'+
  '<meta name="viewport" content="width=device-width,initial-scale=1">'+
  '<style>'+css.slice(css.indexOf(':root {')).replaceAll('</style>','<\\/style>')+'</style></head><body>'+
  '<div id="app"></div><div id="sle-test-result">STARTED</div>'+
  '<script>window.addEventListener("error",e=>document.getElementById("sle-test-result").textContent="FAIL_SCRIPT "+e.message);'+
  'window.addEventListener("unhandledrejection",e=>document.getElementById("sle-test-result").textContent="FAIL_REJECTION "+e.reason);</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 let writes=0;
 const server=http.createServer((req,res)=>{
  if(req.method!=='GET'){writes++;res.writeHead(405).end('Synthetic test is read only');return;}
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});
  res.end(html);
 });
 function open(url){
  return new Promise((resolve,reject)=>{
   const child=cp.spawn(bin,['--headless=new','--no-sandbox',
    '--disable-dev-shm-usage','--disable-extensions','--disable-background-networking',
    '--no-first-run','--virtual-time-budget=40000','--dump-dom',
    '--window-size=1024,900','--user-data-dir='+profile,url],
    {stdio:['ignore','pipe','pipe']});
   let stdout='',stderr='',expired=false;
   const timeout=setTimeout(()=>{expired=true;child.kill('SIGKILL')},35000);
   child.stdout.on('data',d=>stdout+=String(d));child.stderr.on('data',d=>stderr+=String(d));
   child.on('error',reject);
   child.on('close',code=>{
    clearTimeout(timeout);
    if(expired||code!==0)return reject(Error('Chromium '+code+' '+stderr.slice(-450)));
    const result=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
    if(!result.startsWith('PASS_'))return reject(Error('Review UI Chromium FAIL: '+result.slice(0,1500)));
    resolve(result);
   });
  });
 }
 const cases=[['wrong',320],['wrong',375],['allcorrect',768],['started',320]];
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const url='http://127.0.0.1:'+server.address().port;
  const results=[];
  for(const [phase,width] of cases){
   const result=await open(url+'/?phase='+phase+'&width='+width);
   results.push({phase,width,result});
  }
  assert.equal(results.length,4);
  assert.equal(writes,0);
  console.log(JSON.stringify({result:'PASS',gate:'ACTIONABLE_RESULT_NATIVE_CHROMIUM',
   cases:results,scoreDuplication:false,reviewJump:true,
   contentWidths:[320,375,768],syntheticOnly:true,serverWrites:0,
   realSafariIpad:'NOT_TESTED',productionWrites:0}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
