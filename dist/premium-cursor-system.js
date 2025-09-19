/**
 * PREMIUM CURSOR SYSTEM - CONTEXT-AWARE ANIMATIONS
 * Custom cursor with smart context detection and smooth animations
 * Apple-level cursor interactions with performance optimizations
 */

class PremiumCursorSystem {
    constructor(options = {}) {
        this.options = {
            // Cursor appearance
            size: 24,
            color: '#00ff88',
            blendMode: 'difference',
            borderWidth: 2,
            
            // Animations
            followSpeed: 0.15,
            scaleSpeed: 0.2,
            morphSpeed: 0.3,
            
            // Context states
            contextDetection: true,
            magneticEffect: true,
            trailEffect: false,
            
            // Performance
            throttleMs: 16,
            highDPIOptimized: true,
            batterySaver: false,
            
            ...options
        };

        // State
        this.isActive = false;
        this.mouse = { x: 0, y: 0 };
        this.cursor = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.currentContext = 'default';
        this.isPressed = false;
        
        // Elements
        this.cursorElement = null;
        this.dotElement = null;
        this.trailElements = [];
        
        // Performance
        this.rafId = null;
        this.lastFrame = 0;
        
        // Context detection
        this.contexts = new Map();
        this.setupContexts();
        
        // Only initialize on desktop
        if (window.innerWidth > 1024 && !('ontouchstart' in window)) {
            this.init();
        }
    }

    init() {
        console.log('🎯 Premium Cursor System initializing...');
        
        this.createCursor();
        this.setupContextDetection();
        this.bindEvents();
        this.startAnimation();
        
        document.documentElement.classList.add('premium-cursor-active');
        console.log('✨ Premium Cursor System activated');
    }

    setupContexts() {
        // Define cursor contexts and their styles
        this.contexts.set('default', {
            size: 24,
            color: '#00ff88',
            borderWidth: 2,
            scale: 1,
            opacity: 1,
            blendMode: 'difference'
        });

        this.contexts.set('button', {
            size: 48,
            color: '#fbbf24',
            borderWidth: 3,
            scale: 1.2,
            opacity: 0.8,
            blendMode: 'difference',
            magnetic: true
        });

        this.contexts.set('link', {
            size: 32,
            color: '#3b82f6',
            borderWidth: 2,
            scale: 1.1,
            opacity: 0.9,
            blendMode: 'difference',
            magnetic: true
        });

        this.contexts.set('text', {
            size: 2,
            color: '#ffffff',
            borderWidth: 1,
            scale: 1,
            opacity: 1,
            blendMode: 'normal',
            shape: 'line'
        });

        this.contexts.set('image', {
            size: 60,
            color: '#8b5cf6',
            borderWidth: 4,
            scale: 1.5,
            opacity: 0.6,
            blendMode: 'multiply',
            magnetic: true
        });

        this.contexts.set('video', {
            size: 80,
            color: '#ef4444',
            borderWidth: 4,
            scale: 1.8,
            opacity: 0.7,
            blendMode: 'screen',
            magnetic: true,
            pulse: true
        });

        this.contexts.set('disabled', {
            size: 20,
            color: '#6b7280',
            borderWidth: 1,
            scale: 0.8,
            opacity: 0.5,
            blendMode: 'normal'
        });
    }

