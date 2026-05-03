function renderUpcoming() {
  const todayStr = getTodayStr();
  const list = [];
  Object.entries(allEvents).forEach(([ds, evs]) => {
    if (ds >= todayStr) evs.forEach(e => list.push({ ...e, date: ds }));
  });
  list.sort((a, b) => a.date !== b.date ? a.date.localeCompare(b.date) : (a.timeFrom || '').localeCompare(b.timeFrom || ''));

  const container = document.getElementById('evList');
  if (!list.length) {
    container.innerHTML = '<div class="no-ev">No hay eventos próximos.<br>¡Abre el calendario y sé el primero en agendar! 🎮</div>';
    return;
  }
  container.innerHTML = list.slice(0, 12).map(e => {
    const [y, m, d] = e.date.split('-').map(Number);
    const g      = e.game ? Object.values(gameMap).find(x => x.name === e.game) : null;
    const css    = g ? g.css : 't-mc';
    const isMine = e.creatorSid === MY_SID;
    const names  = (e.players || [e.playerName]).join(', ');
    const editBtn = isMine ? `<button class="ev-edit-btn" onclick="openModal('${e.date}','${e._key}')">EDITAR</button>` : '';
    return `<div class="ev-card${isMine ? ' mine' : ''}">
      <div class="ev-icon ${css}">${e.gameIcon || '📌'}</div>
      <div class="ev-info">
        <div class="ev-title">${e.game || e.customEvent || 'Evento'}</div>
        <div class="ev-meta">📅 ${d} ${MONTHS_SHORT[m-1]} ${y} · ⏰ ${e.timeFrom} – ${e.timeTo}</div>
      </div>
      <div class="ev-players">👥 ${names}</div>
      ${editBtn}
    </div>`;
  }).join('');
}
