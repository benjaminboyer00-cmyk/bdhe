// Ketel — programme.html (detail)
(function(){
  const id = qs('id');
  const prog = getProgram(id);
  if(!prog){
    document.querySelector('.wrap').innerHTML = `<div class="empty-note">Programme introuvable. <a href="programmes.html" style="color:var(--brass);">Retour aux programmes</a></div>`;
    return;
  }
  const store = loadStore();

  document.title = `Ketel · ${prog.title}`;
  document.getElementById('progCat').textContent = CATEGORIES[prog.category].label;
  document.getElementById('progCat').style.color = prog.color;
  document.getElementById('progTitle').textContent = prog.title;
  document.getElementById('progDesc').textContent = prog.description;
  document.getElementById('progStats').innerHTML = `
    <div class="stat"><b>${prog.duration}</b><span>par séance</span></div>
    <div class="stat"><b>${prog.freq}</b><span>fréquence</span></div>
    <div class="stat"><b>${LEVELS[prog.level]}</b><span>niveau</span></div>
  `;

  // Kettlebell picker, shown only for programs using a bell
  if(prog.equipment==='kettlebell' || prog.equipment==='les deux'){
    document.getElementById('bellPickerWrap').innerHTML = `
      <details>
        <summary>Choisir son bell</summary>
        <div class="acc-body">
          <div class="bell-controls" id="genderControls"></div>
          <select id="levelSelect">
            <option value="beginner">Débutant — nouveau à la musculation</option>
            <option value="intermediate">Intermédiaire — a déjà pratiqué la force</option>
            <option value="advanced">Avancé — pratique le kettlebell depuis un moment</option>
          </select>
          <div class="bell-result">
            <b id="bellRange">–</b>
            <span>Si les 2 dernières reps se dégradent, c'est trop lourd. Si la série finit sans essoufflement, c'est trop léger.</span>
          </div>
        </div>
      </details>`;
    const bellLevelMap = {debutant:'beginner', intermediaire:'intermediate', avance:'advanced', tous:'beginner'};
    let gender = store.profile.gender || 'homme';
    const levelSelect = document.getElementById('levelSelect');
    levelSelect.value = bellLevelMap[store.profile.level] || 'beginner';
    function renderGender(){
      document.getElementById('genderControls').innerHTML = ['femme','homme'].map(g=>
        `<button type="button" class="seg ${gender===g?'active':''}" data-g="${g}">${g==='femme'?'Femme':'Homme'}</button>`
      ).join('');
      document.querySelectorAll('.seg').forEach(s=>s.addEventListener('click',()=>{
        gender = s.dataset.g; updateProfile({gender}); renderGender(); updateBell();
      }));
    }
    function updateBell(){
      document.getElementById('bellRange').textContent = BELL_TABLE[levelSelect.value][gender];
    }
    levelSelect.addEventListener('change', updateBell);
    renderGender(); updateBell();
  }

  document.getElementById('sessionList').innerHTML = prog.sessions.map((session, i)=>{
    const dur = Math.round(sessionDurationSec(session)/60);
    const exRows = session.exercises.map(ex=>`
      <div class="ex-card">
        <div class="ex-icon">${exerciseFigureSvg(ex.name, PATTERNS[ex.pattern].color) || patternIcon(ex.pattern, PATTERNS[ex.pattern].color)}</div>
        <div class="ex-body">
          <div class="ex-name">${ex.name}</div>
          <div class="ex-sub">${ex.mode==='time' ? (ex.reps ? ex.reps+' · '+ex.seconds+'s' : ex.seconds+'s') : ex.reps} — repos ${ex.rest}s</div>
          ${ex.cue ? `<div class="ex-cue">${ex.cue}</div>` : ''}
        </div>
      </div>
    `).join('');
    return `
      <details ${i===0?'open':''}>
        <summary>${session.name} <span style="font-weight:400;color:var(--chalk-dim);font-size:12px;">~${dur} min${session.rounds>1?' · '+session.rounds+' rounds':''}</span></summary>
        <div class="acc-body">
          <div class="mode-meta">${session.meta}</div>
          ${exRows}
          <a href="seance.html?id=${prog.id}&s=${i}" class="btn btn-primary" style="margin-top:10px;">Démarrer cette séance</a>
        </div>
      </details>`;
  }).join('');
})();
