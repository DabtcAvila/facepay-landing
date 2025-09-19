/**
 * MICRO-CONVERSIONS OPTIMIZATION SYSTEM
 * Progressive profiling and micro-conversion funnel optimization
 * 
 * Features:
 * - Email capture before main CTA
 * - Progressive profiling (collect data in stages)
 * - Exit-intent triggers with advanced psychology
 * - Scroll-based CTAs with dynamic positioning
 * - Micro-interaction tracking and optimization
 * - Lead scoring and qualification
 */

export class MicroConversionsOptimizer {
    constructor(options = {}) {
        this.options = {
            emailCaptureThreshold: options.emailCaptureThreshold || 60, // seconds
            scrollCapturePercentage: options.scrollCapturePercentage || 75,
            exitIntentEnabled: options.exitIntentEnabled || true,
            progressiveProfilingEnabled: options.progressiveProfilingEnabled || true,
            leadScoringEnabled: options.leadScoringEnabled || true,
            dynamicCTAsEnabled: options.dynamicCTAsEnabled || true,
            debug: options.debug || false,
            ...options
        };

        this.userProfile = this.initializeUserProfile();
        this.microConversions = new Map();
        this.conversionFunnel = this.initializeConversionFunnel();
        this.leadScore = 0;
        this.engagementLevel = 'cold';
        
        this.triggers = new Map();
        this.interactionHistory = [];
        this.profileData = new Map();
        
        this.init();
    }

    init() {
        this.log('🎯 Initializing Micro-Conversions Optimizer...');
        
        // Setup micro-conversion tracking
        this.setupMicroConversions();
        
        // Initialize progressive profiling system
        this.initializeProgressiveProfiling();
        
        // Setup dynamic CTAs
        this.setupDynamicCTAs();
        
        // Initialize lead scoring
        this.initializeLeadScoring();
        
        // Start real-time optimization
        this.startRealTimeOptimization();
        
        this.log('✅ Micro-Conversions Optimizer Active');
    }

    /**
     * MICRO-CONVERSION TRACKING
     * Tracks smaller conversion events that lead to main goal
     */
    setupMicroConversions() {
        this.microConversions.set('email_capture', {
            id: 'email_capture',
            name: 'Email Collection',
            value: 25, // Lead score value
            triggers: ['time_threshold', 'scroll_threshold', 'engagement_signal'],
            completed: false,
            attempts: 0,
            lastAttempt: null,
            handler: () => this.triggerEmailCapture()
        });

        this.microConversions.set('video_engagement', {
            id: 'video_engagement',
            name: 'Video Engagement',
            value: 35,
            triggers: ['video_play', 'video_25_percent', 'video_completion'],
            completed: false,
            engagementLevel: 0,
            handler: () => this.trackVideoEngagement()
        });

        this.microConversions.set('testimonial_interaction', {
            id: 'testimonial_interaction',
            name: 'Testimonial Reading',
            value: 15,
            triggers: ['testimonial_hover', 'testimonial_click', 'testimonial_scroll'],
            completed: false,
            interactions: 0,
            handler: () => this.trackTestimonialInteraction()
        });

        this.microConversions.set('feature_exploration', {
            id: 'feature_exploration',
            name: 'Feature Exploration',
            value: 20,
            triggers: ['feature_hover', 'feature_click', 'demo_interaction'],
            completed: false,
            featuresExplored: 0,
            handler: () => this.trackFeatureExploration()
        });

        this.microConversions.set('social_proof_engagement', {
            id: 'social_proof_engagement',
            name: 'Social Proof Engagement',
            value: 10,
            triggers: ['stats_view', 'testimonial_expand', 'badge_hover'],
            completed: false,
            proofPoints: 0,
            handler: () => this.trackSocialProofEngagement()
        });

        // Setup trigger listeners
        this.setupTriggerListeners();
    }

    setupTriggerListeners() {
        // Time-based triggers
        this.setupTimeBasedTriggers();
        
        // Scroll-based triggers
        this.setupScrollBasedTriggers();
        
        // Interaction-based triggers
        this.setupInteractionBasedTriggers();
        
        // Exit-intent triggers
        this.setupExitIntentTriggers();
        
        // Video engagement triggers
        this.setupVideoEngagementTriggers();
    }

    setupTimeBasedTriggers() {
        const timeThresholds = [30, 60, 120, 300]; // seconds
        
        timeThresholds.forEach(threshold => {
            setTimeout(() => {
                this.evaluateMicroConversion('time_threshold', { seconds: threshold });
                this.updateEngagementLevel();
            }, threshold * 1000);
        });
    }

