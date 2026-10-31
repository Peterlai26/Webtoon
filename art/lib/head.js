// Heads: face, eyes, expressions, hair styles, helmets/masks.
// Local frame: head centre (0,0), radius ~44, facing +x.
'use strict';
const { INK, path, circle, ellipse, g, id, linGrad, radGrad, smooth } = require('./util');

const EXPR = {
  neutral:    { eye: 'open', brow: 'neutral', mouth: 'flat' },
  smile:      { eye: 'open', brow: 'raised', mouth: 'smile' },
  grin:       { eye: 'happy', brow: 'raised', mouth: 'grin' },
  bright:     { eye: 'open', brow: 'raised', mouth: 'grin' },
  nervous:    { eye: 'open', brow: 'worried', mouth: 'smile', sweat: true },
  awkward:    { eye: 'happy', brow: 'worried', mouth: 'smile', sweat: true },
  shock:      { eye: 'wide', brow: 'raised', mouth: 'open', sweat: true },
  gasp:       { eye: 'wide', brow: 'worried', mouth: 'o' },
  scream:     { eye: 'squeeze', brow: 'worried', mouth: 'open' },
  pain:       { eye: 'squeeze', brow: 'worried', mouth: 'teeth', sweat: true },
  painOpen:   { eye: 'wide', brow: 'worried', mouth: 'teeth', sweat: true },
  angry:      { eye: 'open', brow: 'angry', mouth: 'teeth' },
  shout:      { eye: 'open', brow: 'angry', mouth: 'open' },
  furious:    { eye: 'wide', brow: 'angry', mouth: 'open', vein: true },
  cold:       { eye: 'narrow', brow: 'flat', mouth: 'flat' },
  coldShade:  { eye: 'narrow', brow: 'angry', mouth: 'flat', shade: true },
  smirk:      { eye: 'narrow', brow: 'flat', mouth: 'smirk' },
  sly:        { eye: 'narrow', brow: 'raised', mouth: 'smirk' },
  determined: { eye: 'open', brow: 'angry', mouth: 'flat' },
  deadpan:    { eye: 'half', brow: 'flat', mouth: 'flat' },
  sad:        { eye: 'open', brow: 'worried', mouth: 'frown' },
  calm:       { eye: 'half', brow: 'neutral', mouth: 'smallSmile' },
  closed:     { eye: 'closed', brow: 'neutral', mouth: 'flat' },
  sleep:      { eye: 'closed', brow: 'neutral', mouth: 'o' },
  confused:   { eye: 'open', brow: 'worried', mouth: 'o', sweat: true },
  manic:      { eye: 'wide', brow: 'raised', mouth: 'grin' },
  focused:    { eye: 'narrow', brow: 'angry', mouth: 'flat' },
  dazed:      { eye: 'blank', brow: 'worried', mouth: 'o' },
  dead:       { eye: 'blank', brow: 'neutral', mouth: 'o' },
  cry:        { eye: 'squeeze', brow: 'worried', mouth: 'open', tears: true },
};

