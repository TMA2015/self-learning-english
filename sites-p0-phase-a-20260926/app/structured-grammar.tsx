import type {SeedLesson} from '../domain/academic';
import {TeachingBlocks} from './teaching-blocks';
/** Detect authored structured notes by format, not an outdated version allowlist.
 * Older attempts with plain-text notes keep their original display; new versions
 * reuse the same safe renderer without changing saved academic content. */
export function structuredGrammarAvailable(lesson:SeedLesson,_version:string){
 return lesson.module==='grammar'&&lesson.explanation.en.startsWith('### Core rule / Meaning');
}
export function grammarSections(markdown:string){
 return markdown.split('### ').slice(1).map(chunk=>{
  const known=['Core rule / Meaning','Remember / comparison (adaptive)','Remember'];
  const prefix=known.find(t=>chunk.startsWith(t));
  const title=prefix??chunk.split('\n')[0];
  const text=chunk.slice(title.length).trim();
  const label=title.replace(/ \(.*\)$/,'');
  return {title:label.charAt(0).toUpperCase()+label.slice(1),text};
 });
}
export function StructuredGrammarNotes({lesson,showVi}:{lesson:SeedLesson;showVi:boolean}){
 const sections=grammarSections(lesson.explanation.en);
 return <section className="gdp-integrated" aria-label="Structured Grammar lesson notes">
  <section className="gdp-card gdp-goals"><h3>Learning goals</h3><ul>{lesson.objectives.map(o=><li key={o}>{o}</li>)}</ul></section>
  {sections.map((s,i)=><section className={'gdp-card '+(s.title==='Worked examples'?'gdp-examples':s.title==='Common mistakes'?'gdp-mistakes':'')} key={i}><h3>{s.title==='Core rule / Meaning'?'The core idea':s.title}</h3><TeachingBlocks text={s.text}/></section>)}
  {showVi&&lesson.explanation.vi&&<section className="gdp-card gdp-vi" lang="vi"><h3>Vietnamese Support</h3><TeachingBlocks text={lesson.explanation.vi}/></section>}
 </section>;
}
