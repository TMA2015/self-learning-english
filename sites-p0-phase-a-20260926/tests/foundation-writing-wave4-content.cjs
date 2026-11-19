'use strict';
/** Synthetic-only Wave4 source acceptance: does NOT represent authored lesson text. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const base=path.resolve(__dirname,'..');
function load(rel,mocks={}){
 const file=path.join(base,rel),hold={exports:{}};
 const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,
  compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,
   esModuleInterop:true,resolveJsonModule:true}}).outputText;
 vm.runInNewContext(compiled,{module:hold,exports:hold.exports,JSON,Date,Object,Array,Set,Number,String,Error,
  require:n=>{if(Object.hasOwn(mocks,n))return mocks[n];throw Error('Unmocked import '+n)}},
  {filename:file,timeout:10000});
 return hold.exports;
}
const domain=load('domain/foundation-writing-wave4-readiness.ts');
const m=load('domain/foundation-writing-wave4-content.ts',{'./foundation-writing-wave4-readiness':domain});
const unitIds=['FW-U10','FW-U11','FW-U12'];
const sentence='This original synthetic fixture is for schema QA, not for students or academic review.';
const strip={topic:'Synthetic task context',task:'Write an original synthetic message',
 mustInclude:'Give a specific example and a reader request',boundary:'No invented facts or claimed approval'};
function objectives(id,type){
 return Object.entries(domain.reviewedKeys).filter(([k])=>k.startsWith(id+'-'+type)).map(([qid,key])=>({
 id:qid,key,stem:sentence+' synthetic independent question',options:[...'ABCD'].map(c=>({id:c,text:sentence+' '+qid+c,rationale:'Synthetic rationale '+qid+c+' is not learner facing.'}))
 }));
}
function unit(id){
 const stage=kind=>({id:id+'-'+kind,prompt:sentence+' '+kind,taskStrip:strip,
  fields:[{key:'draftV1',label:'Write an original independently authored response'}]});
 return {id,title:'Synthetic '+id+' teaching only',outcome:'The learner will practise source-gated contract validation, not a real lesson.',
 minutes:'30–45',
 source:{document:m.WAVE4_SOURCE_NAME,sha256:m.WAVE4_SOURCE_SHA256,
  notebooklm:m.WAVE4_NOTEBOOKLM_VERDICT,verdict:'PASS',requiredChanges:'NONE'},
 teaching:{lessons:[sentence+' 1',sentence+' 2'],demo:{id:id+'-D01',
  prompt:sentence+' demonstration',steps:['Notice','Decide','Why','Reject/repair','Transfer'].map(x=>[x,sentence])},
  a1:'Optional A1 bridge',b1:'Optional B1 stretch'},
 cycleA:{id:id+'-A',prompt:sentence+' Practice A',taskStrip:strip,
  ownFields:[{key:'reason',label:'Explain the reason in your own words'}],items:objectives(id,'A-')},
 cycleB:stage('B'),transfer:stage('T'),extras:objectives(id,'F')};
}
const valid=unitIds.map(unit);
let n=0;
const check=(name,fn)=>{fn();console.log('PASS '+(++n)+' '+name)};
check('all 3 valid synthetic source contracts accepted',()=>{
 const x=m.validateWave4Bundle(valid);
 assert.equal(x.pass,true,JSON.stringify(x.errors));assert.equal(x.objectives,24);
 assert.equal(x.rationales,96);assert.equal(x.sourceVerifiedByByteHash,false);
});
check('two units fail closed',()=>assert.equal(m.validateWave4Bundle(valid.slice(0,2)).pass,false));
check('duplicate unit fails',()=>{const x=structuredClone(valid);x[2]=structuredClone(x[1]);
 assert.equal(m.validateWave4Bundle(x).pass,false)});
check('wrong academic source SHA blocked',()=>{const x=structuredClone(valid);x[1].source.sha256='bad';
 assert.equal(m.validateWave4Bundle(x).pass,false)});
check('unverified verdict blocked',()=>{const x=structuredClone(valid);x[0].source.verdict='DRAFT';
 assert.equal(m.validateWave4Bundle(x).pass,false)});
check('worked demo absent blocked',()=>{const x=structuredClone(valid);x[0].teaching.demo.steps=[];
 assert.equal(m.validateWave4Bundle(x).pass,false)});
check('answer leakage via demo reused task blocked',()=>{const x=structuredClone(valid);
 x[0].teaching.demo.prompt=x[0].cycleA.prompt;assert.equal(m.validateWave4Bundle(x).pass,false)});
check('missing four-part Task Map blocked',()=>{const x=structuredClone(valid);delete x[0].cycleB.taskStrip.boundary;
 assert.equal(m.validateWave4Bundle(x).pass,false)});
check('missing transfer writing fields blocked',()=>{const x=structuredClone(valid);x[2].transfer.fields=[];
 assert.equal(m.validateWave4Bundle(x).pass,false)});
check('duplicate writer keys blocked',()=>{const x=structuredClone(valid);
 x[1].cycleB.fields.push({...x[1].cycleB.fields[0]});assert.equal(m.validateWave4Bundle(x).pass,false)});
check('missing rationale blocked',()=>{const x=structuredClone(valid);x[2].extras[1].options[0].rationale='';
 assert.equal(m.validateWave4Bundle(x).pass,false)});
check('incorrect fixed key blocked',()=>{const x=structuredClone(valid);x[1].cycleA.items[0].key='Z';
 assert.equal(m.validateWave4Bundle(x).pass,false)});
check('cross-unit objective blocked',()=>{const x=structuredClone(valid);x[0].extras[0].id='FW-U11-F01';
 assert.equal(m.validateWave4Bundle(x).pass,false)});
check('student-facing original source is not shipped',()=>{
 const contents=fs.readdirSync(path.join(base,'content'));
 assert.equal(contents.filter(x=>/^foundation-writing-u(10|11|12)\.json$/.test(x)).length,0);
});
check('learner Wave4 renderer is isolated from HomeClient routes',()=>{
 const home=fs.readFileSync(path.join(base,'app/home-client.tsx'),'utf8');
 assert(!home.includes("from './foundation-writing-wave4'"));
 assert(!home.includes('foundation-writing-u10'));
});
check('source verifier utility exists and exact checksum is pinned',()=>{
 const source=fs.readFileSync(path.join(base,'scripts/verify-foundation-writing-wave4-source.cjs'),'utf8');
 assert.match(source,/68935/);assert.match(source,/cca51171781dc535c6a4080107b0204561b850cfcaf33e089fce2eb184468083/);
});
check('course shell includes explicit save and opt-in review actions',()=>{
 const ui=fs.readFileSync(path.join(base,'app/foundation-writing-wave4.tsx'),'utf8');
 assert.match(ui,/Save &amp; Exit/);assert.match(ui,/Get personal AI Tutor feedback/);
 assert.match(ui,/safeReview/);assert.match(ui,/sourceAudit\.pass/);
});
console.log(JSON.stringify({result:'PASS',gate:'FOUNDATION_WRITING_WAVE4_CONTENT_SHELL',tests:n,
 authoringSource:'NOT_AVAILABLE',uiMountedInLiveApp:false,release:'NO_GO'}));
