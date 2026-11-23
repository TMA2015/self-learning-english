'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {buildTurnDictationSheet,checkDictationAnswers,splitSpeakerTurns,
 type TurnPracticeMode} from '../domain/listening-dictation';
import {ORIGINAL_TURN_ASSETS,prepareOriginalTurnReplay,type TurnRange}
 from '../domain/listening-turn-replay';
import './listening-dictation.css';

/**
 * Only mounted by Foundation when attempt.status === 'scored' AND the gated
 * transcript endpoint has returned the authorized post-submit transcript.
 * Optional, memory-only practice: never writes a scored Listening attempt.
 */
export function ListeningDictationPractice({
 attemptId,lessonId,transcript,audioUrl,durationSeconds
}:{
 attemptId:string;lessonId:string;transcript:string;audioUrl:string;
 durationSeconds?:number
}){
 const [mode,setMode]=useState<TurnPracticeMode>('light');
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [checked,setChecked]=useState(false);
 const [ranges,setRanges]=useState<TurnRange[]>([]);
 const [mediaState,setMediaState]=useState<'preparing'|'ready'|'unavailable'>('preparing');
 const [mediaMessage,setMediaMessage]=useState('');
 const [activeLine,setActiveLine]=useState<string|null>(null);
 const root=useRef<HTMLElement|null>(null);
 const audio=useRef<HTMLAudioElement|null>(null);
 const endMs=useRef<number|null>(null);
 const turns=useMemo(()=>splitSpeakerTurns(transcript),[transcript]);
 const expected=ORIGINAL_TURN_ASSETS[lessonId];
 const sourceReady=Boolean(expected&&turns.length===expected.turnCount);
 const sheet=useMemo(()=>{
  if(!sourceReady)return null;
  try{return buildTurnDictationSheet(transcript,lessonId,mode)}
  catch{return null}
 },[sourceReady,transcript,lessonId,mode]);
 const checkedResults=useMemo(()=>sheet&&checked?checkDictationAnswers(sheet,answers):[],[sheet,checked,answers]);
 const resultById=new Map(checkedResults.map(x=>[x.id,x]));
 const gapById=new Map(sheet?.gaps.map(x=>[x.id,x])??[]);
 const score=checkedResults.filter(r=>r.correct).length;
 const playbackReady=mediaState==='ready'&&ranges.length===turns.length;
 const [retrySeq,setRetrySeq]=useState(0);
 useEffect(()=>{
  setAnswers({});setChecked(false);
  audio.current?.pause();endMs.current=null;setActiveLine(null);
 },[attemptId,lessonId,mode,transcript]);
 useEffect(()=>{
  let active=true;
  const controller=new AbortController();
  audio.current?.pause();endMs.current=null;setActiveLine(null);
  setRanges([]);setMediaState('preparing');setMediaMessage('');
  if(!sourceReady||!audioUrl){
   setMediaState('unavailable');setMediaMessage('Original recording or speaker-turn transcript is unavailable.');
   return ()=>controller.abort();
  }
  void prepareOriginalTurnReplay(lessonId,audioUrl,turns,controller.signal)
   .then(found=>{
    if(!active)return;
    setRanges(found);setMediaState('ready');
    setMediaMessage('Original MP3 checked · '+found.length+' speaker turns ready.');
   })
   .catch(error=>{
    if(!active)return;
    setRanges([]);setMediaState('unavailable');
    setMediaMessage('Turn replay unavailable: '+String(error instanceof Error?error.message:error)+
     ' You can still play the full recording.');
   });
  return ()=>{active=false;controller.abort();audio.current?.pause();endMs.current=null};
 },[sourceReady,lessonId,audioUrl,transcript,retrySeq]);
 function stopTurn(){
  endMs.current=null;setActiveLine(null);audio.current?.pause();
 }
 async function playWhole(){
  const player=audio.current;if(!player)return;
  stopTurn();setMediaMessage('');
  try{player.currentTime=0;await player.play()}
  catch{setMediaMessage('Could not play the original recording on this device.')}
 }
 async function playTurn(index:number){
  const player=audio.current,range=ranges[index];
  if(!playbackReady||!range||!player)return;
  stopTurn();setActiveLine('L'+(index+1));endMs.current=range.endMs;
  try{
   player.currentTime=range.startMs/1000;
   await player.play();
  }catch{
   stopTurn();setMediaMessage('Turn audio could not start. Try the full recording.');
  }
 }
 function checkTime(){
  if(!audio.current||endMs.current===null)return;
  if(audio.current.currentTime*1000>=endMs.current-45)stopTurn();
 }
 function nextInput(current:HTMLInputElement){
  const inputs=Array.from(root.current?.querySelectorAll<HTMLInputElement>('input.sle-turn-gap')??[]);
  const index=inputs.indexOf(current);
  if(index>=0)inputs[(index+1)%inputs.length]?.focus();
 }
 if(!sheet||!audioUrl)return null;
 return <section ref={root} className="sle-turn-practice" data-learning-interaction="ListeningDictation"
  aria-label="Post-submission listening dictation practice">
  <header className="sle-turn-header">
   <div className="sle-turn-heading">
    <strong>✎ Listening practice · Fill the gaps</strong>
    <span>{lessonId} · {turns.length} speaker turns</span>
   </div>
   <div className="sle-turn-modes" role="group" aria-label="Practice difficulty">
    <button type="button" aria-pressed={mode==='light'} onClick={()=>setMode('light')}
     className={mode==='light'?'selected':''}>Light · {buildTurnDictationSheet(transcript,lessonId,'light').gaps.length} words</button>
    <button type="button" aria-pressed={mode==='focus'} onClick={()=>setMode('focus')}
     className={mode==='focus'?'selected':''}>Extra practice · {turns.length} words</button>
   </div>
  </header>
  <div className="sle-turn-tools">
   <button type="button" className="sle-turn-whole" onClick={()=>void playWhole()}>
    ▶ Full recording
   </button>
   <span role="status" className="sle-turn-media-status">
    {mediaState==='preparing'?'Checking original MP3 and locating A/B turns…':
     mediaState==='ready'?'✓ '+turns.length+' A/B turns ready':
     'Turn replay unavailable'}
   </span>
   {mediaState==='unavailable'&&<button type="button" className="sle-turn-retry"
    onClick={()=>setRetrySeq(v=>v+1)}>Try again</button>}
  </div>
  {mediaMessage&&<p className="sle-turn-helper" role="status">{mediaMessage}</p>}
  <p className="sle-turn-instruction">
   <strong>Type the exact word spoken in the recording.</strong> Listen to each whole speaker turn,
   then fill one small gap where shown. <strong>Literal Word Match</strong> only.
  </p>
  <audio ref={audio} preload="metadata" src={audioUrl} onTimeUpdate={checkTime}
   onEnded={()=>{endMs.current=null;setActiveLine(null)}}
   onError={()=>setMediaMessage('The recording cannot be loaded; please retry.')}/>
  <div className="sle-turn-lines" role="list" aria-label="Original speaker turns">
   {sheet.lines.map((line,i)=>{
    const speakerMatch=line.displayText.match(/^\s*[\p{L}][\p{L} .'-]{0,22}:\s*/u);
    const speaker=speakerMatch?.[0]||'';
    return <div className={'sle-turn-line'+(activeLine===line.id?' playing':'')} key={line.id} role="listitem">
     <span className="sle-turn-number">{String(i+1).padStart(2,'0')}</span>
     <div className="sle-turn-text">
      <strong className="sle-turn-speaker">{speaker}</strong>
      {line.parts.map((part,j)=>{
       if(part.kind==='text'){
        const text=(j===0&&speaker)?part.text.slice(speaker.length):part.text;
        return <span key={'t-'+j}>{text}</span>;
       }
       const gap=gapById.get(part.id);
       const feedback=resultById.get(part.id);
       return <span key={part.id} className="sle-turn-input-wrap">
        <input className={'sle-turn-gap'+(feedback?(feedback.correct?' correct':' wrong'):'')}
         type="text" autoComplete="off" autoCorrect="off" spellCheck={false}
         aria-label={'Missing word in speaker turn '+(i+1)}
         style={{width:Math.max(60,Math.min(110,(gap?.answer.length||6)*9+12))+'px'}}
         value={answers[part.id]??''}
         onChange={event=>{setAnswers(old=>({...old,[part.id]:event.target.value}));setChecked(false)}}
         onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();nextInput(event.currentTarget)}}}
        />
        {feedback&&!feedback.correct&&<small className="sle-turn-correct-word">{feedback.expected}</small>}
       </span>;
      })}
     </div>
     <button className="sle-turn-speaker-btn" type="button" title={'Play speaker turn '+(i+1)}
      aria-label={'Play speaker turn '+(i+1)} disabled={!playbackReady}
      onClick={()=>void playTurn(i)}>{activeLine===line.id?'◼':'🔊'}</button>
    </div>;
   })}
  </div>
  <footer className="sle-turn-footer">
   <div className="sle-turn-actions">
    <button type="button" className="sle-turn-check" onClick={()=>setChecked(true)}>
     ✓ Check exact words
    </button>
    <button type="button" className="sle-turn-clear" onClick={()=>{
     stopTurn();setAnswers({});setChecked(false);
    }}>↻ Try again</button>
   </div>
   <p className="sle-turn-count" role="status">
    {sheet.gaps.length} blanks · {sheet.gaps.filter(g=>(answers[g.id]??'').trim()).length} filled
    · Case-insensitive · Enter: next blank
   </p>
   {checked&&<p className="sle-turn-result" role="status">
    <strong>Literal Word Match:</strong> Practice check {score}/{sheet.gaps.length} correct words.
    This is not a Listening score or CEFR evaluation.
   </p>}
   <p className="sle-turn-disclaimer">
    Optional after-submission practice only. Answers stay in memory and never change scored work.
   </p>
  </footer>
 </section>;
}
