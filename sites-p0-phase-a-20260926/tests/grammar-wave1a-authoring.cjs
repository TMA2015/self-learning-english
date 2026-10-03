'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const packet=require('../content/grammar-wave1a-a2-foundations-draft.json');

assert.equal(packet.format,'self-learning-english.grammar-authoring-packet');
assert.equal(packet.status,'DRAFT_FOR_INDEPENDENT_ACADEMIC_REVIEW_NOT_IMPORTABLE');
assert.equal(packet.package_id,undefined,'authoring fragment must not masquerade as an importer package');
assert.equal(packet.schema_version,1);
assert.equal(packet.lessons.length,2);
assert.deepEqual(packet.lessons.map(l=>l.id),['GRA-A2-07','GRA-A2-09']);
assert.deepEqual(packet.lessons.map(l=>l.activities.length),[10,10]);

const ids=new Set(),allowedTypes=new Set(['single_choice','short_answer']);
const academic=fs.readFileSync(path.join(root,'domain/academic.ts'),'utf8');
for(const lesson of packet.lessons){
 assert.equal(lesson.module,'grammar');
 assert.equal(lesson.cefr_target,'A2');
 assert.ok(lesson.title&&lesson.explanation?.en&&lesson.explanation?.vi);
 assert.ok(Array.isArray(lesson.objectives)&&lesson.objectives.length>=3);
 assert.ok(Array.isArray(lesson.examples)&&lesson.examples.length>=4);
 for(const q of lesson.activities){
  assert.ok(q.id.startsWith(lesson.id+'-Q'));
  assert.ok(!ids.has(q.id),'duplicate activity '+q.id);ids.add(q.id);
  assert.ok(allowedTypes.has(q.type),'unsupported draft type '+q.id);
  assert.match(q.prompt,/Select|Write only/,'prompt must explicitly state the response format: '+q.id);
  assert.ok(Array.isArray(q.skill_tags)&&q.skill_tags.length>=1);
  for(const tag of q.skill_tags)assert.ok(academic.includes("'"+tag+"'"),'tag requires compatibility work before candidate assembly: '+tag);
  assert.equal(q.evidence_weight,1);
  assert.ok(q.feedback?.explanation_en);
  if(q.type==='single_choice'){
   assert.ok(Array.isArray(q.options)&&q.options.length===4);
   assert.equal(new Set(q.options.map(o=>o.id)).size,4);
   assert.ok(q.options.some(o=>o.id===q.answer?.correct_option_id),'key must name an existing option: '+q.id);
  }else{
   assert.ok(Array.isArray(q.answer?.accepted_answers)&&q.answer.accepted_answers.length>=1);
   assert.ok(Array.isArray(q.answer?.normalization)&&q.answer.normalization.includes('trim'));
  }
 }
}
const q207=packet.lessons.find(l=>l.id==='GRA-A2-07').activities.find(q=>q.id==='GRA-A2-07-Q2');
assert.ok(q207.prompt.includes('including the subject'));
assert.deepEqual(q207.answer.accepted_answers,['we are studying',"we're studying",'we’re studying']);
const q209=packet.lessons.find(l=>l.id==='GRA-A2-09').activities.find(q=>q.id==='GRA-A2-09-Q7');
assert.ok(q209.prompt.includes('including the subject'));
assert.deepEqual(q209.answer.accepted_answers,['he has never eaten',"he's never eaten",'he’s never eaten']);
assert.equal(ids.size,20);
assert.deepEqual(packet.review_requirements.verdicts,['PASS','REVISE','BLOCK']);
assert.equal(packet.review_requirements.item_count,20);
assert.equal(packet.review_requirements.lesson_count,2);

const pc=packet.lessons.find(l=>l.id==='GRA-A2-07');
assert.deepEqual(pc.prerequisite_lesson_ids,['GRA-A1-01','GRA-A1-03']);
assert.ok(pc.activities.some(q=>q.skill_tags.includes('grammar.present_continuous')));
const pp=packet.lessons.find(l=>l.id==='GRA-A2-09');
assert.deepEqual(pp.prerequisite_lesson_ids,['GRA-A2-02']);
assert.ok(pp.activities.some(q=>q.skill_tags.includes('grammar.present_perfect')));
assert.ok(pp.activities.some(q=>q.skill_tags.includes('grammar.past_simple')),'finished-time contrast should produce bounded past-simple evidence');

console.log('PASS: Grammar Wave 1A draft has 2 review-only A2 lessons, 20 unique activities, explicit answer formats and compatible existing tags.');
