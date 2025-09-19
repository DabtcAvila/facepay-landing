/**
 * CONVERSION PSYCHOLOGY INTEGRATION
 * Master integration file that orchestrates all conversion optimization systems
 * 
 * This file coordinates:
 * - Advanced Conversion Psychology Manager
 * - Behavioral Triggers System  
 * - A/B Testing Framework
 * - Micro-Conversions Optimizer
 * - Analytics Tracking System
 */

class ConversionPsychologyMaster {
    constructor(options = {}) {
        this.options = {
            debug: options.debug || false,
            autoInit: options.autoInit !== false,
            googleAnalyticsId: options.googleAnalyticsId || 'GA_MEASUREMENT_ID',
            mixpanelToken: options.mixpanelToken || null,
            customAnalyticsEndpoint: options.customAnalyticsEndpoint || '/api/analytics',
            enableAllFeatures: options.enableAllFeatures !== false,
            ...options
        };

        // System instances
        this.advancedConversion = null;
        this.abTesting = null;
        this.microConversions = null;
        this.analytics = null;
        
        // Master state
        this.masterState = {
            initialized: false,
            systemsLoaded: 0,
            totalSystems: 4,
            conversionOptimizationActive: false
        };

        if (this.options.autoInit) {
            this.init();
        }
    }

    async init() {
        this.log('🚀 Initializing Master Conversion Psychology System...');
        
        try {
            // Initialize systems in optimal order
            await this.initializeAnalyticsSystem();
            await this.initializeABTestingSystem();
            await this.initializeMicroConversionsSystem();
            await this.initializeAdvancedConversionSystem();
            
            // Setup cross-system integration
            this.setupSystemIntegration();
            
            // Setup master event handling
            this.setupMasterEventHandling();
            
            // Start optimization engine
            this.startOptimizationEngine();
            
            this.masterState.initialized = true;
            this.masterState.conversionOptimizationActive = true;
            
            this.log('✅ Master Conversion Psychology System Active');
            
            // Dispatch initialization complete event
            this.dispatchEvent('conversion_system_ready', {
                systems_loaded: this.masterState.totalSystems,
                initialization_time: Date.now()
            });
            
        } catch (error) {
            console.error('❌ Failed to initialize conversion psychology system:', error);
        }
    }

    async initializeAnalyticsSystem() {
        this.log('📊 Loading Analytics Tracking System...');
        
        try {
            // Import and initialize analytics
            if (window.AnalyticsTrackingSystem) {
                this.analytics = new window.AnalyticsTrackingSystem({
                    googleAnalyticsId: this.options.googleAnalyticsId,
                    mixpanelToken: this.options.mixpanelToken,
                    customEndpoint: this.options.customAnalyticsEndpoint,
                    enableHeatMapping: true,
                    enableRealTimeTracking: true,
                    debug: this.options.debug
                });
                
                this.systemLoaded('analytics');
            }
        } catch (error) {
            console.error('Failed to initialize analytics:', error);
        }
    }

    async initializeABTestingSystem() {
        this.log('🧪 Loading A/B Testing Framework...');
        
        try {
            if (window.ABTestingFramework) {
                this.abTesting = new window.ABTestingFramework({
                    confidenceLevel: 0.95,
                    minimumSampleSize: 100,
                    autoWinner: true,
                    debug: this.options.debug
                });
                
                this.systemLoaded('ab_testing');
            }
        } catch (error) {
            console.error('Failed to initialize A/B testing:', error);
        }
    }

    async initializeMicroConversionsSystem() {
        this.log('🎯 Loading Micro-Conversions Optimizer...');
        
        try {
            if (window.MicroConversionsOptimizer) {
                this.microConversions = new window.MicroConversionsOptimizer({
                    emailCaptureThreshold: 60,
                    scrollCapturePercentage: 75,
                    exitIntentEnabled: true,
                    progressiveProfilingEnabled: true,
                    leadScoringEnabled: true,
                    debug: this.options.debug
                });
                
                this.systemLoaded('micro_conversions');
            }
        } catch (error) {
            console.error('Failed to initialize micro-conversions:', error);
        }
    }

