'use client';

/**
 * Reviewed vocabulary pilot overlay, packet SLE-VOC-3LEVEL-PILOT-R1-20261112.
 * Read-only lesson accompaniment; never edits scored lesson objects, keys,
 * results, evidence, attempts or historical version digests.
 * Teaching examples are separate from active graded question stems.
 */
type Chunk = {phrase:string;meaning:string;example:string;contrast?:string};
type Teaching = {
  goal:string;
  context:string;
  chunks:readonly Chunk[];
  demonstration:string;
  retrieval:string;
  newContext:string;
};

const PILOT:Record<string,Teaching> = {
  'VOC-A1-01': {
    goal:'Find the right school place or action, and ask for help politely.',
    context:'A new classmate needs to find rooms and use classroom tools.',
    chunks:[
      {phrase:'borrow ... from ...',meaning:'use something for a short time and then return it',example:'Rina borrows a coloured pen from her partner and gives it back.',contrast:'Borrow from someone; lend to someone.'},
      {phrase:'hand in a worksheet',meaning:'give finished work to the teacher',example:'We hand in our worksheets before the bell.',contrast:'Hand in is different from borrowing a worksheet.'}
    ],
    demonstration:'Ava gives her finished drawing to the teacher before going home. She is handing in her work, not borrowing it. Borrow would mean receiving something temporarily.',
    retrieval:'Without looking, think of a polite question asking where the music room is.',
    newContext:'A new classmate needs a coloured pen briefly. Write one helpful sentence using borrow or lend. Check who gives and who receives.'
  },
  'VOC-A2-01': {
    goal:'Choose natural verb–noun phrases for routines and use one in a new situation.',
    context:'A day includes morning tasks, travel, turns in class and helping at home.',
    chunks:[
      {phrase:'make breakfast / make the bed',meaning:'morning preparation and everyday routines',example:'On school days, Eva prepares breakfast before her family leaves.',contrast:'The verb belongs to the whole phrase, not to a word-for-word translation.'},
      {phrase:'catch / miss the bus',meaning:'get on in time / arrive too late',example:'The bus arrived early, so Tom needed to hurry to catch it.'},
      {phrase:'take turns / take a break',meaning:'alternate a shared activity / pause to rest',example:'At the art club, Maya goes first and Omar goes next: they take turns.',contrast:'Take a turn describes one participant’s turn; take turns describes alternating.'},
      {phrase:'wash / do the dishes; set / lay the table',meaning:'accepted ways to describe home chores',example:'The family lays the table before eating and washes the dishes afterwards.',contrast:'Both wash/do the dishes and set/lay the table can be natural.'}
    ],
    demonstration:'Ken is preparing ideas for a student council meeting. Should he make a plan or do a plan? Make a plan is the natural phrase. Check the noun together with its verb, not the translation of each word separately.',
    retrieval:'Close the cards. Recall a phrase for letting people speak one after another in a discussion. Reopen the cards to self-check.',
    newContext:'Your class is preparing a charity stall. Write two short routine sentences with two different chunks; do not copy the examples.'
  },
  'VOC-B1-01': {
    goal:'Use sustainability phrases accurately and distinguish a possible benefit from a proven result.',
    context:'An art club wants to reuse leftover paper but has not measured the effect.',
    chunks:[
      {phrase:'reduce waste',meaning:'action or goal to produce less waste',example:'The team hopes to reduce waste at its next event.',contrast:'A goal is not yet a measured result.'},
      {phrase:'reusable',meaning:'suitable for repeated use',example:'They chose reusable cups for a club meeting.',contrast:'Reusable does not mean free or necessarily plastic-free.'},
      {phrase:'cut down on ...',meaning:'reduce the amount or use of something',example:'Our group wants to cut down on unnecessary printing.',contrast:'State what is being reduced.'},
      {phrase:'make a difference',meaning:'have an effect',example:'A small improvement may make a difference over time.',contrast:'Do not guarantee a large effect without evidence.'},
      {phrase:'public transport',meaning:'transport services open to the public',example:'The group compared options including local trains.',contrast:'Not every privately shared ride is public transport.'}
    ],
    demonstration:'The art club used 40 sheets this week and 55 last week, for different projects. It can say it used fewer sheets this week. It cannot claim that it completely solved its waste problem. Separate an observation from a proven outcome.',
    retrieval:'Close the cards. Recall a phrase for reducing unnecessary printing. Check its preposition when you reopen them.',
    newContext:'Your school wants to change one way students use materials. Write one sentence proposing an action and a second sentence explaining how to check whether it helped.'
  }
};

