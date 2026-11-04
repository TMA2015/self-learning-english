'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const map=require('../content/sle-unit-navigation-map-v1.json');
const doc=fs.readFileSync(path.join(root,'docs/curriculum/SLE_109_LESSON_UNIT_CROSSWALK_v1.0.md'),'utf8');
const original=[...doc.matchAll(/^\| \`([A-Z]{3}-(?:A1|A2|B1)-\d\d)\` \| [^\n]*? \| \`((?:A1|A2|B1|B2|C1|C2)-U\d\d)\` \| PLANNING_MAP \|$/gm)];
assert.equal(original.length,109);
assert.equal(Object.keys(map.baseline).length,109);
for(const m of original)assert.equal(map.baseline[m[1]],m[2],'Unit map must match canonical crosswalk');
assert.equal(Object.keys(map.conditional_v119).length,12);
for(const id of Object.keys(map.conditional_v119))assert(!map.baseline[id]);
const seed=require('../content/curriculum-1.18.1-candidate.json');
const out='.sites-runtime/today-learning-path';
execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc',
 'domain/today-learning-path.ts',
 '--outDir',out,'--module','commonjs','--target','es2022',
 '--resolveJsonModule','--esModuleInterop','--skipLibCheck'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}');
const {todayLearningPath,primaryUnitForLesson}=require('../'+out+'/domain/today-learning-path.js');
const lessons=seed.lessons.map(l=>({id:l.id,title:l.title,module:l.module,cefr:l.cefr_target,minutes:l.estimated_minutes}));
const course={sequence:seed.course.sequence};
let catalog={lessons,attempts:[],course};
const auto=todayLearningPath(catalog);
assert.equal(auto.availableUnits.length,27,'Only released baseline Units with mapped lessons');
assert.equal(auto.focusUnit,'A1-U01');
assert.equal(auto.resume,undefined);
assert.equal(auto.learn?.lesson.id,'GRA-A1-01');
assert.equal(primaryUnitForLesson('VOC-B2-01'),'B2-U02',
 'Proposed mapping may exist but is never a released lesson by itself');
assert(!auto.availableUnits.includes('B2-U02'));
assert(!auto.learn?.lesson.id.includes('B2'));
const writing=todayLearningPath(catalog,'writing','A2-U09');
assert.equal(writing.focusUnit,'A2-U09');
assert.equal(writing.learn?.lesson.id,'WRI-A2-01');
const started={id:'attempt-old',lessonId:'WRI-A2-02',version:'1.18.0',createdAt:130,status:'started',results:[]};
const incorrect={id:'attempt-scored',lessonId:'WRI-A2-01',version:'1.18.1',createdAt:125,status:'scored',
 results:[{id:'WRI-A2-01-Q1',correct:false}]};
catalog={...catalog,attempts:[started,incorrect]};
let pathing=todayLearningPath(catalog,'writing','A2-U09');
assert.equal(pathing.resume?.attempt?.id,started.id);
assert.equal(pathing.resume?.attempt?.version,'1.18.0','Draft resumes original immutable version');
assert.equal(pathing.review?.lesson.id,'WRI-A2-01');
assert.equal(pathing.learn?.lesson.id,'WRI-A2-03');
assert.equal(pathing.focusUnit,'A2-U09');
assert(!pathing.resume?.reason.includes('assessed'));
catalog={...catalog,attempts:[incorrect]};
pathing=todayLearningPath(catalog,'writing','A2-U09');
assert.equal(pathing.resume,undefined);
assert.equal(pathing.review?.lesson.id,'WRI-A2-01');
catalog={...catalog,attempts:[incorrect,{...incorrect,id:'later-reviewed',createdAt:250,status:'approved'}]};
pathing=todayLearningPath(catalog,'writing','A2-U09');
assert.equal(pathing.review,undefined,'Old mistakes are not treated as current after newer feedback');
catalog={...catalog,attempts:[{...incorrect,status:'pending_review'}]};
assert.equal(todayLearningPath(catalog,'writing','A2-U09').review,undefined,
 'Pending writing is not a scored misconception');
catalog={...catalog,attempts:[{...incorrect,status:'unassessed'}]};
assert.equal(todayLearningPath(catalog,'writing','A2-U09').review,undefined,
 'Unassessed oral or planning practice cannot create a scored review');
catalog={...catalog,attempts:[started]};
assert.equal(todayLearningPath(catalog,'reading','A2-U09').resume,undefined,
 'Per-skill Today view only offers a visible lesson');
const hypothetical={id:'VOC-B2-01',title:'Precise stance and evidence-aware language',
 module:'vocabulary',cefr:'B2',minutes:25};
const withCandidate={lessons:[...lessons,hypothetical],attempts:[],course:{sequence:[...course.sequence,hypothetical.id]}};
const proposedToday=todayLearningPath(withCandidate,'vocabulary','B2-U02');
assert.equal(proposedToday.focusUnit,'B2-U02');
assert.equal(proposedToday.learn?.lesson.id,'VOC-B2-01',
 'Once genuinely imported, candidate Unit placement becomes navigable');
assert.equal(todayLearningPath({lessons:[],attempts:[],course}).learn,undefined);
assert.equal(todayLearningPath({lessons:[],attempts:[],course}).availableUnits.length,0);
console.log(JSON.stringify({result:'PASS',gate:'read-only-today-learning-path',canonicalLessonMap:109,
 candidateGuard:12,pilotUnit:'A2-U09',historicalDraftVersionPreserved:true,
 oldMistakeNonCarryover:true,unassessedWritingNotProficiency:true,
 productionWrites:0,actualBrowserGUI:'NOT_TESTED'}));
