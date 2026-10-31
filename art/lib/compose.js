// Panel composition: background + ordered layers (characters / fx) -> SVG.
'use strict';
const { resetIds, rect } = require('./util');
const { background } = require('./backgrounds');
const { figure, META } = require('./figure');
const { fx } = require('./fx');

const W = 800;
const DEFS = `<defs>
<filter id="grayF"><feColorMatrix type="saturate" values="0.05"/></filter>
<filter id="silF"><feFlood flood-color="#15131c" result="c"/><feComposite in="c" in2="SourceAlpha" operator="in"/></filter>
<filter id="porcF"><feColorMatrix type="matrix" values="0.25 0.35 0.15 0 0.42  0.25 0.35 0.15 0 0.42  0.25 0.35 0.15 0 0.45  0 0 0 1 0"/></filter>
<filter id="blurF"><feGaussianBlur stdDeviation="4"/></filter>
</defs>`;

function mergeState(layer, defaults) {
  if (!layer.c || !defaults || !defaults[layer.c]) return layer;
  return { ...layer, st: { ...defaults[layer.c], ...(layer.st || {}) } };
}

function renderPanel(panel, defaults = {}) {
  resetIds();
  META.length = 0;
  const H = panel.h || 800;
  const parts = [];
  const bg = Array.isArray(panel.bg) ? panel.bg : [panel.bg || 'black', {}];
  parts.push(background(bg[0], W, H, bg[1] || {}));
  for (const raw of panel.L || []) {
    if (raw.c) parts.push(figure(mergeState(raw, defaults)));
    else if (raw.fx) parts.push(fx(raw.fx, W, H, raw));
    else throw new Error(`panel ${panel.id}: bad layer ${JSON.stringify(raw)}`);
  }
  if (panel.frame !== false) parts.push(rect(2, 2, W - 4, H - 4, { fill: 'none', stroke: '#0b0a10', strokeWidth: 4 }));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" overflow="hidden">${DEFS}<clipPath id="frameClip"><rect width="${W}" height="${H}"/></clipPath><g clip-path="url(#frameClip)">${parts.join('')}</g></svg>`;
  return { svg, h: H, heads: META.map((m) => ({ ...m })) };
}

module.exports = { renderPanel, W };
