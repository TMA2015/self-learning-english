'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const out=path.join(root,'dist','client');
assert(fs.existsSync(out),'Firebase static build must emit dist/client');

for(const relative of [
  'index.html',
  'favicon.svg',
  'branding/english-app-icon.svg',
  'branding/g-learning-mark.svg',
  'foundation-audio/LIS-A1-01-v1.mp3',
  'foundation-audio/LIS-A1-02-v1.mp3',
  'foundation-audio/LIS-B1-03-v1.mp3',
  'foundation-audio/LIS-A2-01-v2.mp3',
  'foundation-audio/LIS-A2-02-v1.mp3',
  'foundation-audio/LIS-B1-01-v2.mp3',
  'foundation-audio/LIS-B1-02-v1.mp3',
  'foundation-audio/LIS-A1-01-v2.mp3',
  'foundation-audio/LIS-A2-02-v2.mp3',
  'foundation-audio/LIS-B1-02-v2.mp3',
  'foundation-audio/LIS-A2-03-v1.mp3',
  'foundation-audio/LIS-B1-04-v1.mp3',
  'pronunciation-audio/PRO-A2-01-v1.mp3',
  'pronunciation-audio/PRO-A2-02-v1.mp3',
  'pronunciation-audio/PRO-A2-03-v1.mp3',
  'pronunciation-audio/PRO-B1-01-v1.mp3',
  'pronunciation-audio/PRO-B1-02-v1.mp3',
]){
  assert(fs.existsSync(path.join(out,relative)),relative+' missing from Firebase Hosting build');
}

for(const [name,manifest] of Object.entries({listening:require('../content/foundation-audio.json'),pronunciation:require('../content/pronunciation-audio.json')})){
 for(const m of Object.values(manifest)){const relative=m.url.replace(/^\//,'');assert(fs.readFileSync(path.join(out,relative)).equals(fs.readFileSync(path.join(root,'public',relative))),name+' built asset must be byte-identical');}
}
const crypto=require('node:crypto');
const diagnosticManifest=require('../content/diagnostic-audio-manifest.json');
assert.equal(Object.keys(diagnosticManifest).length,15,'Diagnostic must have 15 MP3 mappings');
for(const [taskId,m] of Object.entries(diagnosticManifest)){
 const relative=m.url.replace(/^\//,'');
 const sourceFile=path.join(root,'public',relative),builtFile=path.join(out,relative);
 assert(fs.existsSync(sourceFile)&&fs.existsSync(builtFile),taskId+': diagnostic MP3 missing from build');
 const bytes=fs.readFileSync(builtFile);
 assert(bytes.equals(fs.readFileSync(sourceFile)),taskId+': diagnostic MP3 changed during build');
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),m.sha256,taskId+': diagnostic audio SHA-256 mismatch');
}
// The Stage 3 baseline remains immutable and available for saved attempts,
// but the built browser must activate the latest reviewed cumulative package.
const baseline=require('../content/curriculum-1.18.0-candidate.json');
const stage3=require('../content/curriculum-1.18.1-candidate.json');
const archived1200=require('../content/curriculum-1.20.0-candidate.json');
const active=require('../content/curriculum-1.25.0-candidate.json');
assert.equal(archived1200.lessons.length,123);
assert.deepEqual(active.lessons.slice(0,123),archived1200.lessons,'All 123 prior lessons unchanged');
assert.equal(baseline.schema_version,'1.18.0');
assert.equal(stage3.schema_version,'1.18.1');
assert.equal(stage3.lessons.length,109);
assert.equal(active.schema_version,'1.25.0');
assert.equal(active.lessons.length,154);
assert.equal(active.lessons.flatMap(l=>l.activities).length,1125);
const source1240=require('../content/curriculum-1.24.0-candidate.json');
assert.deepEqual(active.lessons.slice(0,142),source1240.lessons,'All 142 previously released lessons must remain immutable');
assert.deepEqual(active.course.sequence.slice(0,142),source1240.course.sequence,'Historical course order must not move');
assert.deepEqual(active.rubrics,source1240.rubrics,'Historical rubrics must remain immutable');
const runtimeSource=fs.readFileSync(path.join(root,'infrastructure','browser','local-runtime.ts'),'utf8');
assert(runtimeSource.includes("import curriculum1250 from '../../content/curriculum-1.25.0-candidate.json'"),
  'Static browser runtime must bundle the reviewed v1.25.0 curriculum');
const raw=fs.readFileSync(path.join(root,'content/curriculum-1.15.0-candidate.json'));const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;const sha=v=>crypto.createHash('sha256').update(v).digest('hex');assert.equal(sha(raw),'981a7273a9158c9e53a0e3336de1a88892024f617330d797d534f9e293dc4426');assert.equal(sha(JSON.stringify(canonical(JSON.parse(raw)))),'66663bb61cf60b266d25e8abd890e81ad27398d3ebee9b7cd5cd211de878b1e8');
const html=fs.readFileSync(path.join(out,'index.html'),'utf8');
assert(!html.includes('/self-learning-english/self-learning-english/'),'Firebase build must not duplicate a GitHub Pages base path');

const routePage=fs.readFileSync(path.join(root,'app','page.tsx'),'utf8');
const sourcePage=fs.readFileSync(path.join(root,'app','home-client.tsx'),'utf8');
assert(routePage.includes('export const dynamic = "force-static"'),'root learning route must remain explicitly static');
assert(!sourcePage.includes('fetch("/api/evaluate"'),'browser Writing flow must not call /api/evaluate directly');
assert(!sourcePage.includes('"/api/practice"'),'browser Writing flow must not call /api/practice directly');
assert(sourcePage.includes('evaluateWritingProcess('));
assert(sourcePage.includes('saveGardenRelevantIdea('));

const client=fs.readFileSync(path.join(root,'infrastructure','browser','client-services.ts'),'utf8');
assert(client.includes("if(!browserLearningEnabled())return jsonFetch('/api/evaluate'"),'Sites Writing API fallback must remain');
assert(client.includes("if(!browserLearningEnabled())return jsonFetch('/api/practice'"),'Sites mini-practice API fallback must remain');
assert(client.includes('publicPath(view.audio.url)'),'Listening audio must pass through the static public-path helper');

assert(client.includes('publicPath(view.pronunciationAudio.url)'),'Pronunciation audio must use publicPath');
const firebaseConfig=fs.readFileSync(path.join(root,'firebase.json'),'utf8');
const firebase=JSON.parse(firebaseConfig);
assert.equal(firebase.hosting?.target,'english');
assert.equal(firebase.hosting?.public,'dist/client');

function walk(dir){
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
    const full=path.join(dir,entry.name);
    return entry.isDirectory()?walk(full):[full];
  });
}
const textAssets=walk(out).filter(file=>/\.(?:html|js|css|json|txt|xml|svg)$/i.test(file));
// A source import alone is insufficient: the built static JS must contain
// Stage 3 lesson material after optimization, so a stale baseline build fails.
const builtJS=walk(out).filter(file=>/\.js$/i.test(file));
assert(builtJS.length>0,'No static JavaScript emitted by Firebase build');
const hasStage3Text=builtJS.some(file=>{
  const text=fs.readFileSync(file,'utf8');
  return text.includes('guitar group')&&text.includes('science room is along the hall');
});
assert(hasStage3Text,'Firebase built JavaScript is missing Stage 3 worked demonstrations');
assert(builtJS.some(file=>{const t=fs.readFileSync(file,'utf8');return t.includes('City Museum')&&t.includes('Photo Club');}),
 'Firebase built JavaScript must include reviewed F2 A1-U08/A2-U07 Reading');
