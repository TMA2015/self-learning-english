'use strict';
/** Native Chromium with a temporary profile and synthetic HTTP source.
 * No production learner data, AI, or live deployment. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime/wri-a2-source-browser');
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',
  define:{'process.env.NODE_ENV':JSON.stringify('production'),
   'process.env.NEXT_PUBLIC_LEARNING_RUNTIME':JSON.stringify('server')},
  build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/wri-a2-source-browser-entry.tsx'),formats:['iife'],
    name:'WriA2SourcesBrowser',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 const baseCSS=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
 const start=baseCSS.indexOf(':root {');
 if(start<0)throw Error('Original SLE CSS unavailable');
 const css=baseCSS.slice(start);
 const executable=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(name=>{try{return cp.execFileSync('which',[name],{encoding:'utf8'}).trim()}
   catch{return ''}}).find(Boolean);
 if(!executable)throw Error('Native Chromium unavailable; source-browser gate NOT PASS');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-wri-a2-source-'));
 const html='<!doctype html><html><head><meta charset="utf-8">'+
  '<meta name="viewport" content="width=device-width,initial-scale=1">'+
  '<style>'+css.replaceAll('</style>','<\\/style>')+'</style></head><body>'+
  '<div id="app"></div><div id="sle-test-result">STARTED</div>'+
  '<script>window.addEventListener("error",e=>document.getElementById("sle-test-result").textContent="FAIL_SCRIPT "+e.message);'+
  'window.addEventListener("unhandledrejection",e=>document.getElementById("sle-test-result").textContent="FAIL_REJECTION "+e.reason);</script>'+
  '<script>window.process={env:{NODE_ENV:"production",NEXT_PUBLIC_LEARNING_RUNTIME:"server"}};</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 let mutationRequests=0;
 const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname==='/api/foundation'){
   if(req.method!=='GET'){
    mutationRequests++;
    res.writeHead(405).end('Source guide is strictly read-only');return;
   }
   const phase=url.searchParams.get('phase');
   const id=url.searchParams.get('lesson');
   const validVersion=url.searchParams.get('version')==='1.25.0';
   if(phase==='missing'||!validVersion||!['REA-A2-08','LIS-A2-07'].includes(id)){
    res.writeHead(503,{'Content-Type':'application/json'});
    res.end(JSON.stringify({error:'Synthetic source unavailable'}));return;
   }
   const result=id==='REA-A2-08'
    ?{version:'1.25.0',lesson:{id:'REA-A2-08',module:'reading',
       reading_asset:{id:'TXT-REA-A2-08',
        title:'Three Ways to Help or Learn This Weekend',
        body:'Repair Café at the Community Hall cannot guarantee repairs.',
        display_to_learner:true}}}
    :{version:'1.25.0',lesson:{id:'LIS-A2-07',module:'listening',
       audio_asset:{source_text:'MIA_PRIVATE_TRANSCRIPT'}},
      audio:phase==='audioMissing'?null:{
       url:phase==='audioWrongUrl'?'https://invalid.example/evil.mp3':
        '/foundation-audio/LIS-A2-07-v1.mp3',
       duration:25.15}};
   res.writeHead(200,{'Content-Type':'application/json'});
   res.end(JSON.stringify(result));return;
  }
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});
  res.end(html);
 });
 async function run(base,phase){
  return await new Promise((resolve,reject)=>{
   const child=cp.spawn(executable,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
    '--disable-extensions','--disable-background-networking','--no-first-run',
    '--virtual-time-budget=45000','--dump-dom','--window-size=390,844',
    '--user-data-dir='+profile,base+'/?phase='+phase],
   {stdio:['ignore','pipe','pipe']});
   let stdout='',stderr='',timedout=false;
   const timer=setTimeout(()=>{timedout=true;child.kill('SIGKILL')},40000);
   child.stdout.on('data',d=>stdout+=String(d));
   child.stderr.on('data',d=>stderr+=String(d));
   child.on('error',reject);
   child.on('close',code=>{
    clearTimeout(timer);
    if(timedout||code!==0)return reject(Error('Chromium exit '+code+' '+stderr.slice(-500)));
    const match=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/);
    const result=match?.[1]??'';
    if(!result.startsWith('PASS_'))
     return reject(Error('WRI browser QA FAIL '+phase+': '+result.slice(0,1300)));
    resolve(result);
   });
  });
 }
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base='http://127.0.0.1:'+server.address().port;
  const results=[];
  for(const phase of ['ok','missing','audioMissing','audioWrongUrl','unavailable'])
   results.push(await run(base,phase));
  assert.deepEqual(results,[
   'PASS_INLINE_READ_LISTEN_WRITE','PASS_SOURCE_FAIL_CLOSED',
   'PASS_AUDIO_FAIL_CLOSED','PASS_AUDIO_FAIL_CLOSED','PASS_MISSING_CATALOG']);
  assert.equal(mutationRequests,0,'WRI source guide must never mutate assessments');
  console.log(JSON.stringify({result:'PASS',gate:'WRI-A2-07-Read-Listen-Write-inline-real-Chromium',
   originalReadingNotice:true,inlineOriginalAudio:true,forcedNavigation:false,
   optionalOriginalLinks:true,missingSourceFailClosed:true,invalidAudioFailClosed:true,
   transcriptLeak:false,listeningCredit:false,originalScoresUntouched:true,
   realIphoneSafari:'NOT_TESTED',productionWrites:mutationRequests}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
