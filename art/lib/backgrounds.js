// Location backgrounds. Each takes (W, H, opts) and returns SVG markup that
// fills the panel. Locations are taken from the source chapters only.
'use strict';
const { INK, rng, path, circle, ellipse, rect, line, poly, g, id, linGrad, radGrad, f } = require('./util');

function grad(W, H, top, bot, extra = '') {
  const gid = id('bg');
  return `<defs>${linGrad(gid, [[0, top], [1, bot]])}</defs>` + rect(0, 0, W, H, { fill: `url(#${gid})` }) + extra;
}
function glow(x, y, r, c, a = 0.6) {
  const gid = id('gl');
  return `<defs>${radGrad(gid, [[0, c, a], [1, c, 0]])}</defs>` + circle(x, y, r, { fill: `url(#${gid})` });
}

const BG = {
  // ---------- abstract ----------
  black: (W, H) => rect(0, 0, W, H, { fill: '#07060a' }),
  white: (W, H) => rect(0, 0, W, H, { fill: '#fbfbfd' }),
  flat: (W, H, o) => rect(0, 0, W, H, { fill: o.color || '#222' }),
  gradient: (W, H, o) => grad(W, H, o.top || '#1a1830', o.bot || '#05040a'),
  flash: (W, H, o) => grad(W, H, o.color || '#ffffff', o.color2 || '#ffe9a8') + glow(W / 2, H / 2, Math.max(W, H) * 0.7, '#fff', 0.9),
  memory: (W, H) => grad(W, H, '#f3efe4', '#d8d0bc') + rect(0, 0, W, H, { fill: 'none', stroke: '#b9ae94', strokeWidth: 30, opacity: 0.4 }),
  speed: (W, H, o) => {
    const r = rng('speed' + W + H), c = o.color || '#ffffff';
    let s = rect(0, 0, W, H, { fill: o.bg || '#16141f' });
    const cx = o.cx ?? W / 2, cy = o.cy ?? H / 2;
    for (let i = 0; i < 140; i++) {
      const a = r() * Math.PI * 2, r0 = 120 + r() * 160, r1 = Math.max(W, H);
      s += path(`M${f(cx + Math.cos(a) * r0)},${f(cy + Math.sin(a) * r0)} L${f(cx + Math.cos(a + 0.012) * r1)},${f(cy + Math.sin(a + 0.012) * r1)} L${f(cx + Math.cos(a - 0.012) * r1)},${f(cy + Math.sin(a - 0.012) * r1)}Z`, { fill: c, opacity: 0.25 + r() * 0.5 });
    }
    return s;
  },
  vlines: (W, H, o) => { // vertical speed lines (falling)
    const r = rng('vl' + H);
    let s = rect(0, 0, W, H, { fill: o.bg || '#0b0a12' });
    for (let i = 0; i < 70; i++) { const x = r() * W; s += rect(x, r() * H * 0.5 - H * 0.2, 1 + r() * 3, H * (0.4 + r() * 0.6), { fill: o.color || '#9aa0b8', opacity: 0.15 + r() * 0.4 }); }
    return s;
  },

  // ---------- Solaris / Aegis Gate ----------
  aegisHall: (W, H, o) => {
    const red = o.red;
    let s = grad(W, H, red ? '#3a0a10' : '#fffdf6', red ? '#1a0508' : '#e7e3d6');
    const horizon = H * (o.horizon ?? 0.55);
    // dome ribs
    for (let i = -6; i <= 6; i++) s += path(`M${W / 2 + i * 30},${-20} Q${W / 2 + i * 120},${horizon * 0.5} ${W / 2 + i * 210},${horizon}`, { stroke: red ? '#5a1a20' : '#d9d2bd', strokeWidth: 4, fill: 'none' });
    // columns
    for (let i = 0; i < 8; i++) {
      const x = (i / 7) * W, w = 34 + Math.abs(i - 3.5) * 10;
      s += rect(x - w / 2, horizon * 0.25, w, horizon * 0.8, { fill: red ? '#4a1016' : '#f4f1e8', stroke: red ? '#2a0508' : '#cfc6ae', strokeWidth: 2 });
      s += rect(x - w / 2 + 4, horizon * 0.25, 6, horizon * 0.8, { fill: '#fff', opacity: red ? 0.05 : 0.6 });
    }
    // floor
    s += rect(0, horizon, W, H - horizon, { fill: red ? '#2a080c' : '#efece3' });
    for (let i = -10; i <= 10; i++) s += line([W / 2 + i * 20, horizon], [W / 2 + i * 160, H], { stroke: red ? '#4a1016' : '#ddd6c2', strokeWidth: 2 });
    for (let k = 1; k < 6; k++) { const y = horizon + (H - horizon) * Math.pow(k / 6, 1.6); s += line([0, y], [W, y], { stroke: red ? '#4a1016' : '#ddd6c2', strokeWidth: 2 }); }
    // glowing guide lines
    for (const dx of [-140, 140]) s += path(`M${W / 2 + dx * 0.15},${horizon} L${W / 2 + dx * 1.6},${H}`, { stroke: red ? '#ff3a3a' : '#9ad8ff', strokeWidth: 5, opacity: 0.8 });
    s += red ? glow(W * 0.2, 40, 260, '#ff2a2a', 0.55) + glow(W * 0.85, 60, 220, '#ff2a2a', 0.45) : glow(W / 2, 0, W * 0.7, '#fff6d8', 0.9);
    if (red) for (let i = 0; i < 3; i++) s += path(`M${W * (0.2 + i * 0.3)},0 L${W * (0.05 + i * 0.3)},${H} L${W * (0.25 + i * 0.3)},${H}Z`, { fill: '#ff2a2a', opacity: 0.12 });
    if (o.crowd) s += crowd(W, horizon, H, red);
    if (o.banner && !red) s += rect(W * 0.3, horizon * 0.12, W * 0.4, horizon * 0.22, { fill: '#e3a82b', opacity: 0.18 }) + circle(W / 2, horizon * 0.23, 30, { fill: 'none', stroke: '#e3a82b', strokeWidth: 6 }) + circle(W / 2, horizon * 0.23, 14, { fill: '#e3a82b' });
    return s;
  },
  aegisExterior: (W, H) => {
    let s = grad(W, H, '#bfe3ff', '#fffaf0');
    s += glow(W * 0.8, H * 0.1, 220, '#fffbe0', 0.9);
    for (let i = 0; i < 9; i++) { const x = i * 100 - 20, h = 200 + (i % 3) * 140; s += rect(x, H - h, 80, h, { fill: '#f6f7fb', stroke: '#cfd6e2', strokeWidth: 2 }) + rect(x + 10, H - h + 20, 60, h, { fill: '#dbe9f6', opacity: 0.6 }); }
    s += path(`M${W * 0.2},${H} L${W * 0.3},${H * 0.25} Q${W / 2},${H * 0.05} ${W * 0.7},${H * 0.25} L${W * 0.8},${H}Z`, { fill: '#fdfcf8', stroke: '#c9c1a8', strokeWidth: 3 });
    s += rect(W * 0.32, H * 0.3, W * 0.36, H * 0.16, { fill: '#e3a82b', opacity: 0.25, stroke: '#c9951a', strokeWidth: 3 });
    s += circle(W / 2, H * 0.38, 26, { fill: 'none', stroke: '#e3a82b', strokeWidth: 6 }) + circle(W / 2, H * 0.38, 12, { fill: '#e3a82b' });
    return s;
  },
  crystal: (W, H, o) => {
    const state = o.state || 'white';
    let s = BG.aegisHall(W, H, { red: state !== 'white', horizon: 0.8 });
    const cx = o.cx ?? W / 2, top = H * 0.08, bot = H * 0.95, w = o.w || 120;
    const fill = state === 'white' ? '#eef8ff' : '#0a0710';
    if (state === 'white') s += glow(cx, H * 0.45, 260, '#d8f3ff', 0.85);
    else s += glow(cx, H * 0.45, 260, '#5a0aff', 0.25);
    s += poly([[cx - w / 2, top + 30], [cx, top], [cx + w / 2, top + 30], [cx + w / 2, bot - 30], [cx, bot], [cx - w / 2, bot - 30]], { fill, stroke: INK, strokeWidth: 4 });
    s += poly([[cx - w / 2 + 10, top + 34], [cx - 10, top + 12], [cx - 10, bot - 14], [cx - w / 2 + 10, bot - 34]], { fill: '#fff', opacity: state === 'white' ? 0.5 : 0.06 });
    if (state === 'ink') s += path(`M${cx - 20},${H * 0.6} C${cx - 60},${H * 0.4} ${cx + 30},${H * 0.3} ${cx + 10},${H * 0.15} C${cx + 50},${H * 0.4} ${cx - 10},${H * 0.6} ${cx + 30},${H * 0.75}`, { stroke: '#000', strokeWidth: 30, fill: 'none', opacity: 0.8 });
    if (state === 'cracked') s += path(`M${cx - 10},${H * 0.3} l18,30 l-14,24 l22,36 l-10,30 M${cx + 8},${H * 0.42} l-26,18 l10,30`, { stroke: '#d0b8ff', strokeWidth: 3, fill: 'none' });
    return s;
  },
  testPlatform: (W, H) => {
    let s = BG.aegisHall(W, H, { horizon: 0.5 });
    s += ellipse(W / 2, H * 0.82, W * 0.46, H * 0.12, { fill: '#e4dfcf', stroke: '#b9b09a', strokeWidth: 4 });
    s += ellipse(W / 2, H * 0.82, W * 0.4, H * 0.09, { fill: 'none', stroke: '#9ad8ff', strokeWidth: 4, strokeDasharray: '20 10' });
    s += ellipse(W / 2, H * 0.82, W * 0.3, H * 0.06, { fill: 'none', stroke: '#e3a82b', strokeWidth: 3 });
    return s;
  },
  // ---------- chute / descent ----------
  chute: (W, H, o) => {
    let s = grad(W, H, '#1d1c26', '#06050a');
    const cx = W / 2, cy = o.view === 'up' ? -H * 0.4 : H * 1.3;
    for (let i = 1; i < 14; i++) {
      const r = i * 70;
      s += ellipse(cx, cy, r * 1.2, r * 0.9, { fill: 'none', stroke: '#3a3946', strokeWidth: 6 - i * 0.3, opacity: 0.8 });
    }
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; s += line([cx, cy], [cx + Math.cos(a) * 2000, cy + Math.sin(a) * 2000], { stroke: '#2a2934', strokeWidth: 8 }); }
    const r = rng('pipes' + H);
    for (let i = 0; i < 6; i++) {
      const y = r() * H, x = r() < 0.5 ? 0 : W * 0.6;
      s += rect(x, y, W * 0.4, 26, { fill: '#4a4652', stroke: INK, strokeWidth: 3 }) + rect(x, y + 4, W * 0.4, 5, { fill: '#7a7584', opacity: 0.6 });
    }
    if (o.lightBelow) s += glow(W / 2, H * 1.05, W * 0.8, '#ff2a6a', 0.55) + glow(W * 0.3, H * 1.1, W * 0.5, '#8a2aff', 0.45);
    if (o.lightAbove) s += glow(W / 2, -40, W * 0.5, '#ffffff', 0.7);
    return s;
  },
  chuteDoor: (W, H) => {
    let s = grad(W, H, '#2c2b34', '#121118');
    s += rect(0, H * 0.58, W, H * 0.42, { fill: '#1a1920' });
    for (let i = 0; i < 10; i++) s += line([i * 90, H * 0.58], [i * 90 - 100, H], { stroke: '#2e2d36', strokeWidth: 3 });
    s += rect(W * 0.18, H * 0.12, W * 0.64, H * 0.62, { fill: '#0a090e', stroke: '#5a5864', strokeWidth: 10 });
    s += rect(W * 0.18, H * 0.12, W * 0.12, H * 0.62, { fill: '#4a4854', stroke: INK, strokeWidth: 4 }) + rect(W * 0.7, H * 0.12, W * 0.12, H * 0.62, { fill: '#4a4854', stroke: INK, strokeWidth: 4 });
    for (let i = 0; i < 6; i++) s += rect(W * 0.18, H * 0.14 + i * 34, W * 0.12, 8, { fill: '#e8c040', opacity: 0.8 }) + rect(W * 0.7, H * 0.14 + i * 34, W * 0.12, 8, { fill: '#e8c040', opacity: 0.8 });
    s += glow(W / 2, H * 0.4, 200, '#3a2a5a', 0.4);
    return s;
  },
  necroAerial: (W, H, o) => {
    let s = grad(W, H, '#120a1c', '#2a0a20');
    // rock ceiling
    s += path(`M0,0 L${W},0 L${W},${H * 0.12} Q${W * 0.7},${H * 0.2} ${W * 0.5},${H * 0.1} Q${W * 0.3},${H * 0.18} 0,${H * 0.1}Z`, { fill: '#1b1620', stroke: INK, strokeWidth: 4 });
    if (o.chute !== false) s += rect(W * 0.46, 0, W * 0.08, H * 0.14, { fill: '#0a080e', stroke: '#4a4452', strokeWidth: 4 });
    const r = rng('city');
    // buildings stacked
    for (let layer = 0; layer < 3; layer++) {
      const base = H * (0.55 + layer * 0.15);
      for (let i = 0; i < 12; i++) {
        const w = 60 + r() * 80, x = r() * W - 40, h = 80 + r() * 200;
        const c = ['#2a1e34', '#22182a', '#1a1220'][layer];
        s += rect(x, base - h, w, h + 200, { fill: c, stroke: '#0a060e', strokeWidth: 3 });
        for (let k = 0; k < 4; k++) if (r() < 0.6) s += rect(x + 8 + r() * (w - 24), base - h + 12 + r() * (h - 20), 10, 6, { fill: r() < 0.5 ? '#ff3a6a' : '#b04aff', opacity: 0.85 });
      }
      s += glow(r() * W, base, 160, r() < 0.5 ? '#ff2a5a' : '#8a2aff', 0.35);
    }
    if (o.sign !== false) {
      const x = o.signX ?? W * 0.5, y = o.signY ?? H * 0.78;
      s += rect(x - 90, y - 70, 180, 140, { fill: '#2a2026', stroke: INK, strokeWidth: 4 }) + path(`M${x - 100},${y - 70} L${x},${y - 110} L${x + 100},${y - 70}Z`, { fill: '#6a6a72', stroke: INK, strokeWidth: 3 });
      s += glow(x, y - 40, 110, '#ff2a3a', 0.55) + `<text x="${x}" y="${y - 30}" text-anchor="middle" font-family="Kanit, Arial, sans-serif" font-weight="800" font-size="30" fill="#ff4a5a" stroke="#4a0008" stroke-width="1">DEAD<tspan fill="#5a1a22">-</tspan>END</text>`;
    }
    return s;
  },
  // ---------- Dead-End shop ----------
  deadend: (W, H, o) => {
    const fl = H * (o.floor ?? 0.72);
    let s = grad(W, fl, '#2a1f24', '#3b2a2a');
    // wall planks + metal sheets
    for (let i = 0; i < 12; i++) s += rect(i * 70, 0, 68, fl, { fill: i % 3 === 0 ? '#3e3036' : '#33272c', stroke: '#1d1418', strokeWidth: 2 });
    for (let i = 0; i < 4; i++) s += rect(W * (0.05 + i * 0.25), fl * 0.25, 30, 30, { fill: '#5a4a44', opacity: 0.4 });
    // counter
    if (o.counter !== false) s += rect(W * 0.55, fl - 120, W * 0.5, 120, { fill: '#5a3e2c', stroke: INK, strokeWidth: 3 }) + rect(W * 0.55, fl - 128, W * 0.5, 14, { fill: '#7a5a40', stroke: INK, strokeWidth: 3 }) + rect(W * 0.6, fl - 230, 80, 60, { fill: '#2a2a30', stroke: INK, strokeWidth: 3 }) + circle(W * 0.6 + 22, fl - 200, 12, { fill: '#555', stroke: INK, strokeWidth: 2 });
    // shelves
    s += rect(W * 0.05, fl * 0.2, W * 0.32, 10, { fill: '#5a3e2c', stroke: INK, strokeWidth: 2 }) + rect(W * 0.05, fl * 0.45, W * 0.32, 10, { fill: '#5a3e2c', stroke: INK, strokeWidth: 2 });
    const r = rng('shelf');
    for (let i = 0; i < 8; i++) s += rect(W * 0.06 + i * 30, fl * 0.2 - 30 - r() * 20, 22, 30 + r() * 20, { fill: ['#4a6a5a', '#7a4a3a', '#5a5a7a', '#8a7a4a'][i % 4], stroke: INK, strokeWidth: 2 });
    // floor
    s += rect(0, fl, W, H - fl, { fill: '#3a2a22' });
    for (let i = 0; i < 9; i++) s += line([0, fl + i * 24], [W, fl + i * 24], { stroke: '#2a1c16', strokeWidth: 2 });
    if (o.sofa) s += rect(W * 0.04, fl - 70, 220, 70, { fill: '#5a2a30', stroke: INK, strokeWidth: 3, rx: 10 }) + rect(W * 0.04, fl - 110, 220, 50, { fill: '#6a3a40', stroke: INK, strokeWidth: 3, rx: 10 });
    if (o.table) s += rect(W * 0.3, fl - 50, 200, 14, { fill: '#6a4a34', stroke: INK, strokeWidth: 3 }) + rect(W * 0.32, fl - 36, 10, 50, { fill: '#4a3424' }) + rect(W * 0.3 + 180, fl - 36, 10, 50, { fill: '#4a3424' }) + (o.tape ? rect(W * 0.32 - 2, fl - 26, 14, 12, { fill: '#c9b98a' }) : '');
    if (o.brokenTable) s += path(`M${W * 0.3},${fl + 10} L${W * 0.42},${fl - 30} L${W * 0.46},${fl + 4}Z M${W * 0.5},${fl + 6} L${W * 0.56},${fl - 26} L${W * 0.66},${fl + 10}Z`, { fill: '#6a4a34', stroke: INK, strokeWidth: 3 }) + path(`M${W * 0.2},${fl + 30} l60,10 l30,-20 l40,30 M${W * 0.5},${fl + 40} l40,-8`, { stroke: '#1a100c', strokeWidth: 2, fill: 'none' });
    if (o.radio) s += rect(W * 0.8, fl - 170, 70, 40, { fill: '#7a5a40', stroke: INK, strokeWidth: 3, rx: 6 }) + circle(W * 0.8 + 20, fl - 150, 10, { fill: '#3a2a20' });
    // red neon spill
    s += glow(W * 0.15, fl * 0.3, 260, '#ff2a3a', 0.25);
    if (o.door) s += rect(W * 0.02, fl - 260, 130, 260, { fill: o.door === 'blown' ? '#ff6a2a' : '#4a4a52', stroke: INK, strokeWidth: 4, opacity: o.door === 'blown' ? 0.6 : 1 });
    if (o.hole) s += path(`M${W * 0.3},0 L${W * 0.36},${H * 0.06} L${W * 0.48},${H * 0.03} L${W * 0.58},${H * 0.08} L${W * 0.7},0Z`, { fill: '#ff2a4a', opacity: 0.55 }) + path(`M${W * 0.3},0 L${W * 0.4},${fl} L${W * 0.62},${fl} L${W * 0.7},0Z`, { fill: '#ff3a5a', opacity: 0.12 });
    if (o.holo) s += holoMap(W / 2, fl - 120, 260, 120);
    if (o.dark) s += rect(0, 0, W, H, { fill: '#05030a', opacity: 0.55 });
    return s;
  },
  lab: (W, H, o) => {
    const fl = H * (o.floor ?? 0.74);
    let s = grad(W, fl, '#0c1f18', '#123026');
    for (let i = 0; i < 8; i++) s += rect(i * 110, 0, 108, fl, { fill: '#10261e', stroke: '#081812', strokeWidth: 2 });
    // tanks
    const tanks = o.tanks ?? 3;
    for (let i = 0; i < tanks; i++) {
      const x = W * (0.08 + i * 0.3), w = 90, top = fl * 0.12, h = fl * 0.72;
      s += rect(x, top, w, h, { fill: '#9fffd6', opacity: 0.16, stroke: '#4adfa0', strokeWidth: 3, rx: 40 });
      s += path(`M${x + 20},${top + h - 20} C${x + 40},${top + h * 0.6} ${x + 10},${top + h * 0.4} ${x + 50},${top + 40} M${x + 60},${top + h - 30} C${x + 70},${top + h * 0.5} ${x + 40},${top + h * 0.3} ${x + 70},${top + 60}`, { stroke: i % 2 ? '#ff6a6a' : '#fff', strokeWidth: 4, fill: 'none', opacity: 0.8 });
      s += rect(x - 6, top - 14, w + 12, 18, { fill: '#3a4a44', stroke: INK, strokeWidth: 3 }) + rect(x - 6, top + h - 4, w + 12, 18, { fill: '#3a4a44', stroke: INK, strokeWidth: 3 });
    }
    s += rect(0, fl, W, H - fl, { fill: '#18221e' });
    for (let i = 0; i < 12; i++) s += line([i * 80, fl], [i * 80 - 60, H], { stroke: '#22302a', strokeWidth: 2 });
    // tubes on ceiling
    for (let i = 0; i < 4; i++) s += rect(W * (0.1 + i * 0.24), 8, 120, 8, { fill: '#b8ffd8', opacity: 0.9 }) + glow(W * (0.1 + i * 0.24) + 60, 12, 140, '#7affb8', 0.25);
    if (o.holo) s += holoPanel(W * 0.62, fl * 0.15, W * 0.32, fl * 0.38, '#4affb0');
    if (o.table !== false) s += rect(W * 0.25, fl - 10, W * 0.5, 18, { fill: '#b9c2c0', stroke: INK, strokeWidth: 3 }) + rect(W * 0.28, fl + 8, 12, 60, { fill: '#7a8482' }) + rect(W * 0.7, fl + 8, 12, 60, { fill: '#7a8482' });
    if (o.chair) s += rect(W * 0.62, fl - 120, 70, 110, { fill: '#2a3a34', stroke: INK, strokeWidth: 3, rx: 10 }) + rect(W * 0.6, fl - 20, 110, 20, { fill: '#2a3a34', stroke: INK, strokeWidth: 3 });
    if (o.wrecked) s += path(`M0,${fl + 20} L${W * 0.2},${fl - 40} L${W * 0.3},${fl + 30} L${W * 0.5},${fl - 30} L${W * 0.6},${fl + 40} L${W},${fl - 20} L${W},${H} L0,${H}Z`, { fill: '#3a3a3a', stroke: INK, strokeWidth: 3, opacity: 0.85 }) + path(`M${W * 0.35},0 L${W * 0.4},${H * 0.12} L${W * 0.6},${H * 0.1} L${W * 0.66},0Z`, { fill: '#ff4a3a', opacity: 0.35 });
    return s;
  },
  stairs: (W, H) => {
    let s = grad(W, H, '#0c1a14', '#050a08');
    for (let i = 0; i < 9; i++) s += poly([[W * 0.2 + i * 40, H * 0.15 + i * 70], [W * 0.8 + i * 10, H * 0.15 + i * 70], [W * 0.8 + i * 10, H * 0.15 + i * 70 + 16], [W * 0.2 + i * 40, H * 0.15 + i * 70 + 16]], { fill: '#5a3a2a', stroke: INK, strokeWidth: 3 });
    s += line([W * 0.18, H * 0.05], [W * 0.5, H], { stroke: '#7a5a3a', strokeWidth: 6 });
    s += rect(W * 0.3, 0, 140, 10, { fill: '#9fffc8' }) + glow(W * 0.3 + 70, 8, 200, '#4affa0', 0.4);
    s += rect(W * 0.3, H * 0.82, W * 0.5, H * 0.18, { fill: '#3a3a40', stroke: INK, strokeWidth: 4 });
    return s;
  },
  // ---------- transfer yard (ch.4) ----------
  yard: (W, H, o) => {
    let s = grad(W, H, '#0b0d14', '#141a20');
    const fl = H * (o.floor ?? 0.7);
    // giant elevator shaft
    s += rect(W * 0.3, 0, W * 0.4, fl, { fill: '#1a1e26', stroke: '#3a404c', strokeWidth: 6 });
    for (let i = 0; i < 8; i++) s += line([W * 0.3, i * fl / 8], [W * 0.7, i * fl / 8 + 40], { stroke: '#2a303a', strokeWidth: 4 });
    s += rect(0, fl, W, H - fl, { fill: '#2a2e34' });
    for (let i = 0; i < 10; i++) s += line([i * 90, fl], [i * 90 - 80, H], { stroke: '#22262c', strokeWidth: 2 });
    // containers
    if (o.containers !== false) {
      const cs = [[W * 0.08, '#e9edf2', '#7cc4ef'], [W * 0.42, '#f2f4f7', '#7cc4ef'], [W * 0.72, '#c9ced6', '#5a6a7a']];
      for (const [x, c, st] of cs) s += rect(x, fl - 120, 190, 120, { fill: c, stroke: INK, strokeWidth: 3 }) + rect(x, fl - 120, 190, 18, { fill: st }) + path(Array.from({ length: 8 }, (_, i) => `M${x + 20 + i * 22},${fl - 96} L${x + 20 + i * 22},${fl - 6}`).join(' '), { stroke: '#aab2bd', strokeWidth: 2 });
    }
    // spotlights
    for (const x of [W * 0.15, W * 0.85]) s += path(`M${x},0 L${x - 180},${fl + 40} L${x + 120},${fl + 40}Z`, { fill: '#f6fbff', opacity: 0.1 }) + circle(x, 10, 14, { fill: '#fff' });
    s += glow(W / 2, fl, 300, '#e9f6ff', 0.2);
    // junk + green smoke at edges
    s += path(`M0,${fl + 10} L60,${fl - 60} L110,${fl - 20} L150,${fl - 80} L200,${fl + 10}Z`, { fill: '#2a2620', stroke: INK, strokeWidth: 3 }) + glow(80, fl - 40, 120, '#7aff9a', 0.18);
    if (o.turrets) for (const x of [W * 0.35, W * 0.66]) s += turret(x, fl - 130);
    if (o.drain) s += ellipse(W * 0.9, fl + 30, 50, 20, { fill: '#0a0a0e', stroke: '#4a4a52', strokeWidth: 4 });
    return s;
  },
  overlook: (W, H) => {
    let s = BG.yard(W, H, { floor: 0.82 });
    s += rect(0, 0, W, H, { fill: '#000', opacity: 0.25 });
    s += path(`M0,${H * 0.6} L${W * 0.2},${H * 0.5} L${W * 0.35},${H * 0.62} L${W * 0.55},${H * 0.55} L${W * 0.75},${H * 0.64} L${W},${H * 0.58} L${W},${H} L0,${H}Z`, { fill: '#2e2a26', stroke: INK, strokeWidth: 4 });
    for (let i = 0; i < 6; i++) s += rect(i * 140, H * 0.6 + (i % 2) * 20, 120, 40, { fill: '#6a6870', stroke: INK, strokeWidth: 3, rx: 8 }) + path(`M${i * 140 + 10},${H * 0.6 + (i % 2) * 20 + 10} h100 M${i * 140 + 10},${H * 0.6 + (i % 2) * 20 + 22} h100`, { stroke: '#4a4850', strokeWidth: 3 });
    s += rect(W * 0.3, 0, 300, 70, { fill: '#2a2a30', stroke: INK, strokeWidth: 3 }) + circle(W * 0.3 + 150, 35, 30, { fill: 'none', stroke: '#4a4a52', strokeWidth: 6 });
    return s;
  },
  commandRoom: (W, H, o) => {
    let s = grad(W, H, '#f7fbff', '#dfe8f2');
    const fl = H * 0.72;
    for (let i = 0; i < 6; i++) s += rect(i * 140, 0, 6, fl, { fill: '#cfd9e6' });
    s += rect(0, fl, W, H - fl, { fill: '#e6edf6' });
    s += rect(W * 0.05, H * 0.08, W * 0.9, fl * 0.45, { fill: '#cfe6ff', opacity: 0.5, stroke: '#a9c6e8', strokeWidth: 3 });
    for (let i = 0; i < 7; i++) s += rect(W * 0.08 + i * 100, H * 0.12, 60, fl * 0.35, { fill: '#fff', opacity: 0.5 });
    s += ellipse(W / 2, fl + 30, W * 0.38, 50, { fill: '#f4f8fc', stroke: '#b9c8da', strokeWidth: 4 });
    if (o.holo !== false) s += holoPanel(W * 0.22, fl * 0.32, W * 0.56, fl * 0.55, '#7ad8ff');
    return s;
  },
  // ---------- tunnel (ch.5) ----------
  tunnel: (W, H, o) => {
    let s = grad(W, H, '#0c1014', '#141a1e');
    const cx = W * (o.vx ?? 0.5), cy = H * (o.vy ?? 0.45);
    for (let i = 6; i >= 1; i--) {
      const k = i / 6, w = W * 1.4 * k, h = H * 1.1 * k;
      s += path(`M${cx - w / 2},${cy + h / 2} L${cx - w / 2},${cy - h * 0.1} Q${cx},${cy - h * 0.75} ${cx + w / 2},${cy - h * 0.1} L${cx + w / 2},${cy + h / 2}`, { fill: 'none', stroke: i % 2 ? '#26303a' : '#1e262e', strokeWidth: 26 * k + 4 });
      if (i % 2 && i < 6) s += rect(cx - 30 * k, cy - h * 0.55, 60 * k, 8 * k, { fill: i === 3 ? '#ff5ad0' : '#4affe0', opacity: o.dark ? 0.2 : 0.9 }) + glow(cx, cy - h * 0.52, 120 * k, i === 3 ? '#ff5ad0' : '#4affe0', 0.25);
    }
    s += path(`M0,${H} L${cx - 40},${cy + 40} L${cx + 40},${cy + 40} L${W},${H}Z`, { fill: '#1a2024' });
    const r = rng('puddle' + H);
    for (let i = 0; i < 5; i++) s += ellipse(r() * W, cy + 80 + r() * (H - cy - 80), 60 + r() * 60, 10 + r() * 8, { fill: '#4affe0', opacity: 0.08 });
    s += path(`M0,${H * 0.12} Q${W / 2},${H * 0.02} ${W},${H * 0.12}`, { stroke: '#5a3a2a', strokeWidth: 26, fill: 'none' }) + path(`M0,${H * 0.12} Q${W / 2},${H * 0.02} ${W},${H * 0.12}`, { stroke: '#7a5a3a', strokeWidth: 6, fill: 'none', opacity: 0.6 });
    for (const x of [W * 0.05, W * 0.92]) s += rect(x, 0, 20, H, { fill: '#4a3a30', stroke: INK, strokeWidth: 3 });
    if (o.dark) s += rect(0, 0, W, H, { fill: '#000', opacity: 0.4 });
    return s;
  },
  // ---------- zone 3: door, clinic ----------
  oakDoor: (W, H, o) => {
    let s = grad(W, H, '#1a2a2a', '#0c1414');
    for (let i = 0; i < 8; i++) s += rect(i * 110, 0, 108, H, { fill: '#3a3e40', stroke: '#2a2e30', strokeWidth: 2 });
    s += glow(W * 0.2, H * 0.1, 220, '#3affd0', 0.25);
    const dx = W * (o.dx ?? 0.5);
    s += rect(dx - 150, H * 0.12, 300, H * 0.72, { fill: '#5a3a1e', stroke: INK, strokeWidth: 6 });
    s += path(`M${dx - 150},${H * 0.12} Q${dx},${H * 0.0} ${dx + 150},${H * 0.12}`, { fill: '#6a4626', stroke: INK, strokeWidth: 5 });
    if (o.open) s += rect(dx - 120, H * 0.16, 240, H * 0.68, { fill: '#0e3a3a' }) + glow(dx, H * 0.5, 200, '#3ad0c0', 0.5) + rect(dx + 80, H * 0.16, 40, H * 0.68, { fill: '#6a4626', stroke: INK, strokeWidth: 3 });
    else {
      s += rect(dx - 120, H * 0.16, 110, H * 0.68, { fill: '#7a5230', stroke: INK, strokeWidth: 4 }) + rect(dx + 10, H * 0.16, 110, H * 0.68, { fill: '#7a5230', stroke: INK, strokeWidth: 4 });
      for (const x of [dx - 100, dx + 30]) s += rect(x, H * 0.22, 70, H * 0.24, { fill: 'none', stroke: '#4a2e16', strokeWidth: 4 }) + rect(x, H * 0.52, 70, H * 0.26, { fill: 'none', stroke: '#4a2e16', strokeWidth: 4 });
      if (o.cracked) s += path(`M${dx - 80},${H * 0.2} l30,60 l-20,40 l40,80 M${dx + 60},${H * 0.3} l-20,50 l30,40`, { stroke: '#ff9cf2', strokeWidth: 4, fill: 'none' });
    }
    s += circle(dx, H * 0.08, 18, { fill: '#e5bd4a', stroke: INK, strokeWidth: 3 }) + glow(dx, H * 0.08, 90, '#ffd27a', 0.6);
    s += rect(0, H * 0.84, W, H * 0.16, { fill: '#202426' });
    s += path(`M${dx - 170},${H * 0.9} L${dx + 170},${H * 0.9} L${dx + 200},${H} L${dx - 200},${H}Z`, { fill: '#8a1a26', stroke: INK, strokeWidth: 3 });
    s += line([dx - 150, H * 0.85], [dx + 150, H * 0.85], { stroke: '#e5bd4a', strokeWidth: 4, strokeDasharray: '12 8' });
    return s;
  },
  clinicHall: (W, H) => {
    let s = grad(W, H, '#0e2a2e', '#081a1c');
    const cx = W / 2, cy = H * 0.45;
    for (let i = -6; i <= 6; i++) s += line([cx + i * 6, cy], [cx + i * 160, H], { stroke: '#1a4a4e', strokeWidth: 2 });
    for (let i = -4; i <= 4; i++) s += line([cx + i * 6, cy], [cx + i * 200, 0], { stroke: '#123a3e', strokeWidth: 2 });
    s += rect(cx - 60, cy - 80, 120, 140, { fill: '#2a6a6a', opacity: 0.4 });
    for (let k = 1; k < 7; k++) { const t = k / 7; s += rect(cx - W * t * 0.9, cy - 80 * (1 + t * 4), 10 * t + 2, 140 * (1 + t * 3.5), { fill: '#3a8a86', opacity: 0.4 }) + rect(cx + W * t * 0.9, cy - 80 * (1 + t * 4), 10 * t + 2, 140 * (1 + t * 3.5), { fill: '#3a8a86', opacity: 0.4 }); }
    return s;
  },
  surgery: (W, H, o) => {
    const fl = H * 0.74;
    let s = grad(W, fl, '#0e2a2a', '#123432');
    for (let i = 0; i < 6; i++) s += path(`M${i * 150},0 Q${i * 150 + 30},${fl / 2} ${i * 150},${fl}`, { stroke: '#0a3a2a', strokeWidth: 60, fill: 'none', opacity: 0.8 });
    s += rect(0, fl, W, H - fl, { fill: '#1a2a28' });
    for (let i = 0; i < 4; i++) { const x = W * (0.2 + i * 0.2); s += line([x, 0], [x, 50], { stroke: '#666', strokeWidth: 4 }) + ellipse(x, 60, 36, 14, { fill: '#f6fbff', stroke: INK, strokeWidth: 3 }) + path(`M${x - 30},66 L${x - 120},${fl} L${x + 120},${fl} L${x + 30},66Z`, { fill: '#e9fff8', opacity: 0.06 }); }
    if (o.bed !== false) s += rect(W * 0.45, fl - 40, W * 0.5, 22, { fill: '#c9d2d0', stroke: INK, strokeWidth: 3 }) + rect(W * 0.5, fl - 18, 10, 60, { fill: '#7a8482' }) + rect(W * 0.88, fl - 18, 10, 60, { fill: '#7a8482' });
    if (o.monitor) s += holoPanel(W * 0.05, fl * 0.15, W * 0.36, fl * 0.36, '#4affd0');
    return s;
  },
  // ---------- zone 4 market ----------
  market: (W, H, o) => {
    let s = grad(W, H, '#14181a', '#1e2422');
    const fl = H * (o.floor ?? 0.72);
    for (let i = 0; i < 5; i++) s += line([i * 200, 0], [i * 200 + 60, fl], { stroke: '#2a2e30', strokeWidth: 16 }) + line([i * 200 + 200, 0], [i * 200 + 60, fl], { stroke: '#2a2e30', strokeWidth: 10 });
    s += path(`M0,${fl * 0.5} L${W * 0.15},${fl * 0.2} L${W * 0.3},${fl * 0.45} L${W * 0.45},${fl * 0.1} L${W * 0.62},${fl * 0.4} L${W * 0.8},${fl * 0.15} L${W},${fl * 0.42} L${W},${fl} L0,${fl}Z`, { fill: '#2c2a26', stroke: INK, strokeWidth: 3 });
    const r = rng('junk');
    for (let i = 0; i < 30; i++) s += rect(r() * W, fl * (0.2 + r() * 0.6), 20 + r() * 50, 10 + r() * 30, { fill: ['#3a3630', '#4a4438', '#2a2e2a', '#5a4a3a'][i % 4], stroke: '#141210', strokeWidth: 2, transform: `rotate(${f(r() * 40 - 20)} ${f(r() * W)} ${f(fl * 0.5)})` });
    s += glow(W * 0.5, fl * 0.5, W * 0.6, '#5aff8a', 0.12);
    s += rect(0, fl, W, H - fl, { fill: '#26241e' });
    for (let i = 0; i < 6; i++) s += ellipse(r() * W, fl + 20 + r() * (H - fl - 30), 50, 8, { fill: '#5aff8a', opacity: 0.06 });
    if (o.stalls !== false) for (let i = 0; i < 4; i++) { const x = W * (0.02 + i * 0.26); s += rect(x, fl - 110, 170, 110, { fill: '#3a2e26', stroke: INK, strokeWidth: 3 }) + path(`M${x - 10},${fl - 110} L${x + 180},${fl - 110} L${x + 170},${fl - 150} L${x},${fl - 150}Z`, { fill: ['#6a3a2a', '#3a5a4a', '#5a4a6a', '#6a5a2a'][i], stroke: INK, strokeWidth: 3 }) + glow(x + 85, fl - 130, 80, i % 2 ? '#ff2a4a' : '#4aff9a', 0.3); }
    return s;
  },
  ashShop: (W, H, o) => {
    let s = BG.market(W, H, { stalls: false });
    const fl = H * 0.72;
    s += rect(W * 0.12, fl - 300, W * 0.76, 300, { fill: '#3a4a52', stroke: INK, strokeWidth: 5 });
    for (let i = 0; i < 3; i++) s += rect(W * 0.14 + i * W * 0.25, fl - 290, W * 0.23, 280, { fill: '#4a5a62', stroke: INK, strokeWidth: 3 }) + rect(W * 0.18 + i * W * 0.25, fl - 270, W * 0.14, 50, { fill: '#7aa0b0', opacity: 0.4 });
    for (let i = 0; i < 6; i++) { const x = W * 0.16 + i * 100; s += line([x, fl - 300], [x, fl - 250], { stroke: '#888', strokeWidth: 3 }) + path(`M${x},${fl - 250} q-6,10 0,14`, { stroke: '#aaa', strokeWidth: 3, fill: 'none' }) + rect(x - 14, fl - 240, 28, 70, { fill: i % 2 ? '#9aa0aa' : '#c9a28a', stroke: INK, strokeWidth: 2, rx: 10 }); }
    s += rect(W * 0.1, fl - 310, W * 0.8, 14, { fill: '#7affb0' }) + glow(W / 2, fl - 300, 260, '#5aff9a', 0.35);
    s += ellipse(W * 0.75, fl - 10, 70, 30, { fill: '#1a1a1a', stroke: INK, strokeWidth: 3 }) + ellipse(W * 0.75, fl - 30, 70, 30, { fill: '#222', stroke: INK, strokeWidth: 3 });
    if (o.barrel) s += rect(W * 0.18, fl - 100, 70, 100, { fill: '#4a6a3a', stroke: INK, strokeWidth: 3 }) + ellipse(W * 0.18 + 35, fl - 100, 35, 10, { fill: '#9aff6a', opacity: 0.6 });
    return s;
  },
  roof: (W, H) => {
    let s = BG.necroAerial(W, H, { sign: false, chute: false });
    s += path(`M0,${H * 0.62} L${W},${H * 0.5} L${W},${H} L0,${H}Z`, { fill: '#6a6a72', stroke: INK, strokeWidth: 4 });
    for (let i = 0; i < 12; i++) s += line([i * 80, H * 0.62 - i * 9.6], [i * 80 - 40, H], { stroke: '#4a4a52', strokeWidth: 4 });
    s += path(`M${W * 0.35},${H * 0.58} L${W * 0.6},${H * 0.55} L${W * 0.62},${H * 0.7} L${W * 0.37},${H * 0.74}Z`, { fill: '#b9c2c8', stroke: INK, strokeWidth: 3 });
    return s;
  },
  alley: (W, H, o) => {
    let s = grad(W, H, '#120c18', '#0a080e');
    const vx = W * 0.5, vy = H * 0.42;
    s += poly([[0, 0], [vx - 60, vy - 60], [vx - 60, vy + 80], [0, H]], { fill: '#1e1822', stroke: INK, strokeWidth: 3 });
    s += poly([[W, 0], [vx + 60, vy - 60], [vx + 60, vy + 80], [W, H]], { fill: '#1a1420', stroke: INK, strokeWidth: 3 });
    s += poly([[0, H], [vx - 60, vy + 80], [vx + 60, vy + 80], [W, H]], { fill: '#141018' });
    s += rect(W * 0.08, H * 0.2, 120, 40, { fill: '#ff2a5a', opacity: 0.85 }) + glow(W * 0.08 + 60, H * 0.22, 160, '#ff2a5a', 0.35);
    s += rect(W * 0.78, H * 0.3, 90, 30, { fill: '#5affd0', opacity: 0.8 }) + glow(W * 0.82, H * 0.32, 140, '#5affd0', 0.3);
    if (o.fog) s += rect(0, H * 0.5, W, H * 0.5, { fill: '#4a5aa0', opacity: 0.25 });
    return s;
  },
  // ---------- zone 5 ----------
  graveyard: (W, H) => {
    let s = grad(W, H, '#0c1020', '#141a2e');
    s += path(`M${W * 0.55},${H * 0.6} L${W * 0.55},${H * 0.2} L${W * 0.62},${H * 0.12} L${W * 0.66},${H * 0.2} L${W * 0.66},${H * 0.3} L${W * 0.9},${H * 0.3} L${W * 0.9},${H * 0.6}Z`, { fill: '#1a1e2e', stroke: INK, strokeWidth: 3 });
    s += path(`M${W * 0.62},${H * 0.12} l-10,-20 l14,4`, { stroke: '#1a1e2e', strokeWidth: 6, fill: 'none' });
    const r = rng('graves');
    for (let i = 0; i < 16; i++) { const x = r() * W, y = H * (0.6 + r() * 0.35), h = 40 + r() * 50; s += rect(x, y - h, 26, h, { fill: '#5a3a2a', stroke: INK, strokeWidth: 2, transform: `rotate(${f(r() * 16 - 8)} ${f(x)} ${f(y)})` }); }
    s += rect(0, H * 0.45, W, H * 0.55, { fill: '#5a6aa8', opacity: 0.18 });
    s += rect(0, H * 0.7, W, H * 0.3, { fill: '#7a8ac0', opacity: 0.18 });
    return s;
  },
  chapel: (W, H, o) => {
    let s = grad(W, H, '#0a0c16', '#14141e');
    const fl = H * (o.floor ?? 0.72);
    // gothic window with broken stained glass
    s += path(`M${W * 0.36},${fl * 0.7} L${W * 0.36},${fl * 0.28} Q${W / 2},${fl * 0.02} ${W * 0.64},${fl * 0.28} L${W * 0.64},${fl * 0.7}Z`, { fill: '#2a1a3a', stroke: INK, strokeWidth: 5 });
    const cols = ['#8a2a4a', '#2a4a8a', '#8a6a2a', '#4a2a6a'];
    for (let i = 0; i < 12; i++) s += rect(W * 0.38 + (i % 4) * W * 0.065, fl * 0.3 + Math.floor(i / 4) * fl * 0.13, W * 0.06, fl * 0.12, { fill: cols[(i * 7) % 4], opacity: i === 5 || i === 9 ? 0.1 : 0.7 });
    s += path(`M${W * 0.45},${fl * 0.5} L${W * 0.3},${fl} L${W * 0.5},${fl}Z`, { fill: '#ff2a3a', opacity: 0.15 });
    // pillars
    for (const x of [W * 0.12, W * 0.88]) s += rect(x - 30, 0, 60, fl, { fill: '#2a2c38', stroke: INK, strokeWidth: 4 });
    s += rect(0, fl, W, H - fl, { fill: '#1a1a24' });
    for (let i = 0; i < 8; i++) s += line([0, fl + i * 26], [W, fl + i * 26], { stroke: '#22222e', strokeWidth: 2 });
    if (o.altar !== false) s += rect(W * 0.38, fl - 90, W * 0.24, 90, { fill: '#3a3a48', stroke: INK, strokeWidth: 4 }) + rect(W * 0.36, fl - 100, W * 0.28, 14, { fill: '#4a4a5a', stroke: INK, strokeWidth: 3 });
    if (o.pews !== false) for (let i = 0; i < 3; i++) { s += rect(W * 0.02, fl + 20 + i * 40, W * 0.3, 16, { fill: '#4a3424', stroke: INK, strokeWidth: 2 }); s += rect(W * 0.68, fl + 20 + i * 40, W * 0.3, 16, { fill: '#4a3424', stroke: INK, strokeWidth: 2 }); }
    s += rect(0, fl * 0.6, W, H, { fill: '#5a6aa8', opacity: 0.12 });
    if (o.hole) s += path(`M${W * 0.3},0 L${W * 0.7},0 L${W * 0.8},${fl} L${W * 0.2},${fl}Z`, { fill: '#ffe48a', opacity: 0.22 }) + glow(W / 2, fl - 40, 200, '#ff8a2a', 0.6) + path(`M${W * 0.38},${fl - 20} q30,-20 60,0 q30,20 70,-4`, { stroke: '#ffb04a', strokeWidth: 10, fill: 'none' });
    if (o.wrecked) s += path(`M0,${fl + 30} l80,-50 l40,40 l60,-30 l50,50Z M${W},${fl + 20} l-90,-40 l-30,50 l-60,-20 l-30,40Z`, { fill: '#3a3a48', stroke: INK, strokeWidth: 3 });
    return s;
  },
  checkpoint: (W, H) => {
    let s = grad(W, H, '#2a2e34', '#1a1d22');
    s += path(`M0,${H * 0.2} L${W / 2},0 L${W},${H * 0.2}Z`, { fill: '#e9edf2', stroke: INK, strokeWidth: 4 });
    s += rect(0, H * 0.2, W, H * 0.8, { fill: '#d9dfe6', opacity: 0.25 });
    s += holoPanel(W * 0.2, H * 0.25, W * 0.6, H * 0.4, '#7ad8ff');
    const r = rng('rain' + H);
    for (let i = 0; i < 80; i++) { const x = r() * W, y = r() * H; s += line([x, y], [x - 6, y + 30], { stroke: '#9aa3a0', strokeWidth: 2, opacity: 0.5 }); }
    s += rect(0, H * 0.8, W, H * 0.2, { fill: '#3a3e44' });
    return s;
  },
  cctv: (W, H, o) => {
    let s = rect(0, 0, W, H, { fill: '#111' });
    const inner = o.view === 'west'
      ? BG.alley(W, H, {})
      : BG.alley(W, H, { fog: false });
    s += `<g filter="url(#grayF)">${inner}${o.content || ''}</g>`;
    const r = rng('static' + (o.view || ''));
    for (let i = 0; i < 60; i++) s += rect(0, r() * H, W, 1 + r() * 2, { fill: '#fff', opacity: 0.05 + r() * 0.08 });
    s += rect(8, 8, W - 16, H - 16, { fill: 'none', stroke: '#5aff7a', strokeWidth: 3, opacity: 0.5 });
    s += circle(30, 30, 8, { fill: '#ff2a2a' });
    return s;
  },
  blueprint: (W, H) => {
    let s = rect(0, 0, W, H, { fill: '#14325a' });
    for (let i = 0; i < W; i += 40) s += line([i, 0], [i, H], { stroke: '#2a5a8a', strokeWidth: 1 });
    for (let i = 0; i < H; i += 40) s += line([0, i], [W, i], { stroke: '#2a5a8a', strokeWidth: 1 });
    s += rect(W * 0.1, H * 0.15, W * 0.8, H * 0.32, { fill: 'none', stroke: '#cfe6ff', strokeWidth: 4 });
    s += rect(W * 0.1, H * 0.5, W * 0.8, H * 0.32, { fill: 'none', stroke: '#cfe6ff', strokeWidth: 4 });
    s += circle(W * 0.5, H * 0.38, 40, { fill: 'none', stroke: '#ff5a5a', strokeWidth: 5, strokeDasharray: '10 6' });
    s += line([W * 0.12, H * 0.22], [W * 0.88, H * 0.24], { stroke: '#ffd25a', strokeWidth: 4, strokeDasharray: '14 8' });
    s += rect(W * 0.62, H * 0.62, 60, 40, { fill: 'none', stroke: '#7affb0', strokeWidth: 4 });
    for (const x of [0.12, 0.88]) s += rect(W * x - 8, H * 0.15, 16, H * 0.67, { fill: '#cfe6ff', opacity: 0.4 });
    return s;
  },
};

