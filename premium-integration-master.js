/**
 * PREMIUM INTEGRATION MASTER - APPLE.COM LEVEL EXPERIENCE
 * Orchestrates all premium desktop systems for seamless interactions
 * Performance-optimized, battery-aware, accessibility-first
 */

class PremiumIntegrationMaster {
    constructor(options = {}) {
        this.options = {
            // Feature flags
            enableMouseTracking: true,
            enableCustomCursor: true,
            enableKeyboardShortcuts: true,
            enableCinematicHovers: true,
            enableHighDPIOptimizations: true,
            enableMultiMonitorSupport: true,
            
            // Performance settings
            batteryOptimization: true,
            adaptivePerformance: true,
            targetFPS: 60,
            
            // Accessibility
            respectReducedMotion: true,
            respectHighContrast: true,
            
            ...options
        };

        // System components
        this.desktopExperience = null;
        this.cursorSystem = null;
        this.scrollEngine = null;
        this.premiumInteractions = null;
        
        // State
        this.isDesktop = window.innerWidth > 1024 && !('ontouchstart' in window);
        this.isHighDPI = window.devicePixelRatio > 1;
        this.performanceMode = 'normal'; // normal, battery, performance
        this.systemsReady = false;
        
        // Performance monitoring
        this.frameRate = 60;
        this.lastFPSCheck = performance.now();
        this.frameCount = 0;
        this.performanceTimeout = null;
        
        // Only initialize on desktop
        if (this.isDesktop) {
            this.init();
        } else {
            console.log('📱 Mobile detected - Premium desktop features disabled');
        }
    }

    async init() {
        console.log('🚀 Premium Integration Master initializing...');
        
        try {
            // Check system capabilities
            await this.checkSystemCapabilities();
            
            // Initialize core systems in order
            await this.initializeCoreStyles();
            await this.initializeDesktopExperience();
            await this.initializeCursorSystem();
            await this.initializeScrollEngine();
            await this.initializePremiumInteractions();
            
            // Setup system coordination
            this.setupSystemCoordination();
            this.setupPerformanceMonitoring();
            this.setupAccessibilityFeatures();
            
            // Start master loop
            this.startMasterLoop();
            
            this.systemsReady = true;
            document.documentElement.classList.add('premium-systems-ready');
            
            console.log('✨ Premium Integration Master ready - Apple-level experience activated');
            this.announceReadiness();
            
        } catch (error) {
            console.error('❌ Premium Integration Master failed to initialize:', error);
            this.enableFallbackMode();
        }
    }

    async checkSystemCapabilities() {
        console.log('🔍 Checking system capabilities...');
        
        // Check hardware capabilities
        const hardwareConcurrency = navigator.hardwareConcurrency || 4;
        const memory = navigator.deviceMemory || 4;
        const connection = navigator.connection?.effectiveType || '4g';
        
        // Check battery status
        if (navigator.getBattery) {
            try {
                const battery = await navigator.getBattery();
                if (battery.level < 0.3 || !battery.charging) {
                    this.performanceMode = 'battery';
                    console.log('🔋 Battery saver mode activated');
                }
            } catch (e) {
                console.log('🔋 Battery API not available');
            }
        }
        
        // Adaptive performance based on system specs
        if (hardwareConcurrency < 4 || memory < 4 || connection === '2g' || connection === 'slow-2g') {
            this.performanceMode = 'performance';
            this.options.targetFPS = 30;
            console.log('⚡ Performance mode activated for low-spec device');
        }
        
        // Check motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.options.enableMouseTracking = false;
            this.options.enableCinematicHovers = false;
            console.log('♿ Reduced motion preferences detected');
        }
        
