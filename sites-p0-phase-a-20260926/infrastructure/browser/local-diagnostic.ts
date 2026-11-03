import {
  makeDiagnostic,
  nextQuestion,
  recordAnswer,
  type Attempt,
  type DiagnosticV2,
  type WritingRating,
} from '../../domain/learning-model';
import {scoreDiagnosticListening} from '../../domain/diagnostic-listening-evidence';
import {localLearningRuntime} from './local-runtime';

function wordCount(text:string){
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function validateWriting(text:string,index:number){
  if(typeof text!=='string'||text.length>5000)
    throw new Error(`Writing sample ${index+1} must contain text of at most 5,000 characters.`);
  const count=wordCount(text);
  if(count<40)throw new Error(`Writing sample ${index+1} has ${count} words. Add at least ${40-count} more before submitting.`);
}

function validateAttempts(source:Attempt[],version:DiagnosticV2['version']){
  if(!Array.isArray(source)||source.length>90)
    throw new Error('Assessment answers could not be read. Your saved draft is unchanged.');
  let validated:Attempt[]=[];
  for(const [index,answer] of source.entries()){
    const expected=nextQuestion(validated,version);
    if(
      !answer||!expected||expected.id!==answer.id||
      typeof answer.answer!=='string'||!/^[0-2]$/.test(answer.answer)
    )throw new Error(`Saved answer ${index+1} does not match assessment version ${version}. Your draft is preserved.`);
    validated=recordAnswer(validated,expected,Number(answer.answer));
  }
  if(nextQuestion(validated,version))
    throw new Error(`The assessment still needs another question after ${validated.length} saved answers. Resume the saved draft.`);
  return validated;
}


export async function finishLocalDiagnostic(value:DiagnosticV2){
  if(value.version!==4)throw new Error('Start a new v4 Diagnostic to finish it in browser-local mode.');
  const sessionId=value.sessionId??String(value.startedAt);
  const {service}=await localLearningRuntime();
  const existing=await service.getAssessment(sessionId);
  if(value.listeningSupplementOf){
    const original=await service.getAssessment(value.listeningSupplementOf);
    if(!original?.result||original.listeningSkipped!==true||value.listeningSkipped===true)
      throw new Error('The linked previous Diagnostic is unavailable. Your saved answers were not changed.');
    if(original.writing!==value.writing||original.writing2!==value.writing2||
       JSON.stringify(original.attempts)!==JSON.stringify(value.attempts))
      throw new Error('Previous Diagnostic answers changed. The original saved result was preserved.');
  }
  if(existing?.result)return {
    result:existing.result,
    attempts:existing.attempts,
    writingReviews:existing.writingReviews??[],
    writingAI:false,
  };

  const writing=value.writing??'';
  const writing2=value.writing2??'';
  validateWriting(writing,0);
  validateWriting(writing2,1);
  const attempts=validateAttempts(value.attempts,value.version);
  if(value.listeningSkipped!==true&&(!value.listening||value.listening.length===0))
    throw new Error('Finish Listening or select Skip Listening explicitly before submitting. Your saved answers are unchanged.');
  const listening=value.listeningSkipped===true?undefined:scoreDiagnosticListening(value.listening!,sessionId,Date.now());
  const result=makeDiagnostic(attempts,`${writing}\n\n${writing2}`,Date.now(),[],listening);
  const writingReviews:(WritingRating|null)[]=[null,null];
  const completed:DiagnosticV2={
    ...value,
    sessionId,
    attempts,
    writing,
    writing2,
    listening:value.listeningSkipped?undefined:value.listening,
    result,
    writingReviews,
    finishedAt:result.at,
    paused:false,
  };
  await service.recordAssessment(completed);
  return {result,attempts,writingReviews,writingAI:false};
}
