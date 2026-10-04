'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');

const basePath='content/curriculum-1.7.0-candidate.json';
const batchPath='content/batches/grammar-b1-wave2b.json';
const tempPath='.sites-runtime/grammar-b1-wave2b/curriculum-1.8.0-preview.json';
const reviewPath='content/review-packets/EN-GRA-B1-W2B-20261004.md';
const generatedReviewPath='.sites-runtime/grammar-b1-wave2b/EN-GRA-B1-W2B-20261004.generated.md';

fs.mkdirSync(path.dirname(tempPath),{recursive:true});
execFileSync(process.execPath,['scripts/compose-curriculum.mjs','--write',basePath,batchPath,tempPath],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/render-notebooklm-review.mjs',batchPath,generatedReviewPath,'EN-GRA-B1-W2B-20261004','Grammar B1 Wave 2B'],{stdio:'inherit'});
assert.equal(fs.readFileSync(reviewPath,'utf8'),fs.readFileSync(generatedReviewPath,'utf8'),'NotebookLM Markdown must match the batch JSON exactly');

execFileSync(process.execPath,[
  'node_modules/typescript/bin/tsc','domain/academic.ts',
  '--outDir','.sites-runtime/grammar-b1-wave2b-compiled',
  '--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{stdio:'inherit'});
fs.writeFileSync('.sites-runtime/grammar-b1-wave2b-compiled/package.json','{"type":"commonjs"}\n');

const {validateSeed,tagMap}=require('../.sites-runtime/grammar-b1-wave2b-compiled/domain/academic.js');
const base=require('../'+basePath);
const batch=require('../'+batchPath);
const candidate=JSON.parse(fs.readFileSync(tempPath,'utf8'));

assert.equal(batch.status,'academic_pass_ready_for_1.8.0_composition');
assert.equal(batch.base_version,'1.7.0');
assert.equal(batch.target_version,'1.8.0');
assert.deepEqual(batch.lessons.map(l=>l.id),['GRA-B1-06','GRA-B1-07','GRA-B1-08','GRA-B1-09']);
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

assert.equal(candidate.schema_version,'1.8.0');
assert.equal(candidate.lessons.length,67);
assert.equal(candidate.lessons.flatMap(l=>l.activities).length,579);
assert.equal(candidate.lessons.filter(l=>l.module==='grammar').length,37);

const approvedTags={
  'grammar.second_conditional':'second-conditional',
  'grammar.wish_present':'wish-present',
  'grammar.passive_voice':'passive-voice',
  'grammar.reported_speech':'reported-speech',
  'grammar.reported_questions':'reported-questions'
};
for(const [tag,mapped] of Object.entries(approvedTags))assert.equal(tagMap[tag],mapped,'reviewed B1 Wave 2B mapping missing: '+tag);
assert.deepEqual(validateSeed(candidate),[],'academic-PASS Wave 2B candidate must be importer-valid');

for(const old of base.lessons){
  assert.deepEqual(candidate.lessons.find(l=>l.id===old.id),old,'1.7.0 base lesson changed: '+old.id);
}
const seq=candidate.course.sequence;
assert.deepEqual(seq.slice(seq.indexOf('GRA-B1-05'),seq.indexOf('GRA-B1-05')+5),[
  'GRA-B1-05','GRA-B1-06','GRA-B1-07','GRA-B1-08','GRA-B1-09'
]);

const byId=new Map(batch.lessons.flatMap(l=>l.activities).map(q=>[q.id,q]));
assert.deepEqual(byId.get('GRA-B1-06-Q2').answer.accepted_answers,['would see',"'d see",'’d see']);
assert.deepEqual(byId.get('GRA-B1-06-Q7').answer.accepted_answers,['would drive',"'d drive",'’d drive']);
assert.deepEqual(byId.get('GRA-B1-09-Q9').answer.accepted_answers,['if','whether']);
assert.equal(byId.get('GRA-B1-09-Q3').options.find(o=>o.id==='A').text,'She asked where I lived.');
assert.equal(byId.get('GRA-B1-08-Q7').answer.accepted_answers[0],'were sent');

console.log(JSON.stringify({
  result:'PASS',
  reviewStatus:batch.status,
  base:'1.7.0',
  previewVersion:'1.8.0',
  newLessons:4,
  newActivities:40,
  cumulativeLessons:67,
  cumulativeActivities:579,
  grammarLessons:37,
  importerBlockedPendingReview:false,
  academicPass:true,
  importAuthorized:false
}));
