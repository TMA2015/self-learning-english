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
/** Shared integrated navigation: the legacy 12-week Home entry has been retired. */
const navTo=async(label:string)=>{
 if(innerWidth<=750){
  const menu=document.querySelector<HTMLButtonElement>('.mobile-menu');
  if(!menu)throw Error('Mobile menu missing');
  if(!document.querySelector('aside.sidebar.open'))menu.click();
  await wait(()=>!!document.querySelector('aside.sidebar.open'),'mobile menu opens');
 }
 await click(label,'nav[aria-label="Main navigation"] button.nav-item');
 if(innerWidth<=750)await wait(()=>!document.querySelector('aside.sidebar.open'),'mobile menu closes');
};
const atCourse=()=>text(document.querySelector('main .page-heading h1'))==='Foundation Writing'&&
 document.querySelectorAll('.curriculum-grid[aria-label="Foundation Writing course units"] .week-card').length===12;
const goCourse=async()=>{
 await wait(()=>text(document.querySelector('.save-status')).includes('Saved on this device'),'local runtime');
 await navTo('My Courses');
 await wait(()=>!!document.querySelector('section[aria-label="Foundation Writing course"]'),'dedicated Foundation Writing course card');
 await click('Continue','section[aria-label="Foundation Writing course"] button');
 await wait(atCourse,'Foundation Writing 12-unit course overview');
};
const write=async(e:HTMLTextAreaElement,value:string)=>{
 Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')?.set?.call(e,value);
 e.dispatchEvent(new Event('input',{bubbles:true}));await pause(180);
};
const full=async()=>{
 await wait(()=>text(document.querySelector('.save-status')).includes('Saved on this device'),'browser storage');
 await navTo('Writing');
 await wait(()=>text(document.querySelector('.page-heading h1'))==='Writing','Writing overview preserved');
 const buttons=[...document.querySelectorAll<HTMLButtonElement>('.foundation-writing-action button')].map(text);
 if(!buttons.includes('Writing Studio')||!buttons.includes('Foundation Writing'))
  throw Error('Writing overview does not retain both owner-approved CTAs');
 if(!text(document.querySelector('.foundation-today')).includes('What should I study today?'))
  throw Error('Existing Writing recommendations missing');
 await click('Foundation Writing','.foundation-writing-action button');
 await wait(atCourse,'Writing path opens Foundation course overview');
 await click('Open Unit 01','main button');
 await wait(()=>!!document.querySelector('section[aria-label="Foundation Writing Unit 01"]'),'real U01 opens');
 await click('Back to Foundation Writing','main button');
 await wait(atCourse,'return to same course overview from U01');
 await goCourse();
 if(!text(document.querySelector('main')).includes('0/12 units with saved work'))
  throw Error('Foundation course must not infer progress from old Week 1 flags');
 return {phase:'full',viewport:innerWidth,checks:['Writing page intact','two Writing CTAs',
  'Writing → Foundation overview','real U01','unit back to overview','My Courses → same overview',
  'legacy flags excluded'],overflow:document.documentElement.scrollWidth-innerWidth};
};
const restore=async()=>{
 await goCourse();
 if(!document.querySelector('section[aria-label="Foundation Writing course progress"]'))
  throw Error('Course progress panel missing after reload');
 await click('Open Unit 02','main button');
 await wait(()=>!!document.querySelector('section[aria-label="Foundation Writing FW-U02"]'),'U02 opens after reload');
 await click('Back to Foundation Writing','main button');
 await wait(atCourse,'course overview restored after navigating U02');
 return {phase:'restore',viewport:innerWidth,checks:['My Courses selection after reload',
  '12-unit overview','real U02','unit back to overview']};
};
const responsive=async()=>{
 await goCourse();
 const overflow=document.documentElement.scrollWidth-innerWidth;
 if(overflow>3)throw Error('course overview horizontal overflow '+overflow+' at '+innerWidth);
 for(const el of document.querySelectorAll<HTMLElement>('.curriculum-grid button')){
  const r=el.getBoundingClientRect();
  if(r.width&&r.height&&(r.right>innerWidth+3||r.left<0))
   throw Error('offscreen Foundation Unit control '+text(el)+' at '+innerWidth);
 }
 return {phase:'responsive',viewport:innerWidth,checks:['12-unit course on real Home viewport',
  'no offscreen buttons'],overflow};
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
 if(!direct||text(direct)!=='Writing Studio')
  throw Error('Writing independent feedback entry missing');
 direct.click();
 await wait(()=>!!document.querySelector('textarea[name="student-written-content"]'),'Writing Any Topic opened');
 await nav('AI Tutor');
 await wait(()=>text(document.querySelector('.page-heading h1'))==='AI Tutor','AI Tutor overview');
 const tutorButton=[...document.querySelectorAll<HTMLButtonElement>('.platform-intro button')]
  .find(button=>text(button)==='Open Writing Studio');
 if(!tutorButton)throw Error('AI Tutor independent Writing feedback CTA missing');
 tutorButton.click();
 await wait(()=>!!document.querySelector('textarea[name="student-written-content"]'),'AI Tutor links to Any Topic');
 await nav('My Courses');
 await wait(()=>!!document.querySelector('section[aria-label="Foundation Writing course"]'),
  'Foundation Writing replaces old My Courses course');
 return {phase:'skillOverview',viewport:innerWidth,skillCounts:expected,
  sevenTabsAboveTitle:true,browseUnitsPreserved:true,
  writingAnyTopic:true,tutorAnyTopic:true,foundationWritingCourse:true,
  mobileMenuCovered:isMobile,overflow:document.documentElement.scrollWidth-innerWidth};
};


/** Real integrated HomeClient Foundation Writing 12-Unit source, save, revision, reload regression. */
const foundationTwelve=async()=>{
 await goCourse();
 const navigateUnit=async(id:'10'|'11'|'12')=>{
  if(!atCourse()){
   await click('Back to Foundation Writing','main button');
   await wait(atCourse,'previous unit returns to course overview');
  }
  await click('Open Unit '+id,'main button');
  try{
   await wait(()=>!!document.querySelector('section[aria-label="Foundation Writing FW-U'+id+'"]'),'U'+id+' source-backed screen');
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
 await click('Back to Foundation Writing','main button');
 await wait(atCourse,'all three Wave4 units return to same course overview');
 await wait(()=>text(document.querySelector('section[aria-label="Foundation Writing course progress"]')).includes('3/12 units with saved work'),
  'real saved Wave4 versions projected into Foundation course progress');
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
 await goCourse();
 await click('Open Unit 12','main button');
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
