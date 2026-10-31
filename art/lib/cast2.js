// Cast introduced in EP11-20 (source chapters 11-20). Same rules as the
// original CHARS table in figure.js: every appearance of a character is drawn
// from the single definition below, so faces, hair and outfits never drift.
// Appearance comes from the source text; unstated details are design choices
// recorded in docs/02-character-reference.md.
'use strict';
const { INK, path, circle, ellipse, rect, g, f } = require('./util');
const { prop } = require('./props');

module.exports = function cast2(h) {
  const { SK, OL, coatTorso, plainTorso } = h;

  // ---------- torsos ----------
  function brunoTorso(L, D, st, si, skin) {
    const o = [];
    const shirtless = st.shirtTorn;
    o.push(rect(-60, -L - 20, 120, L + 40, { fill: shirtless ? skin : '#7a1e2a' }));
    if (!shirtless) {
      o.push(path(`M-30,${-L - 4} L0,${-L * 0.38} L30,${-L - 4}Z`, { fill: skin, stroke: INK, strokeWidth: 2 }));
      o.push(path(`M-30,${-L - 4} L-2,${-L * 0.4} M30,${-L - 4} L2,${-L * 0.4}`, { stroke: '#4a0e18', strokeWidth: 3, fill: 'none' }));
      o.push(rect(-60, -L * 0.36, 120, 4, { fill: '#000', opacity: 0.1 }));
      if (st.torn) o.push(path(`M-40,${-L * 0.6} l12,8 l-6,8 l14,6 M20,${-L * 0.3} l14,10 l-6,6`, { stroke: '#3a0a10', strokeWidth: 3, fill: 'none' }));
    }
    // layered scars (the "dragon scale" skin the source describes)
    const sc = st.carapace ? '#6a6670' : '#a86a5a';
    o.push(path(`M-14,${-L + 16} l18,10 M-8,${-L + 34} l20,-6 M-20,${-L * 0.62} l14,12 M6,${-L * 0.7} l16,4 M-6,${-L * 0.5} l10,10`, { stroke: sc, strokeWidth: 2.6, strokeLinecap: 'round' }));
    if (shirtless) o.push(path(`M-40,${-L * 0.5} l20,10 M14,${-L * 0.4} l24,-6 M-30,${-L * 0.25} l18,8 M10,${-L * 0.18} l20,6 M-44,${-L * 0.8} l16,4 M26,${-L * 0.82} l16,8`, { stroke: sc, strokeWidth: 2.6, strokeLinecap: 'round' }) + rect(-60, -14, 120, 14, { fill: '#2a2026' }));
    if (st.carapace) o.push(rect(-60, -L - 20, 120, L + 40, { fill: '#5a5a66', opacity: 0.35 }) + path(`M-40,${-L * 0.7} l20,-8 l20,8 l20,-8 l20,8 M-40,${-L * 0.4} l20,-8 l20,8 l20,-8 l20,8`, { stroke: '#3a3a44', strokeWidth: 2, fill: 'none' }));
    if (st.wounds) o.push(path(`M-30,${-L * 0.7} l16,12 M18,${-L * 0.5} l-10,16 M-20,${-L * 0.3} l20,4 M24,${-L * 0.82} l-8,14`, { stroke: '#b3101f', strokeWidth: 5, strokeLinecap: 'round' }));
    if (!shirtless) o.push(rect(-60, -12, 120, 12, { fill: '#2a2026' }) + rect(-8, -12, 16, 12, { fill: '#c9a040' }));
    return o.join('');
  }

  function cherryTorso(L, D) {
    return rect(-60, -L - 20, 120, L + 40, { fill: '#d4202f' }) +
      path(`M-16,${-L + 2} L0,${-L * 0.55} L16,${-L + 2}Z`, { fill: '#16151b' }) +
      path(`M-18,${-L + 2} L-4,${-L * 0.52} L-12,${-L * 0.3} M18,${-L + 2} L4,${-L * 0.52} L12,${-L * 0.3}`, { stroke: '#8a0e1a', strokeWidth: 3, fill: 'none' }) +
      circle(-6, -L * 0.36, 3, { fill: '#e8c25a' }) + circle(-6, -L * 0.24, 3, { fill: '#e8c25a' }) +
      rect(-60, -L * 0.14, 120, L * 0.2, { fill: '#16151b' });
  }

  function mothTorso(L) {
    return rect(-60, -L - 20, 120, L + 40, { fill: '#2a1e3a' }) +
      path(`M-30,${-L * 0.8} C-10,${-L * 0.9} -6,${-L * 0.4} -24,${-L * 0.2} C-36,${-L * 0.4} -40,${-L * 0.6} -30,${-L * 0.8}Z M30,${-L * 0.8} C10,${-L * 0.9} 6,${-L * 0.4} 24,${-L * 0.2} C36,${-L * 0.4} 40,${-L * 0.6} 30,${-L * 0.8}Z`, { fill: '#4a3466', stroke: '#160f22', strokeWidth: 1.6 }) +
      circle(-20, -L * 0.6, 4, { fill: '#c58aff', opacity: 0.8 }) + circle(20, -L * 0.6, 4, { fill: '#c58aff', opacity: 0.8 });
  }

  function roxyTorso(L) {
    const studs = [];
    for (let i = 0; i < 5; i++) studs.push(circle(-26, -L * 0.85 + i * L * 0.16, 2.6, { fill: '#c9ced6' }), circle(26, -L * 0.85 + i * L * 0.16, 2.6, { fill: '#c9ced6' }));
    return rect(-60, -L - 20, 120, L + 40, { fill: '#18171d' }) + path(`M-14,${-L + 2} L0,${-L * 0.5} L14,${-L + 2}Z`, { fill: '#2a2026' }) +
      path(`M-16,${-L + 2} L-2,${-L * 0.45} L-2,-6 M16,${-L + 2} L2,${-L * 0.45}`, { stroke: '#ff4aa0', strokeWidth: 2.6, fill: 'none' }) + studs.join('') +
      rect(-60, -12, 120, 10, { fill: '#2a2830' }) + path(`M${-20},${-L * 0.5} l30,24`, { stroke: '#ff4aa0', strokeWidth: 4, opacity: 0.8 });
  }

  function cassianTorso(L, D, st, si, skin) {
    const o = [rect(-60, -L - 20, 120, L + 40, { fill: '#3a1e48' })];
    o.push(path(`M-28,${-L - 4} L-6,${-L * 0.2} L6,${-L * 0.2} L28,${-L - 4}Z`, { fill: skin }));
    for (let i = 0; i < 6; i++) o.push(path(`M${-14 + (i % 3) * 10},${-L * (0.82 - i * 0.1)} q6,-6 10,0`, { stroke: '#c9c4c0', strokeWidth: 3, fill: 'none' }));
    o.push(path(`M-30,${-L - 4} L-8,${-L * 0.2} M30,${-L - 4} L8,${-L * 0.2}`, { stroke: '#e2b84a', strokeWidth: 4, fill: 'none' }));
    o.push(path(`M-44,${-L * 0.7} q8,-8 16,0 q8,8 16,0 M-44,${-L * 0.5} q8,-8 16,0 M28,${-L * 0.6} q8,-8 16,0`, { stroke: '#e2b84a', strokeWidth: 2, fill: 'none' }));
    if (st.heartStab) o.push(path(`M${si.sx('right') * 18},${-L * 0.42} l10,10`, { stroke: '#2a0a10', strokeWidth: 10 }) + circle(si.sx('right') * 20, -L * 0.38, 12, { fill: '#3a0a14' }));
    return o.join('');
  }

  function arachneTorso(L, D, st, si, skin) {
    return rect(-60, -L - 20, 120, L + 40, { fill: '#c0172a' }) + rect(-60, -L - 20, 120, 26, { fill: skin }) +
      path(`M-34,${-L + 6} Q0,${-L + 20} 34,${-L + 6}`, { stroke: '#7a0a16', strokeWidth: 3, fill: 'none' }) +
      path(Array.from({ length: 7 }, (_, i) => `M${-30 + i * 10},${-L + 10} Q${-24 + i * 9},${-L * 0.5} ${-20 + i * 7},-4`).join(' '), { stroke: '#ff5a6a', strokeWidth: 1.4, fill: 'none', opacity: 0.6 }) +
      rect(-60, -L * 0.45, 120, 6, { fill: '#7a0a16' });
  }

  function gulaTorso(L, D, st, si, skin) {
    return rect(-60, -L - 20, 120, L + 40, { fill: '#5a4a5e' }) + rect(-60, -L - 20, 120, 24, { fill: skin }) +
      path(`M-30,${-L + 4} l60,0`, { stroke: '#3a2e3e', strokeWidth: 3 }) +
      path(`M-26,${-L * 0.6} l10,8 l-6,6 l12,4 M14,${-L * 0.35} l12,10`, { stroke: '#2a1e2e', strokeWidth: 2.4, fill: 'none' }) +
      path(`M-20,${-L - 8} l40,0`, { stroke: '#2a1e2e', strokeWidth: 2 }) + path(Array.from({ length: 6 }, (_, i) => `M${-18 + i * 7},${-L - 13} l0,10`).join(' '), { stroke: '#2a1e2e', strokeWidth: 1.6 });
  }

  function claireTorso(L) {
    return rect(-60, -L - 20, 120, L + 40, { fill: '#2e3228' }) +
      path(`M-30,${-L + 4} L30,${-L + 4} L32,-6 L-32,-6Z`, { fill: '#3e4634', stroke: INK, strokeWidth: 2 }) +
      rect(-26, -L * 0.62, 18, 20, { fill: '#4a5240', stroke: INK, strokeWidth: 2 }) + rect(8, -L * 0.62, 18, 20, { fill: '#4a5240', stroke: INK, strokeWidth: 2 }) +
      rect(-26, -L * 0.34, 18, 18, { fill: '#4a5240', stroke: INK, strokeWidth: 2 }) + rect(8, -L * 0.34, 18, 18, { fill: '#4a5240', stroke: INK, strokeWidth: 2 }) +
      rect(-60, -12, 120, 10, { fill: '#1e2018' });
  }

  function cloakTorso(color, trim) {
    return (L) => rect(-60, -L - 20, 120, L + 40, { fill: color }) + path(`M-20,${-L * 0.8} l6,20 M16,${-L * 0.6} l-8,18 M-10,${-L * 0.3} l10,14`, { stroke: trim, strokeWidth: 2.4 }) + rect(-60, -12, 120, 10, { fill: '#000', opacity: 0.3 });
  }

  function rivetTorso(L) {
    const o = [rect(-60, -L - 20, 120, L + 40, { fill: '#5e636c' })];
    o.push(path(`M-40,${-L * 0.55} L40,${-L * 0.55} M0,${-L} L0,-4`, { stroke: '#3a3e46', strokeWidth: 4 }));
    for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) o.push(circle(-40 + c * 16, -L * 0.92 + r * L * 0.16, 3.4, { fill: '#a9afb9', stroke: INK, strokeWidth: 1.2 }));
    o.push(rect(-60, -14, 120, 14, { fill: '#3a3e46' }));
    return o.join('');
  }

  function kierTorso(L) {
    const o = [rect(-60, -L - 20, 120, L + 40, { fill: '#7e7e7a' })];
    for (let i = 0; i < 9; i++) o.push(path(`M-40,${-L + i * L * 0.11} L40,${-L + 14 + i * L * 0.11}`, { stroke: '#5e5e5a', strokeWidth: 2.4 }));
    o.push(path(`M-30,${-L - 4} L-10,-6 M30,${-L - 4} L10,-6`, { stroke: '#2a2a2e', strokeWidth: 14, opacity: 0.85 }));
    return o.join('');
  }

  function cinderTorso(L) {
    const o = [rect(-60, -L - 20, 120, L + 40, { fill: '#1a1820' })];
    for (let i = 0; i < 14; i++) o.push(circle(-36 + ((i * 37) % 72), -L * 0.1 - ((i * 53) % 100) / 100 * L * 0.8, 2.4, { fill: '#8a8680', opacity: 0.8 }));
    o.push(path(`M0,${-L + 4} L0,-6`, { stroke: '#3a3640', strokeWidth: 3 }));
    return o.join('');
  }

  function strangerTorso(L) {
    return rect(-60, -L - 20, 120, L + 40, { fill: '#d6d8dd' }) +
      path(`M-26,${-L - 16} L-10,${-L + 26} L0,${-L * 0.4} L10,${-L + 26} L26,${-L - 16}`, { fill: '#e8eaee', stroke: '#9aa0aa', strokeWidth: 2.4 }) +
      path(`M0,${-L * 0.4} L0,-6`, { stroke: '#9aa0aa', strokeWidth: 2 }) + rect(-60, -12, 120, 8, { fill: '#b8bcc4' });
  }

  function strangerHead() {
    return path('M-38,-14 C-40,-54 40,-54 38,-14 C38,14 22,40 0,46 C-22,40 -38,14 -38,-14Z', { fill: '#0d0c12', stroke: INK, strokeWidth: 3 }) +
      path('M-40,16 C-40,6 40,6 42,16 C42,34 22,48 0,50 C-22,48 -40,34 -40,16Z', { fill: '#b8bcc4', stroke: INK, strokeWidth: 2.4 }) +
      ellipse(2, -40, 74, 12, { fill: '#c9ccd2', stroke: INK, strokeWidth: 3 }) +
      path('M-34,-40 C-34,-86 38,-86 38,-40Z', { fill: '#d6d8dd', stroke: INK, strokeWidth: 3 }) + rect(-34, -52, 72, 8, { fill: '#9aa0aa' });
  }

  function rivetHelmet() {
    const o = [path('M-46,-10 C-48,-66 48,-66 48,-10 L46,44 L-44,44Z', { fill: '#5e636c', stroke: INK, strokeWidth: 3.4 })];
    o.push(rect(-36, -6, 76, 9, { fill: '#0b0a10' }) + rect(-30, -4, 64, 4, { fill: '#ff8a2a', opacity: 0.35 }));
    for (let i = 0; i < 7; i++) o.push(circle(-36 + i * 12, -28, 3.4, { fill: '#a9afb9', stroke: INK, strokeWidth: 1.2 }) + circle(-36 + i * 12, 30, 3.4, { fill: '#a9afb9', stroke: INK, strokeWidth: 1.2 }));
    o.push(path('M0,-62 L0,-4', { stroke: '#3a3e46', strokeWidth: 4 }));
    return o.join('');
  }

  // a small belt of bells (Nine-Bell)
  const bellBelt = (D) => [-0.4, -0.15, 0.12, 0.38].map((t) => g(prop('bell'), { transform: `translate(${f(D.hw * t)},-4) scale(.55)` })).join('');

  const fem = { torso: 152, sw: 64, waist: 44, hw: 50, ua: 94, fa: 88, th: 140, sh: 136, uaW: 23, faW: 20, thW: 32, shW: 27 };

  return {
    bruno: {
      dims: { torso: 220, sw: 118, waist: 94, hw: 82, ua: 126, fa: 120, th: 196, sh: 186, headR: 50, uaW: 46, faW: 42, thW: 52, shW: 44, handR: 16 }, skin: '#d29a78',
      head: { hair: 'crew', hairColor: '#2a1c16', eyes: '#4a3022', skin: '#d29a78', beard: '#2a1c16' },
      torso: brunoTorso,
      arm: (st) => (st.shirtTorn ? { ua: st.carapace ? '#9a8a86' : '#d29a78', fa: st.carapace ? '#9a8a86' : '#d29a78', cuff: '#d29a78' } : { ua: '#7a1e2a', fa: '#d29a78', cuff: '#5a1420' }),
      leg: () => ({ th: '#26222a', sh: '#26222a', foot: '#3a2418', sole: '#1a120e' }),
    },
    cherry: {
      dims: { ...fem }, skin: '#f6dccb',
      head: { hair: 'bob', hairColor: '#f2d27a', hairTip: '#ff5a9a', eyes: '#e8889a', skin: '#f6dccb', lips: '#d4102a' },
      torso: cherryTorso,
      arm: () => ({ ua: '#d4202f', fa: '#d4202f', cuff: '#16151b' }),
      leg: () => ({ th: '#f6dccb', sh: '#3a1418', foot: '#2a0e12', sole: '#16151b', heel: true }),
      skirt: () => ({ color: '#16151b', len: 36 }),
    },
    mothkid: {
      dims: { torso: 96, sw: 46, waist: 36, hw: 34, ua: 60, fa: 56, th: 80, sh: 78, headR: 42, uaW: 17, faW: 15, thW: 20, shW: 18 }, skin: '#d8d2dc',
      head: { hair: 'messy', hairColor: '#d6d4da', eyes: '#c58aff', eyeGlow: '#c58aff', skin: '#d8d2dc', mask: 'cloth' },
      torso: mothTorso,
      arm: () => ({ ua: '#2a1e3a', fa: '#2a1e3a', cuff: '#4a3466', hand: '#d8d2dc' }),
      leg: () => ({ th: '#2a1e3a', sh: '#2a1e3a', foot: '#1a1226', sole: '#4a3466' }),
      skirt: () => ({ color: '#2a1e3a', len: 60, trim: '#c58aff' }),
    },
    roxy: {
      dims: { ...fem, sw: 68 }, skin: '#f0d0bc',
      head: { hair: 'roxy', hairColor: '#e0381e', eyes: '#3a2a20', skin: '#f0d0bc', goggles: true },
      torso: roxyTorso,
      arm: () => ({ ua: '#18171d', fa: '#18171d', cuff: '#ff4aa0', hand: '#1e1d22' }),
      leg: () => ({ th: '#1e1d22', sh: '#1e1d22', knee: '#3a3842', foot: '#121117', sole: '#ff4aa0' }),
    },
    vane: {
      dims: { torso: 168, sw: 70, waist: 48, hw: 50, ua: 102, fa: 96, th: 152, sh: 148, uaW: 24, faW: 21, thW: 32, shW: 27 }, skin: '#e6d4ca',
      head: { hair: 'vane', hairColor: '#8a8890', eyes: '#a8343c', skin: '#e6d4ca' },
      torso: coatTorso('#141317', '#2a2830', '#2a2026'),
      arm: () => ({ ua: '#141317', fa: '#141317', cuff: '#2a2830', hand: '#e6d4ca' }),
      leg: () => ({ th: '#1a191e', sh: '#1a191e', foot: '#0e0d12', sole: '#333' }),
      skirt: () => ({ color: '#141317', len: 200 }),
    },
    cassian: {
      dims: { torso: 170, sw: 66, waist: 46, hw: 48, ua: 104, fa: 98, th: 152, sh: 148, uaW: 22, faW: 19, thW: 28, shW: 24 }, skin: '#ece8e4',
      head: { hair: 'slick', hairColor: '#2a2430', eyes: '#c9c23a', skin: '#ece8e4', slit: true },
      torso: cassianTorso,
      arm: () => ({ ua: '#3a1e48', fa: '#3a1e48', cuff: '#e2b84a', hand: '#ece8e4' }),
      leg: () => ({ th: '#2a1636', sh: '#2a1636', foot: '#16101c', sole: '#e2b84a' }),
      skirt: () => ({ color: '#3a1e48', len: 190, trim: '#e2b84a' }),
    },
    arachne: {
      dims: { ...fem, torso: 160, th: 150, sh: 146 }, skin: '#f4e4dc',
      head: { hair: 'arachne', hairColor: '#0e0d12', eyes: '#8a0f1e', skin: '#f4e4dc', lips: '#a3101f' },
      torso: arachneTorso,
      arm: () => ({ ua: '#f4e4dc', fa: '#f4e4dc', cuff: '#c0172a' }),
      leg: () => ({ th: '#c0172a', sh: '#c0172a', foot: '#dfe8f0', sole: '#9aa8b8', heel: true }),
      skirt: () => ({ color: '#c0172a', len: 270, trim: '#7a0a16' }),
    },
    gula: {
      dims: { torso: 120, sw: 54, waist: 40, hw: 42, ua: 74, fa: 70, th: 104, sh: 100, headR: 44, uaW: 19, faW: 17, thW: 24, shW: 21 }, skin: '#c4c8c0',
      head: { hair: 'gula', hairColor: '#6e6680', eyes: '#9aa0a4', skin: '#c4c8c0', fangs: true, stitches: 'M-34,30 l24,14 M-30,30 l-2,8 M-22,36 l-2,8 M-14,40 l-2,8' },
      torso: gulaTorso,
      arm: (st) => (st.armsOff ? { hidden: true } : { ua: '#c4c8c0', fa: '#c4c8c0', cuff: '#c4c8c0', stitch: true }),
      leg: () => ({ th: '#c4c8c0', sh: '#c4c8c0', foot: '#3a2e3e', sole: '#2a1e2e' }),
      skirt: () => ({ color: '#5a4a5e', len: 96, burnt: true }),
    },
    volt: {
      dims: { torso: 162, sw: 70, waist: 50, hw: 50, uaW: 24, faW: 21, thW: 32, shW: 27 }, skin: '#f1d6c4',
      head: { hair: 'volt', hairColor: '#f2d33a', eyes: '#3aa6ff', skin: '#f1d6c4' },
      torso: coatTorso('#2a2f6e', '#7ad0ff', '#16183a'),
      arm: (st, side) => (st.burntShoulder && side === 'right' ? { ua: '#5a2a1e', fa: '#2a2f6e', cuff: '#7ad0ff', burnt: true } : { ua: '#2a2f6e', fa: '#2a2f6e', cuff: '#7ad0ff' }),
      leg: () => ({ th: '#1e2148', sh: '#1e2148', foot: '#121430', sole: '#7ad0ff' }),
      skirt: () => ({ color: '#2a2f6e', len: 196, trim: '#7ad0ff' }),
    },
    claire: {
      dims: { ...fem, sw: 68 }, skin: '#f0dcd0',
      head: { hair: 'claire', hairColor: '#d8dce4', eyes: '#4a6a8a', skin: '#f0dcd0' },
      torso: claireTorso,
      arm: (st, side) => (((st.metalArm === true && side === 'right') || st.metalArm === side || st.metalArm === 'both') ? { ua: '#2e3228', fa: '#b9c0ca', cuff: '#6a707a', hand: '#b9c0ca', metal: true } : { ua: '#2e3228', fa: '#f0dcd0', cuff: '#2e3228' }),
      leg: () => ({ th: '#3a3e32', sh: '#3a3e32', knee: '#2a2c24', foot: '#1a1c16', sole: '#333' }),
    },
    grimm: {
      dims: { torso: 182, sw: 86, waist: 62, hw: 58, ua: 108, fa: 102, th: 158, sh: 152, uaW: 30, faW: 27, thW: 38, shW: 32 }, skin: '#d8d2c8',
      head: { hair: 'hood', hairColor: '#121117', eyes: '#cfe6ff', skin: '#d8d2c8', mask: 'skullPlain' },
      torso: cloakTorso('#141318', '#2a2830'),
      arm: () => ({ ua: '#141318', fa: '#141318', cuff: '#2a2830', hand: '#d8d2c8' }),
      leg: () => ({ th: '#1a191e', sh: '#1a191e', foot: '#0e0d12', sole: '#333' }),
      skirt: () => ({ color: '#141318', len: 220, burnt: true }),
    },
    rivetKing: {
      dims: { torso: 250, sw: 140, waist: 110, hw: 100, ua: 140, fa: 134, th: 220, sh: 210, headR: 54, uaW: 52, faW: 50, thW: 60, shW: 54, handR: 22 }, skin: '#5e636c',
      head: { helmet: rivetHelmet, skin: '#5e636c' },
      torso: rivetTorso,
      arm: () => ({ ua: '#5e636c', fa: '#5e636c', cuff: '#3a3e46', hand: '#6e737c' }),
      leg: () => ({ th: '#5e636c', sh: '#5e636c', knee: '#3a3e46', foot: '#3a3e46', sole: '#22252a' }),
      pauldrons: 'metal',
    },
    kier: {
      dims: { torso: 160, sw: 64, waist: 44, hw: 46, uaW: 21, faW: 18, thW: 28, shW: 24 }, skin: '#d8c8bc',
      head: { hair: 'short', hairColor: '#3a3a3e', eyes: '#6a6a6e', skin: '#d8c8bc', mask: 'cloth', maskColor: '#7e7e7a' },
      torso: kierTorso,
      arm: () => ({ ua: '#7e7e7a', fa: '#7e7e7a', cuff: '#5e5e5a', hand: '#d8c8bc' }),
      leg: () => ({ th: '#5e5e5a', sh: '#5e5e5a', foot: '#2a2a2e', sole: '#222' }),
      skirt: () => ({ color: '#2a2a2e', len: 170 }),
    },
    cinder: {
      dims: { torso: 140, sw: 62, waist: 50, hw: 50, ua: 90, fa: 86, th: 126, sh: 122, uaW: 22, faW: 19, thW: 28, shW: 24 }, skin: '#c9b8a8',
      head: { hair: 'hood', hairColor: '#1a1820', eyes: '#c9ccd6', skin: '#c9b8a8', stitches: 'M-30,-6 l10,4 M18,-24 l12,2 M-20,28 l8,6' },
      torso: cinderTorso,
      arm: () => ({ ua: '#1a1820', fa: '#1a1820', cuff: '#3a3640', hand: '#c9b8a8' }),
      leg: () => ({ th: '#1a1820', sh: '#1a1820', foot: '#121016', sole: '#222' }),
      skirt: () => ({ color: '#1a1820', len: 230, trim: '#5a5660' }),
    },
    ninebell: {
      dims: { torso: 178, sw: 60, waist: 40, hw: 44, ua: 110, fa: 104, th: 160, sh: 156, uaW: 19, faW: 16, thW: 24, shW: 20 }, skin: '#e4e0dc',
      head: { hair: 'wild', hairColor: '#8a8a90', eyes: '#5a5a62', skin: '#e4e0dc' },
      torso: cloakTorso('#5e5e66', '#3a3a42'),
      arm: () => ({ ua: '#5e5e66', fa: '#5e5e66', cuff: '#3a3a42', hand: '#e4e0dc' }),
      leg: () => ({ th: '#3a3a42', sh: '#3a3a42', foot: '#2a2a30', sole: '#222' }),
      skirt: () => ({ color: '#5e5e66', len: 230, burnt: true }),
      belt: (D) => bellBelt(D),
    },
    stranger: {
      dims: { torso: 176, ua: 106, fa: 100, th: 160, sh: 156, sw: 70, waist: 48, hw: 50, uaW: 24, faW: 21, thW: 30, shW: 26 }, skin: '#d6d8dd',
      head: { helmet: strangerHead, skin: '#d6d8dd' },
      torso: strangerTorso,
      arm: () => ({ ua: '#d6d8dd', fa: '#d6d8dd', cuff: '#b8bcc4', hand: '#fbfbfd' }),
      leg: () => ({ th: '#9aa0aa', sh: '#9aa0aa', foot: '#6a707a', sole: '#333' }),
      skirt: () => ({ color: '#d6d8dd', len: 230, trim: '#9aa0aa' }),
    },
    hostess: {
      dims: { ...fem }, skin: '#f2d8c8',
      head: { hair: 'lilith', hairColor: '#5a2a3a', eyes: '#5a3a2a', skin: '#f2d8c8', lips: '#c0172a' },
      torso: plainTorso('#6a2a6a', (L) => rect(-60, -L - 20, 120, 24, { fill: '#f2d8c8' })),
      arm: () => ({ ua: '#f2d8c8', fa: '#f2d8c8', cuff: '#f2d8c8' }),
      leg: () => ({ th: '#6a2a6a', sh: '#6a2a6a', foot: '#1a1018', sole: '#c0172a', heel: true }),
      skirt: () => ({ color: '#6a2a6a', len: 150 }),
    },
    velvetGuard: {
      dims: { torso: 168, sw: 84, waist: 60, hw: 56, uaW: 30, faW: 26, thW: 38, shW: 33 }, skin: '#d6b49a',
      head: { hair: 'crew', hairColor: '#16141a', eyes: '#2a2020', skin: '#d6b49a' },
      torso: coatTorso('#141318', '#2a2830', '#f4f4f6'),
      arm: () => ({ ua: '#141318', fa: '#141318', cuff: '#f4f4f6', hand: '#f4f4f6' }),
      leg: () => ({ th: '#141318', sh: '#141318', foot: '#0a0a0e', sole: '#333' }),
      skirt: () => ({ color: '#141318', len: 120 }),
    },
    gambler: {
      dims: { sw: 80, waist: 62 }, skin: '#d9b49a',
      head: { hair: 'short', hairColor: '#3a2a20', eyes: '#3a2a20', skin: '#d9b49a' },
      torso: coatTorso('#3a3442', '#8a7aa0', '#e8e4ec'),
      arm: () => ({ ua: '#3a3442', fa: '#3a3442', cuff: '#e8e4ec' }),
      leg: () => ({ th: '#2a2632', sh: '#2a2632', foot: '#16141a', sole: '#333' }),
    },
    doll: { // porcelain-finished revenants displayed in the gallery cases
      dims: { ...fem }, skin: '#f6f2ee',
      head: { hair: 'sera', hairColor: '#3a2a3a', eyes: '#6a6a7a', skin: '#f6f2ee' },
      torso: plainTorso('#e8e2ea', (L) => rect(-60, -L - 20, 120, 24, { fill: '#f6f2ee' }) + path(`M-30,${-L * 0.5} l60,0`, { stroke: '#c9b8d0', strokeWidth: 3 })),
      arm: () => ({ ua: '#f6f2ee', fa: '#f6f2ee', cuff: '#f6f2ee' }),
      leg: () => ({ th: '#e8e2ea', sh: '#e8e2ea', foot: '#f6f2ee', sole: '#c9b8d0' }),
      skirt: () => ({ color: '#e8e2ea', len: 220 }),
    },
  };
};