export function VocabularyPilotTeaching({lessonId,version}:{lessonId:string;version:string}){
  const teaching=version==='1.25.0'?PILOT[lessonId]:undefined;
  if(!teaching)return null;
  return <section className="foundation-learn-block sle-vocab-pilot" aria-label="Vocabulary learning toolkit">
    <h3>Vocabulary in real situations</h3>
    <p><strong>Goal:</strong> {teaching.goal}</p>
    <p><strong>Context:</strong> {teaching.context}</p>
    <div className="sle-vocab-cards">
      {teaching.chunks.map(chunk=><article className="sle-vocab-card" key={chunk.phrase}>
        <h4>{chunk.phrase}</h4><p>{chunk.meaning}</p><p><strong>Example:</strong> {chunk.example}</p>
        {chunk.contrast&&<p className="sle-vocab-contrast"><strong>Notice:</strong> {chunk.contrast}</p>}
      </article>)}
    </div>
    <div className="sle-vocab-demo"><h4>See how to choose a phrase</h4><p>{teaching.demonstration}</p></div>
    <details className="sle-vocab-self-practice">
      <summary>Optional: remember and use it yourself (unscored)</summary>
      <p><strong>Recall:</strong> {teaching.retrieval}</p>
      <p><strong>New situation:</strong> {teaching.newContext}</p>
      <p className="muted">Try this in your notebook. These original sentences are not collected, saved or graded here. No writing-quality or CEFR score is awarded.</p>
    </details>
    <p className="muted">The lesson questions are graded using their existing reviewed keys. This toolkit adds teaching, not extra scored questions.</p>
  </section>;
}

/** A narrow post-submit-only supplement based on the observed answer, not a guessed intention. */
export function VocabularyPilotRepair({itemId,version,correct,outcome,chosen}:{
 itemId:string;version:string;correct:boolean|null;outcome:string;chosen?:string
}){
 if(version!=='1.25.0'||outcome==='format-only'||correct===null)return null;
 let label='';let explanation='';let next='';
 if(itemId==='VOC-A2-01-Q1'&&correct){
   label='Verb choice';
   explanation='Make breakfast is the natural verb–noun combination.';
   next='In another setting, try make a plan.';
 }else if(itemId==='VOC-A2-01-Q1'&&!correct&&chosen==='A'){
   label='Verb choice';
   explanation='Do breakfast is not the standard phrase for preparing breakfast. Compare make breakfast with do homework: the noun affects the verb.';
   next='Invent a sentence with make a plan.';
 }else if(itemId==='VOC-B1-01-Q2'&&!correct&&chosen==='C'){
   label='Word formation';
   explanation='Reusable describes something that can be used again; it does not say the object is made from only one material.';
   next='Explain the prefix re- using a different familiar word.';
 }else if(itemId==='VOC-A2-01-Q9'&&!correct){
   label='Collocation review';
   explanation='The submitted response does not match the approved fixed-answer variants for this sentence. It does not tell us why you chose that response.';
   next='Compare wash the dishes and do the dishes, then practise a different household action.';
 }else if(itemId==='VOC-A2-01-Q11'&&correct){
   label='Natural alternatives';
   explanation='Set the table and lay the table are both accepted ways to describe arranging plates and cutlery.';
   next='Use one of those phrases in a different family routine.';
 }
 if(!explanation)return null;
 return <div className="sle-vocab-repair" role="note" aria-label="Vocabulary next step">
   <strong>{label} · Reviewed practice guidance</strong>
   <p>{explanation}</p>
   <p><strong>Next step:</strong> {next}</p>
   <small>This is fixed-answer feedback, not an AI review or proof of productive vocabulary mastery.</small>
 </div>;
}
