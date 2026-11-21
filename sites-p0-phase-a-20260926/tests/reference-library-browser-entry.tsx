import React from 'react';
import {createRoot} from 'react-dom/client';
import {ReferenceLibrary} from '../app/reference-library';
import type {Catalog} from '../app/foundation';
const phase=new URL(location.href).searchParams.get('phase');
const out=document.getElementById('sle-test-result')!;
const fail=(s:string)=>{throw Error('REFERENCE_BROWSER '+s)};
const report=(s:string)=>out.textContent=s;
const assert=(value:unknown,label:string)=>{if(!value)fail(label)};
const wait=async(fn:()=>boolean,label:string)=>{
 for(let i=0;i<400;i++){
  if(fn())return;
  await new Promise(r=>setTimeout(r,25));
 }
 fail('Timeout '+label+' / '+document.getElementById('app')?.innerText.slice(0,350));
};
const select=(label:string,value:string)=>{
 const e=document.querySelector('select[aria-label="'+label+'"]') as HTMLSelectElement|null;
 assert(e,'Missing selector '+label);
 e!.value=value;e!.dispatchEvent(new Event('change',{bubbles:true}));
};
const search=(value:string)=>{
 const e=document.querySelector('input[aria-label="Search reference entries"]') as HTMLInputElement|null;
 assert(e,'Missing search');
 const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!;
 setter.call(e,value);e!.dispatchEvent(new Event('input',{bubbles:true}));
};
const getCount=()=>{
 const status=document.querySelector('.sle-reference-search-summary [role="status"]')
  ??document.querySelector('.sle-reference-search-summary');
 return status?.textContent??'';
};
const catalog={
 version:'TEST',imported:phase!=='missing',
 lessons:[
  {id:'GRA-A1-01',title:'Grammar practice',module:'grammar',cefr:'A1',minutes:18},
  {id:'VOC-A2-03',title:'Vocabulary practice',module:'vocabulary',cefr:'A2',minutes:20}
 ],attempts:[],journey:{steps:[],title:'Test'},course:{sequence:[]}
} as unknown as Catalog;
let selection='';
(async()=>{
 createRoot(document.getElementById('app')!).render(
  <ReferenceLibrary catalog={catalog} onCatalog={()=>fail('Unnecessary catalog fetch')}
   onOpenLesson={(id,skill)=>{selection=id+' '+skill;report('PASS_LINK '+selection)}}/>
 );
 await wait(()=>getCount().includes('364 reference entries'),'329 preserved references +35 independently reviewed Wave4 cards');
 assert(document.querySelectorAll('.sle-reference-table-scroll tbody tr').length===25,'191 reviewed verbs paginated 25 per page');
 assert(document.querySelectorAll('.sle-reference-card').length===20,'20 phrase/strategy cards');
 assert(!!document.querySelector('input[type="search"]'),'search is native search input');
 assert(document.querySelectorAll('.sle-reference-category-filter').length===18,
  'Seventeen text-labelled category buttons plus All');
 if(phase==='search'){
  const badge=(kind:string)=>document.querySelector('.sle-reference-category-filter.is-'+kind) as HTMLButtonElement|null;
  assert(!!badge('idioms'),'Idioms category exists');
  badge('idioms')!.click();
  await wait(()=>badge('idioms')?.getAttribute('aria-pressed')==='true','category selected');
  assert(badge('phrasal_verbs')?.getAttribute('aria-pressed')==='false','other category not selected');
  await wait(()=>getCount().includes('8 reference entries'),'three original idioms plus five new reviewed idioms');
  search('ice');
  await wait(()=>getCount().includes('1 reference entry'),'term search');
  assert(document.getElementById('app')?.textContent?.includes('break the ice'),'expected idiom shown');
  badge('phrasal_verbs')!.click();
  await wait(()=>badge('phrasal_verbs')?.getAttribute('aria-pressed')==='true','other category selected');
  search('DECLINE');
  await wait(()=>getCount().includes('1 reference entry'),'local synonym indexed');
  assert(document.getElementById('app')?.textContent?.includes('turn down'),'decline finds turn down');
  select('Reference type','idioms');
  await wait(()=>getCount().includes('0 reference entries'),'synonym respects category filter');
  search('this-never-matches-any-entry');
  await wait(()=>document.getElementById('app')?.textContent?.includes('No matching entries')??false,'honest empty state');
  const clear=[...document.querySelectorAll('button')].find(x=>x.textContent?.includes('Clear filters'));
  clear?.click();
  await wait(()=>getCount().includes('364 reference entries'),'clear filters');
  report('PASS_SEARCH_FILTERS');
 }else if(phase==='v2'){
  select('Reference type','writing_connectors');
  await wait(()=>getCount().includes('42 reference entries'),'12 Wave1 + 30 approved Wave2 connectors');
  assert(document.querySelectorAll('.sle-ref-connector-card').length===42,'42 reviewed connector cards');
  search('furthermore');
  await wait(()=>document.querySelector('.sle-ref-connector-card h4')?.textContent==='furthermore',
   'Wave2 furthermore exact search and rendering');
  assert(document.querySelector('.sle-ref-connector-card')?.textContent?.includes('Adds another important supporting point'),
   'Wave2 individually reviewed purpose is shown');
  search('nevertheless');
  await wait(()=>document.querySelector('.sle-ref-connector-card h4')?.textContent==='nevertheless',
   'Wave2 concession label searchable');
  search('because');
  await wait(()=>document.querySelector('.sle-ref-connector-card h4')?.textContent==='because','exact because ranked first across related matches');
  assert(document.querySelector('.sle-ref-connector-card h4')?.textContent==='because',
   'Exact connector match should rank before because of');
  search('despite');
  await wait(()=>document.querySelector('.sle-ref-connector-card h4')?.textContent==='despite',
   'despite rule visible before indirect mentions');
  assert(document.getElementById('app')?.textContent?.includes('noun phrase / -ing phrase'),
   'despite must require noun/-ing construction');
  search('');select('Reference type','frequency_expressions');
  await wait(()=>getCount().includes('11 reference entries'),'eleven reviewed frequency expressions');
  assert(document.querySelectorAll('.sle-ref-frequency-item').length===8,'qualitative ladder eight');
  assert(document.querySelectorAll('.sle-ref-counted-frequency .sle-ref-connector-card').length===3,
   'three counted/interval expressions separate from ladder');
  const freqRegion=document.querySelector('[aria-label="Frequency expressions"]');
  assert(!!freqRegion,'frequency section rendered');
  assert(freqRegion!.querySelectorAll('progress,meter,[data-fixed-percentage]').length===0,
   'No invented numerical percentage chart');
  assert(freqRegion!.textContent?.includes('not fixed numerical percentages'),
   'Teach why an indefinite adverb cannot be assigned fixed percentages');
  search('usually');
  await wait(()=>document.querySelector('.sle-ref-frequency-item strong')?.textContent==='usually',
   'search adverb + position guidance');
  search('did');select('Reference type','irregular_verbs');
  await wait(()=>document.querySelector('.sle-reference-table-scroll tbody th')?.textContent==='do',
   'search by historical V2 form did');
  search('abode');
  await wait(()=>document.querySelector('.sle-reference-table-scroll tbody th')?.textContent==='abide',
   'abode matches abide');
  const verbCell=document.querySelector('.sle-reference-table-scroll tbody td:last-child') as HTMLElement|null;
  assert(verbCell?.textContent?.includes('Meaning:')&&verbCell?.textContent?.includes('continue or tolerate'),
   'Each row must show individual meaning');
  assert(verbCell?.textContent?.includes('They abided by the agreement.'),
   'Keep original reviewed contextual example');
  assert(!verbCell?.textContent?.includes('Past simple is used for a finished past action;'),
   'Hide repetitive generic boilerplate without changing approved JSON');
  assert(document.querySelectorAll('.sle-reference-table-scroll .sle-reference-practice').length===0,
   'Do not link unrelated Grammar A1-01 from irregular verb rows');
  search('gotten');
  await wait(()=>document.querySelector('.sle-reference-table-scroll tbody th')?.textContent==='get',
   'American participle gotten finds get');
  search('learnt');
  await wait(()=>document.querySelector('.sle-reference-table-scroll tbody th')?.textContent==='learn',
   'British variant learnt finds learn');
  search('');
  await wait(()=>document.querySelectorAll('.sle-reference-table-scroll tbody tr').length===25,
   'reset to first page of 191 verbs');
  const pag=document.querySelector('[aria-label="Irregular verb pages"]') as HTMLElement|null;
  assert(!!pag,'191 verbs require page navigation');
  const next=[...pag!.querySelectorAll('button')].find(b=>b.textContent?.includes('Next'));
  assert(!!next,'Next page button must exist');
  next!.click();
  await wait(()=>pag!.textContent?.includes('Page 2 / 8')??false,'25-row paging moves to page 2');
  const w=[...document.querySelectorAll('[aria-label="Filter irregular verbs by initial letter"] button')]
   .find(b=>b.textContent==='W') as HTMLButtonElement|undefined;
  assert(!!w,'A–Z letter W available');w!.click();
  await wait(()=>w!.getAttribute('aria-pressed')==='true','A–Z letter selection');
  assert([...document.querySelectorAll('.sle-reference-table-scroll tbody th')]
   .every(th=>th.textContent?.toLowerCase().startsWith('w')),'W filter must show W verbs');
  report('PASS_V2_REVIEWED_REFERENCE_191');
 }else if(phase==='wave2'){
  select('Reference type','grammar_comparisons');
  await wait(()=>getCount().includes('20 reference entries'),'20 NotebookLM-reviewed Grammar comparisons');
  assert(document.querySelectorAll('[aria-label="Grammar comparison references"] .sle-ref-wave2-card').length===20,
   '20 independent Grammar cards visible');
  assert((document.querySelector('[aria-label="Grammar comparison references"]')?.textContent??'')
   .includes('Watch out / limits:'),'Each Grammar card explains exceptions, not only a tense label');
  search('has been reading');
  await wait(()=>getCount().includes('1 reference entry'),'search grammar explanation and example');
  assert(document.querySelector('[aria-label="Grammar comparison references"] h3')?.textContent==='Present perfect simple vs continuous',
   'has been reading must find the relevant Grammar comparison');
  assert(document.querySelectorAll('[aria-label="Grammar comparison references"] .sle-reference-practice').length===0,
   'NO_TOPIC_LINKS_AUTHORIZED for Grammar');
  search('');
  select('Suggested level','A1');
  await wait(()=>document.querySelector('[aria-label="Grammar comparison references"]')?.textContent?.includes('Present simple vs present continuous')??false,
   'suggested range A1–A2 should include the A1 filter');
  select('Suggested level','all');
  select('Reference type','writing_toolkit');
  await wait(()=>getCount().includes('10 reference entries'),'10 NotebookLM-reviewed Writing Toolkit guides');
  assert(document.querySelectorAll('[aria-label="Writing Toolkit reference"] .sle-ref-wave2-card').length===10,
   '10 specialized Writing process cards visible');
  search('paraphrase');
  await wait(()=>getCount().includes('1 reference entry'),'writing toolkit search');
  assert(document.querySelector('[aria-label="Writing Toolkit reference"] h3')?.textContent==='Paraphrase without changing the claim',
   'Paraphrase tool findable');
  const toolkit=document.querySelector('[aria-label="Writing Toolkit reference"]');
  assert(toolkit?.textContent?.includes('Ask yourself:')&&toolkit?.textContent?.includes('Avoid / limits:'),
   'Writing Toolkit must display an independent self-check and caution');
  assert(toolkit?.querySelectorAll('.sle-reference-practice,button').length===0,
   'NO_TOPIC_LINKS_AUTHORIZED; no learner scoring or lesson action in Writing Toolkit');
  search('');
  select('Reference type','all');
  await wait(()=>getCount().includes('364 reference entries'),'reset wave2 filters without losing legacy items');
  report('PASS_W2_GRAMMAR_WRITING_30');
 }else if(phase==='wave3'){
  select('Reference type','phrasal_verbs');
  await wait(()=>getCount().includes('9 reference entries'),'four original + five new phrasal verbs');
  search('put it off');
  await wait(()=>getCount().includes('1 reference entry'),'search separability pattern, not only headword');
  assert(document.querySelector('[aria-label="Wave 3 Phrasal verbs"] .sle-ref-wave3-card h4')?.textContent==='put off',
   'Phrasal separable pronoun pattern searchable');
  search('');
  select('Reference type','collocations');
  await wait(()=>getCount().includes('10 reference entries'),'five original + five new collocations');
  assert(document.querySelectorAll('[aria-label="Wave 3 Collocations"] .sle-ref-wave3-card').length===5,
   'five new collocations retain specialist procedures');
  search('');
  select('Reference type','word_families');
  await wait(()=>getCount().includes('5 reference entries'),'five word-family cards');
  search('explain me the rule');
  await wait(()=>getCount().includes('1 reference entry'),'search word-family usage warning');
  assert(document.querySelector('[aria-label="Wave 3 Word families"] h4')?.textContent==='explain / explanation / explanatory',
   'Wrong syntax finds the correct teaching card');
  search('');
  select('Reference type','confusable_words');
  await wait(()=>getCount().includes('5 reference entries'),'five confusable-word cards');
  search('actually currently');
  await wait(()=>getCount().includes('1 reference entry'),'false-friend pair searchable');
  search('');
  select('Reference type','idioms');
  await wait(()=>getCount().includes('8 reference entries'),'legacy and new idioms remain together');
  search('');
  select('Reference type','reading_strategies');
  await wait(()=>getCount().includes('10 reference entries'),'five Wave3 +five Wave4 reading strategies');
  assert(document.querySelectorAll('[aria-label="Wave 3 Reading strategies"] .sle-ref-wave3-card').length===5,
   'reading strategies rendered as independent teaching cards');
  search('');
  select('Reference type','listening_strategies');
  await wait(()=>getCount().includes('10 reference entries'),'five Wave3 +five Wave4 listening strategies');
  const region=document.querySelector('[aria-label="Wave 3 Listening strategies"]');
  assert(region?.textContent?.includes('UNASSESSED')??false,
   'Missing audio requires UNASSESSED, not a guessed score');
  assert(region?.querySelectorAll('audio,video,button,.sle-reference-practice').length===0,
   'Static Listening cards must not expose player/transcript controls or unverified lessons');
  search('transcript after submit');
  await wait(()=>getCount().includes('1 reference entry'),'transcript safety search');
  assert(document.querySelector('[aria-label="Wave 3 Listening strategies"] h4')?.textContent?.includes('transcripts only when allowed'),
   'Exact reviewed Listening caution found');
  search('');
  select('Suggested level','A1');
  await wait(()=>getCount().includes('2 reference entries'),'A1–A2 navigation includes two gist/purpose guides');
  select('Suggested level','all');
  select('Reference type','all');
  await wait(()=>getCount().includes('364 reference entries'),'return all 329 reviewed entries');
  assert(document.querySelectorAll('.sle-ref-wave3-card').length===35,'35 new cards rendered without duplication');
  assert(document.querySelectorAll('.sle-reference-card').length===20,'20 original pilot non-verb cards unchanged');
  report('PASS_W3_CROSS_SKILL_35');
 }else if(phase==='wave4'){
  select('Reference type','degree_expressions');
  await wait(()=>getCount().includes('10 reference entries'),'10 reviewed intensity/degree cards');
  assert(document.querySelectorAll('[aria-label="Wave 4 Degree & intensity"] .sle-ref-wave4-card').length===10,
   'Degree entries separate from 11 frequency expressions');
  search('too heavy');
  await wait(()=>getCount().includes('1 reference entry'),'Find contextual very vs too distinction');
  assert(document.querySelector('[aria-label="Wave 4 Degree & intensity"] h4')?.textContent==='very vs too',
   'Very vs too should appear with original caution');
  search('');select('Reference type','preposition_patterns');
  await wait(()=>getCount().includes('10 reference entries'),'10 preposition and complement patterns');
  search('look forward to meeting');
  await wait(()=>getCount().includes('1 reference entry'),'Search preposition + gerund explanation');
  assert(document.querySelector('[aria-label="Wave 4 Preposition patterns"] h4')?.textContent==='look forward to + -ing vs want to + verb',
   'Preposition to vs infinitive to is distinct');
  search('');select('Reference type','writing_functions');
  await wait(()=>getCount().includes('5 reference entries'),'5 functional writing moves');
  search('hedging');
  await wait(()=>getCount().includes('1 reference entry'),'Find responsible hedging');
  assert(document.querySelector('[aria-label="Wave 4 Writing functions"] h4')?.textContent==='qualify a claim responsibly',
   'Writing register and claim integrity card should be searchable');
  search('');select('Reference type','reading_strategies');
  await wait(()=>getCount().includes('10 reference entries'),'old 5 +new 5 Reading strategies');
  assert(document.querySelectorAll('[aria-label="Wave 3 Reading strategies"] .sle-ref-wave3-card').length===5 &&
   document.querySelectorAll('[aria-label="Wave 4 Reading strategies"] .sle-ref-wave4-card').length===5,
   'Reused Reading category combines, does not overwrite');
  search('');select('Reference type','listening_strategies');
  await wait(()=>getCount().includes('10 reference entries'),'old 5 +new 5 Listening strategies');
  const listening=document.querySelector('[aria-label="Wave 4 Listening strategies"]');
  assert(listening?.querySelectorAll('.sle-ref-wave4-card').length===5,'Five new Listening references');
  assert(listening?.querySelectorAll('audio,video,button,.sle-reference-practice').length===0,
   'No listening test key/audio/player or unverified topic links');
  assert(listening?.textContent?.includes('Watch out / limits:'),
   'Listening reference retains original safety warning');
  search('at least at most');
  await wait(()=>getCount().includes('1 reference entry'),'Find spoken approximate amount limits');
  assert(document.querySelector('[aria-label="Wave 4 Listening strategies"] h4')?.textContent==='interpret approximate amounts and limits',
   'Numbers/limits strategy searchable');
  search('');select('Suggested level','A1');
  await wait(()=>getCount().includes('2 reference entries'),'Original A1–A2 strategy navigation unchanged');
  select('Suggested level','all');select('Reference type','all');
  await wait(()=>getCount().includes('364 reference entries'),'Reset to 364 total references');
  assert(document.querySelectorAll('.sle-ref-wave4-card').length===35,'Exactly 35 new cards');
  assert(document.querySelectorAll('.sle-ref-wave3-card').length===35,'Wave3 cards unchanged');
  assert(document.querySelectorAll('.sle-reference-card').length===20,'Pilot cards unchanged');
  report('PASS_W4_DEGREE_USAGE_35');
 }else if(phase==='catalog'){
  assert(document.querySelectorAll('.sle-reference-table-scroll .sle-reference-practice button').length===0,
   'Irregular verbs must not link to unrelated first Grammar lesson');
  assert(document.querySelectorAll('.sle-ref-connector-card .sle-reference-practice button').length===0,
   'Writing connectors must not link to unrelated first Writing lesson');
  select('Reference type','collocations');
  await wait(()=>getCount().includes('10 reference entries'),'five immutable + five new collocations');
  const first=document.querySelector('.sle-reference-card .sle-reference-practice button') as HTMLButtonElement|null;
  assert(first,'retain legacy skill practice link for pilot collocation cards');
  first!.click();
  await wait(()=>selection==='VOC-A2-03 vocabulary','legacy catalog-grounded callback');
  assert(!document.getElementById('app')?.textContent?.includes('CEFR certification awarded'),'no fake badge');
  report('PASS_CATALOG_LINK');
 }else if(phase==='missing'){
  assert(document.querySelectorAll('.sle-reference-practice button').length===0,'no false links on missing catalog');
  assert((document.getElementById('app')?.textContent??'').includes('not imported on this device'),'clear missing catalog reason');
  report('PASS_MISSING_CATALOG');
 }else fail('unknown phase');
})().catch(e=>report('FAIL '+String(e)+' '+String((e as Error).stack).slice(0,800)));
