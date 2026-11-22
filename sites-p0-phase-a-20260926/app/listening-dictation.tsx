'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {buildDictationSheet,checkDictationAnswers,validVerifiedSegments,
 type DictationDensity,type VerifiedSentenceSegment} from '../domain/listening-dictation';

export function ListeningDictationPractice({
 attemptId,transcript,audioUrl,durationSeconds,assetSha256,verifiedSegments
}:{
 attemptId:string;transcript:string;audioUrl:string;durationSeconds?:number;
 assetSha256?:string;verifiedSegments?:readonly VerifiedSentenceSegment[]
}){
 const [density,setDensity]=useState<DictationDensity>(20);
 const [mode,setMode]=useState<'whole'|'sentence'>('whole');
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [checked,setChecked]=useState(false);
 const [audioError,setAudioError]=useState('');
 const [activeLine,setActiveLine]=useState<string|null>(null);
 const audio=useRef<HTMLAudioElement|null>(null);
 const segmentEndMs=useRef<number|null>(null);
 const sheet=useMemo(()=>buildDictationSheet(transcript,density),[transcript,density]);
 const enabledSegments=validVerifiedSegments(sheet.lines,verifiedSegments,assetSha256,durationSeconds);
 const results=useMemo(()=>checked?checkDictationAnswers(sheet,answers):[],[sheet,answers,checked]);
 const byGap=new Map(results.map(r=>[r.id,r]));
 const correct=results.filter(r=>r.correct).length;
 useEffect(()=>{
  // Key the component by attempt in the parent; version/density changes reset
  // volatile practice only, never any scored attempt answers or progress.
  setAnswers({});setChecked(false);setAudioError('');
  segmentEndMs.current=null;setActiveLine(null);
  audio.current?.pause();
 },[attemptId,transcript,density]);
 useEffect(()=>()=>{audio.current?.pause();segmentEndMs.current=null},[]);
 async function replayWhole(){
  if(!audio.current)return;
  segmentEndMs.current=null;setActiveLine(null);setAudioError('');
  try{audio.current.pause();audio.current.currentTime=0;await audio.current.play();}
  catch{setAudioError('Could not play this recording. Dictation stays unassessed.');}
 }
 async function replayLine(lineId:string){
  if(!enabledSegments||!audio.current)return;
  const segment=verifiedSegments?.find(s=>s.lineId===lineId);
  if(!segment)return;
  try{
   audio.current.pause();segmentEndMs.current=segment.endMs;setActiveLine(lineId);
   audio.current.currentTime=segment.startMs/1000;setAudioError('');
   await audio.current.play();
  }catch{
   segmentEndMs.current=null;setActiveLine(null);
   setAudioError('Sentence playback is unavailable. Play the original recording instead.');
  }
 }
 function updateAudioTime(){
  if(!audio.current||segmentEndMs.current===null)return;
  if(audio.current.currentTime*1000>=segmentEndMs.current-60){
   audio.current.pause();segmentEndMs.current=null;setActiveLine(null);
  }
 }
 if(!transcript.trim()||!audioUrl||!sheet.gaps.length)return null;
 return <section className="panel" data-learning-interaction="ListeningDictation"
  aria-label="Post-submission listening dictation practice">
  <h3>Listening practice · Fill the gaps</h3>
  <p className="muted">Optional practice <strong>after your Listening submission</strong>.
   Replay the original MP3, fill in the missing words and check the exact spellings.
   This does not change your Listening score or CEFR evidence.</p>
  <div className="learning-choices" role="group" aria-label="Dictation replay mode">
   <button type="button" aria-pressed={mode==='whole'} className={mode==='whole'?'primary-button':'secondary-button'}
    onClick={()=>setMode('whole')}>Whole recording</button>
   <button type="button" disabled={!enabledSegments} aria-pressed={mode==='sentence'}
    className={mode==='sentence'?'primary-button':'secondary-button'}
    onClick={()=>{if(enabledSegments)setMode('sentence')}}>One sentence at a time</button>
  </div>
  {!enabledSegments&&<p className="muted" role="note">
   Sentence replay will be enabled only after exact timings have been verified against this MP3.
   The full original recording is available now; no timings are guessed.
  </p>}
  <audio ref={audio} controls preload="metadata" src={audioUrl}
   onTimeUpdate={updateAudioTime}
   onEnded={()=>{segmentEndMs.current=null;setActiveLine(null)}}
   onError={()=>setAudioError('The recording could not be loaded; please retry later.')}/>
  <div className="learning-choices">
   <button type="button" className="secondary-button" onClick={()=>void replayWhole()}>
    Replay full recording</button>
  </div>
  {audioError&&<p role="alert" className="notice">{audioError}</p>}
  <label className="field" htmlFor="sle-dictation-density">
   <strong>How many words should be hidden?</strong>
   <select id="sle-dictation-density" value={density} onChange={e=>setDensity(Number(e.target.value) as DictationDensity)}>
    <option value={10}>Easy · about 10%</option>
    <option value={20}>Medium · about 20%</option>
    <option value={30}>Challenge · about 30%</option>
   </select>
  </label>
  <p className="muted" role="status">Auto-generated practice: {sheet.gaps.length} missing words.
   Only exact words from this already-submitted transcript are checked; punctuation and letter case are ignored.</p>
  <ol className="sle-dictation-lines">
   {sheet.lines.map((line,i)=><li key={line.id} className="wcv2-card" style={{whiteSpace:'normal'}}>
    {mode==='sentence'&&enabledSegments&&<button type="button" className="secondary-button"
      onClick={()=>void replayLine(line.id)}>
      {activeLine===line.id?'Playing sentence…':'Replay sentence '+(i+1)}
    </button>}
    <div style={{lineHeight:2,overflowWrap:'anywhere'}}>
    {line.parts.map((part,j)=>part.kind==='text'
     ?<span key={'p-'+j} style={{whiteSpace:'pre-wrap'}}>{part.text}</span>
     :<span key={part.id} style={{display:'inline-block',verticalAlign:'middle',marginInline:'0.15rem'}}>
       <label>
        <span className="sr-only">Missing word {part.id} in line {i+1}</span>
        <input aria-label={'Missing word '+part.id+' in line '+(i+1)}
         autoComplete="off" spellCheck={false} type="text" value={answers[part.id]??''}
         style={{width:'7.5rem',maxWidth:'35vw',minHeight:'2.5rem'}}
         onChange={e=>{setAnswers(prev=>({...prev,[part.id]:e.target.value}));setChecked(false)}}/>
       </label>
       {byGap.has(part.id)&&<span role="status" className="muted">
        {byGap.get(part.id)?.correct?' ✓':' · '+byGap.get(part.id)?.expected}
       </span>}
      </span>)}
    </div>
   </li>)}
  </ol>
  <div className="learning-choices">
   <button type="button" className="primary-button"
    disabled={!sheet.gaps.length}
    onClick={()=>setChecked(true)}>Check exact words</button>
   <button type="button" className="secondary-button"
    onClick={()=>{setAnswers({});setChecked(false)}}>Clear answers</button>
  </div>
  {checked&&<p role="status" className="notice">
   Practice check: {correct}/{sheet.gaps.length} exact words.
   Review the transcript and replay any unclear parts. This is not a Listening proficiency score.
  </p>}
  <p className="muted">Practice answers stay on this screen only: no automatic save,
   grade, AI request or learner attempt is created.</p>
 </section>;
}
