/**
 * Dynamic Viewport & Safe Area Optimizer
 * Real-time adaptation to device orientation, keyboard, and safe areas
 */

class ViewportSafeAreaOptimizer {
    constructor() {
        this.initialViewportHeight = window.innerHeight;
        this.currentViewportHeight = window.innerHeight;
        this.keyboardHeight = 0;
        this.isKeyboardOpen = false;
        this.orientation = this.getOrientation();
        this.safeAreaInsets = this.getSafeAreaInsets();
        this.device = this.detectDevice();
        
        // State tracking
        this.resizeTimeouts = new Map();
        this.orientationChangeTimeout = null;
        this.keyboardDetectionTimeout = null;
        
        // Event listeners
        this.boundHandleResize = this.handleResize.bind(this);
        this.boundHandleOrientationChange = this.handleOrientationChange.bind(this);
        this.boundHandleVisualViewportChange = this.handleVisualViewportChange.bind(this);
        this.boundHandleFocus = this.handleInputFocus.bind(this);
        this.boundHandleBlur = this.handleInputBlur.bind(this);
        
        this.init();
    }

    init() {
        console.log('📱 Viewport & Safe Area Optimizer initializing...');
        
        this.setupEventListeners();
        this.detectSafeAreas();
        this.setupViewportHeightFix();
        this.setupKeyboardDetection();
        this.setupOrientationHandling();
        this.setupSafeAreaCSS();
        this.optimizeForDevice();
        
        console.log('✨ Viewport optimization active');
        this.logDeviceInfo();
    }

    detectDevice() {
        const ua = navigator.userAgent;
        const screen = window.screen;
        
        return {
            isIOS: /iPad|iPhone|iPod/.test(ua),
            isAndroid: /Android/.test(ua),
            isTablet: /(iPad|tablet|Tablet)/i.test(ua) || (screen.width >= 768 && screen.height >= 1024),
            hasNotch: this.detectNotch(),
            hasDynamicIsland: this.detectDynamicIsland(),
            screenWidth: screen.width,
            screenHeight: screen.height,
            pixelRatio: window.devicePixelRatio || 1,
            maxTouchPoints: navigator.maxTouchPoints || 1,
            standalone: window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches
        };
    }

    detectNotch() {
        // Check for iPhone X+ models based on screen dimensions and safe areas
        const screen = window.screen;
        const safeTop = this.getCSSEnvValue('safe-area-inset-top');
        
        // Known iPhone X+ dimensions
        const notchDevices = [
            { width: 375, height: 812 }, // iPhone X, XS
            { width: 414, height: 896 }, // iPhone XR, XS Max
            { width: 390, height: 844 }, // iPhone 12, 12 Pro
            { width: 428, height: 926 }, // iPhone 12 Pro Max
            { width: 375, height: 812 }, // iPhone 12 Mini
            { width: 393, height: 852 }, // iPhone 14
            { width: 430, height: 932 }  // iPhone 14 Pro Max
        ];
        
        const matchesNotchDevice = notchDevices.some(device => 
            (screen.width === device.width && screen.height === device.height) ||
            (screen.width === device.height && screen.height === device.width)
        );
        
        return matchesNotchDevice || safeTop > 20;
    }

    detectDynamicIsland() {
        // Dynamic Island detection for iPhone 14 Pro series
        const screen = window.screen;
        const dynamicIslandDevices = [
            { width: 393, height: 852 }, // iPhone 14 Pro
            { width: 430, height: 932 }  // iPhone 14 Pro Max
        ];
        
        return dynamicIslandDevices.some(device => 
            (screen.width === device.width && screen.height === device.height) ||
            (screen.width === device.height && screen.height === device.width)
        );
    }

    getOrientation() {
        if (screen.orientation) {
            return screen.orientation.angle === 0 || screen.orientation.angle === 180 ? 'portrait' : 'landscape';
        }
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }

