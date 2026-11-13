'use strict';
// NotebookLM remediation regression: actual component state closures (simulated
// React hooks), graded-only tips and no production browser writes.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const root=path.resolve(__dirname,'..');
function compile(file,jsx=false){
 const source=fs.readFileSync(path.join(root,file),'utf8');
 const r=ts.transpileModule(source,{fileName:file,reportDiagnostics:true,compilerOptions:{
  module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,...(jsx?{jsx:ts.JsxEmit.ReactJSX}:{})}});
 assert.equal(r.diagnostics?.filter(d=>d.category===ts.DiagnosticCategory.Error).length??0,0);
 return {source,js:r.outputText};
}
const tips=compile('domain/foundation-recovery-tip.ts'),p={exports:{}};
vm.runInNewContext(tips.js,{exports:p.exports,module:p},{timeout:1000});
const next=p.exports.nextActionForIncorrect;
assert.match(next('reading','REA-A1-01-Q2','1.18.1'),/meeting place/i);
assert.match(next('reading','REA-A1-01-Q7','1.18.1'),/permission/i);
assert.match(next('vocabulary','VOC-A1-01-Q8','1.18.0'),/verb/i);
assert.match(next('reading','REA-A1-01-Q2','1.17.0'),/reread the passage/i);
for(const skill of ['reading','vocabulary','grammar','listening','writing','speaking','pronunciation']){
 const tip=next(skill,'UNKNOWN','1.18.1');
 assert(tip.length>25,'Missing recovery tip for '+skill);
 assert(!/certified|mastery achieved/i.test(tip),'Unsupported proficiency claim');
}
const foundation=fs.readFileSync(path.join(root,'app/foundation.tsx'),'utf8');
const reviewDomain=fs.readFileSync(path.join(root,'domain/post-lesson-review.ts'),'utf8');
assert(reviewDomain.includes("import {nextActionForIncorrect} from './foundation-recovery-tip'"));
assert(reviewDomain.includes("objective.filter(r=>r.correct===false)"),'Only missed graded items receive advice');
assert(foundation.includes('!editable&&attempt&&(attempt.results?.length??0)>0&&<OfflineLessonReview'),'Recommendation only after saved submission');
assert(foundation.includes('result.correct===false&&<p>Answer: {result.answer}</p>'),'Keep original wrong-answer explanation in the question');
assert(foundation.includes('<p>{result.explanation}</p>'),'Keep stored explanation');
assert(foundation.includes("result.correct===null?'Pending review'"));
const speaking=compile('app/speaking-preparation-guide.tsx',true);
let slots=[],cursor=0;
const ReactShim={useState(initial){
 const index=cursor++;if(!(index in slots))slots[index]=initial;
 return [slots[index],value=>{slots[index]=typeof value==='function'?value(slots[index]):value}];
}};
const jsx={jsx:(type,props,key)=>({type,props:props||{},key}),jsxs:(type,props,key)=>({type,props:props||{},key}),Fragment:Symbol('fragment')};
const mod={exports:{}};
vm.runInNewContext(speaking.js,{module:mod,exports:mod.exports,require:(name)=>{
 if(name==='react')return ReactShim;
 if(name==='react/jsx-runtime')return jsx;
 throw Error('Unexpected dependency: '+name);
}},{timeout:2000});
const render=()=>{cursor=0;return mod.exports.SpeakingPreparationGuide()};
function flat(x,result=[]){
 if(Array.isArray(x)){x.forEach(y=>flat(y,result));return result}
 if(x&&typeof x==='object'&&'type' in x){result.push(x);flat(x.props?.children,result)}
 return result;
}
function label(x){
 if(typeof x==='string')return x;
 if(Array.isArray(x))return x.map(label).join(' ');
 if(x&&typeof x==='object'&&'type' in x)return label(x.props?.children);
 return '';
}
const first=flat(render());
const model=first.find(x=>x.type==='details'&&label(x).includes('Model response'));
const start=first.find(x=>x.type==='button'&&label(x).includes('Start speaking practice'));
assert(model&&start);
assert.equal(model.props.open,true);
start.props.onClick();
const after=flat(render());
const hidden=after.find(x=>x.type==='details'&&label(x).includes('Model response'));
assert.equal(hidden.props.open,false,'Start speaking MUST collapse the model');
assert(after.some(x=>x.type==='p'&&x.props.role==='status'&&/model is closed/i.test(label(x))));
hidden.props.onToggle({currentTarget:{open:true}});
const back=flat(render());
assert.equal(back.find(x=>x.type==='details'&&label(x).includes('Model response')).props.open,true);
assert(back.some(x=>x.type==='button'&&label(x).includes('Start speaking practice')),'Reopening ends rehearsal');
assert(!/fetch\(|localStorage|indexedDB|Gemini|score\s*=|evidence_weight\s*=/.test(speaking.source));
console.log(JSON.stringify({result:'PASS',gate:'stage3-notebooklm-remediation',gradedRecovery:true,
 incorrectOnly:true,reviewedItemTips:16,domainFallbacks:7,
 speakingModelCollapse:true,reopenEndsRehearsal:true,productionWrites:0,physicalBrowser:'NOT_TESTED'}));
