// Service Worker for Emergency Guide App
const CACHE_NAME = 'emergency-guide-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
  // Add more assets that need to be cached for offline use
];

// Install event - cache all essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream that can only be consumed once
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response because it's a stream that can only be consumed once
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Don't cache API requests or external resources
                if (!event.request.url.includes('/api/') && 
                    event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });
            
            return response;
          })
          .catch(() => {
            // Network request failed, try to return an offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            return null;
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheAllowlist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            // If this cache name isn't in our allowlist, delete it
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});

// Handle offline requests for images by providing a fallback
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
            .catch(() => {
              // Return a fallback image if network is offline and image is not cached
              // You can create a small fallback image and cache it
              return new Response('Image not available offline', { status: 200 });
            });
        })
    );
  }
});