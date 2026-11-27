'use client';
import {useEffect,useRef,useState,type TextareaHTMLAttributes} from 'react';
export const writingSteps=['learn','extra','cycleA','cycleB','transfer'] as const;
export type WritingStep=typeof writingSteps[number];
export const writingLabels=['Learn','Knowledge Check','Practice A','Practice B','Transfer'];
const goals=['Identify the topic, task, required details and boundaries.','Generate and judge ideas; explain why one fits.','Build claims, reasons and concrete details.','Connect ideas meaningfully and clarify references.','Write a focused paragraph with relevant support.','Plan distinct paragraph jobs before drafting.','Connect paragraphs with clear references and bridges.','Adapt wording to the reader and purpose.','Plan and write an original multi-paragraph draft.','Edit language without changing the meaning.','Revise ideas, reasons and flow with a clear purpose.','Apply the writing process to a new genre.'];
const viGoals=['Xác định chủ đề, yêu cầu, ý bắt buộc và giới hạn.','Tìm ý, xem xét tính phù hợp và giải thích lựa chọn.','Nêu ý chính, lý do và chi tiết cụ thể.','Nối ý đúng nghĩa và làm rõ đối tượng được nhắc đến.','Viết đoạn văn tập trung vào một ý chính.','Lập dàn ý với nhiệm vụ rõ ràng cho từng đoạn.','Liên kết đoạn văn, làm rõ các đối tượng được nhắc tới.','Điều chỉnh cách viết phù hợp người đọc và mục đích.','Lập kế hoạch và viết bản nháp nhiều đoạn.','Sửa lỗi ngôn ngữ nhưng giữ nguyên ý nghĩa.','Cải thiện nội dung, lý do và mạch bài.','Vận dụng quy trình viết vào thể loại mới.'];
export function WritingGoal({unit,showVi}:{unit:number;showVi:boolean}){return <div className="fw-goal"><strong>Learning goal</strong><p>{goals[unit-1]}</p>{showVi&&<p lang="vi">{viGoals[unit-1]}</p>}</div>}
export function WritingSteps({step,onStep,checked,saved}:{step:WritingStep;onStep:(s:WritingStep)=>void;checked?:boolean;saved?:boolean}){return <nav className="fw-steps" aria-label="Learning steps">{writingSteps.map((s,i)=><button type="button" key={s} aria-pressed={s===step} aria-current={s===step?'step':undefined} className={s===step?'primary-button':'secondary-button'} onClick={()=>onStep(s)}><span className="fw-number">{i+1}</span><span>{writingLabels[i]}{s==='extra'&&<small>{checked?'Checked':'4 questions'}</small>}</span></button>)}</nav>}
export function WritingNext({step,onStep,onFinish}:{step:WritingStep;onStep:(s:WritingStep)=>void;onFinish:()=>void}){const i=writingSteps.indexOf(step);return <button type="button" className="primary-button" onClick={()=>i===4?onFinish():onStep(writingSteps[i+1])}>{i===4?'Save & finish':'Continue to '+writingLabels[i+1]}</button>}
export function WritingText(props:TextareaHTMLAttributes<HTMLTextAreaElement>){const value=String(props.value??'');const words=value.trim()?value.trim().split(/\s+/).length:0;return <><textarea {...props}/><span className="fw-count">{words} {words===1?'word':'words'}</span></>}
const checks=[
 ['My response follows the task.','I included the required details and respected the reader.'],
 ['My ideas fit this task.','I explained why my chosen idea fits.'],
 ['My reasons are distinct and relevant.','My details explain how each reason could work.'],
 ['My sentences express the intended relationship.','My references and facts are clear.'],
 ['My paragraph has one main point.','My reason and example support that point.'],
 ['Each paragraph has a distinct job.','My plan covers the task requirements.'],
 ['My response connects to the problem.','My references are clear and my claims are accurate.'],
 ['Both readers receive the required questions.','My tone fits each reader; I did not invent answers.'],
 ['My draft covers the required information.','I asked for consideration without claiming approval.'],
 ['My edits preserve the original facts, time and actors.','I changed only what is justified, or explained why I kept it.'],
 ['My revision helps the reader understand the idea.','I explained my revision or justified keeping the original.'],
 ['My writing matches the audience, purpose and genre.','I covered the task without inventing facts or copying a model.']
];
export function WritingSelfCheck({unit}:{unit:number}){return <div className="fw-selfcheck"><h3>Before you finish · Self-check</h3>{checks[unit-1].map(s=><label key={s}><input type="checkbox"/><span>{s}</span></label>)}</div>}
// One explicit click, durable save first; do not infer successful storage from optimistic React state.
export function WritingReviewAction({signature,eligible,busy,available=true,onSave,onAsk}:{signature:string;eligible:boolean;busy:boolean;available?:boolean;onSave:()=>Promise<boolean>;onAsk:()=>void}){
 const [request,setRequest]=useState<string|null>(null),[saving,setSaving]=useState(false),[message,setMessage]=useState('');
 const live=useRef(true),latest=useRef(signature),locked=useRef(false);
 latest.current=signature;
 useEffect(()=>{live.current=true;return()=>{live.current=false}},[]);
 useEffect(()=>{if(request===null||saving||busy)return;setRequest(null);locked.current=false;if(request!==signature){setMessage('Your writing changed. Ask again when ready.');return}if(!eligible){setMessage('Complete the required writing fields, then try again.');return}onAsk()},[request,saving,busy,signature,eligible,onAsk]);
 async function run(){if(locked.current||busy||!available)return;locked.current=true;const expected=signature;setSaving(true);setMessage('');try{const ok=await onSave();if(!live.current)return;if(!ok){setMessage('Save failed. Your writing is still here. Retry before asking AI.');locked.current=false;return}if(latest.current!==expected){setMessage('Your writing changed. Ask again when ready.');locked.current=false;return}setRequest(expected)}catch{if(live.current)setMessage('Save failed. Please retry.');locked.current=false}finally{if(live.current)setSaving(false)}}
 return <><button type="button" className="primary-button" disabled={!available||busy||saving||request!==null} onClick={()=>void run()}>{saving?'Saving…':busy?'Reviewing…':'Save & Ask AI Tutor'}</button>{message&&<p role="status" className="notice">{message}</p>}</>
}
