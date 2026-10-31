// Puppet rig: joint angles -> joint positions. Angles are absolute degrees,
// 0 = +x (toward the side the figure faces), 90 = down, -90 = up.
'use strict';
const { pt } = require('./util');

const POSES = {
  stand:      { torso: -90, nua: 84, nfa: 92, fua: 97, ffa: 90, nth: 86, nsh: 91, fth: 95, fsh: 90 },
  standRelax: { torso: -90, head: 4, nua: 80, nfa: 98, fua: 100, ffa: 84, nth: 84, nsh: 92, fth: 96, fsh: 89 },
  attention:  { torso: -90, nua: 88, nfa: 90, fua: 92, ffa: 90, nth: 89, nsh: 90, fth: 91, fsh: 90 },
  handsFront: { torso: -90, nua: 72, nfa: 128, fua: 98, ffa: 60, nth: 87, nsh: 91, fth: 93, fsh: 90 },
  handsHip:   { torso: -90, nua: 50, nfa: 150, fua: 128, ffa: 30, nth: 82, nsh: 92, fth: 98, fsh: 90 },
  armsCross:  { torso: -90, nua: 72, nfa: 190, fua: 104, ffa: -14, nth: 86, nsh: 91, fth: 94, fsh: 90 },
  salute:     { torso: -90, nua: 110, nfa: -42, fua: 95, ffa: 90, nth: 88, nsh: 90, fth: 92, fsh: 90 },
  bow:        { torso: -48, head: 22, nua: 90, nfa: 92, fua: 92, ffa: 90, nth: 92, nsh: 90, fth: 94, fsh: 90 },
  bowDeep:    { torso: -10, head: 30, nua: 92, nfa: 95, fua: 95, ffa: 92, nth: 100, nsh: 90, fth: 104, fsh: 90 },
  walk:       { torso: -88, nua: 62, nfa: 80, fua: 116, ffa: 104, nth: 70, nsh: 100, fth: 108, fsh: 118 },
  run:        { torso: -68, head: -6, nua: 140, nfa: 70, fua: 20, ffa: -60, nth: 30, nsh: 110, fth: 135, fsh: 165 },
  point:      { torso: -88, nua: -8, nfa: -10, fua: 100, ffa: 86, nth: 84, nsh: 92, fth: 98, fsh: 90 },
  pointUp:    { torso: -90, nua: -60, nfa: -70, fua: 100, ffa: 86, nth: 84, nsh: 92, fth: 98, fsh: 90 },
  armsUp:     { torso: -90, nua: -60, nfa: -100, fua: -120, ffa: -84, nth: 86, nsh: 91, fth: 94, fsh: 90 },
  spread:     { torso: -90, head: -6, nua: -4, nfa: -8, fua: 184, ffa: 188, nth: 80, nsh: 90, fth: 100, fsh: 90 },
  holdFront:  { torso: -88, nua: 50, nfa: -18, fua: 62, ffa: -8, nth: 86, nsh: 91, fth: 94, fsh: 90 },
  holdUp:     { torso: -90, nua: 20, nfa: -40, fua: 30, ffa: -30, nth: 86, nsh: 91, fth: 94, fsh: 90 },
  chestHand:  { torso: -90, nua: 112, nfa: -28, fua: 96, ffa: 88, nth: 87, nsh: 91, fth: 93, fsh: 90 },
  faceHand:   { torso: -90, head: 10, nua: 70, nfa: -112, fua: 98, ffa: 86, nth: 87, nsh: 91, fth: 93, fsh: 90 },
  coverEyes:  { torso: -94, head: 8, nua: 60, nfa: -118, fua: 74, ffa: -108, nth: 86, nsh: 91, fth: 95, fsh: 90 },
  hugSelf:    { torso: -92, nua: 108, nfa: -22, fua: 72, ffa: 6, nth: 87, nsh: 91, fth: 93, fsh: 90 },
  headScratch:{ torso: -90, head: 6, nua: -40, nfa: -150, fua: 98, ffa: 86, nth: 86, nsh: 91, fth: 94, fsh: 90 },
  thrust:     { torso: -72, head: 4, nua: -2, nfa: -2, fua: 18, ffa: -6, nth: 48, nsh: 100, fth: 124, fsh: 104 },
  slashUp:    { torso: -84, nua: -70, nfa: -50, fua: 120, ffa: 60, nth: 70, nsh: 100, fth: 110, fsh: 100 },
  slashDown:  { torso: -76, nua: 40, nfa: 60, fua: 110, ffa: 70, nth: 60, nsh: 104, fth: 120, fsh: 100 },
  aimPistol:  { torso: -90, nua: -2, nfa: -2, fua: 92, ffa: 90, nth: 82, nsh: 92, fth: 98, fsh: 90 },
  aimRifle:   { torso: -88, head: 6, nua: 14, nfa: -10, fua: 40, ffa: -20, nth: 80, nsh: 94, fth: 102, fsh: 90 },
  kick:       { torso: -104, nua: 140, nfa: 100, fua: 30, ffa: -20, nth: -6, nsh: -4, fth: 96, fsh: 92 },
  drag:       { torso: -78, nua: 168, nfa: 172, fua: 150, ffa: 160, nth: 64, nsh: 104, fth: 112, fsh: 116 },
  push:       { torso: -72, nua: 14, nfa: 2, fua: 24, ffa: 6, nth: 64, nsh: 106, fth: 116, fsh: 112 },
  mop:        { torso: -84, head: 6, nua: 58, nfa: 26, fua: 72, ffa: 4, nth: 80, nsh: 94, fth: 102, fsh: 90 },
  fallBack:   { torso: -124, head: -24, nua: -40, nfa: -64, fua: -150, ffa: -172, nth: 40, nsh: 74, fth: 66, fsh: 50 },
  hitFwd:     { torso: -60, head: 30, nua: 120, nfa: 150, fua: 140, ffa: 170, nth: 96, nsh: 80, fth: 120, fsh: 90 },
  freefall:   { torso: -90, head: -10, nua: -30, nfa: -60, fua: -150, ffa: -120, nth: 60, nsh: 110, fth: 120, fsh: 70 },
  kneel:      { torso: -86, nua: 86, nfa: 90, fua: 96, ffa: 88, nth: 2, nsh: 90, fth: 88, fsh: 180 },
  kneelHurt:  { torso: -70, head: 20, nua: 100, nfa: 40, fua: 70, ffa: 0, nth: 4, nsh: 90, fth: 90, fsh: 178 },
  seiza:      { torso: -86, head: 6, nua: 96, nfa: 30, fua: 90, ffa: 20, nth: 2, nsh: 178, fth: 6, fsh: 182 },
  seizaBow:   { torso: -40, head: 36, nua: 70, nfa: 40, fua: 76, ffa: 30, nth: 0, nsh: 178, fth: 4, fsh: 182 },
  sitChair:   { torso: -92, nua: 86, nfa: 30, fua: 96, ffa: 20, nth: 2, nsh: 90, fth: 8, fsh: 92 },
  sitFloor:   { torso: -100, head: 4, nua: 110, nfa: 80, fua: 70, ffa: 90, nth: 2, nsh: 6, fth: -8, fsh: 40 },
  sitCross:   { torso: -92, nua: 80, nfa: 20, fua: 100, ffa: 150, nth: 20, nsh: 160, fth: 160, fsh: 20 },
  crouch:     { torso: -64, head: -10, nua: 70, nfa: 40, fua: 100, ffa: 60, nth: -10, nsh: 100, fth: 40, fsh: 120 },
  crawl:      { torso: -10, head: -60, nua: 80, nfa: 100, fua: 100, ffa: 90, nth: 70, nsh: 110, fth: 100, fsh: 130 },
  lie:        { torso: -90, head: 0, nua: 100, nfa: 88, fua: 82, ffa: 94, nth: 88, nsh: 90, fth: 94, fsh: 92, rot: -90 },
  lieHurt:    { torso: -90, head: -14, nua: 130, nfa: 60, fua: 60, ffa: 100, nth: 70, nsh: 110, fth: 100, fsh: 80, rot: -90 },
  // ---- added for EP11-20 ----
  carry:      { torso: -88, nua: 60, nfa: -6, fua: 44, ffa: -16, nth: 86, nsh: 91, fth: 94, fsh: 90 },
  throw:      { torso: -80, head: -4, nua: -30, nfa: -20, fua: 150, ffa: 130, nth: 60, nsh: 100, fth: 116, fsh: 96 },
  reach:      { torso: -80, head: -4, nua: 8, nfa: 4, fua: 110, ffa: 90, nth: 70, nsh: 98, fth: 110, fsh: 94 },
  swingOver:  { torso: -90, head: -8, nua: -110, nfa: -150, fua: -100, ffa: -140, nth: 80, nsh: 94, fth: 102, fsh: 90 },
  twoHand:    { torso: -88, nua: 50, nfa: -30, fua: 40, ffa: -34, nth: 74, nsh: 96, fth: 106, fsh: 92 },
  hunch:      { torso: -62, head: 24, nua: 70, nfa: 40, fua: 90, ffa: 60, nth: 86, nsh: 94, fth: 98, fsh: 90 },
  ride:       { torso: -56, head: -8, nua: 20, nfa: 10, fua: 30, ffa: 16, nth: 10, nsh: 110, fth: 20, fsh: 116 },
  leap:       { torso: -60, head: -10, nua: -20, nfa: -40, fua: 170, ffa: 150, nth: 10, nsh: 120, fth: 140, fsh: 150 },
  sitEdge:    { torso: -92, head: 6, nua: 80, nfa: 60, fua: 100, ffa: 90, nth: 0, nsh: 70, fth: -14, fsh: 104 },
  slump:      { torso: -100, head: 34, nua: 100, nfa: 92, fua: 80, ffa: 94, nth: 6, nsh: 30, fth: -4, fsh: 20 },
  lean:       { torso: -96, head: 10, nua: 96, nfa: 70, fua: 108, ffa: 80, nth: 80, nsh: 100, fth: 104, fsh: 84 },
  dangle:     { torso: -92, head: 14, nua: 96, nfa: 92, fua: 88, ffa: 94, nth: 70, nsh: 96, fth: 100, fsh: 104 },
};

