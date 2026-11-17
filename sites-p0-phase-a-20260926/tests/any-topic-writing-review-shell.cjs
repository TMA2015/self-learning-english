// Any Topic: local persistence and explicit-click Gemini feedback remain separate from grades.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const view=fs.readFileSync(path.join(root,'app/any-topic-writing-review.tsx'),'utf8');
const home=fs.readFileSync(path.join(root,'app/home-client.tsx'),'utf8');
const platform=fs.readFileSync(path.join(root,'app/platform.tsx'),'utf8');
const runner=fs.readFileSync(path.join(root,'scripts/qa-free-first.mjs'),'utf8');
const get=(pattern)=>Array.from(view.matchAll(pattern));
assert.equal(get(/<textarea\b/g).length,2,'Exactly two writing input textareas');
assert.equal(get(/<textarea\b[^>]*\brequired\b/g).length,2,'Both writing textareas must be required');
assert.match(view,/name="writing-topic"/);
assert.match(view,/name="student-written-content"/);
assert.match(view,/DRAFT_KEY/);
assert.match(view,/localStorage\.getItem/);
assert.match(view,/localStorage\.setItem/);
assert.match(view,/localStorage\.removeItem/);
assert.match(view,/reviewed\?\.topic===topic&&reviewed\?\.writing===writing/,'Never show stale review checklist');
assert.doesNotMatch(view,/\bfetch\s*\(|XMLHttpRequest|sendBeacon|requestWritingAI|evaluateWritingProcess/i,'The draft shell must not call any provider directly');
assert.match(view,/import \{WritingAIReview\}/,'Reuse the existing Firebase Gemini AI component');
assert.match(view,/<WritingAIReview\b[^>]*reviewId="any-topic-writing"/,'Gemini is optional on the self-check screen');
assert.match(view,/kind="draft" enabled=\{aiEligible\}/,'Gemini must be gated by successfully saved content');
assert.doesNotMatch(view,/AcademicAttempt|setEvidence\(|writingEvidence\(|RUBRIC-|score\s*:/,'No grade or Foundation attempt mutation');
assert.match(view,/self-check is always available without AI/i,'No AI dependency for self-check');
assert.match(view,/explicitly ask Gemini to review this draft/i,'No automatic send');
assert.match(view,/savedSignature===JSON\.stringify\(\[topic,writing\]\)/,'Only exact persisted draft enables AI');
assert.match(view,/currentReview&&savedSignature/,'Do not use unsaved or stale drafts for Gemini');
assert.match(view,/writing\.length<=7000/,'Bound Gemini text while allowing longer local drafts');
assert.match(view,/setSavedSignature\(null\)/,'A failed save must invalidate AI eligibility');
assert.match(view,/Save again after any editing/,'Require new saved snapshot after edits');
assert.match(view,/This browser only|this browser only/i);
assert.match(view,/Writing Draft &amp; Self-Check/);
assert.match(view,/same for every draft/i,'Self-check must disclose it is not personalized');
assert.match(view,/Task response:/);
assert.match(view,/Ideas:/);
assert.match(view,/Organization:/);
assert.match(view,/Language:/);
assert.match(home,/import \{AnyTopicWritingReview\}/);
assert.match(home,/view==="writing-any-topic"&&<AnyTopicWritingReview\/>/);
assert.match(home,/onAnyTopic=\{\(\)=>void navigate\("writing-any-topic"\)\}/);
assert.match(platform,/Open Any Topic Writing · optional Gemini/);
assert.match(runner,/any-topic-writing-review-shell\.cjs/,'Register mandatory QA in full suite');

// Exercise the real Any Topic React handlers without a network provider.
// The provider component is stubbed, so no Firebase connection or request is made.
const ts=require('typescript'),vm=require('node:vm'),React=require('react');
const StubAI=()=>null;
const compiled=ts.transpileModule(view,{fileName:'any-topic-writing-review.tsx',
 compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}
}).outputText;
function makeHarness({failSave=false}={}){
 const values=[],effects=[],store=new Map(),calls={provider:0};
 let cursor=0;
 const fakeReact={
  useState(initial){const i=cursor++;if(!(i in values))values[i]=initial;
   return[values[i],v=>{values[i]=typeof v==='function'?v(values[i]):v}]},
  useEffect(fn,deps){const i=cursor++,old=values[i];
   if(!old||deps.some((v,n)=>!Object.is(v,old[n]))){values[i]=deps;effects.push(fn)}},
 };
 const memory={
  getItem:k=>store.get(k)??null,
  setItem(k,v){if(failSave)throw Error('quota denied');store.set(k,v)},
  removeItem:k=>store.delete(k),
 };
 const holder={exports:{}};
 vm.runInNewContext(compiled,{
  require(name){
   if(name==='react')return fakeReact;
   if(name==='react/jsx-runtime')return require('react/jsx-runtime');
   if(name==='./writing-ai-review')return {WritingAIReview:StubAI};
   throw Error('Unexpected import '+name);
  },module:holder,exports:holder.exports,localStorage:memory,
  window:{confirm:()=>true},Date,JSON,
 },{timeout:3000});
 const Component=holder.exports.AnyTopicWritingReview;
 const render=()=>{cursor=0;return Component()};
 const flush=()=>{for(let i=0;i<8&&effects.length;i++)for(const f of effects.splice(0))f()};
 const walk=(node,pred)=>{if(!node||typeof node!=='object')return null;
  if(pred(node))return node;
  for(const child of React.Children.toArray(node.props?.children)){const hit=walk(child,pred);if(hit)return hit}
  return null};
 const input=(id,text)=>{
  const el=walk(render(),e=>e.type==='textarea'&&e.props.id===id);
  assert(el,'Writing textarea missing '+id);el.props.onChange({target:{value:text}});flush();
 };
 const submit=()=>{
  const form=walk(render(),e=>e.type==='form');
  assert(form);form.props.onSubmit({preventDefault(){}});
 };
 return{render,flush,walk,input,submit,store,calls,StubAI};
}
{
 const h=makeHarness();
 h.render();h.flush();h.render();h.flush();
 assert.equal(h.walk(h.render(),e=>e.type===h.StubAI),null,'No Gemini control on an empty draft');
 h.input('any-topic-writing-topic','Describe your school library and why it helps.');
 h.input('any-topic-writing-content','A quiet reading area helps students focus and discover new books.');
 assert.equal(h.walk(h.render(),e=>e.type===h.StubAI),null,'Autosave alone must not call or display Gemini');
 h.submit();h.render();h.flush();
 const ai=h.walk(h.render(),e=>e.type===h.StubAI);
 assert(ai&&ai.props.enabled,'Successfully saved reviewed draft must enable optional Gemini');
 assert.equal(ai.props.kind,'draft');
 assert.equal(ai.props.fields.draft,'A quiet reading area helps students focus and discover new books.');
 h.input('any-topic-writing-content','I changed my writing before saving another review.');
 assert.equal(h.walk(h.render(),e=>e.type===h.StubAI),null,'Edited draft invalidates previous review eligibility');
 assert.equal(h.calls.provider,0,'No provider request before learner click');
}
{
 const h=makeHarness({failSave:true});
 h.render();h.flush();h.render();h.flush();
 h.input('any-topic-writing-topic','Describe a useful change at school.');
 h.input('any-topic-writing-content','A study room would give students a quiet place to read after lunch.');
 h.submit();h.render();h.flush();
 const ai=h.walk(h.render(),e=>e.type===h.StubAI);
 assert(ai&&!ai.props.enabled,'A failed local save MUST disable optional Gemini');
 assert.equal(h.calls.provider,0);
}

console.log('PASS any-topic-writing-review-shell: 2 required fields, save-bound optional Gemini, no automatic requests or official grade');
