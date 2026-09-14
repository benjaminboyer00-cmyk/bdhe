// Ketel — shared bottom navigation
const NAV_ITEMS = [
  {key:'home', href:'index.html', label:'Accueil', pages:['index.html','']},
  {key:'programs', href:'programmes.html', label:'Programmes', pages:['programmes.html','programme.html','seance.html']},
  {key:'quiz', href:'questionnaire.html', label:'Questionnaire', pages:['questionnaire.html']},
  {key:'calc', href:'calculateurs.html', label:'Calculs', pages:['calculateurs.html']},
  {key:'progress', href:'progression.html', label:'Progression', pages:['progression.html']}
];

function currentPage(){
  const parts = location.pathname.split('/');
  return parts[parts.length-1] || 'index.html';
}

function renderBottomNav(){
  const el = document.getElementById('bottomNav');
  if(!el) return;
  const page = currentPage();
  el.innerHTML = NAV_ITEMS.map(item=>{
    const active = item.pages.includes(page);
    return `<a href="${item.href}" class="${active?'active':''}">${navIcon(item.key)}<span>${item.label}</span></a>`;
  }).join('');
}

function renderBrandMark(){
  const el = document.getElementById('brandMark');
  if(el) el.innerHTML = navIcon('mark');
}

renderBottomNav();
renderBrandMark();

if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); });
}
