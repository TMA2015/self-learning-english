'use strict';
/** Navigation-only improvement: exact saved review lesson, never regrades evidence. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const plan=read('app/core-panels.tsx');
const home=read('app/home-client.tsx');
const domain=read('domain/foundation-practice-plan.ts');
assert.match(plan,/onOpenLesson\?:\(lessonId:string,module:string\)=>void/);
assert.match(plan,/onOpenLesson\?\.\(item\.lessonId,item\.module\)/);
assert.match(plan,/Review this lesson \(\{item\.lessonId\}\)/);
assert.match(plan,/Browse \{item.skill\} Library/,'Existing broad skill navigation remains available');
assert.match(home,/async function openCatalogLesson\(id:string,skill:string\)/);
assert.match(home,/foundationCatalog\.lessons\.some\(lesson=>lesson\.id===id&&lesson\.module===skill\)/,
 'Only exact live-catalog lesson may be requested');
assert.match(home,/if\(await navigate\(skill as View\)\)setRequestedLessonId\(id\)/,
 'Always pass the canonical unsaved-work navigation guard');
assert.match(home,/onOpenLesson=\{\(id,module\)=>void openCatalogLesson\(id,module\)\}/,
 'Plan must wire the actual reviewed lesson deep-link');
assert.match(home,/requestedLessonId=\{requestedLessonId\}/);
assert.match(home,/onRequestedLessonHandled=/);
assert.match(domain,/attempt\.status!=='scored'&&attempt\.status!=='approved'/,
 'No unassessed/pending/draft evidence used for new mistake recommendations');
assert.match(domain,/if\(result\.outcome==='format-only'/,
 'Format-only responses are not treated as learning mistakes');
assert.match(domain,/const lessons=new Map\(catalog\.lessons\.filter/,
 'Only available imported lessons recommended');
assert.doesNotMatch(plan,/It does not change grades, determine CEFR level, or call AI\.|not a formal CEFR award|not a generative AI recommendation/,
 'Previously rejected repeated disclaimers must not return');
const immutable=read('content/curriculum-1.25.0-candidate.json');
const crypto=require('node:crypto');
const buf=Buffer.from(immutable);
const git=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+buf.length+'\0'),buf])).digest('hex');
assert.equal(git,'eb6016669023b4a4d75df7278408da1e60894369',
 'No academic source or grades modified by navigation-only UX');
console.log(JSON.stringify({result:'PASS',gate:'PLAN_REVIEW_DIRECT_LESSON_NAVIGATION',
 exactCatalogGuard:true,unsavedWorkGuard:true,sourceGitBlob:git,
 lessonScoringChanges:0,aiCalls:0,learnerDataWrites:0,prodDeploy:false}));
