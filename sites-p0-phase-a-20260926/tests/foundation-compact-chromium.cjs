'use strict';
/* Native Chromium responsive quiz layout smoke; synthetic data only. */
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http');
const os=require('node:os'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const css=fs.readFileSync(path.join(root,'app/foundation-compact-lesson.css'),'utf8');
const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser']
 .map(name=>{try{return cp.execFileSync('which',[name],{encoding:'utf8'}).trim()}catch{return ''}})
 .find(Boolean);
if(!chrome)throw Error('Native Chromium required');
const script=[
 '(function(){',
 'const $=s=>document.querySelector(s),box=s=>$(s).getBoundingClientRect(),result=$("#result");',
 'try{',
 'const a=box("#a"),b=box("#b"),c=box("#c");',
 'if(Math.abs(a.y-b.y)>2||b.x<=a.x+30)throw Error("No two-column wide layout");',
 'if(c.width<a.width*1.8)throw Error("Long answer squeezed");',
 'if(getComputedStyle($("#a")).fontSize!=="14px")throw Error("Wrong compact font");',
 'if(a.height<44||b.height<44)throw Error("Touch target too small");',
 '$("#b").click();',
 'if(!$("#b input").checked||$("#a input").checked)throw Error("Radio selection broken");',
 '$("#lesson").style.width="405px";',
 'const x=box("#a"),y=box("#b");',
 'if(Math.abs(x.x-y.x)>2||y.y<=x.y+12)throw Error("Narrow layout not one column");',
 'if(document.documentElement.scrollWidth>window.innerWidth)throw Error("Horizontal overflow");',
 'result.textContent="PASS_FOUNDATION_COMPACT_BROWSER";',
 '}catch(e){result.textContent="FAIL_FOUNDATION_COMPACT_BROWSER "+e.message}',
 '})();'
].join('\n');
const html=['<!doctype html><html><head><meta charset="UTF-8"><style>',
 '*{box-sizing:border-box}html,body{margin:0;font:16px Arial}',
 '.foundation-option{display:flex;align-items:center;border:1px solid #dae1e7}',
 '.foundation-question{border:0;padding:20px 0;margin:12px 0}',
 '.foundation-question legend{font-size:1.05rem}',
 css.replaceAll('</style>',''),
 '</style></head><body><section class="foundation-lesson foundation-focus" id="lesson" style="width:780px">',
 '<h2>Listening</h2><fieldset class="foundation-question"><legend>Which option is correct?</legend>',
 '<div class="foundation-options-grid">',
 '<label class="foundation-option" id="a"><input type="radio" name="q" value="a">First answer</label>',
 '<label class="foundation-option" id="b"><input type="radio" name="q" value="b">Second answer</label>',
 '<label class="foundation-option foundation-option-long" id="c"><input type="radio" name="q" value="c">A very long choice that should occupy a full row even with many words</label>',
 '<label class="foundation-option" id="d"><input type="radio" name="q" value="d">Fourth answer</label>',
 '</div></fieldset></section><div id="result">STARTED</div><script>',
 script.replaceAll('</script>',''),'</script></body></html>'].join('');
const server=http.createServer((request,response)=>{response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});response.end(html)});
(async()=>{
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-foundation-'));
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const url='http://127.0.0.1:'+server.address().port+'/';
  const args=['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-extensions',
   '--disable-background-networking','--no-first-run','--window-size=980,800',
   '--virtual-time-budget=8000','--dump-dom','--user-data-dir='+profile,url];
  let out='',err='';
  await new Promise((resolve,reject)=>{
   const proc=cp.spawn(chrome,args,{stdio:['ignore','pipe','pipe']});
   proc.stdout.on('data',d=>out+=String(d));
   proc.stderr.on('data',d=>err+=String(d));
   const deadline=setTimeout(()=>{proc.kill('SIGKILL');reject(Error('Chromium timeout'))},30000);
   proc.on('error',e=>{clearTimeout(deadline);reject(e)});
   proc.on('close',code=>{clearTimeout(deadline);code===0?resolve(code):reject(Error('Chromium '+code+': '+err.slice(-450)))});
  });
  const status=out.match(/<div id="result">([^<]*)<\/div>/)?.[1]||'MISSING';
  assert.equal(status,'PASS_FOUNDATION_COMPACT_BROWSER');
  console.log(JSON.stringify({result:'PASS',gate:'SLE_FOUNDATION_COMPACT_REAL_CHROMIUM',
   wideTwoColumn:true,narrowOneColumn:true,longChoiceFullWidth:true,
   radioClick:true,minTarget44px:true,fontsize14px:true,noOverflow:true,
   actualSafari:'NOT_TESTED',learnerWrites:0,productionDeploy:false}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
