'use strict';
/**
 * Display-only Foundation UX contract. One common layout across all skills.
 * Never changes academic order, answer keys, audio eligibility or persistence.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const root=path.resolve(__dirname,'..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const source=read('app/foundation.tsx'),css=read('app/foundation-compact-lesson.css');
const originalLayoutImport="import './foundation-compact-lesson.css'";
assert(source.includes(originalLayoutImport),'Compact CSS must be locally scoped to Foundation');
assert(source.includes('foundation-options-grid'),'Shared question answer grid is missing');
assert(source.includes("o.text.length>72?' foundation-option-long':''"),
 'Long-answer safe full-width card class must be present');
assert(source.includes("name={q.id} value={o.id} checked={answers[q.id]===o.id}"),
 'Original persisted radio answer selection must not change');
assert(source.includes("orderedOptions(q,attempt)?.map(o=>"),
 'Existing deterministic option-order function must remain');
assert(source.includes("onChange={()=>{setSubmitError('');markDraftChanged();setAnswers"),
 'Existing draft/save event path must remain');
assert(source.includes("lesson.activities.map((q,index)=>"),
 'Do not reorder academic questions to match playback by index guessing');
assert(source.includes('foundation-listening-audio-compact'),
 'Compact player wrapper must retain original Listening player');
assert(source.includes("onTimeUpdate={()=>{const current=audio.current?.currentTime"),
 'Full-recording elapsed-time accounting must remain untouched');
assert(source.includes('onEnded={()=>void ended()}'),
 'Listening ended event must still confirm full recording');
assert(source.includes('listeningAudioHint(playbackVerified,!!audioInfo,playing)'));
assert(!/localStorage|sessionStorage|setItem/.test(css));
assert(css.includes('font-size: 14px'),'Accepted Dictation-sized option text');
assert(css.includes('font-size: 14.5px'),'Shared prompt and reading text scale');
assert(css.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'),
 'Two options per desktop/iPad row when wide enough');
assert(css.includes('@container (max-width: 490px)')&&css.includes('grid-template-columns: minmax(0, 1fr)'),
 'Narrow split views must return to one column');
assert(css.includes('min-height: 44px'),'Accessible touch size must be maintained');
assert(css.includes('font-size: 16px')&&css.includes('.foundation-question textarea'),
 'Keep input at >=16px so iOS Safari does not zoom');
assert(css.includes('.foundation-option-long')&&css.includes('grid-column: 1 / -1'),
 'Long choices must not be squeezed into small columns');
assert(css.includes(':focus-within'),'Keyboard focus must remain visible');
assert(!/position:\s*sticky/.test(css),
 'Do not accidentally introduce a floating Listening control');
const parsed=ts.createSourceFile('foundation.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
assert.deepEqual(parsed.parseDiagnostics.map(d=>d.messageText),[],'TSX parser must accept the markup');
const release=read('scripts/qa-free-first.mjs');
assert(release.includes('foundation-compact-layout.cjs'),'QA runner must include the visual contract');
console.log(JSON.stringify({result:'PASS',gate:'SLE_UNIFIED_FOUNDATION_COMPACT_UX',
 commonSkills:['listening','reading','grammar','vocabulary','writing'],
 font:'14px choices/14.5px prompts',columns:'2 wide / 1 narrow',
 minimumTouchPx:44,iosWritingInputPx:16,
 changes:'presentation-only',audioScoreUntouched:true,
 questionOrderUntouched:true,learnerWritesUntouched:true,
 actualIPadSafari:'NOT_TESTED',firebaseLive:'NOT_DEPLOYED'}));
