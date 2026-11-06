'use strict';
// Real React server renderer test for the existing safe TeachingBlocks component.
// Requires normal project dependencies; does not call AI or any network API.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const source=fs.readFileSync(path.join(__dirname,'../app/teaching-blocks.tsx'),'utf8');
const js=ts.transpileModule(source,{
 fileName:'teaching-blocks.tsx',
 compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}
});
assert.equal(js.diagnostics?.filter(d=>d.category===ts.DiagnosticCategory.Error).length??0,0);
const mod={exports:{}};
vm.runInNewContext(js.outputText,{
 require:name=>{
  if(name==='react/jsx-runtime')return require('react/jsx-runtime');
  if(name==='react')return React;
  throw Error('Unexpected dependency: '+name);
 },
 exports:mod.exports,module:mod,
},{timeout:3000});
const {TeachingBlocks}=mod.exports;
function render(text){return renderToStaticMarkup(React.createElement(TeachingBlocks,{text}))}
const h=render('**Important**\n\n- Example one\n- Example two');
assert(h.includes('<strong>Important</strong>'),'Markdown bold must render');
assert(h.includes('<li>Example one</li>')&&h.includes('<li>Example two</li>'),'List items must render');
assert(!h.includes('**Important**'),'Raw markdown markers must not appear');
const hostile=render('<script>alert("x")</script>\n\n**Safe**');
assert(hostile.includes('&lt;script&gt;'),'Literal user-supplied HTML must be escaped');
assert(!hostile.includes('<script>'),'Untrusted HTML must never execute');
const table=render('| Context | Phrase |\n| --- | --- |\n| Class | hand in a form |');
assert(table.includes('<table>')&&table.includes('hand in a form'));
const steps=render('1. First **read** the question\n2. Choose a useful example');
assert(steps.includes('<ol')&&steps.includes('<li>First <strong>read</strong> the question</li>'),'Numbered lists must render with real list semantics');
const stars=render('* **Important** point\n* Another point');
assert(stars.includes('<ul')&&stars.includes('<li><strong>Important</strong> point</li>'),'Asterisk bullets must render as list items');
const newlines=render('Line one\r\nLine **two**');
assert(newlines.includes('<br/>')&&newlines.includes('Line <strong>two</strong>'),'Soft line breaks must be preserved and escaped');
// Regression: curriculum 1.18.1 must use the structured Grammar renderer.
// This is a rendering-only assertion; it never changes grade, item or attempt data.
const grammarSource=fs.readFileSync(path.join(__dirname,'../app/structured-grammar.tsx'),'utf8');
const grammarJS=ts.transpileModule(grammarSource,{
 fileName:'structured-grammar.tsx',
 compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}
});
const grammarModule={exports:{}};
vm.runInNewContext(grammarJS.outputText,{
 require:name=>{
  if(name==='react/jsx-runtime')return require('react/jsx-runtime');
  if(name==='./teaching-blocks')return {TeachingBlocks};
  throw Error('Unexpected structured Grammar dependency: '+name);
 },
 exports:grammarModule.exports,module:grammarModule,
},{timeout:3000});
const {structuredGrammarAvailable,StructuredGrammarNotes}=grammarModule.exports;
const v1181=require('../content/curriculum-1.18.1-candidate.json');
const grammarLesson=v1181.lessons.find(l=>l.id==='GRA-A1-04');
assert(grammarLesson,'Baseline Grammar lesson GRA-A1-04 must exist');
assert.equal(structuredGrammarAvailable(grammarLesson,'1.18.0'),true);
assert.equal(structuredGrammarAvailable(grammarLesson,'1.18.1'),true,
 'Regression: 1.18.1 structured Grammar notes must not fall back to raw Markdown');
assert.equal(structuredGrammarAvailable(grammarLesson,'1.20.0'),true,
 'Future curriculum versions must render matching authored structured notes');
assert.equal(structuredGrammarAvailable({...grammarLesson,explanation:{...grammarLesson.explanation,en:'Plain historical notes'}},'1.11.0'),false,
 'Historical plain-text notes must retain their fallback renderer');
assert.equal(structuredGrammarAvailable({...grammarLesson,module:'reading'},'1.18.1'),false);
const grammarMarkup=renderToStaticMarkup(React.createElement(StructuredGrammarNotes,{lesson:grammarLesson,showVi:false}));
assert(grammarMarkup.includes('The core idea'),'Structured Grammar subheads must render');
assert(grammarMarkup.includes('<strong>a/an</strong>'),'Authored bold terms must render semantically');
assert(grammarMarkup.includes('<ul'),'Authored Grammar examples must become list items');
assert(!grammarMarkup.includes('### Core rule / Meaning'),'Raw heading Markdown must not appear');
assert(!grammarMarkup.includes('**a/an**'),'Raw emphasis markers must not appear');
assert(!grammarMarkup.includes('<script>'),'No executable HTML may be emitted');

console.log(JSON.stringify({result:'PASS',scope:'real TeachingBlocks React SSR markdown output and escaped HTML',aiProviderCalls:0}));
