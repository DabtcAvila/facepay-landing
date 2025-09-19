/**
 * Advanced Mobile Performance System
 * Battery-aware, network-intelligent, adaptive quality system
 */

class AdvancedMobilePerformance {
    constructor() {
        this.performanceLevel = 'auto';
        this.batteryLevel = 1;
        this.isCharging = false;
        this.networkType = 'unknown';
        this.dataUsage = 0;
        this.frameRate = 60;
        
        // Performance metrics
        this.metrics = {
            fps: [],
            memoryUsage: [],
            renderTime: [],
            networkLatency: [],
            batteryDrain: []
        };
        
        // Adaptive settings
        this.settings = {
            animationQuality: 'high',
            imageQuality: 'high',
            scrollSmoothing: 'high',
            particleEffects: true,
            autoplay: true,
            prefetch: true
        };
        
        // Observers
        this.observers = new Map();
        this.monitoringActive = false;
        
        this.init();
    }

    async init() {
        console.log('🚀 Advanced Mobile Performance System initializing...');
        
        await this.detectCapabilities();
        this.setupBatteryMonitoring();
        this.setupNetworkMonitoring();
        this.setupMemoryMonitoring();
        this.setupPerformanceMonitoring();
        this.setupAdaptiveQuality();
        this.setupIntersectionOptimizations();
        this.setupLazyLoading();
        
        this.startMonitoringLoop();
        
        console.log('✨ Advanced Mobile Performance System active');
        this.logSystemStatus();
    }