assert(builtJS.some(file=>{const t=fs.readFileSync(file,'utf8');return t.includes('Library Reminders')&&t.includes('40 borrowed books were returned late');}),
 'Firebase built JavaScript must include reviewed B1-U02 Reading content');
assert(builtJS.some(file=>{const t=fs.readFileSync(file,'utf8');return t.includes('Sports Day Snack Table')&&t.includes('Harbour Market');}),
 'Firebase built JS must contain new reviewed F2 A1/A2 Reading lessons');
assert(builtJS.some(file=>{const t=fs.readFileSync(file,'utf8');return t.includes('Brook Town')&&t.includes('New School Timetable');}),
 'Firebase built JS must contain reviewed A1-U03/A1-U06 v1.25.0 reading');
assert(builtJS.some(file=>{const t=fs.readFileSync(file,'utf8');return t.includes('Garden Open Day')&&t.includes('Arts Workshop');}),
 'Firebase built JS must contain reviewed A2-U02/A2-U04 v1.25.0 reading');
assert(builtJS.some(file=>{const t=fs.readFileSync(file,'utf8');return t.includes('Exhibition Morning')&&t.includes('Courtyard Project');}),
 'Firebase built JS must contain reviewed B1-U01/B1-U05 v1.25.0 reading');
const allowedPublicFirebaseWebApiKeys=new Set([
  'AIzaSyAnCa-t04dmwFHLARYN77o866tomq4RUBg',
]);
for(const file of textAssets){
  const text=fs.readFileSync(file,'utf8');
  for(const key of text.match(/AIza[0-9A-Za-z_-]{20,}/g)??[]){
    assert(allowedPublicFirebaseWebApiKeys.has(key),'Unexpected Google API key-shaped value found in '+file);
  }
  assert(!/(?:^|[^A-Za-z0-9])sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}/.test(text),'OpenAI API key-shaped secret found in '+file);
  assert(!/-----BEGIN (?:RSA |EC )?PRIVATE KEY-----|\"type\"\s*:\s*\"service_account\"/.test(text),'Service-account/private-key material found in '+file);
  assert(!/GEMINI_API_KEY\s*[=:]/.test(text),'Direct Gemini API key configuration found in '+file);
  assert(!/generativelanguage\.googleapis\.com/.test(text),'Browser must not call Gemini Developer API directly: '+file);
}

console.log(JSON.stringify({
  result:'PASS',
  output:'dist/client',
  hosting:'g-learning-english',
  curriculum:active.schema_version,
  staticAudioFiles:44,
  criticalBrowserWritingServerFree:true,
  secretShapeScan:true,
  publicFirebaseWebApiKeyAllowlisted:true,
  directGeminiApiKey:false,
}));
