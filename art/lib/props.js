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
      path(`M28,-1 L${len},-1`, { stroke: '#b9bccb', strokeWidth: 2, opacity: 0.8 });
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
  smokeGrenade() { return ellipse(0, 0, 10, 14, { fill: '#5b4a6a', ...S }) + rect(-4, -20, 8, 8, { fill: '#aaa', stroke: INK, strokeWidth: 2 }); },
};

function prop(name, o) {
  const fn = PROPS[name];
  if (!fn) throw new Error(`unknown prop ${name}`);
  return fn(o || {});
}

module.exports = { prop, PROPS };
