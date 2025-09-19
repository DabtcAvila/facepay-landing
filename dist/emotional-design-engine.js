/**
 * FacePay Emotional Design Engine - Psychology-Driven Experience
 * Creates trust, urgency balance, and emotional satisfaction systems
 */

class EmotionalDesignEngine {
    constructor() {
        this.isInitialized = false;
        this.emotionalState = 'neutral';
        this.trustLevel = 0;
        this.urgencyLevel = 0;
        this.satisfactionLevel = 0;
        
        // User psychology tracking
        this.userProfile = {
            anxietyLevel: 0, // 0-10 scale
            trustBuilder: 'logical', // 'logical', 'social', 'visual', 'emotional'
            decisionSpeed: 'deliberate', // 'quick', 'deliberate', 'cautious'
            riskTolerance: 'medium', // 'low', 'medium', 'high'
            engagementStyle: 'explorer' // 'scanner', 'explorer', 'converter'
        };
        
        // Emotional design systems
        this.trustElements = new Map();
        this.urgencyElements = new Map();
        this.satisfactionTriggers = new Set();
        this.emotionalCallbacks = new Map();
        
        this.init();
    }
    
    init() {
        console.log('🧠 Initializing Emotional Design Engine...');
        
        this.setupTrustVisualization();
        this.setupBalancedUrgency();
        this.setupSocialProof();
        this.setupSatisfactionSystems();
        this.initializeUserProfiling();
        this.setupEmotionalMonitoring();
        
        this.isInitialized = true;
        console.log('✨ Emotional Design Engine ready!');
    }
    
