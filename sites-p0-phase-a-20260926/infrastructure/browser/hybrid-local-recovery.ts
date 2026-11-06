import {decodePackageDocument,retainReferencedLessons,type StoredAcademicPackage} from '../../domain/storage-retention';
import {reconcileRecoverySources} from '../../domain/recovery-source-union';
import {verifyLocalRecoveryV2,RECOVERY_FILENAME,RECOVERY_MAX_BYTES,RECOVERY_MARKER} from './local-recovery';
import type {IndexedDBCurriculumVault} from '../storage/indexeddb-curriculum-vault';

const PREFIX='g-learning:english:v1';
const PACKAGE_KEY=PREFIX+':academic:packages';
type Entry={key:string;value:string};
export type EnumerableStore={
 length:number;key(index:number):string|null;
 getItem(key:string):string|null;
 setItem(key:string,value:string):void;
 removeItem(key:string):void;
};
type Vault=Pick<IndexedDBCurriculumVault,'list'|'putImmutable'>;
type RecoveryFile={
 format:'g-learning-english.recovery';schemaVersion:2;exportedAt:string;
 entries:Entry[];sha256:string;
};
function acceptable(key:string){
 const suffix=key.slice(PREFIX.length+1);
 return key.startsWith(PREFIX+':')&&(suffix==='academic:packages'||
 /^owner:[^:]+:(academic-attempts|course-selection|learner:[^:]+:(state|evidence|assessments|snapshots|legacy-imported))$/.test(suffix));
}
function entriesIn(storage:EnumerableStore){
 const rows:Entry[]=[];
 for(let i=0;i<storage.length;i++){
  const key=storage.key(i);if(!key)continue;
  if(key.startsWith(PREFIX+':')&&key!==RECOVERY_MARKER&&!acceptable(key))
   throw Error('Unknown local learner key: complete Recovery blocked without deleting data.');
  if(!acceptable(key))continue;
  const value=storage.getItem(key);
  if(value!==null)rows.push({key,value});
 }
 return rows.sort((a,b)=>a.key.localeCompare(b.key));
}
async function hash(v:string){
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v));
 return Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
}
function attemptRows(entries:readonly Entry[]){
 const rows:{version:string;lessonId:string}[]=[];
 for(const e of entries.filter(x=>x.key.endsWith(':academic-attempts'))){
  let saved:unknown;
  try{saved=JSON.parse(e.value)}catch{throw Error('Malformed saved attempts; complete Recovery blocked.')}
  if(!Array.isArray(saved))throw Error('Malformed saved attempts; complete Recovery blocked.');
  for(const a of saved){
   if(!a||typeof a.version!=='string'||typeof a.lessonId!=='string')
    throw Error('Malformed saved attempts; complete Recovery blocked.');
   rows.push({version:a.version,lessonId:a.lessonId});
  }
 }
 return rows;
}
function legacyPackages(entries:readonly Entry[]):StoredAcademicPackage[]{
 const value=entries.find(x=>x.key===PACKAGE_KEY)?.value;
 if(!value)return [];
 try{return decodePackageDocument(JSON.parse(value)).records}
 catch{throw Error('Stored legacy curriculum content is invalid; complete Recovery blocked.')}
}
async function parsedVerifiedFile(text:string){
 // Canonical V2 verification handles SHA, forbidden keys, missing historic
 // sources and duplicate curriculum versions. No untrusted source bypass.
 const verified=await verifyLocalRecoveryV2(text);
 const file=JSON.parse(text) as RecoveryFile;
 if(file.sha256!==verified.sha256)throw Error('Recovery checksum changed.');
 return {file,verified};
}
function learnerOccupied(entries:readonly Entry[]){
 return entries.some(e=>e.key!==PACKAGE_KEY&&!e.key.endsWith(':legacy-imported')&&
  e.value!=='[]'&&e.value!=='{}'&&e.value!==''&&e.value!=='null');
}
function valuesMatch(a:unknown,b:unknown){return JSON.stringify(a)===JSON.stringify(b)}

/**
 * Compatibility: exports the EXACT old V2 Recovery file shape with one synthetic
 * content key. New content lives in IndexedDB but the checksum-protected portable
 * JSON still includes every source required to resume historical attempts.
 *
 * No modification to either storage system occurs during export.
 */
export async function exportHybridRecoveryV2(storage:EnumerableStore,vault:Vault){
 if(storage.getItem(RECOVERY_MARKER))throw Error('An interrupted Recovery was detected. Export blocked.');
 const before=entriesIn(storage),saved=attemptRows(before);
 const sourceBefore=await vault.list();
 const union=reconcileRecoverySources(legacyPackages(before),sourceBefore,saved);
 const portable=retainReferencedLessons(union.records,saved);
 const packaged:Entry={key:PACKAGE_KEY,
  value:JSON.stringify({schema:2,retention:true,records:portable.records})};
 const entries=[...before.filter(x=>x.key!==PACKAGE_KEY),packaged]
  .sort((a,b)=>a.key.localeCompare(b.key));
 const checksum=await hash(JSON.stringify(entries));
 const file:RecoveryFile={format:'g-learning-english.recovery',schemaVersion:2,
  exportedAt:new Date().toISOString(),entries,sha256:checksum};
 const text=JSON.stringify(file,null,2)+'\n';
 if(new TextEncoder().encode(text).byteLength>RECOVERY_MAX_BYTES)
  throw Error('Complete Recovery exceeds the 25 MB file safety limit.');
 const check=await verifyLocalRecoveryV2(text);
 if(check.attempts!==saved.length||check.versions!==portable.records.length)
  throw Error('Hybrid Recovery verification did not match all saved attempts.');
 if(!valuesMatch(entriesIn(storage),before)||
  !valuesMatch(await vault.list(),sourceBefore))
  throw Error('Learning data or IndexedDB content changed during Recovery export. Close other tabs and retry.');
 return {filename:RECOVERY_FILENAME,text,bytes:new TextEncoder().encode(text).byteLength,
  versions:check.versions,attempts:check.attempts};
}

