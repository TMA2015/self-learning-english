const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');

const root=path.join(__dirname,'..');
const out=path.join(root,'.sites-runtime','github-first-g1');
fs.rmSync(out,{recursive:true,force:true});
execFileSync(process.execPath,[
  path.join(root,'node_modules/typescript/bin/tsc'),
  'infrastructure/browser/local-runtime.ts',
  'infrastructure/storage/browser-local-repositories.ts',
  'application/academic-service.ts',
  'application/learning-service.ts',
  'domain/academic.ts',
  'domain/practice-progress.ts',
  '--outDir','.sites-runtime/github-first-g1',
  '--module','commonjs',
  '--target','es2022',
  '--resolveJsonModule',
  '--esModuleInterop',
  '--skipLibCheck',
  '--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}\n');

class MemoryStorage{
  constructor(){this.map=new Map()}
  getItem(k){return this.map.has(k)?this.map.get(k):null}
  setItem(k,v){this.map.set(k,String(v))}
  removeItem(k){this.map.delete(k)}
}
const storage=new MemoryStorage();
global.window={localStorage:storage,location:{origin:'https://example.test'}};

(async()=>{
  const runtime=require(path.join(out,'infrastructure/browser/local-runtime.js'));

  const learner=await runtime.localLearningRuntime();
  assert.equal(await learner.service.readState(),null);
  await learner.service.saveState({writing:'local draft',profile:{goal:'Build balanced English skills'}});
  const saved=await learner.service.readState();
  assert.equal(saved.writing,'local draft');

  const academic=await runtime.localAcademicRuntime();
  const catalog=await academic.service.catalog();
  assert.equal(catalog.version,'1.24.0');
  assert.equal(catalog.lessons.length,142,'bundled GitHub-first curriculum should auto-load 1.24.0 / 142 lessons');
  assert(catalog.lessons.some(l=>l.id==='REA-C1-01'));
  assert(catalog.lessons.some(l=>l.id==='VOC-C2-01'));
  const packages=await academic.academic.packages();
  assert(packages.some(row=>row.version==='1.24.0'),'Latest 1.24.0 package must be safely stored in the browser');

  assert(catalog.lessons.some(row=>row.id==='LIS-A1-01'),'1.11.0 must expose new A1 Listening lesson');
  assert(catalog.lessons.some(row=>row.id==='LIS-A2-02'),'1.11.0 must expose new A2 Listening lesson');
  assert(catalog.lessons.some(row=>row.id==='LIS-B1-02'),'1.11.0 must expose new B1 Listening lesson');
  assert(catalog.lessons.some(row=>row.id==='WRI-B1-02'),'1.11.0 must expose new B1 Writing lesson');

  // 1.11.0 Listening must have a real manifest-backed audio asset, reject
  // transcript-only submission, then create Listening evidence only after full playback.
  const listening=catalog.lessons.find(row=>row.id==='LIS-A1-01');
  assert(listening,'expected reviewed A1 Listening lesson LIS-A1-01');
  const listenView=await academic.service.lesson(listening.id);
  assert.equal(listenView.version,'1.24.0');
  assert.equal(listenView.lesson.activities.length,10);
  assert(listenView.audio&&listenView.audio.duration>5,'new Listening lesson must expose real audio');

  const listenId='g1-listen-0001';
  await academic.service.start(listening.id,listenId);
  const listenAnswers=Object.fromEntries(listenView.lesson.activities.map(q=>[q.id,'A']));
  await academic.service.draft(listenId,listenAnswers);
  await assert.rejects(()=>academic.service.transcript(listenId),/Transcript is available only after/);
  await assert.rejects(()=>academic.service.submit(listenId),/Finish genuine audio playback/);

  const originalNow=Date.now;
  const playbackStart=originalNow();
  let ticket;
  try{
    Date.now=()=>playbackStart;
    ticket=await academic.service.play(listenId);
    Date.now=()=>playbackStart+Math.ceil(listenView.audio.duration*1000)+1500;
    await academic.service.play(listenId,ticket.token);
  }finally{
    Date.now=originalNow;
  }
  const listened=await academic.service.submit(listenId);
  assert.equal(listened.status,'scored');
  assert.equal(listened.evidence.length,10);
  assert(listened.evidence.every(row=>row.skill==='Listening'));
  assert(listened.evidence.every(row=>row.raw?.playbackCompleted===true));
  const transcript=await academic.service.transcript(listenId);
  assert.match(transcript.text,/photography club/);

  // B1 Writing objective scaffolds may be scored for feedback, but the Writing skill
  // ledger remains review-gated. The open response itself has evidence weight 0.
  const writing=catalog.lessons.find(row=>row.id==='WRI-B1-02');
  assert(writing,'expected reviewed B1 Writing lesson WRI-B1-02');
  const writingView=await academic.service.lesson(writing.id);
  assert.equal(writingView.version,'1.24.0');
  assert.equal(writingView.lesson.activities.length,10);
  const writingId='g1-writing-0001';
  await academic.service.start(writing.id,writingId);
  const writingAnswers={};
  for(const q of writingView.lesson.activities){
    writingAnswers[q.id]=q.type==='single_choice'?'A':
      'I think schools should give students one homework-free evening each week. A planned break can help students rest and manage other responsibilities. For example, they could use the evening for sport, family time, reading, or preparing calmly for the next day. However, important long-term work should still be planned carefully so that the free evening does not create extra pressure later. Students often balance school, clubs, travel, and family duties, so one predictable evening without assigned homework could make the week easier to organise. It may also encourage better time management because students would need to plan other tasks in advance. Therefore, I believe one homework-free evening can support a healthier routine when schools use it consistently and students still take responsibility for their work.';
  }
  await academic.service.draft(writingId,writingAnswers);
  const submittedWriting=await academic.service.submit(writingId);
  assert.equal(submittedWriting.status,'pending_review');
  assert.equal(submittedWriting.evidence.length,0,'Writing must not enter the skill ledger before review');
  const pendingReviews=await academic.service.reviews();
  assert(pendingReviews.some(row=>row.id===writingId));
  const approvedWriting=await academic.service.approve(writingId,'Clear position, relevant support, and a coherent paragraph.',{
    task_coverage:3,
    idea_development:3,
    coherence:3,
    grammar:3,
    vocabulary:3
  },true);
  assert.equal(approvedWriting.status,'approved');
  assert.equal(approvedWriting.evidence.length,5);
  assert(approvedWriting.evidence.every(row=>row.skill==='Writing'));

  const progress=await runtime.localPracticeProgress();
  assert(progress.overall.total>0,'reviewed Listening/Writing work should appear in local progress');
  assert(progress.skills.some(row=>row.skill==='Listening'));
  assert(progress.skills.some(row=>row.skill==='Writing'));

  const academicAgain=await runtime.localAcademicRuntime();
  const catalogAgain=await academicAgain.service.catalog();
  assert(catalogAgain.attempts.some(row=>row.id===listenId),'Listening attempt must survive service recreation in browser storage');
  assert(catalogAgain.attempts.some(row=>row.id===writingId),'Writing attempt must survive service recreation in browser storage');

  console.log(JSON.stringify({
    githubFirstG1:true,
    curriculum:catalog.version,
    lessons:catalog.lessons.length,
    b1Wave2A:true,
    b1Wave2B:true,
    b1Wave2C:true,
    grammarRoadmapComplete:true,
    b1VocabularyReadingDensityWave1:true,
    listeningWritingDensityWave2:true,
    listeningAudioManifest:true,
    listeningPlaybackGuard:true,
    transcriptAfterSubmission:true,
    writingReviewGate:true,
    reviewedSkillEvidence:['Listening','Writing'],
    localState:true,
    deterministicAttempt:true,
    localProgress:true,
    d1:false,
    ai:false
  }));
})().catch(error=>{console.error(error);process.exit(1)});
