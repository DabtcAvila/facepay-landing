/**
 * FACEPAY SMOOTH SCROLL ENGINE - APPLE LEVEL PERFORMANCE
 * One-page scroll experience with liquid transitions
 * Inspired by stripe.com, linear.app, framer.com, apple.com
 */

class FacePaySmoothScrollEngine {
    constructor(options = {}) {
        this.options = {
            lerp: 0.08,
            multiplier: 1,
            touchMultiplier: 1.5,
            firefoxMultiplier: 15,
            smooth: true,
            direction: 'vertical',
            gestureDirection: 'vertical',
            scrollbarContainer: false,
            scrollbarClass: 'c-scrollbar',
            scrollingClass: 'has-scroll-scrolling',
            draggingClass: 'has-scroll-dragging',
            smoothClass: 'has-scroll-smooth',
            initClass: 'has-scroll-init',
            getSpeed: false,
            getDirection: false,
            scrollFromAnywhere: false,
            tablet: { smooth: true, direction: 'vertical', gestureDirection: 'vertical' },
            smartphone: { smooth: true, direction: 'vertical', gestureDirection: 'vertical' },
            ...options
        };

        this.isScrolling = false;
        this.isDragging = false;
        this.isTicking = false;
        this.hasScrollTicking = false;
        this.checkScroll = this.checkScroll.bind(this);
        this.checkResize = this.checkResize.bind(this);

        this.html = document.documentElement;
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        this.windowMiddle = { x: this.windowWidth / 2, y: this.windowHeight / 2 };
        this.els = {};
        this.currentElements = {};
        this.listeners = {};
        this.hasScrollbar = false;
        this.isHorizontal = this.options.direction === 'horizontal';

        this.getDirection = this.options.getDirection;
        this.getSpeed = this.options.getSpeed;

        this.Core = {
            elements: [],
            container: this.isHorizontal ? document.scrollingElement || this.html : window,
            reduce: function(a) { 
                const b = this.container === window ? 'window' : this.container.getAttribute('data-scroll-container');
                return a.reduce((acc, element) => {
                    acc[b] = acc[b] || [];
                    acc[b].push(element);
                    return acc;
                }, {});
            }
        };

        this.setupEvents();
        this.init();
    }

    init() {
        this.addElements();
        this.detectElements();
        this.transformElements(true, true);
        this.initScrollbar();
        this.setEvents();

        if (this.options.smooth) {
            this.startScrolling();
        }

        this.html.classList.add(this.options.initClass);
        console.log('🚀 FacePay Smooth Scroll Engine initialized');
    }

    setupEvents() {
        // Scroll events with passive listeners for better performance
        this.listeners.scroll = () => this.checkScroll();
        this.listeners.resize = () => this.checkResize();

        // Touch events for mobile
        this.listeners.touchstart = (e) => this.onTouchStart(e);
        this.listeners.touchmove = (e) => this.onTouchMove(e);
        this.listeners.touchend = (e) => this.onTouchEnd(e);

        // Keyboard events
        this.listeners.keydown = (e) => this.onKeyDown(e);
    }

    addElements() {
        this.els = {};
        const elements = document.querySelectorAll('[data-scroll]');
        
        elements.forEach((element, index) => {
            const cl = element.classList.contains('js-scroll') ? 'js-scroll' : 'scroll';
            element.classList.add(cl);
            
            let id = element.getAttribute('data-scroll-id') || index;
            
            this.els[id] = {
                el: element,
                targetEl: element,
                inView: false,
                progress: 0
            };

            // Set up scroll parameters
            if (element.hasAttribute('data-scroll-speed')) {
                this.els[id].speed = parseFloat(element.getAttribute('data-scroll-speed')) || 0;
            }

            if (element.hasAttribute('data-scroll-lag')) {
                this.els[id].lag = parseFloat(element.getAttribute('data-scroll-lag')) || 0;
            }

            if (element.hasAttribute('data-scroll-position')) {
                this.els[id].position = element.getAttribute('data-scroll-position');
            }

            if (element.hasAttribute('data-scroll-direction')) {
                this.els[id].direction = element.getAttribute('data-scroll-direction');
            }

            if (element.hasAttribute('data-scroll-sticky')) {
                this.els[id].sticky = true;
            }

            if (element.hasAttribute('data-scroll-target')) {
                this.els[id].targetEl = document.querySelector(element.getAttribute('data-scroll-target'));
            }

            if (element.hasAttribute('data-scroll-offset')) {
                this.els[id].offset = element.getAttribute('data-scroll-offset').split(',');
            }

            if (element.hasAttribute('data-scroll-repeat')) {
                this.els[id].repeat = true;
            }

            if (element.hasAttribute('data-scroll-call')) {
                this.els[id].call = element.getAttribute('data-scroll-call');
            }
        });
    }

