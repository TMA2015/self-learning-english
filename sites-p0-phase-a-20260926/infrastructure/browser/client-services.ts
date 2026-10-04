import {AcademicError} from '../../domain/academic';
import type {LearnerState} from '../../domain/repository';
import {localAcademicRuntime,localLearningRuntime,localPracticeProgress} from './local-runtime';

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
        case 'submit':return await service.submit(b.id) as T;
        case 'skip':return await service.skipListening(b.id) as T;
        default:throw new AcademicError('Unknown activity action.');
      }
    }
    const parsed=new URL(url,window.location.origin);
    if(parsed.searchParams.has('transcript'))return await service.transcript(parsed.searchParams.get('transcript')!) as T;
    if(parsed.searchParams.has('lesson'))return await service.lesson(parsed.searchParams.get('lesson')!,parsed.searchParams.get('version')??undefined) as T;
    if(parsed.searchParams.has('audio'))throw new AcademicError('Browser-local recording playback is not enabled yet.',501);
    return await service.catalog() as T;
  }catch(error){
    throw new Error(error instanceof AcademicError?error.message:'Could not save or load this activity. Your existing records are preserved.');
  }
}

export async function loadPracticeProgress(){
  if(!browserLearningEnabled()){
    const response=await fetch('/api/practice-progress');
    const data=await response.json();
    if(!response.ok)throw new Error(data.error??'Practice progress unavailable');
    return data;
  }
  return localPracticeProgress();
}
