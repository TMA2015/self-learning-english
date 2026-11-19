'use strict';
/** Reviewed Foundation Writing FW-U01 end-to-end contract. Synthetic AI only. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ts=require('typescript'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=x=>fs.readFileSync(path.join(root,x),'utf8');
const source=JSON.parse(read('content/foundation-writing-u01.json'));
const registry=JSON.parse(read('ai/prompts/registry.json'));
const home=read('app/home-client.tsx'),ui=read('app/foundation-writing-u01.tsx');
const domainText=read('domain/foundation-writing-u01.ts');
const aiServiceText=read('ai/service.ts');
assert.equal(source.id,'FW-U01');
assert.equal(source.source.sha256,'4d0c80a754a68cc2b23be09e55b47741aa09ea25b18accdae72e562d016b7e3b');
assert.equal(source.source.academicVerdict,'PASS');
assert.equal(source.demo.id,'FW-U01-D01');
assert.equal(source.demo.steps.length,5);
assert.equal(source.concepts.length,4);
assert.equal(source.cycleA.chunks.length,6);
assert.deepEqual(source.cycleA.chunks.map(x=>x.id),['A-S1','A-S2','A-S3','A-S4','A-S5','A-S6']);
assert.deepEqual(source.cycleA.chunks.map(x=>x.key),['Task','Boundary','Task','Boundary','Must Include','Must Include']);
assert.equal(source.cycleB.key,'A');
assert.equal(source.cycleB.options.length,4);
assert.equal(source.transfer.id,'FW-U01-T');
const keys=['B','C','A','D'];
assert.equal(source.supplemental.length,4);
source.supplemental.forEach((item,i)=>{
 assert.equal(item.id,'FW-U01-F0'+(i+1));assert.equal(item.key,keys[i]);
 assert.deepEqual(item.options.map(o=>o.id),['A','B','C','D']);
 assert.equal(new Set(item.options.map(o=>o.text)).size,4,'Distinct learner choices');
 assert(item.options.every(o=>typeof o.rationale==='string'&&o.rationale.trim()),
  'All four option rationales must be present');
});
assert(!source.demo.prompt.includes(source.cycleA.prompt));
assert.notEqual(source.cycleA.prompt,source.cycleB.prompt);
assert.notEqual(source.cycleB.prompt,source.transfer.prompt);

assert.match(home,/type View="foundation-writing"/);
assert.match(home,/foundationWritingV1\?:FoundationWritingV1/);
assert.match(home,/view==="foundation-writing"&&/);
assert.match(home,/appendU01Version\(u01Work\(previous\),Date\.now\(\)\)/);
assert.match(home,/return saveNow\(next\)/,'Real learner service must verify the snapshot save');
assert.match(ui,/<EnglishLessonTutor/,'Knowledge Tutor uses lesson-only context');
assert.match(ui,/Get personal AI Tutor feedback/);
assert.match(ui,/eligibleU01Artifact\(work,target\)/,'Only exactly saved original artifact can be sent');
assert.match(ui,/tutor\.coach\('foundation-writing'/,'Do not use a generic essay evaluator for Task Map');
assert.match(ui,/response\?\.provider==='firebase-ai-logic'/);
assert.match(ui,/Save &amp; Exit/);
assert(!/fetch\(|axios|sendBeacon|innerHTML/.test(ui),'No unguarded provider/network request or untrusted DOM HTML');
assert(!/writingCourseV2B\s*=|writingCourseV2C\s*=|writingCourseV2\s*=/.test(ui),
 'No writes to legacy course states');
assert.match(read('scripts/qa-free-first.mjs'),/foundation-writing-u01-v1\.cjs/,'Registered in the existing QA core');
assert.equal(registry['foundation-writing-review'].status,'active');
assert.match(registry['foundation-writing-review'].system,/Scores and levels MUST be null/);
assert.match(registry['foundation-writing-review'].system,/contiguous verbatim substring/);

// Exercise pure domain logic through TypeScript transpilation with a local JSON import.
function loadTS(content,file,mocks){
 const holder={exports:{}};
 const compiled=ts.transpileModule(content,{fileName:file,
  compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,
   esModuleInterop:true,resolveJsonModule:true},
 }).outputText;
 vm.runInNewContext(compiled,{
  module:holder,exports:holder.exports,Date,JSON,Set,
  require:spec=>{if(Object.hasOwn(mocks,spec))return mocks[spec];throw Error('Unknown test module: '+spec)},
 },{timeout:5000,filename:file});
 return holder.exports;
}
const domain=loadTS(domainText,'foundation-writing-u01.ts',{
 '../content/foundation-writing-u01.json':source,
});
const empty=domain.emptyU01Work();
assert.equal(empty.versions.length,0);
assert.equal(domain.exactSavedU01(empty),null);
assert.equal(domain.eligibleU01Artifact(empty,'cycleA'),null);
let draft={...empty.draft,cycleAMap:{
 topic:'Opening hours of our school library',
 task:'Ask the librarian for longer Saturday access',
 mustInclude:'A reason and a proposed closing time',
 boundary:'Respectful note to librarian for Saturday',
 commitment:'I need to request longer hours and explain why',
}};
let work={...empty,draft};
let first=domain.appendU01Version(work,1000);
assert.equal(first.versions.length,1);
assert.equal(first.versions[0].version,1);
assert.equal(first.versions[0].evidence_weight,0);
assert.equal(first.versions[0].proficiency_weight,0);
assert(domain.exactSavedU01(first));
const request=domain.eligibleU01Artifact(first,'cycleA');
assert(request);
assert.equal(request.fixtureId,'FW-U01-A');
assert(request.text.includes('topic: Opening hours'));
assert(!request.text.includes('A-S1'));
assert(!request.text.includes('A-S4'));
assert.equal(domain.appendU01Version(first,1001).versions.length,1,'Idempotent same-version save');
const edit={...first,draft:{...first.draft,cycleAMap:{...first.draft.cycleAMap,topic:'Different topic'}}};
assert.equal(domain.exactSavedU01(edit),null,'Changing the draft invalidates the saved snapshot');
assert.equal(domain.eligibleU01Artifact(edit,'cycleA'),null,'Unsaved edits cannot reach AI');
const savedAgain=domain.appendU01Version(edit,1002);
assert.equal(savedAgain.versions.length,2);
assert.equal(savedAgain.versions[0].draft.cycleAMap.topic,'Opening hours of our school library',
 'Original saved artifact remains immutable after edits');
assert.equal(savedAgain.versions[1].draft.cycleAMap.topic,'Different topic');
const q=domain.objectiveResult('FW-U01-F02','C');
assert(q?.correct);assert.equal(q.key,'C');assert.equal(q.explanations.length,4);
assert.equal(domain.objectiveResult('FW-U01-F02','Z'),null);
assert.equal(domain.eligibleU01Artifact(savedAgain,'cycleB'),null,
 'No fake AI review for an empty learner-authored repair');

// Exercise actual AI Tutor router and fail-closed qualitative validation.
const service=loadTS(aiServiceText,'ai/service.ts',{
 './teaching-validation':{validateTeachingRating:()=>null},
 './prompts/registry.json':registry,
 '../content/writing-rubric.json':{criteria:[]},
 './validation':{validateRating:()=>null},
});
const good=()=>{
 const s=request.text;
 return {summary:'Your map is clear in its explanation of the topic.',
  strengths:['You stated what you will ask for.'],improvements:['Make the day boundary explicit.'],
  quotes:['topic: Opening hours'],questions:['What day is constrained?'],
  nextAction:'Read the stated day and review your boundary field.',
  scores:null,level:null};
};
let output=good(),lastReq=null,failures=0;
const tutor=service.createTutorService({
 available:true,reportFailure:()=>failures++,
 async generate(req){lastReq=req;return {provider:'firebase-ai-logic',model:'synthetic-only',result:output}},
});
(async()=>{
 const context={unitId:'FW-U01',fixtureId:request.fixtureId,text:request.text};
 const ok=await tutor.coach('foundation-writing',request.task,context,{responseLanguage:'vi'});
 assert(ok,'Valid task-map feedback should pass');
 assert.equal(lastReq.purpose,'foundation-writing-review');
 assert.equal(lastReq.promptVersion,'1.1.0');
 assert.equal(lastReq.input.responseLanguage,'vi');
 assert.equal(ok.structuredResult.scores,null);
 assert.equal(ok.structuredResult.level,null);
 for(const changes of [
  {scores:{grammar:10}},{level:'C2'},{quotes:['Not in learner text']},
  {strengths:['a','b','c']},{improvements:['a','b','c']},
  {quotes:['a','b','c','d']},{questions:[]},{questions:['1','2','3']},{nextAction:''},
 ]) {
  output={...good(),...changes};
  assert.equal(await tutor.coach('foundation-writing',request.task,context,{responseLanguage:'en'}),null,
   'Invalid personalized AI result must fail closed');
 }
 assert(failures>=9);
 assert.equal(lastReq.purpose,'foundation-writing-review');
 console.log('PASS foundation-writing-u01-v1: reviewed source IDs; immutable snapshots; explicit saved-only AI; qualitative, grounded mock provider; legacy isolation; no live requests');
})().catch(e=>{console.error(e);process.exitCode=1});
