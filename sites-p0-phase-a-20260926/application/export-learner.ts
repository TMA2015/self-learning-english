import type {AssistedReviewRepository} from "../domain/assisted-review";
import type {WritingRepository} from "../domain/writing";
import type {LearningRepository,Scope} from '../domain/repository';
import type {LearnerExport} from '../domain/portable-data';
import {ENGINE_VERSION} from '../domain/adaptive-engine';
import {learningService} from './learning-service';
export async function exportLearner(repository:LearningRepository,scope:Scope,writing?:WritingRepository,review?:AssistedReviewRepository,academic?:import("../domain/academic").AcademicRepository):Promise<LearnerExport>{
 const service=learningService(repository,scope),saved=await service.readState();
 // Export is read-only. Old records are included intact even before their first backfill.
 const [evidence,assessments,snapshots]=await Promise.all([service.readEvidence(),service.readAssessments(),service.readSnapshots()]);
 const state=saved??{},current=await service.rebuild(state),sessions=[...assessments,...(state.diagnosticArchive??[]),...(state.diagnosticV2?[state.diagnosticV2]:[])];
 const writingRecords=writing?{submissions:await writing.readSubmissions(scope),evaluations:await writing.readEvaluations(scope)}:undefined;
 const assistedRecords=review?{packets:await review.readPackets(scope),approvals:await review.readApprovals(scope)}:undefined;
 return {academicRecords:academic?await academic.attempts(scope.ownerId):undefined,assistedRecords,writingRecords,format:'ai-english-tutor.learner',schemaVersion:1,exportedAt:new Date().toISOString(),learnerId:scope.learnerId,engineVersion:ENGINE_VERSION,state,assessments,evidence,snapshots,profile:{preferences:state.profile??null,estimate:current.learnerModel??null},skillMastery:current.learnerModel?.subskills??null,attempts:sessions.flatMap(d=>d.attempts??[]),writingSubmissions:[...sessions.filter(d=>d.writing||d.writing2).map(d=>({sessionId:d.sessionId,writing:d.writing,writing2:d.writing2,reviews:d.writingReviews})),{activityId:'school-garden',writing:state.writing??'',revision:state.revision??'',feedback:state.feedbacks??null},...evidence.filter(e=>e.skill==='Writing'&&e.raw).map(e=>({eventId:e.id,raw:e.raw,evaluation:e.evaluation}))],errorHistory:[...(state.history??[]),...evidence.filter(e=>e.errorTags?.length).map(e=>({eventId:e.id,tags:e.errorTags,at:e.at}))],vocabulary:state.vocabulary??[],learningPlans:[...(current.learningPlan?[current.learningPlan]:[])],courseProgress:{week:state.week,stage:state.stage,completed:state.completed},notes:['state, assessments, evidence and snapshots are authoritative restore records; other sections are convenient projections and may repeat records.','Original unknown state fields are retained. Vocabulary is empty if no vocabulary records exist; no course or data is invented.','No credentials, provider session objects or access grants are included. Ownership must be mapped by a trusted administrator during restore.']};
}
