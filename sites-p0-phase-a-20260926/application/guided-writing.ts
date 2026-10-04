export type GuidedWritingFeedback={
  summary:string;
  strengths:string[];
  improvements:string[];
  exercise:string;
  scores:null;
  corrections:{original:string;revised:string;why:string;tag:string}[];
  tags:string[];
};

export function guidedWritingFeedback(stage:string,answer:Record<string,string>):GuidedWritingFeedback{
  const all=Object.values(answer).join(' ').trim();
  const words=all.split(/\s+/).filter(Boolean).length;
  const feedback:GuidedWritingFeedback={
    summary:'I have read your work. Check the suggestions before moving on.',
    strengths:[],
    improvements:[],
    exercise:'',
    scores:null,
    corrections:[],
    tags:[],
  };
  if(!all||words<4){
    feedback.summary='Write a little more so that feedback can be useful.';
    feedback.improvements=['Add at least one clear idea of your own.'];
    return feedback;
  }
  if(stage==='analysis'){
    feedback.strengths=['You tried to break the question into parts.'];
    if(!/garden/i.test(all))feedback.improvements.push('Name the topic: a small school garden.');
    if(!/agree|disagree/i.test(all))feedback.improvements.push('State the task: say whether you agree or disagree.');
    if(!/school/i.test(all))feedback.improvements.push('Keep the scope on a garden at school.');
    if(!feedback.improvements.length)feedback.improvements=['Check that each reason is connected to school life.'];
    feedback.exercise='Write one sentence beginning: I agree because…';
  }else if(stage==='brainstorm'){
    feedback.strengths=['You thought of your own ideas before asking for hints.'];
    feedback.improvements=[words<16?'Add another reason and a specific school example.':'Choose your strongest two ideas and explain how each helps students.'];
    feedback.exercise='Choose one idea and add: For example, students can…';
  }else if(stage==='outline'){
    feedback.strengths=['You organized ideas before writing.'];
    feedback.improvements=['Check the order: opinion → reason → example → ending. Make each example support its reason.'];
    feedback.exercise='Write an opening sentence that clearly gives your opinion.';
  }else{
    feedback.strengths=['You completed a draft with your own ideas.'];
    if(words<35)feedback.improvements.push('Add a reason and a concrete example to develop this short draft.');
    if(!/because|so|for example|such as/i.test(all))feedback.improvements.push('Connect a reason with because or add an example with For example.');
    if(!/garden/i.test(all))feedback.improvements.push('Mention the school garden to show that you are answering the question.');
    if(!feedback.improvements.length)feedback.improvements=['Check each reason: have you explained it or given an example?'];
    feedback.exercise='Add a sentence explaining your strongest reason. Start with Because…';
  }
  return feedback;
}
