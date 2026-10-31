'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { config, requireSecrets } = require('./config');
requireSecrets();
const auth = require('./auth');
const repo = require('./repo');
const storage = require('./storage');
const { one } = require('./db');

if (auth.ensureAdminFromEnv()) console.log(`Created admin account "${config.adminUser}" from environment.`);
if (!repo.series()) repo.updateSeries({ title: 'RESET: 00:10' });

const PUBLIC = path.join(config.root, 'public');
const STATIC_TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json' };
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { ...SECURITY_HEADERS, ...headers });
  res.end(body);
}
const json = (res, status, data, headers = {}) => send(res, status, JSON.stringify(data), { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
const fail = (res, status, error) => json(res, status, { error });

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    req.on('data', (c) => { size += c.length; if (size > limit) { reject(Object.assign(new Error('ข้อมูลมีขนาดใหญ่เกินกำหนด'), { status: 413 })); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
async function jsonBody(req) {
  const buf = await readBody(req, 2 * 1024 * 1024);
  if (!buf.length) return {};
  try { return JSON.parse(buf.toString('utf8')); } catch { throw Object.assign(new Error('JSON ไม่ถูกต้อง'), { status: 400 }); }
}
// Multipart parsing via the WHATWG Response.formData() implementation built into Node.
async function formFiles(req) {
  const ct = req.headers['content-type'] || '';
  if (!ct.startsWith('multipart/form-data')) throw Object.assign(new Error('ต้องส่งเป็น multipart/form-data'), { status: 400 });
  const buf = await readBody(req, config.maxUploadBytes * 30 + 1024 * 1024);
  const form = await new Response(buf, { headers: { 'content-type': ct } }).formData();
  const files = [];
  for (const [, v] of form.entries()) if (typeof v === 'object' && v && 'arrayBuffer' in v) files.push({ name: v.name, buf: Buffer.from(await v.arrayBuffer()) });
  return { files, fields: Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === 'string')) };
}

function serveFile(res, file, type, cache) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
    res.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': type, 'Content-Length': st.size, 'Cache-Control': cache });
    fs.createReadStream(file).pipe(res);
  });
}

const routes = [];
const route = (method, pattern, handler, opts = {}) => {
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => (keys.push(k), '([^/]+)')) + '/?$');
  routes.push({ method, re, keys, handler, ...opts });
};

// ---------- public API ----------
route('GET', '/api/series', (req, res) => {
  const eps = repo.listEpisodes();
  json(res, 200, { series: repo.series(), episodes: eps, latest: eps[eps.length - 1] || null });
});
route('GET', '/api/episodes/:number', (req, res, p, ctx) => {
  const preview = ctx.url.searchParams.get('preview') === '1' && ctx.session;
  const ep = repo.getEpisode('number', Number(p.number));
  if (!ep || (ep.status !== 'published' && !preview)) return fail(res, 404, 'ไม่พบตอนนี้');
  json(res, 200, { episode: ep, ...repo.neighbours(ep.number, !!preview), series: { title: repo.series().title } });
});

