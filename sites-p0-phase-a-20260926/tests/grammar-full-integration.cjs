const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),ts=require('typescript');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
require.extensions['.tsx']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,f);
const {StructuredGrammarNotes,structuredGrammarAvailable,grammarSections}=require('../app/structured-grammar.tsx');
const base=require('../content/curriculum-1.15.0-candidate.json'),current=require('../content/curriculum-1.16.0-candidate.json'),approved=require('../docs/reviews/grammar_40_approved_lesson_design.json');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.equal(sha(fs.readFileSync('content/curriculum-1.15.0-candidate.json')),'981a7273a9158c9e53a0e3336de1a88892024f617330d797d534f9e293dc4426');
assert.equal(current.schema_version,'1.16.0');assert.equal(current.lessons.length,100);assert.equal(current.lessons.reduce((n,l)=>n+l.activities.length,0),850);
assert.equal(new Set(current.lessons.flatMap(l=>l.activities.map(a=>a.id))).size,850);
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
let changed=0,renders=0;
for(const l of current.lessons){
 const old=base.lessons.find(b=>b.id===l.id);assert.deepEqual(l.activities,old.activities);
 if(l.module!=='grammar'){assert.deepEqual(l,old);continue;}
 changed++;const a=approved.lessons.find(a=>a.id===l.id);assert(a);assert.equal(sha(JSON.stringify(canonical(old))),a.baseline_lesson_sha256);
 let reviewed=a.approved_lesson_design_markdown;
 for(const fragment of [' (an existing source worked example; not the assessed gap-fill item)',' The grading policy will be decided separately.','; assess which examples need to be included for B1 learners'])reviewed=reviewed.replaceAll(fragment,'');
 const parts=reviewed.split(/### Vietnamese Support \([^\n]*?\)/);assert.equal(parts.length,2);
 assert.deepEqual(l.explanation,{en:parts[0].trim(),vi:parts[1].trim()},'Exact reviewed prose parity: '+l.id);
 assert.deepEqual({...l,explanation:old.explanation},old);assert(structuredGrammarAvailable(l,'1.16.0'));assert(!structuredGrammarAvailable(l,'1.15.0'));assert(!structuredGrammarAvailable(old,'1.16.0'));
 assert(grammarSections(l.explanation.en).length>=3);
 for(const showVi of [false,true]){
  const html=renderToStaticMarkup(React.createElement(StructuredGrammarNotes,{lesson:l,showVi}));renders++;
  assert(html.includes('Learning goals'));assert(html.includes('The core idea'));assert.equal(html.includes('lang="vi"'),showVi);
  assert(!html.includes('accepted_answers'));assert(!html.includes('assessed gap-fill'));assert(!html.includes('grading policy will be decided'));
  for(const q of l.activities)assert(!html.includes(q.id),'Assessment ID exposed: '+q.id);
 }
}
assert.equal(changed,40);
const ui=fs.readFileSync('app/foundation.tsx','utf8');assert(ui.includes('structuredGrammarAvailable(lesson,loadedLessonVersion.current)'));assert(ui.includes('<StructuredGrammarNotes lesson={lesson} showVi={showVi}/>'));
const css=fs.readFileSync('app/globals.css','utf8');assert(css.includes('.gdp-integrated'));assert(css.includes('overflow-x:auto'));assert(css.includes('@media(max-width:700px)'));
// Compile the actual service for an isolated, read-only importer preview.
const {execFileSync}=require('node:child_process');
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','application/academic-service.ts','--outDir','.sites-runtime/grammar-full-integration','--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{stdio:'inherit'});
fs.writeFileSync('.sites-runtime/grammar-full-integration/package.json','{"type":"commonjs"}');
const {validateSeed,mapSeed}=require('../.sites-runtime/grammar-full-integration/domain/academic.js');
const {validateContent}=require('../.sites-runtime/grammar-full-integration/domain/content-model.js');
const {academicService,sourceDigest}=require('../.sites-runtime/grammar-full-integration/application/academic-service.js');
assert.deepEqual(validateSeed(current),[]);assert.deepEqual(validateContent(mapSeed(current)),[]);
(async()=>{
 const pkg={id:base.package_id,version:base.schema_version,digest:await sourceDigest(base),source:base,bundle:mapSeed(base),at:1};
 const service=academicService({packages:async()=>[pkg]}, {},'isolated-test');
 const preview=await service.preview(current);assert.deepEqual(preview.errors,[]);assert.deepEqual(preview.counts,{add:0,update:40,skip:60,conflict:0});
 assert.equal(preview.digest,sha(JSON.stringify(canonical(current))));
 console.log('PASS: 40 approved Grammar lessons, 60 unchanged, 850 activities unchanged; 80 EN/VI renders; version gate; schema/content validation; isolated preview 0/40/60/0; importer canonical digest.');
})().catch(e=>{console.error(e);process.exitCode=1});
