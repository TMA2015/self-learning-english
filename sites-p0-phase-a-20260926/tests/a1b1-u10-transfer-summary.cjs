'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const root=path.resolve(__dirname,'..');
// Compile only the isolated modules; no runtime service, network or real storage.
const dir=path.join(root,'.sites-runtime/a1b1-u10');fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'package.json'),'{"type":"commonjs"}');
function compile(relative){
 const target=path.join(dir,relative.replace(/\.tsx?$/,'.js'));
 fs.mkdirSync(path.dirname(target),{recursive:true});
 fs.writeFileSync(target,ts.transpileModule(fs.readFileSync(path.join(root,relative),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText);
}
compile('domain/a1b1-u10-transfer-summary.ts');compile('app/a1b1-u10-transfer-panel.tsx');
fs.mkdirSync(path.join(dir,'content'),{recursive:true});
fs.copyFileSync(path.join(root,'content/a1b1-u10-transfer-guidance-r2.json'),path.join(dir,'content/a1b1-u10-transfer-guidance-r2.json'));
const {a1b1Unit10TransferSummary:summary,TRANSFER_IDS}=require(path.join(dir,'domain/a1b1-u10-transfer-summary.js'));
const {A1B1Unit10TransferPanel:Panel}=require(path.join(dir,'app/a1b1-u10-transfer-panel.js'));
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const seed=require('../content/curriculum-1.25.0-candidate.json');
const copy=require('../content/a1b1-u10-transfer-guidance-r2.json');
let checks=0;function check(name,fn){fn();checks++;console.log('PASS '+name)}
function freeze(x){Object.freeze(x);for(const v of Object.values(x))if(v&&typeof v==='object')freeze(v);return x;}
for(const unit of Object.keys(TRANSFER_IDS)){
 const ids=TRANSFER_IDS[unit],lessons=freeze(seed.lessons.filter(l=>ids.includes(l.id)));
 const a=(i,status,createdAt,extra={})=>({id:`${i}-${createdAt}`,lessonId:ids[i],status,createdAt,version:'1.21.0',...extra});
 const results=[{id:'q1',correct:true},{id:'q2',correct:false},{id:'q2',correct:false},{id:'q3',correct:null},{id:'q4',correct:false,outcome:'format-only'}];
 const attempts=freeze([a(0,'scored',1,{results}),a(0,'started',5),a(1,'scored',2,{results}),a(2,'pending_review',3,{results})]);
 const before=JSON.stringify(attempts);const s=summary(unit,lessons,attempts);
 const render=(as=attempts,ls=lessons)=>renderToStaticMarkup(React.createElement(Panel,{unitId:unit,lessons:ls,attempts:as,disabled:false,onOpenLesson(){throw Error('Render must not navigate')}}));
 check(unit+' canonical scope',()=>assert.deepEqual(s.rows.map(r=>r.lessonId),ids));
 check(unit+' no mutation / no score',()=>{assert.equal(JSON.stringify(attempts),before);assert.equal(s.introducesScoring,false);assert.equal(s.writesHistory,false);assert.equal(s.claimsCEFRProficiency,false)});
 check(unit+' deduplicated boolean results / exclude format-only',()=>assert.deepEqual(s.rows.slice(0,2).map(r=>[r.objectiveChecked,r.objectiveCorrect,r.objectiveWrong]),[[2,1,1],[2,1,1]]));
 check(unit+' preserved historical version and separate draft',()=>{assert.equal(s.rows[0].savedContentVersion,'1.21.0');assert.equal(s.rows[0].hasUnfinishedDraft,true);assert.equal(s.nextAttemptId,'0-1')});
 check(unit+' Writing never objective',()=>{assert.equal(s.rows[2].objectiveChecked,0);assert.equal(s.rows[2].writingEvidenceWeight,0);assert.equal(s.rows[2].pendingTrustedReview,true)});
 check(unit+' approved status alone is not trusted review',()=>assert.equal(summary(unit,lessons,[a(2,'approved',9)]).rows[2].pendingTrustedReview,true));
 check(unit+' actual adult review',()=>assert.equal(summary(unit,lessons,[a(2,'approved',9,{review:{source:'adult-review',reviewedAt:10,feedback:'review',scores:{}}})]).rows[2].status,'trusted_review_recorded'));
 check(unit+' newer retake clears old errors',()=>assert.equal(summary(unit,lessons,[...attempts,a(0,'scored',10,{results:[{id:'q1',correct:true}]})]).rows[0].objectiveWrong,0));
 check(unit+' missing / wrong module source never linked',()=>{assert.equal(summary(unit,[],attempts).nextLessonId,null);assert.equal(summary(unit,[{...lessons[0],module:'speaking'}],attempts).availableLessonCount,0)});
 check(unit+' empty and unassessed',()=>{assert.equal(summary(unit,lessons,[]).rows[0].status,'not_started');assert.equal(summary(unit,lessons,[a(1,'unassessed',10,{results})]).rows[1].objectiveChecked,0)});
 check(unit+' resume draft priority / pinned id',()=>{const x=summary(unit,lessons,[a(0,'started',11)]);assert.equal(x.nextAttemptId,'0-11')});
 check(unit+' pre-submit no repair disclosure',()=>{const h=render([]);assert(h.includes(copy[unit].guidance.replaceAll("'",'&#x27;')));for(const repair of copy[unit].repairs)assert(!h.includes(repair));assert(!h.includes('Suggested answer'))});
 check(unit+' per-lesson repair gating',()=>{const h=render([a(0,'scored',1,{results})]);assert(h.includes(unit==='A1-U10'?'normal plan':'briefing reports'));assert(!h.includes(unit==='A1-U10'?'Replay the original announcement':'Replay the speaker'));assert(!h.includes('Check that'))});
 check(unit+' pending Writing repair and version label',()=>{const h=render();assert(h.includes('Saved content version: 1.21.0'));assert(h.includes('Pending trusted review'));assert(h.includes('Check that'))});
 check(unit+' drafts never disclose post-submit Writing guidance',()=>{assert(!render([a(2,'started',9)]).includes('Check that'));assert(!render([a(2,'started',9)]).includes(copy[unit].repairs[3]))});
 check(unit+' all objective results required for final repair',()=>{
  const done=[a(0,'scored',10,{results:Array.from({length:4},(_,i)=>({id:'r'+i,correct:true}))}),a(1,'scored',11,{results:Array.from({length:5},(_,i)=>({id:'l'+i,correct:true}))}),a(2,'pending_review',12)];
  assert(render(done).includes(copy[unit].repairs[3]));
  assert(!render(done.slice(0,2)).includes(copy[unit].repairs[3]));
 });
 check(unit+' absent source and disabled button',()=>{assert(render([],[]).includes('unavailable here'));assert(!render([],[]).includes('<button'));assert(renderToStaticMarkup(React.createElement(Panel,{unitId:unit,lessons,attempts:[],disabled:true,onOpenLesson(){}})).includes('disabled=""'))});
}
check('A2 and arbitrary units excluded',()=>{assert.equal(summary('A2-U10',[],[]),null);assert.equal(summary('A1-U09',[],[]),null)});
check('No side-effect API in projection / panel',()=>{for(const file of ['domain/a1b1-u10-transfer-summary.ts','app/a1b1-u10-transfer-panel.tsx'])assert.doesNotMatch(fs.readFileSync(path.join(root,file),'utf8'),/localStorage|fetch\(|setItem\(|saveDraft\(|\.finish\(|generateContent|playbackCompleted\s*=/)});
console.log(JSON.stringify({result:'PASS',checks,fixtures:'synthetic only',browser:'NOT_TESTED'}));
