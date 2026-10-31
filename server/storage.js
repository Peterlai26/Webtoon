'use strict';
// Content-addressed file storage on local disk. Keys look like "ab/abcd...ef.png".
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { config } = require('./config');
const { one, run } = require('./db');

const TYPES = {
  'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg',
};
const MIME_BY_EXT = Object.fromEntries(Object.entries(TYPES).map(([m, e]) => [e, m]));

function sniff(buf) {
  if (buf.length > 8 && buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (buf.length > 6 && /^GIF8[79]a/.test(buf.toString('ascii', 0, 6))) return 'image/gif';
  const head = buf.slice(0, 1024).toString('utf8').replace(/^﻿/, '').trimStart();
  if (/^(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*<svg[\s>]/i.test(head)) return 'image/svg+xml';
  return null;
}

function dimensions(buf, mime) {
  try {
    if (mime === 'image/png') return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    if (mime === 'image/gif') return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
    if (mime === 'image/svg+xml') {
      const s = buf.slice(0, 4096).toString('utf8');
      const tag = s.match(/<svg[^>]*>/i)?.[0] || '';
      const w = tag.match(/\swidth="([\d.]+)/)?.[1], h = tag.match(/\sheight="([\d.]+)/)?.[1];
      if (w && h) return { width: Math.round(+w), height: Math.round(+h) };
      const vb = tag.match(/viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/);
      if (vb) return { width: Math.round(+vb[1]), height: Math.round(+vb[2]) };
    }
    if (mime === 'image/jpeg') {
      let i = 2;
      while (i < buf.length) {
        if (buf[i] !== 0xff) { i++; continue; }
        const m = buf[i + 1], len = buf.readUInt16BE(i + 2);
        if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        i += 2 + len;
      }
    }
    if (mime === 'image/webp') {
      const chunk = buf.toString('ascii', 12, 16);
      if (chunk === 'VP8X') return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
      if (chunk === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
      if (chunk === 'VP8L') { const b = buf.readUInt32LE(21); return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 }; }
    }
  } catch { /* fall through */ }
  return { width: null, height: null };
}

function save(buf, originalName = '') {
  if (!buf || !buf.length) throw Object.assign(new Error('ไฟล์ว่างเปล่า'), { status: 400 });
  if (buf.length > config.maxUploadBytes) throw Object.assign(new Error('ไฟล์มีขนาดใหญ่เกินกำหนด'), { status: 413 });
  const mime = sniff(buf);
  if (!mime) throw Object.assign(new Error('รองรับเฉพาะไฟล์ภาพ PNG, JPEG, WebP, GIF หรือ SVG'), { status: 415 });
  if (mime === 'image/svg+xml' && /<script|on\w+\s*=|javascript:|<foreignObject/i.test(buf.toString('utf8'))) {
    throw Object.assign(new Error('ไฟล์ SVG มีสคริปต์หรือเนื้อหาที่ไม่อนุญาต'), { status: 415 });
  }
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  const key = `${hash.slice(0, 2)}/${hash}.${TYPES[mime]}`;
  const file = path.join(config.storageDir, key);
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, buf);
  }
  const dim = dimensions(buf, mime);
  if (!one('SELECT key FROM media WHERE key = ?', key)) {
    run('INSERT INTO media (key, mime, size, width, height, original_name) VALUES (?,?,?,?,?,?)', key, mime, buf.length, dim.width, dim.height, String(originalName).slice(0, 200));
  }
  return { key, mime, ...dim };
}

function resolve(key) {
  if (!/^[0-9a-f]{2}\/[0-9a-f]{64}\.(png|jpg|webp|gif|svg)$/.test(key)) return null;
  const file = path.join(config.storageDir, key);
  if (!fs.existsSync(file)) return null;
  return { file, mime: MIME_BY_EXT[key.split('.').pop()] };
}

module.exports = { save, resolve, sniff };
