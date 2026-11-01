const assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process'),crypto=require('node:crypto');
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','infrastructure/browser/local-runtime.ts','domain/content-model.ts','--outDir','.sites-runtime/aq2','--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{stdio:'inherit'});
fs.writeFileSync('.sites-runtime/aq2/package.json','{"type":"commonjs"}');
const {academicService,sourceDigest}=require('../.sites-runtime/aq2/application/academic-service.js');
const {mapSeed,validateSeed}=require('../.sites-runtime/aq2/domain/academic.js');
const {validateContent}=require('../.sites-runtime/aq2/domain/content-model.js');
const {createOptionOrder,validateOptionOrder,orderedOptions}=require('../.sites-runtime/aq2/domain/option-order.js');
const {BrowserLocalAcademicRepository:Repo,BrowserLocalLearningRepository:Learning}=require('../.sites-runtime/aq2/infrastructure/storage/browser-local-repositories.js');
const old=require('../content/curriculum-1.16.0-candidate.json'),seed=require('../content/curriculum-1.17.0-candidate.json'),approved=require('../docs/AQ2_APPROVED_REVISIONS.json');
class Memory{map=new Map();fail=false;getItem(k){return this.map.get(k)??null}setItem(k,v){if(this.fail)throw Error('quota');this.map.set(k,String(v))}removeItem(){throw Error('No deletion allowed')}}
function permutations(a){return a.length?a.flatMap((x,i)=>permutations(a.filter((_,j)=>j!==i)).map(t=>[x,...t])):[[]]}
(async()=>{
 assert.deepEqual(validateSeed(seed),[]);const cv=validateContent(mapSeed(seed));assert.deepEqual(cv,[]);
 assert.equal(seed.schema_version,'1.17.0');assert.equal(seed.lessons.length,100);assert.equal(seed.lessons.flatMap(l=>l.activities).length,850);
 const updated=[];let mc=0,perms=0;
 for(const l of seed.lessons){const before=old.lessons.find(x=>x.id===l.id),expected=structuredClone(before);
  for(const q of expected.activities){const patch=approved.items[q.id];if(patch){q.prompt=patch[0];q.options.forEach((o,i)=>o.text=patch[1][i]);q.feedback.explanation_en=patch[2]}if(approved.feedback[q.id])q.feedback.explanation_en=approved.feedback[q.id]}
  assert.deepEqual(l,expected,l.id+' unexpected academic change');if(JSON.stringify(l)!==JSON.stringify(before))updated.push(l.id);
  for(const q of l.activities.filter(q=>q.type==='single_choice')){mc++;const ids=q.options.map(o=>o.id);assert.equal(new Set(ids).size,ids.length);assert(ids.includes(q.answer.correct_option_id));assert.equal(new Set(q.options.map(o=>o.text.trim())).size,ids.length);if(q.id!=='PRO-B1-01-Q5')assert.equal(new Set(q.options.map(o=>o.text.toLowerCase().trim())).size,ids.length); // Capitalization deliberately marks contrastive stress in PRO-B1-01-Q5.
   for(const p of permutations(ids)){const a={version:'1.17.0',optionOrder:{version:1,questions:{[q.id]:p}}};validateOptionOrder([q],a);const shown=orderedOptions(q,a);assert.deepEqual(shown.map(o=>o.id),p);for(const o of shown)assert.equal(o.text,q.options.find(x=>x.id===o.id).text);assert.equal(shown.filter(o=>o.id===q.answer.correct_option_id).length,1);perms++}
  }
 }
 assert.equal(mc,674);assert.equal(Object.keys(approved.items).length,6);assert.equal(Object.keys(approved.feedback).length,13);
 const qid=id=>seed.lessons.flatMap(l=>l.activities).find(q=>q.id===id);
 for(const [id,forbidden] of [['GRA-A2-11-Q5','will help'],['GRA-A2-14-Q3','will call'],['GRA-A2-14-Q10','will call'],['GRA-A2-06-Q13','have to arrive'],['GRA-A2-05-Q11','is going to make'],['GRA-B1-03-Q4','had left']])assert(!JSON.stringify(qid(id)).toLowerCase().includes(forbidden));
 const pro=qid('PRO-A2-02-Q5');assert.equal(pro.evidence_weight,0);assert.deepEqual(seed.lessons.find(l=>l.id==='PRO-A2-02'),old.lessons.find(l=>l.id==='PRO-A2-02'));
 const positional=/\b(first|second|third|fourth|last) (sentence|option|answer|choice)|\b(option|answer|choice) [A-D]\b|all of the above|none of the above|both [A-D] and [A-D]/i;
 const exceptions={'REA-A1-01-Q2':'The second sentence identifies Room 12.','REA-A1-01-Q8':'The last sentence gives the registration location and deadline.','REA-A1-02-Q1':"The first sentence introduces Class 6B's visit to the museum.",'REA-B1-02-Q2':'The first sentence states that the school session will be in the school library.'};
 for(const q of seed.lessons.flatMap(l=>l.activities).filter(q=>q.type==='single_choice')){
  if(positional.test(q.feedback.explanation_en??''))assert.equal(q.feedback.explanation_en,exceptions[q.id],q.id+' position dependent feedback');
  if(positional.test(q.prompt))assert.equal(q.id,'GRA-A2-04-Q5'); // "my first answer" is contextual, not a choice reference.
  for(const o of q.options)assert(!positional.test(o.text),q.id+' positional option');
 }
 // Fixed-seed reproducible distribution, all 674 keys. This does not read keys to generate order.
 let state=1234567;const pick=n=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return Math.floor(state/4294967296*n)};const counts=[0,0,0,0];
 for(let i=0;i<100;i++)for(const l of seed.lessons){const order=createOptionOrder(l.activities,pick);for(const q of l.activities.filter(q=>q.type==='single_choice'))counts[order.questions[q.id].indexOf(q.answer.correct_option_id)]++}
 counts.forEach(n=>assert(n/67400>.23&&n/67400<.27));
 const storage=new Memory(),repo=new Repo(storage),learning=new Learning(storage),service=academicService(repo,learning,'isolated-aq2');
 let preview=await service.preview(old);await service.importPackage(old,preview.token,true);
 const lesson=old.lessons.find(l=>l.id==='GRA-A2-11');let legacy=await service.start(lesson.id,'legacy-draft-01');assert.equal(legacy.optionOrder,undefined);await service.draft(legacy.id,{'GRA-A2-11-Q5':'A'});const savedOld=JSON.stringify(await repo.attempts('isolated-aq2'));
 preview=await service.preview(seed);assert.deepEqual(preview.counts,{add:0,update:12,skip:88,conflict:0});await service.importPackage(seed,preview.token,true);assert.equal(JSON.stringify(await repo.attempts('isolated-aq2')),savedOld);
 const answers=l=>Object.fromEntries(l.activities.map(q=>[q.id,q.type==='single_choice'?q.answer.correct_option_id:q.type==='short_answer'?q.answer.accepted_answers[0]:'My own unreviewed response']));
 await service.draft(legacy.id,answers(lesson));legacy=await service.submit(legacy.id);assert.equal(legacy.optionOrder,undefined);assert(legacy.results.every(r=>r.correct));const oldScored=JSON.stringify(legacy);assert.equal(JSON.stringify(await service.submit(legacy.id)),oldScored);
 const revision=await service.start(lesson.id,'legacy-revision-01',legacy.id);assert.equal(revision.version,'1.16.0');assert.equal(revision.optionOrder,undefined);
 // Real service grading for every MC across all seven skills; no real media or AI.
 for(const l of seed.lessons){let a=await service.start(l.id,'aq2-'+l.id+'-attempt');validateOptionOrder(l.activities,a);const order=JSON.stringify(a.optionOrder);assert.equal(JSON.stringify((await service.start(l.id,a.id)).optionOrder),order);
  const cleanView=await service.lesson(l.id);assert(cleanView.lesson.activities.every(q=>!('answer' in q)&&!('feedback' in q)));
  await service.draft(a.id,answers(l));if(l.module==='listening')await repo.saveDraft('isolated-aq2',a.id,{playbackCompleted:true}); // isolated storage fixture; production play guards tested separately
  const freshService=academicService(new Repo(storage),new Learning(storage),'isolated-aq2');const restored=(await freshService.catalog()).attempts.find(x=>x.id===a.id);assert.equal(JSON.stringify(restored.optionOrder),order);assert.deepEqual(restored.answers,answers(l));
  const scored=await freshService.submit(a.id);assert.equal(JSON.stringify(scored.optionOrder),order);assert(scored.results.filter(r=>qid(r.id).type==='single_choice').every(r=>r.correct===true),l.id);assert.equal(JSON.stringify(await freshService.submit(a.id)),JSON.stringify(scored));
 }
 const current=seed.lessons.find(l=>l.id==='GRA-A2-11'),newOne=await service.start(current.id,'new-retake-01');const newTwo=await service.start(current.id,'new-retake-02');assert.notEqual(newOne.id,newTwo.id);validateOptionOrder(current.activities,newTwo);
 const before=JSON.stringify([...storage.map]);storage.fail=true;await assert.rejects(()=>service.start(current.id,'quota-attempt-01'));await assert.rejects(()=>service.draft(newOne.id,answers(current)));storage.fail=false;assert.equal(JSON.stringify([...storage.map]),before);
 await service.draft(newOne.id,answers(current));const wrong=await service.start(current.id,'wrong-option-01');const wrongAnswers=answers(current);wrongAnswers[current.activities[0].id]=current.activities[0].options.find(o=>o.id!==current.activities[0].answer.correct_option_id).id;await service.draft(wrong.id,wrongAnswers);assert.equal((await service.submit(wrong.id)).results[0].correct,false);
 for(const corrupt of [undefined,{version:2,questions:{}},{version:1,questions:{}},{version:1,questions:{[current.activities[0].id]:['A','A','C','D']}}]){
  assert.throws(()=>validateOptionOrder(current.activities,{version:'1.17.0',optionOrder:corrupt}));
 }
 await repo.saveDraft('isolated-aq2',newOne.id,{optionOrder:null});await assert.rejects(()=>service.submit(newOne.id),/option order/);
 // Upgrade only adds immutable package; leaves current learner state, drafts and selection untouched.
 const isolated=new Memory();global.window={localStorage:isolated};const ar=new Repo(isolated);await ar.addPackage({id:old.package_id,version:old.schema_version,digest:await sourceDigest(old),source:old,bundle:mapSeed(old),at:1});await ar.start('historical-owner',legacy);isolated.setItem('g-learning:english:sentinel','draft/course/evidence unchanged');const snapshot=new Map(isolated.map);
 const runtime=require('../.sites-runtime/aq2/infrastructure/browser/local-runtime.js');assert.equal((await (await runtime.localAcademicRuntime()).service.catalog()).version,'1.17.0');for(const [k,v] of snapshot)if(!k.endsWith('academic:packages'))assert.equal(isolated.getItem(k),v);assert.deepEqual((await ar.packages()).find(p=>p.version==='1.16.0').source,old);
 const ui=fs.readFileSync('app/foundation.tsx','utf8');assert(ui.includes('orderedOptions(q,attempt)?.map'));assert(ui.includes('value={o.id}'));assert(ui.includes('if(existing)validateOptionOrder(view.lesson.activities,existing)'));assert(ui.includes('validateOptionOrder(v.lesson.activities,a)'));assert(ui.includes('{result&&'));assert(ui.includes('await saveDraft();if(revision!==draftRevision.current)'));
 const report={result:'PASS',mc,permutations:perms,attempts:100,distribution:counts,preview:preview.counts,changedLessons:updated,version:'1.17.0',legacy:true,quota:true,canonicalGrading:true};fs.mkdirSync('docs/qa',{recursive:true});fs.writeFileSync('docs/qa/AQ2_RESULTS.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exitCode=1});
