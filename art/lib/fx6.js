// Effects and set-pieces for EP66-70. Merged into FX by fx.js. No text.
'use strict';
const { INK, rng, path, circle, ellipse, rect, poly, f } = require('./util');

module.exports = function fx6({ glow }) {
  return {
    // the gold-emerald warp vortex filling the obsidian ring (ch.66 L105)
    warpVortex: (W, H, o) => {
      const r0 = o.r || 220; let s = glow(o.x, o.y, r0 * 1.6, '#3aff9a', 0.4) + circle(o.x, o.y, r0, { fill: '#1a5a3a', opacity: 0.6 });
      for (let i = 0; i < 7; i++) { const r = r0 * (1 - i * 0.13); s += path(`M${f(o.x + r)},${o.y} A${f(r)},${f(r)} 0 1,1 ${f(o.x - r * 0.3)},${f(o.y - r * 0.95)}`, { stroke: i % 2 ? '#e2b84a' : '#7affc0', strokeWidth: 8 - i * 0.6, fill: 'none', opacity: 0.85 }); }
      return s + circle(o.x, o.y, r0 * 0.12, { fill: '#ffffff', opacity: 0.9 });
    },
    // heat shimmer lines over the sand
    heatHaze: (W, H, o) => { let s = ''; for (let i = 0; i < (o.n || 6); i++) { const y = (o.y ?? H * 0.5) + i * 26; s += path(`M0,${y} Q${W * 0.25},${y - 10} ${W * 0.5},${y} T${W},${y}`, { stroke: '#ffffff', strokeWidth: 3, opacity: 0.35, fill: 'none' }); } return s; },
    // footprints in the sand; o.erased = smoothed over by silent ripples (ch.67 L47-49)
    footprints: (W, H, o) => {
      const r = rng('fp' + o.x); let s = '';
      for (let i = 0; i < (o.n || 8); i++) { const x = o.x + i * (o.dx || 60), y = o.y + (i % 2 ? 18 : -18) + (r() - 0.5) * 8; s += ellipse(x, y, 16, 8, { fill: '#c8b48e', opacity: o.erased ? 0.12 : 0.8 }); }
      if (o.erased) for (let i = 0; i < 4; i++) s += path(`M${o.x - 40},${o.y - 30 + i * 18} Q${o.x + (o.n || 8) * (o.dx || 60) / 2},${o.y - 40 + i * 18} ${o.x + (o.n || 8) * (o.dx || 60)},${o.y - 30 + i * 18}`, { stroke: '#fffaf0', strokeWidth: 3, fill: 'none', opacity: 0.7 });
      return s;
    },
    // quicksand vortex: concentric spiral sinking to a centre (ch.67 L123)
    sandVortex: (W, H, o) => {
      let s = ellipse(o.x, o.y, o.rx || 360, o.ry || 110, { fill: '#d8c8a4', opacity: 0.8 });
      for (let i = 0; i < 8; i++) s += ellipse(o.x, o.y + i * 4, (o.rx || 360) * (1 - i * 0.11), (o.ry || 110) * (1 - i * 0.11), { fill: 'none', stroke: i % 2 ? '#b8a07c' : '#f4eedf', strokeWidth: 5 });
      return s + ellipse(o.x, o.y + 30, (o.rx || 360) * 0.12, (o.ry || 110) * 0.12, { fill: '#5a4a36' });
    },
    // a white sand column erupting (ch.67 L143)
    sandColumn: (W, H, o) => {
      const r = rng('sc' + o.x); let s = path(`M${o.x - (o.w || 300) / 2},${o.y} C${o.x - 200},${o.y - 400} ${o.x - 120},${o.y - 900} ${o.x},${o.y - (o.h || 1000)} C${o.x + 120},${o.y - 900} ${o.x + 200},${o.y - 400} ${o.x + (o.w || 300) / 2},${o.y}Z`, { fill: '#f4eedf', opacity: 0.7 });
      for (let i = 0; i < 24; i++) s += circle(o.x + (r() - 0.5) * (o.w || 300) * 1.6, o.y - r() * (o.h || 1000), 6 + r() * 16, { fill: '#e6dcc4', opacity: 0.8 });
      return s;
    },
    // sandstone shackles clamping ankles at the given points (ch.68 L79)
    sandShackle: (W, H, o) => (o.pts || []).map(([x, y, w = 50]) => rect(x - w / 2, y - 50, w, 54, { fill: '#c8a878', stroke: INK, strokeWidth: 3, rx: 8 }) + path(`M${x - w / 2},${y - 30} L${x + w / 2},${y - 30}`, { stroke: '#a8885a', strokeWidth: 3 })).join(''),
    // a vibration-code pulse travelling through rock (rings on the ground)
    quakeRings: (W, H, o) => { let s = ''; for (let i = 1; i <= (o.n || 4); i++) s += ellipse(o.x, o.y, i * (o.r || 60), i * (o.r || 60) * 0.25, { fill: 'none', stroke: o.color || '#e8a020', strokeWidth: 4, opacity: 1 - i * 0.18 }); return s; },
    // blobs of clear blue slime around a body
    slime: (W, H, o) => { const r = rng('sl' + o.x + o.y); let s = ''; for (let i = 0; i < (o.n || 6); i++) s += ellipse(o.x + (r() - 0.5) * (o.w || 300), o.y + (r() - 0.5) * (o.h || 80), 30 + r() * 50, 18 + r() * 24, { fill: '#9ae8ff', opacity: 0.45, stroke: '#cff6ff', strokeWidth: 2 }); return s; },
    // purified cold water condensed from the air (Solon, ch.69 L207)
    waterDrops: (W, H, o) => { const r = rng('wd' + o.x); let s = ''; for (let i = 0; i < (o.n || 12); i++) { const x = o.x + (r() - 0.5) * (o.w || 120), y = o.y + r() * (o.h || 160); s += path(`M${f(x)},${f(y - 10)} q6,10 0,14 q-6,-4 0,-14Z`, { fill: '#9ae8ff', stroke: '#5ab8e0', strokeWidth: 1.4 }); } return s; },
    // the stone-cloud curtains sliding shut across the canyon mouth (ch.69 L215-217); o.t 0..1
    stoneCurtain: (W, H, o) => {
      const t = o.t ?? 0.5, h = o.h || H * 0.22;
      let s = rect(0, 0, W * t * 0.5, h, { fill: '#5a4a44', stroke: INK, strokeWidth: 4 }) + rect(W - W * t * 0.5, 0, W * t * 0.5, h, { fill: '#5a4a44', stroke: INK, strokeWidth: 4 });
      for (let x = 20; x < W * t * 0.5; x += 60) s += path(`M${x},0 L${x},${h}`, { stroke: '#4a3a36', strokeWidth: 3 });
      for (let x = W - 20; x > W - W * t * 0.5; x -= 60) s += path(`M${x},0 L${x},${h}`, { stroke: '#4a3a36', strokeWidth: 3 });
      return s + [0.1, 0.3, 0.7, 0.9].map((x) => circle(W * x, h + 10, 14, { fill: '#7a6a5a', stroke: INK, strokeWidth: 3 }) + path(`M${W * x},${h + 24} L${W * x},${h + 80}`, { stroke: '#6a5a3a', strokeWidth: 4, strokeDasharray: '8 6' })).join('');
    },
    // chameleon skin-camouflage outline peeling off a wall (Tikky & Koko, ch.69 L177)
    camo: (W, H, o) => path(`M${o.x - 40},${o.y} C${o.x - 50},${o.y - 120} ${o.x + 50},${o.y - 120} ${o.x + 40},${o.y} Z`, { fill: '#d8a888', opacity: 0.6, stroke: '#ffffff', strokeWidth: 3, strokeDasharray: '10 8' }),
    // a wall of thrown-up sand with sparks (Volt + Nox barrier, ch.70 L195-197)
    sandWall: (W, H, o) => { const r = rng('sw' + o.x); let s = ''; for (let i = 0; i < 18; i++) s += circle(o.x + (r() - 0.5) * (o.w || 500), o.y - r() * (o.h || 260), 24 + r() * 40, { fill: '#e6dcc4', opacity: 0.75 }); return s; },
    // water gushing along a channel (ch.70 L241)
    gush: (W, H, o) => path(`M${o.x1},${o.y1} Q${(o.x1 + o.x2) / 2},${(o.y1 + o.y2) / 2 - 40} ${o.x2},${o.y2}`, { stroke: '#7ad8ff', strokeWidth: o.w || 40, fill: 'none', opacity: 0.75, strokeLinecap: 'round' }) + path(`M${o.x1},${o.y1} Q${(o.x1 + o.x2) / 2},${(o.y1 + o.y2) / 2 - 40} ${o.x2},${o.y2}`, { stroke: '#e8fbff', strokeWidth: 6, fill: 'none', strokeDasharray: '30 20' }),
    // drifting scent ribbon on the wind (Kira fanning the water smell south)
    scent: (W, H, o) => { let s = ''; for (let i = 0; i < 3; i++) s += path(`M${o.x1},${o.y1 + i * 30} C${o.x1 + 100},${o.y1 - 60 + i * 30} ${o.x2 - 100},${o.y2 + 60 + i * 30} ${o.x2},${o.y2 + i * 30}`, { stroke: '#bff3ff', strokeWidth: 6, fill: 'none', opacity: 0.6, strokeDasharray: '24 14' }); return s; },
    // a giant compass-needle glow over the warp key (ch.66 L103)
    needleSpin: (W, H, o) => glow(o.x, o.y, o.r || 120, '#ffd45a', 0.7) + Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 - (i / 10) * Math.PI * 2; return path(`M${o.x},${o.y} L${f(o.x + Math.cos(a) * (o.r || 120))},${f(o.y + Math.sin(a) * (o.r || 120))}`, { stroke: '#ffe8a0', strokeWidth: 3, opacity: 0.2 + i * 0.07 }); }).join(''),
    // a pebble-sized blade cut: blood on a fingertip (ch.68 L111)
    dropBlood: (W, H, o) => path(`M${o.x},${o.y - 14} q10,14 0,22 q-10,-8 0,-22Z`, { fill: '#c0172a', stroke: INK, strokeWidth: 2 }),
  };
};
