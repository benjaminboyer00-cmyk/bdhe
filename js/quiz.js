// Ketel — questionnaire.html (QCM adaptatif)
(function(){
  const QUESTIONS = [
    {
      key:'goal', q:'Quel est ton objectif principal ?',
      options:[
        {v:'force', label:'Prendre de la force', sub:'Construire du muscle et de la puissance'},
        {v:'poids', label:'Perdre du poids', sub:'Circuits à haute dépense calorique'},
        {v:'endurance', label:'Améliorer mon endurance', sub:'Souffle, cardio, tenir la distance'},
        {v:'reeduc', label:'Rééducation / douleur', sub:'Renforcement doux, en douceur'}
      ]
    },
    {
      key:'painArea', q:'As-tu une douleur ou une zone à ménager en ce moment ?',
      options:[
        {v:'aucune', label:'Aucune', sub:''},
        {v:'dos', label:'Dos / lombaires', sub:''},
        {v:'genou', label:'Genou', sub:''},
        {v:'epaule', label:'Épaule', sub:''}
      ]
    },
    {
      key:'level', q:'Quel est ton niveau ?',
      options:[
        {v:'debutant', label:'Débutant', sub:'Peu ou pas d\'expérience en musculation'},
        {v:'intermediaire', label:'Intermédiaire', sub:'Je pratique régulièrement depuis un moment'},
        {v:'avance', label:'Avancé', sub:'Pratique soutenue depuis plusieurs années'}
      ]
    },
    {
      key:'equipment', q:'Quel matériel as-tu à disposition ?',
      options:[
        {v:'kettlebell', label:'Kettlebell', sub:''},
        {v:'aucun', label:'Aucun matériel', sub:'Poids du corps uniquement'},
        {v:'salle', label:'Salle de sport', sub:'Barres, haltères, machines'},
        {v:'les deux', label:'Kettlebell ou poids du corps', sub:''}
      ]
    },
    {
      key:'sessionsPerWeek', q:'Combien de séances par semaine peux-tu tenir ?',
      options:[
        {v:2, label:'2 séances'}, {v:3, label:'3 séances'}, {v:4, label:'4 séances ou plus'}
      ]
    },
    {
      key:'sessionDuration', q:'Combien de temps par séance ?',
      options:[
        {v:20, label:'15 – 20 minutes'}, {v:30, label:'25 – 30 minutes'}, {v:40, label:'35 minutes ou plus'}
      ]
    }
  ];

  const store = loadStore();
  let qIndex = 0;
  const answers = {};

  function avgOfNumbers(str){
    const nums = (str.match(/\d+/g)||[]).map(Number);
    return nums.length ? nums.reduce((a,b)=>a+b,0)/nums.length : null;
  }

  function scoreProgram(p){
    let score = 0;
    if(answers.painArea==='dos' && p.id==='reeduc-dos') score += 100;
    if(answers.painArea==='genou' && p.id==='reeduc-genou') score += 100;
    if(answers.painArea==='epaule' && p.id==='reeduc-epaule') score += 100;
    if(p.category === answers.goal) score += 40;
    const equipMatch = p.equipment===answers.equipment
      || (answers.equipment==='les deux' && (p.equipment==='kettlebell' || p.equipment==='aucun'))
      || p.equipment==='les deux';
    if(equipMatch) score += 15;
    if(p.level==='tous' || p.level===answers.level) score += 10;
    // Petits bonus de rapprochement pour départager les programmes à égalité sur l'objectif.
    const progFreq = avgOfNumbers(p.freq);
    if(progFreq!=null && answers.sessionsPerWeek) score += Math.max(0, 8 - Math.abs(progFreq - answers.sessionsPerWeek)*4);
    const progDuration = avgOfNumbers(p.duration);
    if(progDuration!=null && answers.sessionDuration) score += Math.max(0, 8 - Math.abs(progDuration - answers.sessionDuration)/5);
    return score;
  }

  function renderQuestion(){
    const step = QUESTIONS[qIndex];
    document.getElementById('quizRoot').innerHTML = `
      <div class="quiz-progress"><i style="width:${Math.round((qIndex/QUESTIONS.length)*100)}%"></i></div>
      <div class="quiz-q">${step.q}</div>
      <div id="optList"></div>
      ${qIndex>0 ? '<div class="reset-link" id="backLink">Question précédente</div>' : ''}
    `;
    document.getElementById('optList').innerHTML = step.options.map(o=>
      `<button class="quiz-opt" data-v="${o.v}">${o.label}${o.sub?`<small>${o.sub}</small>`:''}</button>`
    ).join('');
    document.querySelectorAll('.quiz-opt').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const raw = btn.dataset.v;
        const num = Number(raw);
        answers[step.key] = (String(num)===raw) ? num : raw;
        if(qIndex < QUESTIONS.length-1){ qIndex++; renderQuestion(); }
        else { renderResult(); }
      });
    });
    const back = document.getElementById('backLink');
    if(back) back.addEventListener('click', ()=>{ qIndex--; renderQuestion(); });
  }

  function renderResult(){
    let best = PROGRAMS[0], bestScore = -1;
    PROGRAMS.forEach(p=>{
      const s = scoreProgram(p);
      if(s > bestScore){ bestScore = s; best = p; }
    });

    updateProfile({
      goal: answers.goal, painArea: answers.painArea, level: answers.level,
      equipment: answers.equipment, sessionsPerWeek: answers.sessionsPerWeek,
      sessionDuration: answers.sessionDuration, recommendedProgramId: best.id, quizDone:true
    });

    const painNote = answers.painArea !== 'aucune'
      ? `<div class="acc-body" style="background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:12px 14px;margin-bottom:14px;">
          <b style="color:var(--chalk);">À propos de ta douleur (${answers.painArea})</b><br>
          Ces programmes sont un renforcement général, pas un traitement médical. Si la douleur persiste ou s'aggrave, consulte un professionnel de santé avant de continuer.
        </div>`
      : '';

    document.getElementById('quizRoot').innerHTML = `
      <div class="quiz-progress"><i style="width:100%"></i></div>
      <div class="sec-title">Ton programme</div>
      <a href="programme.html?id=${best.id}" class="prog-card">
        <div class="prog-top">
          <div>
            <div class="prog-cat" style="color:${best.color}">${CATEGORIES[best.category].label}</div>
            <div class="prog-title">${best.title}</div>
          </div>
          <span class="reco-flag">Pour toi</span>
        </div>
        <div class="prog-desc">${best.tagline}</div>
        <div class="prog-meta"><span>${best.duration}</span><span>${best.freq}</span><span>${LEVELS[best.level]}</span></div>
      </a>
      ${painNote}
      <a href="programme.html?id=${best.id}" class="btn btn-primary" style="margin-bottom:10px;">Voir ce programme</a>
      <a href="programmes.html" class="btn btn-ghost">Explorer tous les programmes</a>
    `;
  }

  renderQuestion();
})();
