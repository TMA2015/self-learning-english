import React from 'react';
import {createRoot} from 'react-dom/client';
import {ListeningDictationPractice} from '../app/listening-dictation';
import {buildDictationSheet} from '../domain/listening-dictation';

const source="Guide: The workshop starts on Saturday at ten thirty. Please bring a small container and a notebook.\n"+
 "Student: Thank you. We can meet outside the library and share our notes after the workshop.";
const status=document.getElementById('sle-test-result')!;
const root=document.getElementById('app')!;
const wait=async(test:()=>boolean,meaning:string)=>{
 for(let i=0;i<200;i++){if(test())return;await new Promise(r=>setTimeout(r,40))}
 throw Error('Timeout: '+meaning);
};
const check=(x:unknown,meaning:string)=>{if(!x)throw Error('DICTATION_BROWSER: '+meaning)};
const changeSelect=(id:string,value:string)=>{
 const input=document.getElementById(id) as HTMLSelectElement|null;
 check(input,'Missing select '+id);
 Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value')?.set?.call(input,value);
 input!.dispatchEvent(new Event('change',{bubbles:true}));
};
(async()=>{
 createRoot(root).render(<ListeningDictationPractice attemptId="synthetic-scored-01"
  transcript={source} audioUrl="/foundation-audio/fixture-does-not-exist.mp3"
  durationSeconds={40}/>);
 await wait(()=>!!document.querySelector('[data-learning-interaction="ListeningDictation"]'),'component mount');
 const widget=document.querySelector('[data-learning-interaction="ListeningDictation"]') as HTMLElement;
 check(widget.textContent?.includes('after your Listening submission'),'Post-submit label shown');
 check(widget.textContent?.includes('Type the exact word spoken in the recording'),
  'Reviewer-required exact transcription instruction appears before the learner types');
 check(widget.textContent?.includes('Literal Word Match'),
  'Reviewer-required literal-only feedback framing appears before answer check');
 const modes=[...widget.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')];
 check(modes.length===2,'Two replay modes visible');
 check(modes[1].disabled,'Unverified sentence playback must be disabled');
 check(widget.textContent?.includes('no timings are guessed'),'Sentence-mode warning clearly visible');
 check(widget.querySelector('audio')?.getAttribute('src')==='/foundation-audio/fixture-does-not-exist.mp3',
  'Practice audio uses supplied recording, not a TTS replacement');
 const medium=buildDictationSheet(source,20);
 let blanks=widget.querySelectorAll<HTMLInputElement>('input[type="text"]');
 check(blanks.length===medium.gaps.length,'Medium mode has deterministic masked input fields');
 check(!widget.textContent?.includes('Practice check:'),'No grade or answer before check');
 const first=blanks[0];
 const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!;
 setter.call(first,medium.gaps[0].answer);
 first.dispatchEvent(new Event('input',{bubbles:true}));
 await wait(()=>first.value===medium.gaps[0].answer,'React controlled answer accepted');
 const checkButton=[...widget.querySelectorAll<HTMLButtonElement>('button')].find(x=>x.textContent?.includes('Check exact words'));
 check(checkButton,'Check action accessible');
 checkButton!.click();
 await wait(()=>!!widget.textContent?.includes('Practice check:'),'Check completed');
 check(widget.textContent?.includes('Literal Word Match'),
  'Answer result is explicitly labelled Literal Word Match');
 check(widget.textContent?.includes('/'+medium.gaps.length+' exact words'),'Only practice feedback, no language score');
 changeSelect('sle-dictation-density','30');
 const hard=buildDictationSheet(source,30);
 await wait(()=>widget.querySelectorAll<HTMLInputElement>('input[type="text"]').length===hard.gaps.length,
  'Hard mode rerendered with different gaps');
 check(!widget.textContent?.includes('Practice check:'),'Density change clears prior practice comparison');
 check(widget.textContent?.includes('no automatic save'),'Honest temporary practice storage');
 status.textContent='PASS_DICTATION_BROWSER';
})().catch(e=>status.textContent='FAIL_DICTATION_BROWSER '+String(e)+' '+(e as Error).stack?.slice(0,700));
