'use strict';
/** Writing Studio scoring and reliability: synthetic Gemini; no live student data or provider. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const ts=require('typescript'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.sites-runtime/writing-studio-cefr-target');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const registry=require(path.join(root,'ai/prompts/registry.json'));
assert.equal(registry['any-topic-writing'].version,'2.0.0-scored');
assert.equal(registry['cefr-writing-coaching'].version,'0.2.0-scored');
for(const key of ['any-topic-writing','cefr-writing-coaching']){
 assert.match(registry[key].system,/six distinct IDs|six marks|six criteria/i);
 assert.match(registry[key].system,/integer 0–5/);
 assert.match(registry[key].system,/untrusted DATA/);
 assert.match(registry[key].system,/never output the learner's CEFR level/i);
}
assert.match(read('infrastructure/browser/firebase-ai-browser.ts'),/responseSchema:writingStudioOutputSchema/);
assert.match(read('infrastructure/browser/firebase-ai-browser.ts'),/writingStudioStructured\?3200:2400/);
assert.match(read('infrastructure/browser/firebase-ai-browser.ts'),/90_000/);
assert.match(read('app/writing-ai-review.tsx'),/feedbackSignature===signature/);
assert.match(read('app/writing-ai-review.tsx'),/Writing score: \{visibleFeedback.totalScore\}/);
assert(!read('app/any-topic-writing-review.tsx').includes('requestWritingAI('));
fs.rmSync(out,{recursive:true,force:true});
execFileSync(process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),
 'ai/service.ts','ai/contracts.ts','domain/writing-studio-reference.ts','domain/writing-studio-scoring.ts',
 'ai/teaching-validation.ts','ai/validation.ts','domain/ai-metadata.ts','--outDir',out,
 '--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}\n');
const {createTutorService}=require(path.join(out,'ai/service.js'));
const refs=require(path.join(out,'domain/writing-studio-reference.js'));
const scoring=require(path.join(out,'domain/writing-studio-scoring.js'));
const ids=refs.CEFR_WRITING_CRITERIA.map(x=>x.id);
const draft='I went to the beach on Sunday. I saw a small dog and helped its owner. It was a good day.';
const good=()=>({
 summary:'The writing addresses the prompt and can benefit from further detail.',
 strengths:['The ideas are understandable.'],improvements:['Add one concrete detail.'],
 exercise:'Write a sentence explaining why the experience was memorable.',
 tags:['narrative'],corrections:[],
 criteria:ids.map((criterion,i)=>({criterion,score:i===0?5:4,
  observation:'This text shows relevant performance for the chosen standard.',
  evidence:'I went to the beach on Sunday.',
  nextStep:'Add a precise detail independently.'})).reverse(),
});
let response=good(),lastRequest=null,failures=[];
const tutor=createTutorService({available:true,reportFailure:k=>failures.push(k),
 async generate(req){lastRequest=req;return {provider:'firebase-ai-logic',model:'synthetic',result:response}},
});
async function test(){
 const first=await tutor.coach('cefr-writing','Write about an experience.',{draft},{targetCEFR:'B1',responseLanguage:'vi'});
 assert(first,'Valid B1 scored text must be accepted');
 assert.equal(lastRequest.purpose,'cefr-writing-coaching');
 assert.equal(lastRequest.promptVersion,'0.2.0-scored');
 assert.match(lastRequest.instructions,/practice target is B1/,'Trusted CEFR B1 target must shape the score');
 assert.equal(lastRequest.input.learnerContext.targetCEFR,'B1');
 assert.equal(first.structuredResult.totalScore,25);
 assert.equal(first.structuredResult.maxScore,30);
 assert.deepEqual(first.structuredResult.criteria.map(x=>x.criterion),ids,'Order normalized');
 assert.equal(first.structuredResult.level,null,'No inferred user CEFR');
 assert.equal(first.structuredResult.scores['task-response'],5);
 const general=await tutor.coach('any-topic','Write about an experience.',{draft},{responseLanguage:'en'});
 assert(general);
 assert.equal(lastRequest.purpose,'any-topic-writing');
 assert.equal(lastRequest.promptVersion,'2.0.0-scored');
 assert.equal(general.structuredResult.framework,'general');
 assert.equal(general.structuredResult.totalScore,25);

 for(const patch of [
  {criteria:good().criteria.slice(0,5)},
  {criteria:good().criteria.map((x,i)=>i===0?{...x,score:7}:x)},
  {criteria:good().criteria.map((x,i)=>i===0?{...x,score:2.5}:x)},
  {criteria:good().criteria.map((x,i)=>i===0?{...x,criterion:ids[0]}:x)},
  {level:'C1'},
  {criteria:good().criteria.map((x,i)=>i===0?{...x,nextStep:''}:x)}
 ]){
  response={...good(),...patch};
  assert.equal(await tutor.coach('cefr-writing','Write about an experience.',{draft},{targetCEFR:'B1'}),null,
    'Reject missing/doubled rubric criteria, invalid scores or learner-level assignment');
 }
 assert(failures.length>=6);
 response={...good(),criteria:good().criteria.map((x,i)=>i===0?{...x,evidence:'a quote not in the text'}:x),
  corrections:[{original:'made-up mistake',why:'bad',hint:'fix'}]};
 let safe=await tutor.coach('cefr-writing','Write about an experience.',{draft},{targetCEFR:'B1'});
 assert(safe,'A single ungrounded quote should not discard six usable criteria');
 assert.equal(safe.structuredResult.criteria.find(x=>x.criterion===good().criteria[0].criterion).evidence,'');
 assert.deepEqual(safe.structuredResult.corrections,[],'Ungrounded correction must be dropped');
 response=good();

 const transpiled=ts.transpileModule(read('infrastructure/browser/client-services.ts'),{fileName:'client-services.ts',
   compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 let calls=0,stage=null;const holder={exports:{}};
 vm.runInNewContext(transpiled,{
  module:holder,exports:holder.exports,Date,process:{env:{NEXT_PUBLIC_LEARNING_RUNTIME:'browser'}},
  require(name){
   if(name==='../../domain/writing-studio-reference')return refs;
   if(name==='../../domain/writing-studio-scoring')return scoring;
   if(name==='./firebase-ai-browser')return{
     browserTutorService:()=>({available:true,coach:async(s,t,fields,context)=>{
       calls++;stage=s;assert.equal(fields.draft,draft);
       return await tutor.coach(s,t,fields,context);
     }}),
     resetAIFailure:()=>{},readAIFailure:()=>null,
   };
   return {};
  },
 },{timeout:3000});
 const send=holder.exports.requestWritingAI;
 let result=await send('Write about an experience.',{draft},'draft','vi','any-topic','B1');
 assert.equal(result.status,'validated');
 assert.equal(result.feedback.totalScore,25);
 assert.equal(result.feedback.maxScore,30);
 assert.equal(result.feedback.targetCEFR,'B1');
 assert.equal(result.feedback.level,null);
 assert.equal(stage,'cefr-writing');
 result=await send('Write about an experience.',{draft},'draft','en','any-topic');
 assert.equal(result.status,'validated');
 assert.equal(result.feedback.totalScore,25);
 assert.equal(result.feedback.framework,'general');
 assert.equal(calls,2);
 const bad=await send('Write about an experience.',{draft},'draft','en','any-topic','C9');
 assert.equal(bad.status,'unavailable');
 assert.equal(calls,2);
 const long=await send('Write about an experience.',{draft:'x'.repeat(7001)},'draft','en','any-topic','B1');
 assert.equal(long.status,'unavailable');
 assert.equal(calls,2);
 assert.equal(refs.normalizeWritingStudioReference(undefined).kind,'general');
 console.log('PASS writing-studio-cefr-target: six 0–5 marks, total /30, both General/B1, exact quotes, failed invalid scores, no user level, 90s schema, saved draft preserved; no live AI calls');
}
test().catch(e=>{console.error(e);process.exitCode=1});