    detectElements() {
        const scrollTop = this.isHorizontal ? this.Core.container.scrollLeft : this.Core.container.scrollTop;
        const scrollBottom = scrollTop + this.windowHeight;

        Object.entries(this.els).forEach(([key, obj]) => {
            if (!obj.targetEl) return;

            const targetBounds = obj.targetEl.getBoundingClientRect();
            const elementTop = this.isHorizontal ? targetBounds.left + scrollTop : targetBounds.top + scrollTop;
            const elementBottom = elementTop + (this.isHorizontal ? targetBounds.width : targetBounds.height);

            // Check if element is in view
            const inView = (elementBottom >= scrollTop && elementTop <= scrollBottom);

            if (inView && !obj.inView) {
                obj.inView = true;
                this.setInView(obj, key);
            } else if (!inView && obj.inView) {
                obj.inView = false;
                this.setOutOfView(obj, key);
            }

            if (obj.inView) {
                this.updateProgress(obj, elementTop, elementBottom, scrollTop, scrollBottom);
            }
        });
    }

    setInView(obj, key) {
        obj.el.classList.add('is-inview');
        
        if (obj.call) {
            this.dispatchCall(obj, 'enter', { 
                direction: this.scrollingDirection,
                speed: this.scrollingSpeed 
            });
        }
    }

    setOutOfView(obj, key) {
        obj.el.classList.remove('is-inview');
        
        if (obj.call) {
            this.dispatchCall(obj, 'exit', { 
                direction: this.scrollingDirection,
                speed: this.scrollingSpeed 
            });
        }
    }

    updateProgress(obj, elementTop, elementBottom, scrollTop, scrollBottom) {
        const elementHeight = elementBottom - elementTop;
        const windowHeight = scrollBottom - scrollTop;

        let progress;
        if (elementTop < scrollTop) {
            // Element starts above viewport
            progress = Math.min((scrollBottom - elementTop) / (windowHeight + elementHeight), 1);
        } else if (elementBottom > scrollBottom) {
            // Element extends below viewport
            progress = Math.min((elementBottom - scrollTop) / (windowHeight + elementHeight), 1);
        } else {
            // Element is fully contained within viewport
            progress = 1;
        }

        obj.progress = Math.max(0, Math.min(1, progress));
        
        if (obj.call) {
            this.dispatchCall(obj, 'progress', {
                progress: obj.progress,
                direction: this.scrollingDirection,
                speed: this.scrollingSpeed
            });
        }
    }

    transformElements(firstCall = false, scroll = false) {
        if (!this.options.smooth && !firstCall) return;

        Object.entries(this.els).forEach(([key, obj]) => {
            let transform = '';

            if (obj.inView || obj.sticky) {
                if (obj.speed) {
                    const yPos = -(this.current * obj.speed);
                    const y3d = Math.round(yPos * 100) / 100;
                    
                    if (this.isHorizontal) {
                        transform += `translate3d(${y3d}px, 0, 0)`;
                    } else {
                        transform += `translate3d(0, ${y3d}px, 0)`;
                    }
                }

                if (obj.lag && scroll) {
                    const lag = Math.round((this.current - obj.current) * obj.lag * 100) / 100;
                    if (this.isHorizontal) {
                        transform += ` translate3d(${lag}px, 0, 0)`;
                    } else {
                        transform += ` translate3d(0, ${lag}px, 0)`;
                    }
                }

                if (transform) {
                    obj.el.style.transform = transform;
                }
            }
        });
    }

    startScrolling() {
        this.current = this.isHorizontal ? this.Core.container.scrollLeft : this.Core.container.scrollTop;
        this.target = this.current;
        this.direction = this.current > 0 ? 'down' : 'up';
        this.speed = 0;

        this.raf();
        this.html.classList.add(this.options.smoothClass);
    }

    raf() {
        const current = Math.round(this.current * 100) / 100;
        const target = Math.round(this.target * 100) / 100;

        if (current !== target) {
            this.current += (this.target - this.current) * this.options.lerp;
            this.direction = this.current > this.target ? 'down' : 'up';
            this.speed = Math.abs(this.current - target);

            this.transformElements(false, true);
            this.updateScroll();

            if (this.getDirection) {
                this.addDirection();
            }

            if (this.getSpeed) {
                this.addSpeed();
            }

            this.hasScrollTicking = true;
        } else {
            if (this.hasScrollTicking) {
                this.hasScrollTicking = false;
                this.html.classList.remove(this.options.scrollingClass);
            }
        }

        this.checkScroll();
        requestAnimationFrame(() => this.raf());
    }

