function openModal(ds, editKey = null) {
  selDay = ds;
  resetModal();

  const [y, m, d] = ds.split('-').map(Number);
  document.getElementById('modalDateTitle').textContent = `${d} de ${MONTHS_ES[m-1]} de ${y}`;

  if (editKey) {
    editingKey = editKey;
    const ev = (allEvents[ds] || []).find(item => item._key === editKey);
    if (ev) {
      playerChips = ev.players ? [...ev.players] : (ev.playerName ? [ev.playerName] : []);
      renderChips();

      const [fh, fm] = (ev.timeFrom || '18:00').split(':').map(Number);
      const [th, tm] = (ev.timeTo   || '21:00').split(':').map(Number);
      timeState.from = { h:fh, m: fm };
      timeState.to   = { h:th, m: tm };

      if (ev.game) {
        const entry = Object.entries(gameMap).find(([, g]) => g.name === ev.game);
        if (entry) selGameFn(entry[0]);
      } else if (ev.customEvent) {
        customMode = true;
        document.getElementById('customDiv').style.display = 'block';
        document.getElementById('customText').value = ev.customEvent;
        document.getElementById('toggleCustom').textContent = '← Elegir juego';
      }
    }
    document.getElementById('modalEyebrow').textContent = '// Editar partida';
    document.getElementById('submitBtn').style.display  = 'none';
    document.getElementById('editBtns').style.display   = 'grid';
  } else {
    document.getElementById('modalEyebrow').textContent = '// Nueva partida';
    document.getElementById('submitBtn').style.display  = 'block';
    document.getElementById('editBtns').style.display   = 'none';
  }

  renderExistingEvents(ds, editKey);
  initTimeInputs();
  document.getElementById('overlay').classList.add('open');
  setTimeout(() => document.getElementById('playerInput').focus(), 100);
}

function closeModal() {
  document.getElementById('overlay').classList.remove('open');
  closeTimePickers();
}

function resetModal() {
  resetChips();
  resetGameSelection();
  editingKey = null;
  resetTimeState();
}

function renderExistingEvents(ds, editKey) {
  const evs = allEvents[ds] || [];
  const xContainer = document.getElementById('existingEvents');
  if (evs.length && !editKey) {
    xContainer.style.display = 'block';
    document.getElementById('existingList').innerHTML = evs.map(e => {
      const isMine = e.creatorSid === MY_SID;
      const names  = (e.players || [e.playerName]).join(', ');
      const actions = isMine
        ? `<div class="event-actions">
             <button class="ev-action-btn edit"   onclick="event.stopPropagation();openModal('${ds}','${e._key}')">✏️</button>
             <button class="ev-action-btn delete" onclick="event.stopPropagation();deleteEvent('${ds}','${e._key}')">🗑️</button>
           </div>`
        : '<span class="locked-badge">🔒</span>';
      return `<div class="existing-item">
        <span class="existing-icon">${e.gameIcon || '📌'}</span>
        <div class="existing-item-content">
          <span class="existing-item-title">${e.game || e.customEvent || 'Evento'}</span>
          <span class="existing-item-meta">${names} · ${e.timeFrom}–${e.timeTo}</span>
        </div>
        ${actions}
      </div>`;
    }).join('');
  } else {
    xContainer.style.display = 'none';
  }
}
