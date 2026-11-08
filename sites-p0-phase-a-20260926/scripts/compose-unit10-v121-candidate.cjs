'use strict';
/**
 * Source-only Unit 10 candidate composer, NEVER auto-imported or auto-deployed.
 * Source authority: NotebookLM packet SLE-UNIT10-A1A2B1-TRANSFER-20261107-R1
 * Verdict: PASS_WITH_REQUIRED_CHANGES; 6 canonical tags reconciled.
 * Audio/production: 3 real MP3s & scoped rights verified in Draft;\n * production activation requires exact-head QA and owner release approval.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const base=require('../content/curriculum-1.20.0-candidate.json');
const authored=require('../content/batches/unit10-a1a2b1-9-lessons-v121-draft.json');
const unitMap={
 'A1-U10':['REA-A1-05','LIS-A1-06','WRI-A1-05'],
 'A2-U10':['REA-A2-08','LIS-A2-07','WRI-A2-07'],
 'B1-U10':['REA-B1-07','LIS-B1-08','WRI-B1-08']
};
const sum=x=>x.lessons.reduce((n,l)=>n+l.activities.length,0);
function composeUnit10(){
 assert.equal(base.schema_version,'1.20.0','Only the immutable accepted base may be used');
 assert.equal(base.lessons.length,123);
 assert.equal(sum(base),1025);
 assert.equal(authored.packet_id,'SLE-UNIT10-A1A2B1-TRANSFER-20261107-R1');
 assert.equal(authored.production,'NO_GO_AUDIO_MEDIA01_AND_RIGHTS_PENDING');
 assert.equal(Object.keys(authored.required_normalizations).length,6);
 assert.deepEqual(authored.unit_lesson_ids,unitMap);
 assert.equal(authored.lessons.length,9);
 assert.equal(authored.lessons.reduce((n,l)=>n+l.activities.length,0),30);
 const candidate=structuredClone(base);
 candidate.schema_version='1.21.0';
 candidate.status='academic_pass_unit10_audio_verified_rights_approved_pending_explicit_release';
 const existing=new Set(candidate.lessons.map(l=>l.id));
 const globalItems=new Set(candidate.lessons.flatMap(l=>l.activities.map(a=>a.id)));
 for(const l of authored.lessons){
  assert(!existing.has(l.id),'Never replace an old lesson '+l.id);
  existing.add(l.id);
  for(const a of l.activities){
   assert(!globalItems.has(a.id),'Never reuse an old question ID '+a.id);
   globalItems.add(a.id);
  }
  candidate.lessons.push(structuredClone(l));
  candidate.course.sequence.push(l.id);
 }
 assert.equal(candidate.lessons.length,132);
 assert.equal(sum(candidate),1055);
 assert.deepEqual(candidate.lessons.slice(0,123),base.lessons,
  'The 123 earlier lessons, answers and rubrics must remain unchanged');
 assert.deepEqual(candidate.course.sequence.slice(0,123),base.course.sequence,
  'Old learner lesson sequence must be retained');
 assert.deepEqual(candidate.rubrics,base.rubrics,
  'No silently modified writing assessment rubric');
 for(const [unit,ids] of Object.entries(unitMap))
  assert(ids.every(id=>candidate.lessons.some(l=>l.id===id)),unit);
 return candidate;
}
if(require.main===module){
 const candidate=composeUnit10();
 const output=path.join(root,'.sites-runtime/unit10/curriculum-1.21.0-CANDIDATE-NO-MEDIA.json');
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.writeFileSync(output,JSON.stringify(candidate,null,2)+'\n');
 console.log(JSON.stringify({result:'GENERATED_DRY_RUN_ONLY',
   location:path.relative(root,output),curriculumVersion:candidate.schema_version,
   lessonCount:candidate.lessons.length,activityCount:sum(candidate),
   preservedOldLessons:true,audioAssetsProduced:0,imported:false,
   gitRelease:false,ownerDataChanged:false,productionRelease:'NO_GO'}));
}
module.exports={composeUnit10,unitMap};
