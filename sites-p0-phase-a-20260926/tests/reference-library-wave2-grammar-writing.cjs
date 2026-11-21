'use strict';
/** Reference Library Wave2 exact-source parity, 264 legacy lock, 294 total.
 * Academic approval supplied by owner; technical QA remains separate.
 * All data are synthetic/static. No learner writes or Gemini/network calls.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),ts=require('typescript');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('notebooklm/SLE_REF_W2_GRAMMAR_WRITING_R1_20261121.md');
const verdict=read('notebooklm/SLE_REF_W2_GRAMMAR_WRITING_R1_VERDICT_RECONCILIATION_20261121.md');
const reviewed=JSON.parse(read('content/reference-library-v2-grammar-writing-reviewed.json'));
assert(source.includes('PACKET_ID:** '+String.fromCharCode(96)+'SLE-REF-W2-GRAMMAR-WRITING-R1-20261121'),'reviewed source packet ID');
assert(verdict.includes('ACADEMIC_VERDICT: PASS')&&verdict.includes('NO_TOPIC_LINKS_AUTHORIZED'),'owner verdict and no topic links');
assert.equal(reviewed.review_status,'NOTEBOOKLM_PASS_30_OF_30');
assert.equal(reviewed.source_standard,'SLE-MASTER-001 v1.2.1');
assert.equal(reviewed.entries.length,30);
assert.equal(reviewed.entries.filter(e=>e.kind==='grammar_comparisons').length,20);
assert.equal(reviewed.entries.filter(e=>e.kind==='writing_toolkit').length,10);
assert.equal(new Set(reviewed.entries.map(e=>e.id)).size,30);
const group=source.split('## 4. Thirty original review candidates')[1].split('\n## 5.')[0];
const blocks=group.split(/(?=^#### REF2-)/m).filter(s=>s.startsWith('####'));
assert.equal(blocks.length,30,'All authored review sections must be present.');
const unmd=s=>s.replace(/\*\*/g,'').replace(/`/g,'').replace(/\*/g,'').trim();
function fields(block){
 const result={};
 for(const line of block.split('\n').filter(x=>x.startsWith('- **'))){
  for(const m of line.matchAll(/\*\*([^*]+):\*\*\s*(.*?)(?=\s*\*\*[^*]+:\*\*|$)/g)){
   assert.equal(result[m[1]],undefined,'Do not silently accept duplicate academic field '+m[1]);
   result[m[1]]=unmd(m[2]);
  }
 }
 return result;
}
function fromMarkdown(block){
 const h=block.split('\n')[0].match(/^#### (REF2-(GRM|WTK)-\d{3}) — (.+)$/);
 assert(h,'Expected stable reference ID and authored title');
 const id=h[1],kind=h[2],title=h[3],f=fields(block);
 const pick=(...keys)=>{
  const match=keys.find(k=>typeof f[k]==='string');
  assert(match,id+' missing source field '+keys.join('/'));
  return f[match];
 };
 const suggested_level=pick('Suggested navigation level','Suggested level').replace(/\.$/,'');
 const keywords=pick('Search hints').replace(/\.$/,'').split(',').map(x=>x.trim());
 if(kind==='GRM'){
  return {id,kind:'grammar_comparisons',title,suggested_level,
   concept:pick('Concept'),use_decision:pick('Use decision'),patterns:pick('Forms'),
   example:pick('Original independent illustration','Illustration'),
   contrast:pick('Compare / reasoning','Compare'),watch_out:pick('Watch out / limits'),keywords};
 }
 return {id,kind:'writing_toolkit',title,suggested_level,
  process_step:pick('Process step'),purpose:pick('Purpose'),steps:pick('Micro-procedure'),
  worked_micro_example:pick('Independent illustration','Illustration'),
  self_check:pick('Self-check'),avoid:pick('Avoid / limits'),keywords};
}
assert.deepEqual(reviewed.entries,blocks.map(fromMarkdown),
 'Every reviewed JSON field must literally match the independent human-readable source by ID');
for(const row of reviewed.entries){
 assert(!('answer_key' in row)&&!('score' in row)&&!('lesson_id' in row),'No key, scoring or unverified exact-topic lesson link');
 assert(row.keywords.length>=3&&row.title&&row.suggested_level,'Useful search and navigation fields');
 assert(/^REF2-(GRM|WTK)-\d{3}$/.test(row.id));
}
const immutable={
 'content/reference-library-pilot-v1.json':'789033dad2b99790b5b4dd3a98c4a3ce28ebeecc',
 'content/reference-library-v2-wave1-reviewed.json':'9ce5e56951da0bfb3e9d43c12240a1ebeb74ab16',
 'content/reference-library-v2-writing-connectors-wave2-reviewed.json':'465e75e5fe3720ea26ebec4ca51ca48c0cadbd34',
 'content/reference-library-v2-irregular-candidate.json':'4055186bbb56ba350f410bb3401b905ab8d29cef'
};
for(const [file,sha] of Object.entries(immutable)){
 const bytes=Buffer.from(read(file),'utf8');
 const gitHash=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
 assert.equal(gitHash,sha,'Do not edit or silently regenerate reviewed legacy reference: '+file);
}
const pilot=JSON.parse(read('content/reference-library-pilot-v1.json'));
const wave1=JSON.parse(read('content/reference-library-v2-wave1-reviewed.json'));
const connectorWave2=JSON.parse(read('content/reference-library-v2-writing-connectors-wave2-reviewed.json'));
const corpus=JSON.parse(read('content/reference-library-v2-irregular-candidate.json'));
const existing=[...pilot.entries,...wave1.entries.filter(e=>e.kind!=='irregular_verbs'),
 ...connectorWave2.entries,...corpus.new_entries.map(x=>({...x,term:x.base}))];
assert.equal(existing.length,264,'All previous reviewed records must be present.');
assert.equal(new Set(existing.map(e=>e.id)).size,264);
assert.equal(existing.find(e=>e.id==='REF-MIS-01').term,'many vs much');
assert.equal(existing.find(e=>e.id==='REF-TIP-04').term,'Writing: analyse the task');
const all=[...existing,...reviewed.entries];
assert.equal(all.length,294);
assert.equal(new Set(all.map(e=>e.id)).size,294,'No ID collision with 264 reviewed entries.');
assert.equal(new Set(all.map(e=>(e.term??e.title).toLowerCase())).size,294,'No ambiguous identical reference titles.');
const ui=read('app/reference-library.tsx'),domain=read('domain/reference-library.ts'),css=read('app/globals.css');
assert(ui.includes('...CORPUS_ENTRIES,...GRAMMAR_WRITING_ENTRIES'),'Append new entries; do not replace 264 old ones.');
assert(ui.includes('20 Grammar comparisons and 10 Writing Toolkit guides'));
assert(ui.includes('Grammar comparisons ({grammarComparisons.length} matching)'));
assert(ui.includes('Writing Toolkit ({writingToolkit.length} matching)'));
assert(css.includes('grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))'));
assert(css.includes('@media(max-width:380px)'),'320px readable fallback required.');
const g=ui.slice(ui.indexOf('  {grammarComparisons.length>0&&'),ui.indexOf('  {connectors.length>0&&'));
const w=ui.slice(ui.indexOf('  {writingToolkit.length>0&&'),ui.indexOf('  {(indefinite.length>0||definite.length>0)&&'));
assert(g.includes('Watch out / limits')&&w.includes('Ask yourself'),'Show academic teaching content, not generic card labels.');
assert(!g.includes('<Related')&&!w.includes('<Related')&&!g.includes('onOpenLesson(')&&!w.includes('onOpenLesson('),
 'NotebookLM did not authorize exact-topic links for these specialist items.');
assert(!/localStorage\.|sessionStorage\.|setItem\(|Gemini|AI feedback|score\s*=/.test(g+w),
 'Grammar/Writing lookup must not write learner data, grade, or call AI.');
const compiled=ts.transpileModule(domain,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const out=path.join(root,'.sites-runtime/reference-library-wave2-domain.cjs');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,compiled);
const {filterReferenceEntries,REFERENCE_V2_KINDS}=require(out);
assert.deepEqual(REFERENCE_V2_KINDS.slice(0,4).map(x=>x.id),['writing_connectors','frequency_expressions','grammar_comparisons','writing_toolkit']);
assert.equal(REFERENCE_V2_KINDS.length,11,'Original four V2 + Wave3 four + Wave4 three remain stable');
const mapSpecialist=e=>e.kind==='grammar_comparisons'
 ?{...e,term:e.title,meaning:e.use_decision,note:e.watch_out,skill:'grammar',level:'not_tagged',register:'not_tagged'}
 :{...e,term:e.title,meaning:e.purpose,example:e.worked_micro_example,note:e.avoid,skill:'writing',level:'not_tagged',register:'not_tagged'};
const entries=[...pilot.entries,...wave1.entries.filter(e=>e.kind!=='irregular_verbs'),
 ...connectorWave2.entries,...corpus.new_entries.map(e=>({
  id:e.id,kind:'irregular_verbs',term:e.base,meaning:e.meaning,example:e.example,note:e.usage_note,
  level:'not_tagged',register:'not_tagged',skill:'grammar',forms:{base:e.base,past:e.past,participle:e.participle},search_keywords:e.search_terms
 })),...reviewed.entries.map(mapSpecialist)];
const base={query:'',kind:'all',level:'all',register:'all'};
const lookup=(query,kind='all',level='all')=>filterReferenceEntries(entries,{...base,query,kind,level});
assert.equal(lookup('').length,294);
assert.equal(lookup('','grammar_comparisons').length,20);
assert.equal(lookup('','writing_toolkit').length,10);
assert.equal(lookup('has been reading','grammar_comparisons')[0]?.id,'REF2-GRM-004');
assert.equal(lookup('paraphrase','writing_toolkit')[0]?.id,'REF2-WTK-009');
assert(lookup('','grammar_comparisons','A1').some(e=>e.id==='REF2-GRM-001'),'A1–A2 range includes A1');
assert(lookup('','writing_toolkit','B2').some(e=>e.id==='REF2-WTK-009'),'B1–B2 range includes B2');
assert.equal(lookup('much vs many','common_mistakes')[0]?.id,'REF-MIS-01');
assert(lookup('despite','writing_connectors').some(e=>e.id==='REF2-LNK-005'));
console.log(JSON.stringify({result:'PASS',gate:'reference-library-w2-grammar-writing-30',
 academicReviewed:30,sourceParity:30,legacyHashLocked:4,preservedLegacy:264,combinedEntries:294,
 grammar:20,writingToolkit:10,sourceGroundedSearch:true,unscoredNoTopicLinks:true,learnerWrites:0,release:false}));
