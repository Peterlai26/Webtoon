// Cast introduced in EP31-45 (source chapters 31-45): the Solaris commanders
// and lettered Honourables, the white-mask clones of the One-Face Kingdom,
// Velen Thorne and Naira. Same rules as CHARS in figure.js: every appearance
// is drawn from the single definition below. Appearance comes from the source
// text; unstated details are design choices recorded in
// docs/02-character-reference.md.
'use strict';
const { INK, path, circle, ellipse, rect, smooth, g } = require('./util');
const { HAIR } = require('./head');

// ---------- hair styles first needed in EP31-45 ----------
Object.assign(HAIR, {
  braids(c) { // Miray: bright blonde, two braids with white bows (ch.36 L24)
    const back = smooth([[-46, 0], [-52, -30], [-38, -60], [-6, -70], [26, -64], [48, -44], [52, -14], [48, 10], [32, -26], [-24, -24], [-42, 16]]);
    const braid = (x, dir) => Array.from({ length: 5 }, (_, i) => ellipse(x + dir * i * 2, 26 + i * 22, 12 - i, 13, { fill: c, stroke: INK, strokeWidth: 2 })).join('') + path(`M${x - 14},14 l14,8 l14,-8 l-4,14 l-10,-4 l-10,4Z`, { fill: '#fff', stroke: INK, strokeWidth: 2 });
    return { behind: braid(-44, -1) + braid(42, 1), back: path(back, { fill: c }), front: path('M-40,-22 C-32,-64 40,-68 50,-24 L44,-8 C36,-24 20,-30 6,-24 C-6,-30 -24,-28 -40,-22Z', { fill: c }), shine: path('M-12,-56 Q8,-62 26,-52', { stroke: '#fff7d0', strokeWidth: 3, fill: 'none' }) };
  },
  long(c) { // Corvin: long untidy black hair to the neck (ch.37 L72)
    const behind = smooth([[-46, -20], [-54, 30], [-46, 70], [-24, 56], [-10, 20], [30, 20], [40, 64], [56, 50], [54, 0], [48, -20]]);
    const back = smooth([[-46, 0], [-52, -30], [-38, -60], [-8, -68], [24, -64], [46, -44], [52, -14], [48, 16], [32, -24], [-24, -24], [-42, 16]]);
    return { behind: path(behind, { fill: c }), back: path(back, { fill: c }), front: path('M-42,-18 C-36,-66 40,-70 52,-22 L48,10 L38,-12 L30,6 L20,-16 L8,0 L0,-18 L-12,-2 L-20,-18 L-34,0Z', { fill: c }) };
  },
  starTwin(c) { // Axiom: pale silver hair, ribbons and golden stars (ch.37 L146)
    const back = smooth([[-48, 0], [-54, -32], [-38, -62], [-6, -72], [26, -66], [48, -46], [56, -14], [52, 18], [36, -20], [-24, -22], [-44, 18]]);
    const tail = (x, d) => path(`M${x},-20 C${x + d * 30},0 ${x + d * 34},60 ${x + d * 14},96 C${x + d * 6},60 ${x},20 ${x - d * 6},-6Z`, { fill: c, stroke: INK, strokeWidth: 2 });
    const star = (x, y) => path(`M${x},${y - 9} L${x + 3},${y - 3} L${x + 9},${y - 2} L${x + 4},${y + 2} L${x + 6},${y + 9} L${x},${y + 5} L${x - 6},${y + 9} L${x - 4},${y + 2} L${x - 9},${y - 2} L${x - 3},${y - 3}Z`, { fill: '#ffd45a', stroke: INK, strokeWidth: 1.4 });
    return { behind: tail(-46, -1) + tail(46, 1), back: path(back, { fill: c }), front: path('M-40,-22 C-32,-66 40,-70 52,-26 L46,-6 C38,-22 22,-30 8,-22 C-6,-30 -26,-28 -40,-22Z', { fill: c }) + path('M-50,-30 l-14,-10 l4,16Z M-50,-30 l-12,14 l14,-2Z', { fill: '#f6f2ff', stroke: INK, strokeWidth: 1.6 }) + star(30, -54) + star(-24, -58) };
  },
  ponytail(c) { // Gravis: navy-black hair tied low (ch.39 L200)
    const back = smooth([[-46, 2], [-52, -28], [-40, -58], [-10, -68], [22, -64], [44, -48], [50, -22], [44, -4], [22, -40], [-30, -32], [-44, 22]]);
    return { behind: path('M-40,10 C-60,40 -56,90 -46,120 C-36,90 -34,50 -26,20Z', { fill: c, stroke: INK, strokeWidth: 2 }), back: path(back, { fill: c }), front: path('M-38,-28 C-24,-58 34,-62 46,-30 C30,-44 -12,-44 -38,-28Z', { fill: c }) };
  },
});

