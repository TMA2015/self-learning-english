'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');

const root=path.join(__dirname,'..');
const out=path.join(root,'.sites-runtime','github-first-g2-backup');
fs.rmSync(out,{recursive:true,force:true});
execFileSync(process.execPath,[
  path.join(root,'node_modules/typescript/bin/tsc'),
  'infrastructure/browser/local-backup.ts',
  'infrastructure/browser/local-runtime.ts',
  'infrastructure/storage/browser-local-repositories.ts',
  'application/export-learner.ts',
  'application/restore-learner.ts',
  '--outDir','.sites-runtime/github-first-g2-backup',
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
  getItem(key){return this.map.has(key)?this.map.get(key):null}
  setItem(key,value){this.map.set(key,String(value))}
  removeItem(key){this.map.delete(key)}
}
function useStorage(storage){
  global.window={localStorage:storage,location:{origin:'https://example.test',reload(){}}};
}

(async()=>{
  const backup=require(path.join(out,'infrastructure/browser/local-backup.js'));
  const runtime=require(path.join(out,'infrastructure/browser/local-runtime.js'));
  const restoreApp=require(path.join(out,'application/restore-learner.js'));

  // Build a realistic local profile with state and a scored academic attempt.
  const sourceStorage=new MemoryStorage();
  useStorage(sourceStorage);
  const learner=await runtime.localLearningRuntime();
  await learner.service.saveState({
    writing:'Portable local draft',
    profile:{goal:'Build balanced English skills'},
    customLegacyField:{keep:true},
  });
  const sourceCourses=await runtime.localCourseRuntime();
  await sourceCourses.select('COURSE-WRITING-12W',0,'backup_course_0001');
  const academic=await runtime.localAcademicRuntime();
  const view=await academic.service.lesson('VOC-B1-02');
  const attemptId='g2-backup-attempt-0001';
  await academic.service.start('VOC-B1-02',attemptId);
  const answers={};
  for(const q of view.lesson.activities){
    if(q.type==='single_choice')answers[q.id]='A';
    else if(q.id==='VOC-B1-02-Q6')answers[q.id]='development';
    else if(q.id==='VOC-B1-02-Q9')answers[q.id]='carefully';
    else answers[q.id]='test';
  }
  await academic.service.draft(attemptId,answers);
  const submitted=await academic.service.submit(attemptId);
  assert.equal(submitted.status,'scored');

  const exported=await backup.exportLocalBackup();
  assert.equal(exported.filename,'g-learning-english-backup-v1.json');
  assert(exported.bytes>0&&exported.bytes<=backup.LOCAL_BACKUP_MAX_BYTES);
  assert.equal(exported.counts.academicAttempts,1);
  const raw=JSON.parse(exported.text);
  assert.equal(raw.format,'ai-english-tutor.learner');
  assert.equal(raw.schemaVersion,1);
  assert.equal(raw.state.writing,'Portable local draft');
  assert.equal(raw.academicRecords[0].id,attemptId);
  assert.equal(raw.courseSelection.activeCourseId,'COURSE-WRITING-12W');

  // The source identity is informational only in local mode. Tamper it and prove
  // the restore still targets the explicitly selected local browser profile.
  raw.learnerId='untrusted-source-profile';
  const portableText=JSON.stringify(raw);

  const targetStorage=new MemoryStorage();
  useStorage(targetStorage);
  const targetAcademic=await runtime.localAcademicRuntime();
  const targetLearning=await runtime.localLearningRuntime();

  // Default/server restore semantics remain strict if identity bypass is not explicit.
  const strictPreview=await restoreApp.previewLearnerRestore(
    raw,targetLearning.learning,targetLearning.scope,targetAcademic.academic
  );
  assert.equal(strictPreview.valid,false);
  assert(strictPreview.errors.some(x=>/learner ID/i.test(x)));

  const preview=await backup.previewLocalBackup(portableText);
  assert.equal(preview.valid,true);
  assert.equal(preview.sourceLearnerIdIgnored,true);
  assert.equal(preview.state,'add');
  assert.equal(preview.academic.add,1);
  assert.equal(preview.academic.conflict,0);
  assert.equal(preview.courseSelection,'add');

  const restored=await backup.restoreLocalBackup(portableText,preview.token,true);
  assert.equal(restored.ok,true);
  const safety=JSON.parse(restored.preRestoreBackup.text);
  assert.deepEqual(safety.state,{},'automatic pre-restore backup must capture target before mutation');

  const restoredState=await targetLearning.service.readState();
  assert.equal(restoredState.writing,'Portable local draft');
  assert.deepEqual(restoredState.customLegacyField,{keep:true});
  const restoredCourses=await runtime.localCourseRuntime();
  assert.equal((await restoredCourses.load()).activeCourseId,'COURSE-WRITING-12W');
  const targetAttempts=await targetAcademic.academic.attempts(targetAcademic.scope);
  assert.equal(targetAttempts.length,1);
  assert.equal(targetAttempts[0].id,attemptId);
  assert.equal(targetAttempts[0].status,'scored');

  // Exact repeat is safe and idempotent.
  const second=await backup.previewLocalBackup(portableText);
  assert.equal(second.valid,true);
  assert.equal(second.state,'same');
  assert.equal(second.academic.add,0);
  assert.equal(second.academic.skip,1);
  assert.equal(second.courseSelection,'same');
  await backup.restoreLocalBackup(portableText,second.token,true);
  assert.equal((await targetAcademic.academic.attempts(targetAcademic.scope)).length,1);

  // Different local learner state is never silently overwritten.
  const conflictStorage=new MemoryStorage();
  useStorage(conflictStorage);
  const conflictLearning=await runtime.localLearningRuntime();
  await conflictLearning.service.saveState({writing:'Newer local work'});
  const beforeConflict=await conflictLearning.service.readState();
  const conflict=await backup.previewLocalBackup(portableText);
  assert.equal(conflict.valid,false);
  assert.equal(conflict.state,'conflict');
  assert(conflict.errors.some(x=>/different learner state/i.test(x)));
  await assert.rejects(
    ()=>backup.restoreLocalBackup(portableText,conflict.token,true),
    /different learner state/i
  );
  assert.deepEqual(await conflictLearning.service.readState(),beforeConflict,'blocked restore must not mutate target state');

  assert.throws(()=>backup.parseLocalBackup('{not json'),/valid JSON/);
  assert.throws(()=>backup.parseLocalBackup('{}'),/not a supported/);
  assert.throws(
    ()=>backup.parseLocalBackup(' '.repeat(backup.LOCAL_BACKUP_MAX_BYTES+1)),
    /too large/
  );

  console.log(JSON.stringify({
    result:'PASS',
    format:'g-learning-english-backup-v1.json',
    export:true,
    preview:true,
    sourceIdentityIgnoredOnlyInLocalMode:true,
    strictIdentityDefaultPreserved:true,
    preRestoreBackup:true,
    exactRepeatIdempotent:true,
    conflictNoOverwrite:true,
    malformedRejected:true,
    activeCourseRoundTrip:true,
    maxBytes:backup.LOCAL_BACKUP_MAX_BYTES,
    curriculum:'1.11.0'
  }));
})().catch(error=>{console.error(error);process.exit(1)});
