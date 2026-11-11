import {nextActionForIncorrect} from './foundation-recovery-tip';

/**
 * Free-first, read-only post-submission learning advice.
 * Reads only an already submitted, version-pinned attempt's own result text.
 * No AI calls, remote transfer, score recalculation, stored learner writes,
 * unlocks, CEFR awards, or claims of writing/speaking proficiency.
 */
export type PriorResult={
 id:string;correct:boolean|null;outcome?:'format-only';
 explanation?:string;tags?:string[];
};
export type PriorAttempt={
 status:'started'|'scored'|'pending_review'|'approved'|'unassessed';
 version:string;results?:PriorResult[];
};
export type PriorLesson={id:string;module:string;title:string};
export type LearningRepair={questionId:string;advice:string};
export type OfflineLessonReview={
 correct:number;objectiveTotal:number;incorrect:number;
 reviewOnly:number;formatOnly:number;
 headline:string;actions:LearningRepair[];boundary:string;
};
const safe=(value:string)=>value.replace(/\s+/g,' ').trim();
function authoredAction(explanation:string):string|null{
 const match=explanation.match(/(?:^|\.\s+|;\s+|\n)Next step:\s*([\s\S]+)$/i);
 if(!match)return null;
 const tip=safe(match[1]).slice(0,420);
 return tip.length>=12?tip:null;
}
export function buildOfflineLessonReview(
 lesson:PriorLesson,attempt:PriorAttempt
):OfflineLessonReview|null{
 // No hints, keys or analysis before a learner has submitted this attempt.
 if(attempt.status==='started'||!Array.isArray(attempt.results)||
  attempt.results.length===0)return null;
 const rows=attempt.results;
 const objective=rows.filter(r=>r.outcome!=='format-only'&&
  typeof r.correct==='boolean');
 const correct=objective.filter(r=>r.correct===true).length;
 const incorrect=objective.length-correct;
 const reviewOnly=rows.filter(r=>r.correct===null&&r.outcome!=='format-only').length;
 const formatOnly=rows.filter(r=>r.outcome==='format-only').length;
 const actions=objective.filter(r=>r.correct===false).slice(0,2).map(r=>({
  questionId:r.id,
  advice:authoredAction(r.explanation??'')??
   nextActionForIncorrect(lesson.module,r.id,attempt.version)
 }));
 const boundary=lesson.module==='speaking'
  ?'This assesses language-preparation choices, not speaking fluency, pronunciation or a CEFR level.'
  :lesson.module==='pronunciation'
   ?'Text or listening awareness does not measure spoken pronunciation proficiency.'
   :'These results describe this attempt only, not a certified CEFR level.';
 const headline=incorrect>0
  ?'Review the missed questions, then try a new example.'
  :objective.length>0
   ?'All objective answers were correct. Practise a new context to check retention.'
   :reviewOnly>0
    ?'Your open response is saved. It still needs a trusted review.'
    :'Your submission is saved. No objective knowledge score was awarded.';
 return {correct,objectiveTotal:objective.length,incorrect,reviewOnly,
  formatOnly,headline,actions,boundary};
}
