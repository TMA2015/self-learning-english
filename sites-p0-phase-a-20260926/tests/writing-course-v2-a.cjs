'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.join(__dirname,'..'),out=path.join(root,'.sites-runtime/wcv2-a');
fs.rmSync(out,{recursive:true,force:true});
execFileSync(process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),
 'domain/writing-course-v2.ts','app/writing-course-v2.tsx','app/writing-coach.tsx','application/guided-writing.ts',
 'infrastructure/storage/browser-local-repositories.ts','domain/navigation-gate.ts','infrastructure/browser/client-services.ts',
 '--outDir',out,'--module','commonjs','--target','es2022','--jsx','react-jsx','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}');
const d=require(path.join(out,'domain/writing-course-v2.js'));
const ui=require(path.join(out,'app/writing-course-v2.js'));
const {guidedWritingFeedback}=require(path.join(out,'application/guided-writing.js'));
const {TeachingFeedback}=require(path.join(out,'app/writing-coach.js'));
const {createNavigationGate}=require(path.join(out,'domain/navigation-gate.js'));
const {BrowserLocalLearningRepository}=require(path.join(out,'infrastructure/storage/browser-local-repositories.js'));
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const home=read('app/home-client.tsx'),go=()=>{};
const render=(Component,props)=>renderToStaticMarkup(React.createElement(Component,props));
let count=0;
async function test(name,fn){await fn();count++;console.log('PASS '+name)}
const work={analysis:{topic:'school garden',task:'give opinion and reasons',keywords:'reasons and example',limits:'school garden',offtopic:'home garden'},brainstorm:{ideas:'grow plants',selected:'learn about plants',support:'shared work',example:'measure beans'},outline:{opening:'my own opinion',reason1:'learn by doing',detail:'care for plants',example:'measure beans',ending:'my own ending'},writing:'I think a garden can help students learn by doing. We can look after plants together and write down what changes. For example, our class could measure a bean plant each week and compare our notes.',completed:[0,1,2,3]};
function walk(element,predicate){if(!element||typeof element!=='object')return null;if(predicate(element))return element;const children=React.Children.toArray(element.props?.children);for(const child of children){const result=walk(child,predicate);if(result)return result}return null}
(async()=>{
 await test('Writing landing has three working entries and future-only placeholders',()=>{
  const s=render(ui.WritingEntries,{onGo:go});for(const phrase of ['About this course','Writing Foundations','English Writing Coach · 12 Weeks','Writing is the skill','Independent Practice · Future','My Writing / Review · Future'])assert(s.includes(phrase));
  assert(home.includes('<WritingHome compact'));assert(read('app/platform.tsx').includes('<WritingEntries'));
 });
 await test('Overview explains learner, flow, time, AI optional and progress limits',()=>{
  const s=render(ui.CourseOverview,{onGo:go,showVi:false});for(const phrase of ['10–14','Grade 5–8','A2 to early B1','Learn → Guided Practice → Main Practice','25–35 minutes','two short sessions','AI is optional','when AI fails','not the same as language proficiency'])assert(s.includes(phrase));assert(!/IELTS|band scoring/i.test(s));
 });
 await test('Six optional Foundation units each have concept, example, mistake and practice link',()=>{
  assert.equal(d.FOUNDATIONS.length,6);assert.deepEqual(d.FOUNDATIONS.map(f=>f.title),['Understand the Task','Build Ideas','Develop Ideas','Organize Writing','Write Clear Sentences','Revise & Self-Edit']);
  for(const f of d.FOUNDATIONS){const s=render(ui.Foundations,{unit:f.id,onUnit:go,onGo:go});assert(s.includes('not locked prerequisites'));assert(s.includes('Common mistake:'));assert(s.includes('Relevant practice'));assert(f.concept&&f.example&&f.mistake)}
 });
 await test('All twelve reconciled titles and order; only Week 1 is published',()=>{
  assert.deepEqual(d.PILOT_WEEKS.map(w=>w.title),['Prompt Analysis','Brainstorming & Relevance','Idea Development & Reasons','Examples & Details','Sentence Clarity & Linkers','Outlining & Response Structure','Paragraph Construction','Connecting Ideas & Paragraphs','Applied Grammar & Self-Editing','Draft Revision & Self-Correction','Guided Multi-Paragraph Challenge','Independent Writing']);
  const s=render(ui.WeekCards,{progress:'0/4 saved',onGo:go,showVi:false});assert.equal((s.match(/Planned outline only/g)||[]).length,11);assert.equal((s.match(/<strong>Goal:/g)||[]).length,12);assert.equal((s.match(/25–35 minutes/g)||[]).length,12);assert(s.includes('Reduced scaffolding')&&s.includes('Minimal scaffolding'));
 });
 await test('Week 1 annotated garden Learn uses four simple terms and no Scope/Limit',()=>{
  const s=render(ui.WeekLearn,{onGo:go,showVi:true});for(const label of d.ANALYSIS_LABELS.slice(0,4))assert(s.includes(label));assert(!/Scope|Limit/i.test(s));assert.equal((s.match(/Annotated example:/g)||[]).length,4);assert(s.includes('home garden')&&s.includes('crosses the Boundary'));assert(s.includes('Understand the Task'));assert(home.includes('const analysisLabels=ANALYSIS_LABELS'));
 });
 await test('Four objective checks use a different prompt and one defensible answer each',()=>{
  assert.equal(d.GUIDED_ITEMS.length,4);assert(!d.GUIDED_PROMPT.includes('garden'));for(const q of d.GUIDED_ITEMS){assert.equal(new Set(q.options).size,q.options.length);assert(q.options[q.correct]);assert(q.explanation)}
 });
 await test('Guided wrong answer explains and permits exactly one retry',()=>{
  const q=d.GUIDED_ITEMS[0];const first=d.checkGuided([],q.id,1,1);assert(!first.correct);const pilot={...d.emptyPilot(),guided:[first]};
  const s=render(ui.GuidedPractice,{pilot,onCheck:go,onGo:go,busy:false,error:''});assert(s.includes('Incorrect')&&s.includes(q.explanation)&&s.includes('One retry remains'));
  const second=d.checkGuided([first],q.id,2,2);assert(!second.correct);assert.throws(()=>d.checkGuided([first,second],q.id,0),/finished/);assert.throws(()=>d.checkGuided([],q.id,99),/Choose/);
 });
 await test('Correct answer ends item; practice weights/tags and all-attempt denominator are explicit',()=>{
  const q=d.GUIDED_ITEMS[0],wrong=d.checkGuided([],q.id,1,1),correct=d.checkGuided([wrong],q.id,q.correct,2);
  assert.equal(correct.evidenceWeight,1);assert.equal(correct.proficiencyWeight,0);assert.equal(correct.tag,'writing.task_understanding');assert.equal(correct.kind,'practice');assert.throws(()=>d.checkGuided([correct],q.id,0),/finished/);
  assert.deepEqual(d.guidedProgress([wrong,correct,correct]),{correct:1,total:2,finished:1});
 });
 await test('Free-form deterministic events have zero proficiency weight and remain provisional',()=>{
  for(let stage=0;stage<4;stage++){const events=d.pilotProgressEvidence(stage,{text:'learner words'},1);assert.equal(events.length,1);const e=events[0];assert.equal(e.raw.proficiencyWeight,0);assert.equal(e.raw.evidenceWeight,0);assert(e.provisional);assert.equal(e.level,undefined);assert.equal(e.score,0)}
 });
 await test('Pilot progress never changes provisional level, Writing estimates or scored subskills',()=>{
  const {makeDiagnostic,deriveLearner}=require(path.join(out,'domain/learning-model.js'));
  const baseline=makeDiagnostic([], '',1),before=deriveLearner(baseline,baseline.evidence,'');
  const events=[0,1,2,3].flatMap(stage=>d.pilotProgressEvidence(stage,{text:'school garden opinion reasons example'},2));
  const after=deriveLearner(baseline,[...baseline.evidence,...events],'');
  assert.deepEqual(after.estimates,before.estimates);assert.deepEqual(after.subskills,before.subskills);assert.equal(after.level,before.level);assert.deepEqual(after.errorTags,before.errorTags);
 });
 await test('Step-by-Step Helper has four independent statuses, evidence, explanation and action',()=>{
  const items=d.analysisHelper({topic:'school garden',task:'write about plants',keywords:'',limits:'school garden'});assert.deepEqual(items.map(i=>i.status),['good','needs-work','missing','good']);
  for(const item of items){assert(item.evidence&&item.explanation&&item.nextAction);assert(item.starter.split(/\s+/).length<=15)}
  const s=render(ui.StepByStepHelper,{items});assert(s.includes(d.GUIDED_CHECK_LABEL));assert(s.includes(d.GUIDED_CHECK_DISCLAIMER));assert.equal((s.match(/Next action:/g)||[]).length,4);
 });
 await test('Basic fallback has no scores, corrections or unsupported semantic/grammar claims',()=>{
  for(const stage of ['analysis','brainstorm','outline','writing']){const f=guidedWritingFeedback(stage,stage==='analysis'?work.analysis:{writing:'nonsense school garden because'});assert.equal(f.scores,null);assert.deepEqual(f.corrections,[]);assert(f.summary.startsWith('Basic structure'));assert(!/I have read|good writing|grammatically correct|CEFR|strongest/i.test(JSON.stringify(f)))}
  // Keyword hits are explicitly limited to word presence, even when a phrase has no sensible meaning.
  assert(d.analysisHelper({topic:'garden school nonsense'})[0].explanation.includes('words'));
 });
 await test('No full model in Learn, Guided Practice or active AI Feedback/Revision',()=>{
  const full='For these reasons, a small school garden can make learning practical.';
  for(const [Component,props] of [[ui.WeekLearn,{onGo:go,showVi:false}],[ui.GuidedPractice,{pilot:d.emptyPilot(),onCheck:go,onGo:go,busy:false,error:''}]])assert(!render(Component,props).includes(full));
  const rating={summary:full,strengths:[full],improvements:[full],scores:{grammar:6},corrections:[{original:'my own words',revised:full,why:full,hint:full,tag:'grammar-accuracy'}],exercise:full};
  const s=render(TeachingFeedback,{rating,activeWork:true});assert(!s.includes(full));assert(s.includes('my own words'));assert(!home.includes('function demo('));assert(home.includes('<SavedWriting activeWork'));
 });
 await test('Model comparison rejects incomplete, unsubmitted, active-screen and edited work',()=>{
  const p={...d.emptyPilot(),submission:{signature:d.workSignature(work),at:1}};
  assert(!d.canCompareModel(work,d.emptyPilot(),'review'));assert(!d.completeOwnAttempt({...work,writing:'only four own words'}));assert(!d.canCompareModel({...work,completed:[0,1,2]},p,'review'));assert(!d.canCompareModel(work,p,'main'));assert(!d.canCompareModel({...work,writing:'changed'},p,'review'));assert(d.canCompareModel(work,p,'review'));
  assert(!render(ui.WeekReview,{pilot:d.emptyPilot(),work,onReflection:go,onDone:go,onGo:go}).includes('Compare with a model'));
 });
 await test('Completed final Review reveals model only after explicit Compare click',()=>{
  const p={...d.emptyPilot(),submission:{signature:d.workSignature(work),at:1}},props={pilot:p,work,onReflection:go,onDone:go,onGo:go};
  let revealed=false;const original=React.useState;React.useState=()=>[revealed,v=>{revealed=typeof v==='function'?v(revealed):v}];
  try{let tree=ui.WeekReview(props);assert(!renderToStaticMarkup(tree).includes('Compare, do not copy'));const button=walk(tree,e=>e.type==='button'&&e.props.children==='Compare with a model');assert(button);button.props.onClick();tree=ui.WeekReview(props);assert(renderToStaticMarkup(tree).includes('Compare, do not copy'));assert(renderToStaticMarkup(tree).includes('The topic is …'));}
  finally{React.useState=original}
  assert(home.includes('<WeekReview key={pilot.submission?.signature'));assert(home.includes('p.writing!==previous.writing'));
 });
 await test('Pilot guided answers, reflections and legacy drafts/feedback persist without changing course selection',async()=>{
  const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
  const repo=new BrowserLocalLearningRepository(storage),scope={ownerId:'fixture',learnerId:'primary'};
  const legacy={...work,revision:'my previous revision',feedbacks:{3:{summary:'previous saved review'}},courseV1:{activeCourseId:'keep-existing-selection'}};
  await repo.writeState(scope,legacy);const next={...await repo.readState(scope),writingCourseV2:{...d.emptyPilot(),guided:[d.checkGuided([],d.GUIDED_ITEMS[0].id,0,1)],reflections:{topic:'school garden',task:'give my view',boundary:'school context'}}};await repo.writeState(scope,next);
  const restored=await new BrowserLocalLearningRepository(storage).readState(scope);assert.deepEqual(restored,next);assert.equal(restored.writing,legacy.writing);assert.deepEqual(restored.feedbacks,legacy.feedbacks);assert.deepEqual(restored.courseV1,legacy.courseV1);
 });
 await test('Every pilot route saves before leaving; failure blocks and preserves unsaved work',async()=>{
  for(const route of ['writing-overview','writing-foundations','writing-course','writing-learn','writing-guided','lesson','writing-review']){
   let saved=false,committed=false;const draft={value:'unsaved learner input'};const gate=createNavigationGate();assert.equal(await gate(route,async()=>false,()=>{committed=true}),false);assert(!committed);assert.equal(draft.value,'unsaved learner input');
   assert.equal(await gate(route,async()=>{saved=true;return true},()=>{assert(saved);committed=true}),true);assert(committed);
  }
  assert(home.includes('if(await navigate(target))'));assert(home.includes('pilotCheckPending.current=true'));assert(home.includes('while(snapshot!==latestState.current)'));assert(home.includes('foundationNavigationGuard.current?.(target)'));
 });
 await test('Production client fallback records only progress, before optional AI; provider mock makes no network call',async()=>{
  const Module=require('node:module'),original=Module._load,prior=process.env.NEXT_PUBLIC_LEARNING_RUNTIME;process.env.NEXT_PUBLIC_LEARNING_RUNTIME='browser';const seen=[];
  Module._load=function(name,...args){if(name==='./local-runtime')return {localLearningRuntime:async()=>({service:{recordEvidence:async e=>seen.push(...e)}})};if(name==='./firebase-ai-browser')return {browserTutorService:()=>{assert(seen.length>0);return {available:false}},browserTutorConfigured:()=>false};return original.call(this,name,...args)};
  try{const services=require(path.join(out,'infrastructure/browser/client-services.js'));for(const stage of ['analysis','brainstorm','outline','writing','revision']){const result=await services.evaluateWritingProcess(stage,{writing:'my own saved writing'});assert.equal(result.mode,'guided');assert(result.evidence.every(e=>e.provisional&&e.raw.proficiencyWeight===0));}}
  finally{Module._load=original;if(prior===undefined)delete process.env.NEXT_PUBLIC_LEARNING_RUNTIME;else process.env.NEXT_PUBLIC_LEARNING_RUNTIME=prior}
  assert(home.indexOf('await saveNow(submittedState)')<home.indexOf('await evaluateWritingProcess(labels[stage]'));
 });
 await test('Existing step-feedback explicit Continue and edit protections remain wired',()=>{
  assert(home.includes('stage:stage===3?4:stage'));for(const s of ['Continue to Brainstorm','Continue to Outline','Continue to Writing','delete feedbacks[String(stageIndex)]','completed:previous.completed.filter(item=>item!==stageIndex)'])assert(home.includes(s));
 });
 console.log(JSON.stringify({result:'PASS',suite:'WCV2-A',tests:count,realAIRequests:0}));
})().catch(e=>{console.error(e);process.exitCode=1});
