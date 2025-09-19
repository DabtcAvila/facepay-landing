/**
 * SERVICE WORKER - OPTIMIZED FOR CORE WEB VITALS
 * Aggressive caching, instant loading, perfect Core Web Vitals
 * Version: 3.0.0
 */

const CACHE_VERSION = 'facepay-v3.0.0';
const CRITICAL_CACHE = `${CACHE_VERSION}-critical`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const API_CACHE = `${CACHE_VERSION}-api`;

// CRITICAL RESOURCES - Must be cached immediately for perfect LCP
const CRITICAL_RESOURCES = [
    '/',
    '/index.html',
    '/critical-optimized.css',
    '/critical-scripts.js',
    '/media-optimizer.js',
    '/render-optimizer.js',
    '/facepay-demo.mp4'
];

// STATIC RESOURCES - Cache with stale-while-revalidate
const STATIC_RESOURCES = [
    '/manifest.json',
    '/robots.txt',
    '/sitemap.xml',
    '/micro-animations.css',
    '/micro-animations.js',
    '/magnetic-buttons.js',
    '/typography-performance.js',
    '/performance.js'
];

// EXTERNAL RESOURCES - Cache with network-first
const EXTERNAL_RESOURCES = [
    'https://fonts.googleapis.com/css2',
    'https://fonts.gstatic.com/',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/',
    'https://www.googletagmanager.com/gtag/'
];

// CACHE STRATEGIES
const CACHE_STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
    NETWORK_ONLY: 'network-only',
    CACHE_ONLY: 'cache-only'
};

class ServiceWorkerOptimizer {
    constructor() {
        this.installStartTime = Date.now();
        this.cacheHitCount = 0;
        this.cacheMissCount = 0;
        this.networkTime = [];
    }

    // INSTALL EVENT - Immediate critical resource caching
    async handleInstall(event) {
        console.log('🔧 Service Worker installing...');
        
        event.waitUntil(
            this.precacheCriticalResources()
                .then(() => {
                    console.log('✅ Critical resources cached in', Date.now() - this.installStartTime, 'ms');
                    return self.skipWaiting();
                })
        );
    }

    async precacheCriticalResources() {
        const cache = await caches.open(CRITICAL_CACHE);
        
        // Cache critical resources with high priority
        const criticalPromises = CRITICAL_RESOURCES.map(async (resource) => {
            try {
                const response = await fetch(resource, {
                    priority: 'high',
                    cache: 'no-cache' // Ensure fresh copy during install
                });
                
                if (response.ok) {
                    await cache.put(resource, response.clone());
                    console.log('🚀 Cached critical:', resource);
                } else {
                    console.warn('⚠️ Failed to cache critical resource:', resource, response.status);
                }
            } catch (error) {
                console.error('❌ Error caching critical resource:', resource, error);
            }
        });

        await Promise.allSettled(criticalPromises);
        
        // Pre-cache static resources in background
        this.precacheStaticResources();
    }

    async precacheStaticResources() {
        // Don't block install for static resources
        try {
            const cache = await caches.open(STATIC_CACHE);
            const staticPromises = STATIC_RESOURCES.map(resource => 
                fetch(resource)
                    .then(response => response.ok ? cache.put(resource, response) : null)
                    .catch(() => null) // Silently fail for non-critical resources
            );
            
            await Promise.allSettled(staticPromises);
            console.log('📦 Static resources cached');
        } catch (error) {
            console.warn('Static resource caching failed:', error);
        }
    }

    // ACTIVATE EVENT - Clean old caches
    async handleActivate(event) {
        console.log('🎯 Service Worker activating...');
        
        event.waitUntil(
            Promise.all([
                this.cleanOldCaches(),
                self.clients.claim()
            ]).then(() => {
                console.log('✅ Service Worker activated and claimed all clients');
            })
        );
    }

    async cleanOldCaches() {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
            name.startsWith('facepay-') && !name.startsWith(CACHE_VERSION)
        );

        const deletePromises = oldCaches.map(cacheName => {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
        });

