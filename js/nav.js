// Ketel — shared bottom navigation
const NAV_ITEMS = [
  {key:'home', href:'index.html', label:'Accueil', pages:['index.html','']},
  {key:'programs', href:'programmes.html', label:'Programmes', pages:['programmes.html','programme.html','seance.html']},
  {key:'library', href:'bibliotheque.html', label:'Exercices', pages:['bibliotheque.html']},
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

function effectiveTheme(){
  const explicit = document.documentElement.getAttribute('data-theme');
  if(explicit) return explicit;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function renderThemeToggle(){
  const top = document.querySelector('.top');
  if(!top) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'theme-toggle';
  btn.setAttribute('aria-label', 'Changer de thème');
  top.appendChild(btn);
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  function paint(){
    const theme = effectiveTheme();
    btn.innerHTML = navIcon(theme==='light' ? 'moon' : 'sun');
    if(themeColorMeta) themeColorMeta.setAttribute('content', theme==='light' ? '#f4f1ea' : '#14171a');
  }
  btn.addEventListener('click', ()=>{
    const next = effectiveTheme()==='light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try{ localStorage.setItem('ketel:theme', next); }catch(e){}
    paint();
  });
  paint();
}

renderBottomNav();
renderBrandMark();
renderThemeToggle();

if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); });
}
