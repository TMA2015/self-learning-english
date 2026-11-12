'use client';
import {useEffect,useState} from 'react';
import {foundationRequest} from '../infrastructure/browser/client-services';

type ReadingSource={title:string;body:string};
type OriginalAudio={url:string;duration:number};
type LessonSourceView={
 version:string;
 lesson:{id:string;module?:string;reading_asset?:{id:string;title:string;body:string;display_to_learner:boolean}};
 audio?:OriginalAudio|null;
};
type Props={
 version:string;
 readingAvailable:boolean;
 listeningAvailable:boolean;
 disabled:boolean;
 onOpenSource:(lessonId:'REA-A2-08'|'LIS-A2-07')=>void;
};

/**
 * One uninterrupted WRI-A2-07 task: read the canonical REA notice, replay
 * the ORIGINAL Mia MP3 (from the separately validated LIS lesson view), write.
 *
 * The in-place audio player is a source reference ONLY. It NEVER invokes the
 * assessed Listening play/submit route, grants Listening credit, shows a
 * transcript, supplies answers or starts another learner attempt.
 * Original graded lessons remain accessible behind an optional disclosure.
 */
export function A2WritingSourceGuide({
 version,readingAvailable,listeningAvailable,disabled,onOpenSource
}:Props){
 const [notice,setNotice]=useState<ReadingSource|null>(null);
 const [sourceError,setSourceError]=useState('');
 const [miaAudio,setMiaAudio]=useState<OriginalAudio|null>(null);
 const [audioError,setAudioError]=useState('');

 useEffect(()=>{
  let active=true;
  setNotice(null);
  setSourceError('');
  if(!readingAvailable){
   setSourceError('The required written notice is not imported on this device.');
   return ()=>{active=false};
  }
  void foundationRequest<LessonSourceView>('/api/foundation?lesson=REA-A2-08&version='+encodeURIComponent(version))
   .then(result=>{
    if(!active)return;
    const source=result.lesson?.reading_asset;
    if(result.version!==version||result.lesson?.id!=='REA-A2-08'||
       source?.id!=='TXT-REA-A2-08'||source.display_to_learner!==true||
       !source.body?.trim())
     throw Error('The canonical written notice was unavailable.');
    setNotice({title:source.title,body:source.body});
   })
   .catch(()=>{
    if(active)setSourceError('Could not load the written notice. Open REA-A2-08 and read its original source before writing. Do not guess missing details.');
   });
  return ()=>{active=false};
 },[version,readingAvailable]);

 useEffect(()=>{
  let active=true;
  setMiaAudio(null);
  setAudioError('');
  if(!listeningAvailable){
   setAudioError("Mia's Listening source is not imported on this device.");
   return ()=>{active=false};
  }
  // The validated lesson service strips protected source transcripts and
  // assessment keys. Only the rights-checked playable URL is rendered.
  void foundationRequest<LessonSourceView>('/api/foundation?lesson=LIS-A2-07&version='+encodeURIComponent(version))
   .then(result=>{
    if(!active)return;
    const audio=result.audio;
    if(result.version!==version||result.lesson?.id!=='LIS-A2-07'||
       result.lesson.module!=='listening'||!audio||
       !/^\/(?:[\w-]+\/)*foundation-audio\/LIS-A2-07-v\d+\.mp3$/.test(audio.url)||
       !Number.isFinite(audio.duration)||audio.duration<=0)
     throw Error('The validated original audio was unavailable.');
    setMiaAudio({url:audio.url,duration:audio.duration});
   })
   .catch(()=>{
    if(active)setAudioError("Could not load Mia's original recording. Open the Listening lesson to play its audio; do not guess her request.");
   });
  return ()=>{active=false};
 },[version,listeningAvailable]);

 return <section className="foundation-learn-block a2-writing-sources"
  aria-label="Required sources for WRI-A2-07">
  <h3>A2-U10 · Read, listen and write on this page</h3>
  <p><strong>Mia's request is a voice message, not a written letter.</strong> This
   is one combined Writing task. Use the two original sources below, then write
   your reply in the box on this page. No need to switch lessons.</p>

  <div className="a2-writing-source-step">
   <h4>1. Read the community notice</h4>
   {notice?<article className="foundation-passage" aria-label="Original community event notice">
    <h5>{notice.title} · source REA-A2-08</h5>
    <p>{notice.body}</p>
   </article>:<p className="notice" role="status">{sourceError||
    'Loading the original written event notice…'}</p>}
  </div>

  <div className="a2-writing-source-step">
   <h4>2. Listen to Mia's message</h4>
   {miaAudio?<div>
    <audio controls preload="none" src={miaAudio.url}
     aria-label="Mia's original spoken message" onError={()=>
      setAudioError('Audio could not be played. Open the original Listening lesson if needed.')}>
     Your browser cannot play this audio.
    </audio>
    {audioError&&<p className="notice" role="alert">{audioError}</p>}
   </div>:<p className="notice" role="status">{audioError||
    'Loading Mia’s original recording…'}</p>}
   <p className="muted">You can replay this source while planning your reply.
    This player does not complete or grade the separate Listening lesson.
    Its transcript and answers are not displayed here.</p>
  </div>

  <div className="a2-writing-source-step">
   <h4>3. Write your reply below</h4>
   <p>Recommend an event Mia can attend, explain your evidence from the notice
    and recording, and mention one important limitation. Do not promise that
    a repair will succeed. You can return to the sources without leaving this page.</p>
  </div>

  <details className="a2-writing-optional-lessons">
   <summary>Optional: open the separate Reading or graded Listening lesson</summary>
   <p className="muted">Only the original Listening player tracks Listening
    playback and its own assessment. A Writing draft is saved before navigating.</p>
   <div className="learning-choices">
    <button type="button" className="secondary-button"
     disabled={disabled||!readingAvailable}
     onClick={()=>onOpenSource('REA-A2-08')}>Practice Reading · REA-A2-08</button>
    <button type="button" className="secondary-button"
     disabled={disabled||!listeningAvailable}
     onClick={()=>onOpenSource('LIS-A2-07')}>Graded Listening · LIS-A2-07</button>
   </div>
  </details>
 </section>;
}
