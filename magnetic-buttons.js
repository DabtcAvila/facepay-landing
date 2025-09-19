/**
 * ==========================================================================
 * MAGNETIC BUTTON INTERACTIONS - DELICIOSAS
 * Premium physics-based button interactions with Apple-style smoothness
 * Technology: GSAP, Custom mouse tracking, 60fps performance, Battery optimized
 * ==========================================================================
 */

class MagneticButtons {
    constructor(options = {}) {
        this.config = {
            // Mouse tracking
            magneticRadius: options.magneticRadius || 120,
            magneticStrength: options.magneticStrength || 0.4,
            
            // Physics
            dampening: options.dampening || 0.75,
            mass: options.mass || 1,
            stiffness: options.stiffness || 0.15,
            
            // Performance
            throttleFPS: options.throttleFPS || 60,
            batteryOptimized: options.batteryOptimized || true,
            
            // Ripple effects
            rippleDuration: options.rippleDuration || 600,
            rippleScale: options.rippleScale || 2.5,
            
            // Touch feedback
            touchFeedback: options.touchFeedback || true,
            touchScale: options.touchScale || 0.95,
            
            // Selectors
            buttonSelector: options.buttonSelector || '.btn',
            magneticSelector: options.magneticSelector || '.btn-magnetic'
        };

        // State management
        this.mouse = { x: 0, y: 0, moving: false };
        this.buttons = new Map();
        this.rafId = null;
        this.isHighPerformance = this.detectPerformance();
        this.lastFrame = 0;
        this.frameInterval = 1000 / this.config.throttleFPS;

        // Initialize
        this.init();
    }

    /**
     * Detect device performance capabilities
     */
    detectPerformance() {
        const hasGoodCPU = navigator.hardwareConcurrency >= 4;
        const hasGoodMemory = navigator.deviceMemory >= 4;
        const hasGoodConnection = !navigator.connection || 
            (navigator.connection.effectiveType !== 'slow-2g' && 
             navigator.connection.effectiveType !== '2g');
        
        return hasGoodCPU && hasGoodMemory && hasGoodConnection;
    }

    /**
     * Initialize the magnetic button system
     */
    init() {
        // Load GSAP if not already loaded
        this.loadGSAP().then(() => {
            this.setupEventListeners();
            this.discoverButtons();
            this.startAnimationLoop();
            
            console.log('🧲 Magnetic buttons initialized:', {
                buttons: this.buttons.size,
                performance: this.isHighPerformance ? 'high' : 'optimized',
                fps: this.config.throttleFPS
            });
        });
    }

