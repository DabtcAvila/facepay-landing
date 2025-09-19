/**
 * Mobile Performance Validator
 * Validates and reports on mobile responsiveness and performance
 */

class MobilePerformanceValidator {
    constructor() {
        this.metrics = {
            viewport: {},
            touchTargets: [],
            performance: {},
            accessibility: {},
            responsiveness: {}
        };
        
        this.init();
    }
    
    init() {
        this.validateViewport();
        this.validateTouchTargets();
        this.validatePerformance();
        this.validateAccessibility();
        this.validateResponsiveness();
        this.generateReport();
    }
    
    validateViewport() {
        const viewport = document.querySelector('meta[name="viewport"]');
        const hasViewportMeta = !!viewport;
        const viewportContent = viewport ? viewport.getAttribute('content') : '';
        
        // Check for proper viewport settings
        const hasWidthDevice = viewportContent.includes('width=device-width');
        const hasInitialScale = viewportContent.includes('initial-scale=1.0');
        const hasUserScalableNo = viewportContent.includes('user-scalable=no');
        const hasViewportFit = viewportContent.includes('viewport-fit=cover');
        
        // Check for CSS custom properties
        const hasVhProperty = getComputedStyle(document.documentElement).getPropertyValue('--vh');
        const hasSafeArea = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top');
        
        this.metrics.viewport = {
            hasViewportMeta,
            hasWidthDevice,
            hasInitialScale,
            hasUserScalableNo,
            hasViewportFit,
            hasVhProperty: !!hasVhProperty,
            hasSafeArea: !!hasSafeArea,
            score: this.calculateViewportScore({
                hasViewportMeta,
                hasWidthDevice,
                hasInitialScale,
                hasUserScalableNo,
                hasVhProperty: !!hasVhProperty,
                hasSafeArea: !!hasSafeArea
            })
        };
    }
    
    calculateViewportScore(checks) {
        const weights = {
            hasViewportMeta: 20,
            hasWidthDevice: 20,
            hasInitialScale: 15,
            hasUserScalableNo: 10,
            hasVhProperty: 20,
            hasSafeArea: 15
        };
        
        let score = 0;
        let maxScore = 0;
        
        Object.keys(weights).forEach(key => {
            maxScore += weights[key];
            if (checks[key]) {
                score += weights[key];
            }
        });
        
        return Math.round((score / maxScore) * 100);
    }
    
