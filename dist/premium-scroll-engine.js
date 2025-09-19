/**
 * PREMIUM SCROLL ENGINE - STRIPE/LINEAR LEVEL EXPERIENCE
 * Butter-smooth momentum physics with section snapping, parallax, and animations
 * Battery-efficient, touch-optimized, zero-lag premium experience
 */

class PremiumScrollEngine {
    constructor(options = {}) {
        this.options = {
            // Physics settings
            friction: 0.85,          // Momentum friction (0-1, lower = more momentum)
            lerp: 0.08,             // Smoothing interpolation (0-1, lower = smoother)
            velocityThreshold: 0.1,  // Stop threshold for momentum
            
            // Section snapping
            snapSections: true,
            snapThreshold: 0.3,      // Snap trigger threshold
            snapDuration: 1200,      // Snap animation duration
            
            // Mobile/Touch
            touchMultiplier: 2.0,    // Touch scroll sensitivity
            mobileOptimized: true,   // Enable mobile optimizations
            
            // Performance
            throttleMs: 16,          // 60fps throttling
            rafOptimized: true,      // RequestAnimationFrame optimization
            batteryEfficient: true,  // Reduce animations on low battery
            
            // Features
            progressIndicator: true,
            parallaxEnabled: true,
            animationsEnabled: true,
            
            ...options
        };

        // State
        this.isScrolling = false;
        this.isDragging = false;
        this.current = 0;
        this.target = 0;
        this.velocity = 0;
        this.direction = 0;
        this.sections = [];
        this.currentSection = 0;
        
        // Touch state
        this.touchStart = { x: 0, y: 0, time: 0 };
        this.touchLast = { x: 0, y: 0, time: 0 };
        this.isTouch = false;
        
        // Performance monitoring
        this.frameCount = 0;
        this.lastFpsCheck = performance.now();
        this.currentFps = 60;
        
        // Elements
        this.container = document.querySelector('[data-scroll-container]') || document.body;
        this.progressBar = null;
        this.sectionDots = [];
        
        this.init();
    }

    init() {
        console.log('🚀 Premium Scroll Engine initializing...');
        
        // Setup DOM
        this.setupContainer();
        this.createProgressIndicator();
        this.createSectionDots();
        this.scanSections();
        
        // Bind events
        this.bindEvents();
        
        // Start RAF loop
        this.startRenderLoop();
        
        // Performance monitoring
        if (this.options.batteryEfficient) {
            this.startPerformanceMonitoring();
        }
        
        document.documentElement.classList.add('premium-scroll-active');
        console.log('✨ Premium Scroll Engine ready - Stripe-level experience activated');
    }

    setupContainer() {
        this.container.style.cssText = `
            transform: translateZ(0);
            will-change: transform;
            backface-visibility: hidden;
        `;
    }

    createProgressIndicator() {
        if (!this.options.progressIndicator) return;
        
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'scroll-progress-bar';
        this.progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
        document.body.appendChild(this.progressBar);
    }

    createSectionDots() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'scroll-dots-container';
        
