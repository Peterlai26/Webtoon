// Locations of source chapters 46-65, all inside the One-Face Kingdom:
// the morning market (ch.46), the tactical sparring valley (ch.47-48), the
// crystal-moon cliff terrace (ch.48), the war-council chamber and the Origin's
// vault under the throne (ch.49), the northern pass and outer gate (ch.49-51),
// the old clock-tower square (ch.51-53), the forge district (ch.51-54), the
// forced-duel dimension (ch.54), the tower district (ch.54-56), the east stone
// bridge over the black canal and the night market (ch.56-59), the glass safety
// tunnel (ch.56-59), the mirror-castle plaza and the royal glass bridge
// (ch.59-61), the mirror throne hall (ch.62-65) and the ancient warp-gate cave
// (ch.65). Merged into BG by backgrounds.js. Only places the chapters describe.
'use strict';
const { INK, rng, path, circle, ellipse, rect, line, poly } = require('./util');

module.exports = function bg5({ grad, glow }) {
  const houses = (W, y, seed, col = '#2a2a32') => {
    const r = rng(seed); let s = '';
    for (let x = -20; x < W; x += 80 + r() * 50) { const w = 70 + r() * 60, hh = 90 + r() * 130; s += rect(x, y - hh, w, hh, { fill: col, stroke: INK, strokeWidth: 2.4 }) + rect(x + w * 0.3, y - hh * 0.6, w * 0.3, hh * 0.25, { fill: r() > 0.4 ? '#ffb04a' : '#3a3a42', opacity: 0.7 }); }
    return s;
  };
  const crystals = (W, H, c = '#9ae8ff', op = 0.5) => { const r = rng('cr' + W + c); let s = ''; for (let i = 0; i < 14; i++) { const x = r() * W, y = r() * H * 0.14; s += poly([[x - 14, y], [x, y + 30 + r() * 40], [x + 14, y]], { fill: c, opacity: op, stroke: INK, strokeWidth: 1.4 }); } return s; };
  const floor = (W, H, fl, c = '#4a4a52', lc = '#3a3a42') => rect(0, fl, W, H - fl, { fill: c }) + Array.from({ length: 6 }, (_, i) => line([0, fl + i * 34], [W, fl + i * 34], { stroke: lc, strokeWidth: 2 })).join('');
  const alarm = (W, H, o) => (o.alarm ? rect(0, 0, W, H, { fill: '#a3101f', opacity: 0.16 }) : '');
  return {
    // morning market under the warm crystal ceiling (ch.46 L4, L16)
    onefaceMarket: (W, H, o) => {
      let s = grad(W, H, '#3a3440', '#5a5058') + crystals(W, H, '#ffe8b0', 0.6) + glow(W * 0.5, 0, W * 0.8, '#ffe8b0', 0.35);
      s += houses(W, H * 0.5, 'mk1', '#3a343c');
      for (let i = 0; i < 4; i++) { const x = 40 + i * 200; s += rect(x, H * 0.44, 150, 16, { fill: ['#c0172a', '#2a6ad0', '#e2b84a', '#3a8a5a'][i], stroke: INK, strokeWidth: 2 }) + rect(x + 6, H * 0.46, 8, H * 0.14, { fill: '#5a4636' }) + rect(x + 136, H * 0.46, 8, H * 0.14, { fill: '#5a4636' }) + rect(x, H * 0.56, 150, 20, { fill: '#7a5a3a', stroke: INK, strokeWidth: 2 }); }
      if (o.kitchen) s += rect(W * 0.6, H * 0.36, 160, H * 0.24, { fill: '#2a2428', stroke: INK, strokeWidth: 3 }) + glow(W * 0.6 + 80, H * 0.5, 140, '#ff8a2a', 0.4);
      return s + floor(W, H, H * (o.floor ?? 0.62), '#6a5e58', '#5a4e48');
    },
    // the tactical sparring valley: grey shock-absorbing stone, zones (ch.47 L6)
    sparring: (W, H, o) => {
      let s = grad(W, H, '#24242c', '#3a3a44') + crystals(W, H, '#9ae8ff', 0.35);
      s += path(`M0,${H * 0.2} L${W * 0.2},${H * 0.08} L${W * 0.4},${H * 0.18} L${W * 0.6},${H * 0.06} L${W * 0.8},${H * 0.16} L${W},${H * 0.1} L${W},${H * 0.5} L0,${H * 0.5}Z`, { fill: '#2e2e36' });
      if (o.zone === 'pillars') for (const x of [0.08, 0.3, 0.7, 0.92]) s += rect(W * x - 40, H * 0.12, 80, H * 0.6, { fill: '#5a5a64', stroke: INK, strokeWidth: 3 });
      if (o.zone === 'ring') for (const x of [0.04, 0.2, 0.8, 0.96]) s += rect(W * x - 22, H * 0.3, 44, H * 0.34, { fill: '#5a5a64', stroke: INK, strokeWidth: 3 });
      if (o.zone === 'front') s += rect(W * 0.7, H * 0.24, W * 0.3, H * 0.4, { fill: '#4a4a52', stroke: INK, strokeWidth: 3 });
      if (o.dais) s += rect(W * 0.3, H * 0.46, W * 0.4, 30, { fill: '#5a5a64', stroke: INK, strokeWidth: 3 });
      return s + floor(W, H, H * (o.floor ?? 0.64), '#55555e', '#4a4a52');
    },
    // the crystal-moon terrace above the city at night (ch.48 L125-127); o.alarm = crystals pulse dull red (ch.48 L237)
    cliffTerrace: (W, H, o) => {
      const c = o.alarm ? '#ff5a5a' : '#7ad8ff';
      let s = grad(W, H, o.alarm ? '#2a0a10' : '#0a1428', o.alarm ? '#3a1418' : '#141c34');
      const r = rng('ct'); for (let i = 0; i < 60; i++) s += circle(r() * W, r() * H * 0.4, 1.5 + r() * 2.5, { fill: c, opacity: 0.4 + r() * 0.5 });
      s += crystals(W, H, c, 0.6) + glow(W * 0.5, 0, W * 0.6, c, 0.25);
      s += houses(W, H * 0.66, 'ct1', '#1a1a24');
      for (let i = 0; i < 20; i++) s += circle(r() * W, H * 0.5 + r() * H * 0.16, 3, { fill: '#ffb04a', opacity: 0.8 });
      s += poly([[0, H * 0.7], [W * 0.7, H * 0.7], [W, H * 0.78], [W, H], [0, H]], { fill: '#2a2a34', stroke: INK, strokeWidth: 3 }) + rect(0, H * 0.66, W * 0.72, 16, { fill: '#3a3a44', stroke: INK, strokeWidth: 2 });
      return s;
    },
    // war-council hall: round granite table with the glowing 3-D valley map (ch.49 L8-10)
    warCouncil: (W, H, o) => {
      let s = grad(W, H, '#16161c', '#24242c');
      for (const x of [0.08, 0.92]) s += rect(W * x - 40, 0, 80, H, { fill: '#2a2a32', stroke: INK, strokeWidth: 3 });
      s += ellipse(W / 2, H * 0.7, W * 0.42, H * 0.12, { fill: '#3a3a42', stroke: INK, strokeWidth: 4 }) + rect(W * 0.1, H * 0.7, W * 0.8, H * 0.3, { fill: '#2a2a32' });
      s += path(`M${W * 0.26},${H * 0.68} L${W * 0.36},${H * 0.58} L${W * 0.44},${H * 0.64} L${W * 0.52},${H * 0.54} L${W * 0.62},${H * 0.62} L${W * 0.74},${H * 0.68}Z`, { fill: '#3fe0d0', opacity: 0.45, stroke: '#7affea', strokeWidth: 2 }) + glow(W / 2, H * 0.62, W * 0.3, '#3fe0d0', 0.3);
      return s + alarm(W, H, o);
    },
    // the Origin's vault 100 m under the throne: padded nursery, tiny escape tunnels, the birth stone (ch.49 L62-66)
    monoVault: (W, H, o) => {
      let s = grad(W, H, '#3a3038', '#4a3e44');
      for (let i = 0; i < 7; i++) s += circle(60 + i * 115, H * 0.3 + (i % 2) * 60, 26, { fill: '#121117', stroke: '#6a5a50', strokeWidth: 4 });
      for (let i = 0; i < 8; i++) s += rect(i * 100, H * 0.12, 96, H * 0.08, { fill: '#8a7060', stroke: '#5a4a40', strokeWidth: 2, rx: 20 });
      s += rect(W * 0.78, H * 0.46, 120, H * 0.22, { fill: '#7a7480', stroke: INK, strokeWidth: 3 }) + glow(W * 0.78 + 60, H * 0.5, 160, '#ffffff', 0.6);
      return s + rect(0, H * 0.68, W, H * 0.32, { fill: '#a08a6a' }) + path(Array.from({ length: 12 }, (_, i) => `M${i * 70},${H * 0.7} q10,8 0,16`).join(' '), { stroke: '#8a7458', strokeWidth: 3, fill: 'none' });
    },
    // the ancient northern pass and the outer black-diamond wall (ch.49 L144-152, ch.50); o.breach = ceiling torn open, spotlights
    northGate: (W, H, o) => {
      let s = grad(W, H, '#1a1a22', '#2a2a32');
      if (o.breach) s += poly([[W * 0.3, 0], [W * 0.7, 0], [W * 0.62, H * 0.16], [W * 0.38, H * 0.16]], { fill: '#f6f2e0' }) + path(`M${W * 0.4},${H * 0.16} L${W * 0.1},${H} M${W * 0.6},${H * 0.16} L${W * 0.9},${H}`, { stroke: '#fff7d0', strokeWidth: 60, opacity: 0.12 }) + glow(W / 2, H * 0.1, W * 0.5, '#fff7d0', 0.5);
      s += poly([[0, 0], [W * 0.26, 0], [W * 0.18, H], [0, H]], { fill: '#2e2e36', stroke: INK, strokeWidth: 3 }) + poly([[W, 0], [W * 0.74, 0], [W * 0.82, H], [W, H]], { fill: '#2e2e36', stroke: INK, strokeWidth: 3 });
      if (o.wall) s += rect(0, H * (o.wallY ?? 0.5), W, H * 0.16, { fill: '#121117', stroke: '#3a3a5a', strokeWidth: 4 }) + Array.from({ length: 10 }, (_, i) => rect(i * 84, H * (o.wallY ?? 0.5) - 26, 50, 26, { fill: '#121117', stroke: '#3a3a5a', strokeWidth: 3 })).join('') + (o.gate ? rect(W * 0.4, H * (o.wallY ?? 0.5), W * 0.2, H * 0.16, { fill: o.gate === 'broken' ? '#000' : '#24242c', stroke: '#5a5a7a', strokeWidth: 4 }) : '');
      return s + floor(W, H, H * (o.floor ?? 0.74), '#3a3a42', '#2e2e36') + alarm(W, H, o);
    },
    // old clock-tower square, grey stone; o.thorns = overgrown by golden thorn vines (ch.52 L30)
    clockSquare: (W, H, o) => {
      let s = grad(W, H, '#1e1e26', '#30303a') + houses(W, H * 0.56, 'cs1');
      const tx = W * (o.tx ?? 0.5);
      s += rect(tx - 70, H * 0.02, 140, H * 0.54, { fill: '#3a3a44', stroke: INK, strokeWidth: 3 }) + circle(tx, H * 0.16, 50, { fill: '#e8e0c8', stroke: INK, strokeWidth: 4 }) + path(`M${tx},${H * 0.16} l0,-34 M${tx},${H * 0.16} l24,10`, { stroke: INK, strokeWidth: 4 });
      s += poly([[tx - 160, H * 0.62], [tx + 160, H * 0.62], [tx + 90, H * 0.48], [tx - 90, H * 0.48]], { fill: '#4a4a54', stroke: INK, strokeWidth: 3 });
      s += floor(W, H, H * (o.floor ?? 0.62));
      if (o.thorns) { const r = rng('th' + H); for (let i = 0; i < 18; i++) { const x = r() * W, y = H * (0.3 + r() * 0.7); s += path(`M${x},${y} q${30 - r() * 60},-60 ${60 - r() * 120},-110`, { stroke: '#e2b84a', strokeWidth: 6, fill: 'none', strokeDasharray: '20 4' }); } s += rect(0, 0, W, H, { fill: '#e2b84a', opacity: 0.06 }); }
      return s;
    },
    // forge district and ore yard; o.ruined = smashed forges, sunk pits (ch.53 L189)
    forgeDistrict: (W, H, o) => {
      let s = grad(W, H, '#241c1c', '#3a2e2a') + houses(W, H * 0.52, 'fd1', '#3a3230');
      for (const x of [0.15, 0.6]) s += rect(W * x, H * 0.24, 160, H * 0.28, { fill: '#3a3230', stroke: INK, strokeWidth: 3 }) + rect(W * x + 40, H * 0.36, 80, H * 0.16, { fill: '#ff8a2a', opacity: o.ruined ? 0.3 : 0.7 }) + glow(W * x + 80, H * 0.44, 160, '#ffb04a', 0.3);
      s += floor(W, H, H * (o.floor ?? 0.62), '#4a3e38', '#3a302c');
      if (o.ruined) s += ellipse(W * 0.4, H * 0.8, 200, 50, { fill: '#121012', stroke: '#5a4a40', strokeWidth: 4 }) + rect(0, 0, W, H, { fill: '#6a5a50', opacity: 0.12 });
      return s;
    },
    // Letter B's forced-duel dimension: 50 m marble square floating in black with gold geometric lines (ch.54 L14-16)
    duelDimension: (W, H, o) => {
      let s = rect(0, 0, W, H, { fill: '#050508' });
      const r = rng('dd'); for (let i = 0; i < 14; i++) s += line([r() * W, r() * H * 0.6], [r() * W, r() * H * 0.6], { stroke: '#e2b84a', strokeWidth: 2, opacity: 0.5 });
      s += poly([[W * 0.1, H * 0.62], [W * 0.9, H * 0.62], [W, H], [0, H]], { fill: '#f2f0ec', stroke: '#e2b84a', strokeWidth: 4 }) + path(`M${W * 0.3},${H * 0.62} L${W * 0.2},${H} M${W * 0.7},${H * 0.62} L${W * 0.8},${H} M${W * 0.05},${H * 0.8} L${W * 0.95},${H * 0.8}`, { stroke: '#e2b84a', strokeWidth: 3 });
      s += rect(W * 0.06, H * 0.04, W * 0.88, H * 0.6, { fill: '#e2b84a', opacity: 0.06, stroke: '#ffd45a', strokeWidth: 5 });
      if (o.crack) s += poly(Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2; return [W * (o.cx ?? 0.5) + Math.cos(a) * 60, H * (o.cy ?? 0.35) + Math.sin(a) * 60]; }), { fill: '#3a3230', stroke: '#fff7d0', strokeWidth: 4 }) + glow(W * (o.cx ?? 0.5), H * (o.cy ?? 0.35), 120, '#ffb04a', 0.4);
      return s;
    },
    // the tower district on the right wing: towers, glass-stone bunkers, a far sniper tower (ch.54 L180-188)
    towerDistrict: (W, H, o) => {
      let s = grad(W, H, '#1a1c26', '#2c2e3a');
      if (o.far) s += rect(W * 0.82, H * 0.04, 40, H * 0.4, { fill: '#2a2a34', stroke: INK, strokeWidth: 2 }) + glow(W * 0.84, H * 0.06, 50, '#c58aff', 0.8);
      const r = rng('tw' + H); for (let i = 0; i < 6; i++) { const x = i * 140 + r() * 40, hh = H * (0.3 + r() * 0.3); s += rect(x, H * 0.66 - hh, 90, hh, { fill: '#3a3c48', stroke: INK, strokeWidth: 3 }) + rect(x + 20, H * 0.66 - hh + 20, 50, 30, { fill: '#9ae8ff', opacity: 0.35 }); }
      if (o.holes) s += path(`M0,${H * 0.36} L${W},${H * 0.3}`, { stroke: '#c58aff', strokeWidth: 30, opacity: 0.2 }) + Array.from({ length: 3 }, (_, i) => circle(160 + i * 220, H * 0.35 - i * 8, 30, { fill: '#0a0a10', stroke: '#c58aff', strokeWidth: 3 })).join('');
      return s + floor(W, H, H * (o.floor ?? 0.66), '#3a3a44', '#2e2e38');
    },
    // the east stone bridge over the black canal, the night-market stalls beyond (ch.57 L6-8)
    eastBridge: (W, H, o) => {
      let s = grad(W, H, '#14141c', '#22222c') + houses(W, H * 0.44, 'eb1', '#24242e');
      for (let i = 0; i < 5; i++) s += rect(40 + i * 160, H * 0.38, 120, 12, { fill: ['#c0172a', '#e2b84a', '#2a6ad0', '#c0172a', '#3a8a5a'][i], opacity: o.ruined ? 0.4 : 0.8 });
      const fl = H * (o.floor ?? 0.6);
      s += rect(0, fl + 80, W, H - fl, { fill: '#05060a' }) + rect(0, fl, W, 80, { fill: '#5a5a62', stroke: INK, strokeWidth: 3 }) + rect(0, fl - 30, W, 14, { fill: '#6a6a72', stroke: INK, strokeWidth: 2 });
      for (let i = 0; i < 9; i++) s += rect(i * 100, fl - 30, 14, 30, { fill: '#6a6a72', stroke: INK, strokeWidth: 2 });
      if (o.ruined) s += path(`M${W * 0.3},${fl} l30,40 l-20,30 M${W * 0.7},${fl} l-20,50`, { stroke: INK, strokeWidth: 4, fill: 'none' }) + rect(0, 0, W, H, { fill: '#5a0a14', opacity: 0.12 });
      return s;
    },
    // the glass safety tunnel under the granite, crystal-lit (ch.56 L162)
    glassTunnel: (W, H, o) => {
      let s = grad(W, H, '#0e1420', '#1a2232');
      s += path(`M0,${H * 0.1} Q${W / 2},${-H * 0.1} ${W},${H * 0.1} L${W},${H * 0.3} Q${W / 2},${H * 0.1} 0,${H * 0.3}Z`, { fill: '#9ae8ff', opacity: 0.18, stroke: '#9ae8ff', strokeWidth: 3 });
      for (let i = 0; i < 6; i++) s += line([i * 160, H * 0.1], [i * 160 + 80, H * 0.7], { stroke: '#cfe6ff', strokeWidth: 3, opacity: 0.3 });
      s += crystals(W, H, '#9ae8ff', 0.5) + glow(W / 2, H * 0.4, W * 0.4, '#9ae8ff', 0.15);
      if (o.mouth) s += ellipse(W / 2, H * 0.44, W * 0.3, H * 0.24, { fill: o.mouth === 'light' ? '#fff7d0' : '#3a3a42', stroke: INK, strokeWidth: 4 });
      return s + floor(W, H, H * (o.floor ?? 0.7), '#2a3040', '#222838');
    },
    // the mirror-castle plaza and the royal glass bridge (ch.59 L267, ch.60 L3-15)
    mirrorPlaza: (W, H, o) => {
      let s = grad(W, H, '#14141e', '#2a2a3a') + crystals(W, H, '#e8f2ff', 0.6);
      const cx = W * (o.cx ?? 0.5);
      s += rect(cx - 160, H * 0.06, 320, H * 0.42, { fill: '#cfd8e8', opacity: 0.85, stroke: INK, strokeWidth: 4 }) + poly([[cx - 180, H * 0.08], [cx, -H * 0.04], [cx + 180, H * 0.08]], { fill: '#dfe8f8', stroke: INK, strokeWidth: 3 }) + rect(cx - 50, H * 0.3, 100, H * 0.18, { fill: o.doorShut ? '#9aa8bc' : '#2a2a3a', stroke: INK, strokeWidth: 4 });
      for (const x of [0.1, 0.9]) s += rect(W * x - 26, H * 0.12, 52, H * 0.5, { fill: '#dfe8f8', opacity: 0.6, stroke: INK, strokeWidth: 3 });
      if (o.bridge !== false) s += poly([[cx - 60, H * 0.48], [cx + 60, H * 0.48], [cx + 240, H], [cx - 240, H]], { fill: '#cfe6ff', opacity: 0.5, stroke: '#ffffff', strokeWidth: 3 });
      s += rect(0, H * 0.62, W, H * 0.38, { fill: '#3a3a4a', opacity: o.bridge !== false ? 0.5 : 1 });
      if (o.ruined) s += Array.from({ length: 5 }, (_, i) => poly([[i * 180, H * 0.62], [i * 180 + 60, H * 0.56], [i * 180 + 90, H * 0.66]], { fill: '#dfe8f8', opacity: 0.5, stroke: INK, strokeWidth: 2 })).join('');
      if (o.collapse) s += rect(0, H * 0.62, W, H * 0.38, { fill: '#000' }) + Array.from({ length: 10 }, (_, i) => poly([[i * 80, H * (0.7 + (i % 3) * 0.08)], [i * 80 + 40, H * (0.66 + (i % 3) * 0.08)], [i * 80 + 30, H * (0.76 + (i % 3) * 0.08)]], { fill: '#cfe6ff', opacity: 0.7 })).join('');
      return s;
    },
    // the mirror throne hall: 72 mirror pillars, obsidian throne; o.dome = shattered crystal dome, o.lava = floor melting (ch.62 L40, ch.64 L4)
    mirrorThrone: (W, H, o) => {
      let s = grad(W, H, o.lava ? '#2a1410' : '#16161e', o.lava ? '#4a2014' : '#2a2a36');
      if (o.dome) s += poly([[W * 0.2, 0], [W * 0.8, 0], [W * 0.66, H * 0.12], [W * 0.34, H * 0.12]], { fill: '#fff7d0', opacity: 0.8 }) + glow(W / 2, 0, W * 0.5, '#fff7d0', 0.5);
      for (const x of [0.05, 0.2, 0.35, 0.65, 0.8, 0.95]) s += rect(W * x - 26, 0, 52, H * 0.76, { fill: '#9aa8bc', opacity: 0.7, stroke: INK, strokeWidth: 3 }) + rect(W * x - 14, H * 0.1, 10, H * 0.5, { fill: '#ffffff', opacity: 0.5 });
      if (o.throne !== false) { const tx = W * (o.tx ?? 0.5); s += rect(tx - 70, H * 0.26, 140, H * 0.36, { fill: '#0a0a0e', stroke: '#5a5a7a', strokeWidth: 4 }) + poly([[tx - 70, H * 0.26], [tx, H * 0.16], [tx + 70, H * 0.26]], { fill: '#0a0a0e', stroke: '#5a5a7a', strokeWidth: 3 }) + rect(tx - 220, H * 0.62, 440, H * 0.06, { fill: '#24242c', stroke: INK, strokeWidth: 3 }); }
      const fl = H * (o.floor ?? 0.76);
      s += rect(0, fl, W, H - fl, { fill: o.lava ? '#3a1a10' : '#3a3a46' });
      if (o.lava) s += Array.from({ length: 6 }, (_, i) => ellipse(80 + i * 130, fl + 40 + (i % 2) * 30, 70, 14, { fill: '#ff6a1a', opacity: 0.8 })).join('') + glow(W / 2, fl, W * 0.6, '#ff8a2a', 0.3);
      if (o.seal) s += ellipse(W / 2, fl + 30, W * 0.34, 40, { fill: 'none', stroke: '#ffe8a8', strokeWidth: 6 }) + ellipse(W / 2, fl + 30, W * 0.26, 28, { fill: 'none', stroke: '#ffffff', strokeWidth: 3 });
      return s;
    },
    // the emergency-capsule chute bay behind the throne (ch.64 L70, ch.65 L7-15)
    capsuleBay: (W, H, o) => {
      let s = grad(W, H, '#1a1a22', '#2a2a32') + rect(W * 0.2, H * 0.1, W * 0.6, H * 0.7, { fill: '#3a3a44', stroke: INK, strokeWidth: 4, rx: 60 }) + rect(W * 0.28, H * 0.2, W * 0.44, H * 0.5, { fill: '#cfe6ff', opacity: 0.22, stroke: '#cfe6ff', strokeWidth: 5, rx: 40 });
      if (o.lever) s += rect(W * 0.86, H * 0.4, 20, H * 0.3, { fill: '#5a5a62', stroke: INK, strokeWidth: 3 }) + rect(W * 0.84, H * 0.36, 60, 20, { fill: '#c0172a', stroke: INK, strokeWidth: 3 });
      return s + floor(W, H, H * 0.82);
    },
    // the deep cave three kilometres down and the ancient warp-gate ruin glowing emerald and gold (ch.65 L121-165)
    warpCave: (W, H, o) => {
      let s = grad(W, H, '#05060a', '#0e1210');
      const gx = W * (o.gx ?? 0.5), gy = H * (o.gy ?? 0.42), gr = (o.gr || 0.24) * W;
      s += glow(gx, gy, gr * 2.4, '#3aff9a', 0.25) + circle(gx, gy, gr, { fill: '#0a2a1a', stroke: '#5a5a42', strokeWidth: 22 }) + circle(gx, gy, gr * 0.82, { fill: '#3aff9a', opacity: 0.25, stroke: '#e2b84a', strokeWidth: 5 });
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; s += rect(gx + Math.cos(a) * gr - 10, gy + Math.sin(a) * gr - 10, 20, 20, { fill: '#e2b84a', stroke: INK, strokeWidth: 2 }); }
      if (o.rubble) s += Array.from({ length: 8 }, (_, i) => poly([[i * 60, H * 0.5], [i * 60 + 50, H * 0.4], [i * 60 + 70, H * 0.6]], { fill: '#2a2a2e', stroke: INK, strokeWidth: 2 })).join('');
      return s + floor(W, H, H * (o.floor ?? 0.76), '#141414', '#1e1e1e');
    },
  };
};
