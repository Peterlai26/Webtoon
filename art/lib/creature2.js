// Non-human cast of EP11-20: Nox the demon pup (ch.19-20), Cassian's
// elemental snakes (ch.16-18) and Lady Arachne's giant serpent Lord Varan
// (ch.17-18). Each returns { svg, head:[x,y], r } in panel coordinates.
'use strict';
const { INK, path, circle, ellipse, g, f, smooth, P } = require('./util');

const SNAKE = { red: ['#c8281e', '#ff8a4a'], blue: ['#3a7ad8', '#bfe8ff'], green: ['#3a9a4a', '#b8ffb0'], white: ['#ecebe6', '#ffffff'], black: ['#1a1a20', '#c0172a'] };

// Nox: round black pup, two small horns, red-violet eyes, smoke from the tail.
function nox(spec) {
  const s = spec.s || 1, m = spec.face === 'l' ? -1 : 1;
  const o = [];
  const pose = spec.pose || 'sit';
  o.push(path('M-46,-20 q-30,-30 -18,-60 q4,20 18,30', { stroke: '#2a2830', strokeWidth: 10, fill: 'none', strokeLinecap: 'round' }));
  for (let i = 0; i < 4; i++) o.push(circle(-62 + i * 6, -86 - i * 16, 8 + i * 3, { fill: '#3a3640', opacity: 0.4 - i * 0.08 }));
  if (pose === 'run') o.push(path('M-30,0 l-24,20 M30,0 l26,18', { stroke: INK, strokeWidth: 16, strokeLinecap: 'round' }) + path('M-30,0 l-24,20 M30,0 l26,18', { stroke: '#121117', strokeWidth: 11, strokeLinecap: 'round' }));
  else o.push(path('M-24,4 l-4,22 M26,4 l2,22', { stroke: INK, strokeWidth: 16, strokeLinecap: 'round' }) + path('M-24,4 l-4,22 M26,4 l2,22', { stroke: '#121117', strokeWidth: 11, strokeLinecap: 'round' }));
  o.push(ellipse(0, -14, 52, 38, { fill: '#121117', stroke: INK, strokeWidth: 3 }));
  o.push(path('M-20,-38 q14,-8 30,0', { stroke: '#3a3842', strokeWidth: 3, fill: 'none' }));
  // head
  const hx = 40, hy = -52;
  o.push(path(`M${hx - 30},${hy - 26} L${hx - 34},${hy - 54} L${hx - 18},${hy - 32}Z M${hx + 16},${hy - 30} L${hx + 22},${hy - 58} L${hx + 28},${hy - 28}Z`, { fill: '#1e1c24', stroke: INK, strokeWidth: 2.4 }));
  o.push(path(`M${hx - 40},${hy - 16} l-14,-24 l18,10Z M${hx + 34},${hy - 18} l12,-24 l2,22Z`, { fill: '#121117', stroke: INK, strokeWidth: 2.4 }));
  o.push(circle(hx, hy, 36, { fill: '#121117', stroke: INK, strokeWidth: 3 }));
  o.push(ellipse(hx + 20, hy + 14, 18, 13, { fill: '#1e1c24', stroke: INK, strokeWidth: 2 }) + ellipse(hx + 32, hy + 8, 5, 4, { fill: '#3a3842' }));
  const eye = spec.eye || '#e0304a';
  if (spec.expr === 'happy') o.push(path(`M${hx - 16},${hy - 2} q6,-8 12,0 M${hx + 6},${hy - 4} q6,-8 12,0`, { stroke: eye, strokeWidth: 4, fill: 'none', strokeLinecap: 'round' }));
  else o.push(circle(hx - 10, hy - 4, 8, { fill: eye }) + circle(hx + 12, hy - 6, 8, { fill: eye }) + circle(hx - 7, hy - 7, 2.6, { fill: '#fff' }) + circle(hx + 15, hy - 9, 2.6, { fill: '#fff' }) + circle(hx - 10, hy - 4, 14, { fill: eye, opacity: 0.18 }) + circle(hx + 12, hy - 6, 14, { fill: eye, opacity: 0.18 }));
  if (spec.open) o.push(path(`M${hx + 8},${hy + 18} q14,16 30,0Z`, { fill: '#5a1420', stroke: INK, strokeWidth: 2 }) + path(`M${hx + 14},${hy + 18} l2,6 l2,-6 M${hx + 28},${hy + 18} l2,6 l2,-6`, { fill: '#fff' }));
  if (spec.tongue) o.push(path(`M${hx + 22},${hy + 20} q4,14 -2,18 q-6,-4 -2,-18`, { fill: '#e05a7a', stroke: INK, strokeWidth: 1.4 }));
  const svg = g(o.join(''), { transform: `translate(${f(spec.x || 0)},${f(spec.y || 0)}) rotate(${spec.rot || 0}) scale(${f(s * m * 1000) / 1000},${s}) translate(0,-26)` });
  return { svg, head: [(spec.x || 0) + m * s * hx, (spec.y || 0) + s * (hy - 26)], r: 36 * s };
}

