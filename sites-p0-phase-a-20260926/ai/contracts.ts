import type {EvaluationMetadata} from '../domain/ai-metadata';
export type TutorPurpose='writing-evaluation'|'feedback'|'error-explanation'|'learning-plan-recommendations'|'brainstorming-coaching'|'speaking-evaluation'|'writing-teaching';
export type TutorRequest={schemaVersion:1;purpose:TutorPurpose;promptVersion:string;instructions:string;input:Record<string,unknown>;temperature:number};
export type ProviderResult={provider:string;model:string;result:unknown};
/** Provider boundary. A provider may run server-side or through a protected client gateway such as Firebase AI Logic + App Check. No vendor message shapes escape this adapter. */
export interface AITutorProvider{readonly available:boolean;generate(request:TutorRequest):Promise<ProviderResult|null>}
export interface AITutor {available:boolean;teachWriting(text:string,task:string,context:import("../domain/writing").WritingContext):Promise<import("../domain/writing").TeachingRating|null>;evaluateWriting(text:string,task:string):Promise<import('../domain/learning-model').WritingRating|null>;coach(stage:string,task:string,answer:unknown,learnerContext?:Record<string,unknown>):Promise<EvaluationMetadata|null>}