        console.log('📊 System capabilities:', {
            hardwareConcurrency,
            memory,
            connection,
            performanceMode: this.performanceMode,
            isHighDPI: this.isHighDPI
        });
    }

    async initializeCoreStyles() {
        // Ensure premium desktop styles are loaded
        if (!document.querySelector('link[href*="premium-desktop-styles.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'premium-desktop-styles.css';
            document.head.appendChild(link);
            
            // Wait for styles to load
            await new Promise(resolve => {
                link.onload = resolve;
                setTimeout(resolve, 100); // Fallback
            });
        }
        
        console.log('🎨 Core styles initialized');
    }

    async initializeDesktopExperience() {
        if (!this.options.enableMouseTracking && !this.options.enableCinematicHovers) return;
        
        // Wait for desktop experience class to be available
        if (typeof PremiumDesktopExperience !== 'undefined') {
            this.desktopExperience = new PremiumDesktopExperience({
                mouseGradientStrength: this.performanceMode === 'battery' ? 0.1 : 0.3,
                hoverTransitionSpeed: this.performanceMode === 'performance' ? 150 : 300,
                keyboardShortcutsEnabled: this.options.enableKeyboardShortcuts,
                customCursorEnabled: false, // Will be handled by cursor system
                batteryEfficient: this.performanceMode === 'battery'
            });
            
            console.log('🖥️  Desktop experience initialized');
        } else {
            console.warn('⚠️ PremiumDesktopExperience not available');
        }
    }

    async initializeCursorSystem() {
        if (!this.options.enableCustomCursor) return;
        
        // Wait for cursor system class to be available
        if (typeof PremiumCursorSystem !== 'undefined') {
            this.cursorSystem = new PremiumCursorSystem({
                followSpeed: this.performanceMode === 'performance' ? 0.25 : 0.15,
                trailEffect: this.performanceMode === 'normal',
                batterySaver: this.performanceMode === 'battery',
                throttleMs: this.performanceMode === 'performance' ? 32 : 16
            });
            
            console.log('🎯 Cursor system initialized');
        } else {
            console.warn('⚠️ PremiumCursorSystem not available');
        }
    }

    async initializeScrollEngine() {
        // Premium scroll engine should already be initialized
        if (window.premiumScroll) {
            this.scrollEngine = window.premiumScroll;
            console.log('📜 Scroll engine connected');
        } else {
            console.warn('⚠️ Premium scroll engine not available');
        }
    }

    async initializePremiumInteractions() {
        // Premium interactions should already be initialized
        if (window.FacePayPremium) {
            this.premiumInteractions = window.FacePayPremium;
            console.log('⭐ Premium interactions connected');
        } else {
            console.warn('⚠️ Premium interactions not available');
        }
    }

    setupSystemCoordination() {
        // Coordinate between cursor and mouse tracking
        if (this.cursorSystem && this.desktopExperience) {
            // Sync mouse positions
            document.addEventListener('mousemove', (e) => {
                // Both systems can use the same mouse data
                this.coordinateMouseEffects(e);
            });
        }

        // Coordinate scroll and cursor contexts
        if (this.scrollEngine && this.cursorSystem) {
            document.addEventListener('scroll', () => {
                // Adjust cursor behavior during scroll
                if (this.cursorSystem.currentContext !== 'default') {
                    this.cursorSystem.setContext('default');
                }
            });
        }

        // Coordinate performance between systems
        this.setupPerformanceCoordination();
        
        console.log('🔗 System coordination established');
    }

    coordinateMouseEffects(event) {
        // Ensure both gradient tracking and cursor don't conflict
        const mouseData = {
            x: event.clientX,
            y: event.clientY,
            timestamp: performance.now()
        };

        // Share mouse data between systems efficiently
        if (this.desktopExperience?.mousePosition) {
            this.desktopExperience.mousePosition = mouseData;
        }
    }

    setupPerformanceCoordination() {
        // Shared performance monitoring between all systems
        const performanceObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'measure') {
                    // Monitor custom performance marks
                    this.handlePerformanceEntry(entry);
                }
            });
        });

        try {
            performanceObserver.observe({ entryTypes: ['measure'] });
        } catch (e) {
            console.log('Performance Observer not supported');
        }

        // Adaptive quality based on FPS
        setInterval(() => {
            this.checkAndAdaptPerformance();
        }, 5000); // Check every 5 seconds
    }

    checkAndAdaptPerformance() {
        const currentFPS = this.frameRate;
        
        if (currentFPS < 45 && this.performanceMode !== 'performance') {
            console.log('⚡ Switching to performance mode due to low FPS:', currentFPS);
            this.switchPerformanceMode('performance');
        } else if (currentFPS > 55 && this.performanceMode === 'performance') {
            console.log('🎯 Performance improved, switching to normal mode');
            this.switchPerformanceMode('normal');
        }
    }

    switchPerformanceMode(mode) {
        const previousMode = this.performanceMode;
        this.performanceMode = mode;
        
        document.documentElement.classList.remove(`performance-mode-${previousMode}`);
        document.documentElement.classList.add(`performance-mode-${mode}`);
        
        // Adjust all systems
        if (this.desktopExperience) {
            this.desktopExperience.options.hoverTransitionSpeed = mode === 'performance' ? 150 : 300;
            this.desktopExperience.options.mouseTrackingThrottle = mode === 'performance' ? 32 : 16;
        }
        
        if (this.cursorSystem) {
            this.cursorSystem.updateOptions({
                followSpeed: mode === 'performance' ? 0.25 : 0.15,
                throttleMs: mode === 'performance' ? 32 : 16,
                trailEffect: mode === 'normal'
            });
        }
        
        // Notify other systems
        document.dispatchEvent(new CustomEvent('premiumPerformanceModeChange', {
            detail: { mode, previousMode }
        }));
    }

    setupAccessibilityFeatures() {
        // Monitor accessibility preferences
        const mediaQueries = {
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
            highContrast: window.matchMedia('(prefers-contrast: high)'),
            darkMode: window.matchMedia('(prefers-color-scheme: dark)')
        };

        Object.entries(mediaQueries).forEach(([name, mq]) => {
            mq.addEventListener('change', () => {
                this.handleAccessibilityChange(name, mq.matches);
            });
        });

        // Keyboard navigation enhancements
        this.setupKeyboardNavigation();
        
        console.log('♿ Accessibility features initialized');
    }

    handleAccessibilityChange(preference, enabled) {
        console.log(`♿ Accessibility preference changed: ${preference} = ${enabled}`);
        
        switch (preference) {
            case 'reducedMotion':
                if (enabled) {
                    this.disableAnimations();
                } else {
                    this.enableAnimations();
                }
                break;
                
            case 'highContrast':
                if (enabled) {
                    this.enableHighContrast();
                } else {
                    this.disableHighContrast();
                }
                break;
                
            case 'darkMode':
                this.updateThemeColors(enabled);
                break;
        }
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for all premium systems
        let focusedElement = null;
        
        document.addEventListener('focusin', (e) => {
            focusedElement = e.target;
            
            // Adjust cursor context for focused elements
            if (this.cursorSystem) {
                this.cursorSystem.setContext('default');
            }
            
            // Ensure focused element is visible
            this.ensureElementVisible(e.target);
        });

        // Advanced focus management
        document.addEventListener('keydown', (e) => {
            this.handleAdvancedKeyboardNavigation(e, focusedElement);
        });
    }

    ensureElementVisible(element) {
        // Smooth scroll focused element into view
        if (this.scrollEngine && typeof this.scrollEngine.scrollTo === 'function') {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + window.pageYOffset;
            const elementCenter = elementTop - (window.innerHeight / 2) + (rect.height / 2);
            
            this.scrollEngine.scrollTo(Math.max(0, elementCenter), true);
        }
    }

    handleAdvancedKeyboardNavigation(event, focusedElement) {
        // Advanced keyboard shortcuts that work with all systems
        if (event.altKey && event.key === 'p') {
            event.preventDefault();
            this.togglePerformanceMode();
        }
        
        if (event.altKey && event.key === 'c') {
            event.preventDefault();
            this.toggleCursorSystem();
        }
        
        if (event.altKey && event.key === 'm') {
            event.preventDefault();
            this.toggleMouseTracking();
        }
    }

    startMasterLoop() {
        const masterLoop = (timestamp) => {
            // Performance monitoring
            this.frameCount++;
            if (timestamp - this.lastFPSCheck > 1000) {
                this.frameRate = Math.round((this.frameCount * 1000) / (timestamp - this.lastFPSCheck));
                this.frameCount = 0;
                this.lastFPSCheck = timestamp;
            }
            
            // Coordinate system updates if needed
            this.coordinateSystemUpdates(timestamp);
            
            requestAnimationFrame(masterLoop);
        };
        
        requestAnimationFrame(masterLoop);
        console.log('🔄 Master loop started');
    }

    coordinateSystemUpdates(timestamp) {
        // Central coordination point for all systems
        // This prevents conflicts and optimizes performance
        
        if (this.performanceMode === 'battery') {
            // Skip updates on battery mode for some frames
            if (this.frameCount % 2 === 0) return;
        }
        
        // Coordinate any cross-system updates here
    }

    // Public API methods
    togglePerformanceMode() {
        const modes = ['normal', 'performance', 'battery'];
        const currentIndex = modes.indexOf(this.performanceMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        
        this.switchPerformanceMode(nextMode);
        this.showNotification(`Performance mode: ${nextMode}`);
    }

    toggleCursorSystem() {
        if (this.cursorSystem) {
            if (this.cursorSystem.isActive) {
                this.cursorSystem.disable();
                this.showNotification('Custom cursor disabled');
            } else {
                this.cursorSystem.enable();
                this.showNotification('Custom cursor enabled');
            }
        }
    }

    toggleMouseTracking() {
        if (this.desktopExperience?.gradientOverlay) {
            const isHidden = this.desktopExperience.gradientOverlay.style.display === 'none';
            this.desktopExperience.gradientOverlay.style.display = isHidden ? 'block' : 'none';
            this.showNotification(`Mouse tracking ${isHidden ? 'enabled' : 'disabled'}`);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'premium-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: #00ff88;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10001;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    disableAnimations() {
        document.documentElement.classList.add('reduce-motion');
        if (this.desktopExperience) {
            this.desktopExperience.options.mouseTrackingThrottle = 100;
        }
    }

    enableAnimations() {
        document.documentElement.classList.remove('reduce-motion');
        if (this.desktopExperience) {
            this.desktopExperience.options.mouseTrackingThrottle = 16;
        }
    }

    enableHighContrast() {
        document.documentElement.classList.add('high-contrast');
    }

    disableHighContrast() {
        document.documentElement.classList.remove('high-contrast');
    }

    updateThemeColors(isDark) {
        // Update all systems for theme changes
        const colorScheme = isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', colorScheme);
        
        if (this.cursorSystem) {
            const color = isDark ? '#00ff88' : '#059669';
            this.cursorSystem.updateOptions({ color });
        }
    }

    announceReadiness() {
        // Announce to screen readers and other systems
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        announcement.textContent = 'Premium desktop experience ready. Press Alt+P for performance options.';
        
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 3000);
        
        // Dispatch ready event
        document.dispatchEvent(new CustomEvent('premiumSystemsReady', {
            detail: {
                systems: {
                    desktopExperience: !!this.desktopExperience,
                    cursorSystem: !!this.cursorSystem,
                    scrollEngine: !!this.scrollEngine,
                    premiumInteractions: !!this.premiumInteractions
                },
                performanceMode: this.performanceMode,
                capabilities: {
                    isHighDPI: this.isHighDPI,
                    frameRate: this.frameRate
                }
            }
        }));
    }

    enableFallbackMode() {
        console.log('⚠️ Enabling fallback mode - basic interactions only');
        document.documentElement.classList.add('premium-fallback-mode');
        
        // Disable intensive features
        this.performanceMode = 'fallback';
        
        // Keep basic hover effects
        const basicCSS = document.createElement('style');
        basicCSS.textContent = `
            .premium-fallback-mode .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .premium-fallback-mode .feature:hover {
                transform: translateY(-4px);
            }
        `;
        document.head.appendChild(basicCSS);
    }

    // Cleanup and destroy
    destroy() {
        if (this.desktopExperience) {
            this.desktopExperience.destroy();
        }
        
        if (this.cursorSystem) {
            this.cursorSystem.destroy();
        }
        
        document.documentElement.classList.remove(
            'premium-systems-ready',
            'premium-desktop-active',
            'premium-cursor-active'
        );
        
        console.log('🧹 Premium systems destroyed');
    }

    // Static factory
    static create(options = {}) {
        return new PremiumIntegrationMaster(options);
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.premiumMaster = PremiumIntegrationMaster.create();
    });
} else {
    window.premiumMaster = PremiumIntegrationMaster.create();
}

// Global access
window.PremiumIntegrationMaster = PremiumIntegrationMaster;