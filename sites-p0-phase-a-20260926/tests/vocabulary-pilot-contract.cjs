'use strict';
/**
 * Scope-locked SLE-VOC-3LEVEL-PILOT-R1-20261112 guard.
 * Checks immutable v1.25.0 source and read-only, post-submit rendering boundaries.
 */
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

const sourceText=read('content/curriculum-1.25.0-candidate.json');
const bytes=Buffer.from(sourceText);
const sha=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+bytes.length+'\0'),bytes
])).digest('hex');
assert.equal(sha,'eb6016669023b4a4d75df7278408da1e60894369',
 'v1.25.0 original curriculum must remain byte-identical');

const curriculum=JSON.parse(sourceText);
assert.equal(curriculum.schema_version,'1.25.0');
assert.equal(curriculum.lessons.length,154);
const expected={'VOC-A1-01':8,'VOC-A2-01':11,'VOC-B1-01':5};
for(const [id,count] of Object.entries(expected)){
 const lesson=curriculum.lessons.find(l=>l.id===id);
 assert(lesson&&lesson.module==='vocabulary','Known original Vocabulary ID '+id);
 assert.equal(lesson.activities.length,count,'No modification of original assessed items '+id);
 assert.equal(new Set(lesson.activities.map(a=>a.id)).size,count);
}
assert.equal(Object.values(expected).reduce((a,b)=>a+b,0),24);

const overlay=read('app/vocabulary-pilot.tsx');
const player=read('app/foundation.tsx');
assert.match(overlay,/version==='1\.25\.0'\?PILOT\[lessonId\]/,
 'Teaching must be version-pinned to immutable source');
assert.match(overlay,/version!=='1\.25\.0'\|\|outcome==='format-only'\|\|correct===null/,
 'Repair must not classify format-only or unassessed answers');
assert.match(overlay,/chosen==='A'/,'Known A2 distractor identified by canonical option ID');
assert.match(overlay,/chosen==='C'/,'Known B1 distractor identified by canonical option ID');
assert.doesNotMatch(overlay,/correct_option_id|accepted_answers|evidence_weight\s*:/,
 'Overlay cannot change or embed official scored keys/evidence');
assert.match(overlay,/not collected, saved or graded/,'Honest unscored self-practice');
assert.match(player,/VocabularyPilotTeaching lessonId=\{lesson.id\}/,
 'Reviewed teaching must render in existing overview only');
assert.match(player,/\{result&&<div className="exercise">/,
 'Per-item feedback is inside the post-submit result gate');
const resultGate=player.indexOf('{result&&<div className="exercise">');
const repair=player.indexOf('<VocabularyPilotRepair');
assert(repair>resultGate,'Repair rendered only with existing item result');
assert.match(player,/chosen=\{attempt\?\.answers\[q.id\]\}/,
 'Use stored canonical option IDs, independent of shuffled display');
assert.doesNotMatch(overlay,/fetch\(|localStorage|indexedDB|\bsubmit\(/,
 'No writes, API calls or learner-record mutations in the overlay');
const transpiled=ts.transpileModule(overlay,{
 fileName:'vocabulary-pilot.tsx',
 reportDiagnostics:true,
 compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}
});
const errors=(transpiled.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
assert.equal(errors.length,0,errors.map(d=>ts.flattenDiagnosticMessageText(d.messageText,' ')).join('; '));
console.log(JSON.stringify({
 result:'PASS',gate:'VOCABULARY_PILOT_R1_STATIC_AND_IMMUTABILITY',
 reviewedLessons:Object.keys(expected),reviewedOriginalItems:24,
 sourceBlobSha:sha,postSubmitOnly:true,scoreWrites:0,cefrClaim:false,
 release:'DRAFT_NO_DEPLOY'
}));
