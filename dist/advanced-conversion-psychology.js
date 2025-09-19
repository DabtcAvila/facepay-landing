/**
 * ADVANCED CONVERSION PSYCHOLOGY SYSTEM
 * Maximizes conversions through cognitive bias exploitation and behavioral triggers
 * 
 * Features:
 * - Cognitive Bias Exploitation (Anchoring, Social Proof, Scarcity, Authority, Reciprocity)
 * - Behavioral Triggers (Loss Aversion, Progress Indicators, Achievement Unlocks)
 * - Dynamic A/B Testing Framework
 * - Micro-Conversions Optimization
 * - Real-time Analytics Tracking
 */

export class AdvancedConversionPsychology {
    constructor(options = {}) {
        this.options = {
            debug: options.debug || false,
            testingEnabled: options.testingEnabled || true,
            trackingEnabled: options.trackingEnabled || true,
            personalizedExperience: options.personalizedExperience || true,
            ...options
        };
        
        this.userId = this.generateUserId();
        this.sessionData = this.initializeSession();
        this.cognitiveProfile = this.analyzeCognitiveProfile();
        this.conversionFunnel = this.initializeConversionFunnel();
        
        this.experiments = new Map();
        this.triggers = new Map();
        this.microConversions = [];
        this.behaviorTracking = [];
        
        this.init();
    }

    init() {
        this.log('🧠 Initializing Advanced Conversion Psychology System...');
        
        // Initialize core systems
        this.initializeCognitiveBiases();
        this.initializeBehavioralTriggers();
        this.initializeABTestingFramework();
        this.initializeMicroConversions();
        this.initializeAnalyticsTracking();
        this.initializePersonalization();
        
        // Start real-time optimization
        this.startRealTimeOptimization();
        
        this.log('✅ Advanced Conversion Psychology System Active');
    }

    /**
     * COGNITIVE BIASES EXPLOITATION
     * Implements psychological triggers based on user behavior patterns
     */
    initializeCognitiveBiases() {
        this.cognitiveBiases = {
            // Anchoring Bias - Price psychology
            anchoring: {
                enabled: true,
                highAnchor: '$497',
                currentPrice: 'FREE',
                savingsAmount: '$497',
                implement: () => this.implementAnchoring()
            },

            // Social Proof - Testimonials, user count
            socialProof: {
                enabled: true,
                userCount: this.getDynamicUserCount(),
                testimonials: this.getHighImpactTestimonials(),
                recentActivity: this.generateRecentActivity(),
                implement: () => this.implementSocialProof()
            },

            // Scarcity - Limited beta spots
            scarcity: {
                enabled: true,
                spotsLeft: this.getDynamicSpotsLeft(),
                timeLeft: this.getTimeRemaining(),
                urgencyLevel: this.calculateUrgencyLevel(),
                implement: () => this.implementScarcity()
            },

            // Authority - Expert endorsements
            authority: {
                enabled: true,
                awards: ['StarkNet Hackathon 2024 Winner'],
                endorsements: this.getExpertEndorsements(),
                credentials: this.getTechnicalCredentials(),
                implement: () => this.implementAuthority()
            },

            // Reciprocity - Free value first
            reciprocity: {
                enabled: true,
                freeValue: '$497 worth of beta access',
                bonusContent: this.getBonusContent(),
                exclusiveAccess: true,
                implement: () => this.implementReciprocity()
            }
        };

        // Implement active biases based on user profile
        Object.values(this.cognitiveBiases).forEach(bias => {
            if (bias.enabled) {
                bias.implement();
            }
        });
    }

    implementAnchoring() {
        // Create price anchoring elements
        const anchoringElements = document.querySelectorAll('[data-anchoring]');
        anchoringElements.forEach(element => {
            const originalHTML = element.innerHTML;
            element.innerHTML = `
                <div class="price-anchoring">
                    <span class="original-price line-through text-gray-500">$497</span>
                    <span class="current-price text-2xl font-bold text-green-400 ml-2">FREE</span>
                    <div class="savings-badge bg-red-500 text-white px-2 py-1 rounded text-xs ml-2">
                        AHORRAS $497
                    </div>
                </div>
                ${originalHTML}
            `;
        });

        this.trackEvent('cognitive_bias_triggered', { type: 'anchoring' });
    }

    implementSocialProof() {
        // Dynamic user counter with realistic growth
        this.updateUserCounter();
        
        // Recent activity notifications
        this.showRecentActivity();
        
        // Testimonial rotation with impact metrics
        this.enhanceTestimonials();
        
        // Social proof badges
        this.addSocialProofBadges();
    }

    updateUserCounter() {
        const baseCount = 10000;
        const timeMultiplier = Math.floor(Date.now() / 1000 / 300); // Increases every 5 minutes
        const currentCount = baseCount + (timeMultiplier * Math.floor(Math.random() * 3 + 1));
        
        const userCounters = document.querySelectorAll('[data-user-count]');
        userCounters.forEach(counter => {
            this.animateNumber(counter, currentCount);
        });
        
        this.sessionData.socialProof.userCount = currentCount;
    }

