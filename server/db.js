'use strict';
// SQLite via Node's built-in node:sqlite module.
const fs = require('fs');
const path = require('path');
const { config } = require('./config');

process.removeAllListeners('warning');
process.on('warning', (w) => { if (w.name !== 'ExperimentalWarning') console.warn(w); });
const { DatabaseSync } = require('node:sqlite');

fs.mkdirSync(config.dataDir, { recursive: true });
const db = new DatabaseSync(path.join(config.dataDir, 'webtoon.db'));
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

db.exec(`
CREATE TABLE IF NOT EXISTS series (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  title TEXT NOT NULL, tagline TEXT NOT NULL DEFAULT '', synopsis TEXT NOT NULL DEFAULT '',
  cover_key TEXT, updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS episodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL, subtitle TEXT NOT NULL DEFAULT '', summary TEXT NOT NULL DEFAULT '',
  thumb_key TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS panels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  episode_id INTEGER NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  image_key TEXT NOT NULL,
  width INTEGER, height INTEGER,
  gap INTEGER NOT NULL DEFAULT 24,
  alt TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS panels_ep ON panels(episode_id, position);
CREATE TABLE IF NOT EXISTS bubbles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  panel_id INTEGER NOT NULL REFERENCES panels(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  kind TEXT NOT NULL DEFAULT 'say',
  speaker TEXT NOT NULL DEFAULT '',
  text TEXT NOT NULL DEFAULT '',
  x REAL NOT NULL DEFAULT 5, y REAL NOT NULL DEFAULT 5, w REAL NOT NULL DEFAULT 40,
  font_scale REAL NOT NULL DEFAULT 1,
  tail TEXT NOT NULL DEFAULT 'none', tail_x REAL NOT NULL DEFAULT 50,
  rotate REAL NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS bubbles_panel ON bubbles(panel_id, position);
CREATE TABLE IF NOT EXISTS media (
  key TEXT PRIMARY KEY, mime TEXT NOT NULL, size INTEGER NOT NULL,
  width INTEGER, height INTEGER, original_name TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, pass_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY, admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  csrf TEXT NOT NULL, expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS login_attempts (ip TEXT NOT NULL, ts INTEGER NOT NULL);
`);

const one = (sql, ...p) => db.prepare(sql).get(...p);
const all = (sql, ...p) => db.prepare(sql).all(...p);
const run = (sql, ...p) => db.prepare(sql).run(...p);
function tx(fn) {
  db.exec('BEGIN');
  try { const r = fn(); db.exec('COMMIT'); return r; } catch (e) { db.exec('ROLLBACK'); throw e; }
}

module.exports = { db, one, all, run, tx };
