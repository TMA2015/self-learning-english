'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),ts=require('typescript');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
require.extensions['.tsx']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,f);
const data=require('../content/grammar-knowledge-v23-wave1.json'),curriculum=require('../content/curriculum-1.28.0-candidate.json');
const {grammarKnowledgeV23Available,GrammarKnowledgeV23}=require('../app/grammar-knowledge-v23.tsx');
const {StructuredGrammarNotes}=require('../app/structured-grammar.tsx');
const raw=fs.readFileSync('content/curriculum-1.28.0-candidate.json');
assert.equal(crypto.createHash('sha1').update('blob '+raw.length+'\0').update(raw).digest('hex'),data.source_curriculum_blob,'immutable reviewed baseline blob');
const ids=Object.keys(data.lessons);assert.equal(ids.length,6);
let sections=0,checks=0,scored=0;
for(const id of ids){
 const lesson=curriculum.lessons.find(l=>l.id===id),entry=data.lessons[id];assert(lesson);
 assert.equal(entry.baselineExplanation,lesson.explanation.en);assert.equal(entry.title,lesson.title);
 assert(grammarKnowledgeV23Available(lesson,'1.28.0'));assert(!grammarKnowledgeV23Available(lesson,'1.25.0'));assert(!grammarKnowledgeV23Available(lesson,'1.29.0'));assert(!grammarKnowledgeV23Available({...lesson,explanation:{...lesson.explanation,en:'changed'}},'1.28.0'));
 sections+=entry.sections.length;scored+=lesson.activities.length;
 const qs=entry.sections.flatMap(s=>s.quiz??[]);checks+=qs.length;
 for(const q of qs){assert.equal(q.options.filter(o=>o.correct).length,1);assert(q.options.every(o=>o.text&&o.feedback&&o.vi));assert(!lesson.activities.some(a=>a.id===q.id))}
 const html=renderToStaticMarkup(React.createElement(StructuredGrammarNotes,{lesson,version:'1.28.0',showVi:false}));
 const vi=renderToStaticMarkup(React.createElement(StructuredGrammarNotes,{lesson,version:'1.28.0',showVi:true}));
 assert(html.includes('data-grammar-knowledge="v2.3"'));assert(html.includes('not saved to your results'));assert(!html.includes('sle-gra02-feedback'));assert(!html.includes('Open Practice layout preview'));assert(vi.includes('lang="vi"'));
 const legacy=renderToStaticMarkup(React.createElement(StructuredGrammarNotes,{lesson,version:'1.25.0',showVi:false}));assert(!legacy.includes('data-grammar-knowledge='));
 if(id==='GRA-A1-02'){assert(html.includes('Mai is my friend.'));assert(!html.includes('Linh is my friend.'))}
 if(id==='GRA-B1-01'){assert(html.includes('have knitting'));assert(!html.includes('have knittting'))}
}
assert.equal(sections,47);assert.equal(checks,14);assert.equal(scored,56);
assert(!grammarKnowledgeV23Available(curriculum.lessons.find(l=>l.id==='GRA-A1-01'),'1.28.0'));
const source=fs.readFileSync('app/grammar-knowledge-v23.tsx','utf8');assert(!/dangerouslySetInnerHTML|localStorage|indexedDB|fetch\(|setAnswers|saveDraft/.test(source));
console.log(JSON.stringify({result:'PASS',gate:'SLE_GRAMMAR_V23_W1',lessons:6,sections,quickChecks:checks,baselineScoredItems:scored,versionGuard:true,baselineBlobMatch:true}));
