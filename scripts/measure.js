'use strict';
// Measures text overlays with the site's real fonts/CSS in headless Chromium,
// at the 800px reference panel width. Used by the seed step so automatic
// bubble placement is based on actual rendered sizes, not estimates.
const fs = require('fs');
const path = require('path');

async function createMeasurer() {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch { return null; }
  const root = path.join(__dirname, '..', 'public');
  // inline the web fonts so measurements use exactly the reader's fonts
  const css = fs.readFileSync(path.join(root, 'css', 'site.css'), 'utf8')
    .replace(/url\(\/fonts\/([^)]+)\)/g, (_, f) => `url(data:font/woff2;base64,${fs.readFileSync(path.join(root, 'fonts', f)).toString('base64')})`);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><figure class="panel" id="p" style="width:800px;height:4000px"><div class="bubble-layer" id="l"></div></figure><figure class="panel" style="width:360px;height:2000px"><div class="bubble-layer" id="s"></div></figure></body></html>`);
  await page.evaluate(async () => {
    const probe = document.createElement('div');
    probe.innerHTML = '<div class="bubble k-say">ทดสอบ abc</div><div class="bubble k-narr">ทดสอบ abc</div><div class="bubble k-shout">ทดสอบ</div><div class="bubble k-sfx">ทดสอบ</div><div class="bubble k-whisper">ก</div>';
    document.getElementById('l').append(probe);
    await Promise.all([...document.fonts].map((f) => f.load().catch(() => null)));
    await document.fonts.ready; probe.remove();
    if (![...document.fonts].some((f) => f.family.includes('Mali') && f.status === 'loaded')) throw new Error('web fonts did not load for measurement');
  });
  return {
    // items: [{ kind, text, w (% width), fs }] -> [{ h: % of 800px, one: single-line width % }]
    async measure(items) {
      return page.evaluate((items) => {
        const layer = document.getElementById('l');
        return items.map((it) => {
          const el = document.createElement('div');
          el.className = `bubble k-${it.kind}`;
          el.style.setProperty('--fs', it.fs || 1);
          const span = document.createElement('span'); span.className = 'bubble-text'; span.textContent = it.text; el.append(span);
          el.style.left = '0'; el.style.top = '0';
          el.style.width = 'max-content'; el.style.whiteSpace = 'nowrap';
          layer.append(el);
          const one = (el.getBoundingClientRect().width / 800) * 100;
          el.style.whiteSpace = ''; span.style.whiteSpace = '';
          if (it.kind !== 'sfx') el.style.width = `${it.w}%`;
          const r = el.getBoundingClientRect();
          // phones: wrapping can add a line at small sizes, so also measure at 360px and keep the larger
          const small = el.cloneNode(true);
          document.getElementById('s').append(small);
          const hs = (small.getBoundingClientRect().height * 800) / 360;
          small.remove();
          el.remove();
          return { one, h: Math.max(r.height, hs), wpx: r.width };
        });
      }, items);
    },
    close: () => browser.close(),
  };
}

module.exports = { createMeasurer };
