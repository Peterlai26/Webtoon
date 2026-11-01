#!/usr/bin/env node
// Exports the published episodes (panels + positioned Thai text from the DB)
// into the static, read-only library reader:
//   <out>/index.html                      the reader (library home, series page, episode reader)
//   <out>/data/library.json               every series on the shelf
//   <out>/<base>index.json, <base>epNN.json   this series' files
// Usage: node scripts/export-static.js <outDir> [--slug reset-0010] [--base data/]
// Run it once per series (each from its own database) into the same <outDir>:
// the series' entry in library.json is added or replaced, other series are kept.
// RESET: 00:10 lives in data/ (its original paths, so old links keep working);
// give any new series its own folder, e.g. --slug my-story --base data/my-story/.
'use strict';
const fs = require('fs');
const path = require('path');
const { config, requireSecrets } = require('../server/config');
requireSecrets();
const repo = require('../server/repo');
const storage = require('../server/storage');

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const out = path.resolve(args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--'))) || path.join(config.root, 'dist-static'));
const slug = opt('--slug', 'reset-0010');
let base = opt('--base', 'data/');
if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('--slug must use a-z, 0-9 and hyphens only');
if (!base.endsWith('/')) base += '/';
if (base.startsWith('/') || base.includes('..')) throw new Error('--base must be a relative folder inside the output');
const dataDir = path.join(out, base);
fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(path.join(out, 'data'), { recursive: true });
const svgOf = (key) => (key ? fs.readFileSync(storage.resolve(key).file, 'utf8') : null);

const series = repo.series();
const eps = repo.listEpisodes();
const cover = svgOf(series.coverKey);
const index = {
  series: { title: series.title, tagline: series.tagline, synopsis: series.synopsis, cover },
  episodes: eps.map((e) => ({ number: e.number, title: e.title, subtitle: e.subtitle, summary: e.summary, panels: e.panelCount, thumb: svgOf(e.thumbKey) })),
};
fs.writeFileSync(path.join(dataDir, 'index.json'), JSON.stringify(index));
for (const e of eps) {
  const ep = repo.getEpisode('id', e.id);
  const data = {
    number: ep.number, title: ep.title, subtitle: ep.subtitle,
    panels: ep.panels.map((p) => ({ w: p.width, h: p.height, gap: p.gap, alt: p.alt, svg: svgOf(p.imageKey), bubbles: p.bubbles.map(({ id, ...b }) => b) })),
  };
  fs.writeFileSync(path.join(dataDir, `ep${String(ep.number).padStart(2, '0')}.json`), JSON.stringify(data));
}

// upsert this series into the shelf
const libFile = path.join(out, 'data', 'library.json');
let library = { series: [] };
if (fs.existsSync(libFile)) library = JSON.parse(fs.readFileSync(libFile, 'utf8'));
const entry = { slug, title: series.title, tagline: series.tagline, base, cover, episodes: eps.length, latest: eps.length ? eps[eps.length - 1].number : 0 };
const at = library.series.findIndex((s) => s.slug === slug);
if (at >= 0) library.series[at] = entry; else library.series.push(entry);
fs.writeFileSync(libFile, JSON.stringify(library));

fs.copyFileSync(path.join(__dirname, 'static-reader.html'), path.join(out, 'index.html'));
console.log(`exported ${eps.length} episodes of "${series.title}" to ${dataDir} (${library.series.length} series on the shelf)`);
