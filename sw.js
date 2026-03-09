const CACHE = 'jarvis-v1';
const ASSETS = ['index.html', 'manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('anthropic.com')) {
    e.respondWith(fetch(e.request).catch(() =>
      new Response(JSON.stringify({
        content: [{ text: "I'm offline at the moment, sir. Please reconnect to reach the full JARVIS network." }]
      }), { headers: { 'Content-Type': 'application/json' } })
    ));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
