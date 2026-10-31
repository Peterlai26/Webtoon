// Effects and set-pieces for EP21-30. Merged into FX by fx.js. No text.
'use strict';
const { INK, rng, path, circle, ellipse, rect, line, poly, g, f } = require('./util');

module.exports = function fx3({ glow }) {
  const hex = (x, y, r) => Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2; return [x + Math.cos(a) * r, y + Math.sin(a) * r]; });
  const FX3 = {
    // five-times gravity dome of the hex pylons (ch.26 L94)
    gravityDome: (W, H, o) => { const r0 = o.r || 300; return path(`M${o.x - r0},${o.y} A${r0},${r0 * 0.9} 0 0,1 ${o.x + r0},${o.y}Z`, { fill: '#5affd0', opacity: 0.16, stroke: '#7affe0', strokeWidth: 5 }) + path(Array.from({ length: 6 }, (_, i) => `M${o.x - r0 + (i + 1) * r0 / 3.5},${o.y} l0,${-r0 * 0.5}`).join(' '), { stroke: '#7affe0', strokeWidth: 3, opacity: 0.5, strokeDasharray: '20 16' }) + path(Array.from({ length: 8 }, (_, i) => `M${o.x - r0 * 0.7 + i * r0 * 0.2},${o.y - r0 * 0.6} l0,40 l-8,-10 m8,10 l8,-10`).join(' '), { stroke: '#d0fff0', strokeWidth: 3, fill: 'none', opacity: 0.7 }); },
    // golden high-heat light wall between two points (ch.27 L48)
    lightWall: (W, H, o) => { const w = o.w || 26; return path(`M${o.x1},${o.y1} L${o.x2},${o.y2}`, { stroke: '#ffd45a', strokeWidth: w * 2.4, opacity: 0.25 }) + path(`M${o.x1},${o.y1} L${o.x2},${o.y2}`, { stroke: '#ffe48a', strokeWidth: w }) + path(`M${o.x1},${o.y1} L${o.x2},${o.y2}`, { stroke: '#fff', strokeWidth: w * 0.3 }) + (o.dying ? path(`M${o.x1},${o.y1} L${o.x2},${o.y2}`, { stroke: '#15131c', strokeWidth: w * 0.8, strokeDasharray: '30 20' }) : ''); },
    // laser mesh filling a corridor (ch.27 L106)
    laserGrid: (W, H, o) => { const r = rng('lg' + o.x); let s = ''; for (let i = 0; i < (o.n || 22); i++) { const y1 = o.y + r() * o.h, y2 = o.y + r() * o.h; s += line([o.x, y1], [o.x + o.w, y2], { stroke: '#ff2a3a', strokeWidth: 2.4, opacity: 0.9 }) + line([o.x, y1], [o.x + o.w, y2], { stroke: '#ff8a9a', strokeWidth: 7, opacity: 0.2 }); } return s; },
    hexPylon: (W, H, o) => { const s0 = o.s || 1, x = o.x, y = o.y; return rect(x - 14 * s0, y - 150 * s0, 28 * s0, 150 * s0, { fill: '#d6dbe4', stroke: INK, strokeWidth: 3 }) + poly(hex(x, y - 160 * s0, 26 * s0), { fill: '#eef1f6', stroke: INK, strokeWidth: 3 }) + (o.broken ? path(`M${x - 30 * s0},${y - 190 * s0} l20,30 l-10,20 l30,20`, { stroke: '#ff6a1a', strokeWidth: 6, fill: 'none' }) : circle(x, y - 160 * s0, 12 * s0, { fill: '#5affd0' }) + glow(x, y - 160 * s0, 60 * s0, '#5affd0', 0.5)); },
    // six floating electromagnetic armour plates of Ilya (ch.29 L20): ring / cage / shield
    magPlates: (W, H, o) => {
      const n = o.n || 6, r0 = o.r || 160; let s = '';
      for (let i = 0; i < n; i++) {
        const a = (o.a0 || -90) + (i * 360) / n, x = o.x + Math.cos((a * Math.PI) / 180) * r0 * (o.sx || 1), y = o.y + Math.sin((a * Math.PI) / 180) * r0;
        s += g(rect(-40, -16, 80, 32, { fill: '#f2f4f8', stroke: INK, strokeWidth: 3, rx: 6 }) + rect(-30, -6, 60, 12, { fill: '#7ad8ff' }) + path('M-40,-16 L40,-16', { stroke: '#e2b84a', strokeWidth: 3 }), { transform: `translate(${f(x)},${f(y)}) rotate(${f(o.cage ? a + 90 : a + 90)})` });
        if (o.cage) s += line([o.x, o.y], [x, y], { stroke: '#bfe8ff', strokeWidth: 3, opacity: 0.6 });
      }
      return glow(o.x, o.y, r0 * 1.2, '#bfe8ff', o.cage ? 0.35 : 0.15) + s;
    },
    plasmaNet: (W, H, o) => { let s = ''; for (let i = 0; i <= 6; i++) s += line([o.x, o.y + (i * o.h) / 6], [o.x + o.w, o.y + (i * o.h) / 6], { stroke: '#fff3b0', strokeWidth: 3 }) + line([o.x + (i * o.w) / 6, o.y], [o.x + (i * o.w) / 6, o.y + o.h], { stroke: '#fff3b0', strokeWidth: 3 }); return rect(o.x, o.y, o.w, o.h, { fill: '#ffb800', opacity: 0.15 }) + s; },
    // Rey's black-red ash-flame sword wave (ch.25 L144, ch.26 L196)
    emberWave: (W, H, o) => {
      const r0 = o.r || 220, rot = o.rot || 0;
      const d = `M${-r0},0 A${r0},${r0} 0 0,1 ${r0},0 A${r0 * 1.06},${r0 * 0.8} 0 0,0 ${-r0},0Z`;
      return g(path(d, { fill: '#ff3a1a', opacity: 0.35, transform: 'scale(1.12)' }) + path(d, { fill: '#1a0a08', stroke: '#ff3a1a', strokeWidth: 6 }) + path(`M${-r0 * 0.8},${-r0 * 0.2} A${r0 * 0.9},${r0 * 0.9} 0 0,1 ${r0 * 0.8},${-r0 * 0.2}`, { stroke: '#ff8a3a', strokeWidth: 5, fill: 'none' }) + path(`M${-r0 * 0.5},${-r0 * 0.6} l-10,-30 M0,${-r0 * 0.95} l0,-34 M${r0 * 0.5},${-r0 * 0.6} l10,-30`, { stroke: '#ffb04a', strokeWidth: 4 }), { transform: `translate(${o.x},${o.y}) rotate(${rot})` });
    },
    // magma breath / molten flow from a point (ch.24 L94)
    magma: (W, H, o) => { const dx = o.x2 - o.x1, dy = o.y2 - o.y1; return path(`M${o.x1},${o.y1} Q${o.x1 + dx * 0.5 + (o.bend || 0)},${o.y1 + dy * 0.3} ${o.x2},${o.y2}`, { stroke: '#ff6a1a', strokeWidth: (o.w || 60) * 1.8, opacity: 0.3, strokeLinecap: 'round', fill: 'none' }) + path(`M${o.x1},${o.y1} Q${o.x1 + dx * 0.5 + (o.bend || 0)},${o.y1 + dy * 0.3} ${o.x2},${o.y2}`, { stroke: '#ff8a2a', strokeWidth: o.w || 60, strokeLinecap: 'round', fill: 'none' }) + path(`M${o.x1},${o.y1} Q${o.x1 + dx * 0.5 + (o.bend || 0)},${o.y1 + dy * 0.3} ${o.x2},${o.y2}`, { stroke: '#ffe07a', strokeWidth: (o.w || 60) * 0.3, strokeLinecap: 'round', fill: 'none', strokeDasharray: '30 20' }) + glow(o.x2, o.y2, (o.w || 60) * 3, '#ff6a1a', 0.5); },
    // green acid rain / mist (ch.24 L52)
    acid: (W, H, o) => { const r = rng('ac' + o.x); let s = ''; for (let i = 0; i < (o.n || 40); i++) { const x = o.x + (r() - 0.5) * o.w, y = o.y + r() * o.h; s += line([x, y], [x - 8, y + 24], { stroke: '#7aff3a', strokeWidth: 3, opacity: 0.8 }); } return s + ellipse(o.x, o.y + o.h, o.w * 0.6, 40, { fill: '#7aff3a', opacity: 0.18 }); },
    // stone spikes erupting from the floor (ch.24 L32)
    rockSpikes: (W, H, o) => { const r = rng('rs' + o.x); let s = ''; for (let i = 0; i < (o.n || 8); i++) { const x = o.x + (i - (o.n || 8) / 2) * (o.gap || 50), h = (o.h || 200) * (0.5 + r() * 0.6); s += poly([[x - 22, o.y], [x + r() * 10 - 5, o.y - h], [x + 22, o.y]], { fill: '#3a3640', stroke: INK, strokeWidth: 3 }); } return s; },
    // liquid-nitrogen frost on the floor (ch.27 L92)
    frost: (W, H, o) => { const r = rng('fr' + o.x); let s = ellipse(o.x, o.y, o.w / 2, 40, { fill: '#d8f4ff', opacity: 0.7, stroke: '#9ad8ff', strokeWidth: 3 }); for (let i = 0; i < 10; i++) { const x = o.x + (r() - 0.5) * o.w * 0.9; s += poly([[x - 10, o.y], [x, o.y - 30 - r() * 40], [x + 10, o.y]], { fill: '#eaf8ff', stroke: '#9ad8ff', strokeWidth: 2 }); } return s + glow(o.x, o.y - 60, o.w * 0.7, '#bfe8ff', 0.35); },
    // spears / harpoons stuck into the ground or a body
    spears: (W, H, o) => (o.pts || []).map(([x, y, a]) => g(rect(0, -4, 160, 8, { fill: '#5a5e66', stroke: INK, strokeWidth: 2 }) + path('M0,-10 L-24,0 L0,10Z', { fill: '#ff8a3a', stroke: INK, strokeWidth: 2 }), { transform: `translate(${x},${y}) rotate(${a})` })).join(''),
    // steel container of the Lumina division (sun over DNA helix emblem)
    container: (W, H, o) => { const w = o.w || 200, h0 = o.h || 280; return g(rect(-w / 2, -h0, w, h0, { fill: '#c9ced6', stroke: INK, strokeWidth: 4 }) + path(Array.from({ length: 6 }, (_, i) => `M${-w / 2 + (i + 1) * w / 7},${-h0} l0,${h0}`).join(' '), { stroke: '#a9b0bd', strokeWidth: 3 }) + circle(0, -h0 * 0.7, 22, { fill: 'none', stroke: '#e2b84a', strokeWidth: 4 }) + path(`M-14,${-h0 * 0.5} q14,-16 28,0 q-14,16 -28,0`, { stroke: '#3fe0d0', strokeWidth: 3, fill: 'none' }) + (o.open ? rect(-w / 2 + 14, -h0 + 14, w - 28, h0 - 14, { fill: '#0e1016' }) + ellipse(0, -h0 * 0.4, w * 0.4, h0 * 0.3, { fill: '#eef6ff', opacity: 0.5 }) : ''), { transform: `translate(${o.x},${o.y}) scale(${o.s || 1})` }); },
    // the sky-elevator cabin (doors open/closed) shooting up the shaft
    liftCar: (W, H, o) => { const w = o.w || 280, h0 = o.h || 320; return g(rect(-w / 2, -h0, w, h0, { fill: '#d6dbe4', stroke: INK, strokeWidth: 4 }) + (o.open ? rect(-w / 2 + 20, -h0 + 30, w - 40, h0 - 30, { fill: '#2a2c34' }) : rect(-w / 2 + 20, -h0 + 30, w / 2 - 22, h0 - 30, { fill: '#eef1f6', stroke: INK, strokeWidth: 3 }) + rect(2, -h0 + 30, w / 2 - 22, h0 - 30, { fill: '#eef1f6', stroke: INK, strokeWidth: 3 })) + circle(0, -h0 + 16, 8, { fill: '#e2b84a' }) + (o.up ? path(`M${-w / 2 + 20},10 l0,160 M${w / 2 - 20},10 l0,200 M0,10 l0,240`, { stroke: '#fff3b0', strokeWidth: 8, opacity: 0.6 }) : ''), { transform: `translate(${o.x},${o.y}) scale(${o.s || 1})` }); },
    // ancient hide map of Necropolis with four black crown marks (ch.30 L76-98)
    hideMap: (W, H, o) => {
      const r = rng('hm');
      let s = poly([[o.x - o.w / 2, o.y - o.h / 2 + 10], [o.x + o.w / 2, o.y - o.h / 2], [o.x + o.w / 2 - 10, o.y + o.h / 2], [o.x - o.w / 2 + 6, o.y + o.h / 2 + 8]], { fill: '#c8aa7a', stroke: '#6a5030', strokeWidth: 4 });
      for (let i = 0; i < 12; i++) s += path(`M${o.x - o.w / 2 + r() * o.w},${o.y - o.h / 2 + r() * o.h} q${(r() - 0.5) * 100},${(r() - 0.5) * 60} ${(r() - 0.5) * 140},${(r() - 0.5) * 80}`, { stroke: '#8a6a40', strokeWidth: 2, fill: 'none' });
      const crown = (x, y, c) => path(`M${x - 18},${y + 8} L${x - 18},${y - 8} L${x - 9},${y} L${x},${y - 14} L${x + 9},${y} L${x + 18},${y - 8} L${x + 18},${y + 8}Z`, { fill: c || '#16151b', stroke: INK, strokeWidth: 2 });
      const cr = o.crowns || [[0.74, 0.7], [0.5, 0.2], [0.2, 0.5], [0.3, 0.82]];
      cr.forEach(([u, v], i) => { const x = o.x - o.w / 2 + u * o.w, y = o.y - o.h / 2 + v * o.h; s += crown(x, y, o.hi === i ? '#c0172a' : undefined); if (o.hi === i) s += glow(x, y, 50, '#ff2a3a', 0.4); });
      if (o.spider) { const x = o.x - o.w / 2 + 0.74 * o.w, y = o.y - o.h / 2 + 0.7 * o.h + 30; s += circle(x, y, 8, { fill: '#c0172a' }) + path(`M${x - 16},${y - 8} l8,6 M${x + 16},${y - 8} l-8,6 M${x - 16},${y + 8} l8,-4 M${x + 16},${y + 8} l-8,-4`, { stroke: '#c0172a', strokeWidth: 2 }); }
      if (o.masks) { const x = o.x - o.w / 2 + 0.5 * o.w, y = o.y - o.h / 2 + 0.2 * o.h + 34; for (let k = 0; k < 3; k++) s += ellipse(x - 14 + k * 14, y + k * 2, 9, 11, { fill: '#e8e4dc', stroke: INK, strokeWidth: 1.4, opacity: 1 - k * 0.25 }); }
      if (o.district4) { const x = o.x - o.w / 2 + 0.94 * o.w, y = o.y - o.h / 2 + 0.92 * o.h; s += circle(x, y, 6, { fill: '#ff2a3a' }); }
      return s;
    },
    // rows of identical faces (the Kingdom of One Face) and a split into two after a death (ch.30 L102, L106)
    cloneCrowd: (W, H, o) => {
      let s = ''; const rows = o.rows || 4;
      for (let rI = 0; rI < rows; rI++) for (let c = 0; c < (o.cols || 8); c++) {
        const x = o.x + c * (o.gap || 90) + (rI % 2) * 40, y = o.y + rI * 120, k = 1 - rI * 0.12;
        s += g(path('M-30,40 L-36,110 L36,110 L30,40Z', { fill: '#4a4a56', stroke: INK, strokeWidth: 2 }) + ellipse(0, 0, 28, 34, { fill: '#e8e4dc', stroke: INK, strokeWidth: 2.4 }) + path('M-30,-10 C-30,-44 30,-44 30,-10 C20,-26 -20,-26 -30,-10Z', { fill: '#3a3a42' }) + ellipse(-10, 0, 4, 3, { fill: '#2a2a32' }) + ellipse(10, 0, 4, 3, { fill: '#2a2a32' }) + path('M-8,18 q8,4 16,0', { stroke: INK, strokeWidth: 2, fill: 'none' }), { transform: `translate(${x},${y}) scale(${k})`, opacity: 1 - rI * 0.15 });
      }
      return s;
    },
    // crystal tube with red liquid and origin threads (ch.30 L134-158); o.broken = opened, liquid spilling
    tube: (W, H, o) => {
      const w = o.w || 220, h0 = o.h || 620, x = o.x, y = o.y;
      if (o.broken) return ellipse(x, y, w * 0.9, 30, { fill: '#c0172a', opacity: 0.7 }) + path(`M${x - w / 2},${y} L${x - w / 2 + 10},${y - 120} L${x - w / 2 + 40},${y - 60} M${x + w / 2},${y} L${x + w / 2 - 14},${y - 140} L${x + w / 2 - 40},${y - 50}`, { fill: '#e8f4ff', fillOpacity: 0.3, stroke: '#cfe6ff', strokeWidth: 3 }) + rect(x - w / 2 - 20, y - 10, w + 40, 30, { fill: '#3a3a42', stroke: INK, strokeWidth: 3 });
      return rect(x - w / 2, y - h0, w, h0, { fill: '#ff2a3a', opacity: 0.22, rx: w / 2 }) + rect(x - w / 2, y - h0, w, h0, { fill: 'none', stroke: '#cfe6ff', strokeWidth: 5, rx: w / 2 }) + path(`M${x - w / 2 + 20},${y - h0 + 60} L${x - w / 2 + 20},${y - 60}`, { stroke: '#fff', strokeWidth: 6, opacity: 0.4 }) + rect(x - w / 2 - 20, y - 10, w + 40, 30, { fill: '#3a3a42', stroke: INK, strokeWidth: 3 }) + rect(x - w / 2 - 20, y - h0 - 20, w + 40, 30, { fill: '#3a3a42', stroke: INK, strokeWidth: 3 }) + path(Array.from({ length: 10 }, (_, i) => `M${x - w / 2 + 10 + i * (w - 20) / 9},${y - h0} Q${x},${y - h0 * 0.5} ${x + (i - 4.5) * 6},${y - h0 * 0.55}`).join(' '), { stroke: '#ff3a4a', strokeWidth: 1.6, fill: 'none', opacity: 0.8 });
    },
    // soul hands of Knell's lamp flame reaching out (ch.28 L184)
    soulHands: (W, H, o) => (o.to || []).map(([x, y]) => path(`M${o.x},${o.y} C${(o.x + x) / 2},${o.y - 120} ${x - 40},${y - 60} ${x},${y}`, { stroke: '#9fb8ff', strokeWidth: 18, opacity: 0.35, fill: 'none', strokeLinecap: 'round' }) + path(`M${o.x},${o.y} C${(o.x + x) / 2},${o.y - 120} ${x - 40},${y - 60} ${x},${y}`, { stroke: '#cfd8ff', strokeWidth: 6, fill: 'none' }) + path(`M${x - 20},${y - 10} l10,-20 M${x},${y - 20} l0,-22 M${x + 20},${y - 10} l-6,-22`, { stroke: '#cfd8ff', strokeWidth: 5, strokeLinecap: 'round' })).join(''),
    // twisted red soul of a modified revenant
    soulRed: (W, H, o) => { const s0 = o.s || 1; return glow(o.x, o.y, 120 * s0, '#ff3a4a', 0.5) + g(path('M0,-70 C36,-70 50,-26 36,0 C58,30 30,80 0,90 C-26,70 -58,36 -36,4 C-50,-30 -30,-70 0,-70Z', { fill: '#a3101f', opacity: 0.6, stroke: '#ff5a6a', strokeWidth: 3 }) + path('M-14,-30 q14,20 0,40 q-14,20 6,40', { stroke: '#ff8a9a', strokeWidth: 3, fill: 'none' }), { transform: `translate(${o.x},${o.y}) scale(${s0})` }); },
    // orange-black soul of the Rock-Armour King
    soulOrange: (W, H, o) => { const s0 = o.s || 1; return glow(o.x, o.y, 160 * s0, '#ff8a2a', 0.5) + g(path('M0,-90 C60,-90 80,-30 60,10 C80,60 40,110 0,120 C-50,100 -80,50 -56,4 C-80,-40 -50,-90 0,-90Z', { fill: '#ff8a2a', opacity: 0.55, stroke: '#3a1a08', strokeWidth: 5 }) + path('M-30,-40 q30,30 0,70 M20,-30 q-20,40 10,80', { stroke: '#3a1a08', strokeWidth: 5, fill: 'none' }), { transform: `translate(${o.x},${o.y}) scale(${s0})` }); },
    // Rey's pact mark: clock ring over a demon fang (ch.25 L192)
    pactSigil: (W, H, o) => { const r0 = o.r || 70; return glow(o.x, o.y, r0 * 2, '#ff2a3a', 0.45) + circle(o.x, o.y, r0, { fill: 'none', stroke: '#ff3a4a', strokeWidth: 6 }) + path(Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `M${f(o.x + Math.cos(a) * r0 * 0.82)},${f(o.y + Math.sin(a) * r0 * 0.82)} L${f(o.x + Math.cos(a) * r0)},${f(o.y + Math.sin(a) * r0)}`; }).join(' '), { stroke: '#ff3a4a', strokeWidth: 4 }) + path(`M${o.x - r0 * 0.3},${o.y - r0 * 0.3} L${o.x},${o.y + r0 * 0.6} L${o.x + r0 * 0.3},${o.y - r0 * 0.3}Z`, { fill: '#ff3a4a', opacity: 0.8 }) + path(`M${o.x},${o.y} L${o.x},${o.y - r0 * 0.6} M${o.x},${o.y} L${o.x + r0 * 0.4},${o.y}`, { stroke: '#fff', strokeWidth: 4 }); },
    // glowing gold-violet energy core / ore slabs as set pieces
    core: (W, H, o) => { const r0 = o.r || 40; return glow(o.x, o.y, r0 * 2.6, '#c58aff', 0.6) + poly(Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2 + 0.3; return [o.x + Math.cos(a) * r0, o.y + Math.sin(a) * r0 * 0.9]; }), { fill: '#b88aff', stroke: '#ffd45a', strokeWidth: 4 }) + path(`M${o.x - r0 * 0.4},${o.y - r0 * 0.3} l${r0 * 0.3},${r0 * 0.5} l${r0 * 0.4},-${r0 * 0.6}`, { stroke: '#fff4c0', strokeWidth: 3, fill: 'none' }); },
    oreSlabs: (W, H, o) => { const r = rng('os' + o.x); let s = ''; for (let i = 0; i < (o.n || 6); i++) { const x = o.x + (r() - 0.5) * (o.w || 200), y = o.y + (r() - 0.5) * 40, z = 30 + r() * 30; s += poly([[x, y], [x + z, y - z * 0.4], [x + z * 1.3, y + z * 0.3], [x + z * 0.2, y + z * 0.5]], { fill: '#16151b', stroke: INK, strokeWidth: 2 }) + path(`M${x + 6},${y + 4} l${z * 0.8},-${z * 0.2}`, { stroke: '#ff8a3a', strokeWidth: 2, opacity: 0.7 }); } return s; },
    // molten black ore poured over the blade on the anvil (ch.25 L80)
    moltenOre: (W, H, o) => path(`M${o.x1},${o.y1} C${o.x1 + 60},${o.y1 + 40} ${o.x2 - 60},${o.y2 - 20} ${o.x2},${o.y2}`, { stroke: '#1a1018', strokeWidth: o.w || 40, strokeLinecap: 'round', fill: 'none' }) + path(`M${o.x1},${o.y1} C${o.x1 + 60},${o.y1 + 40} ${o.x2 - 60},${o.y2 - 20} ${o.x2},${o.y2}`, { stroke: '#ff8a3a', strokeWidth: (o.w || 40) * 0.25, strokeLinecap: 'round', fill: 'none', strokeDasharray: '20 16' }) + glow(o.x2, o.y2, (o.w || 40) * 3, '#ffb04a', 0.5),
    // pale white ash-fire (Cinder Apostle)
    paleFire: (W, H, o) => { const w = o.w || 120, h0 = o.h || 200; return glow(o.x, o.y - h0 * 0.4, w * 1.4, '#f2f6ff', 0.4) + path(`M${o.x - w / 2},${o.y} C${o.x - w / 2},${o.y - h0 * 0.5} ${o.x - w * 0.1},${o.y - h0 * 0.6} ${o.x},${o.y - h0} C${o.x + w * 0.1},${o.y - h0 * 0.6} ${o.x + w / 2},${o.y - h0 * 0.5} ${o.x + w / 2},${o.y}Z`, { fill: '#f6f8ff', opacity: 0.8, stroke: '#b8c0d8', strokeWidth: 2 }) + path(`M${o.x - w / 4},${o.y} C${o.x - w / 4},${o.y - h0 * 0.3} ${o.x},${o.y - h0 * 0.4} ${o.x},${o.y - h0 * 0.6} C${o.x + w / 8},${o.y - h0 * 0.4} ${o.x + w / 4},${o.y - h0 * 0.3} ${o.x + w / 4},${o.y}Z`, { fill: '#ff8a3a', opacity: 0.7 }); },
    // stone pillars' bronze bell shaking (Nine-Bell alarm, ch.25 L208)
    bellRing: (W, H, o) => { let s = ''; for (let k = 1; k <= 3; k++) s += path(`M${o.x - 40 * k},${o.y - 30 * k} Q${o.x},${o.y - 50 * k} ${o.x + 40 * k},${o.y - 30 * k}`, { stroke: '#ffd45a', strokeWidth: 5, fill: 'none', opacity: 1 - k * 0.25 }); return s + g(path('M-30,30 C-30,-30 30,-30 30,30 L36,40 L-36,40Z', { fill: '#b88a3a', stroke: INK, strokeWidth: 3 }), { transform: `translate(${o.x},${o.y}) rotate(${o.rot || 12})` }); },
  };
  return FX3;
};
