/**
 * FacePay Ultimate Performance Optimizer
 * Creates world-class 100/100 performance while maintaining stunning visuals
 */

class UltimatePerformanceOptimizer {
    constructor() {
        this.isInitialized = false;
        this.performanceTarget = 100; // Lighthouse score target
        this.currentMetrics = {};
        this.optimizationStrategies = new Map();
        this.resourceManager = null;
        this.renderOptimizer = null;
        this.memoryManager = null;
        
        // Performance budgets
        this.budgets = {
            totalJSSize: 150000, // 150KB
            totalCSSSize: 50000,  // 50KB
            totalImageSize: 200000, // 200KB
            maxRenderTime: 16,    // 16ms for 60fps
            maxMemoryUsage: 50000000, // 50MB
            maxNetworkRequests: 20
        };
        
        // Smart loading queues
        this.loadingQueues = {
            critical: [],
            important: [],
            deferred: [],
            idle: []
        };
        
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing Ultimate Performance Optimizer...');
        
        this.setupResourceManager();
        this.setupRenderOptimizer();
        this.setupMemoryManager();
        this.setupSmartLoading();
        this.setupPerformanceMonitoring();
        this.setupAdaptiveOptimization();
        this.setupCriticalResourcePrioritization();
        this.setupIntelligentPrefetching();
        this.setupRealTimeOptimization();
        
        this.isInitialized = true;
        console.log('✨ Ultimate Performance Optimizer ready!');
    }
    
    setupResourceManager() {
        this.resourceManager = {
            // Smart script loading
            loadScript: (src, priority = 'normal') => {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.async = priority !== 'critical';
                    script.defer = priority === 'deferred';
                    
                    script.onload = resolve;
                    script.onerror = reject;
                    
                    if (priority === 'critical') {
                        document.head.insertBefore(script, document.head.firstChild);
                    } else {
                        document.head.appendChild(script);
                    }
                });
            },
            
            // Smart style loading
            loadStyle: (href, priority = 'normal') => {
                const link = document.createElement('link');
                link.rel = priority === 'critical' ? 'stylesheet' : 'preload';
                link.href = href;
                link.as = 'style';
                
                if (priority !== 'critical') {
                    link.onload = () => {
                        link.rel = 'stylesheet';
                        link.onload = null;
                    };
                }
                
                document.head.appendChild(link);
                return link;
            },
            
