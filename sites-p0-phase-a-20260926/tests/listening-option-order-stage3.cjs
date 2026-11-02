// Directly exercise production option-order.ts with deterministic randomizers.
// This is local Node QA; a physical browser check remains a separate gate.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const source=fs.readFileSync(path.join(__dirname,'../domain/option-order.ts'),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
class AcademicError extends Error{}
function compareVersions(a,b){const aa=a.split('.').map(Number),bb=b.split('.').map(Number);for(let i=0;i<3;i++){if(aa[i]!==bb[i])return aa[i]-bb[i];}return 0;}
const m={exports:{}};
vm.runInNewContext(compiled,{module:m,exports:m.exports,require:name=>{
 assert.equal(name,'./academic','Unexpected import from option-order.ts');
 return {AcademicError,compareVersions};
}}, {timeout:2000});
const {createOptionOrder,validateOptionOrder,orderedOptions,optionOrderEnabled}=m.exports;
const lessons=require('../content/curriculum-1.18.1-candidate.json').lessons;
const activities=lessons.find(l=>l.id==='LIS-A1-01').activities;
assert.equal(activities.length,10);
assert(activities.every(q=>q.type==='single_choice'&&q.answer.correct_option_id==='A'));
assert.equal(optionOrderEnabled('1.18.1'),true);
assert.equal(optionOrderEnabled('1.16.0'),false);
const unchanged=createOptionOrder(activities,n=>n-1);
const permuted=createOptionOrder(activities,()=>0);
validateOptionOrder(activities,{version:'1.18.1',optionOrder:unchanged});
validateOptionOrder(activities,{version:'1.18.1',optionOrder:permuted});
let modified=0;
for(const q of activities){
 const sourceIds=q.options.map(o=>o.id);
 const unchangedIds=orderedOptions(q,{optionOrder:unchanged}).map(o=>o.id);
 const changedIds=orderedOptions(q,{optionOrder:permuted}).map(o=>o.id);
 assert.equal(JSON.stringify(unchangedIds),JSON.stringify(sourceIds));
 assert.equal(new Set(changedIds).size,sourceIds.length);
 assert.equal(JSON.stringify([...changedIds].sort()),JSON.stringify([...sourceIds].sort()));
 if(JSON.stringify(changedIds)!==JSON.stringify(sourceIds))modified++;
 assert.equal(q.options.find(o=>o.id===q.answer.correct_option_id).text,
   orderedOptions(q,{optionOrder:permuted}).find(o=>o.id===q.answer.correct_option_id).text);
}
assert(modified>0,'Deterministic shuffle did not change any displayed question');
assert.throws(()=>validateOptionOrder(activities,{version:'1.18.1'}),/option order is unavailable/);
const broken=JSON.parse(JSON.stringify(permuted));
broken.questions[activities[0].id]=['INVALID'];
assert.throws(()=>validateOptionOrder(activities,{version:'1.18.1',optionOrder:broken}),/option order is invalid/);
console.log(JSON.stringify({result:'PASS',lesson:'LIS-A1-01',items:activities.length,changedOrders:modified,sourceKeysPreserved:true,note:'Actual browser playback/refresh QA not performed'}));
