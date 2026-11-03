'use client';
import type {PracticeProgress} from '../domain/practice-progress';

export function PracticeSummary({data,error,onRefresh,onSkill}:{data:PracticeProgress|null;error:string;onRefresh:()=>void;onSkill:(skill:string)=>void}){
 return <section className="panel" aria-label="Practice performance"><div className="section-head"><div><span className="eyebrow">SAVED ANSWERS</span><h2>Practice performance</h2></div><button className="secondary-button" onClick={onRefresh}>Refresh</button></div>
  {error&&<p role="alert">{error}</p>}
  {!data?<p>Loading saved practice answers…</p>:<>
   <p><strong>{data.overall.total?`${data.overall.correct}/${data.overall.total} correct · ${data.overall.accuracyPercent}%`:'No scored objective answers yet'}</strong></p>
   <p>{data.overall.uniqueQuestions} distinct question(s). The accuracy denominator counts every scored objective answer across attempts; each question counts once per attempt even when it has several tags. Coverage counts a question ID together with its package and exact content version.</p>
   <p>{data.formatOnly??0} confirmed format-only response(s) are saved but unscored: excluded from accuracy, scored coverage, repeated mistakes and recommendations. Submission records participation, not mastery.</p>
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
     <div className="practice-block-heading"><h3 id="practice-suggestions-heading">Suggested practice</h3><p>Based on saved answers. You choose which lesson to open.</p></div>
     {data.suggestions.length?<div className="practice-suggestion-list">{data.suggestions.map(row=><div key={row.skill+':'+row.tag} className="practice-suggestion"><div><strong>{row.skill} · {row.tag}</strong><p>{row.reason}{row.lessonId?<> Try {row.lessonId} · {row.lessonTitle}.</>:null}</p></div><button className="secondary-button" onClick={()=>onSkill(row.skill)}>Choose {row.skill} lessons</button></div>)}</div>:<p className="practice-empty">Not enough repeated, documented weak answers for a specific suggestion. You can choose any lesson in the Course Catalog.</p>}
    </section>
   </div>
   <p className="muted">{data.diagnosticNote} Diagnostic results and any working-level estimate belong to the separate assessment view; this page does not issue a CEFR certificate.</p>
  </>}
 </section>
}
