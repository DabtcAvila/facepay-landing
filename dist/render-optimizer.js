/**
 * RENDER OPTIMIZER - Advanced Rendering Optimizations
 * Eliminates layout shift, optimizes paint, manages compositor layers
 * Target: CLS < 0.05, INP < 100ms, smooth 60fps
 */

class RenderOptimizer {
    constructor() {
        this.layoutShiftScore = 0;
        this.renderingMetrics = new Map();
        this.animationFrames = new Set();
        this.resizeObserver = null;
        this.isOptimizing = false;
        
        this.init();
    }

    init() {
        console.log('🎨 Render Optimizer initialized');
        
        // 1. Prevent layout shifts
        this.preventLayoutShifts();
        
        // 2. Optimize paint operations
        this.optimizePainting();
        
        // 3. Manage compositor layers
        this.setupCompositorLayers();
        
        // 4. Monitor rendering performance
        this.monitorRenderingPerformance();
        
        // 5. Setup resize optimization
        this.setupResizeOptimization();
    }

    // PREVENT LAYOUT SHIFTS (CLS Optimization)
    preventLayoutShifts() {
        // Reserve space for dynamic content
        this.reserveSpaceForDynamicContent();
        
        // Stabilize image loading
        this.stabilizeImages();
        
        // Prevent font loading shifts
        this.preventFontLoadingShifts();
        
        // Setup mutation observer for layout shift prevention
        this.setupLayoutShiftPrevention();
        
        console.log('🔒 Layout shift prevention active');
    }

    reserveSpaceForDynamicContent() {
        // Reserve space for videos
        document.querySelectorAll('video').forEach(video => {
            if (!video.style.aspectRatio && video.dataset.aspectRatio) {
                video.style.aspectRatio = video.dataset.aspectRatio;
            }
        });

        // Reserve space for lazy images
        document.querySelectorAll('img[data-src]').forEach(img => {
            if (!img.style.aspectRatio && (img.dataset.width && img.dataset.height)) {
                const ratio = img.dataset.width / img.dataset.height;
                img.style.aspectRatio = ratio;
            }
            
            // Add placeholder background
            if (!img.style.backgroundColor) {
                img.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
            }
        });

        // Reserve space for dynamic sections
        document.querySelectorAll('[data-min-height]').forEach(element => {
            element.style.minHeight = element.dataset.minHeight;
        });
    }