    async initializeAdvancedConversionSystem() {
        this.log('🧠 Loading Advanced Conversion Psychology...');
        
        try {
            if (window.AdvancedConversionPsychology) {
                this.advancedConversion = new window.AdvancedConversionPsychology({
                    testingEnabled: true,
                    trackingEnabled: true,
                    personalizedExperience: true,
                    debug: this.options.debug
                });
                
                this.systemLoaded('advanced_conversion');
            }
        } catch (error) {
            console.error('Failed to initialize advanced conversion:', error);
        }
    }

    systemLoaded(systemName) {
        this.masterState.systemsLoaded++;
        this.log(`✅ System loaded: ${systemName} (${this.masterState.systemsLoaded}/${this.masterState.totalSystems})`);
        
        // Check if all systems are loaded
        if (this.masterState.systemsLoaded >= this.masterState.totalSystems) {
            this.log('🎉 All systems loaded successfully!');
        }
    }

    setupSystemIntegration() {
        this.log('🔗 Setting up cross-system integration...');
        
        // Connect analytics to all other systems
        this.connectAnalyticsIntegration();
        
        // Connect A/B testing with micro-conversions
        this.connectABTestingIntegration();
        
        // Connect micro-conversions with advanced conversion
        this.connectMicroConversionsIntegration();
        
        // Setup data sharing between systems
        this.setupDataSharing();
    }

    connectAnalyticsIntegration() {
        if (!this.analytics) return;
        
        // Override trackEvent for all systems to send to analytics
        const originalTrackMethods = {};
        
        // A/B Testing integration
        if (this.abTesting) {
            originalTrackMethods.abTesting = this.abTesting.trackEvent;
            this.abTesting.trackEvent = (event, data) => {
                originalTrackMethods.abTesting.call(this.abTesting, event, data);
                this.analytics.trackCustomEvent(`ab_test_${event}`, {
                    ...data,
                    source: 'ab_testing'
                });
            };
        }
        
        // Micro-conversions integration
        if (this.microConversions) {
            originalTrackMethods.microConversions = this.microConversions.trackEvent;
            this.microConversions.trackEvent = (event, data) => {
                originalTrackMethods.microConversions.call(this.microConversions, event, data);
                this.analytics.trackCustomEvent(`micro_conversion_${event}`, {
                    ...data,
                    source: 'micro_conversions',
                    lead_score: this.microConversions.getLeadScore(),
                    engagement_level: this.microConversions.getEngagementLevel()
                });
            };
        }
        
        // Advanced conversion integration
        if (this.advancedConversion) {
            originalTrackMethods.advancedConversion = this.advancedConversion.trackEvent;
            this.advancedConversion.trackEvent = (event, data) => {
                originalTrackMethods.advancedConversion.call(this.advancedConversion, event, data);
                this.analytics.trackCustomEvent(`conversion_psychology_${event}`, {
                    ...data,
                    source: 'advanced_conversion'
                });
            };
        }
    }

    connectABTestingIntegration() {
        if (!this.abTesting || !this.microConversions) return;
        
        // Share A/B test variants with micro-conversions for context
        const originalAssignUser = this.abTesting.assignUserToExperiment;
        this.abTesting.assignUserToExperiment = (experimentId, userId, userContext) => {
            const assignment = originalAssignUser.call(this.abTesting, experimentId, userId, userContext);
            
            if (assignment && this.microConversions) {
                // Share variant information with micro-conversions
                this.microConversions.userProfile.experimentVariants = 
                    this.microConversions.userProfile.experimentVariants || {};
                this.microConversions.userProfile.experimentVariants[experimentId] = assignment.variantId;
            }
            
            return assignment;
        };
    }

