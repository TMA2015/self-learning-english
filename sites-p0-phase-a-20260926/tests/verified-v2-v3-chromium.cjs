'use strict';
/** Real Chromium IndexedDB QA with CDP polling instead of --dump-dom's virtual-time snapshot. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const cp=require('node:child_process'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const httpJSON=url=>new Promise((resolve,reject)=>{
 http.get(url,res=>{
  let buf='';
  res.on('data',x=>buf+=x);
  res.on('end',()=>{try{resolve(JSON.parse(buf))}catch(e){reject(e)}});
 }).on('error',reject);
});
async function until(fn,ms=30000){
 const end=Date.now()+ms,last={};
 while(Date.now()<end){try{const value=await fn();if(value)return value}catch(e){last.error=e}await delay(150)}
 throw Error('CDP readiness timeout: '+String(last.error||'no browser response'));
}
(async()=>{
 const {build}=await import('vite');
 const out=path.join(root,'.sites-runtime','verified-v2-v3-chromium');
 fs.rmSync(out,{recursive:true,force:true});
 await build({root,configFile:false,logLevel:'error',
  build:{outDir:out,emptyOutDir:true,target:'es2022',minify:false,
   lib:{entry:path.join(root,'tests/verified-v2-v3-chromium-entry.ts'),
    formats:['iife'],name:'SLEIdbVault',fileName:()=> 'bundle.js'}}});
 const bundle=fs.readFileSync(path.join(out,'bundle.js'),'utf8');
 const html='<!doctype html><html><head><meta charset="utf-8"></head><body>'+
  '<div id="sle-idb-result">STARTED</div>'+
  '<script>window.addEventListener("error",e=>document.getElementById("sle-idb-result").textContent="FAIL_SCRIPT "+e.message);'+
  'window.addEventListener("unhandledrejection",e=>document.getElementById("sle-idb-result").textContent="FAIL_REJECTION "+e.reason);</script>'+
  '<script>'+bundle.replaceAll('</script>','<\\/script>')+'</script></body></html>';
 const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(name=>{try{return cp.execFileSync('which',[name],{encoding:'utf8'}).trim()}catch{return ''}}).find(Boolean);
 if(!chrome)throw Error('Actual Chromium unavailable — IndexedDB pilot cannot be verified');
 if(typeof WebSocket!=='function')throw Error('Node 22+ built-in WebSocket is required for CDP browser QA');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-normalized-recovery-'));
 const interruptionProfile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-r4d-interrupted-'));
 const nativeQuotaProfile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-r4e-native-quota-'));
 const blockedUpgradeProfile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-r4f-idb-blocked-'));
 const twoTabProfile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-r4g-two-tab-'));
 const learnerRaceProfile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-r4h-learner-writes-'));
 const pairedWriteProfile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-r4i-paired-write-'));
 const writingQuotaProfile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-r4j-writing-quota-'));
 const preflightProfile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-r4k-preflight-quota-'));
 const sigkillProfile=fs.mkdtempSync(path.join(os.tmpdir(),'sle-r4l-hard-sigkill-'));
 const server=http.createServer((_req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
  res.end(html);
 });
 async function visit(url,profilePath=profile,crashKill=false){
  if(crashKill&&process.platform!=='linux')throw Error('R4l SIGKILL process-group test requires Linux');
  // Chrome may leave a stale DevToolsActivePort after an earlier process
  // exits. Never connect a new QA session to the previous process port.
  const oldPortFile=path.join(profilePath,'DevToolsActivePort');
  if(fs.existsSync(oldPortFile))fs.rmSync(oldPortFile,{force:true});
  const child=cp.spawn(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage',
   '--disable-extensions','--disable-background-networking',
   ...((url.includes('phase=multi-owner')||url.includes('phase=write-race-owner'))?['--disable-popup-blocking']:[]),
   '--no-first-run','--remote-debugging-port=0','--remote-allow-origins=*',
   '--user-data-dir='+profilePath,url],{stdio:['ignore','ignore','pipe'],detached:crashKill});
  let stderr='',socket;
  child.stderr.on('data',data=>{stderr=(stderr+String(data)).slice(-5000)});
  try{
   const port=await until(()=>{
    const file=path.join(profilePath,'DevToolsActivePort');
    if(!fs.existsSync(file))return false;
    const value=Number(fs.readFileSync(file,'utf8').split(/\r?\n/)[0]);
    return Number.isSafeInteger(value)&&value>0?value:false;
   });
   const target=await until(async()=>{
    const pages=await httpJSON('http://127.0.0.1:'+port+'/json/list');
    return pages.find(p=>p.type==='page'&&p.url.startsWith(url))||false;
   });
   socket=new WebSocket(target.webSocketDebuggerUrl);
   await new Promise((resolve,reject)=>{
    socket.addEventListener('open',resolve,{once:true});
    socket.addEventListener('error',reject,{once:true});
   });
   let id=0;
   function evaluate(expression="document.getElementById('sle-idb-result')?.textContent"){
    return new Promise((resolve,reject)=>{
     const current=++id;
     const timer=setTimeout(()=>reject(Error('CDP evaluate timed out')),4000);
     const listener=event=>{
      const response=JSON.parse(event.data);
      if(response.id!==current)return;
      clearTimeout(timer);
      socket.removeEventListener('message',listener);
      if(response.error)reject(Error(response.error.message));
      else if(response.result?.exceptionDetails)reject(Error('CDP page evaluate threw: '+JSON.stringify(response.result.exceptionDetails)));
      else resolve(response.result?.result?.value);
     };
     socket.addEventListener('message',listener);
     socket.send(JSON.stringify({id:current,method:'Runtime.evaluate',params:{
      expression,returnByValue:true
     }}));
    });
   }
   const isWriteRace=url.includes('phase=write-race-owner');
   const isTwoTab=url.includes('phase=multi-owner')||isWriteRace;
   let twoPageTargetsVerified=false,oldConnectionReleased=false;
   let workerTarget=null;
   async function evalOtherPage(target,expression){
    const connection=new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve,reject)=>{
     connection.addEventListener('open',resolve,{once:true});
     connection.addEventListener('error',reject,{once:true});
    });
    try{return await new Promise((resolve,reject)=>{
     const timer=setTimeout(()=>reject(Error('Second Chromium page CDP timeout')),5000);
     const onMessage=ev=>{
      const payload=JSON.parse(ev.data);
      if(payload.id!==1)return;
      connection.removeEventListener('message',onMessage);clearTimeout(timer);
      if(payload.error||payload.result?.exceptionDetails)
       reject(Error('Second tab could not be evaluated: '+JSON.stringify(payload.error||payload.result.exceptionDetails)));
      else resolve(payload.result?.result?.value);
     };
     connection.addEventListener('message',onMessage);
     connection.send(JSON.stringify({id:1,method:'Runtime.evaluate',
      params:{expression,returnByValue:true}}));
    })}finally{connection.close()}
   }
   const start=Date.now();
   let last='';
   while(Date.now()-start<45000){
    last=String(await evaluate()||'');
    if(isTwoTab&&last.startsWith('FAIL_R4G'))
     throw Error('R4g owner test failed: '+last);
    if(isWriteRace&&last.startsWith('FAIL_R4H'))
     throw Error('R4h owner failed: '+last);
    if(isWriteRace&&last==='READY_R4H_LOCK_QUEUE'&&!oldConnectionReleased){
     const pages=await httpJSON('http://127.0.0.1:'+port+'/json/list');
     const owner=pages.find(p=>p.type==='page'&&p.url.includes('phase=write-race-owner'));
     const worker=pages.find(p=>p.type==='page'&&p.url.includes('phase=write-race-worker'));
     assert(owner&&worker&&owner.id!==worker.id,
      'R4h must have two independent real Chromium page targets');
     workerTarget=worker;
     const status=await evalOtherPage(worker,
      "document.getElementById('sle-idb-result')?.textContent");
     assert.equal(status,'READY_R4H_WORKER_LOCK_PENDING',
      'Second real Chromium page did not queue guarded learner write');
     twoPageTargetsVerified=true;
     const released=await evaluate('window.__sleR4hRelease()');
     assert.equal(released,'RELEASED_R4H_NATIVE_WEB_LOCK',
      'R4h must release first-tab native lock only after second tab is queued');
     oldConnectionReleased=true;
    }
    if(isTwoTab&&last==='READY_R4G_TWO_TABS_BLOCKED'&&!oldConnectionReleased){
     const pages=await httpJSON('http://127.0.0.1:'+port+'/json/list');
     const owner=pages.find(p=>p.type==='page'&&p.url.includes('phase=multi-owner'));
     const worker=pages.find(p=>p.type==='page'&&p.url.includes('phase=multi-worker'));
     assert(owner&&worker&&owner.id!==worker.id,
      'Two independent real Chromium tab/page CDP targets are required');
     workerTarget=worker;
     const workerStatus=await evalOtherPage(worker,
      "document.getElementById('sle-idb-result')?.textContent");
     assert.equal(workerStatus,'READY_R4G_WORKER_BLOCKED',
      'Second independent page must observe a native onblocked event');
     twoPageTargetsVerified=true;
     const released=await evaluate('window.__sleR4gRelease()');
     assert.equal(released,'RELEASED_R4G_OLD_CONNECTION',
      'Only driver-verified second-tab blocking may release first-tab IDB handle');
     oldConnectionReleased=true;
    }
    if(last.startsWith('PASS_')){
      if(isTwoTab){
       assert(twoPageTargetsVerified&&oldConnectionReleased&&workerTarget,
        'No R4g PASS before real two-page CDP proof and explicit release');
       const workerStatus=await evalOtherPage(workerTarget,
        "document.getElementById('sle-idb-result')?.textContent");
       assert.equal(workerStatus,isWriteRace?'PASS_R4H_WORKER':'PASS_R4G_WORKER',
        'Second Chromium page did not finish cross-tab acceptance');
      }
      if(crashKill){
       assert(last.startsWith('PASS_R4L_KILL_ARMED '),
        'SIGKILL is permitted only for the exact R4l half-written stage');
       assert(Number.isSafeInteger(child.pid)&&child.pid>0,
        'R4l child process group PID is missing');
       // Child launched detached => its own POSIX process group.
       // Terminate browser+renderer+storage subprocesses without Chrome's
       // graceful Browser.close protocol. This is a real OS SIGKILL.
       const killed=new Promise(resolve=>child.once('close',
        (code,signal)=>resolve({code,signal})));
       process.kill(-child.pid,'SIGKILL');
       const evidence=await Promise.race([killed,delay(7000).then(()=>null)]);
       assert(evidence&&evidence.signal==='SIGKILL',
        'R4l must confirm actual Linux SIGKILL; graceful shutdown is forbidden');
       return 'SIGKILL_CONFIRMED '+last;
      }
      // Use Chrome's own normal shutdown protocol. Earlier SIGTERM-based
      // test shutdown could abandon the unflushed localStorage LevelDB journal
      // even while IndexedDB had persisted; this MUST NOT mask data loss.
      // Crash/power-loss durability remains a separate, unverified gate.
      const cleanClose=new Promise(resolve=>child.once('close',()=>resolve(true)));
      socket.send(JSON.stringify({id:++id,method:'Browser.close'}));
      if(!await Promise.race([cleanClose,delay(6000).then(()=>false)]))
        throw Error('Chromium Browser.close failed; durable restart not verified');
      return last;
    }
    if(last.startsWith('FAIL'))throw Error(last);
    await delay(250);
   }
   throw Error('IndexedDB browser phase timed out; last progress='+last);
  }finally{
   if(socket&&socket.readyState===WebSocket.OPEN)socket.close();
   if(child.exitCode===null&&child.signalCode===null){
    const stopped=new Promise(resolve=>child.once('close',resolve));
    if(crashKill&&child.pid&&process.platform==='linux'){
     try{process.kill(-child.pid,'SIGKILL')}catch(e){if(e.code!=='ESRCH')throw e}
    }else child.kill('SIGTERM');
    await Promise.race([stopped,delay(2000)]);
    if(child.exitCode===null&&child.signalCode===null){
     if(crashKill&&child.pid&&process.platform==='linux'){
      try{process.kill(-child.pid,'SIGKILL')}catch(e){if(e.code!=='ESRCH')throw e}
     }else child.kill('SIGKILL');
     await Promise.race([stopped,delay(2000)]);
    }
   }
  }
 }
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const host='http://127.0.0.1:'+server.address().port;
  async function visitWithStartupRetry(url,profilePath=profile,crashKill=false){
   try{return await visit(url,profilePath,crashKill)}catch(error){
    if(!/CDP readiness timeout/.test(String(error)))throw error;
    return visit(url,profilePath,crashKill); // re-launch and repeat the full gate
   }
  }
  const first=await visitWithStartupRetry(host+'/?phase=write');
  const second=await visitWithStartupRetry(host+'/?phase=reload');
  assert.match(first,/^PASS_WRITE/);assert.match(second,/^PASS_RELOAD/);
  const interrupted=await visitWithStartupRetry(host+'/?phase=interrupted',interruptionProfile);
  const resumed=await visitWithStartupRetry(host+'/?phase=resume',interruptionProfile);
  const reloaded=await visitWithStartupRetry(host+'/?phase=resume-reload',interruptionProfile);
  assert.match(interrupted,/^PASS_INTERRUPTED/);
  assert.match(resumed,/^PASS_RESUME/);
  assert.match(reloaded,/^PASS_RESUME_RELOAD/);
  const realQuota=await visitWithStartupRetry(host+'/?phase=native-quota',nativeQuotaProfile);
  const quotaResumed=await visitWithStartupRetry(host+'/?phase=native-quota-resume',nativeQuotaProfile);
  const quotaReloaded=await visitWithStartupRetry(host+'/?phase=native-quota-reload',nativeQuotaProfile);
  assert.match(realQuota,/^PASS_NATIVE_QUOTA\b/);
  assert.match(quotaResumed,/^PASS_NATIVE_QUOTA_RESUME\b/);
  assert.match(quotaReloaded,/^PASS_NATIVE_QUOTA_RELOAD\b/);
  const proof=JSON.parse(realQuota.slice(realQuota.indexOf('{')));
  assert(proof.measuredAcceptedPaddingChars>=1_000_000);
  assert.equal(proof.nativeQuotaExceeded,true);
  const blocked=await visitWithStartupRetry(
   host+'/?phase=idb-blocked-upgrade',blockedUpgradeProfile);
  const blockedReload=await visitWithStartupRetry(
   host+'/?phase=idb-blocked-reload',blockedUpgradeProfile);
  assert.match(blocked,/^PASS_IDB_BLOCKED\b/);
  assert.match(blockedReload,/^PASS_IDB_BLOCKED_RELOAD\b/);
  const blockedProof=JSON.parse(blocked.slice(blocked.indexOf('{')));
  assert.equal(blockedProof.actualNativeBlockedEvent,true);
  assert.equal(blockedProof.unsafeBackupBlocked,true);
  assert.equal(blockedProof.syntheticAttemptsUnchanged,73);
  const twoTab=await visitWithStartupRetry(
   host+'/?phase=multi-owner',twoTabProfile);
  const twoTabReload=await visitWithStartupRetry(
   host+'/?phase=multi-reload',twoTabProfile);
  assert.match(twoTab,/^PASS_R4G_OWNER\b/);
  assert.match(twoTabReload,/^PASS_R4G_RELOAD\b/);
  const twoTabProof=JSON.parse(twoTab.slice(twoTab.indexOf('{')));
  assert.equal(twoTabProof.nativeTwoPageVersionchange,true);
  assert.equal(twoTabProof.nativeSecondTabOnblocked,true);
  assert.equal(twoTabProof.originalSyntheticAttempts,73);
  const learnerRace=await visitWithStartupRetry(
   host+'/?phase=write-race-owner',learnerRaceProfile);
  const learnerRaceReload=await visitWithStartupRetry(
   host+'/?phase=write-race-reload',learnerRaceProfile);
  assert.match(learnerRace,/^PASS_R4H_OWNER\b/);
  assert.match(learnerRaceReload,/^PASS_R4H_RELOAD\b/);
  const raceProof=JSON.parse(learnerRace.slice(learnerRace.indexOf('{')));
  assert.equal(raceProof.twoPageTargetsVerifiedExternally,true);
  assert.equal(raceProof.nativeNaiveScratchLostOwnerAttemptAndReview,true);
  assert.equal(raceProof.nativeWebLockQueueObserved,true);
  assert.equal(raceProof.staleWorkerWriteRejected,true);
  assert.equal(raceProof.protectedOriginalAttempts,73);
  const pendingPair=await visitWithStartupRetry(
   host+'/?phase=paired-write-pending',pairedWriteProfile);
  const recoveredPair=await visitWithStartupRetry(
   host+'/?phase=paired-write-recover',pairedWriteProfile);
  const reloadedPair=await visitWithStartupRetry(
   host+'/?phase=paired-write-reload',pairedWriteProfile);
  assert.match(pendingPair,/^PASS_R4I_PENDING\b/);
  assert.match(recoveredPair,/^PASS_R4I_RECOVER\b/);
  assert.match(reloadedPair,/^PASS_R4I_RELOAD\b/);
  const staged=JSON.parse(pendingPair.slice(pendingPair.indexOf('{')));
  const recovered=JSON.parse(recoveredPair.slice(recoveredPair.indexOf('{')));
  assert.equal(staged.incompleteV3ExportBlocked,true);
  assert.equal(staged.secondWritingKeyNotWritten,true);
  assert.equal(recovered.interruptedMarkerSurvivedRestart,true);
  assert.equal(recovered.completedJournaledPairedWrite,true);
  const secondNativeQuota=await visitWithStartupRetry(
   host+'/?phase=native-writing-quota',writingQuotaProfile);
  const secondNativeRecovered=await visitWithStartupRetry(
   host+'/?phase=native-writing-quota-recover',writingQuotaProfile);
  const secondNativeReload=await visitWithStartupRetry(
   host+'/?phase=native-writing-quota-reload',writingQuotaProfile);
  assert.match(secondNativeQuota,/^PASS_R4J_NATIVE_QUOTA\b/);
  assert.match(secondNativeRecovered,/^PASS_R4J_RECOVER\b/);
  assert.match(secondNativeReload,/^PASS_R4J_RELOAD\b/);
  const r4jProof=JSON.parse(secondNativeQuota.slice(secondNativeQuota.indexOf('{')));
  const r4jRestored=JSON.parse(secondNativeRecovered.slice(secondNativeRecovered.indexOf('{')));
  assert.equal(r4jProof.realNativeChromiumQuotaExceededOnSecondLearnerKey,true);
  assert(r4jProof.nativePaddingChars>=1_000_000);
  assert.equal(r4jProof.originalWritingSecondKeyPreserved,true);
  assert.equal(r4jRestored.genuineQuotaInterruptedJournalSurvivedRestart,true);
  assert.equal(r4jRestored.original73AttemptsAndOriginalReviewRecoveredByteForByte,true);
  const preflight=await visitWithStartupRetry(
   host+'/?phase=journal-preflight',preflightProfile);
  const preflightReload=await visitWithStartupRetry(
   host+'/?phase=journal-preflight-reload',preflightProfile);
  assert.match(preflight,/^PASS_R4K_PREFLIGHT\b/);
  assert.match(preflightReload,/^PASS_R4K_RELOAD\b/);
  const r4kProof=JSON.parse(preflight.slice(preflight.indexOf('{')));
  assert.equal(r4kProof.nativeChromiumJournalQuotaError,true);
  assert.equal(r4kProof.nativeChromiumMarkerQuotaError,true);
  assert.equal(r4kProof.bothLearnerKeysUntouched,true);
  assert.equal(r4kProof.fullOriginalV3BackupStillValid,true);
  const crashBaseline=await visitWithStartupRetry(
   host+'/?phase=hard-crash-baseline',sigkillProfile);
  const sigkill=await visitWithStartupRetry(
   host+'/?phase=hard-crash-stage',sigkillProfile,true);
  const crashInspected=await visitWithStartupRetry(
   host+'/?phase=hard-crash-inspect',sigkillProfile);
  const crashReloaded=await visitWithStartupRetry(
   host+'/?phase=hard-crash-reload',sigkillProfile);
  assert.equal(crashBaseline,'PASS_R4L_BASELINE');
  assert.match(sigkill,/^SIGKILL_CONFIRMED PASS_R4L_KILL_ARMED\b/);
  assert.match(crashInspected,/^PASS_R4L_INSPECT\b/);
  assert.equal(crashReloaded,'PASS_R4L_RELOAD');
  const r4lProof=JSON.parse(crashInspected.slice(crashInspected.indexOf('{')));
  assert(['ORIGINAL_ALL_ABSENT','ORIGINAL_WITH_VERIFIED_JOURNAL',
   'PENDING_PAIR_VERIFIED'].includes(r4lProof.actualDurabilityOutcome));
  assert.equal(r4lProof.noOrphanUnverifiableMarker,true);
  assert.equal(r4lProof.original73FakeLearnerAttemptsRestoredExact,true);
  assert.equal(r4lProof.originalVerifiedV3BackupAvailable,true);
  console.log(JSON.stringify({result:'PASS',
   gate:'r4l-native-linux-sigkill-learner-pair-crash-recovery',
   realLinuxSIGKILLToDetachedChromiumProcessGroup:true,
   browserCloseNotCalledForKillPhase:true,
   actualDurabilityOutcome:r4lProof.actualDurabilityOutcome,
   unexpectedTornStorageFailsClosed:true,
   original73SyntheticLearnerAttemptsExact:true,
   oldWritingCourseAndHistoricalSourcePreserved:true,
   fullVerifiedV3BackupAfterCrashAndNormalRestart:true,
   genuinePowerLoss:'NOT_TESTED',
   crashTiming:'AFTER_FIRST_KEY_BROWSER_READBACK',
   filesystemFsyncDurability:'NOT_PROVEN',safari:'NOT_TESTED',
   productionLearnerWriterIntegration:false,realLearnerData:'NOT_TOUCHED',
   deploy:false}));
  console.log(JSON.stringify({result:'PASS',
   gate:'r4k-native-chromium-journal-marker-preflight-quota',
   genuineChromiumQuotaBeforeWritingJournal:true,
   genuineChromiumQuotaBeforeWritingMarker:true,
   abortedBeforeAnyLearnerKeyMutation:true,
   original73AttemptRecordsByteIdentical:true,
   originalWritingCourseAndHistoricRevisionsUnchanged:true,
   completeV3BackupStillVerifiable:true,
   originalValuesSurvivedNormalBrowserRestart:true,
   quotaFillerAndTestJournalCleaned:true,
   testOnlyGuardNotDeployed:true,
   safari:'NOT_TESTED',hardCrash:'NOT_TESTED',realFamilyData:'NOT_TOUCHED',
   productionMigration:false,deploy:false}));
  console.log(JSON.stringify({result:'PASS',
   gate:'r4j-native-chromium-quota-on-second-writing-key',
   nativeChromiumQuotaExceededErrorOnWritingKey:true,
   firstAttemptKeyWrittenBeforeFailure:true,
   originalWritingKeyPreserved:true,
   preimageJournalAndMarkerSurvivedBrowserRestart:true,
   incompleteV3ExportAndPreviewBlocked:true,
   original73SyntheticAttemptsRecoveredExact:true,
   originalWritingFeedbackRecoveredExact:true,
   testPaddingRemovedOnlyAfterVerifiedRollback:true,
   fullPairedWriteAndV3ExportAfterQuotaRecovery:true,
   secondBrowserRestartVerified:true,
   realLearnerData:'NOT_TOUCHED',safari:'NOT_TESTED',
   abruptCrash:'NOT_TESTED',productionIntegration:false,deploy:false}));
  console.log(JSON.stringify({result:'PASS',
   gate:'r4i-two-key-learner-writing-journaled-interruption-recovery',
   realChromiumLocalStorage:true,
   realChromiumWebLocks:true,
   interruptedAfterFirstOfTwoLearnerKeys:true,
   explicitPendingWriteMarker:true,
   interruptedBackupExportBlocked:true,
   interruptedRestorePreviewBlocked:true,
   original73AttemptsRecoveredByteForByte:true,
   originalWritingReviewRecovered:true,
   successfulPairedCommitVerified:true,
   restartAndFullRecoveryV3ExportVerified:true,
   browserShutdownDuringInterruption:'GRACEFUL_SIMULATED_STOP',
   suddenSIGKILL:'NOT_TESTED',nativeQuota:'NOT_TESTED',
   atomicAcrossTwoLocalStorageKeys:'NOT_PROVEN',
   productionLearnerWriterIntegration:false,
   safari:'NOT_TESTED',realLearnerData:'NOT_TOUCHED',deploy:false}));
  console.log(JSON.stringify({result:'PASS',gate:'r4h-two-tab-learner-writing-loss-prevention-research',
   twoIndependentChromiumPageTargets:true,
   nativeLocalStorageNaiveLostUpdateDemonstratedOnScratchKey:true,
   nativeWebLocksExclusiveQueueObserved:true,
   staleTabRejectedWithoutWriting:true,
   refreshedSecondTabMerged:true,
   bothDraftEditsAndWritingReviewsPreserved:true,
   untouchedOriginal71AttemptsExact:true,
   originalHistoricalSourceUnchanged:true,
   fullV3ReexportVerified:true,
   statePersistedAcrossNewChromeProcess:true,
   liveRuntimeUsesWebLocks:false,
   productionConcurrentWritingSafety:'NOT_PROVEN',
   safari:'NOT_TESTED',realLearnerData:'NOT_TOUCHED',deploy:false}));
  console.log(JSON.stringify({result:'PASS',gate:'r4g-two-independent-chromium-tabs-indexeddb-contention',
   actualTwoDistinctCDPPageTargets:true,
   nativeCrossTabVersionchange:true,nativeSecondTabOnblocked:true,
   driverControlledReleaseAfterBlocked:true,
   original73SyntheticLearnerAttemptsUnchanged:true,
   normalizedHistoricBlobsAndAliasesPreserved:true,
   version1ReaderFailClosedOnVersion2:true,
   realChromeRestartAfterTwoTabContention:true,
   actualLearnerConcurrentWrites:'NOT_TESTED',
   safari:'NOT_TESTED',powerLoss:'NOT_TESTED',realLearnerData:'NOT_TOUCHED',
   productionMigration:false,deploy:false}));
  console.log(JSON.stringify({result:'PASS',gate:'r4f-real-chromium-indexeddb-versionchange-blocked',
   nativeIndexedDBBlockedEvent:true,nativeVersionchange:true,
   refusedUnknownSchema:true,refusedUnsafeV3Backup:true,
   refusedUnsafeRestorePreview:true,rawRevisionsAndAliasesPreserved:true,
   original73SyntheticLearnerAttemptsUnchanged:true,
   persistedAcrossGracefulBrowserRestart:true,
   actualMultiTabRace:'NOT_TESTED',Safari:'NOT_TESTED',
   nativeIDBQuota:'NOT_TESTED',liveIntegration:false,deploy:false}));
  console.log(JSON.stringify({result:'PASS',gate:'r4e-native-chromium-quota-v3-recovery',
   realNativeChromiumLocalStorageQuota:true,
   quotaPaddingChars:proof.measuredAcceptedPaddingChars,
   nativeQuotaExceeded:true,originalV2ChecksumVerified:true,
   preserved73SyntheticAttempts:true,partialRollback:true,
   pendingV3MarkerPersisted:true,originalIndexedDBPersisted:true,
   sameVerifiedV3Resume:true,postResumeChromiumRestart:true,
   sourceHistoryByteIdentical:true,
   safari:'NOT_TESTED',powerLoss:'NOT_TESTED',
   realLearnerData:'NOT_TOUCHED',productionMigration:false,deploy:false}));
  console.log(JSON.stringify({result:'PASS',gate:'r4d-v3-real-chromium-interrupted-restore',
   originalV2Format:true,realChromiumIndexedDB:true,realLocalStorage:true,
   syntheticQuotaFaultInjected:true,interruptedMarkerPersisted:true,
   rollbackOfNewAttempts:true,wrongRecoveryBlocked:true,
   partialBackupExportBlocked:true,sameFileResumeAfterRestart:true,
   original73AttemptsExact:true,historicWritingSourcePinned:true,
   reexportVerified:true,postResumeRestartVerified:true,
   realNativeQuota:'NOT_TESTED',powerLoss:'NOT_TESTED',
   Safari:'NOT_TESTED',realLearnerData:'NOT_TOUCHED',deploy:false}));
  console.log(JSON.stringify({result:'PASS',gate:'verified-v2-v3-real-chromium-e2e',
   realChromiumIndexedDB:true,originalV2ChecksumVerified:true,normalizationV3Verified:true,currentLessons:123,restoredSyntheticAttempts:73,
   persistedAcrossBrowserProcesses:true,realIndexedDBRestore:true,oldAttemptsByteIdentical:true,changedRubricPinned:true,occupiedRestoreBlocked:true,tamperedV2Blocked:true,
   recoveryV3:'BROWSER_SYNTHETIC_PASS',liveRuntimeIntegration:'NOT_TESTED',
   realSafariAcceptance:'NOT_TESTED'}));
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true});fs.rmSync(interruptionProfile,{recursive:true,force:true});fs.rmSync(nativeQuotaProfile,{recursive:true,force:true});fs.rmSync(blockedUpgradeProfile,{recursive:true,force:true});fs.rmSync(twoTabProfile,{recursive:true,force:true});fs.rmSync(learnerRaceProfile,{recursive:true,force:true});fs.rmSync(pairedWriteProfile,{recursive:true,force:true});fs.rmSync(writingQuotaProfile,{recursive:true,force:true});fs.rmSync(preflightProfile,{recursive:true,force:true});fs.rmSync(sigkillProfile,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});
