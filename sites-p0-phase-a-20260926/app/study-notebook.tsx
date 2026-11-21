'use client';
import {useEffect,useMemo,useState} from 'react';
import {REFERENCE_ENTRIES} from './reference-library';
import {
 type StudyNotebookData,type StudyNote,type ReviewChoice,
 upsertStudyNote,deleteStudyNote,markReview,removeReviewCard
} from '../domain/study-notebook';
import {
 loadStudyNotebook,persistStudyNotebook,exportStudyNotebookJSON
} from '../infrastructure/browser/study-notebook-storage';

const approvedIds=new Set(REFERENCE_ENTRIES.map(e=>e.id));
const referenceById=new Map(REFERENCE_ENTRIES.map(e=>[e.id,e]));
const friendly=(err:unknown)=>err instanceof Error?err.message:'Study Notebook action failed; no changes saved.';
const now=()=>new Date().toISOString();
type Section='cards'|'notes';

export function StudyNotebook({onOpenReference}:{onOpenReference?:(search:string)=>void}){
 const [data,setData]=useState<StudyNotebookData|null>(null);
 const [error,setError]=useState('');
 const [message,setMessage]=useState('');
 const [section,setSection]=useState<Section>('cards');
 const [selectedId,setSelectedId]=useState('');
 const [showBack,setShowBack]=useState(false);
 const [noteText,setNoteText]=useState('');
 const [noteLink,setNoteLink]=useState('');
 const [editingId,setEditingId]=useState<string|null>(null);
 const [exportError,setExportError]=useState('');
 useEffect(()=>{
  try{setData(loadStudyNotebook(window.localStorage));setError('')}
  catch(err){setData(null);setError(friendly(err))}
 },[]);
 const currentCard=data?.cards.find(c=>c.referenceId===selectedId)??data?.cards[0];
 const currentRef=currentCard?referenceById.get(currentCard.referenceId):undefined;
 const cards=data?.cards??[];
 const notes=data?.notes??[];
 const counts=useMemo(()=>({reviewed:cards.filter(x=>x.reviews>0).length,again:cards.filter(x=>x.lastChoice==='again').length}),[cards]);
 const apply=(change:(current:StudyNotebookData)=>StudyNotebookData,done:string)=>{
  if(!data){setError('Study Notebook has not been loaded; no changes saved.');return false}
  try{
   const old=loadStudyNotebook(window.localStorage);
   if(old.revision!==data.revision)throw Error('Study Notebook changed in another tab. Reload before editing.');
   const next=change(old);
   if(next===old){setMessage('Nothing to change.');setError('');return true}
   const saved=persistStudyNotebook(window.localStorage,next);
   setData(saved);setMessage(done);setError('');return true;
  }catch(err){setError(friendly(err));setMessage('');return false}
 };
 const review=(choice:ReviewChoice)=>{
  if(!currentCard)return;
  const i=cards.findIndex(c=>c.referenceId===currentCard.referenceId);
  if(apply(d=>markReview(d,currentCard.referenceId,choice,now()),
     choice==='again'?'Marked Again — review record saved locally.':'Marked Practised — this is not a test score.')){
   setShowBack(false);
   if(cards.length>1)setSelectedId(cards[(i+1)%cards.length].referenceId);
  }
 };
 const edit=(item:StudyNote)=>{
  setEditingId(item.id);setNoteText(item.text);setNoteLink(item.referenceId??'');setSection('notes');setError('');
 };
 const clearEdit=()=>{setEditingId(null);setNoteText('');setNoteLink('')};
 const saveNote=()=>{
  const id=editingId??crypto.randomUUID();
  if(apply(d=>upsertStudyNote(d,{id,text:noteText,referenceId:noteLink||null},now(),approvedIds),
    editingId?'Note changes saved on this browser.':'Note saved on this browser.'))clearEdit();
 };
 const exportData=()=>{
  setExportError('');
  try{
   const content=exportStudyNotebookJSON(window.localStorage);
   const file=new Blob([content],{type:'application/json'});
   const object=URL.createObjectURL(file);
   const link=document.createElement('a');
   link.href=object;link.download='g-learning-english-study-notebook-v1.json';
   document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(object);
   setMessage('Study Notebook backup downloaded. Keep the file safe; importing is not available yet.');
  }catch(err){setExportError(friendly(err))}
 };
 return <div className="study-notebook" aria-label="Study Notebook">
  <div className="eyebrow">YOUR LEARNING TOOLS</div>
  <div className="page-heading"><div><h1>Study Notebook</h1>
   <p>Save reviewed references, write your own notes, and practise recall with unscored flashcards.</p>
  </div></div>
  <section className="panel study-notebook-info">
   <strong>Stored only on this browser</strong>
   <p>Notes and review choices are not synced between your iPad and desktop, are not included in the usual learner backup,
    and are not proficiency scores. Export a separate JSON copy. Import/restore is not yet supported. Do not clear browser data.</p>
  </section>
  {error&&<p className="notice" role="alert">{error}</p>}
  {message&&<p role="status" className="study-notebook-saved">{message}</p>}
  <div className="study-notebook-tabs" role="group" aria-label="Study Notebook sections">
   <button type="button" aria-pressed={section==='cards'} onClick={()=>setSection('cards')}>Flashcards ({cards.length})</button>
   <button type="button" aria-pressed={section==='notes'} onClick={()=>setSection('notes')}>My Notes ({notes.length})</button>
   <button type="button" onClick={exportData} disabled={!data}>Export my Study Notebook</button>
  </div>
  {exportError&&<p className="notice" role="alert">{exportError}</p>}
  {section==='cards'&&<section className="panel" aria-label="Unscored flashcard review">
   <h2>Review saved references</h2>
   <p className="muted">{cards.length} saved · {counts.reviewed} practised at least once · {counts.again} most recently marked Again.
    These are personal review markers, not assessed proficiency or a scheduled spaced-repetition algorithm.</p>
   {!cards.length&&<p>There are no flashcards yet. Open <strong>Reference Library</strong> and choose “Save to review” on a reference.</p>}
   {cards.length>0&&<>
    <label>Choose a saved reference
     <select aria-label="Choose flashcard" value={currentCard?.referenceId??''}
      onChange={e=>{setSelectedId(e.target.value);setShowBack(false)}}>
      {cards.map(c=><option key={c.referenceId} value={c.referenceId}>
       {referenceById.get(c.referenceId)?.term??c.referenceId}</option>)}
     </select>
    </label>
    {currentCard&&<div className="study-flashcard" aria-label="Selected flashcard">
     <span className="eyebrow">{currentRef?.kind.replaceAll('_',' ')??'Previously saved reference'}</span>
     <h3>{currentRef?.term??currentCard.referenceId}</h3>
     {!showBack?<button type="button" onClick={()=>setShowBack(true)}>Reveal explanation</button>:
      <div className="study-flashcard-back">
       <p><strong>Meaning / strategy:</strong> {currentRef?.meaning??'This reference is unavailable in this library version.'}</p>
       <p><strong>Reviewed example:</strong> {currentRef?.example??'No example available.'}</p>
       <p><strong>Watch out:</strong> {currentRef?.note??'Review the source when available.'}</p>
       <div className="study-notebook-actions">
        <button type="button" onClick={()=>review('again')}>Again</button>
        <button type="button" onClick={()=>review('practised')}>Practised</button>
       </div>
      </div>}
     <div className="study-notebook-actions">
      {currentRef&&onOpenReference&&<button type="button" className="secondary-button"
       onClick={()=>onOpenReference(currentRef.term)}>View in Reference Library</button>}
      <button type="button" className="secondary-button"
       onClick={()=>{setNoteLink(currentRef?.id??'');setEditingId(null);setNoteText('');setSection('notes')}}>Write a note</button>
      <button type="button" className="secondary-button" onClick={()=>{
       if(window.confirm('Remove this flashcard? Linked notes will be kept.')){
        if(apply(d=>removeReviewCard(d,currentCard.referenceId),'Flashcard removed; linked notes retained.'))setShowBack(false);
       }
      }}>Remove from review</button>
     </div>
     <small>Reviewed here: {currentCard.reviews} time(s). This counter is not a lesson score.</small>
    </div>}
   </>}
  </section>}
  {section==='notes'&&<section className="panel" aria-label="Learner-created study notes">
   <h2>{editingId?'Edit your note':'Write your own note'}</h2>
   <p className="muted">Write what you understood, an original example, or a question to revisit. Your text is not automatically graded or sent to AI.</p>
   <label>Link to a reference (optional)
    <select aria-label="Note linked reference" value={noteLink} onChange={e=>setNoteLink(e.target.value)}>
     <option value="">General note (not linked)</option>
     {noteLink&&!cards.some(c=>c.referenceId===noteLink)&&<option value={noteLink}>
      {referenceById.get(noteLink)?.term??noteLink} · preserved linked note (flashcard removed)
     </option>}
     {cards.map(c=><option key={c.referenceId} value={c.referenceId}>
      {referenceById.get(c.referenceId)?.term??c.referenceId}</option>)}
    </select>
   </label>
   <label>Your note ({noteText.length}/1500 characters)
    <textarea aria-label="Your study note" rows={4} maxLength={1500}
     value={noteText} onChange={e=>setNoteText(e.target.value)}
     placeholder="Explain the idea in your own words…"/>
   </label>
   <div className="study-notebook-actions">
    <button type="button" disabled={!data||!noteText.trim()} onClick={saveNote}>
     {editingId?'Save changes':'Save note'}
    </button>
    <button type="button" className="secondary-button" onClick={clearEdit}>Clear editor</button>
   </div>
   <h3>My saved notes ({notes.length})</h3>
   {!notes.length&&<p>No notes saved yet.</p>}
   <div className="study-notebook-note-list">
    {notes.map(n=><article key={n.id} className="study-note">
     <strong>{n.referenceId?referenceById.get(n.referenceId)?.term??n.referenceId:'General note'}</strong>
     <p className="study-note-body">{n.text}</p>
     <small>Saved {n.updatedAt.slice(0,10)} · Device-local</small>
     <div className="study-notebook-actions">
      <button type="button" className="secondary-button" onClick={()=>edit(n)}>Edit</button>
      <button type="button" className="secondary-button" onClick={()=>{
       if(window.confirm('Permanently delete this note from this browser?')){
        if(apply(d=>deleteStudyNote(d,n.id),'Note deleted locally.'))if(editingId===n.id)clearEdit();
       }
      }}>Delete</button>
     </div>
    </article>)}
   </div>
  </section>}
 </div>;
}
