'use strict';
/** Actual multi-skill React component, real Chromium on synthetic local pages.
 * Never touches learner accounts, scores, or original Listening audio.
 * Content widths are not physical Safari/iPad certification.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),http=require('node:http');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite'),out=path.join(root,'.sites-runtime/multiskill-v2-browser');
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',define:{
  'process.env.NODE_ENV':JSON.stringify('production')
 },build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
  lib:{entry:path.join(root,'tests/multiskill-knowledge-v2-browser-entry.tsx'),
   formats:['iife'],name:'SleMultiskillBrowser',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 const base=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
 const styles=fs.readFileSync(path.join(root,'app/multiskill-knowledge-v2.css'),'utf8');
 const start=base.indexOf(':root {');
 assert(start>=0&&styles.includes('.sle-ms-grid')&&styles.includes('.sle-ms-listening-notice'),'Real application CSS required');
 const browser=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(x=>{try{return cp.execFileSync('which',[x],{encoding:'utf8'}).trim()}catch{return ''}}).find(Boolean);
 if(!browser)throw Error('Native Chromium unavailable; cannot assert browser PASS');
 const html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<style>'+(base.slice(start)+'\n'+styles).replaceAll('</style>','<\\/style>')+'</style>'+
 '</head><body style="margin:0;padding:12px"><div id="app"></div><div id="sle-test-result">STARTED</div>'+
 '<script>window.process={env:{NODE_ENV:"production"}};'+
 'window.addEventListener("error",e=>document.getElementById("sle-test-result").textContent="FAIL_SCRIPT "+e.message);'+
 'window.addEventListener("unhandledrejection",e=>document.getElementById("sle-test-result").textContent="FAIL_REJECTION "+e.reason);</script>'+
 '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 let writes=0;const server=http.createServer((req,res)=>{
  if(req.method!=='GET'){writes++;res.writeHead(405).end('Writes forbidden');return}
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'}).end(html);
 });
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-v2-browser-'));
 const run=(url,lesson,width)=>new Promise((resolve,reject)=>{
  const child=cp.spawn(browser,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-extensions',
   '--disable-background-networking','--no-first-run','--virtual-time-budget=12000',
   '--dump-dom','--window-size=1280,900','--user-data-dir='+path.join(profile,lesson+'-'+width),url],
  {stdio:['ignore','pipe','pipe']});
  let stdout='',stderr='',expired=false;
  const timeout=setTimeout(()=>{expired=true;child.kill('SIGKILL')},38000);
  child.stdout.on('data',d=>stdout+=String(d));child.stderr.on('data',d=>stderr+=String(d));
  child.on('error',reject);
  child.on('close',code=>{
   clearTimeout(timeout);
   if(expired||code!==0)return reject(Error('Chrome '+lesson+' '+width+' code '+code+': '+stderr.slice(-600)));
   const status=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
   if(status!=='PASS_SLE_MULTISKILL_'+lesson+'_'+width)reject(Error('Browser '+lesson+' '+width+' '+status.slice(0,1100)));
   else resolve(status);
  });
 });
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const baseUrl='http://127.0.0.1:'+server.address().port,results=[];
  for(const lesson of ['REA-B1-03','VOC-A2-01','WRI-B1-05','LIS-A2-03']){
   for(const width of [375,768,960]){
    const query=new URLSearchParams({lesson,width:String(width)});
    results.push({lesson,width,result:await run(baseUrl+'/?'+query,lesson,width)});
   }
  }
  assert.equal(results.length,12);assert.equal(writes,0);
  console.log(JSON.stringify({result:'PASS',gate:'SLE_MULTISKILL_V2_REAL_CHROMIUM',
   cases:results,source:'reviewed instruction',physicalIpadSafari:'NOT_TESTED',realAuth:'NOT_TESTED',
   syntheticOnly:true,backendWrites:0,scoreMutations:0}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
