'use client';
/** Isolated engineering proof-of-concept for a NotebookLM-reviewed academic corpus.
 * This component is intentionally NOT linked to app navigation or production
 * Reference Library until independent technical QA and owner release authorization.
 */
import {useMemo,useState} from 'react';
import pilot from '../content/reference-library-pilot-v1.json';
import candidate from '../content/reference-library-v2-irregular-candidate.json';
import {buildIrregularRows,pageIrregularRows,searchIrregularRows,
 type ExistingPilotVerb,type StagedVerb,type VerbPriority} from '../domain/reference-library-v2-irregular';

const ROWS=buildIrregularRows(pilot.entries as ExistingPilotVerb[],
 candidate.new_entries as StagedVerb[]);
const ALPHABET='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export function ReferenceLibraryV2IrregularCandidate(){
 const [query,setQuery]=useState('');
 const [priority,setPriority]=useState<'all'|VerbPriority>('all');
 const [initial,setInitial]=useState('all');
 const [page,setPage]=useState(1);
 const filtered=useMemo(()=>searchIrregularRows(ROWS,{query,priority,initial}),
  [query,priority,initial]);
 const view=pageIrregularRows(filtered,page,25);
 const reviewed=ROWS.filter(x=>x.reviewState==='PILOT_REVIEWED').length;
 const reviewedCorpus=ROWS.length-reviewed;
 function search(value:string){setQuery(value);setPage(1)}
 function selectPriority(value:'all'|VerbPriority){setPriority(value);setPage(1)}
 function selectInitial(value:string){setInitial(value);setPage(1)}
 return <section className="sle-reference sle-reference-v2-candidate" aria-label="Irregular verb candidate lookup">
  <div className="page-heading"><div>
   <div className="eyebrow">ENGLISH REFERENCE LIBRARY · V2 CANDIDATE</div>
   <h2>Irregular verbs A–Z</h2>
   <p>Search by base, past simple or past participle. Explore meanings, examples and important variants.</p>
  </div></div>
  <div className="notice sle-ref-v2-unreviewed" role="status">
   <strong>Academic content reviewed — this separate prototype is not a live release.</strong>
   {' '}{reviewed} pilot verbs and {reviewedCorpus} full-corpus entries passed their
   separate NotebookLM academic reviews. Engineering, device QA and production release
   remain separate gates. The “core” filter is editorial, not a CEFR score or measured rank.
  </div>
  <div className="panel sle-ref-v2-controls">
   <label htmlFor="sle-ref-v2-search">Search verb or form
    <input id="sle-ref-v2-search" type="search" value={query} onChange={e=>search(e.target.value)}
     placeholder="e.g. go, went, gone, thought, laid" autoComplete="off"/>
   </label>
   <label htmlFor="sle-ref-v2-tier">Priority group
    <select id="sle-ref-v2-tier" value={priority}
     onChange={e=>selectPriority(e.target.value as 'all'|VerbPriority)}>
     <option value="all">All verbs</option>
     <option value="core">Core (editorial)</option>
     <option value="extended">Extended (editorial)</option>
    </select>
   </label>
   <div className="sle-ref-v2-letters" role="group" aria-label="Filter by initial letter">
    <button type="button" aria-pressed={initial==='all'} onClick={()=>selectInitial('all')}>All</button>
    {ALPHABET.map(letter=><button key={letter} type="button" aria-pressed={initial===letter}
      onClick={()=>selectInitial(letter)}>{letter}</button>)}
   </div>
  </div>
  <div className="sle-ref-v2-summary" role="status" aria-live="polite">
   <span>{filtered.length} of {ROWS.length} unique verbs · Page {view.page} of {view.totalPages}</span>
   <button type="button" className="secondary-button" onClick={()=>{
    search('');selectPriority('all');selectInitial('all');
   }}>Clear filters</button>
  </div>
  {filtered.length===0?<div className="panel" role="status">
   <h3>No matching verbs</h3><p>Try a base form or clear the filters.</p>
  </div>:<div className="sle-reference-table-scroll" tabIndex={0}
   role="region" aria-label="Irregular verbs table, horizontally scrollable on narrow screens">
   <table>
    <thead><tr><th scope="col">Base (V1)</th><th scope="col">Past (V2)</th>
     <th scope="col">Participle (V3)</th><th scope="col">Meaning and usage</th></tr></thead>
    <tbody>{view.rows.map(item=><tr key={item.id}>
     <th scope="row">{item.base}</th>
     <td>{item.past}</td><td>{item.participle}</td>
     <td>
      <p className="sle-ref-v2-meaning">{item.meaning}</p>
      <p className="sle-ref-v2-example">{item.example}</p>
      <details><summary>Usage and exceptions</summary>
       <p>{item.usageNote}</p>
       <small>{item.priority} · {item.reviewState==='PILOT_REVIEWED'?'Pilot reviewed':'Corpus reviewed'} · {item.id}</small>
      </details>
     </td>
    </tr>)}</tbody>
   </table>
  </div>}
  <div className="sle-ref-v2-pagination" aria-label="Irregular verb pages">
   <button type="button" className="secondary-button" disabled={view.page<=1}
    onClick={()=>setPage(Math.max(1,view.page-1))}>Previous page</button>
   <span>Page {view.page} / {view.totalPages}</span>
   <button type="button" className="secondary-button" disabled={view.page>=view.totalPages}
    onClick={()=>setPage(Math.min(view.totalPages,view.page+1))}>Next page</button>
  </div>
  <p className="sle-reference-footer">Offline-first, read-only candidate. No learner records,
    keys, transcripts, AI calls or scoring are used by this table.</p>
 </section>;
}
