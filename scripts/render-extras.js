#!/usr/bin/env node
// Renders the series cover, per-episode thumbnails and the Phase-2 character
// reference sheets (docs/characters/*.svg) from the same character rig.
'use strict';
const fs = require('fs');
const path = require('path');
const { renderPanel } = require('../art/lib/compose');
const { figure } = require('../art/lib/figure');
const { background } = require('../art/lib/backgrounds');
const { resetIds } = require('../art/lib/util');
const C = require('../content/storyboards/_continuity');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'art', 'out');
const DOCS = path.join(ROOT, 'docs', 'characters');
fs.mkdirSync(DOCS, { recursive: true });

// ---------- cover (no text: title is rendered by the website) ----------
const cover = renderPanel({
  h: 1100, frame: false, bg: ['necroAerial', { signY: 1000, signX: 640 }],
  L: [
    { fx: 'glow', x: 400, y: 0, r: 520, color: '#ffffff', op: 0.5 },
    { fx: 'goldColumn', x: 610, w: 70 },
    { c: 'lucas', x: 640, y: 560, s: 0.9, pose: 'stand', expr: 'coldShade', face: 'l', anchor: 'chest', props: { n: { n: 'spear', a: -80 } } },
    { fx: 'vlines', n: 30, color: '#ffffff' },
    { c: 'sera', x: 170, y: 1100, s: 1.15, pose: 'stand', expr: 'cold', props: { n: { n: 'sword', a: 100 } } },
    { fx: 'reset', x: 400, y: 640, r: 210 },
    { c: 'rey', x: 410, y: 1120, s: 1.35, pose: 'handsHip', expr: 'smirk', face: 'front', st: { holes: C.JACKET_EP1 } },
    { fx: 'vignette', op: 0.55 },
  ],
});
fs.writeFileSync(path.join(OUT, 'cover.svg'), cover.svg);

// ---------- episode thumbnails: a square re-render of a key panel ----------
const KEY = { 1: 23, 2: 13, 3: 26, 4: 31, 5: 46, 6: 33, 7: 13, 8: 18, 9: 18, 10: 12, 11: 31, 12: 7, 13: 19, 14: 16, 15: 24, 16: 7, 17: 17, 18: 20, 19: 24, 20: 17,
  21: 34, 22: 23, 23: 33, 24: 46, 25: 34, 26: 37, 27: 30, 28: 22, 29: 30, 30: 39,
  31: 38, 32: 16, 33: 13, 34: 27, 35: 12, 36: 17, 37: 7, 38: 8, 39: 16, 40: 2, 41: 5, 42: 14, 43: 12, 44: 17, 45: 18,
  46: 16, 47: 22, 48: 17, 49: 12, 50: 2, 51: 25, 52: 19, 53: 13, 54: 13, 55: 23, 56: 7, 57: 24, 58: 22, 59: 10, 60: 14, 61: 11, 62: 12, 63: 11, 64: 7, 65: 19 };
for (const [n, idx] of Object.entries(KEY)) {
  const ep = require(`../content/storyboards/ep${String(n).padStart(2, '0')}.js`);
  const p = ep.panels[Math.min(idx, ep.panels.length) - 1];
  const r = renderPanel({ ...p, h: 800 }, ep.defaults);
  fs.writeFileSync(path.join(OUT, `ep${String(n).padStart(2, '0')}`, 'thumb.svg'), r.svg);
}

