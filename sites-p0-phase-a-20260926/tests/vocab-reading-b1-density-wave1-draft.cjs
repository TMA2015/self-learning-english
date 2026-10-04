'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');

const basePath='content/curriculum-1.9.0-candidate.json';
const batchPath='content/batches/vocab-reading-b1-density-wave1.json';
const tempPath='.sites-runtime/vocab-reading-density-wave1/curriculum-1.10.0-preview.json';
const reviewPath='content/review-packets/EN-VOC-REA-B1-DENSITY-W1-20261004.md';
const generatedReviewPath='.sites-runtime/vocab-reading-density-wave1/EN-VOC-REA-B1-DENSITY-W1-20261004.generated.md';

fs.mkdirSync(path.dirname(tempPath),{recursive:true});
execFileSync(process.execPath,['scripts/compose-curriculum.mjs','--write',basePath,batchPath,tempPath],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/render-notebooklm-review.mjs',batchPath,generatedReviewPath,'EN-VOC-REA-B1-DENSITY-W1-20261004','B1 Vocabulary + Reading Density Wave 1'],{stdio:'inherit'});
assert.equal(fs.readFileSync(reviewPath,'utf8'),fs.readFileSync(generatedReviewPath,'utf8'),'NotebookLM Markdown must match batch JSON exactly');

execFileSync(process.execPath,[
  'node_modules/typescript/bin/tsc','domain/academic.ts',
  '--outDir','.sites-runtime/vocab-reading-density-wave1-compiled',
  '--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{stdio:'inherit'});
fs.writeFileSync('.sites-runtime/vocab-reading-density-wave1-compiled/package.json','{"type":"commonjs"}\n');

const {validateSeed,tagMap}=require('../.sites-runtime/vocab-reading-density-wave1-compiled/domain/academic.js');
const base=require('../'+basePath);
const batch=require('../'+batchPath);
const candidate=JSON.parse(fs.readFileSync(tempPath,'utf8'));

assert.equal(batch.status,'draft_pending_independent_notebooklm_review');
assert.equal(batch.base_version,'1.9.0');
assert.equal(batch.target_version,'1.10.0');
assert.deepEqual(batch.lessons.map(l=>l.id),['VOC-B1-02','VOC-B1-03','REA-B1-02','REA-B1-03']);
assert.equal(batch.lessons.length,4);
assert.equal(batch.lessons.flatMap(l=>l.activities).length,40);

assert.equal(candidate.schema_version,'1.10.0');
assert.equal(candidate.lessons.length,74);
assert.equal(candidate.lessons.flatMap(l=>l.activities).length,649);
assert.equal(candidate.lessons.filter(l=>l.module==='grammar').length,40);
assert.equal(candidate.lessons.filter(l=>l.module==='vocabulary').length,10);
assert.equal(candidate.lessons.filter(l=>l.module==='reading').length,11);
assert.deepEqual(validateSeed(candidate),[],'draft uses only already-reviewed runtime tags and must be schema-valid');

const allowed=new Set([
  'vocabulary.collocations','vocabulary.meaning_in_context','vocabulary.word_formation',
  'reading.gist','reading.detail','reading.inference','reading.author_purpose','reading.vocabulary_in_context'
]);
for(const lesson of batch.lessons)for(const q of lesson.activities){
  assert(q.skill_tags.length>=1,q.id+' needs a skill tag');
  assert(q.skill_tags.every(tag=>allowed.has(tag)),q.id+' introduced an unreviewed tag');
  assert(q.skill_tags.every(tag=>tagMap[tag]),q.id+' tag must already map in runtime');
  assert.equal(q.evidence_weight,1);
  assert(q.feedback.explanation_en.length>20);
}

for(const old of base.lessons)assert.deepEqual(candidate.lessons.find(l=>l.id===old.id),old,'1.9.0 lesson changed: '+old.id);

const seq=candidate.course.sequence;
assert.deepEqual(seq.slice(seq.indexOf('VOC-B1-01'),seq.indexOf('VOC-B1-01')+3),['VOC-B1-01','VOC-B1-02','VOC-B1-03']);
assert.deepEqual(seq.slice(seq.indexOf('REA-B1-01'),seq.indexOf('REA-B1-01')+3),['REA-B1-01','REA-B1-02','REA-B1-03']);

const newActivities=batch.lessons.flatMap(l=>l.activities);
const count=tag=>newActivities.filter(q=>q.skill_tags.includes(tag)).length;
assert(count('vocabulary.word_formation')>=8,'Wave 1 must materially increase word-formation evidence');
assert(count('reading.detail')>=8,'Wave 1 must materially add B1 reading-detail evidence');
assert(count('reading.vocabulary_in_context')>=4,'Wave 1 must add reading vocabulary-in-context evidence');

for(const lesson of batch.lessons.filter(l=>l.module==='reading')){
  assert(lesson.reading_asset?.display_to_learner===true);
  assert(lesson.reading_asset.body.length>500);
}

console.log(JSON.stringify({
  result:'PASS',
  reviewStatus:batch.status,
  base:'1.9.0',
  previewVersion:'1.10.0',
  newLessons:4,
  newActivities:40,
  cumulativeLessons:74,
  cumulativeActivities:649,
  grammarLessons:40,
  vocabularyLessons:10,
  readingLessons:11,
  newWordFormationEvidence:count('vocabulary.word_formation'),
  newReadingDetailEvidence:count('reading.detail'),
  newReadingVocabularyEvidence:count('reading.vocabulary_in_context'),
  newRuntimeTags:0,
  academicReviewPending:true,
  importAuthorized:false
}));
