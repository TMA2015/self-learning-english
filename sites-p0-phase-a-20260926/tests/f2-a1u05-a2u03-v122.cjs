'use strict';
/**
 * F2 v1.22.0 academic-to-schema gate. Exercises candidate ONLY;
 * no production learner browser or Firebase network access.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const base=require('../content/curriculum-1.21.0-candidate.json');
const authored=require('../content/batches/f2-a1u05-a2u03-4-lessons-v122-draft.json');
const materialized=require('../content/curriculum-1.22.0-candidate.json');
const {composeF2,unitMap}=require('../scripts/compose-f2-a1u05-a2u03-v122-candidate.cjs');
const next=composeF2();
const count=x=>x.lessons.flatMap(l=>l.activities).length;
assert.deepEqual(next,materialized,'Committed candidate must match independent source-only composer');
assert.deepEqual([next.schema_version,next.lessons.length,count(next)],['1.22.0',136,1066]);
assert.deepEqual(next.lessons.slice(0,132),base.lessons);
assert.deepEqual(next.course.sequence.slice(0,132),base.course.sequence);
assert.deepEqual(next.rubrics,base.rubrics);
const newLessons=next.lessons.slice(132),newItems=newLessons.flatMap(l=>l.activities);
assert.deepEqual(newLessons.map(l=>l.id),['REA-A1-06','WRI-A1-06','REA-A2-09','WRI-A2-08']);
assert.equal(new Set(next.lessons.map(l=>l.id)).size,136,'Duplicate Lesson ID');
assert.equal(new Set(next.lessons.flatMap(l=>l.activities.map(q=>q.id))).size,1066,'Duplicate activity ID');
assert.equal(newItems.filter(q=>q.type==='single_choice').length,9);
assert.equal(newItems.filter(q=>q.type==='extended_response').length,2);
assert.equal(newLessons.filter(l=>l.module==='listening').length,0);
assert(newLessons.every(l=>l.audio_asset===undefined),'No unreviewed new Listening audio');
assert.equal(authored.review_scope,'AUTHORED_CONTENT_ITEM_LEVEL');
assert.deepEqual(authored.reconciled_corrections,['COR-01','COR-02','COR-03','COR-04']);
assert.deepEqual(authored.units,unitMap);
for(const l of newLessons){
 assert(l.objectives.length>=2&&l.explanation.en.length>=200&&l.examples.length>=2,
   l.id+': missing EDU-02 instructional structure');
 for(const q of l.activities){
  assert(q.id.startsWith(l.id+'-'));
  if(q.type==='single_choice'){
   assert.equal(q.options.length,4);
   assert.equal(new Set(q.options.map(o=>o.id)).size,4);
   assert(q.options.some(o=>o.id===q.answer.correct_option_id));
   assert.equal(q.evidence_weight,1);
   assert(q.feedback.explanation_en.includes('Next step:'),'Actionable feedback required');
   assert(q.skill_tags.every(t=>t.startsWith('reading.')));
   assert(!/correct answer is [A-D]|option [A-D] is correct/i.test(q.feedback.explanation_en));
  }else{
   assert.equal(q.type,'extended_response');
   assert.equal(q.answer,null);
   assert.equal(q.evidence_weight,0);
   assert.equal(q.review_mode,'assisted_ai_or_human');
   assert.equal(q.rubric_id,'RUBRIC-WRITING-'+l.cefr_target);
   assert.equal(q.word_range_guidance.not_a_quality_score,true);
  }
 }
 if(l.module==='reading')assert(l.reading_asset?.display_to_learner===true);
}
assert.equal(newLessons[0].activities[2].answer.correct_option_id,'A');
assert(newLessons[0].activities[2].feedback.explanation_en.includes('$2 + $3 = $5'));
assert(newLessons[2].reading_asset.body.includes('TOTAL PAID: $16'));
assert(newLessons[2].reading_asset.body.includes('I ordered two packs of paper cups'));
assert(newLessons[2].activities[2].answer.correct_option_id==='B');
assert(newLessons[2].activities[2].feedback.explanation_en.includes('$14'));
const compiled='.sites-runtime/f2-v122-schema';
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
assert.deepEqual(validateSeed(next),[],'v1.22.0 seed schema validation');
assert.deepEqual(validateContent(mapSeed(next)),[],'v1.22.0 domain validation');
let shuffleCases=0;
for(const l of newLessons){
 const order=createOptionOrder(l.activities,()=>0);
 validateOptionOrder(l.activities,{version:next.schema_version,optionOrder:order});
 for(const q of l.activities.filter(q=>q.type==='single_choice')){
  const displayed=orderedOptions(q,{optionOrder:order});
  assert.equal(displayed.length,4);
  assert.equal(displayed.find(o=>o.id===q.answer.correct_option_id).text,
   q.options.find(o=>o.id===q.answer.correct_option_id).text);
  if(JSON.stringify(displayed.map(o=>o.id))!==JSON.stringify(q.options.map(o=>o.id)))shuffleCases++;
 }
}
assert(shuffleCases>0,'Shuffled keys must survive option order');
const displayedLessons=next.lessons.map(l=>({
 id:l.id,title:l.title,module:l.module,cefr:l.cefr_target,minutes:l.estimated_minutes
}));
const units=unitGuideForCatalog(displayedLessons,next.course.sequence);
assert.equal(units.units.length,60);
assert.equal(units.mappedLessonCount,134);
assert.deepEqual(units.unmappedLessons.map(x=>x.id).sort(),['REA-C1-01','VOC-C2-01']);
assert.equal(units.units.find(u=>u.id==='A1-U05').lessonCount,4);
assert.equal(units.units.find(u=>u.id==='A2-U03').lessonCount,5);
for(const [unit,ids] of Object.entries(unitMap))for(const id of ids)
 assert.equal(primaryUnitForLessonId(id),unit,'Missing Unit index for '+id);
console.log(JSON.stringify({
 result:'PASS',gate:'F2-A1U05-A2U03-V122-SCHEMA',
 academicR2:'PASS',correctedR1:4,immutableBaseLessons:132,
 newLessons:4,newReadingMCQ:9,newUnscoredWriting:2,
 lessons:136,activities:1066,uniqueIds:true,
 contentValidation:true,shuffleCases,unitMapping:'134/136',
 newListeningAudio:0,realSafari:'NOT_TESTED',browserQuota:'NOT_TESTED',
 learnerDataWrites:0,productionImport:'NO',deploy:'NO'
}));
