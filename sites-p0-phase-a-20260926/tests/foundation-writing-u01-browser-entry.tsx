import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {FoundationWritingU01} from '../app/foundation-writing-u01';
import {loadLearnerState,saveLearnerState} from '../infrastructure/browser/client-services';
import {emptyFoundationWritingV1,emptyU01Work,appendU01Version,type U01Draft,
 type FoundationWritingV1} from '../domain/foundation-writing-u01';

const phase=new URL(location.href).searchParams.get('phase');
const output=document.getElementById('sle-test-result')!;
const report=(kind:string,data?:unknown)=>{output.textContent=kind+(data?' '+JSON.stringify(data):'')};
function ensure(value:unknown,msg:string){if(!value)throw Error('U01_BROWSER_QA: '+msg)}
const delay=(ms:number)=>new Promise<void>(resolve=>setTimeout(resolve,ms));
async function waitUntil(predicate:()=>boolean,msg:string){
 for(let i=0;i<280;i++){if(predicate())return;await delay(40)}
 throw Error('Timed out: '+msg+' '+document.getElementById('app')?.textContent?.slice(-400));
}
function find(label:string):HTMLButtonElement|undefined{
 return [...document.querySelectorAll('button')].find(b=>b.textContent?.trim().includes(label));
}
function fill(name:string,value:string){
 const area=document.querySelector('textarea[name="'+name+'"]') as HTMLTextAreaElement|null;
 ensure(area,'Expected textarea '+name);
 const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')?.set;
 ensure(setter,'Native text setter');
 setter!.call(area,value);area!.dispatchEvent(new Event('input',{bubbles:true}));
}
type SLEState=Record<string,any>;
function Root(){
 const [state,setState]=useState<SLEState|null>(null),[error,setError]=useState('');
 const latest=useRef<SLEState>({});
 useEffect(()=>{
  void (async()=>{
   if(phase==='save'){
    // Synthetic historical fields. Saving U01 must not clear them.
    await saveLearnerState({
     syntheticLegacySentinel:'PRESERVE_THIS',writingCourseV2B:{weeks:{}},
     foundationWritingV1:emptyFoundationWritingV1(),vietnameseSupport:false,
    });
   }
   const loaded=await loadLearnerState();
   latest.current=loaded.state??{};
   setState(latest.current);
  })().catch(e=>setError(String(e)));
 },[]);
 const foundation=state?.foundationWritingV1 as FoundationWritingV1|undefined;
 function edit(draft:U01Draft){
  const current=latest.current;
  const previous=(current.foundationWritingV1??emptyFoundationWritingV1()) as FoundationWritingV1;
  const original=previous.units['FW-U01']??emptyU01Work();
  const next={...current,foundationWritingV1:{...previous,units:{...previous.units,
   'FW-U01':{...original,draft}}}};
  latest.current=next;setState(next);
 }
 async function save():Promise<boolean>{
  if((window as any).__failU01Save)return false;
  const current=latest.current;
  const previous=(current.foundationWritingV1??emptyFoundationWritingV1()) as FoundationWritingV1;
  const work=previous.units['FW-U01']??emptyU01Work();
  const saved=appendU01Version(work,Date.now());
  const next={...current,foundationWritingV1:{...previous,units:{...previous.units,'FW-U01':saved}}};
  latest.current=next;setState(next);
  try{await saveLearnerState(next);return true}catch{return false}
 }
 if(error)return <div data-qa-load-error>{error}</div>;
 if(!state)return <div data-qa-loading>Loading</div>;
 return <FoundationWritingU01 work={foundation?.units['FW-U01']} onEdit={edit} onSave={save}
  onExit={()=>{(window as any).__u01Exited=true}}/>;
}
(async()=>{
 createRoot(document.getElementById('app')!).render(<Root/>);
 await waitUntil(()=>!!document.querySelector('[aria-label="Foundation Writing Unit 01"]'),'mount');
 ensure((window as any).__u01Calls===0,'No provider request on page render');
 if(phase==='save'){
  find('Practice A')!.click();
  await waitUntil(()=>!!document.querySelector('textarea[name="u01-a-topic"]'),'Cycle A tab');
  const values={
   'u01-a-topic':'The school library Saturday opening hours',
   'u01-a-task':'Ask the librarian to extend opening on Saturday',
   'u01-a-mustInclude':'Explain why students need this and suggest a closing time',
   'u01-a-boundary':'Respectful note to school librarian; on Saturday',
   'u01-a-commitment':'I will ask for longer Saturday hours and give one practical reason.',
  };
  for(const [name,value] of Object.entries(values)){
   fill(name,value);
   await waitUntil(()=>((document.querySelector('textarea[name="'+name+'"]') as HTMLTextAreaElement)?.value===value),'controlled '+name);
  }
  find('Save version')!.click();
  await waitUntil(()=>document.getElementById('app')?.textContent?.includes('Saved version 1')===true,'version 1 save');
  ensure((window as any).__u01Calls===0,'No provider request from Save');
  find('AI Tutor')!.click();
  await waitUntil(()=>!!find('Get personal AI Tutor feedback'),'tutor tab');
  const ai=find('Get personal AI Tutor feedback')!;
  ensure(ai.disabled===false,'Saved map enables AI Tutor');
  ensure((window as any).__u01Calls===0,'No AI request from opening panel');
  ai.click();
  await waitUntil(()=>document.getElementById('app')?.textContent?.includes('Specific strengths')===true,'synthetic feedback');
  ensure((window as any).__u01Calls===1,'Exactly one provider request on explicit click');

  find('Practice A')!.click();
  await waitUntil(()=>!!document.querySelector('textarea[name="u01-a-topic"]'),'return to map');
  fill('u01-a-topic','Updated independent writing topic');
  await waitUntil(()=>document.getElementById('app')?.textContent?.includes('Save a version')===true,'editing invalidates saved status');
  find('AI Tutor')!.click();
  await waitUntil(()=>!!find('Get personal AI Tutor feedback'),'AI Tutor tab after edited map');
  const now=find('Get personal AI Tutor feedback')!;
  ensure(now.disabled,'Edited, unsaved map disables the AI request');
  ensure(!document.getElementById('app')?.textContent?.includes('Specific strengths'),'Stale AI feedback must be cleared');
  find('Save version')!.click();
  await waitUntil(()=>document.getElementById('app')?.textContent?.includes('Saved version 2')===true,'version 2 save');
  const after=(await loadLearnerState()).state??{};
  const work=after.foundationWritingV1?.units?.['FW-U01'];
  ensure(work?.versions?.length===2,'Both immutable saved versions present');
  ensure(work.versions[0].draft.cycleAMap.topic==='The school library Saturday opening hours','Old text not overwritten');
  ensure(work.versions[1].draft.cycleAMap.topic==='Updated independent writing topic','New version persisted');
  ensure(after.syntheticLegacySentinel==='PRESERVE_THIS','Legacy learner field preserved');
  ensure(after.writingCourseV2B?.weeks,'Legacy Writing work preserved');
  report('PASS_U01_SAVED',{versions:2,preserved:true,staleResponseCleared:true,aiCalls:1});
 }else if(phase==='restore'){
  ensure((window as any).__u01Calls===0,'No AI on reload');
  await waitUntil(()=>document.getElementById('app')?.textContent?.includes('Saved version 2')===true,'restored version 2');
  find('Practice A')!.click();
  await waitUntil(()=>!!document.querySelector('textarea[name="u01-a-topic"]'),'restored map');
  ensure((document.querySelector('textarea[name="u01-a-topic"]') as HTMLTextAreaElement).value==='Updated independent writing topic',
   'Exact version 2 text restored from the learner state');
  find('AI Tutor')!.click();
  await waitUntil(()=>!!find('Get personal AI Tutor feedback'),'AI Tutor tab after restore');
  ensure(!find('Get personal AI Tutor feedback')!.disabled,'Reopened saved map remains eligible');
  ensure((window as any).__u01Calls===0,'Reopening saved map has no automatic AI calls');
  find('Practice A')!.click();
  fill('u01-a-topic','Draft that was never successfully saved');
  await waitUntil(()=>document.getElementById('app')?.textContent?.includes('Save a version')===true,'unsaved draft state before failed save');
  (window as any).__failU01Save=true;
  find('Save version')!.click();
  await waitUntil(()=>document.getElementById('app')?.textContent?.includes('Save failed')===true,'failed save warning');
  const prior=(await loadLearnerState()).state?.foundationWritingV1?.units?.['FW-U01'];
  ensure(prior?.versions?.length===2,'Failed save must never mutate persisted learner data');
  find('AI Tutor')!.click();
  await waitUntil(()=>!!find('Get personal AI Tutor feedback'),'AI Tutor tab after failed save');
  ensure(find('Get personal AI Tutor feedback')!.disabled,'Failed save cannot enable AI for unsaved text');
  (window as any).__failU01Save=false;
  find('Save & Exit')!.click();
  await waitUntil(()=>(window as any).__u01Exited===true,'Save & Exit');
  const after=(await loadLearnerState()).state??{};
  const snapshot=after.foundationWritingV1?.units?.['FW-U01'];
  ensure(snapshot?.versions?.length===3,'Recovered save must persist a new version');
  ensure(snapshot.versions[0].draft.cycleAMap.topic==='The school library Saturday opening hours','Historical first version retained');
  ensure(after.syntheticLegacySentinel==='PRESERVE_THIS','Legacy learner field preserved');
  ensure((window as any).__u01Calls===0,'No provider request during restore or save');
  report('PASS_U01_RESTORED',{restored:true,noAutomaticAI:true,failedSaveBlocked:true,retrySaved:true,legacyPreserved:true});
 }else throw Error('Unknown browser test phase');
})().catch(e=>report('FAIL_U01',{message:String(e),stack:String((e as Error).stack).slice(0,1400)}));
