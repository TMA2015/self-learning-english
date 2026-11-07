'use strict';
/**
 * No learner backup is loaded or written. Real public curriculum and fake
 * versioned attempts demonstrate one Lesson ID/one history in every route.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const root=path.resolve(__dirname,'..');
const src=fs.readFileSync(path.join(root,'domain/attempt-navigation.ts'),'utf8');
const output=ts.transpileModule(src,{compilerOptions:{
 module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022
}}).outputText;
const outDir=path.join(root,'.sites-runtime/lesson-status-course-cards');
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'attempt-navigation.cjs'),output);
const {lessonProgressForLesson,latestAttemptForLesson}=require(path.join(outDir,'attempt-navigation.cjs'));
const old=require('../content/curriculum-1.18.1-candidate.json');
const current=require('../content/curriculum-1.20.0-candidate.json');
for(const id of ['GRA-A2-06','GRA-A2-08','GRA-A1-02','GRA-A2-02']){
 const a=old.lessons.find(l=>l.id===id),b=current.lessons.find(l=>l.id===id);
 assert(a&&b);
 assert.deepEqual(a,b,id+': revised release did not change lesson content');
}
const history=[
 {id:'historical-graded',lessonId:'GRA-A2-06',version:'1.18.1',
  status:'scored',createdAt:1},
 {id:'current-draft',lessonId:'GRA-A2-06',version:'1.20.0',
  status:'started',createdAt:3},
 {id:'other-submitted',lessonId:'GRA-A2-08',version:'1.18.1',
  status:'scored',createdAt:2}
];
const p=lessonProgressForLesson(history,'GRA-A2-06');
assert.equal(p.kind,'submitted','Historical submissions must keep green tick despite newer curriculum');
assert.equal(p.hasDraft,true,'A current draft must not remove the old submitted check');
assert.equal(latestAttemptForLesson(history,'GRA-A2-06').status,'started');
assert.equal(lessonProgressForLesson(history,'GRA-A2-08').kind,'submitted');
const foundation=fs.readFileSync(path.join(root,'app/foundation.tsx'),'utf8');
const unit=fs.readFileSync(path.join(root,'app/unit-browser.tsx'),'utf8');
const badge=fs.readFileSync(path.join(root,'app/lesson-progress-mark.tsx'),'utf8');
const plan=fs.readFileSync(path.join(root,'app/core-panels.tsx'),'utf8');
const home=fs.readFileSync(path.join(root,'app/home-client.tsx'),'utf8');
const css=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
assert(foundation.includes("import {LessonProgressMark} from './lesson-progress-mark'"));
assert(foundation.includes('foundation-recent-top')&&foundation.includes('lessonProgressForLesson(catalog.attempts,l.id)'));
assert(unit.includes("import {LessonProgressMark} from './lesson-progress-mark'"));
assert(unit.includes('<LessonProgressMark {...progress}/>'));
assert(badge.includes("kind==='submitted'?'✓'"),'Historic submissions need a shared visible tick');
assert(plan.includes("'Recommended Learning Plan'"));
assert(plan.includes('not a generative AI recommendation'));
assert(plan.includes('Foundation lesson submissions are not yet included'));
assert(!plan.includes('Follow my AI Plan'), 'Label must not claim external AI');
assert(!plan.includes('Browse Foundation lessons'),'Specialist course picker must not contain skill catalog');
assert(!plan.includes('45 available lessons'),'Remove stale cumulative lesson count');
assert(plan.includes('courses.courses.map(course=>'));
assert(plan.includes('Select as active course'));
assert(home.includes('plan={state.learningPlan} courses={courseData}'),'Use actual course registry');
assert(css.includes('.course-choice-card'),'Specialist course requires a real responsive card');
console.log(JSON.stringify({
 result:'PASS',gate:'historical-submitted-tick-and-specialist-course-picker',
 realSourceVersions:['1.18.1','1.20.0'],
 unchangedGrammarLessonIds:['GRA-A2-06','GRA-A2-08','GRA-A1-02','GRA-A2-02'],
 olderSubmissionRetained:true,newDraftAlsoRetained:true,
 sharedUnitAndCatalogStatus:true,
 selectedCoursesComeFromRealCourseRegistry:true,
 staleFoundationShortcutRemoved:true,
 recommendationType:'DETERMINISTIC_RULE_BASED',
 savedLearnerRecordsWritten:0,
 productionDeployment:'NOT_PERFORMED'
}));
