function pad(n) { return String(n).padStart(2, '0'); }

function fmtDate(y, m, d) {
  return `${y}-${pad(m+1)}-${pad(d)}`;
}

function fmtTime(h, m) {
  return `${pad(h)}:${pad(m)}`;
}

function getTodayStr() {
  const today = new Date();
  return fmtDate(today.getFullYear(), today.getMonth(), today.getDate());
}

function getMonthDays(year, month) {
  const firstDow = new Date(year, month, 1).getDay();
  const offset   = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMo = new Date(year, month + 1, 0).getDate();
  return { offset, daysInMo };
}

function isPastDate(year, month, day) {
  const today = new Date();
  return new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
}
