#!/usr/bin/env node
// Renders every storyboard panel to SVG, writes per-episode metadata
// (panel sizes, speaker positions, dialogue) and the Phase-3 storyboard docs.
// Usage: node scripts/render-art.js [episodeNumber ...]
'use strict';
const fs = require('fs');
const path = require('path');
const { renderPanel } = require('../art/lib/compose');

const ROOT = path.join(__dirname, '..');
const SB = path.join(ROOT, 'content', 'storyboards');
const OUT = path.join(ROOT, 'art', 'out');
const DOCS = path.join(ROOT, 'docs', 'storyboards');

const KIND = { narr: 'บรรยาย', say: 'พูด', shout: 'ตะโกน', think: 'คิด', whisper: 'กระซิบ', sys: 'ระบบ', sfx: 'SFX' };

function loadEpisode(n) {
  const file = path.join(SB, `ep${String(n).padStart(2, '0')}.js`);
  delete require.cache[require.resolve(file)];
  return require(file);
}

function renderEpisode(n) {
  const ep = loadEpisode(n);
  const dir = path.join(OUT, `ep${String(n).padStart(2, '0')}`);
  fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.svg')) fs.unlinkSync(path.join(dir, f));
  const meta = { number: ep.number, title: ep.title, subtitle: ep.subtitle, summary: ep.summary, source: ep.source, panels: [] };
  const md = [`# EP${ep.number} — ${ep.title}`, '', `*${ep.subtitle}* · ต้นฉบับ: \`source/${ep.source}\``, '', ep.summary, '', `จำนวน Panel: ${ep.panels.length}`, ''];
  ep.panels.forEach((p, i) => {
    const file = `p${String(i + 1).padStart(2, '0')}.svg`;
    let r;
    try { r = renderPanel({ ...p, id: `${n}-${i + 1}` }, ep.defaults); } catch (e) { throw new Error(`EP${n} panel ${i + 1}: ${e.message}`); }
    fs.writeFileSync(path.join(dir, file), r.svg);
    meta.panels.push({ file, h: r.h, heads: r.heads, text: p.T || [], note: p.n, src: p.src, gap: p.gap });
    md.push(`## Panel ${i + 1} (${r.h}px) — อ้างอิง ${p.src || '-'}`, '', `**ภาพ/มุมกล้อง:** ${p.n || '-'}`, '');
    for (const t of p.T || []) md.push(`- ${KIND[t.k]}${t.who ? ` (${t.who})` : ''}: ${t.t}`);
    md.push('');
  });
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 1));
  fs.mkdirSync(DOCS, { recursive: true });
  fs.writeFileSync(path.join(DOCS, `ep${String(n).padStart(2, '0')}.md`), md.join('\n'));
  return meta;
}

const args = process.argv.slice(2).map(Number).filter(Boolean);
const eps = args.length ? args : fs.readdirSync(SB).filter((f) => /^ep\d+\.js$/.test(f)).map((f) => Number(f.slice(2, 4))).sort((a, b) => a - b);
for (const n of eps) {
  const m = renderEpisode(n);
  console.log(`EP${n}: ${m.panels.length} panels`);
}
