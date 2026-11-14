'use strict';
/* Generate a single offline HTML using actual Week 2 React components. No production data. */
const fs=require('node:fs');
const path=require('node:path');

(async()=>{
 const root=path.join(__dirname,'..');
 const {build}=await import('vite');
 const temp=path.join(root,'.sites-runtime/w2-preview-temp');
 const target=path.join(root,'.sites-runtime/w2-review-artifact');
 fs.rmSync(temp,{recursive:true,force:true});
 fs.mkdirSync(target,{recursive:true});
 await build({
   root,configFile:false,logLevel:'error',
   define:{'process.env.NODE_ENV':JSON.stringify('production')},
   build:{outDir:temp,emptyOutDir:true,target:'es2022',minify:true,
     lib:{entry:path.join(root,'tests/writing-week2-review-preview-entry.tsx'),
       formats:['iife'],name:'SLEWeek2Review',fileName:()=> 'preview.js'}}
 });
 const js=fs.readFileSync(path.join(temp,'preview.js'),'utf8');
 const css=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
 const localStyles=[
   'html{box-sizing:border-box}*,*::before,*::after{box-sizing:inherit}body{margin:0}',
   '.w2-review-shell{width:min(1160px,100%);margin:0 auto;padding:18px 12px 60px}',
   '.w2-review-header{background:#eaf2fc;border:1px solid #bed2ec;border-radius:16px;padding:24px;margin:0 0 16px}',
   '.w2-review-header h1{margin:8px 0}',
   '.w2-review-label{font-weight:800;font-size:12px;letter-spacing:.05em}',
   '.w2-review-alert{background:#fff4cf;border:1px solid #b69a57;padding:12px;border-radius:10px}',
   '.w2-review-nav{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}',
   '.w2-review-nav button{white-space:normal;min-height:46px;text-align:center;flex:1 1 150px}',
   '.w2-review-nav button.w2-review-active{background:#134a87;color:white}',
   '.w2-review-shell .field{margin:12px 0}',
   '.w2-review-shell .field textarea{display:block;width:100%;min-width:0;max-width:100%;margin-top:5px}',
   '.w2-review-footer{border-top:1px solid #d0deed;margin-top:30px;font-size:13px}',
   '.w2-review-prompt{padding:12px;border-left:3px solid #2367b2;background:#f0f7ff}',
   '@media(max-width:480px){.w2-review-header{padding:14px}.w2-review-shell{padding:8px 8px 35px}}'
 ].join('\n');
 const escapeEnd=(value,tag)=>value.replaceAll('</'+tag,'<\\/'+tag);
 const html='<!doctype html><html lang="en"><head><meta charset="utf-8">'+
   '<meta name="viewport" content="width=device-width,initial-scale=1">'+
   '<meta name="referrer" content="no-referrer">'+
   '<title>SLE Writing Week 2 — Isolated Review Preview</title>'+
   '<style>'+escapeEnd(css+localStyles,'style')+'</style></head>'+
   '<body><div id="app"></div><script>'+escapeEnd(js,'script')+'</script></body></html>';
 const output=path.join(target,'index.html');
 fs.writeFileSync(output,html);
 fs.writeFileSync(path.join(target,'README.txt'),[
   'SLE WEEK 2 — OFFLINE REVIEW DEMO (NOT THE LIVE WEBSITE)',
   '',
   'Open index.html directly in your browser; all JS and CSS are embedded.',
   'Use the five stage tabs to explore the actual React Week 2 components.',
   'In My idea board, choose Load clearly labelled sample ideas to fill the map.',
   'Edit your own ideas and use the Mind Map; refresh clears all preview notes.',
   '',
   'No login, network API, Gemini, Firebase, cloud save or learner data.',
   'The comparison tab shows synthetic sample history, not actual submissions.',
   'This demo cannot establish real production save/resume or Safari/iPad QA.',
   'Commit: '+(process.env.GITHUB_SHA||'local development')
 ].join('\n'));
 console.log(JSON.stringify({result:'PASS',type:'SELF_CONTAINED_W2_REVIEW_PREVIEW',
   path:output,bytes:fs.statSync(output).size,
   previewOnly:true,cloudWrites:0,serverRequired:false}));
})().catch(error=>{console.error(error);process.exitCode=1});