    connectMicroConversionsIntegration() {
        if (!this.microConversions || !this.advancedConversion) return;
        
        // Share lead scoring with advanced conversion system
        const originalUpdateLeadScore = this.microConversions.updateLeadScore;
        this.microConversions.updateLeadScore = (event, data) => {
            originalUpdateLeadScore.call(this.microConversions, event, data);
            
            if (this.advancedConversion) {
                const leadScore = this.microConversions.getLeadScore();
                const engagementLevel = this.microConversions.getEngagementLevel();
                
                // Update advanced conversion system with lead data
                this.advancedConversion.sessionData.leadScore = leadScore;
                this.advancedConversion.sessionData.engagementLevel = engagementLevel;
                
                // Trigger advanced psychology based on lead score
                if (leadScore >= 75 && !this.advancedConversion.sessionData.highValueTriggered) {
                    this.advancedConversion.sessionData.highValueTriggered = true;
                    this.triggerHighValueExperience();
                }
            }
        };
    }

    setupDataSharing() {
        // Create shared data store for cross-system communication
        window.conversionDataStore = {
            userProfile: {},
            sessionData: {},
            experimentData: {},
            conversionFunnel: {},
            
            // Getter methods
            getUserProfile: () => {
                if (this.microConversions) {
                    return this.microConversions.getUserProfile();
                }
                return {};
            },
            
            getLeadScore: () => {
                if (this.microConversions) {
                    return this.microConversions.getLeadScore();
                }
                return 0;
            },
            
            getEngagementLevel: () => {
                if (this.microConversions) {
                    return this.microConversions.getEngagementLevel();
                }
                return 'cold';
            },
            
            getFunnelData: () => {
                if (this.analytics) {
                    return this.analytics.getFunnelData();
                }
                return {};
            },
            
            getExperimentVariants: () => {
                if (this.abTesting) {
                    return this.abTesting.testingFramework.userVariant;
                }
                return {};
            }
        };
    }

    setupMasterEventHandling() {
        // Listen to important conversion events across all systems
        document.addEventListener('email_captured', (event) => {
            this.handleEmailCaptured(event.detail);
        });
        
        document.addEventListener('conversion_completed', (event) => {
            this.handleConversionCompleted(event.detail);
        });
        
        document.addEventListener('experiment_winner', (event) => {
            this.handleExperimentWinner(event.detail);
        });
        
        document.addEventListener('high_value_lead', (event) => {
            this.handleHighValueLead(event.detail);
        });
        
        // Setup periodic optimization
        setInterval(() => {
            this.runOptimizationCycle();
        }, 30000); // Every 30 seconds
    }

    handleEmailCaptured(data) {
        this.log('📧 Email captured across systems', data);
        
        // Notify all systems
        if (this.analytics) {
            this.analytics.trackCustomEvent('master_email_captured', data);
        }
        
        if (this.abTesting) {
            this.abTesting.trackExperimentEvent(
                'email_conversion', 
                data.variant || 'unknown', 
                'conversion', 
                data
            );
        }
        
        // Trigger next phase optimization
        this.triggerPostEmailOptimization(data);
    }

    handleConversionCompleted(data) {
        this.log('🎉 Conversion completed!', data);
        
        // Send to all analytics platforms
        if (this.analytics) {
            this.analytics.trackCustomEvent('master_conversion_completed', {
                ...data,
                lead_score: window.conversionDataStore.getLeadScore(),
                engagement_level: window.conversionDataStore.getEngagementLevel(),
                experiment_variants: window.conversionDataStore.getExperimentVariants()
            });
        }
        
        // Update A/B test results
        if (this.abTesting && data.experiment_variant) {
            this.abTesting.trackExperimentEvent(
                data.experiment_id || 'main_conversion',
                data.experiment_variant,
                'conversion',
                data
            );
        }
        
        // Trigger post-conversion experience
        this.triggerPostConversionExperience(data);
    }

    handleExperimentWinner(data) {
        this.log('🏆 Experiment winner detected', data);
        
        // Auto-implement winning variant
        if (data.auto_implement) {
            this.implementWinningVariant(data);
        }
    }

    handleHighValueLead(data) {
        this.log('💎 High value lead detected', data);
        
        // Trigger VIP experience
        this.triggerVIPExperience(data);
    }

    startOptimizationEngine() {
        this.log('⚡ Starting optimization engine...');
        
        // Real-time optimization loop
        this.optimizationInterval = setInterval(() => {
            this.runRealTimeOptimization();
        }, 10000); // Every 10 seconds
        
        // Deep optimization cycle
        this.deepOptimizationInterval = setInterval(() => {
            this.runDeepOptimization();
        }, 300000); // Every 5 minutes
    }

