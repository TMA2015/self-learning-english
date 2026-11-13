import type {AcademicAttempt} from './academic';

// Read-only projection: no new persisted schema, grading or evidence.
export const TRANSFER_IDS={
 'A1-U10':['REA-A1-05','LIS-A1-06','WRI-A1-05'],
 'B1-U10':['REA-B1-07','LIS-B1-08','WRI-B1-08']
} as const;
export type TransferUnitId=keyof typeof TRANSFER_IDS;
type Lesson={id:string;title:string;module:string};
type Attempt=Pick<AcademicAttempt,'id'|'lessonId'|'version'|'status'|'createdAt'|'submittedAt'|'results'|'review'>;
export type TransferRecordStatus='not_imported'|'not_started'|'unfinished_draft'|'saved_objective_attempt'|'pending_trusted_review'|'trusted_review_recorded'|'saved_unassessed';
const skills=['reading','listening','writing'] as const;
const newest=(a:Attempt,b:Attempt)=>(b.submittedAt??b.createdAt)-(a.submittedAt??a.createdAt)||b.createdAt-a.createdAt||b.id.localeCompare(a.id);

export function a1b1Unit10TransferSummary(unitId:string,lessons:readonly Lesson[],attempts:readonly Attempt[]){
 if(unitId!=='A1-U10'&&unitId!=='B1-U10')return null;
 const rows=TRANSFER_IDS[unitId].map((lessonId,index)=>{
  const skill=skills[index];
  const lesson=lessons.find(l=>l.id===lessonId&&l.module===skill);
  const history=attempts.filter(a=>a.lessonId===lessonId);
  const draft=history.filter(a=>a.status==='started').sort(newest)[0];
  const saved=history.filter(a=>['scored','pending_review','approved','unassessed'].includes(a.status)).sort(newest)[0];
  const trusted=skill==='writing'&&saved?.status==='approved'&&saved.review?.source==='adult-review'&&Number.isFinite(saved.review.reviewedAt);
  const seen=new Set<string>();
  const objective=skill==='writing'||!saved||!['scored','approved'].includes(saved.status)?[]:(saved.results??[]).filter(r=>{
   if(r.outcome==='format-only'||typeof r.correct!=='boolean'||seen.has(r.id))return false;
   seen.add(r.id);return true;
  });
  const correct=objective.filter(r=>r.correct).length;
  const status:TransferRecordStatus=!lesson?'not_imported':saved?
   skill==='writing'?(trusted?'trusted_review_recorded':'pending_trusted_review'):
   objective.length?'saved_objective_attempt':'saved_unassessed':draft?'unfinished_draft':'not_started';
  return {lessonId,lessonTitle:lesson?.title??lessonId,skill,availableInCurrentCatalog:!!lesson,status,
   hasSavedSubmission:!!saved,hasUnfinishedDraft:!!draft,savedAttemptId:saved?.id??null,
   draftAttemptId:draft?.id??null,savedContentVersion:saved?.version??null,
   objectiveChecked:objective.length,objectiveCorrect:correct,objectiveWrong:objective.length-correct,
   writingEvidenceWeight:skill==='writing'?0:null,pendingTrustedReview:skill==='writing'&&!!saved&&!trusted,
   description:!lesson?'This source lesson is unavailable here.':!saved?(draft?'Draft saved':'Not yet submitted'):
    skill==='writing'?(trusted?'Trusted review recorded; no automatic Writing score.':'Saved / Pending trusted review'):
    objective.length?`${correct} correct out of ${objective.length} saved objective answers checked.`:'Saved work; no objective result available.'};
 });
 const missing=rows.some(r=>!r.availableInCurrentCatalog);
 const wrong=rows.find(r=>r.objectiveWrong>0);
 const unfinished=rows.find(r=>!r.hasSavedSubmission||r.hasUnfinishedDraft);
 const pending=rows.find(r=>r.pendingTrustedReview);
 const next=missing?undefined:wrong??unfinished??pending??rows[0];
 const nextAttemptId=next?(next===wrong?next.savedAttemptId:next===unfinished?next.draftAttemptId:next.savedAttemptId):null;
 return {unitId:unitId as TransferUnitId,rows,availableLessonCount:rows.filter(r=>r.availableInCurrentCatalog).length,totalLessonCount:3 as const,
  nextLessonId:next?.lessonId??null,nextAttemptId,
  nextAction:missing?'This source lesson is unavailable here.':wrong?'Review saved feedback':unfinished?'Open unfinished work':pending?'Open Writing for trusted review':'Revisit saved work',
  advisoryOnly:true,introducesScoring:false,writesHistory:false,claimsUnitMastery:false,claimsCEFRProficiency:false};
}
