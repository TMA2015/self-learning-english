import {compareVersions,type AcademicAttempt} from './academic';
import type {StoredAcademicPackage} from './storage-retention';

/**
 * Phase-S3 pure source reconciliation for a future mixed localStorage/IDB
 * complete Recovery export. This DOES NOT export/restore any real device data.
 * Failure must never silently omit a previously graded source version.
 */
function valid(row:StoredAcademicPackage){
 return !!row&&typeof row.version==='string'&&!!row.version
  &&typeof row.digest==='string'&&!!row.digest
  &&typeof row.id==='string'&&Array.isArray(row.source?.lessons)
  &&!!row.source.course?.id;
}
function equal(a:unknown,b:unknown){return JSON.stringify(a)===JSON.stringify(b)}
function header(row:StoredAcademicPackage){
 const {lessons:_lessons,...rest}=row.source;
 return rest;
}
function compatible(a:StoredAcademicPackage,b:StoredAcademicPackage){
 if(a.id!==b.id||a.digest!==b.digest||!equal(header(a),header(b)))return false;
 const aLessons=new Map(a.source.lessons.map(l=>[l.id,l]));
 const bLessons=new Map(b.source.lessons.map(l=>[l.id,l]));
 for(const [id,lesson] of aLessons){
  if(bLessons.has(id)&&!equal(lesson,bLessons.get(id)))return false;
 }
 // Two complete packages with identical version/digest must be identical.
 if(!a.archive&&!b.archive)return equal(a.source,b.source);
 // A subset archive must be an authentic subset of a complete source.
 if(!a.archive&&b.archive)
  return [...bLessons.keys()].every(id=>aLessons.has(id));
 if(a.archive&&!b.archive)
  return [...aLessons.keys()].every(id=>bLessons.has(id));
 return true; // Two disjoint authentic referenced subsets may be combined.
}
function combine(a:StoredAcademicPackage,b:StoredAcademicPackage):StoredAcademicPackage{
 if(!compatible(a,b))
  throw Error('Recovery source conflict: immutable version content differs; export blocked.');
 if(!a.archive)return a;
 if(!b.archive)return b;
 const seen=new Map(a.source.lessons.map(l=>[l.id,l]));
 for(const lesson of b.source.lessons)seen.set(lesson.id,lesson);
 return {...a,source:{...a.source,lessons:[...seen.values()].sort((x,y)=>x.id.localeCompare(y.id))},
  archive:'referenced-lessons'};
}
export function reconcileRecoverySources(
 localSources:readonly StoredAcademicPackage[],
 vaultSources:readonly StoredAcademicPackage[],
 attempts:readonly Pick<AcademicAttempt,'version'|'lessonId'>[]
){
 const versions=new Map<string,StoredAcademicPackage>();
 for(const row of [...localSources,...vaultSources]){
  if(!valid(row))throw Error('Recovery contains invalid versioned content; export blocked.');
  const previous=versions.get(row.version);
  versions.set(row.version,previous?combine(previous,row):row);
 }
 if(!versions.size)throw Error('Complete Recovery requires curriculum source data.');
 const protectedLessons=new Set<string>();
 for(const attempt of attempts){
  const row=versions.get(attempt.version);
  if(!row||!row.source.lessons.some(l=>l.id===attempt.lessonId))
   throw Error('A saved attempt has missing original lesson source; export blocked.');
  protectedLessons.add(attempt.version+'|'+attempt.lessonId);
 }
 const records=[...versions.values()].sort((a,b)=>compareVersions(a.version,b.version));
 return {records,versions:records.length,attempts:attempts.length,
  protectedLessons:protectedLessons.size,
  portablePackageDocument:{schema:2 as const,retention:true as const,records}};
}
