import {effectiveEvaluation} from "../domain/writing";
import type {LearningRepository,Scope} from '../domain/repository';
import type {WritingRepository,WritingSubmission,WritingEvaluation,WritingContext} from '../domain/writing';
import type {AITutor} from '../ai/contracts';
import {ratingEvidence,type LearnerModel} from '../domain/learning-model';
import {hash,learningService} from './learning-service';
import course from '../content/writing-course.json';
export function writingTutor(learning:LearningRepository,writing:WritingRepository,scope:Scope,tutor:AITutor){
 const model=learningService(learning,scope);
 async function submit(input:{text:string;kind:'draft'|'revision'|'sentence';parentId?:string;retry?:boolean}){
  if(typeof input.text!=='string'||!input.text.trim()||input.text.length>12000)throw Error('Write something first (up to 12,000 characters).');
  const text=input.text,taskId='school-garden';
  const history=await writing.readSubmissions(scope),prior=await writing.readEvaluations(scope);
  const parent=input.parentId?history.find(s=>s.id===input.parentId):undefined;
  if(input.kind!=='draft'&&(!parent||parent.taskId!==taskId))throw Error('Choose a saved submission from this account before revising.');
  const id=await hash({taskId,text,kind:input.kind,parentId:parent?.id??null});
  const submission:WritingSubmission=history.find(s=>s.id===id)??{id,learnerId:scope.learnerId,taskId,text,kind:input.kind,parentId:parent?.id,rootId:parent?.rootId??id,createdAt:Date.now()};
  await writing.appendSubmission(scope,submission); // Durable original text BEFORE any AI request.
  const previous=effectiveEvaluation(prior.filter(e=>e.submissionId===id));
  if(previous&&((previous.status==='validated'||previous.status==='approved')||!input.retry||previous.status==='pending'&&Date.now()-previous.at<60000)){
   // Recover a completed evaluation whose evidence write was interrupted.
   if((previous.status==='validated'||previous.status==='approved'))await model.recordEvidence(previous.evidence);
   return {submission,evaluation:previous,reused:true};
  }
  const run=prior.filter(e=>e.submissionId===id).length;
  const pending:WritingEvaluation={id:`${id}:teaching-1:${run}`,submissionId:id,status:'pending',at:Date.now(),evidence:[]};
  if(!await writing.claimEvaluation(scope,pending)){const found=(await writing.readEvaluations(scope)).find(e=>e.id===pending.id);return {submission,evaluation:found??pending,reused:true}}
  let evaluation:WritingEvaluation={...pending,status:'unavailable',reason:'Provisional – AI language evaluation unavailable',completedAt:Date.now()};
  if(tutor.available){
   try{
    const saved=await model.readState();await model.importLegacy(saved);const current=await model.rebuild(saved??{}),profile=current.learnerModel as LearnerModel|undefined;
    const context:WritingContext={ageGroup:'11–12',estimatedCEFR:profile?.estimates?.Writing?.assessed?profile.estimates.Writing.displayLevel??profile.estimates.Writing.level:profile?.displayLevel??'insufficient evidence',goals:String(current.profile?.goal??'Develop clear independent English writing').slice(0,500),subskills:Object.fromEntries(Object.entries(profile?.subskills??{}).filter(([tag])=>tag.startsWith('Writing: '))),previousErrors:(profile?.errorTags??[]).slice(0,12),recentPerformance:(await model.readEvidence()).filter(e=>e.skill==='Writing'&&!e.provisional).slice(-12).map(e=>({tag:e.tag,score:e.score,max:e.max})),priorRevisions:history.filter(s=>s.rootId===submission.rootId).slice(-3).map(s=>({text:s.text.slice(0,4000),feedback:prior.filter(e=>e.submissionId===s.id&&(e.status==='validated'||e.status==='approved')).at(-1)?.rating?.revisionSummary})),previousText:parent?.text,revisionScope:input.kind==='sentence'?'sentence':'draft'};
    const rating=await tutor.teachWriting(text,course.task,context);
    if(rating){
     const evidence=ratingEvidence(rating,'writing',`writing-review-${id}`,pending.at).map(e=>({...e,source:input.kind==='draft'?'writing' as const:'revision' as const,activityId:input.kind==='sentence'?`school-garden-sentence-${id}`:'school-garden-writing',raw:{submissionId:id,parentId:parent?.id},provisional:input.kind==='sentence'||!rating.canEstimateLevel,errorTags:rating.tags}));
     evaluation={...pending,status:'validated',rating,evidence,completedAt:Date.now()};
    }else evaluation={...pending,status:'failed',reason:'Submission saved. AI evaluation failed or returned an invalid result; no proficiency score was added.',completedAt:Date.now()};
   }catch{evaluation={...pending,status:'failed',reason:'Submission saved. AI evaluation could not be completed; no proficiency score was added.',completedAt:Date.now()}}
  }
  await writing.finishEvaluation(scope,evaluation);
  if(evaluation.status==='validated')await model.recordEvidence(evaluation.evidence);
  return {submission,evaluation,reused:false};
 }
 return {submit,async history(){return {submissions:await writing.readSubmissions(scope),evaluations:(await writing.readEvaluations(scope)).filter(e=>e.status!=="awaiting_approval"),aiAvailable:tutor.available}}};
}
