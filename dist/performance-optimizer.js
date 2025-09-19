/**
 * FACEPAY PERFORMANCE OPTIMIZER
 * Advanced performance monitoring and optimization for smooth scrolling
 * 60fps guarantee with adaptive quality
 */

class FacePayPerformanceOptimizer {
    constructor() {
        this.fps = 60;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.adaptiveQuality = true;
        this.performanceStats = {
            averageFPS: 60,
            minFPS: 60,
            maxFPS: 60,
            jankFrames: 0,
            totalFrames: 0
        };
        this.optimizations = new Map();
        this.deviceCapabilities = this.detectDeviceCapabilities();
        
        this.init();
    }

    init() {
        this.setupPerformanceMonitoring();
        this.optimizeBasedOnDevice();
        this.setupAdaptiveQuality();
        this.monitorWebVitals();
        this.setupErrorHandling();
        
        console.log('⚡ FacePay Performance Optimizer initialized');
        console.log('📊 Device capabilities:', this.deviceCapabilities);
    }

    detectDeviceCapabilities() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        return {
            // GPU capabilities
            webGL: !!gl,
            webGL2: !!(canvas.getContext('webgl2')),
            
            // Device info
            devicePixelRatio: window.devicePixelRatio || 1,
            cores: navigator.hardwareConcurrency || 4,
            memory: navigator.deviceMemory || 4,
            
            // Device type detection
            mobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            tablet: /iPad|Android(?!.*Mobile)|Kindle/i.test(navigator.userAgent),
            
            // Connection info
            connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection,
            
            // User preferences
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
            
            // Browser capabilities
            intersectionObserver: 'IntersectionObserver' in window,
            resizeObserver: 'ResizeObserver' in window,
            passiveListeners: this.supportsPassiveListeners(),
            
            // Viewport info
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            orientation: screen.orientation?.angle || 0
        };
    }

    supportsPassiveListeners() {
        let supportsPassive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassive = true;
                }
            });
            window.addEventListener('testPassive', null, opts);
            window.removeEventListener('testPassive', null, opts);
        } catch (e) {}
        return supportsPassive;
    }

    setupPerformanceMonitoring() {
        let lastFrameTime = performance.now();
        
        const monitorFrame = (currentTime) => {
            // Calculate FPS
            this.frameCount++;
            const deltaTime = currentTime - lastFrameTime;
            const instantFPS = 1000 / deltaTime;
            
            // Track jank (frames > 16.67ms)
            if (deltaTime > 16.67) {
                this.performanceStats.jankFrames++;
            }
            
            // Update stats every second
            if (currentTime - this.lastTime >= 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                
                this.performanceStats.averageFPS = this.fps;
                this.performanceStats.minFPS = Math.min(this.performanceStats.minFPS, this.fps);
                this.performanceStats.maxFPS = Math.max(this.performanceStats.maxFPS, this.fps);
                this.performanceStats.totalFrames += this.frameCount;
                
                this.frameCount = 0;
                this.lastTime = currentTime;
                
                // Adaptive quality adjustment
                if (this.adaptiveQuality) {
                    this.adjustQualityBasedOnPerformance();
                }
                
                // Log performance warnings
                if (this.fps < 30) {
                    console.warn(`⚠️ Low FPS detected: ${this.fps}fps`);
                } else if (this.fps < 45) {
                    console.log(`📊 Moderate FPS: ${this.fps}fps`);
                }
            }
            
            lastFrameTime = currentTime;
            requestAnimationFrame(monitorFrame);
        };
        
        requestAnimationFrame(monitorFrame);
    }

    optimizeBasedOnDevice() {
        const optimizations = {
            // High-end devices
            highEnd: {
                particleCount: 500,
                parallaxLayers: 5,
                complexAnimations: true,
                highQualityBlur: true,
                smoothScrollLerp: 0.08,
                enableAllEffects: true
            },
            
            // Mid-range devices
            midRange: {
                particleCount: 200,
                parallaxLayers: 3,
                complexAnimations: true,
                highQualityBlur: false,
                smoothScrollLerp: 0.12,
                enableAllEffects: true
            },
            
            // Low-end devices
            lowEnd: {
                particleCount: 50,
                parallaxLayers: 2,
                complexAnimations: false,
                highQualityBlur: false,
                smoothScrollLerp: 0.16,
                enableAllEffects: false
            },
            
            // Mobile optimizations
            mobile: {
                particleCount: 100,
                parallaxLayers: 2,
                complexAnimations: false,
                highQualityBlur: false,
                smoothScrollLerp: 0.15,
                enableAllEffects: false,
                disableHoverEffects: true
            }
        };

        let deviceTier = 'highEnd';
        
        // Determine device tier
        if (this.deviceCapabilities.mobile) {
            deviceTier = 'mobile';
        } else if (this.deviceCapabilities.cores < 4 || this.deviceCapabilities.memory < 4) {
            deviceTier = 'lowEnd';
        } else if (this.deviceCapabilities.cores < 8 || this.deviceCapabilities.memory < 8) {
            deviceTier = 'midRange';
        }

        // Apply optimizations
        const settings = optimizations[deviceTier];
        this.optimizations = new Map(Object.entries(settings));
        
        // Apply CSS custom properties for dynamic optimization
        Object.entries(settings).forEach(([key, value]) => {
            if (typeof value === 'number') {
                document.documentElement.style.setProperty(`--${key}`, value.toString());
            } else if (typeof value === 'boolean') {
                document.documentElement.classList.toggle(`enable-${key}`, value);
            }
        });

        console.log(`🎯 Optimized for ${deviceTier} device tier`);
    }

    adjustQualityBasedOnPerformance() {
        if (this.fps < 30) {
            // Aggressive optimization for very poor performance
            this.reduceQuality('aggressive');
        } else if (this.fps < 45) {
            // Moderate optimization for poor performance
            this.reduceQuality('moderate');
        } else if (this.fps > 55 && this.performanceStats.jankFrames / this.performanceStats.totalFrames < 0.05) {
            // Increase quality for good performance
            this.increaseQuality();
        }
    }

    reduceQuality(level = 'moderate') {
        const reductions = {
            moderate: {
                'particle-density': 0.7,
                'animation-complexity': 0.8,
                'blur-quality': 0.6
            },
            aggressive: {
                'particle-density': 0.3,
                'animation-complexity': 0.5,
                'blur-quality': 0.3
            }
        };

        const settings = reductions[level];
        Object.entries(settings).forEach(([property, value]) => {
            document.documentElement.style.setProperty(`--${property}`, value.toString());
        });

        // Disable complex animations
        if (level === 'aggressive') {
            document.documentElement.classList.add('disable-complex-animations');
            
            // Reduce GSAP timescale
            if (typeof gsap !== 'undefined') {
                gsap.globalTimeline.timeScale(1.5); // Speed up animations
            }
        }

        console.log(`📉 Reduced quality: ${level}`);
    }

    increaseQuality() {
        // Only increase if we have headroom
        if (this.fps > 55) {
            document.documentElement.style.setProperty('--particle-density', '1');
            document.documentElement.style.setProperty('--animation-complexity', '1');
            document.documentElement.style.setProperty('--blur-quality', '1');
            
            document.documentElement.classList.remove('disable-complex-animations');
            
            if (typeof gsap !== 'undefined') {
                gsap.globalTimeline.timeScale(1);
            }
            
            console.log('📈 Increased quality');
        }
    }

    setupAdaptiveQuality() {
        // Monitor page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause expensive operations when tab is hidden
                this.pauseAnimations();
            } else {
                // Resume when tab becomes visible
                this.resumeAnimations();
            }
        });

        // Monitor battery status
        if ('getBattery' in navigator) {
            navigator.getBattery().then((battery) => {
                const updateBatteryOptimization = () => {
                    if (battery.level < 0.2 || battery.charging === false) {
                        // Aggressive power saving
                        this.enablePowerSaveMode();
                    } else {
                        this.disablePowerSaveMode();
                    }
                };

                battery.addEventListener('levelchange', updateBatteryOptimization);
                battery.addEventListener('chargingchange', updateBatteryOptimization);
                
                updateBatteryOptimization();
            });
        }

        // Monitor thermal throttling (experimental)
        if ('deviceMemory' in navigator && navigator.deviceMemory < 4) {
            // Likely a device that might thermal throttle
            this.enableThermalProtection();
        }
    }

    monitorWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            const lcp = lastEntry.startTime;
            
            if (lcp > 4000) {
                console.warn('⚠️ Poor LCP:', lcp + 'ms');
                this.optimizeForLCP();
            } else if (lcp < 2500) {
                console.log('✅ Good LCP:', lcp + 'ms');
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                const fid = entry.processingStart - entry.startTime;
                
                if (fid > 300) {
                    console.warn('⚠️ Poor FID:', fid + 'ms');
                    this.optimizeForFID();
                } else if (fid < 100) {
                    console.log('✅ Good FID:', fid + 'ms');
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
            
            if (clsValue > 0.25) {
                console.warn('⚠️ Poor CLS:', clsValue);
                this.optimizeForCLS();
            } else if (clsValue < 0.1) {
                console.log('✅ Good CLS:', clsValue);
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }

    optimizeForLCP() {
        // Preload critical resources
        const criticalImages = document.querySelectorAll('img[loading="lazy"]');
        criticalImages.forEach(img => {
            if (img.getBoundingClientRect().top < window.innerHeight) {
                img.loading = 'eager';
            }
        });
        
        // Optimize fonts
        document.fonts.ready.then(() => {
            console.log('📝 Fonts loaded');
        });
    }

    optimizeForFID() {
        // Defer non-critical JavaScript
        const nonCriticalScripts = ['analytics', 'tracking', 'social'];
        
        nonCriticalScripts.forEach(scriptType => {
            const scripts = document.querySelectorAll(`script[data-type="${scriptType}"]`);
            scripts.forEach(script => {
                setTimeout(() => {
                    const newScript = document.createElement('script');
                    newScript.src = script.src;
                    newScript.defer = true;
                    document.head.appendChild(newScript);
                }, 2000);
            });
        });
    }

    optimizeForCLS() {
        // Add aspect ratios to prevent layout shift
        const images = document.querySelectorAll('img:not([width]):not([height])');
        images.forEach(img => {
            img.addEventListener('load', () => {
                const aspectRatio = img.naturalHeight / img.naturalWidth;
                img.style.aspectRatio = `1 / ${aspectRatio}`;
            });
        });
    }

    pauseAnimations() {
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.pause();
        }
        
        document.documentElement.classList.add('animations-paused');
        console.log('⏸️ Animations paused');
    }

    resumeAnimations() {
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.resume();
        }
        
        document.documentElement.classList.remove('animations-paused');
        console.log('▶️ Animations resumed');
    }

    enablePowerSaveMode() {
        document.documentElement.classList.add('power-save-mode');
        this.reduceQuality('aggressive');
        
        // Reduce animation frame rate
        if (typeof gsap !== 'undefined') {
            gsap.ticker.fps(30);
        }
        
        console.log('🔋 Power save mode enabled');
    }

    disablePowerSaveMode() {
        document.documentElement.classList.remove('power-save-mode');
        
        // Restore animation frame rate
        if (typeof gsap !== 'undefined') {
            gsap.ticker.fps(60);
        }
        
        console.log('🔋 Power save mode disabled');
    }

    enableThermalProtection() {
        // Monitor for performance degradation that might indicate thermal throttling
        let performanceDegradation = 0;
        
        setInterval(() => {
            if (this.fps < 30 && this.performanceStats.averageFPS > 45) {
                performanceDegradation++;
                
                if (performanceDegradation > 3) {
                    console.warn('🌡️ Possible thermal throttling detected');
                    this.reduceQuality('aggressive');
                    performanceDegradation = 0;
                }
            } else {
                performanceDegradation = Math.max(0, performanceDegradation - 1);
            }
        }, 5000);
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Performance critical error:', event.error);
            
            // Fallback to simpler rendering
            if (event.error.message.includes('WebGL') || event.error.message.includes('Canvas')) {
                document.documentElement.classList.add('disable-webgl');
                this.fallbackToCSS();
            }
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        });
    }

    fallbackToCSS() {
        // Disable complex animations that might cause issues
        document.documentElement.classList.add('css-fallback-mode');
        
        // Remove WebGL dependencies
        const webglElements = document.querySelectorAll('.webgl-element');
        webglElements.forEach(element => {
            element.style.display = 'none';
        });
        
        console.log('🛡️ Fallback to CSS mode');
    }

    // Public API
    getPerformanceStats() {
        return {
            ...this.performanceStats,
            currentFPS: this.fps,
            jankPercentage: (this.performanceStats.jankFrames / this.performanceStats.totalFrames) * 100,
            deviceTier: this.getDeviceTier()
        };
    }

    getDeviceTier() {
        if (this.deviceCapabilities.mobile) return 'mobile';
        if (this.deviceCapabilities.cores < 4) return 'low-end';
        if (this.deviceCapabilities.cores < 8) return 'mid-range';
        return 'high-end';
    }

    forceQualityLevel(level) {
        this.adaptiveQuality = false;
        
        switch (level) {
            case 'low':
                this.reduceQuality('aggressive');
                break;
            case 'medium':
                this.reduceQuality('moderate');
                break;
            case 'high':
                this.increaseQuality();
                break;
            case 'auto':
                this.adaptiveQuality = true;
                break;
        }
        
        console.log(`🎛️ Quality level set to: ${level}`);
    }

    // Debug and testing utilities
    simulateLowPerformance() {
        // Artificially reduce performance for testing
        const blockingLoop = () => {
            const start = performance.now();
            while (performance.now() - start < 50) {
                // Blocking operation
            }
            setTimeout(blockingLoop, 100);
        };
        
        blockingLoop();
        console.log('🐌 Simulating low performance');
    }

    generatePerformanceReport() {
        const report = {
            timestamp: new Date().toISOString(),
            deviceCapabilities: this.deviceCapabilities,
            performanceStats: this.getPerformanceStats(),
            appliedOptimizations: Object.fromEntries(this.optimizations),
            recommendations: this.generateRecommendations()
        };
        
        console.log('📊 Performance Report:', report);
        return report;
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.fps < 30) {
            recommendations.push('Consider reducing particle count and animation complexity');
        }
        
        if (this.performanceStats.jankFrames / this.performanceStats.totalFrames > 0.1) {
            recommendations.push('High jank detected - consider optimizing heavy animations');
        }
        
        if (!this.deviceCapabilities.webGL) {
            recommendations.push('WebGL not supported - falling back to CSS animations');
        }
        
        if (this.deviceCapabilities.mobile) {
            recommendations.push('Mobile device detected - consider touch-optimized interactions');
        }
        
        return recommendations;
    }
}

// Auto-initialize performance optimizer
let performanceOptimizer;

document.addEventListener('DOMContentLoaded', () => {
    performanceOptimizer = new FacePayPerformanceOptimizer();
    
    // Expose to global scope for debugging
    window.facePayPerformance = performanceOptimizer;
    
    // Add performance info to console
    setTimeout(() => {
        performanceOptimizer.generatePerformanceReport();
    }, 5000);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FacePayPerformanceOptimizer;
}