        // Will populate after scanning sections
        document.body.appendChild(dotsContainer);
        this.dotsContainer = dotsContainer;
    }

    scanSections() {
        this.sections = Array.from(document.querySelectorAll('.section, [data-section], section'))
            .map((el, index) => ({
                element: el,
                index,
                top: el.offsetTop,
                height: el.offsetHeight,
                center: el.offsetTop + el.offsetHeight / 2,
                progress: 0,
                inView: false,
                animated: false
            }));
        
        // Create section dots
        this.sections.forEach((section, index) => {
            const dot = document.createElement('button');
            dot.className = 'scroll-dot';
            dot.setAttribute('aria-label', `Go to section ${index + 1}`);
            dot.addEventListener('click', () => this.scrollToSection(index));
            this.dotsContainer.appendChild(dot);
            this.sectionDots.push(dot);
        });
        
        console.log(`📍 Found ${this.sections.length} sections for smooth navigation`);
    }

    bindEvents() {
        // Wheel events with passive optimization
        document.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
        
        // Touch events for mobile
        document.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
        document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: true });
        
        // Keyboard navigation
        document.addEventListener('keydown', this.onKeyDown.bind(this), { passive: false });
        
        // Resize handling
        window.addEventListener('resize', this.onResize.bind(this), { passive: true });
        
        // Focus management for accessibility
        window.addEventListener('focus', this.onFocus.bind(this), { passive: true });
    }

    onWheel(e) {
        e.preventDefault();
        
        const delta = this.normalizeWheelDelta(e);
        
        // Apply momentum physics
        this.velocity += delta * 0.8;
        this.velocity = Math.max(-50, Math.min(50, this.velocity)); // Clamp velocity
        
        this.updateTarget();
        this.isScrolling = true;
    }

    normalizeWheelDelta(e) {
        let delta = 0;
        
        if (e.deltaY) {
            delta = e.deltaY;
        } else if (e.wheelDelta) {
            delta = -e.wheelDelta;
        } else if (e.detail) {
            delta = e.detail * 20;
        }
        
        // Normalize across browsers and devices
        if (Math.abs(delta) > 100) {
            delta = delta > 0 ? 100 : -100;
        }
        
        // Firefox adjustment
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            delta *= 20;
        }
        
        return delta;
    }

    onTouchStart(e) {
        this.isTouch = true;
        const touch = e.touches[0];
        
        this.touchStart = {
            x: touch.clientX,
            y: touch.clientY,
            time: performance.now()
        };
        
        this.touchLast = { ...this.touchStart };
        
        // Stop current momentum
        this.velocity = 0;
        document.documentElement.classList.add('scroll-dragging');
    }

    onTouchMove(e) {
        if (!this.isTouch) return;
        
        e.preventDefault();
        
        const touch = e.touches[0];
        const now = performance.now();
        
        const deltaY = this.touchLast.y - touch.clientY;
        const deltaTime = now - this.touchLast.time;
        
        if (deltaTime > 0) {
            const touchVelocity = deltaY / deltaTime * 16; // Normalize to 60fps
            this.velocity += touchVelocity * this.options.touchMultiplier;
        }
        
        this.touchLast = {
            x: touch.clientX,
            y: touch.clientY,
            time: now
        };
        
        this.updateTarget();
    }

    onTouchEnd(e) {
        if (!this.isTouch) return;
        
        this.isTouch = false;
        document.documentElement.classList.remove('scroll-dragging');
        
        // Apply final momentum boost
        const totalDelta = this.touchStart.y - this.touchLast.y;
        const totalTime = this.touchLast.time - this.touchStart.time;
        
        if (totalTime > 0 && totalTime < 500) { // Quick swipe
            const swipeVelocity = totalDelta / totalTime * 50;
            this.velocity += swipeVelocity;
        }
        
        // Check for section snap
        if (this.options.snapSections) {
            this.checkSectionSnap();
        }
    }

    onKeyDown(e) {
        const keyMap = {
            38: -this.getViewportHeight() / 2, // Up arrow
            40: this.getViewportHeight() / 2,  // Down arrow
            33: -this.getViewportHeight(),     // Page up
            34: this.getViewportHeight(),      // Page down
            36: -this.getScrollLimit(),        // Home
            35: this.getScrollLimit(),         // End
            32: this.getViewportHeight() / 2   // Space
        };
        
        if (keyMap[e.keyCode] !== undefined) {
            e.preventDefault();
            
            if (e.keyCode === 36 || e.keyCode === 35) {
                // Home/End - snap directly
                this.target = e.keyCode === 36 ? 0 : this.getScrollLimit();
                this.velocity = 0;
            } else {
                this.velocity += keyMap[e.keyCode] * 0.1;
            }
            
            this.updateTarget();
        }
    }

    onResize() {
        // Debounced resize handling
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.scanSections();
            this.updateScrollLimit();
        }, 250);
    }

    onFocus() {
        // Resume smooth scrolling when window regains focus
        this.startRenderLoop();
    }

    updateTarget() {
        this.target += this.velocity;
        this.target = Math.max(0, Math.min(this.target, this.getScrollLimit()));
        
        // Apply friction
        this.velocity *= this.options.friction;
        
        // Stop small movements for performance
        if (Math.abs(this.velocity) < this.options.velocityThreshold) {
            this.velocity = 0;
        }
    }

    checkSectionSnap() {
        if (!this.options.snapSections || this.velocity !== 0) return;
        
        const viewportCenter = this.current + this.getViewportHeight() / 2;
        let closestSection = 0;
        let closestDistance = Infinity;
        
        this.sections.forEach((section, index) => {
            const distance = Math.abs(section.center - viewportCenter);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = index;
            }
        });
        
        const snapThreshold = this.getViewportHeight() * this.options.snapThreshold;
        if (closestDistance < snapThreshold) {
            this.scrollToSection(closestSection, { smooth: true });
        }
    }

    startRenderLoop() {
        if (this.rafId) return; // Already running
        
        const render = () => {
            this.update();
            this.rafId = requestAnimationFrame(render);
        };
        
        render();
    }

    stopRenderLoop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    update() {
        // Performance monitoring
        this.monitorPerformance();
        
        // Skip if no movement needed
        if (Math.abs(this.current - this.target) < 0.1 && Math.abs(this.velocity) < 0.1) {
            if (this.isScrolling) {
                this.isScrolling = false;
                document.documentElement.classList.remove('scroll-scrolling');
            }
            return;
        }
        
        if (!this.isScrolling) {
            this.isScrolling = true;
            document.documentElement.classList.add('scroll-scrolling');
        }
        
        // Smooth interpolation
        const diff = this.target - this.current;
        this.current += diff * this.options.lerp;
        
        // Update direction
        const newDirection = diff > 0 ? 1 : diff < 0 ? -1 : 0;
        if (newDirection !== this.direction) {
            this.direction = newDirection;
            document.documentElement.classList.toggle('scroll-up', this.direction < 0);
            document.documentElement.classList.toggle('scroll-down', this.direction > 0);
        }
        
        // Apply scroll
        this.applyScroll();
        
        // Update sections and animations
        this.updateSections();
        
        // Update UI elements
        this.updateProgressBar();
        this.updateSectionDots();
        
        // Update parallax if enabled
        if (this.options.parallaxEnabled) {
            this.updateParallax();
        }
    }

    applyScroll() {
        // Use transform for smooth 60fps scrolling
        this.container.style.transform = `translate3d(0, ${-this.current}px, 0)`;
        
        // Update scroll position for other scripts
        if (window.scrollY !== this.current) {
            // Sync actual scroll position (throttled)
            clearTimeout(this.scrollSyncTimeout);
            this.scrollSyncTimeout = setTimeout(() => {
                history.replaceState(null, null, window.location.pathname + window.location.search + (this.current > 0 ? `#scroll-${Math.round(this.current)}` : ''));
            }, 100);
        }
    }

    updateSections() {
        const viewportTop = this.current;
        const viewportBottom = this.current + this.getViewportHeight();
        const viewportCenter = this.current + this.getViewportHeight() / 2;
        
        this.sections.forEach((section, index) => {
            const sectionTop = section.top;
            const sectionBottom = section.top + section.height;
            
            // Check if section is in view
            const wasInView = section.inView;
            section.inView = sectionBottom > viewportTop && sectionTop < viewportBottom;
            
            // Calculate section progress
            if (section.inView) {
                const visibleTop = Math.max(sectionTop, viewportTop);
                const visibleBottom = Math.min(sectionBottom, viewportBottom);
                const visibleHeight = visibleBottom - visibleTop;
                section.progress = Math.min(1, visibleHeight / Math.min(section.height, this.getViewportHeight()));
            } else {
                section.progress = 0;
            }
            
            // Trigger scroll animations
            if (section.inView && !wasInView && this.options.animationsEnabled) {
                this.triggerSectionAnimation(section);
            }
            
            // Update current section
            const distanceFromCenter = Math.abs(section.center - viewportCenter);
            if (distanceFromCenter < this.getViewportHeight() / 2) {
                this.currentSection = index;
            }
        });
    }

    triggerSectionAnimation(section) {
        if (section.animated) return;
        
        const animatableElements = section.element.querySelectorAll('[data-animate]');
        
        animatableElements.forEach((el, index) => {
            const animation = el.dataset.animate || 'fadeInUp';
            const delay = index * 100; // Stagger animations
            
            setTimeout(() => {
                el.classList.add('animate-' + animation);
            }, delay);
        });
        
        section.animated = true;
    }

    updateProgressBar() {
        if (!this.progressBar) return;
        
        const progress = this.current / this.getScrollLimit();
        const fill = this.progressBar.querySelector('.scroll-progress-fill');
        if (fill) {
            fill.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
        }
    }

    updateSectionDots() {
        this.sectionDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSection);
        });
    }

    updateParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const yPos = this.current * speed;
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    scrollToSection(index, options = {}) {
        if (index < 0 || index >= this.sections.length) return;
        
        const section = this.sections[index];
        const targetPosition = section.top - (this.getViewportHeight() - section.height) / 2;
        
        if (options.smooth) {
            // Smooth animated scroll
            this.animateToTarget(targetPosition, this.options.snapDuration);
        } else {
            // Instant scroll
            this.target = targetPosition;
            this.current = targetPosition;
            this.velocity = 0;
        }
    }

    animateToTarget(targetPosition, duration = 1000) {
        const startPosition = this.current;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function - cubic bezier for premium feel
            const eased = this.easeOutCubic(progress);
            
            this.current = startPosition + (distance * eased);
            this.target = this.current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.velocity = 0;
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    monitorPerformance() {
        this.frameCount++;
        const now = performance.now();
        
        if (now - this.lastFpsCheck > 1000) {
            this.currentFps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsCheck = now;
            
            // Adaptive performance
            if (this.options.batteryEfficient && this.currentFps < 45) {
                this.options.lerp = Math.min(0.15, this.options.lerp + 0.02); // Reduce smoothness for performance
                console.warn('⚡ Adaptive performance: reducing smoothness for better FPS');
            }
        }
    }

    startPerformanceMonitoring() {
        // Battery API for efficiency
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2 || battery.charging === false) {
                    this.options.parallaxEnabled = false;
                    this.options.lerp = 0.15; // Less smooth but more efficient
                    console.log('🔋 Battery saver mode: optimized for efficiency');
                }
            });
        }
        
        // Connection quality adaptation
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                this.options.animationsEnabled = false;
                console.log('📶 Slow connection: disabled complex animations');
            }
        }
    }

    getViewportHeight() {
        return window.innerHeight;
    }

    getScrollLimit() {
        return Math.max(0, document.body.scrollHeight - this.getViewportHeight());
    }

    updateScrollLimit() {
        // Recalculate when content changes
        this.scanSections();
    }

    // Public API
    scrollTo(position, smooth = true) {
        if (smooth) {
            this.animateToTarget(position);
        } else {
            this.target = position;
            this.current = position;
            this.velocity = 0;
        }
    }

    enable() {
        document.documentElement.classList.add('premium-scroll-active');
        this.bindEvents();
        this.startRenderLoop();
    }

    disable() {
        document.documentElement.classList.remove('premium-scroll-active');
        this.stopRenderLoop();
        this.container.style.transform = '';
    }

    destroy() {
        this.disable();
        
        // Remove UI elements
        if (this.progressBar) this.progressBar.remove();
        if (this.dotsContainer) this.dotsContainer.remove();
        
        // Clear timeouts
        clearTimeout(this.resizeTimeout);
        clearTimeout(this.scrollSyncTimeout);
    }

    // Static factory method
    static create(options = {}) {
        return new PremiumScrollEngine(options);
    }
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.premiumScroll = PremiumScrollEngine.create();
    });
} else {
    window.premiumScroll = PremiumScrollEngine.create();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiumScrollEngine;
}

// Global access
window.PremiumScrollEngine = PremiumScrollEngine;