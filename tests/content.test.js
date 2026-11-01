'use strict';
// Content QA: scope (EP1-70 only), source references, no Thai text inside the
// artwork, the normalised names/numbers, and continuity rules.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SB = path.join(ROOT, 'content', 'storyboards');
const OUT = path.join(ROOT, 'art', 'out');
const eps = Array.from({ length: 70 }, (_, i) => require(path.join(SB, `ep${String(i + 1).padStart(2, '0')}.js`)));
const THAI = /[฀-๿]/;

test('exactly episodes 1-70 exist, numbered in order, no EP71+', () => {
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
  // EP31-45 source typos: Latin "af" inside a Thai word (ch.31 L286), Arabic (ch.36 L4, ch.37 L228), doubled vowel (ch.37 L50)
  assert.ok(!/[\u0600-\u06ff]/.test(all), 'stray Arabic glyphs');
  assert.ok(!/[a-zA-Z][\u0e00-\u0e7f]|[\u0e00-\u0e7f][a-zA-Z]/.test(all), 'Latin letters glued to Thai words');
  assert.ok(!/สาาด/.test(all), 'doubled vowel typo');
  // EP46-65 source typos: Indonesian "ketika" (ch.46 L116), Hebrew (ch.47 L234), "คafัน" (ch.48/49/57), Chinese (ch.47/49/51/53), Cyrillic П (ch.53 L36), Devanagari (ch.59 L37)
  assert.ok(!/ketika|[\u0590-\u05ff]|คaf/.test(all), 'EP46-65 stray source typos');
});

