import {
 canonicalLessonJSON,
 type LessonRevisionPlan,type RevisionBlob,type RevisionAlias,type ActiveLessonManifest
} from '../../domain/lesson-revision-plan';

/**
 * R2 ISOLATED, NON-PRODUCTION browser proof. This never accesses localStorage,
 * learner attempts, active SLE catalog or deployed recovery. No delete/clear API.
 * Stores UNIQUE immutable lesson+rubric snapshots rather than curriculum copies.
 */
const DB_NAME='g-learning-english-lesson-revisions-r2';
const STORE_BLOBS='revision-blobs';
const STORE_ALIASES='historic-aliases';
const STORE_MANIFEST='active-manifest';
const MANIFEST_KEY='current';

type ManifestRow={key:'current';value:ActiveLessonManifest};
type AliasRow=RevisionAlias&{key:string};
type Snapshot={active:ActiveLessonManifest|null;blobs:RevisionBlob[];aliases:RevisionAlias[]};

function abortError(message:string){return Error(message+' No learner storage was modified.');}
function aliasKey(version:string,lessonId:string){return JSON.stringify([version,lessonId]);}
function equal(a:unknown,b:unknown){return canonicalLessonJSON(a)===canonicalLessonJSON(b);}
async function hash(value:string):Promise<string>{
 if(typeof crypto==='undefined'||!crypto.subtle)throw abortError('SHA-256 unavailable.');
 const result=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
 return Array.from(new Uint8Array(result),x=>x.toString(16).padStart(2,'0')).join('');
}
async function verifyBlob(b:RevisionBlob){
 if(!b||typeof b.revision!=='string'||!/^[a-f0-9]{64}$/.test(b.revision)||
  !b.lesson||typeof b.lesson.id!=='string'||!b.lesson.id||
  !Array.isArray(b.lesson.activities)||!b.rubrics||typeof b.rubrics!=='object')
  throw abortError('Invalid revision blob.');
 const actual=await hash(canonicalLessonJSON({lesson:b.lesson,rubrics:b.rubrics}));
 if(actual!==b.revision)throw abortError('Revision source hash mismatch.');
}
function versionParts(v:string){
 if(!/^\d+\.\d+\.\d+$/.test(v))throw abortError('Invalid release version.');
 return v.split('.').map(Number);
}
function compare(a:string,b:string){
 const left=versionParts(a),right=versionParts(b);
 for(let i=0;i<3;i++)if(left[i]!==right[i])return left[i]-right[i];
 return 0;
}
function verifyPlanShape(p:LessonRevisionPlan){
 if(!p||!p.active||!p.active.version||!p.active.packageId||!p.active.releaseDigest||
  !Array.isArray(p.active.lessons)||!p.active.lessons.length||
  !Array.isArray(p.blobs)||!p.blobs.length||!Array.isArray(p.aliases))
  throw abortError('Invalid normalized source plan.');
 versionParts(p.active.version);
 const blobs=new Map<string,RevisionBlob>();
 for(const blob of p.blobs){
  if(blobs.has(blob.revision))throw abortError('Duplicate revision blob.');
  blobs.set(blob.revision,blob);
 }
 const seenCurrent=new Set<string>();
 for(const entry of p.active.lessons){
  if(!entry||typeof entry.lessonId!=='string'||seenCurrent.has(entry.lessonId)||
   !blobs.has(entry.revision)||blobs.get(entry.revision)?.lesson.id!==entry.lessonId)
   throw abortError('Active lesson revision missing or conflicting.');
  seenCurrent.add(entry.lessonId);
 }
 const seenAlias=new Set<string>();
 for(const a of p.aliases){
  if(!a||typeof a.version!=='string'||typeof a.lessonId!=='string'||
   !a.packageId||!a.releaseDigest||seenAlias.has(aliasKey(a.version,a.lessonId))||
   !blobs.has(a.revision)||blobs.get(a.revision)?.lesson.id!==a.lessonId)
   throw abortError('Historical versioned lesson revision missing or conflicting.');
  versionParts(a.version);seenAlias.add(aliasKey(a.version,a.lessonId));
 }
 return {blobs,seenCurrent,seenAlias};
}
function openDatabase(factory:IDBFactory):Promise<IDBDatabase>{
 return new Promise((resolve,reject)=>{
  let request:IDBOpenDBRequest;
  try{request=factory.open(DB_NAME,1)}catch{reject(abortError('IndexedDB is unavailable.'));return}
  request.onupgradeneeded=()=>{
   const db=request.result;
   if(!db.objectStoreNames.contains(STORE_BLOBS))db.createObjectStore(STORE_BLOBS,{keyPath:'revision'});
   if(!db.objectStoreNames.contains(STORE_ALIASES))db.createObjectStore(STORE_ALIASES,{keyPath:'key'});
   if(!db.objectStoreNames.contains(STORE_MANIFEST))db.createObjectStore(STORE_MANIFEST,{keyPath:'key'});
  };
  request.onerror=()=>reject(abortError('Cannot open lesson revision database.'));
  request.onblocked=()=>reject(abortError('Another tab blocked the revision database.'));
  request.onsuccess=()=>{
   const db=request.result;
   db.onversionchange=()=>db.close();
   resolve(db);
  };
 });
}
export class BrowserLessonRevisionVault {
 constructor(private readonly factory:IDBFactory){}

