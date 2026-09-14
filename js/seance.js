// Ketel — seance.html (runner with chrono)
(function(){
  const progId = qs('id');
  const sIndex = parseInt(qs('s') || '0', 10);
  const prog = getProgram(progId);
  const root = document.getElementById('runnerRoot');

  if(!prog || !prog.sessions[sIndex]){
    root.innerHTML = `<div class="empty-note">Séance introuvable. <a href="programmes.html" style="color:var(--brass);">Retour aux programmes</a></div>`;
    return;
  }
  const session = prog.sessions[sIndex];
  document.getElementById('progName').textContent = prog.title;
  document.getElementById('sessionName').textContent = session.name;

  // Build the flat list of steps
  const steps = [];
  for(let r=0; r<session.rounds; r++){
    session.exercises.forEach((ex, exIndex)=>{
      steps.push({type:'work', round:r, exIndex, exercise:ex});
      const isLastEx = (exIndex === session.exercises.length-1);
      const isLastRound = (r === session.rounds-1);
      if(ex.rest>0 && !(isLastEx && isLastRound)){
        const nextEx = isLastEx ? session.exercises[0] : session.exercises[exIndex+1];
        steps.push({type:'rest', seconds:ex.rest, round:r, nextLabel: isLastEx ? null : nextEx.name});
      }
    });
    if(r < session.rounds-1 && session.restBetweenRounds>0){
      steps.push({type:'roundrest', seconds:session.restBetweenRounds, round:r, nextLabel: session.exercises[0].name});
    }
  }

  let stepIndex = 0;
  let remaining = stepSeconds(steps[0]);
  let elapsedTotal = 0;
  let running = false;
  let intervalId = null;
  let finished = false;
  const completedExercises = new Set();

  function stepSeconds(step){
    if(step.type==='work') return step.exercise.mode==='time' ? step.exercise.seconds : null;
    return step.seconds;
  }

  function persist(){
    setActiveSession({programId:prog.id, sessionIndex:sIndex, stepIndex, elapsedTotal, startedAt:Date.now()});
  }

  function tick(){
    elapsedTotal++;
    if(remaining !== null){
      remaining--;
      if(remaining <= 0){
        advance();
        return;
      }
    }
    renderTime();
  }

  function startTimer(){
    if(intervalId) return;
    running = true;
    intervalId = setInterval(tick, 1000);
    render();
  }
  function pauseTimer(){
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    render();
  }

  function advance(){
    const cur = steps[stepIndex];
    if(cur.type==='work') completedExercises.add(`${cur.round}-${cur.exIndex}`);
    if(stepIndex >= steps.length-1){
      complete();
      return;
    }
    stepIndex++;
    remaining = stepSeconds(steps[stepIndex]);
    stepStartElapsed = elapsedTotal;
    persist();
    render();
  }

  function complete(){
    pauseTimer();
    finished = true;
    clearActiveSession();
    addHistoryEntry({
      programId: prog.id, programTitle: prog.title, sessionName: session.name,
      durationSec: elapsedTotal,
      exercisesCompleted: completedExercises.size,
      exercisesTotal: session.exercises.length * session.rounds
    });
    render();
  }

  function abandon(){
    if(!confirm('Abandonner la séance en cours ? La progression ne sera pas enregistrée.')) return;
    pauseTimer();
    clearActiveSession();
    location.href = `programme.html?id=${prog.id}`;
  }

  function renderTime(){
    const timeEl = document.getElementById('bigTime');
    if(!timeEl) return;
    const cur = steps[stepIndex];
    if(cur.type==='work' && cur.exercise.mode==='reps'){
      timeEl.textContent = fmtClock(elapsedStepTime(cur));
    } else {
      timeEl.textContent = fmtClock(remaining);
    }
    const bar = document.getElementById('progFill');
    if(bar) bar.style.width = `${Math.round((stepIndex/steps.length)*100)}%`;
  }

  let stepStartElapsed = 0;
  function elapsedStepTime(){
    return elapsedTotal - stepStartElapsed;
  }

  function render(){
    if(finished){
      root.innerHTML = `
        <div class="summary-card">
          <div class="phase" style="margin-bottom:6px;">Séance terminée</div>
          <div class="big-num">${fmtClock(elapsedTotal)}</div>
          <div class="ex-sub" style="margin:6px 0 22px;">${completedExercises.size} / ${session.exercises.length * session.rounds} exercices complétés</div>
          <div class="btn-row">
            <a href="index.html" class="btn">Accueil</a>
            <a href="progression.html" class="btn btn-primary">Progression</a>
          </div>
        </div>`;
      return;
    }

    const cur = steps[stepIndex];
    const isWork = cur.type==='work';
    const ex = isWork ? cur.exercise : null;
    const phaseLabel = isWork ? (session.rounds>1 ? `Round ${cur.round+1} / ${session.rounds}` : 'En cours') :
      (cur.type==='roundrest' ? 'Repos entre rounds' : 'Repos');
    const title = isWork ? ex.name : '—';
    const sub = isWork ? (ex.mode==='time' ? (ex.reps || '') : ex.reps) : (cur.nextLabel ? `Ensuite : ${cur.nextLabel}` : 'Dernière étape');
    const icon = isWork ? patternIcon(ex.pattern, PATTERNS[ex.pattern].color) : navIcon('mark');

    root.innerHTML = `
      <div class="progress-bar"><i id="progFill" style="width:${Math.round((stepIndex/steps.length)*100)}%"></i></div>
      <div class="session-hero">
        <div class="big-time" id="bigTime">00:00</div>
        <div class="phase">${phaseLabel}</div>
      </div>
      <div class="exercise-focus">
        <div class="ex-icon" style="margin:0 auto 10px;width:52px;height:52px;padding:10px;">${icon}</div>
        <h2>${title}</h2>
        <p>${sub}</p>
      </div>
      <div class="up-next">Étape ${stepIndex+1} / ${steps.length}</div>
      <div class="runner-controls" style="margin-bottom:14px;">
        <button class="btn" id="btnPause">${running?'Pause':'Reprendre'}</button>
        ${isWork && ex.mode==='reps'
          ? `<button class="btn btn-primary" id="btnDone">Terminé</button>`
          : `<button class="btn btn-primary" id="btnSkip">Passer</button>`}
      </div>
      <div class="reset-link" id="btnAbandon">Abandonner la séance</div>
    `;
    renderTime();
    document.getElementById('btnPause').addEventListener('click', ()=> running ? pauseTimer() : startTimer());
    document.getElementById('btnAbandon').addEventListener('click', abandon);
    const doneBtn = document.getElementById('btnDone');
    if(doneBtn) doneBtn.addEventListener('click', ()=> advance());
    const skipBtn = document.getElementById('btnSkip');
    if(skipBtn) skipBtn.addEventListener('click', ()=> advance());
  }

  render();
  startTimer();
  persist();
})();
