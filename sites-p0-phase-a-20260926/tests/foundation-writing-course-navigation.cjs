'use strict';
/** Regression: preserve Writing catalog while replacing the obsolete 12-week course surface. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const read=(file)=>fs.readFileSync(path.join(root,file),'utf8');
const home=read('app/home-client.tsx');
const courses=read('app/my-courses.tsx');
const overview=read('app/foundation-writing-course.tsx');
const model=read('domain/course-p1.ts');
const sidebar=home.split('{heading:"SKILL LIBRARY"')[1]?.split('{heading:"ASSESSMENTS & EXAM PREP"')[0]??'';
assert(sidebar.includes('key:"writing",label:"Writing"'),'Writing skill must stay on left');
assert(!/label:"Foundation Writing · U\d\d"/.test(sidebar),'12 unit links must leave left navigation');
assert(home.includes('<FoundationDemo')&&home.includes('writingIntro={view==="writing"?<div'),
 'Existing Writing overview + recommendation, progress, full catalog must not be replaced');
assert(home.includes('>Writing Studio</button>')&&home.includes('onClick={()=>void navigate("writing-any-topic")}>Writing Studio</button>'),
 'Writing Studio opens original optional Any Topic Writing');
assert(home.includes('onClick={()=>void navigate("writing-course")}>Foundation Writing</button>'),
 'Foundation Writing button opens shared course overview');
assert(!home.includes('Start Foundation Writing · 12 Units available'),
 'obsolete Writing CTA should never reappear');
assert(home.includes('onContinue={()=>void (async()=>{if(await selectCourse(WRITING_COURSE_ID))await navigate(\'writing-course\')})()}'),
 'My Courses must share the same course overview route');
assert(home.includes('view==="writing-course"&&<FoundationWritingCourse') &&
       home.includes('onUnit={id=>void navigate('),
 'Course view must list and open real U01–U12 and not legacy Week 1–12');
assert(overview.includes('FOUNDATION_UNIT_IDS.map')&&overview.includes('onUnit(id)'),
 'overview shows every real Foundation Unit');
assert(overview.includes('savedFoundationUnitIds({foundationWritingV1:work})'),
 'overview status must derive from the exact saved Foundation Writing state');
assert(courses.includes('aria-label="Foundation Writing course"') &&
       !courses.includes('English Writing Coach') &&
       !courses.includes('Next Week 1 step'),
 'My Courses must replace the old 12-week course');
assert(home.includes('onExit={()=>void navigate("writing-course")}'),
 'Unit exit must return to course overview with the saved-draft guard');
for(const component of [
 'app/foundation-writing-u01.tsx',
 'app/foundation-writing-u02-u03.tsx',
 'app/foundation-writing-u04-u06.tsx',
 'app/foundation-writing-u07-u09.tsx',
 'app/foundation-writing-wave4.tsx',
]){
 assert(read(component).includes('>Back to Foundation Writing</button>'),'unit Back label: '+component);
}
assert(!model.includes('state?.completed'),'legacy Week 1 scores cannot drive Foundation progress');
const compiled=ts.transpileModule(model,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const mod={exports:{}};
new Function('module','exports',compiled)(mod,mod.exports);
const {writingCourse,savedFoundationUnitIds,myCourses,WRITING_COURSE_ID}=mod.exports;
const legacyOnly={completed:[0,1,2,3],writing:'Old 12-week learner draft'};
assert.equal(writingCourse(legacyOnly).completedRequired,0,'old 12-week completion flags ignored');
assert.equal(writingCourse(legacyOnly).title,'Foundation Writing');
const saved={...legacyOnly,foundationWritingV1:{schemaVersion:1,units:{
 'FW-U01':{draft:{text:'current'},versions:[{version:1,signature:'immutable'}]},
 'FW-U02':{draft:{text:'unsaved'},versions:[]},
 'FW-U09':{versions:[{version:1}],firstDraftV1:{text:'original',version:1,savedAt:1}},
 'FW-U12':{versions:[{version:1}]},
}}};
assert.deepEqual(savedFoundationUnitIds(saved),['FW-U01','FW-U09','FW-U12']);
assert.equal(writingCourse(saved).progressLabel,'3/12 units with saved work');
assert.equal(writingCourse(saved).nextActivity,'Unit 02');
assert.equal(myCourses(saved,{activeCourseId:WRITING_COURSE_ID,revision:2,courseV1:1,lastRequestId:'old-record'}).activeCourse.title,'Foundation Writing',
 'existing course selection must project the new course without rewriting the selection ID');
assert.equal(saved.foundationWritingV1.units['FW-U09'].firstDraftV1.text,'original','read-only projection leaves immutable Draft V1 intact');
assert.equal(writingCourse({...saved,foundationWritingV1:{schemaVersion:99,units:saved.foundationWritingV1.units}}).completedRequired,0,
 'unknown saved schemas must never be treated as valid progress');
console.log('PASS: existing Writing page intact; two labels + destinations; no sidebar clutter; My Courses shared overview; U01–U12 preserved; legacy data ignored safely; saved version progress only.');
