'use strict';
/** Adaptive practice v3.1: actual shared React controls; isolated fixtures, no learner writes. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const dest=path.join(root,'.sites-runtime/adaptive-practice-browser');
 fs.rmSync(dest,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',
  define:{'process.env.NODE_ENV':JSON.stringify('production')},
  build:{outDir:dest,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/adaptive-practice-browser-entry.tsx'),
    formats:['iife'],name:'SleAdaptivePracticeFixture',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(dest,'bundle.js'),'utf8');
 const base=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
 const practice=fs.readFileSync(path.join(root,'app/foundation-practice-compact.css'),'utf8');
 const knowledge='';
 const start=base.indexOf(':root {');
 assert(start>=0&&practice.includes('.foundation-option-grid')&&practice.includes('data-practice-adaptive'),'Actual practice styles must load');
 const browser=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(n=>{try{return cp.execFileSync('which',[n],{encoding:'utf8'}).trim()}catch{return ''}})
  .find(Boolean);
 if(!browser)throw Error('Native Chromium missing — cannot pass combined browser QA');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-adaptive-practice-'));
 const html='<!doctype html><html><head><meta charset="utf-8">'+
  '<meta name="viewport" content="width=device-width,initial-scale=1">'+
  '<style>'+(base.slice(start)+'\n'+practice+'\n'+knowledge).replaceAll('</style>','<\\/style>')+'</style>'+
  '</head><body style="margin:0;padding:10px"><div id="app"></div><div id="sle-test-result">STARTED</div><div id="sle-test-errors" hidden></div>'+
  '<script>window.process={env:{NODE_ENV:"production"}};'+
  'function recordError(message){document.getElementById("sle-test-errors").textContent+=message+"; ";document.getElementById("sle-test-result").textContent=message;}window.addEventListener("error",e=>recordError("FAIL_SCRIPT "+e.message));'+
  'window.addEventListener("unhandledrejection",e=>recordError("FAIL_REJECTION "+e.reason));</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 let writes=0;
 const server=http.createServer((req,res)=>{
  if(req.method!=='GET'){writes++;res.writeHead(405).end('No writes');return}
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'}).end(html);
 });
 const run=(url,width)=>new Promise((resolve,reject)=>{
  const child=cp.spawn(browser,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
   '--disable-extensions','--disable-background-networking','--no-first-run',
   '--virtual-time-budget=12000','--dump-dom','--window-size=1280,900',
   '--user-data-dir='+path.join(profile,'profile-'+width),url],{stdio:['ignore','pipe','pipe']});
  let stdout='',stderr='',expired=false;
  const timer=setTimeout(()=>{expired=true;child.kill('SIGKILL')},38000);
  child.stdout.on('data',d=>stdout+=String(d));child.stderr.on('data',d=>stderr+=String(d));
  child.on('error',reject);
  child.on('close',code=>{
   clearTimeout(timer);
   if(expired||code!==0)return reject(Error('Chromium '+width+' exited '+code+' '+stderr.slice(-400)));
   const status=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
   const errors=stdout.match(/<div id="sle-test-errors"[^>]*>([\s\S]*?)<\/div>/)?.[1];
   if(errors!=='')return reject(Error('Adaptive Chromium persistent errors '+width+': '+String(errors).slice(0,1400)));
   if(status!=='PASS_ADAPTIVE_PRACTICE_'+width)return reject(Error('Adaptive real Chromium '+width+': '+status.slice(0,1400)));
   resolve(status);
  });
 });
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const baseUrl='http://127.0.0.1:'+server.address().port,results=[];
  for(const width of [375,550,960])results.push({width,status:await run(baseUrl+'/?width='+width,width)});
  assert.equal(writes,0,'Never write learner data to server');
  console.log(JSON.stringify({result:'PASS',gate:'SLE_ADAPTIVE_PRACTICE_V31_REAL_CHROMIUM',
   cases:results,source:'Actual shared React controls and CSS',
   optionMeasurement:true,inlineInput:true,containerResize:true,answerPreservation:true,repeatedResizeTransitions:15,persistentBrowserErrorCheck:true,
   syntheticOnly:true,productionWrites:0,authenticatedSite:'NOT_TESTED',physicalSafari:'NOT_TESTED'}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
