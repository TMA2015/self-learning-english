'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const md=fs.readFileSync(path.join(root,'content/review-packets/SLE_B2_BULK12_U01_U03_NOTEBOOKLM_R1_20261110.md'),'utf8');
const h=crypto.createHash('sha256').update(md).digest('hex');
assert.equal(h,'dbf432cd788b865a55ca8c0e6c03321374968743c1b0af12ebfc2a647a6a07b9');
const old=require('../content/curriculum-1.25.0-candidate.json'),next=require('../content/curriculum-1.26.0-candidate.json');
const batch=require('../content/batches/f3-b2-bulk12-u01-u03-v126-draft.json'),nav=require('../content/sle-unit-navigation-map-v1.json');
assert.equal(batch.source_sha256,h);assert.equal(next.schema_version,'1.26.0');
assert.deepEqual([old.lessons.length,next.lessons.length,next.lessons.flatMap(l=>l.activities).length],[154,166,1187]);
assert.deepEqual(next.lessons.slice(0,154),old.lessons);
assert.deepEqual(next.course.sequence.slice(0,154),old.course.sequence);
assert.deepEqual(next.lessons.slice(154),batch.lessons);
for(const [k,v] of Object.entries(old.rubrics))assert.deepEqual(next.rubrics[k],v);
const rubric=next.rubrics['RUBRIC-WRITING-B2'];
assert.deepEqual(rubric.criteria,['task_response','evidence_fidelity','qualification_and_reasoning','coherence_and_organisation','register_and_lexical_precision','language_control_and_revision']);
assert.deepEqual(rubric.scale,{min:0,max:4});
assert.match(rubric.guidance,/no automatic numeric scoring/i);
const expected={'GRA-B2-01':'BCADBCD','GRA-B2-02':'BACDBAC','REA-B2-02':'BCADBC','VOC-B2-02':'BACDBAC','VOC-B2-03':'CBDACBD','REA-B2-03':'CADBCA','REA-B2-04':'BDACBA','REA-B2-05':'CADBCA','VOC-B2-04':'ACBDACB'};
const scope=md.split('## 2. Detailed authored lessons (learner-visible teaching; reviewer-only keys)')[1].split('## Appendix A —')[0];
const headers=[...scope.matchAll(/^### (B2-U\d\d): ((?:GRA|REA|VOC|WRI)-B2-\d\d) — (.+)$/gm)];
assert.equal(headers.length,12);
const oldId=new Set(old.lessons.map(l=>l.id)),oldQ=new Set(old.lessons.flatMap(l=>l.activities.map(q=>q.id))),newQ=new Set();
const tick=String.fromCharCode(96),fence=tick.repeat(3);
let objective=0,writing=0,options=0,reading=0;
for(let i=0;i<headers.length;i++){
 const [whole,unit,id,title]=headers[i],txt=scope.slice(headers[i].index+whole.length,i+1<headers.length?headers[i+1].index:undefined);
 const lesson=batch.lessons[i];assert.equal(lesson.id,id);assert.equal(lesson.title,title);assert(!oldId.has(id));
 assert.equal(nav.confirmed_v126[id],unit);assert(batch.unit_assignments[unit].includes(id));
 for(let n=1;n<=4;n++){assert(txt.includes('**CORE-'+n+' —'));assert(lesson.explanation.en.includes('CORE-'+n))}
 assert(lesson.examples.some(x=>x.startsWith('INDEPENDENT MODEL')));
 assert(!lesson.explanation.en.includes('Reviewer-only correct option:'));
 if(lesson.module==='writing'){
  const q=lesson.activities[0],prompt=txt.match(/^> (.+)$/m)?.[1];
  const source=txt.split(fence+'text\n')[1]?.split('\n'+fence)[0];
  const w=txt.match(/\*\*Word guidance:\*\* (\d+)[–-](\d+) words/);
  assert(prompt&&source&&w);assert.equal(q.prompt,prompt);assert(lesson.explanation.en.includes(source));
  assert.equal(q.answer,null);assert.equal(q.evidence_weight,0);assert.equal(q.type,'extended_response');
  assert.equal(q.rubric_id,'RUBRIC-WRITING-B2');assert.equal(q.review_mode,'assisted_ai_or_human');
  assert.deepEqual([q.word_range_guidance.min,q.word_range_guidance.max],[+w[1],+w[2]]);
  const parts=[...source.matchAll(/^SOURCE [A-D]\n([\s\S]*?)(?=\n\nSOURCE [A-D]\n|$)/gm)];
  assert.equal(parts.length,2);
  const paired=batch.lessons.filter(x=>x.module==='reading'&&batch.unit_assignments[unit].includes(x.id));
  for(const part of parts)assert(paired.some(x=>x.reading_asset.body.includes(part[1].trim())));
  writing++;
 }else{
  const qs=[...txt.matchAll(/^#### ((?:GRA|REA|VOC)-B2-\d\d-Q\d+)\s*$/gm)];
  assert.equal(qs.length,lesson.module==='reading'?6:7);
  assert.equal(lesson.activities.map(q=>q.answer.correct_option_id).join(''),expected[id]);
  if(lesson.module==='reading'){
   const src=[...txt.matchAll(/\*\*(SOURCE [ABCD]) — learner-visible original passage\*\*/gm)];
   assert.equal(src.length,2);assert.equal(lesson.reading_asset.display_to_learner,true);
   for(let k=0;k<src.length;k++){
    const part=txt.slice(src[k].index+src[k][0].length,k+1<src.length?src[k+1].index:undefined);
    const body=part.split(fence+'text\n')[1]?.split('\n'+fence)[0];
    assert(body&&lesson.reading_asset.body.includes(body)); 
   }
   reading++;
  }
  for(let j=0;j<qs.length;j++){
   const q=lesson.activities[j],seg=txt.slice(qs[j].index+qs[j][0].length,j+1<qs.length?qs[j+1].index:undefined);
   assert.equal(q.id,qs[j][1]);assert.equal(q.prompt,seg.match(/\*\*Question:\*\* (.+)$/m)?.[1]);
   assert.equal(q.options.length,4);
   for(const o of q.options){assert(seg.includes('- **'+o.id+'.** '+o.text),q.id+' option '+o.id);options++}
   assert(seg.includes('**Reviewer-only correct option:** '+tick+q.answer.correct_option_id+tick));
   assert(seg.includes('**Existing skill tag:** '+tick+q.skill_tags[0]+tick));
   for(const label of ['CORE-4 explanation after submit','Likely misconception','Next action']){
    const exact=seg.match(new RegExp('^- \\*\\*'+label+':\\*\\* (.+)$','m'))?.[1];
    assert(exact&&q.feedback.explanation_en.includes(exact),q.id+' '+label);
   }
   assert.equal(q.evidence_weight,1);objective++;
  }
 }
 for(const q of lesson.activities){assert(!oldQ.has(q.id)&&!newQ.has(q.id));newQ.add(q.id)}
}
assert.deepEqual([objective,writing,options,reading,newQ.size],[59,3,236,4,62]);
fs.mkdirSync(path.join(root,'.sites-runtime'),{recursive:true});
const out='.sites-runtime/f3-v126-schema';
execFileSync(process.execPath,['node_modules/typescript/bin/tsc',
'domain/academic.ts','domain/content-model.ts','domain/option-order.ts','domain/unit-guide-60.ts',
'--outDir',out,'--rootDir','.','--module','commonjs','--target','es2022',
'--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}\n');
const {validateSeed,mapSeed,MAX_CURRICULUM_LESSONS}=require(path.join(root,out,'domain/academic.js'));
const {validateContent}=require(path.join(root,out,'domain/content-model.js'));
const {createOptionOrder,validateOptionOrder,orderedOptions}=require(path.join(root,out,'domain/option-order.js'));
const {unitGuideForCatalog,primaryUnitForLessonId}=require(path.join(root,out,'domain/unit-guide-60.js'));
assert.equal(MAX_CURRICULUM_LESSONS,250);assert.deepEqual(validateSeed(next),[]);
assert.deepEqual(validateContent(mapSeed(next)),[]);
let shuffled=0;
for(const lesson of batch.lessons){
 const order=createOptionOrder(lesson.activities,()=>0);
 validateOptionOrder(lesson.activities,{version:'1.26.0',optionOrder:order});
 for(const q of lesson.activities.filter(x=>x.type==='single_choice')){
  const arr=orderedOptions(q,{optionOrder:order});
  assert.equal(arr.find(x=>x.id===q.answer.correct_option_id).text,q.options.find(x=>x.id===q.answer.correct_option_id).text);
  if(arr.map(x=>x.id).join(',')!==q.options.map(x=>x.id).join(','))shuffled++;
 }
}
assert(shuffled>0);
const cat=next.lessons.map(l=>({id:l.id,title:l.title,module:l.module,cefr:l.cefr_target,minutes:l.estimated_minutes}));
const units=unitGuideForCatalog(cat,next.course.sequence);
assert.equal(units.units.length,60);assert.equal(units.mappedLessonCount,164);
assert.deepEqual(units.unmappedLessons.map(x=>x.id).sort(),['REA-C1-01','VOC-C2-01']);
for(const [unit,ids] of Object.entries(batch.unit_assignments))for(const id of ids)assert.equal(primaryUnitForLessonId(id),unit);
console.log(JSON.stringify({result:'PASS',gate:'F3_B2_BULK12_V126_MACHINE_SCHEMA',
 sourceHash:h,lessons:166,activities:1187,objective,writing,options,reading,shuffled,
 mapped:164,limit:MAX_CURRICULUM_LESSONS,noDeploy:true,realLearnerData:'NOT_TOUCHED'}));
