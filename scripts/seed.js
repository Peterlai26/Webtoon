#!/usr/bin/env node
// Imports the rendered episodes (art/out) into the database + file storage.
// Usage: node scripts/seed.js [--publish] [--force] [episodeNumber ...]
//   --publish  mark imported episodes as published
//   --force    replace panels/bubbles of episodes that already exist
'use strict';
const fs = require('fs');
const path = require('path');
const { config, requireSecrets } = require('../server/config');
requireSecrets();
const { one, run, tx } = require('../server/db');
const storage = require('../server/storage');
const repo = require('../server/repo');
const auth = require('../server/auth');
const { layoutPanel } = require('./layout');
const { createMeasurer } = require('./measure');

const args = process.argv.slice(2);
const publish = args.includes('--publish');
const force = args.includes('--force');
const only = args.filter((a) => /^\d+$/.test(a)).map(Number);
const OUT = path.join(config.root, 'art', 'out');

if (auth.ensureAdminFromEnv()) console.log(`created admin "${config.adminUser}"`);

const series = require('../content/series.json');
const coverFile = path.join(OUT, 'cover.svg');
const cover = fs.existsSync(coverFile) ? storage.save(fs.readFileSync(coverFile), 'cover.svg') : null;
if (!repo.series()) run('INSERT INTO series (id, title) VALUES (1, ?)', series.title);
const existingSeries = repo.series();
if (force || !existingSeries.synopsis) repo.updateSeries({ title: series.title, tagline: series.tagline, synopsis: series.synopsis, coverKey: cover?.key });

(async () => {
const measurer = await createMeasurer();
if (!measurer) console.log('playwright not available: using estimated text sizes');
const dirs = fs.readdirSync(OUT).filter((d) => /^ep\d+$/.test(d)).sort();
for (const d of dirs) {
  const meta = JSON.parse(fs.readFileSync(path.join(OUT, d, 'meta.json'), 'utf8'));
  if (only.length && !only.includes(meta.number)) continue;
  let ep = one('SELECT * FROM episodes WHERE number = ?', meta.number);
  if (ep && !force) { console.log(`EP${meta.number}: exists, skipped (use --force to replace)`); continue; }
  const layouts = [];
  for (const p of meta.panels) layouts.push(await layoutPanel(p.text, p.heads, p.h, measurer));
  tx(() => {
    if (!ep) {
      run('INSERT INTO episodes (number, title, subtitle, summary) VALUES (?,?,?,?)', meta.number, meta.title, meta.subtitle || '', meta.summary || '');
      ep = one('SELECT * FROM episodes WHERE number = ?', meta.number);
    } else {
      run("UPDATE episodes SET title = ?, subtitle = ?, summary = ?, updated_at = datetime('now') WHERE id = ?", meta.title, meta.subtitle || '', meta.summary || '', ep.id);
      run('DELETE FROM panels WHERE episode_id = ?', ep.id);
    }
    meta.panels.forEach((p, i) => {
      const m = storage.save(fs.readFileSync(path.join(OUT, d, p.file)), `${d}-${p.file}`);
      const r = run('INSERT INTO panels (episode_id, position, image_key, width, height, gap, alt) VALUES (?,?,?,?,?,?,?)', ep.id, i + 1, m.key, m.width, m.height, p.gap ?? 24, p.note || '');
      const bubbles = layouts[i];
      bubbles.forEach((b, k) => run(`INSERT INTO bubbles (panel_id, position, kind, speaker, text, x, y, w, font_scale, tail, tail_x, rotate, color)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, Number(r.lastInsertRowid), k, b.kind, b.speaker, b.text, b.x, b.y, b.w, b.fontScale, b.tail, b.tailX, b.rotate, b.color));
    });
    const thumbFile = path.join(OUT, d, 'thumb.svg');
    if (fs.existsSync(thumbFile)) run('UPDATE episodes SET thumb_key = ? WHERE id = ?', storage.save(fs.readFileSync(thumbFile), `${d}-thumb.svg`).key, ep.id);
    if (publish) run("UPDATE episodes SET status = 'published', published_at = COALESCE(published_at, datetime('now')) WHERE id = ?", ep.id);
  });
  console.log(`EP${meta.number}: imported ${meta.panels.length} panels${publish ? ' (published)' : ''}`);
}
if (measurer) await measurer.close();
})().catch((e) => { console.error(e); process.exit(1); });
