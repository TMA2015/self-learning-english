'use client';
import {useEffect,useMemo,useState} from 'react';
import source from '../content/reference-library-pilot-v1.json';
import waveOne from '../content/reference-library-v2-wave1-reviewed.json';
import connectorWaveTwo from '../content/reference-library-v2-writing-connectors-wave2-reviewed.json';
import grammarWritingWaveTwo from '../content/reference-library-v2-grammar-writing-reviewed.json';
import crossSkillWaveThree from '../content/reference-library-v3-cross-skill-reviewed.json';
import degreeUsageWaveFour from '../content/reference-library-v4-degree-usage-reviewed.json';
import fullVerbs from '../content/reference-library-v2-irregular-candidate.json';
import {foundationRequest} from '../infrastructure/browser/client-services';
import type {Catalog} from './foundation';
import {
 REFERENCE_KINDS,REFERENCE_V2_KINDS,availableRelatedLessons,filterReferenceEntries,
 type ReferenceEntry,type ReferenceFilters,type ReferenceKind,
 type ReferenceLevel,type ReferenceRegister,type ReferenceSkill
} from '../domain/reference-library';

// Six original approved verbs stay byte-for-byte in the 26-entry pilot.
// The 185-entry full corpus independently covers all 15 reviewed Wave 1 verbs;
// use its literal approved forms/examples instead of duplicating those lemmas.
const CORPUS_ENTRIES=fullVerbs.new_entries.map(item=>({
 id:item.id,kind:'irregular_verbs' as const,term:item.base,
 meaning:item.meaning,example:item.example,note:item.usage_note,
 level:'not_tagged' as const,register:'not_tagged' as const,skill:'grammar' as const,
 forms:{base:item.base,past:item.past,participle:item.participle},
 search_keywords:item.search_terms,verb_priority:item.tier,
}));
type ReviewedGrammarComparison={
 id:string;kind:'grammar_comparisons';title:string;suggested_level:string;
 concept:string;use_decision:string;patterns:string;example:string;
 contrast:string;watch_out:string;keywords:string[];
};
type ReviewedWritingToolkit={
 id:string;kind:'writing_toolkit';title:string;suggested_level:string;
 process_step:string;purpose:string;steps:string;worked_micro_example:string;
 self_check:string;avoid:string;keywords:string[];
};
// Typed, reviewed static source. No learner storage, network, AI or topic lesson links.
const GRAMMAR_WRITING_ENTRIES:ReferenceEntry[]=
 (grammarWritingWaveTwo.entries as unknown as (ReviewedGrammarComparison|ReviewedWritingToolkit)[]).map(x=>
  x.kind==='grammar_comparisons'
   ?{id:x.id,kind:x.kind,term:x.title,meaning:x.use_decision,
     example:x.example,note:x.watch_out,level:'not_tagged',register:'not_tagged',skill:'grammar',
     suggested_level:x.suggested_level,concept:x.concept,use_decision:x.use_decision,
     patterns:x.patterns,contrast:x.contrast,watch_out:x.watch_out,keywords:x.keywords}
   :{id:x.id,kind:x.kind,term:x.title,meaning:x.purpose,
     example:x.worked_micro_example,note:x.avoid,level:'not_tagged',register:'not_tagged',skill:'writing',
     suggested_level:x.suggested_level,process_step:x.process_step,purpose:x.purpose,
     steps:x.steps,worked_micro_example:x.worked_micro_example,self_check:x.self_check,
     avoid:x.avoid,keywords:x.keywords}
 );
