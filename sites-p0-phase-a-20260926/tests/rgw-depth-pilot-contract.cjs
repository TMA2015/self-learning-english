'use strict';
/** Exact immutable source and read-only reviewed R/G/W instructional overlay. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('content/curriculum-1.25.0-candidate.json');
const bytes=Buffer.from(source);
const gitBlob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');
assert.equal(gitBlob,'eb6016669023b4a4d75df7278408da1e60894369','Do not mutate imported v1.25.0');
const curriculum=JSON.parse(source),overlay=JSON.parse(read('content/rwg-depth-pilot-r1.json'));
assert.equal(curriculum.schema_version,'1.25.0');
assert.equal(curriculum.lessons.length,154);
assert.equal(overlay.source_curriculum_version,'1.25.0');
assert.equal(overlay.source_curriculum_git_blob,gitBlob);
assert.equal(overlay.packet_id,'SLE-RGW-DEPTH-PILOT-R1-20261113');
assert.equal(overlay.review.academic_verdict,'PASS');
assert.equal(overlay.review.engineering_release,'NO_GO_PENDING_TECHNICAL_QA_AND_OWNER');
assert.equal(overlay.assessment_mutations,false);
const inventory={'REA-B1-03':[10,0,'reading'],'GRA-B1-05':[10,0,'grammar'],'WRI-B1-05':[7,1,'writing']};
assert.deepEqual(Object.keys(overlay.lessons).sort(),Object.keys(inventory).sort());
for(const [id,[objectives,free,module]] of Object.entries(inventory)){
 const l=curriculum.lessons.find(x=>x.id===id),o=overlay.lessons[id];
 assert(l&&o&&l.module===module);
 assert.equal(o.module,module);
 assert.equal(o.cefr_target,l.cefr_target);
 assert.equal(o.scored_item_count,objectives);
 assert.equal(o.unscored_item_count,free);
 assert.equal(l.activities.length,objectives+free);
 assert.equal(l.activities.filter(a=>a.evidence_weight===1&&a.answer!==null).length,objectives);
 assert.equal(l.activities.filter(a=>a.evidence_weight===0&&a.answer===null).length,free);
 assert(o.cards.length>=3&&o.model.situation.length>35&&o.model.thinking.length>60);
 assert(o.model.situation!==l.reading_asset?.body,'Never expose assessed source as independent model');
 assert(!o.model.situation.includes('optional lunchtime reading circle'),'No scored Writing prompt in model');
 assert(!o.model.situation.includes('The lights are on and their car is outside'),'No scored Grammar stem in model');
}
const writing=curriculum.lessons.find(x=>x.id==='WRI-B1-05');
assert.equal(writing.activities[7].id,'WRI-B1-05-Q8');
assert.equal(writing.activities[7].answer,null);
assert.equal(writing.activities[7].evidence_weight,0);
const grammar=curriculum.lessons.find(x=>x.id==='GRA-B1-05');
assert.deepEqual(grammar.activities.find(x=>x.id==='GRA-B1-05-Q6').answer.accepted_answers,['might','may','could']);
assert.equal(Object.keys(overlay.recovery_by_item).length,20);
for(const id of Object.keys(overlay.recovery_by_item)){
 assert(/^(?:REA-B1-03|GRA-B1-05)-Q(?:10|[1-9])$/.test(id),id);
 assert(curriculum.lessons.some(l=>l.activities.some(a=>a.id===id&&a.evidence_weight===1)));
}
const ui=read('app/rgw-depth-pilot.tsx'),foundation=read('app/foundation.tsx');
const tip=read('domain/foundation-recovery-tip.ts'),review=read('domain/post-lesson-review.ts');
assert(ui.includes('version===VERSION?LESSONS[lessonId]:undefined'),'Version pin required');
assert(ui.includes('Optional self-practice: not submitted or graded.'));
assert(!/correct_option_id|accepted_answers|fetch\(|localStorage|indexedDB|\bsubmit\(/.test(ui));
assert(!Object.values(overlay.lessons).some(l=>/correct_option_id|accepted_answers/.test(JSON.stringify(l))));
assert(foundation.includes('<RgwDepthTeaching lessonId={lesson.id} version={loadedLessonVersion.current}/>'));
assert(tip.includes('version===rgwPilot.source_curriculum_version'));
assert(review.includes("if(attempt.status==='started'"),'Advice must be post-submit only');
assert(!Object.keys(overlay.recovery_by_item).some(k=>k.startsWith('WRI-')),'Open Writing must not be auto graded');
console.log(JSON.stringify({result:'PASS',gate:'RGW_DEPTH_R1_SOURCE_AND_NO_LEAKAGE',
 sourceBlobSha:gitBlob,lessons:3,originalActivities:28,objectiveItems:27,
 openWritingItems:1,recoveryRules:20,scoreWrites:0,liveDeployment:false}));