            // Smart image loading
            loadImage: (src, options = {}) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    
                    if (options.crossOrigin) img.crossOrigin = options.crossOrigin;
                    if (options.decoding) img.decoding = options.decoding;
                    if (options.loading) img.loading = options.loading;
                    
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = src;
                });
            },
            
            // Resource cleanup
            cleanup: () => {
                // Remove unused stylesheets
                document.querySelectorAll('style').forEach(style => {
                    if (style.textContent.trim() === '' || 
                        style.dataset.temporary === 'true') {
                        style.remove();
                    }
                });
                
                // Clean up event listeners
                this.cleanupEventListeners();
            }
        };
    }
    
    setupRenderOptimizer() {
        this.renderOptimizer = {
            frameCount: 0,
            lastTime: 0,
            renderQueue: [],
            isRendering: false,
            
            // Batched DOM updates
            batchUpdate: (callback) => {
                this.renderOptimizer.renderQueue.push(callback);
                this.renderOptimizer.scheduleRender();
            },
            
            scheduleRender: () => {
                if (this.renderOptimizer.isRendering) return;
                
                this.renderOptimizer.isRendering = true;
                requestAnimationFrame(() => {
                    const startTime = performance.now();
                    
                    // Execute batched updates
                    while (this.renderOptimizer.renderQueue.length > 0 && 
                           performance.now() - startTime < 8) { // 8ms budget
                        const callback = this.renderOptimizer.renderQueue.shift();
                        callback();
                    }
                    
                    this.renderOptimizer.isRendering = false;
                    
                    // Continue if more updates pending
                    if (this.renderOptimizer.renderQueue.length > 0) {
                        this.renderOptimizer.scheduleRender();
                    }
                });
            },
            
            // Smart animation optimization
            optimizeAnimations: () => {
                // Pause animations for invisible elements
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const element = entry.target;
                        if (entry.isIntersecting) {
                            element.style.animationPlayState = 'running';
                        } else {
                            element.style.animationPlayState = 'paused';
                        }
                    });
                });
                
                document.querySelectorAll('[class*="animate"], [style*="animation"]').forEach(el => {
                    observer.observe(el);
                });
            },
            
            // Layer optimization
            optimizeLayers: () => {
                // Promote frequently changing elements to their own layer
                const promotes = [
                    '.face-scanner-hero',
                    '.scanning-line-mini',
                    '.btn:hover',
                    '.particle-3d',
                    '.cinematic-3d'
                ];
                
                promotes.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => {
                        el.style.willChange = 'transform';
                        el.style.contain = 'layout style paint';
                    });
                });
            }
        };
        
        this.renderOptimizer.optimizeAnimations();
        this.renderOptimizer.optimizeLayers();
    }
    
    setupMemoryManager() {
        this.memoryManager = {
            cache: new Map(),
            maxCacheSize: 20000000, // 20MB
            currentCacheSize: 0,
            
            store: (key, value, size = 1000) => {
                // Evict if needed
                while (this.memoryManager.currentCacheSize + size > this.memoryManager.maxCacheSize &&
                       this.memoryManager.cache.size > 0) {
                    const firstKey = this.memoryManager.cache.keys().next().value;
                    const firstValue = this.memoryManager.cache.get(firstKey);
                    this.memoryManager.cache.delete(firstKey);
                    this.memoryManager.currentCacheSize -= firstValue.size || 1000;
                }
                
                this.memoryManager.cache.set(key, { value, size, timestamp: Date.now() });
                this.memoryManager.currentCacheSize += size;
            },
            
            get: (key) => {
                const item = this.memoryManager.cache.get(key);
                if (item) {
                    item.timestamp = Date.now(); // Update LRU
                    return item.value;
                }
                return null;
            },
            
            cleanup: () => {
                const now = Date.now();
                const maxAge = 5 * 60 * 1000; // 5 minutes
                
                for (const [key, item] of this.memoryManager.cache) {
                    if (now - item.timestamp > maxAge) {
                        this.memoryManager.cache.delete(key);
                        this.memoryManager.currentCacheSize -= item.size;
                    }
                }
            }
        };
        
        // Cleanup memory every 2 minutes
        setInterval(() => {
            this.memoryManager.cleanup();
            this.resourceManager.cleanup();
        }, 120000);
    }
    
    setupSmartLoading() {
        // Categorize resources by priority
        const resourceCategories = {
            critical: [
                'critical.css',
                'critical-scripts.js',
                '/facepay-demo-poster.webp'
            ],
            important: [
                '3d-cinematic-engine.js',
                'emotional-design-engine.js',
                'mobile-touch-premium.js'
            ],
            deferred: [
                '/facepay-demo-optimized.mp4',
                'analytics-system.js'
            ],
            idle: [
                'service-worker.js',
                'particles.js'
            ]
        };
        
        // Load critical resources immediately
        this.loadCriticalResources(resourceCategories.critical);
        
        // Load important resources after initial render
        requestIdleCallback(() => {
            this.loadResourceBatch(resourceCategories.important, 'important');
        }, { timeout: 2000 });
        
        // Load deferred resources on user interaction
        let interactionLoaded = false;
        const loadOnInteraction = () => {
            if (!interactionLoaded) {
                interactionLoaded = true;
                this.loadResourceBatch(resourceCategories.deferred, 'deferred');
                
                // Remove listeners after first interaction
                ['click', 'scroll', 'keydown', 'touchstart'].forEach(event => {
                    document.removeEventListener(event, loadOnInteraction);
                });
            }
        };
        
        ['click', 'scroll', 'keydown', 'touchstart'].forEach(event => {
            document.addEventListener(event, loadOnInteraction, { passive: true, once: true });
        });
        
        // Load idle resources when truly idle
        requestIdleCallback(() => {
            this.loadResourceBatch(resourceCategories.idle, 'idle');
        }, { timeout: 10000 });
    }
    
    loadCriticalResources(resources) {
        resources.forEach(resource => {
            if (resource.endsWith('.css')) {
                this.resourceManager.loadStyle(resource, 'critical');
            } else if (resource.endsWith('.js')) {
                this.resourceManager.loadScript(resource, 'critical');
            } else if (resource.match(/\.(webp|jpg|png)$/)) {
                this.resourceManager.loadImage(resource, { 
                    loading: 'eager',
                    decoding: 'sync'
                });
            }
        });
    }
    
    loadResourceBatch(resources, priority) {
        const loadPromises = resources.map(resource => {
            // Check if already loaded
            if (this.memoryManager.get(`loaded_${resource}`)) {
                return Promise.resolve();
            }
            
            let loadPromise;
            if (resource.endsWith('.css')) {
                loadPromise = Promise.resolve(this.resourceManager.loadStyle(resource, priority));
            } else if (resource.endsWith('.js')) {
                loadPromise = this.resourceManager.loadScript(resource, priority);
            } else {
                loadPromise = this.resourceManager.loadImage(resource, { loading: 'lazy' });
            }
            
            return loadPromise.then(() => {
                this.memoryManager.store(`loaded_${resource}`, true);
            }).catch(error => {
                console.warn(`Failed to load resource: ${resource}`, error);
            });
        });
        
        return Promise.all(loadPromises);
    }
    
    setupPerformanceMonitoring() {
        // Core Web Vitals monitoring
        this.performanceMonitor = {
            metrics: {},
            
            measureCLS: () => {
                if ('PerformanceObserver' in window) {
                    let clsValue = 0;
                    let clsEntries = [];
                    
                    const observer = new PerformanceObserver((list) => {
                        list.getEntries().forEach((entry) => {
                            if (!entry.hadRecentInput) {
                                clsEntries.push(entry);
                                clsValue += entry.value;
                                
                                if (clsValue > 0.1) { // CLS threshold
                                    this.optimizeCLS();
                                }
                            }
                        });
                    });
                    
                    observer.observe({ entryTypes: ['layout-shift'] });
                    this.performanceMonitor.metrics.cls = { value: () => clsValue, entries: clsEntries };
                }
            },
            
            measureLCP: () => {
                if ('PerformanceObserver' in window) {
                    const observer = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        
                        this.performanceMonitor.metrics.lcp = lastEntry.startTime;
                        
                        if (lastEntry.startTime > 2500) { // LCP threshold
                            this.optimizeLCP();
                        }
                    });
                    
                    observer.observe({ entryTypes: ['largest-contentful-paint'] });
                }
            },
            
            measureFID: () => {
                if ('PerformanceObserver' in window) {
                    const observer = new PerformanceObserver((list) => {
                        list.getEntries().forEach((entry) => {
                            const fid = entry.processingStart - entry.startTime;
                            this.performanceMonitor.metrics.fid = fid;
                            
                            if (fid > 100) { // FID threshold
                                this.optimizeFID();
                            }
                        });
                    });
                    
                    observer.observe({ entryTypes: ['first-input'] });
                }
            }
        };
        
        this.performanceMonitor.measureCLS();
        this.performanceMonitor.measureLCP();
        this.performanceMonitor.measureFID();
    }
    
    optimizeCLS() {
        console.log('🔧 Optimizing Cumulative Layout Shift...');
        
        // Add size attributes to images without them
        document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
            if (img.naturalWidth && img.naturalHeight) {
                const aspectRatio = img.naturalHeight / img.naturalWidth;
                img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
                
                // If responsive, maintain aspect ratio
                if (img.style.width === '100%' || img.style.maxWidth === '100%') {
                    img.style.height = 'auto';
                }
            }
        });
        
        // Reserve space for dynamic content
        document.querySelectorAll('.social-proof-live, .trust-indicator').forEach(element => {
            if (!element.style.minHeight) {
                const rect = element.getBoundingClientRect();
                element.style.minHeight = rect.height + 'px';
            }
        });
        
        // Preload font to reduce layout shifts
        if (!document.querySelector('link[rel="preload"][as="font"]')) {
            const fontPreload = document.createElement('link');
            fontPreload.rel = 'preload';
            fontPreload.as = 'font';
            fontPreload.type = 'font/woff2';
            fontPreload.crossOrigin = 'anonymous';
            fontPreload.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
            document.head.appendChild(fontPreload);
        }
    }
    
    optimizeLCP() {
        console.log('🚀 Optimizing Largest Contentful Paint...');
        
        // Preload LCP image
        const heroImage = document.querySelector('.hero-video-mobile-poster, .demo-video img');
        if (heroImage && !document.querySelector(`link[href="${heroImage.src}"]`)) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = heroImage.src;
            document.head.appendChild(link);
        }
        
        // Optimize hero text rendering
        const heroText = document.querySelector('.hero h1');
        if (heroText) {
            heroText.style.fontDisplay = 'swap';
            heroText.style.willChange = 'auto'; // Remove after paint
        }
        
        // Prioritize above-the-fold CSS
        this.inlineCriticalCSS();
    }
    
    optimizeFID() {
        console.log('⚡ Optimizing First Input Delay...');
        
        // Defer non-critical JavaScript
        document.querySelectorAll('script:not([async]):not([defer])').forEach(script => {
            if (!script.src.includes('critical') && !script.innerHTML.includes('critical')) {
                script.defer = true;
            }
        });
        
        // Break up long tasks
        this.breakUpLongTasks();
        
        // Use passive event listeners where possible
        this.optimizeEventListeners();
    }
    
    inlineCriticalCSS() {
        // Extract critical CSS for above-the-fold content
        const criticalSelectors = [
            '.hero', '.hero-content', '.hero h1',
            '.face-scanner-hero', '.scanner-frame-mini',
            '.trust-bar', '.trust-item',
            '.btn', '.btn-primary'
        ];
        
        let criticalCSS = '';
        const styleSheets = Array.from(document.styleSheets);
        
        styleSheets.forEach(sheet => {
            try {
                const rules = Array.from(sheet.cssRules || sheet.rules);
                rules.forEach(rule => {
                    if (rule.type === CSSRule.STYLE_RULE) {
                        const selector = rule.selectorText;
                        if (criticalSelectors.some(critical => selector.includes(critical))) {
                            criticalCSS += rule.cssText + '\n';
                        }
                    }
                });
            } catch (e) {
                // CORS or other security restrictions
            }
        });
        
        if (criticalCSS && !document.querySelector('#critical-inline-css')) {
            const style = document.createElement('style');
            style.id = 'critical-inline-css';
            style.textContent = criticalCSS;
            document.head.insertBefore(style, document.head.firstChild);
        }
    }
    
    breakUpLongTasks() {
        // Replace heavy operations with time-sliced versions
        const heavyOperations = [
            'createParticle3D',
            'createMagneticParticle',
            'updateParallax'
        ];
        
        heavyOperations.forEach(operationName => {
            if (window[operationName]) {
                const originalOperation = window[operationName];
                window[operationName] = (...args) => {
                    // Time-slice the operation
                    setTimeout(() => originalOperation.apply(this, args), 0);
                };
            }
        });
    }
    
    optimizeEventListeners() {
        // Convert to passive where possible
        const passiveEvents = ['scroll', 'wheel', 'touchstart', 'touchmove'];
        
        passiveEvents.forEach(eventType => {
            const originalAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (passiveEvents.includes(type) && typeof options !== 'object') {
                    options = { passive: true };
                } else if (typeof options === 'object' && options.passive === undefined) {
                    options.passive = true;
                }
                return originalAddEventListener.call(this, type, listener, options);
            };
        });
    }
    
    setupAdaptiveOptimization() {
        // Monitor device performance and adapt
        this.adaptiveOptimizer = {
            deviceScore: this.calculateDeviceScore(),
            networkSpeed: 'unknown',
            batteryLevel: 1,
            
            adapt: () => {
                if (this.adaptiveOptimizer.deviceScore < 50) {
                    this.enableLowEndMode();
                } else if (this.adaptiveOptimizer.deviceScore > 80) {
                    this.enableHighEndMode();
                }
                
                if (this.adaptiveOptimizer.batteryLevel < 0.2) {
                    this.enableBatterySaverMode();
                }
            }
        };
        
        // Monitor network speed
        if ('connection' in navigator) {
            const updateConnection = () => {
                this.adaptiveOptimizer.networkSpeed = navigator.connection.effectiveType;
                if (navigator.connection.effectiveType === 'slow-2g' || 
                    navigator.connection.effectiveType === '2g') {
                    this.enableLowBandwidthMode();
                }
            };
            
            updateConnection();
            navigator.connection.addEventListener('change', updateConnection);
        }
        
        // Monitor battery
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.adaptiveOptimizer.batteryLevel = battery.level;
                
                battery.addEventListener('levelchange', () => {
                    this.adaptiveOptimizer.batteryLevel = battery.level;
                    this.adaptiveOptimizer.adapt();
                });
            });
        }
        
        this.adaptiveOptimizer.adapt();
    }
    
    calculateDeviceScore() {
        let score = 0;
        
        // CPU cores
        score += (navigator.hardwareConcurrency || 2) * 15;
        
        // Memory
        score += (navigator.deviceMemory || 2) * 10;
        
        // Screen resolution (higher = more powerful device)
        score += Math.min(window.screen.width * window.screen.height / 100000, 20);
        
        // WebGL support
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (gl) score += 25;
        
        return Math.min(score, 100);
    }
    
    enableLowEndMode() {
        console.log('📱 Enabling low-end device optimizations...');
        
        document.body.classList.add('low-end-device');
        
        // Disable heavy effects
        const style = document.createElement('style');
        style.textContent = `
            .low-end-device .cinematic-3d,
            .low-end-device .parallax-container {
                transform-style: flat !important;
            }
            
            .low-end-device .particle-3d,
            .low-end-device .magnetic-particle {
                display: none !important;
            }
            
            .low-end-device * {
                animation-duration: 0.2s !important;
                transition-duration: 0.2s !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    enableHighEndMode() {
        console.log('🖥️ Enabling high-end device optimizations...');
        
        document.body.classList.add('high-end-device');
        
        // Enable all effects
        document.documentElement.style.setProperty('--particle-count', '100');
        document.documentElement.style.setProperty('--animation-quality', 'ultra');
        
        // Preload additional resources
        this.preloadEnhancedResources();
    }
    
    enableBatterySaverMode() {
        console.log('🔋 Enabling battery saver mode...');
        
        document.body.classList.add('battery-saver');
        
        // Reduce frame rate
        const style = document.createElement('style');
        style.textContent = `
            .battery-saver * {
                animation-duration: 0.5s !important;
                transition-duration: 0.3s !important;
            }
            
            .battery-saver .particle-3d,
            .battery-saver .dopamine-burst {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    enableLowBandwidthMode() {
        console.log('🌐 Enabling low bandwidth optimizations...');
        
        // Disable video autoplay
        document.querySelectorAll('video').forEach(video => {
            video.preload = 'none';
            video.autoplay = false;
        });
        
        // Use placeholder images
        document.querySelectorAll('img').forEach(img => {
            if (!img.src.includes('placeholder')) {
                img.dataset.originalSrc = img.src;
                img.src = 'data:image/svg+xml;base64,' + btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                        <rect width="400" height="300" fill="#f0f0f0"/>
                        <text x="200" y="150" text-anchor="middle" fill="#666" font-family="Arial" font-size="16">
                            Image Loading...
                        </text>
                    </svg>
                `);
            }
        });
    }
    
    setupCriticalResourcePrioritization() {
        // Resource hints for critical resources
        const criticalResources = [
            '/facepay-demo-poster.webp',
            'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
        ];
        
        criticalResources.forEach(resource => {
            if (!document.querySelector(`link[href="${resource}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = resource;
                link.as = resource.includes('font') ? 'font' : 'image';
                if (resource.includes('font')) link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            }
        });
        
        // DNS prefetch for external resources
        const externalDomains = [
            'fonts.googleapis.com',
            'fonts.gstatic.com'
        ];
        
        externalDomains.forEach(domain => {
            if (!document.querySelector(`link[href="//${domain}"]`)) {
                const link = document.createElement('link');
                link.rel = 'dns-prefetch';
                link.href = `//${domain}`;
                document.head.appendChild(link);
            }
        });
    }
    
    setupIntelligentPrefetching() {
        // Predictive prefetching based on user behavior
        this.prefetcher = {
            userIntents: new Map(),
            confidence: 0,
            
            trackIntent: (element, action) => {
                const key = `${element.tagName.toLowerCase()}.${element.className}`;
                const current = this.prefetcher.userIntents.get(key) || 0;
                this.prefetcher.userIntents.set(key, current + 1);
                
                // If user shows strong intent, prefetch related resources
                if (current > 2) {
                    this.prefetcher.prefetchForElement(element, action);
                }
            },
            
            prefetchForElement: (element, action) => {
                if (element.classList.contains('btn-primary')) {
                    // Prefetch demo video
                    this.prefetchResource('/facepay-demo-optimized.mp4', 'video');
                } else if (element.classList.contains('face-scanner-hero')) {
                    // Prefetch success celebration resources
                    this.prefetchCelebrationResources();
                } else if (element.href && element.href.startsWith('#')) {
                    // Prefetch section resources
                    this.prefetchSectionResources(element.href.substr(1));
                }
            }
        };
        
        // Track hover/focus events for intent prediction
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('btn') || 
                e.target.classList.contains('face-scanner-hero')) {
                this.prefetcher.trackIntent(e.target, 'hover');
            }
        }, { passive: true });
        
        document.addEventListener('focus', (e) => {
            if (e.target.classList.contains('btn')) {
                this.prefetcher.trackIntent(e.target, 'focus');
            }
        }, { passive: true });
    }
    
    prefetchResource(url, type) {
        if (!document.querySelector(`link[href="${url}"]`)) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            link.as = type;
            document.head.appendChild(link);
        }
    }
    
    prefetchCelebrationResources() {
        // Prefetch particle system resources
        const celebrationResources = [
            'particles.js'
        ];
        
        celebrationResources.forEach(resource => {
            this.prefetchResource(resource, 'script');
        });
    }
    
    prefetchSectionResources(sectionId) {
        // Prefetch resources needed for specific sections
        const sectionResources = {
            'demo': ['/facepay-demo-optimized.mp4'],
            'download': ['analytics-system.js']
        };
        
        if (sectionResources[sectionId]) {
            sectionResources[sectionId].forEach(resource => {
                const type = resource.includes('.mp4') ? 'video' : 'script';
                this.prefetchResource(resource, type);
            });
        }
    }
    
    setupRealTimeOptimization() {
        // Monitor and optimize in real-time
        this.realTimeOptimizer = {
            frameDrops: 0,
            longTasks: 0,
            memoryPressure: 0,
            
            monitor: () => {
                // Monitor frame drops
                let lastTime = performance.now();
                let frameCount = 0;
                
                const checkFrame = (currentTime) => {
                    const delta = currentTime - lastTime;
                    
                    if (delta > 16.67 * 2) { // Dropped frame
                        this.realTimeOptimizer.frameDrops++;
                        
                        if (this.realTimeOptimizer.frameDrops > 5) {
                            this.reduceQuality();
                            this.realTimeOptimizer.frameDrops = 0;
                        }
                    }
                    
                    frameCount++;
                    if (frameCount % 60 === 0) {
                        lastTime = currentTime;
                    }
                    
                    requestAnimationFrame(checkFrame);
                };
                
                requestAnimationFrame(checkFrame);
                
                // Monitor long tasks
                if ('PerformanceObserver' in window) {
                    const observer = new PerformanceObserver((list) => {
                        list.getEntries().forEach((entry) => {
                            if (entry.duration > 50) {
                                this.realTimeOptimizer.longTasks++;
                                if (this.realTimeOptimizer.longTasks > 3) {
                                    this.optimizeTaskExecution();
                                    this.realTimeOptimizer.longTasks = 0;
                                }
                            }
                        });
                    });
                    
                    observer.observe({ entryTypes: ['longtask'] });
                }
                
                // Monitor memory pressure
                if (performance.memory) {
                    setInterval(() => {
                        const memoryInfo = performance.memory;
                        const usageRatio = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
                        
                        if (usageRatio > 0.8) {
                            this.realTimeOptimizer.memoryPressure++;
                            if (this.realTimeOptimizer.memoryPressure > 2) {
                                this.emergencyMemoryCleanup();
                                this.realTimeOptimizer.memoryPressure = 0;
                            }
                        } else {
                            this.realTimeOptimizer.memoryPressure = 0;
                        }
                    }, 5000);
                }
            }
        };
        
        this.realTimeOptimizer.monitor();
    }
    
    reduceQuality() {
        console.log('⚡ Reducing quality due to performance issues...');
        
        // Reduce particle count
        document.documentElement.style.setProperty('--particle-count', '5');
        
        // Simplify animations
        document.querySelectorAll('[class*="animate"]').forEach(el => {
            el.style.animationDuration = '0.2s';
        });
        
        // Pause non-essential animations
        document.querySelectorAll('.particle-3d, .magnetic-particle').forEach(el => {
            el.style.display = 'none';
        });
    }
    
    optimizeTaskExecution() {
        console.log('🔧 Optimizing task execution...');
        
        // Break up heavy operations
        this.breakUpLongTasks();
        
        // Use scheduler API if available
        if ('scheduler' in window && window.scheduler.postTask) {
            // Defer non-critical tasks
            window.scheduler.postTask(() => {
                this.memoryManager.cleanup();
            }, { priority: 'background' });
        }
    }
    
    emergencyMemoryCleanup() {
        console.log('🧹 Emergency memory cleanup...');
        
        // Clear all caches
        this.memoryManager.cache.clear();
        this.memoryManager.currentCacheSize = 0;
        
        // Remove all particles
        document.querySelectorAll('.particle-3d, .magnetic-particle, .dopamine-burst').forEach(el => {
            el.remove();
        });
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }
    
    cleanupEventListeners() {
        // Remove duplicate event listeners
        const eventTargets = new Map();
        
        // This is a simplified cleanup - in a real implementation,
        // you'd want to track all event listeners added
        document.querySelectorAll('*').forEach(el => {
            const listeners = el.getEventListeners ? el.getEventListeners() : {};
            Object.keys(listeners).forEach(eventType => {
                if (listeners[eventType].length > 1) {
                    // Multiple listeners of same type - potential duplication
                    console.warn(`Multiple ${eventType} listeners on element:`, el);
                }
            });
        });
    }
    
    preloadEnhancedResources() {
        const enhancedResources = [
            'particles.js',
            'analytics-system.js'
        ];
        
        enhancedResources.forEach(resource => {
            this.prefetchResource(resource, 'script');
        });
    }
    
    // Public API
    getPerformanceReport() {
        return {
            metrics: this.performanceMonitor?.metrics || {},
            budgets: this.budgets,
            deviceScore: this.adaptiveOptimizer?.deviceScore || 0,
            memoryUsage: {
                cache: this.memoryManager.currentCacheSize,
                jsHeap: performance.memory?.usedJSHeapSize || 0
            },
            optimizations: {
                clsOptimized: document.querySelector('#critical-inline-css') !== null,
                lcpOptimized: document.querySelector('link[rel="preload"][as="image"]') !== null,
                fidOptimized: document.querySelectorAll('script[defer]').length > 0
            }
        };
    }
    
    forceOptimization(type) {
        switch (type) {
            case 'cls':
                this.optimizeCLS();
                break;
            case 'lcp':
                this.optimizeLCP();
                break;
            case 'fid':
                this.optimizeFID();
                break;
            case 'memory':
                this.emergencyMemoryCleanup();
                break;
            case 'quality':
                this.reduceQuality();
                break;
        }
    }
    
    enablePerformanceMode(mode) {
        switch (mode) {
            case 'low-end':
                this.enableLowEndMode();
                break;
            case 'high-end':
                this.enableHighEndMode();
                break;
            case 'battery-saver':
                this.enableBatterySaverMode();
                break;
            case 'low-bandwidth':
                this.enableLowBandwidthMode();
                break;
        }
    }
    
    destroy() {
        // Cleanup all optimizations
        this.memoryManager.cache.clear();
        document.querySelectorAll('style[id*="optimization"]').forEach(style => style.remove());
    }
}

// Global instance
window.ultimatePerformanceOptimizer = null;

// Initialize immediately for critical performance
window.ultimatePerformanceOptimizer = new UltimatePerformanceOptimizer();