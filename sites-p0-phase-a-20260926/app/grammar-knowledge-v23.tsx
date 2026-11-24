'use client';
import {createElement,type ReactNode} from 'react';
import type {SeedLesson} from '../domain/academic';
import {CompactGrammarSelfCheck,type GrammarQuickCheck} from './grammar-a1-02-notes';
import authored from '../content/grammar-knowledge-v23-wave1.json';
import wave2 from '../content/grammar-knowledge-v23-wave2-a1.json';
import wave3b from '../content/grammar-knowledge-v23-wave3b-a2.json';

type Block=string|{tag:string;attrs?:Record<string,string>;children?:Block[]};
type Section={title:string;viTitle:string;step:string|null;blocks?:Block[];quiz?:GrammarQuickCheck[]};
type Entry={title:string;baselineExplanation:string;sections:Section[]};
const LESSONS={...authored.lessons,...wave2.lessons,...wave3b.lessons} as unknown as Record<string,Entry>;
const VERSION=authored.source_curriculum_version;
/** Only the explicitly reviewed version and unchanged source lesson. Historical
 * notes and unknown future versions fall back to their original renderer. */
export function grammarKnowledgeV23Available(lesson:SeedLesson,version:string){
 const entry=LESSONS[lesson.id];
 return lesson.module==='grammar'&&version===VERSION&&!!entry&&lesson.title===entry.title&&lesson.explanation.en===entry.baselineExplanation;
}
const tags=new Set('div p b span strong td h3 article text li tr h4 path th svg rect circle br ul table thead tbody small polygon em g'.split(' '));
const aliases:Record<string,string>={class:'className',viewbox:'viewBox',tabindex:'tabIndex','stroke-width':'strokeWidth','font-size':'fontSize','text-anchor':'textAnchor','font-weight':'fontWeight','stroke-dasharray':'strokeDasharray','font-family':'fontFamily'};
const attrs=new Set('class lang fill role x y stroke aria-label stroke-width font-size d text-anchor scope viewbox viewBox height rx width cx cy r font-weight tabindex points stroke-dasharray font-family'.split(' '));
/** Closed semantic HTML/SVG vocabulary; no executable markup or URLs. All
 * instructional text is rendered as React text, never injected HTML. */
function BlockView({block,showVi}:{block:Block;showVi:boolean}):ReactNode{
 if(typeof block==='string')return block;
 if(!tags.has(block.tag))return null;
 if(!showVi&&block.attrs?.lang==='vi')return null;
 const props:Record<string,string|number>={};
 for(const [k,v] of Object.entries(block.attrs??{})){
  if(!attrs.has(k)||/url\s*\(/i.test(v))continue;
  props[aliases[k]??k]=k==='tabindex'?Number(v):v;
 }
 if(block.tag==='br')return createElement('br',props);
 return createElement(block.tag,props,...(block.children??[]).map((child,i)=><BlockView key={i} block={child} showVi={showVi}/>));
}
export function GrammarKnowledgeV23({lesson,version,showVi}:{lesson:SeedLesson;version:string;showVi:boolean}){
 if(!grammarKnowledgeV23Available(lesson,version))return null;
 const entry=LESSONS[lesson.id];
 return <section className="sle-gra02 sle-grammar-v23" aria-label="Grammar lesson notes" data-grammar-knowledge="v2.3" data-lesson-id={lesson.id}>
  {entry.sections.map((s,i)=><section className={'sle-gra02-section'+(s.step===null?' sle-gra02-remember':'')} key={i}>
   {s.step===null?<h3>{s.title}</h3>:<div className="sle-gra02-heading"><span className="sle-gra02-step" aria-hidden="true">{s.step}</span><div><h3>{s.title}</h3>{showVi&&s.viTitle&&<p lang="vi" className="sle-gra02-translation">{s.viTitle}</p>}</div></div>}
   {s.quiz?<CompactGrammarSelfCheck key={lesson.id+'@'+version} items={s.quiz} showVi={showVi}/>:s.blocks?.map((block,k)=><BlockView key={k} block={block} showVi={showVi}/>)}
  </section>)}
 </section>;
}
