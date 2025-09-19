/**
 * FacePay Mobile Components - Enhanced Interactive Components
 * Native-like mobile components with premium interactions
 */

class MobileComponents {
    constructor() {
        this.components = new Map();
        this.observers = new Map();
        this.init();
    }

    init() {
        this.initFaceIDDemo();
        this.initStatsCounter();
        this.initTestimonialCarousel();
        this.initPullToRefresh();
        this.initInfiniteScroll();
        this.initModalSystem();
        this.initToastSystem();
        this.initProgressIndicators();
    }

    // Enhanced Face ID Demo Component
    initFaceIDDemo() {
        const faceIDContainers = document.querySelectorAll('.face-id-demo');
        
        faceIDContainers.forEach(container => {
            const demo = new FaceIDDemo(container);
            this.components.set(container, demo);
        });
    }

    // Stats Counter with Mobile Optimizations
    initStatsCounter() {
        const statsElements = document.querySelectorAll('[data-count-to]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsElements.forEach(el => observer.observe(el));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count-to'));
        const duration = parseInt(element.getAttribute('data-duration') || '2000');
        const prefix = element.getAttribute('data-prefix') || '';
        const suffix = element.getAttribute('data-suffix') || '';
        
        let start = 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            
            element.textContent = prefix + current.toLocaleString() + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = prefix + target.toLocaleString() + suffix;
                element.style.animation = 'successBounce 0.4s ease-out';
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Mobile-Optimized Testimonial Carousel
    initTestimonialCarousel() {
        const carousels = document.querySelectorAll('.testimonial-carousel');
        
        carousels.forEach(carousel => {
            const testimonialCarousel = new TestimonialCarousel(carousel);
            this.components.set(carousel, testimonialCarousel);
        });
    }

    // Pull to Refresh
    initPullToRefresh() {
        let startY = 0;
        let pullDistance = 0;
        let isPulling = false;
        const threshold = 100;
        
        const pullIndicator = document.createElement('div');
        pullIndicator.className = 'pull-indicator';
        pullIndicator.innerHTML = `
            <div class="pull-icon">⬇</div>
            <div class="pull-text">Pull to refresh</div>
        `;
        
        document.body.insertAdjacentElement('afterbegin', pullIndicator);
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!isPulling) return;
            
            pullDistance = e.touches[0].clientY - startY;
            
