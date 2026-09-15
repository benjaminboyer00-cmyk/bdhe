// Ketel — bibliotheque.html (bibliothèque d'exercices)
(function(){
  let activeMuscle = 'tous';
  let activeEquip = 'tous';

  const muscleFilters = [{key:'tous', label:'Tous'}].concat(
    Object.entries(MUSCLE_GROUPS).map(([key,m])=>({key, label:m.label}))
  );
  const equipValues = [...new Set(EXERCISE_LIBRARY.map(e=>e.equipment))];
  const equipFilters = [{key:'tous', label:'Tout matériel'}].concat(
    equipValues.map(key=>({key, label:EQUIPMENT_LABELS[key] || key}))
  );

  function renderFilters(){
    document.getElementById('muscleRow').innerHTML = muscleFilters.map(f=>
      `<button type="button" class="filter-chip ${activeMuscle===f.key?'active':''}" data-k="${f.key}">${f.label}</button>`
    ).join('');
    document.querySelectorAll('#muscleRow .filter-chip').forEach(chip=>{
      chip.addEventListener('click', ()=>{ activeMuscle = chip.dataset.k; renderFilters(); renderList(); });
    });

    document.getElementById('equipRow').innerHTML = equipFilters.map(f=>
      `<button type="button" class="filter-chip ${activeEquip===f.key?'active':''}" data-k="${f.key}">${f.label}</button>`
    ).join('');
    document.querySelectorAll('#equipRow .filter-chip').forEach(chip=>{
      chip.addEventListener('click', ()=>{ activeEquip = chip.dataset.k; renderFilters(); renderList(); });
    });
  }

  function cardHtml(ex){
    return `
      <div class="lib-card">
        <div class="lib-card-top" data-toggle>
          <div>
            <div class="lib-name">${ex.name}</div>
            <div class="lib-tags">
              <span class="lib-tag" style="color:${PATTERNS[ex.pattern].color}">${PATTERNS[ex.pattern].label}</span>
              <span class="lib-tag">${EQUIPMENT_LABELS[ex.equipment] || ex.equipment}</span>
              <span class="lib-tag">${LEVELS[ex.level] || ex.level}</span>
            </div>
          </div>
        </div>
        <div class="lib-body">
          <div><b>Technique.</b> ${ex.cue}</div>
          <div style="margin-top:8px;"><b>Pourquoi cet exercice ?</b> ${ex.why}</div>
          ${ex.source ? `<span class="ex-source">Source : ${ex.source}</span>` : ''}
        </div>
      </div>`;
  }

  function renderList(){
    const list = EXERCISE_LIBRARY.filter(e =>
      (activeMuscle==='tous' || e.muscle===activeMuscle) &&
      (activeEquip==='tous' || e.equipment===activeEquip)
    );

    let html;
    if(!list.length){
      html = `<div class="empty-note">Aucun exercice ne correspond à ces filtres.</div>`;
    } else if(activeMuscle==='tous'){
      html = Object.entries(MUSCLE_GROUPS).map(([key, m])=>{
        const items = list.filter(e=>e.muscle===key);
        if(!items.length) return '';
        return `<div class="lib-group-title">${m.label}</div>${items.map(cardHtml).join('')}`;
      }).join('');
    } else {
      html = list.map(cardHtml).join('');
    }
    document.getElementById('libList').innerHTML = html;

    document.querySelectorAll('[data-toggle]').forEach(top=>{
      top.addEventListener('click', ()=>{
        const body = top.parentElement.querySelector('.lib-body');
        body.classList.toggle('open');
      });
    });
  }

  renderFilters();
  renderList();
})();
