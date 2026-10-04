'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');

const basePath='content/curriculum-1.8.0-candidate.json';
const batchPath='content/batches/grammar-b1-wave2c.json';
const tempPath='.sites-runtime/grammar-b1-wave2c/curriculum-1.9.0-preview.json';
const reviewPath='content/review-packets/EN-GRA-B1-W2C-20261004.md';
const generatedReviewPath='.sites-runtime/grammar-b1-wave2c/EN-GRA-B1-W2C-20261004.generated.md';

fs.mkdirSync(path.dirname(tempPath),{recursive:true});
execFileSync(process.execPath,['scripts/compose-curriculum.mjs','--write',basePath,batchPath,tempPath],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/render-notebooklm-review.mjs',batchPath,generatedReviewPath,'EN-GRA-B1-W2C-20261004','Grammar B1 Wave 2C'],{stdio:'inherit'});
assert.equal(fs.readFileSync(reviewPath,'utf8'),fs.readFileSync(generatedReviewPath,'utf8'),'NotebookLM Markdown must match the batch JSON exactly');

execFileSync(process.execPath,[
  'node_modules/typescript/bin/tsc','domain/academic.ts',
  '--outDir','.sites-runtime/grammar-b1-wave2c-compiled',
  '--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{stdio:'inherit'});
fs.writeFileSync('.sites-runtime/grammar-b1-wave2c-compiled/package.json','{"type":"commonjs"}\n');

const {validateSeed,tagMap}=require('../.sites-runtime/grammar-b1-wave2c-compiled/domain/academic.js');
const base=require('../'+basePath);
const batch=require('../'+batchPath);
const candidate=JSON.parse(fs.readFileSync(tempPath,'utf8'));

assert.equal(batch.status,'academic_pass_ready_for_1.9.0_composition');
assert.equal(batch.base_version,'1.8.0');
assert.equal(batch.target_version,'1.9.0');
assert.deepEqual(batch.lessons.map(l=>l.id),['GRA-B1-10','GRA-B1-11','GRA-B1-12']);
assert.equal(batch.lessons.length,3);
assert.equal(batch.lessons.flatMap(l=>l.activities).length,30);

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

assert.equal(candidate.schema_version,'1.9.0');
assert.equal(candidate.lessons.length,70);
assert.equal(candidate.lessons.flatMap(l=>l.activities).length,609);
assert.equal(candidate.lessons.filter(l=>l.module==='grammar').length,40);

const approvedTags={
  'grammar.non_defining_relative_clauses':'non-defining-relative-clauses',
  'grammar.gerund_infinitive':'gerund-infinitive',
  'grammar.indirect_questions':'indirect-questions',
  'grammar.question_tags':'question-tags'
};
for(const [tag,mapped] of Object.entries(approvedTags))assert.equal(tagMap[tag],mapped,'reviewed Wave 2C mapping missing: '+tag);
assert.deepEqual(validateSeed(candidate),[],'academic-PASS Wave 2C candidate must be importer-valid');

for(const old of base.lessons){
  assert.deepEqual(candidate.lessons.find(l=>l.id===old.id),old,'1.8.0 base lesson changed: '+old.id);
}
const seq=candidate.course.sequence;
assert.deepEqual(seq.slice(seq.indexOf('GRA-B1-09'),seq.indexOf('GRA-B1-09')+4),[
  'GRA-B1-09','GRA-B1-10','GRA-B1-11','GRA-B1-12'
]);

const byId=new Map(batch.lessons.flatMap(l=>l.activities).map(q=>[q.id,q]));
assert.deepEqual(byId.get('GRA-B1-10-Q4').answer.accepted_answers,['who']);
assert.deepEqual(byId.get('GRA-B1-10-Q8').answer.accepted_answers,['which']);
assert.equal(byId.get('GRA-B1-10-Q5').options.find(o=>o.id==='A').text,'The book I borrowed was excellent.');
assert.deepEqual(byId.get('GRA-B1-11-Q4').answer.accepted_answers,['to study']);
assert.deepEqual(byId.get('GRA-B1-11-Q7').answer.accepted_answers,['writing']);
assert.deepEqual(byId.get('GRA-B1-12-Q4').answer.accepted_answers,['where the station is']);
assert.equal(byId.get('GRA-B1-12-Q7').options.find(o=>o.id==='A').text,'do you');

console.log(JSON.stringify({
  result:'PASS',
  reviewStatus:batch.status,
  base:'1.8.0',
  previewVersion:'1.9.0',
  newLessons:3,
  newActivities:30,
  cumulativeLessons:70,
  cumulativeActivities:609,
  grammarLessons:40,
  roadmapTargetReachedOnPass:true,
  importerBlockedPendingReview:false,
  academicPass:true,
  importAuthorized:false
}));
