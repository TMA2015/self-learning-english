'use strict';
/**
 * Verify suggestion-only MP3 audio analysis against three original source files.
 * Exported timings are NEVER called verified/approved or imported into student UI.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const manifest=require('../content/foundation-audio.json');
const {parseSilenceLog,estimateCuts}=require('../scripts/propose-listening-segments.cjs');
const ids=['LIS-A1-03','LIS-A2-01','LIS-B1-01'];
const sampleLog='[Parsed_silencedetect_0] silence_start: 0.900\n'+
 '[Parsed_silencedetect_0] silence_end: 1.300 | silence_duration: 0.400\n'+
 '[Parsed_silencedetect_0] silence_start: 4.300\n'+
 '[Parsed_silencedetect_0] silence_end: 4.850 | silence_duration: 0.550\n'+
 '[Parsed_silencedetect_0] silence_start: 7.450\n'+
 '[Parsed_silencedetect_0] silence_end: 8.000 | silence_duration: 0.550';
const gaps=parseSilenceLog(sampleLog,10);
assert.equal(gaps.length,3);
const cuts=estimateCuts(['Teacher: Welcome to the class','Student: Thank you','Teacher: Enjoy your afternoon'],gaps,10);
assert.equal(cuts.length,2);
assert(cuts[0]>0&&cuts[1]>cuts[0]&&cuts[1]<10000);
assert.equal(estimateCuts(['A: Hi','B: Bye','A: Great'],[],10).length,0,'No fake evenly spaced positions if actual audio lacks pauses');
const output=cp.execFileSync(process.execPath,['scripts/propose-listening-segments.cjs',...ids],
 {cwd:root,encoding:'utf8',timeout:120000,maxBuffer:1024*1024});
const receipt=JSON.parse(output);
assert.equal(receipt.result,'PASS');
assert.equal(receipt.verifiedSegments,0);
assert.equal(receipt.releaseAuthorized,false);
assert.equal(receipt.suggestions.length,3);
let proposalCount=0;
for(const id of ids){
 const p=path.join(root,'.sites-runtime/listening-segment-audit',id+'-silence-suggestions.json');
 assert(fs.existsSync(p),id+' local candidate absent');
 const cand=JSON.parse(fs.readFileSync(p,'utf8'));
 assert.equal(cand.status,'CANDIDATE_UNVERIFIED');
 assert.equal(cand.productionEnabled,false);
 assert.equal(cand.independentAudioVerified,false);
 assert.equal(cand.lessonId,id);
 assert.equal(cand.assetSha256,manifest[id].sha256);
 assert.equal(cand.assetUrl,manifest[id].url);
 assert.equal(cand.algorithm.kind,'UNVERIFIED_SILENCE_HEURISTIC');
 assert(cand.algorithm.gapCount>=0);
 assert(cand.expectedLines>=2);
 assert([0,cand.expectedLines].includes(cand.segments.length),
  'Missing reliable silence should result in NO suggested segments, not guessed offsets');
 let prev=0;
 for(const seg of cand.segments){
  assert.equal(seg.replayChecked,false);
  assert.equal(seg.verified,false);
  assert.equal(seg.assetSha256,manifest[id].sha256);
  assert(Number.isInteger(seg.startMs)&&Number.isInteger(seg.endMs));
  assert(seg.startMs>=prev&&seg.endMs>seg.startMs);
  assert(seg.endMs<=Math.round(cand.durationSeconds*1000)+150);
  prev=seg.endMs;
 }
 proposalCount+=cand.segments.length;
}
const html=fs.readFileSync(path.join(root,'tools/listening-segment-audit.template.html'),'utf8');
assert(html.includes('Optional: import silence-assisted candidate JSON'));
assert(html.includes('value.status!=="CANDIDATE_UNVERIFIED"'));
assert(html.includes('value.productionEnabled!==false'));
assert(html.includes('value.lessonId!==auditData.lessonId'));
assert(html.includes('value.assetSha256!==auditData.sha256'));
assert(html.includes('Math.abs(value.durationSeconds-actualDuration)>0.5'));
assert(html.includes('rows[i].replayChecked=false;'), 'Imported suggestions must NEVER be treated as verified');
assert(html.includes('if(!allValid())return;'),'Manual export should stay behind replay gates');
const app=fs.readFileSync(path.join(root,'app/listening-dictation.tsx'),'utf8');
assert(!app.includes('silence-suggestions'));
assert(!app.includes('propose-listening-segments'));
assert(!app.includes('SILENCE_HEURISTIC'));
assert(app.includes('disabled={!enabledSegments}'),'Student sentence replay must remain gated');
assert(fs.readFileSync(path.join(root,'scripts/qa-free-first.mjs'),'utf8')
 .includes('listening-silence-suggestions.cjs'));
console.log(JSON.stringify({result:'PASS',gate:'SLE_LISTENING_SILENCE_SUGGESTIONS_UNVERIFIED',
 lessons:ids,transcriptSourceUnchanged:true,proposalCount,
 producerStatus:'CANDIDATE_UNVERIFIED',studentPlayerChanges:0,
 useInGradedAttempt:false,releaseAuthorized:false,details:receipt.suggestions}));
