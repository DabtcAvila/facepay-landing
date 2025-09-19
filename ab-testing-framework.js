/**
 * COMPREHENSIVE A/B TESTING FRAMEWORK
 * Advanced experimentation system for conversion optimization
 * 
 * Features:
 * - Multi-variant testing (A/B/C/D/E)
 * - Statistical significance calculation
 * - Automatic traffic allocation
 * - Real-time performance tracking
 * - Experiment segmentation
 * - Bayesian optimization
 * - Dynamic winner detection
 */

export class ABTestingFramework {
    constructor(options = {}) {
        this.options = {
            confidenceLevel: options.confidenceLevel || 0.95,
            minimumSampleSize: options.minimumSampleSize || 100,
            minimumDetectableEffect: options.minimumDetectableEffect || 0.1,
            maxExperimentDuration: options.maxExperimentDuration || 30 * 24 * 60 * 60 * 1000, // 30 days
            autoWinner: options.autoWinner || true,
            debug: options.debug || false,
            ...options
        };

        this.experiments = new Map();
        this.userAssignments = new Map();
        this.results = new Map();
        this.segments = new Map();
        
        this.statisticsEngine = new StatisticsEngine(this.options);
        this.segmentationEngine = new SegmentationEngine();
        this.optimizationEngine = new BayesianOptimization();
        
        this.init();
    }

    init() {
        this.log('🧪 Initializing A/B Testing Framework...');
        
        // Load persisted data
        this.loadPersistedData();
        
        // Initialize default experiments
        this.initializeDefaultExperiments();
        
        // Start performance monitoring
        this.startPerformanceMonitoring();
        
        this.log('✅ A/B Testing Framework Active');
    }

    /**
     * EXPERIMENT MANAGEMENT
     */
    createExperiment(config) {
        const experiment = {
            id: config.id,
            name: config.name,
            description: config.description,
            hypothesis: config.hypothesis,
            startDate: Date.now(),
            endDate: config.endDate || (Date.now() + this.options.maxExperimentDuration),
            status: 'active',
            variants: this.normalizeVariants(config.variants),
            segments: config.segments || ['all'],
            metrics: config.metrics || ['conversion', 'engagement'],
            trafficAllocation: config.trafficAllocation || this.calculateOptimalAllocation(config.variants),
            results: {
                totalSessions: 0,
                variantResults: new Map(),
                statisticalSignificance: false,
                confidenceLevel: 0,
                winner: null,
                liftRange: { min: 0, max: 0 }
            }
        };

        // Initialize variant results
        experiment.variants.forEach(variant => {
            experiment.results.variantResults.set(variant.id, {
                sessions: 0,
                conversions: 0,
                conversionRate: 0,
                engagementTime: 0,
                bounceRate: 0,
                revenue: 0
            });
        });

        this.experiments.set(experiment.id, experiment);
        this.persistData();
        
        this.log(`🆕 Created experiment: ${experiment.name}`);
        return experiment;
    }

    normalizeVariants(variants) {
        const totalWeight = variants.reduce((sum, variant) => sum + (variant.weight || 1), 0);
        
        return variants.map(variant => ({
            ...variant,
            weight: (variant.weight || 1) / totalWeight,
            normalizedWeight: (variant.weight || 1) / totalWeight
        }));
    }

    calculateOptimalAllocation(variants) {
        // Equal allocation by default, can be optimized later
        const equalWeight = 1 / variants.length;
        return variants.reduce((allocation, variant) => {
            allocation[variant.id] = equalWeight;
            return allocation;
        }, {});
    }

