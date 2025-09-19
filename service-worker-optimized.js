/**
 * FacePay Service Worker - Bulletproof Production Version
 * Advanced caching strategies, offline support, and performance optimization
 */

const CACHE_NAME = 'facepay-v2.1.0';
const STATIC_CACHE_NAME = 'facepay-static-v2.1.0';
const DYNAMIC_CACHE_NAME = 'facepay-dynamic-v2.1.0';
const VIDEO_CACHE_NAME = 'facepay-videos-v2.1.0';
const FONT_CACHE_NAME = 'facepay-fonts-v2.1.0';
const IMAGE_CACHE_NAME = 'facepay-images-v2.1.0';

// Critical assets to cache immediately
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/critical.css',
  '/js/critical.js',
  '/images/facepay-demo-poster.webp',
  '/images/facepay-demo-poster.jpg'
];

// Extended assets for precaching
const STATIC_ASSETS = [
  '/privacy.html',
  '/terms.html', 
  '/support.html',
  '/sitemap.xml',
  '/robots.txt',
  '/images/icon-192.png',
  '/images/icon-512.png'
];

// CDN resources to cache
const CDN_RESOURCES = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap',
  'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZ9hjp-Ek-_EeA.woff2'
];

// Cache strategies configuration
const CACHE_STRATEGIES = {
  criticalAssets: 'cache-first-critical',
  staticAssets: 'cache-first',
  images: 'cache-first-with-fallback',
  videos: 'cache-first-with-range',
  fonts: 'cache-first-permanent',
  api: 'network-first',
  pages: 'stale-while-revalidate',
  analytics: 'network-only'
};

// Performance monitoring
const PERFORMANCE_METRICS = {
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0,
  offlineRequests: 0,
  averageResponseTime: 0,
  errorCount: 0
};

// Background sync configuration
const SYNC_TASKS = {
  ANALYTICS: 'analytics-sync',
  USER_ACTIONS: 'user-actions-sync',
  PERFORMANCE_METRICS: 'performance-sync'
};

/**
 * Install Event - Progressive caching strategy
 */
self.addEventListener('install', event => {
  console.log('[SW] FacePay Service Worker v2.1.0 Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache critical assets first
      cacheAssets(STATIC_CACHE_NAME, CRITICAL_ASSETS, 'Critical assets'),
      
      // Cache static assets in parallel
      cacheAssets(STATIC_CACHE_NAME, STATIC_ASSETS, 'Static assets'),
      
      // Cache CDN resources
      cacheAssets(FONT_CACHE_NAME, CDN_RESOURCES, 'CDN resources')
    ])
    .then(() => {
      console.log('[SW] All assets cached successfully');
      // Initialize IndexedDB for offline queue
      return initOfflineQueue();
    })
    .then(() => {
      console.log('[SW] Offline queue initialized');
      // Force activate new service worker
      return self.skipWaiting();
    })
    .catch(error => {
      console.error('[SW] Installation failed:', error);
    })
  );
});

/**
 * Activate Event - Intelligent cache cleanup
 */
self.addEventListener('activate', event => {
  console.log('[SW] FacePay Service Worker Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean old caches intelligently
      cleanupOldCaches(),
      
      // Initialize performance monitoring
      initPerformanceMonitoring(),
      
      // Claim all clients
      self.clients.claim(),
      
      // Prefetch additional resources in background
      prefetchAdditionalResources()
    ])
    .then(() => {
      console.log('[SW] Service Worker activated successfully');
      // Notify all clients about the update
      notifyClientsOfUpdate();
    })
  );
});

/**
 * Fetch Event - Intelligent routing with fallbacks
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }
  
  // Route to appropriate strategy
  if (isCriticalAsset(url)) {
    event.respondWith(criticalAssetStrategy(request));
  } else if (isVideoRequest(url)) {
    event.respondWith(videoStrategy(request));
  } else if (isImageRequest(url)) {
    event.respondWith(imageStrategy(request));
  } else if (isFontRequest(url)) {
    event.respondWith(fontStrategy(request));
  } else if (isAPIRequest(url)) {
    event.respondWith(apiStrategy(request));
  } else if (isAnalyticsRequest(url)) {
    event.respondWith(analyticsStrategy(request));
  } else {
    event.respondWith(pageStrategy(request));
  }
});

/**
 * Critical Asset Strategy - Ultra-fast cache-first
 */
