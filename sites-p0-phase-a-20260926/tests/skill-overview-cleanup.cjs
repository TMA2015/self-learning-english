'use strict';
// Source and semantic UX regression for the existing SLE skill pages.
// No live data, no provider request and no deployment.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const home=read('app/home-client.tsx');
const foundation=read('app/foundation.tsx');
const platform=read('app/platform.tsx');
const anyTopic=read('app/any-topic-writing-review.tsx');
const css=read('app/globals.css');
const nav=home.slice(home.indexOf('const navGroups='),home.indexOf('] as const;')+11);
assert(nav.length>100,'Existing sidebar groups must be available');
assert(!nav.includes('label:"All Lessons"'),'Remove duplicate All Lessons sidebar entry');
assert(nav.includes('heading:"SKILL LIBRARY"'),'Retain Skill Library heading');
for(const skill of ['Grammar','Reading','Writing','Listening','Speaking','Vocabulary','Pronunciation'])
 assert(nav.includes('label:"'+skill+'"'),'Skill Library must retain '+skill);
assert(home.includes('"foundation"'),'Existing saved/bookmarked All Lessons route remains compatible');
assert(home.includes('onNavigationGuard={registerFoundationNavigationGuard}'),
 'Existing guarded navigation must remain in place');

const tab=foundation.indexOf('<div className="foundation-path" aria-label="Skill navigation">');
const title=foundation.indexOf('className="page-heading"');
const writingAction=foundation.indexOf('className="foundation-writing-action"');
const today=foundation.indexOf('className="panel foundation-today"');
const recent=foundation.indexOf('foundation-recent"');
assert(tab>=0&&tab<title&&title<writingAction&&writingAction<today&&today<recent,
 'Keep current skill page layout; move skill tabs above title, without moving the learning panels');
assert.equal((foundation.match(/className="foundation-path"/g)||[]).length,1,
 'Do not duplicate skill tabs');
assert(foundation.includes("entryMode!=='units'&&screen==='catalog'&&catalog?.imported"),
 'Skill tabs are for imported lesson catalog, not Unit Browser or player');
assert(foundation.includes('onClick={()=>void chooseSkill(l.module)}'),
 'Existing guarded skill switch must work without changing the route');
assert(foundation.includes('scopeLessons.length'),
 'Use actual imported lessons in each selected skill');
assert(foundation.includes("scopeLessons.length===1?'lesson':'lessons'"),
 'Per-skill count must be singular/plural safe');
assert(!foundation.includes("' · Learning Path'"),'Use a skill name rather than a misleading Learning Path title');
assert(!foundation.includes('7 skill domains</p>'),'Global catalog count must not appear on a skill page');
assert(!foundation.includes('Focus Unit <select'),'Remove long Focus Unit dropdown');
assert(!foundation.includes('todayUnitValue'),'No stale Unit picker state');
assert(foundation.includes('todayLearningPath(catalog,skill)'),
 'Keep the existing latest-saved-work recommendations');
assert(foundation.includes("onClick={()=>void chooseSkill('units')}"),
 'Unit selection remains available via existing Learn by Units');
for(const marker of ['todayPlan?.resume','todayPlan?.review','todayPlan?.learn','foundation-progress-summary','foundation-catalog-panel'])
 assert(foundation.includes(marker),'Retain original suggestion/progress/catalog '+marker);

assert(!home.includes('<WritingHome compact'),'Do not embed the 12-week course in Writing overview');
assert(!foundation.includes('className="foundation-writing-coach"'),
 'No course-only cards in the Writing skill overview');
assert(home.includes('writingIntro={view==="writing"?<div className="learning-choices"'),'Writing skill keeps a bounded accessible entry group');
assert(home.includes('onClick={()=>void navigate("writing-course")}>Foundation Writing'),'Reviewed full Foundation Writing U01–U12 accessible from Writing');
assert(home.includes('>Writing Studio</button>')&&home.includes('onClick={()=>void navigate("writing-any-topic")}>Writing Studio</button>'));
assert(css.includes('.foundation-writing-action{'),'Compact action layout must remain mobile-readable');
assert(home.includes('view==="writing-course"&&'),'The Foundation Writing course overview remains reachable from Writing and My Courses');
assert(home.includes('view==="writing-any-topic"&&<AnyTopicWritingReview'),
 'Independent writing draft/review remains reachable');
assert(home.includes('view==="tutor"&&<TutorOverview onWriting={()=>navigate("writing-any-topic")}/>'),
 'AI Tutor Writing feedback entry must never send users to Week 1');
assert(platform.includes('Open AI Writing Feedback'),'Make AI feedback CTA explicit');
assert(!platform.split('export function TutorOverview')[1].includes('Try Writing practice'),
 'Remove incorrect Week 1 CTA from AI feedback landing');
assert(anyTopic.includes('reviewMode="any-topic"')&&anyTopic.includes('kind="draft" enabled={aiEligible}'),
 'AI review must remain optional and require saved draft');
assert(anyTopic.includes('localStorage.setItem(DRAFT_KEY'),
 'Independent Writing must preserve browser-saved draft');

const active=require('../content/curriculum-1.25.0-candidate.json');
const counts=new Map();
for(const lesson of active.lessons)counts.set(lesson.module,(counts.get(lesson.module)||0)+1);
assert.equal(active.lessons.length,154);
assert.equal(counts.size,7);
for(const skill of ['grammar','reading','writing','listening','speaking','vocabulary','pronunciation'])
 assert(counts.get(skill)>0,'Active curriculum missing '+skill);
for(const [file,kind] of [['app/home-client.tsx',ts.ScriptKind.TSX],['app/foundation.tsx',ts.ScriptKind.TSX],['app/platform.tsx',ts.ScriptKind.TSX]]){
 const ast=ts.createSourceFile(file,read(file),ts.ScriptTarget.Latest,true,kind);
 assert.equal(ast.parseDiagnostics.length,0,file+' must parse as TSX');
}
console.log(JSON.stringify({
 result:'PASS',gate:'skill-overview-cleanup',skillTabsAboveTitle:true,
 dynamicSkillCounts:Object.fromEntries(counts),allLessonsSidebarRemoved:true,
 skillLibraryRetained:true,focusUnitDropdownRemoved:true,
 foundationWritingSharedCourseOverview:true,independentGeminiFeedbackRoute:true,
 noProviderCalls:true,noProductionMutations:true,
}));
