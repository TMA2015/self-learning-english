'use strict';
/** Synthetic provider test only; same real AI policy used by Foundation Writing U01–U12. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),
 ts=require('typescript'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const registry=JSON.parse(read('ai/prompts/registry.json')),prompt=registry['foundation-writing-review'];
assert.equal(prompt.version,'1.4.0');
for(const u of ['10','11','12'])assert(prompt.system.includes('FW-U'+u),'Prompt must cover FW-U'+u);
const source=read('ai/service.ts'),sandboxModule={exports:{}};
vm.runInNewContext(ts.transpileModule(source,{fileName:'ai/service.ts',compilerOptions:{
 target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true
}}).outputText,{module,exports:module.exports,JSON,Date,Object,Set,Number,Error,
 require:name=>{
  if(name==='./teaching-validation')return{validateTeachingRating:()=>null};
  if(name==='./prompts/registry.json')return registry;
  if(name==='../content/writing-rubric.json')return{criteria:[]};
  if(name==='./validation')return{validateRating:()=>null};
  throw Error('Unexpected import '+name);
 }},{filename:'ai/service.ts',timeout:5000});
let response=null,request=null,failures=0,calls=0;
const tutor=sandboxModule.exports.createTutorService({available:true,reportFailure:()=>failures++,
 async generate(p){calls++;request=p;return{provider:'firebase-ai-logic',model:'synthetic-no-network',result:response}}});
const original='draftV1: This is my independent saved original message about an activity. It requests a possible decision.';
const changed='revisedV2: I now clarify the reader action without inventing a confirmed event.';
const payload=original+'\n'+changed+'\nLearner editorial decision: REVISION_SAVED';
const good=()=>({summary:'Your proposal names a possible action.',strengths:['Conditional request is visible.'],
 improvements:[],quotes:[original.slice(0,35)],questions:['Which reader action is most clear?'],
 nextAction:'Explain the rationale for this change in your own words.',scores:null,level:null});
(async()=>{
 for(const id of ['FW-U10','FW-U11','FW-U12']){
  for(const fixture of [id+'-B',id+'-T']){
   response=good();const result=await tutor.coach('foundation-writing',
    'Review this precise original writing task only.',
    {unitId:id,fixtureId:fixture,text:payload},{responseLanguage:'en'});
   assert(result,id+' allowed source-bounded review');
   assert.equal(request.purpose,'foundation-writing-review');
   assert.equal(request.promptVersion,'1.4.0');
   assert.equal(result.structuredResult.scores,null);
   assert.equal(result.structuredResult.level,null);
   assert.equal(result.structuredResult.canEstimateLevel,false);
  }
  for(const wrong of [
   {...good(),scores:{proficiency:10}},
   {...good(),level:'B2'},
   {...good(),quotes:['Never in saved learner text']},
   {...good(),improvements:['a','b','c']}
  ]){
   response=wrong;assert.equal(await tutor.coach('foundation-writing','Original assignment',
    {unitId:id,fixtureId:id+'-B',text:payload},{}),null,
    'Reject fake scores, levels, quotes, and overlong advice');
  }
  response=good();assert.equal(await tutor.coach('foundation-writing','Task',
   {unitId:id,fixtureId:'FW-U01-B',text:payload},{}),null,'Cross-unit routing blocked');
 }
 assert(failures>=15,'Invalid structured feedback triggers explicit failure report');
 assert(calls>=21,'All synthetic valid/invalid requests were actually passed into the service');
 const home=read('app/home-client.tsx');
 assert(home.includes('reviewer={async payload=>'),'Actual HomeClient must wire optional on-demand reviewer');
 assert(home.includes("browserTutorService()"),'Reuse existing provider; no new subscription or endpoint');
 console.log(JSON.stringify({result:'PASS',gate:'FOUNDATION_WRITING_WAVE4_SHARED_AI_TUTOR',
  unitFixtures:6,rejectedInvalidReviews:15,promptVersion:'1.4.0',syntheticProvider:true,
  actualNetworkCalls:0,autoCalls:0,unchangedScores:true,release:'CI_PENDING'}));
})().catch(e=>{console.error(e);process.exitCode=1});
