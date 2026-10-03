import adaptiveMap from '../content/adaptive-map-v1.json';
import type {AcademicAttempt,AcademicPackage} from './academic';

export type AdaptiveEvidenceState='not_enough_evidence'|'needs_practice'|'developing'|'stable_for_now';
type ConceptConfig={
 id:string;
 source_tags:string[];
 primary_lesson:string;
 planned_primary_lesson?:string;
 prerequisite_concepts:string[];
};
type ConceptBucket={
 correct:number;
 total:number;
 questions:Set<string>;
 attempts:Set<string>;
 byQuestion:Map<string,{incorrect:number;total:number}>;
};
export type AdaptiveConceptView={
 conceptId:string;
 sourceTags:string[];
 correct:number;
 total:number;
 distinctQuestions:number;
 attempts:number;
 accuracyPercent:number|null;
 repeatedQuestions:number;
 repeatedIncorrect:number;
 state:AdaptiveEvidenceState;
 primaryLessonId:string;
 primaryLessonTitle:string|null;
 prerequisiteConcepts:string[];
};
export type AdaptiveRecommendation={
 targetConceptId:string;
 recommendedConceptId:string;
 lessonId:string;
 lessonTitle:string;
 prerequisiteFirst:boolean;
 prerequisiteFor:string|null;
 correct:number;
 total:number;
 distinctQuestions:number;
 attempts:number;
 accuracyPercent:number;
 repeatedQuestions:number;
 reason:string;
};
export type AdaptiveGrammarProgress={
 scope:string;
 currentContentVersion:string|null;
 concepts:AdaptiveConceptView[];
 recommendations:AdaptiveRecommendation[];
 note:string;
};

const config=adaptiveMap as typeof adaptiveMap&{concepts:ConceptConfig[]};
const defaults=config.recommendation_defaults;
const identity=(a:AcademicAttempt,qid:string)=>`${a.packageId}\u001f${a.version}\u001f${qid}`;
const bucket=():ConceptBucket=>({correct:0,total:0,questions:new Set(),attempts:new Set(),byQuestion:new Map()});

function evidenceState(b:ConceptBucket):AdaptiveEvidenceState{
 const distinct=b.questions.size,attempts=b.attempts.size,accuracy=b.total?b.correct/b.total*100:0;
 if(b.total<defaults.minimum_submitted_observations||distinct<defaults.minimum_distinct_questions)return 'not_enough_evidence';
 if(accuracy<defaults.needs_practice_below_percent)return 'needs_practice';
 if(accuracy>=defaults.stable_for_now_minimum_percent&&distinct>=defaults.stable_for_now_minimum_distinct_questions&&attempts>=defaults.stable_for_now_minimum_attempts)return 'stable_for_now';
 return 'developing';
}

function repeated(b:ConceptBucket){
 let questions=0,incorrect=0;
 for(const row of b.byQuestion.values())if(row.incorrect>=2){questions++;incorrect+=row.incorrect}
 return {questions,incorrect};
}

/**
 * Read-only P2B Grammar projection.
 * Uses saved submitted results and granular source tags; never answer keys or current-content regrading.
 */
