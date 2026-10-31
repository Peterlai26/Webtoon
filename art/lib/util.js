// Shared SVG helpers for the panel renderer.
'use strict';

const INK = '#15131c';

function rng(seed) {
  let s = 0;
  for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  s = s || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

const rad = (d) => (d * Math.PI) / 180;
const pt = (p, ang, len) => [p[0] + Math.cos(rad(ang)) * len, p[1] + Math.sin(rad(ang)) * len];
const f = (n) => Math.round(n * 10) / 10;
const P = (p) => `${f(p[0])},${f(p[1])}`;

function attrs(o) {
  return Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}="${v}"`)
    .join(' ');
}
const el = (tag, o, inner) => (inner === undefined ? `<${tag} ${attrs(o)}/>` : `<${tag} ${attrs(o)}>${inner}</${tag}>`);
const path = (d, o = {}) => el('path', { d, ...o });
const circle = (cx, cy, r, o = {}) => el('circle', { cx: f(cx), cy: f(cy), r: f(r), ...o });
const ellipse = (cx, cy, rx, ry, o = {}) => el('ellipse', { cx: f(cx), cy: f(cy), rx: f(rx), ry: f(ry), ...o });
const rect = (x, y, w, h, o = {}) => el('rect', { x: f(x), y: f(y), width: f(w), height: f(h), ...o });
const line = (a, b, o = {}) => el('line', { x1: f(a[0]), y1: f(a[1]), x2: f(b[0]), y2: f(b[1]), ...o });
const poly = (pts, o = {}) => el('polygon', { points: pts.map(P).join(' '), ...o });
const g = (inner, o = {}) => el('g', o, inner);

let uid = 0;
const id = (p = 'i') => `${p}${(uid++).toString(36)}`;
const resetIds = () => { uid = 0; };

function linGrad(gid, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
  return `<linearGradient id="${gid}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops
    .map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a !== undefined ? ` stop-opacity="${a}"` : ''}/>`)
    .join('')}</linearGradient>`;
}
function radGrad(gid, stops, cx = 0.5, cy = 0.5, r = 0.5) {
  return `<radialGradient id="${gid}" cx="${cx}" cy="${cy}" r="${r}">${stops
    .map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a !== undefined ? ` stop-opacity="${a}"` : ''}/>`)
    .join('')}</radialGradient>`;
}

// Smooth closed blob through points (Catmull-Rom -> Bezier).
function smooth(pts, closed = true) {
  const n = pts.length;
  const get = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${P(pts[0])}`;
  const end = closed ? n : n - 1;
  for (let i = 0; i < end; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${P(c1)} ${P(c2)} ${P(p2)}`;
  }
  return d + (closed ? 'Z' : '');
}

module.exports = { INK, rng, rad, pt, f, P, el, path, circle, ellipse, rect, line, poly, g, id, resetIds, linGrad, radGrad, smooth, attrs };
