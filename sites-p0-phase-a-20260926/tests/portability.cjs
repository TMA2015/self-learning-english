const assert=require('node:assert/strict');
const root='../.sites-runtime/portable-tests/';
const {learningService}=require(root+'application/learning-service.js');
const {exportLearner}=require(root+'application/export-learner.js');
const {validateImportEnvelope}=require(root+'domain/portable-data.js');
const {previewLearnerRestore,restoreLearnerBackup}=require(root+'application/restore-learner.js');
const {SitesAuthentication}=require(root+'infrastructure/auth/sites.js');
const {createTutorService}=require(root+'ai/service.js');
const {OpenAIHTTPProvider}=require(root+'infrastructure/ai/openai-http.js');
const {coreCatalog}=require(root+'domain/core-bank.js');
class MemoryRepository {
 rows=new Map();row(s){const key=JSON.stringify(s);if(!this.rows.has(key))this.rows.set(key,{state:null,events:new Map(),sessions:new Map(),snapshots:new Map(),imported:false});return this.rows.get(key)}
 async readState(s){return structuredClone(this.row(s).state)}async writeState(s,v){this.row(s).state=structuredClone(v)}
 async readEvidence(s){return [...this.row(s).events.values()]}async appendEvidence(s,v){for(const e of v)if(!this.row(s).events.has(e.id))this.row(s).events.set(e.id,structuredClone(e))}
 async readAssessments(s){return [...this.row(s).sessions.values()].sort((a,b)=>b.startedAt-a.startedAt)}async appendAssessment(s,d){const id=d.sessionId??String(d.startedAt);if(!this.row(s).sessions.has(id))this.row(s).sessions.set(id,structuredClone(d))}
 async legacyImported(s){return this.row(s).imported}async markLegacyImported(s){this.row(s).imported=true}
 async appendSnapshot(s,id,v){this.row(s).snapshots.set(id,structuredClone(v))}async readSnapshots(s){return [...this.row(s).snapshots.values()]}
}
(async()=>{
 const repo=new MemoryRepository(),scope={ownerId:'a',learnerId:'primary'},a=learningService(repo,scope),b=learningService(repo,{ownerId:'b',learnerId:'primary'});
 const e={id:'legacy-1',source:'exercise',skill:'Grammar',tag:'articles',score:1,max:1,at:1,level:'A2'};
 const saved={writing:'Unchanged writing',customLegacyField:{retained:true},evidence:[e],diagnosticV2:{version:4,attempts:[],writing:'partial',startedAt:1,paused:true}};
 await a.saveState(saved);await a.importLegacy(await a.readState());await a.importLegacy(await a.readState());assert.equal((await a.readEvidence()).length,1);assert.equal((await b.readEvidence()).length,0);assert.equal(await b.readState(),null);
 const exported=await exportLearner(repo,scope),roundtrip=JSON.parse(JSON.stringify(exported));assert(validateImportEnvelope(roundtrip));assert(!validateImportEnvelope({...roundtrip,schemaVersion:99}));assert.deepEqual(roundtrip.state,saved);assert.equal(roundtrip.evidence.length,1);assert.equal(roundtrip.writingSubmissions[1]?.writing??roundtrip.writingSubmissions[0].writing,'Unchanged writing');
 // Restore requires a preview token tied to both source and current target state.
 const target=new MemoryRepository(),targetScope={ownerId:'new-auth-id',learnerId:'primary'};
 const preview=await previewLearnerRestore(roundtrip,target,targetScope);assert.equal(preview.valid,true);assert.equal(preview.state,'add');assert.equal(preview.evidence.add,1);assert(preview.token);
 await assert.rejects(()=>restoreLearnerBackup(roundtrip,target,targetScope,'wrong-token',true),/Preview again|changed since preview/);
 await restoreLearnerBackup(roundtrip,target,targetScope,preview.token,true);
 assert.deepEqual(await target.readState(targetScope),saved);assert.equal((await target.readEvidence(targetScope)).length,1);
 const secondPreview=await previewLearnerRestore(roundtrip,target,targetScope);assert.equal(secondPreview.valid,true);assert.equal(secondPreview.state,'same');assert.equal(secondPreview.evidence.skip,1);
 await target.writeState(targetScope,{different:true});const conflictPreview=await previewLearnerRestore(roundtrip,target,targetScope);assert.equal(conflictPreview.valid,false);assert.equal(conflictPreview.state,'conflict');
 const auth=new SitesAuthentication(['admin@example.invalid']);const request=email=>({headers:new Headers(email?{'oai-authenticated-user-email':email}:{})});assert.equal(auth.authenticate(request()),null);assert.equal(auth.authenticate(request('learner@example.invalid')).roles.includes('admin'),false);assert.equal(auth.authenticate(request('admin@example.invalid')).roles.includes('admin'),true);
 const rating={level:'A2',scores:Object.fromEntries(coreCatalog.Writing.map(k=>[k,5])),summary:'Synthetic contract fixture',strengths:[],improvements:[],corrections:[],tags:[],exercise:'Review a sentence',vendorSecret:'must be dropped'};
 const fake={available:true,generate:async r=>{assert.equal(r.schemaVersion,1);assert.equal(r.purpose,'writing-evaluation');assert(!r.instructions.includes('{{'));return {provider:'independent-test-adapter',model:'fixture',result:rating}}};
 const checked=await createTutorService(fake).evaluateWriting('My own sentence.','Write about school.');assert.equal(checked.evaluation.provider,'independent-test-adapter');assert.equal(checked.evaluation.promptVersion,'1.0.0');assert(!('vendorSecret' in checked));assert(!('vendorSecret' in checked.evaluation.structuredResult));assert.equal(await createTutorService({available:false,generate:async()=>{throw Error('must not call')}}).evaluateWriting('x','x'),null);
 const adapter=new OpenAIHTTPProvider('test-key','test-model',async(url,options)=>{assert.equal(options.headers.Authorization,'Bearer test-key');return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify(rating)}}]}))});const normalized=await adapter.generate({schemaVersion:1,purpose:'writing-evaluation',promptVersion:'1',instructions:'test',input:{text:'test'},temperature:0});assert.equal(normalized.provider,'openai');assert(!('choices' in normalized));
 console.log(JSON.stringify({repositorySwap:true,exportRoundtrip:true,restorePreview:true,restoreToken:true,destructiveRestoreBlocked:true,legacyPreserved:true,authRoles:true,providerSwap:true,normalizedMetadata:true,liveAI:false}));
})().catch(e=>{console.error(e);process.exitCode=1});
