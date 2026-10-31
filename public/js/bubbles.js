// Renders a panel image with its Thai text overlays. Used by the reader and
// the admin editor so both show exactly the same layout.
// Bubble geometry is stored in % of the panel, and font size scales with the
// panel width (container query units), so layout is identical at any width.
export function renderPanel(panel, { lazy = true, editable = false } = {}) {
  const fig = document.createElement('figure');
  fig.className = 'panel';
  fig.dataset.panelId = panel.id;
  if (panel.width && panel.height) fig.style.aspectRatio = `${panel.width} / ${panel.height}`;
  const img = document.createElement('img');
  img.src = panel.image;
  img.alt = panel.alt || '';
  img.decoding = 'async';
  if (lazy) img.loading = 'lazy';
  img.draggable = false;
  fig.append(img);
  const layer = document.createElement('div');
  layer.className = 'bubble-layer';
  for (const b of panel.bubbles || []) layer.append(renderBubble(b, editable));
  fig.append(layer);
  return fig;
}

export function renderBubble(b, editable = false) {
  const el = document.createElement('div');
  el.className = `bubble k-${b.kind}` + (b.tail && b.tail !== 'none' && ['say', 'shout', 'whisper', 'think'].includes(b.kind) ? ` tail-${b.tail}` : '');
  el.style.left = `${b.x}%`;
  el.style.top = `${b.y}%`;
  el.style.width = `${b.w}%`;
  el.style.setProperty('--fs', b.fontScale || 1);
  el.style.setProperty('--tx', `${b.tailX ?? 50}%`);
  if (b.rotate) el.style.transform = `rotate(${b.rotate}deg)`;
  if (b.color) el.style.setProperty('--c', b.color);
  const span = document.createElement('span');
  span.className = 'bubble-text';
  span.textContent = b.text;
  el.append(span);
  if (b.speaker) el.dataset.speaker = b.speaker;
  if (editable) {
    el.tabIndex = 0;
    const h = document.createElement('i');
    h.className = 'resize-handle';
    h.title = 'ลากเพื่อปรับความกว้าง';
    el.append(h);
  }
  return el;
}
