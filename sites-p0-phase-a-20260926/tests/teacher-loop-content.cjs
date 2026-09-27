const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const root=path.resolve(__dirname,'..');
const load=file=>JSON.parse(fs.readFileSync(path.join(root,'content',file),'utf8'));
const course=load('curriculum-1.1.0-candidate.json');
const pilot=load('teacher-coaching/grammar-a1-01.v1.json');
const lesson=course.lessons.find(l=>l.id==='GRA-A1-01');
assert(lesson,'A1 be lesson exists in curriculum 1.1.0');
assert.equal(pilot.schema,'ai-english-tutor.teacher-coaching');
assert.equal(pilot.schema_version,1);
assert.equal(pilot.status,'pilot_not_imported_or_deployed');
assert.equal(pilot.lesson_id,lesson.id);
assert.equal(pilot.content_version,course.schema_version);
const concepts=new Map(pilot.concepts.map(c=>[c.id,c]));
assert.equal(concepts.size,pilot.concepts.length);
const itemMap=new Map(lesson.activities.map(q=>[q.id,q]));
const coachingMap=new Map(pilot.items.map(q=>[q.id,q]));
const remediation=new Map(pilot.remediation.map(q=>[q.id,q]));
assert.equal(itemMap.size,10);
assert.equal(coachingMap.size,10);
assert.equal(remediation.size,4);
const answerVisible=(hint,answer)=>{
  const words=answer.toLowerCase().trim().replace(/[’]/g,"'").split(/\s+/);
  const tokens=hint.toLowerCase().replace(/[’]/g,"'").match(/[a-z]+(?:'[a-z]+)?/g)||[];
  return words.length>0 && tokens.some((_,i)=>words.every((word,j)=>tokens[i+j]===word));
};
for(const [id,q] of itemMap){
 const item=coachingMap.get(id);
 assert(item,'Missing coaching for '+id);
 assert(concepts.has(item.concept_id),'Unknown concept '+id);
 assert(['modelled','guided','independent','transfer','retrieval'].includes(item.mode),'Unknown practice mode '+id);
 assert.equal(item.hints.length,2,'Exactly two hints per item '+id);
 assert(item.hints.every(h=>h.length>=25&&h.length<=220),'Hint length '+id);
 assert(remediation.has(item.followup_item_id),'Missing new analogous question '+id);
 assert.equal(remediation.get(item.followup_item_id).concept_id,item.concept_id,'Follow-up concept mismatch '+id);
 const correct=q.type==='single_choice'?q.options.find(o=>o.id===q.answer.correct_option_id).text:q.answer.accepted_answers;
 for(const hint of item.hints){
  for(const accepted of Array.isArray(correct)?correct:[correct]){
   assert(!answerVisible(hint,accepted),'Hint includes full answer for '+id+': '+accepted);
  }
 }
 if(q.type==='single_choice'){
  assert(!Object.hasOwn(item.likely_distractor_errors,q.answer.correct_option_id),'Correct option wrongly tagged as an error '+id);
  for(const [option,code] of Object.entries(item.likely_distractor_errors)){
   assert(q.options.some(o=>o.id===option),'Missing distractor '+id);
   assert(typeof code==='string'&&code.length>0,'Missing misconception code '+id);
  }
 }else assert.deepEqual(item.likely_distractor_errors,{},'Unvalidated short-answer diagnosis '+id);
}
for(const [id,q] of remediation){
 assert(concepts.has(q.concept_id),'Unknown followup concept '+id);
 assert(!itemMap.has(id),'Remediation must not overwrite an original item '+id);
 assert(!lesson.activities.some(x=>x.prompt.trim()===q.prompt.trim()),'Remediation repeats old prompt '+id);
 assert(q.type==='single_choice','Pilot follow-ups use deterministic choice '+id);
 assert(q.options.some(x=>x.id===q.answer.correct_option_id),'Missing followup correct answer '+id);
 assert.equal(new Set(q.options.map(x=>x.text.toLowerCase().trim())).size,q.options.length,'Duplicate followup options '+id);
 assert(q.explanation_en.length>30,'Missing followup explanation '+id);
}
assert(pilot.evidence_policy.hints_unscored&&pilot.evidence_policy.original_error_immutable);
assert(pilot.evidence_policy.followup_new_observation&&!pilot.evidence_policy.level_from_single_lesson);
assert(/uncertain/i.test(pilot.fallback_when_uncertain)||/several causes/i.test(pilot.fallback_when_uncertain));
console.log(JSON.stringify({result:'PASS',target:pilot.lesson_id,version:pilot.content_version,authoredHintPairs:coachingMap.size,distinctFollowups:remediation.size,uncertaintyGuard:true,sourceLearnerDataUntouched:true}));