    getSafeAreaInsets() {
        return {
            top: this.getCSSEnvValue('safe-area-inset-top'),
            right: this.getCSSEnvValue('safe-area-inset-right'),
            bottom: this.getCSSEnvValue('safe-area-inset-bottom'),
            left: this.getCSSEnvValue('safe-area-inset-left')
        };
    }

    getCSSEnvValue(property) {
        // Try to get the safe area value from computed styles
        const testElement = document.createElement('div');
        testElement.style.cssText = `
            position: absolute;
            top: -9999px;
            padding-top: env(${property}, 0px);
        `;
        document.body.appendChild(testElement);
        
        const computedStyle = window.getComputedStyle(testElement);
        const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
        
        document.body.removeChild(testElement);
        return paddingTop;
    }

    setupEventListeners() {
        // Viewport resize handling
        window.addEventListener('resize', this.boundHandleResize, { passive: true });
        
        // Orientation change handling
        window.addEventListener('orientationchange', this.boundHandleOrientationChange, { passive: true });
        if (screen.orientation) {
            screen.orientation.addEventListener('change', this.boundHandleOrientationChange, { passive: true });
        }
        
        // Visual viewport API for keyboard detection
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', this.boundHandleVisualViewportChange, { passive: true });
        }
        
        // Input focus/blur for keyboard detection fallback
        document.addEventListener('focusin', this.boundHandleFocus, { passive: true });
        document.addEventListener('focusout', this.boundHandleBlur, { passive: true });
        
