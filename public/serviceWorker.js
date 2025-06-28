// International Emergency Guide Service Worker
// Enhanced for both web and app functionality

const CACHE_NAME = 'emergency-guide-cache-v2';
const DATA_CACHE_NAME = 'emergency-guide-data-cache-v2';
const APP_VERSION = '1.0.0';

// URLs to cache for offline functionality
const STATIC_URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/data/protocols.json',
  '/data/hospitals.json',
  '/data/medications.json',
  '/data/emergency-contacts.json'
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

// Combine all URLs to cache
const urlsToCache = [
  ...STATIC_URLS_TO_CACHE,
  ...PAGES_TO_CACHE
];

// Service Worker Installation
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing');
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[ServiceWorker] Caching core app files');
      
      // Cache known assets first
      await cache.addAll(STATIC_URLS_TO_CACHE);
      
      // Try to cache page routes - this might fail in development but should work in production
      try {
        await cache.addAll(PAGES_TO_CACHE);
      } catch (error) {
        console.warn('[ServiceWorker] Some page routes could not be cached', error);
      }
      
      // Immediately take control of any open clients
      await self.skipWaiting();
      console.log('[ServiceWorker] Installation complete, ready to handle fetches');
    })()
  );
});

// Service Worker Activation (cleanup old caches)
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating');
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          if (
            cacheName !== CACHE_NAME &&
            cacheName !== DATA_CACHE_NAME &&
            cacheName.startsWith('emergency-guide-')
          ) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
      
      // Send message to clients about the update
      const clients = await self.clients.matchAll({ includeUncontrolled: true });
      clients.forEach(client => {
        client.postMessage({
          type: 'SERVICE_WORKER_UPDATED',
          version: APP_VERSION
        });
      });
      
      // Take control of all clients
      await self.clients.claim();
      console.log('[ServiceWorker] Service worker now controls all clients');
    })()
  );
});

// Helper function to determine if a request should use cache-first strategy
function shouldUseCacheFirst(url) {
  // Always use cache-first for static assets
  const isAsset = ASSETS_TO_CACHE.some(assetType => 
    url.pathname.includes(assetType) || 
    url.pathname.startsWith(assetType)
  );
  
  // Also use cache-first for specific routes we've cached
  const isCachedPage = PAGES_TO_CACHE.some(page => 
    url.pathname === page || 
    url.pathname.startsWith(page + '/')
  );
  
  return isAsset || isCachedPage || url.pathname === '/';
}

// Fetch event handler with differentiated strategies based on request type
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip for browser-sync or extensions
  if (url.pathname.startsWith('/__') || !url.hostname.includes(self.location.hostname)) {
    return;
  }
  
  // Differentiate between API requests and page/asset requests
  const isAPIRequest = url.pathname.startsWith('/api/');
  
  // Use different caching strategies based on request type
  if (isAPIRequest) {
    // For API requests: Network first, fallback to cache
    event.respondWith(networkFirstWithCache(event.request, DATA_CACHE_NAME));
  } else if (event.request.mode === 'navigate') {
    // For navigation (HTML pages): Try network first, fall back to cache
    event.respondWith(handleNavigationRequest(event.request));
  } else if (shouldUseCacheFirst(url)) {
    // For assets and cached pages: Cache first, network fallback
    event.respondWith(cacheFirstWithNetwork(event.request));
  } else {
    // For everything else, use network first
    event.respondWith(networkFirstWithCache(event.request, CACHE_NAME));
  }
});

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try to get from network first
    const networkResponse = await fetch(request);
    
    // If successful, clone and cache
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // If offline, try to get from cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If page isn't in cache, try the home page
    const homeResponse = await caches.match('/');
    
    if (homeResponse) {
      return homeResponse;
    }
    
    // If everything fails, show an offline page
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - International Emergency Guide</title>
        <style>
          body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; text-align: center; }
          .offline-container { max-width: 500px; margin: 80px auto; }
          h1 { color: #dc3545; }
          .icon { font-size: 64px; margin-bottom: 20px; }
          .action-btn { background: #dc3545; color: white; border: none; padding: 10px 20px; 
                      border-radius: 4px; margin-top: 20px; cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <div class="icon">⚠️</div>
          <h1>You're Offline</h1>
          <p>The International Emergency Guide can't be reached right now because you're not connected to the internet.</p>
          <p>Some features and pages are available offline. Try accessing the home page or emergency protocols.</p>
          <button class="action-btn" onclick="window.location.href='/'">Try Home Page</button>
        </div>
      </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}

// Cache-first strategy with network fallback
async function cacheFirstWithNetwork(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Return from cache and update cache in background if this is a key resource
    if (shouldUseCacheFirst(new URL(request.url))) {
      fetch(request)
        .then(async (networkResponse) => {
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse);
          }
        })
        .catch(() => {
          // Silently fail on background update
        });
    }
    return cachedResponse;
  }
  
  // Not in cache, try network
  try {
    const networkResponse = await fetch(request);
    
    // Cache the successful response
    if (networkResponse.ok && networkResponse.type === 'basic') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Everything failed, provide appropriate fallback
    if (request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
      return createImageFallback();
    }
    
    // Other file types have no fallback
    return new Response('Network error', { status: 408, statusText: 'Network Error' });
  }
}

// Network-first strategy with cache fallback
async function networkFirstWithCache(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache valid responses
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Both network and cache failed
    throw error;
  }
}

// Create fallback image for missing images
function createImageFallback() {
  return new Response(
    '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">' +
    '<rect width="400" height="300" fill="#f8f9fa"/>' +
    '<text x="200" y="150" fill="#6c757d" text-anchor="middle" dominant-baseline="middle" font-family="Arial">Image Unavailable Offline</text>' +
    '</svg>',
    { 
      headers: { 
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-store' 
      } 
    }
  );
}

// Background sync for offline data synchronization
self.addEventListener('sync', (event) => {
  if (event.tag === 'emergency-data-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Function to sync data when back online
async function syncOfflineData() {
  try {
    // Get any pending data from IndexedDB or localStorage
    const pendingData = localStorage.getItem('emergency-pendingSync');
    
    if (pendingData) {
      // Process and send the data
      console.log('[ServiceWorker] Processing offline data sync');
      
      // Clear the pending data after successful sync
      localStorage.removeItem('emergency-pendingSync');
      
      // Notify clients about successful sync
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETED',
          timestamp: new Date().toISOString()
        });
      });
    }
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
  }
}

// Listen for push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const title = data.title || 'Emergency Alert';
    const options = {
      body: data.body || 'Important emergency information',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: data.url ? { url: data.url } : {},
      tag: 'emergency-notification',
      renotify: true,
      actions: [
        {
          action: 'view',
          title: 'View Details'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (error) {
    console.error('[ServiceWorker] Push notification failed:', error);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  let targetUrl = '/';
  
  if (event.action === 'view' && event.notification.data && event.notification.data.url) {
    targetUrl = event.notification.data.url;
  } else if (event.notification.data && event.notification.data.url) {
    targetUrl = event.notification.data.url;
  }
  
  event.waitUntil(
    (async () => {
      // First try to find an existing window to focus
      const allClients = await clients.matchAll({
        includeUncontrolled: true,
        type: 'window'
      });
      
      for (const client of allClients) {
        if (client.url === targetUrl && 'focus' in client) {
          await client.focus();
          return;
        }
      }
      
      // If no existing window, open a new one
      if (clients.openWindow) {
        await clients.openWindow(targetUrl);
      }
    })()
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_VERSION') {
    event.source.postMessage({
      type: 'VERSION_INFO',
      version: APP_VERSION
    });
  }
});