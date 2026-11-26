'use strict';
/** Actual multi-skill React component, real Chromium on synthetic local pages.
 * Never touches learner accounts, scores, or original Listening audio.
 * Content widths are not physical Safari/iPad certification.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),http=require('node:http');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite'),out=path.join(root,'.sites-runtime/reading-v23-browser');
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',define:{
  'process.env.NODE_ENV':JSON.stringify('production'),'process.env.NEXT_PUBLIC_LEARNING_RUNTIME':JSON.stringify('browser')
 },build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
  lib:{entry:path.join(root,'tests/reading-knowledge-v23-browser-entry.tsx'),
   formats:['iife'],name:'SleMultiskillBrowser',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 const base=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
 const styles=fs.readFileSync(path.join(root,'app/multiskill-knowledge-v2.css'),'utf8')+'\n'+fs.readFileSync(path.join(root,'app/reading-knowledge-v23.css'),'utf8')+'\n'+fs.readFileSync(path.join(root,'app/foundation-practice-compact.css'),'utf8');
 const start=base.indexOf(':root {');
 assert(start>=0&&styles.includes('.sle-ms-grid')&&styles.includes('.sle-ms-listening-notice'),'Real application CSS required');
 const browser=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(x=>{try{return cp.execFileSync('which',[x],{encoding:'utf8'}).trim()}catch{return ''}}).find(Boolean);
 if(!browser)throw Error('Native Chromium unavailable; cannot assert browser PASS');
 const html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<style>'+(base.slice(start)+'\n'+styles).replaceAll('</style>','<\\/style>')+'</style>'+
 '</head><body style="margin:0;padding:12px"><div id="app"></div><div id="sle-test-result">STARTED</div><div id="sle-test-errors" hidden></div>'+
 '<script>window.process={env:{NODE_ENV:"production"}};'+
 'function recordError(message){document.getElementById("sle-test-errors").textContent+=message+"; ";document.getElementById("sle-test-result").textContent=message;}window.addEventListener("error",e=>recordError("FAIL_SCRIPT "+e.message));'+
 'window.addEventListener("unhandledrejection",e=>recordError("FAIL_REJECTION "+e.reason));</script>'+
 '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 let writes=0;const server=http.createServer((req,res)=>{
  if(req.method!=='GET'){writes++;res.writeHead(405).end('Writes forbidden');return}
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'}).end(html);
 });
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-v2-browser-'));
 const run=(url,lesson,width,profileKey='component')=>new Promise((resolve,reject)=>{
  const child=cp.spawn(browser,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-extensions',
   '--disable-background-networking','--no-first-run','--virtual-time-budget=12000',
   '--dump-dom','--window-size=1280,900','--user-data-dir='+path.join(profile,lesson+'-'+width+'-'+profileKey),url],
  {stdio:['ignore','pipe','pipe']});
  let stdout='',stderr='',expired=false;
  const timeout=setTimeout(()=>{expired=true;child.kill('SIGKILL')},38000);
  child.stdout.on('data',d=>stdout+=String(d));child.stderr.on('data',d=>stderr+=String(d));
  child.on('error',reject);
  child.on('close',code=>{
   clearTimeout(timeout);
   if(expired||code!==0)return reject(Error('Chrome '+lesson+' '+width+' code '+code+': '+stderr.slice(-600)));
   const status=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
   if(status!=='PASS_SLE_READING_'+lesson+'_'+width)reject(Error('Browser '+lesson+' '+width+' '+status.slice(0,1100)));
   else resolve(status);
  });
 });
 const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const runPlayer=async(url,lesson,width,route)=>{
  const dir=path.join(profile,'player-'+lesson+'-'+width+'-'+route);fs.mkdirSync(dir,{recursive:true});
  const child=cp.spawn(browser,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
   '--disable-extensions','--disable-background-networking','--no-first-run',
   '--remote-debugging-address=127.0.0.1','--remote-debugging-port=0','--window-size=1280,900',
   '--user-data-dir='+dir,url],{stdio:['ignore','ignore','pipe']});
  let stderr='',spawnError=null,ws;
  child.stderr.on('data',d=>{stderr=(stderr+String(d)).slice(-2000)});
  child.on('error',e=>{spawnError=e});
  const deadline=Date.now()+38000;
  const caseName=lesson+' '+width+' '+route;
  console.log('READING_PLAYER_START '+caseName);
  let probeTimeouts=0;
  const healthy=()=>{if(spawnError)throw spawnError;if(child.exitCode!==null)throw Error('Chromium exited '+child.exitCode+' '+stderr);if(Date.now()>deadline)throw Error('Chromium real-time deadline '+caseName+'; CDP probe timeouts='+probeTimeouts+'; '+stderr)};
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
   const validate=value=>{if(value.errors)throw Error('Reading player persistent errors '+width+': '+value.errors);if(value.status?.startsWith('FAIL'))throw Error('Reading player real Chromium '+width+': '+value.status);return value};
   // A busy renderer may temporarily miss one polling response. Retry only
   // the read-only transport probe, within the SAME existing wall-clock deadline.
   // Script/fixture errors and assertion failures remain immediate hard failures.
   const probe=async()=>{try{return validate(await snapshot())}catch(e){if(e instanceof Error&&e.message==='CDP evaluation timeout'){probeTimeouts++;healthy();return null}throw e}};
   const status=await until(async()=>{const value=await probe();return value?.status==='PASS_SLE_READING_'+lesson+'_'+width?value.status:null});
   // Delayed observer validation is still mandatory; a timeout cannot count as PASS.
   await delay(300);const final=await until(probe);
   assert.equal(final.errors,'');assert.equal(final.status,status);
   console.log('READING_PLAYER_PASS '+caseName+'; CDP probe timeouts='+probeTimeouts);
   return status;
  }catch(e){
   throw new Error('Reading player failed '+caseName+'; CDP probe timeouts='+probeTimeouts,{cause:e});
  }finally{
   if(ws)ws.close();
   if(child.exitCode===null&&!spawnError){const closed=new Promise(resolve=>child.once('close',resolve));child.kill('SIGTERM');await Promise.race([closed,delay(2000)]);if(child.exitCode===null){child.kill('SIGKILL');await Promise.race([closed,delay(1000)])}}
  }
 };
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const baseUrl='http://127.0.0.1:'+server.address().port,results=[];
  for(const lesson of ['REA-A1-01','REA-A1-09','REA-A2-07','REA-A2-12','REA-B1-09','REA-B2-02','REA-B2-09','REA-C1-01']){
   for(const width of [320,375,768,960]){
    const query=new URLSearchParams({lesson,width:String(width)});
    results.push({lesson,width,result:await run(baseUrl+'/?'+query,lesson,width)});
   }
  }
  const playerCases=[];
  for(const [lesson,version] of [['REA-A1-01','1.18.1'],['REA-A2-01','1.18.1']]){
   for(const route of ['historical','historical-draft']){
    for(const width of [320,375,768,960]){
     const query=new URLSearchParams({lesson,width:String(width),route,version});
     playerCases.push({lesson,width,route,version,result:await runPlayer(baseUrl+'/?'+query,lesson,width,route+'-'+version)});
    }
   }
  }
  for(const lesson of ['REA-A1-01','REA-B1-09','REA-B2-02','REA-C1-01'])for(const width of [320,375,768,960]){
   const route='current',query=new URLSearchParams({lesson,width:String(width),route});
   playerCases.push({lesson,width,route,result:await runPlayer(baseUrl+'/?'+query,lesson,width,route)});
  }
  assert.equal(results.length,32);assert.equal(playerCases.length,32);
  const successorCases=[];
  for(const route of ['historical','historical-draft'])for(const width of [375,768]){
   const lesson='REA-B2-05',version='1.28.0',current='1.28.1';
   const query=new URLSearchParams({lesson,width:String(width),route,version,current});
   successorCases.push({lesson,width,route,version,current,result:await runPlayer(baseUrl+'/?'+query,lesson,width,route+'-successor')});
  }
  assert.equal(successorCases.length,4);assert.equal(writes,0);
  console.log(JSON.stringify({result:'PASS',gate:'SLE_READING_V23_REAL_CHROMIUM',
   cases:results,playerCases,successorCases,actualFoundationRoute:true,browserLocalAcademicService:true,persistedAttemptsCompared:true,source:'reviewed reading',physicalIpadSafari:'NOT_TESTED',realAuth:'NOT_TESTED',
   syntheticOnly:true,backendWrites:0,scoreMutations:0}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
