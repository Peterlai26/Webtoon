// Character definitions + figure renderer. Every appearance of a character in
// every episode goes through CHARS[name], which is what keeps faces, hair,
// eye colours and outfits identical across the series.
'use strict';
const { INK, pt, P, path, circle, ellipse, rect, line, g, id, smooth, f } = require('./util');
const { POSES, computeRig, DEFAULT_DIMS } = require('./rig');
const { head } = require('./head');
const { prop } = require('./props');

const SK = { light: '#f3d6c2', pale: '#f4e2d8', fair: '#f6dfcf', tan: '#d9a882', dark: '#6b4a3a', green: '#a6b065', grey: '#b7a99a' };
const OL = (w) => ({ stroke: INK, strokeWidth: w, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' });

// --- body-side helper: is the given anatomical side the one nearest the viewer?
function sideInfo(face) {
  const mir = face === 'l';
  const front = face === 'front';
  const nearSide = front !== mir ? 'left' : 'right';
  return { mir, front, nearSide, sx: (s) => (s === 'c' ? 0 : s === nearSide ? 1 : -1), isNear: (s) => s === nearSide };
}

function torsoShape(D) {
  const L = D.torso, sw = D.sw, wa = D.waist, hw = D.hw;
  return `M${-hw / 2},6 L${-wa / 2},${-L * 0.42} C${-sw / 2 - 2},${-L * 0.7} ${-sw / 2 - 2},${-L + 14} ${-sw / 2 + 12},${-L + 4} Q0,${-L - 8} ${sw / 2 - 12},${-L + 4} C${sw / 2 + 2},${-L + 14} ${sw / 2 + 2},${-L * 0.7} ${wa / 2},${-L * 0.42} L${hw / 2},6 Q0,14 ${-hw / 2},6Z`;
}

function hole(x, y, r, skin) {
  r *= 0.7;
  return path(`M${x - r - 5},${y} q2,${-r - 6} ${r + 6},${-r - 4} q${r + 6},0 ${r + 4},${r + 5} q-3,${r + 5} ${-r - 5},${r + 4} q${-r - 4},-2 ${-r - 5},${-r - 5}Z`, { fill: '#3b2418', opacity: 0.8 }) + circle(x, y, r, { fill: skin, opacity: 0.85 }) + circle(x, y, r, { fill: '#7a4a30', opacity: 0.25 });
}

// ---------- outfits ----------
const REY_RED = '#b3122a';
function reyTorso(L, D, st, si, skin) {
  const sw = D.sw, o = [];
  if (st.outfit === 'shirt') { // EP12: jacket given to Sera, black shirt underneath
    o.push(rect(-60, -L - 20, 120, L + 40, { fill: '#1d1c24' }) + path(`M-10,${-L + 2} L0,${-L + 16} L10,${-L + 2}`, { stroke: '#3a3842', strokeWidth: 2.4, fill: 'none' }) + path(`M0,${-L + 16} L0,-8`, { stroke: '#2e2c36', strokeWidth: 2 }));
    return o.join('');
  }
  if (st.outfit === 'shirtRolled') { // EP21-22, EP25: black long-sleeve shirt, sleeves rolled to the elbow
    o.push(rect(-60, -L - 20, 120, L + 40, { fill: '#1d1c24' }) + path(`M-10,${-L + 2} L0,${-L + 16} L10,${-L + 2}`, { stroke: '#3a3842', strokeWidth: 2.4, fill: 'none' }) + path(`M0,${-L + 16} L0,-8`, { stroke: '#2e2c36', strokeWidth: 2 }));
    if (st.blood) o.push(path(`M-34,${-L + 10} L30,${-L * 0.3}`, { stroke: '#a3101f', strokeWidth: 6, opacity: 0.85 }));
    return o.join('');
  }
  if (st.outfit === 'coat') { // EP26-30: long black coat (ch.26 L62 over the shirt; ch.30 L178 over the white jacket)
    if (st.inner === 'jacket') o.push(rect(-60, -L - 20, 120, L + 40, { fill: '#f4f3ef' }) + rect(-11, -L * 0.7, 3.5, L * 0.7 + 20, { fill: REY_RED }) + rect(7.5, -L * 0.7, 3.5, L * 0.7 + 20, { fill: REY_RED }) + path(`M-12,${-L + 2} L0,${-L + 18} L12,${-L + 2}`, { fill: '#1d1c24', stroke: INK, strokeWidth: 2 }));
    else o.push(rect(-60, -L - 20, 120, L + 40, { fill: '#1d1c24' }) + path(`M-10,${-L + 2} L0,${-L + 16} L10,${-L + 2}`, { stroke: '#3a3842', strokeWidth: 2.4, fill: 'none' }));
    o.push(path(`M-60,${-L - 20} L-14,${-L - 20} L-4,${-L * 0.55} L-10,10 L-60,10Z`, { fill: '#121117' }) + path(`M60,${-L - 20} L14,${-L - 20} L4,${-L * 0.55} L10,10 L60,10Z`, { fill: '#121117' }));
    o.push(path(`M-14,${-L - 4} L-4,${-L * 0.55} L-10,10 M14,${-L - 4} L4,${-L * 0.55} L10,10`, { stroke: '#2e2c36', strokeWidth: 3, fill: 'none' }));
    o.push(rect(-60, -12, 120, 6, { fill: '#2a2830' }));
    if (st.blood) o.push(path(`M-4,${-L + 12} q-6,30 4,60 q-12,-4 -16,-30Z`, { fill: '#a3101f', opacity: 0.85 }));
    if (st.gash) o.push(path(`M-40,${-L * 0.4} L36,${-L * 0.2}`, { stroke: '#7a0a14', strokeWidth: 10, strokeLinecap: 'round' }) + path(`M-40,${-L * 0.4} L36,${-L * 0.2}`, { stroke: '#c0172a', strokeWidth: 4 }));
    return o.join('');
  }
  if (st.outfit === 'suit') { // EP13-14: black velvet suit, black silk shirt, dark red tie
    o.push(rect(-60, -L - 20, 120, L + 40, { fill: '#18171d' }));
    o.push(path(`M-16,${-L + 2} L0,${-L * 0.42} L16,${-L + 2}Z`, { fill: '#0e0d12' }));
    o.push(path(`M-3,${-L + 4} L3,${-L + 4} L5,${-L * 0.5} L0,${-L * 0.44} L-5,${-L * 0.5}Z`, { fill: '#8a0e1e', stroke: INK, strokeWidth: 1.4 }));
    o.push(path(`M-18,${-L + 2} L-4,${-L * 0.42} L-12,${-L * 0.25} M18,${-L + 2} L4,${-L * 0.42} L12,${-L * 0.25}`, { stroke: '#2e2c36', strokeWidth: 3, fill: 'none' }));
    o.push(circle(-6, -L * 0.3, 2.6, { fill: '#3a3842' }) + circle(-6, -L * 0.18, 2.6, { fill: '#3a3842' }));
    if (st.blood) o.push(path(`M${si.sx('right') * 24},${-L + 10} q-8,30 6,60 q-14,-6 -18,-30Z`, { fill: '#a3101f', opacity: 0.9 }));
    if (st.shoulderShot) o.push(circle(si.sx('right') * sw * 0.3, -L + 10, 12, { fill: '#a3101f' }));
    return o.join('');
  }
  o.push(rect(-60, -L - 20, 120, L + 40, { fill: '#f4f3ef' }));
  o.push(rect(-sw / 2 - 14, -L, 22, L + 20, { fill: '#1d1c24' }));
  o.push(rect(sw / 2 - 8, -L, 22, L + 20, { fill: '#1d1c24' }));
  o.push(rect(-sw / 2 + 8, -L, 3.5, L + 20, { fill: REY_RED }));
  o.push(rect(sw / 2 - 11.5, -L, 3.5, L + 20, { fill: REY_RED }));
  o.push(rect(-60, -10, 120, 20, { fill: '#1d1c24' }));
  o.push(rect(-60, -12, 120, 3, { fill: REY_RED }));
  o.push(line([8, -L + 8], [8, -12], { stroke: '#a9a9b2', strokeWidth: 2.4 }));
  o.push(path(`M-30,${-L * 0.38} l18,0 M14,${-L * 0.38} l18,0`, { stroke: '#c5c4c9', strokeWidth: 2 }));
  o.push(rect(-60, -L * 0.75, 120, L * 0.75, { fill: '#000', opacity: 0.05 }));
  if (st.dirty) o.push(path(`M-20,${-L * 0.5} q20,-10 30,6 q10,20 -14,24Z`, { fill: '#6b5a4a', opacity: 0.25 }));
  for (const h of st.holes || []) {
    o.push(hole(si.sx(h.side) * sw * (h.side === 'c' ? 0 : 0.2) + (h.dx || 0), -L * (1 - (h.y ?? 0.35)), h.r || 11, skin));
  }
  if (st.blood) o.push(path(`M-4,${-L + 12} q-6,30 4,60 q-12,-4 -16,-30Z`, { fill: '#a3101f', opacity: 0.85 }));
  if (st.scorched) o.push(path(`M-50,${-L * 0.7} q20,-14 34,4 q14,20 -6,30 q-20,6 -28,-34Z M14,${-L * 0.45} q20,-10 30,8 q4,24 -18,22Z M-34,${-L * 0.2} q16,-6 22,6 q-4,12 -18,8Z`, { fill: '#2a1a12', opacity: 0.55 }) + path(`M-40,${-L * 0.86} l10,6 M24,${-L * 0.9} l-6,10 M-20,${-L * 0.1} l12,-4`, { stroke: '#2a1a12', strokeWidth: 3 }));
  if (st.muddy) o.push(path(`M-60,${-L * 0.3} q30,-12 60,4 q30,10 60,-6 L60,0 L-60,0Z`, { fill: '#5a4a36', opacity: 0.45 }) + circle(-20, -L * 0.6, 8, { fill: '#5a4a36', opacity: 0.4 }) + circle(24, -L * 0.75, 6, { fill: '#5a4a36', opacity: 0.4 }));
  if (st.torn) o.push(path(`M-34,${-L * 0.5} l12,8 l-8,8 l14,6 M20,${-L * 0.25} l12,10 M30,${-L * 0.8} l-10,12`, { stroke: '#3a2a20', strokeWidth: 3, fill: 'none' }));
  return o.join('');
}
function reyOver(L, D, st, si) {
  const o = [];
  if (st.outfit === 'shirt' || st.outfit === 'shirtRolled') return '';
  if (st.outfit === 'coat') return path(`M-20,${-L + 4} L-24,${-L - 16} Q0,${-L - 4} 24,${-L - 16} L20,${-L + 4}Z`, { fill: '#121117', stroke: INK, strokeWidth: 2.5 });
  if (st.outfit === 'suit') return path(`M-18,${-L + 4} L-14,${-L - 12} L0,${-L - 2} L14,${-L - 12} L18,${-L + 4}`, { fill: '#0e0d12', stroke: INK, strokeWidth: 2.4 });
  o.push(path(`M-18,${-L + 4} L-20,${-L - 14} Q0,${-L - 6} 20,${-L - 14} L18,${-L + 4}Z`, { fill: '#1d1c24', stroke: INK, strokeWidth: 2.5 }));
  o.push(path(`M-19,${-L - 9} Q0,${-L - 2} 19,${-L - 9}`, { stroke: REY_RED, strokeWidth: 2.4, fill: 'none' }));
  if (st.pin) {
    const x = si.sx('left') * D.sw * 0.2, y = -L * 0.66;
    o.push(path(`M${x - 16},${y + 2} L${x + 16},${y - 2} Q${x + 22},${y} ${x + 16},${y + 4} L${x - 14},${y + 6}`, { stroke: '#dfe3ea', strokeWidth: 3.4, fill: 'none', strokeLinecap: 'round' }) + circle(x - 16, y + 4, 4, { fill: '#c9ced6', stroke: INK, strokeWidth: 1.5 }));
  }
  if (st.buttonMissing) o.push(circle(8, -L * 0.56, 2.5, { fill: 'none', stroke: '#8a8a92', strokeWidth: 1.4 }));
  if (st.apron) {
    const torn = st.apron === 'torn';
    o.push(path(`M-24,${-L + 26} L24,${-L + 26} L30,-6 L-30,-6Z`, { fill: '#ffd83a', stroke: INK, strokeWidth: 2.6, strokeLinejoin: 'round' }));
    o.push(path(`M-24,${-L + 26} L-14,${-L - 4} M24,${-L + 26} L14,${-L - 4}`, { stroke: '#e8b820', strokeWidth: 4 }));
    for (const [x, y] of [[-12, -L * 0.6], [10, -L * 0.45], [-8, -L * 0.25]]) o.push(duck(x, y));
    if (torn) o.push(path(`M-30,${-L * 0.3} l14,6 l-8,8 l16,4`, { stroke: INK, strokeWidth: 2, fill: 'none' }));
  }
  if (st.labcoat) {
    o.push(path(`M${-D.sw / 2 - 4},${-L + 6} L-10,${-L + 2} L4,-4 L${-D.hw / 2 - 6},4Z`, { fill: '#fbfbfd', stroke: INK, strokeWidth: 2.6, strokeLinejoin: 'round' }));
    o.push(path(`M${D.sw / 2 + 4},${-L + 6} L14,${-L + 2} L12,-4 L${D.hw / 2 + 6},4Z`, { fill: '#fbfbfd', stroke: INK, strokeWidth: 2.6, strokeLinejoin: 'round' }));
  }
  return o.join('');
}
function duck(x, y) {
  return ellipse(x, y, 6, 4.5, { fill: '#fff6c8', stroke: '#c9951a', strokeWidth: 1.2 }) + circle(x + 5, y - 4, 3, { fill: '#fff6c8', stroke: '#c9951a', strokeWidth: 1.2 }) + path(`M${x + 8},${y - 4} l3,1 l-3,1`, { fill: '#ff8a2a' });
}

function lucasTorso(L, D, st, si) {
  const o = [];
  o.push(rect(-60, -L - 20, 120, L + 40, { fill: '#f4f6fa' }));
  o.push(path(`M-30,${-L * 0.42} L30,${-L * 0.42} L24,-4 L-24,-4Z`, { fill: '#24262e' }));
  for (let i = 1; i < 4; i++) o.push(line([-26, -L * 0.42 + i * 16], [26, -L * 0.42 + i * 16], { stroke: '#3e414c', strokeWidth: 2 }));
  o.push(path(`M-34,${-L + 20} L0,${-L * 0.5} L34,${-L + 20}`, { stroke: '#e2b84a', strokeWidth: 3.5, fill: 'none' }));
  o.push(path(`M0,${-L * 0.5} L0,${-L * 0.42}`, { stroke: '#3fe0d0', strokeWidth: 5 }));
  o.push(circle(0, -L * 0.62, 7, { fill: '#3fe0d0', stroke: '#e2b84a', strokeWidth: 2.5 }));
  o.push(rect(-60, -8, 120, 14, { fill: '#e2b84a' }));
  if (st.dirt) o.push(rect(-60, -L, 120, L, { fill: '#6a5a4a', opacity: 0.12 }));
  if (st.chestCracked) o.push(circle(0, -L * 0.62, 9, { fill: '#2a2e34' }) + path(`M0,${-L * 0.62} l-24,-20 l-10,6 M0,${-L * 0.62} l26,-14 l8,-16 M0,${-L * 0.62} l-18,24 l-14,4 M0,${-L * 0.62} l20,26 l2,14 M0,${-L * 0.62} l4,-30`, OL(2.4)) + rect(-60, -L, 120, L, { fill: '#2a2a2a', opacity: 0.12 }));
  return o.join('');
}
function pauldron(L, D, st, near, si, broken) {
  const x = near ? D.sw * 0.32 : -D.sw * 0.32, dir = near ? 1 : -1;
  const o = [];
  o.push(path(`M${x - 22 * dir},${-L + 6} C${x - 10 * dir},${-L - 22} ${x + 32 * dir},${-L - 18} ${x + 34 * dir},${-L + 16} L${x + 26 * dir},${-L + 30} L${x - 8 * dir},${-L + 22}Z`, { fill: broken ? '#cfd2d8' : '#f6f7fa', stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' }));
  o.push(path(`M${x - 14 * dir},${-L + 2} C${x - 4 * dir},${-L - 14} ${x + 24 * dir},${-L - 12} ${x + 28 * dir},${-L + 12}`, { stroke: '#e2b84a', strokeWidth: 3, fill: 'none' }));
  o.push(path(`M${x + 8 * dir},${-L + 14} l${14 * dir},4`, { stroke: broken ? '#555' : '#3fe0d0', strokeWidth: 5, strokeLinecap: 'round' }));
  if (broken) {
    o.push(path(`M${x},${-L - 10} l${8 * dir},14 l${-6 * dir},8 l${12 * dir},10 M${x + 20 * dir},${-L - 6} l${-4 * dir},12`, OL(2.4)));
    o.push(path(`M${x + 12 * dir},${-L - 20} q${8 * dir},-14 0,-26 q-8,-12 4,-24`, { stroke: '#7fe9df', strokeWidth: 5, fill: 'none', opacity: 0.55 }));
    o.push(path(`M${x + 2 * dir},${-L + 4} l${-6 * dir},6 M${x + 22 * dir},${-L + 20} l${6 * dir},6`, { stroke: '#fff27a', strokeWidth: 3 }));
  }
  return o.join('');
}

function seraTorso(L, D, st, si, skin) {
  const o = [];
  const outfit = st.outfit || 'combat';
  if (outfit === 'gown') { // EP13-14: black silk evening dress with blood-red lace
    o.push(rect(-60, -L - 20, 120, L + 40, { fill: '#121117' }) + rect(-60, -L - 20, 120, 26, { fill: skin }));
    o.push(path(`M-34,${-L + 6} Q0,${-L + 22} 34,${-L + 6}`, { stroke: '#a3101f', strokeWidth: 5, fill: 'none', strokeDasharray: '6 3' }));
    o.push(path(`M-24,${-L * 0.42} Q0,${-L * 0.36} 24,${-L * 0.42}`, { stroke: '#a3101f', strokeWidth: 3, fill: 'none' }));
    return o.join('');
  }
  if (outfit === 'doll') { // EP30: black combat suit trimmed red, crimson origin threads into the core (ch.30 L138-140)
    o.push(rect(-60, -L - 20, 120, L + 40, { fill: '#141318' }) + path(`M-30,${-L + 4} L0,${-L * 0.5} L30,${-L + 4}`, { stroke: '#c0172a', strokeWidth: 4, fill: 'none' }) + path(`M-60,${-L * 0.45} L60,${-L * 0.45}`, { stroke: '#c0172a', strokeWidth: 3 }) + rect(-60, -10, 120, 12, { fill: '#c0172a' }));
    o.push(path(Array.from({ length: 6 }, (_, i) => `M${-4 + i * 2},${-L * 0.62} Q${-40 + i * 16},${-L * 0.4} ${-50 + i * 20},-4`).join(' '), { stroke: '#ff2a3a', strokeWidth: 1.4, fill: 'none', opacity: 0.8 }));
    o.push(circle(si.sx('left') * 10, -L * 0.62, 9, { fill: '#c0172a', stroke: INK, strokeWidth: 2 }) + circle(si.sx('left') * 10, -L * 0.62, 18, { fill: '#ff2a3a', opacity: 0.3 }));
    return o.join('');
  }
  if (outfit === 'coat') { // EP12-13: long black coat over the bandages
    o.push(rect(-60, -L - 20, 120, L + 40, { fill: '#141318' }) + path(`M-14,${-L + 2} L0,${-L * 0.45} L14,${-L + 2}`, { fill: '#232129', stroke: INK, strokeWidth: 2 }) + path(`M-2,${-L * 0.45} L-2,-6`, { stroke: '#2a2830', strokeWidth: 3 }));
    return o.join('');
  }
  if (outfit === 'surgery') {
    o.push(rect(-60, -L - 20, 120, L + 40, { fill: skin }));
    o.push(path(`M-34,${-L * 0.72} L34,${-L * 0.72} L30,-4 L-30,-4Z`, { fill: '#1c1b22' }));
  } else {
    o.push(rect(-60, -L - 20, 120, L + 40, { fill: outfit === 'vest' ? '#232129' : '#1c1b22' }));
    o.push(path(`M-12,${-L + 6} L-6,-6 M14,${-L + 6} L10,-6`, { stroke: '#34323d', strokeWidth: 3 }));
    o.push(path(`M-26,${-L * 0.45} L26,${-L * 0.45}`, { stroke: '#34323d', strokeWidth: 2.4 }));
    if (outfit === 'tank') o.push(rect(-60, -L - 20, 120, 26, { fill: skin }));
    if (outfit === 'vest') o.push(path(`M-6,${-L + 4} L-2,-6 M6,${-L + 4} L4,-6`, { stroke: '#5b5866', strokeWidth: 2 }) + rect(-60, -L - 20, 120, 24, { fill: skin }));
  }
  if (outfit === 'surgery' || st.scar) {
    const x = si.sx('left') * 14;
    o.push(path(`M${x - 16},${-L + 10} q16,-8 30,0 q4,16 -6,24 q-18,6 -24,-8Z`, { fill: 'none', stroke: '#c79a8e', strokeWidth: 1.6, strokeDasharray: '3 2' }));
  }
  o.push(rect(-60, -10, 120, 12, { fill: '#2c2a33' }));
  o.push(rect(-6, -10, 12, 12, { fill: '#7a7682' }));
  if (st.torn) o.push(path(`M-30,${-L * 0.6} l10,8 l-6,6 l12,4 M18,${-L * 0.3} l10,10`, { stroke: '#8a3a2a', strokeWidth: 3, fill: 'none' }) + circle(20, -L * 0.7, 8, { fill: skin, stroke: '#6a2a1a', strokeWidth: 2 }));
  if (st.sideWound) {
    const x = si.sx('left') * D.waist * 0.42;
    o.push(path(`M${x},${-L * 0.62} C${x + 6},${-L * 0.4} ${x - 4},${-L * 0.2} ${x + 4},-6`, { stroke: '#c0172a', strokeWidth: 9, strokeLinecap: 'round', fill: 'none' }) + path(`M${x},${-L * 0.6} C${x + 4},${-L * 0.4} ${x - 2},${-L * 0.2} ${x + 2},-8`, { stroke: '#ff4a5a', strokeWidth: 2, fill: 'none' }));
  }
  return o.join('');
}

function coatTorso(color, trim, inner) {
  return (L, D) => rect(-60, -L - 20, 120, L + 40, { fill: color }) +
    path(`M-14,${-L + 2} L0,${-L * 0.45} L14,${-L + 2}`, { fill: inner || '#2a2833', stroke: INK, strokeWidth: 2 }) +
    path(`M-16,${-L + 2} L-2,${-L * 0.45} L-2,-6 M16,${-L + 2} L2,${-L * 0.45}`, { stroke: trim, strokeWidth: 3, fill: 'none' }) +
    rect(-60, -10, 120, 6, { fill: '#000', opacity: 0.25 });
}

function ashTorso(L, D, st) {
  const o = [rect(-60, -L - 20, 120, L + 40, { fill: '#6e5c49' })];
  const patches = [[-30, -L * 0.85, 22, 18, '#8a4a3a'], [8, -L * 0.6, 20, 24, '#4a6a5a'], [-24, -L * 0.42, 18, 16, '#9a8a4a'], [10, -L * 0.25, 22, 14, '#5a4a7a'], [-34, -L * 0.2, 16, 18, '#7a3a4a']];
  for (const [x, y, w, h, c] of patches) o.push(rect(x, y, w, h, { fill: c, stroke: '#2a2018', strokeWidth: 1.6, strokeDasharray: '3 2' }));
  let d = '';
  for (let t = 0; t <= 1.0001; t += 0.08) { const x = -34 + 68 * t, y = -L + 10 + (L - 20) * t; d += `M${x - 5},${y - 3} a5,4 0 1,0 10,0 a5,4 0 1,0 -10,0 `; }
  o.push(path(d, { stroke: '#a9adb3', strokeWidth: 2.6, fill: 'none' }));
  return o.join('');
}

function latchTorso(L) {
  const o = [rect(-60, -L - 20, 120, L + 40, { fill: '#6e1f2a' })];
  for (let i = 0; i < 4; i++) { o.push(circle(-12, -L * 0.8 + i * 26, 4, { fill: '#e5bd4a', stroke: INK, strokeWidth: 1.4 })); o.push(circle(14, -L * 0.8 + i * 26, 4, { fill: '#e5bd4a', stroke: INK, strokeWidth: 1.4 })); }
  o.push(rect(-60, -12, 120, 8, { fill: '#2a0e14' }));
  return o.join('');
}
function latchOver(L) {
  const key = (x) => circle(x, L * -1 - 4, 3.4, { fill: '#e5bd4a' }) + path(`M${x - 2},${-L - 2} L${x - 3},${-L + 6} L${x + 3},${-L + 6} L${x + 2},${-L - 2}Z`, { fill: '#e5bd4a' });
  return path(`M-20,${-L + 6} L-22,${-L - 16} L22,${-L - 16} L20,${-L + 6}Z`, { fill: '#5a1822', stroke: INK, strokeWidth: 2.5 }) + key(-12) + key(12);
}

function sutureTorso(L, D, st, si, skin) {
  return rect(-60, -L - 20, 120, L + 40, { fill: '#18171d' }) + rect(-60, -L - 20, 120, 30, { fill: skin }) +
    path(`M-30,${-L + 10} L30,${-L + 10}`, { stroke: '#3a3842', strokeWidth: 3 }) +
    rect(-60, -L * 0.36, 120, 16, { fill: skin }) +
    path(`M-30,${-L * 0.36 + 8} L30,${-L * 0.36 + 8}`, { stroke: '#7a4a4a', strokeWidth: 2 }) +
    path(Array.from({ length: 8 }, (_, i) => `M${-28 + i * 8},${-L * 0.36 + 3} l0,10`).join(' '), { stroke: '#7a4a4a', strokeWidth: 1.6 });
}

function armourTorso(main, dark, accent, emblem) {
  return (L, D, st) => {
    const o = [rect(-60, -L - 20, 120, L + 40, { fill: main })];
    o.push(path(`M-30,${-L * 0.4} L30,${-L * 0.4} L24,-4 L-24,-4Z`, { fill: dark }));
    o.push(path(`M-30,${-L + 16} L0,${-L * 0.46} L30,${-L + 16}`, { stroke: accent, strokeWidth: 3, fill: 'none' }));
    if (emblem) o.push(circle(0, -L * 0.64, 11, { fill: 'none', stroke: emblem, strokeWidth: 3 }) + circle(0, -L * 0.64, 5, { fill: emblem }) +
      path(Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return `M${f(Math.cos(a) * 14)},${f(-L * 0.64 + Math.sin(a) * 14)} L${f(Math.cos(a) * 19)},${f(-L * 0.64 + Math.sin(a) * 19)}`; }).join(' '), { stroke: emblem, strokeWidth: 2.4 }));
    if (st.battle) o.push(path(`M-24,${-L * 0.8} l12,10 l-4,8 M10,${-L * 0.3} l14,6`, OL(2.2)) + rect(-60, -L, 120, L, { fill: '#5a4a3a', opacity: 0.14 }));
    o.push(rect(-60, -8, 120, 12, { fill: dark }));
    return o.join('');
  };
}

function leatherCoatTorso(fangColor) {
  return (L, D, st) => rect(-60, -L - 20, 120, L + 40, { fill: '#1b1a20' }) +
    path(`M-14,${-L + 2} L0,${-L * 0.4} L14,${-L + 2}`, { fill: '#3a2a2a', stroke: INK, strokeWidth: 2 }) +
    path(`M${-D.sw * 0.22 - 6},${-L * 0.7} l6,16 l6,-16 M${-D.sw * 0.22 + 2},${-L * 0.7} l5,12 l5,-12`, { fill: st.fang || fangColor || '#c0172a', stroke: INK, strokeWidth: 1.2 }) +
    rect(-60, -10, 120, 8, { fill: '#000', opacity: 0.35 });
}

function razeTorso(L, D) {
  return rect(-60, -L - 20, 120, L + 40, { fill: '#17161c' }) +
    path(`M-34,${-L + 8} L30,${-L * 0.35} M-30,${-L * 0.6} L34,${-L * 0.6}`, { stroke: '#3a3540', strokeWidth: 7 }) +
    rect(-8, -L * 0.6 - 6, 14, 12, { fill: '#a8acb6', stroke: INK, strokeWidth: 2 }) + rect(-4, -L * 0.48 - 6, 12, 12, { fill: '#a8acb6', stroke: INK, strokeWidth: 2 }) +
    rect(-60, -12, 120, 10, { fill: '#2c2830' }) + rect(-6, -12, 12, 10, { fill: '#a8acb6' });
}

function plainTorso(color, extra) {
  return (L, D, st) => rect(-60, -L - 20, 120, L + 40, { fill: color }) + (extra ? extra(L, D, st) : '') + rect(-60, -L * 0.7, 120, L * 0.7, { fill: '#000', opacity: 0.06 });
}

// ---------- helmets ----------
function valeHelmet(expr, side, ex) {
  const fx = side === 'front' ? 0 : 8;
  return path('M-44,-8 C-46,-60 46,-62 46,-10 C48,18 34,44 6,50 C-20,48 -40,26 -44,-8Z', { fill: '#ecedf1', stroke: INK, strokeWidth: 3 }) +
    path(`M${fx - 34},-8 L${fx + 42},-12 L${fx + 40},18 C${fx + 20},34 ${fx - 20},32 ${fx - 34},14Z`, { fill: '#1d1c24', stroke: INK, strokeWidth: 2.5 }) +
    ellipse(fx - 12, 2, 12, 5, { fill: '#b14bff', opacity: 0.5 }) + ellipse(fx + 18, 1, 12, 5, { fill: '#b14bff', opacity: 0.5 }) +
    ellipse(fx - 12, 2, 7, 2.6, { fill: '#f0d0ff' }) + ellipse(fx + 18, 1, 7, 2.6, { fill: '#f0d0ff' }) +
    path('M-36,-30 L30,-44', { stroke: '#2a2833', strokeWidth: 3 }) + path(`M${fx + 10},-40 l-8,12 l6,4`, OL(2)) +
    halo();
}
function halo() {
  return path('M-50,-92 A52,14 0 0,1 30,-104', { stroke: '#ffd45a', strokeWidth: 7, fill: 'none', opacity: 0.95 }) +
    path('M40,-100 A52,14 0 0,1 46,-82 M-40,-74 A52,14 0 0,0 12,-70', { stroke: '#ffd45a', strokeWidth: 7, fill: 'none', opacity: 0.85 }) +
    path('M-50,-92 A52,14 0 0,1 30,-104', { stroke: '#fff7cf', strokeWidth: 2, fill: 'none' }) +
    ellipse(0, -88, 70, 26, { fill: '#ffd45a', opacity: 0.12 });
}
function valeHairBehind() {
  return path(smooth([[-40, -20], [-54, 60], [-60, 160], [-44, 230], [-10, 200], [10, 120], [30, 200], [56, 210], [52, 100], [44, -20]]), { fill: '#eef0f6', stroke: '#b9bfcc', strokeWidth: 2 });
}
function purifierHelmet(expr, side) {
  const fx = side === 'front' ? 0 : 8;
  return path('M-42,-6 C-44,-58 44,-60 44,-8 C46,18 34,42 6,48 C-20,46 -38,24 -42,-6Z', { fill: '#eef1f6', stroke: INK, strokeWidth: 3 }) +
    path(`M${fx - 36},-6 L${fx + 44},-10 L${fx + 42},12 L${fx - 34},14Z`, { fill: '#22252e', stroke: INK, strokeWidth: 2.5 }) +
    path(`M${fx - 28},3 L${fx + 38},0`, { stroke: '#d6f6ff', strokeWidth: 3 }) +
    path('M-38,-28 L36,-38 M-20,28 L24,30', { stroke: '#a9b0bd', strokeWidth: 2.4 });
}

// Rey's arm colours by outfit, plus EP21-30 injury states. armOff: anatomical
// sides cut away (drawn hidden; the cut itself is shown with fx), burntArms:
// arms charred (ch.27 L208), rolled sleeves show the forearm.
function reyArm(st, side, c) {
  if ((st.armOff || []).includes(side)) return { hidden: true };
  if (st.outfit === 'shirtRolled') c = { ua: '#1d1c24', fa: SK.light, cuff: '#1d1c24' };
  if (st.outfit === 'coat') c = { ua: '#121117', fa: '#121117', cuff: st.inner === 'jacket' ? '#f4f3ef' : '#1d1c24' };
  if (st.burntArms === true || (st.burntArms || []).includes?.(side)) c = { ...c, ua: '#3a2620', fa: '#2a1a16', hand: '#2a1a16', burnt: true };
  return c;
}

// ---------- character table ----------
const CHARS = {
  rey: {
    dims: {}, skin: SK.light,
    head: { hair: 'rey', hairColor: '#17161f', eyes: '#d41f2c', skin: SK.light },
    torso: reyTorso, over: reyOver,
    arm: (st, side) => reyArm(st, side, (st.outfit === 'suit' ? { ua: '#18171d', fa: '#18171d', cuff: '#0e0d12' } : st.outfit === 'shirt' ? { ua: '#1d1c24', fa: '#1d1c24', cuff: '#16151b' } : { ua: '#f4f3ef', fa: '#f4f3ef', cuff: '#1d1c24', stripe: REY_RED, scorch: st.scorched })),
    leg: (st) => (st.outfit === 'suit' ? { th: '#18171d', sh: '#18171d', foot: '#0b0a10', sole: '#2a2830' } : { th: '#3a3c46', sh: '#3a3c46', foot: '#1b1b22', sole: '#e8e8ea' }),
    skirt: (st) => (st.apron ? { color: '#ffd83a', len: 70, front: true } : st.labcoat ? { color: '#fbfbfd', len: 150 } : st.outfit === 'coat' ? { color: '#121117', len: 200, trim: '#2e2c36' } : null),
  },
  lucas: {
    dims: { torso: 172, ua: 104, fa: 98, th: 152, sh: 148, sw: 80 }, skin: SK.fair,
    head: { hair: 'lucas', hairColor: '#e9eef6', browColor: '#c9d0de', eyes: '#3a9cff', skin: SK.fair },
    torso: lucasTorso,
    arm: () => ({ ua: '#24262e', fa: '#f4f6fa', cuff: '#e2b84a', hand: '#f4f6fa' }),
    leg: () => ({ th: '#f4f6fa', sh: '#f4f6fa', knee: '#24262e', foot: '#f4f6fa', sole: '#e2b84a' }),
    pauldrons: true,
  },
  sera: {
    dims: { torso: 156, sw: 66, waist: 46, hw: 50, ua: 96, fa: 90, th: 142, sh: 138, uaW: 24, faW: 21, thW: 34, shW: 28 }, skin: SK.pale,
    head: { hair: 'sera', hairColor: '#16151c', eyes: '#3a2a28', skin: SK.pale },
    torso: seraTorso,
    arm: (st, side) => {
      const s = (st.arms || {})[side] || {};
      if (st.outfit === 'gown') return { ua: SK.pale, fa: '#121117', cuff: '#a3101f', hand: '#121117' };
      if (st.outfit === 'coat') return { ua: '#141318', fa: '#141318', cuff: '#2a2830', hand: SK.pale };
      if (st.outfit === 'doll') return { ua: '#141318', fa: '#141318', cuff: '#c0172a', hand: SK.pale };
      const bare = st.outfit === 'tank' || st.outfit === 'vest' || st.outfit === 'surgery';
      const base = bare ? SK.pale : '#1c1b22';
      if (s.missing) return { hidden: true };
      if (s.burnt) return { ua: '#3a2620', fa: '#2a1a16', cuff: '#c0172a', burnt: true };
      if (s.bandage) return { ua: '#e9e4dc', fa: '#4a3426', cuff: '#4a3426', bandage: true };
      if (s.wound) return { ua: SK.pale, fa: base, cuff: base, wound: true };
      return { ua: base, fa: base, cuff: '#2c2a33', hand: bare ? SK.pale : '#24222a' };
    },
    leg: (st) => (st.barefoot ? { th: '#141318', sh: '#141318', foot: SK.pale, sole: '#e8cfc4' } : { th: '#1c1b22', sh: '#1c1b22', foot: '#121117', sole: '#3a3842' }),
    skirt: (st) => (st.outfit === 'gown' ? { color: '#121117', len: 250, trim: '#a3101f' } : st.outfit === 'coat' ? { color: '#141318', len: 210 } : null),
    over: (L, D, st) => (st.drape ? path(`M${-D.sw / 2 - 10},${-L + 16} Q0,${-L - 12} ${D.sw / 2 + 10},${-L + 16} L${D.sw / 2 + 16},${-L * 0.3} L${D.sw / 2 - 6},${-L * 0.28} L${D.sw * 0.2},${-L + 30} L${-D.sw * 0.2},${-L + 30} L${-D.sw / 2 + 6},${-L * 0.28} L${-D.sw / 2 - 16},${-L * 0.3}Z`, { fill: '#f4f3ef', stroke: INK, strokeWidth: 2.6, strokeLinejoin: 'round' }) + path(`M${-D.sw / 2 - 4},${-L + 22} L${-D.sw / 2 - 10},${-L * 0.32} M${D.sw / 2 + 4},${-L + 22} L${D.sw / 2 + 10},${-L * 0.32}`, { stroke: REY_RED, strokeWidth: 3 }) : '') + (st.outfit === 'gown' && st.shawl !== false ? path(`M${-D.sw / 2 - 6},${-L + 20} Q0,${-L - 10} ${D.sw / 2 + 6},${-L + 20} L${D.sw / 2 + 2},${-L + 40} Q0,${-L + 16} ${-D.sw / 2 - 2},${-L + 40}Z`, { fill: '#7a0e1e', stroke: INK, strokeWidth: 2.4 }) : ''),
    threads: true,
  },
  lilith: {
    dims: { torso: 154, sw: 64, waist: 48, hw: 50, uaW: 25, faW: 22, thW: 32, shW: 27 }, skin: '#f3dccd',
    head: { hair: 'lilith', hairColor: '#4a3326', eyes: '#5c8a5a', skin: '#f3dccd', glasses: true },
    torso: (L, D, st) => coatTorso(st.cloak ? '#3a3448' : '#fbfbfd', st.cloak ? '#5a5070' : '#d8dbe2', '#3c3f4c')(L, D),
    arm: (st) => ({ ua: st.cloak ? '#3a3448' : '#fbfbfd', fa: st.cloak ? '#3a3448' : '#fbfbfd', cuff: st.gloves ? '#16151b' : '#d8dbe2', hand: st.gloves ? '#16151b' : undefined }),
    leg: () => ({ th: '#2e3040', sh: '#2e3040', foot: '#1a1a22', sole: '#555' }),
    skirt: (st) => ({ color: st.cloak ? '#3a3448' : '#fbfbfd', len: 170 }),
  },
  knell: {
    dims: { torso: 168, ua: 102, fa: 96, th: 150, sh: 146, sw: 70, uaW: 25, faW: 22, thW: 33, shW: 28 }, skin: '#efd9cb',
    head: { hair: 'knell', hairColor: '#1c2238', eyes: '#e0a020', skin: '#efd9cb' },
    torso: coatTorso('#16161d', '#b8c2d6', '#2a3350'),
    arm: () => ({ ua: '#16161d', fa: '#16161d', cuff: '#3a5aa0', hand: '#0f0f14' }),
    leg: () => ({ th: '#1b1b24', sh: '#1b1b24', foot: '#0f0f14', sole: '#333' }),
    skirt: () => ({ color: '#16161d', len: 220, trim: '#b8c2d6' }),
    belt: (D, L) => g(prop('bell'), { transform: `translate(${D.hw * 0.35},-6) scale(.7)` }) + g(prop('notebook'), { transform: `translate(${-D.hw * 0.5},-2) scale(.6)` }),
  },
  latch: {
    dims: { torso: 170, ua: 104, fa: 98, th: 156, sh: 150, sw: 70, waist: 46, hw: 46, uaW: 24, faW: 21, thW: 30, shW: 26 }, skin: SK.dark,
    head: { hair: 'crew', hairColor: '#1a1414', eyes: '#fff', eyeGlow: '#fffbe8', skin: SK.dark, hat: path('M-34,-44 L34,-50 L36,-30 L-34,-24Z', { fill: '#6e1f2a', stroke: INK, strokeWidth: 3 }) + path('M-34,-26 L36,-32', { stroke: '#e5bd4a', strokeWidth: 3 }) + path('M-30,-50 Q0,-62 32,-56', { stroke: INK, strokeWidth: 3, fill: '#6e1f2a' }) },
    torso: latchTorso, over: latchOver,
    arm: () => ({ ua: '#6e1f2a', fa: '#6e1f2a', cuff: '#e5bd4a', hand: '#f6f6f2' }),
    leg: () => ({ th: '#4a141c', sh: '#4a141c', foot: '#120c0e', sole: '#333' }),
  },
  suture: {
    dims: { torso: 160, sw: 70, waist: 48, hw: 52, uaW: 24, faW: 21, thW: 34, shW: 30 }, skin: '#eed8cc',
    head: { hair: 'suture', hairColor: '#121118', browColor: '#2a2830', eyes: '#7a2a3a', skin: '#eed8cc', glasses: true, lips: '#16141a' },
    torso: sutureTorso,
    arm: () => ({ ua: '#eed8cc', fa: '#18171d', cuff: '#9aa0aa', hand: '#eed8cc', blades: true }),
    leg: () => ({ th: '#9aa0aa', sh: '#9aa0aa', knee: '#6a707a', foot: '#9aa0aa', sole: '#222', heel: true }),
    skirt: () => ({ color: '#18171d', len: 120 }),
    pauldrons: 'metal',
  },
  ash: {
    dims: { torso: 156, sw: 66, waist: 44, hw: 46, uaW: 22, faW: 19, thW: 28, shW: 24 }, skin: SK.green,
    head: { hair: 'none', hairColor: '#333', eyes: '#e4d84a', skin: SK.green, mask: 'skull', stitches: 'M-30,-34 l10,-8 M-26,-38 l4,4 M-18,-44 l4,4' },
    torso: ashTorso,
    arm: (st, side) => (st.stoneArm && side === 'right' ? { ua: '#8d8a84', fa: '#8d8a84', cuff: '#5b5852', hand: '#8d8a84', stone: true } : { ua: '#6e5c49', fa: '#6e5c49', cuff: '#4a3a2c', hand: '#d8cfbf', bandaged: true }),
    leg: () => ({ th: '#3c342c', sh: '#3c342c', foot: '#2a2420', sole: '#444' }),
    skirt: () => ({ color: '#6e5c49', len: 150 }),
    sack: true, spike: true,
  },
  grey: {
    dims: { torso: 166, sw: 92, waist: 70, hw: 60, uaW: 36, faW: 32, thW: 44, shW: 38 }, skin: SK.tan,
    head: { hair: 'short', hairColor: '#4a3a2a', eyes: '#4a3a2a', skin: SK.tan },
    torso: plainTorso('#5a3c26', (L) => path(`M-10,${-L + 4} L-10,-6 M10,${-L + 4} L10,-6`, { stroke: '#3a2416', strokeWidth: 3 }) + rect(-30, -L * 0.6, 16, 14, { fill: '#7a5a3a', stroke: '#2a1a10', strokeWidth: 1.4, strokeDasharray: '3 2' }) + rect(14, -L * 0.35, 16, 16, { fill: '#4a3a2a', stroke: '#2a1a10', strokeWidth: 1.4, strokeDasharray: '3 2' }) + rect(-60, -L - 20, 120, 22, { fill: SK.tan }) + rect(-6, -L, 12, L * 0.6, { fill: SK.tan })),
    arm: () => ({ ua: SK.tan, fa: SK.tan, cuff: SK.tan }),
    leg: () => ({ th: '#3a3a40', sh: '#3a3a40', foot: '#2a2018', sole: '#444' }),
  },
  vale: {
    dims: { torso: 176, ua: 106, fa: 100, th: 156, sh: 150, sw: 84, waist: 58, hw: 54, uaW: 30, faW: 26, thW: 38, shW: 33 }, skin: SK.fair,
    head: { helmet: valeHelmet, helmetBehind: valeHairBehind, skin: SK.fair },
    torso: (L, D, st) => armourTorso('#e4e6ec', '#1f1e26', '#8a8f9c')(L, D, { battle: true }),
    arm: () => ({ ua: '#1f1e26', fa: '#e4e6ec', cuff: '#8a8f9c', hand: '#2a2933' }),
    leg: () => ({ th: '#e4e6ec', sh: '#e4e6ec', knee: '#1f1e26', foot: '#1f1e26', sole: '#555' }),
    cape: '#3c3a44', pauldrons: 'vale',
  },
  purifier: {
    dims: { torso: 168, sw: 82, waist: 58, hw: 56, uaW: 30, faW: 27, thW: 40, shW: 35 }, skin: SK.light,
    head: { helmet: purifierHelmet, skin: SK.light },
    torso: armourTorso('#eef1f6', '#9aa3b3', '#c9ced8', '#e3a82b'),
    arm: () => ({ ua: '#c9ced8', fa: '#eef1f6', cuff: '#9aa3b3', hand: '#9aa3b3' }),
    leg: () => ({ th: '#eef1f6', sh: '#eef1f6', knee: '#9aa3b3', foot: '#c9ced8', sole: '#7a8394' }),
    pauldrons: 'purifier',
  },
  purifierElite: {
    dims: { torso: 170, sw: 84, waist: 58, hw: 56, uaW: 31, faW: 27, thW: 40, shW: 35 }, skin: SK.light,
    head: { helmet: purifierHelmet, skin: SK.light },
    torso: armourTorso('#eef1f6', '#22252e', '#e2b84a', '#e3a82b'),
    arm: () => ({ ua: '#22252e', fa: '#eef1f6', cuff: '#e2b84a', hand: '#22252e' }),
    leg: () => ({ th: '#eef1f6', sh: '#eef1f6', knee: '#22252e', foot: '#22252e', sole: '#7a8394' }),
    pauldrons: 'purifier',
  },
  examiner: {
    dims: { torso: 166, sw: 86, waist: 64, hw: 56, uaW: 32, faW: 28, thW: 40, shW: 34 }, skin: '#e8c4a8',
    head: { hair: 'crew', hairColor: '#3a3a40', eyes: '#4a3022', skin: '#e8c4a8', scarBrow: true },
    torso: plainTorso('#f4f4f6', (L) => path(`M0,${-L + 4} L0,-6`, { stroke: '#d4a93a', strokeWidth: 3 }) + rect(-60, -10, 120, 10, { fill: '#3a3a40' }) + rect(18, -14, 18, 18, { fill: '#2a2a30' }) + path(`M-34,${-L + 6} l20,0 M14,${-L + 6} l20,0`, { stroke: '#d4a93a', strokeWidth: 6 })),
    arm: () => ({ ua: '#f4f4f6', fa: '#f4f4f6', cuff: '#d4a93a' }),
    leg: () => ({ th: '#2e3038', sh: '#2e3038', foot: '#16161a', sole: '#333' }),
  },
  aegis: {
    dims: { torso: 162, sw: 80 }, skin: SK.light,
    head: { hair: 'crew', hairColor: '#2a2420', eyes: '#3a2a20', skin: SK.light },
    torso: plainTorso('#f4f4f6', (L) => path(`M0,${-L + 4} L0,-6`, { stroke: '#d4a93a', strokeWidth: 3 }) + rect(-60, -10, 120, 10, { fill: '#3a3a40' }) + path(`M-34,${-L + 6} l20,0 M14,${-L + 6} l20,0`, { stroke: '#d4a93a', strokeWidth: 6 })),
    arm: () => ({ ua: '#f4f4f6', fa: '#f4f4f6', cuff: '#d4a93a' }),
    leg: () => ({ th: '#2e3038', sh: '#2e3038', foot: '#16161a', sole: '#333' }),
  },
  tech: {
    dims: {}, skin: SK.light,
    head: { hair: 'short', hairColor: '#5a4030', eyes: '#3a2a20', skin: SK.light },
    torso: plainTorso('#e9edf3', (L) => rect(-60, -L * 0.7, 120, 6, { fill: '#7cc4ef' })),
    arm: () => ({ ua: '#e9edf3', fa: '#e9edf3', cuff: '#7cc4ef' }),
    leg: () => ({ th: '#3a3e4a', sh: '#3a3e4a', foot: '#16161a', sole: '#333' }),
  },
  candidate: {
    dims: {}, skin: SK.light,
    head: { hair: 'short', hairColor: '#3a2a20', eyes: '#3a2a20', skin: SK.light },
    torso: plainTorso('#8aa0b8'),
    arm: () => ({ ua: '#8aa0b8', fa: '#8aa0b8', cuff: '#6a8098' }),
    leg: () => ({ th: '#4a4a56', sh: '#4a4a56', foot: '#222', sole: '#ddd' }),
  },
  oldman: {
    dims: { torso: 150, sw: 64, waist: 48, hw: 46, uaW: 22, faW: 19, thW: 28, shW: 24 }, skin: '#d9b49a',
    head: { hair: 'balding', hairColor: '#b8b4ae', eyes: '#3a2a20', skin: '#d9b49a' },
    torso: plainTorso('#7a7466', (L) => path(`M-20,${-L * 0.6} l8,10 l-4,6 M16,${-L * 0.3} l8,8`, OL(2))),
    arm: () => ({ ua: '#7a7466', fa: '#d9b49a', cuff: '#5a5446' }),
    leg: () => ({ th: '#4a3e30', sh: '#4a3e30', foot: '#2a2018', sole: '#2a2018' }),
  },
  boy: {
    dims: { torso: 100, sw: 48, waist: 38, hw: 36, ua: 64, fa: 60, th: 86, sh: 84, headR: 40, uaW: 18, faW: 16, thW: 22, shW: 19 }, skin: '#e2bfa0',
    head: { hair: 'messy', hairColor: '#4a3020', eyes: '#3a2a20', skin: '#e2bfa0' },
    torso: plainTorso('#8a6a4a', (L) => path(`M-10,${-L * 0.6} l8,8`, OL(2))),
    arm: () => ({ ua: '#e2bfa0', fa: '#e2bfa0', cuff: '#e2bfa0' }),
    leg: (st, side) => (side === 'left' ? { th: '#5a4a3a', sh: '#8a5a34', foot: '#6a4a2a', sole: '#3a2a1a', metal: true } : { th: '#5a4a3a', sh: '#e2bfa0', foot: '#e2bfa0', sole: '#c9a080' }),
  },
  thug: {
    dims: { torso: 166, sw: 86, waist: 64, hw: 58, uaW: 32, faW: 28, thW: 40, shW: 34 }, skin: '#c9a48a',
    head: { hair: 'crew', hairColor: '#1a1414', eyes: '#3a2a20', skin: '#c9a48a' },
    torso: leatherCoatTorso('#c0172a'),
    arm: () => ({ ua: '#1b1a20', fa: '#1b1a20', cuff: '#2a2830' }),
    leg: () => ({ th: '#2a2830', sh: '#2a2830', foot: '#16141a', sole: '#333' }),
    skirt: () => ({ color: '#1b1a20', len: 150 }),
  },
  thugBoss: {
    dims: { torso: 180, sw: 104, waist: 80, hw: 70, ua: 108, fa: 102, uaW: 40, faW: 36, thW: 48, shW: 42 }, skin: '#b8907a',
    head: { hair: 'bald', hairColor: '#1a1414', eyes: '#3a2a20', skin: '#b8907a' },
    torso: leatherCoatTorso('#c0172a'),
    arm: () => ({ ua: '#1b1a20', fa: '#1b1a20', cuff: '#2a2830' }),
    leg: () => ({ th: '#2a2830', sh: '#2a2830', foot: '#16141a', sole: '#333' }),
    skirt: () => ({ color: '#1b1a20', len: 160 }),
  },
  raze: {
    dims: { torso: 164, sw: 70, waist: 48, hw: 52, ua: 100, fa: 94, th: 148, sh: 142, uaW: 25, faW: 22, thW: 34, shW: 29 }, skin: '#f0d8cc',
    head: { hair: 'raze', hairColor: '#121117', eyes: '#d81e2c', skin: '#f0d8cc', mask: 'jaw' },
    torso: razeTorso,
    arm: () => ({ ua: '#17161c', fa: '#17161c', cuff: '#3a3540', hand: '#121117' }),
    leg: () => ({ th: '#1c1b21', sh: '#1c1b21', foot: '#0f0e12', sole: '#333' }),
    skirt: (st) => ({ color: '#17161c', len: 190, burnt: st.coatBurnt }),
  },
  revenant: {
    dims: { torso: 150, sw: 62, waist: 44, hw: 44, uaW: 22, faW: 19, thW: 28, shW: 24 }, skin: '#9aa08a',
    head: { hair: 'balding', hairColor: '#5a5a50', eyes: '#c9c48a', skin: '#9aa08a', stitches: 'M10,-30 l20,30 l-10,20 M14,-24 l6,-2 M20,-12 l6,-2' },
    torso: plainTorso('#4a4438', (L) => path(`M-20,${-L * 0.6} l8,10 l-4,6`, OL(2))),
    arm: () => ({ ua: '#4a4438', fa: '#9aa08a', cuff: '#3a342a' }),
    leg: () => ({ th: '#3a342a', sh: '#3a342a', foot: '#2a2420', sole: '#222' }),
  },
  merchant: {
    dims: { torso: 156, sw: 76, waist: 64, hw: 58, uaW: 30, faW: 26, thW: 36, shW: 30 }, skin: '#c9b08a',
    head: { hair: 'crew', hairColor: '#4a3a2a', eyes: '#3a2a20', skin: '#c9b08a' },
    torso: plainTorso('#5a5a4a', (L) => path(`M-26,${-L + 20} L26,${-L + 20} L30,-4 L-30,-4Z`, { fill: '#8a7a5a', stroke: INK, strokeWidth: 2 })),
    arm: () => ({ ua: '#5a5a4a', fa: '#c9b08a', cuff: '#4a4a3a' }),
    leg: () => ({ th: '#3a3a30', sh: '#3a3a30', foot: '#222', sole: '#222' }),
  },
  oldmerchant: {
    dims: { torso: 150, sw: 66, waist: 52, hw: 48, uaW: 24, faW: 20, thW: 30, shW: 26 }, skin: '#b8a48a',
    head: { hair: 'balding', hairColor: '#cfcac2', eyes: '#3a2a20', skin: '#b8a48a', stitches: 'M-20,20 l12,8 M-16,18 l-2,6' },
    torso: plainTorso('#6a5a4a'),
    arm: () => ({ ua: '#6a5a4a', fa: '#b8a48a', cuff: '#4a3a2a' }),
    leg: () => ({ th: '#3a3028', sh: '#3a3028', foot: '#222', sole: '#222' }),
  },
  guard: {
    dims: {}, skin: '#a8a08a',
    head: { hair: 'short', hairColor: '#2a2a2a', eyes: '#3a3a2a', skin: '#a8a08a' },
    torso: plainTorso('#3a3e44'),
    arm: () => ({ ua: '#3a3e44', fa: '#3a3e44', cuff: '#2a2e34' }),
    leg: () => ({ th: '#2a2e34', sh: '#2a2e34', foot: '#16161a', sole: '#333' }),
  },
  patient: {
    dims: {}, skin: '#b9b09a',
    head: { hair: 'short', hairColor: '#6a5a40', eyes: '#3a3a2a', skin: '#b9b09a', stitches: 'M-24,-20 l10,10 M-26,-14 l6,-2' },
    torso: (L, D) => rect(-60, -L - 20, 120, L + 40, { fill: '#b9b09a' }) + path(`M-16,${-L * 0.8} L16,${-L * 0.8} L18,${-L * 0.4} L-18,${-L * 0.4}Z`, { fill: '#7a1a24', stroke: INK, strokeWidth: 2 }) + path(`M-14,${-L * 0.72} h28 M-14,${-L * 0.62} h28 M-14,${-L * 0.52} h28`, { stroke: '#e8d0c0', strokeWidth: 3 }) + rect(-60, -L * 0.3, 120, L, { fill: '#5a6a7a' }),
    arm: () => ({ ua: '#b9b09a', fa: '#b9b09a', cuff: '#b9b09a' }),
    leg: () => ({ th: '#5a6a7a', sh: '#5a6a7a', foot: '#b9b09a', sole: '#b9b09a' }),
  },
};

// ---------- limb drawing ----------
function strokeSeg(a, b, w, color) { return path(`M${P(a)} L${P(b)}`, { stroke: color, strokeWidth: w, strokeLinecap: 'round', fill: 'none' }); }

function drawArm(def, D, st, j, which, anatSide, propSpec, detachTo) {
  const sh = detachTo || j['sh' + which], el = j['el' + which], hd = j['hd' + which];
  let elP = el, hdP = hd;
  if (detachTo) { const dx = detachTo[0] - j['sh' + which][0], dy = detachTo[1] - j['sh' + which][1]; elP = [el[0] + dx, el[1] + dy]; hdP = [hd[0] + dx, hd[1] + dy]; }
  const c = def.arm(st, anatSide);
  if (c.hidden) return '';
  const wU = D.uaW * (c.stone ? 1.5 : 1), wF = D.faW * (c.stone ? 1.6 : 1);
  const o = [];
  o.push(path(`M${P(sh)} L${P(elP)} L${P(hdP)}`, { stroke: INK, strokeWidth: Math.max(wU, wF) + 6, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }));
  o.push(strokeSeg(sh, elP, wU, c.ua));
  o.push(strokeSeg(elP, hdP, wF, c.fa));
  const ang = (Math.atan2(hdP[1] - elP[1], hdP[0] - elP[0]) * 180) / Math.PI;
  const angU = (Math.atan2(elP[1] - sh[1], elP[0] - sh[0]) * 180) / Math.PI;
  if (c.stripe) o.push(strokeSeg(pt(sh, angU, 6), pt(elP, angU, -6), 3, c.stripe));
  o.push(strokeSeg(pt(hdP, ang, -16), pt(hdP, ang, -7), wF + 1, c.cuff));
  if (c.burnt) o.push(strokeSeg(pt(sh, angU, 10), pt(elP, angU, -10), wU * 0.4, '#ff6a2a') + strokeSeg(pt(elP, ang, 10), pt(hdP, ang, -20), wF * 0.3, '#c03a1a'));
  if (c.bandage) for (let t = 0.2; t < 1; t += 0.2) { const p = [sh[0] + (elP[0] - sh[0]) * t, sh[1] + (elP[1] - sh[1]) * t]; o.push(strokeSeg(pt(p, angU + 90, -wU / 2), pt(p, angU + 90, wU / 2), 2, '#b8b0a4')); }
  if (c.wound) o.push(strokeSeg(pt(sh, angU, 14), pt(elP, angU, -18), wU * 0.5, '#9a1422') + strokeSeg(pt(sh, angU, 18), pt(elP, angU, -22), 3, '#3fe08a'));
  if (c.scorch) o.push(strokeSeg(pt(elP, ang, 8), pt(hdP, ang, -22), wF * 0.5, '#3a2618'));
  if (c.stitch) o.push(path(`M${P(pt(sh, angU + 90, -wU / 2 - 2))} L${P(pt(sh, angU + 90, wU / 2 + 2))}`, { stroke: '#2a1e2e', strokeWidth: 2.4 }) + path([0.25, 0.5, 0.75].map((t) => `M${P(pt(pt(sh, angU + 90, -wU / 2 + wU * t), angU, -4))} l${f(Math.cos((angU * Math.PI) / 180) * 8)},${f(Math.sin((angU * Math.PI) / 180) * 8)}`).join(' '), { stroke: '#2a1e2e', strokeWidth: 1.6 }));
  if (c.metal) o.push(strokeSeg(pt(elP, ang, 4), pt(hdP, ang, -14), wF * 0.36, '#6a707a') + path(`M${P(pt(elP, ang, 20))} l${f(Math.cos(((ang + 90) * Math.PI) / 180) * 8)},${f(Math.sin(((ang + 90) * Math.PI) / 180) * 8)}`, { stroke: '#3a3e46', strokeWidth: 2 }));
  if (c.stone) for (let t = 0.25; t < 1; t += 0.3) { const p = [sh[0] + (hdP[0] - sh[0]) * t, sh[1] + (hdP[1] - sh[1]) * t]; o.push(path(`M${P(pt(p, ang + 90, -10))} l6,8 l-4,6`, OL(2))); }
  if (c.bandaged) o.push(strokeSeg(pt(hdP, ang, -6), pt(hdP, ang, 4), wF + 2, '#d8cfbf'));
  const handC = c.hand || def.skin;
  o.push(circle(hdP[0], hdP[1], D.handR * (c.stone ? 1.7 : 1), { fill: handC, stroke: INK, strokeWidth: 3 }));
  if (c.blades) o.push(path(`M${P(hdP)} l${f(Math.cos((ang * Math.PI) / 180) * 34)},${f(Math.sin((ang * Math.PI) / 180) * 34)}`, { stroke: '#dfe3ea', strokeWidth: 2.4 }) + path(`M${P(pt(hdP, ang + 30, 8))} l${f(Math.cos(((ang + 10) * Math.PI) / 180) * 30)},${f(Math.sin(((ang + 10) * Math.PI) / 180) * 30)}`, { stroke: '#dfe3ea', strokeWidth: 2.4 }));
  if (propSpec) {
    const ps = typeof propSpec === 'string' ? { n: propSpec } : propSpec;
    const pa = ps.a !== undefined ? ps.a : ang;
    o.push(g(prop(ps.n, ps), { transform: `translate(${f(hdP[0])},${f(hdP[1])}) rotate(${f(pa)}) scale(${ps.s || 1})` }));
    o.push(circle(hdP[0], hdP[1], D.handR * 0.9, { fill: handC, stroke: INK, strokeWidth: 2.5 }));
  }
  return o.join('');
}

function drawLeg(def, D, st, j, which, anatSide) {
  const hp = j['hp' + which], kn = j['kn' + which], ft = j['ft' + which];
  const c = def.leg(st, anatSide);
  const o = [];
  o.push(path(`M${P(hp)} L${P(kn)} L${P(ft)}`, { stroke: INK, strokeWidth: D.thW + 6, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }));
  o.push(strokeSeg(hp, kn, D.thW, c.th));
  o.push(strokeSeg(kn, ft, D.shW, c.sh));
  if (c.knee) o.push(circle(kn[0], kn[1], D.shW * 0.55, { fill: c.knee, stroke: INK, strokeWidth: 2.5 }));
  if (c.metal) o.push(strokeSeg(kn, ft, 6, '#5a3a20'));
  const shAng = (Math.atan2(ft[1] - kn[1], ft[0] - kn[0]) * 180) / Math.PI;
  const fd = shAng - 90;
  const toe = pt(ft, fd, 30), back = pt(ft, fd, -10);
  o.push(path(`M${P(back)} L${P(toe)}`, { stroke: INK, strokeWidth: 24, strokeLinecap: 'round' }));
  o.push(path(`M${P(back)} L${P(toe)}`, { stroke: c.foot, strokeWidth: 18, strokeLinecap: 'round' }));
  o.push(path(`M${P(pt(back, fd + 90, 7))} L${P(pt(toe, fd + 90, 7))}`, { stroke: c.sole, strokeWidth: 4, strokeLinecap: 'round' }));
  if (c.heel) o.push(strokeSeg(pt(back, fd + 90, 6), pt(back, fd + 90, 20), 5, '#222'));
  return o.join('');
}

// ---------- main figure ----------
const META = [];
function figure(spec) {
  if (C2[spec.c]) { const r = C2[spec.c](spec); META.push({ c: spec.c, id: spec.id || spec.c, head: r.head.map(Math.round), r: Math.round(r.r) }); return clipWrap(spec.opacity ? g(r.svg, { opacity: spec.opacity }) : r.svg, spec.clip); }
  if (spec.c === 'creature') { META.push({ c: 'creature', id: spec.id || 'creature', head: [spec.x || 0, (spec.y || 0) - 100], r: 50 }); return require('./creature').creature(spec); }
  const def = CHARS[spec.c];
  if (!def) throw new Error('unknown character ' + spec.c);
  const st = { ...(def.defaults || {}), ...(spec.st || {}) };
  const basePose = typeof spec.pose === 'object' ? spec.pose : POSES[spec.pose || 'stand'];
  if (!basePose) throw new Error('unknown pose ' + spec.pose);
  const pose = { ...basePose, ...(spec.po || {}) };
  const dm = { ...DEFAULT_DIMS, ...def.dims, ...(spec.dims || {}) };
  for (const k of ['sw', 'waist', 'hw', 'uaW', 'faW', 'thW', 'shW']) dm[k] *= 1.16;
  dm.headR *= 1.25; dm.handR *= 1.15;
  const rig = computeRig(pose, dm);
  const { j, D } = rig;
  const face = spec.face || 'r';
  const si = sideInfo(face);
  const near = si.nearSide, far = near === 'right' ? 'left' : 'right';
  const props = spec.props || {};
  const anat = (k) => (k === 'n' ? near : far);
  const propFor = (k) => props[k] || props[anat(k)];
  const det = spec.detach || {};
  const detTo = (k) => (det.arm === k || det.arm === anat(k) ? det.to : null);

  const L = D.torso;
  const torsoT = `translate(${f(j.hip[0])},${f(j.hip[1])}) rotate(${f(rig.T + 90)})`;
  const headT = `translate(${f(j.head[0])},${f(j.head[1])}) rotate(${f(rig.headAng + 90)}) scale(${D.headR / 44})`;
  const H = head(def.headFor ? def.headFor(st) : st.hair ? { ...def.head, hair: st.hair } : def.head, spec.expr, si.front ? 'front' : 'side', { ...st, coverFar: near === 'right', ...(spec.exprOverride ? { exprOverride: spec.exprOverride } : {}), ...(spec.lipBlood ? { lipBlood: true } : {}) });

  const clip = id('tc');
  const parts = [];
  parts.push(`<defs><clipPath id="${clip}"><path d="${torsoShape(D)}"/></clipPath></defs>`);
  // behind layers
  if (def.cape) parts.push(g(path(`M${-D.sw / 2},${-L + 6} L${D.sw / 2},${-L + 6} L${D.sw / 2 + 50},${60} L${D.sw / 2 + 30},${80} L${D.sw / 2 + 10},${54} L10,${96} L-12,${60} L-30,${100} L${-D.sw / 2 - 40},${70}Z`, { fill: def.cape, stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' }), { transform: torsoT }));
  if (H.behind) parts.push(g(H.behind, { transform: headT }));
  if (def.sack) parts.push(g(ellipse(-D.sw * 0.5, -L * 0.6, 34, 46, { fill: '#8a7a5a', stroke: INK, strokeWidth: 3 }) + path(`M${-D.sw * 0.5 - 10},${-L * 0.6 - 40} l-8,-30 l14,4 M${-D.sw * 0.5 + 10},${-L * 0.6 - 40} l12,-24`, { stroke: INK, strokeWidth: 3, fill: '#b9bcc4' }), { transform: torsoT }));
  if (def.under) parts.push(g(def.under(L, D, st, si), { transform: torsoT }));
  if (st.backSword) parts.push(g(g(prop('sheathed'), { transform: `translate(${f(D.sw * 0.62)},${f(-L - 74)}) rotate(118) scale(1.6)` }), { transform: torsoT }));
  if (def.pauldrons) parts.push(g(pauldronFor(def, L, D, st, false, si), { transform: torsoT }));
  parts.push(drawArm(def, D, st, j, 'F', far, propFor('f'), detTo('f')));
  parts.push(drawLeg(def, D, st, j, 'F', far));
  parts.push(drawLeg(def, D, st, j, 'N', near));
  const sk = def.skirt ? def.skirt(st) : null;
  if (sk && !sk.front) parts.push(g(skirt(D, sk), { transform: torsoT }));
  // torso + neck
  parts.push(g(path(`M-12,${-L + 4} L-12,${-L - 30} L12,${-L - 30} L12,${-L + 4}Z`, { fill: def.skin, stroke: INK, strokeWidth: 3 }), { transform: torsoT }));
  parts.push(g(g(def.torso(L, D, st, si, def.skin), { clipPath: `url(#${clip})` }) + path(torsoShape(D), { fill: 'none', stroke: INK, strokeWidth: 3.2, strokeLinejoin: 'round' }) + (def.over ? def.over(L, D, st, si) : '') + (def.belt ? def.belt(D, L) : ''), { transform: torsoT }));
  if (sk && sk.front) parts.push(g(skirt(D, sk), { transform: torsoT }));
  if (def.threads) parts.push(g(threadRings(D, L), { transform: torsoT }));
  parts.push(g(H.head + (st.headlamp ? headlamp() : ''), { transform: headT }));
  if (detTo('n') || detTo('f')) {
    const k = detTo('n') ? 'N' : 'F';
    const s0 = j['sh' + k], s1 = det.to;
    const mid = [(s0[0] + s1[0]) / 2 + (det.bend || 0), (s0[1] + s1[1]) / 2 - 40];
    parts.push(path(`M${P(s0)} Q${P(mid)} ${P(s1)}`, { stroke: '#ff2a3a', strokeWidth: 10, fill: 'none', opacity: 0.35 }) + path(`M${P(s0)} Q${P(mid)} ${P(s1)}`, { stroke: '#ff5a5a', strokeWidth: 3.5, fill: 'none' }) + circle(s0[0], s0[1], 10, { fill: '#ff3a4a', stroke: INK, strokeWidth: 2 }));
  }
  if (def.pauldrons) parts.push(g(pauldronFor(def, L, D, st, true, si), { transform: torsoT }));
  parts.push(drawArm(def, D, st, j, 'N', near, propFor('n'), detTo('n')));
  if (def.spike) parts.push(g(path(`M${D.sw * 0.2},${-L + 2} L${D.sw * 0.55},${-L - 8} L${D.sw * 0.42},${-L - 30} L${D.sw * 0.6},${-L - 14} L${D.sw * 0.66},${-L - 36} L${D.sw * 0.72},${-L - 6} L${D.sw * 0.6},${-L + 20}Z`, { fill: '#5b5852', stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' }), { transform: torsoT }));
  if (spec.c === 'raze') parts.push(g(razeBlade(D, L, near === 'right', st), { transform: torsoT }));

  // anchor
  let anchor;
  const a = spec.anchor || 'feet';
  if (a === 'head') anchor = j.head;
  else if (a === 'chest') anchor = [(j.neck[0] + j.hip[0]) / 2, (j.neck[1] + j.hip[1]) / 2];
  else if (a === 'hip') anchor = j.hip;
  else if (j[a]) anchor = j[a];
  else {
    const cands = [[j.ftN, 14], [j.ftF, 14], [j.knN, 18], [j.knF, 18], [j.hip, 22], [j.hdN, 12], [j.hdF, 12], [j.head, 46], [j.neck, 30]];
    let maxY = -1e9; for (const [p, r] of cands) maxY = Math.max(maxY, p[1] + r);
    anchor = [j.hip[0], maxY];
  }
  const s = spec.s || 1, m = si.mir ? -1 : 1;
  const hx = (spec.x || 0) + s * m * (j.head[0] - anchor[0]), hy = (spec.y || 0) + s * (j.head[1] - anchor[1]);
  META.push({ c: spec.c, id: spec.id || spec.c, head: [Math.round(hx), Math.round(hy)], r: Math.round(D.headR * s) });
  const tf = `translate(${f(spec.x || 0)},${f(spec.y || 0)}) rotate(${spec.rot || 0}) scale(${f(s * m * 1000) / 1000},${s}) translate(${f(-anchor[0])},${f(-anchor[1])})`;
  let inner = parts.join('');
  if (spec.sil) inner = `<g style="filter:url(#silF)">${inner}</g>`;
  if (spec.porcelain) inner = `<g style="filter:url(#porcF)">${inner}</g>`;
  const out = g(inner, { transform: tf, opacity: spec.opacity, fill: undefined, class: spec.sil ? 'sil' : undefined, style: spec.sil ? `--sil:${spec.sil}` : undefined, filter: spec.blur ? 'url(#blurF)' : undefined });
  return clipWrap(out, spec.clip);
}

// spec.clip = [x, y, w, h] in panel coordinates: show only that part of the
// figure (half-bodies, figures emerging from smoke / behind rubble).
function clipWrap(svg, c) {
  if (!c) return svg;
  const cid = id('fc');
  return `<defs><clipPath id="${cid}"><rect x="${c[0]}" y="${c[1]}" width="${c[2]}" height="${c[3]}"/></clipPath></defs>` + g(svg, { clipPath: `url(#${cid})` });
}

function pauldronFor(def, L, D, st, nearOne, si) {
  const anatSide = nearOne ? si.nearSide : (si.nearSide === 'right' ? 'left' : 'right');
  if (def.pauldrons === true) return pauldron(L, D, st, nearOne, si, st.shoulderBroken && anatSide === 'right');
  const x = nearOne ? D.sw * 0.32 : -D.sw * 0.32, dir = nearOne ? 1 : -1;
  const col = def.pauldrons === 'metal' ? '#a9afb9' : def.pauldrons === 'vale' ? '#e4e6ec' : '#eef1f6';
  const trim = def.pauldrons === 'vale' ? '#8a8f9c' : def.pauldrons === 'metal' ? '#5a606a' : '#e3a82b';
  return path(`M${x - 20 * dir},${-L + 6} C${x - 10 * dir},${-L - 18} ${x + 30 * dir},${-L - 14} ${x + 30 * dir},${-L + 16} L${x + 22 * dir},${-L + 26} L${x - 8 * dir},${-L + 20}Z`, { fill: col, stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' }) +
    path(`M${x - 12 * dir},${-L + 2} C${x - 4 * dir},${-L - 10} ${x + 22 * dir},${-L - 8} ${x + 24 * dir},${-L + 12}`, { stroke: trim, strokeWidth: 3, fill: 'none' }) +
    (def.pauldrons === 'vale' ? path(`M${x},${-L - 6} l${8 * dir},10 l${-4 * dir},8`, OL(2)) : '');
}

function skirt(D, sk) {
  const w = D.hw / 2 + 8;
  let d;
  if (sk.burnt) d = `M${-w},-14 L${w},-14 L${w + 16},${sk.len * 0.5} L${w - 10},${sk.len * 0.4} L${w - 20},${sk.len * 0.6} L0,${sk.len * 0.45} L${-w - 14},${sk.len}Z`;
  else d = `M${-w},-14 L${w},-14 L${w + 18},${sk.len} L${w - 14},${sk.len - 6} L${-w + 10},${sk.len - 4} L${-w - 16},${sk.len}Z`;
  return path(d, { fill: sk.color, stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' }) +
    (sk.trim ? path(`M${-w + 2},-10 L${-w - 12},${sk.len - 4} M${w - 2},-10 L${w + 14},${sk.len - 4}`, { stroke: sk.trim, strokeWidth: 3 }) : '') +
    path(`M0,0 L${sk.burnt ? 0 : 2},${sk.len * 0.8}`, { stroke: '#000', strokeWidth: 2, opacity: 0.2 }) +
    (sk.burnt ? path(`M${w - 10},${sk.len * 0.4} q10,-20 0,-40`, { stroke: '#ff8a2a', strokeWidth: 6, fill: 'none', opacity: 0.8 }) : '');
}

function threadRings(D, L) {
  const o = [];
  for (const x of [-D.sw * 0.44, D.sw * 0.44]) o.push(path(`M${x - 8},${-L + 4} q8,10 0,22`, { fill: 'none', stroke: '#ff2a3a', strokeWidth: 2.2, opacity: 0.8, strokeDasharray: '4 3' }));
  return o.join('');
}

function headlamp() {
  return path('M-42,-26 Q0,-44 44,-30', { stroke: '#2a2a30', strokeWidth: 6, fill: 'none' }) + rect(26, -44, 18, 14, { fill: '#5a5a62', stroke: INK, strokeWidth: 2 }) + circle(44, -37, 5, { fill: '#fffbd0' });
}

function razeBlade(D, L, rightNear, st) {
  if (st.bladeDrawn) return '';
  const x = rightNear ? D.sw * 0.36 : -D.sw * 0.36, dir = rightNear ? 1 : -1;
  return path(`M${x},${-L + 4} C${x + 40 * dir},${-L - 30} ${x + 60 * dir},${-L + 30} ${x + 30 * dir},${-L + 90} C${x + 34 * dir},${-L + 40} ${x + 20 * dir},${-L + 10} ${x},${-L + 20}Z`, { fill: '#24232b', stroke: INK, strokeWidth: 3 }) + path(`M${x + 8 * dir},${-L + 4} C${x + 38 * dir},${-L - 14} ${x + 48 * dir},${-L + 30} ${x + 30 * dir},${-L + 80}`, { stroke: '#8b8e99', strokeWidth: 2, fill: 'none' });
}

Object.assign(CHARS, require('./cast2')({ SK, OL, coatTorso, plainTorso, armourTorso, leatherCoatTorso }));
Object.assign(CHARS, require('./cast3')({ SK, OL, purifierHelmet }));
Object.assign(CHARS, require('./cast4')({ SK, OL, coatTorso, purifierHelmet, CHARS }));
Object.assign(CHARS, require('./cast5')({ CHARS }));
const C2 = { ...require('./creature2'), ...require('./creature3'), ...require('./creature4'), ...require('./creature5') };

module.exports = { figure, CHARS, sideInfo, META };
