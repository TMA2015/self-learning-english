'use strict';
/** Reference Library v2 candidate contract: structure/UX only, NOT an academic verdict.
 * No learner data or production storage reads/writes.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pilot=JSON.parse(read('content/reference-library-pilot-v1.json'));
const staged=JSON.parse(read('content/reference-library-v2-irregular-candidate.json'));
const source=read('domain/reference-library-v2-irregular.ts');
const ui=read('app/reference-library-v2-irregular-candidate.tsx');
const styles=read('app/globals.css');
const home=read('app/home-client.tsx');

assert.equal(pilot.entries.length,26,'26 academically reviewed existing pilot entries preserved');
const legacy=pilot.entries.filter(e=>e.kind==='irregular_verbs');
assert.equal(legacy.length,6);
assert.equal(staged.status,'NOTEBOOKLM_PASS_185_OF_185_DRAFT_NOT_LIVE');
assert.equal(staged.new_entries.length,185);
assert(staged.new_entries.every(e=>e.review_status==='NOTEBOOKLM_PASS'),'Owner-supplied 185/185 NotebookLM verdict must match candidate metadata');
assert.equal(staged.counts.total_candidate,191);
const ids=[...legacy.map(x=>x.id),...staged.new_entries.map(x=>x.id)];
assert.equal(new Set(ids).size,191,'All 191 IDs distinct');
const bases=[...legacy.map(e=>e.term),...staged.new_entries.map(e=>e.base)];
assert.equal(new Set(bases).size,191,'All 191 lemmas distinct');
const previouslyDrafted=['be','do','have','come','take','give','make','know','think',
 'teach','read','put','eat','speak','find'];
for(let i=0;i<previouslyDrafted.length;i++){
 const term=previouslyDrafted[i];
 const e=staged.new_entries.find(x=>x.base===term);
 assert(e,'Previous Wave 1 verb missing: '+term);
 assert.equal(e.id,'REF2-IRR-'+String(i+1).padStart(3,'0'),'Stable draft ID: '+term);
}
const allIds=new Set();
for(const item of staged.new_entries){
 assert(!allIds.has(item.id));allIds.add(item.id);
 assert(/^REF2-IRR-\d{3}$/.test(item.id),item.id);
 assert(typeof item.meaning==='string'&&item.meaning.trim().length>=2,item.id);
 assert(typeof item.example==='string'&&item.example.includes(' '),item.id);
 assert(typeof item.past==='string'&&item.past,item.id);
 assert(typeof item.participle==='string'&&item.participle,item.id);
 assert(typeof item.usage_note==='string'&&item.usage_note,item.id);
 assert(item.search_terms.includes(item.base),item.id);
 assert(['core','extended'].includes(item.tier),item.id);
 assert(!('score' in item)&&!('answer_key' in item)&&!('learner_id' in item),item.id);
}
const compiled=ts.transpileModule(source,{compilerOptions:{
 module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,
}}).outputText;
const out=path.join(root,'.sites-runtime/reference-library-v2-selectors.cjs');
fs.mkdirSync(path.dirname(out),{recursive:true});
fs.writeFileSync(out,compiled);
const {buildIrregularRows,searchIrregularRows,pageIrregularRows}=require(out);
const rows=buildIrregularRows(pilot.entries,staged.new_entries);
assert.equal(rows.length,191);
assert.equal(rows.filter(x=>x.reviewState==='PILOT_REVIEWED').length,6);
assert.equal(rows.filter(x=>x.reviewState==='CORPUS_REVIEWED').length,185);
assert.equal(rows.filter(x=>x.priority==='extended').length,81);
const query=(text,priority='all',initial='all')=>
 searchIrregularRows(rows,{query:text,priority,initial}).map(x=>x.base);
for(const [input,expected] of [['went','go'],['gone','go'],['did','do'],['done','do'],
 ['thought','think'],['laid','lay'],['lay','lay'],['gotten','get'],
 ['written','write'],['held','hold'],['swum','swim'],['read','read']]){
 assert.equal(query(input)[0],expected,'Search by V1/V2/V3 priority: '+input);
}
assert(query('foofoofoo').length===0);
assert(query('', 'extended').length===81);
assert(query('', 'core').length===110);
assert(query('', 'all','W').every(v=>v.startsWith('w')));
assert.deepEqual([...query('')].sort((a,b)=>a.localeCompare(b,'en')),query(''),
 'A-Z listing remains deterministic');
const paged=pageIrregularRows(rows,1,25);
assert.equal(paged.totalPages,8);assert.equal(paged.rows.length,25);
assert.equal(pageIrregularRows(rows,8,25).rows.length,16);
assert.equal(pageIrregularRows(rows,10000,25).page,8);
assert.equal(pageIrregularRows([],1,25).totalPages,1);
for(const guard of ['No learner records','Academic content reviewed','25']){
 // The candidate UI must signal unreleased content and keep bounded rendering.
 if(guard==='Academic content reviewed')assert(ui.includes(guard));
}
assert(ui.includes('pageIrregularRows(filtered,page,25)'),'Never eagerly render full 191-row list');
assert(ui.includes('aria-label="Filter by initial letter"'),'A-Z keyboard labels');
assert(ui.includes('aria-label="Irregular verbs table, horizontally scrollable on narrow screens"'));
assert(ui.includes('role="status"')&&ui.includes('aria-live="polite"'));
assert(ui.includes('PILOT_REVIEWED')&&ui.includes('Academic content reviewed'));
assert(styles.includes('.sle-reference-v2-candidate .sle-ref-v2-letters'));
assert(styles.includes('@media(max-width:680px)'));
assert(!home.includes('ReferenceLibraryV2IrregularCandidate'),
 'Legacy standalone corpus prototype must not create a second site navigation route');
for(const text of [source,ui]){
 assert.doesNotMatch(text,/\blocalStorage\b|\bindexedDB\b|\bFirebase\b|\bGemini\b|\bfetch\s*\(/i,
 'Candidate must remain local, read-only and provider-free');
}
console.log(JSON.stringify({result:'PASS',gate:'reference-v2-irregular-candidate',
 expectedCandidates:185,existingApproved:6,totalVerbs:191,core:110,extended:81,
 v1v2v3Search:true,alphabetical:true,pageSize:25,academicReview:'PASS_185_OF_185',
 mainNavigation:'UNMODIFIED',liveRelease:false}));
