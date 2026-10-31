import { renderPanel } from './bubbles.js';

const $ = (id) => document.getElementById(id);
const state = { csrf: null, episode: null, editor: null };
const fmt = (s) => (s ? new Date(s.replace(' ', 'T') + 'Z').toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }) : '-');

function toast(msg, error = false) {
  const t = $('toast');
  t.textContent = msg; t.className = `toast show${error ? ' error' : ''}`;
  clearTimeout(toast.t); toast.t = setTimeout(() => (t.className = 'toast'), 2800);
}

async function api(method, url, body) {
  const opts = { method, headers: {}, credentials: 'same-origin' };
  if (state.csrf) opts.headers['X-CSRF-Token'] = state.csrf;
  if (body instanceof FormData) opts.body = body;
  else if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !url.endsWith('/login')) { show('login'); throw new Error(data.error || 'กรุณาเข้าสู่ระบบ'); }
  if (!res.ok) throw new Error(data.error || `เกิดข้อผิดพลาด (${res.status})`);
  return data;
}
const guard = (fn) => async (...a) => { try { await fn(...a); } catch (e) { toast(e.message, true); } };

function show(view) {
  for (const v of ['login', 'list', 'edit']) $(`view-${v}`).hidden = v !== view;
  $('logout').hidden = view === 'login';
}

// ---------- auth ----------
$('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  $('login-err').textContent = '';
  try {
    const d = await api('POST', '/api/admin/login', { username: f.get('username'), password: f.get('password') });
    state.csrf = d.csrf; e.target.reset(); route();
  } catch (err) { $('login-err').textContent = err.message; }
});
$('logout').addEventListener('click', guard(async () => { await api('POST', '/api/admin/logout'); state.csrf = null; show('login'); }));

// ---------- list ----------
async function loadList() {
  const { series, episodes } = await api('GET', '/api/admin/episodes');
  const rows = $('ep-rows'); rows.replaceChildren();
  for (const ep of episodes) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>ตอนที่ ${ep.number}</td><td></td><td>${ep.panelCount}</td><td><span class="pill ${ep.status}">${ep.status === 'published' ? 'เผยแพร่แล้ว' : 'Draft'}</span></td><td>${fmt(ep.updatedAt)}</td><td></td>`;
    tr.children[1].textContent = ep.title;
    const act = tr.children[5];
    const edit = Object.assign(document.createElement('a'), { className: 'btn small', href: `#/episode/${ep.id}`, textContent: 'แก้ไข' });
    const tog = Object.assign(document.createElement('button'), { className: 'btn small', textContent: ep.status === 'published' ? 'ยกเลิกเผยแพร่' : 'เผยแพร่' });
    tog.onclick = guard(async () => { await api('POST', `/api/admin/episodes/${ep.id}/status`, { status: ep.status === 'published' ? 'draft' : 'published' }); toast('อัปเดตสถานะแล้ว'); loadList(); });
    act.append(edit, ' ', tog);
    rows.append(tr);
  }
  if (!episodes.length) rows.innerHTML = '<tr><td colspan="6" class="hint">ยังไม่มีตอน</td></tr>';
  const sf = $('series-form');
  sf.title.value = series.title; sf.tagline.value = series.tagline; sf.synopsis.value = series.synopsis;
  $('series-cover').src = series.cover || '';
  state.nextNumber = (episodes.at(-1)?.number || 0) + 1;
}
$('series-form').addEventListener('submit', guard(async (e) => {
  e.preventDefault();
  const f = e.target;
  await api('PUT', '/api/admin/series', { title: f.title.value, tagline: f.tagline.value, synopsis: f.synopsis.value });
  toast('บันทึกข้อมูลเรื่องแล้ว');
}));
$('cover-file').addEventListener('change', guard(async (e) => {
  if (!e.target.files[0]) return;
  const fd = new FormData(); fd.append('file', e.target.files[0]);
  const { series } = await api('POST', '/api/admin/series/cover', fd);
  $('series-cover').src = series.cover; e.target.value = ''; toast('เปลี่ยนภาพปกแล้ว');
}));
$('new-ep').addEventListener('click', guard(async () => {
  const title = prompt('ชื่อตอนใหม่', `ตอนที่ ${state.nextNumber}`);
  if (!title) return;
  const { episode } = await api('POST', '/api/admin/episodes', { number: state.nextNumber, title });
  location.hash = `#/episode/${episode.id}`;
}));

