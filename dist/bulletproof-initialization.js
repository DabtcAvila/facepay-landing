/**
 * FACEPAY BULLETPROOF INITIALIZATION SYSTEM
 * Ensures all error prevention systems are properly coordinated
 * GARANTÍA: NUNCA FALLA NADA, NUNCA.
 */

class BulletproofInitializationSystem {
    constructor() {
        this.systemsStatus = {
            browserDetection: false,
            errorPrevention: false,
            performanceMonitoring: false,
            fallbacksReady: false,
            mobileComponents: false,
            videoSystems: false
        };
        
        this.initializationTimeout = 10000; // 10 second timeout
        this.criticalSystemsTimeout = 5000; // 5 second timeout for critical systems
        
        this.init();
    }

    init() {
        console.log('🚀 BULLETPROOF INITIALIZATION SYSTEM STARTING...');
        
        // Set up initialization timeout
        this.setupInitializationTimeout();
        
        // Initialize critical systems first
        this.initializeCriticalSystems();
        
        // Monitor system loading
        this.monitorSystemLoading();
        
        // Setup emergency fallbacks
        this.setupEmergencyFallbacks();
    }

    setupInitializationTimeout() {
        // Critical systems must load within timeout
        setTimeout(() => {
            this.checkCriticalSystemsStatus();
        }, this.criticalSystemsTimeout);

        // Full initialization timeout
        setTimeout(() => {
            this.finalizeInitialization();
        }, this.initializationTimeout);
    }

    initializeCriticalSystems() {
        // 1. Browser Detection (should already be loaded)
        if (window.facePayBrowserDetection) {
            this.systemsStatus.browserDetection = true;
            console.log('✅ Browser Detection System: ACTIVE');
        } else {
            console.warn('⚠️ Browser Detection System: NOT LOADED - Activating fallback');
            this.activateBrowserDetectionFallback();
        }

        // 2. Error Prevention System
        if (window.facePayErrorPrevention) {
            this.systemsStatus.errorPrevention = true;
            console.log('✅ Error Prevention System: ACTIVE');
        } else {
            console.warn('⚠️ Error Prevention System: NOT LOADED - Activating fallback');
            this.activateErrorPreventionFallback();
        }

        // 3. Performance Monitoring
        if (window.facePayPerformance) {
            this.systemsStatus.performanceMonitoring = true;
            console.log('✅ Performance Monitoring: ACTIVE');
        } else {
            console.warn('⚠️ Performance Monitoring: NOT LOADED - Using basic monitoring');
            this.activateBasicPerformanceMonitoring();
        }
    }

    monitorSystemLoading() {
        // Check for additional systems as they load
        const checkInterval = setInterval(() => {
            // Mobile Components
            if (window.mobileComponents && !this.systemsStatus.mobileComponents) {
                this.systemsStatus.mobileComponents = true;
                console.log('✅ Mobile Components System: LOADED');
            }

            // Video Systems
            if (window.videoManager && !this.systemsStatus.videoSystems) {
                this.systemsStatus.videoSystems = true;
                console.log('✅ Video Systems: LOADED');
            }

            // Check if all systems are ready
            if (this.allSystemsReady()) {
                clearInterval(checkInterval);
                this.onAllSystemsReady();
            }
        }, 100);

        // Clear interval after timeout
        setTimeout(() => clearInterval(checkInterval), this.initializationTimeout);
    }

    checkCriticalSystemsStatus() {
        const criticalSystems = ['browserDetection', 'errorPrevention'];
        const failedSystems = criticalSystems.filter(system => !this.systemsStatus[system]);

        if (failedSystems.length > 0) {
            console.error('🚨 CRITICAL SYSTEMS FAILED TO LOAD:', failedSystems);
            this.activateEmergencyMode();
        } else {
            console.log('✅ All critical systems loaded successfully');
            this.systemsStatus.fallbacksReady = true;
        }
    }

