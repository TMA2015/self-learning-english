/**
 * Read-only, post-submission guidance. This function never changes grades,
 * persisted attempts, answer keys or evidence. Do not invoke it before
 * a graded incorrect result exists.
 */
const reviewed118xTips:Readonly<Record<string,string>>={
 'REA-A1-01-Q1':'Reread the whole notice. Decide why it was written before checking small details.',
 'REA-A1-01-Q2':'Find the sentence that gives the meeting place; separate the room from the meeting time.',
 'REA-A1-01-Q3':'Find the meeting day in the notice. Check the day, not the time.',
 'REA-A1-01-Q4':'Find both start and finish times; make sure you selected the finishing time.',
 'REA-A1-01-Q5':'Compare what the club provides with what a new student must bring.',
 'REA-A1-01-Q6':'Separate what the club did last week from what it plans to do this week.',
 'REA-A1-01-Q7':'Locate the line about when new students may join. Use that permission rather than inventing a new condition.',
 'REA-A1-01-Q8':'Reread the registration instruction. Check both the place and the deadline.',
 'VOC-A1-01-Q1':'Think about what students do with books and choose the school place that fits.',
 'VOC-A1-01-Q2':'Compare the tone of each request. Look for a complete and polite way to ask again.',
 'VOC-A1-01-Q3':'Decide which school place the sentence needs, then recall the food-related word from the lesson.',
 'VOC-A1-01-Q4':'Think about the purpose of each classroom tool before choosing.',
 'VOC-A1-01-Q5':'Match the activity to the purpose of a science learning space.',
 'VOC-A1-01-Q6':'Check who is using the item temporarily and who owns it.',
 'VOC-A1-01-Q7':'Think about the word corridor and what makes a passage safe to walk through.',
 'VOC-A1-01-Q8':'Recall the natural verb–noun combination for schoolwork, not a word-for-word translation.',
};

/** Returns one actionable next learning step, never a proficiency claim. */
export function nextActionForIncorrect(module:string,itemId:string,version?:string):string{
 if((version==='1.18.0'||version==='1.18.1')&&reviewed118xTips[itemId]){
   return reviewed118xTips[itemId];
 }
 switch(module){
  case 'reading':
   return 'Reread the passage and identify the sentence that supports the answer before your next attempt.';
  case 'vocabulary':
   return 'Return to the lesson example and check whether the context needs a place, an object, an action or a natural phrase.';
  case 'grammar':
   return 'Compare the rule with the meaning of the sentence, then practise the same form in a new example.';
  case 'listening':
   return 'After submitting, replay the approved audio and focus on the detail you missed before trying again.';
  case 'writing':
   return 'Reread the task requirements and the feedback, then make one specific revision before trying again.';
  case 'speaking':
   return 'Review the problem–detail–polite request pattern. This checks language preparation, not spoken proficiency.';
  case 'pronunciation':
   return 'Review the sound–symbol explanation and an approved audio model if available; this does not evaluate your speech.';
  default:
   return 'Review the explanation and identify what did not fit, then try a new example before retaking.';
 }
}
