import type {LearningRepository,Scope} from '../domain/repository';
import type {WritingRepository,TeachingRating,WritingEvaluation} from '../domain/writing';
import type {AssistedReviewRepository,ReviewPacket} from '../domain/assisted-review';
import {ReviewError} from '../domain/assisted-review';
import {validateTeachingRating} from '../ai/teaching-validation';
import {hash,learningService} from './learning-service';
import {ratingEvidence,type LearnerModel} from '../domain/learning-model';
import {coreCatalog} from '../domain/core-bank';
import course from '../content/writing-course.json';
import rubric from '../content/writing-rubric.json';
import prompts from '../ai/prompts/registry.json';
const promptVersion='1.0.0';
const allowedTags=new Set([...Object.values(coreCatalog).flat(),'subject-verb agreement','tense','article','preposition','word choice','sentence structure','idea development','off-topic','spelling','punctuation']);
export function anonymize(text:string,name=''){
 let value=text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[EMAIL]').replace(/https?:\/\/\S+/gi,'[LINK]').replace(/\+?\d[\d ()-]{7,}\d/g,'[PHONE]').replace(/\bmy name is\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3}/g,'My name is [NAME]');
 for(const part of [name,...name.split(/\s+/)].filter(s=>s.trim().length>=3)){
  const escaped=part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const pattern=new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`,'giu');
  value=value.split(/(\[(?:NAME|EMAIL|LINK|PHONE)\])/g).map((chunk,i)=>i%2?chunk:chunk.replace(pattern,'[NAME]')).join('');
 }
 return value;
}
export function assistedReview(learning:LearningRepository,writing:WritingRepository,review:AssistedReviewRepository,scope:Scope){
 const model=learningService(learning,scope);
 async function findSubmission(id:string){const submission=(await writing.readSubmissions(scope)).find(s=>s.id===id);if(!submission)throw new ReviewError('Submission not found in this account.',404);return submission}
 async function ensureOpen(id:string){if((await writing.readEvaluations(scope)).some(e=>e.submissionId===id&&(e.status==='approved'||e.status==='validated')))throw new ReviewError('This submission is already reviewed. Create a learner revision instead of overwriting it.',409)}
 async function list(){const submissions=await writing.readSubmissions(scope),evaluations=await writing.readEvaluations(scope),packets=await review.readPackets(scope);const state=await model.readState();return {submissions,evaluations,packets,anonymized:Object.fromEntries(submissions.map(s=>[s.id,anonymize(s.text,String(state?.profile?.name??''))]))}}
 async function prepare(submissionId:string,anonymizedText:string,adultConfirmed:boolean){
  const submission=await findSubmission(submissionId);await ensureOpen(submissionId);
  if(!adultConfirmed)throw new ReviewError('An authorized adult must check the anonymized text before preparing a packet.');
  if(typeof anonymizedText!=='string'||!anonymizedText.trim()||anonymizedText.length>12000)throw new ReviewError('Provide the anonymized response (up to 12,000 characters).');
  const stored=await model.readState();if(anonymize(anonymizedText,String(stored?.profile?.name??''))!==anonymizedText)throw new ReviewError('Remove the remaining name, email, link or phone number before exporting.');
  const state=await model.rebuild(stored??{}),profile=state.learnerModel as LearnerModel|undefined;
  const id=crypto.randomUUID(),responseDigest=await hash(anonymizedText);
  const packet={format:'ai-english-tutor.assisted-review',schemaVersion:1,reviewId:id,responseDigest,task:{id:submission.taskId,assignment:course.task,revisionScope:submission.kind==='sentence'?'sentence':'draft'},studentResponse:anonymizedText,rubric,context:{estimatedCEFR:profile?.estimates.Writing.assessed?profile.estimates.Writing.level:'insufficient evidence',subskills:Object.fromEntries(Object.entries(profile?.subskills??{}).filter(([key])=>key.startsWith('Writing: '))),previousErrorTags:(profile?.errorTags??[]).filter(tag=>allowedTags.has(tag)).slice(0,12)},instructions:prompts['assisted-review'].system,expectedResponse:{schemaVersion:1,reviewId:id,responseDigest,provider:'external-assistant',model:'not supplied',feedback:{level:'A2',canEstimateLevel:false,scores:Object.fromEntries(coreCatalog.Writing.map(tag=>[tag,0])),relevance:0,summary:'Replace this template with a text-grounded review.',strengths:['One specific strength'],improvements:['One priority to improve'],corrections:[],tags:[],revisionSummary:'',revisionInstructions:['One concrete independent revision instruction'],exercise:'A short targeted practice task',exerciseTag:'idea-development'}}};
  const record:ReviewPacket={id,submissionId,responseDigest,anonymizedText,at:Date.now(),packet};await review.appendPacket(scope,record);return record;
 }
 async function importFeedback(text:string,expectedSubmissionId:string){
  if(typeof text!=='string'||text.length>50000)throw new ReviewError('Paste JSON feedback under 50,000 characters.');
  let raw:any;try{raw=JSON.parse(text)}catch{throw new ReviewError('Paste only the JSON object, without Markdown fences or commentary.')}
  if(!raw||Array.isArray(raw)||typeof raw!=='object'||Object.keys(raw).some(k=>!['schemaVersion','reviewId','responseDigest','provider','model','feedback'].includes(k))||raw.schemaVersion!==1||typeof raw.reviewId!=='string'||typeof raw.responseDigest!=='string')throw new ReviewError('Invalid feedback envelope. Keep schemaVersion, reviewId and responseDigest from the packet.');
  const packet=(await review.readPackets(scope)).find(p=>p.id===raw.reviewId);if(!packet||packet.responseDigest!==raw.responseDigest)throw new ReviewError('Feedback does not match a prepared packet in this account.');
  if(packet.submissionId!==expectedSubmissionId)throw new ReviewError('This feedback belongs to a different submission. Open that submission before importing.');
  const submission=await findSubmission(packet.submissionId);
  if(![raw.provider,raw.model].every(x=>typeof x==='string'&&x.trim()&&x.length<=80))throw new ReviewError('Include provider and model labels, or use external-assistant / not supplied.');
  const rating=validateTeachingRating(raw.feedback,packet.anonymizedText);
  if(!rating||rating.summary==='Replace this template with a text-grounded review.'||!rating.revisionInstructions?.length||rating.corrections.some(c=>!submission.text.includes(c.original)||/\[(NAME|EMAIL|LINK|PHONE)\]/.test(c.original))||rating.tags.some(t=>!allowedTags.has(t))||!allowedTags.has(rating.exerciseTag)||rating.corrections.some(c=>!allowedTags.has(c.tag))||JSON.stringify(rating).length>20000)throw new ReviewError('Feedback failed validation. Check six rubric scores (0–10), relevance, exact quotes from unchanged text, revisionInstructions, hints and recognized error tags. Redacted names must not be quoted as corrections.');
  // No provider-specific payload, role or evidence is accepted from the imported JSON.
  const evaluationId=`assisted-${await hash({packet:packet.id,provider:raw.provider,model:raw.model,rating})}`;
  const existing=(await writing.readEvaluations(scope)).find(e=>e.id===evaluationId);if(existing)return {evaluation:existing,duplicate:true};
  await ensureOpen(submission.id);
  const normalized:TeachingRating={...rating,evaluation:{provider:raw.provider,model:raw.model,promptId:'assisted-review',promptVersion,timestamp:new Date().toISOString(),structuredResult:rating}};
  const evaluation:WritingEvaluation={id:evaluationId,submissionId:submission.id,reviewPacketId:packet.id,source:'assisted-ai',status:'awaiting_approval',rating:normalized,at:Date.now(),evidence:[]};
  const inserted=await writing.claimEvaluation(scope,evaluation);return {evaluation,duplicate:!inserted};
 }
 async function approve(evaluationId:string,reviewedBy:string,adultConfirmed:boolean){
  if(!adultConfirmed)throw new ReviewError('Confirm that an authorized adult checked the feedback before approving.');
  const evaluation=(await writing.readEvaluations(scope)).find(e=>e.id===evaluationId);if(!evaluation||evaluation.source!=='assisted-ai'||!evaluation.rating)throw new ReviewError('Imported feedback not found.',404);
  if(evaluation.status==='approved'){const current=await model.rebuild(await model.readState()??{});await model.snapshot(current.learnerModel);return evaluation;}
  await ensureOpen(evaluation.submissionId);if(evaluation.status!=='awaiting_approval')throw new ReviewError('Only imported feedback awaiting approval can be approved.',409);
  const submission=await findSubmission(evaluation.submissionId),now=Date.now();
  const evidence=ratingEvidence(evaluation.rating,'writing',`assisted-${submission.id}`,now).map(e=>({...e,source:submission.kind==='draft'?'writing' as const:'revision' as const,activityId:submission.kind==='sentence'?`school-garden-sentence-${submission.id}`:'school-garden-writing',reviewSource:'assisted-ai' as const,reviewStatus:'approved' as const,errorTags:evaluation.rating!.tags,raw:{submissionId:submission.id,reviewPacketId:evaluation.reviewPacketId},provisional:submission.kind==='sentence'||!evaluation.rating!.canEstimateLevel}));
  const approved:WritingEvaluation={...evaluation,status:'approved',reviewedAt:now,completedAt:now,evidence};
  if(!await review.approve(scope,approved,reviewedBy))throw new ReviewError('Another review has already been approved. Existing reviewed work was preserved.',409);
  const state=await model.readState();await model.importLegacy(state);const current=await model.rebuild(state??{});await model.snapshot(current.learnerModel);return approved;
 }
 return {list,prepare,importFeedback,approve};
}
