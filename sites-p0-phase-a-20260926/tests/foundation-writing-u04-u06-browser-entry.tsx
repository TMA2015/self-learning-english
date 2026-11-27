import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {FoundationWritingWave2} from '../app/foundation-writing-u04-u06';
import {loadLearnerState,saveLearnerState} from '../infrastructure/browser/client-services';
import {emptyFoundationWritingV1,emptyU01Work} from '../domain/foundation-writing-u01';
import {appendWave2Version,wave2Work,type Wave2Draft,type Wave2Id} from '../domain/foundation-writing-u04-u06';

const phase=new URL(location.href).searchParams.get('phase')??'';
const unit:Wave2Id=phase.startsWith('04')?'FW-U04':phase.startsWith('05')?'FW-U05':'FW-U06';
const app=()=>document.getElementById('app')!;
const result=document.getElementById('sle-test-result')!;
const report=(status:string,data?:unknown)=>result.textContent=status+(data?' '+JSON.stringify(data):'');
const check=(ok:unknown,msg:string)=>{if(!ok)throw Error('FW_WAVE2_BROWSER: '+msg)};
const sleep=(ms:number)=>new Promise<void>(resolve=>setTimeout(resolve,ms));
async function until(test:()=>boolean,msg:string){
 for(let i=0;i<320;i++){if(test())return;await sleep(40)}
 throw Error('Timeout '+msg+' [app='+app().textContent?.slice(-400)+']');
}
const button=(label:string)=>[...document.querySelectorAll('#app button')].find(x=>
 x.textContent?.trim().includes(label)) as HTMLButtonElement|undefined;
