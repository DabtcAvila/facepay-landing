/**
 * Network-Aware Loading System
 * Progressive enhancement based on connection speed and data usage
 */

class NetworkAwareLoader {
    constructor() {
        this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
        this.networkType = this.connection.effectiveType || '4g';
        this.dataUsed = 0;
        this.dataBudget = this.calculateDataBudget();
        this.loadingStrategy = this.determineLoadingStrategy();
        
        // Loading queues
        this.highPriorityQueue = [];
        this.mediumPriorityQueue = [];
        this.lowPriorityQueue = [];
        this.prefetchQueue = [];
        
        // State tracking
        this.loadingStats = {
            totalRequests: 0,
            totalDataUsed: 0,
            averageLoadTime: 0,
            failedRequests: 0,
            cacheHits: 0
        };
        
        this.observers = new Map();
        this.loadingCache = new Map();
        this.requestController = new Map();
        
        this.init();
    }

    init() {
        console.log('🌐 Network-Aware Loader initializing...');
        console.log(`📡 Network: ${this.networkType}, Strategy: ${this.loadingStrategy}`);
        
        this.setupNetworkMonitoring();
        this.setupIntersectionObservers();
        this.setupServiceWorkerCaching();
        this.setupProgressiveImageLoading();
        this.setupVideoOptimization();
        this.setupFontOptimization();
        this.setupResourceHints();
        this.startLoadingQueues();
        
        console.log('✨ Network-aware loading system active');
    }

    calculateDataBudget() {
        // Estimate appropriate data budget based on connection type
        const budgets = {
            'slow-2g': 50 * 1024,      // 50KB
            '2g': 100 * 1024,          // 100KB
            '3g': 500 * 1024,          // 500KB
            '4g': 2 * 1024 * 1024,     // 2MB
            '5g': 10 * 1024 * 1024     // 10MB
        };
        
        const baseBudget = budgets[this.networkType] || budgets['4g'];
        
        // Adjust based on data saver mode
        if (this.connection.saveData) {
            return Math.floor(baseBudget * 0.3);
        }
        
        // Adjust based on device memory
        if (navigator.deviceMemory < 2) {
            return Math.floor(baseBudget * 0.5);
        }
        
        return baseBudget;
    }

    determineLoadingStrategy() {
        if (this.connection.saveData) return 'data-saver';
        
        switch (this.networkType) {
            case 'slow-2g':
            case '2g':
                return 'minimal';
            case '3g':
                return 'balanced';
            case '4g':
            case '5g':
            default:
                return 'progressive';
        }
    }

    setupNetworkMonitoring() {
        if (this.connection && 'addEventListener' in this.connection) {
            this.connection.addEventListener('change', () => {
                const oldType = this.networkType;
                const oldStrategy = this.loadingStrategy;
                
                this.networkType = this.connection.effectiveType || '4g';
                this.dataBudget = this.calculateDataBudget();
                this.loadingStrategy = this.determineLoadingStrategy();
                
                console.log(`📡 Network changed: ${oldType} → ${this.networkType}`);
                console.log(`🎯 Strategy changed: ${oldStrategy} → ${this.loadingStrategy}`);
                
                this.adaptToNetworkChange();
                this.dispatchNetworkChangeEvent();
            });
        }
        
        // Monitor data usage
        this.startDataUsageTracking();
    }

