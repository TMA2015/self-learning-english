'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const home=fs.readFileSync(path.join(root,'app/home-client.tsx'),'utf8');
const ui=fs.readFileSync(path.join(root,'app/local-profile-switcher.tsx'),'utf8');
const services=fs.readFileSync(path.join(root,'infrastructure/browser/client-services.ts'),'utf8');
const profiles=fs.readFileSync(path.join(root,'infrastructure/browser/local-profiles.ts'),'utf8');
const css=fs.readFileSync(path.join(root,'app/globals.css'),'utf8');

assert(!home.includes('local-profile-switcher'),'profile UI must stay unmounted until executable isolation QA passes');
assert(ui.includes('data-profile-ui="p0-hidden-until-qa"'));
assert(ui.includes('Each learner keeps separate progress on this device. Cloud sync is not enabled yet.'));
assert(ui.includes('loadLocalLearnerProfiles'));
assert(ui.includes('selectLocalLearnerProfile'));
assert(ui.includes('createLocalLearnerProfile'));
assert(ui.includes('renameLocalLearnerProfile'));

assert(services.includes('browserLearningEnabled()'));
assert(services.includes("throw new Error('Local learner profiles are unavailable in account runtime.')"));
assert(services.includes('loadLocalLearnerProfiles'));
assert(services.includes('createLocalLearnerProfile'));
assert(services.includes('selectLocalLearnerProfile'));
assert(services.includes('renameLocalLearnerProfile'));

assert(profiles.includes("preferredName:'Learner 1'"));
assert(profiles.includes("ownerId:LOCAL_OWNER_ID,learnerId:selectedLocalProfile(storage).id"));
assert(css.includes('P0 local learner profile switcher — prepared but not mounted until isolation QA passes.'));

console.log(JSON.stringify({
  result:'PASS',
  profileUiPrepared:true,
  profileUiMounted:false,
  localOnlyLabel:true,
  accountRuntimeGuard:true,
  createSelectRenamePrepared:true
}));
