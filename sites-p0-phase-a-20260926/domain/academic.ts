import seed from '../content/academic-seed-v1.json';
import type {ContentBundle,CEFRTarget} from './content-model';
import type {Evidence,Skill} from './learning-model';
export type SeedActivity={id:string;type:string;prompt:string;options?:{id:string;text:string}[];answer:{correct_option_id?:string;accepted_answers?:string[];normalization?:string[]}|null;feedback:{explanation_en?:string;pending_message?:string};skill_tags:string[];evidence_weight:number;rubric_id?:string;word_range_guidance?:{min:number;max:number;not_a_quality_score:boolean}};
export type SeedLesson=Omit<(typeof seed)['lessons'][number],'activities'>&{activities:SeedActivity[]};
export type Seed=Omit<typeof seed,'lessons'>&{lessons:SeedLesson[]};
export type AcademicPackage={id:string;version:string;digest:string;source:Seed;bundle:ContentBundle;at:number};
export type AcademicAttempt={id:string;packageId:string;version:string;lessonId:string;parentId?:string;rootId:string;status:'started'|'scored'|'pending_review'|'approved'|'unassessed';answers:Record<string,string>;audio?:{type:string;data:string};createdAt:number;submittedAt?:number;playStartedAt?:number;playToken?:string;playbackCompleted?:boolean;results?:{id:string;correct:boolean|null;explanation:string;answer?:string;tags:string[]}[];evidence:Evidence[];review?:{feedback:string;scores:Record<string,number>;reviewedAt:number;source:'adult-review'}};
export interface AcademicRepository{
 packages():Promise<AcademicPackage[]>; addPackage(value:AcademicPackage):Promise<void>;
 attempts(owner:string):Promise<AcademicAttempt[]>; start(owner:string,value:AcademicAttempt):Promise<void>;
 saveDraft(owner:string,id:string,patch:Partial<AcademicAttempt>):Promise<void>;
 finish(owner:string,value:AcademicAttempt):Promise<AcademicAttempt>;
 approve(owner:string,value:AcademicAttempt):Promise<AcademicAttempt>;
}
export class AcademicError extends Error{constructor(message:string,public status=400){super(message)}}
export const tagMap:Record<string,string>={
 'grammar.be_forms':'be-forms','grammar.pronouns':'pronouns','grammar.possessives':'possessives','grammar.articles':'articles','grammar.plural_nouns':'plural-nouns','grammar.there_is_are':'there-is-are','grammar.prepositions_place':'place-prepositions',
 'grammar.modals_can':'modals-can','grammar.countability':'countability','grammar.quantifiers':'quantifiers','grammar.comparison':'comparison',
 'grammar.question_formation':'question-formation','grammar.future_plans':'future-plans','grammar.modals_obligation':'modals-obligation',
 'grammar.demonstratives':'demonstratives','grammar.object_pronouns':'object-pronouns','grammar.possessive_pronouns':'possessive-pronouns','grammar.imperatives':'imperatives','grammar.instructions':'instructions','grammar.prepositions_time':'time-prepositions',
 'grammar.past_continuous':'past-continuous','grammar.will_future':'will-future','grammar.should_advice':'should-advice','grammar.modal_possibility':'modal-possibility','grammar.conditionals':'conditionals','grammar.verb_patterns':'verb-patterns','grammar.relative_clauses':'relative-clauses',
 'grammar.present_simple':'tense-and-aspect','grammar.present_continuous':'tense-and-aspect','grammar.subject_verb_agreement':'subject-verb-agreement','grammar.stative_verbs':'tense-and-aspect','grammar.past_simple':'tense-and-aspect','grammar.present_perfect':'tense-and-aspect',
 'vocabulary.collocations':'collocation','vocabulary.meaning_in_context':'meaning-in-context','vocabulary.word_formation':'word-formation',
 'reading.gist':'gist','reading.detail':'detail','reading.inference':'inference','reading.author_purpose':'inference','reading.vocabulary_in_context':'vocabulary-in-context',
 'listening.gist':'gist','listening.detail':'detail','listening.inference':'speaker-intention','listening.speaker_intention':'speaker-intention',
 'writing.task_understanding':'task-understanding','writing.register':'vocabulary','writing.organization':'organization','writing.grammar':'grammar-accuracy','writing.vocabulary':'vocabulary','writing.idea_development':'idea-development','writing.cohesion':'organization',
 'speaking.organization':'task-response','speaking.task_response':'task-response','speaking.fluency':'fluency','speaking.intelligibility':'pronunciation-intelligibility','speaking.idea_development':'task-response','speaking.vocabulary':'vocabulary',
 'pronunciation.sound_awareness':'sound-awareness','pronunciation.intelligibility':'intelligibility'
};
export const skillFor=(module:string)=>module[0].toUpperCase()+module.slice(1) as Skill;
const nonempty=(s:unknown,max=12000)=>typeof s==='string'&&s.trim().length>0&&s.length<=max;
const strings=(a:unknown)=>Array.isArray(a)&&a.length<=100&&a.every(x=>nonempty(x));
const MAX_CURRICULUM_LESSONS=60;
const moduleForPrefix:Record<string,string>={GRA:'grammar',VOC:'vocabulary',REA:'reading',LIS:'listening',WRI:'writing',SPE:'speaking',PRO:'pronunciation'};
export function validateSeed(raw:unknown):string[]{try{return validateShape(raw)}catch{return ['Malformed nested content fields. No changes made.']}}
function validateShape(raw:unknown):string[]{
 const errors:string[]=[];
 const shape=(value:any,samples:any[],path='source')=>{
  const matching=samples.filter(x=>Array.isArray(value)?Array.isArray(x):value===null?x===null:typeof x===typeof value&&x!==null&&!Array.isArray(x));
  if(!matching.length){errors.push(`${path}: unexpected value type.`);return}
  if(Array.isArray(value)){const items=matching.flat();for(const item of value)if(items.length)shape(item,items,path+'[]');else if(typeof item!=='string')errors.push(`${path}: unexpected array item.`)}
  else if(value&&typeof value==='object'){for(const [key,child] of Object.entries(value)){const explicit=matching.filter(x=>Object.hasOwn(x,key)).map(x=>x[key]);const candidates=explicit.length?explicit:path==='source.rubrics'&&/^RUBRIC-(WRITING|SPEAKING|PRONUNCIATION)-[A-Z0-9]+$/.test(key)?Object.values(seed.rubrics):[];if(!candidates.length)errors.push(`${path}.${key}: unknown field; content-only import.`);else shape(child,candidates,path+'.'+key)}}
 };
 shape(raw,[seed]);const s=raw as Seed;if(!s||typeof s!=='object'||Array.isArray(s))return ['Expected a JSON object.'];
 const rootKeys=new Set(Object.keys(seed));for(const k of Object.keys(s))if(!rootKeys.has(k))errors.push(`Unknown top-level field: ${k}. Learner state is never imported.`);
 if(s.package_id!==seed.package_id)errors.push('This bounded importer accepts only the Foundation seed package ID.');
 if(!/^\d+\.\d+\.\d+$/.test(s.schema_version??''))errors.push('Use a numeric major.minor.patch content version.');
 if(s.language!=='en')errors.push('Default learning content must be English.');
 if(s.course?.id!==seed.course.id||!strings(s.course?.sequence)||s.course.sequence.length!==(s.lessons?.length??0))errors.push('Course sequence must list each imported lesson once.');
 if(!Array.isArray(s.lessons)||s.lessons.length<seed.lessons.length||s.lessons.length>MAX_CURRICULUM_LESSONS)return [...errors,`Expected between ${seed.lessons.length} and ${MAX_CURRICULUM_LESSONS} lessons.`];
 const ids=new Set<string>(),activityIds=new Set<string>();
 for(const l of s.lessons){
  if(!l||typeof l.id!=='string'||!/^(GRA|VOC|REA|LIS|WRI|SPE|PRO)-(A1|A2|B1|B2)-\d{2}$/.test(l.id)||moduleForPrefix[l.id.slice(0,3)]!==l.module||ids.has(l.id)){errors.push('Invalid/duplicate lesson ID or mismatched domain.');continue}ids.add(l.id);
  if(!['A1','A2','B1','B2'].includes(l.cefr_target)||!nonempty(l.title,180)||!strings(l.objectives)||!nonempty(l.explanation?.en)||!Array.isArray(l.examples)||!l.examples.every(x=>nonempty(x)))errors.push(`${l.id}: invalid lesson metadata.`);
  if(!Array.isArray(l.activities)||!l.activities.length||l.activities.length>24){errors.push(`${l.id}: invalid activities.`);continue}
  for(const q of l.activities){
   if(!q||!nonempty(q.id,100)||!q.id.startsWith(l.id+'-')||activityIds.has(q.id)){errors.push(`${l.id}: invalid/duplicate activity ID.`);continue}activityIds.add(q.id);
   if(!nonempty(q.prompt)||!strings(q.skill_tags)||!q.skill_tags.length||q.skill_tags.some(t=>!tagMap[t]||!t.startsWith(l.module+'.')))errors.push(`${q.id}: invalid prompt/tags.`);
   if(!['single_choice','short_answer','extended_response'].includes(q.type))errors.push(`${q.id}: unsupported activity type.`);
   if(q.type==='single_choice'&&(!Array.isArray(q.options)||q.options.length<2||q.options.length>6||new Set(q.options.map(o=>o.id)).size!==q.options.length||q.options.some(o=>!nonempty(o.id,12)||!nonempty(o.text,1000))||!q.options.some(o=>o.id===q.answer?.correct_option_id)))errors.push(`${q.id}: invalid options/answer.`);
   if(q.type==='short_answer'&&(!strings(q.answer?.accepted_answers)||!q.answer?.accepted_answers?.length||q.answer?.normalization?.some(n=>!['trim','casefold','collapse_spaces','strip_terminal_punctuation'].includes(n))))errors.push(`${q.id}: invalid accepted answers/normalization.`);
   if(q.type!=='extended_response'&&(!nonempty(q.feedback?.explanation_en)||q.evidence_weight!==1))errors.push(`${q.id}: objective explanation/weight required.`);
   if(q.type==='extended_response'&&(q.answer!==null||q.evidence_weight!==0||!q.rubric_id||!s.rubrics?.[q.rubric_id as keyof Seed['rubrics']]))errors.push(`${q.id}: review rubric required; no automatic score.`);
  }
  if(l.module==='reading'&&!nonempty(l.reading_asset?.body))errors.push(`${l.id}: passage missing.`);
  if(l.module==='listening'&&(!nonempty(l.audio_asset?.source_text)||l.audio_asset?.transcript_reveal!=='after_submission'||!l.audio_asset?.requires_real_playback))errors.push(`${l.id}: playback/transcript rules required.`);
 }
 if(seed.lessons.some(original=>!s.lessons.some(l=>l.id===original.id&&l.module===original.module)))errors.push('The base 13 lessons must remain available in this cumulative release.');
 if(new Set(s.lessons.map(l=>l.module)).size!==7)errors.push('Expected seven domains.');
 if(s.course?.sequence?.some(id=>!ids.has(id))||new Set(s.course?.sequence).size!==ids.size)errors.push('Invalid course sequence.');
 if(!nonempty(s.integrated_journey?.id,100)||!strings(s.integrated_journey?.steps)||s.integrated_journey.steps.length!==7||new Set(s.integrated_journey.steps).size!==7||s.integrated_journey.steps.some(id=>!ids.has(id)))errors.push('Expected one seven-step demo path.');
 for(const [id,r] of Object.entries(s.rubrics??{}))if(!strings(r.criteria)||r.scale?.min!==0||r.scale?.max!==4||!nonempty(r.guidance))errors.push(`Invalid rubric ${id}.`);
 // Reject any nested state/account payload rather than treating it as course metadata.
 const walk=(v:unknown)=>{if(v&&typeof v==='object')for(const [k,x] of Object.entries(v)){if(/^(learner|student_state_data|accounts?|attempts?|evidence|assessment|email|user_id|owner_id|profile|progress|api_key|secret|password)$/i.test(k))errors.push(`Forbidden learner/secret field: ${k}`);walk(x)}};walk(s);
 return [...new Set(errors)];
}
export function mapSeed(s:Seed):ContentBundle{
 const objectives=s.lessons.flatMap(l=>l.objectives.map((description,i)=>({id:`${l.id}-objective-${i+1}`,description,cefrTarget:l.cefr_target as CEFRTarget,subskillTags:[...new Set(l.activities.flatMap(a=>a.skill_tags.map(t=>tagMap[t])))],prerequisiteSkills:[]})));
 return {format:'ai-english-tutor.content',schemaVersion:1,courses:[{id:s.course.id,version:s.schema_version,title:s.course.title,unitIds:s.lessons.map(l=>l.id+'-unit'),cefrTargets:[...new Set(s.lessons.map(l=>l.cefr_target as CEFRTarget))],subskillTags:[...new Set(Object.values(tagMap))]}],units:s.lessons.map(l=>({id:l.id+'-unit',title:l.title,lessonIds:[l.id],prerequisiteSkills:[]})),lessons:s.lessons.map(l=>({id:l.id,title:l.title,objectiveIds:objectives.filter(o=>o.id.startsWith(l.id+'-')).map(o=>o.id),cefrTarget:l.cefr_target as CEFRTarget,subskillTags:[...new Set(l.activities.flatMap(a=>a.skill_tags.map(t=>tagMap[t])))],prerequisiteSkills:[],exerciseIds:l.activities.map(a=>a.id),status:'available'})),objectives,exercises:s.lessons.flatMap(l=>l.activities.map(q=>({id:q.id,type:q.type==='single_choice'?'multiple-choice' as const:q.type==='short_answer'?'short-answer' as const:l.module==='speaking'?'speaking' as const:l.module==='pronunciation'?'pronunciation' as const:'writing' as const,prompt:q.prompt,objectiveIds:objectives.filter(o=>o.id.startsWith(l.id+'-')).map(o=>o.id),subskillTags:q.skill_tags.map(t=>tagMap[t]),cefrTarget:l.cefr_target as CEFRTarget,prerequisiteSkills:[],options:q.options,answer:{correctOptionId:q.answer?.correct_option_id,acceptedAnswers:q.answer?.accepted_answers,rubricId:q.rubric_id,explanation:q.feedback.explanation_en??q.feedback.pending_message??''},evidence:{skill:skillFor(l.module),tag:tagMap[q.skill_tags[0]],maxScore:1,method:q.type==='extended_response'?'review-required' as const:'deterministic' as const,minimumObservations:2,setsCEFRDirectly:false as const}}))),rubrics:s.rubrics,skillTags:Object.fromEntries([...new Set(s.lessons.map(l=>l.module))].map(m=>[skillFor(m),[...new Set(Object.entries(tagMap).filter(([k])=>k.startsWith(m+'.')).map(([,v])=>v))]]))};
}
export function normalizeAnswer(s:string){return s.trim().toLowerCase().replace(/[’]/g,"'").replace(/\s+/g,' ').replace(/[.!?]+$/g,'').trim()}
export function compareVersions(a:string,b:string){const x=a.split('.').map(Number),y=b.split('.').map(Number);for(let i=0;i<3;i++)if(x[i]!==y[i])return x[i]-y[i];return 0}
