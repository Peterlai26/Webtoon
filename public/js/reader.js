import { renderPanel } from './bubbles.js';

const $ = (id) => document.getElementById(id);
const number = Number(location.pathname.split('/').filter(Boolean)[1]);
const preview = new URLSearchParams(location.search).get('preview') === '1';

function setLink(el, ep, label) {
  if (!ep) { el.setAttribute('aria-disabled', 'true'); el.removeAttribute('href'); return; }
  el.href = `/episode/${ep.number}${preview ? '?preview=1' : ''}`;
  el.removeAttribute('aria-disabled');
  if (label) el.title = `ตอนที่ ${ep.number}: ${ep.title}`;
}

async function main() {
  const res = await fetch(`/api/episodes/${number}${preview ? '?preview=1' : ''}`, { credentials: 'same-origin' });
  if (!res.ok) {
    $('bar-title').textContent = 'ไม่พบตอนนี้';
    $('ep-title').textContent = 'ไม่พบตอนนี้ หรือยังไม่เผยแพร่';
    return;
  }
  const { episode: ep, prev, next, series } = await res.json();
  document.title = `ตอนที่ ${ep.number} ${ep.title} — ${series.title}`;
  $('bar-title').textContent = `ตอนที่ ${ep.number} · ${ep.title}`;
  $('ep-no').textContent = `ตอนที่ ${ep.number}`;
  $('ep-title').textContent = ep.title;
  $('ep-sub').textContent = ep.subtitle || '';
  if (ep.status !== 'published') { const f = document.createElement('div'); f.className = 'preview-flag'; f.textContent = 'ตัวอย่าง (ยังไม่เผยแพร่)'; $('ep-header').append(f); }
  for (const el of [$('top-prev'), $('end-prev')]) setLink(el, prev, true);
  for (const el of [$('top-next'), $('end-next')]) setLink(el, next, true);
  const strip = $('strip');
  ep.panels.forEach((p, i) => {
    if (i > 0 && p.gap) { const g = document.createElement('div'); g.className = 'panel-gap'; g.style.height = `${p.gap}px`; strip.append(g); }
    strip.append(renderPanel(p, { lazy: i > 2 }));
  });
  $('end-msg').textContent = next ? `จบตอนที่ ${ep.number}` : `จบตอนที่ ${ep.number} — ตอนล่าสุดที่มีให้อ่าน`;
  $('ep-end').hidden = false;
}

// hide the bar while scrolling down, show on scroll up; reading progress
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  $('progress').style.width = `${h > 0 ? (y / h) * 100 : 0}%`;
  $('bar').classList.toggle('hidden', y > lastY && y > 120);
  lastY = y;
}, { passive: true });
addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea')) return;
  if (e.key === 'ArrowLeft' && $('top-prev').href) location.href = $('top-prev').href;
  if (e.key === 'ArrowRight' && $('top-next').href) location.href = $('top-next').href;
});
main().catch(() => { $('bar-title').textContent = 'โหลดไม่สำเร็จ'; });