        // Page visibility for optimization
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.refresh();
            }
        });
    }

    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeouts.get('main'));
        this.resizeTimeouts.set('main', setTimeout(() => {
            this.currentViewportHeight = window.innerHeight;
            this.detectKeyboardState();
            this.updateViewportHeight();
            this.updateSafeAreas();
            
            // Dispatch custom event
            this.dispatchViewportChange();
        }, 100));
    }

    handleOrientationChange() {
        // Clear existing timeout
        if (this.orientationChangeTimeout) {
            clearTimeout(this.orientationChangeTimeout);
        }
        
        // Wait for orientation change to complete
        this.orientationChangeTimeout = setTimeout(() => {
            const newOrientation = this.getOrientation();
            
            if (newOrientation !== this.orientation) {
                console.log(`📱 Orientation changed: ${this.orientation} → ${newOrientation}`);
                this.orientation = newOrientation;
                
                this.updateOrientationClasses();
                this.updateViewportHeight();
                this.updateSafeAreas();
                this.optimizeForOrientation();
                
                // Dispatch custom event
                document.dispatchEvent(new CustomEvent('orientationChanged', {
                    detail: { 
                        orientation: this.orientation,
                        viewport: { width: window.innerWidth, height: window.innerHeight }
                    }
                }));
            }
        }, 500); // Wait for orientation animation to complete
    }

    handleVisualViewportChange() {
        if (!window.visualViewport) return;
        
        const visualViewport = window.visualViewport;
        const heightDifference = window.innerHeight - visualViewport.height;
        
        // Keyboard detection threshold
        if (heightDifference > 150) {
            this.keyboardHeight = heightDifference;
            this.setKeyboardState(true);
        } else {
            this.keyboardHeight = 0;
            this.setKeyboardState(false);
        }
    }

    handleInputFocus(e) {
        // Fallback keyboard detection for browsers without Visual Viewport API
        if (!window.visualViewport && this.isFormElement(e.target)) {
            this.keyboardDetectionTimeout = setTimeout(() => {
                this.detectKeyboardState();
            }, 300);
        }
    }

    handleInputBlur(e) {
        if (!window.visualViewport && this.isFormElement(e.target)) {
            this.keyboardDetectionTimeout = setTimeout(() => {
                this.detectKeyboardState();
            }, 300);
        }
    }

    isFormElement(element) {
        const formElements = ['input', 'textarea', 'select'];
        return formElements.includes(element.tagName.toLowerCase()) || 
               element.contentEditable === 'true';
    }

    detectKeyboardState() {
        const currentHeight = window.innerHeight;
        const heightDifference = this.initialViewportHeight - currentHeight;
        
        // On mobile devices, significant height reduction usually means keyboard is open
        if (this.device.isIOS || this.device.isAndroid) {
            if (heightDifference > 150) {
                this.keyboardHeight = heightDifference;
                this.setKeyboardState(true);
            } else {
                this.keyboardHeight = 0;
                this.setKeyboardState(false);
            }
        }
    }

    setKeyboardState(isOpen) {
        if (this.isKeyboardOpen !== isOpen) {
            this.isKeyboardOpen = isOpen;
            
            console.log(`⌨️ Keyboard ${isOpen ? 'opened' : 'closed'}, height: ${this.keyboardHeight}px`);
            
            this.updateKeyboardClasses();
            this.updateKeyboardCSS();
            
            // Dispatch custom event
            document.dispatchEvent(new CustomEvent('keyboardToggle', {
                detail: { 
                    isOpen: isOpen,
                    height: this.keyboardHeight,
                    viewport: { width: window.innerWidth, height: window.innerHeight }
                }
            }));
        }
    }

    detectSafeAreas() {
        this.safeAreaInsets = this.getSafeAreaInsets();
        console.log('📐 Safe area insets:', this.safeAreaInsets);
    }

    setupViewportHeightFix() {
        // Set initial viewport height custom property
        this.updateViewportHeight();
        
        // iOS viewport height fix
        if (this.device.isIOS) {
            this.setupiOSViewportFix();
        }
    }

    setupiOSViewportFix() {
        // iOS Safari viewport fix for 100vh issues
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH, { passive: true });
    }

    updateViewportHeight() {
        const vh = this.currentViewportHeight * 0.01;
        const vhWithKeyboard = (this.currentViewportHeight - this.keyboardHeight) * 0.01;
        
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--vh-available', `${vhWithKeyboard}px`);
        document.documentElement.style.setProperty('--viewport-height-current', `${this.currentViewportHeight}px`);
        document.documentElement.style.setProperty('--keyboard-height', `${this.keyboardHeight}px`);
    }

    updateSafeAreas() {
        this.safeAreaInsets = this.getSafeAreaInsets();
        
        // Update CSS custom properties
        document.documentElement.style.setProperty('--safe-area-inset-top', `${this.safeAreaInsets.top}px`);
        document.documentElement.style.setProperty('--safe-area-inset-right', `${this.safeAreaInsets.right}px`);
        document.documentElement.style.setProperty('--safe-area-inset-bottom', `${this.safeAreaInsets.bottom}px`);
        document.documentElement.style.setProperty('--safe-area-inset-left', `${this.safeAreaInsets.left}px`);
        
        // Set combined values
        const maxHorizontal = Math.max(this.safeAreaInsets.left, this.safeAreaInsets.right);
        const maxVertical = Math.max(this.safeAreaInsets.top, this.safeAreaInsets.bottom);
        
        document.documentElement.style.setProperty('--safe-area-max-horizontal', `${maxHorizontal}px`);
        document.documentElement.style.setProperty('--safe-area-max-vertical', `${maxVertical}px`);
    }

    setupKeyboardDetection() {
        this.initialViewportHeight = window.innerHeight;
        
        // Store initial viewport height for keyboard detection
        if (!window.visualViewport) {
            // Fallback detection using viewport height changes
            this.detectKeyboardState();
        }
    }

    setupOrientationHandling() {
        this.updateOrientationClasses();
        this.optimizeForOrientation();
    }

    updateOrientationClasses() {
        document.body.classList.remove('orientation-portrait', 'orientation-landscape');
        document.body.classList.add(`orientation-${this.orientation}`);
    }

    updateKeyboardClasses() {
        if (this.isKeyboardOpen) {
            document.body.classList.add('keyboard-open');
            document.body.classList.remove('keyboard-closed');
        } else {
            document.body.classList.remove('keyboard-open');
            document.body.classList.add('keyboard-closed');
        }
    }

    updateKeyboardCSS() {
        // Update available height considering keyboard
        const availableHeight = this.currentViewportHeight - this.keyboardHeight;
        document.documentElement.style.setProperty('--available-height', `${availableHeight}px`);
    }

    setupSafeAreaCSS() {
        // Create dynamic stylesheet for safe area optimization
        const style = document.createElement('style');
        style.id = 'safe-area-dynamic';
        style.textContent = this.generateDynamicSafeAreaCSS();
        document.head.appendChild(style);
    }

    generateDynamicSafeAreaCSS() {
        const { top, right, bottom, left } = this.safeAreaInsets;
        
        return `
            /* Dynamic safe area adjustments */
            .safe-area-dynamic {
                padding-top: ${top}px;
                padding-right: ${right}px;
                padding-bottom: ${bottom}px;
                padding-left: ${left}px;
            }
            
            .safe-margin-dynamic {
                margin-top: ${top}px;
                margin-right: ${right}px;
                margin-bottom: ${bottom}px;
                margin-left: ${left}px;
            }
            
            /* Device-specific optimizations */
            ${this.device.hasNotch ? `
                .notch-aware {
                    padding-top: max(${top}px, 44px);
                    padding-left: max(${left}px, 20px);
                    padding-right: max(${right}px, 20px);
                }
            ` : ''}
            
            ${this.device.hasDynamicIsland ? `
                .dynamic-island-aware {
                    padding-top: max(${top}px, 50px);
                }
            ` : ''}
        `;
    }

    optimizeForDevice() {
        // Add device-specific classes
        if (this.device.isIOS) {
            document.body.classList.add('device-ios');
            if (this.device.hasNotch) document.body.classList.add('device-notch');
            if (this.device.hasDynamicIsland) document.body.classList.add('device-dynamic-island');
            if (this.device.standalone) document.body.classList.add('device-pwa');
        }
        
        if (this.device.isAndroid) {
            document.body.classList.add('device-android');
        }
        
        if (this.device.isTablet) {
            document.body.classList.add('device-tablet');
        }
        
        // Pixel ratio optimization
        if (this.device.pixelRatio >= 3) {
            document.body.classList.add('device-high-dpi');
        }
        
        console.log('🎯 Device-specific optimizations applied');
    }

    optimizeForOrientation() {
        // Orientation-specific optimizations
        if (this.orientation === 'landscape') {
            // In landscape, give more horizontal padding to prevent edge touches
            this.adjustLandscapeLayout();
        } else {
            // In portrait, optimize for vertical content
            this.adjustPortraitLayout();
        }
    }

    adjustLandscapeLayout() {
        // Landscape-specific adjustments
        const minHorizontalPadding = this.device.isTablet ? 32 : 20;
        const safeHorizontal = Math.max(this.safeAreaInsets.left, this.safeAreaInsets.right, minHorizontalPadding);
        
        document.documentElement.style.setProperty('--landscape-safe-horizontal', `${safeHorizontal}px`);
    }

    adjustPortraitLayout() {
        // Portrait-specific adjustments
        const minVerticalPadding = 16;
        const safeVertical = Math.max(this.safeAreaInsets.top, this.safeAreaInsets.bottom, minVerticalPadding);
        
        document.documentElement.style.setProperty('--portrait-safe-vertical', `${safeVertical}px`);
    }

    dispatchViewportChange() {
        document.dispatchEvent(new CustomEvent('viewportChanged', {
            detail: {
                width: window.innerWidth,
                height: window.innerHeight,
                keyboardHeight: this.keyboardHeight,
                safeAreaInsets: this.safeAreaInsets,
                orientation: this.orientation
            }
        }));
    }

    refresh() {
        // Force refresh of all calculations
        this.currentViewportHeight = window.innerHeight;
        this.detectSafeAreas();
        this.detectKeyboardState();
        this.updateViewportHeight();
        this.updateSafeAreas();
        this.updateOrientationClasses();
        console.log('🔄 Viewport optimizer refreshed');
    }

    logDeviceInfo() {
        console.log('📱 Device Information:');
        console.log(`  Platform: ${this.device.isIOS ? 'iOS' : this.device.isAndroid ? 'Android' : 'Unknown'}`);
        console.log(`  Screen: ${this.device.screenWidth}x${this.device.screenHeight} @${this.device.pixelRatio}x`);
        console.log(`  Viewport: ${window.innerWidth}x${window.innerHeight}`);
        console.log(`  Orientation: ${this.orientation}`);
        console.log(`  Has Notch: ${this.device.hasNotch}`);
        console.log(`  Has Dynamic Island: ${this.device.hasDynamicIsland}`);
        console.log(`  Is Tablet: ${this.device.isTablet}`);
        console.log(`  Is PWA: ${this.device.standalone}`);
        console.log(`  Safe Areas:`, this.safeAreaInsets);
    }

    // Public API methods
    getSafeAreaInfo() {
        return {
            insets: this.safeAreaInsets,
            hasNotch: this.device.hasNotch,
            hasDynamicIsland: this.device.hasDynamicIsland
        };
    }

    getViewportInfo() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            keyboardHeight: this.keyboardHeight,
            isKeyboardOpen: this.isKeyboardOpen,
            orientation: this.orientation
        };
    }

    getDeviceInfo() {
        return { ...this.device };
    }

    // Utility methods for components
    adaptElementForSafeArea(element, options = {}) {
        if (!element) return;
        
        const {
            top = false,
            right = false,
            bottom = false,
            left = false,
            padding = true
        } = options;
        
        const property = padding ? 'padding' : 'margin';
        
        if (top) element.style[`${property}Top`] = `max(${this.safeAreaInsets.top}px, 16px)`;
        if (right) element.style[`${property}Right`] = `max(${this.safeAreaInsets.right}px, 16px)`;
        if (bottom) element.style[`${property}Bottom`] = `max(${this.safeAreaInsets.bottom}px, 16px)`;
        if (left) element.style[`${property}Left`] = `max(${this.safeAreaInsets.left}px, 16px)`;
    }

    makeFullHeight(element, respectKeyboard = true) {
        if (!element) return;
        
        const height = respectKeyboard 
            ? `calc(100vh - ${this.keyboardHeight}px)`
            : '100vh';
        
        element.style.minHeight = height;
        
        // Update on viewport changes
        const updateHeight = () => {
            const newHeight = respectKeyboard 
                ? `calc(100vh - ${this.keyboardHeight}px)`
                : '100vh';
            element.style.minHeight = newHeight;
        };
        
        document.addEventListener('viewportChanged', updateHeight);
        return () => document.removeEventListener('viewportChanged', updateHeight);
    }

    destroy() {
        // Remove event listeners
        window.removeEventListener('resize', this.boundHandleResize);
        window.removeEventListener('orientationchange', this.boundHandleOrientationChange);
        
        if (screen.orientation) {
            screen.orientation.removeEventListener('change', this.boundHandleOrientationChange);
        }
        
        if (window.visualViewport) {
            window.visualViewport.removeEventListener('resize', this.boundHandleVisualViewportChange);
        }
        
        document.removeEventListener('focusin', this.boundHandleFocus);
        document.removeEventListener('focusout', this.boundHandleBlur);
        
        // Clear timeouts
        this.resizeTimeouts.forEach(timeout => clearTimeout(timeout));
        this.resizeTimeouts.clear();
        
        if (this.orientationChangeTimeout) clearTimeout(this.orientationChangeTimeout);
        if (this.keyboardDetectionTimeout) clearTimeout(this.keyboardDetectionTimeout);
        
        // Remove dynamic styles
        const dynamicStyle = document.getElementById('safe-area-dynamic');
        if (dynamicStyle) dynamicStyle.remove();
        
        console.log('🧹 Viewport optimizer destroyed');
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.viewportOptimizer = new ViewportSafeAreaOptimizer();
    });
} else {
    window.viewportOptimizer = new ViewportSafeAreaOptimizer();
}

window.ViewportSafeAreaOptimizer = ViewportSafeAreaOptimizer;