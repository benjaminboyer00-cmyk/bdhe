// Ketel — data model
// Exercise block: {name, pattern, mode:'reps'|'time', reps?, seconds?, rest, cue}
// Session: {name, meta, rounds, restBetweenRounds, exercises:[block]}
// Program: {id, title, category, equipment, level, duration, freq, tagline, description, color, tags:[], sessions:[session]}

const PATTERNS = {
  HINGE:    {label:'Hanches',   color:'var(--brass)',   note:'Deadlifts et swings : charger hanches et ischios.'},
  SQUAT:    {label:'Squat',     color:'var(--sage)',    note:'Jambes, hanches, quadriceps.'},
  PUSH:     {label:'Poussée',   color:'var(--rust)',    note:'Pompes, presses au sol, presses overhead.'},
  PULL:     {label:'Tirage',    color:'var(--steel)',   note:'Rows et high pulls : équilibrer la poussée, protéger les épaules.'},
  CARRY:    {label:'Porté',     color:'var(--leather)', note:'Tenir une charge en se déplaçant, sous contrôle.'},
  ROTATION: {label:'Rotation',  color:'var(--plum)',    note:'Stabilité et contrôle du tronc en rotation.'},
  CORE:     {label:'Gainage',   color:'var(--sage)',    note:'Stabilité du tronc, statique ou dynamique.'},
  CARDIO:   {label:'Cardio',    color:'var(--rust)',    note:'Fréquence cardiaque élevée, enchaînements rapides.'},
  MOBILITY: {label:'Mobilité',  color:'var(--steel)',   note:'Amplitude articulaire, échauffement, récupération active.'}
};

const CATEGORIES = {
  force:    {label:'Force',          color:'var(--brass)', desc:'Construire de la force, avec ou sans matériel.'},
  endurance:{label:'Endurance',      color:'var(--steel)', desc:'Cardio, souffle, capacité à tenir dans la durée.'},
  poids:    {label:'Perte de poids', color:'var(--rust)',  desc:'Circuits métaboliques à haute densité.'},
  reeduc:   {label:'Rééducation',    color:'var(--sage)',  desc:'Renforcement doux et mobilité ciblée.'}
};

const LEVELS = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
  tous: 'Tous niveaux'
};

const BELL_TABLE = {
  beginner:     {femme:'6 – 10 kg', homme:'12 – 16 kg'},
  intermediate: {femme:'10 – 16 kg', homme:'16 – 20 kg'},
  advanced:     {femme:'16 – 24 kg', homme:'20 – 28 kg'}
};

