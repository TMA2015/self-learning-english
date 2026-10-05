'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const base=require('../content/curriculum-1.13.0-candidate.json');
const batch=require('../content/batches/speaking-pronunciation-density-wave5.json');

assert.equal(base.schema_version,'1.13.0');
assert.equal(batch.base_version,'1.13.0');
assert.equal(batch.target_version,'1.14.0');
assert.equal(batch.status,'draft_for_notebooklm_review_no_import');
assert.equal(batch.lessons.length,4);
assert.equal(batch.lessons.flatMap(l=>l.activities).length,23);

const oldLessonIds=new Set(base.lessons.map(l=>l.id));
const oldActivityIds=new Set(base.lessons.flatMap(l=>l.activities??[]).map(q=>q.id));
const reviewedTags=new Set(base.lessons.flatMap(l=>(l.activities??[]).flatMap(q=>q.skill_tags??[])));

for(const lesson of batch.lessons){
  assert(!oldLessonIds.has(lesson.id),'duplicate lesson '+lesson.id);
  assert(['speaking','pronunciation'].includes(lesson.module));
  assert(Array.isArray(lesson.objectives)&&lesson.objectives.length>=3);
  assert(lesson.explanation?.en&&lesson.explanation?.vi);

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

const a1=batch.lessons.find(l=>l.id==='SPE-A1-01');
assert(a1);
assert.match(a1.explanation.en,/do not need to share private information/i);
assert.match(a1.activities.find(q=>q.id==='SPE-A1-01-Q5').prompt,/Do not give an address, phone number, password/i);

const intonation=batch.lessons.find(l=>l.id==='PRO-B1-02');
assert(intonation);
assert.match(intonation.explanation.en,/common patterns, not rigid rules/i);

console.log(JSON.stringify({
 result:'PASS',
 base:'1.13.0',
 target:'1.14.0',
 lessons:4,
 activities:23,
 newRuntimeTags:0,
 privacySafeguard:true,
 audioSafeguards:true,
 importAuthorized:false,
 deployAuthorized:false
}));
