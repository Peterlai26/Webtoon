'use strict';
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const envFile = path.join(ROOT, '.env');
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);

const env = process.env;
const config = {
  root: ROOT,
  port: Number(env.PORT || 3000),
  host: env.HOST || '0.0.0.0',
  dataDir: path.resolve(ROOT, env.DATA_DIR || 'data'),
  storageDir: path.resolve(ROOT, env.STORAGE_DIR || 'storage'),
  sessionSecret: env.SESSION_SECRET || '',
  adminUser: env.ADMIN_USERNAME || '',
  adminPassword: env.ADMIN_PASSWORD || '',
  secureCookies: env.SECURE_COOKIES === 'true',
  maxUploadBytes: Number(env.MAX_UPLOAD_MB || 15) * 1024 * 1024,
  sessionHours: Number(env.SESSION_HOURS || 12),
};

function requireSecrets() {
  const missing = [];
  if (!config.sessionSecret || config.sessionSecret.length < 32) missing.push('SESSION_SECRET (>= 32 chars)');
  if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(', ')}. See .env.example`);
    process.exit(1);
  }
}

module.exports = { config, requireSecrets };
