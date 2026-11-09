'use strict';
/**
 * Draft-only MEDIA-01: Vite builds the REAL FoundationDemo and real
 * browser-local AcademicService on v1.22 with immutable v1.21 Unit10 media fixture.
 *
 * Chrome uses a disposable profile and the original bytes via localhost only.
 * No Firestore, production deployment, external web requests or learner data.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const http=require('node:http'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const manifest=require('../content/foundation-audio.json');
const receipts=require('../content/batches/unit10-owner-audio-receipts-20261107.json');
const ids=['LIS-A1-06','LIS-A2-07','LIS-B1-08'];
assert.deepEqual(receipts.assets.map(x=>x.lesson_id),ids);
const media=new Map();
for(const a of receipts.assets){
 const m=manifest[a.lesson_id];
 assert(m && m.source===a.source_text);
 assert.equal(m.url,'/foundation-audio/'+a.lesson_id+'-v1.mp3');
 assert.equal(m.sha256,a.sha256);
 assert.equal(a.owner_audio_qa,'PASS');
 assert.equal(a.rights_clearance_for_new_assets,'APPROVED');
 const bytes=fs.readFileSync(path.join(root,a.canonical_asset_path));
 assert.equal(bytes.length,a.byte_size);
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),a.sha256);
 media.set(m.url,{bytes,sha:a.sha256});
}
let chrome='';
for(const name of ['google-chrome','google-chrome-stable','chromium','chromium-browser']){
 try{chrome=cp.execFileSync('which',[name],{encoding:'utf8'}).trim();if(chrome)break}catch{}
}
if(!chrome)throw Error('No native Chrome installed — real MEDIA-01 is NOT verified.');
(async()=>{
 const generated='.sites-runtime/unit10/curriculum-1.21.0-CANDIDATE-NO-MEDIA.json';
 cp.execFileSync(process.execPath,['scripts/compose-unit10-v121-candidate.cjs'],{cwd:root,stdio:'inherit'});
 assert(fs.existsSync(path.join(root,generated)),'Candidate dry-run artifact missing');
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime','unit10-media01-real-browser');
 fs.rmSync(out,{recursive:true,force:true});
 await build({
  root,configFile:false,logLevel:'error',
  define:{
   'process.env.NEXT_PUBLIC_LEARNING_RUNTIME':JSON.stringify('browser'),
   'process.env.NODE_ENV':JSON.stringify('production'),
  },
  build:{
   outDir:out,emptyOutDir:true,target:'es2022',minify:false,
   lib:{
    entry:path.join(root,'tests/unit10-media01-browser-entry.tsx'),
    formats:['iife'],name:'Unit10Media01BrowserTest',fileName:()=> 'bundle.js'
   }
  }
 });
 const bundle=fs.readFileSync(path.join(out,'bundle.js'));
 assert(bundle.length>100000,'Real player bundle unexpectedly small');
 const html='<!doctype html><html><head><meta charset="utf-8"></head><body>'+
  '<main id="app"></main>'+
  '<script>window.process={env:{NODE_ENV:"production",NEXT_PUBLIC_LEARNING_RUNTIME:"browser"}};</script>'+
  '<script src="/bundle.js"></script>'+
  '</body></html>';
 let complete;
 let resolveResult=()=>{};
 let rejectResult=()=>{};
 let outputFinished=false;
 const result=new Promise((resolve,reject)=>{resolveResult=resolve;rejectResult=reject;});
 const server=http.createServer((req,res)=>{
  const url=(req.url||'/').split('?')[0];
  if(url==='/__result' && req.method==='POST'){
   let body='';
   req.on('data',d=>{body+=String(d);if(body.length>100000)req.destroy();});
   req.on('end',()=>{
    try{
     const data=JSON.parse(body);
     res.writeHead(200,{'Content-Type':'text/plain'});res.end('reported');
     if(outputFinished)return;
     outputFinished=true;
     if(data.status==='PASS')resolveResult(data.details);
     else rejectResult(Error('Actual product-player QA: '+JSON.stringify(data.details).slice(0,12000)));
    }catch(e){rejectResult(e)}
   });return;
  }
  if(req.method==='GET'&&url==='/'){
   res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});
   res.end(html);return;
  }
  if(req.method==='GET'&&url==='/bundle.js'){
   res.writeHead(200,{'Content-Type':'application/javascript','Content-Length':bundle.length,'Cache-Control':'no-store'});
   res.end(bundle);return;
  }
  const item=media.get(url);
  if(req.method==='GET'&&item){
   const total=item.bytes.length;
   let start=0,end=total-1,status=200;
   const hit=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range||'');
   if(hit){
    start=Number(hit[1]);end=hit[2]?Number(hit[2]):end;
    if(start>=total||end>=total||start>end){
     res.writeHead(416,{'Content-Range':'bytes */'+total});res.end();return;
    }
    status=206;
   }
   const headers={'Content-Type':'audio/mpeg','Accept-Ranges':'bytes','Content-Length':end-start+1,'Cache-Control':'no-store'};
   if(status===206)headers['Content-Range']='bytes '+start+'-'+end+'/'+total;
   res.writeHead(status,headers);res.end(item.bytes.subarray(start,end+1));return;
  }
  res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');
 });
 let browser,timeout;
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-unit10-media01-product-chrome-'));
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const url='http://127.0.0.1:'+server.address().port+'/';
  browser=cp.spawn(chrome,[
    '--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu',
    '--no-first-run','--disable-extensions','--disable-background-networking',
    '--autoplay-policy=no-user-gesture-required','--mute-audio',
    '--user-data-dir='+profile,url
  ],{stdio:['ignore','ignore','pipe']});
  let stderr='';
  browser.stderr.on('data',d=>stderr=(stderr+String(d)).slice(-4000));
  browser.on('error',e=>rejectResult(e));
  browser.on('close',code=>{
   if(!outputFinished)rejectResult(Error('Chrome ended early with exit '+code+' '+stderr.slice(-1000)));
  });
  timeout=setTimeout(()=>rejectResult(Error('Actual product-player MEDIA-01 timed out after 220s')),220000);
  const detail=await result;
  assert(detail?.suite==='UNIT10_MEDIA01_REAL_FOUNDATION_CHROME');
  assert.deepEqual(detail.lessons?.map(x=>x.id),ids);
  assert(detail.lessons.every(x=>x.played&&x.answered&&x.submitted&&x.retake));
  assert.equal(detail.olderAttemptPreserved,true);
  assert.equal(detail.productionImport,false);
  assert.equal(detail.releaseAuthorized,false);
  console.log(JSON.stringify({
    result:'PASS',gate:'UNIT10_MEDIA01_PRODUCT_CHROME',
    actualFoundationComponent:true,actualAcademicService:true,version:'1.24.0',
    originalMedia:ids,fullRealPlaySubmitAndRetake:true,draftResume:true,
    transcriptBeforeSubmissionBlocked:true,olderAttemptPreserved:true,
    realSafariIpad:'NOT_TESTED',
    mode:'LOCALHOST_ONLY_DISPOSABLE_PROFILE',liveLearnerDataTouched:false,
    mergeOrDeploy:false,productionRelease:'NO_GO'
  }));
 }finally{
  clearTimeout(timeout);
  if(browser&&!browser.killed)browser.kill('SIGKILL');
  server.close();
  try{fs.rmSync(profile,{recursive:true,force:true})}catch{}
 }
})().catch(e=>{console.error(e);process.exitCode=1});
