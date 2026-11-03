const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),ts=require('typescript'),Module=require('node:module');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const base=JSON.parse(fs.readFileSync('content/curriculum-1.15.0-candidate.json'));
assert.equal(hash(fs.readFileSync('content/curriculum-1.15.0-candidate.json')),'981a7273a9158c9e53a0e3336de1a88892024f617330d797d534f9e293dc4426');
const data=require('../content/design-previews/grammar-pilot-v1.json'),provenance=require('../docs/reviews/GRAMMAR_PILOT_PROVENANCE.json');
assert.equal(data.baselineCurriculumVersion,'1.15.0');assert.deepEqual(data.lessons.map(l=>l.id),['GRA-A1-01','GRA-A2-11','GRA-B1-10']);assert.equal(new Set(provenance.verifiedLessonIds).size,40);
const approved=require('../docs/reviews/grammar_40_approved_lesson_design.json');
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
assert.equal(hash(fs.readFileSync('docs/reviews/grammar_40_approved_lesson_design.json')),provenance.approvedJSONSHA256);
assert.deepEqual(approved.lessons.map(l=>l.id).sort(),base.lessons.filter(l=>l.module==='grammar').map(l=>l.id).sort());
for(const l of approved.lessons){const b=base.lessons.find(x=>x.id===l.id);assert.deepEqual(l.baseline_goals,b.objectives);assert.equal(hash(JSON.stringify(canonical(b))),l.baseline_lesson_sha256);assert.match(l.source_packet_sha256,/^[a-f0-9]{64}$/);assert.equal(l.assessment_change_authorized,false);}
require.extensions['.tsx']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,f);
const file=path.resolve('app/grammar-design-preview/preview.tsx'),text=fs.readFileSync(file,'utf8');
const mod=new Module(file,module);mod.filename=file;mod.paths=Module._nodeModulePaths(path.dirname(file));mod._compile(ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,file);
let renders=0;
for(const l of data.lessons){
 const source=base.lessons.find(x=>x.id===l.id);assert.deepEqual(l.baseline_goals,source.objectives);
 for(const title of ['Core rule / Meaning','When to use','Worked examples','Common mistakes'])assert(l.sections.some(s=>s.title===title));
 const html=renderToStaticMarkup(React.createElement(mod.exports.LessonDesign,{lesson:l,showVi:false}));
 assert(html.includes('What you will learn'));assert(html.includes('The core idea'));assert(html.includes('<table>')||l.id==='none');assert(!html.includes('lang="vi"'));assert(!html.includes('Vietnamese Support'));assert(!html.includes('assess which examples'));assert(!html.includes('grading policy will be decided'));assert(!html.includes('assessed gap-fill item'));assert(!html.includes('**'));
 const vi=renderToStaticMarkup(React.createElement(mod.exports.LessonDesign,{lesson:l,showVi:true}));assert(vi.includes('lang="vi"'));assert(vi.includes('Vietnamese Support'));
 for(const q of source.activities){assert(!html.includes(q.id));assert(!l.sections.some(s=>s.markdown.includes(q.prompt)));}
 assert(!('activities' in l));assert(!JSON.stringify(l).includes('accepted_answers'));renders+=2;
}
assert(!/localStorage|sessionStorage|fetch\(|foundationRequest|generateContent|dangerouslySetInnerHTML/.test(text));
const css=fs.readFileSync('app/globals.css','utf8');assert(css.includes('@media(max-width:700px)'));assert(css.includes('.gdp-picker,.gdp-adaptive{grid-template-columns:minmax(0,1fr)}'));assert(css.includes('.gdp-table-scroll{overflow-x:auto'));assert(text.includes('aria-pressed'));assert(text.includes('type="checkbox"'));
console.log('PASS: 3-only preview, baseline binding/hash, 40-ID provenance, '+renders+' EN/VI server renders, core/adaptive structure, no assessment inventory or data/AI calls, responsive/accessibility source contracts. Visual browser QA pending.');
