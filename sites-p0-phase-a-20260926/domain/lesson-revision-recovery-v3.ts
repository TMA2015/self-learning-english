import {
 canonicalLessonJSON,type LessonRevisionPlan,type RevisionBlob,
 type RevisionAlias,type ActiveLessonManifest
} from './lesson-revision-plan';

/**
 * R3a PURE, non-production portable-backup prototype.
 * NO browser storage access, NO migration and NO restore writes.
 * SHA-256 protects accidental corruption, not authenticity/signature.
 * See docs/storage/SLE_LESSON_REVISION_RECOVERY_R3A_20261107.md.
 */
export const REVISION_RECOVERY_MAX_BYTES=25_000_000;
export type LearnerEntry={key:string;value:string};
export type RevisionRecoveryV3={
 format:'g-learning-english.lesson-revision-recovery';
 schemaVersion:3;exportedAt:string;
 active:ActiveLessonManifest;
 aliases:RevisionAlias[];
 blobs:RevisionBlob[];
 entries:LearnerEntry[];
 sha256:string;
};
export type OriginalAttemptRef={id:string;packageId:string;version:string;lessonId:string};
const PREFIX='g-learning:english:v1:';
function fail(message:string):never{throw Error(message+' Recovery V3 is not safe to use.');}
function isAllowed(k:string){
 if(!k.startsWith(PREFIX))return false;
 const v=k.slice(PREFIX.length);
 return /^owner:[^:]+:(academic-attempts|course-selection|learner:[^:]+:(state|evidence|assessments|snapshots|legacy-imported))$/.test(v);
}
function aliasKey(v:string,id:string){return JSON.stringify([v,id]);}
function bytes(s:string){return new TextEncoder().encode(s).byteLength}
async function sha256(data:string){
 if(typeof crypto==='undefined'||!crypto.subtle)fail('SHA-256 unavailable.');
 const raw=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(data));
 return Array.from(new Uint8Array(raw),x=>x.toString(16).padStart(2,'0')).join('');
}
function checkedEntries(entries:readonly LearnerEntry[]):{
 sorted:LearnerEntry[];attempts:OriginalAttemptRef[];
}{
 if(!Array.isArray(entries))fail('Learner entry list is malformed.');
 const visited=new Set<string>();
 const attempts:OriginalAttemptRef[]=[];
 const sorted=[...entries].sort((a,b)=>a.key.localeCompare(b.key));
 for(const e of sorted){
  if(!e||typeof e.key!=='string'||typeof e.value!=='string'||
   !isAllowed(e.key)||visited.has(e.key))
   fail('Unexpected or duplicate learner storage key.');
  visited.add(e.key);
  if(!e.key.endsWith(':academic-attempts'))continue;
  let value:unknown;
  try{value=JSON.parse(e.value)}catch{fail('Saved attempts are not valid JSON.')}
  if(!Array.isArray(value))fail('Saved attempts are not an array.');
  const attemptIds=new Set<string>();
  for(const a of value){
   if(!a||typeof a!=='object'||Array.isArray(a))fail('A saved attempt is malformed.');
   const row=a as Record<string,unknown>;
   if(typeof row.id!=='string'||!row.id||
    typeof row.packageId!=='string'||!row.packageId||
    typeof row.version!=='string'||!row.version||
    typeof row.lessonId!=='string'||!row.lessonId||
    attemptIds.has(row.id))
    fail('Saved attempt has missing identity or duplicate ID.');
   attemptIds.add(row.id);
   attempts.push({id:row.id,packageId:row.packageId,
    version:row.version,lessonId:row.lessonId});
  }
 }
 return {sorted,attempts};
}
function verifyStructure(
 active:ActiveLessonManifest,aliases:readonly RevisionAlias[],
 blobs:readonly RevisionBlob[],attempts:readonly OriginalAttemptRef[]
){
 if(!active||typeof active.version!=='string'||!active.version||
  !active.packageId||!active.releaseDigest||!Array.isArray(active.lessons)||
  !active.lessons.length||!Array.isArray(aliases)||!Array.isArray(blobs))
  fail('Active manifest or source collections missing.');
 const revisionByHash=new Map<string,RevisionBlob>();
 for(const blob of blobs){
  if(!blob||!blob.lesson||!blob.lesson.id||!Array.isArray(blob.lesson.activities)||
   !blob.rubrics||typeof blob.rubrics!=='object'||
   !/^[a-f0-9]{64}$/.test(blob.revision)||revisionByHash.has(blob.revision))
   fail('Malformed, duplicate or unsupported source revision.');
  revisionByHash.set(blob.revision,blob);
 }
 const seenCurrent=new Set<string>();
 for(const x of active.lessons){
  if(!x||typeof x.lessonId!=='string'||seenCurrent.has(x.lessonId)||
   revisionByHash.get(x.revision)?.lesson.id!==x.lessonId)
   fail('Current lesson revision is missing or duplicated.');
  seenCurrent.add(x.lessonId);
 }
 const byAlias=new Map<string,RevisionAlias>();
 for(const x of aliases){
  if(!x||typeof x.version!=='string'||typeof x.lessonId!=='string'||
   !x.packageId||!x.releaseDigest||byAlias.has(aliasKey(x.version,x.lessonId))||
   revisionByHash.get(x.revision)?.lesson.id!==x.lessonId)
   fail('Historic lesson alias is missing, corrupt or duplicated.');
  byAlias.set(aliasKey(x.version,x.lessonId),x);
 }
 for(const a of attempts){
  const original=byAlias.get(aliasKey(a.version,a.lessonId));
  if(!original||original.packageId!==a.packageId)
   fail('Original source/rubric for a saved attempt is missing.');
 }
 return {revisionByHash,byAlias};
}
async function verifyHashes(blobs:readonly RevisionBlob[]){
 for(const b of blobs){
  const digest=await sha256(canonicalLessonJSON({lesson:b.lesson,rubrics:b.rubrics}));
  if(digest!==b.revision)fail('Source revision hash mismatch.');
 }
}
function core(packet:Omit<RevisionRecoveryV3,'sha256'>){
 return canonicalLessonJSON(packet);
}
function normalize(snapshot:{
 active:ActiveLessonManifest|null;aliases:RevisionAlias[];blobs:RevisionBlob[];
},entries:readonly LearnerEntry[]){
 if(!snapshot?.active)fail('No current content manifest for complete Recovery.');
 const {sorted,attempts}=checkedEntries(entries);
 const revisions=new Map(snapshot.blobs.map(x=>[x.revision,x]));
 if(revisions.size!==snapshot.blobs.length)fail('Duplicate revision source.');
 const aliases=new Map<string,RevisionAlias>();
 for(const a of snapshot.aliases){
  const key=aliasKey(a.version,a.lessonId);
  if(aliases.has(key))fail('Duplicate historical alias.');
  aliases.set(key,a);
 }
 const required=new Set<string>(snapshot.active.lessons.map(x=>x.revision));
 const requiredAliases=new Map<string,RevisionAlias>();
 for(const a of attempts){
  const key=aliasKey(a.version,a.lessonId);
  const pin=aliases.get(key);
  if(!pin||pin.packageId!==a.packageId)
   fail('Attempt source alias is missing; do not export incomplete history.');
  requiredAliases.set(key,pin);
  required.add(pin.revision);
 }
 const blobs=[...required].sort().map(id=>{
  const row=revisions.get(id);
  if(!row)fail('Referenced original lesson content was not found.');
  return row!;
 });
 const trimmed=[...requiredAliases.values()].sort((a,b)=>
  aliasKey(a.version,a.lessonId).localeCompare(aliasKey(b.version,b.lessonId)));
 verifyStructure(snapshot.active,trimmed,blobs,attempts);
 return {active:snapshot.active,aliases:trimmed,blobs,entries:sorted,attempts};
}
/**
 * Read-only assembly from a caller-controlled consistent snapshot.
 * Caller MUST inventory all owner-scoped localStorage and IDB keys and
 * separately prove no data changed while taking snapshots. No manual
 * content deletions are authorized merely by creating this archive.
 */
