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

function toggleCustomMode() {
  customMode = !customMode;
  document.getElementById('customDiv').style.display = customMode ? 'block' : 'none';
  document.getElementById('toggleCustom').textContent = customMode ? '← Elegir juego' : '+ Evento personalizado';
  if (customMode) {
    selGame = null;
    document.querySelectorAll('.mgame').forEach(el => el.classList.remove('sel'));
  }
}

function resetGameSelection() {
  selGame = null;
  customMode = false;
  document.getElementById('playerInput').value  = '';
  document.getElementById('customText').value   = '';
  document.getElementById('customDiv').style.display   = 'none';
  document.getElementById('toggleCustom').textContent = '+ Evento personalizado';
  renderModalGames();
}
