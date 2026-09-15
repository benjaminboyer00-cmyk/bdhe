// Ketel — service worker: app shell cached for offline use, stale-while-revalidate.
const CACHE = 'ketel-v5';
const ASSETS = [
  'index.html','programmes.html','programme.html','seance.html',
  'questionnaire.html','calculateurs.html','progression.html','settings.html','bibliotheque.html',
  'css/style.css',
  'js/icons.js','js/figures.js','js/store.js','js/util.js','js/nav.js',
  'js/dashboard.js','js/programmes.js','js/programme.js','js/seance.js',
  'js/quiz.js','js/calculators.js','js/progression.js','js/settings.js','js/bibliotheque.js',
  'data/programs.js','data/exercises.js','manifest.json','icons/icon.svg','icons/icon-192.png','icons/icon-512.png'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', e=>{
  const req = e.request;
  if(req.method!=='GET') return;
  const url = new URL(req.url);
  if(url.origin!==location.origin) return;
  // Navigations are cached by path only, so any ?id=&s= variant of seance.html
  // still resolves offline instead of only the exact query string first visited.
  const cacheKey = req.mode==='navigate' ? new Request(url.origin+url.pathname) : req;
  e.respondWith(
    caches.match(cacheKey).then(cached=>{
      const network = fetch(req).then(res=>{
        if(res.ok) caches.open(CACHE).then(c=>c.put(cacheKey, res.clone()));
        return res;
      }).catch(()=>cached);
      return cached || network;
    })
  );
});
