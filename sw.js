/* Miklat Games portal SW — shell only. NEVER touches the games:
   /irondome/ and /mamadio/ run their own service workers and must
   keep self-updating. */
const CACHE = 'miklat-portal-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k.startsWith('miklat-')).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const path = new URL(e.request.url).pathname;
  if (path.includes('/irondome/') || path.includes('/mamadio/')) return;   // hands off the games
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
          return cached || res;
        })
        .catch(() => cached || Response.error());
      if (!isNav) return cached || fresh;
      if (!cached) return fresh;
      const hangGuard = new Promise(res => setTimeout(() => res(cached), 3000));
      return Promise.race([fresh.then(r => r || cached), hangGuard]);
    })
  );
});
