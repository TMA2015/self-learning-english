import {AcademicError,type AcademicPackage,type AcademicAttempt,type AcademicRepository} from '../../domain/academic';
import type {Scope} from '../../domain/repository';

export class D1AcademicRepository implements AcademicRepository{
 constructor(private db:D1Database){}

 async packages(){
  const r=await this.db.prepare('SELECT payload FROM academic_packages').all<{payload:string}>();
  return r.results.map(x=>JSON.parse(x.payload) as AcademicPackage);
 }

 async addPackage(p:AcademicPackage){
  await this.db.prepare('INSERT INTO academic_packages(package_id,version,digest,payload,at) VALUES(?,?,?,?,?) ON CONFLICT DO NOTHING')
   .bind(p.id,p.version,p.digest,JSON.stringify(p),p.at).run();
  const existing=await this.db.prepare('SELECT digest FROM academic_packages WHERE package_id=? AND version=?')
   .bind(p.id,p.version).first<{digest:string}>();
  if(existing?.digest!==p.digest)throw new AcademicError('A conflicting version was imported. Run the dry run again.',409);
 }

 async attempts(scope:Scope){
  const r=await this.db.prepare('SELECT payload FROM academic_attempts WHERE owner_id=? AND learner_id=? ORDER BY at,id')
   .bind(scope.ownerId,scope.learnerId).all<{payload:string}>();
  return r.results.map(x=>JSON.parse(x.payload) as AcademicAttempt);
 }

 async start(scope:Scope,a:AcademicAttempt){
  await this.db.prepare('INSERT INTO academic_attempts(owner_id,learner_id,id,lesson_id,version,status,payload,at) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT DO NOTHING')
   .bind(scope.ownerId,scope.learnerId,a.id,a.lessonId,a.version,a.status,JSON.stringify(a),a.createdAt).run();
 }

 async saveDraft(scope:Scope,id:string,patch:Partial<AcademicAttempt>){
  await this.db.prepare("UPDATE academic_attempts SET payload=json_patch(payload,?) WHERE owner_id=? AND learner_id=? AND id=? AND status='started'")
   .bind(JSON.stringify(patch),scope.ownerId,scope.learnerId,id).run();
 }

 async transition(scope:Scope,a:AcademicAttempt,from:string){
  const marker=crypto.randomUUID();
  const payload=JSON.stringify({...a,commitToken:marker});
  const guard="EXISTS(SELECT 1 FROM academic_attempts WHERE owner_id=? AND learner_id=? AND id=? AND json_extract(payload,'$.commitToken')=?)";
  await this.db.batch([
   this.db.prepare('UPDATE academic_attempts SET status=?,payload=? WHERE owner_id=? AND learner_id=? AND id=? AND status=?')
    .bind(a.status,payload,scope.ownerId,scope.learnerId,a.id,from),
   ...a.evidence.map(e=>this.db.prepare(
    `INSERT INTO learning_evidence(owner_id,learner_id,event_id,skill,source,payload,at) SELECT ?,?,?,?,?,?,? WHERE ${guard} ON CONFLICT DO NOTHING`
   ).bind(
    scope.ownerId,scope.learnerId,e.id,e.skill,e.source,JSON.stringify(e),e.at,
    scope.ownerId,scope.learnerId,a.id,marker
   ))
  ]);
  const row=await this.db.prepare('SELECT payload FROM academic_attempts WHERE owner_id=? AND learner_id=? AND id=?')
   .bind(scope.ownerId,scope.learnerId,a.id).first<{payload:string}>();
  if(!row)throw new AcademicError('Attempt not found.',404);
  return JSON.parse(row.payload) as AcademicAttempt;
 }

 finish(scope:Scope,a:AcademicAttempt){return this.transition(scope,a,'started')}
 approve(scope:Scope,a:AcademicAttempt){return this.transition(scope,a,'pending_review')}
}
