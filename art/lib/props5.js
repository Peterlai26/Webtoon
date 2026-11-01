// Hand-held props first needed in EP46-65. Same local frame as props.js:
// origin at the hand, main axis along +x. Merged into PROPS by props.js.
'use strict';
const { INK, path, circle, ellipse, rect } = require('./util');
const S = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' };

module.exports = function props5(PROPS) {
  // Sera's sword from EP59 on is said to be "fused with One-Face mirror ore" (ch.59 L151): o.glass adds a white mirror line
  const sword = PROPS.sword;
  PROPS.sword = (o = {}) => sword(o) + (o.glass ? path(`M34,-3 L${o.len || 230},-2`, { stroke: '#ffffff', strokeWidth: 2, opacity: 0.9 }) : '');
  return {
    katana(o = {}) { // Setsu's long katana
      const len = o.len || 250;
      return rect(-34, -5, 40, 10, { fill: '#1a1820', ...S }) + ellipse(8, 0, 6, 14, { fill: '#c9a040', ...S }) + path(`M14,-4 L${len},-6 Q${len + 24},-2 ${len + 18},4 L14,4Z`, { fill: '#e8ecf2', ...S }) + path(`M20,-1 L${len},-2`, { stroke: '#9aa0aa', strokeWidth: 1.6 });
    },
    plasmaGlaive(o = {}) { // Valkor's twin dragon-fang plasma glaive
      return rect(-60, -5, 230, 10, { fill: '#3a3e48', ...S }) + path('M170,-8 C210,-40 250,-30 270,-10 C240,-14 220,-4 200,8Z', { fill: '#dff4ff', ...S }) + path('M-60,-6 C-90,-30 -110,-20 -130,0 C-100,-6 -84,0 -70,8Z', { fill: '#dff4ff', ...S }) +
        (o.hot !== false ? path('M178,-10 C214,-38 248,-28 262,-12', { stroke: '#7ad8ff', strokeWidth: 10, fill: 'none', opacity: 0.6 }) + path('M-66,-8 C-90,-26 -106,-18 -120,-2', { stroke: '#7ad8ff', strokeWidth: 10, fill: 'none', opacity: 0.6 }) : '');
    },
    railArm(o = {}) { // Captain Rail's right arm: a three-metre electromagnetic rail cannon
      const len = o.len || 300;
      let s = rect(-20, -16, len, 32, { fill: '#5a606c', ...S, rx: 6 }) + rect(-20, -6, len + 20, 12, { fill: '#2a2e3a', ...S });
      for (let i = 0; i < 12; i++) s += rect(10 + i * (len - 30) / 12, -20, 8, 40, { fill: o.charged ? '#e8d8ff' : '#9aa0aa', stroke: INK, strokeWidth: 1.6 });
      return s + (o.charged ? path(`M0,0 L${len + 20},0`, { stroke: '#c58aff', strokeWidth: 16, opacity: 0.5 }) + circle(len + 20, 0, 22, { fill: '#f2e8ff', opacity: 0.8 }) : '');
    },
    chainSickle() { // Vesper's twin sonar chain-sickles
      return path('M0,0 L60,0', { stroke: '#3a3842', strokeWidth: 6, strokeDasharray: '8 4' }) + path('M60,-8 L70,8 M70,0 C110,-50 150,-40 170,-10 C140,-24 110,-20 84,6Z', { fill: '#1a1820', ...S }) + path('M90,-6 C116,-30 140,-26 156,-12', { stroke: '#c9ced8', strokeWidth: 2.4, fill: 'none' });
    },
    magShield(o = {}) { // Centurion's magnetic-field reflector shield
      return rect(-20, -110, 50, 220, { fill: '#c9ced8', ...S, rx: 14 }) + rect(-10, -90, 30, 180, { fill: o.off ? '#5a606a' : '#7ae6ff', opacity: o.off ? 0.6 : 0.5, rx: 8 }) + (o.bent ? path('M-20,0 L30,0', { stroke: INK, strokeWidth: 6 }) : '');
    },
    magGun() { // Voltage's electromagnetic machine pistol
      return rect(-6, -10, 86, 20, { fill: '#3a3e4a', ...S, rx: 4 }) + rect(10, 6, 16, 24, { fill: '#2a2e3a', ...S }) + rect(76, -6, 20, 12, { fill: '#ffe14a', ...S });
    },
    hammerFist() { // Gargoyle's twin hammer-head mechanical gauntlet (one per arm)
      return rect(-10, -46, 110, 92, { fill: '#5a5e6a', ...S, rx: 10 }) + rect(90, -54, 30, 108, { fill: '#3a3e48', ...S }) + circle(10, 0, 14, { fill: '#ff8a2a', opacity: 0.8 });
    },
    warHammer() { // the clone Bastion's war hammer
      return rect(-30, -5, 210, 10, { fill: '#5a4636', ...S }) + rect(170, -40, 50, 80, { fill: '#6a707c', ...S, rx: 4 });
    },
    bigShield(o = {}) { // the clone Bastion's huge iron shield; o.charge = stored impact glowing orange
      return rect(-10, -130, 60, 260, { fill: '#6a707c', ...S, rx: 10 }) + rect(4, -110, 32, 220, { fill: o.charge ? '#ff8a2a' : '#8a909c', opacity: o.charge ? 0.7 : 1, rx: 6 }) + (o.melted ? path('M-10,40 q30,40 60,10 L50,130 L-10,130Z', { fill: '#ff6a1a', opacity: 0.7 }) : '');
    },
    blackNeedle() { return path('M0,-4 L170,-1 L190,0 L170,1 L0,4Z', { fill: '#121117', ...S }); }, // Umbra's shadow-stitching needle
    blackBell() { // Silence's great black bell on a chain
      return path('M0,0 L40,0', { stroke: '#3a3842', strokeWidth: 6 }) + path('M40,-50 C40,-20 30,30 40,60 L130,60 C140,30 130,-20 130,-50 C110,-70 60,-70 40,-50Z', { fill: '#121117', ...S }) + rect(30, 56, 110, 10, { fill: '#2a2830', ...S });
    },
    ironBow() { // Vector's iron bow
      return path('M10,-110 C70,-60 70,60 10,110', { stroke: '#5a5e66', strokeWidth: 10, fill: 'none' }) + path('M10,-110 L10,110', { stroke: '#c9ced8', strokeWidth: 2 });
    },
    compass() { // Velen's antique brass compass, made by Rey's father (ch.61 L118)
      return circle(18, 0, 18, { fill: '#c9a040', ...S }) + circle(18, 0, 12, { fill: '#f2ead0', stroke: INK, strokeWidth: 2 }) + path('M18,-10 L22,0 L18,10 L14,0Z', { fill: '#a3101f', stroke: INK, strokeWidth: 1.4 });
    },
    skullMask(o = {}) { // Grimm's skull mask, held; o.half = the cracked half
      const half = o.half ? path('M8,-46 L2,-20 L10,0 L0,30 L8,46', { stroke: INK, strokeWidth: 3, fill: 'none' }) : '';
      return path(o.half ? 'M8,-46 C-40,-46 -46,0 -30,26 L-20,46 L8,46 L0,30 L10,0 L2,-20Z' : 'M-32,-30 C-34,-56 40,-56 40,-28 C42,0 34,20 26,30 L22,46 L-14,46 L-18,28 C-30,16 -32,-6 -32,-30Z', { fill: '#f1efe8', ...S }) + path('M-18,-14 C-26,-14 -24,6 -12,6 C-4,6 -4,-14 -18,-14Z', { fill: '#17141c' }) + half;
    },
    skewer() { return path('M0,0 L90,0', { stroke: '#8a6a40', strokeWidth: 4 }) + [30, 50, 70].map((x) => rect(x - 8, -9, 16, 18, { fill: '#8a3a1a', ...S, rx: 4 })).join(''); },
    stoneBowl() { return path('M0,-20 L80,-20 C76,10 60,24 40,24 C20,24 4,10 0,-20Z', { fill: '#7a7068', ...S }); },
  };
};
