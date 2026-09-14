// Ketel — per-exercise stick-figure pictograms.
// A small set of shared body-position archetypes (POSES), tweaked per
// exercise in EXERCISE_FIGURES — most movements reduce visually to the
// same handful of recognizable poses, so each entry only overrides what
// actually differs (an arm, a leg, whether a bell is held).

function seg(a,b){ return `<polyline points="${a[0]},${a[1]} ${b[0]},${b[1]}"/>`; }
function tri(a,b,c){ return `<polyline points="${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]}"/>`; }
function dot(c,r){ return `<circle cx="${c[0]}" cy="${c[1]}" r="${r}"/>`; }
function groundLine(y,x1,x2){ return `<line x1="${x1==null?10:x1}" y1="${y}" x2="${x2==null?90:x2}" y2="${y}" stroke-dasharray="2 4" opacity=".4"/>`; }
function wallLine(x,y1,y2){ return `<line x1="${x}" y1="${y1==null?8:y1}" x2="${x}" y2="${y2==null?95:y2}" stroke-dasharray="2 4" opacity=".4"/>`; }
function bellGlyph(c){
  const x=c[0], y=c[1];
  return `${dot([x,y+3],4)}<path d="M${x-3},${y-1} Q${x},${y-6} ${x+3},${y-1}" fill="none"/>`;
}

function renderPose(p){
  const parts = [];
  if(p.ground!=null) parts.push(groundLine(p.ground, p.groundX1, p.groundX2));
  if(p.wall!=null) parts.push(wallLine(p.wall));
  parts.push(dot(p.head, 7));
  parts.push(seg(p.neck, p.hip));
  parts.push(tri(p.neck, p.lElbow, p.lHand));
  parts.push(tri(p.neck, p.rElbow, p.rHand));
  parts.push(tri(p.hip, p.lKnee, p.lFoot));
  parts.push(tri(p.hip, p.rKnee, p.rFoot));
  // p.bell is either one [x,y] pair or a list of pairs [[x,y],[x,y]] — tell
  // them apart by checking whether the first element is itself an array.
  const bells = !p.bell ? [] : (Array.isArray(p.bell[0]) ? p.bell : [p.bell]);
  bells.forEach(b=> parts.push(bellGlyph(b)));
  return parts.join('');
}

function exerciseFigureSvg(name, color){
  const pose = EXERCISE_FIGURES[name];
  if(!pose) return null;
  return `<svg viewBox="0 0 100 100" fill="none" stroke="${color||'currentColor'}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${renderPose(pose)}</svg>`;
}