 /**
  * Hash preflight happens BEFORE opening a write transaction.
  * IndexedDB serializes all writes across all stores in a single transaction.
  * Same-version mutation, historical alias changes and revision collisions
  * abort the entire transaction; never rewrite original learner attempts.
  */
 async install(plan:LessonRevisionPlan):Promise<{addedRevisions:number;addedAliases:number;activeVersion:string}>{
  verifyPlanShape(plan);
  for(const blob of plan.blobs)await verifyBlob(blob);
  const db=await openDatabase(this.factory);
  try{
   return await new Promise((resolve,reject)=>{
    const tx=db.transaction([STORE_BLOBS,STORE_ALIASES,STORE_MANIFEST],'readwrite');
    const blobs=tx.objectStore(STORE_BLOBS);
    const aliases=tx.objectStore(STORE_ALIASES);
    const active=tx.objectStore(STORE_MANIFEST);
    let revisionCount=0,aliasCount=0,conflict='';
    function fail(message:string){if(!conflict){conflict=message;try{tx.abort()}catch{}}}
    for(const row of plan.blobs){
     const req=blobs.get(row.revision);
     req.onsuccess=()=>{
      if(req.result!==undefined){
       if(!equal(req.result,row))fail('Immutable lesson revision collision.');
      }else{blobs.add(row);revisionCount++}
     };
    }
    for(const original of plan.aliases){
     const row:AliasRow={...original,key:aliasKey(original.version,original.lessonId)};
     const req=aliases.get(row.key);
     req.onsuccess=()=>{
      if(req.result!==undefined){
       if(!equal(req.result,row))fail('Historic version/lesson alias conflict.');
      }else{aliases.add(row);aliasCount++}
     };
    }
    const req=active.get(MANIFEST_KEY);
    req.onsuccess=()=>{
     const existing=req.result as ManifestRow|undefined;
     if(existing){
      if(compare(existing.value.version,plan.active.version)>0){
       fail('An older curriculum may not replace the active manifest.');return;
      }
      if(existing.value.version===plan.active.version&&!equal(existing.value,plan.active)){
       fail('Immutable same-version manifest conflict.');return;
      }
     }
     if(!existing||existing.value.version!==plan.active.version)
      active.put({key:MANIFEST_KEY,value:plan.active} as ManifestRow);
    };
    tx.oncomplete=()=>resolve({addedRevisions:revisionCount,
     addedAliases:aliasCount,activeVersion:plan.active.version});
    tx.onabort=()=>reject(abortError(conflict||'Revision transaction was rolled back.'));
    tx.onerror=()=>reject(abortError('Cannot commit lesson revision transaction.'));
   });
  }finally{db.close()}
 }


 /**
  * Call BEFORE an eventual learner attempt is written. First commit its
  * immutable source alias; if the later learner write fails, an orphan alias
  * is harmless. Cross-store atomicity must never be assumed.
  * R2 tests this function but the LIVE academic service does not call it.
  */
 async pinCurrentForAttempt(version:string,lessonId:string):Promise<void>{
  versionParts(version);
  if(typeof lessonId!=='string'||!lessonId)throw abortError('Lesson ID missing.');
  const db=await openDatabase(this.factory);
  try{
   await new Promise<void>((resolve,reject)=>{
    const tx=db.transaction([STORE_BLOBS,STORE_ALIASES,STORE_MANIFEST],'readwrite');
    const aliases=tx.objectStore(STORE_ALIASES);
    const blobs=tx.objectStore(STORE_BLOBS);
    const current=tx.objectStore(STORE_MANIFEST).get(MANIFEST_KEY);
    let conflict='';
    function fail(message:string){if(!conflict){conflict=message;try{tx.abort()}catch{}}}
    current.onsuccess=()=>{
     const active=(current.result as ManifestRow|undefined)?.value;
     if(!active||active.version!==version){
      fail('Cannot pin an attempt against a non-current curriculum.');return;
     }
     const target=active.lessons.find(x=>x.lessonId===lessonId);
     if(!target){fail('Cannot pin a missing current lesson.');return}
     const b=blobs.get(target.revision);
     b.onsuccess=()=>{
      if(!b.result||(b.result as RevisionBlob).lesson.id!==lessonId){
       fail('Cannot pin a missing original source.');return;
      }
      const record:AliasRow={key:aliasKey(version,lessonId),
       version,lessonId,revision:target.revision,
       packageId:active.packageId,releaseDigest:active.releaseDigest};
      const existing=aliases.get(record.key);
      existing.onsuccess=()=>{
       if(existing.result!==undefined){
        if(!equal(existing.result,record))fail('Immutable attempted source alias conflict.');
       }else aliases.add(record);
      };
     };
    };
    tx.oncomplete=()=>resolve();
    tx.onabort=()=>reject(abortError(conflict||'Attempt source pin transaction aborted.'));
    tx.onerror=()=>reject(abortError('Could not pin the attempt source.'));
   });
  }finally{db.close()}
 }

