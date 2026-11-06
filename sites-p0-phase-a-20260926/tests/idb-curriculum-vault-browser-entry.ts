import {browserCurriculumVault} from '../infrastructure/storage/indexeddb-curriculum-vault';

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
  const docs=await vault.list();
  check(docs.length===9,'nine immutable version packages expected');
  check(docs.find(p=>p.version==='1.18.9')?.source.lessons.length===250,'250 lessons preserved in vault');
  check(localStorage.getItem(key)===exact,'learner attempts must remain byte-identical');
  check(!localStorage.getItem('g-learning:english:v1:academic:packages'),
   'prototype must not grow localStorage curriculum key');
  result.textContent='PASS_WRITE';
 }else if(phase==='reload'){
  const docs=await vault.list();
  check(docs.length===9,'Nine packages must survive browser process restart');
  check(docs.find(x=>x.version==='1.18.1')?.source.lessons.length===109,'historical source preserved');
  check(docs.find(x=>x.version==='1.18.9')?.source.lessons.length===250,'250-lesson fixture persisted');
  check((localStorage.getItem(key)||'').includes('immutable-historic'),'Historic learner attempt missing');
  result.textContent='PASS_RELOAD';
 }else throw Error('Unknown IndexedDB QA phase');
})().catch(e=>{result.textContent='FAIL '+String(e)+' '+String((e as Error)?.stack).slice(0,600)});
