// Fail closed: references to source option positions need independently approved wording.
const fs=require('node:fs'),seed=require('../content/curriculum-1.17.0-candidate.json');
const pattern=/\b(first|second|third|fourth|last)\s+(?:sentence|option|answer|choice|reason|sequence|response|proposal)\b|\b(?:option|answer|choice)\s+[A-D]\b|all of the above|none of the above|both [A-D] and [A-D]/i;
const exceptions={
 'REA-A1-01-Q2:feedback':'The second sentence identifies Room 12.',
 'REA-A1-01-Q8:feedback':'The last sentence gives the registration location and deadline.',
 'REA-A1-02-Q1:feedback':"The first sentence introduces Class 6B's visit to the museum.",
 'REA-B1-02-Q2:feedback':'The first sentence states that the school session will be in the school library.',
 'GRA-A2-04-Q5:prompt':'Complete: This answer is ___ than my first answer.'
};
const blockers=[];let scanned=0;
for(const l of seed.lessons)for(const q of l.activities.filter(q=>q.type==='single_choice')){scanned++;for(const [field,text] of [['prompt',q.prompt],['feedback',q.feedback.explanation_en??''],...q.options.map(o=>['option-'+o.id,o.text])])if(pattern.test(text)&&exceptions[q.id+':'+field]!==text)blockers.push({id:q.id,field,text});}
fs.mkdirSync('docs/qa',{recursive:true});fs.writeFileSync('docs/qa/AQ2_POSITION_BLOCKERS.json',JSON.stringify({result:blockers.length?'BLOCKED':'PASS',scanned,blockers},null,2)+'\n');
console.log(JSON.stringify({result:blockers.length?'BLOCKED':'PASS',scanned,blockers}));if(blockers.length)process.exitCode=1;
