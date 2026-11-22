'use strict';
/**
 * Offline QA preparatory bridge: propose speaker-TURN timing from actual
 * MP3 silences, then manually refine sentence boundaries within each turn.
 * Never promoted to verifiedSegments or learner-facing media.
 */
const fs=require('node:fs'),path=require('node:path');
const manifest=require('../content/foundation-audio.json');
const {createCandidate,verifyOriginal}=require('./propose-listening-segments.cjs');
const root=path.resolve(__dirname,'..');
const PILOTS=['LIS-A1-03','LIS-A2-01','LIS-B1-01'];
function speakerTurns(source){
 return source.replace(/\r\n?/g,'\n').split(/\n+/).map(x=>x.trim()).filter(Boolean);
}
function build(){
 const requested=process.argv.slice(2),ids=requested.length?requested:PILOTS;
 const template=fs.readFileSync(path.join(root,'tools/listening-segment-audit.template.html'),'utf8');
 if(!template.includes('const auditData=__LESSON_DATA__;'))
  throw Error('Untrusted/missing audit template placeholder');
 const output=path.join(root,'.sites-runtime/listening-segment-audit');
 fs.mkdirSync(output,{recursive:true});
 const summary=[];
 for(const lessonId of ids){
  if(!PILOTS.includes(lessonId))throw Error('Turn audit outside 3 pilot lessons');
  const {meta}=verifyOriginal(lessonId);
  const turns=speakerTurns(meta.source);
  if(turns.length<2)throw Error('Insufficient turn boundaries');
  // Existing real-MP3 analyzer; substituted grouping changes only the
  // number of *unverified proposal targets*, not the student UI.
  const candidate=createCandidate(lessonId,speakerTurns);
  if(candidate.expectedLines!==turns.length||candidate.assetSha256!==meta.sha256)
   throw Error('Source/MP3 invariant failed');
  const outCandidate={
   ...candidate,schema:'sle-listening-turn-boundary-candidate-v1',
   status:'CANDIDATE_UNVERIFIED',productionEnabled:false,
   independentAudioVerified:false,reviewLevel:'SPEAKER_TURN_ONLY',
   explicitlyNotSentenceAligned:true,
   algorithm:{...candidate.algorithm,
    note:'Silences may help speaker-turn review only. Every turn and then each internal sentence still needs manual audio QA.'},
   segments:candidate.segments.map((seg,i)=>({
    ...seg,sourceSpeakerTurn:i+1,replayChecked:false,verified:false
   }))
  };
  const candidateName=lessonId+'-turn-suggestions.json';
  fs.writeFileSync(path.join(output,candidateName),JSON.stringify(outCandidate,null,2)+'\n','utf8');
  const payload={lessonId,url:meta.url,sha256:meta.sha256,
   duration:meta.duration,lines:turns};
  const json=JSON.stringify(payload).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028');
  const html=template.replace('__LESSON_DATA__',json);
  if(html.includes('__LESSON_DATA__'))throw Error('Template token escaped incorrectly');
  const htmlName=lessonId+'-turn-offline-audit.html';
  fs.writeFileSync(path.join(output,htmlName),html,'utf8');
  summary.push({lessonId,sourceSpeakerTurns:turns.length,
   actualDetectedSilences:candidate.algorithm.gapCount,
   unverifiedTurnRanges:outCandidate.segments.length,
   status:'CANDIDATE_UNVERIFIED',
   independentAudioVerified:false,productionEnabled:false,
   candidateFile:path.relative(root,path.join(output,candidateName)),
   offlineHtml:path.relative(root,path.join(output,htmlName))});
 }
 console.log(JSON.stringify({result:'PASS',gate:'SLE_LISTENING_TURN_AUDIT_STAGING',
  lessons:summary,verifiedSegments:0,automaticSentenceAlignment:false,
  studentPlayerModified:false,releaseAuthorized:false}));
}
module.exports={speakerTurns};
if(require.main===module){try{build()}catch(e){console.error(e);process.exitCode=1}}
