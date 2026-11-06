'use strict';
// Authoring draft integrity: this does not replace independent NotebookLM review.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const file=require('../content/batches/v120-c1c2-first-pilot-draft.json');
const packet=fs.readFileSync(path.join(root,'content/review-packets/SLE_C1C2_FIRST_PILOT_NOTEBOOKLM_REVIEW_20261104.md'),'utf8');
const base=require('../content/curriculum-1.18.1-candidate.json');
const oldIds=new Set(base.lessons.map(l=>l.id));
assert.equal(file.status,'ACADEMIC_REVIEW_PENDING');
assert.equal(file.lessons.length,2);
assert.deepEqual(file.lessons.map(l=>l.id),['REA-C1-01','VOC-C2-01']);
assert.deepEqual(file.lessons.map(l=>l.cefr_target),['C1','C2']);
for(const lesson of file.lessons){
 assert(!oldIds.has(lesson.id),'new ID must not collide with historical lesson');
 assert(lesson.objectives.length>=2&&lesson.examples.length>=2);
 assert(lesson.explanation.en.includes('CORE 1'));
 assert(lesson.explanation.en.includes('WORKED DEMONSTRATION'));
 assert(lesson.explanation.en.includes('UNSCORED TRANSFER'));
 assert(lesson.questions.length===8);
 assert(packet.includes('### '+file.lessons.indexOf(lesson)+'.')===false||packet.includes(lesson.id));
 assert(packet.includes(lesson.explanation.en));
 if(lesson.module==='reading')assert(lesson.reading_asset?.body.length>1800);
 for(let i=0;i<lesson.questions.length;i++){
  const q=lesson.questions[i],id=lesson.id+'-Q'+(i+1);
  assert.equal(q.type,'single_choice');
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options).size,4);
  assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
  assert(q.tag.startsWith(lesson.module+'.'));
  assert(q.why.length>50&&q.next.length>20);
  assert(packet.includes(id));
  assert(packet.includes(q.stem));
  assert(packet.includes(q.options[q.answer]));
  assert(packet.includes(q.why));
  assert(packet.includes(q.next));
 }
}
assert.equal(file.lessons.reduce((n,l)=>n+l.questions.length,0),16);
assert(!packet.includes('PACKET VERDICT: PASS'),'review packet must not self-certify');
console.log(JSON.stringify({result:'PASS',gate:'C1C2-academic-draft-source-integrity',
 lessons:2,objectiveItems:16,reviewPacketComplete:true,
 academicVerdict:'PENDING_NOTEBOOKLM',productionRelease:false}));
