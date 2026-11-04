'use strict';
// Curriculum v1.19.0 regression: immutable source, actual validated importer,
// historic attempt preservation, browser-local quota, and position-safe MCQs.
// No production connection, learner account, deployment, or browser GUI required.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const original=require('../content/curriculum-1.18.1-candidate.json');
const candidate=require('../content/curriculum-1.19.0-candidate.json');
const root=path.resolve(__dirname,'..');
const newLessonIds=[
 'WRI-A2-05','WRI-A2-06','WRI-B1-04','WRI-B1-05','WRI-B1-06','WRI-B1-07',
 'VOC-A2-06','VOC-B1-06','VOC-B2-01','REA-A2-07','REA-B1-06','REA-B2-01'
];
const allActivities=s=>s.lessons.flatMap(l=>l.activities);
const oldIDs=new Set(original.lessons.map(l=>l.id));
const extra=candidate.lessons.filter(l=>!oldIDs.has(l.id));
assert.equal(original.schema_version,'1.18.1');
assert.equal(candidate.schema_version,'1.19.0');
assert.equal(original.lessons.length,109);
assert.equal(allActivities(original).length,913);
assert.equal(candidate.lessons.length,121);
assert.equal(allActivities(candidate).length,1009);
assert.deepEqual(candidate.lessons.slice(0,109),original.lessons,'Released lesson objects must be immutable');
for(const k of Object.keys(original).filter(k=>!['schema_version','status','lessons','course'].includes(k)))
  assert.deepEqual(candidate[k],original[k],'Unexpected top-level difference: '+k);
for(const k of Object.keys(original.course).filter(k=>k!=='sequence'))
  assert.deepEqual(candidate.course[k],original.course[k],'Unexpected course field: '+k);
assert.deepEqual(candidate.course.sequence.slice(0,109),original.course.sequence);
assert.deepEqual(candidate.course.sequence.slice(109),newLessonIds);
assert.deepEqual(extra.map(x=>x.id),newLessonIds);
assert.equal(new Set(candidate.lessons.map(l=>l.id)).size,121);
assert.equal(new Set(allActivities(candidate).map(q=>q.id)).size,1009);
assert.equal(extra.reduce((sum,l)=>sum+l.activities.length,0),96);
assert.equal(extra.filter(l=>l.module==='writing').length,6);
assert.equal(extra.filter(l=>l.module==='vocabulary').length,3);
assert.equal(extra.filter(l=>l.module==='reading').length,3);
const obj=extra.flatMap(l=>l.activities).filter(q=>q.evidence_weight===1);
const open=extra.flatMap(l=>l.activities).filter(q=>q.type==='extended_response');
assert.equal(obj.length,90);
assert.equal(open.length,6);
assert(open.every(q=>q.evidence_weight===0&&q.answer===null&&q.review_mode==='assisted_ai_or_human'));
assert(open.every(q=>q.feedback.pending_message.toLowerCase().includes('pending')));
assert(open.every(q=>q.rubric_id==='RUBRIC-WRITING-A2'||q.rubric_id==='RUBRIC-WRITING-B1'));
assert(extra.filter(l=>l.module==='reading').every(l=>l.reading_asset?.display_to_learner===true && l.reading_asset.body.length>200));
assert.equal(original.lessons.find(l=>l.id==='REA-A1-01').activities.find(q=>q.id==='REA-A1-01-Q7').skill_tags[0],'reading.inference');
assert.equal(candidate.lessons.find(l=>l.id==='REA-A1-01').activities.find(q=>q.id==='REA-A1-01-Q7').skill_tags[0],'reading.inference',
 'Optional issue #75 retag deferred to preserve all 913 old activities');
