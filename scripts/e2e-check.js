#!/usr/bin/env node
// Browser end-to-end check against a running server (uses Playwright).
// Usage: BASE=http://localhost:3000 ADMIN_USERNAME=admin ADMIN_PASSWORD=... [EPISODES=30] node scripts/e2e-check.js
// Note: this edits EP1 panel 3's first bubble text and adds/removes a panel.
'use strict';
const { chromium } = require('playwright');
const path = require('path');
const B = process.env.BASE || 'http://localhost:3000';
const EPS = Number(process.env.EPISODES || 30); // number of published episodes expected
const SHOTS = process.env.SHOTS || '';
const shot = (p, name) => (SHOTS ? p.screenshot({ path: path.join(SHOTS, name) }) : null);

(async () => {
  const b = await chromium.launch();
  const errs = [];
  const watch = (p) => { p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); p.on('requestfailed', (r) => errs.push('FAILED ' + r.url())); };
  let ok = true;
  const check = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) ok = false; };

  const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); watch(m);
  let total = 0;
  for (let n = 1; n <= EPS; n++) {
    await m.goto(`${B}/episode/${n}`);
    await m.waitForSelector('.panel img');
    const r = await m.evaluate(async () => {
      const imgs = [...document.querySelectorAll('.panel img')];
      for (const i of imgs) { i.loading = 'eager'; if (!i.complete || !i.naturalWidth) await new Promise((res) => { i.onload = i.onerror = res; setTimeout(res, 5000); }); }
      return { n: imgs.length, bad: imgs.filter((i) => !i.naturalWidth).length, bubbles: document.querySelectorAll('.bubble').length, overflow: document.documentElement.scrollWidth > innerWidth, next: document.getElementById('end-next').getAttribute('href'), prev: document.getElementById('end-prev').getAttribute('href') };
    });
    total += r.n;
    check(r.n > 0 && r.bad === 0 && !r.overflow, `EP${n}: ${r.n} panels loaded, ${r.bubbles} text overlays, no horizontal overflow (mobile)`);
    check((n === 1 ? r.prev === null : r.prev === `/episode/${n - 1}`) && (n === EPS ? r.next === null : r.next === `/episode/${n + 1}`), `EP${n}: prev/next links`);
  }
  console.log(`total panels: ${total}`);
  await m.goto(B + '/'); await m.waitForSelector('.ep-item'); await shot(m, 'home-mobile.png');
  check(await m.locator('.ep-item').count() === EPS, `home lists ${EPS} episodes`);
  check(await m.locator('#cover').isVisible(), 'home shows cover');
  await m.click('#read-first'); await m.waitForURL(/episode\/1$/);
  check(true, 'home "read first" button opens EP1');

  const d = await b.newPage({ viewport: { width: 1440, height: 900 } }); watch(d);
  await d.goto(B + '/'); await d.waitForSelector('.ep-item'); await shot(d, 'home-desktop.png');
  await d.goto(B + '/episode/10'); await d.waitForSelector('.panel img'); await d.keyboard.press('ArrowLeft'); await d.waitForURL(/episode\/9$/);
  check(true, 'desktop keyboard navigation');
  await d.goto(B + '/episode/99'); await d.waitForTimeout(300);
  check((await d.textContent('#ep-title')).includes('ไม่พบ'), 'unknown episode shows not-found message');

  if (process.env.ADMIN_PASSWORD) {
    const a = await b.newPage({ viewport: { width: 1366, height: 900 } }); watch(a); a.on('dialog', (dl) => dl.accept());
    await a.goto(B + '/admin');
    await a.fill('input[name=username]', process.env.ADMIN_USERNAME || 'admin'); await a.fill('input[name=password]', process.env.ADMIN_PASSWORD); await a.click('#login-form button');
    await a.waitForSelector('#ep-rows tr'); await shot(a, 'admin-list.png');
    check(await a.locator('#ep-rows tr').count() === EPS, `admin lists ${EPS} episodes`);
    await a.locator('#ep-rows tr').first().locator('a').click(); await a.waitForSelector('.panel-card');
    const before = await a.locator('.panel-card').count();
    await a.locator('.panel-card').nth(2).getByText('แก้ไขข้อความ').click(); await a.waitForSelector('#ed-canvas .bubble');
    const bb = await a.locator('#ed-canvas .bubble').first().boundingBox();
    const orig = await a.evaluate(async () => (await (await fetch('/api/episodes/1')).json()).episode.panels[2].bubbles[0]);
    await a.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await a.mouse.down(); await a.mouse.move(bb.x + bb.width / 2 + 60, bb.y + bb.height / 2 + 40, { steps: 6 }); await a.mouse.up();
    await a.fill('#ed-form textarea[name=text]', orig.text + ' (ทดสอบ)');
    await shot(a, 'admin-editor.png');
    await a.click('#ed-save'); await a.waitForTimeout(500);
    const saved = await a.evaluate(async () => (await (await fetch('/api/episodes/1')).json()).episode.panels[2].bubbles[0]);
    check(saved.x !== orig.x && saved.y !== orig.y && saved.text === orig.text + ' (ทดสอบ)', 'bubble drag + text edit saved to database');
    // restore original text/position
    await a.fill('#ed-form input[name=x]', String(orig.x)); await a.fill('#ed-form input[name=y]', String(orig.y)); await a.fill('#ed-form textarea[name=text]', orig.text);
    await a.click('#ed-save'); await a.waitForTimeout(400); await a.click('#ed-close');
    await a.click('#unpublish'); await a.waitForTimeout(300);
    check((await fetch(B + '/api/episodes/1')).status === 404, 'unpublish hides episode from public');
    await a.locator('button[data-act=publish]').click(); await a.waitForTimeout(300);
    check((await fetch(B + '/api/episodes/1')).status === 200, 'publish makes it public again');
    await a.setInputFiles('#panel-files', path.join(__dirname, '..', 'art', 'out', 'ep01', 'p01.svg')); await a.waitForTimeout(700);
    check(await a.locator('.panel-card').count() === before + 1, 'upload panel via dashboard');
    await a.locator('.panel-card').last().locator('button', { hasText: '↑' }).click(); await a.waitForTimeout(400);
    await a.locator('.panel-card').nth(before - 1).locator('button', { hasText: 'ลบ' }).click(); await a.waitForTimeout(500);
    check(await a.locator('.panel-card').count() === before, 'reorder + delete panel via dashboard');
    const am = await b.newPage({ viewport: { width: 390, height: 844 } }); await am.goto(B + '/admin'); await am.waitForTimeout(400); await shot(am, 'admin-mobile.png');
  }
  // expected: 404 from the deliberate /episode/99 check, 401 from /api/admin/me before login
  const unexpected = errs.filter((e) => !/status of (404|401)/.test(e));
  check(unexpected.length === 0, `no unexpected browser errors${unexpected.length ? ': ' + unexpected.join(' | ') : ''} (expected 404/401 seen: ${errs.length - unexpected.length})`);
  await b.close();
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