    createCursor() {
        // Main cursor container
        this.cursorElement = document.createElement('div');
        this.cursorElement.className = 'premium-cursor-main';
        this.cursorElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: ${this.options.size}px;
            height: ${this.options.size}px;
            border: ${this.options.borderWidth}px solid ${this.options.color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            mix-blend-mode: ${this.options.blendMode};
            transform: translate(-50%, -50%);
            transition: all 0.1s ease;
            opacity: 0;
        `;

        // Inner dot
        this.dotElement = document.createElement('div');
        this.dotElement.className = 'premium-cursor-dot';
        this.dotElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 4px;
            height: 4px;
            background: ${this.options.color};
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.2s ease;
        `;

        this.cursorElement.appendChild(this.dotElement);
        document.body.appendChild(this.cursorElement);

        // Trail effect if enabled
        if (this.options.trailEffect) {
            this.createTrail();
        }

        // Hide default cursor
        document.documentElement.style.cursor = 'none';
    }

    createTrail() {
        for (let i = 0; i < 8; i++) {
            const trailElement = document.createElement('div');
            trailElement.className = 'premium-cursor-trail';
            trailElement.style.cssText = `
                position: fixed;
                width: ${this.options.size * (0.8 - i * 0.1)}px;
                height: ${this.options.size * (0.8 - i * 0.1)}px;
                border: 1px solid ${this.options.color};
                border-radius: 50%;
                pointer-events: none;
                z-index: ${9999 - i};
                mix-blend-mode: ${this.options.blendMode};
                opacity: ${0.5 - i * 0.05};
                transform: translate(-50%, -50%);
                transition: all 0.1s ease;
            `;
            
            document.body.appendChild(trailElement);
            this.trailElements.push({
                element: trailElement,
                x: 0,
                y: 0,
                delay: i * 2
            });
        }
    }

    setupContextDetection() {
        if (!this.options.contextDetection) return;

        // Setup context detection for different element types
        const contextSelectors = {
            'button': 'button, .btn, [role="button"], input[type="submit"], input[type="button"]',
            'link': 'a[href], [role="link"]',
            'text': 'input[type="text"], input[type="email"], textarea, [contenteditable], p, h1, h2, h3, h4, h5, h6, span',
            'image': 'img, picture, [role="img"], .image, .photo',
            'video': 'video, .video-container, .video-modal-content, .video-mini-preview',
            'disabled': '[disabled], .disabled, [aria-disabled="true"]'
        };

        // Add event listeners for each context
        Object.entries(contextSelectors).forEach(([context, selector]) => {
            document.addEventListener('mouseover', (e) => {
                if (e.target.matches(selector)) {
                    this.setContext(context, e.target);
                }
            });

            document.addEventListener('mouseout', (e) => {
                if (e.target.matches(selector)) {
                    this.setContext('default');
                }
            });
        });

        // Special handling for form elements
        document.addEventListener('focus', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.setContext('text', e.target);
            }
        });

