'use strict';
/** NotebookLM R1 item PASS -> v1.24 independent schema/Unit/evidence gate. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const old=require('../content/curriculum-1.23.0-candidate.json');
const authored=require('../content/batches/f2-a1u08-a2u07-four-lessons-v124-draft.json');
const committed=require('../content/curriculum-1.24.0-candidate.json');
const {composeF2V124,unitMap}=require('../scripts/compose-f2-a1u08-a2u07-v124-candidate.cjs');
const next=composeF2V124(),allIds=p=>p.lessons.flatMap(l=>l.activities.map(q=>q.id));
assert.deepEqual(committed,next,'Committed content must match source-only composer');
assert.deepEqual([next.schema_version,next.lessons.length,allIds(next).length],['1.24.0',142,1085]);
assert.deepEqual(next.lessons.slice(0,138),old.lessons);
assert.deepEqual(next.course.sequence.slice(0,138),old.course.sequence);
assert.deepEqual(next.rubrics,old.rubrics);
assert.equal(new Set(next.lessons.map(l=>l.id)).size,142,'Lesson ID collisions');
assert.equal(new Set(allIds(next)).size,1085,'Activity ID collisions');
assert.equal(authored.review_scope,'AUTHORED_CONTENT_ITEM_LEVEL');
assert.equal(authored.academic_disposition,'GO_FOR_MACHINE_SCHEMA_DRAFT');
assert.equal(authored.production,'NO_GO_PENDING_TECHNICAL_CI_AND_OWNER_RELEASE');
assert.deepEqual(authored.unit_assignments,unitMap);
const newer=next.lessons.slice(138),questions=newer.flatMap(l=>l.activities);
assert.deepEqual(newer.map(l=>l.id),['REA-A1-07','WRI-A1-07','REA-A2-10','WRI-A2-09']);
assert.deepEqual(newer.map(l=>l.activities.length),[5,1,6,1]);
assert.deepEqual(questions.filter(q=>q.type==='single_choice').map(q=>q.answer.correct_option_id),['A','B','C','D','B','C','A','D','B','A','C']);
assert.equal(questions.filter(q=>q.type==='extended_response').length,2);
assert.equal(newer.filter(l=>l.module==='listening').length,0);
assert(newer.every(l=>!l.audio_asset),'No new Listening/audio sources in this wave');
for(const l of newer){
 assert(l.objectives.length>=2&&l.explanation.en.length>250&&l.examples.length>=2,l.id+': CORE 1-4 absent');
 assert(!l.explanation.en.includes('**Answer key:**'),'Pre-submit answer key leakage in explanation');
 assert(!l.examples.join(' ').includes('**Answer key:**'),'Pre-submit key leakage in worked model');
 for(const q of l.activities){
  assert(q.id.startsWith(l.id+'-'),'Canonical ID format');
  if(q.type==='single_choice'){
   assert.equal(q.options.length,4);
   assert.deepEqual(q.options.map(o=>o.id),['A','B','C','D']);
   assert(q.options.some(o=>o.id===q.answer.correct_option_id),'Missing matching correct choice');
   assert.equal(q.evidence_weight,1);
   assert(q.skill_tags.every(t=>t.startsWith('reading.')));
   assert(q.feedback.explanation_en.includes('Next step:'),'Actionable feedback missing');
   assert(!/correct answer is [A-D]|option [A-D] is correct/i.test(q.feedback.explanation_en));
  }else{
   assert.equal(q.type,'extended_response');
   assert.equal(q.answer,null);
   assert.equal(q.evidence_weight,0);
   assert.equal(q.review_mode,'assisted_ai_or_human');
   assert.equal(q.rubric_id,'RUBRIC-WRITING-'+l.cefr_target);
   assert.equal(q.word_range_guidance.not_a_quality_score,true);
   assert(q.skill_tags.every(t=>t.startsWith('writing.')));
  }
 }
 if(l.module==='reading'){
  assert.equal(l.reading_asset?.display_to_learner,true);
  assert(l.reading_asset.body.includes('SOURCE A')&&l.reading_asset.body.includes('SOURCE B'));
 }
}
assert(newer[0].reading_asset.body.includes('Do not use it in the café'));
assert(newer[0].reading_asset.body.includes('the exact return place'));
assert(newer[2].reading_asset.body.includes('I have never joined an organised club photo walk'));
assert(newer[2].reading_asset.body.includes('I visited Green Park with my cousin last Sunday'));
assert(newer[2].reading_asset.body.includes("haven't written the captions yet"));
assert(newer[2].reading_asset.body.includes('Friday at 5:00 p.m.'));
assert.deepEqual([newer[1].activities[0].word_range_guidance,newer[3].activities[0].word_range_guidance],
 [{min:35,max:50,not_a_quality_score:true},{min:70,max:95,not_a_quality_score:true}]);
const compiled='.sites-runtime/f2-v124-test';
fs.mkdirSync(path.join(root,'.sites-runtime'),{recursive:true});
execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc','domain/academic.ts','domain/content-model.ts',
 'domain/option-order.ts','domain/unit-guide-60.ts','--outDir',compiled,
 '--rootDir','.','--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,compiled,'package.json'),'{"type":"commonjs"}\n');
const {validateSeed,mapSeed,MAX_CURRICULUM_LESSONS}=require(path.join(root,compiled,'domain/academic.js'));
const {validateContent}=require(path.join(root,compiled,'domain/content-model.js'));
const {createOptionOrder,validateOptionOrder,orderedOptions}=require(path.join(root,compiled,'domain/option-order.js'));
const {unitGuideForCatalog,primaryUnitForLessonId}=require(path.join(root,compiled,'domain/unit-guide-60.js'));
assert(MAX_CURRICULUM_LESSONS>=142,'Hard curriculum size cap must not be silently relaxed');
assert.deepEqual(validateSeed(next),[],'Seed schema validation');
assert.deepEqual(validateContent(mapSeed(next)),[],'Domain content validation');
let shuffles=0;
for(const lesson of newer){
 const order=createOptionOrder(lesson.activities,()=>0);
 validateOptionOrder(lesson.activities,{version:next.schema_version,optionOrder:order});
 for(const q of lesson.activities.filter(a=>a.type==='single_choice')){
  const displayed=orderedOptions(q,{optionOrder:order});
  assert.equal(displayed.length,4);
  assert.equal(displayed.find(o=>o.id===q.answer.correct_option_id).text,q.options.find(o=>o.id===q.answer.correct_option_id).text);
  if(JSON.stringify(displayed.map(o=>o.id))!==JSON.stringify(q.options.map(o=>o.id)))shuffles++;
 }
}
assert(shuffles>0,'No shuffle coverage');
const catalog=next.lessons.map(l=>({id:l.id,title:l.title,module:l.module,cefr:l.cefr_target,minutes:l.estimated_minutes}));
const units=unitGuideForCatalog(catalog,next.course.sequence);
assert.equal(units.units.length,60);
assert.equal(units.mappedLessonCount,140);
assert.deepEqual(units.unmappedLessons.map(l=>l.id).sort(),['REA-C1-01','VOC-C2-01']);
assert.equal(units.units.find(u=>u.id==='A1-U08').lessonCount,4);
assert.equal(units.units.find(u=>u.id==='A2-U07').lessonCount,4);
for(const [unit,ids] of Object.entries(unitMap))for(const id of ids)assert.equal(primaryUnitForLessonId(id),unit);
console.log(JSON.stringify({result:'PASS',gate:'F2-A1U08-A2U07-V124-SCHEMA',
 notebookLmAudit:'13/13 PASS',originalLessons:138,readingObjective:11,unscoredWriting:2,
 lessons:142,activities:1085,uniqueIds:true,machineSchema:true,shuffles,
 mappedLessons:140,unmappedAdvancedPilots:2,audioAdded:0,maxCurriculumLessons:MAX_CURRICULUM_LESSONS,
 iPadNative:'NOT_TESTED',liveImport:false,deploy:false,learnerDataWrites:0}));
