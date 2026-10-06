import {exportLearner} from '../../application/export-learner';
import {previewLearnerRestore,restoreLearnerBackup,type LearnerRestorePreview} from '../../application/restore-learner';
import {validateImportEnvelope,type LearnerExport} from '../../domain/portable-data';
import {hash} from '../../application/learning-service';
import {localAcademicRuntime,localCourseRuntime} from './local-runtime';

export const LOCAL_BACKUP_FILENAME='g-learning-english-backup-v1.json';
export const LOCAL_BACKUP_MAX_BYTES=5_000_000;

export type LocalBackupFile={
  filename:string;
  mime:'application/json';
  text:string;
  bytes:number;
  exportedAt:string;
  counts:{evidence:number;assessments:number;snapshots:number;academicAttempts:number};
  activeCourseId:string|null;
};

export type LocalBackupPreview=LearnerRestorePreview&{
  sourceExportedAt:string;
  sourceLearnerIdIgnored:true;
  counts:{evidence:number;assessments:number;snapshots:number;academicAttempts:number};
  courseSelection:'absent'|'add'|'same'|'conflict';
  applicationToken:string;
};

function byteLength(text:string){
  return new TextEncoder().encode(text).length;
}

export function parseLocalBackup(text:string):LearnerExport{
  if(typeof text!=='string')throw new Error('Choose a G Learning English backup JSON file.');
  const bytes=byteLength(text);
  if(bytes>LOCAL_BACKUP_MAX_BYTES)throw new Error('Backup is too large. Maximum supported size is 5 MB.');
  if(!text.trim())throw new Error('Choose a G Learning English backup JSON file.');
  let value:unknown;
  try{value=JSON.parse(text)}
  catch{throw new Error('Backup is not valid JSON.')}
  if(!validateImportEnvelope(value))throw new Error('This is not a supported G Learning English learner backup.');
  return value;
}

function counts(value:LearnerExport){
  return {
    evidence:value.evidence.length,
    assessments:value.assessments.length,
    snapshots:value.snapshots.length,
    academicAttempts:value.academicRecords?.length??0,
  };
}

export async function exportLocalBackup():Promise<LocalBackupFile>{
  const {learning,academic,scope}=await localAcademicRuntime();
  const value=await exportLearner(learning,scope,undefined,undefined,academic);
  const courseRuntime=await localCourseRuntime();
  value.courseSelection=await courseRuntime.courses.read(scope);
  const text=JSON.stringify(value,null,2)+'\n';
  const bytes=byteLength(text);
  if(bytes>LOCAL_BACKUP_MAX_BYTES)throw new Error('Current learner data exceeds the 5 MB JSON backup limit.');
  return {
    filename:LOCAL_BACKUP_FILENAME,
    mime:'application/json',
    text,
    bytes,
    exportedAt:value.exportedAt,
    counts:counts(value),
    activeCourseId:value.courseSelection?.activeCourseId??null,
  };
}

export async function previewLocalBackup(text:string):Promise<LocalBackupPreview>{
  const value=parseLocalBackup(text);
  const {learning,academic}=await localAcademicRuntime();
  const courseRuntime=await localCourseRuntime();
  const application=await previewLearnerRestore(value,learning,scope,academic,{ignoreSourceLearnerId:true});
  const targetCourse=await courseRuntime.courses.read(scope);
  const sourceCourse=value.courseSelection;
  const courseSelection:LocalBackupPreview['courseSelection']=
    sourceCourse===undefined?'absent':
    sourceCourse.activeCourseId===targetCourse.activeCourseId?'same':
    targetCourse.activeCourseId===null&&sourceCourse.activeCourseId!==null?'add':
    'conflict';
  const errors=[
    ...application.errors,
    ...(courseSelection==='conflict'?['Target already has a different active course selection. Clear it explicitly before restoring.']:[]),
  ];
  const token=errors.length?'':await hash({
    applicationToken:application.token,
    sourceCourse:sourceCourse?.activeCourseId??'absent',
    targetCourse:targetCourse.activeCourseId,
    targetRevision:targetCourse.revision,
  });
  return {
    ...application,
    valid:errors.length===0,
    errors,
    token,
    applicationToken:application.token,
    courseSelection,
    sourceExportedAt:value.exportedAt,
    sourceLearnerIdIgnored:true,
    counts:counts(value),
  };
}

export async function restoreLocalBackup(text:string,token:string,confirmed:boolean){
  if(!confirmed)throw new Error('Restore requires explicit confirmation.');
  const value=parseLocalBackup(text);
  const current=await previewLocalBackup(text);
  if(!current.valid)throw new Error(current.errors.join(' '));
  if(!token||token!==current.token)throw new Error('Backup or target data changed since preview. Preview again before restoring.');

  // Captured before the first mutation. The UI downloads this file after success.
  const before=await exportLocalBackup();
  const {learning,academic}=await localAcademicRuntime();
  await restoreLearnerBackup(
    value,
    learning,
    scope,
    current.applicationToken,
    true,
    academic,
    {ignoreSourceLearnerId:true},
  );

  if(current.courseSelection==='add'&&value.courseSelection?.activeCourseId){
    const courseRuntime=await localCourseRuntime();
    const target=await courseRuntime.courses.read(scope);
    await courseRuntime.courses.select(
      scope,
      value.courseSelection.activeCourseId,
      target.revision,
      `restore_${Date.now()}`,
    );
  }
  return {ok:true as const,preview:current,preRestoreBackup:before};
}
