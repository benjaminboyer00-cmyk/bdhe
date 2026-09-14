// Ketel — dashboard (index.html)
(function(){
  const store = loadStore();

  // Stats: séances et minutes sur 7 jours, série en cours
  const cutoff = daysAgo(6); // includes today -> 7 day window
  const recent = store.history.filter(h => new Date(h.date) >= cutoff);
  const minutes = recent.reduce((sum,h)=> sum + fmtMinutes(h.durationSec), 0);

  const daySet = new Set(store.history.map(h=>{
    const d = new Date(h.date); d.setHours(0,0,0,0); return d.getTime();
  }));
  let streak = 0;
  for(let i=0;i<365;i++){
    if(daySet.has(daysAgo(i).getTime())) streak++; else break;
  }

  document.getElementById('statRow').innerHTML = `
    <div class="stat"><b>${recent.length}</b><span>séances / 7j</span></div>
    <div class="stat"><b>${minutes}</b><span>minutes / 7j</span></div>
    <div class="stat"><b>${streak}</b><span>jour${streak>1?'s':''} de suite</span></div>
  `;

  // Active session banner
  const active = store.activeSession;
  const bannerEl = document.getElementById('sessionBanner');
  if(active){
    const prog = getProgram(active.programId);
    bannerEl.innerHTML = `
      <div class="session-banner">
        <div><b>${prog ? prog.title : 'Séance'}</b><span>Séance en cours — reprends où tu t'es arrêté.</span></div>
        <a href="seance.html?id=${active.programId}&s=${active.sessionIndex}" class="btn btn-primary" style="width:auto;padding:10px 16px;">Reprendre</a>
      </div>`;
  }

  // Quiz CTA or recommendation
  const ctaEl = document.getElementById('quizCta');
  if(!store.profile.quizDone){
    ctaEl.innerHTML = `
      <a href="questionnaire.html" class="prog-card" style="border-color:var(--brass);">
        <div class="prog-cat" style="color:var(--brass);">2 minutes</div>
        <div class="prog-title">Quel programme pour toi ?</div>
        <div class="prog-desc">Réponds à quelques questions (objectif, niveau, matériel, douleurs éventuelles) et Ketel te recommande un programme adapté.</div>
      </a>`;
  }

  // Featured programs: recommended first, then up to 2 more
  const previewEl = document.getElementById('progPreview');
  const recoId = store.profile.recommendedProgramId;
  let list = PROGRAMS.slice();
  if(recoId){
    list.sort((a,b)=> (a.id===recoId?-1:0) - (b.id===recoId?-1:0));
  }
  list = list.slice(0,3);
  previewEl.innerHTML = list.map(p=>`
    <a href="programme.html?id=${p.id}" class="prog-card">
      <div class="prog-top">
        <div>
          <div class="prog-cat" style="color:${p.color}">${CATEGORIES[p.category].label}</div>
          <div class="prog-title">${p.title}</div>
        </div>
        ${p.id===recoId?'<span class="reco-flag">Pour toi</span>':''}
      </div>
      <div class="prog-desc">${p.tagline}</div>
      <div class="prog-meta"><span>${p.duration}</span><span>${p.freq}</span><span>${LEVELS[p.level]}</span></div>
    </a>
  `).join('');
})();
