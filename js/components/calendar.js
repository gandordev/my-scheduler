function renderCalendar() {
  document.getElementById('monthLabel').textContent = `${MONTHS_ES[curMonth]} ${curYear}`;
  const todayStr = getTodayStr();
  const { offset, daysInMo } = getMonthDays(curYear, curMonth);

  let html = '';
  for (let i = 0; i < offset; i++) html += '<div class="cal-day empty"></div>';

  for (let d = 1; d <= daysInMo; d++) {
    const ds      = fmtDate(curYear, curMonth, d);
    const isToday = ds === todayStr;
    const isPast  = isPastDate(curYear, curMonth, d);
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

function navToPrevMonth() {
  if (curMonth === 0) { curMonth = 11; curYear--; } else { curMonth--; }
  renderCalendar();
}

function navToNextMonth() {
  if (curMonth === 11) { curMonth = 0; curYear++; } else { curMonth++; }
  renderCalendar();
}
