/**
 * CONVERSION CHUNK - Optimized conversion flow
 * Advanced A/B testing and conversion optimization
 */

export class ConversionManager {
    constructor() {
        this.conversionData = {};
        this.experimentVariant = this.getExperimentVariant();
        this.conversionStartTime = null;
    }

    // A/B testing for conversion optimization
    getExperimentVariant() {
        const stored = localStorage.getItem('conversion_variant');
        if (stored) return stored;

        const variants = ['control', 'urgency', 'social_proof', 'scarcity'];
        const variant = variants[Math.floor(Math.random() * variants.length)];
        
        localStorage.setItem('conversion_variant', variant);
        return variant;
    }

    handleJoinRevolution() {
        console.log('💫 Conversion chunk loaded');
        
        this.conversionStartTime = Date.now();
        
        // Track conversion attempt with variant
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion_attempt', {
                'event_category': 'conversion',
                'event_label': this.experimentVariant,
                'variant': this.experimentVariant,
                'value': 1
            });
        }

        // Apply variant-specific optimizations
        this.applyVariantOptimizations();
        
        // Start conversion flow
        this.startConversionFlow();
    }

    applyVariantOptimizations() {
        switch (this.experimentVariant) {
            case 'urgency':
                this.enhanceUrgency();
                break;
            case 'social_proof':
                this.enhanceSocialProof();
                break;
            case 'scarcity':
                this.enhanceScarcity();
                break;
            default:
                // Control variant - no changes
                break;
        }
    }

    enhanceUrgency() {
        // Add pulsing effect to CTA buttons
        document.querySelectorAll('button').forEach(btn => {
            if (btn.textContent.includes('ÚNETE') || btn.textContent.includes('ACCESO')) {
                btn.classList.add('pulse-urgency');
            }
        });

        // Inject urgency CSS
        const urgencyCSS = `
            .pulse-urgency {
                animation: pulseUrgency 1s infinite !important;
            }
            @keyframes pulseUrgency {
                0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(220, 38, 38, 0.3); }
                50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(220, 38, 38, 0.6); }
            }
        `;
        
        this.injectCSS(urgencyCSS);
    }

    enhanceSocialProof() {
        // Show recent signups
        this.showRecentSignups();
        
        // Enhance testimonial visibility
        document.querySelectorAll('[data-testimonial]').forEach(testimonial => {
            testimonial.style.border = '2px solid rgba(16, 185, 129, 0.3)';
        });
    }

    enhanceScarcity() {
        // More aggressive countdown
        const countdownElements = document.querySelectorAll('.countdown-timer');
        countdownElements.forEach(el => {
            el.style.color = '#ef4444';
            el.style.fontSize = '1.5em';
            el.style.fontWeight = '900';
        });

        // Update spots left more frequently
        this.accelerateScarcity();
    }

    showRecentSignups() {
        const signupNotification = document.createElement('div');
        signupNotification.className = 'fixed bottom-4 left-4 glass-urgent p-4 rounded-xl z-40 transform translate-y-full transition-transform';
        signupNotification.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-emerald-400 rounded-full pulse"></div>
                <span class="text-sm">
                    <strong>María G.</strong> se unió hace 2 minutos
                </span>
            </div>
        `;

        document.body.appendChild(signupNotification);

        // Show notification
        setTimeout(() => {
            signupNotification.style.transform = 'translateY(0)';
        }, 1000);

        // Hide after 4 seconds
        setTimeout(() => {
            signupNotification.style.transform = 'translateY(100%)';
            setTimeout(() => signupNotification.remove(), 300);
        }, 4000);

        // Show more notifications periodically
        setTimeout(() => this.showMoreSignups(), 8000);
    }

    showMoreSignups() {
        const names = ['Carlos M.', 'Ana L.', 'Diego R.', 'Sofia P.', 'Luis H.'];
        const name = names[Math.floor(Math.random() * names.length)];
        const minutes = Math.floor(Math.random() * 10) + 1;

        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 left-4 glass-urgent p-4 rounded-xl z-40 transform translate-y-full transition-transform';
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-emerald-400 rounded-full pulse"></div>
                <span class="text-sm">
                    <strong>${name}</strong> se unió hace ${minutes} minutos
                </span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateY(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    accelerateScarcity() {
        const spotsElements = document.querySelectorAll('#spotsLeft, #spotsLeftMain');
        let currentSpots = parseInt(spotsElements[0]?.textContent || '127');

        setInterval(() => {
            currentSpots = Math.max(50, currentSpots - 1);
            spotsElements.forEach(el => {
                if (el) el.textContent = currentSpots.toString();
            });
        }, 30000); // Decrease every 30 seconds instead of slower
    }

    startConversionFlow() {
        const button = event?.target;
        if (!button) return;

        // Enhanced loading state
        this.showEnhancedLoading(button);

        // Simulate processing with realistic timing
        setTimeout(() => {
            this.showSuccessState(button);
        }, 2000);
    }

    showEnhancedLoading(button) {
        const originalText = button.innerHTML;
        button.innerHTML = `
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>PROCESANDO...</span>
            </div>
        `;
        button.disabled = true;
        button.style.cursor = 'not-allowed';

        // Add processing sound effect
        this.playProcessingSound();
    }

    showSuccessState(button) {
        // Success animation
        button.innerHTML = '✅ ¡PROCESANDO COMPLETADO!';
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        button.style.transform = 'scale(1.05)';

        // Play success sound
        this.playSuccessSound();

        // Show success modal
        setTimeout(() => {
            this.showSuccessModal();
        }, 500);

        // Track successful conversion
        const conversionTime = Date.now() - this.conversionStartTime;
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion_success', {
                'event_category': 'conversion',
                'event_label': this.experimentVariant,
                'variant': this.experimentVariant,
                'conversion_time': Math.round(conversionTime),
                'value': 1
            });
        }
    }

    showSuccessModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="glass max-w-md p-8 rounded-3xl text-center transform scale-95 transition-transform">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-2xl font-bold mb-4 gradient-text">¡FELICIDADES!</h3>
                <p class="text-gray-300 mb-6">
                    Has sido aceptado en la <span class="text-emerald-400 font-bold">Beta Exclusiva</span> de FacePay.
                </p>
                <div class="space-y-3 text-left mb-6">
                    <div class="flex items-center gap-3">
                        <span class="text-emerald-400">✅</span>
                        <span>Acceso inmediato garantizado</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-emerald-400">✅</span>
                        <span>Username premium reservado</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-emerald-400">✅</span>
                        <span>Zero gas fees de por vida</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-emerald-400">✅</span>
                        <span>Soporte prioritario 24/7</span>
                    </div>
                </div>
                <div class="bg-yellow-500/20 p-4 rounded-xl mb-4">
                    <p class="text-sm text-yellow-300">
                        📧 Revisa tu email en los próximos <strong>2 minutos</strong> para las instrucciones de acceso.
                    </p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="w-full px-6 py-3 bg-emerald-500 rounded-xl font-bold hover:bg-emerald-600 transition">
                    ¡ENTENDIDO!
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        // Animate in
        setTimeout(() => {
            modal.querySelector('.glass').style.transform = 'scale(1)';
        }, 100);

        // Auto-close after 30 seconds
        setTimeout(() => {
            modal.remove();
        }, 30000);
    }

    playProcessingSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // Silent fail for audio
        }
    }

    playSuccessSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Success chord
            const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
            
            frequencies.forEach((freq, i) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

                oscillator.start(audioContext.currentTime + i * 0.1);
                oscillator.stop(audioContext.currentTime + 0.5 + i * 0.1);
            });
        } catch (error) {
            // Silent fail for audio
        }
    }

    injectCSS(css) {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = css;
        document.head.appendChild(styleSheet);
    }

    // Track variant performance
    trackVariantPerformance(event, value) {
        if (typeof gtag !== 'undefined') {
            gtag('event', event, {
                'event_category': 'conversion_variant',
                'event_label': this.experimentVariant,
                'variant': this.experimentVariant,
                'value': value
            });
        }
    }
}