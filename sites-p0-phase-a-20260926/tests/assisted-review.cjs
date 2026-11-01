const assert=require('node:assert/strict');
const root='../.sites-runtime/portable-tests/';
const {assistedReview,anonymize}=require(root+'application/assisted-review.js');
const {writingTutor}=require(root+'application/writing-tutor.js');
const {createTutorService}=require(root+'ai/service.js');
const {learningService}=require(root+'application/learning-service.js');
const {exportLearner}=require(root+'application/export-learner.js');
const {coreCatalog}=require(root+'domain/core-bank.js');
const {validateContent}=require(root+'domain/content-model.js');
class Store{
 rows=new Map();row(s){const key=JSON.stringify(s);if(!this.rows.has(key))this.rows.set(key,{state:null,e:[],a:[],h:[],s:[],v:[],p:[],approvals:[],imported:false});return this.rows.get(key)}
 async readState(s){return structuredClone(this.row(s).state)}async writeState(s,v){this.row(s).state=structuredClone(v)}async readEvidence(s){return structuredClone(this.row(s).e)}async appendEvidence(s,v){for(const e of v)if(!this.row(s).e.some(x=>x.id===e.id))this.row(s).e.push(structuredClone(e))}
 async readAssessments(s){return this.row(s).a}async appendAssessment(s,v){this.row(s).a.push(v)}async legacyImported(s){return this.row(s).imported}async markLegacyImported(s){this.row(s).imported=true}async appendSnapshot(s,id,v){this.row(s).h.push(v)}async readSnapshots(s){return this.row(s).h}
 async readSubmissions(s){return structuredClone(this.row(s).s)}async appendSubmission(s,v){if(!this.row(s).s.some(x=>x.id===v.id))this.row(s).s.push(structuredClone(v))}async readEvaluations(s){return structuredClone(this.row(s).v)}async claimEvaluation(s,v){if(this.row(s).v.some(x=>x.id===v.id))return false;this.row(s).v.push(structuredClone(v));return true}async finishEvaluation(s,v){const i=this.row(s).v.findIndex(x=>x.id===v.id);this.row(s).v[i]=structuredClone(v)}
 async readPackets(s){return structuredClone(this.row(s).p)}async appendPacket(s,v){this.row(s).p.push(structuredClone(v))}async readApprovals(s){return this.row(s).approvals}
 async approve(s,v,by){const existing=this.row(s).approvals.find(x=>x.submissionId===v.submissionId);if(existing)return existing.evaluationId===v.id;this.row(s).approvals.push({submissionId:v.submissionId,evaluationId:v.id,reviewedBy:by,at:v.reviewedAt});await this.finishEvaluation(s,v);await this.appendEvidence(s,v.evidence);return true}
}
(async()=>{
 const db=new Store(),scope={ownerId:'owner-a',learnerId:'primary'},other={ownerId:'owner-b',learnerId:'primary'},review=assistedReview(db,db,db,scope),tutor=writingTutor(db,db,scope,createTutorService({available:false,generate:async()=>{throw Error('No external call allowed')}}));
 const old={writing:'Original saved workspace',profile:{name:'Anna Nguyen',goal:'a private goal'}};await db.writeState(scope,old);
 const text='My name is Anna Nguyen. A school garden help children learn about plants. Students can measure leaves each week and write about their growth. My email is anna@example.invalid.';
 const submission=(await tutor.submit({text,kind:'draft'})).submission;
 assert.equal(anonymize('Ann likes planning.', 'Ann'),'[NAME] likes planning.');assert.equal(anonymize('[NAME] wrote this.', 'Name'),'[NAME] wrote this.');
 const clean=anonymize(text,old.profile.name);assert(!clean.includes('Anna'));assert(!clean.includes('@'));await assert.rejects(()=>review.prepare(submission.id,clean,false));
 const packet=await review.prepare(submission.id,clean,true);const serialized=JSON.stringify(packet.packet);assert(!serialized.includes('owner-a'));assert(!serialized.includes('Anna'));assert(!serialized.includes('anna@example'));assert(!serialized.includes('private goal'));
 const feedback={level:'A2',canEstimateLevel:true,scores:Object.fromEntries(coreCatalog.Writing.map(t=>[t,7])),relevance:8,summary:'The opinion is relevant and supported by a science activity.',strengths:['You give a specific example of measuring leaves.'],improvements:['Check the verb after a singular subject.'],corrections:[{original:'garden help',revised:'garden helps',why:'Garden is singular.',hint:'Which present-simple ending does a singular subject need?',tag:'subject-verb agreement'}],tags:['subject-verb agreement'],revisionSummary:'',revisionInstructions:['Revise the verb in your first garden sentence.'],exercise:'Write one sentence about a flower using need.',exerciseTag:'subject-verb agreement'};
 await assert.rejects(()=>review.importFeedback(JSON.stringify(packet.packet.expectedResponse),submission.id));
 const envelope={schemaVersion:1,reviewId:packet.id,responseDigest:packet.responseDigest,provider:'external-assistant',model:'not supplied',feedback};
 await assert.rejects(()=>review.importFeedback(JSON.stringify({...envelope,responseDigest:'wrong'}),submission.id));
 await assert.rejects(()=>review.importFeedback(JSON.stringify(envelope),'wrong-submission'));
 await assert.rejects(()=>assistedReview(db,db,db,other).importFeedback(JSON.stringify(envelope),submission.id));
 await assert.rejects(()=>review.importFeedback(JSON.stringify({...envelope,feedback:{...feedback,scores:{...feedback.scores,vocabulary:11}}}),submission.id));
 await assert.rejects(()=>review.importFeedback(JSON.stringify({...envelope,feedback:{...feedback,corrections:[{...feedback.corrections[0],original:'not in this essay'}]}}),submission.id));
 const imported=await review.importFeedback(JSON.stringify(envelope),submission.id);assert.equal(imported.evaluation.status,'awaiting_approval');assert.equal((await db.readEvidence(scope)).length,0);assert(!(await tutor.history()).evaluations.some(e=>e.status==='awaiting_approval'));
 assert((await review.importFeedback(JSON.stringify(envelope),submission.id)).duplicate);
 await assert.rejects(()=>review.approve(imported.evaluation.id,'owner-a',false));
 const approved=await review.approve(imported.evaluation.id,'owner-a',true);assert.equal(approved.status,'approved');assert.equal((await db.readEvidence(scope)).length,6);assert.equal(approved.rating.evaluation.provider,'external-assistant');assert(approved.evidence.every(e=>e.reviewSource==='assisted-ai'&&e.reviewStatus==='approved'));
 await review.approve(imported.evaluation.id,'owner-a',true);assert.equal((await db.readEvidence(scope)).length,6);
 await assert.rejects(()=>review.importFeedback(JSON.stringify({...envelope,feedback:{...feedback,summary:'Changed approved work'}}),submission.id));
 const current=await learningService(db,scope).rebuild(await db.readState(scope));assert(current.learnerModel.errorTags.includes('subject-verb agreement'));assert(current.learningPlan.items.length>0);assert.equal(current.learnerModel.estimates.Grammar.level,'Not assessed');
 const revision=(await tutor.submit({text:'A school garden helps children learn about plants.',kind:'sentence',parentId:submission.id})).submission;assert.equal(revision.rootId,submission.id);assert.equal((await db.readSubmissions(scope))[0].text,text);
 const exported=await exportLearner(db,scope,db,db);assert(exported.profile.estimate.errorTags.includes('subject-verb agreement'));assert.equal(exported.assistedRecords.approvals.length,1);assert.equal(exported.assistedRecords.packets.length,1);assert.equal(exported.writingRecords.submissions.length,2);assert.deepEqual(await db.readState(scope),old);assert.equal((await db.readEvidence(other)).length,0);
 const content=require('../content/learning-content.json');assert.deepEqual(validateContent(content),[]);assert.equal(content.units.length,12);assert.equal(content.exercises.length,2);
 console.log(JSON.stringify({assistedReview:true,packetPrivacy:true,matching:true,safeImport:true,approvalGate:true,idempotent:true,reviewedWorkLocked:true,revisionHistory:true,evidenceAndPlan:true,accountIsolation:true,portableContent:true,liveExternalAI:false}));
})().catch(e=>{console.error(e);process.exitCode=1});
