import React from 'react';
import {createRoot} from 'react-dom/client';
import {ListeningDictationPractice} from '../app/listening-dictation';
import {buildTurnDictationSheet} from '../domain/listening-dictation';

// SYNTHETIC already-scored transcript, never the actual answer-bearing lesson.
const source=[
 'A: Morning neighbours. Welcome to the community garden today.',
 'B: The volunteers can organize a friendly morning workshop.',
 'A: We should prepare materials for the children and families.',
 'B: A small team will arrange a comfortable meeting space.',
 'A: Please remember the schedule and bring suitable equipment.',
 'B: Our helpers will explain the activities before lunch.',
 'A: Everyone can contribute different ideas to the discussion.',
 'B: Many participants enjoy learning through simple practical examples.',
 'A: Thanks for supporting this successful community project.'
].join('\n');
const status=document.getElementById('sle-test-result')!;
const root=document.getElementById('app')!;
const wait=async(test:()=>boolean,meaning:string)=>{
 for(let i=0;i<200;i++){if(test())return;await new Promise(r=>setTimeout(r,40))}
 throw Error('Timeout: '+meaning);
};
const check=(x:unknown,meaning:string)=>{if(!x)throw Error('DICTATION_BROWSER: '+meaning)};
(async()=>{
 createRoot(root).render(<ListeningDictationPractice attemptId="synthetic-scored-01"
  lessonId="LIS-A1-03" transcript={source}
  audioUrl="/foundation-audio/fixture-does-not-exist.mp3" durationSeconds={40}/>);
 await wait(()=>!!document.querySelector('[data-learning-interaction="ListeningDictation"]'),'component mount');
 const widget=document.querySelector('[data-learning-interaction="ListeningDictation"]') as HTMLElement;
 check(widget.textContent?.includes('after-submission practice'),'Must label scored-only practice');
 check(widget.textContent?.includes('Type the exact word spoken in the recording'),
  'Reviewer-required literal word instruction visible');
 check(widget.textContent?.includes('Literal Word Match'),'Honest feedback framing visible');
 const modes=[...widget.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')];
 check(modes.length===2,'Easy and extra modes must both be visible');
 check(modes[0].getAttribute('aria-pressed')==='true','Light mode is default');
 const speakerButtons=[...widget.querySelectorAll<HTMLButtonElement>('button.sle-turn-speaker-btn')];
 check(speakerButtons.length===9,'Exactly 9 A/B playback buttons, not 18 micro-sentences');
 check(speakerButtons.every(x=>x.disabled),
  'Must not play independent turns with unverified/wrong fixture MP3');
 check(widget.querySelector('audio')?.getAttribute('src')==='/foundation-audio/fixture-does-not-exist.mp3',
  'Source remains supplied audio, not a new TTS or alternate media');
 const easy=buildTurnDictationSheet(source,'LIS-A1-03','light');
 let blanks=widget.querySelectorAll<HTMLInputElement>('input.sle-turn-gap');
 check(blanks.length===5&&easy.gaps.length===5,'Five default desktop/iPad blanks');
 check(!widget.textContent?.includes('Practice check'),'No answer/grade before check');
 const first=blanks[0];
 const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!;
 setter.call(first,easy.gaps[0].answer);
 first.dispatchEvent(new Event('input',{bubbles:true}));
 await wait(()=>first.value===easy.gaps[0].answer,'React input accepted');
 first.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
 await wait(()=>document.activeElement===blanks[1],'Enter moves focus to next small input');
 const checkButton=[...widget.querySelectorAll<HTMLButtonElement>('button')].find(x=>x.textContent?.includes('Check exact words'));
 check(checkButton,'Exact-word check button visible');
 checkButton!.click();
 await wait(()=>!!widget.textContent?.includes('Practice check'),'Local word feedback shown');
 check(widget.textContent?.includes('/5 correct words'),'Never a Listening or CEFR grade');
 modes[1].click();
 const focused=buildTurnDictationSheet(source,'LIS-A1-03','focus');
 await wait(()=>widget.querySelectorAll<HTMLInputElement>('input.sle-turn-gap').length===focused.gaps.length,
  'Extra mode has 9 (not 20 or 30 percent) blanks');
 check(!widget.textContent?.includes('Practice check'),'Mode switch clears old check');
 check(widget.textContent?.includes('Answers stay in memory'),'No auto-persisted learner answers');
 status.textContent='PASS_DICTATION_BROWSER';
})().catch(e=>status.textContent='FAIL_DICTATION_BROWSER '+String(e)+' '+(e as Error).stack?.slice(0,700));
