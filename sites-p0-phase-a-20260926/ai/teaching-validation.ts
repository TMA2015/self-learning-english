import {validateRating} from './validation';
import type {TeachingRating} from '../domain/writing';
// Schema validation cannot establish factual accuracy; live sample review remains a separate gate.
export function validateTeachingRating(value:unknown,text:string):TeachingRating|null{
 const rating=validateRating(value,text);if(!rating)return null;const r=value as TeachingRating;
 if(typeof r.relevance!=='number'||!Number.isFinite(r.relevance)||r.relevance<0||r.relevance>10||typeof r.canEstimateLevel!=='boolean'||typeof r.revisionSummary!=='string'||typeof r.exerciseTag!=='string'||!r.exerciseTag.trim())return null;
 if(r.corrections.length>3||r.corrections.some(c=>typeof c.hint!=='string'||!c.hint.trim()||c.original.length>600||c.revised.length>600||c.revised===c.original))return null;
 if(text.split(/[.!?]+/).filter(x=>x.trim()).length>1&&r.corrections.some(c=>c.original.length>text.length*.85))return null;
 if(r.revisionInstructions!==undefined&&(!Array.isArray(r.revisionInstructions)||r.revisionInstructions.length<1||r.revisionInstructions.length>3||r.revisionInstructions.some(x=>typeof x!=='string'||!x.trim()||x.length>800)))return null;
 if([rating.summary,rating.exercise,r.revisionSummary,...rating.strengths,...rating.improvements].some(s=>s.length>1600)||rating.strengths.length<1||rating.improvements.length>3)return null;
 return {...rating,...(r.revisionInstructions?{revisionInstructions:r.revisionInstructions}:{}),relevance:r.relevance,canEstimateLevel:r.canEstimateLevel,revisionSummary:r.revisionSummary,exerciseTag:r.exerciseTag,corrections:rating.corrections.map((c,i)=>({...c,hint:r.corrections[i].hint}))};
}
