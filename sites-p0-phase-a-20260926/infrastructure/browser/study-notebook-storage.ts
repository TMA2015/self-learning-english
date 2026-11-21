import {
 emptyStudyNotebook,isStudyNotebook,type StudyNotebookData
} from '../../domain/study-notebook';

/** Deliberately outside existing learner v1 package/attempt/backup key family. */
export const STUDY_NOTEBOOK_KEY='g-learning:english:study-notebook:v1';
const RECOVERY_PENDING='g-learning:english:v1:recovery-pending-v2';
export const STUDY_NOTEBOOK_MAX_BYTES=300_000;
type StoragePort=Pick<Storage,'getItem'|'setItem'>;
const length=(s:string)=>new TextEncoder().encode(s).length;

export function loadStudyNotebook(store:StoragePort):StudyNotebookData{
 if(store.getItem(RECOVERY_PENDING))
  throw Error('Recovery pending: preserve browser data and do not edit Study Notebook.');
 const raw=store.getItem(STUDY_NOTEBOOK_KEY);
 if(raw===null)return emptyStudyNotebook();
 if(length(raw)>STUDY_NOTEBOOK_MAX_BYTES)
  throw Error('Study Notebook storage exceeds the supported limit. Preserve the original data.');
 let data:unknown;
 try{data=JSON.parse(raw)}catch{throw Error('Study Notebook data is unreadable. No data was changed.')}
 if(!isStudyNotebook(data))
  throw Error('Unknown or invalid Study Notebook version. Preserve browser data; no changes were made.');
 return data;
}

/** One atomic write; never claim save after a quota failure or recovery marker. */
export function persistStudyNotebook(store:StoragePort,next:StudyNotebookData):StudyNotebookData{
 if(!isStudyNotebook(next))throw Error('Invalid Study Notebook record. No changes saved.');
 // Read old state to fail closed for an unknown schema rather than overwrite it.
 const current=loadStudyNotebook(store);
 if(next.revision!==current.revision+1)
  throw Error('Study Notebook changed since loading. Reload before saving.');
 const serialized=JSON.stringify(next);
 if(length(serialized)>STUDY_NOTEBOOK_MAX_BYTES)
  throw Error('Study Notebook is too large. Export your notes and shorten them.');
 try{store.setItem(STUDY_NOTEBOOK_KEY,serialized)}
 catch{throw Error('Device storage is full or unavailable. Your change was NOT saved. Preserve existing data.')}
 // Native storage makes a single key atomic. Reload to ensure the value is valid.
 return loadStudyNotebook(store);
}

export function exportStudyNotebookJSON(store:StoragePort):string{
 const state=loadStudyNotebook(store);
 // This export contains no graded attempts, profile/identity or curriculum.
 return JSON.stringify(state,null,2)+'\n';
}
