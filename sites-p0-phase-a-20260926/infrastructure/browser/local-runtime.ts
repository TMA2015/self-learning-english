import curriculum1200 from '../../content/curriculum-1.20.0-candidate.json';
import {academicService,sourceDigest} from '../../application/academic-service';
import {learningService} from '../../application/learning-service';
import {mapSeed,validateSeed,compareVersions,type Seed} from '../../domain/academic';
import {derivePracticeProgress} from '../../domain/practice-progress';
import {myCourses} from '../../domain/course-p1';
import {BrowserLocalAcademicRepository,BrowserLocalCourseSelectionRepository,BrowserLocalLearningRepository,type BrowserKeyValueStorage} from '../storage/browser-local-repositories';
import {HybridBrowserAcademicRepository} from '../storage/hybrid-academic-repository';
import {browserCurriculumVault} from '../storage/indexeddb-curriculum-vault';
import {hybridStorageEnabled} from './hybrid-storage-mode';

export const LOCAL_OWNER_ID='local-family';
export const LOCAL_LEARNER_ID='primary';
// Bundled candidate metadata only; not a production deployment timestamp.
const CURRICULUM_IMPORTED_AT=Date.parse('2026-11-06T00:00:00.000Z');
let curriculumWarning:string|undefined;

let cached:{
  storage:BrowserKeyValueStorage;
  learning:BrowserLocalLearningRepository;
  academic:BrowserLocalAcademicRepository;
  hybrid:HybridBrowserAcademicRepository|null;
  courses:BrowserLocalCourseSelectionRepository;
}|null=null;

function browserStorage():BrowserKeyValueStorage{
  if(typeof window==='undefined'||!window.localStorage)throw new Error('Browser storage is unavailable.');
  return window.localStorage;
}

function repositories(){
  const storage=browserStorage();
  // Block ALL learner writes while any interrupted recovery marker remains.
  // A partial multi-key restore cannot safely be treated as an active profile.
  if(storage.getItem('g-learning:english:v1:recovery-pending-v2'))
    throw new Error('An interrupted local recovery was detected. Preserve this browser data and contact the project owner.');
  if(cached?.storage===storage)return cached;
  cached={
    storage,
    learning:new BrowserLocalLearningRepository(storage),
    academic:new BrowserLocalAcademicRepository(storage),
    hybrid:hybridStorageEnabled()
      ?new HybridBrowserAcademicRepository(storage,browserCurriculumVault()):null,
    courses:new BrowserLocalCourseSelectionRepository(storage),
  };
  return cached;
}

async function ensureCurriculum(){
  const {academic:legacy,hybrid,storage}=repositories();
  const academic=hybrid??legacy;
  if(storage.getItem('g-learning:english:v1:recovery-pending-v2'))
    throw new Error('An interrupted local recovery was detected. Do not edit or clear learning data; contact the project owner.');

  // The deployed cumulative version is bundled into the site. Every visit
  // ensures this version is available locally; no downloaded JSON or Recovery
  // import is required. Existing lesson attempts stay pinned to their original
  // source versions and this code never deletes learner storage.
  const source=curriculum1200 as unknown as Seed;
  const errors=validateSeed(source);
  if(errors.length)throw new Error('Bundled curriculum is invalid: '+errors.join(' '));
  const available=await academic.packages();
  // Never re-install the old bundled baseline once the user has imported a
  // newer active curriculum and compacted away unreferenced baseline content.
  const newer=available.some(row=>compareVersions(row.version,source.schema_version)>0);
  const current=available.find(row=>row.version===source.schema_version);
  const digest=await sourceDigest(source);
  if(newer&&!current){
    curriculumWarning=undefined;
    return;
  }
  if(current){
    if(current.digest!==digest)throw new Error('Bundled curriculum version conflicts with local immutable content.');
    curriculumWarning=undefined;
    return;
  }
  try{
    await academic.addPackage({
      id:source.package_id,
      version:source.schema_version,
      digest,
      source,
      bundle:mapSeed(source),
      at:CURRICULUM_IMPORTED_AT,
    });
    curriculumWarning=undefined;
  }catch(error){
    if(!(error instanceof Error&&/Could not save:.*no storage space available/i.test(error.message)))throw error;
    // Import failure must not make a previously saved and readable course
    // inaccessible. The failed localStorage write is atomic; we never delete
    // old package versions or learner attempts as an automatic "recovery".
    const previous=await academic.packages();
    if(!previous.some(row=>Array.isArray(row.source?.lessons)&&row.source.lessons.length>0))throw error;
    curriculumWarning='The automatic English lesson update was paused: the new curriculum could not be saved because this browser is short of storage space. Your existing lessons and scores are preserved. New saves may also fail. Do not clear this site’s data or use Restore for curriculum updates. Keep a complete Recovery backup before considering the optional one-time storage cleanup.';
  }
}

export async function localLearningRuntime(){
  const {learning}=repositories();
  const scope={ownerId:LOCAL_OWNER_ID,learnerId:LOCAL_LEARNER_ID};
  return {learning,scope,service:learningService(learning,scope)};
}

export async function localAcademicRuntime(){
  await ensureCurriculum();
  const {learning,academic,hybrid}=repositories();
  return {
    learning,
    academic, // Legacy storage methods remain available for backed-up cleanup.
    service:academicService(hybrid??academic,learning,LOCAL_OWNER_ID),
    warning:curriculumWarning,
  };
}

export async function localPracticeProgress(){
  await ensureCurriculum();
  const {academic:legacy,hybrid}=repositories();
  const academic=hybrid??legacy;
  const [attempts,packages]=await Promise.all([
    academic.attempts(LOCAL_OWNER_ID),
    academic.packages(),
  ]);
  return derivePracticeProgress(attempts,packages);
}

export async function localCourseRuntime(){
  const {learning,courses}=repositories();
  const scope={ownerId:LOCAL_OWNER_ID,learnerId:LOCAL_LEARNER_ID};
  async function load(){
    const [state,selection]=await Promise.all([
      learning.readState(scope),
      courses.read(LOCAL_OWNER_ID),
    ]);
    return myCourses(state,selection);
  }
  async function select(activeCourseId:string|null,expectedRevision:number,requestId:string){
    return courses.select(LOCAL_OWNER_ID,activeCourseId,expectedRevision,requestId);
  }
  return {courses,scope,load,select};
}
