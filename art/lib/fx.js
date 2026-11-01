// Visual effects layered over/under characters. No text is ever drawn here:
// sound effects and system messages are placed by the website as overlays.
'use strict';
const { INK, rng, path, circle, ellipse, rect, line, poly, g, f, pt } = require('./util');
const { glow, holoPanel, turret } = require('./backgrounds');

const FX = {
  beam: (W, H, o) => { // light-weapon shot
    const c = o.color || '#ffffff', w = o.w || 16;
    const a = [o.x1, o.y1], b = [o.x2, o.y2];
    return path(`M${a} L${b}`, { stroke: o.glow || '#9ad8ff', strokeWidth: w * 3, opacity: 0.3, strokeLinecap: 'round' }) +
      path(`M${a} L${b}`, { stroke: c, strokeWidth: w, strokeLinecap: 'round' }) +
      path(`M${a} L${b}`, { stroke: '#fff', strokeWidth: w * 0.35, strokeLinecap: 'round' }) +
      glow(o.x1, o.y1, w * 4, o.glow || '#9ad8ff', 0.8);
  },
  muzzle: (W, H, o) => glow(o.x, o.y, (o.r || 40) * 2, o.color || '#bfefff', 0.9) + poly(Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2, r = (i % 2 ? 0.4 : 1) * (o.r || 40); return [o.x + Math.cos(a) * r, o.y + Math.sin(a) * r]; }), { fill: '#fff' }),
  impact: (W, H, o) => {
    const r0 = o.r || 90, n = 18, c = o.color || '#fff7d0';
    const pts = Array.from({ length: n * 2 }, (_, i) => { const a = (i / (n * 2)) * Math.PI * 2, r = i % 2 ? r0 * 0.45 : r0 * (0.8 + ((i * 37) % 10) / 25); return [o.x + Math.cos(a) * r, o.y + Math.sin(a) * r]; });
    return glow(o.x, o.y, r0 * 1.8, c, 0.6) + poly(pts, { fill: c, stroke: o.stroke || INK, strokeWidth: 3 });
  },
  speed: (W, H, o) => { // radial focus lines over the scene
    const r = rng('sp' + (o.seed || '') + W + H), cx = o.cx ?? W / 2, cy = o.cy ?? H / 2, c = o.color || '#ffffff';
    let s = '';
    for (let i = 0; i < (o.n || 90); i++) {
      const a = r() * Math.PI * 2, r0 = (o.inner || 200) + r() * 120, r1 = Math.max(W, H) * 1.2;
      s += path(`M${f(cx + Math.cos(a) * r0)},${f(cy + Math.sin(a) * r0)} L${f(cx + Math.cos(a + 0.01) * r1)},${f(cy + Math.sin(a + 0.01) * r1)} L${f(cx + Math.cos(a - 0.01) * r1)},${f(cy + Math.sin(a - 0.01) * r1)}Z`, { fill: c, opacity: o.op || 0.5 });
    }
    return s;
  },
  hlines: (W, H, o) => { const r = rng('hl' + H); let s = ''; for (let i = 0; i < (o.n || 30); i++) s += rect(r() * W * 0.3 + (o.dir === 'l' ? W * 0.5 : 0), r() * H, W * (0.2 + r() * 0.4), 2 + r() * 3, { fill: o.color || '#fff', opacity: 0.4 }); return s; },
  vlines: (W, H, o) => { const r = rng('vlx' + H); let s = ''; for (let i = 0; i < (o.n || 40); i++) s += rect(r() * W, r() * H * 0.6, 2 + r() * 3, H * (0.2 + r() * 0.5), { fill: o.color || '#fff', opacity: 0.35 }); return s; },
  blood: (W, H, o) => {
    const r = rng('bl' + o.x + o.y), s0 = o.s || 1, c = o.color || '#b3101f';
    let s = '';
    for (let i = 0; i < (o.n || 9); i++) { const a = (o.dir ?? -90) + (r() - 0.5) * (o.spread || 120), d = (20 + r() * 90) * s0; const p = pt([o.x, o.y], a, d); s += circle(p[0], p[1], (3 + r() * 9) * s0, { fill: c }); }
    s += ellipse(o.x, o.y, 16 * s0, 12 * s0, { fill: c });
    return s;
  },
  pool: (W, H, o) => ellipse(o.x, o.y, o.rx || 90, o.ry || 18, { fill: '#7a0a16', opacity: 0.9 }),
  reset: (W, H, o) => { // the 10-second reset: cyan-white ring with ten ticks
    const r = o.r || 110, cx = o.x, cy = o.y;
    let s = glow(cx, cy, r * 1.8, '#bff6ff', 0.75) + circle(cx, cy, r, { fill: 'none', stroke: '#eaffff', strokeWidth: 6 }) + circle(cx, cy, r * 0.82, { fill: 'none', stroke: '#7ae6ff', strokeWidth: 3, strokeDasharray: '6 8' });
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 - Math.PI / 2; s += line([cx + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r * 0.9], [cx + Math.cos(a) * r * 1.12, cy + Math.sin(a) * r * 1.12], { stroke: '#ffffff', strokeWidth: 5, strokeLinecap: 'round' }); }
    return s;
  },
  clock: (W, H, o) => { // countdown dial; o.t = seconds elapsed (0-10)
    const r = o.r || 60, cx = o.x, cy = o.y, t = Math.max(0, Math.min(10, o.t ?? 0));
    let s = circle(cx, cy, r, { fill: '#0c0a14', opacity: 0.75, stroke: '#7ae6ff', strokeWidth: 4 });
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 - Math.PI / 2; s += circle(cx + Math.cos(a) * r * 0.78, cy + Math.sin(a) * r * 0.78, r * 0.09, { fill: i < t ? '#7ae6ff' : '#2a3a4a' }); }
    const a = (t / 10) * Math.PI * 2 - Math.PI / 2;
    return s + line([cx, cy], [cx + Math.cos(a) * r * 0.62, cy + Math.sin(a) * r * 0.62], { stroke: '#fff', strokeWidth: 4, strokeLinecap: 'round' }) + circle(cx, cy, 5, { fill: '#fff' });
  },
  debris: (W, H, o) => { const r = rng('db' + o.x + o.y); let s = ''; for (let i = 0; i < (o.n || 16); i++) { const p = [o.x + (r() - 0.5) * (o.w || 300), o.y + (r() - 0.5) * (o.h || 200)], sz = 6 + r() * 22; s += poly([[p[0], p[1]], [p[0] + sz, p[1] + sz * 0.3], [p[0] + sz * 0.6, p[1] + sz]], { fill: o.color || '#6a6a72', stroke: INK, strokeWidth: 2 }); } return s; },
  dust: (W, H, o) => { const r = rng('du' + o.x); let s = ''; for (let i = 0; i < (o.n || 10); i++) s += circle(o.x + (r() - 0.5) * (o.w || 400), o.y + (r() - 0.5) * (o.h || 160), 30 + r() * 60, { fill: o.color || '#8a8478', opacity: 0.25 }); return s; },
  smoke: (W, H, o) => FX.dust(W, H, { n: 14, color: '#6a5a7a', ...o }),
  fog: (W, H, o) => { const r = rng('fog' + H); let s = ''; for (let i = 0; i < 12; i++) s += ellipse(r() * W, H * (o.y ?? 0.7) + (r() - 0.5) * H * 0.4, 200 + r() * 200, 40 + r() * 50, { fill: o.color || '#5a6ad0', opacity: o.op || 0.2 }); return s; },
  sparks: (W, H, o) => { const r = rng('sk' + o.x + o.y); let s = ''; for (let i = 0; i < (o.n || 14); i++) { const a = r() * Math.PI * 2, d = 20 + r() * (o.r || 80); s += line([o.x + Math.cos(a) * d * 0.3, o.y + Math.sin(a) * d * 0.3], [o.x + Math.cos(a) * d, o.y + Math.sin(a) * d], { stroke: o.color || '#ffe27a', strokeWidth: 3, strokeLinecap: 'round' }); } return s; },
  rain: (W, H, o) => { const r = rng('rn' + H); let s = ''; for (let i = 0; i < (o.n || 90); i++) { const x = r() * W, y = r() * H; s += line([x, y], [x - 6, y + 30], { stroke: o.color || '#a9b0a8', strokeWidth: 2, opacity: 0.55 }); } return s; },
  thread: (W, H, o) => { // energy thread / neural fibre
    const c = o.color || '#ff3a4a', a = [o.x1, o.y1], b = [o.x2, o.y2];
    const m = [(a[0] + b[0]) / 2 + (o.bend || 0), (a[1] + b[1]) / 2 + (o.sag ?? -30)];
    return path(`M${a} Q${m} ${b}`, { stroke: c, strokeWidth: (o.w || 3) * 3.5, opacity: 0.25, fill: 'none' }) + path(`M${a} Q${m} ${b}`, { stroke: c, strokeWidth: o.w || 3, fill: 'none', strokeLinecap: 'round' });
  },
  threads: (W, H, o) => (o.to || []).map(([x, y], i) => FX.thread(W, H, { x1: o.x, y1: o.y, x2: x, y2: y, color: o.color, bend: (i % 2 ? 1 : -1) * 30, w: o.w })).join(''),
  holo: (W, H, o) => holoPanel(o.x, o.y, o.w, o.h, o.color || '#ff3a4a'),
  alertScreen: (W, H, o) => rect(o.x, o.y, o.w, o.h, { fill: '#3a0008', opacity: 0.6, stroke: '#ff2a3a', strokeWidth: 4 }) + glow(o.x + o.w / 2, o.y + o.h / 2, o.w * 0.7, '#ff2a3a', 0.35) + rect(o.x + 12, o.y + 12, o.w - 24, 10, { fill: '#ff4a5a', opacity: 0.7 }) + rect(o.x + 12, o.y + o.h - 22, o.w - 24, 10, { fill: '#ff4a5a', opacity: 0.7 }),
  drone: (W, H, o) => { const s = o.s || 1; return g(ellipse(0, 0, 50, 18, { fill: '#e9edf2', stroke: INK, strokeWidth: 3 }) + rect(-70, -10, 30, 6, { fill: '#555' }) + rect(40, -10, 30, 6, { fill: '#555' }) + ellipse(-55, -14, 26, 5, { fill: '#aaa', opacity: 0.6 }) + ellipse(55, -14, 26, 5, { fill: '#aaa', opacity: 0.6 }) + circle(0, 8, 9, { fill: '#2a2e38', stroke: INK, strokeWidth: 2 }) + circle(0, 8, 4, { fill: o.eye || '#5ad8ff' }) + (o.scan ? path('M0,14 L-80,240 L80,240Z', { fill: o.eye || '#5ad8ff', opacity: 0.15 }) : ''), { transform: `translate(${o.x},${o.y}) scale(${s})` }); },
  turret: (W, H, o) => g(turret(0, 0), { transform: `translate(${o.x},${o.y}) scale(${o.s || 1})${o.broken ? ' rotate(20)' : ''}` }) + (o.laser ? line([o.x - 60 * (o.s || 1), o.y + 20 * (o.s || 1)], [o.lx, o.ly], { stroke: '#ff2a2a', strokeWidth: 3, opacity: 0.85 }) : '') + (o.error ? glow(o.x, o.y + 20, 70, '#ff8a2a', 0.7) : ''),
  bag: (W, H, o) => { // bio-hazard body bag
    const s = o.s || 1;
    return g(path('M-150,10 C-160,-50 -100,-70 -40,-60 C20,-80 120,-60 150,-20 C170,20 120,60 40,56 C-20,70 -140,60 -150,10Z', { fill: '#121116', stroke: '#3a3a44', strokeWidth: 4 }) +
      path('M-120,-20 C-60,-34 40,-34 130,-14', { stroke: '#5a5a66', strokeWidth: 4, fill: 'none', strokeDasharray: '4 3' }) +
      path('M-80,10 C-60,30 -20,30 0,14 M30,0 C60,20 90,16 110,0', { stroke: '#2a2a32', strokeWidth: 3, fill: 'none' }) +
      (o.torn ? path('M60,-40 L80,-60 L94,-36 L110,-58 L120,-30', { stroke: '#7a7a86', strokeWidth: 3, fill: 'none' }) : '') +
      circle(-100, -40, 12, { fill: '#e3a82b', stroke: INK, strokeWidth: 2 }), { transform: `translate(${o.x},${o.y}) rotate(${o.rot || 0}) scale(${s})` });
  },
  roofBurst: (W, H, o) => FX.debris(W, H, { x: o.x, y: o.y, w: 360, h: 220, n: 26, color: '#7a7a82' }) + FX.impact(W, H, { x: o.x, y: o.y, r: 110, color: '#ffd8a8' }),
  crack: (W, H, o) => path(`M${o.x},${o.y} l40,20 l20,50 M${o.x},${o.y} l-50,10 l-20,40 M${o.x},${o.y} l10,-50 l40,-20 M${o.x},${o.y} l-30,-40`, { stroke: o.color || INK, strokeWidth: 4, fill: 'none' }),
  goldColumn: (W, H, o) => path(`M${o.x - (o.w || 120)},0 L${o.x + (o.w || 120)},0 L${o.x + (o.w || 120) * 1.4},${H} L${o.x - (o.w || 120) * 1.4},${H}Z`, { fill: '#ffe27a', opacity: 0.55 }) + glow(o.x, H * 0.5, H * 0.6, '#ffd45a', 0.6) + path(`M${o.x - 20},0 L${o.x + 20},0 L${o.x + 30},${H} L${o.x - 30},${H}Z`, { fill: '#fff', opacity: 0.7 }),
  wave: (W, H, o) => path(`M${o.x1},${o.y1} Q${o.cx},${o.cy} ${o.x2},${o.y2}`, { stroke: o.color || '#ffd45a', strokeWidth: (o.w || 40) * 1.8, fill: 'none', opacity: 0.3, strokeLinecap: 'round' }) + path(`M${o.x1},${o.y1} Q${o.cx},${o.cy} ${o.x2},${o.y2}`, { stroke: o.color || '#ffd45a', strokeWidth: o.w || 40, fill: 'none', strokeLinecap: 'round' }) + path(`M${o.x1},${o.y1} Q${o.cx},${o.cy} ${o.x2},${o.y2}`, { stroke: '#fff', strokeWidth: (o.w || 40) * 0.3, fill: 'none', strokeLinecap: 'round' }),
  steam: (W, H, o) => { const r = rng('st' + o.x); let s = ''; for (let i = 0; i < 6; i++) s += circle(o.x + (r() - 0.5) * 60, o.y - i * 26, 18 + i * 5, { fill: o.color || '#e9f6f4', opacity: 0.45 - i * 0.05 }); return s; },
  net: (W, H, o) => { let s = ''; for (let i = 0; i <= 8; i++) { s += line([o.x + (i * o.w) / 8, o.y], [o.x + (i * o.w) / 8 + 20, o.y + o.h], { stroke: '#b9c0c8', strokeWidth: 3 }); s += line([o.x, o.y + (i * o.h) / 8], [o.x + o.w, o.y + (i * o.h) / 8 + 10], { stroke: '#b9c0c8', strokeWidth: 3 }); } return s; },
  chain: (W, H, o) => { const n = Math.ceil(Math.hypot(o.x2 - o.x1, o.y2 - o.y1) / 16); let s = ''; for (let i = 0; i < n; i++) { const t = i / n, x = o.x1 + (o.x2 - o.x1) * t, y = o.y1 + (o.y2 - o.y1) * t + Math.sin(t * Math.PI) * (o.sag || 0); s += ellipse(x, y, 8, 5, { fill: 'none', stroke: '#a9b0ba', strokeWidth: 3, transform: `rotate(${f((Math.atan2(o.y2 - o.y1, o.x2 - o.x1) * 180) / Math.PI)} ${f(x)} ${f(y)})` }); } return s; },
  vignette: (W, H, o) => `<defs><radialGradient id="vg${W}${H}" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="${o.color || '#000'}" stop-opacity="${o.op || 0.7}"/></radialGradient></defs>` + rect(0, 0, W, H, { fill: `url(#vg${W}${H})` }),
  tint: (W, H, o) => rect(0, 0, W, H, { fill: o.color || '#ff0000', opacity: o.op || 0.2, style: `mix-blend-mode:${o.mode || 'multiply'}` }),
  glow: (W, H, o) => glow(o.x, o.y, o.r || 100, o.color || '#fff', o.op ?? 0.6),
  lightning: (W, H, o) => path(`M${o.x},${o.y} l20,40 l-14,10 l30,50 l-10,8 l24,40`, { stroke: o.color || '#bff6ff', strokeWidth: 4, fill: 'none' }),
  sweat: (W, H, o) => path(`M${o.x},${o.y} C${o.x - 8},${o.y + 14} ${o.x - 8},${o.y + 24} ${o.x},${o.y + 26} C${o.x + 8},${o.y + 24} ${o.x + 8},${o.y + 14} ${o.x},${o.y}Z`, { fill: '#bfe6ff', stroke: '#2a5a7a', strokeWidth: 2 }),
  scribble: (W, H, o) => path(`M${o.x},${o.y} c20,-30 40,30 60,0 c20,-30 40,30 60,0`, { stroke: o.color || INK, strokeWidth: 3, fill: 'none' }),
  stars: (W, H, o) => { let s = ''; for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; s += circle(o.x + Math.cos(a) * (o.r || 50), o.y + Math.sin(a) * (o.r || 50) * 0.4, 6, { fill: '#ffe27a', stroke: INK, strokeWidth: 2 }); } return s; },
  silhouette: (W, H, o) => rect(0, 0, W, H, { fill: o.color || '#000', opacity: o.op || 0.6 }),
  shape: (W, H, o) => o.svg || '',
  rubble: (W, H, o) => { const r = rng('rb' + o.y); let s = ''; for (let i = 0; i < (o.n || 14); i++) { const x = o.x + r() * (o.w || W), y = o.y + r() * (o.h || 60), sz = 14 + r() * 40; s += poly([[x, y], [x + sz, y - sz * 0.4], [x + sz * 1.3, y + sz * 0.3], [x + sz * 0.3, y + sz * 0.5]], { fill: o.color || '#5a5a60', stroke: INK, strokeWidth: 2 }); } return s; },
  table: (W, H, o) => rect(o.x, o.y, o.w || 360, 20, { fill: o.color || '#c9d2d0', stroke: INK, strokeWidth: 3 }) + rect(o.x + 16, o.y + 20, 12, o.h || 80, { fill: '#7a8482' }) + rect(o.x + (o.w || 360) - 28, o.y + 20, 12, o.h || 80, { fill: '#7a8482' }),
  crateStack: (W, H, o) => { let s = ''; for (let i = 0; i < (o.n || 4); i++) s += g(require('./props').prop('crate'), { transform: `translate(${o.x + (i % 2) * 120},${o.y - Math.floor(i / 2) * 92}) scale(${o.s || 1})` }); return s; },
  cart: (W, H, o) => g(rect(-10, -80, 240, 70, { fill: '#7a8088', stroke: INK, strokeWidth: 3 }) + circle(20, 0, 16, { fill: '#2a2a30', stroke: INK, strokeWidth: 3 }) + circle(200, 0, 16, { fill: '#2a2a30', stroke: INK, strokeWidth: 3 }) + path('M230,-80 L280,-130', { stroke: '#555', strokeWidth: 8 }) + (o.crates ? FX.crateStack(W, H, { x: 0, y: -132, n: o.crates, s: 0.9 }) : ''), { transform: `translate(${o.x},${o.y}) scale(${o.s || 1})` }),
  dummy: (W, H, o) => g(rect(-12, 0, 24, 160, { fill: '#7a7f8a', stroke: INK, strokeWidth: 3 }) + rect(-70, 150, 140, 20, { fill: '#5a5f6a', stroke: INK, strokeWidth: 3 }) +
    path('M-50,-200 L50,-200 L60,-60 L40,0 L-40,0 L-60,-60Z', { fill: '#a9afba', stroke: INK, strokeWidth: 4 }) + circle(0, -250, 42, { fill: '#a9afba', stroke: INK, strokeWidth: 4 }) +
    (o.melted ? circle(0, -110, 34, { fill: '#1a1218' }) + circle(0, -110, 40, { fill: 'none', stroke: '#ff8a2a', strokeWidth: 8 }) + path('M-30,-80 q-4,30 2,50 M26,-82 q6,26 0,46', { stroke: '#ffb04a', strokeWidth: 7, fill: 'none', strokeLinecap: 'round' }) + FX.steam(W, H, { x: 0, y: -150 }) : ''),
    { transform: `translate(${o.x},${o.y}) scale(${o.s || 1})` }),
  prop: (W, H, o) => g(require('./props').prop(o.n, o), { transform: `translate(${o.x},${o.y}) rotate(${o.a || 0}) scale(${o.s || 1})` }),
};

Object.assign(FX, require('./fx2')({ glow }));
Object.assign(FX, require('./fx3')({ glow }));
Object.assign(FX, require('./fx4')({ glow }));
Object.assign(FX, require('./fx5')({ glow }));
Object.assign(FX, require('./fx6')({ glow }));

function fx(name, W, H, o = {}) {
  const fn = FX[name];
  if (!fn) throw new Error('unknown fx ' + name);
  return fn(W, H, o);
}

module.exports = { fx, FX };
