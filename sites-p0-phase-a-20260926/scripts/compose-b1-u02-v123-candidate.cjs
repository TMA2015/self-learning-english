'use strict';
/** B1-U02 academic v1.23 candidate — additive dry-run ONLY; never imports/deploys. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const base=require('../content/curriculum-1.22.0-candidate.json');
const authored=require('../content/batches/b1-u02-claim-evidence-2-lessons-v123-draft.json');
const unitMap={'B1-U02':['REA-B1-08','WRI-B1-09']};
const count=x=>x.lessons.flatMap(l=>l.activities).length;
function composeB1U02(){
 assert.equal(base.schema_version,'1.22.0');
 assert.deepEqual([base.lessons.length,count(base)],[136,1066]);
 assert.equal(authored.packet_id,'SLE-F2-B1U02-CLAIM-EVIDENCE-AUTHORED-20261109-R1');
 assert.equal(authored.review_scope,'AUTHORED_CONTENT_ITEM_LEVEL');
 assert.equal(authored.academic_disposition,'GO_FOR_MACHINE_SCHEMA_DRAFT');
 assert.equal(authored.production,'NO_GO_PENDING_CANDIDATE_COMPOSITION_CI_AND_RELEASE');
 assert.deepEqual(authored.unit_assignment,unitMap);
 assert.deepEqual(authored.lessons.map(l=>l.id),unitMap['B1-U02']);
 assert.deepEqual(authored.lessons.map(l=>l.activities.length),[5,1]);
 const next=structuredClone(base);
 next.schema_version='1.23.0';
 next.status='academic_b1u02_r1_pass_machine_draft_qa_pending_no_release';
 const existing=new Set(next.lessons.map(l=>l.id));
 const existingItems=new Set(next.lessons.flatMap(l=>l.activities.map(q=>q.id)));
 for(const l of authored.lessons){
  assert(!existing.has(l.id),'Duplicate lesson: '+l.id);
  existing.add(l.id);
  for(const q of l.activities){
   assert(!existingItems.has(q.id),'Duplicate question: '+q.id);
   existingItems.add(q.id);
  }
  next.lessons.push(structuredClone(l));
  next.course.sequence.push(l.id);
 }
 assert.deepEqual([next.lessons.length,count(next)],[138,1072]);
 assert.deepEqual(next.lessons.slice(0,136),base.lessons,'All prior 136 lesson records unchanged');
 assert.deepEqual(next.course.sequence.slice(0,136),base.course.sequence,'All original lesson ordering unchanged');
 assert.deepEqual(next.rubrics,base.rubrics,'Historical rubrics unchanged');
 for(const key of Object.keys(base).filter(k=>!['schema_version','status','lessons','course'].includes(k)))
  assert.deepEqual(next[key],base[key],'Unapproved top-level modification: '+key);
 for(const key of Object.keys(base.course).filter(k=>k!=='sequence'))
  assert.deepEqual(next.course[key],base.course[key],'Unapproved course modification: '+key);
 return next;
}
if(require.main===module){
 const result=composeB1U02();
 const output=path.join(root,'.sites-runtime/b1u02-v123/curriculum-1.23.0-DRY-RUN-NO-IMPORT.json');
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({result:'GENERATED_DRY_RUN_ONLY',version:'1.23.0',
 lessons:result.lessons.length,activities:count(result),newLessons:2,newReading:5,
 unscoredWriting:1,newAudio:0,historyUnchanged:true,import:false,deploy:false}));
}
module.exports={composeB1U02,unitMap};
