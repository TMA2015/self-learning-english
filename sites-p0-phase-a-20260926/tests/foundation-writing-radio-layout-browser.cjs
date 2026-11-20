'use strict';
/** Native Chromium checks the exact real CSS applied to Foundation-style radio labels. */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const css=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
const browser=['google-chrome','google-chrome-stable','chromium','chromium-browser']
 .map(n=>{try{return cp.execFileSync('which',[n],{encoding:'utf8'}).trim()}catch{return ''}})
 .find(Boolean);
if(!browser)throw Error('Native Chromium missing; no visual layout PASS');
const widths=[320,375,768,1280];
const cases=widths.map(width=>
 '<div class="panel wcv2" style="width:'+width+'px;max-width:100%;padding:10px">'+
 '<fieldset style="min-width:0"><legend>Foundation Writing choice</legend>'+
 '<label class="field wcv2-radio-option"><input type="radio" name="q'+width+'" checked>'+
 '<strong>A.</strong> Add a shelf for shared books and explain the choice.'+
 '<p class="muted">After checking: this action is relevant to a reading room.</p></label>'+
 '<label class="field wcv2-radio-option"><input type="radio" name="q'+width+'">'+
 '<strong>B.</strong> An unrelated option with longer writing that wraps on narrow widths.</label>'+
 '</fieldset></div>').join('');
const browserCode="(function(){\n try{\n  var cards=Array.from(document.querySelectorAll('.wcv2'));\n  if(cards.length!==4)throw Error('Expected four cases');\n  cards.forEach(function(card){\n   var rows=Array.from(card.querySelectorAll('label.wcv2-radio-option'));\n   if(rows.length!==2)throw Error('Missing option label');\n   rows.forEach(function(row){\n    var input=row.querySelector('input[type=radio]');\n    var rect=input.getBoundingClientRect(),parent=row.getBoundingClientRect();\n    var style=getComputedStyle(input);\n    if(rect.width>21||rect.width<15||rect.height>21||rect.height<15||\n     parseFloat(style.minHeight)>21||parent.height>120)\n      throw Error('Radio stretched '+Math.round(rect.width)+'x'+Math.round(rect.height));\n    if(rect.top<parent.top||rect.left<parent.left||rect.right>parent.right)\n      throw Error('Radio not inside answer row');\n   });\n   if(card.scrollWidth>card.clientWidth+2)throw Error('Horizontal overflow');\n  });\n  document.getElementById('result').textContent='PASS_LAYOUT_320_375_768_1280';\n }catch(e){document.getElementById('result').textContent='FAIL_'+e.message}\n})();";
const html='<!doctype html><html><head><meta charset="utf-8"><style>'+
 css.replace(/<\/style>/ig,'')+'</style></head><body style="margin:0;padding:0">'+cases+
 '<div id="result">STARTED</div><script>'+browserCode+'</script></body></html>';
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'sle-foundation-radio-'));
try{
 const filename=path.join(tmp,'fixture.html');fs.writeFileSync(filename,html);
 const out=cp.execFileSync(browser,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
  '--disable-extensions','--no-first-run','--virtual-time-budget=3000','--dump-dom',
  '--user-data-dir='+path.join(tmp,'profile'),'file://'+filename],{
  encoding:'utf8',timeout:35000,stdio:['ignore','pipe','pipe']});
 const value=out.match(/<div id="result">([\s\S]*?)<\/div>/)?.[1]??'';
 assert.equal(value,'PASS_LAYOUT_320_375_768_1280','Computed style failure: '+value);
 console.log(JSON.stringify({result:'PASS',gate:'FW_ALL_UNITS_RADIO_COMPUTED_STYLE',
   widths,realChromium:true,radioSize:'15-21px',horizontalOverflow:false,
   productionWrites:0,realProviderCalls:0}));
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
