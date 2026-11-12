import {
 buildOfflineLessonReview,type PriorAttempt,type PriorLesson
} from '../domain/post-lesson-review';

/** Read-only instructional summary appended AFTER the saved submission. */
export function OfflineLessonReview({
 lesson,attempt
}:{lesson:PriorLesson;attempt:PriorAttempt}){
 const report=buildOfflineLessonReview(lesson,attempt);
 if(!report)return null;
 return <section className="panel foundation-offline-review"
  aria-label="Your next learning steps" role="region">
  <h3>Your next learning steps</h3>
  <p>{report.headline}</p>
  {report.objectiveTotal>0&&<p>
   <strong>{report.correct}/{report.objectiveTotal}</strong>
   {' '}objective answers correct. This is not a measure of proficiency.
  </p>}
  {report.actions.length>0&&<ol>
   {report.actions.map(a=><li key={a.questionId}>
    <strong>{a.questionId}:</strong> {a.advice}
   </li>)}
  </ol>}
  {report.reviewOnly>0&&<p>
   {report.reviewOnly} open response{report.reviewOnly===1?' is':'s are'}
   {' '}not included in this objective score. Any Writing evaluation
   remains pending trusted review.
  </p>}
  {report.formatOnly>0&&<p>
   {report.formatOnly} format-only response(s) were excluded from
   scored results and knowledge-error evidence.
  </p>}
  <small>{report.boundary} The advice is based on reviewed answer
   explanations stored with your attempt. It works without AI and
   does not modify your saved results.</small>
 </section>;
}
