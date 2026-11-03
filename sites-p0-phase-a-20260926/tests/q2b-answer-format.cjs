const assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','application/academic-service.ts','domain/practice-progress.ts','domain/foundation-summary.ts','--outDir','.sites-runtime/q2b','--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{stdio:'inherit'});fs.writeFileSync('.sites-runtime/q2b/package.json','{"type":"commonjs"}');
const {academicService}=require('../.sites-runtime/q2b/application/academic-service.js');
const {answerFormat,gapContext}=require('../.sites-runtime/q2b/domain/answer-format.js');
const {derivePracticeProgress}=require('../.sites-runtime/q2b/domain/practice-progress.js');
const {summarizeFoundationResults}=require('../.sites-runtime/q2b/domain/foundation-summary.js');
const {isKnowledgeEvidence,inference}=require('../.sites-runtime/q2b/domain/learning-model.js');
const seed=require('../content/curriculum-1.16.0-candidate.json');
class Store{p=[];a=new Map();e=new Map();states=new Map();async packages(){return structuredClone(this.p)}async addPackage(v){const old=this.p.find(x=>x.version===v.version);if(old){assert.equal(old.digest,v.digest);return}this.p.push(structuredClone(v))}async attempts(o){return structuredClone(this.a.get(o)??[])}async start(o,v){const a=this.a.get(o)??[];if(!a.some(x=>x.id===v.id))a.push(structuredClone(v));this.a.set(o,a)}async saveDraft(o,id,p){const a=this.a.get(o).find(x=>x.id===id);if(a.status==='started')Object.assign(a,structuredClone(p))}async finish(o,v){const a=this.a.get(o).find(x=>x.id===v.id);if(a.status==='started'){Object.assign(a,structuredClone(v));await this.appendEvidence({ownerId:o},v.evidence)}return structuredClone(a)}async approve(o,v){const a=this.a.get(o).find(x=>x.id===v.id);if(a.status==='pending_review'){Object.assign(a,structuredClone(v));await this.appendEvidence({ownerId:o},v.evidence)}return structuredClone(a)}async readState(s){return this.states.get(s.ownerId)??null}async readEvidence(s){return this.e.get(s.ownerId)??[]}async appendEvidence(s,v){const a=this.e.get(s.ownerId)??[];for(const e of v)if(!a.some(x=>x.id===e.id))a.push(e);this.e.set(s.ownerId,a)}async readAssessments(){return []}async legacyImported(){return true}async markLegacyImported(){}async appendSnapshot(){} }
(async()=>{
 let count=0,variants=0,eligible=0,negatives=0;const coverage=[];
 for(const l of seed.lessons.filter(l=>['grammar','vocabulary'].includes(l.module)))for(const q of l.activities.filter(q=>q.type==='short_answer')){
  count++;let positive=0;
  for(const accepted of q.answer.accepted_answers){
   variants++;assert.equal(answerFormat(q,accepted,l.module),'accepted');assert.equal(answerFormat(q,'  '+accepted.toUpperCase()+'  ',l.module),'accepted');
   const context=gapContext(q.prompt);
   if(context){const completed=context.replace(/\s*___/,accepted.startsWith("'")||accepted.startsWith('’')?accepted:(context.startsWith('___')?'':' ')+accepted);
    assert.equal(answerFormat(q,completed,l.module),'format-only',q.id);positive++;
    for(const bad of [completed+' or something else','not '+completed,completed.replace(/___/g,'')+' and maybe not',completed.replace(/\b(I|We|She|He|They|You)\b/i,'SomeoneElse')]){
     if(bad===completed)continue;assert.notEqual(answerFormat(q,bad,l.module),'format-only',q.id+' '+bad);negatives++;
    }
   }
   for(const bad of [accepted+' / wrong','not '+accepted,'wrong '+accepted]){assert.notEqual(answerFormat(q,bad,l.module),'format-only');negatives++;}
  }
  if(positive)eligible++;coverage.push({id:q.id,module:l.module,variants:q.answer.accepted_answers.length,exactContext:!!positive});
 }
 assert.equal(count,153);assert.equal(coverage.filter(q=>q.module==='grammar').length,125);assert.equal(coverage.filter(q=>q.module==='vocabulary').length,28);
 const lesson=seed.lessons.find(l=>l.id==='GRA-A2-11'),q=lesson.activities.find(q=>q.id==='GRA-A2-11-Q6');
 assert.equal(answerFormat(q,'I will help you','grammar'),'format-only');
 for(const bad of ['I would help you','He will help you','I will not help you','I will helps you','I will help you or carry them','I will helping you','I will help you?',"I'll help you"]){assert.equal(answerFormat(q,bad,'grammar'),'ordinary');negatives++;}
 for(const prompt of ['Explain your answer: ___','Choose: ___ or ___','Complete: ___','Rewrite the sentence without changing its meaning.'])assert.equal(gapContext(prompt),null);
 const db=new Store(),service=academicService(db,db,'owner');let preview=await service.preview(seed);await service.importPackage(seed,preview.token,true);
 const answers=Object.fromEntries(lesson.activities.map(q=>[q.id,q.answer.correct_option_id??q.answer.accepted_answers[0]]));
 let a=await service.start(lesson.id,'format-attempt-one');await service.draft(a.id,{...answers,[q.id]:'I will help you'});
 const before=JSON.stringify(await db.attempts('owner'));assert.deepEqual(await service.checkFormat(a.id),{ids:[q.id]});assert.equal(JSON.stringify(await db.attempts('owner')),before);
 a=await service.submit(a.id);const row=a.results.find(r=>r.id===q.id);assert.equal(row.correct,null);assert.equal(row.outcome,'format-only');assert.deepEqual(row.tags,[]);assert(!a.evidence.some(e=>e.questionId===q.id));
 assert.equal(summarizeFoundationResults(a.results).total,lesson.activities.length-1);assert.equal(summarizeFoundationResults(a.results).reviewOnly,0);
 const progress=derivePracticeProgress([a],db.p);assert.equal(progress.formatOnly,1);assert.equal(progress.overall.total,lesson.activities.length-1);assert.equal(progress.overall.uniqueQuestions,lesson.activities.length-1);assert.deepEqual(progress.repeatedMistakes,[]);assert.deepEqual(progress.suggestions,[]);
 const immutable=JSON.stringify(a);assert.equal(JSON.stringify(await service.submit(a.id)),immutable);await assert.rejects(()=>service.draft(a.id,answers));
 // Old scored results have no outcome marker: preserve and count their original wrong result.
 const historical={...structuredClone(a),id:'historical-result',version:'1.15.0',results:[{id:q.id,correct:false,explanation:'Original',tags:q.skill_tags}],evidence:[]};
 const frozen=JSON.stringify(historical);const hp=derivePracticeProgress([historical,{...historical,id:'historical-result-two'},a],db.p);assert.equal(hp.overall.total,lesson.activities.length+1);assert.equal(hp.repeatedMistakes[0].incorrect,2);assert.equal(JSON.stringify(historical),frozen);
 const fixed=await service.start(lesson.id,'corrected-attempt');await service.draft(fixed.id,answers);assert.deepEqual(await service.checkFormat(fixed.id),{ids:[]});assert((await service.submit(fixed.id)).results.every(r=>r.correct));
 const bad=await service.start(lesson.id,'wrong-tense-attempt');await service.draft(bad.id,{...answers,[q.id]:'I would help you'});const badResult=await service.submit(bad.id);assert.equal(badResult.results.find(r=>r.id===q.id).correct,false);assert(badResult.evidence.some(e=>e.questionId===q.id&&e.errorTags.length));
 const marker={id:'format',source:'exercise',skill:'Grammar',tag:'tense',score:0,max:1,at:1,level:'A2',raw:{answerOutcome:'format-only'}};assert(!isKnowledgeEvidence(marker));assert.equal(inference([marker],'Grammar').evidenceCount,0);assert(isKnowledgeEvidence({...marker,raw:{}}));
 const pending=await service.start(lesson.id,'failed-draft-attempt');const saved=JSON.stringify(await db.attempts('owner'));const write=db.saveDraft;db.saveDraft=async()=>{throw new Error('quota')};await assert.rejects(()=>service.draft(pending.id,answers),/quota/);assert.equal(JSON.stringify(await db.attempts('owner')),saved);db.saveDraft=write;
 const ui=fs.readFileSync('app/foundation.tsx','utf8');assert(ui.includes('await saveDraft();if(revision!==draftRevision.current)'));assert(ui.includes("action:'check-format'"));assert(ui.includes('Submit anyway · format-only unscored'));assert(ui.includes('setFormatNotice(null);draftRevision.current++'));assert(ui.includes('submitPending.current=false'));
 fs.mkdirSync('docs/qa',{recursive:true});fs.writeFileSync('docs/qa/Q2B_FORMAT_COVERAGE.json',JSON.stringify({activities:count,variants,exactContextActivities:eligible,ordinaryOnlyActivities:count-eligible,negativeChecks:negatives,coverage},null,2)+'\n');
 console.log(JSON.stringify({result:'PASS',activities:count,variants,exactContextActivities:eligible,ordinaryOnlyActivities:count-eligible,negativeChecks:negatives,service:true,history:true,denominators:true,storageFailure:true,preflight:true,liveAI:false}));
})().catch(e=>{console.error(e);process.exitCode=1});