    runOptimizationCycle() {
        if (!this.masterState.conversionOptimizationActive) return;
        
        const currentData = {
            leadScore: window.conversionDataStore.getLeadScore(),
            engagementLevel: window.conversionDataStore.getEngagementLevel(),
            funnelStage: this.analytics?.conversionFunnel?.currentStage || 'awareness',
            timeOnPage: Date.now() - (this.analytics?.sessionData?.startTime || Date.now())
        };
        
        // Dynamic optimization based on current state
        if (currentData.leadScore > 75 && currentData.engagementLevel === 'hot') {
            this.triggerHighIntentOptimization();
        } else if (currentData.timeOnPage > 120000 && currentData.leadScore < 30) {
            this.triggerReEngagementOptimization();
        } else if (currentData.funnelStage === 'consideration' && currentData.timeOnPage > 60000) {
            this.triggerConversionAcceleration();
        }
    }

    runRealTimeOptimization() {
        // Real-time A/B test optimization
        if (this.abTesting) {
            this.abTesting.optimizeTrafficAllocation();
        }
        
        // Real-time micro-conversion optimization
        if (this.microConversions) {
            this.microConversions.optimizeMicroConversions();
        }
        
        // Real-time psychology triggers
        if (this.advancedConversion) {
            this.advancedConversion.updateDynamicElements();
        }
    }

    runDeepOptimization() {
        // Deep learning from all systems
        const performanceData = this.gatherPerformanceData();
        
        // Optimize based on learnings
        this.optimizeBasedOnData(performanceData);
        
        // Update strategies
        this.updateOptimizationStrategies(performanceData);
    }

    triggerHighValueExperience() {
        this.log('💎 Triggering high-value experience...');
        
        // Enhance all system responses for high-value users
        if (this.advancedConversion) {
            this.advancedConversion.increaseUrgency();
            this.advancedConversion.emphasizeSocialProof();
        }
        
        if (this.microConversions) {
            this.microConversions.triggerPriorityEmailCapture?.();
        }
    }

    triggerPostEmailOptimization(data) {
        this.log('📧 Running post-email optimization...');
        
        // Switch to conversion-focused mode
        document.body.classList.add('email-captured-mode');
        
        // Update all CTAs to focus on main conversion
        document.querySelectorAll('.btn-primary').forEach(btn => {
            if (btn.textContent.includes('Email') || btn.textContent.includes('Avísame')) {
                btn.textContent = '🚀 Acceso Completo Ahora';
                btn.onclick = () => this.triggerMainConversion('post_email');
            }
        });
        
        // Show social proof boost
        this.showPostEmailSocialProof();
    }

    triggerPostConversionExperience(data) {
        this.log('🎉 Starting post-conversion experience...');
        
        // Show success experience
        this.showConversionSuccess(data);
        
        // Start retention flow
        setTimeout(() => {
            this.startRetentionFlow(data);
        }, 5000);
    }

    triggerHighIntentOptimization() {
        // User is hot and ready to convert
        if (this.advancedConversion) {
            this.advancedConversion.showSuccessState?.();
        }
        
        // Show immediate conversion path
        this.createUrgentConversionPath();
    }

    triggerReEngagementOptimization() {
        // User is losing interest, re-engage
        if (this.microConversions) {
            this.microConversions.triggerEmailCapture();
        }
        
        // Show different content angle
        this.switchContentAngle();
    }

    triggerConversionAcceleration() {
        // User is considering, push for conversion
        this.showConversionAccelerators();
    }

    createUrgentConversionPath() {
        // Create floating urgent CTA
        const urgentCTA = document.createElement('div');
        urgentCTA.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-full font-bold shadow-2xl z-50 animate-pulse';
        urgentCTA.innerHTML = '🔥 ACCESO VIP DISPONIBLE - CLICK AQUÍ';
        urgentCTA.onclick = () => {
            this.triggerMainConversion('urgent_vip');
            urgentCTA.remove();
        };
        
        document.body.appendChild(urgentCTA);
        
        // Remove after 10 seconds
        setTimeout(() => urgentCTA.remove(), 10000);
    }

