import {coreListening} from './core-listening';
import {deriveLearner,inference,type DiagnosticV2,type Evidence,type ListeningAttempt,type ListeningResult} from './learning-model';

/** Verify actual saved, completed playback answers. Missing or skipped work is never inferred. */
export function validDiagnosticListening(answers:ListeningAttempt[]|undefined):answers is ListeningAttempt[]{
 return Array.isArray(answers)&&answers.length===coreListening.length&&
  answers.every((a,i)=>a?.id===coreListening[i].id&&a.played===true&&
   Number.isInteger(a.answer)&&a.answer>=0&&a.answer<coreListening[i].options.length);
}

export function scoreDiagnosticListening(answers:ListeningAttempt[],sessionId:string,at:number):ListeningResult{
 if(!validDiagnosticListening(answers))throw new Error('Finish every Listening audio question or explicitly skip Listening.');
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