for(const lesson of extra){
 assert.equal(lesson.activities.length,8,lesson.id+' should have exactly 8 items');
 assert(lesson.objectives.length>0&&lesson.explanation.en.length>100&&lesson.examples.length>0);
 for(const item of lesson.activities){
  assert(item.id.startsWith(lesson.id+'-'));
  assert(item.prompt&&item.skill_tags?.length && item.feedback);
  if(item.type==='single_choice'){
   assert.equal(item.options.length,4);
   assert.equal(new Set(item.options.map(o=>o.id)).size,4);
   assert(item.options.some(o=>o.id===item.answer.correct_option_id));
   assert.equal(item.evidence_weight,1);
   assert(!/\b(?:correct answer is|option [A-D] is correct)\b/i.test(item.feedback.explanation_en),
     'Feedback must be independent of shuffled position');
  }
 }
 if(lesson.module==='writing'){
  assert.equal(lesson.activities.filter(q=>q.type==='single_choice').length,7);
  assert.equal(lesson.activities.filter(q=>q.type==='extended_response').length,1);
  for(const question of lesson.activities.filter(q=>q.type==='single_choice'))
   assert(!lesson.examples.join(' ').toLowerCase().includes(question.prompt.toLowerCase()),
    'Writing model must not copy scored question: '+question.id);
 }
}
const out='.sites-runtime/v119-release-qa';
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
const {academicService}=require('../'+out+'/application/academic-service.js');
const {createOptionOrder,orderedOptions,validateOptionOrder}=require('../'+out+'/domain/option-order.js');
assert.deepEqual(validateSeed(candidate),[]);
assert.deepEqual(validateContent(mapSeed(candidate)),[]);
let shuffled=0;
for(const lesson of extra){
 const qs=lesson.activities.filter(q=>q.type==='single_choice');
 const order=createOptionOrder(qs,()=>0);
 validateOptionOrder(qs,{version:'1.19.0',optionOrder:order});
 for(const item of qs){
  const src=item.options.map(o=>o.id);
  const shown=orderedOptions(item,{optionOrder:order});
  assert.equal(new Set(shown.map(o=>o.id)).size,src.length);
  assert.equal(shown.find(o=>o.id===item.answer.correct_option_id).text,
    item.options.find(o=>o.id===item.answer.correct_option_id).text);
  if(JSON.stringify(src)!==JSON.stringify(shown.map(o=>o.id)))shuffled++;
 }
}
assert(shuffled>0);
class Repo {
 p=[];a=new Map();
 async packages(){return structuredClone(this.p)}
 async addPackage(v){this.p.push(structuredClone(v))}
 async attempts(owner){return structuredClone(this.a.get(owner)??[])}
 async start(owner,record){const v=this.a.get(owner)??[];v.push(structuredClone(record));this.a.set(owner,v)}
 async saveDraft(owner,id,payload){const row=this.a.get(owner)?.find(x=>x.id===id);if(row?.status==='started')Object.assign(row,structuredClone(payload))}
 async finish(owner,record){return record}
 async approve(owner,record){return record}
 async readState(){return null}
 async readEvidence(){return []}
 async appendEvidence(){}
 async readAssessments(){return []}
 async legacyImported(){return true}
 async markLegacyImported(){}
 async appendSnapshot(){}
}
(async()=>{
 const r=new Repo(),svc=academicService(r,r,'v119-qa-owner');
 let preview=await svc.preview(original);
 assert.deepEqual(preview.errors,[]);
 await svc.importPackage(original,preview.token,true);
 const historical=await svc.start('REA-A1-01','v119-historical-attempt');
 assert.equal(historical.version,'1.18.1');
 const oldCopy=structuredClone(await r.attempts('v119-qa-owner'));
 preview=await svc.preview(candidate);
 assert.deepEqual(preview.errors,[]);
 assert.deepEqual(preview.counts,{add:12,update:0,skip:109,conflict:0});
 await svc.importPackage(candidate,preview.token,true);
 assert.equal((await svc.catalog()).version,'1.19.0');
 assert.deepEqual(await r.attempts('v119-qa-owner'),oldCopy);
 assert.equal((await svc.lesson('REA-A1-01','1.18.1')).lesson.id,'REA-A1-01');
 for(const id of newLessonIds)assert.equal((await svc.lesson(id)).lesson.id,id);

 // Browser-local integration with the real compact storage implementation.
 const {BrowserLocalAcademicRepository,BrowserLocalLearningRepository}=
   require('../'+out+'/infrastructure/storage/browser-local-repositories.js');
 const bytesCap=5*1024*1024;
 class QuotaStorage{
  map=new Map();
  getItem(k){return this.map.get(k)??null}
  setItem(k,v){const next=new Map(this.map);next.set(k,String(v));
   const bytes=[...next].reduce((n,[key,val])=>n+(key.length+val.length)*2,0);
   if(bytes>bytesCap){const error=Error('QuotaExceeded: browser 5MiB simulation');error.name='QuotaExceededError';throw error;}
   this.map=next;
  }
  removeItem(){throw Error('Deleting old curriculum/attempts is disallowed')}
 }
 const storage=new QuotaStorage();
 const ar=new BrowserLocalAcademicRepository(storage),lr=new BrowserLocalLearningRepository(storage);
 const browserSvc=academicService(ar,lr,'v119-browser-qa');
 let bp=await browserSvc.preview(original);
 assert.deepEqual(bp.errors,[]);
 await browserSvc.importPackage(original,bp.token,true);
 const prior=await browserSvc.start('REA-A1-01','v119-browser-previous');
 const attemptKey='g-learning:english:v1:owner:v119-browser-qa:academic-attempts';
 const oldBytes=storage.getItem(attemptKey);
 bp=await browserSvc.preview(candidate);
 assert.deepEqual(bp.errors,[]);
 assert.deepEqual(bp.counts,{add:12,update:0,skip:109,conflict:0});
 await browserSvc.importPackage(candidate,bp.token,true);
 assert.equal((await browserSvc.catalog()).version,'1.19.0');
 assert.equal(storage.getItem(attemptKey),oldBytes);
 const reopened=new BrowserLocalAcademicRepository(storage);
 assert.deepEqual((await reopened.packages()).map(p=>p.version),['1.18.1','1.19.0']);
 assert.equal((await reopened.attempts('v119-browser-qa')).find(x=>x.id===prior.id).version,'1.18.1');
 const storedBytes=[...storage.map].reduce((n,[key,val])=>n+(key.length+val.length)*2,0);
 console.log(JSON.stringify({
  result:'PASS',gate:'v1.19.0-cumulative-release-preflight',
  lessons:121,activities:1009,oldObjectsPreserved:109,
  preview:{add:12,update:0,skip:109,conflict:0},
  newObjectiveItems:obj.length,unassessedWriting:open.length,
  shuffledItems:shuffled,historyUnchanged:true,
  browserQuotaBytes:storedBytes,browserQuotaLimit:bytesCap,
  productionWrites:0,actualBrowserGUI:'NOT_TESTED'
 }));
})().catch(error=>{console.error(error);process.exitCode=1});
