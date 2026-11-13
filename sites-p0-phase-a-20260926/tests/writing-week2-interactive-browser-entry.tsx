import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  Week2IdeaWorkspace, Week2InteractiveLearn, Week2PracticeSort,
  Week2SavedVersionComparison
} from '../app/writing-week2-interactive';
import {editWeek,emptyWeekWork,type WeekWork} from '../domain/writing-course-v2-b';

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
    clickText('Move up');
    // The first card's move-up is disabled, so choose the enabled one by explicit query.
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
  status.textContent='PASS_W2 '+JSON.stringify({phase,width,ideaCount:getWork().fields.ideas.split('\n').filter(Boolean).length,
    browser:'native Chromium synthetic UI',writes:0,realSafari:'NOT_TESTED'});
}
run().catch(e=>{status.textContent='FAIL '+String(e)+' '+String((e as Error).stack).slice(0,800)});
