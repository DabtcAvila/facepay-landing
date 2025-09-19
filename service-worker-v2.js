/**
 * SERVICE WORKER V2 - Advanced Performance Optimization
 * Intelligent caching, offline support, and performance monitoring
 */

const SW_VERSION = '2.1.0';
const CACHE_PREFIX = 'facepay-v2';
const STATIC_CACHE = `${CACHE_PREFIX}-static-${SW_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-${SW_VERSION}`;
const IMAGES_CACHE = `${CACHE_PREFIX}-images-${SW_VERSION}`;
const FONTS_CACHE = `${CACHE_PREFIX}-fonts-${SW_VERSION}`;
const VIDEO_CACHE = `${CACHE_PREFIX}-videos-${SW_VERSION}`;

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
    '/',
    '/index.html',
    '/critical.css',
    '/performance.js',
    '/manifest.json'
];

// Runtime caching configuration
const CACHE_CONFIGS = {
    // Static assets - cache first, long TTL
    static: {
        strategy: 'CacheFirst',
        expiration: 30 * 24 * 60 * 60 * 1000, // 30 days
        maxEntries: 100
    },
    // Images - cache first with compression
    images: {
        strategy: 'CacheFirst',
        expiration: 7 * 24 * 60 * 60 * 1000, // 7 days
        maxEntries: 50,
        plugins: ['compressionPlugin']
    },
    // Fonts - cache first, very long TTL
    fonts: {
        strategy: 'CacheFirst',
        expiration: 365 * 24 * 60 * 60 * 1000, // 1 year
        maxEntries: 10
    },
    // Videos - cache first with chunking
    videos: {
        strategy: 'CacheFirst',
        expiration: 3 * 24 * 60 * 60 * 1000, // 3 days
        maxEntries: 5
    },
    // API calls - network first
    api: {
        strategy: 'NetworkFirst',
        expiration: 5 * 60 * 1000, // 5 minutes
        maxEntries: 20
    },
    // Pages - stale while revalidate
    pages: {
        strategy: 'StaleWhileRevalidate',
        expiration: 24 * 60 * 60 * 1000, // 1 day
        maxEntries: 10
    }
};

// Performance monitoring
let performanceMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    networkRequests: 0,
    avgResponseTime: 0,
    totalRequests: 0
};

// Install event - Aggressive caching of critical resources
self.addEventListener('install', event => {
    console.log(`[SW v${SW_VERSION}] Installing...`);
    
    event.waitUntil(
        (async () => {
            try {
                // Cache critical resources
                const staticCache = await caches.open(STATIC_CACHE);
                await staticCache.addAll(CRITICAL_RESOURCES);
                
                // Preload additional resources
                await preloadOptionalResources();
                
                console.log(`[SW v${SW_VERSION}] Critical resources cached`);
                
                // Skip waiting to activate immediately
                self.skipWaiting();
            } catch (error) {
                console.error('[SW] Installation failed:', error);
            }
        })()
    );
});

// Preload optional resources for better performance
async function preloadOptionalResources() {
    try {
        const fontsCache = await caches.open(FONTS_CACHE);
        const fontUrls = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap'
        ];
        await fontsCache.addAll(fontUrls);
        
        console.log('[SW] Optional resources preloaded');
    } catch (error) {
        console.warn('[SW] Optional preload failed:', error);
    }
}

// Activate event - Clean old caches and claim clients
self.addEventListener('activate', event => {
    console.log(`[SW v${SW_VERSION}] Activating...`);
    
    event.waitUntil(
        (async () => {
            // Clean old caches
            await cleanOldCaches();
            
            // Claim all clients immediately
            await self.clients.claim();
            
            console.log(`[SW v${SW_VERSION}] Activated and claimed all clients`);
        })()
    );
});

// Clean old cache versions
async function cleanOldCaches() {
    const cacheNames = await caches.keys();
    const currentCaches = [STATIC_CACHE, RUNTIME_CACHE, IMAGES_CACHE, FONTS_CACHE, VIDEO_CACHE];
    
    const deletionPromises = cacheNames
        .filter(cacheName => 
            cacheName.startsWith(CACHE_PREFIX) && !currentCaches.includes(cacheName)
        )
        .map(cacheName => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
        });
    
    await Promise.all(deletionPromises);
}

// Main fetch handler with intelligent routing
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Skip chrome-extension and other protocols
    if (!url.protocol.startsWith('http')) return;
    
    // Skip requests with query parameters that indicate dynamic content
    if (url.search.includes('nocache') || url.search.includes('timestamp')) return;
    
    // Route to appropriate handler
    event.respondWith(handleRequest(request));
});

