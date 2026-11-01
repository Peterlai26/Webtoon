// Non-human cast of EP31-45: Sir Draken's armoured white dragon (ch.38 L82),
// the light-armour hunting hounds of the Solar Mist Forest (ch.42 L72) and the
// four-legged light war-mechs of the root-shaft blockade (ch.43 L22).
// Each returns { svg, head:[x,y], r } in panel coordinates.
'use strict';
const { INK, path, circle, ellipse, g, f, poly } = require('./util');

const PEARL = '#f4f2ee', PEARL2 = '#dcd8d0', GOLD = '#e2b84a', SILVER = '#b9bcc6';

// spec: wings ('open' | 'fold'), glow (blue-gold resonance with Draken), roar
function whiteDragon(spec) {
  const s = spec.s || 1, m = spec.face === 'l' ? -1 : 1;
  const o = [];
  const wing = (dx, flip, open) => {
    const k = flip ? -1 : 1;
    const d = open
      ? `M${dx},-300 C${dx - 120 * k},-560 ${dx - 380 * k},-640 ${dx - 560 * k},-600 L${dx - 470 * k},-520 L${dx - 520 * k},-450 L${dx - 420 * k},-400 L${dx - 440 * k},-320 L${dx - 300 * k},-300Z`
      : `M${dx},-300 C${dx - 60 * k},-440 ${dx - 160 * k},-480 ${dx - 240 * k},-440 L${dx - 200 * k},-360 L${dx - 120 * k},-300Z`;
    return path(d, { fill: '#e8e6e2', stroke: INK, strokeWidth: 4, strokeLinejoin: 'round' }) +
      path(open ? `M${dx},-300 L${dx - 470 * k},-520 M${dx},-300 L${dx - 420 * k},-400 M${dx},-300 L${dx - 300 * k},-300` : `M${dx},-300 L${dx - 200 * k},-360`, { stroke: SILVER, strokeWidth: 5 }) +
      path(open ? `M${dx - 40 * k},-360 C${dx - 160 * k},-520 ${dx - 340 * k},-580 ${dx - 520 * k},-580` : '', { stroke: GOLD, strokeWidth: 6, fill: 'none' });
  };
  const open = spec.wings !== 'fold';
  o.push(wing(-40, false, open));
  // tail
  o.push(path('M-200,-200 C-380,-180 -480,-120 -560,-40 C-500,-80 -400,-120 -220,-150Z', { fill: PEARL, stroke: INK, strokeWidth: 4 }) + path('M-560,-40 l-30,-10 l20,30Z', { fill: GOLD, stroke: INK, strokeWidth: 2 }));
  // hind leg, body, front leg
  o.push(path('M-170,-200 C-200,-120 -190,-60 -160,0 L-90,0 C-110,-60 -90,-120 -60,-180Z', { fill: PEARL2, stroke: INK, strokeWidth: 4 }));
  o.push(path('M-240,-210 C-220,-320 -60,-360 80,-330 C200,-310 240,-240 200,-170 C120,-130 -120,-130 -240,-210Z', { fill: PEARL, stroke: INK, strokeWidth: 4 }));
  // armour plates (silver + gold light-mech armour) on back and chest
  o.push(path('M-180,-300 C-100,-350 40,-360 120,-330 L100,-300 C20,-320 -100,-310 -170,-270Z', { fill: SILVER, stroke: INK, strokeWidth: 3 }) + path('M-120,-318 L-110,-290 M-40,-330 L-36,-300 M40,-330 L40,-302', { stroke: GOLD, strokeWidth: 5 }));
  o.push(path('M140,-300 C200,-280 220,-220 190,-180 L150,-200 C170,-230 160,-270 130,-280Z', { fill: GOLD, stroke: INK, strokeWidth: 3 }));
  // belly scales
  for (let i = 0; i < 6; i++) o.push(path(`M${-160 + i * 50},-160 q25,16 50,0`, { stroke: PEARL2, strokeWidth: 4, fill: 'none' }));
  o.push(path('M120,-200 C140,-120 130,-60 150,0 L220,0 C200,-60 210,-140 190,-210Z', { fill: PEARL2, stroke: INK, strokeWidth: 4 }) + path('M150,0 l12,-16 l10,16 l12,-16 l10,16 l12,-16 l10,16', { fill: '#f6f2e4', stroke: INK, strokeWidth: 2 }));
  // neck + head
  o.push(path('M150,-300 C200,-380 240,-460 300,-500 L360,-470 C320,-430 270,-360 230,-260Z', { fill: PEARL, stroke: INK, strokeWidth: 4 }));
  for (let i = 0; i < 4; i++) o.push(poly([[190 + i * 30, -350 - i * 40], [205 + i * 30, -400 - i * 40], [220 + i * 30, -350 - i * 40]], { fill: SILVER, stroke: INK, strokeWidth: 2 }));
  const hx = 360, hy = -500;
  o.push(path(`M${hx - 70},${hy + 10} C${hx - 60},${hy - 50} ${hx + 40},${hy - 60} ${hx + 110},${hy - 10} L${hx + 120},${hy + 26} C${hx + 60},${hy + 40} ${hx - 20},${hy + 50} ${hx - 70},${hy + 10}Z`, { fill: PEARL, stroke: INK, strokeWidth: 4 }));
  if (spec.roar) o.push(path(`M${hx + 10},${hy + 30} L${hx + 130},${hy + 30} L${hx + 110},${hy + 80} C${hx + 60},${hy + 80} ${hx + 20},${hy + 60} ${hx + 10},${hy + 30}Z`, { fill: '#5a1420', stroke: INK, strokeWidth: 3 }) + path(`M${hx + 30},${hy + 30} l6,12 l6,-12 M${hx + 70},${hy + 30} l6,12 l6,-12`, { fill: '#fff' }));
  // horns + face plate
  o.push(path(`M${hx - 40},${hy - 30} C${hx - 80},${hy - 90} ${hx - 120},${hy - 110} ${hx - 160},${hy - 110} C${hx - 110},${hy - 80} ${hx - 80},${hy - 50} ${hx - 60},${hy - 10}Z`, { fill: '#eae4d4', stroke: INK, strokeWidth: 3 }) + path(`M${hx},${hy - 40} C${hx - 20},${hy - 100} ${hx - 50},${hy - 130} ${hx - 80},${hy - 140} C${hx - 40},${hy - 100} ${hx - 30},${hy - 70} ${hx - 20},${hy - 30}Z`, { fill: '#eae4d4', stroke: INK, strokeWidth: 3 }));
  o.push(path(`M${hx - 30},${hy - 34} L${hx + 70},${hy - 24} L${hx + 50},${hy - 4} L${hx - 20},${hy - 12}Z`, { fill: SILVER, stroke: INK, strokeWidth: 2.4 }));
  // blue-gold eye
  o.push(ellipse(hx + 30, hy - 6, 14, 9, { fill: '#7ad8ff', stroke: INK, strokeWidth: 2 }) + ellipse(hx + 32, hy - 6, 4, 8, { fill: '#c99a20' }) + circle(hx + 30, hy - 6, 24, { fill: '#7ad8ff', opacity: 0.3 }));
  o.push(ellipse(hx + 104, hy + 6, 5, 3, { fill: INK }));
  if (open) o.push(wing(-10, true, true));
  else o.push(wing(-10, true, false));
  if (spec.glow) o.push(ellipse(0, -300, 620, 380, { fill: '#7ad8ff', opacity: 0.12 }) + ellipse(0, -300, 520, 300, { fill: '#ffd45a', opacity: 0.08 }));
  const svg = g(o.join(''), { transform: `translate(${f(spec.x || 0)},${f(spec.y || 0)}) scale(${f(s * m * 1000) / 1000},${s})` });
  return { svg, head: [(spec.x || 0) + m * s * (hx + 30), (spec.y || 0) + s * (hy - 10)], r: 90 * s };
}

