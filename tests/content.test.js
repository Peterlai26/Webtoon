'use strict';
// Content QA: scope (EP1-10 only), source references, no Thai text inside the
// artwork, the normalised names/numbers, and continuity rules.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SB = path.join(ROOT, 'content', 'storyboards');
const OUT = path.join(ROOT, 'art', 'out');
const eps = Array.from({ length: 10 }, (_, i) => require(path.join(SB, `ep${String(i + 1).padStart(2, '0')}.js`)));
const THAI = /[฀-๿]/;

test('exactly episodes 1-10 exist, numbered in order, no EP11+', () => {
  const files = fs.readdirSync(SB).filter((f) => /^ep\d+\.js$/.test(f)).sort();
  assert.deepEqual(files, eps.map((_, i) => `ep${String(i + 1).padStart(2, '0')}.js`));
  eps.forEach((ep, i) => {
    assert.equal(ep.number, i + 1);
    assert.match(ep.source, new RegExp(`^Chapter_${String(i + 1).padStart(2, '0')}_`));
    assert.ok(fs.existsSync(path.join(ROOT, 'source', ep.source)), `source file for EP${i + 1}`);
  });
});

test('every panel has a shot note, a source line reference and text that is non-empty', () => {
  for (const ep of eps) ep.panels.forEach((p, i) => {
    assert.ok(p.n && p.n.length > 5, `EP${ep.number} p${i + 1} note`);
    assert.match(p.src || '', /^L\d+/, `EP${ep.number} p${i + 1} src`);
    for (const t of p.T || []) assert.ok(t.t && t.t.trim(), `EP${ep.number} p${i + 1} empty text`);
  });
});

test('rendered panels exist for every storyboard panel and contain no Thai text', () => {
  for (const ep of eps) {
    const dir = path.join(OUT, `ep${String(ep.number).padStart(2, '0')}`);
    const meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
    assert.equal(meta.panels.length, ep.panels.length, `EP${ep.number} rendered count`);
    for (const p of meta.panels) {
      const svg = fs.readFileSync(path.join(dir, p.file), 'utf8');
      assert.ok(svg.startsWith('<svg'), `${dir}/${p.file}`);
      assert.ok(!THAI.test(svg), `Thai text baked into ${dir}/${p.file}`);
    }
  }
  assert.ok(!THAI.test(fs.readFileSync(path.join(OUT, 'cover.svg'), 'utf8')));
});

test('normalised source inconsistencies are applied in dialogue', () => {
  const all = eps.flatMap((ep) => ep.panels.flatMap((p) => (p.T || []).map((t) => t.t))).join('\n');
  assert.ok(!/0409|ศูนย์สี่ศูนย์เก้า/.test(all), 'candidate number must be 499');
  assert.ok(!/เวการ์/.test(all), 'name must be วิคาร์ เวล');
  assert.ok(!/Ко|साथ/.test(all), 'stray foreign glyphs from source typos');
  assert.ok(!/ฝูงนักล่าตาบอด/.test(all));
});

test('characters only appear from the episode they are introduced in the source', () => {
  const firstEp = { lilith: 3, grey: 3, ash: 4, knell: 5, creature: 5, latch: 6, suture: 6, vale: 6, raze: 10 };
  for (const ep of eps) for (const p of ep.panels) for (const l of p.L || []) {
    if (l.c && firstEp[l.c]) assert.ok(ep.number >= firstEp[l.c], `${l.c} appears in EP${ep.number} before introduction`);
  }
});

test('episode endings stay on the source ending (last panel cites the final source lines)', () => {
  const lastLine = (ep) => fs.readFileSync(path.join(ROOT, 'source', ep.source), 'utf8').trimEnd().split('\n').length;
  for (const ep of eps) {
    const last = ep.panels[ep.panels.length - 1].src;
    const nums = last.match(/\d+/g).map(Number);
    assert.ok(Math.max(...nums) >= lastLine(ep) - 4, `EP${ep.number} ends at ${last}, source has ${lastLine(ep)} lines`);
  }
});
