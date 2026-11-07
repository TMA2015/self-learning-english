'use strict';
/*
 * Unit 10 real Chrome HTMLAudioElement decoder/play-to-end smoke.
 * This is NOT the full MEDIA-01 scored learner/player/Safari gate.
 * Uses only immutable MP3 bytes from the Draft PR, localhost, a throwaway
 * browser profile and no app account, learner data, network AI or deployment.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const http=require('node:http'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const receipts=require('../content/batches/unit10-owner-audio-receipts-20261107.json');
const manifest=require('../content/foundation-audio.json');
const ids=['LIS-A1-06','LIS-A2-07','LIS-B1-08'];
assert.deepEqual(receipts.assets.map(a=>a.lesson_id),ids);
const files={};
for(const a of receipts.assets){
 const entry=manifest[a.lesson_id];
 assert(entry,a.lesson_id+' manifest entry missing');
 assert.equal(a.owner_audio_qa,'PASS','Owner hearing must remain separately recorded');
 assert.equal(a.rights_clearance_for_new_assets,'APPROVED','Owner granted scoped website rights for this exact hash');
 assert.equal(a.browser_playback,'NOT_TESTED','This is a new, independent partial browser check');
 assert.equal(a.source_text,entry.source);
 assert.equal(entry.sha256,a.sha256);
 assert.equal(entry.duration,a.decoded_seconds);
 assert.equal(entry.url,'/foundation-audio/'+a.lesson_id+'-v1.mp3');
 const file=path.join(root,'public',entry.url);
 const bytes=fs.readFileSync(file);
 assert.equal(bytes.length,a.byte_size);
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),a.sha256);
 files[a.lesson_id]={file,bytes,expected:entry.duration};
}
let chrome='';
for(const cmd of ['google-chrome','google-chrome-stable','chromium','chromium-browser']){
 try{chrome=cp.execFileSync('which',[cmd],{encoding:'utf8'}).trim();if(chrome)break;}catch{}
}
if(!chrome)throw Error('No native Chrome executable: browser MP3 smoke BLOCKED, never PASS');
function client(items){
 let reported=false;
 function report(result,details){
  if(reported)return;
  reported=true;
  fetch('/__result',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({result,details})}).catch(()=>{});
 }
 function play(item){
  return new Promise((resolve,reject)=>{
   const a=new Audio('/clip/'+encodeURIComponent(item.id)+'.mp3');
   a.muted=true; // silent in CI, still uses a real decoding/playback timeline
   a.preload='auto';
   let metadata=false;
   a.addEventListener('loadedmetadata',()=>{
    metadata=true;
    if(!Number.isFinite(a.duration)||Math.abs(a.duration-item.expected)>0.7)
     reject(Error(item.id+' bad media duration '+a.duration+' expected '+item.expected));
   },{once:true});
   a.addEventListener('error',()=>{
    reject(Error(item.id+' media error '+(a.error?.message||a.error?.code||'unknown')));
   },{once:true});
   a.addEventListener('ended',()=>{
    if(!metadata)return reject(Error(item.id+' ended without verified metadata'));
    if(a.currentTime+0.7<a.duration)return reject(Error(item.id+' ended early '+a.currentTime+'/'+a.duration));
    resolve({id:item.id,duration:a.duration,ended:true});
   },{once:true});
   a.play().catch(e=>reject(Error(item.id+' play() rejected: '+String(e))));
  });
 }
 Promise.all(items.map(play))
  .then(results=>report('PASS',results))
  .catch(error=>report('FAIL',{error:String(error)}));
}
const html='<!doctype html><html><head><meta charset="utf-8"></head><body>'+
 '<p>Unit 10 real browser MP3 decoding/play-to-end test; not production UI.</p>'+
 '<script>('+client.toString()+')('+JSON.stringify(ids.map(id=>({id,expected:files[id].expected})))+')</script>'+
 '</body></html>';
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-unit10-chrome-audio-'));
const server=http.createServer((req,res)=>{
 const url=(req.url||'/').split('?')[0];
 if(req.method==='POST'&&url==='/__result'){
  let body='';
  req.on('data',d=>body+=String(d));
  req.on('end',()=>{
   try{receive(JSON.parse(body));res.writeHead(200);res.end('recorded');}
   catch(e){res.writeHead(400);res.end(String(e));}
  });return;
 }
 if(req.method==='GET'&&url==='/'){
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});
  res.end(html);return;
 }
 if(req.method==='GET'&&url.startsWith('/clip/')){
  const id=url.slice('/clip/'.length).replace(/\.mp3$/,'');
  const asset=files[id];
  if(!asset || url!='/clip/'+id+'.mp3'){res.writeHead(404);res.end();return;}
  const total=asset.bytes.length;
  let start=0,end=total-1,code=200;
  const range=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range||'');
  if(range){
   start=Number(range[1]);
   end=range[2]?Number(range[2]):end;
   if(start>=total||end>=total||end<start){
    res.writeHead(416,{'Content-Range':'bytes */'+total});res.end();return;
   }
   code=206;
  }
  const headers={'Content-Type':'audio/mpeg','Accept-Ranges':'bytes',
   'Cache-Control':'no-store','Content-Length':end-start+1};
  if(code===206)headers['Content-Range']='bytes '+start+'-'+end+'/'+total;
  res.writeHead(code,headers);res.end(asset.bytes.subarray(start,end+1));return;
 }
 res.writeHead(404);res.end('Not found');
});
let receive=()=>{};
(async()=>{
 let browser;
 let timeout;
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const port=server.address().port;
  const completion=new Promise((resolve,reject)=>{
   receive=result=>{if(result?.result==='PASS')resolve(result);else reject(Error(JSON.stringify(result)));};
   timeout=setTimeout(()=>reject(Error('Browser MP3 decode/play-to-end timed out at 90s')),90000);
  });
  browser=cp.spawn(chrome,[
   '--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu',
   '--no-first-run','--disable-extensions','--disable-background-networking',
   '--autoplay-policy=no-user-gesture-required','--mute-audio',
   '--user-data-dir='+profile,
   'http://127.0.0.1:'+port+'/'
  ],{stdio:['ignore','ignore','pipe']});
  let stderr='';
  browser.stderr.on('data',d=>{stderr=(stderr+String(d)).slice(-2000);});
  browser.on('error',e=>{receive({result:'FAIL',details:{error:String(e)}});});
  browser.on('close',code=>{
   if(code!==0)receive({result:'FAIL',details:{error:'Chrome exit '+code+' '+stderr.slice(-600)}});
  });
  const outcome=await completion;
  assert.deepEqual(outcome.details.map(x=>x.id),ids);
  assert(outcome.details.every(x=>x.ended));
  console.log(JSON.stringify({
   result:'PASS',gate:'UNIT10_CHROME_AUDIO_CODEC_PLAY_TO_END',
   browser:path.basename(chrome),decodedAndPlayedToEnd:ids,
   ownerHearing:'ALL_THREE_PASS',rights:'SCOPED_OWNER_APPROVED',fullMedia01:'NOT_TESTED',
   actualProductPlayer:'NOT_TESTED',learnerDataTouched:false,productionRelease:'NO_GO'
  }));
 }finally{
  clearTimeout(timeout);
  if(browser && !browser.killed)browser.kill('SIGKILL');
  server.close();
  try{fs.rmSync(profile,{recursive:true,force:true});}catch{}
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
