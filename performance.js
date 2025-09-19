/**
 * PERFORMANCE.JS - Lazy Loading and Code Splitting Module
 * Optimized for maximum Lighthouse score and minimal bundle size
 */

class PerformanceManager {
    constructor() {
        this.isLoaded = false;
        this.observers = new Map();
        this.loadedChunks = new Set();
        this.criticalResourcesLoaded = false;
        
        // Initialize core performance features
        this.initCriticalPath();
    }

    // Critical path initialization - loads immediately
    initCriticalPath() {
        // Measure initial performance metrics
        this.measureInitialMetrics();
        
        // Setup critical observers
        this.setupIntersectionObservers();
        
        // Load critical resources
        this.loadCriticalResources();
        
        // Setup early event listeners
        this.setupEarlyListeners();
    }

    // Measure Web Vitals and performance metrics
    measureInitialMetrics() {
        // Mark navigation timing
        if (performance.mark) {
            performance.mark('app-start');
        }

        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                // Target: LCP < 2.5s (Good)
                const lcpTime = lastEntry.startTime;
                console.log('LCP:', lcpTime, 'ms');
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'web_vitals', {
                        'metric_name': 'LCP',
                        'metric_value': Math.round(lcpTime),
                        'metric_rating': lcpTime < 2500 ? 'good' : lcpTime < 4000 ? 'needs_improvement' : 'poor'
                    });
                }
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const fidTime = entry.processingStart - entry.startTime;
                    console.log('FID:', fidTime, 'ms');
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'web_vitals', {
                            'metric_name': 'FID',
                            'metric_value': Math.round(fidTime),
                            'metric_rating': fidTime < 100 ? 'good' : fidTime < 300 ? 'needs_improvement' : 'poor'
                        });
                    }
                }
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                console.log('CLS:', clsValue);
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'web_vitals', {
                        'metric_name': 'CLS',
                        'metric_value': Math.round(clsValue * 1000) / 1000,
                        'metric_rating': clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs_improvement' : 'poor'
                    });
                }
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }

    // Setup intersection observers for lazy loading
    setupIntersectionObservers() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px 0px 50px 0px'
        };

        // Image lazy loading observer
        this.observers.set('images', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observers.get('images').unobserve(entry.target);
                }
            });
        }, observerOptions));

        // Video lazy loading observer
        this.observers.set('videos', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadVideo(entry.target);
                    this.observers.get('videos').unobserve(entry.target);
                }
            });
        }, observerOptions));

        // Section animation observer
        this.observers.set('sections', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    this.loadSectionChunk(entry.target);
                }
            });
        }, { threshold: 0.2 }));
    }

    // Load critical resources with optimal timing
    loadCriticalResources() {
        // Preload critical fonts with font-display: swap
        this.loadFont('Inter', '400;600;700;900');
        
        // Preload hero video poster
        this.preloadImage('/video-poster.jpg', 'high');
        
        // Setup resource timing
        if (performance.getEntriesByType) {
            setTimeout(() => this.analyzeResourceTiming(), 1000);
        }
        
        this.criticalResourcesLoaded = true;
    }

    // Font loading with swap and subset support
    async loadFont(family, weights) {
        // Create optimized font URL with display=swap for immediate text rendering
        const fontUrl = `https://fonts.googleapis.com/css2?family=${family}:wght@${weights}&display=swap&subset=latin`;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = fontUrl;
        link.as = 'style';
        link.crossOrigin = 'anonymous';
        
        // Load font stylesheet after preload
        link.onload = () => {
            const styleLink = document.createElement('link');
            styleLink.rel = 'stylesheet';
            styleLink.href = fontUrl;
            document.head.appendChild(styleLink);
        };
        
        document.head.appendChild(link);
    }

    // Optimized image loading with WebP/AVIF support
    loadImage(img) {
        if (img.dataset.loaded) return;
        
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;
        
        if (srcset) {
            img.srcset = srcset;
        }
        
        if (src) {
            // Support modern image formats
            const modernSrc = this.getModernImageSrc(src);
            
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = modernSrc;
                img.classList.add('loaded');
                img.dataset.loaded = 'true';
            };
            tempImg.src = modernSrc;
        }
    }

    // Get modern image format (WebP/AVIF) with fallback
    getModernImageSrc(originalSrc) {
        // Check for AVIF support
        if (this.supportsImageFormat('avif')) {
            return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
        }
        // Check for WebP support
        if (this.supportsImageFormat('webp')) {
            return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
        return originalSrc;
    }

    // Check image format support
    supportsImageFormat(format) {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL(`image/${format}`).indexOf(`image/${format}`) === 5;
    }

    // Optimized video loading
    loadVideo(video) {
        if (video.dataset.loaded) return;
        
        const src = video.dataset.src;
        if (src) {
            video.src = src;
            video.load();
            video.dataset.loaded = 'true';
            
            // Setup video optimization
            this.optimizeVideo(video);
        }
    }

    // Video optimization for performance
    optimizeVideo(video) {
        // Lazy load video on interaction
        const playOnInteraction = () => {
            video.play().catch(console.log);
            document.removeEventListener('click', playOnInteraction, { once: true });
            document.removeEventListener('scroll', playOnInteraction, { once: true });
        };
        
        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('scroll', playOnInteraction, { once: true });
        
        // Pause video when not in view to save resources
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(console.log);
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.25 });
        
        videoObserver.observe(video);
    }

    // Dynamic chunk loading for sections
    async loadSectionChunk(section) {
        const chunkName = section.dataset.chunk;
        if (!chunkName || this.loadedChunks.has(chunkName)) return;
        
        this.loadedChunks.add(chunkName);
        
        try {
            switch (chunkName) {
                case 'testimonials':
                    await this.loadTestimonialsChunk();
                    break;
                case 'features':
                    await this.loadFeaturesChunk();
                    break;
                case 'demo':
                    await this.loadDemoChunk();
                    break;
                default:
                    console.log(`Unknown chunk: ${chunkName}`);
            }
        } catch (error) {
            console.error(`Failed to load chunk ${chunkName}:`, error);
        }
    }

    // Load testimonials functionality
    async loadTestimonialsChunk() {
        // Dynamically import testimonials module
        const { TestimonialsManager } = await import('./chunks/testimonials.js');
        new TestimonialsManager().init();
    }

    // Load features functionality
    async loadFeaturesChunk() {
        const { FeaturesManager } = await import('./chunks/features.js');
        new FeaturesManager().init();
    }

    // Load demo functionality
    async loadDemoChunk() {
        const { DemoManager } = await import('./chunks/demo.js');
        new DemoManager().init();
    }

    // Setup early event listeners (critical path)
    setupEarlyListeners() {
        // Early CTA tracking
        document.addEventListener('click', this.handleEarlyCTAClick.bind(this));
        
        // Scroll tracking (throttled)
        let scrollTimeout;
        document.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
                scrollTimeout = null;
            }, 16); // 60fps
        }, { passive: true });
    }

    // Handle early CTA clicks before full app loads
    handleEarlyCTAClick(event) {
        const button = event.target.closest('button');
        if (!button) return;
        
        // Track early engagement
        if (typeof gtag !== 'undefined') {
            gtag('event', 'early_engagement', {
                'event_category': 'performance',
                'event_label': button.textContent.trim().substring(0, 20)
            });
        }
    }

    // Optimized scroll handling
    handleScroll() {
        // Calculate scroll depth efficiently
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        // Track significant scroll milestones
        if (scrollPercent >= 75 && !this.scrollMilestones?.has(75)) {
            this.scrollMilestones = this.scrollMilestones || new Set();
            this.scrollMilestones.add(75);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'scroll_depth', {
                    'event_category': 'engagement',
                    'value': 75
                });
            }
        }
    }

    // Preload critical resources
    preloadImage(src, priority = 'low') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        if (priority === 'high') {
            link.fetchPriority = 'high';
        }
        document.head.appendChild(link);
    }

    // Analyze resource timing for optimization insights
    analyzeResourceTiming() {
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources.filter(r => r.duration > 1000);
        
        if (slowResources.length > 0) {
            console.warn('Slow resources detected:', slowResources.map(r => ({
                name: r.name,
                duration: r.duration,
                size: r.transferSize
            })));
        }
    }

    // Initialize lazy loading for all elements
    initLazyLoading() {
        // Observe all lazy-loadable images
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.observers.get('images').observe(img);
        });

        // Observe all lazy-loadable videos
        document.querySelectorAll('video[data-src]').forEach(video => {
            this.observers.get('videos').observe(video);
        });

        // Observe all sections with chunks
        document.querySelectorAll('section[data-chunk]').forEach(section => {
            this.observers.get('sections').observe(section);
        });
    }

    // Service Worker registration with update handling
    async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;

        try {
            const registration = await navigator.serviceWorker.register('/service-worker-v2.js');
            console.log('SW registered:', registration);

            // Handle updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.showUpdateAvailable();
                    }
                });
            });

        } catch (error) {
            console.log('SW registration failed:', error);
        }
    }

    // Show update notification
    showUpdateAvailable() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 glass-urgent p-4 rounded-xl z-50 transform translate-x-full transition-transform';
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-yellow-400">⚡</span>
                <span>Nueva versión disponible</span>
                <button onclick="window.location.reload()" class="px-3 py-1 bg-emerald-500 rounded-lg text-sm hover:bg-emerald-600 transition">
                    Actualizar
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            notification.remove();
        }, 10000);
    }

    // Initialize all performance optimizations
    init() {
        if (this.isLoaded) return;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
            return;
        }

        console.log('🚀 Performance Manager initialized');
        
        // Initialize lazy loading
        this.initLazyLoading();
        
        // Register service worker
        this.registerServiceWorker();
        
        // Mark as loaded
        this.isLoaded = true;
        
        // Performance mark
        if (performance.mark) {
            performance.mark('app-ready');
            performance.measure('app-initialization', 'app-start', 'app-ready');
        }
    }
}

