const $ = (id) => document.getElementById(id);
const fmtDate = (s) => (s ? new Date(s.replace(' ', 'T') + 'Z').toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '');

async function main() {
  const res = await fetch('/api/series');
  if (!res.ok) throw new Error('load failed');
  const { series, episodes, latest } = await res.json();
  document.title = `${series.title} — Webtoon`;
  if (series.cover) { $('cover').src = series.cover; $('cover').hidden = false; }
  $('tagline').textContent = series.tagline || '';
  $('synopsis').textContent = series.synopsis || '';
  $('ep-count').textContent = `${episodes.length} ตอน`;
  if (episodes.length) {
    const first = $('read-first'), last = $('read-latest');
    first.href = `/episode/${episodes[0].number}`; first.removeAttribute('aria-disabled');
    last.href = `/episode/${latest.number}`; last.removeAttribute('aria-disabled');
    last.textContent = `ตอนล่าสุด: ตอนที่ ${latest.number}`;
    $('meta-line').textContent = `อัปเดตล่าสุด ${fmtDate(latest.publishedAt)} · ตอนที่ ${latest.number} ${latest.title}`;
  }
  const list = $('ep-list');
  list.replaceChildren();
  if (!episodes.length) {
    const li = document.createElement('li'); li.className = 'empty'; li.textContent = 'ยังไม่มีตอนที่เผยแพร่'; list.append(li);
    return;
  }
  for (const ep of [...episodes].reverse()) {
    const li = document.createElement('li'); li.className = 'ep-item';
    const a = document.createElement('a'); a.href = `/episode/${ep.number}`;
    const th = document.createElement('div'); th.className = 'ep-thumb';
    if (ep.thumb) { const img = document.createElement('img'); img.src = ep.thumb; img.alt = ''; img.loading = 'lazy'; th.append(img); }
    const info = document.createElement('div');
    info.innerHTML = '<div class="ep-no"></div><div class="ep-title"></div><div class="ep-sub"></div>';
    info.children[0].textContent = `ตอนที่ ${ep.number}`;
    info.children[1].textContent = ep.title;
    info.children[2].textContent = [ep.subtitle, fmtDate(ep.publishedAt)].filter(Boolean).join(' · ');
    a.append(th, info);
    if (latest && ep.number === latest.number) { const s = document.createElement('span'); s.className = 'ep-new'; s.textContent = 'ล่าสุด'; a.append(s); }
    li.append(a); list.append(li);
  }
}
main().catch(() => { $('synopsis').textContent = 'โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'; });
