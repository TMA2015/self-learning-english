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

  // MVP restore is deliberately disabled, including otherwise valid current-version exports.
  const before=new Map(sourceStorage.map);
  await assert.rejects(()=>backup.previewLocalBackup(exported.text),/temporarily unavailable/);
  await assert.rejects(()=>backup.restoreLocalBackup(exported.text,'unused',true),/temporarily unavailable/);
  assert.deepEqual(sourceStorage.map,before);
  assert.throws(()=>backup.parseLocalBackup('{not json'),/valid JSON/);
  assert.throws(()=>backup.parseLocalBackup('{}'),/not a supported/);
  assert.throws(()=>backup.parseLocalBackup(' '.repeat(backup.LOCAL_BACKUP_MAX_BYTES+1)),/too large/);
  console.log('PASS: current local export preserved; restore disabled before mutation; malformed/oversize input validation retained.');
})().catch(error=>{console.error(error);process.exit(1)});
