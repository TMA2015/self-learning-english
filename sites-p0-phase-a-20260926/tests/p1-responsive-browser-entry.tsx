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
  check(categories.length===18,'17 stable category kinds (six pilot + eleven extensions) plus all');
  check(Math.ceil(cssBox(root).right)<=width+2,'Reference root extends beyond fixed '+width+'px container');
  check(Math.ceil(cssBox(table).right)<=width+2,'Table scroll region escapes '+width+'px container');
  const tableElement=table.querySelector('table')!;
  const needsScroll=tableElement.getBoundingClientRect().width>table.clientWidth+2;
  if(needsScroll){
   check(table.scrollWidth>table.clientWidth,
    'Wide verb table must overflow INSIDE its region');
   table.scrollLeft=80;
   check(table.scrollLeft>0,'Narrow verb table must be horizontally scrollable');
  }else{
   check(tableElement.getBoundingClientRect().right<=table.getBoundingClientRect().right+2,
    'Wide-layout table should fit without forced scrolling');
  }
  if(width===320)check(needsScroll,'320px content must allow table scrolling');
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
  const waveTwoCards=[...document.querySelectorAll('.sle-ref-wave2-card:not(.sle-ref-wave3-card):not(.sle-ref-wave4-card)')];
  check(waveTwoCards.length===30,'20 Grammar and 10 Writing reference cards must render');
  for(const card of waveTwoCards){
   const rect=cssBox(card);
   check(rect.left>=-2&&rect.right<=width+2,'Grammar/Writing card overflows '+width+'px layout');
   check(rect.width>=Math.min(width-44,280),
    'Grammar/Writing card must remain readable at 320px and in iPad two-column layout');
  }
  const waveThreeCards=[...document.querySelectorAll('.sle-ref-wave3-card')];
  check(waveThreeCards.length===35,'35 new cross-skill cards must render');
  for(const card of waveThreeCards){
   const rect=cssBox(card);
   check(rect.left>=-2&&rect.right<=width+2,'Cross-skill card exceeds '+width+'px');
   check(rect.width>=Math.min(width-44,280),'Cross-skill card too narrow for reading on '+width+'px');
  }
  const waveFourCards=[...document.querySelectorAll('.sle-ref-wave4-card')];
  check(waveFourCards.length===35,'35 new Wave4 teaching cards must render');
  for(const card of waveFourCards){
   const rect=cssBox(card);
   check(rect.left>=-2&&rect.right<=width+2,'Wave4 reference card overflows '+width+'px');
   check(rect.width>=Math.min(width-44,280),'Wave4 reference card too narrow on '+width+'px');
  }
  const result={type:'reference',layoutWidth:width,actualViewport:window.innerWidth,
   tableScrollNeeded:needsScroll,categories:categories.length,visibleCards:cards.length,
   waveTwoCards:waveTwoCards.length,waveThreeCards:waveThreeCards.length,waveFourCards:waveFourCards.length};
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
