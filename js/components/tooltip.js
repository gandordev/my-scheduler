let _tipTimer = null;
const tooltip = document.getElementById('evTooltip');

function startTooltip(evt, ds, key) {
  clearTimeout(_tipTimer);
  _tipTimer = setTimeout(() => showTooltip(evt, ds, key), 900);
}

function showTooltip(evt, ds, key) {
  const ev = (allEvents[ds] || []).find(item => item._key === key);
  if (!ev) return;
  const [y, m, d] = ds.split('-').map(Number);
  const players   = ev.players || [ev.playerName];
  tooltip.innerHTML = `
    <div class="ev-tooltip-bar"></div>
    <div class="ev-tooltip-icon">${ev.gameIcon || '📌'}</div>
    <div class="ev-tooltip-title">${ev.game || ev.customEvent || 'Evento'}</div>
    <div class="ev-tooltip-meta">📅 ${d} ${MONTHS_SHORT[m-1]} ${y}</div>
    <div class="ev-tooltip-meta">⏰ ${ev.timeFrom} – ${ev.timeTo}</div>
    <div class="ev-tooltip-players">👥 ${players.join(' · ')}</div>`;

  const vw = window.innerWidth, vh = window.innerHeight;
  let left = evt.clientX + 14, top = evt.clientY + 14;
  if (left + 270 > vw - 8) left = evt.clientX - 274;
  if (top  + 170 > vh - 8) top = evt.clientY - 174;
  tooltip.style.left = left + 'px';
  tooltip.style.top  = top + 'px';
  tooltip.classList.add('visible');
}

function hideTooltip() {
  clearTimeout(_tipTimer);
  tooltip.classList.remove('visible');
}
