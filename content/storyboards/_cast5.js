// Shared shorthands for EP46-65: the named One-Face clones (all drawn from the
// single `oneface` definition; body, make-up and weapon tell them apart, see
// docs/02-character-reference.md), Rey's outfit for the arc, and common props.
'use strict';
const { oneface } = require('./_h');

const SHORT = { torso: 130, sw: 80, waist: 60, hw: 58, th: 104, sh: 100, uaW: 36, faW: 32, thW: 40, shW: 34 };
const TALL = { torso: 230, sw: 70, th: 200, sh: 194, ua: 130, fa: 124 };
const PLUMP = { torso: 170, sw: 92, waist: 86, hw: 76, uaW: 34, faW: 30, thW: 44, shW: 38 };
const THIN = { torso: 160, sw: 60, waist: 44, hw: 46, uaW: 20, faW: 18, thW: 26, shW: 22 };
const GIANT = { torso: 240, sw: 140, waist: 104, hw: 92, ua: 140, fa: 132, th: 196, sh: 188, uaW: 52, faW: 46, thW: 58, shW: 50, handR: 22 };
const BUFF = { torso: 180, sw: 100, waist: 70, hw: 64, uaW: 38, faW: 34, thW: 44, shW: 38 };

const mk = (st, dims, props) => (x, y, s, pose, expr = 'neutral', o = {}) => oneface(x, y, s, pose, expr, { ...o, dims: { ...dims, ...(o.dims || {}) }, st: { ...st, ...(o.st || {}) }, props: o.props || props });

module.exports = {
  SHORT, TALL, PLUMP, THIN, GIANT, BUFF,
  // ch.46-47 cast
  bbq: mk({ paint: 'flame', col: '#5a3a2a', bare: true }, GIANT),
  melon: mk({ paint: 'blueLiner', col: '#3a6a4a' }, THIN, undefined),
  cook: mk({ paint: 'blackLips', col: '#e8e4dc', trim: '#9aa0aa' }, GIANT),
  alchem: mk({ paint: 'goldBrow', col: '#6a5a3a', trim: '#e2b84a' }, {}),
  mime: mk({ paint: 'liner', paint2: [], col: '#2a2a32' }, TALL),
  rumor: mk({ paint: 'bolt', col: '#5a5e66' }, THIN),
  tax: mk({ paint: 'scales', col: '#6a6a72', trim: '#a3101f' }, PLUMP, { n: 'quill', f: 'notebook' }),
  tempo: mk({ paint: 'clock', col: '#141318', trim: '#e2b84a' }, { ...THIN, torso: 176 }, { f: { n: 'pocketWatch' } }),
  caliber: mk({ paint: 'silverLiner', col: '#2a2a34', trim: '#c9ced8' }, {}, { n: 'heavyPistol', f: 'heavyPistol' }),
  vector: mk({ col: '#5a3a2a', bare: true }, SHORT, { n: 'ironBow' }),
  clatter: mk({ paint: 'yellowLiner', col: '#4a4a52' }, { ...THIN, torso: 140 }),
  bastionC: mk({ col: '#3a3e46', armour: true }, GIANT, { n: { n: 'warHammer', a: 40 }, f: { n: 'bigShield' } }),
  pain: mk({ col: '#3a3e46', bare: true, trim: '#5a5e66' }, BUFF),
  mario: mk({ col: '#4a3a5a' }, THIN),
  umbra: mk({ col: '#121117', trim: '#2a2830' }, THIN, { n: 'blackNeedle' }),
  setsu: mk({ paint: 'redBand', col: '#18171d', trim: '#c0172a' }, {}, { n: { n: 'katana', a: 30 } }),
  malus: mk({ paint: 'purple', col: '#3a1a4a', trim: '#7a3ad0' }, {}),
  torrent: mk({ col: '#2a4a6a', trim: '#7ad8ff' }, {}),
  silence: mk({ col: '#121117', trim: '#2a2830', hair: 'hood', hairColor: '#121117' }, BUFF, { n: 'blackBell' }),
  mirage: mk({ col: '#9aa8bc', trim: '#ffffff' }, {}),
  scale: mk({ col: '#5a5a4a' }, {}),
  nexus: mk({ col: '#3a4a3a', trim: '#7affb0' }, {}),
  switchboard: mk({ col: '#3a3a3a', trim: '#7ae6ff' }, THIN),
  scout: mk({ paint: 'wingMask', col: '#18171d' }, {}),
  // Grimm's two successors (ch.59 L103-107): new-born white robes
  newA: mk({ col: '#f2f0ec', trim: '#c9ced8' }, BUFF),
  newB: mk({ col: '#f2f0ec', trim: '#c9ced8' }, BUFF),
  // Rey in the One-Face Kingdom (ch.46 L8): black long-sleeve shirt and trousers given by the townsfolk
  REY_EP46: { outfit: 'shirt' },
  REY_EP47: { outfit: 'shirtRolled' },
  REY_EP48: { outfit: 'shirtRolled' },
  REY_WAR: { outfit: 'shirtRolled', blood: true },
  NOX: { grown: 2, sigil: true },
  SW: (a, o = {}) => ({ n: 'sword', a, len: 240, ember: true, ...o }),
  MACE: { n: { n: 'mace', a: -150 } },
};
