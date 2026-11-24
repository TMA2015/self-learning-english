'use client';
import {useState} from 'react';
import type {SeedLesson} from '../domain/academic';
import {Inline,TeachingBlocks} from './teaching-blocks';

/** GRA-A1-02-only presentational pilot.
 * Current, version-pinned lesson objectives and authored notes are the source
 * for the core idea, worked examples, mistakes and remember statement.
 * Pair-table example sentences and unscored recall items are an owner-supplied
 * Gemini design candidate, not part of the graded curriculum or learner model.
 */
type Section = {title:string;text:string};
const pairs = [
 {meaning:'Tôi / của tôi',subject:'I',possessive:'my',a:'',b:' have a bag.',c:'',d:' bag is new.'},
 {meaning:'Bạn / của bạn',subject:'you',possessive:'your',a:'',b:' have a ticket.',c:'',d:' ticket is here.'},
 {meaning:'Anh ấy / của anh ấy',subject:'he',possessive:'his',a:'',b:' is Minh.',c:'',d:' pencil is blue.'},
 {meaning:'Cô ấy / của cô ấy',subject:'she',possessive:'her',a:'',b:' is Linh.',c:'',d:' brother is tall.'},
 {meaning:'Nó / của nó',subject:'it',possessive:'its',a:'',b:' is a cute dog.',c:'Look at ',d:' tail.'},
 {meaning:'Chúng tôi / của chúng tôi',subject:'we',possessive:'our',a:'',b:' study here.',c:'This is ',d:' classroom.'},
 {meaning:'Họ / của họ',subject:'they',possessive:'their',a:'',b:' are students.',c:'',d:' teacher is nice.'},
] as const;
const exampleVi=[
 'Dùng đại từ chủ ngữ để tránh lặp lại tên người hoặc vật.',
 'Dùng tính từ sở hữu trước cụm danh từ để cho biết ai là chủ sở hữu.',
 'Dùng we cho nhóm có cả người nói.',
 'Its chỉ sở hữu; it\'s là cách viết tắt của it is.',
];
const mistakeVi=[
 'Trước danh từ pencil, dùng his chứ không dùng he.',
 'It\'s có nghĩa là it is; its không có dấu nháy dùng để chỉ sở hữu.',
];
const checks=[
 {prompt:'___ mother is a doctor.',options:['They','Their'],answer:'Their',
  why:'Their comes before the noun mother to show possession.',
  wrong:'The word They is a subject pronoun; choose the possessive adjective before mother.',
  vi:'Trước danh từ mother cần tính từ sở hữu their.'},
 {prompt:'Nam is my brother. ___ plays football every day.',options:['He','His'],answer:'He',
  why:'He is the subject before the verb plays.',
  wrong:'His is a possessive adjective; here a subject pronoun is needed.',
  vi:'Trước động từ plays cần đại từ chủ ngữ he.'},
] as const;
function lines(text:string){return text.split(/\r?\n/).map(s=>s.trim()).filter(s=>s.startsWith('- '))}
function splitWorked(line:string){
 const match=line.match(/^- \*\*(.+?)\*\*\s+(.+?)\s+→\s+(.+)$/u);
 return match?{context:match[1],sentence:match[2],why:match[3]}:null;
}
function splitMistake(line:string){
 const parts=line.slice(2).split(' → ');
 if(parts.length!==2)return null;
 const wrong=parts[0].replace(/\s*✗\s*$/u,'').trim();
 const check=parts[1].indexOf(' ✓');
 const right=(check<0?parts[1]:parts[1].slice(0,check)).trim();
 const note=check<0?'':parts[1].slice(check+2).trim();
 return {wrong,right,note};
}
function SectionHead({index,title,vi,showVi}:{index:number;title:string;vi:string;showVi:boolean}){
 return <div className="sle-gra02-heading"><span className="sle-gra02-step" aria-hidden="true">{index}</span><div><h3>{title}</h3>{showVi&&<p lang="vi">{vi}</p>}</div></div>;
}
export function GrammarA102Notes({lesson,sections,showVi}:{lesson:SeedLesson;sections:Section[];showVi:boolean}){
 const find=(fragment:string)=>sections.find(s=>s.title.toLowerCase().includes(fragment));
 const core=find('core rule');
 const worked=find('worked example');
 const mistakes=find('common mistakes');
 const remember=find('remember');
 // Guard against unexpectedly changed authoring: do not silently replace
 // unknown curriculum prose with a hard-coded older lesson.
 if(!core||!worked||!mistakes||!remember)return <section className="gdp-integrated" aria-label="Grammar lesson notes">
   <section className="gdp-card gdp-goals"><h3>Learning goals</h3><ul>{lesson.objectives.map(x=><li key={x}>{x}</li>)}</ul></section>
   {sections.map((s,i)=><section className="gdp-card" key={i}><h3>{s.title}</h3><TeachingBlocks text={s.text}/></section>)}
   {showVi&&lesson.explanation.vi&&<section className="gdp-card gdp-vi" lang="vi"><h3>Vietnamese Support</h3><TeachingBlocks text={lesson.explanation.vi}/></section>}
 </section>;
 const workedLines=lines(worked.text);
 const mistakeLines=lines(mistakes.text);
 return <section className="sle-gra02" aria-label="Pronouns and possessive adjectives lesson notes">
  <section className="sle-gra02-section" aria-label="Learning goals">
   <SectionHead index={1} title="What you will learn" vi="Mục tiêu bài học" showVi={showVi}/>
   <ul className="sle-gra02-goals">{lesson.objectives.map(goal=><li key={goal}><span aria-hidden="true">✓</span><Inline text={goal}/></li>)}</ul>
  </section>
  <section className="sle-gra02-section" aria-label="The core idea">
   <SectionHead index={2} title="The Core Idea" vi="Ý cốt lõi cần nhớ" showVi={showVi}/>
   <div className="sle-gra02-core">
    <TeachingBlocks text={core.text}/>
    {showVi&&<p className="sle-gra02-translation" lang="vi">Đại từ chủ ngữ cho biết ai hoặc cái gì là chủ ngữ. Tính từ sở hữu cho biết của ai và đứng trước một cụm danh từ.</p>}
    <div className="sle-gra02-formulas">
     <div><strong className="sle-gra02-subj">Subject pronoun</strong> + verb <span aria-hidden="true">→</span> <em><b>She</b> is kind.</em></div>
     <div><strong className="sle-gra02-poss">Possessive adjective</strong> + noun <span aria-hidden="true">→</span> <em><b>His pencil</b> is blue.</em></div>
    </div>
   </div>
  </section>
  <section className="sle-gra02-section">
   <SectionHead index={3} title="7 Pairs to Know" vi="Bảng đối chiếu bảy cặp từ" showVi={showVi}/>
   <div className="sle-gra02-table-scroll" role="region" aria-label="Pronoun and possessive adjective comparison" tabIndex={0}>
    <table>
     <thead><tr><th scope="col">Meaning</th><th scope="col">Subject pronoun</th><th scope="col">Possessive adjective</th><th scope="col">Example pair</th></tr></thead>
     <tbody>{pairs.map(p=><tr key={p.subject}>
      <td lang="vi">{p.meaning}</td>
      <td><strong className="sle-gra02-subj">{p.subject}</strong></td>
      <td><strong className="sle-gra02-poss">{p.possessive}</strong> + noun</td>
      <td>{p.a}<strong className="sle-gra02-subj">{p.subject==='I'?'I':p.subject==='you'?'You':p.subject[0].toUpperCase()+p.subject.slice(1)}</strong>{p.b}
       <span className="sle-gra02-arrow" aria-label="corresponds to">→</span>
       {p.c}<strong className="sle-gra02-poss">{p.c?p.possessive:p.possessive[0].toUpperCase()+p.possessive.slice(1)}</strong>{p.d}</td>
     </tr>)}</tbody>
    </table>
   </div>
  </section>
  <section className="sle-gra02-section">
   <SectionHead index={4} title="How to Use in Context" vi="Cách dùng qua ví dụ thực tế" showVi={showVi}/>
   <div className="sle-gra02-examples">{workedLines.map((line,i)=>{
    const parts=splitWorked(line);
    return <article className="sle-gra02-example" key={i}>{parts?<>
     <div className="sle-gra02-situation">{i+1}. {parts.context}</div>
     <div className="sle-gra02-sentence"><Inline text={parts.sentence}/></div>
     <p className="sle-gra02-why"><strong>Why:</strong> <Inline text={parts.why}/></p>
     {showVi&&exampleVi[i]&&<p className="sle-gra02-translation" lang="vi">{exampleVi[i]}</p>}
    </>:<TeachingBlocks text={line}/>}</article>;
   })}</div>
  </section>
  <section className="sle-gra02-section">
   <SectionHead index={5} title="Common Mistakes to Avoid" vi="Lỗi sai thường gặp" showVi={showVi}/>
   <div className="sle-gra02-mistakes">{mistakeLines.map((line,i)=>{
    const parts=splitMistake(line);
    return <div className="sle-gra02-mistake" key={i}>{parts?<>
     <div className="sle-gra02-wrong"><span aria-label="Incorrect">✗</span> <Inline text={parts.wrong}/></div>
     <div className="sle-gra02-right"><span aria-label="Correct">✓</span> <Inline text={parts.right}/></div>
     {parts.note&&<p className="sle-gra02-rule"><strong>Rule:</strong> <Inline text={parts.note}/></p>}
     {showVi&&mistakeVi[i]&&<p className="sle-gra02-translation" lang="vi">{mistakeVi[i]}</p>}
    </>:<TeachingBlocks text={line}/>}</div>;
   })}</div>
  </section>
  <section className="sle-gra02-section sle-gra02-remember">
   <h3>Remember</h3>
   <TeachingBlocks text={remember.text}/>
   {showVi&&<p className="sle-gra02-translation" lang="vi">Khi từ đi trước một cụm danh từ, hãy chọn tính từ sở hữu phù hợp.</p>}
  </section>
  <section className="sle-gra02-section">
   <SectionHead index={6} title="Quick Self-Check" vi="Tự kiểm tra nhanh, không tính điểm" showVi={showVi}/>
   <CompactGrammarSelfCheck showVi={showVi} items={checks.map((q,i)=>({id:'legacy-QC'+(i+1),prompt:q.prompt,options:q.options.map(text=>({text,correct:text===q.answer,feedback:text===q.answer?q.why:q.wrong,vi:q.vi}))}))}/>
  </section>
 </section>;
}

