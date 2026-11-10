import {verifyLocalRecoveryV2} from './local-recovery';
import {decodePackageDocument} from '../../domain/storage-retention';
import {planLessonRevisions,type ReleaseRecord,type SavedReference} from '../../domain/lesson-revision-plan';
import {createRevisionRecoveryV3,verifyRevisionRecoveryV3,type LearnerEntry} from '../../domain/lesson-revision-recovery-v3';

/**
 * R4a PURE, non-production translation from a previously downloaded original
 * V2 complete Recovery to normalized V3. Never writes/clears real browser data.
 * The original V2 file remains the authoritative source until later acceptance.
 */
const PACKAGE_KEY='g-learning:english:v1:academic:packages';
type V2File={format:'g-learning-english.recovery';schemaVersion:2;
 exportedAt:string;entries:LearnerEntry[];sha256:string};
function blocked(reason:string):never{
 throw Error('V2-to-V3 conversion blocked: '+reason+
  '. The original V2 file remains unchanged.');
}
export async function convertVerifiedV2ToRevisionV3(text:string):Promise<{
 text:string;originalV2Sha256:string;normalizedV3Sha256:string;
 attempts:number;historicVersions:number;currentLessons:number;
 uniqueLessonRevisions:number;v2Bytes:number;v3Bytes:number;
}>{
 // No conversion of an arbitrary curriculum JSON; require the production
 // V2 checksum, exact original learner keys and complete historical sources.
 const old=await verifyLocalRecoveryV2(text);
 let parsed:V2File;
 try{parsed=JSON.parse(text) as V2File}catch{blocked('Malformed source JSON')}
 if(parsed?.format!=='g-learning-english.recovery'||
  parsed.schemaVersion!==2||!Array.isArray(parsed.entries))
  blocked('Not a validated complete V2 Recovery archive');
 const content=parsed.entries.find(x=>x.key===PACKAGE_KEY);
 if(!content)blocked('Missing original curriculum source key');
 let originals:ReleaseRecord[];
 try{originals=decodePackageDocument(JSON.parse(content.value)).records as ReleaseRecord[]}
 catch{blocked('Cannot read source package records')}
 if(!originals.length)blocked('Empty original curriculum');
 const learnerEntries=parsed.entries.filter(x=>x.key!==PACKAGE_KEY);
 const refs:SavedReference[]=[];
 for(const row of learnerEntries.filter(x=>x.key.endsWith(':academic-attempts'))){
  let list:unknown;
  try{list=JSON.parse(row.value)}catch{blocked('Unparseable owner attempts')}
  if(!Array.isArray(list))blocked('Owner attempts are not an array');
  for(const a of list){
   if(!a||typeof a!=='object'||Array.isArray(a))blocked('Malformed saved attempt');
   const item=a as Record<string,unknown>;
   if(typeof item.version!=='string'||typeof item.lessonId!=='string'||
    typeof item.packageId!=='string'||!item.packageId)
    blocked('A legacy attempt lacks original version/lesson/package provenance');
   refs.push({version:item.version,lessonId:item.lessonId,packageId:item.packageId});
  }
 }
 if(refs.length!==old.attempts)
  blocked('Original V2 verified attempt count changed while preparing conversion');
 // Ensure the newest curriculum is a complete source; historic archived
 // subsets are supported only if they contain every attempted old lesson.
 const normalized=await planLessonRevisions(originals,refs);
 const v3=await createRevisionRecoveryV3({
  active:normalized.active,aliases:normalized.aliases,blobs:normalized.blobs
 },learnerEntries,parsed.exportedAt);
 const check=await verifyRevisionRecoveryV3(v3.text);
 if(check.attempts!==old.attempts||
  check.file.active.version!==normalized.active.version)
  blocked('Converted original attempts/current source failed complete verification');
 for(const entry of learnerEntries){
  const copied=check.file.entries.find(x=>x.key===entry.key);
  if(!copied||copied.value!==entry.value)
   blocked('Learner scores/drafts were modified while converting');
 }
 if(new TextEncoder().encode(text).length===0)blocked('Empty input V2');
 return {text:v3.text,
  originalV2Sha256:parsed.sha256,normalizedV3Sha256:v3.sha256,
  attempts:check.attempts,historicVersions:originals.length,
  currentLessons:normalized.active.lessons.length,
  uniqueLessonRevisions:check.uniqueRevisions,
  v2Bytes:new TextEncoder().encode(text).length,
  v3Bytes:new TextEncoder().encode(v3.text).length};
}