// Real demonstration photos, from free-exercise-db (public domain / Unlicense):
// https://github.com/yuhonas/free-exercise-db — used where a close enough
// match exists for the exercise; every other exercise falls back to the
// stick-figure pictogram above, then to the generic pattern icon.
const EXERCISE_PHOTOS = {
  "Bent-Over Row": "Bent_Over_Two-Dumbbell_Row",
  "Dead Bug": "Dead_Bug",
  "Deadlift": "Stiff-Legged_Dumbbell_Deadlift",
  "Farmer's March": "Farmers_Walk",
  "Fentes alternées": "Bodyweight_Walking_Lunge",
  "Gainage": "Plank",
  "Gainage planche": "Plank",
  "Goblet Squat": "Goblet_Squat",
  "Goblet Squat ou Air Squat": "Goblet_Squat",
  "High Pull": "Kettlebell_Sumo_High_Pull",
  "Hip Thrust": "Barbell_Hip_Thrust",
  "Jumping Jacks": "Star_Jump",
  "Kettlebell Swing": "One-Arm_Kettlebell_Swings",
  "KB Swing ou Squat sauté": "One-Arm_Kettlebell_Swings",
  "Mountain Climbers": "Mountain_Climbers",
  "Offset Reverse Lunge": "Crossover_Reverse_Lunge",
  "Overhead Press": "Dumbbell_Shoulder_Press",
  "Pompes": "Push-Ups_-_Close_Triceps_Position",
  "Pompes déclinées": "Decline_Push-Up",
  "Push-Ups": "Push-Ups_-_Close_Triceps_Position",
  "Pont fessier": "Butt_Lift_Bridge",
  "Pont fessier unilatéral": "Single_Leg_Glute_Bridge",
  "Romanian Deadlift": "Romanian_Deadlift",
  "Rotation externe (élastique ou serviette)": "External_Rotation_with_Band",
  "Row élastique ou serviette": "Inverted_Row",
  "Rowing table basse": "Inverted_Row",
  "Single-Arm Row": "One-Arm_Dumbbell_Row",
  "Squat": "Bodyweight_Squat",
  "Squat Jumps": "Freehand_Jump_Squat",
  "Step-Ups": "Dumbbell_Step_Ups",
  "Step-up bas": "Dumbbell_Step_Ups",
  "Superman": "Superman",
  "Windmill": "Kettlebell_Windmill",
  "Élévation jambe tendue": "Flat_Bench_Lying_Leg_Raise",
  "Fentes sautées": "Split_Jump",
  "Gainage latéral": "Side_Bridge",
  "Bascule du bassin": "Pelvic_Tilt_Into_Bridge",
  "Rack Carry March": "Farmers_Walk",
  "Plank Jacks": "Plank",
  "Lying Single-Arm Press": "One-Arm_Kettlebell_Floor_Press",
  // Chaise murale et Rétraction scapulaire gardent leur pictogramme dessiné :
  // les seules photos trouvées (squat debout, traction suspendue) montrent
  // une position trop différente pour rester fidèles au mouvement.
  // Salle de sport
  "Développé couché": "Barbell_Bench_Press_-_Medium_Grip",
  "Développé incliné haltères": "Incline_Dumbbell_Press",
  "Développé militaire": "Standing_Military_Press",
  "Élévations latérales": "Side_Lateral_Raise",
  "Dips": "Dips_-_Triceps_Version",
  "Extension triceps à la poulie": "Triceps_Pushdown",
  "Squat barre": "Barbell_Squat",
  "Presse à cuisses": "Leg_Press",
  "Fentes marchées barre": "Barbell_Walking_Lunge",
  "Extension quadriceps": "Leg_Extensions",
  "Mollets debout": "Standing_Barbell_Calf_Raise",
  "Tirage vertical": "Wide-Grip_Lat_Pulldown",
  "Rowing barre": "Bent_Over_Barbell_Row",
  "Rowing haltère unilatéral": "One-Arm_Dumbbell_Row",
  "Face Pull": "Face_Pull",
  "Curl biceps barre": "Barbell_Curl",
  "Gainage rotation": "Russian_Twist",
  "Soulevé de terre": "Barbell_Deadlift",
  "Soulevé de terre roumain": "Romanian_Deadlift",
  "Leg curl allongé": "Lying_Leg_Curls",
  "Hip thrust barre": "Barbell_Hip_Thrust",
  "Extensions lombaires": "Hyperextensions_Back_Extensions"
};

