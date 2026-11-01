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

const teaching=fs.readFileSync(path.join(__dirname,'..','app','writing-coach.tsx'),'utf8');
const client=fs.readFileSync(path.join(__dirname,'..','infrastructure','browser','client-services.ts'),'utf8');
assert(!source.includes('AI checked this step. Use your own words'),'Valid AI process guidance must not be replaced by canned feedback');
assert(source.includes('verified?{...entry.feedback,scores:null,corrections:[]}'),'Planning feedback shows substantive Gemini guidance without fabricated grades');
assert(source.includes('entry.evaluation?.provider==="firebase-ai-logic"'),'AI label needs actual provider provenance');
assert(teaching.includes('<h3>Overall assessment</h3>')&&teaching.includes('<h3>What you did well</h3>')&&teaching.includes('<h3>What to improve next</h3>'),'Writing feedback must display rich model assessment');
assert(teaching.includes('rating.revisionSummary')&&teaching.includes('rating.exerciseTag'),'Show targeted revision and practice');
assert(teaching.includes('safeActiveFeedback')&&teaching.includes('activeCorrectionGuidance'),'Full-model response must remain hidden');
assert(client.includes('scoreNeedsReview=rating.corrections.length>0'),'Do not auto-award mastery from inconsistent perfect scores');
console.log(JSON.stringify({
  result:'PASS',
  immediateStepFeedback:true,
  autoAdvanceAfterCheck:false,
  explicitContinue:true,
  staleFeedbackClearedOnEdit:true
}));
