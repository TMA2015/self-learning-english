'use client';
import {useState,type ReactNode} from 'react';
import pilot from '../../content/design-previews/grammar-pilot-v1.json';

export {Inline,TeachingBlocks} from '../teaching-blocks';
import {TeachingBlocks} from '../teaching-blocks';
const coreTitles=['Core rule / Meaning','When to use','Worked examples'];
export function LessonDesign({lesson,showVi}:{lesson:typeof pilot.lessons[number];showVi:boolean}){
 const core=coreTitles.map(title=>lesson.sections.find(s=>s.title===title)).filter(s=>!!s);
 const adaptive=lesson.sections.filter(s=>!coreTitles.includes(s.title)&&!s.title.startsWith('Vietnamese'));
 const vi=lesson.sections.find(s=>s.title.startsWith('Vietnamese'));
 return <article className="gdp-lesson" aria-labelledby="gdp-title">
  <header><span className="gdp-eyebrow">{lesson.id} · {lesson.cefr_target} lesson target</span><h1 id="gdp-title">{lesson.title}</h1><p className="gdp-subtitle">Learn the idea, see it in use, then explore the details.</p></header>
  <section className="gdp-card gdp-goals"><span className="gdp-number">01 · GOALS</span><h2>What you will learn</h2><ul>{lesson.baseline_goals.map(goal=><li key={goal}>{goal}</li>)}</ul></section>
  {core.map((s,i)=><section className={'gdp-card '+(s.title==='Worked examples'?'gdp-examples':'')} key={s.title}><span className="gdp-number">0{i+2} · {['UNDERSTAND','USE','SEE IT WORK'][i]}</span><h2>{s.title==='Core rule / Meaning'?'The core idea':s.title}</h2><TeachingBlocks text={s.markdown}/></section>)}
  <div className="gdp-adaptive-heading"><h2>A closer look</h2><p>Patterns and useful distinctions for this lesson.</p></div>
  <div className="gdp-adaptive">{adaptive.map(s=><section className={'gdp-card '+(s.title==='Common mistakes'?'gdp-mistakes':'')} key={s.title}><h3>{s.title}</h3><TeachingBlocks text={s.markdown}/></section>)}</div>
  {showVi&&vi&&<section className="gdp-card gdp-vi" lang="vi"><h2>Vietnamese Support</h2><TeachingBlocks text={vi.markdown}/></section>}
 </article>;
}
export default function GrammarDesignPreview(){
 const [id,setId]=useState(pilot.lessons[0].id),[showVi,setShowVi]=useState(false);
 const lesson=pilot.lessons.find(l=>l.id===id)!;
 return <main className="gdp-shell">
  <div className="gdp-top"><span className="gdp-brand">G Learning · English</span><label className="gdp-language"><input type="checkbox" checked={showVi} onChange={e=>setShowVi(e.target.checked)}/> Vietnamese Support</label></div>
  <aside className="gdp-preview-note" aria-label="Preview scope"><strong>Lesson design preview · 3 lessons</strong><p>Teaching preview {pilot.previewId} for content v{pilot.baselineCurriculumVersion}. Practice, grading and saved learner work are unchanged. This page does not save progress.</p></aside>
  <nav className="gdp-picker" aria-label="Choose a pilot lesson">{pilot.lessons.map(l=><button type="button" key={l.id} aria-pressed={id===l.id} onClick={()=>setId(l.id)}><span>{l.id} · {l.cefr_target}</span><strong>{l.title}</strong></button>)}</nav>
  <LessonDesign key={id} lesson={lesson} showVi={showVi}/>
  <footer className="gdp-footer">Lesson targets and reading this preview do not establish a language level.</footer>
 </main>;
}
