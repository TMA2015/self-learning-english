import {emptySelection,WRITING_COURSE_ID,type CourseSelection} from '../../domain/course-p1';

// Existing learner_states table, isolated keyspace: normal principals start user:/email:.
// The legacy v20 GET/PUT only addresses the principal's unprefixed row.
export function selectionKey(ownerId:string){if(!/^(user|email):/.test(ownerId))throw Error('Invalid authenticated scope');return `course:v1:${ownerId}`}
function decode(payload:string|undefined):CourseSelection{
 if(!payload)return emptySelection();
 const value=JSON.parse(payload) as CourseSelection;
 if(value.courseV1!==1||!Number.isSafeInteger(value.revision)||value.revision<1||![null,WRITING_COURSE_ID].includes(value.activeCourseId)||typeof value.lastRequestId!=='string')throw Error('Invalid stored course selection');
 return value;
}
export class CourseSelectionConflict extends Error{constructor(public current:CourseSelection){super('Course selection changed. Reload and try again.')}}
export class D1CourseSelectionRepository{
 constructor(private db:D1Database){}
 private async raw(ownerId:string){return (await this.db.prepare('SELECT payload FROM learner_states WHERE user_id=?').bind(selectionKey(ownerId)).first<{payload:string}>())?.payload}
 async read(ownerId:string){return decode(await this.raw(ownerId))}
 async select(ownerId:string,activeCourseId:string|null,expectedRevision:number,requestId:string):Promise<CourseSelection>{
  const key=selectionKey(ownerId);
  if(activeCourseId!==null&&activeCourseId!==WRITING_COURSE_ID)throw Error('Course is unavailable');
  if(!Number.isSafeInteger(expectedRevision)||expectedRevision<0||!/^[A-Za-z0-9_-]{8,120}$/.test(requestId))throw Error('Invalid selection request');
  const previousPayload=await this.raw(ownerId),previous=decode(previousPayload);
  if(previous.lastRequestId===requestId){if(previous.activeCourseId===activeCourseId)return previous;throw new CourseSelectionConflict(previous)}
  if(previous.revision!==expectedRevision)throw new CourseSelectionConflict(previous);
  const next:CourseSelection={courseV1:1,activeCourseId,revision:previous.revision+1,lastRequestId:requestId};
  const now=Date.now();
  const result=previousPayload===undefined
   ?await this.db.prepare('INSERT INTO learner_states(user_id,payload,updated_at) VALUES(?,?,?) ON CONFLICT DO NOTHING').bind(key,JSON.stringify(next),now).run()
   :await this.db.prepare('UPDATE learner_states SET payload=?,updated_at=? WHERE user_id=? AND payload=?').bind(JSON.stringify(next),now,key,previousPayload).run();
  if(result.meta.changes===1)return next;
  const actual=await this.read(ownerId);
  if(actual.lastRequestId===requestId&&actual.activeCourseId===activeCourseId)return actual;
  throw new CourseSelectionConflict(actual);
 }
}
