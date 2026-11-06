'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const cp=require('node:child_process'),http=require('node:http');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime','idb-curriculum-vault-browser');
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',
  build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/idb-curriculum-vault-browser-entry.ts'),formats:['iife'],name:'SLEIdbVault',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 const html='<!doctype html><html><head><meta charset="utf-8"></head><body><div id="sle-idb-result">STARTED</div><script>'+
  bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(name=>{try{return cp.execFileSync('which',[name],{encoding:'utf8'}).trim()}catch{return ''}}).find(Boolean);
 if(!chrome)throw Error('Actual Chromium unavailable — IndexedDB integration not verified');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-idb-vault-'));
 const server=http.createServer((req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
  res.end(html);
 });
 const load=url=>new Promise((resolve,reject)=>{
  const process=cp.spawn(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
   '--disable-extensions','--disable-background-networking',
   '--virtual-time-budget=18000','--dump-dom','--user-data-dir='+profile,url],{stdio:['ignore','pipe','pipe']});
  let stdout='',stderr='',expired=false;
  const timeout=setTimeout(()=>{expired=true;process.kill('SIGKILL')},45000);
  process.stdout.on('data',d=>stdout+=String(d));
  process.stderr.on('data',d=>stderr+=String(d));
  process.on('error',reject);
  process.on('close',code=>{
   clearTimeout(timeout);
   if(expired||code!==0)return reject(Error('Chromium did not exit cleanly: '+code+' '+stderr.slice(-600)));
   const result=stdout.match(/<div id="sle-idb-result">([\s\S]*?)<\/div>/)?.[1]||'';
   if(!result.startsWith('PASS_'))return reject(Error('IndexedDB browser failure: '+result.slice(0,1100)));
   resolve(result);
  });
 });
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const host='http://127.0.0.1:'+server.address().port;
  const first=await load(host+'/?phase=write');
  const next=await load(host+'/?phase=reload');
  assert.match(first,/^PASS_WRITE/);assert.match(next,/^PASS_RELOAD/);
  console.log(JSON.stringify({result:'PASS',gate:'idb-content-vault-browser-pilot',
   realChromiumIndexedDB:true,versions:9,syntheticMaxLessonCount:250,
   realLearnerProfileTouched:false,recoveryIntegration:false,liveRuntimeIntegration:false,
   crossBrowserSafariAcceptance:'NOT_TESTED'}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(err=>{console.error(err);process.exitCode=1});
