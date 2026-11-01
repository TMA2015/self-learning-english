'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const raw=path.join(root,'dist','client');
const out=path.join(root,'dist','pages-artifact');
const basePath=(process.env.NEXT_PUBLIC_BASE_PATH??'').replace(/^\/+|\/+$/g,'');
assert(basePath,'NEXT_PUBLIC_BASE_PATH is required for static export QA');
const baseUrl='/'+basePath+'/';
assert(fs.existsSync(raw),'Vinext static export must emit dist/client');
assert(fs.existsSync(out),'Pages staging must emit dist/pages-artifact');
for(const relative of [
  'index.html',
  'favicon.svg',
  'branding/english-app-icon.svg',
  'branding/g-learning-mark.svg',
  'foundation-audio/LIS-A1-01-v1.mp3',
  'foundation-audio/LIS-A2-01-v2.mp3',
  'foundation-audio/LIS-A2-02-v1.mp3',
  'foundation-audio/LIS-B1-01-v2.mp3',
  'foundation-audio/LIS-B1-02-v1.mp3',
]){
  assert(fs.existsSync(path.join(out,relative)),relative+' missing from static export');
}

const rawPageCandidates=[
  path.join(raw,basePath,'index.html'),
  path.join(raw,basePath+'.html'),
  path.join(raw,'index.html'),
];
assert(rawPageCandidates.some(fs.existsSync),'Vinext static export must contain one recognized page layout');
assert(!fs.existsSync(path.join(out,basePath,'index.html')),'Pages artifact must not double-nest the project path');
assert(fs.existsSync(path.join(out,'.nojekyll')),'.nojekyll missing from Pages artifact');
const html=fs.readFileSync(path.join(out,'index.html'),'utf8');
assert(html.includes(baseUrl),'exported HTML must use configured GitHub Pages base path');
assert(!html.includes('"/branding/'),'brand assets must not point at domain root');
assert(!html.includes('"/favicon.svg"'),'favicon must not point at domain root');
assert(!html.includes(baseUrl+basePath+'/'),'project path must not be duplicated');

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
assert(client.includes('publicPath(view.audio.url)'),'Listening audio must pass through static base-path helper');

function walk(dir){
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
    const full=path.join(dir,entry.name);
    return entry.isDirectory()?walk(full):[full];
  });
}
const textAssets=walk(out).filter(file=>/\.(?:html|js|css|json|txt|xml|svg)$/i.test(file));
const allowedPublicFirebaseWebApiKeys=new Set([
  'AIzaSyAnCa-t04dmwFHLARYN77o866tomq4RUBg',
]);
for(const file of textAssets){
  const text=fs.readFileSync(file,'utf8');
  for(const key of text.match(/AIza[0-9A-Za-z_-]{20,}/g)??[]){
    assert(allowedPublicFirebaseWebApiKeys.has(key),'Unexpected Google API key-shaped value found in '+file);
  }
  assert(!/(?:^|[^A-Za-z0-9])sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}/.test(text),'OpenAI API key-shaped secret found in '+file);
  assert(!/GEMINI_API_KEY\s*[=:]/.test(text),'Direct Gemini API key configuration found in '+file);
  assert(!/generativelanguage\.googleapis\.com/.test(text),'Browser must not call Gemini Developer API directly: '+file);
}

console.log(JSON.stringify({
  result:'PASS',
  rawOutput:'dist/client',
  output:'dist/pages-artifact',
  basePath:baseUrl,
  curriculum:'1.11.0',
  staticAudioFiles:5,
  criticalBrowserWritingServerFree:true,
  secretShapeScan:true,
  publicFirebaseWebApiKeyAllowlisted:true,
  directGeminiApiKey:false
}));
