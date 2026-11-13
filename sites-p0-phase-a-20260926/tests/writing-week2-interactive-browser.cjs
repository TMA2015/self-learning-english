'use strict';
/**
 * Native Chromium synthetic UI acceptance for Writing Week 2.
 * Tests actual React interaction at fixed 320 / 768 CSS content widths.
 * Does NOT claim production, real iPad/Safari or persistence of optional scratchpads.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const cp=require('node:child_process');
const http=require('node:http');
const root=path.resolve(__dirname,'..');

(async()=>{
  const {build}=await import('vite');
  const out=path.join(root,'.sites-runtime/writing-week2-interactive-browser');
  fs.rmSync(out,{recursive:true,force:true});
  await build({
    root,configFile:false,logLevel:'error',
    define:{'process.env.NODE_ENV':JSON.stringify('production')},
    build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
      lib:{entry:path.join(root,'tests/writing-week2-interactive-browser-entry.tsx'),
        formats:['iife'],name:'W2InteractiveBrowser',fileName:()=> 'bundle.js'}}
  });
  const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
  const originalCSS=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
  const index=originalCSS.indexOf(':root {');
  assert(index>=0,'Missing SLE CSS');
  const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser']
    .map(name=>{try{return cp.execFileSync('which',[name],{encoding:'utf8'}).trim()}catch{return ''}})
    .find(Boolean);
  if(!chrome)throw Error('Native Chromium required; cannot claim browser QA PASS');
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-w2-browser-'));
  const html='<!doctype html><html lang="en"><head><meta charset="utf-8">'+
    '<meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<style>'+originalCSS.slice(index).replaceAll('</style>','<\\/style>')+'</style></head><body>'+
    '<div id="app"></div><div id="sle-test-result">STARTED</div>'+
    '<script>window.addEventListener("error",e=>document.getElementById("sle-test-result").textContent="FAIL_JS "+e.message);'+
    'window.addEventListener("unhandledrejection",e=>document.getElementById("sle-test-result").textContent="FAIL_REJECTION "+e.reason);</script>'+
    '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
  let writes=0;
  const server=http.createServer((req,res)=>{
    if(req.method!=='GET'){writes++;res.writeHead(405).end('Synthetic browser QA read-only');return;}
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});
    res.end(html);
  });
  function run(url){
    return new Promise((resolve,reject)=>{
      const child=cp.spawn(chrome,['--headless=new','--no-sandbox',
        '--disable-dev-shm-usage','--disable-extensions','--disable-background-networking',
        '--no-first-run','--virtual-time-budget=40000','--dump-dom',
        '--window-size=1000,840','--user-data-dir='+profile,url],
        {stdio:['ignore','pipe','pipe']});
      let stdout='',stderr='',timedOut=false;
      const timer=setTimeout(()=>{timedOut=true;child.kill('SIGKILL')},40000);
      child.stdout.on('data',d=>stdout+=String(d));
      child.stderr.on('data',d=>stderr+=String(d));
      child.on('error',reject);
      child.on('close',code=>{
        clearTimeout(timer);
        if(timedOut||code!==0)return reject(Error('Chromium '+code+' '+stderr.slice(-450)));
        const result=stdout.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
        if(!result.startsWith('PASS_W2 '))return reject(Error('Week 2 Chromium failure: '+result.slice(0,1300)));
        try{resolve(JSON.parse(result.slice('PASS_W2 '.length)))}catch(e){reject(e)}
      });
    });
  }
  try{
    await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
    const base='http://127.0.0.1:'+server.address().port;
    const cases=[['learn',320],['sort',320],['editor',320],['editor',768],['legacy',320],['compare',320]];
    const results=[];
    for(const [phase,width] of cases){
      results.push(await run(base+'/?phase='+phase+'&width='+width));
    }
    assert.equal(results.length,6);
    assert.equal(writes,0,'Browser fixture must not make POST or mutate learner data');
    console.log(JSON.stringify({result:'PASS',gate:'W2_INTERACTIVE_NATIVE_CHROMIUM',
      cases:results,cssContentWidths:[320,768],actualTouchDevice:'NOT_TESTED',
      realSafari:'NOT_TESTED',realStorage:'NOT_TESTED',serverWrites:0,
      productionWrites:0,syntheticOnly:true}));
  }finally{
    server.close();
    fs.rmSync(profile,{recursive:true,force:true,maxRetries:3,retryDelay:60});
  }
})().catch(e=>{console.error(e);process.exitCode=1});
