import React from 'react';
import {createRoot} from 'react-dom/client';
import {WritingSourceBundle} from '../app/writing-source-bundle';
import {writingSourceContractFor} from '../domain/writing-source-contracts';

const q=new URL(location.href).searchParams;
const phase=q.get('phase')??'ok';
const lessonId=q.get('lesson')??'WRI-A2-07';
const source=writingSourceContractFor(lessonId);
const out=document.getElementById('sle-test-result')!;
const check=(ok:unknown,msg:string)=>{
 if(!ok)throw Error('WRITING_SOURCE_BROWSER '+lessonId+' '+phase+' '+msg);
};
const wait=async(test:()=>boolean,msg:string)=>{
 for(let i=0;i<240;i++){
  if(test())return;
  await new Promise(resolve=>setTimeout(resolve,35));
 }
 throw Error('Timeout '+msg);
};
const buttons=()=>[...document.querySelectorAll('button')] as HTMLButtonElement[];
const findButton=(id:string)=>buttons().find(b=>b.textContent?.includes(id));
const opened:string[]=[];
if(phase!=='ok'&&phase!=='unavailable'&&phase!=='standalone'){
 const originFetch=window.fetch.bind(window);
 window.fetch=(input,init)=>{
  if(typeof input==='string'&&input.includes('/api/foundation?lesson='))
   return originFetch(input+'&phase='+encodeURIComponent(phase),init);
  return originFetch(input,init);
 };
}
(async()=>{
 createRoot(document.getElementById('app')!).render(
  <WritingSourceBundle lessonId={lessonId} version="1.25.0"
   availableLessonIds={phase==='unavailable'?[]:
    source?[source.readingLessonId,...(source.listeningLessonId?[source.listeningLessonId]:[])]:[]}
   disabled={false} onOpenSource={id=>opened.push(id)}/>
 );
 if(phase==='standalone'){
  await new Promise(resolve=>setTimeout(resolve,130));
  check(!document.querySelector('.writing-source-bundle'),'No unrelated source panel for independent Writing task');
  out.textContent='PASS_STANDALONE_WRITING';return;
 }
 check(!!source,'source contract must exist');
 await wait(()=>!!document.querySelector('[aria-label="Required sources for '+lessonId+'"]'),'source bundle mount');
 const expected=['1. Read',...(source!.listeningLessonId?['2. Listen']:[]),
  source!.listeningLessonId?'3. Write':'2. Write'];
 const headings=[...document.querySelectorAll('.writing-source-step h4')]
  .map(e=>e.textContent?.trim()??'');
 check(headings.length===expected.length&&headings.every((x,i)=>x.startsWith(expected[i])),
  'Read → optional Listen → Write must appear on SAME screen');
 check(!!findButton(source!.readingLessonId),
  'Original canonical Reading still available, but optional');
 check(!document.querySelector('.writing-source-optional-lessons')?.hasAttribute('open'),
  'Original graded lessons must be collapsed by default');
 check(opened.length===0,'No forced navigation to source lessons');
 check(!document.body.innerText.includes('PROTECTED_LISTENING_TRANSCRIPT'),
  'Never expose the protected Listening transcript');
 if(phase==='ok'){
  await wait(()=>!!document.querySelector('[aria-label="Original Reading source"]'),
   'canonical original Reading loaded');
  const notice=document.querySelector('[aria-label="Original Reading source"]')!;
  check((notice.textContent??'').length>100&&
   (notice.textContent??'').includes(source!.readingLessonId),
   'Full authored Reading source is shown, not a generic paraphrase');
  if(source!.listeningLessonId){
   await wait(()=>!!document.querySelector('[aria-label="Original spoken source '+source!.listeningLessonId+'"]'),
    'original audio loaded inline');
   const audio=document.querySelector('audio') as HTMLAudioElement;
   check(!!audio?.controls&&audio.preload==='none',
    'Inline original audio player must be accessible and ready');
   check(audio.getAttribute('src')?.includes('/foundation-audio/'+source!.listeningLessonId+'-v1.mp3'),
    'Audio must use original manifest path and correct lesson');
   check(document.body.innerText.includes('does not complete or grade'),
    'Reference player must disclaim Listening credit');
   check(!!findButton(source!.listeningLessonId),
    'Original assessed Listening remains available in optional section');
  }else{
   check(!document.querySelector('audio'),
    'Reading-only task must NOT pick up an unrelated Listening lesson');
  }
  check(opened.length===0,'No lesson transition to finish Writing');
  const details=document.querySelector('.writing-source-optional-lessons') as HTMLDetailsElement;
  details.open=true;findButton(source!.readingLessonId)!.click();
  if(source!.listeningLessonId)findButton(source!.listeningLessonId)!.click();
  const expectedOpened=[source!.readingLessonId,
   ...(source!.listeningLessonId?[source!.listeningLessonId]:[])];
  check(opened.join(',')===expectedOpened.join(','),
   'Optional buttons retain canonical draft-safe player callbacks');
  out.textContent='PASS_INLINE_SOURCE_FLOW';
 }else if(phase==='missing'||phase==='wrongVersion'){
  await wait(()=>document.body.innerText.includes('Could not load the original written source'),
   'Missing/mismatched Reading source warning');
  if(source!.listeningLessonId)await wait(()=>document.body.innerText.includes('Could not load the original recording'),
   'Missing/mismatched Listening source warning');
  check(!document.querySelector('audio'),'Never show missing or mismatched audio');
  out.textContent='PASS_SOURCE_FAIL_CLOSED';
 }else if(phase==='audioMissing'||phase==='audioWrongUrl'){
  check(!!source!.listeningLessonId,'Failure fixture requires a Listening source');
  await wait(()=>!!document.querySelector('[aria-label="Original Reading source"]'),
   'original Reading still visible');
  await wait(()=>document.body.innerText.includes('Could not load the original recording'),
   'missing/invalid MP3 blocked');
  check(!document.querySelector('audio'),'Invalid audio must not render');
  out.textContent='PASS_AUDIO_FAIL_CLOSED';
 }else if(phase==='unavailable'){
  await wait(()=>document.body.innerText.includes('not imported on this device'),
   'source catalog warning');
  check(!document.querySelector('audio')&&!document.querySelector('.foundation-passage'),
   'no source material from missing catalog');
  check(findButton(source!.readingLessonId)!.disabled,'No false Reading route');
  if(source!.listeningLessonId)check(findButton(source!.listeningLessonId)!.disabled,
   'No false Listening route');
  out.textContent='PASS_MISSING_CATALOG';
 }else throw Error('Unknown phase '+phase);
})().catch(e=>{
 out.textContent='FAIL '+String(e)+' '+String((e as Error).stack).slice(0,900);
});
