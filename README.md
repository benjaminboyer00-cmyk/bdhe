# Ketel

Compagnon d'entraînement — programmes de force, endurance, perte de poids et rééducation, questionnaire adaptatif, calculateurs (IMC, protéines, calories) et suivi de progression avec chronomètre de séance.

Site statique, sans framework ni étape de build (déployable tel quel sur Vercel).

## Structure

- `index.html` — accueil / dashboard
- `programmes.html` — catalogue des programmes, filtrable par objectif
- `programme.html` — détail d'un programme et de ses séances (`?id=`)
- `seance.html` — séance en cours avec chronomètre (`?id=&s=`)
- `questionnaire.html` — QCM qui recommande un programme
- `calculateurs.html` — IMC, protéines, besoins caloriques
- `progression.html` — historique et statistiques
- `css/style.css` — design system partagé
- `js/` — logique par page + utilitaires partagés (`store.js`, `util.js`, `nav.js`, `icons.js`)
- `data/programs.js` — contenu des programmes et patrons de mouvement

Les données utilisateur (profil, historique, séance en cours) sont stockées en `localStorage`, sans backend.
