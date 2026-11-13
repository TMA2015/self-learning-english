import React from 'react';
import {createRoot} from 'react-dom/client';
import {RgwDepthTeaching} from '../app/rgw-depth-pilot';

const query=new URL(location.href).searchParams;
const lesson=query.get('lesson')??'REA-B1-03';
const version=query.get('version')??'1.25.0';
const width=Number(query.get('width')??'320');
const shell=document.getElementById('app')!;
const status=document.getElementById('sle-test-result')!;
function check(value:unknown,message:string){if(!value)throw Error('RGW_DEPTH_BROWSER '+lesson+' '+message);}
function waitUntil(predicate:()=>boolean){
 return new Promise<void>((resolve,reject)=>{
  let tick=0;
  function poll(){if(predicate())resolve();else if(++tick>=160)reject(Error('React mount timeout'));else setTimeout(poll,25);}
  poll();
 });
}
(async()=>{
 shell.style.width=width+'px';shell.style.maxWidth='100%';
 createRoot(shell).render(<RgwDepthTeaching lessonId={lesson} version={version}/>);
 await waitUntil(()=>!!document.querySelector('.sle-rgw-pilot')||version!=='1.25.0');
 if(version!=='1.25.0'){
  check(!document.querySelector('.sle-rgw-pilot'),'No overlay for older attempts');
  status.textContent='PASS_VERSION_GUARD';return;
 }
 const panel=document.querySelector('.sle-rgw-pilot') as HTMLElement;
 check(!!panel,'Teaching panel shown');
 const cards=panel.querySelectorAll('.sle-rgw-strategy');
 check(cards.length>=3,'Reviewed strategy cards present');
 const model=panel.querySelector('.sle-rgw-model') as HTMLElement;
 check(!!model&&model.textContent!.length>200,'Independent model present');
 const options=panel.querySelector('.sle-rgw-self-practice') as HTMLDetailsElement;
 check(!!options&&!options.open,'Optional practice initially closed');
 check(options.textContent?.includes('not submitted or graded'),'Honest unscored practice label');
 check(!panel.textContent?.includes('correct_option_id'),'No assessment key leak');
 check(!panel.textContent?.includes('Study apps can make it easier to organise homework'),'Original scored passage must not be in model');
 check(!panel.textContent?.includes('optional lunchtime reading circle'),'Original assessed Writing topic not in model');
 if(lesson==='REA-B1-03'){
  check(model.textContent?.includes('school garden'),'Separate Reading demonstration');
  check(cards.length===4,'Four reviewed Reading strategies');
 }else if(lesson==='GRA-B1-05'){
  check(model.textContent?.includes('art-room timetable'),'Separate Grammar demonstration');
  check(cards.length===3&&panel.textContent?.includes('mustn\'t'),'Deduction and prohibition comparison');
 }else if(lesson==='WRI-B1-05'){
  check(model.textContent?.includes('monthly art exhibition'),'Separate Writing example');
  check(panel.querySelectorAll('.sle-rgw-brainstorm li').length===5,'All five brainstorm questions');
  options.open=true;
  await new Promise(resolve=>setTimeout(resolve,30));
  const checkboxes=panel.querySelectorAll<HTMLInputElement>('.sle-rgw-checklist input');
  check(checkboxes.length===6,'Optional six-point self-check checklist');
  checkboxes[0].click();
  check(checkboxes[0].checked,'Checkbox works but does not grade or save');
 }
 const rect=panel.getBoundingClientRect(),left=shell.getBoundingClientRect().left;
 check(rect.right-left<=width+2,'Panel right overflow at '+width+'px');
 const card=cards[0] as HTMLElement;
 check(getComputedStyle(card.querySelector('p')!).fontSize==='16px','Readable 16px card text');
 status.textContent='PASS_RGW_'+lesson.replaceAll('-','_')+'_'+width;
})().catch(error=>{status.textContent='FAIL '+String(error)+' '+String((error as Error).stack).slice(0,550);});
