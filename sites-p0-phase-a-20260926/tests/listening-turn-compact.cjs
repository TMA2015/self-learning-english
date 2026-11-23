'use strict';
/** Compact owner-accepted speaker-turn Dictation; original audio and scored data untouched. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const load=(file)=>{
 const mod={exports:{}};
 const output=ts.transpileModule(read(file),{fileName:file,compilerOptions:{
  module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(output,{module:mod,exports:mod.exports,Math,Set,Map,Number,String,Error,
  Float32Array,Uint8Array,URL,Object,Array},{timeout:2000});
 return mod.exports;
};
const dict=load('domain/listening-dictation.ts');
const audio=load('domain/listening-turn-replay.ts');
const manifest=require('../content/foundation-audio.json');
const lessons=[
 {id:'LIS-A1-03',turns:9,light:5,focus:9,filename:'LIS-A1-03-v1.mp3'},
 {id:'LIS-A2-01',turns:7,light:4,focus:7,filename:'LIS-A2-01-v2.mp3'},
 {id:'LIS-B1-01',turns:6,light:4,focus:6,filename:'LIS-B1-01-v2.mp3'}
];
for(const lesson of lessons){
 const source=manifest[lesson.id].source;
 assert.equal(dict.splitSpeakerTurns(source).length,lesson.turns);
 const meta=audio.ORIGINAL_TURN_ASSETS[lesson.id];
 assert.equal(meta.filename,lesson.filename);
 assert.equal(meta.sha256,manifest[lesson.id].sha256);
 assert.equal(meta.turnCount,lesson.turns);
 assert.equal(meta.duration,manifest[lesson.id].duration);
 assert.equal(audio.originalAssetMatchesUrl(lesson.id,manifest[lesson.id].url),true);
 assert.equal(audio.originalAssetMatchesUrl(lesson.id,'/foundation-audio/WRONG.mp3'),false);
 for(const mode of ['light','focus']){
  const sheet=dict.buildTurnDictationSheet(source,lesson.id,mode);
  const copy=dict.buildTurnDictationSheet(source,lesson.id,mode);
  assert.equal(JSON.stringify(sheet),JSON.stringify(copy),'No randomized client cloze answers');
  assert.equal(sheet.lines.length,lesson.turns);
  assert.equal(sheet.gaps.length,lesson[mode]);
  assert.equal(new Set(sheet.gaps.map(x=>x.lineId)).size,sheet.gaps.length,
   'One word maximum per speaker turn');
  assert(!sheet.gaps.some(x=>/^(?:A|B|Woman|Man|Host|Guest)$/i.test(x.answer)),
   'Speaker label must never become hidden answer');
  const byId=Object.fromEntries(sheet.gaps.map(g=>[g.id,g.answer]));
  const results=dict.checkDictationAnswers(sheet,byId);
  assert.equal(results.filter(x=>x.correct).length,sheet.gaps.length);
  assert.equal(dict.checkDictationAnswers(sheet,{})[0].correct,false);
  for(let i=0;i<sheet.lines.length;i++){
   const line=sheet.lines[i];
   const full=line.parts.map(p=>p.kind==='text'?p.text:byId[p.id]).join('');
   assert.equal(full,dict.splitSpeakerTurns(source)[i]);
   assert(/^\s*[A-Za-z]+:/.test(line.parts[0].text));
  }
 }
}
// A true speaker pause yields two ordered clip ranges with a short safety pad.
const testRanges=audio.estimateSpeakerTurnRanges([
 'A: Please bring original sandwiches on Monday.',
 'B: Thank you for arranging the library workshop.'
],6,[{t:2.9,width:.3}]);
assert.equal(testRanges.length,2);
assert(testRanges[0].endMs>testRanges[1].startMs,
 'Short overlap pad may preserve beginning/end syllables');
assert.equal(audio.estimateSpeakerTurnRanges(['A: Hi.','B: Bye.'],6,[]).length,0,
 'No fabrication if MP3 pauses are missing');
assert.equal(audio.estimateSpeakerTurnRanges(['A: Hello.','B: Thanks.','A: Bye.'],6,
 [{t:2.9,width:.3}]).length,0,'No fake cuts with too few MP3 silences');
const app=read('app/listening-dictation.tsx');
const parent=read('app/foundation.tsx');
assert(app.includes('data-learning-interaction="ListeningDictation"'));
assert(app.includes("mediaState==='ready'&&ranges.length===turns.length"));
assert(app.includes('disabled={!playbackReady}'));
assert(app.includes('range.startMs/1000'));
assert(app.includes('nextInput(event.currentTarget)'));
assert(app.includes('Type the exact word spoken in the recording'));
assert(app.includes('Literal Word Match'));
assert(app.includes('never change scored work'));
assert(app.includes('setMode(\'light\')')&&app.includes('setMode(\'focus\')'));
assert(!/localStorage|sessionStorage|fetch\(|\/api\/foundation|setItem\(/.test(app),
 'The React practice widget must never make a score API or persistence request');
assert(parent.includes("attempt.status==='scored'&&<section aria-label=\"Post-submission Listening practice\""));
assert(parent.includes("if(!attempt||attempt.status!=='scored'||lesson?.module!=='listening')return;"));
assert(parent.includes("key={'post-submit-dictation-'+attempt.id+'-'+attempt.version}"));
assert(parent.includes('lessonId={lesson.id}'));
const rawCSS=read('app/listening-dictation.css');
assert(rawCSS.includes('.sle-turn-gap')&&rawCSS.includes('font-size:14px'));
assert(read('scripts/qa-free-first.mjs').includes('listening-turn-compact.cjs'));
console.log(JSON.stringify({result:'PASS',gate:'SLE_COMPACT_OWNER_ACCEPTED_TURNS',
 lessons:lessons.map(x=>({id:x.id,turns:x.turns,light:x.light,extra:x.focus})),
 originalShaMatchesManifest:true,sourceOnlyAfterScored:true,
 failClosedWithoutRealSilences:true,zeroScoredWrites:true,noClientAnswerBank:true,
 physicalSafari:'NOT_TESTED',firebaseDeploy:false}));
