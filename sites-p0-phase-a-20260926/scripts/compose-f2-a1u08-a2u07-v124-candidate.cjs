'use strict';
/** Reviewed A1-U08/A2-U07 cumulative v1.24 candidate; dry-run only. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const baseline=require('../content/curriculum-1.23.0-candidate.json');
const authored=require('../content/batches/f2-a1u08-a2u07-four-lessons-v124-draft.json');
const unitMap={'A1-U08':['REA-A1-07','WRI-A1-07'],'A2-U07':['REA-A2-10','WRI-A2-09']};
const count=p=>p.lessons.flatMap(l=>l.activities).length;
function composeF2V124(){
 assert.equal(baseline.schema_version,'1.23.0');
 assert.deepEqual([baseline.lessons.length,count(baseline)],[138,1072]);
 assert.equal(authored.packet_id,'SLE-F2-A1U08-A2U07-AUTHORED-20261109-R1');
 assert.equal(authored.review_scope,'AUTHORED_CONTENT_ITEM_LEVEL');
 assert.equal(authored.academic_disposition,'GO_FOR_MACHINE_SCHEMA_DRAFT');
 assert.equal(authored.production,'NO_GO_PENDING_TECHNICAL_CI_AND_OWNER_RELEASE');
 assert.deepEqual(authored.unit_assignments,unitMap);
 assert.deepEqual(authored.lessons.map(l=>l.id),Object.values(unitMap).flat());
 assert.deepEqual(authored.lessons.map(l=>l.activities.length),[5,1,6,1]);
 const next=structuredClone(baseline);
 next.schema_version='1.24.0';
 next.status='notebooklm_r1_pass_a1u08_a2u07_machine_draft_no_release';
 const ids=new Set(baseline.lessons.map(l=>l.id));
 const qids=new Set(baseline.lessons.flatMap(l=>l.activities.map(q=>q.id)));
 for(const l of authored.lessons){
  assert(!ids.has(l.id),'Duplicate lesson ID '+l.id);ids.add(l.id);
  for(const q of l.activities){assert(!qids.has(q.id),'Duplicate activity ID '+q.id);qids.add(q.id)}
  next.lessons.push(structuredClone(l));next.course.sequence.push(l.id);
 }
 assert.deepEqual([next.lessons.length,count(next)],[142,1085]);
 assert.deepEqual(next.lessons.slice(0,138),baseline.lessons,'138 released lessons must remain unchanged');
 assert.deepEqual(next.course.sequence.slice(0,138),baseline.course.sequence);
 assert.deepEqual(next.rubrics,baseline.rubrics,'Historical rubrics immutable');
 for(const k of Object.keys(baseline).filter(k=>!['schema_version','status','lessons','course'].includes(k)))
  assert.deepEqual(next[k],baseline[k],'Unapproved top-level modification '+k);
 for(const k of Object.keys(baseline.course).filter(k=>k!=='sequence'))
  assert.deepEqual(next.course[k],baseline.course[k],'Unapproved course modification '+k);
 return next;
}
if(require.main===module){
 const next=composeF2V124();
 const target=path.join(root,'.sites-runtime/f2-v124/curriculum-v1.24.0-DRY-RUN-NO-IMPORT.json');
 fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,JSON.stringify(next,null,2)+'\n');
 console.log(JSON.stringify({result:'DRY_RUN_ONLY',lessons:142,activities:1085,readingObjective:11,unscoredWriting:2,newMP3:0,liveImport:false,deploy:false}));
}
module.exports={composeF2V124,unitMap};
