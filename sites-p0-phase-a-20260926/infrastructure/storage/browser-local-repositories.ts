import type {AcademicAttempt,AcademicPackage,AcademicRepository} from '../../domain/academic';
import type {LearningRepository,LearnerState,Scope,Snapshot} from '../../domain/repository';
import type {DiagnosticV2,Evidence} from '../../domain/learning-model';
import {emptySelection,WRITING_COURSE_ID,type CourseSelection} from '../../domain/course-p1';

/**
 * Minimal Web Storage contract so the adapter can be tested without a browser.
 * Production static mode should pass window.localStorage.
 */
export interface BrowserKeyValueStorage {
  getItem(key:string):string|null;
  setItem(key:string,value:string):void;
  removeItem(key:string):void;
}

const DEFAULT_PREFIX='g-learning:english:v1';

function clone<T>(value:T):T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function readJSON<T>(storage:BrowserKeyValueStorage,key:string,fallback:T):T {
  const raw=storage.getItem(key);
  if(raw===null)return clone(fallback);
  try{return JSON.parse(raw) as T}
  catch{throw new Error('Local learning data is corrupted. Restore a known-good backup instead of overwriting it.')}
}

function writeJSON(storage:BrowserKeyValueStorage,key:string,value:unknown){
  storage.setItem(key,JSON.stringify(value));
}

function scopeKey(prefix:string,scope:Scope,bucket:string){
  return `${prefix}:owner:${encodeURIComponent(scope.ownerId)}:learner:${encodeURIComponent(scope.learnerId)}:${bucket}`;
}

function ownerKey(prefix:string,owner:string,bucket:string){
  return `${prefix}:owner:${encodeURIComponent(owner)}:${bucket}`;
}

/**
 * Phase G1 browser persistence for the existing LearningRepository contract.
 *
 * Semantics intentionally mirror D1 where practical:
 * - evidence / assessment / snapshot IDs are first-write-wins;
 * - account + learner namespaces are isolated;
 * - learner state preserves unknown legacy fields.
 *
 * This is local-device persistence, NOT cloud sync.
 */
export class BrowserLocalLearningRepository implements LearningRepository {
  constructor(
    private readonly storage:BrowserKeyValueStorage,
    private readonly prefix=DEFAULT_PREFIX,
  ){}

  async readState(scope:Scope):Promise<LearnerState|null>{
    const key=scopeKey(this.prefix,scope,'state');
    const raw=this.storage.getItem(key);
    return raw===null?null:readJSON<LearnerState>(this.storage,key,{});
  }

  async writeState(scope:Scope,state:LearnerState):Promise<void>{
    writeJSON(this.storage,scopeKey(this.prefix,scope,'state'),state);
  }

  async appendEvidence(scope:Scope,events:Evidence[]):Promise<void>{
    const key=scopeKey(this.prefix,scope,'evidence');
    const rows=readJSON<Evidence[]>(this.storage,key,[]);
    const seen=new Set(rows.map(row=>row.id));
    for(const event of events){
      if(!seen.has(event.id)){rows.push(clone(event));seen.add(event.id)}
    }
    rows.sort((a,b)=>a.at-b.at||a.id.localeCompare(b.id));
    writeJSON(this.storage,key,rows);
  }

  async readEvidence(scope:Scope):Promise<Evidence[]>{
    return readJSON<Evidence[]>(this.storage,scopeKey(this.prefix,scope,'evidence'),[]);
  }

  async readAssessments(scope:Scope):Promise<DiagnosticV2[]>{
    const rows=readJSON<DiagnosticV2[]>(this.storage,scopeKey(this.prefix,scope,'assessments'),[]);
    return rows.sort((a,b)=>(b.finishedAt??b.startedAt)-(a.finishedAt??a.startedAt));
  }

  async appendAssessment(scope:Scope,session:DiagnosticV2):Promise<void>{
    const key=scopeKey(this.prefix,scope,'assessments');
    const rows=readJSON<DiagnosticV2[]>(this.storage,key,[]);
    const id=session.sessionId??String(session.startedAt);
    if(!rows.some(row=>(row.sessionId??String(row.startedAt))===id))rows.push(clone(session));
    writeJSON(this.storage,key,rows);
  }

  async legacyImported(scope:Scope):Promise<boolean>{
    return this.storage.getItem(scopeKey(this.prefix,scope,'legacy-imported'))==='1';
  }

  async markLegacyImported(scope:Scope):Promise<void>{
    this.storage.setItem(scopeKey(this.prefix,scope,'legacy-imported'),'1');
  }

  async appendSnapshot(scope:Scope,id:string,snapshot:Snapshot):Promise<void>{
    const key=scopeKey(this.prefix,scope,'snapshots');
    const rows=readJSON<{id:string;snapshot:Snapshot}[]>(this.storage,key,[]);
    if(!rows.some(row=>row.id===id))rows.push({id,snapshot:clone(snapshot)});
    writeJSON(this.storage,key,rows);
  }

  async readSnapshots(scope:Scope):Promise<Snapshot[]>{
    const rows=readJSON<{id:string;snapshot:Snapshot}[]>(this.storage,scopeKey(this.prefix,scope,'snapshots'),[]);
    return rows
      .sort((a,b)=>b.snapshot.at-a.snapshot.at||a.id.localeCompare(b.id))
      .map(row=>row.snapshot);
  }
}

/**
 * Phase G1 browser persistence for deterministic curriculum attempts.
 *
 * Curriculum packages are shared inside the browser profile; attempts are owner + learner scoped.
 * Large learner recordings are deliberately rejected in this localStorage adapter.
 * Speaking/audio blobs belong in the Phase G2 IndexedDB adapter.
 */