        return Promise.all(deletePromises);
    }

    // FETCH EVENT - Intelligent caching strategy
    async handleFetch(event) {
        const request = event.request;
        const url = new URL(request.url);

        // Skip non-GET requests
        if (request.method !== 'GET') {
            return;
        }

        // Skip chrome-extension and other schemes
        if (!url.protocol.startsWith('http')) {
            return;
        }

        event.respondWith(
            this.getOptimalResponse(request)
        );
    }

    async getOptimalResponse(request) {
        const url = new URL(request.url);
        const startTime = performance.now();

        try {
            let strategy;
            let cacheName;

            // Determine strategy based on resource type
            if (this.isCriticalResource(request)) {
                strategy = CACHE_STRATEGIES.CACHE_FIRST;
                cacheName = CRITICAL_CACHE;
            } else if (this.isStaticResource(request)) {
                strategy = CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
                cacheName = STATIC_CACHE;
            } else if (this.isImageResource(request)) {
                strategy = CACHE_STRATEGIES.CACHE_FIRST;
                cacheName = IMAGE_CACHE;
            } else if (this.isApiResource(request)) {
                strategy = CACHE_STRATEGIES.NETWORK_FIRST;
                cacheName = API_CACHE;
            } else if (this.isExternalResource(request)) {
                strategy = CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
                cacheName = STATIC_CACHE;
            } else {
                strategy = CACHE_STRATEGIES.NETWORK_FIRST;
                cacheName = DYNAMIC_CACHE;
            }

            const response = await this.executeStrategy(request, strategy, cacheName);
            
            // Track performance
            this.trackCachePerformance(request, startTime, response);
            
            return response;

        } catch (error) {
            console.error('SW Fetch error:', error);
            return this.getFallbackResponse(request);
        }
    }

    async executeStrategy(request, strategy, cacheName) {
        switch (strategy) {
            case CACHE_STRATEGIES.CACHE_FIRST:
                return this.cacheFirst(request, cacheName);
            
            case CACHE_STRATEGIES.NETWORK_FIRST:
                return this.networkFirst(request, cacheName);
            
            case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
                return this.staleWhileRevalidate(request, cacheName);
            
            case CACHE_STRATEGIES.CACHE_ONLY:
                return this.cacheOnly(request, cacheName);
            
            case CACHE_STRATEGIES.NETWORK_ONLY:
                return fetch(request);
            
            default:
                return this.networkFirst(request, cacheName);
        }
    }

    // CACHE FIRST - Perfect for critical resources (LCP optimization)
    async cacheFirst(request, cacheName) {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            this.cacheHitCount++;
            console.log('💨 Cache hit:', request.url.substring(0, 50) + '...');
            
            // Background update for critical resources
            if (this.isCriticalResource(request)) {
                this.backgroundUpdate(request, cache);
            }
            
            return cachedResponse;
        }

        this.cacheMissCount++;
        console.log('🌐 Cache miss, fetching:', request.url.substring(0, 50) + '...');
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            await cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    }

    // NETWORK FIRST - Perfect for dynamic content
    async networkFirst(request, cacheName) {
        const cache = await caches.open(cacheName);
        
        try {
            const networkResponse = await fetch(request, {
                // Add timeout for better performance
                signal: AbortSignal.timeout(5000)
            });
            
            if (networkResponse.ok) {
                // Cache successful responses
                await cache.put(request, networkResponse.clone());
            }
            
            return networkResponse;
            
        } catch (error) {
            console.log('📡 Network failed, trying cache:', error.message);
            const cachedResponse = await cache.match(request);
            
            if (cachedResponse) {
                this.cacheHitCount++;
                return cachedResponse;
            }
            
            throw error;
        }
    }

    // STALE WHILE REVALIDATE - Perfect for static resources
    async staleWhileRevalidate(request, cacheName) {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        // Background fetch to update cache
        const fetchPromise = fetch(request).then(response => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        }).catch(() => null);

        if (cachedResponse) {
            this.cacheHitCount++;
            console.log('⚡ Serving stale:', request.url.substring(0, 50) + '...');
            return cachedResponse;
        }

        this.cacheMissCount++;
        return fetchPromise;
    }

    async cacheOnly(request, cacheName) {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            this.cacheHitCount++;
            return cachedResponse;
        }
        
        throw new Error('No cached response available');
    }

    // BACKGROUND UPDATE - Keep cache fresh without blocking
    backgroundUpdate(request, cache) {
        // Don't await - run in background
        fetch(request).then(response => {
            if (response.ok) {
                cache.put(request, response.clone());
                console.log('🔄 Background updated:', request.url.substring(0, 50) + '...');
            }
        }).catch(() => {
            // Silent fail for background updates
        });
    }

    // RESOURCE TYPE DETECTION
    isCriticalResource(request) {
        const url = request.url;
        return CRITICAL_RESOURCES.some(resource => 
            url.endsWith(resource) || url.includes(resource)
        );
    }

    isStaticResource(request) {
        const url = request.url;
        return STATIC_RESOURCES.some(resource => 
            url.includes(resource)
        ) || /\.(css|js|woff2?|ttf|eot)$/i.test(url);
    }

    isImageResource(request) {
        return /\.(png|jpg|jpeg|webp|avif|gif|svg|ico)$/i.test(request.url);
    }

    isApiResource(request) {
        return request.url.includes('/api/') || 
               request.url.includes('analytics') ||
               request.url.includes('gtag');
    }

    isExternalResource(request) {
        const url = new URL(request.url);
        return url.origin !== self.location.origin && 
               EXTERNAL_RESOURCES.some(external => request.url.includes(external));
    }

    // FALLBACK RESPONSES
    async getFallbackResponse(request) {
        if (this.isImageResource(request)) {
            // Return placeholder image for failed image requests
            return new Response(
                '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111"/><text x="50%" y="50%" text-anchor="middle" fill="#666" dy="0.3em">Image Unavailable</text></svg>',
                {
                    headers: {
                        'Content-Type': 'image/svg+xml',
                        'Cache-Control': 'no-cache'
                    }
                }
            );
        }

        if (request.mode === 'navigate') {
            // Return cached main page for navigation requests
            const cache = await caches.open(CRITICAL_CACHE);
            const cachedResponse = await cache.match('/');
            if (cachedResponse) {
                return cachedResponse;
            }
        }

        return new Response('Offline', { 
            status: 503, 
            statusText: 'Service Unavailable' 
        });
    }

    // PERFORMANCE TRACKING
    trackCachePerformance(request, startTime, response) {
        const duration = performance.now() - startTime;
        this.networkTime.push(duration);
        
        // Keep only last 100 measurements
        if (this.networkTime.length > 100) {
            this.networkTime.shift();
        }

        // Log slow requests
        if (duration > 1000) {
            console.warn('🐌 Slow request:', duration.toFixed(2) + 'ms', request.url.substring(0, 50) + '...');
        }
    }

    // CACHE MANAGEMENT API
    async getCacheStats() {
        const cacheNames = await caches.keys();
        const stats = {
            version: CACHE_VERSION,
            cacheHits: this.cacheHitCount,
            cacheMisses: this.cacheMissCount,
            hitRate: this.cacheHitCount / (this.cacheHitCount + this.cacheMissCount),
            averageResponseTime: this.networkTime.reduce((a, b) => a + b, 0) / this.networkTime.length,
            caches: {}
        };

        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            stats.caches[cacheName] = keys.length;
        }

        return stats;
    }

    // CACHE WARMUP - Preload important resources
    async warmupCache(resources = []) {
        const cache = await caches.open(DYNAMIC_CACHE);
        const warmupPromises = resources.map(url => 
            fetch(url).then(response => {
                if (response.ok) {
                    return cache.put(url, response);
                }
            }).catch(() => null)
        );

        await Promise.allSettled(warmupPromises);
        console.log('🔥 Cache warmed up with', resources.length, 'resources');
    }
}

