'use strict';
/** U04–U06 Wave2 academic source/keys and process-state fail-closed contract. NO provider/network. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const sources=['04','05','06'].map(id=>JSON.parse(read('content/foundation-writing-u'+id+'.json')));
const [u04,u05,u06]=sources,domainText=read('domain/foundation-writing-u04-u06.ts');
const registry=JSON.parse(read('ai/prompts/registry.json'));
const home=read('app/home-client.tsx'),ui=read('app/foundation-writing-u04-u06.tsx');
const originalType=read('domain/foundation-writing-u01.ts'),serviceText=read('ai/service.ts');
const provenance='42a059c04c269664e268d4d7a80a9c23536e1c868bf51a36ab34671e8ec052dd';
const expectedKeys=[['B','C','C','B'],['B','C','C','C'],['B','B','A','C']];
const unique=new Set();
sources.forEach((unit,i)=>{
 assert.equal(unit.id,'FW-U0'+(4+i));assert.equal(unit.source.sha256,provenance);
 assert.equal(unit.source.verdict,'PASS');assert.equal(unit.source.requiredChanges,'NONE');
 assert.equal(unit.supplemental.length,4,'four misconception fixtures');
 assert.equal(unit.teaching.demo.steps.length>=5,true,'step-by-step original think-aloud');
 assert.notEqual(unit.teaching.demo.prompt,unit.cycleA.prompt);
 assert.notEqual(unit.cycleA.prompt,unit.cycleB.prompt);
 assert.notEqual(unit.cycleB.prompt,unit.transfer.prompt);
 assert.deepEqual(unit.supplemental.map(x=>x.key),expectedKeys[i],'all 12 audited keys match');
 for(const q of unit.supplemental){
  assert(!unique.has(q.id),'Globally unique objective fixture '+q.id);unique.add(q.id);
  assert.deepEqual(q.options.map(x=>x.id),['A','B','C','D']);
  assert.equal(q.options.filter(x=>x.id===q.key).length,1);
  assert(q.options.every(x=>x.rationale&&x.rationale.trim().length>0),'all 48 rationales');
 }
});
assert.deepEqual(u04.cycleA.relations.map(x=>x.key),['CAUSE_TO_RESULT','CONTRAST','RESULT_WITH_REASON']);
assert.deepEqual(u04.cycleA.choices.map(x=>x.key),['so','Although','because']);
assert(u04.cycleA.choices.every(x=>x.options.length===4&&x.options.every(o=>o.rationale.trim())));
assert.deepEqual(u05.cycleA.cards.map(x=>x.key),['1','2','3','4','REMOVE']);
assert.deepEqual(u06.cycleA.cards.map(x=>x.key),[
 'P1: Proposal and invitation','P2: Main sharing activity','P3: Safe next steps and close',
 'DUPLICATE_OR_EMPTY','OFF_TASK','DUPLICATE_ROLE']);
assert.match(u04.cycleB.note,/Both intended agents/);
assert.deepEqual(u04.cycleB.intendedAgents,['Ms. Lee','Mia']);
assert.match(u05.cycleB.suggestedLength,/guidance only/);
assert.match(u06.cycleB.instruction,/three or four paragraph roles/i);
assert.match(u06.transfer.instruction,/accepted-items list/);
assert.match(ui,/Get personal AI Tutor feedback/);
assert.match(ui,/eligibleWave2Artifact\(unitId,work,target\)/);
assert.match(ui,/if\(!saved\|\|!own\|\|pending\|\|saveBusy\)return/);
assert.match(ui,/tutor\.coach\('foundation-writing'/);
assert.match(ui,/quoteWithin\(d.paragraph,d.sentenceJobQuote\)/);
assert.match(ui,/Add optional fourth role/);
assert.match(ui,/<PromptStrip strip=/);
assert.match(ui,/Save &amp; Exit/);
assert(!/dangerouslySetInnerHTML|XMLHttpRequest|sendBeacon/.test(ui));
assert.match(home,/saveFoundationWave2/);
assert.match(home,/versions:prior.versions/,'rollback failed verified save');
assert.match(home,/return false;/,'failed save returns false');
assert.match(originalType,/'FW-U04'\?:Wave2Work<U04Draft>/);
assert.match(originalType,/'FW-U05'\?:Wave2Work<U05Draft>/);
assert.match(originalType,/'FW-U06'\?:Wave2Work<U06Draft>/);
assert.match(read('scripts/qa-free-first.mjs'),/foundation-writing-u04-u06-v1\.cjs/,'core QA registered');
assert.equal(registry['foundation-writing-review'].version,'1.4.0');
for(const unit of sources)assert(registry['foundation-writing-review'].system.includes(unit.id));
function loadTS(content,name,mocks){
 const holder={exports:{}};
 const compiled=ts.transpileModule(content,{fileName:name,compilerOptions:{
  target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,
  esModuleInterop:true,resolveJsonModule:true}}).outputText;
 vm.runInNewContext(compiled,{
  module:holder,exports:holder.exports,Date,Set,Object,JSON,Number,
  require:spec=>{if(Object.hasOwn(mocks,spec))return mocks[spec];throw Error('Missing mock '+spec)}
 },{filename:name,timeout:8000});
 return holder.exports;
}
const d=loadTS(domainText,'foundation-writing-u04-u06.ts',{
 '../content/foundation-writing-u04.json':u04,
 '../content/foundation-writing-u05.json':u05,
 '../content/foundation-writing-u06.json':u06
});
const empty04=d.emptyWave2Work('FW-U04');
assert.equal(empty04.versions.length,0);
assert.equal(d.exactSavedWave2(empty04),null);
assert.equal(d.eligibleWave2Artifact('FW-U04',empty04,'cycleB'),null);
let notice={s1:'The after-school workshop will be held in the school library.',
 s2:'The classroom is being repaired, so the workshop must move.',
 s3:'Some families may worry; the library is the new confirmed location.',
 s4:'Please ask the school if you need details about finding the library.'};
let draft04={...empty04.draft,notice,
 repairAgent:'Mia',
 repairRevised:'After Ms. Lee told Mia about the new room, Mia sent the class a message.',
 repairWhy:'Mia is explicitly named so readers know which person sent the message.'};
let work04=d.appendWave2Version({...empty04,draft:draft04},1000);
assert.equal(work04.versions.length,1);
assert.equal(work04.versions[0].evidence_weight,0);
assert.equal(work04.versions[0].proficiency_weight,0);
assert(d.exactSavedWave2(work04));
assert.equal(d.eligibleWave2Artifact('FW-U04',work04,'cycleB').fixtureId,'FW-U04-B');
assert.equal(d.appendWave2Version(work04,1001).versions.length,1);
let changed={...work04,draft:{...draft04,notice:{...notice,s1:'Unsaved change to the new location.'}}};
assert.equal(d.eligibleWave2Artifact('FW-U04',changed,'cycleB'),null);
let revised=d.appendWave2Version(changed,1002);
assert.equal(revised.versions.length,2);
assert.equal(revised.versions[0].draft.notice.s1,notice.s1,'immutable version one');
assert.equal(revised.versions[1].draft.notice.s1,'Unsaved change to the new location.');
let withLee={...draft04,repairAgent:'Ms. Lee',
 repairRevised:'After Ms. Lee told Mia about the new room, Ms. Lee sent the class a message.'};
assert(d.eligibleWave2Artifact('FW-U04',d.appendWave2Version({draft:withLee,versions:[]},2000),'cycleB'),
 'Either intended agent is acceptable when explicitly chosen');

let d05=d.emptyWave2Work('FW-U05').draft;
d05={...d05,plan:{point:'Recommend a tool corner',reason:'Access to supplies',detail:'Rulers on request'},
 paragraph:'A school tool-lending corner could help classmates share supplies when someone forgets a ruler. For example, a student could borrow a ruler and return it after the lesson.',
 sentenceJobQuote:'For example, a student could borrow a ruler and return it after the lesson.',
 sentenceJobRole:'detail',sentenceJobWhy:'A specific possible classroom use'};
let w05=d.appendWave2Version({draft:d05,versions:[]},3000);
assert(d.eligibleWave2Artifact('FW-U05',w05,'cycleB'));
let bad05={...w05,draft:{...d05,sentenceJobQuote:'An invented quote not in the learner paragraph.'}};
assert.equal(d.eligibleWave2Artifact('FW-U05',bad05,'cycleB'),null);
let badQuote=d.appendWave2Version({draft:bad05.draft,versions:[]},4000);
assert.equal(d.eligibleWave2Artifact('FW-U05',badQuote,'cycleB'),null,
 'Cannot send fabricated sentence-role quote even after save');
const role=(job,notes)=>({job,notes});
let d06={...d.emptyWave2Work('FW-U06').draft,
 outline:{roles:[role('Introduce fair','purpose; visitors; weekend'),
  role('Show activity zone A','paper crafts; tools; demonstration'),
  role('Zone B and safety','model making; adult supervision; safe materials')],
  orderRationale:'Readers need purpose first, then activities, then safety.',
  overlapCheck:'Each role has distinct information.'}};
let w06=d.appendWave2Version({draft:d06,versions:[]},5000);
const owned=d.eligibleWave2Artifact('FW-U06',w06,'cycleB');
assert(owned?.text.includes('P3 keyword notes:'));
assert(!owned?.text.includes('FW-U06-F01'));
assert(d.outlineReady(d06.outline),'three roles are sufficient');
assert(d.outlineReady({...d06.outline,roles:[...d06.outline.roles,role('Call to action','sign up; confirm place')]}),
 'four roles also allowed');
assert(!d.outlineReady({...d06.outline,roles:[d06.outline.roles[0],{job:'',notes:'blank'},d06.outline.roles[2]]}));
assert.equal(d.eligibleWave2Artifact('FW-U06',{...w06,draft:{...d06,outline:{...d06.outline,orderRationale:'new unsaved plan'}}},'cycleB'),null);
for(const unit of sources)for(const q of unit.supplemental){
 const correct=d.wave2ObjectiveResult(unit.id,q.id,q.key);
 assert(correct?.correct);assert.equal(correct.rationales.length,4);
 assert.equal(d.wave2ObjectiveResult(unit.id,q.id,'INVALID'),null);
}
const service=loadTS(serviceText,'ai/service.ts',{
 './teaching-validation':{validateTeachingRating:()=>null},
 './prompts/registry.json':registry,
 '../content/writing-rubric.json':{criteria:[]},
  '../domain/writing-studio-reference':{CEFR_WRITING_CRITERIA:[],CEFR_TARGET_GUIDANCE:{},WRITING_STUDIO_CEFR_RUBRIC_VERSION:'cefr-written-production-2020-v1',validCEFRWritingLevel:()=>false},
 './validation':{validateRating:()=>null}
});
let output=null,lastRequest=null,failures=0;
const tutor=service.createTutorService({
 available:true,reportFailure:()=>failures++,
 generate:async req=>{lastRequest=req;return {provider:'firebase-ai-logic',model:'synthetic-only',result:output}}
});
const good=text=>({summary:'Learner noted a useful reader purpose.',
 strengths:['Their topic is clear.'],improvements:[],
 quotes:[text.slice(0,Math.min(22,text.length))],
 questions:['How does this detail support your message?'],
 nextAction:'Review your chosen sentence and clarify its meaning.',
 scores:null,level:null});
(async()=>{
 const inputs=[d.learnerWave2Artifact('FW-U04',draft04,'cycleB'),
  d.learnerWave2Artifact('FW-U05',d05,'cycleB'),
  d.learnerWave2Artifact('FW-U06',d06,'cycleB')];
 for(const a of inputs){
  output=good(a.text);
  const reviewed=await tutor.coach('foundation-writing',a.task,{
    unitId:a.unitId,fixtureId:a.fixtureId,text:a.text},{responseLanguage:'en'});
  assert(reviewed);
  assert.equal(lastRequest.purpose,'foundation-writing-review');
  assert.equal(lastRequest.promptVersion,'1.4.0');
  assert.equal(reviewed.structuredResult.scores,null);
  for(const invalid of [
   {...good(a.text),scores:{meaning:9}},
   {...good(a.text),level:'C1'},
   {...good(a.text),quotes:['fake words never submitted']},
   {...good(a.text),improvements:['a','b','c']},
   {...good(a.text),questions:[]},
  ]){
   output=invalid;
   assert.equal(await tutor.coach('foundation-writing',a.task,{
    unitId:a.unitId,fixtureId:a.fixtureId,text:a.text},{}),null);
  }
  output=good(a.text);
  assert.equal(await tutor.coach('foundation-writing',a.task,{
   unitId:'FW-U01',fixtureId:a.fixtureId,text:a.text},{}),null,'Cross-unit mismatch fails closed');
 }
 assert(failures>=18);
 console.log('PASS foundation-writing-u04-u06-v1: 12 reviewed MCQs/48 rationales, cycle A keys, original writing versions, both agents, flexible outlines, 0 scores, synthetic AI cross-unit and quote guards; no live requests.');
})().catch(e=>{console.error(e);process.exitCode=1});
