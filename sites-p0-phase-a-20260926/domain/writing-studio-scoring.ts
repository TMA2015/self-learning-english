import {CEFR_WRITING_CRITERIA,type CEFRWritingCriterionFeedback,type CEFRWritingCriterionId} from './writing-studio-reference';

/**
 * Project-defined practice rubric, NOT a Council of Europe numeric score.
 * The selected CEFR target (when present) changes the standard for judging
 * each criterion; it never describes the learner's overall CEFR proficiency.
 */
export const WRITING_STUDIO_SCORING_VERSION='writing-studio-six-criteria-0to5-v2' as const;
export const WRITING_STUDIO_MAX_SCORE=30 as const;
export const WRITING_STUDIO_SCORE_ANCHORS=[
 '0 — No relevant evidence of the criterion in the submitted response.',
 '1 — Very limited achievement of the task/target expectations.',
 '2 — Partial achievement with significant weaknesses.',
 '3 — Adequate in parts, but inconsistent or insufficiently developed.',
 '4 — Good achievement; minor shortcomings remain.',
 '5 — Strong, consistent achievement of the selected task/target expectations.',
] as const;

export type WritingStudioScoredCriterion=CEFRWritingCriterionFeedback&{score:number};
export type WritingStudioScoreResult={
 summary:string;strengths:string[];improvements:string[];exercise:string;tags:string[];
 criteria:WritingStudioScoredCriterion[];corrections:{original:string;why:string;hint:string}[];
 scores:Record<CEFRWritingCriterionId,number>;totalScore:number;maxScore:30;
 level:null;canEstimateLevel:false;
};

const record=(v:unknown):Record<string,unknown>|null=>
 typeof v==='object'&&v!==null&&!Array.isArray(v)?v as Record<string,unknown>:null;
const strings=(v:unknown,limit:number):string[]|null=>
 Array.isArray(v)&&v.length<=limit&&v.every(x=>typeof x==='string')?v.map(x=>(x as string).slice(0,700)):null;

/** Verify an excerpt against the original draft without paraphrasing it.
 * Permit only trim/whitespace variation; return bytes sliced from the original.
 * Do not attempt semantic similarity, fuzzy matches or fabricated substitutions. */
export function verifiedWritingExcerpt(draft:string,excerpt:unknown):string{
 if(typeof excerpt!=='string'||!excerpt.trim()||excerpt.length>800)return '';
 if(draft.includes(excerpt))return excerpt;
 const trimmed=excerpt.trim();
 if(draft.includes(trimmed))return trimmed;
 // Gemini sometimes collapses line breaks or multiple spaces in exact quotations.
 // Matching these whitespace differences still returns an actual draft substring.
 const parts=trimmed.split(/\s+/u);
 if(parts.length<3)return '';
 const special='\\^$.*+?()[]{}|';
 const escaped=parts.map(part=>Array.from(part,ch=>special.includes(ch)?'\\'+ch:ch).join(''));
 try{
  const match=new RegExp(escaped.join('\\s+'),'u').exec(draft);
  return match?.[0]??'';
 }catch{return ''}
}

/** Provider-only normalization: never manufacture missing marks or invented quotes. */
export function validateWritingStudioScore(raw:unknown,draft:string):WritingStudioScoreResult|null{
 const r=record(raw);
 if(!r||typeof r.summary!=='string'||!r.summary.trim()||
    typeof r.exercise!=='string'||!r.exercise.trim()||
    (r.level!==undefined&&r.level!==null)||
    (r.canEstimateLevel!==undefined&&r.canEstimateLevel!==false)||
    !Array.isArray(r.criteria)||r.criteria.length!==CEFR_WRITING_CRITERIA.length)return null;
 const strengths=strings(r.strengths,3),improvements=strings(r.improvements,3),tags=strings(r.tags,10);
 if(!strengths||!improvements||!tags)return null;
 const rows=new Map<CEFRWritingCriterionId,WritingStudioScoredCriterion>();
 for(const item of r.criteria){
   const row=record(item);
   if(!row||typeof row.criterion!=='string')return null;
   const id=row.criterion.trim() as CEFRWritingCriterionId;
   if(!CEFR_WRITING_CRITERIA.some(x=>x.id===id)||rows.has(id)||
     typeof row.score!=='number'||!Number.isInteger(row.score)||row.score<0||row.score>5||
     typeof row.observation!=='string'||!row.observation.trim()||
     typeof row.nextStep!=='string'||!row.nextStep.trim())return null;
   // The full response remains usable if Gemini's citation is not verbatim.
   // Omit the ungrounded quote rather than showing it as evidence.
   const quote=verifiedWritingExcerpt(draft,row.evidence);
   rows.set(id,{criterion:id,score:Number(row.score),observation:row.observation.trim().slice(0,1400),
     evidence:quote,nextStep:row.nextStep.trim().slice(0,700)});
 }
 const criteria=CEFR_WRITING_CRITERIA.map(x=>rows.get(x.id));
 if(criteria.some(x=>!x))return null;
 const ordered=criteria as WritingStudioScoredCriterion[];
 const corrections:Array<{original:string;why:string;hint:string}>=[];
 if(Array.isArray(r.corrections)){
   for(const item of r.corrections.slice(0,3)){
     const row=record(item);
     if(row&&typeof row.original==='string'&&row.original.length>0&&draft.includes(row.original)&&
       typeof row.why==='string'&&row.why.trim()&&typeof row.hint==='string'&&row.hint.trim())
       corrections.push({original:row.original,why:row.why.slice(0,700),hint:row.hint.slice(0,700)});
   }
 }
 const scores=Object.fromEntries(ordered.map(x=>[x.criterion,x.score])) as Record<CEFRWritingCriterionId,number>;
 return {summary:r.summary.slice(0,2200),strengths,improvements,exercise:r.exercise.slice(0,1400),tags,
   criteria:ordered,corrections,scores,totalScore:ordered.reduce((sum,x)=>sum+x.score,0),maxScore:WRITING_STUDIO_MAX_SCORE,
   level:null,canEstimateLevel:false};
}
