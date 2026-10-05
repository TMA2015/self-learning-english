import {emptySelection,WRITING_COURSE_ID,type CourseSelection} from '../../domain/course-p1';
import type {Scope} from '../../domain/repository';

function validOwner(ownerId:string){if(!/^(user|email):/.test(ownerId))throw Error('Invalid authenticated scope')}
function validLearner(learnerId:string){if(!/^[A-Za-z0-9_-]{1,120}$/.test(learnerId))throw Error('Invalid learner scope')}

// New learner-scoped key. Keep legacy owner-only key readable for the historical
// primary learner so existing D1 selections are not lost when profiles are introduced.
export function selectionKey(scope:Scope){
 validOwner(scope.ownerId);validLearner(scope.learnerId);
 return `course:v2:${scope.ownerId}:learner:${scope.learnerId}`;
}
function legacySelectionKey(ownerId:string){validOwner(ownerId);return `course:v1:${ownerId}`}

function decode(payload:string|undefined):CourseSelection{
 if(!payload)return emptySelection();
 const value=JSON.parse(payload) as CourseSelection;
 if(value.courseV1!==1||!Number.isSafeInteger(value.revision)||value.revision<1||![null,WRITING_COURSE_ID].includes(value.activeCourseId)||typeof value.lastRequestId!=='string')throw Error('Invalid stored course selection');
 return value;
}

export class CourseSelectionConflict extends Error{
 constructor(public current:CourseSelection){super('Course selection changed. Reload and try again.')}
}

export class D1CourseSelectionRepository{
 constructor(private db:D1Database){}

 private async readPayload(key:string){
  return (await this.db.prepare('SELECT payload FROM learner_states WHERE user_id=?').bind(key).first<{payload:string}>())?.payload;
 }

 private async raw(scope:Scope){
  const key=selectionKey(scope);
  const scoped=await this.readPayload(key);
  if(scoped!==undefined)return {key,payload:scoped,legacy:false};
  if(scope.learnerId==='primary'){
   const legacyKey=legacySelectionKey(scope.ownerId);
   const legacy=await this.readPayload(legacyKey);
   if(legacy!==undefined)return {key,payload:legacy,legacy:true};
  }
  return {key,payload:undefined,legacy:false};
 }

 async read(scope:Scope){
  return decode((await this.raw(scope)).payload);
 }

 async select(scope:Scope,activeCourseId:string|null,expectedRevision:number,requestId:string):Promise<CourseSelection>{
  if(activeCourseId!==null&&activeCourseId!==WRITING_COURSE_ID)throw Error('Course is unavailable');
  if(!Number.isSafeInteger(expectedRevision)||expectedRevision<0||!/^[A-Za-z0-9_-]{8,120}$/.test(requestId))throw Error('Invalid selection request');

  const current=await this.raw(scope),previous=decode(current.payload);
  if(previous.lastRequestId===requestId){
   if(previous.activeCourseId===activeCourseId)return previous;
   throw new CourseSelectionConflict(previous);
  }
  if(previous.revision!==expectedRevision)throw new CourseSelectionConflict(previous);

  const next:CourseSelection={courseV1:1,activeCourseId,revision:previous.revision+1,lastRequestId:requestId};
  const now=Date.now();

  // If the value came from the historical owner-only key, create the new scoped
  // row instead of modifying the legacy record. This makes migration reversible.
  const scopedPayload=current.legacy?undefined:current.payload;
  const result=scopedPayload===undefined
   ?await this.db.prepare('INSERT INTO learner_states(user_id,payload,updated_at) VALUES(?,?,?) ON CONFLICT DO NOTHING').bind(current.key,JSON.stringify(next),now).run()
   :await this.db.prepare('UPDATE learner_states SET payload=?,updated_at=? WHERE user_id=? AND payload=?').bind(JSON.stringify(next),now,current.key,scopedPayload).run();

  if(result.meta.changes===1)return next;
  const actual=await this.read(scope);
  if(actual.lastRequestId===requestId&&actual.activeCourseId===activeCourseId)return actual;
  throw new CourseSelectionConflict(actual);
 }
}
