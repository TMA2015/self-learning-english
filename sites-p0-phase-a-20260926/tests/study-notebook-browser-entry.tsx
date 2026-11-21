import React from 'react';
import {createRoot} from 'react-dom/client';
import {ReferenceLibrary} from '../app/reference-library';
import {StudyNotebook} from '../app/study-notebook';
import {loadStudyNotebook,persistStudyNotebook,STUDY_NOTEBOOK_KEY} from '../infrastructure/browser/study-notebook-storage';
import {saveReviewedReference} from '../domain/study-notebook';
import {REFERENCE_ENTRIES} from '../app/reference-library';
import type {Catalog} from '../app/foundation';
const result=document.getElementById('sle-test-result')!;
const root=createRoot(document.getElementById('app')!);
const fail=(message:string)=>{throw Error('STUDY_NOTEBOOK_BROWSER '+message)};
const assert=(value:unknown,message:string)=>{if(!value)fail(message)};
const wait=async(fn:()=>boolean,message:string)=>{
 for(let i=0;i<360;i++){if(fn())return;await new Promise(resolve=>setTimeout(resolve,25))}
 fail('Timeout: '+message+' '+document.getElementById('app')?.textContent?.slice(0,400));
};
const find=(selector:string)=>document.querySelector(selector) as HTMLElement|null;
const clickText=(text:string)=>{
 const b=[...document.querySelectorAll('button')].find(x=>x.textContent?.trim()===text) as HTMLButtonElement|undefined;
 assert(b,'Missing button '+text);b!.click();
};
const setInput=(selector:string,value:string)=>{
 const e=document.querySelector(selector) as HTMLInputElement|HTMLTextAreaElement|null;
 assert(e,'Missing input '+selector);
 const proto=e instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
 Object.getOwnPropertyDescriptor(proto,'value')!.set!.call(e,value);
 e!.dispatchEvent(new Event('input',{bubbles:true}));
};
const approved=new Set(REFERENCE_ENTRIES.map(x=>x.id));
const catalog={
 version:'TEST',imported:true,lessons:[],attempts:[],
 journey:{steps:[],title:'Test'},course:{sequence:[]}
} as unknown as Catalog;
(async()=>{
 document.documentElement.style.width='320px';
 document.body.style.width='320px';document.body.style.margin='0';
 const app=document.getElementById('app')!;app.style.width='320px';
 const old='g-learning:english:v1:academic:packages';
 window.localStorage.setItem(old,'{"immutable":"yes"}');
 const saver=(id:string)=>{
  const current=loadStudyNotebook(window.localStorage);
  const next=saveReviewedReference(current,id,approved);
  if(next!==current)persistStudyNotebook(window.localStorage,next);
 };
 root.render(<ReferenceLibrary catalog={catalog} onCatalog={()=>fail('No catalog fetch')}
  onOpenLesson={()=>fail('No unverified lesson opening')}
  onSaveForReview={saver}/>);
 await wait(()=>!!find('.sle-reference-search-summary')?.textContent?.includes('364 reference entries'),
  'Full approved reference count');
 assert(!!find('.sle-reference-table-scroll tbody .sle-ref-save-card'),'Paginated verb table save control must be available');
 const selectors=document.querySelector('select[aria-label="Reference type"]') as unknown as HTMLSelectElement;
 selectors.value='degree_expressions';selectors.dispatchEvent(new Event('change',{bubbles:true}));
 await wait(()=>!!find('button[aria-label="Save very vs too to review"]'),'New Wave4 card save');
 find('button[aria-label="Save very vs too to review"]')!.click();
 await wait(()=>loadStudyNotebook(window.localStorage).cards.length===1,'Save action persistent on device');
 selectors.value='phrasal_verbs';selectors.dispatchEvent(new Event('change',{bubbles:true}));
 await wait(()=>!!find('button[aria-label="Save look up to review"]'),'Legacy card save');
 find('button[aria-label="Save look up to review"]')!.click();
 await wait(()=>loadStudyNotebook(window.localStorage).cards.length===2,'Different reviewed card persisted');
 assert(window.localStorage.getItem(old)==='{"immutable":"yes"}','Historic learner package key unchanged');
 // Switch to the actual Study Notebook page; it loads persisted independent data.
 root.render(<StudyNotebook key="round1"/>);
 await wait(()=>!!find('[aria-label="Unscored flashcard review"]')?.textContent?.includes('2 saved'),
  'Study Notebook loads exact saved IDs');
 assert(!!find('[aria-label="Selected flashcard"]'),'Flashcard is visible');
 clickText('Reveal explanation');
 await wait(()=>!!find('.study-flashcard-back')?.textContent?.includes('Reviewed example:'),
  'Reveal uses reviewed content rather than invented answers');
 clickText('Again');
 await wait(()=>loadStudyNotebook(window.localStorage).cards[0]?.reviews===1,
  'Again marks review count without academic evidence');
 clickText('My Notes (0)');
 await wait(()=>!!find('textarea[aria-label="Your study note"]'),'Learner note editor');
 setInput('textarea[aria-label="Your study note"]','My own safe example <script>window.injected=true</script>');
 await wait(()=>!![...document.querySelectorAll('button')].find(b=>b.textContent?.trim()==='Save note'&&!b.disabled),
  'Note editor must enable save after text edit');
 clickText('Save note');
 await wait(()=>loadStudyNotebook(window.localStorage).notes.length===1,
  'Learner note actually saved on browser');
 assert(!document.querySelector('.study-note-body script')&&!('injected' in window),
  'React must render user text, never execute it');
 root.render(<StudyNotebook key="round2"/>);
 await wait(()=>!!find('[aria-label="Learner-created study notes"]')===false &&
  [...document.querySelectorAll('button')].some(b=>b.textContent?.trim()==='My Notes (1)'),
  'Reloaded Study Notebook must retain one saved note');
 clickText('My Notes (1)');
 await wait(()=>!!find('.study-note-body')?.textContent?.includes('My own safe example'),
  'Browser reload/remount preserves note text');
 assert(!!find('.study-notebook-info')?.textContent?.includes('not synced between your iPad and desktop'),
  'Cross-device sync must never be promised');
 assert(!!window.localStorage.getItem(STUDY_NOTEBOOK_KEY),'Study Notebook stored in independent key');
 assert(window.localStorage.getItem(old)==='{"immutable":"yes"}','Historical academic data remains unchanged');
 // Regression: removing a saved flashcard must not silently change the linked reference in an existing note.
 clickText('Flashcards (2)');
 await wait(()=>!!find('[aria-label="Selected flashcard"]'),'Return to saved flashcards');
 clickText('Write a note');
 await wait(()=>!!find('textarea[aria-label="Your study note"]'),'Linked note editor');
 const originalLink=document.querySelector('select[aria-label="Note linked reference"]') as unknown as HTMLSelectElement;
 assert(originalLink.value==='REF4-DEG-001','New note should inherit selected vetted reference');
 setInput('textarea[aria-label="Your study note"]','Linked note survives card removal');
 clickText('Save note');
 await wait(()=>loadStudyNotebook(window.localStorage).notes.some(n=>n.text==='Linked note survives card removal'&&n.referenceId==='REF4-DEG-001'),
  'New note linked to saved reference');
 clickText('Flashcards (2)');
 await wait(()=>!!find('[aria-label="Selected flashcard"]'),'Reopen the linked flashcard');
 const originalConfirm=window.confirm;
 window.confirm=()=>true;
 try{clickText('Remove from review')}finally{window.confirm=originalConfirm}
 await wait(()=>loadStudyNotebook(window.localStorage).cards.length===1,
  'Remove flashcard while preserving linked note');
 clickText('My Notes (2)');
 await wait(()=>!![...document.querySelectorAll('.study-note')].find(n=>n.textContent?.includes('Linked note survives card removal')),
  'Linked note survives flashcard removal');
 const linkedRow=[...document.querySelectorAll('.study-note')].find(n=>n.textContent?.includes('Linked note survives card removal'));
 const editButton=[...(linkedRow?.querySelectorAll('button')??[])].find(b=>b.textContent?.trim()==='Edit') as HTMLButtonElement|undefined;
 assert(!!editButton,'Linked note edit action exists');
 editButton!.click();
 const orphanLink=document.querySelector('select[aria-label="Note linked reference"]') as unknown as HTMLSelectElement;
 await wait(()=>orphanLink.value==='REF4-DEG-001'&&
  [...orphanLink.options].some(o=>o.value==='REF4-DEG-001'&&o.textContent?.includes('flashcard removed')),
  'Editor must display the preserved reference after flashcard removal');
 setInput('textarea[aria-label="Your study note"]','Linked note edited after card removal');
 clickText('Save changes');
 await wait(()=>loadStudyNotebook(window.localStorage).notes.some(n=>n.text==='Linked note edited after card removal'&&n.referenceId==='REF4-DEG-001'),
  'Editing the note does not silently unlink its original vetted reference');
 // Both narrow-mobile and tablet layouts: no horizontal overflow of new note editor/actions.
 for(const width of [320,768]){
  document.documentElement.style.width=width+'px';document.body.style.width=width+'px';app.style.width=width+'px';
  await new Promise(r=>setTimeout(r,50));
  for(const selector of ['textarea[aria-label="Your study note"]','.study-note','.study-notebook-tabs']){
   const el=find(selector);assert(el,'Missing '+selector);
   const rect=el!.getBoundingClientRect();
   assert(rect.left>=-2&&rect.right<=width+3,selector+' overflows '+width+'px');
  }
 }
 result.textContent='PASS_STUDY_NOTEBOOK_LOCAL_UI';
})().catch(error=>{result.textContent='FAIL '+String(error)+' '+String((error as Error).stack).slice(0,950)});
