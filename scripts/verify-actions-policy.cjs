#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const workflows = path.join(root, '.github', 'workflows');
const entries = fs.existsSync(workflows)
  ? fs.readdirSync(workflows).filter(x => /\.ya?ml$/i.test(x)).sort()
  : [];

const violations = [];
if (entries.length !== 1 || entries[0] !== 'english-manual-release-qa.yml') {
  violations.push('Exactly one approved workflow is allowed: english-manual-release-qa.yml');
}
for (const file of entries) {
  const src = fs.readFileSync(path.join(workflows, file), 'utf8');
  const lines = src.split(/\r?\n/).map(line => line.replace(/\s+#.*$/, ''));
  const at = lines.findIndex(line => /^on\s*:/.test(line));
  if (at < 0) {
    violations.push(file + ': missing explicit on: trigger');
    continue;
  }
  const inline = lines[at].replace(/^on\s*:\s*/, '').trim();
  if (inline && inline !== 'workflow_dispatch' && inline !== '[workflow_dispatch]') {
    violations.push(file + ': unexpected inline trigger ' + inline);
  }
  const block = [];
  for (let i = at + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line && !/^\s/.test(line) && !/^\s*#/.test(line)) break;
    block.push(line);
  }
  for (const line of block) {
    if (/^\s{2}([\w-]+)\s*:/.test(line)) {
      const trigger = line.match(/^\s{2}([\w-]+)\s*:/)[1];
      if (trigger !== 'workflow_dispatch') {
        violations.push(file + ': forbidden automatic trigger ' + trigger);
      }
    }
  }
  if (!inline && !block.some(line => /^\s{2}workflow_dispatch\s*:/.test(line))) {
    violations.push(file + ': workflow_dispatch must be present');
  }
}
if (violations.length) {
  console.error('CI_POLICY_FAIL\n' + violations.map(x => '- ' + x).join('\n'));
  process.exit(1);
}
console.log('CI_POLICY_PASS: ' + entries.length + ' manual-only workflow(s), no push/PR/schedule triggers');
