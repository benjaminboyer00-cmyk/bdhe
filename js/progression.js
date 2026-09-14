// Ketel — progression.html
(function(){
  const store = loadStore();
  const history = store.history;

  const cutoff = daysAgo(6);
  const recent = history.filter(h => new Date(h.date) >= cutoff);
  const totalMinutes = history.reduce((s,h)=> s + fmtMinutes(h.durationSec), 0);

  const daySet = new Set(history.map(h=>{ const d=new Date(h.date); d.setHours(0,0,0,0); return d.getTime(); }));
  let streak = 0;
  for(let i=0;i<365;i++){ if(daySet.has(daysAgo(i).getTime())) streak++; else break; }

  document.getElementById('statRow').innerHTML = `
    <div class="stat"><b>${history.length}</b><span>séances totales</span></div>
    <div class="stat"><b>${totalMinutes}</b><span>minutes totales</span></div>
    <div class="stat"><b>${streak}</b><span>jour${streak>1?'s':''} de suite</span></div>
  `;

  // Sparkline: minutes per day, last 7 days
  const dayLabels = ['D','L','M','M','J','V','S'];
  const bars = [];
  for(let i=6;i>=0;i--){
    const day = daysAgo(i);
    const mins = history
      .filter(h=>{ const d = new Date(h.date); return isSameDay(d, day); })
      .reduce((s,h)=> s + fmtMinutes(h.durationSec), 0);
    bars.push({label: dayLabels[day.getDay()], mins});
  }
  const maxMin = Math.max(10, ...bars.map(b=>b.mins));
  document.getElementById('sparkWrap').innerHTML = `
    <div class="spark">${bars.map(b=>`<i class="${b.mins>0?'has':''}" style="height:${Math.max(3, Math.round((b.mins/maxMin)*70))}px" title="${b.mins} min"></i>`).join('')}</div>
    <div class="spark-labels">${bars.map(b=>`<span>${b.label}</span>`).join('')}</div>
  `;

  const listEl = document.getElementById('histList');
  if(history.length===0){
    listEl.innerHTML = `<div class="empty-note">Aucune séance enregistrée pour l'instant.<br>Lance un programme pour commencer à suivre ta progression.</div>`;
    return;
  }
  listEl.innerHTML = history.slice(0,50).map(h=>`
    <div class="hist-item">
      <div>
        <div class="h-name">${h.programTitle} — ${h.sessionName}</div>
        <div class="h-date">${fmtDateFr(h.date)} · ${h.exercisesCompleted}/${h.exercisesTotal} exercices</div>
      </div>
      <div class="h-time">${fmtClock(h.durationSec)}</div>
    </div>
  `).join('');
})();