    stabilizeImages() {
        // Add size attributes to images without them
        document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
            const computedStyle = getComputedStyle(img);
            const width = parseInt(computedStyle.width);
            const height = parseInt(computedStyle.height);
            
            if (width && height) {
                img.setAttribute('width', width);
                img.setAttribute('height', height);
            }
        });

        // Setup image loading observer
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.stabilizeImageLoading(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    stabilizeImageLoading(img) {
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            pointer-events: none;
        `;

        // Add shimmer animation if not exists
        if (!document.querySelector('#shimmer-animation')) {
            const style = document.createElement('style');
            style.id = 'shimmer-animation';
            style.textContent = `
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `;
            document.head.appendChild(style);
        }

        // Wrap image and add placeholder
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        wrapper.appendChild(placeholder);

        // Remove placeholder when image loads
        img.addEventListener('load', () => {
            placeholder.remove();
        }, { once: true });
    }

    preventFontLoadingShifts() {
        // Use font-display: swap in CSS
        document.fonts.ready.then(() => {
            document.body.classList.add('fonts-loaded');
            console.log('✅ Fonts loaded, layout stabilized');
        });

        // Monitor font loading
        if ('fonts' in document) {
            document.fonts.addEventListener('loadingdone', () => {
                console.log('🔤 Font loading complete');
            });
        }
    }

    setupLayoutShiftPrevention() {
        // Monitor for potential layout-shifting elements
        if ('MutationObserver' in window) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                this.preventElementLayoutShift(node);
                            }
                        });
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    preventElementLayoutShift(element) {
        // Add contain property to prevent layout shifts
        if (element.tagName === 'IMG' && !element.getAttribute('width')) {
            element.style.contain = 'layout';
        }

        // Stabilize dynamic content
        if (element.classList.contains('dynamic-content')) {
            element.style.minHeight = element.dataset.minHeight || '100px';
        }
    }

    // OPTIMIZE PAINTING
    optimizePainting() {
        // Use transform and opacity for animations
        this.optimizeAnimations();
        
        // Optimize repaints
        this.optimizeRepaints();
        
        // Setup paint timing measurement
        this.measurePaintTiming();
        
        console.log('🎨 Paint optimizations active');
    }

    optimizeAnimations() {
        // Convert CSS animations to use transform/opacity
        document.querySelectorAll('[data-animate]').forEach(element => {
            const animationType = element.dataset.animate;
            
            switch (animationType) {
                case 'fade-in':
                    element.style.opacity = '0';
                    element.style.transition = 'opacity 0.3s ease';
                    break;
                case 'slide-up':
                    element.style.transform = 'translateY(20px)';
                    element.style.opacity = '0';
                    element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    break;
                case 'scale':
                    element.style.transform = 'scale(0.9)';
                    element.style.transition = 'transform 0.3s ease';
                    break;
            }
            
            // Trigger animation when in view
            this.animateElementWhenVisible(element, animationType);
        });
    }

    animateElementWhenVisible(element, animationType) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        switch (animationType) {
                            case 'fade-in':
                                entry.target.style.opacity = '1';
                                break;
                            case 'slide-up':
                                entry.target.style.transform = 'translateY(0)';
                                entry.target.style.opacity = '1';
                                break;
                            case 'scale':
                                entry.target.style.transform = 'scale(1)';
                                break;
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(element);
    }

    optimizeRepaints() {
        // Reduce unnecessary repaints
        document.querySelectorAll('.hover-effect').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.willChange = 'transform, opacity';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.willChange = 'auto';
            });
        });

        // Optimize scroll-based effects
        this.optimizeScrollEffects();
    }

    optimizeScrollEffects() {
        let scrollRAF = null;
        let lastScrollY = 0;

        window.addEventListener('scroll', () => {
            if (scrollRAF) return;

            scrollRAF = requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const scrollDelta = scrollY - lastScrollY;
                
                // Only update if significant scroll
                if (Math.abs(scrollDelta) > 5) {
                    this.updateScrollEffects(scrollY, scrollDelta);
                    lastScrollY = scrollY;
                }
                
                scrollRAF = null;
            });
        }, { passive: true });
    }

    updateScrollEffects(scrollY, scrollDelta) {
        // Parallax effects
        document.querySelectorAll('[data-parallax]').forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = scrollY * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });

        // Reveal effects
        document.querySelectorAll('[data-scroll-reveal]:not(.revealed)').forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                element.classList.add('revealed');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    measurePaintTiming() {
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.name === 'first-contentful-paint') {
                        console.log('🎨 FCP:', entry.startTime.toFixed(2) + 'ms');
                        this.renderingMetrics.set('FCP', entry.startTime);
                    }
                });
            }).observe({ entryTypes: ['paint'] });
        }
    }

    // SETUP COMPOSITOR LAYERS
    setupCompositorLayers() {
        // Promote elements to compositor layer
        this.promoteToCompositorLayer();
        
        // Manage layer count
        this.manageLayers();
        
        console.log('🏗️ Compositor layer management active');
    }

    promoteToCompositorLayer() {
        // Promote high-frequency animated elements
        document.querySelectorAll('.animate-frequently, .three-scene, .video-container').forEach(element => {
            element.style.willChange = 'transform';
            element.style.transform = 'translateZ(0)'; // Force layer creation
            element.style.contain = 'layout style paint';
        });

        // Promote fixed elements
        document.querySelectorAll('.fixed, [data-fixed]').forEach(element => {
            element.style.willChange = 'transform';
            element.style.transform = 'translateZ(0)';
        });

        // Smart promotion for interactive elements
        document.querySelectorAll('button, .btn, a').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.willChange = 'transform, opacity';
            }, { once: true });
            
            element.addEventListener('mouseleave', () => {
                element.style.willChange = 'auto';
            });
        });
    }

    manageLayers() {
        // Limit number of compositor layers to prevent memory issues
        const maxLayers = 20;
        let layerCount = 0;

        document.querySelectorAll('[style*="willChange"], [style*="translateZ"]').forEach(element => {
            layerCount++;
            if (layerCount > maxLayers) {
                element.style.willChange = 'auto';
                element.style.transform = element.style.transform.replace('translateZ(0)', '');
            }
        });

        console.log('🏗️ Managing', layerCount, 'compositor layers');
    }

    // MONITOR RENDERING PERFORMANCE
    monitorRenderingPerformance() {
        // Monitor frame rate
        this.monitorFrameRate();
        
        // Monitor layout thrashing
        this.monitorLayoutThrashing();
        
        // Monitor memory usage
        this.monitorMemoryUsage();
        
        console.log('📊 Rendering performance monitoring active');
    }

    monitorFrameRate() {
        let frames = 0;
        let lastTime = performance.now();
        
        const checkFrameRate = (currentTime) => {
            frames++;
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                
                if (fps < 45) {
                    console.warn('⚠️ Low FPS detected:', fps);
                    this.reducePaintComplexity();
                }
                
                this.renderingMetrics.set('FPS', fps);
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(checkFrameRate);
        };
        
        requestAnimationFrame(checkFrameRate);
    }

    reducePaintComplexity() {
        if (this.isOptimizing) return;
        this.isOptimizing = true;
        
        // Reduce animation complexity
        document.querySelectorAll('.complex-animation').forEach(element => {
            element.style.animationDuration = '0.1s';
            element.style.animationIterationCount = '1';
        });
        
        // Disable non-critical effects
        document.querySelectorAll('[data-parallax]').forEach(element => {
            element.style.transform = 'none';
        });
        
        console.log('🔧 Reduced paint complexity due to low FPS');
        
        setTimeout(() => {
            this.isOptimizing = false;
        }, 5000);
    }

    monitorLayoutThrashing() {
        let layoutCount = 0;
        const originalGetComputedStyle = window.getComputedStyle;
        
        window.getComputedStyle = function(...args) {
            layoutCount++;
            return originalGetComputedStyle.apply(this, args);
        };
        
        setInterval(() => {
            if (layoutCount > 100) {
                console.warn('⚠️ Layout thrashing detected:', layoutCount, 'calls/second');
            }
            layoutCount = 0;
        }, 1000);
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
                const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576);
                
                if (usedMB > limitMB * 0.9) {
                    console.warn('⚠️ High memory usage:', usedMB + 'MB /' + limitMB + 'MB');
                    this.performMemoryOptimization();
                }
                
                this.renderingMetrics.set('Memory', usedMB);
            }, 10000);
        }
    }

    performMemoryOptimization() {
        // Remove unused elements
        document.querySelectorAll('.loaded:not(.visible)').forEach(element => {
            if (element.dataset.src && !element.getBoundingClientRect().width) {
                element.src = '';
                element.removeAttribute('src');
            }
        });
        
        // Clear cached data
        this.animationFrames.clear();
        
        console.log('🧹 Memory optimization performed');
    }

    // SETUP RESIZE OPTIMIZATION
    setupResizeOptimization() {
        if (!('ResizeObserver' in window)) return;
        
        this.resizeObserver = new ResizeObserver((entries) => {
            // Batch resize handling
            const resizeCallback = () => {
                entries.forEach(entry => {
                    this.handleElementResize(entry);
                });
            };
            
            if (this.resizeRAF) {
                cancelAnimationFrame(this.resizeRAF);
            }
            this.resizeRAF = requestAnimationFrame(resizeCallback);
        });
        
        // Observe critical elements
        document.querySelectorAll('.responsive-element, .video-container, .hero-section').forEach(element => {
            this.resizeObserver.observe(element);
        });
        
        console.log('📐 Resize optimization active');
    }

    handleElementResize(entry) {
        const element = entry.target;
        const { width, height } = entry.contentRect;
        
        // Optimize based on size changes
        if (element.classList.contains('video-container')) {
            const video = element.querySelector('video');
            if (video && width < 600) {
                video.style.objectFit = 'cover';
                video.style.objectPosition = 'center';
            }
        }
        
        // Update aspect ratios
        if (element.dataset.maintainRatio) {
            const ratio = parseFloat(element.dataset.maintainRatio);
            element.style.height = (width / ratio) + 'px';
        }
    }

    // PUBLIC API
    getMetrics() {
        return {
            renderingMetrics: Object.fromEntries(this.renderingMetrics),
            layoutShiftScore: this.layoutShiftScore,
            activeAnimationFrames: this.animationFrames.size,
            isOptimizing: this.isOptimizing
        };
    }

    optimizeElement(element) {
        // Manual element optimization
        element.style.contain = 'layout style paint';
        element.style.willChange = 'transform';
        element.style.transform = 'translateZ(0)';
        
        console.log('🎨 Element optimized:', element.tagName, element.className);
    }

    disableAnimations() {
        // Emergency performance mode
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
        
        console.log('🚫 Animations disabled for performance');
    }
}

// Initialize Render Optimizer
const renderOptimizer = new RenderOptimizer();

// Export for global access
window.RenderOptimizer = renderOptimizer;

// Utility functions
window.optimizeElement = (element) => renderOptimizer.optimizeElement(element);
window.getRenderingMetrics = () => renderOptimizer.getMetrics();
window.emergencyPerformanceMode = () => renderOptimizer.disableAnimations();