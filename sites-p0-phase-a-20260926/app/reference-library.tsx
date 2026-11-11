'use client';
import {useEffect,useMemo,useState} from 'react';
import source from '../content/reference-library-pilot-v1.json';
import {foundationRequest} from '../infrastructure/browser/client-services';
import type {Catalog} from './foundation';
import {
 REFERENCE_KINDS,availableRelatedLessons,filterReferenceEntries,
 type ReferenceEntry,type ReferenceFilters,type ReferenceKind,
 type ReferenceLevel,type ReferenceRegister,type ReferenceSkill
} from '../domain/reference-library';

const ENTRIES=source.entries as ReferenceEntry[];
const LEVELS=['A1','A2','B1','B2','C1','C2'] as const;
const kindLabel=(kind:ReferenceKind)=>REFERENCE_KINDS.find(x=>x.id===kind)?.label??kind;

export function ReferenceLibrary({
 catalog,onCatalog,onOpenLesson
}:{
 catalog:Catalog|null;
 onCatalog:(next:Catalog)=>void;
 onOpenLesson:(lessonId:string,skill:ReferenceSkill)=>void;
}){
 const [query,setQuery]=useState('');
 const [kind,setKind]=useState<ReferenceFilters['kind']>('all');
 const [level,setLevel]=useState<ReferenceFilters['level']>('all');
 const [register,setRegister]=useState<ReferenceFilters['register']>('all');
 const [catalogError,setCatalogError]=useState('');
 const results=useMemo(()=>filterReferenceEntries(
  ENTRIES,{query,kind,level,register}
 ),[query,kind,level,register]);
 const verbs=results.filter(e=>e.kind==='irregular_verbs');
 const others=results.filter(e=>e.kind!=='irregular_verbs');
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
 function clear(){setQuery('');setKind('all');setLevel('all');setRegister('all')}
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
   <p>Look up useful forms, phrases, common mistakes and study strategies.</p>
  </div></div>
  <section className="panel sle-reference-intro" aria-label="How to use this library">
   <p>Use these examples to understand a pattern, then try a different example of your own.
    The levels are suggested learning tags, not a CEFR test or proof of mastery.</p>
   <p><small>Offline-first static reference pilot · academic content review pending.
    No answers, tests, AI evaluation or learner scores are stored here.
    Related-skill lesson links appear only if those lessons are in this device's imported catalog.</small></p>
  </section>
  <section className="panel sle-reference-filters" aria-label="Search and filter references">
   <div className="sle-reference-filter-grid">
    <label>Search words and examples
     <input type="search" value={query} onChange={e=>setQuery(e.target.value)}
      placeholder="e.g. written, progress, evidence" aria-label="Search reference entries"/>
    </label>
    <label>Reference type
     <select value={kind} onChange={e=>setKind(e.target.value as 'all'|ReferenceKind)} aria-label="Reference type">
      <option value="all">All types</option>
      {REFERENCE_KINDS.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}
     </select>
    </label>
    <label>Suggested level
     <select value={level} onChange={e=>setLevel(e.target.value as 'all'|ReferenceLevel)} aria-label="Suggested level">
      <option value="all">All levels</option>
      {LEVELS.map(x=><option key={x} value={x}>{x}</option>)}
     </select>
    </label>
    <label>Register
     <select value={register} onChange={e=>setRegister(e.target.value as 'all'|ReferenceRegister)} aria-label="Register">
      <option value="all">All registers</option>
      <option value="neutral">Neutral</option>
      <option value="informal">Informal</option>
      <option value="formal">Formal</option>
     </select>
    </label>
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
   <p className="muted">Base form · simple past · past participle. Learn one form in a new context rather than only memorising a list.</p>
   <div className="sle-reference-table-scroll" role="region" aria-label="Scrollable irregular verb table" tabIndex={0}>
    <table><thead><tr><th scope="col">Base</th><th scope="col">Past</th><th scope="col">Past participle</th><th scope="col">Example and usage</th></tr></thead>
     <tbody>{verbs.map(entry=><tr key={entry.id}>
      <th scope="row">{entry.forms?.base}</th>
      <td>{entry.forms?.past}</td>
      <td>{entry.forms?.participle}</td>
      <td><strong>{entry.example}</strong><p>{entry.note}</p>
       <small>Suggested {entry.level} · {entry.register}</small>
       <Related entry={entry}/>
      </td>
     </tr>)}</tbody>
    </table>
   </div>
  </section>}
  {others.length>0&&<section className="sle-reference-section" aria-label="Phrase and study references">
   <h2>Expressions and learning guidance</h2>
   <div className="sle-reference-card-grid">
    {others.map(entry=><article className="panel sle-reference-card" key={entry.id}>
     <div className="sle-reference-tags">
      <span>{kindLabel(entry.kind)}</span><span>Suggested {entry.level}</span><span>{entry.register}</span>
     </div>
     <h3>{entry.term}</h3>
     <p><strong>Meaning or strategy:</strong> {entry.meaning}</p>
     <p><strong>Example:</strong> {entry.example}</p>
     <p className="muted"><strong>Remember:</strong> {entry.note}</p>
     <Related entry={entry}/>
    </article>)}
   </div>
  </section>}
  <p className="muted sle-reference-footer">Reference cards are separate from quizzes and do not change your saved results. A linked lesson is related by skill; it may not teach the exact expression shown above.</p>
 </div>;
}
