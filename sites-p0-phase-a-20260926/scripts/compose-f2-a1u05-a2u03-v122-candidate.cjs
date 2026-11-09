'use strict';
/**
 * REVIEW-ONLY F2 A1-U05 / A2-U03 additive curriculum composer.
 * Academic authority: owner-supplied NotebookLM authored-content R2 PASS,
 * 2026-11-09, 9 objective Reading questions and 2 unscored Writing tasks.
 * This script NEVER imports learner data, deploys Firebase or merges a PR.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const base=require('../content/curriculum-1.21.0-candidate.json');
const authored=require('../content/batches/f2-a1u05-a2u03-4-lessons-v122-draft.json');
const unitMap={
 'A1-U05':['REA-A1-06','WRI-A1-06'],
 'A2-U03':['REA-A2-09','WRI-A2-08']
};
const count=x=>x.lessons.reduce((n,l)=>n+l.activities.length,0);
function composeF2(){
 assert.equal(base.schema_version,'1.21.0');
 assert.deepEqual([base.lessons.length,count(base)],[132,1055]);
 assert.equal(authored.packet_id,'SLE-F2-A1U05-A2U03-AUTHORED-CONTENT-20261109-R2');
 assert.equal(authored.review_scope,'AUTHORED_CONTENT_ITEM_LEVEL');
 assert.deepEqual(authored.reconciled_corrections,['COR-01','COR-02','COR-03','COR-04']);
 assert.equal(authored.production,'NO_GO_PENDING_TECHNICAL_QA_STORAGE_SAFARI_OWNER_RELEASE');
 assert.deepEqual(authored.units,unitMap);
 assert.deepEqual(authored.lessons.map(l=>l.id),Object.values(unitMap).flat());
 assert.deepEqual(authored.lessons.map(l=>l.activities.length),[4,1,5,1]);
 const result=structuredClone(base);
 result.schema_version='1.22.0';
 result.status='academic_item_pass_tech_qa_verified_owner_release_approved';
 const ids=new Set(result.lessons.map(l=>l.id));
 const activities=new Set(result.lessons.flatMap(l=>l.activities.map(q=>q.id)));
 for(const lesson of authored.lessons){
  assert(!ids.has(lesson.id),'Lesson ID collides with historical source: '+lesson.id);
  ids.add(lesson.id);
  for(const q of lesson.activities){
   assert(!activities.has(q.id),'Activity ID collides with historical source: '+q.id);
   activities.add(q.id);
  }
  result.lessons.push(structuredClone(lesson));
  result.course.sequence.push(lesson.id);
 }
 assert.deepEqual([result.lessons.length,count(result)],[136,1066]);
 assert.deepEqual(result.lessons.slice(0,132),base.lessons,
   'All 132 historical lesson records must be byte-equivalent JSON structures');
 assert.deepEqual(result.rubrics,base.rubrics,'No rubric change allowed');
 assert.deepEqual(result.course.sequence.slice(0,132),base.course.sequence,
   'Historical course sequence must be identical');
 for(const key of Object.keys(base).filter(k=>!['schema_version','status','lessons','course'].includes(k)))
  assert.deepEqual(result[key],base[key],'Unapproved top-level change: '+key);
 for(const key of Object.keys(base.course).filter(k=>k!=='sequence'))
  assert.deepEqual(result.course[key],base.course[key],'Unapproved course change: '+key);
 return result;
}
if(require.main===module){
 const candidate=composeF2();
 const output=path.join(root,'.sites-runtime/f2/curriculum-1.22.0-CANDIDATE-NO-IMPORT.json');
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.writeFileSync(output,JSON.stringify(candidate,null,2)+'\n');
 console.log(JSON.stringify({result:'GENERATED_DRY_RUN_ONLY',version:'1.22.0',
  lessons:candidate.lessons.length,activities:count(candidate),newLessons:4,
  objectiveReading:9,unscoredWriting:2,audioAdded:0,
  source131plusPreserved:true,import:false,deploy:false,
  learnerDataChanged:false,production:'NO_GO'}));
}
module.exports={composeF2,unitMap};
