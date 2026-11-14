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
    '<div id="app"></div><div id="sle-test-result" style="display:none">STARTED</div>'+
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
        const result=stdout.match(/<div id="sle-test-result"[^>]*>([\s\S]*?)<\/div>/)?.[1]??'';
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

    // CDP verifies the true CSS viewport, a real touch gesture and keyboard activation.
    // Chrome's --window-size=320 alone can retain a wider minimum innerWidth.
    async function verifyRealDeviceViewport(){
      if(typeof WebSocket!=='function')throw Error('Node 24 native WebSocket required for W2 device-emulated QA');
      const debugProfile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-w2-cdp-'));
      const browser=cp.spawn(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
        '--disable-extensions','--disable-background-networking','--no-first-run',
        '--remote-debugging-port=0','--remote-debugging-address=127.0.0.1',
        '--remote-allow-origins=*','--window-size=900,900',
        '--user-data-dir='+debugProfile,'about:blank'],{stdio:'ignore'});
      const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
      let socket=null,seq=0;
      const pending=new Map();
      const command=(method,params={})=>new Promise((resolve,reject)=>{
        const id=++seq;pending.set(id,{resolve,reject});
        socket.send(JSON.stringify({id,method,params}));
      });
      const evaluate=async(expression,allowTransient=false)=>{
        const a=await command('Runtime.evaluate',{expression,returnByValue:true});
        if(a.exceptionDetails){
          // Navigation can transiently expose an empty document before the
          // fixture's body/script exists; only readiness polling may retry.
          if(allowTransient)return null;
          const detail=a.exceptionDetails.exception?.description||a.exceptionDetails.text;
          throw Error('CDP evaluation exception '+detail);
        }
        return a.result?.value;
      };
      try{
        const activePort=path.join(debugProfile,'DevToolsActivePort');
        let port=0;
        for(let i=0;i<240;i++){
          if(browser.exitCode!==null)throw Error('Chromium CDP exited');
          if(fs.existsSync(activePort)){
            port=Number(fs.readFileSync(activePort,'utf8').split('\n')[0]);
            if(Number.isInteger(port)&&port>0)break;
          }
          await pause(40);
        }
        if(!port)throw Error('CDP debugging port unavailable');
        let page;
        for(let i=0;i<100;i++){
          const res=await fetch('http://127.0.0.1:'+port+'/json/list');
          const targets=await res.json();
          page=targets.find(t=>t.type==='page'&&t.webSocketDebuggerUrl);
          if(page)break;
          await pause(40);
        }
        if(!page)throw Error('CDP page target unavailable');
        socket=new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((resolve,reject)=>{
          socket.addEventListener('open',resolve,{once:true});
          socket.addEventListener('error',reject,{once:true});
        });
        socket.addEventListener('message',event=>{
          const value=JSON.parse(String(event.data));
          if(!value.id||!pending.has(value.id))return;
          const p=pending.get(value.id);pending.delete(value.id);
          if(value.error)p.reject(Error('CDP '+value.error.message));
          else p.resolve(value.result);
        });
        socket.addEventListener('close',()=>{
          for(const p of pending.values())p.reject(Error('CDP disconnected'));
          pending.clear();
        });
        await command('Page.enable');
        await command('Runtime.enable');
        const results=[];
        for(const [width,inputMode] of [[320,'touch'],[768,'keyboard']]){
          await command('Emulation.setDeviceMetricsOverride',{
            width,height:844,deviceScaleFactor:1,mobile:false,
            screenWidth:width,screenHeight:844
          });
          await command('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
          const suffix='/?phase=editor&width='+width;
          await command('Page.navigate',{url:base+suffix});
          let ready;
          for(let i=0;i<220;i++){
            const value=await evaluate('({status:document.getElementById("sle-test-result")?.textContent||"",href:location.href,inner:innerWidth,touch:navigator.maxTouchPoints,media400:matchMedia("(max-width:400px)").matches,htmlWidth:document.documentElement?.scrollWidth||0,bodyWidth:document.body?.scrollWidth||0,mapWidth:document.querySelector(".w2-map")?.getBoundingClientRect().width||0})',true);
            if(value?.status?.startsWith('FAIL'))throw Error('W2 '+inputMode+' viewport '+width+': '+value.status.slice(0,900));
            if(value?.status?.startsWith('PASS_W2 ')&&value.href.endsWith(suffix)){
              ready=value;break;
            }
            await pause(35);
          }
          if(!ready)throw Error('W2 true viewport '+width+' fixture did not complete');
          if(ready.inner!==width||ready.media400!==(width<=400)||ready.touch<1)
            throw Error('W2 CDP emulated viewport/touch mismatch '+JSON.stringify(ready));
          if(ready.htmlWidth>width+3||ready.bodyWidth>width+3){
            const overflow=await evaluate('Array.from(document.querySelectorAll("#app,#app *")).map(e=>({tag:e.tagName,cls:String(e.className).slice(0,70),right:Math.ceil(e.getBoundingClientRect().right),width:Math.ceil(e.getBoundingClientRect().width)})).filter(e=>e.right>innerWidth+3).sort((a,b)=>b.right-a.right).slice(0,6)');
            throw Error('W2 actual UI CSS viewport horizontal overflow '+width+'px: '+ready.htmlWidth+'/'+ready.bodyWidth+' offending='+JSON.stringify(overflow));
          }
          // CSS globally enables smooth scrolling. Wait for the actual target to
          // reach the emulated viewport before sending a physical touch/keyboard event.
          await evaluate('(()=>{const b=document.querySelector(".w2-map-idea button:not(:disabled)");if(!b)return false;document.documentElement.style.scrollBehavior="auto";document.body.style.scrollBehavior="auto";b.scrollIntoView({behavior:"instant",block:"center"});b.focus({preventScroll:true});return true})()');
          let target=null;
          for(let k=0;k<75;k++){
            target=await evaluate('(()=>{const b=document.querySelector(".w2-map-idea button:not(:disabled)");if(!b)return {error:"no enabled map choice"};const r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,width:r.width,height:r.height,scrollY:scrollY,visible:r.x>=0&&r.right<=innerWidth&&r.y>=0&&r.bottom<=innerHeight,focused:document.activeElement===b}})()');
            if(target.visible&&target.focused)break;
            await pause(40);
          }
          if(target.error||!target.visible||!target.focused||target.height<38)
            throw Error('W2 map input not accessible at '+width+': '+JSON.stringify(target));
          if(inputMode==='touch'){
            await command('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:target.x,y:target.y,id:1}]});
            await command('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
          }else{
            await command('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
            await command('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
          }
          let selected=false;
          for(let i=0;i<100;i++){
            const actual=await evaluate('window.qaGetWork?.()?.fields?.best');
            if(actual==='Art and drawing club'){selected=true;break}
            await pause(40);
          }
          if(!selected)throw Error('W2 '+inputMode+' did not select canonical idea at '+width+'px');
          results.push({width,inputMode,verifiedCssViewport:ready.inner,
            touchEmulation:true,activatedMapButton:true,noHorizontalOverflow:true,
            savedCanonicalSelection:true});
        }
        return results;
      }finally{
        if(socket&&socket.readyState===WebSocket.OPEN)socket.close();
        browser.kill('SIGTERM');
        for(let i=0;i<40&&browser.exitCode===null;i++)await pause(50);
        if(browser.exitCode===null)browser.kill('SIGKILL');
        fs.rmSync(debugProfile,{recursive:true,force:true,maxRetries:5,retryDelay:60});
      }
    }
    const trueViewportCases=await verifyRealDeviceViewport();
    assert.equal(trueViewportCases.length,2);

    console.log(JSON.stringify({result:'PASS',gate:'W2_INTERACTIVE_NATIVE_CHROMIUM',
      cases:results,trueViewportCases,cssContentWidths:[320,768],actualTouchDevice:'NOT_TESTED',
      realSafari:'NOT_TESTED',realStorage:'NOT_TESTED',serverWrites:0,
      productionWrites:0,syntheticOnly:true}));
  }finally{
    server.close();
    fs.rmSync(profile,{recursive:true,force:true,maxRetries:3,retryDelay:60});
  }
})().catch(e=>{console.error(e);process.exitCode=1});
