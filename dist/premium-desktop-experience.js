/**
 * PREMIUM DESKTOP EXPERIENCE - APPLE.COM LEVEL INTERACTIONS
 * Mouse tracking gradients, cinematic hovers, custom cursors, keyboard shortcuts
 * Premium desktop experience that impresses like Apple.com
 */

class PremiumDesktopExperience {
    constructor(options = {}) {
        this.options = {
            // Mouse tracking
            mouseGradientStrength: 0.3,
            mouseGradientRadius: 400,
            mouseTrackingThrottle: 16,
            
            // Hover effects
            hoverEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            hoverScale: 1.05,
            hoverTransitionSpeed: 300,
            
            // Keyboard shortcuts
            keyboardShortcutsEnabled: true,
            focusRingColor: '#00ff88',
            
            // Cursor system
            customCursorEnabled: true,
            cursorScale: 1.2,
            cursorBlendMode: 'difference',
            
            // Performance
            highDPIOptimized: true,
            multiMonitorSupport: true,
            batteryEfficient: true,
            
            ...options
        };

        // State
        this.mousePosition = { x: 0, y: 0 };
        this.isHighDPI = window.devicePixelRatio > 1;
        this.isDesktop = window.innerWidth > 1024;
        this.activeHovers = new Set();
        this.customCursor = null;
        this.gradientElements = new Map();
        
        // Performance
        this.rafId = null;
        this.lastFrameTime = 0;
        this.frameRate = 0;
        
        // Only initialize on desktop
        if (this.isDesktop) {
            this.init();
        }
    }

    init() {
        console.log('🖥️  Premium Desktop Experience initializing...');
        
        this.setupMouseTracking();
        this.setupCinematicHovers();
        this.setupKeyboardShortcuts();
        this.setupCustomCursor();
        this.setupFocusStates();
        this.setupHighDPIOptimizations();
        this.setupMultiMonitorSupport();
        this.setupPerformanceMonitoring();
        
        this.startAnimationLoop();
        
        document.documentElement.classList.add('premium-desktop-active');
        console.log('✨ Premium Desktop Experience activated - Apple-level interactions ready');
    }

