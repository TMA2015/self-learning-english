/**
 * R1 NON-PRODUCTION proof of content-addressed, lesson-scoped retention.
 * Does not read/write the browser, migrate learner data or replace Recovery V2.
 * See docs/storage/SLE_LESSON_REVISION_STORAGE_RFC_20261107.md.
 */
export type LessonRecord={
 id:string;
 activities:ReadonlyArray<{rubric_id?:string;[key:string]:unknown}>;
 [key:string]:unknown;
};
export type ReleaseRecord={
 id:string;
 version:string;
 digest:string;
 source:{
  lessons:LessonRecord[];
  rubrics:Record<string,unknown>;
  [key:string]:unknown;
 };
 archive?:'referenced-lessons';
};
export type SavedReference={version:string;lessonId:string;packageId?:string};
export type RevisionBlob={revision:string;lesson:LessonRecord;rubrics:Record<string,unknown>};
export type RevisionAlias={
 version:string;lessonId:string;revision:string;packageId:string;releaseDigest:string;
};
export type ActiveLessonManifest={
 version:string;packageId:string;releaseDigest:string;
 // The header is the current release's navigation/sequence/metadata.
 // Historical version headers are not duplicated for every old attempt.
 header:Record<string,unknown>;
 lessons:Array<{lessonId:string;revision:string}>;
};
export type LessonRevisionPlan={
 active:ActiveLessonManifest;
 blobs:RevisionBlob[];
 aliases:RevisionAlias[];
 inputVersions:number;
 protectedAttemptCount:number;
 uniqueProtectedSources:number;
};

function canonicalValue(value:unknown):unknown{
 if(value===null||typeof value==='string'||typeof value==='boolean')return value;
 if(typeof value==='number'){
  if(!Number.isFinite(value))throw Error('Non-finite lesson field: revision plan blocked.');
  return value;
 }
 if(Array.isArray(value))return value.map(canonicalValue);
 if(typeof value==='object'){
  if(Object.getPrototypeOf(value)!==Object.prototype&&Object.getPrototypeOf(value)!==null)
   throw Error('Non-JSON lesson data: revision plan blocked.');
  const result:Record<string,unknown>={};
  for(const key of Object.keys(value).sort()){
   const child=(value as Record<string,unknown>)[key];
   if(child===undefined)throw Error('Undefined lesson field: revision plan blocked.');
   result[key]=canonicalValue(child);
  }
  return result;
 }
 throw Error('Unsupported lesson field: revision plan blocked.');
}
export function canonicalLessonJSON(value:unknown):string{
 return JSON.stringify(canonicalValue(value));
}
async function sha256(value:string):Promise<string>{
 if(typeof crypto==='undefined'||!crypto.subtle)
  throw Error('SHA-256 is unavailable; revision plan blocked.');
 const hashed=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
 return Array.from(new Uint8Array(hashed),v=>v.toString(16).padStart(2,'0')).join('');
}
function versionParts(value:string):number[]{
 if(!/^\d+\.\d+\.\d+$/.test(value))throw Error('Invalid curriculum release version.');
 return value.split('.').map(Number);
}
function cmpVersion(a:string,b:string):number{
 const pa=versionParts(a),pb=versionParts(b);
 for(let i=0;i<3;i++)if(pa[i]!==pb[i])return pa[i]-pb[i];
 return 0;
}
function checkedLessons(p:ReleaseRecord):Map<string,LessonRecord>{
 if(!p||!p.version||!p.digest||!p.id||!p.source||
  !Array.isArray(p.source.lessons)||!p.source.lessons.length||
  !p.source.rubrics||typeof p.source.rubrics!=='object'||
  Array.isArray(p.source.rubrics))throw Error('Missing or invalid release source.');
 const found=new Map<string,LessonRecord>();
 for(const l of p.source.lessons){
  if(!l||typeof l.id!=='string'||!l.id||!Array.isArray(l.activities)||
   found.has(l.id))throw Error('Duplicate or malformed lesson ID: revision plan blocked.');
  found.set(l.id,l);
 }
 return found;
}
function referencedRubrics(p:ReleaseRecord,l:LessonRecord):Record<string,unknown>{
 const out:Record<string,unknown>={};
 for(const activity of l.activities){
  if(!activity||typeof activity!=='object')throw Error('Malformed lesson activity.');
  const id=activity.rubric_id;
  if(id===undefined||id===null)continue;
  if(typeof id!=='string'||!Object.hasOwn(p.source.rubrics,id))
   throw Error('Original referenced rubric is missing: revision plan blocked.');
  out[id]=p.source.rubrics[id];
 }
 return out;
}
/**
 * Inputs MUST already be authenticated/reconciled by the existing V2 source
 * union. This pure converter never edits old attempts and never writes storage.
 * It keeps every active lesson plus only old (version, lessonId) references
 * required by actual attempts; identical original lesson+rubric bodies share
 * a single SHA-256-addressed blob, irrespective of curriculum version.
 */
