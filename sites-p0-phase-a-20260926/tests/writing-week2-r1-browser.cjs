'use strict';
/**
 * Native Chromium rendering of the actual Week 2 R1 React/CSS components
 * at narrow CONTENT widths (320/375/768/1024px).
 * Does not claim true device CSS viewport / iPad Safari or owner visual signoff.
 * The local HTTP fixture contains synthetic learner data only; no cloud writes.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const cp=require('node:child_process'),http=require('node:http');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime/w2-r1-native-browser');
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',define:{
  'process.env.NODE_ENV':JSON.stringify('production'),
  'process.env.NEXT_PUBLIC_LEARNING_RUNTIME':JSON.stringify('browser')
 },build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
  lib:{entry:path.join(root,'tests/writing-week2-r1-browser-entry.tsx'),
   formats:['iife'],name:'SLEWeek2R1Browser',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 const original=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
 const cssStart=original.indexOf(':root {');
 assert(cssStart>=0,'Authoritative SLE CSS missing');
 const bin=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(n=>{try{return cp.execFileSync('which',[n],{encoding:'utf8'}).trim()}catch{return ''}})
  .find(Boolean);
 if(!bin)throw Error('Native Chromium unavailable: cannot claim browser PASS');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-w2-r1-chrome-'));
 const html='<!doctype html><html><head><meta charset="utf-8">'+
  '<meta name="viewport" content="width=device-width,initial-scale=1">'+
  '<meta http-equiv="Content-Security-Policy" content="default-src &#39;none&#39;; script-src &#39;unsafe-inline&#39;; style-src &#39;unsafe-inline&#39;; connect-src &#39;none&#39;; img-src data:; font-src data:;">'+
  '<style>'+original.slice(cssStart).replaceAll('</style>','<\\/style>')+'</style></head><body>'+
  '<div id="app"></div><div id="sle-test-result">STARTED</div>'+
  '<script>window.addEventListener("error",e=>document.getElementById("sle-test-result").textContent="FAIL_W2_R1 "+e.message);'+
  'window.addEventListener("unhandledrejection",e=>document.getElementById("sle-test-result").textContent="FAIL_W2_R1 "+e.reason);</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 let writes=0;
 const server=http.createServer((req,res)=>{
  if(req.method!=='GET'){writes++;res.writeHead(405).end('Read-only synthetic preview');return;}
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
  res.end(html);
 });
 async function run(url){
  return new Promise((resolve,reject)=>{
   const args=['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-extensions',
    '--disable-background-networking','--no-first-run','--virtual-time-budget=40000',
    '--dump-dom','--window-size=1280,960','--user-data-dir='+profile,url];
   const p=cp.spawn(bin,args,{stdio:['ignore','pipe','pipe']});
   let stdout='',stderr='',timedout=false;
   const watchdog=setTimeout(()=>{timedout=true;p.kill('SIGKILL')},40000);
   p.stdout.on('data',x=>stdout+=String(x));
   p.stderr.on('data',x=>stderr+=String(x));
   p.on('error',reject);
   p.on('close',code=>{
    clearTimeout(watchdog);
    if(timedout||code!==0)return reject(Error('Chrome failed '+code+' '+stderr.slice(-700)));
    const marker=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
    if(!marker.startsWith('PASS_W2_R1 '))
     return reject(Error('R1 browser assertion failed '+url+' '+marker.slice(0,1400)));
    try{resolve(JSON.parse(marker.slice('PASS_W2_R1 '.length)))}catch(e){reject(e)}
   });
  });
 }
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base='http://127.0.0.1:'+server.address().port;
  const cases=[
   {screen:'learn',width:320},{screen:'learn',width:375},{screen:'learn',width:1024},
   {screen:'guided',width:320},{screen:'main',width:320},
   {screen:'feedback',width:375},{screen:'review',width:768}
  ];
  const results=[];
  for(const one of cases)results.push(await run(base+'/?screen='+one.screen+'&width='+one.width));
  assert.equal(results.length,7);
  for(let i=0;i<cases.length;i++){
   assert.equal(results[i].screen,cases[i].screen);
   assert.equal(results[i].contentWidth,cases[i].width);
   assert.equal(results[i].realReactRendered,true);
   assert.equal(results[i].realDomControls,true);
  }
  assert.equal(writes,0,'No server write must occur');
  console.log(JSON.stringify({result:'PASS',gate:'W2_R1_NATIVE_CHROMIUM_CONTENT_WIDTH',
   cases:results,realReact:true,syntheticOnly:true,networkWrites:writes,productionWrites:0,
   actual320pxCssViewport:'NOT_TESTED',realIPadSafari:'NOT_TESTED',ownerVisualAcceptance:'PENDING'}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1});
