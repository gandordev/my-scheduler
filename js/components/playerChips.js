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
  if (!val || playerChips.includes(val)) {
    inp.value = '';
    return;
  }
  playerChips.push(val);
  inp.value = '';
  renderChips();
}

function removeChip(i) {
  playerChips.splice(i, 1);
  renderChips();
}

function resetChips() {
  playerChips = [];
  document.getElementById('playerInput').value = '';
  renderChips();
}
