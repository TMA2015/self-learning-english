'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const home=read('app/home-client.tsx'),tutor=read('app/english-lesson-tutor.tsx'),bridge=read('infrastructure/browser/firebase-ai-browser.ts'),css=read('app/globals.css');
assert(home.includes("<EnglishLessonTutor")&&home.includes('writing-foundations'));
assert(!home.includes('view==="diagnostic"&&<EnglishLessonTutor'));
assert(!tutor.includes('window.getSelection()'),'Only explicit lesson notes are transmitted, not hidden learner answers');
assert(tutor.includes('focus:safeFocus'),'Tutor uses bounded explicit knowledge context');
assert(home.includes('blockScreen==="learn"')&&home.includes('laterScreen==="learn"'),'Only Writing lesson Learn screens show the tutor');
assert(read('app/foundation.tsx').includes("screen==='overview'&&<EnglishLessonTutor"),'All foundation skills expose tutor on notes only');
assert(!read('app/foundation.tsx').includes("screen==='practice'&&<EnglishLessonTutor"),'No tutor while submitting an active Foundation assessment');
assert(tutor.includes('setQuestion(e.target.value.slice(0,300))'));
assert(tutor.includes('Your question is sent only when you ask'));
assert(tutor.includes("result.status==='answered'"));
assert(bridge.includes("await getToken(appCheckInstance)"));
assert(bridge.includes("model:config.geminiModel"));
assert(bridge.includes("maxOutputTokens:1400"));
assert(bridge.includes("lessonLifecycle.run("));
assert(!tutor.includes("innerHTML"));
assert(css.includes(".english-lesson-ai-panel"));

// Run the production CEFR prompt builder for every instructional target.
const ts=require('typescript'),vm=require('node:vm'),guidance={};
const transpiled=ts.transpileModule(read('domain/lesson-tutor-guidance.ts'),{
 compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
}).outputText;
vm.runInNewContext(transpiled,{exports:guidance});
for(const [target,marker] of [
 ['A1','short sentences'],['A2','familiar situations'],['B1','contextual example'],
 ['B2','meaning, tone and accuracy'],['C1','natural collocations'],['C2','pragmatic implications'],
]){
 assert.equal(guidance.normalizeLessonCEFR(target.toLowerCase()),target);
 const prompt=guidance.lessonTutorSystemInstruction(target);
 assert(prompt.includes(marker),'Missing target-specific guidance for '+target);
 assert(prompt.includes('lesson')&&prompt.includes('responseLanguage'));
 assert(prompt.includes('Do not reveal direct answers or keys to active assessment items'));
 assert(prompt.includes('if asked to solve an active test item, explain the underlying concept'));
 assert(prompt.includes('similar, distinct worked example instead'));
 assert(prompt.includes('English target expressions, key terms, and examples in English'));
 assert(prompt.includes('Use clean Markdown formatting (bolding, bullet lists)'));
 assert(prompt.includes('For Reading and Writing contexts, guide evidence discovery or structural planning'));
 assert(!prompt.includes('12-year-old')&&!prompt.includes('A1-B1'));
}
for(const invalid of ['',null,undefined,'A3','C3','A1-B2','A10','junk']){
 assert.equal(guidance.normalizeLessonCEFR(invalid),null);
 assert(guidance.lessonTutorSystemInstruction(invalid).includes('No declared CEFR target'));
}
assert(bridge.includes('normalizeLessonCEFR(input.cefrTarget)'));
assert(bridge.includes('lessonTutorSystemInstruction(targetCEFR)'));
assert(bridge.includes('...(targetCEFR?{targetCEFR}:{})'));
assert(tutor.includes('cefrTarget'));
assert(read('app/foundation.tsx').includes('cefrTarget={lesson.cefr_target}'),
 'Foundation lessons must forward explicit CEFR teaching target');
assert(!bridge.includes('learning A1-B1 English'),
 'The old fixed teaching range must not remain in the active Gemini prompt');
console.log(JSON.stringify({result:'PASS',suite:'english-tutor-knowledge-only',cefrTargetsCovered:6,unlabeledFallback:true,hasLiveGeminiProof:false,noAssessmentLeak:true}));
