#!/usr/bin/env node
// Audits rendered text overlays in a browser: overlapping bubbles and bubbles
// spilling outside their panel. Usage: BASE=http://localhost:3000 node scripts/bubble-audit.js [width]
'use strict';
const { chromium } = require('playwright');
const B = process.env.BASE || 'http://localhost:3000';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: Number(process.argv[2] || 720), height: 900 } });
  let issues = 0, total = 0;
  for (let n = Number(process.env.FROM || 1); n <= Number(process.env.TO || 30); n++) {
    await p.goto(`${B}/episode/${n}`); await p.waitForSelector('.panel img');
    await p.evaluate(() => document.fonts.ready);
    const r = await p.evaluate(() => {
      const out = []; let count = 0;
      document.querySelectorAll('.panel').forEach((fig, i) => {
        const pr = fig.getBoundingClientRect();
        const bs = [...fig.querySelectorAll('.bubble')].map((el) => ({ el, r: el.getBoundingClientRect(), t: el.textContent.slice(0, 18) }));
        count += bs.length;
        bs.forEach((a, k) => {
          if (a.r.bottom > pr.bottom + 2 || a.r.top < pr.top - 2 || a.r.left < pr.left - 2 || a.r.right > pr.right + 2) out.push(`p${i + 1} outside: ${a.t}`);
          for (const c of bs.slice(k + 1)) {
            const ox = Math.min(a.r.right, c.r.right) - Math.max(a.r.left, c.r.left), oy = Math.min(a.r.bottom, c.r.bottom) - Math.max(a.r.top, c.r.top);
            if (ox > 4 && oy > 4) out.push(`p${i + 1} overlap: ${a.t} / ${c.t}`);
          }
        });
      });
      return { out, count };
    });
    total += r.count; issues += r.out.length;
    for (const o of r.out) console.log(`EP${n} ${o}`);
  }
  console.log(`overlays: ${total}, issues: ${issues}`);
  await b.close();
  process.exit(issues ? 1 : 0);
})();
