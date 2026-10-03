/**
 * Deterministic content-only batch composer.
 * Author new lessons inside a small, reviewable batch; generate one cumulative
 * package for the current bounded Site importer. Does not read/write learner data.
 *
 * node scripts/compose-curriculum.mjs --check content/curriculum-1.1.0-candidate.json content/batches/batch02.json content/curriculum-1.2.0-candidate.json
 * node scripts/compose-curriculum.mjs --write content/curriculum-1.1.0-candidate.json content/batches/batch02.json content/curriculum-1.2.0-candidate.json
 */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

const semver=/^\d+\.\d+\.\d+$/;
const lessonId=/^(GRA|VOC|REA|LIS|WRI|SPE|PRO)-(A1|A2|B1|B2)-\d{2,3}$/;
const MAX_CURRICULUM_LESSONS=150;
const MAX_CURRICULUM_BYTES=5_000_000;
const prefix={GRA:'grammar',VOC:'vocabulary',REA:'reading',LIS:'listening',WRI:'writing',SPE:'speaking',PRO:'pronunciation'};
const versionCompare=(a,b)=>{const aa=a.split('.').map(Number),bb=b.split('.').map(Number);for(let i=0;i<3;i++)if(aa[i]!==bb[i])return aa[i]-bb[i];return 0};

export function composeCurriculum(previous,batch){
 assert.equal(batch.format,'ai-english-tutor.curriculum-batch');
 assert.equal(batch.schema_version,1);
 assert.equal(batch.base_version,previous.schema_version,'Wrong base package version');
 assert(semver.test(batch.target_version)&&versionCompare(batch.target_version,previous.schema_version)>0,'Version must increase');
 assert(Array.isArray(previous.lessons)&&Array.isArray(previous.course?.sequence));
 assert(Array.isArray(batch.lessons)&&batch.lessons.length>0);
 assert(Array.isArray(batch.insert_after));
 const oldIds=new Set(previous.lessons.map(l=>l.id));
 const newIds=new Set();
 const questionIds=new Set(previous.lessons.flatMap(l=>l.activities.map(q=>q.id)));
 for(const l of batch.lessons){
  assert(lessonId.test(l.id),'Invalid new lesson ID '+l.id);
  assert.equal(prefix[l.id.slice(0,3)],l.module,'Module mismatch '+l.id);
  assert(!oldIds.has(l.id)&&!newIds.has(l.id),'New lesson duplicates previous ID '+l.id);
  newIds.add(l.id);
  assert(Array.isArray(l.activities)&&l.activities.length>0&&l.activities.length<=24,'Activity count '+l.id);
  for(const q of l.activities){
   assert(q.id.startsWith(l.id+'-'),'Question ID prefix '+q.id);
   assert(!questionIds.has(q.id),'Duplicate task ID '+q.id);
   questionIds.add(q.id);
  }
 }
 const next=structuredClone(previous);
 next.schema_version=batch.target_version;
 for(const [prop,key] of [['status','status'],['title','course_title'],['description','course_description']]){
  assert(typeof batch.metadata?.[key]==='string'&&batch.metadata[key].trim(),key+' required');
  if(prop==='status')next.status=batch.metadata[key];
  else next.course[prop]=batch.metadata[key];
 }
 assert(typeof batch.metadata?.curriculum_principle==='string'&&batch.metadata.curriculum_principle.trim());
 next.curriculum_outline.principle=batch.metadata.curriculum_principle;
 next.lessons.push(...batch.lessons);
 const placed=new Set();
 for(const step of batch.insert_after){
  assert(typeof step.after==='string'&&Array.isArray(step.ids)&&step.ids.length>0,'Invalid insertion step');
  const at=next.course.sequence.indexOf(step.after);
  assert(at>=0,'Missing insertion anchor '+step.after);
  for(const id of step.ids){
   assert(newIds.has(id),'Insertion refers to an unknown new lesson '+id);
   assert(!placed.has(id),'Lesson inserted twice '+id);
   placed.add(id);
  }
  next.course.sequence.splice(at+1,0,...step.ids);
 }
 assert.equal(placed.size,newIds.size,'Every new lesson must be placed in course sequence');
 assert.equal(next.course.sequence.length,next.lessons.length,'Course sequence is incomplete');
 assert.equal(new Set(next.course.sequence).size,next.lessons.length,'Course sequence duplicates IDs');
 assert(next.lessons.length<=MAX_CURRICULUM_LESSONS,`Current importer supports at most ${MAX_CURRICULUM_LESSONS} cumulative lessons`);
 const text=JSON.stringify(next,null,2)+'\n';
 assert(Buffer.byteLength(text,'utf8')<=MAX_CURRICULUM_BYTES,'Current admin importer has a 5 MB content-package limit');
 return next;
}

function main(){
 const [mode,oldPath,batchPath,destination]=process.argv.slice(2);
 assert(['--check','--write'].includes(mode),'Use --check or --write');
 assert(oldPath&&batchPath&&destination,'Provide base, batch and destination paths');
 const previous=JSON.parse(readFileSync(oldPath,'utf8'));
 const batch=JSON.parse(readFileSync(batchPath,'utf8'));
 const next=composeCurriculum(previous,batch);
 const output=JSON.stringify(next,null,2)+'\n';
 if(mode==='--check'){
  assert.equal(readFileSync(destination,'utf8'),output,'Candidate differs from reproducible composed batch');
  console.log(JSON.stringify({result:'PASS',mode,version:next.schema_version,lessons:next.lessons.length,activities:next.lessons.flatMap(l=>l.activities).length}));
 } else {
  writeFileSync(destination,output,'utf8');
  console.log(JSON.stringify({result:'WRITTEN',version:next.schema_version,lessons:next.lessons.length}));
 }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main();
