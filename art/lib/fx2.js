// Effects and set-pieces for EP11-20. Merged into FX by fx.js. No text.
'use strict';
const { INK, rng, path, circle, ellipse, rect, line, poly, g, f, pt } = require('./util');

module.exports = function fx2({ glow }) {
  const moth = (x, y, s, rot, c = '#3a2a52') => g(path('M0,0 C-14,-16 -26,-6 -18,6 C-12,12 -4,8 0,0Z M0,0 C14,-16 26,-6 18,6 C12,12 4,8 0,0Z', { fill: c, stroke: '#140c20', strokeWidth: 1.2 }) + circle(-12, -2, 2.4, { fill: '#c58aff' }) + circle(12, -2, 2.4, { fill: '#c58aff' }), { transform: `translate(${f(x)},${f(y)}) rotate(${f(rot)}) scale(${f(s)})` });
  const FX2 = {
    moths: (W, H, o) => { // a swarm of glowing purple-black moths
      const r = rng('mo' + o.x + o.y);
      let s = glow(o.x, o.y, (o.r || 120) * 1.3, '#c58aff', 0.25);
      for (let i = 0; i < (o.n || 30); i++) { const a = r() * Math.PI * 2, d = r() * (o.r || 120); s += moth(o.x + Math.cos(a) * d * (o.sx || 1), o.y + Math.sin(a) * d, 0.8 + r() * 0.8, r() * 60 - 30); }
      for (let i = 0; i < (o.dust ?? 20); i++) s += circle(o.x + (r() - 0.5) * (o.r || 120) * 2.4, o.y + r() * (o.r || 120) * 1.6, 2, { fill: '#e0b8ff', opacity: 0.8 });
      return s;
    },
    motorbike: (W, H, o) => { // Roxy's armoured custom heavy bike, black and pink
      const s0 = o.s || 1, m = o.face === 'l' ? -1 : 1;
      const wheel = (x) => circle(x, 0, 64, { fill: '#121117', stroke: INK, strokeWidth: 4 }) + circle(x, 0, 40, { fill: '#2a2830', stroke: '#ff4aa0', strokeWidth: 4 }) + circle(x, 0, 10, { fill: '#a9afb9' });
      let b = wheel(-150) + wheel(170);
      b += path('M-150,0 L-60,-100 L90,-110 L170,0 L120,-20 L40,-40 L-80,-30Z', { fill: '#16151b', stroke: INK, strokeWidth: 4 });
      b += path('M-80,-110 L60,-130 L110,-110 L60,-96 L-60,-90Z', { fill: '#ff4aa0', stroke: INK, strokeWidth: 3 });
      b += path('M120,-110 L190,-150 L230,-120', { stroke: '#a9afb9', strokeWidth: 8, fill: 'none', strokeLinecap: 'round' });
      b += path('M200,-40 L270,-30 L250,10 L196,0Z', { fill: '#5a5e66', stroke: INK, strokeWidth: 3 }) + path('M250,-40 l30,-30 M260,-20 l40,-10', { stroke: '#a9afb9', strokeWidth: 5 });
      b += rect(-120, -76, 120, 36, { fill: '#3a7a9a', stroke: INK, strokeWidth: 3, rx: 16 }) + rect(-120, -40, 120, 30, { fill: '#3a7a9a', stroke: INK, strokeWidth: 3, rx: 14 });
      b += circle(232, -120, 16, { fill: '#ff8ad8', stroke: INK, strokeWidth: 3 }) + glow(232, -120, 90, '#ff4aa0', 0.6);
      if (o.flame) b += path('M-200,-60 L-330,-70 L-210,-40 L-340,-30 L-200,-20Z', { fill: '#5ad8ff', opacity: 0.85 }) + path('M-200,-60 L-290,-60 L-200,-30Z', { fill: '#ff8ad8' });
      b += path('M-210,-50 L-120,-40 M-210,-30 L-120,-26', { stroke: '#a9afb9', strokeWidth: 10, strokeLinecap: 'round' });
      if (o.ghost) b = g(b, { opacity: 0.55 }) + g(b, { transform: 'translate(-50,0)', opacity: 0.25 });
      if (o.wreck) b = path('M-200,0 L-60,-80 L-20,-10Z M40,-90 L180,-40 L120,10Z M-40,10 L60,-20 L80,30Z', { fill: '#2a2830', stroke: INK, strokeWidth: 4 }) + circle(-160, 10, 60, { fill: 'none', stroke: '#121117', strokeWidth: 18 }) + path('M-180,-60 l40,-80 l30,60 l40,-90 l30,90', { fill: '#ff8a2a', opacity: 0.7 });
      return g(b, { transform: `translate(${o.x},${o.y}) rotate(${o.rot || 0}) scale(${s0 * m},${s0})` });
    },
    roulette: (W, H, o) => { // VIP roulette table with the wheel
      const s0 = o.s || 1;
      let b = rect(-300, -20, 600, 60, { fill: '#1e5a3a', stroke: INK, strokeWidth: 4, rx: 30 }) + rect(-300, 30, 600, 24, { fill: '#4a2a14', stroke: INK, strokeWidth: 3 });
      for (let i = 0; i < 12; i++) b += rect(-40 + (i % 6) * 40, -14 + Math.floor(i / 6) * 22, 36, 18, { fill: i % 2 ? '#c0172a' : '#121117', stroke: '#e8e4dc', strokeWidth: 1.2 });
      b += ellipse(-180, 0, 100, 30, { fill: '#4a2a14', stroke: INK, strokeWidth: 3 }) + ellipse(-180, -4, 80, 22, { fill: '#121117', stroke: '#c9a040', strokeWidth: 3 });
      for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; b += line([-180 + Math.cos(a) * 30, -4 + Math.sin(a) * 8], [-180 + Math.cos(a) * 78, -4 + Math.sin(a) * 21], { stroke: i % 2 ? '#c0172a' : '#e8e4dc', strokeWidth: 3 }); }
      b += circle(-180, -4, 10, { fill: '#c9a040', stroke: INK, strokeWidth: 2 }) + circle(-140 + (o.ball || 0), -12, 5, { fill: '#e8eaee', stroke: INK, strokeWidth: 1.4 });
      if (o.spin) b += path('M-260,-30 A90,30 0 0,1 -100,-30', { stroke: '#fff', strokeWidth: 3, fill: 'none', opacity: 0.6 });
      if (o.card) b += g(require('./props').prop('goldCard'), { transform: 'translate(-200,-40) rotate(-10)' });
      if (o.chips) for (let i = 0; i < 6; i++) b += ellipse(80 + i * 26, -6, 11, 5, { fill: ['#e8c25a', '#c0172a', '#121117'][i % 3], stroke: INK, strokeWidth: 1.4 });
      if (o.broken) b += path('M-60,-20 L-20,40 L20,-20 M120,-20 l20,50', { stroke: INK, strokeWidth: 5 });
      return g(b, { transform: `translate(${o.x},${o.y}) scale(${s0})` });
    },
    chips: (W, H, o) => { const r = rng('ch' + o.x); let s = ''; for (let i = 0; i < (o.n || 24); i++) { const x = o.x + (r() - 0.5) * (o.w || 500), y = o.y + (r() - 0.5) * (o.h || 400); s += ellipse(x, y, 12, 5 + r() * 6, { fill: ['#e8c25a', '#c0172a', '#121117', '#e8e4dc'][i % 4], stroke: INK, strokeWidth: 1.4, transform: `rotate(${f(r() * 180)} ${f(x)} ${f(y)})` }); } return s; },
    floorEyes: (W, H, o) => { // The Floor Below: huge glowing golden eyes in a crack
      const r = rng('fe' + o.x);
      let s = path(`M${o.x - (o.w || 300)},${o.y} L${o.x - 120},${o.y - 30} L${o.x},${o.y + 10} L${o.x + 140},${o.y - 26} L${o.x + (o.w || 300)},${o.y + 4} L${o.x + 160},${o.y + 50} L${o.x},${o.y + 40} L${o.x - 140},${o.y + 56}Z`, { fill: '#050308', stroke: INK, strokeWidth: 4 });
      for (let i = 0; i < (o.n || 5); i++) { const x = o.x + (i - (o.n || 5) / 2 + 0.5) * ((o.w || 300) * 0.36), y = o.y + 14 + (r() - 0.5) * 20, rr = 12 + r() * 10; s += glow(x, y, rr * 3, '#ffd45a', 0.6) + ellipse(x, y, rr, rr * 0.8, { fill: '#ffc83a', stroke: '#7a4a0a', strokeWidth: 2 }) + ellipse(x, y, rr * 0.25, rr * 0.7, { fill: '#2a1404' }); }
      if (o.fang) s += path(`M${o.x - 60},${o.y + 40} l20,40 l20,-40 M${o.x + 30},${o.y + 36} l20,46 l20,-46`, { fill: '#efe9d6', stroke: INK, strokeWidth: 2 });
      return s;
    },
    choir: (W, H, o) => { // the Choir in the Wall: grey flesh roots with false mouths
      const r = rng('cw' + o.x + o.y);
      let s = '';
      for (let i = 0; i < 9; i++) { const a = r() * Math.PI * 2, d = 60 + r() * (o.r || 160); s += path(`M${o.x},${o.y} Q${f(o.x + Math.cos(a) * d * 0.5 + 30)},${f(o.y + Math.sin(a) * d * 0.5)} ${f(o.x + Math.cos(a) * d)},${f(o.y + Math.sin(a) * d)}`, { stroke: '#5a5560', strokeWidth: 10 + r() * 10, fill: 'none', strokeLinecap: 'round' }) + path(`M${o.x},${o.y} Q${f(o.x + Math.cos(a) * d * 0.5 + 30)},${f(o.y + Math.sin(a) * d * 0.5)} ${f(o.x + Math.cos(a) * d)},${f(o.y + Math.sin(a) * d)}`, { stroke: '#8a3a4a', strokeWidth: 2, fill: 'none', opacity: 0.6 }); }
      s += ellipse(o.x, o.y, (o.core || 90), (o.core || 90) * 0.75, { fill: '#5a5560', stroke: INK, strokeWidth: 4 });
      for (let i = 0; i < (o.mouths || 8); i++) { const x = o.x + (r() - 0.5) * (o.r || 160) * 1.4, y = o.y + (r() - 0.5) * (o.r || 160), w = 14 + r() * 18; s += path(`M${f(x - w)},${f(y)} Q${f(x)},${f(y - w * 0.6)} ${f(x + w)},${f(y)} Q${f(x)},${f(y + w * 0.7)} ${f(x - w)},${f(y)}Z`, { fill: '#3a0a14', stroke: '#c07a8a', strokeWidth: 3 }); }
      if (o.spears) for (const [x2, y2] of o.spears) s += path(`M${o.x},${o.y} L${x2},${y2}`, { stroke: '#4a4550', strokeWidth: 12, strokeLinecap: 'round' }) + path(`M${x2},${y2} l-10,-20 l24,8Z`, { fill: '#4a4550', stroke: INK, strokeWidth: 2 });
      if (o.cut) s += path(`M${o.x - (o.core || 90)},${o.y + 10} L${o.x + (o.core || 90)},${o.y - 10}`, { stroke: '#120a0e', strokeWidth: 12 }) + FX2.splat(W, H, { x: o.x, y: o.y, color: '#3a1a22' });
      return s;
    },
    splat: (W, H, o) => { const r = rng('sp' + o.x + o.y); let s = ''; for (let i = 0; i < 12; i++) { const a = r() * Math.PI * 2, d = 30 + r() * 110; s += circle(o.x + Math.cos(a) * d, o.y + Math.sin(a) * d, 4 + r() * 10, { fill: o.color || '#b3101f' }); } return s; },
    web: (W, H, o) => { // Arachne's living crimson threads covering the room
      const r = rng('wb' + (o.seed || H));
      const cx = o.x ?? W / 2, cy = o.y ?? H * 0.3;
      let s = '';
      for (let i = 0; i < (o.n || 60); i++) { const a = r() * Math.PI * 2, d = Math.max(W, H); s += path(`M${cx},${cy} Q${f(cx + Math.cos(a + 0.3) * d * 0.3)},${f(cy + Math.sin(a + 0.3) * d * 0.3)} ${f(cx + Math.cos(a) * d)},${f(cy + Math.sin(a) * d)}`, { stroke: i % 3 ? '#c0172a' : '#ff4a5a', strokeWidth: 1 + r() * 2.4, fill: 'none', opacity: o.op ?? 0.75 }); }
      for (let k = 1; k <= (o.rings ?? 0); k++) s += circle(cx, cy, k * 90, { fill: 'none', stroke: '#c0172a', strokeWidth: 1.6, opacity: 0.4 });
      return s;
    },
    needles: (W, H, o) => { const r = rng('nd' + o.x); let s = ''; for (let i = 0; i < (o.n || 16); i++) { const x = o.x + (r() - 0.5) * (o.w || 300), y = o.y + (r() - 0.5) * (o.h || 200); s += g(require('./props').prop('needle'), { transform: `translate(${f(x)},${f(y)}) rotate(${f(o.a ?? 70 + (r() - 0.5) * 20)}) scale(${f(0.6 + r() * 0.5)})` }); } return s; },
    heartCore: (W, H, o) => { // Sera's octagonal crimson crystal heart core in a black frame
      const r0 = o.r || 40, pts = Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2 + Math.PI / 8; return [o.x + Math.cos(a) * r0, o.y + Math.sin(a) * r0]; });
      let s = glow(o.x, o.y, r0 * 3, o.glow || '#ff2a3a', o.dim ? 0.25 : 0.6) + poly(pts, { fill: '#1a1218', stroke: INK, strokeWidth: 4 }) + poly(pts.map(([x, y]) => [o.x + (x - o.x) * 0.78, o.y + (y - o.y) * 0.78]), { fill: o.dim ? '#6a1a24' : '#d0182e', stroke: '#ff8a9a', strokeWidth: 2 });
      if (o.cracks) s += path(`M${o.x - r0 * 0.5},${o.y - r0 * 0.6} l${r0 * 0.3},${r0 * 0.5} l-${r0 * 0.1},${r0 * 0.4} l${r0 * 0.3},${r0 * 0.4} M${o.x + r0 * 0.2},${o.y - r0 * 0.6} l${r0 * 0.2},${r0 * 0.7}`, { stroke: '#fff', strokeWidth: 2.4, fill: 'none' });
      if (o.gold) s += path(`M${o.x - r0 * 0.5},${o.y - r0 * 0.6} l${r0 * 0.3},${r0 * 0.5} l-${r0 * 0.1},${r0 * 0.4} l${r0 * 0.3},${r0 * 0.4} M${o.x + r0 * 0.2},${o.y - r0 * 0.6} l${r0 * 0.2},${r0 * 0.7}`, { stroke: '#ffd45a', strokeWidth: 5, fill: 'none' });
      if (o.leak) s += FX2.splat(W, H, { x: o.x, y: o.y - r0, color: '#ff4a5a' });
      if (o.thread) s += path(`M${o.x},${o.y} Q${o.thread[0] - 80},${(o.y + o.thread[1]) / 2 - 60} ${o.thread[0]},${o.thread[1]}`, { stroke: '#8a0a16', strokeWidth: 6, fill: 'none' }) + path(`M${o.x},${o.y} Q${o.thread[0] - 80},${(o.y + o.thread[1]) / 2 - 60} ${o.thread[0]},${o.thread[1]}`, { stroke: '#ff4a5a', strokeWidth: 2, fill: 'none' });
      return s;
    },
    energyBall: (W, H, o) => glow(o.x, o.y, (o.r || 30) * 2.6, o.color || '#9a3aff', 0.6) + circle(o.x, o.y, o.r || 30, { fill: '#1a0a26', stroke: o.color || '#b14bff', strokeWidth: 5 }) + circle(o.x - (o.r || 30) * 0.3, o.y - (o.r || 30) * 0.3, (o.r || 30) * 0.3, { fill: '#e0b8ff', opacity: 0.6 }),
    soul: (W, H, o) => { // translucent blue-white soul core knocked out of a body
      const s0 = o.s || 1;
      return glow(o.x, o.y, 140 * s0, '#bfe6ff', 0.55) + g(path('M0,-80 C40,-80 50,-30 40,0 C60,30 40,90 0,100 C-40,90 -60,30 -40,0 C-50,-30 -40,-80 0,-80Z', { fill: '#dff4ff', opacity: 0.55, stroke: '#9fd8ff', strokeWidth: 3 }) + circle(0, -40, 26, { fill: '#ffffff', opacity: 0.6 }), { transform: `translate(${o.x},${o.y}) scale(${s0})` });
    },
    wingLines: (W, H, o) => { const r = rng('wl' + o.x); let s = ''; for (let i = 0; i < (o.n || 10); i++) { const y = o.y + (r() - 0.5) * (o.h || 200); s += line([o.x, y], [o.x - (o.len || 300) * (0.5 + r() * 0.5), y + (r() - 0.5) * 10], { stroke: o.color || '#7ad0ff', strokeWidth: 3, opacity: 0.7 }); } return s; },
    bars: (W, H, o) => { let s = ''; for (let i = 0; i < (o.n || 6); i++) s += rect(o.x + i * (o.gap || 40), o.y, 8, o.h || 300, { fill: '#5a5a62', stroke: INK, strokeWidth: 2 }); return s + rect(o.x - 10, o.y, (o.n || 6) * (o.gap || 40) + 12, 12, { fill: '#5a5a62', stroke: INK, strokeWidth: 2 }); },
    plate: (W, H, o) => g(rect(-60, -10, 120, 24, { fill: '#c9a040', stroke: INK, strokeWidth: 3 }) + path('M-48,2 h96', { stroke: '#7a5a1a', strokeWidth: 3 }), { transform: `translate(${o.x},${o.y}) scale(${o.s || 1})` }),
    shatteredCase: (W, H, o) => rect(o.x, o.y, o.w || 140, o.h || 420, { fill: '#cfe6ff', opacity: 0.14, stroke: '#9aa0b8', strokeWidth: 5 }) + path(`M${o.x + 20},${o.y + 40} l30,60 l-20,40 l40,30 M${o.x + 100},${o.y + 20} l-20,80 l30,40 M${o.x + 60},${o.y + 200} l40,40 l-30,60`, { stroke: '#e8f2ff', strokeWidth: 3, fill: 'none' }) + rect(o.x, o.y + (o.h || 420) - 14, o.w || 140, 14, { fill: '#c9a040', stroke: INK, strokeWidth: 2 }),
  };
  return FX2;
};