    startDataUsageTracking() {
        // Track data usage through resource timing API
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.transferSize) {
                        this.dataUsed += entry.transferSize;
                        this.loadingStats.totalRequests++;
                        this.loadingStats.totalDataUsed += entry.transferSize;
                        
                        // Update average load time
                        const loadTime = entry.responseEnd - entry.requestStart;
                        this.loadingStats.averageLoadTime = 
                            (this.loadingStats.averageLoadTime * (this.loadingStats.totalRequests - 1) + loadTime) / 
                            this.loadingStats.totalRequests;
                    }
                }
                
                this.checkDataBudget();
            });
            
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }

    checkDataBudget() {
        if (this.dataUsed > this.dataBudget * 0.8) {
            console.warn('⚠️ Approaching data budget limit');
            this.enableDataSavingMode();
        }
        
        if (this.dataUsed > this.dataBudget) {
            console.warn('🚫 Data budget exceeded, switching to minimal loading');
            this.enableMinimalMode();
        }
    }

    setupIntersectionObservers() {
        // Different observers for different loading strategies
        const observerConfigs = {
            minimal: { rootMargin: '50px', threshold: 0.1 },
            balanced: { rootMargin: '100px', threshold: 0.1 },
            progressive: { rootMargin: '200px', threshold: 0.1 },
            'data-saver': { rootMargin: '20px', threshold: 0.25 }
        };
        
        const config = observerConfigs[this.loadingStrategy];
        
        // Lazy image observer
        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, config);
        
        // Video observer
        this.videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadVideo(entry.target);
                    this.videoObserver.unobserve(entry.target);
                }
            });
        }, config);
        
        // Prefetch observer (for content below fold)
        if (this.loadingStrategy === 'progressive') {
            this.prefetchObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.addToPrefetchQueue(entry.target);
                        this.prefetchObserver.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '500px', threshold: 0 });
        }
        
        this.scanAndObserveElements();
    }

    scanAndObserveElements() {
        // Observe lazy images
        document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
            this.imageObserver.observe(img);
        });
        
        // Observe lazy videos
        document.querySelectorAll('video[data-src]').forEach(video => {
            this.videoObserver.observe(video);
        });
        
        // Observe prefetchable content
        if (this.prefetchObserver) {
            document.querySelectorAll('[data-prefetch]').forEach(el => {
                this.prefetchObserver.observe(el);
            });
        }
    }

    setupServiceWorkerCaching() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/network-aware-sw.js', { scope: '/' })
                .then(registration => {
                    console.log('🔧 Network-aware service worker registered');
                    
                    // Send network info to service worker
                    if (registration.active) {
                        registration.active.postMessage({
                            type: 'NETWORK_INFO',
                            networkType: this.networkType,
                            strategy: this.loadingStrategy,
                            dataBudget: this.dataBudget
                        });
                    }
                })
                .catch(error => console.warn('Service worker registration failed:', error));
        }
    }

    setupProgressiveImageLoading() {
        const style = document.createElement('style');
        style.textContent = `
            /* Progressive image loading styles */
            .lazy-image {
                opacity: 0;
                transition: opacity 0.3s ease;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 2s infinite;
            }
            
            .lazy-image.loaded {
                opacity: 1;
                background: none;
                animation: none;
            }
            
            .lazy-image.error {
                opacity: 0.5;
                background: #f5f5f5;
                animation: none;
            }
            
            @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            
            /* Network-specific optimizations */
            .network-2g .lazy-image,
            .network-slow-2g .lazy-image {
                filter: blur(1px);
                transition: filter 0.5s ease, opacity 0.3s ease;
            }
            
            .network-2g .lazy-image.loaded,
            .network-slow-2g .lazy-image.loaded {
                filter: none;
            }
            
            /* Data saver mode */
            .data-saver .lazy-image::after {
                content: '📶 Tap to load image';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }

    setupVideoOptimization() {
        // Disable autoplay on slow connections
        if (['slow-2g', '2g'].includes(this.networkType)) {
            document.querySelectorAll('video[autoplay]').forEach(video => {
                video.removeAttribute('autoplay');
                video.preload = 'none';
                video.poster = video.poster || this.generateVideoPoster(video);
            });
        }
        
        // Add click-to-play functionality for data saver mode
        if (this.connection.saveData) {
            this.setupClickToPlayVideos();
        }
    }

    setupClickToPlayVideos() {
        document.querySelectorAll('video').forEach(video => {
            if (!video.controls) {
                const playButton = document.createElement('div');
                playButton.className = 'video-play-button';
                playButton.innerHTML = '▶️ Play Video';
                playButton.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    z-index: 10;
                `;
                
                const container = video.parentNode;
                if (container) {
                    container.style.position = 'relative';
                    container.appendChild(playButton);
                    
                    playButton.addEventListener('click', () => {
                        this.loadAndPlayVideo(video);
                        playButton.remove();
                    });
                }
            }
        });
    }

    setupFontOptimization() {
        // Optimize font loading based on network conditions
        const fontLoadingStrategy = this.getFontLoadingStrategy();
        
        if (fontLoadingStrategy === 'swap') {
            // Use font-display: swap for faster text rendering
            this.addFontDisplaySwap();
        } else if (fontLoadingStrategy === 'optional') {
            // Use font-display: optional for slow connections
            this.addFontDisplayOptional();
        }
    }

    getFontLoadingStrategy() {
        switch (this.loadingStrategy) {
            case 'minimal':
            case 'data-saver':
                return 'optional';
            case 'balanced':
                return 'swap';
            case 'progressive':
            default:
                return 'auto';
        }
    }

    addFontDisplaySwap() {
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: system-ui, -apple-system, sans-serif;
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }

    addFontDisplayOptional() {
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: system-ui, -apple-system, sans-serif;
                font-display: optional;
            }
        `;
        document.head.appendChild(style);
    }

    setupResourceHints() {
        // Add appropriate resource hints based on network conditions
        if (this.loadingStrategy === 'progressive') {
            this.addResourceHints();
        }
    }

    addResourceHints() {
        // DNS prefetch for external domains
        const domains = ['fonts.googleapis.com', 'cdn.jsdelivr.net'];
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
        
        // Preconnect for critical resources
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://fonts.googleapis.com';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    }

    startLoadingQueues() {
        // Process loading queues with different priorities
        this.processHighPriorityQueue();
        this.processMediumPriorityQueue();
        this.processLowPriorityQueue();
        
        if (this.loadingStrategy === 'progressive') {
            this.processPrefetchQueue();
        }
    }

    processHighPriorityQueue() {
        const processNext = () => {
            if (this.highPriorityQueue.length > 0) {
                const item = this.highPriorityQueue.shift();
                this.processLoadingItem(item).finally(() => {
                    setTimeout(processNext, 50); // Small delay between high priority items
                });
            } else {
                setTimeout(processNext, 100);
            }
        };
        
        processNext();
    }

    processMediumPriorityQueue() {
        const processNext = () => {
            if (this.mediumPriorityQueue.length > 0 && this.highPriorityQueue.length === 0) {
                const item = this.mediumPriorityQueue.shift();
                this.processLoadingItem(item).finally(() => {
                    setTimeout(processNext, 100); // Medium delay for medium priority
                });
            } else {
                setTimeout(processNext, 200);
            }
        };
        
        setTimeout(processNext, 1000); // Wait for high priority items first
    }

    processLowPriorityQueue() {
        const processNext = () => {
            if (this.lowPriorityQueue.length > 0 && 
                this.highPriorityQueue.length === 0 && 
                this.mediumPriorityQueue.length === 0) {
                const item = this.lowPriorityQueue.shift();
                this.processLoadingItem(item).finally(() => {
                    setTimeout(processNext, 200); // Longer delay for low priority
                });
            } else {
                setTimeout(processNext, 500);
            }
        };
        
        setTimeout(processNext, 3000); // Wait for higher priority items
    }

    processPrefetchQueue() {
        const processNext = () => {
            if (this.prefetchQueue.length > 0 && this.isIdleTime()) {
                const item = this.prefetchQueue.shift();
                this.processLoadingItem(item, { prefetch: true }).finally(() => {
                    setTimeout(processNext, 1000); // Long delay for prefetch
                });
            } else {
                setTimeout(processNext, 2000);
            }
        };
        
        setTimeout(processNext, 5000); // Wait for all other content first
    }

    isIdleTime() {
        // Simple heuristic: consider it idle if no high/medium priority items
        return this.highPriorityQueue.length === 0 && this.mediumPriorityQueue.length === 0;
    }

    loadImage(img) {
        if (img.dataset.loaded === 'true') return Promise.resolve();
        
        const src = img.dataset.src || img.src;
        if (!src) return Promise.reject('No source URL');
        
        // Add to appropriate queue based on image importance
        const priority = this.getImagePriority(img);
        const loadingItem = {
            type: 'image',
            element: img,
            url: src,
            priority: priority
        };
        
        return this.addToQueue(loadingItem);
    }

    getImagePriority(img) {
        // Determine image priority based on various factors
        if (img.classList.contains('hero-image') || img.classList.contains('critical')) {
            return 'high';
        }
        
        if (this.isInViewport(img)) {
            return 'high';
        }
        
        if (this.isAboveFold(img)) {
            return 'medium';
        }
        
        return 'low';
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight;
    }

    isAboveFold(element) {
        const rect = element.getBoundingClientRect();
        return rect.top <= window.innerHeight * 1.5;
    }

    addToQueue(loadingItem) {
        return new Promise((resolve, reject) => {
            loadingItem.resolve = resolve;
            loadingItem.reject = reject;
            
            switch (loadingItem.priority) {
                case 'high':
                    this.highPriorityQueue.push(loadingItem);
                    break;
                case 'medium':
                    this.mediumPriorityQueue.push(loadingItem);
                    break;
                case 'low':
                default:
                    this.lowPriorityQueue.push(loadingItem);
                    break;
            }
        });
    }

    addToPrefetchQueue(element) {
        if (this.loadingStrategy !== 'progressive') return;
        
        const prefetchItems = this.extractPrefetchItems(element);
        prefetchItems.forEach(item => {
            this.prefetchQueue.push(item);
        });
    }

    extractPrefetchItems(element) {
        const items = [];
        
        // Extract images
        element.querySelectorAll('img[data-src]').forEach(img => {
            items.push({
                type: 'image',
                element: img,
                url: img.dataset.src,
                priority: 'prefetch'
            });
        });
        
        // Extract other prefetchable resources
        const prefetchUrl = element.dataset.prefetch;
        if (prefetchUrl) {
            items.push({
                type: 'resource',
                url: prefetchUrl,
                priority: 'prefetch'
            });
        }
        
        return items;
    }

    async processLoadingItem(item, options = {}) {
        const startTime = performance.now();
        
        try {
            let result;
            switch (item.type) {
                case 'image':
                    result = await this.loadImageResource(item, options);
                    break;
                case 'video':
                    result = await this.loadVideoResource(item, options);
                    break;
                case 'resource':
                    result = await this.loadGenericResource(item, options);
                    break;
                default:
                    throw new Error(`Unknown item type: ${item.type}`);
            }
            
            const loadTime = performance.now() - startTime;
            this.recordSuccessfulLoad(item, loadTime);
            
            if (item.resolve) item.resolve(result);
            return result;
            
        } catch (error) {
            console.warn(`Failed to load ${item.type}:`, error);
            this.recordFailedLoad(item, error);
            
            if (item.reject) item.reject(error);
            throw error;
        }
    }

    async loadImageResource(item, options = {}) {
        const { element, url } = item;
        
        // Check cache first
        if (this.loadingCache.has(url)) {
            const cached = this.loadingCache.get(url);
            if (cached.status === 'loaded') {
                this.applyImageToElement(element, cached.data);
                return cached.data;
            }
        }
        
        // Determine image quality based on network
        const optimizedUrl = this.getOptimizedImageUrl(url);
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            // Set up abort controller for cancellation
            const controller = new AbortController();
            this.requestController.set(url, controller);
            
            img.onload = () => {
                this.loadingCache.set(url, { status: 'loaded', data: img });
                this.applyImageToElement(element, img);
                this.requestController.delete(url);
                resolve(img);
            };
            
            img.onerror = () => {
                this.loadingCache.set(url, { status: 'error', data: null });
                this.handleImageError(element);
                this.requestController.delete(url);
                reject(new Error('Failed to load image'));
            };
            
            // Handle abort
            controller.signal.addEventListener('abort', () => {
                this.requestController.delete(url);
                reject(new Error('Request aborted'));
            });
            
            img.src = optimizedUrl;
        });
    }

    getOptimizedImageUrl(url) {
        // Apply network-specific optimizations
        if (!url.includes('?')) {
            switch (this.networkType) {
                case 'slow-2g':
                case '2g':
                    return `${url}?quality=30&format=webp`;
                case '3g':
                    return `${url}?quality=60&format=webp`;
                case '4g':
                case '5g':
                default:
                    return `${url}?quality=80&format=webp`;
            }
        }
        
        return url;
    }

    applyImageToElement(element, img) {
        element.classList.add('lazy-image');
        
        // Use appropriate size based on element dimensions
        const rect = element.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            element.src = img.src;
        }
        
        element.classList.add('loaded');
        element.dataset.loaded = 'true';
    }

    handleImageError(element) {
        element.classList.add('error');
        element.alt = 'Failed to load image';
        
        // Try to load a fallback image
        if (element.dataset.fallback) {
            element.src = element.dataset.fallback;
        }
    }

    loadVideo(video) {
        const src = video.dataset.src;
        if (!src) return Promise.reject('No video source');
        
        const loadingItem = {
            type: 'video',
            element: video,
            url: src,
            priority: 'medium'
        };
        
        return this.addToQueue(loadingItem);
    }

    async loadVideoResource(item, options = {}) {
        const { element, url } = item;
        
        // For slow connections, only load poster
        if (['slow-2g', '2g'].includes(this.networkType)) {
            return this.loadVideoPosterOnly(element, url);
        }
        
        return new Promise((resolve, reject) => {
            const video = element;
            video.addEventListener('loadeddata', () => resolve(video), { once: true });
            video.addEventListener('error', () => reject(new Error('Video load failed')), { once: true });
            
            video.src = url;
            video.load();
        });
    }

    loadVideoPosterOnly(video, url) {
        // Generate or use existing poster
        const poster = video.poster || this.generateVideoPoster(video);
        video.poster = poster;
        
        // Add play button overlay
        this.addVideoPlayButton(video, url);
        
        return Promise.resolve(video);
    }

    generateVideoPoster(video) {
        // Simple placeholder poster
        return 'data:image/svg+xml,' + encodeURIComponent(`
            <svg width="320" height="240" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="24" fill="#666">▶️</text>
            </svg>
        `);
    }

    addVideoPlayButton(video, url) {
        const button = document.createElement('button');
        button.innerHTML = '▶️ Load Video';
        button.className = 'video-load-button';
        button.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            z-index: 10;
        `;
        
        const container = video.parentNode;
        if (container) {
            container.style.position = 'relative';
            container.appendChild(button);
            
            button.addEventListener('click', () => {
                this.loadAndPlayVideo(video);
                button.remove();
            });
        }
    }

    async loadAndPlayVideo(video) {
        try {
            if (video.dataset.src) {
                video.src = video.dataset.src;
                await video.load();
            }
            await video.play();
        } catch (error) {
            console.warn('Failed to load/play video:', error);
        }
    }

    async loadGenericResource(item, options = {}) {
        const { url } = item;
        
        if (options.prefetch) {
            // Use link prefetch for generic resources
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
            return Promise.resolve();
        }
        
        // For non-prefetch, use fetch
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return response;
    }

    adaptToNetworkChange() {
        // Cancel low-priority requests on network downgrade
        if (['slow-2g', '2g'].includes(this.networkType)) {
            this.cancelLowPriorityRequests();
            this.enableMinimalMode();
        }
        
        // Re-evaluate loading strategy
        this.dataBudget = this.calculateDataBudget();
        
        // Update CSS classes
        document.body.classList.forEach(className => {
            if (className.startsWith('network-')) {
                document.body.classList.remove(className);
            }
        });
        document.body.classList.add(`network-${this.networkType}`);
        document.body.classList.add(`strategy-${this.loadingStrategy}`);
    }

    cancelLowPriorityRequests() {
        // Cancel pending low priority requests
        this.requestController.forEach((controller, url) => {
            controller.abort();
        });
        
        // Clear low priority queues
        this.lowPriorityQueue.length = 0;
        this.prefetchQueue.length = 0;
        
        console.log('🚫 Cancelled low priority requests due to network change');
    }

    enableDataSavingMode() {
        document.body.classList.add('data-saver');
        this.loadingStrategy = 'data-saver';
        
        // Pause non-critical animations
        document.querySelectorAll('.animate-pulse, .animate-bounce').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
        
        console.log('💾 Data saving mode enabled');
    }

    enableMinimalMode() {
        document.body.classList.add('minimal-mode');
        this.loadingStrategy = 'minimal';
        
        // Stop all non-essential loading
        this.mediumPriorityQueue.length = 0;
        this.lowPriorityQueue.length = 0;
        this.prefetchQueue.length = 0;
        
        console.log('🔒 Minimal loading mode enabled');
    }

    recordSuccessfulLoad(item, loadTime) {
        this.loadingStats.averageLoadTime = 
            (this.loadingStats.averageLoadTime + loadTime) / 2;
    }

    recordFailedLoad(item, error) {
        this.loadingStats.failedRequests++;
    }

    dispatchNetworkChangeEvent() {
        document.dispatchEvent(new CustomEvent('networkChanged', {
            detail: {
                networkType: this.networkType,
                strategy: this.loadingStrategy,
                dataBudget: this.dataBudget,
                dataUsed: this.dataUsed
            }
        }));
    }

    // Public API
    getNetworkInfo() {
        return {
            type: this.networkType,
            strategy: this.loadingStrategy,
            dataBudget: this.dataBudget,
            dataUsed: this.dataUsed,
            saveData: this.connection.saveData
        };
    }

    getLoadingStats() {
        return { ...this.loadingStats };
    }

    forceLoadImage(img) {
        // Force immediate loading regardless of queue
        return this.loadImageResource({ element: img, url: img.dataset.src || img.src });
    }

    forceLoadVideo(video) {
        // Force immediate video loading
        return this.loadAndPlayVideo(video);
    }

    preloadResource(url, type = 'image') {
        const item = {
            type: type,
            url: url,
            priority: 'high'
        };
        
        return this.addToQueue(item);
    }

    destroy() {
        // Cancel all pending requests
        this.requestController.forEach(controller => controller.abort());
        this.requestController.clear();
        
        // Disconnect observers
        if (this.imageObserver) this.imageObserver.disconnect();
        if (this.videoObserver) this.videoObserver.disconnect();
        if (this.prefetchObserver) this.prefetchObserver.disconnect();
        
        // Clear queues
        this.highPriorityQueue.length = 0;
        this.mediumPriorityQueue.length = 0;
        this.lowPriorityQueue.length = 0;
        this.prefetchQueue.length = 0;
        
        console.log('🧹 Network-aware loader destroyed');
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.networkAwareLoader = new NetworkAwareLoader();
    });
} else {
    window.networkAwareLoader = new NetworkAwareLoader();
}

window.NetworkAwareLoader = NetworkAwareLoader;