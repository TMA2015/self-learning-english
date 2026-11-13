'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'domain/writing-week2-interactive.ts'), 'utf8');
const transpiled = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},reportDiagnostics:true});
assert.equal((transpiled.diagnostics||[]).length,0,'Week 2 helper transpiles');
const mod = {exports:{}};
new Function('exports','module','require',transpiled.outputText)(mod.exports,mod,require);
const d = mod.exports;
let count=0;
function check(name,run) {run(); count++; console.log('PASS '+name);}
check('Empty ideas yield safe empty cards',()=>{
  assert.deepEqual(d.readIdeaLines(''),{safe:true,lines:[]});
});
check('Flat ideas stay in canonical ordering',()=>{
  assert.deepEqual(d.readIdeaLines('alpha\nbeta'),{safe:true,lines:['alpha','beta']});
});
check('Complex legacy notes cannot be silently converted',()=>{
  for(const s of ['alpha\n\nbeta','alpha\r\nbeta','  alpha\nbeta','alpha\n']) assert.equal(d.readIdeaLines(s).safe,false);
});
check('Adding to a legacy draft preserves all original bytes',()=>{
  assert.equal(d.addWeek2Idea('  alpha\n\nbeta','gamma'),'  alpha\n\nbeta\ngamma');
});
check('Single idea added into empty or simple draft',()=>{
  assert.equal(d.addWeek2Idea('','alpha'),'alpha');
  assert.equal(d.addWeek2Idea('alpha','beta'),'alpha\nbeta');
});
check('Explicit card edits, moves and removal affect only intended line',()=>{
  assert.equal(d.editWeek2Idea('alpha\nbeta',0,'gamma'),'gamma\nbeta');
  assert.equal(d.moveWeek2Idea('alpha\nbeta',0,1),'beta\nalpha');
  assert.equal(d.removeWeek2Idea('alpha\nbeta',1),'alpha');
});
check('Invalid card mutations do not corrupt legacy drafts',()=>{
  assert.throws(()=>d.removeWeek2Idea('alpha\n\nbeta',0),/legacy notes|complex/);
  assert.throws(()=>d.moveWeek2Idea('alpha',0,1),/cannot move/);
  assert.throws(()=>d.editWeek2Idea('alpha',2,'beta'),/Invalid idea/);
});
check('Canonical Week 2 scored questions and field shapes are untouched',()=>{
  const canonical=fs.readFileSync(path.join(root,'domain/writing-course-v2-b.ts'),'utf8');
  for(let i=1;i<=4;i++)assert(canonical.includes('item(2,'+i+','));
  for(const key of ['ideas','reject','best','fit'])assert(canonical.includes("key:'"+key+"'"));
  assert(canonical.includes('proficiencyWeight:0'));
});
check('React integration remains scoped to Week 2, Gemini not activated for Week 2',()=>{
  const app=fs.readFileSync(path.join(root,'app/writing-course-v2-b.tsx'),'utf8');
  const ui=fs.readFileSync(path.join(root,'app/writing-week2-interactive.tsx'),'utf8');
  for(const name of ['Week2InteractiveLearn','Week2PracticeSort','Week2IdeaWorkspace','Week2SavedVersionComparison','Week2TransferPractice'])
    assert(app.includes('week===2')&&app.includes('<'+name));
  assert(app.includes("week===2?<p className=\"notice\""));
  assert(!ui.includes('fetch(')&&!ui.includes('localStorage')&&!ui.includes('sessionStorage'));
  const output=ts.transpileModule(ui,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},reportDiagnostics:true});
  assert.equal((output.diagnostics||[]).length,0,'Week 2 React component transpiles');
});
check('Unscored idea classifications and live map remain session-only',()=>{
  const ui=fs.readFileSync(path.join(root,'app/writing-week2-interactive.tsx'),'utf8');
  for(const phrase of [
    'provisional judgement (this visit only, not saved)',
    'My live idea map',
    'Process coach',
    'This map reflects your own words',
    'No completed saved versions to compare'
  ]) assert(ui.includes(phrase),phrase);
  assert(ui.includes('setSessionLabels'));
  assert(!ui.includes("onEdit('sessionLabels'"));
  assert(!ui.includes('localStorage')&&!ui.includes('sessionStorage'));
});
check('New Week 2 guidance remains honest about evidence and transfer',()=>{
  const ui=fs.readFileSync(path.join(root,'app/writing-week2-interactive.tsx'),'utf8');
  assert(ui.includes('unscored self-practice'));
  assert(ui.includes('These optional scratchpad notes are not saved'));
  assert(ui.includes('does not automatically score the meaning'));
  const core=fs.readFileSync(path.join(root,'domain/writing-course-v2-b.ts'),'utf8');
  assert(core.includes("contentVersion:'wcv2-b.1'"));
  assert(core.includes('evidenceWeight:0,proficiencyWeight:0'));
});
console.log(JSON.stringify({result:'PASS',checks:count,scope:'Week 2 interactive deterministic contract'}));
