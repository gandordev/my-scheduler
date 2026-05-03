function buildPicker(which) {
  const prefix = which === 'from' ? 'From' : 'To';
  const hItemsEl = document.getElementById(`items${prefix}H`);
  const mItemsEl = document.getElementById(`items${prefix}M`);
  const hColEl   = document.getElementById(`col${prefix}H`);
  const mColEl   = document.getElementById(`col${prefix}M`);

  hItemsEl.innerHTML = '';
  mItemsEl.innerHTML = '';

  for (let h = 0; h < 24; h++) {
    const d = document.createElement('div');
    d.className = 'time-item' + (h === timeState[which].h ? ' sel' : '');
    d.textContent = pad(h);
    d.onclick = () => {
      timeState[which].h = h;
      hItemsEl.querySelectorAll('.time-item').forEach(x => x.classList.remove('sel'));
      d.classList.add('sel');
    };
    hItemsEl.appendChild(d);
  }

  MINUTES_OPTS.forEach(m => {
    const d = document.createElement('div');
    d.className = 'time-item' + (m === timeState[which].m ? ' sel' : '');
    d.textContent = pad(m);
    d.onclick = () => {
      timeState[which].m = m;
      mItemsEl.querySelectorAll('.time-item').forEach(x => x.classList.remove('sel'));
      d.classList.add('sel');
    };
    mItemsEl.appendChild(d);
  });

  setTimeout(() => {
    hColEl.scrollTop = timeState[which].h * 40;
    mColEl.scrollTop = MINUTES_OPTS.indexOf(timeState[which].m) * 40;
  }, 30);
}

function toggleTimePicker(which) {
  const dropId = which === 'from' ? 'dropFrom' : 'dropTo';
  const dispId = which === 'from' ? 'displayFrom' : 'displayTo';
  const drop   = document.getElementById(dropId);
  const disp   = document.getElementById(dispId);
  const isOpen = drop.classList.contains('open');

  closeTimePickers();

  if (!isOpen) {
    buildPicker(which);
    drop.classList.add('open');
    disp.classList.add('open');
  }
}

function confirmTime(which) {
  const labelId = which === 'from' ? 'labelFrom' : 'labelTo';
  document.getElementById(labelId).textContent = fmtT(which);
  const dropId = which === 'from' ? 'dropFrom' : 'dropTo';
  const dispId = which === 'from' ? 'displayFrom' : 'displayTo';
  document.getElementById(dropId).classList.remove('open');
  document.getElementById(dispId).classList.remove('open');
}

function closeTimePickers() {
  ['dropFrom', 'dropTo'].forEach(id => document.getElementById(id).classList.remove('open'));
  ['displayFrom', 'displayTo'].forEach(id => document.getElementById(id).classList.remove('open'));
}

function renderChips() {
  const container = document.getElementById('chipsContainer');
  if (!playerChips.length) {
    container.innerHTML = '<span class="chips-empty" id="chipsEmpty">Añade al menos un jugador</span>';
    return;
  }
  container.innerHTML = playerChips.map((name, i) => `
    <div class="chip"><span>${name}</span>
      <button class="chip-x" onclick="removeChip(${i})">×</button>
    </div>`).join('');
}

function addChip() {
  const inp = document.getElementById('playerInput');
  const val = inp.value.trim();
  if (!val || playerChips.includes(val)) { inp.value = ''; return; }
  playerChips.push(val);
  inp.value = '';
  renderChips();
}

function removeChip(i) {
  playerChips.splice(i, 1);
  renderChips();
}

function renderMainGames() {
  document.getElementById('gamesGrid').innerHTML = GAMES.map(g => `
    <div class="game-card">
      <div class="game-thumb ${g.css}">${g.icon}</div>
      <div class="game-info">
        <div class="game-name">${g.name}</div>
        <div class="game-type">${g.type} · ${g.players}</div>
      </div>
    </div>`).join('');
}