    setupTrustVisualization() {
        // Create trust visualization elements
        this.trustVisualizer = {
            securityIndicators: this.createSecurityIndicators(),
            transparencyElements: this.createTransparencyElements(),
            socialProofVisuals: this.createSocialProofVisuals(),
            authenticityMarkers: this.createAuthenticityMarkers()
        };
        
        // Add trust-building CSS
        const trustStyles = document.createElement('style');
        trustStyles.id = 'trust-visualization-styles';
        trustStyles.textContent = `
            /* Trust Visualization System */
            .trust-indicator {
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .trust-indicator::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), transparent);
                transition: left 2s ease-in-out;
            }
            
            .trust-indicator.verified::before {
                left: 100%;
            }
            
            .security-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 6px 12px;
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.05));
                border: 1px solid rgba(16, 185, 129, 0.2);
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                color: var(--success);
                animation: trustPulse 4s ease-in-out infinite;
                backdrop-filter: blur(10px);
            }
            
            @keyframes trustPulse {
                0%, 100% { 
                    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
                    transform: scale(1);
                }
                50% { 
                    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
                    transform: scale(1.02);
                }
            }
            
            .transparency-panel {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                padding: 16px;
                margin: 12px 0;
                backdrop-filter: blur(20px);
                position: relative;
                overflow: hidden;
            }
            
            .transparency-panel::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 1px;
                background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), transparent);
                animation: transparencyShimmer 3s ease-in-out infinite;
            }
            
            @keyframes transparencyShimmer {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
            
            .social-proof-live {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                color: var(--text-dim);
                background: rgba(0, 255, 136, 0.05);
                padding: 8px 16px;
                border-radius: 25px;
                border: 1px solid rgba(0, 255, 136, 0.15);
                position: relative;
                overflow: hidden;
            }
            
            .social-proof-live::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 8px;
                width: 6px;
                height: 6px;
                background: var(--success);
                border-radius: 50%;
                animation: livePulse 2s ease-in-out infinite;
            }
            
            @keyframes livePulse {
                0%, 100% { 
                    opacity: 1;
                    transform: translateY(-50%) scale(1);
                }
                50% { 
                    opacity: 0.5;
                    transform: translateY(-50%) scale(1.5);
                }
            }
            
            .authenticity-marker {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 4px 10px;
                background: rgba(59, 130, 246, 0.1);
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: 15px;
                font-size: 11px;
                font-weight: 500;
                color: var(--secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            /* Balanced Urgency System */
            .urgency-gentle {
                background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.05));
                border: 1px solid rgba(245, 158, 11, 0.2);
                color: #f59e0b;
                animation: gentleUrgency 6s ease-in-out infinite;
            }
            
            @keyframes gentleUrgency {
                0%, 100% { 
                    opacity: 0.9;
                    transform: scale(1);
                }
                50% { 
                    opacity: 1;
                    transform: scale(1.01);
                }
            }
            
            .urgency-moderate {
                background: linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.08));
                border: 1px solid rgba(249, 115, 22, 0.25);
                color: #f97316;
                animation: moderateUrgency 4s ease-in-out infinite;
            }
            
            @keyframes moderateUrgency {
                0%, 100% { 
                    opacity: 0.85;
                    box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.3);
                }
                50% { 
                    opacity: 1;
                    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0);
                }
            }
            
            .urgency-strong {
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(248, 113, 113, 0.08));
                border: 1px solid rgba(239, 68, 68, 0.25);
                color: #ef4444;
                animation: strongUrgency 3s ease-in-out infinite;
            }
            
            @keyframes strongUrgency {
                0%, 100% { 
                    opacity: 0.8;
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
                }
                33% { 
                    opacity: 1;
                    transform: scale(1.02);
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0);
                }
                66% { 
                    opacity: 0.9;
                    transform: scale(1.01);
                    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
                }
            }
            
            /* Satisfaction & Completion Systems */
            .satisfaction-trigger {
                position: relative;
                transition: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
            }
            
            .satisfaction-trigger.completed {
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(34, 197, 94, 0.1));
                border-color: rgba(16, 185, 129, 0.4);
                transform: scale(1.05);
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
            }
            
            .satisfaction-trigger.completed::after {
                content: '✓';
                position: absolute;
                top: -8px;
                right: -8px;
                width: 24px;
                height: 24px;
                background: var(--success);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                animation: satisfactionPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            
            @keyframes satisfactionPop {
                0% {
                    transform: scale(0) rotate(-180deg);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.3) rotate(-90deg);
                    opacity: 1;
                }
                100% {
                    transform: scale(1) rotate(0deg);
                    opacity: 1;
                }
            }
            
            .dopamine-burst {
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                font-size: 20px;
                animation: dopamineBurst 2s ease-out forwards;
            }
            
            @keyframes dopamineBurst {
                0% {
                    transform: scale(0) rotate(0deg);
                    opacity: 1;
                }
                20% {
                    transform: scale(1.2) rotate(90deg);
                    opacity: 1;
                }
                100% {
                    transform: scale(0.5) rotate(360deg) translateY(-200px);
                    opacity: 0;
                }
            }
            
            /* Anxiety Reduction Elements */
            .anxiety-reducer {
                background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.05));
                border: 1px solid rgba(34, 197, 94, 0.2);
                border-radius: 8px;
                padding: 8px 12px;
                font-size: 13px;
                color: var(--success);
                animation: calmingBreath 8s ease-in-out infinite;
            }
            
            @keyframes calmingBreath {
                0%, 100% { 
                    opacity: 0.7;
                    transform: scale(1);
                }
                50% { 
                    opacity: 1;
                    transform: scale(1.01);
                }
            }
            
            /* User Profile Adaptations */
            .profile-logical .feature {
                border-left: 3px solid var(--primary);
                padding-left: 16px;
            }
            
            .profile-social .social-proof-element {
                display: block !important;
                opacity: 1 !important;
            }
            
            .profile-visual .visual-element {
                transform: scale(1.1);
                opacity: 1;
            }
            
            .profile-emotional .emotional-trigger {
                animation-duration: 0.8s;
                animation-iteration-count: 2;
            }
        `;
        document.head.appendChild(trustStyles);
    }
    
    createSecurityIndicators() {
        const indicators = [];
        
        // Add security badges to trust elements
        document.querySelectorAll('.trust-item, .security-message').forEach(element => {
            element.classList.add('trust-indicator');
            
            if (!element.querySelector('.security-badge')) {
                const badge = document.createElement('span');
                badge.className = 'security-badge';
                badge.innerHTML = `
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L3 7v6c0 5.55 3.84 9.74 9 10 5.16-.26 9-4.45 9-10V7l-9-5z"/>
                    </svg>
                    Verified
                `;
                element.appendChild(badge);
            }
            
            // Trigger verification animation
            setTimeout(() => {
                element.classList.add('verified');
            }, Math.random() * 3000 + 1000);
            
            indicators.push(element);
        });
        
        return indicators;
    }
    
