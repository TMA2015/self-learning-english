'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const component=read('app/writing-ai-review.tsx');
const services=read('infrastructure/browser/client-services.ts');
const browser=read('infrastructure/browser/firebase-ai-browser.ts');
const foundation=read('app/foundation.tsx');
const b=read('app/writing-course-v2-b.tsx');
const c=read('app/writing-course-v2-c.tsx');
const home=read('app/home-client.tsx');
assert(component.includes("status==='validated'")&&!component.includes('Automatically graded'));
assert(component.includes('Only clicking this button sends'));
assert(!component.includes('GEMINI_API_KEY')&&!component.includes('serviceAccount')); // no credential path
assert(component.includes('Get AI feedback'));
assert(component.includes('sourceSample')&&component.includes('provisional'));
assert(component.includes('localStorage.setItem')&&component.includes('fingerprint(signature)'));
assert(component.includes("latestSignature.current!==requestedSignature"),'Stale Gemini response must not grade edited text');
assert(b.includes("<WritingAIReview")&&b.includes("week===5?'draft':'planning'"));
assert(c.includes("<WritingAIReview")&&c.includes("sourceSample={revision?.sourceSample??work.source?.ownership==='sample'}"),'Sample-based authorship must come from the saved revision when available');
assert(foundation.includes("<WritingAIReview")&&foundation.includes("attempt.status==='pending_review'"));
assert(services.includes("tutor.teachWriting(draft,task")&&services.includes("tutor.coach(kind==='revision'?'revision':'analysis',task"));
assert(services.includes("scores:null,level:null"),'Revision coaching must not assign scores or level');
const registry=require('../ai/prompts/registry.json');
assert.equal(registry['revision-coaching'].status,'active');
assert.equal(registry['revision-coaching'].version,'1.1.0');
for(const required of ['sourceOwnership','originalText','revisedText','no-change','No numeric scores','Sample Student Draft']){
 assert(registry['revision-coaching'].system.includes(required),'Revision AI prompt must cover '+required);
}
for(const required of ['Follow the trusted responseLanguage field if provided','Use safe Markdown formatting (bolding, bullet lists)',"'corrections' MUST be an empty array []","'scores' MUST be null",'briefly quote the stated revisionGoal']){
 assert(registry['revision-coaching'].system.includes(required),'NotebookLM correction missing: '+required);
}
const serviceSource=read('ai/service.ts');
assert(serviceSource.includes("stage==='revision'?'revision-coaching':'feedback'"));
assert(serviceSource.includes("scores:stage!=='revision'"));
const laterPage=read('app/writing-course-v2-c.tsx');
assert(laterPage.includes('revisionAIContext(week,work)'));
assert(laterPage.includes("kind={editing?'revision':'draft'}"));
assert(laterPage.includes("responseLanguage={showVi?'vi':'en'}"));
assert(services.includes("...(kind==='revision'?{responseLanguage}:{})"));
assert(component.includes("const signature=JSON.stringify([task,fields,kind,...(kind==='revision'?[responseLanguage]:[])]);"));
assert(component.includes('requestWritingAI(task,fields,kind,responseLanguage)'));
assert(component.includes('<TeachingBlocks text={feedback.summary}/>'));
assert(component.includes('<Inline text={s}/>'));
assert(laterPage.includes('enabled={saved&&!busy&&!error&&(!editing||!!revision)}'));
assert(services.includes("status:'unavailable'")&&services.includes("scores:null,level:null"));
assert(browser.includes("resetAIFailure")&&browser.includes("readAIFailure"));
assert(browser.includes('await getToken(appCheckInstance)'));
assert(read('infrastructure/ai/firebase-request-lifecycle.ts').includes('timeoutMs=60_000'),'Slow Gemini requests need sixty-second deadline');
assert(browser.includes("SafeProviderError('app-check-permission')"));
assert(browser.includes("maxOutputTokens:2400")&&!/generationConfig:\s*\{[^}]*temperature\s*:/s.test(browser));
assert(!home.includes('>Private preview</span>'));
assert(home.includes('✦ AI Writing · optional'));
console.log(JSON.stringify({status:'PASS',suite:'writing-ai-on-demand',weeklyCoaching:'weeks 2–12',foundationWriting:'optional',statusTruthful:true,liveGeminiCalls:0}));
