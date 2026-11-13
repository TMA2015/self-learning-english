'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const out='.sites-runtime/offline-postfeedback';
execFileSync(process.execPath,[
 'node_modules/typescript/bin/tsc','domain/post-lesson-review.ts',
 '--outDir',out,'--rootDir','.','--module','commonjs','--target','es2022',
 '--skipLibCheck','--lib','es2022,dom'
],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(root,out,'package.json'),'{"type":"commonjs"}\n');
const {buildOfflineLessonReview}=require('../'+out+'/domain/post-lesson-review.js');
const lesson={id:'GRA-A2-07',module:'grammar',title:'Perfect tense in context'};
const old={
 status:'scored',version:'1.18.0',
 results:[
  {id:'GRA-A2-07-Q1',correct:true,explanation:'Well explained.'},
  {id:'GRA-A2-07-Q2',correct:false,explanation:'Rule was applied incorrectly. Next step: Compare time meaning before choosing the form.',tags:['tense-and-aspect']},
  {id:'GRA-A2-07-Q3',correct:false,explanation:'A different use is needed.',tags:['tense-and-aspect']},
  {id:'GRA-A2-07-Q4',correct:null,outcome:'format-only',explanation:'Saved without knowledge score.'}
 ]
};
const original=JSON.stringify(old);
assert.equal(buildOfflineLessonReview(lesson,{...old,status:'started'}),null,
 'Never reveal submitted keys or personalized tips while editing');
const got=buildOfflineLessonReview(lesson,old);
assert(got);
assert.deepEqual([got.correct,got.objectiveTotal,got.incorrect,got.formatOnly,got.reviewOnly],
 [1,3,2,1,0]);
assert.equal(got.actions.length,2);
assert.equal(got.actions[0].questionId,'GRA-A2-07-Q2');
assert.equal(got.actions[0].advice,'Compare time meaning before choosing the form.');
assert.match(got.actions[1].advice,/Compare the rule/);
assert(!('boundary' in got),'No repeated CEFR disclaimer in every result');
assert.equal(JSON.stringify(old),original,'Read-only post-review cannot mutate original attempt');
const good=buildOfflineLessonReview(lesson,{
 ...old,results:old.results.filter(x=>x.correct===true)
});
assert.equal(good.incorrect,0);
assert.match(good.headline,/new context/);
assert.deepEqual(good.actions,[]);
const open=buildOfflineLessonReview({id:'WRI-B2-04',module:'writing',title:'Writing transfer'},{
 status:'pending_review',version:'1.27.0',
 results:[{id:'WRI-B2-04-Q1',correct:null,explanation:'Saved for adult review'}]
});
assert.equal(open.reviewOnly,1);
assert.equal(open.objectiveTotal,0);
assert.match(open.headline,/trusted review/);
const oral=buildOfflineLessonReview({id:'SPE-A2-02',module:'speaking',title:'Speaking preparation'},{
 status:'scored',version:'1.18.0',results:[{id:'SPE-A2-02-Q1',correct:true}]
});
assert(!('boundary' in oral),'Objective result advice must not repeat a generic proficiency caveat');
const noScoring=buildOfflineLessonReview(lesson,{...old,results:[]});
assert.equal(noScoring,null);
const ui=fs.readFileSync(path.join(root,'app/foundation.tsx'),'utf8');
assert(ui.includes("!editable&&attempt&&(attempt.results?.length??0)>0&&<OfflineLessonReview"),
 'No feedback must be exposed before submit');
assert(ui.includes("import {OfflineLessonReview} from './offline-lesson-review'"));
const display=fs.readFileSync(path.join(root,'app/offline-lesson-review.tsx'),'utf8');
assert(display.includes('What to practise next'));
assert(display.includes('Go to question'));
assert(!display.includes('not a certified CEFR'));
const voc=buildOfflineLessonReview({id:'VOC-A2-01',module:'vocabulary',title:'Daily routines'},{status:'scored',version:'1.25.0',results:[{id:'VOC-A2-01-Q11',correct:false,explanation:'Set or lay the table.'}]});
assert.equal(voc.actions.length,1);
assert.match(voc.actions[0].advice,/set the table and lay the table/i);
assert.doesNotMatch(voc.actions[0].advice,/place, an object, an action/i);
assert(!/requestWritingAI|firebase|fetch\(/i.test(display),
 'Offline feedback UI must make no AI/network calls');
console.log(JSON.stringify({
 result:'PASS',gate:'offline-post-lesson-repair-guidance',
 originalGradePreserved:true,answerKeysProtectedPreSubmit:true,
 wrongQuestionsHaveNextActions:true,writingRemainsPending:true,
 oralProficiencyNotAsserted:true,formatOnlyNeverCounted:true,
 externalAI:'NOT_USED',newPersistenceWrites:0,
 productionIntegration:false
}));
