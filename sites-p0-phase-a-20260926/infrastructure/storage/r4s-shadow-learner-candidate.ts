import {
 createRevisionRecoveryV3,verifyRevisionRecoveryV3,type LearnerEntry
} from '../../domain/lesson-revision-recovery-v3';
import {
 canonicalLessonJSON,type RevisionBlob,type RevisionAlias,
 type ActiveLessonManifest
} from '../../domain/lesson-revision-plan';

/**
 * R4s ISOLATED RESEARCH ONLY. Stages verified V2-derived learner/Writing/course
 * values as ONE IndexedDB record; original V2 localStorage remains authoritative.
 * No release integration, no delete/clear API, no automatic user migration.
 */
export const R4S_SHADOW_DB='sle-issue103-r4s-shadow-learner-candidate';
const STORE='shadow';
const KEY='candidate';
type Snapshot={
 active:ActiveLessonManifest|null;blobs:RevisionBlob[];aliases:RevisionAlias[];
};
type ShadowCore={
 format:'sle-r4s-disposable-shadow';schemaVersion:1;
 sourceSha256:string;legacySnapshotDigest:string;entries:LearnerEntry[];
};
export type ShadowCandidate=ShadowCore&{checksum:string};
const blocked=(why:string)=>Error('R4s shadow candidate blocked: '+why+
 '. Old V2 browser records remain authoritative.');
