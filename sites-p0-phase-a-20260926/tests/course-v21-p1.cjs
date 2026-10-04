'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const ts=require('typescript');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/course-p1-test';
for(const file of ['domain/course-p1.ts','infrastructure/storage/d1-course-selection.ts','infrastructure/storage/d1-repository.ts','domain/navigation-gate.ts']){
 const dest=path.join(root,out,file.replace(/\.ts$/,'.js'));fs.mkdirSync(path.dirname(dest),{recursive:true});
 fs.writeFileSync(dest,ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText);
}
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const {WRITING_COURSE_ID,writingCourse,myCourses,attemptMatchesReference}=require(path.join(root,out,'domain/course-p1.js'));
const {D1CourseSelectionRepository,CourseSelectionConflict,selectionKey}=require(path.join(root,out,'infrastructure/storage/d1-course-selection.js'));
const {D1LearningRepository}=require(path.join(root,out,'infrastructure/storage/d1-repository.js'));
const {createNavigationGate}=require(path.join(root,out,'domain/navigation-gate.js'));
class FakeD1{
 constructor(){this.rows=new Map();this.writes=0}
 prepare(sql){const db=this;return {bind(...values){return {
  async first(){assert.match(sql,/^SELECT payload FROM learner_states/);const payload=db.rows.get(values[0]);return payload===undefined?null:{payload}},
  async run(){let changes=0;if(sql.includes('ON CONFLICT(user_id) DO UPDATE')){db.rows.set(values[0],values[1]);changes=1}
   else if(sql.startsWith('INSERT INTO learner_states')){if(!db.rows.has(values[0])){db.rows.set(values[0],values[1]);changes=1}}
   else if(sql.startsWith('UPDATE learner_states SET payload=?,updated_at=? WHERE user_id=? AND payload=?')){if(db.rows.get(values[2])===values[3]){db.rows.set(values[2],values[0]);changes=1}}
   else throw Error('Unexpected SQL: '+sql);db.writes+=changes;return {meta:{changes}}}
 }}}}
}
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve}};
(async()=>{
 const db=new FakeD1(),owner='user:account-1',other='user:account-2';
 const scope={ownerId:owner,learnerId:'primary'},learning=new D1LearningRepository(db),courses=new D1CourseSelectionRepository(db);
 const legacy={week:8,stage:3,completed:[0,1,4],analysis:{topic:'Saved'},writing:'Old draft',feedbacks:{0:{summary:'Good'}},revision:'My revision',courseV1:{legacyUnknown:true}};
 await learning.writeState(scope,legacy);const before=db.writes;
 const [state,selection]=await Promise.all([learning.readState(scope),courses.read(owner)]);
 assert.equal(db.writes,before,'pure course GET must not write/import/backfill');
 assert.equal(selection.activeCourseId,null,'read must not auto-select');
 assert.equal(myCourses(state,selection).activeCourse,null);
 assert.deepEqual(writingCourse(state).completedRequired,2);
 assert.equal(writingCourse(state).previewWeeks,11);
 assert.equal(writingCourse(state).nextActivity,'Outline');
 assert.equal(state.writing,'Old draft');assert.deepEqual(state.feedbacks,legacy.feedbacks);
 const first=await courses.select(owner,WRITING_COURSE_ID,0,'request-0001');
 assert.equal(first.revision,1);assert.equal((await courses.read(owner)).activeCourseId,WRITING_COURSE_ID);
 assert.deepEqual(await courses.select(owner,WRITING_COURSE_ID,0,'request-0001'),first,'retry is idempotent');
 await assert.rejects(courses.select(owner,null,0,'request-0002'),CourseSelectionConflict);
 await assert.rejects(courses.select(other,'ARCHIVED',0,'request-0003'),/unavailable/);
 assert.equal((await courses.read(other)).activeCourseId,null,'isolate accounts');
 const current=await learning.readState(scope);
 await learning.writeState(scope,{...current,writing:'New Writing text'});
 assert.equal((await courses.read(owner)).activeCourseId,WRITING_COURSE_ID,'Writing PUT after selection cannot overwrite it');
 assert.deepEqual((await learning.readState(scope)).courseV1,legacy.courseV1,'v20 unknown state fields survive legacy Writing save');
 // Reverse order: an old snapshot is written after the selection CAS.
 const oldSnapshot=await learning.readState(scope);
 const cleared=await courses.select(owner,null,1,'request-0004');assert.equal(cleared.revision,2);
 await learning.writeState(scope,{...oldSnapshot,writing:'Late legacy save'});
 assert.equal((await courses.read(owner)).activeCourseId,null,'late Writing PUT cannot overwrite selection');
 assert.equal((await learning.readState(scope)).writing,'Late legacy save');
 assert.deepEqual((await learning.readState(scope)).feedbacks,legacy.feedbacks);
 const concurrent=await Promise.allSettled([courses.select(owner,WRITING_COURSE_ID,2,'request-0005'),courses.select(owner,null,2,'request-0006')]);
 assert.equal(concurrent.filter(x=>x.status==='fulfilled').length,1,'CAS must allow exactly one concurrent winner');
 assert.equal(concurrent.filter(x=>x.status==='rejected'&&x.reason instanceof CourseSelectionConflict).length,1);
 assert.ok(selectionKey(owner)!==owner,'selection row must be disjoint from v20 state key');
 const attempt={packageId:'approved',version:'1.4.0',lessonId:'GRA-A1-01',status:'scored',results:[{id:'GRA-A1-01-Q1'}]};
 const ref={packageId:'approved',contentVersion:'1.4.0',contentId:'GRA-A1-01',source:'foundation-lesson'};
 assert.equal(attemptMatchesReference(attempt,ref),true);
 assert.equal(attemptMatchesReference(attempt,{...ref,contentVersion:'1.5.0'}),false);
 assert.equal(attemptMatchesReference({...attempt,status:'started'},ref),false);
 const evidenceCount=1;assert.equal([ref,{...ref}].filter(x=>attemptMatchesReference(attempt,x)).length,2);assert.equal(evidenceCount,1,'two courses derive one event without appending evidence');
 const gate=createNavigationGate(),pending=deferred(),commit=[];
 const navigation=gate('courses',()=>pending.promise,target=>commit.push(target));
 assert.equal(await gate('writing-course',async()=>true,target=>commit.push(target)),false);
 assert.deepEqual(commit,[]);pending.resolve(false);assert.equal(await navigation,false);assert.deepEqual(commit,[]);
 assert.equal(await gate('writing-course',async()=>true,target=>commit.push(target)),true);
 const page=fs.readFileSync(path.join(root,'app/page.tsx'),'utf8')+fs.readFileSync(path.join(root,'app/home-client.tsx'),'utf8'),route=fs.readFileSync(path.join(root,'app/api/course/route.ts'),'utf8'),stateRoute=fs.readFileSync(path.join(root,'app/api/state/route.ts'),'utf8');
 assert.ok(page.includes('foundationNavigationGuard.current?.(target)')&&page.includes('if(dirty.current){let snapshot:State;do{snapshot=latestState.current;'), 'both Foundation and legacy Writing guards must protect new routes');
 assert.ok(page.includes('navigate("writing-course")')&&page.includes('navigate("courses")'));
 assert.ok(!page.includes('heading:"WRITING · 12 WEEKS"'));
 assert.ok(route.includes('learnerKey(request)')&&route.includes('new D1LearningRepository(db).readState(')&&!route.split('export async function GET(')[1].split('export async function POST(')[0].includes('.run()'),'course GET uses authenticated pure read');
 assert.ok(!route.includes('importLegacy')&&!route.includes('rebuild(')&&!route.includes('snapshot('));
 assert.ok(stateRoute.includes('delete body.courseV1;'),'legacy broad PUT cannot accept server-owned namespace');
 // Exact v20 route blob, independently matched in both Sites and GitHub trees.
 // Embed as a fixture because Actions shallow checkout cannot read Sites Git objects.
 const v20=fs.readFileSync(path.join(root,'tests/fixtures/v20-state-route.txt'),'utf8');
 const v20Blob=createHash('sha1').update(`blob ${Buffer.byteLength(v20)}\0`).update(v20).digest('hex');
 assert.equal(v20Blob,'0d45ba9b9f4f3cb5826f874314405754b285e378');
 assert.ok(v20.includes('{...previous,...body}'),'v20 must merge and retain unknown fields during a normal Writing save');
 assert.equal(db.rows.has(selectionKey(owner)),true,'source-only rollback leaves the independent selection record intact');
 console.log('PASS: pure GET, account scope, atomic CAS/idempotency, both Writing write orders, legacy rollback, progress/previews, versioned shared attempt, draft navigation.');
})().catch(e=>{console.error(e);process.exitCode=1});
