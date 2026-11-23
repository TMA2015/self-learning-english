'use strict';
/** Deterministic post-submission dictation, zero new evidence, old audio guards intact. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ts=require('typescript'),vm=require('node:vm');
const base=path.resolve(__dirname,'..');const read=p=>fs.readFileSync(path.join(base,p),'utf8');
const src=read('domain/listening-dictation.ts');
const compiled=ts.transpileModule(src,{fileName:'listening-dictation.ts',
 compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
const o={exports:{}};
vm.runInNewContext(compiled,{module:o,exports:o.exports,Math,Set,Map,Number,String,Error},{timeout:4000});
const {splitDictationLines,buildDictationSheet,normalizeDictationAnswer,checkDictationAnswers,validVerifiedSegments}=o.exports;
const manifest=require('../content/foundation-audio.json');
const ids=['LIS-A1-03','LIS-A2-01','LIS-B1-01'];
const labels=['A','B','Woman','Man','Host','Guest','Teacher','Student'];
// NotebookLM MUST_FIX #1: structural speaker names (including long names) are
// never audio words, cloze targets, or counted toward gap density.
for(const speaker of labels){
 const phrase=speaker+': Peaches ripen outside every morning.\n'+speaker+
 ': Students enjoy gardening during summer afternoons.';
 const sheet=buildDictationSheet(phrase,30);
 const textOnly=phrase.replaceAll(new RegExp('^'+speaker+': ?', 'gm'),'');
 const audibleCount=[...textOnly.matchAll(/[A-Za-z]+(?:['’\\-][A-Za-z]+)*/g)].length;
 assert.equal(sheet.spokenWords,audibleCount,speaker+' is speaker metadata, not a spoken word');
 assert.equal(sheet.lines.length,2);
 assert(!sheet.gaps.some(g=>g.answer.toLowerCase()===speaker.toLowerCase()),
  'Speaker name must never be masked: '+speaker);
 assert(sheet.lines.every((line,i)=>line.parts.filter(p=>p.kind==='text')
   .map(p=>p.text).join('').includes(speaker+':')),
  'Speaker label must remain visible even when other text is masked: '+speaker);
}

let tested=0;
for(const id of ids){
 const m=manifest[id];
 assert(m&&typeof m.source==='string'&&m.source.length>60,id+' requires approved transcript');
 const lines=splitDictationLines(m.source);
 assert(lines.length>2,id+' speaker/phrase lines expected');
 for(const density of [10,20,30]){
  const sheet=buildDictationSheet(m.source,density);
  const repeated=buildDictationSheet(m.source,density);
  assert.equal(JSON.stringify(sheet),JSON.stringify(repeated),'Deterministic cloze without new AI');
  assert.equal(sheet.lines.length,lines.length);
  assert.equal(sheet.spokenWords>20,true);
  assert(sheet.gaps.length>0,'Must hide real transcript words');
  assert.equal(new Set(sheet.gaps.map(g=>g.id)).size,sheet.gaps.length);
  const expected=Object.fromEntries(sheet.gaps.map(g=>[g.id,g.answer]));
  const checked=checkDictationAnswers(sheet,expected);
  assert(checked.every(r=>r.correct),'Exact transcript answers must pass');
  const mismatched={...expected,[sheet.gaps[0].id]:'wrongword'};
  assert.equal(checkDictationAnswers(sheet,mismatched)[0].correct,false);
  assert.equal(checkDictationAnswers(sheet,{...expected,[sheet.gaps[0].id]:'  '+sheet.gaps[0].answer.toUpperCase()+'!  '})[0].correct,true);
  for(const line of sheet.lines){
   const actual=line.parts.map(part=>part.kind==='text'?part.text:expected[part.id]).join('');
   assert.equal(actual,line.displayText,'Unmasked transcript source must be reconstructed exactly');
   assert(line.parts.every(part=>part.kind==='text'||sheet.gaps.some(g=>g.id===part.id)));
  }
  assert.equal(validVerifiedSegments(sheet.lines,undefined,m.sha256,m.duration),false,
   'Cannot play independently with fabricated timing');
  tested++;
 }
}
const noSpace=buildDictationSheet('Woman:Garden birds sing softly every morning.\nHost:Today visitors enjoy the river walk.',30);
assert(!noSpace.gaps.some(g=>['woman','host'].includes(g.answer.toLowerCase())),
 'No-space labels must never become dictation targets');
