'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');

const basePath='content/curriculum-1.6.1-candidate.json';
const batchPath='content/batches/grammar-b1-wave2a.json';
const tempPath='.sites-runtime/grammar-b1-wave2a/curriculum-1.7.0-preview.json';

fs.mkdirSync(path.dirname(tempPath),{recursive:true});
execFileSync(process.execPath,['scripts/compose-curriculum.mjs','--write',basePath,batchPath,tempPath],{stdio:'inherit'});

execFileSync(process.execPath,[
  'node_modules/typescript/bin/tsc','domain/academic.ts',
  '--outDir','.sites-runtime/grammar-b1-wave2a-compiled',
  '--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{stdio:'inherit'});
fs.writeFileSync('.sites-runtime/grammar-b1-wave2a-compiled/package.json','{"type":"commonjs"}\n');

const {validateSeed,tagMap}=require('../.sites-runtime/grammar-b1-wave2a-compiled/domain/academic.js');
const base=require('../'+basePath);
const batch=require('../'+batchPath);
const candidate=JSON.parse(fs.readFileSync(tempPath,'utf8'));

assert.equal(batch.status,'draft_pending_independent_notebooklm_review');
assert.equal(batch.base_version,'1.6.1');
assert.equal(batch.target_version,'1.7.0');
assert.deepEqual(batch.lessons.map(l=>l.id),['GRA-B1-02','GRA-B1-03','GRA-B1-04','GRA-B1-05']);
assert.equal(batch.lessons.length,4);
assert.equal(batch.lessons.flatMap(l=>l.activities).length,40);
for(const lesson of batch.lessons){
  assert.equal(lesson.activities.length,10,lesson.id+' should have 10 activities');
  assert(lesson.objectives.length>=3);
  assert(lesson.explanation.en.length>100);
  assert(lesson.explanation.vi.length>50);
  assert(lesson.examples.length>=4);
  for(const q of lesson.activities){
    assert(q.skill_tags.length>=1,q.id+' needs a skill tag');
    assert.equal(q.evidence_weight,1);
    assert(q.feedback.explanation_en.length>20,q.id+' needs useful feedback');
  }
}

assert.equal(candidate.schema_version,'1.7.0');
assert.equal(candidate.lessons.length,63);
assert.equal(candidate.lessons.flatMap(l=>l.activities).length,539);
assert.equal(candidate.lessons.filter(l=>l.module==='grammar').length,33);
const proposedTags=['grammar.present_perfect_continuous','grammar.past_perfect','grammar.narrative_order','grammar.used_to','grammar.would_past_habit','grammar.modal_deduction'];
for(const tag of proposedTags)assert.equal(tagMap[tag],undefined,'draft tag must stay closed until academic review: '+tag);
const preReviewErrors=validateSeed(candidate);
assert(preReviewErrors.length>0,'draft candidate must not become importer-valid before tag review');
for(const lesson of batch.lessons)for(const q of lesson.activities)assert(preReviewErrors.some(e=>e.startsWith(q.id+': invalid prompt/tags.')),'expected closed-world tag block for '+q.id);

for(const old of base.lessons){
  assert.deepEqual(candidate.lessons.find(l=>l.id===old.id),old,'base lesson changed: '+old.id);
}

const seq=candidate.course.sequence;
assert.deepEqual(seq.slice(seq.indexOf('GRA-B1-01'),seq.indexOf('GRA-B1-01')+5),[
  'GRA-B1-01','GRA-B1-02','GRA-B1-03','GRA-B1-04','GRA-B1-05'
]);

const modal=batch.lessons.find(l=>l.id==='GRA-B1-05');
const possible=modal.activities.find(q=>q.id==='GRA-B1-05-Q6');
assert.deepEqual(new Set(possible.answer.accepted_answers),new Set(['might','may','could']));
for(const q of modal.activities.filter(q=>q.type==='single_choice')){
  const correct=q.options.find(o=>o.id===q.answer.correct_option_id)?.text;
  assert.notEqual(correct,'mustn\'t','mustn\'t must not be used as the correct negative-deduction form');
}
const habits=batch.lessons.find(l=>l.id==='GRA-B1-04');
assert.equal(habits.activities.find(q=>q.id==='GRA-B1-04-Q3').options.find(o=>o.id==='A').text,"didn't use to like");

console.log(JSON.stringify({
  result:'PASS',
  reviewStatus:batch.status,
  base:'1.6.1',
  previewVersion:'1.7.0',
  newLessons:4,
  newActivities:40,
  cumulativeLessons:63,
  cumulativeActivities:539,
  grammarLessons:33,
  importerBlockedPendingReview:true,
  importAuthorized:false
}));
