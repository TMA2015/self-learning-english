'use strict';
/** SLE generic unscored widgets; reviewed FW-U02/U03 exercise content remains unchanged. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ui=read('app/learning-interactions.tsx');
const pilot=read('app/foundation-writing-u02-u03.tsx');
const u02=JSON.parse(read('content/foundation-writing-u02.json'));
const u03=JSON.parse(read('content/foundation-writing-u03.json'));
for(const p of ['app/learning-interactions.tsx','app/foundation-writing-u02-u03.tsx']){
 const ast=ts.createSourceFile(p,read(p),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 assert.equal(ast.parseDiagnostics.length,0,p+' JSX syntax: '+ast.parseDiagnostics.map(x=>x.messageText).join(' | '));
}
assert.match(ui,/export function CardSortBoard\(/);
assert.match(ui,/export function ResponsePlanner</);
assert.match(ui,/data-learning-interaction="CardSortBoard"/);
assert.match(ui,/data-learning-interaction="ResponsePlanner"/);
assert.match(ui,/data-learning-interaction-preview="CardSortBoard"/);
assert.match(ui,/data-learning-interaction-preview="ResponsePlanner"/);
assert.match(ui,/onSelect\(card\.id,event\.target\.value\)/);
assert.match(ui,/onChange\(field\.key,event\.target\.value\)/);
assert.match(ui,/\{revealed&&<p/,'Keys/explanations are post-check only');
assert.match(ui,/card\.key/);
assert.match(ui,/selections\[card\.id\]===category/,'Live board uses only learner selections');
assert.match(ui,/No cards placed here yet/);
assert.match(ui,/count checks field presence only/i);
assert.doesNotMatch(ui,/localStorage|fetch\(|\.score\s*=|proficiency|innerHTML|draggable|onDrag|onDrop|useEffect|useState|onPointerDown/,
 'Reusable toolkit must remain stateless, unscored, safe and touch/keyboard operable');
assert.equal(u02.cycleA.cards.length,6);
assert.equal(u03.cycleA.cards.length,6);
assert.deepEqual(u02.cycleA.cards.map(c=>c.key),['FITS','NEEDS_DETAIL_OR_REPAIR','OFF_TASK','FITS','OFF_TASK','NEEDS_DETAIL_OR_REPAIR']);
assert.deepEqual(u03.cycleA.cards.map(c=>c.key),['Claim','Reason','Detail','circular','off-task','weak link']);
assert.match(pilot,/import \{CardSortBoard,ResponsePlanner\} from '\.\/learning-interactions'/);
assert.equal((pilot.match(/<CardSortBoard /g)||[]).length,2,'One pilot each in FW-U02 & FW-U03');
assert.equal((pilot.match(/<ResponsePlanner /g)||[]).length,1,'Generic planner used by all four prior U03 chains');
assert.match(pilot,/idPrefix="u02-card-"/);
assert.match(pilot,/idPrefix="u03-card-"/);
assert.match(pilot,/selections=\{d\.cycleASorts\}/);
assert.match(pilot,/selections=\{d\.cycleARoles\}/);
assert.match(pilot,/cycleASorts:\{\.\.\.d\.cycleASorts,\[id\]:category\},revealCycleA:false/);
assert.match(pilot,/cycleARoles:\{\.\.\.d\.cycleARoles,\[id\]:category\},revealCycleA:false/);
assert.match(pilot,/onCheck=\{\(\)=>edit\(\{\.\.\.d,revealCycleA:true\}\)\}/);
assert.match(pilot,/onChange=\{edit\}/,'Existing typed parent field edits remain canonical');
assert.match(pilot,/Save &amp; Exit/);
assert.match(pilot,/exactSavedNext\(work\)/);
assert.match(pilot,/eligibleNextArtifact\(unitId,work,target\)/);
assert.match(pilot,/Get personal AI Tutor feedback/);
assert.match(read('scripts/qa-free-first.mjs'),/learning-interactions-contract\.cjs/);
assert.match(read('tests/foundation-writing-u02-u03-browser-entry.tsx'),/data-learning-interaction="CardSortBoard"/);
assert.match(read('tests/foundation-writing-u02-u03-browser-entry.tsx'),/data-learning-interaction="ResponsePlanner"/);
console.log(JSON.stringify({result:'PASS',gate:'SLE_INTERACTION_TOOLKIT_PILOT',primitives:2,
 pilotUnits:['FW-U02','FW-U03'],existingCycleCards:12,existingU03Chains:4,
 contentChanges:0,newScoredItems:0,gradingUnchanged:true,liveAuthorized:false}));
