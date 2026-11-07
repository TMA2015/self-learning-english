'use strict';
/** Pure synthetic Recovery V3a gate; no Safari, real learner files or browser writes. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/lesson-revision-recovery-v3';
const dest=path.join(root,out);
fs.rmSync(dest,{recursive:true,force:true});
cp.execFileSync(process.execPath,[
 path.join(root,'node_modules/typescript/bin/tsc'),
 'domain/lesson-revision-plan.ts','domain/lesson-revision-recovery-v3.ts',
 '--outDir',out,'--rootDir','.','--module','commonjs',
 '--target','es2022','--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(dest,'package.json'),'{"type":"commonjs"}');
const {planLessonRevisions}=require(path.join(dest,'domain/lesson-revision-plan.js'));
const {createRevisionRecoveryV3,verifyRevisionRecoveryV3,verifiedRecoveryToPlan}=
 require(path.join(dest,'domain/lesson-revision-recovery-v3.js'));
const writing={id:'WRI-A2-01',title:'Write a paragraph',
 activities:[{id:'WRI-A2-01-Q1',type:'extended_response',prompt:'Explain your choice.',
  rubric_id:'RUBRIC-WRITING-A2'}]};
const grammar={id:'GRA-A2-01',title:'Use the correct tense',
 activities:[{id:'GRA-A2-01-Q1',type:'single_choice',prompt:'Choose the answer.',
  options:[{id:'a',text:'a'},{id:'b',text:'b'}],answer:{correct_option_id:'a'}}]};
const reading={id:'REA-A2-01',title:'Find the gist',
 activities:[{id:'REA-A2-01-Q1',type:'single_choice',prompt:'Choose the main idea.',
  options:[{id:'a',text:'a'},{id:'b',text:'b'}],answer:{correct_option_id:'b'}}]};
const rest=Array.from({length:247},(_,i)=>({
 id:'GRA-B2-'+String(i+4).padStart(4,'0'),title:'Synthetic item '+i,
 activities:[{id:'GRA-B2-'+i+'-Q1',type:'single_choice',prompt:'Select a choice.',
 options:[{id:'a',text:'a'},{id:'b',text:'b'}],answer:{correct_option_id:'a'}}]
}));
const pkg=(version,lessons,rubric)=>({
 id:'foundation-v1',version,digest:'upstream-digest-'+version,source:{
  package_id:'foundation-v1',schema_version:version,
  course:{id:'foundation',sequence:lessons.map(x=>x.id)},
  lessons,rubrics:{'RUBRIC-WRITING-A2':{criteria:['task'],guidance:rubric}}
 }
});
const old=pkg('1.18.1',[writing,grammar],'Original rubric'),
 current=pkg('1.20.0',[writing,grammar,reading],'Revised rubric'),
 future=pkg('1.21.0',[writing,grammar,reading,...rest],'Revised rubric');
const attempt=(i,owner='family')=>{
 const source=i<27?old:i<52?current:future;
 const lessonId=i%3===0?'WRI-A2-01':i%3===1?'GRA-A2-01':
  source===old?'GRA-A2-01':'REA-A2-01';
 return {id:owner+'-attempt-'+i,packageId:source.id,
  version:source.version,lessonId,rootId:owner+'-attempt-'+i,
  status:i<52?'scored':'started',
  answers:{[lessonId+'-Q1']:i%3===0?'my original paragraph':'a'},
  ...(i<52?{submittedAt:1730000000000+i,results:[
   {id:lessonId+'-Q1',correct:true,explanation:'Original feedback'}
  ]}:{optionOrder:{activityOrder:[lessonId+'-Q1']}}),
  createdAt:1730000000000+i,evidence:i<52?[{
   id:'evidence-'+i,score:1,max:1,raw:{contentVersion:source.version}
  }]:[]
 };
};
const saved=Array.from({length:73},(_,i)=>attempt(i));
const secondary=Array.from({length:2},(_,i)=>attempt(i,'second'));
const entries=[
 {key:'g-learning:english:v1:owner:local-family:academic-attempts',
  value:JSON.stringify(saved)},
 {key:'g-learning:english:v1:owner:second-family:academic-attempts',
  value:JSON.stringify(secondary)},
 {key:'g-learning:english:v1:owner:local-family:learner:primary:state',
  value:JSON.stringify({writingDraft:'unmodified text',pastScores:[1,2,3]})},
 {key:'g-learning:english:v1:owner:local-family:learner:primary:evidence',
  value:JSON.stringify([{tag:'grammar',score:1}])},
];
const originalEntries=JSON.stringify(entries);
(async()=>{
 const refs=[...saved,...secondary].map(a=>({
  version:a.version,lessonId:a.lessonId,packageId:a.packageId
 }));
 const plan=await planLessonRevisions([old,current,future],refs);
 const originalPlan=JSON.stringify(plan);
 const snapshot={active:plan.active,aliases:plan.aliases,blobs:plan.blobs};
 const exported=await createRevisionRecoveryV3(
  snapshot,entries,'2026-11-07T02:00:00.000Z');
 const verified=await verifyRevisionRecoveryV3(exported.text);
 assert.equal(verified.attempts,75);
 assert.equal(verified.file.sha256,exported.sha256);
 assert.equal(verified.file.active.lessons.length,250);
 assert.equal(verified.file.entries.length,4);
 assert.deepEqual(verified.file.entries.slice().sort((a,b)=>a.key.localeCompare(b.key)),
  verified.file.entries);
 assert.equal(verified.uniqueRevisions,plan.blobs.length);
 assert.equal(verified.sourceAliases,plan.aliases.length);
 for(const entry of entries)assert.equal(
  verified.file.entries.find(x=>x.key===entry.key).value,entry.value,
  'Original grades, Writing drafts, evidence and answer history must be byte-identical');
 const ready=verifiedRecoveryToPlan(verified.file);
 assert.deepEqual(ready.blobs,snapshot.blobs.slice().sort((a,b)=>a.revision.localeCompare(b.revision)),
  'All required referenced revisions must be portable');
 assert.equal(JSON.stringify(plan),originalPlan,'Export must not modify source-plan data');
 assert.equal(JSON.stringify(entries),originalEntries,'Export must not alter learner bytes');
 const onceMore=await createRevisionRecoveryV3(snapshot,entries,'2026-11-07T02:00:00.000Z');
 assert.equal(onceMore.sha256,exported.sha256,'Identical inputs must yield identical SHA');
 // Corrupting even one answer may not pass the outer SHA.
 const tampered=JSON.parse(exported.text);
 const first=JSON.parse(tampered.entries.find(x=>x.key.endsWith('local-family:academic-attempts')).value);
 first[0].answers[Object.keys(first[0].answers)[0]]='WRONG REVISION';
 tampered.entries.find(x=>x.key.endsWith('local-family:academic-attempts')).value=JSON.stringify(first);
 await assert.rejects(verifyRevisionRecoveryV3(JSON.stringify(tampered)),/Checksum mismatch/);
 // Export may not omit a source alias for a completed or in-progress attempt.
 const missing=structuredClone(snapshot);
 missing.aliases=missing.aliases.filter(x=>
  !(x.version==='1.18.1'&&x.lessonId==='WRI-A2-01'));
 await assert.rejects(createRevisionRecoveryV3(missing,entries,'2026-11-07T02:00:00Z'),
  /source alias is missing/);
 const brokenBlob=structuredClone(snapshot);
 brokenBlob.blobs.find(x=>x.lesson.id==='WRI-A2-01').lesson.title='Unauthorised edit';
 await assert.rejects(createRevisionRecoveryV3(brokenBlob,entries,'2026-11-07T02:00:00Z'),
  /Source revision hash mismatch/);
 const forbidden=[...entries,{key:'g-learning:english:v1:academic:packages',value:'[]'}];
 await assert.rejects(createRevisionRecoveryV3(snapshot,forbidden,'2026-11-07T02:00:00Z'),
  /Unexpected or duplicate learner storage key/);
 const duplicate=[...entries,{...entries[0]}];
 await assert.rejects(createRevisionRecoveryV3(snapshot,duplicate,'2026-11-07T02:00:00Z'),
  /Unexpected or duplicate learner storage key/);
 const noHistory=await createRevisionRecoveryV3(snapshot,entries.filter(
  e=>!e.key.endsWith(':academic-attempts')),'2026-11-07T02:00:00.000Z');
 const checkedNoHistory=await verifyRevisionRecoveryV3(noHistory.text);
 assert.equal(checkedNoHistory.attempts,0);
 assert.equal(checkedNoHistory.file.aliases.length,0);
 assert.equal(checkedNoHistory.uniqueRevisions,250,
  'No historical attempts -> old rubric revision not needed in portable archive');
 console.log(JSON.stringify({result:'PASS',gate:'lesson-revision-recovery-v3a',
  syntheticLearnerAttempts:75,primaryLearnerAttempts:73,
  scored:52,drafts:21,otherOwnerAttempts:2,
  currentSyntheticLessons:250,oldRubricPinned:true,
  uniqueRevisions:verified.uniqueRevisions,
  sourceAliases:verified.sourceAliases,originalLearnerValuesUnmodified:true,
  checksumTamperingBlocked:true,missingOriginalSourceBlocked:true,
  orphanOldSourceExcluded:true,
  actualBrowserExport:'NOT_TESTED',emptyProfileRestore:'NOT_IMPLEMENTED',
  Safari:'NOT_TESTED',productionWrites:0}));
})().catch(e=>{console.error(e);process.exitCode=1});
