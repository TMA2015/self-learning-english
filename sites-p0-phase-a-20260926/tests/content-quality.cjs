// Batch 01 content lint: pure Node.js; no Site credentials, API, or learner records.
// Structural checks are not a replacement for an independent teacher's full answer review.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,'content',name),'utf8'));
const seed=read('academic-seed-v1.json');
const content=read('curriculum-1.1.0-candidate.json');
const errors=[];
const check=(ok,message)=>{if(!ok)errors.push(message)};
const norm=s=>s.toLowerCase().trim().replace(/[’]/g,"'").replace(/\s+/g,' ').replace(/[.!?]+$/g,'');
const domains={GRA:'grammar',VOC:'vocabulary',REA:'reading',LIS:'listening',WRI:'writing',SPE:'speaking',PRO:'pronunciation'};
const seedIds=new Set(seed.lessons.map(l=>l.id));
const lessonIds=new Set(),questionIds=new Set();
check(content.schema_version==='1.1.0','Expected first real curriculum version 1.1.0');
check(content.package_id===seed.package_id,'Cumulative package ID must remain stable');
check(content.lessons.length===21,'Expected 13 existing plus 8 new lessons');
check(content.lessons.filter(l=>!seedIds.has(l.id)).length===8,'Expected eight new lessons');
check(content.course.sequence.length===content.lessons.length,'Full course sequence must include all lessons');
check(new Set(content.course.sequence).size===content.lessons.length,'Course sequence must not duplicate IDs');
check(content.integrated_journey.steps.length===7,'Seven-domain starter route must remain valid');
check(content.rubrics['RUBRIC-WRITING-A1']?.criteria?.length===5,'A1 Writing must have a real review rubric');
for(const lesson of content.lessons){
 check(!lessonIds.has(lesson.id),'Duplicate lesson ID '+lesson.id);lessonIds.add(lesson.id);
 check(domains[lesson.id.slice(0,3)]===lesson.module,'Lesson ID/module mismatch '+lesson.id);
 check(/^(GRA|VOC|REA|LIS|WRI|SPE|PRO)-(A1|A2|B1|B2)-\d{2}$/.test(lesson.id),'Bad lesson ID '+lesson.id);
 check(lesson.activities.length>=1&&lesson.activities.length<=24,'Invalid question count '+lesson.id);
 check(lesson.objectives?.length>=1&&lesson.explanation?.en?.trim()&&lesson.explanation?.vi?.trim(),'Missing learning objectives or bilingual explanation '+lesson.id);
 check(lesson.examples?.length>=2,'Too few worked examples '+lesson.id);
 if(lesson.module==='reading'){
  check(lesson.reading_asset?.display_to_learner===true&&lesson.reading_asset?.body?.trim(),'Missing displayed passage '+lesson.id);
 }
 if(lesson.module==='listening'){
  check(lesson.audio_asset?.source_text?.trim()&&lesson.audio_asset?.requires_real_playback&&lesson.audio_asset?.transcript_reveal==='after_submission','Listening needs genuine playback contract '+lesson.id);
 }
 for(const q of lesson.activities){
  check(!questionIds.has(q.id),'Duplicate task ID '+q.id);questionIds.add(q.id);
  check(q.id.startsWith(lesson.id+'-'),'Task does not belong to its lesson '+q.id);
  check(q.prompt?.trim()&&q.feedback&&(q.feedback.explanation_en?.trim()||q.feedback.pending_message?.trim()),'Missing question or feedback '+q.id);
  check(q.skill_tags?.length&&q.skill_tags.every(tag=>tag.startsWith(lesson.module+'.')),'Missing or mismatched skill tags '+q.id);
  if(q.type==='single_choice'){
   const optionIds=q.options?.map(o=>o.id)??[],texts=q.options?.map(o=>norm(o.text))??[];
   check(optionIds.length>=2&&optionIds.length<=6,'Invalid number of choices '+q.id);
   check(new Set(optionIds).size===optionIds.length,'Duplicate option IDs '+q.id);
   check(new Set(texts).size===texts.length,'Duplicate choices after normalization '+q.id);
   check(optionIds.includes(q.answer?.correct_option_id),'Correct answer option is missing '+q.id);
   check(q.evidence_weight===1,'Objective MCQ must carry weight 1 '+q.id);
  }else if(q.type==='short_answer'){
   const answers=q.answer?.accepted_answers??[];
   check(q.prompt.includes('___'),'Short-answer prompt needs an explicit blank '+q.id);
   check(answers.length>0&&answers.every(a=>a.trim()),'No accepted gap answers '+q.id);
   check(new Set(answers.map(norm)).size===answers.length,'Duplicate accepted variants '+q.id);
   const before=(q.prompt.split('___')[0]??'').replace(/^.*Complete:\s*/s,'').trim();
   // Flag exact repeated printed subjects; do not silently rewrite a learner answer.
   const repeated=before.match(/(?:^|[.!?]\s*)(I|We|He|She|It|They|My parents|My brother|The library|Tom|Your teacher)\s*$/i);
   if(repeated)check(!answers.some(a=>norm(a).startsWith(norm(repeated[1])+' ')),'Accepted response repeats printed subject '+q.id);
   check(q.evidence_weight===1,'Objective gap must carry weight 1 '+q.id);
  }else if(q.type==='extended_response'){
   check(q.answer===null&&q.evidence_weight===0,'Open response cannot get automatic correctness score '+q.id);
   check(!!content.rubrics[q.rubric_id],'Missing human review rubric '+q.id);
   check(q.feedback.pending_message?.trim(),'Open response must state review status '+q.id);
  }else errors.push('Unsupported question type '+q.id);
 }
}
check(seed.lessons.every(l=>lessonIds.has(l.id)),'Original 13 demo IDs must remain available');
check(content.course.sequence.every(id=>lessonIds.has(id)),'Course references missing lesson');
check(content.integrated_journey.steps.every(id=>lessonIds.has(id)),'Journey references missing lesson');
check(questionIds.size===126,'Expected 126 tasks in the first cumulative package');
const fresh=content.lessons.filter(l=>!seedIds.has(l.id)).flatMap(l=>l.activities);
check(fresh.length===67,'Expected 67 new tasks in Batch 01');
check(content.lessons.find(l=>l.id==='GRA-A1-01')?.activities.find(q=>q.id==='GRA-A1-01-Q10')?.answer?.accepted_answers?.join('|')==='am','Do not repeat I in the A1 be gap');
check(content.lessons.find(l=>l.id==='WRI-A1-01')?.activities.some(q=>q.type==='extended_response'&&q.rubric_id==='RUBRIC-WRITING-A1'),'Writing needs review-only production');
if(errors.length){console.error('FAIL: '+errors.length+' content checks\n'+errors.join('\n'));process.exitCode=1}
else console.log(JSON.stringify({result:'PASS',version:content.schema_version,lessons:lessonIds.size,newLessons:8,questions:questionIds.size,newQuestions:fresh.length,reviewOnlyOpenResponse:true}));
