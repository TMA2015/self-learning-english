export type GuidedWritingFeedback={
  summary:string;
  strengths:string[];
  improvements:string[];
  exercise:string;
  scores:null;
  corrections:{original:string;revised:string;why:string;tag:string}[];
  tags:string[];
};

function clean(value:string){return value.replace(/\s+/g,' ').trim()}
function quote(value:string){const text=clean(value);return text?'“'+text.slice(0,90)+(text.length>90?'…':'')+'”':'(blank)'}

export function guidedWritingFeedback(stage:string,answer:Record<string,string>):GuidedWritingFeedback{
  const normalized=Object.fromEntries(Object.entries(answer).map(([key,value])=>[key,clean(value)]));
  const all=Object.values(normalized).join(' ').trim();
  const words=all.split(/\s+/).filter(Boolean).length;
  const feedback:GuidedWritingFeedback={
    summary:'Quick check complete. Use the notes below, revise if needed, then continue.',
    strengths:[], improvements:[], exercise:'', scores:null, corrections:[], tags:[],
  };
  if(!all||words<4){
    feedback.summary='There is not enough of your own work to check yet.';
    feedback.improvements=['Add at least one clear idea of your own, then check again.'];
    feedback.exercise='Write one short phrase that answers the first box.';
    return feedback;
  }
  if(stage==='analysis'){
    const topic=normalized.topic??'',task=normalized.task??'',keywords=normalized.keywords??'',limits=normalized.limits??'',offtopic=normalized.offtopic??'';
    feedback.strengths.push('You identified the topic as '+quote(topic)+'.');
    if(/agree|disagree|opinion/i.test(task)&&/reason/i.test(task)&&/example/i.test(task)) feedback.strengths.push('Your task note '+quote(task)+' includes the opinion, reasons and example.');
    else feedback.improvements.push('Task: '+quote(task)+'. Check that it includes all three jobs: give your opinion, give reasons, and give an example.');
    if(topic.split(/\s+/).filter(Boolean).length>10)feedback.improvements.push('Topic: make it shorter. A topic box should usually be a short noun phrase, not a copied sentence.');
    if(!/school/i.test(limits))feedback.improvements.push('Limit: '+quote(limits)+' is too broad. Keep the scope on the school setting and what the garden does for students.');
    if(!keywords)feedback.improvements.push('Important words: list only the words that control the answer, separated by commas.');
    if(!offtopic)feedback.improvements.push('Avoid: name one idea that would pull the paragraph away from the school-garden question.');
    if(!feedback.improvements.length)feedback.improvements.push('Your analysis covers the main parts. Before continuing, make sure each box is a short note rather than a paragraph.');
    feedback.exercise='Without copying the prompt, shorten your topic to one noun phrase of about 2–7 words.';
  }else if(stage==='brainstorm'){
    const ideas=normalized.ideas??'',selected=normalized.selected??'',support=normalized.support??'',example=normalized.example??'';
    feedback.strengths.push('Your idea bank starts with '+quote(ideas)+'.');
    if(selected)feedback.strengths.push('You chose a main idea: '+quote(selected)+'.');
    if(!selected)feedback.improvements.push('Choose one strongest reason from your idea bank.');
    if(!support)feedback.improvements.push('Explain why your chosen reason is true. A short because-style note is enough.');
    if(!example)feedback.improvements.push('Add one specific school example: who does what, where, or when?');
    if(ideas.split(/[;,]/).filter(Boolean).length<2)feedback.improvements.push('Generate at least one more possible reason before deciding which is strongest.');
    if(!feedback.improvements.length)feedback.improvements.push('Check that your example '+quote(example)+' clearly proves or illustrates '+quote(selected)+'.');
    feedback.exercise='Take your best idea and finish this note: “This matters because …”';
  }else if(stage==='outline'){
    const opening=normalized.opening??'',reason=normalized.reason1??'',detail=normalized.detail??'',example=normalized.example??'',ending=normalized.ending??'';
    if(opening)feedback.strengths.push('Your opening is '+quote(opening)+'.');
    if(reason&&example)feedback.strengths.push('You included both a reason and an example in the plan.');
    if(!opening)feedback.improvements.push('Opening: write one full sentence that answers the question with your opinion.');
    if(!reason)feedback.improvements.push('Reason: add one clear reason that supports the opening.');
    if(!detail)feedback.improvements.push('Supporting detail: explain why the reason matters before the example.');
    if(!example)feedback.improvements.push('Example: add one concrete school situation.');
    if(!ending)feedback.improvements.push('Ending: add one short sentence that returns to your main point.');
    if(!feedback.improvements.length)feedback.improvements.push('Read the chain aloud: opinion → reason → explanation → example → ending. Each part should support the one before it.');
    feedback.exercise='Point to the reason and the example. In one short note, explain how the example proves the reason.';
  }else{
    feedback.strengths=['You completed a draft with your own ideas.'];
    if(words<35)feedback.improvements.push('Add a reason and a concrete example to develop this short draft.');
    if(!/because|so|for example|such as/i.test(all))feedback.improvements.push('Connect a reason with because or add an example with “For example”.');
    if(!/garden/i.test(all))feedback.improvements.push('Mention the school garden so the reader can see that you are answering the exact question.');
    if(!feedback.improvements.length)feedback.improvements=['Check each reason: have you explained it or given an example?'];
    feedback.exercise='Add one sentence that explains your strongest reason without repeating the same words.';
  }
  return feedback;
}