// light-armour hunting hound: half beast, half white armour, laser claws, red eyes (ch.42 L72)
function lightHound(spec) {
  const s = spec.s || 1, m = spec.face === 'l' ? -1 : 1;
  const o = [];
  const run = spec.pose === 'run', dead = spec.dead;
  const legs = run ? 'M-60,-60 l-50,60 M-30,-60 l-10,62 M50,-60 l40,60 M70,-60 l60,40' : 'M-60,-60 l-6,60 M-34,-60 l4,60 M48,-60 l-2,60 M74,-60 l6,60';
  o.push(path(legs, { stroke: INK, strokeWidth: 22, strokeLinecap: 'round' }) + path(legs, { stroke: '#4a4044', strokeWidth: 16, strokeLinecap: 'round' }));
  o.push(path('M-90,-70 C-90,-130 80,-140 110,-90 C120,-60 90,-40 60,-40 L-70,-40 C-90,-40 -96,-56 -90,-70Z', { fill: '#5a5056', stroke: INK, strokeWidth: 3 }));
  o.push(path('M-70,-110 C-30,-140 60,-140 100,-100 L80,-90 C50,-118 -20,-120 -60,-96Z', { fill: '#eef1f6', stroke: INK, strokeWidth: 3 }) + path('M-30,-122 l0,20 M20,-126 l0,22 M60,-116 l-4,20', { stroke: '#8a93a3', strokeWidth: 3 }));
  o.push(path('M-90,-80 C-120,-90 -140,-120 -150,-140', { stroke: '#4a4044', strokeWidth: 10, fill: 'none', strokeLinecap: 'round' }));
  // head
  o.push(path('M90,-100 C110,-150 180,-150 200,-110 L230,-96 L200,-76 C170,-60 120,-64 96,-76Z', { fill: '#eef1f6', stroke: INK, strokeWidth: 3 }) + path('M110,-140 l-10,-30 l26,18Z M150,-146 l6,-30 l14,26Z', { fill: '#5a5056', stroke: INK, strokeWidth: 2 }));
  if (!dead) o.push(ellipse(160, -112, 10, 6, { fill: '#ff2a2a' }) + circle(160, -112, 18, { fill: '#ff2a2a', opacity: 0.35 }));
  else o.push(path('M152,-118 l14,10 M166,-118 l-14,10', { stroke: INK, strokeWidth: 3 }));
  if (spec.open) o.push(path('M196,-86 l30,-4 l-20,20Z', { fill: '#5a1420', stroke: INK, strokeWidth: 2 }));
  // laser claws
  if (!dead) o.push(path(run ? 'M-110,0 l-14,8 M-110,0 l-6,12 M130,-20 l16,4 M130,-20 l12,10' : 'M-66,0 l-14,6 M80,0 l16,6', { stroke: '#ff5a3a', strokeWidth: 4 }));
  const svg = g(o.join(''), { transform: `translate(${f(spec.x || 0)},${f(spec.y || 0)}) rotate(${dead ? 180 * 0 + 8 : 0}) scale(${f(s * m * 1000) / 1000},${s})` });
  return { svg, head: [(spec.x || 0) + m * s * 160, (spec.y || 0) + s * -110], r: 40 * s };
}