// Intelligent request handler with caching strategies
async function handleRequest(request) {
    const url = new URL(request.url);
    const startTime = performance.now();
    
    try {
        let response;
        
        if (isCriticalResource(url)) {
            response = await cacheFirstStrategy(request, STATIC_CACHE);
        } else if (isImageRequest(url)) {
            response = await cacheFirstStrategy(request, IMAGES_CACHE);
        } else if (isFontRequest(url)) {
            response = await cacheFirstStrategy(request, FONTS_CACHE);
        } else if (isVideoRequest(url)) {
            response = await videoStrategy(request);
        } else if (isAPIRequest(url)) {
            response = await networkFirstStrategy(request, RUNTIME_CACHE);
        } else {
            response = await staleWhileRevalidateStrategy(request, RUNTIME_CACHE);
        }
        
        // Track performance metrics
        trackPerformance(request, response, performance.now() - startTime);
        
        return response;
        
    } catch (error) {
        console.error('[SW] Request handling failed:', error);
        return createErrorResponse(request, error);
    }
}

// Cache-first strategy with intelligent fallbacks
async function cacheFirstStrategy(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        performanceMetrics.cacheHits++;
        
        // Update cache in background if resource is stale
        if (isResourceStale(cachedResponse)) {
            updateCacheInBackground(request, cache);
        }
        
        return cachedResponse;
    }
    
    try {
        performanceMetrics.cacheMisses++;
        const networkResponse = await fetchWithTimeout(request, 5000);
        
        // Cache successful responses
        if (networkResponse.ok) {
            // Clone before caching to avoid consuming the response
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        return createErrorResponse(request, error);
    }
}

// Network-first strategy for dynamic content
async function networkFirstStrategy(request, cacheName) {
    const cache = await caches.open(cacheName);
    
    try {
        const networkResponse = await fetchWithTimeout(request, 3000);
        
        if (networkResponse.ok) {
            // Update cache with fresh response
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Fallback to cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return createErrorResponse(request, error);
    }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidateStrategy(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // Always try to update from network in background
    const fetchPromise = fetchWithTimeout(request, 5000)
        .then(response => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => null);
    
    // Return cached version immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // If no cache, wait for network
    return fetchPromise || createErrorResponse(request, new Error('No cache available'));
}

// Special video handling with range request support
async function videoStrategy(request) {
    const cache = await caches.open(VIDEO_CACHE);
    
    // Handle range requests differently
    if (request.headers.get('range')) {
        return fetch(request);
    }
    
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok && networkResponse.status < 400) {
            // Only cache successful video responses
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        return createErrorResponse(request, error);
    }
}

// Fetch with timeout to prevent hanging requests
function fetchWithTimeout(request, timeout = 5000) {
    return Promise.race([
        fetch(request),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
    ]);
}

// Check if resource is stale (older than 1 hour)
function isResourceStale(response) {
    const dateHeader = response.headers.get('date');
    if (!dateHeader) return true;
    
    const responseDate = new Date(dateHeader);
    const now = new Date();
    const oneHour = 60 * 60 * 1000;
    
    return (now - responseDate) > oneHour;
}

// Update cache in background
function updateCacheInBackground(request, cache) {
    fetch(request)
        .then(response => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
        })
        .catch(console.warn);
}

// Create appropriate error response
function createErrorResponse(request, error) {
    const url = new URL(request.url);
    
    if (isImageRequest(url)) {
        // Return placeholder SVG for images
        return new Response(
            `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1f2937"/>
                <text x="50%" y="50%" text-anchor="middle" fill="#9ca3af">Imagen no disponible</text>
            </svg>`,
            {
                status: 200,
                headers: { 'Content-Type': 'image/svg+xml' }
            }
        );
    }
    
    // Return minimal error response
    return new Response(
        JSON.stringify({ 
            error: 'Network error', 
            message: error.message,
            offline: !navigator.onLine 
        }),
        {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        }
    );
}

// Resource type detection
function isCriticalResource(url) {
    return CRITICAL_RESOURCES.some(resource => 
        url.pathname === resource || url.pathname.endsWith(resource)
    );
}

function isImageRequest(url) {
    return /\.(png|jpg|jpeg|gif|webp|avif|svg|ico)$/i.test(url.pathname);
}

function isFontRequest(url) {
    return /\.(woff|woff2|ttf|eot)$/i.test(url.pathname) || 
           url.hostname.includes('fonts.googleapis.com') ||
           url.hostname.includes('fonts.gstatic.com');
}

function isVideoRequest(url) {
    return /\.(mp4|webm|ogg|mov|avi)$/i.test(url.pathname);
}

function isAPIRequest(url) {
    return url.pathname.startsWith('/api/') || 
           url.hostname.includes('api.') ||
           url.searchParams.has('api_key');
}