export function deriveAdaptiveGrammarProgress(attempts:AcademicAttempt[],packages:AcademicPackage[]):AdaptiveGrammarProgress{
 const packagesByVersion=new Map(packages.map(p=>[`${p.id}\u001f${p.version}`,p]));
 const current=[...packages].sort((a,b)=>b.at-a.at)[0];
 const currentLessons=new Map((current?.source.lessons??[]).filter(l=>l.module==='grammar').map(l=>[l.id,l]));
 const configs=config.concepts as ConceptConfig[];
 const byTag=new Map<string,ConceptConfig[]>();
 for(const concept of configs)for(const tag of concept.source_tags){
  const rows=byTag.get(tag)??[];rows.push(concept);byTag.set(tag,rows);
 }
 const buckets=new Map(configs.map(c=>[c.id,bucket()]));
 const eligible=new Set(['scored','pending_review','approved']);
 const sorted=[...attempts].sort((a,b)=>(a.submittedAt??a.createdAt)-(b.submittedAt??b.createdAt)||a.id.localeCompare(b.id));
 for(const attempt of sorted){
  if(!eligible.has(attempt.status))continue;
  const source=packagesByVersion.get(`${attempt.packageId}\u001f${attempt.version}`);
  const lesson=source?.source.lessons.find(l=>l.id===attempt.lessonId);
  if(lesson?.module!=='grammar')continue;
  const seen=new Set<string>();
  for(const result of attempt.results??[]){
   if(typeof result.correct!=='boolean'||seen.has(result.id))continue;
   seen.add(result.id);
   const question=identity(attempt,result.id);
   const matched=new Set<ConceptConfig>();
   for(const tag of new Set(result.tags??[]))for(const concept of byTag.get(tag)??[])matched.add(concept);
   for(const concept of matched){
    const target=buckets.get(concept.id)!;
    target.total++;target.correct+=Number(result.correct);target.questions.add(question);target.attempts.add(attempt.id);
    const row=target.byQuestion.get(question)??{incorrect:0,total:0};row.total++;row.incorrect+=Number(!result.correct);target.byQuestion.set(question,row);
   }
  }
 }
 const conceptViews:AdaptiveConceptView[]=configs.map(concept=>{
  const b=buckets.get(concept.id)!;
  const repeats=repeated(b);
  const lesson=currentLessons.get(concept.primary_lesson);
  return {
   conceptId:concept.id,sourceTags:[...concept.source_tags],correct:b.correct,total:b.total,distinctQuestions:b.questions.size,attempts:b.attempts.size,
   accuracyPercent:b.total?Math.round(b.correct/b.total*100):null,repeatedQuestions:repeats.questions,repeatedIncorrect:repeats.incorrect,state:evidenceState(b),
   primaryLessonId:concept.primary_lesson,primaryLessonTitle:lesson?.title??null,prerequisiteConcepts:[...concept.prerequisite_concepts]
  };
 });
 const byConcept=new Map(conceptViews.map(v=>[v.conceptId,v]));
 const configByConcept=new Map(configs.map(c=>[c.id,c]));
 type Candidate=AdaptiveRecommendation&{sortAccuracy:number};
 const candidates:Candidate[]=[];
 for(const target of conceptViews){
  if(target.state!=='needs_practice')continue;
  const prerequisites=(configByConcept.get(target.conceptId)?.prerequisite_concepts??[]).map(id=>byConcept.get(id)).filter((v):v is AdaptiveConceptView=>!!v&&v.state==='needs_practice');
  prerequisites.sort((a,b)=>(a.accuracyPercent??101)-(b.accuracyPercent??101)||b.repeatedQuestions-a.repeatedQuestions||b.distinctQuestions-a.distinctQuestions||a.conceptId.localeCompare(b.conceptId));
  const route=prerequisites[0]??target;
  const lesson=currentLessons.get(route.primaryLessonId);
  if(!lesson)continue;
  const prerequisiteFirst=route.conceptId!==target.conceptId;
  const reason=prerequisiteFirst
   ?`Practice ${route.conceptId} first: it is a prerequisite for ${target.conceptId} and has ${route.correct}/${route.total} correct across ${route.distinctQuestions} distinct question(s).`
   :`Practice ${target.conceptId}: ${target.correct}/${target.total} correct across ${target.distinctQuestions} distinct question(s)${target.repeatedQuestions?`, with ${target.repeatedQuestions} repeated mistake question(s)`:''}.`;
  candidates.push({
   targetConceptId:target.conceptId,recommendedConceptId:route.conceptId,lessonId:route.primaryLessonId,lessonTitle:lesson.title,
   prerequisiteFirst,prerequisiteFor:prerequisiteFirst?target.conceptId:null,correct:route.correct,total:route.total,distinctQuestions:route.distinctQuestions,
   attempts:route.attempts,accuracyPercent:route.accuracyPercent??0,repeatedQuestions:route.repeatedQuestions,reason,sortAccuracy:route.accuracyPercent??101
  });
 }
 candidates.sort((a,b)=>Number(b.prerequisiteFirst)-Number(a.prerequisiteFirst)||b.repeatedQuestions-a.repeatedQuestions||a.sortAccuracy-b.sortAccuracy||b.distinctQuestions-a.distinctQuestions||b.total-a.total||a.recommendedConceptId.localeCompare(b.recommendedConceptId)||a.targetConceptId.localeCompare(b.targetConceptId));
 const recommendations:AdaptiveRecommendation[]=[];
 const used=new Set<string>();
 for(const candidate of candidates){
  if(used.has(candidate.recommendedConceptId))continue;
  used.add(candidate.recommendedConceptId);
  const {sortAccuracy,...view}=candidate;recommendations.push(view);
  if(recommendations.length>=defaults.max_suggestions)break;
 }
 return {
  scope:'Saved submitted Grammar objective answers mapped by exact package/version/question identity and granular source tags',
  currentContentVersion:current?.version??null,
  concepts:conceptViews,
  recommendations,
  note:'Adaptive states guide practice only. Unobserved prerequisites are not failures, historical work is never regraded, and no state certifies CEFR mastery.'
 };
}