    /**
     * USER ASSIGNMENT AND VARIANT SELECTION
     */
    assignUserToExperiment(experimentId, userId = null, userContext = {}) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment || experiment.status !== 'active') {
            return null;
        }

        // Check if user is already assigned
        const assignmentKey = `${experimentId}_${userId || 'anonymous'}`;
        if (this.userAssignments.has(assignmentKey)) {
            return this.userAssignments.get(assignmentKey);
        }

        // Check if user matches experiment segments
        if (!this.matchesSegment(userContext, experiment.segments)) {
            return null;
        }

        // Assign variant using consistent hashing
        const variant = this.selectVariantForUser(experiment, userId, userContext);
        
        const assignment = {
            experimentId: experimentId,
            variantId: variant.id,
            userId: userId,
            assignmentTime: Date.now(),
            userContext: userContext
        };

        this.userAssignments.set(assignmentKey, assignment);
        this.persistData();

        // Track assignment
        this.trackEvent(experimentId, 'assignment', {
            variantId: variant.id,
            userId: userId,
            userContext: userContext
        });

        return assignment;
    }

    selectVariantForUser(experiment, userId, userContext) {
        // Use deterministic hash for consistent assignment
        const hashInput = `${experiment.id}_${userId || Date.now()}_${JSON.stringify(userContext)}`;
        const hash = this.hashString(hashInput);
        const random = hash % 1000000 / 1000000; // Convert to 0-1 range

        let cumulativeWeight = 0;
        for (const variant of experiment.variants) {
            cumulativeWeight += variant.normalizedWeight;
            if (random <= cumulativeWeight) {
                return variant;
            }
        }

        // Fallback to first variant
        return experiment.variants[0];
    }

    matchesSegment(userContext, segments) {
        if (segments.includes('all')) return true;

        return segments.some(segment => {
            const segmentConfig = this.segments.get(segment);
            if (!segmentConfig) return false;

            return this.segmentationEngine.matches(userContext, segmentConfig);
        });
    }

    /**
     * EXPERIMENT EXECUTION
     */
    runExperiment(experimentId, userId = null, userContext = {}) {
        const assignment = this.assignUserToExperiment(experimentId, userId, userContext);
        if (!assignment) {
            return { variant: null, experiment: null };
        }

        const experiment = this.experiments.get(experimentId);
        const variant = experiment.variants.find(v => v.id === assignment.variantId);

        // Apply variant changes
        this.applyVariant(variant);

        // Track exposure
        this.trackExperimentEvent(experimentId, assignment.variantId, 'exposure', {
            userId: userId,
            userContext: userContext
        });

        return {
            variant: variant,
            experiment: experiment,
            assignment: assignment
        };
    }

    applyVariant(variant) {
        if (!variant || !variant.changes) return;

        Object.keys(variant.changes).forEach(selector => {
            const elements = document.querySelectorAll(selector);
            const changes = variant.changes[selector];

            elements.forEach(element => {
                this.applyElementChanges(element, changes);
            });
        });
    }

    applyElementChanges(element, changes) {
        if (typeof changes === 'string') {
            // Simple text change
            element.textContent = changes;
        } else if (typeof changes === 'object') {
            // Complex changes
            Object.keys(changes).forEach(property => {
                const value = changes[property];
                
                switch (property) {
                    case 'text':
                        element.textContent = value;
                        break;
                    case 'html':
                        element.innerHTML = value;
                        break;
                    case 'style':
                        Object.assign(element.style, value);
                        break;
                    case 'attributes':
                        Object.keys(value).forEach(attr => {
                            element.setAttribute(attr, value[attr]);
                        });
                        break;
                    case 'classes':
                        if (value.add) element.classList.add(...value.add);
                        if (value.remove) element.classList.remove(...value.remove);
                        break;
                    default:
                        element[property] = value;
                }
            });
        }
    }

    /**
     * EVENT TRACKING AND METRICS
     */
    trackExperimentEvent(experimentId, variantId, event, data = {}) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment) return;

        const variantResults = experiment.results.variantResults.get(variantId);
        if (!variantResults) return;

        // Update metrics based on event type
        switch (event) {
            case 'exposure':
                variantResults.sessions++;
                experiment.results.totalSessions++;
                break;
            
            case 'conversion':
                variantResults.conversions++;
                variantResults.conversionRate = variantResults.conversions / variantResults.sessions;
                if (data.revenue) {
                    variantResults.revenue += data.revenue;
                }
                break;
            
            case 'engagement':
                if (data.duration) {
                    variantResults.engagementTime = 
                        (variantResults.engagementTime * (variantResults.sessions - 1) + data.duration) / variantResults.sessions;
                }
                break;
            
            case 'bounce':
                variantResults.bounceRate = 
                    (variantResults.bounceRate * (variantResults.sessions - 1) + 1) / variantResults.sessions;
                break;
        }

        // Calculate statistical significance
        this.updateStatisticalSignificance(experiment);

        // Check for automatic winner detection
        if (this.options.autoWinner && this.shouldDeclareWinner(experiment)) {
            this.declareWinner(experiment);
        }

        this.persistData();

        // Log event for debugging
        this.log(`📊 ${event} tracked for ${experimentId}/${variantId}:`, data);
    }

    updateStatisticalSignificance(experiment) {
        const controlVariant = experiment.variants[0]; // Assume first variant is control
        const controlResults = experiment.results.variantResults.get(controlVariant.id);

        experiment.variants.slice(1).forEach(variant => {
            const variantResults = experiment.results.variantResults.get(variant.id);
            
            if (controlResults.sessions >= this.options.minimumSampleSize &&
                variantResults.sessions >= this.options.minimumSampleSize) {
                
                const significance = this.statisticsEngine.calculateSignificance(
                    controlResults,
                    variantResults
                );

                if (significance.pValue < (1 - this.options.confidenceLevel)) {
                    experiment.results.statisticalSignificance = true;
                    experiment.results.confidenceLevel = 1 - significance.pValue;
                    experiment.results.liftRange = significance.liftRange;
                }
            }
        });
    }

    shouldDeclareWinner(experiment) {
        // Check if we have statistical significance
        if (!experiment.results.statisticalSignificance) {
            return false;
        }

        // Check minimum runtime (at least 1 week)
        const minimumRuntime = 7 * 24 * 60 * 60 * 1000; // 1 week
        if (Date.now() - experiment.startDate < minimumRuntime) {
            return false;
        }

        // Check if we have enough data
        const totalSessions = experiment.results.totalSessions;
        if (totalSessions < this.options.minimumSampleSize * experiment.variants.length) {
            return false;
        }

        return true;
    }

    declareWinner(experiment) {
        // Find the best performing variant
        let bestVariant = null;
        let bestRate = 0;

        experiment.results.variantResults.forEach((results, variantId) => {
            if (results.conversionRate > bestRate) {
                bestRate = results.conversionRate;
                bestVariant = variantId;
            }
        });

        experiment.results.winner = bestVariant;
        experiment.status = 'completed';

        this.log(`🏆 Winner declared for ${experiment.name}: ${bestVariant} (${(bestRate * 100).toFixed(2)}% conversion)`);

        // Send winner notification
        this.sendWinnerNotification(experiment);

        return bestVariant;
    }

    /**
     * DEFAULT EXPERIMENTS
     */
    initializeDefaultExperiments() {
        // Headline Test
        this.createExperiment({
            id: 'headline_optimization_2024',
            name: 'Headline Optimization',
            description: 'Testing different headline approaches for maximum impact',
            hypothesis: 'Pain point headlines will convert better than curiosity-based headlines',
            variants: [
                {
                    id: 'control',
                    name: 'Original',
                    weight: 20,
                    changes: {
                        '.hero h1': 'Face ID Beats Gas Fees',
                        '.hero p': 'Send crypto like @juan → @maria. Your face is your wallet. Zero gas fees on StarkNet.'
                    }
                },
                {
                    id: 'pain_point',
                    name: 'Pain Point Focus',
                    weight: 20,
                    changes: {
                        '.hero h1': '¿Cansado de Pagar $50 en Gas Fees?',
                        '.hero p': 'Esta App lo Cambió Todo para 10,000+ Personas'
                    }
                },
                {
                    id: 'curiosity',
                    name: 'Curiosity Gap',
                    weight: 20,
                    changes: {
                        '.hero h1': 'Por Primera Vez en la Historia:',
                        '.hero p': 'Envía Crypto Como Un DM de Instagram (0% Gas Fees, 100% Real)'
                    }
                },
                {
                    id: 'exclusive',
                    name: 'Exclusivity',
                    weight: 20,
                    changes: {
                        '.hero h1': 'BETA EXCLUSIVA:',
                        '.hero p': 'La App Que Hizo Crypto Tan Fácil Como FaceTime'
                    }
                },
                {
                    id: 'social_proof',
                    name: 'Social Proof',
                    weight: 20,
                    changes: {
                        '.hero h1': '10,000+ Usuarios Ya Ahorraron $2.3M',
                        '.hero p': 'Descubre la App Crypto Más Fácil del Mundo'
                    }
                }
            ],
            metrics: ['conversion', 'engagement', 'video_completion']
        });

        // CTA Button Test
        this.createExperiment({
            id: 'cta_optimization_2024',
            name: 'CTA Button Optimization',
            description: 'Testing different CTA approaches and psychological triggers',
            hypothesis: 'Urgency-based CTAs will outperform benefit-based CTAs',
            variants: [
                {
                    id: 'control',
                    name: 'Original',
                    weight: 16.66,
                    changes: {
                        '.btn-primary': {
                            text: 'See The Magic',
                            style: {
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
                            }
                        }
                    }
                },
                {
                    id: 'urgency',
                    name: 'Urgency',
                    weight: 16.66,
                    changes: {
                        '.btn-primary': {
                            text: '🔥 ACCESO INMEDIATO (SOLO HOY)',
                            style: {
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                animation: 'pulse 1s infinite'
                            }
                        }
                    }
                },
                {
                    id: 'benefit',
                    name: 'Benefit Focus',
                    weight: 16.66,
                    changes: {
                        '.btn-primary': {
                            text: '💰 NUNCA MÁS GAS FEES (GRATIS)',
                            style: {
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
                            }
                        }
                    }
                },
                {
                    id: 'social',
                    name: 'Social Proof',
                    weight: 16.66,
                    changes: {
                        '.btn-primary': {
                            text: '🚀 ÚNETE A 10,000+ PIONEROS',
                            style: {
                                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                            }
                        }
                    }
                },
                {
                    id: 'scarcity',
                    name: 'Scarcity',
                    weight: 16.66,
                    changes: {
                        '.btn-primary': {
                            text: '⚡ DAME MI LUGAR ANTES QUE SE ACABE',
                            style: {
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                animation: 'countdownCritical 1s infinite'
                            }
                        }
                    }
                },
                {
                    id: 'risk_reversal',
                    name: 'Risk Reversal',
                    weight: 16.68,
                    changes: {
                        '.btn-primary': {
                            text: '✅ PRUÉBALO GRATIS (SIN RIESGO)',
                            style: {
                                background: 'linear-gradient(135deg, #059669, #047857)'
                            }
                        }
                    }
                }
            ],
            metrics: ['conversion', 'click_through', 'time_to_conversion']
        });

        // Video Placement Test
        this.createExperiment({
            id: 'video_placement_2024',
            name: 'Demo Video Placement',
            description: 'Testing optimal video placement for engagement',
            hypothesis: 'Hero video placement will increase engagement over section placement',
            variants: [
                {
                    id: 'control',
                    name: 'Section Placement',
                    weight: 33.33,
                    changes: {} // Original placement
                },
                {
                    id: 'hero_placement',
                    name: 'Hero Placement',
                    weight: 33.33,
                    changes: {
                        '.hero-content': {
                            html: `
                                <h1>Face ID Beats Gas Fees</h1>
                                <div class="video-container mb-8">
                                    <video class="demo-video" autoplay muted loop playsinline>
                                        <source src="/facepay-demo.mp4" type="video/mp4">
                                    </video>
                                </div>
                                <p>Send crypto like @juan → @maria. Your face is your wallet.</p>
                            `
                        }
                    }
                },
                {
                    id: 'modal_placement',
                    name: 'Modal Trigger',
                    weight: 33.34,
                    changes: {
                        '.btn-primary': {
                            attributes: {
                                'data-video-modal': 'true'
                            }
                        }
                    }
                }
            ],
            metrics: ['video_completion', 'engagement_time', 'conversion']
        });

        // Pricing Display Test
        this.createExperiment({
            id: 'pricing_psychology_2024',
            name: 'Pricing Psychology',
            description: 'Testing different pricing presentation approaches',
            hypothesis: 'Anchoring with high original price will increase perceived value',
            variants: [
                {
                    id: 'control',
                    name: 'Free Only',
                    weight: 25,
                    changes: {
                        '[data-pricing]': {
                            html: '<div class="text-3xl font-bold text-green-400">FREE</div>'
                        }
                    }
                },
                {
                    id: 'anchored',
                    name: 'Anchored Pricing',
                    weight: 25,
                    changes: {
                        '[data-pricing]': {
                            html: `
                                <div class="price-anchoring">
                                    <span class="original-price line-through text-gray-500 text-2xl">$497</span>
                                    <span class="current-price text-3xl font-bold text-green-400 ml-3">FREE</span>
                                    <div class="savings-badge bg-red-500 text-white px-2 py-1 rounded text-sm ml-3">
                                        AHORRAS $497
                                    </div>
                                </div>
                            `
                        }
                    }
                },
                {
                    id: 'value_stack',
                    name: 'Value Stack',
                    weight: 25,
                    changes: {
                        '[data-pricing]': {
                            html: `
                                <div class="reciprocity-value-stack">
                                    <h3 class="text-lg font-bold mb-3">Tu Regalo Beta Incluye:</h3>
                                    <div class="space-y-2 text-sm">
                                        <div class="flex justify-between">
                                            <span>✅ Acceso Beta Premium</span>
                                            <span class="text-green-400 font-bold">$197</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>✅ Username Reservado</span>
                                            <span class="text-green-400 font-bold">$99</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>✅ Zero Gas Fees Lifetime</span>
                                            <span class="text-green-400 font-bold">$201</span>
                                        </div>
                                        <hr class="border-gray-600">
                                        <div class="flex justify-between font-bold text-lg">
                                            <span>TOTAL:</span>
                                            <span class="text-green-400">$497</span>
                                        </div>
                                        <div class="text-center bg-red-500/20 p-2 rounded">
                                            <div class="text-red-400 font-bold">TU PRECIO: $0</div>
                                        </div>
                                    </div>
                                </div>
                            `
                        }
                    }
                },
                {
                    id: 'limited_time',
                    name: 'Limited Time',
                    weight: 25,
                    changes: {
                        '[data-pricing]': {
                            html: `
                                <div class="urgency-container text-center">
                                    <div class="text-sm text-yellow-400 mb-2">⏰ OFERTA LIMITADA</div>
                                    <div class="text-3xl font-bold text-green-400">FREE</div>
                                    <div class="text-sm text-red-400 mt-2">
                                        Próximo grupo: $197
                                    </div>
                                </div>
                            `
                        }
                    }
                }
            ],
            metrics: ['conversion', 'perceived_value', 'trust_score']
        });

        this.log('📋 Default experiments initialized');
    }

    /**
     * PERFORMANCE MONITORING
     */
    startPerformanceMonitoring() {
        setInterval(() => {
            this.updateExperimentPerformance();
            this.optimizeTrafficAllocation();
            this.checkExperimentHealth();
        }, 60000); // Every minute
    }

    updateExperimentPerformance() {
        this.experiments.forEach(experiment => {
            if (experiment.status === 'active') {
                // Calculate performance metrics
                const performance = this.calculateExperimentPerformance(experiment);
                
                // Update experiment with performance data
                experiment.performance = performance;
                
                // Log performance for monitoring
                if (this.options.debug) {
                    console.log(`📈 Experiment ${experiment.id} performance:`, performance);
                }
            }
        });
    }

    calculateExperimentPerformance(experiment) {
        const variants = Array.from(experiment.results.variantResults.entries());
        
        return {
            totalSessions: experiment.results.totalSessions,
            averageConversionRate: variants.reduce((sum, [_, results]) => 
                sum + results.conversionRate, 0) / variants.length,
            bestVariant: this.findBestVariant(experiment),
            confidenceLevel: experiment.results.confidenceLevel,
            runtime: Date.now() - experiment.startDate,
            dataQuality: this.assessDataQuality(experiment)
        };
    }

    findBestVariant(experiment) {
        let bestVariant = null;
        let bestRate = 0;

        experiment.results.variantResults.forEach((results, variantId) => {
            if (results.conversionRate > bestRate) {
                bestRate = results.conversionRate;
                bestVariant = variantId;
            }
        });

        return {
            variantId: bestVariant,
            conversionRate: bestRate
        };
    }

    optimizeTrafficAllocation() {
        // Use multi-armed bandit approach for traffic optimization
        this.experiments.forEach(experiment => {
            if (experiment.status === 'active' && experiment.results.totalSessions > 1000) {
                const optimizedAllocation = this.optimizationEngine.optimize(experiment);
                experiment.trafficAllocation = optimizedAllocation;
            }
        });
    }

    checkExperimentHealth() {
        this.experiments.forEach(experiment => {
            if (experiment.status === 'active') {
                const health = this.assessExperimentHealth(experiment);
                
                if (health.issues.length > 0) {
                    this.log(`⚠️ Health issues in experiment ${experiment.id}:`, health.issues);
                }

                // Auto-pause unhealthy experiments
                if (health.score < 0.5) {
                    experiment.status = 'paused';
                    this.log(`⏸️ Auto-paused unhealthy experiment: ${experiment.id}`);
                }
            }
        });
    }

    assessExperimentHealth(experiment) {
        const issues = [];
        let score = 1.0;

        // Check sample size distribution
        const variantSessions = Array.from(experiment.results.variantResults.values())
            .map(r => r.sessions);
        const minSessions = Math.min(...variantSessions);
        const maxSessions = Math.max(...variantSessions);
        
        if (maxSessions > 0 && minSessions / maxSessions < 0.5) {
            issues.push('Uneven traffic distribution');
            score -= 0.2;
        }

        // Check conversion rate anomalies
        const conversionRates = Array.from(experiment.results.variantResults.values())
            .map(r => r.conversionRate);
        const avgRate = conversionRates.reduce((a, b) => a + b, 0) / conversionRates.length;
        
        conversionRates.forEach((rate, index) => {
            if (Math.abs(rate - avgRate) > avgRate * 2) {
                issues.push(`Variant ${index} has anomalous conversion rate`);
                score -= 0.15;
            }
        });

        // Check runtime
        const runtime = Date.now() - experiment.startDate;
        if (runtime > this.options.maxExperimentDuration) {
            issues.push('Experiment running too long');
            score -= 0.3;
        }

        return { score, issues };
    }

    assessDataQuality(experiment) {
        const totalSessions = experiment.results.totalSessions;
        const minRequiredSessions = this.options.minimumSampleSize * experiment.variants.length;
        
        return {
            sampleSizeAdequacy: totalSessions >= minRequiredSessions ? 1 : totalSessions / minRequiredSessions,
            trafficDistribution: this.calculateTrafficDistribution(experiment),
            dataFreshness: this.calculateDataFreshness(experiment)
        };
    }

    calculateTrafficDistribution(experiment) {
        const sessionCounts = Array.from(experiment.results.variantResults.values())
            .map(r => r.sessions);
        const total = sessionCounts.reduce((a, b) => a + b, 0);
        
        if (total === 0) return 0;
        
        const expectedPerVariant = total / experiment.variants.length;
        const variance = sessionCounts.reduce((sum, count) => 
            sum + Math.pow(count - expectedPerVariant, 2), 0) / experiment.variants.length;
        
        // Lower variance = better distribution
        return 1 / (1 + variance / (expectedPerVariant * expectedPerVariant));
    }

    calculateDataFreshness(experiment) {
        // Placeholder for data freshness calculation
        // In a real implementation, this would check when the last data point was received
        return 1.0;
    }

    /**
     * REPORTING AND INSIGHTS
     */
    generateReport(experimentId) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment) return null;

        const report = {
            experiment: {
                id: experiment.id,
                name: experiment.name,
                status: experiment.status,
                runtime: Date.now() - experiment.startDate,
                hypothesis: experiment.hypothesis
            },
            results: {
                totalSessions: experiment.results.totalSessions,
                statisticalSignificance: experiment.results.statisticalSignificance,
                confidenceLevel: experiment.results.confidenceLevel,
                winner: experiment.results.winner
            },
            variants: [],
            insights: this.generateInsights(experiment),
            recommendations: this.generateRecommendations(experiment)
        };

        // Add variant details
        experiment.variants.forEach(variant => {
            const results = experiment.results.variantResults.get(variant.id);
            report.variants.push({
                id: variant.id,
                name: variant.name,
                sessions: results.sessions,
                conversions: results.conversions,
                conversionRate: results.conversionRate,
                lift: this.calculateLift(results, experiment.results.variantResults.get(experiment.variants[0].id)),
                significance: this.statisticsEngine.calculateSignificance(
                    experiment.results.variantResults.get(experiment.variants[0].id),
                    results
                )
            });
        });

        return report;
    }

    generateInsights(experiment) {
        const insights = [];
        const bestVariant = this.findBestVariant(experiment);
        
        if (bestVariant.conversionRate > 0) {
            const controlRate = experiment.results.variantResults.get(experiment.variants[0].id).conversionRate;
            const lift = ((bestVariant.conversionRate - controlRate) / controlRate) * 100;
            
            if (lift > 10) {
                insights.push(`The best variant shows a significant ${lift.toFixed(1)}% improvement over control`);
            } else if (lift < -10) {
                insights.push(`The current best variant is underperforming control by ${Math.abs(lift).toFixed(1)}%`);
            } else {
                insights.push(`Variants are performing similarly to control (${lift.toFixed(1)}% difference)`);
            }
        }

        if (experiment.results.totalSessions < this.options.minimumSampleSize) {
            insights.push(`Need ${this.options.minimumSampleSize - experiment.results.totalSessions} more sessions for reliable results`);
        }

        return insights;
    }

    generateRecommendations(experiment) {
        const recommendations = [];
        
        if (experiment.results.statisticalSignificance && experiment.results.winner) {
            recommendations.push(`Implement the winning variant: ${experiment.results.winner}`);
        } else if (experiment.results.totalSessions > this.options.minimumSampleSize * 2) {
            recommendations.push('Consider running the experiment longer or increasing traffic allocation');
        } else {
            recommendations.push('Continue running the experiment to gather more data');
        }

        const health = this.assessExperimentHealth(experiment);
        if (health.score < 0.8) {
            recommendations.push('Review experiment setup - data quality issues detected');
        }

        return recommendations;
    }

    calculateLift(variantResults, controlResults) {
        if (controlResults.conversionRate === 0) return 0;
        return ((variantResults.conversionRate - controlResults.conversionRate) / controlResults.conversionRate) * 100;
    }

    /**
     * DATA PERSISTENCE
     */
    persistData() {
        try {
            const data = {
                experiments: Array.from(this.experiments.entries()),
                userAssignments: Array.from(this.userAssignments.entries()),
                results: Array.from(this.results.entries()),
                timestamp: Date.now()
            };

            localStorage.setItem('ab_testing_data', JSON.stringify(data));
        } catch (error) {
            this.log('Failed to persist data:', error);
        }
    }

    loadPersistedData() {
        try {
            const data = JSON.parse(localStorage.getItem('ab_testing_data') || '{}');
            
            if (data.experiments) {
                this.experiments = new Map(data.experiments);
            }
            if (data.userAssignments) {
                this.userAssignments = new Map(data.userAssignments);
            }
            if (data.results) {
                this.results = new Map(data.results);
            }

            this.log('📥 Persisted data loaded');
        } catch (error) {
            this.log('Failed to load persisted data:', error);
        }
    }

    /**
     * UTILITY METHODS
     */
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    sendWinnerNotification(experiment) {
        // In a real implementation, this would send notifications
        // to stakeholders about experiment results
        console.log(`🏆 Experiment Winner: ${experiment.name} - ${experiment.results.winner}`);
    }

    trackEvent(experimentId, event, data) {
        // Integration with analytics systems
        if (typeof gtag !== 'undefined') {
            gtag('event', `ab_test_${event}`, {
                experiment_id: experimentId,
                ...data
            });
        }
    }

    log(message, ...args) {
        if (this.options.debug) {
            console.log(`%c[A/B Testing] ${message}`, 'color: #3b82f6; font-weight: bold;', ...args);
        }
    }

    /**
     * PUBLIC API METHODS
     */
    getActiveExperiments() {
        return Array.from(this.experiments.values()).filter(exp => exp.status === 'active');
    }

    getExperimentResults(experimentId) {
        return this.generateReport(experimentId);
    }

    pauseExperiment(experimentId) {
        const experiment = this.experiments.get(experimentId);
        if (experiment) {
            experiment.status = 'paused';
            this.persistData();
            this.log(`⏸️ Paused experiment: ${experimentId}`);
        }
    }

    resumeExperiment(experimentId) {
        const experiment = this.experiments.get(experimentId);
        if (experiment) {
            experiment.status = 'active';
            this.persistData();
            this.log(`▶️ Resumed experiment: ${experimentId}`);
        }
    }

    stopExperiment(experimentId, declareWinner = false) {
        const experiment = this.experiments.get(experimentId);
        if (experiment) {
            experiment.status = 'completed';
            if (declareWinner && !experiment.results.winner) {
                this.declareWinner(experiment);
            }
            this.persistData();
            this.log(`🛑 Stopped experiment: ${experimentId}`);
        }
    }
}

