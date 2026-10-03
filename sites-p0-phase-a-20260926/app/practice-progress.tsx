'use client';
import type {PracticeProgress} from '../domain/practice-progress';

const conceptLabel=(id:string)=>id.split('-').map(word=>word?word[0].toUpperCase()+word.slice(1):word).join(' ');

export function PracticeSummary({data,error,onRefresh,onSkill,onLesson}:{data:PracticeProgress|null;error:string;onRefresh:()=>void;onSkill:(skill:string)=>void;onLesson?:(skill:string,lessonId:string)=>void}){
 const adaptive=data?.adaptiveGrammar.recommendations??[];
 const observedGrammar=data?.adaptiveGrammar.concepts.filter(row=>row.total>0)??[];
 const grammarStates=observedGrammar.reduce((counts,row)=>({...counts,[row.state]:(counts[row.state]??0)+1}),{} as Record<string,number>);
 const otherSuggestions=(data?.suggestions??[]).filter(row=>row.skill!=='Grammar').slice(0,Math.max(0,3-adaptive.length));
 const hasSuggestions=adaptive.length>0||otherSuggestions.length>0;
 return <section className="panel" aria-label="Practice performance"><div className="section-head"><div><span className="eyebrow">SAVED ANSWERS</span><h2>Practice performance</h2></div><button className="secondary-button" onClick={onRefresh}>Refresh</button></div>
  {error&&<p role="alert">{error}</p>}
  {!data?<p>Loading saved practice answers…</p>:<>
   <p><strong>{data.overall.total?`${data.overall.correct}/${data.overall.total} correct · ${data.overall.accuracyPercent}%`:'No scored objective answers yet'}</strong></p>
   <p>{data.overall.uniqueQuestions} distinct question(s). The accuracy denominator counts every saved objective answer across attempts; each question counts once per attempt even when it has several tags. Coverage counts a question ID together with its package and exact content version.</p>
   <div className="debug-table"><table><thead><tr><th>Skill</th><th>Correct / attempts</th><th>Distinct questions</th></tr></thead><tbody>{data.skills.map(row=><tr key={row.skill}><td>{row.skill}</td><td>{row.correct}/{row.total} · {row.accuracyPercent}%</td><td>{row.uniqueQuestions}</td></tr>)}</tbody></table></div>
   <details className="practice-tags"><summary>Detailed tags and denominators</summary><div className="debug-table"><table><thead><tr><th>Skill / tag</th><th>Correct / attempts</th><th>Distinct questions</th></tr></thead><tbody>{data.tags.map(row=><tr key={`${row.skill}:${row.tag}`}><td>{row.skill} · {row.tag}</td><td>{row.correct}/{row.total} · {row.accuracyPercent}%</td><td>{row.uniqueQuestions}</td></tr>)}</tbody></table></div><p>A question with multiple tags appears once in each relevant tag, and once overall. No data for a tag means unobserved, not 0% mastery.</p></details>
   <div className="practice-blocks">
    <section className="practice-block" aria-labelledby="practice-mistakes-heading">
     <div className="practice-block-heading"><h3 id="practice-mistakes-heading">Repeated mistakes</h3><p>Questions answered incorrectly at least twice.</p></div>
     {data.repeatedMistakes.length?<ul className="practice-mistake-list">{data.repeatedMistakes.map(row=><li key={row.version+':'+row.questionId}><strong>{row.questionId}</strong><span>Content {row.version}</span><span className="practice-pill practice-pill-warning">Incorrect {row.incorrect}/{row.total} attempts</span></li>)}</ul>:<p className="practice-empty">No question has two saved incorrect objective answers.</p>}
    </section>
    <section className="practice-block" aria-labelledby="practice-writing-heading">
     <div className="practice-block-heading"><h3 id="practice-writing-heading">Writing review</h3><p>Only adult-approved work receives a quality score.</p></div>
     <div className="practice-writing-rows"><div><strong>Foundation</strong><span>{data.writing.foundation.pending} awaiting adult review</span><span>{data.writing.foundation.approved} approved</span></div><div><strong>Writing Coach</strong><span>{data.writing.legacy.pending} submitted without approved review</span><span>{data.writing.legacy.approved} approved</span></div></div>
     <p className="practice-footnote">Drafts and pending reviews receive no quality score.</p>
    </section>
    <section className="practice-block" aria-labelledby="practice-suggestions-heading">
     <div className="practice-block-heading"><h3 id="practice-suggestions-heading">Suggested practice</h3><p>Based on saved answers. Recommendations open the current lesson; old results stay on their original content versions.</p></div>
     {observedGrammar.length?<p className="practice-footnote">Observed Grammar concepts: {grammarStates.needs_practice??0} need practice · {grammarStates.developing??0} developing · {grammarStates.stable_for_now??0} stable for now · {grammarStates.not_enough_evidence??0} need more evidence.</p>:<p className="practice-footnote">No submitted Grammar evidence yet. Unobserved concepts are not treated as weak.</p>}
     {hasSuggestions?<div className="practice-suggestion-list">
      {adaptive.map(row=><div key={`adaptive:${row.targetConceptId}:${row.recommendedConceptId}`} className="practice-suggestion"><div><strong>Grammar · {conceptLabel(row.recommendedConceptId)}</strong>{row.prerequisiteFirst&&<span className="practice-pill practice-pill-warning">Foundation first</span>}<p>{row.prerequisiteFirst?`${conceptLabel(row.recommendedConceptId)} is a prerequisite for ${conceptLabel(row.prerequisiteFor??row.targetConceptId)}. `:''}Saved evidence: {row.correct}/{row.total} correct across {row.distinctQuestions} distinct question(s){row.repeatedQuestions?` · ${row.repeatedQuestions} repeated mistake question(s)`:''}.</p><p><strong>{row.lessonId}</strong> · {row.lessonTitle}</p></div><button className="secondary-button" onClick={()=>onLesson?onLesson('Grammar',row.lessonId):onSkill('Grammar')}>Practice this lesson</button></div>)}
      {otherSuggestions.map(row=><div key={`legacy:${row.skill}:${row.tag}`} className="practice-suggestion"><div><strong>{row.skill} · {row.tag}</strong><p>{row.reason}{row.lessonId?<> Try {row.lessonId} · {row.lessonTitle}.</>:null}</p></div><button className="secondary-button" onClick={()=>onSkill(row.skill)}>Choose {row.skill} lessons</button></div>)}
     </div>:<p className="practice-empty">{observedGrammar.length?'No targeted Grammar recommendation yet. More distinct saved questions may be needed, or current evidence is not weak enough for remediation.':'Not enough documented evidence for a specific suggestion yet.'} You can still choose any lesson in the Course Catalog.</p>}
    </section>
   </div>
   <p className="muted">{data.adaptiveGrammar.note} {data.diagnosticNote} Diagnostic results and any working-level estimate belong to the separate assessment view; this page does not issue a CEFR certificate.</p>
  </>}
 </section>
}
