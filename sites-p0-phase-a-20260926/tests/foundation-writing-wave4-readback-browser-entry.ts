/** Real local-browser persistence test for Wave 4 bridge. Synthetic learner only; no lesson UI or AI. */
import {loadLearnerState,saveLearnerState} from '../infrastructure/browser/client-services';
import {blankWave3Draft,appendWave3Version} from '../domain/foundation-writing-u07-u09';
import {checkedScope,edit,stage,verifyReadback,rollback,eligibleArtifact,
 type Wave4Id,type Wave4Draft,type Scope} from '../domain/foundation-writing-wave4-readiness';

const phase=new URL(location.href).searchParams.get('phase')||'';
const output=document.getElementById('sle-test-result')!;
const check=(ok:unknown,reason:string)=>{if(!ok)throw Error('FW_W4_BROWSER: '+reason)};
const report=(s:string,info:unknown)=>{output.textContent=s+' '+JSON.stringify(info)};
const unitIds:Wave4Id[]=['FW-U10','FW-U11','FW-U12'];
const first='Dear community programme manager, could you consider clearer weekend workshop sign-up instructions? We suggest a visible notice showing the place, time and materials to bring. Thank you for considering this idea.';
const draftFor=(id:Wave4Id):Wave4Draft=>({
 cycleAAnswers:{},cycleB:{draftV1:id+' This is independent learner-authored synthetic practice, saved with the genuine SLE browser service.'},
 transfer:{notice:'A separate transfer action owned by the learner, not auto-graded.'},
 extrasAnswers:{}
});
async function read(){const x=(await loadLearnerState()).state as any;check(x?.foundationWritingV1,'persisted foundation scope');return x}
async function commit(state:any,unit:Wave4Id,at:number){
 const s=stage(state.foundationWritingV1 as Scope,unit,at);
 await saveLearnerState({...state,foundationWritingV1:s.after});
 const result=await read();
 check(verifyReadback(s,result.foundationWritingV1),'verified readback '+unit);
 return {next:result,staged:s};
}
(async()=>{
 if(phase==='write'){
  const d=blankWave3Draft();
  d.cycleB={planRoles:'P1 invitation, P2 details, P3 polite request.',draftV1:first,
    commitmentNote:'This is a completed independent message to the programme manager.'};
  const u09=appendWave3Version({draft:d,versions:[]},Date.now(),'FW-U09');
  check(u09.firstDraftV1?.text===first,'U09 original captured');
  await saveLearnerState({qaWave4Sentinel:'PRESERVE_OLDER_LEARNER_STATE',
   writingCourseV2B:{weeks:{first:'legacy remains untouched'}},
   foundationWritingV1:{schemaVersion:1,units:{'FW-U09':u09,'FW-U01':{legacy:'do not alter this'}}}} as any);
  let current=await read();
  check(checkedScope(current.foundationWritingV1).firstDraft===first,'initial U09 survives round trip');
  const rows:string[]=[];
  for(const id of unitIds){
   const scope=edit(current.foundationWritingV1 as Scope,id,draftFor(id));
   current={...current,foundationWritingV1:scope};
   const result=await commit(current,id,Date.now());
   current=result.next;
   check((current.foundationWritingV1.units[id] as any).versions.length===1,id+' one persisted version');
   rows.push(id);
  }
  check(current.qaWave4Sentinel==='PRESERVE_OLDER_LEARNER_STATE','legacy sentinel retained');
  check(current.foundationWritingV1.units['FW-U01'].legacy==='do not alter this','U01 untouched');
  check(current.foundationWritingV1.units['FW-U09'].firstDraftV1.text===first,'original U09 unchanged');
  report('PASS_FW_W4_WRITE',{units:rows,firstDraftPreserved:true,exactReadbacks:3,providerCalls:0});
 }else if(phase==='restore'){
  let current=await read();
  check(checkedScope(current.foundationWritingV1).firstDraft===first,'restart U09 original');
  for(const id of unitIds){
   const w=current.foundationWritingV1.units[id];
   check(w.versions.length===1,id+' restored after Chromium restart');
   check(w.draft.cycleB.draftV1===draftFor(id).cycleB.draftV1,id+' exact text restored');
   check(eligibleArtifact(id,w,id+'-B',['draftV1'])?.includes(id)===true,'saved-only artifact '+id);
  }
  let changed=edit(current.foundationWritingV1 as Scope,'FW-U10',{
   ...current.foundationWritingV1.units['FW-U10'].draft,
   cycleB:{draftV1:'Wave 4 new text typed after restoring the browser: a substantive learner revision.'},
   revisionDecision:'NO_CHANGE_JUSTIFIED',revisionReason:'One confirmed factual sentence already preserves the intended actor and time.'
  });
  const x=stage(changed,'FW-U10',Date.now());
  check(!verifyReadback(x,current.foundationWritingV1),'unsaved staged version fails persisted proof');
  check(eligibleArtifact('FW-U10',(changed.units['FW-U10'] as any),'FW-U10-B',['draftV1'])===null,
   'unsaved draft never eligible for AI');
  const returned=rollback(x.after,x);
  check(returned.rolledBack,'synthetic failed write rolled back');
  check((returned.scope.units['FW-U10'] as any).versions.length===1,'rollback does not fake persisted version');
  check((returned.scope.units['FW-U10'] as any).draft.cycleB.draftV1.includes('new text typed'),
   'rollback retains unsaved learner text');
  current={...current,foundationWritingV1:returned.scope};
  const committed=await commit(current,'FW-U10',Date.now()+1);
  current=committed.next;
  check(current.foundationWritingV1.units['FW-U10'].versions.length===2,'retry truly committed second version');
  check(current.foundationWritingV1.units['FW-U10'].versions[0].draft.cycleB.draftV1===draftFor('FW-U10').cycleB.draftV1,
   'old U10 snapshot immutable');
  check(current.foundationWritingV1.units['FW-U09'].firstDraftV1.text===first,'U09 immutable after retry');
  check(current.foundationWritingV1.units['FW-U11'].versions.length===1&&
   current.foundationWritingV1.units['FW-U12'].versions.length===1,'sibling history preserved');
  report('PASS_FW_W4_RESTORE',{units:3,restartRead:true,retriedVersion:2,failedSaveGuard:true,originalV1Preserved:true});
 }else if(phase==='verify'){
  const persisted=await read();
  check(persisted.foundationWritingV1.units['FW-U10'].versions.length===2,'second Chromium restart retained retry');
  check(persisted.foundationWritingV1.units['FW-U11'].versions.length===1,'U11 remains saved');
  check(persisted.foundationWritingV1.units['FW-U12'].versions.length===1,'U12 remains saved');
  check(persisted.foundationWritingV1.units['FW-U09'].firstDraftV1.text===first,'U09 still immutable');
  report('PASS_FW_W4_VERIFY',{restartRead:true,versionCounts:[2,1,1],providerCalls:0});
 }else throw Error('Unknown QA phase '+phase);
})().catch(e=>report('FAIL_FW_W4_BROWSER',{error:String(e),stack:String((e as Error).stack).slice(0,1300)}));