assert.equal(normalizeDictationAnswer('  You\u2019re. '),"you're");
assert.equal(splitDictationLines('').length,0);
assert.throws(()=>buildDictationSheet(manifest['LIS-A2-01'].source,50));
const app=read('app/listening-dictation.tsx');
const parent=read('app/foundation.tsx');
const st=read('scripts/qa-free-first.mjs');
for(const file of ['domain/listening-dictation.ts','domain/listening-turn-replay.ts','app/listening-dictation.tsx','app/foundation.tsx']){
 const parsed=ts.createSourceFile(file,read(file),ts.ScriptTarget.Latest,true,
  file.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 assert.equal(parsed.parseDiagnostics.length,0,file+' JS/TSX syntax errors');
}
assert(app.includes('data-learning-interaction="ListeningDictation"'));
assert(app.includes('prepareOriginalTurnReplay(lessonId,audioUrl,turns,controller.signal)'));
assert(app.includes("mediaState==='ready'&&ranges.length===turns.length"));
assert(app.includes('disabled={!playbackReady}'));
assert(app.includes('range.startMs/1000'));
assert(app.includes('▶ Full recording'));
assert(!app.includes('One sentence at a time'));
assert(app.includes('5')===false || app.includes('Light'));
assert(app.includes('Type the exact word spoken in the recording'),'NotebookLM MUST_FIX #2 exact learner instruction');
assert(app.includes('Literal Word Match'),'NotebookLM MUST_FIX #2 honest checking label');
assert(app.includes("setMode('light')")&&app.includes("setMode('focus')"),
 'Both owner-accepted compact modes must be selectable');
assert(app.includes('setAnswers({});setChecked(false)'),
 'Changing compact mode/attempt must clear stale checking');

assert(app.includes('Check exact words'));
assert(app.includes('Answers stay in memory'));
assert(!/fetch\(|foundationRequest|localStorage|setItem\(|\.score\s*=|playbackCompleted|tutorService|new Audio\(/.test(app));
const helper=read('domain/listening-turn-replay.ts');
assert(helper.includes("actual!==asset.sha256"),'Actual MP3 SHA must match original');
assert(helper.includes("if(eligible.length<n)return []"),'No invented speaker-turn cuts');
assert(helper.includes('fetch(url'), 'Read audio for local decoding only after scored UI mount');
assert(!helper.includes('localStorage')&&!helper.includes('POST')&&!helper.includes('/api/foundation'));
assert(!app.includes("from '../content/foundation-audio.json'"),'No source transcript shipped in client');
assert(parent.includes("attempt.status==='scored'&&<section aria-label=\"Post-submission Listening practice\""),
 'Must render only after graded submission');
assert(parent.includes("if(!attempt||attempt.status!=='scored'||lesson?.module!=='listening')return;"),
 'Gated transcript authorization before any dictation state');
assert(parent.includes("currentAttemptRef.current!==requestedAttemptId"),'Stale attempt transcript must be ignored');
assert(parent.includes("<ListeningDictationPractice"));
assert(parent.includes("lessonId={lesson.id}"),'The scored lesson ID must bind the original MP3');
assert(parent.includes("key={'post-submit-dictation-'+attempt.id+'-'+attempt.version}"),'Attempt pinned');
assert(parent.includes("Read transcript after submission"));
assert(parent.includes("Play full audio"));
assert(parent.includes("audio.current?.pause()"),'Existing playback control unchanged');
assert(!app.includes("from '../content/foundation-audio.json'"),'Never bundle transcript in client');
assert(st.includes('listening-dictation-contract.cjs'),'Mandatory core QA registered');
assert(st.includes('listening-turn-compact.cjs'),'Owner-approved turn replay core QA registered');
console.log(JSON.stringify({result:'PASS',gate:'SLE_POST_SUBMIT_DICTATION_SOURCE_CONTRACT',
 lessons:ids,scenarios:tested,densities:[10,20,30],literalFeedbackOnly:true,
 sourceFromScoredServer:true,segmentModeGate:'ORIGINAL_SHA_AND_AUDIO_TURNS_REQUIRED',
 evidenceWrites:0,AIRequests:0,fireBaseLive:false}));
