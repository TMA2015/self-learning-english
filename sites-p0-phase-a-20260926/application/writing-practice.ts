import content from '../content/learning-content.json';
import type {Evidence} from '../domain/learning-model';

const exercise=content.exercises.find(e=>e.id==='garden-relevant-idea')!;

export function gardenRelevantIdeaResult(answer:string,at=Date.now()){
  if(!['a','b'].includes(answer))throw new Error('Choose an answer first.');
  const correct=answer===exercise.answer.correctOptionId;
  const evidence:Evidence[]=[{
    id:`exercise-garden-relevance-${answer}`,
    activityId:'garden-relevant-idea',
    questionId:'garden-relevant-idea',
    source:'exercise',
    skill:'Writing',
    tag:'task-understanding',
    score:Number(correct),
    max:1,
    at,
    mode:'rubric',
    detail:'Identify an on-topic idea; this does not assign a Writing language level.',
    raw:{activityId:'garden-relevant-idea',answer},
  }];
  return {evidence,correct};
}
