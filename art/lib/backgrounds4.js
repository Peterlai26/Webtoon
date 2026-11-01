// Locations of source chapters 31-45: the Velvet District neon road and the
// old maintenance tram (ch.31), the express sky-lift up to Solaris (ch.36-37),
// the city above the clouds and its command platform (ch.37), Tartarus prison
// — glass observation hall and death-row cells (ch.37-41), the Solar Ring
// avenue (ch.39), the marble bridge at night (ch.41), the Solar Mist Forest
// and the root-waterfall shaft (ch.42-43), the underground lake and the old
// ruins valley (ch.44) and the One-Face Kingdom (ch.44-45).
// Merged into BG by backgrounds.js. Only places the chapters describe.
'use strict';
const { INK, rng, path, circle, ellipse, rect, line, poly } = require('./util');

module.exports = function bg4({ grad, glow }) {
  const tower = (x, base, w, h, c = '#f4f2ee', trim = '#e2b84a') => rect(x - w / 2, base - h, w, h, { fill: c, stroke: INK, strokeWidth: 2.4 }) + poly([[x - w / 2, base - h], [x, base - h - w * 0.9], [x + w / 2, base - h]], { fill: trim, stroke: INK, strokeWidth: 2 }) + rect(x - w * 0.15, base - h * 0.8, w * 0.3, h * 0.6, { fill: '#bfe6ff', opacity: 0.6 });
  const clouds = (W, y, seed, c = '#ffffff', op = 0.9) => { const r = rng(seed); let s = ''; for (let i = 0; i < 12; i++) s += ellipse(r() * W, y + (r() - 0.5) * 60, 120 + r() * 140, 30 + r() * 30, { fill: c, opacity: op }); return s; };
  const sun = (x, y, r0) => glow(x, y, r0 * 3.2, '#fff4c0', 0.6) + circle(x, y, r0, { fill: '#fffbe6' }) + circle(x, y, r0 * 0.7, { fill: '#ffffff' });
  const marbleFloor = (W, H, fl, c = '#eceae4') => rect(0, fl, W, H - fl, { fill: c }) + Array.from({ length: 9 }, (_, i) => line([W / 2 + (i - 4) * 90, fl], [W / 2 + (i - 4) * 260, H], { stroke: '#cfccc4', strokeWidth: 2 })).join('') + Array.from({ length: 4 }, (_, k) => { const y = fl + (H - fl) * Math.pow((k + 1) / 5, 1.4); return line([0, y], [W, y], { stroke: '#cfccc4', strokeWidth: 2 }); }).join('');
  const trunk = (x, w, H, c = '#3a3028') => path(`M${x - w},${H} C${x - w * 0.8},${H * 0.6} ${x - w * 1.1},${H * 0.3} ${x - w * 0.9},0 L${x + w * 0.9},0 C${x + w * 1.1},${H * 0.3} ${x + w * 0.8},${H * 0.6} ${x + w},${H}Z`, { fill: c, stroke: INK, strokeWidth: 3 }) + path(`M${x - w * 0.4},${H * 0.1} q10,${H * 0.3} -6,${H * 0.6} M${x + w * 0.3},${H * 0.2} q-8,${H * 0.3} 6,${H * 0.6}`, { stroke: '#2a221c', strokeWidth: 4, fill: 'none' });
  const bars = (W, H, x0, x1, top, bot, c = '#5a5e66') => { let s = ''; for (let x = x0; x <= x1; x += 64) s += rect(x - 9, top, 18, bot - top, { fill: c, stroke: INK, strokeWidth: 2.4 }); return s + rect(x0 - 20, top, x1 - x0 + 40, 16, { fill: c, stroke: INK, strokeWidth: 2.4 }) + rect(x0 - 20, bot - 16, x1 - x0 + 40, 16, { fill: c, stroke: INK, strokeWidth: 2.4 }); };
  const oneHouses = (W, base, seed) => { const r = rng(seed); let s = ''; for (let i = 0; i < 9; i++) { const x = i * W / 8 + (r() - 0.5) * 30, w = 70 + r() * 50, h = 60 + r() * 70; s += rect(x - w / 2, base - h, w, h, { fill: r() > 0.5 ? '#6a6c74' : '#5a5c62', stroke: INK, strokeWidth: 2 }) + poly([[x - w / 2 - 6, base - h], [x, base - h - 30], [x + w / 2 + 6, base - h]], { fill: '#3a3c44', stroke: INK, strokeWidth: 2 }) + rect(x - 10, base - h * 0.6, 20, 20, { fill: '#ffcf6a', opacity: 0.7 }); } return s; };

  return {
    // ---------- EP31: the abandoned maintenance-tram tunnel (one oil lamp) ----------
    tramCar: (W, H, o) => {
      let s = grad(W, H, '#14110e', '#211c16');
      s += rect(0, 0, W, H * 0.12, { fill: '#2a241e' }) + rect(0, H * 0.84, W, H * 0.16, { fill: '#1a1612' });
      for (const x of [0.12, 0.88]) s += rect(W * x - 70, H * 0.18, 140, H * 0.3, { fill: '#0a0808', stroke: '#4a3a2a', strokeWidth: 8 });
      s += path(`M${W / 2},${H * 0.12} L${W / 2},${H * 0.2}`, { stroke: '#4a3a2a', strokeWidth: 4 }) + rect(W / 2 - 14, H * 0.2, 28, 34, { fill: '#e8a040', stroke: INK, strokeWidth: 2 }) + glow(W / 2, H * 0.24, 360, '#ffb04a', 0.35);
      if (o.mirror) s += rect(W * 0.72, H * 0.3, 120, 180, { fill: '#9aa8b4', opacity: 0.5, stroke: '#6a5a4a', strokeWidth: 6 }) + path(`M${W * 0.72 + 20},${H * 0.3 + 20} l40,60 l-10,40`, { stroke: INK, strokeWidth: 2, fill: 'none' });
      if (o.crate !== false) s += rect(W * 0.36, H * 0.72, 220, 110, { fill: '#6a5034', stroke: INK, strokeWidth: 3 }) + path(`M${W * 0.36},${H * 0.72 + 55} l220,0 M${W * 0.36 + 110},${H * 0.72} l0,110`, { stroke: '#4a3824', strokeWidth: 3 });
      return s;
    },
    // ---------- EP31: Neon Silk Road gate (neon steam waterfall, registration arch, hanging puppets) ----------
    neonGate: (W, H, o) => {
      let s = grad(W, H, '#1a0820', '#30102a');
      const r = rng('ng' + H);
      for (let i = 0; i < 18; i++) s += rect(r() * W, 0, 4 + r() * 8, H * 0.6, { fill: r() > 0.5 ? '#ff5ab8' : '#9a5aff', opacity: 0.12 });
      s += path(`M${W * 0.12},${H * 0.82} L${W * 0.12},${H * 0.22} Q${W * 0.5},${H * 0.04} ${W * 0.88},${H * 0.22} L${W * 0.88},${H * 0.82}`, { stroke: '#2a1a2a', strokeWidth: 30, fill: 'none' }) + path(`M${W * 0.12},${H * 0.22} Q${W * 0.5},${H * 0.04} ${W * 0.88},${H * 0.22}`, { stroke: '#ff5ab8', strokeWidth: 6, fill: 'none' });
      if (o.puppets !== false) for (const x of [0.3, 0.42, 0.58, 0.7]) s += line([W * x, H * 0.12], [W * x, H * 0.24], { stroke: '#ff2a3a', strokeWidth: 2 }) + rect(W * x - 14, H * 0.24, 28, 56, { fill: '#3a1a4e', stroke: INK, strokeWidth: 2 }) + circle(W * x, H * 0.235, 13, { fill: '#c9a07a', stroke: INK, strokeWidth: 2 }) + circle(W * x + 4, H * 0.235, 3, { fill: '#7ad8ff' });
      const fl = H * (o.floor ?? 0.8);
      s += rect(0, fl, W, H - fl, { fill: '#1a0e16' }) + rect(W * 0.3, fl, W * 0.4, H - fl, { fill: '#6a0a16' });
      if (o.webs) for (let i = 0; i < 10; i++) s += line([r() * W, 0], [r() * W, H * 0.5], { stroke: '#ff2a3a', strokeWidth: 1, opacity: 0.5 });
      for (let i = 0; i < 5; i++) s += ellipse(W * (i / 4), H * 0.4, 260, 60, { fill: '#ff5ab8', opacity: 0.08 });
      return s;
    },
    // ---------- EP32-33: the five arenas of the generals ----------
    // puppet-corpse opera house: tiered seats, wooden stage, red velvet main curtain, twelve spotlights (ch.32 L184)
    theater: (W, H, o) => {
      const dark = o.dark;
      let s = grad(W, H, dark ? '#020204' : '#1a0a20', dark ? '#06060a' : '#2a1030');
      if (!dark) {
        for (let i = 0; i < 12; i++) { const x = W * (0.04 + i * 0.084); s += rect(x - 14, H * 0.03, 28, 22, { fill: '#3a3a42', stroke: INK, strokeWidth: 2 }) + (o.broken ? path(`M${x},${H * 0.06} l-8,14 l10,6`, { stroke: '#ff8a2a', strokeWidth: 3, fill: 'none' }) : poly([[x - 10, H * 0.05], [x + 10, H * 0.05], [W / 2 + (x - W / 2) * 0.3 + 60, H * 0.72], [W / 2 + (x - W / 2) * 0.3 - 60, H * 0.72]], { fill: '#e8d8ff', opacity: 0.05 })); }
        if (o.curtain !== false) s += o.curtainDown ? path(`M0,${H * 0.5} L${W},${H * 0.62} L${W},${H * 0.72} L0,${H * 0.72}Z`, { fill: '#8a0a1a', stroke: INK, strokeWidth: 3 }) : path(`M${W * 0.08},${H * 0.08} L${W * 0.92},${H * 0.08} L${W * 0.92},${H * 0.62} Q${W * 0.5},${H * 0.5} ${W * 0.08},${H * 0.62}Z`, { fill: '#8a0a1a', stroke: INK, strokeWidth: 3 }) + path(Array.from({ length: 10 }, (_, i) => `M${W * (0.12 + i * 0.08)},${H * 0.08} l0,${H * 0.46}`).join(' '), { stroke: '#5a0612', strokeWidth: 6 });
        for (let r = 0; r < 3; r++) for (let i = 0; i < 12; i++) s += rect(i * W / 11 - 20, H * (0.76 + r * 0.08), 40, 30, { fill: '#5a0a2a', stroke: INK, strokeWidth: 1.6 });
      }
      const fl = H * 0.72;
      s += rect(0, fl, W, 16, { fill: dark ? '#0a0a0e' : '#5a3a20', stroke: INK, strokeWidth: 2 });
      if (!dark) s += glow(W / 2, fl - 40, W * 0.5, '#e8d8ff', 0.18);
      return s;
    },
    // gold-silk torture hall and red-carpet jail (ch.33 L10)
    tortureHall: (W, H, o) => {
      let s = grad(W, H, '#1a0a0a', '#2a1010');
      for (let i = 0; i < 6; i++) { const x = W * (0.08 + i * 0.17); s += path(`M${x},0 L${x},${H * 0.5}`, { stroke: '#c9a040', strokeWidth: 4, strokeDasharray: '10 6' }) + circle(x, H * 0.5, 16, { fill: 'none', stroke: '#c9a040', strokeWidth: 4 }); }
      s += rect(W * 0.04, H * 0.2, 120, 180, { fill: '#c9a040', opacity: 0.4, stroke: INK, strokeWidth: 3 }) + rect(W * 0.8, H * 0.18, 110, 200, { fill: '#c9a040', opacity: 0.4, stroke: INK, strokeWidth: 3 });
      const fl = H * (o.floor ?? 0.7);
      s += rect(0, fl, W, H - fl, { fill: '#8a0a1a' }) + path(Array.from({ length: 8 }, (_, i) => `M${i * 110},${fl + 20} q30,20 60,0`).join(' '), { stroke: '#5a0612', strokeWidth: 3, fill: 'none' });
      return s;
    },
    // poison-flower greenhouse: pink glass dome, glowing flowers, iron gazebo (ch.33 L204-208)
    greenhouse: (W, H, o) => {
      let s = grad(W, H, '#2a1424', '#3a1a30');
      s += path(`M0,${H * 0.5} Q${W / 2},${-H * 0.2} ${W},${H * 0.5}`, { fill: '#ff8ac0', opacity: 0.12, stroke: '#c07090', strokeWidth: 4 }) + path(Array.from({ length: 9 }, (_, i) => `M${i * W / 8},${H * 0.5} Q${W / 2},${-H * 0.1} ${W / 2},${H * 0.08}`).join(' '), { stroke: '#c07090', strokeWidth: 2, fill: 'none', opacity: 0.6 });
      if (o.broken) s += path(`M${W * 0.3},${H * 0.12} l30,40 l-20,30 l40,20 M${W * 0.6},${H * 0.1} l-20,40`, { stroke: '#ffd0e8', strokeWidth: 3, fill: 'none' });
      if (o.gazebo !== false) s += path(`M${W * 0.6},${H * 0.66} L${W * 0.6},${H * 0.36} L${W * 0.75},${H * 0.26} L${W * 0.9},${H * 0.36} L${W * 0.9},${H * 0.66}`, { stroke: '#2a2830', strokeWidth: 8, fill: 'none' }) + path(`M${W * 0.62},${H * 0.4} q20,20 0,40 q-14,20 6,40`, { stroke: '#a3101f', strokeWidth: 6, fill: 'none' });
      const fl = H * (o.floor ?? 0.7);
      s += rect(0, fl, W, H - fl, { fill: '#2a2026' });
      const r = rng('gh' + H);
      for (let i = 0; i < 22; i++) { const x = r() * W, y = fl - 10 + r() * 60, c = ['#ff5ab8', '#b05aff', '#5affb0', '#ffd45a'][i % 4]; s += path(`M${x},${y + 40} L${x},${y}`, { stroke: '#2a5a3a', strokeWidth: 4 }) + circle(x, y, 9, { fill: c, stroke: INK, strokeWidth: 1.6 }) + glow(x, y, 26, c, 0.4); }
      return s;
    },
    // porcelain-doll gallery and bond-coin vault (ch.33 L336-346)
    porcelainHall: (W, H, o) => {
      let s = grad(W, H, '#1a1820', '#2a2834');
      for (let i = 0; i < 6; i++) { const x = W * (0.08 + i * 0.17); s += rect(x - 30, H * 0.2, 60, 140, { fill: '#2a2834', stroke: '#c9c4d4', strokeWidth: 3 }) + circle(x, H * 0.26, 16, { fill: '#f6f4f2', stroke: INK, strokeWidth: 2 }) + rect(x - 14, H * 0.29, 28, 50, { fill: '#e8e6ee', stroke: INK, strokeWidth: 2 }); }
      const fl = H * (o.floor ?? 0.68);
      s += marbleFloor(W, H, fl, '#d8d4dc');
      if (o.altar !== false) { const ax = W * (o.altarX ?? 0.7); s += rect(ax - 70, fl - 90, 140, 90, { fill: '#e8e6e0', stroke: INK, strokeWidth: 3 }) + (o.cupBroken ? '' : path(`M${ax - 26},${fl - 120} L${ax + 26},${fl - 120} L${ax + 16},${fl - 90} L${ax - 16},${fl - 90}Z`, { fill: '#f6f4f2', stroke: '#3a5aa0', strokeWidth: 3 })); }
      return s;
    },
    // ---------- EP36-37: inside the octagonal express sky-lift (glass walls; clouds and the city outside) ----------
    skyLift: (W, H, o) => {
      const ph = o.phase || 'clouds'; // 'dark' (leaving the district) | 'clouds' | 'sky'
      let s = ph === 'dark' ? grad(W, H, '#1a0e20', '#2a1430') : ph === 'sky' ? grad(W, H, '#7ab8ff', '#dff0ff') : grad(W, H, '#c8d4e4', '#f2f6fa');
      if (ph === 'clouds') s += clouds(W, H * 0.3, 'sl1') + clouds(W, H * 0.6, 'sl2');
      if (ph === 'sky') s += sun(W * 0.8, H * 0.16, 50) + clouds(W, H * 0.62, 'sl3');
      if (o.city && ph === 'sky') for (let i = 0; i < 8; i++) s += tower(W * (0.05 + i * 0.13), H * 0.58, 40 + (i % 3) * 14, 140 + (i * 37) % 120);
      if (o.pipes) for (const x of [0.06, 0.14, 0.94]) s += rect(W * x - 22, 0, 44, H, { fill: '#cfe6ff', opacity: 0.35, stroke: '#9ab0c8', strokeWidth: 3 }) + Array.from({ length: 6 }, (_, i) => rect(W * x - 10, i * H / 6 + 30, 20, 34, { fill: i % 2 ? '#ffd45a' : '#c0172a', stroke: INK, strokeWidth: 1.4 })).join('');
      for (const x of [0.02, 0.98]) s += rect(W * x - 14, 0, 28, H, { fill: '#e8eaee', stroke: INK, strokeWidth: 3 });
      s += rect(0, H * 0.08, W, 8, { fill: '#e2b84a', opacity: 0.8 });
      const fl = H * (o.floor ?? 0.82);
      s += rect(0, fl, W, H - fl, { fill: '#e6e8ec' }) + line([0, fl], [W, fl], { stroke: '#e2b84a', strokeWidth: 5 });
      if (o.sofa) s += rect(W * 0.66, fl - 90, 240, 90, { fill: '#fbfbfd', stroke: INK, strokeWidth: 3, rx: 12 }) + rect(W * 0.66, fl - 130, 240, 50, { fill: '#f2f2f6', stroke: INK, strokeWidth: 3, rx: 12 });
      return s;
    },
    // ---------- EP37: Solaris above the cloud sea (marble towers, artificial sun, waterfall gardens, the tribute pipes) ----------
    solarisCity: (W, H, o) => {
      let s = grad(W, H, '#5aa0f0', '#cfe8ff');
      s += sun(W * (o.sunX ?? 0.72), H * 0.14, 46);
      const base = H * (o.base ?? 0.62);
      for (let i = 0; i < 11; i++) s += tower(W * (i / 10), base - (i % 2) * 20, 46 + (i * 17) % 40, 180 + (i * 53) % 220);
      for (let i = 0; i < 4; i++) s += tower(W * (0.12 + i * 0.25), base + 30, 70, 120 + i * 30, '#ffffff');
      s += path(`M${W * 0.3},${base - 120} l0,140 M${W * 0.62},${base - 160} l0,170`, { stroke: '#bfe6ff', strokeWidth: 10, opacity: 0.7 });
      s += rect(0, base, W, H - base, { fill: '#f2f2ee' }) + clouds(W, base + 40, 'sc' + H, '#ffffff', 0.95);
      if (o.pipes) for (const x of [0.44, 0.5, 0.56]) s += rect(W * x - 16, base - 60, 32, H, { fill: '#cfe6ff', opacity: 0.6, stroke: '#9ab0c8', strokeWidth: 3 }) + Array.from({ length: 5 }, (_, i) => rect(W * x - 8, base + i * 60, 16, 30, { fill: i % 2 ? '#ffd45a' : '#c0172a' })).join('');
      return s;
    },
    // marble landing platform of the central command tower (silver trumpets, guards in rows)
    solarisPlatform: (W, H, o) => {
      let s = grad(W, H, '#9ac8ff', '#eaf4ff') + sun(W * 0.86, H * 0.08, 36);
      for (let i = 0; i < 6; i++) s += tower(W * (0.08 + i * 0.18), H * 0.5, 50, 160 + (i * 41) % 160);
      for (const x of [0.06, 0.94]) s += rect(W * x - 24, H * 0.1, 48, H * 0.6, { fill: '#f6f4ee', stroke: INK, strokeWidth: 3 }) + rect(W * x - 30, H * 0.1, 60, 18, { fill: '#e2b84a', stroke: INK, strokeWidth: 2 });
      const fl = H * (o.floor ?? 0.66);
      s += marbleFloor(W, H, fl) + poly([[W * 0.4, fl], [W * 0.6, fl], [W * 0.75, H], [W * 0.25, H]], { fill: '#fbfbfd', stroke: '#e2b84a', strokeWidth: 3 });
      return s;
    },
    // ---------- EP37-38: Tartarus observation hall — round transparent cell under a glass dome; armoury beyond ----------
    observHall: (W, H, o) => {
      let s = o.dark ? grad(W, H, '#3a4050', '#6a7280') : grad(W, H, '#dfe8f4', '#f6f8fb');
      s += path(`M0,0 L${W},0 L${W},${H * 0.18} Q${W / 2},${H * 0.02} 0,${H * 0.18}Z`, { fill: o.dark ? '#2a3040' : '#bfe0ff', opacity: 0.5, stroke: '#9ab0c8', strokeWidth: 3 }) + path(Array.from({ length: 8 }, (_, i) => `M${i * W / 7},0 Q${W / 2},${H * 0.1} ${W / 2},${H * 0.12}`).join(' '), { stroke: '#9ab0c8', strokeWidth: 2, fill: 'none', opacity: 0.6 });
      if (o.balcony !== false) s += rect(0, H * 0.24, W, 14, { fill: '#e2b84a', stroke: INK, strokeWidth: 2 }) + path(Array.from({ length: 17 }, (_, i) => `M${i * 50},${H * 0.24} l0,-44`).join(' '), { stroke: '#cfccc4', strokeWidth: 4 }) + rect(0, H * 0.24 - 50, W, 8, { fill: '#cfccc4' });
      const fl = H * (o.floor ?? 0.74);
      s += marbleFloor(W, H, fl, '#f2f0ea');
      if (o.cell !== false) { const cx = W * (o.cellX ?? 0.5); s += ellipse(cx, fl + 10, 260, 40, { fill: '#cfe6ff', opacity: 0.4, stroke: '#9ab0c8', strokeWidth: 3 }) + path(`M${cx - 260},${fl + 10} L${cx - 260},${H * 0.3} Q${cx},${H * 0.18} ${cx + 260},${H * 0.3} L${cx + 260},${fl + 10}`, { fill: '#e8f4ff', fillOpacity: 0.18, stroke: '#cfe6ff', strokeWidth: 5 }); }
      if (o.cracks) s += path(`M${W * 0.5},${fl + 30} l-60,20 l-30,40 M${W * 0.5},${fl + 30} l70,10 l20,50 M${W * 0.5},${fl + 30} l-10,60`, { stroke: INK, strokeWidth: 3, fill: 'none' });
      if (o.terrace) s += rect(W * 0.78, 0, W * 0.22, fl, { fill: '#bfe0ff', opacity: 0.4, stroke: '#9ab0c8', strokeWidth: 4 }) + ellipse(W * 0.9, fl * 0.6, 120, 30, { fill: '#ffffff', opacity: 0.7 });
      return s;
    },
    // ---------- EP38-41: death-row cell — titanium bars, single white spotlight / red emergency light ----------
    deathRow: (W, H, o) => {
      const red = o.red;
      let s = grad(W, H, red ? '#1a0608' : '#0e0e12', red ? '#2a0a0e' : '#1a1a20');
      s += rect(0, 0, W, H, { fill: '#2a2c32', opacity: 0.4 });
      for (let i = 0; i < 6; i++) s += line([0, i * H / 6], [W, i * H / 6], { stroke: '#1a1a20', strokeWidth: 2 });
      if (o.breach) { s += path(`M${W * 0.25},${H * 0.12} L${W * 0.42},${H * 0.06} L${W * 0.66},${H * 0.1} L${W * 0.78},${H * 0.3} L${W * 0.72},${H * 0.66} L${W * 0.5},${H * 0.72} L${W * 0.28},${H * 0.62} L${W * 0.2},${H * 0.36}Z`, { fill: '#0a1430', stroke: '#3a3e46', strokeWidth: 8 }); const r = rng('br' + H); for (let i = 0; i < 20; i++) s += circle(W * (0.3 + r() * 0.4), H * (0.12 + r() * 0.5), 1.5 + r() * 2, { fill: '#e8f4ff' }); s += ellipse(W * 0.5, H * 0.5, 160, 40, { fill: '#f6f8ff', opacity: 0.12 }); }
      const fl = H * (o.floor ?? 0.8);
      s += rect(0, fl, W, H - fl, { fill: '#22232a' });
      if (o.bars !== false) s += bars(W, H, W * (o.barsX0 ?? 0.04), W * (o.barsX1 ?? 0.96), H * 0.04, fl + 20, o.cut ? '#3a3e46' : '#5a5e66');
      if (o.cut) s += path(`M0,${H * 0.46} L${W},${H * 0.4}`, { stroke: '#e8fbff', strokeWidth: 6, opacity: 0.7 }) + path(`M0,${H * 0.46} L${W},${H * 0.4}`, { stroke: '#3ad8ff', strokeWidth: 20, opacity: 0.2 });
      s += red ? glow(W / 2, 0, W * 0.8, '#ff2a2a', 0.35) : glow(W / 2, 0, W * 0.6, '#f6f8ff', 0.3) + path(`M${W * 0.4},0 L${W * 0.6},0 L${W * 0.8},${fl} L${W * 0.2},${fl}Z`, { fill: '#f6f8ff', opacity: 0.06 });
      return s;
    },
    // corridor outside the death-row cells (weapon rack by the guard post)
    deathCorridor: (W, H, o) => {
      let s = grad(W, H, o.red ? '#1a0608' : '#16161c', o.red ? '#2a0a0e' : '#24242c');
      for (let i = 0; i < 5; i++) s += rect(i * W / 4 - 6, 0, 12, H, { fill: '#3a3a42', stroke: INK, strokeWidth: 2 });
      const fl = H * (o.floor ?? 0.78);
      s += rect(0, fl, W, H - fl, { fill: '#cfccc4', opacity: 0.25 }) + rect(0, fl, W, H - fl, { fill: '#2a2a30' });
      if (o.rack) { const x = W * (o.rackX ?? 0.66); s += rect(x - 160, fl - 300, 320, 300, { fill: '#3a3e46', stroke: INK, strokeWidth: 4 }) + rect(x - 160, fl - 160, 320, 10, { fill: '#5a5e66' }); }
      if (o.door) s += rect(W * 0.04, fl - H * 0.6, W * 0.24, H * 0.6, { fill: '#5a5e66', stroke: INK, strokeWidth: 4 }) + rect(W * 0.04 + 20, fl - H * 0.55, 30, 30, { fill: '#ff2a3a', opacity: 0.6 });
      s += o.red ? glow(W / 2, 0, W * 0.8, '#ff2a2a', 0.3) : glow(W / 2, 0, W * 0.6, '#f6f8ff', 0.2);
      return s;
    },
    // ---------- EP39: Solar Ring avenue (crystal towers, perfume fountains, cafés) ----------
    solarRing: (W, H, o) => {
      let s = grad(W, H, '#8ac0ff', '#eef6ff') + sun(W * 0.2, H * 0.08, 40);
      for (let i = 0; i < 7; i++) s += rect(W * (i / 6) - 50, H * 0.06, 100, H * 0.5, { fill: '#cfe6ff', opacity: 0.55, stroke: '#9ab0c8', strokeWidth: 3 }) + rect(W * (i / 6) - 30, H * 0.12, 20, H * 0.4, { fill: '#ffffff', opacity: 0.5 });
      const fl = H * (o.floor ?? 0.6);
      s += marbleFloor(W, H, fl, '#f6f4ee');
      if (o.cafe !== false) for (const x of [0.08, 0.9]) s += rect(W * x - 50, fl - 60, 100, 60, { fill: '#e2b84a', opacity: 0.25, stroke: '#c9a040', strokeWidth: 2 }) + circle(W * x - 20, fl + 30, 20, { fill: '#fbfbfd', stroke: INK, strokeWidth: 2 }) + circle(W * x + 26, fl + 30, 20, { fill: '#fbfbfd', stroke: INK, strokeWidth: 2 });
      if (o.fountain) s += ellipse(W * 0.5, fl + 40, 140, 30, { fill: '#cfe6ff', stroke: '#9ab0c8', strokeWidth: 3 }) + path(`M${W * 0.5},${fl + 30} q-30,-80 -70,-30 M${W * 0.5},${fl + 30} q30,-80 70,-30`, { stroke: '#bfe6ff', strokeWidth: 6, fill: 'none' });
      if (o.ruin) s += poly([[W * 0.66, 0], [W, 0], [W, fl], [W * 0.74, fl], [W * 0.8, fl * 0.6], [W * 0.7, fl * 0.4]], { fill: '#d8d4c8', stroke: INK, strokeWidth: 3 }) + path(`M${W * 0.72},${fl * 0.3} l40,40 l-20,30 M${W * 0.9},${fl * 0.2} l-30,50`, { stroke: INK, strokeWidth: 3, fill: 'none' });
      if (o.smoke) s += ellipse(W * 0.6, fl, 300, 100, { fill: '#3a3438', opacity: 0.4 });
      return s;
    },
    // ---------- EP41-42: marble bridge outside Tartarus at night (city lights, spotlights) ----------
    nightBridge: (W, H, o) => {
      let s = grad(W, H, '#060a18', '#141c34');
      const r = rng('nb' + H);
      for (let i = 0; i < 30; i++) s += circle(r() * W, r() * H * 0.4, 1 + r() * 1.6, { fill: '#e8f0ff', opacity: 0.8 });
      s += circle(W * 0.82, H * 0.12, 30, { fill: '#e8f0ff', opacity: 0.85 });
      for (let i = 0; i < 9; i++) s += rect(W * (i / 8) - 30, H * 0.3, 60, H * 0.3, { fill: '#1e2440', stroke: INK, strokeWidth: 2 }) + rect(W * (i / 8) - 10, H * 0.34, 20, H * 0.2, { fill: '#cfe6ff', opacity: 0.5 });
      if (o.spots) for (const [x, a] of [[0.2, 70], [0.5, 100], [0.8, 120]]) { const sx = W * x, sy = H * 0.3, aa = (a * Math.PI) / 180; s += poly([[sx, sy], [sx + Math.cos(aa) * H + 120, sy - Math.sin(aa) * H], [sx + Math.cos(aa) * H - 120, sy - Math.sin(aa) * H]], { fill: '#f6f8ff', opacity: 0.1 }); }
      const fl = H * (o.floor ?? 0.66);
      s += poly([[0, fl], [W, fl - 20], [W, H], [0, H]], { fill: '#d8d6d0' }) + rect(0, fl - 50, W, 10, { fill: '#e8e6e0', stroke: INK, strokeWidth: 2 }) + path(Array.from({ length: 17 }, (_, i) => `M${i * 50},${fl - 40} l0,40`).join(' '), { stroke: '#cfccc4', strokeWidth: 5 });
      if (o.alarm) s += rect(0, 0, W, H, { fill: '#ff2a2a', opacity: 0.12 });
      return s;
    },
    // ---------- EP42-43: Solar Mist Forest (giant ancient trees, glowing white-gold mist, moss) ----------
    mistForest: (W, H, o) => {
      let s = grad(W, H, '#0e1a18', '#1a2a24');
      for (const [x, w] of [[0.08, 70], [0.36, 50], [0.7, 90], [0.96, 60]]) s += trunk(W * x, w, H, '#2e2a22');
      const fl = H * (o.floor ?? 0.8);
      s += rect(0, fl, W, H - fl, { fill: '#1e3a28' });
      s += path(`M0,${fl + 30} C${W * 0.2},${fl - 40} ${W * 0.4},${fl + 50} ${W * 0.6},${fl} S${W},${fl + 20} ${W},${fl}`, { stroke: '#3a3226', strokeWidth: 40, fill: 'none' }) + path(`M0,${fl + 30} C${W * 0.2},${fl - 40} ${W * 0.4},${fl + 50} ${W * 0.6},${fl} S${W},${fl + 20} ${W},${fl}`, { stroke: '#4a4030', strokeWidth: 24, fill: 'none' });
      const r = rng('mf' + H);
      for (let i = 0; i < 16; i++) s += circle(r() * W, fl + r() * (H - fl), 3, { fill: '#7affb0', opacity: 0.6 });
      for (let i = 0; i < 8; i++) s += ellipse(r() * W, H * (0.3 + r() * 0.5), 260, 50, { fill: '#f6f2d8', opacity: o.dense ? 0.22 : 0.12 });
      s += glow(W / 2, H * 0.5, W * 0.6, '#ffe8a0', 0.08);
      if (o.lights) for (let i = 0; i < 4; i++) s += poly([[W * (0.2 + i * 0.2), 0], [W * (0.1 + i * 0.2), fl], [W * (0.3 + i * 0.2), fl]], { fill: '#f6f8ff', opacity: 0.07 });
      return s;
    },
    // ---------- EP43: the root-waterfall abyss (river plunging into a hollow shaft of braided roots) ----------
    rootFalls: (W, H, o) => {
      let s = grad(W, H, '#0e1a1c', '#0a1214');
      for (const [x, w] of [[0.04, 60], [0.94, 70]]) s += trunk(W * x, w, H, '#2e2a22');
      const cx = W * (o.cx ?? 0.5), cy = H * (o.cy ?? 0.66);
      s += ellipse(cx, cy, W * 0.36, H * 0.1, { fill: '#050808', stroke: '#3a3226', strokeWidth: 24 });
      for (let i = 0; i < 10; i++) s += path(`M${cx - W * 0.36 + i * W * 0.08},${cy} q${(i - 5) * 4},${H * 0.2} ${(i - 5) * 10},${H * 0.4}`, { stroke: '#3a3226', strokeWidth: 10, fill: 'none' });
      s += path(`M${cx - 140},${H * 0.2} C${cx - 100},${H * 0.4} ${cx - 60},${cy - 40} ${cx - 20},${cy}`, { stroke: '#bfe6ff', strokeWidth: 60, fill: 'none', opacity: 0.6 }) + path(`M${cx - 140},${H * 0.2} C${cx - 100},${H * 0.4} ${cx - 60},${cy - 40} ${cx - 20},${cy}`, { stroke: '#ffffff', strokeWidth: 16, fill: 'none', opacity: 0.6, strokeDasharray: '30 20' });
      s += ellipse(cx, cy, W * 0.3, H * 0.06, { fill: '#e8f8ff', opacity: 0.15 });
      if (o.ledge !== false) s += poly([[0, H * 0.84], [W * 0.3, H * 0.8], [W * 0.5, H * 0.86], [W, H * 0.82], [W, H], [0, H]], { fill: '#2a2a2a', stroke: INK, strokeWidth: 3 });
      if (o.rubble) s += ellipse(cx, cy, W * 0.36, H * 0.12, { fill: '#3a3a3e' });
      for (let i = 0; i < 6; i++) s += ellipse(W * (i / 5), H * 0.5, 240, 50, { fill: '#e8f4f0', opacity: 0.12 });
      return s;
    },
    // inside the root shaft: dark tunnel of roots and rushing water
    rootTunnel: (W, H, o) => {
      let s = grad(W, H, '#050808', '#0a1210');
      for (let i = 0; i < 14; i++) s += path(`M${i * W / 13},0 C${i * W / 13 + 60},${H * 0.3} ${i * W / 13 - 60},${H * 0.6} ${i * W / 13 + 20},${H}`, { stroke: i % 2 ? '#2a241c' : '#3a3226', strokeWidth: 26, fill: 'none' });
      s += path(`M${W * 0.2},0 C${W * 0.4},${H * 0.3} ${W * 0.6},${H * 0.6} ${W * 0.5},${H}`, { stroke: '#bfe6ff', strokeWidth: 140, fill: 'none', opacity: 0.35 }) + path(`M${W * 0.2},0 C${W * 0.4},${H * 0.3} ${W * 0.6},${H * 0.6} ${W * 0.5},${H}`, { stroke: '#ffffff', strokeWidth: 20, fill: 'none', opacity: 0.4, strokeDasharray: '40 30' });
      return s;
    },
    // ---------- EP44: emerald underground lake, gravel shore, waterfall from a root hanging off the cave roof ----------
    undergroundLake: (W, H, o) => {
      let s = grad(W, H, '#0a1418', '#10241e');
      s += path(`M${W * 0.62},0 C${W * 0.6},${H * 0.1} ${W * 0.66},${H * 0.14} ${W * 0.64},${H * 0.2}`, { stroke: '#3a3226', strokeWidth: 50, fill: 'none' });
      if (o.fall !== false) s += rect(W * 0.6, H * 0.2, 60, H * 0.36, { fill: '#cfeeff', opacity: 0.6 }) + rect(W * 0.62, H * 0.2, 14, H * 0.36, { fill: '#ffffff', opacity: 0.6 });
      const wl = H * (o.water ?? 0.56);
      s += rect(0, wl, W, H - wl, { fill: '#127a5a' }) + rect(0, wl, W, 10, { fill: '#5ad8a8', opacity: 0.6 }) + ellipse(W * 0.63, wl, 120, 20, { fill: '#e8fff6', opacity: 0.6 });
      const r = rng('ul' + H);
      for (let i = 0; i < 8; i++) s += path(`M${r() * W},${wl + 20 + r() * (H - wl)} q30,-8 60,0`, { stroke: '#5ad8a8', strokeWidth: 2, fill: 'none', opacity: 0.6 });
      if (o.shore !== false) { const sh = H * (o.shore ?? 0.76); s += poly([[0, sh], [W * 0.5, sh + 20], [W, sh - 10], [W, H], [0, H]], { fill: '#5a5650', stroke: INK, strokeWidth: 3 }); for (let i = 0; i < 30; i++) s += ellipse(r() * W, sh + 20 + r() * (H - sh), 8 + r() * 10, 5 + r() * 5, { fill: r() > 0.5 ? '#7a766e' : '#4a4640', stroke: INK, strokeWidth: 1.2 }); }
      return s;
    },
    // ---------- EP44: the ruins valley — collapsed towers, white-circle trail marks ----------
    ruinsValley: (W, H, o) => {
      let s = grad(W, H, '#14141a', '#24242a');
      const r = rng('rv' + H);
      for (let i = 0; i < 6; i++) { const x = r() * W, h = H * (0.3 + r() * 0.4); s += poly([[x - 50, H * 0.7], [x - 40, H * 0.7 - h], [x + 40, H * 0.7 - h + 30], [x + 50, H * 0.7]], { fill: '#2e2e36', stroke: INK, strokeWidth: 3 }) + Array.from({ length: 4 }, (_, k) => rect(x - 20, H * 0.7 - h + 30 + k * 40, 14, 20, { fill: '#121216' })).join(''); }
      s += rect(0, H * 0.7, W, H * 0.3, { fill: '#2a2a2a' });
      if (o.marks !== false) for (const [x, y] of [[0.2, 0.62], [0.74, 0.56]]) s += circle(W * x, H * y, 18, { fill: 'none', stroke: '#f2f2f0', strokeWidth: 5 });
      if (o.curtain) s += rect(W * 0.4, H * 0.2, W * 0.2, H * 0.5, { fill: '#cfeeff', opacity: 0.4 });
      return s;
    },
    // ---------- EP44: the One-Face basin city from the ridge / at the gate ----------
    onefaceCity: (W, H, o) => {
      let s = grad(W, H, '#14141a', '#2a2a34');
      s += path(`M0,${H * 0.1} Q${W / 2},${-H * 0.06} ${W},${H * 0.1} L${W},0 L0,0Z`, { fill: '#0e0e14' });
      s += path(`M0,${H * 0.3} Q${W * 0.5},${H * 0.6} ${W},${H * 0.3} L${W},${H} L0,${H}Z`, { fill: '#3a3a42' });
      s += oneHouses(W, H * 0.58, 'oc1') + oneHouses(W, H * 0.7, 'oc2');
      s += rect(W * 0.42, H * 0.28, W * 0.16, H * 0.24, { fill: '#1a1a20', stroke: INK, strokeWidth: 3 }) + rect(W * 0.46, H * 0.18, W * 0.08, H * 0.12, { fill: '#e8e6e0', stroke: INK, strokeWidth: 3 }) + poly([[W * 0.44, H * 0.18], [W * 0.5, H * 0.1], [W * 0.56, H * 0.18]], { fill: '#1a1a20', stroke: INK, strokeWidth: 2 });
      s += rect(W * 0.1, H * 0.64, 60, 30, { fill: '#5affb0', opacity: 0.35 }) + rect(W * 0.8, H * 0.66, 70, 30, { fill: '#5affb0', opacity: 0.35 });
      s += path(`M${W * 0.2},${H * 0.5} q10,-40 -6,-80`, { stroke: '#8a8a92', strokeWidth: 14, fill: 'none', opacity: 0.5 });
      if (o.gate) s += rect(W * 0.3, H * 0.62, W * 0.4, H * 0.38, { fill: '#2a2a32', stroke: INK, strokeWidth: 4 }) + rect(W * 0.4, H * 0.68, W * 0.2, H * 0.32, { fill: o.gateOpen ? '#4a4a52' : '#3a3a42', stroke: INK, strokeWidth: 4 });
      return s;
    },
    // street inside the walls (smithy, training yards, the castle at the end)
    onefaceStreet: (W, H, o) => {
      let s = grad(W, H, '#1a1a22', '#30303a');
      s += oneHouses(W, H * 0.46, 'os1');
      if (o.castle) s += rect(W * 0.38, H * 0.04, W * 0.24, H * 0.42, { fill: '#1a1a20', stroke: INK, strokeWidth: 3 }) + rect(W * 0.44, 0, W * 0.12, H * 0.1, { fill: '#e8e6e0', stroke: INK, strokeWidth: 3 });
      if (o.forge) s += rect(W * 0.02, H * 0.2, 200, H * 0.28, { fill: '#3a3230', stroke: INK, strokeWidth: 3 }) + rect(W * 0.02 + 60, H * 0.32, 80, H * 0.16, { fill: '#ff8a2a', opacity: 0.7 }) + glow(W * 0.02 + 100, H * 0.4, 160, '#ffb04a', 0.35);
      if (o.stairs) s += poly([[W * 0.32, H * 0.6], [W * 0.68, H * 0.6], [W * 0.8, H], [W * 0.2, H]], { fill: '#1a1a20', stroke: INK, strokeWidth: 3 }) + Array.from({ length: 8 }, (_, i) => line([W * (0.32 - i * 0.015), H * (0.6 + i * 0.05)], [W * (0.68 + i * 0.015), H * (0.6 + i * 0.05)], { stroke: '#3a3a42', strokeWidth: 3 })).join('');
      const fl = H * (o.floor ?? 0.6);
      if (!o.stairs) s += rect(0, fl, W, H - fl, { fill: '#4a4a52' }) + Array.from({ length: 6 }, (_, i) => line([0, fl + i * 30], [W, fl + i * 30], { stroke: '#3a3a42', strokeWidth: 2 })).join('');
      return s;
    },
    // ---------- EP45: the throne hall — dark grey granite, tall mirrors on the pillars, black stone throne ----------
    throneRoom: (W, H, o) => {
      let s = grad(W, H, '#1a1a20', '#2a2a32');
      for (const x of [0.06, 0.24, 0.76, 0.94]) s += rect(W * x - 34, 0, 68, H * 0.8, { fill: '#3a3a42', stroke: INK, strokeWidth: 3 }) + rect(W * x - 22, H * 0.14, 44, H * 0.4, { fill: '#9aa8b4', opacity: 0.5, stroke: '#c9ced8', strokeWidth: 2 });
      if (o.throne !== false) { const tx = W * (o.tx ?? 0.5); s += poly([[tx - 260, H * 0.62], [tx + 260, H * 0.62], [tx + 320, H * 0.8], [tx - 320, H * 0.8]], { fill: '#24242c', stroke: INK, strokeWidth: 3 }) + rect(tx - 80, H * 0.24, 160, H * 0.38, { fill: '#0e0e12', stroke: INK, strokeWidth: 4 }) + poly([[tx - 80, H * 0.24], [tx, H * 0.14], [tx + 80, H * 0.24]], { fill: '#0e0e12', stroke: INK, strokeWidth: 3 }) + rect(tx - 60, H * 0.5, 120, 30, { fill: '#5a0a14' }); }
      const fl = H * (o.floor ?? 0.8);
      s += rect(0, fl, W, H - fl, { fill: '#3a3a42' }) + rect(W * 0.4, fl, W * 0.2, H - fl, { fill: '#5a0a14', opacity: 0.6 });
      return s;
    },
  };
};
