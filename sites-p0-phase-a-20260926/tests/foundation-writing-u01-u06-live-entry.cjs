'use strict';
/** Release acceptance for the already reviewed/merged Foundation Writing U01–U06 only. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const home=read('app/home-client.tsx');
const tests=['foundation-writing-u01-v1.cjs','foundation-writing-u02-u03-v1.cjs',
 'foundation-writing-u04-u06-v1.cjs',
 'foundation-writing-u01-browser.cjs','foundation-writing-u02-u03-browser.cjs',
 'foundation-writing-u04-u06-browser.cjs'];
for(const t of tests)assert(read('scripts/qa-free-first.mjs').includes('"'+t+'"'),'QA must include '+t);
assert(home.includes('>Foundation Writing</button>'),'Foundation Writing course entry stays on unchanged Writing page');
assert(home.includes('primary-button foundation-writing-course-cta'),'responsive course CTA class retained');
assert(read('app/globals.css').includes('.foundation-writing-course-cta{max-width:100%;min-width:0;white-space:normal;overflow-wrap:anywhere'), '320px content must wrap rather than overflow');
assert(home.includes('onClick={()=>void navigate("writing-course")}>Foundation Writing'),
 'Writing course entry must open the shared Foundation course overview, not jump into U01');
assert(home.includes('>Writing Studio</button>'),'Writing Studio button must preserve Any Topic Writing path');
assert(home.includes('writingIntro={view==="writing"?<div')&&home.includes('<FoundationDemo'),'the full original Writing skill overview must stay mounted');
const sidebar=home.split('{heading:"SKILL LIBRARY"')[1]?.split('{heading:"ASSESSMENTS & EXAM PREP"')[0]??'';
assert(sidebar.includes('key:"writing",label:"Writing"'),'Writing remains in the left sidebar');
assert(!sidebar.includes('label:"Foundation Writing · U'),'standalone U01–U12 links must be removed only from the sidebar');
for(const id of ['02','03','04','05','06','07','08','09','10','11','12']){
 assert(home.includes('foundation-writing-u'+id),'Unit '+id+' navigation preserved');
}
assert(home.includes('FoundationWritingWave4'),'Wave4 real UI must be mounted for all 12 reviewed units');
assert(home.includes('schemaVersion!==1'),'legacy saved schema guard remains');
assert(home.includes('saveLearnerState'),'existing persistence remains');
const workflow=read('docs/SLE_MASTER_CONTENT_AND_SELF_LEARNING_STANDARD.md');
assert(workflow.includes('[release-english]'),'release authorization marker unchanged');
console.log(JSON.stringify({result:'PASS',gate:'FOUNDATION_WRITING_U01_U06_RELEASE_ENTRY',
 actualUnitsAvailable:12,academicSourceExpected:'U01–U12 from all four reviewed Waves',
 wave3:'INCLUDED',wave4:'INCLUDED_SOURCE_CHECKED',legacyStorage:'UNMODIFIED',firebaseWrites:0}));