module.exports = function cast4(h) {
  const { SK, OL, coatTorso, purifierHelmet, CHARS } = h;
  const fem = { torso: 152, sw: 64, waist: 44, hw: 50, ua: 94, fa: 88, th: 140, sh: 136, uaW: 23, faW: 20, thW: 32, shW: 27 };
  const GOLD = '#e2b84a';

  // generic white-gold Solaris armour plate with a sun emblem
  const solArmour = (main, trim, dark, extra = '') => (L) => rect(-60, -L - 20, 120, L + 40, { fill: main }) +
    path(`M-30,${-L * 0.42} L30,${-L * 0.42} L24,-4 L-24,-4Z`, { fill: dark }) +
    path(`M-34,${-L + 16} L0,${-L * 0.5} L34,${-L + 16}`, { stroke: trim, strokeWidth: 4, fill: 'none' }) +
    circle(0, -L * 0.66, 10, { fill: 'none', stroke: trim, strokeWidth: 3 }) + path(Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `M${Math.cos(a) * 12},${-L * 0.66 + Math.sin(a) * 12} l${Math.cos(a) * 6},${Math.sin(a) * 6}`; }).join(' '), { stroke: trim, strokeWidth: 2 }) +
    rect(-60, -10, 120, 12, { fill: trim }) + extra;

  // ---------- Olden, "the Honourable Leader" (ch.36 L30): white-gold general's armour, white mantle ----------
  const oldenTorso = (L) => solArmour('#f2f0ea', GOLD, '#d8d4c8')(L) + path(`M-50,${-L + 6} L-30,${-L * 0.3} M50,${-L + 6} L30,${-L * 0.3}`, { stroke: GOLD, strokeWidth: 3 }) + rect(-30, -L * 0.36, 60, 8, { fill: GOLD });

  // ---------- Miray, "the Pure and Merciless" (ch.36 L24): white inspector uniform, gold trim ----------
  const mirayTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#fbfaf6' }) + path(`M-14,${-L + 2} L0,${-L + 22} L14,${-L + 2}`, { fill: '#e8e2d4', stroke: GOLD, strokeWidth: 2 }) +
    path(`M-6,${-L + 22} L6,${-L + 22} L4,${-L * 0.5} L-4,${-L * 0.5}Z`, { fill: GOLD }) + path(`M-40,${-L * 0.7} L-10,${-L * 0.7} M10,${-L * 0.7} L40,${-L * 0.7}`, { stroke: GOLD, strokeWidth: 2.4 }) +
    circle(-8, -L * 0.36, 3, { fill: GOLD }) + circle(-8, -L * 0.22, 3, { fill: GOLD }) + rect(-60, -10, 120, 8, { fill: GOLD });

  // ---------- Sanctum (ch.37 L114): ivory-gold heavy armour ----------
  const sanctumTorso = (L) => solArmour('#f1ebdc', GOLD, '#d6ccb4')(L) + rect(-44, -L * 0.36, 88, 10, { fill: '#bfb39a' });

  // ---------- Corvin Way (ch.37 L72): black long coat over a dark-red waistcoat and a buttoned white shirt ----------
  const corvinTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#121117' }) + path(`M-22,${-L + 2} L22,${-L + 2} L18,-6 L-18,-6Z`, { fill: '#6a0a16' }) +
    path(`M-10,${-L + 2} L0,${-L + 14} L10,${-L + 2}Z`, { fill: '#f4f2ee' }) + path(`M0,${-L + 14} L0,-8`, { stroke: '#3a0a10', strokeWidth: 2 }) +
    [0.6, 0.45, 0.3].map((y) => circle(0, -L * y, 2.6, { fill: '#c9a040' })).join('') + path(`M-24,${-L + 2} L-20,-6 M24,${-L + 2} L20,-6`, { stroke: '#2a2830', strokeWidth: 3 });

  // ---------- Bastian Rook (ch.37 L148): black-and-white combat suit with gold lines ----------
  const bastianTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#18171d' }) + path(`M-60,${-L - 20} L0,${-L * 0.4} L60,${-L - 20}`, { fill: '#f2f0ec' }) +
    path(`M-40,${-L + 4} L0,${-L * 0.4} L40,${-L + 4} M0,${-L * 0.4} L0,-6`, { stroke: GOLD, strokeWidth: 3, fill: 'none' }) + rect(-60, -10, 120, 8, { fill: GOLD });

  // ---------- Lady Axiom (ch.37 L146): noble ruffled dress / circus performer, ivory, black and gold ----------
  const axiomTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#f6f0e2' }) + path(`M-60,${-L * 0.55} L60,${-L * 0.55} L60,0 L-60,0Z`, { fill: '#16151b' }) +
    path(`M-30,${-L + 4} q10,12 20,0 q10,12 20,0 q10,12 20,0`, { stroke: GOLD, strokeWidth: 3, fill: 'none' }) + path(Array.from({ length: 4 }, (_, i) => `M${-36 + i * 24},${-L * 0.55} l12,14 l12,-14`).join(' '), { fill: GOLD, stroke: INK, strokeWidth: 1.4 }) +
    circle(0, -L * 0.75, 6, { fill: '#c0485a', stroke: GOLD, strokeWidth: 2 });

  // ---------- Sir Draken (ch.38 L92): pearl-white armour with silver-gold overlapping dragon scales ----------
  const scales = (L, c1, c2) => { let s = ''; for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) s += path(`M${-48 + c * 24 + (r % 2) * 12},${-L + 14 + r * L * 0.15} q12,16 24,0`, { fill: c1, stroke: c2, strokeWidth: 1.6 }); return s; };
  const drakenTorso = (L, D, st) => rect(-60, -L - 20, 120, L + 40, { fill: '#f6f4ee' }) + scales(L, '#e8e4dc', '#b9bcc6') + path(`M-34,${-L + 14} L0,${-L * 0.5} L34,${-L + 14}`, { stroke: GOLD, strokeWidth: 4, fill: 'none' }) + rect(-60, -10, 120, 12, { fill: GOLD }) +
    (st.aura ? rect(-60, -L - 20, 120, L + 40, { fill: '#7ad8ff', opacity: 0.18 }) : '');

  // ---------- Dr. Enoch Voss (ch.38 L132): white lab coat over a black suit, Lumina Lab badge ----------
  function vossTorso(L) {
    return rect(-60, -L - 20, 120, L + 40, { fill: '#121117' }) + path(`M-8,${-L + 2} L0,${-L + 14} L8,${-L + 2}Z`, { fill: '#f4f2ee' }) + path(`M-3,${-L + 14} L3,${-L + 14} L4,${-L * 0.45} L-4,${-L * 0.45}Z`, { fill: '#3a3a52' }) +
      path(`M-60,${-L - 20} L-14,${-L - 20} L-6,${-L * 0.5} L-14,10 L-60,10Z M60,${-L - 20} L14,${-L - 20} L6,${-L * 0.5} L14,10 L60,10Z`, { fill: '#fbfbfd' }) +
      path(`M-14,${-L - 4} L-6,${-L * 0.5} L-14,10 M14,${-L - 4} L6,${-L * 0.5} L14,10`, { stroke: '#c9ccd6', strokeWidth: 3, fill: 'none' }) +
      circle(-30, -L * 0.7, 8, { fill: 'none', stroke: GOLD, strokeWidth: 2 }) + path(`M-34,${-L * 0.74} q4,4 8,0 q-4,4 -8,8`, { stroke: '#3fe0d0', strokeWidth: 1.6, fill: 'none' });
  }

  // ---------- Commander Arion (ch.39 L34): white inspector-general's armour, three gold stars on the epaulettes ----------
  const arionTorso = (L) => solArmour('#f4f5f8', GOLD, '#c9ced8')(L);
  const stars3 = (L, D) => [0, 1, 2].map((i) => circle(D.sw * 0.3 + i * 7 - 7, -L + 2, 3, { fill: '#ffd45a', stroke: INK, strokeWidth: 1 })).join('');

  // ---------- Lord Chronos (ch.39 L190): antique black suit with gold trim ----------
  const chronosTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#141318' }) + path(`M-16,${-L + 2} L0,${-L * 0.42} L16,${-L + 2}Z`, { fill: '#f2eee4' }) +
    path(`M-18,${-L + 2} L-4,${-L * 0.42} L-14,-6 M18,${-L + 2} L4,${-L * 0.42} L14,-6`, { stroke: GOLD, strokeWidth: 3, fill: 'none' }) + path(`M-30,${-L * 0.48} q16,10 26,0`, { stroke: GOLD, strokeWidth: 2, fill: 'none' }) + circle(-32, -L * 0.48, 4, { fill: GOLD });

  // ---------- Lord Gravis (ch.39 L200): dark coat, golden rings orbiting shoulders and waist ----------
  const gravisTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#1a1e30' }) + path(`M-10,${-L + 2} L0,${-L + 14} L10,${-L + 2}`, { stroke: '#3a4060', strokeWidth: 3, fill: 'none' }) + rect(-60, -10, 120, 8, { fill: GOLD });
  const gravisRings = (L, D) => ellipse(0, -L + 8, D.sw * 0.9, 12, { fill: 'none', stroke: GOLD, strokeWidth: 4 }) + ellipse(0, -6, D.sw * 0.8, 11, { fill: 'none', stroke: GOLD, strokeWidth: 4 }) + circle(D.sw * 0.9, -L + 8, 5, { fill: '#ffe48a' }) + circle(-D.sw * 0.8, -6, 5, { fill: '#ffe48a' });

  // ---------- Archbishop Nal (ch.40 L72): black-and-white archbishop robe trimmed with gold ----------
  const nalTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#f2f0ec' }) + path(`M-60,${-L - 20} L-18,${-L - 20} L-14,10 L-60,10Z M60,${-L - 20} L18,${-L - 20} L14,10 L60,10Z`, { fill: '#141318' }) +
    path(`M-18,${-L - 20} L-14,10 M18,${-L - 20} L14,10`, { stroke: GOLD, strokeWidth: 4 }) + path(`M0,${-L * 0.8} L0,${-L * 0.5} M-10,${-L * 0.7} L10,${-L * 0.7}`, { stroke: GOLD, strokeWidth: 4 });

  // ---------- white-mask clones (ch.39 L12-140, ch.40 L16): plain black clothes, white mask, optional ragged cloak ----------
  function maskHead(expr, side, ex) {
    const fx = side === 'front' ? 0 : 8;
    let s = '';
    if (ex.hood) s += path(smooth([[-58, 20], [-62, -40], [-40, -78], [-2, -88], [38, -78], [60, -44], [62, 10], [56, 50], [-50, 56]]), { fill: '#1a1820', stroke: INK, strokeWidth: 3 });
    else s += path('M-46,-4 C-50,-60 46,-64 48,-6 L40,-20 C20,-40 -20,-40 -40,-20Z', { fill: '#141318', stroke: INK, strokeWidth: 2 });
    s += path(`M-36,-24 C-38,-58 40,-58 40,-24 C42,10 26,40 ${fx},46 C-22,40 -36,10 -36,-24Z`, { fill: '#f6f6f2', stroke: INK, strokeWidth: 3 });
    s += path(`M${fx - 24},-4 q10,-6 18,0 M${fx + 6},-4 q10,-6 18,0`, { stroke: INK, strokeWidth: 3.4, fill: 'none' });
    if (ex.pat === 'line') s += path(`M${fx - 15},-38 L${fx - 15},30 M${fx + 15},-38 L${fx + 15},30`, { stroke: '#9aa0b0', strokeWidth: 3 });
    else if (ex.pat === 'circle') s += circle(fx, -30, 9, { fill: 'none', stroke: '#9aa0b0', strokeWidth: 3 });
    else if (ex.pat === 'crown') s += path(`M${fx - 22},-34 l8,-12 l7,10 l7,-14 l7,14 l7,-10 l8,12`, { stroke: '#9aa0b0', strokeWidth: 3, fill: 'none' });
    else if (ex.pat === 'skull') s += path(`M${fx - 20},-4 C${fx - 26},-4 ${fx - 24},10 ${fx - 12},10 C${fx - 6},10 ${fx - 6},-4 ${fx - 20},-4Z M${fx + 18},-4 C${fx + 10},-4 ${fx + 8},10 ${fx + 18},10 C${fx + 26},10 ${fx + 26},-4 ${fx + 18},-4Z`, { fill: '#17141c' });
    if (ex.cracked) s += path(`M${fx + 20},-44 l-8,16 l6,10 l-10,20`, { stroke: INK, strokeWidth: 2.4, fill: 'none' }) + path(`M${fx + 6},40 q2,10 -2,22`, { stroke: '#c0172a', strokeWidth: 4, fill: 'none' });
    if (ex.glowRed) s += circle(fx, 0, 60, { fill: '#ff2a1a', opacity: 0.35 });
    return s;
  }
  const blackSuit = (L, D, st) => rect(-60, -L - 20, 120, L + 40, { fill: '#18171d' }) + path(`M-10,${-L + 2} L0,${-L + 14} L10,${-L + 2}`, { stroke: '#3a3842', strokeWidth: 2.4, fill: 'none' }) +
    (st.cloak ? path(`M-60,${-L - 20} L60,${-L - 20} L60,10 L-60,10Z`, { fill: '#24222a' }) + path(`M-40,${-L * 0.4} l10,14 M30,${-L * 0.7} l-6,16`, { stroke: '#121117', strokeWidth: 3 }) : '') +
    (st.chestHole ? circle(0, -L * 0.6, 16, { fill: '#a3101f' }) + circle(0, -L * 0.6, 26, { fill: '#ffd45a', opacity: 0.4 }) : '') + (st.glowRed ? rect(-60, -L - 20, 120, L + 40, { fill: '#ff2a1a', opacity: 0.3 }) : '');

  // ---------- Velen Thorne (ch.41 L112, L126; ch.42 L4-8): black uniform with cyan lines, long dark hooded cloak ----------
  const velenTorso = (L, D, st) => rect(-60, -L - 20, 120, L + 40, { fill: '#16161c' }) + path(`M-34,${-L + 14} L0,${-L * 0.5} L34,${-L + 14} M0,${-L * 0.5} L0,-6`, { stroke: '#3ad8e8', strokeWidth: 3, fill: 'none' }) +
    path(`M-60,${-L - 20} L-16,${-L - 20} L-6,${-L * 0.55} L-12,10 L-60,10Z M60,${-L - 20} L16,${-L - 20} L6,${-L * 0.55} L12,10 L60,10Z`, { fill: st.hood ? '#24222c' : '#0e0e14' }) +
    path(`M-16,${-L - 4} L-6,${-L * 0.55} L-12,10 M16,${-L - 4} L6,${-L * 0.55} L12,10`, { stroke: st.hood ? '#3a3842' : GOLD, strokeWidth: 2.4, fill: 'none' }) + path(`M-50,${-L * 0.2} L-20,${-L * 0.2}`, { stroke: '#3ad8e8', strokeWidth: 2 });
  function velenHoodHead(expr, side, ex) {
    const fx = side === 'front' ? 0 : 8;
    return path(smooth([[-58, 24], [-62, -40], [-40, -80], [-2, -90], [38, -80], [60, -44], [62, 14], [56, 54], [-50, 58]]), { fill: '#24222c', stroke: INK, strokeWidth: 3 }) + path(`M-36,-10 C-30,-44 40,-44 42,-10 C44,18 30,44 ${fx},48 C-20,42 -34,20 -36,-10Z`, { fill: '#0e0d12' }) + path(`M${fx - 10},34 q10,6 22,0`, { stroke: '#3a3842', strokeWidth: 2.4, fill: 'none' });
  }

  const halfMask = path('M-40,-26 C-30,-40 40,-42 46,-24 L44,12 C30,6 20,8 10,14 C0,8 -20,8 -40,12Z', { fill: '#121117', stroke: INK, strokeWidth: 2.4 }) + path('M-28,-6 q10,-6 18,0 M10,-6 q10,-6 18,0', { stroke: '#c9ced8', strokeWidth: 3, fill: 'none' });
  // ---------- Naira (ch.41 L84, ch.44 L26): black bodysuit, half mask; unmasked: scar at the tail of the right brow ----------
  const nairaTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#121117' }) + path(`M-30,${-L + 10} Q0,${-L + 30} 30,${-L + 10}`, { stroke: '#2a2830', strokeWidth: 3, fill: 'none' }) + rect(-60, -10, 120, 8, { fill: '#2a2830' }) + rect(24, -16, 10, 20, { fill: '#3a3842' });

  // ---------- the One-Face Kingdom (ch.44 L80, ch.45): every face identical; bodies, hair and make-up vary ----------
  const ONE = { hair: 'short', hairColor: '#16151b', eyes: '#3a3440', skin: '#e2d2c2' };
  const tunic = (col, trim) => (L) => rect(-60, -L - 20, 120, L + 40, { fill: col }) + path(`M-14,${-L + 2} L0,${-L + 16} L14,${-L + 2}`, { stroke: trim, strokeWidth: 3, fill: 'none' }) + rect(-60, -12, 120, 10, { fill: trim });
  const kingTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#121117' }) + path(`M-16,${-L + 2} L0,${-L * 0.4} L16,${-L + 2}`, { fill: '#5a0a14' }) + path(`M-50,${-L - 20} L-50,10 M50,${-L - 20} L50,10 M-20,${-L + 2} L-20,10 M20,${-L + 2} L20,10`, { stroke: '#7a1420', strokeWidth: 4 }) + rect(-60, -12, 120, 10, { fill: '#7a1420' });
  const crown = path('M-34,-48 L-38,-84 L-22,-66 L-10,-92 L2,-68 L14,-92 L24,-66 L40,-84 L36,-48Z', { fill: '#1a1a20', stroke: INK, strokeWidth: 3 }) + circle(2, -64, 4, { fill: '#7a1420' });
  // make-up drawn over the face (ch.44 L82 red graphic stripes / black eyeliner / blue-gold forehead; ch.45 L8 silver cheeks)
  const MAKEUP = {
    red: path('M-36,8 L-6,22 M14,22 L44,4 M-32,18 L-12,28', { stroke: '#d0263a', strokeWidth: 4, fill: 'none' }),
    silver: path('M-34,6 l10,22 M24,6 l10,22 M-28,4 l10,22', { stroke: '#c9ced8', strokeWidth: 3, fill: 'none' }) + path('M-28,-2 q10,-6 18,0 M8,-2 q10,-6 18,0', { stroke: '#0b0a10', strokeWidth: 4, fill: 'none' }),
    blue: path('M-26,-36 Q0,-46 28,-36', { stroke: '#2a5ad0', strokeWidth: 4, fill: 'none' }) + path('M-16,-30 Q0,-38 18,-30', { stroke: '#e2b84a', strokeWidth: 3, fill: 'none' }),
    liner: path('M-28,-2 q10,-6 18,0 M8,-2 q10,-6 18,0', { stroke: '#0b0a10', strokeWidth: 4.4, fill: 'none' }),
  };
  const oneHead = (st, extra = {}) => ({ ...ONE, ...extra, hair: st.hair || extra.hair || ONE.hair, hairColor: st.hairColor || extra.hairColor || ONE.hairColor, hat: [extra.hat || '', st.paint ? MAKEUP[st.paint] : ''].join('') || undefined });

  const defs = {
    olden: {
      dims: { torso: 186, sw: 96, waist: 72, hw: 66, ua: 110, fa: 104, th: 160, sh: 154, uaW: 34, faW: 30, thW: 42, shW: 36 }, skin: '#e8cdb6',
      head: { hair: 'short', hairColor: '#f2f2f0', browColor: '#e8e8e6', eyes: '#4a4e58', skin: '#e8cdb6', beard: '#f2f2f0', stitches: 'M-20,-30 l26,44 M-14,-20 l6,-3' },
      torso: oldenTorso, cape: '#f6f6f2',
      arm: () => ({ ua: '#d8d4c8', fa: '#f2f0ea', cuff: GOLD, hand: '#f2f0ea' }),
      leg: () => ({ th: '#f2f0ea', sh: '#f2f0ea', knee: GOLD, foot: '#d8d4c8', sole: GOLD }),
      pauldrons: 'purifier',
    },
    miray: {
      dims: { ...fem, torso: 136, th: 128, sh: 124, sw: 58, ua: 86, fa: 80 }, skin: '#f8e6dc',
      head: { hair: 'braids', hairColor: '#f6dc78', eyes: '#f08aa8', skin: '#f8e6dc', lips: '#e86a8a' },
      torso: mirayTorso,
      arm: () => ({ ua: '#fbfaf6', fa: '#fbfaf6', cuff: GOLD, hand: '#ffffff' }),
      leg: () => ({ th: '#f8e6dc', sh: '#fbfaf6', foot: '#f2eee4', sole: GOLD }),
      skirt: () => ({ color: '#fbfaf6', len: 60, trim: GOLD }),
    },
    sanctum: {
      dims: { torso: 196, sw: 108, waist: 80, hw: 72, ua: 114, fa: 108, th: 166, sh: 160, uaW: 38, faW: 34, thW: 46, shW: 40, handR: 15 }, skin: '#e2c4a8',
      head: { hair: 'crew', hairColor: '#b8902a', eyes: '#4a4030', skin: '#e2c4a8' },
      torso: sanctumTorso,
      arm: () => ({ ua: '#d6ccb4', fa: '#f1ebdc', cuff: GOLD, hand: '#d6ccb4' }),
      leg: (st) => ({ th: '#f1ebdc', sh: '#f1ebdc', knee: GOLD, foot: '#8a7a5a', sole: '#5a5048' }),
      pauldrons: 'purifier',
    },
    corvin: {
      dims: { torso: 176, sw: 64, waist: 44, hw: 46, ua: 108, fa: 102, th: 158, sh: 152, uaW: 21, faW: 18, thW: 26, shW: 22 }, skin: '#f2f0ee',
      head: { hair: 'long', hairColor: '#0e0d12', eyes: '#7a1420', skin: '#f2f0ee' },
      torso: corvinTorso,
      arm: () => ({ ua: '#121117', fa: '#121117', cuff: '#f4f2ee', hand: '#9aa0aa', blades: true }),
      leg: () => ({ th: '#121117', sh: '#121117', foot: '#0a0a0e', sole: '#3a3842' }),
      skirt: () => ({ color: '#121117', len: 210, trim: '#2a2830' }),
    },
    bastian: {
      dims: { torso: 160, sw: 74, waist: 52, hw: 52, uaW: 27, faW: 24, thW: 34, shW: 29 }, skin: '#ecd0b8',
      head: { hair: 'wild', hairColor: '#1e1a22', eyes: '#f0b020', skin: '#ecd0b8' },
      torso: bastianTorso,
      arm: () => ({ ua: '#18171d', fa: '#f2f0ec', cuff: GOLD, hand: '#9aa0aa' }),
      leg: () => ({ th: '#18171d', sh: '#18171d', knee: GOLD, foot: '#0e0d12', sole: GOLD }),
    },
    axiom: {
      dims: { ...fem, torso: 126, th: 118, sh: 114, sw: 54, ua: 80, fa: 76 }, skin: '#fbefe8',
      head: { hair: 'starTwin', hairColor: '#dcdce8', eyes: '#d0203a', skin: '#fbefe8', lips: '#e86a8a' },
      torso: axiomTorso,
      arm: () => ({ ua: '#f6f0e2', fa: '#16151b', cuff: GOLD, hand: '#fbefe8' }),
      leg: () => ({ th: '#16151b', sh: '#f6f0e2', foot: '#16151b', sole: GOLD }),
      skirt: () => ({ color: '#f6f0e2', len: 96, trim: GOLD }),
    },
    draken: {
      dims: { torso: 192, sw: 100, waist: 74, hw: 68, ua: 112, fa: 106, th: 164, sh: 158, uaW: 34, faW: 30, thW: 42, shW: 36 }, skin: '#e6c8b0',
      head: { hair: 'short', hairColor: '#eef0f4', browColor: '#d8dce4', eyes: '#3aa0d8', skin: '#e6c8b0', stitches: 'M-30,14 l22,10' },
      torso: drakenTorso,
      arm: (st, side) => ({ ua: '#e8e4dc', fa: '#f6f4ee', cuff: GOLD, hand: '#d8d4cc', ...(st.aura && side === 'left' ? { ua: '#9ad8ff', fa: '#bfe8ff', stripe: '#ffd45a' } : {}) }),
      leg: () => ({ th: '#f6f4ee', sh: '#e8e4dc', knee: GOLD, foot: '#b9bcc6', sole: GOLD }),
      pauldrons: 'purifier',
    },
    voss: {
      dims: { torso: 170, sw: 70, waist: 52, hw: 52, uaW: 25, faW: 22, thW: 32, shW: 27 }, skin: '#ecd8c8',
      head: { hair: 'slick', hairColor: '#24222a', eyes: '#3a4a5a', skin: '#ecd8c8', glasses: true },
      torso: vossTorso,
      arm: () => ({ ua: '#fbfbfd', fa: '#fbfbfd', cuff: '#121117', hand: '#ecd8c8' }),
      leg: () => ({ th: '#121117', sh: '#121117', foot: '#0a0a0e', sole: '#3a3842' }),
      skirt: () => ({ color: '#fbfbfd', len: 170, trim: '#c9ccd6' }),
    },
    arion: {
      dims: { torso: 178, sw: 86, waist: 60, hw: 58, uaW: 30, faW: 26, thW: 38, shW: 33 }, skin: '#ecd0b8',
      head: { hair: 'crew', hairColor: '#c9a040', eyes: '#3a6aa0', skin: '#ecd0b8' },
      torso: arionTorso, over: stars3,
      arm: () => ({ ua: '#c9ced8', fa: '#f4f5f8', cuff: GOLD, hand: '#f4f5f8' }),
      leg: () => ({ th: '#f4f5f8', sh: '#f4f5f8', knee: GOLD, foot: '#c9ced8', sole: GOLD }),
      pauldrons: 'purifier',
    },
    chronos: {
      dims: { torso: 180, sw: 66, waist: 46, hw: 48, ua: 108, fa: 102, th: 160, sh: 154, uaW: 22, faW: 19, thW: 28, shW: 24 }, skin: '#ecdccc',
      head: { hair: 'slick', hairColor: '#2a2a30', eyes: '#c99a20', skin: '#ecdccc' },
      torso: chronosTorso,
      arm: () => ({ ua: '#141318', fa: '#141318', cuff: GOLD, hand: '#ecdccc' }),
      leg: () => ({ th: '#141318', sh: '#141318', foot: '#0a0a0e', sole: GOLD }),
      skirt: () => ({ color: '#141318', len: 120, trim: GOLD }),
    },
    gravis: {
      dims: { torso: 176, sw: 72, waist: 52, hw: 52, uaW: 25, faW: 22, thW: 32, shW: 27 }, skin: '#e6d0be',
      head: { hair: 'ponytail', hairColor: '#1a2036', eyes: '#3a4a7a', skin: '#e6d0be' },
      torso: gravisTorso, over: gravisRings,
      arm: () => ({ ua: '#1a1e30', fa: '#1a1e30', cuff: GOLD, hand: '#e6d0be' }),
      leg: () => ({ th: '#1a1e30', sh: '#1a1e30', foot: '#0a0a12', sole: GOLD }),
      skirt: () => ({ color: '#1a1e30', len: 150, trim: GOLD }),
    },
    nal: {
      dims: { torso: 166, sw: 68, waist: 54, hw: 54, uaW: 26, faW: 23, thW: 32, shW: 27 }, skin: '#ead8c8',
      head: { hair: 'slick', hairColor: '#e8e8ec', browColor: '#d8d8dc', eyes: '#9aa0aa', skin: '#ead8c8', stitches: 'M-30,-10 l10,2 M-30,0 l10,2 M20,22 l10,4' },
      torso: nalTorso,
      arm: () => ({ ua: '#141318', fa: '#f2f0ec', cuff: GOLD, hand: '#ead8c8' }),
      leg: () => ({ th: '#141318', sh: '#141318', foot: '#0a0a0e', sole: GOLD }),
      skirt: () => ({ color: '#f2f0ec', len: 250, trim: GOLD }),
    },
    whiteMask: {
      dims: { torso: 166, sw: 74, waist: 54, hw: 54, uaW: 27, faW: 24, thW: 34, shW: 29 }, skin: '#e2d2c2',
      head: { helmet: maskHead, skin: '#e2d2c2' },
      torso: blackSuit,
      arm: (st) => ({ ua: '#18171d', fa: '#18171d', cuff: '#2a2830', hand: '#121117' }),
      leg: () => ({ th: '#18171d', sh: '#18171d', foot: '#0e0d12', sole: '#2a2830' }),
      skirt: (st) => (st.cloak ? { color: '#24222a', len: 220, burnt: true } : null),
    },
    velen: {
      dims: { torso: 176, sw: 76, waist: 54, hw: 54, ua: 104, fa: 98, th: 154, sh: 150, uaW: 26, faW: 23, thW: 32, shW: 28 }, skin: '#e6cfbc',
      head: { hair: 'short', hairColor: '#a6a8b0', browColor: '#8a8c94', eyes: '#8a929c', skin: '#e6cfbc' },
      headFor: (st) => (st.hood ? { helmet: velenHoodHead, skin: '#e6cfbc' } : { hair: 'short', hairColor: '#a6a8b0', browColor: '#8a8c94', eyes: '#8a929c', skin: '#e6cfbc' }),
      torso: velenTorso,
      arm: (st) => ({ ua: '#0e0e14', fa: '#16161c', cuff: '#3ad8e8', hand: '#9aa3ad' }),
      leg: () => ({ th: '#16161c', sh: '#16161c', foot: '#0a0a10', sole: '#3ad8e8' }),
      skirt: (st) => ({ color: st.hood ? '#24222c' : '#0e0e14', len: 220, trim: st.hood ? '#3a3842' : GOLD }),
    },
    naira: {
      dims: { ...fem, torso: 156, th: 146, sh: 142 }, skin: '#ecd6c6',
      head: { hair: 'bob', hairColor: '#1a1820', hairTip: '#1a1820', eyes: '#4a4a52', skin: '#ecd6c6', scarBrow: true },
      headFor: (st) => ({ hair: 'bob', hairColor: '#1a1820', hairTip: '#1a1820', eyes: '#4a4a52', skin: '#ecd6c6', scarBrow: !!st.unmasked, hat: st.unmasked ? undefined : halfMask }),
      torso: nairaTorso,
      arm: () => ({ ua: '#121117', fa: '#121117', cuff: '#2a2830', hand: '#121117' }),
      leg: () => ({ th: '#121117', sh: '#121117', foot: '#0a0a0e', sole: '#2a2830' }),
    },
    // Madame Carrow (ch.33 L346): elderly madam in black, a necklace of old copper bond-coins
    carrow: {
      dims: { ...fem, torso: 146, th: 134, sh: 130, waist: 52, hw: 56 }, skin: '#dcc4b0',
      head: { hair: 'arachne', hairColor: '#8a8690', eyes: '#3a2a20', skin: '#dcc4b0', lips: '#5a1420', stitches: 'M-30,10 l10,4 M20,20 l12,2 M-20,-30 l16,0' },
      torso: (L, D, st, si, skin) => rect(-60, -L - 20, 120, L + 40, { fill: '#121117' }) + rect(-60, -L - 20, 120, 22, { fill: skin }) + path(`M-30,${-L + 6} Q0,${-L + 40} 30,${-L + 6}`, { stroke: '#c0172a', strokeWidth: 2, fill: 'none' }) + Array.from({ length: 7 }, (_, i) => circle(-26 + i * 9, -L + 14 + Math.sin((i / 6) * Math.PI) * 18, 4.6, { fill: st.coinGone && i === 3 ? 'none' : '#b8743a', stroke: INK, strokeWidth: 1.4 })).join(''),
      arm: () => ({ ua: '#121117', fa: '#121117', cuff: '#c0172a', hand: '#dcc4b0' }),
      leg: () => ({ th: '#121117', sh: '#121117', foot: '#0a0a0e', sole: '#c0172a' }),
      skirt: () => ({ color: '#121117', len: 230, trim: '#5a1420' }),
    },
    // Crimson Jaw (ch.33 L16): near-three-metre jailer, black leather mask with the mouth sewn shut in red thread
    crimsonJaw: {
      dims: { torso: 230, sw: 130, waist: 100, hw: 88, ua: 134, fa: 128, th: 190, sh: 180, uaW: 46, faW: 42, thW: 54, shW: 48, handR: 20 }, skin: '#c9a48a',
      head: { helmet: (expr, side) => { const fx = side === 'front' ? 0 : 8; return path('M-44,-30 C-46,-64 46,-66 46,-30 L46,30 C30,50 -30,50 -46,30Z', { fill: '#1a1416', stroke: INK, strokeWidth: 3.4 }) + ellipse(fx - 14, -6, 7, 5, { fill: expr === 'dead' ? '#3a3438' : '#e8e0d0' }) + ellipse(fx + 16, -6, 7, 5, { fill: expr === 'dead' ? '#3a3438' : '#e8e0d0' }) + path(`M${fx - 20},24 L${fx + 22},24`, { stroke: '#3a2a2a', strokeWidth: 4 }) + path(Array.from({ length: 6 }, (_, i) => `M${fx - 18 + i * 8},18 l0,12`).join(' '), { stroke: '#c0172a', strokeWidth: 2.6 }) + (expr === 'dead' ? path(`M${fx},30 q4,14 0,30`, { stroke: '#2a1a1a', strokeWidth: 5, fill: 'none' }) : ''); }, skin: '#c9a48a' },
      torso: (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#3a2a26' }) + path(`M-50,${-L + 4} L50,${-L * 0.3} M50,${-L + 4} L-50,${-L * 0.3}`, { stroke: '#1a1416', strokeWidth: 10 }) + rect(-60, -14, 120, 14, { fill: '#1a1416' }),
      arm: () => ({ ua: '#c9a48a', fa: '#c9a48a', cuff: '#1a1416', hand: '#3a2a26' }),
      leg: () => ({ th: '#2a1e1c', sh: '#2a1e1c', foot: '#121012', sole: '#3a3a42' }),
    },
    oneface: {
      dims: { torso: 166, sw: 76, waist: 56, hw: 54, uaW: 28, faW: 25, thW: 36, shW: 31 }, skin: ONE.skin,
      head: { ...ONE }, headFor: (st) => oneHead(st),
      torso: (L, D, st) => tunic(st.col || '#5a5e66', st.trim || '#3a3e46')(L) + (st.armour ? path(`M-44,${-L + 6} L44,${-L + 6} L38,${-L * 0.4} L-38,${-L * 0.4}Z`, { fill: '#2a2c34', stroke: INK, strokeWidth: 3 }) : ''),
      arm: (st) => ({ ua: st.col || '#5a5e66', fa: st.bare ? ONE.skin : (st.col || '#5a5e66'), cuff: st.trim || '#3a3e46', hand: ONE.skin }),
      leg: (st) => ({ th: '#3a3a42', sh: '#3a3a42', foot: '#1a1a20', sole: '#2a2830' }),
    },
    regulus: {
      dims: { torso: 178, sw: 78, waist: 56, hw: 56, ua: 104, fa: 98, th: 156, sh: 150, uaW: 27, faW: 24, thW: 34, shW: 29 }, skin: ONE.skin,
      head: { ...ONE, hat: crown }, headFor: (st) => oneHead(st, { hat: crown }),
      torso: kingTorso,
      arm: () => ({ ua: '#121117', fa: '#121117', cuff: '#7a1420', hand: ONE.skin }),
      leg: () => ({ th: '#121117', sh: '#121117', foot: '#0a0a0e', sole: '#7a1420' }),
      skirt: () => ({ color: '#121117', len: 240, trim: '#7a1420' }),
    },
    warden: {
      dims: { torso: 220, sw: 124, waist: 92, hw: 84, ua: 128, fa: 122, th: 184, sh: 176, uaW: 44, faW: 40, thW: 52, shW: 46, handR: 18 }, skin: ONE.skin,
      head: { ...ONE }, headFor: (st) => oneHead(st),
      torso: (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#1e1e26' }) + path(`M-50,${-L + 8} L50,${-L + 8} L42,${-L * 0.42} L-42,${-L * 0.42}Z`, { fill: '#2c2c36', stroke: INK, strokeWidth: 3 }) + path(`M-36,${-L * 0.36} L36,${-L * 0.36} L30,-8 L-30,-8Z`, { fill: '#2c2c36', stroke: INK, strokeWidth: 3 }) + circle(0, -L * 0.7, 10, { fill: '#7a1420', stroke: INK, strokeWidth: 2 }),
      arm: () => ({ ua: '#2c2c36', fa: '#1e1e26', cuff: '#7a1420', hand: '#2c2c36' }),
      leg: () => ({ th: '#2c2c36', sh: '#1e1e26', knee: '#7a1420', foot: '#121117', sole: '#3a3a42' }),
      pauldrons: 'metal',
    },
    ledger: {
      dims: { torso: 170, sw: 62, waist: 44, hw: 46, ua: 102, fa: 96, uaW: 21, faW: 18, thW: 26, shW: 22 }, skin: ONE.skin,
      head: { ...ONE, glasses: true }, headFor: (st) => oneHead(st, { glasses: true }),
      torso: tunic('#3a3a4e', '#9aa0c0'),
      arm: () => ({ ua: '#3a3a4e', fa: '#3a3a4e', cuff: '#9aa0c0', hand: ONE.skin }),
      leg: () => ({ th: '#2a2a3a', sh: '#2a2a3a', foot: '#121117', sole: '#9aa0c0' }),
      skirt: () => ({ color: '#3a3a4e', len: 200, trim: '#9aa0c0' }),
    },
  };
  // ---------- EP31 disguises (ch.31 L12-42): wrap the existing definitions; without the st flag nothing changes ----------
  const wrap = (c, key, flag, fn) => { const orig = CHARS[c][key]; CHARS[c][key] = (...a) => { const st = key === 'skirt' || key === 'arm' || key === 'leg' ? a[0] : a[2]; return st && st[flag] ? fn(...a) : orig ? orig(...a) : null; }; };
  // Volt: butler's tailcoat, white shirt, black bow tie
  wrap('volt', 'torso', 'tux', (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#141318' }) + path(`M-16,${-L + 2} L0,${-L * 0.42} L16,${-L + 2}Z`, { fill: '#f4f2ee' }) + path(`M-8,${-L + 6} L0,${-L + 12} L-8,${-L + 18}Z M8,${-L + 6} L0,${-L + 12} L8,${-L + 18}Z`, { fill: '#0a0a0e' }) + circle(-6, -L * 0.3, 2.6, { fill: '#c9ced8' }));
  wrap('volt', 'arm', 'tux', () => ({ ua: '#141318', fa: '#141318', cuff: '#f4f2ee', hand: '#f4f2ee' }));
  wrap('volt', 'skirt', 'tux', () => ({ color: '#141318', len: 170 }));
  // Claire: dark-grey pencil-skirt secretary suit
  wrap('claire', 'torso', 'suit', (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#4a4c54' }) + path(`M-12,${-L + 2} L0,${-L * 0.5} L12,${-L + 2}Z`, { fill: '#f4f2ee' }) + path(`M-14,${-L + 2} L-2,${-L * 0.5} L-10,-6 M14,${-L + 2} L2,${-L * 0.5} L10,-6`, { stroke: '#2e3036', strokeWidth: 3, fill: 'none' }));
  wrap('claire', 'arm', 'suit', () => ({ ua: '#4a4c54', fa: '#4a4c54', cuff: '#f4f2ee', hand: '#f0dcd0' }));
  wrap('claire', 'skirt', 'suit', () => ({ color: '#4a4c54', len: 110 }));
  // Gula: red-black lace corset and a full lace skirt (the young noble lady); the skirt torn half off from ch.31 L286
  wrap('gula', 'torso', 'dress', (L, D, st, si, skin) => rect(-60, -L - 20, 120, L + 40, { fill: '#7a0a1a' }) + rect(-60, -L - 20, 120, 24, { fill: skin }) + path(`M-30,${-L + 4} q10,10 20,0 q10,10 20,0 q10,10 20,0`, { stroke: '#121117', strokeWidth: 3, fill: 'none' }) + Array.from({ length: 5 }, (_, i) => path(`M-10,${-L * (0.8 - i * 0.13)} L10,${-L * (0.74 - i * 0.13)} M10,${-L * (0.8 - i * 0.13)} L-10,${-L * (0.74 - i * 0.13)}`, { stroke: '#121117', strokeWidth: 2 })).join(''));
  wrap('gula', 'skirt', 'dress', (st) => ({ color: '#7a0a1a', len: st.dress === 'torn' ? 60 : 130, trim: '#121117', burnt: st.dress === 'torn' }));
  // Rey: tinted round glasses over the slicked hair (ch.31 L26); Grimm: silver porcelain mask over the skull mask (ch.31 L34)
  const reyHead = CHARS.rey.head;
  CHARS.rey.headFor = (st) => ({ ...reyHead, hair: st.hair || reyHead.hair, ...(st.shades ? { hat: path('M-32,-4 a12,11 0 1,0 24,0 a12,11 0 1,0 -24,0 M2,-4 a12,11 0 1,0 24,0 a12,11 0 1,0 -24,0', { fill: '#8a5a2a', fillOpacity: 0.7, stroke: '#2b2a33', strokeWidth: 2 }) + path('M-8,-4 L2,-4', { stroke: '#2b2a33', strokeWidth: 2 }) } : {}) });
  const grimmHead = CHARS.grimm.head;
  CHARS.grimm.headFor = (st) => (st.silverMask ? { ...grimmHead, hat: path('M-30,-32 C-32,-56 44,-56 44,-30 C46,0 38,22 28,32 L-16,32 C-28,20 -30,-4 -30,-32Z', { fill: '#c9ced8', stroke: INK, strokeWidth: 3 }) + path('M-16,-8 q8,-6 16,0 M14,-8 q8,-6 16,0', { stroke: INK, strokeWidth: 3, fill: 'none' }) + path('M-20,-44 Q6,-52 34,-42', { stroke: '#fff', strokeWidth: 3, fill: 'none', opacity: 0.7 }) } : grimmHead);
  // Grimm without the skull mask (ch.45 L64-70): the shared face, faint stitched scar at the left temple, short black hair
  defs.grimmFace = { ...CHARS.grimm, headFor: undefined, head: { ...ONE, skin: CHARS.grimm.skin, stitches: 'M-34,-26 l14,22 M-32,-18 l6,-3 M-28,-10 l6,-3' } };
  void OL; void SK; void coatTorso; void purifierHelmet;
  return defs;
};
