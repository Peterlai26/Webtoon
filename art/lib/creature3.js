// Non-human cast of EP23-25 (the ancient mine under the haunted village):
// the Ancient Rock-Armour King (ch.24), mid-size rock-armour beasts, ore
// beetles (ch.23) and acid centipedes (ch.24). The pale ceiling crawlers of
// ch.23 use the four-limbed `creature` rig with a skin override.
// Each returns { svg, head:[x,y], r } in panel coordinates.
'use strict';
const { INK, path, circle, ellipse, g, f, poly } = require('./util');

const ORE = '#16151b', ORE2 = '#2a2830', MAG = '#ff6a1a';

// spec: open (mouth breathing magma), crack (star crack on the chest plate),
// chestOpen (plate broken, flesh + core exposed), tailCut, dead, minor (mid-size beast)
function rockKing(spec) {
  const s = spec.s || 1, m = spec.face === 'l' ? -1 : 1, minor = !!spec.minor;
  const col = minor ? '#4a4650' : ORE, col2 = minor ? '#5e5a64' : ORE2;
  const o = [];
  const leg = (x, w, dark) => path(`M${x - w / 2},-170 L${x - w / 2 - 10},0 L${x + w / 2 + 10},0 L${x + w / 2},-170Z`, { fill: dark ? '#0e0d12' : col2, stroke: INK, strokeWidth: 4 }) + path(`M${x - w / 2 - 14},0 l12,-24 l10,24 l12,-24 l10,24 l12,-24 l10,24`, { fill: '#d8d0bc', stroke: INK, strokeWidth: 2 });
  // tail (behind), molten mace at the tip
  if (!minor) {
    const tail = spec.tailCut ? 'M-260,-240 C-360,-260 -400,-300 -380,-340' : 'M-260,-240 C-420,-260 -480,-420 -380,-560 C-320,-640 -220,-640 -180,-600';
    o.push(path(tail, { stroke: INK, strokeWidth: 60, fill: 'none', strokeLinecap: 'round' }) + path(tail, { stroke: col2, strokeWidth: 52, fill: 'none', strokeLinecap: 'round' }));
    o.push(path(tail, { stroke: '#0b0a10', strokeWidth: 20, fill: 'none', strokeDasharray: '6 30' }));
    if (spec.tailCut) o.push(ellipse(-380, -344, 28, 20, { fill: '#c0172a', stroke: INK, strokeWidth: 3 }));
    else o.push(circle(-170, -590, 78, { fill: '#3a1a10', stroke: INK, strokeWidth: 4 }) + circle(-170, -590, 120, { fill: MAG, opacity: 0.25 }) + path('M-220,-620 l30,20 l-10,30 l40,10 M-150,-650 l10,40 l30,-10 M-130,-560 l-30,10', { stroke: '#ffb04a', strokeWidth: 6, fill: 'none' }) + path('M-240,-600 l-36,-14 M-150,-670 l6,-40 M-96,-590 l40,0 M-180,-510 l-6,40', { stroke: INK, strokeWidth: 14, strokeLinecap: 'round' }));
  }
  o.push(leg(-200, 90, true) + leg(160, 90, true));
  // carapace
  o.push(path('M-320,-180 C-340,-420 -120,-540 60,-520 C240,-500 340,-380 330,-200 C200,-150 -200,-150 -320,-180Z', { fill: col, stroke: INK, strokeWidth: 5 }));
  for (const [x, y] of [[-200, -420], [-60, -480], [80, -470], [200, -400], [-260, -300], [260, -300]]) o.push(poly([[x - 30, y + 20], [x, y - 50], [x + 30, y + 20]], { fill: col2, stroke: INK, strokeWidth: 3 }));
  if (!minor) o.push(path('M-260,-260 l60,-40 l40,30 l70,-60 M40,-300 l60,-50 l40,40 l70,-30 M-120,-420 l40,30 l60,-20', { stroke: MAG, strokeWidth: 5, fill: 'none', opacity: 0.85 }));
  o.push(leg(-140, 110, false) + leg(220, 110, false));
  // neck + head (front, +x)
  const hx = 360, hy = -300;
  o.push(path(`M200,-280 C260,-320 300,-330 ${hx - 20},${hy - 30} L${hx},${hy + 60} C300,-200 240,-190 200,-200Z`, { fill: col2, stroke: INK, strokeWidth: 4 }));
  // chest plate under the throat
  const cp = [[230, -250], [330, -260], [290, -150]];
  if (!spec.chestOpen) {
    o.push(poly(cp, { fill: minor ? '#3a3640' : '#0b0a10', stroke: INK, strokeWidth: 4 }) + path('M250,-240 L300,-245', { stroke: '#5a5866', strokeWidth: 3 }));
    if (spec.crack) o.push(path('M290,-220 l-24,-14 M290,-220 l26,-10 M290,-220 l-6,28 M290,-220 l18,22 M290,-220 l-22,14', { stroke: '#ffb04a', strokeWidth: 4 }) + circle(290, -220, 10, { fill: '#ffb04a', opacity: 0.6 }));
  } else {
    o.push(poly(cp, { fill: '#7a1420', stroke: INK, strokeWidth: 4 }) + path('M236,-248 l18,30 l-14,10 M326,-256 l-12,26', { stroke: '#0b0a10', strokeWidth: 8 }));
    o.push(circle(282, -220, 26, { fill: '#c9a0ff', stroke: '#e2b84a', strokeWidth: 4 }) + circle(282, -220, 44, { fill: '#c58aff', opacity: 0.35 }));
  }
  const hd = [];
  hd.push(path('M-60,-40 C-40,-90 60,-100 120,-70 C170,-46 190,-10 180,20 C120,40 40,50 -40,40 C-70,20 -70,-10 -60,-40Z', { fill: col, stroke: INK, strokeWidth: 4 }));
  hd.push(path('M-40,-70 l-20,-50 l40,30 M10,-90 l0,-56 l30,46', { fill: col2, stroke: INK, strokeWidth: 3 }));
  const eyeC = spec.dead ? '#3a3a42' : '#ffb800';
  hd.push(ellipse(40, -40, 30, 18, { fill: eyeC, stroke: INK, strokeWidth: 3 }) + (spec.dead ? '' : ellipse(46, -40, 6, 14, { fill: '#2a1a00' }) + ellipse(40, -40, 50, 32, { fill: '#ffb800', opacity: 0.2 })));
  if (spec.open) {
    hd.push(path('M60,20 C110,30 170,20 200,10 C190,90 120,120 40,90 C30,60 40,40 60,20Z', { fill: '#3a0a06', stroke: INK, strokeWidth: 4 }) + path('M80,24 l8,22 l8,-22 M140,20 l8,22 l8,-22 M90,90 l8,-20 l8,20', { fill: '#efe9d6', stroke: INK, strokeWidth: 1.6 }));
    hd.push(circle(150, 60, 40, { fill: MAG, opacity: 0.7 }) + circle(150, 60, 70, { fill: '#ffb04a', opacity: 0.25 }));
  } else hd.push(path('M60,24 C110,34 160,26 186,14', { stroke: INK, strokeWidth: 4, fill: 'none' }));
  o.push(g(hd.join(''), { transform: `translate(${hx},${hy}) rotate(${spec.headRot || 0})` }));
  if (spec.dead) o.push(path('M-320,-180 C-340,-420 -120,-540 60,-520 C240,-500 340,-380 330,-200 C200,-150 -200,-150 -320,-180Z', { fill: '#000', opacity: 0.25 }));
  const svg = g(o.join(''), { transform: `translate(${f(spec.x || 0)},${f(spec.y || 0)}) rotate(${spec.rot || 0}) scale(${f(s * m * 1000) / 1000},${s})` });
  return { svg, head: [(spec.x || 0) + m * s * (hx + 40), (spec.y || 0) + s * (hy - 60)], r: 90 * s };
}

