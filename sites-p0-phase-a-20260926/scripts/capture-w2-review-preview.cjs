'use strict';
/**
 * Review-only Chromium screenshots of standalone PR code.
 * Not a live site or iPad/Safari QA. No network, backend or account access.
 */
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const {pathToFileURL}=require('node:url');

const root=path.join(__dirname,'..');
const folder=path.join(root,'.sites-runtime/w2-review-artifact');
const html=path.join(folder,'index.html');
if(!fs.existsSync(html))throw Error('Build the review HTML before taking screenshots.');
const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser']
 .map(name=>{try{return cp.execFileSync('which',[name],{encoding:'utf8'}).trim()}catch{return ''}})
 .find(Boolean);
if(!chrome)throw Error('Chromium required to create review evidence.');

const base=pathToFileURL(html).href;
const variants=[
 {file:'desktop-idea-map.png',url:base+'?sample=1&phase=main',width:1300,height:1150},
 {file:'narrow-idea-map.png',url:base+'?sample=1&phase=main',width:550,height:1200},
 {file:'desktop-theory.png',url:base,width:1100,height:1000}
];
for(const test of variants){
 const target=path.join(folder,test.file);
 const result=cp.spawnSync(chrome,[
  '--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-extensions',
  '--disable-background-networking','--no-first-run',
  '--hide-scrollbars','--virtual-time-budget=3500',
  '--window-size='+test.width+','+test.height,
  '--screenshot='+target,test.url
 ],{encoding:'utf8',timeout:30000});
 if(result.error||result.status!==0)throw Error('Chromium screenshot failed '+test.file+': '+(result.stderr||result.error).toString().slice(-650));
 const data=fs.readFileSync(target);
 if(data.length<6000||data.toString('hex',0,8)!=='89504e470d0a1a0a')
  throw Error('No valid PNG produced for '+test.file);
 console.log(JSON.stringify({file:test.file,bytes:data.length,window:test.width+'x'+test.height,previewOnly:true}));
}
console.log('PASS SLE_WEEK2_REVIEW_SCREENSHOTS_WITHOUT_DEPLOY');
