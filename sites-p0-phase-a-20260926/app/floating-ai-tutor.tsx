"use client";
import {useState} from "react";
import {Sparkles,X,Send} from "lucide-react";
import {askLearningTutor} from "../infrastructure/browser/client-services";
import {publicPath} from "../infrastructure/browser/public-path";

type Reply={answer:string;points:string[];nextStep:string};

export function FloatingAITutor({context,contextLabel,supportVi=false}:{context:string;contextLabel:string;supportVi?:boolean}){
  const [open,setOpen]=useState(false);
  const [input,setInput]=useState("");
  const [pending,setPending]=useState(false);
  const [reply,setReply]=useState<Reply|null>(null);
  const [error,setError]=useState("");
  const avatar=publicPath("/branding/tutor-girl-awake.svg");

  async function ask(request:string){
    const question=request.trim();
    if(!question||pending)return;
    setPending(true);setError("");
    try{
      const result=await askLearningTutor(question,context,supportVi?"vi":"en");
      if(!result){setReply(null);setError("AI Tutor is unavailable right now. Your lessons and saved work still work normally.");return}
      setReply(result);setInput("");
    }catch{
      setReply(null);setError("AI Tutor could not respond. Please try again later; your learning progress is not affected.");
    }finally{setPending(false)}
  }

  const quick=[
    ["Explain this more simply","Explain the current lesson or step more simply. Teach the idea first, then give one short parallel example."],
    ["Show a similar example","Give a similar example that teaches the same method, but do not answer the learner's current task."],
    ["Give me one hint","Give exactly one small hint that helps me take the next step without giving the answer."],
    ["What should I do?","Tell me what I should do next on this page as a short checklist. Do not complete the work for me."],
  ] as const;

  return <div className={"floating-ai "+(open?"is-open":"")} data-floating-ai>
    <section className="floating-ai-panel" hidden={!open} aria-label="AI Tutor">
      <div className="floating-ai-head">
        <img src={avatar} alt="" className="floating-ai-head-face"/>
        <div><strong>G-Learning AI Tutor</strong><small>{contextLabel}</small></div>
        <button className="floating-ai-close" onClick={()=>setOpen(false)} aria-label="Close AI Tutor"><X size={18}/></button>
      </div>
      <div className="floating-ai-quick">
        {quick.map(([label,prompt])=><button key={label} className="floating-ai-chip" disabled={pending} onClick={()=>void ask(prompt)}>{label}</button>)}
        {supportVi&&<button className="floating-ai-chip" disabled={pending} onClick={()=>void ask("Explain the current point in simple English, then add a short Vietnamese explanation. Do not give the learner's answer.")}>Explain in Vietnamese</button>}
      </div>
      {(pending||reply||error)&&<div className="floating-ai-answer" aria-live="polite">
        {pending?<p className="floating-ai-waiting">AI Tutor is reading this part of the lesson…</p>:error?<p className="floating-ai-error">{error}</p>:reply&&<><p>{reply.answer}</p>{reply.points.length>0&&<ul>{reply.points.map((point,i)=><li key={i}>{point}</li>)}</ul>}<p><strong>Try next:</strong> {reply.nextStep}</p></>}
      </div>}
      <textarea className="floating-ai-input" rows={3} maxLength={500} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();void ask(input)}}} placeholder="Ask about this lesson or step…" aria-label="Question for AI Tutor"/>
      <button className="floating-ai-send" disabled={pending||!input.trim()} onClick={()=>void ask(input)}><Send size={15}/>Ask AI Tutor</button>
      <small className="floating-ai-note">AI can make mistakes. Do not enter private information. The Tutor should teach the method, not do assessed work for you.</small>
    </section>
    <button className="floating-ai-launcher" onClick={()=>setOpen(!open)} aria-label="Open AI Tutor" aria-expanded={open}>
      <img className="floating-ai-face" src={avatar} alt=""/>
      <span className="floating-ai-badge"><Sparkles size={12}/></span>
    </button>
  </div>
}
