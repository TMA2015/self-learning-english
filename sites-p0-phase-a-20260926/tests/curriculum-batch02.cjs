// Integration-like in-memory version/import regression for Curriculum Batch 02.
const assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','domain/academic.ts','application/academic-service.ts','--outDir','.sites-runtime/curriculum-batch02-tests','--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{stdio:'inherit'});
fs.writeFileSync('.sites-runtime/curriculum-batch02-tests/package.json','{"type":"commonjs"}');
const {academicService}=require('../.sites-runtime/curriculum-batch02-tests/application/academic-service.js');
const {validateSeed,mapSeed}=require('../.sites-runtime/curriculum-batch02-tests/domain/academic.js');
const {validateContent}=require('../.sites-runtime/curriculum-batch02-tests/domain/content-model.js');
const prior=require('../content/curriculum-1.1.0-candidate.json'),next=require('../content/curriculum-1.2.0-candidate.json');
class Store {
 p=[];a=new Map();e=new Map();states=new Map();
 async packages(){return structuredClone(this.p)}
 async addPackage(v){const old=this.p.find(x=>x.version===v.version);if(old){assert.equal(old.digest,v.digest);return}this.p.push(structuredClone(v))}
 async attempts(o){return structuredClone(this.a.get(o)??[])}
 async start(o,v){const a=this.a.get(o)??[];if(!a.some(x=>x.id===v.id))a.push(structuredClone(v));this.a.set(o,a)}
 async saveDraft(o,id,p){const a=this.a.get(o).find(x=>x.id===id);if(a.status==='started')Object.assign(a,structuredClone(p))}
 async finish(o,v){const a=this.a.get(o).find(x=>x.id===v.id);if(a.status==='started'){Object.assign(a,structuredClone(v));await this.appendEvidence({ownerId:o},v.evidence)}return structuredClone(a)}
 async approve(o,v){const a=this.a.get(o).find(x=>x.id===v.id);if(a.status==='pending_review'){Object.assign(a,structuredClone(v));await this.appendEvidence({ownerId:o},v.evidence)}return structuredClone(a)}
 async readState(s){return this.states.get(s.ownerId)??null}
 async readEvidence(s){return this.e.get(s.ownerId)??[]}
 async appendEvidence(s,v){const a=this.e.get(s.ownerId)??[];for(const e of v)if(!a.some(x=>x.id===e.id))a.push(e);this.e.set(s.ownerId,a)}
 async readAssessments(){return []}
 async legacyImported(){return true}
 async markLegacyImported(){}
 async appendSnapshot(){}
}
(async()=>{
 assert.deepEqual(validateSeed(prior),[],'Prior cumulative package is still valid');
 assert.deepEqual(validateSeed(next),[],'New package passes generalized importer');
 assert.deepEqual(validateContent(mapSeed(next)),[],'Portable content graph valid');
 const db=new Store(),svc=academicService(db,db,'owner'),stranger=academicService(db,db,'stranger');
 let p=await svc.preview(prior);assert.deepEqual(p.errors,[]);
 await svc.importPackage(prior,p.token,true);
 const historical=await svc.start('GRA-A1-01','historic-grammar-a1');
 assert.equal(historical.version,'1.1.0');
 p=await svc.preview(next);assert.deepEqual(p.errors,[]);
 assert.deepEqual(p.counts,{add:8,update:0,skip:21,conflict:0});
 await svc.importPackage(next,p.token,true);
 const cat=await svc.catalog();
 assert.equal(cat.version,'1.2.0');assert.equal(cat.lessons.length,29);
 assert.equal(cat.course.sequence.length,29);
 assert.equal(db.p.length,2);
 const old=(await svc.start('GRA-A1-01','historic-grammar-a1'));assert.equal(old.version,'1.1.0');
 const fresh=await svc.start('GRA-A1-04','new-articles-a1');
 assert.equal(fresh.version,'1.2.0');
 const grammar=next.lessons.find(l=>l.id===fresh.lessonId);
 await svc.draft(fresh.id,Object.fromEntries(grammar.activities.map(q=>[q.id,q.answer.correct_option_id??q.answer.accepted_answers[0]])));
 const submitted=await svc.submit(fresh.id);
 assert.equal(submitted.status,'scored');
 assert(submitted.results.every(x=>x.correct),'New A1 objective answer keys work');
 const writing=await svc.start('WRI-A2-02','new-email-a2');
 const lesson=next.lessons.find(l=>l.id===writing.lessonId);
 const responses=Object.fromEntries(lesson.activities.map(q=>[q.id,q.answer?.correct_option_id??'Hi Sam, Our school held a science fair last Friday in the main hall. My group tested a robot. I enjoyed solving a problem with my friends because we learnt how to work together. The show was interesting. Have you visited a science fair? Write soon, Linh.']));
 await svc.draft(writing.id,responses);
 const submittedWriting=await svc.submit(writing.id);
 assert.equal(submittedWriting.status,'pending_review');
 assert(!(db.e.get('owner')??[]).some(e=>e.skill==='Writing'));
 assert.equal((await stranger.catalog()).attempts.length,0);
 // Do not overwrite an immutable version with conflicting content.
 const conflicting=structuredClone(next);conflicting.lessons.find(l=>l.id==='GRA-A1-04').title+=' different';
 assert.equal((await svc.preview(conflicting)).counts.conflict,29);
 console.log(JSON.stringify({result:'PASS',version:'1.2.0',lessons:29,preview:{add:8,update:0,skip:21,conflict:0},historicalVersionRetained:true,objectiveScoring:true,writingPending:true,accountIsolation:true,versionCollisionRejected:true}));
})().catch(e=>{console.error(e);process.exitCode=1});
