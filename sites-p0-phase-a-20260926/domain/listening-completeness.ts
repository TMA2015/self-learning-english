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
 if(summary.unansweredIds.length===0)return `${summary.answered}/${summary.total} answered · All questions answered.`;
 const count=summary.unansweredIds.length;
 return `${summary.answered}/${summary.total} answered · ${count} question${count===1?'':'s'} remaining.`;
}

/** The player must never equate all answered with verified audio on a new attempt. */
export function listeningAudioHint(playbackCompleted:boolean,audioAvailable:boolean,playing:boolean):string{
 if(!audioAvailable)return 'Audio unavailable. Listening cannot be scored; use the unassessed skip option.';
 if(playbackCompleted)return 'Full audio verified for this attempt.';
 if(playing)return 'Audio is playing. Listen until it finishes and is verified.';
 return 'Audio not verified for this attempt. Play the full audio before submitting.';
}
