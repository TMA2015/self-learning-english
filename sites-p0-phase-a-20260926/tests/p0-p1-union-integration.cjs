'use strict';
/**
 * Integration release contract for three independent feature Drafts:
 * #137 P0 offline lesson feedback, Writing Review, Foundation learning plan
 * #139 reviewed A2-U10 read-only summary, #140 NotebookLM PASS reference.
 * No production writes. Real Safari/iPad and learner records remain owner gates.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const home=read('app/home-client.tsx');
const player=read('app/foundation.tsx');
const platform=read('app/platform.tsx');
const plan=read('app/core-panels.tsx');
const unit=read('app/unit-browser.tsx');
const referenceUI=read('app/reference-library.tsx');
const referenceDomain=read('domain/reference-library.ts');
const referenceJSON=JSON.parse(read('content/reference-library-pilot-v1.json'));
const runner=read('scripts/qa-free-first.mjs');
const workflow=read('../.github/workflows/english-pr-qa.yml');

const exactly=(source,pattern,n,label)=>assert.equal((source.match(pattern)||[]).length,n,label);
// Existing Writing route must remain a single page and not become a second app.
exactly(home,/<WritingHome\b/g,1,'Only one existing WritingHome slot');
exactly(home,/<AnyTopicWritingReview\/>/g,1,'Independent Writing Review opens in current app');
assert(home.includes('onAnyTopic={()=>void navigate("writing-any-topic")}'));
assert(home.includes('import {OfflineLessonReview')===false,
 'Post-submit component stays inside original Foundation player, not a duplicate shell');
assert(player.includes("import {OfflineLessonReview}"));
assert(player.includes('<OfflineLessonReview'));
assert(read('app/any-topic-writing-review.tsx').includes('localStorage.setItem'),
 'Existing independent Writing drafts stay local');
assert(home.includes('planFoundationLoading')&&home.includes('foundationCatalog={foundationCatalog}'));
assert(home.includes('foundationLoading={planFoundationLoading}'));
assert(plan.includes('foundationPracticeAdvice(foundationCatalog)'));
assert(read('domain/foundation-practice-plan.ts').includes('format-only'));

// NotebookLM Option B: no second A2-U10 exam or imported media.
assert(unit.includes('A2-U10 transfer learning review'));
assert(unit.includes("selected?.id==='A2-U10'"));
assert(unit.includes('a2Unit10TransferSummary(selected.id,selected.lessons,attempts)'));
assert(unit.includes('onOpenLesson(item.id,latest)'),
 'Existing version-aware unit lesson navigation must stay intact');
const unitDomain=read('domain/a2-u10-transfer-summary.ts');
for(const id of ['REA-A2-08','LIS-A2-07','WRI-A2-07'])
 assert(unitDomain.includes(id),id+' old transfer lesson required');
assert(!/createAttempt|saveAttempt|fetch\(|localStorage|mediaRequest/i.test(unitDomain),
 'A2-U10 is read-only display, not a new assessment');

// Reference Library: sibling route in same shell, not another site.
exactly(home,/<ReferenceLibrary\b/g,1,'Exactly one reference route');
assert(home.includes('key:"reference",label:"Reference Library"'));
assert(home.includes('if(await navigate(skill))setRequestedLessonId(id)'),
 'Reference-to-lesson jump must respect global navigation guard');
assert(home.includes('requestedLessonId={requestedLessonId}'));
assert(home.includes('onRequestedLessonHandled='));
assert(player.includes('!requestedLessonId||!catalog?.imported'),
 'Reject links when local lesson catalog missing');
assert(player.includes('l.id===requestedLessonId&&(!skill||l.module===skill)'),
 'Reject links to different skill or unknown lesson');
assert(player.includes('void open(requestedLessonId)'),
 'Reuse existing version-pinned canonical lesson');
assert(player.includes("Play the full audio for this attempt before submitting."),
 'Original Listening submit gate preserved');
assert(referenceUI.includes("catalog?.imported?availableRelatedLessons"));
assert(referenceUI.includes('aria-pressed={kind===group.id}'));
assert(referenceUI.includes("26/26 entries academically reviewed"));
assert(referenceDomain.includes('...(e.search_keywords??[])'));
assert(referenceJSON.review_status==='NOTEBOOKLM_PASS_26_OF_26');
assert.equal(referenceJSON.entries.length,26);
assert(!referenceUI.includes('requestWritingAI')&&!referenceUI.includes('evaluateWritingProcess'),
 'Reference is lookup only; neither AI nor grading');
for(const e of referenceJSON.entries){
 assert(!('answers' in e)&&!('answer_key' in e)&&!('transcript' in e)&&!('attempts' in e),
  e.id+' must not embed scored test, transcript, or learner work');
}

// Release gate remains stronger than a component's isolated QA result.
for(const test of [
 'offline-lesson-postfeedback.cjs','any-topic-writing-review-shell.cjs',
 'foundation-practice-plan.cjs','p0-integration-safety.cjs',
 'p0-writing-review-browser.cjs','a2-u10-transfer-summary.cjs',
 'reference-library-pilot.cjs','reference-library-browser.cjs',
 'p0-p1-union-integration.cjs'
])assert(runner.includes('"'+test+'"'),test+' must be mandatory on combined full QA');
assert(workflow.includes('Ensure FFmpeg and FFprobe for audio validation'));
assert(workflow.includes('ffprobe -hide_banner -version'));
assert(workflow.includes('Full application release QA and static build (NO DEPLOY)'));
assert(platform.includes('onAnyTopic'),'WritingHome optional link preserved');
console.log(JSON.stringify({
 result:'PASS',gate:'P0-P1-Combined-Routes-Data-Safety',
 composedPRs:[137,139,140],existingPlayer:true,
 writingDraftLocalOnly:true,planRealAttemptReadonly:true,
 unitOldLessonsOnly:true,referenceAcademicPass:true,
 referenceSearchLocal:true,canonicalLinksGuarded:true,
 audioGateUnchanged:true,productionWrites:0,
 actualRealIPadSafari:'NOT_TESTED',mergeDeploy:'NO'
}));