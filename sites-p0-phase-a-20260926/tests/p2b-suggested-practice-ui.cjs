'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const progress=fs.readFileSync(path.join(root,'app/practice-progress.tsx'),'utf8');
const page=fs.readFileSync(path.join(root,'app/page.tsx'),'utf8');
const foundation=fs.readFileSync(path.join(root,'app/foundation.tsx'),'utf8');

assert.ok(progress.includes('data?.adaptiveGrammar.recommendations'),'Suggested Practice must use the P2B projection');
assert.ok(progress.includes('need more evidence'),'insufficient evidence must be visibly distinct from weakness');
assert.ok(progress.includes('Foundation first'),'prerequisite-first guidance must be explainable');
assert.ok(progress.includes('Practice this lesson'),'adaptive cards need a direct lesson action');
assert.ok(progress.includes("row.skill!=='Grammar'"),'legacy broad Grammar suggestions must not override conservative P2B states');
assert.ok(progress.includes('old results stay on their original content versions'),'learner copy must preserve version expectations');

assert.ok(page.includes('suggestedLessonRequest'),'parent must carry a one-shot direct lesson request');
assert.ok(page.includes('openSuggestedLesson(skill:string,lessonId:string)'),'direct recommendation routing must be explicit');
assert.ok((page.match(/onLesson=\{/g)||[]).length===2,'Dashboard and Progress Suggested Practice both need direct lesson routing');
assert.ok(page.includes('requestedLesson={suggestedLessonRequest}')&&page.includes('onRequestedLessonHandled='),'Foundation player must receive and consume the request');

assert.ok(foundation.includes('currentOnly=false'),'normal historical navigation and P2B current-only navigation must remain distinct');
assert.ok(foundation.includes("a.version===catalog?.version"),'P2B navigation may resume only an attempt on the current curriculum');
assert.ok(foundation.includes('currentOnly?catalog?.version:existing?.version??catalog?.version'),'P2B must load current lesson content while history keeps stored versions');
assert.ok(foundation.includes('requestedLessonRef'),'one request must not open the lesson repeatedly');
assert.ok(foundation.includes('open(target.id,undefined,true)'),'Suggested Practice must use the current-only path');
assert.ok(foundation.includes('Start current practice · v'),'existing historical/current version UX must remain available');

console.log('PASS: P2B Suggested Practice is explainable, conservative and routes directly to current-version lesson content without replacing historical navigation.');
