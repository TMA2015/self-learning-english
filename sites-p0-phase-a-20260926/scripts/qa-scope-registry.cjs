'use strict';
// Single executable selection registry. All existing checks are mandatory unless
// explicitly registered here as expensive, isolated matrices. Unknown => FULL.
const assert=require('node:assert/strict');
const groups={
 vocabulary:{css:'app/vocabulary-knowledge-v23.css',component:'app/vocabulary-knowledge-v23.tsx',content:['content/vocabulary-knowledge-v23.json']},
 grammar:{css:'app/grammar-knowledge-v23.css',component:'app/grammar-knowledge-v23.tsx',content:['wave1','wave2-a1','wave3a-a2','wave3b-a2','wave4a-b1','wave4b-b1-b2'].map(x=>'content/grammar-knowledge-v23-'+x+'.json')},
 reading:{css:'app/reading-knowledge-v23.css',component:'app/reading-knowledge-v23.tsx',content:['content/reading-knowledge-v23.json']},
 writing:{presentation:'app/foundation-writing-course.tsx',content:[]}
};
const extended={
 'grammar-knowledge-v23-browser.cjs':{domain:'grammar',invariant:'Grammar real browser, historical and draft routes; 138 cases'},
 'reading-knowledge-v23-browser.cjs':{domain:'reading',invariant:'Reading real browser, historical/draft/successor routes; 68 cases'},
 'vocabulary-knowledge-v23-browser.cjs':{domain:'vocabulary',invariant:'Vocabulary real browser, historical/draft routes; 45 cases'},
 'unit10-chrome-audio-codec.cjs':{domain:'media',invariant:'Exact Unit10 media loads and ends in Chrome'},
 'unit10-media01-real-browser.cjs':{domain:'media',invariant:'Actual Unit10 player and original audio guards'}
};
// Media is not a scoped domain: any media/audio, shared runtime, storage,
// assessment, provider, workflow, new/unregistered path remains full.
function scope(tier,skills=[]){
 assert(['1','2','3'].includes(String(tier)),'Invalid QA tier');
 const full=String(tier)==='3';
 assert(full?skills.length===0:skills.length>0&&skills.every(s=>Object.hasOwn(groups,s))&&new Set(skills).size===skills.length,'Invalid scope; full QA required');
 const included=name=>full||!Object.hasOwn(extended,name)||skills.includes(extended[name].domain);
 return {full,skills,included,omitted:Object.keys(extended).filter(name=>!included(name))};
}
function selfTest(){
 for(const skill of Object.keys(groups)){
  const s=scope(2,[skill]);
  assert(s.included('storage-retention-v2.cjs')&&s.included('current-curriculum-integrity.cjs')&&s.included('foundation-writing-home-browser.cjs'));
  for(const [name,m] of Object.entries(extended))assert.equal(s.included(name),skill===m.domain);
 }
 const combined=scope(2,['reading','grammar']);assert(combined.included('reading-knowledge-v23-browser.cjs')&&combined.included('grammar-knowledge-v23-browser.cjs'));
 assert.equal(scope(3).omitted.length,0);
 for(const [tier,skills] of [[2,[]],[2,['media']],[2,['unknown']],[2,['grammar','grammar']],[3,['reading']],[0,[]]])assert.throws(()=>scope(tier,skills));
 console.log('QA_SELECTION_REGISTRY_SELF_TEST_PASS');
}
module.exports={groups,extended,scope,selfTest};
if(require.main===module)selfTest();
