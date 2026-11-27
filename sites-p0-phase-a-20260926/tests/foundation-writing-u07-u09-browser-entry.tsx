import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {FoundationWritingWave3} from '../app/foundation-writing-u07-u09';
import {loadLearnerState,saveLearnerState} from '../infrastructure/browser/client-services';
import {emptyFoundationWritingV1,emptyU01Work} from '../domain/foundation-writing-u01';
import {appendWave3Version,wave3Work,type Wave3Id,type Wave3Draft} from '../domain/foundation-writing-u07-u09';

const phase=new URL(location.href).searchParams.get('phase')??'';
const unit:Wave3Id=phase.startsWith('07')?'FW-U07':phase.startsWith('08')?'FW-U08':'FW-U09';
const root=()=>document.getElementById('app')!;
const output=document.getElementById('sle-test-result')!;
const report=(s:string,extra?:unknown)=>output.textContent=s+(extra?' '+JSON.stringify(extra):'');
const check=(condition:unknown,msg:string)=>{if(!condition)throw Error('FW_WAVE3_BROWSER: '+msg)};
const sleep=(delay:number)=>new Promise<void>(resolve=>setTimeout(resolve,delay));
async function until(predicate:()=>boolean,msg:string){
 for(let i=0;i<320;i++){if(predicate())return;await sleep(40)}
 throw Error('Timeout '+msg+' [visible='+root().textContent?.slice(-450)+']');
}
const button=(label:string)=>[...root().querySelectorAll('button')].find(b=>
 b.textContent?.trim().includes(label)) as HTMLButtonElement|undefined;
