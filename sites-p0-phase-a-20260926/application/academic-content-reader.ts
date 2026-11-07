import {
 AcademicError,compareVersions,
 type AcademicRepository,type Seed,type SeedLesson
} from '../domain/academic';
import type {BrowserLessonRevisionVault} from '../infrastructure/storage/indexeddb-lesson-revision-vault';
import type {ActiveLessonManifest,RevisionBlob} from '../domain/lesson-revision-plan';

/**
 * R5a read-only lesson-scoped API. The legacy implementation is intentionally
 * the unchanged production default. The normalized adapter is TEST-ONLY until
 * portable Recovery, source authenticity and Safari acceptance are approved.
 */
export type LessonSource={
 packageId:string;version:string;lesson:SeedLesson;rubrics:Seed['rubrics'];
};
export type CatalogLesson={
 id:string;title:string;module:SeedLesson['module'];
 cefr_target:SeedLesson['cefr_target'];
 estimated_minutes:SeedLesson['estimated_minutes'];
};
export type CatalogSource={
 packageId:string;version:string;course:Seed['course'];
 journey:Seed['integrated_journey'];lessons:CatalogLesson[];
};
export interface AcademicContentReader {
 catalog():Promise<CatalogSource|null>;
 current(lessonId:string):Promise<LessonSource>;
 original(version:string,lessonId:string,packageId?:string):Promise<LessonSource>;
 pinCurrentForAttempt(version:string,lessonId:string):Promise<void>;
}

/** Legacy production behavior, exposed behind the same targeted contract. */
export function legacyAcademicContentReader(repo:AcademicRepository):AcademicContentReader{
 async function pick(version?:string){
  const rows=await repo.packages();
  const match=version?rows.find(p=>p.version===version):
   rows.sort((a,b)=>compareVersions(b.version,a.version))[0];
  if(!match)throw new AcademicError('Content version not found.',404);
  return match;
 }
 function lessonOf(p:Awaited<ReturnType<typeof pick>>,id:string):LessonSource{
  const lesson=p.source.lessons.find(l=>l.id===id);
  if(!lesson)throw new AcademicError('Lesson not found.',404);
  return {packageId:p.id,version:p.version,lesson,rubrics:p.source.rubrics};
 }
 return {
  async catalog(){
   const rows=await repo.packages();
   const p=rows.sort((a,b)=>compareVersions(b.version,a.version))[0];
   return p?{packageId:p.id,version:p.version,
    course:p.source.course,journey:p.source.integrated_journey,
    lessons:p.source.lessons.map(l=>({
     id:l.id,title:l.title,module:l.module,
     cefr_target:l.cefr_target,estimated_minutes:l.estimated_minutes
    }))}:null;
  },
  async current(id){return lessonOf(await pick(),id)},
  async original(version,id,expectedPackageId){
   const p=await pick(version);
   if(expectedPackageId!==undefined&&p.id!==expectedPackageId)
    throw new AcademicError('Original content package ID conflict.',409);
   return lessonOf(p,id);
  },
  async pinCurrentForAttempt(){/* existing packages are already retained */},
 };
}

type Vault=Pick<BrowserLessonRevisionVault,
 'manifest'|'snapshot'|'resolveCurrent'|'resolveHistoric'|
 'historicAlias'|'pinCurrentForAttempt'>;
function strictHeader(m:ActiveLessonManifest){
 const header=m.header as Partial<Seed>;
 if(!header||header.package_id!==m.packageId||
  header.schema_version!==m.version||
  !header.course||!Array.isArray(header.course.sequence)||
  !header.integrated_journey)
  throw new AcademicError('Normalized curriculum manifest is incomplete.',409);
 const manifestIds=new Set(m.lessons.map(x=>x.lessonId));
 if(header.course.sequence.length!==m.lessons.length||
  manifestIds.size!==m.lessons.length||
  new Set(header.course.sequence).size!==manifestIds.size||
  header.course.sequence.some(id=>!manifestIds.has(id)))
  throw new AcademicError('Normalized manifest and approved course sequence disagree.',409);
 return {course:header.course,journey:header.integrated_journey};
}
function strictLesson(b:RevisionBlob,id:string):SeedLesson{
 const lesson=b?.lesson as SeedLesson|undefined;
 if(!lesson||lesson.id!==id||
  !Array.isArray(lesson.activities)||!lesson.activities.length||
  lesson.activities.some(q=>typeof q.id!=='string'||
   typeof q.prompt!=='string'||!q.feedback||
   !Array.isArray(q.skill_tags))||
  typeof lesson.title!=='string'||typeof lesson.module!=='string'||
  typeof lesson.cefr_target!=='string'||
  typeof lesson.estimated_minutes!=='number')
  throw new AcademicError('Original normalized lesson is incomplete.',409);
 return lesson;
}
function sourceOf(blob:RevisionBlob,packageId:string,version:string,id:string):LessonSource{
 const l=strictLesson(blob,id);
 return {packageId,version,lesson:l,rubrics:blob.rubrics as Seed['rubrics']};
}

/**
 * Do NOT enable in the learner runtime yet. Only exact original pinned
 * versions are valid for an existing attempt; an unpinned explicit version
 * is permitted solely to preview a lesson in the current catalog.
 */
export function normalizedAcademicContentReader(vault:Vault):AcademicContentReader{
 return {
  async catalog(){
   const snap=await vault.snapshot();
   const m=snap.active;
   if(!m)return null;
   const header=strictHeader(m);
   const available=new Map(snap.blobs.map(x=>[x.revision,x]));
   const lessons=m.lessons.map(({lessonId,revision})=>{
    const blob=available.get(revision);
    if(!blob)throw new AcademicError('Current lesson revision is missing.',409);
    const l=strictLesson(blob,lessonId);
    return {id:l.id,title:l.title,module:l.module,
     cefr_target:l.cefr_target,estimated_minutes:l.estimated_minutes};
   });
   return {packageId:m.packageId,version:m.version,...header,lessons};
  },
  async current(id){
   const before=await vault.manifest();
   if(!before)throw new AcademicError('Current curriculum manifest is missing.',404);
   strictHeader(before);
   const chosen=before.lessons.find(x=>x.lessonId===id);
   if(!chosen)throw new AcademicError('Current lesson not found.',404);
   const blob=await vault.resolveCurrent(id);
   const after=await vault.manifest();
   if(!after||before.version!==after.version||
    before.releaseDigest!==after.releaseDigest||
    blob.revision!==chosen.revision)
    throw new AcademicError('Curriculum changed during lesson read; retry.',409);
   return sourceOf(blob,before.packageId,before.version,id);
  },
  async original(version,id,expectedPackageId){
   const a=await vault.historicAlias(version,id);
   if(!a){
    // Explicit current catalog preview, not permission to grade an unpinned
    // attempt. Every saved attempt MUST have an original immutable alias.
    if(expectedPackageId===undefined){
     const current=await vault.manifest();
     if(current?.version===version)return this.current(id);
    }
    throw new AcademicError('Original attempted lesson revision is missing.',409);
   }
   if(expectedPackageId!==undefined&&a.packageId!==expectedPackageId)
    throw new AcademicError('Original attempted package ID mismatch.',409);
   const blob=await vault.resolveHistoric(version,id);
   if(blob.revision!==a.revision)
    throw new AcademicError('Original attempted revision changed.',409);
   return sourceOf(blob,a.packageId,a.version,id);
  },
  async pinCurrentForAttempt(version,id){
   await vault.pinCurrentForAttempt(version,id);
  },
 };
}
