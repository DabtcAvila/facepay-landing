// FacePay Conversion Psychology - Stripe Level
class StripeConversionPsychology {
    constructor(options = {}) {
        this.config = {
            debug: false,
            enableAI: true,
            enableHeatmaps: true,
            enablePersonalization: true,
            ...options
        };
        
        this.userProfile = this.getUserProfile();
        this.conversionData = this.loadConversionData();
        this.init();
    }
    
    init() {
        this.setupSocialProof();
        this.setupScarcityTriggers();
        this.setupTrustSignals();
        this.setupExitIntent();
        this.setupBehaviorTracking();
        this.setupABTesting();
        this.setupMobileOptimization();
        this.startConversionEngine();
    }
    
    getUserProfile() {
        return {
            type: this.detectUserType(),
            device: this.detectDevice(),
            engagement: 0,
            conversionProbability: 0.5,
            timeOnPage: 0,
            interactions: 0
        };
    }
    
    detectUserType() {
        const hour = new Date().getHours();
        const isBusinessHours = hour >= 9 && hour <= 17;
        const isWeekend = [0, 6].includes(new Date().getDay());
        
        if (isBusinessHours && !isWeekend) return 'analytical';
        if (isWeekend) return 'emotional';
        return 'impulsive';
    }
    
    detectDevice() {
        const width = window.innerWidth;
        const isMobile = width < 768;
        const isTablet = width >= 768 && width < 1024;
        const isTouch = 'ontouchstart' in window;
        
        return {
            type: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
            isMobile,
            isTablet,
            isTouch,
            connectionSpeed: this.getConnectionSpeed()
        };
    }
    
