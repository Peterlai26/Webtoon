'use strict';
// Data access for series / episodes / panels / bubbles.
const { one, all, run, tx } = require('./db');

const BUBBLE_KINDS = ['say', 'shout', 'think', 'whisper', 'narr', 'sys', 'sfx'];
const TAILS = ['none', 'b', 't', 'l', 'r'];

const mediaUrl = (key) => (key ? `/media/${key}` : null);

function series() {
  const s = one('SELECT * FROM series WHERE id = 1');
  return s && { title: s.title, tagline: s.tagline, synopsis: s.synopsis, cover: mediaUrl(s.cover_key), coverKey: s.cover_key, updatedAt: s.updated_at };
}
function updateSeries({ title, tagline, synopsis, coverKey }) {
  const cur = one('SELECT * FROM series WHERE id = 1');
  if (!cur) run('INSERT INTO series (id, title) VALUES (1, ?)', title || 'RESET: 00:10');
  run(`UPDATE series SET title = COALESCE(?, title), tagline = COALESCE(?, tagline), synopsis = COALESCE(?, synopsis),
       cover_key = COALESCE(?, cover_key), updated_at = datetime('now') WHERE id = 1`, title ?? null, tagline ?? null, synopsis ?? null, coverKey ?? null);
  return series();
}

function episodeRow(e) {
  return {
    id: e.id, number: e.number, title: e.title, subtitle: e.subtitle, summary: e.summary,
    thumb: mediaUrl(e.thumb_key), thumbKey: e.thumb_key, status: e.status,
    publishedAt: e.published_at, updatedAt: e.updated_at, panelCount: e.panel_count ?? undefined,
  };
}
function listEpisodes({ includeDrafts = false } = {}) {
  return all(`SELECT e.*, (SELECT COUNT(*) FROM panels p WHERE p.episode_id = e.id) AS panel_count FROM episodes e
              ${includeDrafts ? '' : "WHERE e.status = 'published'"} ORDER BY e.number`).map(episodeRow);
}
function getEpisode(where, val) {
  const e = one(`SELECT * FROM episodes WHERE ${where} = ?`, val);
  if (!e) return null;
  const panels = all('SELECT * FROM panels WHERE episode_id = ? ORDER BY position, id', e.id);
  const bubbles = all('SELECT b.* FROM bubbles b JOIN panels p ON p.id = b.panel_id WHERE p.episode_id = ? ORDER BY b.position, b.id', e.id);
  const byPanel = {};
  for (const b of bubbles) (byPanel[b.panel_id] ||= []).push(bubbleRow(b));
  return {
    ...episodeRow(e),
    panels: panels.map((p) => ({ id: p.id, position: p.position, image: mediaUrl(p.image_key), imageKey: p.image_key, width: p.width, height: p.height, gap: p.gap, alt: p.alt, bubbles: byPanel[p.id] || [] })),
  };
}
const bubbleRow = (b) => ({ id: b.id, kind: b.kind, speaker: b.speaker, text: b.text, x: b.x, y: b.y, w: b.w, fontScale: b.font_scale, tail: b.tail, tailX: b.tail_x, rotate: b.rotate, color: b.color });

function neighbours(number, includeDrafts) {
  const cond = includeDrafts ? '' : "AND status = 'published'";
  return {
    prev: one(`SELECT number, title FROM episodes WHERE number < ? ${cond} ORDER BY number DESC LIMIT 1`, number) || null,
    next: one(`SELECT number, title FROM episodes WHERE number > ? ${cond} ORDER BY number ASC LIMIT 1`, number) || null,
  };
}

function bad(msg) { return Object.assign(new Error(msg), { status: 400 }); }
function cleanText(v, max, field) {
  if (v === undefined) return undefined;
  if (typeof v !== 'string') throw bad(`${field} ต้องเป็นข้อความ`);
  const s = v.trim();
  if (s.length > max) throw bad(`${field} ยาวเกิน ${max} ตัวอักษร`);
  return s;
}

function createEpisode(body) {
  const number = Number(body.number);
  if (!Number.isInteger(number) || number < 1 || number > 9999) throw bad('เลขตอนไม่ถูกต้อง');
  const title = cleanText(body.title, 200, 'ชื่อตอน');
  if (!title) throw bad('กรุณาระบุชื่อตอน');
  if (one('SELECT id FROM episodes WHERE number = ?', number)) throw bad('มีตอนที่ใช้เลขนี้แล้ว');
  const r = run('INSERT INTO episodes (number, title, subtitle, summary) VALUES (?,?,?,?)', number, title, cleanText(body.subtitle, 200, 'ชื่อรอง') || '', cleanText(body.summary, 2000, 'เรื่องย่อ') || '');
  return getEpisode('id', Number(r.lastInsertRowid));
}

function updateEpisode(id, body) {
  const e = one('SELECT * FROM episodes WHERE id = ?', id);
  if (!e) return null;
  let number = e.number;
  if (body.number !== undefined) {
    number = Number(body.number);
    if (!Number.isInteger(number) || number < 1 || number > 9999) throw bad('เลขตอนไม่ถูกต้อง');
    if (one('SELECT id FROM episodes WHERE number = ? AND id != ?', number, id)) throw bad('มีตอนที่ใช้เลขนี้แล้ว');
  }
  const title = cleanText(body.title, 200, 'ชื่อตอน');
  if (title === '') throw bad('กรุณาระบุชื่อตอน');
  run(`UPDATE episodes SET number = ?, title = COALESCE(?, title), subtitle = COALESCE(?, subtitle), summary = COALESCE(?, summary),
       thumb_key = COALESCE(?, thumb_key), updated_at = datetime('now') WHERE id = ?`,
  number, title ?? null, cleanText(body.subtitle, 200, 'ชื่อรอง') ?? null, cleanText(body.summary, 2000, 'เรื่องย่อ') ?? null, body.thumbKey ?? null, id);
  return getEpisode('id', id);
}

