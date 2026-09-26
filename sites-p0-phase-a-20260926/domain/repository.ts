import type {DiagnosticV2,Evidence,LearnerModel} from './learning-model';
/** Every operation requires an authenticated account scope. Never accept it from a request body. */
export type Scope={ownerId:string;learnerId:string};
// Unknown legacy fields are intentionally retained during migration and export.
export type LearnerState=Record<string,any>;
export type Snapshot={model:LearnerModel;engineVersion:string;at:number};
export interface LearningRepository {
 readState(scope:Scope):Promise<LearnerState|null>;
 writeState(scope:Scope,state:LearnerState):Promise<void>;
 appendEvidence(scope:Scope,events:Evidence[]):Promise<void>;
 readEvidence(scope:Scope):Promise<Evidence[]>;
 readAssessments(scope:Scope):Promise<DiagnosticV2[]>;
 appendAssessment(scope:Scope,session:DiagnosticV2):Promise<void>;
 legacyImported(scope:Scope):Promise<boolean>;
 markLegacyImported(scope:Scope):Promise<void>;
 appendSnapshot(scope:Scope,id:string,snapshot:Snapshot):Promise<void>;
 readSnapshots(scope:Scope):Promise<Snapshot[]>;
}
