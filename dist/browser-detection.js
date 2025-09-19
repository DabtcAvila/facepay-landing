/**
 * FACEPAY BROWSER FEATURE DETECTION
 * Automatically detects browser capabilities and adds classes for CSS fallbacks
 * Ensures graceful degradation across all browsers
 */

class FacePayBrowserDetection {
    constructor() {
        this.features = {
            // CSS Features
            cssGrid: false,
            flexbox: false,
            transforms: false,
            transitions: false,
            animations: false,
            gradients: false,
            backdropFilter: false,
            customProperties: false,
            objectFit: false,
            clipPath: false,
            
            // JavaScript Features
            es6: false,
            promises: false,
            intersectionObserver: false,
            resizeObserver: false,
            webgl: false,
            webgl2: false,
            
            // Media Features
            videoAutoplay: false,
            webm: false,
            mp4: false,
            
            // Device Features
            touch: false,
            hover: false,
            
            // Network Features
            online: false,
            connectionAPI: false,
            
            // Performance Features
            performanceAPI: false,
            memoryAPI: false,
            
            // Security Features
            localStorage: false,
            sessionStorage: false,
            
            // User Preferences
            reducedMotion: false,
            highContrast: false,
            forcedColors: false
        };
        
        this.browserInfo = {
            name: 'unknown',
            version: '0',
            engine: 'unknown',
            mobile: false,
            tablet: false
        };
        
        this.init();
    }

    init() {
        this.detectBrowserInfo();
        this.detectFeatures();
        this.applyFeatureClasses();
        this.setupDynamicDetection();
        this.logDetectionResults();
    }

    detectBrowserInfo() {
        const ua = navigator.userAgent;
        const uaLower = ua.toLowerCase();

        // Browser detection
        if (uaLower.includes('firefox')) {
            this.browserInfo.name = 'firefox';
            this.browserInfo.engine = 'gecko';
        } else if (uaLower.includes('edg')) {
            this.browserInfo.name = 'edge';
            this.browserInfo.engine = 'chromium';
        } else if (uaLower.includes('chrome')) {
            this.browserInfo.name = 'chrome';
            this.browserInfo.engine = 'chromium';
        } else if (uaLower.includes('safari')) {
            this.browserInfo.name = 'safari';
            this.browserInfo.engine = 'webkit';
        } else if (uaLower.includes('trident') || uaLower.includes('msie')) {
            this.browserInfo.name = 'ie';
            this.browserInfo.engine = 'trident';
        }

        // Version detection (simplified)
        const versionMatch = ua.match(/(firefox|chrome|safari|edge)\/(\d+)/i) ||
                           ua.match(/(version)\/(\d+)/i) ||
                           ua.match(/(msie)\s(\d+)/i);
        
        if (versionMatch) {
            this.browserInfo.version = versionMatch[2];
        }

        // Device detection
        this.browserInfo.mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
        this.browserInfo.tablet = /iPad|Android(?!.*Mobile)|Kindle/i.test(ua);

        // Add browser classes
        document.documentElement.classList.add(
            `browser-${this.browserInfo.name}`,
            `engine-${this.browserInfo.engine}`,
            `version-${this.browserInfo.version}`
        );

        if (this.browserInfo.mobile) {
            document.documentElement.classList.add('mobile-browser');
        }

        if (this.browserInfo.tablet) {
            document.documentElement.classList.add('tablet-browser');
        }
    }

    detectFeatures() {
        // CSS Features Detection
        this.features.cssGrid = this.supportsCSSFeature('display', 'grid');
        this.features.flexbox = this.supportsCSSFeature('display', 'flex');
        this.features.transforms = this.supportsCSSFeature('transform', 'translateX(1px)');
        this.features.transitions = this.supportsCSSFeature('transition', 'all 0.3s');
        this.features.animations = this.supportsCSSFeature('animation', 'test 1s');
        this.features.gradients = this.supportsCSSFeature('background', 'linear-gradient(red, blue)');
        this.features.backdropFilter = this.supportsCSSFeature('backdrop-filter', 'blur(5px)') || 
                                     this.supportsCSSFeature('-webkit-backdrop-filter', 'blur(5px)');
        this.features.customProperties = this.supportsCustomProperties();
        this.features.objectFit = this.supportsCSSFeature('object-fit', 'cover');
        this.features.clipPath = this.supportsCSSFeature('clip-path', 'polygon(0 0, 100% 0, 100% 100%, 0 100%)');

        // JavaScript Features
        this.features.es6 = this.supportsES6();
        this.features.promises = typeof Promise !== 'undefined';
        this.features.intersectionObserver = 'IntersectionObserver' in window;
        this.features.resizeObserver = 'ResizeObserver' in window;
        this.features.webgl = this.supportsWebGL();
        this.features.webgl2 = this.supportsWebGL2();

        // Media Features
        this.features.videoAutoplay = this.supportsVideoAutoplay();
        this.features.webm = this.supportsVideoFormat('webm');
        this.features.mp4 = this.supportsVideoFormat('mp4');

        // Device Features
        this.features.touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.features.hover = window.matchMedia('(hover: hover)').matches;

        // Network Features
        this.features.online = navigator.onLine;
        this.features.connectionAPI = 'connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator;

        // Performance Features
        this.features.performanceAPI = 'performance' in window;
        this.features.memoryAPI = 'memory' in performance;

        // Storage Features
        this.features.localStorage = this.supportsStorage('localStorage');
        this.features.sessionStorage = this.supportsStorage('sessionStorage');

        // User Preferences
        this.features.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.features.highContrast = window.matchMedia('(prefers-contrast: high)').matches;
        this.features.forcedColors = window.matchMedia('(forced-colors: active)').matches;
    }

