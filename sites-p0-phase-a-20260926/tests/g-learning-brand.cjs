"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");const read=p=>fs.readFileSync(path.join(root,p),"utf8");
for(const file of ["public/branding/g-learning-mark.svg","public/branding/g-learning-lockup.svg","public/branding/english-app-icon.svg","public/favicon.svg"]){
 const v=read(file);assert.match(v,/<svg[\s>]/);assert.match(v,/<path\s/);assert.ok(!/<script\b|<image\b|https?:\/\//i.test(v.replace(/xmlns="http:\/\/www.w3.org\/2000\/svg"/,"")),file+" unsafe SVG");
}
assert.equal(read("public/branding/english-app-icon.svg"),read("public/favicon.svg"),"favicon out of sync");
const app=read("app/page.tsx")+read("app/home-client.tsx");assert.ok(app.includes('Self-Learning English'));assert.ok(app.includes('/branding/english-app-icon.svg'));assert.ok(app.includes('g-learning-credit'));assert.ok(app.includes('Learn · Grow · Go'));
assert.ok(read("app/globals.css").includes(".g-learning-credit"));
console.log("PASS G Learning English branding assets and presentation-only wiring.");
