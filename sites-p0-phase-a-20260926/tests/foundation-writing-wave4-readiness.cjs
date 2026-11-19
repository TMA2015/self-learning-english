'use strict';
/** QA-only synthetic contract. Full reviewed Wave 4 teaching source is NOT included. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const vm=require('node:vm'),ts=require('typescript');
const src=fs.readFileSync(path.join(__dirname,'../domain/foundation-writing-wave4-readiness.ts'),'utf8');
const exposed={};
const js=ts.transpileModule(src,{fileName:'foundation-writing-wave4-readiness.ts',compilerOptions:{
 target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
vm.runInNewContext(js,{exports:exposed,JSON,Date,Object,Set,Number,Error,Array,String},
 {filename:'foundation-writing-wave4-readiness.ts',timeout:5000});
const m=exposed;
const u09Text='Dear manager, could you consider a possible future workshop?';
const base=()=>({schemaVersion:1,units:{'FW-U01':{legacy:'untouched'},'FW-U09':{
 firstDraftV1:{text:u09Text,version:1,savedAt:100},versions:[{version:1,savedAt:100,
  draft:{cycleB:{draftV1:u09Text}}}]}}});
const draft=()=>({cycleAAnswers:{},cycleB:{draftV1:'Last weekend I cooked lunch with my family.'},
 transfer:{},extrasAnswers:{}});
let n=0;
function check(title,fn){fn();console.log('PASS',++n,title)}
check('24 reviewed fixture IDs have key map',()=>assert.equal(Object.keys(m.reviewedKeys).length,24));
const synthetic=()=>Object.entries(m.reviewedKeys).map(([id,key])=>({id,key,
 options:[..."ABCD"].map(c=>({id:c,text:'Synthetic '+id+c,rationale:'Synthetic explanation '+id+c}))}));
check('24 items and 96 rationale shapes accepted',()=>assert.equal(m.auditObjectives(synthetic()).pass,true));
check('wrong key rejected',()=>{const x=synthetic();x[0].key='Z';assert.equal(m.auditObjectives(x).pass,false)});
check('missing rationale rejected',()=>{const x=synthetic();x[0].options[0].rationale='';assert.equal(m.auditObjectives(x).pass,false)});
check('duplicate option rejected',()=>{const x=synthetic();x[0].options[0].id='B';assert.equal(m.auditObjectives(x).pass,false)});
check('U09 saved original verified',()=>assert.equal(m.checkedScope(base()).firstDraft,u09Text));
check('U09 tampered first draft rejected',()=>{const x=base();x.units['FW-U09'].firstDraftV1.text='tampered';assert.throws(()=>m.checkedScope(x))});
check('unknown state schema rejected',()=>assert.throws(()=>m.checkedScope({schemaVersion:2,units:{}})));
const edited=m.edit(base(),'FW-U10',draft());
check('edit preserves U09',()=>assert.deepEqual(edited.units['FW-U09'],base().units['FW-U09']));
const staged=m.stage(edited,'FW-U10',200);
check('staged version has zero weights',()=>{assert.equal(staged.work.versions.length,1);assert.equal(staged.work.versions[0].evidence_weight,0);assert.equal(staged.work.versions[0].proficiency_weight,0)});
check('unsaved state not verified',()=>assert.equal(m.verifyReadback(staged,edited),false));
check('exact readback verified',()=>assert.equal(m.verifyReadback(staged,staged.after),true));
check('missing sibling rejected',()=>{const x=JSON.parse(JSON.stringify(staged.after));delete x.units['FW-U01'];assert.equal(m.verifyReadback(staged,x),false)});
check('altered sibling rejected',()=>{const x=JSON.parse(JSON.stringify(staged.after));x.units['FW-U01'].legacy='changed';assert.equal(m.verifyReadback(staged,x),false)});
check('duplicate version not appended',()=>assert.equal(m.stage(staged.after,'FW-U10',201).addedVersion,false));
check('failed-write rollback removes phantom save',()=>assert.equal(m.rollback(staged.after,staged).scope.units['FW-U10'].versions.length,0));
check('rollback retains unsaved edits',()=>{const x=JSON.parse(JSON.stringify(staged.after));x.units['FW-U10'].draft.cycleB.draftV1='newly typed';const y=m.rollback(x,staged);assert.equal(y.scope.units['FW-U10'].draft.cycleB.draftV1,'newly typed')});
check('rollback refuses concurrent version changes',()=>{const x=JSON.parse(JSON.stringify(staged.after));x.units['FW-U10'].versions.push({...x.units['FW-U10'].versions[0],version:2});assert.equal(m.rollback(x,staged).rolledBack,false)});
check('AI requires saved snapshot',()=>assert.equal(m.eligibleArtifact('FW-U10',edited.units['FW-U10'],'FW-U10-B',['draftV1']),null));
check('AI takes only saved selected text',()=>assert.match(m.eligibleArtifact('FW-U10',staged.work,'FW-U10-B',['draftV1']),/cooked/));
check('AI wrong-unit fixture rejected',()=>assert.equal(m.eligibleArtifact('FW-U10',staged.work,'FW-U11-B',['draftV1']),null));
console.log(JSON.stringify({result:'PASS',gate:'FOUNDATION_WRITING_WAVE4_BRIDGE_PREFLIGHT',tests:n,
 content:'NOT_INCLUDED',sourceRecovered:false,release:'NO_GO'}));
