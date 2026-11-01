// Non-human cast of EP46-65: Sir Draken's final form, the "Ultimate Dragon
// Fusion" — a twelve-metre six-winged solar dragon-god fused from Draken and
// his white dragon (ch.63 L50-56). Returns { svg, head:[x,y], r } in panel
// coordinates; spec.s scales, spec.face 'l' mirrors, spec.burning = being
// consumed by the mirror-prism fire (ch.65 L113).
'use strict';
const { INK, path, circle, ellipse, g, f, poly } = require('./util');

const PEARL = '#fbfaf6', PEARL2 = '#e4e0d6', GOLD = '#e2b84a';

function sunDragon(spec) {
  const s = spec.s || 1, m = spec.face === 'l' ? -1 : 1;
  const o = [];
  // six plasma wings
  for (const [ang, len] of [[-150, 420], [-125, 470], [-100, 400]]) for (const k of [-1, 1]) {
    const a = (k < 0 ? ang : -180 - ang) * Math.PI / 180, tx = Math.cos(a) * len, ty = -360 + Math.sin(a) * len * 0.8;
    const d = `M${k * 30},-360 C${k * 120},-${400 + len * 0.3} ${tx * 0.8},${ty - 60} ${tx},${ty} C${tx * 0.7},${ty + 50} ${k * 120},-300 ${k * 30},-320Z`;
    o.push(path(d, { fill: '#fff2b0', opacity: 0.55, stroke: '#ffd45a', strokeWidth: 5 }) + path(`M${k * 30},-350 L${tx * 0.9},${ty}`, { stroke: '#ffffff', strokeWidth: 4, opacity: 0.8 }));
  }
  o.push(circle(0, -330, 320, { fill: '#fff7d0', opacity: 0.18 }));
  // tail + legs
  o.push(path('M-60,-120 C-200,-80 -260,-10 -330,20 C-250,0 -180,-40 -40,-80Z', { fill: PEARL2, stroke: INK, strokeWidth: 4 }));
  o.push(path('M-80,-140 L-110,0 L-40,0 L-20,-120Z M80,-140 L110,0 L40,0 L20,-120Z', { fill: PEARL2, stroke: INK, strokeWidth: 4 }));
  o.push(path('M-110,0 l-14,-14 M-96,0 l-6,-18 M110,0 l14,-14 M96,0 l6,-18', { stroke: GOLD, strokeWidth: 4 }));
  // torso: diamond scales
  o.push(path('M-110,-460 C-130,-340 -110,-200 -80,-130 L80,-130 C110,-200 130,-340 110,-460 C60,-500 -60,-500 -110,-460Z', { fill: PEARL, stroke: INK, strokeWidth: 4 }));
  for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) o.push(poly([[-80 + c * 44 + (r % 2) * 22, -440 + r * 50], [-58 + c * 44 + (r % 2) * 22, -420 + r * 50], [-80 + c * 44 + (r % 2) * 22, -400 + r * 50], [-102 + c * 44 + (r % 2) * 22, -420 + r * 50]], { fill: '#f2f6ff', stroke: '#c9ced8', strokeWidth: 1.6 }));
  // solar core in the chest
  o.push(circle(0, -360, 70, { fill: '#ffd45a', opacity: 0.5 }) + circle(0, -360, 40, { fill: '#fff7d0', stroke: '#ff8a2a', strokeWidth: 5 }) + circle(0, -360, 16, { fill: '#ffffff' }));
  // arms: left claw, right arm fused into the dragon-bone lance-blade
  o.push(path('M-110,-440 C-170,-400 -200,-330 -190,-270 L-160,-270 C-160,-330 -130,-380 -90,-400Z', { fill: PEARL2, stroke: INK, strokeWidth: 4 }) + path('M-190,-270 l-14,24 M-178,-268 l-4,28 M-166,-270 l8,24', { stroke: INK, strokeWidth: 4 }));
  o.push(path('M110,-440 C170,-420 210,-380 230,-340 L200,-320 C180,-350 150,-380 100,-400Z', { fill: PEARL2, stroke: INK, strokeWidth: 4 }));
  o.push(path('M210,-340 L520,-620 L540,-600 L236,-316Z', { fill: '#f6f4ee', stroke: INK, strokeWidth: 4 }) + path('M220,-334 L528,-612', { stroke: '#ffd45a', strokeWidth: 6 }) + path('M520,-620 l40,-40 l-6,52Z', { fill: GOLD, stroke: INK, strokeWidth: 3 }));
  // dragon head with horns and Draken's gold eyes
  const hx = 0, hy = -540;
  o.push(path(`M${hx - 70},${hy + 40} C${hx - 80},${hy - 40} ${hx + 80},${hy - 40} ${hx + 70},${hy + 40} L${hx + 40},${hy + 80} L${hx - 40},${hy + 80}Z`, { fill: PEARL, stroke: INK, strokeWidth: 4 }));
  o.push(path(`M${hx - 50},${hy - 10} C${hx - 90},${hy - 90} ${hx - 120},${hy - 110} ${hx - 150},${hy - 120} C${hx - 110},${hy - 80} ${hx - 80},${hy - 40} ${hx - 40},${hy}Z M${hx + 50},${hy - 10} C${hx + 90},${hy - 90} ${hx + 120},${hy - 110} ${hx + 150},${hy - 120} C${hx + 110},${hy - 80} ${hx + 80},${hy - 40} ${hx + 40},${hy}Z`, { fill: GOLD, stroke: INK, strokeWidth: 3 }));
  o.push(path(`M${hx - 40},${hy + 20} l24,-8 l4,10Z M${hx + 40},${hy + 20} l-24,-8 l-4,10Z`, { fill: '#ffd45a', stroke: INK, strokeWidth: 2 }) + path(`M${hx - 24},${hy + 64} l8,10 l8,-10 l8,10 l8,-10 l8,10`, { stroke: INK, strokeWidth: 3, fill: 'none' }));
  if (spec.burning) o.push(circle(0, -330, 360, { fill: '#ffffff', opacity: 0.35 }) + path('M-120,-200 q20,-60 -10,-120 M100,-260 q-20,-60 10,-110 M-40,-480 q20,-40 0,-80', { stroke: '#ffffff', strokeWidth: 14, fill: 'none', opacity: 0.8 }));
  const svg = g(o.join(''), { transform: `translate(${f(spec.x || 0)},${f(spec.y || 0)}) scale(${f(s * m * 1000) / 1000},${s})`, opacity: spec.opacity });
  return { svg, head: [(spec.x || 0) + m * s * hx, (spec.y || 0) + s * (hy + 10)], r: 90 * s };
}

module.exports = { sunDragon };
