'use strict';
/** R2 source contract and Chromium render preflight; independent from release QA. */
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const assert=require('node:assert/strict');
const ts=require('typescript');
const {pathToFileURL}=require('node:url');
const root=path.join(__dirname,'..');
let checks=0;
function verify(name,fn){fn();checks++;console.log('PASS R2 '+name);}
const source=(name)=>fs.readFileSync(path.join(root,name),'utf8');
const sort=source('app/writing-week2-r2-sort.tsx');
const map=source('app/writing-week2-r2-mind.tsx');
const entry=source('tests/writing-week2-r2-review-entry.tsx');
const styles=source('app/writing-week2-r2-visual.css');
verify('sort cards and three destinations',()=>{
 for(const text of ['r2-sort-bin','r2-grip','r2-card-text','Needs explanation','Off topic','Fits','onPointerDown','onPointerUp','onKeyDown'])
  assert(sort.includes(text),text);
 assert(sort.includes('setPointerCapture'));
 assert(sort.includes("elementFromPoint"));
 assert(sort.includes('disabled={!finished}'),'reason reveal requires completed sorting');
});
verify('direct nested mind-map editing',()=>{
 for(const text of ['r2-task-node','r2-node-text','r2-child-kind','r2-child-text','r2-edit-node',
  'r2CanonicalProjection','vocab','reason','example','Sub-idea','Select as best','Delete branch and children']){
  assert(map.includes(text),text);
 }
 assert(map.includes('depthOf'),'depth guard');
});
verify('no feature-side storage, network or grades',()=>{
 for(const s of [sort,map]){
  for(const forbidden of ['fetch(', 'localStorage','sessionStorage','XMLHttpRequest','indexedDB','firebase','gemini','proficiencyWeight','evidenceWeight'])
   assert(!s.includes(forbidden),forbidden);
 }
 assert(entry.includes('No login, cloud saving, Firebase, Gemini'));
});
verify('responsive touch, keyboard and tablet editor',()=>{
 assert(styles.includes('touch-action:none'));
 assert(styles.includes('@media(max-width:950px)'));
 assert(styles.includes('.r2-inspector.is-open'));
 assert(styles.includes('r2-root-branches'));
});
verify('isolated component TypeScript/JSX syntax',()=>{
 for(const filename of ['app/writing-week2-r2-sort.tsx','app/writing-week2-r2-mind.tsx','tests/writing-week2-r2-review-entry.tsx']){
  const result=ts.transpileModule(source(filename),{fileName:filename,
   compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX},
   reportDiagnostics:true});
  assert.equal((result.diagnostics||[]).length,0,filename);
 }
});
verify('single HTML build and zero network CSP',()=>{
 const r=cp.spawnSync(process.execPath,['scripts/build-w2-r2-review.cjs'],{
  cwd:root,encoding:'utf8',timeout:120000,maxBuffer:1024*1024*8});
 if(r.error)throw r.error;
 assert.equal(r.status,0,(r.stderr||r.stdout).slice(-1800));
 const html=fs.readFileSync(path.join(root,'.sites-runtime/w2-r2-review/index.html'),'utf8');
 assert(html.startsWith('<!doctype html>'));
 assert(html.includes("connect-src 'none'"));
 assert(html.includes('Sort ideas by moving cards'));
 assert(html.includes('Grow your ideas on the map'));
 assert(!/<script[^>]*\bsrc\s*=/.test(html));
 assert(!/<link[^>]*\bhref\s*=/.test(html));
 const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser']
 .map(n=>{try{return cp.execFileSync('which',[n],{encoding:'utf8'}).trim()}catch{return ''}}).find(Boolean);
 assert(chrome,'Chromium is necessary for R2 browser smoke');
 const view=cp.spawnSync(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
  '--disable-background-networking','--no-first-run','--virtual-time-budget=3000',
  '--window-size=1140,800','--dump-dom',pathToFileURL(path.join(root,'.sites-runtime/w2-r2-review/index.html')).href],{
  cwd:root,encoding:'utf8',timeout:30000,maxBuffer:1024*1024*12});
 if(view.error)throw view.error;
 assert.equal(view.status,0,view.stderr?.slice(-900));
 assert(view.stdout.includes('WRITING TASK · TAP TO ADD IDEA'),'React prototype was not rendered in Chromium');
 assert(view.stdout.includes('Art club'),'Sample branches must render');
});
console.log(JSON.stringify({result:'PASS',gate:'SLE_WEEK2_R2_VISUAL',checks,scope:'draft prototype, synthetic browser only'}));