 async manifest():Promise<ActiveLessonManifest|null>{
  const db=await openDatabase(this.factory);
  try{return await new Promise((resolve,reject)=>{
   const tx=db.transaction(STORE_MANIFEST,'readonly');
   const req=tx.objectStore(STORE_MANIFEST).get(MANIFEST_KEY);
   let record:ManifestRow|undefined;
   req.onsuccess=()=>{record=req.result as ManifestRow|undefined};
   tx.oncomplete=()=>resolve(record?.value??null);
   tx.onabort=()=>reject(abortError('Cannot read current lesson manifest.'));
  })}finally{db.close()}
 }

 /**
  * Targeted immutable provenance lookup used by R5a's historical grading
  * resolver. A missing alias is not permission to fall back to latest.
  */
 async historicAlias(version:string,lessonId:string):Promise<RevisionAlias|null>{
  versionParts(version);
  if(typeof lessonId!=='string'||!lessonId)throw abortError('Lesson ID missing.');
  const db=await openDatabase(this.factory);
  try{return await new Promise<RevisionAlias|null>((resolve,reject)=>{
   const tx=db.transaction(STORE_ALIASES,'readonly');
   const request=tx.objectStore(STORE_ALIASES).get(aliasKey(version,lessonId));
   let result:AliasRow|undefined;
   request.onsuccess=()=>{result=request.result as AliasRow|undefined};
   tx.oncomplete=()=>{
    if(!result){resolve(null);return}
    if(result.version!==version||result.lessonId!==lessonId||
     !result.packageId||!result.releaseDigest)
     reject(abortError('Historical alias has mismatched provenance.'));
    else{
     const {key:_key,...alias}=result;
     resolve(alias);
    }
   };
   tx.onabort=()=>reject(abortError('Historical alias read was aborted.'));
  })}finally{db.close()}
 }