    switchContentAngle() {
        // Switch to different value proposition
        const headlines = document.querySelectorAll('h1, .hero h1');
        headlines.forEach(headline => {
            if (headline.textContent.includes('Gas Fees')) {
                headline.textContent = '¿Y Si Crypto Fuera Tan Fácil Como WhatsApp?';
            }
        });
    }

    showConversionAccelerators() {
        // Show limited time offer
        const accelerator = document.createElement('div');
        accelerator.className = 'fixed bottom-4 right-4 bg-yellow-500 text-black p-4 rounded-xl shadow-lg z-50';
        accelerator.innerHTML = `
            <div class="text-sm font-bold">⏰ OFERTA LIMITADA</div>
            <div class="text-xs">Solo 15 minutos más</div>
            <button class="mt-2 bg-black text-yellow-500 px-4 py-2 rounded font-bold" onclick="window.conversionMaster.triggerMainConversion('accelerator')">
                ¡Aprovecha Ahora!
            </button>
        `;
        
        document.body.appendChild(accelerator);
        
        // Auto-remove
        setTimeout(() => accelerator.remove(), 15 * 60 * 1000); // 15 minutes
    }

    showPostEmailSocialProof() {
        const socialProof = document.createElement('div');
        socialProof.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-xl shadow-lg z-50';
        socialProof.innerHTML = `
            <div class="text-sm font-bold">✅ Email Confirmado</div>
            <div class="text-xs">Te uniste a 10,000+ usuarios</div>
            <div class="text-xs mt-1">🔥 +247 se unieron hoy</div>
        `;
        
        document.body.appendChild(socialProof);
        
        setTimeout(() => socialProof.remove(), 8000);
    }

