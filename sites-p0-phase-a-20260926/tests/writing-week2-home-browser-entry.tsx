import React from 'react';
import {createRoot} from 'react-dom/client';
import Home from '../app/home-client';
import {writingWeek} from '../domain/writing-course-v2-b';
createRoot(document.getElementById('app')!).render(<Home/>);
const pause=(ms:number)=>new Promise<void>(r=>setTimeout(r,ms));
const text=(e:Element|null)=>e?.textContent?.trim().replace(/\s+/g,' ')??'';
const wait=async(p:()=>boolean,why:string,limit=25000)=>{
 for(let i=0;i<limit/60;i++){if(p())return;await pause(60)}
 throw Error('Timeout: '+why+' current='+text(document.querySelector('main')).slice(0,220));
};
const button=(s:string,selector='button')=>[...document.querySelectorAll<HTMLButtonElement>(selector)].find(e=>text(e)===s);
const click=async(s:string,selector='button')=>{
 await wait(()=>!!button(s,selector)&&!button(s,selector)!.disabled,s);
 button(s,selector)!.click();await pause(130);
};
const panel=()=>document.querySelector('section.panel.wcv2.wcv2-b');
const toWeek=async()=>{
 await wait(()=>text(document.querySelector('.save-status')).includes('Saved on this device'),'local runtime');
 await click('My Courses','nav[aria-label="Main navigation"] button.nav-item');
 await wait(()=>!!document.querySelector('section[aria-label="English Writing Coach course"]'),'dedicated Writing course card');
 await click('Continue','section[aria-label="English Writing Coach course"] button');
 await click('Open Week 2','main button');
 await wait(()=>text(panel()).includes('Week 2'),'integrated Week 2');
};
const step=async(s:string)=>{await click(s,'.stage-nav button');await wait(()=>text(document.querySelector('.stage-nav [aria-current="step"]'))===s,'step '+s)};
const write=async(e:HTMLTextAreaElement,value:string)=>{
 Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')?.set?.call(e,value);
 e.dispatchEvent(new Event('input',{bubbles:true}));await pause(180);
};
const full=async()=>{
 await toWeek();
 if(!document.querySelector('.english-lesson-ai-launch'))throw Error('Gemini AI Tutor control missing on Learn screen');
 const vi=document.querySelector<HTMLInputElement>('.support-toggle input');
 if(!vi)throw Error('Vietnamese Support missing');
 if(!vi.checked)vi.click();
 await wait(()=>!!panel()?.querySelector('.vi-help'),'Vietnamese support');
 await step('Guided Practice');
 const qs=writingWeek(2).items;
 for(let i=0;i<qs.length;i++){
  const field=[...panel()!.querySelectorAll('fieldset')][i];
  if(!field)throw Error('missing MCQ '+i);
  const choices=[...field.querySelectorAll<HTMLInputElement>('input[type=radio]')];
  if(i===0){
   choices[(qs[i].correct+1)%choices.length].click();await pause(90);
   field.querySelector<HTMLButtonElement>('button')!.click();
   await wait(()=>text(field).includes('Incorrect'),'wrong feedback');
   choices[qs[i].correct].click();await pause(90);
   field.querySelector<HTMLButtonElement>('button')!.click();
  }else{
   choices[qs[i].correct].click();await pause(90);
   field.querySelector<HTMLButtonElement>('button')!.click();
  }
  await wait(()=>text(field).includes('Correct')||text(field).includes('Retry used'),'MCQ '+i);
 }
 await step('Main Practice');
 const data={ideas:'Drawing club\nMusic club\nScience club',best:'Drawing club',fit:'Students share simple art materials after school.'};
 for(const [key,value] of Object.entries(data)){
  const e=panel()?.querySelector<HTMLTextAreaElement>('textarea[name="week-2-'+key+'"]');
  if(!e)throw Error('missing '+key);
  await write(e,value);
 }
 const reject=panel()?.querySelector<HTMLTextAreaElement>('textarea[name="week-2-reject"]');
 if(!reject||reject.value.trim())throw Error('reject should remain blank');
 const own=[...panel()!.querySelectorAll<HTMLInputElement>('input[type=checkbox]')].find(e=>!e.checked);
 if(!own)throw Error('own work checkbox');own.click();await pause(130);
 await click('Save my plan & check it');
 await wait(()=>text(panel()).includes('YOUR PLAN · READ-ONLY'),'save to feedback');
 const ai=panel()?.querySelector('article[aria-label="Optional AI review of saved Week 2 plan"]');
 if(!ai||!text(ai).includes('Ready for Gemini review'))throw Error('Saved local plan is not ready for Gemini');
 const aiButton=ai.querySelector<HTMLButtonElement>('button');
 if(!aiButton||aiButton.disabled)throw Error('Gemini review button should be enabled after local save');
 // No click here: real HomeClient QA must not call the live provider. Mock handler coverage is separate.

 await step('Reflect & Finish');
 const reflection=panel()?.querySelector<HTMLTextAreaElement>('textarea');
 if(!reflection)throw Error('reflection input');await write(reflection,'I chose drawing because it clearly answers the task.');
 await click('Save reflection & finish Week 2');
 await wait(()=>text(panel()).includes('Week 2 has been completed'),'finish Week 2');
 return {phase:'full',viewport:innerWidth,checks:['Home navigation','Vietnamese Support','4 MCQs and retry','optional reject','save and feedback','single reflection and finish'],overflow:document.documentElement.scrollWidth-innerWidth};
};
const restore=async()=>{
 await toWeek();await step('Reflect & Finish');
 if(!text(panel()).includes('Week 2 has been completed')||!text(panel()).includes('Saved version 1'))throw Error('history or completion missing after reload');
 await step('Main Practice');
 const rej=panel()?.querySelector<HTMLTextAreaElement>('textarea[name="week-2-reject"]');
 if(rej?.value.trim())throw Error('empty reject not restored');
 return {phase:'restore',viewport:innerWidth,checks:['IndexedDB saved completion/history/optional blank reject'],overflow:document.documentElement.scrollWidth-innerWidth};
};
const responsive=async()=>{
 await toWeek();
 const overflow=document.documentElement.scrollWidth-innerWidth;
 if(overflow>3)throw Error('horizontal overflow '+overflow+' at '+innerWidth);
 for(const el of panel()!.querySelectorAll<HTMLElement>('button,input,textarea')){
  const r=el.getBoundingClientRect();
  if(r.width&&r.height&&r.right>innerWidth+3)throw Error('offscreen control '+text(el).slice(0,70));
 }
 return {phase:'responsive',viewport:innerWidth,checks:['integrated Home viewport / controls'],overflow};
};

