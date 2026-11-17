'use strict';
// NotebookLM SLE-ANYTOPIC-WRITING-GEMINI-ACADEMIC-R0-20261117:
// MF-01/02/03/04 regression. Synthetic provider only; NO live Gemini.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/any-topic-academic-r1';
const registry=require(path.join(root,'ai/prompts/registry.json'));
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
assert.equal(registry['any-topic-writing'].version,'1.0.0');
assert.match(registry['any-topic-writing'].system,/general self-learning audience across CEFR levels/);
assert.match(registry['any-topic-writing'].system,/scores set to null/);
assert.match(registry['any-topic-writing'].system,/Follow the trusted responseLanguage field/);
assert.match(registry['any-topic-writing'].system,/Use safe Markdown formatting/);
assert.doesNotMatch(registry['writing-teaching'].system,/11.12.year.old learner/i);
assert.match(read('app/writing-ai-review.tsx'),/Provisional AI feedback/);
assert.doesNotMatch(read('app/writing-ai-review.tsx'),/Verified AI response/);
assert.match(read('app/any-topic-writing-review.tsx'),/reviewMode="any-topic"/);
assert.match(read('app/any-topic-writing-review.tsx'),/responseLanguage=\{showVi \? 'vi' : 'en'\}/);
assert.match(read('app/home-client.tsx'),/AnyTopicWritingReview showVi=\{!!state.vietnameseSupport\}/);
assert.match(read('app/writing-ai-review.tsx'),/reviewMode!=='any-topic'/);
assert.match(read('app/writing-ai-review.tsx'),/parsed.scores===null&&parsed.level===null/);
assert.match(read('infrastructure/browser/client-services.ts'),/tutor\.coach\('any-topic'/);

fs.rmSync(path.join(root,out),{recursive:true,force:true});
execFileSync(process.execPath,[
  path.join(root,'node_modules/typescript/bin/tsc'),
  'ai/service.ts','ai/contracts.ts','ai/teaching-validation.ts','ai/validation.ts','domain/ai-metadata.ts',
  '--outDir',out,'--module','commonjs','--target','es2022',
  '--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}\n');
const {createTutorService}=require(path.join(root,out,'ai/service.js'));
const draft='I go to the beach last Sunday. The water was cold but I enjoyed the trip.';
const good=()=>({
 summary:'**Task response:** Your trip is clear.',
 strengths:['You describe how you felt.'],
 improvements:['Check the time phrase and verb tense.'],
 exercise:'Write one more sentence about the trip.',
 tags:['past-tense'],
 corrections:[{original:'I go to the beach last Sunday.',why:'Last Sunday refers to the past.',hint:'Use the past form of go.'}],
 scores:null,level:null,canEstimateLevel:false,
});
let output=good(),lastRequest=null,failures=[];
const tutor=createTutorService({
 available:true,
 reportFailure:k=>failures.push(k),
 async generate(req){lastRequest=req;return {provider:'firebase-ai-logic',model:'synthetic-model',result:output}},
});
async function test(){
 const reply=await tutor.coach('any-topic','Describe your last trip.',{draft},{responseLanguage:'vi'});
 assert(reply,'Valid unscored feedback should be accepted');
 assert.equal(lastRequest.purpose,'any-topic-writing');
 assert.equal(lastRequest.promptVersion,'1.0.0');
 assert.equal(lastRequest.input.responseLanguage,'vi');
 assert.equal(reply.structuredResult.scores,null);
 assert.equal(reply.structuredResult.level,null);
 assert.equal(reply.structuredResult.canEstimateLevel,false);
 assert.equal(reply.structuredResult.corrections[0].original,'I go to the beach last Sunday.');
 assert.match(lastRequest.instructions,/untrusted DATA/);
 assert.match(lastRequest.instructions,/never invent mistakes/);
 for(const changes of [
   {scores:{grammar:9}}, {level:'C2'}, {canEstimateLevel:true},
   {corrections:[{original:'Not actually in the essay',why:'Wrong',hint:'Try again.'}]},
   {corrections:[{original:'I go to the beach last Sunday.',why:'Wrong',hint:''}]},
   {corrections:[...good().corrections,...good().corrections,...good().corrections,...good().corrections]},
 ]) {
   output={...good(),...changes};
   assert.equal(await tutor.coach('any-topic','Describe your last trip.',{draft},{responseLanguage:'en'}),null,
      'Any Topic must fail closed on scores/levels/ungrounded corrections');
 }
 assert(failures.length>=6,'Bad structured results must emit invalid-response');
 output={summary:'Useful guidance.',strengths:[],improvements:[],exercise:'Try again.',tags:[],corrections:[],scores:null};
 await tutor.coach('revision','Compare two drafts',{originalText:'hi',revisedText:'hello'},{responseLanguage:'en'});
 assert.equal(lastRequest.purpose,'revision-coaching','Other Writing modes must keep their own prompt');
 await tutor.teachWriting('Hello there','Say hello',{});
 assert.equal(lastRequest.purpose,'writing-teaching','Existing scored Writing path remains separate');
 console.log('PASS any-topic-writing-academic-r1: independent qualitative prompt, VI/EN, fail-closed scores, exact correction quotes, other Writing paths preserved; zero live AI calls');
}
test().catch(error=>{console.error(error);process.exitCode=1});