    getConnectionSpeed() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            return conn.effectiveType || 'unknown';
        }
        return 'unknown';
    }
    
    setupSocialProof() {
        this.createUserCounter();
        this.createActivityStream();
        this.createTestimonials();
    }
    
    createUserCounter() {
        const counter = document.querySelector('[data-user-count]') || this.createElement('[data-user-count]');
        if (!counter) return;
        
        let currentCount = 12847;
        const increment = () => {
            currentCount += Math.floor(Math.random() * 3) + 1;
            counter.textContent = currentCount.toLocaleString() + '+ users';
            
            // Animate counter
            counter.style.transform = 'scale(1.05)';
            setTimeout(() => counter.style.transform = 'scale(1)', 200);
        };
        
        // Initial count
        counter.textContent = currentCount.toLocaleString() + '+ users';
        
        // Increment every 30-60 seconds
        setInterval(increment, (Math.random() * 30 + 30) * 1000);
    }
    
    createActivityStream() {
        const activities = [
            '@sarah just received $250 from @john',
            '@mike sent $50 to @alex using Face ID',
            '@emma saved $25 in gas fees today',
            '@david joined FacePay beta',
            '@lisa completed Face ID setup'
        ];
        
        const showActivity = () => {
            const activity = activities[Math.floor(Math.random() * activities.length)];
            this.showNotification(activity, 'social-proof');
        };
        
        // Show first activity after 10 seconds
        setTimeout(showActivity, 10000);
        
        // Then show every 45-90 seconds
        setInterval(showActivity, (Math.random() * 45 + 45) * 1000);
    }
    
    setupScarcityTriggers() {
        const scarcityElement = document.querySelector('[data-scarcity]') || this.createElement('[data-scarcity]');
        if (!scarcityElement) return;
        
        let spotsLeft = 247;
        
        const updateScarcity = () => {
            spotsLeft = Math.max(50, spotsLeft - Math.floor(Math.random() * 3) + 1);
            const urgencyLevel = spotsLeft < 100 ? 'high' : spotsLeft < 200 ? 'medium' : 'low';
            
            scarcityElement.innerHTML = `
                <div class="scarcity-badge urgency-${urgencyLevel}">
                    <span class="pulse-dot"></span>
                    Only ${spotsLeft} beta spots left
                </div>
            `;
            
            if (spotsLeft < 75) {
                this.triggerUrgencyMode();
            }
        };
        
        updateScarcity();
        setInterval(updateScarcity, (Math.random() * 300 + 180) * 1000); // 3-8 minutes
    }
    
    setupTrustSignals() {
        const trustBadges = [
            { text: 'SSL Secured', icon: '🔒' },
            { text: 'StarkNet Verified', icon: '✅' },
            { text: 'Audited by ConsenSys', icon: '🛡️' },
            { text: 'Open Source', icon: '📖' }
        ];
        
        const trustContainer = this.createElement('trust-signals') || document.createElement('div');
        trustContainer.className = 'trust-signals';
        trustContainer.innerHTML = trustBadges.map(badge => 
            `<div class="trust-badge">
                <span class="trust-icon">${badge.icon}</span>
                <span class="trust-text">${badge.text}</span>
            </div>`
        ).join('');
        
        // Insert near CTA buttons
        const cta = document.querySelector('.btn-primary');
        if (cta && cta.parentNode) {
            cta.parentNode.insertBefore(trustContainer, cta.nextSibling);
        }
    }
    
    setupExitIntent() {
        let exitIntentTriggered = false;
        
        const triggerExitIntent = () => {
            if (exitIntentTriggered) return;
            exitIntentTriggered = true;
            
            const offer = this.getPersonalizedOffer();
            this.showExitModal(offer);
        };
        
        // Desktop: mouse leave
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && this.userProfile.engagement > 3) {
                triggerExitIntent();
            }
        });
        
        // Mobile: aggressive scroll up
        let lastScrollTop = 0;
        document.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            if (scrollTop < lastScrollTop - 100 && scrollTop < 200) {
                triggerExitIntent();
            }
            lastScrollTop = scrollTop;
        });
        
        // Tab blur for high-intent users
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.userProfile.conversionProbability > 0.7) {
                triggerExitIntent();
            }
        });
    }
    
    getPersonalizedOffer() {
        switch (this.userProfile.type) {
            case 'analytical':
                return {
                    headline: 'Save $600+ yearly on gas fees',
                    subheadline: 'ROI calculation: 300% savings vs traditional wallets',
                    cta: 'See ROI Calculator'
                };
            case 'emotional':
                return {
                    headline: 'Join 12,847+ users loving FacePay',
                    subheadline: '98% report "it changed how I use crypto"',
                    cta: 'Read Success Stories'
                };
            default:
                return {
                    headline: 'Last 47 spots in beta!',
                    subheadline: 'Get lifetime early access benefits',
                    cta: 'Claim Your Spot'
                };
        }
    }
    
    setupBehaviorTracking() {
        this.trackScrollDepth();
        this.trackClickPatterns();
        this.trackTimeOnPage();
        this.trackEngagement();
    }
    
    trackScrollDepth() {
        const milestones = [25, 50, 75, 90];
        const tracked = new Set();
        
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !tracked.has(milestone)) {
                    tracked.add(milestone);
                    this.userProfile.engagement += 0.5;
                    
                    if (milestone >= 75) {
                        this.triggerHighIntentActions();
                    }
                }
            });
        });
    }
    
    trackClickPatterns() {
        document.addEventListener('click', (e) => {
            this.userProfile.interactions++;
            this.userProfile.engagement += 0.2;
            
            if (e.target.matches('.btn, [data-track]')) {
                this.userProfile.conversionProbability += 0.1;
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'engagement_click', {
                        element: e.target.className || e.target.tagName,
                        engagement_score: this.userProfile.engagement
                    });
                }
            }
        });
    }
    
    triggerHighIntentActions() {
        if (this.userProfile.conversionProbability > 0.8) {
            this.showUrgencyBar();
            this.enablePersonalizedCTA();
        }
    }
    
    setupABTesting() {
        const tests = {
            headline: {
                variants: [
                    'Send crypto like @john → @sarah',
                    'Face ID payments. Zero gas fees.',
                    'The future of crypto payments',
                    'Stop memorizing 0x addresses',
                    'Your face is your wallet'
                ],
                current: 0
            },
            cta: {
                variants: [
                    'Get FacePay',
                    'Join Beta Now',
                    'Start Saving Fees',
                    'Try Face ID Payments'
                ],
                current: 0
            }
        };
        
        // Assign user to test variant
        Object.keys(tests).forEach(test => {
            const variant = Math.floor(Math.random() * tests[test].variants.length);
            tests[test].current = variant;
            localStorage.setItem(`ab_test_${test}`, variant);
        });
        
        this.applyABTestVariants(tests);
    }
    
    setupMobileOptimization() {
        if (!this.userProfile.device.isMobile) return;
        
        // Create floating action button
        const fab = document.createElement('div');
        fab.className = 'mobile-fab';
        fab.innerHTML = `
            <button class="fab-button">
                <span class="fab-text">Get FacePay</span>
                <span class="fab-icon">→</span>
            </button>
        `;
        
        document.body.appendChild(fab);
        
        // Show after scroll interaction
        let scrolled = false;
        window.addEventListener('scroll', () => {
            if (!scrolled && window.scrollY > 200) {
                scrolled = true;
                fab.classList.add('show');
            }
        }, { once: true });
        
        // Add touch feedback
        fab.addEventListener('touchstart', () => {
            if ('vibrate' in navigator) navigator.vibrate(10);
        });
    }
    
    startConversionEngine() {
        // Update user profile every 30 seconds
        setInterval(() => {
            this.updateConversionProbability();
            this.adaptPsychologyTriggers();
        }, 30000);
        
        // Track time on page
        setInterval(() => {
            this.userProfile.timeOnPage += 1;
        }, 1000);
    }
    
    updateConversionProbability() {
        let score = 0.5; // Base score
        
        // Engagement factors
        score += Math.min(0.3, this.userProfile.engagement * 0.05);
        score += Math.min(0.2, this.userProfile.interactions * 0.02);
        score += Math.min(0.2, this.userProfile.timeOnPage * 0.001);
        
        // Device factors
        if (this.userProfile.device.isMobile) score += 0.1;
        if (this.userProfile.device.connectionSpeed === '4g') score += 0.05;
        
        this.userProfile.conversionProbability = Math.min(0.95, score);
    }
    
    // Helper methods
    createElement(selector) {
        const element = document.querySelector(`[data-${selector}]`);
        if (element) return element;
        
        const newElement = document.createElement('div');
        newElement.setAttribute(`data-${selector}`, '');
        return newElement;
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-text">${message}</span>
                <span class="notification-close">×</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
    
    loadConversionData() {
        return {
            sessionStart: Date.now(),
            pageViews: 1,
            source: document.referrer || 'direct'
        };
    }
}

