const CACHE_NAME = 'raid-notes-v4';

// Images and icons rarely change once a guide is built — safe to cache aggressively.
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

const PRECACHE_URLS = [
  './index.html',
  './manifest.json',
  './rotmire-boss-guide.png',
  './averzian-1-overview.png',
  './averzian-2-claiming.png',
  './averzian-3-raidmech.png',
  './averzian-4-tank.png',
  './vorasius-guide.png',
  './salhadaar-1-core-threats.png',
  './salhadaar-2-energy-tank.png',
  './vanguard-1-overview.png',
  './vanguard-2-tank.png',
  './cosmos-1-phase1.png',
  './cosmos-2-intermission-phase2.png',
  './cosmos-3-intermission2-phase3.png',
  './cosmos-4-tank.png',
  './chimaerus-1-overview.png',
  './chimaerus-2-phase1.png',
  './chimaerus-3-phase2.png',
  './chimaerus-4-tank.png',
  './beloren-1-colors-phase1.png',
  './beloren-2-phase2.png',
  './beloren-3-tank.png',
  './midnightfalls-1-phase1.png',
  './midnightfalls-2-intermission-phase2.png',
  './midnightfalls-3-phase3.png',
  './midnightfalls-4-tank.png',
  './icon-192.png',
  './icon-512.png'
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

function isImage(url) {
  return IMAGE_EXTENSIONS.some((ext) => url.endsWith(ext));
}

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // HTML pages (including index.html and every guide page): always try the
  // network first so updates show up immediately. Only fall back to the
  // cached copy if there's no signal at all.
  const isHTML = event.request.mode === 'navigate' || url.endsWith('.html') || url.endsWith('/');

  if (isHTML) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Images and everything else: serve from cache instantly if we have it,
  // otherwise fetch and store it for next time.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
