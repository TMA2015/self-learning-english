'use strict';
/**
 * Issue #103 / R0: deterministic read-only inventory of public curriculum sources.
 * NEVER load a private Recovery file, browser storage, Firebase, or real attempts.
 * Numbers are JSON/UTF-16 serialization estimates, NOT Safari quota measurements.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const files=['1.23.0','1.24.0','1.25.0'].map(version=>({
 version,path:path.join(root,'content','curriculum-'+version+'-candidate.json')
}));
const hash=text=>crypto.createHash('sha256').update(text).digest('hex');
function canonical(value){
 if(value===null||typeof value==='string'||typeof value==='boolean')return value;
 if(typeof value==='number'){
  if(!Number.isFinite(value))throw Error('Non-finite numeric field');return value;
 }
 if(Array.isArray(value))return value.map(canonical);
 if(value&&typeof value==='object'&&(Object.getPrototypeOf(value)===Object.prototype
   ||Object.getPrototypeOf(value)===null)){
  return Object.fromEntries(Object.keys(value).sort().map(k=>{
   if(value[k]===undefined)throw Error('Undefined field '+k);
   return [k,canonical(value[k])];
  }));
 }
 throw Error('Unserializable lesson field');
}
const stable=value=>JSON.stringify(canonical(value));
const utf16=value=>2*JSON.stringify(value).length;
function requireSource(item){
 const source=JSON.parse(fs.readFileSync(item.path,'utf8'));
 if(source.schema_version!==item.version||!source.package_id||!Array.isArray(source.lessons)
   ||!source.lessons.length||!source.rubrics||!Array.isArray(source.course?.sequence))
  throw Error('Invalid public release source '+item.version);
 const seen=new Set();
 for(const lesson of source.lessons){
  if(!lesson?.id||seen.has(lesson.id)||!Array.isArray(lesson.activities))
   throw Error('Missing/duplicate lesson '+item.version);
  seen.add(lesson.id);
 }
 return {version:item.version,source,id:source.package_id,
  digest:hash(stable(source)),lessons:new Map(source.lessons.map(l=>[l.id,l]))};
}
function revisionFor(release,lesson){
 const rubrics={};
 for(const q of lesson.activities){
  if(!q||typeof q!=='object')throw Error('Invalid question in '+lesson.id);
  if(q.rubric_id!==undefined&&q.rubric_id!==null){
   if(typeof q.rubric_id!=='string'||!Object.hasOwn(release.source.rubrics,q.rubric_id))
    throw Error('Missing rubric '+q.rubric_id+' for '+lesson.id);
   rubrics[q.rubric_id]=release.source.rubrics[q.rubric_id];
  }
 }
 const value={lesson,rubrics},text=stable(value);
 return {revision:hash(text),value,text};
}
function buildPublicInventory(){
 const releases=files.map(requireSource),latest=releases.at(-1);
 const common=['GRA-A1-01','LIS-A1-03','WRI-A1-05','VOC-A2-03','REA-A2-08'];
 for(const release of releases)for(const id of common)
  if(!release.lessons.has(id))throw Error('Synthetic fixture missing '+id+' in '+release.version);

 // Counts and provenance refer only to synthetic attempt identities.
 const attempts=Array.from({length:73},(_,i)=>{
  const p=releases[i%releases.length],lessonId=common[i%common.length];
  const scored=i<52;
  return {id:'synthetic-r0-'+String(i+1).padStart(3,'0'),
   rootId:'synthetic-r0-'+String(i+1).padStart(3,'0'),
   packageId:p.id,version:p.version,lessonId,
   status:scored?'scored':'started',answers:{},evidence:[],
   createdAt:1700000000000+i,
   ...(scored?{submittedAt:1700000001000+i,results:[]}:{})};
 });
 const attemptBefore=JSON.stringify(attempts);
 const pairs=new Map();
 for(const a of attempts){
  const key=a.version+'|'+a.lessonId;
  if(!pairs.has(key))pairs.set(key,a);
 }
 const fullBodies=releases.flatMap(p=>p.source.lessons.map(l=>({
  version:p.version,lessonId:l.id,...revisionFor(p,l)
 })));
 const allHashes=new Set(fullBodies.map(x=>x.revision));
 const blobs=new Map();
 function include(release,lesson){
  const r=revisionFor(release,lesson),same=blobs.get(r.revision);
  if(same&&same.text!==r.text)throw Error('Revision hash collision');
  if(!same)blobs.set(r.revision,r);
  return r.revision;
 }
 const activeLessons=latest.source.lessons.map(l=>({lessonId:l.id,revision:include(latest,l)}));
 const aliases=[...pairs.values()].map(a=>{
  const p=releases.find(x=>x.version===a.version);
  if(!p||a.packageId!==p.id)throw Error('Synthetic historical provenance mismatch');
  const lesson=p.lessons.get(a.lessonId);
  if(!lesson)throw Error('Missing original historical lesson');
  return {version:a.version,lessonId:a.lessonId,packageId:p.id,
   releaseDigest:p.digest,revision:include(p,lesson)};
 }).sort((a,b)=>(a.version+'|'+a.lessonId).localeCompare(b.version+'|'+b.lessonId));
 const {lessons:_lessons,rubrics:_rubrics,...header}=latest.source;
 const normalized={active:{version:latest.version,packageId:latest.id,
  releaseDigest:latest.digest,header,lessons:activeLessons},
  blobs:[...blobs.values()].map(r=>({revision:r.revision,...r.value})),aliases};
 const selected=releases.map(p=>{
  if(p.version===latest.version)
   return {id:p.id,version:p.version,digest:p.digest,source:p.source,at:1};
  const protectedIds=new Set([...pairs.values()].filter(a=>a.version===p.version).map(a=>a.lessonId));
  return {id:p.id,version:p.version,digest:p.digest,
   source:{...p.source,lessons:p.source.lessons.filter(l=>protectedIds.has(l.id))},
   archive:'referenced-lessons',at:1};
 });
 const allVersions=releases.map(p=>({id:p.id,version:p.version,digest:p.digest,
  source:p.source,at:1}));
 const sizes={
  threeFullReleasePackagesUtf16:utf16(allVersions),
  v2ReferenceRetentionUtf16:utf16({schema:2,retention:true,records:selected}),
  normalizedRevisionPayloadUtf16:utf16(normalized),
 };
 if(JSON.stringify(attempts)!==attemptBefore)
  throw Error('Attempt fixture unexpectedly changed');
 return {
  gate:'SLE_ISSUE103_R0_PUBLIC_SOURCE_INVENTORY',
  inputVersions:releases.map(p=>p.version),
  lessonCopiesByVersion:releases.map(p=>({version:p.version,count:p.source.lessons.length})),
  totalLessonCopies:fullBodies.length,
  distinctLessonIds:new Set(fullBodies.map(x=>x.lessonId)).size,
  distinctRevisionHashesAcrossAllReleases:allHashes.size,
  repeatedIdenticalRevisionCopies:fullBodies.length-allHashes.size,
  activeLessonCount:activeLessons.length,
  syntheticAttemptCount:attempts.length,
  syntheticScored:attempts.filter(a=>a.status==='scored').length,
  syntheticDrafts:attempts.filter(a=>a.status==='started').length,
  distinctProtectedVersionLessonPairs:pairs.size,
  normalizedStoredRevisionBlobs:blobs.size,
  normalizedAliasCount:aliases.length,
  sizes,
  potentialPayloadSavingsVsThreeFullUtf16:
    sizes.threeFullReleasePackagesUtf16-sizes.normalizedRevisionPayloadUtf16,
  potentialPayloadSavingsVsV2Utf16:
    sizes.v2ReferenceRetentionUtf16-sizes.normalizedRevisionPayloadUtf16,
  estimateMethod:'2 x JSON.stringify(string).length; excludes browser/IDB metadata, IndexedDB overhead, eviction, localStorage user keys and actual iPad quota',
  publicCurriculumOnly:true,privateRecovery:'NOT_ACCESSED',
  audioBinaryDigests:'NOT_VERIFIED',
  activeRuntimeChange:false,learnerDataChanged:false,
  liveSiteTouched:false,deploy:false
 };
}
if(require.main===module){
 try{console.log(JSON.stringify(buildPublicInventory()));}
 catch(error){console.error(error);process.exitCode=1;}
}
module.exports={buildPublicInventory,stable,revisionFor,files};