/**
 * STATISTICS ENGINE
 * Handles statistical calculations for experiments
 */
class StatisticsEngine {
    constructor(options) {
        this.options = options;
    }

    calculateSignificance(controlResults, variantResults) {
        const n1 = controlResults.sessions;
        const n2 = variantResults.sessions;
        const x1 = controlResults.conversions;
        const x2 = variantResults.conversions;

        if (n1 === 0 || n2 === 0) {
            return { pValue: 1, significant: false, liftRange: { min: 0, max: 0 } };
        }

        const p1 = x1 / n1;
        const p2 = x2 / n2;
        const p = (x1 + x2) / (n1 + n2);

        const se = Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2));
        const z = Math.abs(p2 - p1) / se;
        const pValue = 2 * (1 - this.normalCDF(z));

        const lift = (p2 - p1) / p1;
        const liftSE = Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2) / p1;
        const marginOfError = 1.96 * liftSE;

        return {
            pValue: pValue,
            significant: pValue < (1 - this.options.confidenceLevel),
            lift: lift,
            liftRange: {
                min: lift - marginOfError,
                max: lift + marginOfError
            }
        };
    }

    normalCDF(x) {
        // Approximation of the normal cumulative distribution function
        return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
    }

    erf(x) {
        // Approximation of the error function
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;

        const sign = x >= 0 ? 1 : -1;
        x = Math.abs(x);

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return sign * y;
    }
}

