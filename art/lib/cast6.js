// Cast introduced in EP66-70 (source chapters 66-70, Arc 7 — the nightless
// desert city of Kala-Zahr, a kingdom of undead human-creature hybrids):
// Kira the shadowless tracker (ch.69 L27-35), Zahira the copper-scaled warden
// (ch.68 L59-61), Regent Serkal (ch.68 L147-149), Solon the water-keeper
// (ch.68 L151-153), Haran the mantis armourer (ch.69 L121), the twins Tikky
// and Koko (ch.69 L177-179) and the hybrid border guards (ch.68 L47-49).
// Same rules as CHARS in figure.js: one definition per character; design
// choices for unstated details are recorded in docs/02-character-reference.md.
'use strict';
const { INK, path, circle, ellipse, rect, smooth } = require('./util');

module.exports = function cast6({ HAIR }) {
  const GOLD = '#e2b84a';
  const fem = { torso: 152, sw: 64, waist: 44, hw: 50, ua: 94, fa: 88, th: 140, sh: 136, uaW: 23, faW: 20, thW: 32, shW: 27 };
  const teen = { torso: 120, sw: 54, waist: 42, hw: 44, ua: 76, fa: 72, th: 106, sh: 102, headR: 44, uaW: 19, faW: 17, thW: 24, shW: 21 };

  // ---------- new hair styles (added to the shared HAIR table) ----------
  HAIR.kiraTail = (c) => { // Kira: short practical ponytail (ch.69 L29)
    const back = smooth([[-46, 4], [-52, -28], [-40, -58], [-8, -68], [24, -64], [44, -46], [50, -18], [46, 6], [32, -24], [-26, -24], [-42, 16]]);
    const tail = path('M-40,-40 C-80,-40 -96,-6 -88,30 C-76,8 -64,-12 -42,-20Z', { fill: c, stroke: INK, strokeWidth: 2.4 }) + rect(-50, -40, 14, 14, { fill: '#c8a060', stroke: INK, strokeWidth: 2, rx: 3 });
    return { behind: tail, back: path(back, { fill: c }), front: path('M-40,-24 C-30,-62 40,-66 50,-26 C34,-40 10,-44 -6,-36 C-18,-40 -30,-34 -40,-24Z', { fill: c }) };
  };
  HAIR.zahiraBraid = (c) => { // Zahira: long braid ending in a bone rattle (ch.68 L59)
    const back = smooth([[-46, 2], [-52, -30], [-38, -58], [-6, -68], [26, -62], [46, -42], [50, -14], [46, 8], [32, -24], [-26, -26], [-42, 16]]);
    let braid = '';
    for (let i = 0; i < 6; i++) braid += ellipse(-46 - i * 4, 0 + i * 26, 12, 15, { fill: c, stroke: INK, strokeWidth: 2 });
    braid += [0, 1, 2].map((i) => ellipse(-70, 160 + i * 14, 9, 7, { fill: '#e8dcc0', stroke: INK, strokeWidth: 2 })).join('');
    return { behind: braid, back: path(back, { fill: c }), front: path('M-40,-26 C-30,-62 40,-66 50,-26 C30,-42 0,-44 -40,-26Z', { fill: c }) };
  };

  // ---------- head overlays ----------
  const horns = path('M-24,-46 L-34,-78 L-14,-50Z M22,-48 L30,-80 L10,-52Z', { fill: '#1a1618', stroke: INK, strokeWidth: 2.4, strokeLinejoin: 'round' });
  const neckScales = (c) => [-30, -10, 10, 30].map((x, i) => path(`M${x - 8},${42 - (i % 2) * 4} q8,8 16,0`, { stroke: c, strokeWidth: 3, fill: 'none' })).join('');
  const crystalHalf = path('M-2,-52 C-30,-54 -42,-30 -40,-12 C-40,14 -26,38 -2,46Z', { fill: '#dff4ff', opacity: 0.55, stroke: '#9ad8f0', strokeWidth: 2.4 }) +
    path('M-30,-36 l14,10 M-36,0 l18,4 M-28,26 l14,-6', { stroke: '#ffffff', strokeWidth: 2, opacity: 0.8 }) +
    circle(-44, -4, 3.5, { fill: '#e8a020' }) + circle(44, -4, 3.5, { fill: '#e8a020' }); // the small secondary eyes at the outer corners (ch.68 L149)
  const foxEars = (c) => path('M-36,-40 L-58,-96 L-14,-54Z M30,-44 L52,-100 L10,-56Z', { fill: c, stroke: INK, strokeWidth: 2.6, strokeLinejoin: 'round' }) + path('M-34,-48 L-50,-84 L-22,-56Z M28,-50 L44,-88 L16,-58Z', { fill: '#f2c8b0' });
  const lensEyes = circle(-16, -2, 4.5, { fill: 'none', stroke: '#bff8e0', strokeWidth: 1.6 }) + circle(18, -2, 4.5, { fill: 'none', stroke: '#bff8e0', strokeWidth: 1.6 }); // Kira's double-lens irises
  const blindRight = path('M-34,-26 L-6,18', { stroke: '#7a3a2a', strokeWidth: 5, strokeLinecap: 'round' }) + ellipse(-18, -2, 9, 5, { fill: '#cfcfc6', stroke: INK, strokeWidth: 1.6 }); // Haran: burnt-out right eye (ch.69 L121)
  const antennae = path('M-10,-50 C-20,-90 -40,-100 -54,-96 M10,-50 C20,-90 40,-100 54,-96', { stroke: '#4a5a2a', strokeWidth: 3.4, fill: 'none' });

  // ---------- torsos ----------
  const kiraTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#c8b08a' }) + path(`M-40,${-L + 6} L40,${-L + 6} L32,${-L * 0.5} L-32,${-L * 0.5}Z`, { fill: '#b89c74', stroke: INK, strokeWidth: 2 }) +
    path(`M-46,${-L * 0.86} L46,${-L * 0.3}`, { stroke: '#7a5e3c', strokeWidth: 6 }) + rect(-60, -14, 120, 12, { fill: '#7a5e3c' }) + rect(30, -26, 22, 22, { fill: '#a8865a', stroke: INK, strokeWidth: 2, rx: 4 });
  const kiraFins = (L, D, st) => { // crystal fins folded along the shoulder blades (ch.69 L33); st.fins = 'open' spreads them
    const open = st.fins === 'open', o = [];
    for (const k of [-1, 1]) {
      const d = open
        ? `M${k * 14},${-L + 10} C${k * 120},${-L - 60} ${k * 220},${-L + 40} ${k * 190},${-L * 0.2} C${k * 140},${-L * 0.3} ${k * 70},${-L * 0.4} ${k * 14},${-L * 0.4}Z`
        : `M${k * 14},${-L + 10} C${k * 60},${-L - 20} ${k * 76},${-L * 0.5} ${k * 50},${-L * 0.16} C${k * 34},${-L * 0.3} ${k * 20},${-L * 0.4} ${k * 10},${-L * 0.4}Z`;
      o.push(path(d, { fill: '#dff8ff', opacity: 0.5, stroke: '#9ae8ff', strokeWidth: 3 }) + path(`M${k * 14},${-L + 10} L${k * (open ? 170 : 50)},${-L * (open ? 0.25 : 0.2)}`, { stroke: '#ffffff', strokeWidth: 2, opacity: 0.7 }));
    }
    return o.join('');
  };
  const zahiraTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#e2d4bc' }) +
    [0.82, 0.66, 0.5, 0.34].map((y) => path(`M-46,${-L * y} Q0,${-L * y + 16} 46,${-L * y}`, { stroke: '#a8987c', strokeWidth: 3, fill: 'none' })).join('') +
    path(`M-60,${-L - 20} L-34,${-L - 20} L-30,${-L * 0.7} L-60,${-L * 0.7}Z M60,${-L - 20} L34,${-L - 20} L30,${-L * 0.7} L60,${-L * 0.7}Z`, { fill: '#b87333' }) + rect(-60, -12, 120, 12, { fill: '#6a4a2a' });
  const serkalTorso = (L, D, st) => rect(-60, -L - 20, 120, L + 40, { fill: '#f6f4ee' }) + path(`M-16,${-L + 2} L0,${-L * 0.42} L16,${-L + 2}`, { stroke: GOLD, strokeWidth: 4, fill: 'none' }) +
    path(`M-60,${-L - 20} L-6,${-L - 20} L-6,10 L-60,10Z`, { fill: '#dff4ff', opacity: 0.35 }) + // the crystal half of the body shows through the robe
    circle(-22, -L * 0.64, 20, { fill: '#e8a020', opacity: 0.9, stroke: '#ffd45a', strokeWidth: 3 }) + circle(-22, -L * 0.64, 34, { fill: '#ffd45a', opacity: 0.25 }) + // amber-gold soul core (ch.68 L149)
    rect(-60, -12, 120, 10, { fill: GOLD });
  const serkalBack = (L) => path(`M-50,${-L + 4} L-80,${-L - 30} L-60,${-L * 0.6} L-90,${-L * 0.4} L-54,${-L * 0.2}Z`, { fill: '#dff4ff', opacity: 0.6, stroke: '#9ad8f0', strokeWidth: 3 });
  const solonTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#8a6a4a' }) + path(`M-44,${-L * 0.5} Q0,${-L * 0.36} 44,${-L * 0.5}`, { stroke: '#6a4a2a', strokeWidth: 4, fill: 'none' }) +
    rect(-60, -16, 120, 14, { fill: '#3a6a8a' }) + circle(0, -L * 0.7, 8, { fill: '#7ad8ff', stroke: INK, strokeWidth: 2 });
  const solonShell = (L, D, st) => { // the sandstone carapace with water channels and cold crystals (ch.68 L153)
    const r = D.sw * 0.95;
    let s = ellipse(0, -L * 0.55, r, L * 0.62, { fill: '#c8a878', stroke: INK, strokeWidth: 4 });
    s += path(`M${-r * 0.7},${-L * 0.55} Q0,${-L * 0.4} ${r * 0.7},${-L * 0.55} M0,${-L * 1.1} L0,${-L * 0.05} M${-r * 0.5},${-L * 0.95} L${r * 0.5},${-L * 0.15}`, { stroke: '#7ad8ff', strokeWidth: 4, fill: 'none', opacity: 0.8 });
    s += [[-0.5, 0.8], [0.45, 0.75], [-0.3, 0.3], [0.4, 0.3]].map(([x, y]) => circle(r * x, -L * y, 9, { fill: '#bff3ff', stroke: INK, strokeWidth: 2 })).join('');
    if (st.mist) s += [0, 1, 2].map((i) => circle(-r * 0.3 + i * r * 0.3, -L * 1.25 - i * 14, 26 + i * 6, { fill: '#e9f8ff', opacity: 0.35 })).join('');
    return s;
  };
  const haranTorso = (L) => rect(-60, -L - 20, 120, L + 40, { fill: '#5a4a36' }) + path(`M-50,${-L + 6} L50,${-L + 6} L44,${-L * 0.2} L-44,${-L * 0.2}Z`, { fill: '#6a5a3e', stroke: INK, strokeWidth: 2.4 }) +
    rect(-36, -L * 0.6, 72, L * 0.6, { fill: '#3a3226', stroke: INK, strokeWidth: 2 }) + rect(-60, -12, 120, 10, { fill: '#2a2218' }); // leather smith's apron
  const twinTorso = (col) => (L) => rect(-60, -L - 20, 120, L + 40, { fill: col }) + path(`M-40,${-L * 0.7} L40,${-L * 0.7}`, { stroke: '#7a5a3a', strokeWidth: 4 }) + rect(-60, -12, 120, 10, { fill: '#7a5a3a' });
  const membrane = (L, D) => path(`M${-D.sw * 0.5},${-L * 0.86} Q${-D.sw * 1.1},${-L * 0.5} ${-D.sw * 0.5},${-L * 0.1}Z M${D.sw * 0.5},${-L * 0.86} Q${D.sw * 1.1},${-L * 0.5} ${D.sw * 0.5},${-L * 0.1}Z`, { fill: '#e8b880', opacity: 0.55, stroke: INK, strokeWidth: 2 });
  const spots = (L) => [[-24, 0.7], [18, 0.6], [-10, 0.4], [26, 0.3]].map(([x, y], i) => circle(x, -L * y, 7, { fill: i % 2 ? '#e08a2a' : '#8a4ad0', opacity: 0.85 })).join('');

  // ---------- hybrid border guards (ch.68 L47-49): st.v picks the hybrid ----------
  const guardTorso = (L, D, st) => {
    let s = rect(-60, -L - 20, 120, L + 40, { fill: '#c8b48e' }) + path(`M-40,${-L + 8} L40,${-L + 8} L34,${-L * 0.4} L-34,${-L * 0.4}Z`, { fill: '#a8946c', stroke: INK, strokeWidth: 2.4 }) + rect(-60, -12, 120, 12, { fill: '#6a5236' });
    if (st.v === 'crystal') s += path(`M0,${-L - 20} L60,${-L - 20} L60,10 L0,10Z`, { fill: '#e8f8ff', opacity: 0.45 }) + path(`M10,${-L * 0.8} l30,20 M14,${-L * 0.4} l30,-10`, { stroke: '#ffffff', strokeWidth: 3, opacity: 0.7 });
    return s;
  };
  const guardUnder = (L, D, st) => (st.v === 'camel' ? ellipse(-D.sw * 0.1, -L * 0.85, D.sw * 0.6, L * 0.3, { fill: '#c89a6a', stroke: INK, strokeWidth: 3 }) : '');
  const guardHat = (v) => (v === 'spider' ? [[-18, -18], [18, -18], [-26, -30], [26, -30], [-10, -34], [10, -34]].map(([x, y]) => circle(x, y, 4, { fill: '#2a1a1a', stroke: '#ff8a4a', strokeWidth: 1.4 })).join('')
    : v === 'crystal' ? path('M2,-50 C30,-52 42,-30 40,-12 C40,14 26,38 2,46Z', { fill: '#e8f8ff', opacity: 0.5, stroke: '#9ad8f0', strokeWidth: 2 }) : '') +
    path('M-46,-24 C-40,-66 44,-66 50,-24 L50,-8 L-46,-8Z', { fill: '#d8c8a4', stroke: INK, strokeWidth: 2.6 }); // sand-coloured head cloth

  const defs = {
    kira: {
      dims: { ...fem, torso: 150, sw: 62 }, skin: '#d9a66a',
      head: { hair: 'kiraTail', hairColor: '#4a2e1c', eyes: '#2ad08a', skin: '#d9a66a', hat: lensEyes },
      torso: kiraTorso, under: kiraFins,
      arm: () => ({ ua: '#d9a66a', fa: '#c8b08a', cuff: '#7a5e3c', hand: '#d9a66a' }),
      leg: () => ({ th: '#b89c74', sh: '#c8b08a', knee: '#7a5e3c', foot: '#7a5e3c', sole: '#4a3a26' }),
    },
    zahira: {
      dims: { ...fem, torso: 168, th: 156, sh: 152, ua: 100, fa: 94 }, skin: '#d8b090',
      head: { hair: 'zahiraBraid', hairColor: '#8a3a22', eyes: '#e8a020', slit: true, skin: '#d8b090', hat: horns + neckScales('#b87333') },
      torso: zahiraTorso,
      arm: () => ({ ua: '#b87333', fa: '#b87333', cuff: '#e2d4bc', hand: '#c88a50', stitch: true }),
      leg: () => ({ th: '#8a7656', sh: '#e2d4bc', knee: '#b87333', foot: '#e2d4bc', sole: '#6a5a3e' }),
    },
    serkal: {
      dims: { torso: 196, sw: 76, waist: 58, hw: 60, ua: 116, fa: 110, th: 168, sh: 162, uaW: 26, faW: 23, thW: 34, shW: 29 }, skin: '#e2c8a8',
      head: { hair: 'slick', hairColor: '#e8e2d4', eyes: '#e8a020', skin: '#e2c8a8', hat: crystalHalf },
      torso: serkalTorso, under: serkalBack,
      arm: (st, side) => ({ ua: '#f6f4ee', fa: '#f6f4ee', cuff: GOLD, hand: side === 'left' ? '#cfe8f0' : '#cfe8f0' }),
      leg: () => ({ th: '#f6f4ee', sh: '#f6f4ee', foot: '#c8b08a', sole: GOLD }),
      skirt: () => ({ color: '#f6f4ee', len: 300, trim: GOLD }),
    },
    solon: {
      dims: { torso: 170, sw: 98, waist: 92, hw: 82, ua: 100, fa: 96, th: 130, sh: 126, uaW: 34, faW: 30, thW: 44, shW: 38 }, skin: '#d8b48e',
      head: { hair: 'balding', hairColor: '#9a948a', eyes: '#5a4a3a', skin: '#d8b48e', beard: '#9a948a' },
      torso: solonTorso, under: solonShell,
      arm: () => ({ ua: '#8a6a4a', fa: '#8a6a4a', cuff: '#3a6a8a', hand: '#d8b48e' }),
      leg: () => ({ th: '#6a4a2a', sh: '#6a4a2a', foot: '#4a3626', sole: '#2a1e16' }),
      skirt: () => ({ color: '#8a6a4a', len: 150, trim: '#3a6a8a' }),
    },
    haran: {
      dims: { torso: 170, sw: 80, waist: 60, hw: 58, ua: 112, fa: 106, th: 146, sh: 140, uaW: 26, faW: 22, thW: 32, shW: 27 }, skin: '#b8b07a',
      head: { hair: 'balding', hairColor: '#7a7a5a', eyes: '#3a4a1a', skin: '#b8b07a', hat: blindRight + antennae },
      torso: haranTorso,
      arm: (st, side) => (side === 'left' ? { ua: '#6a7a3a', fa: '#5a6a2a', cuff: '#4a5a2a', hand: '#5a6a2a' } : { ua: '#5a4a36', fa: '#b8b07a', cuff: '#3a3226', hand: '#b8b07a' }),
      leg: () => ({ th: '#4a3e2e', sh: '#4a3e2e', foot: '#2a2218', sole: '#1a140e' }),
    },
    tikky: {
      dims: { ...teen }, skin: '#e0b88a',
      head: { hair: 'messy', hairColor: '#c87a3a', eyes: '#3a2a1a', skin: '#e0b88a', hat: foxEars('#d08a4a') },
      headFor: (st) => ({ hair: 'messy', hairColor: '#c87a3a', eyes: '#3a2a1a', skin: st.mottled ? '#c89ac8' : '#e0b88a', hat: foxEars('#d08a4a') }),
      torso: (L, D, st) => twinTorso('#a8865a')(L) + (st.mottled ? spots(L) : ''), under: membrane,
      arm: (st) => ({ ua: st.mottled ? '#c89ac8' : '#e0b88a', fa: st.mottled ? '#e8a060' : '#e0b88a', cuff: '#7a5a3a', hand: '#e0b88a' }),
      leg: () => ({ th: '#8a6a4a', sh: '#8a6a4a', foot: '#5a4026', sole: '#3a2a16' }),
    },
    koko: {
      dims: { ...teen, torso: 116, sw: 50 }, skin: '#e0b88a',
      head: { hair: 'bob', hairColor: '#c87a3a', eyes: '#3a2a1a', skin: '#e0b88a', hat: foxEars('#d08a4a') },
      headFor: (st) => ({ hair: 'bob', hairColor: '#c87a3a', eyes: '#3a2a1a', skin: st.mottled ? '#c89ac8' : '#e0b88a', hat: foxEars('#d08a4a') }),
      torso: (L, D, st) => twinTorso('#c8a070')(L) + (st.mottled ? spots(L) : ''), under: membrane,
      arm: (st) => ({ ua: st.mottled ? '#e8a060' : '#e0b88a', fa: st.mottled ? '#c89ac8' : '#e0b88a', cuff: '#7a5a3a', hand: '#e0b88a' }),
      leg: () => ({ th: '#8a6a4a', sh: '#8a6a4a', foot: '#5a4026', sole: '#3a2a16' }),
      skirt: () => ({ color: '#c8a070', len: 90, trim: '#7a5a3a' }),
    },
    sandGuard: {
      dims: { torso: 176, sw: 82, waist: 62, hw: 60, uaW: 28, faW: 25, thW: 36, shW: 30 }, skin: '#c8a07a',
      head: { hair: 'none', eyes: '#3a2a1a', skin: '#c8a07a', hat: guardHat('') },
      headFor: (st) => ({ hair: 'none', eyes: st.v === 'spider' ? '#ff8a4a' : '#3a2a1a', skin: '#c8a07a', hat: guardHat(st.v) }),
      torso: guardTorso, under: guardUnder,
      arm: (st) => ({ ua: '#c8b48e', fa: st.v === 'fin' ? '#9a8a6a' : '#c8a07a', cuff: '#6a5236', hand: '#c8a07a', blades: st.v === 'fin' }),
      leg: () => ({ th: '#a8946c', sh: '#a8946c', foot: '#6a5236', sole: '#3a2a16' }),
    },
  };
  return defs;
};
