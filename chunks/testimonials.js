/**
 * TESTIMONIALS CHUNK - Lazy loaded testimonials functionality
 * Optimized for tree shaking and minimal bundle size
 */

export class TestimonialsManager {
    constructor() {
        this.testimonials = [];
        this.currentIndex = 0;
        this.autoRotateInterval = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        console.log('🎭 Testimonials chunk loaded');
        
        // Setup testimonial interactions
        this.setupTestimonialRotation();
        this.setupTestimonialHovers();
        this.trackTestimonialViews();
        
        this.initialized = true;
    }

    setupTestimonialRotation() {
        const testimonialCards = document.querySelectorAll('[data-testimonial]');
        if (testimonialCards.length === 0) return;

        // Add rotation animation on scroll into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startRotation(testimonialCards);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        testimonialCards.forEach(card => observer.observe(card));
    }

    startRotation(cards) {
        let index = 0;
        
        // Subtle highlight rotation every 3 seconds
        this.autoRotateInterval = setInterval(() => {
            // Remove previous highlight
            cards.forEach(card => card.classList.remove('testimonial-highlight'));
            
            // Add highlight to current
            cards[index].classList.add('testimonial-highlight');
            
            index = (index + 1) % cards.length;
        }, 3000);
    }

    setupTestimonialHovers() {
        document.querySelectorAll('[data-testimonial]').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.pauseRotation();
                this.highlightTestimonial(card);
            });

            card.addEventListener('mouseleave', () => {
                this.resumeRotation();
                this.unhighlightTestimonial(card);
            });

            card.addEventListener('click', () => {
                this.expandTestimonial(card);
            });
        });
    }

    highlightTestimonial(card) {
        card.style.transform = 'scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.2)';
        
        // Track hover engagement
        if (typeof gtag !== 'undefined') {
            gtag('event', 'testimonial_hover', {
                'event_category': 'engagement',
                'event_label': card.dataset.testimonial
            });
        }
    }

    unhighlightTestimonial(card) {
        card.style.transform = '';
        card.style.boxShadow = '';
    }

    expandTestimonial(card) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="glass max-w-2xl p-8 rounded-3xl transform scale-95 transition-transform">
                <button onclick="this.parentElement.parentElement.remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white">
                    ✕
                </button>
                ${card.innerHTML}
                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-400">Testimonial verificado por nuestro equipo</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
            modal.querySelector('.glass').style.transform = 'scale(1)';
        }, 100);

        // Track expansion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'testimonial_expand', {
                'event_category': 'engagement',
                'event_label': card.dataset.testimonial
            });
        }
    }

    trackTestimonialViews() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const testimonialId = entry.target.dataset.testimonial;
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'testimonial_view', {
                            'event_category': 'engagement',
                            'event_label': testimonialId
                        });
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('[data-testimonial]').forEach(card => {
            observer.observe(card);
        });
    }

    pauseRotation() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
        }
    }

    resumeRotation() {
        // Resume after a short delay
        setTimeout(() => {
            if (!this.autoRotateInterval) {
                this.startRotation(document.querySelectorAll('[data-testimonial]'));
            }
        }, 1000);
    }

    destroy() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
        }
        this.initialized = false;
    }
}

// CSS for testimonial highlighting (injected dynamically)
const testimonialStyles = `
    .testimonial-highlight {
        transform: scale(1.02) !important;
        box-shadow: 0 0 30px rgba(16, 185, 129, 0.3) !important;
        border: 1px solid rgba(16, 185, 129, 0.5) !important;
        transition: all 0.3s ease !important;
    }
    
    [data-testimonial] {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    [data-testimonial]:hover {
        transform: scale(1.02);
    }
`;

// Inject styles when chunk loads
const styleSheet = document.createElement('style');
styleSheet.textContent = testimonialStyles;
document.head.appendChild(styleSheet);