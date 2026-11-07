import {mapSeed,type AcademicAttempt,type AcademicPackage,type AcademicRepository} from '../../domain/academic';
import {reconcileRecoverySources} from '../../domain/recovery-source-union';
import {stripBundle,type StoredAcademicPackage} from '../../domain/storage-retention';
import {BrowserLocalAcademicRepository,type BrowserKeyValueStorage} from './browser-local-repositories';
import type {IndexedDBCurriculumVault} from './indexeddb-curriculum-vault';

/**
 * Prototype read-through adapter, NOT yet wired to live runtime.
 *
 * - Earlier localStorage packages continue to be read unchanged.
 * - Newly approved immutable curriculum packages go ONLY into IndexedDB.
 * - Learner attempts remain in their original owner-scoped localStorage keys.
 * - A conflict or unreadable IDB is an error, not an excuse to lose history.
 *
 * This adapter cannot go live until hybrid Recovery export/restore and Safari
 * browser gates pass. It provides no deletion operation.
 */
export class HybridBrowserAcademicRepository implements AcademicRepository {
 private readonly legacy:BrowserLocalAcademicRepository;
 constructor(
  storage:BrowserKeyValueStorage,
  private readonly vault:Pick<IndexedDBCurriculumVault,'list'|'putImmutable'>,
 ){
  this.legacy=new BrowserLocalAcademicRepository(storage);
 }
 async packages():Promise<AcademicPackage[]>{
  const local=await this.legacy.packages();
  const vault=await this.vault.list();
  // A clean browser must bootstrap the first bundled curriculum into IDB.
  // The source-union validator is intentionally strict for nonempty backups,
  // but the repository's package listing may legitimately start empty.
  if(!local.length&&!vault.length)return [];
  const union=reconcileRecoverySources(
   local.map(stripBundle),vault,[]).records;
  return union.map((row:StoredAcademicPackage)=>{
   const bundle=local.find(x=>x.version===row.version&&
    JSON.stringify(x.source)===JSON.stringify(row.source))?.bundle;
   return {...row,bundle:bundle??mapSeed(row.source)};
  });
 }
 async addPackage(value:AcademicPackage):Promise<void>{
  const known=(await this.packages()).find(row=>row.version===value.version);
  if(known){
   if(known.digest!==value.digest||known.id!==value.id||
    JSON.stringify(known.source)!==JSON.stringify(value.source))
    throw Error('Immutable curriculum conflict: same version is not the same original source.');
   // An existing original package remains accessible; no duplicate localStorage
   // or IDB write is required on every page refresh.
   return;
  }
  await this.vault.putImmutable(stripBundle(value));
 }
 attempts(owner:string){return this.legacy.attempts(owner)}
 start(owner:string,value:AcademicAttempt){return this.legacy.start(owner,value)}
 saveDraft(owner:string,id:string,patch:Partial<AcademicAttempt>){return this.legacy.saveDraft(owner,id,patch)}
 finish(owner:string,value:AcademicAttempt){return this.legacy.finish(owner,value)}
 approve(owner:string,value:AcademicAttempt){return this.legacy.approve(owner,value)}
}