function crowd(W, horizon, H, red) {
  let s = '';
  const r = rng('crowd');
  for (let row = 0; row < 3; row++) {
    const y = horizon + 20 + row * 40, sc = 0.5 + row * 0.25;
    for (let i = 0; i < 14; i++) {
      const x = (i / 13) * W + (r() - 0.5) * 30;
      const c = red ? '#3a1014' : ['#9aa8b8', '#b8a89a', '#a8b89a', '#c8b8c8'][i % 4];
      s += ellipse(x, y - 54 * sc, 14 * sc, 16 * sc, { fill: c, opacity: 0.8 }) + rect(x - 20 * sc, y - 40 * sc, 40 * sc, 70 * sc, { fill: c, opacity: 0.8, rx: 10 * sc });
    }
  }
  return s;
}
function holoPanel(x, y, w, h, c) {
  return rect(x, y, w, h, { fill: c, opacity: 0.12, stroke: c, strokeWidth: 3 }) +
    rect(x + 10, y + 10, w * 0.4, 8, { fill: c, opacity: 0.6 }) + rect(x + 10, y + 26, w * 0.6, 5, { fill: c, opacity: 0.35 }) +
    path(`M${x + 14},${y + h - 20} L${x + w * 0.3},${y + h * 0.5} L${x + w * 0.5},${y + h * 0.7} L${x + w * 0.7},${y + h * 0.35} L${x + w - 14},${y + h * 0.6}`, { stroke: c, strokeWidth: 3, fill: 'none', opacity: 0.8 });
}
function holoMap(cx, cy, w, h) {
  return ellipse(cx, cy + h / 2, w / 2, 20, { fill: '#5affd0', opacity: 0.25 }) + path(`M${cx - w / 2},${cy + h / 2} L${cx},${cy - h / 2} L${cx + w / 2},${cy + h / 2}`, { fill: '#5affd0', opacity: 0.08 }) +
    path(`M${cx - w * 0.3},${cy} L${cx + w * 0.3},${cy - 10} M${cx - w * 0.2},${cy + 20} L${cx + w * 0.25},${cy + 14} M${cx},${cy - h * 0.4} L${cx},${cy + h * 0.4}`, { stroke: '#7affe0', strokeWidth: 4 }) + circle(cx + 30, cy - 4, 8, { fill: '#ff3a4a' });
}
function turret(x, y) {
  return rect(x - 8, y + 30, 16, 100, { fill: '#9aa3b3', stroke: INK, strokeWidth: 3 }) + circle(x, y + 20, 30, { fill: '#eef1f6', stroke: INK, strokeWidth: 4 }) + rect(x - 60, y + 14, 50, 12, { fill: '#4a4f5a', stroke: INK, strokeWidth: 3 }) + circle(x + 6, y + 14, 6, { fill: '#ff3a3a' });
}

Object.assign(BG, require('./backgrounds2')({ grad, glow }));

function background(name, W, H, o = {}) {
  const fn = BG[name];
  if (!fn) throw new Error('unknown background ' + name);
  return fn(W, H, o);
}

module.exports = { background, BG, glow, holoPanel, turret };
