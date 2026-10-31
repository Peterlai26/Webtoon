'use strict';
// Content QA: scope (EP1-30 only), source references, no Thai text inside the
// artwork, the normalised names/numbers, and continuity rules.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SB = path.join(ROOT, 'content', 'storyboards');
const OUT = path.join(ROOT, 'art', 'out');
const eps = Array.from({ length: 30 }, (_, i) => require(path.join(SB, `ep${String(i + 1).padStart(2, '0')}.js`)));
const THAI = /[฀-๿]/;

test('exactly episodes 1-30 exist, numbered in order, no EP31+', () => {
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
  // EP11-20 source typos (stray CJK / Cyrillic / Spanish words, doubled vowel)
  assert.ok(!/[\u4e00-\u9fff\u0400-\u04ff]/.test(all), 'stray CJK/Cyrillic glyphs');
  assert.ok(!/mientras|\byang\b|ฟัังดู/.test(all), 'stray source typos');
  // EP21-30 source typos: stray Devanagari (ch.22 L46) / Bengali (ch.24 L254) glyphs
  assert.ok(!/[\u0900-\u097f\u0980-\u09ff]/.test(all), 'stray Devanagari/Bengali glyphs');
});

test('characters only appear from the episode they are introduced in the source', () => {
  const firstEp = { lilith: 3, grey: 3, ash: 4, knell: 5, creature: 5, latch: 6, suture: 6, vale: 6, raze: 10,
    stranger: 11, bruno: 13, cherry: 13, hostess: 13, velvetGuard: 13, mothkid: 14, roxy: 15, vane: 16, cassian: 16, snake: 16, varan: 17, arachne: 18,
    nox: 19, gula: 19, volt: 19, claire: 19, grimm: 19, rivetKing: 19, kier: 19, cinder: 19, ninebell: 19,
    puppet: 22, oreBeetle: 23, rockKing: 24, centipede: 24, claireBones: 24, ilya: 26, mech: 26, enforcer: 27, revS: 28,
    marquis: 30, valentine: 30, corsetta: 30, porcelain: 30, silk: 30 };
  for (const ep of eps) for (const p of ep.panels) for (const l of p.L || []) {
    if (l.c && firstEp[l.c]) assert.ok(ep.number >= firstEp[l.c], `${l.c} appears in EP${ep.number} before introduction`);
  }
});

test('episode endings stay on the source ending (last panel cites the final source lines)', () => {
  const lastLine = (ep) => fs.readFileSync(path.join(ROOT, 'source', ep.source), 'utf8').trimEnd().split('\n').length;
  for (const ep of eps) {
    const last = ep.panels[ep.panels.length - 1].src;
    // sourceEnd: chapter files that end with an author's outline for the next chapter (EP19)
    const nums = last.match(/\d+/g).map(Number);
    assert.ok(Math.max(...nums) >= (ep.sourceEnd || lastLine(ep)) - 4, `EP${ep.number} ends at ${last}, source has ${lastLine(ep)} lines`);
  }
});

test('EP21-30 continuity: Nox grows in EP23 / EP25 and carries the pact with Rey from EP25 L192 on; reforged sword from EP25', () => {
  const layers = (ep) => ep.panels.flatMap((p) => (p.L || []).map((l) => ({ l, src: p.src })));
  for (const ep of eps.filter((e) => e.number >= 21)) for (const { l, src } of layers(ep)) {
    if (l.c === 'nox') {
      const g = l.grown || 0;
      if (ep.number <= 22) assert.equal(g, 0, `EP${ep.number} Nox must still be a pup`);
      if (ep.number >= 24 && ep.number <= 25) assert.ok(g >= 1, `EP${ep.number} ${src} Nox grew in EP23`);
      if (ep.number >= 26) assert.ok(g === 2 && l.sigil, `EP${ep.number} ${src} Nox is grown and bound to Rey`);
    }
    if (l.c && l.props) for (const pr of Object.values(l.props)) if (pr && pr.n === 'sword') {
      if (ep.number <= 24) assert.ok(!pr.ember, `EP${ep.number} ${src} sword reforged too early`);
      if (ep.number >= 26) assert.ok(pr.ember, `EP${ep.number} ${src} sword must be the reforged blade`);
    }
  }
});

