// FacePay Video-Optimized Service Worker
const CACHE_NAME = 'facepay-video-v1';
const VIDEO_CACHE = 'facepay-videos-v1';

// Files to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/facepay-demo-poster.jpg',
    '/facepay-captions-en.vtt',
    '/facepay-captions-es.vtt'
];

// Video files (cache on demand)
const VIDEO_ASSETS = [
    '/facepay-demo.mp4'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('🎬 FacePay Video SW: Installing...');
    
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)),
            caches.open(VIDEO_CACHE) // Create video cache
        ]).then(() => {
            console.log('✅ FacePay Video SW: Installation complete');
            return self.skipWaiting();
        })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('🚀 FacePay Video SW: Activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => 
                        cacheName !== CACHE_NAME && 
                        cacheName !== VIDEO_CACHE
                    )
                    .map(cacheName => caches.delete(cacheName))
            );
        }).then(() => {
            console.log('✅ FacePay Video SW: Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - optimized for video content
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Handle video files with range request support
    if (url.pathname.endsWith('.mp4')) {
        event.respondWith(handleVideoRequest(event.request));
        return;
    }
    
    // Handle static assets
    if (STATIC_ASSETS.some(asset => url.pathname === asset || url.pathname === '/')) {
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request);
            })
        );
        return;
    }
    
    // Network first for other requests
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});

// Handle video requests with range support
async function handleVideoRequest(request) {
    try {
        const cache = await caches.open(VIDEO_CACHE);
        const cachedResponse = await cache.match(request);
        
        // If we have a cached video and it's not a range request
        if (cachedResponse && !request.headers.get('range')) {
            console.log('📹 Serving video from cache');
            return cachedResponse;
        }
        
        // Fetch from network
        const response = await fetch(request);
        
        // Cache successful video responses (non-range requests)
        if (response.ok && !request.headers.get('range')) {
            console.log('💾 Caching video for future use');
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.error('❌ Video request failed:', error);
        throw error;
    }
}

// Background sync for analytics
self.addEventListener('sync', (event) => {
    if (event.tag === 'video-analytics') {
        event.waitUntil(sendVideoAnalytics());
    }
});

async function sendVideoAnalytics() {
    // Send video engagement analytics when online
    try {
        const analytics = await getStoredAnalytics();
        if (analytics.length > 0) {
            await fetch('/api/video-analytics', {
                method: 'POST',
                body: JSON.stringify(analytics),
                headers: { 'Content-Type': 'application/json' }
            });
            await clearStoredAnalytics();
        }
    } catch (error) {
        console.log('Analytics sync failed, will retry');
    }
}

// Helper functions for analytics storage
async function getStoredAnalytics() {
    // Implementation would use IndexedDB
    return [];
}

async function clearStoredAnalytics() {
    // Implementation would clear IndexedDB
}

// Message handling for video events
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'VIDEO_EVENT') {
        // Store video events for analytics
        storeVideoEvent(event.data.payload);
    }
});

function storeVideoEvent(payload) {
    // Store in IndexedDB for later sync
    console.log('📊 Video event stored:', payload);
}