'use strict';
// Source/SSR compatibility only. No activation or production learner writes.
// The separate wording-source gate pins both packages and proves exact reversal.
const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
require.extensions['.css']=()=>{};
require.extensions['.tsx']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,resolveJsonModule:true}}).outputText,f);
const base=require('../content/curriculum-1.28.0-candidate.json'),next=require('../content/review-packets/curriculum-1.28.1-wording-candidate.json');
const {grammarKnowledgeV23Available,GrammarKnowledgeV23}=require('../app/grammar-knowledge-v23.tsx');
const {structuredGrammarAvailable,StructuredGrammarNotes}=require('../app/structured-grammar.tsx');
const {vocabularyKnowledgeV23Available,VocabularyKnowledgeV23}=require('../app/vocabulary-knowledge-v23.tsx');
const {readingKnowledgeV23Available,ReadingKnowledgeV23}=require('../app/reading-knowledge-v23.tsx');
const {multiskillKnowledgeV2Available,MultiskillKnowledgeV2}=require('../app/multiskill-knowledge-v2.tsx');
const groups=[
 ['grammar',grammarKnowledgeV23Available,StructuredGrammarNotes,42],
 ['vocabulary',vocabularyKnowledgeV23Available,VocabularyKnowledgeV23,22],
 ['reading',readingKnowledgeV23Available,ReadingKnowledgeV23,41],
 ['multi',multiskillKnowledgeV2Available,MultiskillKnowledgeV2,4]
];
let comparisons=0;const counts={};
for(const [name,available,Component,count] of groups){
 const supported=base.lessons.filter(l=>available(l,'1.28.0'));
 assert.equal(supported.length,count,name+' approved coverage');
 const accepted=next.lessons.filter(l=>available(l,'1.28.1'));
 assert.deepEqual(accepted.map(l=>l.id),supported.map(l=>l.id),name+' exact lesson coverage');
 counts[name]=count;
 for(const old of supported){
  const fresh=next.lessons.find(l=>l.id===old.id);
  assert(fresh);
  if(name==='grammar')assert(structuredGrammarAvailable(fresh,'1.28.1'));
  for(const version of ['1.18.1','1.25.0','1.27.0','1.28.2','1.29.0','1.32.0'])assert(!available(fresh,version),old.id+' unsupported '+version);
  for(const showVi of [false,true]){
   const oldHTML=renderToStaticMarkup(React.createElement(Component,{lesson:old,version:'1.28.0',showVi}));
   const newHTML=renderToStaticMarkup(React.createElement(Component,{lesson:fresh,version:'1.28.1',showVi}));
   assert(oldHTML.length>100,old.id+' actual teaching markup');
   assert.equal(newHTML,oldHTML,old.id+' unchanged teaching markup');
   comparisons++;
  }
 }
}
const unknown={...next.lessons[0],id:'UNKNOWN-V1281'};
for(const [,available] of groups)assert(!available(unknown,'1.28.1'));
const g=next.lessons.find(l=>l.module==='grammar');
assert(!grammarKnowledgeV23Available({...g,explanation:{...g.explanation,en:'changed'}},'1.28.1'));
const foundation=fs.readFileSync('app/foundation.tsx','utf8');
assert(foundation.includes("catalog&&(catalog.version==='1.28.0'||catalog.version==='1.28.1')&&view.version!==catalog.version"));
assert(foundation.includes('candidate.version===catalog.version'));
assert(foundation.includes('const view=await loadLesson(id,existing?.version??catalog?.version)'));
assert(foundation.includes('if(existing)validateOptionOrder(view.lesson.activities,existing)'));
assert(foundation.includes('currentKnowledgeView.version===catalog?.version'));
assert(!fs.readFileSync('infrastructure/browser/local-runtime.ts','utf8').includes('1.28.1'));
console.log(JSON.stringify({gate:'SLE_V1281_KNOWLEDGE_COMPAT_SOURCE_SSR',result:'PASS',counts,comparisons,activeRuntime:'1.28.0',actualUpgrade:'NOT_TESTED',historicalBrowser:'NOT_TESTED'}));
