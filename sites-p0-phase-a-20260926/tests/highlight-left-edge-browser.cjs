'use strict';
/**
 * Native Chromium CSS check: all representative colored lesson callouts have
 * left accents, never a top highlight. Synthetic DOM; no account or LIVE writes.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const cp=require('node:child_process'),http=require('node:http');
const root=path.resolve(__dirname,'..');
(async()=>{
 const raw=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
 const start=raw.indexOf(':root {');
 assert(start>=0,'SLE stylesheet missing');
 const css=raw.slice(start);
 const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(name=>{try{return cp.execFileSync('which',[name],{encoding:'utf8'}).trim()}catch{return ''}})
  .find(Boolean);
 if(!chrome)throw Error('Native Chromium required; do not report visual QA PASS without it');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-highlight-left-'));
 let forbiddenWrites=0;
 const html='<!doctype html><html lang="en"><head><meta charset="utf-8">'+
  '<meta name="viewport" content="width=device-width,initial-scale=1">'+
  '<style>'+css.replaceAll('</style>','<\/style>')+'</style></head><body>'+
  '<main id="fixture" style="max-width:100%">'+
   '<section class="gdp-shell"><div class="gdp-card gdp-mistakes" data-accent="mistakes-standalone">Common mistakes in standalone notes</div></section>'+
   '<section class="gdp-integrated"><div class="gdp-card gdp-mistakes" data-accent="mistakes-integrated">Common mistakes in lesson notes</div></section>'+
   '<section class="gdp-preview-note" data-accent="preview-help">Preview teaching note</section>'+
   '<section class="sle-rgw-model" data-accent="rgw-model">Independent worked example</section>'+
   '<section class="sle-vocab-demo" data-accent="vocab-demo">Vocabulary worked example</section>'+
   '<div class="sle-unit-browser"><div class="unit-checkpoint-note" data-accent="unit-checkpoint">Checkpoint note</div></div>'+
   '<section class="foundation-hint-content"><p data-accent="hint">Learning hint</p></section>'+
   '<div class="exercise" data-accent="review">Review guidance</div>'+
  '</main><div id="sle-test-result">STARTED</div>'+
  '<script>(function(){try{'+
   'var root=document.getElementById("fixture");'+
   'var nodes=Array.from(document.querySelectorAll("[data-accent]"));'+
   'if(nodes.length!==8)throw Error("Expected eight highlighted callouts");'+
   'for(var el of nodes){var s=getComputedStyle(el);var left=parseFloat(s.borderLeftWidth);'+
    'var top=parseFloat(s.borderTopWidth);'+
    'if(!(left>=3))throw Error(el.dataset.accent+": left "+left+"px");'+
    'if(!(top<=2))throw Error(el.dataset.accent+": top "+top+"px");'+
   '}'+
   'for(var id of ["mistakes-standalone","mistakes-integrated"]){'+
    'var s=getComputedStyle(document.querySelector("[data-accent="+id+"]"));'+
    'if(s.borderLeftWidth!=="4px"||s.borderLeftColor!=="rgb(200, 139, 73)")'+
     'throw Error(id+": lost original orange color on left");'+
    'if(s.borderTopWidth!=="1px"||s.borderTopColor===s.borderLeftColor)'+
     'throw Error(id+": top border is still highlighted");'+
   '}'+
   'var width=Number(new URLSearchParams(location.search).get("width"));'+
   'if(root.getBoundingClientRect().width>width+2||root.scrollWidth>width+2)'+
    'throw Error("Content overflow at "+width);'+
   'document.getElementById("sle-test-result").textContent="PASS_LEFT_ACCENTS_"+width+"_"+nodes.length;'+
  '}catch(e){document.getElementById("sle-test-result").textContent="FAIL "+String(e)}})();</script>'+
  '</body></html>';
 const server=http.createServer((req,res)=>{
  if(req.method!=='GET'){forbiddenWrites++;res.writeHead(405).end('Read-only QA');return;}
  const width=Number(new URL(req.url,'http://localhost').searchParams.get('width'));
  const rendered=html.replace('id="fixture" style="max-width:100%"',
   'id="fixture" style="width:'+width+'px;max-width:100%"');
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});
  res.end(rendered);
 });
 async function inspect(url){
  return await new Promise((resolve,reject)=>{
   const p=cp.spawn(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
    '--disable-extensions','--disable-background-networking','--no-first-run',
    '--virtual-time-budget=16000','--dump-dom','--window-size=1024,900',
    '--user-data-dir='+profile,url],{stdio:['ignore','pipe','pipe']});
   let out='',err='',expired=false;
   const deadline=setTimeout(()=>{expired=true;p.kill('SIGKILL')},30000);
   p.stdout.on('data',data=>out+=String(data));
   p.stderr.on('data',data=>err+=String(data));
   p.on('error',reject);
   p.on('close',code=>{
    clearTimeout(deadline);
    if(expired||code!==0)return reject(Error('Chromium exit '+code+' '+err.slice(-500)));
    const match=out.match(/<div id="sle-test-result">([^<]*)<\/div>/);
    const status=match?.[1]??'';
    if(!status.startsWith('PASS_'))return reject(Error('Computed CSS failed: '+status.slice(0,600)));
    resolve(status);
   });
  });
 }
 try{
  await new Promise((resolve,reject)=>{
   server.once('error',reject);server.listen(0,'127.0.0.1',resolve);
  });
  const base='http://127.0.0.1:'+server.address().port;
  const cases=[];
  for(const width of [320,768]){
   cases.push({width,status:await inspect(base+'/?width='+width)});
  }
  assert.equal(forbiddenWrites,0);
  console.log(JSON.stringify({
   result:'PASS',gate:'SLE_HIGHLIGHT_LEFT_EDGE_CHROMIUM',
   cases,highlightedCalloutsPerCase:8,
   originalCommonMistakesOrangePreserved:true,topBarRemoved:true,
   cssContentWidths:[320,768],actualSafari:'NOT_TESTED',
   appWrites:0,liveDeployment:false
  }));
 }finally{
  server.close();
  fs.rmSync(profile,{recursive:true,force:true,maxRetries:3,retryDelay:60});
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
