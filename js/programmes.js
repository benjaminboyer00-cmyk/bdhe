// Ketel — programmes.html
(function(){
  const store = loadStore();
  const recoId = store.profile.recommendedProgramId;
  let activeCategory = 'tous';
  let activeEquipment = 'tous';

  const categoryFilters = [{key:'tous', label:'Tous'}].concat(
    Object.entries(CATEGORIES).map(([key,c])=>({key, label:c.label}))
  );
  const equipmentValues = [...new Set(PROGRAMS.map(p=>p.equipment))];
  const equipmentFilters = [{key:'tous', label:'Tout matériel'}].concat(
    equipmentValues.map(key=>({key, label:EQUIPMENT_LABELS[key] || key}))
  );

  function renderFilters(){
    document.getElementById('filterRow').innerHTML = categoryFilters.map(f=>
      `<button type="button" class="filter-chip ${activeCategory===f.key?'active':''}" data-k="${f.key}">${f.label}</button>`
    ).join('');
    document.querySelectorAll('#filterRow .filter-chip').forEach(chip=>{
      chip.addEventListener('click', ()=>{ activeCategory = chip.dataset.k; renderFilters(); renderList(); });
    });

    document.getElementById('equipmentRow').innerHTML = equipmentFilters.map(f=>
      `<button type="button" class="filter-chip ${activeEquipment===f.key?'active':''}" data-k="${f.key}">${f.label}</button>`
    ).join('');
    document.querySelectorAll('#equipmentRow .filter-chip').forEach(chip=>{
      chip.addEventListener('click', ()=>{ activeEquipment = chip.dataset.k; renderFilters(); renderList(); });
    });
  }

  function renderList(){
    const list = PROGRAMS.filter(p =>
      (activeCategory==='tous' || p.category===activeCategory) &&
      (activeEquipment==='tous' || p.equipment===activeEquipment)
    );
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
          <span>${EQUIPMENT_LABELS[p.equipment] || p.equipment}</span>
        </div>
      </a>
    `).join('') || `<div class="empty-note">Aucun programme ne correspond à ces filtres.</div>`;
  }

  renderFilters();
  renderList();
})();
