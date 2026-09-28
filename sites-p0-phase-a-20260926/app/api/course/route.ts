import {NextRequest,NextResponse} from 'next/server';
import {learnerKey} from '../identity';
import {runtimeConfig} from '@/infrastructure/runtime';
import {D1LearningRepository} from '@/infrastructure/storage/d1-repository';
import {D1CourseSelectionRepository,CourseSelectionConflict} from '@/infrastructure/storage/d1-course-selection';
import {myCourses,WRITING_COURSE_ID} from '@/domain/course-p1';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store'};
function database(){const db=runtimeConfig().DB;if(!db)throw Error('Storage unavailable');return db}
export async function GET(request:NextRequest){
 const owner=learnerKey(request);if(!owner)return NextResponse.json({error:'Sign in to view My Courses.'},{status:401,headers});
 try{const db=database();const [state,selection]=await Promise.all([
  new D1LearningRepository(db).readState({ownerId:owner,learnerId:'primary'}),
  new D1CourseSelectionRepository(db).read(owner),
 ]);return NextResponse.json(myCourses(state,selection),{headers})}
 catch{return NextResponse.json({error:'My Courses could not be loaded.'},{status:503,headers})}
}
export async function POST(request:NextRequest){
 const owner=learnerKey(request);if(!owner)return NextResponse.json({error:'Sign in to choose a course.'},{status:401,headers});
 let body:unknown;try{body=await request.json()}catch{return NextResponse.json({error:'Invalid request.'},{status:400,headers})}
 if(!body||typeof body!=='object'||Array.isArray(body))return NextResponse.json({error:'Invalid request.'},{status:400,headers});
 const data=body as Record<string,unknown>;
 if(Object.keys(data).some(k=>!['activeCourseId','expectedRevision','requestId'].includes(k))||
   !(data.activeCourseId===null||data.activeCourseId===WRITING_COURSE_ID)||
   !Number.isSafeInteger(data.expectedRevision)||typeof data.requestId!=='string')return NextResponse.json({error:'Invalid course selection.'},{status:400,headers});
 try{const selection=await new D1CourseSelectionRepository(database()).select(owner,data.activeCourseId as string|null,data.expectedRevision as number,data.requestId);return NextResponse.json({selection},{headers})}
 catch(e){if(e instanceof CourseSelectionConflict)return NextResponse.json({error:e.message,selection:e.current},{status:409,headers});if(e instanceof Error&&/Course is unavailable|Invalid selection request/.test(e.message))return NextResponse.json({error:e.message},{status:422,headers});return NextResponse.json({error:'Course selection was not saved. Retry safely.'},{status:503,headers})}
}
