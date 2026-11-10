import {
 createRevisionRecoveryV3,verifyRevisionRecoveryV3,verifiedRecoveryToPlan,
 type LearnerEntry,type RevisionRecoveryV3
} from '../../domain/lesson-revision-recovery-v3';
import {canonicalLessonJSON,type ActiveLessonManifest,type RevisionAlias,type RevisionBlob,
 type LessonRevisionPlan} from '../../domain/lesson-revision-plan';

/**
 * R3b NON-PRODUCTION restore research adapter.
 * This is NOT wired into the live Site, V2 Recovery button or academic service.
 * Source content uses the detached normalized IDB vault; old learner entries
 * are only restored into an empty/disposable profile.
 */
const PREFIX='g-learning:english:v1:';
export const RECOVERY_V3_MARKER=PREFIX+'recovery-pending-v3';
/** R4i research-only fail-closed signal for a paired learner/assessment write.
 * This adapter is NOT installed in the production learner writer. */
export const LEARNER_WRITE_V3_MARKER=PREFIX+'learner-write-pending-v3';
type Snapshot={active:ActiveLessonManifest|null;aliases:RevisionAlias[];blobs:RevisionBlob[]};
export type EnumerableStore={
 length:number;key(index:number):string|null;
 getItem(key:string):string|null;
 setItem(key:string,value:string):void;
 removeItem(key:string):void;
};
export type NormalizedVault={
 snapshot():Promise<Snapshot>;
 install(plan:LessonRevisionPlan):Promise<unknown>;
};
function error(message:string):Error{
 return Error(message+' No existing learner records may be overwritten.');
}
function equal(a:unknown,b:unknown){return canonicalLessonJSON(a)===canonicalLessonJSON(b);}
function scanEnglish(storage:EnumerableStore):LearnerEntry[]{
 const out:LearnerEntry[]=[];
 for(let i=0;i<storage.length;i++){
  const key=storage.key(i);
  if(!key||!key.startsWith(PREFIX))continue;
  if(key===RECOVERY_V3_MARKER||key===LEARNER_WRITE_V3_MARKER)continue;
  const value=storage.getItem(key);
  if(value!==null)out.push({key,value});
 }
 return out.sort((a,b)=>a.key.localeCompare(b.key));
}
async function digest(text:string){
 if(typeof crypto==='undefined'||!crypto.subtle)throw error('Recovery SHA unavailable.');
 const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
 return Array.from(new Uint8Array(buf),x=>x.toString(16).padStart(2,'0')).join('');
}
function checksumState(file:RevisionRecoveryV3,existing:LearnerEntry[],
 marker:string|null,vault:Snapshot){
 return canonicalLessonJSON({sha256:file.sha256,existing,marker,vault});
}
function entriesMatch(file:RevisionRecoveryV3,found:LearnerEntry[]){
 const allowed=new Map(file.entries.map(x=>[x.key,x.value]));
 return found.every(x=>allowed.has(x.key)&&allowed.get(x.key)===x.value);
}
function rejectPendingLearnerWrite(storage:EnumerableStore){
 if(storage.getItem(LEARNER_WRITE_V3_MARKER))
  throw error('An incomplete paired learner write blocks Recovery export/restore. Recover the original two keys first.');
}
function sourceClosure(file:RevisionRecoveryV3,snapshot:Snapshot){
 if(!snapshot.active||!equal(snapshot.active,file.active))
  throw error('Active curriculum source changed during restore.');
 const byHash=new Map(snapshot.blobs.map(x=>[x.revision,x]));
 const byAlias=new Map(snapshot.aliases.map(x=>[JSON.stringify([x.version,x.lessonId]),x]));
 for(const b of file.blobs){
  if(!byHash.has(b.revision)||!equal(byHash.get(b.revision),b))
   throw error('Original restored source blob missing or conflicting.');
 }
 for(const a of file.aliases){
  const original=byAlias.get(JSON.stringify([a.version,a.lessonId]));
  if(!original||!equal(original,a))
   throw error('Original restored historical source alias missing.');
 }
}
/**
 * Before exporting a real user profile, caller MUST ensure a normal
 * mode, no concurrent tabs, and no pending V2/V3 restore marker. This
 * research adapter also checks two successive cross-store snapshots.
 */
