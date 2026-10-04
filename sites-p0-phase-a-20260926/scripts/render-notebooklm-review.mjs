import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';

const [batchPath,destination,packetId,displayTitle]=process.argv.slice(2);
assert(batchPath&&destination,'Usage: node scripts/render-notebooklm-review.mjs <batch.json> <output.md> [packet-id]');

const batch=JSON.parse(readFileSync(batchPath,'utf8'));
assert(Array.isArray(batch.lessons)&&batch.lessons.length,'Batch must contain lessons.');

const id=packetId||batch.batch_id;
const activityCount=batch.lessons.flatMap(l=>l.activities??[]).length;
let md=`# Self-Learning English — ${displayTitle??'Grammar B1 Wave 2A'} Review Source

Packet ID: \`${id}\`

Status: **${String(batch.status??'PENDING').toUpperCase()}**

Base curriculum: **${batch.base_version}**  
Proposed next curriculum after PASS: **${batch.target_version}**  
Scope: **${batch.lessons.length} lessons / ${activityCount} activities**

This Markdown file is generated from the repository batch JSON for NotebookLM review. The JSON stays inside GitHub as the machine-readable source; NotebookLM reviews this Markdown representation.

## Review boundary

Review academic correctness only. This file does not authorize import or deployment.

Check:
- grammar accuracy and naturalness;
- ambiguity / multiple acceptable answers;
- CEFR appropriateness;
- explanation accuracy;
- Vietnamese support accuracy;
- distractor quality;
- skill-tag meaning;
- lesson-objective alignment;
- duplication/redundancy;
- originality.

${String(batch.status??'').startsWith('academic_pass')?'This packet has passed independent review. Reviewed skill tags may be admitted only through explicit runtime mapping plus regression tests.':'New skill tags remain blocked from runtime until independent review passes.'}
`;

for(const lesson of batch.lessons){
  md+=`\n---\n\n## ${lesson.id} — ${lesson.title}\n\n`;
  md+=`**Module:** ${lesson.module}  \n**CEFR target:** ${lesson.cefr_target}  \n**Estimated time:** ${lesson.estimated_minutes} minutes\n\n`;
  md+='### Objectives\n\n';
  for(const objective of lesson.objectives??[])md+=`- ${objective}\n`;
  md+=`\n### Explanation — English\n\n${lesson.explanation?.en??''}\n\n`;
  if(lesson.explanation?.vi)md+=`### Vietnamese support\n\n${lesson.explanation.vi}\n\n`;
  md+='### Examples\n\n';
  for(const example of lesson.examples??[])md+=`- ${example}\n`;
  if(lesson.reading_asset?.body){
    md+=`\n### Reading text\n\n**${lesson.reading_asset.title??lesson.title}**\n\n${lesson.reading_asset.body}\n\n`;
  }
  md+='\n### Activities\n\n';

  for(const q of lesson.activities??[]){
    md+=`#### ${q.id}\n\n**Type:** ${q.type}  \n**Prompt:** ${q.prompt}\n\n`;
    if(Array.isArray(q.options)){
      md+='**Options:**\n';
      for(const option of q.options)md+=`- ${option.id}. ${option.text}\n`;
      md+='\n';
    }
    if(q.answer?.correct_option_id)md+=`**Correct option:** ${q.answer.correct_option_id}\n\n`;
    if(Array.isArray(q.answer?.accepted_answers))md+=`**Accepted answer(s):** ${q.answer.accepted_answers.join(' | ')}\n\n`;
    if(Array.isArray(q.answer?.normalization))md+=`**Normalization:** ${q.answer.normalization.join(', ')}\n\n`;
    if(q.answer===null)md+='**Answer:** review-required / no deterministic key\n\n';
    if(q.feedback?.explanation_en)md+=`**Feedback:** ${q.feedback.explanation_en}\n\n`;
    md+=`**Skill tag(s):** ${(q.skill_tags??[]).join(', ')}  \n**Evidence weight:** ${q.evidence_weight}\n\n`;
  }
}

md+=`\n---\n\n## Required NotebookLM verdict\n\nReturn exactly one packet verdict: \`PASS\` or \`REVISIONS_REQUIRED\`.\n\nFor every issue, name the exact lesson/activity ID and give a concrete correction. Silence does not mean PASS.\n`;

writeFileSync(destination,md,'utf8');
console.log(JSON.stringify({result:'WRITTEN',packetId:id,lessons:batch.lessons.length,activities:activityCount,destination}));
