import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {WritingWeekPage} from '../app/writing-course-v2-b';
import {emptyWeekWork,editWeek,submitWeek,checkWeekGuided,finishWeekReview,confirmWeekNavigation,type WeekWork,type WeekScreen} from '../domain/writing-course-v2-b';
import {BrowserLocalLearningRepository} from '../infrastructure/storage/browser-local-repositories';
import '../app/globals.css';

const sourceHead=process.env.NEXT_PUBLIC_SOURCE_HEAD??'unknown';
const storageScope={ownerId:'preview-only-owner',learnerId:'fictional-week2'};
const storagePrefix='sle:pr158:week2-r2:preview-only:20261115';
const storage=new BrowserLocalLearningRepository({
 getItem:k=>window.localStorage.getItem(k),
 setItem:(k,v)=>window.localStorage.setItem(k,v),
 removeItem:k=>window.localStorage.removeItem(k)
},storagePrefix);
function Preview(){
 const [work,setWork]=useState<WeekWork>(emptyWeekWork);
 const current=useRef(work),dirty=useRef(false),pending=useRef(false);
 const [screen,setScreen]=useState<WeekScreen>('learn'),[busy,setBusy]=useState(true),
  [error,setError]=useState(''),[receipt,setReceipt]=useState('Loading isolated preview…'),
  [vi,setVi]=useState(false);
 useEffect(()=>{
  storage.readState(storageScope).then(s=>{
   const w=s?.writingCourseV2B?.weeks[2]??emptyWeekWork();
   current.current=w;setWork(w);dirty.current=false;
   setReceipt('Preview ready · fictional learner data only · no cloud writes or AI');
   setBusy(false);
  }).catch(e=>{setError(String(e));setBusy(false)});
 },[]);
 function change(next:WeekWork){
  current.current=next;dirty.current=true;setWork(next);
  setReceipt('Changed locally; navigate or choose Save draft to persist.');
 }
 async function persist(w:WeekWork){
  try{
   await storage.writeState(storageScope,{writingCourseV2B:{weeks:{2:w}}});
   if(current.current===w)dirty.current=false;
   setReceipt('Isolated preview save confirmed.');
   return true;
  }catch(e){setError(String(e));setReceipt('Save failed; keep this browser tab open.');return false}
 }
 async function run(doWork:()=>Promise<void>){
  if(pending.current)return;
  pending.current=true;setBusy(true);setError('');
  try{await doWork()}catch(e){setError(String(e))}
  finally{pending.current=false;setBusy(false)}
 }
 const saveLatest=()=>confirmWeekNavigation(()=>current.current,()=>dirty.current,persist);
 const reset=()=>void run(async()=>{
  const state=emptyWeekWork();
  current.current=state;
  await persist(state);
  dirty.current=false;
  setWork(state);setScreen('learn');
  setReceipt('Synthetic preview reset. No actual learner data touched.');
 });
 return <div>
  <aside style={{padding:'14px 18px',background:'#eaf3ff',borderBottom:'1px solid #bcd5f2',fontFamily:'system-ui',lineHeight:1.5}} aria-label="Isolated preview controls">
   <strong>Self-Learning English · Writing Course Week 2 · R2 React Preview</strong>
   <p style={{margin:'4px 0',fontSize:13}}>PR #158 · source HEAD <code>{sourceHead.slice(0,12)}</code> · isolated offline preview · synthetic data only · no Gemini · NOT production.</p>
   <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
    <label style={{display:'inline-flex',gap:6,alignItems:'center'}}><input type="checkbox" checked={vi} onChange={e=>setVi(e.target.checked)}/> Vietnamese Support</label>
    <button type="button" disabled={busy} onClick={()=>void run(async()=>{await saveLatest()})}>Save preview draft</button>
    <button type="button" disabled={busy} onClick={()=>window.location.reload()}>Reload</button>
    <button type="button" disabled={busy} onClick={reset}>Reset fictional work</button>
   </div>
   <p role="status" style={{margin:'5px 0 0',fontSize:12}}>{receipt}</p>
  </aside>
  <main style={{maxWidth:1100,margin:'auto',padding:12}}>
   <WritingWeekPage key={screen} week={2} screen={screen} work={work} busy={busy} error={error} showVi={vi} actions={{
    go:s=>void run(async()=>{if(await saveLatest()){setScreen(s);window.scrollTo(0,0)}}),
    back:()=>void run(async()=>{if(await saveLatest())setReceipt('Back-to-course is outside this isolated preview.')}),
    foundation:()=>void run(async()=>{if(await saveLatest())setReceipt('Writing Foundation is outside this isolated preview.')}),
    edit:(key,value)=>change(editWeek(current.current,key,value)),
    confirm:checked=>change({...current.current,confirmedOwnWork:checked,reviewDone:false}),
    check:(id,answer)=>void run(async()=>{
     const w=current.current;
     change({...w,guided:[...w.guided,checkWeekGuided(2,w.guided,id,answer)]});
     if(!await persist(current.current))throw Error('Guided answer save failed')
    }),
    submit:()=>void run(async()=>{
     if(!await saveLatest())throw Error('Draft save failed');
     change(submitWeek(2,current.current));
     if(!await persist(current.current))throw Error('Submission save failed');
     setScreen('feedback')
    }),
    reflect:(key,value)=>change({...current.current,reviewDone:false,reflections:{...current.current.reflections,[key]:value}}),
    review:()=>void run(async()=>{
     change(finishWeekReview(2,current.current));
     if(!await persist(current.current))throw Error('Review save failed')
    }),
    retrySave:()=>void run(async()=>{await saveLatest()})
   }}/>
  </main>
 </div>;
}
createRoot(document.getElementById('root')!).render(<Preview/>);
