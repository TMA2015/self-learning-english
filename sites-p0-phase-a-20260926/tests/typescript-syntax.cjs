'use strict';
// Fast fail-closed preflight: parse TS/TSX before running expensive Core tests.
// Syntax only; TypeScript type-checking and build remain separate release gates.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const ignored=new Set(['node_modules','.next','.sites-runtime','dist','.git']);
const errors=[];
let checked=0;
function visit(directory){
  for(const item of fs.readdirSync(directory,{withFileTypes:true})){
    if(ignored.has(item.name))continue;
    const file=path.join(directory,item.name);
    if(item.isDirectory()){visit(file);continue;}
    if(!item.isFile()||!/\.(?:ts|tsx|mts|cts)$/.test(item.name))continue;
    checked++;
    const source=fs.readFileSync(file,'utf8');
    const kind=item.name.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS;
    const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,kind);
    for(const diagnostic of tree.parseDiagnostics){
      const position=tree.getLineAndCharacterOfPosition(diagnostic.start??0);
      errors.push(path.relative(root,file)+':'+(position.line+1)+':'+(position.character+1)+': TS'+diagnostic.code+' '+ts.flattenDiagnosticMessageText(diagnostic.messageText,' '));
    }
  }
}
visit(root);
assert(checked>0,'No TypeScript files found: cannot claim syntax preflight passed');
assert.deepEqual(errors,[],'TypeScript syntax errors must block Core QA before expensive test execution');
console.log(JSON.stringify({result:'PASS',gate:'typescript-syntax-preflight',files:checked,syntaxErrors:errors.length}));
