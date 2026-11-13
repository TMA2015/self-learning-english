import {
 buildOfflineLessonReview,type PriorAttempt,type PriorLesson
} from '../domain/post-lesson-review';

/** After-submit, read-only next steps. The result summary already shows the score. */
export function OfflineLessonReview({
 lesson,attempt,onReviewQuestion
}:{
 lesson:PriorLesson;
 attempt:PriorAttempt;
 onReviewQuestion?:(questionId:string)=>void;
}){
 const report=buildOfflineLessonReview(lesson,attempt);
 if(!report)return null;
 return <section className="panel foundation-offline-review"
  aria-label="What to practise next" role="region">
  <h3>What to practise next</h3>
  {report.actions.length>0?<>
   <p className="foundation-review-intro">Focus on the {report.actions.length===1?'question':'questions'} you missed:</p>
   <ol className="foundation-review-actions">
    {report.actions.map(a=><li key={a.questionId}>
     <div className="foundation-review-action-head">
      <strong>Question {a.questionId.split('-').at(-1)?.replace(/^Q/,'')}</strong>
      {onReviewQuestion&&<button type="button" className="secondary-button"
       onClick={()=>onReviewQuestion(a.questionId)}
       aria-label={'Go to '+a.questionId}>Go to question</button>}
     </div>
     <p>{a.advice}</p>
    </li>)}
   </ol>
  </>:<p>{report.headline}</p>}
  {report.reviewOnly>0&&<p>
   {report.reviewOnly} open response{report.reviewOnly===1?' is':'s are'} saved for review.
  </p>}
  {report.formatOnly>0&&<p>
   {report.formatOnly} response{report.formatOnly===1?' needs':'s need'} an answer-format correction.
  </p>}
 </section>;
}
