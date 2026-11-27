'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.sites-runtime/w2-preview-qa');
execFileSync(process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),'app/writing-course-v2-b.tsx','infrastructure/storage/browser-local-repositories.ts','--outDir',out,'--module','commonjs','--target','es2022','--jsx','react-jsx','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}');
const d=require(path.join(out,'domain/writing-course-v2-b.js')),ui=require(path.join(out,'app/writing-course-v2-b.js')),c=require(path.join(out,'app/writing-week2-course-simplified.js'));
const {BrowserLocalLearningRepository}=require(path.join(out,'infrastructure/storage/browser-local-repositories.js'));
const actions=new Proxy({},{get:()=>()=>{}}),full={...d.emptyWeekWork(),fields:{ideas:'Drawing\nChess',reject:'Chess: fewer shared materials',best:'Drawing',fit:'Learners can share materials'},confirmedOwnWork:true};
const page=(screen,work=d.emptyWeekWork(),extra={})=>renderToStaticMarkup(React.createElement(ui.WritingWeekPage,{week:2,screen,work,actions,busy:false,error:'',showVi:false,...extra}));
const all=(el,p)=>!el||typeof el!=='object'?[]:[...(p(el)?[el]:[]),...React.Children.toArray(el.props?.children).flatMap(e=>all(e,p))];
function stateful(Component,fn){const original=React.useState,state=[];let i=0;React.useState=initial=>{const n=i++;if(!(n in state))state[n]=typeof initial==='function'?initial():initial;return [state[n],v=>{state[n]=typeof v==='function'?v(state[n]):v}]};try{const draw=()=>{i=0;return Component()};fn(draw)}finally{React.useState=original}}
let count=0;// Only superseded 12-week teaching/presentation assertions are omitted in release mode.
// Direct invocation without this flag still runs the original complete historical suite.
const retiredPresentation=new Set([
  "Five original Week 2 screens render without learner AI review controls",
  "A1–A4 navigates real teaching steps; no floating old examples",
  "Park/Museum/Library compare across the same four stages",
  "Global Vietnamese support is secondary and has no duplicate toggle",
  "Main is editable; Feedback is read-only with exactly three self-check criteria"
]);
const compatOnly=process.argv.includes('--legacy-compat-only');
const retiredSeen=new Set();
async function test(name,fn){if(compatOnly&&retiredPresentation.has(name)){retiredSeen.add(name);return;}await fn();count++;console.log('PASS '+name);}
(async()=>{
 await test('Five original Week 2 screens render without learner AI review controls',()=>{
  for(const s of ['learn','guided','main','feedback','review']){const html=page(s);assert(html.includes('Week 2'));assert(!html.includes('Get AI feedback'))}
 });
 await test('A1–A4 navigates real teaching steps; no floating old examples',()=>stateful(()=>c.Week2CourseLearn({showVi:false}),draw=>{
  const names=['A1 · Understand','A2 · Collect','A3 · Check & repair','A4 · Choose & explain'];
  for(let i=0;i<4;i++){
   let tree=draw();
   const button=all(tree,e=>e.type==='button'&&e.props.children===names[i])[0];
   assert(button,'Missing '+names[i]);button.props.onClick();tree=draw();
   const html=renderToStaticMarkup(tree);
   assert(html.includes('Step '+(i+1)+' of 4'));assert(html.includes('HOW THE THINKING WORKS'));
   assert(!html.includes('Optional extra check')&&!html.includes('Optional older lunchtime-club examples'));
  }
  assert(all(draw(),e=>e.type==='button'&&e.props.children==='Next step →')[0].props.disabled);
 }));
 await test('Park/Museum/Library compare across the same four stages',()=>stateful(()=>c.Week2CourseLearn({showVi:false}),draw=>{
  for(const title of ['E1 · Park','E2 · Museum','E3 · Library'])assert(renderToStaticMarkup(draw()).includes(title));
  const selections=all(draw(),e=>e.type==='button'&&String(e.props.children).startsWith('E'));
  assert.equal(selections.length,3);
  selections[1].props.onClick();let selected=draw();
  assert(all(selected,e=>e.type==='button'&&e.props.children==='E2 · Museum')[0].props['aria-pressed']);
  for(const marker of ['A neighbourhood park','A science museum','A local library'])assert(renderToStaticMarkup(selected).includes(marker));
  for(const step of [1,2,3]){
   all(draw(),e=>e.type==='button'&&String(e.props.children).startsWith('A'+(step+1)+' ·'))[0].props.onClick();
   const html=renderToStaticMarkup(draw());
   assert(html.includes(step===1?'Magnet experiment':step===2?'Needs explanation':'One possible sentence'));
  }
 }));
 await test('Global Vietnamese support is secondary and has no duplicate toggle',()=>{
  const off=page('learn');const on=page('learn',d.emptyWeekWork(),{showVi:true});
  assert(!off.includes('Đọc đề'));assert(on.includes('Tìm chủ đề'));
  assert(!on.includes('Optional Vietnamese help'));
 });
 await test('Four canonical MCQs preserve keys, retries and no leaked teaching answers',()=>{
  const w=d.writingWeek(2);assert.equal(w.items.length,4);
  for(const q of w.items){const wrong=d.checkWeekGuided(2,[],q.id,(q.correct+1)%q.options.length,1),right=d.checkWeekGuided(2,[wrong],q.id,q.correct,2);
   assert(!wrong.correct&&right.correct);assert.equal(right.proficiencyWeight,0);assert.equal(right.contentVersion,'wcv2-b.1');
   assert.throws(()=>d.checkWeekGuided(2,[wrong,right],q.id,q.correct,3));
   assert(page('guided',{...full,guided:[wrong]}).includes(q.explanation));
  }
  assert(page('guided').includes('G1 · Understand the question')&&page('guided').includes('G3 · Check relevance'));
 });
 await test('G2 learner-owned scratch and G4 reason/repair remain unscored',()=>{
  const g2=renderToStaticMarkup(React.createElement(c.Week2CourseGuidedIntro,{showVi:false}));
  assert(g2.includes('not saved or graded'));
  stateful(()=>c.Week2CourseGuidedBridge({showVi:false}),draw=>{
   let t=draw();assert(renderToStaticMarkup(t).includes('G4 · Explain your own choice'));
   let repairBtn=all(t,e=>e.type==='button'&&e.props.children==='Compare after my attempt')[0];assert(repairBtn.props.disabled);
   const notes=all(t,e=>e.type==='textarea');assert.equal(notes.length,2);
   notes[1].props.onChange({target:{value:'Try a short sorting game'}});
   repairBtn=all(draw(),e=>e.type==='button'&&e.props.children==='Compare after my attempt')[0];
   assert(!repairBtn.props.disabled);repairBtn.props.onClick();
   assert(renderToStaticMarkup(draw()).includes('One possible repair'));
  });
 });
 await test('Main is editable; Feedback is read-only with exactly three self-check criteria',()=>{
  const main=page('main',full),feedback=page('feedback',full);
  assert(main.includes('YOUR IDEAS · WRITE HERE')&&main.includes('YOUR WRITING TASK'));
  assert.equal((main.match(/<textarea/g)||[]).length,4);
  assert(feedback.includes('YOUR PLAN · READ-ONLY')&&feedback.includes('PLANNING PARTS')&&feedback.includes('Edit my ideas'));
  assert.equal((feedback.match(/<textarea/g)||[]).length,0);
  assert.equal((feedback.match(/type="checkbox"/g)||[]).length,3);
  assert(feedback.includes('Chess: fewer shared materials')&&feedback.includes('Learners can share materials'));
 });
 await test('Transfer is unsaved and has no imaginary Lab link',()=>{
  const html=renderToStaticMarkup(React.createElement(c.Week2CourseTransfer));
  assert(html.includes('not saved'));assert(!html.includes('Idea Explorer'));
  assert(!html.includes('<a '));assert.equal((html.match(/<textarea/g)||[]).length,4);
 });
 await test('History shows genuine saved versions; model comparison is separately gated',()=>{
  const a=d.submitWeek(2,full,1),b=d.submitWeek(2,{...d.editWeek(a,'fit','A revised reason'),confirmedOwnWork:true},2);
  const h=page('review',b);assert(h.includes('Saved version 1')&&h.includes('Saved version 2'));
  assert(h.includes('See one example plan (optional)')&&!h.includes('VersionDiffViewer'));
 });
 await test('Pending or failed saves never unlock model or invent confirmed history',()=>{
  const a=d.submitWeek(2,full,1),b=d.submitWeek(2,{...d.editWeek(a,'fit','A revised reason'),confirmedOwnWork:true},2);
  for(const extra of [{busy:true},{error:'Save failed'}]){
   const review=page('review',b,extra);
   assert(!review.includes('See one example plan (optional)'));assert(review.includes('Saved version 1'));assert(!review.includes('A revised reason'));
   const main=page('main',b,extra);assert(main.includes(extra.busy?'Saving —':'Save not confirmed.'));
   const feedback=page('feedback',b,extra);assert(feedback.includes('Save your plan in Main Practice before finishing.'));
  }
  assert(page('review',b).includes('See one example plan (optional)'));
 });
 await test('Synthetic canonical save/reload preserves legacy fields and quota rollback',async()=>{
  const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)},scope={ownerId:'qa',learnerId:'synthetic'},repo=new BrowserLocalLearningRepository(storage,'test-only-pr158');
  const a=d.submitWeek(2,full,1),edited=d.editWeek(a,'ideas','  tiếng Việt\n\nlegacy\r\n');
  await repo.writeState(scope,{writingCourseV2B:{weeks:{2:edited}},keep:'legacy'});
  const read=await new BrowserLocalLearningRepository(storage,'test-only-pr158').readState(scope);
  assert.deepEqual(read.writingCourseV2B.weeks[2],JSON.parse(JSON.stringify(edited)));assert.equal(read.keep,'legacy');assert(!d.canCompareWeek(2,edited,'review'));
  const b=d.submitWeek(2,{...edited,confirmedOwnWork:true},2);assert.equal(d.submitWeek(2,b,3).history.length,2);
  const old=[...data];storage.setItem=()=>{throw Error('quota synthetic')};
  await assert.rejects(()=>repo.writeState(scope,{writingCourseV2B:{weeks:{2:b}}}));assert.deepEqual([...data],old);
 });
 await test('Navigation refuses failed draft save and retries latest edits',async()=>{
  let state={draft:1};assert.equal(await d.confirmWeekNavigation(()=>state,()=>true,async()=>false),false);
  let n=0;assert(await d.confirmWeekNavigation(()=>state,()=>true,async()=>{if(++n===1)state={draft:2};return true}));assert.equal(n,2);
 });
 if(compatOnly)assert.equal(retiredSeen.size,retiredPresentation.size,'Every explicit historical presentation exemption must match a real test');
 console.log(JSON.stringify({legacyCompatibilityOnly:compatOnly,archivedPresentationCases:retiredSeen.size,result:'PASS',tests:count,scope:'Week 2 R2 synthetic SSR/React handlers and repository adapter',nativeBrowser:'NOT_TESTED',screenshots:0,realAIRequests:0}));
})().catch(e=>{console.error(e);process.exitCode=1});
