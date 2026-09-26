import type {WritingRepository,WritingSubmission,WritingEvaluation} from '../../domain/writing';
import type {Scope} from '../../domain/repository';
export class D1WritingRepository implements WritingRepository{
 constructor(private db:D1Database){}
 async readSubmissions(s:Scope){const r=await this.db.prepare('SELECT payload FROM writing_submissions WHERE owner_id=? AND learner_id=? ORDER BY at,id').bind(s.ownerId,s.learnerId).all<{payload:string}>();return r.results.map(x=>JSON.parse(x.payload) as WritingSubmission)}
 async appendSubmission(s:Scope,v:WritingSubmission){await this.db.prepare('INSERT INTO writing_submissions(owner_id,learner_id,id,task_id,payload,at) VALUES(?,?,?,?,?,?) ON CONFLICT DO NOTHING').bind(s.ownerId,s.learnerId,v.id,v.taskId,JSON.stringify(v),v.createdAt).run()}
 async readEvaluations(s:Scope){const r=await this.db.prepare('SELECT payload FROM writing_evaluations WHERE owner_id=? AND learner_id=? ORDER BY at,id').bind(s.ownerId,s.learnerId).all<{payload:string}>();return r.results.map(x=>JSON.parse(x.payload) as WritingEvaluation)}
 async claimEvaluation(s:Scope,v:WritingEvaluation){const r=await this.db.prepare('INSERT INTO writing_evaluations(owner_id,learner_id,id,submission_id,status,payload,at) VALUES(?,?,?,?,?,?,?) ON CONFLICT DO NOTHING').bind(s.ownerId,s.learnerId,v.id,v.submissionId,v.status,JSON.stringify(v),v.at).run();return r.meta.changes===1}
 async finishEvaluation(s:Scope,v:WritingEvaluation){await this.db.prepare('UPDATE writing_evaluations SET status=?,payload=? WHERE owner_id=? AND learner_id=? AND id=? AND status=?').bind(v.status,JSON.stringify(v),s.ownerId,s.learnerId,v.id,'pending').run()}
}
