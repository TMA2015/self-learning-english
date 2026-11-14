import React, {useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {
  Week2IdeaWorkspace, Week2InteractiveLearn, Week2PracticeSort,
  Week2SavedVersionComparison,Week2TransferPractice
} from '../app/writing-week2-interactive';
import {Week2ThinkBeforeReveal,Week2RepairBridge,Week2RevisionCoach} from '../app/writing-week2-learning-lab';
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
const setValue=(element:HTMLTextAreaElement|HTMLSelectElement,value:string)=>{
  const descriptor=Object.getOwnPropertyDescriptor(element instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLSelectElement.prototype,'value')!;
  descriptor.set!.call(element,value);
  element.dispatchEvent(new Event('input',{bubbles:true}));
  element.dispatchEvent(new Event('change',{bubbles:true}));
};
const savedFields=[
  {ideas:'art club\nreading club',reject:'reading club',best:'art club',fit:'participants make drawings'},
  {ideas:'writing workshop\nart club',reject:'writing workshop',best:'art club',fit:'teenagers can create together'}
];
function initial():WeekWork {
  const work=emptyWeekWork();
  if(phase==='legacy')work.fields.ideas='Old idea\n\n  a carefully indented note';
  if(phase==='compare'||phase==='oneversion'){
    work.history=savedFields.slice(0,phase==='oneversion'?1:2).map((fields,i)=>({
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
      phase==='compare'||phase==='oneversion'?<Week2SavedVersionComparison work={work}/>: 
      phase==='predict'?<Week2ThinkBeforeReveal/>:
      phase==='repair'?<Week2RepairBridge/>:
      phase==='revise'?<Week2RevisionCoach work={work}/>:
      phase==='transfer'?<Week2TransferPractice/>:
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
  if(phase==='oneversion'){
    check(host.textContent?.includes('One saved version so far'),'one version is not fake comparison');
    check(!host.textContent?.includes('Saved version 2'),'no fabricated history');
    check(getWork().history.length===1,'exactly one original saved attempt');
  }
  if(phase==='compare'){
    check(host.textContent?.includes('Saved version 1'),'prior version visible');
    check(host.textContent?.includes('Saved version 2'),'later version visible');
    check(host.textContent?.includes('Changed sections:'),'read-only comparison');
    const savedHistory=JSON.stringify(getWork().history);
    check(host.querySelectorAll('textarea').length===1,'single unsaved reflection, no history editor');
    const reflection=q('textarea') as HTMLTextAreaElement;
    setValue(reflection,'I made the reason more specific to the task.');
    await wait(()=>!!host.textContent?.includes('not saved or graded'),'unsaved comparison explanation');
    check(JSON.stringify(getWork().history)===savedHistory,'history remains byte-for-byte unchanged');
  }
  if(phase==='predict'){
    const reveal=[...host.querySelectorAll('button')].find(b=>b.textContent?.trim()==='Compare my reasoning') as HTMLButtonElement;
    check(!!reveal&&reveal.disabled,'worked feedback gated by own attempt');
    check(!host.textContent?.includes('One defensible choice:'),'no early answer');
    (q('input[value="magnet"]') as HTMLInputElement).click();
    setValue(q('textarea') as HTMLTextAreaElement,'Children can try it themselves in fifteen minutes.');
    await wait(()=>!reveal.disabled,'feedback unlocked after reasoning');
    reveal.click();
    await wait(()=>!!host.textContent?.includes('One defensible choice:'),'explanation revealed after attempt');
    check(!getWork().fields.ideas,'prediction did not write canonical Week 2 notes');
  }
  if(phase==='repair'){
    const example=[...host.querySelectorAll('button')].find(b=>b.textContent?.trim()==='Compare with one possible repair') as HTMLButtonElement;
    check(!!example&&example.disabled,'repair model hidden before trying');
    const notes=[...host.querySelectorAll('textarea')] as HTMLTextAreaElement[];
    check(notes.length===2,'independent repair and explanation fields');
    setValue(notes[0],'Visitors play a short game matching clean items to recycling bins.');
    setValue(notes[1],'It involves sorting and could be finished in ten minutes.');
    await wait(()=>!example.disabled,'repair model unlocked after both attempts');
    example.click();
    await wait(()=>!!host.textContent?.includes('One possible repair:'),'model available after attempt');
    check(!getWork().fields.ideas,'bridge is unscored and does not change canonical draft');
  }
  if(phase==='revise'){
    check(host.querySelectorAll('select').length===5,'four criteria and one revision focus');
    check(host.textContent?.includes('not an automatic assessment')===false,'no automatic semantic assessment claim');
    const first=host.querySelector('select') as unknown as HTMLSelectElement;
    setValue(first,'not yet');
    await wait(()=>first.value==='not yet','learner self-judgement changed');
    check(!getWork().fields.ideas,'self-ratings do not write learner evidence');
  }
  if(phase==='transfer'){
    check(host.textContent?.includes('Try independently first'),'transfer starts without answers');
    const help=[...host.querySelectorAll('button')].find(b=>b.textContent?.trim()==='Check my process after attempting') as HTMLButtonElement;
    check(!!help&&help.disabled,'transfer hints gated by independent attempt');
    const notes=[...host.querySelectorAll('textarea')] as HTMLTextAreaElement[];
    check(notes.length===3,'three independent transfer fields');
    setValue(notes[0],'Welcome games; group treasure clue hunt');
    setValue(notes[1],'A group welcome game');
    setValue(notes[2],'Newcomers introduce themselves in small pairs.');
    await wait(()=>!help.disabled,'transfer process self-check unlocked');
    help.click();
    await wait(()=>!!host.textContent?.includes('process reminder, not an answer key'),'transfer no model leakage');
    check(!getWork().fields.ideas,'optional transfer remains outside canonical saved state');
  }
  if(phase==='legacy'){
    check(host.textContent?.includes('complex or historical formatting'),'legacy guard');
    check(!!q('.w2-map-original'),'original complex notes displayed without conversion');
    check(host.textContent?.includes('Original notes preserved exactly'),'legacy map explains read-only rendering');
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
    check(!!q('.w2-map-root'),'task centre visible in visual map');
    check(host.querySelectorAll('.w2-map-branch').length===3,'three connected branches visible');
    check(host.querySelectorAll('.w2-map-idea').length===2,'both idea nodes visible');
    check(host.textContent?.includes('Your school can add one new after-school activity'),'exact canonical task displayed');
    const enabledMoveUp=[...host.querySelectorAll('button')].find(b=>b.textContent?.trim()==='Move up'&&!b.disabled);
    check(!!enabledMoveUp,'second card can move up');
    (enabledMoveUp as HTMLButtonElement).click();
    await wait(()=>getWork().fields.ideas==='Book exchange\nDrama club','reordering canonical idea lines');
    const mapChoice=q('button[aria-label="Select idea 1 from map"]') as HTMLButtonElement;
    check(!!mapChoice&&!mapChoice.disabled,'map choose button is enabled');
    mapChoice.click();
    await wait(()=>getWork().fields.best==='Book exchange','map selection updates original canonical field');
    check(!!q('.w2-map-chosen'),'selected map node displays a non-color label');
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
