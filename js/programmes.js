// Ketel — programmes.html
(function(){
  const store = loadStore();
  const recoId = store.profile.recommendedProgramId;
  let activeFilter = 'tous';

  const filters = [{key:'tous', label:'Tous'}].concat(
    Object.entries(CATEGORIES).map(([key,c])=>({key, label:c.label}))
  );

  function renderFilters(){
    document.getElementById('filterRow').innerHTML = filters.map(f=>
      `<button type="button" class="filter-chip ${activeFilter===f.key?'active':''}" data-k="${f.key}">${f.label}</button>`
    ).join('');
    document.querySelectorAll('.filter-chip').forEach(chip=>{
      chip.addEventListener('click', ()=>{ activeFilter = chip.dataset.k; renderFilters(); renderList(); });
    });
  }

  function renderList(){
    const list = PROGRAMS.filter(p => activeFilter==='tous' || p.category===activeFilter);
    document.getElementById('progList').innerHTML = list.map(p=>`
      <a href="programme.html?id=${p.id}" class="prog-card">
        <div class="prog-top">
          <div>
            <div class="prog-cat" style="color:${p.color}">${CATEGORIES[p.category].label}</div>
            <div class="prog-title">${p.title}</div>
          </div>
          ${p.id===recoId?'<span class="reco-flag">Pour toi</span>':''}
        </div>
        <div class="prog-desc">${p.tagline}</div>
        <div class="prog-meta">
          <span>${p.duration}</span><span>${p.freq}</span><span>${LEVELS[p.level]}</span>
          <span>${p.equipment==='aucun'?'Sans matériel':p.equipment==='kettlebell'?'Kettlebell':'Kettlebell ou sans matériel'}</span>
        </div>
      </a>
    `).join('') || `<div class="empty-note">Aucun programme dans cette catégorie pour l'instant.</div>`;
  }

  renderFilters();
  renderList();
})();
