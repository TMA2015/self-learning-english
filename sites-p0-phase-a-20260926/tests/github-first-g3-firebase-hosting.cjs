'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const out=path.join(root,'dist','client');
assert(fs.existsSync(out),'Static export must emit dist/client');

for(const relative of [
  'index.html',
  'favicon.svg',
  'branding/english-app-icon.svg',
  'branding/g-learning-mark.svg',
  'foundation-audio/LIS-A1-01-v1.mp3',
  'foundation-audio/LIS-A2-01-v1.mp3',
  'foundation-audio/LIS-A2-02-v1.mp3',
  'foundation-audio/LIS-B1-01-v1.mp3',
  'foundation-audio/LIS-B1-02-v1.mp3',
]){
  assert(fs.existsSync(path.join(out,relative)),relative+' missing from Firebase Hosting artifact');
}

const html=fs.readFileSync(path.join(out,'index.html'),'utf8');
assert(!html.includes('/self-learning-english/'),'Firebase root build must not retain GitHub Pages subpath');
assert(!html.includes('"/self-learning-english'),'Firebase root build must not retain project-site URLs');

const firebaseConfig=JSON.parse(fs.readFileSync(path.join(root,'firebase.json'),'utf8'));
assert.equal(firebaseConfig.hosting.public,'dist/client');
assert.equal(firebaseConfig.hosting.trailingSlash,true);
assert(!('site' in firebaseConfig.hosting),'project/site binding must remain external to source');

function walk(dir){
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
    const full=path.join(dir,entry.name);
    return entry.isDirectory()?walk(full):[full];
  });
}
const textAssets=walk(out).filter(file=>/\.(?:html|js|css|json|txt|xml|svg|rsc)$/i.test(file));
for(const file of textAssets){
  const text=fs.readFileSync(file,'utf8');
  assert(!/(?:^|[^A-Za-z0-9])sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}/.test(text),'OpenAI secret-shaped value found in '+file);
  assert(!/-----BEGIN (?:RSA |EC |)PRIVATE KEY-----/.test(text),'private key found in '+file);
  assert(!/GEMINI_API_KEY\s*[=:]/.test(text),'direct Gemini API key configuration found in '+file);
  assert(!/generativelanguage\.googleapis\.com/.test(text),'browser must not call Gemini Developer API directly: '+file);
}

console.log(JSON.stringify({
  result:'PASS',
  host:'firebase-hosting',
  output:'dist/client',
  rootHosted:true,
  curriculum:'1.11.0',
  staticAudioFiles:5,
  firebaseProjectBindingExternal:true,
  directGeminiApiKey:false
}));
