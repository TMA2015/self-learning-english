// First real-curriculum acceptance checks. Run independently from application and academic regression suites.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','domain/content-model.ts','domain/academic.ts','application/academic-service.ts','--outDir','.sites-runtime/curriculum-tests','--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{stdio:'inherit'});
fs.mkdirSync('.sites-runtime/curriculum-tests',{recursive:true});
fs.writeFileSync('.sites-runtime/curriculum-tests/package.json','{"type":"commonjs"}');
const {academicService}=require('../.sites-runtime/curriculum-tests/application/academic-service.js');
const {validateSeed,mapSeed}=require('../.sites-runtime/curriculum-tests/domain/academic.js');
const {validateContent}=require('../.sites-runtime/curriculum-tests/domain/content-model.js');
const seed=require('../content/academic-seed-v1.json');
const pack=require('../content/curriculum-1.1.0-candidate.json');
const oldIds=new Set(seed.lessons.map(l=>l.id));
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
 assert.deepEqual(validateSeed(seed),[]);
 assert.deepEqual(validateSeed(pack),[]);
 const ids=pack.lessons.map(l=>l.id),questions=pack.lessons.flatMap(l=>l.activities);
 assert.equal(pack.schema_version,'1.1.0');
 assert.equal(ids.length,21);assert.equal(new Set(ids).size,21);
 assert.equal(questions.length,126);assert.equal(new Set(questions.map(q=>q.id)).size,126);
 assert.equal(pack.lessons.filter(l=>!oldIds.has(l.id)).length,8);
 assert(pack.lessons.filter(l=>!oldIds.has(l.id)).some(l=>l.module==='writing'));
 assert(pack.lessons.filter(l=>!oldIds.has(l.id)).some(l=>l.module==='reading'));
 assert.equal(pack.course.sequence.length,ids.length);assert.deepEqual(new Set(pack.course.sequence),new Set(ids));assert.equal(pack.course.sequence[0],'GRA-A1-01');
 assert.deepEqual(validateContent(mapSeed(pack)),[]);
 assert(mapSeed(pack).courses[0].cefrTargets.includes('A1'));
 for(const l of pack.lessons){
  assert(l.activities.length>0&&l.activities.length<=24,l.id);
  for(const q of l.activities){
   assert(q.skill_tags.length,q.id);
   assert(q.feedback.explanation_en||q.feedback.pending_message,q.id);
   if(q.type==='single_choice')assert(q.options.some(o=>o.id===q.answer.correct_option_id),q.id);
   if(q.type==='short_answer')assert(q.answer.accepted_answers.every(a=>a.trim().length>0),q.id);
   if(q.type==='extended_response')assert(q.answer===null&&q.evidence_weight===0&&pack.rubrics[q.rubric_id],q.id);
  }
 }
 // A duplicate ID, unknown skill and a removed seed lesson must all fail safely.
 const duplicate=structuredClone(pack);duplicate.lessons[1].id=duplicate.lessons[0].id;assert(validateSeed(duplicate).length);
 const badTag=structuredClone(pack);badTag.lessons[0].activities[0].skill_tags=['grammar.invented'];assert(validateSeed(badTag).length);
 const omitted=structuredClone(pack);omitted.lessons=omitted.lessons.filter(l=>l.id!=='GRA-A2-01');omitted.course.sequence=omitted.lessons.map(l=>l.id);assert(validateSeed(omitted).length);
 const db=new Store(),s=academicService(db,db,'test_owner'),other=academicService(db,db,'other_owner');
 let preview=await s.preview(seed);await s.importPackage(seed,preview.token,true);
 const historical=await s.start('GRA-A2-01','historical-grammar-01');
 assert.equal(historical.version,'1.0.0');
 preview=await s.preview(pack);
 assert.deepEqual(preview.errors,[]);
 assert.deepEqual(preview.counts,{add:8,update:2,skip:11,conflict:0});
 await s.importPackage(pack,preview.token,true);
 assert.equal((await s.catalog()).lessons.length,21);
 const newAttempt=await s.start('GRA-A1-01','new-grammar-a1-01');
 assert.equal(newAttempt.version,'1.1.0');
 const g=pack.lessons.find(l=>l.id==='GRA-A1-01');
 const answers=Object.fromEntries(g.activities.map(q=>[q.id,q.answer.correct_option_id??q.answer.accepted_answers[0]]));
 await s.draft(newAttempt.id,answers);
 const result=await s.submit(newAttempt.id);
 assert.equal(result.status,'scored');assert(result.results.every(r=>r.correct));
 assert.equal((await s.start('GRA-A2-01','retake-grammar-v11')).version,'1.1.0');
 assert.equal((await s.start('GRA-A2-01','historical-grammar-01')).version,'1.0.0');
 assert.equal((await other.catalog()).attempts.length,0);
 const writing=await s.start('WRI-A1-01','new-writing-a1-01');
 const w=pack.lessons.find(l=>l.id==='WRI-A1-01');
 await s.draft(writing.id,Object.fromEntries(w.activities.map(q=>[q.id,q.answer?.correct_option_id??'Hi! My name is Linh. I am in class six. I enjoy reading stories and drawing animals. My favourite subject is science because I enjoy experiments. What is your favourite subject? I hope we can become friends.'])));
 const submitted=await s.submit(writing.id);assert.equal(submitted.status,'pending_review');
 assert(!(db.e.get('test_owner')??[]).some(e=>e.skill==='Writing'));
 console.log(JSON.stringify({result:'PASS',lessons:21,addedLessons:8,activities:126,preview:preview.counts,versionedHistoricalAttempt:true,objectiveScoring:true,writingPending:true,accountIsolation:true,schemas:true}));
})().catch(e=>{console.error(e);process.exitCode=1});