// ---------- auth ----------
route('POST', '/api/admin/login', async (req, res, p, ctx) => {
  if (!auth.loginAllowed(ctx.ip)) return fail(res, 429, 'พยายามเข้าสู่ระบบมากเกินไป กรุณารอ 15 นาที');
  const { username, password } = await jsonBody(req);
  const a = typeof username === 'string' ? one('SELECT * FROM admins WHERE username = ?', username) : null;
  if (!a || typeof password !== 'string' || !auth.verifyPassword(password, a.pass_hash)) {
    auth.recordFailure(ctx.ip);
    return fail(res, 401, 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
  }
  const s = auth.createSession(a.id);
  json(res, 200, { username: a.username, csrf: s.csrf }, { 'Set-Cookie': auth.sessionCookie(s.token, s.expires) });
}, { public: true, noCsrf: true });
route('POST', '/api/admin/logout', (req, res) => { auth.destroySession(req); json(res, 200, { ok: true }, { 'Set-Cookie': auth.sessionCookie('', 0) }); });
route('GET', '/api/admin/me', (req, res, p, ctx) => json(res, 200, { username: ctx.session.username, csrf: ctx.session.csrf }));

// ---------- admin ----------
route('GET', '/api/admin/episodes', (req, res) => json(res, 200, { series: repo.series(), episodes: repo.listEpisodes({ includeDrafts: true }) }));
route('POST', '/api/admin/episodes', async (req, res) => json(res, 201, { episode: repo.createEpisode(await jsonBody(req)) }));
route('GET', '/api/admin/episodes/:id', (req, res, p) => { const e = repo.getEpisode('id', Number(p.id)); e ? json(res, 200, { episode: e }) : fail(res, 404, 'ไม่พบตอน'); });
route('PUT', '/api/admin/episodes/:id', async (req, res, p) => { const e = repo.updateEpisode(Number(p.id), await jsonBody(req)); e ? json(res, 200, { episode: e }) : fail(res, 404, 'ไม่พบตอน'); });
route('DELETE', '/api/admin/episodes/:id', (req, res, p) => (repo.deleteEpisode(Number(p.id)) ? json(res, 200, { ok: true }) : fail(res, 404, 'ไม่พบตอน')));
route('POST', '/api/admin/episodes/:id/status', async (req, res, p) => { const e = repo.setStatus(Number(p.id), (await jsonBody(req)).status); e ? json(res, 200, { episode: e }) : fail(res, 404, 'ไม่พบตอน'); });
route('POST', '/api/admin/episodes/:id/panels', async (req, res, p) => {
  const { files } = await formFiles(req);
  if (!files.length) return fail(res, 400, 'ไม่พบไฟล์ภาพ');
  files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  const media = files.map((f) => storage.save(f.buf, f.name));
  const e = repo.addPanels(Number(p.id), media);
  e ? json(res, 201, { episode: e }) : fail(res, 404, 'ไม่พบตอน');
});
route('PUT', '/api/admin/episodes/:id/order', async (req, res, p) => json(res, 200, { episode: repo.reorderPanels(Number(p.id), (await jsonBody(req)).ids || []) }));
route('POST', '/api/admin/episodes/:id/thumbnail', async (req, res, p) => {
  const { files } = await formFiles(req);
  if (!files[0]) return fail(res, 400, 'ไม่พบไฟล์ภาพ');
  const m = storage.save(files[0].buf, files[0].name);
  const e = repo.updateEpisode(Number(p.id), { thumbKey: m.key });
  e ? json(res, 200, { episode: e }) : fail(res, 404, 'ไม่พบตอน');
});
route('PUT', '/api/admin/panels/:id', async (req, res, p) => { const ep = repo.updatePanel(Number(p.id), await jsonBody(req)); ep ? json(res, 200, { episode: repo.getEpisode('id', ep) }) : fail(res, 404, 'ไม่พบ Panel'); });
route('POST', '/api/admin/panels/:id/image', async (req, res, p) => {
  const { files } = await formFiles(req);
  if (!files[0]) return fail(res, 400, 'ไม่พบไฟล์ภาพ');
  const m = storage.save(files[0].buf, files[0].name);
  const ep = repo.updatePanel(Number(p.id), { imageKey: m.key, width: m.width, height: m.height });
  ep ? json(res, 200, { episode: repo.getEpisode('id', ep) }) : fail(res, 404, 'ไม่พบ Panel');
});
route('DELETE', '/api/admin/panels/:id', (req, res, p) => { const ep = repo.deletePanel(Number(p.id)); ep ? json(res, 200, { episode: repo.getEpisode('id', ep) }) : fail(res, 404, 'ไม่พบ Panel'); });
route('PUT', '/api/admin/panels/:id/bubbles', async (req, res, p) => { const b = repo.replaceBubbles(Number(p.id), (await jsonBody(req)).bubbles); b ? json(res, 200, { bubbles: b }) : fail(res, 404, 'ไม่พบ Panel'); });
route('PUT', '/api/admin/series', async (req, res) => {
  const b = await jsonBody(req);
  json(res, 200, { series: repo.updateSeries({ title: b.title?.trim() || undefined, tagline: typeof b.tagline === 'string' ? b.tagline.trim().slice(0, 300) : undefined, synopsis: typeof b.synopsis === 'string' ? b.synopsis.trim().slice(0, 5000) : undefined }) });
});
route('POST', '/api/admin/series/cover', async (req, res) => {
  const { files } = await formFiles(req);
  if (!files[0]) return fail(res, 400, 'ไม่พบไฟล์ภาพ');
  const m = storage.save(files[0].buf, files[0].name);
  json(res, 200, { series: repo.updateSeries({ coverKey: m.key }) });
});

// ---------- pages ----------
const PAGES = { '/': 'index.html', '/admin': 'admin.html' };

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);
  const ip = req.socket.remoteAddress || '';
  if (pathname.startsWith('/api/')) {
    const ctx = { url, ip, session: auth.getSession(req) };
    for (const r of routes) {
      if (r.method !== req.method) continue;
      const m = pathname.match(r.re);
      if (!m) continue;
      const params = Object.fromEntries(r.keys.map((k, i) => [k, m[i + 1]]));
      const isAdmin = pathname.startsWith('/api/admin/');
      if (isAdmin && !r.public && !ctx.session) return fail(res, 401, 'กรุณาเข้าสู่ระบบ');
      if (isAdmin && req.method !== 'GET' && !r.noCsrf && req.headers['x-csrf-token'] !== ctx.session.csrf) return fail(res, 403, 'CSRF token ไม่ถูกต้อง');
      return await r.handler(req, res, params, ctx);
    }
    return fail(res, 404, 'ไม่พบ API');
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
  if (pathname.startsWith('/media/')) {
    const f = storage.resolve(pathname.slice(7));
    if (!f) return send(res, 404, 'Not found');
    res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; img-src data:; sandbox");
    return serveFile(res, f.file, f.mime, 'public, max-age=31536000, immutable');
  }
  if (/^\/episode\/\d+\/?$/.test(pathname)) return serveFile(res, path.join(PUBLIC, 'episode.html'), STATIC_TYPES['.html'], 'no-cache');
  if (PAGES[pathname]) return serveFile(res, path.join(PUBLIC, PAGES[pathname]), STATIC_TYPES['.html'], 'no-cache');
  const file = path.normalize(path.join(PUBLIC, pathname));
  if (!file.startsWith(PUBLIC + path.sep)) return send(res, 403, 'Forbidden');
  const type = STATIC_TYPES[path.extname(file)];
  if (!type) return send(res, 404, 'Not found');
  serveFile(res, file, type, pathname.startsWith('/fonts/') ? 'public, max-age=31536000' : 'no-cache');
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((e) => {
    if (!e.status) console.error(e);
    if (!res.headersSent) fail(res, e.status || 500, e.status ? e.message : 'เกิดข้อผิดพลาดภายในระบบ');
  });
});
if (require.main === module) server.listen(config.port, config.host, () => console.log(`RESET: 00:10 webtoon running on http://localhost:${config.port}`));
module.exports = { server };
