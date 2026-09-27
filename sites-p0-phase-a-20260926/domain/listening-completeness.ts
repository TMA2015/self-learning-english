/** Local preflight only. Server-side validation remains authoritative. */
export type AnswerableQuestion={id:string};
export type ListeningCompletion={total:number;answered:number;unansweredIds:string[]};
export function listeningCompletion(
 questions:readonly AnswerableQuestion[],
 answers:Readonly<Record<string,string>>
):ListeningCompletion{
 const unansweredIds=questions.filter(q=>!(answers[q.id]??'').trim()).map(q=>q.id);
 return {total:questions.length,answered:questions.length-unansweredIds.length,unansweredIds};
}
export function listeningSubmitHint(summary:ListeningCompletion):string{
 if(summary.unansweredIds.length===0)return 'All questions answered. Submit when you are ready.';
 const count=summary.unansweredIds.length;
 return `${summary.answered}/${summary.total} answered · ${count} question${count===1?'':'s'} remaining.`;
}