    showRecentActivity() {
        const activities = [
            { name: 'María G.', action: 'se unió', time: '2 min', location: 'CDMX' },
            { name: 'Carlos M.', action: 'reservó @carlos', time: '4 min', location: 'Guadalajara' },
            { name: 'Ana L.', action: 'completó setup', time: '7 min', location: 'Monterrey' },
            { name: 'Diego R.', action: 'ahorró $50', time: '12 min', location: 'Puebla' },
            { name: 'Sofia P.', action: 'invitó 3 amigos', time: '15 min', location: 'Tijuana' }
        ];

        const showActivity = () => {
            const activity = activities[Math.floor(Math.random() * activities.length)];
            const notification = this.createActivityNotification(activity);
            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => notification.classList.add('show'), 100);

            // Remove after 4 seconds
            setTimeout(() => {
                notification.classList.add('hide');
                setTimeout(() => notification.remove(), 300);
            }, 4000);

            this.trackEvent('social_proof_shown', { type: 'recent_activity', activity });
        };

        // Show first activity after 3 seconds
        setTimeout(showActivity, 3000);

        // Continue showing activities every 15-25 seconds
        setInterval(() => {
            if (Math.random() > 0.3) { // 70% chance to show
                showActivity();
            }
        }, 15000 + Math.random() * 10000);
    }

    createActivityNotification(activity) {
        const notification = document.createElement('div');
        notification.className = 'social-activity-notification fixed bottom-4 right-4 bg-black/90 backdrop-blur border border-green-500/20 rounded-xl p-4 transform translate-x-full transition-all duration-300 z-50';
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="relative">
                    <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <span class="text-black text-sm font-bold">${activity.name.charAt(0)}</span>
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black animate-pulse"></div>
                </div>
                <div class="text-sm">
                    <div class="text-white font-medium">
                        <strong>${activity.name}</strong> ${activity.action}
                    </div>
                    <div class="text-gray-400 text-xs">
                        ${activity.time} • ${activity.location}
                    </div>
                </div>
            </div>
        `;

        // Add show/hide classes for animation
        notification.classList.add('translate-x-full');
        return notification;
    }

    implementScarcity() {
        // Dynamic spots counter that decreases realistically
        this.updateSpotsCounter();
        
        // Countdown timer with psychological pressure
        this.enhanceCountdownTimer();
        
        // Scarcity indicators throughout the page
        this.addScarcityIndicators();
    }

    updateSpotsCounter() {
        const baseSpots = 127;
        const timeElapsed = Math.floor((Date.now() - this.sessionData.startTime) / 1000 / 60); // minutes
        const spotsReduction = Math.floor(timeElapsed / 5) * Math.floor(Math.random() * 3 + 1); // Reduce every 5 minutes
        const currentSpots = Math.max(50, baseSpots - spotsReduction);
        
        const spotsCounters = document.querySelectorAll('[data-spots-left]');
        spotsCounters.forEach(counter => {
            this.animateNumber(counter, currentSpots);
            
            // Add urgency styling based on spots left
            if (currentSpots < 75) {
                counter.classList.add('text-red-400', 'font-bold');
                counter.parentElement.classList.add('animate-pulse');
            }
        });
        
        this.sessionData.scarcity.spotsLeft = currentSpots;
    }

    enhanceCountdownTimer() {
        const timers = document.querySelectorAll('[data-countdown]');
        timers.forEach(timer => {
            // Add visual urgency enhancements
            timer.classList.add('countdown-enhanced');
            
            // Inject urgency CSS if not already present
            if (!document.querySelector('#countdown-urgency-styles')) {
                const styles = document.createElement('style');
                styles.id = 'countdown-urgency-styles';
                styles.textContent = `
                    .countdown-enhanced {
                        background: linear-gradient(135deg, rgba(255, 0, 0, 0.1), rgba(255, 50, 0, 0.05));
                        border: 1px solid rgba(255, 0, 0, 0.3);
                        box-shadow: 0 0 20px rgba(255, 0, 0, 0.2);
                        animation: countdownPulse 2s infinite;
                    }
                    
                    @keyframes countdownPulse {
                        0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.2); }
                        50% { box-shadow: 0 0 30px rgba(255, 0, 0, 0.4); }
                    }
                    
                    .countdown-critical {
                        animation: countdownCritical 1s infinite !important;
                        background: linear-gradient(135deg, rgba(255, 0, 0, 0.3), rgba(255, 50, 0, 0.2)) !important;
                    }
                    
                    @keyframes countdownCritical {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                `;
                document.head.appendChild(styles);
            }
        });
    }

    implementAuthority() {
        // Add authority badges throughout the page
        const authorityBadges = document.querySelectorAll('[data-authority]');
        authorityBadges.forEach(badge => {
            badge.innerHTML = `
                <div class="authority-cluster flex flex-wrap gap-2 justify-center">
                    <span class="authority-badge bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold">
                        🏆 GANADOR STARKNET 2024
                    </span>
                    <span class="authority-badge bg-gradient-to-r from-blue-400 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        ✅ AUDITADO POR CONSENSYS
                    </span>
                    <span class="authority-badge bg-gradient-to-r from-purple-400 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        📰 FEATURED EN FORBES
                    </span>
                </div>
            `;
        });

        this.trackEvent('cognitive_bias_triggered', { type: 'authority' });
    }

    implementReciprocity() {
        // Add value statements and free bonuses
        const reciprocityElements = document.querySelectorAll('[data-reciprocity]');
        reciprocityElements.forEach(element => {
            element.innerHTML = `
                <div class="reciprocity-value-stack bg-gradient-to-br from-green-500/10 to-green-400/5 border border-green-500/30 rounded-xl p-6">
                    <h3 class="text-xl font-bold mb-4 text-green-400">🎁 Tu Regalo Beta GRATIS Incluye:</h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-white">✅ Acceso Beta Premium</span>
                            <span class="text-green-400 font-bold">$197</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-white">✅ @username Premium Reservado</span>
                            <span class="text-green-400 font-bold">$99</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-white">✅ Zero Gas Fees de Por Vida</span>
                            <span class="text-green-400 font-bold">$201</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-white">✅ Soporte Prioritario 24/7</span>
                            <span class="text-green-400 font-bold">$97</span>
                        </div>
                        <hr class="border-gray-600 my-3">
                        <div class="flex items-center justify-between text-lg font-bold">
                            <span class="text-white">VALOR TOTAL:</span>
                            <span class="text-green-400">$594</span>
                        </div>
                        <div class="text-center bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                            <div class="text-red-400 font-bold text-xl">TU PRECIO HOY: $0</div>
                            <div class="text-green-400 font-bold text-lg">AHORRAS: $594</div>
                        </div>
                    </div>
                </div>
            `;
        });

        this.trackEvent('cognitive_bias_triggered', { type: 'reciprocity', value: 594 });
    }

    /**
     * BEHAVIORAL TRIGGERS
     * Implements advanced behavioral psychology patterns
     */
    initializeBehavioralTriggers() {
        this.behavioralTriggers = {
            lossAversion: this.initializeLossAversion(),
            progressIndicators: this.initializeProgressIndicators(),
            achievementUnlocks: this.initializeAchievementUnlocks(),
            personalization: this.initializePersonalization(),
            urgencyWithoutPressure: this.initializeUrgencyWithoutPressure()
        };
    }

    initializeLossAversion() {
        // Track what user might lose by not converting
        const lossItems = [
            { item: 'Gas fees de $50+ por transacción', cost: '$600+/año' },
            { item: 'Tiempo copiando direcciones 0x...', cost: '20+ horas/año' },
            { item: 'Estrés por errores en transacciones', cost: 'Invaluable' },
            { item: 'Ser early adopter del futuro', cost: 'Oportunidad única' }
        ];

        // Show loss aversion messaging strategically
        this.addLossAversionElements(lossItems);
        
        return {
            enabled: true,
            items: lossItems,
            trigger: () => this.triggerLossAversion()
        };
    }

    addLossAversionElements(lossItems) {
        const lossElements = document.querySelectorAll('[data-loss-aversion]');
        lossElements.forEach(element => {
            element.innerHTML = `
                <div class="loss-aversion-container bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                    <h3 class="text-xl font-bold mb-4 text-red-400">❌ Lo Que Pierdes Al No Actuar:</h3>
                    <div class="space-y-3">
                        ${lossItems.map(item => `
                            <div class="flex items-center justify-between">
                                <span class="text-white">• ${item.item}</span>
                                <span class="text-red-400 font-bold">${item.cost}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="mt-6 text-center bg-red-500/20 rounded-lg p-3">
                        <div class="text-red-400 font-bold">¿Vale la pena seguir perdiendo dinero y tiempo?</div>
                    </div>
                </div>
            `;
        });
    }

    initializeProgressIndicators() {
        // Multi-step conversion process with progress visualization
        const steps = [
            { id: 'awareness', name: 'Descubrimiento', completed: true },
            { id: 'interest', name: 'Interés', completed: this.sessionData.timeOnPage > 30 },
            { id: 'desire', name: 'Deseo', completed: this.sessionData.videoWatched },
            { id: 'action', name: 'Acción', completed: false }
        ];

        this.createProgressIndicator(steps);
        
        return {
            steps: steps,
            currentStep: this.getCurrentStep(steps),
            update: () => this.updateProgressIndicator()
        };
    }

    createProgressIndicator(steps) {
        const progressElements = document.querySelectorAll('[data-progress-indicator]');
        progressElements.forEach(element => {
            element.innerHTML = `
                <div class="progress-indicator bg-black/50 backdrop-blur border border-green-500/30 rounded-xl p-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm text-gray-300">Tu Progreso</span>
                        <span class="text-sm text-green-400">${this.getProgressPercentage(steps)}% Completo</span>
                    </div>
                    <div class="flex space-x-2">
                        ${steps.map((step, index) => `
                            <div class="flex-1">
                                <div class="progress-step ${step.completed ? 'completed' : 'pending'} h-2 rounded-full ${
                                    step.completed ? 'bg-green-400' : 'bg-gray-600'
                                }"></div>
                                <div class="text-xs mt-1 text-center ${
                                    step.completed ? 'text-green-400' : 'text-gray-400'
                                }">${step.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
    }

    initializeAchievementUnlocks() {
        const achievements = [
            {
                id: 'time_30s',
                name: '🚀 Explorer',
                description: 'Exploraste por 30 segundos',
                unlocked: false,
                trigger: () => this.sessionData.timeOnPage > 30
            },
            {
                id: 'video_watched',
                name: '🎬 Movie Buff',
                description: 'Viste el demo completo',
                unlocked: false,
                trigger: () => this.sessionData.videoWatched
            },
            {
                id: 'scroll_bottom',
                name: '📜 Completionist',
                description: 'Llegaste hasta el final',
                unlocked: false,
                trigger: () => this.sessionData.scrolledToBottom
            }
        ];

        this.startAchievementTracking(achievements);
        
        return {
            achievements: achievements,
            check: () => this.checkAchievements(),
            unlock: (id) => this.unlockAchievement(id)
        };
    }

    unlockAchievement(achievement) {
        // Create achievement notification
        const notification = document.createElement('div');
        notification.className = 'achievement-unlock fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-xl p-4 transform -translate-y-full transition-all duration-500 z-50';
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="text-2xl">${achievement.name.split(' ')[0]}</div>
                <div>
                    <div class="font-bold">${achievement.name}</div>
                    <div class="text-sm opacity-80">${achievement.description}</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
        }, 100);

        // Animate out after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(-100%)';
            setTimeout(() => notification.remove(), 500);
        }, 4000);

        // Play achievement sound
        this.playAchievementSound();

        this.trackEvent('achievement_unlocked', {
            achievement_id: achievement.id,
            achievement_name: achievement.name
        });
    }

    /**
     * A/B TESTING FRAMEWORK
     * Dynamic testing system for optimization
     */
    initializeABTestingFramework() {
        this.testingFramework = {
            experiments: this.loadExperiments(),
            userVariant: this.assignUserToVariants(),
            track: (experiment, event, data) => this.trackExperiment(experiment, event, data)
        };

        this.applyExperimentVariants();
    }

    loadExperiments() {
        return {
            headline_test: {
                name: 'Headline Optimization',
                variants: [
                    {
                        id: 'control',
                        weight: 25,
                        changes: { /* No changes - original */ }
                    },
                    {
                        id: 'pain_point',
                        weight: 25,
                        changes: {
                            '.hero h1': '¿Cansado de Pagar $50 en Gas Fees?',
                            '.hero p': 'Esta App lo Cambió Todo para 10,000+ Personas'
                        }
                    },
                    {
                        id: 'curiosity',
                        weight: 25,
                        changes: {
                            '.hero h1': 'Por Primera Vez en la Historia:',
                            '.hero p': 'Envía Crypto Como Un DM de Instagram'
                        }
                    },
                    {
                        id: 'exclusive',
                        weight: 25,
                        changes: {
                            '.hero h1': 'BETA EXCLUSIVA:',
                            '.hero p': 'La App Que Hizo Crypto Tan Fácil Como FaceTime'
                        }
                    }
                ]
            },
            
            cta_button_test: {
                name: 'CTA Button Optimization',
                variants: [
                    {
                        id: 'control',
                        weight: 20,
                        changes: { /* Original button */ }
                    },
                    {
                        id: 'urgency',
                        weight: 20,
                        changes: {
                            '.btn-primary': {
                                text: '🔥 ACCESO INMEDIATO (SOLO HOY)',
                                color: 'bg-red-500',
                                pulse: true
                            }
                        }
                    },
                    {
                        id: 'benefit',
                        weight: 20,
                        changes: {
                            '.btn-primary': {
                                text: '💰 NUNCA MÁS GAS FEES (GRATIS)',
                                color: 'bg-green-500',
                                glow: true
                            }
                        }
                    },
                    {
                        id: 'social',
                        weight: 20,
                        changes: {
                            '.btn-primary': {
                                text: '🚀 ÚNETE A 10,000+ PIONEROS',
                                color: 'bg-purple-500',
                                social_count: true
                            }
                        }
                    },
                    {
                        id: 'scarcity',
                        weight: 20,
                        changes: {
                            '.btn-primary': {
                                text: '⚡ DAME MI LUGAR ANTES QUE SE ACABE',
                                color: 'bg-orange-500',
                                countdown: true
                            }
                        }
                    }
                ]
            }
        };
    }

    assignUserToVariants() {
        const variants = {};
        
        Object.keys(this.testingFramework.experiments).forEach(experimentId => {
            const experiment = this.testingFramework.experiments[experimentId];
            
            // Check if user already assigned to variant
            const storedVariant = localStorage.getItem(`experiment_${experimentId}`);
            if (storedVariant) {
                variants[experimentId] = storedVariant;
                return;
            }
            
            // Assign based on weights
            const random = Math.random() * 100;
            let cumulative = 0;
            
            for (const variant of experiment.variants) {
                cumulative += variant.weight;
                if (random <= cumulative) {
                    variants[experimentId] = variant.id;
                    localStorage.setItem(`experiment_${experimentId}`, variant.id);
                    break;
                }
            }
        });
        
        return variants;
    }

    applyExperimentVariants() {
        Object.keys(this.testingFramework.userVariant).forEach(experimentId => {
            const variantId = this.testingFramework.userVariant[experimentId];
            const experiment = this.testingFramework.experiments[experimentId];
            const variant = experiment.variants.find(v => v.id === variantId);
            
            if (variant && variant.changes) {
                this.applyVariantChanges(variant.changes);
            }
            
            // Track experiment exposure
            this.trackExperiment(experimentId, 'exposed', { variant: variantId });
        });
    }

    applyVariantChanges(changes) {
        Object.keys(changes).forEach(selector => {
            const elements = document.querySelectorAll(selector);
            const change = changes[selector];
            
            elements.forEach(element => {
                if (typeof change === 'string') {
                    // Simple text change
                    element.textContent = change;
                } else if (typeof change === 'object') {
                    // Complex changes
                    if (change.text) element.textContent = change.text;
                    if (change.color) {
                        element.className = element.className.replace(/bg-\w+-\d+/g, '');
                        element.classList.add(change.color);
                    }
                    if (change.pulse) element.classList.add('animate-pulse');
                    if (change.glow) element.classList.add('shadow-glow');
                }
            });
        });
    }

    /**
     * MICRO-CONVERSIONS OPTIMIZATION
     * Captures smaller conversion events leading to main goal
     */
    initializeMicroConversions() {
        this.microConversions = [
            {
                id: 'email_capture',
                name: 'Email Collection',
                trigger: 'scroll_75',
                implemented: false,
                handler: () => this.triggerEmailCapture()
            },
            {
                id: 'video_engagement',
                name: 'Video Watch',
                trigger: 'video_start',
                implemented: false,
                handler: () => this.triggerVideoEngagement()
            },
            {
                id: 'testimonial_read',
                name: 'Testimonial Reading',
                trigger: 'testimonial_hover',
                implemented: false,
                handler: () => this.triggerTestimonialRead()
            }
        ];

        this.setupMicroConversionTriggers();
    }

    setupMicroConversionTriggers() {
        // Scroll-based email capture
        let scrollTriggered = false;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent > 75 && !scrollTriggered && !this.sessionData.emailCaptured) {
                scrollTriggered = true;
                this.triggerEmailCapture();
            }
        });

        // Video engagement tracking
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.addEventListener('play', () => {
                this.sessionData.videoWatched = true;
                this.triggerVideoEngagement();
            });
        });

        // Exit intent trigger
        this.setupExitIntentCapture();
    }

    triggerEmailCapture() {
        if (this.sessionData.emailCaptured) return;

        const modal = document.createElement('div');
        modal.className = 'micro-conversion-modal fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 to-black border border-green-500/30 rounded-2xl p-8 max-w-md w-full transform scale-95 transition-all">
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4">🎯</div>
                    <h3 class="text-2xl font-bold mb-2">¡Un Momento!</h3>
                    <p class="text-gray-300">Antes de que te vayas, ¿quieres que te avisemos cuando abramos más spots?</p>
                </div>
                
                <div class="space-y-4">
                    <input type="email" id="micro-email" placeholder="tu@email.com" 
                           class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:outline-none">
                    
                    <div class="flex space-x-3">
                        <button onclick="this.parentElement.parentElement.parentElement.parentElement.remove()" 
                                class="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition">
                            No gracias
                        </button>
                        <button onclick="window.advancedConversion.handleEmailCapture()" 
                                class="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-bold">
                            ¡Sí, avísame!
                        </button>
                    </div>
                    
                    <p class="text-xs text-gray-400 text-center">
                        Te avisaremos cuando abramos el próximo grupo (usualmente en 24-48h)
                    </p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
            modal.querySelector('div').style.transform = 'scale(1)';
        }, 100);

        this.trackEvent('micro_conversion_triggered', { type: 'email_capture' });
    }

    handleEmailCapture() {
        const emailInput = document.getElementById('micro-email');
        const email = emailInput.value.trim();
        
        if (email && email.includes('@')) {
            this.sessionData.emailCaptured = true;
            this.sessionData.email = email;
            
            // Show success message
            const modal = document.querySelector('.micro-conversion-modal');
            modal.innerHTML = `
                <div class="bg-gradient-to-br from-green-900 to-green-800 border border-green-500/50 rounded-2xl p-8 max-w-md w-full text-center">
                    <div class="text-6xl mb-4">🎉</div>
                    <h3 class="text-2xl font-bold mb-2 text-green-400">¡Perfecto!</h3>
                    <p class="text-green-100 mb-4">Te notificaremos cuando abramos más spots.</p>
                    <p class="text-sm text-green-200">Mientras tanto, ¿por qué no echas un vistazo al resto de la página?</p>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="mt-4 px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition">
                        ¡Entendido!
                    </button>
                </div>
            `;
            
            setTimeout(() => modal.remove(), 3000);
            
            this.trackEvent('micro_conversion_completed', { 
                type: 'email_capture', 
                email: email 
            });
        } else {
            emailInput.classList.add('border-red-500');
            emailInput.placeholder = 'Por favor ingresa un email válido';
        }
    }

    setupExitIntentCapture() {
        let exitIntentShown = false;
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentShown && !this.sessionData.converted) {
                exitIntentShown = true;
                this.triggerExitIntentCapture();
            }
        });
    }

    triggerExitIntentCapture() {
        const modal = document.createElement('div');
        modal.className = 'exit-intent-modal fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-red-900 to-red-800 border border-red-500/50 rounded-2xl p-8 max-w-lg w-full transform scale-95 transition-all">
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4">⚠️</div>
                    <h3 class="text-3xl font-bold mb-2 text-red-400">¡ESPERA!</h3>
                    <p class="text-white text-lg">¿Te vas sin tu regalo de $497?</p>
                </div>
                
                <div class="bg-black/50 rounded-xl p-4 mb-6">
                    <p class="text-yellow-300 font-bold text-center">
                        Este popup desaparece en <span id="exit-countdown">10</span> segundos...
                    </p>
                </div>
                
                <div class="space-y-4">
                    <button onclick="window.advancedConversion.handleExitIntentConversion()" 
                            class="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition font-bold text-lg">
                        🎁 SÍ, QUIERO MI REGALO AHORA
                    </button>
                    
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="w-full px-6 py-2 text-gray-400 hover:text-white transition text-sm">
                        No gracias, prefiero seguir pagando gas fees
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
            modal.querySelector('div').style.transform = 'scale(1)';
        }, 100);

        // Countdown timer
        let countdown = 10;
        const countdownInterval = setInterval(() => {
            countdown--;
            const countdownEl = document.getElementById('exit-countdown');
            if (countdownEl) {
                countdownEl.textContent = countdown;
            }
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                modal.remove();
            }
        }, 1000);

        this.trackEvent('exit_intent_triggered', { 
            time_on_page: this.sessionData.timeOnPage 
        });
    }

    handleExitIntentConversion() {
        const modal = document.querySelector('.exit-intent-modal');
        this.sessionData.converted = true;
        
        // Redirect to main conversion flow
        this.triggerMainConversion('exit_intent');
        modal.remove();
    }

    /**
     * ANALYTICS TRACKING SYSTEM
     * Comprehensive tracking for conversion optimization
     */
    initializeAnalyticsTracking() {
        this.analytics = {
            events: [],
            funnel: this.conversionFunnel,
            track: (event, properties) => this.trackEvent(event, properties),
            flush: () => this.flushAnalytics()
        };

        // Track session start
        this.trackEvent('session_start', {
            user_id: this.userId,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            cognitive_profile: this.cognitiveProfile
        });

        // Track time milestones
        this.setupTimeTracking();
        
        // Track engagement events
        this.setupEngagementTracking();
    }

    setupTimeTracking() {
        const timeCheckpoints = [10, 30, 60, 120, 300]; // seconds
        
        timeCheckpoints.forEach(seconds => {
            setTimeout(() => {
                this.trackEvent('time_on_page', {
                    seconds: seconds,
                    engaged: this.isUserEngaged()
                });
            }, seconds * 1000);
        });
    }

    setupEngagementTracking() {
        // Scroll depth tracking
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                if ([25, 50, 75, 90].includes(scrollPercent)) {
                    this.trackEvent('scroll_depth', { percent: scrollPercent });
                }
            }
        });

        // Click tracking on important elements
        document.addEventListener('click', (e) => {
            const element = e.target.closest('[data-track]');
            if (element) {
                this.trackEvent('element_click', {
                    element: element.dataset.track,
                    text: element.textContent.trim().substring(0, 100)
                });
            }
        });
    }

    trackEvent(event, properties = {}) {
        const eventData = {
            event: event,
            properties: {
                ...properties,
                timestamp: Date.now(),
                session_id: this.sessionData.sessionId,
                user_id: this.userId,
                page_url: window.location.href,
                user_variant: this.testingFramework.userVariant
            }
        };

        this.analytics.events.push(eventData);

        // Send to analytics service (Google Analytics, Mixpanel, etc.)
        if (typeof gtag !== 'undefined') {
            gtag('event', event, {
                custom_parameter_1: JSON.stringify(properties),
                event_category: 'conversion_psychology',
                event_label: this.cognitiveProfile.type
            });
        }

        // Log for debugging
        if (this.options.debug) {
            console.log('🎯 Event tracked:', eventData);
        }

        // Flush events periodically
        if (this.analytics.events.length >= 10) {
            this.flushAnalytics();
        }
    }

    flushAnalytics() {
        if (this.analytics.events.length === 0) return;

        // Send batch to analytics service
        const batch = [...this.analytics.events];
        this.analytics.events = [];

        // Example: Send to custom analytics endpoint
        if (this.options.trackingEnabled) {
            fetch('/api/analytics/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ events: batch })
            }).catch(error => {
                if (this.options.debug) {
                    console.error('Analytics flush failed:', error);
                }
            });
        }
    }

    /**
     * REAL-TIME OPTIMIZATION
     * Adapts page based on user behavior
     */
    startRealTimeOptimization() {
        setInterval(() => {
            this.updateSessionData();
            this.optimizeForUser();
            this.updateDynamicElements();
        }, 5000); // Every 5 seconds
    }

    updateSessionData() {
        this.sessionData.timeOnPage = Math.floor((Date.now() - this.sessionData.startTime) / 1000);
        this.sessionData.scrollDepth = this.getScrollDepth();
        this.sessionData.engaged = this.isUserEngaged();
    }

    optimizeForUser() {
        // Increase urgency if user is highly engaged
        if (this.sessionData.timeOnPage > 120 && this.sessionData.engaged) {
            this.increaseUrgency();
        }

        // Show social proof if user is hesitant
        if (this.sessionData.timeOnPage > 60 && !this.sessionData.videoWatched) {
            this.emphasizeSocialProof();
        }

        // Trigger scarcity if user viewed pricing
        if (this.sessionData.viewedPricing && !this.sessionData.converted) {
            this.emphasizeScarcity();
        }
    }

    increaseUrgency() {
        const urgencyElements = document.querySelectorAll('[data-urgency]');
        urgencyElements.forEach(element => {
            if (!element.classList.contains('urgency-enhanced')) {
                element.classList.add('urgency-enhanced', 'animate-pulse');
                element.style.borderColor = '#ef4444';
                element.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3)';
            }
        });
    }

    emphasizeSocialProof() {
        // Increase frequency of social proof notifications
        this.showRecentActivity();
    }

    emphasizeScarcity() {
        // Make scarcity more prominent
        const scarcityElements = document.querySelectorAll('[data-scarcity]');
        scarcityElements.forEach(element => {
            element.classList.add('scarcity-critical');
            element.style.animation = 'pulse 1s infinite';
        });
    }

    updateDynamicElements() {
        // Update counters
        this.updateUserCounter();
        this.updateSpotsCounter();
        
        // Update progress indicators
        this.updateProgressIndicator();
        
        // Check for achievement unlocks
        this.checkAchievements();
    }

    /**
     * UTILITY METHODS
     */
    generateUserId() {
        let userId = localStorage.getItem('conversion_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('conversion_user_id', userId);
        }
        return userId;
    }

    initializeSession() {
        return {
            sessionId: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            startTime: Date.now(),
            timeOnPage: 0,
            scrollDepth: 0,
            engaged: true,
            videoWatched: false,
            emailCaptured: false,
            converted: false,
            viewedPricing: false,
            scrolledToBottom: false,
            socialProof: {
                userCount: 10000,
                spotsLeft: 127
            }
        };
    }

    analyzeCognitiveProfile() {
        // Analyze user behavior to determine cognitive preferences
        const timeOfDay = new Date().getHours();
        const userAgent = navigator.userAgent;
        const referrer = document.referrer;
        
        let profileType = 'balanced';
        
        if (timeOfDay >= 9 && timeOfDay <= 17) {
            profileType = 'analytical'; // Business hours - more analytical
        } else if (timeOfDay >= 18 && timeOfDay <= 23) {
            profileType = 'emotional'; // Evening - more emotional
        } else {
            profileType = 'impulsive'; // Late night/early morning - more impulsive
        }
        
        return {
            type: profileType,
            timeOfDay: timeOfDay,
            preferredTriggers: this.getPreferredTriggers(profileType)
        };
    }

    getPreferredTriggers(profileType) {
        const triggers = {
            analytical: ['authority', 'socialProof', 'reciprocity'],
            emotional: ['lossAversion', 'socialProof', 'urgency'],
            impulsive: ['scarcity', 'urgency', 'anchoring']
        };
        
        return triggers[profileType] || triggers.balanced;
    }

    initializeConversionFunnel() {
        return {
            awareness: { reached: true, timestamp: Date.now() },
            interest: { reached: false, timestamp: null },
            consideration: { reached: false, timestamp: null },
            intent: { reached: false, timestamp: null },
            purchase: { reached: false, timestamp: null }
        };
    }

    getDynamicUserCount() {
        const baseCount = 10000;
        const timeMultiplier = Math.floor(Date.now() / 1000 / 300);
        return baseCount + (timeMultiplier * Math.floor(Math.random() * 3 + 1));
    }

    getDynamicSpotsLeft() {
        const baseSpots = 127;
        const timeElapsed = Math.floor((Date.now() - this.sessionData.startTime) / 1000 / 60);
        const spotsReduction = Math.floor(timeElapsed / 5) * Math.floor(Math.random() * 3 + 1);
        return Math.max(50, baseSpots - spotsReduction);
    }

    getTimeRemaining() {
        // Calculate time until end of day
        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        return endOfDay.getTime() - now.getTime();
    }

    calculateUrgencyLevel() {
        const spotsLeft = this.getDynamicSpotsLeft();
        const timeLeft = this.getTimeRemaining();
        
        if (spotsLeft < 60 || timeLeft < 3600000) { // Less than 60 spots or 1 hour
            return 'critical';
        } else if (spotsLeft < 80 || timeLeft < 7200000) { // Less than 80 spots or 2 hours
            return 'high';
        } else {
            return 'medium';
        }
    }

    animateNumber(element, targetNumber) {
        const startNumber = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(startNumber + (targetNumber - startNumber) * progress);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    getScrollDepth() {
        return Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    }

    isUserEngaged() {
        return this.sessionData.timeOnPage > 10 && this.sessionData.scrollDepth > 25;
    }

    getCurrentStep(steps) {
        return steps.find(step => !step.completed) || steps[steps.length - 1];
    }

    getProgressPercentage(steps) {
        const completed = steps.filter(step => step.completed).length;
        return Math.round((completed / steps.length) * 100);
    }

    updateProgressIndicator() {
        // Update progress based on current session data
        if (this.behavioralTriggers.progressIndicators) {
            this.behavioralTriggers.progressIndicators.steps.forEach(step => {
                switch (step.id) {
                    case 'interest':
                        step.completed = this.sessionData.timeOnPage > 30;
                        break;
                    case 'desire':
                        step.completed = this.sessionData.videoWatched;
                        break;
                    case 'action':
                        step.completed = this.sessionData.converted;
                        break;
                }
            });
        }
    }

    checkAchievements() {
        if (this.behavioralTriggers.achievementUnlocks) {
            this.behavioralTriggers.achievementUnlocks.achievements.forEach(achievement => {
                if (!achievement.unlocked && achievement.trigger()) {
                    achievement.unlocked = true;
                    this.unlockAchievement(achievement);
                }
            });
        }
    }

    playAchievementSound() {
        // Simple achievement sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord
            
            frequencies.forEach((freq, i) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

                oscillator.start(audioContext.currentTime + i * 0.1);
                oscillator.stop(audioContext.currentTime + 0.3 + i * 0.1);
            });
        } catch (error) {
            // Silent fail for audio
        }
    }

    trackExperiment(experiment, event, data) {
        this.trackEvent(`experiment_${experiment}`, {
            event_type: event,
            experiment: experiment,
            variant: this.testingFramework.userVariant[experiment],
            ...data
        });
    }

    triggerMainConversion(source = 'unknown') {
        this.sessionData.converted = true;
        this.sessionData.conversionSource = source;
        
        this.trackEvent('conversion', {
            source: source,
            time_to_conversion: this.sessionData.timeOnPage,
            cognitive_profile: this.cognitiveProfile.type,
            experiment_variants: this.testingFramework.userVariant
        });

        // Show conversion success
        this.showConversionSuccess();
    }

    showConversionSuccess() {
        const modal = document.createElement('div');
        modal.className = 'conversion-success-modal fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-green-900 to-green-800 border border-green-500/50 rounded-2xl p-8 max-w-lg w-full text-center transform scale-95 transition-all">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-3xl font-bold mb-4 text-green-400">¡BIENVENIDO A LA REVOLUCIÓN!</h3>
                <p class="text-green-100 mb-6 text-lg">
                    Has sido aceptado en la Beta Exclusiva de FacePay. 
                    Acabas de unirte al futuro de los pagos crypto.
                </p>
                
                <div class="bg-black/30 rounded-xl p-4 mb-6">
                    <div class="text-sm text-green-200 mb-2">Tu perfil beta:</div>
                    <div class="text-green-400 font-mono text-lg">@${this.userId.split('_')[2]}</div>
                </div>

                <div class="space-y-2 text-left mb-6">
                    <div class="flex items-center gap-3 text-green-100">
                        <span class="text-green-400">✅</span>
                        <span>Acceso inmediato garantizado</span>
                    </div>
                    <div class="flex items-center gap-3 text-green-100">
                        <span class="text-green-400">✅</span>
                        <span>Zero gas fees de por vida</span>
                    </div>
                    <div class="flex items-center gap-3 text-green-100">
                        <span class="text-green-400">✅</span>
                        <span>Username premium reservado</span>
                    </div>
                    <div class="flex items-center gap-3 text-green-100">
                        <span class="text-green-400">✅</span>
                        <span>Soporte prioritario 24/7</span>
                    </div>
                </div>

                <button onclick="this.parentElement.parentElement.remove()" 
                        class="w-full px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-bold">
                    ¡COMENZAR AHORA!
                </button>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
            modal.querySelector('div').style.transform = 'scale(1)';
        }, 100);

        // Confetti effect
        this.triggerConfetti();
    }

    triggerConfetti() {
        // Simple confetti effect using emoji
        const confettiEmojis = ['🎉', '🎊', '✨', '🚀', '💎'];
        
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-50px';
            confetti.style.fontSize = '2rem';
            confetti.style.zIndex = '1000';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s linear forwards`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }

        // Add confetti animation CSS if not present
        if (!document.querySelector('#confetti-styles')) {
            const styles = document.createElement('style');
            styles.id = 'confetti-styles';
            styles.textContent = `
                @keyframes confettiFall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }

    log(message) {
        if (this.options.debug) {
            console.log(`%c${message}`, 'color: #10b981; font-weight: bold;');
        }
    }

    destroy() {
        // Cleanup method
        this.flushAnalytics();
        
        // Remove event listeners and intervals
        if (this.realTimeInterval) {
            clearInterval(this.realTimeInterval);
        }
        
        this.log('🧠 Advanced Conversion Psychology System Destroyed');
    }
}

// Global instance for access from HTML
window.AdvancedConversionPsychology = AdvancedConversionPsychology;

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.advancedConversion = new AdvancedConversionPsychology({
            debug: true,
            testingEnabled: true,
            trackingEnabled: true
        });
    });
} else {
    window.advancedConversion = new AdvancedConversionPsychology({
        debug: true,
        testingEnabled: true,
        trackingEnabled: true
    });
}