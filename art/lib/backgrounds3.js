// Locations of source chapters 21-30: the ancient mine under the manor
// (ch.23-24), the manor forge (ch.25), the ruined Cloud-Tower bastion and its
// sky-elevator shaft (ch.26-30), the manor's round map hall (ch.30), Lady
// Arachne's origin-cocoon throne hall (ch.30) and the valley exit at dawn
// (ch.30). Merged into BG by backgrounds.js. Only places the chapters describe.
'use strict';
const { INK, rng, path, circle, ellipse, rect, line, poly, f } = require('./util');

module.exports = function bg3({ grad, glow }) {
  const stalactites = (W, y0, n, seed, c = '#2a2830', len = 120) => {
    const r = rng(seed); let s = '';
    for (let i = 0; i < n; i++) { const x = r() * W, w = 10 + r() * 26, l = len * (0.4 + r()); s += poly([[x - w, y0], [x + w, y0], [x + r() * 6, y0 + l]], { fill: c, stroke: INK, strokeWidth: 2 }); }
    return s;
  };
  const crystals = (W, H, seed, n = 14) => {
    const r = rng(seed); let s = '';
    for (let i = 0; i < n; i++) { const x = r() * W, y = H * (0.1 + r() * 0.6), c = r() > 0.5 ? '#5ad8e8' : '#7ab87a'; s += poly([[x, y], [x + 10, y - 26], [x + 22, y + 2], [x + 10, y + 10]], { fill: c, opacity: 0.75, stroke: INK, strokeWidth: 1.4 }) + glow(x + 10, y - 6, 34, c, 0.35); }
    return s;
  };
  const hexPylon = (x, y, s0 = 1, lit = true) => rect(x - 14 * s0, y - 150 * s0, 28 * s0, 150 * s0, { fill: '#d6dbe4', stroke: INK, strokeWidth: 3 }) +
    poly(Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2; return [x + Math.cos(a) * 26 * s0, y - 160 * s0 + Math.sin(a) * 26 * s0]; }), { fill: '#eef1f6', stroke: INK, strokeWidth: 3 }) +
    (lit ? circle(x, y - 160 * s0, 12 * s0, { fill: '#5affd0' }) + glow(x, y - 160 * s0, 60 * s0, '#5affd0', 0.5) : '');
  const spotBeam = (x, y, ang, len = 900, w = 120) => { const a = (ang * Math.PI) / 180; const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len; const nx = -Math.sin(a) * w, ny = Math.cos(a) * w; return poly([[x, y], [ex + nx, ey + ny], [ex - nx, ey - ny]], { fill: '#f4f8ff', opacity: 0.12 }); };

  return {
    // ---------- EP23: octagonal iron lift dropping through the shaft ----------
    mineLift: (W, H, o) => {
      let s = grad(W, H, '#0e0c10', '#1a1612');
      for (let i = 0; i < 9; i++) s += rect(0, i * H / 9, W, 6, { fill: '#2a241e', opacity: 0.6 });
      s += path(`M${W * 0.2},0 L${W * 0.2},${H} M${W * 0.8},0 L${W * 0.8},${H}`, { stroke: '#4a3a2a', strokeWidth: 30 }) + path(`M${W * 0.2},0 L${W * 0.2},${H} M${W * 0.8},0 L${W * 0.8},${H}`, { stroke: '#8a6a40', strokeWidth: 6, strokeDasharray: '20 14' });
      s += path(`M${W / 2},0 L${W / 2},${H * 0.4}`, { stroke: '#5a5048', strokeWidth: 22, strokeDasharray: '30 10' });
      if (o.deck !== false) {
        const y = H * (o.deckY ?? 0.78);
        s += poly([[W * 0.08, y], [W * 0.92, y], [W, y + 60], [0, y + 60]], { fill: '#3a3430', stroke: INK, strokeWidth: 4 });
        s += path(`M${W * 0.08},${y - 120} L${W * 0.92},${y - 120}`, { stroke: '#6a5a4a', strokeWidth: 8 }) + path(Array.from({ length: 10 }, (_, i) => `M${W * (0.08 + i * 0.093)},${y - 120} l0,120`).join(' '), { stroke: '#6a5a4a', strokeWidth: 5 });
        s += rect(0, y + 60, W, H - y - 60, { fill: '#0a0808' });
      }
      s += glow(W / 2, H, 400, '#ff8a2a', 0.12);
      return s;
    },
    // ---------- EP23-24: the huge cavern (ceiling crawlers, crystal veins, rails, old bones) ----------
    mineCavern: (W, H, o) => {
      let s = grad(W, H, '#0a0c12', '#161a20');
      s += crystals(W, H, 'mc' + H);
      for (const x of [0.1, 0.46, 0.86]) s += path(`M${W * x - 50},0 C${W * x - 30},${H * 0.4} ${W * x - 60},${H * 0.7} ${W * x - 40},${H} L${W * x + 40},${H} C${W * x + 60},${H * 0.6} ${W * x + 30},${H * 0.3} ${W * x + 50},0Z`, { fill: '#22242c', stroke: INK, strokeWidth: 3, opacity: o.pillars === false ? 0 : 1 });
      s += stalactites(W, 0, 26, 'st' + H, '#2a2c34', o.ceiling ? 160 : 110);
      const fl = H * (o.floor ?? 0.8);
      s += rect(0, fl, W, H - fl, { fill: '#2a2620' });
      s += path(`M0,${fl + 40} L${W},${fl + 30} M0,${fl + 70} L${W},${fl + 62}`, { stroke: '#6a4a30', strokeWidth: 6 }) + path(Array.from({ length: 14 }, (_, i) => `M${i * 60},${fl + 30} l6,46`).join(' '), { stroke: '#4a3a2a', strokeWidth: 8 });
      if (o.bones !== false) { const r = rng('bn' + H); for (let i = 0; i < 5; i++) { const x = r() * W, y = fl + 20 + r() * (H - fl - 40); s += ellipse(x, y, 14, 12, { fill: '#cfc8b4', stroke: INK, strokeWidth: 2 }) + path(`M${x + 10},${y + 6} l40,8 M${x + 20},${y} l6,24 M${x + 30},${y + 2} l6,22`, { stroke: '#cfc8b4', strokeWidth: 5 }); } }
      if (o.tunnel) s += path(`M${W * 0.64},${fl} L${W * 0.64},${fl - 200} Q${W * 0.76},${fl - 290} ${W * 0.88},${fl - 200} L${W * 0.88},${fl}Z`, { fill: '#050406', stroke: INK, strokeWidth: 4 }) + glow(W * 0.76, fl - 100, 160, '#ff6a1a', 0.3);
      s += glow(W / 2, H * 0.4, W * 0.6, '#4ab0c8', 0.08);
      return s;
    },
    // ---------- EP24: innermost hall — magma channels, black-ore pillars, sulphur smoke ----------
    magmaHall: (W, H, o) => {
      let s = grad(W, H, '#1a0a08', '#3a1408');
      s += stalactites(W, 0, 18, 'mh' + H, '#2a1a14', 90);
      for (const x of [0.16, 0.84]) s += poly([[W * x - 30, H * 0.8], [W * x - 10, H * 0.12], [W * x + 14, H * 0.08], [W * x + 34, H * 0.8]], { fill: '#0e0d12', stroke: INK, strokeWidth: 3 }) + path(`M${W * x - 6},${H * 0.2} l10,60 l-8,40 l14,70`, { stroke: '#ff8a3a', strokeWidth: 3, fill: 'none', opacity: 0.7 });
      const fl = H * (o.floor ?? 0.76);
      s += rect(0, fl, W, H - fl, { fill: '#2a1a14' });
      s += path(`M0,${fl + 50} C${W * 0.3},${fl + 20} ${W * 0.5},${fl + 90} ${W},${fl + 40} L${W},${fl + 80} C${W * 0.5},${fl + 130} ${W * 0.3},${fl + 60} 0,${fl + 90}Z`, { fill: '#ff6a1a', stroke: '#ffb04a', strokeWidth: 3 }) + glow(W / 2, fl + 60, W * 0.7, '#ff6a1a', 0.35);
      if (o.edge) s += path(`M${W * 0.7},${H} C${W * 0.74},${H * 0.9} ${W * 0.9},${H * 0.92} ${W},${H * 0.86} L${W},${H}Z`, { fill: '#ff6a1a' }) + glow(W * 0.86, H, 200, '#ffb04a', 0.5);
      const r = rng('sm' + H);
      for (let i = 0; i < 6; i++) s += ellipse(r() * W, H * (0.2 + r() * 0.4), 200, 50, { fill: '#8a7a40', opacity: 0.14 });
      return s;
    },
    // ---------- EP25: the manor's ancient forge ----------
    forge: (W, H, o) => {
      let s = grad(W, H, '#120e0c', '#241a14');
      const fl = H * (o.floor ?? 0.78);
      s += path(`M${W * 0.5},${fl} L${W * 0.5},${fl * 0.4} Q${W * 0.75},${fl * 0.14} ${W},${fl * 0.4} L${W},${fl}Z`, { fill: '#3a3230', stroke: INK, strokeWidth: 5 });
      s += path(`M${W * 0.58},${fl} L${W * 0.58},${fl * 0.55} Q${W * 0.76},${fl * 0.36} ${W * 0.94},${fl * 0.55} L${W * 0.94},${fl}Z`, { fill: '#ff8a2a' }) + path(`M${W * 0.62},${fl} C${W * 0.66},${fl * 0.7} ${W * 0.72},${fl * 0.8} ${W * 0.76},${fl * 0.52} C${W * 0.8},${fl * 0.8} ${W * 0.86},${fl * 0.7} ${W * 0.9},${fl}Z`, { fill: '#f6f8ff', opacity: 0.85 });
      s += glow(W * 0.76, fl * 0.7, 420, '#ffb04a', 0.45);
      for (let i = 0; i < 5; i++) s += rect(W * 0.02 + i * 60, fl * 0.3, 10, 120, { fill: '#5a5048' }) + rect(W * 0.02 + i * 60 - 14, fl * 0.3 + 110, 38, 26, { fill: '#6e737c', stroke: INK, strokeWidth: 2 });
      s += rect(0, fl, W, H - fl, { fill: '#2a2018' });
      for (let i = 0; i < 6; i++) s += line([0, fl + i * 30], [W, fl + i * 30], { stroke: '#1a120e', strokeWidth: 2 });
      if (o.anvil !== false) { const ax = W * (o.anvilX ?? 0.34), ay = fl + 40; s += path(`M${ax - 150},${ay - 70} L${ax + 170},${ay - 70} L${ax + 200},${ay - 96} L${ax + 120},${ay - 40} L${ax + 60},${ay - 40} L${ax + 80},${ay + 40} L${ax - 80},${ay + 40} L${ax - 60},${ay - 40} L${ax - 130},${ay - 40}Z`, { fill: '#3a3e46', stroke: INK, strokeWidth: 4 }) + rect(ax - 150, ay - 76, 320, 8, { fill: '#6e737c' }); }
      return s;
    },
    // stone yard outside the forge, cliff edge and fog (ch.25 L160, L198)
    forgeYard: (W, H, o) => {
      let s = grad(W, H, '#0e1220', '#1e2232');
      s += path(`M0,${H * 0.5} L${W * 0.2},${H * 0.36} L${W * 0.4},${H * 0.46} L${W * 0.6},${H * 0.3} L${W * 0.8},${H * 0.42} L${W},${H * 0.34} L${W},${H * 0.6} L0,${H * 0.6}Z`, { fill: '#1a1c26' });
      if (o.manor !== false) s += rect(W * 0.04, H * 0.18, 220, H * 0.42, { fill: '#24222c', stroke: INK, strokeWidth: 3 }) + path(`M${W * 0.04 - 10},${H * 0.18} L${W * 0.04 + 110},${H * 0.08} L${W * 0.04 + 230},${H * 0.18}Z`, { fill: '#1a1820', stroke: INK, strokeWidth: 3 }) + rect(W * 0.04 + 70, H * 0.36, 80, H * 0.24, { fill: '#ff8a2a', opacity: 0.6 });
      s += rect(0, H * 0.6, W, H * 0.4, { fill: '#3a3a42' });
      for (let i = 0; i < 7; i++) s += line([0, H * 0.6 + i * H * 0.06], [W, H * 0.6 + i * H * 0.06], { stroke: '#2a2a32', strokeWidth: 2 });
      if (o.rock) s += poly([[W * 0.72, H * 0.6], [W * 0.78, H * 0.48], [W * 0.9, H * 0.5], [W * 0.94, H * 0.6]], { fill: '#4a4a52', stroke: INK, strokeWidth: 3 });
      for (let i = 0; i < 5; i++) s += ellipse(W * (i / 4), H * 0.58, 260, 40, { fill: '#7a8ab8', opacity: 0.2 });
      return s;
    },
    // ---------- EP26-30: ruined Cloud-Tower bastion, exterior (spotlights, hex pylons, laser fence) ----------
    bastion: (W, H, o) => {
      let s = grad(W, H, '#0a0c14', '#1a1e2a');
      s += rect(W * 0.46, 0, 70, H * 0.5, { fill: '#3a3e48', stroke: INK, strokeWidth: 3 }) + rect(W * 0.46 + 20, 0, 12, H * 0.5, { fill: '#bfe6ff', opacity: 0.25 });
      s += path(`M${W * 0.1},${H * 0.5} L${W * 0.14},${H * 0.22} L${W * 0.3},${H * 0.2} L${W * 0.32},${H * 0.08} L${W * 0.7},${H * 0.08} L${W * 0.72},${H * 0.2} L${W * 0.88},${H * 0.24} L${W * 0.92},${H * 0.5}Z`, { fill: '#2a2c34', stroke: INK, strokeWidth: 4 });
      s += path(`M${W * 0.3},${H * 0.2} l20,30 l-14,20 M${W * 0.72},${H * 0.2} l-16,24 M${W * 0.14},${H * 0.3} l30,10`, { stroke: '#0b0a10', strokeWidth: 4 });
      for (let i = 0; i < 9; i++) s += rect(W * (0.18 + i * 0.07), H * 0.3, 18, 26, { fill: '#ffe8a0', opacity: 0.55 });
      if (o.beams !== false) for (const [x, a] of [[0.2, 60], [0.38, 100], [0.62, 80], [0.8, 120]]) s += spotBeam(W * x, H * 0.22, a, H);
      const fl = H * (o.floor ?? 0.62);
      s += rect(0, fl, W, H - fl, { fill: '#2a2a30' });
      const r = rng('bs' + H);
      for (let i = 0; i < 14; i++) { const x = r() * W, y = fl + r() * (H - fl), z = 10 + r() * 30; s += poly([[x, y], [x + z, y - z * 0.4], [x + z * 1.3, y + 4]], { fill: '#3a3a42', stroke: INK, strokeWidth: 2 }); }
      if (o.fence !== false) { const y = fl + (H - fl) * 0.2; s += path(`M0,${y} L${W},${y - 10}`, { stroke: '#ff2a3a', strokeWidth: 3, opacity: 0.85 }) + path(`M0,${y - 30} L${W},${y - 40}`, { stroke: '#ff2a3a', strokeWidth: 3, opacity: 0.85 }) + path(Array.from({ length: 9 }, (_, i) => `M${i * 100},${y + 4} l0,-46`).join(' '), { stroke: '#5a5e66', strokeWidth: 6 }); }
      if (o.pylons !== false) for (const x of [0.12, 0.5, 0.88]) s += hexPylon(W * x, fl + 20, 0.8, o.pylonsLit !== false);
      for (let i = 0; i < 5; i++) s += ellipse(W * (i / 4), fl + 30, 260, 40, { fill: '#7a8ab8', opacity: 0.16 });
      return s;
    },
    // middle courtyard: grid-grooved concrete, raised walkways, stair to the top deck
    bastionYard: (W, H, o) => {
      let s = grad(W, H, '#12141a', '#20222a');
      s += rect(0, 0, W * 0.1, H * 0.7, { fill: '#2a2c34', stroke: INK, strokeWidth: 3 }) + rect(W * 0.9, 0, W * 0.1, H * 0.7, { fill: '#2a2c34', stroke: INK, strokeWidth: 3 });
      const wy = H * (o.walkY ?? 0.18);
      s += rect(0, wy, W, 26, { fill: '#5a5e66', stroke: INK, strokeWidth: 3 }) + path(Array.from({ length: 16 }, (_, i) => `M${i * 52},${wy} l0,-50`).join(' '), { stroke: '#4a4e56', strokeWidth: 4 }) + rect(0, wy - 54, W, 8, { fill: '#4a4e56' });
      if (o.stair) s += path(`M${W * 0.36},${H * 0.7} L${W * 0.5},${wy + 26} L${W * 0.64},${H * 0.7}`, { fill: '#3a3e46', stroke: INK, strokeWidth: 3 }) + path(Array.from({ length: 10 }, (_, i) => `M${W * (0.37 + i * 0.013)},${H * 0.7 - i * (H * 0.7 - wy) / 10} l${W * (0.26 - i * 0.026)},0`).join(' '), { stroke: '#5a5e66', strokeWidth: 3 });
      const fl = H * (o.floor ?? 0.7);
      s += rect(0, fl, W, H - fl, { fill: '#4a4c52' });
      const lit = o.grid ? '#ffd45a' : '#2e3036';
      for (let i = -6; i <= 6; i++) s += line([W / 2 + i * 70, fl], [W / 2 + i * 200, H], { stroke: lit, strokeWidth: o.grid ? 3 : 2, opacity: o.grid ? 0.8 : 1 });
      for (let k = 1; k < 5; k++) { const y = fl + (H - fl) * Math.pow(k / 5, 1.4); s += line([0, y], [W, y], { stroke: lit, strokeWidth: o.grid ? 3 : 2, opacity: o.grid ? 0.8 : 1 }); }
      if (o.grid) s += path(`M0,${wy + 26} L${W},${wy + 26}`, { stroke: '#ffd45a', strokeWidth: 6, opacity: 0.6 });
      return s;
    },
    // top deck before the sky-elevator shaft: reactor pillar, steel containers; o.collapse = the shaft base caving in
    liftDeck: (W, H, o) => {
      let s = grad(W, H, '#0a0c14', '#1c1e28');
      const cx = W * (o.shaftX ?? 0.5);
      if (!o.collapse) {
        s += rect(cx - 90, 0, 180, H * 0.66, { fill: '#3a3e48', stroke: INK, strokeWidth: 4 }) + rect(cx - 60, H * 0.1, 120, H * 0.5, { fill: '#121218', stroke: INK, strokeWidth: 3 });
        s += path(`M${cx - 60},${H * 0.35} L${cx + 60},${H * 0.35}`, { stroke: '#5a5e66', strokeWidth: 4 }) + path(`M${cx},${H * 0.1} L${cx},${H * 0.6}`, { stroke: '#2a2c34', strokeWidth: 4 });
        if (o.reactor !== false) s += circle(cx, H * 0.6, 40, { fill: '#fff3b0', stroke: INK, strokeWidth: 3 }) + glow(cx, H * 0.6, 160, '#fff3b0', 0.5);
        for (const x of [-140, 140]) s += rect(cx + x - 14, 0, 28, H * 0.66, { fill: '#5a5e66', stroke: INK, strokeWidth: 3 });
      } else {
        s += poly([[cx - 200, H * 0.66], [cx - 120, H * 0.2], [cx - 40, H * 0.3], [cx + 30, H * 0.1], [cx + 110, H * 0.28], [cx + 220, H * 0.66]], { fill: '#3a3a42', stroke: INK, strokeWidth: 4 });
        const r = rng('co' + H); for (let i = 0; i < 18; i++) { const x = cx + (r() - 0.5) * 420, y = H * (0.2 + r() * 0.46), z = 20 + r() * 50; s += poly([[x, y], [x + z, y - z * 0.5], [x + z * 1.2, y + z * 0.4], [x + z * 0.1, y + z * 0.6]], { fill: '#4a4a52', stroke: INK, strokeWidth: 2 }); }
        s += path(`M${cx - 100},${H * 0.3} l-40,-60 M${cx + 60},${H * 0.2} l50,-80 M${cx + 120},${H * 0.4} l60,-30`, { stroke: '#5a5e66', strokeWidth: 10 });
      }
      if (o.containers) for (const x of [0.06, 0.2, 0.74, 0.88]) s += rect(W * x - 50, H * 0.46, 100, H * 0.2, { fill: '#c9ced6', stroke: INK, strokeWidth: 3 }) + circle(W * x, H * 0.54, 14, { fill: 'none', stroke: '#e2b84a', strokeWidth: 3 }) + path(`M${W * x - 10},${H * 0.6} q10,-10 20,0 q-10,10 -20,0`, { stroke: '#3fe0d0', strokeWidth: 2, fill: 'none' }) + (o.open ? rect(W * x - 40, H * 0.48, 80, H * 0.17, { fill: '#0e1016' }) + ellipse(W * x, H * 0.5, 60, 30, { fill: '#eef6ff', opacity: 0.4 }) : '');
      const fl = H * 0.66;
      s += rect(0, fl, W, H - fl, { fill: '#3a3c42' });
      for (let i = -6; i <= 6; i++) s += line([W / 2 + i * 60, fl], [W / 2 + i * 180, H], { stroke: '#2a2c32', strokeWidth: 2 });
      if (o.melt) s += ellipse(cx, fl + 90, 140, 30, { fill: '#ff8a2a', opacity: 0.7 }) + glow(cx, fl + 90, 180, '#ff6a1a', 0.4);
      if (o.turrets) for (const x of [0.1, 0.3, 0.7, 0.9]) s += rect(W * x - 30, fl - 40, 60, 40, { fill: '#d6dbe4', stroke: INK, strokeWidth: 3 }) + rect(W * x - 6, fl - 70, 70, 16, { fill: '#5a6070', stroke: INK, strokeWidth: 3 }) + circle(W * x + 64, fl - 62, 8, { fill: '#7ad8ff' });
      return s;
    },
    // ---------- EP30: the manor's innermost round hall, stone table, hide map ----------
    warRoom: (W, H, o) => {
      let s = grad(W, H, '#0e0c16', '#1a1826');
      for (const x of [0.04, 0.3, 0.7, 0.96]) s += rect(W * x - 20, 0, 40, H * 0.62, { fill: '#2a2632', stroke: INK, strokeWidth: 3 });
      s += path(`M0,${H * 0.1} Q${W / 2},${-H * 0.06} ${W},${H * 0.1}`, { stroke: '#3a3442', strokeWidth: 16, fill: 'none' });
      s += glow(W / 2, H * 0.5, W * 0.6, '#9d7bff', 0.25);
      const ty = H * (o.tableY ?? 0.62);
      s += ellipse(W / 2, ty, W * 0.46, 70, { fill: '#4a4652', stroke: INK, strokeWidth: 4 }) + rect(W * 0.1, ty, W * 0.8, H - ty, { fill: '#3a3642', stroke: INK, strokeWidth: 3 });
      if (o.map !== false) s += poly([[W * 0.16, ty - 10], [W * 0.84, ty - 20], [W * 0.8, ty + 40], [W * 0.2, ty + 46]], { fill: '#b89a70', stroke: '#6a5030', strokeWidth: 3 });
      return s;
    },
    // ---------- EP30: Lady Arachne's origin-cocoon throne hall under the porcelain gallery ----------
    cocoonHall: (W, H, o) => {
      let s = grad(W, H, '#1a0408', '#3a0a10');
      const r = rng('ch' + H);
      for (let i = 0; i < 70; i++) { const x = r() * W; s += path(`M${x},0 Q${W / 2 + (x - W / 2) * 0.3},${H * 0.3} ${W / 2 + (r() - 0.5) * 60},${H * 0.42}`, { stroke: i % 3 ? '#8a0e1e' : '#ff3a4a', strokeWidth: 1 + r() * 2, fill: 'none', opacity: 0.6 }); }
      s += path(`M0,${H * 0.5} Q${W / 2},${-H * 0.2} ${W},${H * 0.5}`, { stroke: '#c0172a', strokeWidth: 6, fill: 'none', opacity: 0.6 });
      const fl = H * (o.floor ?? 0.72);
      if (o.throne !== false) s += path(`M${W * 0.36},${fl} L${W * 0.36},${fl - 260} C${W * 0.36},${fl - 380} ${W * 0.64},${fl - 380} ${W * 0.64},${fl - 260} L${W * 0.64},${fl}Z`, { fill: '#5a0a14', stroke: INK, strokeWidth: 4 }) + path(Array.from({ length: 8 }, (_, i) => `M${W * (0.38 + i * 0.033)},${fl - 300} Q${W * 0.5},${fl - 150} ${W * (0.38 + i * 0.033)},${fl}`).join(' '), { stroke: '#ff5a6a', strokeWidth: 1.4, fill: 'none', opacity: 0.6 });
      s += rect(0, fl, W, H - fl, { fill: '#e8e2e6' }) + rect(0, fl, W, H - fl, { fill: '#3a0a10', opacity: 0.4 });
      s += poly([[W * 0.44, fl], [W * 0.56, fl], [W * 0.72, H], [W * 0.28, H]], { fill: '#a3101f' });
      s += glow(W / 2, H * 0.4, W * 0.6, '#ff2a3a', 0.2);
      return s;
    },
    // ---------- EP30: rocky rise outside the haunted village gate at dawn ----------
    valleyDawn: (W, H, o) => {
      let s = grad(W, H, '#3a3a5a', '#7a6a6a');
      s += poly([[W * 0.4, 0], [W * 0.62, 0], [W * 0.9, H * 0.7], [W * 0.1, H * 0.7]], { fill: '#ffd87a', opacity: 0.22 });
      s += path(`M0,${H * 0.46} L${W * 0.14},${H * 0.4} L${W * 0.26},${H * 0.44} L${W * 0.4},${H * 0.34} L${W * 0.58},${H * 0.42} L${W * 0.74},${H * 0.32} L${W * 0.9},${H * 0.4} L${W},${H * 0.36} L${W},${H * 0.6} L0,${H * 0.6}Z`, { fill: '#2a2838' });
      for (let i = 0; i < 26; i++) { const x = (i * 97) % W, y = H * (0.42 + ((i * 31) % 14) / 100); s += rect(x, y, 4, 6, { fill: '#ffd27a', opacity: 0.7 }); }
      s += path(`M0,${H * 0.62} C${W * 0.3},${H * 0.56} ${W * 0.6},${H * 0.66} ${W},${H * 0.6} L${W},${H} L0,${H}Z`, { fill: '#2a2a30' });
      if (o.gate) s += path(`M${W * 0.04},${H} L${W * 0.04},${H * 0.62} L${W * 0.18},${H * 0.56} L${W * 0.3},${H * 0.62} L${W * 0.3},${H}`, { fill: 'none', stroke: '#3a2a20', strokeWidth: 14 });
      for (let i = 0; i < 5; i++) s += ellipse(W * (i / 4), H * 0.58, 280, 40, { fill: '#9aa8c8', opacity: 0.25 });
      s += glow(W / 2, 0, W * 0.6, '#fff0b0', 0.35);
      return s;
    },
  };
};
