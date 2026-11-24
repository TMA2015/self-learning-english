'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),ts=require('typescript');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
require.extensions['.tsx']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,f);
const wave1=require('../content/grammar-knowledge-v23-wave1.json'),wave2=require('../content/grammar-knowledge-v23-wave2-a1.json'),wave3b=require('../content/grammar-knowledge-v23-wave3b-a2.json'),wave3a=require('../content/grammar-knowledge-v23-wave3a-a2.json'),curriculum=require('../content/curriculum-1.28.0-candidate.json');
assert.equal(wave2.source_curriculum_version,wave1.source_curriculum_version);assert.equal(wave2.source_curriculum_blob,wave1.source_curriculum_blob);assert.equal(wave2.academic_status,'PASS');
assert.equal(Object.keys(wave2.lessons).length,9);assert.equal(Object.values(wave2.lessons).reduce((n,l)=>n+l.sections.length,0),63);assert.equal(Object.values(wave2.lessons).flatMap(l=>l.sections.flatMap(s=>s.quiz??[])).length,18);
assert.deepEqual(Object.keys(wave1.lessons).filter(id=>id in wave2.lessons),[]);
assert.equal(wave3b.source_curriculum_version,wave1.source_curriculum_version);assert.equal(wave3b.source_curriculum_blob,wave1.source_curriculum_blob);assert.equal(wave3b.academic_status,'PASS');
assert.equal(Object.keys(wave3b.lessons).length,8);assert.equal(Object.values(wave3b.lessons).reduce((n,l)=>n+l.sections.length,0),58);
assert.equal(Object.values(wave3b.lessons).flatMap(l=>l.sections.flatMap(s=>s.quiz??[])).length,16);
assert.deepEqual(Object.keys(wave3b.lessons).sort(),Array.from({length:8},(_,i)=>'GRA-A2-'+String(i+9).padStart(2,'0')));
assert.deepEqual(Object.keys(wave3b.lessons).filter(id=>id in wave1.lessons||id in wave2.lessons),[]);
const canon=x=>Array.isArray(x)?x.map(canon):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canon(x[k])])):x;
const reviewed=Buffer.from(JSON.stringify(canon(Object.fromEntries(Object.entries(wave3b.lessons).map(([id,l])=>[id,l.sections])))));
assert.equal(crypto.createHash('sha1').update('blob '+reviewed.length+'\0').update(reviewed).digest('hex'),'5674b42d629f9472bf72eceacbccc9d8e39ff049','exact approved R2 teaching blocks');
assert.equal(wave3a.source_curriculum_version,wave1.source_curriculum_version);assert.equal(wave3a.source_curriculum_blob,wave1.source_curriculum_blob);assert.equal(wave3a.academic_status,'PASS');
assert.deepEqual(Object.keys(wave3a.lessons).sort(),Array.from({length:7},(_,i)=>'GRA-A2-'+String(i+1).padStart(2,'0')));
assert.equal(Object.values(wave3a.lessons).reduce((n,l)=>n+l.sections.length,0),52);
assert.equal(Object.values(wave3a.lessons).flatMap(l=>l.sections.flatMap(s=>s.quiz??[])).length,14);
assert.deepEqual(Object.keys(wave3a.lessons).filter(id=>id in wave1.lessons||id in wave2.lessons||id in wave3b.lessons),[]);
const reviewed3a=Buffer.from(JSON.stringify(canon(Object.fromEntries(Object.entries(wave3a.lessons).map(([id,l])=>[id,l.sections])))));
assert.equal(crypto.createHash('sha1').update('blob '+reviewed3a.length+'\0').update(reviewed3a).digest('hex'),'966ba611b182ad841856782323ae5b83392d8f02','exact approved compact Wave 3A teaching blocks');
const data={...wave1,lessons:{...wave1.lessons,...wave2.lessons,...wave3b.lessons,...wave3a.lessons}};
const {grammarKnowledgeV23Available,GrammarKnowledgeV23}=require('../app/grammar-knowledge-v23.tsx');
const {StructuredGrammarNotes}=require('../app/structured-grammar.tsx');
const raw=fs.readFileSync('content/curriculum-1.28.0-candidate.json');
assert.equal(crypto.createHash('sha1').update('blob '+raw.length+'\0').update(raw).digest('hex'),data.source_curriculum_blob,'immutable reviewed baseline blob');
const ids=Object.keys(data.lessons);assert.equal(ids.length,30);
let sections=0,checks=0,scored=0;
for(const id of ids){
 const lesson=curriculum.lessons.find(l=>l.id===id),entry=data.lessons[id];assert(lesson);
 assert.equal(entry.baselineExplanation,lesson.explanation.en);assert.equal(entry.title,lesson.title);
 assert(grammarKnowledgeV23Available(lesson,'1.28.0'));assert(!grammarKnowledgeV23Available(lesson,'1.25.0'));assert(!grammarKnowledgeV23Available(lesson,'1.29.0'));assert(!grammarKnowledgeV23Available({...lesson,explanation:{...lesson.explanation,en:'changed'}},'1.28.0'));
 sections+=entry.sections.length;scored+=lesson.activities.length;
 const qs=entry.sections.flatMap(s=>s.quiz??[]);checks+=qs.length;
 for(const q of qs){assert.equal(q.options.filter(o=>o.correct).length,1);assert(q.options.every(o=>o.text&&o.feedback&&o.vi));assert(!lesson.activities.some(a=>a.id===q.id))}
 const html=renderToStaticMarkup(React.createElement(StructuredGrammarNotes,{lesson,version:'1.28.0',showVi:false}));
 const vi=renderToStaticMarkup(React.createElement(StructuredGrammarNotes,{lesson,version:'1.28.0',showVi:true}));
 assert(html.includes('data-grammar-knowledge="v2.3"'));assert(html.includes('not saved to your results'));assert(!html.includes('sle-gra02-feedback'));assert(!html.includes('Open Practice layout preview'));assert(vi.includes('lang="vi"'));
 const legacy=renderToStaticMarkup(React.createElement(StructuredGrammarNotes,{lesson,version:'1.25.0',showVi:false}));assert(!legacy.includes('data-grammar-knowledge='));
 if(id==='GRA-A1-02'){assert(html.includes('Mai is my friend.'));assert(!html.includes('Linh is my friend.'))}
 if(id==='GRA-B1-01'){assert(html.includes('have knitting'));assert(!html.includes('have knittting'))}
}
assert.equal(sections,220);assert.equal(checks,62);assert.equal(scored,308);
const uncovered=curriculum.lessons.find(l=>l.module==='grammar'&&!data.lessons[l.id]);assert(uncovered);assert(!grammarKnowledgeV23Available(uncovered,'1.28.0'));
const a1=curriculum.lessons.filter(l=>l.id.startsWith('GRA-A1-'));assert.equal(a1.length,12);assert(a1.every(l=>grammarKnowledgeV23Available(l,'1.28.0')));
const expectedKeys={"GRA-A1-01":["are","Is"],"GRA-A1-03":["trims","make"],"GRA-A1-04":["an","berries"],"GRA-A1-05":["There are","No, there isn’t."],"GRA-A1-07":["can bake","Ask for an action"],"GRA-A1-08":["How","Who delivers the parcels?"],"GRA-A1-09":["That","These"],"GRA-A1-10":["him","hers"],"GRA-A1-11":["Draw a star.","Don’t drop the glass."]};
for(const [id,keys] of Object.entries(expectedKeys))assert.deepEqual(data.lessons[id].sections.flatMap(s=>s.quiz??[]).map(q=>q.options.find(o=>o.correct).text),keys,'NotebookLM keys '+id);
const w3keys={'GRA-A2-09':['written','We visited the zoo in 2023.'],'GRA-A2-10':['just','yet'],'GRA-A2-11':['will get','Present continuous'],'GRA-A2-12':['check','Should we leave now?'],'GRA-A2-13':['She may call.','It is possible that it will not open.'],'GRA-A2-14':['barks','will swim'],'GRA-A2-15':['to choose','making'],'GRA-A2-16':['who / that','The robot that moves is small.']};
for(const [id,keys] of Object.entries(w3keys))assert.deepEqual(data.lessons[id].sections.flatMap(s=>s.quiz??[]).map(q=>q.options.find(o=>o.correct).text),keys,'Wave 3B NotebookLM keys '+id);
const a2=curriculum.lessons.filter(l=>l.id.startsWith('GRA-A2-'));assert.equal(a2.length,16);assert(a2.every(l=>grammarKnowledgeV23Available(l,'1.28.0')));
const w3akeys={'GRA-A2-01':['waters','is working'],'GRA-A2-02':['fixed','Were the windows open?'],'GRA-A2-03':['much','some'],'GRA-A2-04':['smaller','largest'],'GRA-A2-05':['is going to','I am not going to draw.'],'GRA-A2-06':['You must not cycle across the bridge.','Does he have to tidy up?'],'GRA-A2-07':['are putting up','tapping']};
for(const [id,keys] of Object.entries(w3akeys))assert.deepEqual(data.lessons[id].sections.flatMap(s=>s.quiz??[]).map(q=>q.options.find(o=>o.correct).text),keys,'Wave 3A NotebookLM keys '+id);
const norm=s=>s.toLowerCase().replace(/[’‘]/g,"'").replace(/[^\p{L}\p{N}' ]/gu,' ').replace(/\s+/g,' ').trim();
const grams=s=>{const a=norm(s).split(' ');return new Set(a.slice(0,Math.max(0,a.length-2)).map((_,i)=>a.slice(i,i+3).join(' ')))};
const txt=n=>typeof n==='string'?n:(n.children??[]).map(txt).join('');
const all=(n,f)=>typeof n==='string'?[]:[...(f(n)?[n]:[]),...(n.children??[]).flatMap(x=>all(x,f))];
const targets=new Set(['sle-gra02-sentence','sle-gra02-wrong','sle-gra02-right']);
let bankCount=0,fieldCount=0,nearCount=0;
for(const [id,entry] of Object.entries(wave3b.lessons)){
 const lesson=curriculum.lessons.find(l=>l.id===id);assert.equal(lesson.activities.length,10);bankCount+=lesson.activities.length;
 const candidates=entry.sections.flatMap(s=>(s.blocks??[]).flatMap(b=>all(b,n=>n.tag==='td'||n.tag==='text'||targets.has(n.attrs?.class)).map(n=>txt(n).replace(/^[✓✗]\s*/,''))).concat((s.quiz??[]).flatMap(q=>[q.prompt,...q.options.map(o=>o.text),...(q.prompt.includes('___')?[q.prompt.replace(/___(?:\s*\([^)]*\))?/,q.options.find(o=>o.correct).text)]:[])])));
 const fields=lesson.activities.flatMap(q=>[{id:q.id,text:q.prompt},...(q.options??[]).map(o=>({id:q.id,text:o.text})),...(q.answer?.accepted_answers??[]).map(a=>({id:q.id,text:q.prompt.replace(/___(?:\s*\([^)]*\))?/,a)}))]);fieldCount+=fields.length;
 for(const a of candidates)for(const b of fields){const A=norm(a),B=norm(b.text);if(A.split(' ').length<3||B.split(' ').length<3)continue;assert(!(A===B||(A.split(' ').length>=5&&B.includes(A))||(B.split(' ').length>=5&&A.includes(B))),id+' exact overlap '+b.id+' '+a);
 const G=grams(A),H=grams(B),n=[...G].filter(t=>H.has(t)).length;if(n>=2&&n/Math.min(G.size,H.size)>=.5){nearCount++;assert(b.id==='GRA-A2-11-Q9'&&A==='she is going to join'&&B==='she is going to practise tonight',id+' unadjudicated near overlap '+b.id+' '+a);}}
}
assert.equal(bankCount,80);assert.equal(fieldCount,356);assert.equal(nearCount,1);
bankCount=0;fieldCount=0;nearCount=0;let exactCount=0;
for(const [id,entry] of Object.entries(wave3a.lessons)){
 const lesson=curriculum.lessons.find(l=>l.id===id);assert.equal(lesson.activities.length,['GRA-A2-05','GRA-A2-06'].includes(id)?14:10);bankCount+=lesson.activities.length;
 const candidates=entry.sections.flatMap(s=>(s.blocks??[]).flatMap(b=>all(b,n=>n.tag==='td'||n.tag==='text'||targets.has(n.attrs?.class)).map(n=>txt(n).replace(/^[✓✗]\s*/,''))).concat((s.quiz??[]).flatMap(q=>[q.prompt,...q.options.map(o=>o.text),...(q.prompt.includes('___')?[q.prompt.replace(/___(?:\s*\([^)]*\))?/,q.options.find(o=>o.correct).text)]:[])])));
 const fields=lesson.activities.flatMap(q=>[{id:q.id,text:q.prompt},...(q.options??[]).map(o=>({id:q.id,text:o.text})),...(q.answer?.accepted_answers??[]).map(a=>({id:q.id,text:q.prompt.replace(/___(?:\s*\([^)]*\))?/,a)}))]);fieldCount+=fields.length;
 for(const a of candidates)for(const b of fields){const A=norm(a),B=norm(b.text);if(A.split(' ').length<3||B.split(' ').length<3)continue;if(A===B||(A.split(' ').length>=5&&B.includes(A))||(B.split(' ').length>=5&&A.includes(B))){exactCount++;assert(b.id==='GRA-A2-05-Q1'&&A==='is going to'&&B===A,id+' unadjudicated exact overlap '+b.id+' '+a);continue;}
 const G=grams(A),H=grams(B),n=[...G].filter(t=>H.has(t)).length;if(n>=2&&n/Math.min(G.size,H.size)>=.5){nearCount++;assert((b.id==='GRA-A2-04-Q3'&&A==='this is the most cheapest ticket'&&B.startsWith('this is the most interesting'))||
 (['GRA-A2-05-Q4','GRA-A2-05-Q8'].includes(b.id)&&A==='are you going to cook'&&B.includes('are you going to'))||
 (b.id==='GRA-A2-06-Q8'&&A==="you don't have to bring lunch"&&B.includes("you don't have to pay a fee"))||
 (['GRA-A2-07-Q5','GRA-A2-07-Q6'].includes(b.id)&&A==='choose the ing form of tap'&&B.includes('the ing form of the verb')),id+' unadjudicated near overlap '+b.id+' '+a);}}
}
assert.equal(bankCount,78);assert.equal(fieldCount,290);assert.equal(exactCount,1);assert.equal(nearCount,10);
const source=fs.readFileSync('app/grammar-knowledge-v23.tsx','utf8');assert(!/dangerouslySetInnerHTML|localStorage|indexedDB|fetch\(|setAnswers|saveDraft/.test(source));
console.log(JSON.stringify({result:'PASS',gate:'SLE_GRAMMAR_V23_W1_W2_W3A_W3B',lessons:30,sections,quickChecks:checks,baselineScoredItems:scored,versionGuard:true,baselineBlobMatch:true}));
