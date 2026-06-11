/* MAMAD DASH — offline-first service worker (pattern: irondome v25) */
const CACHE = 'mamaddash-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './og.jpg',
  './art/bg-beach.webp',
  './art/bg-florentin.webp',
  './art/bg-night.webp',
  './art/bg-oldnorth.webp',
  './art/door.png',
  './art/duck.png',
  './art/hero.webp',
  './art/icon.png',
  './art/jump.png',
  './art/keyart.webp',
  './art/pow-magnet.png',
  './art/pow-star.png',
  './art/pow-time.png',
  './art/run1.png',
  './art/run2.png',
  './art/savta-cart.png',
  './art/savta-judge.png',
  './art/savta-nu.png',
  './art/tumble.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Navigations: network-first with a 3s cache race (newest build when online,
   instant cache when the network hangs). Assets: cache-first. */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const isNav = e.request.mode === 'navigate' || e.request.destination === 'document';
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request)
        .then(res => {
          if (res && res.ok && new URL(e.request.url).origin === location.origin) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
            return res;
          }
          return cached || res;          // never serve a 500 over a healthy cache
        })
        .catch(() => cached || Response.error());
      // pages: network-first with a hang guard; assets: cache-first
      if (!isNav) return cached || fresh;
      if (!cached) return fresh;
      const hangGuard = new Promise(res => setTimeout(() => res(cached), 3000));
      return Promise.race([fresh.then(r => r || cached), hangGuard]);
    })
  );
});
