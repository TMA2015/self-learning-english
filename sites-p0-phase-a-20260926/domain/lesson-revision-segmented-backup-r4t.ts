import {
 canonicalLessonJSON,
 type RevisionBlob,type RevisionAlias,type ActiveLessonManifest
} from './lesson-revision-plan';
import type {LearnerEntry} from './lesson-revision-recovery-v3';

/**
 * R4t: RESEARCH ONLY, portable multi-part backup for >25MB normalized source.
 * Synthetic browser QA; no product integration, no real Recovery import.
 * All part contents are verified BEFORE any possible future restore writes.
 * SHA-256 is corruption detection, NOT provenance/authenticity protection.
 */
export const R4T_MAX_PART_BYTES=1_000_000;
const MAX_MANIFEST_BYTES=4_000_000,MAX_TOTAL_BYTES=256_000_000;
const MAX_PARTS=512;
const FORMAT='sle-lesson-revision-segmented-research';
type Snapshot={
 active:ActiveLessonManifest;
 aliases:RevisionAlias[];
 blobs:RevisionBlob[];
 entries:LearnerEntry[];
};
type PartRecord={index:number;blobs:RevisionBlob[]};
type PartSpec={index:number;bytes:number;sha256:string;blobs:number};
type Core={
 format:typeof FORMAT;schemaVersion:4;exportedAt:string;
 active:ActiveLessonManifest;aliases:RevisionAlias[];
 entries:LearnerEntry[];parts:PartSpec[];
 totalRevisions:number;totalActiveLessons:number;totalAttempts:number;
};
export type Segment={index:number;text:string};
export type R4tPacket={manifestText:string;parts:Segment[]};
type Manifest=Core&{sha256:string};
function fail(message:string):never{
 throw Error('R4t segmented research Recovery blocked: '+message);
}
function bytes(value:string){return new TextEncoder().encode(value).byteLength}
async function hash(value:string){
 if(typeof crypto==='undefined'||!crypto.subtle)fail('Secure SHA-256 unavailable');
 const raw=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
 return Array.from(new Uint8Array(raw),b=>b.toString(16).padStart(2,'0')).join('');
}
function key(version:string,lessonId:string){
 return JSON.stringify([version,lessonId]);
}
const validSha=(value:unknown)=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
async function verifyClosure(snapshot:Snapshot):Promise<number>{
 const {active,aliases,blobs,entries}=snapshot;
 if(!active||typeof active.packageId!=='string'||!active.packageId||
  !Array.isArray(active.lessons)||active.lessons.length===0||
  !Array.isArray(aliases)||!Array.isArray(blobs)||blobs.length===0||
  !Array.isArray(entries))
  fail('Missing full current catalog / historical source / learner entries');
 const revisions=new Map<string,RevisionBlob>();
 for(const blob of blobs){
  if(!blob||!validSha(blob.revision)||!blob.lesson||
   typeof blob.lesson.id!=='string'||!blob.lesson.id||
   !Array.isArray(blob.lesson.activities)||!blob.rubrics||
   typeof blob.rubrics!=='object'||Array.isArray(blob.rubrics)||
   revisions.has(blob.revision))
   fail('Invalid or duplicate immutable Lesson source');
  const actual=await hash(canonicalLessonJSON({lesson:blob.lesson,rubrics:blob.rubrics}));
  if(actual!==blob.revision)fail('Lesson revision hash mismatch');
  revisions.set(blob.revision,blob);
 }
 const activeIds=new Set<string>();
 for(const ref of active.lessons){
  if(!ref||typeof ref.lessonId!=='string'||activeIds.has(ref.lessonId)||
   revisions.get(ref.revision)?.lesson.id!==ref.lessonId)
   fail('Current Lesson source missing or duplicated');
  activeIds.add(ref.lessonId);
 }
 const historic=new Map<string,RevisionAlias>();
 for(const alias of aliases){
  if(!alias||typeof alias.version!=='string'||!alias.version||
   typeof alias.lessonId!=='string'||!alias.lessonId||
   !alias.packageId||!alias.releaseDigest||
   historic.has(key(alias.version,alias.lessonId))||
   revisions.get(alias.revision)?.lesson.id!==alias.lessonId)
   fail('Historic Lesson or rubric version missing');
  historic.set(key(alias.version,alias.lessonId),alias);
 }
 let attempts=0;
 const entryKeys=new Set<string>();
 for(const row of entries){
  if(!row||typeof row.key!=='string'||typeof row.value!=='string'||
   !/^g-learning:english:v1:owner:[^:]+:(academic-attempts|course-selection|learner:[^:]+:(state|evidence|assessments|snapshots|legacy-imported))$/.test(row.key)||
   entryKeys.has(row.key))
   fail('Unknown, duplicate or malformed learner data key');
  entryKeys.add(row.key);
  if(!row.key.endsWith(':academic-attempts'))continue;
  let parsed:unknown;
  try{parsed=JSON.parse(row.value)}catch{fail('Invalid learner attempt JSON')}
  if(!Array.isArray(parsed))fail('Learner attempts are not an array');
  const attemptIds=new Set<string>();
  for(const a of parsed){
   if(!a||typeof a!=='object'||Array.isArray(a))
    fail('Malformed learner attempt');
   const x=a as {id?:unknown;version?:unknown;lessonId?:unknown;packageId?:unknown};
   if(typeof x.id!=='string'||!x.id||attemptIds.has(x.id)||
    typeof x.version!=='string'||typeof x.lessonId!=='string'||
    typeof x.packageId!=='string')
    fail('Saved attempt identity/provenance missing or repeated');
   attemptIds.add(x.id);
   if(historic.get(key(x.version,x.lessonId))?.packageId!==x.packageId)
    fail('Original answer/rubric source is missing for an old attempt');
   attempts++;
  }
 }
 return attempts;
}
export async function buildR4tSegmentedResearchBackup(
 source:Snapshot,exportedAt:string
):Promise<R4tPacket>{
 if(typeof exportedAt!=='string'||!Number.isFinite(Date.parse(exportedAt)))
  fail('Invalid export timestamp');
 const attempts=await verifyClosure(source);
 const parts:Segment[]=[],specs:PartSpec[]=[];
 let batch:RevisionBlob[]=[];
 let batchBytes=0;
 async function flush(){
  if(!batch.length)return;
  const index=parts.length;
  const text=canonicalLessonJSON({index,blobs:batch} as PartRecord);
  const n=bytes(text);
  if(n>R4T_MAX_PART_BYTES)fail('One segment exceeds one MB');
  parts.push({index,text});
  specs.push({index,bytes:n,sha256:await hash(text),blobs:batch.length});
  batch=[];batchBytes=0;
  if(parts.length>MAX_PARTS)fail('Too many backup segments');
 }
 for(const blob of source.blobs){
  // Leave space for the part header, commas, and JSON array delimiters.
  const size=bytes(canonicalLessonJSON(blob))+2;
  if(size+100>R4T_MAX_PART_BYTES)
   fail('One immutable revision is too large to fit in one segment');
  if(batchBytes+size+100>R4T_MAX_PART_BYTES)await flush();
  batch.push(blob);batchBytes+=size;
 }
 await flush();
 const core:Core={
  format:FORMAT,schemaVersion:4,exportedAt,
  active:source.active,aliases:source.aliases,
  entries:[...source.entries].sort((a,b)=>a.key.localeCompare(b.key)),
  parts:specs,totalRevisions:source.blobs.length,
  totalActiveLessons:source.active.lessons.length,totalAttempts:attempts
 };
 const manifestText=canonicalLessonJSON({...core,sha256:await hash(canonicalLessonJSON(core))});
 if(bytes(manifestText)>MAX_MANIFEST_BYTES)fail('Manifest too large');
 if(bytes(manifestText)+specs.reduce((sum,p)=>sum+p.bytes,0)>MAX_TOTAL_BYTES)
  fail('Complete segmented archive exceeds bounded research limit');
 return {manifestText,parts};
}
export async function verifyR4tSegmentedResearchBackup(
 packet:R4tPacket
):Promise<{source:Snapshot;attempts:number;activeLessons:number;bytes:number;partCount:number}>{
 if(!packet||typeof packet.manifestText!=='string'||
  bytes(packet.manifestText)>MAX_MANIFEST_BYTES||
  !Array.isArray(packet.parts))fail('Malformed or oversized manifest/segments');
 let parsed:unknown;
 try{parsed=JSON.parse(packet.manifestText)}catch{fail('Manifest JSON unreadable')}
 if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))
  fail('Malformed manifest');
 const m=parsed as Manifest;
 if(m.format!==FORMAT||m.schemaVersion!==4||
  !Number.isFinite(Date.parse(m.exportedAt))||!validSha(m.sha256)||
  !Array.isArray(m.parts)||m.parts.length===0||
  m.parts.length>MAX_PARTS||packet.parts.length!==m.parts.length)
  fail('Missing, truncated, unsupported or extra backup segments');
 const {sha256,...core}=m;
 if(await hash(canonicalLessonJSON(core))!==sha256)
  fail('Manifest checksum mismatch');
 const all:RevisionBlob[]=[];
 let totalBytes=bytes(packet.manifestText);
 for(let i=0;i<m.parts.length;i++){
  const spec=m.parts[i],chunk=packet.parts[i];
  if(!spec||spec.index!==i||!chunk||chunk.index!==i||
   typeof chunk.text!=='string'||!validSha(spec.sha256)||
   !Number.isSafeInteger(spec.bytes)||spec.bytes<=0||
   spec.bytes>R4T_MAX_PART_BYTES||!Number.isSafeInteger(spec.blobs)||
   spec.blobs<=0)
   fail('Missing, reordered, duplicated or incorrectly-sized backup part');
  const n=bytes(chunk.text);
  totalBytes+=n;
  if(n!==spec.bytes||await hash(chunk.text)!==spec.sha256)
   fail('Part checksum/byte count mismatch');
  let item:unknown;
  try{item=JSON.parse(chunk.text)}catch{fail('Part JSON unreadable')}
  const p=item as PartRecord;
  if(!p||p.index!==i||!Array.isArray(p.blobs)||
   p.blobs.length!==spec.blobs)
   fail('Part revision count or sequence mismatch');
  all.push(...p.blobs);
 }
 if(totalBytes>MAX_TOTAL_BYTES||all.length!==m.totalRevisions)
  fail('Incomplete or oversized full source inventory');
 const source:Snapshot={
  active:m.active,aliases:m.aliases,entries:m.entries,blobs:all
 };
 const attempts=await verifyClosure(source);
 if(attempts!==m.totalAttempts||
  source.active.lessons.length!==m.totalActiveLessons)
  fail('Attempt or active Lesson count differs from certified manifest');
 return {source,attempts,activeLessons:source.active.lessons.length,
  bytes:totalBytes,partCount:packet.parts.length};
}
