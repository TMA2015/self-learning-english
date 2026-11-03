import type {Scope} from './repository';
import type {WritingEvaluation} from './writing';
export type ReviewPacket={id:string;submissionId:string;responseDigest:string;anonymizedText:string;at:number;packet:Record<string,unknown>};
export type ReviewApproval={submissionId:string;evaluationId:string;reviewedBy:string;at:number};
export interface AssistedReviewRepository{
 readApprovals(scope:Scope):Promise<ReviewApproval[]>;
 readPackets(scope:Scope):Promise<ReviewPacket[]>;
 appendPacket(scope:Scope,packet:ReviewPacket):Promise<void>;
 /** Atomically lock the submission, approve this evaluation and append its evidence. */
 approve(scope:Scope,evaluation:WritingEvaluation,reviewedBy:string):Promise<boolean>;
}
export class ReviewError extends Error{constructor(message:string,public status=400){super(message)}}