const DEFAULT_DIMS = {
  torso: 160, sw: 74, waist: 54, hw: 48, ua: 98, fa: 92, th: 140, sh: 136,
  headR: 44, neck: 20, uaW: 28, faW: 24, thW: 38, shW: 32, handR: 12,
};

function computeRig(pose, dims) {
  const D = { ...DEFAULT_DIMS, ...dims };
  const T = pose.torso ?? -90;
  const hip = [0, 0];
  const neck = pt(hip, T, D.torso);
  const perp = T + 90;
  const shN = pt(neck, perp, D.sw * 0.32);
  const shF = pt(neck, perp + 180, D.sw * 0.32);
  const hpN = pt(hip, perp, D.hw * 0.3);
  const hpF = pt(hip, perp + 180, D.hw * 0.3);
  const elN = pt(shN, pose.nua, D.ua), hdN = pt(elN, pose.nfa, D.fa);
  const elF = pt(shF, pose.fua, D.ua), hdF = pt(elF, pose.ffa, D.fa);
  const knN = pt(hpN, pose.nth, D.th), ftN = pt(knN, pose.nsh, D.sh);
  const knF = pt(hpF, pose.fth, D.th), ftF = pt(knF, pose.fsh, D.sh);
  const headAng = T + (pose.head || 0);
  const head = pt(neck, headAng, D.neck + D.headR);
  const j = { hip, neck, shN, shF, hpN, hpF, elN, hdN, elF, hdF, knN, ftN, knF, ftF, head };
  if (pose.rot) {
    const r = (pose.rot * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
    for (const k of Object.keys(j)) { const [x, y] = j[k]; j[k] = [x * c - y * s, x * s + y * c]; }
  }
  return { j, D, T: T + (pose.rot || 0), headAng: headAng + (pose.rot || 0), pose };
}

module.exports = { POSES, DEFAULT_DIMS, computeRig };