    setupScrollBasedTriggers() {
        let maxScrollDepth = 0;
        const scrollThresholds = [25, 50, 75, 90];
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
                
                scrollThresholds.forEach(threshold => {
                    if (scrollPercent >= threshold && !this.userProfile.scrollMilestones[threshold]) {
                        this.userProfile.scrollMilestones[threshold] = true;
                        this.evaluateMicroConversion('scroll_threshold', { percent: threshold });
                    }
                });
            }
        }, 500));
    }

    setupInteractionBasedTriggers() {
        // Button hovers
        document.addEventListener('mouseenter', (e) => {
            if (e.target.closest('.btn, .cta-button')) {
                this.trackInteraction('button_hover', {
                    element: e.target.textContent.trim(),
                    timestamp: Date.now()
                });
            }
        }, true);

        // Link clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('a, button')) {
                this.trackInteraction('element_click', {
                    element: e.target.textContent.trim(),
                    href: e.target.href || null,
                    timestamp: Date.now()
                });
                
                this.evaluateMicroConversion('engagement_signal', {
                    type: 'click',
                    element: e.target
                });
            }
        });

        // Form interactions
        document.addEventListener('focus', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.trackInteraction('form_focus', {
                    field: e.target.name || e.target.placeholder,
                    timestamp: Date.now()
                });
                
                this.evaluateMicroConversion('engagement_signal', {
                    type: 'form_focus',
                    element: e.target
                });
            }
        }, true);

        // Testimonial interactions
        document.querySelectorAll('[data-testimonial]').forEach(testimonial => {
            testimonial.addEventListener('mouseenter', () => {
                this.evaluateMicroConversion('testimonial_hover', {
                    testimonial: testimonial.dataset.testimonial
                });
            });

            testimonial.addEventListener('click', () => {
                this.evaluateMicroConversion('testimonial_click', {
                    testimonial: testimonial.dataset.testimonial
                });
            });
        });
    }

    setupExitIntentTriggers() {
        if (!this.options.exitIntentEnabled) return;

        let exitIntentTriggered = false;
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentTriggered && this.shouldTriggerExitIntent()) {
                exitIntentTriggered = true;
                this.triggerExitIntentCapture();
            }
        });

        // Mobile exit intent (scroll to top quickly)
        let lastScrollTop = 0;
        window.addEventListener('scroll', this.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (lastScrollTop - scrollTop > 200 && scrollTop < 100 && !exitIntentTriggered) {
                exitIntentTriggered = true;
                this.triggerExitIntentCapture();
            }
            
            lastScrollTop = scrollTop;
        }, 100));
    }

    setupVideoEngagementTriggers() {
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            video.addEventListener('play', () => {
                this.evaluateMicroConversion('video_play', { video: video.src });
            });

            video.addEventListener('timeupdate', () => {
                const progress = video.currentTime / video.duration;
                
                if (progress >= 0.25 && !video.dataset.quarter) {
                    video.dataset.quarter = 'true';
                    this.evaluateMicroConversion('video_25_percent', { video: video.src });
                }
                
                if (progress >= 0.5 && !video.dataset.half) {
                    video.dataset.half = 'true';
                    this.evaluateMicroConversion('video_50_percent', { video: video.src });
                }
                
                if (progress >= 0.75 && !video.dataset.threequarter) {
                    video.dataset.threequarter = 'true';
                    this.evaluateMicroConversion('video_75_percent', { video: video.src });
                }
            });

            video.addEventListener('ended', () => {
                this.evaluateMicroConversion('video_completion', { video: video.src });
            });
        });
    }

    /**
     * MICRO-CONVERSION EVALUATION
     */
    evaluateMicroConversion(triggerType, data = {}) {
        this.microConversions.forEach((conversion, id) => {
            if (conversion.triggers.includes(triggerType) && !conversion.completed) {
                conversion.handler(data);
            }
        });

        // Update lead score based on trigger
        this.updateLeadScore(triggerType, data);
    }

    triggerEmailCapture() {
        const emailConversion = this.microConversions.get('email_capture');
        
        // Don't trigger if already completed or too many attempts
        if (emailConversion.completed || emailConversion.attempts >= 3) {
            return;
        }

        // Check if enough time has passed since last attempt
        if (emailConversion.lastAttempt && 
            Date.now() - emailConversion.lastAttempt < 300000) { // 5 minutes
            return;
        }

        emailConversion.attempts++;
        emailConversion.lastAttempt = Date.now();

        this.showEmailCaptureModal();
    }

    showEmailCaptureModal() {
        const modal = document.createElement('div');
        modal.className = 'micro-conversion-modal fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 to-black border border-green-500/30 rounded-2xl p-8 max-w-md w-full transform scale-95 transition-all duration-300" id="email-capture-content">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2 text-white">¡Solo Faltas Tú! 🚀</h3>
                    <p class="text-gray-300 text-sm">
                        Te notificamos cuando abramos <span class="text-green-400 font-semibold">127 lugares más</span> en las próximas 24-48h
                    </p>
                </div>
                
                <div class="space-y-4">
                    <div class="relative">
                        <input type="email" 
                               id="micro-email-input" 
                               placeholder="tu@email.com" 
                               class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-300">
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                            </svg>
                        </div>
                    </div>
                    
                    ${this.generateProgressiveProfilingField()}
                    
                    <div class="flex space-x-3">
                        <button onclick="this.closest('.micro-conversion-modal').remove()" 
                                class="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors duration-300">
                            Ahora no
                        </button>
                        <button onclick="window.microConversionsOptimizer.handleEmailCapture()" 
                                class="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                            ¡Avísame! 🔔
                        </button>
                    </div>
                    
                    <div class="text-center">
                        <div class="text-xs text-gray-400 mb-2">
                            📧 Solo notificaciones importantes • 🚫 No spam
                        </div>
                        <div class="flex items-center justify-center text-xs text-green-400">
                            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                            </svg>
                            Datos protegidos con SSL
                        </div>
                    </div>
                </div>
                
                <!-- Progress indicator -->
                <div class="mt-6 flex justify-center">
                    <div class="flex space-x-2">
                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div class="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <div class="w-2 h-2 bg-gray-600 rounded-full"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
            const content = modal.querySelector('#email-capture-content');
            content.style.transform = 'scale(1)';
        }, 100);

        // Focus on email input
        setTimeout(() => {
            const emailInput = document.getElementById('micro-email-input');
            emailInput.focus();
        }, 400);

        // Auto-remove after 30 seconds if no interaction
        setTimeout(() => {
            if (document.contains(modal)) {
                modal.remove();
            }
        }, 30000);

        this.trackEvent('micro_conversion_triggered', {
            type: 'email_capture',
            attempt: this.microConversions.get('email_capture').attempts,
            lead_score: this.leadScore
        });
    }

    generateProgressiveProfilingField() {
        const profileLevel = this.getProgressiveProfilingLevel();
        
        switch (profileLevel) {
            case 1:
                return `
                    <div class="relative">
                        <select id="interest-level" 
                                class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-green-500 focus:outline-none">
                            <option value="">¿Qué te interesa más? (Opcional)</option>
                            <option value="gas_fees">Ahorrar en gas fees</option>
                            <option value="ease_of_use">Facilidad de uso</option>
                            <option value="security">Seguridad</option>
                            <option value="social_features">Funciones sociales</option>
                        </select>
                    </div>
                `;
            case 2:
                return `
                    <div class="relative">
                        <select id="crypto-experience" 
                                class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-green-500 focus:outline-none">
                            <option value="">¿Qué nivel tienes en crypto? (Opcional)</option>
                            <option value="beginner">Principiante</option>
                            <option value="intermediate">Intermedio</option>
                            <option value="advanced">Avanzado</option>
                            <option value="expert">Experto</option>
                        </select>
                    </div>
                `;
            case 3:
                return `
                    <div class="relative">
                        <input type="text" 
                               id="usage-frequency" 
                               placeholder="¿Con qué frecuencia usas DeFi? (Opcional)" 
                               class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:outline-none">
                    </div>
                `;
            default:
                return '';
        }
    }

    getProgressiveProfilingLevel() {
        const emailCapture = this.microConversions.get('email_capture');
        return Math.min(3, emailCapture.attempts);
    }

    handleEmailCapture() {
        const emailInput = document.getElementById('micro-email-input');
        const email = emailInput.value.trim();
        
        if (!email || !email.includes('@')) {
            this.showFieldError(emailInput, 'Por favor ingresa un email válido');
            return;
        }

        // Collect progressive profiling data
        const profileData = this.collectProgressiveProfilingData();
        
        // Mark micro-conversion as completed
        const emailConversion = this.microConversions.get('email_capture');
        emailConversion.completed = true;
        
        // Update user profile
        this.userProfile.email = email;
        this.userProfile.emailCaptured = true;
        this.userProfile.profileData = { ...this.userProfile.profileData, ...profileData };
        
        // Update lead score
        this.updateLeadScore('email_captured', { email, profileData });
        
        // Show success state
        this.showEmailCaptureSuccess(email);
        
        // Track conversion
        this.trackEvent('micro_conversion_completed', {
            type: 'email_capture',
            email: email,
            profile_data: profileData,
            lead_score: this.leadScore,
            attempt: emailConversion.attempts
        });

        // Start next phase of progressive profiling
        this.scheduleNextProfilingStep();
    }

    collectProgressiveProfilingData() {
        const data = {};
        const level = this.getProgressiveProfilingLevel();
        
        if (level >= 1) {
            const interestLevel = document.getElementById('interest-level');
            if (interestLevel && interestLevel.value) {
                data.interestLevel = interestLevel.value;
            }
        }
        
        if (level >= 2) {
            const cryptoExperience = document.getElementById('crypto-experience');
            if (cryptoExperience && cryptoExperience.value) {
                data.cryptoExperience = cryptoExperience.value;
            }
        }
        
        if (level >= 3) {
            const usageFrequency = document.getElementById('usage-frequency');
            if (usageFrequency && usageFrequency.value) {
                data.usageFrequency = usageFrequency.value;
            }
        }
        
        return data;
    }

    showFieldError(field, message) {
        field.classList.add('border-red-500');
        field.placeholder = message;
        
        setTimeout(() => {
            field.classList.remove('border-red-500');
            field.placeholder = 'tu@email.com';
        }, 3000);
    }

    showEmailCaptureSuccess(email) {
        const modal = document.querySelector('.micro-conversion-modal');
        const content = modal.querySelector('#email-capture-content');
        
        content.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-bold mb-4 text-green-400">¡Perfecto! 🎉</h3>
                <p class="text-gray-300 mb-6">
                    Te notificaremos a <span class="text-white font-semibold">${email}</span> cuando abramos más spots.
                </p>
                
                <div class="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                    <p class="text-sm text-green-300">
                        💡 <strong>Tip:</strong> Mientras tanto, continúa explorando la página para descubrir todas las funcionalidades.
                    </p>
                </div>
                
                <button onclick="this.closest('.micro-conversion-modal').remove()" 
                        class="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-300">
                    ¡Continuar Explorando! 🚀
                </button>
            </div>
        `;
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            modal.remove();
        }, 4000);
    }

    scheduleNextProfilingStep() {
        // Schedule next profiling interaction after user explores more
        setTimeout(() => {
            if (this.leadScore >= 75 && !this.userProfile.detailedProfileCompleted) {
                this.triggerDetailedProfiling();
            }
        }, 300000); // 5 minutes
    }

    /**
     * EXIT-INTENT CAPTURE
     */
    shouldTriggerExitIntent() {
        // Don't trigger if email already captured
        if (this.userProfile.emailCaptured) {
            return false;
        }
        
        // Don't trigger if user has been on page for less than 30 seconds
        if (Date.now() - this.userProfile.sessionStart < 30000) {
            return false;
        }
        
        // Don't trigger if lead score is very low
        if (this.leadScore < 10) {
            return false;
        }
        
        return true;
    }

    triggerExitIntentCapture() {
        const modal = document.createElement('div');
        modal.className = 'exit-intent-modal fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-red-900 to-red-800 border border-red-500/50 rounded-2xl p-8 max-w-lg w-full transform scale-95 transition-all duration-300" id="exit-intent-content">
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4 animate-bounce">⚠️</div>
                    <h3 class="text-3xl font-bold mb-2 text-red-400">¡ESPERA!</h3>
                    <p class="text-white text-lg mb-2">¿Te vas sin tu regalo de $497?</p>
                    <p class="text-red-200 text-sm">Este popup desaparece en <span id="exit-countdown" class="font-bold text-yellow-300">15</span> segundos...</p>
                </div>
                
                <div class="bg-black/50 rounded-xl p-6 mb-6">
                    <h4 class="text-lg font-bold text-yellow-300 mb-3">🎁 Tu regalo GRATIS incluye:</h4>
                    <ul class="space-y-2 text-sm text-white">
                        <li class="flex items-center gap-2">
                            <span class="text-green-400">✅</span>
                            <span>Acceso Beta Premium ($197)</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="text-green-400">✅</span>
                            <span>Zero Gas Fees Lifetime ($201)</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="text-green-400">✅</span>
                            <span>Username Premium Reservado ($99)</span>
                        </li>
                    </ul>
                    <div class="border-t border-gray-600 mt-3 pt-3">
                        <div class="flex justify-between items-center">
                            <span class="text-white font-bold">VALOR TOTAL:</span>
                            <span class="text-yellow-300 font-bold text-xl">$497</span>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-3">
                    <div class="relative">
                        <input type="email" 
                               id="exit-intent-email" 
                               placeholder="Ingresa tu email para recibir el regalo..." 
                               class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:outline-none">
                    </div>
                    
                    <button onclick="window.microConversionsOptimizer.handleExitIntentConversion()" 
                            class="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105">
                        🎁 SÍ, QUIERO MI REGALO AHORA
                    </button>
                    
                    <button onclick="this.closest('.exit-intent-modal').remove()" 
                            class="w-full px-6 py-2 text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                        No gracias, prefiero seguir pagando gas fees de $50+
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
            const content = modal.querySelector('#exit-intent-content');
            content.style.transform = 'scale(1)';
        }, 100);

        // Countdown timer
        let countdown = 15;
        const countdownInterval = setInterval(() => {
            countdown--;
            const countdownEl = document.getElementById('exit-countdown');
            if (countdownEl) {
                countdownEl.textContent = countdown;
                
                // Add urgency styling as countdown decreases
                if (countdown <= 5) {
                    countdownEl.className = 'font-bold text-red-400 animate-pulse';
                } else if (countdown <= 10) {
                    countdownEl.className = 'font-bold text-yellow-300';
                }
            }
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                if (document.contains(modal)) {
                    modal.remove();
                }
            }
        }, 1000);

        // Focus on email input after animation
        setTimeout(() => {
            const emailInput = document.getElementById('exit-intent-email');
            emailInput.focus();
        }, 500);

        this.trackEvent('exit_intent_triggered', {
            time_on_page: Date.now() - this.userProfile.sessionStart,
            lead_score: this.leadScore,
            engagement_level: this.engagementLevel
        });
    }

    handleExitIntentConversion() {
        const emailInput = document.getElementById('exit-intent-email');
        const email = emailInput.value.trim();
        
        if (!email || !email.includes('@')) {
            this.showFieldError(emailInput, 'Email válido requerido para el regalo');
            return;
        }

        // Mark email captured
        this.userProfile.email = email;
        this.userProfile.emailCaptured = true;
        this.microConversions.get('email_capture').completed = true;
        
        // High lead score for exit intent conversion
        this.updateLeadScore('exit_intent_conversion', { email });
        
        // Show success
        this.showExitIntentSuccess();
        
        this.trackEvent('micro_conversion_completed', {
            type: 'exit_intent_conversion',
            email: email,
            lead_score: this.leadScore
        });
    }

    showExitIntentSuccess() {
        const modal = document.querySelector('.exit-intent-modal');
        const content = modal.querySelector('#exit-intent-content');
        
        content.innerHTML = `
            <div class="text-center">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-3xl font-bold mb-4 text-green-400">¡Excelente Decisión!</h3>
                <p class="text-green-100 mb-6 text-lg">
                    Has asegurado tu regalo de $497. Te contactaremos en las próximas horas.
                </p>
                
                <div class="bg-green-500/20 border border-green-500/40 rounded-xl p-4 mb-6">
                    <p class="text-sm text-green-200">
                        📧 Revisa tu email en los próximos <strong>5 minutos</strong> para instrucciones de acceso a tu regalo.
                    </p>
                </div>
                
                <button onclick="this.closest('.exit-intent-modal').remove()" 
                        class="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition-all duration-300">
                    ¡Continuar! 🚀
                </button>
            </div>
        `;
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            modal.remove();
        }, 5000);
    }

    /**
     * DYNAMIC CTAs
     */
    setupDynamicCTAs() {
        if (!this.options.dynamicCTAsEnabled) return;
        
        this.createScrollBasedCTAs();
        this.createSmartCTAs();
        this.setupCTAOptimization();
    }

    createScrollBasedCTAs() {
        // Create sticky CTA that appears after 50% scroll
        const stickyCTA = document.createElement('div');
        stickyCTA.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all duration-300 z-40 opacity-0 translate-y-full';
        stickyCTA.id = 'sticky-cta';
        stickyCTA.innerHTML = `
            <div class="flex items-center gap-2">
                <span>🚀 Únete Ahora</span>
                <span class="text-xs bg-white/20 px-2 py-1 rounded-full">GRATIS</span>
            </div>
        `;
        
        stickyCTA.addEventListener('click', () => {
            this.handleMainConversion('sticky_cta');
        });
        
        document.body.appendChild(stickyCTA);
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', this.throttle(() => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent > 50 && !this.userProfile.emailCaptured) {
                stickyCTA.style.opacity = '1';
                stickyCTA.style.transform = 'translateX(-50%) translateY(0)';
            } else {
                stickyCTA.style.opacity = '0';
                stickyCTA.style.transform = 'translateX(-50%) translateY(100%)';
            }
        }, 100));
    }

    createSmartCTAs() {
        // Create smart CTAs that adapt based on user behavior
        const smartCTAs = document.querySelectorAll('[data-smart-cta]');
        
        smartCTAs.forEach(cta => {
            this.optimizeCTA(cta);
        });
    }

    optimizeCTA(cta) {
        const originalText = cta.textContent;
        
        // Adapt CTA based on engagement level
        setInterval(() => {
            let newText = originalText;
            let urgencyClass = '';
            
            switch (this.engagementLevel) {
                case 'hot':
                    newText = '🔥 ¡ACCESO INMEDIATO AHORA!';
                    urgencyClass = 'animate-pulse';
                    break;
                case 'warm':
                    newText = '⚡ Únete a 10,000+ Pioneros';
                    break;
                case 'cold':
                    newText = '👀 Ver Demo Gratis';
                    break;
            }
            
            cta.textContent = newText;
            cta.className = cta.className.replace(/animate-\w+/g, '') + (urgencyClass ? ` ${urgencyClass}` : '');
        }, 10000); // Update every 10 seconds
    }

    setupCTAOptimization() {
        // Track CTA performance and optimize in real-time
        document.addEventListener('click', (e) => {
            const cta = e.target.closest('[data-track-cta]');
            if (cta) {
                this.trackCTAPerformance(cta);
            }
        });
    }

    trackCTAPerformance(cta) {
        const ctaId = cta.dataset.trackCta;
        
        if (!this.ctaPerformance) {
            this.ctaPerformance = new Map();
        }
        
        if (!this.ctaPerformance.has(ctaId)) {
            this.ctaPerformance.set(ctaId, {
                clicks: 0,
                conversions: 0,
                impressions: 0
            });
        }
        
        const performance = this.ctaPerformance.get(ctaId);
        performance.clicks++;
        
        this.trackEvent('cta_click', {
            cta_id: ctaId,
            text: cta.textContent.trim(),
            engagement_level: this.engagementLevel,
            lead_score: this.leadScore
        });
    }

    /**
     * PROGRESSIVE PROFILING
     */
    initializeProgressiveProfiling() {
        if (!this.options.progressiveProfilingEnabled) return;
        
        this.profilingStages = [
            {
                id: 'basic',
                name: 'Basic Information',
                fields: ['email'],
                trigger: 'email_captured',
                completed: false
            },
            {
                id: 'interest',
                name: 'Interest Assessment',
                fields: ['interest_level', 'use_case'],
                trigger: 'engagement_threshold',
                completed: false
            },
            {
                id: 'technical',
                name: 'Technical Profile',
                fields: ['crypto_experience', 'current_tools'],
                trigger: 'high_engagement',
                completed: false
            },
            {
                id: 'qualification',
                name: 'Lead Qualification',
                fields: ['budget', 'timeline', 'decision_maker'],
                trigger: 'conversion_intent',
                completed: false
            }
        ];
    }

    triggerDetailedProfiling() {
        // Create detailed profiling modal
        const modal = document.createElement('div');
        modal.className = 'progressive-profiling-modal fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 to-black border border-blue-500/30 rounded-2xl p-8 max-w-lg w-full">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2 text-white">¡Personalicemos tu Experiencia! 🎯</h3>
                    <p class="text-gray-300 text-sm">
                        2 preguntas rápidas para recomendarte las mejores funcionalidades
                    </p>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">
                            ¿Cuál es tu nivel en crypto?
                        </label>
                        <select id="crypto-level" class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none">
                            <option value="">Selecciona tu nivel</option>
                            <option value="beginner">🌱 Principiante - Acabo de empezar</option>
                            <option value="intermediate">🚀 Intermedio - Conozco lo básico</option>
                            <option value="advanced">💎 Avanzado - Trading y DeFi regular</option>
                            <option value="expert">🔥 Experto - Deep DeFi y desarrollo</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">
                            ¿Qué te frustra más del crypto actual?
                        </label>
                        <select id="main-pain" class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none">
                            <option value="">Selecciona tu mayor dolor</option>
                            <option value="gas_fees">💸 Gas fees altísimos</option>
                            <option value="complexity">🤯 Demasiado complicado</option>
                            <option value="security">😰 Miedo a errores/hacks</option>
                            <option value="speed">🐌 Transacciones muy lentas</option>
                        </select>
                    </div>
                    
                    <button onclick="window.microConversionsOptimizer.handleDetailedProfiling()" 
                            class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300">
                        Personalizar Mi Experiencia 🎨
                    </button>
                    
                    <button onclick="this.closest('.progressive-profiling-modal').remove()" 
                            class="w-full text-center text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                        Continuar sin personalizar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        this.trackEvent('progressive_profiling_triggered', {
            stage: 'detailed',
            lead_score: this.leadScore
        });
    }

    handleDetailedProfiling() {
        const cryptoLevel = document.getElementById('crypto-level').value;
        const mainPain = document.getElementById('main-pain').value;
        
        if (!cryptoLevel || !mainPain) {
            // Highlight empty fields
            if (!cryptoLevel) document.getElementById('crypto-level').classList.add('border-red-500');
            if (!mainPain) document.getElementById('main-pain').classList.add('border-red-500');
            return;
        }

        // Update profile
        this.userProfile.profileData.cryptoLevel = cryptoLevel;
        this.userProfile.profileData.mainPain = mainPain;
        this.userProfile.detailedProfileCompleted = true;
        
        // Increase lead score significantly
        this.updateLeadScore('detailed_profiling', { cryptoLevel, mainPain });
        
        // Personalize experience based on profile
        this.personalizeExperience();
        
        // Show success
        this.showProfilingSuccess();
        
        this.trackEvent('progressive_profiling_completed', {
            stage: 'detailed',
            crypto_level: cryptoLevel,
            main_pain: mainPain,
            lead_score: this.leadScore
        });
    }

    personalizeExperience() {
        const { cryptoLevel, mainPain } = this.userProfile.profileData;
        
        // Personalize content based on profile
        if (mainPain === 'gas_fees') {
            this.emphasizeGasSavings();
        } else if (mainPain === 'complexity') {
            this.emphasizeSimplicity();
        } else if (mainPain === 'security') {
            this.emphasizeSecurity();
        }
        
        if (cryptoLevel === 'beginner') {
            this.showBeginnerFriendlyContent();
        } else if (cryptoLevel === 'expert') {
            this.showTechnicalDetails();
        }
    }

    emphasizeGasSavings() {
        // Highlight gas fee savings throughout the page
        const elements = document.querySelectorAll('[data-gas-savings]');
        elements.forEach(el => {
            el.style.border = '2px solid #ef4444';
            el.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3)';
        });
    }

    emphasizeSimplicity() {
        // Highlight simplicity messaging
        const elements = document.querySelectorAll('[data-simplicity]');
        elements.forEach(el => {
            el.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))';
            el.style.border = '1px solid rgba(16, 185, 129, 0.3)';
        });
    }

    emphasizeSecurity() {
        // Highlight security features
        const elements = document.querySelectorAll('[data-security]');
        elements.forEach(el => {
            el.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))';
            el.style.border = '1px solid rgba(59, 130, 246, 0.3)';
        });
    }

    showBeginnerFriendlyContent() {
        // Show beginner-friendly explanations
        const beginnerTips = document.querySelectorAll('[data-beginner-tip]');
        beginnerTips.forEach(tip => {
            tip.style.display = 'block';
        });
    }

    showTechnicalDetails() {
        // Show technical implementation details
        const techDetails = document.querySelectorAll('[data-technical-details]');
        techDetails.forEach(detail => {
            detail.style.display = 'block';
        });
    }

    showProfilingSuccess() {
        const modal = document.querySelector('.progressive-profiling-modal');
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 to-black border border-green-500/30 rounded-2xl p-8 max-w-lg w-full text-center">
                <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-bold mb-4 text-green-400">¡Experiencia Personalizada! ✨</h3>
                <p class="text-gray-300 mb-6">
                    Hemos personalizado la página basada en tu perfil. 
                    Ahora verás contenido más relevante para ti.
                </p>
                <button onclick="this.closest('.progressive-profiling-modal').remove()" 
                        class="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition-all duration-300">
                    ¡Explorar Contenido Personalizado! 🎯
                </button>
            </div>
        `;
        
        setTimeout(() => {
            modal.remove();
        }, 5000);
    }

    /**
     * LEAD SCORING
     */
    initializeLeadScoring() {
        if (!this.options.leadScoringEnabled) return;
        
        this.leadScoringRules = {
            email_captured: 25,
            video_played: 15,
            video_completed: 25,
            testimonial_interaction: 10,
            feature_exploration: 15,
            social_proof_engagement: 5,
            time_on_page_30s: 5,
            time_on_page_60s: 10,
            time_on_page_120s: 15,
            scroll_75_percent: 10,
            scroll_100_percent: 15,
            cta_hover: 5,
            cta_click: 20,
            form_interaction: 15,
            exit_intent_conversion: 40,
            detailed_profiling: 30,
            return_visit: 20
        };
        
        this.leadScore = 0;
        this.updateEngagementLevel();
    }

    updateLeadScore(event, data = {}) {
        if (!this.options.leadScoringEnabled) return;
        
        const points = this.leadScoringRules[event] || 0;
        this.leadScore = Math.min(100, this.leadScore + points);
        
        // Update engagement level based on score
        this.updateEngagementLevel();
        
        this.trackEvent('lead_score_updated', {
            event: event,
            points_added: points,
            new_score: this.leadScore,
            engagement_level: this.engagementLevel,
            data: data
        });
    }

    updateEngagementLevel() {
        const previousLevel = this.engagementLevel;
        
        if (this.leadScore >= 75) {
            this.engagementLevel = 'hot';
        } else if (this.leadScore >= 40) {
            this.engagementLevel = 'warm';
        } else {
            this.engagementLevel = 'cold';
        }
        
        // Trigger engagement level change actions
        if (previousLevel !== this.engagementLevel) {
            this.handleEngagementLevelChange(previousLevel, this.engagementLevel);
        }
    }

    handleEngagementLevelChange(from, to) {
        this.trackEvent('engagement_level_changed', {
            from: from,
            to: to,
            lead_score: this.leadScore
        });
        
        // Take actions based on engagement level
        if (to === 'hot' && !this.userProfile.emailCaptured) {
            // High-priority email capture for hot leads
            setTimeout(() => {
                this.triggerPriorityEmailCapture();
            }, 5000);
        } else if (to === 'warm') {
            // Show social proof for warm leads
            this.emphasizeSocialProof();
        }
    }

    triggerPriorityEmailCapture() {
        // Priority email capture with special offer
        const modal = document.createElement('div');
        modal.className = 'priority-capture-modal fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-yellow-900 to-yellow-800 border border-yellow-500/50 rounded-2xl p-8 max-w-md w-full">
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4">🔥</div>
                    <h3 class="text-2xl font-bold mb-2 text-yellow-400">¡LEAD CALIFICADO!</h3>
                    <p class="text-yellow-100">
                        Vemos que estás súper interesado. 
                        Te damos acceso VIP inmediato.
                    </p>
                </div>
                
                <div class="bg-black/30 rounded-xl p-4 mb-6">
                    <h4 class="text-lg font-bold text-yellow-300 mb-2">🎯 Acceso VIP Incluye:</h4>
                    <ul class="space-y-1 text-sm text-yellow-100">
                        <li>✅ Beta access inmediato</li>
                        <li>✅ Soporte prioritario 24/7</li>
                        <li>✅ Features exclusivas early bird</li>
                        <li>✅ Call 1-on-1 con el founder</li>
                    </ul>
                </div>
                
                <div class="space-y-3">
                    <input type="email" 
                           id="priority-email" 
                           placeholder="Email para acceso VIP inmediato..." 
                           class="w-full px-4 py-3 bg-gray-800 border border-yellow-500 rounded-xl text-white placeholder-gray-300 focus:border-yellow-400 focus:outline-none">
                    
                    <button onclick="window.microConversionsOptimizer.handlePriorityCapture()" 
                            class="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black rounded-xl font-bold transition-all duration-300">
                        🚀 ACCESO VIP INMEDIATO
                    </button>
                    
                    <button onclick="this.closest('.priority-capture-modal').remove()" 
                            class="w-full text-center text-yellow-400 hover:text-yellow-300 transition-colors duration-300 text-sm">
                        Continuar sin acceso VIP
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Focus on email input
        setTimeout(() => {
            document.getElementById('priority-email').focus();
        }, 300);
    }

    handlePriorityCapture() {
        const email = document.getElementById('priority-email').value.trim();
        
        if (!email || !email.includes('@')) {
            this.showFieldError(document.getElementById('priority-email'), 'Email requerido para acceso VIP');
            return;
        }

        // Mark as high-value conversion
        this.userProfile.email = email;
        this.userProfile.emailCaptured = true;
        this.userProfile.vipAccess = true;
        
        // Maximum lead score
        this.leadScore = 100;
        this.engagementLevel = 'hot';
        
        // Show VIP success
        this.showVIPSuccess();
        
        this.trackEvent('vip_conversion', {
            email: email,
            lead_score: this.leadScore,
            source: 'priority_capture'
        });
    }

    showVIPSuccess() {
        const modal = document.querySelector('.priority-capture-modal');
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-yellow-900 to-yellow-800 border border-yellow-500/50 rounded-2xl p-8 max-w-md w-full text-center">
                <div class="text-6xl mb-4">👑</div>
                <h3 class="text-2xl font-bold mb-4 text-yellow-400">¡BIENVENIDO VIP!</h3>
                <p class="text-yellow-100 mb-6">
                    Acceso VIP activado. Te contactamos en las próximas 2 horas para tu onboarding personalizado.
                </p>
                
                <div class="bg-yellow-500/20 border border-yellow-500/40 rounded-xl p-4 mb-6">
                    <p class="text-sm text-yellow-200">
                        📞 <strong>Próximos pasos:</strong> Call con el founder en las próximas 24h para setup personalizado.
                    </p>
                </div>
                
                <button onclick="this.closest('.priority-capture-modal').remove()" 
                        class="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black rounded-xl font-bold transition-all duration-300">
                    ¡Comenzar Como VIP! 👑
                </button>
            </div>
        `;
        
        setTimeout(() => {
            modal.remove();
        }, 6000);
    }

    /**
     * REAL-TIME OPTIMIZATION
     */
    startRealTimeOptimization() {
        setInterval(() => {
            this.optimizeMicroConversions();
            this.updateUserProfile();
            this.adjustConversionFunnel();
        }, 15000); // Every 15 seconds
    }

    optimizeMicroConversions() {
        // Analyze current performance and optimize
        this.microConversions.forEach((conversion, id) => {
            if (!conversion.completed) {
                this.evaluateConversionOpportunity(conversion);
            }
        });
    }

    evaluateConversionOpportunity(conversion) {
        const now = Date.now();
        const timeOnPage = now - this.userProfile.sessionStart;
        
        // Dynamic evaluation based on current context
        if (conversion.id === 'email_capture' && 
            timeOnPage > 90000 && // 1.5 minutes
            this.leadScore > 30 && 
            !conversion.completed &&
            conversion.attempts < 2) {
            
            conversion.handler();
        }
    }

    updateUserProfile() {
        this.userProfile.timeOnPage = Date.now() - this.userProfile.sessionStart;
        this.userProfile.lastActivity = Date.now();
        
        // Persist profile data
        this.persistUserProfile();
    }

    adjustConversionFunnel() {
        // Adjust funnel based on real-time data
        const funnelStage = this.getCurrentFunnelStage();
        
        if (funnelStage !== this.userProfile.funnelStage) {
            this.userProfile.funnelStage = funnelStage;
            this.handleFunnelStageChange(funnelStage);
        }
    }

    getCurrentFunnelStage() {
        if (this.userProfile.emailCaptured) return 'qualified_lead';
        if (this.leadScore > 50) return 'interested';
        if (this.leadScore > 20) return 'engaged';
        return 'awareness';
    }

    handleFunnelStageChange(stage) {
        this.trackEvent('funnel_stage_changed', {
            stage: stage,
            lead_score: this.leadScore,
            time_to_stage: Date.now() - this.userProfile.sessionStart
        });
        
        // Adapt experience based on funnel stage
        switch (stage) {
            case 'qualified_lead':
                this.showQualifiedLeadExperience();
                break;
            case 'interested':
                this.showInterestedUserExperience();
                break;
            case 'engaged':
                this.showEngagedUserExperience();
                break;
        }
    }

    showQualifiedLeadExperience() {
        // Show conversion-focused content
        const conversionElements = document.querySelectorAll('[data-conversion-focused]');
        conversionElements.forEach(el => {
            el.style.display = 'block';
        });
    }

    showInterestedUserExperience() {
        // Emphasize benefits and social proof
        const benefitElements = document.querySelectorAll('[data-benefits]');
        benefitElements.forEach(el => {
            el.style.border = '2px solid rgba(16, 185, 129, 0.3)';
        });
    }

    showEngagedUserExperience() {
        // Show detailed information
        const detailElements = document.querySelectorAll('[data-detailed-info]');
        detailElements.forEach(el => {
            el.style.display = 'block';
        });
    }

    /**
     * UTILITY METHODS
     */
    initializeUserProfile() {
        return {
            sessionId: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            sessionStart: Date.now(),
            timeOnPage: 0,
            lastActivity: Date.now(),
            emailCaptured: false,
            email: null,
            vipAccess: false,
            detailedProfileCompleted: false,
            profileData: {},
            scrollMilestones: {
                25: false,
                50: false,
                75: false,
                90: false,
                100: false
            },
            funnelStage: 'awareness'
        };
    }

    initializeConversionFunnel() {
        return {
            awareness: { entered: Date.now(), completed: false },
            interest: { entered: null, completed: false },
            consideration: { entered: null, completed: false },
            conversion: { entered: null, completed: false }
        };
    }

    trackInteraction(type, data) {
        this.interactionHistory.push({
            type: type,
            data: data,
            timestamp: Date.now(),
            leadScore: this.leadScore,
            engagementLevel: this.engagementLevel
        });
        
        // Keep only last 100 interactions
        if (this.interactionHistory.length > 100) {
            this.interactionHistory = this.interactionHistory.slice(-100);
        }
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    trackEvent(event, data) {
        // Integration with analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', event, {
                event_category: 'micro_conversions',
                lead_score: this.leadScore,
                engagement_level: this.engagementLevel,
                ...data
            });
        }
        
        if (this.options.debug) {
            console.log(`🎯 Micro-conversion event: ${event}`, data);
        }
    }

    persistUserProfile() {
        try {
            localStorage.setItem('user_profile', JSON.stringify(this.userProfile));
            localStorage.setItem('lead_score', this.leadScore.toString());
            localStorage.setItem('engagement_level', this.engagementLevel);
        } catch (error) {
            this.log('Failed to persist user profile:', error);
        }
    }

    loadUserProfile() {
        try {
            const profile = localStorage.getItem('user_profile');
            const score = localStorage.getItem('lead_score');
            const level = localStorage.getItem('engagement_level');
            
            if (profile) {
                this.userProfile = { ...this.userProfile, ...JSON.parse(profile) };
            }
            if (score) {
                this.leadScore = parseInt(score, 10);
            }
            if (level) {
                this.engagementLevel = level;
            }
        } catch (error) {
            this.log('Failed to load user profile:', error);
        }
    }

    handleMainConversion(source) {
        this.trackEvent('main_conversion_triggered', {
            source: source,
            lead_score: this.leadScore,
            engagement_level: this.engagementLevel
        });
        
        // Trigger main conversion flow
        if (window.advancedConversion) {
            window.advancedConversion.triggerMainConversion(source);
        }
    }

    log(message, ...args) {
        if (this.options.debug) {
            console.log(`%c[Micro-Conversions] ${message}`, 'color: #10b981; font-weight: bold;', ...args);
        }
    }

    // Public API
    getLeadScore() {
        return this.leadScore;
    }

    getEngagementLevel() {
        return this.engagementLevel;
    }

    getUserProfile() {
        return { ...this.userProfile };
    }

    forceEmailCapture() {
        this.triggerEmailCapture();
    }

    forceExitIntent() {
        this.triggerExitIntentCapture();
    }
}

// Global instance
window.MicroConversionsOptimizer = MicroConversionsOptimizer;

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.microConversionsOptimizer = new MicroConversionsOptimizer({
            debug: true
        });
    });
} else {
    window.microConversionsOptimizer = new MicroConversionsOptimizer({
        debug: true
    });
}

export default MicroConversionsOptimizer;