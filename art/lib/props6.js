// Hand-held props first needed in EP66-70. Same local frame as props.js:
// origin at the hand, main axis along +x. Merged into PROPS by props.js.
'use strict';
const { INK, path, circle, ellipse, rect } = require('./util');
const S = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' };

module.exports = function props6() {
  return {
    boneSpear(o = {}) { // Zahira's spear: a desert-beast spine sheathed in quartz (ch.68 L61)
      const len = o.len || 300;
      let s = rect(-80, -5, len + 80, 10, { fill: '#e8dcc0', ...S });
      for (let x = -60; x < len; x += 34) s += ellipse(x, 0, 8, 9, { fill: '#d8caa8', stroke: INK, strokeWidth: 1.6 });
      return s + path(`M${len},-14 L${len + 70},0 L${len},14Z`, { fill: '#dff4ff', ...S }) + path(`M${len + 6},-6 L${len + 50},0`, { stroke: '#ffffff', strokeWidth: 2 });
    },
    twinSpear() { // Kira's short double-ended spear (ch.69 L29)
      return rect(-70, -4, 140, 8, { fill: '#7a5e3c', ...S }) + path('M70,-9 L112,0 L70,9Z M-70,-9 L-112,0 L-70,9Z', { fill: '#cfe8f0', ...S }) + rect(-10, -6, 20, 12, { fill: '#c8a060', ...S });
    },
    crystalSpear() { // guards' sand-crystal spears (ch.68 L39)
      return rect(-60, -4, 260, 8, { fill: '#8a7656', ...S }) + path('M200,-12 L262,0 L200,12Z', { fill: '#e8f8ff', ...S });
    },
    tendonBow() { // heavy sinew-strung crossbows of the basin guards (ch.68 L39)
      return rect(-20, -6, 140, 12, { fill: '#7a5e3c', ...S }) + path('M90,-70 C130,-30 130,30 90,70', { stroke: '#d8caa8', strokeWidth: 9, fill: 'none' }) + path('M90,-70 L40,0 L90,70', { stroke: '#e8dcc0', strokeWidth: 2, fill: 'none' });
    },
    mantisScythe() { // Haran's left arm: a serrated chitin scythe with chipped edge (ch.69 L121)
      let teeth = '';
      for (let i = 0; i < 7; i++) teeth += `L${30 + i * 22},${-6 - (i % 2 ? 0 : 10)} `;
      return path(`M0,-8 C60,-40 150,-60 200,-20 C170,-30 140,-24 ${190},${-8} ${teeth}L20,8Z`, { fill: '#6a7a3a', ...S }) + path('M120,-40 l8,10 M160,-44 l-4,12', { stroke: INK, strokeWidth: 3 });
    },
    stoneCup() { // sandstone water flask / cup (ch.69 L207)
      return rect(0, -26, 34, 46, { fill: '#c8a878', ...S, rx: 6 }) + ellipse(17, -26, 17, 6, { fill: '#7ad8ff', stroke: INK, strokeWidth: 2 });
    },
    driedFruit() { // honey-cactus fruit, dried (ch.69 L187)
      return ellipse(14, 0, 14, 10, { fill: '#e08a2a', ...S }) + path('M6,-4 q8,-6 16,0', { stroke: '#8a3a1a', strokeWidth: 2, fill: 'none' });
    },
    clothStrip() { // a strip of spare cloth torn for head wraps (ch.66 L251)
      return path('M0,-8 C40,-20 80,10 120,-4 L120,10 C80,24 40,-6 0,8Z', { fill: '#e8dcc4', ...S });
    },
  };
};
