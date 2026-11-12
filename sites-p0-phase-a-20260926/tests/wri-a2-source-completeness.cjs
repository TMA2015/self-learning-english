'use strict';
/** Owner post-release QA: Mia's words are SPOKEN in LIS-A2-07; do not invent a letter
 * or leak an audio transcript while fixing absent source access in WRI-A2-07. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const seed=JSON.parse(read('content/curriculum-1.25.0-candidate.json'));
const lesson=id=>seed.lessons.find(l=>l.id===id);
const wri=lesson('WRI-A2-07'),rea=lesson('REA-A2-08'),lis=lesson('LIS-A2-07');
assert(wri&&rea&&lis,'Three immutable Unit10 source lessons required');
assert.equal(wri.module,'writing');
assert.equal(rea.reading_asset?.id,'TXT-REA-A2-08');
assert(rea.reading_asset.display_to_learner&&rea.reading_asset.body.includes('Repair Café'));
assert.equal(lis.reading_asset?.id,rea.reading_asset.id,'Original Listening has the same written notice');
assert.equal(lis.audio_asset?.transcript_reveal,'after_submission');
assert.equal(lis.audio_asset?.requires_real_playback,true);
assert(/reply.+Mia|Mia.+reply/i.test(wri.title+' '+wri.activities[0].prompt));
assert(!wri.reading_asset&&!wri.audio_asset,
 'Fix must not add scored-source copies to the versioned WRI package');
const guide=read('app/a2-writing-source-guide.tsx');
const player=read('app/foundation.tsx');
const css=read('app/globals.css');
assert(guide.includes('source.display_to_learner!==true'));
assert(guide.includes("result.lesson?.id!=='REA-A2-08'"));
assert(guide.includes("source?.id!=='TXT-REA-A2-08'"));
assert(guide.includes("encodeURIComponent(version)"),'Fetch the source at original attempt version');
assert(guide.includes("onOpenSource('LIS-A2-07')"));
assert(guide.includes("onOpenSource('REA-A2-08')"));
assert(guide.includes('Mia\'s request is a voice message, not a written letter.'));
assert(guide.includes('Do not guess')||guide.includes('Do not guess missing details'));
assert(!guide.includes(lis.audio_asset.source_text),
 'The protected original Mia audio transcript must not appear in rendered Writing code');
assert(!guide.includes('audio_asset.source_text')&&!guide.includes('transcript='+'),
 'Never expose the audio source text in Writing');
assert(!/localStorage|setItem\(|score\s*=|saveAttempt|submit\(|evaluateWritingProcess|Gemini API|requestWritingAI/.test(guide),
 'Source guide must remain a read-only display, not AI, data writes or scoring');
assert.equal((player.match(/<A2WritingSourceGuide/g)||[]).length,2,
 'Source guide must appear in BOTH WRI lesson notes and actual Writing attempt');
assert(player.includes("lesson.id==='WRI-A2-07'"));
assert(player.includes('onOpenSource={id=>void open(id)}'),
 'Reuse canonical guarded player opening (which saves active Writing draft)');
assert(player.includes("if(attempt?.status==='started')")&&player.includes('await saveDraft()'),
 'Preserve original draft before source navigation');
assert(player.includes("Play the full audio for this attempt before submitting."),
 'Preserve Listening full-playback scoring gate');
assert(css.includes('.a2-writing-sources'), 'Provide mobile-friendly source display');
console.log(JSON.stringify({result:'PASS',gate:'WRI-A2-07-CANONICAL-SOURCES',
 canonicalReader:'REA-A2-08',miaSpokenSource:'LIS-A2-07',
 transcriptBeforeListening:false,lessonMutation:false,scoreWrites:0,productionWrites:0}));
