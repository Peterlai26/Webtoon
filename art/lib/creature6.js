// Non-human cast of EP66-70 (the white desert of Kala-Zahr):
// - sandShark: the glass-finned sand sharks that hunt by footstep vibration (ch.67 L77)
// - stoneWorm: Shai-Gorm, the giant stone transport worm (ch.67 L145-147)
// - ironBeetle: the iron-carapace water-seeking beetles (ch.70 L139-141)
// Each returns { svg, head:[x,y], r } in panel coordinates; spec.s scales,
// spec.face 'l' mirrors.
'use strict';
const { INK, path, circle, ellipse, g, f, poly } = require('./util');

const wrap = (spec, o, hx, hy, r) => {
  const s = spec.s || 1, m = spec.face === 'l' ? -1 : 1;
  const svg = g(o.join(''), { transform: `translate(${f(spec.x || 0)},${f(spec.y || 0)}) rotate(${spec.rot || 0}) scale(${f(s * m * 1000) / 1000},${s})`, opacity: spec.opacity });
  return { svg, head: [(spec.x || 0) + m * s * hx, (spec.y || 0) + s * hy], r: r * s };
};

// spec.fins = true draws only the three glass fins cutting through the sand
function sandShark(spec) {
  const o = [];
  const fin = (x, h) => poly([[x - 40, 0], [x + 10, -h], [x + 40, 0]], { fill: '#e8fbff', opacity: 0.75, stroke: '#7ad8f0', strokeWidth: 3 }) + path(`M${x - 10},-4 L${x + 6},${-h * 0.8}`, { stroke: '#ffffff', strokeWidth: 2 });
  if (spec.fins) {
    o.push(fin(0, 120) + path('M-160,6 C-80,-6 -40,8 40,6 M-200,14 C-120,0 -60,16 20,14', { stroke: '#e8dcc4', strokeWidth: 6, fill: 'none', opacity: 0.8 }));
    return wrap(spec, o, 0, -60, 40);
  }
  // leaping body (head toward +x)
  o.push(path('M-220,0 C-160,-70 40,-90 170,-40 C210,-24 230,0 220,14 C160,40 0,40 -140,20 L-250,60 L-230,0 L-260,-60Z', { fill: '#dff4ff', opacity: 0.85, stroke: INK, strokeWidth: 4 }));
  for (let i = 0; i < 6; i++) o.push(poly([[-150 + i * 50, -20], [-130 + i * 50, -40], [-110 + i * 50, -20], [-130 + i * 50, 0]], { fill: '#bfeeff', stroke: '#7ad8f0', strokeWidth: 1.6 }));
  o.push(fin(-20, 110));
  o.push(path('M150,-14 L228,4 L150,22Z', { fill: '#3a2a2e', stroke: INK, strokeWidth: 3 }) + path('M154,-10 l8,10 l8,-10 l8,10 l8,-10 l8,10 l8,-8 M154,18 l8,-8 l8,8 l8,-8 l8,8 l8,-8', { stroke: '#ffffff', strokeWidth: 3, fill: 'none' }));
  o.push(circle(120, -30, 5, { fill: '#7ad8f0', opacity: 0.8 })); // vibration organ, no eye (ch.67 L83)
  return wrap(spec, o, 160, -20, 70);
}

