import {planLessonRevisions,type ReleaseRecord,type SavedReference} from '../domain/lesson-revision-plan';
import {browserLessonRevisionVault} from '../infrastructure/storage/indexeddb-lesson-revision-vault';
const node=document.querySelector('#sle-idb-result') as HTMLElement;
const phase=new URL(location.href).searchParams.get('phase');
const sentinel='g-learning:english:v1:owner:local-family:academic-attempts';
const original='[{"id":"historic-attempt-stays-identical","lessonId":"WRI-A2-01","version":"1.18.1","status":"scored"}]';
function check(value:unknown,message:string){if(!value)throw Error(message)}
function makeLesson(id:string,kind:'writing'|'grammar'|'reading'|'synthetic'){
 if(kind==='writing')return {id,title:'Opinion paragraph',
  activities:[{id:id+'-Q1',type:'extended_response',prompt:'Write an opinion.',
   rubric_id:'RUBRIC-WRITING-A2'}]};
 if(kind==='grammar')return {id,title:'Present simple',
  activities:[{id:id+'-Q1',type:'single_choice',prompt:'Select the correct sentence.',
   options:[{id:'a',text:'She plays'},{id:'b',text:'She play'}],
   answer:{correct_option_id:'a'}}]};
 return {id,title:kind==='reading'?'Reading for gist':'Synthetic item '+id,
  activities:[{id:id+'-Q1',type:'single_choice',prompt:'Choose one of the answers '+id,
   options:[{id:'a',text:'A'},{id:'b',text:'B'}],answer:{correct_option_id:'b'}}]};
}
const writing=makeLesson('WRI-A2-01','writing');
const grammar=makeLesson('GRA-A2-01','grammar');
const reading=makeLesson('REA-A2-01','reading');
function makeRelease(version:string,lessons:ReturnType<typeof makeLesson>[],rubric:string):ReleaseRecord{
 return {id:'foundation-v1',version,digest:'upstream-validated-'+version,
 source:{course:{id:'foundation',sequence:lessons.map(l=>l.id)},lessons,
  rubrics:{'RUBRIC-WRITING-A2':{criteria:['task'],guidance:rubric}}}};
}
const v1=makeRelease('1.18.1',[writing,grammar],'Old rubric');
const v2=makeRelease('1.20.0',[writing,grammar,reading],'New rubric');
const extras=Array.from({length:247},(_,i)=>
 makeLesson('GRA-B2-'+String(i+4).padStart(4,'0'),'synthetic'));
