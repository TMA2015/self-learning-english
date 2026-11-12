import React from 'react';
import {createRoot} from 'react-dom/client';
import {ReferenceLibrary} from '../app/reference-library';
import {AnyTopicWritingReview} from '../app/any-topic-writing-review';
import type {Catalog} from '../app/foundation';
const params=new URL(location.href).searchParams;
const width=Number(params.get('width')??320);
const mode=params.get('mode');
const status=document.getElementById('sle-test-result')!;
const fail=(s:string):never=>{throw Error('P1_RESPONSIVE '+s)};
const check=(yes:unknown,s:string)=>{if(!yes)fail(s)};
const wait=async(fn:()=>boolean,s:string)=>{
 for(let i=0;i<240;i++){if(fn())return;await new Promise(r=>setTimeout(r,35))}
 fail('timeout '+s);
};
const cssBox=(e:Element)=>e.getBoundingClientRect();
(async()=>{
 check([320,768].includes(width),'unexpected width');
 document.documentElement.style.width=width+'px';
 document.body.style.width=width+'px';
 document.body.style.margin='0';
 const app=document.getElementById('app')!;
 app.style.width=width+'px';
 const catalog={version:'TEST',imported:true,
 lessons:[{id:'GRA-A1-01',title:'Grammar practice',module:'grammar',cefr:'A1',minutes:10}],
 attempts:[],journey:{steps:[],title:'Test'},course:{sequence:[]}} as unknown as Catalog;
 if(mode==='reference'){
  createRoot(app).render(<ReferenceLibrary catalog={catalog}
   onCatalog={()=>fail('unexpected API request')}
   onOpenLesson={()=>{}}/>);
  await wait(()=>!!document.querySelector('.sle-reference-table-scroll'),'Reference mounted');
  const root=document.querySelector('.sle-reference')!,table=document.querySelector('.sle-reference-table-scroll') as HTMLElement;
  const categories=[...document.querySelectorAll('.sle-reference-category-filter')] as HTMLButtonElement[];
  check(categories.length===7,'6 categories plus all');
  check(Math.ceil(cssBox(root).right)<=width+2,'Reference root extends beyond fixed '+width+'px container');
  check(Math.ceil(cssBox(table).right)<=width+2,'Table scroll region escapes '+width+'px container');
  check(table.scrollWidth>table.clientWidth,'Wide verb table must overflow INSIDE its region');
  table.scrollLeft=80;
  check(table.scrollLeft>0,'Verb table must be horizontally scrollable');
  for(const category of categories){
   const rect=cssBox(category);
   check(rect.width>42&&rect.height>=40,'Category touch target too small: '+category.textContent);
   check(rect.right<=width+2,'Category chip overflows page: '+category.textContent);
   check(!!category.textContent?.trim(),'Color cannot be the only category marker');
  }
  const filter=document.querySelector('input[type="search"]') as HTMLInputElement;
  check(!!filter&&cssBox(filter).right<=width+2,'Search field fits view');
  const cards=[...document.querySelectorAll('.sle-reference-card')];
  check(cards.length===20,'Static cards available at narrow width');
  for(const card of cards)check(cssBox(card).right<=width+2,'Card overflows '+width+'px layout');
  const result={type:'reference',layoutWidth:width,actualViewport:window.innerWidth,
   internalTableScroll:true,categories:categories.length,visibleCards:cards.length};
  status.textContent='PASS_RESPONSIVE '+JSON.stringify(result);
 }else if(mode==='writing'){
  createRoot(app).render(<AnyTopicWritingReview/>);
  await wait(()=>!!document.querySelector('textarea[name="student-written-content"]'),
    'Writing shell mounted');
  const panel=document.querySelector('.any-topic-writing-review')!;
  check(cssBox(panel).right<=width+2,'Writing panel overflows '+width+'px layout');
  for(const field of document.querySelectorAll('.any-topic-writing-review textarea')){
   check(cssBox(field).right<=width+2,'Writing textarea overflows '+width+'px layout');
   check(cssBox(field).width>width*.6,'Writing textarea too narrow for use');
  }
  const buttons=[...document.querySelectorAll('.any-topic-writing-review button')] as HTMLButtonElement[];
  check(buttons.length>=3,'Save, clear and review actions should be available');
  for(const button of buttons)check(cssBox(button).right<=width+2,
   'Writing action extends beyond '+width+'px layout: '+button.textContent);
  check(!!panel.textContent?.includes('shared computer'),'Shared-browser warning must remain visible');
  status.textContent='PASS_RESPONSIVE '+JSON.stringify({
   type:'writing',layoutWidth:width,actualViewport:window.innerWidth,
   formsReadable:true,sharedDeviceNotice:true,realIPadSafari:'NOT_TESTED'});
 }else fail('unknown mode '+mode);
})().catch(e=>{status.textContent='FAIL '+String(e)+' '+String((e as Error).stack).slice(0,1100)});
