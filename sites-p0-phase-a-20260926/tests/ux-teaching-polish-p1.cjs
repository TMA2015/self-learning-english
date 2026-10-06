'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

const home=read('app/home-client.tsx');
const css=read('app/globals.css');
const garden=JSON.parse(read('content/garden-lesson.json'));
const core=read('app/core-panels.tsx');
const guided=read('application/guided-writing.ts');
const client=read('infrastructure/browser/client-services.ts');
const contracts=read('ai/contracts.ts');
const registry=JSON.parse(read('ai/prompts/registry.json'));
const tutor=read('app/floating-ai-tutor.tsx');
const avatar=read('public/branding/tutor-girl-awake.svg');

assert(css.includes('@media (min-width:1350px)')&&css.includes('repeat(3,minmax(0,1fr))'),'wide catalog needs 3 columns');
assert(css.includes('@media (max-width:520px)')&&css.includes('.foundation-catalog{grid-template-columns:1fr}'),'phone catalog needs 1 column');
assert(!core.includes('45 available lessons'),'stale hard-coded lesson count must be removed');
assert(core.includes('lessonCount'),'Learning Plan needs runtime lesson count');
assert(garden.guides?.analysis?.rows?.length===5,'analysis guide must teach all five boxes');
assert(garden.guides?.brainstorm?.rows?.length===4,'brainstorm guide must teach answer shapes');
assert(garden.guides?.outline?.rows?.length===5,'outline guide must teach paragraph map');
assert(home.includes('LEARN BEFORE YOU TRY')&&home.includes('Worked example · a different question'),'Writing process needs worked examples before practice');
assert(home.includes('quickCheckWritingProcess')&&home.includes('coachWritingStep'),'quick check and optional AI must be separate');
assert(home.includes('Ask AI Coach for deeper feedback'),'AI coaching should be optional after instant feedback');
assert(!home.includes('LAST STEP FEEDBACK'),'feedback must not move into the next step sidebar');
assert(!home.includes('Private preview'),'production UI must not retain preview badge');
assert(guided.includes('You identified the topic as')&&guided.includes('Limit:'),'fallback feedback must quote/analyse learner fields');
assert(client.includes('askLearningTutor'),'browser should expose contextual tutor');
assert(contracts.includes("'learning-help'"),'AI contract should include learning-help');
assert(registry['learning-help']?.status==='active','learning-help prompt must be active');
assert(tutor.includes('Explain this more simply')&&tutor.includes('Show a similar example')&&tutor.includes('Give me one hint'),'floating tutor needs teaching actions');
assert(tutor.includes('The Tutor should teach the method, not do assessed work for you.'),'floating tutor needs anti-answer cue');
assert(avatar.includes('data:image/webp;base64,'),'English must reuse the approved Math tutor image');
assert(css.includes('.floating-ai-launcher')&&css.includes('.floating-ai-panel'),'floating tutor must have responsive UI');

console.log(JSON.stringify({
  result:'PASS',
  catalogResponsive:true,
  dynamicLessonCount:true,
  writingWorkedExamples:true,
  instantQuickCheck:true,
  optionalAICoach:true,
  contextualFloatingTutor:true,
  sharedTutorAvatar:true
}));
