'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime/storage-ui-browser');
 fs.rmSync(out,{recursive:true,force:true});
 await build({
  root,configFile:false,logLevel:'error',
  define:{'process.env.NEXT_PUBLIC_LEARNING_RUNTIME':JSON.stringify('browser'),
   'process.env.NODE_ENV':JSON.stringify('production')},
  build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
    lib:{entry:path.join(root,'tests/storage-ui-browser-entry.tsx'),formats:['iife'],
      name:'StoragePanelUITest',fileName:()=> 'bundle.js'}}
 });
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 const errorTrap=`<script>
  window.addEventListener('error',e=>{
   document.getElementById('sle-test-result').textContent='FAIL_SCRIPT '+String(e.message)+' @ '+String(e.filename)+':'+String(e.lineno);
  });
  window.addEventListener('unhandledrejection',e=>{
   document.getElementById('sle-test-result').textContent='FAIL_REJECTION '+String(e.reason?.stack||e.reason);
  });
 </script>`;
 const signalScript=`<script>(()=>{
  const node=document.getElementById('sle-test-result');
  let reported=false;
  const notify=()=>{
   if(reported)return;
   const value=node.textContent||'';
   if(!/^(PASS_|FAIL)/.test(value))return;
   reported=true;
   fetch('/__result?phase='+encodeURIComponent(new URL(location.href).searchParams.get('phase')||''),{
    method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:value
   }).catch(()=>{});
  };
  new MutationObserver(notify).observe(node,{subtree:true,childList:true,characterData:true});
  notify();
 })();</script>`;
 const html='<!doctype html><html><head><meta charset="utf-8"></head><body>'+
  '<div id="app"></div><div id="sle-test-result">STARTED</div>'+
  errorTrap+signalScript+'<script>window.process={env:{NODE_ENV:"production",NEXT_PUBLIC_LEARNING_RUNTIME:"browser"}};</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 const bin=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(name=>{try{return cp.execFileSync('which',[name],{encoding:'utf8'}).trim()}catch{return ''}})
  .find(Boolean);
 if(!bin)throw Error('Native Chromium not found; UI integration is not verified.');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-storage-ui-qa-'));
 const receivers=new Map();
 const server=http.createServer((req,res)=>{
  if(req.method==='POST' && (req.url||'').startsWith('/__result?')){
   const phase=new URL(req.url,'http://127.0.0.1').searchParams.get('phase')||'';
   let payload='';
   req.on('data',d=>{payload+=String(d);if(payload.length>12000)req.destroy()});
   req.on('end',()=>{
    res.writeHead(200,{'Content-Type':'text/plain'});res.end('recorded');
    receivers.get(phase)?.(payload);
   });
   return;
  }
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});
  res.end(html);
 });
 function open(url){
  const phase=new URL(url).searchParams.get('phase');
  if(phase!=='backup' && phase!=='recovery')throw Error('Invalid UI test phase '+phase);
  return new Promise((resolve,reject)=>{
   const cmd=cp.spawn(bin,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
    '--disable-gpu','--disable-extensions','--disable-background-networking',
    '--no-first-run','--user-data-dir='+profile,url],{stdio:['ignore','ignore','pipe']});
   let stderr='',expired=false,reported=false,result='';
   const timer=setTimeout(()=>{expired=true;cmd.kill('SIGKILL')},75000);
   cmd.stderr.on('data',d=>{stderr=(stderr+String(d)).slice(-1600)});
   receivers.set(phase,value=>{
    if(reported)return;
    reported=true;result=value;
    // Wait for real UI completion, then close Chrome before reopening the
    // same temporary profile for the independent restore-phase test.
    cmd.kill('SIGTERM');
   });
   cmd.on('error',e=>{clearTimeout(timer);receivers.delete(phase);reject(e)});
   cmd.on('close',code=>{
    clearTimeout(timer);receivers.delete(phase);
    if(expired)return reject(Error('Chrome UI phase '+phase+' timed out, UI never reported PASS: '+stderr.slice(-500)));
    if(!reported)return reject(Error('Chrome UI phase '+phase+' exited without a terminal UI result (exit '+code+'): '+stderr.slice(-800)));
    if(!result.startsWith('PASS_'))return reject(Error('Real React UI test FAIL '+phase+': '+result.slice(0,1900)));
    resolve(result);
   });
  });
 }
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const host='http://127.0.0.1:'+server.address().port;
  const first=await open(host+'/?phase=backup');
  const second=await open(host+'/?phase=recovery');
  assert.match(first,/^PASS_BACKUP_PANEL/);
  assert.match(second,/^PASS_RESTORE_PANEL/);
  console.log(JSON.stringify({result:'PASS',gate:'storage-react-panel-chromium',
   realReactUI:true,realFileInput:true,downloadAndVerify:true,compactClick:true,
   realChromeProcesses:2,freshProfileRestore:true,duplicateRestoreBlocked:true,
   liveSiteTouched:false,realLearnerDataTouched:false}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1;});
