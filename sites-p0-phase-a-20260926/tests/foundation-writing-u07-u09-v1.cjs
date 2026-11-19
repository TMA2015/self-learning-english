'use strict';
/** Academic Wave 3 structural checks and synthetic save/AI contract. No production/provider I/O. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const content=['07','08','09'].map(i=>JSON.parse(read('content/foundation-writing-u'+i+'.json')));
const [u07,u08,u09]=content;
const domainText=read('domain/foundation-writing-u07-u09.ts');
const ui=read('app/foundation-writing-u07-u09.tsx');
const home=read('app/home-client.tsx'),storeType=read('domain/foundation-writing-u01.ts');
const registry=JSON.parse(read('ai/prompts/registry.json'));
const expectedExtras=[['B','B','C','D'],['C','A','D','B'],['B','C','D','B']];
const sameSource='13db37528ca01091fce49de2e783b8c252f133f922df45855a150a586a096efb';
const keys=new Set();
content.forEach((unit,i)=>{
 assert.equal(unit.id,'FW-U0'+(i+7));
 assert.equal(unit.source.sha256,sameSource);
 assert.equal(unit.source.verdict,'PASS');
 assert.equal(unit.source.requiredChanges,'NONE');
 assert.equal(unit.teaching.demo.steps.length,6);
 assert.equal(unit.extras.length,4);
 assert.deepEqual(unit.extras.map(x=>x.key),expectedExtras[i]);
 assert.notEqual(unit.teaching.demo.prompt,unit.cycleA.prompt);
 assert.notEqual(unit.cycleA.prompt,unit.cycleB.prompt);
 assert.notEqual(unit.cycleB.prompt,unit.transfer.prompt);
 for(const q of unit.extras){
  assert(!keys.has(q.id));keys.add(q.id);
  assert.deepEqual(q.options.map(x=>x.id),['A','B','C','D']);
  assert.equal(q.options.filter(x=>x.id===q.key).length,1);
  assert(q.options.every(o=>o.rationale.trim()));
 }
});
assert.deepEqual(u07.cycleA.objective.map(x=>x.key),['B','C']);
assert.deepEqual(u08.cycleA.objective.map(x=>x.key),['C','A']);
assert.equal(u07.cycleA.order.key,'PROBLEM_THEN_RESPONSE');
assert.equal(u08.cycleA.order.key,'INTENT_PRESERVED_REGISTER_ADAPTED');
assert.deepEqual(u09.cycleA.cards.map(x=>x.key),
 ['R1','R2','R2','R3','UNSUPPORTED_CLAIM','OFF_TASK']);
assert.deepEqual(u09.cycleA.cover.key,['weekday','registration','resource','decisionRequest']);
assert.deepEqual(u08.cycleB.fields.map(x=>x.key),['sharedIntent','peerMessage','organizerMessage','change1','change2']);
assert.deepEqual(u09.cycleB.fields.map(x=>x.key),['planRoles','draftV1','commitmentNote']);
assert.match(u09.cycleB.taskStrip.boundary,/guidance/i);
assert.match(ui,/Get personal AI Tutor feedback/);
assert.match(ui,/eligibleWave3Artifact\(unitId,work,target\)/);
assert.match(ui,/if\(!artifact\|\|!saved\|\|pending\|\|busy\)return/);
assert.match(ui,/Save &amp; Exit/);
assert.match(ui,/firstDraftV1/);
assert.match(home,/saveFoundationWave3/);
assert.match(home,/firstDraftV1:previous.firstDraftV1/,'failed-save first draft rollback');
assert.match(storeType,/'FW-U07'\?:Wave3Work/);
assert.match(storeType,/'FW-U08'\?:Wave3Work/);
assert.match(storeType,/'FW-U09'\?:Wave3Work/);
assert.match(read('scripts/qa-free-first.mjs'),/foundation-writing-u07-u09-v1\.cjs/);
assert.equal(registry['foundation-writing-review'].version,'1.4.0');
const prompt=registry['foundation-writing-review'].system;
for(const unit of content)assert(prompt.includes(unit.id),'AI prompt includes '+unit.id);
assert(prompt.includes('never require a rejected/off-task candidate'),'retain U02 invariant');
assert(prompt.includes('two benefits are genuinely different'),'retain U03 invariant');
function moduleTS(source,name,mocks){
 const hold={exports:{}};
 const compiled=ts.transpileModule(source,{fileName:name,compilerOptions:{
  target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,
  esModuleInterop:true,resolveJsonModule:true}}).outputText;
 vm.runInNewContext(compiled,{module:hold,exports:hold.exports,JSON,Date,Set,Object,Number,
  require:x=>{if(Object.hasOwn(mocks,x))return mocks[x];throw Error('Unmocked require '+x)}},
  {filename:name,timeout:9000});
 return hold.exports;
}
const d=moduleTS(domainText,'foundation-writing-u07-u09.ts',{
 '../content/foundation-writing-u07.json':u07,
 '../content/foundation-writing-u08.json':u08,
 '../content/foundation-writing-u09.json':u09
});
const savedA=()=>d.blankWave3Draft();
const work=()=>d.emptyWave3Work();
const orig=work();
assert.equal(d.exactSavedWave3(orig),null);
assert.equal(d.eligibleWave3Artifact('FW-U07',orig,'cycleB'),null);
const draft07={...savedA(),cycleB:{problem:'Students do not know when to check the lost-and-found table.',
 response:'A weekly council notice could show collection times and the location.',
 transitionReason:'The notice would answer the uncertainty mentioned above.'}};
const u07first=d.appendWave3Version({draft:draft07,versions:[]},101,'FW-U07');
assert.equal(u07first.versions.length,1);
assert.equal(u07first.versions[0].evidence_weight,0);
assert.equal(u07first.versions[0].proficiency_weight,0);
assert(d.eligibleWave3Artifact('FW-U07',u07first,'cycleB'));
assert.equal(d.appendWave3Version(u07first,102,'FW-U07').versions.length,1,'idempotent');
assert.equal(d.eligibleWave3Artifact('FW-U07',{...u07first,draft:{...draft07,
 cycleB:{...draft07.cycleB,response:'New unsaved paragraph'}}},'cycleB'),null);

const draft08={...savedA(),cycleB:{
 sharedIntent:'Ask where to meet and what time the public mural walk starts.',
 peerMessage:'Hi Luca, do you know the mural walk starting time and meeting place?',
 organizerMessage:'Hello Ms. Rivera, could you please tell me the start time and meeting point?',
 change1:'Friend greeting is short and casual.',change2:'Coordinator request is more courteous.'
}};
const u08first=d.appendWave3Version({draft:draft08,versions:[]},201,'FW-U08');
assert(d.eligibleWave3Artifact('FW-U08',u08first,'cycleB'));
const u08payload=d.eligibleWave3Artifact('FW-U08',u08first,'cycleB');
assert(u08payload.text.includes('organizerMessage'));
assert(!u08payload.text.includes('FW-U08-F01'),'no answer key leakage');
assert.equal(d.cycleAWave3Result('FW-U08','FW-U08-A-PEER','A').correct,true);
assert.equal(d.cycleAWave3Result('FW-U08','FW-U08-A-PEER','C').correct,false);

const partial09={...savedA(),cycleB:{planRoles:'Plan the email introduction and practical middle section.',
 draftV1:'Dear Coordinator, could you consider clearer weekend workshop sign-up instructions?'}};
let saved09=d.appendWave3Version({draft:partial09,versions:[]},301,'FW-U09');
assert(!saved09.firstDraftV1,'incomplete plan must not be captured as full Draft V1');
const complete09={...partial09,cycleB:{...partial09.cycleB,
 commitmentNote:'I addressed the coordinator respectfully and requested a change.'}};
saved09=d.appendWave3Version({...saved09,draft:complete09},302,'FW-U09');
assert.equal(saved09.firstDraftV1.text,complete09.cycleB.draftV1);
assert.equal(saved09.firstDraftV1.version,2);
assert(d.eligibleWave3Artifact('FW-U09',saved09,'cycleB'));
const updated09={...complete09,cycleB:{...complete09.cycleB,
 draftV1:'A revised different email written by this learner after feedback.'}};
const later09=d.appendWave3Version({...saved09,draft:updated09},303,'FW-U09');
assert.equal(later09.versions.length,3);
assert.equal(later09.firstDraftV1.text,complete09.cycleB.draftV1,
 'first completed Draft V1 remains immutable across revision');
assert.equal(later09.versions[1].draft.cycleB.draftV1,complete09.cycleB.draftV1);
assert.equal(d.eligibleWave3Artifact('FW-U09',{...later09,draft:{...updated09,
 cycleB:{...updated09.cycleB,commitmentNote:'an unsaved new note'}}},'cycleB'),null);
assert(d.coverWave3Result('FW-U09',['weekday','registration','resource','decisionRequest']).correct);
assert(!d.coverWave3Result('FW-U09',['weekday','registration']).correct);
for(const unit of content)for(const question of unit.extras){
 assert(d.supplementalWave3Result(unit.id,question.id,question.key).correct);
 assert.equal(d.supplementalWave3Result(unit.id,question.id,'INVALID'),null);
}

const tutorService=moduleTS(read('ai/service.ts'),'ai/service.ts',{
 './teaching-validation':{validateTeachingRating:()=>null},
 './prompts/registry.json':registry,'../content/writing-rubric.json':{criteria:[]},
  '../domain/writing-studio-reference':{CEFR_WRITING_CRITERIA:[],CEFR_TARGET_GUIDANCE:{},WRITING_STUDIO_CEFR_RUBRIC_VERSION:'cefr-written-production-2020-v1',validCEFRWritingLevel:()=>false},
 './validation':{validateRating:()=>null}
});
let reply,request,failures=0;
const tutor=tutorService.createTutorService({available:true,
 reportFailure:()=>failures++,generate:async x=>{request=x;return {provider:'firebase-ai-logic',
  model:'synthetic-only',result:reply}}});
const good=text=>({summary:'You identified your reader purpose.',
 strengths:['You name the information need.'],improvements:[],
 quotes:[text.slice(0,Math.min(21,text.length))],
 questions:['Which idea does this sentence refer to?'],nextAction:'Clarify your own intended meaning.',
 scores:null,level:null});
(async()=>{
 for(const a of [d.wave3Artifact('FW-U07',draft07,'cycleB'),
  d.wave3Artifact('FW-U08',draft08,'cycleB'),
  d.wave3Artifact('FW-U09',complete09,'cycleB')]){
  reply=good(a.text);
  const feedback=await tutor.coach('foundation-writing',a.task,
   {unitId:a.unitId,fixtureId:a.fixtureId,text:a.text},{responseLanguage:'en'});
  assert(feedback,'valid synthetic result');
  assert.equal(request.purpose,'foundation-writing-review');
  assert.equal(request.promptVersion,'1.4.0');
  assert.equal(feedback.structuredResult.scores,null);
  for(const bad of [
   {...good(a.text),scores:{grade:9}},
   {...good(a.text),level:'C2'},
   {...good(a.text),quotes:['This was never submitted as learner text']},
   {...good(a.text),improvements:['one','two','three']}
  ]){
   reply=bad;assert.equal(await tutor.coach('foundation-writing',a.task,
    {unitId:a.unitId,fixtureId:a.fixtureId,text:a.text},{}),null);
  }
  reply=good(a.text);
  assert.equal(await tutor.coach('foundation-writing',a.task,
   {unitId:'FW-U01',fixtureId:a.fixtureId,text:a.text},{}),null,
   'cross-unit fixture misuse must fail closed');
 }
 assert(failures>=15);
 console.log('PASS foundation-writing-u07-u09-v1: reviewed keys/rationales, original submissions, version identity, immutable first Draft V1, cross-unit AI and scores:null, no provider writes.');
})().catch(e=>{console.error(e);process.exitCode=1});
