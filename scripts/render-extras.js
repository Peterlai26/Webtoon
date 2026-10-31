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
const KEY = { 1: 23, 2: 13, 3: 26, 4: 31, 5: 46, 6: 33, 7: 13, 8: 18, 9: 18, 10: 12 };
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
console.log('cover, thumbnails, character sheets rendered');
