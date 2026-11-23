'use strict';
/** Multi-skill v2 is a version-pinned presentation overlay only.
 * Academic material stays in the existing reviewed packet/source files. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),crypto=require('node:crypto'),ts=require('typescript'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
require.extensions['.tsx']=(module,filename)=>module._compile(ts.transpileModule(
 fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,
 jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,resolveJsonModule:true}}).outputText,filename);
const {MultiskillKnowledgeV2,multiskillKnowledgeV2Available}=require('../app/multiskill-knowledge-v2.tsx');
const source=require('../content/rwg-depth-pilot-r1.json');
assert.equal(source.review.academic_verdict,'PASS');
assert.equal(source.review.source_fidelity,'PASS');
assert.equal(source.assessment_mutations,false);
assert.equal(source.source_curriculum_version,'1.25.0');
const cases=[
 ['REA-B1-03','reading','B1','Reading B1 knowledge'],
 ['VOC-A2-01','vocabulary','A2','Vocabulary A2 knowledge'],
 ['WRI-B1-05','writing','B1','Writing B1 knowledge'],
 ['LIS-A2-03','listening','A2','Listening A2 knowledge']
];
let rendered=0;
for(const [id,module,cefr,label] of cases){
 const lesson={id,module,cefr_target:cefr,objectives:['Understand the lesson topic.'],title:id};
 assert(multiskillKnowledgeV2Available(lesson,'1.28.0'),id+' eligible');
 for(const version of ['1.24.0','1.25.0','1.27.0','1.29.0']){
  assert(!multiskillKnowledgeV2Available(lesson,version),'historical/future content preserved: '+id+' '+version);
 }
 for(const showVi of [false,true]){
  const html=renderToStaticMarkup(React.createElement(MultiskillKnowledgeV2,{lesson,showVi}));
  rendered++;
  assert(html.includes('aria-label="'+label+'"'),id+' proper renderer');
  assert(html.includes('Learning goal'),id+' goal');
  assert(html.includes('sle-ms-section'),id+' sections');
  assert.equal(html.includes('lang="vi"'),showVi,id+' optional bilingual headings');
  assert(!html.includes('correct_option_id'),id+' no answer-key exposure');
  assert(!html.includes('accepted_answers'),id+' no graded key exposure');
  assert(!html.includes('lessonScores'),id+' no fake grades');
  if(id==='REA-B1-03'){
   assert(html.includes('However, rainy days sometimes interrupt outdoor activities.'));
   assert(html.includes(source.lessons[id].cards[0].body),'source fidelity');
   assert(html.includes('aria-pressed="false"'),'reading lens has unselected default');
  }
  if(id==='VOC-A2-01'){
   assert(html.includes('make breakfast / make the bed'));
   assert(html.includes('See usage and example'));
   assert.equal((html.match(/sle-ms-vocab-card/g)||[]).length,4);
  }
  if(id==='WRI-B1-05'){
   assert(html.includes(source.lessons[id].goal));
   assert(html.includes('monthly art exhibition'));
   assert(html.includes('no autosave, no upload and no grading'));
   assert(html.includes('textarea'));
  }
  if(id==='LIS-A2-03'){
   assert(html.includes('Full playback is required before scoring.'));
   assert(html.includes('If audio is unavailable, Listening remains unassessed.'));
   assert(!html.includes('<audio'),'No fake audio player');
  }
 }
}
assert(!multiskillKnowledgeV2Available({id:'REA-B1-02',module:'reading'},'1.28.0'));
const foundation=fs.readFileSync('app/foundation.tsx','utf8'),layout=fs.readFileSync('app/layout.tsx','utf8'),css=fs.readFileSync('app/multiskill-knowledge-v2.css','utf8');
assert(foundation.includes('multiskillKnowledgeV2Available(lesson,loadedLessonVersion.current)?<MultiskillKnowledgeV2'));
assert(foundation.includes('!multiskillKnowledgeV2Available(lesson,loadedLessonVersion.current)&&lesson.module'));
assert(layout.includes('import "./multiskill-knowledge-v2.css"'));
for(const selector of ['.sle-ms-grid','.sle-ms-highlight','.sle-ms-vocab-card','.sle-ms-outline','.sle-ms-listening-notice'])assert(css.includes(selector));
assert(!/fetch\(|localStorage|sessionStorage|foundationRequest\(/.test(fs.readFileSync('app/multiskill-knowledge-v2.tsx','utf8')),'No network or durable state');
console.log(JSON.stringify({result:'PASS',gate:'SLE_MULTISKILL_V2_READONLY_ACADEMIC',review:'NotebookLM-PASS-source',
 lessons:cases.map(x=>x[0]),renders:rendered,version:'1.28.0',assessmentMutations:0,
 networkCalls:0,attemptWrites:0,historicalVersionsIntact:true}));
