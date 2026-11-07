import {derivePracticeProgress} from './practice-progress';
import type {AcademicAttempt,AcademicPackage} from './academic';
import type {WritingSubmission,WritingEvaluation} from './writing';
import type {
 ActiveLessonManifest,RevisionAlias,RevisionBlob
} from './lesson-revision-plan';

type Snapshot={
 active:ActiveLessonManifest|null;aliases:RevisionAlias[];blobs:RevisionBlob[];
};
type LessonStatus={
 lessonId:string;title:string;attempts:number;started:number;submitted:number;
 correct:number;total:number;distinctRevisions:number;lastVersion:string;
 lastAt:number;
};
const SEP='\u001f';
const aliasKey=(version:string,lessonId:string)=>version+SEP+lessonId;
function fail(message:string):never{
 throw Error('Normalized practice progress requires original source: '+message+
  '. Existing scores and learner data were not changed.');
}
/** Minimal ephemeral metadata only; no original answer keys or full release copies. */
function lite(lesson:RevisionBlob['lesson']){
 if(!lesson||typeof lesson.id!=='string'||typeof lesson.title!=='string'||
  typeof lesson.module!=='string'||!Array.isArray(lesson.activities)||
  lesson.activities.some(q=>!q||typeof q.id!=='string'||
   !Array.isArray(q.skill_tags)))
  fail('Invalid lesson metadata');
 return {
  id:lesson.id,title:lesson.title,module:lesson.module,
  activities:lesson.activities.map(q=>({id:q.id,skill_tags:q.skill_tags}))
 };
}
/**
 * R5b read-only projection for history grouped by stable Lesson ID, keeping
 * each immutable original revision distinct for question/repeated-mistake IDs.
 * This accepts a VERIFIED normalized vault.snapshot(); it never reads or
 * writes browser storage. No CEFR inference and no automatic regrading.
 */
export function deriveRevisionPracticeProgress(
 attempts:AcademicAttempt[],snapshot:Snapshot,
 submissions:WritingSubmission[]=[],evaluations:WritingEvaluation[]=[]
){
 if(!snapshot?.active)fail('Missing active content manifest');
 const active=snapshot.active;
 const byHash=new Map<string,RevisionBlob>();
 for(const b of snapshot.blobs){
  if(!b||!/^[a-f0-9]{64}$/.test(b.revision)||byHash.has(b.revision))
   fail('Malformed or duplicate content revision');
  byHash.set(b.revision,b);
 }
 const aliasByKey=new Map<string,RevisionAlias>();
 for(const a of snapshot.aliases){
  const k=aliasKey(a.version,a.lessonId);
  if(!a.version||!a.lessonId||!a.packageId||aliasByKey.has(k)||
   byHash.get(a.revision)?.lesson.id!==a.lessonId)
   fail('Invalid historical version/lesson alias');
  aliasByKey.set(k,a);
 }
 const currentRevision=new Map<string,string>();
 const latestById=new Map<string,ReturnType<typeof lite>>();
 for(const x of active.lessons){
  const b=byHash.get(x.revision);
  if(!b||b.lesson.id!==x.lessonId||latestById.has(x.lessonId))
   fail('Latest lesson metadata is missing or duplicated');
  currentRevision.set(x.lessonId,x.revision);
  latestById.set(x.lessonId,lite(b.lesson));
 }
 const historicPackages=new Map<string,{
  id:string;version:string;at:number;source:{lessons:ReturnType<typeof lite>[]}
 }>();
 const lessonBuckets=new Map<string,LessonStatus&{revisions:Set<string>}>();
 const getAlias=(a:AcademicAttempt)=>{
  if(!a||!a.version||!a.lessonId||!a.packageId)fail('Malformed learner attempt');
  const pin=aliasByKey.get(aliasKey(a.version,a.lessonId));
  if(!pin||pin.packageId!==a.packageId||
   byHash.get(pin.revision)?.lesson.id!==a.lessonId)
   fail('Saved attempt has no exact original revision');
  return pin;
 };
 for(const a of attempts){
  const pin=getAlias(a);
  if(a.version===active.version&&a.packageId===active.packageId&&
   currentRevision.get(a.lessonId)!==pin.revision)
   fail('Active saved attempt conflicts with current content');
  const b=byHash.get(pin.revision)!;
  const meta=lite(b.lesson);
  const groupId=a.packageId+SEP+a.version;
  let pkg=historicPackages.get(groupId);
  if(!pkg){
   pkg={id:a.packageId,version:a.version,at:0,source:{lessons:[]}};
   historicPackages.set(groupId,pkg);
  }
  if(!pkg.source.lessons.some(x=>x.id===a.lessonId))pkg.source.lessons.push(meta);
  let bucket=lessonBuckets.get(a.lessonId);
  if(!bucket){
   bucket={lessonId:a.lessonId,title:latestById.get(a.lessonId)?.title??meta.title,
    attempts:0,started:0,submitted:0,correct:0,total:0,
    distinctRevisions:0,lastVersion:a.version,lastAt:0,revisions:new Set<string>()};
   lessonBuckets.set(a.lessonId,bucket);
  }
  bucket.attempts++;
  bucket.revisions.add(pin.revision);
  if(a.status==='started')bucket.started++;
  else bucket.submitted++;
  for(const r of a.results??[]){
   if(typeof r.correct==='boolean'){bucket.total++;bucket.correct+=Number(r.correct)}
  }
  const when=a.submittedAt??a.createdAt;
  if(when>=bucket.lastAt){bucket.lastAt=when;bucket.lastVersion=a.version}
 }
 const currentPackage={
  id:active.packageId,version:active.version,at:1,
  source:{lessons:[...latestById.values()]}
 };
 // Only a compact in-memory metadata projection is constructed; the actual
 // old full-source content never leaves its content-addressed IDB blobs.
 const compact=[...historicPackages.values()].filter(x=>
  x.version!==active.version||x.id!==active.packageId).map(x=>x as unknown as AcademicPackage);
 compact.push(currentPackage as unknown as AcademicPackage);
 const metric=derivePracticeProgress(attempts,compact,submissions,evaluations,
  (a,qid)=>{
   const pin=getAlias(a);
   return a.lessonId+SEP+pin.revision+SEP+qid;
  });
 const lessonProgress=[...lessonBuckets.values()].map(({revisions,...row})=>({
  ...row,distinctRevisions:revisions.size
 })).sort((a,b)=>a.lessonId.localeCompare(b.lessonId));
 return {
  ...metric,
  scope:'Saved Foundation objective answers across attempts and immutable lesson revisions',
  lessonProgress
 };
}
