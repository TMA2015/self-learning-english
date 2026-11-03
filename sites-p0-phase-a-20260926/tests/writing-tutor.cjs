const assert=require('node:assert/strict');
const root='../.sites-runtime/portable-tests/';
const {writingTutor}=require(root+'application/writing-tutor.js');
const {createTutorService}=require(root+'ai/service.js');
const {exportLearner}=require(root+'application/export-learner.js');
const {learningService}=require(root+'application/learning-service.js');
const {coreCatalog}=require(root+'domain/core-bank.js');
// Test-only fixtures. These are NOT live AI evaluations and are never connected to the app.
class Repository {
 data=new Map();r(s){const k=JSON.stringify(s);if(!this.data.has(k))this.data.set(k,{state:null,e:[],a:[],h:[],s:[],v:[],imported:false});return this.data.get(k)}
 async readState(s){return structuredClone(this.r(s).state)}async writeState(s,v){this.r(s).state=structuredClone(v)}
 async readEvidence(s){return structuredClone(this.r(s).e)}async appendEvidence(s,v){for(const x of v)if(!this.r(s).e.some(e=>e.id===x.id))this.r(s).e.push(structuredClone(x))}
 async readAssessments(s){return structuredClone(this.r(s).a)}async appendAssessment(s,v){this.r(s).a.push(structuredClone(v))}
 async legacyImported(s){return this.r(s).imported}async markLegacyImported(s){this.r(s).imported=true}
 async appendSnapshot(s,id,v){this.r(s).h.push(v)}async readSnapshots(s){return this.r(s).h}
 async readSubmissions(s){return structuredClone(this.r(s).s)}async appendSubmission(s,v){if(!this.r(s).s.some(x=>x.id===v.id))this.r(s).s.push(structuredClone(v))}
 async readEvaluations(s){return structuredClone(this.r(s).v)}async claimEvaluation(s,v){if(this.r(s).v.some(x=>x.id===v.id))return false;this.r(s).v.push(structuredClone(v));return true}
 async finishEvaluation(s,v){const i=this.r(s).v.findIndex(x=>x.id===v.id);if(this.r(s).v[i].status==='pending')this.r(s).v[i]=structuredClone(v)}
}
const samples=[
 {name:'correct',text:'I agree that our school should have a small garden. Students can learn how plants grow by measuring them each week. For example, our class could compare plants in sunny and shady places. This would make science lessons more interesting.',tags:[]},
 {name:'off-topic',text:'My favourite game is chess. I play chess with my brother every weekend. Last Sunday I won two games because I planned my moves carefully. I would like to join a chess club next year.',tags:['off-topic']},
 {name:'weak-ideas',text:'I think a school garden is good. It is very good for children. Gardens are nice and I like them. We should have one because it would be good.',tags:['idea-development']},
 {name:'agreement',text:'A school garden help children learn about plants. Each student water a plant every day. We can measure the leaves and draw them in our science books. This activity makes science more interesting.',tags:['subject-verb agreement'],quote:'garden help',fixed:'garden helps'},
 {name:'vocabulary',text:'A school garden can help us do progress in science. We can make experiments with seeds and compare their growth. For example, two groups can use different amounts of water and explain the results.',tags:['collocation'],quote:'do progress',fixed:'make progress'},
 {name:'mixed-errors',text:'Yesterday our class plant a apple tree in the garden. It need sunlight and water. We was happy because we learn about plants. I think gardens is useful because they help us studying science.',tags:['tense','article','subject-verb agreement'],quote:'plant a apple',fixed:'planted an apple'},
 {name:'revised-draft',text:'Yesterday our class planted an apple tree in the garden. It needs sunlight and water. We were happy because we learned about plants. School gardens are useful because they help us study science through real experiences.',tags:[]},
 {name:'sentence-revision',text:'A school garden helps children learn about plants.',tags:[]},
 {name:'empty',text:'   ',tags:[]},
 {name:'unavailable',text:'I would like a school garden where our class can grow vegetables and learn science.',tags:[]},
 {name:'failure',text:'Plants need care, so students could share jobs and practise working together in the garden.',tags:[]},
 {name:'repeated',text:'I agree that our school should have a small garden. Students can learn how plants grow by measuring them each week. For example, our class could compare plants in sunny and shady places. This would make science lessons more interesting.',tags:[]}
];
let calls=0,lastContext;
const provider={available:true,async generate(r){calls++;lastContext=r.input.learnerContext;const item=samples.find(x=>x.text===r.input.studentWriting);if(item.name==='failure')throw Error('Simulated provider timeout');assert(item);const result={level:'A2',scores:Object.fromEntries(coreCatalog.Writing.map(k=>[k,item.name==='off-topic'&&k==='task-understanding'?1:6])),relevance:item.name==='off-topic'?1:8,canEstimateLevel:true,summary:`Fixture review for ${item.name}`,strengths:['You stated your own idea.'],improvements:item.tags.map(t=>`Review ${t}.`).slice(0,3),corrections:item.quote?[{original:item.quote,revised:item.fixed,why:'Fixture explanation of this observed span.',tag:item.tags[0],hint:'Check the form before changing this phrase.'}]:[],tags:item.tags,exercise:'Write one new example sentence.',exerciseTag:item.tags[0]??'idea-development',revisionSummary:r.input.learnerContext.previousText?'Fixture comparison with the saved parent text.':''};return {provider:'test-only',model:'fixture-not-live-ai',result}}};
(async()=>{
 const repo=new Repository(),scope={ownerId:'a',learnerId:'primary'},other={ownerId:'b',learnerId:'primary'};
 await repo.writeState(scope,{writing:'Preserved old draft',profile:{goal:'Explain my ideas with examples'}});
 const service=writingTutor(repo,repo,scope,createTutorService(provider));let original,grammar;const results=[];
 for(const item of samples){if(item.name==='empty'){await assert.rejects(()=>service.submit({text:item.text,kind:'draft'}));results.push({case:item.name,status:'rejected'});continue}
  const revision=item.name==='revised-draft'||item.name==='sentence-revision';const active=item.name==='unavailable'?writingTutor(repo,repo,scope,createTutorService({available:false,generate:async()=>{throw Error('Must not call')}})):service;
  const result=await active.submit({text:item.text,kind:revision?(item.name==='sentence-revision'?'sentence':'revision'):'draft',parentId:revision?grammar.submission.id:undefined});
  if(item.name==='correct')original=result;if(item.name==='agreement')grammar=result;
  assert.equal(result.submission.text,item.text);assert.equal(result.evaluation.status,item.name==='unavailable'?'unavailable':item.name==='failure'?'failed':'validated');
  if(item.name==='repeated'){assert.equal(result.submission.id,original.submission.id);assert(result.reused)}
  if(item.name==='sentence-revision')assert(result.evaluation.evidence.every(e=>e.provisional));
  results.push({case:item.name,status:result.evaluation.status,reused:result.reused});
 }
 assert.equal((await repo.readState(scope)).writing,'Preserved old draft');assert.equal((await repo.readSubmissions(other)).length,0);assert.equal((await repo.readEvaluations(other)).length,0);
 await assert.rejects(()=>writingTutor(repo,repo,other,createTutorService(provider)).submit({text:'Other learner revision',kind:'revision',parentId:original.submission.id}));
 assert.equal(lastContext.goals,'Explain my ideas with examples');assert(!('ownerId' in lastContext));
 const callsBefore=calls;await service.submit({text:samples[0].text,kind:'draft'});assert.equal(calls,callsBefore);
 const history=JSON.parse(JSON.stringify(await service.history()));assert(history.evaluations.some(e=>e.rating?.corrections[0]?.hint));assert(history.evaluations.every(e=>e.status!=='validated'||e.rating.evaluation.promptVersion==='1.0.0'));
 const model=await learningService(repo,scope).rebuild(await repo.readState(scope));assert(model.learnerModel.estimates.Writing.assessed);assert.equal(model.learnerModel.estimates.Grammar.level,'Not assessed');assert.equal(model.learnerModel.level,'Not assessed');
 const exported=await exportLearner(repo,scope,repo);assert.equal(exported.writingRecords.submissions.length,history.submissions.length);assert.deepEqual(JSON.parse(JSON.stringify(exported.writingRecords.evaluations)),history.evaluations);
 console.log(JSON.stringify({writingCases:results,liveAI:false,contextFromRepository:true,accountIsolation:true,originalPreserved:true,exportHistory:true,deterministicScoresUntouched:true}));
})().catch(e=>{console.error(e);process.exitCode=1});
