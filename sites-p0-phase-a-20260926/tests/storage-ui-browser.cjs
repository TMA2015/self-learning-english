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
 const html='<!doctype html><html><head><meta charset="utf-8"></head><body>'+
  '<div id="app"></div><div id="sle-test-result">STARTED</div>'+
  errorTrap+'<script>window.process={env:{NODE_ENV:"production",NEXT_PUBLIC_LEARNING_RUNTIME:"browser"}};</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 const bin=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(name=>{try{return cp.execFileSync('which',[name],{encoding:'utf8'}).trim()}catch{return ''}})
  .find(Boolean);
 if(!bin)throw Error('Native Chromium not found; UI integration is not verified.');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-storage-ui-qa-'));
 const server=http.createServer((_req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});
  res.end(html);
 });
 function open(url){
  return new Promise((resolve,reject)=>{
   const cmd=cp.spawn(bin,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
    '--disable-extensions','--disable-background-networking',
    '--no-first-run','--virtual-time-budget=90000','--dump-dom',
    '--user-data-dir='+profile,url],{stdio:['ignore','pipe','pipe']});
   let stdout='',stderr='',expired=false;
   const timer=setTimeout(()=>{expired=true;cmd.kill('SIGKILL')},55000);
   cmd.stdout.on('data',d=>stdout+=String(d));
   cmd.stderr.on('data',d=>stderr+=String(d));
   cmd.on('error',reject);
   cmd.on('close',code=>{
    clearTimeout(timer);
    if(expired||code!==0)return reject(Error('Chrome exit '+code+' '+stderr.slice(-900)));
    const result=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]||'';
    if(!result.startsWith('PASS_'))return reject(Error('React UI browser FAIL: '+result.slice(0,1700)+' '+stderr.slice(-500)));
    resolve(result);
   });
  });
 }
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const host='http://127.0.0.1:'+server.address().port;
  // Native --dump-dom can occasionally capture the STARTED shell before
  // React's async file verification finishes. Retry *only* incomplete DOM
  // snapshots; never retry an actual FAIL_* result, an exit error, or a timeout.
  // Each run exits Chrome naturally, ensuring the same temporary on-disk
  // browser profile is retained between backup and recovery phases.
  async function openWithIncompleteSnapshotRetry(url,phase){
   for(let attempt=1;attempt<=3;attempt++){
    try{return await open(url)}
    catch(e){
     const reason=String(e);
     if(attempt===3||!reason.includes('React UI browser FAIL: STARTED'))throw e;
     console.log(JSON.stringify({gate:'storage-react-panel-chromium',
      phase,nonTerminalDomSnapshot:true,retry:attempt,maxAttempts:3}));
    }
   }
   throw Error('Storage UI never reached a terminal browser result');
  }
  const first=await openWithIncompleteSnapshotRetry(host+'/?phase=backup','backup');
  const second=await openWithIncompleteSnapshotRetry(host+'/?phase=recovery','recovery');
  assert.match(first,/^PASS_BACKUP_PANEL/);
  assert.match(second,/^PASS_RESTORE_PANEL/);
  console.log(JSON.stringify({result:'PASS',gate:'storage-react-panel-chromium',
   realReactUI:true,realFileInput:true,downloadAndVerify:true,compactClick:true,
   realChromeProcesses:2,freshProfileRestore:true,duplicateRestoreBlocked:true,
   liveSiteTouched:false,realLearnerDataTouched:false}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1;});
