'use strict';
// Portable, source-only Curriculum Blueprint v1 helpers. Not wired into a live Site.
const unique=values=>[...new Set(values)];
const fail=message=>{throw new Error(message)};
function indexOfLessons(blueprint){
 const rows=blueprint?.lesson_catalog;
 if(!Array.isArray(rows))fail('Missing lesson_catalog');
 const ids=rows.map(x=>x.id);
 if(new Set(ids).size!==ids.length)fail('Duplicate canonical lesson id');
 return new Map(rows.map(x=>[x.id,x]));
}
function assertSource(blueprint){
 if(blueprint?.format!=='g-learning.curriculum-blueprint'||blueprint?.schema_version!==1)fail('Invalid blueprint schema');
 if(!blueprint?.source?.package_id||!blueprint?.source?.content_version)fail('Missing pinned content identity');
 if(blueprint.status!=='architecture_prototype_not_live_not_importable')fail('This prototype must remain marked not importable');
}
function canonicalLessonKey(blueprint,lessonId){
 assertSource(blueprint);
 const row=indexOfLessons(blueprint).get(lessonId);
 if(!row)fail('Unknown lesson '+lessonId);
 const ref=row.content_ref;
 if(ref.package_id!==blueprint.source.package_id||ref.content_version!==blueprint.source.content_version||ref.lesson_id!==lessonId)fail('Unpinned lesson ref '+lessonId);
 return ref.package_id+'@'+ref.content_version+':'+ref.lesson_id;
}
function validateBlueprint(blueprint,candidate,coverage){
 const errors=[];
 const check=(condition,message)=>{if(!condition)errors.push(message)};
 try{assertSource(blueprint)}catch(e){return [e.message]}
 const items=blueprint.lesson_catalog,byId=new Map(items.map(x=>[x.id,x]));
 const sourceLessons=new Map(candidate.lessons.map(x=>[x.id,x]));
 const sourceGraph=new Map(coverage.nodes.map(x=>[x.lesson_id,x]));
 const concepts=new Set(blueprint.concept_registry.map(x=>x.concept_id));
 const skills=new Set(blueprint.skill_registry.map(x=>x.skill_id));
 check(candidate.schema_version===blueprint.source.content_version,'Content version mismatch');
 check(candidate.package_id===blueprint.source.package_id,'Content package mismatch');
 check(items.length===candidate.lessons.length&&byId.size===items.length,'Lesson count/uniqueness mismatch');
 check(concepts.size===blueprint.concept_registry.length,'Duplicate concept id');
 check(skills.size===blueprint.skill_registry.length,'Duplicate skill id');
 for(const row of items){
  const source=sourceLessons.get(row.id),node=sourceGraph.get(row.id);
  check(!!source&&!!node,'Missing canonical source '+row.id);
  if(!source||!node)continue;
  try{canonicalLessonKey(blueprint,row.id)}catch(e){errors.push(e.message)}
  check(row.module===source.module&&row.level_target===source.cefr_target,'Module/level mismatch '+row.id);
  check(JSON.stringify(row.concept_ids)===JSON.stringify(node.concepts.map(x=>'concept.'+x)),'Concept mapping drift '+row.id);
  check(JSON.stringify(row.prerequisite_lesson_ids)===JSON.stringify(node.prerequisite_lesson_ids),'Prerequisite drift '+row.id);
  check(JSON.stringify(row.skill_ids)===JSON.stringify(unique(source.activities.flatMap(q=>q.skill_tags)).sort()),'Skill mapping drift '+row.id);
  check(row.concept_ids.every(id=>concepts.has(id))&&row.skill_ids.every(id=>skills.has(id)),'Unknown concept/skill '+row.id);
  const objective=source.activities.filter(a=>a.evidence_weight===1).map(a=>a.id);
  const review=source.activities.filter(a=>a.type==='extended_response').map(a=>a.id);
  check(JSON.stringify(row.assessment.objective_activity_ids)===JSON.stringify(objective),'Objective activity drift '+row.id);
  check(JSON.stringify(row.assessment.review_required_activity_ids)===JSON.stringify(review),'Review-required activity drift '+row.id);
  check(row.prerequisite_lesson_ids.every(id=>byId.has(id)),'Unknown prerequisite '+row.id);
 }
 try{for(const id of byId.keys())orderWithPrerequisites(blueprint,[id])}catch(e){errors.push(e.message)}
 const trackIds=new Set();
 for(const track of blueprint.curriculum_manifests){
  check(!trackIds.has(track.curriculum_id),'Duplicate curriculum id '+track.curriculum_id);trackIds.add(track.curriculum_id);
  check(new Set(track.lesson_ids).size===track.lesson_ids.length,'Duplicate lesson in track '+track.curriculum_id);
  check(track.lesson_ids.every(id=>byId.has(id)),'Unknown track reference '+track.curriculum_id);
  const seen=new Set();
  for(const id of track.lesson_ids){const row=byId.get(id);if(!row)continue;
   check(row.prerequisite_lesson_ids.every(p=>seen.has(p)),'Prerequisite order mismatch '+track.curriculum_id+' / '+id);
   seen.add(id)}
 }
 check(blueprint.policy.tracks_reference_lessons_not_copy_payloads===true,'Content copy policy changed');
 check(blueprint.evidence_identity_contract.track_id_not_part_of_identity===true,'Attempt identity must be track-independent');
 check(blueprint.policy.no_generation_of_unreviewed_assessed_items===true,'Unreviewed assessments not allowed');
 return unique(errors);
}
function orderWithPrerequisites(blueprint,selectedLessonIds){
 assertSource(blueprint);
 const byId=indexOfLessons(blueprint),complete=[],done=new Set(),visiting=new Set();
 function visit(id){
  const row=byId.get(id);if(!row)fail('Unknown lesson '+id);
  if(done.has(id))return;
  if(visiting.has(id))fail('Prerequisite cycle at '+id);
  visiting.add(id);for(const prior of row.prerequisite_lesson_ids)visit(prior);
  visiting.delete(id);done.add(id);complete.push(id);
 }
 for(const id of unique(selectedLessonIds))visit(id);
 return complete;
}
function composeFromLessons(blueprint,selectedLessonIds){
 if(!Array.isArray(selectedLessonIds)||!selectedLessonIds.length)fail('Select at least one lesson');
 const order=orderWithPrerequisites(blueprint,selectedLessonIds);
 return {status:'draft_not_published',lesson_ids:order,requested_lesson_ids:unique(selectedLessonIds),inserted_prerequisite_lesson_ids:order.filter(id=>!selectedLessonIds.includes(id)),source:blueprint.source};
}
function composeFromSkills(blueprint,skillIds,{levels=['A1','A2']}={}){
 const allowed=new Set(blueprint.skill_registry.map(x=>x.skill_id));
 if(!Array.isArray(skillIds)||!skillIds.length||skillIds.some(x=>!allowed.has(x)))fail('Unknown or empty skill selection');
 const byId=indexOfLessons(blueprint);
 const selected=[],missing=[];
 for(const skill of unique(skillIds)){
  const choices=[...byId.values()].filter(x=>levels.includes(x.level_target)&&x.skill_ids.includes(skill));
  if(!choices.length){missing.push(skill);continue}
  // Prototype heuristic only: use the earliest level and stable ID, never generate new assessed content.
  choices.sort((a,b)=>levels.indexOf(a.level_target)-levels.indexOf(b.level_target)||a.id.localeCompare(b.id));
  selected.push(choices[0].id);
 }
 if(missing.length)return {status:'coverage_gap_no_generated_assessment',missing_skill_ids:missing,lesson_ids:[],source:blueprint.source};
 return {...composeFromLessons(blueprint,selected),requested_skill_ids:unique(skillIds),planning_note:'Deterministic prototype: educator review required before publishing a learner pathway.'};
}
function projectTrack(blueprint,curriculumId,attempts){
 assertSource(blueprint);
 const track=blueprint.curriculum_manifests.find(x=>x.curriculum_id===curriculumId);
 if(!track)fail('Unknown track '+curriculumId);
 // The current attempt store is external; no migration, mutation or duplicate evidence is performed here.
 const relevant=attempts.filter(a=>a.packageId===blueprint.source.package_id&&a.version===blueprint.source.content_version);
 const trackIds=new Set(track.lesson_ids);
 const latest=new Map(),evidenceIds=new Set();
 for(const attempt of relevant){
  if(!trackIds.has(attempt.lessonId)||!attempt.id)continue;
  const prev=latest.get(attempt.lessonId);
  const at=attempt.submittedAt??attempt.createdAt??0;
  if(!prev||at>(prev.submittedAt??prev.createdAt??0))latest.set(attempt.lessonId,attempt);
  for(const ev of attempt.evidence??[])if(ev.id)evidenceIds.add(ev.id);
 }
 const lessons=track.lesson_ids.map(id=>{
  const a=latest.get(id);
  return {lesson_id:id,canonical_lesson_key:canonicalLessonKey(blueprint,id),
   latest_attempt_id:a?.id??null,
   state:!a?'not_started':a.status==='started'?'draft':a.status==='pending_review'?'review_pending':a.status==='approved'?'reviewed':a.status==='scored'?'submitted_scored':a.status==='unassessed'?'submitted_unassessed':'unknown',
   assessed:!!a&&['approved','scored'].includes(a.status),
   completed_proves_cefr:false};
 });
 return {curriculum_id:curriculumId,lesson_progress:lessons,unique_existing_evidence_count:evidenceIds.size,
  data_source:'external_version_pinned_attempt_projection',cross_version_bridge:'not_performed'};
}
module.exports={canonicalLessonKey,validateBlueprint,orderWithPrerequisites,composeFromLessons,composeFromSkills,projectTrack};