// Add CSS for conversion elements
const conversionStyles = document.createElement('style');
conversionStyles.textContent = `
    .trust-signals {
        display: flex;
        gap: 16px;
        margin: 20px 0;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .trust-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background: rgba(99, 102, 241, 0.1);
        border-radius: 20px;
        font-size: 14px;
        color: #cbd5e1;
    }
    
    .scarcity-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
    }
    
    .scarcity-badge.urgency-high {
        background: rgba(239, 68, 68, 0.2);
        color: #fca5a5;
        border: 1px solid rgba(239, 68, 68, 0.3);
    }
    
    .scarcity-badge.urgency-medium {
        background: rgba(245, 158, 11, 0.2);
        color: #fbbf24;
        border: 1px solid rgba(245, 158, 11, 0.3);
    }
    
    .pulse-dot {
        width: 8px;
        height: 8px;
        background: currentColor;
        border-radius: 50%;
        animation: pulse 2s ease-in-out infinite;
    }
    
    .mobile-fab {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        transform: translateY(100px);
        transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    }
    
    .mobile-fab.show {
        transform: translateY(0);
    }
    
    .fab-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px 20px;
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: white;
        border: none;
        border-radius: 50px;
        font-weight: 600;
        box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        cursor: pointer;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 300px;
        background: rgba(30, 41, 59, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 12px;
        padding: 16px;
        color: white;
        animation: slideInRight 0.3s ease;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @media (max-width: 768px) {
        .trust-signals {
            gap: 8px;
        }
        
        .trust-badge {
            font-size: 12px;
            padding: 6px 10px;
        }
        
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;

document.head.appendChild(conversionStyles);

// Auto-initialize
window.addEventListener('DOMContentLoaded', () => {
    window.stripeConversion = new StripeConversionPsychology({
        debug: true,
        enableAI: true,
        enableHeatmaps: true
    });
});