// Batch 03 source-only review gate. Passing this does not constitute independent language review.
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'..');
const text=p=>fs.readFileSync(path.join(base,p),'utf8');
const json=p=>JSON.parse(text(p));
const live=json('content/releases/curriculum-1.2.0-production-import.json');
const next=json('content/curriculum-1.3.0-candidate.json');
const grammar=json('content/batches/batch03-grammar.json');
const other=json('content/batches/batch03-lexical-reading-writing.json');
const review=json('content/reviews/batch03-reading-evidence.json');
const map=json('content/curriculum-coverage-1.3.0-candidate.json');
const groups=json('content/lesson-groups-1.3.0-candidate.json');
const academic=text('domain/academic.ts');
const reconciled=json('content/reviews/batch03-round1-reconciliation.json');
const retest=json('content/reviews/batch03-independent-retest-packet-v2.json');
const tags=new Set([...academic.matchAll(/'([a-z]+\.[a-z_]+)'\s*:/g)].map(m=>m[1]));
const norm=s=>s.toLowerCase().trim().replace(/[’]/g,"'").replace(/\s+/g,' ').replace(/[.!?]+$/g,'');
const expected=['GRA-A1-07','GRA-A2-02','GRA-A2-03','GRA-A2-04','VOC-A2-02','REA-A1-03','WRI-A1-03'];
assert.equal(live.schema_version,'1.2.0');
assert.equal(next.schema_version,'1.3.0');
assert.equal(next.package_id,live.package_id);
assert.equal(next.status,'curriculum_batch03_corrected_candidate_pending_independent_retest');
assert.equal(live.lessons.length,29);
assert.equal(live.lessons.flatMap(x=>x.activities).length,190);
assert.equal(next.lessons.length,36);
const added=[...grammar.lessons,...other.lessons];
assert.deepEqual(new Set(added.map(x=>x.id)),new Set(expected));
assert.equal(added.length,7);
assert.deepEqual(reconciled.original_counts,{PASS:37,REVISE:18,BLOCK:6});
assert.equal(reconciled.correction_count,24);
assert.equal(reconciled.items.length,24);
assert.equal(new Set(reconciled.items.map(x=>x.item_id)).size,24);
assert.equal(reconciled.items.filter(x=>x.round1_verdict==='BLOCK').length,6);
assert.equal(reconciled.items.filter(x=>x.round1_verdict==='REVISE').length,18);
assert.equal(retest.review_status,'PENDING_INDEPENDENT_RETEST_NO_IMPORT');
const packetItems=retest.lessons.flatMap(x=>x.items);
assert.equal(packetItems.length,61);
assert.equal(packetItems.filter(x=>x.requires_retest).length,24);
const packetById=new Map(packetItems.map(x=>[x.id,x]));
for(const l of added)for(const q of l.activities) {
 assert.deepEqual(Object.fromEntries(Object.entries(packetById.get(q.id)).filter(([k])=>!['round1_verdict','author_action','requires_retest','review_verdict'].includes(k))),q,'Round2 packet/candidate drift '+q.id);
 assert.equal(packetById.get(q.id).requires_retest,reconciled.items.some(x=>x.item_id===q.id),'Unflagged change '+q.id);
}
assert.ok(reconciled.items.every(x=>x.current_status==='CORRECTED_AWAITING_INDEPENDENT_RETEST'));
assert.equal(reconciled.restrictions.live_import_permitted,false);
assert.equal(added.reduce((s,l)=>s+l.activities.length,0),61);
assert.equal(next.lessons.flatMap(x=>x.activities).length,251);
assert.equal(new Set(next.lessons.map(x=>x.id)).size,36);
const priorById=new Map(live.lessons.map(l=>[l.id,l]));
const nextById=new Map(next.lessons.map(l=>[l.id,l]));
for(const [id,lesson] of priorById)assert.deepEqual(nextById.get(id),lesson,'Prior production lesson mutated: '+id);
for(const lesson of added)assert.deepEqual(nextById.get(lesson.id),lesson,'Batch authoring file/candidate drift: '+lesson.id);
assert.deepEqual(next.rubrics,live.rubrics,'Rubrics changed unexpectedly');
assert.deepEqual(next.integrated_journey,live.integrated_journey,'Starter route changed unexpectedly');
assert.deepEqual(next.import_contract,live.import_contract,'Versioned import contract changed unexpectedly');
assert.deepEqual(next.review_policy,live.review_policy,'Review policy changed unexpectedly');
const oldRoute=next.course.sequence.filter(id=>priorById.has(id));
assert.deepEqual(oldRoute,live.course.sequence,'Older relative course order changed');
assert.deepEqual(new Set(next.course.sequence),new Set(next.lessons.map(l=>l.id)));
assert.equal(next.course.sequence.length,36);
const before=(a,b)=>assert.ok(next.course.sequence.indexOf(a)<next.course.sequence.indexOf(b),a+' should precede '+b);
for(const [a,b] of [['GRA-A1-07','VOC-A1-03'],['REA-A1-03','WRI-A1-02'],['WRI-A1-03','WRI-A2-02'],['GRA-A2-02','GRA-B1-01'],['GRA-A2-03','WRI-A2-01'],['VOC-A2-02','REA-A2-03']])before(a,b);
const allIds=new Set();
let objective=0,open=0,mcq=0,short=0;
for(const l of added){
 assert.ok(['A1','A2'].includes(l.cefr_target));
 assert.ok(l.objectives.length>=2&&l.objectives.length<=5);
 assert.ok(l.explanation.en.length>=100&&l.explanation.vi.length>=35);
 assert.ok(l.examples.length>=4&&l.activities.length>=5&&l.activities.length<=10);
 for(const q of l.activities){
  assert.ok(q.id.startsWith(l.id+'-Q')&&!allIds.has(q.id),q.id+' duplicate/wrong ID');allIds.add(q.id);
  assert.ok(q.prompt.length>15);
  assert.ok(q.skill_tags.length&&q.skill_tags.every(t=>tags.has(t)&&t.startsWith(l.module+'.')),q.id+' unknown tag');
  assert.ok((q.feedback.explanation_en||q.feedback.pending_message||'').length>=25,q.id+' short feedback');
  if(q.type==='single_choice'){
   mcq++;objective++;assert.equal(q.options.length,4,q.id);
   assert.equal(new Set(q.options.map(o=>o.id)).size,4,q.id);
   assert.equal(new Set(q.options.map(o=>norm(o.text))).size,4,q.id+' duplicate distractor');
   assert.ok(q.options.some(o=>o.id===q.answer.correct_option_id),q.id+' invalid key');
   assert.equal(q.evidence_weight,1,q.id);
  }else if(q.type==='short_answer'){
   short++;objective++;assert.ok(q.prompt.includes('___'),q.id+' no blank');
   assert.ok(q.answer.accepted_answers.length>0,q.id);
   assert.equal(new Set(q.answer.accepted_answers.map(norm)).size,q.answer.accepted_answers.length,q.id);
   assert.deepEqual(q.answer.normalization,['trim','casefold','collapse_spaces','strip_terminal_punctuation'],q.id);
   assert.equal(q.evidence_weight,1,q.id);
  }else{
   assert.equal(q.type,'extended_response',q.id);open++;
   assert.equal(q.answer,null,q.id);assert.equal(q.evidence_weight,0,q.id);
   assert.ok(next.rubrics[q.rubric_id],q.id);
   assert.equal(q.word_range_guidance.not_a_quality_score,true,q.id);
   assert.equal(q.review_mode,'assisted_ai_or_human',q.id);
  }
 }
}
assert.equal(mcq,38);assert.equal(short,22);assert.equal(open,1);assert.equal(objective,60);
const reading=nextById.get('REA-A1-03');
const refs=review.lesson_evidence['REA-A1-03'];
assert.equal(reading.reading_asset.display_to_learner,true);
assert.ok(reading.reading_asset.body.length>=400);
assert.deepEqual(new Set(Object.keys(refs)),new Set(reading.activities.map(a=>a.id)));
for(const [id,quote] of Object.entries(refs))assert.ok(reading.reading_asset.body.includes(quote),id+': quote missing');
assert.equal(added.find(l=>l.module==='writing').activities.filter(q=>q.type==='extended_response').length,1);
// Round-1 BLOCK regression: never auto-mark unconstrained natural English as incorrect.
const item=id=>added.flatMap(l=>l.activities).find(q=>q.id===id);
assert.ok(item('GRA-A1-07-Q4').prompt.includes('with can'));
assert.ok(item('GRA-A2-03-Q4').prompt.includes('some or any'));
assert.ok(item('GRA-A2-03-Q6').prompt.includes('some or any'));
assert.ok(item('GRA-A2-03-Q10').prompt.includes('some or any'));
assert.ok(item('VOC-A2-02-Q2').prompt.includes('pack or book'));
assert.ok(item('REA-A1-03-Q4').prompt.includes('alternative to taking the bus'));
assert.deepEqual(item('REA-A1-03-Q6').skill_tags,['reading.detail']);
assert.ok(item('REA-A1-03-Q4').feedback.explanation_en.includes('does not confirm'));
assert.ok(item('GRA-A2-03-Q10').feedback.explanation_en.includes('not proof'));
assert.deepEqual(item('GRA-A2-02-Q2').answer.accepted_answers,["didn't watch","did not watch"]);
assert.equal(groups.source_content_version,'1.3.0');
const assigned=new Set();
for(const [mod,rows] of Object.entries(groups.groups)){for(const row of rows){
 assert.ok(row.title.en&&row.title.vi&&row.lesson_ids.length);
 for(const id of row.lesson_ids){assert.ok(!assigned.has(id),id+' duplicate group');assert.equal(nextById.get(id)?.module,mod,id+' wrong group');assigned.add(id)}
}}
assert.equal(assigned.size,36);
assert.equal(map.content_candidate_version,'1.3.0');
assert.equal(map.nodes.length,36);
assert.equal(map.known_gaps.length,3);
assert.ok(map.known_gaps.every(x=>x.priority==='audio_dependency'),'Unblocked content gap remains');
assert.deepEqual(new Set(map.nodes.map(x=>x.lesson_id)),new Set(next.lessons.map(x=>x.id)));
assert.equal(new Set(map.nodes.map(x=>x.lesson_id)).size,36);
for(const node of map.nodes)assert.ok(node.prerequisite_lesson_ids.every(id=>nextById.has(id)),node.lesson_id+' unknown dependency');
assert.ok(Buffer.byteLength(JSON.stringify(next),'utf8')<1000000);
console.log(JSON.stringify({result:'PASS',version:next.schema_version,priorLessonsPreserved:29,addedLessons:7,addedActivities:61,objectiveActivities:objective,reviewRequired:open,totalLessons:36,totalActivities:251,readingEvidenceLinks:Object.keys(refs).length,groupedLessons:assigned.size,round1ResolvedPendingRetest:24,independentAcademicReview:'RETEST PENDING',liveImport:'NOT PERFORMED'}));