    updateScroll() {
        if (this.isHorizontal) {
            window.scrollTo(this.current, 0);
        } else {
            window.scrollTo(0, this.current);
        }
    }

    checkScroll() {
        if (!this.isTicking) {
            requestAnimationFrame(() => {
                this.detectElements();
                this.isTicking = false;
            });
            this.isTicking = true;
        }
    }

    checkResize() {
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        this.windowMiddle = { x: this.windowWidth / 2, y: this.windowHeight / 2 };
        this.update();
    }

    addDirection() {
        this.html.classList.toggle('has-scroll-down', this.direction === 'down');
        this.html.classList.toggle('has-scroll-up', this.direction === 'up');
    }

    addSpeed() {
        if (this.speed > 1.2) {
            this.html.classList.add('has-scroll-speed');
        } else {
            this.html.classList.remove('has-scroll-speed');
        }
    }

    setEvents() {
        window.addEventListener('resize', this.listeners.resize, { passive: true });
        
        if (this.options.smooth) {
            document.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
            document.addEventListener('touchstart', this.listeners.touchstart, { passive: true });
            document.addEventListener('touchmove', this.listeners.touchmove, { passive: false });
            document.addEventListener('touchend', this.listeners.touchend, { passive: true });
        } else {
            this.Core.container.addEventListener('scroll', this.listeners.scroll, { passive: true });
        }

        document.addEventListener('keydown', this.listeners.keydown, { passive: false });
    }

    onWheel(e) {
        e.preventDefault();
        
        let delta;
        if (this.options.gestureDirection === 'vertical') {
            delta = e.deltaY || e.detail || e.wheelDelta;
        } else {
            delta = e.deltaX || e.detail || e.wheelDelta;
        }

        if (navigator.userAgent.indexOf('Firefox') > -1) {
            delta *= this.options.firefoxMultiplier;
        }

        delta *= this.options.multiplier;
        this.updateDelta(delta);
    }

    onTouchStart(e) {
        this.startY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;
        this.startX = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
        this.html.classList.add(this.options.draggingClass);
        this.isDragging = true;
    }

    onTouchMove(e) {
        if (!this.isDragging) return;

        e.preventDefault();

        const y = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;
        const x = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
        
        let delta;
        if (this.options.gestureDirection === 'vertical') {
            delta = (this.startY - y) * this.options.touchMultiplier;
        } else {
            delta = (this.startX - x) * this.options.touchMultiplier;
        }

        this.updateDelta(delta);
    }

    onTouchEnd() {
        this.isDragging = false;
        this.html.classList.remove(this.options.draggingClass);
    }

    onKeyDown(e) {
        switch (e.keyCode) {
            case 38: // Up arrow
                e.preventDefault();
                this.updateDelta(-240);
                break;
            case 40: // Down arrow
                e.preventDefault();
                this.updateDelta(240);
                break;
            case 33: // Page up
                e.preventDefault();
                this.updateDelta(-this.windowHeight);
                break;
            case 34: // Page down
                e.preventDefault();
                this.updateDelta(this.windowHeight);
                break;
            case 36: // Home
                e.preventDefault();
                this.scrollTo(0);
                break;
            case 35: // End
                e.preventDefault();
                this.scrollTo(this.getLimit());
                break;
            case 32: // Space
                e.preventDefault();
                this.updateDelta(this.windowHeight / 2);
                break;
        }
    }

    updateDelta(delta) {
        this.target += delta;
        this.target = Math.max(0, Math.min(this.target, this.getLimit()));

        if (!this.hasScrollTicking) {
            this.html.classList.add(this.options.scrollingClass);
        }
    }

    updateElements(force = false) {
        Object.entries(this.els).forEach(([key, obj]) => {
            if (force || obj.inView) {
                obj.current = this.current;
            }
        });
    }

    initScrollbar() {
        if (this.options.scrollbarContainer) {
            this.scrollbar = {
                container: this.options.scrollbarContainer,
                track: this.options.scrollbarContainer.querySelector(`.${this.options.scrollbarClass}_track`),
                thumb: this.options.scrollbarContainer.querySelector(`.${this.options.scrollbarClass}_thumb`)
            };

            this.bindScrollbar();
        }
    }

