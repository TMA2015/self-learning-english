'use strict';
// Regression: old Gemini completions cannot appear under a newly opened lesson.
// Real production gate compiled via TypeScript, no browser/AI/network needed.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const source=fs.readFileSync(path.join(__dirname,'../domain/tutor-request-gate.ts'),'utf8');
const compiled=ts.transpileModule(source,{
 fileName:'tutor-request-gate.ts',
 reportDiagnostics:true,
 compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
});
assert.equal(compiled.diagnostics?.filter(d=>d.category===ts.DiagnosticCategory.Error).length??0,0);
const m={exports:{}};
vm.runInNewContext(compiled.outputText,{module:m,exports:m.exports},{timeout:1000});
const {LatestTutorRequest}=m.exports;
(async()=>{
 const gate=new LatestTutorRequest();
 let visible='';
 let completeOld;
 const oldReply=new Promise(resolve=>{completeOld=resolve});
 const oldTicket=gate.begin();
 const stale=(async()=>{const answer=await oldReply;if(gate.isCurrent(oldTicket))visible=answer})();
 gate.invalidate(); // Navigate away before Gemini responds.
 assert.equal(gate.isCurrent(oldTicket),false);
 const newTicket=gate.begin();
 assert.equal(gate.isCurrent(newTicket),true);
 completeOld('WRONG: previous lesson');
 await stale;
 assert.equal(visible,'','Old response must not render in the new lesson');
 if(gate.isCurrent(newTicket))visible='Correct: new lesson';
 assert.equal(visible,'Correct: new lesson');
 gate.invalidate(); // Unmount/another navigation.
 assert.equal(gate.isCurrent(newTicket),false);
 const ticket3=gate.begin(),ticket4=gate.begin();
 assert.equal(gate.isCurrent(ticket3),false,'Latest request must supersede previous request');
 assert.equal(gate.isCurrent(ticket4),true);
 const ui=fs.readFileSync(path.join(__dirname,'../app/english-lesson-tutor.tsx'),'utf8');
 assert(ui.includes("import {LatestTutorRequest} from '../domain/tutor-request-gate'"));
 assert(ui.includes('useRef(new LatestTutorRequest())'));
 assert(ui.includes('requestGate.current.invalidate()'));
 assert(ui.includes('setPending(false)'));
 assert(ui.includes('requestGate.current.isCurrent(ticket)'));
 assert(ui.includes('finally'),'Pending state must settle on current request');
 console.log(JSON.stringify({result:'PASS',scope:'compiled request-identity gate and component source wiring',browserGeminiQA:'NOT_RUN'}));
})().catch(e=>{console.error(e);process.exitCode=1});