function click(label:string){const b=button(label);check(b,'button '+label);b!.click()}
async function write(name:string,value:string){
 const el=root().querySelector('textarea[name="'+name+'"]') as HTMLTextAreaElement|null;
 check(el,'textarea '+name);
 const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')?.set;
 check(setter,'textarea setter');
 setter!.call(el,value);el!.dispatchEvent(new Event('input',{bubbles:true}));
 await until(()=>((root().querySelector('textarea[name="'+name+'"]') as HTMLTextAreaElement|null)?.value===value),'controlled textarea '+name);
}
type State=Record<string,any>;
function TestApp(){
 const [state,setState]=useState<State|null>(null),[error,setError]=useState('');
 const latest=useRef<State>({});
 useEffect(()=>{void (async()=>{
  if(phase==='07save'){
   const foundation=emptyFoundationWritingV1();
   foundation.units['FW-U01']=emptyU01Work();
   await saveLearnerState({qaWave3Sentinel:'PRESERVE_OLD_DATA',
    writingCourseV2B:{weeks:{first:'preserve legacy'}},foundationWritingV1:foundation});
  }
  const loaded=await loadLearnerState();
  latest.current=loaded.state??{};setState(latest.current);
 })().catch(e=>setError(String(e)))},[]);
 function edit(draft:Wave3Draft){
  const prior=latest.current,scope=prior.foundationWritingV1??emptyFoundationWritingV1();
  const work=wave3Work(scope,unit);
  const next={...prior,foundationWritingV1:{...scope,units:{...scope.units,[unit]:{...work,draft}}}};
  latest.current=next;setState(next);
 }
 async function save(){
  if((window as any).__failWave3Save)return false;
  const prior=latest.current,scope=prior.foundationWritingV1??emptyFoundationWritingV1();
  const version=appendWave3Version(wave3Work(scope,unit),Date.now(),unit);
  const next={...prior,foundationWritingV1:{...scope,units:{...scope.units,[unit]:version}}};
  try{await saveLearnerState(next);latest.current=next;setState(next);return true}
  catch{return false}
 }
 if(error)return <div data-load-error>{error}</div>;
 if(!state)return <div data-loading>Loading</div>;
 return <FoundationWritingWave3 unitId={unit} work={wave3Work(state.foundationWritingV1,unit)}
  onEdit={edit} onSave={save} onExit={()=>{(window as any).__exited=true}}/>;
}
(async()=>{
 createRoot(root()).render(<TestApp/>);
 await until(()=>!!root().querySelector('[aria-label="Foundation Writing '+unit+'"]'),'Wave3 app mount');
 check((window as any).__aiCalls===0,'No AI on load');
 check(JSON.stringify([...document.querySelectorAll('.fw-steps button')].map(b=>b.getAttribute('aria-label')))===JSON.stringify(['Learn','Knowledge Check','Practice A','Practice B','Transfer']),'Five learning steps in approved order');
 const start=async()=>{
  click('Practice B');
  await until(()=>!!root().querySelector('textarea[name="'+unit+'-cycleB-'+(
   unit==='FW-U07'?'problem':unit==='FW-U08'?'sharedIntent':'planRoles')+'"]'),'Practice B inputs');
 };
 const saved=async(n:number)=>until(()=>root().textContent?.includes('Saved version '+n)===true,'saved version '+n);
 const ai=async()=>{await until(()=>!!button('Save & Ask AI Tutor'),'inline review panel');
  check(!button('Save & Ask AI Tutor')!.disabled,'eligible after exact save');
  check((window as any).__aiCalls===0,'No AI auto on tab open');
  click('Save & Ask AI Tutor');
  await until(()=>root().textContent?.includes('Specific strengths')===true,'AI mock feedback');
  check((window as any).__aiCalls===1,'One explicit AI click');};
 if(phase==='07save'){
  await start();
  await write('FW-U07-cycleB-problem','Students cannot find the lost-and-found hours because the schedule is unclear.');
  await write('FW-U07-cycleB-response','The council could publish a weekly notice with hours and the correct collection-table location.');
  await write('FW-U07-cycleB-transitionReason','The proposed notice directly answers the missing time and place information.');
  click('Save work');await saved(1);await ai();
  click('Practice B');await until(()=>!!root().querySelector('textarea[name="FW-U07-cycleB-response"]'),'reopened');
  await write('FW-U07-cycleB-response','The council could publish an updated weekly notice for students and families.');
  await until(()=>!!button('Save & Ask AI Tutor'),'AI tab after edit');
  check((window as any).__aiCalls===1,'No automatic AI on editing or changing section');
  check(!root().textContent?.includes('Specific strengths'),'stale review cleared');
  click('Save work');await saved(2);
  const state=(await loadLearnerState()).state??{},work=state.foundationWritingV1?.units?.['FW-U07'];
  check(work?.versions?.length===2,'U07 two versions');
  check(work.versions[0].draft.cycleB.response.includes('collection-table location'),'U07 version 1 immutable');
  check(state.qaWave3Sentinel==='PRESERVE_OLD_DATA','Legacy sentinel retained');
  check(state.foundationWritingV1?.units?.['FW-U01']?.versions.length===0,'U01 untouched');
  report('PASS_FW_U07_SAVE',{versions:2,explicitAI:true,unsavedBlocked:true});
 }else if(phase==='07restore'){
  await saved(2);await start();
  const t=root().querySelector('textarea[name="FW-U07-cycleB-response"]') as HTMLTextAreaElement;
  check(t.value.includes('updated weekly notice'),'U07 exact restored');
  check((window as any).__aiCalls===0,'No AI on U07 restore');
  report('PASS_FW_U07_RESTORE',{restored:true});
 }else if(phase==='08save'){
  const prior=(await loadLearnerState()).state??{};
  check(prior.foundationWritingV1?.units?.['FW-U07']?.versions.length===2,'U07 exists');
  await start();
  await write('FW-U08-cycleB-sharedIntent','Ask both the starting time and meeting point of the mural walk.');
  await write('FW-U08-cycleB-peerMessage','Hi Luca, do you know what time the mural walk starts and where we meet?');
  await write('FW-U08-cycleB-organizerMessage','Hello Ms. Rivera, could you please confirm the mural walk start time and meeting point?');
  await write('FW-U08-cycleB-change1','I used a friendly greeting for Luca.');
  await write('FW-U08-cycleB-change2','I used a polite, direct question for the coordinator.');
  click('Save work');await saved(1);await ai();
  const state=(await loadLearnerState()).state??{};
  check(state.foundationWritingV1.units['FW-U07'].versions.length===2,'U07 preserved');
  check(state.foundationWritingV1.units['FW-U08'].versions.length===1,'U08 persisted');
  report('PASS_FW_U08_SAVE',{twoReaders:true,sameIntent:true,explicitOnlyAI:true});
 }else if(phase==='08restore'){
  await saved(1);await start();
  const el=root().querySelector('textarea[name="FW-U08-cycleB-organizerMessage"]') as HTMLTextAreaElement;
  check(el.value.startsWith('Hello Ms. Rivera'),'Organizer exact restored');
  check((window as any).__aiCalls===0,'No AI on U08 restore');
  report('PASS_FW_U08_RESTORE',{restored:true});
 }else if(phase==='09save'){
  await start();
  await write('FW-U09-cycleB-planRoles','P1 explain proposal; P2 practical information; P3 ask for consideration.');
  const first='Hello Programme Coordinator, could your centre consider clearer sign-up guidance for weekend workshop visitors? Please provide where and when to register and what materials to bring, if possible. That information could reduce confusion for first-time attendees. Thank you for considering this idea.';
  await write('FW-U09-cycleB-draftV1',first);
  await write('FW-U09-cycleB-commitmentNote','I have addressed the coordinator with an honest request and practical details.');
  click('Save work');await saved(1);await ai();
  const state=(await loadLearnerState()).state??{};
  const w=state.foundationWritingV1?.units?.['FW-U09'];
  check(w?.firstDraftV1?.text===first&&w.firstDraftV1.version===1,'Immutable U09 Draft V1 recorded');
  check(state.foundationWritingV1?.units?.['FW-U07'].versions.length===2,'U07 preserved');
  report('PASS_FW_U09_SAVE',{immutableFirstDraft:true,explicitOnlyAI:true});
 }else if(phase==='09restore'){
  await saved(1);await start();
  const first=(root().querySelector('textarea[name="FW-U09-cycleB-draftV1"]') as HTMLTextAreaElement).value;
  check(first.startsWith('Hello Programme Coordinator'),'U09 restored');
  await write('FW-U09-cycleB-draftV1','A revised different email with clarified practical information for workshop visitors.');
  (window as any).__failWave3Save=true;
  click('Save work');
  await until(()=>root().textContent?.includes('Save failed')===true,'U09 save failure');
  
  await until(()=>!!button('Save & Ask AI Tutor'),'U09 Tutor after failure');
  const callsBeforeFailure=(window as any).__aiCalls;
  click('Save & Ask AI Tutor');
  await until(()=>root().textContent?.includes('Save failed. Your writing is still here.')===true,'inline save failure');
  check((window as any).__aiCalls===callsBeforeFailure,'Failed combined save must not call AI');
  const prior=(await loadLearnerState()).state?.foundationWritingV1?.units?.['FW-U09'];
  check(prior?.versions?.length===1&&prior?.firstDraftV1?.text===first,'Failure preserved version and original V1');
  (window as any).__failWave3Save=false;
  click('Save & Exit');
  await until(()=>(window as any).__exited===true,'U09 Save & Exit retry');
  const newState=(await loadLearnerState()).state??{},current=newState.foundationWritingV1?.units?.['FW-U09'];
  check(current?.versions?.length===2,'U09 retry version 2 persisted');
  check(current?.firstDraftV1?.text===first,'Original V1 preserved after revision');
  check(newState.qaWave3Sentinel==='PRESERVE_OLD_DATA','Legacy sentinel preserved');
  check((window as any).__aiCalls===0,'No AI on restore/failure/retry');
  report('PASS_FW_U09_RESTORE',{failedSaveBlocked:true,retrySaved:true,v1Immutable:true});
 }else throw Error('Unknown phase '+phase);
})().catch(e=>report('FAIL_FW_WAVE3',{message:String(e),stack:String((e as Error).stack).slice(0,1800)}));
