import {recordAnswer,nextQuestion,type DiagnosticV2,type Attempt} from './learning-model';
import {adaptiveStatus} from './adaptive-engine';
/** Replay the stored responses, not client-supplied correctness flags. v4 only. */
export function inspectAssessment(session:DiagnosticV2){
 if(session.version!==4)return {sessionId:session.sessionId,legacy:true,rows:[],note:'Legacy session retained; its original stopping policy is unchanged.'};
 let attempts:Attempt[]=[];const rows=[];
 for(const answer of session.attempts){const q=nextQuestion(attempts,4);if(!q||q.id!==answer.id||!/^[0-2]$/.test(answer.answer))return {sessionId:session.sessionId,rows,note:'Replay stopped at an invalid or unsupported historical sequence.'};
 const before=adaptiveStatus(attempts).find(s=>s.skill===q.skill)!;attempts=recordAnswer(attempts,q,Number(answer.answer));const after=adaptiveStatus(attempts).find(s=>s.skill===q.skill)!;
 const label=(s:typeof after)=>s.round>=2?s.estimate.displayLevel:'insufficient evidence';
 rows.push({questionId:q.id,skill:q.skill,subskill:q.tag,itemLevel:q.level,correct:attempts.at(-1)!.correct,subskillEvidence:attempts.filter(a=>a.skill===q.skill&&a.tag===q.tag).length,cefrBefore:label(before),cefrAfter:label(after),abilityBefore:before.estimate.mean,abilityAfter:after.estimate.mean,confidenceBefore:before.estimate.confidencePercent,confidenceAfter:after.estimate.confidencePercent,confidenceParts:after.estimate.confidenceParts,nextDifficulty:after.target,reason:after.finished?after.stop:label(before)!==label(after)?'Accumulated likelihood and minimum coverage changed the displayed estimate.':'Posterior updated; level retained or minimum coverage still pending.'});
 }
 return {sessionId:session.sessionId,legacy:false,rows,note:'Internal estimates are shown for auditing; learner CEFR requires at least two responses for every subskill.'};
}
