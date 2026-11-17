'use strict';
/**
 * F3 B2 v1.26.0 real Chromium / localStorage disposable-profile preflight.
 * This is NOT a Safari/iPad test, NOT production import and NOT a migration.
 * No learner, live site, Firebase account or real Recovery backup is touched.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const cp=require('node:child_process'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'.sites-runtime','f3-v126-chromium');
fs.rmSync(output,{recursive:true,force:true});
cp.execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc',
 'infrastructure/storage/browser-local-repositories.ts',
 '--outDir','.sites-runtime/f3-v126-chromium',
 '--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
function walk(dir){
 return fs.readdirSync(dir).flatMap(name=>{
  const file=path.join(dir,name);
  return fs.statSync(file).isDirectory()?walk(file):/\.(?:js|json)$/.test(name)?[file]:[];
 });
}
const modules={};
for(const file of walk(output))
 modules['/'+path.relative(output,file).replaceAll(path.sep,'/')]=fs.readFileSync(file,'utf8');
const sources={};
for(const [key,file] of [
 ['124','curriculum-1.24.0-candidate.json'],
 ['125','curriculum-1.25.0-candidate.json'],
 ['126','curriculum-1.26.0-candidate.json']
])sources[key]=fs.readFileSync(path.join(root,'content',file),'utf8');
function browserMain(MODULES){
 const cache={};
 function norm(p){
  const out=[];for(const s of p.split('/')){
   if(!s||s==='.')continue;
   if(s==='..')out.pop();else out.push(s);
  }return '/'+out.join('/');
 }
 function resolve(requester,spec){
  const relative=spec.startsWith('/')?spec:requester.slice(0,requester.lastIndexOf('/')+1)+spec;
  const candidate=norm(relative);
  for(const p of [candidate,candidate+'.js',candidate+'.json',candidate+'/index.js'])
   if(Object.hasOwn(MODULES,p))return p;
  throw Error('MODULE_NOT_FOUND '+candidate);
 }
 function load(spec,from='/entry.js'){
  const key=resolve(from,spec);
  if(cache[key])return cache[key].exports;
  const m={exports:{}};cache[key]=m;
  if(key.endsWith('.json')){m.exports=JSON.parse(MODULES[key]);return m.exports}
  new Function('require','module','exports',MODULES[key])(s=>load(s,key),m,m.exports);
  return m.exports;
 }
 const check=(v,message)=>{if(!v)throw Error('F3 Chromium QA: '+message)};
 const finish=(status,data)=>{
  document.getElementById('sle-qa-result').textContent=status+' '+JSON.stringify(data);
  document.documentElement.dataset.sleResult=status;
 };
 const canonical=v=>Array.isArray(v)?v.map(canonical):
  v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
 const sha=async v=>Array.from(new Uint8Array(
  await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(canonical(v))))
 )).map(x=>x.toString(16).padStart(2,'0')).join('');
 const owner='synthetic-chromium-f3',ns='g-learning:english:v1';
 const snapshot=()=>Array.from({length:localStorage.length},(_,i)=>{
  const key=localStorage.key(i);return [key,localStorage.getItem(key)];
 });
 const size=()=>snapshot().reduce((n,[k,v])=>n+2*(k.length+v.length),0);
 const versions=['1.24.0','1.25.0'];
 const stateKey=ns+':owner:'+owner+':learner:primary:state';
 (async()=>{
  const {BrowserLocalAcademicRepository}=load('/infrastructure/storage/browser-local-repositories.js');
  const {mapSeed,validateSeed}=load('/domain/academic.js');
  const repo=new BrowserLocalAcademicRepository(localStorage);
  const phase=new URL(location.href).searchParams.get('phase');
  const fetchSource=async n=>{
   const response=await fetch('/source/'+n,{cache:'no-store'});
   check(response.ok,'missing public curriculum fixture '+n);
   return response.json();
  };
  const pkg=async(s,at)=>({
   id:s.package_id,version:s.schema_version,digest:await sha(s),
   source:s,bundle:mapSeed(s),at
  });
  if(phase==='populate'){
   localStorage.clear(); // ONLY the isolated disposable localhost Chromium profile
   const a=await fetchSource('124'),b=await fetchSource('125');
   check(validateSeed(a).length===0&&validateSeed(b).length===0,'invalid original curriculum source');
   check(a.lessons.length===142&&b.lessons.length===154,'fixture version mismatch');
   await repo.addPackage(await pkg(a,1));
   await repo.addPackage(await pkg(b,2));
   const lessonIds=['GRA-A1-01','LIS-A1-03','WRI-A1-05','VOC-A2-03','REA-A2-08'];
   for(let i=0;i<73;i++){
    const source=i%2?b:a,lessonId=lessonIds[i%lessonIds.length];
    const lesson=source.lessons.find(l=>l.id===lessonId);
    check(!!lesson,'missing historical test lesson '+lessonId);
    const q=lesson.activities[0],id='f3-native-history-'+String(i+1).padStart(3,'0'),scored=i<52;
    await repo.start(owner,{
     id,rootId:id,packageId:source.package_id,version:source.schema_version,
     lessonId,status:scored?'scored':'started',
     answers:{[q.id]:'f3-answer-'+i},createdAt:1700000000000+i,
     evidence:[{id:'synthetic-'+i,at:1700000000000+i,tag:'practice'}],
     ...(scored?{submittedAt:1700000001000+i,results:[{
      id:q.id,correct:i%2===0,explanation:'Historical feedback preserved',
      tags:[...q.skill_tags]}]}:{})
    });
   }
   localStorage.setItem(stateKey,JSON.stringify({
    writing:'This is synthetic draft text; do not alter it.',
    reviews:[{id:'synthetic-review',text:'Preserve'}]
   }));
   check((await repo.attempts(owner)).length===73,'fixture must have 73 attempts');
   check((await repo.packages()).length===2,'fixture must have two complete packages');
   finish('PASS_POPULATE',{versions,attempts:73,initialBrowserBytes:size()});
  }else if(phase==='upgrade'){
   const originals=await repo.attempts(owner),initial=await repo.packages();
   check(originals.length===73,'73 attempts did not survive browser restart');
   check(initial.length===2&&initial[1].version==='1.25.0','version history not persisted');
   const oldState=localStorage.getItem(stateKey),origKeys=snapshot(),origBytes=size();
   const source=await fetchSource('126');
   check(validateSeed(source).length===0&&source.lessons.length===166,'invalid candidate source');
   const incoming=await pkg(source,3),padKey='__qa_only_f3_padding';
   const chunk='x'.repeat(128*1024);
   let padding='',nativeQuotaObserved=false;
   for(let i=0;i<100;i++){
    try{localStorage.setItem(padKey,padding+chunk);padding+=chunk}
    catch(e){
     check(e&&e.name==='QuotaExceededError','unexpected native storage failure: '+String(e));
     nativeQuotaObserved=true;break;
    }
   }
   check(nativeQuotaObserved,'native Chromium quota not reached (cannot claim real quota QA)');
   const before=snapshot();
   let quotaRejected=false;
   try{await repo.addPackage(incoming)}
   catch(e){quotaRejected=/no storage space|quota/i.test(String(e));if(!quotaRejected)throw e}
   check(quotaRejected,'v1.26 should fail under deliberately filled native localStorage quota');
   check(JSON.stringify(snapshot())===JSON.stringify(before),'quota failure changed stored keys');
   check(JSON.stringify(await repo.attempts(owner))===JSON.stringify(originals),'old attempts changed');
   check(localStorage.getItem(stateKey)===oldState,'old Writing/reviews changed');
   check((await repo.packages()).length===2,'failed import inserted new version');
   const historic=(await repo.packages()).find(p=>p.version==='1.24.0');
   check(historic.source.lessons.find(l=>l.id==='GRA-A1-01'),'original lesson source lost');
   localStorage.removeItem(padKey); // remove ONLY test-owned padding key
   check(JSON.stringify(snapshot())===JSON.stringify(origKeys),'padding cleanup changed historic data');
   let candidateResult='BLOCKED_NATIVE_QUOTA';
   try{
    await repo.addPackage(incoming);
    candidateResult='FITS_NATIVE_CHROMIUM';
   }catch(e){check(/no storage space|quota/i.test(String(e)),'unexpected candidate error: '+String(e))}
   check(JSON.stringify(await repo.attempts(owner))===JSON.stringify(originals),'attempts changed after retry');
   check(localStorage.getItem(stateKey)===oldState,'Writing changed after retry');
   if(candidateResult==='FITS_NATIVE_CHROMIUM'){
    const packs=await repo.packages();
    check(packs.length===3&&packs[2].version==='1.26.0','candidate did not persist');
    check(packs[0].source.lessons.length===142&&packs[1].source.lessons.length===154,'original sources changed');
   }else check(JSON.stringify(snapshot())===JSON.stringify(origKeys),'blocked retry changed stored keys');
   finish('PASS_UPGRADE',{
    beforeBytes:origBytes,nativeQuotaObserved,forcedQuotaRejected:true,
    zeroChangedLearnerKeys:true,historicalVersionsPinned:true,
    candidateResult,afterBytes:size(),preservedAttempts:73,
    realChromiumStorage:true,realSafari:false,liveTouched:false
   });
  }else throw Error('invalid Chromium QA phase');
 })().catch(e=>finish('FAIL',{message:String(e),stack:String(e?.stack).slice(0,850)}));
}
const html='<!doctype html><html><head><meta charset="utf-8"></head><body>'+
 '<div id="sle-qa-result">STARTED</div><script>'+
 ('('+browserMain.toString()+')('+JSON.stringify(modules)+')').replaceAll('</script>','<\\/script>')+
 '</script></body></html>';
let chromium='';
for(const c of ['google-chrome','google-chrome-stable','chromium','chromium-browser']){
 try{chromium=cp.execFileSync('which',[c],{encoding:'utf8'}).trim();if(chromium)break}catch{}
}
if(!chromium)throw Error('Real Chromium missing; real-browser QA cannot be claimed.');
function launch(url,profile){
 return new Promise((resolve,reject)=>{
  const p=cp.spawn(chromium,[
   '--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu',
   '--no-first-run','--disable-extensions','--disable-background-networking',
   '--virtual-time-budget=60000','--dump-dom','--user-data-dir='+profile,url
  ],{stdio:['ignore','pipe','pipe']});
  let stdout='',stderr='',timedOut=false;
  const timer=setTimeout(()=>{timedOut=true;p.kill('SIGKILL')},70000);
  p.stdout.on('data',d=>stdout+=String(d));
  p.stderr.on('data',d=>stderr+=String(d));
  p.on('error',e=>{clearTimeout(timer);reject(e)});
  p.on('close',code=>{
   clearTimeout(timer);
   if(timedOut||code!==0)return reject(Error('Chromium exit '+code+' '+stderr.slice(-800)));
   const m=stdout.match(/<div id="sle-qa-result">([\s\S]*?)<\/div>/);
   const value=m?.[1]||'';
   if(!value.startsWith('PASS_'))return reject(Error('Chromium F3 '+value.slice(0,1100)));
   resolve(value);
  });
 });
}
(async()=>{
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-f3-v126-browser-'));
 const server=http.createServer((req,res)=>{
  const m=req.url.match(/^\/source\/(124|125|126)(?:\?|$)/);
  if(m){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(sources[m[1]]);return}
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});
  res.end(html);
 });
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const base='http://127.0.0.1:'+server.address().port;
  const populated=await launch(base+'/?phase=populate',profile);
  const upgraded=await launch(base+'/?phase=upgrade',profile);
  assert.match(populated,/^PASS_POPULATE/);
  assert.match(upgraded,/^PASS_UPGRADE/);
  const details=JSON.parse(upgraded.slice(upgraded.indexOf(' ')+1).replaceAll('&quot;','"'));
  assert.equal(details.preservedAttempts,73);
  assert.equal(details.forcedQuotaRejected,true);
  console.log(JSON.stringify({result:'PASS',gate:'F3_V126_REAL_CHROMIUM_LOCALSTORAGE_QUOTA',
   browser:path.basename(chromium),processRestarts:1,realStorage:true,
   preservedAttempts:73,forcedQuotaRejected:true,candidateResult:details.candidateResult,
   beforeBytes:details.beforeBytes,afterBytes:details.afterBytes,
   iPadSafari:'NOT_TESTED',liveSiteTouched:false,realLearnerData:'NOT_TOUCHED',
   releaseAuthorised:false,deploy:false}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