function eye(cx, cy, sx, kind, color, glow) {
  const w = 11 * sx, o = [];
  if (glow) {
    o.push(ellipse(cx, cy, w * 1.15, 6, { fill: glow, opacity: 0.35 }));
    o.push(ellipse(cx, cy, w * 0.9, 4.2, { fill: '#fff' }));
    return o.join('');
  }
  switch (kind) {
    case 'closed':
      return path(`M${cx - w},${cy} Q${cx},${cy + 6} ${cx + w},${cy}`, { stroke: INK, strokeWidth: 3, fill: 'none', strokeLinecap: 'round' });
    case 'happy':
      return path(`M${cx - w},${cy + 3} Q${cx},${cy - 8} ${cx + w},${cy + 3}`, { stroke: INK, strokeWidth: 3.2, fill: 'none', strokeLinecap: 'round' });
    case 'squeeze':
      return path(`M${cx - w},${cy - 6} L${cx + w * 0.6},${cy} L${cx - w},${cy + 5}`, { stroke: INK, strokeWidth: 3, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' });
  }
  const h = kind === 'wide' ? 9 : kind === 'narrow' ? 5.5 : kind === 'half' ? 6.5 : 8;
  const top = cy - h, bot = cy + h * 0.8;
  o.push(path(`M${cx - w},${cy} Q${cx - w * 0.4},${top} ${cx + w},${cy - h * 0.55} Q${cx + w * 0.4},${bot} ${cx - w},${cy}Z`, { fill: '#fff' }));
  const ir = kind === 'wide' ? 3.6 : 6.2;
  const irY = kind === 'wide' ? cy : cy + 0.5;
  if (kind !== 'blank') {
    o.push(ellipse(cx + w * 0.08, irY, ir * Math.min(1, sx + 0.1), ir * 1.25, { fill: color }));
    o.push(ellipse(cx + w * 0.08, irY + ir * 0.35, ir * 0.7 * sx, ir * 0.6, { fill: '#000', opacity: 0.25 }));
    o.push(circle(cx + w * 0.08, irY, ir * 0.45, { fill: '#0b0a10' }));
    o.push(circle(cx + w * 0.08 + ir * 0.4, irY - ir * 0.5, ir * 0.33, { fill: '#fff' }));
  } else {
    o.push(ellipse(cx + w * 0.08, irY, ir * sx, ir * 1.2, { fill: color, opacity: 0.45 }));
  }
  // upper lid / lash line
  const lidY = kind === 'half' ? cy - h * 0.1 : top + 1;
  if (kind === 'half') o.push(path(`M${cx - w - 1},${cy - 1} Q${cx - w * 0.4},${top - 1} ${cx + w + 1},${cy - h * 0.6} L${cx + w + 1},${lidY} Q${cx},${lidY - 1} ${cx - w - 1},${cy + 0.5}Z`, { fill: INK, opacity: 0.85 }));
  o.push(path(`M${cx - w - 1.5},${cy + 0.5} Q${cx - w * 0.4},${top - 1.5} ${cx + w + 2},${cy - h * 0.55}`, { stroke: INK, strokeWidth: kind === 'narrow' ? 3.6 : 3.2, fill: 'none', strokeLinecap: 'round' }));
  return o.join('');
}

function brow(cx, cy, sx, kind, color, mirror) {
  const w = 12 * sx;
  let a = 0, b = 0, raise = 0;
  if (kind === 'angry') { a = -2; b = 6; }
  if (kind === 'worried') { a = 4; b = -5; }
  if (kind === 'raised') raise = -5;
  if (kind === 'flat') { a = 1; b = 1; }
  const inner = mirror ? -1 : 1; // inner end toward nose
  const xi = cx + w * inner, xo = cx - w * inner;
  return path(`M${xo},${cy + raise + a} Q${cx},${cy + raise - 4} ${xi},${cy + raise + b}`, { stroke: color, strokeWidth: 4, fill: 'none', strokeLinecap: 'round' });
}

function mouth(mx, my, kind, sx = 1) {
  const s = { stroke: INK, strokeWidth: 2.6, fill: 'none', strokeLinecap: 'round' };
  switch (kind) {
    case 'smile': return path(`M${mx - 9 * sx},${my - 2} Q${mx},${my + 6} ${mx + 9 * sx},${my - 3}`, s);
    case 'smallSmile': return path(`M${mx - 5 * sx},${my} Q${mx},${my + 3} ${mx + 6 * sx},${my - 1}`, s);
    case 'grin': return path(`M${mx - 11 * sx},${my - 3} Q${mx},${my - 1} ${mx + 11 * sx},${my - 4} Q${mx + 2},${my + 13} ${mx - 11 * sx},${my - 3}Z`, { fill: '#7a1f2b', stroke: INK, strokeWidth: 2.4 }) +
      path(`M${mx - 9 * sx},${my - 2} Q${mx},${my} ${mx + 9 * sx},${my - 3} L${mx + 7 * sx},${my + 1} Q${mx},${my + 3} ${mx - 7 * sx},${my + 1}Z`, { fill: '#fff' });
    case 'open': return ellipse(mx, my + 3, 8 * sx, 9, { fill: '#5a1420', stroke: INK, strokeWidth: 2.4 }) + ellipse(mx, my + 8, 5 * sx, 3, { fill: '#c0485a' });
    case 'o': return ellipse(mx, my + 1, 3.6 * sx, 4.4, { fill: '#5a1420', stroke: INK, strokeWidth: 2 });
    case 'frown': return path(`M${mx - 8 * sx},${my + 3} Q${mx},${my - 4} ${mx + 8 * sx},${my + 3}`, s);
    case 'smirk': return path(`M${mx - 7 * sx},${my + 1} Q${mx + 2},${my + 3} ${mx + 10 * sx},${my - 5}`, s);
    case 'teeth': return path(`M${mx - 11 * sx},${my - 3} L${mx + 11 * sx},${my - 4} L${mx + 10 * sx},${my + 5} L${mx - 10 * sx},${my + 5}Z`, { fill: '#fff', stroke: INK, strokeWidth: 2.4, strokeLinejoin: 'round' }) +
      path(`M${mx - 11 * sx},${my + 1} L${mx + 11 * sx},${my} M${mx - 4 * sx},${my - 3.5} L${mx - 4 * sx},${my + 5} M${mx + 3 * sx},${my - 4} L${mx + 3 * sx},${my + 5}`, { stroke: INK, strokeWidth: 1.4 });
    default: return path(`M${mx - 7 * sx},${my} L${mx + 7 * sx},${my - 0.5}`, s);
  }
}

// ---------------- hair styles ----------------
// Each returns { behind (drawn behind body), back (behind face), front (over face) }.
const HAIR = {
  rey(c) {
    const back = smooth([[-46, -4], [-52, -30], [-40, -56], [-14, -68], [14, -66], [38, -54], [50, -30], [48, -10], [36, -28], [6, -36], [-28, -22], [-40, 8], [-42, 22]]);
    const spikes = `M-40,-48 L-58,-60 L-34,-58 L-30,-74 L-14,-64 L-4,-82 L8,-66 L26,-76 L28,-58 L48,-62 L40,-44Z`;
    const front = `M-38,-26 C-30,-62 42,-64 50,-24 L42,-8 L36,-22 L28,-2 L20,-24 L10,0 L2,-24 L-8,-6 L-14,-28 L-24,-10 L-28,-30Z`;
    return { back: path(back, { fill: c }) + path(spikes, { fill: c }), front: path(front, { fill: c }), shine: path('M-6,-50 Q10,-56 24,-48', { stroke: '#4a4d63', strokeWidth: 3, fill: 'none', opacity: 0.8 }) };
  },
  lucas(c) {
    const back = smooth([[-46, 0], [-50, -30], [-36, -58], [-6, -68], [24, -62], [44, -44], [50, -18], [46, 6], [30, -24], [-10, -30], [-34, -10], [-40, 30], [-48, 40], [-52, 18]]);
    const front = `M-40,-20 C-36,-62 30,-70 50,-30 C52,-10 48,10 44,26 C40,8 36,-6 30,-14 C22,-4 10,2 -2,4 C8,-6 12,-14 14,-24 C0,-16 -20,-14 -40,-20Z`;
    return { back: path(back, { fill: c }), front: path(front, { fill: c }), shine: path('M-14,-52 Q8,-60 30,-46', { stroke: '#ffffff', strokeWidth: 3, fill: 'none', opacity: 0.9 }) };
  },
  sera(c, o) {
    const behind = smooth([[-44, -20], [-50, 40], [-56, 120], [-50, 210], [-30, 236], [-10, 210], [-8, 130], [-14, 60], [20, 40], [40, 100], [44, 190], [56, 220], [62, 150], [56, 40], [48, -20]]);
    const back = smooth([[-46, 0], [-50, -30], [-36, -58], [-6, -68], [24, -62], [44, -44], [50, -18], [48, 20]]);
    // curtain bang covering one eye
    const coverFar = o.coverFar !== false;
    const front = coverFar
      ? `M-40,-24 C-34,-64 36,-68 50,-26 C46,-10 42,-2 40,8 C36,-6 30,-18 22,-24 C14,-14 6,-6 -4,0 C-8,12 -14,30 -22,42 C-28,30 -34,10 -40,-24Z`
      : `M-40,-24 C-34,-64 36,-68 50,-26 C52,0 46,30 40,46 C30,30 24,14 22,0 C16,-8 6,-14 -6,-18 C-16,-10 -28,-6 -40,-24Z`;
    return { behind: path(behind, { fill: c }), back: path(back, { fill: c }), front: path(front, { fill: c }), shine: path('M-10,-54 Q8,-60 26,-50', { stroke: '#4b4a5e', strokeWidth: 3, fill: 'none', opacity: 0.8 }) };
  },
  lilith(c) {
    const back = smooth([[-48, 0], [-54, -32], [-38, -60], [-6, -70], [26, -64], [46, -46], [54, -16], [54, 24], [44, 44], [38, 18], [30, -20], [-20, -24], [-40, 20], [-52, 48], [-58, 26]]);
    const front = `M-40,-24 C-30,-66 38,-70 52,-26 L46,-12 C40,-24 30,-30 24,-30 C26,-20 22,-10 16,-6 C14,-16 8,-24 2,-28 C0,-18 -6,-10 -12,-6 C-12,-16 -16,-24 -22,-26 C-26,-16 -34,-10 -40,-24Z`;
    const strands = path('M40,-40 Q60,-60 52,-80 M-30,-56 Q-50,-74 -40,-90 M10,-66 Q20,-86 6,-96', { stroke: c, strokeWidth: 4, fill: 'none', strokeLinecap: 'round' });
    return { back: path(back, { fill: c }) + strands, front: path(front, { fill: c }), shine: path('M-10,-56 Q8,-62 26,-52', { stroke: '#8a6a58', strokeWidth: 3, fill: 'none', opacity: 0.7 }) };
  },
  knell(c) {
    const gid = id('kh');
    const fill = `url(#${gid})`;
    const defs = `<defs>${linGrad(gid, [[0, c], [0.62, c], [1, '#e8ecf4']])}</defs>`;
    const back = smooth([[-48, 0], [-52, -32], [-36, -60], [-6, -70], [26, -64], [46, -44], [52, -16], [50, 22], [40, 40], [32, 6], [-20, -20], [-38, 24], [-46, 46], [-54, 26]]);
    const front = `M-40,-22 C-34,-64 38,-70 52,-26 L48,10 L40,-8 L34,14 L28,-12 L16,4 L10,-18 L-2,-4 L-6,-22 L-18,-10 L-22,-26 L-34,-12Z`;
    return { back: defs + path(back, { fill }), front: path(front, { fill }), shine: path('M-10,-56 Q8,-62 26,-52', { stroke: '#4c5c8c', strokeWidth: 3, fill: 'none' }) };
  },
  suture() {
    const behindL = smooth([[-46, -20], [-54, 60], [-58, 160], [-40, 200], [-10, 160], [-10, 60], [0, 30]]);
    const behindR = smooth([[0, 30], [20, 50], [36, 140], [50, 200], [64, 150], [56, 40], [48, -20]]);
    const backL = `M0,-70 C-30,-70 -54,-46 -50,-4 L-46,30 L0,10Z`;
    const backR = `M0,-70 C30,-70 54,-46 50,-4 L48,30 L0,10Z`;
    const front = `M0,-66 C-30,-66 -40,-46 -40,-20 C-30,-28 -16,-32 0,-34Z`;
    const front2 = `M0,-66 C30,-66 46,-46 50,-22 C40,-30 20,-34 0,-34Z`;
    return { behind: path(behindL, { fill: '#121118' }) + path(behindR, { fill: '#ecebef' }), back: path(backL, { fill: '#121118' }) + path(backR, { fill: '#ecebef' }), front: path(front, { fill: '#121118' }) + path(front2, { fill: '#ecebef' }) };
  },
  raze(c) {
    const hood = smooth([[-56, 10], [-60, -40], [-40, -74], [-2, -84], [36, -74], [56, -44], [60, 0], [54, 40], [30, 58], [-36, 58]]);
    const back = smooth([[-46, 4], [-50, -30], [-36, -58], [-6, -66], [24, -62], [44, -44], [50, -16], [46, 18], [36, 30], [-30, 30]]);
    const front = `M-40,-20 C-34,-62 38,-66 50,-24 L44,-2 L38,-16 L30,6 L22,-18 L14,0 L8,-20 L-2,-2 L-8,-22 L-20,-6 L-26,-24Z`;
    return { behind: path(hood, { fill: '#17161d', stroke: INK, strokeWidth: 3 }), back: path(back, { fill: c }), front: path(front, { fill: c }) };
  },
  short(c) {
    const back = smooth([[-46, 0], [-50, -30], [-36, -58], [-6, -66], [24, -62], [44, -44], [50, -18], [46, 0], [30, -28], [-24, -24], [-42, 16]]);
    const front = `M-40,-22 C-32,-62 40,-64 50,-24 L44,-12 C34,-30 10,-30 -4,-22 C-16,-26 -30,-22 -40,-22Z`;
    return { back: path(back, { fill: c }), front: path(front, { fill: c }) };
  },
  crew(c) {
    const back = smooth([[-45, -4], [-48, -32], [-32, -56], [0, -62], [30, -56], [46, -34], [46, -10], [36, -30], [-30, -30], [-42, 4]]);
    return { back: path(back, { fill: c }), front: path('M-40,-28 C-26,-52 34,-54 46,-28 C30,-36 -20,-36 -40,-28Z', { fill: c }) };
  },
  messy(c) {
    const back = smooth([[-48, 4], [-54, -30], [-40, -60], [-8, -72], [26, -66], [48, -46], [54, -16], [48, 6], [32, -26], [-26, -24], [-44, 18]]);
    const front = `M-40,-22 C-32,-66 40,-68 52,-24 L44,-6 L38,-20 L28,-4 L22,-22 L10,-2 L4,-22 L-8,-6 L-14,-24 L-26,-8 L-30,-26Z`;
    return { back: path(back, { fill: c }), front: path(front, { fill: c }) };
  },
  balding(c) {
    return { back: path('M-46,4 C-50,-20 -46,-30 -40,-34 L-34,-10 L-40,14Z M46,4 C50,-20 46,-30 40,-34 L34,-10 L40,14Z', { fill: c }), front: '' };
  },
  bald() { return { back: '', front: '' }; },
};

// ---------------- head assembly ----------------
function head(spec, expr, side, extras = {}) {
  const E = { ...EXPR[expr || 'neutral'] || EXPR.neutral, ...(extras.exprOverride || {}) };
  const front = side === 'front';
  const fx = front ? 0 : 9;
  const skin = spec.skin;
  const out = [];
  const hairFn = HAIR[spec.hair] || HAIR.short;
  const H = spec.hair === 'none' ? { back: '', front: '' } : hairFn(spec.hairColor, { coverFar: extras.coverFar });

  if (spec.helmet) return { behind: spec.helmetBehind ? spec.helmetBehind(extras) : '', head: spec.helmet(expr, side, extras) };

  out.push(H.back || '');
  // ear
  if (!front) out.push(ellipse(-28, 4, 7, 10, { fill: skin, stroke: INK, strokeWidth: 2.5 }));
  // face
  const facePath = front
    ? 'M-38,-14 C-40,-54 40,-54 38,-14 C38,14 22,40 0,46 C-22,40 -38,14 -38,-14Z'
    : `M-36,-14 C-38,-54 38,-54 40,-14 C41,12 28,36 ${8 + fx * 0.6},46 C-10,46 -32,26 -36,-14Z`;
  out.push(path(facePath, { fill: skin, stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' }));
  // soft shading under hair line + jaw
  out.push(path(front ? 'M-36,8 C-32,30 -16,42 0,46 C-14,36 -26,24 -36,8Z' : 'M-34,6 C-30,28 -14,42 2,46 C-12,36 -24,22 -34,6Z', { fill: '#000', opacity: 0.08 }));
  if (spec.stitches) out.push(path(spec.stitches, { stroke: '#4a3a2a', strokeWidth: 1.6, fill: 'none' }));
  if (spec.mask === 'skull') {
    out.push(skullMask(fx));
  } else {
    const eyeColor = spec.eyes;
    const glow = spec.eyeGlow;
    const far = front ? [-15, 4, 1] : [fx - 16, 4, 0.78];
    const near = front ? [15, 4, 1] : [fx + 15, 4, 1];
    if (E.blush) out.push(ellipse(near[0] + 4, 20, 8, 4, { fill: '#ff6b7a', opacity: 0.35 }));
    out.push(eye(far[0], far[1], far[2], E.eye, eyeColor, glow));
    out.push(eye(near[0], near[1], near[2], E.eye, eyeColor, glow));
    if (!glow) {
      out.push(brow(far[0], -12, far[2], E.brow, spec.browColor || spec.hairColor, false));
      out.push(brow(near[0], -12, near[2], E.brow, spec.browColor || spec.hairColor, false));
    }
    if (spec.glasses) {
      out.push(path(`M${far[0] - 12 * far[2]},${-3} h${24 * far[2]} v14 h${-24 * far[2]}Z M${near[0] - 12},${-4} h25 v15 h-25Z M${far[0] + 12 * far[2]},3 L${near[0] - 12},3`, { fill: '#cfe8ff', fillOpacity: 0.18, stroke: '#2b2a33', strokeWidth: 2 }));
      out.push(path(`M${near[0] - 8},-1 l6,0`, { stroke: '#fff', strokeWidth: 2, opacity: 0.8 }));
    }
    // nose
    out.push(path(front ? 'M0,14 L-2,20 L2,21' : `M${fx + 9},12 L${fx + 13},20 L${fx + 8},21`, { stroke: INK, strokeWidth: 2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 0.7 }));
    if (spec.mask !== 'jaw' || extras.maskBroken) {
      const mx = front ? 0 : fx + 4;
      out.push(mouth(mx, 31, E.mouth, front ? 1 : 0.9));
      if (spec.lips) out.push(path(`M${mx - 7},31 Q${mx},34 ${mx + 7},30`, { stroke: spec.lips, strokeWidth: 3, fill: 'none', strokeLinecap: 'round' }));
    }
    if (spec.scarBrow) out.push(path(`M${near[0] - 6},-24 L${near[0] + 8},10`, { stroke: '#a34a46', strokeWidth: 3, strokeLinecap: 'round' }) + path(`M${near[0] - 3},-14 l6,-2 M${near[0] + 1},-4 l6,-2`, { stroke: '#a34a46', strokeWidth: 1.6 }));
    if (extras.cheekCut) out.push(path(`M${near[0] - 2},16 L${near[0] + 22},30`, { stroke: '#c0172a', strokeWidth: 3.4, strokeLinecap: 'round' }) + path(`M${near[0] + 10},24 l-1,12 M${near[0] + 16},27 l0,9`, { stroke: '#c0172a', strokeWidth: 1.8, strokeLinecap: 'round' }));
    if (extras.lipBlood || E.blood) out.push(path(`M${(front ? 0 : fx + 4) + 8},33 q2,8 -1,16`, { stroke: '#c0172a', strokeWidth: 3, fill: 'none', strokeLinecap: 'round' }));
    if (E.shade) out.push(path(facePath, { fill: '#0c0a14', opacity: 0.16, clipPath: '' }));
  }
  if (spec.mask === 'jaw' && !extras.maskBroken) out.push(jawMask(fx));
  if (spec.mask === 'jaw' && extras.maskBroken) out.push(path(`M${fx - 34},26 L${fx - 20},48 L${fx - 30},50Z M${fx + 30},20 L${fx + 40},40 L${fx + 28},42Z`, { fill: '#e9e7e2', stroke: INK, strokeWidth: 2 }) + path(`M${fx + 12},34 q2,10 -2,18`, { stroke: '#c0172a', strokeWidth: 3, fill: 'none' }));
  out.push(H.front || '');
  if (H.shine) out.push(H.shine);
  if (spec.hat) out.push(spec.hat);
  if (E.sweat || extras.sweat) out.push(path('M46,-30 C40,-20 40,-12 46,-10 C52,-12 52,-20 46,-30Z', { fill: '#bfe6ff', stroke: '#2a5a7a', strokeWidth: 1.8 }));
  if (E.vein) out.push(path('M30,-50 l6,6 l-6,6 M40,-52 l-6,6 l6,6', { stroke: '#d0263a', strokeWidth: 3, fill: 'none' }));
  if (E.tears) out.push(path(`M${fx + 10},12 q-2,14 2,22`, { stroke: '#8fd3ff', strokeWidth: 3, fill: 'none' }));
  return { behind: H.behind || '', head: out.join('') };
}

function skullMask(fx) {
  const o = [];
  o.push(path(`M${fx - 32},-30 C${fx - 34},-56 ${fx + 40},-56 ${fx + 40},-28 C${fx + 42},0 ${fx + 34},20 ${fx + 26},30 L${fx + 22},46 L${fx - 14},46 L${fx - 18},28 C${fx - 30},16 ${fx - 32},-6 ${fx - 32},-30Z`, { fill: '#f1efe8', stroke: INK, strokeWidth: 3 }));
  o.push(path(`M${fx - 18},-14 C${fx - 26},-14 ${fx - 24},6 ${fx - 12},6 C${fx - 4},6 ${fx - 4},-14 ${fx - 18},-14Z M${fx + 22},-14 C${fx + 12},-14 ${fx + 10},6 ${fx + 22},6 C${fx + 32},6 ${fx + 32},-14 ${fx + 22},-14Z`, { fill: '#17141c' }));
  o.push(path(`M${fx + 3},10 L${fx - 2},20 L${fx + 8},20Z`, { fill: '#17141c' }));
  o.push(path(`M${fx - 12},30 L${fx + 22},30 M${fx - 6},26 v12 M${fx + 2},26 v12 M${fx + 10},26 v12 M${fx + 17},26 v12`, { stroke: INK, strokeWidth: 2 }));
  // red war-paint
  o.push(path(`M${fx - 30},-24 L${fx - 6},-36 L${fx - 4},-30 L${fx - 26},-16Z M${fx + 36},-22 L${fx + 18},-36 L${fx + 16},-30 L${fx + 34},-14Z M${fx + 6},-48 L${fx + 10},-20 L${fx + 4},-20Z`, { fill: '#cf1f2e' }));
  o.push(circle(fx - 12, -4, 2.4, { fill: '#e4d84a' }) + circle(fx + 22, -4, 2.4, { fill: '#e4d84a' }));
  return o.join('');
}

function jawMask(fx) {
  return path(`M${fx - 34},8 C${fx - 34},40 ${fx - 10},54 ${fx + 10},54 C${fx + 30},54 ${fx + 44},38 ${fx + 42},6 L${fx + 20},12 L${fx - 6},12Z`, { fill: '#e9e7e2', stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' }) +
    path(`M${fx + 4},22 l14,-6 M${fx + 4},30 l16,-7 M${fx + 4},38 l16,-7 M${fx - 22},24 l10,-4 M${fx - 22},32 l12,-5`, { stroke: '#7b7d86', strokeWidth: 2.4, strokeLinecap: 'round' }) +
    path(`M${fx - 30},14 L${fx - 40},2`, { stroke: '#222', strokeWidth: 3 });
}

module.exports = { head, EXPR, HAIR };
