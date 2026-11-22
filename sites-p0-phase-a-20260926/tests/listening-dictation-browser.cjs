'use strict';
/** Synthetic real-Chromium smoke; NO production learner profile, transcript API or MP3 use. */
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os');
const path=require('node:path'),http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const output=path.join(root,'.sites-runtime/listening-dictation-browser');
 fs.rmSync(output,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',
  define:{'process.env.NODE_ENV':JSON.stringify('production')},
  build:{outDir:output,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/listening-dictation-browser-entry.tsx'),
    formats:['iife'],name:'SleListeningDictationBrowser',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(output,'bundle.js'),'utf8');
 assert(bundle.includes('Fill the gaps'),'Dictation React UI must be bundled');
 const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(c=>{try{return cp.execFileSync('which',[c],{encoding:'utf8'}).trim()}catch{return ''}})
  .find(Boolean);
 if(!chrome)throw Error('Native Chromium not installed — cannot claim browser PASS');
 const html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+
  '<div id="app"></div><div id="sle-test-result">STARTED</div>'+
  '<script>window.process={env:{NODE_ENV:"production"}};window.addEventListener("error",e=>{document.getElementById("sle-test-result").textContent="FAIL_SCRIPT "+e.message});</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 let writes=0;
 const server=http.createServer((request,response)=>{
  if(request.method!=='GET'){writes++;response.writeHead(405).end('No writes');return}
  if(request.url?.includes('.mp3')){response.writeHead(404,{'Content-Type':'audio/mpeg'}).end();return}
  response.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'}).end(html);
 });
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-dictation-'));
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const addr=server.address();
  const url='http://127.0.0.1:'+addr.port+'/';
  let stdout='',stderr='';
  const outcome=await new Promise((resolve,reject)=>{
   const proc=cp.spawn(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
    '--disable-extensions','--disable-background-networking','--no-first-run',
    '--virtual-time-budget=30000','--dump-dom','--window-size=375,920',
    '--user-data-dir='+profile,url],{stdio:['ignore','pipe','pipe']});
   const timer=setTimeout(()=>{proc.kill('SIGKILL');reject(Error('Chromium exceeded 40s'))},40000);
   proc.stdout.on('data',d=>stdout+=String(d));proc.stderr.on('data',d=>stderr+=String(d));
   proc.on('error',e=>{clearTimeout(timer);reject(e)});
   proc.on('close',code=>{
    clearTimeout(timer);
    if(code!==0)return reject(Error('Chromium exit '+code+': '+stderr.slice(-400)));
    const result=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
    if(result!=='PASS_DICTATION_BROWSER')return reject(Error(result.slice(0,1300)));
    resolve(result);
   });
  });
  assert.equal(outcome,'PASS_DICTATION_BROWSER');
  assert.equal(writes,0,'No real or synthetic learner state mutations');
  console.log(JSON.stringify({result:'PASS',gate:'SLE_DICTATION_REAL_CHROMIUM',
   source:'synthetic-scored-demo',inputAndDifficulty:true,unverifiedSentenceDisabled:true,
   noScoringOrAI:true,noWrites:true,physicalIPadSafari:'NOT_TESTED'}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
