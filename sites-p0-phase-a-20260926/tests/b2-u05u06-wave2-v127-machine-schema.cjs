'use strict';
/**
 * Academic B2 U05/U06 reviewed source -> 1.27.0 machine candidate audit.
 * Four independently reviewed pedagogical lessons become eight module-specific
 * canonical records ONLY to prevent mixed scored Reading/uns cored Writing
 * attempts being forced into one pending_review status. No production writes.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'content/review-packets/SLE_B2_U05_U06_WAVE2_NOTEBOOKLM_REVIEW_20261111.md'),'utf8');
const digest=crypto.createHash('sha256').update(source).digest('hex');
assert.equal(digest,'5b0eb90ed047fc20850f291b9ec1483cf626b5fdf3eb8b7e63d0c1df6aa16e81',
 'reviewed original Markdown must be immutable');
const verdict=fs.readFileSync(path.join(root,'content/review-packets/SLE_B2_U05_U06_WAVE2_NOTEBOOKLM_VERDICT_20261111.txt'),'utf8');
for(const required of ['PACKET_ID: SLE-B2-W2-U05U06-20261111-R1',
 'ACADEMIC_VERDICT: PASS','REQUIRED_CORRECTIONS: NONE',
 'OBJECTIVE_ITEMS_REVIEWED: 20/20',
 'UNSCORED_WRITING_TASKS_REVIEWED: 4/4',
 'SCHEMA_AND_BROWSER_QA: NOT_PERFORMED','PRODUCTION_RELEASE: NO_GO'])
 assert(verdict.includes(required),'original NotebookLM verdict missing: '+required);
const old=require('../content/curriculum-1.26.0-candidate.json');
const next=require('../content/curriculum-1.27.0-candidate.json');
const batch=require('../content/batches/b2-u05-u06-wave2-v127-draft.json');
const nav=require('../content/sle-unit-navigation-map-v1.json');
assert.equal(next.schema_version,'1.27.0');
assert.equal(batch.source_sha256,digest);
assert.deepEqual([old.lessons.length,next.lessons.length,
 next.lessons.flatMap(l=>l.activities).length],[166,174,1211]);
assert.deepEqual(next.lessons.slice(0,166),old.lessons,
 'base immutable 166 original lesson objects must not change');
assert.deepEqual(next.course.sequence.slice(0,166),old.course.sequence);
assert.deepEqual(next.rubrics,old.rubrics,'reviewed B2 Writing rubric and all older rubrics preserved');
assert.deepEqual(next.lessons.slice(166),batch.lessons);
assert.deepEqual(next.course.sequence.slice(166),batch.lessons.map(l=>l.id));
assert.equal(batch.lessons.length,8);
const headers=[...source.matchAll(/^## [2-5]\. Lesson (\d+) — (B2-U0[56]-W2-L0[12]): ([^\n]+)\n/gm)];
assert.equal(headers.length,4);
const expected=['BCCCB','ABCCC','ACBCD','BCAAB'];
let objectives=0,writing=0,options=0;
const oldIds=new Set(old.lessons.map(l=>l.id)),
 oldQs=new Set(old.lessons.flatMap(l=>l.activities.map(q=>q.id)));
const itemIds=new Set();
for(let i=0;i<4;i++){
 const h=headers[i],text=source.slice(h.index+h[0].length,
  headers[i+1]?.index??source.indexOf('\n## 6. Assessment',h.index));
 const rd=batch.lessons[2*i],wr=batch.lessons[2*i+1];
 assert.equal(rd.id,'REA-B2-'+String(i+6).padStart(2,'0'));
 assert.equal(wr.id,'WRI-B2-'+String(i+4).padStart(2,'0'));
 assert.equal(rd.module,'reading');assert.equal(wr.module,'writing');
 assert.equal(rd.title,h[3]);
 assert(!oldIds.has(rd.id)&&!oldIds.has(wr.id));
 assert.equal(nav.confirmed_v127[rd.id],h[2].slice(0,6));
 assert.equal(nav.confirmed_v127[wr.id],h[2].slice(0,6));
 assert.equal(rd.activities.length,5);
 assert.equal(wr.activities.length,1);
 const core=n=>(text.split(new RegExp('^### CORE-'+n+' — [^\\n]+$','m'))[1]||'')
  .split(/^### CORE-[1-4] — /m)[0];
 const source1=core(3),found=[...source1.matchAll(/^\*\*(L0[1-4]-Q0[1-5])\.\*\* ([^\n]+)/gm)];
 const task=source1.match(/^\*\*(L0[1-4]-Q06) — EXTENDED WRITING \(UNSCORED \/ PENDING_REVIEW\)\.\*\* ([^\n]+)/m);
 assert(found.length===5&&task);
 const originalPassage=source1.slice(0,found[0].index).replace(/\*\*/g,'').trim();
 assert.equal(rd.reading_asset.body,originalPassage);
 assert(wr.explanation.en.includes(originalPassage));
 for(const x of [rd,wr]){
  for(let n=1;n<=4;n++)assert(x.explanation.en.includes('CORE-'+n),
    x.id+' missing reviewed teaching Core-'+n);
  assert(x.examples.some(s=>s.startsWith('INDEPENDENT MODEL')));
 }
 assert(!rd.explanation.en.includes('Correct:'),
  'answer key leaked into pre-submit lesson explanation');
 assert.equal(rd.activities.map(q=>q.answer.correct_option_id).join(''),expected[i]);
 for(let k=0;k<5;k++){
  const match=found[k],end=found[k+1]?.index??task.index;
  const segment=source1.slice(match.index+match[0].length,end);
  const q=rd.activities[k];
  assert.equal(q.prompt,match[2]);
  assert.equal(q.options.length,4);
  for(const o of q.options){
   assert(segment.includes('- '+o.id+'. '+o.text),q.id+' option '+o.id);
   options++;
  }
  const academic=segment.match(/^- \*\*Correct:\*\* ([A-D])\. \*\*Feedback:\*\* ([^\n]+?) \*\*Next action:\*\* ([^\n]+)/m);
  assert(academic&&q.answer.correct_option_id===academic[1]);
  assert(q.feedback.explanation_en.includes(academic[2]));
  assert(q.feedback.explanation_en.includes(academic[3]));
  assert.equal(q.type,'single_choice');
  assert.equal(q.evidence_weight,1);
  assert(q.skill_tags.every(tag=>tag.startsWith('reading.')));
  assert(!oldQs.has(q.id)&&!itemIds.has(q.id));itemIds.add(q.id);
  objectives++;
 }
 const qq=wr.activities[0];
 assert.equal(qq.type,'extended_response');
 assert.equal(qq.answer,null);assert.equal(qq.evidence_weight,0);
 assert.equal(qq.rubric_id,'RUBRIC-WRITING-B2');
 assert.equal(qq.review_mode,'assisted_ai_or_human');
 assert(qq.skill_tags.every(tag=>tag.startsWith('writing.')));
 assert.equal(qq.prompt,task[2].replace(/\*\*/g,'').trim());
 assert(!oldQs.has(qq.id)&&!itemIds.has(qq.id));itemIds.add(qq.id);
 if(i!==2)assert.equal(qq.word_range_guidance.not_a_quality_score,true);
 else assert.equal(qq.word_range_guidance,undefined,
  'five-line outline must not masquerade as word-count quality scoring');
 writing++;
}
assert.deepEqual([objectives,writing,options,itemIds.size],[20,4,80,24]);
assert.equal(new Set(next.lessons.map(l=>l.id)).size,174);
assert.equal(new Set(next.lessons.flatMap(l=>l.activities.map(q=>q.id))).size,1211);
fs.mkdirSync(path.join(root,'.sites-runtime'),{recursive:true});
const out='.sites-runtime/f3-v127-academic-schema';
execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc','domain/academic.ts','domain/content-model.ts',
 'domain/option-order.ts','domain/unit-guide-60.ts','domain/today-learning-path.ts',
 '--outDir',out,'--rootDir','.','--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}\n');
