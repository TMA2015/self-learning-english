// Batch 02 self-contained source QA. This is not a substitute for independent language review.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,'content',p),'utf8'));
const previous=read('curriculum-1.1.0-candidate.json');
const next=read('curriculum-1.2.0-candidate.json');
const evidence=read('reviews/batch02-reading-evidence.json');
const academic=fs.readFileSync(path.join(root,'domain/academic.ts'),'utf8');
const allowed=new Set([...academic.matchAll(/'([a-z]+\.[a-z_]+)'\s*:/g)].map(m=>m[1]));
const prevById=new Map(previous.lessons.map(l=>[l.id,l]));
const nextById=new Map(next.lessons.map(l=>[l.id,l]));
const newUnits=next.lessons.filter(l=>!prevById.has(l.id));
const tasks=next.lessons.flatMap(l=>l.activities);
const newTasks=newUnits.flatMap(l=>l.activities);
const identifiers=tasks.map(t=>t.id);
const norm=s=>s.toLowerCase().replace(/[’]/g,"'").trim().replace(/\s+/g,' ').replace(/[.!?]+$/g,'');
assert.equal(previous.schema_version,'1.1.0');
assert.equal(next.schema_version,'1.2.0');
assert.equal(next.package_id,previous.package_id);
assert.equal(next.lessons.length,29);
assert.equal(newUnits.length,8);
assert.equal(tasks.length,190);
assert.equal(newTasks.length,64);
assert.equal(new Set(identifiers).size,tasks.length);
assert.equal(new Set(next.lessons.map(l=>l.id)).size,next.lessons.length);
assert.deepEqual(new Set(next.course.sequence),new Set(next.lessons.map(l=>l.id)));
assert.equal(next.course.sequence.length,next.lessons.length);
assert.deepEqual(next.integrated_journey,previous.integrated_journey);
assert.deepEqual(next.rubrics,previous.rubrics);
for(const [id,old] of prevById)assert.deepEqual(nextById.get(id),old,'Previous lesson changed: '+id);
const newIds=['GRA-A1-04','GRA-A1-05','GRA-A1-06','VOC-A1-03','REA-A1-02','REA-A2-03','WRI-A1-02','WRI-A2-02'];
assert.deepEqual(new Set(newUnits.map(l=>l.id)),new Set(newIds));
for(const lesson of newUnits){
 assert(['A1','A2'].includes(lesson.cefr_target),lesson.id);
 assert(lesson.objectives.length>=2&&lesson.objectives.length<=5,'Outcomes '+lesson.id);
 assert(lesson.explanation.en.length>=100&&lesson.explanation.vi.length>=35,'Bilingual explanation '+lesson.id);
 assert(lesson.examples.length>=4,'Worked examples '+lesson.id);
 assert(lesson.activities.length>=5&&lesson.activities.length<=10,'Practice range '+lesson.id);
 for(const q of lesson.activities){
  assert(q.id.startsWith(lesson.id+'-'),'Stable question ID '+q.id);
  assert(q.feedback.explanation_en?.length>=25||q.feedback.pending_message?.length>=25,'Actionable feedback '+q.id);
  assert(q.skill_tags.length>0&&q.skill_tags.every(t=>allowed.has(t)&&t.startsWith(lesson.module+'.')),'Unknown/mismatched tags '+q.id);
  if(q.type==='single_choice'){
   assert(q.options.length===4,'Expected four choices '+q.id);
   assert(new Set(q.options.map(x=>x.id)).size===4,'Duplicate option IDs '+q.id);
   assert(new Set(q.options.map(x=>norm(x.text))).size===4,'Duplicate option texts '+q.id);
   assert(q.options.some(x=>x.id===q.answer.correct_option_id),'Invalid correct option '+q.id);
   assert.equal(q.evidence_weight,1);
  }else if(q.type==='short_answer'){
   assert(q.prompt.includes('___'),'Missing blank '+q.id);
   assert(q.answer.accepted_answers.length>=1,'Missing accepted answer '+q.id);
   assert(new Set(q.answer.accepted_answers.map(norm)).size===q.answer.accepted_answers.length,'Duplicate accepted answer '+q.id);
   assert(q.answer.accepted_answers.every(a=>a.trim()),'Blank accepted answer '+q.id);
   const pre=q.prompt.split('___')[0].replace(/^.*Complete:\s*/s,'').trim();
   const match=pre.match(/(?:^|[.!?]\s*)(I|We|He|She|It|They|There|My parents|The library|My brother)\s*$/i);
   if(match)assert(q.answer.accepted_answers.every(a=>!norm(a).startsWith(norm(match[1])+' ')),'Repeated printed subject '+q.id);
   assert.equal(q.evidence_weight,1);
  }else{
   assert.equal(q.type,'extended_response','Unsupported task '+q.id);
   assert.equal(q.answer,null);
   assert.equal(q.evidence_weight,0);
   assert(next.rubrics[q.rubric_id],'Missing review rubric '+q.id);
   assert(q.word_range_guidance.not_a_quality_score,'Writing length cannot become score '+q.id);
  }
 }
 if(lesson.module==='reading'){
  assert(lesson.reading_asset?.display_to_learner===true&&lesson.reading_asset.body.length>=400,'Passage '+lesson.id);
  const refs=evidence.lesson_evidence[lesson.id];
  assert(refs,'Missing evidence map '+lesson.id);
  assert.deepEqual(new Set(Object.keys(refs)),new Set(lesson.activities.map(q=>q.id)),'Incomplete evidence map '+lesson.id);
  for(const [id,quote] of Object.entries(refs)){
   assert(lesson.reading_asset.body.includes(quote),'Evidence quote absent for '+id+': '+quote);
  }
 }
 if(lesson.module==='writing'){
  assert.equal(lesson.activities.filter(q=>q.type==='extended_response').length,1,'One final reviewed draft '+lesson.id);
  assert(lesson.activities.some(q=>q.skill_tags.includes('writing.task_understanding')),'Task-analysis practice '+lesson.id);
 }
}
assert.equal(newTasks.filter(q=>q.type==='single_choice').length,48);
assert.equal(newTasks.filter(q=>q.type==='short_answer').length,14);
assert.equal(newTasks.filter(q=>q.type==='extended_response').length,2);
assert(Buffer.byteLength(JSON.stringify(next),'utf8')<1000000,'Candidate exceeds browser upload contract');
console.log(JSON.stringify({result:'PASS',version:next.schema_version,newLessons:8,newTasks:64,allLessons:29,allTasks:190,readingEvidenceLinks:16,oldLessonsUnchanged:true}));