function renderModalGames() {
  document.getElementById('modalGames').innerHTML = GAMES.map(g => `
    <div class="mgame" data-id="${g.id}" onclick="selGameFn('${g.id}')">
      <div class="mgame-thumb ${g.css}">${g.icon}</div>
      <div class="mgame-label">${g.name}</div>
    </div>`).join('');
}

function selGameFn(id) {
  selGame = id;
  customMode = false;
  document.getElementById('customDiv').style.display = 'none';
  document.getElementById('toggleCustom').textContent = '+ Evento personalizado';
  document.querySelectorAll('.mgame').forEach(el => el.classList.toggle('sel', el.dataset.id === id));
}

function renderCalendar() {
  document.getElementById('monthLabel').textContent = `${MONTHS_ES[curMonth]} ${curYear}`;
  const today    = new Date();
  const todayStr = fmtDate(today.getFullYear(), today.getMonth(), today.getDate());
  const firstDow = new Date(curYear, curMonth, 1).getDay();
  const offset   = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMo = new Date(curYear, curMonth + 1, 0).getDate();

  let html = '';
  for (let i = 0; i < offset; i++) html += '<div class="cal-day empty"></div>';

  for (let d = 1; d <= daysInMo; d++) {
    const ds      = fmtDate(curYear, curMonth, d);
    const isToday = ds === todayStr;
    const isPast  = new Date(curYear, curMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const evs     = allEvents[ds] || [];
    const cls     = 'cal-day' + (isToday ? ' today' : '') + (isPast ? ' past' : '') + (evs.length ? ' has-events' : '');
    const click   = !isPast ? `onclick="openModal('${ds}')"` : '';

    const pills = evs.slice(0, 2).map(e => {
      const players = (e.players || [e.playerName]).slice(0, 2).join(', ');
      return `<div class="day-pill"
        onmouseenter="startTooltip(event,'${ds}','${e._key}')"
        onmouseleave="hideTooltip()"
        onclick="event.stopPropagation(); openModal('${ds}')"
      >${e.gameIcon || '📌'} ${players}</div>`;
    }).join('');

    html += `<div class="${cls}" ${click}>
      <div class="dnum">${d}</div>
      <div class="day-pills">${pills}</div>
    </div>`;
  }
  document.getElementById('calDays').innerHTML = html;
}

let _tipTimer = null;
const tooltip = document.getElementById('evTooltip');

function startTooltip(evt, ds, key) {
  clearTimeout(_tipTimer);
  _tipTimer = setTimeout(() => showTip(evt, ds, key), 900);
}

function showTip(evt, ds, key) {
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

function resetModal() {
  playerChips = [];
  renderChips();
  selGame = null;
  customMode = false;
  editingKey = null;
  document.getElementById('playerInput').value  = '';
  document.getElementById('customText').value   = '';
  document.getElementById('customDiv').style.display   = 'none';
  document.getElementById('toggleCustom').textContent = '+ Evento personalizado';
  timeState.from = { h:18, m:0 };
  timeState.to   = { h:21, m:0 };
  document.getElementById('labelFrom').textContent = '18:00';
  document.getElementById('labelTo').textContent   = '21:00';
  renderModalGames();
}

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
      timeState.from = { h:fh, m: MINUTES_OPTS.includes(fm) ? fm : 0 };
      timeState.to   = { h:th, m: MINUTES_OPTS.includes(tm) ? tm : 0 };
      document.getElementById('labelFrom').textContent = ev.timeFrom || '18:00';
      document.getElementById('labelTo').textContent   = ev.timeTo   || '21:00';

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

  document.getElementById('overlay').classList.add('open');
  setTimeout(() => document.getElementById('playerInput').focus(), 100);
}

function closeModal() {
  document.getElementById('overlay').classList.remove('open');
  closeTimePickers();
}

function toggleCustomMode() {
  customMode = !customMode;
  document.getElementById('customDiv').style.display = customMode ? 'block' : 'none';
  document.getElementById('toggleCustom').textContent = customMode ? '← Elegir juego' : '+ Evento personalizado';
  if (customMode) {
    selGame = null;
    document.querySelectorAll('.mgame').forEach(el => el.classList.remove('sel'));
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}
