'use strict';
/**
 * Native Chromium DOM layout checks at 320px / 768px fixed content widths,
 * with the actual SLE reference CSS. This is NOT real iPad/Safari QA and
 * Includes a separate CDP emulation of actual CSS viewport dimensions.
 * Synthetic catalog and empty local writing only.
 */
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime/p1-responsive-browser');
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',
  define:{'process.env.NODE_ENV':JSON.stringify('production'),
    'process.env.NEXT_PUBLIC_LEARNING_RUNTIME':JSON.stringify('browser')},
  build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/p1-responsive-browser-entry.tsx'),formats:['iife'],
    name:'SleResponsiveTest',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 const originalCSS=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
 const start=originalCSS.indexOf(':root {');
 if(start<0||!originalCSS.includes('/* SLE P1 Reference Library:'))
  throw Error('Original SLE stylesheet and Reference rules missing');
 // Remove build-only Tailwind imports, but exercise actual committed CSS rules.
 const siteCSS=originalCSS.slice(start);
 const bin=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(name=>{try{return cp.execFileSync('which',[name],{encoding:'utf8'}).trim()}
   catch{return ''}}).find(Boolean);
 if(!bin)throw Error('Chromium required: cannot claim responsive layout PASS without browser');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-p1-responsive-'));
 const html='<!doctype html><html><head><meta charset="utf-8">'+
  '<meta name="viewport" content="width=device-width,initial-scale=1">'+
  '<style>'+siteCSS.replaceAll('</style>','<\\/style>')+'</style></head><body>'+
  '<div id="app"></div><div id="sle-test-result">STARTED</div>'+
  '<script>window.addEventListener("error",e=>document.getElementById("sle-test-result").textContent="FAIL_SCRIPT "+e.message);'+
  'window.addEventListener("unhandledrejection",e=>document.getElementById("sle-test-result").textContent="FAIL_REJECTION "+e.reason);</script>'+
  '<script>window.process={env:{NODE_ENV:"production",NEXT_PUBLIC_LEARNING_RUNTIME:"browser"}};</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 const server=http.createServer((_req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});
  res.end(html);
 });
 async function run(url,width){
  return await new Promise((resolve,reject)=>{
   const child=cp.spawn(bin,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
    '--disable-extensions','--disable-background-networking','--no-first-run',
    '--force-device-scale-factor=1','--virtual-time-budget=45000','--dump-dom',
    '--window-size='+width+',840','--user-data-dir='+profile,url],
   {stdio:['ignore','pipe','pipe']});
   let stdout='',stderr='',timedout=false;
   const timer=setTimeout(()=>{timedout=true;child.kill('SIGKILL')},40000);
   child.stdout.on('data',d=>stdout+=String(d));
   child.stderr.on('data',d=>stderr+=String(d));
   child.on('error',reject);
   child.on('close',code=>{
    clearTimeout(timer);
    if(timedout||code!==0)return reject(Error('Chromium exit '+code+' '+stderr.slice(-650)));
    const result=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
    if(!result.startsWith('PASS_RESPONSIVE'))
      return reject(Error('Responsive Chromium test failed: '+result.slice(0,1500)));
    resolve(result);
   });
  });
 }
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);
   server.listen(0,'127.0.0.1',resolve)});
  const origin='http://127.0.0.1:'+server.address().port;
  const results=[];
  for(const width of [320,768]){
   for(const mode of ['reference','writing']){
    const result=await run(origin+'/?mode='+mode+'&width='+width,width);
    results.push(JSON.parse(result.slice('PASS_RESPONSIVE '.length)));
   }
  }
  if(results.length!==4)throw Error('Missing one of the four native Chromium layout cases');

  // A Chrome --window-size=320 request can still yield a 500px minimum
  // innerWidth. Exercise the TRUE CSS/device viewport via CDP instead.
  // Node 24 provides WebSocket natively; no external package or cloud service.
  async function realViewportCases(){
   if(typeof WebSocket!=='function')throw Error('Node 24 native WebSocket is required for CDP viewport QA');
   const debugProfile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-cdp-mobile-'));
   const browser=cp.spawn(bin,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
    '--disable-extensions','--disable-background-networking','--no-first-run',
    '--remote-debugging-port=0','--remote-debugging-address=127.0.0.1',
    '--remote-allow-origins=*','--window-size=800,840',
    '--user-data-dir='+debugProfile,'about:blank'],{stdio:'ignore'});
   const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
   let socket=null;
   const pending=new Map();
   let nextId=0;
   const command=(method,params={})=>new Promise((resolve,reject)=>{
    const id=++nextId;
    pending.set(id,{resolve,reject});
    socket.send(JSON.stringify({id,method,params}));
   });
   try{
    let port;
    const activePort=path.join(debugProfile,'DevToolsActivePort');
    for(let i=0;i<240;i++){
     if(browser.exitCode!==null)throw Error('Chromium CDP exited before opening debugging socket');
     if(fs.existsSync(activePort)){
      const lines=fs.readFileSync(activePort,'utf8').split('\n');
      port=Number(lines[0]);
      if(Number.isInteger(port)&&port>0)break;
     }
     await pause(40);
    }
    if(!port)throw Error('Chromium CDP port was not created after 9.6s');
    let page;
    for(let i=0;i<100;i++){
     const response=await fetch('http://127.0.0.1:'+port+'/json/list');
     const targets=await response.json();
     page=targets.find(t=>t.type==='page'&&t.webSocketDebuggerUrl);
     if(page)break;
     await pause(40);
    }
    if(!page)throw Error('Chromium CDP page target missing');
    socket=new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve,reject)=>{
     socket.addEventListener('open',resolve,{once:true});
     socket.addEventListener('error',reject,{once:true});
    });
    socket.addEventListener('message',event=>{
     const response=JSON.parse(String(event.data));
     if(!response.id||!pending.has(response.id))return;
     const item=pending.get(response.id);
     pending.delete(response.id);
     if(response.error)item.reject(Error('CDP '+response.error.message));
     else item.resolve(response.result);
    });
    socket.addEventListener('close',()=>{
     for(const item of pending.values())item.reject(Error('CDP WebSocket closed unexpectedly'));
     pending.clear();
    });
    await command('Page.enable');
    await command('Runtime.enable');
    const results=[];
    for(const width of [320,768]){
     await command('Emulation.setDeviceMetricsOverride',{
      width,height:844,deviceScaleFactor:1,mobile:true,screenWidth:width,screenHeight:844
     });
     await command('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
     for(const mode of ['reference','writing']){
      await command('Page.navigate',{url:origin+'/?mode='+mode+'&width='+width});
      let result=null;
      for(let i=0;i<200;i++){
       const evaluation=await command('Runtime.evaluate',{
        expression:'({status:document.getElementById("sle-test-result")?.textContent||"",viewport:innerWidth,media400:matchMedia("(max-width:400px)").matches,media680:matchMedia("(max-width:680px)").matches,touch:navigator.maxTouchPoints})',
        returnByValue:true
       });
       const value=evaluation.result?.value;
       if(value?.status?.startsWith('PASS_RESPONSIVE')){
        result=value;break;
       }
       if(value?.status?.startsWith('FAIL'))throw Error('Real '+width+'px viewport '+mode+' failed: '+value.status.slice(0,1200));
       await pause(40);
      }
      if(!result)throw Error('Timed out testing real '+width+'px viewport '+mode);
      if(result.viewport!==width)throw Error('CDP viewport mismatch: requested '+width+' got '+result.viewport);
      if(result.media400!==(width<=400)||result.media680!==(width<=680))
       throw Error('CSS media query not activated for '+width+'px '+mode);
      if(result.touch<1)throw Error('Touch emulation not activated');
      const caseResult=JSON.parse(result.status.slice('PASS_RESPONSIVE '.length));
      results.push({...caseResult,verifiedViewport:result.viewport,
       cssMedia400:result.media400,cssMedia680:result.media680,touchEmulation:true});
     }
    }
    return results;
   }finally{
    if(socket&&socket.readyState===WebSocket.OPEN)socket.close();
    browser.kill('SIGTERM');
    for(let i=0;i<40&&browser.exitCode===null;i++)await pause(50);
    if(browser.exitCode===null)browser.kill('SIGKILL');
    fs.rmSync(debugProfile,{recursive:true,force:true,maxRetries:5,retryDelay:60});
   }
  }
  const genuineViewportResults=await realViewportCases();
  if(genuineViewportResults.length!==4)throw Error('Missing one of four true CSS viewport cases');

  console.log(JSON.stringify({
   result:'PASS',gate:'P0-P1-320px-768px-Chromium-true-device-viewport',
   cases:results,trueViewportCases:genuineViewportResults,
   syntheticOnly:true,catalogWrites:0,productionWrites:0,
   actualSafariIpad:'NOT_TESTED',
   viewportNote:'CDP emulated true 320px/768px mobile viewports and touch; actual Safari/iPad still NOT TESTED'
  }));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