 private async resolve(lessonId:string,version?:string):Promise<RevisionBlob>{
  if(!lessonId||typeof lessonId!=='string')throw abortError('Lesson ID missing.');
  if(version!==undefined)versionParts(version);
  const db=await openDatabase(this.factory);
  let selected:RevisionBlob|undefined;
  try{
   await new Promise<void>((resolve,reject)=>{
    const tx=db.transaction([STORE_BLOBS,STORE_ALIASES,STORE_MANIFEST],'readonly');
    const blobs=tx.objectStore(STORE_BLOBS);
    const source=version===undefined?
     tx.objectStore(STORE_MANIFEST).get(MANIFEST_KEY):
     tx.objectStore(STORE_ALIASES).get(aliasKey(version,lessonId));
    let found=false;
    source.onsuccess=()=>{
     const digest=version===undefined?
      (source.result as ManifestRow|undefined)?.value?.lessons.find(x=>x.lessonId===lessonId)?.revision:
      (source.result as AliasRow|undefined)?.revision;
     if(!digest)return;
     const item=blobs.get(digest);
     item.onsuccess=()=>{
      selected=item.result as RevisionBlob|undefined;
      found=!!selected&&selected.revision===digest&&selected.lesson.id===lessonId;
     };
    };
    tx.oncomplete=()=>{
     if(!found)reject(abortError('Required original lesson revision is missing.'));
     else resolve();
    };
    tx.onabort=()=>reject(abortError('Lesson revision read transaction aborted.'));
   });
  }finally{db.close()}
  await verifyBlob(selected!);
  return selected!;
 }
 /**
  * R4q NON-PRODUCTION single-Unit loader. Reads only requested immutable
  * Lesson bodies in one native IDB read transaction, not getAll().
  * The lightweight manifest is read to map IDs -> immutable revisions.
  * Does not touch learner writes, V2 Recovery or the live Site catalog.
  */
 async resolveCurrentBatch(lessonIds:readonly string[]):Promise<RevisionBlob[]>{
  if(!Array.isArray(lessonIds)||lessonIds.length===0||lessonIds.length>100||
   lessonIds.some(id=>typeof id!=='string'||!id)||
   new Set(lessonIds).size!==lessonIds.length)
   throw abortError('Invalid or duplicate single-Unit Lesson IDs.');
  const db=await openDatabase(this.factory);
  const selected:Array<RevisionBlob|undefined>=new Array(lessonIds.length);
  try{
   await new Promise<void>((resolve,reject)=>{
    const tx=db.transaction([STORE_MANIFEST,STORE_BLOBS],'readonly');
    const source=tx.objectStore(STORE_MANIFEST).get(MANIFEST_KEY);
    const bodies=tx.objectStore(STORE_BLOBS);
    let failure='';
    const fail=(message:string)=>{
     if(!failure){
      failure=message;
      try{tx.abort()}catch{}
     }
    };
    source.onsuccess=()=>{
     const manifest=(source.result as ManifestRow|undefined)?.value;
     if(!manifest){fail('No active Lesson manifest.');return}
     const revisionById=new Map(manifest.lessons.map(item=>[
      item.lessonId,item.revision
     ]));
     for(let i=0;i<lessonIds.length;i++){
      const id=lessonIds[i],revision=revisionById.get(id);
      if(!revision){fail('Requested current Lesson revision missing.');return}
      const request=bodies.get(revision);
      request.onsuccess=()=>{
       const blob=request.result as RevisionBlob|undefined;
       if(!blob||blob.revision!==revision||blob.lesson.id!==id){
        fail('Requested immutable Lesson body missing or mismatched.');
        return;
       }
       selected[i]=blob;
      };
     }
    };
    source.onerror=()=>fail('Cannot read active Lesson manifest.');
    tx.onabort=()=>reject(abortError(failure||
     'Targeted Lesson batch transaction aborted.'));
    tx.onerror=()=>reject(abortError(failure||
     'Targeted Lesson batch transaction failed.'));
    tx.oncomplete=()=>{
     if(selected.some(row=>!row))reject(abortError(
      'A requested Lesson body was not read; no partial Unit returned.'));
     else resolve();
    };
   });
  }finally{db.close()}
  const result=selected as RevisionBlob[];
  for(const blob of result)await verifyBlob(blob);
  return result;
 }
 async resolveCurrent(lessonId:string){return this.resolve(lessonId)}
 async resolveHistoric(version:string,lessonId:string){return this.resolve(lessonId,version)}

 /**
  * Export/read-only inventory basis for future Recovery V3, NOT a Recovery
  * file. A future exporter must add learner records, atomic consistency,
  * media, signatures/checksum and empty-profile restore before any cleanup.
  */
 async snapshot():Promise<Snapshot>{
  const db=await openDatabase(this.factory);
  let snapshot:Snapshot={active:null,blobs:[],aliases:[]};
  try{
   snapshot=await new Promise((resolve,reject)=>{
    const tx=db.transaction([STORE_BLOBS,STORE_ALIASES,STORE_MANIFEST],'readonly');
    const bs=tx.objectStore(STORE_BLOBS).getAll();
    const as=tx.objectStore(STORE_ALIASES).getAll();
    const ms=tx.objectStore(STORE_MANIFEST).get(MANIFEST_KEY);
    let blobs:RevisionBlob[]=[],aliases:AliasRow[]=[],active:ActiveLessonManifest|null=null;
    bs.onsuccess=()=>{blobs=bs.result as RevisionBlob[]};
    as.onsuccess=()=>{aliases=as.result as AliasRow[]};
    ms.onsuccess=()=>{active=(ms.result as ManifestRow|undefined)?.value??null};
    tx.oncomplete=()=>resolve({active,blobs,aliases:aliases.map(({key:_key,...rest})=>rest)});
    tx.onabort=()=>reject(abortError('Cannot inventory lesson revisions.'));
   });
  }finally{db.close()}
  const byHash=new Map(snapshot.blobs.map(x=>[x.revision,x]));
  if(byHash.size!==snapshot.blobs.length)throw abortError('Duplicate stored hash.');
  for(const b of snapshot.blobs)await verifyBlob(b);
  for(const x of snapshot.active?.lessons??[]){
   if(byHash.get(x.revision)?.lesson.id!==x.lessonId)
    throw abortError('Active manifest has a missing revision.');
  }
  const aliasKeys=new Set<string>();
  for(const a of snapshot.aliases){
   const key=aliasKey(a.version,a.lessonId);
   if(aliasKeys.has(key)||byHash.get(a.revision)?.lesson.id!==a.lessonId)
    throw abortError('Historical alias has a missing revision.');
   aliasKeys.add(key);
  }
  return snapshot;
 }
}
export function browserLessonRevisionVault(){
 if(typeof indexedDB==='undefined')throw abortError('IndexedDB is unavailable.');
 return new BrowserLessonRevisionVault(indexedDB);
}
