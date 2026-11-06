'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const root=path.join(__dirname,'..');
const data=require('../content/curriculum-1.18.1-candidate.json');
const map=require('../content/sle-unit-navigation-map-v1.json');
const source=fs.readFileSync(path.join(root,'domain/a2-unit-guide.ts'),'utf8');
const js=ts.transpileModule(source,{fileName:'a2-unit-guide.ts',compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true}});
const mod={exports:{}};
vm.runInNewContext(js.outputText,{module:mod,exports:mod.exports,require:id=>{
 if(id.endsWith('sle-unit-navigation-map-v1.json'))return map;
 throw Error('Unexpected import '+id);
}},{timeout:3000});
const {buildA2UnitGuide,A2_UNIT_GUIDE}=mod.exports;
assert.equal(A2_UNIT_GUIDE.length,10);
const lessons=data.lessons.map(l=>({id:l.id,title:l.title,module:l.module,cefr:l.cefr_target,minutes:l.estimated_minutes??30}));
const units=buildA2UnitGuide(lessons,[],data.course?.sequence??[]);
assert.equal(units.reduce((n,u)=>n+u.lessons.length,0),42,'Every A2 baseline lesson must appear in exactly one Unit');
assert.equal(new Set(units.flatMap(u=>u.lessons.map(l=>l.id))).size,42,'No duplicate lesson IDs');
assert.equal(units.find(u=>u.id==='A2-U10').lessons.length,0,'Checkpoint must not be presented as an invented live lesson');
assert(units.find(u=>u.id==='A2-U06').lessons.some(l=>l.id==='GRA-A2-06'));
assert(units.every(u=>u.submitted===0&&u.inProgress===0));
const a2=lessons.find(l=>l.id==='GRA-A2-06');
const done=buildA2UnitGuide(lessons,[{lessonId:a2.id,status:'scored'},{lessonId:a2.id,status:'scored'},{lessonId:'GRA-A2-01',status:'started'}]);
assert.equal(done.find(u=>u.id==='A2-U06').submitted,1,'Retakes must not duplicate a submission');
assert.equal(done.find(u=>u.id==='A2-U01').inProgress,1);
const proposed={id:'WRI-A2-05',title:'Preview-only writing strategy',module:'writing',cefr:'A2',minutes:25};
const before=buildA2UnitGuide(lessons,[]).find(u=>u.id==='A2-U09').lessons.length;
const after=buildA2UnitGuide([...lessons,proposed],[]).find(u=>u.id==='A2-U09').lessons.length;
assert.equal(after,before+1,'Unimported candidate must not appear before entering actual catalog');
const ui=fs.readFileSync(path.join(root,'app/a2-unit-guide-pilot.tsx'),'utf8');
const foundation=fs.readFileSync(path.join(root,'app/foundation.tsx'),'utf8');
assert(ui.includes('onOpen(lesson.id)')&&ui.includes('lessonProgressForLesson'),'Pilot must reuse same lesson and attempt statuses');
assert(foundation.includes('<A2UnitGuidePilot')&&foundation.includes('!skill&&<A2UnitGuidePilot'),'Pilot should not replace existing skill libraries');
assert(!ui.includes('mastered')&&!ui.includes('onClick={()=>setLocked'),'Do not invent mastery or level locks');
// When merged with the approved v1.20.0 source, verify all currently importable A2
// candidate lessons are mapped; the UI still reads ONLY the actual device catalog.
const v120Path=path.join(root,'content/curriculum-1.20.0-candidate.json');
if(fs.existsSync(v120Path)){
 const latest=JSON.parse(fs.readFileSync(v120Path,'utf8'));
 assert.equal(latest.lessons.length,123);
 const latestA2=latest.lessons.filter(l=>l.cefr_target==='A2');
 const imported=latest.lessons.map(l=>({id:l.id,title:l.title,module:l.module,cefr:l.cefr_target,minutes:l.estimated_minutes??30}));
 const grouped=buildA2UnitGuide(imported,[],latest.course?.sequence??[]);
 assert.equal(grouped.reduce((sum,u)=>sum+u.lessons.length,0),latestA2.length,
  'All actually imported 1.20 A2 lessons must map exactly once');
 assert.equal(new Set(grouped.flatMap(u=>u.lessons.map(l=>l.id))).size,latestA2.length);
 assert(grouped.every(u=>u.submitted===0&&u.inProgress===0),
  'An imported catalog alone is not learner progress');
}

console.log(JSON.stringify({result:'PASS',gate:'a2-unit-guide-pilot',units:units.length,baselineA2Lessons:42,submittedNotMastery:true,writeCount:0}));
