#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dir = path.join(root, '.github', 'workflows');
const entries = fs.existsSync(dir)
  ? fs.readdirSync(dir).filter(x => /\.ya?ml$/i.test(x)).sort()
  : [];
const approved = new Map([
  ['english-manual-release-qa.yml', 'workflow_dispatch'],
  ['english-pr-qa.yml', 'pull_request'],
]);
const violations = [];
if (entries.length !== approved.size || entries.some(file => !approved.has(file))) {
  violations.push('Only these workflows are approved: ' + [...approved.keys()].join(', '));
}

function triggers(src, file) {
  const lines = src.split(/\r?\n/).map(line => line.replace(/\s+#.*$/, ''));
  const start = lines.findIndex(line => /^on\s*:/.test(line));
  if (start < 0) { violations.push(file + ': missing explicit on:'); return []; }
  const inline = lines[start].replace(/^on\s*:\s*/, '').trim();
  if (inline) {
    if (/^[a-z_]+$/.test(inline)) return [inline];
    if (/^\[.+\]$/.test(inline)) return inline.slice(1, -1).split(',').map(x => x.trim());
    violations.push(file + ': invalid inline on:'); return [];
  }
  const found = [];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() && !/^\s/.test(line)) break;
    const m = /^  ([\w-]+)\s*:/.exec(line);
    if (m) found.push(m[1]);
  }
  return found;
}

for (const file of entries) {
  const src = fs.readFileSync(path.join(dir, file), 'utf8');
  const actual = triggers(src, file);
  const expected = approved.get(file);
  if (!expected || actual.length !== 1 || actual[0] !== expected) {
    violations.push(file + ': expected only ' + (expected || 'an approved trigger') + ', found ' + JSON.stringify(actual));
  }
  if (file === 'english-pr-qa.yml') {
    if (!/^\s{4}branches:\s*\[main\]/m.test(src)) violations.push(file + ': PR must target main only');
    if (!/^\s{2}contents:\s*read\s*$/m.test(src)) violations.push(file + ': read-only contents permission required');
    if (/\bsecrets\s*\.|action-hosting-deploy|firebaseServiceAccount|\bchannelId\s*:\s*live\b|\bfirebase\s+deploy\b/i.test(src)) {
      violations.push(file + ': PR QA may not reference secrets or deploy Firebase');
    }
    if (!/cancel-in-progress:\s*true/.test(src)) violations.push(file + ': superseded PR runs must be cancelled');
  }
}
if (violations.length) {
  console.error('CI_POLICY_FAIL\n' + violations.map(x => '- ' + x).join('\n'));
  process.exit(1);
}
console.log('CI_POLICY_PASS: manual release + PR-only QA, no automatic deploy or secret access');
