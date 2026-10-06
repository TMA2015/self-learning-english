import curriculum1110 from '../../content/curriculum-1.11.0-candidate.json';
import {academicService,sourceDigest} from '../../application/academic-service';
import {learningService} from '../../application/learning-service';
import {mapSeed,validateSeed,type Seed} from '../../domain/academic';
import {derivePracticeProgress} from '../../domain/practice-progress';
import {myCourses} from '../../domain/course-p1';
import {BrowserLocalAcademicRepository,BrowserLocalCourseSelectionRepository,BrowserLocalLearningRepository,type BrowserKeyValueStorage} from '../storage/browser-local-repositories';
import {LEGACY_PRIMARY_LEARNER_ID,LOCAL_OWNER_ID,localScope} from './local-profiles';

export {LOCAL_OWNER_ID};
export const LOCAL_LEARNER_ID=LEGACY_PRIMARY_LEARNER_ID;
const CURRICULUM_IMPORTED_AT=Date.parse('2026-10-04T00:00:00.000Z');

let cached:{
  storage:BrowserKeyValueStorage;
  learning:BrowserLocalLearningRepository;
  academic:BrowserLocalAcademicRepository;
  courses:BrowserLocalCourseSelectionRepository;
}|null=null;

function browserStorage():BrowserKeyValueStorage{
  if(typeof window==='undefined'||!window.localStorage)throw new Error('Browser storage is unavailable.');
  return window.localStorage;
}

function repositories(){
  const storage=browserStorage();
  if(cached?.storage===storage)return cached;
  cached={
    storage,
    learning:new BrowserLocalLearningRepository(storage),
    academic:new BrowserLocalAcademicRepository(storage),
    courses:new BrowserLocalCourseSelectionRepository(storage),
  };
  return cached;
}

async function ensureCurriculum(){
  const {academic}=repositories();
  const source=curriculum1110 as unknown as Seed;
  const errors=validateSeed(source);
  if(errors.length)throw new Error('Bundled curriculum is invalid: '+errors.join(' '));
  const current=(await academic.packages()).find(row=>row.version===source.schema_version);
  const digest=await sourceDigest(source);
  if(current){
    if(current.digest!==digest)throw new Error('Bundled curriculum version conflicts with local immutable content.');
    return;
  }
  await academic.addPackage({
    id:source.package_id,
    version:source.schema_version,
    digest,
    source,
    bundle:mapSeed(source),
    at:CURRICULUM_IMPORTED_AT,
  });
}

export async function localLearningRuntime(){
  const {learning,storage}=repositories();
  const scope=localScope(storage);
  return {learning,scope,service:learningService(learning,scope)};
}

export async function localAcademicRuntime(){
  await ensureCurriculum();
  const {learning,academic,storage}=repositories();
  const scope=localScope(storage);
  return {
    learning,
    academic,
    scope,
    service:academicService(academic,learning,scope),
  };
}

export async function localPracticeProgress(){
  await ensureCurriculum();
  const {academic,storage}=repositories();
  const scope=localScope(storage);
  const [attempts,packages]=await Promise.all([
    academic.attempts(scope),
    academic.packages(),
  ]);
  return derivePracticeProgress(attempts,packages);
}

export async function localCourseRuntime(){
  const {learning,courses,storage}=repositories();
  const scope=localScope(storage);
  async function load(){
    const [state,selection]=await Promise.all([
      learning.readState(scope),
      courses.read(scope),
    ]);
    return myCourses(state,selection);
  }
  async function select(activeCourseId:string|null,expectedRevision:number,requestId:string){
    return courses.select(scope,activeCourseId,expectedRevision,requestId);
  }
  return {courses,scope,load,select};
}