    supportsCSSFeature(property, value) {
        const element = document.createElement('div');
        element.style.setProperty(property, value);
        return element.style.getPropertyValue(property) !== '';
    }

    supportsCustomProperties() {
        return window.CSS && window.CSS.supports && window.CSS.supports('--test', '1');
    }

    supportsES6() {
        try {
            // Test arrow functions
            const testArrow = () => {};
            // Test const/let
            const testConst = 1;
            // Test template literals
            const testTemplate = `test ${testConst}`;
            return true;
        } catch (e) {
            return false;
        }
    }

    supportsWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    }

    supportsWebGL2() {
        try {
            const canvas = document.createElement('canvas');
            return !!canvas.getContext('webgl2');
        } catch (e) {
            return false;
        }
    }

    supportsVideoAutoplay() {
        // Create test video element
        const video = document.createElement('video');
        video.muted = true;
        video.autoplay = true;
        video.playsInline = true;
        
        // Simple heuristic - mobile browsers often block autoplay
        if (this.browserInfo.mobile) {
            return false;
        }
        
        // Check if autoplay is explicitly allowed
        return video.autoplay === true;
    }

    supportsVideoFormat(format) {
        const video = document.createElement('video');
        const codecs = {
            webm: 'video/webm; codecs="vp8, vorbis"',
            mp4: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
            ogg: 'video/ogg; codecs="theora"'
        };
        
        return video.canPlayType(codecs[format] || format) !== '';
    }

    supportsStorage(type) {
        try {
            const storage = window[type];
            const test = '__test__';
            storage.setItem(test, test);
            storage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    applyFeatureClasses() {
        const html = document.documentElement;

        // Apply negative classes for missing features
        Object.entries(this.features).forEach(([feature, supported]) => {
            if (supported) {
                html.classList.add(`has-${this.kebabCase(feature)}`);
            } else {
                html.classList.add(`no-${this.kebabCase(feature)}`);
            }
        });

        // Special browser-specific classes
        if (this.browserInfo.name === 'ie') {
            html.classList.add('ie', `ie-${this.browserInfo.version}`);
            
            // IE version specific
            const version = parseInt(this.browserInfo.version);
            if (version <= 11) {
                html.classList.add('ie-old');
            }
            if (version <= 9) {
                html.classList.add('ie-very-old');
            }
        }

        // Legacy browser detection
        if (this.isLegacyBrowser()) {
            html.classList.add('legacy-browser');
        }

        // Modern browser detection
        if (this.isModernBrowser()) {
            html.classList.add('modern-browser');
        }

        // High performance browser
        if (this.isHighPerformanceBrowser()) {
            html.classList.add('high-performance-browser');
        }

        // JavaScript disabled fallback
        html.classList.remove('no-js');
        html.classList.add('js');
    }

    setupDynamicDetection() {
        // Monitor network status
        if (this.features.online) {
            window.addEventListener('online', () => {
                document.documentElement.classList.add('online');
                document.documentElement.classList.remove('offline');
            });

            window.addEventListener('offline', () => {
                document.documentElement.classList.add('offline');
                document.documentElement.classList.remove('online');
            });

            // Initial state
            document.documentElement.classList.toggle('online', navigator.onLine);
            document.documentElement.classList.toggle('offline', !navigator.onLine);
        }

        // Monitor user preference changes
        if (window.matchMedia) {
            const reducedMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
            const updateReducedMotion = () => {
                document.documentElement.classList.toggle('prefers-reduced-motion', reducedMotionMQ.matches);
            };
            
            reducedMotionMQ.addListener(updateReducedMotion);
            updateReducedMotion();

            const highContrastMQ = window.matchMedia('(prefers-contrast: high)');
            const updateHighContrast = () => {
                document.documentElement.classList.toggle('prefers-high-contrast', highContrastMQ.matches);
            };
            
            highContrastMQ.addListener(updateHighContrast);
            updateHighContrast();
        }

        // Monitor performance
        if (this.features.performanceAPI) {
            this.monitorPerformance();
        }
    }

    monitorPerformance() {
        let lowPerformanceDetected = false;
        
        const checkPerformance = () => {
            if (window.performance && window.performance.now) {
                const now = performance.now();
                setTimeout(() => {
                    const elapsed = performance.now() - now;
                    
                    // If setTimeout takes significantly longer than expected
                    if (elapsed > 50 && !lowPerformanceDetected) {
                        lowPerformanceDetected = true;
                        document.documentElement.classList.add('low-performance');
                        console.warn('🐌 Low performance detected - enabling performance mode');
                    }
                }, 16); // ~60fps
            }
        };

        // Check performance periodically
        setInterval(checkPerformance, 5000);
    }

    isLegacyBrowser() {
        const legacyTests = [
            !this.features.flexbox,
            !this.features.promises,
            !this.features.customProperties,
            this.browserInfo.name === 'ie',
            (this.browserInfo.name === 'chrome' && parseInt(this.browserInfo.version) < 60),
            (this.browserInfo.name === 'firefox' && parseInt(this.browserInfo.version) < 55),
            (this.browserInfo.name === 'safari' && parseInt(this.browserInfo.version) < 12)
        ];

        return legacyTests.some(test => test);
    }

    isModernBrowser() {
        const modernTests = [
            this.features.cssGrid,
            this.features.customProperties,
            this.features.intersectionObserver,
            this.features.promises,
            this.features.es6
        ];

        return modernTests.every(test => test);
    }

    isHighPerformanceBrowser() {
        const highPerfTests = [
            this.features.webgl,
            this.features.resizeObserver,
            this.features.backdropFilter,
            !this.browserInfo.mobile
        ];

        return highPerfTests.filter(test => test).length >= 3;
    }

    kebabCase(str) {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
    }

    logDetectionResults() {
        console.group('🔍 FacePay Browser Detection Results');
        console.log('Browser Info:', this.browserInfo);
        console.log('Features:', this.features);
        
        const supportedFeatures = Object.entries(this.features)
            .filter(([, supported]) => supported)
            .map(([feature]) => feature);
        
        const unsupportedFeatures = Object.entries(this.features)
            .filter(([, supported]) => !supported)
            .map(([feature]) => feature);

        console.log('✅ Supported:', supportedFeatures);
        console.log('❌ Unsupported:', unsupportedFeatures);
        
        if (this.isLegacyBrowser()) {
            console.warn('🚨 Legacy browser detected - enhanced fallbacks active');
        } else if (this.isModernBrowser()) {
            console.log('✨ Modern browser detected - full features available');
        }
        
        if (this.isHighPerformanceBrowser()) {
            console.log('⚡ High performance browser detected - advanced features enabled');
        }
        
        console.groupEnd();
    }

    // Public API for manual feature checking
    hasFeature(feature) {
        return this.features[feature] || false;
    }

    getBrowserInfo() {
        return { ...this.browserInfo };
    }

    getAllFeatures() {
        return { ...this.features };
    }

    // Manual feature testing
    testFeature(feature, testFunction) {
        try {
            const result = testFunction();
            this.features[feature] = result;
            
            const html = document.documentElement;
            html.classList.toggle(`has-${this.kebabCase(feature)}`, result);
            html.classList.toggle(`no-${this.kebabCase(feature)}`, !result);
            
            console.log(`🧪 Feature test '${feature}':`, result ? '✅' : '❌');
            return result;
        } catch (e) {
            console.error(`🚨 Feature test '${feature}' failed:`, e);
            return false;
        }
    }

    // Force feature state (for testing)
    forceFeature(feature, state) {
        this.features[feature] = state;
        
        const html = document.documentElement;
        html.classList.toggle(`has-${this.kebabCase(feature)}`, state);
        html.classList.toggle(`no-${this.kebabCase(feature)}`, !state);
        
        console.log(`🔧 Feature '${feature}' forced to:`, state ? '✅' : '❌');
    }

    // Emergency fallback mode
    activateEmergencyFallbacks() {
        console.warn('🚨 Activating emergency fallbacks');
        
        // Disable all advanced features
        Object.keys(this.features).forEach(feature => {
            this.forceFeature(feature, false);
        });
        
        // Add emergency classes
        document.documentElement.classList.add('emergency-fallbacks', 'legacy-browser', 'no-js');
        
        // Disable potentially problematic elements
        const problematicElements = document.querySelectorAll('video, canvas, [data-animation]');
        problematicElements.forEach(el => {
            el.style.display = 'none';
        });
    }
}

// Initialize immediately (before DOM ready to catch early issues)
let browserDetection;

// Run detection as early as possible
(function() {
    // Remove no-js class immediately
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');
    
    // Initialize detection
    browserDetection = new FacePayBrowserDetection();
    
    // Expose globally
    window.facePayBrowserDetection = browserDetection;
    
    // Legacy browser emergency detection
    if (browserDetection.isLegacyBrowser()) {
        console.warn('🚨 Legacy browser detected - consider showing upgrade notice');
    }
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FacePayBrowserDetection;
}