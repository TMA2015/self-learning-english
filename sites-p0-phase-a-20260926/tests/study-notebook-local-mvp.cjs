'use strict';
/** Study Notebook: independently persisted unscored notes/cards. No learner storage writes. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),output=path.join(root,'.sites-runtime','study-notebook-test');
const files=[
 ['domain/study-notebook.ts','domain/study-notebook.js'],
 ['infrastructure/browser/study-notebook-storage.ts','infrastructure/browser/study-notebook-storage.js']
];
for(const [src,dest] of files){
 const text=fs.readFileSync(path.join(root,src),'utf8');
 const cjs=ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const file=path.join(output,dest);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,cjs);
}
const model=require(path.join(output,'domain/study-notebook.js'));
const io=require(path.join(output,'infrastructure/browser/study-notebook-storage.js'));
const contentPaths=[
 'reference-library-pilot-v1.json',
 'reference-library-v2-wave1-reviewed.json',
 'reference-library-v2-writing-connectors-wave2-reviewed.json',
 'reference-library-v2-irregular-candidate.json',
 'reference-library-v2-grammar-writing-reviewed.json',
 'reference-library-v3-cross-skill-reviewed.json',
 'reference-library-v4-degree-usage-reviewed.json'
];
const datasets=contentPaths.map(x=>JSON.parse(fs.readFileSync(path.join(root,'content',x),'utf8')));
const all=[
 ...datasets[0].entries,...datasets[1].entries.filter(e=>e.kind!=='irregular_verbs'),
 ...datasets[2].entries,...datasets[3].new_entries,...datasets[4].entries,
 ...datasets[5].entries,...datasets[6].entries
];
assert.equal(all.length,364);
const ids=new Set(all.map(e=>e.id));assert.equal(ids.size,364);
assert(all.every(x=>model.isReferenceId(x.id)),'Every reviewed source ID should be importable');
const t='2026-11-21T09:00:00.000Z',t2='2026-11-21T09:01:00.000Z';
function fakeStore(){
 const map=new Map([
  ['g-learning:english:v1:owner:local-family:learner:primary:state','{"historic":"keep"}'],
  ['g-learning:english:v1:academic:packages','{"immutable":true}'],
  ['g-learning:math:v1:safe','MATH-FOREVER']
 ]);
 const writes=[];return {
  map,writes,
  getItem(k){return map.has(k)?map.get(k):null},
  setItem(k,v){writes.push(k);map.set(k,v)}
 };
}
const store=fakeStore();
let a=io.loadStudyNotebook(store);
assert.deepEqual(a,model.emptyStudyNotebook());
assert.equal(store.writes.length,0,'Reads never write');
a=model.saveReviewedReference(a,'REF4-DEG-001',ids);assert.equal(a.cards.length,1);
a=io.persistStudyNotebook(store,a);
assert.equal(a.revision,1);
let dupe=model.saveReviewedReference(a,'REF4-DEG-001',ids);
assert.strictEqual(dupe,a,'Do not create a duplicate review record');
assert.throws(()=>model.saveReviewedReference(a,'REF-UNKNOWN-01',ids),/Only an existing/);
assert.throws(()=>model.saveReviewedReference(a,'../../bad',ids),/Only an existing/);
a=io.persistStudyNotebook(store,model.saveReviewedReference(a,'REF2-IRR-001',ids));
assert.equal(a.cards.length,2);
a=io.persistStudyNotebook(store,model.markReview(a,'REF4-DEG-001','again',t));
assert.deepEqual(a.cards.find(c=>c.referenceId==='REF4-DEG-001'),{
 referenceId:'REF4-DEG-001',reviews:1,againCount:1,lastChoice:'again',lastReviewedAt:t
});
a=io.persistStudyNotebook(store,model.markReview(a,'REF4-DEG-001','practised',t2));
assert.equal(a.cards[0].reviews,2);
assert.equal(a.cards[0].againCount,1);
assert.equal(a.cards[0].lastChoice,'practised');
assert.throws(()=>model.markReview(a,'REF3-LIS-001','again',t),/not been saved/);
assert.throws(()=>model.markReview(a,'REF4-DEG-001','incorrect',t),/Unknown review/);
const note={id:'study-note-abc123',referenceId:'REF4-DEG-001',text:'My own example is not a quiz key.'};
a=io.persistStudyNotebook(store,model.upsertStudyNote(a,note,t,ids));
assert.equal(a.notes.length,1);
a=io.persistStudyNotebook(store,model.upsertStudyNote(a,{...note,text:'I revised this note.'},t2,ids));
assert.equal(a.notes.length,1,'Edit updates existing stable note id');
assert.equal(a.notes[0].text,'I revised this note.');
assert.throws(()=>model.upsertStudyNote(a,{...note,text:'x'.repeat(1501)},t,ids),/1,500/);
assert.throws(()=>model.upsertStudyNote(a,{...note,referenceId:'REF4-NOT-999'},t,ids),/unavailable/);
a=io.persistStudyNotebook(store,model.removeReviewCard(a,'REF4-DEG-001'));
assert.equal(a.notes.length,1,'Removing card must preserve linked learner note');
assert.equal(a.cards.length,1);
a=io.persistStudyNotebook(store,model.deleteStudyNote(a,note.id));
assert.equal(a.notes.length,0);
assert.equal(io.loadStudyNotebook(store).revision,a.revision,'Reload must retain exact version');
const exported=JSON.parse(io.exportStudyNotebookJSON(store));
assert.equal(exported.schemaVersion,1);
assert.equal(exported.format,model.STUDY_NOTEBOOK_FORMAT);
assert(!('evidence' in exported)&&!('learnerId' in exported)&&!('academicRecords' in exported),
 'Separate JSON export must never claim to back up learner attempts');
assert.equal(store.map.get('g-learning:english:v1:owner:local-family:learner:primary:state'),'{"historic":"keep"}');
assert.equal(store.map.get('g-learning:english:v1:academic:packages'),'{"immutable":true}');
assert.equal(store.map.get('g-learning:math:v1:safe'),'MATH-FOREVER');
assert(store.writes.every(k=>k===io.STUDY_NOTEBOOK_KEY),'Only dedicated Study Notebook key may be written');

// Stale revision fails with no accidental write.
const before=store.writes.length;
assert.throws(()=>io.persistStudyNotebook(store,{...a,revision:a.revision+2}),/changed since loading/);
assert.equal(store.writes.length,before);
// Corrupt, oversize and unknown schema must fail closed.
for(const invalid of ['{not-json','{"format":"g-learning-english.study-notebook","schemaVersion":2}',JSON.stringify({...a,notes:[{id:'bad',text:''}]})]){
 const test=fakeStore();test.map.set(io.STUDY_NOTEBOOK_KEY,invalid);
 assert.throws(()=>io.loadStudyNotebook(test));
 assert.equal(test.writes.length,0);
}
// Existing recovery marker is a blocker, not a deletion instruction.
const recovering=fakeStore();
recovering.map.set('g-learning:english:v1:recovery-pending-v2','{"stage":"awaiting"}');
assert.throws(()=>io.loadStudyNotebook(recovering),/Recovery pending/);
assert.throws(()=>io.persistStudyNotebook(recovering,model.emptyStudyNotebook()),/Recovery pending|changed/);
assert.equal(recovering.writes.length,0);
// Simulated quota failure must leave original saved bytes untouched.
const quota=fakeStore();
quota.map.set(io.STUDY_NOTEBOOK_KEY,JSON.stringify(a));
const original=quota.map.get(io.STUDY_NOTEBOOK_KEY);
quota.setItem=(k,v)=>{throw new Error('QuotaExceededError')};
assert.throws(()=>io.persistStudyNotebook(quota,model.saveReviewedReference(a,'REF4-LIS-002',ids)),/NOT saved/);
assert.equal(quota.map.get(io.STUDY_NOTEBOOK_KEY),original);
// Wrong document/duplicate note/card IDs must not be treated as a valid record.
assert(!model.isStudyNotebook({...a,cards:[a.cards[0],a.cards[0]]}));
assert(!model.isStudyNotebook({...a,notes:[{id:'nota-note-01',referenceId:null,text:'x',updatedAt:'nonsense'}]}));
// The new UI must not change existing release or learning data.
const ui=fs.readFileSync(path.join(root,'app/study-notebook.tsx'),'utf8');
const home=fs.readFileSync(path.join(root,'app/home-client.tsx'),'utf8');
const ref=fs.readFileSync(path.join(root,'app/reference-library.tsx'),'utf8');
assert(ui.includes('Study Notebook')&&ui.includes('Reveal explanation'));
assert(ui.includes('Again')&&ui.includes('Practised')&&ui.includes('Save note'));
assert(ui.includes('not synced between your iPad and desktop')&&ui.includes('Import/restore is not yet supported'));
assert(ref.includes('export {ENTRIES as REFERENCE_ENTRIES}')&&ref.includes('onSaveForReview'));
assert((ref.match(/<SaveForReview entry=\{entry\}\/>/g)||[]).length===9,
 'All nine families of reference renderers must surface a save button');
assert(home.includes('study-notebook')&&home.includes('saveReferenceForReview'));
assert(!/await saveLearnerState|setLearnerState|saveAcademicAttempt|updateEvidence/.test(ui),
 'Study Notebook may never touch graded/learner save paths');
console.log(JSON.stringify({result:'PASS',gate:'STUDY_NOTEBOOK_LOCAL_MVP',
 reviewedRefs:364,separateStorageKey:true,atomicSaveFailure:true,recoveryFailClosed:true,
 unknownVersionFailClosed:true,quotaPreservesOldData:true,notesCrud:true,
 manualFlashcardReview:true,legacyWrites:0,academicScoring:0,realSafari:'NOT_TESTED'}));
