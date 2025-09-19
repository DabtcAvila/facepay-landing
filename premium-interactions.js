// FacePay Premium Interactions - Final Integration
(function() {
    'use strict';

    // Premium Animation Engine
    class FacePayPremium {
        constructor() {
            this.isHighPerformance = navigator.hardwareConcurrency >= 4;
            this.magneticButtons = [];
            this.textElements = [];
            this.init();
        }

        init() {
            this.initTextReveals();
            this.initMagneticButtons();
            this.initScrollAnimations();
            this.initFaceIDScanner();
            this.initStatsCounters();
            this.initSuccessStates();
            this.initPerformanceMonitoring();
        }

        // Text Reveal Premium
        initTextReveals() {
            const textElements = document.querySelectorAll('[data-text-reveal]');
            
            textElements.forEach(element => {
                const config = JSON.parse(element.getAttribute('data-text-reveal') || '{}');
                const text = element.textContent;
                element.textContent = '';
                
                [...text].forEach((char, index) => {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.textContent = char === ' ' ? '\u00A0' : char;
                    span.style.animationDelay = `${(config.stagger || 50) * index}ms`;
                    element.appendChild(span);
                });
            });
        }

        // Magnetic Buttons Premium
        initMagneticButtons() {
            const buttons = document.querySelectorAll('.btn-magnetic');
            
            buttons.forEach(button => {
                let isHovering = false;
                
                button.addEventListener('mouseenter', () => {
                    isHovering = true;
                    button.style.transition = 'transform 0.1s ease';
                });
                
                button.addEventListener('mouseleave', () => {
                    isHovering = false;
                    button.style.transform = 'translate(0, 0) scale(1)';
                    button.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                });
                
                button.addEventListener('mousemove', (e) => {
                    if (!isHovering) return;
                    
                    const rect = button.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    const deltaX = (e.clientX - centerX) * 0.15;
                    const deltaY = (e.clientY - centerY) * 0.15;
                    
                    button.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
                    
                    // Update CSS custom properties for hover effects
                    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
                    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
                    button.style.setProperty('--mouse-x', `${mouseX}%`);
                    button.style.setProperty('--mouse-y', `${mouseY}%`);
                });

                // Add click ripple effect
                button.addEventListener('click', (e) => {
                    const ripple = document.createElement('div');
                    const rect = button.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.cssText = `
                        position: absolute;
                        width: ${size}px;
                        height: ${size}px;
                        left: ${x}px;
                        top: ${y}px;
                        background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
                        border-radius: 50%;
                        pointer-events: none;
                        animation: rippleEffect 0.6s ease-out;
                    `;
                    
                    button.style.position = 'relative';
                    button.appendChild(ripple);
                    
                    setTimeout(() => ripple.remove(), 600);
                });
            });
        }

        // Scroll Animations Premium
        initScrollAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const config = JSON.parse(element.getAttribute('data-scroll-reveal') || '{}');
                        
                        element.style.animationDelay = `${config.delay || 0}ms`;
                        element.classList.add('animate-in');
                        
                        // Special handling for stats
                        if (element.classList.contains('stat') || element.querySelector('[data-count]')) {
                            this.animateCounter(element);
                        }
                        
                        observer.unobserve(element);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe elements
            document.querySelectorAll('[data-scroll-reveal], .stat, .animate-on-scroll').forEach(el => {
                observer.observe(el);
            });
        }

        // Face ID Scanner Premium
        initFaceIDScanner() {
            const scanner = document.querySelector('.face-scan');
            if (!scanner) return;

            // Auto-start scanning after delay
            setTimeout(() => {
                scanner.classList.add('scanning');
                
                // Success state after scan
                setTimeout(() => {
                    scanner.classList.add('scan-success');
                    this.showSuccessIndicator();
                }, 3000);
                
                // Reset cycle
                setTimeout(() => {
                    scanner.classList.remove('scanning', 'scan-success');
                }, 6000);
            }, 2000);

            // Click to activate
            scanner.addEventListener('click', () => {
                scanner.classList.toggle('scanning');
            });
        }

        // Stats Counters Premium
        animateCounter(element) {
            const counters = element.querySelectorAll('[data-count]');
            if (counters.length === 0) return;

            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const start = performance.now();
                
                const animate = (currentTime) => {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function - ease out cubic
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(easeOut * target);
                    
                    counter.textContent = current.toLocaleString();
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        counter.textContent = target.toLocaleString();
                        // Add final emphasis
                        counter.style.animation = 'successBounce 0.4s ease-out';
                    }
                };
                
                requestAnimationFrame(animate);
            });
        }

        initStatsCounters() {
            // Enhanced stats with hover effects
            const stats = document.querySelectorAll('.stat');
            stats.forEach(stat => {
                stat.classList.add('stat-enhanced');
                
                stat.addEventListener('mouseenter', () => {
                    stat.style.transform = 'translateY(-8px) scale(1.05)';
                });
                
                stat.addEventListener('mouseleave', () => {
                    stat.style.transform = 'translateY(0) scale(1)';
                });
            });
        }

        // Success States Premium
        initSuccessStates() {
            // Enhanced download and beta functions
            window.downloadAppPremium = () => {
                const button = event.target.closest('.btn');
                this.showLoadingState(button);
                
                setTimeout(() => {
                    this.showSuccessState(button, 'Download Started!');
                    // Original function
                    if (typeof downloadApp === 'function') downloadApp();
                }, 1500);
            };

            window.joinBetaPremium = () => {
                const button = event.target.closest('.btn');
                this.showLoadingState(button);
                
                setTimeout(() => {
                    this.showSuccessState(button, 'Welcome to Beta!');
                    // Original function
                    if (typeof joinBeta === 'function') joinBeta();
                }, 1500);
            };
        }

        showLoadingState(button) {
            const originalText = button.innerHTML;
            button.dataset.originalText = originalText;
            
            button.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 16px; height: 16px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    Loading...
                </div>
            `;
            button.disabled = true;
        }

        showSuccessState(button, message) {
            button.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="success-checkmark"></div>
                    ${message}
                </div>
            `;
            
            setTimeout(() => {
                button.innerHTML = button.dataset.originalText;
                button.disabled = false;
            }, 2000);
        }

        showSuccessIndicator() {
            const indicator = document.createElement('div');
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, var(--primary), #34d399);
                color: white;
                padding: 12px 20px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
                z-index: 1000;
                animation: slideInRight 0.3s ease-out;
                font-weight: 500;
            `;
            indicator.innerHTML = '✓ Face ID Verified';
            
            document.body.appendChild(indicator);
            
            setTimeout(() => {
                indicator.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => indicator.remove(), 300);
            }, 2000);
        }

        // Performance Monitoring Premium
        initPerformanceMonitoring() {
            if (!this.isHighPerformance) {
                // Reduce animations for lower-end devices
                document.body.classList.add('reduced-animations');
                
                const style = document.createElement('style');
                style.textContent = `
                    .reduced-animations * {
                        animation-duration: 0.3s !important;
                        transition-duration: 0.2s !important;
                    }
                    .reduced-animations .face-scan {
                        display: none;
                    }
                `;
                document.head.appendChild(style);
            }

            // FPS monitoring
            let frameCount = 0;
            let lastTime = performance.now();
            
            const monitor = () => {
                frameCount++;
                const currentTime = performance.now();
                
                if (currentTime - lastTime >= 1000) {
                    const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                    
                    if (fps < 30 && this.isHighPerformance) {
                        // Reduce quality
                        document.body.classList.add('reduced-animations');
                        console.log('FacePay: Reduced animation quality for performance');
                    }
                    
                    frameCount = 0;
                    lastTime = currentTime;
                }
                
                requestAnimationFrame(monitor);
            };
            
            if (this.isHighPerformance) {
                requestAnimationFrame(monitor);
            }
        }
    }

    // Add required CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleEffect {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes slideInRight {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) scale(1) !important;
        }
        
        [data-scroll-reveal] {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .face-scan.scanning .face-scan-overlay {
            border-color: var(--primary);
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
        }
        
        .face-scan.scan-success .face-scan-overlay {
            border-color: #22c55e;
            animation: successPulse 0.6s ease-out;
        }
        
        @keyframes successPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new FacePayPremium());
    } else {
        new FacePayPremium();
    }

    // Global access
    window.FacePayPremium = FacePayPremium;

})();