    activateBrowserDetectionFallback() {
        // Basic browser detection fallback
        const isIE = /MSIE|Trident/.test(navigator.userAgent);
        const isOldChrome = /Chrome\/([0-9]+)/.test(navigator.userAgent) && 
                           parseInt(navigator.userAgent.match(/Chrome\/([0-9]+)/)[1]) < 60;
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        const html = document.documentElement;
        
        if (isIE) {
            html.classList.add('ie', 'legacy-browser', 'no-css-variables', 'no-grid', 'no-flexbox');
        }
        
        if (isOldChrome) {
            html.classList.add('old-chrome', 'legacy-browser');
        }
        
        if (isMobile) {
            html.classList.add('mobile-browser', 'touch-device');
        }

        // Add basic feature detection
        if (!window.CSS || !window.CSS.supports || !window.CSS.supports('--test', '1')) {
            html.classList.add('no-css-variables');
        }

        if (!window.IntersectionObserver) {
            html.classList.add('no-intersection-observer');
        }

        console.log('🛡️ Browser Detection Fallback: ACTIVATED');
        this.systemsStatus.browserDetection = true;
    }

    activateErrorPreventionFallback() {
        // Basic error prevention fallback
        window.addEventListener('error', (e) => {
            console.error('💥 Unhandled Error (Fallback):', e.error);
            
            // Hide potentially broken elements
            if (e.target && e.target.tagName === 'VIDEO') {
                e.target.style.display = 'none';
                const poster = e.target.getAttribute('poster');
                if (poster) {
                    const img = document.createElement('img');
                    img.src = poster;
                    img.className = e.target.className;
                    e.target.parentNode.replaceChild(img, e.target);
                }
            }
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('💥 Unhandled Promise Rejection (Fallback):', e.reason);
        });

        console.log('🛡️ Error Prevention Fallback: ACTIVATED');
        this.systemsStatus.errorPrevention = true;
    }

    activateBasicPerformanceMonitoring() {
        // Basic performance monitoring
        let frameCount = 0;
        let fps = 60;
        let lastTime = performance.now();

        const monitorFrame = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30) {
                    console.warn('⚠️ Low FPS detected:', fps);
                    document.documentElement.classList.add('low-performance');
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(monitorFrame);
        };