function exercisePhotoUrl(name, frame){
  const id = EXERCISE_PHOTOS[name];
  if(!id) return null;
  return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${id}/${frame||0}.jpg`;
}

// Best available visual for an exercise: real photo > drawn pose > generic pattern icon.
function exerciseMediaHtml(name, pattern, color){
  const url = exercisePhotoUrl(name, 0);
  const fallback = exerciseFigureSvg(name, color) || patternIcon(pattern, color);
  if(url){
    // If the photo fails to load (network hiccup, moved file), swap to the
    // drawn pictogram instead of leaving a broken image icon.
    const safeFallback = fallback.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'&quot;');
    const alt = name.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
    return `<img src="${url}" alt="${alt}" loading="lazy" onerror="this.outerHTML='${safeFallback}'">`;
  }
  return fallback;
}

const POSES = {
  // Standing upright, neutral arms
  STANDING: {
    head:[50,15], neck:[50,25], hip:[50,54],
    lElbow:[38,38], lHand:[34,52], rElbow:[62,38], rHand:[66,52],
    lKnee:[45,74], lFoot:[42,92], rKnee:[55,74], rFoot:[58,92],
    ground:92
  },
  // Bent forward at the hips, legs slightly soft (deadlift/row/pendulum family)
  HINGE: {
    head:[36,26], neck:[40,33], hip:[58,53],
    lElbow:[34,44], lHand:[32,58], rElbow:[38,48], rHand:[36,62],
    lKnee:[52,74], lFoot:[48,92], rKnee:[62,74], rFoot:[60,92],
    ground:92
  },
  // Squat bottom, holding something at the chest
  SQUAT: {
    head:[50,28], neck:[50,36], hip:[50,56],
    lElbow:[40,50], lHand:[46,58], rElbow:[60,50], rHand:[54,58],
    lKnee:[36,58], lFoot:[36,90], rKnee:[64,58], rFoot:[64,90],
    bell:[50,60], ground:92
  },
  // Split stance, front knee bent
  LUNGE: {
    head:[44,24], neck:[44,32], hip:[46,50],
    lElbow:[36,42], lHand:[32,54], rElbow:[54,42], rHand:[58,54],
    lKnee:[32,62], lFoot:[28,90],
    rKnee:[64,76], rFoot:[70,92],
    ground:92
  },
  // Prone, body diagonal, supported on the hands (push-up family)
  PLANK: {
    head:[80,38], neck:[71,41], hip:[36,49],
    lElbow:[64,52], lHand:[62,64], rElbow:[68,48], rHand:[72,60],
    lKnee:[22,52], lFoot:[12,56],
    rKnee:[24,56], rFoot:[16,60],
    ground:61
  },
  // On the back, knees drawn up (dead bug / core work)
  SUPINE: {
    head:[18,44], neck:[27,45], hip:[54,45],
    lElbow:[30,32], lHand:[26,20], rElbow:[34,34], rHand:[40,22],
    lKnee:[60,30], lFoot:[56,18],
    rKnee:[68,32], rFoot:[74,20],
    ground:50
  },
  // On the back, knees bent, feet planted — hips implied lifted
  BRIDGE: {
    head:[18,46], neck:[27,47], hip:[52,40],
    lElbow:[22,44], lHand:[18,50], rElbow:[28,46], rHand:[24,52],
    lKnee:[58,32], lFoot:[56,50],
    rKnee:[66,34], rFoot:[72,50],
    ground:52
  },
  // Propped on one forearm, body in a straight diagonal line
  SIDEPLANK: {
    head:[78,33], neck:[68,37], hip:[38,47],
    lElbow:[58,49], lHand:[56,60],
    rElbow:[72,26], rHand:[80,16],
    lKnee:[24,55], lFoot:[13,61],
    rKnee:[24,55], rFoot:[13,61],
    ground:62
  },
  // Lying on one side, knees bent
  SIDELYING: {
    head:[72,50], neck:[62,50], hip:[34,54],
    lElbow:[54,46], lHand:[50,36],
    rElbow:[56,58], rHand:[48,62],
    lKnee:[30,66], lFoot:[46,68],
    rKnee:[22,64], rFoot:[36,66],
    ground:70
  },
  // On hands and knees
  QUADRUPED: {
    head:[74,36], neck:[64,39], hip:[28,43],
    lElbow:[56,44], lHand:[54,58],
    rElbow:[80,28], rHand:[90,24],
    lKnee:[24,58], lFoot:[22,60],
    rKnee:[10,44], rFoot:[2,42],
    ground:60
  },
  // Mid-air, arms and legs spread
  JUMP: {
    head:[50,14], neck:[50,23], hip:[50,48],
    lElbow:[30,18], lHand:[16,8], rElbow:[70,18], rHand:[84,8],
    lKnee:[30,68], lFoot:[18,90], rKnee:[70,68], rFoot:[82,90]
  },
  // Standing, one knee raised — marching / carrying
  MARCH: {
    head:[50,15], neck:[50,25], hip:[50,52],
    lElbow:[34,40], lHand:[30,54], rElbow:[66,40], rHand:[70,54],
    lKnee:[40,56], lFoot:[38,66],
    rKnee:[58,72], rFoot:[60,92],
    ground:92
  },
  // Standing, facing a wall, arms forward against it
  WALLPRESS: {
    head:[36,15], neck:[40,25], hip:[42,54],
    lElbow:[58,26], lHand:[74,18], rElbow:[58,34], rHand:[74,30],
    lKnee:[38,74], lFoot:[36,92], rKnee:[46,74], rFoot:[46,92],
    wall:80, ground:92
  },
  // Prone, chest/arms/legs lifted off the ground
  PRONE_RAISE: {
    head:[80,40], neck:[70,42], hip:[38,48],
    lElbow:[86,28], lHand:[94,22],
    rElbow:[82,32], rHand:[90,28],
    lKnee:[24,44], lFoot:[12,38],
    rKnee:[26,48], rFoot:[14,44],
    ground:52
  }
};

const EXERCISE_FIGURES = {
  "Bascule du bassin": {...POSES.BRIDGE},
  "Bent-Over Row": {...POSES.HINGE, lElbow:[42,42], lHand:[44,50], rElbow:[46,46], rHand:[48,54]},
  "Bird-Dog": {...POSES.QUADRUPED},
  "Burpees": {...POSES.PLANK},
  "Cat-Cow": {...POSES.QUADRUPED, rElbow:[58,44], rHand:[56,58], rKnee:[16,58], rFoot:[14,60]},
  "Chaise murale": {...POSES.SQUAT, bell:null, lHand:[38,66], rHand:[62,66], lElbow:[36,60], rElbow:[64,60], wall:16},
  "Clamshells": {...POSES.SIDELYING},
  "Dead Bug": {...POSES.SUPINE},
  "Deadlift": {...POSES.HINGE, bell:[34,60]},
  "Farmer's March": {...POSES.MARCH, bell:[[30,54],[70,54]]},
  "Fentes alternées": {...POSES.LUNGE},
  "Fentes sautées": {...POSES.LUNGE, ground:null},
  "Gainage": {...POSES.PLANK},
  "Gainage McGill": {...POSES.SUPINE},
  "Gainage latéral": {...POSES.SIDEPLANK},
  "Gainage planche": {...POSES.PLANK},
  "Goblet Squat": {...POSES.SQUAT},
  "Goblet Squat ou Air Squat": {...POSES.SQUAT},
  "Halos": {...POSES.STANDING, lElbow:[40,26], lHand:[44,18], rElbow:[60,26], rHand:[56,18], bell:[50,16]},
  "High Knees": {...POSES.MARCH},
  "High Pull": {...POSES.STANDING, rElbow:[70,24], rHand:[66,14]},
  "Hip Thrust": {...POSES.BRIDGE},
  "Isométrie press au mur": {...POSES.WALLPRESS},
  "Jumping Jacks": {...POSES.JUMP},
  "KB Swing ou Squat sauté": {...POSES.HINGE, bell:[36,64]},
  "Kettlebell Swing": {...POSES.HINGE, bell:[36,64]},
  "Lying Single-Arm Press": {...POSES.SUPINE, rElbow:[46,30], rHand:[70,14]},
  "Mountain Climbers": {...POSES.PLANK, lKnee:[40,50], lFoot:[38,54]},
  "Offset Reverse Lunge": {...POSES.LUNGE, bell:[30,56]},
  "Overhead March": {...POSES.MARCH, rElbow:[64,22], rHand:[66,10], bell:[66,10]},
  "Overhead Press": {...POSES.STANDING, lElbow:[36,26], lHand:[36,10], rElbow:[64,26], rHand:[64,10]},
  "Pendulum": {...POSES.HINGE},
  "Plank Jacks": {...POSES.PLANK, rKnee:[30,60], rFoot:[26,66]},
  "Pompes": {...POSES.PLANK},
  "Pompes déclinées": {...POSES.PLANK, lFoot:[10,50], rFoot:[14,54]},
  "Pont fessier": {...POSES.BRIDGE},
  "Pont fessier unilatéral": {...POSES.BRIDGE, rKnee:[78,26], rFoot:[92,20]},
  "Push-Ups": {...POSES.PLANK},
  "Quad Sets (contraction isométrique)": {...POSES.SUPINE, rKnee:[82,26], rFoot:[92,20]},
  "Rack Carry March": {...POSES.MARCH, rElbow:[64,28], rHand:[40,28], bell:[40,28]},
  "Romanian Deadlift": {...POSES.HINGE},
  "Rotation externe (élastique ou serviette)": {...POSES.STANDING, rElbow:[62,40], rHand:[70,34]},
  "Row élastique ou serviette": {...POSES.HINGE, lHand:[42,50], rHand:[46,54]},
  "Rowing table basse": {...POSES.HINGE, lHand:[30,50], rHand:[34,54]},
  "Rétraction scapulaire": {...POSES.STANDING, lElbow:[30,36], lHand:[24,44], rElbow:[70,36], rHand:[76,44]},
  "Shadow Boxing": {...POSES.STANDING, lElbow:[38,34], lHand:[42,32], rElbow:[62,34], rHand:[58,32]},
  "Single-Arm Row": {...POSES.HINGE, rHand:[46,52]},
  "Squat": {...POSES.SQUAT, bell:null},
  "Squat Jumps": {...POSES.JUMP, lKnee:[36,64], rKnee:[64,64], lFoot:[28,88], rFoot:[72,88]},
  "Step-Ups": {...POSES.MARCH},
  "Step-up bas": {...POSES.MARCH},
  "Superman": {...POSES.PRONE_RAISE},
  "Uppercuts": {...POSES.STANDING, lElbow:[38,34], lHand:[42,26], rElbow:[62,34], rHand:[58,26]},
  "Wall Slides": {...POSES.WALLPRESS, lHand:[70,10], rHand:[78,14]},
  "Windmill": {...POSES.HINGE, rElbow:[70,20], rHand:[80,10]},
  "Élévation jambe tendue": {...POSES.SUPINE, rKnee:[76,16], rFoot:[80,4], lKnee:[50,40], lFoot:[52,50]}
};