/** Real integrated HomeClient navigation QA for PR #168. Browser-local/synthetic only. */
const skillOverview=async()=>{
 await wait(()=>text(document.querySelector('.save-status')).includes('Saved on this device'),'browser-local learner runtime');
 const isMobile=innerWidth<=750;
 const nav=async(label:string)=>{
  if(isMobile){
   const menu=document.querySelector<HTMLButtonElement>('.mobile-menu');
   if(!menu)throw Error('Mobile navigation toggle missing');
   menu.click();
   await wait(()=>!!document.querySelector('aside.sidebar.open'),'mobile sidebar opens');
  }
  await click(label,'nav[aria-label="Main navigation"] button.nav-item');
  if(isMobile)await wait(()=>!document.querySelector('aside.sidebar.open'),'mobile sidebar closes');
 };
 const expected:[string,number][]=[
  ['Grammar',40],['Vocabulary',18],['Reading',33],['Writing',31],
  ['Listening',21],['Speaking',6],['Pronunciation',5]
 ];
 const assertOverview=async(label:string,count:number)=>{
  await wait(()=>text(document.querySelector('.page-heading h1'))===label,label+' skill title');
  await wait(()=>text(document.querySelector('.page-heading p'))===count+' lessons available',label+' skill count');
  await wait(()=>!!document.querySelector('.foundation-path'),label+' skill navigation');
  const tabs=document.querySelector<HTMLElement>('.foundation-path')!;
  const heading=document.querySelector<HTMLElement>('.page-heading')!;
  if(!(tabs.compareDocumentPosition(heading)&Node.DOCUMENT_POSITION_FOLLOWING))
   throw Error(label+' tabs are not above heading');
  const buttons=[...tabs.querySelectorAll<HTMLButtonElement>('button')];
  if(buttons.length!==7)throw Error('Expected exactly 7 skill tabs; found '+buttons.length);
  for(const [skill] of expected){
   if(!buttons.some(button=>text(button).toLowerCase().includes(skill.toLowerCase())))
    throw Error('Missing '+skill+' skill tab');
  }
  if(!text(document.querySelector('.foundation-today')).includes('What should I study today?'))
   throw Error(label+' learning suggestion disappeared');
  if(![...document.querySelectorAll('.foundation-today button')].some(b=>text(b)==='Browse Units'))
   throw Error(label+' needs the existing Unit-browser action');
  if(document.documentElement.scrollWidth>innerWidth+3)
   throw Error(label+' horizontal overflow '+(document.documentElement.scrollWidth-innerWidth)+'px at '+innerWidth);
  for(const button of buttons){
   const r=button.getBoundingClientRect();
   if(r.width&&r.height&&(r.left<0||r.right>innerWidth+3))
    throw Error(label+' offscreen skill tab '+text(button)+' at '+innerWidth);
  }
 };
 const selectTab=async(label:string)=>{
  const tab=[...document.querySelectorAll<HTMLButtonElement>('.foundation-path button')]
   .find(button=>text(button).toLowerCase().includes(label.toLowerCase()));
  if(!tab)throw Error('Cannot switch to '+label);
  tab.click();await pause(150);
 };
 await nav('Grammar');
 await assertOverview('Grammar',40);
 for(const [skill,count] of expected.slice(1)){
  await selectTab(skill);await assertOverview(skill,count);
 }
 await selectTab('Writing');
 await assertOverview('Writing',31);
 const direct=document.querySelector<HTMLButtonElement>('.foundation-writing-action button');
 if(!direct||text(direct)!=='Open AI Writing Feedback · Any Topic')
  throw Error('Writing independent feedback entry missing');
 direct.click();
 await wait(()=>!!document.querySelector('textarea[name="student-written-content"]'),'Writing Any Topic opened');
 await nav('AI Tutor');
 await wait(()=>text(document.querySelector('.page-heading h1'))==='AI Tutor','AI Tutor overview');
 const tutorButton=[...document.querySelectorAll<HTMLButtonElement>('.platform-intro button')]
  .find(button=>text(button).includes('Open AI Writing Feedback'));
 if(!tutorButton)throw Error('AI Tutor independent Writing feedback CTA missing');
 tutorButton.click();
 await wait(()=>!!document.querySelector('textarea[name="student-written-content"]'),'AI Tutor links to Any Topic');
 await nav('My Courses');
 await wait(()=>!!document.querySelector('section[aria-label="English Writing Coach course"]'),
  'Separate 12-week course retained');
 return {phase:'skillOverview',viewport:innerWidth,skillCounts:expected,
  sevenTabsAboveTitle:true,browseUnitsPreserved:true,
  writingAnyTopic:true,tutorAnyTopic:true,separateWritingCourse:true,
  mobileMenuCovered:isMobile,overflow:document.documentElement.scrollWidth-innerWidth};
};

(window as any).__SLE_WEEK2_HOME_QA={full,restore,responsive,skillOverview};
