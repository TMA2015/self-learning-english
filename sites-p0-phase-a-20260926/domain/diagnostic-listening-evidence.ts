import {coreListening} from './core-listening';
import {deriveLearner,inference,type DiagnosticV2,type Evidence,type ListeningAttempt,type ListeningResult} from './learning-model';

/** Verify actual saved, completed playback answers. Missing or skipped work is never inferred. */
export function validDiagnosticListening(answers:ListeningAttempt[]|undefined):answers is ListeningAttempt[]{
 return Array.isArray(answers)&&answers.length===coreListening.length&&
  answers.every((a,i)=>a?.id===coreListening[i].id&&a.played===true&&
   Number.isInteger(a.answer)&&a.answer>=0&&a.answer<coreListening[i].options.length);
}

export function scoreDiagnosticListening(answers:ListeningAttempt[],sessionId:string,at:number):ListeningResult{
 if(!validDiagnosticListening(answers))throw new Error('Finish all Listening questions, or explicitly skip Listening.');
 const subskills:ListeningResult['subskills']={};
 let correct=0;
 const evidence:Evidence[]=answers.map((a,i)=>{
  const task=coreListening[i],ok=Number(a.answer===task.correct);
  correct+=ok;
  subskills[task.tag]??={correct:0,total:0};
  subskills[task.tag].correct+=ok;
  subskills[task.tag].total++;
  return {id:`listen-${sessionId}-${a.id}`,activityId:`listen-${sessionId}`,source:'listening',
   skill:'Listening',tag:task.tag,level:task.level,score:ok,max:1,at,
   mode:'rubric',questionId:a.id,raw:a};
 });
 return {correct,total:coreListening.length,confidence:'low',subskills,
  note:'Recorded Listening screen; a provisional classroom estimate, not a standardised listening test.',evidence};
}

/**
 * Continue the missing recordings of one completed, explicitly skipped
 * Diagnostic without changing the original historical result. Only the
 * previously verified contiguous playback answers are reusable.
 *
 * The follow-up receives a NEW session ID; finishing it appends a separate
 * historical assessment, while original score/attempts remain intact.
 */
export function canCompleteSavedListening(session:DiagnosticV2):boolean{
 const saved=session.listening;
 return session.version===4&&!!session.result&&session.listeningSkipped===true&&
  !session.listeningSupplementOf&&
  !(session.writingReviews??[]).some(Boolean)&&
  Array.isArray(saved)&&saved.length>0&&saved.length<coreListening.length&&
  saved.every((a,i)=>a?.id===coreListening[i].id&&a.played===true&&
   Number.isInteger(a.answer)&&a.answer>=0&&a.answer<coreListening[i].options.length);
}
export function startSavedListeningSupplement(session:DiagnosticV2,now=Date.now()):DiagnosticV2{
 if(!canCompleteSavedListening(session)||!Number.isSafeInteger(now)||now<1)
  throw new Error('There are no verified partial Listening answers to continue.');
 const originalId=session.sessionId??String(session.startedAt);
 return {...session,sessionId:`${originalId}-listening-supplement-${now}`,
  startedAt:now,finishedAt:undefined,paused:false,
  result:undefined,listeningSkipped:false,listeningEvidenceRecovered:undefined,
  listeningSupplementOf:originalId};
}

/**
 * Read-only recovery for completed historical diagnostics with all 15 saved
 * verified playback answers but a missing Listening result. The original
 * persisted assessment and evidence log remain byte-identical.
 *
 * If responses are missing, partial, skipped or otherwise invalid, do nothing:
 * there is no basis for guessing a score or CEFR level.
 */
export function presentSavedListening(session:DiagnosticV2):DiagnosticV2{
 if(session.version!==4||!session.result||session.result.listening||
    session.listeningSkipped===true||!validDiagnosticListening(session.listening))return session;
 const id=session.sessionId??String(session.startedAt),at=session.result.at;
 const listening=scoreDiagnosticListening(session.listening,id,at);
 const existing=session.result.evidence??[];
 const seen=new Set(existing.map(e=>e.id));
 const evidence=[...existing,...(listening.evidence??[]).filter(e=>!seen.has(e.id))];
 const estimates={...session.result.estimates,
  Listening:inference(evidence.filter(e=>e.skill==='Listening'),'Listening')};
 const provisional={...session.result,evidence,listening,estimates};
 const derived=deriveLearner(provisional,evidence,'');
 const result={...provisional,...derived,evidence,at};
 return {...session,result,listeningEvidenceRecovered:true};
}