// Small elemental snake. kind: red/blue/green/white/black. Coiled S body + hood.
function snake(spec) {
  const [c, glow] = SNAKE[spec.kind || 'red'];
  const s = spec.s || 1, m = spec.face === 'l' ? -1 : 1;
  const o = [];
  const body = 'M-70,40 C-40,60 -10,20 20,40 C40,52 50,30 40,10 C30,-10 34,-40 44,-60';
  o.push(path(body, { stroke: INK, strokeWidth: 24, fill: 'none', strokeLinecap: 'round' }) + path(body, { stroke: c, strokeWidth: 18, fill: 'none', strokeLinecap: 'round' }));
  o.push(path(body, { stroke: glow, strokeWidth: 3, fill: 'none', strokeDasharray: '4 8', opacity: 0.7 }));
  o.push(path('M30,-60 C20,-90 70,-96 70,-66 C76,-50 60,-40 46,-44 C36,-46 30,-52 30,-60Z', { fill: c, stroke: INK, strokeWidth: 3 }));
  o.push(ellipse(60, -72, 4, 3, { fill: '#ffe24a' }) + path('M59,-75 l0,6', { stroke: INK, strokeWidth: 1.6 }));
  if (spec.open) o.push(path('M66,-58 l18,-4 l-4,10 l10,6 l-20,0Z', { fill: '#5a1420', stroke: INK, strokeWidth: 2 }));
  else o.push(path('M70,-60 l14,0 m-2,0 l6,-4 m-6,4 l6,4', { stroke: '#c0172a', strokeWidth: 2 }));
  if (spec.thread) o.push(path('M-70,40 Q-90,-40 -60,-120', { stroke: '#ff2a3a', strokeWidth: 1.6, fill: 'none' }));
  if (spec.cut) o.push(path('M10,20 L30,56', { stroke: '#0b0a10', strokeWidth: 6 }));
  const svg = g(o.join(''), { transform: `translate(${f(spec.x || 0)},${f(spec.y || 0)}) rotate(${spec.rot || 0}) scale(${f(s * m * 1000) / 1000},${s})` });
  return { svg, head: [(spec.x || 0) + m * s * 54, (spec.y || 0) - s * 70], r: 26 * s };
}

// Lord Varan: 25m serpent, black scales laced with blood-red silk lines,
// four stacked red eyes, a red silk collar woven by Arachne.
function varan(spec) {
  const s = spec.s || 1, m = spec.face === 'l' ? -1 : 1;
  const o = [];
  const pts = spec.body || [[-420, 340], [-260, 380], [-80, 300], [-40, 140], [-120, 0], [-40, -140], [40, -200]];
  const d = smooth(pts, false);
  o.push(path(d, { stroke: INK, strokeWidth: 176, fill: 'none', strokeLinecap: 'round' }) + path(d, { stroke: '#16151b', strokeWidth: 168, fill: 'none', strokeLinecap: 'round' }));
  o.push(path(d, { stroke: '#2a2830', strokeWidth: 120, fill: 'none', strokeDasharray: '30 22', strokeLinecap: 'butt', opacity: 0.8 }));
  o.push(path(d, { stroke: '#8a0e1e', strokeWidth: 4, fill: 'none', strokeDasharray: '60 30', opacity: 0.9 }));
  o.push(path(d, { stroke: '#8a0e1e', strokeWidth: 3, fill: 'none', transform: 'translate(0,40)', strokeDasharray: '20 40', opacity: 0.7 }));
  if (spec.wound) o.push(path(d, { stroke: '#b3101f', strokeWidth: 16, fill: 'none', strokeDasharray: '0 120 260 2000', strokeLinecap: 'round' }));
  // head at the last point
  const [hx, hy] = pts[pts.length - 1];
  const hg = [];
  hg.push(path('M-80,40 C-110,-40 -40,-110 40,-104 C120,-100 170,-50 200,10 C170,40 120,60 60,70 C0,76 -60,70 -80,40Z', { fill: '#1a191f', stroke: INK, strokeWidth: 4 }));
  hg.push(path('M-40,-60 l30,-30 M0,-80 l26,-24 M50,-80 l20,-20', { stroke: '#8a0e1e', strokeWidth: 3 }));
  for (let i = 0; i < 4; i++) hg.push(ellipse(40 + (i % 2) * 40, -54 + Math.floor(i / 2) * 26 - (i % 2) * 6, 16, 9, { fill: '#e0102a', stroke: INK, strokeWidth: 2 }) + path(`M${40 + (i % 2) * 40},${-61 + Math.floor(i / 2) * 26 - (i % 2) * 6} l0,14`, { stroke: '#0b0a10', strokeWidth: 3 }));
  if (spec.open) {
    hg.push(path('M20,30 C80,50 160,40 210,10 C200,110 120,170 30,140 C0,110 10,60 20,30Z', { fill: '#3a0810', stroke: INK, strokeWidth: 4 }));
    hg.push(path('M60,40 l8,30 l8,-30 M150,30 l8,30 l8,-30 M70,130 l8,-26 l8,26', { fill: '#efe9d6', stroke: INK, strokeWidth: 1.6 }));
    if (spec.charge) for (const [c, r] of [['#ff6a2a', 46], ['#5ad8ff', 36], ['#7aff7a', 26], ['#b14bff', 16]]) hg.push(circle(110, 86, r, { fill: c, opacity: 0.55 }));
  }
  if (spec.plug) hg.push(path('M60,60 L230,120 L220,150 L50,90Z', { fill: '#ecebe6', stroke: INK, strokeWidth: 3 }));
  // the red silk collar
  hg.push(path('M-90,30 C-70,90 10,110 70,90', { stroke: '#c0172a', strokeWidth: 26, fill: 'none' }) + path('M-90,30 C-70,90 10,110 70,90', { stroke: '#ff5a6a', strokeWidth: 3, fill: 'none', strokeDasharray: '6 6' }));
  o.push(g(hg.join(''), { transform: `translate(${hx},${hy}) rotate(${spec.headRot || 0})` }));
  const svg = g(o.join(''), { transform: `translate(${f(spec.x || 0)},${f(spec.y || 0)}) rotate(${spec.rot || 0}) scale(${f(s * m * 1000) / 1000},${s})` });
  return { svg, head: [(spec.x || 0) + m * s * (hx + 60), (spec.y || 0) + s * (hy - 40)], r: 110 * s };
}

module.exports = { nox, snake, varan };
