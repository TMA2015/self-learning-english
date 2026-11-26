'use client';
import {useState} from 'react';
import type {SeedLesson} from '../domain/academic';
import raw from '../content/reading-knowledge-v23.json';
import './reading-knowledge-v23.css';

type Pair={en:string;vi:string};
type Option={id:string;text:string;feedback:Pair};
type Check={id:string;prompt:string;options:Option[];key:string};
type Notes={title:string;goal:Pair;context:Pair;strategy:{label:string;labelVi:string;en:string;vi:string}[];modelTitle:string;passage:string[];lenses:{label:string;refs:string[];en:string;vi:string}[];extras:string[];worked:{prompt:string;options:string[];answer:Pair};quickTitle:string;quickText:string;checks:Check[];transfer:{text:string;prompt:Pair;criteria:string;model:Pair};evidence_weight:number};
const lessons:Record<string,Notes>=raw.lessons;
export function readingKnowledgeV23Available(lesson:SeedLesson,version:string){
 return (version===raw.version||(raw.version==='1.28.0'&&version==='1.28.1'))&&lesson.module==='reading'&&Object.prototype.hasOwnProperty.call(lessons,lesson.id);
}
function Text({value,showVi}:{value:Pair;showVi:boolean}){
 return <><p>{value.en}</p>{showVi&&<p className="sle-rea-vi" lang="vi">{value.vi}</p>}</>;
}
function Header({n,en,vi,showVi}:{n:number;en:string;vi:string;showVi:boolean}){
 return <div className="sle-rea-heading"><span aria-hidden="true">{n}</span><div><h3>{en}</h3>{showVi&&<p lang="vi" className="sle-rea-vi">{vi}</p>}</div></div>;
}
function Quick({task,showVi}:{task:Check;showVi:boolean}){
 const [choice,setChoice]=useState<string|null>(null);
 const selected=task.options.find(o=>o.id===choice);
 return <article className="sle-rea-card" data-quick-id={task.id}><h4>{task.prompt}</h4>
 <div className="sle-rea-choices" role="group" aria-label={task.prompt}>{task.options.map(o=><button key={o.id} type="button" aria-pressed={choice===o.id} onClick={()=>setChoice(o.id)}>{o.id}. {o.text}</button>)}</div>
 {selected&&<div role="status" className="sle-rea-feedback"><Text value={selected.feedback} showVi={showVi}/><button type="button" onClick={()=>setChoice(null)}>Try again</button></div>}</article>;
}
function ModelTable({headers,rows}:{headers:string[];rows:string[][]}){
 return <div className="sle-rea-table-scroll" tabIndex={0} role="region" aria-label="Worked comparison table"><table><thead><tr>{headers.map((x,i)=><th key={i} scope="col">{x}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((x,j)=><td key={j}>{x}</td>)}</tr>)}</tbody></table></div>;
}
function ModelExtras({lines,showVi}:{lines:string[];showVi:boolean}){
 if(!lines.length)return null;
 const tableLines=lines.filter(l=>l.startsWith('|'));
 const prose=lines.filter(l=>!l.startsWith('|'));
 const cells=(l:string)=>l.split('|').slice(1,-1).map(s=>s.trim());
 const first=lines[0];
 if(first.startsWith('Schematic (not to scale')){
  return <figure className="sle-rea-card"><figcaption>Schematic · not to scale</figcaption><p>N ↑ · E →</p><div className="sle-rea-map" role="img" aria-label="The fountain is north of the post office. From west to east: station, post office, flower shop.">
  <span className="sle-rea-map-north">Fountain</span><span className="sle-rea-map-link" aria-hidden="true">│</span><span>Station</span><span>Post office</span><span>Flower shop</span></div></figure>;
 }
 if(first.startsWith('Schematic timeline')){
  const timeline=first.split(': ')[1].split('. Do not draw')[0].split(' → ');
  return <figure className="sle-rea-card"><figcaption>Schematic timeline · not to scale</figcaption><ol className="sle-rea-timeline">{timeline.map(t=><li key={t}>{t}</li>)}</ol>{showVi&&<p lang="vi" className="sle-rea-vi">Sơ đồ thứ tự, không theo tỉ lệ.</p>}</figure>;
 }
 if(!tableLines.length&&first.startsWith('Worked ')&&first.includes('|')){
  const body=first.slice(first.indexOf(': ')+2).split('. VI ')[0].replace(/\.$/,'');
  const split=(s:string)=>s.split(' | ');
  const vi=first.includes('. VI ')?first.slice(first.indexOf('. VI ')+2):'';
  let headers:string[]=[],rows:string[][]=[];
  if(first.startsWith('Worked status table')||first.includes('session | day/time')){
   const chunks=body.split('. ');headers=split(chunks.shift()!);rows=chunks.map(split);
  }else if(first.includes('earlier place')){
   headers=['Fact','Earlier','Current'];rows=body.split('; ').map((r,i)=>[(['Place','Start','Arrival'])[i],...split(r).map(x=>x.replace(/^(earlier place |current |earlier start |current start |arrival )/,''))]);
  }else if(first.includes('departure 10:00')){
   headers=['Fact','River tour','History walk'];rows=body.split('; ').map((r,i)=>{const labels=['departure','duration','basic price','guidebook','under 12'];return [labels[i],...split(r).map((x,j)=>j===0?x.slice(labels[i].length).trim():x)]});
  }
  if(rows.length&&headers.length&&rows.every(r=>r.length===headers.length))return <div className="sle-rea-card sle-rea-extras"><p>Worked comparison · model only</p><ModelTable headers={headers} rows={rows}/>{showVi&&vi&&<p lang="vi" className="sle-rea-vi">{vi}</p>}</div>;
 }
 return <div className="sle-rea-card sle-rea-extras">
 {prose.filter(l=>!l.startsWith('VI labels:')).map((l,i)=>{const ix=l.indexOf(' VI ');return <div key={i}><p>{ix<0?l:l.slice(0,ix)}</p>{showVi&&ix>=0&&<p lang="vi" className="sle-rea-vi">{l.slice(ix+1)}</p>}</div>})}
 {tableLines.length>2&&<ModelTable headers={cells(tableLines[0])} rows={tableLines.slice(2).map(cells)}/>}
 {prose.filter(l=>l.startsWith('VI labels:')).map((l,i)=>{
  const caution='Do not turn an unconfirmed quantity into zero.';
  const hasCaution=l.endsWith(' '+caution);
  return <div key={i}>{hasCaution&&<p>{caution}</p>}{showVi&&<p lang="vi" className="sle-rea-vi">{hasCaution?l.slice(0,-caution.length).trimEnd():l}</p>}</div>;
 })}
 </div>;
}
function Body({d,showVi}:{d:Notes;showVi:boolean}){
 const [lens,setLens]=useState<number|null>(null),[answer,setAnswer]=useState(''),[model,setModel]=useState(false);
 const active=lens===null?undefined:d.lenses[lens];
 return <section className="sle-rea-v23" aria-label="Reading Knowledge v2.3">
 <Header n={1} en="Learning goal" vi="Mục tiêu" showVi={showVi}/><div className="sle-rea-card"><h4>{d.title}</h4><Text value={d.goal} showVi={showVi}/><Text value={d.context} showVi={showVi}/></div>
 <Header n={2} en="Reading strategies" vi="Chiến lược đọc" showVi={showVi}/><div className="sle-rea-grid">{d.strategy.map(s=><article className="sle-rea-card" key={s.label}><h4>{s.label}{showVi&&<span lang="vi"> · {s.labelVi}</span>}</h4><Text value={s} showVi={showVi}/></article>)}</div>
 <Header n={3} en="Explore the text" vi="Khám phá văn bản" showVi={showVi}/><div className="sle-rea-card"><h4>{d.modelTitle}</h4><div className="sle-rea-choices" role="group" aria-label="Sentence lenses">{d.lenses.map((l,i)=><button type="button" key={l.label} aria-pressed={lens===i} onClick={()=>setLens(lens===i?null:i)}>{l.label}</button>)}</div>
 <div aria-label="Worked reading text">{d.passage.map((p,i)=><p key={i} className={active?.refs.some(r=>p.startsWith(r+'. '))?'sle-rea-highlight':'sle-rea-sentence'}>{p}</p>)}</div>
 {active&&<div className="sle-rea-feedback" role="status"><strong>{active.refs.join(', ')}</strong><Text value={active} showVi={showVi}/></div>}
 <ModelExtras lines={d.extras} showVi={showVi}/></div>
 <Header n={4} en="Worked question" vi="Câu hỏi mẫu" showVi={showVi}/><article className="sle-rea-card"><h4>{d.worked.prompt}</h4><ul>{d.worked.options.map((o,i)=><li key={i}>{o}</li>)}</ul><details><summary>Show model reasoning</summary><Text value={d.worked.answer} showVi={showVi}/></details></article>
 <Header n={5} en="Quick checks · practice only" vi="Tự kiểm tra · không tính điểm" showVi={showVi}/><article className="sle-rea-card"><h4>{d.quickTitle}</h4><p className="sle-rea-copy">{d.quickText}</p></article>{d.checks.map(c=><Quick key={c.id} task={c} showVi={showVi}/>)}
 <Header n={6} en="Try a new text" vi="Vận dụng với văn bản mới" showVi={showVi}/><article className="sle-rea-card"><p className="sle-rea-copy">{d.transfer.text}</p><label htmlFor="sle-rea-transfer">{d.transfer.prompt.en}</label>{showVi&&<p lang="vi" className="sle-rea-vi">{d.transfer.prompt.vi}</p>}<textarea id="sle-rea-transfer" rows={4} value={answer} onChange={e=>{setAnswer(e.target.value);setModel(false)}}/><p className="muted">Optional practice. Your response is not saved or graded.</p><p>{d.transfer.criteria}</p><div className="sle-rea-choices"><button type="button" aria-expanded={model} onClick={()=>setModel(v=>!v)}>{model?'Hide model':'Compare with model'}</button><button type="button" onClick={()=>{setAnswer('');setModel(false)}}>Try again</button></div>{model&&<div className="sle-rea-feedback"><Text value={d.transfer.model} showVi={showVi}/></div>}</article>
 </section>;
}
export function ReadingKnowledgeV23({lesson,version,showVi}:{lesson:SeedLesson;version:string;showVi:boolean}){
 if(!readingKnowledgeV23Available(lesson,version))return null;
 return <Body key={lesson.id+':'+version} d={lessons[lesson.id]} showVi={showVi}/>;
}
