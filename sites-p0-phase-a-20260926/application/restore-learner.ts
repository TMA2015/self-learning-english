import type {AcademicAttempt,AcademicRepository} from '../domain/academic';
import type {LearningRepository,Scope,Snapshot} from '../domain/repository';
import type {DiagnosticV2,Evidence} from '../domain/learning-model';
import {validateImportEnvelope,type LearnerExport} from '../domain/portable-data';
import {hash} from './learning-service';

type RowCounts={add:number;skip:number;conflict:number};
export type LearnerRestorePreview={
  valid:boolean;
  errors:string[];
  state:'add'|'same'|'conflict';
  evidence:RowCounts;
  assessments:RowCounts;
  snapshots:{add:number;skip:number};
  academic:RowCounts;
  token:string;
};

const canonical=(value:any):any=>
  Array.isArray(value)?value.map(canonical):
  value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):
  value;

const same=(a:unknown,b:unknown)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
const diagnosticId=(row:DiagnosticV2)=>row.sessionId??String(row.startedAt);

function countById<T>(
  incoming:T[],
  existing:T[],
  id:(row:T)=>string,
):RowCounts{
  const current=new Map(existing.map(row=>[id(row),row]));
  const counts:RowCounts={add:0,skip:0,conflict:0};
  for(const row of incoming){
    const old=current.get(id(row));
    if(!old)counts.add++;
    else if(same(old,row))counts.skip++;
    else counts.conflict++;
  }
  return counts;
}

async function snapshotId(snapshot:Snapshot){
  // learningService.snapshot() uses this exact normalized model hash.
  return hash({...snapshot.model,updatedAt:0});
}

async function snapshotPlan(incoming:Snapshot[],existing:Snapshot[]){
  const current=new Set(await Promise.all(existing.map(snapshotId)));
  let add=0,skip=0;
  for(const row of incoming){
    const id=await snapshotId(row);
    if(current.has(id))skip++;
    else{add++;current.add(id)}
  }
  return {add,skip};
}

export async function previewLearnerRestore(
  value:unknown,
  learning:LearningRepository,
  scope:Scope,
  academic?:AcademicRepository,
):Promise<LearnerRestorePreview>{
  if(!validateImportEnvelope(value)){
    return {valid:false,errors:['Invalid learner backup envelope.'],state:'conflict',evidence:{add:0,skip:0,conflict:0},assessments:{add:0,skip:0,conflict:0},snapshots:{add:0,skip:0},academic:{add:0,skip:0,conflict:0},token:''};
  }
  const source=value as LearnerExport;
  const [state,evidence,assessments,snapshots,academicRows]=await Promise.all([
    learning.readState(scope),
    learning.readEvidence(scope),
    learning.readAssessments(scope),
    learning.readSnapshots(scope),
    academic?academic.attempts(scope.ownerId):Promise.resolve([] as AcademicAttempt[]),
  ]);
  const stateAction=state===null?'add':same(state,source.state)?'same':'conflict';
  const evidenceCounts=countById(source.evidence,evidence,row=>row.id);
  const assessmentCounts=countById(source.assessments,assessments,diagnosticId);
  const academicCounts=countById(source.academicRecords??[],academicRows,row=>row.id);
  const snapshotsCounts=await snapshotPlan(source.snapshots,snapshots);
  const errors:string[]=[];
  if(source.learnerId!==scope.learnerId)errors.push('Backup learner ID does not match the selected target learner.');
  if(stateAction==='conflict')errors.push('Target already has different learner state. Restore into a fresh profile or export/merge explicitly.');
  if(evidenceCounts.conflict)errors.push('Conflicting evidence IDs found.');
  if(assessmentCounts.conflict)errors.push('Conflicting assessment session IDs found.');
  if(academicCounts.conflict)errors.push('Conflicting academic attempt IDs found.');
  if((source.academicRecords?.length??0)>0&&!academic)errors.push('Academic attempts are present but no academic repository was supplied.');
  const targetDigest=await hash(canonical({state,evidence,assessments,snapshots,academicRows}));
  const sourceDigest=await hash(canonical({state:source.state,evidence:source.evidence,assessments:source.assessments,snapshots:source.snapshots,academicRecords:source.academicRecords??[]}));
  const token=errors.length?'':await hash({format:source.format,schemaVersion:source.schemaVersion,exportedAt:source.exportedAt,target:scope,sourceDigest,targetDigest});
  return {valid:errors.length===0,errors,state:stateAction,evidence:evidenceCounts,assessments:assessmentCounts,snapshots:snapshotsCounts,academic:academicCounts,token};
}

async function restoreAcademicAttempt(repo:AcademicRepository,ownerId:string,row:AcademicAttempt){
  const started:AcademicAttempt={
    ...row,
    status:'started',
    submittedAt:undefined,
    results:undefined,
    evidence:[],
    review:undefined,
  };
  await repo.start(ownerId,started);
  await repo.saveDraft(ownerId,row.id,{
    answers:row.answers,
    audio:row.audio,
    playStartedAt:row.playStartedAt,
    playToken:row.playToken,
    playbackCompleted:row.playbackCompleted,
  });
  if(row.status==='started')return;
  if(row.status==='approved'){
    await repo.finish(ownerId,{...row,status:'pending_review',review:undefined});
    await repo.approve(ownerId,row);
    return;
  }
  await repo.finish(ownerId,row);
}

/**
 * Safe first restore implementation for local/static mode.
 *
 * It deliberately refuses destructive merges. A restore must be previewed against the
 * exact current target and confirmed with the returned token. Existing immutable
 * ledgers are appended idempotently; differing IDs abort before any mutation.
 */
export async function restoreLearnerBackup(
  value:unknown,
  learning:LearningRepository,
  scope:Scope,
  token:string,
  confirmed:boolean,
  academic?:AcademicRepository,
){
  if(!confirmed)throw new Error('Restore requires explicit confirmation.');
  const source=value as LearnerExport;
  const preview=await previewLearnerRestore(source,learning,scope,academic);
  if(!preview.valid)throw new Error(preview.errors.join(' '));
  if(!token||token!==preview.token)throw new Error('Backup or target data changed since preview. Preview again before restoring.');

  if(preview.state==='add')await learning.writeState(scope,source.state);
  await learning.appendEvidence(scope,source.evidence);
  for(const row of source.assessments)await learning.appendAssessment(scope,row);
  for(const row of source.snapshots)await learning.appendSnapshot(scope,await snapshotId(row),row);

  if(academic){
    const existing=new Map((await academic.attempts(scope.ownerId)).map(row=>[row.id,row]));
    for(const row of source.academicRecords??[]){
      if(!existing.has(row.id))await restoreAcademicAttempt(academic,scope.ownerId,row);
    }
  }
  return {ok:true,preview};
}
