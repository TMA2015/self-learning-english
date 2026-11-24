'use strict';
/** Actual multi-skill React component, real Chromium on synthetic local pages.
 * Never touches learner accounts, scores, or original Listening audio.
 * Content widths are not physical Safari/iPad certification.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),http=require('node:http');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite'),out=path.join(root,'.sites-runtime/grammar-v23-browser');
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',define:{
  'process.env.NODE_ENV':JSON.stringify('production'),'process.env.NEXT_PUBLIC_LEARNING_RUNTIME':JSON.stringify('browser')
 },build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
  lib:{entry:path.join(root,'tests/grammar-knowledge-v23-browser-entry.tsx'),
   formats:['iife'],name:'SleGrammarV23Browser',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 const base=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
 const styles=fs.readFileSync(path.join(root,'app/grammar-a1-02-notes.css'),'utf8')+'\n'+fs.readFileSync(path.join(root,'app/grammar-knowledge-v23.css'),'utf8')+'\n'+fs.readFileSync(path.join(root,'app/foundation-practice-compact.css'),'utf8');
 const start=base.indexOf(':root {');
 assert(start>=0&&styles.includes('.sle-grammar-v23')&&styles.includes('.sle-gra02-answer'),'Real application CSS required');
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
 const run=(url,lesson,width,route='component')=>new Promise((resolve,reject)=>{
  const child=cp.spawn(browser,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-extensions',
   '--disable-background-networking','--no-first-run','--virtual-time-budget=12000',
   '--dump-dom','--window-size=1280,900','--user-data-dir='+path.join(profile,lesson+'-'+width+'-'+route),url],
  {stdio:['ignore','pipe','pipe']});
  let stdout='',stderr='',expired=false;
  const timeout=setTimeout(()=>{expired=true;child.kill('SIGKILL')},38000);
  child.stdout.on('data',d=>stdout+=String(d));child.stderr.on('data',d=>stderr+=String(d));
  child.on('error',reject);
  child.on('close',code=>{
   clearTimeout(timeout);
   if(expired||code!==0)return reject(Error('Chrome '+lesson+' '+width+' code '+code+': '+stderr.slice(-600)));
   const status=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
   if(status!=='PASS_SLE_GRAMMAR_V23_'+lesson+'_'+width)reject(Error('Browser '+lesson+' '+width+' '+status.slice(0,1100)));
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
   const validate=value=>{if(value.errors)throw Error('Grammar player persistent errors '+width+': '+value.errors);if(value.status?.startsWith('FAIL'))throw Error('Grammar player real Chromium '+width+': '+value.status);return value};
   const status=await until(async()=>{const value=validate(await snapshot());return value.status==='PASS_SLE_GRAMMAR_V23_'+lesson+'_'+width?value.status:null});
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
  for(const lesson of ["GRA-A1-02","GRA-A1-06","GRA-A1-12","GRA-A2-08","GRA-B1-01","GRA-B1-08","GRA-A1-01","GRA-A1-03","GRA-A1-04","GRA-A1-05","GRA-A1-07","GRA-A1-08","GRA-A1-09","GRA-A1-10","GRA-A1-11","GRA-A2-09","GRA-A2-10","GRA-A2-11","GRA-A2-12","GRA-A2-13","GRA-A2-14","GRA-A2-15","GRA-A2-16","GRA-A2-01","GRA-A2-02","GRA-A2-03","GRA-A2-04","GRA-A2-05","GRA-A2-06","GRA-A2-07","GRA-B1-02","GRA-B1-03","GRA-B1-04","GRA-B1-05","GRA-B1-06","GRA-B1-07","GRA-B1-09","GRA-B1-10","GRA-B1-11","GRA-B1-12","GRA-B2-01","GRA-B2-02"]){
   for(const width of [375,768,960]){
    const query=new URLSearchParams({lesson,width:String(width)});
    results.push({lesson,width,result:await run(baseUrl+'/?'+query,lesson,width)});
   }
  }
  assert.equal(results.length,126);
  const playerCases=[];
  for(const [lesson,route] of [['GRA-B2-01','current'],['GRA-B2-02','current'],['GRA-A2-07','historical'],['GRA-A2-07','historical-draft']])for(const width of [375,768,960]){
   const query=new URLSearchParams({lesson,width:String(width),route});
   playerCases.push({lesson,width,route,result:await runPlayer(baseUrl+'/?'+query,lesson,width,route)});
  }
  assert.equal(playerCases.length,12);assert.equal(writes,0);
  console.log(JSON.stringify({result:'PASS',gate:'SLE_GRAMMAR_V23_REAL_CHROMIUM',
   cases:results,playerCases,actualFoundationRoute:true,browserLocalAcademicService:true,persistedAttemptsCompared:true,source:'reviewed instruction',physicalIpadSafari:'NOT_TESTED',realAuth:'NOT_TESTED',
   syntheticOnly:true,backendWrites:0,scoreMutations:0}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
