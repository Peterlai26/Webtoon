// Cast introduced in EP46-65 (source chapters 46-65): the two Honourables first
// seen at the One-Face siege (Sir Kinesis "K", Captain Rail "R"), the six
// lieutenants ("right-hand generals"), Mono the true Origin, and the
// state-flag extras needed for Grimm, Draken and the One-Face clones.
// Same rules as CHARS in figure.js: one definition per character; design
// choices for unstated details are recorded in docs/02-character-reference.md.
'use strict';
const { INK, path, circle, ellipse, rect } = require('./util');

module.exports = function cast5(h) {
  const { CHARS } = h;
  const GOLD = '#e2b84a';
  const fem = { torso: 152, sw: 64, waist: 44, hw: 50, ua: 94, fa: 88, th: 140, sh: 136, uaW: 23, faW: 20, thW: 32, shW: 27 };
  const big = { torso: 220, sw: 124, waist: 92, hw: 84, ua: 128, fa: 122, th: 184, sh: 176, uaW: 44, faW: 40, thW: 52, shW: 46, handR: 18 };

  // ---------- Sir Kinesis, Letter K (ch.49 L30, ch.57 L22): steel plate, kinetic-absorbing gauntlets ----------
  const kinesisTorso = (L, D, st) => rect(-60, -L - 20, 120, L + 40, { fill: '#7e8592' }) +
    path(`M-46,${-L + 6} L46,${-L + 6} L40,${-L * 0.4} L-40,${-L * 0.4}Z`, { fill: '#5a606c', stroke: INK, strokeWidth: 3 }) +
    path(`M-36,${-L * 0.36} L36,${-L * 0.36} L30,-8 L-30,-8Z`, { fill: '#6a707c', stroke: INK, strokeWidth: 2.4 }) +
    circle(0, -L * 0.66, 12, { fill: 'none', stroke: '#ffd45a', strokeWidth: 3 }) + rect(-60, -10, 120, 12, { fill: '#3a3e48' }) +
    (st.charged ? rect(-60, -L - 20, 120, L + 40, { fill: '#ffd45a', opacity: 0.16 }) : '');

  // ---------- Captain Rail, Letter R (ch.55 L38, ch.60 L41): short navy hair, quantum scope over the right eye, white coat ----------
  const scope = path('M8,-22 L52,-24 L52,-2 L8,-4Z', { fill: '#2a2e3a', stroke: INK, strokeWidth: 2 }) + circle(20, -4, 13, { fill: '#7ae6ff', opacity: 0.85, stroke: INK, strokeWidth: 2.4 }) + circle(20, -4, 5, { fill: '#ff3a4a' });
  const railTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#f2f2ee' }) + path(`M-14,${-L + 2} L0,${-L * 0.45} L14,${-L + 2}`, { stroke: '#9aa0aa', strokeWidth: 3, fill: 'none' }) +
    [0.66, 0.5, 0.34].map((y) => circle(-12, -L * y, 3, { fill: GOLD }) + circle(12, -L * y, 3, { fill: GOLD })).join('') + rect(-60, -10, 120, 10, { fill: '#2a2e3a' }) + path(`M-50,${-L + 4} l20,0`, { stroke: GOLD, strokeWidth: 4 });

  // ---------- lieutenants ----------
  const valkorTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#5a5e6a' }) + path(`M-40,${-L * 0.7} C-20,${-L * 0.9} -6,${-L * 0.6} 0,${-L * 0.5} C6,${-L * 0.6} 20,${-L * 0.9} 40,${-L * 0.7} L30,${-L * 0.5} L0,${-L * 0.3} L-30,${-L * 0.5}Z`, { fill: '#8a909c', stroke: INK, strokeWidth: 2.4 }) + rect(-60, -10, 120, 12, { fill: '#2a2c34' });
  const sadisTorso = (L, D, st, si, skin) => rect(-60, -L - 20, 120, L + 40, { fill: '#ece8e0' }) + path(`M-20,${-L * 0.6} q8,10 2,22 M18,${-L * 0.3} q-6,12 4,20 M-30,${-L * 0.2} q10,4 8,14`, { stroke: '#9a101c', strokeWidth: 6, fill: 'none', opacity: 0.8 }) + path(`M-50,${-L * 0.5} L50,${-L * 0.5}`, { stroke: '#b9b4aa', strokeWidth: 4 });
  const gargoyleTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#4a4048' }) + path(`M-50,${-L + 4} L50,${-L * 0.3} M50,${-L + 4} L-50,${-L * 0.3}`, { stroke: '#2a2428', strokeWidth: 12 }) + rect(-60, -14, 120, 14, { fill: GOLD });
  const vesperTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#0e0d12' }) + path(`M-30,${-L + 8} Q0,${-L + 26} 30,${-L + 8} M-26,${-L * 0.45} L26,${-L * 0.45}`, { stroke: '#2a2830', strokeWidth: 3, fill: 'none' }) + rect(-60, -10, 120, 8, { fill: '#3a0a14' });
  const centurionTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#e8e8ec' }) + path(`M-46,${-L + 6} L46,${-L + 6} L40,${-L * 0.4} L-40,${-L * 0.4}Z`, { fill: '#c9ced8', stroke: INK, strokeWidth: 3 }) + path(`M-30,${-L * 0.7} L30,${-L * 0.7}`, { stroke: '#9aa0aa', strokeWidth: 3 }) + rect(-60, -10, 120, 12, { fill: '#9aa0aa' });
  const voltageTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#3a3e4a' }) + path(`M-40,${-L + 6} L40,${-L + 6} L34,${-L * 0.5} L-34,${-L * 0.5}Z`, { fill: '#e8e8ec', stroke: INK, strokeWidth: 2.4 }) + path(`M-20,${-L * 0.4} l10,14 l-8,4 l12,16`, { stroke: '#ffe14a', strokeWidth: 3, fill: 'none' });
  const voltageOver = (L, D) => path(`M${-D.sw * 0.3},${-L - 10} L${-D.sw * 0.4},${-L - 90} M${D.sw * 0.3},${-L - 10} L${D.sw * 0.4},${-L - 80}`, { stroke: '#5a606a', strokeWidth: 5 }) + circle(-D.sw * 0.4, -L - 92, 6, { fill: '#ffe14a', stroke: INK, strokeWidth: 2 }) + circle(D.sw * 0.4, -L - 82, 6, { fill: '#ffe14a', stroke: INK, strokeWidth: 2 });

  const headphones = path('M-46,-6 C-50,-70 50,-74 50,-6', { stroke: '#2a2830', strokeWidth: 7, fill: 'none' }) + rect(-56, -14, 16, 34, { fill: '#1a1820', stroke: INK, strokeWidth: 2, rx: 5 }) + rect(42, -14, 16, 34, { fill: '#1a1820', stroke: INK, strokeWidth: 2, rx: 5 }) + circle(50, 2, 3, { fill: '#3ad8ff' });
  const radarEyes = rect(-34, -14, 70, 18, { fill: '#1a1c24', stroke: INK, strokeWidth: 2, rx: 8 }) + circle(-16, -5, 7, { fill: '#ffe14a' }) + circle(20, -5, 7, { fill: '#ffe14a' });
  const centHelm = (expr, side) => { const fx = side === 'front' ? 0 : 8; return path('M-44,-20 C-46,-70 46,-72 46,-20 L44,30 C30,46 -30,46 -44,30Z', { fill: '#e8e8ec', stroke: INK, strokeWidth: 3.4 }) + rect(fx - 30, -12, 60, 10, { fill: '#121117' }) + rect(fx - 26, -10, 52, 5, { fill: '#7ae6ff', opacity: 0.8 }) + path('M0,-68 L0,-20', { stroke: '#9aa0aa', strokeWidth: 6 }); };

  // the One-Face base (same as cast4 ONE): every clone, Regulus and Mono share it
  const ONE = { hair: 'short', hairColor: '#16151b', eyes: '#3a3440', skin: '#e2d2c2' };

  const defs = {
    kinesis: {
      dims: { ...big, torso: 214 }, skin: '#d8b49a',
      head: { hair: 'crew', hairColor: '#4a3a2a', eyes: '#7a808a', skin: '#d8b49a', beard: '#4a3a2a' },
      torso: kinesisTorso,
      arm: () => ({ ua: '#7e8592', fa: '#5a606c', cuff: '#ffd45a', hand: '#c9a040' }),
      leg: () => ({ th: '#5a606c', sh: '#7e8592', knee: '#ffd45a', foot: '#3a3e48', sole: '#2a2c34' }),
      pauldrons: 'metal',
    },
    rail: {
      dims: { ...fem, torso: 158, th: 148, sh: 144 }, skin: '#ecd6c6',
      head: { hair: 'bob', hairColor: '#1a2a5a', hairTip: '#1a2a5a', eyes: '#3a4a7a', skin: '#ecd6c6', hat: scope },
      torso: railTorso,
      arm: (st, side) => (side === 'right' ? { ua: '#8a909c', fa: '#5a606c', cuff: '#7ae6ff', hand: '#5a606c' } : { ua: '#f2f2ee', fa: '#f2f2ee', cuff: GOLD, hand: '#ecd6c6' }),
      leg: () => ({ th: '#2a2e3a', sh: '#2a2e3a', foot: '#121117', sole: GOLD }),
      skirt: () => ({ color: '#f2f2ee', len: 170, trim: GOLD }),
    },
    valkor: {
      dims: { torso: 196, sw: 100, waist: 74, hw: 68, ua: 116, fa: 110, th: 168, sh: 162, uaW: 36, faW: 32, thW: 44, shW: 38 }, skin: '#d8b8a0',
      head: { hair: 'wild', hairColor: '#8a909c', eyes: '#d08a20', skin: '#d8b8a0', stitches: 'M-30,-20 l18,30' },
      torso: valkorTorso,
      arm: () => ({ ua: '#5a5e6a', fa: '#8a909c', cuff: '#7ae6ff', hand: '#5a5e6a' }),
      leg: () => ({ th: '#5a5e6a', sh: '#8a909c', knee: '#7ae6ff', foot: '#3a3e48', sole: '#2a2c34' }),
      pauldrons: 'metal',
    },
    sadis: {
      dims: { torso: 176, sw: 60, waist: 40, hw: 44, ua: 110, fa: 104, th: 160, sh: 154, uaW: 19, faW: 16, thW: 24, shW: 20 }, skin: '#e4d8cc',
      head: { hair: 'messy', hairColor: '#c9c4ba', eyes: '#a3101f', skin: '#e4d8cc', stitches: 'M-30,8 l10,4 M18,16 l12,2' },
      torso: sadisTorso,
      arm: () => ({ ua: '#ece8e0', fa: '#ece8e0', cuff: '#9a101c', hand: '#9aa0aa', blades: true }),
      leg: () => ({ th: '#ece8e0', sh: '#ece8e0', foot: '#b9b4aa', sole: '#9a101c' }),
    },
    gargoyle: {
      dims: { ...big, torso: 236, sw: 140, ua: 140, fa: 132, th: 190, sh: 182, uaW: 52, faW: 48, handR: 26 }, skin: '#c9a48a',
      head: { hair: 'bald', hairColor: '#3a2a26', eyes: '#3a2a20', skin: '#c9a48a' },
      torso: gargoyleTorso,
      arm: () => ({ ua: '#c9a48a', fa: '#5a5e6a', cuff: GOLD, hand: '#3a3e48' }),
      leg: () => ({ th: '#2a2428', sh: '#2a2428', foot: '#121012', sole: GOLD }),
    },
    vesper: {
      dims: { ...fem, torso: 150 }, skin: '#e8d2c2',
      head: { hair: 'slick', hairColor: '#0e0d12', eyes: '#a3101f', skin: '#e8d2c2', lips: '#5a1420', hat: headphones },
      torso: vesperTorso,
      arm: () => ({ ua: '#0e0d12', fa: '#0e0d12', cuff: '#3a0a14', hand: '#0e0d12' }),
      leg: () => ({ th: '#0e0d12', sh: '#0e0d12', foot: '#0a0a0e', sole: '#3a0a14' }),
    },
    centurion: {
      dims: { ...big }, skin: '#e2c4a8',
      head: { helmet: centHelm, skin: '#e2c4a8' },
      torso: centurionTorso,
      arm: () => ({ ua: '#c9ced8', fa: '#e8e8ec', cuff: '#9aa0aa', hand: '#c9ced8' }),
      leg: () => ({ th: '#e8e8ec', sh: '#c9ced8', knee: '#9aa0aa', foot: '#9aa0aa', sole: '#5a606a' }),
      pauldrons: 'purifier',
    },
    voltage: {
      dims: { torso: 168, sw: 72, waist: 52, hw: 52, uaW: 25, faW: 22, thW: 32, shW: 27 }, skin: '#e6d0be',
      head: { hair: 'crew', hairColor: '#e8d84a', eyes: '#ffe14a', skin: '#e6d0be', hat: radarEyes },
      torso: voltageTorso, over: voltageOver,
      arm: () => ({ ua: '#3a3e4a', fa: '#e8e8ec', cuff: '#ffe14a', hand: '#3a3e4a' }),
      leg: () => ({ th: '#3a3e4a', sh: '#3a3e4a', foot: '#121117', sole: '#ffe14a' }),
    },
    // ---------- Mono, the true Origin (ch.49 L80): child-sized, frail, snow-white hair, the One-Face face ----------
    mono: {
      dims: { torso: 104, sw: 48, waist: 38, hw: 40, ua: 62, fa: 58, th: 84, sh: 80, uaW: 15, faW: 13, thW: 19, shW: 16, headR: 46 }, skin: ONE.skin,
      head: { ...ONE, hair: 'messy', hairColor: '#f6f6f2' },
      headFor: (st) => ({ ...ONE, hair: 'messy', hairColor: '#f6f6f2', hat: st.blanket ? path('M-54,10 C-60,-80 60,-84 56,10 L60,60 L-60,60Z', { fill: '#c9b8a0', stroke: INK, strokeWidth: 3, opacity: 0.95 }) : undefined }),
      torso: (L, D, st) => rect(-60, -L - 20, 120, L + 40, { fill: '#f2f0ea' }) + path(`M-10,${-L + 2} L0,${-L + 12} L10,${-L + 2}`, { stroke: '#c9ced8', strokeWidth: 2.4, fill: 'none' }) +
        (st.core ? circle(0, -L * 0.6, 22, { fill: '#ffffff', stroke: '#dff4ff', strokeWidth: 4 }) + circle(0, -L * 0.6, 40, { fill: '#ffffff', opacity: 0.35 }) + (st.coreBroken ? path(`M-14,${-L * 0.6 - 12} l10,10 l-6,8 l12,10`, { stroke: INK, strokeWidth: 2.4, fill: 'none' }) : '') : ''),
      arm: () => ({ ua: '#f2f0ea', fa: '#f2f0ea', cuff: '#c9ced8', hand: ONE.skin }),
      leg: () => ({ th: '#f2f0ea', sh: '#e2d2c2', foot: '#c9b8a0', sole: '#8a7a6a' }),
    },
  };

  // ---------- state flags on existing cast (without the flag nothing changes) ----------
  // Grimm's skull mask, cracked across the left socket (ch.57 L322, ch.58 L40)
  const grimmHeadFor = CHARS.grimm.headFor;
  CHARS.grimm.headFor = (st) => { const hd = grimmHeadFor(st); return st.cracked ? { ...hd, hat: (hd.hat || '') + path('M-24,-40 l8,16 l-6,10 l10,16 M-30,-6 l-10,14', { stroke: INK, strokeWidth: 2.6, fill: 'none' }) } : hd; };
  // Unmasked Grimm with the skull mask pushed up on the side of the head like a beret (ch.46 L18)
  const gfHead = CHARS.grimmFace.head;
  CHARS.grimmFace.headFor = (st) => (st.maskUp ? { ...gfHead, hat: path('M-6,-60 C-10,-96 50,-100 56,-66 C60,-44 50,-34 40,-30 L4,-30 C-4,-36 -8,-46 -6,-60Z', { fill: '#f1efe8', stroke: INK, strokeWidth: 3 }) + path('M8,-60 C2,-60 4,-48 12,-48 C18,-48 18,-60 8,-60Z M36,-62 C30,-62 28,-50 36,-50 C44,-50 44,-62 36,-62Z', { fill: '#17141c' }) } : gfHead);
  // One-Face make-up first needed in EP46-65 (appended to cast4's set; unknown names fall through)
  const PAINT = {
    flame: path('M-38,20 q6,-18 4,-30 q10,10 8,26 M30,20 q6,-18 4,-30 q10,10 8,26', { stroke: '#d0263a', strokeWidth: 4, fill: 'none' }), // BBQ
    blueLiner: path('M-28,-2 q10,-6 18,0 M8,-2 q10,-6 18,0', { stroke: '#2a6ad0', strokeWidth: 4.4, fill: 'none' }), // Melon
    blackLips: path('M-10,30 q10,6 20,0', { stroke: '#0b0a10', strokeWidth: 6, fill: 'none' }), // the giant cook
    goldBrow: path('M-30,-16 q10,-6 20,0 M8,-16 q10,-6 20,0', { stroke: '#e2b84a', strokeWidth: 5, fill: 'none' }), // Alchem
    bolt: path('M30,0 l-8,12 l8,2 l-8,14', { stroke: '#ffe14a', strokeWidth: 4, fill: 'none' }), // Rumor
    clock: circle(30, 14, 10, { fill: 'none', stroke: '#e2b84a', strokeWidth: 2.4 }) + path('M30,14 l0,-7 M30,14 l5,3', { stroke: '#e2b84a', strokeWidth: 2.4 }), // Tempo
    scales: path('M-14,-40 L14,-40 M0,-46 L0,-32 M-14,-40 l-6,10 h12Z M14,-40 l-6,10 h12Z', { stroke: '#d0263a', strokeWidth: 2.4, fill: 'none' }), // Tax
    redBand: rect(-44, -26, 90, 12, { fill: '#c0172a', stroke: INK, strokeWidth: 2 }) + path('M-44,-20 l-16,14 M-44,-20 l-10,20', { stroke: '#c0172a', strokeWidth: 5 }), // Setsu
    silverLiner: path('M-28,-2 q10,-6 18,0 M8,-2 q10,-6 18,0', { stroke: '#c9ced8', strokeWidth: 4.4, fill: 'none' }), // Caliber
    yellowLiner: path('M-28,-2 q10,-6 18,0 M8,-2 q10,-6 18,0', { stroke: '#ffd020', strokeWidth: 4.4, fill: 'none' }), // Clatter
    purple: path('M-30,-36 Q0,-46 30,-36 M-28,14 l10,10 M26,14 l-10,10', { stroke: '#7a3ad0', strokeWidth: 4, fill: 'none' }), // Malus
    halfMask: path('M-36,-24 C-38,-58 40,-58 40,-24 L40,4 L-36,4Z', { fill: '#f6f6f2', stroke: INK, strokeWidth: 3 }) + path('M-24,-6 q10,-6 18,0 M6,-6 q10,-6 18,0', { stroke: INK, strokeWidth: 3, fill: 'none' }) + path('M16,-50 l-6,14 l4,8', { stroke: INK, strokeWidth: 2 }), // Caliber's cracked half mask
    wingMask: path('M-36,-24 C-38,-58 40,-58 40,-24 C42,10 26,40 0,46 C-22,40 -36,10 -36,-24Z', { fill: '#f6f6f2', stroke: INK, strokeWidth: 3 }) + path('M-30,-30 q14,-14 26,-4 M34,-30 q-14,-14 -26,-4', { stroke: '#9aa0b0', strokeWidth: 3, fill: 'none' }) + path('M-24,-4 q10,-6 18,0 M6,-4 q10,-6 18,0', { stroke: INK, strokeWidth: 3.4, fill: 'none' }), // the winged-mask scout
  };
  const ofHead = CHARS.oneface.headFor;
  CHARS.oneface.headFor = (st) => { const hd = ofHead(st); const extra = [].concat(st.paint2 || [], PAINT[st.paint] ? [st.paint] : []).map((k) => PAINT[k] || '').join(''); return extra ? { ...hd, hat: (hd.hat || '') + extra } : hd; };

  return defs;
};
