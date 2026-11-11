'use strict';
/**
 * Reference Library pilot academic/source/UX contract, not a pedagogy verdict.
 * No real learner data, media, new scoring or curriculum package mutation.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const root=path.resolve(__dirname,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const raw=JSON.parse(read('content/reference-library-pilot-v1.json'));
const packet=read('notebooklm/SLE_REFERENCE_LIBRARY_PILOT_R1_20261112.md');
assert(packet.includes('## Item-by-item human-readable academic review source'),
 'NotebookLM packet must be human-readable Markdown, not a raw JSON source');
assert(!packet.includes('BEGIN_REFERENCE_LIBRARY_JSON')&&!packet.includes('"""json'),
 'Do not submit machine-only JSON as NotebookLM source');
assert.equal(raw.review_status,'NOTEBOOKLM_REVIEW_PENDING','No false academic PASS claim');
assert.equal(raw.entries.length,26,'Keep bounded pilot before substantive content review');
const kinds={irregular_verbs:6,collocations:5,phrasal_verbs:4,idioms:3,
 common_mistakes:4,learning_tips:4};
assert.equal(new Set(raw.entries.map(e=>e.id)).size,raw.entries.length,'Unique IDs required');
for(const [kind,n] of Object.entries(kinds))
 assert.equal(raw.entries.filter(e=>e.kind===kind).length,n,'Wrong count for '+kind);
for(const e of raw.entries){
 const header='### '+e.id+' — '+e.term;
 const index=packet.indexOf(header);
 assert(index>=0&&packet.indexOf(header,index+header.length)<0,
  e.id+' must appear exactly once in human-readable review packet');
 const next=packet.indexOf('\n### ',index+header.length);
 const body=packet.slice(index,next>=0?next:packet.indexOf('## Independent academic audit questions',index));
 const fields=[
  ['Category',e.kind],['Suggested learning level',e.level],
  ['Register',e.register],['Related skill',e.skill],
  ['Meaning or strategy',e.meaning],['Original example',e.example],
  ['Usage note',e.note],
 ];
 if(e.forms)fields.push(['Irregular forms',
  'base='+e.forms.base+'; past='+e.forms.past+'; past participle='+e.forms.participle]);
 for(const [label,value] of fields)
  assert(body.includes('- **'+label+':** '+value),
   e.id+' review mirror does not match the machine source: '+label);
 assert(/^REF-(IRR|COL|PHR|IDI|MIS|TIP)-\d{2}$/.test(e.id),e.id+' must be stable');
 for(const k of ['term','meaning','example','note','register','skill','level'])
  assert(typeof e[k]==='string'&&e[k].trim().length>1,e.id+' missing '+k);
 assert(['A1','A2','B1','B2','C1','C2'].includes(e.level));
 assert(['neutral','informal','formal'].includes(e.register));
 assert(['grammar','vocabulary','reading','writing'].includes(e.skill));
 if(e.kind==='irregular_verbs'){
  assert(e.forms&&e.forms.base===e.term&&e.forms.past&&e.forms.participle,
   e.id+' must contain all three verb forms');
 }else assert.equal(e.forms,undefined,e.id+' cannot masquerade as an irregular verb');
 assert(!('answer' in e)&&!('correct_option_id' in e)&&!('evidence_weight' in e),
  'Static lookup may not include live assessment score/answer');
}
const tsSource=read('domain/reference-library.ts');
const code=ts.transpileModule(tsSource,{compilerOptions:{
 module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const out=path.join(root,'.sites-runtime/reference-library-selector.cjs');
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,code);
const {filterReferenceEntries,availableRelatedLessons,REFERENCE_KINDS}=require(out);
assert.equal(REFERENCE_KINDS.length,6);
const base={query:'',kind:'all',level:'all',register:'all'};
assert.equal(filterReferenceEntries(raw.entries,base).length,26);
assert.deepEqual(filterReferenceEntries(raw.entries,{...base,query:'HAVE  WRITTEN'}).map(e=>e.id),
 ['REF-IRR-04'],'Token-AND and case-insensitive search');
assert.equal(filterReferenceEntries(raw.entries,{...base,kind:'idioms'}).length,3);
assert.deepEqual(filterReferenceEntries(raw.entries,{...base,level:'B2'}).map(x=>x.id),
 ['REF-IDI-03']);
assert.deepEqual(filterReferenceEntries(raw.entries,{...base,kind:'irregular_verbs',level:'A2'}).map(x=>x.id),
 ['REF-IRR-03','REF-IRR-04','REF-IRR-05']);
assert.deepEqual(filterReferenceEntries(raw.entries,{...base,register:'informal'}).map(x=>x.id),
 ['REF-IDI-01','REF-IDI-02']);
assert.deepEqual(filterReferenceEntries(raw.entries,{...base,query:'this-phrase-is-not-here'}),[]);
const frozen=JSON.stringify(raw);
const catalog=[{id:'VOC-A2-03',title:'School vocabulary',module:'vocabulary',cefr:'A2'},
 {id:'GRA-A1-01',title:'Be in the present',module:'grammar',cefr:'A1'},
 {id:'REA-A2-08',title:'Community events',module:'reading',cefr:'A2'}];
assert.deepEqual(availableRelatedLessons(raw.entries.find(x=>x.id==='REF-COL-02'),catalog).map(x=>x.id),
 ['VOC-A2-03'],'No invented or unavailable links');
assert.deepEqual(availableRelatedLessons(raw.entries.find(x=>x.id==='REF-IRR-02'),catalog).map(x=>x.id),
 ['GRA-A1-01'],'Use the real imported skill catalog, not hard-coded scope');
assert.deepEqual(availableRelatedLessons(raw.entries.find(x=>x.id==='REF-TIP-04'),catalog),[],
 'No writing course in current imported catalog means no false link');
assert.equal(JSON.stringify(raw),frozen,'Filtering must not mutate reference data');
const ui=read('app/reference-library.tsx');
const home=read('app/home-client.tsx');
const player=read('app/foundation.tsx');
const css=read('app/globals.css');
assert(ui.includes("foundationRequest('/api/foundation')")&&ui.includes('catalog?.imported'),
 'Links grounded in live/local imported catalog, not optimistic hardcoded data');
assert(ui.includes('onOpenLesson(linked.id,entry.skill)'),'Linked lesson IDs must come from real catalog');
assert(home.includes('key:"reference",label:"Reference Library"'),'Existing sidebar integration');
assert(home.includes('if(await navigate(skill))setRequestedLessonId(id)'),
 'Full navigation guard before any canonical lesson jump');
assert(player.includes('!requestedLessonId||'),
 'Original player must handle guarded related-lesson open requests');
assert(player.includes('void open(requestedLessonId)'),
 'Reference link uses same player, no parallel quiz backend');
assert(player.includes('l.id===requestedLessonId&&(!skill||l.module===skill)'),
 'Only lesson and selected skill in current imported catalog may open');
assert(css.includes('.sle-reference .sle-reference-filter-grid')&&
 css.includes('@media(max-width:680px)'), 'Responsive reference UI styles present');
for(const s of [ui,tsSource]){
 assert.doesNotMatch(s,/\bfetch\s*\(.*(query|search)|requestWritingAI|evaluateWritingProcess|Gemini|localStorage\.setItem/);
}
assert(ui.includes('Suggested ')&&ui.includes('not a CEFR test'));
assert(!home.includes('heading:"REFERENCE LIBRARY"'),'Avoid creating a second independent site navigation architecture');
console.log(JSON.stringify({result:'PASS',gate:'reference-library-26-item-static-pilot',
 sourceParity:true,entries:26,kindCounts:kinds,noLearnerWrites:true,
 liveCatalogOnly:true,academicVerdict:'PENDING_NOTEBOOKLM',
 actualSafariIpad:'NOT_TESTED',mergeOrDeploy:false}));
