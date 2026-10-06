import type {LearningRepository,Scope,LearnerState,Snapshot} from '../../domain/repository';
import type {DiagnosticV2,Evidence} from '../../domain/learning-model';

export class D1LearningRepository implements LearningRepository {
 constructor(private database:D1Database){}
 private args(s:Scope){return [s.ownerId,s.learnerId]}

 private async scopedState(s:Scope){
  const row=await this.database.prepare('SELECT payload FROM learner_profile_states WHERE owner_id=? AND learner_id=?')
   .bind(...this.args(s)).first<{payload:string}>();
  return row?.payload;
 }

 async readState(s:Scope){
  const scoped=await this.scopedState(s);
  if(scoped!==undefined)return JSON.parse(scoped);
  if(s.learnerId!=='primary')return null;
  const legacy=await this.database.prepare('SELECT payload FROM learner_states WHERE user_id=?')
   .bind(s.ownerId).first<{payload:string}>();
  return legacy?JSON.parse(legacy.payload):null;
 }

 async writeState(s:Scope,state:LearnerState){
  await this.database.prepare(
   'INSERT INTO learner_profile_states (owner_id,learner_id,payload,updated_at) VALUES (?,?,?,?) ON CONFLICT(owner_id,learner_id) DO UPDATE SET payload=excluded.payload,updated_at=excluded.updated_at'
  ).bind(...this.args(s),JSON.stringify(state),Date.now()).run();
 }

 async appendEvidence(s:Scope,events:Evidence[]){
  const statements=[
   this.database.prepare('INSERT INTO learners (owner_id,learner_id,created_at) VALUES (?,?,?) ON CONFLICT DO NOTHING').bind(...this.args(s),Date.now()),
   ...events.map(e=>this.database.prepare('INSERT INTO learning_evidence (owner_id,learner_id,event_id,skill,source,payload,at) VALUES (?,?,?,?,?,?,?) ON CONFLICT DO NOTHING').bind(...this.args(s),e.id,e.skill,e.source,JSON.stringify(e),e.at))
  ];
  for(let i=0;i<statements.length;i+=40)await this.database.batch(statements.slice(i,i+40));
 }

 async readEvidence(s:Scope){
  const r=await this.database.prepare('SELECT payload FROM learning_evidence WHERE owner_id=? AND learner_id=? ORDER BY at,event_id').bind(...this.args(s)).all<{payload:string}>();
  return r.results.map(x=>JSON.parse(x.payload) as Evidence);
 }

 async readAssessments(s:Scope){
  const r=await this.database.prepare('SELECT payload FROM assessment_sessions WHERE owner_id=? AND learner_id=? ORDER BY at DESC,session_id').bind(...this.args(s)).all<{payload:string}>();
  return r.results.map(x=>JSON.parse(x.payload) as DiagnosticV2);
 }

 async appendAssessment(s:Scope,d:DiagnosticV2){
  await this.database.prepare('INSERT INTO assessment_sessions (owner_id,learner_id,session_id,payload,at) VALUES (?,?,?,?,?) ON CONFLICT DO NOTHING').bind(...this.args(s),d.sessionId??String(d.startedAt),JSON.stringify(d),d.finishedAt??d.startedAt).run();
 }

 async legacyImported(s:Scope){
  const r=await this.database.prepare('SELECT legacy_imported FROM learners WHERE owner_id=? AND learner_id=?').bind(...this.args(s)).first<{legacy_imported:number}>();
  return !!r?.legacy_imported;
 }

 async markLegacyImported(s:Scope){
  await this.database.prepare('UPDATE learners SET legacy_imported=1 WHERE owner_id=? AND learner_id=?').bind(...this.args(s)).run();
 }

 async appendSnapshot(s:Scope,id:string,h:Snapshot){
  await this.database.prepare('INSERT INTO mastery_snapshots (owner_id,learner_id,snapshot_id,engine_version,payload,at) VALUES (?,?,?,?,?,?) ON CONFLICT DO NOTHING').bind(...this.args(s),id,h.engineVersion,JSON.stringify(h.model),h.at).run();
 }

 async readSnapshots(s:Scope){
  const r=await this.database.prepare('SELECT payload,engine_version,at FROM mastery_snapshots WHERE owner_id=? AND learner_id=? ORDER BY at DESC,snapshot_id').bind(...this.args(s)).all<{payload:string;engine_version:string;at:number}>();
  return r.results.map(x=>({model:JSON.parse(x.payload),engineVersion:x.engine_version,at:x.at}));
 }
}
