// International Emergency Guide Service Worker

const CACHE_NAME = 'emergency-guide-cache-v1';

// URLs to cache for offline functionality
const STATIC_URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Assets to cache with longer TTL
const ASSETS_TO_CACHE = [
  '/assets/',
  '.css',
  '.js',
  '.woff2',
  '.png',
  '.jpg',
  '.svg',
  '.webp'
];

// Critical pages to precache
const PAGES_TO_CACHE = [
  '/emergency',
  '/hospitals',
  '/medications',
  '/emergency-contacts',
  '/symptom-checker',
  '/fire-safety',
  '/treatment-guidelines'
];

// Service Worker Installation
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching core app files');
        return cache.addAll(STATIC_URLS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Service Worker Activation (cleanup old caches)
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[ServiceWorker] Clearing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event handler to provide offline content
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip for browser-sync
  if (url.pathname.startsWith('/__')) {
    return;
  }
  
  // For navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Return cached home page if offline and requesting a page
          return caches.match('/') 
            .then(response => {
              return response || new Response('You are offline. Please reconnect to use the application.', {
                headers: { 'Content-Type': 'text/html' }
              });
            });
        })
    );
    return;
  }
  
  // For assets and static files, use a "Cache First" strategy with 
  // network fallback for non-static assets
  const isAsset = ASSETS_TO_CACHE.some(assetType => 
    url.pathname.includes(assetType) || 
    url.pathname.startsWith(assetType)
  );
  
  if (isAsset) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // Return cached response if found
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Otherwise get from network and cache
          return fetch(event.request)
            .then((response) => {
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Cache the fetched response
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
                
              return response;
            })
            .catch(() => {
              // Fallback for images
              if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
                return new Response(
                  '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">' +
                  '<rect width="400" height="300" fill="#eee"/>' +
                  '<text x="200" y="150" fill="#888" text-anchor="middle" dominant-baseline="middle" font-family="Arial">Image Unavailable Offline</text>' +
                  '</svg>',
                  { headers: { 'Content-Type': 'image/svg+xml' } }
                );
              }
            });
        })
    );
  } else {
    // Network first for API requests
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'emergency-data-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Function to sync data when back online
async function syncOfflineData() {
  // Implement any data sync logic here
  console.log('[ServiceWorker] Syncing offline data');
  
  // This would typically handle any queued offline actions
  // Like emergency form submissions that failed due to network
}

// Listen for push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const title = data.title || 'Emergency Alert';
  const options = {
    body: data.body || 'Important emergency information',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: data.url ? { url: data.url } : {}
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});