'use strict';
/*
 * Standalone actual React R2 preview export for owner visual inspection.
 * Vite bundles committed Week 2 React components + canonical domain + SLE CSS.
 * No runtime network access; ALL work lives under isolated synthetic local prefix.
 * This is NOT deployment and NOT evidence of physical iPad Safari QA.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),
 {execFileSync}=require('node:child_process'),
 {deflateRawSync}=require('node:zlib');
function crc32(buf){
 let crc=0xffffffff;
 for(const x of buf){crc^=x;for(let j=0;j<8;j++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}
 return (crc^0xffffffff)>>>0;
}
function zip(filePairs){
 let offset=0,parts=[],dirs=[];
 for(const [name,source] of filePairs){
  const filename=Buffer.from(name),raw=Buffer.isBuffer(source)?source:Buffer.from(source);
  const packed=deflateRawSync(raw,{level:9}),crc=crc32(raw);
  const header=Buffer.alloc(30);header.writeUInt32LE(0x04034b50,0);header.writeUInt16LE(20,4);
  header.writeUInt16LE(0,6);header.writeUInt16LE(8,8);header.writeUInt32LE(crc,14);
  header.writeUInt32LE(packed.length,18);header.writeUInt32LE(raw.length,22);
  header.writeUInt16LE(filename.length,26);
  parts.push(header,filename,packed);
  const directory=Buffer.alloc(46);directory.writeUInt32LE(0x02014b50,0);
  directory.writeUInt16LE(20,4);directory.writeUInt16LE(20,6);
  directory.writeUInt16LE(8,10);directory.writeUInt32LE(crc,16);
  directory.writeUInt32LE(packed.length,20);directory.writeUInt32LE(raw.length,24);
  directory.writeUInt16LE(filename.length,28);directory.writeUInt32LE(offset,42);
  dirs.push(directory,filename);
  offset+=header.length+filename.length+packed.length;
 }
 const central=Buffer.concat(dirs),end=Buffer.alloc(22);
 end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(filePairs.length,8);
 end.writeUInt16LE(filePairs.length,10);end.writeUInt32LE(central.length,12);
 end.writeUInt32LE(offset,16);
 return Buffer.concat([...parts,central,end]);
}
(async()=>{
 const {build}=await import('vite');
 const root=path.resolve(__dirname,'..'),out=path.join(root,'.sites-runtime/w2-r2-owner-export');
 const sourceHead=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',define:{
   'process.env.NODE_ENV':JSON.stringify('production'),
   'process.env.NEXT_PUBLIC_LEARNING_RUNTIME':JSON.stringify('browser'),
   'process.env.NEXT_PUBLIC_BASE_PATH':JSON.stringify(''),
   'process.env.NEXT_PUBLIC_SOURCE_HEAD':JSON.stringify(sourceHead)
  },build:{outDir:out,emptyOutDir:true,target:'es2022',minify:true,
   assetsInlineLimit:100000000,cssCodeSplit:false,
   lib:{entry:path.join(root,'tests/writing-week2-r1-export-entry.tsx'),
    formats:['iife'],name:'SLEWeek2R2Export',fileName:()=>'preview.js'}}});
 const script=fs.readFileSync(path.join(out,'preview.js'),'utf8').replaceAll('</script','<\\/script');
 const css=fs.readdirSync(out).filter(n=>n.endsWith('.css')).map(n=>fs.readFileSync(path.join(out,n),'utf8')).join('\n');
 assert(script.length>60000&&css.length>1500,'Unexpectedly small Vite React/CSS bundle');
 for(const required of ['THE TASK','HOW THE THINKING WORKS','E1 · Park','E2 · Museum','E3 · Library']){
  assert(script.includes(required),'R2 expected text missing in React bundle: '+required);
 }
 const html='<!doctype html><html lang="en"><head><meta charset="utf-8">'+
  '<meta name="viewport" content="width=device-width, initial-scale=1">'+
  '<meta http-equiv="Content-Security-Policy" content="default-src &#39;none&#39;; script-src &#39;unsafe-inline&#39;; style-src &#39;unsafe-inline&#39;; img-src data:; font-src data:; connect-src &#39;none&#39;; base-uri &#39;none&#39;; form-action &#39;none&#39;">'+
  '<title>Self-Learning English · Week 2 R2 Preview · PR #158</title>'+
  '<style>'+css.replaceAll('</style','<\\/style')+'</style></head>'+
  '<body><div id="root"></div><noscript>This React preview requires JavaScript.</noscript>'+
  '<script>window.process={env:{NODE_ENV:"production",NEXT_PUBLIC_LEARNING_RUNTIME:"browser",NEXT_PUBLIC_BASE_PATH:""}};</script>'+
  '<script>'+script+'</script></body></html>';
 assert(html.includes('connect-src &#39;none&#39;'),'Network must remain disabled by CSP');
 const notes='Self-Learning English · Writing Course Week 2 R2 · PR #158\n'+
  'HOW TO OPEN: extract this ZIP, then double-click PR158_WEEK2_R2_REACT_PREVIEW.html in Chrome or Edge.\n'+
  'This is an isolated, OFFLINE Vite bundle of the real Week 2 R2 React component and SLE CSS.\n'+
  'Only fictional/synthetic localStorage namespace. Use Reset fictional work to clear it.\n'+
  'No external AI, cloud writes or links; full website authentication & router not included.\n'+
  'Reference source commit '+sourceHead+'.\n'+
  'This does not prove actual Safari/iPad visual performance or owner approval.\n';
 const outZip=zip([['PR158_WEEK2_R2_REACT_PREVIEW.html',html],['README.txt',notes]]);
 const resultPath=path.join(out,'PR158_WEEK2_R2_REACT_PREVIEW.zip');
 fs.writeFileSync(resultPath,outZip);
 const base64=outZip.toString('base64'),chunk=32000,n=Math.ceil(base64.length/chunk);
 console.log('R2_PREVIEW_PACKAGE_META '+JSON.stringify({source:'committed Week2 R2 React and CSS',
  baseSource:sourceHead,
  htmlBytes:Buffer.byteLength(html),zipBytes:outZip.length,parts:n,offline:true,synthetic:true}));
 for(let i=0;i<n;i++)console.log('R2_PREVIEW_B64_'+String(i).padStart(4,'0')+'_'+n+':'+base64.slice(i*chunk,(i+1)*chunk));
 console.log('R2_PREVIEW_PACKAGE_COMPLETE '+JSON.stringify({parts:n,bytes:outZip.length}));
})().catch(err=>{console.error(err);process.exitCode=1});
