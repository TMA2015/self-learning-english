'use client';
import {useEffect,useRef,useState} from 'react';

/** R2 visual UX-only concept: edits never touch WeekWork, storage or network. */
export type R2Kind='idea'|'reason'|'example'|'vocab';
export type R2Node={id:string;parent:string|null;kind:R2Kind;text:string};
export type R2MindState={nodes:R2Node[];bestId:string|null;rejectId:string|null};
export const R2_TASK='Your school can add one new after-school activity. What activity should it add? Give reasons.';
const DEMO_NODES:R2Node[]=[
 {id:'art',parent:null,kind:'idea',text:'Art club'},
 {id:'sport',parent:null,kind:'idea',text:'Sports club'},
 {id:'art-r1',parent:'art',kind:'reason',text:'Help students express creativity'},
 {id:'art-v1',parent:'art',kind:'vocab',text:'creative · teamwork · exhibition'},
 {id:'sport-r1',parent:'sport',kind:'reason',text:'Improve health and teamwork'}
];
export function r2CanonicalProjection(data:R2MindState){
 const ideas=data.nodes.filter(n=>n.kind==='idea'&&n.parent===null);
 const selected=ideas.find(n=>n.id===data.bestId);
 const rejected=ideas.find(n=>n.id===data.rejectId);
 const fit=selected?data.nodes.find(n=>n.parent===selected.id&&n.kind==='reason'):null;
 return {ideas:ideas.map(n=>n.text).join('\n'),reject:rejected?.text??'',best:selected?.text??'',fit:fit?.text??''};
}
const KIND_NAMES:Record<R2Kind,string>={idea:'IDEA',reason:'REASON',example:'EXAMPLE',vocab:'VOCABULARY'};

