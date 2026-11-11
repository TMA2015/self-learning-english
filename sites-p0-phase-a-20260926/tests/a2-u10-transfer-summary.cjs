'use strict';
/**
 * NotebookLM R1 Design Option B: A2-U10 is existing three-lesson transfer,
 * never an additional assessed lesson or a CEFR mastery certificate.
 * Synthetic fixture only; no real learner files, player or device changed.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'domain/a2-u10-transfer-summary.ts'),'utf8');
const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const out=path.join(root,'.sites-runtime/a2-u10-transfer-summary.cjs');
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,output);
const {a2Unit10TransferSummary}=require(out);

const seed=require('../content/curriculum-1.21.0-candidate.json');
const ids=['REA-A2-08','LIS-A2-07','WRI-A2-07'];
const lessons=seed.lessons.filter(l=>ids.includes(l.id)).map(l=>({
 id:l.id,title:l.title,module:l.module
}));
assert.equal(lessons.length,3,'Use three already reviewed real A2-U10 source IDs');
const original=JSON.stringify(lessons);
const attempts=[
 {id:'read-old',lessonId:'REA-A2-08',createdAt:10,status:'scored',
  results:[{id:'R1',correct:false},{id:'R2',correct:true}]},
 {id:'read-new',lessonId:'REA-A2-08',createdAt:30,status:'scored',
  results:[{id:'R1',correct:true},{id:'R2',correct:true}]},
 {id:'read-new-draft',lessonId:'REA-A2-08',createdAt:45,status:'started',results:[]},
 {id:'listen-saved',lessonId:'LIS-A2-07',createdAt:40,status:'scored',
  results:[{id:'L1',correct:true},{id:'L2',correct:false},
   {id:'L2',correct:false},{id:'L3',correct:false,outcome:'format-only'},
   {id:'L4',correct:null}]},
 {id:'write-pending',lessonId:'WRI-A2-07',createdAt:41,status:'pending_review',
  results:[{id:'W1',correct:false}]},
 {id:'write-draft',lessonId:'WRI-A2-07',createdAt:50,status:'started'},
 {id:'fake',lessonId:'LIS-B1-99',createdAt:99,status:'scored',
  results:[{id:'F1',correct:false}]}
];
const before=JSON.stringify(attempts);
assert.equal(a2Unit10TransferSummary('A1-U10',lessons,attempts),null,
 'Review is scoped to A2-U10, not A1/B1 or every U10 by inference');
let summary=a2Unit10TransferSummary('A2-U10',lessons,attempts);
assert.equal(summary.available,3);
assert.equal(summary.total,3);
assert.deepEqual(summary.rows.map(x=>x.id),ids);
const [reading,listening,writing]=summary.rows;
assert.equal(reading.correct,2,'Latest saved retake supersedes old mistakes');
assert.equal(reading.checked,2);
assert.equal(reading.wrong,0);
assert.equal(reading.submitted,true);
assert.equal(reading.hasDraft,true,'New unfinished draft must not erase older saved result');
assert.equal(listening.checked,2,'Only actual saved objectively graded rows count');
assert.equal(listening.correct,1);
assert.equal(listening.wrong,1);
assert.equal(writing.checked,0,'Pending Writing must not be turned into an objective score');
assert.equal(writing.awaitingReview,true);
assert.equal(writing.submitted,true);
assert.equal(writing.hasDraft,true);
assert.equal(summary.nextLessonId,'LIS-A2-07','Review actual objective error first');
assert.match(summary.nextAction,/Review the explanation/);
assert.match(summary.boundary,/not an independent exam/);

const absent=a2Unit10TransferSummary('A2-U10',lessons.slice(0,2),attempts);
assert.equal(absent.available,2,'Device may have incomplete local curriculum import');
assert.equal(absent.rows[2].available,false);
assert.equal(absent.nextLessonId,null,'Do not open missing source');
assert.match(absent.nextAction,/not imported on this device/);
const empty=a2Unit10TransferSummary('A2-U10',lessons,[]);
assert.equal(empty.rows.every(r=>!r.submitted),true);
assert.equal(empty.nextLessonId,'REA-A2-08','Offer old lesson, not an invented checkpoint');
assert.doesNotMatch(empty.nextAction,/passed|mastered/i);

const cleared=a2Unit10TransferSummary('A2-U10',lessons,[
 ...attempts,{id:'listening-retake',lessonId:'LIS-A2-07',status:'scored',createdAt:60,
  results:[{id:'L1',correct:true},{id:'L2',correct:true}]}
]);
assert.equal(cleared.rows[1].wrong,0,'No persistent error after later checked correction');
assert.equal(cleared.nextLessonId,'WRI-A2-07');
assert.match(cleared.nextAction,/awaiting trusted review/);
const reviewed=a2Unit10TransferSummary('A2-U10',lessons,[
 ...attempts,{id:'write-approved',lessonId:'WRI-A2-07',status:'approved',createdAt:80,
  results:[{id:'W1',correct:true}]},
 {id:'listen-cleared',lessonId:'LIS-A2-07',createdAt:90,status:'scored',
  results:[{id:'L1',correct:true}]}
]);
assert.equal(reviewed.rows[2].checked,0,
 'Even adult-reviewed Writing must not be auto-scored by this read-only panel');
assert.equal(reviewed.rows[2].awaitingReview,false);
assert.match(reviewed.nextAction,/does not certify mastery/);
assert.equal(JSON.stringify(lessons),original,'Imported course objects cannot be changed');
assert.equal(JSON.stringify(attempts),before,'Attempt objects cannot be changed');
assert.doesNotMatch(source,/fetch\(|localStorage|setItem\(|putAttempt|saveAttempt|createAttempt|Gemini|requestWritingAI/);

const ui=fs.readFileSync(path.join(root,'app/unit-browser.tsx'),'utf8');
const nav=fs.readFileSync(path.join(root,'domain/unit-guide-60.ts'),'utf8');
const runner=fs.readFileSync(path.join(root,'scripts/qa-free-first.mjs'),'utf8');
assert(ui.includes("selected?.id==='A2-U10'"),
 'Only reviewed A2 pilot gets this summary; no fake U10 mastery across levels');
assert(ui.includes('A2-U10 transfer learning review'),'Real existing Unit detail, no new page');
assert(ui.includes('a2Unit10TransferSummary(selected.id,selected.lessons,attempts)'));
assert(ui.includes('onOpenLesson(item.id,latest)'),
 'Existing version-pinned player navigation and resume retained');
assert(nav.includes('...primaryAssignments.confirmed_v121'),
 'Approved original Unit10 crosswalk retained');
assert(runner.includes('"a2-u10-transfer-summary.cjs"'),'Mandatory full regression registration');
console.log(JSON.stringify({result:'PASS',gate:'A2-U10-NotebookLM-Option-B-read-only-summary',
 existingLessonIds:ids,latestRetakeOnly:true,pendingWritingUnscored:true,
 noExtraLesson:true,noNewAudio:true,scoreWrites:0,productionWrites:0,
 realSafariIpad:'NOT_TESTED'}));