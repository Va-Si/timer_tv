const CACHE_NAME = 'timer-tv-cache-v2'; // Am schimbat în v2!
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instalează noul Service Worker și salvează fișierele
self.addEventListener('install', event => {
  self.skipWaiting(); // Forțează noul worker să preia controlul instantaneu
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activează și ȘTERGE memoria veche
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Dacă numele cache-ului nu e 'v2', îl ștergem (deci ștergem 'v1')
          if (cacheName !== CACHE_NAME) {
            console.log('Șterg cache-ul vechi:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Strategie "Network First, fallback to Cache"
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Dacă avem internet, actualizăm automat memoria cache cu noua versiune
        if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // Dacă NU avem internet (Offline), dăm fișierul din memorie
        return caches.match(event.request).then(response => {
          return response || caches.match('./index.html');
        });
      })
  );
});
