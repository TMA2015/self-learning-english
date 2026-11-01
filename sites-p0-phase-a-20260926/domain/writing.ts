import type {WritingRating,Evidence} from './learning-model';
import type {Scope} from './repository';
export type WritingContext={estimatedCEFR:string;goals:string;subskills:Record<string,{correct:number;total:number}>;previousErrors:string[];recentPerformance:{tag:string;score:number;max:number}[];priorRevisions:{text:string;feedback?:string}[];previousText?:string;revisionScope:'draft'|'sentence';ageGroup:'11–12'};
export type TeachingRating=Omit<WritingRating,"corrections">&{revisionInstructions?:string[];relevance:number;canEstimateLevel:boolean;revisionSummary:string;corrections:{original:string;revised:string;why:string;tag:string;hint:string}[];exerciseTag:string};
export type WritingSubmission={id:string;learnerId:string;taskId:string;text:string;kind:'draft'|'revision'|'sentence';parentId?:string;rootId:string;createdAt:number};
export type WritingEvaluation={id:string;submissionId:string;source?:'automatic'|'assisted-ai';reviewPacketId?:string;reviewedAt?:number;status:'pending'|'validated'|'unavailable'|'failed'|'awaiting_approval'|'approved';at:number;completedAt?:number;rating?:TeachingRating;reason?:string;evidence:Evidence[]};
export interface WritingRepository{
 readSubmissions(scope:Scope):Promise<WritingSubmission[]>;
 appendSubmission(scope:Scope,submission:WritingSubmission):Promise<void>;
 readEvaluations(scope:Scope):Promise<WritingEvaluation[]>;
 claimEvaluation(scope:Scope,evaluation:WritingEvaluation):Promise<boolean>;
 finishEvaluation(scope:Scope,evaluation:WritingEvaluation):Promise<void>;
}

export function effectiveEvaluation(rows:WritingEvaluation[]){return rows.filter(e=>e.status==='approved').at(-1)??rows.filter(e=>e.status==='validated').at(-1)??rows.filter(e=>e.status!=='awaiting_approval').at(-1)}
