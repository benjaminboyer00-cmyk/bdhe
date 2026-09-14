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
  const WEIGHTED_EQUIPMENT = ['kettlebell', 'salle', 'les deux'];
  const tracksLoad = WEIGHTED_EQUIPMENT.includes(prog.equipment);

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

  function stepSeconds(step){
    if(step.type==='work') return step.exercise.mode==='time' ? step.exercise.seconds : null;
    return step.seconds;
  }

  // Resume in place if this exact session was already running
  const existing = getActiveSession();
  const resuming = !!(existing && existing.programId===prog.id && existing.sessionIndex===sIndex);

  let stepIndex = resuming ? Math.min(existing.stepIndex, steps.length-1) : 0;
  let elapsedTotal = resuming ? existing.elapsedTotal : 0;
  // Countdown steps restart at full duration on resume — sub-step progress isn't persisted.
  let remaining = stepSeconds(steps[stepIndex]);
  let stepStartElapsed = elapsedTotal;
  let running = false;
  let intervalId = null;
  let finished = false;
  const completedExercises = new Set(resuming ? existing.completedExercises : []);

  // --- Audio / haptic cues (unlocked on first tap, since the timer autostarts) ---
  let audioCtx = null;
  function ensureAudio(){
    if(!audioCtx){ try{ audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
    if(audioCtx && audioCtx.state==='suspended') audioCtx.resume().catch(()=>{});
  }
  document.addEventListener('pointerdown', ensureAudio, {once:true});
  function beep(freq, dur){
    if(!audioCtx || audioCtx.state!=='running') return;
    try{
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      const t = audioCtx.currentTime;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t+0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t+dur);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(t); osc.stop(t+dur+0.02);
    }catch(e){}
  }
  function vibrate(pattern){ if(navigator.vibrate){ try{ navigator.vibrate(pattern); }catch(e){} } }
  function cueCountdown(){ beep(440, 0.06); }
  function cueTransition(){ beep(880, 0.16); vibrate(120); }

  // --- Screen wake lock while the timer is running ---
  let wakeLock = null;
  async function acquireWakeLock(){
    if(!('wakeLock' in navigator)) return;
    try{ wakeLock = await navigator.wakeLock.request('screen'); }catch(e){}
  }
  function releaseWakeLock(){
    if(wakeLock){ wakeLock.release().catch(()=>{}); wakeLock = null; }
  }
  document.addEventListener('visibilitychange', ()=>{
    if(document.visibilityState==='visible' && running) acquireWakeLock();
  });

  function persist(){
    setActiveSession({
      programId:prog.id, sessionIndex:sIndex, stepIndex, elapsedTotal,
      completedExercises:Array.from(completedExercises), startedAt:Date.now()
    });
  }

  function tick(){
    elapsedTotal++;
    if(remaining !== null){
      remaining--;
      if(remaining <= 0){ cueTransition(); advance(); return; }
      if(remaining <= 3) cueCountdown();
    }
    renderTime();
  }

  function startTimer(){
    if(intervalId) return;
    running = true;
    intervalId = setInterval(tick, 1000);
    acquireWakeLock();
    render();
  }
  function pauseTimer(){
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    releaseWakeLock();
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
      timeEl.textContent = fmtClock(elapsedStepTime());
    } else {
      timeEl.textContent = fmtClock(remaining);
    }
    const bar = document.getElementById('progFill');
    if(bar) bar.style.width = `${Math.round((stepIndex/steps.length)*100)}%`;
  }

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
    const cue = isWork && ex.cue ? `<div class="cue">${ex.cue}</div>` : '';
    const isPhoto = isWork && !!exercisePhotoUrl(ex.name);
    const icon = isWork ? exerciseMediaHtml(ex.name, ex.pattern, PATTERNS[ex.pattern].color) : navIcon('mark');
    const showWeight = isWork && ex.mode==='reps' && tracksLoad;
    const lastWeight = showWeight ? getLoad(ex.name) : null;

    root.innerHTML = `
      <div class="progress-bar"><i id="progFill" style="width:${Math.round((stepIndex/steps.length)*100)}%"></i></div>
      <div class="session-hero">
        <div class="big-time" id="bigTime">00:00</div>
        <div class="phase">${phaseLabel}</div>
      </div>
      <div class="exercise-focus">
        <div class="ex-icon${isPhoto?' photo':''} ex-icon-lg">${icon}</div>
        <h2>${title}</h2>
        <p>${sub}</p>
        ${cue}
        ${showWeight ? `
          <div class="weight-row">
            <label for="weightInput">Charge (kg)</label>
            <input type="number" id="weightInput" inputmode="decimal" step="0.5" min="0" placeholder="ex. 16" value="${lastWeight!=null?lastWeight:''}">
          </div>` : ''}
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
    if(doneBtn) doneBtn.addEventListener('click', ()=>{
      if(showWeight){
        const w = parseFloat(document.getElementById('weightInput').value);
        if(!isNaN(w) && w>=0) setLoad(ex.name, w);
      }
      advance();
    });
    const skipBtn = document.getElementById('btnSkip');
    if(skipBtn) skipBtn.addEventListener('click', ()=> advance());
  }

  render();
  startTimer();
  persist();
})();
