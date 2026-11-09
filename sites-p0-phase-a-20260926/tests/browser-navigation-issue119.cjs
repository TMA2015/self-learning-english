'use strict';
/* Issue #119: stable URL-to-view mappings and protected navigation contracts. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.sites-runtime','browser-route-119');
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','domain/browser-route.ts',
 '--outDir',out,'--module','commonjs','--target','es2022','--skipLibCheck','--lib','es2022,dom'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}\n');
const {parseBrowserRoute,browserRouteHash,equalBrowserRoutes,APP_VIEWS}=require(path.join(out,'browser-route.js'));
for(const view of APP_VIEWS){
 const route={view};
 assert.deepEqual(parseBrowserRoute(browserRouteHash(route)),route,'Top-level deep-link failed: '+view);
}
const examples=[
 {view:'units',level:'A1'},
 {view:'units',level:'A1',unitId:'A1-U10'},
 {view:'units',level:'A1',unitId:'A1-U10',lessonId:'LIS-A1-06',screen:'practice'},
 {view:'units',level:'B1',unitId:'B1-U10',lessonId:'WRI-B1-08',screen:'overview'},
 {view:'listening',lessonId:'LIS-A2-07',screen:'practice'},
 {view:'writing',lessonId:'WRI-A1-05',screen:'overview'},
 {view:'foundation',lessonId:'GRA-A1-01',screen:'overview'},
 {view:'writing-week',writingWeek:4,writingStep:'guided'},
 {view:'writing-week',writingWeek:6,writingStep:'feedback'},
 {view:'writing-later-week',writingWeek:9,writingStep:'main'},
 {view:'writing-later-week',writingWeek:12,writingStep:'review'}
];
for(const route of examples){
 assert.deepEqual(parseBrowserRoute(browserRouteHash(route)),route);
 assert(equalBrowserRoutes(route,parseBrowserRoute(browserRouteHash(route))));
}
for(const invalid of ['#/', '#/evil', '#/units/A9', '#/units/A1/A2-U10',
 '#/units/A1/A1-U99','#/listening/lesson/../../something',
 '#/grammar/lesson/LIS-A1-06/unknown','#/writing-week/7/main',
 '#/writing-later-week/6/learn','#/writing-week/3/unknown','garbage','%ZZ']){
 const parsed=parseBrowserRoute(invalid);
 assert.equal(parsed.lessonId,undefined,'Invalid deep link loaded a lesson: '+invalid);
 assert.equal(parsed.writingWeek,undefined,'Invalid Writing deep link activated a week: '+invalid);
}
const home=fs.readFileSync(path.join(root,'app/home-client.tsx'),'utf8');
const foundation=fs.readFileSync(path.join(root,'app/foundation.tsx'),'utf8');
const gate=fs.readFileSync(path.join(root,'domain/navigation-gate.ts'),'utf8');
for(const term of ['browserRouteHash','parseBrowserRoute','history.pushState','history.replaceState',
 "addEventListener('popstate'","navigationGate.current(next.view,confirmLeave",
 'onBrowserRoute={updateFoundationRoute}',
 'navigateRoute({view:',"setBlockWeek(next.writingWeek as WritingWeek)","setLaterWeek(next.writingWeek as LaterWeek)","routeReady.current=true;applyRoute(first,'pop')"]){
 assert(home.includes(term),'Parent browser routing contract missing '+term);
}
for(const term of ['A deep link never creates a new attempt','routeGuardRef.current',
 'confirmLatestDraft','browserRoute?.lessonId', 'onBrowserRoute?.(next)',
 "if(!fromHistory)announceRoute(id", "restoreScreen==='practice'&&existing?",
 'beforeunload']){
 assert(foundation.includes(term),'Foundation draft-safe route restoration missing '+term);
}
assert(gate.includes('if(!await beforeLeave(target))return false'),'Unsafe navigation gate change');
assert(!home.includes('window.localStorage.clear()')&&!foundation.includes('window.localStorage.clear()'),'No learner storage reset permitted');
console.log(JSON.stringify({result:'PASS',gate:'BROWSER_HISTORY_ISSUE119',topLevelViews:APP_VIEWS.length,
 deepLinks:examples.length,invalidLinksRejected:true,draftGuardPreserved:true,
 staticHostingHashRouting:true,learnerDataUntouched:true}));
