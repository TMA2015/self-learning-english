"use client";
import {useEffect,useState} from "react";
import type {Evidence,LearnerModel,LearningPlanModel} from "./learning-model";
import {coreBank} from "./core-bank";
import {questions} from "./learning-model";
export type LearningChoice="ai"|"skill"|"course"|"exam";
type AvailableCourse={
 id:string;title:string;progressLabel:string;nextActivity:string;
};
type CourseChoices={courses:AvailableCourse[];activeCourseId:string|null};
export function LearningPlan({
 plan,model,onDiagnostic,onWriting,choice='ai',onChoice,onNavigate,courses
}:{
 plan?:LearningPlanModel;model?:LearnerModel;onDiagnostic:()=>void;
 onWriting:()=>void;choice?:LearningChoice;onChoice?:(c:LearningChoice)=>void;
 onNavigate?:(view:string)=>void;courses?:CourseChoices|null;
}){
 return <>
  <div className="eyebrow">MY LEARNING · PERSONALIZED PLAN</div>
  <div className="page-heading"><div>
   <h1>Your learning plan</h1>
   <p>A starting plan that changes as your own work adds evidence.</p>
  </div></div>
  <div className="learning-choices" role="group" aria-label="Choose your learning path">
   {([['ai','Recommended Learning Plan'],['skill','Choose a skill'],['course','Choose a course'],['exam','IELTS / TOEFL preparation']] as [LearningChoice,string][]).map(([key,label])=>
    <button className={choice===key?"primary-button":"secondary-button"} type="button" aria-pressed={choice===key}
     onClick={()=>onChoice?.(key)} key={key}>{label}</button>)}
  </div>
  {choice==='ai'?(plan&&model?<><p className="notice">
   Recommended order: {plan.items.filter(i=>i.priority==='Focus').map(i=>i.skill).join(' → ')}.
   This is a rule-based learning plan from saved Diagnostic and Writing assessment evidence, not a generative AI recommendation.
   Foundation lesson submissions are not yet included in this priority ranking.
  </p>
  <div className="plan-grid">{plan.items.map((item,i)=>
   <section className="panel plan-card" key={item.skill}>
    <span className={item.priority==='Focus'?'status-chip focus':'status-chip'}>{item.priority}</span>
    <h2>{i+1}. {item.skill}</h2><p>{item.reason}</p>
    <strong>Next small step</strong><p>{item.action}</p>
    <button className="text-button" type="button"
     onClick={()=>item.skill==='Writing'?onWriting():onNavigate?.(item.skill.toLowerCase())}>
     {item.skill==='Writing'?'Continue Writing':'Open '+item.skill+' Library'}
    </button>
   </section>)}</div>
  <p className="muted">Estimated overall: {model.displayLevel??model.level} · {model.confidence} confidence
   {model.confidencePercent!==undefined?' ('+model.confidencePercent+'%)':''}.
   Stronger skills stay in the plan for maintenance. This is not a formal CEFR award.</p>
  </>:<section className="panel">
   <h2>Find your starting point</h2>
   <p>Complete the Diagnostic Assessment to receive evidence-based skill priorities.</p>
   <button type="button" className="primary-button" onClick={onDiagnostic}>Start diagnostic</button>
  </section>)
  :choice==='skill'?<section className="panel">
   <h2>Choose a skill</h2><p>Open the current Skill Library. These are lessons, not separate enrollable courses.</p>
   <div className="learning-choices">
    {['Grammar','Vocabulary','Reading','Writing','Listening','Speaking','Pronunciation'].map(skill=>
     <button type="button" className="secondary-button" key={skill}
      onClick={()=>onNavigate?.(skill.toLowerCase())}>{skill}</button>)}
   </div>
  </section>
  :choice==='course'?<section className="panel" aria-label="Available specialist courses">
   <h2>Choose a course</h2>
   <p className="muted">Courses have their own programme and saved course progress.
    Individual Foundation lessons remain in Learn by Units and Skill Library.</p>
   {!courses?<p role="status">Loading available courses…</p>:
    courses.courses.length===0?<p>No specialist courses are currently available.</p>:
    <div className="course-choice-grid">
     {courses.courses.map(course=><article className="course-choice-card" key={course.id}>
      <span className="status-chip live">{courses.activeCourseId===course.id?'Your active course':'Available course'}</span>
      <h3>{course.title}</h3>
      <p>Build ideas, analyse prompts, draft and revise writing through guided weekly practice.</p>
      <p className="course-choice-progress">{course.progressLabel} · Week 1 process only</p>
      <p>Next step: {course.nextActivity}</p>
      <div className="learning-choices">
       <button className="primary-button" type="button" onClick={()=>onNavigate?.('writing-course')}>Open course</button>
       <button className="secondary-button" type="button" onClick={()=>onNavigate?.('courses')}>
        {courses.activeCourseId===course.id?'Manage course':'Select as active course'}
       </button>
      </div>
     </article>)}
    </div>}
  </section>
  :<section className="panel">
   <h2>IELTS / TOEFL · future specialization</h2>
   <p>Exam-preparation courses are not available yet. The CEFR Unit path and Skill Library remain accessible.</p>
   <button className="secondary-button" type="button" onClick={()=>onNavigate?.('specialization')}>View specialization roadmap</button>
  </section>}
 </>;
}