            if (pullDistance > 0) {
                e.preventDefault();
                const opacity = Math.min(pullDistance / threshold, 1);
                const scale = 0.5 + (opacity * 0.5);
                
                pullIndicator.style.transform = `translateY(${Math.min(pullDistance * 0.5, 50)}px) scale(${scale})`;
                pullIndicator.style.opacity = opacity;
                
                if (pullDistance > threshold) {
                    pullIndicator.classList.add('ready');
                    if (window.mobileTouchPremium) {
                        window.mobileTouchPremium.triggerHaptic('medium');
                    }
                } else {
                    pullIndicator.classList.remove('ready');
                }
            }
        }, { passive: false });
        
        document.addEventListener('touchend', () => {
            if (isPulling && pullDistance > threshold) {
                this.triggerRefresh();
            }
            
            isPulling = false;
            pullDistance = 0;
            pullIndicator.style.transform = 'translateY(-100px) scale(0.5)';
            pullIndicator.style.opacity = '0';
            pullIndicator.classList.remove('ready');
        }, { passive: true });
    }

    triggerRefresh() {
        const refreshEvent = new CustomEvent('pullRefresh');
        document.dispatchEvent(refreshEvent);
        
        // Show refresh animation
        this.showToast('Refreshing...', 'info');
        
        // Simulate refresh
        setTimeout(() => {
            this.showToast('Content updated!', 'success');
        }, 1500);
    }

    // Toast Notification System
    initToastSystem() {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: calc(var(--space-4) + env(safe-area-inset-top));
            left: var(--space-4);
            right: var(--space-4);
            z-index: 1000;
            pointer-events: none;
        `;
        document.body.appendChild(toastContainer);
        
        this.toastContainer = toastContainer;
    }

    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-message">${message}</div>
        `;
        
        toast.style.cssText = `
            display: flex;
            align-items: center;
            gap: var(--space-3);
            padding: var(--space-4) var(--space-5);
            margin-bottom: var(--space-2);
            background: ${this.getToastColor(type)};
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-lg);
            color: white;
            font-weight: 500;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            transform: translateY(-100px);
            opacity: 0;
            transition: all var(--duration-medium) var(--ease-out);
            pointer-events: auto;
        `;
        
        this.toastContainer.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });
        
        // Auto remove
        setTimeout(() => {
            toast.style.transform = 'translateY(-100px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, duration);
        
        // Manual dismiss
        toast.addEventListener('click', () => {
            toast.style.transform = 'translateY(-100px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        });
        
        return toast;
    }

    getToastColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #22c55e, #16a34a)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
            info: 'linear-gradient(135deg, var(--primary), var(--secondary))'
        };
        return colors[type] || colors.info;
    }

    // Modal System
    initModalSystem() {
        this.modals = new Map();
        
        // Global modal backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 999;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            opacity: 0;
            visibility: hidden;
            transition: all var(--duration-medium) var(--ease-out);
        `;
        
        document.body.appendChild(backdrop);
        this.modalBackdrop = backdrop;
        
        backdrop.addEventListener('click', () => this.closeModal());
    }

    showModal(content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            z-index: 1000;
            max-width: calc(100vw - var(--space-8));
            max-height: calc(100vh - var(--space-8));
            background: var(--dark);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--radius-2xl);
            padding: var(--space-6);
            box-shadow: var(--shadow-xl);
            opacity: 0;
            transition: all var(--duration-medium) var(--ease-out);
            overflow: auto;
        `;
        
        if (options.title) {
            const title = document.createElement('h3');
            title.textContent = options.title;
            title.style.cssText = `
                font-size: var(--text-xl);
                font-weight: 600;
                margin-bottom: var(--space-4);
                color: var(--primary);
            `;
            modal.appendChild(title);
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = content;
        modal.appendChild(contentDiv);
        
        if (options.actions) {
            const actions = document.createElement('div');
            actions.style.cssText = `
                display: flex;
                gap: var(--space-3);
                margin-top: var(--space-6);
                justify-content: flex-end;
            `;
            
            options.actions.forEach(action => {
                const btn = document.createElement('button');
                btn.className = `btn ${action.variant || 'btn-secondary'}`;
                btn.textContent = action.text;
                btn.onclick = action.onClick;
                actions.appendChild(btn);
            });
            
            modal.appendChild(actions);
        }
        
        document.body.appendChild(modal);
        
        // Show
        requestAnimationFrame(() => {
            this.modalBackdrop.style.opacity = '1';
            this.modalBackdrop.style.visibility = 'visible';
            modal.style.opacity = '1';
            modal.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        this.currentModal = modal;
        return modal;
    }

    closeModal() {
        if (this.currentModal) {
            this.modalBackdrop.style.opacity = '0';
            this.modalBackdrop.style.visibility = 'hidden';
            this.currentModal.style.opacity = '0';
            this.currentModal.style.transform = 'translate(-50%, -50%) scale(0.9)';
            
            setTimeout(() => {
                if (this.currentModal) {
                    this.currentModal.remove();
                    this.currentModal = null;
                }
            }, 300);
        }
    }

    // Progress Indicators
    initProgressIndicators() {
        // Circular progress
        this.createProgressStyles();
    }

    createProgressStyles() {
        const progressStyle = document.createElement('style');
        progressStyle.textContent = `
            .progress-circle {
                width: 60px;
                height: 60px;
                position: relative;
            }
            
            .progress-circle svg {
                width: 100%;
                height: 100%;
                transform: rotate(-90deg);
            }
            
            .progress-circle-bg {
                fill: none;
                stroke: rgba(255, 255, 255, 0.1);
                stroke-width: 4;
            }
            
            .progress-circle-fill {
                fill: none;
                stroke: var(--primary);
                stroke-width: 4;
                stroke-linecap: round;
                stroke-dasharray: 157;
                stroke-dashoffset: 157;
                transition: stroke-dashoffset var(--duration-slow) var(--ease-out);
            }
            
            .progress-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: var(--text-sm);
                font-weight: 600;
                color: var(--primary);
            }
            
            .pull-indicator {
                position: fixed;
                top: 0;
                left: 50%;
                transform: translateX(-50%) translateY(-100px) scale(0.5);
                z-index: 1000;
                background: var(--dark);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: var(--radius-full);
                padding: var(--space-3);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: var(--space-1);
                opacity: 0;
                transition: all var(--duration-medium) var(--ease-out);
                min-width: 80px;
            }
            
            .pull-indicator.ready {
                border-color: var(--primary);
                background: var(--primary-50);
            }
            
            .pull-icon {
                font-size: var(--text-lg);
                transition: transform var(--duration-fast) var(--ease-out);
            }
            
            .pull-indicator.ready .pull-icon {
                transform: rotate(180deg);
                color: var(--primary);
            }
            
            .pull-text {
                font-size: var(--text-xs);
                color: var(--text-secondary);
            }
            
            .pull-indicator.ready .pull-text {
                color: var(--primary);
            }
            
            /* Success Bounce Animation */
            @keyframes successBounce {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(progressStyle);
    }

    createProgressCircle(progress = 0) {
        const container = document.createElement('div');
        container.className = 'progress-circle';
        container.innerHTML = `
            <svg>
                <circle class="progress-circle-bg" cx="30" cy="30" r="25"></circle>
                <circle class="progress-circle-fill" cx="30" cy="30" r="25"></circle>
            </svg>
            <div class="progress-text">${Math.round(progress)}%</div>
        `;
        
        const fill = container.querySelector('.progress-circle-fill');
        const text = container.querySelector('.progress-text');
        
        container.setProgress = (newProgress) => {
            const offset = 157 - (157 * newProgress / 100);
            fill.style.strokeDashoffset = offset;
            text.textContent = `${Math.round(newProgress)}%`;
        };
        
        container.setProgress(progress);
        return container;
    }

    // Utility Methods
    addComponent(element, component) {
        this.components.set(element, component);
    }

    removeComponent(element) {
        const component = this.components.get(element);
        if (component && component.destroy) {
            component.destroy();
        }
        this.components.delete(element);
    }

    destroy() {
        this.components.forEach((component) => {
            if (component.destroy) component.destroy();
        });
        this.components.clear();
        
        this.observers.forEach((observer) => observer.disconnect());
        this.observers.clear();
    }
}

// Face ID Demo Component
class FaceIDDemo {
    constructor(container) {
        this.container = container;
        this.isScanning = false;
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div class="face-scan-frame">
                <div class="face-scan-overlay"></div>
                <div class="face-scan-dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <div class="face-scan-status">Tap to scan</div>
            </div>
        `;
        
        this.overlay = this.container.querySelector('.face-scan-overlay');
        this.status = this.container.querySelector('.face-scan-status');
        
        this.container.addEventListener('click', () => this.startScan());
        
        // Add styles
        this.addStyles();
        
        // Auto-start after delay
        setTimeout(() => this.startScan(), 3000);
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .face-scan-frame {
                position: relative;
                width: 200px;
                height: 200px;
                margin: 0 auto;
                cursor: pointer;
            }
            
            .face-scan-overlay {
                position: absolute;
                inset: 0;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-radius: var(--radius-2xl);
                transition: all var(--duration-medium) var(--ease-out);
            }
            
            .face-scan-dots {
                position: absolute;
                inset: 20px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            
            .dot {
                width: 8px;
                height: 8px;
                background: var(--primary-300);
                border-radius: 50%;
                opacity: 0.3;
                transition: all var(--duration-medium) var(--ease-out);
            }
            
            .face-scan-status {
                position: absolute;
                bottom: -40px;
                left: 50%;
                transform: translateX(-50%);
                font-size: var(--text-sm);
                color: var(--text-secondary);
                white-space: nowrap;
            }
            
            .scanning .face-scan-overlay {
                border-color: var(--primary);
                box-shadow: 0 0 20px var(--primary-300);
                animation: scanPulse 2s infinite;
            }
            
            .scanning .dot {
                background: var(--primary);
                opacity: 1;
                animation: dotScan 0.5s ease-in-out infinite alternate;
            }
            
            .scanning .dot:nth-child(2) { animation-delay: 0.1s; }
            .scanning .dot:nth-child(3) { animation-delay: 0.2s; }
            .scanning .dot:nth-child(4) { animation-delay: 0.3s; }
            
            .success .face-scan-overlay {
                border-color: #22c55e;
                box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
            }
            
            .success .dot {
                background: #22c55e;
                opacity: 1;
            }
            
            @keyframes scanPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            @keyframes dotScan {
                0% { transform: scale(1); }
                100% { transform: scale(1.5); }
            }
        `;
        document.head.appendChild(style);
    }

    startScan() {
        if (this.isScanning) return;
        
        this.isScanning = true;
        this.container.classList.add('scanning');
        this.status.textContent = 'Scanning...';
        
        if (window.mobileTouchPremium) {
            window.mobileTouchPremium.triggerHaptic('light');
        }
        
        setTimeout(() => {
            this.completeScan();
        }, 2500);
    }

    completeScan() {
        this.container.classList.remove('scanning');
        this.container.classList.add('success');
        this.status.textContent = 'Face ID verified ✓';
        
        if (window.mobileTouchPremium) {
            window.mobileTouchPremium.triggerHaptic('medium');
        }
        
        setTimeout(() => {
            this.reset();
        }, 3000);
    }

    reset() {
        this.isScanning = false;
        this.container.classList.remove('scanning', 'success');
        this.status.textContent = 'Tap to scan';
    }
}

// Testimonial Carousel Component
class TestimonialCarousel {
    constructor(container) {
        this.container = container;
        this.currentIndex = 0;
        this.testimonials = [];
        this.autoplayInterval = null;
        this.init();
    }

    init() {
        this.testimonials = JSON.parse(this.container.getAttribute('data-testimonials') || '[]');
        if (this.testimonials.length === 0) {
            this.testimonials = this.getDefaultTestimonials();
        }
        
        this.render();
        this.startAutoplay();
        this.setupGestures();
    }

    getDefaultTestimonials() {
        return [
            {
                text: "Finally! Crypto payments that actually work. No more copying 0x addresses. Just @john → send. Done.",
                author: "Sarah Chen",
                role: "Product Designer",
                avatar: "👩‍💻"
            },
            {
                text: "Face ID for crypto? Genius. My mom can finally send me money without calling me to help with wallets.",
                author: "Mike Rodriguez",
                role: "Developer",
                avatar: "👨‍💻"
            },
            {
                text: "Zero gas fees changed everything. I can actually use crypto for small payments now.",
                author: "Emma Johnson",
                role: "Student",
                avatar: "👩‍🎓"
            }
        ];
    }

    render() {
        this.container.innerHTML = `
            <div class="carousel-track" style="transform: translateX(-${this.currentIndex * 100}%)">
                ${this.testimonials.map((testimonial, index) => `
                    <div class="testimonial-slide">
                        <div class="testimonial-content">
                            <div class="testimonial-text">"${testimonial.text}"</div>
                            <div class="testimonial-author">
                                <div class="author-avatar">${testimonial.avatar}</div>
                                <div class="author-info">
                                    <div class="author-name">${testimonial.author}</div>
                                    <div class="author-role">${testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="carousel-indicators">
                ${this.testimonials.map((_, index) => `
                    <button class="indicator ${index === this.currentIndex ? 'active' : ''}" data-index="${index}"></button>
                `).join('')}
            </div>
        `;
        
        this.addCarouselStyles();
        this.bindEvents();
    }

    addCarouselStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .testimonial-carousel {
                position: relative;
                overflow: hidden;
                border-radius: var(--radius-2xl);
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .carousel-track {
                display: flex;
                transition: transform var(--duration-medium) var(--ease-out);
                will-change: transform;
            }
            
            .testimonial-slide {
                flex: 0 0 100%;
                padding: var(--space-8);
            }
            
            .testimonial-text {
                font-size: var(--text-lg);
                line-height: 1.6;
                margin-bottom: var(--space-6);
                color: var(--text);
            }
            
            .testimonial-author {
                display: flex;
                align-items: center;
                gap: var(--space-4);
            }
            
            .author-avatar {
                font-size: var(--text-3xl);
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--primary-100);
                border-radius: var(--radius-full);
            }
            
            .author-name {
                font-weight: 600;
                color: var(--primary);
                margin-bottom: var(--space-1);
            }
            
            .author-role {
                font-size: var(--text-sm);
                color: var(--text-secondary);
            }
            
            .carousel-indicators {
                display: flex;
                justify-content: center;
                gap: var(--space-2);
                padding: var(--space-4);
            }
            
            .indicator {
                width: 8px;
                height: 8px;
                border: none;
                border-radius: var(--radius-full);
                background: rgba(255, 255, 255, 0.3);
                cursor: pointer;
                transition: all var(--duration-fast) var(--ease-out);
            }
            
            .indicator.active {
                background: var(--primary);
                width: 24px;
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        this.container.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
    }

    setupGestures() {
        let startX, startY;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        this.container.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
            
            startX = startY = null;
        }, { passive: true });
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.render();
        this.resetAutoplay();
    }

    previousSlide() {
        this.currentIndex = this.currentIndex === 0 ? this.testimonials.length - 1 : this.currentIndex - 1;
        this.render();
        this.resetAutoplay();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.render();
        this.resetAutoplay();
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    resetAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.startAutoplay();
        }
    }

    destroy() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobileComponents = new MobileComponents();
    });
} else {
    window.mobileComponents = new MobileComponents();
}

window.MobileComponents = MobileComponents;