const v3=makeRelease('1.21.0',[writing,grammar,reading,...extras],'New rubric');
const old:SavedReference={version:'1.18.1',lessonId:'WRI-A2-01',packageId:'foundation-v1'};
const second:SavedReference={version:'1.18.1',lessonId:'GRA-A2-01',packageId:'foundation-v1'};
const newAttempt:SavedReference={version:'1.20.0',lessonId:'WRI-A2-01',packageId:'foundation-v1'};
const vault=browserLessonRevisionVault();
(async()=>{
 node.textContent='RUNNING_'+phase;
 if(phase==='write'){
  localStorage.setItem(sentinel,original);
  const one=await planLessonRevisions([v1],[old]);
  const first=await vault.install(one);
  check(first.addedRevisions===2&&first.addedAliases===1,'R2 first release install');
  node.textContent='FIRST_MANIFEST_INSTALLED';
  const two=await planLessonRevisions([v1,v2],[old,second,newAttempt]);
  const secondInstall=await vault.install(two);
  check(secondInstall.addedRevisions===2&&secondInstall.addedAliases===2,
   'R2 true dedup and historical alias append');
  const previous=await vault.snapshot();
  check(previous.blobs.length===4&&previous.aliases.length===3,
   'Unchanged grammar shared, old Writing rubric preserved');
  const oldWriting=await vault.resolveHistoric('1.18.1','WRI-A2-01');
  const currentWriting=await vault.resolveCurrent('WRI-A2-01');
  check(oldWriting.revision!==currentWriting.revision,'Changed rubric cannot overwrite history');
  check((oldWriting.rubrics['RUBRIC-WRITING-A2'] as {guidance:string}).guidance==='Old rubric',
   'Old Writing rubric must be intact');
  check((currentWriting.rubrics['RUBRIC-WRITING-A2'] as {guidance:string}).guidance==='New rubric',
   'New Writing rubric must be intact');
  const unchanged=await vault.resolveHistoric('1.18.1','GRA-A2-01');
  const currentGrammar=await vault.resolveCurrent('GRA-A2-01');
  check(unchanged.revision===currentGrammar.revision,'Unchanged lesson must reuse one blob');
  const duplicate=await vault.install(two);
  check(duplicate.addedRevisions===0&&duplicate.addedAliases===0,'Idempotent refresh');
  const tampered=structuredClone(two);
  tampered.blobs[0].lesson.title='Tampered with valid old hash';
  let stopped=false;
  try{await vault.install(tampered)}catch{stopped=true}
  check(stopped,'Hash mismatches must fail before write transaction');
  let downgraded=false;
  try{await vault.install(one)}catch{downgraded=true}
  check(downgraded,'Old manifest must not downgrade current');
  check(JSON.stringify(await vault.snapshot())===JSON.stringify(previous),
   'Failed hash and downgrade must leave storage unchanged');

  // Real browser storage stress with 250 synthetic lessons, but not importer QA.
  const three=await planLessonRevisions([v1,v2,v3],[old,second,newAttempt]);
  const scaled=await vault.install(three);
  check(scaled.addedRevisions===247,'250-lesson content should add only 247 new blobs');
  const result=await vault.snapshot();
  check(result.active?.lessons.length===250&&result.blobs.length===251,
   '250 current unique lesson revisions plus 1 old Writing rubric');
  check(result.aliases.length===3,'Keep precisely original referenced aliases');
  node.textContent='STORED_250_LESSONS';
  const invalidOld=structuredClone(v1);
  invalidOld.source.lessons[0].title='Same lesson ID, different original content';
  const forged=await planLessonRevisions([invalidOld,v2,v3],[old,second,newAttempt]);
  let rejected=false;
  try{await vault.install(forged)}catch{rejected=true}
  check(rejected,'Historical alias collision must atomically roll back');
  check((await vault.snapshot()).blobs.length===251,
   'Rejected historical conflict may not leave orphan revision blobs');
  check(localStorage.getItem(sentinel)===original,'All original learner data must be byte-identical');
  node.textContent='PASS_WRITE';
 }else if(phase==='reload'){
  const snap=await vault.snapshot();
  check(snap.active?.version==='1.21.0'&&snap.active.lessons.length===250,
   'Active manifest survives a fresh Chromium browser process');
  check(snap.blobs.length===251&&snap.aliases.length===3,
   'Deduplicated historical/active source persists');
  const historic=await vault.resolveHistoric('1.18.1','WRI-A2-01');
  check((historic.rubrics['RUBRIC-WRITING-A2'] as {guidance:string}).guidance==='Old rubric',
   'Exact original Writing rubric survived a process restart');
  const grammar=await vault.resolveCurrent('GRA-A2-01');
  check(grammar.lesson.id==='GRA-A2-01','Current lesson resolves after restart');
  check(localStorage.getItem(sentinel)===original,'Learner attempt key survived unchanged');
  let missing=false;
  try{await vault.resolveHistoric('1.17.0','NOT_FOUND')}catch{missing=true}
  check(missing,'Missing history fails closed rather than resolving to newest lesson');
  node.textContent='PASS_RELOAD';
 }else throw Error('Unknown revision IndexedDB browser QA phase');
})().catch(err=>{
 node.textContent='FAIL '+String(err)+' '+String((err as Error)?.stack).slice(0,650);
});
