import {NextRequest,NextResponse} from 'next/server';
import {learnerKey} from '../identity';
import {runtimeConfig} from '@/infrastructure/runtime';
import {D1AcademicRepository} from '@/infrastructure/storage/d1-academic';
import {D1WritingRepository} from '@/infrastructure/storage/d1-writing-repository';
import {derivePracticeProgress} from '@/domain/practice-progress';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store'};
export async function GET(request:NextRequest){
 const owner=learnerKey(request);
 if(!owner)return NextResponse.json({error:'Sign in to view practice progress.'},{status:401,headers});
 try{const db=runtimeConfig().DB;if(!db)throw Error('Storage unavailable');
  const academic=new D1AcademicRepository(db),writing=new D1WritingRepository(db),scope={ownerId:owner,learnerId:'primary'};
  const [attempts,packages,submissions,evaluations]=await Promise.all([academic.attempts(owner),academic.packages(),writing.readSubmissions(scope),writing.readEvaluations(scope)]);
  return NextResponse.json(derivePracticeProgress(attempts,packages,submissions,evaluations),{headers});
 }catch{return NextResponse.json({error:'Practice progress is unavailable; saved work has not changed.'},{status:503,headers})}
}
