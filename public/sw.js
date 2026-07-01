/* Minimal service worker: network-first so content is always fresh online,
   with a same-origin cache fallback for offline. */
const CACHE = 'gh-cache-v1'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const sameOrigin = new URL(req.url).origin === self.location.origin
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (sameOrigin && res && res.status === 200) {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {})
        }
        return res
      })
      .catch(() => caches.match(req)),
  )
})
