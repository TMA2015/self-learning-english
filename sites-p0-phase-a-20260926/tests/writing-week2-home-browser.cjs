'use strict';
/** Real HomeClient and real browser-local learner runtime, synthetic data only.
 * This is NOT authenticated production server or physical Safari QA.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),
 http=require('node:http'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.join(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime/w2-home-integrated-browser');
 fs.rmSync(out,{force:true,recursive:true});
 await build({root,configFile:false,logLevel:'error',
  resolve:{alias:{'@':root}},
  define:{
   'process.env.NODE_ENV':JSON.stringify('production'),
   'process.env.NEXT_PUBLIC_LEARNING_RUNTIME':JSON.stringify('browser'),
   'process.env.NEXT_PUBLIC_BASE_PATH':JSON.stringify(''),
  },
  build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,cssCodeSplit:false,
   lib:{entry:path.join(root,'tests/writing-week2-home-browser-entry.tsx'),
     formats:['es'],fileName:()=> 'entry.js'}}
 });
 const css=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
 assert(css.includes(':root {'));
 const content='<!doctype html><html lang="en"><head><meta charset="utf-8">'+
  '<meta name="viewport" content="width=device-width,initial-scale=1">'+
  '<meta http-equiv="Content-Security-Policy" content="default-src &#39;self&#39; data:; script-src &#39;self&#39; &#39;unsafe-inline&#39;; style-src &#39;self&#39; &#39;unsafe-inline&#39;; connect-src &#39;self&#39;; img-src &#39;self&#39; data:; font-src &#39;self&#39; data:; object-src &#39;none&#39;;">'+
  '<style>'+css.slice(css.indexOf(':root {')).replaceAll('</style','<\\/style')+'</style>'+
  '<script>window.__OUTSIDE_REQUESTS=0;const origFetch=window.fetch.bind(window);window.fetch=(x,o)=>{const u=new URL(typeof x==="string"?x:x.url,location.href);if(u.origin!==location.origin){window.__OUTSIDE_REQUESTS++;return Promise.reject(Error("External request blocked by QA"))}return origFetch(x,o)};</script>'+
  '</head><body><div id="app"></div><script type="module" src="/entry.js"></script></body></html>';
 let externalRequests=0,writeRequests=0;
 const server=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://127.0.0.1');
  if(req.method!=='GET'){writeRequests++;res.writeHead(405).end('Read-only fixture');return}
  if(u.pathname==='/'){res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});res.end(content);return}
  const target=u.pathname.startsWith('/branding/')||u.pathname.startsWith('/audio/')?
    path.join(root,'public',u.pathname):path.join(out,u.pathname);
  const allowed=[path.resolve(root,'public'),path.resolve(out)];
  const abs=path.resolve(target);
  if(!allowed.some(base=>abs.startsWith(base+path.sep))){res.writeHead(403).end();return}
  if(!fs.existsSync(abs)||!fs.statSync(abs).isFile()){res.writeHead(404).end();return}
  const mime=abs.endsWith('.js')?'application/javascript':abs.endsWith('.svg')?'image/svg+xml':abs.endsWith('.css')?'text/css':abs.endsWith('.json')?'application/json':'application/octet-stream';
  res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-store'});res.end(fs.readFileSync(abs));
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 const origin='http://127.0.0.1:'+server.address().port;
 const bin=['google-chrome','google-chrome-stable','chromium','chromium-browser'].map(n=>{
  try{return cp.execFileSync('which',[n],{encoding:'utf8'}).trim()}catch{return ''}
 }).find(Boolean);
 assert(bin,'Chromium executable required');
 assert(typeof WebSocket==='function','Node 24 CDP WebSocket needed');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-week2-home-'));
 const browser=cp.spawn(bin,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--no-first-run',
  '--disable-background-networking','--disable-extensions','--remote-debugging-port=0',
  '--remote-debugging-address=127.0.0.1','--remote-allow-origins=*','--window-size=1280,900',
  '--user-data-dir='+profile,'about:blank'],{stdio:'ignore'});
 let socket=null;const pending=new Map();let nextId=0;
 const pause=ms=>new Promise(r=>setTimeout(r,ms));
 const command=(method,params={})=>new Promise((resolve,reject)=>{
  const id=++nextId;pending.set(id,{resolve,reject});
  socket.send(JSON.stringify({id,method,params}));
 });
 try{
  const activePort=path.join(profile,'DevToolsActivePort');let port;
  for(let i=0;i<300;i++){if(fs.existsSync(activePort)){port=Number(fs.readFileSync(activePort,'utf8').split('\n')[0]);if(port)break}await pause(50)}
  if(!port)throw Error('Chromium CDP port unavailable');
  let page;
  for(let i=0;i<100;i++){const targets=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();page=targets.find(t=>t.type==='page'&&t.webSocketDebuggerUrl);if(page)break;await pause(50)}
  if(!page)throw Error('CDP page target not found');
  socket=new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true})});
  socket.addEventListener('message',event=>{
   const value=JSON.parse(String(event.data));
   if(!value.id||!pending.has(value.id))return;
   const d=pending.get(value.id);pending.delete(value.id);
   if(value.error)d.reject(Error('CDP '+value.error.message));else d.resolve(value.result);
  });
  socket.addEventListener('close',()=>{for(const p of pending.values())p.reject(Error('CDP closed'));pending.clear()});
  await command('Page.enable');await command('Runtime.enable');
  async function load(width){
   await command('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:false,screenWidth:width,screenHeight:844});
   await command('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
   await command('Page.navigate',{url:origin+'/?w='+width+'&nonce='+Date.now()});
   for(let i=0;i<400;i++){
    const r=await command('Runtime.evaluate',{expression:'typeof window.__SLE_WEEK2_HOME_QA==="object"',returnByValue:true});
    if(r.result?.value===true)break;
    if(i===399)throw Error('HomeClient script never mounted at '+width+'px');
    await pause(50);
   }
   const r=await command('Runtime.evaluate',{expression:'({width:innerWidth,touch:navigator.maxTouchPoints,media375:matchMedia("(max-width:375px)").matches})',returnByValue:true});
   const v=r.result.value;
   assert.equal(v.width,width,'True CSS viewport must match');
   assert(v.touch>=1,'Touch emulation not installed');
   assert.equal(v.media375,width<=375);
  }
  async function run(mode){
   const e='window.__SLE_WEEK2_HOME_QA.'+mode+'()'+
      '.then(x=>JSON.stringify({ok:true,result:x,external:window.__OUTSIDE_REQUESTS}))'+
      '.catch(e=>JSON.stringify({ok:false,error:String(e),stack:String(e?.stack).slice(0,1500),external:window.__OUTSIDE_REQUESTS}))';
   const answer=await command('Runtime.evaluate',{expression:e,awaitPromise:true,returnByValue:true});
   if(answer.exceptionDetails)throw Error('Browser exception '+JSON.stringify(answer.exceptionDetails).slice(0,1000));
   const data=JSON.parse(answer.result.value);
   if(!data.ok)throw Error('Integrated '+mode+' FAIL: '+data.error+'\n'+data.stack);
   assert.equal(data.external,0,'No external requests from HomeClient or AI');
   return data.result;
  }
  const results=[];
  await load(1280);results.push(await run('full'));
  await load(1280);results.push(await run('restore'));
  // PR #168 integrated skill-nav/Any Topic QA at true mobile and desktop viewports.
  for(const width of [320,1280]){await load(width);results.push(await run('skillOverview'));}
  for(const width of [320,375,768,1280]){
   await load(width);results.push(await run('responsive'));
   const screenshot=await command('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
   const bytes=Buffer.from(screenshot.data,'base64');
   fs.writeFileSync(path.join(out,'week2-home-'+width+'.png'),bytes);
   console.log('W2_HOME_SCREENSHOT '+JSON.stringify({width,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')}));
  }
  assert.equal(writeRequests,0,'HTTP fixture cannot receive learner writes');
  console.log(JSON.stringify({result:'PASS',gate:'W2_R2_FULL_HOME_INTEGRATED_BROWSER',cases:results,
   actualHomeClient:true,browserLocalStorage:true,externalRequests:0,httpWrites:0,
   trueCssViewports:[320,375,768,1280],touchEmulation:true,
   authenticatedServerIntegration:'NOT_TESTED',physicalIpadSafari:'NOT_TESTED'}));
 }finally{
  if(socket&&socket.readyState===WebSocket.OPEN)socket.close();
  browser.kill('SIGTERM');for(let i=0;i<40&&browser.exitCode===null;i++)await pause(50);
  if(browser.exitCode===null)browser.kill('SIGKILL');
  fs.rmSync(profile,{recursive:true,force:true,maxRetries:5,retryDelay:60});
  server.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1});
