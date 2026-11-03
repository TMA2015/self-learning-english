'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));

const base=read('content/curriculum-1.11.0-candidate.json');
const batches=[
  read('content/batches/vocab-reading-density-wave3a.json'),
  read('content/batches/reading-writing-density-wave3b.json'),
];

const lessonIds=new Set(base.lessons.map(l=>l.id));
const questionIds=new Set(base.lessons.flatMap(l=>l.activities??[]).map(q=>q.id));
const reviewedTags=new Set(base.lessons.flatMap(l=>(l.activities??[]).flatMap(q=>q.skill_tags??[])));
let lessons=0,activities=0;

for(const batch of batches){
  assert.equal(batch.base_version,'1.11.0');
  assert.equal(batch.target_version,'1.12.0');
  assert.equal(batch.status,'academic_pass_ready_for_1.12.0_composition');
  for(const lesson of batch.lessons){
    assert(!lessonIds.has(lesson.id),'duplicate lesson '+lesson.id);
    lessonIds.add(lesson.id);lessons++;
    assert(['vocabulary','reading','writing'].includes(lesson.module),'unexpected module '+lesson.id);
    assert(Array.isArray(lesson.objectives)&&lesson.objectives.length>=3,'thin objectives '+lesson.id);
    assert(lesson.explanation?.en&&lesson.explanation?.vi,'bilingual explanation required '+lesson.id);
    for(const q of lesson.activities??[]){
      assert(!questionIds.has(q.id),'duplicate activity '+q.id);
      questionIds.add(q.id);activities++;
      for(const tag of q.skill_tags??[])assert(reviewedTags.has(tag),'unreviewed runtime tag '+tag+' in '+q.id);
      if(q.type==='single_choice'){
        assert.equal(q.options?.length,4,'MCQ needs four options '+q.id);
        assert(q.options.some(o=>o.id===q.answer?.correct_option_id),'invalid key '+q.id);
      }
      if(q.type==='short_answer')assert(q.answer?.accepted_answers?.length,'short answer needs accepted answer '+q.id);
      if(q.type==='extended_response'){
        assert.equal(q.answer,null,'extended response must have no deterministic key '+q.id);
        assert.equal(q.evidence_weight,0,'extended response cannot add deterministic proficiency evidence '+q.id);
        assert.equal(q.review_mode,'assisted_ai_or_human','extended response must be review-required '+q.id);
      }
    }
  }
}
assert.equal(lessons,6);
assert.equal(activities,50);
console.log(JSON.stringify({result:'PASS',lessons,activities,newRuntimeTags:0,target:'1.12.0',academicReview:'PASS',importAuthorized:false,deployAuthorized:false}));
