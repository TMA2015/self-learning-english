import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const artifact=path.join(root,"dist","pages-artifact");
if(!fs.existsSync(artifact))throw new Error("Pages artifact is missing.");

function walk(dir){
  return fs.readdirSync(dir,{withFileTypes:true})
    .flatMap(entry=>{
      const full=path.join(dir,entry.name);
      return entry.isDirectory()?walk(full):[full];
    })
    .sort();
}
const files=walk(artifact).filter(file=>path.basename(file)!=="artifact-manifest.json");
const rows=files.map(file=>{
  const bytes=fs.readFileSync(file);
  return {
    path:path.relative(artifact,file).replaceAll(path.sep,"/"),
    bytes:bytes.length,
    sha256:crypto.createHash("sha256").update(bytes).digest("hex"),
  };
});
const canonical=JSON.stringify(rows);
const manifest={
  format:"g-learning.static-artifact-manifest",
  schemaVersion:1,
  product:"Self-Learning English",
  curriculum:"1.11.0",
  basePath:process.env.NEXT_PUBLIC_BASE_PATH??"",
  files:rows.length,
  bytes:rows.reduce((sum,row)=>sum+row.bytes,0),
  treeSha256:crypto.createHash("sha256").update(canonical).digest("hex"),
  entries:rows,
};
fs.writeFileSync(path.join(artifact,"artifact-manifest.json"),JSON.stringify(manifest,null,2)+"\n");
console.log(JSON.stringify({
  result:"PASS",
  files:manifest.files,
  bytes:manifest.bytes,
  treeSha256:manifest.treeSha256,
  manifest:"dist/pages-artifact/artifact-manifest.json"
}));
