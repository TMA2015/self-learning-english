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
console.log(JSON.stringify({result:'PASS',scope:'real TeachingBlocks React SSR markdown output and escaped HTML',aiProviderCalls:0}));
