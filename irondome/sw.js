/* Iron Dome — offline-first service worker */
const CACHE = 'irondome-v11';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
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
          }
          return res;
        })
        .catch(() => cached);
      // pages: network-first with a hang guard; assets: cache-first
      if (!isNav) return cached || fresh;
      if (!cached) return fresh;
      const hangGuard = new Promise(res => setTimeout(() => res(cached), 3000));
      return Promise.race([fresh.then(r => r || cached), hangGuard]);
    })
  );
});
