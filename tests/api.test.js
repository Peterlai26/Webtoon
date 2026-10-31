'use strict';
// End-to-end API tests against a real server instance with a throwaway DB + storage.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'webtoon-test-'));
process.env.DATA_DIR = path.join(tmp, 'data');
process.env.STORAGE_DIR = path.join(tmp, 'storage');
process.env.SESSION_SECRET = 'test-secret-'.padEnd(48, 'x');
process.env.ADMIN_USERNAME = 'admin';
process.env.ADMIN_PASSWORD = 'correct horse battery staple';
process.env.PORT = '0';

const { server } = require('../server/index');
let base;
before(() => new Promise((r) => server.listen(0, '127.0.0.1', () => { base = `http://127.0.0.1:${server.address().port}`; r(); })));
after(() => { server.close(); fs.rmSync(tmp, { recursive: true, force: true }); });

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAADCAYAAAC56t6BAAAAEklEQVR42mP8z8DwnwEKGBkYAAA6EQEBj0PpXQAAAABJRU5ErkJggg==', 'base64');
const SVG = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600"/></svg>');

let cookie = '', csrf = '';
async function call(method, url, body, { auth = true, headers = {} } = {}) {
  const h = { ...headers };
  if (auth && cookie) h.cookie = cookie;
  if (auth && csrf) h['x-csrf-token'] = csrf;
  let payload = body;
  if (body && !(body instanceof FormData)) { h['content-type'] = 'application/json'; payload = JSON.stringify(body); }
  const res = await fetch(base + url, { method, headers: h, body: payload });
  const text = await res.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data, headers: res.headers };
}

test('public site starts empty and pages are served', async () => {
  const r = await call('GET', '/api/series', undefined, { auth: false });
  assert.equal(r.status, 200);
  assert.equal(r.data.series.title, 'RESET: 00:10');
  assert.deepEqual(r.data.episodes, []);
  for (const p of ['/', '/episode/1', '/admin']) assert.equal((await fetch(base + p)).status, 200);
});

test('admin endpoints require login', async () => {
  assert.equal((await call('GET', '/api/admin/episodes', undefined, { auth: false })).status, 401);
});

test('login rejects bad password and accepts good one', async () => {
  const bad = await call('POST', '/api/admin/login', { username: 'admin', password: 'nope' }, { auth: false });
  assert.equal(bad.status, 401);
  const ok = await call('POST', '/api/admin/login', { username: 'admin', password: process.env.ADMIN_PASSWORD }, { auth: false });
  assert.equal(ok.status, 200);
  const sc = ok.headers.get('set-cookie');
  assert.match(sc, /HttpOnly/);
  assert.match(sc, /SameSite=Strict/);
  cookie = sc.split(';')[0];
  csrf = ok.data.csrf;
});

test('mutations without CSRF token are refused', async () => {
  const r = await fetch(base + '/api/admin/episodes', { method: 'POST', headers: { cookie, 'content-type': 'application/json' }, body: JSON.stringify({ number: 1, title: 'x' }) });
  assert.equal(r.status, 403);
});

let epId, panelIds;
test('create episode, validation, duplicate number', async () => {
  assert.equal((await call('POST', '/api/admin/episodes', { number: 1, title: '' })).status, 400);
  const r = await call('POST', '/api/admin/episodes', { number: 1, title: 'ตอนทดสอบ', subtitle: 'Test' });
  assert.equal(r.status, 201);
  epId = r.data.episode.id;
  assert.equal(r.data.episode.status, 'draft');
  assert.equal((await call('POST', '/api/admin/episodes', { number: 1, title: 'ซ้ำ' })).status, 400);
});

test('cannot publish an episode without panels', async () => {
  assert.equal((await call('POST', `/api/admin/episodes/${epId}/status`, { status: 'published' })).status, 400);
});

test('upload panels (multipart), rejects non-images and scripted SVG', async () => {
  const fd = new FormData();
  fd.append('files', new Blob([SVG], { type: 'image/svg+xml' }), 'p02.svg');
  fd.append('files', new Blob([PNG], { type: 'image/png' }), 'p01.png');
  const r = await call('POST', `/api/admin/episodes/${epId}/panels`, fd);
  assert.equal(r.status, 201);
  const panels = r.data.episode.panels;
  assert.equal(panels.length, 2);
  assert.match(panels[0].image, /\.png$/, 'sorted by file name');
  assert.equal(panels[0].width, 2);
  assert.equal(panels[0].height, 3);
  assert.equal(panels[1].width, 800);
  panelIds = panels.map((p) => p.id);
  const img = await fetch(base + panels[1].image);
  assert.equal(img.status, 200);
  assert.equal(img.headers.get('content-type'), 'image/svg+xml');
  assert.match(img.headers.get('content-security-policy'), /sandbox/);

  const bad = new FormData();
  bad.append('files', new Blob(['hello'], { type: 'text/plain' }), 'x.txt');
  assert.equal((await call('POST', `/api/admin/episodes/${epId}/panels`, bad)).status, 415);
  const evil = new FormData();
  evil.append('files', new Blob(['<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>']), 'e.svg');
  assert.equal((await call('POST', `/api/admin/episodes/${epId}/panels`, evil)).status, 415);
});