// Dog-sized beetle with a carapace of iron ore and rock (ch.23 L74). spec.open: shell cracked, green core visible
function oreBeetle(spec) {
  const s = spec.s || 1, m = spec.face === 'l' ? -1 : 1;
  const o = [];
  for (let i = 0; i < 3; i++) { const x = -40 + i * 40; o.push(path(`M${x},-30 l-24,30 l-10,0 M${x + 10},-30 l20,30 l10,0`, { stroke: INK, strokeWidth: 8, fill: 'none', strokeLinecap: 'round' }) + path(`M${x},-30 l-24,30 M${x + 10},-30 l20,30`, { stroke: '#3a3640', strokeWidth: 4, fill: 'none' })); }
  o.push(ellipse(0, -50, 90, 46, { fill: '#3a3640', stroke: INK, strokeWidth: 4 }));
  o.push(path('M-80,-60 C-60,-110 50,-110 80,-60 C40,-74 -40,-74 -80,-60Z', { fill: '#5a5866', stroke: INK, strokeWidth: 3 }));
  for (const [x, y, c] of [[-40, -92, '#8a8f98'], [0, -100, '#3a7a9a'], [36, -90, '#8a8f98'], [-16, -76, '#6a9a5a']]) o.push(poly([[x - 12, y + 10], [x, y - 18], [x + 12, y + 10]], { fill: c, stroke: INK, strokeWidth: 2 }));
  if (spec.open) o.push(path('M-20,-96 l10,20 l-8,12 l14,10', { stroke: '#0b0a10', strokeWidth: 6, fill: 'none' }) + circle(4, -70, 16, { fill: '#7aff7a', opacity: 0.8 }));
  o.push(ellipse(96, -46, 34, 26, { fill: '#2a2830', stroke: INK, strokeWidth: 3 }));
  o.push(path('M120,-60 l40,-36 l-14,40Z', { fill: '#8a8f98', stroke: INK, strokeWidth: 2.4 }));
  o.push(path('M118,-30 c24,-4 34,10 30,24 c-8,-10 -20,-12 -30,-10 M118,-40 c28,-20 48,-6 46,14 c-10,-12 -26,-14 -40,-6', { fill: '#5a5866', stroke: INK, strokeWidth: 2.4 }));
  o.push(circle(104, -56, 5, { fill: '#e0ff6a' }));
  const svg = g(o.join(''), { transform: `translate(${f(spec.x || 0)},${f(spec.y || 0)}) rotate(${spec.rot || 0}) scale(${f(s * m * 1000) / 1000},${s})` });
  return { svg, head: [(spec.x || 0) + m * s * 100, (spec.y || 0) - s * 60], r: 30 * s };
}

