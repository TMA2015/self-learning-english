import {AcademicError} from '../../domain/academic';
import type {LearnerState} from '../../domain/repository';
import {writingEvidence,type DiagnosticResult,type DiagnosticV2,type Evidence,type WritingRating} from '../../domain/learning-model';
import {localAcademicRuntime,localCourseRuntime,localLearningRuntime,localPracticeProgress} from './local-runtime';
import type {myCourses,CourseSelection} from '../../domain/course-p1';
import {finishLocalDiagnostic} from './local-diagnostic';
import {publicPath} from './public-path';
import {pilotProgressEvidence} from '../../domain/writing-course-v2';
import {guidedWritingFeedback} from '../../application/guided-writing';
import {gardenRelevantIdeaResult} from '../../application/writing-practice';
import {browserTutorConfigured,browserTutorService,readAIFailure,resetAIFailure} from './firebase-ai-browser';
import writingCourse from '../../content/writing-course.json';
import type {TeachingRating,WritingContext} from '../../domain/writing';

export function browserLearningEnabled(){
  return process.env.NEXT_PUBLIC_LEARNING_RUNTIME==='browser';
}

async function jsonFetch<T>(url:string,body?:unknown):Promise<T>{
  const response=await fetch(url,body===undefined?undefined:{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(body),
  });
  const data=await response.json() as T&{error?:string};
  if(!response.ok)throw new Error(data.error??'Please retry.');
  return data;
}

export async function loadLearnerState():Promise<{state:LearnerState|null;storage:string}>{
  if(!browserLearningEnabled()){
    const response=await fetch('/api/state');
    if(!response.ok)throw new Error(response.status===401?'Sign in to save progress':'Storage unavailable — do not close this page');
    return response.json() as Promise<{state:LearnerState|null;storage:string}>;
  }
  const {service}=await localLearningRuntime();
  const previous=await service.readState();
  await service.importLegacy(previous);
  const rebuilt=await service.rebuild(previous??{});
  const state=(previous||rebuilt.evidence?.length)?rebuilt:null;
  return {state,storage:'local-browser'};
}

