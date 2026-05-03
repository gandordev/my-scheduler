function buildEvent() {
  const custom = document.getElementById('customText').value.trim();
  const from   = fmtTime(timeState.from.h, timeState.from.m);
  const to     = fmtTime(timeState.to.h, timeState.to.m);
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
  const eventData = buildEvent();
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
  const updated = buildEvent();
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

function listenToEvents() {
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