// Giant acid-spitting centipede (ch.24 L10, L52)
function centipede(spec) {
  const s = spec.s || 1, m = spec.face === 'l' ? -1 : 1;
  const o = [];
  const pts = [[-200, 0], [-150, -30], [-100, -10], [-50, -40], [0, -30], [40, -70], [70, -120]];
  pts.forEach(([x, y], i) => {
    if (i < pts.length - 1) o.push(path(`M${x},${y} l-14,30 M${x},${y} l14,30`, { stroke: '#5a3a2a', strokeWidth: 5, strokeLinecap: 'round' }));
    o.push(ellipse(x, y, 30, 22, { fill: i % 2 ? '#6a4a2a' : '#7a5a30', stroke: INK, strokeWidth: 3 }));
  });
  const [hx, hy] = pts[pts.length - 1];
  o.push(circle(hx + 10, hy - 10, 26, { fill: '#5a3a20', stroke: INK, strokeWidth: 3 }) + path(`M${hx + 26},${hy - 4} q20,4 22,24 M${hx + 20},${hy + 8} q10,10 4,26`, { stroke: INK, strokeWidth: 4, fill: 'none' }));
  o.push(circle(hx + 16, hy - 18, 4, { fill: '#c0ff4a' }) + path(`M${hx},${hy - 34} q-10,-30 -30,-40 M${hx + 18},${hy - 34} q4,-30 24,-44`, { stroke: '#5a3a20', strokeWidth: 3, fill: 'none' }));
  if (spec.spit) o.push(path(`M${hx + 40},${hy + 10} Q${hx + 200},${hy - 20} ${hx + 360},${hy + 140}`, { stroke: '#7aff3a', strokeWidth: 18, fill: 'none', opacity: 0.55, strokeLinecap: 'round' }) + path(`M${hx + 40},${hy + 10} Q${hx + 200},${hy - 20} ${hx + 360},${hy + 140}`, { stroke: '#d8ff9a', strokeWidth: 5, fill: 'none', strokeDasharray: '14 10' }));
  const svg = g(o.join(''), { transform: `translate(${f(spec.x || 0)},${f(spec.y || 0)}) rotate(${spec.rot || 0}) scale(${f(s * m * 1000) / 1000},${s})` });
  return { svg, head: [(spec.x || 0) + m * s * (hx + 10), (spec.y || 0) + s * (hy - 10)], r: 26 * s };
}

module.exports = { rockKing, oreBeetle, centipede };
