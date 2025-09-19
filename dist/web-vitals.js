// Web Vitals Monitoring for FacePay Landing Page
// This script measures and reports Core Web Vitals metrics

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        enableLogging: true,
        enableAnalytics: true,
        analyticsEndpoint: '/api/analytics/web-vitals',
        thresholds: {
            LCP: { good: 2500, needsImprovement: 4000 },
            FID: { good: 100, needsImprovement: 300 },
            CLS: { good: 0.1, needsImprovement: 0.25 },
            TTFB: { good: 800, needsImprovement: 1800 },
            FCP: { good: 1800, needsImprovement: 3000 },
            INP: { good: 200, needsImprovement: 500 }
        }
    };

    // Metrics storage
    const metrics = {};

    // Utility functions
    function log(message, data = {}) {
        if (CONFIG.enableLogging) {
            console.log(`[Web Vitals] ${message}`, data);
        }
    }

    function getMetricRating(name, value) {
        const threshold = CONFIG.thresholds[name];
        if (!threshold) return 'unknown';
        
        if (value <= threshold.good) return 'good';
        if (value <= threshold.needsImprovement) return 'needs-improvement';
        return 'poor';
    }

    function sendToAnalytics(metric) {
        if (!CONFIG.enableAnalytics) return;

        const data = {
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            entries: metric.entries?.map(entry => ({
                name: entry.name,
                startTime: entry.startTime,
                duration: entry.duration
            })),
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            connectionType: navigator.connection?.effectiveType,
            deviceMemory: navigator.deviceMemory
        };

        // Send to analytics endpoint
        if (navigator.sendBeacon) {
            navigator.sendBeacon(CONFIG.analyticsEndpoint, JSON.stringify(data));
        } else {
            fetch(CONFIG.analyticsEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                keepalive: true
            }).catch(err => console.warn('Analytics failed:', err));
        }

        // Send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
                event_category: 'Performance',
                event_label: metric.name,
                value: Math.round(metric.value),
                custom_map: { metric_rating: metric.rating }
            });
        }
    }

    // Metric handlers
    function handleLCP(metric) {
        metric.rating = getMetricRating('LCP', metric.value);
        metrics.LCP = metric;
        log(`Largest Contentful Paint: ${metric.value}ms (${metric.rating})`);
        sendToAnalytics(metric);
    }

    function handleFID(metric) {
        metric.rating = getMetricRating('FID', metric.value);
        metrics.FID = metric;
        log(`First Input Delay: ${metric.value}ms (${metric.rating})`);
        sendToAnalytics(metric);
    }

    function handleCLS(metric) {
        metric.rating = getMetricRating('CLS', metric.value);
        metrics.CLS = metric;
        log(`Cumulative Layout Shift: ${metric.value} (${metric.rating})`);
        sendToAnalytics(metric);
    }

    function handleFCP(metric) {
        metric.rating = getMetricRating('FCP', metric.value);
        metrics.FCP = metric;
        log(`First Contentful Paint: ${metric.value}ms (${metric.rating})`);
        sendToAnalytics(metric);
    }

    function handleTTFB(metric) {
        metric.rating = getMetricRating('TTFB', metric.value);
        metrics.TTFB = metric;
        log(`Time to First Byte: ${metric.value}ms (${metric.rating})`);
        sendToAnalytics(metric);
    }

    function handleINP(metric) {
        metric.rating = getMetricRating('INP', metric.value);
        metrics.INP = metric;
        log(`Interaction to Next Paint: ${metric.value}ms (${metric.rating})`);
        sendToAnalytics(metric);
    }

    // Custom metrics
    function measureCustomMetrics() {
        // Time to Interactive (custom implementation)
        if ('PerformanceLongTaskTiming' in window) {
            const observer = new PerformanceObserver((list) => {
                const longTasks = list.getEntries();
                if (longTasks.length > 0) {
                    log('Long tasks detected:', longTasks.length);
                }
            });
            observer.observe({ entryTypes: ['longtask'] });
        }

        // Resource loading times
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const resources = performance.getEntriesByType('resource');
            
            log('Navigation timing:', {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                load: navigation.loadEventEnd - navigation.loadEventStart,
                totalTime: navigation.loadEventEnd - navigation.fetchStart
            });

            // Categorize resources
            const resourcesByType = {};
            resources.forEach(resource => {
                const type = getResourceType(resource.name);
                if (!resourcesByType[type]) resourcesByType[type] = [];
                resourcesByType[type].push({
                    name: resource.name,
                    duration: resource.duration,
                    size: resource.transferSize || 0
                });
            });

            log('Resources by type:', resourcesByType);
        });
    }

    function getResourceType(url) {
        if (url.includes('.css')) return 'css';
        if (url.includes('.js')) return 'js';
        if (/\.(png|jpg|jpeg|gif|webp|svg)/.test(url)) return 'image';
        if (/\.(mp4|webm|mov)/.test(url)) return 'video';
        if (url.includes('font')) return 'font';
        return 'other';
    }

    // Initialize Web Vitals measurement
    function initWebVitals() {
        // Check if we can use the web-vitals library
        if (typeof webVitals !== 'undefined') {
            // Use web-vitals library if available
            webVitals.getLCP(handleLCP);
            webVitals.getFID(handleFID);
            webVitals.getCLS(handleCLS);
            webVitals.getFCP(handleFCP);
            webVitals.getTTFB(handleTTFB);
            if (webVitals.getINP) {
                webVitals.getINP(handleINP);
            }
        } else {
            // Fallback to manual measurement
            measureWithPerformanceObserver();
        }

        measureCustomMetrics();
    }

    function measureWithPerformanceObserver() {
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    if (lastEntry) {
                        handleLCP({
                            name: 'LCP',
                            value: lastEntry.startTime,
                            entries: entries
                        });
                    }
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                log('LCP measurement not supported');
            }

            // First Input Delay
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        handleFID({
                            name: 'FID',
                            value: entry.processingStart - entry.startTime,
                            entries: [entry]
                        });
                    }
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                log('FID measurement not supported');
            }

            // Cumulative Layout Shift
            try {
                let clsValue = 0;
                let clsEntries = [];
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                            clsEntries.push(entry);
                        }
                    }
                    handleCLS({
                        name: 'CLS',
                        value: clsValue,
                        entries: clsEntries
                    });
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                log('CLS measurement not supported');
            }

            // First Contentful Paint
            try {
                const fcpObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            handleFCP({
                                name: 'FCP',
                                value: entry.startTime,
                                entries: [entry]
                            });
                        }
                    }
                });
                fcpObserver.observe({ entryTypes: ['paint'] });
            } catch (e) {
                log('FCP measurement not supported');
            }
        }

        // Time to First Byte (from Navigation Timing)
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                handleTTFB({
                    name: 'TTFB',
                    value: navigation.responseStart - navigation.requestStart,
                    entries: [navigation]
                });
            }
        });
    }

    // Page visibility change handler
    function handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            // Send final metrics when page becomes hidden
            log('Page hidden, sending final metrics:', metrics);
            
            // Report page session duration
            const sessionDuration = performance.now();
            sendToAnalytics({
                name: 'session_duration',
                value: sessionDuration,
                rating: sessionDuration > 30000 ? 'good' : 'poor'
            });
        }
    }

    // Error tracking for performance issues
    function trackPerformanceErrors() {
        window.addEventListener('error', (event) => {
            log('JavaScript error:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            log('Unhandled promise rejection:', event.reason);
        });
    }

    // Initialize everything
    function init() {
        log('Initializing Web Vitals monitoring...');
        
        initWebVitals();
        trackPerformanceErrors();
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Report device and connection info
        log('Device info:', {
            userAgent: navigator.userAgent,
            deviceMemory: navigator.deviceMemory,
            hardwareConcurrency: navigator.hardwareConcurrency,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : 'unknown'
        });
    }

    // Export for external access
    window.WebVitalsMonitor = {
        getMetrics: () => metrics,
        getMetricRating,
        sendToAnalytics
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();