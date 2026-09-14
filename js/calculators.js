// Ketel — calculateurs.html (IMC, protéines, calories)
(function(){
  const store = loadStore();
  const p = store.profile;
  const goalMap = {force:'muscle', poids:'perte', endurance:'endurance', reeduc:'maintien'};

  let gender = p.gender || 'homme';
  const weightIn = document.getElementById('weightIn');
  const heightIn = document.getElementById('heightIn');
  const ageIn = document.getElementById('ageIn');
  const activityIn = document.getElementById('activityIn');
  const goalIn = document.getElementById('goalIn');

  weightIn.value = p.weightKg || '';
  heightIn.value = p.heightCm || '';
  ageIn.value = p.age || '';
  activityIn.value = p.activity || 'modere';
  goalIn.value = p.calcGoal || goalMap[p.goal] || 'maintien';

  function renderGender(){
    document.getElementById('genderControls').innerHTML = ['femme','homme'].map(g=>
      `<button type="button" class="seg ${gender===g?'active':''}" data-g="${g}">${g==='femme'?'Femme':'Homme'}</button>`
    ).join('');
    document.querySelectorAll('.seg').forEach(s=>s.addEventListener('click',()=>{
      gender = s.dataset.g; renderGender(); persistAndRender();
    }));
  }

  const ACTIVITY_FACTORS = {
    sedentaire:1.2, leger:1.375, modere:1.55, actif:1.725, tresActif:1.9
  };
  const ACTIVITY_LABELS = {
    sedentaire:'sédentaire', leger:'légèrement actif', modere:'modérément actif',
    actif:'très actif', tresActif:'extrêmement actif'
  };
  const PROTEIN_RANGES = {
    perte:     {min:1.8, max:2.2, note:'Objectif perte de poids : viser haut pour préserver la masse musculaire en déficit.'},
    maintien:  {min:1.2, max:1.6, note:'Maintien du poids et de la masse musculaire actuelle.'},
    muscle:    {min:1.6, max:2.2, note:'Prise de muscle : apport élevé pour soutenir la construction musculaire.'},
    endurance: {min:1.2, max:1.6, note:'Endurance : privilégier aussi les glucides pour l\'énergie.'}
  };
  const GOAL_CAL_ADJUST = {
    perte: -0.20, maintien: 0, muscle: 0.10, endurance: 0
  };
  const GOAL_LABELS = {perte:'perte de poids', maintien:'maintien', muscle:'prise de muscle', endurance:'endurance'};

  function imcClass(imc){
    if(imc < 18.5) return {label:'Insuffisance pondérale', color:'var(--steel)'};
    if(imc < 25) return {label:'Corpulence normale', color:'var(--sage)'};
    if(imc < 30) return {label:'Surpoids', color:'var(--brass)'};
    if(imc < 35) return {label:'Obésité modérée', color:'var(--rust)'};
    return {label:'Obésité sévère', color:'var(--danger)'};
  }

  function persistAndRender(){
    const weightKg = parseFloat(weightIn.value) || null;
    const heightCm = parseFloat(heightIn.value) || null;
    const age = parseInt(ageIn.value, 10) || null;
    const activity = activityIn.value;
    const calcGoal = goalIn.value;

    updateProfile({gender, weightKg, heightCm, age, activity, calcGoal});

    // IMC
    const imcEl = document.getElementById('imcResult');
    if(weightKg && heightCm){
      const imc = weightKg / Math.pow(heightCm/100, 2);
      const cls = imcClass(imc);
      imcEl.innerHTML = `
        <div class="result-card">
          <b style="color:${cls.color}">${imc.toFixed(1)}</b>
          <span class="badge" style="background:${cls.color};color:#14171a;">${cls.label}</span>
          <span>Indice de masse corporelle — un repère général, pas un diagnostic (il ne distingue pas masse grasse et masse musculaire).</span>
        </div>`;
    } else {
      imcEl.innerHTML = `<div class="empty-note">Renseigne ton poids et ta taille ci-dessus.</div>`;
    }

    // Protéines
    const protEl = document.getElementById('proteinResult');
    if(weightKg){
      const range = PROTEIN_RANGES[calcGoal];
      const lo = Math.round(weightKg*range.min);
      const hi = Math.round(weightKg*range.max);
      protEl.innerHTML = `
        <div class="result-card">
          <b>${lo} – ${hi} g / jour</b>
          <span>${range.note}</span>
        </div>`;
    } else {
      protEl.innerHTML = `<div class="empty-note">Renseigne ton poids ci-dessus.</div>`;
    }

    // Calories
    const calEl = document.getElementById('calResult');
    if(weightKg && heightCm && age){
      const base = 10*weightKg + 6.25*heightCm - 5*age;
      const bmr = gender==='homme' ? base+5 : base-161;
      const tdee = bmr * ACTIVITY_FACTORS[activity];
      const target = tdee * (1 + GOAL_CAL_ADJUST[calcGoal]);
      calEl.innerHTML = `
        <div class="result-card">
          <b>${Math.round(target)} kcal / jour</b>
          <span>Objectif ${GOAL_LABELS[calcGoal]} — profil ${ACTIVITY_LABELS[activity]}.</span>
          <span style="margin-top:8px;">Métabolisme de base : ${Math.round(bmr)} kcal · Dépense totale (TDEE) : ${Math.round(tdee)} kcal.</span>
        </div>`;
    } else {
      calEl.innerHTML = `<div class="empty-note">Renseigne poids, taille et âge ci-dessus.</div>`;
    }
  }

  [weightIn, heightIn, ageIn, activityIn, goalIn].forEach(el=> el.addEventListener('input', persistAndRender));
  renderGender();
  persistAndRender();
})();
