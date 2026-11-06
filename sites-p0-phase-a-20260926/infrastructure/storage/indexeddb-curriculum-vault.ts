import type {StoredAcademicPackage} from '../../domain/storage-retention';

/**
 * Phase-1 non-destructive prototype: IndexedDB holds immutable curriculum
 * source documents, never learner attempts. It is NOT connected to the live
 * academic repository or V2 Recovery until joint migration/restore gates pass.
 * No deletion/clear method exists on purpose.
 */
const DB_NAME='g-learning-english-curriculum-vault-v1';
const STORE='packages';

function failClosed(message:string){
 return new Error(message+' Original learner storage must remain untouched.');
}
function database(factory:IDBFactory):Promise<IDBDatabase>{
 return new Promise((resolve,reject)=>{
  let opened:IDBOpenDBRequest;
  try{opened=factory.open(DB_NAME,1)}catch{reject(failClosed('IndexedDB is unavailable.'));return;}
  opened.onupgradeneeded=()=>{
   const db=opened.result;
   if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'version'});
  };
  opened.onerror=()=>reject(failClosed('Cannot open the curriculum vault.'));
  opened.onblocked=()=>reject(failClosed('Another browser tab blocked curriculum-vault setup.'));
  opened.onsuccess=()=>resolve(opened.result);
 });
}
function validRecord(value:StoredAcademicPackage){
 return !!value&&typeof value.version==='string'&&value.version.length>0
  &&typeof value.digest==='string'&&value.digest.length>0
  &&typeof value.id==='string'&&Array.isArray(value.source?.lessons)
  &&!!value.source?.course?.id;
}
export class IndexedDBCurriculumVault {
 constructor(private readonly factory:IDBFactory){}

 async list():Promise<StoredAcademicPackage[]>{
  const db=await database(this.factory);
  try{return await new Promise<StoredAcademicPackage[]>((resolve,reject)=>{
   const tx=db.transaction(STORE,'readonly');
   const req=tx.objectStore(STORE).getAll();
   let records:StoredAcademicPackage[]=[];
   req.onsuccess=()=>{records=req.result as StoredAcademicPackage[]};
   req.onerror=()=>reject(failClosed('Cannot read stored curriculum versions.'));
   tx.oncomplete=()=>{
    if(records.some(x=>!validRecord(x)))reject(failClosed('The curriculum vault contains an invalid package.'));
    else resolve(records);
   };
   tx.onabort=()=>reject(failClosed('Curriculum read transaction was aborted.'));
  })}finally{db.close()}
 }

 async putImmutable(value:StoredAcademicPackage):Promise<'added'|'identical'>{
  if(!validRecord(value))throw failClosed('Refusing an invalid curriculum package.');
  const db=await database(this.factory);
  try{return await new Promise<'added'|'identical'>((resolve,reject)=>{
   const tx=db.transaction(STORE,'readwrite');
   const store=tx.objectStore(STORE);
   let result:'added'|'identical'='identical',conflict=false;
   const get=store.get(value.version);
   get.onsuccess=()=>{
    const same=get.result as StoredAcademicPackage|undefined;
    if(same){
     if(!validRecord(same)||same.digest!==value.digest||same.id!==value.id
      ||same.archive!==value.archive
      ||JSON.stringify(same.source)!==JSON.stringify(value.source)){
      conflict=true;
      tx.abort();
     }
     return;
    }
    // A single atomic IDB transaction: no stale same-version overwrites.
    result='added';
    store.add(value);
   };
   tx.oncomplete=()=>resolve(result);
   tx.onerror=()=>reject(failClosed('Cannot commit curriculum into IndexedDB.'));
   tx.onabort=()=>reject(failClosed(conflict
    ?'Immutable curriculum version conflict in IndexedDB.'
    :'Curriculum transaction aborted; no successful write was recorded.'));
  })}finally{db.close()}
 }
}

export function browserCurriculumVault(){
 if(typeof indexedDB==='undefined')throw failClosed('IndexedDB is not supported.');
 return new IndexedDBCurriculumVault(indexedDB);
}
