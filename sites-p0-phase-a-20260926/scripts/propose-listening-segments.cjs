'use strict';
/**
 * Generate UNVERIFIED candidate phrase boundaries using actual MP3 silence.
 * Manual listening/replay is REQUIRED before considering per-sentence playback.
 * Does not output "verifiedSegments" or change the production player.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const manifest=require('../content/foundation-audio.json');
const PILOTS=['LIS-A1-03','LIS-A2-01','LIS-B1-01'];
const SETTINGS=Object.freeze({noise:'-35dB',minSilence:0.16,minPhrase:0.45});
const sane=(n)=>Number.isFinite(n)&&n>=0;
function parseSilenceLog(log,duration){
 const result=[],starts=[];
 for(const line of log.split(/\r?\n/)){
  const start=line.match(/silence_start:\s*(-?\d+(?:\.\d+)?)/);
  const end=line.match(/silence_end:\s*(\d+(?:\.\d+)?)/);
  if(start){starts.push(Math.max(0,Number(start[1])));continue}
  if(end&&starts.length){
   const a=starts.shift(),b=Number(end[1]);
   if(sane(a)&&sane(b)&&b>a&&a>=0&&b<=duration+0.5)
    result.push({start:a,end:Math.min(b,duration),mid:(a+b)/2,width:b-a});
  }
 }
 return result.filter(g=>g.start>0.25&&g.end<duration-0.25&&g.width>=SETTINGS.minSilence-0.005);
}
function estimateCuts(lines,gaps,duration){
 if(lines.length<2||gaps.length<lines.length-1)return [];
 // Word proportions are only an annotation heuristic, NEVER verified timings.
 const spoken=lines.map(line=>
  Math.max(1,(line.replace(/^\s*[\p{L}][\p{L} .'-]{0,22}:\s*/u,'')
   .match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g)||[]).length));
 const total=spoken.reduce((a,b)=>a+b,0);
 const wanted=spoken.slice(0,-1).map((_,i)=>duration*
  spoken.slice(0,i+1).reduce((a,b)=>a+b,0)/total);
 const ordered=[...gaps].sort((a,b)=>a.mid-b.mid)
  .filter(g=>g.mid>=SETTINGS.minPhrase&&g.mid<=duration-SETTINGS.minPhrase);
 const K=wanted.length,M=ordered.length;
 if(M<K)return [];
 // Exact monotonic DP: one unique gap per consecutive line boundary.
 const scores=Array.from({length:K},()=>Array(M).fill(Number.POSITIVE_INFINITY));
 const backs=Array.from({length:K},()=>Array(M).fill(-1));
 function cost(k,j){
  const g=ordered[j],distance=Math.abs(g.mid-wanted[k])/duration;
  const bonus=Math.min(g.width,1.5)/duration*.40;
  return distance-bonus;
 }
 for(let j=0;j<=M-K;j++)scores[0][j]=cost(0,j);
 for(let k=1;k<K;k++){
  for(let j=k;j<=M-K+k;j++){
   for(let previous=k-1;previous<j;previous++){
    if(ordered[j].mid-ordered[previous].mid<SETTINGS.minPhrase)continue;
    const cand=scores[k-1][previous]+cost(k,j);
    if(cand<scores[k][j]){scores[k][j]=cand;backs[k][j]=previous}
   }
  }
 }
 let j=-1,score=Number.POSITIVE_INFINITY;
 for(let n=K-1;n<M;n++){
  if(scores[K-1][n]<score){score=scores[K-1][n];j=n}
 }
 if(j<0||!Number.isFinite(score))return [];
 const used=Array(K).fill(0);
 for(let k=K-1;k>=0;k--){used[k]=ordered[j];j=backs[k][j]}
 const cuts=used.map(g=>Math.round(g.mid*1000));
 if(cuts.some((c,i)=>!Number.isSafeInteger(c)||c<=0||
  (i>0&&c<=cuts[i-1])||c>=Math.round(duration*1000)))return [];
 return cuts;
}
function verifyOriginal(id){
 if(!PILOTS.includes(id))throw Error('Outside three-pilot scope: '+id);
 const meta=manifest[id];
 if(!meta?.source||!meta.url?.startsWith('/foundation-audio/')||
  !meta.sha256||!sane(meta.duration))throw Error('Incomplete approved manifest entry: '+id);
 const pathname=path.join(root,'public',meta.url.slice(1));
 if(!fs.existsSync(pathname))throw Error('Original MP3 not found: '+id);
 const bytes=fs.readFileSync(pathname);
 if(crypto.createHash('sha256').update(bytes).digest('hex')!==meta.sha256)
  throw Error('SHA-256 mismatch for original MP3: '+id);
 const measured=Number(cp.execFileSync('ffprobe',['-v','error','-show_entries','format=duration',
  '-of','default=noprint_wrappers=1:nokey=1',pathname],{encoding:'utf8',timeout:20000}).trim());
 if(!sane(measured)||Math.abs(measured-meta.duration)>0.5)
  throw Error('Original audio duration mismatch: '+id);
 return {meta,pathname,measured};
}
function createCandidate(id,splitDictationLines){
 const {meta,pathname,measured}=verifyOriginal(id);
 const lines=splitDictationLines(meta.source);
 const ff=cp.spawnSync('ffmpeg',['-hide_banner','-nostats','-i',pathname,
  '-af',`silencedetect=noise=${SETTINGS.noise}:d=${SETTINGS.minSilence}`,
  '-f','null','-'],{encoding:'utf8',maxBuffer:8*1024*1024,timeout:30000});
 if(ff.error)throw ff.error;
 if(ff.status!==0)throw Error('FFmpeg analysis failed '+id+': '+String(ff.stderr).slice(-900));
 const gaps=parseSilenceLog(ff.stderr,measured),cuts=estimateCuts(lines,gaps,measured);
 const segments=cuts.length===lines.length-1?lines.map((_,i)=>({
  lineId:'L'+(i+1),startMs:i===0?0:cuts[i-1],
  endMs:i===cuts.length?Math.round(measured*1000):cuts[i],
  assetSha256:meta.sha256,replayChecked:false,verified:false
 })):[];
 const candidate={
  schema:'sle-listening-silence-assisted-candidate-v1',status:'CANDIDATE_UNVERIFIED',
  productionEnabled:false,independentAudioVerified:false,
  lessonId:id,assetUrl:meta.url,assetSha256:meta.sha256,
  durationSeconds:measured,expectedLines:lines.length,
  algorithm:{kind:'UNVERIFIED_SILENCE_HEURISTIC',noise:SETTINGS.noise,
   minSilenceSeconds:SETTINGS.minSilence,gapCount:gaps.length,
   selectedBoundaries:cuts.length,
   note:'Matches broad silences to transcript word proportions; must replay every segment and fix boundaries by ear'},
  segments
 };
 return candidate;
}
function main(){
 const ts=require('typescript'),vm=require('node:vm');
 const content=fs.readFileSync(path.join(root,'domain/listening-dictation.ts'),'utf8');
 const compiled=ts.transpileModule(content,{compilerOptions:{
  module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const mod={exports:{}};
 vm.runInNewContext(compiled,{exports:mod.exports,module:mod,Math,Set,Map,Number,String,Error},{timeout:2000});
 const split=mod.exports.splitDictationLines;
 const args=process.argv.slice(2),ids=args.length?args:PILOTS;
 const dest=path.join(root,'.sites-runtime/listening-segment-audit');
 fs.mkdirSync(dest,{recursive:true});
 const summary=[];
 for(const id of ids){
  const candidate=createCandidate(id,split);
  const filename=path.join(dest,id+'-silence-suggestions.json');
  fs.writeFileSync(filename,JSON.stringify(candidate,null,2)+'\n');
  summary.push({lessonId:id,transcriptLines:candidate.expectedLines,
   detectedSilences:candidate.algorithm.gapCount,
   unverifiedSegments:candidate.segments.length,
   status:candidate.status,productionEnabled:false,
   output:path.relative(root,filename)});
 }
 console.log(JSON.stringify({result:'PASS',gate:'SLE_SILENCE_CANDIDATES_ONLY',
  suggestions:summary,verifiedSegments:0,releaseAuthorized:false,
  transcriptLeakedToProduction:false}));
}
module.exports={parseSilenceLog,estimateCuts,createCandidate,verifyOriginal,SETTINGS};
if(require.main===module){try{main()}catch(e){console.error(e);process.exitCode=1}}
