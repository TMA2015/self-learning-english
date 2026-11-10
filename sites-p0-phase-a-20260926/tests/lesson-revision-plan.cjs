'use strict';
/**
 * R1: synthetic only. NO real learner data, migrations or production writes.
 * Run as part of qa:core / qa:full. Uses the installed TypeScript compiler.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const out='.sites-runtime/lesson-revision-plan';
const outDir=path.join(root,out);
fs.rmSync(outDir,{recursive:true,force:true});
execFileSync(process.execPath,[
 path.join(root,'node_modules/typescript/bin/tsc'),
 'domain/lesson-revision-plan.ts',
 '--outDir',out,
 '--rootDir','.',
 '--module','commonjs',
 '--target','es2022',
 '--skipLibCheck',
 '--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(outDir,'package.json'),'{"type":"commonjs"}');
const {planLessonRevisions,canonicalLessonJSON}=
 require(path.join(outDir,'domain/lesson-revision-plan.js'));

const lesson1={
 id:'WRI-A2-01',title:'An opinion paragraph',
 activities:[{id:'WRI-A2-01-Q1',type:'extended_response',
  prompt:'Write an opinion.',rubric_id:'RUBRIC-WRITING-A2'}]
};
const lesson2={
 id:'GRA-A2-01',title:'Present simple',
 activities:[{id:'GRA-A2-01-Q1',type:'single_choice',
  prompt:'Which one is correct?',answer:{correct_option_id:'a'},
  options:[{id:'a',text:'She plays.'},{id:'b',text:'She play.'}]}]
};
const lesson3={
 id:'REA-A2-01',title:'Reading for gist',
 activities:[{id:'REA-A2-01-Q1',type:'single_choice',
  prompt:'What is the main idea?',answer:{correct_option_id:'b'},
  options:[{id:'a',text:'A'},{id:'b',text:'B'}]}]
};
const make=(version,lessons,rubric)=>{
 const source={package_id:'foundation-v1',schema_version:version,
  course:{id:'english',sequence:lessons.map(l=>l.id)},
  integrated_journey:{id:'journey'},lessons,rubrics:{
   'RUBRIC-WRITING-A2':rubric,
  }};
 return {id:source.package_id,version,digest:'verified-source-'+version,
  source};
};
const v1=make('1.18.1',[structuredClone(lesson1),structuredClone(lesson2)],
 {criteria:['task'],guidance:'Old grading guidance'});
const v2=make('1.20.0',[structuredClone(lesson1),structuredClone(lesson2),
 structuredClone(lesson3)],
 {criteria:['task','organization'],guidance:'New grading guidance'});
const attempts=[
 {packageId:v1.id,version:v1.version,lessonId:lesson1.id},
 {packageId:v1.id,version:v1.version,lessonId:lesson2.id},
 {packageId:v2.id,version:v2.version,lessonId:lesson1.id},
 {packageId:v2.id,version:v2.version,lessonId:lesson1.id},
];
const before=JSON.stringify({v1,v2,attempts});
const findAlias=(plan,version,lessonId)=>plan.aliases.find(a=>
 a.version===version&&a.lessonId===lessonId);

(async()=>{
 const plan=await planLessonRevisions([v1,v2],attempts);
 assert.equal(plan.inputVersions,2);
 assert.equal(plan.active.version,'1.20.0');
 assert.equal(plan.active.lessons.length,3);
 assert.equal(plan.protectedAttemptCount,4);
 assert.equal(plan.uniqueProtectedSources,3);
 assert.equal(plan.aliases.length,3);
 // The unchanged grammar lesson is stored ONCE across both releases.
 const oldGrammar=findAlias(plan,'1.18.1','GRA-A2-01');
 const newGrammar=plan.active.lessons.find(x=>x.lessonId==='GRA-A2-01');
 assert.equal(oldGrammar.revision,newGrammar.revision);
 // The same Writing lesson ID has a different revision when its rubric changes.
 const oldWriting=findAlias(plan,'1.18.1','WRI-A2-01');
 const newWriting=plan.active.lessons.find(x=>x.lessonId==='WRI-A2-01');
 assert.notEqual(oldWriting.revision,newWriting.revision);
 assert.equal(plan.blobs.length,4);
 assert.equal(plan.blobs.find(x=>x.revision===oldWriting.revision)
   .rubrics['RUBRIC-WRITING-A2'].guidance,'Old grading guidance');
 assert.equal(plan.blobs.find(x=>x.revision===newWriting.revision)
   .rubrics['RUBRIC-WRITING-A2'].guidance,'New grading guidance');
 assert.equal(JSON.stringify({v1,v2,attempts}),before,
  'the conversion must not edit sources, scores or attempt references');
 const second=await planLessonRevisions([v1,v2],attempts);
 assert.deepEqual(second,plan,'hash and mapping must be deterministic');

 // No old attempts on the changed lesson means no old duplicate is retained.
 const lean=await planLessonRevisions([v1,v2],[attempts[1]]);
 assert.equal(lean.blobs.length,3);
 assert.equal(lean.aliases.length,1);
 // Updating a question/answer for an existing Lesson ID is NOT the same revision.
 const changed=structuredClone(v2);
 changed.source.lessons[1].activities[0].answer.correct_option_id='b';
 const changedPlan=await planLessonRevisions([v1,changed],[attempts[1]]);
 assert.notEqual(changedPlan.active.lessons.find(x=>x.lessonId==='GRA-A2-01').revision,
  changedPlan.aliases[0].revision);
 assert.equal(changedPlan.blobs.length,4);
 // Whitespace of object key order cannot create a phantom revision.
 assert.equal(canonicalLessonJSON({z:2,a:{x:1,b:4}}),
  canonicalLessonJSON({a:{b:4,x:1},z:2}));
 await assert.rejects(planLessonRevisions([v1,v2],
  [{version:'1.18.1',lessonId:'NOT_FOUND'}]),/Original versioned lesson missing/);
 await assert.rejects(planLessonRevisions([v1,v2],
  [{version:'1.18.1',lessonId:'WRI-A2-01',packageId:'wrong'}]),
  /package ID mismatch/);
 await assert.rejects(planLessonRevisions([v1,v1],[]),/Duplicate curriculum/);
 await assert.rejects(planLessonRevisions([v1,{...v2,archive:'referenced-lessons'}],[]),
  /Current curriculum is incomplete/);
 const malformed=structuredClone(v1);
 delete malformed.source.rubrics['RUBRIC-WRITING-A2'];
 await assert.rejects(planLessonRevisions([malformed,v2],[
  {version:'1.18.1',lessonId:'WRI-A2-01'}]),/referenced rubric is missing/);
 console.log(JSON.stringify({
  result:'PASS',gate:'lesson-revisions-R1-synthetic',
  historicAttemptReferences:4,historicAliases:3,
  sharedUnchangedLessonDedup:true,changedRubricRevisionPinned:true,
  changedQuestionRevisionPinned:true,orphanRevisionNotRetained:true,
  missingSourceFailsClosed:true,originalAttemptsUnchanged:true,
  browserMigration:'NOT_TESTED',Safari:'NOT_TESTED',
  realOwnerRecovery:'NOT_TESTED',productionWrites:0
 }));
})().catch(error=>{console.error(error);process.exitCode=1});
