// Cast introduced in EP21-30 (source chapters 21-30). Same rules as CHARS in
// figure.js: every appearance is drawn from the single definition below.
// Appearance comes from the source text; unstated details are design choices
// recorded in docs/02-character-reference.md.
'use strict';
const { INK, path, circle, ellipse, rect, g, f } = require('./util');

module.exports = function cast3(h) {
  const { SK, OL, purifierHelmet } = h;
  const fem = { torso: 152, sw: 64, waist: 44, hw: 50, ua: 94, fa: 88, th: 140, sh: 136, uaW: 23, faW: 20, thW: 32, shW: 27 };

  // ---------- Captain Ilya Nadir (ch.26-30): white armour, navy trim, gold sun ----------
  function ilyaTorso(L, D, st) {
    const o = [rect(-60, -L - 20, 120, L + 40, { fill: '#f2f4f8' })];
    o.push(path(`M-30,${-L * 0.42} L30,${-L * 0.42} L24,-4 L-24,-4Z`, { fill: '#1f2a4a' }));
    o.push(path(`M-34,${-L + 14} L0,${-L * 0.5} L34,${-L + 14}`, { stroke: '#1f2a4a', strokeWidth: 5, fill: 'none' }));
    o.push(path(`M-30,${-L + 18} L0,${-L * 0.46} L30,${-L + 18}`, { stroke: '#e2b84a', strokeWidth: 2, fill: 'none' }));
    o.push(circle(0, -L * 0.66, 9, { fill: 'none', stroke: '#e2b84a', strokeWidth: 3 }) + circle(0, -L * 0.66, 4, { fill: '#e2b84a' }));
    o.push(rect(-60, -10, 120, 12, { fill: '#1f2a4a' }) + rect(-8, -10, 16, 12, { fill: '#e2b84a' }));
    if (st.overdrive) o.push(path(`M-34,${-L + 14} L0,${-L * 0.5} L34,${-L + 14} M-24,${-L * 0.42} L-24,-4 M24,${-L * 0.42} L24,-4 M-30,${-L * 0.42} L30,${-L * 0.42}`, { stroke: '#fff3b0', strokeWidth: 3, fill: 'none', opacity: 0.95 }));
    if (st.broken) o.push(circle(0, -L * 0.62, 16, { fill: '#2a1a16' }) + path(`M0,${-L * 0.62} l-30,-22 M0,${-L * 0.62} l28,-18 l8,-14 M0,${-L * 0.62} l-22,26 M0,${-L * 0.62} l24,30`, OL(2.6)) + rect(-60, -L, 120, L, { fill: '#3a2a20', opacity: 0.18 }) + circle(0, -L * 0.62, 10, { fill: '#ff6a2a', opacity: 0.6 }));
    return o.join('');
  }
  // reactor cable plugged into the back of the armour (ch.29 L14)
  const ilyaBack = (L, D, st) => (st.cable ? path(`M${-D.sw * 0.3},${-L * 0.7} C${-D.sw * 1.4},${-L * 0.9} ${-D.sw * 2.2},${-L * 0.2} ${-D.sw * 3.4},${L * 0.3}`, { stroke: INK, strokeWidth: 20, fill: 'none', strokeLinecap: 'round' }) + path(`M${-D.sw * 0.3},${-L * 0.7} C${-D.sw * 1.4},${-L * 0.9} ${-D.sw * 2.2},${-L * 0.2} ${-D.sw * 3.4},${L * 0.3}`, { stroke: '#3a3e4a', strokeWidth: 14, fill: 'none', strokeLinecap: 'round' }) + path(`M${-D.sw * 0.3},${-L * 0.7} C${-D.sw * 1.4},${-L * 0.9} ${-D.sw * 2.2},${-L * 0.2} ${-D.sw * 3.4},${L * 0.3}`, { stroke: '#fff3b0', strokeWidth: 3, fill: 'none', strokeDasharray: '10 10' }) : '');

  // ---------- heavy "law-enforcer" squad (ch.27 L118): purifier armour, reflective heavy plates ----------
  function enforcerTorso(L) {
    const o = [rect(-60, -L - 20, 120, L + 40, { fill: '#d6dbe4' })];
    for (let i = 0; i < 4; i++) o.push(rect(-40, -L + 14 + i * L * 0.22, 80, L * 0.18, { fill: '#eef1f6', stroke: '#8a93a3', strokeWidth: 2, rx: 6 }));
    o.push(path(`M-30,${-L + 20} L30,${-L * 0.3}`, { stroke: '#ffffff', strokeWidth: 4, opacity: 0.7 }));
    o.push(circle(0, -L * 0.7, 8, { fill: 'none', stroke: '#e3a82b', strokeWidth: 3 }) + rect(-60, -10, 120, 12, { fill: '#5a6070' }));
    return o.join('');
  }

  // ---------- Lumina "Counter-Zero" guardian mech (ch.26 L146): revenant muscle under white titanium ----------
  function mechTorso(L, D, st) {
    const o = [rect(-60, -L - 20, 120, L + 40, { fill: '#7a5a5e' })];
    for (let i = 0; i < 5; i++) o.push(path(`M-50,${-L + 20 + i * L * 0.18} q50,-10 100,0`, { stroke: '#5a3a40', strokeWidth: 4, fill: 'none' }));
    o.push(path(`M-44,${-L + 4} L44,${-L + 4} L36,${-L * 0.42} L-36,${-L * 0.42}Z`, { fill: '#f2f4f6', stroke: INK, strokeWidth: 3 }));
    o.push(path(`M-30,${-L * 0.36} L30,${-L * 0.36} L26,-8 L-26,-8Z`, { fill: '#e6e8ec', stroke: INK, strokeWidth: 3 }));
    o.push(circle(0, -L * 0.7, 12, { fill: '#3fe0d0', stroke: INK, strokeWidth: 2.4 }) + circle(0, -L * 0.7, 20, { fill: '#3fe0d0', opacity: 0.25 }));
    if (st.cut) o.push(path(`M-60,${-L * 0.5} L60,${-L * 0.46}`, { stroke: '#0b0a10', strokeWidth: 12 }) + path(`M-60,${-L * 0.5} L60,${-L * 0.46}`, { stroke: '#ff6a2a', strokeWidth: 4 }));
    return o.join('');
  }
  function mechHead() {
    return path('M-40,-30 C-40,-60 40,-60 40,-30 L44,26 C30,44 -30,44 -44,26Z', { fill: '#f2f4f6', stroke: INK, strokeWidth: 3.4 }) +
      rect(-34, -12, 70, 16, { fill: '#121218', stroke: INK, strokeWidth: 2 }) + rect(-4, -10, 26, 12, { fill: '#ff2a3a', opacity: 0.9 }) +
      path('M-30,22 l60,0 M-26,30 l52,0', { stroke: '#9aa3b3', strokeWidth: 3 }) + path('M0,-56 L0,-30', { stroke: '#9aa3b3', strokeWidth: 3 });
  }

  // ---------- Lumina S-grade modified revenant (ch.28 L12-14) ----------
  function revSTorso(L, D, st) {
    const o = [rect(-60, -L - 20, 120, L + 40, { fill: '#6e6a70' })];
    o.push(path(`M-46,${-L + 8} L46,${-L + 8} L40,${-L * 0.45} L-40,${-L * 0.45}Z`, { fill: '#f4f3ee', stroke: INK, strokeWidth: 3 }));
    o.push(path(`M-30,${-L + 18} L0,${-L * 0.5} L30,${-L + 18}`, { stroke: '#e2b84a', strokeWidth: 4, fill: 'none' }));
    for (const [x, y] of [[-40, -L + 14], [40, -L + 14], [-34, -L * 0.48], [34, -L * 0.48], [0, -L + 12]]) o.push(circle(x, y, 4.6, { fill: '#a9afb9', stroke: INK, strokeWidth: 1.6 }));
    o.push(path(`M-30,${-L * 0.36} l14,10 M10,${-L * 0.3} l18,8 M-20,${-L * 0.16} l20,-4`, { stroke: '#4a464c', strokeWidth: 3 }));
    o.push(rect(-60, -10, 120, 12, { fill: '#e2b84a' }));
    return o.join('');
  }
  function revSHead(expr, side, ex) {
    const o = [path('M-44,-34 C-44,-66 44,-66 44,-34 L46,30 C30,48 -30,48 -46,30Z', { fill: '#dcdad4', stroke: INK, strokeWidth: 3.4 })];
    o.push(path('M-36,-6 L38,-6 M-36,10 L38,10', { stroke: '#9a978f', strokeWidth: 3 }));
    for (let i = 0; i < 5; i++) o.push(circle(-32 + i * 16, -40, 3.4, { fill: '#a9afb9', stroke: INK, strokeWidth: 1.2 }));
    // red stimulant tube from the nape into the spine
    o.push(path('M-40,20 C-70,30 -76,70 -60,110', { stroke: INK, strokeWidth: 12, fill: 'none', strokeLinecap: 'round' }) + path('M-40,20 C-70,30 -76,70 -60,110', { stroke: ex.tubeCut ? '#5a1420' : '#e0102a', strokeWidth: 7, fill: 'none', strokeLinecap: 'round' }));
    if (ex.soulless) o.push(rect(-46, -66, 92, 114, { fill: '#000', opacity: 0.25 }));
    return o.join('');
  }

  // ---------- Velvet District generals (ch.30 L92, L130) ----------
  function velvetTux(L) {
    return rect(-60, -L - 20, 120, L + 40, { fill: '#3a1a4e' }) + path(`M-16,${-L + 2} L0,${-L * 0.42} L16,${-L + 2}Z`, { fill: '#f2eef4' }) +
      path(`M-6,${-L + 6} L6,${-L + 6} L0,${-L + 14}Z M-6,${-L + 22} L6,${-L + 22} L0,${-L + 14}Z`, { fill: '#7a1a8a', stroke: INK, strokeWidth: 1.2 }) +
      path(`M-18,${-L + 2} L-4,${-L * 0.42} L-14,-6 M18,${-L + 2} L4,${-L * 0.42} L14,-6`, { stroke: '#24102e', strokeWidth: 3, fill: 'none' }) +
      circle(-6, -L * 0.3, 2.6, { fill: '#c9a040' }) + circle(-6, -L * 0.18, 2.6, { fill: '#c9a040' });
  }
  const topHat = path('M-34,-44 L-30,-100 L30,-100 L34,-44Z', { fill: '#24102e', stroke: INK, strokeWidth: 3 }) + rect(-30, -58, 60, 10, { fill: '#7a1a8a' }) + ellipse(0, -44, 56, 10, { fill: '#24102e', stroke: INK, strokeWidth: 3 });
  function featherTorso(L, D, st, si, skin) {
    const o = [rect(-60, -L - 20, 120, L + 40, { fill: '#2a1e26' }), rect(-60, -L - 20, 120, 24, { fill: skin })];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) o.push(path(`M${-48 + c * 24},${-L + 6 + r * 20} q12,16 24,0`, { fill: '#c08a9a', stroke: '#8a5a6a', strokeWidth: 1.6 }));
    return o.join('');
  }
  function corsetTorso(L, D, st, si, skin) {
    const o = [rect(-60, -L - 20, 120, L + 40, { fill: '#a3101f' }), rect(-60, -L - 20, 120, 24, { fill: skin })];
    o.push(path(`M-34,${-L + 8} Q0,${-L + 20} 34,${-L + 8}`, { stroke: '#e2b84a', strokeWidth: 4, fill: 'none' }));
    for (let i = 0; i < 5; i++) o.push(path(`M-12,${-L * (0.8 - i * 0.14)} L12,${-L * (0.74 - i * 0.14)} M12,${-L * (0.8 - i * 0.14)} L-12,${-L * (0.74 - i * 0.14)}`, { stroke: '#e2b84a', strokeWidth: 2 }));
    for (const y of [0.85, 0.6, 0.35]) o.push(path(`M-46,${-L * y} l-12,-6 l10,10Z M46,${-L * y} l12,-6 l-10,10Z`, { fill: '#c9ced6', stroke: INK, strokeWidth: 1.6 }));
    return o.join('');
  }
  function curatorTorso(L) {
    return rect(-60, -L - 20, 120, L + 40, { fill: '#e8e6ee' }) + path(`M-14,${-L + 2} L0,${-L * 0.45} L14,${-L + 2}`, { fill: '#3a3a52', stroke: INK, strokeWidth: 2 }) +
      path(`M-16,${-L + 2} L-2,${-L * 0.45} L-2,-6`, { stroke: '#9aa0c0', strokeWidth: 3, fill: 'none' }) + rect(-60, -10, 120, 8, { fill: '#9aa0c0' });
  }
  const crackle = 'M-30,-20 l10,8 l-4,10 M12,-30 l8,12 l10,2 M-20,20 l12,-4 l6,10 M20,14 l10,10 M-34,6 l-4,12';
  function silkTorso(L, D, st, si, skin) {
    return rect(-60, -L - 20, 120, L + 40, { fill: '#b8b0c4' }) + rect(-60, -L - 20, 120, 22, { fill: skin }) +
      path(Array.from({ length: 5 }, (_, i) => `M${-40 + i * 20},${-L + 10} Q${-36 + i * 18},${-L * 0.5} ${-30 + i * 14},-4`).join(' '), { stroke: '#e8e2f0', strokeWidth: 2, fill: 'none' }) + rect(-60, -L * 0.45, 120, 6, { fill: '#8a0a16' });
  }

  // ---------- Claire burnt down to her steel skeleton (ch.24 L110-112, L184) ----------
  function bonesTorso(L, D, st) {
    const o = [rect(-60, -L - 20, 120, L + 40, { fill: '#2a2c32' })];
    o.push(path(`M0,${-L} L0,-6`, { stroke: '#c9d0da', strokeWidth: 10 }));
    for (let i = 0; i < 6; i++) { const y = -L + 18 + i * L * 0.12; const cracked = st.cracked && i >= 1 && i <= 4; o.push(path(`M0,${y} C-26,${y - 6} -36,${y + 6} -34,${y + 16} M0,${y} C26,${y - 6} 36,${y + 6} 34,${y + 16}`, { stroke: cracked ? '#8a8f98' : '#c9d0da', strokeWidth: 6, fill: 'none', strokeLinecap: 'round' })); if (cracked) o.push(path(`M${-20},${y + 2} l4,6 l-4,4`, { stroke: '#2a2c32', strokeWidth: 2, fill: 'none' })); }
    o.push(path(`M-30,-10 Q0,-30 30,-10`, { stroke: '#c9d0da', strokeWidth: 8, fill: 'none' }));
    if (st.flesh) o.push(rect(-60, -L * st.flesh, 120, L * st.flesh + 20, { fill: '#f0dcd0', opacity: 0.9 }) + rect(-60, -L * st.flesh, 120, 6, { fill: '#c08a7a' }));
    return o.join('');
  }
  function bonesHead(expr, side, ex) {
    const fx = side === 'front' ? 0 : 8;
    let s = path('M-38,-14 C-40,-56 40,-56 38,-14 C38,10 26,30 14,40 L12,50 L-12,50 L-14,40 C-26,30 -38,10 -38,-14Z', { fill: '#c9d0da', stroke: INK, strokeWidth: 3 });
    s += ellipse(fx - 14, -2, 11, 10, { fill: '#121218' }) + ellipse(fx + 16, -2, 11, 10, { fill: '#121218' });
    s += circle(fx - 14, -2, 4.6, { fill: '#5ad8ff' }) + circle(fx + 16, -2, 4.6, { fill: '#5ad8ff' }) + circle(fx - 14, -2, 10, { fill: '#5ad8ff', opacity: 0.25 }) + circle(fx + 16, -2, 10, { fill: '#5ad8ff', opacity: 0.25 });
    s += path(`M${fx - 12},32 L${fx + 14},32 M${fx - 6},28 v10 M${fx + 2},28 v10 M${fx + 9},28 v10`, { stroke: INK, strokeWidth: 2 });
    s += path('M-30,-36 l12,8 M20,-40 l10,10', { stroke: '#8a8f98', strokeWidth: 2 });
    if (ex.flesh) s = path('M-40,-20 C-40,-60 40,-62 40,-20 C40,10 30,36 0,46 C-30,36 -40,10 -40,-20Z', { fill: '#f0dcd0', stroke: INK, strokeWidth: 3 }) + path('M-42,-24 C-36,-64 44,-66 46,-26 L36,-8 L24,-30 L10,-6 L-6,-30 L-20,-6 L-30,-28Z', { fill: '#d8dce4', stroke: INK, strokeWidth: 2 }) + ellipse(fx - 14, 2, 9, 9, { fill: '#121218' }) + circle(fx - 14, 2, 4, { fill: '#5ad8ff' }) + ellipse(fx + 16, 2, 6, 4, { fill: '#4a6a8a' }) + path(`M${fx - 2},30 l14,-2`, { stroke: INK, strokeWidth: 2.4 });
    return s;
  }

  // ---------- Rivet King's heavy iron training puppets (ch.22 L64-66) ----------
  function puppetTorso(L, D, st) {
    const o = [rect(-60, -L - 20, 120, L + 40, { fill: '#5a5e66' })];
    for (let i = 0; i < 3; i++) o.push(rect(-46, -L + 10 + i * L * 0.3, 92, L * 0.26, { fill: '#6e737c', stroke: INK, strokeWidth: 3 }));
    if (st.core) o.push(circle(0, -L * 0.62, 16, { fill: '#9fd8ff', stroke: INK, strokeWidth: 3 }) + circle(0, -L * 0.62, 28, { fill: '#9fd8ff', opacity: 0.25 }));
    return o.join('');
  }
  const puppetHead = (expr, side, ex) => path('M-36,-40 L36,-40 L40,30 L-40,30Z', { fill: '#6e737c', stroke: INK, strokeWidth: 3.4 }) + circle(side === 'front' ? 0 : 12, -4, 10, { fill: ex.dead ? '#2a2a32' : '#ff3a3a', stroke: INK, strokeWidth: 2 }) + path('M-30,16 l60,0', { stroke: '#3a3e46', strokeWidth: 4 });
  const shield = (L, D, st) => (st.shield ? path(`M${D.sw * 0.5},${-L * 1.02} L${D.sw * 1.3},${-L * 0.98} L${D.sw * 1.3},${-L * 0.1} L${D.sw * 0.9},${L * 0.05} L${D.sw * 0.5},${-L * 0.1}Z`, { fill: '#7a7f8a', stroke: INK, strokeWidth: 5, transform: st.shieldOpen ? `rotate(-18 ${D.sw * 0.5} ${-L})` : undefined }) : '');

  return {
    puppet: {
      dims: { torso: 220, sw: 110, waist: 84, hw: 80, ua: 130, fa: 126, th: 190, sh: 180, headR: 44, uaW: 40, faW: 36, thW: 48, shW: 42, handR: 18 }, skin: '#6e737c',
      head: { helmet: puppetHead, skin: '#6e737c' },
      torso: puppetTorso, over: shield,
      arm: () => ({ ua: '#5a5e66', fa: '#6e737c', cuff: '#3a3e46', hand: '#3a3e46' }),
      leg: () => ({ th: '#5a5e66', sh: '#6e737c', knee: '#3a3e46', foot: '#3a3e46', sole: '#222' }),
      pauldrons: 'metal',
    },
    ilya: {
      dims: { ...fem, torso: 166, th: 152, sh: 148, sw: 70 }, skin: '#ecd2bc',
      head: { hair: 'short', hairColor: '#111016', eyes: '#2a2026', skin: '#ecd2bc', stitches: 'M-6,8 L24,0' },
      torso: ilyaTorso, under: ilyaBack,
      arm: (st) => ({ ua: '#1f2a4a', fa: '#f2f4f8', cuff: '#e2b84a', hand: '#f6f7fa', stripe: st.overdrive ? '#fff3b0' : undefined }),
      leg: () => ({ th: '#f2f4f8', sh: '#f2f4f8', knee: '#1f2a4a', foot: '#1f2a4a', sole: '#e2b84a' }),
      pauldrons: 'purifier',
    },
    enforcer: {
      dims: { torso: 180, sw: 96, waist: 72, hw: 64, uaW: 36, faW: 32, thW: 44, shW: 38 }, skin: SK.light,
      head: { helmet: purifierHelmet, skin: SK.light },
      torso: enforcerTorso,
      arm: () => ({ ua: '#d6dbe4', fa: '#eef1f6', cuff: '#8a93a3', hand: '#5a6070' }),
      leg: () => ({ th: '#d6dbe4', sh: '#d6dbe4', knee: '#8a93a3', foot: '#5a6070', sole: '#333' }),
      pauldrons: 'purifier',
    },
    mech: {
      dims: { torso: 240, sw: 130, waist: 96, hw: 92, ua: 140, fa: 140, th: 210, sh: 200, headR: 48, uaW: 46, faW: 44, thW: 56, shW: 50, handR: 20 }, skin: '#f2f4f6',
      head: { helmet: mechHead, skin: '#f2f4f6' },
      torso: mechTorso,
      arm: () => ({ ua: '#7a5a5e', fa: '#f2f4f6', cuff: '#9aa3b3', hand: '#d6dbe4' }),
      leg: () => ({ th: '#f2f4f6', sh: '#f2f4f6', knee: '#7a5a5e', foot: '#d6dbe4', sole: '#5a6070' }),
      pauldrons: 'metal',
    },
    revS: {
      dims: { torso: 250, sw: 140, waist: 104, hw: 96, ua: 146, fa: 140, th: 214, sh: 204, headR: 50, uaW: 56, faW: 50, thW: 60, shW: 52, handR: 22 }, skin: '#6e6a70',
      head: { helmet: revSHead, skin: '#6e6a70' },
      torso: revSTorso,
      arm: () => ({ ua: '#6e6a70', fa: '#f4f3ee', cuff: '#e2b84a', hand: '#6e6a70' }),
      leg: () => ({ th: '#f4f3ee', sh: '#f4f3ee', knee: '#6e6a70', foot: '#e2b84a', sole: '#3a3a42' }),
      pauldrons: 'purifier',
    },
    marquis: {
      dims: { torso: 168, sw: 66, waist: 46, hw: 48, ua: 102, fa: 96, th: 150, sh: 146, uaW: 22, faW: 19, thW: 28, shW: 24 }, skin: '#ece2e6',
      head: { hair: 'slick', hairColor: '#2a1a30', eyes: '#8a2aa0', skin: '#ece2e6', hat: topHat },
      torso: velvetTux,
      arm: () => ({ ua: '#3a1a4e', fa: '#3a1a4e', cuff: '#f2eef4', hand: '#f2eef4' }),
      leg: () => ({ th: '#2a1238', sh: '#2a1238', foot: '#120a16', sole: '#7a1a8a' }),
      skirt: () => ({ color: '#3a1a4e', len: 150, trim: '#7a1a8a' }),
    },
    valentine: {
      dims: { torso: 160, sw: 62, waist: 44, hw: 46, uaW: 21, faW: 18, thW: 27, shW: 23 }, skin: '#f4e2e4',
      head: { hair: 'vane', hairColor: '#e8c0cc', eyes: '#c0485a', skin: '#f4e2e4', lips: '#c0485a' },
      torso: featherTorso,
      arm: () => ({ ua: '#c08a9a', fa: '#2a1e26', cuff: '#c08a9a', hand: '#f4e2e4' }),
      leg: () => ({ th: '#2a1e26', sh: '#2a1e26', foot: '#16101a', sole: '#c08a9a' }),
      skirt: () => ({ color: '#b07a8a', len: 220, burnt: true }),
    },
    corsetta: {
      dims: { ...fem, torso: 176, th: 162, sh: 158, sw: 72, uaW: 25, faW: 22 }, skin: '#f0d8cc',
      head: { hair: 'bob', hairColor: '#4a0e18', eyes: '#c9a040', skin: '#f0d8cc', lips: '#a3101f' },
      torso: corsetTorso,
      arm: () => ({ ua: '#f0d8cc', fa: '#a3101f', cuff: '#e2b84a', hand: '#3a0a10' }),
      leg: () => ({ th: '#3a0a10', sh: '#a3101f', knee: '#e2b84a', foot: '#3a0a10', sole: '#e2b84a', heel: true }),
      skirt: () => ({ color: '#3a0a10', len: 90, trim: '#e2b84a' }),
    },
    porcelain: {
      dims: { torso: 166, sw: 70, waist: 50, hw: 50, uaW: 24, faW: 21, thW: 30, shW: 26 }, skin: '#f6f4f2',
      head: { hair: 'bald', hairColor: '#f6f4f2', eyes: '#3a5aa0', skin: '#f6f4f2', stitches: crackle },
      torso: curatorTorso,
      arm: () => ({ ua: '#e8e6ee', fa: '#e8e6ee', cuff: '#9aa0c0', hand: '#f6f4f2' }),
      leg: () => ({ th: '#3a3a52', sh: '#3a3a52', foot: '#1a1a26', sole: '#9aa0c0' }),
      skirt: () => ({ color: '#e8e6ee', len: 190, trim: '#9aa0c0' }),
    },
    silk: {
      dims: { ...fem }, skin: '#f2e0d8',
      head: { hair: 'lilith', hairColor: '#c9c4d4', eyes: '#6a4a8a', skin: '#f2e0d8', lips: '#a3101f', glasses: true },
      torso: silkTorso,
      arm: () => ({ ua: '#b8b0c4', fa: '#b8b0c4', cuff: '#8a0a16', hand: '#f2e0d8' }),
      leg: () => ({ th: '#b8b0c4', sh: '#b8b0c4', foot: '#2a2230', sole: '#8a0a16', heel: true }),
      skirt: () => ({ color: '#b8b0c4', len: 230, trim: '#8a0a16' }),
    },
    claireBones: {
      dims: { ...fem, sw: 68, uaW: 16, faW: 14, thW: 20, shW: 18 }, skin: '#c9d0da',
      head: { helmet: bonesHead, skin: '#c9d0da' },
      torso: bonesTorso,
      arm: (st) => ({ ua: '#c9d0da', fa: '#c9d0da', cuff: '#8a8f98', hand: '#c9d0da', metal: true, ...(st.armBroken ? { ua: '#8a8f98' } : {}) }),
      leg: () => ({ th: '#c9d0da', sh: '#c9d0da', knee: '#8a8f98', foot: '#8a8f98', sole: '#5a5e66' }),
    },
  };
};