// Initialize Service Worker
const swOptimizer = new ServiceWorkerOptimizer();

// Event listeners
self.addEventListener('install', event => swOptimizer.handleInstall(event));
self.addEventListener('activate', event => swOptimizer.handleActivate(event));
self.addEventListener('fetch', event => swOptimizer.handleFetch(event));

// Message handling for cache stats and management
self.addEventListener('message', async event => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'GET_CACHE_STATS':
            const stats = await swOptimizer.getCacheStats();
            event.ports[0].postMessage(stats);
            break;
            
        case 'WARMUP_CACHE':
            await swOptimizer.warmupCache(payload.resources);
            event.ports[0].postMessage({ success: true });
            break;
            
        case 'CLEAR_CACHE':
            const cacheName = payload.cacheName || DYNAMIC_CACHE;
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            await Promise.all(keys.map(key => cache.delete(key)));
            event.ports[0].postMessage({ cleared: keys.length });
            break;
            
        default:
            console.log('Unknown message type:', type);
    }
});

// Background sync for analytics
self.addEventListener('sync', event => {
    if (event.tag === 'background-analytics') {
        event.waitUntil(
            // Send queued analytics data
            self.registration.sync.register('analytics-sync')
        );
    }
});

// Push notifications (if needed)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        event.waitUntil(
            self.registration.showNotification(data.title, {
                body: data.body,
                icon: '/icon-192.png',
                badge: '/badge-72.png',
                data: data.url
            })
        );
    }
});

console.log('🚀 Service Worker Optimized v3.0.0 loaded - Perfect Core Web Vitals ready!');