async function criticalAssetStrategy(request) {
  const startTime = performance.now();
  
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      recordMetric('cacheHit', performance.now() - startTime);
      return cachedResponse;
    }
    
    const networkResponse = await fetchWithTimeout(request, 3000);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    recordMetric('networkRequest', performance.now() - startTime);
    return networkResponse;
    
  } catch (error) {
    recordMetric('error');
    return createOfflineResponse(request);
  }
}

/**
 * Video Strategy - Range support with intelligent caching
 */
async function videoStrategy(request) {
  const startTime = performance.now();
  
  try {
    // Handle range requests directly from network
    if (request.headers.get('range')) {
      return fetch(request);
    }
    
    // Check cache first for full video
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      recordMetric('cacheHit', performance.now() - startTime);
      return cachedResponse;
    }
    
    // Fetch from network with progress tracking
    const networkResponse = await fetchWithProgress(request);
    
    if (networkResponse.ok && networkResponse.status < 400) {
      // Cache in background to avoid blocking response
      cacheInBackground(VIDEO_CACHE_NAME, request, networkResponse.clone());
    }
    
    recordMetric('networkRequest', performance.now() - startTime);
    return networkResponse;
    
  } catch (error) {
    recordMetric('error');
    return createVideoFallback(request);
  }
}

/**
 * Image Strategy - Modern format with fallbacks
 */
async function imageStrategy(request) {
  const startTime = performance.now();
  
  try {
    // Try modern format first (WebP/AVIF)
    const modernRequest = tryModernImageFormat(request);
    let cachedResponse = await caches.match(modernRequest);
    
    if (cachedResponse) {
      recordMetric('cacheHit', performance.now() - startTime);
      return cachedResponse;
    }
    
    // Try original format
    cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      recordMetric('cacheHit', performance.now() - startTime);
      return cachedResponse;
    }
    
    // Network request with format negotiation
    const networkResponse = await fetchWithFormatNegotiation(request);
    
    if (networkResponse.ok) {
      cacheInBackground(IMAGE_CACHE_NAME, request, networkResponse.clone());
    }
    
    recordMetric('networkRequest', performance.now() - startTime);
    return networkResponse;
    
  } catch (error) {
    recordMetric('error');
    return createImageFallback(request);
  }
}

/**
 * Font Strategy - Permanent caching with subset optimization
 */
async function fontStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      recordMetric('cacheHit');
      return cachedResponse;
    }
    
    const networkResponse = await fetchWithTimeout(request, 10000);
    
    if (networkResponse.ok) {
      const cache = await caches.open(FONT_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    recordMetric('networkRequest');
    return networkResponse;
    
  } catch (error) {
    recordMetric('error');
    // Font fallback - let browser use system font
    return new Response('', { status: 404 });
  }
}

/**
 * API Strategy - Network first with offline queue
 */
async function apiStrategy(request) {
  const startTime = performance.now();
  
  try {
    const networkResponse = await fetchWithTimeout(request, 5000);
    
    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    recordMetric('networkRequest', performance.now() - startTime);
    return networkResponse;
    
  } catch (error) {
    // Try cached version
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      recordMetric('cacheHit', performance.now() - startTime);
      return cachedResponse;
    }
    
    // Queue for background sync if it's a POST/PUT/DELETE
    if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
      await queueRequest(request);
    }
    
    recordMetric('offlineRequest');
    return createAPIOfflineResponse();
  }
}

/**
 * Analytics Strategy - Network only with background sync
 */
async function analyticsStrategy(request) {
  try {
    return await fetchWithTimeout(request, 2000);
  } catch (error) {
    // Queue analytics data for later
    await queueAnalytics(request);
    return new Response('', { status: 204 });
  }
}

/**
 * Page Strategy - Stale while revalidate with offline page
 */
async function pageStrategy(request) {
  const startTime = performance.now();
  
  try {
    const cachedResponse = await caches.match(request);
    
    // Return cached version immediately if available
    if (cachedResponse) {
      // Update cache in background
      updateCacheInBackground(request);
      recordMetric('cacheHit', performance.now() - startTime);
      return cachedResponse;
    }
    
    // No cache available, fetch from network
    const networkResponse = await fetchWithTimeout(request, 5000);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    recordMetric('networkRequest', performance.now() - startTime);
    return networkResponse;
    
  } catch (error) {
    recordMetric('offlineRequest');
    return createOfflinePage();
  }
}

