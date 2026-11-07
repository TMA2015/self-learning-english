'use client';
import type {LessonProgress} from '../domain/attempt-navigation';

/** One visual contract for a lesson's saved history, regardless of content release. */
export function LessonProgressMark({kind,hasDraft,awaitingReview}:LessonProgress){
 const label=kind==='submitted'
  ?(awaitingReview?'Submitted; awaiting review':hasDraft?'Previously submitted; another draft is open':'Submitted; not necessarily mastered')
  :kind==='draft'?'In progress'
  :kind==='unassessed'?'Saved without a score':'Not started';
 return <span className={'foundation-progress-mark is-'+kind} role="img"
  aria-label={label} title={label}>
  <span aria-hidden="true">{kind==='submitted'?'✓':kind==='draft'?'◷':kind==='unassessed'?'•':'○'}</span>
 </span>;
}
