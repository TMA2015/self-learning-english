'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const domain=read('domain/writing-course-v2-b.ts');
const app=read('app/writing-course-v2-b.tsx');
const guide=read('app/writing-week2-course-simplified.tsx');
const readQuestions=domain.slice(domain.indexOf('{week:2,'),domain.indexOf('{week:3,'));
assert(readQuestions.length>1000,'Week 2 data block must exist');

// These are the four existing question IDs, not new quiz content.
for(let n=1;n<=4;n++)assert(readQuestions.includes("item(2,"+n+","),'Original MCQ '+n+' missing');
assert.equal((readQuestions.match(/item\(2,[1-4],/g)||[]).length,4,'Week 2 must retain exactly four MCQs');
for(const name of ['ideas','reject','best','fit']){
 assert(readQuestions.includes("key:'"+name+"'"),'Canonical Week 2 field missing: '+name);
}
assert.equal((readQuestions.match(/key:'(?:ideas|reject|best|fit)'/g)||[]).length,4,
 'Exactly four canonical Week 2 fields required');
assert(app.includes('Week2CourseLearn')&&app.includes('Week2CourseRepair'),
 'Week 2 theory and short repair bridge must be integrated');
assert(app.includes('Week2CourseMainGuide')&&app.includes('Week2CourseSelfCheck')&&app.includes('Week2CourseTransfer'),
 'All approved course guidance stages must be integrated');
assert(app.includes('week===2?')&&app.includes('AI review is disabled for Week 2'),
 'Week 2 must not access optional semantic AI review');
assert(!/fetch\s*\(|GoogleAIBackend|Gemini|localStorage|sessionStorage|indexedDB/.test(guide),
 'Guided components must not perform AI, network or storage operations');
assert(/museumWhy\.trim\(\)/.test(guide),'Museum explanation must require an initial attempt');
assert(/!attempt\.trim\(\)/.test(guide),'Repair reveal must require an initial attempt');
assert(/NOT saved/.test(guide),'Transfer scratch must declare its persistence limitation');
for(const wrong of ['70%','30% retention','C1/C2','consequently','furthermore'])
 assert(!guide.toLowerCase().includes(wrong.toLowerCase()),'Rejected copy found: '+wrong);
for(const topic of ['neighbourhood park','recycling team','after-school','community centre'])
 assert(guide.includes(topic),'Expected distinct task context missing: '+topic);
console.log(JSON.stringify({result:'PASS',test:'writing-week2-course-simplified',checks:'canonical ids/fields, integration, AI isolation, honest copy, evidence boundaries'}));
