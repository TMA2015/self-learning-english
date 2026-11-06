'use strict';
/** Real Chromium IndexedDB QA with CDP polling instead of --dump-dom's virtual-time snapshot. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const cp=require('node:child_process'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const httpJSON=url=>new Promise((resolve,reject)=>{
 http.get(url,res=>{
  let buf='';
  res.on('data',x=>buf+=x);
  res.on('end',()=>{try{resolve(JSON.parse(buf))}catch(e){reject(e)}});
 }).on('error',reject);
});
async function until(fn,ms=12000){
 const end=Date.now()+ms,last={};
 while(Date.now()<end){try{const value=await fn();if(value)return value}catch(e){last.error=e}await delay(150)}
 throw Error('CDP readiness timeout: '+String(last.error||'no browser response'));
}
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime','idb-curriculum-vault-browser');
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',
  build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/idb-curriculum-vault-browser-entry.ts'),
    formats:['iife'],name:'SLEIdbVault',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 const html='<!doctype html><html><head><meta charset="utf-8"></head><body>'+
  '<div id="sle-idb-result">STARTED</div>'+
  '<script>window.addEventListener("error",e=>document.getElementById("sle-idb-result").textContent="FAIL_SCRIPT "+e.message);'+
  'window.addEventListener("unhandledrejection",e=>document.getElementById("sle-idb-result").textContent="FAIL_REJECTION "+e.reason);</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(name=>{try{return cp.execFileSync('which',[name],{encoding:'utf8'}).trim()}catch{return ''}}).find(Boolean);
 if(!chrome)throw Error('Actual Chromium unavailable — IndexedDB pilot cannot be verified');
 if(typeof WebSocket!=='function')throw Error('Node 22+ built-in WebSocket is required for CDP browser QA');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-idb-vault-'));
 const server=http.createServer((_req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
  res.end(html);
 });
 async function visit(url){
  const child=cp.spawn(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
   '--disable-extensions','--disable-background-networking',
   '--no-first-run','--remote-debugging-port=0','--remote-allow-origins=*',
   '--user-data-dir='+profile,url],{stdio:['ignore','ignore','pipe']});
  let stderr='',socket;
  child.stderr.on('data',data=>{stderr=(stderr+String(data)).slice(-5000)});
  try{
   const port=await until(()=>{
    const file=path.join(profile,'DevToolsActivePort');
    if(!fs.existsSync(file))return false;
    const value=Number(fs.readFileSync(file,'utf8').split(/\r?\n/)[0]);
    return Number.isSafeInteger(value)&&value>0?value:false;
   });
   const target=await until(async()=>{
    const pages=await httpJSON('http://127.0.0.1:'+port+'/json/list');
    return pages.find(p=>p.type==='page'&&p.url.startsWith(url))||false;
   });
   socket=new WebSocket(target.webSocketDebuggerUrl);
   await new Promise((resolve,reject)=>{
    socket.addEventListener('open',resolve,{once:true});
    socket.addEventListener('error',reject,{once:true});
   });
   let id=0;
   function evaluate(){
    return new Promise((resolve,reject)=>{
     const current=++id;
     const timer=setTimeout(()=>reject(Error('CDP evaluate timed out')),4000);
     const listener=event=>{
      const response=JSON.parse(event.data);
      if(response.id!==current)return;
      clearTimeout(timer);
      socket.removeEventListener('message',listener);
      if(response.error)reject(Error(response.error.message));
      else resolve(response.result?.result?.value);
     };
     socket.addEventListener('message',listener);
     socket.send(JSON.stringify({id:current,method:'Runtime.evaluate',params:{
      expression:"document.getElementById('sle-idb-result')?.textContent",
      returnByValue:true
     }}));
    });
   }
   const start=Date.now();
   let last='';
   while(Date.now()-start<45000){
    last=String(await evaluate()||'');
    if(last.startsWith('PASS_'))return last;
    if(last.startsWith('FAIL'))throw Error(last);
    await delay(250);
   }
   throw Error('IndexedDB browser phase timed out; last progress='+last);
  }finally{
   if(socket&&socket.readyState===WebSocket.OPEN)socket.close();
   if(child.exitCode===null)child.kill('SIGTERM');
   await delay(450);
   if(child.exitCode===null)child.kill('SIGKILL');
  }
 }
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const host='http://127.0.0.1:'+server.address().port;
  const first=await visit(host+'/?phase=write');
  const second=await visit(host+'/?phase=reload');
  assert.match(first,/^PASS_WRITE/);assert.match(second,/^PASS_RELOAD/);
  console.log(JSON.stringify({result:'PASS',gate:'idb-content-vault-browser-pilot',
   realChromiumIndexedDB:true,versions:9,syntheticMaxLessonCount:250,
   persistedAcrossBrowserProcesses:true,originalLocalStorageLearnerKeyUntouched:true,
   recoveryIntegration:'NOT_TESTED',liveRuntimeIntegration:'NOT_TESTED',
   realSafariAcceptance:'NOT_TESTED'}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
