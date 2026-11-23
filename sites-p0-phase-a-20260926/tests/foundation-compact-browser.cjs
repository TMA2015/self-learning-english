'use strict';
/**
 * Native Chromium geometry/interaction for the exact Foundation question
 * selectors and committed CSS. Synthetic labels only, no app/learner state.
 * Fixed content widths; not physical Safari or authenticated app acceptance.
 */
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'app/foundation.tsx'),'utf8');
assert(source.includes('className="foundation-option-grid"'),'actual React player uses grid class');
const globalCSS=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
const compactCSS=fs.readFileSync(path.join(root,'app/foundation-practice-compact.css'),'utf8');
const base=globalCSS.indexOf(':root {');
assert(base>=0&&compactCSS.includes('min(100%, 360px)'),'real design CSS required');
const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser']
 .map(n=>{try{return cp.execFileSync('which',[n],{encoding:'utf8'}).trim()}catch{return ''}}).find(Boolean);
if(!chrome)throw Error('Native Chromium required for compact practice layout QA');
const widths=[375,768,960];
const fixtures=widths.map(width=>'<section class="foundation-lesson foundation-focus" id="case-'+width+
 '" style="width:'+width+'px;max-width:100%;padding:0;margin:0 0 22px">'+
 '<fieldset class="foundation-question"><legend>1. Choose the correct pronoun for a complete A1 sentence.</legend>'+
 '<div class="foundation-option-grid">'+
 ['I have a book.','My book is blue.','This is a very long answer option that should wrap naturally rather than cause horizontal overflow.','A final option.']
 .map((x,i)=>'<label class="foundation-option"><input type="radio" name="q'+width+
 '" value="'+i+'"><span>'+x+'</span></label>').join('')+'</div></fieldset>'+
 '<fieldset class="foundation-question"><legend>2. Complete the gap.</legend>'+
 '<label class="field">Answer format: enter only the missing word or phrase.'+
 '<textarea rows="2"></textarea></label></fieldset>'+
 '<fieldset class="foundation-question"><legend>3. Explain your answer.</legend>'+
 '<label class="field">Your own response or planning note'+
 '<textarea rows="7"></textarea></label></fieldset>'+
 '<details class="foundation-attempt-details"><summary>Attempt details</summary><p>Attempt TEST · content 1.28.0</p></details>'+
 '</section>').join('');
const js=`(function(){
 try{
  var widths=[375,768,960],expectCols=[1,2,2];
  widths.forEach(function(w,index){
   var shell=document.getElementById('case-'+w),question=shell.querySelector('.foundation-question');
   var grid=question.querySelector('.foundation-option-grid'),labels=Array.from(grid.querySelectorAll('label.foundation-option'));
   if(labels.length!==4)throw Error('MCQ options missing '+w);
   var computed=getComputedStyle(grid).gridTemplateColumns.trim().split(/\\s+/);
   if(computed.length!==expectCols[index])throw Error('Column count at '+w+': '+computed.length);
   labels.forEach(function(label){
    if(label.getBoundingClientRect().height<43.5)throw Error('Touch target too short '+w);
    if(label.getBoundingClientRect().right>shell.getBoundingClientRect().right+2)throw Error('Option overflow '+w);
    if(!label.textContent.trim())throw Error('Missing visible answer '+w);
   });
   var radio=labels[1].querySelector('input');
   radio.click();
   if(!radio.checked)throw Error('Radio selection failed '+w);
   if(labels[1].querySelector('input').checked!==true)throw Error('Checked state missing '+w);
   var textareas=shell.querySelectorAll('textarea');
   if(textareas.length!==2)throw Error('Response inputs missing '+w);
   if(textareas[0].getBoundingClientRect().height>90)throw Error('Short answer too tall '+w);
   if(textareas[1].getBoundingClientRect().height<145)throw Error('Extended answer collapsed '+w);
   if(shell.scrollWidth>shell.clientWidth+2)throw Error('Horizontal overflow '+w);
   if(question.getBoundingClientRect().right>shell.getBoundingClientRect().right+2)throw Error('Question overflow '+w);
   var details=shell.querySelector('details.foundation-attempt-details');
   if(details.open)throw Error('Metadata should be collapsed '+w);
   details.open=true;
   if(!details.textContent.includes('1.28.0'))throw Error('Metadata removed '+w);
  });
  document.getElementById('sle-test-result').textContent='PASS_COMPACT_PRACTICE_375_768_960';
 }catch(e){document.getElementById('sle-test-result').textContent='FAIL '+e.message}
})();`;
const html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<style>'+(globalCSS.slice(base)+'\n'+compactCSS).replaceAll('</style>','<\\/style>')+'</style></head>'+
 '<body style="margin:0;padding:10px"><div id="fixture">'+fixtures+'</div><div id="sle-test-result">STARTED</div>'+
 '<script>'+js+'</script></body></html>';
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'sle-compact-practice-browser-'));
try{
 const file=path.join(tmp,'fixture.html');fs.writeFileSync(file,html);
 const out=cp.execFileSync(chrome,['--headless=new','--no-sandbox',
  '--disable-dev-shm-usage','--disable-extensions','--disable-background-networking',
  '--no-first-run','--virtual-time-budget=4000','--dump-dom',
  '--window-size=1280,900','--user-data-dir='+path.join(tmp,'profile'),'file://'+file],
 {encoding:'utf8',timeout:38000,stdio:['ignore','pipe','pipe']});
 const result=out.match(/<div id="sle-test-result">([\s\S]*?)<\/div>/)?.[1]??'';
 assert.equal(result,'PASS_COMPACT_PRACTICE_375_768_960',result);
 console.log(JSON.stringify({result:'PASS',gate:'SLE_FOUNDATION_COMPACT_NATIVE_CHROMIUM',
  contentWidths:widths,columns:[1,2,2],touchTargets:'>=44px',shortAndLongInputs:true,
  metadataReadable:true,horizontalOverflow:false,sourceBinding:true,
  syntheticOnly:true,liveLearnerDataWrites:0,physicalIpadSafari:'NOT_TESTED'}));
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