const {validateSeed,mapSeed,MAX_CURRICULUM_LESSONS}
 =require(path.join(root,out,'domain/academic.js'));
const {validateContent}=require(path.join(root,out,'domain/content-model.js'));
const {createOptionOrder,orderedOptions,validateOptionOrder}
 =require(path.join(root,out,'domain/option-order.js'));
const {unitGuideForCatalog,primaryUnitForLessonId}
 =require(path.join(root,out,'domain/unit-guide-60.js'));
const {todayLearningPath}=require(path.join(root,out,'domain/today-learning-path.js'));
assert.equal(MAX_CURRICULUM_LESSONS,250);
assert.deepEqual(validateSeed(next),[]);
assert.deepEqual(validateContent(mapSeed(next)),[]);
for(const lesson of batch.lessons){
 const order=createOptionOrder(lesson.activities,()=>0);
 validateOptionOrder(lesson.activities,{version:'1.27.0',optionOrder:order});
 for(const q of lesson.activities.filter(x=>x.type==='single_choice')){
  const shuffled=orderedOptions(q,{optionOrder:order});
  assert.equal(shuffled.find(o=>o.id===q.answer.correct_option_id).text,
   q.options.find(o=>o.id===q.answer.correct_option_id).text);
 }
}
const catalog=next.lessons.map(l=>({
 id:l.id,title:l.title,module:l.module,cefr:l.cefr_target,minutes:l.estimated_minutes
}));
const guide=unitGuideForCatalog(catalog,next.course.sequence);
assert.equal(guide.units.length,60);
assert.equal(guide.mappedLessonCount,172);
assert.deepEqual(guide.unmappedLessons.map(l=>l.id).sort(),['REA-C1-01','VOC-C2-01']);
for(const [id,unit] of Object.entries(nav.confirmed_v127))
 assert.equal(primaryUnitForLessonId(id),unit);
const suggested=todayLearningPath({lessons:catalog,attempts:[],course:{sequence:next.course.sequence}},
 undefined,'B2-U05');
assert.equal(suggested.focusUnit,'B2-U05');
assert(suggested.learn?.lesson.id.startsWith('REA-B2-0'));
console.log(JSON.stringify({
 result:'PASS',gate:'B2_WAVE2_V127_REVIEWED_MACHINE_SCHEMA',
 originalPacketSha256:digest,reviewVerdict:'PASS',authoredTeachingContexts:4,
 canonicalRecords:8,objectives,writing,options,
 totalLessons:next.lessons.length,totalActivities:1211,
 mapped:172,oldLessonsUnchanged:166,noLiveCurriculumActivation:true,
 noRealLearnerData:'NOT_TOUCHED',merge:false,deploy:false
}));
