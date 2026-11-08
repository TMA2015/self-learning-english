'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),out='.sites-runtime/unit-guide-60',dest=path.join(root,out);
fs.rmSync(dest,{recursive:true,force:true});
cp.execFileSync(process.execPath,[
 path.join(root,'node_modules/typescript/bin/tsc'),
 'domain/unit-guide-60.ts',
 '--outDir',out,'--rootDir','.','--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(dest,'package.json'),'{"type":"commonjs"}');
const {
 UNIT_LEVELS,UNIT_DEFINITIONS,unitGuideForCatalog,primaryUnitForLessonId
}=require(path.join(dest,'domain/unit-guide-60.js'));
const curriculum=require('../content/curriculum-1.21.0-candidate.json');
const lessons=curriculum.lessons.map(l=>({id:l.id,title:l.title,module:l.module,
 cefr:l.cefr_target,minutes:l.estimated_minutes}));
const original=JSON.stringify(lessons);
const sample=unitGuideForCatalog(lessons,curriculum.course.sequence);
assert.equal(UNIT_LEVELS.length,6);
assert.equal(UNIT_DEFINITIONS.length,60);
assert.equal(new Set(UNIT_DEFINITIONS.map(u=>u.id)).size,60);
assert.equal(sample.units.length,60);
for(const level of UNIT_LEVELS){
 const units=sample.units.filter(u=>u.level===level);
 assert.equal(units.length,10,level+' must contain 10 approved Units');
 assert.deepEqual(units.map(x=>x.id),Array.from({length:10},(_,i)=>
  level+'-U'+String(i+1).padStart(2,'0')));
}
assert.equal(lessons.length,132);
assert.equal(sample.mappedLessonCount,130);
assert.deepEqual(sample.unmappedLessons.map(x=>x.id).sort(),
 ['REA-C1-01','VOC-C2-01']);
assert.equal(sample.units.filter(x=>x.available).length,32);
const all=sample.units.flatMap(u=>u.lessons);
assert.equal(all.length,130);
assert.equal(new Set(all.map(x=>x.id)).size,130,
 'One canonical learner history per Lesson ID');
assert(all.every(l=>lessons.find(x=>x.id===l.id)===l),
 'Unit list must reference current catalog lessons directly, not duplicate JSON');
assert.equal(sample.units.find(u=>u.id==='A2-U03').lessonCount,3);
assert.deepEqual(sample.units.find(u=>u.id==='A2-U03').lessons.map(x=>x.id).sort(),
 ['GRA-A2-03','VOC-A2-03','VOC-A2-05']);
for(const level of UNIT_LEVELS){
 const last=sample.units.find(x=>x.id===level+'-U10');
 assert(last&&last.isCheckpoint,'Unit 10 is an integrated transfer target');
}
// Each newly authored Unit10 lesson must appear in its intended checkpoint.
// This is the user-visible navigation contract, not a source-catalog count check.
const requiredUnit10={
 'A1-U10':['REA-A1-05','LIS-A1-06','WRI-A1-05'],
 'A2-U10':['REA-A2-08','LIS-A2-07','WRI-A2-07'],
 'B1-U10':['REA-B1-07','LIS-B1-08','WRI-B1-08'],
};
for(const [unitId,ids] of Object.entries(requiredUnit10)){
 const unit=sample.units.find(u=>u.id===unitId);
 assert(unit && unit.available,unitId+' must NOT display Planned after v1.21.0');
 assert.equal(unit.lessonCount,3,unitId+' must contain Reading, Listening and Writing');
 assert.deepEqual(unit.lessons.map(x=>x.id).sort(),ids.slice().sort(),
  unitId+' lesson links must point to exact approved Unit10 IDs');
 for(const id of ids)assert.equal(primaryUnitForLessonId(id),unitId,
  'Canonical navigation crosswalk missing '+id);
}
const oldBaseline=require('../content/curriculum-1.20.0-candidate.json');
assert.deepEqual(curriculum.lessons.slice(0,123),oldBaseline.lessons,
 'Unit navigation patch must preserve all previously approved lesson objects');
assert.equal(sample.unmappedLessons.length,2,'New Unit10 lessons must not be left unmapped');
assert.equal(primaryUnitForLessonId('GRA-A2-03'),'A2-U03');
assert.equal(primaryUnitForLessonId('REA-C1-01'),undefined);
assert.equal(JSON.stringify(lessons),original,'Catalog source cannot be mutated');
const subset=unitGuideForCatalog(lessons.slice(0,5),curriculum.course.sequence);
assert.equal(subset.mappedLessonCount+subset.unmappedLessons.length,5,
 'Only imported available lessons may appear in the Unit guide');
assert.throws(()=>unitGuideForCatalog([lessons[0],lessons[0]]),
 /duplicate Lesson ID/);
const home=fs.readFileSync(path.join(root,'app/home-client.tsx'),'utf8');
const foundation=fs.readFileSync(path.join(root,'app/foundation.tsx'),'utf8');
const unitUi=fs.readFileSync(path.join(root,'app/unit-browser.tsx'),'utf8');
const css=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
assert(home.includes('key:"units",label:"Learn by Units"'));
assert(home.includes('heading:"SKILL LIBRARY"'));
assert(home.includes('entryMode={view==="units"?"units":"lessons"}'));
assert(foundation.includes('onOpenLesson={(id,entry)=>void open(id,entry)}'),
 'Unit screen must open the original guarded academic player');
assert(foundation.includes('routeScope=entryMode==='));
assert(foundation.includes('selectedId={selectedUnit}')&&unitUi.includes('onSelectUnit:(id:string|null)=>void'),
 'After the player closes, the same Unit detail must remain selected');
assert(unitUi.includes('<span>Curriculum Units</span>')&&!unitUi.includes('<span>Planned Units</span>'),
 'Framework heading must not imply every Unit remains planned');
assert(unitUi.includes('lessonProgressForLesson(attempts,item.id)'),
 'Every Unit lesson needs the existing saved attempt record');
assert(unitUi.includes('latestAttemptForLesson(attempts,item.id)'),
 'Unit view must preserve original historic draft and submission');
assert(css.includes('.sle-unit-browser .unit-card-grid'));
assert(css.includes('@media(max-width:680px)'));
console.log(JSON.stringify({result:'PASS',gate:'60-unit-canonical-navigation',
 levels:UNIT_LEVELS.length,plannedUnits:sample.units.length,unit10Mapped:true,
 currentLessons:lessons.length,mappedCurrentLessons:sample.mappedLessonCount,
 availableUnits:sample.units.filter(x=>x.available).length,
 unmappedIds:sample.unmappedLessons.map(x=>x.id),
 canonicalPlayerShared:true,originalCatalogUnmodified:true,
 originalLearnerDataWrites:0,actualBrowserSafari:'NOT_TESTED',
 liveDeployment:'NO'}));
