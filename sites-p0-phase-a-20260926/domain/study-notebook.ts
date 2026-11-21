/**
 * Study Notebook v1 — unscored learner-owned review/notes metadata only.
 * This independent document never modifies course packages, learner evidence,
 * scored answers, old notes placeholders, or historical Save/Resume records.
 */
export const STUDY_NOTEBOOK_FORMAT='g-learning-english.study-notebook' as const;
export const STUDY_NOTEBOOK_SCHEMA=1 as const;
export const MAX_STUDY_NOTES=100;
export const MAX_STUDY_CARDS=400;
export const MAX_NOTE_LENGTH=1500;

export type ReviewChoice='again'|'practised';
export type SavedReviewCard={
 referenceId:string;reviews:number;againCount:number;
 lastChoice:ReviewChoice|null;lastReviewedAt:string|null;
};
export type StudyNote={id:string;referenceId:string|null;text:string;updatedAt:string};
export type StudyNotebookData={
 format:typeof STUDY_NOTEBOOK_FORMAT;schemaVersion:typeof STUDY_NOTEBOOK_SCHEMA;
 revision:number;cards:SavedReviewCard[];notes:StudyNote[];
};

export function emptyStudyNotebook():StudyNotebookData{
 return {format:STUDY_NOTEBOOK_FORMAT,schemaVersion:1,revision:0,cards:[],notes:[]};
}

export function isReferenceId(value:unknown):value is string{
 return typeof value==='string'&&/^REF(?:2|3|4)?-[A-Z]{2,4}-\d{2,3}$/.test(value);
}
const isStamp=(x:unknown):x is string=>
 typeof x==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(x)
 &&Number.isFinite(Date.parse(x));
const isObject=(x:unknown):x is Record<string,unknown>=>
 !!x&&typeof x==='object'&&!Array.isArray(x);
const count=(x:unknown,max:number):x is number=>
 Number.isSafeInteger(x)&&Number(x)>=0&&Number(x)<=max;

/** Entire document validated before any state can be replaced. */
export function isStudyNotebook(value:unknown):value is StudyNotebookData{
 if(!isObject(value)||value.format!==STUDY_NOTEBOOK_FORMAT||
  value.schemaVersion!==STUDY_NOTEBOOK_SCHEMA||!count(value.revision,1_000_000_000)||
  !Array.isArray(value.cards)||!Array.isArray(value.notes)||
  value.cards.length>MAX_STUDY_CARDS||value.notes.length>MAX_STUDY_NOTES)return false;
 const cardIds=new Set<string>();
 for(const c of value.cards){
  if(!isObject(c)||!isReferenceId(c.referenceId)||cardIds.has(c.referenceId)||
   !count(c.reviews,100_000)||!count(c.againCount,100_000)||c.againCount>c.reviews||
   !(c.lastChoice===null||c.lastChoice==='again'||c.lastChoice==='practised')||
   !(c.lastReviewedAt===null||isStamp(c.lastReviewedAt))||
   ((c.reviews===0)!==(c.lastChoice===null&&c.lastReviewedAt===null)))return false;
  cardIds.add(c.referenceId);
 }
 const noteIds=new Set<string>();
 for(const n of value.notes){
  if(!isObject(n)||typeof n.id!=='string'||!/^[-\w]{8,80}$/.test(n.id)||
   noteIds.has(n.id)||!(n.referenceId===null||isReferenceId(n.referenceId))||
   typeof n.text!=='string'||!n.text.trim()||n.text.length>MAX_NOTE_LENGTH||
   !isStamp(n.updatedAt))return false;
  noteIds.add(n.id);
 }
 return true;
}

export function saveReviewedReference(
 data:StudyNotebookData,id:string,approvedIds:ReadonlySet<string>
):StudyNotebookData{
 if(!isReferenceId(id)||!approvedIds.has(id))
  throw Error('Only an existing, reviewed Reference Library entry can be saved.');
 if(data.cards.some(x=>x.referenceId===id))return data;
 if(data.cards.length>=MAX_STUDY_CARDS)throw Error('Your Study Notebook has reached its 400-card limit.');
 return {...data,revision:data.revision+1,
  cards:[...data.cards,{referenceId:id,reviews:0,againCount:0,lastChoice:null,lastReviewedAt:null}]};
}

export function removeReviewCard(data:StudyNotebookData,id:string):StudyNotebookData{
 if(!data.cards.some(x=>x.referenceId===id))return data;
 // Learner-authored linked Notes are preserved when a review card is removed.
 return {...data,revision:data.revision+1,cards:data.cards.filter(x=>x.referenceId!==id)};
}

export function markReview(
 data:StudyNotebookData,id:string,choice:ReviewChoice,when:string
):StudyNotebookData{
 if(choice!=='again'&&choice!=='practised')throw Error('Unknown review choice.');
 if(!isStamp(when))throw Error('Invalid review timestamp.');
 if(!data.cards.some(x=>x.referenceId===id))throw Error('This card has not been saved.');
 return {...data,revision:data.revision+1,cards:data.cards.map(card=>
  card.referenceId===id?{...card,reviews:card.reviews+1,
   againCount:card.againCount+(choice==='again'?1:0),
   lastChoice:choice,lastReviewedAt:when}:card)};
}

export function upsertStudyNote(
 data:StudyNotebookData,input:{id:string;text:string;referenceId:string|null},
 when:string,approvedIds:ReadonlySet<string>
):StudyNotebookData{
 if(!/^[-\w]{8,80}$/.test(input.id))throw Error('Invalid note ID.');
 if(!isStamp(when))throw Error('Invalid timestamp.');
 if(!input.text.trim()||input.text.length>MAX_NOTE_LENGTH)
  throw Error('Write between 1 and 1,500 characters for your own note.');
 if(input.referenceId!==null&&(!isReferenceId(input.referenceId)||!approvedIds.has(input.referenceId)))
  throw Error('This linked reference is unavailable in the reviewed Library.');
 const item={id:input.id,text:input.text,referenceId:input.referenceId,updatedAt:when};
 const exists=data.notes.some(n=>n.id===input.id);
 if(!exists&&data.notes.length>=MAX_STUDY_NOTES)
  throw Error('Your Study Notebook has reached its 100-note limit.');
 return {...data,revision:data.revision+1,
  notes:exists?data.notes.map(n=>n.id===input.id?item:n):[item,...data.notes]};
}

export function deleteStudyNote(data:StudyNotebookData,id:string):StudyNotebookData{
 if(!data.notes.some(n=>n.id===id))return data;
 return {...data,revision:data.revision+1,notes:data.notes.filter(n=>n.id!==id)};
}