export function Week2R2MindWorkspace(){
 const [map,setMap]=useState<R2MindState>(()=>({nodes:DEMO_NODES.map(n=>({...n})),bestId:'art',rejectId:null}));
 const [focus,setFocus]=useState('root');
 const [editor,setEditor]=useState(false);
 const [text,setText]=useState('');
 const [newText,setNewText]=useState('');
 const [kind,setKind]=useState<R2Kind>('reason');
 const [zoom,setZoom]=useState(100);
 const [showProjection,setShowProjection]=useState(false);
 const [status,setStatus]=useState('Tap the task to add an idea; tap a branch to grow it.');
 const nextId=useRef(50);
 const editRef=useRef<HTMLInputElement>(null);
 const focused=map.nodes.find(n=>n.id===focus);
 const roots=map.nodes.filter(n=>n.parent===null&&n.kind==='idea');
 const open=(id:string)=>{
  setFocus(id);setText(id==='root'?'':map.nodes.find(n=>n.id===id)?.text??'');
  setNewText('');setKind(id==='root'?'idea':'reason');setEditor(true);
 };
 useEffect(()=>{if(editor)editRef.current?.focus();},[editor,focus]);
 function depthOf(node:R2Node){
  let depth=0,p=node.parent;
  while(p&&depth<8){depth++;p=map.nodes.find(x=>x.id===p)?.parent??null;}
  return depth;
 }
 const add=(parent:string|null,childKind:R2Kind,value:string)=>{
  const trimmed=value.trim();
  if(!trimmed){setStatus('Write a short phrase first.');return;}
  const newId='r2-'+nextId.current++;
  setMap(old=>({...old,nodes:[...old.nodes,{id:newId,parent,kind:childKind,text:trimmed}]}));
  setFocus(newId);setText(trimmed);setNewText('');setEditor(true);
  setStatus('New '+childKind+' added. Select any branch to continue.');
 };
 const save=()=>{
  if(focus==='root'||!text.trim())return;
  setMap(old=>({...old,nodes:old.nodes.map(n=>n.id===focus?{...n,text:text.trim()}:n)}));
  setStatus('Branch edited in this unsaved prototype.');
 };
 const remove=(id:string)=>{
  const ids=new Set([id]);let changed=true;
  while(changed){changed=false;for(const n of map.nodes){if(n.parent&&ids.has(n.parent)&&!ids.has(n.id)){ids.add(n.id);changed=true;}}}
  setMap(old=>({...old,nodes:old.nodes.filter(n=>!ids.has(n.id)),
   bestId:old.bestId&&ids.has(old.bestId)?null:old.bestId,
   rejectId:old.rejectId&&ids.has(old.rejectId)?null:old.rejectId}));
  setFocus('root');setEditor(false);setStatus('Branch and child nodes removed.');
 };
 const best=(id:string)=>setMap(old=>({...old,bestId:id,rejectId:old.rejectId===id?null:old.rejectId}));
 const reject=(id:string)=>setMap(old=>({...old,rejectId:id,bestId:old.bestId===id?null:old.bestId}));
 const render=(node:R2Node)=>{
  const children=map.nodes.filter(n=>n.parent===node.id);
  const top=node.parent===null;
  return <div key={node.id} className={'r2-tree-branch'+(top?' r2-tree-top':'')}>
   <div className={'r2-node r2-kind-'+node.kind+(focus===node.id?' is-active':'')}>
    <button type="button" className="r2-node-text" aria-pressed={focus===node.id}
      aria-label={'Edit '+KIND_NAMES[node.kind].toLowerCase()+': '+node.text} onClick={()=>open(node.id)}>
      <small>{KIND_NAMES[node.kind]}</small><strong>{node.text}</strong>
    </button>
    {top&&map.bestId===node.id&&<span className="r2-node-badge">★ Best</span>}
    {top&&map.rejectId===node.id&&<span className="r2-node-badge r2-node-reject">Set aside</span>}
    <button type="button" className="r2-node-add" onClick={()=>open(node.id)} aria-label={'Develop '+node.text}>+</button>
   </div>
   {children.length>0&&<div className="r2-child-branches">{children.map(render)}</div>}
  </div>;
 };
 const options:[R2Kind,string][]=focused&&depthOf(focused)<3?
  [['reason','Reason'],['example','Example / detail'],['vocab','Vocabulary'],['idea','Sub-idea']]:[];
 const projection=r2CanonicalProjection(map);
 return <section className="r2-mind" aria-label="Visual R2 mind-map editor">
  <header className="r2-heading">
   <div><span className="r2-kicker">MAIN PRACTICE · R2 UX PROTOTYPE</span><h2>Grow your ideas on the map</h2>
   <p>Tap the task to add an idea. Tap any branch to develop reasons, examples or vocabulary in place. No jumping between a map and a separate long form.</p></div>
   <div className="r2-zoom" role="group" aria-label="Mind map zoom">
    <button type="button" onClick={()=>setZoom(z=>Math.max(80,z-10))} aria-label="Zoom out">−</button>
    <span>{zoom}%</span>
    <button type="button" onClick={()=>setZoom(z=>Math.min(125,z+10))} aria-label="Zoom in">+</button>
   </div>
  </header>
  <div className="r2-workspace">
   <div className="r2-map-viewport" aria-label="Editable mind map">
    <div className="r2-map-content" style={{zoom:zoom/100}}>
     <div className="r2-task-root">
       <button type="button" className="r2-task-node" aria-pressed={focus==='root'} onClick={()=>open('root')}>
        <small>WRITING TASK · TAP TO ADD IDEA</small><strong>{R2_TASK}</strong>
       </button>
       <button type="button" className="r2-root-add" onClick={()=>open('root')}>+ Add idea</button>
     </div>
     <div className="r2-map-connector" aria-hidden="true"/>
     <div className="r2-root-branches">
      {roots.length?roots.map(render):<div className="r2-empty">Start by tapping the writing task above.</div>}
     </div>
    </div>
   </div>
   {editor&&<div className="r2-overlay" onClick={()=>setEditor(false)} aria-hidden="true"/>}
   <aside className={'r2-inspector'+(editor?' is-open':'')} aria-label="Mind map branch editor">
    <header className="r2-inspector-header"><h3>{focus==='root'?'Add a main idea':'Develop this branch'}</h3>
     <button type="button" className="r2-close" aria-label="Close branch editor" onClick={()=>setEditor(false)}>×</button></header>
    {focus==='root'?<div className="r2-inspector-body">
     <p className="r2-muted">Think of a short after-school activity. You can generate several choices before deciding.</p>
     <label htmlFor="r2-new-node">New main idea</label>
     <input ref={editRef} id="r2-new-node" value={newText} onChange={e=>setNewText(e.target.value)}
       placeholder="e.g. Photography club" onKeyDown={e=>{if(e.key==='Enter')add(null,'idea',newText);}}/>
     <button type="button" className="r2-primary" disabled={!newText.trim()} onClick={()=>add(null,'idea',newText)}>+ Add idea</button>
    </div>:focused?<div className="r2-inspector-body">
      <span className="r2-kicker">{KIND_NAMES[focused.kind]} · EDIT</span>
      <label htmlFor="r2-edit-node">Branch text</label>
      <input ref={editRef} id="r2-edit-node" value={text} onChange={e=>setText(e.target.value)}
        onKeyDown={e=>{if(e.key==='Enter')save();}}/>
      <button type="button" className="r2-secondary" disabled={!text.trim()||text.trim()===focused.text} onClick={save}>Apply edit</button>
      {focused.parent===null&&<div className="r2-decision-controls">
       <button type="button" className={map.bestId===focused.id?'r2-primary':'r2-secondary'} onClick={()=>best(focused.id)}>★ Select as best</button>
       <button type="button" className="r2-secondary" onClick={()=>reject(focused.id)}>Set aside / reject</button>
      </div>}
      <div className="r2-separator"/>
      {options.length?<div className="r2-child-editor">
       <h4>Grow this branch</h4>
       <label htmlFor="r2-child-kind">Child type</label>
       <select id="r2-child-kind" value={kind} onChange={e=>setKind(e.target.value as R2Kind)}>
        {options.map(([k,title])=><option key={k} value={k}>{title}</option>)}
       </select>
       <label htmlFor="r2-child-text">Add a short idea, explanation or keyword</label>
       <input id="r2-child-text" value={newText} onChange={e=>setNewText(e.target.value)}
        placeholder="e.g. Learn teamwork" onKeyDown={e=>{if(e.key==='Enter')add(focused.id,kind,newText);}}/>
       <button type="button" className="r2-primary" disabled={!newText.trim()} onClick={()=>add(focused.id,kind,newText)}>+ Add child</button>
      </div>:<p className="r2-muted">This branch is deep enough. Select a higher-level branch to add more details.</p>}
      <button type="button" className="r2-danger" onClick={()=>remove(focused.id)}>Delete branch and children</button>
     </div>:<p className="r2-muted">Node no longer exists. Select another one.</p>}
     <p className="r2-muted r2-inspector-note">No cloud saving, grades, learner records or automatic AI evaluation.</p>
   </aside>
   {!editor&&<button type="button" className="r2-open-inspector" onClick={()=>open(focus)}>✎ Edit selected</button>}
  </div>
  <p className="r2-status" role="status" aria-live="polite">{status}</p>
  <div className="r2-projection">
   <button type="button" onClick={()=>setShowProjection(x=>!x)} aria-expanded={showProjection}>
     {showProjection?'Hide':'View'} the original four-field projection (not saved)
   </button>
   {showProjection&&<div className="r2-projection-detail">
    <p>Top-level ideas can map to existing fields. Nested branches and vocabulary are <strong>not persisted</strong> by this prototype; a separate approved schema is needed before integration.</p>
    {([['ideas','Idea bank'],['reject','Rejected idea'],['best','Best idea'],['fit','One reason']] as const).map(([key,title])=>
      <div key={key}><strong>{title} — {key}</strong><pre>{projection[key]||'—'}</pre></div>)}
   </div>}
  </div>
 </section>;
}