/**
 * SEGMENTATION ENGINE
 * Handles user segmentation logic
 */
class SegmentationEngine {
    matches(userContext, segmentConfig) {
        // Simple rule-based matching
        return segmentConfig.rules.every(rule => {
            const userValue = userContext[rule.property];
            
            switch (rule.operator) {
                case 'equals':
                    return userValue === rule.value;
                case 'not_equals':
                    return userValue !== rule.value;
                case 'contains':
                    return typeof userValue === 'string' && userValue.includes(rule.value);
                case 'greater_than':
                    return typeof userValue === 'number' && userValue > rule.value;
                case 'less_than':
                    return typeof userValue === 'number' && userValue < rule.value;
                default:
                    return false;
            }
        });
    }
}

/**
 * BAYESIAN OPTIMIZATION ENGINE
 * Implements multi-armed bandit for traffic optimization
 */
class BayesianOptimization {
    optimize(experiment) {
        // Thompson Sampling for multi-armed bandit
        const variants = experiment.variants.map(variant => {
            const results = experiment.results.variantResults.get(variant.id);
            const alpha = results.conversions + 1;
            const beta = results.sessions - results.conversions + 1;
            
            // Sample from Beta distribution
            const sample = this.betaSample(alpha, beta);
            
            return {
                variantId: variant.id,
                sample: sample
            };
        });

        // Sort by sample value
        variants.sort((a, b) => b.sample - a.sample);

        // Allocate more traffic to better performing variants
        const allocation = {};
        const totalAllocation = 1.0;
        const minAllocation = 0.1; // Ensure minimum 10% for each variant
        
        variants.forEach((variant, index) => {
            const rank = index + 1;
            const weight = 1 / rank;
            allocation[variant.variantId] = Math.max(
                minAllocation,
                weight / variants.reduce((sum, v, i) => sum + (1 / (i + 1)), 0)
            );
        });

        // Normalize to ensure total allocation equals 1
        const totalAllocated = Object.values(allocation).reduce((a, b) => a + b, 0);
        Object.keys(allocation).forEach(variantId => {
            allocation[variantId] /= totalAllocated;
        });

        return allocation;
    }