    createTransparencyElements() {
        const transparencyInfo = [
            {
                title: "Open Source Security",
                detail: "Smart contracts are publicly auditable on StarkNet",
                icon: "🔍"
            },
            {
                title: "Non-Custodial Architecture",
                detail: "Your private keys never leave your device",
                icon: "🔐"
            },
            {
                title: "Biometric Privacy",
                detail: "Face ID data processed locally only",
                icon: "👤"
            }
        ];
        
        transparencyInfo.forEach(info => {
            const panel = document.createElement('div');
            panel.className = 'transparency-panel';
            panel.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                    <span style="font-size: 18px;">${info.icon}</span>
                    <strong style="color: var(--primary); font-size: 14px;">${info.title}</strong>
                </div>
                <div style="font-size: 13px; color: var(--text-dim); line-height: 1.4;">
                    ${info.detail}
                </div>
            `;
            
            // Find appropriate location and insert
            const securityMessage = document.querySelector('.security-message');
            if (securityMessage) {
                securityMessage.parentNode.insertBefore(panel, securityMessage);
            }
        });
        
        return document.querySelectorAll('.transparency-panel');
    }
    
    createSocialProofVisuals() {
        const activities = [
            "Sarah just sent $50 to @mike using Face ID",
            "Alex completed secure transaction in 2 seconds",
            "Jordan joined from San Francisco",
            "Morgan verified account with Face ID",
            "Taylor sent crypto to @friend instantly",
            "Casey joined the beta program",
            "Riley completed first Face ID payment",
            "Quinn verified biometric security"
        ];
        
        // Create live activity feed
        const liveProof = document.createElement('div');
        liveProof.className = 'social-proof-live';
        liveProof.innerHTML = `
            <span style="margin-left: 16px; font-weight: 500;">
                <span id="liveActivityText">Someone just joined FacePay</span>
            </span>
        `;
        
        // Insert after trust bar
        const trustBar = document.querySelector('.trust-bar');
        if (trustBar) {
            trustBar.appendChild(liveProof);
        }
        
        // Update activity every 8-15 seconds
        let activityIndex = 0;
        setInterval(() => {
            const textElement = document.getElementById('liveActivityText');
            if (textElement) {
                textElement.style.opacity = '0';
                setTimeout(() => {
                    textElement.textContent = activities[activityIndex % activities.length];
                    textElement.style.opacity = '1';
                    activityIndex++;
                }, 300);
            }
        }, 8000 + Math.random() * 7000);
        
        return [liveProof];
    }
    
    createAuthenticityMarkers() {
        const markers = [
            { text: "StarkNet Official", location: ".trust-item" },
            { text: "Security Audited", location: ".security-message" },
            { text: "Beta Verified", location: ".cta-urgent" }
        ];
        
        markers.forEach(marker => {
            const elements = document.querySelectorAll(marker.location);
            elements.forEach(element => {
                const authMarker = document.createElement('span');
                authMarker.className = 'authenticity-marker';
                authMarker.innerHTML = `
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    ${marker.text}
                `;
                element.appendChild(authMarker);
            });
        });
        
        return document.querySelectorAll('.authenticity-marker');
    }
    
    setupBalancedUrgency() {
        // Classify urgency elements by intensity
        this.urgencyClassification = {
            gentle: document.querySelectorAll('.trust-badge, .security-message'),
            moderate: document.querySelectorAll('.cta-urgent'),
            strong: document.querySelectorAll('.btn-primary')
        };
        
        // Apply balanced urgency classes
        this.urgencyClassification.gentle.forEach(el => {
            el.classList.add('urgency-gentle');
        });
        
        this.urgencyClassification.moderate.forEach(el => {
            el.classList.add('urgency-moderate');
        });
        
        // Only apply strong urgency after user engagement
        setTimeout(() => {
            this.urgencyClassification.strong.forEach(el => {
                if (this.userProfile.anxietyLevel < 5) {
                    el.classList.add('urgency-strong');
                }
            });
        }, 10000); // Wait 10 seconds
        
        // Monitor user behavior for anxiety signals
        this.monitorAnxietySignals();
    }
    
    monitorAnxietySignals() {
        let rapidScrollCount = 0;
        let backButtonCount = 0;
        let hesitationTime = 0;
        
        // Detect rapid scrolling (anxiety indicator)
        let lastScrollTime = 0;
        let scrollSpeed = 0;
        
        window.addEventListener('scroll', () => {
            const now = Date.now();
            const deltaTime = now - lastScrollTime;
            const deltaScroll = Math.abs(window.scrollY - (this.lastScrollY || 0));
            
            scrollSpeed = deltaScroll / (deltaTime || 1);
            
            if (scrollSpeed > 2 && deltaTime < 100) {
                rapidScrollCount++;
                if (rapidScrollCount > 10) {
                    this.reduceUrgency();
                    rapidScrollCount = 0;
                }
            }
            
            lastScrollTime = now;
            this.lastScrollY = window.scrollY;
        }, { passive: true });
        
        // Detect button hesitation
        document.querySelectorAll('.btn').forEach(btn => {
            let hoverStart = 0;
            
            btn.addEventListener('mouseenter', () => {
                hoverStart = Date.now();
            });
            
            btn.addEventListener('mouseleave', () => {
                const hoverDuration = Date.now() - hoverStart;
                if (hoverDuration > 2000 && hoverDuration < 5000) {
                    hesitationTime += hoverDuration;
                    if (hesitationTime > 10000) {
                        this.provideReassurance(btn);
                        hesitationTime = 0;
                    }
                }
            });
        });
    }
    
    reduceUrgency() {
        console.log('🧠 Reducing urgency - anxiety detected');
        
        // Remove strong urgency animations
        document.querySelectorAll('.urgency-strong').forEach(el => {
            el.classList.remove('urgency-strong');
            el.classList.add('urgency-gentle');
        });
        
        // Add calming elements
        this.addCalmingElements();
        
        this.userProfile.anxietyLevel = Math.min(this.userProfile.anxietyLevel + 2, 10);
    }
    
    addCalmingElements() {
        const calmingMessage = document.createElement('div');
        calmingMessage.className = 'anxiety-reducer';
        calmingMessage.innerHTML = `
            <span style="color: var(--success);">✨</span>
            No rush - explore at your own pace. Your security is guaranteed.
        `;
        
        // Insert near CTA buttons
        const ctaSection = document.querySelector('.cta-buttons');
        if (ctaSection && !ctaSection.querySelector('.anxiety-reducer')) {
            ctaSection.appendChild(calmingMessage);
        }
    }
    
    provideReassurance(element) {
        const reassurances = [
            "✅ 100% secure - your data never leaves your device",
            "🛡️ Bank-level encryption protects every transaction",
            "👥 Join 12,000+ satisfied users already using FacePay",
            "🔒 Non-custodial means you always control your funds"
        ];
        
        const reassurance = document.createElement('div');
        reassurance.className = 'anxiety-reducer';
        reassurance.style.cssText = `
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        reassurance.textContent = reassurances[Math.floor(Math.random() * reassurances.length)];
        
        element.style.position = 'relative';
        element.appendChild(reassurance);
        
        // Show reassurance
        setTimeout(() => {
            reassurance.style.opacity = '1';
        }, 100);
        
        // Hide after 3 seconds
        setTimeout(() => {
            reassurance.style.opacity = '0';
            setTimeout(() => reassurance.remove(), 300);
        }, 3000);
    }
    
    setupSocialProof() {
        // Real-time activity simulation
        this.activitySimulator = {
            activities: [
                { action: "verified", user: "Sarah", location: "New York" },
                { action: "joined", user: "Alex", location: "San Francisco" },
                { action: "sent", user: "Jordan", amount: "$25", recipient: "@mike" },
                { action: "completed", user: "Taylor", detail: "first transaction" }
            ],
            
            simulate: () => {
                const activity = this.activitySimulator.activities[
                    Math.floor(Math.random() * this.activitySimulator.activities.length)
                ];
                
                this.showActivityNotification(activity);
            }
        };
        
        // Start activity simulation
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every interval
                this.activitySimulator.simulate();
            }
        }, 15000); // Every 15 seconds
    }
    
    showActivityNotification(activity) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 255, 136, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 250px;
        `;
        
        let message = '';
        switch (activity.action) {
            case 'verified':
                message = `${activity.user} verified Face ID from ${activity.location}`;
                break;
            case 'joined':
                message = `${activity.user} joined from ${activity.location}`;
                break;
            case 'sent':
                message = `${activity.user} sent ${activity.amount} to ${activity.recipient}`;
                break;
            case 'completed':
                message = `${activity.user} completed ${activity.detail}`;
                break;
        }
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 6px; height: 6px; background: var(--success); border-radius: 50%; animation: pulse 2s infinite;"></div>
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    setupSatisfactionSystems() {
        // Identify satisfaction trigger points
        const satisfactionTriggers = [
            { element: '.face-scanner-hero', event: 'click', satisfaction: 'biometric_success' },
            { element: '.btn-primary', event: 'click', satisfaction: 'primary_action' },
            { element: '.feature', event: 'click', satisfaction: 'feature_exploration' },
            { element: '.demo-video', event: 'play', satisfaction: 'content_engagement' }
        ];
        
        satisfactionTriggers.forEach(trigger => {
            const elements = document.querySelectorAll(trigger.element);
            elements.forEach(element => {
                element.classList.add('satisfaction-trigger');
                
                const eventType = trigger.event === 'play' ? 'loadeddata' : trigger.event;
                
                element.addEventListener(eventType, () => {
                    this.triggerSatisfaction(element, trigger.satisfaction);
                });
            });
        });
    }
    
    triggerSatisfaction(element, type) {
        // Visual satisfaction feedback
        element.classList.add('completed');
        
        // Create dopamine burst effect
        this.createDopamineBurst(element, type);
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([50, 30, 100, 30, 150]);
        }
        
        // Progressive satisfaction building
        this.satisfactionLevel = Math.min(this.satisfactionLevel + 1, 10);
        
        // Unlock next level of experience
        if (this.satisfactionLevel >= 5) {
            this.unlockPremiumExperience();
        }
        
        // Reset completed state after animation
        setTimeout(() => {
            element.classList.remove('completed');
        }, 2000);
    }
    
    createDopamineBurst(element, type) {
        const symbols = {
            biometric_success: ['🎉', '✨', '⭐', '🌟', '💫'],
            primary_action: ['🚀', '⚡', '💸', '✅', '🔥'],
            feature_exploration: ['👀', '💡', '🧠', '🔍', '✨'],
            content_engagement: ['📱', '👤', '💰', '🎯', '🏆']
        };
        
        const burstSymbols = symbols[type] || symbols.biometric_success;
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create multiple particles
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'dopamine-burst';
                particle.textContent = burstSymbols[Math.floor(Math.random() * burstSymbols.length)];
                
                const angle = (i / 8) * Math.PI * 2;
                const distance = 30 + Math.random() * 40;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                
                document.body.appendChild(particle);
                
                setTimeout(() => particle.remove(), 2000);
            }, i * 50);
        }
    }
    
    unlockPremiumExperience() {
        console.log('✨ Unlocking premium experience - high satisfaction detected');
        
        document.body.classList.add('premium-unlocked');
        
        // Add premium visual enhancements
        const style = document.createElement('style');
        style.textContent = `
            .premium-unlocked .btn {
                background: linear-gradient(135deg, var(--primary), #34d399, var(--secondary));
                background-size: 200% 200%;
                animation: premiumGradient 3s ease infinite;
            }
            
            @keyframes premiumGradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            .premium-unlocked .face-scanner-hero {
                box-shadow: 0 0 40px rgba(0, 255, 136, 0.6);
                animation: premiumGlow 2s ease-in-out infinite alternate;
            }
            
            @keyframes premiumGlow {
                0% { filter: brightness(1) saturate(1); }
                100% { filter: brightness(1.2) saturate(1.3); }
            }
        `;
        document.head.appendChild(style);
        
        // Show premium unlock notification
        this.showPremiumUnlockNotification();
    }
    
    showPremiumUnlockNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(59, 130, 246, 0.2));
            color: white;
            padding: 20px 30px;
            border-radius: 16px;
            font-size: 16px;
            font-weight: 600;
            z-index: 10000;
            backdrop-filter: blur(20px);
            border: 2px solid rgba(0, 255, 136, 0.4);
            text-align: center;
            animation: premiumUnlock 3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;
        
        notification.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 10px;">✨🎉✨</div>
            <div>Premium Experience Unlocked!</div>
            <div style="font-size: 14px; opacity: 0.8; margin-top: 8px;">
                Enhanced animations and effects activated
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes premiumUnlock {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.5) rotate(-180deg);
                }
                50% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.1) rotate(0deg);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(1) rotate(0deg);
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 3000);
    }
    
    initializeUserProfiling() {
        // Analyze user behavior patterns
        this.behaviorAnalyzer = {
            timeOnSite: Date.now(),
            scrollPatterns: [],
            interactionTypes: [],
            hoverDurations: [],
            clickDelays: []
        };
        
        // Track decision-making patterns
        document.querySelectorAll('.btn, .feature, .face-scanner-hero').forEach(element => {
            let hoverStart = 0;
            
            element.addEventListener('mouseenter', () => {
                hoverStart = Date.now();
            });
            
            element.addEventListener('mouseleave', () => {
                if (hoverStart) {
                    const duration = Date.now() - hoverStart;
                    this.behaviorAnalyzer.hoverDurations.push(duration);
                    this.analyzeDecisionSpeed();
                }
            });
            
            element.addEventListener('click', () => {
                if (hoverStart) {
                    const clickDelay = Date.now() - hoverStart;
                    this.behaviorAnalyzer.clickDelays.push(clickDelay);
                    this.analyzeDecisionSpeed();
                }
            });
        });
        
        // Adapt experience every 10 seconds
        setInterval(() => {
            this.adaptToUserProfile();
        }, 10000);
    }
    
    analyzeDecisionSpeed() {
        const avgHover = this.behaviorAnalyzer.hoverDurations.reduce((a, b) => a + b, 0) / 
                         this.behaviorAnalyzer.hoverDurations.length || 0;
        const avgClick = this.behaviorAnalyzer.clickDelays.reduce((a, b) => a + b, 0) / 
                         this.behaviorAnalyzer.clickDelays.length || 0;
        
        if (avgHover < 1000 && avgClick < 500) {
            this.userProfile.decisionSpeed = 'quick';
        } else if (avgHover > 3000 || avgClick > 2000) {
            this.userProfile.decisionSpeed = 'cautious';
        } else {
            this.userProfile.decisionSpeed = 'deliberate';
        }
    }
    
    adaptToUserProfile() {
        // Apply profile-specific classes
        document.body.className = document.body.className.replace(/profile-\w+/g, '');
        
        if (this.userProfile.decisionSpeed === 'cautious') {
            document.body.classList.add('profile-cautious');
            this.enhanceTrustElements();
            this.reduceUrgency();
        } else if (this.userProfile.decisionSpeed === 'quick') {
            document.body.classList.add('profile-quick');
            this.streamlineExperience();
        }
        
        // Adapt trust building approach
        if (this.satisfactionLevel < 3) {
            this.userProfile.trustBuilder = 'logical';
            document.body.classList.add('profile-logical');
            this.emphasizeLogicalElements();
        }
    }
    
    enhanceTrustElements() {
        // Make trust indicators more prominent
        document.querySelectorAll('.security-badge, .authenticity-marker').forEach(el => {
            el.style.transform = 'scale(1.1)';
            el.style.animationDuration = '6s'; // Slower, calming animation
        });
    }
    
    streamlineExperience() {
        // Reduce visual clutter for quick decision makers
        document.querySelectorAll('.transparency-panel').forEach(el => {
            el.style.display = 'none';
        });
        
        // Emphasize primary actions
        document.querySelectorAll('.btn-primary').forEach(el => {
            el.style.transform = 'scale(1.05)';
            el.style.zIndex = '10';
        });
    }
    
    emphasizeLogicalElements() {
        // Highlight logical, fact-based elements
        document.querySelectorAll('.feature p, .security-message').forEach(el => {
            el.style.borderLeft = '3px solid var(--primary)';
            el.style.paddingLeft = '12px';
            el.style.background = 'rgba(0, 255, 136, 0.03)';
        });
    }
    
    setupEmotionalMonitoring() {
        // Monitor emotional state changes
        this.emotionalMonitor = {
            frustrationSignals: 0,
            engagementLevel: 0,
            trustSignals: 0
        };
        
        // Detect frustration signals
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.emotionalMonitor.frustrationSignals++;
                if (this.emotionalMonitor.frustrationSignals > 2) {
                    this.provideSupportive();
                }
            }
        });
        
        // Detect engagement
        ['scroll', 'click', 'mousemove'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                this.emotionalMonitor.engagementLevel++;
            }, { passive: true });
        });
        
        // Emotional state reporting
        setInterval(() => {
            this.updateEmotionalState();
        }, 15000);
    }
    
    updateEmotionalState() {
        const engagement = this.emotionalMonitor.engagementLevel;
        const frustration = this.emotionalMonitor.frustrationSignals;
        
        if (engagement > 20 && frustration < 2) {
            this.emotionalState = 'positive';
            this.enhancePositiveExperience();
        } else if (frustration > 3) {
            this.emotionalState = 'frustrated';
            this.provideSupportive();
        } else {
            this.emotionalState = 'neutral';
        }
        
        // Reset counters
        this.emotionalMonitor.engagementLevel = Math.max(0, engagement - 10);
    }
    
    enhancePositiveExperience() {
        // User is engaged - enhance the experience
        if (window.cinematicEngine) {
            window.cinematicEngine.adaptToDevice({ engagement: 'high' });
        }
        
        // Add positive reinforcement
        this.addPositiveReinforcement();
    }
    
    addPositiveReinforcement() {
        const messages = [
            "🎉 You're exploring like a pro!",
            "✨ Great choice - security first!",
            "🚀 Ready to revolutionize payments?",
            "🔥 Join the crypto future!"
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        const reinforcement = document.createElement('div');
        reinforcement.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(59, 130, 246, 0.1));
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            z-index: 9999;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 255, 136, 0.3);
            animation: positiveReinforcement 4s ease-in-out;
        `;
        
        reinforcement.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes positiveReinforcement {
                0% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                20%, 80% {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                100% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(reinforcement);
        
        setTimeout(() => {
            reinforcement.remove();
            style.remove();
        }, 4000);
    }
    
    provideSupportive() {
        console.log('🤗 Providing supportive experience - frustration detected');
        
        // Add supportive, reassuring elements
        const support = document.createElement('div');
        support.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(34, 197, 94, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            backdrop-filter: blur(10px);
            text-align: center;
            max-width: 300px;
            line-height: 1.4;
        `;
        
        support.innerHTML = `
            <div style="margin-bottom: 8px;"><strong>Need help? We're here for you!</strong></div>
            <div style="font-size: 13px; opacity: 0.9;">
                Take your time exploring. Your security is our top priority.
            </div>
        `;
        
        document.body.appendChild(support);
        
        setTimeout(() => {
            support.style.opacity = '0';
            setTimeout(() => support.remove(), 300);
        }, 6000);
        
        // Reduce all urgency elements
        this.reduceUrgency();
    }
    
    // Public API
    getTrustLevel() {
        return this.trustLevel;
    }
    
    getEmotionalState() {
        return {
            state: this.emotionalState,
            satisfaction: this.satisfactionLevel,
            anxiety: this.userProfile.anxietyLevel,
            trust: this.trustLevel,
            profile: this.userProfile
        };
    }
    
    triggerEmotionalResponse(type, intensity = 'medium') {
        if (type === 'satisfaction') {
            const element = document.querySelector('.face-scanner-hero');
            if (element) this.triggerSatisfaction(element, 'biometric_success');
        } else if (type === 'trust') {
            this.enhanceTrustElements();
        } else if (type === 'support') {
            this.provideSupportive();
        }
    }
    
    adaptToAnxietyLevel(level) {
        this.userProfile.anxietyLevel = level;
        if (level > 5) {
            this.reduceUrgency();
            this.addCalmingElements();
        }
    }
    
    destroy() {
        clearInterval(this.activitySimulator?.interval);
        document.getElementById('trust-visualization-styles')?.remove();
        document.querySelectorAll('.dopamine-burst, .social-proof-live, .anxiety-reducer').forEach(el => el.remove());
    }
}

// Global instance
window.emotionalDesignEngine = null;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.emotionalDesignEngine = new EmotionalDesignEngine();
    });
} else {
    window.emotionalDesignEngine = new EmotionalDesignEngine();
}