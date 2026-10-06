'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');

const root=path.join(__dirname,'..');
const out=path.join(root,'.sites-runtime','account-profile-d1-isolation-p0');
fs.rmSync(out,{recursive:true,force:true});

for(const [sourcePath,outPath] of [
  ['infrastructure/storage/d1-repository.ts','infrastructure/storage/d1-repository.js'],
  ['infrastructure/storage/d1-academic.ts','infrastructure/storage/d1-academic.js'],
  ['infrastructure/storage/d1-course-selection.ts','infrastructure/storage/d1-course-selection.js'],
  ['domain/course-p1.ts','domain/course-p1.js'],
]){
  const source=fs.readFileSync(path.join(root,sourcePath),'utf8');
  const built=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const dest=path.join(out,outPath);
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.writeFileSync(dest,built);
}
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}\n');

const {D1LearningRepository}=require(path.join(out,'infrastructure/storage/d1-repository.js'));
const {D1AcademicRepository}=require(path.join(out,'infrastructure/storage/d1-academic.js'));
const {D1CourseSelectionRepository}=require(path.join(out,'infrastructure/storage/d1-course-selection.js'));
const {WRITING_COURSE_ID}=require(path.join(out,'domain/course-p1.js'));

class FakeD1{
  constructor(){
    this.profileStates=new Map();
    this.legacyStates=new Map();
    this.attempts=new Map();
  }
  prepare(sql){
    const db=this;
    return {bind(...values){return {
      async first(){
        if(sql.startsWith('SELECT payload FROM learner_profile_states')){
          const payload=db.profileStates.get(values[0]+':'+values[1]);
          return payload===undefined?null:{payload};
        }
        if(sql.startsWith('SELECT payload FROM learner_states')){
          const payload=db.legacyStates.get(values[0]);
          return payload===undefined?null:{payload};
        }
        if(sql.startsWith('SELECT digest FROM academic_packages'))return null;
        throw new Error('Unexpected first SQL: '+sql);
      },
      async all(){
        if(sql.startsWith('SELECT payload FROM academic_attempts WHERE owner_id=? AND learner_id=?')){
          const prefix=values[0]+':'+values[1]+':';
          const results=[...db.attempts.entries()].filter(([key])=>key.startsWith(prefix)).map(([,payload])=>({payload}));
          return {results};
        }
        if(sql.startsWith('SELECT payload FROM academic_packages'))return {results:[]};
        if(sql.startsWith('SELECT payload FROM learning_evidence'))return {results:[]};
        if(sql.startsWith('SELECT payload FROM assessment_sessions'))return {results:[]};
        if(sql.startsWith('SELECT payload,engine_version,at FROM mastery_snapshots'))return {results:[]};
        throw new Error('Unexpected all SQL: '+sql);
      },
      async run(){
        if(sql.startsWith('INSERT INTO learner_profile_states')){
          db.profileStates.set(values[0]+':'+values[1],values[2]);
          return {meta:{changes:1}};
        }
        if(sql.startsWith('INSERT INTO learner_states')){
          if(!db.legacyStates.has(values[0])){db.legacyStates.set(values[0],values[1]);return {meta:{changes:1}}}
          return {meta:{changes:0}};
        }
        if(sql.startsWith('UPDATE learner_states SET payload=?,updated_at=? WHERE user_id=? AND payload=?')){
          if(db.legacyStates.get(values[2])===values[3]){db.legacyStates.set(values[2],values[0]);return {meta:{changes:1}}}
          return {meta:{changes:0}};
        }
        if(sql.startsWith('INSERT INTO academic_attempts')){
          const key=values[0]+':'+values[1]+':'+values[2];
          if(!db.attempts.has(key)){db.attempts.set(key,values[6]);return {meta:{changes:1}}}
          return {meta:{changes:0}};
        }
        throw new Error('Unexpected run SQL: '+sql);
      }
    }}};
  }
  async batch(){throw new Error('batch is not needed in this isolation test')}
}

(async()=>{
  const db=new FakeD1();
  const learning=new D1LearningRepository(db);
  const academic=new D1AcademicRepository(db);
  const courses=new D1CourseSelectionRepository(db);
  const primary={ownerId:'user:family',learnerId:'primary'};
  const second={ownerId:'user:family',learnerId:'second'};
  const other={ownerId:'user:other',learnerId:'primary'};

  // Historical primary state stays readable, but never leaks to another profile.
  db.legacyStates.set(primary.ownerId,JSON.stringify({writing:'legacy primary'}));
  assert.equal((await learning.readState(primary)).writing,'legacy primary');
  assert.equal(await learning.readState(second),null);
  assert.equal(await learning.readState(other),null);

  // First scoped write is copy-on-write; legacy row stays untouched.
  await learning.writeState(primary,{writing:'new primary'});
  await learning.writeState(second,{writing:'second learner'});
  assert.equal((await learning.readState(primary)).writing,'new primary');
  assert.equal((await learning.readState(second)).writing,'second learner');
  assert.equal(JSON.parse(db.legacyStates.get(primary.ownerId)).writing,'legacy primary');

  const attempt={id:'same-attempt',packageId:'pkg',version:'1.0.0',lessonId:'GRA-A1-01',rootId:'same-attempt',status:'started',answers:{},createdAt:1,evidence:[]};
  await academic.start(primary,attempt);
  await academic.start(second,{...attempt,lessonId:'VOC-A1-01'});
  assert.equal((await academic.attempts(primary)).length,1);
  assert.equal((await academic.attempts(second)).length,1);
  assert.equal((await academic.attempts(primary))[0].lessonId,'GRA-A1-01');
  assert.equal((await academic.attempts(second))[0].lessonId,'VOC-A1-01');
  assert.equal((await academic.attempts(other)).length,0);

  await courses.select(primary,WRITING_COURSE_ID,0,'d1_profile_req_01');
  assert.equal((await courses.read(primary)).activeCourseId,WRITING_COURSE_ID);
  assert.equal((await courses.read(second)).activeCourseId,null);
  assert.equal((await courses.read(other)).activeCourseId,null);

  console.log(JSON.stringify({
    result:'PASS',
    d1LearnerStateIsolated:true,
    d1LegacyPrimaryFallback:true,
    d1LegacyCopyOnWrite:true,
    d1AcademicAttemptsIsolated:true,
    d1CourseSelectionIsolated:true
  }));
})().catch(error=>{console.error(error);process.exit(1)});
