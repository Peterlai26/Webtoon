'use strict';
const crypto = require('crypto');
const { config } = require('./config');
const { one, run } = require('./db');

function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`;
}
function verifyPassword(pw, stored) {
  const [alg, saltHex, keyHex] = String(stored).split('$');
  if (alg !== 'scrypt' || !saltHex || !keyHex) return false;
  const key = crypto.scryptSync(pw, Buffer.from(saltHex, 'hex'), 64, { N: 16384, r: 8, p: 1 });
  const want = Buffer.from(keyHex, 'hex');
  return want.length === key.length && crypto.timingSafeEqual(key, want);
}

const tokenHash = (t) => crypto.createHmac('sha256', config.sessionSecret).update(t).digest('hex');

function createSession(adminId) {
  const token = crypto.randomBytes(32).toString('base64url');
  const csrf = crypto.randomBytes(24).toString('base64url');
  const expires = Date.now() + config.sessionHours * 3600e3;
  run('DELETE FROM sessions WHERE expires_at < ?', Date.now());
  run('INSERT INTO sessions (token_hash, admin_id, csrf, expires_at) VALUES (?,?,?,?)', tokenHash(token), adminId, csrf, expires);
  return { token, csrf, expires };
}

function parseCookies(header = '') {
  const out = {};
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function getSession(req) {
  const token = parseCookies(req.headers.cookie).sid;
  if (!token) return null;
  const s = one('SELECT s.csrf, s.expires_at, a.id, a.username FROM sessions s JOIN admins a ON a.id = s.admin_id WHERE s.token_hash = ?', tokenHash(token));
  if (!s || s.expires_at < Date.now()) return null;
  return { adminId: s.id, username: s.username, csrf: s.csrf, token };
}

function destroySession(req) {
  const token = parseCookies(req.headers.cookie).sid;
  if (token) run('DELETE FROM sessions WHERE token_hash = ?', tokenHash(token));
}

function sessionCookie(token, expires) {
  const parts = [`sid=${token}`, 'Path=/', 'HttpOnly', 'SameSite=Strict'];
  if (config.secureCookies) parts.push('Secure');
  parts.push(expires ? `Expires=${new Date(expires).toUTCString()}` : 'Max-Age=0');
  return parts.join('; ');
}

// Simple per-IP login throttle: 10 failed attempts / 15 minutes.
function loginAllowed(ip) {
  const since = Date.now() - 15 * 60e3;
  run('DELETE FROM login_attempts WHERE ts < ?', since);
  return one('SELECT COUNT(*) AS n FROM login_attempts WHERE ip = ?', ip).n < 10;
}
const recordFailure = (ip) => run('INSERT INTO login_attempts (ip, ts) VALUES (?,?)', ip, Date.now());

function ensureAdminFromEnv() {
  if (!config.adminUser || !config.adminPassword) return false;
  const existing = one('SELECT id FROM admins WHERE username = ?', config.adminUser);
  if (existing) return false;
  run('INSERT INTO admins (username, pass_hash) VALUES (?,?)', config.adminUser, hashPassword(config.adminPassword));
  return true;
}

module.exports = { hashPassword, verifyPassword, createSession, getSession, destroySession, sessionCookie, loginAllowed, recordFailure, ensureAdminFromEnv };
