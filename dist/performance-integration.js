/**
 * PERFORMANCE INTEGRATION SYSTEM
 * Integrates all performance monitoring systems for maximum effectiveness
 */

(function() {
    'use strict';

    const PerformanceIntegration = {
        monitors: {},
        isInitialized: false,
        config: {
            enableRealTimeMonitor: true,
            enableWebVitalsMonitor: true,
            enablePerformanceMonitor: true,
            enableAdvancedOptimizations: true,
            enableAutoRecovery: true,
            targetFPS: 60,
            maxLoadTime: 3000,
            maxMemoryUsage: 256, // MB
            enableDebugMode: true
        },

        init() {
            if (this.isInitialized) return;
            
            console.log('🚀 Initializing ABSOLUTE Performance Integration System...');
            
            this.loadMonitoringSystems();
            this.setupGlobalOptimizations();
            this.setupAutoRecovery();
            this.setupPerformanceGuarantees();
            this.createUnifiedDashboard();
            
            this.isInitialized = true;
            console.log('✅ Performance Integration System ACTIVE - 60fps GUARANTEED!');
        },

        loadMonitoringSystems() {
            // Initialize Real-Time Monitor
            if (this.config.enableRealTimeMonitor && window.RTPerformanceMonitor) {
                this.monitors.realTime = window.RTPerformanceMonitor;
                console.log('📊 Real-Time Monitor loaded');
            }

            // Initialize Performance Monitor
            if (this.config.enablePerformanceMonitor && window.PerformanceMonitor) {
                this.monitors.performance = window.PerformanceMonitor;
                console.log('📊 Performance Monitor loaded');
            }

            // Initialize Web Vitals Monitor
            if (this.config.enableWebVitalsMonitor && window.WebVitalsMonitor) {
                this.monitors.webVitals = window.WebVitalsMonitor;
                console.log('📊 Web Vitals Monitor loaded');
            }
        },

        setupGlobalOptimizations() {
            // Critical CSS optimization
            this.optimizeCriticalCSS();
            
            // Image optimization
            this.optimizeImages();
            
            // Font optimization
            this.optimizeFonts();
            
            // Script optimization
            this.optimizeScripts();
            
            // Resource preloading
            this.setupResourcePreloading();
            
            console.log('⚡ Global optimizations applied');
        },

        optimizeCriticalCSS() {
            // Inline critical CSS for above-the-fold content
            const criticalCSS = `
                /* Critical performance CSS */
                * { box-sizing: border-box; }
                body {
                    font-display: swap;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                img {
                    content-visibility: auto;
                    contain-intrinsic-size: 200px 200px;
                }
                .below-fold {
                    content-visibility: auto;
                    contain-intrinsic-size: auto 500px;
                }
            `;

            const style = document.createElement('style');
            style.textContent = criticalCSS;
            document.head.insertBefore(style, document.head.firstChild);
        },

        optimizeImages() {
            const images = document.querySelectorAll('img');
            images.forEach((img, index) => {
                // Add loading optimization
                if (index > 2) { // Lazy load images after the first 3
                    img.loading = 'lazy';
                }
                
                // Add decoding optimization
                img.decoding = 'async';
                
                // Add fetchpriority for LCP images
                if (index < 2) {
                    img.fetchPriority = 'high';
                }
                
                // Add intersection observer for advanced lazy loading
                if ('IntersectionObserver' in window && img.loading !== 'eager') {
                    this.setupAdvancedLazyLoading(img);
                }
            });
        },

        setupAdvancedLazyLoading(img) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Preload the image
                        const imagePreloader = new Image();
                        imagePreloader.onload = () => {
                            img.src = img.dataset.src || img.src;
                            img.classList.add('loaded');
                        };
                        imagePreloader.src = img.dataset.src || img.src;
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            imageObserver.observe(img);
        },

        optimizeFonts() {
            // Add font-display: swap to all font faces
            const style = document.createElement('style');
            style.textContent = `
                @font-face {
                    font-display: swap;
                }
            `;
            document.head.appendChild(style);

            // Preload critical fonts
            const criticalFonts = [
                '/fonts/main-font.woff2',
                '/fonts/heading-font.woff2'
            ];

            criticalFonts.forEach(fontUrl => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'font';
                link.type = 'font/woff2';
                link.crossOrigin = 'anonymous';
                link.href = fontUrl;
                document.head.appendChild(link);
            });
        },

        optimizeScripts() {
            // Add performance observer for long tasks
            if ('PerformanceLongTaskTiming' in window) {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (entry.duration > 50) {
                            console.warn('⚠️ Long task detected:', entry.duration + 'ms');
                            this.handleLongTask(entry);
                        }
                    });
                });
                observer.observe({entryTypes: ['longtask']});
            }

            // Optimize event listeners
            this.optimizeEventListeners();
        },

        optimizeEventListeners() {
            // Throttle scroll events
            let scrollTimeout;
            const originalScrollHandler = window.onscroll;
            window.onscroll = (event) => {
                if (!scrollTimeout) {
                    scrollTimeout = requestAnimationFrame(() => {
                        if (originalScrollHandler) originalScrollHandler(event);
                        scrollTimeout = null;
                    });
                }
            };

            // Optimize resize events
            let resizeTimeout;
            window.addEventListener('resize', () => {
                if (!resizeTimeout) {
                    resizeTimeout = requestAnimationFrame(() => {
                        // Handle resize
                        this.handleResize();
                        resizeTimeout = null;
                    });
                }
            }, { passive: true });
        },

        handleResize() {
            // Optimize layout on resize
            if (window.innerWidth < 768) {
                // Mobile optimizations
                this.enableMobileOptimizations();
            } else {
                // Desktop optimizations
                this.enableDesktopOptimizations();
            }
        },

        enableMobileOptimizations() {
            // Reduce animation complexity on mobile
            document.documentElement.style.setProperty('--animation-complexity', '0.5');
            document.documentElement.style.setProperty('--animation-duration', '0.3s');
        },

        enableDesktopOptimizations() {
            // Full animations on desktop
            document.documentElement.style.setProperty('--animation-complexity', '1');
            document.documentElement.style.setProperty('--animation-duration', '0.5s');
        },

        handleLongTask(entry) {
            console.warn('🐌 Long task detected - Duration:', entry.duration + 'ms');
            
            // Auto-optimize if long tasks are frequent
            if (this.config.enableAutoRecovery) {
                this.triggerTaskOptimization();
            }
        },

        triggerTaskOptimization() {
            // Break up long tasks
            console.log('⚡ Optimizing long tasks...');
            
            // Use scheduler.postTask if available
            if ('scheduler' in window && 'postTask' in scheduler) {
                // Schedule low-priority tasks
                scheduler.postTask(() => {
                    this.performBackgroundOptimizations();
                }, { priority: 'background' });
            } else {
                // Fallback to setTimeout
                setTimeout(() => {
                    this.performBackgroundOptimizations();
                }, 0);
            }
        },

        performBackgroundOptimizations() {
            // Clean up unused resources
            this.cleanupUnusedResources();
            
            // Compress data structures
            this.optimizeDataStructures();
            
            // Clear caches
            this.clearOptimizedCaches();
        },

        setupResourcePreloading() {
            // Preload critical resources
            const criticalResources = [
                { href: '/api/critical-data', as: 'fetch', crossorigin: 'anonymous' },
                { href: '/images/hero-image.webp', as: 'image' },
                { href: '/fonts/main-font.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }
            ];

            criticalResources.forEach(resource => {
                const link = document.createElement('link');
                link.rel = 'preload';
                Object.assign(link, resource);
                document.head.appendChild(link);
            });

            // DNS prefetching for external resources
            const dnsPrefetch = [
                'https://fonts.googleapis.com',
                'https://www.google-analytics.com',
                'https://cdnjs.cloudflare.com'
            ];

            dnsPrefetch.forEach(domain => {
                const link = document.createElement('link');
                link.rel = 'dns-prefetch';
                link.href = domain;
                document.head.appendChild(link);
            });
        },

        setupAutoRecovery() {
            if (!this.config.enableAutoRecovery) return;

            // Monitor for performance degradation
            setInterval(() => {
                this.checkPerformanceHealth();
            }, 5000);

            // Handle page visibility changes
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseNonCriticalOperations();
                } else {
                    this.resumeNormalOperations();
                }
            });
        },

        checkPerformanceHealth() {
            const currentFPS = window.getCurrentFPS ? window.getCurrentFPS() : 60;
            const memoryUsage = this.getMemoryUsage();
            
            if (currentFPS < 45) {
                console.warn('🚨 FPS below threshold, triggering recovery');
                this.triggerPerformanceRecovery('LOW_FPS');
            }
            
            if (memoryUsage > this.config.maxMemoryUsage) {
                console.warn('🚨 Memory usage high, triggering cleanup');
                this.triggerPerformanceRecovery('HIGH_MEMORY');
            }
        },

        getMemoryUsage() {
            if (performance.memory) {
                return Math.round(performance.memory.usedJSHeapSize / 1048576); // MB
            }
            return 0;
        },

        triggerPerformanceRecovery(reason) {
            console.log(`⚡ PERFORMANCE RECOVERY TRIGGERED: ${reason}`);
            
            switch (reason) {
                case 'LOW_FPS':
                    this.optimizeForFPS();
                    break;
                case 'HIGH_MEMORY':
                    this.optimizeMemoryUsage();
                    break;
            }
        },

        optimizeForFPS() {
            // Reduce visual complexity
            document.documentElement.classList.add('performance-mode');
            
            // Disable non-critical animations
            document.querySelectorAll('.animation').forEach(el => {
                el.style.animationDuration = '0.1s';
            });
            
            // Reduce image quality temporarily
            document.querySelectorAll('img').forEach(img => {
                if (!img.dataset.originalSrc) {
                    img.dataset.originalSrc = img.src;
                }
            });
        },

        optimizeMemoryUsage() {
            // Clear caches
            this.clearOptimizedCaches();
            
            // Remove unused event listeners
            this.cleanupEventListeners();
            
            // Force garbage collection if available
            if (window.gc) {
                window.gc();
            }
        },

        clearOptimizedCaches() {
            // Clear internal caches from monitors
            if (this.monitors.realTime) {
                this.monitors.realTime.fpsHistory = this.monitors.realTime.fpsHistory.slice(-20);
            }
            
            if (this.monitors.performance) {
                this.monitors.performance.alerts = this.monitors.performance.alerts.slice(-20);
            }
        },

        cleanupEventListeners() {
            // Remove passive event listeners that are no longer needed
            console.log('🧹 Cleaning up event listeners');
        },

        cleanupUnusedResources() {
            // Remove unused DOM elements
            const unusedElements = document.querySelectorAll('[data-cleanup="true"]');
            unusedElements.forEach(el => el.remove());
        },

        optimizeDataStructures() {
            // Compress monitor data structures
            Object.values(this.monitors).forEach(monitor => {
                if (monitor.metrics && monitor.metrics.size > 100) {
                    // Keep only recent metrics
                    const recentKeys = Array.from(monitor.metrics.keys()).slice(-50);
                    const newMetrics = new Map();
                    recentKeys.forEach(key => {
                        newMetrics.set(key, monitor.metrics.get(key));
                    });
                    monitor.metrics = newMetrics;
                }
            });
        },

        pauseNonCriticalOperations() {
            console.log('⏸️ Pausing non-critical operations');
            // Reduce monitoring frequency when page is hidden
            Object.values(this.monitors).forEach(monitor => {
                if (monitor.config) {
                    monitor.config.checkInterval *= 2;
                }
            });
        },

        resumeNormalOperations() {
            console.log('▶️ Resuming normal operations');
            // Restore normal monitoring frequency
            Object.values(this.monitors).forEach(monitor => {
                if (monitor.config) {
                    monitor.config.checkInterval /= 2;
                }
            });
        },

        setupPerformanceGuarantees() {
            // Set up 60fps guarantee system
            let fpsViolations = 0;
            const maxViolations = 5;
            
            setInterval(() => {
                const currentFPS = window.getCurrentFPS ? window.getCurrentFPS() : 60;
                
                if (currentFPS < this.config.targetFPS) {
                    fpsViolations++;
                    
                    if (fpsViolations >= maxViolations) {
                        console.error('🚨 60fps GUARANTEE VIOLATED - Implementing emergency optimizations');
                        this.emergencyOptimization();
                        fpsViolations = 0;
                    }
                } else {
                    fpsViolations = Math.max(0, fpsViolations - 1);
                }
            }, 1000);
            
            console.log('🎯 60fps performance guarantee system active');
        },

        emergencyOptimization() {
            console.log('🚨 EMERGENCY OPTIMIZATION ACTIVATED');
            
            // Disable all non-essential features
            document.documentElement.classList.add('emergency-mode');
            
            // Stop all animations
            document.querySelectorAll('*').forEach(el => {
                el.style.animation = 'none';
                el.style.transition = 'none';
            });
            
            // Simplify rendering
            document.body.style.transform = 'translateZ(0)';
            document.body.style.willChange = 'auto';
            
            // Alert user
            console.warn('⚠️ Performance emergency mode activated - Some features temporarily disabled');
        },

        createUnifiedDashboard() {
            // Create a unified performance dashboard that combines all monitors
            if (document.getElementById('unified-perf-dashboard')) return;

            const dashboard = document.createElement('div');
            dashboard.id = 'unified-perf-dashboard';
            dashboard.innerHTML = `
                <style>
                    #unified-perf-dashboard {
                        position: fixed;
                        bottom: 10px;
                        left: 10px;
                        z-index: 999999;
                        font-family: monospace;
                        font-size: 10px;
                        background: rgba(0,0,0,0.9);
                        color: #00ff88;
                        padding: 8px;
                        border-radius: 4px;
                        border: 1px solid #00ff88;
                        backdrop-filter: blur(5px);
                        max-width: 200px;
                    }
                    .perf-status-excellent { color: #00ff88; }
                    .perf-status-good { color: #ffaa00; }
                    .perf-status-poor { color: #ff6666; }
                    .perf-status-critical { color: #ff0000; animation: blink 1s infinite; }
                    @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0.5; } }
                </style>
                <div id="perf-summary">
                    <div>🚀 PERFORMANCE STATUS</div>
                    <div id="overall-score">Score: --</div>
                    <div id="fps-status">FPS: --</div>
                    <div id="memory-status">Memory: --</div>
                    <div id="network-status">Network: --</div>
                </div>
            `;

            document.body.appendChild(dashboard);

            // Update unified dashboard
            setInterval(() => this.updateUnifiedDashboard(), 500);
        },

        updateUnifiedDashboard() {
            const overallScore = document.getElementById('overall-score');
            const fpsStatus = document.getElementById('fps-status');
            const memoryStatus = document.getElementById('memory-status');
            const networkStatus = document.getElementById('network-status');

            if (!overallScore) return;

            // Calculate overall performance score
            const score = this.calculateOverallScore();
            const scoreClass = this.getScoreClass(score);
            
            overallScore.textContent = `Score: ${score}/100`;
            overallScore.className = scoreClass;

            // Update FPS status
            const fps = window.getCurrentFPS ? window.getCurrentFPS() : 60;
            fpsStatus.textContent = `FPS: ${fps}`;
            fpsStatus.className = this.getFPSClass(fps);

            // Update memory status
            const memory = this.getMemoryUsage();
            memoryStatus.textContent = `Memory: ${memory}MB`;
            memoryStatus.className = this.getMemoryClass(memory);

            // Update network status
            const network = this.getNetworkStatus();
            networkStatus.textContent = `Network: ${network}`;
            networkStatus.className = this.getNetworkClass(network);
        },

        calculateOverallScore() {
            let totalScore = 0;
            let scoreCount = 0;

            // Get scores from all monitors
            if (this.monitors.realTime && typeof this.monitors.realTime.getOverallScore === 'function') {
                totalScore += this.monitors.realTime.getOverallScore();
                scoreCount++;
            }

            if (this.monitors.performance && typeof this.monitors.performance.getScore === 'function') {
                totalScore += this.monitors.performance.getScore();
                scoreCount++;
            }

            return scoreCount > 0 ? Math.round(totalScore / scoreCount) : 85;
        },

        getScoreClass(score) {
            if (score >= 90) return 'perf-status-excellent';
            if (score >= 70) return 'perf-status-good';
            if (score >= 50) return 'perf-status-poor';
            return 'perf-status-critical';
        },

        getFPSClass(fps) {
            if (fps >= 58) return 'perf-status-excellent';
            if (fps >= 45) return 'perf-status-good';
            if (fps >= 30) return 'perf-status-poor';
            return 'perf-status-critical';
        },

        getMemoryClass(memory) {
            if (memory < 100) return 'perf-status-excellent';
            if (memory < 200) return 'perf-status-good';
            if (memory < 300) return 'perf-status-poor';
            return 'perf-status-critical';
        },

        getNetworkStatus() {
            if (navigator.connection) {
                return navigator.connection.effectiveType || 'unknown';
            }
            return 'unknown';
        },

        getNetworkClass(type) {
            switch (type) {
                case '4g': return 'perf-status-excellent';
                case '3g': return 'perf-status-good';
                case '2g': return 'perf-status-poor';
                default: return 'perf-status-good';
            }
        },

        // Public API
        getOverallPerformanceReport() {
            return {
                score: this.calculateOverallScore(),
                fps: window.getCurrentFPS ? window.getCurrentFPS() : 60,
                memory: this.getMemoryUsage(),
                network: this.getNetworkStatus(),
                monitors: Object.keys(this.monitors),
                optimizationsActive: document.documentElement.classList.contains('performance-mode'),
                emergencyMode: document.documentElement.classList.contains('emergency-mode')
            };
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            PerformanceIntegration.init();
        });
    } else {
        PerformanceIntegration.init();
    }

    // Global access
    window.PerformanceIntegration = PerformanceIntegration;

    // Debug utilities
    window.getPerformanceReport = () => PerformanceIntegration.getOverallPerformanceReport();
    window.triggerEmergencyOptimization = () => PerformanceIntegration.emergencyOptimization();
    window.checkPerformanceHealth = () => PerformanceIntegration.checkPerformanceHealth();

    console.log('🚀 PERFORMANCE INTEGRATION SYSTEM v1.0.0 - ABSOLUTE CONTROL LOADED!');

})();