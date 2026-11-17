'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const component=read('app/writing-ai-review.tsx');
const services=read('infrastructure/browser/client-services.ts');
const browser=read('infrastructure/browser/firebase-ai-browser.ts');
const foundation=read('app/foundation.tsx');
const b=read('app/writing-course-v2-b.tsx');
const c=read('app/writing-course-v2-c.tsx');
const home=read('app/home-client.tsx');
assert(component.includes("status==='validated'")&&!component.includes('Automatically graded'));
assert(component.includes('Only clicking this button sends'));
assert(!component.includes('GEMINI_API_KEY')&&!component.includes('serviceAccount')); // no credential path
assert(component.includes('Get AI feedback'));
assert(component.includes('sourceSample')&&component.includes('provisional'));
assert(component.includes('localStorage.setItem')&&component.includes('fingerprint(signature)'));
assert(component.includes("latestSignature.current!==requestedSignature"),'Stale Gemini response must not grade edited text');
assert(b.includes("<WritingAIReview")&&b.includes("week===5?'draft':'planning'"));
assert(c.includes("<WritingAIReview")&&c.includes("sourceSample={revision?.sourceSample??work.source?.ownership==='sample'}"),'Sample-based authorship must come from the saved revision when available');
assert(foundation.includes("<WritingAIReview")&&foundation.includes("attempt.status==='pending_review'"));
assert(services.includes("tutor.teachWriting(draft,task")&&services.includes("tutor.coach(kind==='revision'?'revision':'analysis',task"));
assert(services.includes("scores:null,level:null"),'Revision coaching must not assign scores or level');
const registry=require('../ai/prompts/registry.json');
assert.equal(registry['revision-coaching'].status,'active');
assert.equal(registry['revision-coaching'].version,'1.1.0');
for(const required of ['sourceOwnership','originalText','revisedText','no-change','No numeric scores','Sample Student Draft']){
 assert(registry['revision-coaching'].system.includes(required),'Revision AI prompt must cover '+required);
}
for(const required of ['Follow the trusted responseLanguage field if provided','Use safe Markdown formatting (bolding, bullet lists)',"'corrections' MUST be an empty array []","'scores' MUST be null",'briefly quote the stated revisionGoal']){
 assert(registry['revision-coaching'].system.includes(required),'NotebookLM correction missing: '+required);
}
const serviceSource=read('ai/service.ts');
assert(serviceSource.includes("stage==='revision'?'revision-coaching':stage==='any-topic'?'any-topic-writing':'feedback'"),'Distinct revision and Any Topic prompts must be routed explicitly');
assert(serviceSource.includes("scores:stage!=='revision'"));
const laterPage=read('app/writing-course-v2-c.tsx');
assert(laterPage.includes('revisionAIContext(week,work)'));
assert(laterPage.includes("kind={editing?'revision':'draft'}"));
assert(laterPage.includes("responseLanguage={showVi?'vi':'en'}"));
assert(services.includes("...(kind==='revision'?{responseLanguage}:{})"));
assert(component.includes("...(reviewMode==='any-topic'?[reviewMode,responseLanguage,'academic-r1']:[])"),'Any Topic must invalidate old scored cache and language variants');
assert(component.includes('requestWritingAI(task,fields,kind,responseLanguage,reviewMode)'));
assert(services.includes("tutor.coach('any-topic'"),'Any Topic must bypass numeric Writing scoring');
assert(component.includes('<TeachingBlocks text={visibleFeedback.summary}/>'));
assert(component.includes('<Inline text={s}/>'));
assert(laterPage.includes('enabled={saved&&!busy&&!error&&(!editing||!!revision)}'));
assert(services.includes("status:'unavailable'")&&services.includes("scores:null,level:null"));
assert(browser.includes("resetAIFailure")&&browser.includes("readAIFailure"));
assert(browser.includes('await getToken(appCheckInstance)'));
assert(read('infrastructure/ai/firebase-request-lifecycle.ts').includes('timeoutMs=60_000'),'Slow Gemini requests need sixty-second deadline');
assert(browser.includes("SafeProviderError('app-check-permission')"));
assert(browser.includes("maxOutputTokens:2400")&&!/generationConfig:\s*\{[^}]*temperature\s*:/s.test(browser));
assert(!home.includes('>Private preview</span>'));
assert(home.includes('✦ AI Writing · optional'));

