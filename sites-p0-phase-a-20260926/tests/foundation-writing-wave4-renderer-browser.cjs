'use strict';
/** Real Chromium React source-driven shell with synthetic teaching fixtures only. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime/foundation-writing-wave4-renderer');
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',
  define:{'process.env.NODE_ENV':JSON.stringify('production'),
   'process.env.NEXT_PUBLIC_LEARNING_RUNTIME':JSON.stringify('browser')},
  build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/foundation-writing-wave4-renderer-browser-entry.tsx'),
    formats:['iife'],name:'SleWave4Renderer',fileName:()=> 'bundle.js'}},
 });
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 assert(bundle.includes('Foundation Writing'),'React lesson shell bundled');
 const bin=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(n=>{try{return cp.execFileSync('which',[n],{encoding:'utf8'}).trim()}catch{return ''}}).find(Boolean);
 if(!bin)throw Error('Native Chromium missing: refuse browser PASS');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-fw4-renderer-'));
 const html='<html><head><meta charset="utf-8"></head><body><div id="app"></div>'+
  '<div id="sle-test-result">STARTED</div><script>window.process={env:{NODE_ENV:"production",NEXT_PUBLIC_LEARNING_RUNTIME:"browser"}};'+
  'window.addEventListener("error",e=>document.getElementById("sle-test-result").textContent="FAIL_JS "+String(e.message));'+
  'window.addEventListener("unhandledrejection",e=>document.getElementById("sle-test-result").textContent="FAIL_PROMISE "+String(e.reason));</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 const server=http.createServer((_req,res)=>{res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});res.end(html)});
 async function phase(url,name){
  return await new Promise((resolve,reject)=>{
   const child=cp.spawn(bin,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
    '--disable-extensions','--disable-background-networking','--no-first-run',
    '--virtual-time-budget=80000','--dump-dom','--user-data-dir='+profile,url],{stdio:['ignore','pipe','pipe']});
   let stdout='',stderr='',expired=false;
   const timer=setTimeout(()=>{expired=true;child.kill('SIGKILL')},55000);
   child.stdout.on('data',d=>stdout+=String(d));child.stderr.on('data',d=>stderr+=String(d));
   child.on('error',reject);child.on('close',code=>{
    clearTimeout(timer);
    if(expired||code!==0)return reject(Error('Chromium '+name+' '+code+' '+stderr.slice(-700)));
    const result=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
    if(!result.startsWith('PASS_W4_RENDER_'))return reject(Error('React Wave4 '+name+' FAIL: '+result.slice(0,1700)));
    resolve(result);
   });
  });
 }
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const url='http://127.0.0.1:'+server.address().port+'/?phase=';
  const cases=['invalid','10','11','12'];
  const results=[];for(const name of cases)results.push(await phase(url+name,name));
  console.log(JSON.stringify({result:'PASS',gate:'FOUNDATION_WRITING_WAVE4_REACT_CHROMIUM_SHELL',
   cases,realReact:true,realChromium:true,sourceFailClosed:true,savedOnlyReview:true,
   explicitAIOnly:true,realProviderCalls:0,productionWrites:0,learnerSource:'SYNTHETIC_TEST_ONLY',
   realLessonIntegration:'NOT_DONE',realIpadSafari:'NOT_TESTED'}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
