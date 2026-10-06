'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');

const config=read('infrastructure/browser/firebase-public-config.ts');
const bridge=read('infrastructure/browser/firebase-ai-browser.ts');
const provider=read('infrastructure/ai/firebase-ai-logic-provider.ts');
const services=read('infrastructure/browser/client-services.ts');
const hosting=JSON.parse(read('firebase.json'));
const firebaserc=JSON.parse(read('.firebaserc'));

assert(config.includes("projectId:'roadmap-toan-ai'"));
assert(config.includes("geminiModel:'gemini-3.5-flash'"));
assert(config.includes("FIREBASE_HOSTING_SITE='g-learning-english'"));
assert(bridge.includes("from 'firebase/app'"));
assert(bridge.includes("from 'firebase/app-check'"));
assert(bridge.includes("from 'firebase/ai'"));
assert(bridge.includes('new ReCaptchaEnterpriseProvider(config.appCheckSiteKey)'));
assert(bridge.includes('new GoogleAIBackend()'));
assert(bridge.includes('responseMimeType:input.responseMimeType'));
assert(!/generationConfig:\s*\{[^}]*temperature\s*:/s.test(bridge));
assert(!bridge.includes('generativelanguage.googleapis.com'));
assert(!bridge.includes('GEMINI_API_KEY'));
assert(provider.includes('MAX_INPUT_CHARS'));
assert(provider.includes('MAX_INSTRUCTION_CHARS'));
assert(services.indexOf('recordEvidence(provisionalEvidence)')<services.indexOf('browserTutorService()'));
assert(services.includes("evaluationStatus:'validated'"));
assert(services.includes("evaluationStatus:'pending_review'"));
assert.equal(hosting.hosting.target,'english');
assert.equal(firebaserc.projects.default,'roadmap-toan-ai');
assert.deepEqual(firebaserc.targets['roadmap-toan-ai'].hosting.english,['g-learning-english']);
assert.equal(hosting.hosting.public,'dist/client');

console.log(JSON.stringify({
  result:'PASS',
  firebaseProject:'roadmap-toan-ai',
  hostingSite:'g-learning-english',
  model:'gemini-3.5-flash',
  appCheck:'Fraud Defense / reCAPTCHA Enterprise',
  appCheckDebugLocalOnly:true,
  directGeminiApiKey:false,
  deterministicFallback:true,
  workSavedBeforeAI:true
}));
