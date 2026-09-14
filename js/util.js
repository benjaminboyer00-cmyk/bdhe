// Ketel — shared formatting helpers
function fmtClock(totalSeconds){
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s/60);
  const r = s%60;
  return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`;
}
function fmtMinutes(totalSeconds){
  return Math.round(totalSeconds/60);
}
function fmtDateFr(iso){
  const d = new Date(iso);
  const days = ['dim','lun','mar','mer','jeu','ven','sam'];
  const months = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} · ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
function isSameDay(a,b){
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}
function daysAgo(n){
  const d = new Date();
  d.setDate(d.getDate()-n);
  d.setHours(0,0,0,0);
  return d;
}
function qs(name){
  return new URLSearchParams(location.search).get(name);
}
