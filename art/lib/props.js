// Hand-held props. Drawn in a local frame: origin at the hand, the prop's
// main axis along +x (rotated by the caller to the forearm angle).
'use strict';
const { INK, path, circle, ellipse, rect, g, id, linGrad } = require('./util');
const S = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' };

const PROPS = {
  sword(o = {}) { // Sera's long sword, dark steel
    const len = o.len || 230;
    return path(`M-26,-5 L14,-5 L14,5 L-26,5Z`, { fill: '#2b2730', ...S }) +
      path(`M14,-15 L22,-15 L22,15 L14,15Z`, { fill: '#55505c', ...S }) +
      path(`M22,-6 L${len},-3 L${len + 22},0 L${len},3 L22,6Z`, { fill: o.color || '#3a3a46', ...S }) +
      path(`M28,-1 L${len},-1`, { stroke: '#b9bccb', strokeWidth: 2, opacity: 0.8 }) +
      (o.cracks ? path(`M${len * 0.4},-5 l4,4 l-3,3 M${len * 0.62},5 l3,-4 l4,2 M${len * 0.8},-4 l3,5`, { stroke: '#e9ecf4', strokeWidth: 1.4, fill: 'none' }) : '') +
      // EP25+: reforged with black ore and ash-flame — ember-red lines along the edge and the fuller (ch.25 L140)
      (o.ember ? path(`M30,0 L${len},0`, { stroke: '#ff3a1a', strokeWidth: 2.4, opacity: 0.95 }) + path(`M24,-5 L${len},-3 L${len + 22},0`, { stroke: '#c0172a', strokeWidth: 1.6, fill: 'none' }) + (o.flame ? path(`M30,-8 C${len * 0.3},-30 ${len * 0.6},-10 ${len * 0.8},-34 C${len * 0.9},-10 ${len},-24 ${len + 30},0 C${len},12 ${len * 0.5},20 30,8Z`, { fill: '#ff4a1a', opacity: 0.45 }) : '') : '');
  },
  sheathed() { return path('M-10,-6 L160,-4 L170,0 L160,4 L-10,6Z', { fill: '#1f1d25', ...S }) + rect(-34, -5, 24, 10, { fill: '#2b2730', ...S }); },
  spear(o = {}) { // Lucas: gold geometric spear with gold/teal rings
    const len = o.len || 300, glow = o.off ? 0.15 : 1;
    const gid = id('sp');
    return `<defs>${linGrad(gid, [[0, '#fff3c4'], [0.5, '#f2c650'], [1, '#b77d1a']], 0, 0, 0, 1)}</defs>` +
      (o.off ? '' : path(`M${len - 40},0 L${len + 70},0`, { stroke: '#ffe48a', strokeWidth: 26, opacity: 0.22, strokeLinecap: 'round' })) +
      path(`M-110,-5 L${len - 70},-5 L${len - 70},5 L-110,5Z`, { fill: `url(#${gid})`, ...S }) +
      path(`M${len - 74},-12 L${len - 50},-22 L${len + 36},0 L${len - 50},22 L${len - 74},12Z`, { fill: `url(#${gid})`, ...S }) +
      path(`M${len - 60},0 L${len + 20},0`, { stroke: '#fff7d6', strokeWidth: 3, opacity: glow }) +
      ellipse(len - 96, 0, 9, 26, { fill: 'none', stroke: '#f2c650', strokeWidth: 5, opacity: 0.95 }) +
      ellipse(len - 120, 0, 7, 20, { fill: 'none', stroke: '#3fe0d0', strokeWidth: 4, opacity: glow }) +
      path(`M${len - 140},-14 L${len - 128},0 L${len - 140},14 L${len - 152},0Z`, { fill: '#3fe0d0', stroke: INK, strokeWidth: 2, opacity: Math.max(0.5, glow) });
  },
  pistol() { // energy pistol, silver
    return path('M-6,-10 L46,-10 L52,-4 L52,4 L18,4 L12,22 L0,22 L4,4 L-6,4Z', { fill: '#c9ced9', ...S }) + rect(30, -8, 14, 4, { fill: '#7ad8ff' });
  },
  brassPistol() { // Latch
    return path('M-6,-10 L50,-10 L56,-4 L56,4 L18,4 L12,24 L0,24 L4,4 L-6,4Z', { fill: '#c99a3a', ...S }) + circle(10, 12, 7, { fill: 'none', stroke: '#8a6420', strokeWidth: 3 }) + circle(48, -6, 2, { fill: '#ffe9a8' });
  },
  rifle(o = {}) { // Purifier mark-four light rifle
    const hot = o.hot;
    return path('M-40,-8 L-6,-12 L80,-12 L96,-6 L96,6 L20,6 L10,22 L-4,22 L0,6 L-40,8Z', { fill: '#eef0f4', ...S }) +
      rect(30, -10, 66, 6, { fill: hot ? '#ff6a2a' : '#bfefff', opacity: 0.95 }) +
      (hot ? path('M96,-14 q10,-12 0,-26 q-8,-12 4,-24', { stroke: '#e8eef5', strokeWidth: 5, fill: 'none', opacity: 0.7 }) : '') +
      rect(-30, -4, 18, 8, { fill: '#9aa3b3' });
  },
  shotgun() {
    return path('M-30,-8 L90,-8 L90,4 L10,4 L4,20 L-10,20 L-6,4 L-30,6Z', { fill: '#4a3f36', ...S }) + rect(20, -12, 70, 5, { fill: '#2a2a30', stroke: INK, strokeWidth: 2 });
  },
  lamp() { // Knell's lantern, purple-blue flame
    return path('M0,0 L0,20', { stroke: '#8a8f9e', strokeWidth: 3 }) +
      ellipse(0, 52, 34, 34, { fill: '#9d7bff', opacity: 0.18 }) +
      path('M-14,20 L14,20 L18,30 L18,74 L-18,74 L-18,30Z', { fill: '#3c4252', ...S }) +
      path('M-12,32 L12,32 L12,68 L-12,68Z', { fill: '#cbbcff', opacity: 0.35 }) +
      path('M0,40 C-8,52 -6,64 0,66 C6,64 8,52 0,40Z', { fill: '#8f7bff' }) + path('M0,50 C-3,56 -2,62 0,63 C2,62 3,56 0,50Z', { fill: '#d6f0ff' });
  },
  bell() { return path('M0,0 L0,10 M-12,30 C-12,12 12,12 12,30 L16,34 L-16,34Z', { fill: '#b8a46a', ...S }) + circle(0, 36, 3, { fill: INK }); },
  notebook() { return rect(-4, -20, 34, 44, { fill: '#5a3a26', ...S, rx: 3 }) + path('M4,-12 h20 M4,-4 h20', { stroke: '#c9a77a', strokeWidth: 2 }); },
  quill() { return path('M0,0 L60,-30 C50,-40 30,-34 0,0Z', { fill: '#eae6dd', ...S }); },
  key() { // Latch's giant brass key with glowing tip
    return ellipse(150, 0, 34, 34, { fill: '#fff4c2', opacity: 0.35 }) +
      circle(-6, 0, 18, { fill: 'none', stroke: '#c99a3a', strokeWidth: 9 }) + circle(-6, 0, 18, { fill: 'none', stroke: INK, strokeWidth: 2 }) +
      rect(12, -6, 130, 12, { fill: '#c99a3a', ...S }) + path('M120,6 L120,26 L132,26 L132,16 L140,16 L140,6Z', { fill: '#c99a3a', ...S }) +
      circle(146, 0, 9, { fill: '#fffbe0' });
  },
  mop() { return path('M0,0 L-30,0', { stroke: '#8a6a40', strokeWidth: 8 }) + path('M0,0 L200,0', { stroke: '#8a6a40', strokeWidth: 8, strokeLinecap: 'round' }) + path('M196,-26 L226,-30 L236,30 L196,26Z', { fill: '#d9d4c4', ...S }) + path('M206,-26 l4,52 M216,-28 l6,56 M226,-28 l6,54', { stroke: '#a8a294', strokeWidth: 2 }); },
  broom() { return path('M-30,0 L180,0', { stroke: '#a07a46', strokeWidth: 7, strokeLinecap: 'round' }) + path('M176,-8 L250,-30 L256,30 L176,8Z', { fill: '#b9935a', ...S }); },
  pipe() { return path('M-30,0 L150,0', { stroke: '#6f6c72', strokeWidth: 14, strokeLinecap: 'round' }) + path('M-30,0 L150,0', { stroke: '#a6a3aa', strokeWidth: 4, strokeLinecap: 'round', opacity: 0.8 }) + path('M-30,-8 L-30,8', { stroke: INK, strokeWidth: 3 }); },
  calculator() { return rect(-6, -26, 40, 56, { fill: '#2d2f38', ...S, rx: 4 }) + rect(0, -20, 28, 12, { fill: '#9fe2a8' }) + path('M2,0 h6 M14,0 h6 M26,0 h4 M2,10 h6 M14,10 h6 M26,10 h4 M2,20 h6 M14,20 h6', { stroke: '#c9ccd6', strokeWidth: 4 }); },
  crate(o = {}) { // Solaris med crate with sun emblem
    return rect(-10, -50, 110, 90, { fill: '#f2f4f7', ...S }) + rect(-10, -50, 110, 14, { fill: '#7cc4ef', stroke: INK, strokeWidth: 2 }) +
      circle(45, 0, 16, { fill: 'none', stroke: '#e3a82b', strokeWidth: 4 }) + circle(45, 0, 7, { fill: '#e3a82b' }) + (o.pierced ? path('M60,-30 L80,10', { stroke: '#a24bff', strokeWidth: 6 }) : '');
  },
  leadBox(o = {}) { // lead box with Code-Zero vial
    return (o.open ? ellipse(40, -24, 46, 26, { fill: '#ff4a6a', opacity: 0.25 }) + path('M8,-30 L72,-30 L64,-20 L16,-20Z', { fill: '#e8c070', opacity: 0.7 }) : '') +
      rect(0, -20, 80, 44, { fill: '#5b5f68', ...S, rx: 3 }) + rect(0, -26, 80, o.open ? 4 : 10, { fill: '#6c717b', ...S }) + path('M10,6 h60', { stroke: '#41444b', strokeWidth: 3 });
  },
  vial(o = {}) {
    return ellipse(0, 0, 40, 60, { fill: '#ff3a5a', opacity: o.glow === false ? 0 : 0.22 }) +
      rect(-12, -60, 24, 120, { fill: '#d7dbe2', ...S, rx: 6 }) + rect(-8, -48, 16, 96, { fill: '#b1123a', rx: 4 }) +
      path('M-4,-40 C4,-20 -4,0 4,20 C-2,30 2,38 -2,44', { stroke: '#f5c44a', strokeWidth: 3, fill: 'none' }) +
      rect(-14, -66, 28, 10, { fill: '#c6cbd4', ...S }) + rect(-14, 56, 28, 10, { fill: '#c6cbd4', ...S });
  },
  tank() { return rect(-10, -22, 170, 44, { fill: '#4f7f6a', ...S, rx: 20 }) + rect(150, -10, 24, 20, { fill: '#9aa0a8', ...S }); },
  tankApron() { return PROPS.tank() + path('M40,-24 L110,-24 L118,24 L34,24Z', { fill: '#ffd83a', ...S }) + circle(60, -4, 6, { fill: '#fff' }) + circle(90, 6, 6, { fill: '#fff' }); },
  scalpel() { return path('M0,-3 L50,-3 L50,3 L0,3Z', { fill: '#c9ced9', stroke: INK, strokeWidth: 2 }) + path('M50,-3 L74,0 L50,4Z', { fill: '#ff4a4a', stroke: INK, strokeWidth: 1.5 }); },
  battery() { return rect(-10, -26, 70, 52, { fill: '#2a2a32', ...S }) + rect(0, -34, 12, 8, { fill: '#c0392b', stroke: INK, strokeWidth: 2 }) + rect(36, -34, 12, 8, { fill: '#555', stroke: INK, strokeWidth: 2 }) + path('M20,26 q4,14 -2,24', { stroke: '#b9ff4a', strokeWidth: 4, fill: 'none' }); },
  hammer() { return path('M-20,0 L90,0', { stroke: '#8a6a40', strokeWidth: 9, strokeLinecap: 'round' }) + rect(84, -20, 22, 40, { fill: '#6f6c72', ...S }); },
  chainHook(o = {}) {
    const len = o.len || 160;
    let d = '';
    for (let x = 0; x < len; x += 14) d += `M${x},-4 a7,4 0 1,0 14,0 a7,4 0 1,0 -14,0 `;
    return path(d, { stroke: '#9aa0aa', strokeWidth: 3, fill: 'none' }) + path(`M${len},0 L${len + 20},0 C${len + 40},0 ${len + 40},28 ${len + 22},30`, { stroke: '#c9ced6', strokeWidth: 6, fill: 'none', strokeLinecap: 'round' });
  },
  fangBlade() { // Raze's curved fang/sickle blade
    return path('M-10,-6 L30,-6 L30,6 L-10,6Z', { fill: '#2a2830', ...S }) + path('M28,-8 C90,-60 170,-50 200,10 C160,-20 100,-22 28,10Z', { fill: '#24232b', ...S }) + path('M40,-6 C100,-44 160,-36 190,4', { stroke: '#8b8e99', strokeWidth: 2, fill: 'none' }) + path('M120,-30 l6,8 M150,-28 l4,9', { stroke: '#6a1a22', strokeWidth: 3 });
  },
  lightSword(o = {}) { // Vale: purple-pink light blade
    const len = o.len || 220;
    return path(`M20,0 L${len},0`, { stroke: '#e07bff', strokeWidth: 28, opacity: 0.25, strokeLinecap: 'round' }) +
      path(`M20,0 L${len},0`, { stroke: '#ff9cf2', strokeWidth: 12, strokeLinecap: 'round' }) + path(`M20,0 L${len},0`, { stroke: '#fff', strokeWidth: 4, strokeLinecap: 'round' }) +
      rect(-24, -7, 46, 14, { fill: '#2b2a33', ...S }) + rect(16, -14, 8, 28, { fill: '#cfd3dd', ...S });
  },
  newspaper() { return rect(-20, -40, 90, 70, { fill: '#e9e4d6', ...S }) + path('M-10,-28 h70 M-10,-16 h50 M-10,-4 h66 M-10,8 h40', { stroke: '#8a8576', strokeWidth: 3 }); },
  bagHand() { return path('M-10,0 C-20,40 -20,70 10,76 C40,80 50,40 30,0Z', { fill: '#e6f2ff', fillOpacity: 0.6, ...S }) + rect(-6, 40, 26, 22, { fill: '#cde9ff', opacity: 0.8 }) + path('M2,30 c-4,10 0,24 8,24 c8,0 12,-12 6,-22Z', { fill: '#c9a28a', stroke: INK, strokeWidth: 2 }); },
  looseArm(o = {}) { // a detached arm lying on a table (Sera / Grey)
    const c = o.color || '#f4e2d8';
    return path('M0,0 L110,6 L200,0', { stroke: INK, strokeWidth: 34, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }) + path('M0,0 L110,6 L200,0', { stroke: c, strokeWidth: 28, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }) +
      circle(214, 0, 16, { fill: c, stroke: INK, strokeWidth: 3 }) + circle(-4, 0, 14, { fill: '#ff3a4a', opacity: 0.6 }) + path('M-4,-8 q-20,-10 -30,4 M-4,6 q-18,10 -28,-2', { stroke: '#ff3a4a', strokeWidth: 2.4, fill: 'none' }) + (o.burnt ? path('M30,-6 L160,-4', { stroke: '#3a2620', strokeWidth: 22, strokeLinecap: 'round' }) : '');
  },
  candy() { return path('M0,0 L24,-6', { stroke: '#fff', strokeWidth: 3 }) + circle(28, -7, 6, { fill: '#ff6fa8', stroke: INK, strokeWidth: 2 }); },
  coin() { return circle(0, 0, 8, { fill: '#e3b34a', stroke: INK, strokeWidth: 2 }); },
  plasticSheet() { return path('M0,-30 C30,-40 60,-10 80,-26 L70,30 C50,40 20,20 0,30Z', { fill: '#dfeaf0', fillOpacity: 0.85, ...S }); },
  ashNail() { return path('M0,-3 L70,-2 L84,0 L70,2 L0,3Z', { fill: '#7a5a46', ...S }) + rect(-8, -8, 10, 16, { fill: '#5a4636', stroke: INK, strokeWidth: 2 }); },
  meatCleaver() { return path('M0,-4 L30,-4 L30,4 L0,4Z', { fill: '#5a4636', ...S }) + path('M30,-24 L90,-24 L90,10 L30,10Z', { fill: '#a9adb6', ...S }); },
  scale() { return path('M0,0 L0,60 M-40,60 L40,60', { stroke: '#6f6c72', strokeWidth: 5 }) + path('M-40,60 L-56,90 L-24,90Z M40,60 L24,90 L56,90Z', { fill: '#8a8f9e', ...S }); },
  harpoon() { return path('M-30,-8 L80,-8 L80,8 L-30,8Z', { fill: '#3a3a42', ...S }) + path('M80,0 L110,0 L100,-10 M110,0 L100,10', { stroke: '#c9ced6', strokeWidth: 4, fill: 'none' }); },
  // ---- EP11-20 ----
  silverPistol() { // Cherry's engraved silver pistol
    return path('M-6,-10 L50,-10 L56,-4 L56,4 L18,4 L12,24 L0,24 L4,4 L-6,4Z', { fill: '#d9dde6', ...S }) + path('M20,-6 q6,-6 12,0 q-6,6 -12,0Z M36,-6 q5,-5 10,0 q-5,5 -10,0Z', { fill: '#a9b0bd' }) + circle(54, -3, 2, { fill: '#555' });
  },
  lollipop() { return path('M0,0 L40,0', { stroke: '#f2f0ea', strokeWidth: 4, strokeLinecap: 'round' }) + circle(56, 0, 18, { fill: '#ff5a8a', stroke: INK, strokeWidth: 2.5 }) + path('M44,-6 q12,-8 22,4 q-8,14 -20,4', { stroke: '#ffd0e0', strokeWidth: 3, fill: 'none' }); },
  bloodDagger(o = {}) { // Vane: black blade with a red blood groove
    const lit = o.lit;
    return rect(-14, -5, 26, 10, { fill: '#1e1d22', ...S }) + rect(10, -11, 6, 22, { fill: '#4a4850', ...S }) +
      path('M16,-7 L100,-3 L118,0 L100,3 L16,7Z', { fill: '#1a191e', ...S }) +
      path('M22,0 L100,0', { stroke: lit ? '#ff2a3a' : '#8a1420', strokeWidth: 3.4, strokeLinecap: 'round' }) +
      (lit ? path('M22,0 L100,0', { stroke: '#ff5a6a', strokeWidth: 10, opacity: 0.35 }) : '');
  },
  dullDagger() { return rect(-14, -5, 26, 10, { fill: '#5a5a58', ...S }) + path('M12,-6 L86,-2 L100,0 L86,2 L12,6Z', { fill: '#7a7a76', ...S }); },
  cigar() { return rect(0, -4, 34, 8, { fill: '#6a3a1e', ...S, rx: 3 }) + rect(26, -4, 4, 8, { fill: '#c9a040' }) + circle(36, 0, 3, { fill: '#ff6a2a' }) + path('M40,-4 q8,-12 0,-24', { stroke: '#d8d4cc', strokeWidth: 3, fill: 'none', opacity: 0.6 }); },
  wineGlass(o = {}) { return path('M0,0 L0,-6 M-10,6 L10,6', { stroke: INK, strokeWidth: 3 }) + path('M0,-6 L0,-30', { stroke: '#dfe6ee', strokeWidth: 3 }) + path('M-16,-62 L16,-62 C16,-40 8,-30 0,-30 C-8,-30 -16,-40 -16,-62Z', { fill: '#eaf2f8', fillOpacity: 0.4, ...S }) + (o.empty ? '' : path('M-14,-50 L14,-50 C12,-36 6,-32 0,-32 C-6,-32 -12,-36 -14,-50Z', { fill: o.color || '#a3102a' })); },
  goldCard() { return rect(-6, -22, 64, 40, { fill: '#e8c25a', ...S, rx: 4 }) + path('M8,-2 c8,-14 20,6 30,-6 c6,-8 12,-2 10,6', { stroke: '#8a6420', strokeWidth: 3, fill: 'none' }) + circle(46, -4, 2, { fill: '#8a6420' }); },
  needle() { return path('M0,0 L70,0', { stroke: '#dfe3ea', strokeWidth: 3, strokeLinecap: 'round' }) + ellipse(6, 0, 4, 2, { fill: 'none', stroke: '#8a8f9e', strokeWidth: 1.4 }) + path('M6,0 q-30,10 -60,-6', { stroke: '#ff2a3a', strokeWidth: 2, fill: 'none' }); },
  mace(o = {}) { // Grimm's black iron soul-mace with carved sigils
    const len = o.len || 150;
    return path(`M-30,0 L${len},0`, { stroke: '#1a191f', strokeWidth: 12, strokeLinecap: 'round' }) + path(`M-30,0 L${len},0`, { stroke: INK, strokeWidth: 2, opacity: 0.6 }) +
      path(`M${len - 6},-30 L${len + 60},-34 L${len + 70},0 L${len + 60},34 L${len - 6},30Z`, { fill: '#1d1c22', ...S }) +
      path(`M${len + 6},-18 l10,10 l-10,10 M${len + 28},-20 l0,40 M${len + 44},-14 l8,14 l-8,14`, { stroke: '#7a7a8a', strokeWidth: 2.4, fill: 'none' }) +
      (o.glow ? path(`M${len - 6},-30 L${len + 60},-34 L${len + 70},0 L${len + 60},34 L${len - 6},30Z`, { fill: 'none', stroke: '#9fd8ff', strokeWidth: 8, opacity: 0.35 }) : '');
  },
  voltSword(o = {}) { // Volt: blade wreathed in blue lightning
    const len = o.len || 220;
    return path(`M20,0 L${len},0`, { stroke: '#4aa8ff', strokeWidth: 24, opacity: 0.25, strokeLinecap: 'round' }) +
      rect(-24, -6, 44, 12, { fill: '#22264a', ...S }) + rect(16, -14, 8, 28, { fill: '#d4d8e2', ...S }) +
      path(`M24,-5 L${len},-2 L${len + 18},0 L${len},2 L24,5Z`, { fill: '#cfe6ff', ...S }) +
      path(`M30,-14 l20,10 l-10,4 l26,10 M${len * 0.5},-16 l16,12 l-12,2 l20,14 M${len * 0.8},10 l12,-14 l-10,0 l14,-12`, { stroke: '#7ad0ff', strokeWidth: 3, fill: 'none' });
  },
  assaultRifle() { // Claire
    return path('M-50,-6 L-20,-12 L70,-12 L110,-8 L110,4 L30,4 L22,24 L6,24 L10,4 L-50,10Z', { fill: '#3a3e44', ...S }) + rect(20, -20, 40, 8, { fill: '#2a2c30', stroke: INK, strokeWidth: 2 }) + rect(40, 4, 12, 26, { fill: '#2a2c30', stroke: INK, strokeWidth: 2, transform: 'rotate(10 46 4)' });
  },
  brazierStaff() { // Cinder Apostle: censer staff with pale white flame
    return path('M-60,0 L120,0', { stroke: '#3a3028', strokeWidth: 8, strokeLinecap: 'round' }) +
      path('M120,-18 L150,-22 L156,22 L120,18Z', { fill: '#4a4a52', ...S }) + ellipse(160, 0, 34, 34, { fill: '#f2f6ff', opacity: 0.25 }) +
      path('M150,-10 C176,-24 170,8 190,0 C170,-4 176,26 150,10Z', { fill: '#f6f8ff', stroke: '#b8c0d8', strokeWidth: 2 });
  },
  extinguisher() { return rect(-10, -24, 90, 48, { fill: '#c0172a', ...S, rx: 22 }) + rect(-24, -8, 16, 16, { fill: '#2a2a30', ...S }) + path('M-24,0 q-20,0 -24,20', { stroke: INK, strokeWidth: 5, fill: 'none' }); },
  syringe() { return rect(0, -6, 60, 12, { fill: '#e9f2f8', ...S }) + rect(8, -4, 30, 8, { fill: '#e8c070' }) + path('M60,0 L90,0', { stroke: '#c9ced9', strokeWidth: 2 }) + rect(-10, -10, 10, 20, { fill: '#9aa0aa', stroke: INK, strokeWidth: 2 }); },
  contract() { return path('M-10,-34 L60,-38 L66,36 L-4,40Z', { fill: '#e9e2cc', ...S }) + path('M2,-22 h50 M2,-10 h46 M4,2 h44 M4,14 h30', { stroke: '#8a8270', strokeWidth: 3 }) + path('M50,20 q10,10 16,24 L60,40Z', { fill: '#3a1a10', opacity: 0.7 }) + circle(20, 28, 7, { fill: '#a3101f', opacity: 0.7 }); },
  card() { return rect(-4, -26, 40, 56, { fill: '#fbfbfd', ...S, rx: 3 }) + path('M10,-10 l6,8 l-6,8 l-6,-8Z', { fill: '#c0172a' }); },
  coatHand() { return path('M0,0 C20,30 10,80 30,110 L80,104 C60,70 70,30 50,0Z', { fill: '#16151b', ...S }); },
  smokeGrenade() { return ellipse(0, 0, 10, 14, { fill: '#5b4a6a', ...S }) + rect(-4, -20, 8, 8, { fill: '#aaa', stroke: INK, strokeWidth: 2 }); },

  // ---------- EP21-30 ----------
  plasmaBlade(o = {}) { // Captain Ilya's twin energy blades; o.hot = reactor overdrive, o.broken
    const len = o.len || (o.broken ? 90 : 200), c = o.hot ? '#ffffff' : '#bfe8ff';
    return path(`M20,0 L${len},0`, { stroke: o.hot ? '#fff3b0' : '#7ad8ff', strokeWidth: o.hot ? 36 : 26, opacity: 0.3, strokeLinecap: 'round' }) +
      path(`M20,0 L${len},0`, { stroke: c, strokeWidth: 10, strokeLinecap: o.broken ? 'butt' : 'round' }) + path(`M20,0 L${len},0`, { stroke: '#fff', strokeWidth: 3 }) +
      rect(-22, -7, 42, 14, { fill: '#f2f4f8', ...S }) + rect(14, -12, 8, 24, { fill: '#1f2a4a', ...S }) + rect(-14, -3, 20, 6, { fill: '#e2b84a' });
  },
  lightSaw() { // Counter-Zero right arm: high-frequency light saw
    return rect(-10, -16, 50, 32, { fill: '#d6dbe4', ...S }) + circle(90, 0, 52, { fill: '#ffdc7a', opacity: 0.3 }) + circle(90, 0, 44, { fill: '#fff3c4', stroke: '#ffb800', strokeWidth: 4 }) +
      path(Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `M${90 + Math.cos(a) * 44},${Math.sin(a) * 44} l${Math.cos(a + 0.5) * 12},${Math.sin(a + 0.5) * 12}`; }).join(' '), { stroke: '#ffb800', strokeWidth: 4 }) + circle(90, 0, 10, { fill: '#9aa3b3', ...S });
  },
  netGun() { return rect(-10, -16, 80, 32, { fill: '#d6dbe4', ...S, rx: 8 }) + rect(66, -22, 26, 44, { fill: '#5a6070', ...S }) + path('M92,-16 l10,-8 M92,0 l12,0 M92,16 l10,8', { stroke: '#7ad8ff', strokeWidth: 3 }); },
  energyAxe() { // modified revenant #1: giant light-energy axe
    return path('M-40,0 L150,0', { stroke: '#3a3a42', strokeWidth: 14, strokeLinecap: 'round' }) + path('M120,-10 C150,-90 230,-90 250,-40 C220,-40 190,-20 170,6Z', { fill: '#fff3c4', opacity: 0.4 }) + path('M126,-6 C150,-70 210,-76 230,-40 C206,-36 184,-20 166,4Z', { fill: '#ffe07a', stroke: '#ffb800', strokeWidth: 4 });
  },
  chainsaw() { // modified revenant #4: twin chainsaw swords
    return rect(-24, -9, 44, 18, { fill: '#2a2830', ...S }) + rect(20, -16, 180, 32, { fill: '#9aa3b3', ...S, rx: 14 }) + path(Array.from({ length: 14 }, (_, i) => `M${26 + i * 12},-16 l6,-8 l6,8 M${26 + i * 12},16 l6,8 l6,-8`).join(' '), { fill: '#d6dbe4', stroke: INK, strokeWidth: 1.4 });
  },
  thunderHammer() { // modified revenant #2: purging lightning hammer
    return path('M-40,0 L130,0', { stroke: '#3a3a42', strokeWidth: 14, strokeLinecap: 'round' }) + rect(120, -46, 70, 92, { fill: '#f4f3ee', ...S, rx: 8 }) + rect(126, -10, 58, 20, { fill: '#e2b84a' }) + path('M200,-40 l20,16 l-12,6 l22,18 M200,30 l24,-8', { stroke: '#7ad0ff', strokeWidth: 4, fill: 'none' });
  },
  chainSpear(o = {}) { // modified revenant #3: high-heat chain spear
    const len = o.len || 260;
    return path(`M-40,0 L${len},0`, { stroke: '#5a5e66', strokeWidth: 10 }) + path(`M${len},-14 L${len + 60},0 L${len},14Z`, { fill: '#ff8a3a', stroke: INK, strokeWidth: 3 }) + path(`M-40,0 L${len},0`, { stroke: '#ff6a1a', strokeWidth: 3, strokeDasharray: '10 8' }) + path(`M-40,0 q-60,40 -120,10 q-40,-20 -80,20`, { stroke: '#8a8f98', strokeWidth: 6, fill: 'none', strokeDasharray: '10 6' });
  },
  nitroCannon() { return rect(-30, -18, 140, 36, { fill: '#d6dbe4', ...S, rx: 10 }) + rect(100, -24, 30, 48, { fill: '#5a8ab0', ...S }) + rect(-10, 18, 40, 30, { fill: '#9ad8ff', ...S, rx: 6 }) + path('M130,-14 l20,-6 M130,0 l24,0 M130,14 l20,6', { stroke: '#d8f4ff', strokeWidth: 3 }); },
  harpoonGun() { return rect(-30, -12, 130, 24, { fill: '#5a6070', ...S }) + path('M100,0 L170,0 M160,-10 L180,0 L160,10', { stroke: '#ff8a3a', strokeWidth: 6, fill: 'none' }); },
  soulCannon() { return rect(-30, -22, 150, 44, { fill: '#eef1f6', ...S, rx: 12 }) + circle(120, 0, 26, { fill: '#c9a0ff', stroke: INK, strokeWidth: 3 }) + circle(120, 0, 12, { fill: '#f0e0ff' }) + rect(0, -30, 60, 10, { fill: '#e3a82b' }); },
  flamethrower() { return rect(-30, -12, 130, 24, { fill: '#eef1f6', ...S }) + rect(-20, 12, 50, 30, { fill: '#e2b84a', ...S, rx: 8 }) + path('M100,-8 L130,-12 L130,12 L100,8Z', { fill: '#5a6070', ...S }); },
  sniper(o = {}) { // Claire's heavy-barrel sniper rifle reinforced with black ore (ch.26 L64)
    return path('M-60,-6 L-24,-12 L150,-10 L190,-6 L190,4 L40,6 L30,26 L14,26 L18,6 L-60,12Z', { fill: '#24232a', ...S }) + rect(20, -26, 70, 12, { fill: '#121117', stroke: INK, strokeWidth: 2, rx: 5 }) + circle(90, -20, 7, { fill: '#5ad8ff' }) + path('M160,-6 L190,-4', { stroke: '#ff3a1a', strokeWidth: 2 }) + (o.jam ? path('M-20,-10 q20,-20 40,0', { stroke: '#ff8a2a', strokeWidth: 6, fill: 'none' }) : '');
  },
  heavyPistol() { // Claire's black-ore heavy pistols
    return path('M-6,-12 L62,-12 L68,-5 L68,5 L20,5 L14,26 L0,26 L4,5 L-6,5Z', { fill: '#2a2830', ...S }) + rect(30, -9, 26, 4, { fill: '#ff3a1a' });
  },
  forgeHammer() { // Rivet King's giant forging hammer
    return path('M-40,0 L150,0', { stroke: '#3a2a20', strokeWidth: 16, strokeLinecap: 'round' }) + rect(140, -60, 90, 120, { fill: '#5e636c', ...S, rx: 10 }) + path('M150,-50 v100 M220,-50 v100', { stroke: '#a9afb9', strokeWidth: 4 });
  },
  puppetCane() { // Marquis Velvet's puppeteer cane
    return path('M-60,0 L140,0', { stroke: '#24102e', strokeWidth: 8, strokeLinecap: 'round' }) + circle(150, 0, 14, { fill: '#c9a040', ...S }) + path('M150,0 q-10,60 -40,90 M150,0 q20,60 10,100 M150,0 q40,40 60,60', { stroke: '#e8e2f0', strokeWidth: 1.4, fill: 'none', opacity: 0.8 });
  },
  miniCrossbow() { // Valentine's small crossbow with perfume-poison vials
    return rect(-10, -6, 80, 12, { fill: '#5a3a4a', ...S }) + path('M60,-40 Q80,0 60,40', { stroke: '#2a1e26', strokeWidth: 6, fill: 'none' }) + path('M60,-40 L20,0 L60,40', { stroke: '#e8d0d8', strokeWidth: 1.6, fill: 'none' }) + rect(10, -20, 14, 14, { fill: '#ff8ab8', ...S, rx: 4 }) + rect(30, -20, 14, 14, { fill: '#c0485a', ...S, rx: 4 });
  },
  boneWhip(o = {}) { // Corsetta's nine-metre bone-and-iron whip
    const len = o.len || 520;
    return rect(-20, -6, 40, 12, { fill: '#3a0a10', ...S }) + path(`M20,0 C${len * 0.3},-80 ${len * 0.5},80 ${len * 0.75},-20 C${len * 0.85},-60 ${len * 0.95},20 ${len},-10`, { stroke: INK, strokeWidth: 10, fill: 'none', strokeLinecap: 'round' }) + path(`M20,0 C${len * 0.3},-80 ${len * 0.5},80 ${len * 0.75},-20 C${len * 0.85},-60 ${len * 0.95},20 ${len},-10`, { stroke: '#e8e0cc', strokeWidth: 6, fill: 'none', strokeDasharray: '12 6', strokeLinecap: 'round' });
  },
  redBlade(o = {}) { // Sera's new twin blades woven from Arachne's origin thread alloy (ch.30 L160)
    const len = o.len || 170;
    return path(`M-20,-5 L14,-5 L14,5 L-20,5Z`, { fill: '#3a0a10', ...S }) + path(`M14,-6 L${len},-2 L${len + 18},0 L${len},2 L14,6Z`, { fill: '#8a0e1e', ...S }) + path(`M20,0 L${len},0`, { stroke: '#ff5a6a', strokeWidth: 1.6 }) + path(`M-20,0 q-30,-10 -50,10 M-20,2 q-30,10 -40,30`, { stroke: '#ff2a3a', strokeWidth: 1.4, fill: 'none' });
  },
  energyCore() { return circle(40, 0, 34, { fill: '#c58aff', opacity: 0.35 }) + poly8(40, 0, 24, '#b88aff', '#ffd45a'); },
  oreSlab() { return path('M0,-30 L80,-40 L96,20 L10,34Z', { fill: '#16151b', ...S }) + path('M14,-20 L70,-28 M20,10 L80,4', { stroke: '#ff8a3a', strokeWidth: 2, opacity: 0.7 }); },
};
function poly8(cx, cy, r, fill, stroke) {
  const pts = Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`; }).join(' ');
  return `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
}

