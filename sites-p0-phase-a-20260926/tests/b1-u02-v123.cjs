'use strict';
/** B1-U02 v1.23 candidate-only schema and instruction/evidence safety regression. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const base=require('../content/curriculum-1.22.0-candidate.json');
const authored=require('../content/batches/b1-u02-claim-evidence-2-lessons-v123-draft.json');
const committed=require('../content/curriculum-1.23.0-candidate.json');
const {composeB1U02,unitMap}=require('../scripts/compose-b1-u02-v123-candidate.cjs');
const next=composeB1U02();
assert.deepEqual(next,committed,'Materialized v1.23 must exactly match source composer');
const activityIds=x=>x.lessons.flatMap(l=>l.activities.map(q=>q.id));
assert.deepEqual([next.schema_version,next.lessons.length,activityIds(next).length],['1.23.0',138,1072]);
assert.deepEqual(next.lessons.slice(0,136),base.lessons);
assert.deepEqual(next.course.sequence.slice(0,136),base.course.sequence);
assert.deepEqual(next.rubrics,base.rubrics);
assert.equal(new Set(next.lessons.map(l=>l.id)).size,138,'Lesson IDs must be unique');
assert.equal(new Set(activityIds(next)).size,1072,'Activity IDs must be unique');
assert.equal(authored.review_scope,'AUTHORED_CONTENT_ITEM_LEVEL');
assert.equal(authored.academic_disposition,'GO_FOR_MACHINE_SCHEMA_DRAFT');
assert.equal(authored.production,'NO_GO_PENDING_CANDIDATE_COMPOSITION_CI_AND_RELEASE');
assert.deepEqual(authored.unit_assignment,unitMap);
const latest=next.lessons.slice(-2),items=latest.flatMap(l=>l.activities);
assert.deepEqual(latest.map(l=>l.id),['REA-B1-08','WRI-B1-09']);
assert.deepEqual(items.map(q=>q.id),['REA-B1-08-Q1','REA-B1-08-Q2','REA-B1-08-Q3','REA-B1-08-Q4','REA-B1-08-Q5','WRI-B1-09-Q1']);
assert.deepEqual(items.slice(0,5).map(q=>q.answer.correct_option_id),['A','C','B','D','B']);
assert.equal(items.filter(q=>q.type==='single_choice').length,5);
assert.equal(items.filter(q=>q.type==='extended_response').length,1);
assert(latest.every(l=>l.audio_asset===undefined),'No unreviewed Listening audio');
assert(latest.every(l=>l.objectives.length>=2&&l.explanation.en.length>200&&l.examples.length>=2),
 'CORE-1..4 instructional guidance and independent worked models required');
const re=latest[0],wr=latest[1];
assert(re.reading_asset?.display_to_learner===true,'Two source texts must display in lesson');
assert(re.reading_asset.body.includes('SOURCE A')&&re.reading_asset.body.includes('SOURCE B'));
assert(re.reading_asset.body.includes('40 borrowed books were returned late'));
assert(re.reading_asset.body.includes('25 books were returned late'));
assert(re.reading_asset.body.includes('extended its opening hours'));
assert(re.reading_asset.body.includes('did not record which readers opened the emails'));
assert(re.examples.some(s=>s.includes('tennis club')),'Independent model missing');
for(const q of re.activities){
 assert.equal(q.type,'single_choice');
 assert.equal(q.options.length,4);
 assert.deepEqual(q.options.map(o=>o.id),['A','B','C','D']);
 assert(q.options.some(o=>o.id===q.answer.correct_option_id),'Exactly one option key must map');
 assert.equal(q.evidence_weight,1);
 assert(q.skill_tags.every(t=>t.startsWith('reading.')));
 assert(q.feedback.explanation_en.includes('Next step:'),'Feedback must teach a next step');
 assert(!/correct answer is [A-D]|option [A-D] is correct/i.test(q.feedback.explanation_en),
 'Post-feedback must not be letter-position-dependent');
}
const w=wr.activities[0];
assert.equal(w.type,'extended_response');
assert.equal(w.answer,null);
assert.equal(w.evidence_weight,0);
assert.equal(w.review_mode,'assisted_ai_or_human');
assert.equal(w.rubric_id,'RUBRIC-WRITING-B1');
assert.deepEqual(w.word_range_guidance,{min:120,max:160,not_a_quality_score:true});
assert.deepEqual(w.skill_tags,[
 'writing.task_understanding','writing.idea_development','writing.organization',
 'writing.cohesion','writing.vocabulary'
]);
assert(w.prompt.includes('September/October')&&w.prompt.includes('does not prove causation'));
assert(wr.examples.some(s=>s.includes('sports club')),'Independent Writing worked model');
const compiled='.sites-runtime/b1u02-v123-test';
fs.mkdirSync(path.join(root,'.sites-runtime'),{recursive:true});
execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc','domain/academic.ts','domain/content-model.ts',
 'domain/option-order.ts','domain/unit-guide-60.ts',
 '--outDir',compiled,'--rootDir','.','--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,compiled,'package.json'),'{"type":"commonjs"}\n');
const {validateSeed,mapSeed}=require(path.join(root,compiled,'domain/academic.js'));
const {validateContent}=require(path.join(root,compiled,'domain/content-model.js'));
const {createOptionOrder,validateOptionOrder,orderedOptions}=require(path.join(root,compiled,'domain/option-order.js'));
const {unitGuideForCatalog,primaryUnitForLessonId}=require(path.join(root,compiled,'domain/unit-guide-60.js'));
assert.deepEqual(validateSeed(next),[],'Candidate must pass real machine seed validator');
assert.deepEqual(validateContent(mapSeed(next)),[],'Candidate must pass domain content validator');
let shuffles=0;
for(const l of latest){
 const order=createOptionOrder(l.activities,()=>0);
 validateOptionOrder(l.activities,{version:next.schema_version,optionOrder:order});
 for(const q of l.activities.filter(x=>x.type==='single_choice')){
  const displayed=orderedOptions(q,{optionOrder:order});
  assert.equal(displayed.find(o=>o.id===q.answer.correct_option_id).text,
   q.options.find(o=>o.id===q.answer.correct_option_id).text);
  if(JSON.stringify(displayed.map(o=>o.id))!==JSON.stringify(q.options.map(o=>o.id)))shuffles++;
 }
}
assert.equal(shuffles,5,'All five MCQs must be safely order-independent');
const catalog=next.lessons.map(l=>({id:l.id,title:l.title,module:l.module,cefr:l.cefr_target,minutes:l.estimated_minutes}));
const units=unitGuideForCatalog(catalog,next.course.sequence);
assert.equal(units.units.length,60);
assert.equal(units.mappedLessonCount,136);
assert.deepEqual(units.unmappedLessons.map(x=>x.id).sort(),['REA-C1-01','VOC-C2-01']);
assert.equal(units.units.find(u=>u.id==='B1-U02').lessonCount,6);
for(const id of unitMap['B1-U02'])assert.equal(primaryUnitForLessonId(id),'B1-U02');
console.log(JSON.stringify({result:'PASS',gate:'B1-U02-V123-SCHEMA',
 notebookLmItemLevel:'PASS',correctKeys:['A','C','B','D','B'],
 immutableOldLessons:136,newLessons:2,readingMCQ:5,unscoredWriting:1,
 lessons:138,activities:1072,uniqueIds:true,machineValidation:true,
 shuffles,unitMapping:'136/138',audioAdded:0,
 liveImport:'NO',deploy:'NO',realSafari:'NOT_TESTED',learnerDataWrites:0}));