// spec.mouth: 'open' (three stone jaw-rings spread), 'closed'; spec.suck = vacuum streaks
function stoneWorm(spec) {
  const o = [];
  const W = 300; // body diameter in local units (about fifteen metres at the panel scale used)
  // body column rising from the sand, segmented stone plates
  o.push(path(`M${-W / 2},0 C${-W / 2 - 20},-300 ${-W / 2 + 10},-600 ${-W / 2 + 30},-820 L${W / 2 - 30},-820 C${W / 2 - 10},-600 ${W / 2 + 20},-300 ${W / 2},0Z`, { fill: '#c9c4ba', stroke: INK, strokeWidth: 5 }));
  for (let i = 1; i < 9; i++) { const y = -i * 92; o.push(path(`M${-W / 2 + i * 3},${y} Q0,${y + 30} ${W / 2 - i * 3},${y}`, { stroke: '#8a8478', strokeWidth: 6, fill: 'none' })); }
  for (const k of [-1, 1]) for (let i = 0; i < 4; i++) o.push(poly([[k * (W / 2 - 4), -120 - i * 170], [k * (W / 2 + 70), -160 - i * 170], [k * (W / 2 - 4), -200 - i * 170]], { fill: '#a8a296', stroke: INK, strokeWidth: 3 })); // side fins for swimming the sand
  // head: three stone jaw-plate rings, no eyes
  const open = spec.mouth !== 'closed', hy = -840;
  if (open) {
    for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + r * 0.3, rr = 220 - r * 50;
      o.push(poly([[Math.cos(a) * rr * 0.4, hy + Math.sin(a) * rr * 0.16], [Math.cos(a - 0.4) * rr, hy - 60 + Math.sin(a - 0.4) * rr * 0.35], [Math.cos(a + 0.4) * rr, hy - 60 + Math.sin(a + 0.4) * rr * 0.35]], { fill: ['#d8d2c6', '#bdb6aa', '#a8a094'][r], stroke: INK, strokeWidth: 3 }));
    }
    o.push(ellipse(0, hy - 30, 110, 46, { fill: '#1a1012', stroke: INK, strokeWidth: 4 }) + ellipse(0, hy - 30, 60, 22, { fill: '#5a1a22', opacity: 0.8 }));
  } else {
    o.push(path(`M${-W / 2 + 30},-820 C${-W / 2 + 40},${hy - 120} ${W / 2 - 40},${hy - 120} ${W / 2 - 30},-820Z`, { fill: '#d8d2c6', stroke: INK, strokeWidth: 4 }) + path(`M0,${hy - 90} L0,-830 M-60,${hy - 70} L-40,-826 M60,${hy - 70} L40,-826`, { stroke: INK, strokeWidth: 3 }));
  }
  if (spec.suck) for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i - 4.5) * 0.28; o.push(path(`M${f(Math.cos(a) * 520)},${f(hy - 30 + Math.sin(a) * 300 + 300)} L${f(Math.cos(a) * 120)},${f(hy - 10)}`, { stroke: '#f2eadc', strokeWidth: 6, opacity: 0.7, strokeDasharray: '30 16' })); }
  return wrap(spec, o, 0, hy - 60, 160);
}

// spec.drill = drilling pose (head lowered); spec.calm = walking away
function ironBeetle(spec) {
  const o = [];
  // legs
  for (const [x, a] of [[-90, -1], [-20, 0], [60, 1]]) o.push(path(`M${x},-70 L${x - 30 + a * 10},-20 L${x - 50 + a * 14},0 M${x + 10},-70 L${x + 30 + a * 10},-24 L${x + 46 + a * 14},0`, { stroke: '#2a2018', strokeWidth: 9, fill: 'none', strokeLinejoin: 'round' }));
  // carapace: brown-black chitin with iron ore sheen
  o.push(path('M-170,-70 C-170,-190 120,-210 160,-90 C170,-60 150,-50 120,-50 L-150,-50 C-170,-52 -172,-60 -170,-70Z', { fill: '#4a3626', stroke: INK, strokeWidth: 4 }));
  o.push(path('M-10,-196 L-6,-52', { stroke: INK, strokeWidth: 3 }) + path('M-120,-150 C-80,-180 -30,-186 0,-180 M20,-180 C70,-176 110,-150 130,-120', { stroke: '#9a8a7a', strokeWidth: 5, fill: 'none', opacity: 0.7 }));
  for (let i = 0; i < 6; i++) o.push(circle(-120 + i * 46, -100 - (i % 2) * 20, 6, { fill: '#7a6a5a', opacity: 0.8 }));
  // head + drill horn
  const tilt = spec.drill ? 30 : 0;
  o.push(g(ellipse(170, -80, 44, 36, { fill: '#2a2018', stroke: INK, strokeWidth: 4 }) + path('M200,-96 L330,-80 L200,-62Z', { fill: '#8a8a92', stroke: INK, strokeWidth: 4 }) +
    path('M214,-90 L230,-70 M240,-88 L256,-72 M266,-86 L282,-74 M292,-84 L306,-76', { stroke: INK, strokeWidth: 3 }) +
    path('M180,-110 C200,-160 240,-170 260,-168 M170,-112 C176,-170 200,-190 220,-196', { stroke: '#2a2018', strokeWidth: 4, fill: 'none' }) + // antennae sensitive to moisture (ch.70 L141)
    circle(190, -88, 6, { fill: '#e8c070' }), { transform: `rotate(${tilt} 170 -80)` }));
  return wrap(spec, o, 200, -100, 60);
}

module.exports = { sandShark, stoneWorm, ironBeetle };
