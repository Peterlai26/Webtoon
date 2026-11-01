// Effects and set-pieces for EP46-65. Merged into FX by fx.js. No text.
'use strict';
const { INK, rng, path, circle, ellipse, rect, line, poly, g, f } = require('./util');

module.exports = function fx5({ glow }) {
  const FX5 = {
    // Setsu's red cutting line hanging in mid-air (ch.47 L286)
    redCut: (W, H, o) => path(`M${o.x1},${o.y1} L${o.x2},${o.y2}`, { stroke: '#ff2a3a', strokeWidth: (o.w || 6) * 4, opacity: 0.25, strokeLinecap: 'round' }) + path(`M${o.x1},${o.y1} L${o.x2},${o.y2}`, { stroke: '#ff3a4a', strokeWidth: o.w || 6, strokeLinecap: 'round' }) + path(`M${o.x1},${o.y1} L${o.x2},${o.y2}`, { stroke: '#fff', strokeWidth: 1.6 }),
    // a faint ring painted on the ground (Tax's movement-tax domain, ch.47 L58)
    groundRing: (W, H, o) => ellipse(o.x, o.y, o.rx || 300, o.ry || 70, { fill: o.color || '#ff2a3a', opacity: 0.1, stroke: o.color || '#ff2a3a', strokeWidth: 4, strokeDasharray: '18 10' }),
    // Velen's light-fingers: a fan of thin cyan rays from a hand point to targets
    lightRays: (W, H, o) => (o.to || []).map(([x, y]) => path(`M${o.x},${o.y} Q${(o.x + x) / 2 + (o.bend || 0)},${(o.y + y) / 2 - (o.sag ?? 40)} ${x},${y}`, { stroke: '#3ad8ff', strokeWidth: 10, opacity: 0.3, fill: 'none' }) + path(`M${o.x},${o.y} Q${(o.x + x) / 2 + (o.bend || 0)},${(o.y + y) / 2 - (o.sag ?? 40)} ${x},${y}`, { stroke: '#eaffff', strokeWidth: 3, fill: 'none' })).join('') + glow(o.x, o.y, 60, '#7ae6ff', 0.8),
    // a ring of light binding wrists / necks (ch.47 L306)
    lightLoop: (W, H, o) => ellipse(o.x, o.y, o.r || 40, (o.r || 40) * 0.4, { fill: 'none', stroke: '#3ad8ff', strokeWidth: 10, opacity: 0.4 }) + ellipse(o.x, o.y, o.r || 40, (o.r || 40) * 0.4, { fill: 'none', stroke: '#eaffff', strokeWidth: 3 }),
    // glowing finger tips (ten points of light around two hands)
    fingerLights: (W, H, o) => (o.pts || []).map(([x, y]) => glow(x, y, o.r || 26, '#7ae6ff', 0.9) + circle(x, y, (o.r || 26) * 0.3, { fill: '#ffffff' })).join(''),
    // Rey's zero-point ash pulse: black-red sphere bursting from the skin (ch.48 L15)
    ashPulse: (W, H, o) => {
      const r0 = o.r || 200, r = rng('ap' + o.x + o.y);
      let s = glow(o.x, o.y, r0 * 1.4, '#ff3a1a', 0.4) + circle(o.x, o.y, r0, { fill: '#1a0608', opacity: 0.45, stroke: '#ff3a1a', strokeWidth: 6 });
      for (let i = 0; i < 18; i++) { const a = r() * Math.PI * 2, d = r0 * (0.6 + r() * 0.5); s += path(`M${f(o.x + Math.cos(a) * r0 * 0.3)},${f(o.y + Math.sin(a) * r0 * 0.3)} L${f(o.x + Math.cos(a) * d)},${f(o.y + Math.sin(a) * d)}`, { stroke: i % 2 ? '#ff6a2a' : '#2a0a0e', strokeWidth: 6, strokeLinecap: 'round' }); }
      return s;
    },
    // ash-flame jet under the feet (ch.53 L28)
    ashJet: (W, H, o) => path(`M${o.x - 60},${o.y} Q${o.x},${o.y + (o.len || 200)} ${o.x + 60},${o.y}`, { fill: '#ff4a1a', opacity: 0.55, stroke: '#2a0a0e', strokeWidth: 5 }) + glow(o.x, o.y + 60, 140, '#ff6a2a', 0.5),
    // Miray's garden of golden thorn vines rising from the ground (ch.52 L30-34)
    thornGarden: (W, H, o) => {
      const r = rng('tg' + (o.seed || '') + H); let s = '';
      for (let i = 0; i < (o.n || 22); i++) {
        const x = (o.x ?? 0) + r() * (o.w || W), y = (o.y ?? H) - r() * (o.h || H * 0.2), hh = 120 + r() * (o.reach || 300), bend = (r() - 0.5) * 200;
        const d = `M${f(x)},${f(y)} Q${f(x + bend)},${f(y - hh * 0.6)} ${f(x + bend * 0.4)},${f(y - hh)}`;
        s += path(d, { stroke: INK, strokeWidth: 11, fill: 'none', strokeLinecap: 'round' }) + path(d, { stroke: '#e2b84a', strokeWidth: 7, fill: 'none', strokeLinecap: 'round' }) + path(d, { stroke: '#fff3b0', strokeWidth: 2, fill: 'none', strokeDasharray: '3 12' });
      }
      return s + (o.shock ? rect(0, 0, W, H, { fill: '#ff8ab0', opacity: 0.08 }) : '');
    },
    // a thorn vine pierced through a point (end at x,y, from direction a)
    thornSpike: (W, H, o) => (o.pts || []).map(([x, y, a]) => { const ex = x - Math.cos((a * Math.PI) / 180) * 260, ey = y - Math.sin((a * Math.PI) / 180) * 260; const d = `M${f(ex)},${f(ey)} L${x},${y}`; return path(d, { stroke: INK, strokeWidth: 11, strokeLinecap: 'round' }) + path(d, { stroke: '#e2b84a', strokeWidth: 7, strokeLinecap: 'round' }) + circle(x, y, 8, { fill: '#b3101f' }); }).join(''),
    // Miray's rose armour of coiled thorns (ch.53 L54)
    roseArmour: (W, H, o) => { let s = ''; for (let i = 0; i < 5; i++) s += ellipse(o.x, o.y - i * (o.h || 300) / 5, (o.r || 90) - i * 6, 30, { fill: 'none', stroke: '#e2b84a', strokeWidth: 9 }); for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; s += path(`M${f(o.x + Math.cos(a) * (o.r || 90))},${f(o.y - (o.h || 300) / 2 + Math.sin(a) * 80)} l${f(Math.cos(a) * 50)},${f(Math.sin(a) * 30)}`, { stroke: '#e2b84a', strokeWidth: 6, strokeLinecap: 'round' }); } return s; },
    // kinetic absorption rings spinning on a gauntlet (ch.51 L198)
    kinetic: (W, H, o) => { const r0 = o.r || 50; let s = glow(o.x, o.y, r0 * 2, '#ffd45a', 0.6); for (let i = 1; i <= 3; i++) s += ellipse(o.x, o.y, r0 * i * 0.6, r0 * i * 0.25, { fill: 'none', stroke: '#ffd45a', strokeWidth: 4, opacity: 1 - i * 0.2, transform: `rotate(${i * 30} ${o.x} ${o.y})` }); return s; },
    // sonar rings from Vesper's headphones (ch.57 L70)
    sonar: (W, H, o) => { let s = ''; for (let i = 1; i <= (o.n || 4); i++) s += circle(o.x, o.y, (o.r || 60) * i, { fill: 'none', stroke: o.color || '#3ad8ff', strokeWidth: 3, opacity: 0.7 - i * 0.12, strokeDasharray: '10 8' }); return s; },
    // a vertical pillar of supernatural white light (rebirth columns, ch.50 L152)
    lightPillar: (W, H, o) => rect(o.x - (o.w || 60) / 2, 0, o.w || 60, o.y, { fill: '#ffffff', opacity: 0.55 }) + rect(o.x - (o.w || 60) * 0.2, 0, (o.w || 60) * 0.4, o.y, { fill: '#ffffff', opacity: 0.8 }) + ellipse(o.x, o.y, (o.w || 60) * 1.4, 18, { fill: '#ffffff', opacity: 0.8 }) + glow(o.x, o.y - 100, (o.w || 60) * 3, '#ffffff', 0.4),
    // the gold frame snapping shut around two fighters (ch.53 L263)
    duelFrame: (W, H, o) => rect(o.x - o.w / 2, o.y - o.h / 2, o.w, o.h, { fill: '#ffd45a', opacity: 0.12, stroke: '#ffd45a', strokeWidth: 8 }) + rect(o.x - o.w / 2 + 16, o.y - o.h / 2 + 16, o.w - 32, o.h - 32, { fill: 'none', stroke: '#fff3b0', strokeWidth: 3, strokeDasharray: '14 8' }),
    // EMP shrapnel storm in the sky (ch.55 L112)
    empStorm: (W, H, o) => { const r = rng('em' + o.x); let s = glow(o.x, o.y, (o.r || 260) * 1.2, '#b14bff', 0.4); for (let i = 0; i < 40; i++) { const a = r() * Math.PI * 2, d = r() * (o.r || 260); s += line([o.x + Math.cos(a) * d * 0.5, o.y + Math.sin(a) * d * 0.5], [o.x + Math.cos(a) * d, o.y + Math.sin(a) * d], { stroke: i % 2 ? '#e0b8ff' : '#7ae6ff', strokeWidth: 3 }); } return s; },
    // the 20-mach railgun beam: violet-white plasma column, shock rings along it (ch.55 L194)
    railShot: (W, H, o) => {
      const w = o.w || 40;
      let s = path(`M${o.x1},${o.y1} L${o.x2},${o.y2}`, { stroke: '#9a5aff', strokeWidth: w * 3, opacity: 0.25, strokeLinecap: 'round' }) + path(`M${o.x1},${o.y1} L${o.x2},${o.y2}`, { stroke: '#e0c8ff', strokeWidth: w, strokeLinecap: 'round' }) + path(`M${o.x1},${o.y1} L${o.x2},${o.y2}`, { stroke: '#ffffff', strokeWidth: w * 0.35, strokeLinecap: 'round' });
      for (let i = 1; i < 4; i++) { const t = i / 4, x = o.x1 + (o.x2 - o.x1) * t, y = o.y1 + (o.y2 - o.y1) * t; s += ellipse(x, y, w * 0.6, w * 1.8, { fill: 'none', stroke: '#e0c8ff', strokeWidth: 3, opacity: 0.7 }); }
      return s;
    },
    // a bare iron-bone torso (Claire stripped to the skeleton, overlay for big close-ups)
    sparkJoints: (W, H, o) => (o.pts || []).map(([x, y]) => path(`M${x},${y} l10,-14 l-6,-2 l12,-16`, { stroke: '#7ae6ff', strokeWidth: 3, fill: 'none' })).join(''),
    // a ripped-out heart hole in the chest
    heartHole: (W, H, o) => circle(o.x, o.y, o.r || 24, { fill: '#2a0408', stroke: '#7a0a16', strokeWidth: 5 }) + path(`M${o.x},${o.y + (o.r || 24)} q4,30 -2,60`, { stroke: '#7a0a16', strokeWidth: 6, fill: 'none' }),
    // a beating heart held in a claw
    heart: (W, H, o) => g(path('M0,10 C-30,-14 -20,-40 0,-24 C20,-40 30,-14 0,10Z', { fill: '#b3101f', stroke: INK, strokeWidth: 3 }) + path('M-4,-26 q-4,-10 4,-18', { stroke: '#7a0a16', strokeWidth: 4, fill: 'none' }), { transform: `translate(${o.x},${o.y}) scale(${o.s || 1})` }),
    // blood-fire flaring on claws / kinetic plasma on fists (ch.58 L172-178)
    flameAura: (W, H, o) => { const r = rng('fa' + o.x); let s = glow(o.x, o.y, (o.r || 80) * 1.6, o.color || '#ff3a1a', 0.55); for (let i = 0; i < 8; i++) { const x = o.x + (r() - 0.5) * (o.r || 80); s += path(`M${f(x - 12)},${o.y} Q${f(x)},${f(o.y - (o.r || 80) * (1 + r()))} ${f(x + 12)},${o.y}Z`, { fill: o.color || '#ff3a1a', opacity: 0.6 }); } return s; },
    // the soul-resonance shockwave rings (ch.58 L124-128)
    soulWave: (W, H, o) => { let s = glow(o.x, o.y, (o.r || 300) * 0.7, '#dff4ff', 0.6); for (let i = 1; i <= 4; i++) s += circle(o.x, o.y, (o.r || 300) * i / 4, { fill: 'none', stroke: '#eaf6ff', strokeWidth: 10 - i * 2, opacity: 0.85 - i * 0.15 }); return s; },
    // ashes of a burned soul scattering into white motes (ch.58 L210)
    motes: (W, H, o) => { const r = rng('mo' + o.x); let s = ''; for (let i = 0; i < (o.n || 40); i++) s += circle(o.x + (r() - 0.5) * (o.w || 300), o.y + (r() - 0.5) * (o.h || 300), 2 + r() * 5, { fill: o.color || '#ffffff', opacity: 0.4 + r() * 0.5 }); return s; },
    // Velen's thousand-ray barrier: a lattice of white beams across the bridge (ch.60 L191-197)
    rayLattice: (W, H, o) => { let s = rect(o.x, o.y, o.w, o.h, { fill: '#eaffff', opacity: 0.12 }); for (let i = 0; i <= 12; i++) { s += line([o.x + (i * o.w) / 12, o.y], [o.x + o.w - (i * o.w) / 12, o.y + o.h], { stroke: '#eaffff', strokeWidth: 3, opacity: 0.85 }); s += line([o.x, o.y + (i * o.h) / 12], [o.x + o.w, o.y + o.h - (i * o.h) / 12], { stroke: '#7ae6ff', strokeWidth: 2, opacity: 0.6 }); } return s + glow(o.x + o.w / 2, o.y + o.h / 2, o.w * 0.5, '#eaffff', 0.25); },
    // royal-edict links: white-gold threads from many chests to the king (ch.62 L68-74)
    edictLinks: (W, H, o) => (o.from || []).map(([x, y]) => path(`M${x},${y} Q${(x + o.x) / 2},${Math.min(y, o.y) - 80} ${o.x},${o.y}`, { stroke: '#ffe8a8', strokeWidth: 3, fill: 'none', opacity: 0.8 })).join('') + glow(o.x, o.y, 120, '#ffe8a8', 0.6),
    // the six-light-wing sun fireball (ch.64 L24)
    sunOrb: (W, H, o) => { const r0 = o.r || 200; let s = glow(o.x, o.y, r0 * 2, '#ffd45a', 0.6) + circle(o.x, o.y, r0, { fill: '#fff2b0', stroke: '#ff8a2a', strokeWidth: 8 }) + circle(o.x, o.y, r0 * 0.6, { fill: '#ffffff', opacity: 0.8 }); for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; s += line([o.x + Math.cos(a) * r0, o.y + Math.sin(a) * r0], [o.x + Math.cos(a) * r0 * 1.3, o.y + Math.sin(a) * r0 * 1.3], { stroke: '#ffd45a', strokeWidth: 6 }); } return s; },
    // the seven-layer soul prism cage (ch.65 L97)
    prismCage: (W, H, o) => { let s = ''; for (let i = 0; i < 7; i++) { const r0 = (o.r || 320) * (1 - i * 0.1); s += poly(Array.from({ length: 6 }, (_, k) => { const a = (k / 6) * Math.PI * 2 + i * 0.25; return [o.x + Math.cos(a) * r0, o.y + Math.sin(a) * r0]; }), { fill: '#ffffff', opacity: 0.05, stroke: i % 2 ? '#ffe8a8' : '#eaf6ff', strokeWidth: 3 }); } return s + glow(o.x, o.y, (o.r || 320) * 0.8, '#ffffff', o.op ?? 0.35); },
    // a white light-stream (souls flowing to the castle)
    soulStreams: (W, H, o) => (o.from || []).map(([x, y]) => path(`M${x},${y} Q${(x + o.x) / 2},${y - 160} ${o.x},${o.y}`, { stroke: '#ffffff', strokeWidth: 6, opacity: 0.6, fill: 'none' })).join(''),
    // a clear invisible box drawn by the mime (ch.46 L60)
    mimeBox: (W, H, o) => rect(o.x - o.w / 2, o.y - o.h, o.w, o.h, { fill: '#dff4ff', opacity: 0.12, stroke: '#dff4ff', strokeWidth: 3, strokeDasharray: '10 6' }),
    // hexagonal vent cracking open in the gold dimension wall (ch.54 L102)
    hexCrack: (W, H, o) => poly(Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2; return [o.x + Math.cos(a) * (o.r || 50), o.y + Math.sin(a) * (o.r || 50)]; }), { fill: '#3a3a42', stroke: '#fff7d0', strokeWidth: 4 }) + path(`M${o.x - (o.r || 50)},${o.y} l-40,-20 M${o.x + (o.r || 50)},${o.y} l40,24 M${o.x},${o.y - (o.r || 50)} l10,-40`, { stroke: '#ffd45a', strokeWidth: 3 }) + glow(o.x, o.y, (o.r || 50) * 2, '#ffd45a', 0.35),
    // Draken's dragon-possession light wings, drawn behind him (ch.61 L86): centred on the shoulders at x,y
    dragonWings: (W, H, o) => { const k = o.s || 1; let s = ''; for (const d of [-1, 1]) s += path(`M${o.x},${o.y} C${o.x + d * 160 * k},${o.y - 200 * k} ${o.x + d * 320 * k},${o.y - 160 * k} ${o.x + d * 360 * k},${o.y + 20 * k} C${o.x + d * 260 * k},${o.y - 40 * k} ${o.x + d * 180 * k},${o.y + 10 * k} ${o.x + d * 30 * k},${o.y + 120 * k}Z`, { fill: '#fff4c8', opacity: 0.7, stroke: '#ffd45a', strokeWidth: 4 }); return s + glow(o.x, o.y, 260 * k, '#ffe48a', 0.3); },
  };
  return FX5;
};
