const CACHE_NAME = 'timer-tv-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instalează Service Worker și salvează în Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Când nu e internet, încarcă din Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      // Dacă dă greș, se întoarce la pagina de bază (rezolvă problema de refresh offline)
      return caches.match('./index.html');
    })
  );
});
