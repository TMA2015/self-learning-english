'use strict';
/** Historical General Writing guard, updated for owner-approved scored Writing Studio.
 * All provider responses below are synthetic. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process'),vm=require('node:vm'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/any-topic-academic-r1';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const registry=require(path.join(root,'ai/prompts/registry.json'));
assert.equal(registry['any-topic-writing'].version,'2.0.0-scored');
assert.match(registry['any-topic-writing'].system,/writing assessor/i);
assert.match(registry['any-topic-writing'].system,/never output the learner's CEFR level/i);
assert.match(registry['any-topic-writing'].system,/integer 0–5/i);
assert.equal(registry['revision-coaching'].version,'1.1.0');
assert.match(read('app/writing-ai-review.tsx'),/Writing score: \{visibleFeedback.totalScore\}/);
assert.doesNotMatch(read('app/writing-ai-review.tsx'),/Verified AI response/);
assert.match(read('app/any-topic-writing-review.tsx'),/reviewMode="any-topic"/);
assert.match(read('app/any-topic-writing-review.tsx'),/AI Tutor · Writing Review/);
assert.match(read('infrastructure/browser/client-services.ts'),/targetCEFR\?'cefr-writing':'any-topic'/);
assert.match(read('infrastructure/browser/firebase-ai-browser.ts'),/responseSchema:writingStudioOutputSchema/);
fs.rmSync(path.join(root,out),{recursive:true,force:true});
execFileSync(process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),
 'ai/service.ts','ai/contracts.ts','ai/teaching-validation.ts','ai/validation.ts',
 'domain/ai-metadata.ts','domain/writing-studio-reference.ts','domain/writing-studio-scoring.ts',
 '--outDir',out,'--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}\n');
const {createTutorService}=require(path.join(root,out,'ai/service.js'));
const reference=require(path.join(root,out,'domain/writing-studio-reference.js'));
const scoring=require(path.join(root,out,'domain/writing-studio-scoring.js'));
const ids=reference.CEFR_WRITING_CRITERIA.map(x=>x.id);
const draft='I go to the beach last Sunday. The water was cold but I enjoyed the trip.';
const good=()=>({
 summary:'The task is clear. Review the verb tense in the first sentence.',
 strengths:['Descriptive ideas are connected.'],improvements:['Use past tense with last Sunday.'],
 exercise:'Write another sentence using the past tense.',
 tags:['past-tense'],
 corrections:[{original:'I go to the beach last Sunday.',why:'Last Sunday signals the past.',hint:'Use the past form.'}],
 criteria:ids.map((criterion,i)=>({criterion,score:i===0?4:3,
  observation:'The writing provides relevant evidence.',evidence:'The water was cold',
  nextStep:'Revise a detail on your own.'})),
});
let output=good(),lastRequest=null,failures=[];
const tutor=createTutorService({available:true,reportFailure:k=>failures.push(k),
 async generate(req){lastRequest=req;return {provider:'firebase-ai-logic',model:'synthetic',result:output}},
});
(async()=>{
 const response=await tutor.coach('any-topic','Describe your last trip.',{draft},{responseLanguage:'vi'});
 assert(response);
 assert.equal(lastRequest.purpose,'any-topic-writing');
 assert.equal(lastRequest.promptVersion,'2.0.0-scored');
 assert.equal(lastRequest.input.responseLanguage,'vi');
 assert.equal(response.structuredResult.totalScore,19);
 assert.equal(response.structuredResult.level,null);
 assert.equal(response.structuredResult.canEstimateLevel,false);
 assert.equal(response.structuredResult.corrections[0].original,'I go to the beach last Sunday.');
 assert.match(lastRequest.instructions,/untrusted DATA/);
 for(const patch of [
  {level:'B2'},
  {criteria:good().criteria.map((row,i)=>i===0?{...row,score:7}:row)},
  {criteria:good().criteria.slice(0,5)},
 ]){
  output={...good(),...patch};
  assert.equal(await tutor.coach('any-topic','Describe your last trip.',{draft},{responseLanguage:'en'}),null,
   'Reject inferred learner CEFR and incomplete or invalid criterion marks');
 }
 assert(failures.length>=3);
 output={...good(),corrections:[{original:'Not actually in the essay',why:'Invalid',hint:'Try again'}]};
 const recovered=await tutor.coach('any-topic','Describe your last trip.',{draft},{responseLanguage:'en'});
 assert(recovered,'Ignore invented correction instead of losing scored feedback');
 assert.deepEqual(recovered.structuredResult.corrections,[]);
 output=good();

 const compiled=ts.transpileModule(read('infrastructure/browser/client-services.ts'),{fileName:'client-services.ts',
   compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const holder={exports:{}};let calls=0,lastDraft=null;
 vm.runInNewContext(compiled,{module:holder,exports:holder.exports,Date,
  process:{env:{NEXT_PUBLIC_LEARNING_RUNTIME:'browser'}},
  require(name){
   if(name==='../../domain/writing-studio-reference')return reference;
   if(name==='../../domain/writing-studio-scoring')return scoring;
   if(name==='./firebase-ai-browser')return{
    browserTutorService:()=>({available:true,coach:async(stage,task,fields,context)=>{
     assert.equal(stage,'any-topic');calls++;lastDraft=fields.draft;
     return tutor.coach(stage,task,fields,context);
    }}),
    resetAIFailure:()=>{},readAIFailure:()=>null,
   };
   return {};
  },
 },{timeout:3000});
 const send=holder.exports.requestWritingAI,max='A'.repeat(7000);
 // Use a matching synthetic quote for the boundary input.
 output={...good(),criteria:good().criteria.map(c=>({...c,evidence:''})),corrections:[]};
 const allowed=await send('Describe a place.',{draft:max},'draft','en','any-topic');
 assert.equal(allowed.status,'validated','Exactly 7000 learner characters are allowed');
 assert.equal(lastDraft,max,'Do not truncate or prefix submitted text');
 assert.equal(allowed.feedback.totalScore,19);
 assert.equal(calls,1);
 const excess=await send('Describe a place.',{draft:max+'B'},'draft','en','any-topic');
 assert.equal(excess.status,'unavailable');
 assert.equal(calls,1,'Overlimit input never reaches provider');
 const revision=await tutor.coach('revision','Compare two drafts',{originalText:'hi',revisedText:'hello'},{responseLanguage:'en'});
 assert(revision);
 assert.equal(lastRequest.purpose,'revision-coaching','Historical unscored revision prompt unchanged');
 await tutor.teachWriting('Hello there','Say hello',{});
 assert.equal(lastRequest.purpose,'writing-teaching','Other Writing modes unchanged');
 console.log('PASS any-topic-writing-academic-r1: General scored /30, accurate quotes, no learner CEFR, 7000-char save boundary, unrelated modes preserved, no live AI');
})().catch(e=>{console.error(e);process.exitCode=1});