export async function saveLearnerState(next:LearnerState):Promise<{ok:true;storage:string;learnerModel?:unknown;learningPlan?:unknown}>{
  if(!browserLearningEnabled()){
    const response=await fetch('/api/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(next)});
    if(!response.ok)throw new Error('Save failed');
    return response.json();
  }
  if(!next||typeof next!=='object'||Array.isArray(next))throw new Error('Invalid progress data.');
  if(JSON.stringify(next).length>2_000_000)throw new Error('This work is too long to save.');
  const {service}=await localLearningRuntime();
  const body={...next};
  delete body.courseV1;
  const previous=await service.readState();
  await service.importLegacy(previous);
  if(body.diagnosticV2?.result){
    const canonical=await service.getAssessment(body.diagnosticV2.sessionId??String(body.diagnosticV2.startedAt));
    body.diagnosticV2=canonical?.result?{...body.diagnosticV2,...canonical}:{...body.diagnosticV2,result:undefined};
  }
  const state=await service.rebuild({...previous,...body});
  await service.saveState(state);
  return {ok:true,storage:'local-browser',learnerModel:state.learnerModel,learningPlan:state.learningPlan};
}

export async function foundationRequest<T=any>(url:string,body?:unknown):Promise<T>{
  if(!browserLearningEnabled())return jsonFetch<T>(url,body);
  const {service}=await localAcademicRuntime();
  try{
    if(body!==undefined){
      const b=body as any;
      switch(b.action){
        case 'start':return await service.start(b.lessonId,b.id,b.parentId) as T;
        case 'draft':return await service.draft(b.id,b.answers,b.audio) as T;
        case 'play':return await service.play(b.id,b.token) as T;
        case 'check-format':return await service.checkFormat(b.id) as T;
        case 'submit':return await service.submit(b.id) as T;
        case 'skip':return await service.skipListening(b.id) as T;
        default:throw new AcademicError('Unknown activity action.');
      }
    }
    const parsed=new URL(url,window.location.origin);
    if(parsed.searchParams.has('transcript'))return await service.transcript(parsed.searchParams.get('transcript')!) as T;
    if(parsed.searchParams.has('lesson')){
      const view=await service.lesson(parsed.searchParams.get('lesson')!,parsed.searchParams.get('version')??undefined);
      return {...view,audio:view.audio?{...view.audio,url:publicPath(view.audio.url)}:null,pronunciationAudio:view.pronunciationAudio?{...view.pronunciationAudio,url:publicPath(view.pronunciationAudio.url)}:null} as T;
    }
    if(parsed.searchParams.has('audio'))throw new AcademicError('Browser-local recording playback is not enabled yet.',501);
    return await service.catalog() as T;
  }catch(error){
    throw new Error(error instanceof AcademicError?error.message:'Could not save or load this activity. Your existing records are preserved.');
  }
}

export async function loadPracticeProgress(){
  if(!browserLearningEnabled()){
    const response=await fetch('/api/practice-progress');
    const data=await response.json() as {error?:string}&Record<string,unknown>;
    if(!response.ok)throw new Error(data.error??'Practice progress unavailable');
    return data;
  }
  return localPracticeProgress();
}

export async function loadMyCourses():Promise<ReturnType<typeof myCourses>>{
  if(!browserLearningEnabled())return jsonFetch<ReturnType<typeof myCourses>>('/api/course');
  const runtime=await localCourseRuntime();
  return runtime.load();
}

export async function selectMyCourse(
  activeCourseId:string|null,
  expectedRevision:number,
  requestId:string,
):Promise<{selection:CourseSelection}>{
  if(!browserLearningEnabled()){
    return jsonFetch<{selection:CourseSelection}>('/api/course',{activeCourseId,expectedRevision,requestId});
  }
  const runtime=await localCourseRuntime();
  return {selection:await runtime.select(activeCourseId,expectedRevision,requestId)};
}

export async function loadCapabilities():Promise<{isAdmin:boolean;writingAI:boolean;runtime:'browser'|'server'}>{
  if(browserLearningEnabled())return {isAdmin:false,writingAI:browserTutorConfigured(),runtime:'browser'};
  const response=await fetch('/api/capabilities');
  if(!response.ok)return {isAdmin:false,writingAI:false,runtime:'server'};
  const value=await response.json() as {isAdmin?:boolean;writingAI?:boolean};
  return {isAdmin:value.isAdmin===true,writingAI:value.writingAI===true,runtime:'server'};
}

export async function finishDiagnosticAssessment(value:DiagnosticV2):Promise<{
  result:DiagnosticResult;
  attempts:DiagnosticV2['attempts'];
  writingReviews:(WritingRating|null)[];
  writingAI:boolean;
}>{
  if(browserLearningEnabled())return finishLocalDiagnostic(value);
  return jsonFetch('/api/diagnostic',{
    version:value.version,
    sessionId:value.sessionId??String(value.startedAt),
    writing2:value.writing2,
    listening:value.listeningSkipped?[]:value.listening,
    attempts:value.attempts.map(answer=>({id:answer.id,answer:answer.answer})),
    writing:value.writing,
  });
}


async function browserWritingContext():Promise<WritingContext>{
  const {service}=await localLearningRuntime();
  const saved=await service.readState();
  const current=await service.rebuild(saved??{});
  const model=current.learnerModel;
  const evidence=await service.readEvidence();
  return {
    ageGroup:'11–12',
    estimatedCEFR:model?.displayLevel??'insufficient evidence',
    goals:String(current.profile?.goal??'Develop clear independent English writing').slice(0,500),
    subskills:Object.fromEntries(Object.entries(model?.subskills??{}).filter(([tag])=>tag.startsWith('Writing: '))) as WritingContext['subskills'],
    previousErrors:(model?.errorTags??[]).slice(0,12),
    recentPerformance:evidence.filter(row=>row.skill==='Writing'&&!row.provisional).slice(-12).map(row=>({tag:row.tag,score:row.score,max:row.max})),
    priorRevisions:[],
    revisionScope:'draft',
  };
}

function teachingFeedbackPayload(rating:TeachingRating):ReturnType<typeof guidedWritingFeedback>{
  return {
    summary:rating.summary,
    strengths:rating.strengths,
    improvements:rating.improvements,
    exercise:rating.exercise,
    scores:null,
    corrections:rating.corrections.map(({original,revised,why,tag})=>({original,revised,why,tag})),
    tags:rating.tags,
  };
}

export async function evaluateWritingProcess(
  stage:'analysis'|'brainstorm'|'outline'|'writing'|'revision',
  answer:Record<string,string>,
):Promise<{
  mode:'guided'|'ai';
  feedback:ReturnType<typeof guidedWritingFeedback>;
  evidence:Evidence[];
  evaluationStatus?:string;
  aiFailureReason?:string;
  rating?:TeachingRating;
  evaluation?:unknown;
}>{
  if(!browserLearningEnabled())return jsonFetch('/api/evaluate',{stage,answer});
  if(!answer||typeof answer!=='object'||Array.isArray(answer)||Object.values(answer).some(value=>typeof value!=='string'))
    throw new Error('Invalid answer fields.');

  const index=['analysis','brainstorm','outline','writing','revision'].indexOf(stage);
  const now=Date.now();
  const provisionalEvidence=pilotProgressEvidence(Math.min(index,3),answer,now).map(row=>({
    ...row,
    ...(stage==='revision'?{id:`revision-${row.id}`,source:'revision' as const,activityId:'school-garden-revision'}:{}),
  }));

  const {service}=await localLearningRuntime();
  await service.recordEvidence(provisionalEvidence);

  if(stage==='revision'){
    return {
      mode:'guided',
      feedback:{...guidedWritingFeedback('writing',answer),summary:'Basic structure: your revision is saved as progress, not a language proficiency assessment.'},
      evidence:provisionalEvidence,
    };
  }

  const tutor=browserTutorService();

  if(stage==='writing'&&tutor.available){
    const text=(answer.writing??'').trim();
    if(text){
      const rating=await tutor.teachWriting(text,writingCourse.task,await browserWritingContext());
      if(rating){
        const ratedEvidence=writingEvidence(3,answer,now,rating).map(row=>({...row,raw:{stage,answer},evaluation:rating.evaluation}));
        await service.recordEvidence(ratedEvidence);
        return {
          mode:'ai',
          feedback:teachingFeedbackPayload(rating),
          evidence:[...provisionalEvidence,...ratedEvidence],
          evaluationStatus:'validated',
          rating,
        };
      }
    }
  }

  if(stage!=='writing'&&tutor.available){
    const context=await browserWritingContext();
    const evaluation=await tutor.coach(stage,writingCourse.task,answer,{estimatedCEFR:context.estimatedCEFR});
    if(evaluation){
      return {
        mode:'ai',
        feedback:evaluation.structuredResult as ReturnType<typeof guidedWritingFeedback>,
        evidence:provisionalEvidence,
        evaluation,
      };
    }
  }

  return {
    mode:'guided',
    feedback:guidedWritingFeedback(stage==='writing'?'writing':stage,answer),
    evidence:provisionalEvidence,
    ...(stage==='writing'?{evaluationStatus:'pending_review'}:{}),
    aiFailureReason:tutor.available?aiFailureMessage(readAIFailure()):'Gemini is not configured for this browser.',
  };
}

export async function saveGardenRelevantIdea(answer:string):Promise<{evidence:Evidence[];correct:boolean}>{
  if(!browserLearningEnabled())return jsonFetch('/api/practice',{activityId:'garden-relevant-idea',answer});
  const result=gardenRelevantIdeaResult(answer);
  const {service}=await localLearningRuntime();
  await service.recordEvidence(result.evidence);
  return result;
}

/** Optional, explicit-click AI coaching for saved Writing exercises.
 * Does not alter official scores, CEFR estimates or adult review status. */
export type OnDemandWritingFeedback={
  model:string;
  provider:'firebase-ai-logic';
  reviewedAt:number;
  kind:'draft'|'planning';
  summary:string;
  strengths:string[];
  improvements:string[];
  exercise:string;
  scores:Record<string,number>|null;
  level:string|null;
  corrections:{original:string;why:string;hint:string}[];
};
export type OnDemandWritingResult=
  |{status:'validated';feedback:OnDemandWritingFeedback}
  |{status:'unavailable';reason:string};

const aiFailureMessage=(code:string|null)=>{
  switch(code){
    case 'app-check-permission':return 'Firebase App Check or API permission rejected the request. A site administrator must check the approved domain and App Check configuration.';
    case 'quota-rate-limit':return 'The free AI request quota or rate limit was reached. Your work is saved; try again later.';
    case 'client-timeout':case 'deadline-exceeded':return 'The AI request timed out. Your work remains saved; try again.';
    case 'backend-overload':return 'The AI service is busy. Try again later.';
    case 'invalid-response':return 'The AI response did not pass validation, so no score was assigned.';
    default:return 'The AI service did not return verified feedback. Your work remains saved for review.';
  }
};
export async function requestWritingAI(task:string,fields:Record<string,string>,kind:'draft'|'planning'):Promise<OnDemandWritingResult>{
  if(!browserLearningEnabled())return {status:'unavailable',reason:'AI feedback is only available in the browser learning runtime.'};
  if(!task.trim()||Object.values(fields).some(v=>typeof v!=='string'))return {status:'unavailable',reason:'The writing task is incomplete.'};
  const answer=Object.entries(fields).filter(([,v])=>v.trim()).map(([k,v])=>k+': '+v.trim()).join('\n');
  if(answer.trim().length<8||answer.length>7000)return {status:'unavailable',reason:'Write your own response (maximum 7,000 characters) before requesting feedback.'};
  const tutor=browserTutorService();
  if(!tutor.available)return {status:'unavailable',reason:'Gemini is not configured in this browser.'};
  resetAIFailure();
  try{
    if(kind==='draft'){
      const draft=fields.draft??fields.writing??answer;
      const rating=await tutor.teachWriting(draft,task,await browserWritingContext());
      if(rating){
        return {status:'validated',feedback:{
          model:rating.evaluation.model,provider:'firebase-ai-logic',reviewedAt:Date.now(),
          kind,summary:rating.summary,strengths:rating.strengths.slice(0,3),
          improvements:rating.improvements.slice(0,3),exercise:rating.exercise,
          scores:rating.scores,level:rating.canEstimateLevel?rating.level:null,
          corrections:rating.corrections.slice(0,3).map(c=>({original:c.original,why:c.why,hint:c.hint})),
        }};
      }
    }else{
      const context=await browserWritingContext();
      const evaluation=await tutor.coach('analysis',task,fields,{estimatedCEFR:context.estimatedCEFR,goals:context.goals});
      if(evaluation){
        const raw=evaluation.structuredResult as {summary:string;strengths:string[];improvements:string[];exercise:string};
        return {status:'validated',feedback:{
          model:evaluation.model,provider:'firebase-ai-logic',reviewedAt:Date.now(),
          kind,summary:raw.summary,strengths:raw.strengths.slice(0,3),
          improvements:raw.improvements.slice(0,3),exercise:raw.exercise,
          scores:null,level:null,corrections:[],
        }};
      }
    }
  }catch{
    // No private error or learner response is logged or displayed.
  }
  return {status:'unavailable',reason:aiFailureMessage(readAIFailure())};
}
