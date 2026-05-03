// Session ID para permisos de edición sin login
let MY_SID = localStorage.getItem('gp_sid');
if (!MY_SID) {
  MY_SID = 'sid_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  localStorage.setItem('gp_sid', MY_SID);
}

// Application State
let curYear  = new Date().getFullYear();
let curMonth = new Date().getMonth();
let selDay   = null;
let selGame  = null;
let allEvents   = {};
let customMode  = false;
let editingKey  = null;
let playerChips = [];
let timeState   = { from:{h:18,m:0}, to:{h:21,m:0} };

