'use client';

import type {WeekWork} from '../domain/writing-course-v2-b';
import {writingWeek} from '../domain/writing-course-v2-b';

type Props={
  work:WeekWork;
  ideas:string[]|null;
  provisionalLabels:Record<string,string>;
  disabled:boolean;
  onSelect:(idea:string)=>void;
};

/**
 * A readable, responsive concept map built only from the learner's own notes.
 * It does not infer meaning, create ideas, grade relevance, or persist separate state.
 * When the original notes are complex, they are shown verbatim rather than parsed.
 */
export function Week2IdeaMap({work,ideas,provisionalLabels,disabled,onSelect}:Props){
  const chosen=work.fields.best?.trim()??'';
  const reason=work.fields.fit?.trim()??'';
  const rejected=work.fields.reject?.trim()??'';
  const rawIdeas=work.fields.ideas??'';
  return <section className="wcv2-card w2-map" aria-label="Visual brainstorming map">
    <h3>My live idea map</h3>
    <p className="muted">Your own ideas, connected to the task. Use the map to compare possible answers; the software does not decide which answer is best.</p>
    <div className="w2-map-root">
      <span className="w2-map-kicker">THE WRITING TASK</span>
      <p>{writingWeek(2).prompt}</p>
    </div>
    <div className="w2-map-branches">
      <section className="w2-map-branch w2-map-possibilities" aria-label="Possible activity ideas">
        <h4>Possible activities</h4>
        {ideas===null?
          <p className="w2-map-note">Original notes preserved exactly:</p>:
          !ideas.length?<p className="w2-map-note">No idea cards yet. Begin by generating some options.</p>:null}
        {ideas===null?
          <p className="w2-map-original">{rawIdeas||'No notes yet'}</p>:
          <ol className="w2-map-idea-list">
            {ideas.map((idea,i)=>{
              const isChosen=chosen!==''&&idea.trim().toLocaleLowerCase()===chosen.toLocaleLowerCase();
              const tag=provisionalLabels[idea];
              return <li key={i+':'+idea} className={isChosen?'w2-map-idea w2-map-chosen':'w2-map-idea'}>
                <span className="w2-map-idea-text">{idea}</span>
                {tag&&<span className="w2-map-tag">My label: {tag}</span>}
                <button type="button" disabled={disabled||isChosen}
                  aria-label={'Select idea '+(i+1)+' from map'}
                  onClick={()=>onSelect(idea)}>{isChosen?'Selected':'Choose this idea'}</button>
              </li>;
            })}
          </ol>}
      </section>
      <section className="w2-map-branch w2-map-decision" aria-label="Chosen activity and reason">
        <h4>My selected idea</h4>
        <p className="w2-map-value">{chosen||'Choose an idea or enter your own in the saved fields.'}</p>
        <div className="w2-map-subnode">
          <strong>Why this idea fits</strong>
          <p>{reason||'Add a clear reason in “Why this idea fits the task”.'}</p>
        </div>
      </section>
      <section className="w2-map-branch w2-map-filtered" aria-label="Idea filtered out">
        <h4>Idea I will reject or revise</h4>
        <p className="w2-map-value">{rejected||'Consider one weaker option and explain why.'}</p>
        <p className="w2-map-note">A weaker idea can sometimes be repaired; rejection is not always the only choice.</p>
      </section>
    </div>
    <p className="w2-map-footnote">This map reflects your own words. Card labels are provisional and not saved. The four original Writing Week 2 fields remain the saved record.</p>
  </section>;
}