export async function exportNormalizedBrowserRecoveryV3(
 storage:EnumerableStore,vault:NormalizedVault,exportedAt:string
){
 rejectPendingLearnerWrite(storage);
 if(storage.getItem(RECOVERY_V3_MARKER)||
  storage.getItem(PREFIX+'recovery-pending-v2'))
  throw error('An interrupted Recovery blocks new exports.');
 const sourceA=await vault.snapshot(),entriesA=scanEnglish(storage);
 rejectPendingLearnerWrite(storage);
 const sourceB=await vault.snapshot(),entriesB=scanEnglish(storage);
 rejectPendingLearnerWrite(storage);
 if(!equal(sourceA,sourceB)||!equal(entriesA,entriesB))
  throw error('Learner records or lesson sources changed while exporting.');
 const result=await createRevisionRecoveryV3(sourceB,entriesB,exportedAt);
 const confirmed=await verifyRevisionRecoveryV3(result.text);
 if(confirmed.file.sha256!==result.sha256)
  throw error('Recovery file failed its own checksum.');
 // Detect change again after potentially expensive crypto and serialization.
 rejectPendingLearnerWrite(storage);
 if(!equal(sourceB,await vault.snapshot())||
  !equal(entriesB,scanEnglish(storage)))
  throw error('Browser data changed while finishing Recovery export.');
 rejectPendingLearnerWrite(storage);
 return result;
}
/**
 * A restore preview NEVER writes. A completely empty learner profile can
 * have already installed non-learner IDB curriculum content. A pending
 * marker allows resuming ONLY the identical verified file with matching
 * already-written learner key values. Unknown keys fail closed.
 */
export async function previewNormalizedV3Restore(
 fileText:string,storage:EnumerableStore,vault:NormalizedVault
):Promise<{valid:boolean;errors:string[];token:string;
 attempts:number;sourceRevisions:number;resuming:boolean}>{
 const verified=await verifyRevisionRecoveryV3(fileText);
 const file=verified.file;
 const marker=storage.getItem(RECOVERY_V3_MARKER);
 const pendingWrite=storage.getItem(LEARNER_WRITE_V3_MARKER);
 const present=scanEnglish(storage);
 const source=await vault.snapshot();
 const problems:string[]=[];
 if(pendingWrite)
  problems.push('An incomplete paired learner write must be repaired before Restore.');
 if(marker&&marker!==file.sha256)
  problems.push('Interrupted restore uses a different Recovery V3 file.');
 if(!marker&&present.length)
  problems.push('This learner profile is already occupied; restore blocked.');
 if(marker&&!entriesMatch(file,present))
  problems.push('Existing restore content differs from the original verified file.');
 if(source.active&&source.active.version===file.active.version&&
  !equal(source.active,file.active))
  problems.push('Existing content source conflicts with Recovery V3.');
 if(source.active&&source.active.version!==file.active.version)
  problems.push('A different active curriculum is installed; isolated restore only.');
 const token=problems.length?'':await digest(checksumState(file,present,marker,source));
 return {valid:!problems.length,errors:problems,token,
  attempts:verified.attempts,sourceRevisions:verified.uniqueRevisions,
  resuming:!!marker};
}
/**
 * Two-store write cannot be atomic. Mark STARTED in localStorage first,
 * install content in one atomic IDB transaction, then add learner keys.
 * A failed write attempts rollback of only newly added learner keys but
 * leaves the marker to prevent false success. Re-selecting the same V3 file
 * can safely resume; no cross-store deletion is performed.
 */
export async function restoreNormalizedV3(
 fileText:string,token:string,confirmed:boolean,
 storage:EnumerableStore,vault:NormalizedVault
):Promise<{attempts:number;sourceRevisions:number;restoredKeys:number}>{
 if(!confirmed||!token)throw error('Explicit empty-profile Restore confirmation required.');
 const preview=await previewNormalizedV3Restore(fileText,storage,vault);
 rejectPendingLearnerWrite(storage);
 if(!preview.valid||preview.token!==token)
  throw error('Restore source/profile changed; preview again. '+preview.errors.join(' '));
 const verified=await verifyRevisionRecoveryV3(fileText),file=verified.file;
 const already=storage.getItem(RECOVERY_V3_MARKER);
 if(!already)storage.setItem(RECOVERY_V3_MARKER,file.sha256);
 const newKeys:string[]=[];
 try{
  await vault.install(verifiedRecoveryToPlan(file));
  sourceClosure(file,await vault.snapshot());
  for(const row of file.entries){
   const found=storage.getItem(row.key);
   if(found===null){storage.setItem(row.key,row.value);newKeys.push(row.key)}
   else if(found!==row.value)throw error('Existing learner value changed during restore.');
  }
  for(const row of file.entries){
   if(storage.getItem(row.key)!==row.value)
    throw error('Restored learner bytes differ from verified V3 file.');
  }
  sourceClosure(file,await vault.snapshot());
  storage.removeItem(RECOVERY_V3_MARKER);
  return {attempts:verified.attempts,sourceRevisions:verified.uniqueRevisions,
   restoredKeys:file.entries.length};
 }catch(cause){
  const failed:string[]=[];
  for(const key of newKeys.reverse()){
   try{storage.removeItem(key)}catch{failed.push(key)}
  }
  // Keep the marker for clear, same-file, interrupted-restore recovery.
  throw error('V3 restore incomplete; interrupted marker preserved. '+
   String(cause)+(failed.length?' Rollback failed for '+failed.length+' keys.':''));
 }
}
