'use client';

import {useState} from 'react';
import {EvidenceHighlighter} from './learning-interactions';
import pilotData from '../content/rwg-depth-pilot-r1.json';

/**
 * Reviewed R/G/W depth overlay (SLE-RGW-DEPTH-PILOT-R1-20261113).
 * Only instructional material. No answer keys, grading, recovery writes,
 * AI requests, attempt mutations or artificial cross-skill credits.
 */
type StrategyCard={title:string;body:string};
type ReviewedLesson={
 module:'reading'|'grammar'|'writing';
 cefr_target:'B1';
 scored_item_count:number;
 unscored_item_count:number;
 goal:string;
 cards:readonly StrategyCard[];
 brainstorm?:readonly string[];
 model:{title:string;situation:string;thinking:string};
 self_practice:{title:string;description:string};
};
const LESSONS=pilotData.lessons as unknown as Record<string,ReviewedLesson>;
const VERSION=pilotData.source_curriculum_version;

// Source content checks require REA/GRA/WRI B1 pilot lessons to remain byte-for-byte
// identical in both reviewed 1.25 and cumulative active 1.28 packages.
// This is a deliberately explicit allowlist; no forward-version wildcard.
const CURRENT_IDENTICAL_VERSION='1.28.0';

function IndependentReadingEvidence({passage}:{passage:string}){
 const [selected,setSelected]=useState('');
 const [checked,setChecked]=useState(false);
 const sentences=(passage.match(/[^.!?]+[.!?]+/g)??[]).map((text,i)=>({id:String(i+1),text:text.trim()}));
 if(sentences.length!==3)return null;
 return <EvidenceHighlighter
  title="Find the limitation in a model text"
  question="Which sentence introduces a limitation to the positive claim about school gardens?"
  sentences={sentences} selectedId={selected} checked={checked}
  expectedId="2"
  rationale="However marks a limitation: rainy days can interrupt outdoor activities. This does not mean gardens are useless or that every school has a backup plan."
  onSelect={id=>{setSelected(id);setChecked(false)}}
  onCheck={()=>setChecked(true)}/>;
}

export function RgwDepthTeaching({lessonId,version}:{lessonId:string;version:string}){
 const baseline=version===VERSION?LESSONS[lessonId]:undefined;
 const lesson=baseline??(version===CURRENT_IDENTICAL_VERSION?LESSONS[lessonId]:undefined);
 if(!lesson)return null;
 return <section className="foundation-learn-block sle-rgw-pilot" aria-label="Reading Grammar Writing learning toolkit">
   <h3>{lesson.module==='reading'?'Read with evidence':lesson.module==='grammar'?'Reason from evidence':'Plan your writing'}</h3>
   <p><strong>Goal:</strong> {lesson.goal}</p>
   <div className="sle-rgw-strategies" aria-label="Learning strategies">
    {lesson.cards.map(card=><article className="sle-rgw-strategy" key={card.title}>
      <h4>{card.title}</h4><p>{card.body}</p>
    </article>)}
   </div>
   {lesson.brainstorm&&<div className="sle-rgw-brainstorm">
     <h4>Five questions for your brainstorm</h4>
     <ol>{lesson.brainstorm.map(question=><li key={question}>{question}</li>)}</ol>
    </div>}
   <div className="sle-rgw-model" aria-label="Independent worked example">
    <h4>{lesson.model.title}</h4>
    <p className="sle-rgw-model-situation">{lesson.model.situation}</p>
    {lessonId==='REA-B1-03'
      ?<details className="sle-rgw-model-reasoning">
        <summary>See the worked reasoning (optional)</summary>
        <p className="sle-rgw-model-thinking">{lesson.model.thinking}</p>
       </details>
      :<p className="sle-rgw-model-thinking">{lesson.model.thinking}</p>}
   </div>
   {lessonId==='REA-B1-03'&&<IndependentReadingEvidence key={lessonId+'-'+version}
    passage={lesson.model.situation}/>}
   <details className="sle-rgw-self-practice">
    <summary>{lesson.self_practice.title}</summary>
    {lesson.module==='writing'?<div>
     <p>Use these questions to plan your own draft. They are a checklist, not an automatic writing grade.</p>
     <div className="sle-rgw-checklist">
      {['I can state my position.','My reasons are distinct.','My example supports one reason.','I have addressed a difficulty.','I finish consistently.','I checked the actual task limits.'].map((prompt,i)=>
       <label key={prompt}><input type="checkbox" name={'rwg-writing-check-'+i}/><span>{prompt}</span></label>)}
     </div>
    </div>:<p>{lesson.self_practice.description}</p>}
    <p className="sle-rgw-unscored">Optional self-practice: not submitted or graded.</p>
   </details>
   <p className="sle-rgw-start-note">Start practice when you are ready. Your original lesson questions are unchanged.</p>
 </section>;
}
