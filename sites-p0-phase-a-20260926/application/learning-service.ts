import type {LearningRepository,Scope,LearnerState} from '../domain/repository';
import {deriveLearner,derivePlan,makeDiagnostic,type DiagnosticV2,type Evidence,type LearnerModel} from '../domain/learning-model';
import {ENGINE_VERSION} from '../domain/adaptive-engine';
import {presentSavedListening} from '../domain/diagnostic-listening-evidence';
export async function hash(value:unknown){const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(value)));return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('')}
export function learningService(repository:LearningRepository,scope:Scope){
 const readState=()=>repository.readState(scope),readEvidence=()=>repository.readEvidence(scope),readAssessments=()=>repository.readAssessments(scope),readSnapshots=()=>repository.readSnapshots(scope);
 const recordEvidence=(events:Evidence[])=>repository.appendEvidence(scope,events);
 async function recordAssessment(session:DiagnosticV2){await recordEvidence(session.result?.evidence??[]);await repository.appendAssessment(scope,session)}
 async function getAssessment(id:string){return (await readAssessments()).find(d=>(d.sessionId??String(d.startedAt))===id)??null}
 async function importLegacy(state:LearnerState|null){if(await repository.legacyImported(scope))return;state=state??{};const diagnostics:DiagnosticV2[]=[...(state.diagnosticArchive??[]),...(state.diagnosticV2?[state.diagnosticV2]:[])];const imported:Evidence[]=[...(state.evidence??[]),...diagnostics.flatMap(d=>d.result?.evidence??[])];await recordEvidence(imported.map(e=>({...e,engineVersion:e.engineVersion??'legacy-import'})));for(const d of diagnostics)if(d.result)await recordAssessment(d);await repository.markLegacyImported(scope)}
 async function rebuild(state:LearnerState){
  const evidence=await readEvidence();
  const stored=(await readAssessments())[0];
  const inState=state.diagnosticV2 as DiagnosticV2|undefined;
  const same=!!stored&&!!inState&&
    (stored.sessionId??String(stored.startedAt))===(inState.sessionId??String(inState.startedAt));
  // Older sessions occasionally retained answers in the learner state but not
  // in the immutable assessment row. Use only full, verified playback answers.
  const candidate=stored&&same&&!stored.listening?.length&&inState?.listening?.length?
    {...stored,listening:inState.listening,listeningSkipped:stored.listeningSkipped??inState.listeningSkipped}:stored;
  const latest=candidate?presentSavedListening(candidate):null;
  const baseline=latest?.result??(evidence.some(e=>!e.provisional&&(e.mode==='ai'||e.id.startsWith('foundation:')))?
   makeDiagnostic([], '',Math.min(...evidence.map(e=>e.at))):undefined);
  if(!baseline){const {learnerModel,learningPlan,...rest}=state;return {...rest,evidence} as LearnerState}
  const learnerModel=deriveLearner(baseline,evidence,state.profile?.goal??'Build balanced English skills');
  const learningPlan=derivePlan(learnerModel);
  const restore=latest&&(!inState||same);
  // Display projection only: original assessment row, event log and historical
  // scores remain unchanged and replayable.
  return {...state,...(restore?{diagnosticV2:latest}:{}),evidence,learnerModel,learningPlan}
 }

 async function snapshot(model?:LearnerModel){if(model)await repository.appendSnapshot(scope,await hash({...model,updatedAt:0}),{model,engineVersion:ENGINE_VERSION,at:Date.now()})}
 async function saveState(state:LearnerState){await snapshot(state.learnerModel);await repository.writeState(scope,state)}
 async function auditRows(offset:number){const all=await readEvidence();return {events:all.slice(offset,offset+100),nextOffset:all.length>offset+100?offset+100:null}}
 return {readState,readEvidence,readAssessments,readSnapshots,recordEvidence,recordAssessment,getAssessment,importLegacy,rebuild,snapshot,saveState,auditRows};
}
