'use strict';
// v1.20.0 exact cumulative importer test: 1.18.1 -> 1.19.0 -> 1.20.0.
// C1/C2 academic NotebookLM PASS provided by owner; production unapproved.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const v118=require('../content/curriculum-1.18.1-candidate.json');
const v119=require('../content/curriculum-1.19.0-candidate.json');
const v120=require('../content/curriculum-1.20.0-candidate.json');
const extraIDs=['REA-C1-01','VOC-C2-01'];
const activities=pack=>pack.lessons.flatMap(l=>l.activities);
assert.deepEqual([v118.schema_version,v119.schema_version,v120.schema_version],['1.18.1','1.19.0','1.20.0']);
assert.deepEqual([v118.lessons.length,v119.lessons.length,v120.lessons.length],[109,121,123]);
assert.deepEqual([activities(v118).length,activities(v119).length,activities(v120).length],[913,1009,1025]);
assert.deepEqual(v119.lessons.slice(0,109),v118.lessons);
assert.deepEqual(v120.lessons.slice(0,121),v119.lessons,'All 121 previously reviewed lesson records must be untouched');
assert.deepEqual(v120.course.sequence.slice(0,121),v119.course.sequence);
assert.deepEqual(v120.course.sequence.slice(121),extraIDs);
for(const k of Object.keys(v119).filter(k=>!['schema_version','status','lessons','course'].includes(k)))assert.deepEqual(v120[k],v119[k],k+' changed unexpectedly');
for(const k of Object.keys(v119.course).filter(k=>k!=='sequence'))assert.deepEqual(v120.course[k],v119.course[k],k+' changed unexpectedly');
assert.equal(new Set(v120.lessons.map(l=>l.id)).size,123);
assert.equal(new Set(activities(v120).map(a=>a.id)).size,1025);
const newRows=v120.lessons.slice(121);
assert.deepEqual(newRows.map(x=>x.id),extraIDs);
assert.deepEqual(newRows.map(x=>x.cefr_target),['C1','C2']);
assert.deepEqual(newRows.map(x=>x.module),['reading','vocabulary']);
assert.deepEqual(newRows.map(x=>x.activities.length),[8,8]);
for(const l of newRows){
 assert(l.objectives.length>=2&&l.examples.length>=2&&l.explanation.en.length>700);
 for(const q of l.activities){
  assert(q.id.startsWith(l.id+'-'));
  assert.equal(q.type,'single_choice');
  assert.equal(q.options.length,4);
  assert.equal(q.evidence_weight,1);
  assert(q.options.some(o=>o.id===q.answer.correct_option_id));
  assert(q.skill_tags?.every(t=>t.startsWith(l.module+'.')));
  assert(q.feedback.explanation_en.includes('Next step:'));
  assert(!/\b(?:option [A-D] is correct|correct answer is [A-D])\b/i.test(q.feedback.explanation_en));
 }
}
assert(newRows[0].reading_asset?.display_to_learner===true);
assert(newRows[0].reading_asset.body.length>2000);
assert(!newRows[1].reading_asset);
const out='.sites-runtime/v120-cumulative-release-qa';
fs.mkdirSync(path.join(root,'.sites-runtime'),{recursive:true});
execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc',
 'domain/content-model.ts','domain/academic.ts','domain/option-order.ts',
 'application/learning-service.ts','application/academic-service.ts',
 'infrastructure/storage/browser-local-repositories.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const {validateSeed,mapSeed}=require('../'+out+'/domain/academic.js');
