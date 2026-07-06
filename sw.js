const CACHE_NAME = 'raid-notes-v2';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './guides/rotmire.html',
  './guides/averzian.html',
  './guides/vorasius.html',
  './guides/salhadaar.html',
  './guides/vanguard.html',
  './guides/cosmos.html',
  './guides/chimaerus.html',
  './guides/beloren.html',
  './guides/midnightfalls.html',
  './images/rotmire-boss-guide.png',
  './images/averzian-1-overview.png',
  './images/averzian-2-claiming.png',
  './images/averzian-3-raidmech.png',
  './images/averzian-4-tank.png',
  './images/vorasius-guide.png',
  './images/salhadaar-1-core-threats.png',
  './images/salhadaar-2-energy-tank.png',
  './images/vanguard-1-overview.png',
  './images/vanguard-2-tank.png',
  './images/cosmos-1-phase1.png',
  './images/cosmos-2-intermission-phase2.png',
  './images/cosmos-3-intermission2-phase3.png',
  './images/cosmos-4-tank.png',
  './images/chimaerus-1-overview.png',
  './images/chimaerus-2-phase1.png',
  './images/chimaerus-3-phase2.png',
  './images/chimaerus-4-tank.png',
  './images/beloren-1-colors-phase1.png',
  './images/beloren-2-phase2.png',
  './images/beloren-3-tank.png',
  './images/midnightfalls-1-phase1.png',
  './images/midnightfalls-2-intermission-phase2.png',
  './images/midnightfalls-3-phase3.png',
  './images/midnightfalls-4-tank.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first: serve from cache, fall back to network, and cache new responses as they come in.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
