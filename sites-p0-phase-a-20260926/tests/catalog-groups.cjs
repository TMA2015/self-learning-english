// Non-destructive catalog metadata guard. Run: node tests/catalog-groups.cjs
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const read = (p) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', p), 'utf8'));
const source = read('content/releases/curriculum-1.2.0-production-import.json');
const manifest = read('content/lesson-groups-v1.json');
assert.equal(source.schema_version, '1.2.0');
assert.equal(manifest.source_content_version, '1.3.0');
assert.equal(source.package_id, manifest.source_package_id);
assert.equal(manifest.purpose, 'catalog_navigation_only');
assert.equal(source.lessons.length, 29);
const ids = new Set(source.lessons.map(l => l.id));
const futureIds = new Set(['GRA-A1-07', 'GRA-A2-02', 'GRA-A2-03', 'GRA-A2-04', 'VOC-A2-02', 'REA-A1-03', 'WRI-A1-03']);
const modules = new Set(source.lessons.map(l => l.module));
assert.deepEqual(new Set(Object.keys(manifest.groups)), modules);
const seen = new Set();
let groupCount = 0;
for (const [module, groups] of Object.entries(manifest.groups)) {
  assert.ok(Array.isArray(groups) && groups.length > 0, module);
  const groupIds = new Set();
  for (const group of groups) {
    ++groupCount;
    assert.ok(typeof group.id === 'string' && group.id.startsWith(module.slice(0, 3).toUpperCase()), group.id);
    assert.ok(!groupIds.has(group.id), 'duplicate group ' + group.id);
    groupIds.add(group.id);
    assert.ok(group.title.en?.trim() && group.title.vi?.trim(), 'bilingual group name ' + group.id);
    assert.ok(Array.isArray(group.lesson_ids) && group.lesson_ids.length, 'empty visible group ' + group.id);
    for (const id of group.lesson_ids) {
      assert.ok(ids.has(id) || futureIds.has(id), 'unknown lesson ' + id);
      if (ids.has(id)) assert.equal(source.lessons.find(l => l.id === id).module, module, 'wrong module ' + id);
      else assert.equal(id.slice(0, 3), ({ grammar: 'GRA', vocabulary: 'VOC', reading: 'REA', writing: 'WRI' })[module], 'wrong future module ' + id);
      assert.ok(!seen.has(id), 'duplicate assignment ' + id);
      seen.add(id);
    }
  }
}
assert.equal(seen.size, ids.size + futureIds.size, 'unexpected or missing lesson group');
for (const id of futureIds) assert.ok(seen.has(id), 'missing future lesson ' + id);
for (const id of ids) assert.ok(seen.has(id), 'missing existing lesson ' + id);
assert.ok(source.course.sequence.every(id => seen.has(id)), 'course route unexpectedly altered');
console.log('PASS: ' + ids.size + ' existing and ' + futureIds.size + ' future lessons in ' + groupCount + ' groups, seven skills; no curriculum writes.');
