import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const source=path.join(root,"dist","client");
const destination=path.join(root,"dist","pages-artifact");
const basePath=(process.env.NEXT_PUBLIC_BASE_PATH??"").replace(/^\/+|\/+$/g,"");
if(!basePath)throw new Error("NEXT_PUBLIC_BASE_PATH is required for project-site staging.");
if(!fs.existsSync(source))throw new Error("Static client output is missing: dist/client");

const nestedIndex=path.join(source,basePath,"index.html");
const flatBaseHtml=path.join(source,`${basePath}.html`);
const rootIndex=path.join(source,"index.html");
const mode=fs.existsSync(nestedIndex)?"nested":
  fs.existsSync(flatBaseHtml)?"flat-base":
  fs.existsSync(rootIndex)?"root":
  null;
if(!mode){
  const files=[];
  const walk=(dir,depth=0)=>{
    if(depth>3)return;
    for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
      const full=path.join(dir,entry.name);
      if(entry.isDirectory())walk(full,depth+1);
      else files.push(path.relative(source,full));
      if(files.length>=120)return;
    }
  };
  walk(source);
  throw new Error(`No exported page HTML found. dist/client sample: ${files.slice(0,120).join(", ")}`);
}

fs.rmSync(destination,{recursive:true,force:true});
fs.mkdirSync(destination,{recursive:true});

function copyEntry(from,to){
  const stat=fs.statSync(from);
  if(stat.isDirectory()){
    fs.mkdirSync(to,{recursive:true});
    for(const name of fs.readdirSync(from))copyEntry(path.join(from,name),path.join(to,name));
  }else{
    fs.mkdirSync(path.dirname(to),{recursive:true});
    fs.copyFileSync(from,to);
  }
}

if(mode==="nested"){
  // Framework/public assets remain at client root; page/RSC output is nested by basePath.
  for(const name of fs.readdirSync(source)){
    if(name===basePath)continue;
    copyEntry(path.join(source,name),path.join(destination,name));
  }
  for(const name of fs.readdirSync(path.join(source,basePath))){
    copyEntry(path.join(source,basePath,name),path.join(destination,name));
  }
}else if(mode==="flat-base"){
  // Some Vinext versions emit /basePath as basePath.html when trailingSlash is
  // not applied to the prerender output. Convert the project route to Pages root.
  for(const name of fs.readdirSync(source)){
    if(name===`${basePath}.html`||name===`${basePath}.txt`)continue;
    copyEntry(path.join(source,name),path.join(destination,name));
  }
  copyEntry(flatBaseHtml,path.join(destination,"index.html"));
  const rsc=path.join(source,`${basePath}.txt`);
  if(fs.existsSync(rsc))copyEntry(rsc,path.join(destination,"index.txt"));
}else{
  // Already rooted. Copy exactly as emitted.
  for(const name of fs.readdirSync(source)){
    copyEntry(path.join(source,name),path.join(destination,name));
  }
}

fs.writeFileSync(path.join(destination,".nojekyll"),"");
if(!fs.existsSync(path.join(destination,"index.html")))throw new Error("Staged Pages artifact has no index.html.");
if(fs.existsSync(path.join(destination,basePath,"index.html")))throw new Error("Staged artifact still contains a duplicated base-path route.");

console.log(JSON.stringify({
  result:"PASS",
  source:"dist/client",
  sourceLayout:mode,
  basePath:`/${basePath}`,
  artifact:"dist/pages-artifact",
  entries:fs.readdirSync(destination).sort(),
}));
