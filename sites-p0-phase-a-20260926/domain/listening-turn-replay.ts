/**
 * Original-MP3 speaker-turn navigation only. This is an optional, UNSCORED
 * post-submit aid, not the Listening full-track playback verification.
 *
 * Same RMS silence detection and monotonic cut selection as the owner-accepted
 * offline A/B-turn v2 prototype. No guessed equal/proportional fallback cuts.
 */
export type TurnRange={startMs:number;endMs:number};
export type OriginalTurnAsset={filename:string;sha256:string;duration:number;turnCount:number};
export const ORIGINAL_TURN_ASSETS:Readonly<Record<string,OriginalTurnAsset>>=Object.freeze({
 'LIS-A1-03':{filename:'LIS-A1-03-v1.mp3',
  sha256:'7659ec83a5c67a483333304f59730c8061583051311d8fd7ac3e1145e9722f02',
  duration:32.475,turnCount:9},
 'LIS-A2-01':{filename:'LIS-A2-01-v2.mp3',
  sha256:'3f2bfa2166dd3e1386e41b4337ae7526adc13c13a3207114aa35e2439bdc1478',
  duration:30.575,turnCount:7},
 'LIS-B1-01':{filename:'LIS-B1-01-v2.mp3',
  sha256:'e14ebf40777dd8bc24ffde008c06ec1053089b9f7919c78c999be2a15e11de1e',
  duration:47.6,turnCount:6}
});
type Silence={t:number;width:number};
type AudioLike={sampleRate:number;duration:number;getChannelData:(channel:number)=>Float32Array};
export function turnPauseCandidates(buffer:AudioLike):Silence[]{
 const sr=buffer.sampleRate,ch=buffer.getChannelData(0);
 if(!sr||!ch.length||!Number.isFinite(buffer.duration))return [];
 const step=Math.max(1,Math.round(sr*.015));
 const rms:number[]=[];
 for(let i=0;i<ch.length;i+=step){
  let sum=0,count=0;
  for(let j=i;j<Math.min(i+step,ch.length);j+=Math.max(1,Math.floor(step/42))){
   sum+=ch[j]*ch[j];count++;
  }
  rms.push(Math.sqrt(sum/Math.max(1,count)));
 }
 const sorted=[...rms].sort((a,b)=>a-b);
 const q=sorted[Math.floor(sorted.length*.55)]||0;
 const threshold=Math.max(.00022,Math.min(.012,q*.28));
 const pauses:Silence[]=[];let begin=-1;
 for(let i=0;i<=rms.length;i++){
  const quiet=i<rms.length&&rms[i]<=threshold;
  if(quiet&&begin<0)begin=i;
  if(!quiet&&begin>=0){
   const width=(i-begin)*step/sr;
   if(width>=.07){
    const start=begin*step/sr,end=i*step/sr;
    if(start>.12&&end<buffer.duration-.12)pauses.push({t:(start+end)/2,width});
   }
   begin=-1;
  }
 }
 return pauses;
}
const wordPattern=/[A-Za-z]+(?:['’-][A-Za-z]+)*/g;
const turnWordCount=(line:string)=>Math.max(1,(line.replace(/^\s*[\p{L} .'-]{1,23}:\s*/u,'').match(wordPattern)||[]).length);
export function estimateSpeakerTurnRanges(
 turns:readonly string[],duration:number,pauses:readonly Silence[]
):TurnRange[]{
 const n=turns.length-1;
 if(n<1||n>30||!Number.isFinite(duration)||duration<=0)return [];
 const counts=turns.map(turnWordCount),total=counts.reduce((a,b)=>a+b,0);
 const targets:number[]=[];let running=0;
 for(let i=0;i<n;i++){running+=counts[i];targets.push(duration*running/total)}
 const minDistance=Math.min(.4,duration/(turns.length*3));
 const eligible=pauses.filter(p=>p.width>=.14&&p.t>minDistance&&p.t<duration-minDistance)
  .sort((a,b)=>a.t-b.t);
 if(eligible.length<n)return []; // Never fabricate sentence or turn offsets.
 const dp=Array.from({length:n},()=>Array(eligible.length).fill(Infinity));
 const back=Array.from({length:n},()=>Array(eligible.length).fill(-1));
 const scale=Math.max(.45,duration/(turns.length*1.5));
 const cost=(k:number,j:number)=>Math.abs(eligible[j].t-targets[k])/scale
  -1.35*Math.min(eligible[j].width,1.2);
 for(let j=0;j<eligible.length;j++)dp[0][j]=cost(0,j);
 for(let k=1;k<n;k++)for(let j=k;j<eligible.length;j++)
  for(let h=k-1;h<j;h++){
   if(eligible[j].t-eligible[h].t<minDistance)continue;
   const candidate=dp[k-1][h]+cost(k,j);
   if(candidate<dp[k][j]){dp[k][j]=candidate;back[k][j]=h}
  }
 let best=Infinity,j=-1;
 for(let k=n-1;k<eligible.length;k++)if(dp[n-1][k]<best){best=dp[n-1][k];j=k}
 if(j<0||!Number.isFinite(best))return [];
 const cuts=Array(n).fill(0);
 for(let k=n-1;k>=0;k--){cuts[k]=eligible[j].t;j=back[k][j]}
 const edges=[0,...cuts,duration];
 const segments:TurnRange[]=[];
 for(let i=0;i<turns.length;i++){
  const startMs=Math.round(Math.max(0,edges[i]-.045)*1000);
  const endMs=Math.round(Math.min(duration,edges[i+1]+.045)*1000);
  if(!Number.isSafeInteger(startMs)||!Number.isSafeInteger(endMs)||
   endMs-startMs<300||(i>0&&edges[i]<=edges[i-1]))return [];
  segments.push({startMs,endMs});
 }
 return segments;
}
export function originalAssetMatchesUrl(lessonId:string,url:string):boolean{
 const asset=ORIGINAL_TURN_ASSETS[lessonId];
 if(!asset)return false;
 try{
  const path=new URL(url,'https://audio.invalid').pathname;
  return path==='/foundation-audio/'+asset.filename;
 }catch{return false}
}
/**
 * Called ONLY by an explicit tap inside the after-scoring Dictation component.
 * Verify actual MP3 SHA before decoding. Fails closed; whole-track audio stays.
 */
export async function prepareOriginalTurnReplay(
 lessonId:string,url:string,turns:readonly string[],
 signal?:AbortSignal
):Promise<TurnRange[]>{
 const asset=ORIGINAL_TURN_ASSETS[lessonId];
 if(!asset||turns.length!==asset.turnCount||!originalAssetMatchesUrl(lessonId,url))
  throw Error('Source MP3 or approved speaker-turn count differs from pilot manifest.');
 if(!globalThis.crypto?.subtle)throw Error('Secure SHA-256 verification is unavailable.');
 const AudioCtor=window.AudioContext;
 if(!AudioCtor)throw Error('This browser cannot decode the original MP3.');
 // Construct in the user gesture before the first await (iOS Safari).
 const ctx=new AudioCtor();
 try{
  const response=await fetch(url,{credentials:'same-origin',signal});
  if(!response.ok)throw Error('Original MP3 could not be downloaded.');
  const length=Number(response.headers.get('content-length')||0);
  if(length>6_000_000)throw Error('Audio file unexpectedly large.');
  const bytes=await response.arrayBuffer();
  if(bytes.byteLength<10000||bytes.byteLength>6_000_000)
   throw Error('Unexpected original MP3 file size.');
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  const actual=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
  if(actual!==asset.sha256)throw Error('MP3 SHA-256 does not match approved original recording.');
  if(signal?.aborted)throw Error('Audio preparation cancelled.');
  const decoded=await ctx.decodeAudioData(bytes.slice(0));
  if(Math.abs(decoded.duration-asset.duration)>1.1)
   throw Error('Audio duration differs from original manifest.');
  const ranges=estimateSpeakerTurnRanges(turns,decoded.duration,turnPauseCandidates(decoded));
  if(ranges.length!==turns.length)throw Error('Could not identify every A/B speaker change safely.');
  if(signal?.aborted)throw Error('Audio preparation cancelled.');
  return ranges;
 }finally{await ctx.close().catch(()=>{})}
}