// ---------- character reference sheets ----------
function sheet(name, title, entries, notes, h = 900) {
  resetIds();
  const W = 1600;
  const parts = [`<rect width="${W}" height="${h}" fill="#e9e6ee"/>`, `<rect x="0" y="0" width="${W}" height="70" fill="#15131c"/>`,
    `<text x="24" y="46" font-family="Kanit, Arial, sans-serif" font-size="30" font-weight="700" fill="#fff">${title}</text>`];
  entries.forEach((e, i) => {
    parts.push(figure(e));
    if (e.label) parts.push(`<text x="${e.lx ?? e.x}" y="${h - 12}" text-anchor="middle" font-family="Kanit, Arial, sans-serif" font-size="20" fill="#333">${e.label}</text>`);
  });
  notes.forEach((t, i) => parts.push(`<text x="24" y="${108 + i * 28}" text-anchor="start" font-family="Kanit, Arial, sans-serif" font-size="20" fill="#444">${t}</text>`));
  fs.writeFileSync(path.join(DOCS, `${name}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}"><defs><filter id="silF"><feFlood flood-color="#15131c"/><feComposite in2="SourceAlpha" operator="in"/></filter></defs>${parts.join('')}</svg>`);
}
const turn = (c, extra = {}, xs = [150, 400, 650]) => [
  { c, x: xs[0], y: 860, s: 0.82, pose: 'attention', expr: 'neutral', face: 'front', label: 'หน้าตรง', ...extra },
  { c, x: xs[1], y: 860, s: 0.82, pose: 'stand', expr: 'neutral', face: 'r', label: 'สามส่วนสี่ (ขวา)', ...extra },
  { c, x: xs[2], y: 860, s: 0.82, pose: 'stand', expr: 'neutral', face: 'l', label: 'สามส่วนสี่ (ซ้าย)', ...extra },
];
const faces = (c, exprs, extra = {}) => exprs.map((ex, i) => ({ c, x: 930 + (i % 3) * 230, y: 300 + Math.floor(i / 3) * 330, s: 1.05, pose: 'stand', expr: ex, anchor: 'head', label: undefined, ...extra }));

sheet('rey', 'เรย์ (Rey) — ผู้สมัครหมายเลข 499 · อายุ 19', [...turn('rey'), ...faces('rey', ['smile', 'grin', 'shock', 'pain', 'coldShade', 'smirk'])],
  ['ผมดำสนิทชี้ฟู · ตาสีแดงสด (บท 1)', 'แจ็กเก็ตขาว แถบดำ เส้นแดงเข้ม ปกตั้ง (บท 1)', 'กางเกงเทาเข้ม/รองเท้าดำ = ออกแบบเพิ่ม (รออนุมัติ)']);
sheet('rey-costume', 'เรย์ — ความต่อเนื่องของเสื้อผ้า (เสื้อไม่รีเซ็ตตามร่างกาย)', [
  { c: 'rey', x: 110, y: 840, s: 0.82, pose: 'stand', expr: 'smile', label: 'EP1 ก่อนสอบ' },
  { c: 'rey', x: 300, y: 840, s: 0.82, pose: 'stand', expr: 'neutral', st: { holes: C.JACKET_EP1, blood: true }, label: 'EP1 หลังยิง' },
  { c: 'rey', x: 490, y: 840, s: 0.82, pose: 'stand', expr: 'neutral', st: { holes: C.JACKET_EP2, dirty: true }, label: 'EP2–3' },
  { c: 'rey', x: 680, y: 840, s: 0.82, pose: 'stand', expr: 'neutral', st: { holes: C.JACKET_EP4, dirty: true, buttonMissing: true }, label: 'EP4 (กระดุมหาย)' },
  { c: 'rey', x: 870, y: 840, s: 0.82, pose: 'stand', expr: 'grin', st: { holes: C.JACKET_EP4, dirty: true, apron: 'intact', headlamp: true }, label: 'EP4–5 ผ้ากันเปื้อนเป็ด' },
  { c: 'rey', x: 1060, y: 840, s: 0.82, pose: 'stand', expr: 'neutral', st: { holes: C.JACKET_EP4, labcoat: true }, label: 'EP6 เสื้อกาวน์ยืม' },
  { c: 'rey', x: 1250, y: 840, s: 0.82, pose: 'stand', expr: 'neutral', st: { holes: C.JACKET_EP7, pin: true }, label: 'EP7–9 ตัวใหม่+เข็มกลัด' },
  { c: 'rey', x: 1440, y: 840, s: 0.82, pose: 'stand', expr: 'neutral', st: { holes: C.JACKET_EP10, pin: true, blood: true }, label: 'EP10' },
], []);
sheet('sera', 'เซร่า (Sera) — นักฆ่าแนวหน้าของเดดเอนด์', [...turn('sera', { props: { n: { n: 'sheathed', a: 100, s: 0.8 } } }), ...faces('sera', ['cold', 'deadpan', 'focused', 'pain', 'calm', 'gasp'])],
  ['ผมดำยาว ปอยผมปิดตาซ้าย (บท 2, บท 9)', 'ชุดต่อสู้ดำรัดรูป · ดาบยาว (บท 2)', 'เส้นใยพลังงานแดง แขนถอดได้ (บท 2)', 'ตาสีเข้ม (บท 9)']);
sheet('sera-costume', 'เซร่า — ชุดและบาดแผลตามลำดับเหตุการณ์', [
  { c: 'sera', x: 120, y: 840, s: 0.85, pose: 'stand', expr: 'cold', st: { torn: true }, po: { fua: 100, ffa: 96 }, label: 'EP2 ชุดขาด แขนซ้ายหลุด' },
  { c: 'sera', x: 330, y: 840, s: 0.85, pose: 'stand', expr: 'deadpan', st: { outfit: 'tank' }, label: 'EP3 เสื้อกล้าม' },
  { c: 'sera', x: 540, y: 840, s: 0.85, pose: 'stand', expr: 'cold', st: { outfit: 'combat' }, label: 'EP3–8 ชุดใหม่' },
  { c: 'sera', x: 750, y: 840, s: 0.85, pose: 'stand', expr: 'pain', st: { outfit: 'combat', arms: { left: { burnt: true } } }, label: 'EP8 แขนซ้ายไหม้' },
  { c: 'sera', x: 960, y: 840, s: 0.85, pose: 'stand', expr: 'pain', st: { outfit: 'surgery', arms: { left: { wound: true } } }, label: 'EP9 ผ่าตัด' },
  { c: 'sera', x: 1170, y: 840, s: 0.85, pose: 'stand', expr: 'calm', st: { outfit: 'vest', arms: { left: { bandage: true } } }, label: 'EP9–10 เสื้อกั๊ก+ผ้าพันแผล' },
  { c: 'sera', x: 1380, y: 840, s: 0.85, pose: 'stand', expr: 'pain', st: { outfit: 'vest', sideWound: true, arms: { left: { wound: true } } }, label: 'EP10 แผลสีข้างซ้าย' },
], []);
sheet('lucas', 'ลูคัส (Lucas) — ผู้เข้าสอบหมายเลข 001 · เกรด S', [...turn('lucas', { props: { n: { n: 'spear', a: -88 } } }), ...faces('lucas', ['cold', 'coldShade', 'furious', 'smirk', 'pain', 'shock'])],
  ['ผมขาวเงิน ตาสีฟ้า (บท 1)', 'เกราะขาวตัดดำ ลายทอง แสงฟ้าอมเขียว (บท 1, 4)', 'หอกแสงพิพากษา สีทอง เรขาคณิต (บท 1)']);
sheet('lucas-damage', 'ลูคัส — ความเสียหายต่อเนื่อง', [
  { c: 'lucas', x: 250, y: 840, s: 0.95, pose: 'stand', expr: 'cold', label: 'EP1–8 ก่อนปะทะ' },
  { c: 'lucas', x: 650, y: 840, s: 0.95, pose: 'stand', expr: 'furious', st: { shoulderBroken: true, lipBlood: true }, label: 'EP8 ไหล่ขวาแตก เลือดมุมปาก' },
  { c: 'lucas', x: 1050, y: 840, s: 0.95, pose: 'stand', expr: 'cold', st: { shoulderBroken: true }, face: 'l', props: { n: { n: 'spear', a: -88 } }, label: 'EP9 ถือหอกมือซ้าย' },
  { c: 'lucas', x: 1400, y: 840, s: 0.95, pose: 'stand', expr: 'furious', st: { shoulderBroken: true, cheekCut: true }, face: 'l', label: 'EP10 แผลแก้มขวา' },
], []);
sheet('lilith', 'ด็อกเตอร์ลิลิธ (Dr. Lilith) — หมอและช่างประจำร้าน', [...turn('lilith'), ...faces('lilith', ['sly', 'manic', 'focused', 'grin', 'coldShade', 'calm'])],
  ['เสื้อกาวน์ขาวตัวยาว แว่นกรอบบาง (บท 3)', 'ผมสีเข้มยุ่ง (บท 3)', 'EP4: เสื้อคลุมสีเข้มทับกาวน์', 'เส้นใยประสาทเทียมขาว/เขียว (บท 3, 9)']);
sheet('supporting-1', 'ตัวละครสมทบ (1)', [
  { c: 'ash', x: 120, y: 840, s: 0.85, pose: 'stand', expr: 'neutral', label: 'แอช (Ash)' },
  { c: 'ash', x: 320, y: 840, s: 0.85, pose: 'stand', expr: 'neutral', st: { stoneArm: true }, label: 'แอช แขนเกราะหิน (EP7)' },
  { c: 'knell', x: 540, y: 840, s: 0.85, pose: 'stand', expr: 'calm', props: { n: { n: 'lamp', a: 0 } }, label: 'เนลล์ (Knell)' },
  { c: 'latch', x: 760, y: 840, s: 0.85, pose: 'attention', expr: 'neutral', props: { n: { n: 'brassPistol', a: 90 }, f: { n: 'key', a: 90 } }, label: 'แลตช์ (Latch)' },
  { c: 'suture', x: 980, y: 840, s: 0.85, pose: 'stand', expr: 'calm', label: 'มาดามซูเจอร์' },
  { c: 'vale', x: 1200, y: 840, s: 0.85, pose: 'stand', expr: 'neutral', props: { n: { n: 'lightSword', a: 100 } }, label: 'วิคาร์ เวล' },
  { c: 'raze', x: 1420, y: 840, s: 0.85, pose: 'stand', expr: 'cold', label: 'ราเซ่ (Raze)' },
], [], 900);
sheet('supporting-2', 'ตัวละครสมทบ (2)', [
  { c: 'examiner', x: 110, y: 840, s: 0.82, pose: 'handsHip', expr: 'deadpan', label: 'ผู้คุมสอบ (แผลเป็นคิ้ว)' },
  { c: 'aegis', x: 300, y: 840, s: 0.82, pose: 'attention', expr: 'neutral', label: 'เจ้าหน้าที่เอจิสเกต' },
  { c: 'purifier', x: 480, y: 840, s: 0.82, pose: 'stand', expr: 'neutral', props: { n: 'rifle' }, label: 'ผู้ชำระล้าง' },
  { c: 'grey', x: 670, y: 840, s: 0.82, pose: 'stand', expr: 'grin', label: 'ลุงเกรย์' },
  { c: 'oldman', x: 850, y: 840, s: 0.82, pose: 'stand', expr: 'sad', label: 'ชายชรา (EP4)' },
  { c: 'boy', x: 990, y: 840, s: 0.82, pose: 'stand', expr: 'sad', label: 'เด็กขาเทียม (EP4)' },
  { c: 'thug', x: 1140, y: 840, s: 0.82, pose: 'stand', expr: 'smirk', label: 'ไนท์แฟงก์ (EP7)' },
  { c: 'thug', x: 1300, y: 840, s: 0.82, pose: 'stand', expr: 'smirk', st: { fang: '#c9ced6' }, label: 'ไนท์แฟงก์ (EP9–10)' },
  { c: 'creature', x: 1470, y: 760, s: 0.55, pose: 'crouch', label: 'อันเดดตาบอด (EP5)', lx: 1500 },
], [], 900);
// ---------- EP11-20 ----------
sheet('rey-costume-2', 'เรย์ — เสื้อผ้า EP11–20', [
  { c: 'rey', x: 130, y: 840, s: 0.82, pose: 'stand', expr: 'neutral', st: { ...C.REY_EP11 }, label: 'EP11–12 ไหม้เกรียม' },
  { c: 'rey', x: 340, y: 840, s: 0.82, pose: 'stand', expr: 'calm', st: { ...C.REY_EP11, outfit: 'shirt' }, label: 'EP12 เชิ้ตดำ (ให้เสื้อเซร่า)' },
  { c: 'rey', x: 560, y: 840, s: 0.82, pose: 'stand', expr: 'smirk', st: { outfit: 'suit', hair: 'reySlick' }, label: 'EP13–14 สูทกำมะหยี่' },
  { c: 'rey', x: 780, y: 840, s: 0.82, pose: 'stand', expr: 'neutral', st: { ...C.REY_EP11 }, label: 'EP15 กลับชุดเดิม' },
  { c: 'rey', x: 1000, y: 840, s: 0.82, pose: 'stand', expr: 'neutral', st: { ...C.REY_EP16 }, label: 'EP16–17 รอยมีดเวนน์' },
  { c: 'rey', x: 1220, y: 840, s: 0.82, pose: 'stand', expr: 'coldShade', st: { ...C.REY_EP18 }, label: 'EP18 ขาดวิ่น เปื้อนโคลน' },
  { c: 'rey', x: 1440, y: 840, s: 0.82, pose: 'stand', expr: 'determined', st: { ...C.REY_EP19 }, label: 'EP19–20 ดาบเซร่าบนหลัง' },
], []);
sheet('sera-costume-2', 'เซร่า — EP11–18', [
  { c: 'sera', x: 200, y: 840, s: 0.85, pose: 'stand', expr: 'cold', st: { outfit: 'coat' }, label: 'EP12–13 โค้ทดำยาว' },
  { c: 'sera', x: 560, y: 840, s: 0.85, pose: 'stand', expr: 'cold', st: { outfit: 'gown', laceMask: true }, label: 'EP13–14 เดรสราตรี+หน้ากากลูกไม้' },
  { c: 'sera', x: 920, y: 840, s: 0.85, pose: 'stand', expr: 'calm', st: { outfit: 'combat', drape: true }, label: 'EP15 คลุมแจ็กเก็ตเรย์' },
  { c: 'sera', x: 1280, y: 840, s: 0.85, pose: 'stand', expr: 'focused', st: { outfit: 'combat' }, props: { n: { n: 'sword', a: 100 } }, label: 'EP15–18 ชุดต่อสู้' },
], []);
sheet('supporting-3', 'ตัวละครอาร์คย่านเริงรมย์ (EP11–18)', [
  { c: 'stranger', x: 110, y: 840, s: 0.75, pose: 'point', expr: 'neutral', label: 'บุคคลลึกลับ (EP11)' },
  { c: 'bruno', x: 310, y: 840, s: 0.62, pose: 'handsHip', expr: 'grin', props: { n: { n: 'cigar', a: -30 } }, label: 'บิ๊ก บรูโน่' },
  { c: 'cherry', x: 500, y: 840, s: 0.8, pose: 'stand', expr: 'grin', props: { n: 'silverPistol', f: 'silverPistol' }, label: 'เชอร์รี่ แจ็กพอต' },
  { c: 'mothkid', x: 650, y: 840, s: 0.8, pose: 'stand', expr: 'neutral', props: { n: { n: 'lollipop', a: -70 } }, label: 'เด็กผีเสื้อกลางคืน' },
  { c: 'roxy', x: 800, y: 840, s: 0.8, pose: 'handsHip', expr: 'grin', label: 'ร็อกซี่' },
  { c: 'vane', x: 960, y: 840, s: 0.8, pose: 'stand', expr: 'cold', props: { n: { n: 'bloodDagger', lit: true } }, label: 'เวนน์' },
  { c: 'cassian', x: 1120, y: 840, s: 0.8, pose: 'stand', expr: 'sly', label: 'ลอร์ด แคสเซียน' },
  { c: 'arachne', x: 1280, y: 840, s: 0.8, pose: 'stand', expr: 'calm', label: 'เลดี้ อารัคเน่' },
  { c: 'snake', x: 1440, y: 800, s: 0.8, kind: 'red', label: 'งูธาตุ', lx: 1460 },
], [], 900);
sheet('supporting-4', 'ตัวละครคฤหาสน์พันปี (EP19–20)', [
  { c: 'gula', x: 100, y: 840, s: 0.85, pose: 'stand', expr: 'grin', label: 'กูล่า' },
  { c: 'volt', x: 250, y: 840, s: 0.8, pose: 'stand', expr: 'grin', props: { n: 'voltSword' }, label: 'โวลต์' },
  { c: 'claire', x: 410, y: 840, s: 0.8, pose: 'stand', expr: 'cold', st: { metalArm: true, metalCheek: true }, props: { n: { n: 'assaultRifle', a: -60 } }, label: 'แคลร์' },
  { c: 'grimm', x: 570, y: 840, s: 0.8, pose: 'stand', expr: 'neutral', props: { n: { n: 'mace', a: -80 } }, label: 'กริมม์' },
  { c: 'nox', x: 700, y: 840, s: 0.8, label: 'น็อกซ์' },
  { c: 'rivetKing', x: 880, y: 840, s: 0.55, pose: 'stand', expr: 'neutral', label: 'ริเว็ต คิง' },
  { c: 'kier', x: 1060, y: 840, s: 0.8, pose: 'stand', expr: 'cold', props: { n: 'dullDagger', f: 'dullDagger' }, label: 'เคียร์' },
  { c: 'cinder', x: 1220, y: 840, s: 0.8, pose: 'hunch', expr: 'neutral', props: { n: { n: 'brazierStaff', a: -70 } }, label: 'ซินเดอร์ อะพอสเซิล' },
  { c: 'ninebell', x: 1420, y: 840, s: 0.7, pose: 'stand', expr: 'neutral', label: 'ไนน์-เบลล์' },
], [], 900);
// ---------- EP21-30 ----------
sheet('rey-costume-3', 'เรย์ — เสื้อผ้าและดาบ EP21–30', [
  { c: 'rey', x: 130, y: 840, s: 0.82, pose: 'stand', expr: 'calm', st: { ...C.REY_EP19, backSword: false, blood: true }, props: { n: { n: 'sword', a: 80, len: 240 } }, label: 'EP21 แจ็กเก็ตชุ่มเลือด' },
  { c: 'rey', x: 380, y: 840, s: 0.82, pose: 'stand', expr: 'focused', st: { outfit: 'shirtRolled' }, props: { n: { n: 'sword', a: 80, len: 240, cracks: true } }, label: 'EP22/25 เชิ้ตพับแขน', lx: 380 },
  { c: 'rey', x: 630, y: 840, s: 0.82, pose: 'stand', expr: 'neutral', st: { ...C.REY_EP23 }, label: 'EP23 แจ็กเก็ตที่ซักแล้ว' },
  { c: 'rey', x: 880, y: 840, s: 0.82, pose: 'stand', expr: 'pain', st: { ...C.REY_EP24 }, label: 'EP24 ขาด ไหม้' },
  { c: 'rey', x: 1130, y: 840, s: 0.82, pose: 'stand', expr: 'coldShade', st: { ...C.REY_EP26 }, props: { n: { n: 'sword', a: 80, len: 240, ember: true } }, label: 'EP26–29 โค้ทดำ ดาบตีใหม่' },
  { c: 'rey', x: 1400, y: 840, s: 0.82, pose: 'stand', expr: 'determined', st: { ...C.REY_EP30 }, label: 'EP30 โค้ททับแจ็กเก็ต' },
], []);
sheet('supporting-5', 'ตัวละคร EP21–30', [
  { c: 'ilya', x: 90, y: 840, s: 0.78, pose: 'stand', expr: 'cold', props: { n: { n: 'plasmaBlade', a: 100 }, f: { n: 'plasmaBlade', a: 80 } }, label: 'อิลยา นาดีร์' },
  { c: 'enforcer', x: 250, y: 840, s: 0.68, pose: 'stand', expr: 'neutral', props: { n: { n: 'soulCannon', a: 0 } }, label: 'หน่วยผู้คุมกฎ' },
  { c: 'mech', x: 400, y: 840, s: 0.5, pose: 'stand', expr: '', props: { n: 'lightSaw', f: 'netGun' }, label: 'เคาน์เตอร์-ซีโร่' },
  { c: 'revS', x: 560, y: 840, s: 0.46, pose: 'stand', expr: '', props: { n: 'thunderHammer' }, label: 'เรเวแนนท์ S' },
  { c: 'puppet', x: 700, y: 840, s: 0.5, pose: 'stand', expr: '', props: { n: 'chainsaw' }, label: 'หุ่นเชิดฝึก' },
  { c: 'marquis', x: 830, y: 840, s: 0.72, pose: 'stand', expr: 'smirk', props: { n: { n: 'puppetCane', a: -60 } }, label: 'มาควิส เวลเว็ต' },
  { c: 'valentine', x: 960, y: 840, s: 0.72, pose: 'stand', expr: 'sly', props: { n: 'miniCrossbow' }, label: 'วาเลนไทน์' },
  { c: 'corsetta', x: 1090, y: 840, s: 0.7, pose: 'stand', expr: 'cold', label: 'คอร์เซ็ตต้า' },
  { c: 'porcelain', x: 1220, y: 840, s: 0.72, pose: 'stand', expr: 'cold', label: 'เซนต์ พอร์ซเลน' },
  { c: 'silk', x: 1340, y: 840, s: 0.72, pose: 'stand', expr: 'calm', label: 'มาดาม ซิลค์' },
  { c: 'sera', x: 1490, y: 840, s: 0.75, pose: 'stand', expr: 'empty', st: { outfit: 'doll', barefoot: true }, props: { n: { n: 'redBlade', a: 100 }, f: { n: 'redBlade', a: 80 } }, label: 'เซร่า (EP30)' },
], [], 900);
sheet('creatures-3', 'สิ่งมีชีวิต EP23–30', [
  { c: 'rockKing', x: 330, y: 820, s: 0.62, label: 'ราชันย์อสูรเกราะหินโบราณ', lx: 380 },
  { c: 'rockKing', x: 860, y: 840, s: 0.24, minor: true, label: 'อสูรเกราะหิน', lx: 900 },
  { c: 'oreBeetle', x: 1040, y: 840, s: 0.8, label: 'แมลงเกราะแร่', lx: 1060 },
  { c: 'centipede', x: 1260, y: 840, s: 0.6, label: 'ตะขาบพ่นกรด', lx: 1260 },
  { c: 'creature', x: 1480, y: 260, s: 0.4, pose: 'ceiling', skin: '#c4c4bc', label: 'อสูรเกาะเพดานถ้ำ', lx: 1470 },
  { c: 'nox', x: 1060, y: 640, s: 0.7, grown: 1, label: undefined },
  { c: 'nox', x: 1300, y: 660, s: 0.7, grown: 2, sigil: true, label: undefined },
], ['น็อกซ์: EP23 ขนาดสุนัขป่าหนุ่ม (กลาง) / EP25 สูงระดับเอว เขายาว + ตราพันธะของเรย์ (ขวา)'], 900);
// ---------- EP31-45 ----------
sheet('rey-costume-4', 'เรย์และทีม — ชุดปลอมตัว EP31 / สูทขาด EP35–45', [
  { c: 'rey', x: 140, y: 840, s: 0.82, pose: 'stand', expr: 'smirk', st: { ...C.REY_EP31 }, label: 'EP31 คุณชายเหมืองลึก' },
  { c: 'rey', x: 380, y: 840, s: 0.82, pose: 'chestHand', expr: 'determined', st: { ...C.REY_EP35 }, props: { f: { n: 'sword', a: 95, len: 240, ember: true } }, label: 'EP35–45 สูทขาด หัวใจเหล็กในอกซ้าย' },
  { c: 'gula', x: 620, y: 840, s: 0.82, pose: 'stand', expr: 'smile', st: { dress: true }, label: 'กูล่า คุณหนู' },
  { c: 'claire', x: 800, y: 840, s: 0.82, pose: 'stand', expr: 'cold', st: { suit: true }, label: 'แคลร์ เลขาฯ' },
  { c: 'volt', x: 980, y: 840, s: 0.82, pose: 'stand', expr: 'grin', st: { tux: true }, label: 'โวลต์ พ่อบ้าน' },
  { c: 'grimm', x: 1180, y: 840, s: 0.82, pose: 'stand', expr: 'neutral', st: { silverMask: true }, label: 'กริมม์ หน้ากากเงิน' },
  { c: 'grimmFace', x: 1420, y: 840, s: 0.82, pose: 'stand', expr: 'calm', face: 'front', label: 'กริมม์ ไม่สวมหน้ากาก (EP45)' },
], []);
sheet('solaris', 'โซลาริส — ผู้บังคับบัญชาและผู้ทรงเกียรติยศอักษร (EP35–41)', [
  { c: 'olden', x: 90, y: 840, s: 0.62, pose: 'stand', expr: 'cold', props: { f: { n: 'greatsword', a: 80 } }, label: 'โอลเดน' },
  { c: 'miray', x: 220, y: 840, s: 0.62, pose: 'stand', expr: 'smile', label: 'มิเรย์ (T)' },
  { c: 'sanctum', x: 360, y: 840, s: 0.6, pose: 'stand', expr: 'cold', label: 'แซงก์ทัม' },
  { c: 'corvin', x: 490, y: 840, s: 0.6, pose: 'stand', expr: 'smirk', label: 'คอร์วิน (H)' },
  { c: 'bastian', x: 610, y: 840, s: 0.6, pose: 'stand', expr: 'grin', label: 'บาสเตียน' },
  { c: 'axiom', x: 720, y: 840, s: 0.62, pose: 'stand', expr: 'sly', props: { n: 'starWand' }, label: 'แอกเซียม' },
  { c: 'draken', x: 850, y: 840, s: 0.6, pose: 'stand', expr: 'cold', props: { n: { n: 'dragonLance', a: -80 } }, label: 'ดราเกน (D)' },
  { c: 'voss', x: 980, y: 840, s: 0.6, pose: 'stand', expr: 'calm', label: 'วอสส์ (V)' },
  { c: 'arion', x: 1100, y: 840, s: 0.6, pose: 'stand', expr: 'cold', props: { f: 'lightBow' }, label: 'อาริออน' },
  { c: 'chronos', x: 1220, y: 840, s: 0.6, pose: 'stand', expr: 'cold', props: { n: 'pocketWatch' }, label: 'โครนอส (C)' },
  { c: 'gravis', x: 1340, y: 840, s: 0.6, pose: 'stand', expr: 'cold', label: 'กราวิส (G)' },
  { c: 'nal', x: 1480, y: 840, s: 0.6, pose: 'stand', expr: 'cold', props: { n: { n: 'archStaff', a: -80 } }, label: 'นัล (N)' },
], ['ลูคัสได้รับแต่งตั้งเป็นอักษรแอลใน EP37 — ใช้แบบเดิม'], 900);
sheet('oneface', 'อาณาจักรหน้าเดียวและผู้ช่วยเหลือ (EP39–45)', [
  { c: 'whiteMask', x: 90, y: 840, s: 0.6, pose: 'stand', expr: 'neutral', st: { cloak: true, hood: true }, label: 'ผู้มาเยือนในผ้าคลุม' },
  { c: 'whiteMask', x: 220, y: 840, s: 0.6, pose: 'stand', expr: 'neutral', st: { pat: 'line' }, label: 'ลายเส้นตั้ง' },
  { c: 'whiteMask', x: 340, y: 840, s: 0.6, pose: 'stand', expr: 'neutral', st: { pat: 'circle' }, label: 'ลายวงกลม' },
  { c: 'velen', x: 480, y: 840, s: 0.62, pose: 'stand', expr: 'calm', label: 'เวเลน ธอร์น' },
  { c: 'naira', x: 610, y: 840, s: 0.64, pose: 'stand', expr: 'cold', props: { n: 'knife' }, label: 'ไนร่า (สวมหน้ากาก)' },
  { c: 'naira', x: 740, y: 840, s: 0.64, pose: 'stand', expr: 'calm', face: 'front', st: { unmasked: true }, label: 'ไนร่า' },
  { c: 'regulus', x: 880, y: 840, s: 0.62, pose: 'stand', expr: 'calm', face: 'front', label: 'เรกูลัส' },
  { c: 'warden', x: 1030, y: 840, s: 0.52, pose: 'stand', expr: 'cold', props: { n: { n: 'warSpear', a: -80 } }, label: 'วอร์เดน' },
  { c: 'ledger', x: 1170, y: 840, s: 0.62, pose: 'stand', expr: 'neutral', props: { n: 'ledgerBook' }, label: 'เลดเจอร์' },
  { c: 'oneface', x: 1290, y: 840, s: 0.6, pose: 'stand', expr: 'neutral', face: 'front', st: { paint: 'red' }, label: 'ชาวเมือง' },
  { c: 'oneface', x: 1410, y: 840, s: 0.6, pose: 'stand', expr: 'neutral', face: 'front', st: { paint: 'blue', hair: 'messy' }, label: 'ชาวเมือง' },
  { c: 'oneface', x: 1520, y: 840, s: 0.6, pose: 'stand', expr: 'neutral', face: 'front', st: { paint: 'silver' }, label: 'ชาวเมือง' },
], ['ใบหน้าเดียวกันทุกคน — ต่างกันแค่รูปร่าง ทรงผม และการแต่งหน้า'], 900);
sheet('creatures-4', 'สิ่งมีชีวิต EP31–45', [
  { c: 'whiteDragon', x: 560, y: 860, s: 0.7, label: 'มังกรขาวของเซอร์ ดราเกน', lx: 500 },
  { c: 'lightHound', x: 1100, y: 840, s: 0.8, label: 'สุนัขล่าเนื้อเกราะแสง', lx: 1160 },
  { c: 'quadMech', x: 1420, y: 840, s: 0.7, label: 'หุ่นรบจักรกลแสงสี่ขา', lx: 1430 },
], [], 900);
sheet('honourables-2', 'โซลาริส — ผู้ทรงเกียรติยศอักษรเค / อักษรอา และขุนพลมือขวา (EP50–65)', [
  { c: 'kinesis', x: 100, y: 860, s: 0.52, pose: 'stand', expr: 'cold', face: 'front', label: 'เซอร์ ไคเนซิส (K)' },
  { c: 'rail', x: 260, y: 860, s: 0.62, pose: 'aimRifle', expr: 'cold', props: { right: { n: 'railArm' } }, label: 'กัปตัน เรล (R)' },
  { c: 'valkor', x: 470, y: 860, s: 0.55, pose: 'stand', expr: 'furious', face: 'front', props: { n: { n: 'plasmaGlaive', a: 10 } }, label: 'วาลคอร์ (มือขวา D)' },
  { c: 'sadis', x: 640, y: 860, s: 0.58, pose: 'hunch', expr: 'manic', face: 'front', label: 'ซาดิส (มือขวา T)' },
  { c: 'gargoyle', x: 800, y: 860, s: 0.48, pose: 'stand', expr: 'furious', face: 'front', props: { n: 'hammerFist', f: 'hammerFist' }, label: 'การ์กอยล์ (มือขวา B)' },
  { c: 'vesper', x: 980, y: 860, s: 0.62, pose: 'stand', expr: 'cold', face: 'front', props: { n: 'chainSickle' }, label: 'เวสเปอร์ (มือขวา H)' },
  { c: 'centurion', x: 1140, y: 860, s: 0.48, pose: 'stand', expr: 'neutral', face: 'front', props: { f: 'magShield' }, label: 'เซนทูเรียน (มือขวา K)' },
  { c: 'voltage', x: 1300, y: 860, s: 0.58, pose: 'stand', expr: 'grin', face: 'front', props: { n: 'magGun' }, label: 'โวลเทจ (มือขวา R)' },
  { c: 'draken', x: 1480, y: 860, s: 0.5, pose: 'stand', expr: 'cold', face: 'front', st: { aura: true }, props: { n: { n: 'dragonLance', a: -70 } }, label: 'ดราเกน: มังกรสถิต' },
], ['ผู้ทรงเกียรติยศที่ปรากฏครั้งแรกในศึกอาณาจักรหน้าเดียว และขุนพลมือขวาประจำตัวทั้งหก'], 900);
sheet('oneface-2', 'อาณาจักรหน้าเดียว — หน่วยรบพิเศษ ต้นฉบับ และผู้สืบทอดของกริมม์ (EP46–65)', [
  { c: 'mono', x: 80, y: 860, s: 0.7, pose: 'stand', expr: 'nervous', face: 'front', label: 'โมโน (ต้นฉบับ)' },
  ...[['setsu', 'redBand', '#18171d', 'เซ็ตสึ', { n: { n: 'katana', a: 30 } }], ['tax', 'scales', '#6a6a72', 'แท็กซ์', { n: 'quill', f: 'notebook' }], ['tempo', 'clock', '#141318', 'เทมโป', { f: { n: 'pocketWatch' } }], ['caliber', 'silverLiner', '#2a2a34', 'คาลิเบอร์', { n: 'heavyPistol' }], ['clatter', 'yellowLiner', '#4a4a52', 'แคลตเตอร์', {}], ['alchem', 'goldBrow', '#6a5a3a', 'อัลเคม', {}], ['rumor', 'bolt', '#5a5e66', 'รูมอร์', {}], ['mime', 'liner', '#2a2a32', 'ไมม์', {}], ['malus', 'purple', '#3a1a4a', 'มาลัส', {}]].map(([id, paint, col, label, props], i) => ({ c: 'oneface', x: 200 + i * 120, y: 860, s: 0.55, pose: 'stand', expr: 'neutral', face: 'front', st: { paint, col }, props, label })),
  { c: 'oneface', x: 1330, y: 860, s: 0.52, pose: 'stand', expr: 'empty', face: 'front', st: { col: '#f2f0ec', trim: '#c9ced8' }, label: '#41,209' },
  { c: 'grimmFace', x: 1470, y: 860, s: 0.55, pose: 'stand', expr: 'neutral', face: 'front', st: { maskUp: true }, label: 'กริมม์ (หน้ากากคาดหัว)' },
], ['ทุกคนใช้ใบหน้าเดียวกัน — แยกด้วยการแต่งหน้า รูปร่าง และอาวุธ', 'ร่างใหม่สองร่างของกริมม์ (#41,209 / #41,210) สวมชุดคลุมขาวของผู้เพิ่งเกิด ไม่มีความทรงจำเดิม'], 900);
sheet('creatures-5', 'ร่างสุดท้ายของเซอร์ ดราเกน (EP63–65)', [
  { c: 'sunDragon', x: 800, y: 880, s: 0.62, label: 'มหาสัตตมังกรสุริยะหลอมวิญญาณ — สูงกว่าสิบสองเมตร หกปีกพลาสมา', lx: 800 },
], [], 900);
console.log('cover, thumbnails, character sheets rendered');