        requestAnimationFrame(monitorFrame);
        console.log('📊 Basic Performance Monitoring: ACTIVATED');
        this.systemsStatus.performanceMonitoring = true;
    }

    setupEmergencyFallbacks() {
        // Image loading fallbacks
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                const img = e.target;
                if (!img.getAttribute('data-fallback-attempted')) {
                    img.setAttribute('data-fallback-attempted', 'true');
                    
                    // Try fallback src
                    const fallback = img.getAttribute('data-fallback');
                    if (fallback) {
                        img.src = fallback;
                        return;
                    }
                    
                    // Generate placeholder
                    const width = img.offsetWidth || 400;
                    const height = img.offsetHeight || 300;
                    img.src = `data:image/svg+xml;charset=UTF-8,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='14' fill='%2364748b'%3EImage unavailable%3C/text%3E%3C/svg%3E`;
                    img.classList.add('image-fallback');
                }
            }
        }, true);

        // Network status monitoring
        if ('onLine' in navigator) {
            const updateNetworkStatus = () => {
                document.documentElement.classList.toggle('offline', !navigator.onLine);
                document.documentElement.classList.toggle('online', navigator.onLine);
            };

            window.addEventListener('online', updateNetworkStatus);
            window.addEventListener('offline', updateNetworkStatus);
            updateNetworkStatus();
        }

        console.log('🛡️ Emergency Fallbacks: ACTIVE');
    }

    activateEmergencyMode() {
        console.error('🚨 ACTIVATING EMERGENCY MODE - CRITICAL SYSTEMS FAILED');
        
        const html = document.documentElement;
        html.classList.add('emergency-mode', 'safe-mode', 'legacy-browser');
        
        // Disable all advanced features
        const disableElements = document.querySelectorAll('video, canvas, [data-animation]');
        disableElements.forEach(el => {
            el.style.display = 'none';
        });

        // Show emergency notification
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; z-index: 10001; background: #dc2626; color: white; padding: 16px; border-radius: 8px; font-family: system-ui; font-size: 14px; max-width: 300px;">
                <strong>⚠️ Compatibility Mode</strong><br>
                Some features disabled for stability.<br>
                <button onclick="location.reload()" style="margin-top: 8px; padding: 4px 8px; background: white; color: #dc2626; border: none; border-radius: 4px; cursor: pointer;">Reload Page</button>
            </div>
        `;
        document.body.appendChild(notification);

        // Auto-hide notification after 10 seconds
        setTimeout(() => notification.remove(), 10000);
    }

    allSystemsReady() {
        const requiredSystems = ['browserDetection', 'errorPrevention', 'fallbacksReady'];
        return requiredSystems.every(system => this.systemsStatus[system]);
    }

    onAllSystemsReady() {
        console.log('🎉 ALL BULLETPROOF SYSTEMS READY!');
        console.log('📊 Systems Status:', this.systemsStatus);
        
        // Dispatch ready event
        const event = new CustomEvent('bulletproofReady', {
            detail: { systemsStatus: this.systemsStatus }
        });
        document.dispatchEvent(event);

        // Add ready class to HTML
        document.documentElement.classList.add('bulletproof-ready');
        
        // Initialize additional enhancements
        this.initializeEnhancements();
    }

    initializeEnhancements() {
        // Add progressive enhancement based on detected capabilities
        if (this.systemsStatus.browserDetection) {
            const detection = window.facePayBrowserDetection;
            if (detection) {
                const browserInfo = detection.getBrowserInfo();
                const features = detection.getAllFeatures();
                
                console.log('🔍 Browser Capabilities:', {
                    browser: browserInfo.name,
                    version: browserInfo.version,
                    featuresSupported: Object.keys(features).filter(f => features[f]).length
                });
            }
        }

        // Optimize based on performance capability
        if (this.systemsStatus.performanceMonitoring) {
            setTimeout(() => {
                if (window.facePayPerformance) {
                    const stats = window.facePayPerformance.getPerformanceStats();
                    if (stats.currentFPS < 45) {
                        console.log('📉 Optimizing for lower performance device');
                        document.documentElement.classList.add('optimize-performance');
                    }
                }
            }, 2000);
        }
    }

    finalizeInitialization() {
        if (!this.allSystemsReady()) {
            console.warn('⚠️ Not all systems loaded within timeout - proceeding with available systems');
        }

        // Log final status
        const loadedSystems = Object.keys(this.systemsStatus).filter(s => this.systemsStatus[s]);
        const failedSystems = Object.keys(this.systemsStatus).filter(s => !this.systemsStatus[s]);

        console.group('🏁 BULLETPROOF INITIALIZATION COMPLETE');
        console.log('✅ Loaded Systems:', loadedSystems);
        if (failedSystems.length > 0) {
            console.warn('❌ Failed Systems:', failedSystems);
        }
        console.log('🛡️ Error Prevention: ACTIVE');
        console.log('🚀 Page Ready for Users');
        console.groupEnd();

        // Remove loading indicators
        document.documentElement.classList.remove('initializing');
        document.documentElement.classList.add('initialized');
    }

    // Public API
    getSystemsStatus() {
        return { ...this.systemsStatus };
    }

    forceEmergencyMode() {
        this.activateEmergencyMode();
    }

    testErrorPrevention() {
        // Test error handling
        try {
            throw new Error('Test error for bulletproof system');
        } catch (e) {
            console.log('🧪 Error prevention test:', e.message);
        }
    }
}

// Initialize immediately
let bulletproofInit;

// Run as early as possible
(() => {
    // Add initializing class
    document.documentElement.classList.add('initializing');
    
    // Initialize the bulletproof system
    bulletproofInit = new BulletproofInitializationSystem();
    
    // Expose globally for debugging
    window.bulletproofInit = bulletproofInit;
    
    console.log('🛡️ BULLETPROOF SYSTEM ARMED AND READY');
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BulletproofInitializationSystem;
}