    async detectCapabilities() {
        // CPU and memory detection
        this.cpuCores = navigator.hardwareConcurrency || 4;
        this.deviceMemory = navigator.deviceMemory || 4;
        this.maxTouchPoints = navigator.maxTouchPoints || 1;
        
        // GPU detection
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        this.webGLSupport = !!gl;
        
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                this.gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_GL);
                this.gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            }
        }
        
        // Platform detection
        this.platform = this.detectPlatform();
        this.browserEngine = this.detectBrowserEngine();
        
        // Calculate performance score
        this.performanceScore = this.calculatePerformanceScore();
        this.performanceLevel = this.determinePerformanceLevel();
        
        canvas.remove();
    }

    detectPlatform() {
        const ua = navigator.userAgent;
        if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
        if (/Android/.test(ua)) return 'android';
        if (/Windows Phone/.test(ua)) return 'windows-phone';
        return 'unknown';
    }

    detectBrowserEngine() {
        const ua = navigator.userAgent;
        if (/WebKit/.test(ua)) {
            if (/Chrome/.test(ua)) return 'blink';
            return 'webkit';
        }
        if (/Gecko/.test(ua)) return 'gecko';
        if (/Trident/.test(ua)) return 'trident';
        return 'unknown';
    }

    calculatePerformanceScore() {
        let score = 100; // Base score
        
        // CPU impact (0-200 points)
        score += Math.min(this.cpuCores * 25, 200);
        
        // Memory impact (0-150 points)
        score += Math.min(this.deviceMemory * 25, 150);
        
        // Platform bonuses
        if (this.platform === 'ios') score += 100; // iOS optimization bonus
        if (this.platform === 'android') score += 75; // Android optimization bonus
        
        // Browser engine bonuses
        if (this.browserEngine === 'webkit') score += 50;
        if (this.browserEngine === 'blink') score += 40;
        
        // GPU bonuses
        if (this.gpuRenderer) {
            if (this.gpuRenderer.includes('Adreno 7')) score += 200;
            else if (this.gpuRenderer.includes('Adreno 6')) score += 150;
            else if (this.gpuRenderer.includes('Adreno 5')) score += 100;
            else if (this.gpuRenderer.includes('Mali-G')) score += 120;
            else if (this.gpuRenderer.includes('Apple A1') || this.gpuRenderer.includes('Apple A2')) score += 250;
            else if (this.gpuRenderer.includes('Apple M')) score += 300;
        }
        
        // Screen size consideration
        const screenArea = window.screen.width * window.screen.height;
        if (screenArea > 2000000) score -= 50; // Large screens require more power
        
        return Math.max(score, 50); // Minimum score
    }

    determinePerformanceLevel() {
        if (this.performanceScore >= 500) return 'ultra';
        if (this.performanceScore >= 350) return 'high';
        if (this.performanceScore >= 200) return 'medium';
        return 'low';
    }

    async setupBatteryMonitoring() {
        if ('getBattery' in navigator) {
            try {
                this.battery = await navigator.getBattery();
                this.batteryLevel = this.battery.level;
                this.isCharging = this.battery.charging;
                
                // Battery event listeners
                this.battery.addEventListener('levelchange', () => {
                    const oldLevel = this.batteryLevel;
                    this.batteryLevel = this.battery.level;
                    this.onBatteryLevelChange(oldLevel, this.batteryLevel);
                });
                
                this.battery.addEventListener('chargingchange', () => {
                    this.isCharging = this.battery.charging;
                    this.onChargingStateChange(this.isCharging);
                });
                
                console.log(`🔋 Battery monitoring active: ${(this.batteryLevel * 100).toFixed(0)}%`);
            } catch (error) {
                console.warn('Battery API not supported:', error);
            }
        }
    }

    setupNetworkMonitoring() {
        if ('connection' in navigator) {
            this.connection = navigator.connection;
            this.networkType = this.connection.effectiveType;
            
            this.connection.addEventListener('change', () => {
                const oldType = this.networkType;
                this.networkType = this.connection.effectiveType;
                this.onNetworkChange(oldType, this.networkType);
            });
            
            console.log(`📡 Network monitoring active: ${this.networkType}`);
        }
    }

    setupMemoryMonitoring() {
        if ('memory' in performance) {
            this.memoryInfo = performance.memory;
            
            // Monitor memory usage every 10 seconds
            setInterval(() => {
                if ('memory' in performance) {
                    const memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
                    this.metrics.memoryUsage.push({
                        timestamp: Date.now(),
                        usage: memoryUsage,
                        usedMB: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                        limitMB: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
                    });
                    
                    // Keep only last 50 measurements
                    if (this.metrics.memoryUsage.length > 50) {
                        this.metrics.memoryUsage.shift();
                    }
                    
                    // Check for memory pressure
                    if (memoryUsage > 0.8) {
                        this.handleMemoryPressure();
                    }
                }
            }, 10000);
        }
    }

    setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        let fpsHistory = [];
        
        const measureFrame = (currentTime) => {
            frameCount++;
            const deltaTime = currentTime - lastTime;
            
            if (deltaTime > 0) {
                const currentFps = 1000 / deltaTime;
                fpsHistory.push(currentFps);
                
                // Keep last 60 frames for average
                if (fpsHistory.length > 60) {
                    fpsHistory.shift();
                }
                
                // Update FPS metric every 60 frames
                if (frameCount % 60 === 0) {
                    const averageFps = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
                    this.frameRate = averageFps;
                    
                    this.metrics.fps.push({
                        timestamp: Date.now(),
                        fps: averageFps,
                        minFps: Math.min(...fpsHistory),
                        maxFps: Math.max(...fpsHistory)
                    });
                    
                    // Auto-adjust performance based on FPS
                    this.adaptPerformanceBasedOnFPS(averageFps);
                }
                
                // Detect jank frames
                if (deltaTime > 20) { // Frame took longer than 20ms
                    this.handleJankFrame(deltaTime);
                }
            }
            
            lastTime = currentTime;
            requestAnimationFrame(measureFrame);
        };
        
        requestAnimationFrame(measureFrame);
    }

    setupAdaptiveQuality() {
        this.updateQualitySettings();
        
        // Create CSS for different quality levels
        const style = document.createElement('style');
        style.id = 'adaptive-quality-styles';
        style.textContent = this.generateQualityCSS();
        document.head.appendChild(style);
        
        // Apply initial quality class
        document.body.classList.add(`performance-${this.performanceLevel}`);
    }

    generateQualityCSS() {
        return `
            /* Ultra Performance Mode */
            .performance-ultra {
                --animation-duration: 0.4s;
                --transition-duration: 0.3s;
                --blur-strength: 20px;
                --shadow-quality: var(--shadow-xl);
            }
            
            .performance-ultra .animate-particles {
                animation-play-state: running;
            }
            
            /* High Performance Mode */
            .performance-high {
                --animation-duration: 0.3s;
                --transition-duration: 0.2s;
                --blur-strength: 15px;
                --shadow-quality: var(--shadow-lg);
            }
            
            /* Medium Performance Mode */
            .performance-medium {
                --animation-duration: 0.2s;
                --transition-duration: 0.15s;
                --blur-strength: 10px;
                --shadow-quality: var(--shadow-md);
            }
            
            .performance-medium .animate-particles {
                animation-play-state: paused;
            }
            
            /* Low Performance Mode */
            .performance-low {
                --animation-duration: 0.1s;
                --transition-duration: 0.1s;
                --blur-strength: 5px;
                --shadow-quality: var(--shadow-sm);
            }
            
            .performance-low .animate-particles,
            .performance-low .ripple-effect,
            .performance-low .parallax-bg {
                display: none !important;
            }
            
            .performance-low * {
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                box-shadow: none !important;
            }
            
            /* Battery Saving Mode */
            .battery-critical {
                --animation-duration: 0.05s;
                --transition-duration: 0.05s;
            }
            
            .battery-critical *,
            .battery-critical *::before,
            .battery-critical *::after {
                animation: none !important;
                transition: none !important;
                transform: none !important;
            }
            
            /* Network-aware styles */
            .network-2g .lazy-load-images img {
                filter: blur(2px);
                transition: filter 0.3s ease;
            }
            
            .network-2g .lazy-load-images img.loaded {
                filter: none;
            }
            
            /* Memory pressure styles */
            .memory-pressure .complex-animations {
                display: none !important;
            }
        `;
    }

    setupIntersectionOptimizations() {
        // Efficient intersection observer for animations
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startElementAnimation(entry.target);
                } else if (this.settings.animationQuality === 'low') {
                    this.pauseElementAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observe all animatable elements
        document.querySelectorAll('.animate-on-scroll, .fade-in, .slide-in').forEach(el => {
            this.animationObserver.observe(el);
        });
    }

    setupLazyLoading() {
        // Advanced lazy loading with performance considerations
        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: this.getOptimalLoadDistance()
        });
        
        // Observe all lazy images
        document.querySelectorAll('img[data-src], video[data-src]').forEach(el => {
            this.imageObserver.observe(el);
        });
    }

    getOptimalLoadDistance() {
        // Adjust loading distance based on network speed
        switch (this.networkType) {
            case '4g': return '200px';
            case '3g': return '100px';
            case '2g': return '50px';
            default: return '150px';
        }
    }

    startMonitoringLoop() {
        this.monitoringActive = true;
        
        // Main monitoring loop (every 5 seconds)
        const monitoringInterval = setInterval(() => {
            if (!this.monitoringActive) {
                clearInterval(monitoringInterval);
                return;
            }
            
            this.performanceCheck();
            this.adaptToConditions();
            this.cleanupMemory();
        }, 5000);
    }

    performanceCheck() {
        // Check system performance indicators
        const now = Date.now();
        const recentFps = this.metrics.fps.filter(f => now - f.timestamp < 10000);
        
        if (recentFps.length > 0) {
            const avgFps = recentFps.reduce((sum, f) => sum + f.fps, 0) / recentFps.length;
            
            // Adapt quality based on sustained FPS
            if (avgFps < 30 && this.performanceLevel !== 'low') {
                this.downgradePerformance();
            } else if (avgFps > 55 && this.performanceLevel !== 'ultra') {
                this.upgradePerformance();
            }
        }
    }

    adaptToConditions() {
        // Battery-aware adaptations
        if (this.batteryLevel < 0.15 && !this.isCharging) {
            this.enableBatterySavingMode();
        } else if (this.batteryLevel > 0.5 || this.isCharging) {
            this.disableBatterySavingMode();
        }
        
        // Network-aware adaptations
        if (this.networkType === '2g' || this.networkType === 'slow-2g') {
            this.enableDataSavingMode();
        } else {
            this.disableDataSavingMode();
        }
        
        // Memory-aware adaptations
        if (this.isMemoryPressureHigh()) {
            this.enableMemorySavingMode();
        }
    }

    onBatteryLevelChange(oldLevel, newLevel) {
        console.log(`🔋 Battery level changed: ${(oldLevel * 100).toFixed(0)}% → ${(newLevel * 100).toFixed(0)}%`);
        
        // Significant battery drop
        if (oldLevel - newLevel > 0.05) {
            this.adjustForBatteryDrop();
        }
    }

    onChargingStateChange(isCharging) {
        console.log(`🔌 Charging state changed: ${isCharging ? 'charging' : 'not charging'}`);
        
        if (isCharging) {
            this.onChargingStarted();
        } else {
            this.onChargingEnded();
        }
    }

    onNetworkChange(oldType, newType) {
        console.log(`📡 Network type changed: ${oldType} → ${newType}`);
        this.adaptNetworkSettings(newType);
    }

    adaptPerformanceBasedOnFPS(fps) {
        if (fps < 25) {
            document.body.classList.add('fps-critical');
            this.settings.animationQuality = 'low';
        } else if (fps < 45) {
            document.body.classList.remove('fps-critical');
            document.body.classList.add('fps-low');
            this.settings.animationQuality = 'medium';
        } else if (fps > 55) {
            document.body.classList.remove('fps-critical', 'fps-low');
            this.settings.animationQuality = 'high';
        }
        
        this.updateQualitySettings();
    }

    handleJankFrame(deltaTime) {
        console.warn(`⚠️ Jank frame detected: ${deltaTime.toFixed(1)}ms`);
        
        // Temporarily reduce quality on severe jank
        if (deltaTime > 50) {
            document.body.classList.add('jank-recovery');
            setTimeout(() => {
                document.body.classList.remove('jank-recovery');
            }, 2000);
        }
    }

    handleMemoryPressure() {
        console.warn('⚠️ Memory pressure detected');
        document.body.classList.add('memory-pressure');
        
        // Cleanup unused elements
        this.cleanupUnusedElements();
        
        // Disable memory-intensive features temporarily
        setTimeout(() => {
            if (!this.isMemoryPressureHigh()) {
                document.body.classList.remove('memory-pressure');
            }
        }, 10000);
    }

    cleanupUnusedElements() {
        // Remove off-screen particles
        document.querySelectorAll('.particle').forEach(particle => {
            const rect = particle.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight + 100) {
                particle.remove();
            }
        });
        
        // Clean up old animation elements
        document.querySelectorAll('.animation-cleanup').forEach(el => {
            if (Date.now() - parseInt(el.dataset.created) > 30000) {
                el.remove();
            }
        });
    }

    isMemoryPressureHigh() {
        if (this.metrics.memoryUsage.length === 0) return false;
        
        const latest = this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1];
        return latest.usage > 0.8;
    }

    enableBatterySavingMode() {
        if (document.body.classList.contains('battery-saving')) return;
        
        console.log('🔋 Battery saving mode enabled');
        document.body.classList.add('battery-saving');
        this.settings.animationQuality = 'low';
        this.settings.particleEffects = false;
        this.settings.autoplay = false;
        this.updateQualitySettings();
    }

    disableBatterySavingMode() {
        if (!document.body.classList.contains('battery-saving')) return;
        
        console.log('🔋 Battery saving mode disabled');
        document.body.classList.remove('battery-saving');
        this.restoreNormalSettings();
    }

    enableDataSavingMode() {
        console.log('📡 Data saving mode enabled');
        document.body.classList.add('data-saving');
        this.settings.prefetch = false;
        this.settings.imageQuality = 'low';
        
        // Pause auto-playing videos
        document.querySelectorAll('video[autoplay]').forEach(video => {
            video.pause();
            video.removeAttribute('autoplay');
        });
    }

    disableDataSavingMode() {
        console.log('📡 Data saving mode disabled');
        document.body.classList.remove('data-saving');
        this.settings.prefetch = true;
        this.settings.imageQuality = 'high';
    }

    enableMemorySavingMode() {
        console.log('💾 Memory saving mode enabled');
        document.body.classList.add('memory-saving');
        
        // Limit concurrent animations
        this.limitConcurrentAnimations();
        
        // Clean up immediately
        this.cleanupMemory();
    }

    limitConcurrentAnimations() {
        const animations = document.querySelectorAll('.animate-pulse, .animate-bounce');
        animations.forEach((el, index) => {
            if (index > 5) { // Limit to 5 concurrent animations
                el.style.animationPlayState = 'paused';
            }
        });
    }

    onChargingStarted() {
        // Re-enable features when charging
        this.restoreNormalSettings();
    }

    onChargingEnded() {
        // Be more conservative when on battery
        if (this.batteryLevel < 0.5) {
            this.adjustForBatteryDrop();
        }
    }

    adjustForBatteryDrop() {
        // Reduce performance when battery drops significantly
        this.settings.animationQuality = 'medium';
        this.settings.scrollSmoothing = 'medium';
        this.updateQualitySettings();
    }

    adaptNetworkSettings(networkType) {
        const networkClass = `network-${networkType}`;
        
        // Remove old network classes
        document.body.classList.forEach(className => {
            if (className.startsWith('network-')) {
                document.body.classList.remove(className);
            }
        });
        
        // Add new network class
        document.body.classList.add(networkClass);
        
        // Adjust loading behavior
        switch (networkType) {
            case 'slow-2g':
            case '2g':
                this.settings.prefetch = false;
                this.settings.imageQuality = 'low';
                break;
            case '3g':
                this.settings.prefetch = true;
                this.settings.imageQuality = 'medium';
                break;
            case '4g':
            default:
                this.settings.prefetch = true;
                this.settings.imageQuality = 'high';
                break;
        }
    }

    downgradePerformance() {
        const levels = ['ultra', 'high', 'medium', 'low'];
        const currentIndex = levels.indexOf(this.performanceLevel);
        
        if (currentIndex < levels.length - 1) {
            this.performanceLevel = levels[currentIndex + 1];
            this.applyPerformanceLevel();
            console.log(`📉 Performance downgraded to: ${this.performanceLevel}`);
        }
    }

    upgradePerformance() {
        const levels = ['low', 'medium', 'high', 'ultra'];
        const currentIndex = levels.indexOf(this.performanceLevel);
        
        if (currentIndex < levels.length - 1 && this.canUpgradePerformance()) {
            this.performanceLevel = levels[currentIndex + 1];
            this.applyPerformanceLevel();
            console.log(`📈 Performance upgraded to: ${this.performanceLevel}`);
        }
    }

    canUpgradePerformance() {
        // Don't upgrade if battery is low or network is slow
        if (this.batteryLevel < 0.3 && !this.isCharging) return false;
        if (['slow-2g', '2g'].includes(this.networkType)) return false;
        if (this.isMemoryPressureHigh()) return false;
        
        return true;
    }

    applyPerformanceLevel() {
        // Remove old performance classes
        document.body.classList.forEach(className => {
            if (className.startsWith('performance-')) {
                document.body.classList.remove(className);
            }
        });
        
        // Add new performance class
        document.body.classList.add(`performance-${this.performanceLevel}`);
        
        this.updateQualitySettings();
    }

    updateQualitySettings() {
        // Update CSS custom properties based on current settings
        const root = document.documentElement;
        
        switch (this.settings.animationQuality) {
            case 'high':
                root.style.setProperty('--animation-duration', '0.4s');
                root.style.setProperty('--transition-duration', '0.3s');
                break;
            case 'medium':
                root.style.setProperty('--animation-duration', '0.2s');
                root.style.setProperty('--transition-duration', '0.15s');
                break;
            case 'low':
                root.style.setProperty('--animation-duration', '0.1s');
                root.style.setProperty('--transition-duration', '0.1s');
                break;
        }
        
        // Dispatch settings change event
        document.dispatchEvent(new CustomEvent('performanceSettingsChanged', {
            detail: this.settings
        }));
    }

    restoreNormalSettings() {
        this.settings = {
            animationQuality: this.performanceLevel === 'low' ? 'medium' : 'high',
            imageQuality: 'high',
            scrollSmoothing: 'high',
            particleEffects: this.performanceLevel !== 'low',
            autoplay: true,
            prefetch: true
        };
        this.updateQualitySettings();
    }

    startElementAnimation(element) {
        if (element.dataset.animated === 'true') return;
        
        element.dataset.animated = 'true';
        element.classList.add('animate-in');
        
        // Stagger animations to prevent frame drops
        const delay = Math.random() * 200;
        setTimeout(() => {
            element.style.animationPlayState = 'running';
        }, delay);
    }

    pauseElementAnimation(element) {
        element.style.animationPlayState = 'paused';
    }

    loadImage(element) {
        if (element.dataset.loaded === 'true') return;
        
        const src = element.dataset.src;
        if (!src) return;
        
        // Create image with appropriate quality
        const img = new Image();
        img.onload = () => {
            element.src = src;
            element.dataset.loaded = 'true';
            element.classList.add('loaded');
            
            // Remove lazy loading attributes
            delete element.dataset.src;
        };
        
        // Load with quality adjustment for slow networks
        if (this.networkType === '2g' && element.dataset.srcLowQuality) {
            img.src = element.dataset.srcLowQuality;
        } else {
            img.src = src;
        }
    }

    cleanupMemory() {
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
        
        // Clean up old metrics
        const now = Date.now();
        const maxAge = 300000; // 5 minutes
        
        Object.keys(this.metrics).forEach(key => {
            this.metrics[key] = this.metrics[key].filter(item => 
                now - item.timestamp < maxAge
            );
        });
    }

    logSystemStatus() {
        console.log('📊 System Status:');
        console.log(`  Performance Level: ${this.performanceLevel}`);
        console.log(`  Performance Score: ${this.performanceScore}`);
        console.log(`  Platform: ${this.platform}`);
        console.log(`  CPU Cores: ${this.cpuCores}`);
        console.log(`  Device Memory: ${this.deviceMemory}GB`);
        console.log(`  GPU: ${this.gpuRenderer || 'Unknown'}`);
        console.log(`  Battery: ${(this.batteryLevel * 100).toFixed(0)}% (${this.isCharging ? 'charging' : 'battery'})`);
        console.log(`  Network: ${this.networkType}`);
        console.log(`  Current FPS: ${this.frameRate.toFixed(1)}`);
    }

    // Public API
    getCurrentSettings() {
        return { ...this.settings };
    }

    getPerformanceMetrics() {
        return {
            performanceLevel: this.performanceLevel,
            performanceScore: this.performanceScore,
            frameRate: this.frameRate,
            batteryLevel: this.batteryLevel,
            networkType: this.networkType,
            memoryUsage: this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1]?.usage || 0
        };
    }

    forcePerformanceLevel(level) {
        if (['low', 'medium', 'high', 'ultra'].includes(level)) {
            this.performanceLevel = level;
            this.applyPerformanceLevel();
            console.log(`🔧 Performance level forced to: ${level}`);
        }
    }

    destroy() {
        this.monitoringActive = false;
        
        // Disconnect observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        if (this.animationObserver) this.animationObserver.disconnect();
        if (this.imageObserver) this.imageObserver.disconnect();
        
        // Clean up styles
        const styleElement = document.getElementById('adaptive-quality-styles');
        if (styleElement) styleElement.remove();
        
        console.log('🧹 Advanced Mobile Performance System destroyed');
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.advancedMobilePerformance = new AdvancedMobilePerformance();
    });
} else {
    window.advancedMobilePerformance = new AdvancedMobilePerformance();
}

window.AdvancedMobilePerformance = AdvancedMobilePerformance;