// four-legged light war-mech (ch.43 L22)
function quadMech(spec) {
  const s = spec.s || 1, m = spec.face === 'l' ? -1 : 1;
  const o = [];
  const legs = [[-120, -1], [-50, -1], [50, 1], [120, 1]];
  for (const [x, d] of legs) o.push(path(`M${x * 0.6},-160 L${x + d * 30},-210 L${x + d * 50},0`, { stroke: INK, strokeWidth: 24, fill: 'none', strokeLinejoin: 'round' }) + path(`M${x * 0.6},-160 L${x + d * 30},-210 L${x + d * 50},0`, { stroke: '#d6dbe4', strokeWidth: 16, fill: 'none', strokeLinejoin: 'round' }) + circle(x + d * 30, -210, 12, { fill: GOLD, stroke: INK, strokeWidth: 2 }));
  o.push(path('M-130,-200 L130,-200 L110,-130 L-110,-130Z', { fill: '#eef1f6', stroke: INK, strokeWidth: 4 }) + path('M-100,-180 L100,-180', { stroke: GOLD, strokeWidth: 4 }));
  o.push(path('M-50,-200 L-40,-250 L40,-250 L50,-200Z', { fill: '#d6dbe4', stroke: INK, strokeWidth: 3 }));
  if (spec.broken) o.push(ellipse(10, -226, 30, 12, { fill: '#2a1a16' }) + path('M-10,-240 l-20,-20 M30,-236 l14,-24', { stroke: '#ff6a1a', strokeWidth: 5 }) + circle(10, -226, 50, { fill: '#ff6a1a', opacity: 0.35 }));
  else o.push(ellipse(10, -226, 26, 10, { fill: '#7affe0', stroke: INK, strokeWidth: 2 }) + circle(10, -226, 36, { fill: '#7affe0', opacity: 0.3 }));
  o.push(path('M60,-240 L140,-250 L140,-236 L60,-228Z', { fill: '#9aa3b3', stroke: INK, strokeWidth: 3 }));
  const svg = g(o.join(''), { transform: `translate(${f(spec.x || 0)},${f(spec.y || 0)}) rotate(${spec.rot || 0}) scale(${f(s * m * 1000) / 1000},${s})` });
  return { svg, head: [(spec.x || 0) + m * s * 10, (spec.y || 0) + s * -226], r: 50 * s };
}

module.exports = { whiteDragon, lightHound, quadMech };
