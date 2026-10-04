import {exportLearner} from '../../application/export-learner';
import {previewLearnerRestore,restoreLearnerBackup,type LearnerRestorePreview} from '../../application/restore-learner';
import {validateImportEnvelope,type LearnerExport} from '../../domain/portable-data';
import {LOCAL_LEARNER_ID,LOCAL_OWNER_ID,localAcademicRuntime} from './local-runtime';

export const LOCAL_BACKUP_FILENAME='g-learning-english-backup-v1.json';
export const LOCAL_BACKUP_MAX_BYTES=5_000_000;

export type LocalBackupFile={
  filename:string;
  mime:'application/json';
  text:string;
  bytes:number;
  exportedAt:string;
  counts:{evidence:number;assessments:number;snapshots:number;academicAttempts:number};
};

export type LocalBackupPreview=LearnerRestorePreview&{
  sourceExportedAt:string;
  sourceLearnerIdIgnored:true;
  counts:{evidence:number;assessments:number;snapshots:number;academicAttempts:number};
};

function byteLength(text:string){
  return new TextEncoder().encode(text).length;
}

export function parseLocalBackup(text:string):LearnerExport{
  if(typeof text!=='string'||!text.trim())throw new Error('Choose a G Learning English backup JSON file.');
  const bytes=byteLength(text);
  if(bytes>LOCAL_BACKUP_MAX_BYTES)throw new Error('Backup is too large. Maximum supported size is 5 MB.');
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
  };
}

export async function previewLocalBackup(text:string):Promise<LocalBackupPreview>{
  const value=parseLocalBackup(text);
  const {learning,academic}=await localAcademicRuntime();
  const scope={ownerId:LOCAL_OWNER_ID,learnerId:LOCAL_LEARNER_ID};
  const preview=await previewLearnerRestore(value,learning,scope,academic,{ignoreSourceLearnerId:true});
  return {
    ...preview,
    sourceExportedAt:value.exportedAt,
    sourceLearnerIdIgnored:true,
    counts:counts(value),
  };
}

export async function restoreLocalBackup(text:string,token:string,confirmed:boolean){
  const value=parseLocalBackup(text);
  const before=await exportLocalBackup();
  const {learning,academic}=await localAcademicRuntime();
  const scope={ownerId:LOCAL_OWNER_ID,learnerId:LOCAL_LEARNER_ID};
  const result=await restoreLearnerBackup(
    value,
    learning,
    scope,
    token,
    confirmed,
    academic,
    {ignoreSourceLearnerId:true},
  );
  return {ok:true as const,preview:result.preview,preRestoreBackup:before};
}
