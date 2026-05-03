const GAMES = [
  { id:'minecraft',  name:'Minecraft',    type:'Aventura · Sandbox', players:'Multijugador', icon:'⛏️', css:'t-mc'  },
  { id:'fortnite',   name:'Fortnite',     type:'Battle Royale',      players:'Multijugador', icon:'🎯', css:'t-fn'  },
  { id:'awayout',    name:'A Way Out',    type:'Cooperativo',        players:'2 jugadores',  icon:'🚪', css:'t-awo' },
  { id:'ittakestwo', name:'It Takes Two', type:'Cooperativo',        players:'2 jugadores', icon:'🤝', css:'t-itt' },
];

const MONTHS_ES    = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MONTHS_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const MINUTES_OPTS = [0, 15, 30, 45];

const gameMap = {};
GAMES.forEach(g => { gameMap[g.id] = g; });
