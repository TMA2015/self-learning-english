'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const blueprint=read('content/curriculum-blueprint-v1.json');
const content=read('content/curriculum-1.3.0-candidate.json');
const coverage=read('content/curriculum-coverage-1.3.0-candidate.json');
const prod=read('content/releases/curriculum-1.2.0-production-import.json');
const {canonicalLessonKey,validateBlueprint,orderWithPrerequisites,composeFromLessons,composeFromSkills,projectTrack}=require('../domain/curriculum-blueprint-v1.cjs');

assert.deepEqual(validateBlueprint(blueprint,content,coverage),[]);
assert.equal(blueprint.status,'architecture_prototype_not_live_not_importable');
assert.equal(blueprint.lesson_catalog.length,36);
assert.equal(blueprint.concept_registry.length,65);
assert.ok(blueprint.concept_registry.some(x=>x.concept_id==='concept.reading.detail'));
assert.ok(blueprint.concept_registry.some(x=>x.concept_id==='concept.listening.detail'));
assert.equal(blueprint.skill_registry.length,44);
assert.equal(blueprint.curriculum_manifests.length,2);
assert.equal(content.lessons.length,36);
assert.equal(content.lessons.reduce((n,l)=>n+l.activities.length,0),251);
assert.ok(prod.lessons.every(old=>JSON.stringify(old)===JSON.stringify(content.lessons.find(l=>l.id===old.id))),'29 prior production lessons must be identical');

const [grammar,communication]=blueprint.curriculum_manifests;
assert.equal(grammar.lesson_ids.length,13);
assert.equal(communication.lesson_ids.length,13);
assert.deepEqual([...grammar.lesson_ids].sort(),[...communication.lesson_ids].sort(),'the two pedagogic routes reuse identical canonical lesson refs');
assert.notDeepEqual(grammar.lesson_ids,communication.lesson_ids,'the two pedagogic routes must differ in order');
const keys=grammar.lesson_ids.map(id=>canonicalLessonKey(blueprint,id));
assert.deepEqual(keys.slice().sort(),communication.lesson_ids.map(id=>canonicalLessonKey(blueprint,id)).sort());
assert.ok(keys.every(id=>id.includes('@1.3.0:')));

const manual=composeFromLessons(blueprint,['WRI-A1-03']);
for(const id of ['WRI-A1-03','WRI-A1-01','GRA-A1-01','GRA-A1-02','GRA-A1-04','GRA-A1-05','VOC-A1-01'])assert.ok(manual.lesson_ids.includes(id),'missing prerequisite '+id);
assert.ok(manual.lesson_ids.indexOf('GRA-A1-05')<manual.lesson_ids.indexOf('WRI-A1-03'));
assert.ok(manual.inserted_prerequisite_lesson_ids.length>=6);
assert.deepEqual(orderWithPrerequisites(blueprint,['WRI-A1-03']),manual.lesson_ids);
assert.throws(()=>composeFromLessons(blueprint,['MISSING-A1-01']),/Unknown lesson/);
const malformed=JSON.parse(JSON.stringify(blueprint));
malformed.lesson_catalog.find(l=>l.id==='GRA-A1-01').prerequisite_lesson_ids=['GRA-A1-03'];
assert.ok(validateBlueprint(malformed,content,coverage).some(s=>/Prerequisite|cycle/i.test(s)),'source graph drift/cycles must fail');
assert.throws(()=>orderWithPrerequisites(malformed,['GRA-A1-03']),/cycle/);

const planner=composeFromSkills(blueprint,['writing.task_understanding'],{levels:['A1']});
assert.equal(planner.status,'draft_not_published');
assert.ok(planner.lesson_ids.some(id=>id.startsWith('WRI-A1-')));
assert.ok(planner.inserted_prerequisite_lesson_ids.length>0);
assert.ok(planner.planning_note.includes('educator review'));
const gap=composeFromSkills(blueprint,['listening.speaker_intention'],{levels:['A1']});
assert.equal(gap.status,'coverage_gap_no_generated_assessment');
assert.deepEqual(gap.lesson_ids,[]);
assert.deepEqual(gap.missing_skill_ids,['listening.speaker_intention']);
assert.throws(()=>composeFromSkills(blueprint,['unknown.skill']),/Unknown or empty skill/);

const sharedKey=canonicalLessonKey(blueprint,'GRA-A1-01');
const attempts=[
{id:'scored-1',packageId:blueprint.source.package_id,version:'1.3.0',lessonId:'GRA-A1-01',status:'scored',createdAt:100,submittedAt:101,evidence:[{id:'evidence-1'},{id:'evidence-1'}]},
{id:'draft-2',packageId:blueprint.source.package_id,version:'1.3.0',lessonId:'WRI-A1-01',status:'started',createdAt:102,evidence:[]},
{id:'review-3',packageId:blueprint.source.package_id,version:'1.3.0',lessonId:'WRI-A1-03',status:'pending_review',createdAt:103,submittedAt:104,evidence:[]},
{id:'prior-version',packageId:blueprint.source.package_id,version:'1.2.0',lessonId:'GRA-A1-01',status:'scored',createdAt:999,submittedAt:999,evidence:[{id:'old-version-evidence'}]},
{id:'out-of-track',packageId:blueprint.source.package_id,version:'1.3.0',lessonId:'GRA-A2-04',status:'scored',createdAt:105,submittedAt:106,evidence:[{id:'evidence-outside'}]}
];
const p1=projectTrack(blueprint,grammar.curriculum_id,attempts),p2=projectTrack(blueprint,communication.curriculum_id,attempts);
function entry(p,id){return p.lesson_progress.find(x=>x.lesson_id===id)}
assert.equal(entry(p1,'GRA-A1-01').canonical_lesson_key,sharedKey);
assert.equal(entry(p2,'GRA-A1-01').canonical_lesson_key,sharedKey);
assert.equal(entry(p1,'GRA-A1-01').latest_attempt_id,'scored-1');
assert.equal(entry(p2,'GRA-A1-01').latest_attempt_id,'scored-1');
assert.equal(entry(p1,'GRA-A1-01').state,'submitted_scored');
assert.equal(entry(p2,'WRI-A1-01').state,'draft');
assert.equal(entry(p1,'WRI-A1-03').state,'review_pending');
assert.equal(entry(p1,'WRI-A1-03').assessed,false);
assert.equal(entry(p2,'WRI-A1-03').assessed,false);
assert.equal(p1.unique_existing_evidence_count,1,'duplicate evidence ID and out-of-track evidence must not inflate count');
assert.equal(p2.unique_existing_evidence_count,1);
assert.deepEqual(attempts[0].evidence,[{id:'evidence-1'},{id:'evidence-1'}],'projection must not mutate source attempts');
assert.equal(p1.cross_version_bridge,'not_performed');
assert.ok(p1.lesson_progress.every(x=>x.completed_proves_cefr===false));
assert.ok(!('attempts' in p1),'prototype must not copy private learner state into content manifest');

const keyItem=content.lessons.find(x=>x.id==='GRA-A2-03').activities.find(x=>x.id==='GRA-A2-03-Q7');
assert.equal(keyItem.answer.correct_option_id,'A');
assert.equal(keyItem.options.find(o=>o.id==='A').text,'some milk');
console.log(JSON.stringify({result:'PASS',sourceVersion:blueprint.source.content_version,concepts:65,skills:44,lessonReferences:36,proofTracks:2,sharedLessons:13,progressReusedAcrossTracks:true,productionContentPreserved:29,independentFinalKeyConfirmation:'PENDING',productionDeployment:'NONE'}));