        document.addEventListener('blur', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.setContext('default');
            }
        });
    }

    bindEvents() {
        // Mouse movement with throttling
        let moveThrottle = null;
        document.addEventListener('mousemove', (e) => {
            if (moveThrottle) return;
            
            moveThrottle = setTimeout(() => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                
                // Show cursor if hidden
                if (this.cursorElement.style.opacity === '0') {
                    this.cursorElement.style.opacity = '1';
                }
                
                moveThrottle = null;
            }, this.options.throttleMs);
        });

        // Mouse press states
        document.addEventListener('mousedown', () => {
            this.isPressed = true;
            this.cursorElement.style.transform = 'translate(-50%, -50%) scale(0.8)';
            this.dotElement.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });

        document.addEventListener('mouseup', () => {
            this.isPressed = false;
            this.cursorElement.style.transform = 'translate(-50%, -50%) scale(1)';
            this.dotElement.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursorElement.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursorElement.style.opacity = '1';
        });

        // Handle fullscreen changes
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                this.cursorElement.style.zIndex = '2147483647';
            } else {
                this.cursorElement.style.zIndex = '10000';
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.setContext('default');
            }
        });
    }

    setContext(contextName, targetElement = null) {
        if (this.currentContext === contextName) return;

        const context = this.contexts.get(contextName) || this.contexts.get('default');
        this.currentContext = contextName;

        // Apply context styles with smooth transitions
        this.cursorElement.style.width = `${context.size}px`;
        this.cursorElement.style.height = `${context.size}px`;
        this.cursorElement.style.borderColor = context.color;
        this.cursorElement.style.borderWidth = `${context.borderWidth}px`;
        this.cursorElement.style.opacity = context.opacity;
        this.cursorElement.style.mixBlendMode = context.blendMode;

        // Update dot
        this.dotElement.style.background = context.color;

        // Handle special shapes
        if (context.shape === 'line') {
            this.cursorElement.style.borderRadius = '0';
            this.cursorElement.style.width = '2px';
            this.cursorElement.style.height = '20px';
            this.dotElement.style.display = 'none';
        } else {
            this.cursorElement.style.borderRadius = '50%';
            this.dotElement.style.display = 'block';
        }

        // Handle pulse effect
        if (context.pulse) {
            this.cursorElement.classList.add('cursor-pulse');
        } else {
            this.cursorElement.classList.remove('cursor-pulse');
        }

        // Magnetic effect
        if (context.magnetic && targetElement && this.options.magneticEffect) {
            this.startMagneticEffect(targetElement);
        } else {
            this.stopMagneticEffect();
        }

        // Context-specific animations
        this.triggerContextAnimation(contextName);
    }

    startMagneticEffect(targetElement) {
        this.magneticTarget = targetElement;
        this.magneticActive = true;
    }

    stopMagneticEffect() {
        this.magneticTarget = null;
        this.magneticActive = false;
    }

    triggerContextAnimation(contextName) {
        // Add context-specific entrance animations
        const animations = {
            'button': 'cursorButtonEnter 0.3s ease',
            'video': 'cursorVideoEnter 0.4s ease',
            'image': 'cursorImageEnter 0.3s ease',
            'disabled': 'cursorDisabledEnter 0.2s ease'
        };

        if (animations[contextName]) {
            this.cursorElement.style.animation = animations[contextName];
            setTimeout(() => {
                this.cursorElement.style.animation = '';
            }, 500);
        }
    }

    startAnimation() {
        const animate = (timestamp) => {
            const deltaTime = timestamp - this.lastFrame;
            this.lastFrame = timestamp;

            this.updateCursorPosition(deltaTime);
            
            if (this.options.trailEffect) {
                this.updateTrail();
            }

            this.rafId = requestAnimationFrame(animate);
        };

        this.rafId = requestAnimationFrame(animate);
    }

    updateCursorPosition(deltaTime) {
        // Smooth following with easing
        const followSpeed = this.options.followSpeed;
        
        // Calculate target position
        let targetX = this.mouse.x;
        let targetY = this.mouse.y;

        // Apply magnetic effect
        if (this.magneticActive && this.magneticTarget) {
            const rect = this.magneticTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(this.mouse.x - centerX, 2) + 
                Math.pow(this.mouse.y - centerY, 2)
            );
            
            if (distance < 100) {
                const magnetStrength = 1 - (distance / 100);
                targetX += (centerX - this.mouse.x) * magnetStrength * 0.3;
                targetY += (centerY - this.mouse.y) * magnetStrength * 0.3;
            }
        }

        // Smooth interpolation
        this.cursor.x += (targetX - this.cursor.x) * followSpeed;
        this.cursor.y += (targetY - this.cursor.y) * followSpeed;

        // Calculate velocity for effects
        this.velocity.x = this.cursor.x - this.cursorElement.offsetLeft;
        this.velocity.y = this.cursor.y - this.cursorElement.offsetTop;

        // Apply position
        this.cursorElement.style.left = `${this.cursor.x}px`;
        this.cursorElement.style.top = `${this.cursor.y}px`;

        // Apply velocity-based rotation for movement feedback
        const velocityMagnitude = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (velocityMagnitude > 1) {
            const rotation = Math.atan2(this.velocity.y, this.velocity.x) * (180 / Math.PI);
            this.dotElement.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scaleX(${1 + velocityMagnitude * 0.01})`;
        }
    }

    updateTrail() {
        this.trailElements.forEach((trail, index) => {
            const delay = trail.delay;
            const targetX = index === 0 ? this.cursor.x : this.trailElements[index - 1].x;
            const targetY = index === 0 ? this.cursor.y : this.trailElements[index - 1].y;

            trail.x += (targetX - trail.x) * (this.options.followSpeed * 0.5);
            trail.y += (targetY - trail.y) * (this.options.followSpeed * 0.5);

            trail.element.style.left = `${trail.x}px`;
            trail.element.style.top = `${trail.y}px`;
        });
    }

    // Public API
    enable() {
        if (this.isActive) return;
        
        this.isActive = true;
        document.documentElement.classList.add('premium-cursor-active');
        document.documentElement.style.cursor = 'none';
        
        if (this.cursorElement) {
            this.cursorElement.style.display = 'block';
        }
        
        if (!this.rafId) {
            this.startAnimation();
        }
    }

    disable() {
        if (!this.isActive) return;
        
        this.isActive = false;
        document.documentElement.classList.remove('premium-cursor-active');
        document.documentElement.style.cursor = 'auto';
        
        if (this.cursorElement) {
            this.cursorElement.style.display = 'none';
        }
        
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        
        // Apply changes to existing cursor
        if (this.cursorElement) {
            this.cursorElement.style.borderColor = this.options.color;
            this.cursorElement.style.mixBlendMode = this.options.blendMode;
            this.dotElement.style.background = this.options.color;
        }
    }

    destroy() {
        this.disable();
        
        if (this.cursorElement) {
            this.cursorElement.remove();
        }
        
        this.trailElements.forEach(trail => trail.element.remove());
        this.trailElements = [];
        
        document.documentElement.style.cursor = '';
    }

    // Static factory
    static create(options = {}) {
        return new PremiumCursorSystem(options);
    }
}

// Add cursor-specific CSS animations
const cursorAnimationsCSS = document.createElement('style');
cursorAnimationsCSS.textContent = `
    /* Cursor Pulse Animation */
    .cursor-pulse {
        animation: cursorPulse 1.5s ease-in-out infinite;
    }
    
    @keyframes cursorPulse {
        0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        50% { 
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.7;
        }
    }
    
    /* Context Enter Animations */
    @keyframes cursorButtonEnter {
        0% { 
            transform: translate(-50%, -50%) scale(0.5) rotate(180deg);
            opacity: 0;
        }
        100% { 
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
        }
    }
    
    @keyframes cursorVideoEnter {
        0% { 
            transform: translate(-50%, -50%) scale(0.3);
            border-radius: 0%;
        }
        50% { 
            transform: translate(-50%, -50%) scale(1.5);
            border-radius: 25%;
        }
        100% { 
            transform: translate(-50%, -50%) scale(1);
            border-radius: 50%;
        }
    }
    
    @keyframes cursorImageEnter {
        0% { 
            transform: translate(-50%, -50%) scale(2) rotate(-90deg);
            opacity: 0;
        }
        100% { 
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
        }
    }
    
    @keyframes cursorDisabledEnter {
        0% { 
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0;
        }
        100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
        }
    }
    
    /* Hide default cursor when premium is active */
    .premium-cursor-active * {
        cursor: none !important;
    }
    
    /* Exception for text inputs when focused */
    .premium-cursor-active input:focus,
    .premium-cursor-active textarea:focus,
    .premium-cursor-active [contenteditable]:focus {
        cursor: text !important;
    }
`;

document.head.appendChild(cursorAnimationsCSS);

// Auto-initialize on desktop
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.innerWidth > 1024 && !('ontouchstart' in window)) {
            window.premiumCursor = PremiumCursorSystem.create();
        }
    });
} else {
    if (window.innerWidth > 1024 && !('ontouchstart' in window)) {
        window.premiumCursor = PremiumCursorSystem.create();
    }
}

// Global access
window.PremiumCursorSystem = PremiumCursorSystem;