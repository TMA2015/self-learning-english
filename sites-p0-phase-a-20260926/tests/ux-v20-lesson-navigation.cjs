'use strict';
// Source-level non-destructive UX regression gate; integration/browser QA remains separate.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'app/foundation.tsx'),'utf8');
const css=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');
const page=fs.readFileSync(path.join(root,'app/page.tsx'),'utf8')+fs.readFileSync(path.join(root,'app/home-client.tsx'),'utf8');
assert.equal((source.match(/className="foundation-lesson-id"/g)||[]).length,4,'IDs must appear in Recent Work, both Catalog layouts and lesson overview/practice');
assert.ok(source.includes('<span className="foundation-lesson-id">{l.id}</span><LessonProgressMark {...lessonProgressForLesson(catalog.attempts,l.id)}/></span><strong>{l.title}</strong>'),'Recent Work preserves ID/title and now shows the same history-derived tick as the submitted catalog');
assert.ok(source.includes('<span className="foundation-lesson-id">{lesson.id}</span> · {lesson.module}'),'focused player displays source ID');
assert.ok(css.includes('.foundation-lesson-id{')&&css.includes('overflow-wrap:anywhere'),'readable IDs must fit mobile cards');
// Preserve all three original prefetch sites (Recent Work plus both Catalog layouts).
assert.equal((source.match(/onPointerEnter=\{\(\)=>prefetchLesson\(l\.id/g)||[]).length,3,'original three Catalog/recent prefetch surfaces remain');
assert.equal((source.match(/onFocus=\{\(\)=>prefetchLesson\(l\.id/g)||[]).length,3,'original keyboard-focus prefetch surfaces remain');
// The new Today panel adds exactly three corresponding pointer and keyboard sites.
for(const kind of ['resume','review','learn']){
 assert.ok(source.includes('onPointerEnter={()=>prefetchLesson(todayPlan.'+kind+'!.lesson.id'),
  'Today '+kind+' must prefetch on pointer hover');
 assert.ok(source.includes('onFocus={()=>prefetchLesson(todayPlan.'+kind+'!.lesson.id'),
  'Today '+kind+' must prefetch on keyboard focus');
}
assert.equal((source.match(/onPointerEnter=\{\(\)=>prefetchLesson\(/g)||[]).length,6,'only three new Today surfaces plus three existing catalog surfaces');
assert.equal((source.match(/onFocus=\{\(\)=>prefetchLesson\(/g)||[]).length,6,'all six hover surfaces must also support keyboard focus');
assert.ok(source.includes("lessonCache=useRef(new Map<string,Promise<LessonView>>())"),'bounded session-only immutable lesson cache');
assert.ok(source.includes("lessonCache.current.size>12"),'prevent unbounded in-memory lesson prefetch');
assert.ok(source.includes("if(lessonCache.current.get(key)===task)lessonCache.current.delete(key)"),'failed prefetch must allow retry');
assert.ok(source.includes("existing?.version??catalog?.version"),'historical attempts must request their own frozen content version');
assert.ok(source.includes("if(request!==openingRequest.current)return"),'a stale lesson response must not override newer navigation');
assert.ok(source.includes("loadedLessonVersion.current!==a.version"),'starting same-version practice must reuse loaded lesson');
assert.equal((source.match(/call\(url\)/g)||[]).length,1,'lesson requests are centralized in the cache');
assert.ok(source.includes("role=\"status\">Opening {openingId}"),'show immediate accessible feedback while opening a lesson');
for(const marker of ['async function open(','async function backToCatalog()','async function chooseSkill(','useEffect(()=>{if(previousSkill.current===routeScope)']){
 const start=source.indexOf(marker),end=source.indexOf('\n ',start+marker.length);
 assert.ok(start>=0,'missing safe navigation path '+marker);
}
const open=source.split('async function open(')[1].split('async function newAttempt(')[0];
assert.ok(open.indexOf('await saveDraft()')<open.indexOf('await loadLesson('),'draft save must finish before opening another lesson');
const skill=source.split('useEffect(()=>{if(previousSkill.current===routeScope)')[1].split('},[routeScope]);')[0];
assert.ok(skill.indexOf('await saveDraft()')<skill.indexOf('void refresh().catch('),'draft persistence must precede background refresh');
assert.ok(skill.includes("const needsSave=attempt?.status==='started'&&!prepared"),'sidebar navigation continues to guard draft state');
assert.ok(skill.includes('setBusy(!!needsSave)'),'draft save must keep player controls disabled during sidebar transition');
assert.ok(source.includes("const task=draftSaveQueue.current.catch(()=>{}).then("),'sequential server draft persistence retained');
assert.ok(source.includes("if(revision===draftRevision.current)setDraftFeedback({kind:'saved',at:Date.now()})"),'only server-confirmed latest draft can show saved');
assert.ok(page.includes('onSelectSkill={next=>navigate(next as View)}'),'existing Site skill routing retained');
assert.ok(page.includes('onNavigationGuard={registerFoundationNavigationGuard}'),'sidebar routes consult the mounted player before unmount');
assert.ok(page.includes('disabled={navigating} onClick={()=>void navigate(n.key)}'),'every sidebar destination uses the serialized route gate');
assert.ok(source.includes("await confirmLatestDraft(()=>draftRevision.current,()=>saveDraftRef.current())"),'route save confirms the latest edit before leaving');
console.log('PASS: v20 IDs visible, bounded versioned lesson prefetch/reuse, nonblocking catalog refresh, safe draft gates.');
