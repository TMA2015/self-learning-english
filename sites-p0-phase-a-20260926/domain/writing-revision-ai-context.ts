import {savedLater,type LaterWeek,type LaterWork} from './writing-course-v2-c';

/** Compare a saved original and its saved working copy.
 * This is optional coaching only: no changes to attempts, scores or proficiency.
 * The source may be a labelled sample, not learner-authored writing.
 */
export type RevisionAIContext={
 task:string;
 fields:Record<string,string>;
 sourceSample:boolean;
};

export function revisionAIContext(week:LaterWeek,work:LaterWork):RevisionAIContext|null{
 if((week!==9&&week!==10)||!savedLater(week,work))return null;
 const snapshot=work.submission;
 if(!snapshot?.source||!snapshot.fields.draft?.trim())return null;
 const editing=week===9;
 return {
  task:editing
   ? 'Week 9 · Editing: Compare the original text with the saved edited version. Check actual grammar, tense, articles and punctuation changes. If the learner checked and kept a correct passage, acknowledge no change rather than inventing mistakes. Quote only observed differences and suggest one next editing action. Do not produce a replacement paragraph or assign a grade.'
   : 'Week 10 · Revision: Compare the original text with the saved revised version. Prioritize the stated revision goal and the writer\'s own explanation of changes. Identify one concrete improvement or remaining issue supported by the two texts; acknowledge unchanged text honestly. Suggest one next revision action without writing a replacement paragraph or assigning a grade.',
  fields:{
   sourceTask:snapshot.source.prompt,
   sourceOwnership:snapshot.source.ownership==='sample'?'Sample Student Draft':'Learner-owned source',
   originalText:snapshot.source.text,
   revisedText:snapshot.fields.draft,
   ...(week===9?{checkedNoChange:snapshot.fields.noChange==='yes'?'yes':'no'}:{}),
   ...(week===10?{
    revisionGoal:snapshot.fields.goal??'',
    revisionNote:snapshot.fields.note??'',
   }:{}),
  },
  sourceSample:snapshot.source.ownership==='sample',
 };
}
