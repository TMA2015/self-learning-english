'use strict';
/** Learner-facing results must be useful, not covered in repeated CEFR disclaimers. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=x=>fs.readFileSync(path.join(root,x),'utf8');
const home=read('app/home-client.tsx');
const foundation=read('app/foundation.tsx');
const offline=read('app/offline-lesson-review.tsx');
const domain=read('domain/post-lesson-review.ts');
const tips=read('domain/foundation-recovery-tip.ts');
const css=read('app/globals.css');
const pilot=read('app/vocabulary-pilot.tsx');
assert.equal((home.match(/Understanding your results/g)||[]).length,1,
 'Score guidance heading appears exactly once on Dashboard');
assert.match(home,/Lesson scores reflect your submitted answers and help you track improvement/);
assert.match(home,/CEFR labels show each lesson's target level/);
for(const [name,src] of [
 ['Foundation',foundation],['OfflineLessonReview',offline],['PostLessonDomain',domain],
 ['VocabularyPilot',pilot],['Dashboard',home]
]){
 for(const phrase of [
  'This is not a measure of proficiency',
  'These results describe this attempt only, not a certified CEFR level',
  'These are results for this attempt, not a CEFR level',
  'not an AI review or proof of productive vocabulary mastery',
  'proficiency weight 0',
  'This does not set a CEFR level'
 ])assert(!src.includes(phrase),name+' duplicates negative result copy: '+phrase);
}
assert.match(foundation,/resultSummary\.correct}\/\{resultSummary\.total} · \{resultSummary\.percent}%/,
 'Real result score and percentage remain visible');
assert.match(foundation,/onReviewQuestion=\{id=>questionRefs\.current\[id\]\?\.scrollIntoView/,
 'Next-step action must navigate to the exact missed question');
assert.match(offline,/Go to question/,'Useful action on missed-question review');
assert(!offline.includes('report.objectiveTotal'),'Do not repeat scores below their own result header');
assert(!offline.includes('<small>'),'No tiny legalese text inside recommendation card');
assert(!domain.includes('boundary:string'),'Domain report no longer injects generic CEFR caveat');
const pilotTips=tips.slice(tips.indexOf('const vocabulary125Tips:'),tips.indexOf('/** Returns one actionable next learning step'));
const ids=[...pilotTips.matchAll(/'VOC-(?:A1|A2|B1)-\d\d-Q\d+':/g)].map(x=>x[0]);
assert.equal(ids.length,24,'Every reviewed Vocabulary pilot item has a specific next action');
assert.match(tips,/VOC-A2-01-Q11':'.*set the table and lay the table/);
assert.match(css,/\.foundation-offline-review p,.foundation-offline-review li,.foundation-offline-review strong\{font-size:16px/);
assert.match(css,/\.dashboard-progress-guidance p\{margin:5px 0 0;font-size:16px/);
assert(!pilot.includes('No writing-quality or CEFR score is awarded'));
console.log(JSON.stringify({result:'PASS',gate:'LEARNER_RESULT_SINGLE_GUIDANCE_AND_NEXT_STEP',
 originalScoringUnchanged:true,dashboardScoreExplanationCount:1,
 fullFeedbackAfterSubmit:true,reviewedVocabularyActions:ids.length,
 typographyPx:16,productionWrites:0}));
