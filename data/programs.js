// Ketel — data model
// Exercise block: {name, pattern, mode:'reps'|'time', reps?, seconds?, rest}
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
          {name:'Deadlift', pattern:'HINGE', mode:'reps', reps:'3 × 10', rest:60},
          {name:'Goblet Squat', pattern:'SQUAT', mode:'reps', reps:'3 × 10', rest:60},
          {name:'Overhead Press', pattern:'PUSH', mode:'reps', reps:'3 × 8 / côté', rest:60},
          {name:'Bent-Over Row', pattern:'PULL', mode:'reps', reps:'3 × 8 / côté', rest:60},
          {name:"Farmer's March", pattern:'CARRY', mode:'reps', reps:'3 × 10 / côté', rest:60},
          {name:'Halos', pattern:'ROTATION', mode:'reps', reps:'3 × 10 / sens', rest:90}
        ]
      },
      {
        name:'Rounds',
        meta:'<b>Rounds.</b> Les 6 mouvements s\'enchaînent, courte transition entre chaque. 4 rounds, repos long entre chaque round.',
        rounds:4, restBetweenRounds:150,
        exercises:[
          {name:'Kettlebell Swing', pattern:'HINGE', mode:'reps', reps:'× 15', rest:20},
          {name:'Offset Reverse Lunge', pattern:'SQUAT', mode:'reps', reps:'× 8 / côté', rest:20},
          {name:'Lying Single-Arm Press', pattern:'PUSH', mode:'reps', reps:'× 8 / côté', rest:20},
          {name:'Single-Arm Row', pattern:'PULL', mode:'reps', reps:'× 10 / côté', rest:20},
          {name:'Rack Carry March', pattern:'CARRY', mode:'reps', reps:'× 10 / côté', rest:20},
          {name:'Windmill', pattern:'ROTATION', mode:'reps', reps:'× 6 / côté', rest:20}
        ]
      },
      {
        name:'EMOM',
        meta:'<b>Every Minute On the Minute.</b> Les reps prescrites au top de chaque minute, repos sur le temps restant. 4 rounds, 1 min de repos entre les rounds.',
        rounds:4, restBetweenRounds:60,
        exercises:[
          {name:'Romanian Deadlift', pattern:'HINGE', mode:'time', seconds:60, reps:'× 12', rest:0},
          {name:'Goblet Squat', pattern:'SQUAT', mode:'time', seconds:60, reps:'× 10', rest:0},
          {name:'Push-Ups', pattern:'PUSH', mode:'time', seconds:60, reps:'× 10', rest:0},
          {name:'High Pull', pattern:'PULL', mode:'time', seconds:60, reps:'× 10 / côté', rest:0},
          {name:'Uppercuts', pattern:'ROTATION', mode:'time', seconds:60, reps:'× 10 / côté', rest:0},
          {name:'Overhead March', pattern:'CARRY', mode:'time', seconds:60, reps:'× 10 / côté', rest:0}
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
          {name:'Pompes', pattern:'PUSH', mode:'reps', reps:'× 12', rest:45},
          {name:'Squat', pattern:'SQUAT', mode:'reps', reps:'× 15', rest:45},
          {name:'Rowing table basse', pattern:'PULL', mode:'reps', reps:'× 12', rest:45},
          {name:'Hip Thrust', pattern:'HINGE', mode:'reps', reps:'× 15', rest:45},
          {name:'Gainage planche', pattern:'CORE', mode:'time', seconds:30, rest:45}
        ]
      },
      {
        name:'Full Body B',
        meta:'<b>3 rounds.</b> Variante de la séance A, mêmes patrons, angles différents.',
        rounds:3, restBetweenRounds:90,
        exercises:[
          {name:'Fentes alternées', pattern:'SQUAT', mode:'reps', reps:'× 10 / côté', rest:45},
          {name:'Pompes déclinées', pattern:'PUSH', mode:'reps', reps:'× 10', rest:45},
          {name:'Superman', pattern:'PULL', mode:'reps', reps:'× 12', rest:45},
          {name:'Pont fessier unilatéral', pattern:'HINGE', mode:'reps', reps:'× 10 / côté', rest:45},
          {name:'Gainage latéral', pattern:'CORE', mode:'time', seconds:20, rest:45}
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
          {name:'Jumping Jacks', pattern:'CARDIO', mode:'time', seconds:40, rest:20},
          {name:'Mountain Climbers', pattern:'CARDIO', mode:'time', seconds:40, rest:20},
          {name:'Squat Jumps', pattern:'SQUAT', mode:'time', seconds:40, rest:20},
          {name:'Burpees', pattern:'CARDIO', mode:'time', seconds:40, rest:20},
          {name:'Plank Jacks', pattern:'CORE', mode:'time', seconds:40, rest:20}
        ]
      },
      {
        name:'Endurance longue',
        meta:'<b>45s d\'effort continu.</b> Rythme modéré et soutenu plutôt qu\'explosif. 3 rounds.',
        rounds:3, restBetweenRounds:60,
        exercises:[
          {name:'High Knees', pattern:'CARDIO', mode:'time', seconds:45, rest:15},
          {name:'Step-Ups', pattern:'CARDIO', mode:'time', seconds:45, rest:15},
          {name:'Shadow Boxing', pattern:'CARDIO', mode:'time', seconds:45, rest:15},
          {name:'Fentes sautées', pattern:'SQUAT', mode:'time', seconds:45, rest:15}
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
          {name:'KB Swing ou Squat sauté', pattern:'HINGE', mode:'time', seconds:35, rest:15},
          {name:'Goblet Squat ou Air Squat', pattern:'SQUAT', mode:'time', seconds:35, rest:15},
          {name:'Pompes', pattern:'PUSH', mode:'time', seconds:35, rest:15},
          {name:'Row élastique ou serviette', pattern:'PULL', mode:'time', seconds:35, rest:15},
          {name:'Mountain Climbers', pattern:'CARDIO', mode:'time', seconds:35, rest:15},
          {name:'Gainage', pattern:'CORE', mode:'time', seconds:35, rest:30}
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
          {name:'Cat-Cow', pattern:'MOBILITY', mode:'time', seconds:40, rest:15},
          {name:'Bird-Dog', pattern:'CORE', mode:'reps', reps:'× 8 / côté', rest:20},
          {name:'Dead Bug', pattern:'CORE', mode:'reps', reps:'× 8 / côté', rest:20},
          {name:'Pont fessier', pattern:'HINGE', mode:'reps', reps:'× 12', rest:20},
          {name:'Gainage McGill', pattern:'CORE', mode:'time', seconds:20, rest:30},
          {name:'Bascule du bassin', pattern:'MOBILITY', mode:'time', seconds:30, rest:15}
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
          {name:'Quad Sets (contraction isométrique)', pattern:'CORE', mode:'reps', reps:'× 10 contractions de 5s', rest:15},
          {name:'Élévation jambe tendue', pattern:'HINGE', mode:'reps', reps:'× 12 / côté', rest:20},
          {name:'Chaise murale', pattern:'SQUAT', mode:'time', seconds:20, rest:30},
          {name:'Clamshells', pattern:'ROTATION', mode:'reps', reps:'× 12 / côté', rest:20},
          {name:'Step-up bas', pattern:'CARRY', mode:'reps', reps:'× 10 / côté', rest:20}
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