// ---------- EP31-45 props (added via PROPS so existing ones are untouched) ----------
Object.assign(PROPS, {
  greatsword(o = {}) { // Olden's holy-light steel greatsword (ch.36 L30)
    const len = o.len || 300;
    return path('M-34,-7 L16,-7 L16,7 L-34,7Z', { fill: '#5a4a2a', ...S }) + path('M16,-26 L28,-26 L28,26 L16,26Z', { fill: '#e2b84a', ...S }) +
      path(`M28,-16 L${len},-12 L${len + 40},0 L${len},12 L28,16Z`, { fill: '#f2f4f8', ...S }) + path(`M40,0 L${len},0`, { stroke: '#e2b84a', strokeWidth: 3 }) + (o.glow ? path(`M28,0 L${len + 30},0`, { stroke: '#ffe48a', strokeWidth: 30, opacity: 0.3 }) : '');
  },
  whipHandle() { return rect(-10, -7, 46, 14, { fill: '#f2eee4', ...S, rx: 5 }) + rect(30, -9, 8, 18, { fill: '#e2b84a', ...S }); },
  towerShield(o = {}) { // Sanctum's giant shield: concentric gold rings, blue gem at the centre (ch.37 L116)
    return path('M-20,-150 L120,-150 L120,60 Q50,140 -20,60Z', { fill: '#f1ebdc', ...S }) + [70, 50, 30].map((r) => circle(50, -40, r, { fill: 'none', stroke: '#e2b84a', strokeWidth: 4 })).join('') + circle(50, -40, 14, { fill: '#3aa0ff', stroke: INK, strokeWidth: 2 }) + (o.glow ? circle(50, -40, 60, { fill: '#ffe48a', opacity: 0.35 }) : '');
  },
  starWand() { // Axiom's short wand with a star head (ch.37 L146)
    return rect(-6, -3, 70, 6, { fill: '#16151b', ...S }) + path('M76,-16 L80,-5 L92,-4 L83,3 L86,15 L76,8 L66,15 L69,3 L60,-4 L72,-5Z', { fill: '#ffd45a', ...S });
  },
  dragonLance(o = {}) { // Sir Draken's white-silver lance, glowing dragon-fang head (ch.38 L92)
    const len = o.len || 320;
    return path(`M-60,-5 L${len},-5 L${len},5 L-60,5Z`, { fill: '#e8eaee', ...S }) + path(`M${len * 0.3},-7 L${len * 0.36},-7 L${len * 0.36},7 L${len * 0.3},7Z`, { fill: '#e2b84a', ...S }) +
      path(`M${len},-14 C${len + 30},-14 ${len + 60},-6 ${len + 80},0 C${len + 60},6 ${len + 30},14 ${len},14Z`, { fill: '#dff4ff', ...S }) + circle(len + 30, 0, 26, { fill: '#7ad8ff', opacity: 0.35 });
  },
  pocketWatch(o = {}) { return circle(14, 0, 14, { fill: '#e2b84a', ...S }) + circle(14, 0, 10, { fill: '#f6f2e4' }) + path('M14,0 L14,-7 M14,0 L19,2', { stroke: INK, strokeWidth: 1.6 }) + rect(10, -18, 8, 5, { fill: '#e2b84a', ...S }); },
  archStaff() { // Archbishop Nal's golden staff with rotating geometric rings (ch.40 L74)
    return rect(-60, -4, 300, 8, { fill: '#e2b84a', ...S }) + circle(256, 0, 22, { fill: 'none', stroke: '#e2b84a', strokeWidth: 4 }) + path('M236,-20 L276,20 M236,20 L276,-20', { stroke: '#e2b84a', strokeWidth: 3 }) + circle(256, 0, 34, { fill: 'none', stroke: '#c9a040', strokeWidth: 2, strokeDasharray: '6 6' });
  },
  lightBow(o = {}) { // Commander Arion's bow forged from holy light metal (ch.39 L34)
    return path('M0,-110 C40,-60 40,60 0,110', { stroke: INK, strokeWidth: 12, fill: 'none' }) + path('M0,-110 C40,-60 40,60 0,110', { stroke: '#f2f4f8', strokeWidth: 7, fill: 'none' }) + path('M0,-110 C40,-60 40,60 0,110', { stroke: '#e2b84a', strokeWidth: 2, fill: 'none' }) +
      path(`M0,-110 L${o.drawn ? -40 : 0},0 L0,110`, { stroke: '#ffe48a', strokeWidth: 2.4, fill: 'none' }) + (o.drawn ? path('M-40,0 L120,0', { stroke: '#ffd45a', strokeWidth: 6 }) + circle(120, 0, 16, { fill: '#ffe48a', opacity: 0.6 }) : '');
  },
  ledgerBook() { return rect(-6, -40, 60, 78, { fill: '#4a2a1a', ...S, rx: 4 }) + rect(-2, -36, 6, 70, { fill: '#2a1a10' }) + rect(14, -24, 30, 8, { fill: '#c9a040' }); },
  knife(o = {}) { // Naira's short knife
    return rect(-12, -4, 26, 8, { fill: '#121117', ...S, rx: 2 }) + path('M14,-7 L64,-2 L70,0 L64,2 L14,6Z', { fill: '#dfe3ea', ...S }) + (o.blood ? path('M40,-2 L66,0', { stroke: '#c0172a', strokeWidth: 3 }) : '');
  },
  warSpear() { // Marshal Warden's long spear with a command banner
    return rect(-80, -5, 380, 10, { fill: '#2a2a32', ...S }) + path('M300,-12 L350,0 L300,12Z', { fill: '#c9ced8', ...S }) + path('M240,-5 L240,-90 L170,-80 L190,-50 L170,-20 L240,-5Z', { fill: '#7a1420', ...S });
  },
  ceremonialSword() { // King Regulus's black-red ceremonial sword
    return rect(-24, -5, 40, 10, { fill: '#1a1a20', ...S }) + rect(14, -14, 8, 28, { fill: '#7a1420', ...S }) + path('M22,-6 L220,-3 L240,0 L220,3 L22,6Z', { fill: '#121117', ...S }) + path('M30,0 L220,0', { stroke: '#a3101f', strokeWidth: 2 });
  },
  dagger(o = {}) { // the white-mask's stretching short blade, at rest
    return rect(-12, -4, 26, 8, { fill: '#121117', ...S }) + path('M14,-6 L70,-2 L78,0 L70,2 L14,6Z', { fill: '#dfe3ea', ...S });
  },
  syringeBig() { return rect(0, -9, 90, 18, { fill: '#9a4ad0', opacity: 0.8, ...S, rx: 4 }) + rect(-20, -3, 22, 6, { fill: '#9aa3b3', ...S }) + path('M90,0 L130,0', { stroke: '#c9ced8', strokeWidth: 3 }); },
  giantScissors(o = {}) { // Crimson Jaw's two-metre fate-cutting shears; o.broken = blades bitten off
    const b = o.broken ? 80 : 200;
    return circle(-10, -14, 16, { fill: 'none', stroke: INK, strokeWidth: 8 }) + circle(-10, 14, 16, { fill: 'none', stroke: INK, strokeWidth: 8 }) + path(`M6,-10 L${b},-28 L${b},-16 L10,4Z`, { fill: '#c9ced8', ...S }) + path(`M6,10 L${b},${o.open ? 50 : 26} L${b},${o.open ? 38 : 14} L10,-4Z`, { fill: '#b9bcc6', ...S }) + circle(10, 0, 6, { fill: '#5a5e66', ...S });
  },
  tablet() { return rect(-4, -30, 60, 46, { fill: '#cfe6ff', opacity: 0.5, ...S, rx: 4 }) + rect(4, -22, 30, 4, { fill: '#3fe0d0' }) + rect(4, -14, 40, 3, { fill: '#3fe0d0', opacity: 0.6 }); },
});

function prop(name, o) {
  const fn = PROPS[name];
  if (!fn) throw new Error(`unknown prop ${name}`);
  return fn(o || {});
}

module.exports = { prop, PROPS };
