/**
 * CRITICAL SCRIPTS - Minimal JavaScript for above-the-fold content
 * Target: < 15KB compressed, < 50ms execution time
 */

class CriticalApp {
    constructor() {
        this.isHighPerf = navigator.hardwareConcurrency >= 4;
        this.loadStartTime = performance.now();
        this.observers = new Map();
        
        // Initialize immediately
        this.init();
    }

    init() {
        // 1. Critical performance measurements
        this.measureWebVitals();
        
        // 2. Early interaction handlers
        this.setupEarlyHandlers();
        
        // 3. Critical lazy loading
        this.setupCriticalObservers();
        
        // 4. Schedule non-critical loading
        this.scheduleNonCritical();
        
        console.log('⚡ Critical app initialized:', (performance.now() - this.loadStartTime).toFixed(2) + 'ms');
    }

    // CORE WEB VITALS MEASUREMENT
    measureWebVitals() {
        if (!('PerformanceObserver' in window)) return;

        // LCP - Target < 1.2s (excellent)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lcp = entries[entries.length - 1];
            const lcpTime = lcp.startTime;
            
            console.log('🎯 LCP:', lcpTime.toFixed(2) + 'ms', lcpTime < 1200 ? '✅ EXCELLENT' : lcpTime < 2500 ? '🟡 GOOD' : '🔴 POOR');
            
            // Track LCP element for optimization
            if (lcp.element) {
                lcp.element.dataset.lcpElement = 'true';
            }
            
            this.trackWebVital('LCP', lcpTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // FID - Target < 50ms (excellent)
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                const fidTime = entry.processingStart - entry.startTime;
                console.log('🎯 FID:', fidTime.toFixed(2) + 'ms', fidTime < 50 ? '✅ EXCELLENT' : fidTime < 100 ? '🟡 GOOD' : '🔴 POOR');
                this.trackWebVital('FID', fidTime);
            }
        }).observe({ entryTypes: ['first-input'] });

        // CLS - Target < 0.05 (excellent)
        let clsValue = 0;
        let sessionValue = 0;
        let sessionEntries = [];
        
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    const firstSessionEntry = sessionEntries[0];
                    const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

                    if (sessionValue && 
                        entry.startTime - lastSessionEntry.startTime < 1000 &&
                        entry.startTime - firstSessionEntry.startTime < 5000) {
                        sessionValue += entry.value;
                        sessionEntries.push(entry);
                    } else {
                        sessionValue = entry.value;
                        sessionEntries = [entry];
                    }

                    if (sessionValue > clsValue) {
                        clsValue = sessionValue;
                        console.log('🎯 CLS:', clsValue.toFixed(4), clsValue < 0.05 ? '✅ EXCELLENT' : clsValue < 0.1 ? '🟡 GOOD' : '🔴 POOR');
                        this.trackWebVital('CLS', clsValue);
                    }
                }
            }
        }).observe({ entryTypes: ['layout-shift'] });

        // FCP - Target < 0.9s (excellent)
        new PerformanceObserver((list) => {
            const fcp = list.getEntries()[0];
            const fcpTime = fcp.startTime;
            console.log('🎯 FCP:', fcpTime.toFixed(2) + 'ms', fcpTime < 900 ? '✅ EXCELLENT' : fcpTime < 1800 ? '🟡 GOOD' : '🔴 POOR');
            this.trackWebVital('FCP', fcpTime);
        }).observe({ entryTypes: ['paint'] });

        // TTFB - Target < 200ms (excellent)
        new PerformanceObserver((list) => {
            const navEntry = list.getEntries()[0];
            const ttfb = navEntry.responseStart - navEntry.requestStart;
            console.log('🎯 TTFB:', ttfb.toFixed(2) + 'ms', ttfb < 200 ? '✅ EXCELLENT' : ttfb < 600 ? '🟡 GOOD' : '🔴 POOR');
            this.trackWebVital('TTFB', ttfb);
        }).observe({ entryTypes: ['navigation'] });
    }

    trackWebVital(metric, value) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
                metric_name: metric,
                metric_value: Math.round(value),
                metric_rating: this.getVitalRating(metric, value)
            });
        }
    }

    getVitalRating(metric, value) {
        const thresholds = {
            LCP: { excellent: 1200, good: 2500 },
            FID: { excellent: 50, good: 100 },
            FCP: { excellent: 900, good: 1800 },
            CLS: { excellent: 0.05, good: 0.1 },
            TTFB: { excellent: 200, good: 600 }
        };
        
        const t = thresholds[metric];
        return value < t.excellent ? 'excellent' : value < t.good ? 'good' : 'poor';
    }

    // EARLY INTERACTION HANDLERS
    setupEarlyHandlers() {
        // Face ID Scanner early interaction
        const faceScanner = document.getElementById('faceScanner');
        if (faceScanner) {
            this.initFaceScanner(faceScanner);
        }

        // Critical CTA handlers
        document.addEventListener('click', this.handleCriticalClick.bind(this), { passive: true });

        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }, { passive: false });

        // Early scroll tracking (throttled)
        let scrollRAF = null;
        window.addEventListener('scroll', () => {
            if (scrollRAF) return;
            scrollRAF = requestAnimationFrame(() => {
                this.handleScroll();
                scrollRAF = null;
            });
        }, { passive: true });
    }

    handleCriticalClick(e) {
        const button = e.target.closest('button, .btn');
        if (!button) return;

        // Add immediate visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);

        // Track early engagement
        this.trackEarlyEngagement(button);
    }

    trackEarlyEngagement(element) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'early_engagement', {
                element_type: element.tagName.toLowerCase(),
                element_text: element.textContent.trim().substring(0, 20),
                timing: (performance.now() - this.loadStartTime).toFixed(0)
            });
        }
    }

    // CRITICAL OBSERVERS
    setupCriticalObservers() {
        const options = {
            rootMargin: '50px',
            threshold: 0.1
        };

        // Video lazy loading observer
        this.observers.set('videos', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadVideo(entry.target);
                    this.observers.get('videos').unobserve(entry.target);
                }
            });
        }, options));

        // Image lazy loading observer
        this.observers.set('images', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observers.get('images').unobserve(entry.target);
                }
            });
        }, options));

        // Apply observers to existing elements
        this.applyObservers();
    }

    applyObservers() {
        // Observe videos
        document.querySelectorAll('video[data-src]').forEach(video => {
            this.observers.get('videos').observe(video);
        });

        // Observe images
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.observers.get('images').observe(img);
        });
    }

    loadVideo(video) {
        const src = video.dataset.src;
        if (src) {
            video.src = src;
            video.load();
            video.removeAttribute('data-src');
            console.log('📹 Video loaded:', src.substring(0, 30) + '...');
        }
    }

    loadImage(img) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;
        
        if (srcset) img.srcset = srcset;
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            }, { once: true });
            console.log('🖼️ Image loaded:', src.substring(0, 30) + '...');
        }
    }

    // FACE ID SCANNER (Critical Component)
    initFaceScanner(container) {
        let isScanning = false;
        let scanComplete = false;
        
        const elements = {
            frame: container.querySelector('.scanner-frame'),
            outline: container.querySelector('.face-outline'),
            dots: container.querySelector('.biometric-dots'),
            line: container.querySelector('.scanning-line'),
            checkmark: container.querySelector('.success-checkmark'),
            status: container.querySelector('.status-text')
        };

        // Create biometric dots
        const dotPositions = [
            { x: '50%', y: '25%' }, { x: '35%', y: '40%' }, { x: '65%', y: '40%' },
            { x: '30%', y: '55%' }, { x: '70%', y: '55%' }, { x: '50%', y: '60%' },
            { x: '40%', y: '72%' }, { x: '60%', y: '72%' }, { x: '50%', y: '80%' }
        ];

        dotPositions.forEach((pos, i) => {
            const dot = document.createElement('div');
            dot.className = 'bio-dot';
            dot.style.cssText = `position:absolute;left:${pos.x};top:${pos.y};transform:translate(-50%,-50%);width:3px;height:3px;background:rgba(255,255,255,0.4);border-radius:50%;opacity:0;transition:all 200ms ease`;
            elements.dots.appendChild(dot);
        });

        const startScan = () => {
            if (isScanning) return;
            
            isScanning = true;
            scanComplete = false;
            
            elements.frame.classList.add('scanning');
            elements.outline.classList.add('scanning');
            elements.line.classList.add('active');
            elements.status.classList.add('scanning');
            elements.status.textContent = 'Scanning Face...';
            
            // Animate dots
            const dots = elements.dots.querySelectorAll('.bio-dot');
            dots.forEach((dot, i) => {
                setTimeout(() => {
                    if (isScanning) {
                        dot.style.opacity = '1';
                        dot.style.background = 'var(--primary)';
                        dot.style.boxShadow = '0 0 12px var(--primary)';
                    }
                }, i * 100);
            });
            
            // Complete scan
            setTimeout(() => {
                isScanning = false;
                scanComplete = true;
                
                elements.frame.classList.remove('scanning');
                elements.frame.classList.add('success');
                elements.outline.classList.remove('scanning');
                elements.outline.classList.add('success');
                elements.line.classList.remove('active');
                elements.status.classList.remove('scanning');
                elements.status.classList.add('success');
                elements.status.textContent = 'Authenticated ✓';
                elements.checkmark.classList.add('show');
                
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                
                // Reset after delay
                setTimeout(() => {
                    elements.frame.classList.remove('success');
                    elements.outline.classList.remove('success');
                    elements.checkmark.classList.remove('show');
                    elements.status.classList.remove('success');
                    elements.status.textContent = 'Face ID Ready';
                    
                    dots.forEach(dot => {
                        dot.style.opacity = '0';
                        dot.style.background = 'rgba(255,255,255,0.4)';
                        dot.style.boxShadow = 'none';
                    });
                    
                    scanComplete = false;
                }, 4000);
            }, 3000);
        };

        // Event handlers
        container.addEventListener('click', startScan);
        container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startScan();
        });

        // Auto-demo
        const startAutoDemo = () => {
            setTimeout(() => {
                if (!isScanning && !scanComplete) startScan();
            }, 4000);
        };

        // Intersection observer for auto-demo
        if (window.IntersectionObserver) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startAutoDemo();
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(container);
        }
    }

    // SCROLL HANDLING
    handleScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrollPercent = Math.round((scrollY / (docHeight - windowHeight)) * 100);
        
        // Track scroll milestones
        if (!this.scrollMilestones) this.scrollMilestones = new Set();
        
        [25, 50, 75, 90].forEach(milestone => {
            if (scrollPercent >= milestone && !this.scrollMilestones.has(milestone)) {
                this.scrollMilestones.add(milestone);
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth', {
                        event_category: 'engagement',
                        value: milestone
                    });
                }
            }
        });
    }

    // SCHEDULE NON-CRITICAL LOADING
    scheduleNonCritical() {
        // Load non-critical resources after critical rendering
        this.scheduleTask(() => this.loadNonCritical(), 2000);
    }

    scheduleTask(callback, delay) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                setTimeout(callback, delay);
            }, { timeout: delay + 1000 });
        } else {
            setTimeout(callback, delay);
        }
    }

    async loadNonCritical() {
        try {
            // Load animations system
            if (!document.querySelector('link[href="micro-animations.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'micro-animations.css';
                document.head.appendChild(link);
            }

            // Load performance manager
            if (window.PerformanceManager) {
                window.PerformanceManager.init();
            }

            console.log('🔄 Non-critical resources loaded');
        } catch (error) {
            console.warn('Non-critical loading failed:', error);
        }
    }
}

// Initialize critical app
const criticalApp = new CriticalApp();

// Export for debugging
window.CriticalApp = criticalApp;

// Critical utilities
window.downloadApp = function() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', { event_category: 'Download' });
    }
    window.open('https://testflight.apple.com/join/facepay-beta', '_blank');
};

window.joinBeta = function() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'signup', { event_category: 'Beta' });
    }
    const email = prompt('Enter your email for exclusive beta access:');
    if (email?.includes('@')) {
        alert('🎉 You\'re in! Check your email for beta access.');
    }
};

// Performance monitoring
const startTime = performance.now();
window.addEventListener('load', () => {
    const loadTime = performance.now() - startTime;
    console.log('⚡ Total load time:', loadTime.toFixed(2) + 'ms');
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
            name: 'load',
            value: Math.round(loadTime)
        });
    }
});