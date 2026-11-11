/** Static SLE Reference Library selectors only.
 * No scoring, learner data writes, AI calls, or runtime network requests.
 * Source content still requires independent NotebookLM academic review.
 */
export const REFERENCE_KINDS=[
 {id:'irregular_verbs',label:'Irregular verbs'},
 {id:'collocations',label:'Collocations'},
 {id:'phrasal_verbs',label:'Phrasal verbs'},
 {id:'idioms',label:'Idioms'},
 {id:'common_mistakes',label:'Common mistakes'},
 {id:'learning_tips',label:'Learning tips'},
] as const;
export type ReferenceKind=typeof REFERENCE_KINDS[number]['id'];
export type ReferenceLevel='A1'|'A2'|'B1'|'B2'|'C1'|'C2';
export type ReferenceRegister='neutral'|'informal'|'formal';
export type ReferenceSkill='grammar'|'vocabulary'|'reading'|'writing';
export type ReferenceEntry={
 id:string;kind:ReferenceKind;level:ReferenceLevel;register:ReferenceRegister;
 term:string;meaning:string;example:string;note:string;skill:ReferenceSkill;
 forms?:{base:string;past:string;participle:string};
};
export type ReferenceFilters={
 query:string;kind:'all'|ReferenceKind;level:'all'|ReferenceLevel;
 register:'all'|ReferenceRegister;
};
export type RelatedCatalogLesson={id:string;title:string;module:string;cefr:string};
/** Case-insensitive AND search across plain authored reference text. */
export function filterReferenceEntries(
 entries:readonly ReferenceEntry[],filter:ReferenceFilters
):ReferenceEntry[]{
 const words=filter.query.normalize('NFKC').toLocaleLowerCase('en').trim().split(/\s+/).filter(Boolean);
 return entries.filter(e=>{
  if(filter.kind!=='all'&&e.kind!==filter.kind)return false;
  if(filter.level!=='all'&&e.level!==filter.level)return false;
  if(filter.register!=='all'&&e.register!==filter.register)return false;
  const text=[e.term,e.meaning,e.example,e.note,e.forms?.base,
   e.forms?.past,e.forms?.participle].filter(Boolean)
   .join(' ').normalize('NFKC').toLocaleLowerCase('en');
  return words.every(w=>text.includes(w));
 });
}
/** Every link MUST be grounded in actual current imported catalog entries.
 * This means RELATED SKILL, not proof that the lesson teaches this exact phrase.
 */
export function availableRelatedLessons(
 item:ReferenceEntry,lessons:readonly RelatedCatalogLesson[],limit=2
):RelatedCatalogLesson[]{
 return lessons.filter(x=>x.module===item.skill&&!!x.id&&!!x.title)
  .slice().sort((a,b)=>a.id.localeCompare(b.id)).slice(0,Math.max(0,limit));
}