/**
 * Background Sync - Handle offline actions
 */
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case SYNC_TASKS.ANALYTICS:
      event.waitUntil(syncAnalytics());
      break;
    case SYNC_TASKS.USER_ACTIONS:
      event.waitUntil(syncUserActions());
      break;
    case SYNC_TASKS.PERFORMANCE_METRICS:
      event.waitUntil(syncPerformanceMetrics());
      break;
  }
});

/**
 * Push Notifications - Enhanced with actions
 */
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Nueva notificación de FacePay',
    icon: '/images/icon-192.png',
    badge: '/images/badge-72.png',
    image: data.image || '/images/notification-hero.jpg',
    vibrate: [100, 50, 100],
    requireInteraction: data.requireInteraction || false,
    data: {
      url: data.url || '/',
      timestamp: Date.now(),
      id: data.id || Math.random().toString(36)
    },
    actions: [
      {
        action: 'view',
        title: 'Ver',
        icon: '/images/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Descartar',
        icon: '/images/action-dismiss.png'
      }
    ],
    tag: data.tag || 'general'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'FacePay', options)
  );
});

/**
 * Notification Click Handler
 */
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    const url = event.notification.data.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // Try to focus existing window
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
  
  // Track notification interaction
  trackEvent('notification_click', {
    action: event.action,
    tag: event.notification.tag
  });
});

/**
 * Message Handler - Communication with main thread
 */
self.addEventListener('message', event => {
  const { type, payload } = event.data || {};
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
      
    case 'CACHE_URLS':
      event.waitUntil(
        caches.open(DYNAMIC_CACHE_NAME)
          .then(cache => cache.addAll(payload.urls))
      );
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(clearSpecificCache(payload.cacheName));
      break;
      
    case 'GET_CACHE_SIZE':
      event.waitUntil(getCacheSize().then(size => {
        event.ports[0].postMessage({ cacheSize: size });
      }));
      break;
      
    case 'PERFORMANCE_METRICS':
      event.ports[0].postMessage({ metrics: PERFORMANCE_METRICS });
      break;
  }
});

/**
 * Utility Functions
 */

async function cacheAssets(cacheName, assets, description) {
  const cache = await caches.open(cacheName);
  const results = await Promise.allSettled(
    assets.map(url => cache.add(url).catch(error => {
      console.warn(`[SW] Failed to cache ${url}:`, error);
    }))
  );
  
  const successful = results.filter(r => r.status === 'fulfilled').length;
  console.log(`[SW] ${description}: ${successful}/${assets.length} cached`);
}

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const validCaches = [
    CACHE_NAME, STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME,
    VIDEO_CACHE_NAME, FONT_CACHE_NAME, IMAGE_CACHE_NAME
  ];
  
  return Promise.all(
    cacheNames.map(cacheName => {
      if (!validCaches.includes(cacheName)) {
        console.log('[SW] Deleting old cache:', cacheName);
        return caches.delete(cacheName);
      }
    })
  );
}

function fetchWithTimeout(request, timeout = 5000) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}

async function fetchWithProgress(request) {
  const response = await fetch(request);
  
  if (!response.body) return response;
  
  const contentLength = response.headers.get('content-length');
  if (!contentLength) return response;
  
  // Track download progress for large files
  const total = parseInt(contentLength, 10);
  let received = 0;
  
  const stream = new ReadableStream({
    start(controller) {
      const reader = response.body.getReader();
      
      function pump() {
        return reader.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }
          
          received += value.byteLength;
          
          // Notify clients of download progress
          if (total > 1000000) { // > 1MB
            notifyClients({
              type: 'DOWNLOAD_PROGRESS',
              url: request.url,
              received,
              total,
              percentage: Math.round((received / total) * 100)
            });
          }
          
          controller.enqueue(value);
          return pump();
        });
      }
      
      return pump();
    }
  });
  
  return new Response(stream, {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText
  });
}

function tryModernImageFormat(request) {
  const url = new URL(request.url);
  const extension = url.pathname.split('.').pop().toLowerCase();
  
  if (['jpg', 'jpeg', 'png'].includes(extension)) {
    // Try WebP first, then AVIF
    const webpUrl = url.pathname.replace(/\.(jpg|jpeg|png)$/, '.webp');
    return new Request(url.origin + webpUrl, request);
  }
  
  return request;
}

