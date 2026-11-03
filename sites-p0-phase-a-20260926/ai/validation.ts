import {coreCatalog as subskillCatalog} from "../domain/core-bank";
import type {WritingRating} from "../domain/learning-model";
export function validateRating(raw:unknown,text:string):WritingRating|null{
 if(!raw||typeof raw!=="object")return null;const r=raw as WritingRating;
 if(!["Pre-A1","A1","A2","B1","B2"].includes(r.level)||!r.scores||typeof r.summary!=="string"||typeof r.exercise!=="string")return null;
 if(!subskillCatalog.Writing.every(key=>typeof r.scores[key]==="number"&&Number.isFinite(r.scores[key])&&r.scores[key]>=0&&r.scores[key]<=10))return null;
 if(![r.strengths,r.improvements,r.tags].every(a=>Array.isArray(a)&&a.every(s=>typeof s==="string")))return null;
 if(!Array.isArray(r.corrections)||r.corrections.some(c=>!c||typeof c.original!=="string"||!c.original||!text.includes(c.original)||![c.revised,c.why,c.tag].every(s=>typeof s==="string")))return null;
 return {level:r.level,scores:Object.fromEntries(subskillCatalog.Writing.map(k=>[k,r.scores[k]])),summary:r.summary,exercise:r.exercise,strengths:r.strengths.slice(0,3),improvements:r.improvements.slice(0,3),corrections:r.corrections.slice(0,3).map(c=>({original:c.original,revised:c.revised,why:c.why,tag:c.tag})),tags:r.tags.slice(0,10)};
}