test('characters only appear from the episode they are introduced in the source', () => {
  const firstEp = { lilith: 3, grey: 3, ash: 4, knell: 5, creature: 5, latch: 6, suture: 6, vale: 6, raze: 10,
    stranger: 11, bruno: 13, cherry: 13, hostess: 13, velvetGuard: 13, mothkid: 14, roxy: 15, vane: 16, cassian: 16, snake: 16, varan: 17, arachne: 18,
    nox: 19, gula: 19, volt: 19, claire: 19, grimm: 19, rivetKing: 19, kier: 19, cinder: 19, ninebell: 19,
    puppet: 22, oreBeetle: 23, rockKing: 24, centipede: 24, claireBones: 24, ilya: 26, mech: 26, enforcer: 27, revS: 28,
    marquis: 30, valentine: 30, corsetta: 30, porcelain: 30, silk: 30,
    carrow: 31, crimsonJaw: 33, miray: 35, olden: 36, corvin: 37, sanctum: 37, axiom: 37, bastian: 37, draken: 38, whiteDragon: 38, voss: 38,
    whiteMask: 39, arion: 39, chronos: 39, gravis: 39, nal: 40, naira: 41, velen: 41, lightHound: 42, quadMech: 43, oneface: 44,
    regulus: 45, warden: 45, ledger: 45, grimmFace: 45,
    mono: 49, kinesis: 50, rail: 50, valkor: 50, sadis: 50, gargoyle: 50, vesper: 50, centurion: 50, voltage: 50, sunDragon: 63,
    sandShark: 67, stoneWorm: 67, zahira: 68, serkal: 68, solon: 68, sandGuard: 68, kira: 69, haran: 69, tikky: 69, koko: 69, ironBeetle: 70 };
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


test('EP31-45 continuity: Sera\'s iron heart stays with Rey, Grimm unmasks only in EP45 L64+, Naira unmasks from EP44 L26', () => {
  const lineOf = (src) => Number((src.match(/^L(\d+)/) || [])[1]);
  for (const ep of eps.filter((e) => e.number >= 31)) for (const p of ep.panels) for (const l of p.L || []) {
    if (l.c === 'grimmFace') assert.ok(ep.number > 45 || lineOf(p.src) >= 64, `EP${ep.number} ${p.src} Grimm unmasked too early`);
    if (l.c === 'grimm' && ep.number === 45) assert.ok(lineOf(p.src) <= 62, `EP45 ${p.src} Grimm should be unmasked`);
    if (l.c === 'naira' && l.st && l.st.unmasked) assert.ok(ep.number >= 44 && (ep.number > 44 || lineOf(p.src) >= 26), `EP${ep.number} ${p.src} Naira unmasked too early`);
    if (l.c === 'sera') assert.ok(ep.number <= 34, `EP${ep.number}: Sera died in EP34`);
  }
  // Rey keeps the reforged blade
  for (const ep of eps.filter((e) => e.number >= 31)) for (const p of ep.panels) for (const l of p.L || []) if (l.c === 'rey' && l.props) for (const pr of Object.values(l.props)) if (pr && pr.n === 'sword') assert.ok(pr.ember, `EP${ep.number} ${p.src}`);
});

test('EP46-65 continuity: Grimm dies in EP58, Velen in EP61; the lieutenants stay dead; Rey keeps the reforged blade', () => {
  const lineOf = (src) => Number((src.match(/^L(\d+)/) || [])[1]);
  for (const ep of eps.filter((e) => e.number >= 46)) for (const p of ep.panels) for (const l of p.L || []) {
    // Grimm: alive until the soul is burned at ch.58 L208; afterwards only his body (EP58-59) — never again from EP60
    if (l.c === 'grimm' || l.c === 'grimmFace') {
      assert.ok(ep.number <= 59, `EP${ep.number} ${p.src}: Grimm died in EP58`);
      if (ep.number === 59 || (ep.number === 58 && lineOf(p.src) >= 216)) assert.ok(['lie', 'lieHurt'].includes(l.pose) || l.opacity, `EP${ep.number} ${p.src}: Grimm's body should be lying`);
    }
    if (l.c === 'grimm' && ep.number === 58) assert.ok(lineOf(p.src) < 142, `EP58 ${p.src}: the skull mask broke at L142`);
    if (l.c === 'velen') assert.ok(ep.number <= 61, `EP${ep.number} ${p.src}: Velen died in EP61`);
    if (['vesper', 'centurion', 'voltage'].includes(l.c)) assert.ok(ep.number <= 57, `EP${ep.number} ${p.src}: ${l.c} died`);
    if (['regulus', 'warden', 'mono', 'draken', 'sunDragon'].includes(l.c)) assert.ok(ep.number <= 65, `${l.c}`);
    if (l.c === 'rey' && l.props) for (const pr of Object.values(l.props)) if (pr && pr.n === 'sword') assert.ok(pr.ember, `EP${ep.number} ${p.src}`);
  }
  // Rey has no time-rewind (author's ruling on ch.59 L195-217): his power is the ten-second body reset only
  for (const ep of eps.filter((e) => e.number >= 46)) for (const p of ep.panels) for (const t of [p.n, ...(p.T || []).map((x) => x.t)]) assert.ok(!/ย้อนเวลา|ย้อนกลับไปสิบวินาที|ดีดย้อน|เวลาย้อน/.test(t), `EP${ep.number} ${p.src}: Rey cannot rewind time`);
});

test('EP66-70 continuity: the fallen of Arc 6 stay gone, Rey carries Grimm\'s mace, no beetle is killed, Kira is only a shimmer before EP69', () => {
  const dead = ['grimm', 'grimmFace', 'velen', 'naira', 'regulus', 'mono', 'warden', 'sera', 'oneface', 'draken', 'sunDragon', 'whiteDragon'];
  for (const ep of eps.filter((e) => e.number >= 66)) for (const p of ep.panels) for (const l of p.L || []) {
    assert.ok(!dead.includes(l.c), `EP${ep.number} ${p.src}: ${l.c} died in Arc 6`);
    if (l.c === 'ironBeetle') assert.ok(!['dead', 'lie'].includes(l.pose) && !l.dead, `EP${ep.number} ${p.src}: the beetles are herded, not killed`);
  }
  // Rey: torn white jacket again (ch.66 L15) with the mace strapped on the back (ch.66 L19)
  for (const ep of eps.filter((e) => e.number >= 66)) {
    assert.ok(ep.defaults && ep.defaults.rey && ep.defaults.rey.backMace && !ep.defaults.rey.outfit, `EP${ep.number} Rey's arc-7 outfit`);
  }
  // Rey has no time-rewind: the finger-cut demo (ch.68 L117) must not say "ย้อนเวลา"
  const ep68 = eps[67];
  assert.ok(ep68.panels.some((p) => /L115-117/.test(p.src) && (p.L || []).some((l) => l.fx === 'reset')));
});
