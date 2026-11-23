'use strict';
// GRA-A1-02 is a source-aware, UI-only pilot. The approved lesson content,
// versioned attempt history and scored activities remain authoritative.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pilot=read('app/grammar-a1-02-notes.tsx');
const css=read('app/grammar-a1-02-notes.css');
const integrated=read('app/structured-grammar.tsx');
const approved=JSON.parse(read('docs/reviews/grammar_40_approved_lesson_design.json'));
const baseline=approved.lessons.find(l=>l.id==='GRA-A1-02');
assert.ok(baseline&&baseline.approved_lesson_design_markdown.startsWith('### Core rule / Meaning'),
 'NotebookLM-approved source is available for GRA-A1-02');
assert.ok(baseline.approved_lesson_design_markdown.includes('### When to use + worked example + why'),
 'approved worked-example source exists');
assert.ok(pilot.includes('lesson.objectives.map('),'goals must use the version-pinned lesson');
assert.ok(pilot.includes('sections.find('),'read current canonical structured notes');
assert.ok(pilot.includes('TeachingBlocks text={core.text}'),'do not hardcode core note');
assert.ok(pilot.includes('TeachingBlocks text={remember.text}'),'do not hardcode remember note');
assert.ok(pilot.includes('const workedLines=lines(worked.text)'),'derive worked examples from lesson');
assert.ok(pilot.includes('const mistakeLines=lines(mistakes.text)'),'derive mistakes from lesson');
assert.ok(integrated.includes("lesson.id==='GRA-A1-02'"),'pilot limited to one lesson ID');
assert.ok(integrated.includes('return <GrammarA102Notes lesson={lesson} sections={sections} showVi={showVi}/>'),
 'do not bypass lesson data or global language toggle');
assert.ok(integrated.includes('return <section className="gdp-integrated"'),
 'other grammar lessons preserve existing renderer');
assert.equal((pilot.match(/meaning:'/g)||[]).length,7,'seven distinct meaning pairs');
for(const subject of ['I','you','he','she','it','we','they']){
 assert.ok(pilot.includes("subject:'"+subject+"'"),'missing subject '+subject);
}
assert.ok(pilot.includes("possessive:'my'")&&pilot.includes("b:' have a bag.'")&&pilot.includes("d:' bag is new.'"),
 'retain the owner-approved I → my + noun / example-pair presentation');
assert.ok(pilot.includes("subject:'you',possessive:'your'")&&pilot.includes("b:' have a ticket.'")&&pilot.includes("d:' ticket is here.'"),
 'NotebookLM R1 optional refinement keeps you/your paired example referentially consistent');
assert.ok(pilot.includes('>{p.c?p.possessive:'),'mid-sentence possessive adjective case preserved');
assert.ok(pilot.includes('<td lang="vi">{p.meaning}</td>'),
 'Meaning column is the sole intentional always-Vietnamese part');
assert.ok(pilot.includes('showVi&&<p className="sle-gra02-translation"')&&pilot.includes('showVi&&mistakeVi[i]'),
 'additional Vietnamese text is behind language support toggle');
assert.ok(pilot.includes('showVi&&<p lang="vi"'),'other Vietnamese explanations gated');
assert.ok(pilot.includes('showVi&&<p className="sle-gra02-translation"'),
 'Vietnamese translations should not always render');
assert.ok(pilot.includes('<h3>{title}</h3>{showVi&&'),
 'English-only headings when toggle is disabled');
assert.equal((pilot.match(/prompt:'[^']+'/g)||[]).length,2,
 'prototype must accurately describe only two Quick Check questions');
assert.ok(pilot.includes('not saved to your results'),'unscored status visible');
assert.ok(pilot.includes('const [responses,setResponses]=useState<Record<number,string>>({})'),
 'Quick Check only local ephemeral React state');
assert.ok(!/saveDraft|setAnswers|foundationRequest|fetch\(|navigator\.|localStorage|indexedDB|updateProgress/.test(pilot),
 'unscored checks must not write to scored state or persistent storage');
assert.ok(css.includes('--sle-blue:#245bb1')&&css.includes('font:inherit'),
 'SLE blue and typography retained');
assert.ok(css.includes('@media(max-width:700px)'),'responsive fallback exists');
assert.ok(css.includes('.sle-gra02-wrong')&&css.includes('.sle-gra02-right'),
 'error comparison has clear text labels and contrast');
console.log('PASS: GRA-A1-02 pilot is single-lesson, version-aware, bilingual-gated and unscored.');
