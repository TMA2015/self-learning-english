'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'domain/foundation-practice-plan.ts'),'utf8');
const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const runtime=path.join(root,'.sites-runtime/foundation-practice-plan.cjs');
fs.mkdirSync(path.dirname(runtime),{recursive:true});fs.writeFileSync(runtime,output);
const {foundationPracticeAdvice}=require(runtime);
const catalog={
 imported:true,
 lessons:[
  {id:'VOC-A2-01',title:'In daily life',module:'vocabulary'},
  {id:'GRA-A2-01',title:'Sentence choices',module:'grammar'},
  {id:'REA-B1-01',title:'Evidence and purpose',module:'reading'},
  {id:'LIS-A1-01',title:'Real audio',module:'listening'}
 ],
 attempts:[
  {id:'vocab-saved',lessonId:'VOC-A2-01',status:'scored',createdAt:10,
   results:[{id:'1',correct:false},{id:'2',correct:false},{id:'3',correct:true},{id:'1',correct:false}]},
  {id:'vocab-new-draft',lessonId:'VOC-A2-01',status:'started',createdAt:25,results:[]},
  {id:'grammar-saved',lessonId:'GRA-A2-01',status:'scored',createdAt:11,
   results:[{id:'1',correct:false},{id:'2',correct:true}]},
  {id:'pending',lessonId:'REA-B1-01',status:'pending_review',createdAt:12,
   results:[{id:'1',correct:false}]},
  {id:'format-only',lessonId:'LIS-A1-01',status:'scored',createdAt:15,
   results:[{id:'1',correct:false,outcome:'format-only'},{id:'2',correct:null}]},
  {id:'not-imported',lessonId:'VOC-C2-99',status:'scored',createdAt:30,
   results:[{id:'1',correct:false}]}
 ]};
const plan=foundationPracticeAdvice(catalog);
assert.equal(plan.length,2,'Only objectively scored mistakes in currently imported lessons');
assert.deepEqual(plan.map(x=>x.module),['vocabulary','grammar']);
assert.equal(plan[0].missed,2,'Do not duplicate result IDs');
assert.equal(plan[0].total,3,'Count only objective distinct answers');
assert.equal(plan[0].lessonId,'VOC-A2-01');
assert.match(plan[0].reason,/saved explanation/);
assert.match(plan[0].reason,/not a proficiency estimate/);
assert.equal(foundationPracticeAdvice({...catalog,imported:false}).length,0);
assert.equal(foundationPracticeAdvice(catalog,1).length,1);
assert.equal(foundationPracticeAdvice(catalog,0).length,0);
assert.equal(foundationPracticeAdvice({...catalog,attempts:[...catalog.attempts,{
 id:'grammar-newer-approved',lessonId:'GRA-A2-01',status:'approved',createdAt:29,
 results:[{id:'1',correct:true}]}]}).some(x=>x.module==='grammar'),false,
 'Newer cleared submission supersedes old mistakes');
assert.equal(foundationPracticeAdvice({...catalog,attempts:[...catalog.attempts,{
 id:'vocab-newer-pending',lessonId:'VOC-A2-01',status:'pending_review',createdAt:30,
 results:[{id:'1',correct:false}]}]}).some(x=>x.module==='vocabulary'),false,
 'Pending free-response work must not be treated as a new objective error signal');
assert.doesNotMatch(source,/\bfetch\(|requestWritingAI|Gemini\.|setItem\(|AcademicRepository\b|CEFR score/i);
const core=fs.readFileSync(path.join(root,'app/core-panels.tsx'),'utf8');
const home=fs.readFileSync(path.join(root,'app/home-client.tsx'),'utf8');
assert.match(core,/foundationPracticeAdvice\(foundationCatalog\)/);
assert.match(core,/not a generative AI recommendation/);
assert.match(core,/Saved Foundation objective answers are summarized separately/);
assert.match(home,/foundationRequest\('\/api\/foundation'\)/);
assert.match(home,/foundationCatalog=\{foundationCatalog\}/);
console.log('PASS foundation-practice-plan: real scored misses only, no stale/pending/unscored/foreign evidence, no new grading/AI or storage');
