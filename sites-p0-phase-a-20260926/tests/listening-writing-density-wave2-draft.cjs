'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');

const basePath='content/curriculum-1.10.0-candidate.json';
const batchPath='content/batches/listening-writing-density-wave2.json';
const tempPath='.sites-runtime/listening-writing-density-wave2/curriculum-1.11.0-preview.json';
const reviewPath='content/review-packets/EN-LIS-WRI-DENSITY-W2-20261004.md';
const generatedReviewPath='.sites-runtime/listening-writing-density-wave2/EN-LIS-WRI-DENSITY-W2-20261004.generated.md';

fs.mkdirSync(path.dirname(tempPath),{recursive:true});
execFileSync(process.execPath,['scripts/compose-curriculum.mjs','--write',basePath,batchPath,tempPath],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/render-notebooklm-review.mjs',batchPath,generatedReviewPath,'EN-LIS-WRI-DENSITY-W2-20261004','Listening + B1 Writing Density Wave 2'],{stdio:'inherit'});
assert.equal(fs.readFileSync(reviewPath,'utf8'),fs.readFileSync(generatedReviewPath,'utf8'),'NotebookLM Markdown must match batch JSON exactly');

execFileSync(process.execPath,[
  'node_modules/typescript/bin/tsc','domain/academic.ts',
  '--outDir','.sites-runtime/listening-writing-density-wave2-compiled',
  '--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{stdio:'inherit'});
fs.writeFileSync('.sites-runtime/listening-writing-density-wave2-compiled/package.json','{"type":"commonjs"}\n');

const {validateSeed,tagMap}=require('../.sites-runtime/listening-writing-density-wave2-compiled/domain/academic.js');
const base=require('../'+basePath);
const batch=require('../'+batchPath);
const candidate=JSON.parse(fs.readFileSync(tempPath,'utf8'));

assert.equal(batch.status,'academic_pass_ready_for_1.11.0_composition');
assert.equal(batch.base_version,'1.10.0');
assert.equal(batch.target_version,'1.11.0');
assert.deepEqual(batch.lessons.map(l=>l.id),['LIS-A1-01','LIS-A2-02','LIS-B1-02','WRI-B1-02']);
assert.equal(batch.lessons.length,4);
assert.equal(batch.lessons.flatMap(l=>l.activities).length,40);

assert.equal(candidate.schema_version,'1.11.0');
assert.equal(candidate.lessons.length,78);
assert.equal(candidate.lessons.flatMap(l=>l.activities).length,689);
assert.equal(candidate.lessons.filter(l=>l.module==='grammar').length,40);
assert.equal(candidate.lessons.filter(l=>l.module==='listening').length,5);
assert.equal(candidate.lessons.filter(l=>l.module==='writing').length,9);
assert.deepEqual(validateSeed(candidate),[],'draft uses only reviewed runtime tags and must remain schema-valid');

const allowed=new Set([
  'listening.gist','listening.detail','listening.inference','listening.speaker_intention',
  'writing.task_understanding','writing.idea_development','writing.organization','writing.cohesion',
  'writing.register','writing.grammar','writing.vocabulary'
]);
for(const lesson of batch.lessons)for(const q of lesson.activities){
  assert(q.skill_tags.length>=1,q.id+' needs a skill tag');
  assert(q.skill_tags.every(tag=>allowed.has(tag)),q.id+' introduced an unreviewed tag');
  assert(q.skill_tags.every(tag=>tagMap[tag]),q.id+' tag must already map in runtime');
  if(q.type==='extended_response'){
    assert.equal(q.evidence_weight,0,q.id+' extended response must not auto-create evidence');
    assert.equal(q.review_mode,'assisted_ai_or_human');
  }else{
    assert.equal(q.evidence_weight,1);
    assert(q.feedback.explanation_en.length>20);
  }
}

for(const old of base.lessons)assert.deepEqual(candidate.lessons.find(l=>l.id===old.id),old,'1.10.0 lesson changed: '+old.id);

const seq=candidate.course.sequence;
assert.deepEqual(seq.slice(seq.indexOf('WRI-A1-04'),seq.indexOf('WRI-A1-04')+3),['WRI-A1-04','LIS-A1-01','GRA-A2-07']);
assert.deepEqual(seq.slice(seq.indexOf('LIS-A2-01'),seq.indexOf('LIS-A2-01')+3),['LIS-A2-01','LIS-A2-02','WRI-A2-01']);
assert.deepEqual(seq.slice(seq.indexOf('LIS-B1-01'),seq.indexOf('LIS-B1-01')+3),['LIS-B1-01','LIS-B1-02','WRI-B1-01']);
assert.deepEqual(seq.slice(seq.indexOf('WRI-B1-01'),seq.indexOf('WRI-B1-01')+3),['WRI-B1-01','WRI-B1-02','SPE-B1-01']);

for(const lesson of batch.lessons.filter(l=>l.module==='listening')){
  assert.equal(lesson.audio_asset?.transcript_reveal,'after_submission');
  assert.equal(lesson.audio_asset?.requires_real_playback,true);
  assert(lesson.audio_asset?.source_text.length>300);
  assert(/no listening score|mark listening unassessed/i.test(lesson.audio_asset?.fallback??''),'listening fallback must prohibit credit without playback: '+lesson.id);
}

const listeningActivities=batch.lessons.filter(l=>l.module==='listening').flatMap(l=>l.activities);
const writingActivities=batch.lessons.filter(l=>l.module==='writing').flatMap(l=>l.activities);
const count=(arr,tag)=>arr.filter(q=>q.skill_tags.includes(tag)).length;
assert(count(listeningActivities,'listening.detail')>=20,'Wave 2 must materially increase listening detail evidence');
assert(count(listeningActivities,'listening.inference')>=4,'Wave 2 must increase listening inference evidence');
assert(count(listeningActivities,'listening.speaker_intention')>=3,'Wave 2 must increase speaker-intention evidence');
assert(count(writingActivities,'writing.cohesion')>=3,'Wave 2 must materially increase B1 writing cohesion practice');
assert.equal(writingActivities.filter(q=>q.type==='extended_response').length,1);
assert.equal(writingActivities.find(q=>q.type==='extended_response').evidence_weight,0);

console.log(JSON.stringify({
  result:'PASS',
  reviewStatus:batch.status,
  base:'1.10.0',
  previewVersion:'1.11.0',
  newLessons:4,
  newActivities:40,
  cumulativeLessons:78,
  cumulativeActivities:689,
  listeningLessons:5,
  writingLessons:9,
  newListeningDetailEvidence:count(listeningActivities,'listening.detail'),
  newListeningInferenceEvidence:count(listeningActivities,'listening.inference'),
  newListeningSpeakerIntentionEvidence:count(listeningActivities,'listening.speaker_intention'),
  newWritingCohesionEvidence:count(writingActivities,'writing.cohesion'),
  newRuntimeTags:0,
  academicReviewPending:false,
  academicPass:true,
  importAuthorized:false
}));
