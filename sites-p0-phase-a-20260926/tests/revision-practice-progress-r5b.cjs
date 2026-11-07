'use strict';
/** R5b: actual public lesson text + synthetic attempt summaries; no user data. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/revision-practice-progress-r5b',dest=path.join(root,out);
fs.rmSync(dest,{recursive:true,force:true});
cp.execFileSync(process.execPath,[
 path.join(root,'node_modules/typescript/bin/tsc'),
 'domain/revision-practice-progress.ts','domain/lesson-revision-plan.ts',
 '--outDir',out,'--rootDir','.','--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(dest,'package.json'),'{"type":"commonjs"}');
const {planLessonRevisions}=require(path.join(dest,'domain/lesson-revision-plan.js'));
const {deriveRevisionPracticeProgress}=require(path.join(dest,'domain/revision-practice-progress.js'));
const {derivePracticeProgress}=require(path.join(dest,'domain/practice-progress.js'));
const old=require('../content/curriculum-1.18.0-candidate.json');
const newest=require('../content/curriculum-1.20.0-candidate.json');
const grammarId='GRA-A1-01',readingId='REA-A1-01';
const byId=(s,id)=>s.lessons.find(l=>l.id===id);
const previousGrammar=byId(old,grammarId),newGrammar=byId(newest,grammarId);
const previousReading=byId(old,readingId),newReading=byId(newest,readingId);
assert(previousGrammar&&newGrammar&&previousReading&&newReading);
assert.deepEqual(previousGrammar,newGrammar,'Grammar is unchanged across the actual releases');
assert.notDeepEqual(previousReading,newReading,'Reading really changed in actual release');
const oldQuestion=previousReading.activities[0],newQuestion=newReading.activities[0];
assert.equal(oldQuestion.id,newQuestion.id,'Question ID is preserved despite lesson revision');
const grammarQuestion=newGrammar.activities[0];
function attempt(id,source,lesson,q,correct,at,status='scored'){
 return {id,rootId:id,packageId:source.package_id,version:source.schema_version,
 lessonId:lesson.id,status,answers:{[q.id]:'synthetic'},
 createdAt:at,submittedAt:status==='started'?undefined:at+1,
 results:status==='started'?undefined:[{id:q.id,correct,
  explanation:'Stored old result',tags:q.skill_tags}],
 evidence:[]};
}
const attempts=[
 attempt('old-grammar-wrong',old,previousGrammar,grammarQuestion,false,1),
 attempt('new-grammar-wrong',newest,newGrammar,grammarQuestion,false,2),
 attempt('old-reading-wrong',old,previousReading,oldQuestion,false,3),
 attempt('new-reading-right',newest,newReading,newQuestion,true,4),
 attempt('writing-draft',newest,byId(newest,'WRI-A2-01'),
  byId(newest,'WRI-A2-01').activities[0],null,5,'started'),
];
const original=JSON.stringify(attempts);
(async()=>{
 const refs=attempts.map(a=>({version:a.version,lessonId:a.lessonId,packageId:a.packageId}));
 const packages=[old,newest].map(s=>({id:s.package_id,version:s.schema_version,
  digest:'validated-'+s.schema_version,source:s,at:s===old?1:2}));
 const plan=await planLessonRevisions(packages,refs);
 const snapshot={active:plan.active,aliases:plan.aliases,blobs:plan.blobs};
 const oldMetric=derivePracticeProgress(attempts,packages.map((p)=>({...p,bundle:{}})));
 const normalized=deriveRevisionPracticeProgress(attempts,snapshot);
 assert.equal(oldMetric.overall.total,4);
 assert.equal(normalized.overall.total,4);
 assert.equal(normalized.overall.correct,1);
 assert.equal(normalized.overall.uniqueQuestions,3,
  'Same original Grammar question across versions shares one hash; changed Reading remains distinct');
 assert.equal(oldMetric.overall.uniqueQuestions,4,
  'Old package-version grouping overcounts unchanged questions');
 const repeated=normalized.repeatedMistakes.find(x=>x.lessonId===grammarId);
 assert(repeated&&repeated.incorrect===2&&repeated.total===2,
  'Repeated Grammar mistake should be recognized even across two curriculum versions');
 const gram=normalized.lessonProgress.find(x=>x.lessonId===grammarId);
 assert(gram&&gram.attempts===2&&gram.distinctRevisions===1&&gram.submitted===2);
 const read=normalized.lessonProgress.find(x=>x.lessonId===readingId);
 assert(read&&read.attempts===2&&read.distinctRevisions===2&&read.correct===1);
 const draft=normalized.lessonProgress.find(x=>x.lessonId==='WRI-A2-01');
 assert(draft&&draft.attempts===1&&draft.started===1&&draft.submitted===0);
 assert.deepEqual(normalized.writing,oldMetric.writing,
  'Writing review/pending accounting must not change with normalized source');
 assert.equal(normalized.diagnosticNote,oldMetric.diagnosticNote);
 assert.equal(JSON.stringify(attempts),original,'Projection must never change saved grades or drafts');
 const missing={...snapshot,aliases:snapshot.aliases.filter(x=>
  !(x.version===old.schema_version&&x.lessonId===readingId))};
 assert.throws(()=>deriveRevisionPracticeProgress(attempts,missing),
  /Saved attempt has no exact original revision/);
 const tampered=JSON.parse(JSON.stringify(snapshot));
 tampered.aliases.find(x=>x.version===old.schema_version&&x.lessonId===grammarId).packageId='wrong-package';
 assert.throws(()=>deriveRevisionPracticeProgress(attempts,tampered),
  /Saved attempt has no exact original revision/);
 assert.equal(JSON.stringify(attempts),original,'Failed projections must not touch attempts');
 console.log(JSON.stringify({result:'PASS',gate:'R5b-normalized-progress-revision-identity',
  actualSourceVersions:[old.schema_version,newest.schema_version],
  storedObjectiveResults:4,correct:1,
  legacyDistinctQuestions:oldMetric.overall.uniqueQuestions,
  normalizedDistinctQuestions:normalized.overall.uniqueQuestions,
  crossVersionSameContentMistakeGrouped:true,
  changedLessonRevisionNotMerged:true,
  stableLessonIdProgress:true,
  missingOriginalSourceFailsClosed:true,allScoresImmutable:true,
  CEFRMasteryNotInferred:true,
  realBrowserProgress:'NOT_TESTED',Safari:'NOT_TESTED',productionWrites:0}));
})().catch(e=>{console.error(e);process.exitCode=1});
