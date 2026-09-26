// Compatibility facade. SQL and Cloudflare are isolated in infrastructure adapters.
import {learnerStore} from '../infrastructure/runtime';
import type {DiagnosticV2,Evidence,LearnerModel} from '../domain/learning-model';
import type {LearnerState} from '../domain/repository';
export {hash} from '../application/learning-service';
export const readState=(owner:string)=>learnerStore(owner).readState();
export const readEvidence=(owner:string)=>learnerStore(owner).readEvidence();
export const readAssessments=(owner:string)=>learnerStore(owner).readAssessments();
export const recordEvidence=(owner:string,events:Evidence[])=>learnerStore(owner).recordEvidence(events);
export const recordAssessment=(owner:string,d:DiagnosticV2)=>learnerStore(owner).recordAssessment(d);
export const getAssessment=(owner:string,id:string)=>learnerStore(owner).getAssessment(id);
export const importLegacy=(owner:string,s:LearnerState|null)=>learnerStore(owner).importLegacy(s);
export const rebuild=(owner:string,s:LearnerState)=>learnerStore(owner).rebuild(s);
export const snapshot=(owner:string,m?:LearnerModel)=>learnerStore(owner).snapshot(m);
export const saveState=(owner:string,s:LearnerState)=>learnerStore(owner).saveState(s);
export const readSnapshots=(owner:string)=>learnerStore(owner).readSnapshots();
export const auditRows=(owner:string,offset:number)=>learnerStore(owner).auditRows(offset);