    setupMouseTracking() {
        // Create mouse-tracking gradient overlay
        const gradientOverlay = document.createElement('div');
        gradientOverlay.className = 'mouse-gradient-overlay';
        gradientOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            mix-blend-mode: overlay;
            opacity: 0.1;
            background: radial-gradient(
                ${this.options.mouseGradientRadius}px circle at 0px 0px,
                rgba(0, 255, 136, ${this.options.mouseGradientStrength}),
                rgba(59, 130, 246, ${this.options.mouseGradientStrength * 0.7}),
                transparent 70%
            );
            transition: opacity 0.3s ease;
            will-change: transform;
        `;
        document.body.appendChild(gradientOverlay);
        this.gradientOverlay = gradientOverlay;

        // Enhanced mouse move with throttling
        let mouseThrottle = null;
        document.addEventListener('mousemove', (e) => {
            if (mouseThrottle) return;
            
            mouseThrottle = setTimeout(() => {
                this.mousePosition.x = e.clientX;
                this.mousePosition.y = e.clientY;
                mouseThrottle = null;
            }, this.options.mouseTrackingThrottle);
        });

        // Hide gradient when mouse leaves window
        document.addEventListener('mouseleave', () => {
            gradientOverlay.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            gradientOverlay.style.opacity = '0.1';
        });
    }

    setupCinematicHovers() {
        // Add cinematic hover effects to interactive elements
        const hoverableSelectors = [
            '.btn',
            '.feature',
            '.stat',
            '.step',
            'button',
            'a[href]',
            '[data-hover="cinematic"]',
            '.card',
            '.magnetic'
        ];

        const hoverables = document.querySelectorAll(hoverableSelectors.join(', '));
        
        hoverables.forEach(element => {
            this.setupElementHover(element);
        });
    }

    setupElementHover(element) {
        // Skip if already has hover setup
        if (element.hasAttribute('data-hover-enhanced')) return;
        element.setAttribute('data-hover-enhanced', 'true');

        // Create hover enhancement overlay
        const hoverOverlay = document.createElement('div');
        hoverOverlay.className = 'premium-hover-overlay';
        hoverOverlay.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border-radius: inherit;
            background: linear-gradient(135deg, 
                rgba(0, 255, 136, 0.1) 0%, 
                rgba(59, 130, 246, 0.05) 100%);
            opacity: 0;
            transform: scale(0.98);
            transition: all ${this.options.hoverTransitionSpeed}ms ${this.options.hoverEasing};
            pointer-events: none;
            z-index: -1;
        `;
        
        element.style.position = 'relative';
        element.appendChild(hoverOverlay);

        // Enhanced hover states
        let hoverTimeout;
        element.addEventListener('mouseenter', (e) => {
            this.activeHovers.add(element);
            
            // Cinematic entrance
            hoverOverlay.style.opacity = '1';
            hoverOverlay.style.transform = 'scale(1)';
            
            // Enhanced scale and shadow
            element.style.transform = `scale(${this.options.hoverScale}) translateZ(0)`;
            element.style.filter = 'brightness(1.05) saturate(1.1)';
            
            // Glowing border effect
            if (element.classList.contains('btn') || element.classList.contains('feature')) {
                element.style.boxShadow = `
                    0 8px 32px rgba(0, 255, 136, 0.25),
                    0 0 0 1px rgba(0, 255, 136, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `;
            }
            
            // Magnetic effect for buttons
            if (element.classList.contains('btn') || element.classList.contains('btn-magnetic')) {
                this.applyMagneticEffect(element, e);
            }
            
            clearTimeout(hoverTimeout);
        });

        element.addEventListener('mouseleave', () => {
            this.activeHovers.delete(element);
            
            // Smooth exit
            hoverOverlay.style.opacity = '0';
            hoverOverlay.style.transform = 'scale(0.98)';
            
            element.style.transform = 'scale(1) translateZ(0)';
            element.style.filter = 'brightness(1) saturate(1)';
            element.style.boxShadow = '';
            
            // Delayed cleanup
            hoverTimeout = setTimeout(() => {
                element.style.transform = '';
            }, this.options.hoverTransitionSpeed);
        });

        // Enhanced magnetic tracking
        if (element.classList.contains('btn-magnetic') || element.classList.contains('magnetic')) {
            element.addEventListener('mousemove', (e) => {
                if (this.activeHovers.has(element)) {
                    this.applyMagneticEffect(element, e);
                }
            });
        }
    }

    applyMagneticEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (event.clientX - centerX) * 0.2;
        const deltaY = (event.clientY - centerY) * 0.2;
        
        element.style.transform = `
            scale(${this.options.hoverScale}) 
            translate3d(${deltaX}px, ${deltaY}px, 0)
        `;
        