// ---------- episode editor ----------
async function loadEpisode(id) {
  const { episode } = await api('GET', `/api/admin/episodes/${id}`);
  setEpisode(episode);
}
function setEpisode(ep) {
  state.episode = ep;
  const f = $('ep-form');
  f.number.value = ep.number; f.title.value = ep.title; f.subtitle.value = ep.subtitle; f.summary.value = ep.summary;
  $('edit-heading').textContent = `ตอนที่ ${ep.number}`;
  const pill = $('status-pill'); pill.className = `status-pill ${ep.status}`; pill.textContent = ep.status === 'published' ? 'เผยแพร่แล้ว' : 'Draft';
  $('unpublish').hidden = ep.status !== 'published';
  $('preview').href = `/episode/${ep.number}?preview=1`;
  renderPanelGrid();
}
function renderPanelGrid() {
  const ep = state.episode, grid = $('panel-grid');
  $('panel-count').textContent = `(${ep.panels.length})`;
  grid.replaceChildren();
  ep.panels.forEach((p, i) => {
    const li = document.createElement('li');
    li.className = 'panel-card'; li.draggable = true; li.dataset.id = p.id;
    li.innerHTML = `<div class="thumb"><img loading="lazy" alt=""></div><div class="meta"><span>#${i + 1}</span><span>${p.bubbles.length} ข้อความ</span></div><div class="actions"></div>`;
    li.querySelector('img').src = p.image;
    const a = li.querySelector('.actions');
    const mk = (t, fn, cls = '') => { const b = document.createElement('button'); b.type = 'button'; b.className = `btn ${cls}`; b.textContent = t; b.onclick = guard(fn); a.append(b); };
    mk('แก้ไขข้อความ', () => openEditor(i));
    mk('↑', () => move(i, -1)); mk('↓', () => move(i, 1));
    mk('ลบ', async () => { if (!confirm(`ลบ Panel #${i + 1}?`)) return; setEpisode((await api('DELETE', `/api/admin/panels/${p.id}`)).episode); toast('ลบ Panel แล้ว'); }, 'danger');
    li.addEventListener('dragstart', (e) => { li.classList.add('dragging'); e.dataTransfer.setData('text/plain', p.id); });
    li.addEventListener('dragend', () => li.classList.remove('dragging'));
    li.addEventListener('dragover', (e) => { e.preventDefault(); li.classList.add('over'); });
    li.addEventListener('dragleave', () => li.classList.remove('over'));
    li.addEventListener('drop', guard(async (e) => {
      e.preventDefault(); li.classList.remove('over');
      const from = ep.panels.findIndex((x) => String(x.id) === e.dataTransfer.getData('text/plain'));
      if (from < 0 || from === i) return;
      const ids = ep.panels.map((x) => x.id); const [m] = ids.splice(from, 1); ids.splice(i, 0, m);
      await saveOrder(ids);
    }));
    grid.append(li);
  });
}
async function move(i, d) {
  const ids = state.episode.panels.map((p) => p.id);
  const j = i + d; if (j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await saveOrder(ids);
}
async function saveOrder(ids) { setEpisode((await api('PUT', `/api/admin/episodes/${state.episode.id}/order`, { ids })).episode); toast('จัดลำดับแล้ว'); }

$('ep-form').addEventListener('submit', guard(async (e) => {
  e.preventDefault();
  const f = e.target, act = e.submitter?.dataset.act || 'draft';
  let { episode } = await api('PUT', `/api/admin/episodes/${state.episode.id}`, { number: Number(f.number.value), title: f.title.value, subtitle: f.subtitle.value, summary: f.summary.value });
  ({ episode } = await api('POST', `/api/admin/episodes/${episode.id}/status`, { status: act === 'publish' ? 'published' : 'draft' }));
  setEpisode(episode); toast(act === 'publish' ? 'บันทึกและเผยแพร่แล้ว' : 'บันทึกเป็น Draft แล้ว');
}));
$('unpublish').addEventListener('click', guard(async () => { setEpisode((await api('POST', `/api/admin/episodes/${state.episode.id}/status`, { status: 'draft' })).episode); toast('ยกเลิกการเผยแพร่แล้ว'); }));
$('delete-ep').addEventListener('click', guard(async () => {
  if (!confirm(`ลบตอนที่ ${state.episode.number} และ Panel ทั้งหมด? การลบไม่สามารถย้อนกลับได้`)) return;
  await api('DELETE', `/api/admin/episodes/${state.episode.id}`); location.hash = '#/'; toast('ลบตอนแล้ว');
}));
$('panel-files').addEventListener('change', guard(async (e) => {
  const files = [...e.target.files]; if (!files.length) return;
  const fd = new FormData(); files.forEach((f) => fd.append('files', f));
  toast(`กำลังอัปโหลด ${files.length} ไฟล์…`);
  setEpisode((await api('POST', `/api/admin/episodes/${state.episode.id}/panels`, fd)).episode);
  e.target.value = ''; toast(`อัปโหลด ${files.length} ภาพแล้ว`);
}));
$('thumb-file').addEventListener('change', guard(async (e) => {
  if (!e.target.files[0]) return;
  const fd = new FormData(); fd.append('file', e.target.files[0]);
  setEpisode((await api('POST', `/api/admin/episodes/${state.episode.id}/thumbnail`, fd)).episode);
  e.target.value = ''; toast('เปลี่ยนภาพหน้าปกตอนแล้ว');
}));
$('back').addEventListener('click', () => { location.hash = '#/'; });

// ---------- bubble editor ----------
const FIELDS = ['kind', 'speaker', 'text', 'x', 'y', 'w', 'fontScale', 'tail', 'tailX', 'rotate', 'color'];
function openEditor(index) {
  const p = state.episode.panels[index];
  state.editor = { index, panel: p, bubbles: structuredClone(p.bubbles), sel: p.bubbles.length ? 0 : -1, dirty: false };
  $('editor').hidden = false; document.body.style.overflow = 'hidden';
  $('ed-title').textContent = `Panel #${index + 1} / ${state.episode.panels.length}`;
  $('ed-gap').value = p.gap; $('ed-alt').value = p.alt;
  setDirty(false); drawEditor();
}
function setDirty(d) { state.editor.dirty = d; $('ed-dirty').hidden = !d; }
function closeEditor(force) {
  if (!force && state.editor?.dirty && !confirm('ยังไม่ได้บันทึก ต้องการปิดหรือไม่?')) return false;
  $('editor').hidden = true; document.body.style.overflow = ''; state.editor = null; renderPanelGrid(); return true;
}
function drawEditor(formToo = true) {
  const ed = state.editor, canvas = $('ed-canvas');
  const fig = renderPanel({ ...ed.panel, bubbles: ed.bubbles }, { lazy: false, editable: true });
  canvas.replaceChildren(fig);
  [...fig.querySelectorAll('.bubble')].forEach((el, i) => {
    el.classList.toggle('selected', i === ed.sel);
    el.addEventListener('pointerdown', (e) => startDrag(e, i, fig, e.target.classList.contains('resize-handle')));
  });
  const list = $('ed-list'); list.replaceChildren();
  ed.bubbles.forEach((b, i) => {
    const li = document.createElement('li'); li.className = i === ed.sel ? 'active' : '';
    li.textContent = `${i + 1}. [${b.kind}] ${b.speaker ? b.speaker + ': ' : ''}${b.text}`;
    li.onclick = () => { ed.sel = i; drawEditor(); };
    list.append(li);
  });
  if (!formToo) return;
  const f = $('ed-form'), b = ed.bubbles[ed.sel];
  [...f.elements].forEach((el) => (el.disabled = !b));
  $('ed-del').disabled = $('ed-dup').disabled = !b;
  if (b) for (const k of FIELDS) f[k].value = k === 'color' ? (b.color || '#ffe14a') : (b[k] ?? '');
}
function startDrag(e, i, fig, resize) {
  e.preventDefault(); e.stopPropagation();
  const ed = state.editor; ed.sel = i;
  const rect = fig.getBoundingClientRect(), b = ed.bubbles[i];
  const sx = e.clientX, sy = e.clientY, ox = b.x, oy = b.y, ow = b.w;
  const el = e.currentTarget; el.setPointerCapture(e.pointerId);
  fig.querySelectorAll('.bubble').forEach((x, k) => x.classList.toggle('selected', k === i));
  const moveFn = (ev) => {
    const dx = ((ev.clientX - sx) / rect.width) * 100, dy = ((ev.clientY - sy) / rect.height) * 100;
    if (resize) { b.w = Math.round(Math.max(5, Math.min(100, ow + dx)) * 10) / 10; el.style.width = `${b.w}%`; }
    else { b.x = Math.round((ox + dx) * 10) / 10; b.y = Math.round((oy + dy) * 10) / 10; el.style.left = `${b.x}%`; el.style.top = `${b.y}%`; }
    setDirty(true);
  };
  const up = () => { el.removeEventListener('pointermove', moveFn); el.removeEventListener('pointerup', up); drawEditor(); };
  el.addEventListener('pointermove', moveFn); el.addEventListener('pointerup', up);
}
$('ed-form').addEventListener('input', (e) => {
  const ed = state.editor, b = ed.bubbles[ed.sel]; if (!b) return;
  const k = e.target.name; let v = e.target.value;
  if (['x', 'y', 'w', 'fontScale', 'tailX', 'rotate'].includes(k)) v = Number(v);
  b[k] = v; setDirty(true);
  drawEditor(false);
});
$('ed-add').addEventListener('click', () => { const ed = state.editor; ed.bubbles.push({ kind: 'say', speaker: '', text: 'ข้อความใหม่', x: 10, y: 5, w: 40, fontScale: 1, tail: 'b', tailX: 30, rotate: 0, color: '' }); ed.sel = ed.bubbles.length - 1; setDirty(true); drawEditor(); });
$('ed-dup').addEventListener('click', () => { const ed = state.editor, b = ed.bubbles[ed.sel]; if (!b) return; ed.bubbles.push({ ...structuredClone(b), id: undefined, x: b.x + 3, y: b.y + 3 }); ed.sel = ed.bubbles.length - 1; setDirty(true); drawEditor(); });
$('ed-del').addEventListener('click', () => { const ed = state.editor; if (ed.sel < 0) return; ed.bubbles.splice(ed.sel, 1); ed.sel = Math.min(ed.sel, ed.bubbles.length - 1); setDirty(true); drawEditor(); });
for (const id of ['ed-gap', 'ed-alt']) $(id).addEventListener('input', () => setDirty(true));
$('ed-save').addEventListener('click', guard(async () => {
  const ed = state.editor;
  const { bubbles } = await api('PUT', `/api/admin/panels/${ed.panel.id}/bubbles`, { bubbles: ed.bubbles });
  const { episode } = await api('PUT', `/api/admin/panels/${ed.panel.id}`, { gap: Number($('ed-gap').value), alt: $('ed-alt').value });
  state.episode = episode; ed.panel = episode.panels[ed.index]; ed.bubbles = structuredClone(bubbles);
  setDirty(false); drawEditor(); toast('บันทึกข้อความแล้ว');
}));
$('ed-replace').addEventListener('change', guard(async (e) => {
  if (!e.target.files[0]) return;
  const fd = new FormData(); fd.append('file', e.target.files[0]);
  const ed = state.editor;
  const { episode } = await api('POST', `/api/admin/panels/${ed.panel.id}/image`, fd);
  state.episode = episode; ed.panel = { ...episode.panels[ed.index] }; e.target.value = ''; drawEditor(); toast('เปลี่ยนภาพแล้ว');
}));
$('ed-close').addEventListener('click', () => closeEditor());
$('ed-prev').addEventListener('click', () => { const i = state.editor.index; if (i > 0 && closeEditor()) openEditor(i - 1); });
$('ed-next').addEventListener('click', () => { const i = state.editor.index; if (i < state.episode.panels.length - 1 && closeEditor()) openEditor(i + 1); });
addEventListener('keydown', (e) => {
  const ed = state.editor; if (!ed || e.target.closest('input, textarea, select')) return;
  const b = ed.bubbles[ed.sel]; if (!b) return;
  const step = e.shiftKey ? 2 : 0.5, map = { ArrowLeft: ['x', -step], ArrowRight: ['x', step], ArrowUp: ['y', -step], ArrowDown: ['y', step] };
  if (map[e.key]) { e.preventDefault(); b[map[e.key][0]] = Math.round((b[map[e.key][0]] + map[e.key][1]) * 10) / 10; setDirty(true); drawEditor(); }
  if (e.key === 'Delete') $('ed-del').click();
});
addEventListener('beforeunload', (e) => { if (state.editor?.dirty) e.preventDefault(); });

// ---------- routing ----------
async function route() {
  if (!state.csrf) {
    try { state.csrf = (await api('GET', '/api/admin/me')).csrf; } catch { show('login'); return; }
  }
  if (state.editor) closeEditor(true);
  const m = location.hash.match(/^#\/episode\/(\d+)/);
  try {
    if (m) { show('edit'); await loadEpisode(Number(m[1])); } else { show('list'); await loadList(); }
  } catch (e) { toast(e.message, true); }
}
addEventListener('hashchange', route);
route();
