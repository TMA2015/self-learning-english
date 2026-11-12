'use client';
import {useEffect,useState} from 'react';
import {foundationRequest} from '../infrastructure/browser/client-services';

type ReadingSource={title:string;body:string};
type LessonSourceView={
 lesson:{id:string;reading_asset?:{id:string;title:string;body:string;display_to_learner:boolean}};
};
type Props={
 version:string;
 readingAvailable:boolean;
 listeningAvailable:boolean;
 disabled:boolean;
 onOpenSource:(lessonId:'REA-A2-08'|'LIS-A2-07')=>void;
};

/**
 * WRI-A2-07 uses two ORIGINAL sources from A2-U10:
 * a written event notice from REA-A2-08 and Mia's SPOKEN message in LIS-A2-07.
 * Do NOT invent a letter, duplicate a graded curriculum item, or reveal the
 * Listening transcript/answers before the genuine audio assessment.
 */
export function A2WritingSourceGuide({
 version,readingAvailable,listeningAvailable,disabled,onOpenSource
}:Props){
 const [notice,setNotice]=useState<ReadingSource|null>(null);
 const [sourceError,setSourceError]=useState('');
 useEffect(()=>{
  let active=true;
  setNotice(null);
  setSourceError('');
  if(!readingAvailable){
   setSourceError('The required written notice is not imported on this device.');
   return ()=>{active=false};
  }
  void foundationRequest('/api/foundation?lesson=REA-A2-08&version='+encodeURIComponent(version))
   .then((result:LessonSourceView)=>{
    if(!active)return;
    const source=result.lesson?.reading_asset;
    if(result.lesson?.id!=='REA-A2-08'||source?.id!=='TXT-REA-A2-08'||
       source.display_to_learner!==true||!source.body?.trim())
     throw Error('The canonical written notice was unavailable.');
    setNotice({title:source.title,body:source.body});
   })
   .catch(()=>{
    if(active)setSourceError('Could not load the written notice. Open REA-A2-08 and read its original source before writing. Do not guess missing details.');
   });
  return ()=>{active=false};
 },[version,readingAvailable]);

 return <section className="foundation-learn-block a2-writing-sources"
  aria-label="Required sources for WRI-A2-07">
  <h3>Required sources · read and listen before replying</h3>
  <p><strong>Mia's request is a voice message, not a written letter.</strong> This
   Writing task follows two existing A2 Unit 10 lessons. Read the community
   event notice and listen to Mia's recorded request before writing your reply.
   Do not promise a repair will succeed.</p>
  {notice?<article className="foundation-passage" aria-label="Original community event notice">
   <h4>{notice.title} · source REA-A2-08</h4>
   <p>{notice.body}</p>
  </article>:<p className="notice" role="status">{sourceError||
   'Loading the original written event notice…'}</p>}
  <div className="learning-choices">
   <button type="button" className="secondary-button"
    disabled={disabled||!readingAvailable}
    onClick={()=>onOpenSource('REA-A2-08')}>Open original Reading · REA-A2-08</button>
   <button type="button" className="secondary-button"
    disabled={disabled||!listeningAvailable}
    onClick={()=>onOpenSource('LIS-A2-07')}>Listen to Mia · LIS-A2-07</button>
  </div>
  {!listeningAvailable&&<p className="notice" role="status">Mia's Listening source is
   missing from this device's catalog. Finish the source lesson before attempting this reply.</p>}
  <p className="muted">Use the original Listening player for Mia's message.
   Its transcript is available only under the original post-submission rules.
   This Writing panel does not show the transcript, answers or a model reply.
   Your current Writing draft is saved before switching lessons.</p>
 </section>;
}
