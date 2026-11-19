'use strict';
/** FW-U02/U03 reviewed W1 content and process-competency tests. NO live provider. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ts=require('typescript'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const u02=JSON.parse(read('content/foundation-writing-u02.json'));
const u03=JSON.parse(read('content/foundation-writing-u03.json'));
const registry=JSON.parse(read('ai/prompts/registry.json'));
const domainText=read('domain/foundation-writing-u02-u03.ts');
const home=read('app/home-client.tsx'),ui=read('app/foundation-writing-u02-u03.tsx');
const legacy=read('domain/foundation-writing-u01.ts');
const sha='4d0c80a754a68cc2b23be09e55b47741aa09ea25b18accdae72e562d016b7e3b';
const data=[u02,u03],allIds=new Set();
for(const [i,unit] of data.entries()){
 assert.equal(unit.id,['FW-U02','FW-U03'][i]);
 assert.equal(unit.source.sha256,sha);
 assert.equal(unit.source.verdict,'PASS');
 assert.equal(unit.source.requiredChanges,'NONE');
 assert.equal(unit.supplemental.length,4);
 assert.equal(unit.cycleA.cards.length,6);
 assert.notEqual(unit.teaching.demo.prompt,unit.cycleA.prompt);
 assert.notEqual(unit.cycleA.prompt,unit.cycleB.prompt);
 assert.notEqual(unit.cycleB.prompt,unit.transfer.prompt);
 for(const item of unit.supplemental){
  assert(!allIds.has(item.id),'Unique stable fixture id');
  allIds.add(item.id);
  assert.deepEqual(item.options.map(o=>o.id),['A','B','C','D']);
  assert.equal(item.options.filter(o=>o.id===item.key).length,1);
  assert(item.options.every(o=>o.rationale.trim()),'All four explanations present');
 }
}
assert.deepEqual(u02.cycleA.cards.map(c=>c.key),
 ['FITS','NEEDS_DETAIL_OR_REPAIR','OFF_TASK','FITS','OFF_TASK','NEEDS_DETAIL_OR_REPAIR']);
assert.deepEqual(u03.cycleA.cards.map(c=>c.key),
 ['Claim','Reason','Detail','circular','off-task','weak link']);
assert.deepEqual(u03.cycleB.weak.map(c=>c.key),['circular','thin mechanism','off-task']);
assert.deepEqual(u02.supplemental.map(x=>x.key),['A','C','B','C']);
assert.deepEqual(u03.supplemental.map(x=>x.key),['C','B','D','C']);
assert.match(u02.cycleB.setAsidePrompt,/optional/i);
assert.match(u02.aiCriteria.acceptAllValid,/empty/);
assert.match(ui,/Get personal AI Tutor feedback/);
assert.match(ui,/eligibleNextArtifact\(unitId,work,target\)/);
assert.match(ui,/if\(!original\|\|!saved\|\|pending\|\|busy\)return/);
assert.match(ui,/tutor\.coach\('foundation-writing'/);
assert.match(ui,/Save &amp; Exit/);
assert.doesNotMatch(ui,/dangerouslySetInnerHTML|XMLHttpRequest|sendBeacon/);
assert.match(home,/function editFoundationNext/);
assert.match(home,/return saveNow\(next\)/,'Verified existing learner-service save, not ad hoc localStorage');
assert.match(home,/foundation-writing-u02/);
assert.match(home,/foundation-writing-u03/);
assert.match(legacy,/'FW-U02'\?:NextUnitWork<U02Draft>/);
assert.match(legacy,/'FW-U03'\?:NextUnitWork<U03Draft>/);
assert.match(read('scripts/qa-free-first.mjs'),/foundation-writing-u02-u03-v1\.cjs/);
assert.equal(registry['foundation-writing-review'].version,'1.4.0');
assert.match(registry['foundation-writing-review'].system,/never require a rejected\/off-task candidate/);
assert.match(registry['foundation-writing-review'].system,/two benefits are genuinely different/);

function transpile(content,name,mocks){
 const target={exports:{}};
 const compiled=ts.transpileModule(content,{fileName:name,
  compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,
   esModuleInterop:true,resolveJsonModule:true}}).outputText;
 vm.runInNewContext(compiled,{module:target,exports:target.exports,
  JSON,Date,Set,Object,Number,
  require:spec=>{
   if(Object.hasOwn(mocks,spec))return mocks[spec];
   throw Error('Test mock missing: '+spec);
  }},{timeout:10000,filename:name});
 return target.exports;
}
const d=transpile(domainText,'foundation-writing-u02-u03.ts',{
 '../content/foundation-writing-u02.json':u02,
 '../content/foundation-writing-u03.json':u03
});
const one=transpile(legacy,'foundation-writing-u01.ts',{
 '../content/foundation-writing-u01.json':JSON.parse(read('content/foundation-writing-u01.json'))
});
const state=one.emptyFoundationWritingV1();
const originalU01=one.emptyU01Work();
state.units['FW-U01']=originalU01;
assert.equal(d.nextUnitWork(state,'FW-U02').versions.length,0);
assert.equal(d.nextUnitWork(state,'FW-U03').versions.length,0);
const allValid=[
 {text:'Book-swap table',fit:'Fits'},
 {text:'Short graphic-novel circle',fit:'Fits'},
 {text:'Read-and-draw session',fit:'Fits'},
];
const bank={ideas:allValid,chosenIndex:'1',rationale:'Easy to organize in a small library for teenagers',
 setAside:'',concrete:'Graphic-novel circle with ten-minute discussion'};
assert.equal(d.bankReady(bank),true,'Three plausible candidates, no rejection, MUST be accepted');
assert.equal(d.bankReady({...bank,ideas:[...allValid.slice(0,2),{text:'BOOK SWAP, TABLE!',fit:'Fits'}]}),true,
 'Distinct notes can remain valid even when similar words occur');
assert.equal(d.bankReady({...bank,ideas:[allValid[0],allValid[0],allValid[1]]}),false,
 'Literal duplicate notes are not three distinct possibilities');
const start02=d.emptyNextWork('FW-U02');
const draft02={...start02.draft,cycleBBank:bank};
let work02=d.appendNextVersion({...start02,draft:draft02},1000);
assert.equal(work02.versions.length,1);
assert.equal(work02.versions[0].evidence_weight,0);
assert.equal(work02.versions[0].proficiency_weight,0);
assert(d.exactSavedNext(work02));
const sent02=d.eligibleNextArtifact('FW-U02',work02,'cycleB');
assert.equal(sent02?.fixtureId,'FW-U02-B');
assert(sent02?.text.includes('Optional set aside / trade-off: '));
assert(!sent02?.text.includes('A1')&&!sent02?.text.includes('A2'),'Do not submit card answer keys');
assert.equal(d.appendNextVersion(work02,1001).versions.length,1,'Identical saved draft is idempotent');
const edited02={...work02,draft:{...draft02,cycleBBank:{...bank,rationale:'New self-written reason'}}};
assert.equal(d.eligibleNextArtifact('FW-U02',edited02,'cycleB'),null,
 'Unpersisted edit invalidates AI eligibility');
work02=d.appendNextVersion(edited02,1002);
assert.equal(work02.versions.length,2);
assert.equal(work02.versions[0].draft.cycleBBank.rationale,bank.rationale,
 'Immutable saved version remains intact');
assert.equal(work02.versions[1].draft.cycleBBank.rationale,'New self-written reason');
const withOriginal={...state,units:{...state.units,'FW-U02':work02}};
assert.equal(one.u01Work(withOriginal).versions.length,0,'U01 unaffected by U02');

const chain=(reason,detail)=>({
 claim:'Our school should have a lunchtime creative club',
 reason,detail
});
const start03=d.emptyNextWork('FW-U03');
const draft03={...start03.draft,weakChoice:'B-W1',
 weakRepair:'A club lets students build their own art skills during lunch.',
 chainA:chain('Students could practise making drawings','They could draw a scene together during a club meeting'),
 chainB:chain('Students could meet classmates from other groups','They could share different projects and discuss their methods')};
let work03=d.appendNextVersion({...start03,draft:draft03},2000);
const sent03=d.eligibleNextArtifact('FW-U03',work03,'cycleB');
assert(sent03?.text.includes('Chain A reason:'));
assert(sent03?.text.includes('Chain B detail:'));
assert.equal(sent03?.fixtureId,'FW-U03-B');
assert.equal(d.eligibleNextArtifact('FW-U03',{...work03,draft:{...draft03,weakRepair:''}},'cycleB'),null);
const stored={...withOriginal,units:{...withOriginal.units,'FW-U03':work03}};
assert.equal(d.nextUnitWork(stored,'FW-U02').versions.length,2);
assert.equal(d.nextUnitWork(stored,'FW-U03').versions.length,1);
assert.equal(one.u01Work(stored).versions.length,0);
for(const unit of data){
 for(const item of unit.supplemental){
  const outcome=d.supplementalResult(unit.id,item.id,item.key);
  assert(outcome?.correct);
  assert.equal(outcome.key,item.key);
  assert.equal(outcome.explanations.length,4);
  assert.equal(d.supplementalResult(unit.id,item.id,'Z'),null);
 }
}
// The AI validator is synthetic; it does NOT prove real App Check / live Gemini.
const service=transpile(read('ai/service.ts'),'ai/service.ts',{
 './teaching-validation':{validateTeachingRating:()=>null},
 './prompts/registry.json':registry,
 '../content/writing-rubric.json':{criteria:[]},
  '../domain/writing-studio-scoring':{validateWritingStudioScore:()=>null,WRITING_STUDIO_SCORING_VERSION:'writing-studio-six-criteria-0to5-v2'},
  '../domain/writing-studio-reference':{CEFR_WRITING_CRITERIA:[],CEFR_TARGET_GUIDANCE:{},WRITING_STUDIO_CEFR_RUBRIC_VERSION:'cefr-written-production-2020-v1',validCEFRWritingLevel:()=>false},
 './validation':{validateRating:()=>null},
});
let response=null,lastReq=null,invalidCount=0;
const tutor=service.createTutorService({available:true,
 reportFailure:()=>invalidCount++,
 generate:async request=>{lastReq=request;return {provider:'firebase-ai-logic',
  model:'synthetic-only',result:response}}
});
function good(text){return {summary:'A suggestion grounded in the saved writing',
 strengths:['A task-related choice is present.'],improvements:[],
 quotes:[text.slice(0,Math.min(24,text.length))],
 questions:['How does this example support the proposal?'],
 nextAction:'Read the prompt again, then revise your own explanation.',
 scores:null,level:null};}
(async()=>{
 for(const artifact of [sent02,sent03]){
  response=good(artifact.text);
  const out=await tutor.coach('foundation-writing',artifact.task,
   {unitId:artifact.unitId,fixtureId:artifact.fixtureId,text:artifact.text},{responseLanguage:'en'});
  assert(out,'Valid U02/U03 feedback accepted');
  assert.equal(out.structuredResult.scores,null);
  assert.equal(out.structuredResult.level,null);
  assert.equal(lastReq.purpose,'foundation-writing-review');
  assert.equal(lastReq.promptVersion,'1.4.0');
  for(const bad of [
   {...good(artifact.text),scores:{grammar:8}},
   {...good(artifact.text),level:'C2'},
   {...good(artifact.text),quotes:['invented quotation not in learner text']},
   {...good(artifact.text),improvements:['a','b','c']},
  ]){
   response=bad;
   assert.equal(await tutor.coach('foundation-writing',artifact.task,
    {unitId:artifact.unitId,fixtureId:artifact.fixtureId,text:artifact.text},{}),null);
  }
  response=good(artifact.text);
  assert.equal(await tutor.coach('foundation-writing',artifact.task,
   {unitId:'FW-U01',fixtureId:artifact.fixtureId,text:artifact.text},{}),null,
   'Cross-unit fixture spoofing rejected');
 }
 assert(invalidCount>=10,'All malformed AI results rejected');
 console.log('PASS foundation-writing-u02-u03-v1: reviewed IDs/keys, all-valid brainstorm, exact immutable learner versions, no fake writing scores, saved-only mock AI, cross-unit guard; no production writes');
})().catch(err=>{console.error(err);process.exitCode=1});
