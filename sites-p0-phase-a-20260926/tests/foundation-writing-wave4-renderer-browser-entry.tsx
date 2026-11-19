import React,{useState,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {FoundationWritingWave4} from '../app/foundation-writing-wave4';
import {reviewedKeys,edit,stage,verifyReadback,type Scope,type Wave4Id,type Wave4Draft,
 type Wave4Work} from '../domain/foundation-writing-wave4-readiness';
import {WAVE4_SOURCE_NAME,WAVE4_SOURCE_SHA256,WAVE4_NOTEBOOKLM_VERDICT,
 type Wave4Lesson} from '../domain/foundation-writing-wave4-content';
const phase=new URL(location.href).searchParams.get('phase')??'10';
const unit=('FW-U'+(phase==='invalid'?'10':phase)) as Wave4Id;
const output=document.getElementById('sle-test-result')!;
const root=()=>document.getElementById('app')!;
const sentence='This is synthetic rendering test content only, not an approved original Foundation Writing lesson.';
const first='Hello Manager, could you consider clearer information about our weekend workshop? Thank you for considering this suggestion.';
const strips={topic:'A synthetic writing topic',task:'Write to a fictional reader politely',
 mustInclude:'Give an idea, explanation and a specific reader action',boundary:'The proposal is not approved and facts must not be invented'};
function rows(id:Wave4Id,part:'A-'|'F'){
 return Object.entries(reviewedKeys).filter(([k])=>k.startsWith(id+'-'+part)).map(([qid,key])=>({
  id:qid,key,options:[...'ABCD'].map(c=>({id:c,text:'Synthetic option '+qid+c,
    rationale:'Synthetic explanation for '+qid+c+'.'}))
 }));
}
function source(id:Wave4Id):Wave4Lesson{
 const s=(type:'B'|'T')=>({id:id+'-'+type,prompt:sentence+' '+type,taskStrip:strips,
   fields:[{key:'draftV1',label:'Write a complete original short draft'}]});
 return {id,title:'Synthetic '+id+' renderer check',outcome:'Write an independent response preserving the intended facts and reader purpose.',
  minutes:'30–45',source:{document:WAVE4_SOURCE_NAME,sha256:WAVE4_SOURCE_SHA256,
   notebooklm:WAVE4_NOTEBOOKLM_VERDICT,verdict:'PASS',requiredChanges:'NONE'},
  teaching:{lessons:[sentence+' The teacher explains a strategy.',sentence+' The learner practises independently.'],
   demo:{id:id+'-D01',prompt:sentence+' independent worked example',
    steps:['Notice','Decide','Why','Reject/repair','Transfer'].map(s=>[s,sentence] as [string,string])},
   a1:'A simpler sentence frame',b1:'A more advanced writer consideration'},
  cycleA:{id:id+'-A',prompt:sentence+' Practice A',taskStrip:strips,items:rows(id,'A-'),
   ownFields:[{key:'reason',label:'Explain your reasoning independently'}]},
  cycleB:s('B'),transfer:s('T'),extras:rows(id,'F')};
}
const all:Wave4Lesson[]=['FW-U10','FW-U11','FW-U12'].map(x=>source(x as Wave4Id));
const blank=():Wave4Work=>({draft:{cycleAAnswers:{},cycleAOwn:{},cycleB:{},transfer:{},extrasAnswers:{}},versions:[]});
const check=(v:unknown,msg:string)=>{if(!v)throw Error('FW4_RENDERER: '+msg)};
const sleep=(ms:number)=>new Promise<void>(resolve=>setTimeout(resolve,ms));
const until=async(f:()=>boolean,msg:string)=>{for(let i=0;i<350;i++){if(f())return;await sleep(40)}
 throw Error('timeout '+msg+' DOM='+root().textContent?.slice(-700))};
function App(){
 const init:Scope={schemaVersion:1,units:{'FW-U09':{firstDraftV1:{text:first,version:1,savedAt:101},
  versions:[{version:1,savedAt:101,draft:{cycleB:{draftV1:first}}}]}}};
 const [scope,setScope]=useState<Scope>(init);const latest=useRef<Scope>(scope);
 const [exited,setExited]=useState(false);
 function patch(d:Wave4Draft){const next=edit(latest.current,unit,d);latest.current=next;setScope(next)}
 async function save(){
  if((window as any).__failSave)return false;
  const s=stage(latest.current,unit,Date.now());
  const durable=JSON.parse(JSON.stringify(s.after)) as Scope;
  const ok=verifyReadback(s,durable);
  if(ok){latest.current=durable;setScope(durable)}return ok;
 }
 async function reviewer(p:{unitId:Wave4Id;fixtureId:string;task:string;text:string}){
  check(p.unitId===unit,'review unit preserved');
  check(p.fixtureId===unit+'-B'||p.fixtureId===unit+'-T','fixture allowed');
  check(p.text.includes(unit),'learner text is sent');
  (window as any).__reviewCalls=((window as any).__reviewCalls??0)+1;
  return {summary:'Synthetic grounded review',strengths:['Original writing is visible'],
   improvements:[],quotes:[p.text.slice(0,24)],questions:['Can you clarify the reader benefit?'],
   nextAction:'Revise your own text.',scores:null,level:null,canEstimateLevel:false};
 }
 return <><FoundationWritingWave4 unitId={unit} approvedBundle={phase==='invalid'?all.slice(0,2):all}
  work={(scope.units[unit] as Wave4Work)||blank()} onEdit={patch} onSave={save}
  originalDraftV1={first} reviewer={reviewer} onExit={()=>setExited(true)}/>
  <output id="qa-exited">{exited?'YES':'NO'}</output></>;
}
function report(s:string,data:unknown){output.textContent=s+' '+JSON.stringify(data)}
const button=(t:string)=>[...root().querySelectorAll('button')].find(x=>x.textContent?.trim().includes(t)) as HTMLButtonElement|undefined;
const click=(s:string)=>{const b=button(s);check(b,'missing button '+s);b!.click()};
async function write(name:string,value:string){
 const el=root().querySelector('textarea[name="'+name+'"]') as HTMLTextAreaElement|null;check(el,'input '+name);
 const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')?.set;check(setter,'setter');
 setter!.call(el,value);el!.dispatchEvent(new Event('input',{bubbles:true}));
 await until(()=>((root().querySelector('textarea[name="'+name+'"]') as HTMLTextAreaElement)?.value===value),'input changed');
}
(async()=>{
 (window as any).__reviewCalls=0;
 createRoot(root()).render(<App/>);
 if(phase==='invalid'){
  await until(()=>!!root().querySelector('[role="alert"]'),'source rejection');
  check(!button('Save version'),'unreviewed source blocks learner entry');
  report('PASS_W4_RENDER_INVALID',{failClosed:true,providerCalls:0});return;
 }
 await until(()=>!!root().querySelector('[aria-label="Foundation Writing '+unit+'"]'),'render');
 check((window as any).__reviewCalls===0,'AI not auto-called at startup');
 check(root().textContent?.includes(first),'read-only original U09 draft shown');
 click('Practice A');
 await until(()=>root().textContent?.includes(unit+'-A-TENSE')||root().textContent?.includes(unit+'-A-PRIORITY')||
 root().textContent?.includes(unit+'-A-COVER')||false,'Practice A');
 check(!root().textContent?.includes('Fixed key: '),'answers hidden before check');
 const firstQ=rows(unit,'A-')[0];
 const option=root().querySelector('input[name="'+firstQ.id+'"][value="'+firstQ.key+'"]') as HTMLInputElement|null;
 check(option,'choice exists');option!.click();
 await until(()=>button('Check and explain')?.disabled===false,'answer selected');
 click('Check and explain');
 await until(()=>root().textContent?.includes('Fixed key: '+firstQ.key)===true,'explanation reveal');
 click('Practice B');
 await until(()=>!!root().querySelector('textarea[name="'+unit+'-cycleB-draftV1"]'),'Practice B mounted');
 const original=unit+' My independent synthetic message asks the reader to consider an unapproved workshop idea.';
 await write(unit+'-cycleB-draftV1',original);
 click('AI Tutor');
 await until(()=>!!button('Get personal AI Tutor feedback'),'AI tab');
 check(button('Get personal AI Tutor feedback')!.disabled,'unsaved original blocked');
 check((window as any).__reviewCalls===0,'no review on opening');
 click('Practice B');
 click('Save version');
 await until(()=>root().textContent?.includes('Saved version 1.')===true,'saved version');
 click('AI Tutor');
 await until(()=>button('Get personal AI Tutor feedback')?.disabled===false,'AI eligible');
 check((window as any).__reviewCalls===0,'no auto review after save');
 click('Get personal AI Tutor feedback');
 await until(()=>root().textContent?.includes('Synthetic grounded review')===true,'opt-in result');
 check((window as any).__reviewCalls===1,'one explicit review');
 click('Practice B');
 await until(()=>!!root().querySelector('textarea[name="'+unit+'-cycleB-draftV1"]'),'Practice B remounted');
 await write(unit+'-cycleB-draftV1',unit+' This is a changed learner text with a specific reader benefit.');
 click('AI Tutor');
 await until(()=>!!button('Get personal AI Tutor feedback'),'AI tab after edit');
 check(button('Get personal AI Tutor feedback')!.disabled,'unsaved revised draft blocks AI');
 check(!root().textContent?.includes('Synthetic grounded review'),'stale feedback removed');
 click('Save & Exit');
 await until(()=>root().querySelector('#qa-exited')?.textContent==='YES','Save & Exit');
 check((window as any).__reviewCalls===1,'save/exit did not call AI');
 report('PASS_W4_RENDER_'+phase,{unit,checkedFirstKey:true,teacherSourceGate:true,
  saveAndExit:true,unsavedBlockedAI:true,explicitReviewOnly:true});
})().catch(e=>report('FAIL_W4_RENDER',{message:String(e),stack:String((e as Error).stack).slice(0,1600)}));
