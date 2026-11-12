'use strict';
/**
 * Native Chromium rendering for reviewed Vocabulary A1/A2/B1 educational overlay.
 * Synthetic DOM fixtures and no authenticated learner state or production requests.
 * 320/375/768px content containers; NOT actual Safari/iPad or CDP true viewport QA.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const cp=require('node:child_process'),http=require('node:http');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const dir=path.join(root,'.sites-runtime/vocabulary-pilot-browser');
 fs.rmSync(dir,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',define:{
  'process.env.NODE_ENV':JSON.stringify('production')
 },build:{outDir:dir,emptyOutDir:true,target:'es2022',minify:false,
  lib:{entry:path.join(root,'tests/vocabulary-pilot-browser-entry.tsx'),
   formats:['iife'],name:'SLEVocabularyPilotBrowser',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(dir,'bundle.js'),'utf8');
 const css=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
 const start=css.indexOf(':root {');
 assert(start>=0,'Authoritative stylesheet required');
 const binary=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(x=>{try{return cp.execFileSync('which',[x],{encoding:'utf8'}).trim()}
   catch{return ''}}).find(Boolean);
 if(!binary)throw Error('Native Chromium missing; real browser test cannot be PASS');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-vocab-test-'));
 const html='<!doctype html><html><head><meta charset="utf-8">'+
  '<meta name="viewport" content="width=device-width,initial-scale=1">'+
  '<style>'+css.slice(start).replaceAll('</style>','<\\/style>')+'</style></head><body>'+
  '<div id="app"></div><div id="sle-test-result">STARTED</div>'+
  '<script>window.addEventListener("error",e=>document.getElementById("sle-test-result").textContent="FAIL_SCRIPT "+e.message);'+
  'window.addEventListener("unhandledrejection",e=>document.getElementById("sle-test-result").textContent="FAIL_REJECTION "+e.reason);</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 let writes=0;
 const server=http.createServer((req,res)=>{
  if(req.method!=='GET'){writes++;res.writeHead(405).end('No writes allowed');return;}
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});
  res.end(html);
 });
 async function run(url){
  return await new Promise((resolve,reject)=>{
   const child=cp.spawn(binary,['--headless=new','--no-sandbox',
    '--disable-dev-shm-usage','--disable-extensions','--disable-background-networking',
    '--no-first-run','--virtual-time-budget=40000','--dump-dom',
    '--window-size=1024,900','--user-data-dir='+profile,url],
    {stdio:['ignore','pipe','pipe']});
   let stdout='',stderr='',expired=false;
   const timer=setTimeout(()=>{expired=true;child.kill('SIGKILL')},35000);
   child.stdout.on('data',d=>stdout+=String(d));child.stderr.on('data',d=>stderr+=String(d));
   child.on('error',reject);
   child.on('close',code=>{
    clearTimeout(timer);
    if(expired||code!==0)return reject(Error('Chromium exit '+code+' '+stderr.slice(-500)));
    const status=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
    if(!status.startsWith('PASS_'))return reject(Error('Vocabulary React browser FAILED '+url+': '+status.slice(0,1500)));
    resolve(status);
   });
  });
 }
 const cases=[
  ['VOC-A1-01','teaching',320],
  ['VOC-A2-01','teaching',320],
  ['VOC-B1-01','teaching',375],
  ['VOC-A2-01','a2wrong',320],
  ['VOC-A2-01','a2correct',320],
  ['VOC-B1-01','b1wrong',375],
  ['VOC-A2-01','shortwrong',320],
  ['VOC-A2-01','format',320],
  ['VOC-A2-01','variant',320],
  ['VOC-A2-01','otherwrong',320],
  ['VOC-A2-01','a2wrong',768],
  ['VOC-A2-01','a2wrong',320,'1.24.0']
 ];
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base='http://127.0.0.1:'+server.address().port;
  const outcomes=[];
  for(const [lesson,phase,width,version] of cases){
   const args=new URLSearchParams({lesson,phase,width:String(width),version:version??'1.25.0'});
   const result=await run(base+'/?'+args);
   outcomes.push({lesson,phase,width,version:version??'1.25.0',result});
  }
  assert.equal(outcomes.length,12);
  assert.equal(outcomes.filter(c=>c.result==='PASS_VERSION_GUARD').length,1);
  assert.equal(writes,0,'No browser fixture may write learner or server state');
  console.log(JSON.stringify({result:'PASS',gate:'VOCABULARY_PILOT_R1_NATIVE_CHROMIUM',
   cases:outcomes,reviewedLessons:3,syntheticOnly:true,networkWrites:0,
   contentContainerWidths:[320,375,768],postSubmitGate:true,
   actualDeviceViewport:'NOT_TESTED',realSafariIpad:'NOT_TESTED',
   productionWrites:0}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
