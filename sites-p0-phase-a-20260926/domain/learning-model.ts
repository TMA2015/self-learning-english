import type {EvaluationMetadata} from "./ai-metadata";
import legacyQuestions from "../content/questions-v2.json";
import tasks from "../content/writing-tasks.json";
import {coreCatalog as subskillCatalog,canonical,type CoreSkill} from "./core-bank";
import {adaptiveQuestion,estimateEvidence,ENGINE_VERSION,type ConfidenceParts} from "./adaptive-engine";
import { bank, selectQuestion } from "./diagnostic-bank";
export type Skill = "Grammar" | "Vocabulary" | "Reading" | "Writing" | "Listening" | "Speaking";
export type Level = "Pre-A1" | "A1" | "A2" | "B1" | "B2" | "Not assessed";
export type Attempt = { id:string; skill:CoreSkill; level:"A1"|"A2"|"B1"|"B2"; tag:string; answer:string; correct:boolean };
export type DiagnosticV2 = { version:2|3|4; sessionId?:string; paused?:boolean; writingReviews?:(WritingRating|null)[]; writing2?:string; listening?:ListeningAttempt[]; listeningSkipped?:boolean; listeningEvidenceRecovered?:boolean; listeningSupplementOf?:string; attempts:Attempt[]; writing:string; result?:DiagnosticResult; startedAt:number; finishedAt?:number };
export type Evidence = {reviewSource?:"assisted-ai";reviewStatus?:"approved"; evaluation?:EvaluationMetadata; id:string; source:"diagnostic"|"writing"|"practice"|"exercise"|"reading"|"vocabulary"|"listening"|"speaking"|"revision"; questionId?:string; engineVersion?:string; raw?:unknown; supersedes?:string; activityId?:string; provisional?:boolean; errorTags?:string[]; skill:Skill; tag:string; score:number; max:number; at:number; level?:Level; detail?:string; mode?:"rubric"|"ai" };
export type SkillEstimate = {level:Level; percent:number; confidence:"low"|"moderate"|"high"; confidencePercent?:number; confidenceParts?:ConfidenceParts; displayLevel?:string; ability?:number; engineVersion?:string; evidenceCount:number; note:string; assessed?:boolean; range?:string; coverage?:number};
export type DiagnosticResult = { level:Level; confidence?:"low"|"moderate"|"high"; confidencePercent?:number; displayLevel?:string; engineVersion?:string; scope?:string; listening?:ListeningResult; estimates:Record<Skill,SkillEstimate>; strengths:string[]; weaknesses:string[]; errorTags:string[]; subskills:Record<string,{correct:number;total:number}>; evidence:Evidence[]; at:number };
export type LearnerModel = { level:Level; confidence?:"low"|"moderate"|"high"; confidencePercent?:number; displayLevel?:string; engineVersion?:string; scope?:string; listening?:ListeningResult; estimates:Record<Skill,SkillEstimate>; strengths:string[]; weaknesses:string[]; errorTags:string[]; subskills:Record<string,{correct:number;total:number}>; priorities?:string[]; recurringErrors?:{tag:string;count:number}[]; goals:string; updatedAt:number; diagnosticAt:number };
export type PlanItem = { skill:Skill; priority:"Focus"|"Maintain"; reason:string; action:string };
export type LearningPlanModel = { items:PlanItem[]; updatedAt:number };
export type Question = {id:string;skill:CoreSkill;level:"A1"|"A2"|"B1"|"B2";tag:string;prompt:string;passage?:string;options:[string,string,string];correct:number;hintVi:string};
export const questions=legacyQuestions as Question[];
const skills:["Grammar","Vocabulary","Reading"]=["Grammar","Vocabulary","Reading"];
function legacyNextQuestion(attempts:Attempt[]):Question|null {
 for(const skill of skills){const done=attempts.filter(a=>a.skill===skill);if(done.length>=4)continue;
  const level=done.length<2?"A2":done.slice(0,2).every(a=>a.correct)?"B1":done.slice(0,2).every(a=>!a.correct)?"A1":"A2";
  const pool=questions.filter(q=>q.skill===skill&&q.level===level&&!done.some(a=>a.id===q.id));return pool[0]??null;
 }return null;
}
export function recordAnswer(attempts:Attempt[],question:Question,answer:number):Attempt[]{if(attempts.some(a=>a.id===question.id))return attempts;return [...attempts,{id:question.id,skill:question.skill,level:question.level,tag:question.tag,answer:String(answer),correct:answer===question.correct}];}
function wordCount(text:string){return text.trim()?text.trim().split(/\s+/).length:0}
export function writingRubric(text:string){const words=wordCount(text);const sentences=text.split(/[.!?]+/).map(s=>s.trim()).filter(Boolean).length;const reason=/\b(because|since|so)\b/i.test(text);const example=/\b(for example|for instance|such as)\b/i.test(text);const topic=/\b(learn|learning|study|studying|school|subject|enjoy)\b/i.test(text);const score=Math.min(5,Number(words>=30)+Number(words>=60)+Number(sentences>=3)+Number(reason)+Number(example||topic));const tags=[...(words<30?["writing-length"]:[]),...(!reason?["idea-development"]:[]),...(sentences<3?["sentence-structure"]:[])];return {score,max:5,tags,words,sentences};}
function legacyWritingEvidence(stage:number,answer:Record<string,string>,at=Date.now()):Evidence[]{
 const text=Object.values(answer).join(" ");let tag="",score=0,max=3;
 if(stage===0){tag="question-analysis";score=Number(/garden/i.test(answer.topic||""))+Number(/agree|disagree/i.test(answer.task||""))+Number(/school/i.test(answer.limits||""));}
 if(stage===1){tag="idea-development";score=Number((answer.selected||"").trim().length>12)+Number((answer.support||"").trim().length>18)+Number((answer.example||"").trim().length>15);}
 if(stage===2){tag="organization";score=Number(!!answer.opening?.trim())+Number(!!answer.reason1?.trim()&&!!answer.detail?.trim())+Number(!!answer.example?.trim()&&!!answer.ending?.trim());}
 if(stage===3){const r=writingRubric(answer.writing||"");return [{id:`writing-${at}-draft`,source:"writing",skill:"Writing",tag:"writing-structure",score:r.score,max:r.max,at,mode:"rubric",detail:`${r.words} words; ${r.sentences} sentences`},...r.tags.map((t,i)=>({id:`writing-${at}-tag-${i}`,source:"writing" as const,skill:"Writing" as const,tag:t,score:0,max:1,at,mode:"rubric" as const}))]}
 return [{id:`writing-${at}-${stage}`,source:"writing",skill:"Writing",tag,score,max,at,mode:"rubric"}];
}
export type WritingRating={evaluation?:EvaluationMetadata;level:Exclude<Level,"Not assessed">;scores:Record<string,number>;summary:string;strengths:string[];improvements:string[];corrections:{original:string;revised:string;why:string;tag:string}[];tags:string[];exercise:string};
export type ListeningAttempt={id:string;answer:number;played:boolean};
export type ListeningResult={evidence?:Evidence[];correct:number;total:number;confidence:"low";subskills:Record<string,{correct:number;total:number}>;note:string};
export const writingPrompts=tasks;
export function nextQuestion(attempts:Attempt[],version:2|3|4=4):Question|null{return version===2?legacyNextQuestion(attempts):version===3?selectQuestion(attempts):adaptiveQuestion(attempts);}
export const assessmentQuestions=bank;
const levels:Exclude<Level,"Not assessed">[]=["Pre-A1","A1","A2","B1","B2"];
export function inference(rows:Evidence[],skill:Skill):SkillEstimate{
 const valid=rows.filter(isKnowledgeEvidence).filter(e=>e.level&&levels.includes(e.level as typeof levels[number])&&!e.provisional).map(e=>({...e,tag:canonicalTag(e.skill,e.tag)}));
 const tags=subskillCatalog[skill];const scored=estimateEvidence(valid,tags);
 const enough=valid.length>=tags.length*2&&scored.coverage===100;
 const listening=skill==="Listening";
 return {...scored,confidence:enough?(listening?"low":scored.confidence):"low",confidencePercent:enough?Math.min(listening?59:95,scored.confidencePercent):Math.min(49,scored.confidencePercent),level:enough?scored.level:"Not assessed",displayLevel:enough?scored.displayLevel:"insufficient evidence",assessed:enough,ability:scored.mean,engineVersion:ENGINE_VERSION,note:enough?`${valid.length} responses across ${tags.length} subskills. ${listening?"Synthetic speech only; accents and natural conversation are not covered.":"Confidence is an evidence index, not the probability of certification."}`:"Insufficient coverage: at least two responses per subskill are needed before assigning a level."};
}
function writingEstimate(evidence:Evidence[]):SkillEstimate{
 const ai=evidence.filter(e=>e.skill==="Writing"&&e.mode==="ai"&&subskillCatalog.Writing.includes(e.tag));
 const activities=[...new Set(ai.map(e=>e.activityId??e.id))].slice(-6);
 const recent=[...new Map(ai.filter(e=>activities.includes(e.activityId??e.id)).map(e=>[`${e.activityId??e.id}:${e.tag}`,e])).values()];
 if(!recent.length)return {level:"Not assessed",percent:0,confidence:"low",evidenceCount:0,assessed:false,confidencePercent:0,displayLevel:"Provisional",note:"Provisional – AI language evaluation unavailable"};
 const ratings=activities.map(id=>recent.find(e=>(e.activityId??e.id)===id)!).filter(e=>e.level&&e.level!=="Not assessed");
 const index=ratings.length?Math.round(ratings.reduce((s,e)=>s+levels.indexOf(e.level as typeof levels[number]),0)/ratings.length):0;
 return {level:ratings.length?levels[Math.max(0,index)]:"Not assessed",percent:Math.round(recent.reduce((s,e)=>s+e.score/e.max,0)/recent.length*100),displayLevel:ratings.length?levels[Math.max(0,index)]:"insufficient evidence",confidence:activities.length>=3?"moderate":"low",confidencePercent:Math.min(75,35+activities.length*10),ability:index,evidenceCount:activities.length,assessed:!!ratings.length,note:`${activities.length} distinct reviewed writing sample(s), six criteria. AI-assisted judgments need confirmation through independent work.`};
}
export function ratingEvidence(rating:WritingRating,source:"diagnostic"|"writing",id:string,at:number):Evidence[]{return subskillCatalog.Writing.map(tag=>({id:`${id}-${tag}`,activityId:id,source,skill:"Writing",tag,score:rating.scores[tag],max:10,level:rating.level,at,mode:"ai",evaluation:rating.evaluation,detail:rating.summary,errorTags:rating.corrections.filter(c=>c.tag===tag||tag==="grammar-accuracy").map(c=>c.tag)}));}
export function makeDiagnostic(attempts:Attempt[],writing:string,at=Date.now(),ratings:WritingRating[]=[],listening?:ListeningResult):DiagnosticResult{
 const evidence:Evidence[]=attempts.map(a=>({id:`diagnostic-${at}-${a.id}`,activityId:`diagnostic-${at}`,source:"diagnostic",skill:a.skill,tag:a.tag,score:Number(a.correct),max:1,at,level:a.level,questionId:a.id,raw:{answer:a.answer,correct:a.correct},engineVersion:ENGINE_VERSION,mode:"rubric"}));
 if(ratings.length)ratings.forEach((r,i)=>evidence.push(...ratingEvidence(r,"diagnostic",`diagnostic-${at}-sample-${i}`,at)));
 else evidence.push({id:`diagnostic-${at}-writing-pending`,source:"diagnostic",skill:"Writing",tag:"writing-review-pending",score:0,max:1,at,mode:"rubric",provisional:true,detail:"Two samples saved; language review unavailable."});
 if(listening?.evidence)evidence.push(...listening.evidence.map(e=>({...e,at})));
 const estimates={} as Record<Skill,SkillEstimate>;for(const skill of skills)estimates[skill]=inference(evidence.filter(e=>e.skill===skill),skill);estimates.Writing=writingEstimate(evidence);estimates.Listening=inference(evidence.filter(e=>e.skill==="Listening"),"Listening");estimates.Speaking={level:"Not assessed",displayLevel:"insufficient evidence",percent:0,confidence:"low",confidencePercent:0,evidenceCount:0,assessed:false,note:"Speaking level: insufficient evidence. Audio evaluation is not connected."};
 const shell:DiagnosticResult={level:"Not assessed",confidence:"low",estimates,strengths:[],weaknesses:[],errorTags:[],subskills:{},evidence,at,listening};
 const profile=deriveLearner(shell,evidence,"");return {...shell,...profile,evidence,at};
}
function canonicalTag(skill:Skill,tag:string){const aliases:Record<string,string>={"past-tense":"tense","present-continuous":"tense","subject-verb-agreement":"agreement","be-verb":"agreement",article:"articles",preposition:"prepositions","first-conditional":"conditionals","relative-clause":"clauses","context-meaning":"meaning-in-context","word-choice":"collocation","word-family":"word-formation","basic-meaning":"range","main-idea":"gist","question-analysis":"task-understanding"};return canonical(aliases[tag]??tag);}
export function deriveLearner(result:DiagnosticResult,evidence:Evidence[],goals:string):LearnerModel{
 // Keep stored history intact. Use latest diagnostic plus subsequent activities, deduped by id.
 const all=[...new Map([...result.evidence,...evidence].map(e=>[e.id,e])).values()].filter(e=>e.at>=result.at&&isKnowledgeEvidence(e)).sort((a,b)=>a.at-b.at);
 const unique=[...new Map(all.map(e=>[(e.source==="writing"||e.source==="revision"||e.source==="exercise")&&e.activityId?`${e.activityId}:${e.questionId??""}:${e.tag}`:e.id,e])).values()];
 const estimates={...result.estimates};for(const skill of skills){const rows=unique.filter(e=>e.skill===skill&&!e.provisional);if(rows.length){const baseline=rows.filter(e=>e.source==="diagnostic");const later=rows.filter(e=>e.source!=="diagnostic");const ready=later.slice(0,Math.floor(later.length/3)*3);estimates[skill]=inference([...baseline,...ready].slice(-120),skill);}}
 estimates.Writing=writingEstimate(unique);estimates.Listening=inference(unique.filter(e=>e.skill==="Listening"),"Listening");estimates.Speaking={level:"Not assessed",displayLevel:"insufficient evidence",percent:0,confidence:"low",confidencePercent:0,evidenceCount:0,assessed:false,note:"Speaking level: insufficient evidence. No reliable audio evaluator connected."};
 const subskills:Record<string,{correct:number;total:number}>={};for(const [skill,tags] of Object.entries(subskillCatalog))for(const tag of tags)subskills[`${skill}: ${tag}`]={correct:0,total:0};
 const misses=new Map<string,Set<string>>();for(const e of unique){if(e.provisional||e.tag==="writing-structure")continue;const tag=canonicalTag(e.skill,e.tag);const key=`${e.skill}: ${tag}`;const row=subskills[key]??{correct:0,total:0};subskills[key]={correct:row.correct+e.score,total:row.total+e.max};if(e.errorTags?.length||e.score/e.max<.6){const tags=e.errorTags?.length?e.errorTags:[tag];for(const error of tags){const set=misses.get(error)??new Set();set.add(e.activityId??e.id);misses.set(error,set)}}}
 // For objective answers, each separate question is an opportunity, even in one sitting.
 for(const e of unique.filter(e=>e.skill!=="Writing"&&e.score/e.max<.6)){const tag=canonicalTag(e.skill,e.tag);const set=misses.get(tag)??new Set<string>();set.delete(e.activityId??e.id);set.add(e.id);misses.set(tag,set)}
 const recurringErrors=[...misses].map(([tag,ids])=>({tag,count:ids.size})).filter(e=>e.count>=2).sort((a,b)=>b.count-a.count);
 const ranked=Object.entries(subskills).filter(([,s])=>s.total>=2).sort((a,b)=>(a[1].correct+1)/(a[1].total+2)-(b[1].correct+1)/(b[1].total+2));
 const strengths=ranked.filter(([,s])=>s.total>=4&&s.correct/s.total>=.8).map(([tag])=>tag),weaknesses=ranked.filter(([,s])=>s.correct/s.total<.6).map(([tag])=>tag);
 const measured=Object.entries(estimates).filter(([,e])=>e.assessed!==false&&e.level!=="Not assessed");
 const coreCovered=skills.every(s=>estimates[s].assessed);const ability=measured.length?measured.reduce((n,[,e])=>n+(e.ability??levels.indexOf(e.level as typeof levels[number])),0)/measured.length:0;
 const level=coreCovered?levels[Math.max(0,Math.min(4,Math.round(ability)))]:"Not assessed";
 const confidencePercent=coreCovered?Math.round(measured.reduce((n,[,e])=>n+(e.confidencePercent??0),0)/measured.length*(estimates.Writing.assessed?1:.85)):0;
 const confidence=confidencePercent>=80?"high":confidencePercent>=60?"moderate":"low";
 const offset=ability-Math.round(ability);const displayLevel=level!=="Not assessed"?level+(confidencePercent>=60&&level!=="Pre-A1"&&level!=="B2"?(offset>.22?"+":offset<-.22?"−":""):""):"insufficient evidence";
 const profile:LearnerModel={level,displayLevel,confidence,confidencePercent,engineVersion:ENGINE_VERSION,scope:`${measured.map(([name])=>name).join(", ")||"No skills"} measured. Unassessed skills are excluded; this is a provisional partial profile.`,listening:result.listening,estimates,strengths,weaknesses,errorTags:[...misses.keys()],recurringErrors,subskills,goals,updatedAt:Date.now(),diagnosticAt:result.at};
 profile.priorities=derivePlan(profile).items.filter(i=>i.priority==="Focus").map(i=>`${i.skill}: ${i.action}`);return profile;
}
export function derivePlan(profile:LearnerModel):LearningPlanModel{
 const rows=(Object.entries(profile.estimates) as [Skill,SkillEstimate][]).filter(([skill,e])=>!["Speaking","Listening"].includes(skill)||e.assessed).map(([skill,e])=>{const weak=Object.entries(profile.subskills).filter(([key,row])=>key.startsWith(`${skill}: `)&&row.total>0).sort((a,b)=>(a[1].correct+1)/(a[1].total+2)-(b[1].correct+1)/(b[1].total+2));const weakness=weak[0];return {skill,e,weakness,rank:e.assessed===false?-.1:weakness?(weakness[1].correct+1)/(weakness[1].total+2):e.percent/100}}).sort((a,b)=>a.rank-b.rank);
 return {updatedAt:Date.now(),items:rows.map(({skill,e,weakness},i)=>{const tag=weakness?.[0].split(": ")[1];const row=weakness?.[1];return {skill,priority:i<3?"Focus":"Maintain",reason:e.assessed===false?`${skill} lacks a language-level assessment. Collect reviewed evidence before setting a level.`:row?`${tag}: ${row.correct}/${row.total} scored points in current evidence. ${e.confidence} confidence for ${skill}; ${i<3?"this is a current priority":"keep this skill active"}. One answer does not reset your plan.`:`${e.percent}% across ${e.evidenceCount} items; ${e.confidence} confidence.`,action:skill==="Listening"?`Practise ${tag??"listening for detail"} with a short clip; replay and check what changed.`:skill==="Writing"?`Complete a Writing draft, then revise ${tag??"one reason and one sentence"}. Language review is needed to assess accuracy.`:skill==="Grammar"?`Review ${tag??"a sentence pattern"}, then write and check three original sentences.`:skill==="Reading"?`Read a short passage and practise ${tag??"the main idea"}; explain which words support your answer.`:`Practise ${tag??"words in context"} with three new sentences and check their meaning.`}})};
}
function fingerprint(text:string){let h=2166136261;for(const c of text)h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0).toString(36)}
export function writingEvidence(stage:number,answer:Record<string,string>,at=Date.now(),rating?:WritingRating):Evidence[]{
 const id=`writing-${stage}-${fingerprint(JSON.stringify(answer))}`;
 if(stage===3&&rating)return ratingEvidence(rating,"writing",id,at).map(e=>({...e,activityId:"school-garden-writing"}));
 const rows=legacyWritingEvidence(stage,answer,at);
 return rows.map((e,i)=>({...e,id:`${id}-${i}`,activityId:`school-garden-step-${stage}`,tag:canonicalTag("Writing",e.tag),level:undefined,provisional:stage===3,detail:stage===3?"Draft saved. Language quality has not been assessed.":"Guided process check; does not set a CEFR level."}));
}

/** Explicit future format-only evidence is excluded; legacy evidence is never reclassified. */
export function isKnowledgeEvidence(e:Evidence){return !e.raw||typeof e.raw!=='object'||(e.raw as {answerOutcome?:string}).answerOutcome!=='format-only'}
