"use strict";
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','domain/attempt-navigation.ts','--outDir','.sites-runtime/attempt-nav-test','--module','commonjs','--target','es2022','--skipLibCheck'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,'.sites-runtime/attempt-nav-test/package.json'),'{"type":"commonjs"}');
const location=['.sites-runtime/attempt-nav-test/attempt-navigation.js','.sites-runtime/attempt-nav-test/domain/attempt-navigation.js'].find(p=>fs.existsSync(path.join(root,p)));
assert.ok(location,'compiled selector missing');
const {latestAttemptForLesson,attemptStatusLabel,recentSkillWork,skillAttemptCount}=require(path.join(root,location));
const lessons=[{id:'GRA-A1-01',title:'Be',module:'grammar',cefr:'A1',minutes:20},{id:'GRA-A1-05',title:'There is and there are',module:'grammar',cefr:'A1',minutes:20},{id:'REA-A1-01',title:'Notice',module:'reading',cefr:'A1',minutes:20}];
const attempts=[
 {id:'old-sample',lessonId:'GRA-A1-01',status:'scored',createdAt:1},
 {id:'submitted-05',lessonId:'GRA-A1-05',status:'scored',createdAt:3},
 {id:'draft-05',lessonId:'GRA-A1-05',status:'started',createdAt:5},
 {id:'reading',lessonId:'REA-A1-01',status:'pending_review',createdAt:4}
];
assert.equal(latestAttemptForLesson(attempts,'GRA-A1-05').id,'draft-05');
assert.equal(latestAttemptForLesson(attempts,'GRA-A1-01').id,'old-sample');
assert.equal(latestAttemptForLesson(attempts,'absent'),undefined);
assert.equal(attemptStatusLabel(attempts[2]),'Draft · Resume');
assert.equal(attemptStatusLabel(attempts[1]),'Submitted · View result');
assert.equal(attemptStatusLabel(attempts[3]),'Submitted · Awaiting adult review');
assert.equal(attemptStatusLabel(), 'Not started');
assert.deepEqual(recentSkillWork(attempts,lessons,'grammar').map(x=>x.attempt.id),['draft-05','old-sample']);
assert.deepEqual(recentSkillWork(attempts,lessons,'reading').map(x=>x.attempt.id),['reading']);
assert.equal(skillAttemptCount(attempts,lessons,'grammar'),2);
assert.equal(skillAttemptCount(attempts,lessons,'reading'),1);
const source=fs.readFileSync(path.join(root,'app/foundation.tsx'),'utf8');
const page=fs.readFileSync(path.join(root,'app/page.tsx'),'utf8');
assert.ok(source.includes("screen==='catalog'&&<>"),'catalog should be isolated');
assert.ok(source.includes("screen==='overview'&&<>"),'overview should be isolated');
assert.ok(source.includes("screen==='practice'&&<>"),'practice should be isolated');
assert.ok(source.includes("setScreen('overview')"),'lesson selection opens overview');
assert.ok(source.includes("setScreen('practice')"),'start or resume practice opens player');
assert.ok(source.includes("await saveDraft()"),'unsaved draft must not be discarded');
const transitionEffect=source.split("useEffect(()=>{if(previousSkill.current===skill)")[1]?.split("},[skill]);")[0];
assert.ok(transitionEffect,'sidebar skill transition effect missing');
assert.equal(transitionEffect.split('await saveDraft()').length-1,1,'sidebar transition must save a draft once');
assert.equal(transitionEffect.split('void refresh().catch(').length-1,1,'sidebar transition refreshes Recent Work once without blocking saved navigation');
assert.equal(transitionEffect.split('await refresh()').length-1,0,'Catalog request must not block a saved skill switch');
assert.ok(transitionEffect.includes("if(attempt?.status==='started'&&!prepared)"),'already-prepared top route must not repeat save/refresh');
assert.ok(source.includes("if(next!==skill&&onSelectSkill)preparedSkillSwitch.current=next"),'top skill route records its completed pre-navigation save');
assert.ok(source.includes("const prepared=preparedSkillSwitch.current===skill;preparedSkillSwitch.current=null;"),'preparation marker must be consumed on transition');
assert.ok(source.includes("latestAttemptForLesson(catalog?.attempts??[],id)"),'lesson must use its own latest attempt');
assert.ok(source.includes("recentSkillWork(catalog.attempts,catalog.lessons,skill)"),'recent work is skill scoped');
assert.ok(source.includes('onClick={()=>void chooseSkill(l.module)}'),'seven cards select skills, not starter lessons');
assert.ok(!source.includes("complete?'Attempt saved'"),'ambiguous old label must be gone');
assert.ok(source.includes('Incorrect · Review explanation'),'completed mistakes must not imply editable old results');
assert.ok(page.includes('onSelectSkill={next=>navigate(next as View)}'),'connect child navigation to the existing app');
assert.ok(!source.includes('primary-skill-overlay-draft'),'do not attach unrelated math assessment');
console.log('PASS: latest per lesson, draft preference by recency, status, skill filtering, isolated views and single-refresh skill navigation.');
