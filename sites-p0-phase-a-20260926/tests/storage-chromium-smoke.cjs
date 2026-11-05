'use strict';
/* Real Chromium localStorage + File API + SHA256 smoke, disposable localhost profile. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const cp=require('node:child_process'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'.sites-runtime','storage-chromium-v2');
fs.rmSync(out,{recursive:true,force:true});
cp.execFileSync(process.execPath,[
 path.join(root,'node_modules/typescript/bin/tsc'),
 'infrastructure/storage/browser-local-repositories.ts','infrastructure/browser/local-recovery.ts',
 '--outDir','.sites-runtime/storage-chromium-v2',
 '--module','commonjs','--target','es2022','--resolveJsonModule',
 '--esModuleInterop','--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
function walk(dir){
 const result=[];
 for(const name of fs.readdirSync(dir)){
  const file=path.join(dir,name);
  if(fs.statSync(file).isDirectory())result.push(...walk(file));
  else if(/\.(js|json)$/.test(name))result.push(file);
 }
 return result;
}
const modules={};
for(const file of walk(out))
 modules['/'+path.relative(out,file).replaceAll(path.sep,'/')]=fs.readFileSync(file,'utf8');
const seed=JSON.parse(fs.readFileSync(path.join(root,'content/academic-seed-v1.json'),'utf8'));
function browserMain(MODULES,seed){
 const cache={};
 function norm(p){
  const out=[];
  for(const s of p.split('/')){if(!s||s==='.')continue;if(s==='..')out.pop();else out.push(s)}
  return '/'+out.join('/');
 }
 function resolve(requester,spec){
  const partial=spec.startsWith('/')?spec:requester.slice(0,requester.lastIndexOf('/')+1)+spec;
  const file=norm(partial);
  for(const candidate of [file,file+'.js',file+'.json',file+'/index.js'])
   if(Object.hasOwn(MODULES,candidate))return candidate;
  throw Error('MODULE_NOT_FOUND '+file);
 }
 function load(request,id='/entry.js'){
  const file=resolve(id,request);
  if(cache[file])return cache[file].exports;
  const module={exports:{}};cache[file]=module;
  if(file.endsWith('.json')){module.exports=JSON.parse(MODULES[file]);return module.exports;}
  const localRequire=spec=>load(spec,file);
  new Function('require','module','exports',MODULES[file])(localRequire,module,module.exports);
  return module.exports;
 }
 const check=(v,message)=>{if(!v)throw Error('Browser QA: '+message)};
 const finish=(status,details)=>{
  document.getElementById('result').textContent=status+' '+JSON.stringify(details);
  document.documentElement.dataset.sleResult=status;
 };
 (async()=>{
  const {BrowserLocalAcademicRepository}=load('/infrastructure/storage/browser-local-repositories.js');
  const recovery=load('/infrastructure/browser/local-recovery.js');
  const owner='test-family',id=seed.lessons[0].id,ns='g-learning:english:v1';
  const pkg=(v)=>({id:'chrome-'+v,version:v,digest:'digest-'+v,
   source:{...seed,schema_version:v},bundle:{},at:1});
  const phase=new URL(location.href).searchParams.get('phase');
  if(phase==='1'){
   localStorage.clear(); // disposable QA profile and localhost only
   const repo=new BrowserLocalAcademicRepository(localStorage);
   await repo.addPackage(pkg('1.18.0'));
   await repo.start(owner,{id:'browserattempt0000001',rootId:'browserattempt0000001',
    packageId:'chrome-1.18.0',version:'1.18.0',lessonId:id,
    status:'started',answers:{},createdAt:1,evidence:[]});
   await repo.addPackage(pkg('1.18.1'));
   const before=localStorage.getItem(ns+':academic:packages').length;
   const p=await repo.previewRetention();
   check(p.protectedLessonCount===1,'must protect one historical lesson');
   await repo.compactRetention(p.token,true);
   const doc=JSON.parse(localStorage.getItem(ns+':academic:packages'));
   check(doc.schema===2&&doc.records.length===2,'retention document schema');
   check(doc.records.filter(x=>!x.archive).length===1,'one complete active curriculum');
   check(doc.records.find(x=>x.version==='1.18.0').source.lessons.length===1,'exact historic lesson');
   const after=localStorage.getItem(ns+':academic:packages').length;
   check(after<before,'retention reduces bytes');
   const file=await recovery.exportLocalRecoveryV2();
   const verified=await recovery.verifyLocalRecoveryV2(file.text);
   check(verified.attempts===1,'backup includes attempt');
   const browserFile=new File([file.text],file.filename,{type:'application/json'});
   check((await recovery.verifyLocalRecoveryV2(await browserFile.text())).sha256===verified.sha256,'File API SHA256');
   localStorage.setItem('__only_browser_test_backup',file.text);
   finish('PASS_PHASE_1',{before,after,attempts:file.attempts});
  }else if(phase==='2'){
   const text=localStorage.getItem('__only_browser_test_backup');
   check(!!text,'backup persists between Chromium processes');
   localStorage.clear(); // disposable QA profile and localhost only
   const repo=new BrowserLocalAcademicRepository(localStorage);
   await repo.addPackage(pkg('1.18.1'));
   const p=await recovery.previewLocalRecoveryV2(text);
   check(p.valid&&p.attempts===1,'fresh-profile recovery preview');
   await recovery.restoreLocalRecoveryV2(text,p.token,true);
   const at=await repo.attempts(owner);
   check(at.length===1&&at[0].lessonId===id,'historical attempt restored');
   const archived=(await repo.packages()).find(x=>x.version==='1.18.0');
   check(archived?.source.lessons.length===1,'historical lesson restored');
   check(!localStorage.getItem(recovery.RECOVERY_MARKER),'transaction finished');
   check(!(await recovery.previewLocalRecoveryV2(text)).valid,'prevent overwrite after restore');
   finish('PASS_PHASE_2',{restored:at.length,lesson:id});
  }else throw Error('Unknown browser QA phase');
 })().catch(err=>finish('FAIL',{error:String(err),stack:String(err?.stack).slice(0,750)}));
}
const init='('+browserMain.toString()+')('+JSON.stringify(modules)+','+JSON.stringify(seed)+')';
const html='<!doctype html><html><head><meta charset="utf-8"></head><body><div id="result">STARTED</div><script>'+init.replaceAll('</script>','<\\/script>')+'</script></body></html>';
const candidates=['google-chrome','google-chrome-stable','chromium','chromium-browser'];
let chrome='';
for(const c of candidates){try{chrome=cp.execFileSync('which',[c],{encoding:'utf8'}).trim();if(chrome)break}catch{}}
if(!chrome)throw Error('Real Chromium binary unavailable; browser QA cannot be claimed.');
function launch(url,profile){
 return new Promise((resolve,reject)=>{
  const c=cp.spawn(chrome,[
   '--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu',
   '--no-first-run','--disable-extensions','--disable-background-networking',
   '--virtual-time-budget=10000','--dump-dom','--user-data-dir='+profile,url
  ],{stdio:['ignore','pipe','pipe']});
  let stdout='',stderr='',expired=false;
  const tm=setTimeout(()=>{expired=true;c.kill('SIGKILL')},40000);
  c.stdout.on('data',d=>stdout+=String(d));
  c.stderr.on('data',d=>stderr+=String(d));
  c.on('error',err=>{clearTimeout(tm);reject(err)});
  c.on('close',code=>{
   clearTimeout(tm);
   if(expired||code!==0)return reject(Error('Chromium exit '+code+' '+stderr.slice(-950)));
   const value=stdout.match(/<div id="result">([\s\S]*?)<\/div>/)?.[1]||'';
   if(!value.startsWith('PASS_PHASE_'))return reject(Error('Browser result: '+value.slice(0,1400)+' stderr: '+stderr.slice(-300)));
   resolve(value);
  });
 });
}
(async()=>{
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-storage-chrome-v2-'));
 const server=http.createServer((req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
  res.end(html);
 });
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const port=server.address().port;
  const first=await launch('http://127.0.0.1:'+port+'/?phase=1',profile);
  const second=await launch('http://127.0.0.1:'+port+'/?phase=2',profile);
  assert.match(first,/^PASS_PHASE_1/);assert.match(second,/^PASS_PHASE_2/);
  console.log(JSON.stringify({result:'PASS',gate:'storage-chromium-v2',
   browser:path.basename(chrome),phases:2,
   realLocalStorage:true,realSHA256:true,realFileApi:true,
   persistedAcrossBrowserProcesses:true,liveSiteTouched:false,userDataTouched:false}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
