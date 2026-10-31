// Storyboard shorthand. Characters: name(x, y, scale, pose, expr, extra)
'use strict';
const C = (c) => (x, y, s, pose, expr, o = {}) => ({ c, x, y, s, pose, expr, ...o });
const names = ['rey', 'lucas', 'sera', 'lilith', 'knell', 'latch', 'suture', 'ash', 'grey', 'vale', 'purifier', 'purifierElite', 'examiner', 'aegis', 'tech', 'candidate', 'oldman', 'boy', 'thug', 'thugBoss', 'raze', 'revenant', 'merchant', 'oldmerchant', 'guard', 'patient', 'creature',
  // EP11-20
  'bruno', 'cherry', 'mothkid', 'roxy', 'vane', 'cassian', 'arachne', 'gula', 'volt', 'claire', 'grimm', 'rivetKing', 'kier', 'cinder', 'ninebell', 'stranger', 'hostess', 'velvetGuard', 'gambler', 'doll', 'nox', 'snake', 'varan'];
const H = {};
for (const n of names) H[n] = C(n);
H.fx = (name, o = {}) => ({ fx: name, ...o });
// Text: N narration, S speech, X shout, T thought, W whisper, Y system, F sound-effect
H.N = (t, pos) => ({ k: 'narr', t, pos });
H.S = (who, t, pos) => ({ k: 'say', who, t, pos });
H.X = (who, t, pos) => ({ k: 'shout', who, t, pos });
H.T = (who, t, pos) => ({ k: 'think', who, t, pos });
H.W = (who, t, pos) => ({ k: 'whisper', who, t, pos });
H.Y = (t, pos) => ({ k: 'sys', t, pos });
H.F = (t, x, y, o = {}) => ({ k: 'sfx', t, pos: { x, y }, ...o });
module.exports = H;
