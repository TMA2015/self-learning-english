import {decodePackageDocument} from '../../domain/storage-retention';

const PREFIX='g-learning:english:v1';
export const RECOVERY_MARKER=PREFIX+':recovery-pending-v2';
export const RECOVERY_FILENAME='g-learning-english-recovery-v2.json';
export const RECOVERY_MAX_BYTES=25_000_000;
type Entry={key:string;value:string};
type RecoveryFile={format:'g-learning-english.recovery';schemaVersion:2;exportedAt:string;entries:Entry[];sha256:string};
type Store=Pick<Storage,'getItem'|'setItem'|'removeItem'|'key'|'length'>;
function currentStore():Store{
 if(typeof window==='undefined'||!window.localStorage)throw Error('Browser storage is unavailable.');
 return window.localStorage;
}
function acceptableKey(key:string){
 if(!key.startsWith(PREFIX+':'))return false;
 const suffix=key.slice(PREFIX.length+1);
 return suffix==='academic:packages'
  ||/^owner:[^:]+:(academic-attempts|course-selection|learner:[^:]+:(state|evidence|assessments|snapshots|legacy-imported))$/.test(suffix);
}
function assertNoUnknownEnglishKeys(storage:Store){
 const unexpected:string[]=[];
 for(let i=0;i<storage.length;i++){
  const key=storage.key(i);
  if(key?.startsWith(PREFIX+':')&&key!==RECOVERY_MARKER&&!acceptableKey(key))
   unexpected.push(key);
 }
 if(unexpected.length)
  throw Error('Unrecognized English storage keys detected ('+unexpected.length+'). Complete recovery must not silently omit learning data. Preserve this browser profile and review the storage schema before cleanup.');
}
function entriesIn(storage:Store):Entry[]{
 const rows:Entry[]=[];
 for(let n=0;n<storage.length;n++){
  const key=storage.key(n);
  if(!key||!acceptableKey(key))continue;
  const value=storage.getItem(key);
  if(value!==null)rows.push({key,value});
 }
 return rows.sort((a,b)=>a.key.localeCompare(b.key));
}
async function sha256(input:string){
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(input));
 return Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');
}
function bytes(input:string){return new TextEncoder().encode(input).byteLength}
function assertSourceAvailable(entries:Entry[]){
 const packagesRaw=entries.find(r=>r.key===PREFIX+':academic:packages')?.value;
 if(!packagesRaw)throw Error('Recovery requires original curriculum source; learner-only reference JSON is not sufficient.');
 let packages;
 try{packages=decodePackageDocument(JSON.parse(packagesRaw)).records}
 catch{throw Error('Curriculum source is corrupted or unreadable; cannot make a recoverable backup.')}
 if(!packages.length)throw Error('Recovery is missing a curriculum package.');
 const versions=new Set<string>();
 for(const p of packages){
  if(!p||typeof p.version!=='string'||!Array.isArray(p.source?.lessons)||!p.source.course||!p.digest)
   throw Error('Invalid curriculum source in recovery.');
  if(versions.has(p.version))throw Error('Duplicate curriculum version in recovery.');
  versions.add(p.version);
 }
 let count=0;
 for(const e of entries.filter(x=>x.key.endsWith(':academic-attempts'))){
  let rows:unknown;
  try{rows=JSON.parse(e.value)}catch{throw Error('Invalid academic attempts in recovery.')}
  if(!Array.isArray(rows))throw Error('Invalid academic attempt list in recovery.');
  for(const a of rows){
   if(!a||typeof a!=='object')throw Error('Malformed learner attempt in recovery.');
   const record=a as {version?:string;lessonId?:string};
   const version=packages.find(p=>p.version===record.version);
   if(!version||!version.source.lessons.some(l=>l.id===record.lessonId))
    throw Error('Cannot restore attempt '+String(record.lessonId)+': its original versioned lesson content is missing.');
   count++;
  }
 }
 return {versions:packages.length,attempts:count,latest:packages[packages.length-1]?.version};
}
export async function exportLocalRecoveryV2():Promise<{
 filename:string;text:string;bytes:number;versions:number;attempts:number;
}>{
 const storage=currentStore();
 if(storage.getItem(RECOVERY_MARKER))throw Error('A previous restore was interrupted. Do not export incomplete data.');
 assertNoUnknownEnglishKeys(storage);
 const entries=entriesIn(storage);
 // Do not silently export a torn snapshot if a second browser tab updates
 // learner data while the recovery file is being assembled.
 const again=entriesIn(storage);
 if(JSON.stringify(entries)!==JSON.stringify(again))
  throw Error('Learning data changed during export. Close other learning tabs and export again.');
 const validation=assertSourceAvailable(entries);
 const checksum=await sha256(JSON.stringify(entries));
 assertNoUnknownEnglishKeys(storage);
 if(JSON.stringify(entriesIn(storage))!==JSON.stringify(entries))
  throw Error('Learning data changed during export. Close other learning tabs and export again.');
 const file:RecoveryFile={format:'g-learning-english.recovery',schemaVersion:2,
  exportedAt:new Date().toISOString(),entries,sha256:checksum};
 const text=JSON.stringify(file,null,2)+'\n';
 if(bytes(text)>RECOVERY_MAX_BYTES)throw Error('Complete recovery file exceeds the 25 MB safety limit.');
 return {filename:RECOVERY_FILENAME,text,bytes:bytes(text),versions:validation.versions,attempts:validation.attempts};
}
async function parseRecovery(text:string){
 if(typeof text!=='string'||bytes(text)>RECOVERY_MAX_BYTES)throw Error('Invalid or oversized recovery file (25 MB maximum).');
 let file:RecoveryFile;
 try{file=JSON.parse(text) as RecoveryFile}catch{throw Error('Recovery file is not valid JSON.')}
 // The uploaded file may be an academic curriculum package, not a learner
 // recovery archive. Detect it using this *already parsed* JSON (never parse
 // the entire multi-megabyte file twice in a browser).
 const maybeCurriculum=file as unknown as {schema_version?:unknown;lessons?:unknown};
 if(typeof maybeCurriculum?.schema_version==='string'&&Array.isArray(maybeCurriculum.lessons))
   throw Error('Unsupported recovery file. This is a curriculum package, not a learner V2 Recovery backup. Published lessons update automatically when browser storage has space; do not use Restore.');
 if(file?.format!=='g-learning-english.recovery'||file.schemaVersion!==2||!Array.isArray(file.entries)
    ||typeof file.sha256!=='string'||typeof file.exportedAt!=='string')
   throw Error('Unsupported recovery file. The old learner-only JSON is for reference, not complete recovery.');
 const keys=new Set<string>();
 for(const row of file.entries){
  if(!row||typeof row.key!=='string'||typeof row.value!=='string'
    ||!acceptableKey(row.key)||keys.has(row.key))throw Error('Unsafe or duplicated storage key in recovery file.');
  keys.add(row.key);
 }
 const expected=await sha256(JSON.stringify(file.entries));
 if(file.sha256!==expected)throw Error('Recovery checksum mismatch; file was modified or damaged.');
 const scope=assertSourceAvailable(file.entries);
 return {file,scope};
}
function occupied(store:Store):string[]{
 return entriesIn(store).filter(e=>{
  if(e.key===PREFIX+':academic:packages')return false;
  if(e.key.endsWith(':legacy-imported'))return false;
  return e.value!=='[]'&&e.value!=='{}'&&e.value!==''&&e.value!=='null';
 }).map(e=>e.key);
}
export async function verifyLocalRecoveryV2(text:string):Promise<{
 sha256:string;attempts:number;versions:number;exportedAt:string
}>{
 const {file,scope}=await parseRecovery(text);
 return {sha256:file.sha256,attempts:scope.attempts,versions:scope.versions,exportedAt:file.exportedAt};
}
export async function previewLocalRecoveryV2(text:string):Promise<{
 valid:boolean;errors:string[];token:string;attempts:number;versions:number;exportedAt:string;
}>{
 const store=currentStore();
 const {file,scope}=await parseRecovery(text);
 const errors:string[]=[];
 assertNoUnknownEnglishKeys(store);
 const interrupted=store.getItem(RECOVERY_MARKER);
 if(interrupted&&interrupted!==file.sha256)
  errors.push('An interrupted recovery requires its original V2 file. Do not clear this browser.');
 if(!interrupted&&occupied(store).length)
  errors.push('This browser already contains learner data. Recovery is allowed only into an empty learner profile, to prevent overwriting real progress.');
 const token=errors.length?'':await sha256(JSON.stringify({checksum:file.sha256,current:entriesIn(store),interrupted}));
 return {valid:errors.length===0,errors,token,
  attempts:scope.attempts,versions:scope.versions,exportedAt:file.exportedAt};
}
export async function restoreLocalRecoveryV2(text:string,token:string,confirmed:boolean):Promise<{
 restoredKeys:number;attempts:number;versions:number
}>{
 if(!confirmed||!token)throw Error('Recovery requires an explicit confirmation and validated preview.');
 const preview=await previewLocalRecoveryV2(text);
 if(!preview.valid||token!==preview.token)throw Error('Recovery source or target changed. Preview again before restoring.');
 const {file,scope}=await parseRecovery(text);
 const store=currentStore();
 const initialMarker=store.getItem(RECOVERY_MARKER);
 const previous=new Map<string,string|null>();
 for(const e of file.entries)previous.set(e.key,store.getItem(e.key));
 let markerWritten=false;
 const changed:Entry[]=[];
 try{
  store.setItem(RECOVERY_MARKER,file.sha256);markerWritten=true;
  for(const e of file.entries){
   if(store.getItem(e.key)===e.value)continue;
   store.setItem(e.key,e.value);
   changed.push(e);
  }
  for(const e of file.entries)if(store.getItem(e.key)!==e.value)
   throw Error('Recovery verification mismatch.');
  store.removeItem(RECOVERY_MARKER);markerWritten=false;
  return {restoredKeys:file.entries.length,attempts:scope.attempts,versions:scope.versions};
 }catch(error){
  // Roll back changed keys in reverse order. If recovery itself cannot roll
  // back (e.g. browser fault/quota), leave the marker to block false success.
  let rollbackOkay=true;
  for(const e of [...changed].reverse()){
   try{const prior=previous.get(e.key);if(prior===null)store.removeItem(e.key);
    else if(prior!==undefined)store.setItem(e.key,prior)}
   catch{rollbackOkay=false}
  }
  if(markerWritten&&rollbackOkay&&!initialMarker){
   try{store.removeItem(RECOVERY_MARKER);markerWritten=false}catch{rollbackOkay=false}
  }
  throw Error(rollbackOkay&&!initialMarker
   ?'Recovery failed; earlier browser content was restored.'
   :'Recovery remains interrupted. Retry using the same verified V2 file; do not clear this browser profile.');
 }
}
