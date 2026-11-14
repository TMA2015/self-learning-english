'use client';
import {useRef,useState} from 'react';
import type {PointerEvent as ReactPointerEvent} from 'react';

/** R2 UX prototype, local component state only; no grading, storage or network. */
export type SortCategory='fit'|'explain'|'off';
type Card={id:string;text:string;expected:SortCategory;why:string};
export const R2_SORT_CARDS:Card[]=[
 {id:'mural',text:'Visitors add a drawing to a shared mural',expected:'fit',why:'Visitors take part directly by creating a shared artwork.'},
 {id:'map',text:'Print a larger map of the building entrance',expected:'explain',why:'A map may help visitors navigate, but does not yet describe an activity they join.'},
 {id:'lunch',text:'Change the price of school lunches',expected:'off',why:'School lunch prices do not answer an exhibition activity task.'},
 {id:'collage',text:'Invite visitors to choose a community collage theme',expected:'fit',why:'Visitors take part by choosing the theme for a shared piece of art.'}
];
const BINS:{id:SortCategory;title:string;hint:string}[]=[
 {id:'fit',title:'Fits',hint:'Answers the task'},
 {id:'explain',title:'Needs explanation',hint:'Could fit after repair'},
 {id:'off',title:'Off topic',hint:'Not relevant'}
];
export function Week2R2SortBoard(){
 const [placed,setPlaced]=useState<Record<string,SortCategory>>({});
 const [selected,setSelected]=useState<string|null>(null);
 const [ghost,setGhost]=useState<{x:number;y:number;text:string}|null>(null);
 const [review,setReview]=useState(false);
 const [announce,setAnnounce]=useState('Tap an idea card, then tap a category. You can also drag from its grip.');
 const gesture=useRef<{id:string;x:number;y:number;moved:boolean}|null>(null);
 const finished=R2_SORT_CARDS.every(c=>Boolean(placed[c.id]));
 const place=(id:string,bin:SortCategory|null)=>{
  setPlaced(old=>{const next={...old};if(bin)next[id]=bin;else delete next[id];return next;});
  setSelected(null);setGhost(null);setReview(false);
  setAnnounce(bin?'Idea moved to '+BINS.find(b=>b.id===bin)?.title+'.':'Idea returned to the unsorted pool.');
 };
 const onDown=(e:ReactPointerEvent<HTMLButtonElement>,card:Card)=>{
  if(e.button!==0)return;
  e.currentTarget.setPointerCapture(e.pointerId);
  gesture.current={id:card.id,x:e.clientX,y:e.clientY,moved:false};
 };
 const onMove=(e:ReactPointerEvent<HTMLButtonElement>,card:Card)=>{
  const move=gesture.current;
  if(!move||move.id!==card.id)return;
  if(Math.hypot(e.clientX-move.x,e.clientY-move.y)>8){
   move.moved=true;setGhost({x:e.clientX,y:e.clientY,text:card.text});
  }
 };
 const onUp=(e:ReactPointerEvent<HTMLButtonElement>,card:Card)=>{
  const move=gesture.current;
  if(!move||move.id!==card.id)return;
  gesture.current=null;setGhost(null);
  if(move.moved){
   const target=document.elementFromPoint(e.clientX,e.clientY);
   const bin=target?.closest<HTMLElement>('[data-r2-sort-bin]')?.dataset.r2SortBin as SortCategory|undefined;
   const pool=target?.closest('[data-r2-sort-pool]');
   if(bin&&BINS.some(b=>b.id===bin))place(card.id,bin);
   else if(pool)place(card.id,null);
   else setAnnounce('Release over a destination, or tap an idea then a category.');
  }else{setSelected(card.id);setAnnounce('Idea selected. Choose a category.');}
 };
 const renderCard=(card:Card)=><div key={card.id} className={'r2-sort-card'+(selected===card.id?' is-selected':'')}>
   <button type="button" className="r2-grip" aria-label={'Drag or select '+card.text} aria-pressed={selected===card.id}
     onPointerDown={e=>onDown(e,card)} onPointerMove={e=>onMove(e,card)}
     onPointerUp={e=>onUp(e,card)} onPointerCancel={()=>{gesture.current=null;setGhost(null);}}
     onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(card.id);setAnnounce('Idea selected. Choose a category.');}}}>⠿</button>
   <button type="button" className="r2-card-text" aria-pressed={selected===card.id}
     onClick={()=>{setSelected(card.id);setAnnounce('Idea selected. Tap a category.');}}>{card.text}</button>
   {placed[card.id]&&<button type="button" className="r2-return" onClick={()=>place(card.id,null)} aria-label={'Return '+card.text+' to pool'}>↶</button>}
  </div>;
 return <section className="r2-sort" aria-label="R2 idea sorting with accessible drag and tap">
  <header className="r2-heading">
   <div><span className="r2-kicker">GUIDED PRACTICE · R2 UX PROTOTYPE</span>
    <h2>Sort ideas by moving cards</h2>
    <p>Drag a card into a category, or tap the card and then tap its destination. Different interpretations can be explained.</p></div>
   <button type="button" className="r2-secondary" onClick={()=>{setPlaced({});setReview(false);setSelected(null);setAnnounce('All cards reset.');}}>Reset</button>
  </header>
  <div className="r2-prompt"><small>THE TASK</small>A community art exhibition wants one weekend activity that helps visitors join in.</div>
  <section className="r2-pool" data-r2-sort-pool="true" aria-label="Unsorted cards">
   <div className="r2-zone-top"><strong>Unsorted ideas</strong><span>{R2_SORT_CARDS.filter(c=>!placed[c.id]).length} left</span></div>
   <div className="r2-cards">{R2_SORT_CARDS.filter(c=>!placed[c.id]).map(renderCard)}
    {finished&&<p className="r2-muted">All cards placed. You can change your decisions.</p>}
   </div>
  </section>
  <div className="r2-bins">
   {BINS.map(bin=><section key={bin.id} className={'r2-bin r2-bin-'+bin.id} data-r2-sort-bin={bin.id} aria-label={bin.title}>
    <button type="button" className="r2-bin-button" onClick={()=>selected?place(selected,bin.id):setAnnounce('Select a card first, then choose '+bin.title+'.')}
     aria-label={'Place selected card in '+bin.title}>
      <strong>{bin.title}</strong><small>{bin.hint}</small><span>{R2_SORT_CARDS.filter(c=>placed[c.id]===bin.id).length} cards</span>
    </button>
    <div className="r2-cards">{R2_SORT_CARDS.filter(c=>placed[c.id]===bin.id).map(renderCard)}</div>
   </section>)}
  </div>
  {ghost&&<div className="r2-drag-ghost" aria-hidden="true" style={{left:ghost.x+12,top:ghost.y+12}}>{ghost.text}</div>}
  <p role="status" aria-live="polite" className="r2-status">{announce}</p>
  <button type="button" className="r2-primary" disabled={!finished} onClick={()=>setReview(x=>!x)}>
   {review?'Hide explanations':'Compare with reviewed reasoning'} ({Object.keys(placed).length}/4)
  </button>
  {review&&<section className="r2-review"><h3>Compare your reasoning</h3>
   {R2_SORT_CARDS.map(c=><article key={c.id}><strong>{c.text}</strong>
    <p>Your choice: {BINS.find(b=>b.id===placed[c.id])?.title}. One defensible reading: <strong>{BINS.find(b=>b.id===c.expected)?.title}</strong>.</p>
    <p>{c.why}</p></article>)}
   <p>No grade, CEFR or stored proficiency evidence is generated by this exercise.</p>
  </section>}
 </section>;
}