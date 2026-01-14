const CACHE_NAME = 'piko-marketplace-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html'
];

// Install Event: Cache core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch Event: Network First for HTML, Stale-While-Revalidate for assets
self.addEventListener('fetch', (event) => {
  // Navigation (HTML): Network -> Cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // Assets (Scripts, Images): Cache -> Network (and update cache)
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Check if we received a valid response
            if(networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              cache.put(event.request, networkResponse.clone());
            } else if (networkResponse && networkResponse.type === 'cors') {
              // Cache CORS responses (esm.sh, images)
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Network failed, return nothing (or fallback image if you had one)
          });
        return response || fetchPromise;
      });
    })
  );
});