function click(label:string){const item=button(label);check(item,'button '+label);item!.click()}
function fill(name:string,value:string){
 const item=document.querySelector('#app textarea[name="'+name+'"]') as HTMLTextAreaElement|null;
 check(item,'textarea '+name);
 const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')?.set;
 check(setter,'textarea setter');
 setter!.call(item,value);item!.dispatchEvent(new Event('input',{bubbles:true}));
}
async function write(name:string,value:string){
 fill(name,value);
 await until(()=>((document.querySelector('#app textarea[name="'+name+'"]') as HTMLTextAreaElement|null)?.value===value),'controlled '+name);
}
function choose(id:string,value:string){
 const item=document.getElementById(id) as unknown as HTMLSelectElement|null;
 check(item,'select '+id);
 const setter=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value')?.set;
 check(setter,'select setter');
 setter!.call(item,value);item!.dispatchEvent(new Event('change',{bubbles:true}));
}
const getValue=(id:string)=>(document.getElementById(id) as unknown as {value:string}|null)?.value;
type State=Record<string,any>;
function TestApp(){
 const [state,setState]=useState<State|null>(null),[error,setError]=useState('');
 const latest=useRef<State>({});
 useEffect(()=>{
  void (async()=>{
   if(phase==='04save'){
    const foundation=emptyFoundationWritingV1();
    foundation.units['FW-U01']=emptyU01Work();
    await saveLearnerState({qaSentinel:'DO_NOT_TOUCH',
     writingCourseV2B:{weeks:{legacy:'PRESERVE'}},foundationWritingV1:foundation,
     vietnameseSupport:false});
   }
   const prior=await loadLearnerState();
   latest.current=prior.state??{};setState(latest.current);
  })().catch(e=>setError(String(e)));
 },[]);
 const foundation=state?.foundationWritingV1;
 function onEdit(draft:Wave2Draft){
  const before=latest.current,scope=before.foundationWritingV1??emptyFoundationWritingV1();
  const work=wave2Work(scope,unit);
  const next={...before,foundationWritingV1:{...scope,units:{...scope.units,[unit]:{...work,draft}}}};
  latest.current=next;setState(next);
 }
 async function onSave(){
  // Synthetic fail-first test. A false save must never grant the named version or AI access.
  if((window as any).__failWave2Save)return false;
  const before=latest.current,scope=before.foundationWritingV1??emptyFoundationWritingV1();
  const version=appendWave2Version(wave2Work(scope,unit),Date.now());
  const next={...before,foundationWritingV1:{...scope,units:{...scope.units,[unit]:version}}};
  try{
   await saveLearnerState(next);
   latest.current=next;setState(next);
   return true;
  }catch{return false}
 }
 if(error)return <div data-qa-load-error>{error}</div>;
 if(!state)return <div data-qa-loading>Loading</div>;
 return <FoundationWritingWave2 unitId={unit} work={wave2Work(foundation,unit)}
  onEdit={onEdit} onSave={onSave}
  onExit={()=>{(window as any).__exited=true}}/>;
}
(async()=>{
 createRoot(app()).render(<TestApp/>);
 await until(()=>!!document.querySelector('#app [aria-label="Foundation Writing '+unit+'"]'),'React mount');
 check((window as any).__aiCalls===0,'no automatic AI request on mount');
 if(phase==='04save'){
  click('Practice B');
  await until(()=>!!document.querySelector('[name="u04-notice-s1"]'),'U04 original sentences');
  const notes=[
   'The after-school robotics workshop will meet in the school library.',
   'The usual classroom is being repaired, so the room must change.',
   'Some families may be concerned about finding the library.',
   'Please contact the school if you need more information about the room.'
  ];
  for(let i=0;i<4;i++)await write('u04-notice-s'+(i+1),notes[i]);
  choose('u04-agent','Mia');
  await until(()=>getValue('u04-agent')==='Mia','chosen Mia');
  await write('u04-repair-revised','After Ms. Lee told Mia about the room, Mia sent the class a message.');
  await write('u04-repair-why','Naming Mia tells the reader who sent the message.');
  click('Save work');
  await until(()=>app().textContent?.includes('Saved version 1')===true,'U04 saved v1');
  check((window as any).__aiCalls===0,'U04 save should not invoke AI');
  
  await until(()=>!!button('Save & Ask AI Tutor'),'U04 AI tab');
  check(!button('Save & Ask AI Tutor')!.disabled,'saved four sentences plus repair eligible');
  click('Save & Ask AI Tutor');
  await until(()=>app().textContent?.includes('Specific strengths')===true,'U04 mock AI');
  check((window as any).__aiCalls===1,'U04 explicit click only');
  click('Practice B');
  await until(()=>!!document.querySelector('[name="u04-notice-s1"]'),'U04 re-open');
  await write('u04-notice-s1','This is a newer independent location sentence.');
  
  await until(()=>!!button('Save & Ask AI Tutor'),'U04 AI after edit');
  check((window as any).__aiCalls===1,'No automatic AI on editing or changing section');
  check(!app().textContent?.includes('Specific strengths'),'stale review hidden');
  click('Save work');
  await until(()=>app().textContent?.includes('Saved version 2')===true,'U04 v2');
  const stored=(await loadLearnerState()).state??{};
  const work=stored.foundationWritingV1?.units?.['FW-U04'];
  check(work?.versions?.length===2,'two saved U04 versions');
  check(work.versions[0].draft.notice.s1===notes[0],'U04 v1 immutable');
  check(work.versions[1].draft.notice.s1.startsWith('This is a newer'),'U04 v2 persisted');
  check(stored.qaSentinel==='DO_NOT_TOUCH','learner sentinel preserved');
  check(stored.writingCourseV2B?.weeks?.legacy==='PRESERVE','legacy Writing preserved');
  check(stored.foundationWritingV1?.units?.['FW-U01']?.versions?.length===0,'U01 unchanged');
  report('PASS_FW_U04_SAVE',{versions:2,explicitAI:true,staleFeedbackBlocked:true});
 }else if(phase==='04restore'){
  await until(()=>app().textContent?.includes('Saved version 2')===true,'U04 restored version');
  click('Practice B');
  await until(()=>!!document.querySelector('[name="u04-notice-s1"]'),'U04 restore tab');
  check((document.querySelector('[name="u04-notice-s1"]') as HTMLTextAreaElement).value.startsWith('This is a newer'),'U04 exact restored text');
  check(getValue('u04-agent')==='Mia','Mia intent restored');
  check((window as any).__aiCalls===0,'no automatic AI after U04 reload');
  report('PASS_FW_U04_RESTORE',{restored:true,agent:'Mia'});
 }else if(phase==='05save'){
  const prior=(await loadLearnerState()).state??{};
  check(prior.foundationWritingV1?.units?.['FW-U04']?.versions?.length===2,'U04 must already exist');
  click('Practice B');
  await until(()=>!!document.querySelector('[name="u05-plan-point"]'),'U05 Practice B');
  await write('u05-plan-point','Recommend a school tool-lending corner.');
  await write('u05-plan-reason','Classmates can borrow supplies they forgot.');
  await write('u05-plan-detail','A student borrows a ruler and returns it after class.');
  const paragraph='A school tool-lending corner could help classmates who forget safe supplies. They might borrow a ruler for a lesson and return it afterward. This would reduce interruptions because classmates could share items for the work at hand.';
  const quote='They might borrow a ruler for a lesson and return it afterward.';
  await write('u05-paragraph',paragraph);
  await write('u05-sentence-quote',quote);
  choose('u05-job-role','detail');
  await until(()=>getValue('u05-job-role')==='detail','U05 role');
  await write('u05-job-why','It shows a possible way students use the tool corner.');
  click('Save work');
  await until(()=>app().textContent?.includes('Saved version 1')===true,'U05 saved');
  
  await until(()=>!!button('Save & Ask AI Tutor'),'U05 AI tab');
  check(!button('Save & Ask AI Tutor')!.disabled,'exact paragraph quote eligible');
  click('Save & Ask AI Tutor');
  await until(()=>app().textContent?.includes('Specific strengths')===true,'U05 mock AI');
  check((window as any).__aiCalls===1,'U05 explicit AI once');
  const saved=(await loadLearnerState()).state??{};
  check(saved.foundationWritingV1?.units?.['FW-U04']?.versions?.length===2,'U04 retained');
  check(saved.foundationWritingV1?.units?.['FW-U05']?.versions?.length===1,'U05 one version');
  report('PASS_FW_U05_SAVE',{paragraphSaved:true,exactQuote:true,unitIsolation:true});
 }else if(phase==='05restore'){
  await until(()=>app().textContent?.includes('Saved version 1')===true,'U05 restored');
  click('Practice B');
  await until(()=>!!document.querySelector('[name="u05-paragraph"]'),'U05 restore tab');
  check((document.querySelector('[name="u05-paragraph"]') as HTMLTextAreaElement).value.startsWith('A school tool-lending'),'U05 paragraph restored');
  check((document.querySelector('[name="u05-sentence-quote"]') as HTMLTextAreaElement).value.startsWith('They might borrow'),'U05 quote restored');
  check((window as any).__aiCalls===0,'U05 restore no AI request');
  report('PASS_FW_U05_RESTORE',{restored:true,autoAI:0});
 }else if(phase==='06save'){
  const previous=(await loadLearnerState()).state??{};
  check(previous.foundationWritingV1?.units?.['FW-U05']?.versions?.length===1,'U05 before U06');
  click('Practice B');
  await until(()=>!!document.querySelector('[name="u06-cycleB-job-0"]'),'U06 outline tab');
  const jobs=['Introduce event','Explain maker area one','Explain second area and safety'];
  const notes=['fair purpose; weekend; families','recycled crafts; table; examples','model building; adult guidance; safety'];
  for(let i=0;i<3;i++){
   await write('u06-cycleB-job-'+i,jobs[i]);
   await write('u06-cycleB-notes-'+i,notes[i]);
  }
  await write('u06-cycleB-order','Introduce the proposal before describing what people will do and how to participate safely.');
  await write('u06-cycleB-overlap','Each paragraph performs a different reader job.');
  click('Save work');
  await until(()=>app().textContent?.includes('Saved version 1')===true,'U06 saved');
  
  await until(()=>!!button('Save & Ask AI Tutor'),'U06 AI tab');
  check(!button('Save & Ask AI Tutor')!.disabled,'three-role keyword outline eligible');
  click('Save & Ask AI Tutor');
  await until(()=>app().textContent?.includes('Specific strengths')===true,'U06 mock AI');
  check((window as any).__aiCalls===1,'U06 explicit AI once');
  const stored=(await loadLearnerState()).state??{};
  check(stored.foundationWritingV1?.units?.['FW-U05']?.versions?.length===1,'U05 still present');
  check(stored.foundationWritingV1?.units?.['FW-U06']?.versions?.length===1,'U06 stored');
  report('PASS_FW_U06_SAVE',{threeRoleOutline:true,otherUnitsPreserved:true,aiCalls:1});
 }else if(phase==='06restore'){
  await until(()=>app().textContent?.includes('Saved version 1')===true,'U06 restored');
  click('Practice B');
  await until(()=>!!document.querySelector('[name="u06-cycleB-job-0"]'),'U06 restored outline tab');
  check((document.querySelector('[name="u06-cycleB-notes-2"]') as HTMLTextAreaElement).value.startsWith('model building'),'U06 notes restored');
  await write('u06-cycleB-notes-0','New unsaved keyword note');
  (window as any).__failWave2Save=true;
  click('Save work');
  await until(()=>app().textContent?.includes('Save failed')===true,'U06 failed save message');
  
  await until(()=>!!button('Save & Ask AI Tutor'),'U06 AI tab after failed save');
  const callsBeforeFailure=(window as any).__aiCalls;
  click('Save & Ask AI Tutor');
  await until(()=>app().textContent?.includes('Save failed. Your writing is still here.')===true,'inline save failure');
  check((window as any).__aiCalls===callsBeforeFailure,'Failed combined save must not call AI');
  const old=(await loadLearnerState()).state?.foundationWritingV1?.units?.['FW-U06'];
  check(old?.versions?.length===1,'failed save preserves U06 history');
  (window as any).__failWave2Save=false;
  click('Save & Exit');
  await until(()=>(window as any).__exited===true,'U06 retry Save & Exit');
  const stored=(await loadLearnerState()).state??{};
  check(stored.foundationWritingV1.units['FW-U06'].versions.length===2,'successful retry persisted version 2');
  check(stored.qaSentinel==='DO_NOT_TOUCH','historical learner sentinel preserved');
  check((window as any).__aiCalls===0,'no provider request on U06 restore, failure or retry');
  report('PASS_FW_U06_RESTORE',{restored:true,failedSaveGatedAI:true,retrySaved:true,unitIsolation:true});
 }else throw Error('Unrecognized browser phase '+phase);
})().catch(e=>report('FAIL_FW_WAVE2',{error:String(e),stack:String((e as Error).stack).slice(0,1700)}));
