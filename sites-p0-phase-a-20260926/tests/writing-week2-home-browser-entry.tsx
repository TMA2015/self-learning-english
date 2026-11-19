import React from 'react';
import {createRoot} from 'react-dom/client';
import Home from '../app/home-client';
import {writingWeek} from '../domain/writing-course-v2-b';
const __FW_BROWS_ERRORS:string[]=[];
window.addEventListener('error',e=>__FW_BROWS_ERRORS.push(String(e.error?.stack??e.message).slice(0,900)));
window.addEventListener('unhandledrejection',e=>__FW_BROWS_ERRORS.push(String(e.reason?.stack??e.reason).slice(0,900)));
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


/** Real integrated HomeClient Foundation Writing 12-Unit source, save, revision, reload regression. */
const foundationTwelve=async()=>{
 await wait(()=>text(document.querySelector('.save-status')).includes('Saved on this device'),'SLE local storage ready');
 const n=(id:string)=>document.querySelector<HTMLButtonElement>('nav[aria-label="Main navigation"] button.nav-item[data-id="'+id+'"]');
 const navigateUnit=async(id:'10'|'11'|'12')=>{
  const label='Foundation Writing · U'+id,navItems=[...document.querySelectorAll<HTMLButtonElement>('nav[aria-label="Main navigation"] button.nav-item')];
  const button=navItems.find(b=>text(b)===label);
  if(!button)throw Error('Reviewed full course sidebar missing '+label);
  button.click();
  try{
   await wait(()=>!!document.querySelector('section[aria-label="Foundation Writing FW-U'+id+'"]'),label+' source-backed screen');
  }catch(error){
   throw Error(String(error)+'; React errors: '+JSON.stringify(__FW_BROWS_ERRORS.slice(-5))+
    '; DOM: '+String(document.body?.textContent).slice(0,800));
  }
 };
 const editor=(unit:string,stage:string,key:string)=>document.querySelector<HTMLTextAreaElement>(
  'textarea[name="'+unit+'-'+stage+'-'+key+'"]');
 const saveVersion=async(num:number)=>{
  await click('Save version','main button');
  await wait(()=>text(document.querySelector('main')).includes('Saved version '+num+'.'),'durable saved version '+num);
  if(text(document.querySelector('main')).includes('Save failed'))throw Error('Unexpected storage failure');
 };
 const original=(id:string)=>'FW-U'+id+' I wrote my original independent short account about a possible event. '+
  'I explained what happened, why the action matters, and what a reader could do next. This is a synthetic learner-authored QA text.';
 const revised=(id:string)=>original(id)+' I clarified the purpose and kept the unapproved suggestion conditional.';
 for(const id of ['10','11','12'] as const){
  const unit='FW-U'+id;
  await navigateUnit(id);
  if(!text(document.querySelector('main')).includes('Micro-lesson 1'))throw Error('Reviewed teaching missing '+unit);
  if(!text(document.querySelector('main')).includes('Micro-lesson 2'))throw Error('Second micro-lesson missing '+unit);
  await click('Practice A','main button');
  await wait(()=>!!document.querySelector('input[name="'+unit+'-'+(id==='10'?'A-TENSE':id==='11'?'A-PRIORITY':'A-COVER')+'"]'),unit+' actual source Cycle A');
  const firstId=unit+'-'+(id==='10'?'A-TENSE':id==='11'?'A-PRIORITY':'A-COVER');
  const choices=[...document.querySelectorAll<HTMLInputElement>('input[name="'+firstId+'"]')];
  if(choices.length!==4)throw Error('Original four options missing '+firstId);
  if(!text(document.querySelector('main')).includes(id==='10'?'Last Friday':id==='11'?'revision':'pool'))
   throw Error('Real source question context missing '+unit);
  await click('Practice B','main button');
  await wait(()=>!!editor(unit,'cycleB','draftV1'),'Original V1 editor '+unit);
  await write(editor(unit,'cycleB','draftV1')!,original(id));
  await saveVersion(1);
  const savedEditor=editor(unit,'cycleB','draftV1');
  if(!savedEditor?.readOnly||savedEditor.value!==original(id))throw Error(unit+' immutable V1 not protected');
  const v2Key=id==='10'?'editedV2':'revisedV2';
  if(id==='11'){
   const keep=document.querySelector<HTMLInputElement>('input[name="'+unit+'-revision"][value="KEEP_V1_WITH_REASON"]');
   if(!keep)throw Error('Justified retain control missing');keep.click();
   await wait(()=>!!editor(unit,'revision','reason'),'keep note input');
   await write(editor(unit,'revision','reason')!,'The initial proposal already states a realistic method and suitable reader action.');
  }else{
   await wait(()=>!!editor(unit,'cycleB',v2Key),'V2 editor');
   await write(editor(unit,'cycleB',v2Key)!,revised(id));
   const choice=document.querySelector<HTMLInputElement>('input[name="'+unit+'-revision"][value="REVISION_SAVED"]');
   if(!choice)throw Error('Revision decision missing');choice.click();
   await write(editor(unit,'revision','reason')!,'Added a specific reader action while preserving the original facts and conditional status.');
  }
  await saveVersion(2);
  if(!editor(unit,'cycleB','draftV1')?.readOnly)throw Error('V1 was unlocked after revision '+unit);
  await click('AI Tutor','main button');
  await wait(()=>!!document.querySelector('section[aria-label="'+unit+' optional AI Tutor Writing Review"]'),'Optional tutor screen');
  const review=[...document.querySelectorAll<HTMLButtonElement>('main button')].find(b=>text(b)==='Get personal AI Tutor feedback');
  if(!review)throw Error('Saved-only optional AI Tutor control missing '+unit);
  // Browser QA never clicks the provider button; availability depends on the
  // real public Firebase config, not on an assumed unconfigured environment.
  if((window as any).__OUTSIDE_REQUESTS)throw Error('Unexpected external request before explicit AI opt-in '+unit);
 }
 const preserved=await (await import('../infrastructure/browser/client-services')).loadLearnerState();
 const st=(preserved.state as any)?.foundationWritingV1?.units;
 if(!st)throw Error('Foundation Writing real state not stored');
 for(const id of ['10','11','12']){
  const w=st['FW-U'+id];
  if(w?.versions?.length!==2||w.versions[0].draft.cycleB.draftV1!==original(id))
   throw Error('Real saved V1/V2 history missing FW-U'+id);
 }
 return {phase:'foundationTwelve',actualHomeClient:true,reviewedUnits:['FW-U10','FW-U11','FW-U12'],
  exactSourceOptions:true,versions:[2,2,2],originalV1Immutable:true,
  justifiedKeepCase:true,realSleStorage:true,providerCalls:0};
};
const foundationRestore=async()=>{
 await wait(()=>text(document.querySelector('.save-status')).includes('Saved on this device'),'restored SLE local state');
 const service=await import('../infrastructure/browser/client-services');
 const data=(await service.loadLearnerState()).state as any;
 const units=data?.foundationWritingV1?.units;
 if(!units)throw Error('Wave4 store absent after actual browser reload');
 for(const id of ['10','11','12']){
  const w=units['FW-U'+id];
  if(w?.versions?.length!==2)throw Error('Reload failed '+id);
  if(!w?.versions[0]?.draft?.cycleB?.draftV1?.includes('I wrote my original independent'))
   throw Error('Original V1 text changed '+id);
 }
 const label='Foundation Writing · U12';
 const b=[...document.querySelectorAll<HTMLButtonElement>('nav[aria-label="Main navigation"] button.nav-item')]
  .find(e=>text(e)===label);
 if(!b)throw Error('U12 not navigable after reload');
 if(innerWidth<=750){
  const menu=document.querySelector<HTMLButtonElement>('.mobile-menu');
  if(!menu)throw Error('Responsive menu missing');menu.click();
  await wait(()=>!!document.querySelector('aside.sidebar.open'),'mobile menu opens');
 }
 b.click();
 await wait(()=>!!document.querySelector('section[aria-label="Foundation Writing FW-U12"]'),'restored U12 UI');
 await click('Practice B','main button');
 await wait(()=>!!document.querySelector('textarea[name="FW-U12-cycleB-draftV1"]'),'U12 restored V1');
 const field=document.querySelector<HTMLTextAreaElement>('textarea[name="FW-U12-cycleB-draftV1"]');
 if(!field?.readOnly||!field.value.includes('I wrote my original independent'))throw Error('Restored V1 is not immutable');
 const overflow=document.documentElement.scrollWidth-innerWidth;
 if(overflow>3)throw Error('Wave4 horizontal overflow '+overflow+'px at '+innerWidth);
 return {phase:'foundationRestore',browserReload:true,actualHomeClient:true,learnerHistoryUnchanged:true,
  savedVersionsRetained:true,originalV1ReadOnly:true,viewport:innerWidth,overflow};
};

(window as any).__SLE_WEEK2_HOME_QA={full,restore,responsive,skillOverview,foundationTwelve,foundationRestore};