// Performance tracking
function trackPerformance(request, response, duration) {
    performanceMetrics.totalRequests++;
    performanceMetrics.networkRequests++;
    
    // Calculate average response time
    performanceMetrics.avgResponseTime = 
        (performanceMetrics.avgResponseTime * (performanceMetrics.totalRequests - 1) + duration) / 
        performanceMetrics.totalRequests;
    
    // Log slow requests
    if (duration > 2000) {
        console.warn(`[SW] Slow request: ${request.url} (${Math.round(duration)}ms)`);
    }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    console.log('[SW] Background sync:', event.tag);
    
    switch (event.tag) {
        case 'background-sync':
            event.waitUntil(handleBackgroundSync());
            break;
        case 'analytics-sync':
            event.waitUntil(syncAnalytics());
            break;
        default:
            console.log('[SW] Unknown sync tag:', event.tag);
    }
});

// Handle background sync operations
async function handleBackgroundSync() {
    try {
        // Sync pending analytics events
        await syncPendingEvents();
        
        // Update cache with fresh content
        await updateCriticalResources();
        
        console.log('[SW] Background sync completed');
    } catch (error) {
        console.error('[SW] Background sync failed:', error);
    }
}

// Sync analytics data when back online
async function syncAnalytics() {
    // This would sync queued analytics events
    console.log('[SW] Analytics sync completed');
}

// Update critical resources in background
async function updateCriticalResources() {
    const cache = await caches.open(STATIC_CACHE);
    
    for (const resource of CRITICAL_RESOURCES) {
        try {
            const response = await fetch(resource);
            if (response.ok) {
                await cache.put(resource, response);
            }
        } catch (error) {
            console.warn(`[SW] Failed to update ${resource}:`, error);
        }
    }
}

// Sync pending events (placeholder for real implementation)
async function syncPendingEvents() {
    // Implementation would depend on your analytics setup
    console.log('[SW] Pending events synced');
}

// Enhanced push notification handling
self.addEventListener('push', event => {
    console.log('[SW] Push notification received');
    
    let options = {
        body: 'Nueva actualización disponible',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [100, 50, 100],
        tag: 'facepay-notification',
        requireInteraction: false,
        data: {
            url: '/',
            timestamp: Date.now()
        },
        actions: [
            {
                action: 'view',
                title: 'Ver ahora',
                icon: '/action-view.png'
            },
            {
                action: 'dismiss',
                title: 'Cerrar',
                icon: '/action-close.png'
            }
        ]
    };
    
    // Parse push data if available
    if (event.data) {
        try {
            const pushData = event.data.json();
            options = { ...options, ...pushData };
        } catch (error) {
            options.body = event.data.text();
        }
    }
    
    event.waitUntil(
        self.registration.showNotification('FacePay', options)
    );
});

// Notification interaction handling
self.addEventListener('notificationclick', event => {
    console.log('[SW] Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'view' || !event.action) {
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(clientList => {
                // Focus existing window if available
                for (const client of clientList) {
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Open new window
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
        );
    }
});

// Message handling for cache updates and controls
self.addEventListener('message', event => {
    const { type, payload } = event.data || {};
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_METRICS':
            event.ports[0].postMessage(performanceMetrics);
            break;
            
        case 'CLEAR_CACHE':
            event.waitUntil(clearAllCaches());
            break;
            
        case 'PRELOAD_URLS':
            event.waitUntil(preloadUrls(payload.urls));
            break;
            
        case 'UPDATE_CACHE':
            event.waitUntil(updateCacheUrls(payload.urls));
            break;
            
        default:
            console.log('[SW] Unknown message type:', type);
    }
});

// Clear all caches
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
            .filter(name => name.startsWith(CACHE_PREFIX))
            .map(name => caches.delete(name))
    );
    console.log('[SW] All caches cleared');
}

// Preload specific URLs
async function preloadUrls(urls) {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.addAll(urls);
    console.log('[SW] URLs preloaded:', urls.length);
}

// Update specific URLs in cache
async function updateCacheUrls(urls) {
    const cache = await caches.open(RUNTIME_CACHE);
    
    for (const url of urls) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                await cache.put(url, response);
            }
        } catch (error) {
            console.warn(`[SW] Failed to update ${url}:`, error);
        }
    }
}

// Periodic cache cleanup
setInterval(() => {
    cleanExpiredCache();
}, 60 * 60 * 1000); // Every hour

// Clean expired cache entries
async function cleanExpiredCache() {
    for (const [cacheName, config] of Object.entries(CACHE_CONFIGS)) {
        try {
            const cache = await caches.open(`${CACHE_PREFIX}-${cacheName}-${SW_VERSION}`);
            const keys = await cache.keys();
            
            if (keys.length > config.maxEntries) {
                // Remove oldest entries
                const entriesToDelete = keys.slice(0, keys.length - config.maxEntries);
                await Promise.all(entriesToDelete.map(key => cache.delete(key)));
            }
        } catch (error) {
            console.warn(`[SW] Cache cleanup failed for ${cacheName}:`, error);
        }
    }
}

console.log(`[SW v${SW_VERSION}] Service Worker loaded with advanced caching strategies`);