export class BrowserLocalAcademicRepository implements AcademicRepository {
  constructor(
    private readonly storage:BrowserKeyValueStorage,
    private readonly prefix=DEFAULT_PREFIX,
  ){}

  private packagesKey(){return `${this.prefix}:academic:packages`}
  private attemptsKey(scope:Scope){return scopeKey(this.prefix,scope,'academic-attempts')}

  async packages():Promise<AcademicPackage[]>{
    return readJSON<AcademicPackage[]>(this.storage,this.packagesKey(),[]);
  }

  async addPackage(value:AcademicPackage):Promise<void>{
    const rows=await this.packages();
    const same=rows.find(row=>row.version===value.version);
    if(same){
      if(same.digest!==value.digest)throw new Error('Immutable curriculum version conflict in local storage.');
      return;
    }
    rows.push(clone(value));
    writeJSON(this.storage,this.packagesKey(),rows);
  }

  async attempts(scope:Scope):Promise<AcademicAttempt[]>{
    return readJSON<AcademicAttempt[]>(this.storage,this.attemptsKey(scope),[]);
  }

  async start(scope:Scope,value:AcademicAttempt):Promise<void>{
    this.assertNoRecording(value);
    const rows=await this.attempts(scope);
    const same=rows.find(row=>row.id===value.id);
    if(same){
      if(same.lessonId!==value.lessonId||same.version!==value.version||same.parentId!==value.parentId)
        throw new Error('Attempt ID conflict in local storage.');
      return;
    }
    rows.push(clone(value));
    writeJSON(this.storage,this.attemptsKey(scope),rows);
  }

  async saveDraft(scope:Scope,id:string,patch:Partial<AcademicAttempt>):Promise<void>{
    this.assertNoRecording(patch);
    const rows=await this.attempts(scope);
    const index=rows.findIndex(row=>row.id===id);
    if(index<0)throw new Error('Attempt not found in local storage.');
    rows[index]={...rows[index],...clone(patch)};
    writeJSON(this.storage,this.attemptsKey(scope),rows);
  }

  async finish(scope:Scope,value:AcademicAttempt):Promise<AcademicAttempt>{
    return this.replace(scope,value);
  }

  async approve(scope:Scope,value:AcademicAttempt):Promise<AcademicAttempt>{
    return this.replace(scope,value);
  }

  private async replace(scope:Scope,value:AcademicAttempt):Promise<AcademicAttempt>{
    this.assertNoRecording(value);
    const rows=await this.attempts(scope);
    const index=rows.findIndex(row=>row.id===value.id);
    if(index<0)throw new Error('Attempt not found in local storage.');
    rows[index]=clone(value);
    writeJSON(this.storage,this.attemptsKey(scope),rows);
    return clone(value);
  }

  private assertNoRecording(value:Partial<AcademicAttempt>){
    if(value.audio?.data)throw new Error('Phase G1 localStorage does not store learner recordings. Use IndexedDB in static mode for audio.');
  }
}

export class BrowserCourseSelectionConflict extends Error{
  constructor(public current:CourseSelection){super('Course selection changed. Reload and try again.')}
}

export class BrowserLocalCourseSelectionRepository{
  constructor(
    private readonly storage:BrowserKeyValueStorage,
    private readonly prefix=DEFAULT_PREFIX,
  ){}

  private key(scope:Scope){return scopeKey(this.prefix,scope,'course-selection')}

  private decode(raw:string|null):CourseSelection{
    if(raw===null)return emptySelection();
    let value:CourseSelection;
    try{value=JSON.parse(raw) as CourseSelection}
    catch{throw new Error('Local course selection is corrupted. Restore a known-good backup.')}
    if(
      value.courseV1!==1||
      !Number.isSafeInteger(value.revision)||value.revision<1||
      ![null,WRITING_COURSE_ID].includes(value.activeCourseId)||
      typeof value.lastRequestId!=='string'
    )throw new Error('Invalid local course selection.');
    return value;
  }

  async read(scope:Scope):Promise<CourseSelection>{
    return this.decode(this.storage.getItem(this.key(scope)));
  }

  async select(scope:Scope,activeCourseId:string|null,expectedRevision:number,requestId:string):Promise<CourseSelection>{
    if(activeCourseId!==null&&activeCourseId!==WRITING_COURSE_ID)throw new Error('Course is unavailable');
    if(!Number.isSafeInteger(expectedRevision)||expectedRevision<0||!/^[A-Za-z0-9_-]{8,120}$/.test(requestId))
      throw new Error('Invalid selection request');

    // All operations before this method returns are synchronous localStorage operations.
    // expectedRevision still protects stale UI writes; the dedicated key prevents broad
    // learner-state autosave from overwriting course selection.
    const previous=this.decode(this.storage.getItem(this.key(scope)));
    if(previous.lastRequestId===requestId){
      if(previous.activeCourseId===activeCourseId)return clone(previous);
      throw new BrowserCourseSelectionConflict(previous);
    }
    if(previous.revision!==expectedRevision)throw new BrowserCourseSelectionConflict(previous);

    const next:CourseSelection={
      courseV1:1,
      activeCourseId,
      revision:previous.revision+1,
      lastRequestId:requestId,
    };
    writeJSON(this.storage,this.key(scope),next);
    return clone(next);
  }
}

export function browserLocalRepositories(ownerId='local-family',learnerId='primary',storage?:BrowserKeyValueStorage){
  const selected=storage??(typeof window!=='undefined'?window.localStorage:undefined);
  if(!selected)throw new Error('Browser local storage is unavailable.');
  return {
    scope:{ownerId,learnerId} as Scope,
    learning:new BrowserLocalLearningRepository(selected),
    academic:new BrowserLocalAcademicRepository(selected),
    courses:new BrowserLocalCourseSelectionRepository(selected),
  };
}
