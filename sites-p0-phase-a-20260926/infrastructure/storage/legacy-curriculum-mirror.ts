import {decodePackageDocument,type StoredAcademicPackage} from '../../domain/storage-retention';
import {reconcileRecoverySources} from '../../domain/recovery-source-union';
import type {BrowserKeyValueStorage} from './browser-local-repositories';
import type {IndexedDBCurriculumVault} from './indexeddb-curriculum-vault';

type EnumerableStorage=BrowserKeyValueStorage&{length:number;key(index:number):string|null};
const PREFIX='g-learning:english:v1';
const PACKAGE_KEY=PREFIX+':academic:packages';

function isEnumerable(value:BrowserKeyValueStorage):value is EnumerableStorage{
 const store=value as Partial<EnumerableStorage>;
 return typeof store.length==='number'&&typeof store.key==='function';
}
/**
 * Read-only preflight. It enumerates ALL owner-scoped attempt keys, so content
 * cannot be moved by assuming one learner/owner is the only source of history.
 */
export function inspectLegacyCurriculumMirror(storage:BrowserKeyValueStorage){
 if(!isEnumerable(storage))
  throw Error('Cannot inventory every local owner. Content mirror blocked.');
 const raw=storage.getItem(PACKAGE_KEY);
 if(!raw)throw Error('No legacy curriculum source available. Mirroring blocked.');
 let rows:StoredAcademicPackage[];
 try{rows=decodePackageDocument(JSON.parse(raw)).records}
 catch{throw Error('Legacy curriculum packages are invalid. Preserve current storage.')}
 if(!rows.length)throw Error('No source versions available for content mirroring.');
 const versions=new Map<string,StoredAcademicPackage>();
 for(const row of rows){
  if(!row||typeof row.version!=='string'||!row.digest||
    !Array.isArray(row.source?.lessons)||versions.has(row.version))
   throw Error('Invalid or duplicated legacy curriculum version; mirroring blocked.');
  versions.set(row.version,row);
 }
 let attempts=0,protectedLessons=new Set<string>();
 for(let i=0;i<storage.length;i++){
  const key=storage.key(i);
  if(!key||!key.startsWith(PREFIX+':owner:')||!key.endsWith(':academic-attempts'))continue;
  let saved:unknown;
  try{saved=JSON.parse(storage.getItem(key)??'[]')}catch{
   throw Error('Unparseable historical attempt source; mirroring blocked.');
  }
  if(!Array.isArray(saved))throw Error('Invalid historical attempts; mirroring blocked.');
  for(const a of saved){
   if(!a||typeof a.version!=='string'||typeof a.lessonId!=='string')
    throw Error('Malformed saved attempt; mirroring blocked.');
   const pkg=versions.get(a.version);
   if(!pkg||!pkg.source.lessons.some(l=>l.id===a.lessonId))
    throw Error('Historical attempt source missing: mirror blocked with learner keys untouched.');
   protectedLessons.add(a.version+'|'+a.lessonId);
   attempts++;
  }
 }
 return {records:rows,attempts,versions:rows.length,
  referencedLessons:protectedLessons.size,legacyPackageChars:raw.length};
}
/**
 * Phase S2 research tool: only ADD immutable content sources to the IndexedDB
 * vault; no writes/removes to localStorage, no learner data movement.
 * A later explicit consent + portable cross-store recovery gate is required
 * before any old curriculum key may be removed.
 */
export async function mirrorLegacyCurriculumToVault(
 storage:BrowserKeyValueStorage,
 vault:Pick<IndexedDBCurriculumVault,'putImmutable'|'list'>
){
 const preview=inspectLegacyCurriculumMirror(storage);
 const added:string[]=[];
 const before=await vault.list();
 for(const row of preview.records){
  const present=before.find(x=>x.version===row.version);
  if(present){
   // A full IDB source may legitimately contain a verified older local
   // referenced-lessons archive. Never overwrite the existing IDB version.
   const combined=reconcileRecoverySources([present],[row],[]).records[0];
   if(combined.source.lessons.some(l=>!present.source.lessons.some(p=>
     p.id===l.id&&JSON.stringify(p)===JSON.stringify(l))))
    throw Error('IndexedDB contains fewer historic lessons than local storage. Migration blocked.');
   continue;
  }
  const action=await vault.putImmutable(row);
  if(action==='added')added.push(row.version);
 }
 const copied=await vault.list();
 for(const row of preview.records){
  const match=copied.find(x=>x.version===row.version);
  if(!match)throw Error('IndexedDB readback missing source. Legacy content remains untouched.');
  const merged=reconcileRecoverySources([match],[row],[]).records[0];
  if(merged.source.lessons.some(l=>!match.source.lessons.some(p=>
    p.id===l.id&&JSON.stringify(p)===JSON.stringify(l))))
   throw Error('IndexedDB readback lacks a referenced lesson. Legacy content remains untouched.');
 }
 return {added,verifiedVersions:preview.versions,
  historicalAttemptsChecked:preview.attempts,
  referencedLessonsChecked:preview.referencedLessons,
  originalLocalStorageUntouched:true as const};
}
