#!/usr/bin/env node
// Exports the published episodes (panels + positioned Thai text from the DB)
// into a static, read-only reader: <out>/index.html + <out>/data/*.json.
// Usage: node scripts/export-static.js <outDir>
'use strict';
const fs = require('fs');
const path = require('path');
const { config, requireSecrets } = require('../server/config');
requireSecrets();
const repo = require('../server/repo');
const storage = require('../server/storage');

const out = path.resolve(process.argv[2] || path.join(config.root, 'dist-static'));
fs.mkdirSync(path.join(out, 'data'), { recursive: true });
const svgOf = (key) => (key ? fs.readFileSync(storage.resolve(key).file, 'utf8') : null);

const series = repo.series();
const eps = repo.listEpisodes();
const index = {
  series: { title: series.title, tagline: series.tagline, synopsis: series.synopsis, cover: svgOf(series.coverKey) },
  episodes: eps.map((e) => ({ number: e.number, title: e.title, subtitle: e.subtitle, summary: e.summary, panels: e.panelCount, thumb: svgOf(e.thumbKey) })),
};
fs.writeFileSync(path.join(out, 'data', 'index.json'), JSON.stringify(index));
for (const e of eps) {
  const ep = repo.getEpisode('id', e.id);
  const data = {
    number: ep.number, title: ep.title, subtitle: ep.subtitle,
    panels: ep.panels.map((p) => ({ w: p.width, h: p.height, gap: p.gap, alt: p.alt, svg: svgOf(p.imageKey), bubbles: p.bubbles.map(({ id, ...b }) => b) })),
  };
  fs.writeFileSync(path.join(out, 'data', `ep${String(ep.number).padStart(2, '0')}.json`), JSON.stringify(data));
}
fs.copyFileSync(path.join(__dirname, 'static-reader.html'), path.join(out, 'index.html'));
console.log(`exported ${eps.length} episodes to ${out}`);
