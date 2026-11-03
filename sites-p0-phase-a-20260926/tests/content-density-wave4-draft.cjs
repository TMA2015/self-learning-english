'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));

const base=read('content/curriculum-1.12.0-candidate.json');
const a=read('content/batches/listening-speaking-density-wave4a.json');
const b=read('content/batches/pronunciation-density-wave4b.json');
const combined=read('content/batches/listening-speaking-pronunciation-density-wave4.json');

assert.equal(base.schema_version,'1.12.0');
for(const batch of [a,b,combined]){
  assert.equal(batch.base_version,'1.12.0');
  assert.equal(batch.target_version,'1.13.0');
  assert.equal(batch.status,'draft_for_notebooklm_review_no_import');
}
assert.equal(a.lessons.length,4);
assert.equal(a.lessons.flatMap(l=>l.activities).length,29);
assert.equal(b.lessons.length,2);
assert.equal(b.lessons.flatMap(l=>l.activities).length,11);
assert.equal(combined.lessons.length,6);
assert.equal(combined.lessons.flatMap(l=>l.activities).length,40);

const oldLessonIds=new Set(base.lessons.map(l=>l.id));
const oldActivityIds=new Set(base.lessons.flatMap(l=>l.activities??[]).map(q=>q.id));
const reviewedTags=new Set(base.lessons.flatMap(l=>(l.activities??[]).flatMap(q=>q.skill_tags??[])));
const split=new Map([...a.lessons,...b.lessons].map(l=>[l.id,l]));
assert.equal(split.size,6);

for(const lesson of combined.lessons){
  assert(!oldLessonIds.has(lesson.id),'duplicate lesson '+lesson.id);
  assert.deepEqual(lesson,split.get(lesson.id),'combined batch differs from split review source '+lesson.id);
  assert(['listening','speaking','pronunciation'].includes(lesson.module));
  assert(Array.isArray(lesson.objectives)&&lesson.objectives.length>=3);
  assert(lesson.explanation?.en&&lesson.explanation?.vi);
  if(lesson.module==='listening'){
    assert.equal(lesson.audio_asset?.requires_real_playback,true);
    assert.equal(lesson.audio_asset?.transcript_reveal,'after_submission');
    assert.match(lesson.audio_asset?.fallback??'',/no real playback means no listening score/i);
  }
  if(lesson.module==='speaking'){
    assert.equal(lesson.recording?.requires_permission,true);
    assert.equal(lesson.recording?.no_auto_pronunciation_score,true);
  }
  if(lesson.module==='pronunciation'){
    assert.equal(lesson.audio_model?.requires_real_playback,true);
    assert.match(lesson.audio_model?.fallback??'',/no playback means no audio-based skill evidence/i);
  }
  for(const q of lesson.activities){
    assert(!oldActivityIds.has(q.id),'duplicate activity '+q.id);
    for(const tag of q.skill_tags??[])assert(reviewedTags.has(tag),'unreviewed runtime tag '+tag+' in '+q.id);
    if(q.type==='single_choice'){
      assert.equal(q.options?.length,4);
      assert(q.options.some(o=>o.id===q.answer?.correct_option_id),'invalid answer '+q.id);
      assert.equal(q.evidence_weight,1);
    }
    if(q.type==='extended_response'){
      assert.equal(q.answer,null);
      assert.equal(q.evidence_weight,0);
      assert.equal(q.review_mode,'assisted_ai_or_human');
      assert(q.rubric_id);
    }
  }
}
console.log(JSON.stringify({
  result:'PASS',
  base:'1.12.0',
  target:'1.13.0',
  lessons:6,
  activities:40,
  wave4A:{lessons:4,activities:29},
  wave4B:{lessons:2,activities:11},
  newRuntimeTags:0,
  audioSafeguards:true,
  importAuthorized:false,
  deployAuthorized:false
}));
