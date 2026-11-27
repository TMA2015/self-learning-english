'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true}}).outputText,f);
const {academicService,sourceDigest}=require('../application/academic-service.ts');
const {mapSeed}=require('../domain/academic.ts');
const {previewReviewedContentReplay}=require('../infrastructure/browser/content-release-readonly-preview.ts');
const base=require('../content/curriculum-1.28.0-candidate.json'),next=require('../content/curriculum-1.28.1-candidate.json');
const bytes=fs.readFileSync(path.join(__dirname,'../content/curriculum-1.28.1-candidate.json'));
const fixture=require('../research/content-release-exact-digest-fixture.json');
async function record(source){return {id:source.package_id,version:source.schema_version,digest:await sourceDigest(source),source:structuredClone(source),bundle:mapSeed(source),at:1};}
(async()=>{
 const old=await record(base),fresh=await record(next);
 let stored=[old],writes=0,reads=0;
 const noWrite=()=>{writes++;throw Error('Read-only adapter attempted a write');};
 // Real academicService, read-only repository test double; no storage backend experiment.
 const repo={packages:async()=>{reads++;return structuredClone(stored);},attempts:async()=>[],addPackage:noWrite,start:noWrite,saveDraft:noWrite,finish:noWrite,approve:noWrite};
 const learning=new Proxy({},{get:()=>noWrite});
 const service=academicService(repo,learning,'synthetic-preview');
 const run=async(name,expected,input=bytes,override=service)=>{
  const before=JSON.stringify(stored);
  const result=await previewReviewedContentReplay(input,override);
  assert.equal(result.reason??result.status,expected,name);
  assert.equal(JSON.stringify(stored),before,name+' source unchanged');
  assert.equal(writes,0,name+' no writes');
  assert(!Object.hasOwn(result,'token')&&!Object.hasOwn(result,'source'));
  return name;
 };
 const rows=[];
 rows.push(await run('actual service exact approved replay','PREVIEW_ONLY'));
 assert.equal((await service.catalog()).version,'1.28.0');
 rows.push(await run('truncated bytes','length',bytes.subarray(0,-1)));
 const altered=Buffer.from(bytes);altered[100]^=1;
 rows.push(await run('same size tamper','raw-digest',altered));
 stored=[];rows.push(await run('missing baseline','missing-baseline'));
 stored=[fresh];rows.push(await run('already current','already-current'));
 stored=[{...fresh,digest:'0'.repeat(64)}];rows.push(await run('same-version conflict','immutable-conflict'));
 stored=[{...fresh,version:'1.28.2'}];rows.push(await run('newer local','unrecognized-baseline'));
 stored=[{...old,digest:'0'.repeat(64)}];rows.push(await run('wrong base digest','unrecognized-baseline'));
 stored=[{...old,source:{...old.source,status:'changed'}}];rows.push(await run('corrupted base source','baseline-source-mismatch'));
 stored=[old,old];rows.push(await run('duplicate local version','invalid-local-versions'));
 stored=[{...old,version:'bad'}];rows.push(await run('invalid local version','invalid-local-versions'));
 stored=[old];rows.push(await run('preview disagrees','preview-mismatch',bytes,{...service,preview:async()=>({...await service.preview(next),counts:{add:1,update:5,skip:170,conflict:0}})}));
 let calls=0;rows.push(await run('catalog changes during preview','baseline-changed',bytes,{...service,packages:async()=>++calls===1?[old]:[old,fresh]}));
 rows.push(await run('repository failure','read-only-preview-failed',bytes,{...service,packages:async()=>{throw Error('unavailable')}}));
 // Exercise the previously tested transport with the actual reviewed source bytes.
 const {downloadVerifiedContent}=await import('../research/content-release-transport.mjs');
 const pin={version:fixture.successor.version,byteLength:fixture.successor.byteLength,rawSha256:fixture.successor.rawSha256,path:'/content-releases/'+fixture.successor.version+'/'+fixture.successor.rawSha256+'.json'};
 const origin='https://example.test',downloaded=await downloadVerifiedContent(origin,pin,{fetcher:async url=>{const response=new Response(bytes,{headers:{'content-type':'application/json'}});Object.defineProperty(response,'url',{value:url});return response;}});
 rows.push(await run('verified transport to actual AcademicService','PREVIEW_ONLY',downloaded.bytes));
 assert.equal(rows.length,15);assert.equal(writes,0);assert.equal((await service.catalog()).version,'1.28.0');
 console.log(JSON.stringify({gate:'CONTENT_RELEASE_READONLY_PREVIEW',pass:rows.length,total:15,rows,actualAcademicService:true,exactReviewedBytes:true,writeCalls:writes,repository:'READ_ONLY_TEST_DOUBLE',network:'MOCKED',activation:'NOT_AUTHORIZED'}));
})().catch(e=>{console.error(e);process.exitCode=1;});