type ReviewedWaveThree={
 id:string;kind:ReferenceKind;title:string;suggested_level:string;register_or_mode:string;
 meaning_or_strategy:string;pattern_or_procedure:string;independent_illustration:string;
 contrast_or_reasoning:string;watch_out_or_limits:string;learner_self_check:string;search_hints:string[];
};
const WAVE3_ENTRIES:ReferenceEntry[]=(crossSkillWaveThree.entries as unknown as ReviewedWaveThree[]).map(x=>{
 const skill:ReferenceSkill=x.kind==='reading_strategies'?'reading'
  :x.kind==='listening_strategies'?'listening':'vocabulary';
 // Source-authored register detail is rendered verbatim. Only unambiguous
 // standard tags are projected into legacy navigation filter.
 const reg=x.register_or_mode.toLowerCase();
 const register:ReferenceRegister=reg.startsWith('neutral to formal')?'neutral to formal'
  :reg.startsWith('neutral')?'neutral'
  :reg.startsWith('informal')?'informal'
  :reg.startsWith('formal')?'formal':'not_tagged';
 return {id:x.id,kind:x.kind,term:x.title,meaning:x.meaning_or_strategy,
  example:x.independent_illustration,note:x.watch_out_or_limits,
  skill,level:'not_tagged',register,suggested_level:x.suggested_level,
  register_or_mode:x.register_or_mode,meaning_or_strategy:x.meaning_or_strategy,
  pattern_or_procedure:x.pattern_or_procedure,independent_illustration:x.independent_illustration,
  contrast_or_reasoning:x.contrast_or_reasoning,watch_out_or_limits:x.watch_out_or_limits,
  learner_self_check:x.learner_self_check,search_hints:x.search_hints};
});
const WAVE3_KINDS:ReferenceKind[]=[
 'phrasal_verbs','collocations','word_families','confusable_words','idioms',
 'reading_strategies','listening_strategies'
];
type ReviewedWaveFour={
 id:string;kind:ReferenceKind;title:string;suggested_level:string;register_or_mode:string;
 meaning_or_strategy:string;pattern_or_procedure:string;independent_illustration:string;
 contrast_or_reasoning:string;watch_out_or_limits:string;learner_self_check:string;search_hints:string[];
};
const WAVE4_ENTRIES:ReferenceEntry[]=(degreeUsageWaveFour.entries as unknown as ReviewedWaveFour[]).map(x=>{
 const skill:ReferenceSkill=x.kind==='reading_strategies'?'reading'
  :x.kind==='listening_strategies'?'listening'
  :x.kind==='writing_functions'?'writing'
  :x.kind==='preposition_patterns'?'grammar':'vocabulary';
 const reg=x.register_or_mode.toLowerCase();
 const register:ReferenceRegister=reg.startsWith('neutral to formal')?'neutral to formal'
  :reg.startsWith('neutral')?'neutral':reg.startsWith('informal')?'informal'
  :reg.startsWith('formal')?'formal':'not_tagged';
 return {id:x.id,kind:x.kind,term:x.title,meaning:x.meaning_or_strategy,
  example:x.independent_illustration,note:x.watch_out_or_limits,skill,
  level:'not_tagged',register,suggested_level:x.suggested_level,
  register_or_mode:x.register_or_mode,meaning_or_strategy:x.meaning_or_strategy,
  pattern_or_procedure:x.pattern_or_procedure,independent_illustration:x.independent_illustration,
  contrast_or_reasoning:x.contrast_or_reasoning,watch_out_or_limits:x.watch_out_or_limits,
  learner_self_check:x.learner_self_check,search_hints:x.search_hints};
});
const WAVE4_KINDS:ReferenceKind[]=[
 'degree_expressions','preposition_patterns','writing_functions',
 'reading_strategies','listening_strategies'
];
const ENTRIES=[...source.entries,
 ...waveOne.entries.filter(x=>x.kind!=='irregular_verbs'),
 ...connectorWaveTwo.entries,
 ...CORPUS_ENTRIES,...GRAMMAR_WRITING_ENTRIES,...WAVE3_ENTRIES,...WAVE4_ENTRIES] as ReferenceEntry[];
