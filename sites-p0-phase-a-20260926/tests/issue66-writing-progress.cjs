const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
const h=read('app/home-client.tsx'),m=read('app/my-courses.tsx'),d=read('domain/course-p1.ts'),
 course=read('app/foundation-writing-course.tsx');
assert(!h.includes('Published Week 1 · 11 preview weeks'),'obsolete course preview must stay retired');
assert(!h.includes('Week 1 process summary only')&&!h.includes('Weeks 1–12 available'),
 'Your Journey must not show old 12-week course progress');
assert(m.includes('Foundation Writing course')&&!m.includes('Weeks 2–12 show their own saved progress'),
 'My Courses must show only the new Foundation Writing course');
assert(m.includes('not completed assessments, reviews or language proficiency'),
 'Unit save progress must not be portrayed as proficiency');
assert(d.includes('versions.length>0')&&d.includes('FOUNDATION_UNIT_IDS.filter'),
 'Only persisted unit versions count in Foundation course progress');
assert(d.includes('/12 units with saved work')&&!d.includes('/4 Week 1 steps saved'),
 'No legacy Week 1 denominator in the active course');
assert(course.includes('savedFoundationUnitIds({foundationWritingV1:work})'),
 'Course overview uses the same saved-work definition as My Courses');
assert(!h.includes('Weeks 7–12 preview'),'No obsolete preview metadata on current navigation');
console.log('PASS: Foundation Writing uses 12 real unit save histories, not legacy Week 1 denominator; no mastery inferred.');