    /**
     * Load GSAP library
     */
    async loadGSAP() {
        if (window.gsap) return Promise.resolve();
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Mouse tracking with throttling
        let mouseMoveThrottle;
        document.addEventListener('mousemove', (e) => {
            if (mouseMoveThrottle) return;
            
            mouseMoveThrottle = setTimeout(() => {
                this.updateMousePosition(e);
                mouseMoveThrottle = null;
            }, 1000 / this.config.throttleFPS);
        });

        // Touch events
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        
        // Performance monitoring
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });

        // Battery optimization
        if (this.config.batteryOptimized && navigator.getBattery) {
            navigator.getBattery().then(battery => {
                battery.addEventListener('levelchange', () => {
                    if (battery.level < 0.2) {
                        this.config.throttleFPS = 30;
                        this.frameInterval = 1000 / 30;
                    }
                });
            });
        }

        // Resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    /**
     * Discover and initialize buttons
     */
    discoverButtons() {
        // Find all buttons
        const buttons = document.querySelectorAll(this.config.buttonSelector);
        
        buttons.forEach(button => {
            this.initButton(button);
        });

        // Watch for dynamically added buttons
        if (window.MutationObserver) {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            const newButtons = node.querySelectorAll ? 
                                node.querySelectorAll(this.config.buttonSelector) : [];
                            newButtons.forEach(button => this.initButton(button));
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    /**
     * Initialize individual button
     */
    initButton(button) {
        if (this.buttons.has(button)) return;

        const rect = button.getBoundingClientRect();
        const buttonData = {
            element: button,
            bounds: rect,
            center: {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            },
            physics: {
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                targetX: 0,
                targetY: 0
            },
            isMagnetic: button.matches(this.config.magneticSelector) || 
                       button.hasAttribute('data-magnetic'),
            isHovered: false,
            ripples: []
        };

        // Add button-specific event listeners
        button.addEventListener('click', (e) => this.handleClick(e, buttonData));
        button.addEventListener('mouseenter', () => this.handleMouseEnter(buttonData));
        button.addEventListener('mouseleave', () => this.handleMouseLeave(buttonData));

        // Store button data
        this.buttons.set(button, buttonData);

        // Apply initial styles
        this.applyInitialStyles(button);
    }

    /**
     * Apply initial button styles for magnetic interactions
     */
    applyInitialStyles(button) {
        gsap.set(button, {
            transformOrigin: 'center center',
            willChange: 'transform'
        });

        // Add magnetic indicator if requested
        if (button.hasAttribute('data-magnetic-indicator')) {
            button.style.position = 'relative';
            button.style.overflow = 'visible';
        }
    }

    /**
     * Update mouse position
     */
    updateMousePosition(event) {
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
        this.mouse.moving = true;

        // Stop movement detection after delay
        clearTimeout(this.mouse.stopTimer);
        this.mouse.stopTimer = setTimeout(() => {
            this.mouse.moving = false;
        }, 100);
    }

    /**
     * Handle touch start
     */
    handleTouchStart(event) {
        if (!this.config.touchFeedback) return;

        const touch = event.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const button = element?.closest(this.config.buttonSelector);
        
        if (button && this.buttons.has(button)) {
            const buttonData = this.buttons.get(button);
            this.applyTouchFeedback(buttonData, true);
        }
    }

    /**
     * Handle touch end
     */
    handleTouchEnd(event) {
        if (!this.config.touchFeedback) return;

        // Find all buttons that might have touch feedback applied
        this.buttons.forEach(buttonData => {
            this.applyTouchFeedback(buttonData, false);
        });
    }

    /**
     * Apply touch feedback animation
     */
    applyTouchFeedback(buttonData, isPressed) {
        if (!this.isHighPerformance) return;

        const scale = isPressed ? this.config.touchScale : 1;
        const duration = isPressed ? 0.1 : 0.3;

        gsap.to(buttonData.element, {
            scale: scale,
            duration: duration,
            ease: isPressed ? 'power2.out' : 'elastic.out(1, 0.5)'
        });
    }

    /**
     * Handle button click with ripple effect
     */
    handleClick(event, buttonData) {
        if (!this.isHighPerformance) return;

        this.createRippleEffect(event, buttonData);
        
        // Analytics tracking
        if (window.gtag) {
            gtag('event', 'magnetic_button_click', {
                button_text: buttonData.element.textContent.trim().substring(0, 50)
            });
        }
    }

    /**
     * Create premium ripple effect
     */
    createRippleEffect(event, buttonData) {
        const button = buttonData.element;
        const rect = button.getBoundingClientRect();
        
        // Calculate click position relative to button
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        // Create ripple element
        const ripple = document.createElement('div');
        ripple.className = 'magnetic-ripple';
        
        // Ripple styles
        Object.assign(ripple.style, {
            position: 'absolute',
            left: `${x * 100}%`,
            top: `${y * 100}%`,
            width: '4px',
            height: '4px',
            background: `radial-gradient(circle, 
                rgba(255, 255, 255, 0.6) 0%, 
                rgba(255, 255, 255, 0.4) 30%, 
                rgba(255, 255, 255, 0.1) 70%, 
                transparent 100%)`,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%) scale(0)',
            pointerEvents: 'none',
            zIndex: '1000'
        });

        button.appendChild(ripple);

        // Animate ripple
        const tl = gsap.timeline({
            onComplete: () => {
                ripple.remove();
                const index = buttonData.ripples.indexOf(tl);
                if (index > -1) buttonData.ripples.splice(index, 1);
            }
        });

        tl.to(ripple, {
            scale: this.config.rippleScale * Math.max(rect.width, rect.height) / 4,
            opacity: 0,
            duration: this.config.rippleDuration / 1000,
            ease: 'power2.out'
        });

        buttonData.ripples.push(tl);
    }

    /**
     * Handle mouse enter
     */
    handleMouseEnter(buttonData) {
        buttonData.isHovered = true;
        
        if (this.isHighPerformance) {
            gsap.to(buttonData.element, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }

    /**
     * Handle mouse leave
     */
    handleMouseLeave(buttonData) {
        buttonData.isHovered = false;
        
        // Reset button position and scale
        gsap.to(buttonData.element, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'elastic.out(1, 0.7)'
        });

        // Reset physics
        buttonData.physics = {
            x: 0, y: 0, vx: 0, vy: 0, targetX: 0, targetY: 0
        };
    }

    /**
     * Main animation loop
     */
    startAnimationLoop() {
        const animate = (timestamp) => {
            // Throttle frame rate
            if (timestamp - this.lastFrame < this.frameInterval) {
                this.rafId = requestAnimationFrame(animate);
                return;
            }
            this.lastFrame = timestamp;

            this.updateMagneticEffects();
            this.rafId = requestAnimationFrame(animate);
        };

        this.rafId = requestAnimationFrame(animate);
    }

    /**
     * Update magnetic effects for all buttons
     */
    updateMagneticEffects() {
        if (!this.mouse.moving || !this.isHighPerformance) return;

        this.buttons.forEach(buttonData => {
            if (!buttonData.isMagnetic) return;
            
            this.updateButtonPhysics(buttonData);
        });
    }

    /**
     * Update individual button physics
     */
    updateButtonPhysics(buttonData) {
        // Update button bounds if needed
        this.updateButtonBounds(buttonData);

        // Calculate distance to mouse
        const dx = this.mouse.x - buttonData.center.x;
        const dy = this.mouse.y - buttonData.center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Apply magnetic effect if within radius
        if (distance < this.config.magneticRadius) {
            const force = (1 - distance / this.config.magneticRadius) * this.config.magneticStrength;
            
            // Apply force with direction
            buttonData.physics.targetX = dx * force;
            buttonData.physics.targetY = dy * force;
        } else {
            // Return to center when outside radius
            buttonData.physics.targetX = 0;
            buttonData.physics.targetY = 0;
        }

        // Apply physics simulation
        this.applyPhysics(buttonData);
        
        // Apply transform if position changed
        if (Math.abs(buttonData.physics.x) > 0.1 || Math.abs(buttonData.physics.y) > 0.1) {
            gsap.set(buttonData.element, {
                x: buttonData.physics.x,
                y: buttonData.physics.y
            });
        }
    }

    /**
     * Apply physics simulation (spring physics)
     */
    applyPhysics(buttonData) {
        const { physics } = buttonData;
        const { stiffness, dampening, mass } = this.config;

        // Calculate forces
        const springForceX = (physics.targetX - physics.x) * stiffness;
        const springForceY = (physics.targetY - physics.y) * stiffness;
        
        // Apply dampening
        physics.vx = (physics.vx + springForceX / mass) * dampening;
        physics.vy = (physics.vy + springForceY / mass) * dampening;
        
        // Update position
        physics.x += physics.vx;
        physics.y += physics.vy;

        // Stop very small movements
        if (Math.abs(physics.vx) < 0.01) physics.vx = 0;
        if (Math.abs(physics.vy) < 0.01) physics.vy = 0;
        if (Math.abs(physics.x) < 0.01) physics.x = 0;
        if (Math.abs(physics.y) < 0.01) physics.y = 0;
    }

    /**
     * Update button bounds (efficient caching)
     */
    updateButtonBounds(buttonData) {
        // Only update bounds occasionally for performance
        if (!buttonData.boundsUpdateTime || 
            Date.now() - buttonData.boundsUpdateTime > 1000) {
            
            const rect = buttonData.element.getBoundingClientRect();
            buttonData.bounds = rect;
            buttonData.center = {
                x: rect.left + rect.width / 2 + window.scrollX,
                y: rect.top + rect.height / 2 + window.scrollY
            };
            buttonData.boundsUpdateTime = Date.now();
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Force bounds update for all buttons
        this.buttons.forEach(buttonData => {
            buttonData.boundsUpdateTime = 0;
        });
    }

    /**
     * Pause animations (for performance)
     */
    pause() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    /**
     * Resume animations
     */
    resume() {
        if (!this.rafId) {
            this.startAnimationLoop();
        }
    }

    /**
     * Add magnetic behavior to specific button
     */
    addMagneticButton(selector) {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(button => {
            if (this.buttons.has(button)) {
                this.buttons.get(button).isMagnetic = true;
            } else {
                button.setAttribute('data-magnetic', 'true');
                this.initButton(button);
            }
        });
    }

    /**
     * Remove magnetic behavior from specific button
     */
    removeMagneticButton(selector) {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(button => {
            if (this.buttons.has(button)) {
                this.buttons.get(button).isMagnetic = false;
                gsap.set(button, { x: 0, y: 0, scale: 1 });
            }
        });
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.frameInterval = 1000 / this.config.throttleFPS;
    }

    /**
     * Get performance stats
     */
    getStats() {
        return {
            buttonsCount: this.buttons.size,
            magneticButtonsCount: Array.from(this.buttons.values())
                .filter(b => b.isMagnetic).length,
            isHighPerformance: this.isHighPerformance,
            fps: this.config.throttleFPS,
            mouse: this.mouse
        };
    }

    /**
     * Destroy the magnetic button system
     */
    destroy() {
        // Cancel animation loop
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }

        // Clean up button data
        this.buttons.forEach(buttonData => {
            // Kill any running ripple animations
            buttonData.ripples.forEach(tl => tl.kill());
            
            // Reset button transform
            gsap.set(buttonData.element, {
                x: 0, y: 0, scale: 1, clearProps: 'all'
            });
            
            // Remove ripple elements
            buttonData.element.querySelectorAll('.magnetic-ripple')
                .forEach(ripple => ripple.remove());
        });

        this.buttons.clear();
        
        console.log('🧲 Magnetic buttons destroyed');
    }
}

/**
 * ==========================================================================
 * CSS STYLES FOR MAGNETIC BUTTONS
 * ==========================================================================
 */
const magneticButtonsCSS = `
    /* Base magnetic button styles */
    .btn-magnetic {
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.1s ease-out;
        cursor: pointer;
    }
    
    /* Magnetic indicator (optional) */
    .btn-magnetic[data-magnetic-indicator]::before {
        content: '';
        position: absolute;
        inset: -8px;
        border: 1px dashed rgba(0, 255, 136, 0.3);
        border-radius: inherit;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: -1;
    }
    
    .btn-magnetic[data-magnetic-indicator]:hover::before {
        opacity: 1;
        animation: magneticPulse 2s infinite;
    }
    
    @keyframes magneticPulse {
        0%, 100% { 
            transform: scale(1);
            opacity: 0.3;
        }
        50% { 
            transform: scale(1.05);
            opacity: 0.6;
        }
    }
    
    /* Ripple effects */
    .magnetic-ripple {
        border-radius: 50%;
        position: absolute;
        transform: scale(0);
        animation: ripple 0.6s linear;
    }
    
    /* Enhanced hover states for magnetic buttons */
    .btn-magnetic:hover {
        z-index: 10;
        box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.2),
            0 0 20px rgba(0, 255, 136, 0.3);
    }
    
    /* Performance optimizations */
    .btn-magnetic {
        will-change: transform;
        backface-visibility: hidden;
        perspective: 1000px;
    }
    
    /* Reduce motion support */
    @media (prefers-reduced-motion: reduce) {
        .btn-magnetic {
            transform: none !important;
            transition: none !important;
        }
        
        .btn-magnetic[data-magnetic-indicator]::before {
            animation: none !important;
        }
        
        .magnetic-ripple {
            display: none !important;
        }
    }
    
    /* Battery optimization styles */
    .magnetic-reduced-performance .btn-magnetic {
        transition: transform 0.3s ease;
    }
    
    .magnetic-reduced-performance .magnetic-ripple {
        display: none;
    }
`;

/**
 * ==========================================================================
 * AUTO INITIALIZATION AND UTILITIES
 * ==========================================================================
 */

// Auto-initialize when DOM is ready
let magneticButtonsInstance;

function initMagneticButtons(options = {}) {
    // Inject CSS if not already present
    if (!document.querySelector('#magnetic-buttons-css')) {
        const style = document.createElement('style');
        style.id = 'magnetic-buttons-css';
        style.textContent = magneticButtonsCSS;
        document.head.appendChild(style);
    }
    
    // Initialize magnetic buttons
    if (!magneticButtonsInstance) {
        magneticButtonsInstance = new MagneticButtons(options);
    }
    
    return magneticButtonsInstance;
}

// Auto-initialize with default options
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => initMagneticButtons(), 100);
    });
} else {
    setTimeout(() => initMagneticButtons(), 100);
}

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MagneticButtons, initMagneticButtons };
} else {
    window.MagneticButtons = MagneticButtons;
    window.initMagneticButtons = initMagneticButtons;
}

/**
 * ==========================================================================
 * USAGE EXAMPLES
 * ==========================================================================
 */

/*
// Basic usage - auto-initialized

// Manual initialization with custom options
const magneticButtons = initMagneticButtons({
    magneticRadius: 150,
    magneticStrength: 0.6,
    rippleScale: 3,
    throttleFPS: 120
});

// Add magnetic behavior to specific buttons
magneticButtons.addMagneticButton('.btn-primary');

// HTML usage
<button class="btn btn-primary btn-magnetic">Magnetic Button</button>
<button class="btn btn-ghost btn-magnetic" data-magnetic-indicator>With Indicator</button>

// Performance monitoring
console.log('Magnetic Buttons Stats:', magneticButtons.getStats());

// Cleanup when needed
magneticButtons.destroy();
*/