export async function createRevisionRecoveryV3(
 snapshot:{active:ActiveLessonManifest|null;aliases:RevisionAlias[];blobs:RevisionBlob[]},
 entries:readonly LearnerEntry[],exportedAt:string
):Promise<{text:string;sha256:string;attempts:number;uniqueRevisions:number}>{
 if(typeof exportedAt!=='string'||!Number.isFinite(Date.parse(exportedAt)))
  fail('Invalid backup timestamp.');
 const selected=normalize(snapshot,entries);
 await verifyHashes(selected.blobs);
 const values:Omit<RevisionRecoveryV3,'sha256'>={
  format:'g-learning-english.lesson-revision-recovery',schemaVersion:3,
  exportedAt,active:selected.active,aliases:selected.aliases,
  blobs:selected.blobs,entries:selected.entries};
 const sha=await sha256(core(values));
 const text=JSON.stringify({...values,sha256:sha},null,2)+'\n';
 if(bytes(text)>REVISION_RECOVERY_MAX_BYTES)fail('Complete source backup exceeds 25 MB.');
 return {text,sha256:sha,attempts:selected.attempts.length,
  uniqueRevisions:selected.blobs.length};
}
/** Fail closed on any mismatch; a verified file does not imply a safe RESTORE. */
export async function verifyRevisionRecoveryV3(text:string):Promise<{
 file:RevisionRecoveryV3;attempts:number;uniqueRevisions:number;sourceAliases:number;
}>{
 if(typeof text!=='string'||bytes(text)>REVISION_RECOVERY_MAX_BYTES)
  fail('Oversized or invalid Recovery V3 file.');
 let obj:unknown;
 try{obj=JSON.parse(text)}catch{fail('Backup JSON is malformed.')}
 if(!obj||typeof obj!=='object'||Array.isArray(obj))fail('Backup root is malformed.');
 const f=obj as RevisionRecoveryV3;
 if(f.format!=='g-learning-english.lesson-revision-recovery'||f.schemaVersion!==3||
  typeof f.exportedAt!=='string'||!Number.isFinite(Date.parse(f.exportedAt))||
  typeof f.sha256!=='string'||!/^[a-f0-9]{64}$/.test(f.sha256))
  fail('Unsupported Recovery version or checksum.');
 if(Object.keys(f).sort().join(',')!==
  ['format','schemaVersion','exportedAt','active','aliases','blobs','entries','sha256'].sort().join(','))
  fail('Unexpected Recovery fields.');
 const {sha256:_ignored,...data}=f;
 if(await sha256(core(data))!==f.sha256)fail('Checksum mismatch.');
 const {sorted,attempts}=checkedEntries(f.entries);
 if(canonicalLessonJSON(sorted)!==canonicalLessonJSON(f.entries))
  fail('Learner storage keys are not in canonical order.');
 verifyStructure(f.active,f.aliases,f.blobs,attempts);
 await verifyHashes(f.blobs);
 return {file:f,attempts:attempts.length,uniqueRevisions:f.blobs.length,
  sourceAliases:f.aliases.length};
}
/** For a future empty-profile restore adapter, NOT an automatic restore. */
export function verifiedRecoveryToPlan(file:RevisionRecoveryV3):LessonRevisionPlan{
 const {attempts}=checkedEntries(file.entries);
 verifyStructure(file.active,file.aliases,file.blobs,attempts);
 return {
  active:file.active,blobs:file.blobs,aliases:file.aliases,
  inputVersions:1,protectedAttemptCount:attempts.length,
  uniqueProtectedSources:file.aliases.length
 };
}