test('reorder panels and reject mismatched lists', async () => {
  const r = await call('PUT', `/api/admin/episodes/${epId}/order`, { ids: [...panelIds].reverse() });
  assert.equal(r.status, 200);
  assert.deepEqual(r.data.episode.panels.map((p) => p.id), [...panelIds].reverse());
  assert.equal((await call('PUT', `/api/admin/episodes/${epId}/order`, { ids: [panelIds[0]] })).status, 400);
});

test('save bubbles with Thai text, values are clamped/sanitised', async () => {
  const r = await call('PUT', `/api/admin/panels/${panelIds[0]}/bubbles`, { bubbles: [
    { kind: 'say', speaker: 'rey', text: 'สวัสดีครับ ผมเรย์', x: 10, y: 5, w: 40, tail: 'b', tailX: 30 },
    { kind: 'nonsense', text: 'ปัง!', x: 500, y: -500, w: 1, color: 'red;evil', tail: 'zz' },
  ] });
  assert.equal(r.status, 200);
  assert.equal(r.data.bubbles[0].text, 'สวัสดีครับ ผมเรย์');
  assert.equal(r.data.bubbles[1].kind, 'say');
  assert.equal(r.data.bubbles[1].x, 100);
  assert.equal(r.data.bubbles[1].y, -20);
  assert.equal(r.data.bubbles[1].w, 5);
  assert.equal(r.data.bubbles[1].color, '');
  assert.equal(r.data.bubbles[1].tail, 'none');
});

test('draft is hidden publicly, visible in preview, then published', async () => {
  assert.equal((await call('GET', '/api/episodes/1', undefined, { auth: false })).status, 404);
  assert.equal((await call('GET', '/api/episodes/1?preview=1')).status, 200);
  const pub = await call('POST', `/api/admin/episodes/${epId}/status`, { status: 'published' });
  assert.equal(pub.data.episode.status, 'published');
  const r = await call('GET', '/api/episodes/1', undefined, { auth: false });
  assert.equal(r.status, 200);
  assert.equal(r.data.episode.panels.find((p) => p.id === panelIds[0]).bubbles[0].text, 'สวัสดีครับ ผมเรย์');
  assert.equal((await call('GET', '/api/series', undefined, { auth: false })).data.episodes.length, 1);
});

test('edit episode, panel gap/alt, replace image, thumbnail, cover', async () => {
  const e = await call('PUT', `/api/admin/episodes/${epId}`, { title: 'ชื่อใหม่', summary: 'ย่อ' });
  assert.equal(e.data.episode.title, 'ชื่อใหม่');
  const p = await call('PUT', `/api/admin/panels/${panelIds[0]}`, { gap: 60, alt: 'คำอธิบาย' });
  assert.equal(p.data.episode.panels.find((x) => x.id === panelIds[0]).gap, 60);
  const fd = new FormData(); fd.append('file', new Blob([SVG]), 'r.svg');
  const rep = await call('POST', `/api/admin/panels/${panelIds[0]}/image`, fd);
  assert.match(rep.data.episode.panels.find((x) => x.id === panelIds[0]).image, /\.svg$/);
  const fd2 = new FormData(); fd2.append('file', new Blob([PNG]), 't.png');
  assert.match((await call('POST', `/api/admin/episodes/${epId}/thumbnail`, fd2)).data.episode.thumb, /\.png$/);
  const fd3 = new FormData(); fd3.append('file', new Blob([PNG]), 'c.png');
  assert.match((await call('POST', '/api/admin/series/cover', fd3)).data.series.cover, /\.png$/);
  const s = await call('PUT', '/api/admin/series', { synopsis: 'เรื่องย่อ' });
  assert.equal(s.data.series.synopsis, 'เรื่องย่อ');
});

test('unpublish hides it again; delete panel and episode', async () => {
  await call('POST', `/api/admin/episodes/${epId}/status`, { status: 'draft' });
  assert.equal((await call('GET', '/api/episodes/1', undefined, { auth: false })).status, 404);
  const d = await call('DELETE', `/api/admin/panels/${panelIds[1]}`);
  assert.equal(d.data.episode.panels.length, 1);
  assert.equal((await call('DELETE', `/api/admin/episodes/${epId}`)).status, 200);
  assert.equal((await call('GET', `/api/admin/episodes/${epId}`)).status, 404);
});

test('path traversal and bad media keys are rejected', async () => {
  assert.notEqual((await fetch(base + '/../server/config.js')).status, 200);
  assert.equal((await fetch(base + '/media/..%2F..%2Fdata%2Fwebtoon.db')).status, 404);
});

test('logout ends the session', async () => {
  await call('POST', '/api/admin/logout');
  assert.equal((await call('GET', '/api/admin/me')).status, 401);
});
