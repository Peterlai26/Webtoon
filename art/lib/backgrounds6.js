// Locations of source chapters 66-70 (Arc 7): the warp altar's control pillar
// (ch.66), the nightless white desert under a sun that never moves (ch.66-67),
// the slime-padded transport chamber inside Shai-Gorm (ch.67), the reception
// basin and the Mirage Stone Hall of the Mirage Sand Palace (ch.68), the
// canyon city of Kala-Zahr by day and under the stone curtains (ch.69-70), the
// guest house on the outer aqueduct (ch.69-70) and the southern aqueduct
// station behind Haran's forge (ch.70). Merged into BG by backgrounds.js.
'use strict';
const { INK, rng, path, circle, ellipse, rect, line, poly } = require('./util');

module.exports = function bg6({ grad, glow }) {
  const dunes = (W, H, y0, seed, c1 = '#f4eedf', c2 = '#e6dcc4') => {
    const r = rng(seed); let s = '';
    for (let k = 0; k < 3; k++) {
      const y = y0 + k * (H - y0) * 0.28; let d = `M0,${y}`;
      for (let x = 0; x <= W; x += 100) d += ` Q${x + 50},${y - 30 - r() * 50} ${x + 100},${y + (r() - 0.5) * 20}`;
      s += path(d + ` L${W},${H} L0,${H}Z`, { fill: k % 2 ? c2 : c1, stroke: '#cbbd9e', strokeWidth: 2 });
    }
    for (let i = 0; i < 30; i++) s += circle(r() * W, y0 + r() * (H - y0), 1.6, { fill: '#ffffff', opacity: 0.9 }); // silica glints
    return s;
  };
  const sandstone = (W, H, c = '#d8b894', lc = '#b8946c') => { const r = rng('ss' + W + H + c); let s = rect(0, 0, W, H, { fill: c }); for (let i = 0; i < 14; i++) s += line([0, r() * H], [W, r() * H], { stroke: lc, strokeWidth: 2, opacity: 0.6 }); return s; };
  const lamps = (W, y0, y1, n, seed) => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x = r() * W, y = y0 + r() * (y1 - y0), c = r() > 0.4 ? '#7ad8ff' : '#c8a8ff'; s += glow(x, y, 26, c, 0.5) + circle(x, y, 5, { fill: c }); } return s; };
  const cliffHouses = (W, H, night, seed) => {
    const r = rng(seed); let s = '';
    for (const side of [0, 1]) {
      const x0 = side ? W * 0.72 : 0, w0 = W * 0.28;
      s += rect(x0, 0, w0, H, { fill: night ? '#3a2e34' : '#d8a888', stroke: INK, strokeWidth: 3 });
      for (let i = 0; i < 9; i++) {
        const x = x0 + 16 + r() * (w0 - 70), y = 40 + r() * H * 0.62, w = 40 + r() * 30, h = 34 + r() * 26;
        s += rect(x, y, w, h, { fill: night ? '#1a1418' : '#8a5a42', stroke: INK, strokeWidth: 2, rx: 10 });
        if (night && r() > 0.3) s += glow(x + w / 2, y + h / 2, 24, '#7ad8ff', 0.5);
      }
    }
    return s;
  };
  return {
    // close on the warp altar's three-ring control pillar (ch.66 L51-55)
    warpAltar: (W, H, o) => {
      let s = grad(W, H, '#05060a', '#0e1210') + glow(W / 2, H * 0.2, W * 0.6, '#3aff9a', o.lit ? 0.45 : 0.18);
      s += rect(W * 0.2, H * 0.36, W * 0.6, H * 0.64, { fill: '#1a1a1e', stroke: INK, strokeWidth: 4 });
      for (let i = 0; i < 3; i++) s += ellipse(W / 2, H * 0.5, W * (0.26 - i * 0.07), H * (0.1 - i * 0.025), { fill: ['#2a2a30', '#34343a', '#3e3e44'][i], stroke: o.lit ? '#e2b84a' : '#5a5a42', strokeWidth: 4 });
      s += ellipse(W / 2, H * 0.5, W * 0.06, H * 0.022, { fill: '#0a0a0c', stroke: '#e2b84a', strokeWidth: 3 });
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; s += circle(W / 2 + Math.cos(a) * W * 0.09, H * 0.5 + Math.sin(a) * H * 0.032, 5, { fill: '#9aa0aa', stroke: INK, strokeWidth: 1.6 }); }
      if (o.lit) s += glow(W / 2, H * 0.5, W * 0.3, '#ffd45a', 0.5);
      return s;
    },
    // the white-gold desert; o.sun, o.pillar (broken warp pillar), o.canyon (far ridge), o.ridge (standing on a dune top)
    whiteDesert: (W, H, o) => {
      let s = grad(W, H, '#bcd8e8', '#eef2ee');
      if (o.sun !== false) s += glow(W * (o.sx ?? 0.5), H * (o.sy ?? 0.06), W * 0.5, '#fff7d0', 0.8) + circle(W * (o.sx ?? 0.5), H * (o.sy ?? 0.06), W * 0.08, { fill: '#fffbe8' });
      if (o.canyon) s += path(`M0,${H * 0.46} L${W * 0.12},${H * 0.38} L${W * 0.24},${H * 0.42} L${W * 0.34},${H * 0.34} L${W * 0.5},${H * 0.4} L${W * 0.62},${H * 0.33} L${W * 0.78},${H * 0.4} L${W},${H * 0.36} L${W},${H * 0.5} L0,${H * 0.5}Z`, { fill: '#d8a888', stroke: '#b88a6a', strokeWidth: 3, opacity: o.near ? 1 : 0.7 });
      s += dunes(W, H, H * (o.horizon ?? 0.48), 'wd' + (o.seed || ''));
      if (o.pillar) s += poly([[W * 0.66, H * 0.86], [W * 0.68, H * 0.42], [W * 0.75, H * 0.38], [W * 0.78, H * 0.48], [W * 0.8, H * 0.86]], { fill: '#d8c8a8', stroke: INK, strokeWidth: 4 }) + path(`M${W * 0.7},${H * 0.5} l20,0 M${W * 0.7},${H * 0.6} l30,0 M${W * 0.7},${H * 0.7} l24,0`, { stroke: '#a8987c', strokeWidth: 4 }) + poly([[W * 0.68, H * 0.86], [W * 0.84, H * 0.86], [W * 0.9, H * 0.92], [W * 0.6, H * 0.92]], { fill: '#e6dcc4' });
      if (o.haze) for (let i = 0; i < 5; i++) s += path(`M0,${H * (0.5 + i * 0.05)} Q${W * 0.25},${H * (0.49 + i * 0.05)} ${W * 0.5},${H * (0.5 + i * 0.05)} T${W},${H * (0.5 + i * 0.05)}`, { stroke: '#ffffff', strokeWidth: 3, opacity: 0.35, fill: 'none' });
      return s;
    },
    // inside Shai-Gorm's transport chamber: a metre of pale-blue glowing gel, air sacs, amber resonance rings (ch.67 L181, L203)
    wormGut: (W, H, o) => {
      let s = grad(W, H, '#3a2a34', '#5a3a44');
      s += ellipse(W / 2, H * 0.5, W * 0.62, H * 0.56, { fill: '#7ad8ff', opacity: 0.18 });
      for (let i = 0; i < 7; i++) s += path(`M0,${H * (0.1 + i * 0.13)} Q${W / 2},${H * (0.06 + i * 0.13)} ${W},${H * (0.1 + i * 0.13)}`, { stroke: '#7a4a54', strokeWidth: 8, fill: 'none', opacity: 0.6 });
      for (const [x, y] of [[0.2, 0.12], [0.5, 0.08], [0.8, 0.12]]) s += ellipse(W * x, H * y, 60, 30, { fill: '#c8a0a8', stroke: INK, strokeWidth: 3 }) + path(`M${W * x - 20},${H * y + 26} q20,20 40,0`, { stroke: '#e9f8ff', strokeWidth: 3, fill: 'none', opacity: 0.7 });
      for (const [x, y] of [[0.1, 0.3], [0.9, 0.34], [0.12, 0.62], [0.88, 0.6]]) s += circle(W * x, H * y, 26, { fill: 'none', stroke: '#e8a020', strokeWidth: 6, opacity: o.pulse ? 1 : 0.7 }) + (o.pulse ? glow(W * x, H * y, 50, '#ffb04a', 0.5) : '');
      s += path(`M0,${H * 0.72} Q${W / 2},${H * 0.66} ${W},${H * 0.72} L${W},${H} L0,${H}Z`, { fill: '#9ae8ff', opacity: 0.45, stroke: '#cff6ff', strokeWidth: 3 });
      return s;
    },
    // the round reception basin under the quartz-studded rock roof; guards on the 360° balcony (ch.68 L35-39)
    receptionBasin: (W, H, o) => {
      let s = sandstone(W, H * 0.4, '#c89878', '#a87a5a');
      for (let i = 0; i < 6; i++) s += poly([[i * 150 + 20, 0], [i * 150 + 70, H * 0.08], [i * 150 + 120, 0]], { fill: '#e8f8ff', opacity: 0.7, stroke: '#9ad8f0', strokeWidth: 2 }) + glow(i * 150 + 70, H * 0.06, 60, '#fff2c0', 0.4);
      s += rect(0, H * 0.3, W, 26, { fill: '#a8785a', stroke: INK, strokeWidth: 3 });
      if (o.guards !== false) { const r = rng('rb'); for (let x = 30; x < W; x += 70) s += rect(x, H * 0.3 - 60 - r() * 10, 26, 60, { fill: '#5a4636', stroke: INK, strokeWidth: 2, rx: 8 }) + circle(x + 13, H * 0.3 - 74, 12, { fill: '#5a4636', stroke: INK, strokeWidth: 2 }) + path(`M${x + 13},${H * 0.3 - 60} L${x + 30 + r() * 10},${H * 0.3 + 30}`, { stroke: '#e8f8ff', strokeWidth: 4 }); }
      s += path(`M0,${H * 0.34} Q${W / 2},${H * 0.5} ${W},${H * 0.34} L${W},${H} L0,${H}Z`, { fill: '#d8b894', stroke: INK, strokeWidth: 3 });
      s += path(`M${W * 0.1},${H * 0.62} Q${W / 2},${H * 0.7} ${W * 0.9},${H * 0.62}`, { stroke: '#a8805a', strokeWidth: 10, fill: 'none' }); // slime drain channel
      if (o.tunnel) s += ellipse(W * 0.82, H * 0.5, 110, 70, { fill: '#2a1a14', stroke: INK, strokeWidth: 4 });
      return s;
    },
    // the Mirage Stone Hall: white-gold sandstone and tilted quartz panes; a plain stone seat (ch.68 L185-187)
    mirageHall: (W, H, o) => {
      let s = sandstone(W, H, '#e8d4b0', '#c8b08a');
      for (let i = 0; i < 5; i++) s += poly([[i * 170, 0], [i * 170 + 140, 0], [i * 170 + 110, H * 0.4], [i * 170 + 30, H * 0.4]], { fill: '#e8f8ff', opacity: 0.45, stroke: '#9ad8f0', strokeWidth: 2 });
      s += glow(W / 2, H * 0.1, W * 0.7, '#fff2c0', 0.4);
      if (o.view) s += rect(W * 0.08, H * 0.12, W * 0.3, H * 0.26, { fill: '#c8987a', opacity: 0.7, stroke: '#9ad8f0', strokeWidth: 3 }) + path(`M${W * 0.08},${H * 0.3} L${W * 0.38},${H * 0.26}`, { stroke: '#7ad8ff', strokeWidth: 4 });
      if (o.seat) s += rect(W * 0.38, H * 0.46, W * 0.24, H * 0.2, { fill: '#c8a878', stroke: INK, strokeWidth: 4 }) + rect(W * 0.36, H * 0.62, W * 0.28, 24, { fill: '#b8986a', stroke: INK, strokeWidth: 3 });
      return s + rect(0, H * 0.7, W, H * 0.3, { fill: '#d8c09a' }) + line([0, H * 0.7], [W, H * 0.7], { stroke: '#b8986a', strokeWidth: 4 });
    },
    // the canyon city: houses carved in both cliff walls, rope bridges, aqueduct; o.night = stone curtains shut, blue lamps (ch.69 L87, L217-223)
    canyonCity: (W, H, o) => {
      const night = !!o.night;
      let s = night ? grad(W, H, '#0e1020', '#1a1a30') : grad(W, H, '#fff2d0', '#e8c8a0');
      if (!night) s += glow(W / 2, 0, W * 0.6, '#ffffff', 0.5);
      if (o.closing) s += rect(0, 0, W * o.closing, H * 0.08, { fill: '#5a4a44', stroke: INK, strokeWidth: 3 }) + rect(W * (1 - o.closing), 0, W * o.closing, H * 0.08, { fill: '#5a4a44', stroke: INK, strokeWidth: 3 });
      if (night) s += rect(0, 0, W, H * 0.06, { fill: '#2a2228', stroke: INK, strokeWidth: 3 }) + path(`M${W / 2},0 L${W / 2},${H * 0.06}`, { stroke: INK, strokeWidth: 3 });
      s += cliffHouses(W, H, night, 'cc' + (o.seed || ''));
      for (let i = 0; i < 3; i++) { const y = H * (0.18 + i * 0.16); s += path(`M${W * 0.28},${y} Q${W / 2},${y + 30} ${W * 0.72},${y}`, { stroke: '#7a5a3a', strokeWidth: 4, fill: 'none' }); }
      s += rect(W * 0.28, H * 0.66, W * 0.44, 20, { fill: night ? '#3a3036' : '#c8a07a', stroke: INK, strokeWidth: 3 }) + rect(W * 0.3, H * 0.664, W * 0.4, 8, { fill: '#7ad8ff', opacity: 0.8 }); // water channel
      if (night) s += lamps(W, H * 0.06, H * 0.66, 34, 'cl' + (o.seed || ''));
      if (o.market) for (let i = 0; i < 3; i++) s += rect(W * 0.3 + i * 110, H * 0.5, 90, 14, { fill: ['#c0172a', '#e2b84a', '#3a8a5a'][i], stroke: INK, strokeWidth: 2 }) + rect(W * 0.3 + i * 110 + 6, H * 0.51, 6, H * 0.15, { fill: '#5a4636' });
      if (o.forge) s += rect(W * 0.58, H * 0.42, 150, H * 0.24, { fill: '#4a3a32', stroke: INK, strokeWidth: 3, rx: 8 }) + glow(W * 0.58 + 75, H * 0.58, 120, '#ff6a2a', 0.55) + rect(W * 0.6, H * 0.56, 110, 30, { fill: '#ff8a2a', opacity: 0.7 });
      if (o.tower) s += rect(W * 0.46, H * 0.08, W * 0.08, H * 0.5, { fill: night ? '#2a2228' : '#c8987a', stroke: INK, strokeWidth: 3 }) + ellipse(W / 2, H * 0.08, W * 0.07, 16, { fill: '#8a7a6a', stroke: INK, strokeWidth: 3 }) + rect(W * 0.48, H * 0.14, W * 0.04, H * 0.1, { fill: '#e8f8ff', opacity: 0.6, stroke: INK, strokeWidth: 2 });
      return s + rect(0, H * (o.floor ?? 0.68), W, H, { fill: night ? '#2a2430' : '#d8b894' }) + line([0, H * (o.floor ?? 0.68)], [W, H * (o.floor ?? 0.68)], { stroke: night ? '#1a1420' : '#b8946c', strokeWidth: 4 });
    },
    // the one-storey sandstone guest house on the outer aqueduct, veranda by a small channel (ch.69 L233, ch.70 L9-15)
    guestHouse: (W, H, o) => {
      const night = o.night !== false;
      let s = night ? grad(W, H, '#0e1020', '#1a1a30') : grad(W, H, '#fff2d0', '#e8c8a0');
      s += rect(W * 0.06, H * 0.16, W * 0.88, H * 0.52, { fill: night ? '#4a3a3a' : '#d8b894', stroke: INK, strokeWidth: 4, rx: 30 });
      s += rect(W * 0.4, H * 0.32, W * 0.2, H * 0.36, { fill: '#5a3a26', stroke: INK, strokeWidth: 3, rx: 8 }) + path(`M${W * 0.5},${H * 0.32} L${W * 0.5},${H * 0.68}`, { stroke: '#3a2416', strokeWidth: 3 });
      for (const x of [0.16, 0.76]) s += rect(W * x, H * 0.3, W * 0.1, H * 0.1, { fill: night ? '#1a1418' : '#8a5a42', stroke: INK, strokeWidth: 2, rx: 8 });
      if (night) for (const x of [0.12, 0.88]) s += glow(W * x, H * 0.22, 40, '#7ad8ff', 0.6) + circle(W * x, H * 0.22, 8, { fill: '#7ad8ff' });
      s += rect(0, H * 0.68, W, H * 0.32, { fill: night ? '#3a3040' : '#e2c8a0' }) + rect(0, H * 0.86, W, 26, { fill: '#7ad8ff', opacity: 0.7, stroke: INK, strokeWidth: 2 });
      if (o.inside) s = grad(W, H, '#2a2228', '#3a2e30') + rect(W * 0.08, H * 0.6, W * 0.84, H * 0.14, { fill: '#c8b89a', stroke: INK, strokeWidth: 3, rx: 10 }) + glow(W * 0.5, H * 0.1, 80, '#7ad8ff', 0.5) + rect(0, H * 0.74, W, H * 0.26, { fill: '#4a3e40' });
      return s;
    },
    // the southern aqueduct: big sandstone pipe on a slope, valve wheel platform, Haran's forge wall, reserve channel (ch.70 L83, L139, L225)
    aqueduct: (W, H, o) => {
      let s = grad(W, H, '#e6eef2', '#f2e6cc') + glow(W / 2, 0, W * 0.5, '#ffffff', 0.5);
      s += dunes(W, H, H * 0.4, 'aq');
      if (o.forge) s += rect(0, H * 0.2, W * 0.34, H * 0.52, { fill: '#a8785a', stroke: INK, strokeWidth: 4 }) + rect(W * 0.06, H * 0.42, W * 0.2, H * 0.24, { fill: '#2a1a14', stroke: INK, strokeWidth: 3, rx: 10 }) + glow(W * 0.16, H * 0.56, 120, '#ff6a2a', 0.6);
      s += rect(0, H * (o.pipeY ?? 0.6), W, 80, { fill: '#c8a07a', stroke: INK, strokeWidth: 4, rx: 30 });
      for (let x = 120; x < W; x += 200) s += rect(x, H * (o.pipeY ?? 0.6) - 4, 18, 88, { fill: '#a87a5a', stroke: INK, strokeWidth: 2 });
      if (o.leak) s += path(`M${W * (o.leak)},${H * (o.pipeY ?? 0.6) + 10} l10,30 l-8,10`, { stroke: INK, strokeWidth: 3, fill: 'none' }) + circle(W * o.leak + 8, H * (o.pipeY ?? 0.6) + 60, 10, { fill: '#7ad8ff', opacity: 0.8 });
      if (o.valve) s += rect(W * 0.6, H * 0.3, W * 0.3, H * 0.06, { fill: '#a87a5a', stroke: INK, strokeWidth: 3 }) + circle(W * 0.75, H * 0.24, 60, { fill: 'none', stroke: '#8a6a4a', strokeWidth: 14 }) + path(`M${W * 0.75 - 60},${H * 0.24} L${W * 0.75 + 60},${H * 0.24} M${W * 0.75},${H * 0.24 - 60} L${W * 0.75},${H * 0.24 + 60}`, { stroke: '#8a6a4a', strokeWidth: 10 });
      if (o.basin) s += ellipse(W * 0.7, H * 0.86, W * 0.3, H * 0.06, { fill: '#7ad8ff', opacity: 0.8, stroke: INK, strokeWidth: 3 });
      return s;
    },
  };
};