    betaSample(alpha, beta) {
        // Simple approximation of Beta distribution sampling
        const gamma1 = this.gammaSample(alpha, 1);
        const gamma2 = this.gammaSample(beta, 1);
        return gamma1 / (gamma1 + gamma2);
    }

    gammaSample(shape, scale) {
        // Marsaglia and Tsang's method for Gamma distribution
        if (shape >= 1) {
            const d = shape - 1/3;
            const c = 1 / Math.sqrt(9 * d);
            
            while (true) {
                let x, v, u;
                
                do {
                    x = this.normalSample();
                    v = 1 + c * x;
                } while (v <= 0);
                
                v = v * v * v;
                u = Math.random();
                
                if (u < 1 - 0.0331 * x * x * x * x) {
                    return d * v * scale;
                }
                
                if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
                    return d * v * scale;
                }
            }
        } else {
            return this.gammaSample(shape + 1, scale) * Math.pow(Math.random(), 1 / shape);
        }
    }

    normalSample() {
        // Box-Muller transform for normal distribution sampling
        if (this.spare) {
            const result = this.spare;
            this.spare = null;
            return result;
        }
        
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
        
        this.spare = z1;
        return z0;
    }
}

// Global instance
window.ABTestingFramework = ABTestingFramework;

// Export for use in modules
export default ABTestingFramework;