/** Only accepts an empty learner profile; existing bundled content is okay. */
export async function previewHybridRecoveryV2(text:string,storage:EnumerableStore,vault:Vault){
 const {file,verified}=await parsedVerifiedFile(text);
 const existing=entriesIn(storage);
 const marker=storage.getItem(RECOVERY_MARKER);
 const errors:string[]=[];
 if(marker&&marker!==file.sha256)
  errors.push('An interrupted Restore requires its original verified V2 Recovery file.');
 if(!marker&&learnerOccupied(existing))
  errors.push('This browser already contains learner data. Restore cannot overwrite saved work.');
 const present=await vault.list();
 // Immutable collision detection before writing anything. A complete source
 // from the backup can coexist with a compatible referenced-lesson archive.
 try{reconcileRecoverySources(legacyPackages(existing),present,[]);
  reconcileRecoverySources(present,legacyPackages(file.entries),[]);
  reconcileRecoverySources([...legacyPackages(existing),...present],legacyPackages(file.entries),[]);
 }catch{errors.push('Immutable curriculum source conflict in this browser. No data changed.')}
 const token=errors.length?'':await hash(JSON.stringify({
  checksum:file.sha256,existing,marker,present
 }));
 return {valid:errors.length===0,errors,token,attempts:verified.attempts,
  versions:verified.versions,exportedAt:verified.exportedAt};
}

/**
 * Content-only IndexedDB inserts may survive a failure: they are immutable,
 * cannot contain learner attempts and make safe retry possible. Learner-key
 * localStorage writes are rolled back, and no legacy curriculum key is added.
 *
 * This cross-store operation is NOT a single atomic multi-database transaction.
 * It therefore requires the marker and a post-restore source/attempt check.
 */
export async function restoreHybridRecoveryV2(
 text:string,token:string,confirmed:boolean,storage:EnumerableStore,vault:Vault
){
 if(!confirmed||!token)throw Error('Explicit verified Recovery confirmation required.');
 const p=await previewHybridRecoveryV2(text,storage,vault);
 if(!p.valid||p.token!==token)throw Error('Restore source or target changed. Preview again.');
 const {file,verified}=await parsedVerifiedFile(text);
 const content=legacyPackages(file.entries),learning=file.entries.filter(x=>x.key!==PACKAGE_KEY);
 const saved=attemptRows(file.entries);
 const oldMarker=storage.getItem(RECOVERY_MARKER);
 const previous=new Map(learning.map(e=>[e.key,storage.getItem(e.key)] as const));
 const changed:Entry[]=[];
 let markerWritten=false;
 try{
  storage.setItem(RECOVERY_MARKER,file.sha256);markerWritten=true;
  const existing=await vault.list();
  for(const row of content){
   const already=existing.find(x=>x.version===row.version);
   if(already){
    // A pre-existing complete package may supersede an exported historic
    // archive. Both must be demonstrably source-compatible first.
    reconcileRecoverySources([already],[row],[]);
    if(already.archive&&(!row.archive||row.source.lessons.length>already.source.lessons.length))
     throw Error('Existing archived source is missing incoming historic lessons; Restore cannot overwrite it.');
    continue;
   }
   await vault.putImmutable(row);
  }
  const allSources=reconcileRecoverySources(
   legacyPackages(entriesIn(storage)),await vault.list(),saved);
  if(allSources.attempts!==saved.length)
   throw Error('Historical source readback failed before learner write.');
  for(const e of learning){
   if(storage.getItem(e.key)===e.value)continue;
   storage.setItem(e.key,e.value);changed.push(e);
  }
  for(const e of learning)if(storage.getItem(e.key)!==e.value)
   throw Error('Learner key verification failed.');
  const again=reconcileRecoverySources(
   legacyPackages(entriesIn(storage)),await vault.list(),attemptRows(entriesIn(storage)));
  if(again.attempts!==saved.length)throw Error('Post-Restore attempt/source mismatch.');
  storage.removeItem(RECOVERY_MARKER);markerWritten=false;
  return {restoredKeys:learning.length,attempts:verified.attempts,versions:verified.versions,
   storedContentInIndexedDB:true as const};
 }catch(error){
  let rollbackOkay=true;
  for(const row of [...changed].reverse()){
   try{const prev=previous.get(row.key);if(prev===null||prev===undefined)storage.removeItem(row.key);
    else storage.setItem(row.key,prev)}catch{rollbackOkay=false}
  }
  if(markerWritten&&rollbackOkay&&!oldMarker){
   try{storage.removeItem(RECOVERY_MARKER);markerWritten=false}catch{rollbackOkay=false}
  }
  const quota=error instanceof Error&&
   (error.name==='QuotaExceededError'||error.name==='NS_ERROR_DOM_QUOTA_REACHED');
  throw Error(rollbackOkay&&!oldMarker
   ?quota?'Restore blocked by Safari storage quota. Learner keys were rolled back; keep the verified Recovery file.'
    :'Restore not completed. Previous learner keys were restored; any newly imported immutable content is safe to retain for retry. '+String(error)
   :'Restore was interrupted. Retry with the SAME verified Recovery V2 file; do not clear browser data.');
 }
}
