import {exportLearner} from '../../application/export-learner';
import {type LearnerRestorePreview} from '../../application/restore-learner';
import {validateImportEnvelope,type LearnerExport} from '../../domain/portable-data';
import {LOCAL_LEARNER_ID,LOCAL_OWNER_ID,localAcademicRuntime,localCourseRuntime} from './local-runtime';

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
  const {learning,academic}=await localAcademicRuntime();
  const scope={ownerId:LOCAL_OWNER_ID,learnerId:LOCAL_LEARNER_ID};
  const value=await exportLearner(learning,scope,undefined,undefined,academic);
  const courseRuntime=await localCourseRuntime();
  value.courseSelection=await courseRuntime.courses.read(LOCAL_OWNER_ID);
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

export const LOCAL_RESTORE_LIMITATION='Restore is temporarily unavailable in this early version. Backups do not include historical lesson content, and a failed restore could leave incomplete records. Existing data is not deleted. Export is for reference only; cross-device recovery is not supported yet.';

// Fail before parsing, bootstrapping curriculum or touching any storage key.
export async function previewLocalBackup(_text:string):Promise<LocalBackupPreview>{
  throw new Error(LOCAL_RESTORE_LIMITATION);
}
export async function restoreLocalBackup(_text:string,_token:string,_confirmed:boolean):Promise<never>{
  throw new Error(LOCAL_RESTORE_LIMITATION);
}
