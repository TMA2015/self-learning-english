import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {FoundationWritingNextUnit} from '../app/foundation-writing-u02-u03';
import {loadLearnerState,saveLearnerState} from '../infrastructure/browser/client-services';
import {emptyFoundationWritingV1,emptyU01Work} from '../domain/foundation-writing-u01';
import {nextUnitWork,appendNextVersion,type NextDraft,type NextUnitId} from '../domain/foundation-writing-u02-u03';

const phase=new URL(location.href).searchParams.get('phase')??'';
const unit:NextUnitId=phase.startsWith('02')?'FW-U02':'FW-U03';
const result=document.getElementById('sle-test-result')!;
const app=()=>document.getElementById('app')!;
const report=(text:string,data?:unknown)=>result.textContent=text+(data?' '+JSON.stringify(data):'');
function check(value:unknown,msg:string){if(!value)throw Error('FW_NEXT_BROWSER: '+msg)}
const sleep=(ms:number)=>new Promise<void>(resolve=>setTimeout(resolve,ms));
async function until(predicate:()=>boolean,msg:string){
 for(let n=0;n<300;n++){if(predicate())return;await sleep(40)}
 throw Error('Timeout '+msg+' [visible app: '+app().textContent?.slice(-350)+']');
}
function button(label:string){
 return [...document.querySelectorAll('#app button')].find(b=>b.textContent?.trim().includes(label)) as HTMLButtonElement|undefined;
}
function click(label:string){let btn=button(label);check(btn,'Button '+label);btn!.click()}
function text(name:string,value:string){
 const element=document.querySelector('#app textarea[name="'+name+'"]') as HTMLTextAreaElement|null;
 check(element,'Textarea '+name);
 const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')?.set;
 check(setter,'Textarea value setter');
 setter!.call(element,value);
 element!.dispatchEvent(new Event('input',{bubbles:true}));
}
function choose(id:string,value:string){
 const el=document.getElementById(id) as HTMLSelectElement|null;
 check(el,'Selector '+id);
 const setter=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value')?.set;
 check(setter,'Select setter');
 setter!.call(el,value);
 el!.dispatchEvent(new Event('change',{bubbles:true}));
}
type State=Record<string,any>;
function TestApp(){
 const [state,setState]=useState<State|null>(null),[error,setError]=useState('');
 const latest=useRef<State>({});
 useEffect(()=>{
  void (async()=>{
   if(phase==='02save'){
    const base=emptyFoundationWritingV1();
    base.units['FW-U01']=emptyU01Work();
    await saveLearnerState({
     syntheticSentinel:'PRESERVE_LEGACY',writingCourseV2B:{weeks:{saved:'do-not-touch'}},
     foundationWritingV1:base,vietnameseSupport:false
    });
   }
   const loaded=await loadLearnerState();
   latest.current=loaded.state??{};
   setState(latest.current);
  })().catch(e=>setError(String(e)));
 },[]);
 const foundation=state?.foundationWritingV1;
 function edit(next:NextDraft){
  const previous=latest.current;
  const saved=previous.foundationWritingV1??emptyFoundationWritingV1();
  const work=nextUnitWork(saved,unit);
  const changed={...previous,foundationWritingV1:{...saved,units:{...saved.units,[unit]:{...work,draft:next}}}};
  latest.current=changed;setState(changed);
 }
 async function save(){
  if((window as any).__failNextSave)return false;
  const previous=latest.current;
  const foundation=previous.foundationWritingV1??emptyFoundationWritingV1();
  const version=appendNextVersion(nextUnitWork(foundation,unit),Date.now());
  const next={...previous,foundationWritingV1:{...foundation,units:{...foundation.units,[unit]:version}}};
  latest.current=next;setState(next);
  try{await saveLearnerState(next);return true}catch{return false}
 }
 if(error)return <section data-qa-error>{error}</section>;
 if(!state)return <section data-qa-loading>Loading</section>;
 return <FoundationWritingNextUnit unitId={unit} work={nextUnitWork(foundation,unit)}
  onEdit={edit} onSave={save} onExit={()=>{(window as any).__exited=true}}/>;
}
(async()=>{
 createRoot(app()).render(<TestApp/>);
 await until(()=>!!document.querySelector('#app [aria-label="Foundation Writing '+unit+'"]'),'unit mount');
 check((window as any).__aiCalls===0,'No automatic AI on mount');
 if(phase==='02save'){
  click('Practice A');
  await until(()=>!!document.querySelector('[data-learning-interaction="CardSortBoard"]'),'U02 reusable sort board');
  const board02=document.querySelector('[data-learning-interaction="CardSortBoard"]')!;
  check(!board02.textContent?.includes('(Key: FITS)'),'U02 key hidden before Check');
  choose('u02-card-A1','FITS');
  await until(()=>!!board02.textContent?.includes('1/6 placed'),'U02 grouping updated from controlled choice');
  const groups02=board02.querySelector('[data-learning-interaction-preview="CardSortBoard"]')!;
  check(groups02.textContent?.includes('A1.'),'U02 learner chosen card appears in category preview');
  check(!board02.textContent?.includes('(Key: FITS)'),'Grouping preview must not reveal answer');
  click('Check all six cards and see explanations');
  await until(()=>!!board02.textContent?.includes('(Key: FITS)'),'U02 reviewed feedback only after Check');
  choose('u02-card-A1','OFF_TASK');
  await until(()=>!board02.textContent?.includes('(Key: FITS)'),'Editing category hides old feedback');
  click('Practice B');
  await until(()=>!!document.querySelector('textarea[name="FW-U02-practice-b-idea-0"]'),'U02 idea bank');
  const ideas=['Book-swap table','Short graphic-novel circle','Read-and-draw session'];
  for(let i=0;i<3;i++){
   text('FW-U02-practice-b-idea-'+i,ideas[i]);
   await until(()=>((document.querySelector('textarea[name="FW-U02-practice-b-idea-'+i+'"]') as HTMLTextAreaElement)?.value===ideas[i]),'idea controlled '+i);
  }
  for(let i=0;i<3;i++){
   text('FW-U02-practice-b-why-'+i,'This activity could suit teenagers at a library.');
   await until(()=>((document.querySelector('textarea[name="FW-U02-practice-b-why-'+i+'"]') as HTMLTextAreaElement)?.value?.startsWith('This activity')),'fit explanation '+i);
  }
  choose('FW-U02-practice-b-chosen','1');
  await until(()=>((document.getElementById('FW-U02-practice-b-chosen') as unknown as {value:string}|null)?.value==='1'),'selected one');
  text('FW-U02-practice-b-rationale','Teenagers can share interesting graphic novels together without needing a big room.');
  await until(()=>app().textContent?.includes('Your bank has three distinct notes')===true,'all-valid bank ready');
  check((document.querySelector('textarea[name="FW-U02-practice-b-setaside"]') as HTMLTextAreaElement).value==='',
   'No compulsory set-aside or rejected idea');
  click('Save version');
  await until(()=>app().textContent?.includes('Version 1 saved')===true,'U02 version one');
  check((window as any).__aiCalls===0,'No auto AI on save');
  click('AI Tutor');
  await until(()=>!!button('Get personal AI Tutor feedback'),'U02 Tutor panel');
  check(!button('Get personal AI Tutor feedback')!.disabled,'Saved all-valid bank is eligible');
  check((window as any).__aiCalls===0,'No automatic AI on opening tutor');
  click('Get personal AI Tutor feedback');
  await until(()=>app().textContent?.includes('Specific strengths')===true,'AI mock U02');
  check((window as any).__aiCalls===1,'Exactly one explicit AI click');
  click('Practice B');
  await until(()=>!!document.querySelector('textarea[name="FW-U02-practice-b-rationale"]'),'Back to U02 bank');
  text('FW-U02-practice-b-rationale','A revised independent reason about easy weekend reading together.');
  await until(()=>app().textContent?.includes('Editing an unsaved draft')===true,'Unsaved edit makes old review ineligible');
  click('AI Tutor');
  await until(()=>!!button('Get personal AI Tutor feedback'),'U02 Tutor after edit');
  check(button('Get personal AI Tutor feedback')!.disabled,'Edited unsaved U02 cannot call AI');
  check(!app().textContent?.includes('Specific strengths'),'Old AI review not visible after edit');
  click('Save version');
  await until(()=>app().textContent?.includes('Version 2 saved')===true,'U02 version two');
  const saved=(await loadLearnerState()).state??{};
  const u02=saved.foundationWritingV1?.units?.['FW-U02'];
  check(u02?.versions?.length===2,'Two immutable versions');
  check(u02.versions[0].draft.cycleBBank.rationale!==u02.versions[1].draft.cycleBBank.rationale,
   'Older rationale was not overwritten');
  check(saved.syntheticSentinel==='PRESERVE_LEGACY','Legacy sentinel unchanged');
  check(saved.foundationWritingV1?.units?.['FW-U01']?.versions?.length===0,'U01 remains unaltered');
  report('PASS_FW_U02_SAVE',{versions:2,allValidWithoutReject:true,aiCalls:1,staleHidden:true});
 }else if(phase==='02restore'){
  await until(()=>app().textContent?.includes('Version 2 saved')===true,'U02 restored');
  click('Practice B');
  await until(()=>!!document.querySelector('textarea[name="FW-U02-practice-b-rationale"]'),'restored U02 bank');
  const v=(document.querySelector('textarea[name="FW-U02-practice-b-rationale"]') as HTMLTextAreaElement).value;
  check(v.startsWith('A revised independent reason'),'U02 restored exactly');
  const chosen=(document.getElementById('FW-U02-practice-b-chosen') as unknown as {value:string}|null)?.value;
  check(chosen==='1','U02 chosen idea remains index 1');
  check((window as any).__aiCalls===0,'No auto request on U02 restore');
  report('PASS_FW_U02_RESTORE',{restored:true,selected:chosen,autoAI:0});
 }else if(phase==='03save'){
  const before=(await loadLearnerState()).state??{};
  check(before.foundationWritingV1?.units?.['FW-U02']?.versions?.length===2,'Prior U02 remains saved');
  click('Practice A');
  await until(()=>!!document.querySelector('[data-learning-interaction="CardSortBoard"]'),'U03 reusable sort board');
  const board03=document.querySelector('[data-learning-interaction="CardSortBoard"]')!;
  check(!board03.textContent?.includes('(Key: Claim)'),'U03 role key hidden before Check');
  choose('u03-card-C1','Claim');
  await until(()=>!!board03.textContent?.includes('1/6 placed'),'U03 grouped user choice');
  check(!board03.textContent?.includes('(Key: Claim)'),'U03 live preview is not answer feedback');
  click('Check card roles and all explanations');
  await until(()=>!!board03.textContent?.includes('(Key: Claim)'),'U03 postcheck explanation');
  click('Practice B');
  await until(()=>!!document.querySelector('textarea[name="chainA-claim"]'),'U03 chains');
  check(document.querySelectorAll('[data-learning-interaction="ResponsePlanner"]').length===2,
   'U03 displays two reusable ResponsePlanners in Practice B');
  choose('u03-weak-choice','B-W1');
  text('u03-weak-repair','Members could learn to create pictures and meet other learners during lunch.');
  const fields={
   'chainA-claim':'Our school should create a lunchtime creative club',
   'chainA-reason':'Students could practise drawing skills',
   'chainA-detail':'They could practise drawing a small poster during lunch',
   'chainB-claim':'Our school should create a lunchtime creative club',
   'chainB-reason':'Students could make new friends',
   'chainB-detail':'They could join small groups and discuss their artwork'
  };
  for(const [k,v] of Object.entries(fields)){
   text(k,v);
   await until(()=>((document.querySelector('textarea[name="'+k+'"]') as HTMLTextAreaElement)?.value===v),'controlled chain '+k);
  }
  const preview03=document.querySelector('[data-learning-interaction-preview="ResponsePlanner"]')!;
  check(preview03.textContent?.includes('3/3 parts filled'),'U03 filled plan summary updates without marking quality');
  check(preview03.textContent?.includes('Our school should create a lunchtime creative club'),
   'U03 original learner text, not generated text, appears in preview');
  click('Save version');
  await until(()=>app().textContent?.includes('Version 1 saved')===true,'U03 version one');
  click('AI Tutor');
  await until(()=>!!button('Get personal AI Tutor feedback'),'U03 Tutor panel');
  check(!button('Get personal AI Tutor feedback')!.disabled,'U03 original chains eligible only after save');
  check((window as any).__aiCalls===0,'No automatic U03 AI');
  click('Get personal AI Tutor feedback');
  await until(()=>app().textContent?.includes('Specific strengths')===true,'U03 synthetic AI');
  check((window as any).__aiCalls===1,'U03 exactly one explicit AI call');
  const stored=(await loadLearnerState()).state??{};
  check(stored.foundationWritingV1.units['FW-U02'].versions.length===2,'U02 preserved by U03 save');
  check(stored.foundationWritingV1.units['FW-U01'].versions.length===0,'U01 untouched');
  check(stored.syntheticSentinel==='PRESERVE_LEGACY','Legacy writing sentinel unchanged');
  report('PASS_FW_U03_SAVE',{twoChains:true,version:1,otherUnitsPreserved:true,aiCalls:1});
 }else if(phase==='03restore'){
  await until(()=>app().textContent?.includes('Version 1 saved')===true,'U03 restored');
  click('Practice B');
  await until(()=>!!document.querySelector('textarea[name="chainA-reason"]'),'restored chains');
  check((document.querySelector('textarea[name="chainA-reason"]') as HTMLTextAreaElement).value==='Students could practise drawing skills',
   'Exact first reason restored');
  check((document.querySelector('textarea[name="chainB-reason"]') as HTMLTextAreaElement).value==='Students could make new friends',
   'Exact second reason restored');
  check((window as any).__aiCalls===0,'No AI requests on restore');
  report('PASS_FW_U03_RESTORE',{restored:true,realBrowser:true,autoAI:0});
 }else throw Error('Unknown phase '+phase);
})().catch(e=>report('FAIL_FW_NEXT',{message:String(e),stack:String((e as Error).stack).slice(0,1400)}));
