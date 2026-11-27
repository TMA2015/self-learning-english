'use client';
import type {ReactNode} from 'react';
import type {SeedLesson} from '../domain/academic';

// Presentation-only copy edits, not changes to versioned lesson/assessment source.
const learnerCopy:[string,string][]=[
 ['You can revise after an adult reviews the actual text.','Revise your own text after checking the feedback.'],
 ['Adult feedback should lead to a revision you write yourself.','Write your own revision after checking feedback.'],
 [' before adult review',''],
 ['Your own paragraph, not your word count, is the evidence for adult review.','Focus on the quality of your own paragraph, not just its length.'],
 ['Word count helps with planning but does not determine quality; your writing needs an adult review.','Word count helps with planning but does not determine quality.'],
 ['An adult reviews the original writing; no automatic proficiency score is assigned.',''],
 ['; bài viết cần người lớn đánh giá.','.'],
 [' Bài viết được người lớn nhận xét, không chấm CEFR tự động.',''],
 [' Bài tự luận chờ người lớn nhận xét.',''],
];
export function learnerLessonText(text:string){return learnerCopy.reduce((s,[from,to])=>s.replaceAll(from,to),text).trim()}
function Heading({n,en,vi,showVi}:{n:number;en:string;vi:string;showVi:boolean}){return <div className="sle-overview-heading"><span aria-hidden="true">{n}</span><div><h3>{en}</h3>{showVi&&<p lang="vi">{vi}</p>}</div></div>}
function Section({n,en,vi,showVi,children}:{n:number;en:string;vi:string;showVi:boolean;children:ReactNode}){return <section className="sle-overview-section"><Heading n={n} en={en} vi={vi} showVi={showVi}/>{children}</section>}
const headings:Record<string,[string,string,string,string]>={
 listening:['How to listen','Cách nghe','What to listen for','Thông tin cần chú ý'],
 writing:['Plan your writing','Lập kế hoạch trước khi viết','Worked example','Ví dụ có hướng dẫn'],
 speaking:['Prepare to speak','Chuẩn bị luyện nói','Useful expressions','Mẫu câu hữu ích'],
 pronunciation:['Sound and stress patterns','Âm và trọng âm','Practise the patterns','Luyện tập'],
};
export function LessonOverviewNotes({lesson,showVi,hideExamples=false}:{lesson:SeedLesson;showVi:boolean;hideExamples?:boolean}){
 const labels=headings[lesson.module]??['The core idea','Kiến thức trọng tâm','Worked examples','Ví dụ minh họa'];
 const productionNotes=lesson.module==='listening'&&['LIS-A2-03','LIS-B1-04'].includes(lesson.id)&&lesson.explanation.en.includes('Real MP3 required before import.');
 const explanation=productionNotes?'Listen for the main purpose, important details and the speakers’ final decision.':learnerLessonText(lesson.explanation.en);
 const paragraphs=explanation.split(/\n\s*\n/);
 const listeningDemo=lesson.id==='LIS-A1-02'&&explanation==='For a short announcement, listen first for the main purpose. On the second listen, note practical details such as day, time, room and what to bring. Words such as now, instead and changed often signal new information.';
 const writingDemo=lesson.id==='WRI-A2-03'&&explanation==='A useful recommendation considers another person’s needs. First analyse the task: who is the reader, what do they enjoy, what time can they attend and what must you recommend? Brainstorm reasons for each option, then select the one supported by the facts. Make an outline: friendly greeting, clear choice, two reasons, helpful ending. Use a basic comparative when useful, such as shorter than, but do not invent facts about fees or teachers. After drafting, check every required point and whether the reasons support your choice.'&&JSON.stringify(lesson.examples)===JSON.stringify(['AUDIENCE · Mia likes drawing and is free on Tuesdays.','OPTIONS · Art Club Tuesday; Sports Club Thursday.','CHOICE · I recommend Art Club.','SUPPORT · It matches your interest and your available day.','CHECK · Are there two specific reasons and a friendly ending?']);
 const soundDemo=lesson.id==='PRO-A2-03'&&explanation==='Regular past-tense -ed is not always pronounced as a separate syllable. In common standard pronunciation, it can sound like /t/ as in worked, /d/ as in played, or /ɪd/ as in wanted. The spelling stays -ed, but the sound changes according to the final sound of the base verb. Listen to a model before practising.';
 const steps=listeningDemo?[
 ['First listen','For a short announcement, listen first for the main purpose.'],
 ['Second listen','On the second listen, note practical details such as day, time, room and what to bring.'],
 ['Notice changes','Words such as now, instead and changed often signal new information.']
 ]:writingDemo?[
 ['Analyse the task','Who is the reader, what do they enjoy, what time can they attend and what must you recommend?'],
 ['Brainstorm','Brainstorm reasons for each option, then select the one supported by the facts.'],
 ['Make an outline','Friendly greeting, clear choice, two reasons, helpful ending.'],
 ['Draft and review','Use a basic comparative when useful, such as shorter than, but do not invent facts about fees or teachers. After drafting, check every required point and whether the reasons support your choice.']
 ]:null;
 return <section className="sle-overview" aria-label="Lesson notes">
 <Section n={1} en="Learning goals" vi="Mục tiêu học tập" showVi={showVi}><div className="sle-overview-goal"><ul>{lesson.objectives.map((o,i)=><li key={i}>{learnerLessonText(o)}</li>)}</ul></div></Section>
 <Section n={2} en={soundDemo?'Three ending sounds':writingDemo?'Plan your recommendation':labels[0]} vi={labels[1]} showVi={showVi}>
 {writingDemo&&<div className="sle-overview-card"><p>A useful recommendation considers another person’s needs.</p></div>}
 {steps?<ol className="sle-overview-steps">{steps.map(([t,b])=><li key={t}><strong>{t}</strong><p>{b}</p></li>)}</ol>:<div className="sle-overview-card">{paragraphs.map((p,i)=><p key={i}>{p}</p>)}</div>}
 {showVi&&lesson.explanation.vi&&<div className="sle-overview-vi" lang="vi">{learnerLessonText(lesson.explanation.vi)}</div>}
 {soundDemo&&!hideExamples&&<div className="sle-overview-grid three">{lesson.examples.map((e,i)=>{const [label,...body]=e.split(' · ');return <article className="sle-overview-card" key={i}><strong className="sle-overview-ipa">{label}</strong><p>{body.join(' · ')}</p></article>})}</div>}
 </Section>
 {writingDemo&&!hideExamples&&<Section n={3} en="Worked example" vi="Ví dụ có hướng dẫn" showVi={showVi}><div className="sle-overview-model"><h4>Audience and options</h4><p>Mia likes drawing and is free on Tuesdays.</p><div className="sle-overview-table"><table><thead><tr><th>Option</th><th>Day</th></tr></thead><tbody><tr><td>Art Club</td><td>Tuesday</td></tr><tr><td>Sports Club</td><td>Thursday</td></tr></tbody></table></div><p><strong>Choice:</strong> I recommend Art Club.</p><p><strong>Support:</strong> It matches your interest and your available day.</p></div></Section>}
 {!hideExamples&&!soundDemo&&!writingDemo&&lesson.examples.length>0&&<Section n={3} en={labels[2]} vi={labels[3]} showVi={showVi}><div className={'sle-overview-grid'+(listeningDemo?' three':'')}>{lesson.examples.map((e,i)=>{const ix=e.indexOf(' · '),labeled=ix>0&&ix<35;return <article className={writingDemo?'sle-overview-model':'sle-overview-card'} key={i}><h4>{labeled?e.slice(0,ix):'Example '+(i+1)}</h4><p>{learnerLessonText(labeled?e.slice(ix+3):e)}</p></article>})}</div></Section>}
 {writingDemo&&<Section n={4} en="Before you submit" vi="Kiểm tra lại bài viết" showVi={showVi}><div className="sle-overview-card"><p>Are there two specific reasons and a friendly ending?</p>{["My recommendation fits the reader's needs.","My reasons are supported by the facts.","I have checked every required point."].map(s=><label key={s} className="sle-overview-check"><input type="checkbox"/>{s}</label>)}</div></Section>}
 {lesson.module==='listening'&&<p className="sle-overview-vi">Play the complete recording in Practice before submitting answers. The transcript is available after submission only. If audio is unavailable, Listening remains unassessed.</p>}
 {lesson.module==='pronunciation'&&<Section n={soundDemo?3:lesson.examples.length?4:3} en="Listen, then practise" vi="Nghe mẫu rồi luyện tập" showVi={showVi}><div className="sle-overview-vi">Listen to the model in Practice before practising aloud. If audio is unavailable, you can review the examples without an audio-based score.</div>{soundDemo&&<div className="sle-overview-model"><h4>Practice phrases</h4><p>worked late · played outside<br/>wanted help · needed time</p></div>}</Section>}
 </section>
}