function setStatus(id, status) {
  if (!['draft', 'published'].includes(status)) throw bad('สถานะไม่ถูกต้อง');
  const e = one('SELECT * FROM episodes WHERE id = ?', id);
  if (!e) return null;
  if (status === 'published' && !one('SELECT id FROM panels WHERE episode_id = ? LIMIT 1', id)) throw bad('ต้องมีภาพอย่างน้อย 1 Panel ก่อนเผยแพร่');
  run(`UPDATE episodes SET status = ?, published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, datetime('now')) ELSE published_at END, updated_at = datetime('now') WHERE id = ?`, status, status, id);
  return getEpisode('id', id);
}

const deleteEpisode = (id) => run('DELETE FROM episodes WHERE id = ?', id).changes > 0;

function addPanels(episodeId, media) {
  if (!one('SELECT id FROM episodes WHERE id = ?', episodeId)) return null;
  return tx(() => {
    let pos = one('SELECT COALESCE(MAX(position), 0) AS m FROM panels WHERE episode_id = ?', episodeId).m;
    for (const m of media) run('INSERT INTO panels (episode_id, position, image_key, width, height) VALUES (?,?,?,?,?)', episodeId, ++pos, m.key, m.width, m.height);
    run("UPDATE episodes SET updated_at = datetime('now') WHERE id = ?", episodeId);
    return getEpisode('id', episodeId);
  });
}

function updatePanel(id, body) {
  const p = one('SELECT * FROM panels WHERE id = ?', id);
  if (!p) return null;
  const gap = body.gap === undefined ? p.gap : Math.max(0, Math.min(400, Math.round(Number(body.gap) || 0)));
  run('UPDATE panels SET gap = ?, alt = COALESCE(?, alt), image_key = COALESCE(?, image_key), width = COALESCE(?, width), height = COALESCE(?, height) WHERE id = ?',
    gap, cleanText(body.alt, 500, 'คำอธิบายภาพ') ?? null, body.imageKey ?? null, body.width ?? null, body.height ?? null, id);
  run("UPDATE episodes SET updated_at = datetime('now') WHERE id = ?", p.episode_id);
  return one('SELECT episode_id FROM panels WHERE id = ?', id).episode_id;
}

function deletePanel(id) {
  const p = one('SELECT episode_id FROM panels WHERE id = ?', id);
  if (!p) return null;
  run('DELETE FROM panels WHERE id = ?', id);
  return p.episode_id;
}

function reorderPanels(episodeId, ids) {
  const existing = all('SELECT id FROM panels WHERE episode_id = ?', episodeId).map((r) => r.id).sort((a, b) => a - b);
  const given = [...ids].map(Number).sort((a, b) => a - b);
  if (existing.length !== given.length || existing.some((v, i) => v !== given[i])) throw bad('รายการ Panel ไม่ตรงกับตอนนี้');
  tx(() => ids.forEach((pid, i) => run('UPDATE panels SET position = ? WHERE id = ?', i + 1, Number(pid))));
  run("UPDATE episodes SET updated_at = datetime('now') WHERE id = ?", episodeId);
  return getEpisode('id', episodeId);
}

const num = (v, lo, hi, d) => { const n = Number(v); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : d; };
function replaceBubbles(panelId, list) {
  const p = one('SELECT episode_id FROM panels WHERE id = ?', panelId);
  if (!p) return null;
  if (!Array.isArray(list) || list.length > 60) throw bad('รายการกล่องข้อความไม่ถูกต้อง');
  tx(() => {
    run('DELETE FROM bubbles WHERE panel_id = ?', panelId);
    list.forEach((b, i) => {
      const kind = BUBBLE_KINDS.includes(b.kind) ? b.kind : 'say';
      const tail = TAILS.includes(b.tail) ? b.tail : 'none';
      const color = /^#[0-9a-fA-F]{3,8}$/.test(b.color || '') ? b.color : '';
      run(`INSERT INTO bubbles (panel_id, position, kind, speaker, text, x, y, w, font_scale, tail, tail_x, rotate, color)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, panelId, i, kind, cleanText(String(b.speaker || ''), 60, 'ผู้พูด'), cleanText(String(b.text || ''), 1000, 'ข้อความ'),
      num(b.x, -20, 100, 5), num(b.y, -20, 100, 5), num(b.w, 5, 100, 40), num(b.fontScale, 0.4, 4, 1), tail, num(b.tailX, 0, 100, 50), num(b.rotate, -45, 45, 0), color);
    });
    run("UPDATE episodes SET updated_at = datetime('now') WHERE id = ?", p.episode_id);
  });
  return all('SELECT * FROM bubbles WHERE panel_id = ? ORDER BY position', panelId).map(bubbleRow);
}

module.exports = { series, updateSeries, listEpisodes, getEpisode, neighbours, createEpisode, updateEpisode, setStatus, deleteEpisode, addPanels, updatePanel, deletePanel, reorderPanels, replaceBubbles, BUBBLE_KINDS };
