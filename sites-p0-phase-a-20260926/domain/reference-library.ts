/** Static SLE Reference Library selectors only.
 * No scoring, learner data writes, AI calls, or runtime network requests.
 * The 26 reference entries were independently reviewed: NotebookLM academic PASS.
 * Additional search keywords are optional frontend-only discovery metadata.
 */
export const REFERENCE_KINDS=[
 {id:'irregular_verbs',label:'Irregular verbs'},
 {id:'collocations',label:'Collocations'},
 {id:'phrasal_verbs',label:'Phrasal verbs'},
 {id:'idioms',label:'Idioms'},
 {id:'common_mistakes',label:'Common mistakes'},
 {id:'learning_tips',label:'Learning tips'},
] as const;
export const REFERENCE_V2_KINDS=[
 {id:'writing_connectors',label:'Writing connectors'},
 {id:'frequency_expressions',label:'Frequency expressions'},
 {id:'grammar_comparisons',label:'Grammar comparisons'},
 {id:'writing_toolkit',label:'Writing toolkit'},
 {id:'word_families',label:'Word families'},
 {id:'confusable_words',label:'Confusable words'},
 {id:'reading_strategies',label:'Reading strategies'},
 {id:'listening_strategies',label:'Listening strategies'},
] as const;
export type ReferenceKind=typeof REFERENCE_KINDS[number]['id']|typeof REFERENCE_V2_KINDS[number]['id'];
export type ReferenceLevel='A1'|'A2'|'B1'|'B2'|'C1'|'C2'|'not_tagged';
export type ReferenceRegister='neutral'|'informal'|'formal'|'neutral to formal'|'not_tagged';
export type ReferenceSkill='grammar'|'vocabulary'|'reading'|'writing'|'listening';
export type ReferenceEntry={
 id:string;kind:ReferenceKind;level:ReferenceLevel;register:ReferenceRegister;
 term:string;meaning:string;example:string;note:string;skill:ReferenceSkill;
 forms?:{base:string;past:string;participle:string};
 search_keywords?:string[];
 // Reviewed v2 specialist fields; legacy 26 references do not require them.
 pattern_group?:string;common_error?:string;
 verb_priority?:'core'|'extended';
 function?:string;grammatical_type?:string;construction?:string;
 frequency_type?:'indefinite_frequency'|'definite_frequency';
 qualitative_band?:string;position_rule?:string;
 // Reviewed Wave 2 reference-only specialist content; suggested levels may
 // be ranges (A1–A2 / B1–B2), not proficiency labels or learner scores.
 suggested_level?:string;
 concept?:string;use_decision?:string;patterns?:string;contrast?:string;watch_out?:string;
 process_step?:string;purpose?:string;steps?:string;
 worked_micro_example?:string;self_check?:string;avoid?:string;
 keywords?:string[];
 // Reviewed Wave 3 educational reference fields: keep text source-authored.
 register_or_mode?:string;meaning_or_strategy?:string;
 pattern_or_procedure?:string;independent_illustration?:string;
 contrast_or_reasoning?:string;watch_out_or_limits?:string;
 learner_self_check?:string;search_hints?:string[];
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
  if(filter.level!=='all'&&e.level!==filter.level){
   const order=['A1','A2','B1','B2','C1','C2'];
   const range=e.suggested_level?.split('–').map(x=>x.trim())??[];
   const index=order.indexOf(filter.level);
   const low=order.indexOf(range[0]),high=order.indexOf(range[1]??range[0]);
   if(low<0||high<low||index<low||index>high)return false;
  }
  if(filter.register!=='all'&&e.register!==filter.register&&
   !(e.register==='neutral to formal'&&(filter.register==='neutral'||filter.register==='formal')))return false;
  const text=[e.term,e.meaning,e.example,e.note,e.forms?.base,
   e.forms?.past,e.forms?.participle,e.pattern_group,e.common_error,
   e.function,e.grammatical_type,e.construction,e.frequency_type,
   e.qualitative_band,e.position_rule,e.verb_priority,e.suggested_level,
   e.concept,e.use_decision,e.patterns,e.contrast,e.watch_out,
   e.process_step,e.purpose,e.steps,e.worked_micro_example,
   e.self_check,e.avoid,e.register_or_mode,e.meaning_or_strategy,
   e.pattern_or_procedure,e.independent_illustration,e.contrast_or_reasoning,
   e.watch_out_or_limits,e.learner_self_check,...(e.search_keywords??[]),
   ...(e.keywords??[]),...(e.search_hints??[])].filter(Boolean)
   .join(' ').normalize('NFKC').toLocaleLowerCase('en');
  return words.every(w=>text.includes(w));
 }).sort((a,b)=>{
  if(!words.length)return 0; // retain original order when browsing the table
  const query=filter.query.normalize('NFKC').toLocaleLowerCase('en').trim();
  const rank=(e:ReferenceEntry)=>{
   const forms=[e.term,e.forms?.base,...(e.forms?.past?.split(' / ')??[]),
    ...(e.forms?.participle?.split(' / ')??[])].filter(Boolean)
    .map(x=>x!.toLocaleLowerCase('en').trim());
   if(forms.includes(query))return 0;
   if(forms.some(x=>x.startsWith(query)))return 1;
   return 2;
  };
  return rank(a)-rank(b);
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
