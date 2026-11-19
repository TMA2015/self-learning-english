'use strict';
/** Real native Chromium + actual SLE localLearnerState service, synthetic learner fixture only. */
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os');
const path=require('node:path'),http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime/foundation-writing-wave4-readback');
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',
  define:{'process.env.NODE_ENV':JSON.stringify('production'),
   'process.env.NEXT_PUBLIC_LEARNING_RUNTIME':JSON.stringify('browser')},
  build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/foundation-writing-wave4-readback-browser-entry.ts'),
    formats:['iife'],name:'SleWave4Readback',fileName:()=> 'bundle.js'}},
 });
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 assert(bundle.includes('PASS_FW_W4_WRITE'),'real-state persistence entry must be present');
 const bin=['google-chrome','google-chrome-stable','chromium','chromium-browser']
   .map(name=>{try{return cp.execFileSync('which',[name],{encoding:'utf8'}).trim()}catch{return ''}}).find(Boolean);
 if(!bin)throw Error('Native Chromium missing: cannot claim real browser persistence PASS');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-fw-wave4-readback-'));
 const html='<!doctype html><html><head><meta charset="utf-8"></head><body>'+
  '<div id="sle-test-result">STARTED</div>'+
  '<script>window.process={env:{NODE_ENV:"production",NEXT_PUBLIC_LEARNING_RUNTIME:"browser"}};'+
  'window.addEventListener("error",e=>{document.getElementById("sle-test-result").textContent="FAIL_JS "+String(e.message)});'+
  'window.addEventListener("unhandledrejection",e=>{document.getElementById("sle-test-result").textContent="FAIL_PROMISE "+String(e.reason)});</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 const server=http.createServer((_req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});
  res.end(html);
 });
 async function run(url,phase){
  return await new Promise((resolve,reject)=>{
   const child=cp.spawn(bin,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
    '--disable-extensions','--disable-background-networking','--no-first-run',
    '--virtual-time-budget=80000','--dump-dom','--user-data-dir='+profile,url],
    {stdio:['ignore','pipe','pipe']});
   let stdout='',stderr='',expired=false;
   const timer=setTimeout(()=>{expired=true;child.kill('SIGKILL')},55000);
   child.stdout.on('data',d=>stdout+=String(d));child.stderr.on('data',d=>stderr+=String(d));
   child.on('error',reject);child.on('close',code=>{
    clearTimeout(timer);
    if(expired||code!==0)return reject(Error('Chromium '+phase+' failed '+code+' '+stderr.slice(-1100)));
    const res=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
    if(!res.startsWith('PASS_FW_W4_'+phase.toUpperCase()))
      return reject(Error('Wave4 '+phase+' actual storage FAIL: '+res.slice(0,1500)));
    resolve(res);
   });
  });
 }
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const host='http://127.0.0.1:'+server.address().port;
  const phases=['write','restore','verify'],statuses=[];
  for(const phase of phases)statuses.push(await run(host+'/?phase='+phase,phase));
  console.log(JSON.stringify({result:'PASS',gate:'FOUNDATION_WRITING_WAVE4_REAL_CHROMIUM_STORAGE',
   phases,realChromium:true,actualSLELocalRuntime:true,actualStorageReadback:true,
   browserRestarts:2,allUnits:['FW-U10','FW-U11','FW-U12'],
   immutableU09DraftV1:true,versionHistory:true,syntheticWriteFailure:true,
   productionWrites:0,liveProviderCalls:0,learnerFacingWave4UI:'NOT_IMPLEMENTED',
   physicalIpadSafari:'NOT_TESTED',approvedFullSource:'NOT_INCLUDED'}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
