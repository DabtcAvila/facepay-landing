// FacePay - Professional Animation System
// Performance-optimized animations with hardware acceleration

(function() {
    'use strict';

    // Performance monitoring
    const FPS_THRESHOLD = 30;
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let currentFPS = 60;

    // Device capability detection
    const DEVICE_CAPABILITY = detectDeviceCapability();

    function detectDeviceCapability() {
        const cores = navigator.hardwareConcurrency || 4;
        const memory = navigator.deviceMemory || 4;
        const connection = navigator.connection;
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile || cores < 4 || memory < 4) {
            return 'low';
        } else if (cores >= 8 && memory >= 8) {
            return 'high';
        }
        return 'medium';
    }

    // Intersection Observer for lazy animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counters if present
                const counters = entry.target.querySelectorAll('[data-counter]');
                if (counters.length > 0) {
                    animateCounters(counters);
                }
                
                // Unobserve after animation
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Counter animation
    function animateCounters(counters) {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-counter'));
            const duration = parseInt(counter.getAttribute('data-duration') || '2000');
            const start = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(easeOutQuart * target);
                
                counter.textContent = currentValue.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            }
            
            requestAnimationFrame(updateCounter);
        });
    }

    // Parallax scrolling
    function initParallax() {
        if (DEVICE_CAPABILITY === 'low') return;
        
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-parallax') || '0.5';
                const offset = element.getBoundingClientRect().top + scrolled;
                const yPos = -(scrolled - offset) * parseFloat(speed);
                
                if (offset < scrolled + windowHeight && offset + element.offsetHeight > scrolled) {
                    element.style.transform = `translateY(${yPos}px)`;
                }
            });
        }
        
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
                setTimeout(() => { ticking = false; }, 16);
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Mouse tracking effect
    function initMouseTracking() {
        if (DEVICE_CAPABILITY === 'low') return;
        
        const trackingElements = document.querySelectorAll('[data-mouse-track]');
        
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;
            
            trackingElements.forEach(element => {
                const intensity = element.getAttribute('data-mouse-track') || '10';
                const x = mouseX * parseFloat(intensity);
                const y = mouseY * parseFloat(intensity);
                
                element.style.transform = `translate(${x}px, ${y}px)`;
            });
        }, { passive: true });
    }

    // Magnetic button effect
    function initMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.magnetic-button');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Text reveal animation
    function initTextReveal() {
        const revealElements = document.querySelectorAll('[data-text-reveal]');
        
        revealElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            [...text].forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = `${index * 30}ms`;
                span.classList.add('char-reveal');
                element.appendChild(span);
            });
        });
    }

    // Smooth scroll
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Stagger animations
    function initStaggerAnimations() {
        const staggerGroups = document.querySelectorAll('[data-stagger]');
        
        staggerGroups.forEach(group => {
            const children = group.children;
            const delay = parseInt(group.getAttribute('data-stagger') || '100');
            
            Array.from(children).forEach((child, index) => {
                child.style.animationDelay = `${index * delay}ms`;
                child.classList.add('stagger-child');
            });
        });
    }

    // Scroll progress indicator
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #10b981, #059669);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        function updateProgress() {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.pageYOffset;
            const progress = (scrolled / scrollHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        window.addEventListener('scroll', updateProgress, { passive: true });
    }

    // FPS Monitor
    function monitorFPS() {
        const now = performance.now();
        const delta = now - lastFrameTime;
        
        frameCount++;
        if (frameCount >= 60) {
            currentFPS = Math.round(1000 / (delta / 60));
            frameCount = 0;
            
            // Adjust quality if FPS drops
            if (currentFPS < FPS_THRESHOLD && DEVICE_CAPABILITY !== 'low') {
                document.body.classList.add('reduce-animations');
            }
        }
        
        lastFrameTime = now;
        requestAnimationFrame(monitorFPS);
    }

    // Initialize everything
    function init() {
        // Respect reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            document.body.classList.add('reduce-motion');
            return;
        }
        
        // Setup animations based on device capability
        document.body.classList.add(`device-${DEVICE_CAPABILITY}`);
        
        // Initialize all animation systems
        initParallax();
        initMouseTracking();
        initMagneticButtons();
        initTextReveal();
        initSmoothScroll();
        initStaggerAnimations();
        initScrollProgress();
        
        // Start FPS monitoring
        if (DEVICE_CAPABILITY === 'high') {
            requestAnimationFrame(monitorFPS);
        }
        
        // Observe elements for animation
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            animationObserver.observe(element);
        });
        
        // Face scan animation
        initFaceScanAnimation();
        
        // Particle system
        if (DEVICE_CAPABILITY !== 'low') {
            initParticleSystem();
        }
    }

    // Face scan animation
    function initFaceScanAnimation() {
        const scanOverlay = document.createElement('div');
        scanOverlay.className = 'face-scan-overlay';
        scanOverlay.innerHTML = `
            <div class="scan-line"></div>
            <div class="scan-corners">
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
            </div>
        `;
        
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.appendChild(scanOverlay);
        }
    }

    // Simple particle system
    function initParticleSystem() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        document.body.appendChild(particleContainer);
        
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(16, 185, 129, 0.8);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particle-float ${5 + Math.random() * 10}s linear infinite;
            `;
            particleContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 15000);
        }
        
        // Create particles periodically
        setInterval(() => {
            if (particleContainer.children.length < 30) {
                createParticle();
            }
        }, 500);
    }

    // Add CSS for particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particle-float {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(50px);
                opacity: 0;
            }
        }
        
        .char-reveal {
            display: inline-block;
            opacity: 0;
            animation: char-fade-in 0.5s ease forwards;
        }
        
        @keyframes char-fade-in {
            to {
                opacity: 1;
                transform: translateY(0);
            }
            from {
                opacity: 0;
                transform: translateY(10px);
            }
        }
        
        .stagger-child {
            opacity: 0;
            animation: stagger-fade-in 0.6s ease forwards;
        }
        
        @keyframes stagger-fade-in {
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
            }
        }
        
        .reduce-motion * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for external use
    window.FacePayAnimations = {
        init,
        animateCounters,
        DEVICE_CAPABILITY
    };

})();