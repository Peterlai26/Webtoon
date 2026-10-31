// Locations of source chapters 11-20 (Velvet District arc + Haunted Village
// arc). Merged into BG by backgrounds.js. Only places the chapters describe.
'use strict';
const { INK, rng, path, circle, ellipse, rect, line, poly, g, id, linGrad, radGrad, f } = require('./util');

module.exports = function bg2({ grad, glow }) {
  const neonSign = (x, y, w, h, c) => rect(x, y, w, h, { fill: c, opacity: 0.85, rx: 6 }) + glow(x + w / 2, y + h / 2, Math.max(w, h) * 1.2, c, 0.35);
  const lily = (x, y, s = 1) => g(path('M0,0 L0,-40', { stroke: '#3a6a4a', strokeWidth: 3 }) + path('M0,-40 C-14,-56 -10,-70 0,-62 C10,-70 14,-56 0,-40Z M0,-40 C-20,-46 -26,-36 -12,-34 M0,-40 C20,-46 26,-36 12,-34', { fill: '#f6f6f2', stroke: '#b9bcc4', strokeWidth: 1.6 }), { transform: `translate(${f(x)},${f(y)}) scale(${s})` });
  const mansion = (x, base, w, h, c = '#2a2236', win = '#ff5aa8') => {
    let s = rect(x, base - h, w, h, { fill: c, stroke: INK, strokeWidth: 3 }) + path(`M${x - 10},${base - h} L${x + w / 2},${base - h - 60} L${x + w + 10},${base - h}Z`, { fill: c, stroke: INK, strokeWidth: 3 });
    for (let r = 0; r < Math.floor(h / 70); r++) for (let k = 0; k < Math.floor(w / 46); k++) s += rect(x + 12 + k * 46, base - h + 20 + r * 70, 22, 34, { fill: (r + k) % 3 ? win : '#ffd27a', opacity: 0.75, rx: 10 });
    return s;
  };

  const BG2 = {
    // ---------- EP11-12: Dead-End ruins / safe room / train ----------
    ruinRain: (W, H, o) => { // the collapsed front of Dead-End under acid rain, alley 7
      let s = grad(W, H, '#120c16', '#1e1620');
      for (let i = 0; i < 6; i++) s += rect(i * 150 - 20, H * 0.12 + (i % 2) * 60, 120, H * 0.6, { fill: i % 2 ? '#1a1420' : '#221a26', stroke: INK, strokeWidth: 3 });
      s += neonSign(W * 0.08, H * 0.2, 110, 30, '#ff2a4a') + neonSign(W * 0.74, H * 0.28, 90, 26, '#b14bff');
      s += rect(0, H * 0.72, W, H * 0.28, { fill: '#18141a' });
      const r = rng('rr' + H);
      for (let i = 0; i < 18; i++) { const x = r() * W, y = H * (0.7 + r() * 0.2), sz = 20 + r() * 50; s += poly([[x, y], [x + sz, y - sz * 0.5], [x + sz * 1.4, y + 6], [x + sz * 0.2, y + sz * 0.3]], { fill: '#3a3036', stroke: INK, strokeWidth: 2 }); }
      for (let i = 0; i < 5; i++) s += ellipse(r() * W, H * (0.85 + r() * 0.1), 80, 10, { fill: '#ff2a4a', opacity: 0.18 });
      if (o.bridge) s += rect(0, H * 0.04, W, 26, { fill: '#4a4a52', stroke: INK, strokeWidth: 3 }) + path(Array.from({ length: 10 }, (_, i) => `M${i * 90},${H * 0.04 + 26} l45,-26 l45,26`).join(' '), { stroke: '#3a3a42', strokeWidth: 4, fill: 'none' });
      for (let i = 0; i < 110; i++) { const x = r() * W, y = r() * H; s += line([x, y], [x - 6, y + 30], { stroke: '#a9b0a8', strokeWidth: 2, opacity: 0.45 }); }
      return s;
    },
    pipeBridge: (W, H) => { // high steel water-pipe bridge between Solaris and Necropolis
      let s = grad(W, H, '#0a0e18', '#1a1a28');
      s += glow(W * 0.6, 0, 300, '#bfe6ff', 0.3);
      s += rect(0, H * 0.62, W, 40, { fill: '#4a4e58', stroke: INK, strokeWidth: 3 }) + rect(0, H * 0.62 + 40, W, 18, { fill: '#2a2e36' });
      for (let i = 0; i < 9; i++) s += path(`M${i * 100},${H * 0.62 + 58} l50,120 l50,-120`, { stroke: '#3a3e46', strokeWidth: 6, fill: 'none' });
      s += rect(W * 0.08, H * 0.48, W * 0.9, 34, { fill: '#5a6068', stroke: INK, strokeWidth: 3, rx: 16 });
      s += rect(W * 0.82, 0, 90, H * 0.62, { fill: '#2a2e36', stroke: INK, strokeWidth: 3 }) + rect(W * 0.84, H * 0.3, 60, H * 0.32, { fill: '#bfe6ff', opacity: 0.2 });
      const r = rng('pb');
      for (let i = 0; i < 70; i++) { const x = r() * W, y = r() * H; s += line([x, y], [x - 6, y + 30], { stroke: '#a9b0a8', strokeWidth: 2, opacity: 0.35 }); }
      s += rect(0, H * 0.85, W, H * 0.15, { fill: '#ff2a4a', opacity: 0.1 });
      return s;
    },
    safeRoom: (W, H, o) => { // 4x4m concrete bunker, orange emergency light, iron cot
      const fl = H * (o.floor ?? 0.74);
      let s = grad(W, fl, '#2a2420', '#3a2e26');
      for (let i = 0; i < 6; i++) s += rect(i * 140, 0, 136, fl, { fill: i % 2 ? '#3a322c' : '#342c26', stroke: '#221c18', strokeWidth: 2 });
      s += rect(W * 0.44, 10, 90, 18, { fill: '#ff9a3a' }) + glow(W * 0.44 + 45, 20, 340, '#ff8a2a', 0.45);
      s += rect(0, fl, W, H - fl, { fill: '#2a2420' });
      for (let i = 0; i < 8; i++) s += line([0, fl + i * 24], [W, fl + i * 24], { stroke: '#1e1a16', strokeWidth: 2 });
      if (o.cot !== false) s += rect(W * 0.2, fl - 40, W * 0.6, 22, { fill: '#5a5e66', stroke: INK, strokeWidth: 3 }) + rect(W * 0.22, fl - 18, 10, 50, { fill: '#3a3e46' }) + rect(W * 0.76, fl - 18, 10, 50, { fill: '#3a3e46' }) + rect(W * 0.2, fl - 52, W * 0.6, 14, { fill: '#7a8070', stroke: INK, strokeWidth: 2 });
      if (o.ladder) s += rect(W * 0.06, 0, 12, fl, { fill: '#5a5e66' }) + rect(W * 0.06 + 60, 0, 12, fl, { fill: '#5a5e66' }) + path(Array.from({ length: 8 }, (_, i) => `M${W * 0.06},${30 + i * fl / 8} h70`).join(' '), { stroke: '#5a5e66', strokeWidth: 8 });
      if (o.monitor) s += rect(W * 0.8, fl - 170, 120, 80, { fill: '#0a1410', stroke: INK, strokeWidth: 3 }) + path(`M${W * 0.8 + 10},${fl - 120} l20,0 l10,-20 l10,30 l10,-10 l50,0`, { stroke: '#ff4a3a', strokeWidth: 3, fill: 'none' });
      if (o.empty) s += rect(0, 0, W, H, { fill: '#05040a', opacity: 0.55 }) + path(`M0,${fl - 30} L${W},${fl - 30}`, { stroke: '#8a8478', strokeWidth: 2, opacity: 0.2 });
      return s;
    },
    train: (W, H, o) => { // last subway car, window onto the neon valley of Zone Two
      let s = grad(W, H, '#1a1820', '#0e0c12');
      const wy = H * 0.12, wh = H * 0.42;
      s += rect(W * 0.04, wy, W * 0.92, wh, { fill: o.neon === false ? '#05040a' : '#2a0e2a', stroke: '#3a3842', strokeWidth: 10, rx: 20 });
      if (o.neon !== false) {
        s += glow(W * 0.5, wy + wh, W * 0.7, '#ff4aa0', 0.55);
        for (let i = 0; i < 9; i++) s += rect(W * 0.08 + i * 82, wy + wh - 40 - (i % 3) * 50, 60, 40 + (i % 3) * 50, { fill: ['#ff4aa0', '#b14bff', '#ff2a4a'][i % 3], opacity: 0.55 });
        s += rect(W * 0.3, wy + 30, W * 0.2, 50, { fill: '#ff8ad8', opacity: 0.4, rx: 10 });
      }
      s += rect(0, H * 0.6, W, H * 0.12, { fill: '#5a2a3a', stroke: INK, strokeWidth: 3 }) + rect(0, H * 0.72, W, H * 0.28, { fill: '#18161c' });
      for (const x of [W * 0.25, W * 0.75]) s += rect(x - 4, 0, 8, H * 0.6, { fill: '#8a8f9a' });
      return s;
    },

    // ---------- EP13-18: the Velvet District ----------
    velvetStreet: (W, H, o) => {
      let s = grad(W, H, '#1a0a26', '#2a0e2a');
      for (const x of [20, W - 70]) s += rect(x, 0, 50, H * 0.7, { fill: '#ffd0f0', opacity: 0.12 }) + rect(x + 10, 0, 6, H * 0.7, { fill: '#fff', opacity: 0.2 });
      const base = H * (o.horizon ?? 0.66);
      s += mansion(W * 0.02, base, 200, H * 0.42, '#2a1a36') + mansion(W * 0.32, base, 260, H * 0.52, '#22162e', '#b14bff') + mansion(W * 0.7, base, 230, H * 0.46, '#2e1430', '#ff2a4a');
      s += neonSign(W * 0.12, H * 0.1, 140, 34, '#ff4aa0') + neonSign(W * 0.62, H * 0.06, 120, 30, '#b14bff');
      if (o.holo) s += glow(W * 0.5, H * 0.2, 180, '#ff8ad8', 0.4) + path(`M${W * 0.5},${H * 0.06} C${W * 0.44},${H * 0.12} ${W * 0.46},${H * 0.28} ${W * 0.5},${H * 0.34} C${W * 0.56},${H * 0.26} ${W * 0.56},${H * 0.12} ${W * 0.5},${H * 0.06}Z`, { fill: '#ff8ad8', opacity: 0.45 });
      s += rect(0, base, W, H - base, { fill: '#0e0a12' });
      for (let i = 0; i < 6; i++) s += ellipse(W * (0.1 + i * 0.17), base + (H - base) * 0.5, 70, 10, { fill: ['#ff4aa0', '#b14bff', '#ff2a4a'][i % 3], opacity: 0.25 });
      for (let i = -6; i <= 6; i++) s += line([W / 2 + i * 30, base], [W / 2 + i * 150, H], { stroke: '#2a1a2e', strokeWidth: 2 });
      if (o.gate) s += path(`M${W * 0.18},${base} L${W * 0.18},${H * 0.22} Q${W / 2},${H * 0.02} ${W * 0.82},${H * 0.22} L${W * 0.82},${base}`, { stroke: '#2a2830', strokeWidth: 18, fill: 'none' }) + path(`M${W * 0.18},${H * 0.22} Q${W / 2},${H * 0.02} ${W * 0.82},${H * 0.22}`, { stroke: '#ff2a4a', strokeWidth: 6, fill: 'none' }) + glow(W / 2, H * 0.12, 200, '#ff2a4a', 0.3);
      s += rect(0, 0, W, H, { fill: '#ff8ad8', opacity: 0.05 });
      return s;
    },
    club: (W, H, o) => { // VIP lounge under a glass dome: chandeliers, velvet sofas
      const fl = H * (o.floor ?? 0.72);
      let s = grad(W, fl, '#2a0e22', '#3a1430');
      for (let i = -5; i <= 5; i++) s += path(`M${W / 2 + i * 20},0 Q${W / 2 + i * 90},${fl * 0.3} ${W / 2 + i * 170},${fl * 0.6}`, { stroke: '#4a2244', strokeWidth: 3, fill: 'none' });
      for (const x of [0.2, 0.5, 0.8]) s += path(`M${W * x},0 L${W * x},${fl * 0.12}`, { stroke: '#c9a0d8', strokeWidth: 2 }) + path(`M${W * x - 40},${fl * 0.12} L${W * x + 40},${fl * 0.12} L${W * x + 20},${fl * 0.24} L${W * x - 20},${fl * 0.24}Z`, { fill: '#f6d8ff', opacity: 0.6, stroke: '#b14bff', strokeWidth: 2 }) + glow(W * x, fl * 0.18, 120, '#ff8ad8', 0.4);
      s += rect(0, fl, W, H - fl, { fill: '#1a0a16' });
      if (o.sofa !== false) s += path(`M${W * 0.08},${fl} L${W * 0.08},${fl - 120} Q${W / 2},${fl - 220} ${W * 0.92},${fl - 120} L${W * 0.92},${fl}`, { fill: '#5a0e2a', stroke: INK, strokeWidth: 4 }) + path(`M${W * 0.1},${fl} L${W * 0.1},${fl - 60} L${W * 0.9},${fl - 60} L${W * 0.9},${fl}`, { fill: '#7a1a3a', stroke: INK, strokeWidth: 3 });
      if (o.table) s += ellipse(W / 2, fl + 30, 170, 30, { fill: '#cfe6ff', fillOpacity: 0.25, stroke: '#b14bff', strokeWidth: 3 });
      if (o.balcony) s += rect(0, fl - 20, W, 20, { fill: '#3a1430', stroke: INK, strokeWidth: 3 }) + path(Array.from({ length: 20 }, (_, i) => `M${i * 42},${fl - 20} l0,-60`).join(' '), { stroke: '#c9a040', strokeWidth: 4 }) + rect(0, fl - 86, W, 10, { fill: '#c9a040' });
      if (o.dressing) s += rect(W * 0.62, fl * 0.2, W * 0.3, fl * 0.62, { fill: '#cfe6ff', opacity: 0.18, stroke: '#e2b84a', strokeWidth: 6 }) + rect(W * 0.06, fl * 0.1, 10, fl * 0.5, { fill: '#c9a040' }) + rect(W * 0.06, fl * 0.12, W * 0.4, 6, { fill: '#c9a040' });
      return s;
    },
    hotelRoom: (W, H, o) => { // Hotel Nocturne, room 909: warm orange lamp, wide bed
      const fl = H * (o.floor ?? 0.76);
      let s = grad(W, fl, '#3a2218', '#4a2c1e');
      for (let i = 0; i < 7; i++) s += rect(i * 120, 0, 118, fl, { fill: i % 2 ? '#3e2418' : '#46281c' });
      s += glow(W * 0.85, fl * 0.4, 300, '#ffb04a', 0.6) + path(`M${W * 0.82},${fl * 0.3} L${W * 0.88},${fl * 0.3} L${W * 0.92},${fl * 0.42} L${W * 0.78},${fl * 0.42}Z`, { fill: '#ffd08a', stroke: INK, strokeWidth: 2 });
      s += rect(0, fl, W, H - fl, { fill: '#2a1810' });
      if (o.bed !== false) s += rect(W * 0.04, fl * 0.42, 40, fl * 0.58, { fill: '#2a1408', stroke: INK, strokeWidth: 3 }) + rect(W * 0.04, fl * 0.74, W * 0.8, fl * 0.26 + 30, { fill: '#e8dccc', stroke: INK, strokeWidth: 3 }) + rect(W * 0.08, fl * 0.66, 160, 40, { fill: '#f6eee2', stroke: INK, strokeWidth: 3, rx: 16 }) + rect(W * 0.34, fl * 0.8, W * 0.5, fl * 0.2 + 30, { fill: '#7a2a2a', stroke: INK, strokeWidth: 3 });
      if (o.morning) s += rect(0, 0, W, H, { fill: '#ff8ad8', opacity: 0.08 });
      return s;
    },
    casino: (W, H, o) => { // inner casino hall: ruby and gold neon, roulette wheels
      const fl = H * (o.floor ?? 0.7);
      let s = grad(W, fl, '#2a0408', '#4a0a12');
      for (let i = 0; i < 6; i++) s += rect(i * 140 + 20, fl * 0.15, 40, fl * 0.85, { fill: '#3a0810', stroke: '#c9a040', strokeWidth: 2 });
      s += glow(W * 0.2, fl * 0.2, 240, '#ff2a3a', 0.4) + glow(W * 0.8, fl * 0.3, 240, '#e8c25a', 0.35);
      for (let i = 0; i < 5; i++) s += circle(W * (0.1 + i * 0.2), fl * 0.08, 14, { fill: '#e8c25a', opacity: 0.8 });
      s += rect(0, fl, W, H - fl, { fill: '#e8e0d4' });
      for (let i = 0; i < 10; i++) s += line([i * 90, fl], [i * 90 - 120, H], { stroke: '#cfc6b6', strokeWidth: 2 });
      if (o.crowd) { const r = rng('cc'); for (let i = 0; i < 14; i++) { const x = r() * W, y = fl + 10 + r() * 30; s += ellipse(x, y - 60, 16, 18, { fill: '#2a1a24', opacity: 0.85 }) + rect(x - 22, y - 44, 44, 80, { fill: '#2a1a24', opacity: 0.85, rx: 12 }); } }
      if (o.cracked) s += path(`M${W * 0.1},${H} L${W * 0.3},${fl + 40} L${W * 0.42},${fl + 90} L${W * 0.6},${fl + 30} L${W * 0.9},${H}`, { stroke: '#2a1a14', strokeWidth: 6, fill: 'none' }) + path(`M${W * 0.3},${fl + 40} l-30,60 M${W * 0.6},${fl + 30} l40,50`, { stroke: '#2a1a14', strokeWidth: 4 });
      if (o.vent) s += rect(W * 0.7, fl * 0.02, 160, 60, { fill: '#1a0406', stroke: '#5a3a3a', strokeWidth: 4 }) + path(Array.from({ length: 6 }, (_, i) => `M${W * 0.7 + 10 + i * 24},${fl * 0.02 + 6} l0,48`).join(' '), { stroke: '#5a3a3a', strokeWidth: 3 });
      return s;
    },
    backAlley: (W, H, o) => { // narrow brick alley behind the casino: steam pipes, purple neon
      let s = grad(W, H, '#140c1c', '#0c0812');
      for (let r = 0; r < 18; r++) for (let k = 0; k < 9; k++) s += rect(k * 90 + (r % 2) * 45 - 45, r * 40, 86, 36, { fill: '#2a1a2a', stroke: '#140c16', strokeWidth: 2 });
      s += rect(0, H * 0.2, W, 22, { fill: '#5a5a62', stroke: INK, strokeWidth: 3 }) + rect(0, H * 0.28, W, 14, { fill: '#4a4a52', stroke: INK, strokeWidth: 2 });
      for (let i = 0; i < 4; i++) s += circle(W * (0.2 + i * 0.22), H * 0.18, 26, { fill: '#e8e4f0', opacity: 0.2 });
      s += neonSign(W * 0.64, H * 0.4, 100, 26, '#b14bff');
      s += rect(0, H * 0.78, W, H * 0.22, { fill: '#100a14' });
      if (o.crate) s += rect(W * 0.04, H * 0.66, 150, 100, { fill: '#6a4a30', stroke: INK, strokeWidth: 3 }) + path(`M${W * 0.04},${H * 0.66} l150,100 M${W * 0.04 + 150},${H * 0.66} l-150,100`, { stroke: '#4a3020', strokeWidth: 3 });
      if (o.bin) s += rect(W * 0.72, H * 0.64, 130, 110, { fill: '#3a4a44', stroke: INK, strokeWidth: 3 }) + rect(W * 0.71, H * 0.62, 140, 18, { fill: '#2a3a34', stroke: INK, strokeWidth: 3 });
      return s;
    },
    viaduct: (W, H, o) => { // Outer Silk Viaduct: elevated 4-lane road, pink rose neon arches
      let s = grad(W, H, '#120818', '#2a0c26');
      s += glow(W / 2, H * 0.4, W * 0.6, '#ff4aa0', 0.25);
      if (o.mansion) s += rect(W * 0.38, H * 0.12, W * 0.24, H * 0.3, { fill: '#e8e4ec', stroke: INK, strokeWidth: 3 }) + path(`M${W * 0.36},${H * 0.12} L${W / 2},${H * 0.04} L${W * 0.64},${H * 0.12}Z`, { fill: '#f2eef6', stroke: INK, strokeWidth: 3 }) + glow(W / 2, H * 0.24, 200, '#b14bff', 0.35);
      const vy = H * (o.horizon ?? 0.45);
      s += poly([[W / 2 - 40, vy], [W / 2 + 40, vy], [W + 200, H], [-200, H]], { fill: '#2a262e', stroke: INK, strokeWidth: 3 });
      for (let k = 0; k < 8; k++) { const t = Math.pow((k + 1) / 9, 1.7); s += rect(W / 2 - 4 - t * 6, vy + (H - vy) * t, 8 + t * 12, 18 + t * 40, { fill: '#e8e4dc', opacity: 0.8 }); }
      for (const side of [-1, 1]) s += path(`M${W / 2 + side * 40},${vy} L${W / 2 + side * (W / 2 + 200)},${H}`, { stroke: '#ff4aa0', strokeWidth: 4, opacity: 0.6 });
      for (let k = 0; k < 3; k++) { const t = 0.15 + k * 0.3, y = vy + (H - vy) * t * 0.6, w = 120 + t * 700, top = y - (120 + t * 500); s += path(`M${W / 2 - w / 2},${y} Q${W / 2},${top} ${W / 2 + w / 2},${y}`, { stroke: '#ff5ab8', strokeWidth: 4 + t * 10, fill: 'none', opacity: 0.85 }) + circle(W / 2, top + (y - top) * 0.45, 10 + t * 30, { fill: '#ff8ad8', opacity: 0.7 }) + glow(W / 2, top + (y - top) * 0.45, 60 + t * 140, '#ff4aa0', 0.35); }
      if (o.crack) s += path(`M${W * 0.2},${H * 0.86} L${W * 0.36},${H * 0.8} L${W * 0.5},${H * 0.88} L${W * 0.66},${H * 0.8} L${W * 0.8},${H * 0.86}`, { stroke: '#0b0a10', strokeWidth: 6, fill: 'none' }) + path(`M${W * 0.36},${H * 0.8} q20,-20 0,-30 M${W * 0.62},${H * 0.82} q-10,-20 6,-30`, { stroke: '#e8e4dc', strokeWidth: 3, fill: 'none', opacity: 0.3 });
      if (o.slab) s += poly([[W * 0.08, H], [W * 0.14, H * 0.3], [W * 0.88, H * 0.26], [W * 0.92, H]], { fill: '#3a3640', stroke: INK, strokeWidth: 5 }) + path(`M${W * 0.14},${H * 0.3} L${W * 0.88},${H * 0.26}`, { stroke: '#7a7680', strokeWidth: 6 }) + path(`M${W * 0.3},${H * 0.5} l40,60 l-20,50 M${W * 0.6},${H * 0.4} l-30,80`, { stroke: '#1a181e', strokeWidth: 4, fill: 'none' });
      return s;
    },
    sculptureGarden: (W, H, o) => { // white marble garden before the Porcelain Conservatory
      let s = grad(W, H, '#2a1a3a', '#3a2a4a');
      s += rect(W * 0.18, H * 0.04, W * 0.64, H * 0.4, { fill: '#e8e4ec', stroke: INK, strokeWidth: 3 }) + path(`M${W * 0.15},${H * 0.04} L${W / 2},${-H * 0.04} L${W * 0.85},${H * 0.04}Z`, { fill: '#f2eef6', stroke: INK, strokeWidth: 3 });
      for (let i = 0; i < 6; i++) s += rect(W * 0.22 + i * W * 0.1, H * 0.1, 26, H * 0.3, { fill: '#b14bff', opacity: 0.3, rx: 13 });
      s += rect(0, H * 0.44, W, H * 0.56, { fill: '#ccc6d2' });
      for (let i = -8; i <= 8; i++) s += line([W / 2 + i * 30, H * 0.44], [W / 2 + i * 140, H], { stroke: '#b8b0c0', strokeWidth: 2 });
      for (let k = 0; k < 7; k++) { const y = H * 0.44 + (H * 0.56) * Math.pow(k / 7, 1.5); s += line([0, y], [W, y], { stroke: '#b8b0c0', strokeWidth: 2 }); }
      if (o.fountain !== false) s += ellipse(W / 2, H * 0.62, 150, 34, { fill: '#a9a2b2', stroke: INK, strokeWidth: 3 }) + ellipse(W / 2, H * 0.6, 120, 22, { fill: '#8a8494' }) + rect(W / 2 - 14, H * 0.48, 28, H * 0.12, { fill: '#d8d2de', stroke: INK, strokeWidth: 3 });
      for (const [x, y] of [[0.06, 0.8], [0.12, 0.92], [0.88, 0.82], [0.94, 0.94], [0.03, 0.62], [0.97, 0.64]]) s += lily(W * x, H * y, 1.2);
      s += rect(0, H * 0.3, W, H * 0.4, { fill: '#b14bff', opacity: 0.12 });
      return s;
    },
    gallery: (W, H, o) => { // the Upper Sanctuary: white marble corridor, tall glass display cases
      const fl = H * (o.floor ?? 0.74);
      let s = grad(W, fl, '#e8e4ec', '#d6d0dc');
      for (let i = 0; i < 5; i++) s += rect(i * 180 + 10, 0, 40, fl, { fill: '#f2eef6', stroke: '#c9c0d2', strokeWidth: 2 });
      s += rect(0, 0, W, 14, { fill: '#b14bff', opacity: 0.6 }) + glow(W / 2, 0, W * 0.6, '#b14bff', 0.35);
      if (o.cases !== false) for (let i = 0; i < 4; i++) { const x = 60 + i * 190; s += rect(x, fl * 0.18, 110, fl * 0.8, { fill: '#cfe6ff', opacity: 0.22, stroke: '#9aa0b8', strokeWidth: 4 }) + rect(x, fl * 0.98 - 10, 110, 14, { fill: '#c9a040', stroke: INK, strokeWidth: 2 }); }
      s += rect(0, fl, W, H - fl, { fill: '#e2dce8' });
      for (let i = -8; i <= 8; i++) s += line([W / 2 + i * 30, fl], [W / 2 + i * 120, H], { stroke: '#cfc6d6', strokeWidth: 2 });
      if (o.throne) s += path(`M${W * 0.36},${fl} L${W * 0.36},${fl * 0.5} Q${W / 2},${fl * 0.3} ${W * 0.64},${fl * 0.5} L${W * 0.64},${fl}Z`, { fill: '#4a1e5a', stroke: '#e2b84a', strokeWidth: 6 }) + rect(W * 0.34, fl - 60, W * 0.32, 60, { fill: '#5a2a6a', stroke: INK, strokeWidth: 3 });
      if (o.wrecked) s += rect(0, 0, W, H, { fill: '#3a2a3a', opacity: 0.35 }) + path(`M0,${fl + 20} l80,-40 l40,40 l80,-30 l60,40 M${W},${fl + 30} l-100,-40 l-40,50 l-60,-30`, { stroke: INK, strokeWidth: 4, fill: '#9a909e' }) + path(`M${W * 0.2},0 l30,80 l-20,60 M${W * 0.7},0 l-20,90`, { stroke: '#5a4a5a', strokeWidth: 5, fill: 'none' });
      if (o.dark) s += rect(0, 0, W, H, { fill: '#0a050c', opacity: 0.5 });
      return s;
    },
    outskirts: (W, H, o) => { // muddy ruins far outside the district, rain from the cave roof
      let s = grad(W, H, '#14181e', '#22262a');
      const r = rng('os' + H);
      for (let i = 0; i < 7; i++) { const x = i * 120 - 30, h = 80 + r() * 200; s += poly([[x, H * 0.66], [x + 10, H * 0.66 - h], [x + 50, H * 0.66 - h + 30], [x + 70, H * 0.66 - h - 20], [x + 110, H * 0.66]], { fill: '#2a2e34', stroke: INK, strokeWidth: 2 }); }
      s += rect(0, H * 0.66, W, H * 0.34, { fill: '#3a3228' });
      for (let i = 0; i < 6; i++) s += ellipse(r() * W, H * (0.74 + r() * 0.2), 90, 12, { fill: '#5a5a5e', opacity: 0.5 });
      if (o.fog) s += rect(0, H * 0.3, W, H * 0.7, { fill: '#4a5aa0', opacity: 0.25 }) + ellipse(W / 2, H * 0.7, W * 0.7, 120, { fill: '#6a7ac0', opacity: 0.2 });
      if (o.fire) s += glow(W * 0.2, H * 0.72, 120, '#ff8a2a', 0.6) + path(`M${W * 0.2 - 20},${H * 0.74} q20,-50 40,0Z`, { fill: '#ffb04a' });
      if (o.rain !== false) for (let i = 0; i < 90; i++) { const x = r() * W, y = r() * H; s += line([x, y], [x - 6, y + 30], { stroke: '#a9b0b8', strokeWidth: 2, opacity: 0.45 }); }
      return s;
    },

    // ---------- EP19-20: Haunted Village / Millennium Manor ----------
    village: (W, H, o) => { // Spirit-Lantern Road: ruined two-storey wooden houses, green ghost lamps
      let s = grad(W, H, '#0a1018', '#121c26');
      const base = H * (o.horizon ?? 0.7);
      const house = (x, w, h, tilt) => path(`M${x},${base} L${x},${base - h} L${x + w / 2},${base - h - 50 + tilt} L${x + w},${base - h + tilt} L${x + w},${base}Z`, { fill: '#2a2a26', stroke: INK, strokeWidth: 3 }) + rect(x + 14, base - h + 30, w * 0.3, 40, { fill: '#0a0c10' }) + rect(x + w * 0.56, base - h * 0.5, w * 0.3, h * 0.5, { fill: '#0a0c10' }) + path(`M${x + 6},${base} q-10,-${h * 0.5} 10,-${h * 0.9} M${x + w - 6},${base} q10,-${h * 0.4} -6,-${h * 0.8}`, { stroke: '#121414', strokeWidth: 4, fill: 'none' });
      s += house(-30, 230, H * 0.34, 20) + house(W - 210, 240, H * 0.4, -30);
      if (o.lanterns !== false) for (const [x, k] of [[W * 0.32, 1], [W * 0.68, 0.8]]) s += rect(x - 10, base - 200 * k, 20, 200 * k, { fill: '#4a4a46', stroke: INK, strokeWidth: 2 }) + rect(x - 22, base - 240 * k, 44, 44, { fill: '#1a2a1a', stroke: INK, strokeWidth: 3 }) + circle(x, base - 218 * k, 12, { fill: '#7aff9a', opacity: 0.8 }) + glow(x, base - 218 * k, 90, '#4aff7a', 0.35);
      s += rect(0, base, W, H - base, { fill: '#1a1e22' });
      for (let i = 0; i < 9; i++) s += ellipse(W * (i / 8), base + 30 + (i % 3) * 30, 70, 14, { fill: '#2a3036', stroke: '#121416', strokeWidth: 2 });
      if (o.bridge) s += rect(W * 0.1, base - 10, W * 0.8, 24, { fill: '#4a4a48', stroke: INK, strokeWidth: 3 }) + rect(0, base + 14, W, H - base, { fill: '#05060a' }) + path(`M0,${base + 50} q100,-10 200,0 t200,0 t200,0 t200,0`, { stroke: '#1a2030', strokeWidth: 3, fill: 'none' });
      s += rect(0, H * 0.35, W, H * 0.65, { fill: '#4a6ab0', opacity: 0.16 });
      if (o.fog !== false) for (let i = 0; i < 6; i++) s += ellipse(W * (i / 5), base - 20 + (i % 2) * 40, 220, 50, { fill: '#7a8ab8', opacity: 0.16 });
      if (o.lightCircle) s += circle(W * (o.lx ?? 0.5), H * (o.ly ?? 0.8), 260, { fill: '#b9a8ff', opacity: 0.12 });
      return s;
    },
    villageGate: (W, H) => { // the rotten wooden gate where Knell waits with his lantern
      let s = grad(W, H, '#0c1222', '#1a2238');
      s += rect(0, H * 0.3, W, H * 0.7, { fill: '#4a5aa0', opacity: 0.22 });
      s += rect(W * 0.18, H * 0.16, 40, H * 0.74, { fill: '#3a3228', stroke: INK, strokeWidth: 3 }) + rect(W * 0.78, H * 0.18, 40, H * 0.72, { fill: '#3a3228', stroke: INK, strokeWidth: 3 });
      s += path(`M${W * 0.12},${H * 0.2} L${W * 0.88},${H * 0.14} L${W * 0.9},${H * 0.2} L${W * 0.12},${H * 0.26}Z`, { fill: '#3a3228', stroke: INK, strokeWidth: 3 }) + path(`M${W * 0.5},${H * 0.17} l20,30 l-30,20`, { stroke: '#1a140e', strokeWidth: 4, fill: 'none' });
      s += rect(0, H * 0.88, W, H * 0.12, { fill: '#141820' });
      for (let i = 0; i < 6; i++) s += ellipse(W * (i / 5), H * (0.6 + (i % 2) * 0.2), 200, 50, { fill: '#7a8ab8', opacity: 0.18 });
      return s;
    },
    manorExterior: (W, H, o) => { // the black gothic Millennium Manor on its rocky hill
      let s = grad(W, H, '#0a0e1a', '#1a2234');
      s += rect(0, H * 0.2, W, H * 0.8, { fill: '#4a5aa0', opacity: 0.12 });
      const hill = H * 0.68;
      s += path(`M0,${hill + 60} Q${W * 0.3},${hill - 40} ${W * 0.5},${hill - 50} Q${W * 0.7},${hill - 40} ${W},${hill + 60} L${W},${H} L0,${H}Z`, { fill: '#1a1a22', stroke: INK, strokeWidth: 3 });
      s += rect(W * 0.26, H * 0.3, W * 0.48, hill - H * 0.3, { fill: '#121218', stroke: INK, strokeWidth: 4 });
      for (const [x, w, top] of [[0.2, 60, 0.08], [0.32, 50, 0.14], [0.46, 80, 0.02], [0.62, 50, 0.12], [0.74, 60, 0.06]]) s += rect(W * x, H * top + 60, w, hill - H * top, { fill: '#16161e', stroke: INK, strokeWidth: 3 }) + path(`M${W * x - 6},${H * top + 60} L${W * x + w / 2},${H * top} L${W * x + w + 6},${H * top + 60}Z`, { fill: '#16161e', stroke: INK, strokeWidth: 3 });
      for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) s += path(`M${W * 0.3 + k * 56},${H * 0.4 + r * 70 + 40} L${W * 0.3 + k * 56},${H * 0.4 + r * 70 + 14} Q${W * 0.3 + k * 56 + 11},${H * 0.4 + r * 70} ${W * 0.3 + k * 56 + 22},${H * 0.4 + r * 70 + 14} L${W * 0.3 + k * 56 + 22},${H * 0.4 + r * 70 + 40}Z`, { fill: (r + k) % 3 ? '#2a2a3a' : '#ffb04a', opacity: 0.85 });
      if (o.forge !== false) s += glow(W * 0.88, hill, 140, '#ff8a2a', 0.5) + path(`M${W * 0.88},${hill - 40} q-10,-40 6,-80 q-14,-30 4,-60`, { stroke: '#ff8a2a', strokeWidth: 8, fill: 'none', opacity: 0.4 });
      if (o.gate) s += path(`M${W * 0.2},${H} L${W * 0.2},${H * 0.74} Q${W / 2},${H * 0.62} ${W * 0.8},${H * 0.74} L${W * 0.8},${H}`, { stroke: '#2a2a30', strokeWidth: 10, fill: 'none' }) + path(Array.from({ length: 13 }, (_, i) => `M${W * 0.2 + i * W * 0.05},${H} L${W * 0.2 + i * W * 0.05},${H * 0.72}`).join(' '), { stroke: '#2a2a30', strokeWidth: 5 });
      if (o.yard) s += rect(0, H * 0.84, W, H * 0.16, { fill: '#2a2a30' }) + path(Array.from({ length: 10 }, (_, i) => `M${i * 90},${H * 0.84} l-40,${H * 0.16}`).join(' '), { stroke: '#1a1a20', strokeWidth: 2 });
      for (let i = 0; i < 5; i++) s += ellipse(W * (i / 4), H * (0.72 + (i % 2) * 0.12), 240, 50, { fill: '#7a8ab8', opacity: 0.16 });
      return s;
    },
    manorHall: (W, H, o) => { // marble hall: faded crimson carpet, spiral stair, balcony
      const fl = H * (o.floor ?? 0.74);
      let s = grad(W, fl, '#1a1820', '#24222c');
      for (const x of [0.06, 0.94]) s += rect(W * x - 30, 0, 60, fl, { fill: '#e2dee6', stroke: INK, strokeWidth: 3 }) + rect(W * x - 22, 0, 8, fl, { fill: '#fff', opacity: 0.4 });
      if (o.stairs !== false) s += path(`M${W * 0.62},${fl} C${W * 0.62},${fl * 0.6} ${W * 0.9},${fl * 0.5} ${W * 0.8},${fl * 0.2}`, { stroke: '#d6d2da', strokeWidth: 60, fill: 'none' }) + path(`M${W * 0.62},${fl} C${W * 0.62},${fl * 0.6} ${W * 0.9},${fl * 0.5} ${W * 0.8},${fl * 0.2}`, { stroke: '#7a1a24', strokeWidth: 26, fill: 'none', opacity: 0.6 });
      s += rect(0, fl * 0.24, W, 18, { fill: '#2a2224', stroke: INK, strokeWidth: 3 }) + path(Array.from({ length: 20 }, (_, i) => `M${i * 42},${fl * 0.24} l0,-60`).join(' '), { stroke: '#3a3034', strokeWidth: 5 }) + rect(0, fl * 0.24 - 66, W, 10, { fill: '#3a3034' });
      s += glow(W * 0.5, fl * 0.05, 200, '#ffb04a', 0.3);
      s += rect(0, fl, W, H - fl, { fill: '#d6d2da' });
      for (let i = -8; i <= 8; i++) s += line([W / 2 + i * 30, fl], [W / 2 + i * 130, H], { stroke: '#bcb6c2', strokeWidth: 2 });
      s += poly([[W * 0.4, fl], [W * 0.6, fl], [W * 0.78, H], [W * 0.22, H]], { fill: '#6a1a22', opacity: 0.8 });
      if (o.door) s += path(`M${W * 0.36},${fl} L${W * 0.36},${fl * 0.42} Q${W / 2},${fl * 0.26} ${W * 0.64},${fl * 0.42} L${W * 0.64},${fl}Z`, { fill: '#121014', stroke: INK, strokeWidth: 6 }) + path(`M${W / 2},${fl * 0.34} L${W / 2},${fl}`, { stroke: '#2a2428', strokeWidth: 4 });
      if (o.cage) s += rect(W * 0.04, fl - 200, 170, 200, { fill: 'none', stroke: '#5a5a62', strokeWidth: 4 }) + path(Array.from({ length: 8 }, (_, i) => `M${W * 0.04 + i * 24},${fl - 200} l0,200`).join(' '), { stroke: '#5a5a62', strokeWidth: 4 });
      return s;
    },
    bellYard: (W, H, o) => { // the nine-bell graveyard yard: stone pillars with clapperless bronze bells
      let s = grad(W, H, '#0c1018', '#1a1e2a');
      const base = H * (o.horizon ?? 0.6);
      const pillar = (x, h, s0) => rect(x - 18 * s0, base - h, 36 * s0, h, { fill: '#4a4a52', stroke: INK, strokeWidth: 3 }) + path(`M${x - 34 * s0},${base - h + 4} C${x - 34 * s0},${base - h - 60 * s0} ${x + 34 * s0},${base - h - 60 * s0} ${x + 34 * s0},${base - h + 4}Z`, { fill: '#9a6a2a', stroke: INK, strokeWidth: 3 }) + rect(x - 40 * s0, base - h, 80 * s0, 10 * s0, { fill: '#7a4a1a' });
      const ps = [[0.06, 260, 0.9], [0.2, 300, 1], [0.34, 240, 0.7], [0.5, 220, 0.6], [0.66, 240, 0.7], [0.8, 300, 1], [0.94, 260, 0.9]];
      for (const [x, h, k] of ps) s += pillar(W * x, h, k);
      s += rect(0, base, W, H - base, { fill: '#3a3a40' });
      for (let i = -8; i <= 8; i++) s += line([W / 2 + i * 40, base], [W / 2 + i * 160, H], { stroke: '#2a2a30', strokeWidth: 2 });
      for (let k = 1; k < 6; k++) { const y = base + (H - base) * Math.pow(k / 6, 1.5); s += line([0, y], [W, y], { stroke: '#2a2a30', strokeWidth: 2 }); }
      if (o.chains) for (const [x, h] of ps) s += path(`M${W * 0.5},${base + (H - base) * 0.4} Q${(W * x + W * 0.5) / 2},${base} ${W * x},${base - h + 30}`, { stroke: '#8a8f9a', strokeWidth: 2.4, fill: 'none', strokeDasharray: '6 3' });
      for (let i = 0; i < 6; i++) s += ellipse(W * (i / 5), base + 40 + (i % 2) * 60, 260, 50, { fill: '#7a8ab8', opacity: 0.18 });
      if (o.pulse) s += circle(W / 2, base + (H - base) * 0.4, 200, { fill: 'none', stroke: '#cfe6ff', strokeWidth: 6, opacity: 0.4 }) + circle(W / 2, base + (H - base) * 0.4, 320, { fill: 'none', stroke: '#cfe6ff', strokeWidth: 4, opacity: 0.25 });
      return s;
    },
    bellTower: (W, H) => { // the stone bell gate in the deepest fog
      let s = grad(W, H, '#0c1222', '#16203a');
      s += rect(0, 0, W, H, { fill: '#3a5aa0', opacity: 0.25 });
      s += rect(W * 0.36, H * 0.14, W * 0.28, H * 0.86, { fill: '#3a3a42', stroke: INK, strokeWidth: 4 }) + path(`M${W * 0.32},${H * 0.14} L${W / 2},${H * 0.02} L${W * 0.68},${H * 0.14}Z`, { fill: '#2a2a32', stroke: INK, strokeWidth: 4 });
      s += path(`M${W * 0.42},${H * 0.5} L${W * 0.42},${H * 0.32} Q${W / 2},${H * 0.24} ${W * 0.58},${H * 0.32} L${W * 0.58},${H * 0.5}Z`, { fill: '#0a0c14' });
      for (let i = 0; i < 6; i++) s += ellipse(W * (i / 5), H * (0.6 + (i % 2) * 0.2), 240, 60, { fill: '#7a8ab8', opacity: 0.2 });
      return s;
    },
  };
  return BG2;
};
