'use client';

import {useEffect,useState} from 'react';
import {foundationRequest} from '../infrastructure/browser/client-services';
import {writingSourceContractFor} from '../domain/writing-source-contracts';

type ReadingSource={title:string;body:string};
type OriginalAudio={url:string;duration:number};
type LessonSourceView={
 version:string;
 lesson:{
  id:string;module?:string;
  reading_asset?:{id:string;title:string;body:string;display_to_learner:boolean};
 };
 audio?:OriginalAudio|null;
};
type Props={
 lessonId:string;
 version:string;
 availableLessonIds:readonly string[];
 disabled:boolean;
 onOpenSource:(lessonId:string)=>void;
};

/**
 * Generic evidence flow for all source-dependent Writing tasks.
 * - Source text comes from the ORIGINAL, version-matched Reading lesson.
 * - Optional spoken evidence comes from the original validated Listening MP3.
 * - The inline player is reference-only: it NEVER creates or credits Listening.
 * - No transcript, model answer, score writes, or academic content duplication.
 */
export function WritingSourceBundle({
 lessonId,version,availableLessonIds,disabled,onOpenSource
}:Props){
 const contract=writingSourceContractFor(lessonId);
 const readingLessonId=contract?.readingLessonId??'';
 const readingAssetId=contract?.readingAssetId??'';
 const listeningLessonId=contract?.listeningLessonId??'';
 const readingAvailable=availableLessonIds.includes(readingLessonId);
 const listeningAvailable=!listeningLessonId||availableLessonIds.includes(listeningLessonId);
 const [notice,setNotice]=useState<ReadingSource|null>(null);
 const [readingError,setReadingError]=useState('');
 const [sourceAudio,setSourceAudio]=useState<OriginalAudio|null>(null);
 const [audioError,setAudioError]=useState('');

 useEffect(()=>{
  let active=true;
  setNotice(null);
  setReadingError('');
  if(!readingLessonId)return ()=>{active=false};
  if(!readingAvailable){
   setReadingError('The required Reading source is not imported on this device.');
   return ()=>{active=false};
  }
  void foundationRequest<LessonSourceView>(
   '/api/foundation?lesson='+encodeURIComponent(readingLessonId)+
   '&version='+encodeURIComponent(version)
  ).then(result=>{
   if(!active)return;
   const source=result.lesson?.reading_asset;
   if(result.version!==version||result.lesson?.id!==readingLessonId||
      result.lesson.module!=='reading'||source?.id!==readingAssetId||
      source.display_to_learner!==true||!source.body?.trim())
    throw Error('Original source unavailable');
   setNotice({title:source.title,body:source.body});
  }).catch(()=>{
   if(active)setReadingError('Could not load the original written source. Open the Reading lesson before writing; do not invent facts.');
  });
  return ()=>{active=false};
 },[readingLessonId,readingAssetId,version,readingAvailable]);

 useEffect(()=>{
  let active=true;
  setSourceAudio(null);
  setAudioError('');
  if(!listeningLessonId)return ()=>{active=false};
  if(!listeningAvailable){
   setAudioError('The required Listening recording is not imported on this device.');
   return ()=>{active=false};
  }
  void foundationRequest<LessonSourceView>(
   '/api/foundation?lesson='+encodeURIComponent(listeningLessonId)+
   '&version='+encodeURIComponent(version)
  ).then(result=>{
   if(!active)return;
   const original=result.audio;
   // Accept only a same-origin, approved-style source path for the expected
   // canonical lesson. A URL returned for a different lesson must fail closed.
   const allowedPath=new RegExp(
    '^/(?:[\\w-]+/)*foundation-audio/'+listeningLessonId+'-v\\d+\\.mp3$'
   );
   if(result.version!==version||result.lesson?.id!==listeningLessonId||
      result.lesson.module!=='listening'||!original||
      !allowedPath.test(original.url)||
      !Number.isFinite(original.duration)||original.duration<=0)
    throw Error('Original recording unavailable');
   setSourceAudio({url:original.url,duration:original.duration});
  }).catch(()=>{
   if(active)setAudioError('Could not load the original recording. Open the Listening lesson if needed; do not guess its message.');
  });
  return ()=>{active=false};
 },[listeningLessonId,version,listeningAvailable]);

 if(!contract)return null;
 return <section className="foundation-learn-block writing-source-bundle"
  aria-label={'Required sources for '+lessonId}>
  <h3>{contract.unit} · Read{listeningLessonId?', listen':''} and write here</h3>
  <p>Everything needed from the original learning sources is shown here.
   Read the notice{listeningLessonId?', listen to the recording':''},
   then complete your Writing task below without leaving the page.
   Check the exact prompt before submitting.</p>

  <div className="writing-source-step">
   <h4>1. Read the original source</h4>
   {notice?<article className="foundation-passage" aria-label="Original Reading source">
    <h5>{notice.title} · {readingLessonId}</h5>
    <p>{notice.body}</p>
   </article>:<p className="notice" role="status">
    {readingError||'Loading the original Reading source…'}
   </p>}
  </div>

  {listeningLessonId&&<div className="writing-source-step">
   <h4>2. Listen to the original recording</h4>
   {sourceAudio?<div>
    <audio controls preload="none" src={sourceAudio.url}
     aria-label={'Original spoken source '+listeningLessonId}
     onError={()=>setAudioError('This audio could not be played. Open the original Listening lesson if needed.')}>
     Your browser cannot play this recording.
    </audio>
    {audioError&&<p className="notice" role="alert">{audioError}</p>}
   </div>:<p className="notice" role="status">
    {audioError||'Loading the original audio…'}
   </p>}
   <p className="muted">You can replay this recording while writing.
    This reference player does not complete or grade the separate Listening lesson.
    No transcript or answers are displayed here.</p>
  </div>}

  <div className="writing-source-step">
   <h4>{listeningLessonId?'3':'2'}. Write your response below</h4>
   <p>Use the original evidence accurately and follow the Writing task's
    instructions, word range and limitations. Do not invent missing details.</p>
  </div>

  <details className="writing-source-optional-lessons">
   <summary>Optional: open the original Reading{listeningLessonId?' or assessed Listening':''} lesson</summary>
   <p className="muted">These are separate learning activities. Your current
    Writing draft is saved before navigating to another lesson. Only the original
    Listening player can record a completed Listening assessment.</p>
   <div className="learning-choices">
    <button type="button" className="secondary-button" disabled={disabled||!readingAvailable}
     onClick={()=>onOpenSource(readingLessonId)}>Practice Reading · {readingLessonId}</button>
    {listeningLessonId&&<button type="button" className="secondary-button"
     disabled={disabled||!listeningAvailable}
     onClick={()=>onOpenSource(listeningLessonId)}>Assessed Listening · {listeningLessonId}</button>}
   </div>
  </details>
 </section>;
}