// Create and initialize performance manager
const performanceManager = new PerformanceManager();

// Auto-initialize when script loads
performanceManager.init();

// Export for manual control if needed
window.PerformanceManager = performanceManager;

// Expose utilities globally for backward compatibility
window.loadYouTubeVideo = function(button) {
    const container = button.parentElement;
    const videoId = container.dataset.videoId || 'dQw4w9WgXcQ';
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'video_load', {
            'event_category': 'engagement',
            'event_label': 'demo_video'
        });
    }
    
    container.innerHTML = `
        <iframe 
            class="w-full aspect-video rounded-3xl hover:scale-105 transition duration-300" 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
            frameborder="0" 
            allow="autoplay; encrypted-media"
            allowfullscreen
            loading="lazy"
        ></iframe>
    `;
};

window.joinRevolution = async function() {
    // Track conversion attempt
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion_attempt', {
            'event_category': 'app',
            'event_label': 'beta_access',
            'value': 1
        });
    }
    
    // Load conversion chunk
    try {
        const { ConversionManager } = await import('./chunks/conversion.js');
        new ConversionManager().handleJoinRevolution();
    } catch (error) {
        // Fallback to basic functionality
        console.log('Loading fallback conversion flow');
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = '⏳ PROCESANDO...';
        button.disabled = true;
        
        setTimeout(() => {
            alert('🎉 ¡FELICIDADES! Has sido aceptado en la Beta Exclusiva.');
            button.innerHTML = '✅ ¡YA ESTÁS DENTRO!';
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        }, 2000);
    }
};

window.watchDemo = function() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'demo_watch_attempt', {
            'event_category': 'engagement',
            'event_label': 'main_demo'
        });
    }
    
    const demoSection = document.getElementById('demo');
    if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
    }
};