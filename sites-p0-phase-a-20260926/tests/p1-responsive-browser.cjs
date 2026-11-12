'use strict';
/**
 * Native Chromium DOM layout checks at 320px / 768px fixed content widths,
 * with the actual SLE reference CSS. This is NOT real iPad/Safari QA and
 * NOT a guarantee the browser has a matching CSS/media viewport.
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
  console.log(JSON.stringify({
   result:'PASS',gate:'P0-P1-320px-768px-Chromium-layout',
   cases:results,syntheticOnly:true,catalogWrites:0,productionWrites:0,
   actualSafariIpad:'NOT_TESTED',
   viewportNote:'Measured fixed 320px and 768px content containers; record actual Chromium viewport separately'
  }));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
