// Historical replay of verified #250 sources, not a public runtime pointer.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createManifest,verifyManifest,runCases} from './content-release-manifest-contract.mjs';
const evidence=JSON.parse(fs.readFileSync(new URL('./content-release-historical-authority-fixture.json',import.meta.url),'utf8'));
const manifest=JSON.parse(fs.readFileSync(new URL('./content-release-historical-manifest.json',import.meta.url),'utf8'));
assert.deepEqual(createManifest(evidence),manifest);assert.equal(verifyManifest(manifest,evidence).ok,true);
const rows=runCases(evidence);assert(rows.every(r=>r.pass));console.log(JSON.stringify({gate:'MANIFEST_PREPUBLICATION_CONTRACT',pass:rows.length,total:rows.length,authority:'HISTORICAL_FIXTURE_ONLY',runtime:'NOT_AUTHORIZED',rows}));
