'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
require.extensions['.tsx']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,resolveJsonModule:true}}).outputText,f);
const {LessonOverviewNotes}=require('../app/lesson-overview-notes.tsx');
const {verifyActiveRelease}=require('../scripts/active-release.cjs');
const {source}=verifyActiveRelease(),skills=['listening','writing','speaking','pronunciation'];
const lessons=source.lessons.filter(l=>skills.includes(l.module));
let renders=0;
for(const lesson of lessons)for(const showVi of [false,true]){
 const html=renderToStaticMarkup(React.createElement(LessonOverviewNotes,{lesson,showVi}));
 assert(html.includes('Learning goals')&&html.includes('sle-overview-heading'),lesson.id);
 assert(!/adult review|adult reviews|adult feedback|người lớn đánh giá|người lớn nhận xét|Real MP3 required before import/i.test(html),lesson.id+' learner copy');
 assert(!html.includes('correct_option_id')&&!html.includes('accepted_answers'),lesson.id+' no key exposure');
 assert.equal(html.includes('lang="vi"'),showVi,lesson.id+' bilingual heading');
 if(lesson.id==='WRI-A2-03')assert(html.includes('Art Club')&&html.includes('Before you submit')&&html.includes('<table>'));
 if(lesson.id==='LIS-A1-02')assert(html.includes('First listen')&&html.includes('Second listen'));
 if(lesson.id==='PRO-A2-03')assert(html.includes('sle-overview-ipa')&&html.includes('worked late'));
 renders++;
}
const f=fs.readFileSync('app/foundation.tsx','utf8');
assert(f.indexOf('className="foundation-player-nav"')<f.indexOf('className="sle-lesson-header"'));
for(const token of ['This saved attempt uses content','View archived notes','View current lesson notes','historicalVersionSuffix','foundation-attempt-details'])assert(!f.includes(token),token);
assert(f.includes('const view=await loadLesson(id,existing?.version??catalog?.version)'));
assert(f.includes('if(existing)validateOptionOrder(view.lesson.activities,existing)'));
assert(f.includes('renderOverviewNotes(currentNotes?.lesson??lesson'));
assert(f.includes('WritingAIReview')&&f.includes('listeningAudioHint(playbackVerified'));
console.log(JSON.stringify({gate:'SLE_LESSON_OVERVIEW',result:'PASS',lessons:lessons.length,renders,scope:'SSR and source; browser regression separate'}));
