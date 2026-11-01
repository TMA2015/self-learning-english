import {tagMap,type AcademicAttempt,type AcademicPackage} from './academic';
import type {WritingSubmission,WritingEvaluation} from './writing';

type Tally={correct:number;total:number;uniqueQuestions:number;accuracyPercent:number|null};
type Bucket={correct:number;total:number;questions:Set<string>};
const bucket=():Bucket=>({correct:0,total:0,questions:new Set()});
const view=(b:Bucket):Tally=>({correct:b.correct,total:b.total,uniqueQuestions:b.questions.size,accuracyPercent:b.total?Math.round(b.correct/b.total*100):null});
const identity=(a:AcademicAttempt,qid:string)=>`${a.packageId}\u001f${a.version}\u001f${qid}`;
export type PracticeProgress=ReturnType<typeof derivePracticeProgress>;

/** Read-only projection of saved results; no answer keys, regrading, or evidence inserts. */
export function derivePracticeProgress(attempts:AcademicAttempt[],packages:AcademicPackage[],submissions:WritingSubmission[]=[],evaluations:WritingEvaluation[]=[]){
 const overall=bucket(),skills=new Map<string,Bucket>(),tags=new Map<string,Bucket>();
 const byQuestion=new Map<string,{incorrect:number;total:number;skill:string;tag:string;lessonId:string;version:string}>();
 const byPackage=new Map(packages.map(p=>[`${p.id}\u001f${p.version}`,p]));
 const sorted=[...attempts].sort((a,b)=>(a.submittedAt??a.createdAt)-(b.submittedAt??b.createdAt)||a.id.localeCompare(b.id));
 let pendingFoundation=0,approvedFoundation=0;
 for(const attempt of sorted){
  if(attempt.status==='pending_review')pendingFoundation++;
  if(attempt.status==='approved')approvedFoundation++;
  if(!['scored','pending_review','approved'].includes(attempt.status))continue;
  const source=byPackage.get(`${attempt.packageId}\u001f${attempt.version}`);
  const lesson=source?.source.lessons.find(l=>l.id===attempt.lessonId);
  const skill=lesson?.module ? lesson.module[0].toUpperCase()+lesson.module.slice(1) : ({GRA:'Grammar',VOC:'Vocabulary',REA:'Reading',LIS:'Listening',WRI:'Writing',SPE:'Speaking',PRO:'Pronunciation'} as Record<string,string>)[attempt.lessonId.split('-')[0]]??'Other';
  const seen=new Set<string>();
  for(const result of attempt.results??[]){
   if(result.correct===null||typeof result.correct!=='boolean'||seen.has(result.id))continue;
   seen.add(result.id);
   const question=identity(attempt,result.id),answer=Number(result.correct);
   overall.total++;overall.correct+=answer;overall.questions.add(question);
   let skillBucket=skills.get(skill);if(!skillBucket){skillBucket=bucket();skills.set(skill,skillBucket)}
   skillBucket.total++;skillBucket.correct+=answer;skillBucket.questions.add(question);
   const labels=[...new Set(result.tags??[])];
   for(const sourceTag of labels){const tag=tagMap[sourceTag]??sourceTag,key=`${skill}:${tag}`;
    let target=tags.get(key);if(!target){target=bucket();tags.set(key,target)}target.total++;target.correct+=answer;target.questions.add(question)}
   const previous=byQuestion.get(question)??{incorrect:0,total:0,skill,tag:labels[0]??'',lessonId:attempt.lessonId,version:attempt.version};
   previous.total++;previous.incorrect+=1-answer;byQuestion.set(question,previous);
  }
 }
 const current=[...packages].sort((a,b)=>b.at-a.at)[0];
 const suggestions=[...tags].filter(([,b])=>b.total>=2&&b.correct/b.total<.7).map(([key,b])=>{
  const [skill,tag]=key.split(':');
  const lesson=current?.source.lessons.find(l=>l.module.toLowerCase()===skill.toLowerCase()&&l.activities.some(q=>q.skill_tags.some(t=>(tagMap[t]??t)===tag)));
  return {skill,tag,correct:b.correct,total:b.total,lessonId:lesson?.id??null,lessonTitle:lesson?.title??null,reason:`${b.correct}/${b.total} correct across ${b.questions.size} distinct question(s) tagged ${tag}.`};
 }).sort((a,b)=>a.correct/a.total-b.correct/b.total||b.total-a.total||a.tag.localeCompare(b.tag)).slice(0,3);
 const latestEvaluation=new Map<string,WritingEvaluation>();
 for(const evaluation of [...evaluations].sort((a,b)=>a.at-b.at))latestEvaluation.set(evaluation.submissionId,evaluation);
 const writingLegacy={submitted:submissions.length,approved:0,pending:0};
 for(const submission of submissions){const status=latestEvaluation.get(submission.id)?.status;if(status==='approved')writingLegacy.approved++;else writingLegacy.pending++}
 return {scope:'Saved Foundation objective answers across all attempts and immutable package versions',overall:view(overall),
  skills:[...skills].map(([skill,b])=>({skill,...view(b)})).sort((a,b)=>a.skill.localeCompare(b.skill)),
  tags:[...tags].map(([key,b])=>{const [skill,tag]=key.split(':');return {skill,tag,...view(b)}}).sort((a,b)=>a.skill.localeCompare(b.skill)||a.tag.localeCompare(b.tag)),
  repeatedMistakes:[...byQuestion].filter(([,v])=>v.incorrect>=2).map(([question,v])=>({questionId:question.split('\u001f')[2],lessonId:v.lessonId,version:v.version,incorrect:v.incorrect,total:v.total,skill:v.skill})).sort((a,b)=>b.incorrect-a.incorrect||a.questionId.localeCompare(b.questionId)).slice(0,10),
  writing:{foundation:{pending:pendingFoundation,approved:approvedFoundation},legacy:writingLegacy},
  suggestions,diagnosticNote:'Practice answers are not diagnostic evidence, a provisional working level, or formal CEFR certification.'};
}