export async function planLessonRevisions(
 records:readonly ReleaseRecord[],
 attempts:readonly SavedReference[]
):Promise<LessonRevisionPlan>{
 if(!records.length)throw Error('No curriculum source; revision plan blocked.');
 const byVersion=new Map<string,{package:ReleaseRecord;lessons:Map<string,LessonRecord>}>();
 for(const p of records){
  versionParts(p.version);
  if(byVersion.has(p.version))throw Error('Duplicate curriculum release version.');
  byVersion.set(p.version,{package:p,lessons:checkedLessons(p)});
 }
 const latest=[...records].sort((a,b)=>cmpVersion(b.version,a.version))[0];
 if(latest.archive)throw Error('Current curriculum is incomplete; revision plan blocked.');
 const protectedRefs=new Map<string,SavedReference>();
 for(const a of attempts){
  if(!a||typeof a.version!=='string'||typeof a.lessonId!=='string')
   throw Error('Malformed historical attempt reference.');
  const source=byVersion.get(a.version);
  if(!source||!source.lessons.has(a.lessonId))
   throw Error('Original versioned lesson missing: revision plan blocked.');
  if(a.packageId!==undefined&&a.packageId!==source.package.id)
   throw Error('Original package ID mismatch: revision plan blocked.');
  protectedRefs.set(a.version+'|'+a.lessonId,a);
 }
 const blobs=new Map<string,{text:string;value:RevisionBlob}>();
 async function getRevision(p:ReleaseRecord,l:LessonRecord){
  const payload={lesson:l,rubrics:referencedRubrics(p,l)};
  const canonical=canonicalLessonJSON(payload);
  const revision=await sha256(canonical);
  const known=blobs.get(revision);
  if(known&&known.text!==canonical)
   throw Error('SHA-256 revision collision: revision plan blocked.');
  if(!known)blobs.set(revision,{text:canonical,value:{revision,...payload}});
  return revision;
 }
 const active=byVersion.get(latest.version)!;
 const current:Array<{lessonId:string;revision:string}>=[];
 for(const lesson of latest.source.lessons)
  current.push({lessonId:lesson.id,revision:await getRevision(latest,lesson)});
 const aliases:RevisionAlias[]=[];
 for(const a of [...protectedRefs.values()].sort((x,y)=>
  (x.version+'|'+x.lessonId).localeCompare(y.version+'|'+y.lessonId))){
  const p=byVersion.get(a.version)!.package;
  const lesson=byVersion.get(a.version)!.lessons.get(a.lessonId)!;
  aliases.push({version:a.version,lessonId:a.lessonId,
   revision:await getRevision(p,lesson),packageId:p.id,releaseDigest:p.digest});
 }
 const {lessons:_lessonBodies,rubrics:_allRubrics,...header}=latest.source;
 return {
  active:{version:latest.version,packageId:latest.id,releaseDigest:latest.digest,
   header,lessons:current},
  blobs:[...blobs.values()].map(x=>x.value),
  aliases,
  inputVersions:records.length,
  protectedAttemptCount:attempts.length,
  uniqueProtectedSources:protectedRefs.size,
 };
}