export {ENTRIES as REFERENCE_ENTRIES};
const ALPHABET='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
// This generic but correct reminder occurs in 141/185 corpus records.
// Leave reviewed source unchanged; omit it from repeated lookup rows.
const GENERIC_VERB_NOTE='Past simple is used for a finished past action; the past participle is used in perfect and passive constructions where appropriate.';
const UI_KINDS=[...REFERENCE_KINDS,...REFERENCE_V2_KINDS];
const LEVELS=['A1','A2','B1','B2','C1','C2'] as const;
const kindLabel=(kind:ReferenceKind)=>UI_KINDS.find(x=>x.id===kind)?.label??kind;

export function ReferenceLibrary({
 catalog,onCatalog,onOpenLesson,onSaveForReview,saveStatus,initialSearch
}:{
 catalog:Catalog|null;
 onCatalog:(next:Catalog)=>void;
 onOpenLesson:(lessonId:string,skill:ReferenceSkill)=>void;
 onSaveForReview?:(id:string)=>void;
 saveStatus?:string;
 initialSearch?:string;
}){
 const [query,setQuery]=useState(initialSearch??'');
 const [kind,setKind]=useState<ReferenceFilters['kind']>('all');
 const [level,setLevel]=useState<ReferenceFilters['level']>('all');
 const [register,setRegister]=useState<ReferenceFilters['register']>('all');
 const [catalogError,setCatalogError]=useState('');
 const [verbTier,setVerbTier]=useState<'all'|'core'|'extended'>('all');
 const [verbInitial,setVerbInitial]=useState('all');
 const [verbPage,setVerbPage]=useState(1);
 const results=useMemo(()=>filterReferenceEntries(
  ENTRIES,{query,kind,level,register}
 ),[query,kind,level,register]);
 const verbs=results.filter(e=>e.kind==='irregular_verbs');
 const verbFiltered=verbs.filter(e=>
  (verbTier==='all'||(e.verb_priority??'core')===verbTier)&&
  (verbInitial==='all'||e.term.toUpperCase().startsWith(verbInitial))
 ).sort((a,b)=>query.trim()?0:a.term.localeCompare(b.term,'en'));
 const verbTotalPages=Math.max(1,Math.ceil(verbFiltered.length/25));
 const activeVerbPage=Math.min(verbPage,verbTotalPages);
 const pagedVerbs=verbFiltered.slice((activeVerbPage-1)*25,activeVerbPage*25);
 const connectors=results.filter(e=>e.kind==='writing_connectors');
 const indefinite=results.filter(e=>e.kind==='frequency_expressions'&&e.frequency_type==='indefinite_frequency');
 const definite=results.filter(e=>e.kind==='frequency_expressions'&&e.frequency_type==='definite_frequency');
 const grammarComparisons=results.filter(e=>e.kind==='grammar_comparisons');
 const writingToolkit=results.filter(e=>e.kind==='writing_toolkit');
 const waveThree=results.filter(e=>e.id.startsWith('REF3-'));
 const waveThreeGroups=WAVE3_KINDS.map(k=>({kind:k,rows:waveThree.filter(e=>e.kind===k)})).filter(x=>x.rows.length>0);
 const waveFour=results.filter(e=>e.id.startsWith('REF4-'));
 const waveFourGroups=WAVE4_KINDS.map(k=>({kind:k,rows:waveFour.filter(e=>e.kind===k)})).filter(x=>x.rows.length>0);
 const otherCards=results.filter(e=>e.kind!=='irregular_verbs'&&
  e.kind!=='writing_connectors'&&e.kind!=='frequency_expressions'&&
  e.kind!=='grammar_comparisons'&&e.kind!=='writing_toolkit'&&!e.id.startsWith('REF3-')&&!e.id.startsWith('REF4-'));
 const writingFunctions=[...new Set(connectors.map(e=>e.function||'General'))];
 useEffect(()=>{
  if(catalog)return;
  let active=true;
  void foundationRequest('/api/foundation').then((value:Catalog)=>{
   if(active){onCatalog(value);setCatalogError('')}
  }).catch(()=>{
   if(active)setCatalogError('Lesson links could not load; the reference entries are still available.');
  });
  return ()=>{active=false};
 },[catalog,onCatalog]);
 function clear(){setQuery('');setKind('all');setLevel('all');setRegister('all');
  setVerbTier('all');setVerbInitial('all');setVerbPage(1)}
 function SaveForReview({entry}:{entry:ReferenceEntry}){
  return onSaveForReview?<button type="button" className="sle-ref-save-card"
   aria-label={'Save '+entry.term+' to review'}
   onClick={()=>onSaveForReview(entry.id)}>Save to review</button>:null;
 }
 function Related({entry}:{entry:ReferenceEntry}){
  const matches=catalog?.imported?availableRelatedLessons(entry,catalog.lessons):[];
  const linked=matches[0];
  return <div className="sle-reference-practice">
   {linked?<button type="button" className="text-button"
    onClick={()=>onOpenLesson(linked.id,entry.skill)}>
    Explore related {entry.skill} practice: {linked.title} ({linked.id})
   </button>:<small>No related {entry.skill} lesson in the currently imported catalog. You can still use this reference.</small>}
  </div>;
 }
 return <div className="sle-reference" aria-label="English Reference Library">
  <div className="eyebrow">LEARN · QUICK REFERENCE</div>
  <div className="page-heading"><div>
   <h1>English Reference Library</h1>
   <p>Look up irregular verbs, linking words, degree/intensity, usage patterns, writing functions, Reading and Listening strategies.</p>
  </div></div>
  <section className="panel sle-reference-intro" aria-label="How to use this library">
   <p>Use these examples to understand a pattern, then try a different example of your own.
    Choose a topic or level to find forms, meaning and examples.</p>
   <p><small>Offline-first static reference · 364 reviewed records: 26/26 entries academically reviewed in the original pilot,
    294 reviewed entries through Wave 2 (including 20 Grammar comparisons and 10 Writing Toolkit guides), 35 Wave 3 vocabulary/Reading/Listening guides
    (NotebookLM academic PASS 35/35), and 35 Wave 4 Degree/Preposition/Writing/Reading/Listening guides
    (NotebookLM academic PASS 35/35).
    Suggested levels are learning-navigation hints, not proficiency scores.
    No answers, tests, AI evaluation or learner scores are stored here.
    Specialist cards do not assert unverified topic lesson links.</small></p>
  </section>
  {onSaveForReview&&<p className="muted">Choose “Save to review” on a reference to create a flashcard in Study Notebook.
   Your own review choices are device-local, not grading.</p>}
  {saveStatus&&<p className="study-notebook-saved" role="status">{saveStatus}</p>}
  <section className="panel sle-reference-filters" aria-label="Search and filter references">
   <div className="sle-reference-filter-grid">
    <label>Search words and examples
     <input type="search" value={query} onChange={e=>{setQuery(e.target.value);setVerbPage(1)}}
      placeholder="e.g. written, despite, usually, decline" aria-label="Search reference entries"/>
    </label>
    <label>Reference type
     <select value={kind} onChange={e=>{setKind(e.target.value as 'all'|ReferenceKind);setVerbPage(1)}} aria-label="Reference type">
      <option value="all">All types</option>
      {UI_KINDS.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}
     </select>
    </label>
    <label>Suggested level
     <select value={level} onChange={e=>{setLevel(e.target.value as 'all'|ReferenceLevel);setVerbPage(1)}} aria-label="Suggested level">
      <option value="all">All levels</option>
      {LEVELS.map(x=><option key={x} value={x}>{x}</option>)}
     </select>
    </label>
    <label>Register
     <select value={register} onChange={e=>{setRegister(e.target.value as 'all'|ReferenceRegister);setVerbPage(1)}} aria-label="Register">
      <option value="all">All registers</option>
      <option value="neutral">Neutral</option>
      <option value="informal">Informal</option>
      <option value="formal">Formal</option>
     </select>
    </label>
   </div>
   <div className="sle-reference-category-filters" role="group" aria-label="Quick category filters">
    <button type="button" className={'sle-reference-category-filter is-all'+(kind==='all'?' is-selected':'')}
     aria-pressed={kind==='all'} onClick={()=>{setKind('all');setVerbPage(1)}}>All categories</button>
    {UI_KINDS.map(group=><button type="button" key={group.id}
     className={'sle-reference-category-filter is-'+group.id+(kind===group.id?' is-selected':'')}
     aria-pressed={kind===group.id} onClick={()=>{setKind(group.id);setVerbPage(1)}}>
      {group.label}
    </button>)}
   </div>
   <div className="sle-reference-search-summary" role="status" aria-live="polite">
    <span>{results.length} reference {results.length===1?'entry':'entries'} found</span>
    <button type="button" className="secondary-button" onClick={clear}>Clear filters</button>
   </div>
  </section>
  {catalogError&&<p className="notice" role="status">{catalogError}</p>}
  {!catalogError&&!catalog&&<p className="muted" role="status">Checking which lessons are available on this device…</p>}
  {catalog&&!catalog.imported&&<p className="notice">The current learner catalog is not imported on this device. The reference library remains readable; lesson links stay unavailable.</p>}
  {results.length===0&&<section className="panel" role="status"><h2>No matching entries</h2><p>Try a shorter word or clear one of the filters.</p></section>}
  {verbs.length>0&&<section className="panel sle-reference-section" aria-label="Irregular verb table">
   <h2>Irregular verbs</h2>
   <p className="muted">191 academically reviewed verbs (6 pilot + 185 full-corpus).
    Search by base (V1), past (V2), participle (V3), or regional variants.
    Core and Extended are editorial groups, not CEFR proficiency ratings.</p>
   <div className="sle-ref-verb-controls">
    <label>Priority group
     <select aria-label="Verb tier" value={verbTier}
      onChange={e=>{setVerbTier(e.target.value as 'all'|'core'|'extended');setVerbPage(1)}}>
      <option value="all">All verbs</option><option value="core">Core (editorial)</option>
      <option value="extended">Extended (editorial)</option>
     </select>
    </label>
    <div className="sle-ref-v2-letters" role="group" aria-label="Filter irregular verbs by initial letter">
     <button type="button" aria-pressed={verbInitial==='all'} onClick={()=>{setVerbInitial('all');setVerbPage(1)}}>All</button>
     {ALPHABET.map(letter=><button key={letter} type="button" aria-pressed={verbInitial===letter}
      onClick={()=>{setVerbInitial(letter);setVerbPage(1)}}>{letter}</button>)}
    </div>
    <p role="status" aria-live="polite">{verbFiltered.length} matching verbs · page {activeVerbPage} of {verbTotalPages}</p>
   </div>
   <p className="sle-reference-scroll-cue">On a narrow screen, scroll the table sideways to view every column.
    The CEFR/register filters show only records with reviewed tags; corpus verbs use Core/Extended instead.</p>
   <div className="sle-reference-table-scroll" role="region" aria-label="Scrollable irregular verb table" tabIndex={0}>
    <table><thead><tr><th scope="col">Base</th><th scope="col">Past</th><th scope="col">Past participle</th><th scope="col">Example and usage</th></tr></thead>
     <tbody>{pagedVerbs.map(entry=><tr key={entry.id}>
      <th scope="row">{entry.forms?.base}</th>
      <td>{entry.forms?.past}</td>
      <td>{entry.forms?.participle}</td>
      <td><p><strong>Meaning:</strong> {entry.meaning}</p>
       <p><strong>Example:</strong> {entry.example}</p>
       {entry.note!==GENERIC_VERB_NOTE&&<p><strong>Usage:</strong> {entry.note}</p>}
       {entry.pattern_group&&<p><strong>Pattern:</strong> {entry.pattern_group.replaceAll('_',' ')}</p>}
       {entry.common_error&&<p><strong>Watch out:</strong> {entry.common_error}</p>}
       <small>{entry.level==='not_tagged'?'CEFR level not assigned':'Suggested '+entry.level}
        {entry.verb_priority?' · '+entry.verb_priority+' (editorial)':' · reviewed pilot'}</small>
       {/* Topic-verified lesson links for irregular verbs will be added separately. */}
       <SaveForReview entry={entry}/>
      </td>
     </tr>)}</tbody>
    </table>
   </div>
   {verbTotalPages>1&&<div className="sle-ref-v2-pagination" aria-label="Irregular verb pages">
    <button type="button" className="secondary-button" disabled={activeVerbPage===1}
     onClick={()=>setVerbPage(Math.max(1,activeVerbPage-1))}>Previous page</button>
    <span>Page {activeVerbPage} / {verbTotalPages}</span>
    <button type="button" className="secondary-button" disabled={activeVerbPage===verbTotalPages}
     onClick={()=>setVerbPage(Math.min(verbTotalPages,activeVerbPage+1))}>Next page</button>
   </div>}
  </section>}
  {otherCards.length>0&&<section className="sle-reference-section" aria-label="Phrase and study references">
   <h2>Expressions and learning guidance</h2>
   <div className="sle-reference-card-grid">
    {otherCards.map(entry=><article className="panel sle-reference-card" key={entry.id}>
     <div className="sle-reference-tags">
      <span className={'sle-reference-kind-label is-'+entry.kind}>{kindLabel(entry.kind)}</span><span>Suggested {entry.level}</span><span>{entry.register}</span>
     </div>
     <h3>{entry.term}</h3>
     <p><strong>Meaning or strategy:</strong> {entry.meaning}</p>
     <p><strong>Example:</strong> {entry.example}</p>
     <p className="muted"><strong>Remember:</strong> {entry.note}</p>
     <Related entry={entry}/>
     <SaveForReview entry={entry}/>
    </article>)}
   </div>
  </section>}
  {waveFourGroups.length>0&&<section className="sle-reference-section" aria-label="Wave 4 degree usage and cross-skill references">
   <h2>Degree · Usage patterns · Writing · Reading · Listening ({waveFour.length} matching)</h2>
   <p className="muted">35 independently reviewed, unscored, read-only references. Degree does not mean frequency.
    Listening illustrations are fictional teaching situations, not actual audio, scored listening results, transcripts
    or answer keys. The real lesson player controls audio validation and transcript timing after submission.</p>
   {waveFourGroups.map(group=><div className="sle-ref-wave4-group" key={group.kind} aria-label={'Wave 4 '+kindLabel(group.kind)}>
    <h3>{kindLabel(group.kind)} ({group.rows.length})</h3>
    <div className="sle-ref-wave2-grid sle-ref-wave4-grid">
     {group.rows.map(entry=><article className="panel sle-ref-wave2-card sle-ref-wave4-card" key={entry.id}>
      <div className="sle-reference-tags"><span>{kindLabel(entry.kind)}</span>
       <span>Suggested {entry.suggested_level}</span><span>{entry.register_or_mode}</span></div>
      <h4>{entry.term}</h4>
      <p><strong>Meaning / strategy:</strong> {entry.meaning_or_strategy}</p>
      <p><strong>Pattern / procedure:</strong> {entry.pattern_or_procedure}</p>
      <p><strong>Independent illustration:</strong> {entry.independent_illustration}</p>
      <p><strong>Compare / why:</strong> {entry.contrast_or_reasoning}</p>
      <p className="sle-ref-caution"><strong>Watch out / limits:</strong> {entry.watch_out_or_limits}</p>
      <p><strong>Check yourself:</strong> {entry.learner_self_check}</p>
      {/* Academic NO_TOPIC_LINKS_AUTHORIZED. No scoring or generated lesson links. */}
      <SaveForReview entry={entry}/>
     </article>)}
    </div>
   </div>)}
  </section>}
  {waveThreeGroups.length>0&&<section className="sle-reference-section" aria-label="Wave 3 vocabulary reading and listening references">
   <h2>Vocabulary in context · Reading · Listening ({waveThree.length} matching)</h2>
   <p className="muted">35 independently reviewed, unscored reference cards. Reading examples are invented mini-texts.
    Listening illustrations are fictional teaching situations, not audio transcripts, graded stimuli or hearing evidence.
    The current lesson player controls when a real transcript may appear after submission; this library never reveals live answer keys.</p>
   {waveThreeGroups.map(group=><div className="sle-ref-wave3-group" key={group.kind} aria-label={'Wave 3 '+kindLabel(group.kind)}>
    <h3>{kindLabel(group.kind)} ({group.rows.length})</h3>
    <div className="sle-ref-wave2-grid sle-ref-wave3-grid">
     {group.rows.map(entry=><article className="panel sle-ref-wave2-card sle-ref-wave3-card" key={entry.id}>
      <div className="sle-reference-tags"><span>{kindLabel(entry.kind)}</span>
       <span>Suggested {entry.suggested_level}</span><span>{entry.register_or_mode}</span></div>
      <h4>{entry.term}</h4>
      <p><strong>Meaning / strategy:</strong> {entry.meaning_or_strategy}</p>
      <p><strong>Pattern / procedure:</strong> {entry.pattern_or_procedure}</p>
      <p><strong>Independent illustration:</strong> {entry.independent_illustration}</p>
      <p><strong>Compare / why:</strong> {entry.contrast_or_reasoning}</p>
      <p className="sle-ref-caution"><strong>Watch out / limits:</strong> {entry.watch_out_or_limits}</p>
      <p><strong>Check yourself:</strong> {entry.learner_self_check}</p>
      {/* Academic NO_TOPIC_LINKS_AUTHORIZED: no grading or lesson links. */}
      <SaveForReview entry={entry}/>
     </article>)}
    </div>
   </div>)}
  </section>}
  {grammarComparisons.length>0&&<section className="sle-reference-section" aria-label="Grammar comparison references">
   <h2>Grammar comparisons ({grammarComparisons.length} matching)</h2>
   <p className="muted">Choose the meaning first, then compare forms, reasons and limits. Suggested levels are for navigation only. These are unscored reference examples, not verified topic lessons.</p>
   <div className="sle-ref-wave2-grid">
    {grammarComparisons.map(entry=><article className="panel sle-ref-wave2-card" key={entry.id}>
     <div className="sle-reference-tags"><span>Grammar comparison</span><span>Suggested {entry.suggested_level}</span></div>
     <h3>{entry.term}</h3>
     <p><strong>Meaning:</strong> {entry.concept}</p>
     <p><strong>Choose by use:</strong> {entry.use_decision}</p>
     <p><strong>Form:</strong> {entry.patterns}</p>
     <p><strong>Independent example:</strong> {entry.example}</p>
     <p><strong>Why this form:</strong> {entry.contrast}</p>
     <p className="sle-ref-caution"><strong>Watch out / limits:</strong> {entry.watch_out}</p>
      <SaveForReview entry={entry}/>
    </article>)}
   </div>
  </section>}
  {connectors.length>0&&<section className="sle-reference-section" aria-label="Writing linking words">
   <h2>Writing connectors — choose by purpose ({connectors.length} matching)</h2>
   <p className="muted">Choose a logical relationship first, then check the sentence pattern and punctuation. More connectors do not automatically mean better writing.</p>
   {writingFunctions.map(fn=><div className="sle-ref-connector-group" key={fn}>
    <h3>{fn.replaceAll('_',' ').replaceAll(' / ',' and ')}</h3>
    <div className="sle-ref-connector-grid">
    {connectors.filter(e=>(e.function||'General')===fn).map(entry=><article className="panel sle-ref-connector-card" key={entry.id}>
     <div className="sle-reference-tags"><span>Suggested {entry.level}</span><span>{entry.register}</span></div>
     <h4>{entry.term}</h4>
     {entry.meaning!==entry.function&&<p><strong>Purpose:</strong> {entry.meaning}</p>}
     <p><strong>Structure:</strong> {entry.grammatical_type} · {entry.construction}</p>
     <p><strong>Example:</strong> {entry.example}</p>
     <p><strong>Usage:</strong> {entry.note}</p>
     <p className="sle-ref-caution"><strong>Watch out:</strong> {entry.common_error}</p>
     <SaveForReview entry={entry}/>
     {/* No topic match verified: do not link arbitrary introductory Writing lessons. */}
    </article>)}
    </div>
   </div>)}
  </section>}
  {writingToolkit.length>0&&<section className="sle-reference-section" aria-label="Writing Toolkit reference">
   <h2>Writing Toolkit ({writingToolkit.length} matching)</h2>
   <p className="muted">Practical decisions and self-checks for original writing. The examples are independent of live exercises. No automatic essay score or template answer is provided.</p>
   <div className="sle-ref-wave2-grid">
    {writingToolkit.map(entry=><article className="panel sle-ref-wave2-card" key={entry.id}>
     <div className="sle-reference-tags"><span>Writing process</span><span>Suggested {entry.suggested_level}</span></div>
     <h3>{entry.term}</h3>
     <p><strong>Step:</strong> {entry.process_step}</p>
     <p><strong>Purpose:</strong> {entry.purpose}</p>
     <p><strong>How to do it:</strong> {entry.steps}</p>
     <p><strong>Independent illustration:</strong> {entry.worked_micro_example}</p>
     <p><strong>Ask yourself:</strong> {entry.self_check}</p>
     <p className="sle-ref-caution"><strong>Avoid / limits:</strong> {entry.avoid}</p>
     <SaveForReview entry={entry}/>
    </article>)}
   </div>
  </section>}
  {(indefinite.length>0||definite.length>0)&&<section className="sle-reference-section" aria-label="Frequency expressions">
   <h2>Frequency — from always to never</h2>
   <p className="muted">These are approximate, context-dependent meanings, not fixed numerical percentages. Check where each adverb goes in the sentence.</p>
   {indefinite.length>0&&<ol className="sle-ref-frequency-ladder">
    {indefinite.map(entry=><li key={entry.id} className="sle-ref-frequency-item">
     <div><strong>{entry.term}</strong> <small>· {entry.qualitative_band?.replaceAll('_',' ')}</small></div>
     <p>{entry.example}</p><p><strong>Position:</strong> {entry.position_rule}</p>
     <p>{entry.note}</p>
     <p className="sle-ref-caution"><strong>Watch out:</strong> {entry.common_error}</p>
     <SaveForReview entry={entry}/>
    </li>)}
   </ol>}
   {definite.length>0&&<div className="sle-ref-counted-frequency">
    <h3>Measured frequency and intervals</h3>
    <p>These expressions name a count or an interval, so they do not belong on the approximate ladder above.</p>
    <div className="sle-ref-connector-grid">
    {definite.map(entry=><article className="panel sle-ref-connector-card" key={entry.id}>
     <h4>{entry.term}</h4>
     <p><strong>Pattern:</strong> {entry.position_rule}</p>
     <p><strong>Example:</strong> {entry.example}</p><p>{entry.note}</p>
     <p className="sle-ref-caution"><strong>Watch out:</strong> {entry.common_error}</p>
     <SaveForReview entry={entry}/>
    </article>)}
    </div>
   </div>}
  </section>}
  <p className="muted sle-reference-footer">Reference cards are separate from quizzes and do not change your saved results. A linked lesson is related by skill; it may not teach the exact expression shown above.</p>
 </div>;
}
