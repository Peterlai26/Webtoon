'use strict';
// Automatic first-pass placement of text overlays. Coordinates are % of the
// panel. Admins fine-tune afterwards in the dashboard bubble editor.
const W = 800;
const COMBINING = /[ัิ-ฺ็-๎]/g;
const FS = { say: 3.3, shout: 3.3, think: 3.3, whisper: 3.3, narr: 3.0, sys: 2.9 };

function measure(text, kind, wPct) {
  const chars = text.replace(COMBINING, '').length;
  const fpx = (FS[kind] / 100) * W;
  const cw = fpx * (kind === 'narr' || kind === 'sys' ? 0.5 : 0.56);
  const pad = fpx * 1.8;
  const inner = (wPct / 100) * W - pad;
  const lines = Math.max(1, Math.ceil((chars * cw) / inner));
  return { lines, hPx: lines * fpx * 1.45 + fpx * 1.2 + (kind === 'shout' ? fpx * 0.3 : 0), oneLinePct: ((chars * cw + pad + 6) / W) * 100 };
}

function chooseWidth(text, kind) {
  const max = kind === 'narr' ? 64 : kind === 'sys' ? 72 : 52;
  const one = measure(text, kind, max).oneLinePct;
  if (one <= max) return Math.max(kind === 'narr' ? 20 : 16, Math.ceil(one));
  return max;
}

const overlaps = (r, c, pad = 0) => {
  const nx = Math.max(r.x, Math.min(c.x, r.x + r.w)), ny = Math.max(r.y, Math.min(c.y, r.y + r.h));
  return (nx - c.x) ** 2 + (ny - c.y) ** 2 < (c.r + pad) ** 2;
};

function layoutPanel(texts, heads, H) {
  const out = [];
  const toPctY = (px) => (px / H) * 100;
  // head circles in px space (face area: centre slightly below head centre)
  const faces = heads.map((h) => ({ x: h.head[0], y: h.head[1] + h.r * 0.1, r: h.r * 1.05 }));
  let cursor = 2.2;
  for (const t of texts) {
    if (t.k === 'sfx') {
      out.push({ kind: 'sfx', speaker: '', text: t.t, x: t.pos.x, y: t.pos.y, w: 30, fontScale: t.size || 1.4, tail: 'none', tailX: 50, rotate: t.rot || 0, color: t.color || '' });
      continue;
    }
    const kind = t.k;
    const w = t.pos?.w ?? chooseWidth(t.t, kind);
    const m = measure(t.t, kind, w);
    const hPct = toPctY(m.hPx);
    const sp = t.who ? heads.find((h) => h.id === t.who) : null;
    let x, y;
    if (t.pos && t.pos.x !== undefined) { x = t.pos.x; y = t.pos.y; }
    else {
      y = cursor;
      const cands = [];
      if (sp) cands.push((sp.head[0] / W) * 100 - w / 2);
      if (kind === 'narr' || kind === 'sys') cands.push(kind === 'sys' ? 50 - w / 2 : 3);
      cands.push(3, 97 - w, 50 - w / 2);
      x = null;
      for (const cx of cands) {
        const xx = Math.max(2, Math.min(98 - w, cx));
        const r = { x: (xx / 100) * W, y: (y / 100) * H, w: (w / 100) * W, h: m.hPx };
        if (!faces.some((f) => overlaps(r, f, 6))) { x = xx; break; }
      }
      if (x === null) x = Math.max(2, Math.min(98 - w, cands[0]));
      cursor = y + hPct + 1.6;
    }
    let tail = 'none', tailX = 50;
    if (sp && ['say', 'shout', 'whisper', 'think'].includes(kind)) {
      const hx = (sp.head[0] / W) * 100, hy = (sp.head[1] / H) * 100;
      const top = y, bottom = y + hPct;
      if (hy - toPctY(sp.r) > bottom) tail = 'b';
      else if (hy + toPctY(sp.r) < top) tail = 't';
      else tail = hx < x ? 'l' : hx > x + w ? 'r' : 'b';
      if (tail === 'b' || tail === 't') tailX = Math.max(12, Math.min(88, ((hx - x) / w) * 100));
      else tailX = 60;
    }
    out.push({ kind, speaker: t.who || '', text: t.t, x: round(x), y: round(y), w: round(w), fontScale: 1, tail, tailX: round(tailX), rotate: 0, color: '' });
  }
  return out;
}
const round = (n) => Math.round(n * 10) / 10;

module.exports = { layoutPanel };
