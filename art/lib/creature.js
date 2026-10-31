// The blind four-limbed undead from Ep.5 (source ch.5): stretched grey-blue
// body, rag strips, long clawed limbs, milky eyes, jaw split to the ears.
'use strict';
const { INK, P, path, circle, ellipse, g, f, pt } = require('./util');
const { computeRig } = require('./rig');

const POSE = {
  ceiling: { torso: -180, head: 40, nua: -110, nfa: -70, fua: -70, ffa: -100, nth: -60, nsh: -110, fth: -120, fsh: -80 },
  crouch:  { torso: -14, head: -30, nua: 70, nfa: 110, fua: 110, ffa: 80, nth: 40, nsh: 110, fth: 70, fsh: 120 },
  leap:    { torso: -20, head: -20, nua: 10, nfa: -10, fua: 30, ffa: 0, nth: 160, nsh: 180, fth: 190, fsh: 170 },
  bite:    { torso: -30, head: -10, nua: 20, nfa: 60, fua: 40, ffa: 80, nth: 120, nsh: 150, fth: 150, fsh: 120 },
  dead:    { torso: -4, head: 20, nua: 100, nfa: 160, fua: 70, ffa: 20, nth: 30, nsh: 10, fth: 60, fsh: 30 },
};

function creature(spec) {
  const pose = { ...(POSE[spec.pose] || POSE.crouch), ...(spec.po || {}) };
  const D = { torso: 170, sw: 54, waist: 38, hw: 40, ua: 130, fa: 130, th: 150, sh: 160, headR: 40, neck: 28, uaW: 16, faW: 13, thW: 20, shW: 15 };
  const { j, T, headAng } = computeRig(pose, D);
  const skin = '#8fa3b0', o = [];
  const st = spec.st || {};
  const limb = (a, b, c) => path(`M${P(a)} L${P(b)} L${P(c)}`, { stroke: INK, strokeWidth: 20, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }) + path(`M${P(a)} L${P(b)} L${P(c)}`, { stroke: skin, strokeWidth: 14, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' });
  const claw = (p, ang) => [ -20, 0, 20 ].map((d) => path(`M${P(p)} L${P(pt(p, ang + d, 30))}`, { stroke: '#e8e2d0', strokeWidth: 4, strokeLinecap: 'round' })).join('');
  const angOf = (a, b) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  o.push(limb(j.shF, j.elF, j.hdF) + claw(j.hdF, angOf(j.elF, j.hdF)));
  o.push(limb(j.hpF, j.knF, j.ftF) + claw(j.ftF, angOf(j.knF, j.ftF)));
  // torso: ribby, stretched
  o.push(path(`M${P(j.hip)} L${P(j.neck)}`, { stroke: INK, strokeWidth: 52, strokeLinecap: 'round' }) + path(`M${P(j.hip)} L${P(j.neck)}`, { stroke: skin, strokeWidth: 46, strokeLinecap: 'round' }));
  for (let t = 0.3; t < 0.9; t += 0.15) {
    const p = [j.hip[0] + (j.neck[0] - j.hip[0]) * t, j.hip[1] + (j.neck[1] - j.hip[1]) * t];
    o.push(path(`M${P(pt(p, T + 90, -18))} Q${P(pt(p, T, 6))} ${P(pt(p, T + 90, 18))}`, { stroke: '#5f7180', strokeWidth: 2.5, fill: 'none' }));
  }
  // rags
  o.push(path(`M${P(pt(j.hip, T + 90, -24))} l-6,30 l10,-8 l6,26 l8,-30Z`, { fill: '#5a5448', stroke: INK, strokeWidth: 2 }));
  o.push(path(`M${P(pt(j.neck, T, -30))} l-10,24 l14,-6 l4,18 l10,-26Z`, { fill: '#6a6456', stroke: INK, strokeWidth: 2 }));
  o.push(limb(j.hpN, j.knN, j.ftN) + claw(j.ftN, angOf(j.knN, j.ftN)));
  // head
  const teethLeft = st.teeth === undefined ? 14 : st.teeth;
  const hg = [];
  hg.push(path('M-30,-10 C-36,-46 30,-50 40,-14 L60,10 C40,30 -10,34 -30,14Z', { fill: skin, stroke: INK, strokeWidth: 3 }));
  hg.push(path('M-26,10 C-10,40 40,44 64,18 L60,10 C40,24 -6,26 -26,10Z', { fill: '#4a0f18', stroke: INK, strokeWidth: 3 }));
  const open = spec.open !== false;
  hg.push(path(open ? 'M-28,14 C-10,70 50,70 66,20 C46,40 -4,42 -28,14Z' : 'M-28,14 C-10,30 50,30 66,20 C46,26 -4,28 -28,14Z', { fill: '#7f8f9a', stroke: INK, strokeWidth: 3 }));
  if (open) hg.push(path('M-24,16 C-6,52 46,52 62,22 C44,36 -4,36 -24,16Z', { fill: '#2a060c' }));
  for (let i = 0; i < 7; i++) {
    const x = -20 + i * 12;
    if (i < Math.ceil(teethLeft / 2)) hg.push(path(`M${x},${12 + i * 1.2} l5,14 l5,-14Z`, { fill: '#efe9d6', stroke: INK, strokeWidth: 1.2 }));
    if (open && i < Math.floor(teethLeft / 2)) hg.push(path(`M${x + 2},${44 - Math.abs(i - 3) * 2} l5,-14 l5,14Z`, { fill: '#efe9d6', stroke: INK, strokeWidth: 1.2 }));
  }
  if (spec.drool !== false && open) hg.push(path('M20,46 q2,16 -2,28', { stroke: '#cfe6e0', strokeWidth: 3, fill: 'none', opacity: 0.8 }));
  hg.push(ellipse(4, -10, 10, 7, { fill: '#e9efe8', stroke: INK, strokeWidth: 2 }) + ellipse(26, -12, 9, 6, { fill: '#e9efe8', stroke: INK, strokeWidth: 2 }));
  hg.push(path('M-20,-30 l10,8 M14,-38 l4,12', { stroke: '#5f7180', strokeWidth: 2 }));
  o.push(g(hg.join(''), { transform: `translate(${f(j.head[0])},${f(j.head[1])}) rotate(${f(headAng + 90)})` }));
  o.push(limb(j.shN, j.elN, j.hdN) + claw(j.hdN, angOf(j.elN, j.hdN)));
  const s = spec.s || 1, m = spec.face === 'l' ? -1 : 1;
  return g(o.join(''), { transform: `translate(${f(spec.x || 0)},${f(spec.y || 0)}) rotate(${spec.rot || 0}) scale(${s * m},${s}) translate(${f(-j.hip[0])},${f(-j.hip[1])})` });
}

module.exports = { creature };
