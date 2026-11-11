import {
 buildR4tSegmentedResearchBackup,verifyR4tSegmentedResearchBackup,
 type R4tPacket
} from '../../domain/lesson-revision-segmented-backup-r4t';
import {
 canonicalLessonJSON,type RevisionBlob,type RevisionAlias,
 type ActiveLessonManifest
} from '../../domain/lesson-revision-plan';
import type {LearnerEntry} from '../../domain/lesson-revision-recovery-v3';

/**
 * R4u RESEARCH-ONLY 45MB+ segmented archive restoration.
 * One native IDB transaction commits all normalized source and learner rows
 * together on an EMPTY disposable browser origin. Original V2 is untouched.
 * Neither the format nor these stores are installed in the live Site.
 */
export const R4U_DB='sle-issue103-r4u-disposable-segmented-restore';
const STORES=['meta','blobs','aliases','entries'];
type Control={
 key:'manifest';manifestText:string;blobOrder:string[];
};
type AliasRow=RevisionAlias&{key:string};
type Stored={
 control:Control|null;blobs:RevisionBlob[];
 aliases:AliasRow[];entries:LearnerEntry[];
};
const fail=(message:string)=>Error('R4u disposable restore blocked: '+message);
const aliasKey=(v:string,l:string)=>JSON.stringify([v,l]);

