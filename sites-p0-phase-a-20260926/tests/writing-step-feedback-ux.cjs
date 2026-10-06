'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'..','app','home-client.tsx'),'utf8');

assert(source.includes('stage:stage===3?4:stage'),'analysis/brainstorm/outline must remain visible after checking');
assert(source.includes('CHECKED · REVIEW BEFORE CONTINUING'),'checked-step feedback panel must be rendered inline');
assert(source.includes('Continue to Brainstorm'),'analysis feedback needs an explicit continue action');
assert(source.includes('Continue to Outline'),'brainstorm feedback needs an explicit continue action');
assert(source.includes('Continue to Writing'),'outline feedback needs an explicit continue action');
assert(source.includes('label={state.feedbacks[0]?"Check again":"Check my work"}'));
assert(source.includes('delete feedbacks[String(stageIndex)]'),'editing a checked response must clear stale feedback');
assert(source.includes('completed:previous.completed.filter(item=>item!==stageIndex)'),'editing a checked response must clear stale completion');

console.log(JSON.stringify({
  result:'PASS',
  immediateStepFeedback:true,
  autoAdvanceAfterCheck:false,
  explicitContinue:true,
  staleFeedbackClearedOnEdit:true
}));
