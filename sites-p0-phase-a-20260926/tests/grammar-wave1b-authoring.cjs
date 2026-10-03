'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');

const files=[
  'content/grammar-wave1b-packet-a-a1-completion-draft.json',
  'content/grammar-wave1b-packet-b-a2-core-draft.json',
  'content/grammar-wave1b-packet-c-a2-extension-draft.json'
];
const expected={
  'GRAMMAR-WAVE1B-PACKET-A-A1-COMPLETION-20261003':['GRA-A1-09','GRA-A1-10','GRA-A1-11','GRA-A1-12'],
  'GRAMMAR-WAVE1B-PACKET-B-A2-CORE-20261003':['GRA-A2-08','GRA-A2-10','GRA-A2-11','GRA-A2-12'],
  'GRAMMAR-WAVE1B-PACKET-C-A2-EXTENSION-20261003':['GRA-A2-13','GRA-A2-14','GRA-A2-15','GRA-A2-16']
};
const allowedTags=new Set([
 'grammar.demonstratives','grammar.object_pronouns','grammar.possessive_pronouns','grammar.imperatives','grammar.instructions','grammar.prepositions_time',
 'grammar.past_continuous','grammar.past_simple','grammar.present_perfect','grammar.will_future','grammar.future_plans','grammar.present_continuous','grammar.should_advice',
 'grammar.modal_possibility','grammar.conditionals','grammar.verb_patterns','grammar.relative_clauses'
]);
const allLessonIds=new Set(),allActivityIds=new Set();
let totalLessons=0,totalActivities=0;
for(const file of files){
 const p=JSON.parse(fs.readFileSync(file,'utf8'));
 assert.equal(p.format,'self-learning-english.grammar-authoring-packet');
 assert.equal(p.schema_version,1);
 assert.equal(p.status,'DRAFT_FOR_INDEPENDENT_ACADEMIC_REVIEW_NOT_IMPORTABLE');
 assert.deepEqual(p.lessons.map(l=>l.id),expected[p.packet_id],p.packet_id);
 assert.equal(p.lessons.length,4,p.packet_id);
 assert.equal(p.lessons.reduce((n,l)=>n+l.activities.length,0),40,p.packet_id);
 for(const t of p.planned_source_tags)assert(allowedTags.has(t),'unexpected planned tag '+t);
 for(const l of p.lessons){
  assert(!allLessonIds.has(l.id),'duplicate lesson '+l.id);allLessonIds.add(l.id);
  assert.equal(l.module,'grammar');assert(['A1','A2'].includes(l.cefr_target));
  assert(Array.isArray(l.prerequisite_lesson_ids));
  assert(Array.isArray(l.adaptive_concepts)&&l.adaptive_concepts.length>0);
  assert(Array.isArray(l.objectives)&&l.objectives.length>=3&&l.objectives.length<=4);
  assert(l.explanation?.en?.length>80,l.id+' English explanation');
  assert(l.explanation?.vi?.length>30,l.id+' Vietnamese support');
  assert(Array.isArray(l.examples)&&l.examples.length>=4);
  assert.equal(l.activities.length,10,l.id);
  for(const q of l.activities){
   totalActivities++;
   assert(q.id.startsWith(l.id+'-Q'),q.id);
   assert(!allActivityIds.has(q.id),'duplicate activity '+q.id);allActivityIds.add(q.id);
   assert(['single_choice','short_answer'].includes(q.type),q.id);
   assert(q.prompt&&q.prompt.trim()===q.prompt,q.id+' prompt');
   assert(Array.isArray(q.skill_tags)&&q.skill_tags.length>0,q.id);
   for(const t of q.skill_tags)assert(allowedTags.has(t),'unplanned tag '+t+' in '+q.id);
   assert.equal(q.evidence_weight,1,q.id);
   assert(q.feedback?.explanation_en?.length>20,q.id+' explanation');
   if(q.type==='single_choice'){
    assert(Array.isArray(q.options)&&q.options.length===4,q.id);
    assert.equal(new Set(q.options.map(o=>o.id)).size,4,q.id);
    assert(q.options.some(o=>o.id===q.answer?.correct_option_id),q.id+' key');
    assert.equal(new Set(q.options.map(o=>o.text.trim().toLowerCase())).size,4,q.id+' duplicate option');
   } else {
    assert(q.prompt.includes('___'),q.id+' short answer must show literal gap');
    assert(Array.isArray(q.answer?.accepted_answers)&&q.answer.accepted_answers.length>0,q.id);
    for(const a of q.answer.accepted_answers){
      assert(a&&a===a.trim(),q.id+' accepted answer spacing');
      assert(!/^[’']/.test(a),q.id+' apostrophe-leading fragment violates literal-gap spacing');
    }
    assert.deepEqual(q.answer.normalization,['trim','casefold','collapse_spaces','strip_terminal_punctuation'],q.id);
   }
  }
  totalLessons++;
 }
}
assert.equal(totalLessons,12);
assert.equal(totalActivities,120);

// Lock known ambiguity/literal-gap fixes.
const packets=files.map(f=>JSON.parse(fs.readFileSync(f,'utf8')));
const find=id=>packets.flatMap(p=>p.lessons).flatMap(l=>l.activities).find(q=>q.id===id);
assert.deepEqual(find('GRA-A2-10-Q5').answer.accepted_answers,['has just left']);
assert.deepEqual(find('GRA-A2-11-Q6').answer.accepted_answers,['will help']);
assert.deepEqual(find('GRA-A2-11-Q7').answer.accepted_answers,['are meeting']);
assert.deepEqual(find('GRA-A2-14-Q4').answer.accepted_answers,['will call']);
assert.deepEqual(find('GRA-A2-16-Q6').answer.accepted_answers,['which','that']);

console.log(JSON.stringify({result:'PASS',packets:3,lessons:12,activities:120,uniqueLessonIds:allLessonIds.size,uniqueActivityIds:allActivityIds.size}));
