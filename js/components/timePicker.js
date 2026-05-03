function initTimeInputs() {
  // Set initial values
  document.getElementById('inputFromH').value = pad(timeState.from.h);
  document.getElementById('inputFromM').value = pad(timeState.from.m);
  document.getElementById('inputToH').value = pad(timeState.to.h);
  document.getElementById('inputToM').value = pad(timeState.to.m);

  // Add event listeners for real-time updates
  document.getElementById('inputFromH').addEventListener('input', (e) => {
    timeState.from.h = parseInt(e.target.value) || 0;
  });
  document.getElementById('inputFromM').addEventListener('input', (e) => {
    timeState.from.m = parseInt(e.target.value) || 0;
  });
  document.getElementById('inputToH').addEventListener('input', (e) => {
    timeState.to.h = parseInt(e.target.value) || 0;
  });
  document.getElementById('inputToM').addEventListener('input', (e) => {
    timeState.to.m = parseInt(e.target.value) || 0;
  });
}

function resetTimeState() {
  timeState.from = { h:18, m:0 };
  timeState.to   = { h:21, m:0 };
  initTimeInputs();
}

// Legacy functions (no longer used, but kept for compatibility)
function buildPicker(which) {}
function toggleTimePicker(which) {}
function confirmTime(which) {}
function closeTimePickers() {}
