import type {AssistedReviewRepository,ReviewPacket} from '../../domain/assisted-review';
import type {Scope} from '../../domain/repository';
import type {WritingEvaluation} from '../../domain/writing';
export class D1AssistedReviewRepository implements AssistedReviewRepository{
 constructor(private db:D1Database){}
 async readApprovals(s:Scope){const rows=await this.db.prepare("SELECT submission_id,evaluation_id,reviewed_by,at FROM writing_approvals WHERE owner_id=? AND learner_id=? ORDER BY at").bind(s.ownerId,s.learnerId).all<{submission_id:string;evaluation_id:string;reviewed_by:string;at:number}>();return rows.results.map(r=>({submissionId:r.submission_id,evaluationId:r.evaluation_id,reviewedBy:r.reviewed_by,at:r.at}))}
 async readPackets(s:Scope){const r=await this.db.prepare('SELECT payload FROM assisted_review_packets WHERE owner_id=? AND learner_id=? ORDER BY at,id').bind(s.ownerId,s.learnerId).all<{payload:string}>();return r.results.map(x=>JSON.parse(x.payload) as ReviewPacket)}
 async appendPacket(s:Scope,p:ReviewPacket){await this.db.prepare('INSERT INTO assisted_review_packets(owner_id,learner_id,id,submission_id,payload,at) VALUES(?,?,?,?,?,?) ON CONFLICT DO NOTHING').bind(s.ownerId,s.learnerId,p.id,p.submissionId,JSON.stringify(p),p.at).run()}
 async approve(s:Scope,e:WritingEvaluation,reviewedBy:string){
  const guard='EXISTS (SELECT 1 FROM writing_approvals WHERE owner_id=? AND learner_id=? AND submission_id=? AND evaluation_id=?)';
  const args=[s.ownerId,s.learnerId,e.submissionId,e.id];
  const statements=[
   this.db.prepare('INSERT INTO writing_approvals(owner_id,learner_id,submission_id,evaluation_id,reviewed_by,at) SELECT ?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM writing_evaluations WHERE owner_id=? AND learner_id=? AND id=? AND status=?) ON CONFLICT DO NOTHING').bind(...args,reviewedBy,e.reviewedAt??Date.now(),s.ownerId,s.learnerId,e.id,'awaiting_approval'),
   this.db.prepare(`UPDATE writing_evaluations SET status='approved',payload=? WHERE owner_id=? AND learner_id=? AND id=? AND status='awaiting_approval' AND ${guard}`).bind(JSON.stringify(e),s.ownerId,s.learnerId,e.id,...args),
   this.db.prepare('INSERT INTO learners(owner_id,learner_id,created_at) VALUES(?,?,?) ON CONFLICT DO NOTHING').bind(s.ownerId,s.learnerId,Date.now()),
   ...e.evidence.map(row=>this.db.prepare(`INSERT INTO learning_evidence(owner_id,learner_id,event_id,skill,source,payload,at) SELECT ?,?,?,?,?,?,? WHERE ${guard} ON CONFLICT DO NOTHING`).bind(s.ownerId,s.learnerId,row.id,row.skill,row.source,JSON.stringify(row),row.at,...args))
  ];
  await this.db.batch(statements);
  const row=await this.db.prepare('SELECT evaluation_id FROM writing_approvals WHERE owner_id=? AND learner_id=? AND submission_id=?').bind(s.ownerId,s.learnerId,e.submissionId).first<{evaluation_id:string}>();return row?.evaluation_id===e.id;
 }
}