    bindScrollbar() {
        if (!this.scrollbar) return;

        const onMouseDown = (e) => {
            e.preventDefault();
            this.isDragging = true;
            this.html.classList.add(this.options.draggingClass);

            const onMouseMove = (e) => {
                if (!this.isDragging) return;
                e.preventDefault();

                const progress = e.clientY / this.windowHeight;
                this.target = progress * this.getLimit();
            };

            const onMouseUp = () => {
                this.isDragging = false;
                this.html.classList.remove(this.options.draggingClass);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        if (this.scrollbar.thumb) {
            this.scrollbar.thumb.addEventListener('mousedown', onMouseDown);
        }
    }

    getLimit() {
        if (this.isHorizontal) {
            return this.Core.container.scrollWidth - this.windowWidth;
        } else {
            return Math.max(0, document.body.scrollHeight - this.windowHeight);
        }
    }

    update() {
        this.addElements();
        this.detectElements();
        this.updateElements(true);
        this.transformElements(true);
    }

    destroy() {
        window.removeEventListener('resize', this.listeners.resize);
        document.removeEventListener('wheel', this.onWheel);
        document.removeEventListener('touchstart', this.listeners.touchstart);
        document.removeEventListener('touchmove', this.listeners.touchmove);
        document.removeEventListener('touchend', this.listeners.touchend);
        document.removeEventListener('keydown', this.listeners.keydown);

        if (!this.options.smooth) {
            this.Core.container.removeEventListener('scroll', this.listeners.scroll);
        }

        this.html.classList.remove(
            this.options.initClass,
            this.options.smoothClass,
            this.options.scrollingClass,
            this.options.draggingClass
        );

        // Clean up elements
        Object.entries(this.els).forEach(([key, obj]) => {
            obj.el.style.transform = '';
            obj.el.classList.remove('is-inview', 'js-scroll', 'scroll');
        });
    }

    scrollTo(target, options = {}) {
        const offset = parseInt(options.offset) || 0;
        const callback = options.callback || false;
        const duration = options.duration || 1000;

        if (typeof target === 'string') {
            const targetEl = document.querySelector(target);
            if (!targetEl) return;
            const bounds = targetEl.getBoundingClientRect();
            target = this.isHorizontal ? bounds.left + this.current : bounds.top + this.current;
        }

        target += offset;

        if (this.options.smooth) {
            // Smooth animated scroll using GSAP if available
            if (typeof gsap !== 'undefined') {
                gsap.to(this, {
                    target: target,
                    duration: duration / 1000,
                    ease: 'power2.out',
                    onComplete: callback
                });
            } else {
                // Fallback smooth scroll
                this.target = target;
                if (callback) {
                    setTimeout(callback, duration);
                }
            }
        } else {
            if (this.isHorizontal) {
                this.Core.container.scrollTo(target, 0);
            } else {
                this.Core.container.scrollTo(0, target);
            }
            if (callback) callback();
        }
    }

    on(event, func) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(func);
    }

    off(event, func) {
        if (this.listeners[event]) {
            const index = this.listeners[event].indexOf(func);
            if (index > -1) {
                this.listeners[event].splice(index, 1);
            }
        }
    }

    emit(event, ...args) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(func => func(...args));
        }
    }

    dispatchCall(obj, way, props) {
        if (typeof obj.call === 'function') {
            obj.call(way, props, obj.el);
        } else {
            this.emit(obj.call, way, props, obj.el);
        }
    }

    // Static methods for easy initialization
    static init(options = {}) {
        return new FacePaySmoothScrollEngine(options);
    }

    static destroy(instance) {
        if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
        }
    }
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
    window.FacePaySmoothScrollEngine = FacePaySmoothScrollEngine;
    
    // Initialize with CSS Scroll Snap support
    const style = document.createElement('style');
    style.textContent = `
        /* CSS Scroll Snap for smooth section navigation */
        html {
            scroll-snap-type: y mandatory;
            scroll-behavior: smooth;
        }
        
        .scroll-snap-section {
            scroll-snap-align: start;
            scroll-snap-stop: always;
        }
        
        /* Hide scrollbar but keep functionality */
        .has-scroll-smooth {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        
        .has-scroll-smooth::-webkit-scrollbar {
            display: none;
        }
        
        /* Performance optimizations */
        [data-scroll] {
            will-change: transform;
        }
        
        .has-scroll-scrolling [data-scroll] {
            pointer-events: none;
        }
        
        /* Smooth transitions */
        .scroll-transition {
            transition: opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1),
                        transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        
        /* Loading state */
        .scroll-loading * {
            transition: none !important;
            animation: none !important;
        }
    `;
    
    if (!document.getElementById('facepay-scroll-styles')) {
        style.id = 'facepay-scroll-styles';
        document.head.appendChild(style);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FacePaySmoothScrollEngine;
}