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
 // AST-level regression contract: mere presence of the guard string is insufficient.
 // The guard MUST execute after awaiting Gemini but BEFORE any answer UI update.
 const ast=ts.createSourceFile('english-lesson-tutor.tsx',ui,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 assert.equal(ast.parseDiagnostics.length,0,'The UI must be parseable TSX');
 let ask;
 function walk(node){
   if(ts.isFunctionDeclaration(node)&&node.name?.text==='ask')ask=node;
   ts.forEachChild(node,walk);
 }
 walk(ast);
 assert(ask?.body,'Missing ask() handler');
 const requestTry=ask.body.statements.find(ts.isTryStatement);
 assert(requestTry,'ask() must handle awaited Gemini result in try/catch/finally');
 const trySteps=requestTry.tryBlock.statements;
 const awaited=trySteps.findIndex(node=>node.getText(ast).includes('await explainEnglishLessonAI('));
 const responseGuard=trySteps.findIndex(node=>
   ts.isIfStatement(node)&&
   node.expression.getText(ast)==='!requestGate.current.isCurrent(ticket)'&&
   node.thenStatement.getText(ast).includes('return;'));
 const resultUpdate=trySteps.findIndex(node=>
   node.getText(ast).includes('setAnswer(result.text)')||node.getText(ast).includes('setError(result.reason)'));
 assert(awaited>=0&&responseGuard>awaited&&resultUpdate>responseGuard,
   'Guard must reject stale Gemini replies BEFORE answer/error UI updates');
 const guardedState=(block,state)=>block?.statements?.some(node=>
   ts.isIfStatement(node)&&
   node.expression.getText(ast)==='requestGate.current.isCurrent(ticket)'&&
   node.thenStatement.getText(ast).includes(state));
 assert(guardedState(requestTry.catchClause?.block,'setError('),
   'catch must ignore errors from superseded requests');
 assert(guardedState(requestTry.finallyBlock,'setPending(false)'),
   'finally must not reset pending for a newer request');
 // Ensure the React effect invalidates on lesson navigation AND on unmount.
 assert(/useEffect\(\(\)=>\{[\s\S]*?requestGate\.current\.invalidate\(\);[\s\S]*?setPending\(false\);[\s\S]*?return \(\)=>\{requestGate\.current\.invalidate\(\)\};[\s\S]*?\},\[lesson\]\);/.test(ui),
   'Lesson change/unmount must invalidate requests and clear pending state');
 console.log(JSON.stringify({result:'PASS',scope:'compiled gate, live async isolation, and AST verified React request ordering',browserGeminiQA:'NOT_RUN'}));
})().catch(e=>{console.error(e);process.exitCode=1});
