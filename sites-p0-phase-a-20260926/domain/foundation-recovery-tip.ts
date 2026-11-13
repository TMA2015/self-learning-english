import rgwPilot from '../content/rwg-depth-pilot-r1.json';

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

/** Original v1.25.0 Vocabulary items: meaningful practice after a missed answer. */
const vocabulary125Tips:Readonly<Record<string,string>>={
 'VOC-A1-01-Q1':'Review where students can borrow books. Then make a new sentence about returning a book.',
 'VOC-A1-01-Q2':'Practise a polite request for someone to repeat an instruction. Say why the polite form fits.',
 'VOC-A1-01-Q3':'Recall the school place where students have lunch. Use the place in a new sentence.',
 'VOC-A1-01-Q4':'Compare two classroom tools and name what each is used for.',
 'VOC-A1-01-Q5':'Review what people do in a science lab. Choose a different safe learning activity.',
 'VOC-A1-01-Q6':'Compare borrow from and lend to. Write a sentence that shows who owns the item.',
 'VOC-A1-01-Q7':'Recall what a corridor is. Write a new instruction for keeping a shared space safe.',
 'VOC-A1-01-Q8':'Review the verb used with homework. Compare it with a different natural school phrase.',
 'VOC-A2-01-Q1':'Compare make breakfast and do homework. Then use make a plan in a fresh sentence.',
 'VOC-A2-01-Q2':'Contrast catch the bus with miss the bus. Describe what happens if you arrive too late.',
 'VOC-A2-01-Q3':'Practise take a break in a new situation, such as studying for a test.',
 'VOC-A2-01-Q4':'Recall the phrase go for a walk. Write one sentence about a weekend activity.',
 'VOC-A2-01-Q5':'Think of three actions you do regularly. Describe them as part of your daily routine.',
 'VOC-A2-01-Q6':'Review brush your teeth. Put the phrase in a complete morning-routine sentence.',
 'VOC-A2-01-Q7':'Compare catching and missing the bus. Explain which phrase fits when the bus leaves first.',
 'VOC-A2-01-Q8':'Practise take turns with a new example of two classmates sharing a resource.',
 'VOC-A2-01-Q9':'Compare wash the dishes and do the dishes; both work here. Try a different household chore.',
 'VOC-A2-01-Q10':'Use make the bed in a new morning-routine sentence.',
 'VOC-A2-01-Q11':'Review set the table and lay the table; both are accepted. Write a new sentence about preparing dinner.',
 'VOC-B1-01-Q1':'Use reduce waste in a different school or home situation and explain the intended action.',
 'VOC-B1-01-Q2':'Review how re- changes the meaning of reusable. Name a different thing that can be used again.',
 'VOC-B1-01-Q3':'Use save energy in a practical suggestion and explain what action would help.',
 'VOC-B1-01-Q4':'Practise make a difference in a new example. Explain what effect you expect and why.',
 'VOC-B1-01-Q5':'Compare public transport with private transport. Name two options students might use.'
};

/** Returns one actionable next learning step, never a proficiency claim. */
export function nextActionForIncorrect(module:string,itemId:string,version?:string):string{
 if(module==='vocabulary'&&version==='1.25.0'&&vocabulary125Tips[itemId])return vocabulary125Tips[itemId];
 if(version===rgwPilot.source_curriculum_version&&['reading','grammar'].includes(module)&&itemId.startsWith(module==='reading'?'REA-B1-03-Q':'GRA-B1-05-Q')){
   const recovery=rgwPilot.recovery_by_item as Record<string,string>;
   if(recovery[itemId])return recovery[itemId];
 }
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