    validateTouchTargets() {
        const touchElements = document.querySelectorAll('button, a, input, .btn, .face-id-3d-container, .feature-card');
        const minTouchSize = 44; // 44px minimum recommended by Apple/Google
        const issues = [];
        
        touchElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(element);
            const padding = parseInt(computedStyle.padding) || 0;
            
            const effectiveWidth = Math.max(rect.width, parseInt(computedStyle.minWidth) || 0);
            const effectiveHeight = Math.max(rect.height, parseInt(computedStyle.minHeight) || 0);
            
            const touchSize = {
                width: effectiveWidth,
                height: effectiveHeight,
                meetsMinimum: effectiveWidth >= minTouchSize && effectiveHeight >= minTouchSize,
                hasProperSpacing: this.checkSpacing(element),
                hasTouchFeedback: this.checkTouchFeedback(element)
            };
            
            if (!touchSize.meetsMinimum) {
                issues.push({
                    element: element.tagName.toLowerCase() + (element.className ? '.' + element.className.split(' ')[0] : ''),
                    issue: `Touch target too small: ${effectiveWidth}x${effectiveHeight}px (minimum: ${minTouchSize}x${minTouchSize}px)`
                });
            }
            
            this.metrics.touchTargets.push(touchSize);
        });
        
        const passedTargets = this.metrics.touchTargets.filter(t => t.meetsMinimum).length;
        const totalTargets = this.metrics.touchTargets.length;
        
        this.metrics.touchTargets = {
            total: totalTargets,
            passed: passedTargets,
            failed: totalTargets - passedTargets,
            score: Math.round((passedTargets / totalTargets) * 100),
            issues
        };
    }
    
    checkSpacing(element) {
        const rect = element.getBoundingClientRect();
        const siblings = Array.from(element.parentNode.children).filter(el => el !== element);
        
        return siblings.every(sibling => {
            const siblingRect = sibling.getBoundingClientRect();
            const distance = Math.min(
                Math.abs(rect.right - siblingRect.left),
                Math.abs(rect.left - siblingRect.right),
                Math.abs(rect.bottom - siblingRect.top),
                Math.abs(rect.top - siblingRect.bottom)
            );
            return distance >= 8; // 8px minimum spacing
        });
    }
    
    checkTouchFeedback(element) {
        const computedStyle = window.getComputedStyle(element);
        const hasTransition = computedStyle.transition !== 'none' && computedStyle.transition !== '';
        const hasHoverState = element.matches(':hover') !== null;
        return hasTransition || hasHoverState;
    }
    
    validatePerformance() {
        const performance = window.performance;
        const navigation = performance.getEntriesByType('navigation')[0];
        
        // Core Web Vitals simulation
        const metrics = {
            domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
            firstPaint: this.getFirstPaint(),
            largestContentfulPaint: this.getLCP(),
            cumulativeLayoutShift: this.getCLS(),
            firstInputDelay: this.getFID()
        };
        
        // Mobile-specific performance checks
        const mobileOptimizations = {
            hasWebGL: this.checkWebGL(),
            hasServiceWorker: 'serviceWorker' in navigator,
            usesWillChange: this.checkWillChange(),
            usesTransform3d: this.checkTransform3d(),
            optimizedImages: this.checkImageOptimization(),
            reducedMotion: this.checkReducedMotion()
        };
        
        this.metrics.performance = {
            ...metrics,
            ...mobileOptimizations,
            score: this.calculatePerformanceScore(metrics, mobileOptimizations)
        };
    }
    
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : 0;
    }
    
    getLCP() {
        // Simplified LCP estimation
        const images = document.querySelectorAll('img');
        const largestElement = document.querySelector('.hero-title') || document.body;
        return largestElement.getBoundingClientRect().width * largestElement.getBoundingClientRect().height;
    }
    
    getCLS() {
        // Simplified CLS check - look for elements that might cause layout shifts
        const dynamicElements = document.querySelectorAll('[style*="transform"], .loading, .placeholder');
        return dynamicElements.length * 0.1; // Rough estimation
    }
    
    getFID() {
        // Can't measure real FID without user interaction, return 0
        return 0;
    }
    
    checkWebGL() {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    }
    
    checkWillChange() {
        const elements = document.querySelectorAll('*');
        return Array.from(elements).some(el => {
            const style = window.getComputedStyle(el);
            return style.willChange !== 'auto';
        });
    }
    
    checkTransform3d() {
        const elements = document.querySelectorAll('*');
        return Array.from(elements).some(el => {
            const style = window.getComputedStyle(el);
            return style.transform.includes('translate3d') || style.transform.includes('translateZ');
        });
    }
    
    checkImageOptimization() {
        const images = document.querySelectorAll('img');
        let optimized = 0;
        
        images.forEach(img => {
            if (img.loading === 'lazy' || img.getAttribute('srcset') || img.src.includes('.webp')) {
                optimized++;
            }
        });
        
        return images.length === 0 ? true : (optimized / images.length) >= 0.8;
    }
    
    checkReducedMotion() {
        return document.querySelector('style').textContent.includes('@media (prefers-reduced-motion: reduce)');
    }
    
    calculatePerformanceScore(metrics, optimizations) {
        let score = 0;
        let maxScore = 0;
        
        // Performance metrics scoring
        if (metrics.domContentLoaded < 1000) score += 20;
        if (metrics.firstPaint < 1500) score += 20;
        maxScore += 40;
        
        // Mobile optimizations scoring
        const optKeys = Object.keys(optimizations);
        optKeys.forEach(key => {
            maxScore += 10;
            if (optimizations[key]) score += 10;
        });
        
        return Math.round((score / maxScore) * 100);
    }
    
    validateAccessibility() {
        const issues = [];
        
        // Check for alt text on images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.alt) {
                issues.push('Image missing alt text');
            }
        });
        
        // Check for proper heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        headings.forEach(heading => {
            const level = parseInt(heading.tagName[1]);
            if (level - previousLevel > 1) {
                issues.push(`Heading level jump: ${heading.tagName} after h${previousLevel}`);
            }
            previousLevel = level;
        });
        
        // Check for keyboard navigation
        const interactiveElements = document.querySelectorAll('a, button, input, .btn, [role="button"]');
        let keyboardAccessible = 0;
        interactiveElements.forEach(el => {
            if (el.tabIndex >= 0 || el.tagName === 'A' || el.tagName === 'BUTTON') {
                keyboardAccessible++;
            }
        });
        
        // Check for proper ARIA labels
        let ariaLabeled = 0;
        interactiveElements.forEach(el => {
            if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.textContent.trim()) {
                ariaLabeled++;
            }
        });
        
        this.metrics.accessibility = {
            keyboardAccessible: Math.round((keyboardAccessible / interactiveElements.length) * 100),
            ariaLabeled: Math.round((ariaLabeled / interactiveElements.length) * 100),
            issues,
            score: Math.round(((keyboardAccessible + ariaLabeled) / (interactiveElements.length * 2)) * 100)
        };
    }
    
    validateResponsiveness() {
        const breakpoints = [320, 480, 768, 1024, 1200];
        const results = {};
        
        breakpoints.forEach(width => {
            // Simulate viewport width (limited simulation)
            const elements = document.querySelectorAll('.hero, .section, .btn');
            let responsive = true;
            
            elements.forEach(el => {
                const styles = window.getComputedStyle(el);
                // Check if element has responsive properties
                if (!styles.maxWidth && !styles.width.includes('%') && !styles.width.includes('clamp')) {
                    responsive = false;
                }
            });
            
            results[width] = responsive;
        });
        
        const passedBreakpoints = Object.values(results).filter(Boolean).length;
        
        this.metrics.responsiveness = {
            breakpoints: results,
            score: Math.round((passedBreakpoints / breakpoints.length) * 100)
        };
    }
    
    generateReport() {
        const overallScore = Math.round(
            (this.metrics.viewport.score + 
             this.metrics.touchTargets.score + 
             this.metrics.performance.score + 
             this.metrics.accessibility.score + 
             this.metrics.responsiveness.score) / 5
        );
        
        const report = {
            overallScore,
            grade: this.getGrade(overallScore),
            timestamp: new Date().toISOString(),
            details: this.metrics,
            recommendations: this.generateRecommendations()
        };
        
        console.group('📱 Mobile Performance Validation Report');
        console.log(`Overall Score: ${overallScore}/100 (${report.grade})`);
        console.log('Viewport:', this.metrics.viewport.score + '/100');
        console.log('Touch Targets:', this.metrics.touchTargets.score + '/100');
        console.log('Performance:', this.metrics.performance.score + '/100');
        console.log('Accessibility:', this.metrics.accessibility.score + '/100');
        console.log('Responsiveness:', this.metrics.responsiveness.score + '/100');
        
        if (report.recommendations.length > 0) {
            console.group('Recommendations:');
            report.recommendations.forEach(rec => console.log('•', rec));
            console.groupEnd();
        }
        
        console.groupEnd();
        
        return report;
    }
    
    getGrade(score) {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        return 'D';
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        if (this.metrics.viewport.score < 80) {
            recommendations.push('Improve viewport configuration with proper meta tags and CSS custom properties');
        }
        
        if (this.metrics.touchTargets.score < 80) {
            recommendations.push('Increase touch target sizes to minimum 44x44px');
        }
        
        if (this.metrics.performance.score < 70) {
            recommendations.push('Optimize performance with hardware acceleration and reduced animations on mobile');
        }
        
        if (this.metrics.accessibility.score < 70) {
            recommendations.push('Improve accessibility with proper ARIA labels and keyboard navigation');
        }
        
        if (this.metrics.responsiveness.score < 80) {
            recommendations.push('Add more responsive design patterns and flexible layouts');
        }
        
        return recommendations;
    }
}

// Auto-run validation after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        const validator = new MobilePerformanceValidator();
        window.mobileValidator = validator;
    }, 1000);
});

// Export for manual testing
window.MobilePerformanceValidator = MobilePerformanceValidator;