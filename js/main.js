function initApp() {
  // Render initial components
  renderMainGames();
  renderModalGames();
  initTimeInputs();
  listenToEvents();

  // Player chips events
  document.getElementById('addPlayerBtn').onclick = addChip;
  document.getElementById('playerInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addChip(); }
  });

  // Calendar navigation
  document.getElementById('prevMonth').onclick = navToPrevMonth;
  document.getElementById('nextMonth').onclick = navToNextMonth;

  // Modal events
  document.getElementById('modalClose').onclick = closeModal;
  document.getElementById('overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('overlay')) closeModal();
  });

  // Form submission
  document.getElementById('submitBtn').onclick = submitEvent;
  document.getElementById('updateBtn').onclick = updateEvent;
  document.getElementById('deleteBtn').onclick = () => { if (editingKey) deleteEvent(selDay, editingKey); };

  // Custom event toggle
  document.getElementById('toggleCustom').onclick = toggleCustomMode;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
