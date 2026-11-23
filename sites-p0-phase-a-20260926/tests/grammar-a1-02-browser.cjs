'use strict';
/**
 * Actual GRA-A1-02 React renderer + owner-approved source, real Chromium DOM,
 * CSS geometry, VI toggle and unscored Quick Check. Synthetic localhost only.
 * Fixed content widths are NOT physical Safari/iPad device QA.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const outDir=path.join(root,'.sites-runtime/grammar-a1-02-browser');
 fs.rmSync(outDir,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',
  define:{'process.env.NODE_ENV':JSON.stringify('production')},
  build:{outDir,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/grammar-a1-02-browser-entry.tsx'),formats:['iife'],
    name:'SleGrammarA102Browser',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(outDir,'bundle.js'),'utf8');
 const baseCSS=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
 const appCSS=fs.readFileSync(path.join(root,'app/grammar-a1-02-notes.css'),'utf8');
 const start=baseCSS.indexOf(':root {');
 assert(start>=0&&appCSS.includes('.sle-gra02-table-scroll'),'authoritative CSS needed');
 const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(n=>{try{return cp.execFileSync('which',[n],{encoding:'utf8'}).trim()}catch{return ''}}).find(Boolean);
 if(!chrome)throw Error('Real Chromium required; cannot claim browser PASS');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-grammar-a102-'));
 const html='<!doctype html><html><head><meta charset="utf-8">'+
 '<meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<style>'+(baseCSS.slice(start)+'\n'+appCSS).replaceAll('</style>','<\\/style>')+'</style>'+
 '</head><body style="margin:0;padding:12px"><div id="app"></div>'+
 '<div id="sle-test-result">STARTED</div>'+
 '<script>window.process={env:{NODE_ENV:"production"}};'+
 'window.addEventListener("error",e=>{document.getElementById("sle-test-result").textContent="FAIL_SCRIPT "+e.message});'+
 'window.addEventListener("unhandledrejection",e=>{document.getElementById("sle-test-result").textContent="FAIL_REJECTION "+e.reason});</script>'+
 '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 let writes=0;
 const server=http.createServer((req,res)=>{
  if(req.method!=='GET'){writes++;res.writeHead(405).end('Writes forbidden');return}
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'}).end(html);
 });
 const run=(url,width)=>new Promise((resolve,reject)=>{
  const child=cp.spawn(chrome,['--headless=new','--no-sandbox',
   '--disable-dev-shm-usage','--disable-extensions','--disable-background-networking',
   '--no-first-run','--virtual-time-budget=12000','--dump-dom',
   '--window-size=1280,900','--user-data-dir='+path.join(profile,'profile-'+width),url],
  {stdio:['ignore','pipe','pipe']});
  let stdout='',stderr='',timedOut=false;
  const timeout=setTimeout(()=>{timedOut=true;child.kill('SIGKILL')},38000);
  child.stdout.on('data',x=>stdout+=String(x));
  child.stderr.on('data',x=>stderr+=String(x));
  child.on('error',reject);
  child.on('close',code=>{
   clearTimeout(timeout);
   if(timedOut||code!==0)return reject(Error('Chromium failed '+width+' '+stderr.slice(-650)));
   const result=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
   if(!result.startsWith('PASS_GRA_A1_02_BROWSER_'))
    return reject(Error('React/CSS browser QA '+width+' failed: '+result.slice(0,1400)));
   resolve(result);
  });
 });
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const url='http://127.0.0.1:'+server.address().port;
  const widths=[375,768,960],results=[];
  for(const width of widths)results.push({width,result:await run(url+'/?width='+width,width)});
  assert.equal(writes,0,'No state or backend writes');
  console.log(JSON.stringify({result:'PASS',gate:'GRA_A1_02_REAL_REACT_CHROMIUM',
   widths,results,canonicalSource:'NotebookLM-approved R1',
   languageToggle:true,quickCheck:true,scrollRegion:true,
   syntheticOnly:true,learnerDataWrites:0,networkWrites:0,
   physicalIpadSafari:'NOT_TESTED',trueDeviceViewport:'NOT_TESTED'}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