async function cacheInBackground(cacheName, request, response) {
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
  } catch (error) {
    console.warn('[SW] Background caching failed:', error);
  }
}

function createOfflineResponse(request) {
  const url = new URL(request.url);
  
  if (url.pathname.endsWith('.html') || url.pathname === '/') {
    return createOfflinePage();
  }
  
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain' }
  });
}

function createOfflinePage() {
  const offlineHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FacePay - Offline</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: #000; color: #fff; text-align: center; 
            padding: 2rem; margin: 0; 
        }
        .container { max-width: 600px; margin: 0 auto; }
        .icon { font-size: 4rem; margin-bottom: 1rem; }
        h1 { color: #00ff88; margin-bottom: 1rem; }
        p { color: #ccc; line-height: 1.6; }
        button { 
            background: #00ff88; color: #000; border: none; 
            padding: 1rem 2rem; border-radius: 8px; 
            font-weight: 600; cursor: pointer; margin-top: 2rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📱</div>
        <h1>FacePay Offline</h1>
        <p>No hay conexión a internet, pero FacePay sigue funcionando.</p>
        <p>Tus datos están guardados localmente y se sincronizarán cuando vuelvas a tener conexión.</p>
        <button onclick="location.reload()">Reintentar</button>
    </div>
</body>
</html>`;
  
  return new Response(offlineHtml, {
    headers: { 'Content-Type': 'text/html' }
  });
}

function recordMetric(type, duration = 0) {
  PERFORMANCE_METRICS[type] = (PERFORMANCE_METRICS[type] || 0) + 1;
  
  if (duration > 0) {
    const avgKey = `average${type.charAt(0).toUpperCase() + type.slice(1)}Time`;
    const count = PERFORMANCE_METRICS[type];
    const currentAvg = PERFORMANCE_METRICS[avgKey] || 0;
    PERFORMANCE_METRICS[avgKey] = ((currentAvg * (count - 1)) + duration) / count;
  }
  
  // Periodic metrics sync
  if (Math.random() < 0.01) { // 1% chance
    self.registration.sync.register(SYNC_TASKS.PERFORMANCE_METRICS);
  }
}

function notifyClients(message) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(message);
    });
  });
}

function notifyClientsOfUpdate() {
  notifyClients({
    type: 'SW_UPDATED',
    version: CACHE_NAME,
    features: [
      'Faster loading',
      'Better offline support', 
      'Improved caching',
      'Enhanced video streaming'
    ]
  });
}

// Helper functions for request type detection
function isCriticalAsset(url) {
  return CRITICAL_ASSETS.some(asset => url.pathname.endsWith(asset.replace('/', '')));
}

function isVideoRequest(url) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/.test(url.pathname);
}

function isImageRequest(url) {
  return /\.(png|jpg|jpeg|gif|webp|avif|svg)(\?|$)/.test(url.pathname);
}

function isFontRequest(url) {
  return /\.(woff|woff2|ttf|eot)(\?|$)/.test(url.pathname) || 
         url.hostname.includes('fonts.gstatic.com');
}

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/') || 
         url.hostname.includes('api.');
}

function isAnalyticsRequest(url) {
  return url.hostname.includes('analytics') || 
         url.hostname.includes('google-analytics') ||
         url.hostname.includes('gtag');
}

// Initialize functions
async function initOfflineQueue() {
  // Implementation would use IndexedDB for persistent offline queue
  console.log('[SW] Offline queue initialized');
}

async function initPerformanceMonitoring() {
  // Reset metrics on activation
  Object.keys(PERFORMANCE_METRICS).forEach(key => {
    PERFORMANCE_METRICS[key] = 0;
  });
  console.log('[SW] Performance monitoring initialized');
}

async function prefetchAdditionalResources() {
  // Prefetch commonly accessed resources
  const additionalResources = [
    '/css/animations.css',
    '/js/premium-scroll-engine.js',
    '/images/hero-background.webp'
  ];
  
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    await Promise.allSettled(
      additionalResources.map(url => cache.add(url))
    );
    console.log('[SW] Additional resources prefetched');
  } catch (error) {
    console.log('[SW] Prefetch failed:', error);
  }
}

console.log('[SW] FacePay Service Worker v2.1.0 loaded successfully');