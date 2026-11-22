/**
 * Listening Dictation — after-submission, unscored practice only.
 * Pass in ONLY an authorized, already-revealed transcript from the existing
 * gated attempt transcript API. Never import transcript strings into a bundle.
 */
export type DictationDensity=10|20|30;
export type DictationPart={kind:'text';text:string}|{kind:'gap';id:string};
export type DictationLine={id:string;parts:DictationPart[];displayText:string};
export type DictationGap={id:string;answer:string;lineId:string;ordinal:number};
export type DictationSheet={lines:DictationLine[];gaps:DictationGap[];spokenWords:number;density:DictationDensity};
export type VerifiedSentenceSegment={lineId:string;startMs:number;endMs:number;assetSha256:string};

const stopwords=new Set(['that','this','with','from','have','were','been','they','them',
 'your','their','there','then','than','into','about','could','would','should','which','where',
 'when','what','will','because','these','those','some','also','only','just','really']);
const words=/[A-Za-z]+(?:['’\-][A-Za-z]+)*/g;

export function splitDictationLines(source:string):string[]{
 if(typeof source!=='string'||!source.trim())return [];
 // Newline boundaries take priority for speaker-labeled conversations.
 // One-line legacy scripts are split on sentence punctuation for display only;
 // these boundaries NEVER authorize independent audio seeking.
 const lines=source.replace(/\r\n?/g,'\n').trim().split(/\n+/).flatMap(raw=>
  raw.trim().split(/(?<=[!?])\s+(?=[A-Z“"'])|(?<=\.)\s+(?=[A-Z“"'])(?![a-z])/)
   .map(s=>s.trim()).filter(Boolean));
 return lines.slice(0,240);
}
function stableRank(value:string):number{
 let n=2166136261;
 for(let i=0;i<value.length;i++){n^=value.charCodeAt(i);n=Math.imul(n,16777619)}
 return n>>>0;
}
export function buildDictationSheet(source:string,density:DictationDensity):DictationSheet{
 if(![10,20,30].includes(density))throw Error('Unsupported dictation density');
 const raw=splitDictationLines(source);
 const candidates:{line:number;start:number;end:number;answer:string;global:number}[]=[];
 const all=raw.map((line,lineIndex)=>{
  const speakerEnd=line.match(/^[\p{L}][\p{L} .'-]{0,22}:\s/u)?.[0].length??0;
  const found=[...line.matchAll(words)].map(m=>({
   line:lineIndex,start:m.index??0,end:(m.index??0)+m[0].length,answer:m[0],global:0,
   eligible:(m.index??0)>=speakerEnd&&m[0].length>=4&&!stopwords.has(m[0].toLowerCase())
  }));
  return found;
 });
 let spokenWords=0;
 for(const line of all)for(const token of line){
  if(token.eligible)candidates.push({...token,global:spokenWords});
  spokenWords++;
 }
 const total=Math.min(candidates.length,Math.max(1,Math.round(spokenWords*density/100)));
 const sorted=[...candidates].sort((a,b)=>
  stableRank(source.length+'|'+a.line+'|'+a.start+'|'+a.answer)-
  stableRank(source.length+'|'+b.line+'|'+b.start+'|'+b.answer));
 const selected=new Map<string,typeof candidates[number]>();
 for(const c of sorted){
  if(selected.size>=total)break;
  const near=[...selected.values()].some(a=>a.line===c.line&&Math.abs(a.start-c.start)<14);
  if(!near)selected.set(c.line+':'+c.start,c);
 }
 if(selected.size<total)for(const c of sorted){
  if(selected.size>=total)break;
  selected.set(c.line+':'+c.start,c);
 }
 const gaps:DictationGap[]=[];
 const lines=raw.map((displayText,i)=>{
  const picks=[...selected.values()].filter(c=>c.line===i).sort((a,b)=>a.start-b.start);
  const parts:DictationPart[]=[];
  let cursor=0;
  for(const p of picks){
   if(p.start>cursor)parts.push({kind:'text',text:displayText.slice(cursor,p.start)});
   const id='L'+(i+1)+'-G'+(gaps.length+1);
   parts.push({kind:'gap',id});
   gaps.push({id,answer:p.answer,lineId:'L'+(i+1),ordinal:gaps.length+1});
   cursor=p.end;
  }
  if(cursor<displayText.length)parts.push({kind:'text',text:displayText.slice(cursor)});
  return {id:'L'+(i+1),parts,displayText};
 });
 return {lines,gaps,spokenWords,density};
}
/** Literal orthographic answer check; no semantic, accent or CEFR quality judgement. */
export function normalizeDictationAnswer(value:string):string{
 return value.trim().toLowerCase().replace(/[‘’]/g,"'").replace(/^[\s.,!?;:]+|[\s.,!?;:]+$/g,'');
}
export function checkDictationAnswers(sheet:DictationSheet,answers:Readonly<Record<string,string>>){
 return sheet.gaps.map(g=>({id:g.id,correct:normalizeDictationAnswer(answers[g.id]??'')===
  normalizeDictationAnswer(g.answer),expected:g.answer}));
}
/** Segment replay requires times from the EXACT MP3. No inferred timestamps. */
export function validVerifiedSegments(lines:readonly DictationLine[],segments:readonly VerifiedSentenceSegment[]|undefined,
 assetSha256:string|undefined,durationSeconds:number|undefined):boolean{
 if(!segments?.length||!assetSha256||!Number.isFinite(durationSeconds)||!durationSeconds)return false;
 if(segments.length!==lines.length)return false;
 let previousEnd=0;
 for(let i=0;i<segments.length;i++){
  const s=segments[i];
  if(s.lineId!==lines[i].id||s.assetSha256!==assetSha256||
   !Number.isFinite(s.startMs)||!Number.isFinite(s.endMs)||
   s.startMs<previousEnd||s.startMs<0||s.endMs<=s.startMs||
   s.endMs>(durationSeconds as number)*1000+150)return false;
  previousEnd=s.endMs;
 }
 return true;
}
