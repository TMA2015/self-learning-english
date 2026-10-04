import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const source=path.join(root,"dist","client");
const destination=path.join(root,"dist","pages-artifact");
const basePath=(process.env.NEXT_PUBLIC_BASE_PATH??"").replace(/^\/+|\/+$/g,"");
if(!basePath)throw new Error("NEXT_PUBLIC_BASE_PATH is required for project-site staging.");
if(!fs.existsSync(source))throw new Error("Static client output is missing: dist/client");

const routeRoot=path.join(source,basePath);
if(!fs.existsSync(path.join(routeRoot,"index.html"))){
  throw new Error(`Expected base-path page missing: dist/client/${basePath}/index.html`);
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

// Vinext places framework/public assets at dist/client root, while prerendered
// HTML/RSC output is nested under basePath. GitHub Pages project sites already
// mount the uploaded artifact at /<repo>/, so upload one flattened artifact:
// root assets first, then overlay the contents of the base-path route directory.
for(const name of fs.readdirSync(source)){
  if(name===basePath)continue;
  copyEntry(path.join(source,name),path.join(destination,name));
}
for(const name of fs.readdirSync(routeRoot)){
  copyEntry(path.join(routeRoot,name),path.join(destination,name));
}

fs.writeFileSync(path.join(destination,".nojekyll"),"");
if(!fs.existsSync(path.join(destination,"index.html")))throw new Error("Staged Pages artifact has no index.html.");
if(fs.existsSync(path.join(destination,basePath,"index.html")))throw new Error("Staged artifact still contains a duplicated base-path route.");

console.log(JSON.stringify({
  result:"PASS",
  source:"dist/client",
  basePath:`/${basePath}`,
  artifact:"dist/pages-artifact",
  entries:fs.readdirSync(destination).sort(),
}));
