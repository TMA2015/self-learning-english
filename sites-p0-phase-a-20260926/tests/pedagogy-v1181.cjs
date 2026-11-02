// Stage 3 academic pilot: released curriculum remains immutable; only approved
// learner-visible Reading/Vocabulary notes change in the v1.18.1 candidate.
const assert=require('node:assert/strict');
const original=require('../content/curriculum-1.18.0-candidate.json');
const next=require('../content/curriculum-1.18.1-candidate.json');

assert.equal(original.schema_version,'1.18.0');
assert.equal(next.schema_version,'1.18.1');
assert.equal(original.lessons.length,109);
assert.equal(next.lessons.length,109);
const total=source=>source.lessons.reduce((sum,lesson)=>sum+lesson.activities.length,0);
assert.equal(total(original),913);
assert.equal(total(next),913);
assert.deepEqual(Object.keys(next).sort(),Object.keys(original).sort());
for(const key of Object.keys(original).filter(key=>key!=='schema_version'&&key!=='lessons')){
 assert.deepEqual(next[key],original[key],`Top-level content changed: ${key}`);
}
const allowed=new Set(['REA-A1-01','VOC-A1-01']);
const changed=[];
for(let i=0;i<original.lessons.length;i++){
 const previous=original.lessons[i],candidate=next.lessons[i];
 assert.equal(candidate.id,previous.id,`Lesson order changed at ${i}`);
 assert.deepEqual(candidate.activities,previous.activities,`Assessment changed in ${candidate.id}`);
 if(!allowed.has(candidate.id)){
  assert.deepEqual(candidate,previous,`Unapproved lesson changed: ${candidate.id}`);
  continue;
 }
 for(const key of Object.keys(previous).filter(key=>!['objectives','explanation','examples'].includes(key))){
  assert.deepEqual(candidate[key],previous[key],`Restricted field changed: ${candidate.id}.${key}`);
 }
 assert.notDeepEqual(candidate.examples,previous.examples,`Legacy examples are still present: ${candidate.id}`);
 changed.push(candidate.id);
}
assert.deepEqual(changed.sort(),[...allowed].sort());
const reading=next.lessons.find(l=>l.id==='REA-A1-01');
const vocabulary=next.lessons.find(l=>l.id==='VOC-A1-01');
assert(reading.examples.join(' ').includes('guitar group'));
assert(!/room 12|wednesday|saving water|bring paint/i.test(reading.examples.join(' ')),
 'Reading worked demonstration leaks Art Club quiz specifics');
assert(vocabulary.examples.join(' ').includes('check the timetable'));
assert(vocabulary.examples.join(' ').includes('hand in a form'));
assert(!/borrow a book|could you repeat|do homework|school canteen|ruler/i.test(vocabulary.examples.join(' ')),
 'Vocabulary worked toolkit leaks current quiz stems');
assert(/optional helper/.test(reading.explanation.en));
console.log(JSON.stringify({result:'PASS',pilot:'pedagogy-v1181',lessons:109,activities:913,updated:changed,preservedActivities:913}));