    showConversionSuccess(data) {
        // Enhanced success modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-green-900 to-green-800 border border-green-500/50 rounded-2xl p-8 max-w-lg w-full text-center transform scale-95 transition-all">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-3xl font-bold mb-4 text-green-400">¡FELICIDADES!</h3>
                <p class="text-green-100 mb-6 text-lg">
                    Has sido aceptado en FacePay. Bienvenido al futuro de los pagos crypto.
                </p>
                
                <div class="bg-black/30 rounded-xl p-4 mb-6">
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <div class="text-green-400 font-bold">Lead Score</div>
                            <div class="text-white">${window.conversionDataStore.getLeadScore()}/100</div>
                        </div>
                        <div>
                            <div class="text-green-400 font-bold">Engagement</div>
                            <div class="text-white">${window.conversionDataStore.getEngagementLevel()}</div>
                        </div>
                    </div>
                </div>

                <button onclick="this.parentElement.parentElement.remove()" 
                        class="w-full px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-bold">
                    ¡Comenzar Ahora! 🚀
                </button>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
            modal.querySelector('div').style.transform = 'scale(1)';
        }, 100);
    }

    startRetentionFlow(data) {
        // Start user onboarding and retention
        this.scheduleFollowUps(data);
        this.setupRetentionTracking(data);
    }

    scheduleFollowUps(data) {
        // Schedule follow-up interactions
        const followUps = [
            { delay: 24 * 60 * 60 * 1000, type: 'welcome_email' }, // 24 hours
            { delay: 7 * 24 * 60 * 60 * 1000, type: 'onboarding_check' }, // 7 days
            { delay: 30 * 24 * 60 * 60 * 1000, type: 'satisfaction_survey' } // 30 days
        ];
        
        followUps.forEach(followUp => {
            setTimeout(() => {
                this.triggerFollowUp(followUp.type, data);
            }, followUp.delay);
        });
    }

    triggerFollowUp(type, data) {
        // Send follow-up data to backend
        if (this.analytics?.customTracker?.enabled) {
            fetch(`${this.analytics.customTracker.endpoint}/followup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: type,
                    user_data: data,
                    timestamp: Date.now()
                })
            });
        }
    }

    setupRetentionTracking(data) {
        // Setup tracking for user return visits
        localStorage.setItem('facepay_converted_user', JSON.stringify({
            ...data,
            conversion_date: Date.now()
        }));
    }

    triggerMainConversion(source = 'master') {
        this.log(`🎯 Main conversion triggered from: ${source}`);
        
        // Notify all systems
        if (this.advancedConversion) {
            this.advancedConversion.triggerMainConversion(source);
        }
        
        // Track in analytics
        if (this.analytics) {
            this.analytics.trackCustomEvent('main_conversion_triggered', {
                source: source,
                lead_score: window.conversionDataStore.getLeadScore(),
                engagement_level: window.conversionDataStore.getEngagementLevel(),
                experiment_variants: window.conversionDataStore.getExperimentVariants()
            });
        }
        
        // Dispatch event for other systems
        this.dispatchEvent('conversion_completed', {
            source: source,
            timestamp: Date.now(),
            user_data: window.conversionDataStore.getUserProfile()
        });
    }

    // Utility methods
    dispatchEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    gatherPerformanceData() {
        return {
            analytics: this.analytics?.getSessionData() || {},
            funnel: this.analytics?.getFunnelData() || {},
            abTests: this.abTesting?.getActiveExperiments() || [],
            microConversions: this.microConversions?.getUserProfile() || {},
            timestamp: Date.now()
        };
    }

    optimizeBasedOnData(data) {
        // ML-style optimization based on gathered data
        // This would include more sophisticated algorithms in a real implementation
        
        if (data.analytics.engagementScore > 50 && data.analytics.timeOnPage > 120000) {
            // High engagement, long time on page - push for conversion
            this.triggerConversionAcceleration();
        }
    }

    updateOptimizationStrategies(data) {
        // Update strategies based on performance
        // Save learnings to localStorage for future sessions
        localStorage.setItem('conversion_optimizations', JSON.stringify({
            strategies: data,
            updated: Date.now()
        }));
    }

    log(message, ...args) {
        if (this.options.debug) {
            console.log(`%c[Master] ${message}`, 'color: #10b981; font-weight: bold; font-size: 14px;', ...args);
        }
    }

    // Public API
    getSystemStatus() {
        return {
            initialized: this.masterState.initialized,
            systems: {
                analytics: !!this.analytics,
                abTesting: !!this.abTesting,
                microConversions: !!this.microConversions,
                advancedConversion: !!this.advancedConversion
            },
            performance: this.gatherPerformanceData()
        };
    }

    forceConversion(source = 'manual') {
        this.triggerMainConversion(source);
    }

    getConversionData() {
        return window.conversionDataStore;
    }

    pauseOptimization() {
        this.masterState.conversionOptimizationActive = false;
        if (this.optimizationInterval) clearInterval(this.optimizationInterval);
        if (this.deepOptimizationInterval) clearInterval(this.deepOptimizationInterval);
    }

    resumeOptimization() {
        this.masterState.conversionOptimizationActive = true;
        this.startOptimizationEngine();
    }
}

// Initialize the master system
document.addEventListener('DOMContentLoaded', () => {
    // Wait for all scripts to load
    setTimeout(() => {
        window.conversionMaster = new ConversionPsychologyMaster({
            debug: true,
            enableAllFeatures: true,
            googleAnalyticsId: 'GA_MEASUREMENT_ID', // Replace with actual GA ID
            // mixpanelToken: 'YOUR_MIXPANEL_TOKEN', // Uncomment if using Mixpanel
            customAnalyticsEndpoint: '/api/analytics'
        });
        
        // Make it globally available
        window.ConversionPsychologyMaster = ConversionPsychologyMaster;
        
        console.log('🚀 Conversion Psychology Master System Ready!');
        console.log('Available methods:', {
            getStatus: 'conversionMaster.getSystemStatus()',
            forceConversion: 'conversionMaster.forceConversion()',
            getData: 'conversionMaster.getConversionData()',
            pause: 'conversionMaster.pauseOptimization()',
            resume: 'conversionMaster.resumeOptimization()'
        });
    }, 1000);
});

export default ConversionPsychologyMaster;