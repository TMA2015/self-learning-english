import {
  makeDiagnostic,
  nextQuestion,
  recordAnswer,
  type Attempt,
  type DiagnosticV2,
  type ListeningResult,
  type WritingRating,
} from '../../domain/learning-model';
import {coreListening} from '../../domain/core-listening';
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

function scoreListening(
  source:DiagnosticV2['listening'],
  sessionId:string,
  version:DiagnosticV2['version'],
):ListeningResult|undefined{
  if(!source?.length)return undefined;
  if(version!==4)throw new Error('Browser-local Diagnostic supports the current v4 Listening screen only.');
  if(
    source.length!==coreListening.length||
    source.some((answer,index)=>
      answer.id!==coreListening[index].id||
      !Number.isInteger(answer.answer)||
      answer.answer<0||answer.answer>2||
      answer.played!==true
    )
  )throw new Error('Finish all Listening questions, or skip this optional section.');

  const subskills:ListeningResult['subskills']={};
  let correct=0;
  const at=Date.now();
  const evidence=source.map((answer,index)=>{
    const task=coreListening[index];
    const ok=Number(answer.answer===task.correct);
    correct+=ok;
    subskills[task.tag]??={correct:0,total:0};
    subskills[task.tag].correct+=ok;
    subskills[task.tag].total++;
    return {
      id:`listen-${sessionId}-${answer.id}`,
      activityId:`listen-${sessionId}`,
      source:'listening' as const,
      skill:'Listening' as const,
      tag:task.tag,
      level:task.level,
      score:ok,
      max:1,
      at,
      mode:'rubric' as const,
      questionId:answer.id,
      raw:answer,
    };
  });
  return {
    correct,
    total:coreListening.length,
    confidence:'low',
    subskills,
    note:'Synthetic speech screen; confidence remains low. Natural accents and conversation are not fully assessed.',
    evidence,
  };
}

export async function finishLocalDiagnostic(value:DiagnosticV2){
  if(value.version!==4)throw new Error('Start a new v4 Diagnostic to finish it in browser-local mode.');
  const sessionId=value.sessionId??String(value.startedAt);
  const {service}=await localLearningRuntime();
  const existing=await service.getAssessment(sessionId);
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
  const listening=value.listeningSkipped?undefined:scoreListening(value.listening,sessionId,value.version);
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