async function open(factory:IDBFactory):Promise<IDBDatabase>{
 return await new Promise((resolve,reject)=>{
  const req=factory.open(R4U_DB,1);
  req.onupgradeneeded=()=>{
   const db=req.result;
   if(!db.objectStoreNames.contains('meta'))db.createObjectStore('meta',{keyPath:'key'});
   if(!db.objectStoreNames.contains('blobs'))db.createObjectStore('blobs',{keyPath:'revision'});
   if(!db.objectStoreNames.contains('aliases'))db.createObjectStore('aliases',{keyPath:'key'});
   if(!db.objectStoreNames.contains('entries'))db.createObjectStore('entries',{keyPath:'key'});
  };
  req.onblocked=()=>reject(fail('Another tab has opened the research database'));
  req.onerror=()=>reject(fail('Cannot open research destination'));
  req.onsuccess=()=>{
   const db=req.result;
   db.onversionchange=()=>db.close();
   resolve(db);
  };
 });
}
async function inventory(db:IDBDatabase):Promise<{
 control:number;blobs:number;aliases:number;entries:number
}>{
 return await new Promise((resolve,reject)=>{
  const tx=db.transaction(STORES,'readonly');
  const a=tx.objectStore('meta').count(),b=tx.objectStore('blobs').count(),
   c=tx.objectStore('aliases').count(),d=tx.objectStore('entries').count();
  tx.oncomplete=()=>resolve({
   control:a.result,blobs:b.result,aliases:c.result,entries:d.result
  });
  tx.onabort=()=>reject(fail('Cannot count destination records'));
  tx.onerror=()=>reject(fail('Destination inventory read failed'));
 });
}
/** Verified *complete* multipart archive FIRST; then one all-store write. */
export async function restoreR4uVerifiedParts(
 factory:IDBFactory,packet:R4tPacket,
 deliberatelyAbortAfter64Bodies=false
):Promise<{status:'ABORTED'|'COMMITTED';lessons:number;attempts:number;parts:number}>{
 // A missing, corrupted or checksum-valid but semantically incomplete
 // archive must fail before even opening or changing a destination.
 const {source,attempts,partCount}=await verifyR4tSegmentedResearchBackup(packet);
 const db=await open(factory);
 try{
  const initial=await inventory(db);
  if(Object.values(initial).some(n=>n!==0))
   throw fail('Destination is occupied; never overwrite or merge');
  const core=JSON.parse(packet.manifestText) as {
   active:ActiveLessonManifest;aliases:RevisionAlias[];entries:LearnerEntry[];
  };
  if(canonicalLessonJSON(core.active)!==canonicalLessonJSON(source.active)||
   canonicalLessonJSON(core.entries)!==canonicalLessonJSON(
    [...source.entries].sort((a,b)=>a.key.localeCompare(b.key))))
   throw fail('Source manifest differs from verified complete packet');
  const outcome=await new Promise<'ABORTED'|'COMMITTED'>((resolve,reject)=>{
   const tx=db.transaction(STORES,'readwrite',{durability:'strict'});
   if(tx.durability!=='strict'){
    try{tx.abort()}catch{}
    reject(fail('Requested strict IDB durability not available'));
    return;
   }
   const meta=tx.objectStore('meta'),blobs=tx.objectStore('blobs');
   const aliases=tx.objectStore('aliases'),entries=tx.objectStore('entries');
   meta.add({key:'manifest',manifestText:packet.manifestText,
    blobOrder:source.blobs.map(b=>b.revision)} as Control);
   let completedBlobRequests=0;
   for(const b of source.blobs){
    const req=blobs.add(b);
    req.onsuccess=()=>{
     completedBlobRequests++;
     if(deliberatelyAbortAfter64Bodies&&completedBlobRequests===64)
      try{tx.abort()}catch{}
    };
   }
   for(const a of source.aliases)
    aliases.add({...a,key:aliasKey(a.version,a.lessonId)} as AliasRow);
   for(const e of source.entries)entries.add(e);
   tx.oncomplete=()=>deliberatelyAbortAfter64Bodies?
    reject(fail('Deliberate mid-write abort unexpectedly committed')):
    resolve('COMMITTED');
   tx.onabort=()=>deliberatelyAbortAfter64Bodies?
    resolve('ABORTED'):
    reject(fail('One-transaction restore rolled back'));
   tx.onerror=()=>{if(!deliberatelyAbortAfter64Bodies)
    reject(fail('One-transaction restore encountered a write error'))};
  });
  if(outcome==='ABORTED'){
   const after=await inventory(db);
   if(Object.values(after).some(n=>n!==0))
    throw fail('Aborted restore left a partially written destination');
  }
  return {status:outcome,lessons:source.active.lessons.length,
   attempts,parts:partCount};
 }finally{db.close()}
}
async function readStored(db:IDBDatabase):Promise<Stored>{
 return await new Promise((resolve,reject)=>{
  const tx=db.transaction(STORES,'readonly');
  const m=tx.objectStore('meta').get('manifest'),
   b=tx.objectStore('blobs').getAll(),
   a=tx.objectStore('aliases').getAll(),
   e=tx.objectStore('entries').getAll();
  tx.oncomplete=()=>resolve({
   control:(m.result as Control|undefined)??null,
   blobs:b.result as RevisionBlob[],aliases:a.result as AliasRow[],
   entries:e.result as LearnerEntry[]
  });
  tx.onabort=()=>reject(fail('Restored destination read aborted'));
  tx.onerror=()=>reject(fail('Restored destination cannot be read'));
 });
}
/** Deliberate FULL post-restart readback, not a routine Unit navigation API. */
export async function inspectR4uRestoredFullArchive(factory:IDBFactory):
 Promise<{lessons:number;attempts:number;parts:number;bytes:number;
  learnerKeys:number;historyAliases:number;oldWritingValue:string|null}>{
 const db=await open(factory);
 let stored:Stored;
 try{stored=await readStored(db)}finally{db.close()}
 const meta=stored.control;
 if(!meta||!Array.isArray(meta.blobOrder)||
  meta.blobOrder.length!==stored.blobs.length)
  throw fail('No complete single-transaction committed restore');
 let manifest:unknown;
 try{manifest=JSON.parse(meta.manifestText)}
 catch{throw fail('Original manifest was not stored intact')}
 const header=manifest as {
  active:ActiveLessonManifest;aliases:RevisionAlias[];
  entries:LearnerEntry[];exportedAt:string
 };
 const byRevision=new Map(stored.blobs.map(b=>[b.revision,b]));
 if(byRevision.size!==meta.blobOrder.length||
  new Set(meta.blobOrder).size!==meta.blobOrder.length)
  throw fail('Missing or repeated immutable source revisions');
 const blobs=meta.blobOrder.map(r=>{
  const found=byRevision.get(r);
  if(!found)throw fail('Manifest points to a lost revision after restart');
  return found;
 });
 const byAlias=new Map(stored.aliases.map(a=>
  [aliasKey(a.version,a.lessonId),a]));
 if(byAlias.size!==stored.aliases.length)
  throw fail('Duplicate historical aliases in restored vault');
 const aliases=header.aliases.map(a=>{
  const row=byAlias.get(aliasKey(a.version,a.lessonId));
  if(!row)throw fail('Lost original grading alias');
  const {key:_key,...value}=row;
  if(canonicalLessonJSON(value)!==canonicalLessonJSON(a))
   throw fail('Original grading provenance changed');
  return value;
 });
 if(aliases.length!==stored.aliases.length)
  throw fail('Unexpected extra grading aliases');
 if(canonicalLessonJSON(stored.entries)!==
  canonicalLessonJSON([...header.entries].sort((a,b)=>a.key.localeCompare(b.key))))
  throw fail('Restored learner/Writing/course bytes differ from backup');
 const source={active:header.active,aliases,blobs,entries:stored.entries};
 const rebuilt=await buildR4tSegmentedResearchBackup(source,header.exportedAt);
 if(rebuilt.manifestText!==meta.manifestText)
  throw fail('Rebuilt complete backup differs from original manifest/hash');
 const check=await verifyR4tSegmentedResearchBackup(rebuilt);
 const writing=stored.entries.find(e=>e.key.endsWith(':learner:primary:state'))?.value??null;
 return {lessons:check.activeLessons,attempts:check.attempts,
  parts:check.partCount,bytes:check.bytes,
  learnerKeys:stored.entries.length,
  historyAliases:aliases.length,oldWritingValue:writing};
}
