import {browserCurriculumVault} from '../infrastructure/storage/indexeddb-curriculum-vault';
import {inspectLegacyCurriculumMirror,mirrorLegacyCurriculumToVault} from '../infrastructure/storage/legacy-curriculum-mirror';

const result=document.querySelector('#sle-idb-result') as HTMLElement;
function check(v:boolean,message:string){if(!v)throw Error(message)}
function record(version:string,lessonCount:number){
 return {id:'fixture-'+version,version,digest:'immutable-sha-'+version,at:1,
 source:{course:{id:'fixture-course'},lessons:Array.from({length:lessonCount},(_,i)=>({
  id:'GRA-A2-'+String(i+1).padStart(4,'0'),module:'grammar',
  title:'Synthetic independent item '+i,explanation:{en:'Example '+i+' '.repeat(400)},
  activities:[{id:'fixture-Q'+i,prompt:'Why does this work?'}]}))},
 };
}
const phase=new URL(location.href).searchParams.get('phase');
(async()=>{
 result.textContent='RUNNING_'+String(phase);
 const vault=browserCurriculumVault();
 const key='g-learning:english:v1:owner:local-family:academic-attempts';
 if(phase==='write'){
  localStorage.setItem(key,'[{"id":"immutable-historic","lessonId":"GRA-A2-0001","version":"1.18.1"}]');
  const exact=localStorage.getItem(key);
  check(await vault.putImmutable(record('1.18.1',109) as never)==='added','initial document not inserted');
  result.textContent='FIRST_PACKAGE_WRITTEN';
  check(await vault.putImmutable(record('1.18.1',109) as never)==='identical','same digest should be idempotent');
  let conflict=false;
  try{await vault.putImmutable({...record('1.18.1',109),digest:'different-digest'} as never)}catch(e){conflict=String(e).includes('Immutable curriculum version conflict')}
  check(conflict,'same-version different digest must never overwrite');
  let disguised=false;
  try{await vault.putImmutable(record('1.18.1',108) as never)}
  catch(e){disguised=String(e).includes('Immutable curriculum version conflict')}
  check(disguised,'Same digest with a changed source must also be rejected');
  for(let i=2;i<=9;i++){
   check(await vault.putImmutable(record('1.18.'+i,i<=4?200:250) as never)==='added','multi-version commit '+i);
   result.textContent='PACKAGE_'+i;
  }
  // S2 research: copy legacy curriculum versions into IDB without ever
  // deleting either the original package key or a learner attempt key.
  const original=localStorage.getItem(key);
  const packageKey='g-learning:english:v1:academic:packages';
  const legacy=JSON.stringify([record('1.18.1',109),record('1.17.0',10)]);
  localStorage.setItem(packageKey,legacy);
  const preflight=inspectLegacyCurriculumMirror(localStorage);
  check(preflight.attempts===1&&preflight.versions===2,'All owner-scoped attempts must be inventoried');
  const migration=await mirrorLegacyCurriculumToVault(localStorage,vault);
  check(migration.added.join(',')==='1.17.0','Only one genuinely new IDB version should be mirrored');
  check(localStorage.getItem(packageKey)===legacy&&localStorage.getItem(key)===original,
   'Content mirror must never mutate original learner or package keys');
  const docs=await vault.list();
  check(docs.length===10,'Ten versions including safe legacy mirror expected');
  check(docs.find(p=>p.version==='1.18.9')?.source.lessons.length===250,'250 lessons preserved in vault');
  check(localStorage.getItem(key)===exact,'learner attempts must remain byte-identical');
  check(localStorage.getItem(packageKey)===legacy,
   'Prototype must not alter or expand legacy localStorage content');
  // A complete verified V2 backup and its SHA must be checked by the
  // caller; the vault itself never reads/writes learner records.
  let denied=false;
  try{await vault.retainAfterVerifiedBackup(docs,
   [{version:'1.18.1',lessonId:'GRA-A2-0001'}],false)}
  catch(e){denied=String(e).includes('verified portable Recovery')}
  check(denied,'Unverified deletion of old sources must be denied');
  check((await vault.list()).length===10,'Refused cleanup must not mutate IndexedDB');
  const savedBefore=localStorage.getItem(key);
  const cleaned=await vault.retainAfterVerifiedBackup(docs,
   [{version:'1.18.1',lessonId:'GRA-A2-0001'}],true);
  check(cleaned.beforeVersions===10&&cleaned.afterVersions===2,
   'No-work old versions should be completely removed');
  const compacted=await vault.list();
  check(compacted.length===2,'Only latest full and the attempted historic source are retained');
  check(compacted.find(x=>x.version==='1.18.1')?.archive==='referenced-lessons'
   &&compacted.find(x=>x.version==='1.18.1')?.source.lessons.length===1,
   'Preserve exact old version source for historical work, not all 109 lessons');
  check(compacted.find(x=>x.version==='1.18.9')?.source.lessons.length===250,
   'Active 250-lesson content must remain complete');
  check(localStorage.getItem(key)===savedBefore,'One-time IndexedDB cleanup cannot mutate attempts');
  result.textContent='PASS_WRITE';
 }else if(phase==='reload'){
  const docs=await vault.list();
  check(docs.length===2,'Only required historic and latest versions must survive browser restart');
  check(!docs.find(x=>x.version==='1.17.0'),'Unused old source must stay removed');
  check(docs.find(x=>x.version==='1.18.1')?.archive==='referenced-lessons'
   &&docs.find(x=>x.version==='1.18.1')?.source.lessons.length===1,
   'Version-pinned attempted old lesson must remain after process restart');
  check(docs.find(x=>x.version==='1.18.9')?.source.lessons.length===250,'250-lesson fixture persisted');
  check((localStorage.getItem(key)||'').includes('immutable-historic'),'Historic learner attempt missing');
  result.textContent='PASS_RELOAD';
 }else throw Error('Unknown IndexedDB QA phase');
})().catch(e=>{result.textContent='FAIL '+String(e)+' '+String((e as Error)?.stack).slice(0,600)});
