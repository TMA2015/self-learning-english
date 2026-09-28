'use client';
import type {PracticeProgress} from '../domain/practice-progress';

export function PracticeSummary({data,error,onRefresh,onSkill}:{data:PracticeProgress|null;error:string;onRefresh:()=>void;onSkill:(skill:string)=>void}){
 return <section className="panel" aria-label="Practice performance"><div className="section-head"><div><span className="eyebrow">SAVED ANSWERS</span><h2>Practice performance</h2></div><button className="secondary-button" onClick={onRefresh}>Refresh</button></div>
  {error&&<p role="alert">{error}</p>}
  {!data?<p>Loading saved practice answers…</p>:<>
   <p><strong>{data.overall.total?`${data.overall.correct}/${data.overall.total} correct · ${data.overall.accuracyPercent}%`:'No scored objective answers yet'}</strong></p>
   <p>{data.overall.uniqueQuestions} distinct question(s). The accuracy denominator counts every saved objective answer across attempts; each question counts once per attempt even when it has several tags. Coverage counts a question ID together with its package and exact content version.</p>
   <div className="debug-table"><table><thead><tr><th>Skill</th><th>Correct / attempts</th><th>Distinct questions</th></tr></thead><tbody>{data.skills.map(row=><tr key={row.skill}><td>{row.skill}</td><td>{row.correct}/{row.total} · {row.accuracyPercent}%</td><td>{row.uniqueQuestions}</td></tr>)}</tbody></table></div>
   <details><summary>Detailed tags and denominators</summary><div className="debug-table"><table><thead><tr><th>Skill / tag</th><th>Correct / attempts</th><th>Distinct questions</th></tr></thead><tbody>{data.tags.map(row=><tr key={`${row.skill}:${row.tag}`}><td>{row.skill} · {row.tag}</td><td>{row.correct}/{row.total} · {row.accuracyPercent}%</td><td>{row.uniqueQuestions}</td></tr>)}</tbody></table></div><p>A question with multiple tags appears once in each relevant tag, and once overall. No data for a tag means unobserved, not 0% mastery.</p></details>
   <h3>Repeated mistakes</h3>{data.repeatedMistakes.length?data.repeatedMistakes.map(row=><p key={`${row.version}:${row.questionId}`}>{row.questionId} · content {row.version}: incorrect {row.incorrect}/{row.total} attempts.</p>):<p>No question has two saved incorrect objective answers.</p>}
   <h3>Writing review</h3><p>Foundation: {data.writing.foundation.pending} awaiting adult review; {data.writing.foundation.approved} approved. Writing Coach: {data.writing.legacy.pending} submitted without approved review; {data.writing.legacy.approved} approved. Drafts and pending reviews receive no quality score.</p>
   <h3>Suggested practice</h3>{data.suggestions.length?data.suggestions.map(row=><div key={`${row.skill}:${row.tag}`} className="skill-row"><div><strong>{row.skill} · {row.tag}</strong><span>{row.reason}{row.lessonId?` Try ${row.lessonId} · ${row.lessonTitle}.`:''}</span></div><button className="text-button" onClick={()=>onSkill(row.skill)}>Choose {row.skill} lessons</button></div>):<p>Not enough repeated, documented weak answers for a specific suggestion. You can choose any lesson in the Course Catalog.</p>}
   <p className="muted">{data.diagnosticNote} Diagnostic results and any working-level estimate belong to the separate assessment view; this page does not issue a CEFR certificate.</p>
  </>}
 </section>
}
