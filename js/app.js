const _e = window.__env || {};
const FIREBASE_CONFIG = {
  apiKey:            _e.FIREBASE_API_KEY,
  authDomain:        _e.FIREBASE_AUTH_DOMAIN,
  databaseURL:       _e.FIREBASE_DATABASE_URL,
  projectId:         _e.FIREBASE_PROJECT_ID,
  storageBucket:     _e.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: _e.FIREBASE_MESSAGING_SENDER_ID,
  appId:             _e.FIREBASE_APP_ID
};
const EMAILJS_KEY      = _e.EMAILJS_PUBLIC_KEY  || '';
const EMAILJS_SERVICE  = _e.EMAILJS_SERVICE_ID  || '';
const EMAILJS_TEMPLATE = _e.EMAILJS_TEMPLATE_ID || '';
const NOTIFY_EMAIL     = _e.NOTIFY_EMAIL        || '';

firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.database();
emailjs.init(EMAILJS_KEY);

function buildEv() {
  const custom = document.getElementById('customText').value.trim();
  const from   = fmtT('from');
  const to     = fmtT('to');
  const g      = selGame ? gameMap[selGame] : null;
  return {
    players:     playerChips,
    playerName:  playerChips[0] || '',
    timeFrom:    from,
    timeTo:      to,
    game:        g ? g.name : null,
    gameIcon:    g ? g.icon : '📌',
    customEvent: custom || null,
    date:        selDay,
    ts:          Date.now(),
    creatorSid:  MY_SID
  };
}

function validateForm() {
  const custom = document.getElementById('customText').value.trim();
  if (!playerChips.length)    { alert('¡Añade al menos un jugador!'); return false; }
  if (!selGame && !custom)    { alert('¡Elige un juego o escribe un evento personalizado!'); return false; }
  const fMin = timeState.from.h * 60 + timeState.from.m;
  const tMin = timeState.to.h   * 60 + timeState.to.m;
  if (fMin >= tMin)           { alert('La hora de fin debe ser posterior a la de inicio.'); return false; }
  return true;
}

async function submitEvent() {
  if (!validateForm()) return;
  const eventData = buildEv();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true; btn.textContent = 'AGENDANDO...';
  try {
    await db.ref(`events/${selDay}`).push(eventData);
    try {
      const [y, m, d] = selDay.split('-').map(Number);
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        to_email: NOTIFY_EMAIL,
        player_name: playerChips.join(', '),
        event_title: eventData.game || eventData.customEvent,
        event_date: `${d} de ${MONTHS_ES[m-1]} de ${y}`,
        time_from: eventData.timeFrom,
        time_to: eventData.timeTo,
      });
    } catch (e) {
      console.warn('Email no enviado:', e);
    }
    closeModal();
    showToast(`✓ Partida agendada con ${playerChips.join(', ')}`);
  } catch (err) {
    console.error(err);
    alert('Error al guardar. Revisa la configuración de Firebase.');
  }
  btn.disabled = false;
  btn.textContent = 'AGENDAR PARTIDA';
}

async function updateEvent() {
  if (!editingKey || !validateForm()) return;
  const existing = (allEvents[selDay] || []).find(item => item._key === editingKey);
  if (existing && existing.creatorSid !== MY_SID) return alert('No tienes permiso para editar este evento.');
  const updated = buildEv();
  const btn = document.getElementById('updateBtn');
  btn.disabled = true; btn.textContent = 'ACTUALIZANDO...';
  try {
    await db.ref(`events/${selDay}/${editingKey}`).update(updated);
    closeModal();
    showToast(`✓ Evento actualizado: ${updated.game || updated.customEvent}`);
  } catch (err) {
    alert('Error al actualizar.');
  }
  btn.disabled = false;
  btn.textContent = 'ACTUALIZAR';
}

async function deleteEvent(ds, key) {
  const existing = (allEvents[ds] || []).find(item => item._key === key);
  if (existing && existing.creatorSid !== MY_SID) return alert('No tienes permiso para eliminar este evento.');
  if (!confirm('¿Eliminar este evento?')) return;
  try {
    await db.ref(`events/${ds}/${key}`).remove();
    closeModal();
    showToast('✓ Evento eliminado');
  } catch (err) {
    alert('Error al eliminar.');
  }
}

function renderUpcoming() {
  const today    = new Date();
  const todayStr = fmtDate(today.getFullYear(), today.getMonth(), today.getDate());
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

function listen() {
  db.ref('events').on('value', snap => {
    allEvents = {};
    const raw = snap.val() || {};
    Object.entries(raw).forEach(([ds, obj]) => {
      allEvents[ds] = Object.entries(obj).map(([key, val]) => ({ ...val, _key: key }));
    });
    renderCalendar();
    renderUpcoming();
  });
}