async function hash(value:string){
 if(typeof crypto==='undefined'||!crypto.subtle)
  throw blocked('Browser SHA unavailable');
 const data=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
 return Array.from(new Uint8Array(data),b=>b.toString(16).padStart(2,'0')).join('');
}
function same(a:unknown,b:unknown){
 return canonicalLessonJSON(a)===canonicalLessonJSON(b);
}
function checkDigest(value:string){
 if(!/^[a-f0-9]{64}$/.test(value))throw blocked('Missing original legacy digest');
}
async function open(factory:IDBFactory):Promise<IDBDatabase>{
 return await new Promise((resolve,reject)=>{
  const req=factory.open(R4S_SHADOW_DB,1);
  req.onupgradeneeded=()=>{
   if(!req.result.objectStoreNames.contains(STORE))
    req.result.createObjectStore(STORE);
  };
  req.onblocked=()=>reject(blocked('IndexedDB version blocked'));
  req.onerror=()=>reject(blocked('Cannot open test-only candidate database'));
  req.onsuccess=()=>resolve(req.result);
 });
}
async function read(db:IDBDatabase):Promise<ShadowCandidate|null>{
 return await new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE,'readonly');
  const req=tx.objectStore(STORE).get(KEY);
  let row:ShadowCandidate|null=null;
  req.onsuccess=()=>{row=(req.result as ShadowCandidate|undefined)??null};
  tx.oncomplete=()=>resolve(row);
  tx.onabort=()=>reject(blocked('Candidate read transaction aborted'));
  tx.onerror=()=>reject(blocked('Candidate read transaction failed'));
 });
}
async function verifyCandidateRow(row:ShadowCandidate|null){
 if(!row||row.format!=='sle-r4s-disposable-shadow'||row.schemaVersion!==1||
  !Array.isArray(row.entries)||typeof row.checksum!=='string')
  throw blocked('Missing or malformed single committed candidate');
 checkDigest(row.sourceSha256);
 checkDigest(row.legacySnapshotDigest);
 const {checksum,...core}=row;
 if(!/^[a-f0-9]{64}$/.test(checksum)||
  await hash(canonicalLessonJSON(core))!==checksum)
  throw blocked('Single shadow candidate commit checksum mismatch');
 return row;
}
async function checkOld(expected:string,current:()=>Promise<string>){
 const actual=await current();
 if(actual!==expected)throw blocked('Old learner data no longer matches verified V2');
}
/** Write one complete candidate record with strict durability requested. */
export async function stageR4sShadowCandidate(
 factory:IDBFactory,verifiedV3Text:string,
 expectedOldDigest:string,readCurrentOldDigest:()=>Promise<string>
):Promise<{checksum:string;entries:number}>{
 checkDigest(expectedOldDigest);
 const verified=await verifyRevisionRecoveryV3(verifiedV3Text);
 await checkOld(expectedOldDigest,readCurrentOldDigest);
 const core:ShadowCore={
  format:'sle-r4s-disposable-shadow',schemaVersion:1,
  sourceSha256:verified.file.sha256,
  legacySnapshotDigest:expectedOldDigest,
  entries:verified.file.entries.map(e=>({key:e.key,value:e.value}))
 };
 const checksum=await hash(canonicalLessonJSON(core));
 await checkOld(expectedOldDigest,readCurrentOldDigest);
 const db=await open(factory);
 try{
  await new Promise<void>((resolve,reject)=>{
   const tx=db.transaction(STORE,'readwrite',{durability:'strict'});
   const store=tx.objectStore(STORE);
   const req=store.get(KEY);
   let reason='';
   req.onsuccess=()=>{
    if(req.result!==undefined){
     reason='Shadow candidate already exists; never overwrite';
     try{tx.abort()}catch{}
    }else store.add({...core,checksum},KEY);
   };
   tx.oncomplete=()=>resolve();
   tx.onabort=()=>reject(blocked(reason||'Shadow candidate transaction aborted'));
   tx.onerror=()=>reject(blocked('Cannot commit shadow candidate'));
  });
  const written=await verifyCandidateRow(await read(db));
  if(written.checksum!==checksum||!same(written.entries,core.entries))
   throw blocked('Candidate differs after native commit');
 }finally{db.close()}
 // A concurrent change after commit invalidates preview but never causes
 // legacy writes or marks the research candidate as authoritative.
 await checkOld(expectedOldDigest,readCurrentOldDigest);
 return {checksum,entries:core.entries.length};
}
/** Verify one complete IDB record and assemble a portable V3 from source. */
export async function verifyR4sShadowCandidate(
 factory:IDBFactory,verifiedV3Text:string,
 expectedOldDigest:string,readCurrentOldDigest:()=>Promise<string>,
 readSource:()=>Promise<Snapshot>,exportedAt:string
):Promise<{text:string;attempts:number;sourceRevisions:number}>{
 checkDigest(expectedOldDigest);
 const expected=await verifyRevisionRecoveryV3(verifiedV3Text);
 await checkOld(expectedOldDigest,readCurrentOldDigest);
 const db=await open(factory);
 let row:ShadowCandidate;
 try{row=await verifyCandidateRow(await read(db))}
 finally{db.close()}
 if(row.legacySnapshotDigest!==expectedOldDigest||
  row.sourceSha256!==expected.file.sha256||
  !same(row.entries,expected.file.entries))
  throw blocked('Committed candidate differs from verified old learner bytes');
 const sourceA=await readSource();
 if(!sourceA.active||!same(sourceA.active,expected.file.active))
  throw blocked('Immutable original active source is missing');
 const rebuilt=await createRevisionRecoveryV3(sourceA,row.entries,exportedAt);
 const checked=await verifyRevisionRecoveryV3(rebuilt.text);
 if(!same(checked.file.active,expected.file.active)||
  !same(checked.file.aliases,expected.file.aliases)||
  !same(checked.file.blobs,expected.file.blobs)||
  !same(checked.file.entries,expected.file.entries)||
  checked.attempts!==expected.attempts)
  throw blocked('Reassembled complete Recovery differs from original V2');
 const sourceB=await readSource();
 if(!same(sourceA,sourceB))
  throw blocked('Original immutable source changed during assembly');
 await checkOld(expectedOldDigest,readCurrentOldDigest);
 return {text:rebuilt.text,attempts:checked.attempts,
  sourceRevisions:checked.uniqueRevisions};
}