type DebugData={traces:ReturnType<typeof import("../domain/assessment-inspector").inspectAssessment>[];engineVersion:string;identityScope:string;formula:string;model?:LearnerModel;history:{model:LearnerModel;engineVersion:string;at:number}[];events:Evidence[];nextOffset:number|null};
export function DeveloperView(){const [data,setData]=useState<DebugData|null>(null),[error,setError]=useState(""),[busy,setBusy]=useState(false);async function load(offset=0){setBusy(true);setError("");try{const r=await fetch(`/api/debug?offset=${offset}`);const d=await r.json() as DebugData&{error?:string};if(!r.ok)throw Error(d.error??"Unable to load evidence");setData(d)}catch(e){setError(e instanceof Error?e.message:"Unable to load evidence")}finally{setBusy(false)}}useEffect(()=>{void load()},[]);
 return <><div className="eyebrow">ADMINISTRATOR · DEVELOPER TOOLS</div><div className="page-heading"><div><h1>Assessment Inspector</h1><p>Read-only explanation of this account's learner model. Hidden from normal learner navigation.</p></div><button className="secondary-button" disabled={busy} onClick={()=>void load()}>Refresh evidence</button></div>{error&&<p role="alert">{error}</p>}{!data?<p>Loading evidence…</p>:<><section className="panel"><h2>Engine {data.engineVersion}</h2><p>{data.identityScope}</p><p>{data.formula}</p><p>Adaptive stopping: at least 3 responses per subskill and confidence ≥80%, or 4 per subskill and confidence ≥75%. Maximum 5 per subskill. Difficulty changes by one level after four responses; no subskill is targeted solely because of one wrong answer.</p><p>Contradictory patterns (harder items correct while easier items are wrong) cap confidence at 59% when at least 8 such cross-level comparisons exist and over 45% are inverted. Current mastery uses the latest baseline and subsequent work. Older events remain in the ledger. Revisions replace the same task's contribution, but all versions remain inspectable.</p><p>CEFR reference: <a href="https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions" target="_blank" rel="noreferrer">Council of Europe level descriptions</a>. Items and confidence calculations are classroom screening tools, not psychometrically calibrated certification.</p></section><section className="panel progress-bottom"><h2>Confidence calculation by skill</h2><div className="debug-table"><table><thead><tr><th>Skill</th><th>CEFR</th><th>Confidence</th><th>Coverage</th><th>Amount</th><th>Precision</th><th>Stability</th></tr></thead><tbody>{Object.entries(data.model?.estimates??{}).map(([skill,e])=><tr key={skill}><td>{skill}</td><td>{e.displayLevel??e.level}</td><td>{e.confidence} · {e.confidencePercent??0}%</td>{['coverage','amount','precision','stability'].map(key=><td key={key}>{e.confidenceParts?.[key as keyof typeof e.confidenceParts]??"—"}</td>)}</tr>)}</tbody></table></div><p>Writing confidence depends on distinct AI-reviewed tasks and is capped at 75%. Synthetic Listening confidence is capped at 59%. Overall confidence excludes unassessed skills and is reduced when Writing is missing. No overall estimate appears until all three objective areas have minimum coverage.</p></section><section className="panel progress-bottom"><h2>Mastery change history</h2>{data.history.length?data.history.map((h,i)=>{const prior=data.history[i+1]?.model;return <details className="assessment-review" key={`${h.at}-${i}`}><summary>{new Date(h.at).toLocaleString()} · {h.model.displayLevel??h.model.level} · {h.model.confidencePercent??0}% confidence</summary><p>Engine: {h.engineVersion}. {prior?"Changes since preceding snapshot:":"First stored snapshot; no earlier change can be inferred."}</p>{Object.entries(h.model.estimates).map(([skill,e])=>{const old=prior?.estimates[skill as keyof typeof prior.estimates];return <p key={skill}><strong>{skill}:</strong> {old?`${old.displayLevel??old.level} (${old.evidenceCount} items) → `:""}{e.displayLevel??e.level} ({e.evidenceCount} items). {e.note}</p>})}<p>A changed evidence count, response pattern, coverage, or engine version can change the estimate. Review the contributing events below; one submission may contribute several criteria.</p></details>}):<p>No saved mastery snapshots yet. Complete and save an activity to create one.</p>}</section><section className="panel progress-bottom"><h2>Response-by-response assessment replay</h2>{data.traces.map((trace,i)=><details key={trace.sessionId??i}><summary>{trace.sessionId??"Legacy session"} · {trace.rows.length} responses</summary><p>{trace.note}</p><div className="debug-table"><table><thead><tr><th>Question / subskill</th><th>Item</th><th>Result / evidence</th><th>Estimated CEFR</th><th>Confidence</th><th>Reason</th></tr></thead><tbody>{trace.rows.map(row=><tr key={row.questionId}><td>{row.questionId}<br/>{row.skill} / {row.subskill}</td><td>{row.itemLevel}</td><td>{row.correct?"Correct":"Incorrect"} · {row.subskillEvidence} responses</td><td>{row.cefrBefore} → {row.cefrAfter}</td><td>{row.confidenceBefore}% → {row.confidenceAfter}%<details><summary>Components</summary><pre>{JSON.stringify(row.confidenceParts,null,2)}</pre></details></td><td>{row.reason}</td></tr>)}</tbody></table></div></details>)}</section><section className="panel progress-bottom"><h2>Contributing evidence · {data.events.length} events on this page</h2>{data.events.map(e=>{const q=[...coreBank,...questions].find(q=>q.id===e.questionId);return <details className="assessment-review" key={e.id}><summary>{e.skill} / {e.tag} · {e.provisional?"provisional":`${e.score}/${e.max}`} · {e.source}</summary><p>Event: {e.id}</p><p>Question: {e.questionId??"Writing or practice task"} · Item level: {e.level??"not assigned"}</p>{q&&<p>{q.prompt}</p>}<p>{e.at<(data.model?.diagnosticAt??0)?"Historical baseline; retained but not in the current estimate.":e.provisional?"Excluded from language proficiency; retained as activity evidence.":"Eligible for current mastery; only the latest revision of each Writing task criterion contributes."}</p><p>{e.detail}</p><pre className="debug-json">{JSON.stringify(e.raw??{note:"Original answer was not captured by the earlier engine."},null,2)}</pre></details>})}<button className="secondary-button" disabled={busy||data.nextOffset===null} onClick={()=>data.nextOffset!==null&&void load(data.nextOffset)}>Next evidence page</button></section></>}</>;
}
