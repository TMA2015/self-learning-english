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
 // Native Chromium with normal frame/timer scheduling. Virtual-time
 // dump-dom may advance polling timers without delivering resize/paint frames.
 const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const run=async(url,width)=>{
  const dir=path.join(profile,'profile-'+width);fs.mkdirSync(dir,{recursive:true});
  const child=cp.spawn(browser,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
   '--disable-extensions','--disable-background-networking','--no-first-run',
   '--remote-debugging-address=127.0.0.1','--remote-debugging-port=0','--window-size=1280,900',
   '--user-data-dir='+dir,url],{stdio:['ignore','ignore','pipe']});
  let stderr='',spawnError=null,ws;
  child.stderr.on('data',d=>{stderr=(stderr+String(d)).slice(-2000)});
  child.on('error',e=>{spawnError=e});
  const deadline=Date.now()+38000;
  const healthy=()=>{if(spawnError)throw spawnError;if(child.exitCode!==null)throw Error('Chromium exited '+child.exitCode+' '+stderr);if(Date.now()>deadline)throw Error('Chromium real-time deadline '+width+' '+stderr)};
  const until=async(fn)=>{for(;;){healthy();const value=await fn();if(value)return value;await delay(50)}};
  try{
   const port=await until(()=>{try{return Number(fs.readFileSync(path.join(dir,'DevToolsActivePort'),'utf8').split('\n')[0])||null}catch{return null}});
   const target=await until(async()=>{try{const res=await fetch('http://127.0.0.1:'+port+'/json/list',{signal:AbortSignal.timeout(1500)});if(!res.ok)return null;return (await res.json()).find(t=>t.type==='page'&&t.url===url&&t.webSocketDebuggerUrl)}catch{return null}});
   ws=new WebSocket(target.webSocketDebuggerUrl);
   await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('CDP connect timeout')),3000);ws.addEventListener('open',()=>{clearTimeout(timer);resolve()},{once:true});ws.addEventListener('error',()=>{clearTimeout(timer);reject(Error('CDP connection failed'))},{once:true})});
   let seq=0;
   const read=()=>new Promise((resolve,reject)=>{
    const id=++seq;
    const clean=()=>{clearTimeout(timer);ws.removeEventListener('message',onMessage)};
    const onMessage=event=>{const m=JSON.parse(event.data);if(m.id!==id)return;clean();if(m.error||m.result?.exceptionDetails)reject(Error('CDP evaluation failed '+JSON.stringify(m)));else resolve(m.result?.result?.value)};
    const timer=setTimeout(()=>{clean();reject(Error('CDP evaluation timeout'))},2000);
    ws.addEventListener('message',onMessage);
    ws.send(JSON.stringify({id,method:'Runtime.evaluate',params:{expression:"JSON.stringify({status:document.getElementById('sle-test-result')?.textContent,errors:document.getElementById('sle-test-errors')?.textContent})",returnByValue:true}}));
   });
   const snapshot=async()=>JSON.parse(await read());
   const validate=value=>{if(value.errors)throw Error('Adaptive Chromium persistent errors '+width+': '+value.errors);if(value.status?.startsWith('FAIL'))throw Error('Adaptive real Chromium '+width+': '+value.status);return value};
   const status=await until(async()=>{const value=validate(await snapshot());return value.status==='PASS_ADAPTIVE_PRACTICE_'+width?value.status:null});
   // Check delayed observer errors after the fixture has completed.
   await delay(300);const final=validate(await snapshot());
   assert.equal(final.errors,'');assert.equal(final.status,status);
   return status;
  }finally{
   if(ws)ws.close();
   if(child.exitCode===null&&!spawnError){const closed=new Promise(resolve=>child.once('close',resolve));child.kill('SIGTERM');await Promise.race([closed,delay(2000)]);if(child.exitCode===null){child.kill('SIGKILL');await Promise.race([closed,delay(1000)])}}
  }
 };
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const baseUrl='http://127.0.0.1:'+server.address().port,results=[];
  for(const width of [375,550,960])results.push({width,status:await run(baseUrl+'/?width='+width,width)});
  assert.equal(writes,0,'Never write learner data to server');
  console.log(JSON.stringify({result:'PASS',gate:'SLE_ADAPTIVE_PRACTICE_V31_REAL_CHROMIUM',
   cases:results,source:'Actual shared React controls and CSS',
   optionMeasurement:true,inlineInput:true,containerResize:true,answerPreservation:true,repeatedResizeTransitions:15,persistentBrowserErrorCheck:true,realTimeFrames:true,
   syntheticOnly:true,productionWrites:0,authenticatedSite:'NOT_TESTED',physicalSafari:'NOT_TESTED'}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
