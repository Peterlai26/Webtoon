// Effects and set-pieces for EP31-45. Merged into FX by fx.js. No text.
'use strict';
const { INK, rng, path, circle, ellipse, rect, line, poly, g, f } = require('./util');

module.exports = function fx4({ glow }) {
  const thorns = (d, n = 26) => path(d, { stroke: '#e2b84a', strokeWidth: 3, fill: 'none', strokeDasharray: '2 9', strokeLinecap: 'round' });
  const FX4 = {
    // Miray's white-silver thorn whip (ch.35 L150): a curve from (x1,y1) to (x2,y2), sparks of current optional
    thornWhip: (W, H, o) => {
      const mx = (o.x1 + o.x2) / 2 + (o.bend || 0), my = (o.y1 + o.y2) / 2 + (o.sag ?? -40);
      const d = `M${o.x1},${o.y1} Q${mx},${my} ${o.x2},${o.y2}`;
      return path(d, { stroke: INK, strokeWidth: (o.w || 8) + 5, fill: 'none', strokeLinecap: 'round' }) + path(d, { stroke: '#eef0f4', strokeWidth: o.w || 8, fill: 'none', strokeLinecap: 'round' }) + path(d, { stroke: '#e2b84a', strokeWidth: 2, fill: 'none' }) + thorns(d) +
        (o.shock ? path(d, { stroke: '#ffe48a', strokeWidth: (o.w || 8) * 3, fill: 'none', opacity: 0.3 }) : '');
    },
    // whip coiled around a body: n loops between y and y+h centred at x
    whipCoil: (W, H, o) => {
      let s = '';
      const n = o.n || 4, w = o.w || 90;
      for (let i = 0; i < n; i++) { const y = o.y + (i * o.h) / Math.max(1, n - 1); s += ellipse(o.x, y, w, 14, { fill: 'none', stroke: INK, strokeWidth: 12 }) + ellipse(o.x, y, w, 14, { fill: 'none', stroke: '#eef0f4', strokeWidth: 7 }) + ellipse(o.x, y, w, 14, { fill: 'none', stroke: '#e2b84a', strokeWidth: 2.6, strokeDasharray: '2 10', strokeLinecap: 'round' }); }
      return s + (o.shock ? glow(o.x, o.y + o.h / 2, w * 1.6, '#ffe48a', 0.35) + path(`M${o.x - w},${o.y} l14,20 l-10,6 l16,24 M${o.x + w},${o.y + o.h} l-12,-18 l10,-6 l-14,-22`, { stroke: '#fff3b0', strokeWidth: 3, fill: 'none' }) : '');
    },
    // Sanctum's 360-degree holy light dome (ch.37 L124); o.ripple = the surface wavers
    lightDome: (W, H, o) => {
      const r0 = o.r || 320, rx = o.rx || r0;
      return path(`M${o.x - rx},${o.y} A${rx},${r0} 0 0,1 ${o.x + rx},${o.y}Z`, { fill: '#ffe27a', opacity: 0.14, stroke: '#ffd45a', strokeWidth: 6 }) +
        path(`M${o.x - rx * 0.8},${o.y - r0 * 0.3} L${o.x - rx * 0.4},${o.y - r0 * 0.8} L${o.x + rx * 0.2},${o.y - r0 * 0.85} L${o.x + rx * 0.7},${o.y - r0 * 0.4} M${o.x - rx * 0.6},${o.y - r0 * 0.1} L${o.x},${o.y - r0 * 0.5} L${o.x + rx * 0.6},${o.y - r0 * 0.1}`, { stroke: '#ffe48a', strokeWidth: 2.4, fill: 'none', opacity: 0.7 }) +
        (o.ripple ? path(`M${o.x - rx},${o.y - r0 * 0.2} q${rx * 0.25},-30 ${rx * 0.5},0 t${rx * 0.5},0 t${rx * 0.5},0 t${rx * 0.5},0`, { stroke: '#fff7d0', strokeWidth: 4, fill: 'none' }) : '') + glow(o.x, o.y - r0 * 0.4, r0, '#ffe48a', 0.15);
    },
    // supernatural white light on the ground; o.hands = black-gloved hands pushing out of it (ch.39 L126-136)
    birthLight: (W, H, o) => {
      const r0 = o.r || 160;
      let s = glow(o.x, o.y, r0 * 2.2, '#ffffff', 0.85) + ellipse(o.x, o.y, r0, r0 * 0.3, { fill: '#ffffff', stroke: '#f2f6ff', strokeWidth: 4 }) + path(Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return `M${o.x + Math.cos(a) * r0 * 0.5},${o.y + Math.sin(a) * r0 * 0.15} L${o.x + Math.cos(a) * r0 * 1.6},${o.y + Math.sin(a) * r0 * 0.5 - r0 * 0.6}`; }).join(' '), { stroke: '#ffffff', strokeWidth: 4, opacity: 0.6 });
      if (o.hands) for (const dx of [-60, -20, 30, 70]) s += path(`M${o.x + dx},${o.y} L${o.x + dx + 4},${o.y - 50}`, { stroke: INK, strokeWidth: 18, strokeLinecap: 'round' }) + path(`M${o.x + dx},${o.y} L${o.x + dx + 4},${o.y - 50}`, { stroke: '#18171d', strokeWidth: 12, strokeLinecap: 'round' }) + circle(o.x + dx + 4, o.y - 56, 11, { fill: '#121117', stroke: INK, strokeWidth: 2.4 });
      return s;
    },
    // Lord Chronos's frozen-time zone: grey sphere with a stopped clock face (ch.39 L194)
    timeStop: (W, H, o) => {
      const r0 = o.r || 220;
      let s = circle(o.x, o.y, r0, { fill: '#c9ced8', opacity: 0.2, stroke: '#e2b84a', strokeWidth: 4, strokeDasharray: '14 10' });
      for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; s += line([o.x + Math.cos(a) * r0 * 0.86, o.y + Math.sin(a) * r0 * 0.86], [o.x + Math.cos(a) * r0, o.y + Math.sin(a) * r0], { stroke: '#e2b84a', strokeWidth: i % 3 ? 3 : 6 }); }
      return s + line([o.x, o.y], [o.x, o.y - r0 * 0.6], { stroke: '#e2b84a', strokeWidth: 4, opacity: 0.6 }) + line([o.x, o.y], [o.x + r0 * 0.4, o.y + r0 * 0.1], { stroke: '#e2b84a', strokeWidth: 4, opacity: 0.6 });
    },
    // Lord Gravis's hundredfold gravity: pressure arrows and a sinking crater (ch.39 L204)
    gravityWell: (W, H, o) => {
      let s = ellipse(o.x, o.y, o.w / 2, 30, { fill: '#121117', opacity: 0.4, stroke: '#e2b84a', strokeWidth: 3 }) + path(`M${o.x - o.w / 2},${o.y} l-20,-10 M${o.x + o.w / 2},${o.y} l20,-10 M${o.x - o.w * 0.3},${o.y + 10} l-14,16 M${o.x + o.w * 0.3},${o.y + 10} l14,16`, { stroke: INK, strokeWidth: 3 });
      for (let i = 0; i < 6; i++) { const x = o.x - o.w * 0.4 + i * o.w * 0.16; s += path(`M${x},${o.y - (o.h || 300)} l0,${(o.h || 300) - 60} l-12,-16 m12,16 l12,-16`, { stroke: '#e2b84a', strokeWidth: 4, fill: 'none', opacity: 0.7 }); }
      return s + ellipse(o.x, o.y - (o.h || 300), o.w * 0.4, 12, { fill: 'none', stroke: '#e2b84a', strokeWidth: 4 });
    },
    // high-gravity glass capsule (ch.40 L12): drawn OVER a kneeling figure
    capsule: (W, H, o) => {
      const w = o.w || 200, h0 = o.h || 300;
      return rect(o.x - w / 2, o.y - h0, w, h0, { fill: '#cfe6ff', opacity: 0.18, stroke: '#cfe6ff', strokeWidth: 5, rx: 26 }) + path(`M${o.x - w / 2 + 16},${o.y - h0 + 30} l0,${h0 - 60}`, { stroke: '#fff', strokeWidth: 5, opacity: 0.5 }) + rect(o.x - w / 2 - 14, o.y - 8, w + 28, 22, { fill: '#9aa3b3', stroke: INK, strokeWidth: 3 }) + rect(o.x - w / 2 - 14, o.y - h0 - 14, w + 28, 22, { fill: '#9aa3b3', stroke: INK, strokeWidth: 3 }) + path(`M${o.x - w / 2 + 20},${o.y - 30} l${w - 40},0`, { stroke: '#e2b84a', strokeWidth: 3, strokeDasharray: '10 8' });
    },
    // invisibility shimmer: rippled outline where Naira stands (ch.41 L84)
    shimmer: (W, H, o) => { const h0 = o.h || 300, w = o.w || 90; return path(`M${o.x},${o.y - h0} C${o.x + w},${o.y - h0 * 0.8} ${o.x - w},${o.y - h0 * 0.4} ${o.x + w * 0.6},${o.y}`, { stroke: '#dff4ff', strokeWidth: 3, fill: 'none', opacity: 0.6 }) + path(`M${o.x - w * 0.6},${o.y - h0 * 0.9} C${o.x + w * 0.4},${o.y - h0 * 0.6} ${o.x - w * 0.8},${o.y - h0 * 0.3} ${o.x},${o.y}`, { stroke: '#dff4ff', strokeWidth: 2, fill: 'none', opacity: 0.4 }) + ellipse(o.x, o.y - h0 / 2, w, h0 / 2, { fill: '#dff4ff', opacity: 0.06 }); },
    // the Purifier patrol airship (ch.43 L22)
    airship: (W, H, o) => g(ellipse(0, 0, 260, 70, { fill: '#eef1f6', stroke: INK, strokeWidth: 4 }) + path('M-260,0 L260,0', { stroke: '#e2b84a', strokeWidth: 5 }) + rect(-80, 50, 160, 50, { fill: '#c9ced8', stroke: INK, strokeWidth: 3 }) + rect(-60, 62, 120, 20, { fill: '#7ad8ff', opacity: 0.6 }) + path('M220,-20 L300,-70 L300,40 L230,20Z', { fill: '#d6dbe4', stroke: INK, strokeWidth: 3 }) +
      (o.turret !== false ? rect(-150, 60, 50, 20, { fill: '#9aa3b3', stroke: INK, strokeWidth: 2 }) + rect(-190, 66, 50, 8, { fill: '#5a606a' }) : '') + (o.broken ? circle(-130, 70, 50, { fill: '#ff6a1a', opacity: 0.5 }) + path('M-160,40 l-20,-40 M-120,40 l10,-50', { stroke: '#3a3438', strokeWidth: 16, opacity: 0.6 }) : ''), { transform: `translate(${o.x},${o.y}) scale(${o.s || 1})` }),
    // waterfall column / splash
    waterfall: (W, H, o) => rect(o.x - o.w / 2, o.y, o.w, o.h, { fill: '#cfeeff', opacity: 0.55 }) + path(Array.from({ length: 5 }, (_, i) => `M${o.x - o.w / 2 + (i + 0.5) * o.w / 5},${o.y} l0,${o.h}`).join(' '), { stroke: '#ffffff', strokeWidth: 4, opacity: 0.6, strokeDasharray: '30 20' }) + ellipse(o.x, o.y + o.h, o.w * 1.2, 30, { fill: '#ffffff', opacity: 0.5 }),
    // splash crown on water
    splash: (W, H, o) => { const r = rng('sp' + o.x); let s = ellipse(o.x, o.y, o.r || 120, (o.r || 120) * 0.25, { fill: '#e8fff6', opacity: 0.6 }); for (let i = 0; i < 12; i++) { const a = Math.PI + (i / 11) * Math.PI; s += circle(o.x + Math.cos(a) * (o.r || 120) * (0.6 + r() * 0.5), o.y + Math.sin(a) * (o.r || 120) * (0.5 + r() * 0.5), 6 + r() * 8, { fill: '#e8fff6', opacity: 0.8 }); } return s; },
    // golden scroll with the sun-and-Z seal (ch.38 L178)
    goldScroll: (W, H, o) => g(rect(-80, -50, 160, 100, { fill: '#f6e6a8', stroke: INK, strokeWidth: 3 }) + rect(-90, -56, 16, 112, { fill: '#e2b84a', stroke: INK, strokeWidth: 2, rx: 6 }) + rect(74, -56, 16, 112, { fill: '#e2b84a', stroke: INK, strokeWidth: 2, rx: 6 }) + circle(0, 10, 22, { fill: '#c0172a', stroke: INK, strokeWidth: 2 }) + path(Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `M${Math.cos(a) * 24},${10 + Math.sin(a) * 24} l${Math.cos(a) * 8},${Math.sin(a) * 8}`; }).join(' '), { stroke: '#e2b84a', strokeWidth: 3 }) + path('M-8,2 l16,0 l-16,16 l16,0', { stroke: '#ffd45a', strokeWidth: 3, fill: 'none' }), { transform: `translate(${o.x},${o.y}) scale(${o.s || 1}) rotate(${o.a || 0})` }),
    // milky-white light virus eating cells and turning them into clear golden fluid (ch.38 L146)
    virusLight: (W, H, o) => { const r = rng('vl' + o.x); let s = ellipse(o.x, o.y, o.r || 80, (o.r || 80) * 0.3, { fill: o.gold ? '#ffd45a' : '#5a1420', opacity: 0.85, stroke: INK, strokeWidth: 2 }); for (let i = 0; i < 18; i++) s += circle(o.x + (r() - 0.5) * (o.r || 80) * 2, o.y - r() * (o.r || 80), 2 + r() * 4, { fill: '#f6f2e8', opacity: 0.9 }); return s + glow(o.x, o.y, (o.r || 80) * 1.6, o.gold ? '#ffd45a' : '#f6f2e8', 0.4); },
    // weapon rack with the confiscated weapons (ch.40 L104)
    weaponRack: (W, H, o) => { const p = require('./props').prop; return g(rect(-170, -300, 340, 300, { fill: '#3a3e46', stroke: INK, strokeWidth: 4 }) + rect(-170, -160, 340, 10, { fill: '#5a5e66' }) + (o.open ? path('M-170,-300 L-230,-260 L-230,-40 L-170,0', { fill: '#5a5e66', stroke: INK, strokeWidth: 3 }) : '') +
      (o.empty ? '' : g(p('sword', { len: 240, ember: true }), { transform: 'translate(-120,-280) rotate(90) scale(0.9)' }) + g(p('voltSword', {}), { transform: 'translate(-60,-280) rotate(90) scale(0.9)' }) + g(p('heavyPistol', {}), { transform: 'translate(10,-230) scale(0.9)' }) + g(p('sniper', {}), { transform: 'translate(10,-110) scale(0.6)' }) + g(p('mace', {}), { transform: 'translate(110,-280) rotate(90) scale(0.8)' })), { transform: `translate(${o.x},${o.y}) scale(${o.s || 1})` }); },
    // red emergency / execution digital clock housing (digits are placed as overlays by the site)
    clockBox: (W, H, o) => rect(o.x - 130, o.y - 40, 260, 80, { fill: '#0a0a0e', stroke: '#5a5e66', strokeWidth: 5 }) + rect(o.x - 110, o.y - 24, 220, 48, { fill: '#3a0a10', opacity: 0.8 }) + glow(o.x, o.y, 140, '#ff2a3a', 0.3),
    // archbishop Nal's grey suppression wave (ch.40 L78)
    greyWave: (W, H, o) => { let s = ''; for (let i = 1; i <= 4; i++) s += circle(o.x, o.y, (o.r || 120) * i, { fill: 'none', stroke: '#9aa0aa', strokeWidth: 6 - i, opacity: 0.6 - i * 0.1 }); return s + rect(0, 0, W, H, { fill: '#5a5e66', opacity: 0.12 }); },
    // breach in a wall (explosion opening) seen from inside: ragged hole with night sky
    breach: (W, H, o) => { const r0 = o.r || 200, r = rng('bh' + o.x); const pts = Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2, k = 0.7 + r() * 0.4; return [o.x + Math.cos(a) * r0 * k, o.y + Math.sin(a) * r0 * k * 0.9]; }); return poly(pts, { fill: '#0a1430', stroke: '#3a3e46', strokeWidth: 10 }) + Array.from({ length: 10 }, () => circle(o.x + (r() - 0.5) * r0, o.y + (r() - 0.5) * r0 * 0.8, 1.6, { fill: '#e8f4ff' })).join(''); },
    // a long blade that suddenly extends ten metres (ch.39 L168)
    longBlade: (W, H, o) => path(`M${o.x1},${o.y1} L${o.x2},${o.y2}`, { stroke: INK, strokeWidth: 14, strokeLinecap: 'round' }) + path(`M${o.x1},${o.y1} L${o.x2},${o.y2}`, { stroke: '#dfe3ea', strokeWidth: 9, strokeLinecap: 'round' }) + path(`M${o.x1},${o.y1} L${o.x2},${o.y2}`, { stroke: '#ffffff', strokeWidth: 2 }),
    // clap shock-wave of compressed air (ch.39 L158)
    airBurst: (W, H, o) => { let s = ''; for (let i = 1; i <= 3; i++) s += path(`M${o.x},${o.y - 60 * i} A${60 * i},${60 * i} 0 0,1 ${o.x},${o.y + 60 * i}`, { stroke: '#e8f4ff', strokeWidth: 10 - i * 2, fill: 'none', opacity: 0.8, transform: o.dir === 'l' ? `rotate(180 ${o.x} ${o.y})` : undefined }); return s + glow(o.x, o.y, 120, '#e8f4ff', 0.5); },
  };
  return FX4;
};
