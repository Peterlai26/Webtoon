'use strict';
// Automatic first-pass placement of text overlays (all coordinates in % of
// the panel). Sizes come from a real browser measurement when available
// (scripts/measure.js), with a rough estimate as fallback. Admins fine-tune
// afterwards in the dashboard bubble editor.
const W = 800;
const COMBINING = /[ัิ-ฺ็-๎]/g;
const FS = { say: 3.3, shout: 3.3, think: 3.3, whisper: 3.3, narr: 3.0, sys: 2.9, sfx: 6 };
const MAXW = { narr: 64, sys: 72 };
const round = (n) => Math.round(n * 10) / 10;

// fallback estimator (px at 800 wide)
function estimate(items) {
  return items.map((it) => {
    const fpx = (FS[it.kind] / 100) * W * (it.fs || 1);
    const chars = it.text.replace(COMBINING, '').length;
    const cw = fpx * 0.62, pad = it.kind === 'sfx' ? 0 : fpx * 1.9;
    const one = ((chars * cw + pad) / W) * 100;
    const inner = (it.w / 100) * W - pad;
    const lines = it.kind === 'sfx' ? 1 : Math.max(1, Math.ceil((chars * cw) / inner));
    return { one, h: lines * fpx * 1.5 + (it.kind === 'sfx' ? 0 : fpx * 1.3), wpx: it.kind === 'sfx' ? (one / 100) * W : (it.w / 100) * W };
  });
}

const overlapCircle = (r, c, pad = 0) => {
  const nx = Math.max(r.x, Math.min(c.x, r.x + r.w)), ny = Math.max(r.y, Math.min(c.y, r.y + r.h));
  return (nx - c.x) ** 2 + (ny - c.y) ** 2 < (c.r + pad) ** 2;
};

async function layoutPanel(texts, heads, H, measurer) {
  const measure = measurer ? (items) => measurer.measure(items) : async (items) => estimate(items);
  const items = texts.map((t) => ({ t, kind: t.k, text: t.t, fs: t.k === 'sfx' ? (t.size || 1.4) : 1 }));
  // widths from the measured single-line width
  const ones = await measure(items.map((it) => ({ ...it, w: 50 })));
  items.forEach((it, i) => {
    if (it.kind === 'sfx') { it.w = ones[i].one; return; }
    const max = MAXW[it.kind] || 52;
    it.w = it.t.pos?.w ?? Math.min(max, Math.max(it.kind === 'narr' ? 20 : 16, Math.ceil(ones[i].one + 1)));
  });
  const faces = heads.map((h) => ({ x: h.head[0], y: h.head[1] + h.r * 0.1, r: h.r * 1.05 }));
  const px2pctY = (px) => (px / H) * 100;
  const PH = (px) => px * (W / 800); // measurement is at 800px reference width already

  for (let pass = 0; pass < 6; pass++) {
    const m = await measure(items.map((it) => ({ kind: it.kind, text: it.text, w: it.w, fs: it.fs })));
    items.forEach((it, i) => {
      it.hPx = PH(m[i].h) + (['say', 'shout', 'whisper', 'think'].includes(it.kind) ? 24 * it.fs : 0); // tail clearance
      it.h = px2pctY(it.hPx);
      if (it.kind === 'sfx') it.w = (m[i].wpx / W) * 100;
    });
    // initial placement
    let cursor = 2;
    for (const it of items) {
      const t = it.t;
      it.sp = t.who ? heads.find((h) => h.id === t.who) : null;
      if (it.kind === 'sfx') { it.x = Math.max(1, Math.min(t.pos.x, 99 - it.w)); it.y = t.pos.y; it.fixed = true; continue; }
      if (t.pos && t.pos.x !== undefined) { it.x = t.pos.x; it.y = t.pos.y; it.fixed = true; continue; }
      it.fixed = false;
      it.y = cursor;
      const cands = [];
      if (it.sp) cands.push((it.sp.head[0] / W) * 100 - it.w / 2);
      if (it.kind === 'sys') cands.push(50 - it.w / 2);
      cands.push(3, 97 - it.w, 50 - it.w / 2);
      it.x = null;
      for (const cx of cands) {
        const xx = Math.max(2, Math.min(98 - it.w, cx));
        const r = { x: (xx / 100) * W, y: (it.y / 100) * H, w: (it.w / 100) * W, h: it.hPx };
        if (!faces.some((f) => overlapCircle(r, f, 6))) { it.x = xx; break; }
      }
      if (it.x === null) it.x = Math.max(2, Math.min(98 - it.w, cands[0]));
      cursor = it.y + it.h + 1.2;
    }
    // collision resolution: later items move below earlier ones they overlap
    const placed = [];
    for (const it of [...items].sort((a, b) => a.y - b.y)) {
      let moved = true, guard = 0;
      while (moved && guard++ < 40) {
        moved = false;
        for (const o of placed) {
          const ox = Math.min(it.x + it.w, o.x + o.w) - Math.max(it.x, o.x);
          const oy = Math.min(it.y + it.h, o.y + o.h) - Math.max(it.y, o.y);
          if (ox > 0.5 && oy > -0.6) { it.y = o.y + o.h + 2; moved = true; }
        }
      }
      placed.push(it);
    }
    const bottom = Math.max(0, ...items.map((it) => it.y + it.h));
    if (bottom <= 98.5) break;
    // too crowded: shrink text in this panel a little and try again
    const f = bottom > 130 ? 0.82 : 0.9;
    let changed = false;
    for (const it of items) { const nf = Math.max(it.kind === 'sfx' ? 0.8 : 0.66, round(it.fs * f * 100) / 100); if (nf !== it.fs) { it.fs = nf; changed = true; } }
    if (!changed) { // cannot shrink further: squeeze to fit from the top
      const scale = 96 / bottom;
      for (const it of items) it.y = round(it.y * scale);
      break;
    }
  }

  return items.map((it) => {
    let tail = 'none', tailX = 50;
    if (it.sp && ['say', 'shout', 'whisper', 'think'].includes(it.kind)) {
      const hx = (it.sp.head[0] / W) * 100, hy = (it.sp.head[1] / H) * 100, hr = px2pctY(it.sp.r);
      if (hy - hr > it.y + it.h - px2pctY(24)) tail = 'b';
      else if (hy + hr < it.y) tail = 't';
      else tail = hx < it.x ? 'l' : hx > it.x + it.w ? 'r' : 'b';
      if (tail === 'b' || tail === 't') tailX = Math.max(12, Math.min(88, ((hx - it.x) / it.w) * 100));
      else tailX = 60;
    }
    const base = { speaker: it.t.who || '', text: it.text, x: round(it.x), y: round(it.y), fontScale: it.fs, tail, tailX: round(tailX) };
    if (it.kind === 'sfx') return { ...base, kind: 'sfx', w: 30, rotate: it.t.rot || 0, color: it.t.color || '' };
    return { ...base, kind: it.kind, w: round(it.w), rotate: 0, color: '' };
  });
}

module.exports = { layoutPanel };
