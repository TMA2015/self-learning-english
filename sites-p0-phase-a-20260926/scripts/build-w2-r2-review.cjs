'use strict';
/**
 * Build the R2 visual-UX sandbox as a single offline HTML file.
 * NO deployment, NO network clients, NO SLE accounts or real learner records.
 */
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const {build}=await import('vite');
 const temp=path.join(root,'.sites-runtime/w2-r2-build-temp');
 const destination=path.join(root,'.sites-runtime/w2-r2-review');
 fs.rmSync(temp,{recursive:true,force:true});
 fs.mkdirSync(destination,{recursive:true});
 await build({
  root,configFile:false,logLevel:'error',
  define:{'process.env.NODE_ENV':JSON.stringify('production')},
  build:{
   outDir:temp,emptyOutDir:true,minify:true,target:'es2022',cssCodeSplit:false,
   lib:{entry:path.join(root,'tests/writing-week2-r2-review-entry.tsx'),
    formats:['iife'],name:'SLEWeek2R2',fileName:()=> 'preview.js'}
  }
 });
 const files=fs.readdirSync(temp);
 const js=fs.readFileSync(path.join(temp,'preview.js'),'utf8');
 const css=files.filter(n=>n.endsWith('.css')).map(n=>fs.readFileSync(path.join(temp,n),'utf8')).join('\n');
 if(!js.includes('Writing Coach'))throw Error('Expected R2 React bundle not found');
 const legacyCss=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
 const extraCss='html,body{margin:0;min-height:100%}body{background:#f5f8fc}#app{min-width:0}';
 const escape=(value,tag)=>value.replaceAll('</'+tag,'<\\/'+tag);
 const csp="default-src 'none'; connect-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; base-uri 'none'; form-action 'none'; object-src 'none'; frame-src 'none'";
 const html='<!doctype html><html lang="en"><head>'+
  '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
  '<meta name="referrer" content="no-referrer">'+
  '<meta http-equiv="Content-Security-Policy" content="'+csp+'">'+
  '<title>Self-Learning English — Writing Week 2 R2 UX Preview</title>'+
  '<style>'+escape(legacyCss+'\n'+css+'\n'+extraCss,'style')+'</style></head>'+
  '<body><div id="app"></div><script>'+escape(js,'script')+'</script></body></html>';
 if(/<script[^>]*\bsrc=/.test(html))throw Error('External script is forbidden');
 const output=path.join(destination,'index.html');
 fs.writeFileSync(output,html);
 fs.writeFileSync(path.join(destination,'README.txt'),[
  'SLE WRITING WEEK 2 UX PROTOTYPE R2',
  'This is a self-contained static browser review, not the live website.',
  '',
  'Desktop: choose Sort Ideas to drag cards; tap-to-place also works.',
  'Idea Board: select writing task, add a main idea, then select branches.',
  'Add reasons, examples, sub-ideas, vocabulary; mark a best idea.',
  'Tablet: selected-node editor appears as a bottom sheet.',
  '',
  'NO cloud save, AI calls, Firebase, learner data or grading.',
  'Refresh clears all prototype edits. Existing Week 2 fields are never written.',
  'CSP prohibits network connections. The HTML is self-contained.',
  'Owner real-browser review and academic R2 review remain pending.'
 ].join('\n'));
 console.log(JSON.stringify({result:'PASS',type:'SLE_W2_R2_OFFLINE_VISUAL_REVIEW',
  bytes:fs.statSync(output).size,cssBundleFiles:files.filter(n=>n.endsWith('.css')),
  output,network:'BLOCKED',database:'NONE',userData:'SYNTHETIC',production:'UNTOUCHED'}));
})().catch(err=>{console.error(err);process.exitCode=1});
