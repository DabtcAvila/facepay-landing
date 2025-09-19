/**
 * FACEPAY MICRO-ANIMATIONS ENGINE
 * JavaScript para micro-animaciones deliciosas premium
 * Performance: 60fps | Timing: Perfecto | Experiencia: Memorable
 */

class MicroAnimationsEngine {
    constructor(options = {}) {
        this.options = {
            respectMotionPreference: true,
            debugMode: false,
            performanceMode: 'auto', // 'auto', 'high', 'low'
            ...options
        };
        
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.observers = new Map();
        this.animationQueue = [];
        this.isHighPerformance = this.detectPerformanceCapability();
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.bindEventListeners();
        this.processAnimationQueue();
        
        if (this.options.debugMode) {
            console.log('🎨 MicroAnimations Engine initialized', {
                reducedMotion: this.isReducedMotion,
                highPerformance: this.isHighPerformance
            });
        }
    }

    detectPerformanceCapability() {
        const cores = navigator.hardwareConcurrency || 4;
        const connection = navigator.connection;
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (this.options.performanceMode === 'high') return true;
        if (this.options.performanceMode === 'low') return false;
        
        // Auto-detect based on device capabilities
        if (isMobile && cores < 4) return false;
        if (connection && connection.effectiveType && connection.effectiveType.includes('2g')) return false;
        
        return cores >= 4;
    }

    // ====================
    // 1. TEXT REVEALS - Character por character
    // ====================

    createTextReveal(element, options = {}) {
        const config = {
            type: 'char', // 'char', 'word', 'line', 'matrix', 'typewriter'
            delay: 0,
            duration: 400,
            stagger: 20,
            easing: 'ease-micro',
            ...options
        };

        if (this.isReducedMotion && this.options.respectMotionPreference) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return Promise.resolve();
        }

        const text = element.textContent;
        const fragments = this.fragmentText(text, config.type);
        
        // Clear original text and rebuild with spans
        element.innerHTML = fragments.map((fragment, index) => {
            const className = config.type === 'matrix' ? 'text-reveal-matrix' : 
                             config.type === 'typewriter' ? 'text-reveal-typewriter' : 'text-reveal-char';
            return `<span class="${className}" style="animation-delay: ${config.delay + (index * config.stagger)}ms">${fragment === ' ' ? '&nbsp;' : fragment}</span>`;
        }).join('');

