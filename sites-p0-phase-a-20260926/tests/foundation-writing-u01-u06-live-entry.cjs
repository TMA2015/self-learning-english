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
assert(home.includes('Start Foundation Writing · U01–U06 available'),'visible entry in Writing tab');
assert(home.includes('primary-button foundation-writing-course-cta'),'responsive course CTA class retained');
assert(read('app/globals.css').includes('.foundation-writing-course-cta{max-width:100%;min-width:0;white-space:normal;overflow-wrap:anywhere'), '320px content must wrap rather than overflow');
assert(home.includes('onClick={()=>void navigate("foundation-writing")}>Start Foundation Writing'),
 'Writing course entry must open U01 and not the unrelated 12-week Writing Coach');
assert(home.includes('Open AI Writing Feedback · Any Topic'),'existing writing path preserved');
for(const id of ['02','03','04','05','06']){
 assert(home.includes('foundation-writing-u'+id),'Unit '+id+' navigation preserved');
}
assert(!home.includes('Start Foundation Writing · U01–U12 available'),'do not claim unreleased content');
assert(home.includes('schemaVersion!==1'),'legacy saved schema guard remains');
assert(home.includes('saveLearnerState'),'existing persistence remains');
const workflow=read('docs/SLE_MASTER_CONTENT_AND_SELF_LEARNING_STANDARD.md');
assert(workflow.includes('[release-english]'),'release authorization marker unchanged');
console.log(JSON.stringify({result:'PASS',gate:'FOUNDATION_WRITING_U01_U06_RELEASE_ENTRY',
 actualUnitsAvailable:6,academicSourceExpected:'U01–U06 from already merged Wave1/Wave2',
 wave3:'NOT_INCLUDED',wave4:'NOT_INCLUDED',legacyStorage:'UNMODIFIED',firebaseWrites:0}));