const PROGRAMS = [
  {
    id:'kb-fonctionnel',
    title:'Kettlebell Fonctionnel',
    category:'force',
    equipment:'kettlebell',
    level:'tous',
    duration:'30 min',
    freq:'3×/sem',
    tagline:'Un bell. Trois séances par semaine. Six mouvements fondamentaux, toujours.',
    description:'Le programme historique de Ketel. Construit la force sur les six patrons de mouvement fondamentaux, avec trois formats d\'entraînement au choix.',
    color:'var(--brass)',
    tags:['force','kettlebell','debutant','intermediaire','avance'],
    sessions:[
      {
        name:'Base',
        meta:'<b>Séries avec repos.</b> Chaque mouvement : la série complète, puis repos, avant de passer au suivant.',
        rounds:1, restBetweenRounds:0,
        exercises:[
          {name:'Deadlift', pattern:'HINGE', mode:'reps', reps:'3 × 10', rest:60, cue:'Dos plat, la charge part des hanches, pas du bas du dos.'},
          {name:'Goblet Squat', pattern:'SQUAT', mode:'reps', reps:'3 × 10', rest:60, cue:'Coudes à l\'intérieur des genoux, talons au sol.'},
          {name:'Overhead Press', pattern:'PUSH', mode:'reps', reps:'3 × 8 / côté', rest:60, cue:'Pousse jusqu\'au verrouillage, biceps près de l\'oreille.'},
          {name:'Bent-Over Row', pattern:'PULL', mode:'reps', reps:'3 × 8 / côté', rest:60, cue:'Dos plat, tire le coude vers la hanche.'},
          {name:"Farmer's March", pattern:'CARRY', mode:'reps', reps:'3 × 10 / côté', rest:60, cue:'Épaules basses, tronc gainé, pas de bascule du bassin.'},
          {name:'Halos', pattern:'ROTATION', mode:'reps', reps:'3 × 10 / sens', rest:90, cue:'Le bell tourne autour de la tête, le tronc reste immobile.'}
        ]
      },
      {
        name:'Rounds',
        meta:'<b>Rounds.</b> Les 6 mouvements s\'enchaînent, courte transition entre chaque. 4 rounds, repos long entre chaque round.',
        rounds:4, restBetweenRounds:150,
        exercises:[
          {name:'Kettlebell Swing', pattern:'HINGE', mode:'reps', reps:'× 15', rest:20, cue:'Explosion des hanches, pas un squat ni un lever de bras.'},
          {name:'Offset Reverse Lunge', pattern:'SQUAT', mode:'reps', reps:'× 8 / côté', rest:20, cue:'Descends droit, genou avant aligné avec la cheville.'},
          {name:'Lying Single-Arm Press', pattern:'PUSH', mode:'reps', reps:'× 8 / côté', rest:20, cue:'Allongé, stabilise l\'omoplate avant de pousser.'},
          {name:'Single-Arm Row', pattern:'PULL', mode:'reps', reps:'× 10 / côté', rest:20, cue:'Dos plat, évite la rotation du tronc.'},
          {name:'Rack Carry March', pattern:'CARRY', mode:'reps', reps:'× 10 / côté', rest:20, cue:'Coude collé aux côtes, poignet droit.'},
          {name:'Windmill', pattern:'ROTATION', mode:'reps', reps:'× 6 / côté', rest:20, cue:'Regarde le bell, hanches qui pivotent, jambes quasi tendues.'}
        ]
      },
      {
        name:'EMOM',
        meta:'<b>Every Minute On the Minute.</b> Les reps prescrites au top de chaque minute, repos sur le temps restant. 4 rounds, 1 min de repos entre les rounds.',
        rounds:4, restBetweenRounds:60,
        exercises:[
          {name:'Romanian Deadlift', pattern:'HINGE', mode:'time', seconds:60, reps:'× 12', rest:0, cue:'Recule les hanches, genoux légèrement fléchis, dos plat.'},
          {name:'Goblet Squat', pattern:'SQUAT', mode:'time', seconds:60, reps:'× 10', rest:0, cue:'Coudes à l\'intérieur des genoux, talons au sol.'},
          {name:'Push-Ups', pattern:'PUSH', mode:'time', seconds:60, reps:'× 10', rest:0, cue:'Corps aligné de la tête aux talons, coudes à 45°.'},
          {name:'High Pull', pattern:'PULL', mode:'time', seconds:60, reps:'× 10 / côté', rest:0, cue:'Coude qui part haut et large, pas d\'élan du dos.'},
          {name:'Uppercuts', pattern:'ROTATION', mode:'time', seconds:60, reps:'× 10 / côté', rest:0, cue:'Rotation du tronc, pas juste le bras.'},
          {name:'Overhead March', pattern:'CARRY', mode:'time', seconds:60, reps:'× 10 / côté', rest:0, cue:'Bras verrouillé, tronc gainé à chaque pas.'}
        ]
      }
    ]
  },
  {
    id:'force-poids-corps',
    title:'Force au poids du corps',
    category:'force',
    equipment:'aucun',
    level:'debutant',
    duration:'25 min',
    freq:'3×/sem',
    tagline:'Aucun matériel requis. Deux séances en alternance, tout le corps.',
    description:'Pour construire de la force sans kettlebell : deux séances full-body au poids du corps, à alterner sur la semaine.',
    color:'var(--leather)',
    tags:['force','aucun','debutant','intermediaire'],
    sessions:[
      {
        name:'Full Body A',
        meta:'<b>3 rounds.</b> Le circuit complet, puis repos avant de relancer.',
        rounds:3, restBetweenRounds:90,
        exercises:[
          {name:'Pompes', pattern:'PUSH', mode:'reps', reps:'× 12', rest:45, cue:'Corps aligné, coudes à 45°, descends jusqu\'à frôler le sol.'},
          {name:'Squat', pattern:'SQUAT', mode:'reps', reps:'× 15', rest:45, cue:'Poids sur les talons, genoux dans l\'axe des pieds.'},
          {name:'Rowing table basse', pattern:'PULL', mode:'reps', reps:'× 12', rest:45, cue:'Corps gainé, tire la poitrine vers la table.'},
          {name:'Hip Thrust', pattern:'HINGE', mode:'reps', reps:'× 15', rest:45, cue:'Pousse par les talons, contracte les fessiers en haut.'},
          {name:'Gainage planche', pattern:'CORE', mode:'time', seconds:30, rest:45, cue:'Corps aligné, ne laisse pas les hanches tomber.'}
        ]
      },
      {
        name:'Full Body B',
        meta:'<b>3 rounds.</b> Variante de la séance A, mêmes patrons, angles différents.',
        rounds:3, restBetweenRounds:90,
        exercises:[
          {name:'Fentes alternées', pattern:'SQUAT', mode:'reps', reps:'× 10 / côté', rest:45, cue:'Descends droit, genou arrière proche du sol.'},
          {name:'Pompes déclinées', pattern:'PUSH', mode:'reps', reps:'× 10', rest:45, cue:'Pieds surélevés, même alignement qu\'une pompe classique.'},
          {name:'Superman', pattern:'PULL', mode:'reps', reps:'× 12', rest:45, cue:'Lève bras et jambes ensemble, sans forcer le bas du dos.'},
          {name:'Pont fessier unilatéral', pattern:'HINGE', mode:'reps', reps:'× 10 / côté', rest:45, cue:'Bassin stable, évite de le faire pivoter.'},
          {name:'Gainage latéral', pattern:'CORE', mode:'time', seconds:20, rest:45, cue:'Hanches hautes, corps aligné de la tête aux pieds.'}
        ]
      }
    ]
  },
  {
    id:'endurance-hiit',
    title:'Endurance & Cardio',
    category:'endurance',
    equipment:'aucun',
    level:'tous',
    duration:'20 min',
    freq:'2-3×/sem',
    tagline:'Intervalles courts, sans matériel, pour construire le souffle.',
    description:'Deux formats d\'intervalles pour développer la capacité cardio et la tenue dans la durée, à réajuster selon la forme du jour.',
    color:'var(--steel)',
    tags:['endurance','aucun','tous'],
    sessions:[
      {
        name:'Intervalles 40/20',
        meta:'<b>40s d\'effort, 20s de repos.</b> 5 mouvements, 4 rounds, repos long entre rounds.',
        rounds:4, restBetweenRounds:90,
        exercises:[
          {name:'Jumping Jacks', pattern:'CARDIO', mode:'time', seconds:40, rest:20, cue:'Rythme régulier, atterris souple sur les appuis.'},
          {name:'Mountain Climbers', pattern:'CARDIO', mode:'time', seconds:40, rest:20, cue:'Bassin stable, genoux qui viennent sous la poitrine.'},
          {name:'Squat Jumps', pattern:'SQUAT', mode:'time', seconds:40, rest:20, cue:'Réception souple, genoux dans l\'axe des pieds.'},
          {name:'Burpees', pattern:'CARDIO', mode:'time', seconds:40, rest:20, cue:'Enchaîne à ton rythme, priorité à la technique sur la vitesse.'},
          {name:'Plank Jacks', pattern:'CORE', mode:'time', seconds:40, rest:20, cue:'Gainage stable, seules les jambes bougent.'}
        ]
      },
      {
        name:'Endurance longue',
        meta:'<b>45s d\'effort continu.</b> Rythme modéré et soutenu plutôt qu\'explosif. 3 rounds.',
        rounds:3, restBetweenRounds:60,
        exercises:[
          {name:'High Knees', pattern:'CARDIO', mode:'time', seconds:45, rest:15, cue:'Genoux hauts, buste droit, appuis légers.'},
          {name:'Step-Ups', pattern:'CARDIO', mode:'time', seconds:45, rest:15, cue:'Pousse par le talon sur la marche, contrôle la descente.'},
          {name:'Shadow Boxing', pattern:'CARDIO', mode:'time', seconds:45, rest:15, cue:'Genoux fléchis, tourne les hanches sur les coups.'},
          {name:'Fentes sautées', pattern:'SQUAT', mode:'time', seconds:45, rest:15, cue:'Réception souple, change de jambe en l\'air.'}
        ]
      }
    ]
  },
  {
    id:'perte-poids-metabolique',
    title:'Circuit Métabolique',
    category:'poids',
    equipment:'les deux',
    level:'tous',
    duration:'35 min',
    freq:'3-4×/sem',
    tagline:'Haute densité, repos courts. Kettlebell ou poids du corps.',
    description:'Un circuit à haute densité d\'effort pour maximiser la dépense calorique. À combiner avec les calculateurs (calories, protéines) pour cadrer l\'alimentation.',
    color:'var(--rust)',
    tags:['poids','kettlebell','aucun','tous'],
    sessions:[
      {
        name:'Circuit métabolique',
        meta:'<b>6 mouvements, 35s / 15s.</b> 4 rounds, repos plus long tous les 2 rounds.',
        rounds:4, restBetweenRounds:90,
        exercises:[
          {name:'KB Swing ou Squat sauté', pattern:'HINGE', mode:'time', seconds:35, rest:15, cue:'Explosion des hanches, ou réception souple selon la variante.'},
          {name:'Goblet Squat ou Air Squat', pattern:'SQUAT', mode:'time', seconds:35, rest:15, cue:'Coudes à l\'intérieur des genoux, talons au sol.'},
          {name:'Pompes', pattern:'PUSH', mode:'time', seconds:35, rest:15, cue:'Corps aligné, adapte l\'amplitude si besoin.'},
          {name:'Row élastique ou serviette', pattern:'PULL', mode:'time', seconds:35, rest:15, cue:'Dos plat, tire les coudes vers l\'arrière.'},
          {name:'Mountain Climbers', pattern:'CARDIO', mode:'time', seconds:35, rest:15, cue:'Bassin stable, rythme soutenu mais contrôlé.'},
          {name:'Gainage', pattern:'CORE', mode:'time', seconds:35, rest:30, cue:'Corps aligné, respire, ne bloque pas.'}
        ]
      }
    ]
  },
  {
    id:'reeduc-dos',
    title:'Rééducation · Dos & lombaires',
    category:'reeduc',
    equipment:'aucun',
    level:'tous',
    duration:'20 min',
    freq:'4-5×/sem',
    tagline:'Mobilité douce et stabilité du tronc, sans charge.',
    description:'Renforcement doux pour un dos sensible : mobilité, gainage anti-extension, sans mise en charge. En cas de douleur persistante ou aiguë, consulte un professionnel de santé avant de poursuivre.',
    color:'var(--sage)',
    tags:['reeduc','aucun','tous','dos'],
    sessions:[
      {
        name:'Mobilité & stabilité',
        meta:'<b>2 rounds, rythme lent.</b> Amplitude confortable, jamais de douleur pendant le mouvement.',
        rounds:2, restBetweenRounds:60,
        exercises:[
          {name:'Cat-Cow', pattern:'MOBILITY', mode:'time', seconds:40, rest:15, cue:'Mouvement lent, synchronise avec la respiration.'},
          {name:'Bird-Dog', pattern:'CORE', mode:'reps', reps:'× 8 / côté', rest:20, cue:'Bascule minimale du bassin, mouvement lent et contrôlé.'},
          {name:'Dead Bug', pattern:'CORE', mode:'reps', reps:'× 8 / côté', rest:20, cue:'Bas du dos plaqué au sol tout le mouvement.'},
          {name:'Pont fessier', pattern:'HINGE', mode:'reps', reps:'× 12', rest:20, cue:'Pousse par les talons, pas de cambrure excessive.'},
          {name:'Gainage McGill', pattern:'CORE', mode:'time', seconds:20, rest:30, cue:'Une main sous le bas du dos, contracte sans bouger.'},
          {name:'Bascule du bassin', pattern:'MOBILITY', mode:'time', seconds:30, rest:15, cue:'Amplitude très réduite, sans forcer.'}
        ]
      }
    ]
  },
  {
    id:'reeduc-genou',
    title:'Rééducation · Genou',
    category:'reeduc',
    equipment:'aucun',
    level:'tous',
    duration:'18 min',
    freq:'4-5×/sem',
    tagline:'Renforcement progressif autour du genou, faible impact.',
    description:'Séance de renforcement doux pour stabiliser le genou : quadriceps, fessiers et contrôle du mouvement. En cas de douleur persistante ou aiguë, consulte un professionnel de santé avant de poursuivre.',
    color:'var(--sage)',
    tags:['reeduc','aucun','tous','genou'],
    sessions:[
      {
        name:'Renforcement doux',
        meta:'<b>2 rounds.</b> Amplitude réduite si besoin, jamais de douleur aiguë.',
        rounds:2, restBetweenRounds:60,
        exercises:[
          {name:'Quad Sets (contraction isométrique)', pattern:'CORE', mode:'reps', reps:'× 10 contractions de 5s', rest:15, cue:'Contracte le quadriceps, genou tendu, sans douleur.'},
          {name:'Élévation jambe tendue', pattern:'HINGE', mode:'reps', reps:'× 12 / côté', rest:20, cue:'Genou verrouillé, lève sans plier.'},
          {name:'Chaise murale', pattern:'SQUAT', mode:'time', seconds:20, rest:30, cue:'Genoux à 90° max si douleur, dos plaqué au mur.'},
          {name:'Clamshells', pattern:'ROTATION', mode:'reps', reps:'× 12 / côté', rest:20, cue:'Bassin immobile, seul le genou s\'ouvre.'},
          {name:'Step-up bas', pattern:'CARRY', mode:'reps', reps:'× 10 / côté', rest:20, cue:'Pousse par le talon, contrôle la descente.'}
        ]
      }
    ]
  },
  {
    id:'reeduc-epaule',
    title:'Rééducation · Épaule',
    category:'reeduc',
    equipment:'aucun',
    level:'tous',
    duration:'15 min',
    freq:'4-5×/sem',
    tagline:'Mobilité douce et stabilité de l\'épaule, sans charge.',
    description:'Séance de renforcement doux pour une épaule sensible : mobilité passive, rotation externe et stabilité scapulaire. En cas de douleur persistante ou aiguë, consulte un professionnel de santé avant de poursuivre.',
    color:'var(--sage)',
    tags:['reeduc','aucun','tous','epaule'],
    sessions:[
      {
        name:'Mobilité & stabilité',
        meta:'<b>2 rounds, rythme lent.</b> Amplitude confortable, jamais de douleur pendant le mouvement.',
        rounds:2, restBetweenRounds:60,
        exercises:[
          {name:'Pendulum', pattern:'MOBILITY', mode:'time', seconds:30, rest:15, cue:'Laisse le bras pendre, mouvement passif du buste, pas d\'effort.'},
          {name:'Rotation externe (élastique ou serviette)', pattern:'ROTATION', mode:'reps', reps:'× 12 / côté', rest:20, cue:'Coude collé aux côtes, seul l\'avant-bras tourne.'},
          {name:'Rétraction scapulaire', pattern:'PULL', mode:'reps', reps:'× 12', rest:20, cue:'Rapproche les omoplates sans hausser les épaules.'},
          {name:'Wall Slides', pattern:'MOBILITY', mode:'reps', reps:'× 10', rest:20, cue:'Dos et bras au mur, glisse lentement sans décoller.'},
          {name:'Isométrie press au mur', pattern:'PUSH', mode:'time', seconds:15, rest:30, cue:'Pousse doucement, sans douleur, intensité progressive.'}
        ]
      }
    ]
  }
];

function getProgram(id){ return PROGRAMS.find(p=>p.id===id); }
function sessionDurationSec(session){
  const oneRound = session.exercises.reduce((sum,e)=> sum + (e.mode==='time'?e.seconds:20) + e.rest, 0);
  return oneRound*session.rounds + session.restBetweenRounds*(session.rounds-1);
}