        return this.waitForAnimationComplete(element, config.duration + (fragments.length * config.stagger));
    }

    fragmentText(text, type) {
        switch (type) {
            case 'char':
                return text.split('');
            case 'word':
                return text.split(' ').map(word => word + ' ').slice(0, -1);
            case 'line':
                return text.split('\n');
            default:
                return text.split('');
        }
    }

    // Método especializado para efectos Matrix
    createMatrixReveal(element, options = {}) {
        return this.createTextReveal(element, { ...options, type: 'matrix' });
    }

    // Método especializado para typewriter
    createTypewriterReveal(element, options = {}) {
        const config = {
            typingSpeed: 50, // ms per character
            showCursor: true,
            ...options
        };

        if (this.isReducedMotion && this.options.respectMotionPreference) {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            const text = element.textContent;
            element.textContent = '';
            
            if (config.showCursor) {
                element.style.borderRight = '2px solid var(--primary)';
            }

            let index = 0;
            const typeChar = () => {
                if (index < text.length) {
                    element.textContent += text[index];
                    index++;
                    setTimeout(typeChar, config.typingSpeed);
                } else {
                    if (config.showCursor) {
                        // Animate cursor blink
                        element.style.animation = 'blinkCaret 1s step-end infinite';
                    }
                    resolve();
                }
            };

            typeChar();
        });
    }

    // ====================
    // 2. BUTTON STATES - Bounce perfecto
    // ====================

    enhanceButton(button, options = {}) {
        const config = {
            bounceIntensity: 1, // 0.5 to 2
            magneticStrength: 0.3,
            rippleEnabled: true,
            loadingState: false,
            ...options
        };

        if (this.isReducedMotion && this.options.respectMotionPreference) {
            return;
        }

        button.classList.add('btn-micro-bounce');

        // Magnetic effect
        if (config.magneticStrength > 0) {
            this.addMagneticEffect(button, config.magneticStrength);
        }

        // Ripple effect on click
        if (config.rippleEnabled) {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(button, e);
            });
        }

        // Enhanced bounce with custom intensity
        if (config.bounceIntensity !== 1) {
            const style = button.style;
            button.addEventListener('mousedown', () => {
                style.transform = `scale(${0.96 * config.bounceIntensity}) translateY(1px)`;
            });
            
            button.addEventListener('mouseup', () => {
                style.transform = 'scale(1) translateY(0)';
            });
        }

        return {
            setLoading: (loading) => this.setButtonLoading(button, loading),
            destroy: () => this.destroyButtonEnhancement(button)
        };
    }

    addMagneticEffect(element, strength) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * strength;
            const moveY = y * strength;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0) scale(1)';
        });
    }

    createRippleEffect(button, event) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
            animation: rippleExpand 0.6s ease-out;
            z-index: 1;
        `;
        
        button.style.position = button.style.position || 'relative';
        button.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }

    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('btn-loading');
            button.disabled = true;
            button.setAttribute('data-original-text', button.textContent);
            button.textContent = '';
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;
            const originalText = button.getAttribute('data-original-text');
            if (originalText) {
                button.textContent = originalText;
                button.removeAttribute('data-original-text');
            }
        }
    }

    // ====================
    // 3. LOADING STATES - Hipnotizantes
    // ====================

    createLiquidLoader(container, options = {}) {
        const config = {
            size: 40,
            colors: ['var(--primary)', 'var(--secondary)'],
            duration: 1500,
            ...options
        };

        const loader = document.createElement('div');
        loader.className = 'loader-liquid';
        loader.style.cssText = `
            width: ${config.size}px;
            height: ${config.size}px;
            background: linear-gradient(45deg, ${config.colors[0]}, ${config.colors[1]});
            animation-duration: ${config.duration}ms;
        `;

        container.appendChild(loader);
        
        return {
            destroy: () => loader.remove(),
            setColors: (colors) => {
                loader.style.background = `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`;
            }
        };
    }

    createDotsLoader(container, options = {}) {
        const config = {
            dotCount: 3,
            dotSize: 8,
            spacing: 4,
            color: 'var(--primary)',
            ...options
        };

        const loader = document.createElement('div');
        loader.className = 'loader-dots';
        
        for (let i = 0; i < config.dotCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'loader-dot';
            dot.style.cssText = `
                width: ${config.dotSize}px;
                height: ${config.dotSize}px;
                background: ${config.color};
                margin-right: ${i < config.dotCount - 1 ? config.spacing : 0}px;
                animation-delay: ${i * 0.2}s;
            `;
            loader.appendChild(dot);
        }

        container.appendChild(loader);
        
        return {
            destroy: () => loader.remove()
        };
    }

    createProgressLiquid(container, options = {}) {
        const config = {
            height: 6,
            colors: ['var(--primary)', 'var(--secondary)'],
            animated: true,
            ...options
        };

        const progress = document.createElement('div');
        progress.className = 'progress-liquid';
        progress.style.height = `${config.height}px`;

        const fill = document.createElement('div');
        fill.className = 'progress-liquid-fill';
        fill.style.cssText = `
            background: linear-gradient(90deg, ${config.colors[0]} 0%, ${config.colors[1]} 50%, ${config.colors[0]} 100%);
            width: 0%;
            transition: width 0.3s ease;
        `;

        progress.appendChild(fill);
        container.appendChild(progress);

        return {
            setProgress: (percent) => {
                fill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
            },
            destroy: () => progress.remove()
        };
    }

    // ====================
    // 4. SCROLL REVEALS - Sorprendentes
    // ====================

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px 0px -50px 0px',
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const config = this.observers.get(element);
                
                if (!config) return;

                if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
                    this.triggerScrollReveal(element, config);
                } else if (config.reset && entry.intersectionRatio === 0) {
                    this.resetScrollReveal(element, config);
                }
            });
        }, options);
    }

    observeScrollReveal(element, options = {}) {
        const config = {
            type: 'depth', // 'depth', 'magnetic', 'split', 'cascade'
            delay: 0,
            duration: 800,
            easing: 'ease-overshoot',
            reset: false,
            threshold: 0.1,
            ...options
        };

        this.observers.set(element, config);
        this.scrollObserver.observe(element);

        // Apply initial state
        this.resetScrollReveal(element, config);
    }

    triggerScrollReveal(element, config) {
        if (config.triggered && !config.reset) return;

        if (this.isReducedMotion && this.options.respectMotionPreference) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.style.filter = 'none';
            return;
        }

        setTimeout(() => {
            element.classList.add('observed');
            
            // Cascade effect for children
            if (config.type === 'cascade') {
                const items = element.querySelectorAll('.cascade-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('observed');
                    }, index * 100);
                });
            }
        }, config.delay);

        config.triggered = true;
    }

    resetScrollReveal(element, config) {
        element.classList.remove('observed');
        element.classList.add(`scroll-reveal-${config.type}`);
        
        if (config.type === 'cascade') {
            const items = element.querySelectorAll('.cascade-item');
            items.forEach(item => item.classList.remove('observed'));
        }
        
        config.triggered = false;
    }

    // ====================
    // 5. SUCCESS STATES - Satisfactorios
    // ====================

    createSuccessAnimation(container, options = {}) {
        const config = {
            type: 'checkmark', // 'checkmark', 'celebration', 'ripple'
            size: 60,
            duration: 600,
            particles: true,
            sound: false, // Future feature
            ...options
        };

        if (this.isReducedMotion && this.options.respectMotionPreference) {
            // Simple success indicator
            container.innerHTML = '✓';
            container.style.cssText = `
                color: #10b981;
                font-size: 24px;
                text-align: center;
            `;
            return Promise.resolve();
        }

        return new Promise(resolve => {
            const success = document.createElement('div');
            
            if (config.type === 'checkmark') {
                success.className = 'success-checkmark';
                success.style.cssText = `
                    width: ${config.size}px;
                    height: ${config.size}px;
                    margin: 0 auto;
                `;
                
                if (config.particles) {
                    success.classList.add('success-particles');
                }
            }

            container.appendChild(success);

            // Add ripple effect
            if (config.type === 'ripple' || config.particles) {
                success.classList.add('success-ripple');
            }

            setTimeout(() => {
                resolve();
            }, config.duration);
        });
    }

    showSuccessToast(message, options = {}) {
        const config = {
            duration: 3000,
            position: 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
            autoClose: true,
            ...options
        };

        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            ${config.position.includes('top') ? 'top: 20px' : 'bottom: 20px'};
            ${config.position.includes('right') ? 'right: 20px' : 'left: 20px'};
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
            transform: translateY(${config.position.includes('top') ? '-' : ''}100px);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
            z-index: 10000;
            pointer-events: auto;
            cursor: pointer;
        `;
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div class="success-checkmark" style="width: 20px; height: 20px; font-size: 12px;">✓</div>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        // Auto close
        if (config.autoClose) {
            setTimeout(() => {
                toast.style.transform = `translateY(${config.position.includes('top') ? '-' : ''}100px)`;
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 400);
            }, config.duration);
        }

        // Manual close on click
        toast.addEventListener('click', () => {
            toast.style.transform = `translateY(${config.position.includes('top') ? '-' : ''}100px)`;
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        });

        return {
            close: () => toast.click(),
            element: toast
        };
    }

    // ====================
    // UTILITY METHODS
    // ====================

    waitForAnimationComplete(element, duration) {
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    bindEventListeners() {
        // Auto-enhance buttons with micro-bounce class
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.micro-bounce').forEach(button => {
                this.enhanceButton(button);
            });
        });

        // Auto-observe scroll reveal elements
        document.querySelectorAll('[data-scroll-reveal]').forEach(element => {
            const options = element.dataset.scrollReveal ? 
                JSON.parse(element.dataset.scrollReveal) : {};
            this.observeScrollReveal(element, options);
        });

        // Auto-create text reveals
        document.querySelectorAll('[data-text-reveal]').forEach(element => {
            const options = element.dataset.textReveal ? 
                JSON.parse(element.dataset.textReveal) : {};
            this.createTextReveal(element, options);
        });
    }

    processAnimationQueue() {
        // Process any queued animations
        const processQueue = () => {
            if (this.animationQueue.length > 0) {
                const animation = this.animationQueue.shift();
                animation();
            }
            requestAnimationFrame(processQueue);
        };
        
        processQueue();
    }

    // ====================
    // PUBLIC API
    // ====================

    // Batch operations for better performance
    batch(operations) {
        return Promise.all(operations.map(op => op()));
    }

    // Global controls
    pauseAll() {
        document.documentElement.style.animationPlayState = 'paused';
    }

    resumeAll() {
        document.documentElement.style.animationPlayState = 'running';
    }

    destroy() {
        this.scrollObserver?.disconnect();
        this.observers.clear();
        this.animationQueue = [];
    }
}

// CSS Animation definitions to inject
const CSS_ANIMATIONS = `
@keyframes rippleExpand {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes blinkCaret {
    from, to { border-color: transparent; }
    50% { border-color: var(--primary); }
}
`;

// Inject CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = CSS_ANIMATIONS;
document.head.appendChild(styleSheet);

// Auto-initialize with optimal settings
let microAnimations;

document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    const respectMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initialize engine
    microAnimations = new MicroAnimationsEngine({
        respectMotionPreference: true,
        debugMode: false,
        performanceMode: 'auto'
    });

    // Expose to global scope for easy access
    window.microAnimations = microAnimations;

    console.log('✨ MicroAnimations ready - Creating delightful experiences');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MicroAnimationsEngine;
}

// Export for ES6 modules
if (typeof window !== 'undefined') {
    window.MicroAnimationsEngine = MicroAnimationsEngine;
}