        // Update CSS custom properties for gradient tracking
        const mouseX = ((event.clientX - rect.left) / rect.width) * 100;
        const mouseY = ((event.clientY - rect.top) / rect.height) * 100;
        element.style.setProperty('--mouse-x', `${mouseX}%`);
        element.style.setProperty('--mouse-y', `${mouseY}%`);
    }

    setupKeyboardShortcuts() {
        if (!this.options.keyboardShortcutsEnabled) return;

        const shortcuts = {
            // Navigation
            'KeyJ': () => this.scrollSmooth(100), // Scroll down
            'KeyK': () => this.scrollSmooth(-100), // Scroll up
            'KeyG': () => this.scrollToTop(), // Go to top
            'KeyB': () => this.scrollToBottom(), // Go to bottom
            
            // Sections
            'Digit1': () => this.scrollToSection(0),
            'Digit2': () => this.scrollToSection(1),
            'Digit3': () => this.scrollToSection(2),
            'Digit4': () => this.scrollToSection(3),
            
            // Actions
            'KeyD': () => this.triggerDownload(), // Download
            'KeyV': () => this.openVideoModal(), // Video
            'KeyF': () => this.toggleFullscreen(), // Fullscreen
            'Escape': () => this.closeModals(), // Close modals
            
            // Theme
            'KeyT': () => this.toggleTheme(), // Toggle theme
        };

        document.addEventListener('keydown', (e) => {
            // Skip if typing in input
            if (e.target.matches('input, textarea, [contenteditable]')) return;
            
            // Check for modifiers (Ctrl/Cmd + key)
            const key = e.ctrlKey || e.metaKey ? `${e.ctrlKey ? 'Ctrl' : 'Cmd'}+${e.code}` : e.code;
            
            if (shortcuts[key] || shortcuts[e.code]) {
                e.preventDefault();
                
                // Visual feedback
                this.showKeyboardFeedback(e.key);
                
                // Execute shortcut
                (shortcuts[key] || shortcuts[e.code])();
            }
        });
        
        // Show keyboard shortcuts help
        this.createKeyboardHelp();
    }

    showKeyboardFeedback(key) {
        const feedback = document.createElement('div');
        feedback.className = 'keyboard-feedback';
        feedback.textContent = key.toUpperCase();
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.5);
            background: rgba(0, 0, 0, 0.9);
            color: ${this.options.focusRingColor};
            padding: 12px 20px;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            font-weight: 600;
            font-size: 14px;
            z-index: 10000;
            pointer-events: none;
            animation: keyboardPulse 0.4s ease-out;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.animation = 'keyboardFadeOut 0.2s ease-in';
            setTimeout(() => feedback.remove(), 200);
        }, 400);
    }

    createKeyboardHelp() {
        // Add keyboard shortcuts indicator
        const helpButton = document.createElement('button');
        helpButton.className = 'keyboard-help-trigger';
        helpButton.innerHTML = '⌨️';
        helpButton.title = 'Keyboard shortcuts (Press ? for help)';
        helpButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: none;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        `;
        
        helpButton.addEventListener('click', () => this.showKeyboardHelp());
        document.body.appendChild(helpButton);

        // Show help on ? key
        document.addEventListener('keydown', (e) => {
            if (e.key === '?' && !e.target.matches('input, textarea, [contenteditable]')) {
                e.preventDefault();
                this.showKeyboardHelp();
            }
        });
    }

    showKeyboardHelp() {
        const existingHelp = document.querySelector('.keyboard-help-modal');
        if (existingHelp) {
            existingHelp.remove();
            return;
        }

        const helpModal = document.createElement('div');
        helpModal.className = 'keyboard-help-modal';
        helpModal.innerHTML = `
            <div class="keyboard-help-content">
                <h3>Keyboard Shortcuts</h3>
                <div class="shortcuts-grid">
                    <div class="shortcut"><kbd>J</kbd> <span>Scroll Down</span></div>
                    <div class="shortcut"><kbd>K</kbd> <span>Scroll Up</span></div>
                    <div class="shortcut"><kbd>G</kbd> <span>Go to Top</span></div>
                    <div class="shortcut"><kbd>B</kbd> <span>Go to Bottom</span></div>
                    <div class="shortcut"><kbd>1-4</kbd> <span>Jump to Section</span></div>
                    <div class="shortcut"><kbd>D</kbd> <span>Download App</span></div>
                    <div class="shortcut"><kbd>V</kbd> <span>Play Video</span></div>
                    <div class="shortcut"><kbd>F</kbd> <span>Fullscreen</span></div>
                    <div class="shortcut"><kbd>T</kbd> <span>Toggle Theme</span></div>
                    <div class="shortcut"><kbd>ESC</kbd> <span>Close Modal</span></div>
                </div>
                <button class="close-help">Close</button>
            </div>
        `;
        
        helpModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(helpModal);
        
        // Close handlers
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal || e.target.classList.contains('close-help')) {
                helpModal.remove();
            }
        });
    }

    setupCustomCursor() {
        if (!this.options.customCursorEnabled) return;

        // Create custom cursor
        this.customCursor = document.createElement('div');
        this.customCursor.className = 'premium-cursor';
        this.customCursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid ${this.options.focusRingColor};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            mix-blend-mode: ${this.options.cursorBlendMode};
            transition: all 0.1s ease;
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
        `;
        document.body.appendChild(this.customCursor);

        // Track cursor position
        document.addEventListener('mousemove', (e) => {
            this.customCursor.style.left = e.clientX + 'px';
            this.customCursor.style.top = e.clientY + 'px';
            this.customCursor.style.opacity = '1';
        });

        // Hide default cursor on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.customCursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                this.customCursor.style.borderColor = '#ffffff';
                document.body.style.cursor = 'none';
            });
            
            el.addEventListener('mouseleave', () => {
                this.customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
                this.customCursor.style.borderColor = this.options.focusRingColor;
                document.body.style.cursor = 'auto';
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.customCursor.style.opacity = '0';
        });
    }

    setupFocusStates() {
        // Enhanced focus states for keyboard navigation
        const focusableElements = document.querySelectorAll(`
            a, button, input, textarea, select, 
            [tabindex]:not([tabindex="-1"]),
            [role="button"], [role="link"]
        `);

        focusableElements.forEach(el => {
            el.addEventListener('focus', () => {
                el.style.outline = `2px solid ${this.options.focusRingColor}`;
                el.style.outlineOffset = '2px';
                el.style.boxShadow = `0 0 0 4px rgba(0, 255, 136, 0.2)`;
            });
            
            el.addEventListener('blur', () => {
                el.style.outline = '';
                el.style.outlineOffset = '';
                el.style.boxShadow = '';
            });
        });

        // Skip links for accessibility
        this.createSkipLinks();
    }

    createSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main" class="skip-link">Skip to main content</a>
            <a href="#nav" class="skip-link">Skip to navigation</a>
        `;
        skipLinks.style.cssText = `
            position: fixed;
            top: -100px;
            left: 0;
            z-index: 10001;
        `;
        
        document.body.insertBefore(skipLinks, document.body.firstChild);
    }

    setupHighDPIOptimizations() {
        if (!this.options.highDPIOptimized || !this.isHighDPI) return;

        // Optimize for high DPI displays
        document.documentElement.classList.add('high-dpi');
        
        // Enhance gradients and effects for crisp rendering
        const style = document.createElement('style');
        style.textContent = `
            @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
                .premium-hover-overlay {
                    backdrop-filter: blur(0.5px);
                }
                
                .mouse-gradient-overlay {
                    filter: blur(0.5px);
                }
                
                .premium-cursor {
                    border-width: 1px;
                }
            }
        `;
        document.head.appendChild(style);
        
        console.log('🎯 High DPI optimizations enabled');
    }

    setupMultiMonitorSupport() {
        if (!this.options.multiMonitorSupport) return;

        // Track screen changes
        if ('screen' in window && 'orientation' in window.screen) {
            window.screen.orientation.addEventListener('change', () => {
                this.handleScreenChange();
            });
        }

        // Handle window movement between monitors
        let lastScreenX = window.screenX;
        let lastScreenY = window.screenY;
        
        setInterval(() => {
            if (window.screenX !== lastScreenX || window.screenY !== lastScreenY) {
                this.handleScreenChange();
                lastScreenX = window.screenX;
                lastScreenY = window.screenY;
            }
        }, 1000);
    }

    handleScreenChange() {
        // Recalibrate effects for different monitors
        const currentDPR = window.devicePixelRatio;
        
        if (currentDPR !== this.lastDPR) {
            this.isHighDPI = currentDPR > 1;
            this.setupHighDPIOptimizations();
            this.lastDPR = currentDPR;
            console.log('📺 Monitor change detected, recalibrating for DPR:', currentDPR);
        }
    }

    setupPerformanceMonitoring() {
        if (!this.options.batteryEfficient) return;

        // Battery optimization
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.3) {
                    this.enableBatteryMode();
                }
                
                battery.addEventListener('levelchange', () => {
                    if (battery.level < 0.3) {
                        this.enableBatteryMode();
                    }
                });
            });
        }

        // CPU usage monitoring
        let frameCount = 0;
        let lastTime = performance.now();
        
        const monitorPerformance = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                this.frameRate = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                // Reduce quality if FPS drops
                if (this.frameRate < 45) {
                    this.enablePerformanceMode();
                }
            }
            
            requestAnimationFrame(monitorPerformance);
        };
        
        requestAnimationFrame(monitorPerformance);
    }

    enableBatteryMode() {
        console.log('🔋 Battery mode enabled - optimizing for efficiency');
        
        document.documentElement.classList.add('battery-mode');
        
        // Reduce intensive effects
        if (this.gradientOverlay) {
            this.gradientOverlay.style.opacity = '0.05';
        }
        
        this.options.hoverTransitionSpeed = 150;
        this.options.mouseTrackingThrottle = 32;
    }

    enablePerformanceMode() {
        console.log('⚡ Performance mode enabled - reducing effects for smooth experience');
        
        document.documentElement.classList.add('performance-mode');
        
        // Simplify animations
        this.options.hoverScale = 1.02;
        this.options.mouseTrackingThrottle = 24;
    }

    startAnimationLoop() {
        const animate = (currentTime) => {
            this.lastFrameTime = currentTime;
            
            // Update mouse gradient position
            if (this.gradientOverlay && this.mousePosition.x !== null) {
                this.gradientOverlay.style.background = `
                    radial-gradient(
                        ${this.options.mouseGradientRadius}px circle at ${this.mousePosition.x}px ${this.mousePosition.y}px,
                        rgba(0, 255, 136, ${this.options.mouseGradientStrength}),
                        rgba(59, 130, 246, ${this.options.mouseGradientStrength * 0.7}),
                        transparent 70%
                    )
                `;
            }
            
            this.rafId = requestAnimationFrame(animate);
        };
        
        this.rafId = requestAnimationFrame(animate);
    }

    // Keyboard shortcut implementations
    scrollSmooth(delta) {
        if (window.premiumScroll) {
            window.premiumScroll.velocity += delta * 0.1;
        } else {
            window.scrollBy({ top: delta, behavior: 'smooth' });
        }
    }

    scrollToTop() {
        if (window.premiumScroll) {
            window.premiumScroll.scrollTo(0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    scrollToBottom() {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        if (window.premiumScroll) {
            window.premiumScroll.scrollTo(maxScroll);
        } else {
            window.scrollTo({ top: maxScroll, behavior: 'smooth' });
        }
    }

    scrollToSection(index) {
        if (window.premiumScroll && window.premiumScroll.scrollToSection) {
            window.premiumScroll.scrollToSection(index);
        } else {
            const sections = document.querySelectorAll('.section, [data-section], section');
            if (sections[index]) {
                sections[index].scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    triggerDownload() {
        const downloadBtn = document.querySelector('[onclick*="download"], .btn-primary');
        if (downloadBtn) {
            downloadBtn.click();
        }
    }

    openVideoModal() {
        if (window.openVideoModal) {
            window.openVideoModal();
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    }

    closeModals() {
        const modals = document.querySelectorAll('.video-modal.active, .keyboard-help-modal');
        modals.forEach(modal => {
            if (modal.classList.contains('video-modal')) {
                if (window.closeVideoModal) window.closeVideoModal();
            } else {
                modal.remove();
            }
        });
    }

    toggleTheme() {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        
        // Update gradient colors for theme
        if (this.gradientOverlay) {
            const colors = isDark ? 
                'rgba(0, 255, 136, 0.3), rgba(59, 130, 246, 0.2)' :
                'rgba(0, 0, 0, 0.1), rgba(59, 130, 246, 0.05)';
            
            // Will update on next animation frame
        }
    }

    // Public API
    enable() {
        if (!this.isDesktop) return;
        
        document.documentElement.classList.add('premium-desktop-active');
        this.startAnimationLoop();
    }

    disable() {
        document.documentElement.classList.remove('premium-desktop-active');
        
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    destroy() {
        this.disable();
        
        // Cleanup
        if (this.gradientOverlay) this.gradientOverlay.remove();
        if (this.customCursor) this.customCursor.remove();
        
        // Remove enhancements
        document.querySelectorAll('.premium-hover-overlay').forEach(el => el.remove());
        document.querySelectorAll('[data-hover-enhanced]').forEach(el => {
            el.removeAttribute('data-hover-enhanced');
        });
    }

    // Static factory
    static create(options = {}) {
        return new PremiumDesktopExperience(options);
    }
}

// Add required CSS
const premiumDesktopCSS = document.createElement('style');
premiumDesktopCSS.textContent = `
    /* Premium Desktop Experience Styles */
    .premium-desktop-active {
        --cursor-color: #00ff88;
        --focus-ring: 0 0 0 2px rgba(0, 255, 136, 0.5);
    }
    
    /* Custom Cursor */
    .premium-cursor {
        border: 2px solid var(--cursor-color);
        background: rgba(0, 255, 136, 0.1);
    }
    
    /* Keyboard Feedback */
    @keyframes keyboardPulse {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes keyboardFadeOut {
        to { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
    }
    
    /* Keyboard Help Modal */
    .keyboard-help-content {
        background: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 30px;
        border-radius: 16px;
        max-width: 500px;
        width: 90vw;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .keyboard-help-content h3 {
        margin: 0 0 20px 0;
        color: #00ff88;
        font-size: 1.5rem;
        text-align: center;
    }
    
    .shortcuts-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 20px;
    }
    
    .shortcut {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .shortcut kbd {
        background: rgba(255, 255, 255, 0.1);
        padding: 4px 8px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 12px;
        min-width: 24px;
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .shortcut span {
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
    }
    
    .close-help {
        width: 100%;
        background: #00ff88;
        color: black;
        border: none;
        padding: 12px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .close-help:hover {
        background: #00cc6a;
        transform: translateY(-1px);
    }
    
    /* Skip Links */
    .skip-links {
        position: fixed;
        top: -100px;
        left: 0;
        z-index: 10001;
    }
    
    .skip-link {
        position: absolute;
        top: 0;
        left: 0;
        background: #00ff88;
        color: black;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 0 0 8px 0;
        font-weight: 600;
        transition: top 0.3s ease;
    }
    
    .skip-link:focus {
        top: 100px;
    }
    
    /* Enhanced Hover Effects */
    [data-hover-enhanced] {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Magnetic Buttons */
    .btn-magnetic {
        transition: transform 0.1s ease;
    }
    
    .btn-magnetic::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        background: radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(255, 255, 255, 0.1) 0%,
            transparent 50%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }
    
    .btn-magnetic:hover::before {
        opacity: 1;
    }
    
    /* High DPI Optimizations */
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
        .high-dpi .premium-hover-overlay {
            transform: translateZ(0);
        }
        
        .high-dpi .mouse-gradient-overlay {
            transform: translateZ(0);
        }
    }
    
    /* Performance Mode */
    .performance-mode * {
        animation-duration: 0.15s !important;
        transition-duration: 0.15s !important;
    }
    
    /* Battery Mode */
    .battery-mode .mouse-gradient-overlay {
        display: none;
    }
    
    .battery-mode .premium-hover-overlay {
        opacity: 0.5 !important;
    }
    
    /* Accessibility */
    .premium-desktop-active [tabindex="-1"]:focus {
        outline: none;
    }
    
    .premium-desktop-active :focus {
        outline: 2px solid var(--cursor-color);
        outline-offset: 2px;
    }
    
    /* Smooth Transitions */
    * {
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Reduced Motion Support */
    @media (prefers-reduced-motion: reduce) {
        .premium-desktop-active * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        .mouse-gradient-overlay {
            display: none;
        }
    }
`;

document.head.appendChild(premiumDesktopCSS);

// Auto-initialize on desktop
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.innerWidth > 1024) {
            window.premiumDesktop = PremiumDesktopExperience.create();
        }
    });
} else {
    if (window.innerWidth > 1024) {
        window.premiumDesktop = PremiumDesktopExperience.create();
    }
}

// Global access
window.PremiumDesktopExperience = PremiumDesktopExperience;