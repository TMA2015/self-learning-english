'use strict';
/** Turn grouping is strictly an offline precursor to human sentence alignment. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const cp=require('node:child_process'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),manifest=require('../content/foundation-audio.json');
const {speakerTurns}=require('../scripts/build-listening-turn-audit.cjs');
const ids=['LIS-A1-03','LIS-A2-01','LIS-B1-01'];
const expected=[9,7,6];
assert.equal(speakerTurns('A: Hello.\nB: Goodbye.').length,2);
for(let i=0;i<ids.length;i++)
 assert.equal(speakerTurns(manifest[ids[i]].source).length,expected[i],
  'Speaker turns are physical manifest newline records, not guessed sentences');
const result=JSON.parse(cp.execFileSync(process.execPath,
 ['scripts/build-listening-turn-audit.cjs',...ids],{
 cwd:root,encoding:'utf8',timeout:120000,maxBuffer:1024*1024
}));
assert.equal(result.result,'PASS');
assert.equal(result.verifiedSegments,0);
assert.equal(result.releaseAuthorized,false);
assert.equal(result.automaticSentenceAlignment,false);
assert.equal(result.studentPlayerModified,false);
assert.equal(result.lessons.length,3);
let suggested=0;
for(let i=0;i<ids.length;i++){
 const id=ids[i],rec=result.lessons[i];
 assert.equal(rec.lessonId,id);
 assert.equal(rec.sourceSpeakerTurns,expected[i]);
 assert.equal(rec.status,'CANDIDATE_UNVERIFIED');
 assert.equal(rec.independentAudioVerified,false);
 assert.equal(rec.productionEnabled,false);
 assert.equal(rec.unverifiedTurnRanges===0||rec.unverifiedTurnRanges===expected[i],true);
 assert(rec.actualDetectedSilences>=0);
 const source=path.join(root,'.sites-runtime/listening-segment-audit');
 const cand=JSON.parse(fs.readFileSync(path.join(source,id+'-turn-suggestions.json'),'utf8'));
 const html=fs.readFileSync(path.join(source,id+'-turn-offline-audit.html'),'utf8');
 assert.equal(cand.schema,'sle-listening-turn-boundary-candidate-v1');
 assert.equal(cand.status,'CANDIDATE_UNVERIFIED');
 assert.equal(cand.productionEnabled,false);
 assert.equal(cand.independentAudioVerified,false);
 assert.equal(cand.explicitlyNotSentenceAligned,true);
 assert.equal(cand.reviewLevel,'SPEAKER_TURN_ONLY');
 assert.equal(cand.assetSha256,manifest[id].sha256);
 assert.equal(cand.expectedLines,expected[i]);
 assert.equal(cand.segments.length,rec.unverifiedTurnRanges);
 assert(cand.segments.every(s=>s.replayChecked===false&&s.verified===false&&
  s.assetSha256===manifest[id].sha256));
 assert(html.includes('const auditData='));
 assert(!html.includes('__LESSON_DATA__'));
 assert(html.includes('CANDIDATE_UNVERIFIED'));
 assert(html.includes('replayChecked=false;'));
 assert(!/\bfetch\(|XMLHttpRequest|sendBeacon|\/api\/foundation/.test(html));
 const match=html.match(/const auditData=(\{[\s\S]*?\});/);
 assert(match);
 const data=JSON.parse(match[1]);
 assert.equal(data.lines.length,expected[i]);
 assert.equal(data.sha256,manifest[id].sha256);
 suggested+=cand.segments.length;
}
const player=fs.readFileSync(path.join(root,'app/listening-dictation.tsx'),'utf8');
assert(player.includes('disabled={!enabledSegments}'));
assert(!player.includes('turn-suggestions'));
assert(!player.includes('build-listening-turn-audit'));
assert(fs.readFileSync(path.join(root,'scripts/qa-free-first.mjs'),'utf8')
 .includes('listening-turn-audit-staging.cjs'));
console.log(JSON.stringify({result:'PASS',gate:'SLE_LISTENING_UNVERIFIED_TURN_QA',
 turns:result.lessons.map(x=>({lesson:x.lessonId,turns:x.sourceSpeakerTurns,
  detectedSilences:x.actualDetectedSilences,unverifiedTurnRanges:x.unverifiedTurnRanges})),
 totalSuggestedTurnRanges:suggested,verifiedSegments:0,
 userFacingReplayEnabled:false,productionWrites:0}));
