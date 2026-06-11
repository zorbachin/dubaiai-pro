/* Iron Dome — offline-first service worker */
const CACHE = 'irondome-v26';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './menu-bg.jpg',
  './bg/bg1.jpg',
  './bg/bg2.jpg',
  './bg/bg3.jpg',
  './bg/bg4.jpg',
  './bg/bg5.jpg',
  './bg/bg6.jpg',
  './bg/bg7.jpg',
  './bg/bg8.jpg',
  './bg/bg9.jpg',
  './bg/bg10.jpg',
  './bg/falafel1.png',
  './bg/falafel2.png',
  './bg/falafel3.png'
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
