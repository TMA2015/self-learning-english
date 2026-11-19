'use strict';
/** Candidate CEFR-target Writing Studio QA: synthetic Gemini only; no real learner or provider. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const ts=require('typescript'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.sites-runtime/writing-studio-cefr-target');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const registry=require(path.join(root,'ai/prompts/registry.json'));
assert.equal(registry['any-topic-writing'].version,'1.0.0','General prompt must not change');
assert.equal(registry['cefr-writing-coaching'].version,'0.1.0-candidate');
assert.match(registry['cefr-writing-coaching'].system,/untrusted DATA/);
assert.match(registry['cefr-writing-coaching'].system,/scores:null/);
assert.match(registry['cefr-writing-coaching'].system,/evidence/i);
assert(!read('app/any-topic-writing-review.tsx').includes('requestWritingAI('),'No provider in drafting view');
assert(read('app/writing-ai-review.tsx').includes('feedbackSignature===signature'),'Prevent old A2/B1 AI response display');
assert(read('app/writing-ai-review.tsx').includes('WRITING_STUDIO_CEFR_RUBRIC_VERSION'),'Rubric version in cache signature');
fs.rmSync(out,{recursive:true,force:true});
execFileSync(process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),
 'ai/service.ts','ai/contracts.ts','domain/writing-studio-reference.ts','ai/teaching-validation.ts',
 'ai/validation.ts','domain/ai-metadata.ts','--outDir',out,
 '--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}\n');
const {createTutorService}=require(path.join(out,'ai/service.js'));
const refs=require(path.join(out,'domain/writing-studio-reference.js'));
const ids=refs.CEFR_WRITING_CRITERIA.map(x=>x.id);
const draft='I went to the beach on Sunday. I saw a small dog and helped its owner. It was a good day.';
const good=()=>({
 framework:'cefr',targetCEFR:'B1',rubricVersion:refs.WRITING_STUDIO_CEFR_RUBRIC_VERSION,
 summary:'A clear account of a familiar experience; CEFR B1 is only a practice target.',
 strengths:['A simple sequence is clear.'],improvements:['Explain why the event matters.'],
 exercise:'Add one sentence explaining why this experience was meaningful.',
 tags:['narrative','development'],scores:null,level:null,canEstimateLevel:false,
 corrections:[],
 criteria:ids.map(criterion=>({criterion,observation:'This short sample offers some evidence.',
   evidence:'I went to the beach on Sunday.',nextStep:'Explain one more detail independently.'})),
});
let response=good(),lastRequest=null,failures=[];
const provider={
 available:true,
 reportFailure:key=>failures.push(key),
 async generate(req){lastRequest=req;return {provider:'firebase-ai-logic',model:'synthetic',result:response}},
};
const tutor=createTutorService(provider);
async function test(){
 let received=await tutor.coach('cefr-writing','Write about an experience.',{draft},{targetCEFR:'B1',responseLanguage:'vi'});
 assert(received,'Valid B1 feedback should be accepted');
 assert.equal(lastRequest.purpose,'cefr-writing-coaching');
 assert.equal(lastRequest.promptVersion,'0.1.0-candidate');
 assert.equal(lastRequest.input.learnerContext.targetCEFR,'B1');
 assert.equal(lastRequest.input.responseLanguage,'vi');
 assert.match(lastRequest.instructions,/targetCEFR=B1/,'Trusted CEFR target reaches prompt');
 assert(!lastRequest.instructions.includes('{{targetLevel}}'),'Target placeholder must be resolved');
 assert.deepEqual(received.structuredResult.criteria.map(row=>row.criterion),ids);
 assert.equal(received.structuredResult.level,null);
 assert.equal(received.structuredResult.scores,null);

 const mutations=[
  {scores:{grammar:10}},
  {level:'B1'},
  {canEstimateLevel:true},
  {targetCEFR:'C1'},
  {rubricVersion:'wrong-version'},
  {criteria:good().criteria.slice(0,5)},
  {criteria:good().criteria.map((c,i)=>i===0?{...c,evidence:'Invented quote'}:c)},
  {criteria:good().criteria.map((c,i)=>i===1?{...c,criterion:'incorrect'}:c)},
  {criteria:good().criteria.map((c,i)=>i===1?{...c,nextStep:''}:c)},
  {corrections:[{original:'not in original draft',why:'Bad',hint:'Rewrite'}]},
 ];
 for(const mutation of mutations){
  response={...good(),...mutation};
  assert.equal(await tutor.coach('cefr-writing','Write about an experience.',{draft},{targetCEFR:'B1'}),null,
   'CEFR feedback must fail closed on grades, wrong targets, rubric mismatch or invented evidence');
 }
 assert(failures.length>=mutations.length);
 response=good();
 // Confirm browser-to-Gemini adapter sends exact draft and explicit target, never on arbitrary mode change.
 const js=ts.transpileModule(read('infrastructure/browser/client-services.ts'),{fileName:'client-services.ts',
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 let calls=0,stage=null,context=null;
 const holder={exports:{}};
 vm.runInNewContext(js,{
  module:holder,exports:holder.exports,Date,
  process:{env:{NEXT_PUBLIC_LEARNING_RUNTIME:'browser'}},
  require(name){
   if(name==='../../domain/writing-studio-reference')return refs;
   if(name==='./firebase-ai-browser')return{
    browserTutorService:()=>({available:true,coach:async(s,t,fields,ctx)=>{
      calls++;stage=s;context=ctx;
      assert.equal(fields.draft,draft);
      return {provider:'firebase-ai-logic',model:'mock',structuredResult:good()};
    }}),
    resetAIFailure:()=>{},readAIFailure:()=>null,
   };
   return {};
  },
 },{timeout:3000});
 const send=holder.exports.requestWritingAI;
 received=await send('Write about an experience.',{draft},'draft','vi','any-topic','B1');
 assert.equal(received.status,'validated');
 assert.equal(received.feedback.targetCEFR,'B1');
 assert.equal(received.feedback.rubricVersion,refs.WRITING_STUDIO_CEFR_RUBRIC_VERSION);
 assert.equal(received.feedback.scores,null);
 assert.equal(stage,'cefr-writing');
 assert.equal(context.targetCEFR,'B1');
 assert.equal(calls,1);
 const bad=await send('Write about an experience.',{draft},'draft','en','any-topic','C9');
 assert.equal(bad.status,'unavailable','Unsupported target should fail before provider call');
 assert.equal(calls,1);
 const over=await send('Write about an experience.',{draft:'x'.repeat(7001)},'draft','en','any-topic','B1');
 assert.equal(over.status,'unavailable','No overlong input to provider');
 assert.equal(calls,1);
 assert.equal(refs.normalizeWritingStudioReference({kind:'cefr',level:'X'}).kind,'general');
 assert.equal(refs.normalizeWritingStudioReference(undefined).kind,'general',
  'Old stored drafts without reference should migrate as General');
 console.log('PASS writing-studio-cefr-target: trusted B1, six criteria, evidence, hard unscored guard, invalid modes blocked, old draft migration, no live provider.');
}
test().catch(error=>{console.error(error);process.exitCode=1});