const {validateContent}=require('../'+out+'/domain/content-model.js');
const {createOptionOrder,orderedOptions,validateOptionOrder}=require('../'+out+'/domain/option-order.js');
const {academicService}=require('../'+out+'/application/academic-service.js');
const {BrowserLocalAcademicRepository,BrowserLocalLearningRepository}=require('../'+out+'/infrastructure/storage/browser-local-repositories.js');
for(const p of [v118,v119,v120]){assert.deepEqual(validateSeed(p),[]);assert.deepEqual(validateContent(mapSeed(p)),[])}
let reordered=0;
for(const l of newRows){
 const order=createOptionOrder(l.activities,()=>0);
 validateOptionOrder(l.activities,{version:'1.20.0',optionOrder:order});
 for(const q of l.activities){
  const display=orderedOptions(q,{optionOrder:order});
  assert.equal(new Set(display.map(x=>x.id)).size,4);
  assert.equal(display.find(x=>x.id===q.answer.correct_option_id).text,q.options.find(x=>x.id===q.answer.correct_option_id).text);
  if(JSON.stringify(display.map(x=>x.id))!==JSON.stringify(q.options.map(x=>x.id)))reordered++;
 }
}
assert(reordered>0,'At least one C1/C2 question must have a nontrivial tested shuffle');
class MemoryRepo{
 p=[];a=new Map();
 async packages(){return structuredClone(this.p)}
 async addPackage(x){this.p.push(structuredClone(x))}
 async attempts(owner){return structuredClone(this.a.get(owner)??[])}
 async start(owner,x){const a=this.a.get(owner)??[];a.push(structuredClone(x));this.a.set(owner,a)}
 async saveDraft(owner,id,patch){const a=this.a.get(owner)??[];const row=a.find(x=>x.id===id);if(row)Object.assign(row,structuredClone(patch))}
 async finish(_,x){return x}
 async approve(_,x){return x}
 async readState(){return null}
 async readEvidence(){return []}
 async appendEvidence(){}
 async readAssessments(){return []}
 async legacyImported(){return true}
 async markLegacyImported(){}
 async appendSnapshot(){}
}
class QuotaStorage{
 map=new Map();
 constructor(limit){this.limit=limit}
 getItem(k){return this.map.get(k)??null}
 setItem(k,v){
  const next=new Map(this.map);next.set(k,String(v));
  const bytes=[...next].reduce((n,[key,val])=>n+(key.length+val.length)*2,0);
  if(bytes>this.limit){const e=new Error('QuotaExceeded: 5MiB browser simulation');e.name='QuotaExceededError';throw e}
  this.map=next;
 }
 removeItem(){throw Error('The release may not delete old packages or attempts')}
 bytes(){return [...this.map].reduce((n,[k,v])=>n+(k.length+v.length)*2,0)}
}
(async()=>{
 const r=new MemoryRepo(),svc=academicService(r,r,'v120-qa-owner');
 for(const [i,p] of [v118,v119,v120].entries()){
  const preview=await svc.preview(p);
  assert.deepEqual(preview.errors,[]);
  assert.deepEqual(preview.counts,[
   {add:109,update:0,skip:0,conflict:0},
   {add:12,update:0,skip:109,conflict:0},
   {add:2,update:0,skip:121,conflict:0}
  ][i]);
  await svc.importPackage(p,preview.token,true);
  if(i===0){
   const attempt=await svc.start('REA-A1-01','old-attempt');
   assert.equal(attempt.version,'1.18.1');
  }
 }
 assert.equal((await svc.catalog()).version,'1.20.0');
 assert.equal((await svc.lesson('REA-C1-01')).lesson.cefrTarget,'C1');
 assert.equal((await svc.lesson('VOC-C2-01')).lesson.cefrTarget,'C2');
 assert.equal((await svc.lesson('REA-A1-01','1.18.1')).lesson.id,'REA-A1-01');
 assert.deepEqual((await r.attempts('v120-qa-owner')).map(x=>x.version),['1.18.1']);
 const storage=new QuotaStorage(5*1024*1024);
 const ar=new BrowserLocalAcademicRepository(storage);
 const lr=new BrowserLocalLearningRepository(storage);
 const browser=academicService(ar,lr,'v120-local-qa');
 for(const [i,p] of [v118,v119,v120].entries()){
  const preview=await browser.preview(p);
  assert.deepEqual(preview.errors,[]);
  assert.deepEqual(preview.counts,[
   {add:109,update:0,skip:0,conflict:0},
   {add:12,update:0,skip:109,conflict:0},
   {add:2,update:0,skip:121,conflict:0}
  ][i]);
  await browser.importPackage(p,preview.token,true);
  if(i===0)await browser.start('REA-A1-01','old-browser-attempt');
 }
 assert.equal((await browser.catalog()).version,'1.20.0');
 const a=await ar.attempts('v120-local-qa');
 assert.equal(a.length,1);
 assert.equal(a[0].version,'1.18.1');
 assert.deepEqual((await ar.packages()).map(x=>x.version),['1.18.1','1.19.0','1.20.0']);
 const used=storage.bytes();
 console.log(JSON.stringify({result:'PASS',gate:'v1.20.0-cumulative-importer-release-preflight',
  lessons:123,activities:1025,old121Immutable:true,
  preview:{add:2,update:0,skip:121,conflict:0},
  newObjectiveItems:16,shuffledItems:reordered,
  historicAttemptsUnchanged:true,localStorageBytes:used,localStorageLimit:storage.limit,
  academicVerdict:'PASS_FROM_NOTEBOOKLM',productionWrites:0,realBrowserGUI:'NOT_TESTED'}));
})().catch(e=>{console.error(e);process.exitCode=1});
