import React, {useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {
  Week2IdeaWorkspace, Week2InteractiveLearn, Week2PracticeSort,
  Week2SavedVersionComparison
} from '../app/writing-week2-interactive';
import {editWeek,emptyWeekWork,type WeekWork} from '../domain/writing-course-v2-b';
import {BrowserLocalLearningRepository} from '../infrastructure/storage/browser-local-repositories';

const args=new URL(location.href).searchParams;
const phase=args.get('phase')??'editor';
const width=Number(args.get('width')??320);
const status=document.getElementById('sle-test-result')!;
const host=document.getElementById('app')!;
const q=(selector:string)=>host.querySelector(selector);
const check=(truth:unknown,description:string)=>{if(!truth)throw Error('W2_BROWSE '+phase+' '+width+': '+description);};
const tick=()=>new Promise<void>(r=>setTimeout(r,28));
const wait=async(f:()=>boolean,description:string)=>{
  for(let i=0;i<180;i++){if(f())return;await tick()}
  throw Error('Timed out: '+description);
};
const clickText=(text:string)=>{
  const b=[...host.querySelectorAll('button')].find(x=>x.textContent?.trim()===text);
  check(!!b,'missing button '+text);
  check(!b!.disabled,'disabled button '+text);
  b!.click();
};
const writeInput=(element:HTMLInputElement,value:string)=>{
  const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!;
  element.focus();
  set.call(element,value);
  element.dispatchEvent(new Event('input',{bubbles:true}));
};
// Dedicated synthetic browser namespace. No production keys or real learner accounts.
const testPrefix='sle-w2-qa-isolated';
const testScope={ownerId:'synthetic-browser',learnerId:'w2'};
const persistence=new BrowserLocalLearningRepository(window.localStorage,testPrefix);
const savedFields=[
  {ideas:'art club\nreading club',reject:'reading club',best:'art club',fit:'participants make drawings'},
  {ideas:'writing workshop\nart club',reject:'writing workshop',best:'art club',fit:'teenagers can create together'}
];
function initial():WeekWork {
  const work=emptyWeekWork();
  if(phase==='legacy')work.fields.ideas='Old idea\n\n  a carefully indented note';
  if(phase==='compare'){
    work.history=savedFields.map((fields,i)=>({
      at:100+i,signature:JSON.stringify(fields),fields,kind:'progress',
      evidenceWeight:0,proficiencyWeight:0,provisional:true
    }));
  }
  return work;
}
function App(){
  const [work,setWork]=useState<WeekWork>(initial);
  (window as unknown as {qaGetWork:()=>WeekWork}).qaGetWork=()=>work;
  (window as unknown as {qaReadPersisted:()=>Promise<WeekWork|undefined>}).qaReadPersisted=async()=>{
    const saved=await new BrowserLocalLearningRepository(window.localStorage,testPrefix).readState(testScope);
    return saved?.writingCourseV2B?.weeks?.[2] as WeekWork|undefined;
  };
  useEffect(()=>{
    // The fixture exercises SLE's actual local repository, not an invented JSON storage contract.
    void persistence.writeState(testScope,{
      writingCourseV2B:{weeks:{2:work}},
      legacyUnrelatedField:{sentinel:'preserved'},
    }).catch(error=>{status.textContent='FAIL_REPOSITORY '+String(error)});
  },[work]);
  return <section className="panel wcv2 wcv2-b">
    {phase==='editor'||phase==='legacy'?
      <Week2IdeaWorkspace work={work} disabled={false}
        onEdit={(key,value)=>setWork(prev=>editWeek(prev,key,value))}/>:
      phase==='sort'?<Week2PracticeSort/>:
      phase==='compare'?<Week2SavedVersionComparison work={work}/>:
      <Week2InteractiveLearn/>}
  </section>;
}
async function run(){
  check([320,768].includes(width),'unsupported width');
  document.documentElement.style.width=width+'px';
  document.body.style.width=width+'px';
  document.body.style.margin='0';
  host.style.width=width+'px';
  host.style.maxWidth='100%';
  createRoot(host).render(<App/>);
  await wait(()=>!!host.querySelector('.wcv2-card'),'React mounted');
  await tick();
  const getWork=()=>(window as unknown as {qaGetWork:()=>WeekWork}).qaGetWork();
  const readSaved=()=>(window as unknown as {qaReadPersisted:()=>Promise<WeekWork|undefined>}).qaReadPersisted();
  if(phase==='learn'){
    check(host.textContent?.includes('Topic:'),'four-part task model');
    check(host.textContent?.includes('neighbourhood park'),'independent example');
    check(!host.textContent?.includes('WCV2-W2-G1'),'no answer keys');
  }
  if(phase==='sort'){
    check(host.querySelectorAll('select').length===4,'four concept sorting cards');
    check(!host.textContent?.includes('One defensible reading'),'no auto reveal');
    clickText('Compare with reviewed explanations');
    await wait(()=>!!host.textContent?.includes('One defensible reading'),'comparison rendered');
    check(host.textContent?.includes('does not award a score'),'no fake grade');
  }
  if(phase==='compare'){
    check(host.textContent?.includes('Saved version 1'),'prior version visible');
    check(host.textContent?.includes('Saved version 2'),'later version visible');
    check(host.textContent?.includes('Changed sections:'),'read-only comparison');
    check(!host.querySelector('textarea'),'no history editing');
  }
  if(phase==='legacy'){
    check(host.textContent?.includes('complex or historical formatting'),'legacy guard');
    const original=getWork().fields.ideas;
    const input=q('input[placeholder="Write one short activity idea"]') as HTMLInputElement;
    check(!!input,'add idea field');
    writeInput(input,'a new idea');
    await wait(()=>!([...(host.querySelectorAll('button'))].find(x=>x.textContent?.trim()==='Add idea card') as HTMLButtonElement).disabled,'add enabled');
    clickText('Add idea card');
    await wait(()=>getWork().fields.ideas.endsWith('\na new idea'),'legacy appended');
    check(getWork().fields.ideas.startsWith(original),'legacy original bytes intact');
    check(host.textContent?.includes('complex or historical formatting'),'still no destructive parse');
  }
  if(phase==='editor'){
    const input=q('input[placeholder="Write one short activity idea"]') as HTMLInputElement;
    check(!!input,'add idea input');
    writeInput(input,'Drama club');
    await wait(()=>!([...(host.querySelectorAll('button'))].find(x=>x.textContent?.trim()==='Add idea card') as HTMLButtonElement).disabled,'first idea accepted');
    clickText('Add idea card');
    await wait(()=>getWork().fields.ideas==='Drama club','first canonical idea');
    writeInput(input,'Book exchange');
    await wait(()=>!([...(host.querySelectorAll('button'))].find(x=>x.textContent?.trim()==='Add idea card') as HTMLButtonElement).disabled,'second idea accepted');
    clickText('Add idea card');
    await wait(()=>getWork().fields.ideas==='Drama club\nBook exchange','second canonical idea');
    const enabledMoveUp=[...host.querySelectorAll('button')].find(b=>b.textContent?.trim()==='Move up'&&!b.disabled);
    check(!!enabledMoveUp,'second card can move up');
    (enabledMoveUp as HTMLButtonElement).click();
    await wait(()=>getWork().fields.ideas==='Book exchange\nDrama club','reordering canonical idea lines');
    const choose=[...host.querySelectorAll('button')].find(b=>b.textContent?.trim()==='Choose as best');
    check(!!choose,'choose button exists');
    (choose as HTMLButtonElement).click();
    await wait(()=>getWork().fields.best==='Book exchange','chosen idea saved in canonical field');
    const edit=q('input[aria-label="Edit idea 1"]') as HTMLInputElement;
    writeInput(edit,'Art and drawing club');
    await wait(()=>!![...host.querySelectorAll('button')].find(b=>b.textContent?.trim()==='Apply edit'&&!b.disabled),'apply edit activated');
    clickText('Apply edit');
    await wait(()=>getWork().fields.ideas.startsWith('Art and drawing club'),'edit canonical idea');
    const remove=[...host.querySelectorAll('button')].filter(b=>b.textContent?.trim()==='Remove');
    check(remove.length===2,'two remove controls');
    remove[1].click();
    await wait(()=>getWork().fields.ideas==='Art and drawing club','removed second canonical idea');
    check(getWork().fields.best==='Book exchange','selection remains explicitly user-controlled after edits');
    check(host.textContent?.includes('does not exactly match a current idea card'),'stale selection prompts review without rewriting');
  }
  const checkBounds=()=>{
    const elements=[host,...host.querySelectorAll('section,article,button,input,select,textarea,li')];
    for(const el of elements){
      const rect=el.getBoundingClientRect();
      check(rect.right<=width+3,'horizontal right overflow '+el.tagName+' '+el.textContent?.slice(0,40));
      check(rect.left>=-3,'horizontal left overflow '+el.tagName+' '+el.textContent?.slice(0,40));
    }
    check(host.scrollWidth<=width+3,'host horizontal overflow');
  };
  checkBounds();
  await wait(()=>{
    const state=window.localStorage.getItem(
      testPrefix+':owner:synthetic-browser:learner:w2:state');
    if(!state)return false;
    try{return JSON.parse(state)?.writingCourseV2B?.weeks?.[2]?.fields?.ideas===getWork().fields.ideas}catch{return false}
  },'canonical Week 2 state persisted via real local repository');
  const roundTrip=await readSaved();
  check(roundTrip?.fields.ideas===getWork().fields.ideas,'new repository instance recovers same idea text');
  check(roundTrip?.fields.best===getWork().fields.best,'new repository instance recovers selection');
  check(JSON.stringify(roundTrip?.history)===JSON.stringify(getWork().history),'old saved versions recovered byte-for-byte');
  const snapshot=await persistence.readState(testScope);
  check(snapshot?.legacyUnrelatedField?.sentinel==='preserved','unrelated learning state not discarded');
  status.textContent='PASS_W2 '+JSON.stringify({phase,width,ideaCount:(getWork().fields.ideas??'').split('\n').filter(Boolean).length,
    browser:'native Chromium synthetic UI',isolatedRepositoryRoundTrip:true,productionWrites:0,realSafari:'NOT_TESTED'});
}
run().catch(e=>{status.textContent='FAIL '+String(e)+' '+String((e as Error).stack).slice(0,800)});