/** The shared reviewer must never show a cached answer when the saved attempt
 * becomes ineligible. This runs its actual React hooks with a local-only store. */
{
 const ts=require('typescript'),vm=require('node:vm'),React=require('react');
 const source=component;
 const compiled=ts.transpileModule(source,{fileName:'writing-ai-review.tsx',compilerOptions:{
  module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,
 }}).outputText;
 const slots=[],effects=[],store=new Map();
 let cursor=0,requests=0,release;
 const fake={
  useState(initial){const i=cursor++;if(!(i in slots))slots[i]=initial;
   return [slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v}]},
  useRef(initial){const i=cursor++;if(!(i in slots))slots[i]={current:initial};return slots[i]},
  useEffect(fn,deps){const i=cursor++;const old=slots[i];
   if(!old||deps?.some((v,n)=>!Object.is(v,old[n]))){slots[i]=deps;effects.push(fn)}},
 };
 const storage={
  getItem:key=>store.get(key)??null,
  setItem:(key,value)=>{store.set(key,value)},
 };
 const holder={exports:{}};
 vm.runInNewContext(compiled,{
  module:holder,exports:holder.exports,localStorage:storage,Date,JSON,
  require(name){
   if(name==='react')return fake;
   if(name==='react/jsx-runtime')return require('react/jsx-runtime');
   if(name==='./teaching-blocks')return {TeachingBlocks:()=>null,Inline:()=>null};
   if(name==='../infrastructure/browser/client-services')
    return {requestWritingAI:()=>{requests++;return new Promise(resolve=>{release=resolve})}};
   throw Error('Unexpected module '+name);
  },
 },{timeout:3000});
 const render=enabled=>{cursor=0;return holder.exports.WritingAIReview({
  reviewId:'any-topic-writing',task:'Describe a useful library',
  fields:{draft:'My school library helps me read.'},kind:'draft',enabled,
 })};
 const flush=()=>{for(const e of effects.splice(0))e()};
 const collect=node=>{
  if(node===null||node===undefined||typeof node==='boolean')return '';
  if(typeof node==='string'||typeof node==='number')return String(node);
  return React.Children.toArray(node.props?.children).map(collect).join(' ');
 };
 const find=(node,pred)=>{
  if(!node||typeof node!=='object')return null;
  if(pred(node))return node;
  for(const child of React.Children.toArray(node.props?.children)){
   const match=find(child,pred);if(match)return match;
  }
  return null;
 };
 const sig=JSON.stringify(['Describe a useful library',{draft:'My school library helps me read.'},'draft']);
 function fp(value){let a=2166136261,b=2246822519;
  for(let i=0;i<value.length;i++){const c=value.charCodeAt(i);a=Math.imul(a^c,16777619);b=Math.imul(b^c,2246822519)}
  return (a>>>0).toString(16)+(b>>>0).toString(16);
 }
 const key='g-learning:english:ai-feedback:v1:any-topic-writing:'+fp(sig);
 const cached={provider:'firebase-ai-logic',kind:'draft',model:'synthetic',
  summary:'PRIVATE CACHED COMMENT',strengths:[],improvements:[],exercise:'',
  scores:null,level:null,corrections:[]};
 store.set(key,JSON.stringify(cached));
 let tree=render(false);flush();tree=render(false);
 assert(!collect(tree).includes('PRIVATE CACHED COMMENT'),
  'An unsaved/disabled draft must never reveal cached Gemini feedback');
 assert.equal(requests,0,'No AI call during cache hydration');
 tree=render(true);flush();tree=render(true);
 assert(collect(tree).includes('PRIVATE CACHED COMMENT'),
  'The same previously saved draft may show its valid cached feedback');
 tree=render(false);
 assert(!collect(tree).includes('PRIVATE CACHED COMMENT'),
  'Disabling AI hides prior feedback immediately, even before effect cleanup');
 flush();
 store.delete(key);
 tree=render(true);flush();tree=render(true);
 const button=find(tree,e=>e.type==='button'&&collect(e).includes('Get AI feedback'));
 assert(button&&!button.props.disabled,'Eligible draft can request a new response');
 button.props.onClick();
 assert.equal(requests,1,'Only direct clicking can request Gemini');
 tree=render(false);flush();
 release({status:'validated',feedback:{...cached,summary:'LATE PRIVATE RESPONSE'}});
 // The async continuation is intentionally allowed to settle without a UI/cache write.
 Promise.resolve().then(()=>{
  assert(!store.has(key),'Late response after losing eligibility must not write cache');
  assert(!collect(render(false)).includes('LATE PRIVATE RESPONSE'),
   'Late response must not be displayed for an unsaved draft');
 }).catch(e=>{process.nextTick(()=>{throw e})});
}

console.log(JSON.stringify({status:'PASS',suite:'writing-ai-on-demand',weeklyCoaching:'weeks 2–12',foundationWriting:'optional',statusTruthful:true,liveGeminiCalls:0}));
