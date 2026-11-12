'use strict';
/**
 * Synthetic native-Chromium QA for EVERY declared source-backed Writing task.
 * The server returns the ORIGINAL authored source text/audio manifest metadata.
 * Never contacts production or records a scored student attempt.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime/writing-source-bundle-browser');
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',
  define:{'process.env.NODE_ENV':JSON.stringify('production'),
   'process.env.NEXT_PUBLIC_LEARNING_RUNTIME':JSON.stringify('server')},
  build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/writing-source-bundle-browser-entry.tsx'),
    formats:['iife'],name:'WritingSourceBundleBrowser',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 const css=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
 const styles=css.slice(css.indexOf(':root {'));
 const lessons=JSON.parse(fs.readFileSync(
  path.join(root,'content/curriculum-1.25.0-candidate.json'),'utf8')).lessons;
 const mp3=JSON.parse(fs.readFileSync(path.join(root,'content/foundation-audio.json'),'utf8'));
 const manifest=JSON.parse(fs.readFileSync(
  path.join(root,'content/writing-source-contracts-v1.json'),'utf8'));
 const lessonMap=new Map(lessons.map(x=>[x.id,x]));
 const binary=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(x=>{try{return cp.execFileSync('which',[x],{encoding:'utf8'}).trim()}
   catch{return ''}}).find(Boolean);
 if(!binary)throw Error('Native Chromium unavailable — cannot call QA PASS');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-writing-source-bundle-'));
 const html='<!doctype html><html><head><meta charset="utf-8">'+
  '<meta name="viewport" content="width=device-width,initial-scale=1">'+
  '<style>'+styles.replaceAll('</style>','<\\/style>')+'</style></head><body>'+
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
    res.writeHead(405).end('Source view must be read-only');return;
   }
   const phase=url.searchParams.get('phase');
   const id=url.searchParams.get('lesson');
   const version=url.searchParams.get('version');
   const lesson=lessonMap.get(id);
   if(!lesson||version!=='1.25.0'||phase==='missing'){
    res.writeHead(503,{'Content-Type':'application/json'});
    res.end(JSON.stringify({error:'Synthetic source not found'}));return;
   }
   const originalAudio=mp3[id];
   const result={version:phase==='wrongVersion'?'1.24.0':'1.25.0',
    lesson:{id:lesson.id,module:lesson.module,
     reading_asset:lesson.reading_asset,
     // Malicious fixture: client should never display the transcript field.
     audio_asset:lesson.audio_asset?
      {source_text:'PROTECTED_LISTENING_TRANSCRIPT'}:undefined},
    audio:phase==='audioMissing'?null:
     phase==='audioWrongUrl'?{url:'https://invalid.example/evil.mp3',duration:20}:
     originalAudio?{url:originalAudio.url,duration:originalAudio.duration}:null};
   res.writeHead(200,{'Content-Type':'application/json'});
   res.end(JSON.stringify(result));return;
  }
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});
  res.end(html);
 });
 function run(base,lessonId,phase){
  return new Promise((resolve,reject)=>{
   const child=cp.spawn(binary,['--headless=new','--no-sandbox',
    '--disable-dev-shm-usage','--disable-extensions','--disable-background-networking',
    '--no-first-run','--virtual-time-budget=45000','--dump-dom',
    '--window-size=390,844','--user-data-dir='+profile,
    base+'/?lesson='+lessonId+'&phase='+phase],{stdio:['ignore','pipe','pipe']});
   let stdout='',stderr='',timedOut=false;
   const timer=setTimeout(()=>{timedOut=true;child.kill('SIGKILL')},40000);
   child.stdout.on('data',d=>stdout+=String(d));
   child.stderr.on('data',d=>stderr+=String(d));
   child.on('error',reject);
   child.on('close',code=>{
    clearTimeout(timer);
    if(timedOut||code!==0)
     return reject(Error('Chromium exit '+code+' '+stderr.slice(-400)));
    const actual=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
    if(!actual.startsWith('PASS_'))
     return reject(Error(lessonId+' '+phase+' failed: '+actual.slice(0,1400)));
    resolve({writing:lessonId,phase,actual});
   });
  });
 }
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base='http://127.0.0.1:'+server.address().port;
  const results=[];
  // Not a spot check: exercise every Reading-only and Reading+Listening source bundle.
  for(const id of Object.keys(manifest.lessons)){
   results.push(await run(base,id,'ok'));
  }
  for(const [id,phase] of [
   ['WRI-A2-07','missing'],['WRI-A2-07','wrongVersion'],
   ['WRI-A2-07','audioMissing'],['WRI-A2-07','audioWrongUrl'],
   ['WRI-A2-07','unavailable'],
   ['WRI-A2-11','unavailable'],
   ['WRI-A2-01','standalone']
  ])results.push(await run(base,id,phase));
  assert.equal(results.length,Object.keys(manifest.lessons).length+7);
  assert.equal(results.filter(x=>x.actual==='PASS_INLINE_SOURCE_FLOW').length,14);
  assert.equal(mutationRequests,0,'The source bundle must never alter saved assessments');
  console.log(JSON.stringify({result:'PASS',
   gate:'ALL-14-Writing-Source-Bundles-native-Chromium',
   totalCases:results.length,sourceBacked:14,
   readingOnly:11,readAndListen:3,standaloneWritingUntouched:true,
   missingSourceAndBadAudioFailClosed:true,transcriptLeak:false,
   forcedNavigation:false,listeningScoresWritten:0,productionWrites:mutationRequests,
   realIPhoneSafari:'NOT_TESTED'}));
 }finally{
  server.close();
  fs.rmSync(profile,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
