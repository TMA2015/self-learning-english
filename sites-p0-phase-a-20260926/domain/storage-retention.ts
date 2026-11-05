import {compareVersions,type AcademicAttempt,type AcademicPackage} from './academic';

/**
 * Content retention V2 is a local browser optimization, not a CEFR assessment.
 * Only the latest complete package is kept. Earlier versions preserve each
 * lesson referenced by a real attempt, including its question keys, rubric,
 * audio source and authored explanation. Attempt objects are NEVER rewritten.
 */
export type StoredAcademicPackage=Omit<AcademicPackage,'bundle'>&{archive?:'referenced-lessons'};
export type AcademicPackageDocumentV2={
 schema:2;retention:true;records:StoredAcademicPackage[];
};
export type RetentionSnapshot={
 activeVersion:string;beforeVersions:string[];retainedVersions:string[];
 protectedLessonCount:number;discardedUnreferencedVersions:number;
 estimatedBeforeBytes:number;estimatedAfterBytes:number;
 records:StoredAcademicPackage[];
};
export function stripBundle(packageValue:AcademicPackage|StoredAcademicPackage):StoredAcademicPackage{
 const {bundle:_derived,...row}=packageValue as AcademicPackage;
 return JSON.parse(JSON.stringify(row)) as StoredAcademicPackage;
}
export function decodePackageDocument(raw:unknown):{retention:boolean;records:StoredAcademicPackage[]}{
 if(Array.isArray(raw))return {retention:false,records:raw as StoredAcademicPackage[]};
 if(raw&&typeof raw==='object'&&(raw as AcademicPackageDocumentV2).schema===2
    &&(raw as AcademicPackageDocumentV2).retention===true
    &&Array.isArray((raw as AcademicPackageDocumentV2).records))
   return {retention:true,records:(raw as AcademicPackageDocumentV2).records};
 throw new Error('Unknown local curriculum storage format. Do not clear browser data.');
}
export function retainReferencedLessons(
 packages:readonly StoredAcademicPackage[],
 attempts:readonly Pick<AcademicAttempt,'version'|'lessonId'>[]
):RetentionSnapshot{
 if(!packages.length)throw new Error('Cannot compact missing curriculum content.');
 const latest=[...packages].sort((a,b)=>compareVersions(b.version,a.version))[0];
 const byVersion=new Map<string,StoredAcademicPackage>();
 for(const row of packages){
  if(!row||typeof row.version!=='string'||!Array.isArray(row.source?.lessons)
    ||typeof row.digest!=='string')throw new Error('Invalid stored curriculum; compaction blocked.');
  if(byVersion.has(row.version))throw new Error('Duplicate stored curriculum version; compaction blocked.');
  byVersion.set(row.version,row);
 }
 const protectedLessons=new Map<string,Set<string>>();
 for(const a of attempts){
  const source=byVersion.get(a.version);
  if(!source||!source.source.lessons.some(l=>l.id===a.lessonId))
   throw new Error('A saved attempt has missing original lesson content. Compaction blocked; do not reset learner data.');
  let ids=protectedLessons.get(a.version);
  if(!ids){ids=new Set();protectedLessons.set(a.version,ids)}
  ids.add(a.lessonId);
 }
 const selected:StoredAcademicPackage[]=[];
 for(const row of [...packages].sort((a,b)=>compareVersions(a.version,b.version))){
  if(row.version===latest.version){
   if(row.archive)throw new Error('Latest curriculum was archived; cannot compact an incomplete active package.');
   selected.push(stripBundle(row));continue;
  }
  const ids=protectedLessons.get(row.version);
  if(!ids?.size)continue;
  const archivedLessons=row.source.lessons.filter(l=>ids.has(l.id));
  if(archivedLessons.length!==ids.size)throw new Error('Missing protected lesson while compacting.');
  selected.push({...stripBundle(row),
   source:{...row.source,lessons:JSON.parse(JSON.stringify(archivedLessons))},
   archive:'referenced-lessons'});
 }
 const beforeVersions=packages.map(p=>p.version);
 return {
  activeVersion:latest.version,beforeVersions,retainedVersions:selected.map(p=>p.version),
  protectedLessonCount:[...protectedLessons.values()].reduce((n,ids)=>n+ids.size,0),
  discardedUnreferencedVersions:beforeVersions.length-selected.length,
  estimatedBeforeBytes:JSON.stringify(packages).length*2,
  estimatedAfterBytes:JSON.stringify({schema:2,retention:true,records:selected}).length*2,
  records:selected
 };
}
