/**
 * Mobile Touch Optimizer
 * Advanced mobile responsiveness and touch interaction enhancements
 */

class MobileTouchOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTouch = 'ontouchstart' in window;
        this.orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
        this.pixelRatio = window.devicePixelRatio || 1;
        
        this.init();
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }
    
    init() {
        this.optimizeViewport();
        this.enhanceTouchTargets();
        this.optimizeScrolling();
        this.preventZoom();
        this.optimizeAnimations();
        this.setupOrientationHandling();
        this.optimizePerformance();
        this.setupAccessibility();
        
        if (this.isMobile) {
            console.log('🚀 Mobile Touch Optimizer: Initialized for mobile device');
        }
    }
    
    optimizeViewport() {
        // Dynamic viewport adjustment
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Update on resize
        window.addEventListener('resize', () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
        
        // Add CSS custom properties for mobile
        document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
        document.documentElement.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
        document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
        document.documentElement.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
    }
    
    enhanceTouchTargets() {
        const touchTargets = document.querySelectorAll('.btn, .face-id-3d-container, .feature-card, a');
        
        touchTargets.forEach(target => {
            // Ensure minimum touch target size (44px)
            const computedStyle = window.getComputedStyle(target);
            const height = parseInt(computedStyle.height);
            const width = parseInt(computedStyle.width);
            
            if (height < 44 || width < 44) {
                target.style.minHeight = '44px';
                target.style.minWidth = '44px';
                target.style.padding = Math.max(12, parseInt(computedStyle.padding)) + 'px';
            }
            
            // Add touch feedback
            target.addEventListener('touchstart', (e) => {
                target.style.transform = 'scale(0.95)';
                target.style.transition = 'transform 0.1s ease';
            }, { passive: true });
            
            target.addEventListener('touchend', (e) => {
                setTimeout(() => {
                    target.style.transform = '';
                    target.style.transition = 'transform 0.3s ease';
                }, 100);
            }, { passive: true });
            
            target.addEventListener('touchcancel', (e) => {
                target.style.transform = '';
                target.style.transition = 'transform 0.3s ease';
            }, { passive: true });
        });
    }
    
    optimizeScrolling() {
        // Enhance scroll performance
        document.body.style.webkitOverflowScrolling = 'touch';
        document.body.style.overflowScrolling = 'touch';
        
        // Smooth scroll polyfill for mobile
        const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
        smoothScrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const navHeight = 90;
                    const targetPosition = target.offsetTop - navHeight;
                    
                    // Use smooth scrolling with fallback
                    if ('scrollBehavior' in document.documentElement.style) {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    } else {
                        // Fallback smooth scroll
                        this.smoothScrollTo(targetPosition, 800);
                    }
                }
            });
        });
    }
    
    smoothScrollTo(targetPosition, duration) {
        const start = window.pageYOffset;
        const distance = targetPosition - start;
        let startTime = null;
        
        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutQuad(timeElapsed, start, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };
        
        requestAnimationFrame(animation);
    }
    
    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    preventZoom() {
        // Prevent zoom on input focus for mobile
        if (this.isMobile) {
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    if (input.style.fontSize < '16px') {
                        input.style.fontSize = '16px';
                    }
                });
            });
        }
        
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    
    optimizeAnimations() {
        // Reduce animations for performance on mobile
        if (this.isMobile && this.pixelRatio > 2) {
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    * {
                        animation-duration: 0.3s !important;
                        transition-duration: 0.3s !important;
                    }
                    
                    .bg-particles {
                        animation: none !important;
                        opacity: 0.01 !important;
                    }
                    
                    .face-id-3d-container {
                        will-change: auto !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Use transform3d for hardware acceleration
        const animatedElements = document.querySelectorAll('.btn, .feature-card, .face-id-3d-container');
        animatedElements.forEach(element => {
            element.style.transform = 'translate3d(0, 0, 0)';
            element.style.backfaceVisibility = 'hidden';
            element.style.perspective = '1000px';
        });
    }
    
    setupOrientationHandling() {
        let orientationTimeout;
        
        const handleOrientationChange = () => {
            clearTimeout(orientationTimeout);
            orientationTimeout = setTimeout(() => {
                this.orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
                
                // Recalculate viewport
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
                
                // Trigger resize on 3D canvas
                const canvas = document.getElementById('faceId3DCanvas');
                if (canvas && window.faceID3D) {
                    window.faceID3D.handleResize();
                }
                
                console.log(`📱 Orientation changed to: ${this.orientation}`);
            }, 300);
        };
        
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);
    }
    
    optimizePerformance() {
        // Intersection Observer for performance
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    } else {
                        entry.target.classList.remove('in-view');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });
            
            const observeElements = document.querySelectorAll('.feature-card, .face-id-3d-container');
            observeElements.forEach(el => observer.observe(el));
        }
        
        // Lazy load optimization
        if (this.isMobile) {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                img.loading = 'lazy';
            });
        }
        
        // Memory management
        window.addEventListener('beforeunload', () => {
            // Cleanup any remaining animations or timers
            clearTimeout(this.orientationTimeout);
        });
    }
    
    setupAccessibility() {
        // Enhance accessibility for mobile
        const interactiveElements = document.querySelectorAll('.btn, .face-id-3d-container, .feature-card');
        
        interactiveElements.forEach(element => {
            // Add role if not present
            if (!element.getAttribute('role')) {
                element.setAttribute('role', 'button');
            }
            
            // Add tabindex for keyboard navigation
            if (!element.getAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            
            // Add aria-label if not present
            if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
                element.setAttribute('aria-label', 'Interactive element');
            }
            
            // Add keyboard support
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
        
        // Add skip link for mobile
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Public methods for external control
    disableAnimations() {
        const style = document.createElement('style');
        style.id = 'mobile-performance-mode';
        style.textContent = `
            * {
                animation: none !important;
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    enableAnimations() {
        const performanceStyle = document.getElementById('mobile-performance-mode');
        if (performanceStyle) {
            performanceStyle.remove();
        }
    }
    
    getDeviceInfo() {
        return {
            isMobile: this.isMobile,
            isTouch: this.isTouch,
            orientation: this.orientation,
            pixelRatio: this.pixelRatio,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }
}

// Initialize mobile optimizer
const mobileTouchOptimizer = new MobileTouchOptimizer();

// Export for global access
window.mobileTouchOptimizer = mobileTouchOptimizer;

// Performance monitoring
if (window.performance && window.performance.mark) {
    window.performance.mark('mobile-optimizer-loaded');
}

console.log('📱 Mobile Touch Optimizer: Ready for perfect mobile experience');