export type GrammarQuickCheck={id:string;prompt:string;options:readonly {text:string;correct:boolean;feedback:string;vi:string}[]};
/** Shared deployed GRA-A1-02 compact control. Ephemeral only, no graded state. */
export function CompactGrammarSelfCheck({items,showVi}:{items:readonly GrammarQuickCheck[];showVi:boolean}){
 const [responses,setResponses]=useState<Record<number,string>>({});
 return <div className="sle-gra02-quiz" aria-label="Unscored lesson quick check">
  <p className="sle-gra02-quiz-note">Try these before starting practice. This is unscored and is not saved to your results.</p>
  {items.map((q,i)=>{
   const selected=q.options.find(o=>o.text===responses[i]);
   return <div className="sle-gra02-question" key={q.id}>
    <p><strong>{i+1}.</strong> {q.prompt}</p>
    <div className="sle-gra02-options" role="group" aria-label={'Quick check question '+(i+1)}>
     {q.options.map(o=><button type="button" key={o.text} aria-pressed={selected===o}
       className={'sle-gra02-answer'+(selected===o?(o.correct?' is-correct':' is-wrong'):'')}
       onClick={()=>setResponses(prev=>({...prev,[i]:o.text}))}>{o.text}</button>)}
    </div>
    {selected&&<p className="sle-gra02-feedback" role="status" aria-live="polite">{selected.correct?'✓ '+selected.feedback:/^Try again\b/i.test(selected.feedback)?selected.feedback:'Try again. '+selected.feedback}</p>}
    {selected&&showVi&&<p lang="vi" className="sle-gra02-translation">{selected.vi}</p>}
   </div>;
  })}
 </div>;
}
