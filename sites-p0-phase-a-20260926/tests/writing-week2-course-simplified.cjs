'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const domain=read('domain/writing-course-v2-b.ts');
const app=read('app/writing-course-v2-b.tsx');
const guide=read('app/writing-week2-course-simplified.tsx');
const w2=domain.slice(domain.indexOf('{week:2,'),domain.indexOf('{week:3,'));
assert(w2.length>1000,'Missing canonical Week 2 definition');
for(let n=1;n<=4;n++)assert(w2.includes('item(2,'+n+','),'Missing canonical MCQ '+n);
assert.equal((w2.match(/item\(2,[1-4],/g)||[]).length,4);
for(const k of ['ideas','reject','best','fit'])assert(w2.includes("key:'"+k+"'"),'Missing field '+k);
assert.equal((w2.match(/key:'(?:ideas|reject|best|fit)'/g)||[]).length,4);
for(const component of ['Week2CourseLearn','Week2CourseGuidedIntro','Week2CourseGuidedBridge','Week2CourseMain','Week2CourseFeedback','Week2CourseTransfer'])
 assert(app.includes(component),'New Week 2 component not integrated: '+component);
assert(!app.includes('Week2CourseRepair')&&!app.includes('Week2CourseMainGuide'),'Obsolete R0 components still wired');
assert(app.includes("week===2?(screen==='main'?<Week2CourseMain"),'Main and Feedback must be distinct');
assert(guide.includes('YOUR PLAN · READ-ONLY')&&guide.includes('YOUR IDEAS · WRITE HERE'));
for(const [id,label] of [['park','E1 · Park'],['museum','E2 · Museum'],['library','E3 · Library']])
 assert(guide.includes("id:'"+id+"'")&&guide.includes(label),'Missing tracked example '+label);
for(const word of ['Topic','Task','Must include','Boundary','Fits the task','Needs explanation → Repair','Off topic','One possible sentence:'])
 assert(guide.includes(word),'Missing explicit instruction part '+word);
assert(guide.includes('showVi&&')&&guide.includes('vi-help'));
assert(!guide.includes('Optional Vietnamese help'),'No second Vietnamese toggle');
assert(!guide.includes('Optional extra check · Science museum'),'No repeated museum check');
assert(!app.includes('Optional older lunchtime-club examples'),'No obsolete club examples');
assert(!guide.includes('(not a test question)'),'No redundant exam disclaimer');
assert(!/fetch\s*\(|GoogleAIBackend|Gemini|localStorage|sessionStorage|indexedDB/.test(guide),'No learner text egress');
assert(guide.includes('not saved')&&guide.includes('not saved or graded'),'Honest ephemeral work');
for(const unsupported of ['70%','30% retention','C1/C2','consequently','furthermore'])
 assert(!guide.toLowerCase().includes(unsupported.toLowerCase()),'Unsupported claim/vocabulary: '+unsupported);
assert(guide.includes('export function Week2CourseReflect'),'R2 reflection component required');
assert(app.includes("<Week2CourseFeedback")&&app.includes('WeekModelComparison'),'Keep model gate and real history');
console.log(JSON.stringify({result:'PASS',test:'writing-week2-course-simplified',version:'R2',guards:['canonical Week 2','3 stable examples','four thinking steps','real read-only feedback','global Vietnamese','default-OFF AI','clean instructional UI']}));
