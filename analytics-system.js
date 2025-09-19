/**
 * FacePay Advanced Analytics System
 * Complete analytics integration with Core Web Vitals, user behavior tracking,
 * and performance monitoring for bulletproof production deployment
 */

class FacePayAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.startTime = Date.now();
        this.pageLoadTime = null;
        this.interactions = [];
        this.coreWebVitals = {};
        this.performanceMetrics = {};
        this.userBehavior = {
            scrollDepth: 0,
            timeOnPage: 0,
            clicks: 0,
            videoEngagement: {},
            formInteractions: {}
        };
        
        // Configuration
        this.config = {
            trackingId: 'G-FACEPAY2024', // Replace with actual GA4 tracking ID
            apiEndpoint: '/api/analytics',
            batchSize: 10,
            flushInterval: 30000, // 30 seconds
            enableDebug: false,
            trackScrollDepth: true,
            trackVideoEngagement: true,
            trackFormInteractions: true,
            trackUserTiming: true,
            trackErrors: true,
            trackWebVitals: true
        };
        
        this.eventQueue = [];
        this.initialized = false;
        
        this.init();
    }

    /**
     * Initialize analytics system
     */
    async init() {
        try {
            // Initialize Core Web Vitals monitoring
            await this.initCoreWebVitals();
            
            // Initialize performance monitoring
            this.initPerformanceMonitoring();
            
            // Initialize user behavior tracking
            this.initUserBehaviorTracking();
            
            // Initialize error tracking
            this.initErrorTracking();
            
            // Initialize service worker communication
            this.initServiceWorkerCommunication();
            
            // Start periodic data flushing
            this.startPeriodicFlush();
            
            // Track page load
            this.trackPageLoad();
            
            this.initialized = true;
            this.log('Analytics system initialized');
            
        } catch (error) {
            console.error('Failed to initialize analytics:', error);
        }
    }

    /**
     * Core Web Vitals Monitoring
     */
    async initCoreWebVitals() {
        if (!this.config.trackWebVitals) return;
        
        try {
            // Import web-vitals library dynamically
            const { getCLS, getFID, getFCP, getLCP, getTTFB } = await this.loadWebVitals();
            
            // Largest Contentful Paint
            getLCP((metric) => {
                this.coreWebVitals.lcp = metric;
                this.trackEvent('web_vitals', {
                    metric_name: 'LCP',
                    metric_value: metric.value,
                    metric_rating: this.getMetricRating('LCP', metric.value),
                    metric_delta: metric.delta,
                    metric_id: metric.id
                });
            });
            
            // First Input Delay
            getFID((metric) => {
                this.coreWebVitals.fid = metric;
                this.trackEvent('web_vitals', {
                    metric_name: 'FID',
                    metric_value: metric.value,
                    metric_rating: this.getMetricRating('FID', metric.value),
                    metric_delta: metric.delta,
                    metric_id: metric.id
                });
            });
            
            // Cumulative Layout Shift
            getCLS((metric) => {
                this.coreWebVitals.cls = metric;
                this.trackEvent('web_vitals', {
                    metric_name: 'CLS',
                    metric_value: metric.value,
                    metric_rating: this.getMetricRating('CLS', metric.value),
                    metric_delta: metric.delta,
                    metric_id: metric.id
                });
            });
            
            // First Contentful Paint
            getFCP((metric) => {
                this.coreWebVitals.fcp = metric;
                this.trackEvent('web_vitals', {
                    metric_name: 'FCP',
                    metric_value: metric.value,
                    metric_rating: this.getMetricRating('FCP', metric.value),
                    metric_delta: metric.delta,
                    metric_id: metric.id
                });
            });
            
            // Time to First Byte
            getTTFB((metric) => {
                this.coreWebVitals.ttfb = metric;
                this.trackEvent('web_vitals', {
                    metric_name: 'TTFB',
                    metric_value: metric.value,
                    metric_rating: this.getMetricRating('TTFB', metric.value),
                    metric_delta: metric.delta,
                    metric_id: metric.id
                });
            });
            
        } catch (error) {
            console.warn('Failed to load web-vitals library:', error);
        }
    }

    /**
     * Performance Monitoring
     */
    initPerformanceMonitoring() {
        // Monitor performance entries
        if ('PerformanceObserver' in window) {
            // Navigation timing
            const navObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    this.performanceMetrics.navigation = {
                        dns: entry.domainLookupEnd - entry.domainLookupStart,
                        connect: entry.connectEnd - entry.connectStart,
                        request: entry.responseStart - entry.requestStart,
                        response: entry.responseEnd - entry.responseStart,
                        dom: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
                        load: entry.loadEventEnd - entry.loadEventStart,
                        total: entry.loadEventEnd - entry.navigationStart
                    };
                    
                    this.trackEvent('performance_navigation', this.performanceMetrics.navigation);
                });
            });
            
            try {
                navObserver.observe({ entryTypes: ['navigation'] });
            } catch (error) {
                this.log('Navigation observer not supported');
            }
            
            // Resource timing
            const resourceObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 1000) { // Track slow resources (>1s)
                        this.trackEvent('performance_resource', {
                            name: entry.name,
                            type: this.getResourceType(entry.name),
                            duration: Math.round(entry.duration),
                            size: entry.transferSize || 0,
                            cached: entry.transferSize === 0 && entry.decodedBodySize > 0
                        });
                    }
                });
            });
            
            try {
                resourceObserver.observe({ entryTypes: ['resource'] });
            } catch (error) {
                this.log('Resource observer not supported');
            }
            
            // Long tasks
            const longTaskObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    this.trackEvent('performance_long_task', {
                        duration: Math.round(entry.duration),
                        start_time: Math.round(entry.startTime),
                        attribution: entry.attribution ? entry.attribution.map(attr => attr.name) : []
                    });
                });
            });
            
            try {
                longTaskObserver.observe({ entryTypes: ['longtask'] });
            } catch (error) {
                this.log('Long task observer not supported');
            }
        }
        
        // Custom performance metrics
        this.trackCustomPerformance();
    }

    /**
     * User Behavior Tracking
     */
    initUserBehaviorTracking() {
        // Scroll depth tracking
        if (this.config.trackScrollDepth) {
            let lastScrollDepth = 0;
            const scrollHandler = this.throttle(() => {
                const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                
                if (scrollDepth > lastScrollDepth && scrollDepth % 25 === 0) {
                    this.userBehavior.scrollDepth = Math.max(this.userBehavior.scrollDepth, scrollDepth);
                    this.trackEvent('scroll_depth', {
                        depth: scrollDepth,
                        page_height: document.body.scrollHeight,
                        viewport_height: window.innerHeight
                    });
                    lastScrollDepth = scrollDepth;
                }
            }, 250);
            
            window.addEventListener('scroll', scrollHandler, { passive: true });
        }
        
        // Click tracking
        document.addEventListener('click', (event) => {
            this.userBehavior.clicks++;
            
            const element = event.target.closest('a, button, [data-track]');
            if (element) {
                const elementInfo = this.getElementInfo(element);
                this.trackEvent('click', {
                    element_type: element.tagName.toLowerCase(),
                    element_text: element.textContent?.trim().substring(0, 50) || '',
                    element_id: element.id || '',
                    element_class: element.className || '',
                    element_href: element.href || '',
                    ...elementInfo
                });
            }
        });
        
        // Video engagement tracking
        if (this.config.trackVideoEngagement) {
            this.initVideoTracking();
        }
        
        // Form interaction tracking
        if (this.config.trackFormInteractions) {
            this.initFormTracking();
        }
        
        // Time on page
        this.startTimeTracking();
    }

    /**
     * Video Engagement Tracking
     */
    initVideoTracking() {
        document.querySelectorAll('video').forEach((video, index) => {
            const videoId = video.id || `video_${index}`;
            this.userBehavior.videoEngagement[videoId] = {
                played: false,
                paused: false,
                completed: false,
                currentTime: 0,
                duration: 0,
                playCount: 0,
                pauseCount: 0
            };
            
            const engagement = this.userBehavior.videoEngagement[videoId];
            
            video.addEventListener('loadedmetadata', () => {
                engagement.duration = video.duration;
            });
            
            video.addEventListener('play', () => {
                engagement.played = true;
                engagement.playCount++;
                this.trackEvent('video_play', {
                    video_id: videoId,
                    current_time: video.currentTime,
                    duration: video.duration,
                    play_count: engagement.playCount
                });
            });
            
            video.addEventListener('pause', () => {
                engagement.paused = true;
                engagement.pauseCount++;
                engagement.currentTime = video.currentTime;
                this.trackEvent('video_pause', {
                    video_id: videoId,
                    current_time: video.currentTime,
                    duration: video.duration,
                    progress: Math.round((video.currentTime / video.duration) * 100)
                });
            });
            
            video.addEventListener('ended', () => {
                engagement.completed = true;
                this.trackEvent('video_complete', {
                    video_id: videoId,
                    duration: video.duration,
                    play_count: engagement.playCount,
                    pause_count: engagement.pauseCount
                });
            });
            
            // Track video progress at 25%, 50%, 75%
            const progressPoints = [25, 50, 75];
            const trackedPoints = new Set();
            
            video.addEventListener('timeupdate', () => {
                if (video.duration > 0) {
                    const progress = Math.round((video.currentTime / video.duration) * 100);
                    
                    progressPoints.forEach(point => {
                        if (progress >= point && !trackedPoints.has(point)) {
                            trackedPoints.add(point);
                            this.trackEvent('video_progress', {
                                video_id: videoId,
                                progress: point,
                                current_time: video.currentTime,
                                duration: video.duration
                            });
                        }
                    });
                }
            });
        });
    }

    /**
     * Error Tracking
     */
    initErrorTracking() {
        if (!this.config.trackErrors) return;
        
        // JavaScript errors
        window.addEventListener('error', (event) => {
            this.trackEvent('javascript_error', {
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack || '',
                user_agent: navigator.userAgent,
                url: window.location.href
            });
        });
        
        // Promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.trackEvent('promise_rejection', {
                reason: event.reason?.toString() || 'Unknown',
                stack: event.reason?.stack || '',
                url: window.location.href
            });
        });
        
        // Resource loading errors
        document.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.trackEvent('resource_error', {
                    element: event.target.tagName.toLowerCase(),
                    source: event.target.src || event.target.href || '',
                    url: window.location.href
                });
            }
        }, true);
    }

    /**
     * Track Events
     */
    trackEvent(eventName, parameters = {}) {
        const event = {
            event_name: eventName,
            timestamp: Date.now(),
            session_id: this.sessionId,
            user_id: this.userId,
            page_url: window.location.href,
            page_title: document.title,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            connection_type: navigator.connection?.effectiveType || 'unknown',
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            ...parameters
        };
        
        this.eventQueue.push(event);
        this.log('Event tracked:', eventName, parameters);
        
        // Flush immediately for critical events
        if (['javascript_error', 'promise_rejection', 'web_vitals'].includes(eventName)) {
            this.flush();
        }
        
        // Flush when queue reaches batch size
        if (this.eventQueue.length >= this.config.batchSize) {
            this.flush();
        }
    }

    /**
     * Track Page Load
     */
    trackPageLoad() {
        window.addEventListener('load', () => {
            this.pageLoadTime = Date.now() - this.startTime;
            
            const navigationTiming = performance.getEntriesByType('navigation')[0];
            const paintTiming = performance.getEntriesByType('paint');
            
            this.trackEvent('page_load', {
                load_time: this.pageLoadTime,
                dom_content_loaded: navigationTiming?.domContentLoadedEventEnd - navigationTiming?.navigationStart || 0,
                first_paint: paintTiming.find(p => p.name === 'first-paint')?.startTime || 0,
                first_contentful_paint: paintTiming.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
                page_size: this.getPageSize(),
                resource_count: performance.getEntriesByType('resource').length
            });
        });
    }

    /**
     * Flush Events to Server
     */
    async flush() {
        if (this.eventQueue.length === 0) return;
        
        const events = [...this.eventQueue];
        this.eventQueue = [];
        
        try {
            // Send to analytics API
            await this.sendToAPI(events);
            
            // Send to Google Analytics 4 (if configured)
            this.sendToGA4(events);
            
            this.log(`Flushed ${events.length} events`);
            
        } catch (error) {
            console.error('Failed to flush analytics events:', error);
            // Re-add events to queue for retry
            this.eventQueue.unshift(...events);
        }
    }

    /**
     * Send to Analytics API
     */
    async sendToAPI(events) {
        if (!this.config.apiEndpoint) return;
        
        const payload = {
            session_id: this.sessionId,
            user_id: this.userId,
            events: events,
            metadata: {
                sdk_version: '2.1.0',
                timestamp: Date.now(),
                page_load_time: this.pageLoadTime,
                core_web_vitals: this.coreWebVitals,
                user_behavior: this.userBehavior
            }
        };
        
        const response = await fetch(this.config.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`Analytics API error: ${response.status}`);
        }
    }

    /**
     * Send to Google Analytics 4
     */
    sendToGA4(events) {
        if (!this.config.trackingId || !window.gtag) return;
        
        events.forEach(event => {
            try {
                window.gtag('event', event.event_name, {
                    event_category: this.getEventCategory(event.event_name),
                    event_label: event.page_url,
                    session_id: event.session_id,
                    user_id: event.user_id,
                    custom_parameters: event
                });
            } catch (error) {
                this.log('GA4 tracking error:', error);
            }
        });
    }

    /**
     * Service Worker Communication
     */
    initServiceWorkerCommunication() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'PERFORMANCE_METRICS') {
                    this.trackEvent('service_worker_metrics', event.data.metrics);
                }
                
                if (event.data.type === 'DOWNLOAD_PROGRESS') {
                    this.trackEvent('download_progress', {
                        url: event.data.url,
                        percentage: event.data.percentage,
                        received: event.data.received,
                        total: event.data.total
                    });
                }
            });
        }
    }

    /**
     * Utility Functions
     */
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getUserId() {
        let userId = localStorage.getItem('facepay_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('facepay_user_id', userId);
        }
        return userId;
    }
    
    async loadWebVitals() {
        // Load web-vitals library dynamically
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/web-vitals@3.5.0/dist/web-vitals.attribution.iife.js';
        document.head.appendChild(script);
        
        return new Promise((resolve) => {
            script.onload = () => {
                resolve(window.webVitals);
            };
        });
    }
    
    getMetricRating(metricName, value) {
        const thresholds = {
            LCP: { good: 2500, poor: 4000 },
            FID: { good: 100, poor: 300 },
            CLS: { good: 0.1, poor: 0.25 },
            FCP: { good: 1800, poor: 3000 },
            TTFB: { good: 800, poor: 1800 }
        };
        
        const threshold = thresholds[metricName];
        if (!threshold) return 'unknown';
        
        if (value <= threshold.good) return 'good';
        if (value <= threshold.poor) return 'needs-improvement';
        return 'poor';
    }
    
    getResourceType(url) {
        if (url.match(/\.(js)$/)) return 'script';
        if (url.match(/\.(css)$/)) return 'stylesheet';
        if (url.match(/\.(png|jpg|jpeg|gif|webp|avif|svg)$/)) return 'image';
        if (url.match(/\.(mp4|webm|ogg|mov)$/)) return 'video';
        if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';
        return 'other';
    }
    
    getElementInfo(element) {
        const rect = element.getBoundingClientRect();
        return {
            element_position: {
                x: Math.round(rect.left),
                y: Math.round(rect.top),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
            },
            viewport_position: {
                x: Math.round(rect.left + window.scrollX),
                y: Math.round(rect.top + window.scrollY)
            }
        };
    }
    
    getEventCategory(eventName) {
        const categories = {
            page_load: 'Performance',
            web_vitals: 'Performance',
            performance_navigation: 'Performance',
            performance_resource: 'Performance',
            performance_long_task: 'Performance',
            click: 'Engagement',
            scroll_depth: 'Engagement',
            video_play: 'Video',
            video_pause: 'Video',
            video_complete: 'Video',
            video_progress: 'Video',
            javascript_error: 'Error',
            promise_rejection: 'Error',
            resource_error: 'Error'
        };
        
        return categories[eventName] || 'Other';
    }
    
    getPageSize() {
        const resources = performance.getEntriesByType('resource');
        return resources.reduce((total, resource) => {
            return total + (resource.transferSize || 0);
        }, 0);
    }
    
    startTimeTracking() {
        setInterval(() => {
            this.userBehavior.timeOnPage = Date.now() - this.startTime;
        }, 1000);
    }
    
    startPeriodicFlush() {
        setInterval(() => {
            if (this.eventQueue.length > 0) {
                this.flush();
            }
        }, this.config.flushInterval);
    }
    
    trackCustomPerformance() {
        // Track Time to Interactive (TTI) approximation
        let ttiTimeout;
        const checkTTI = () => {
            if (performance.now() > 5000) { // After 5 seconds
                this.trackEvent('time_to_interactive_estimate', {
                    value: Math.round(performance.now()),
                    method: 'timeout_approximation'
                });
                clearTimeout(ttiTimeout);
            }
        };
        
        ttiTimeout = setTimeout(checkTTI, 5000);
        
        // Track First Input Delay manually for older browsers
        let isFirstInput = true;
        ['mousedown', 'keydown', 'touchstart', 'pointerdown'].forEach(type => {
            document.addEventListener(type, (event) => {
                if (isFirstInput) {
                    const fidStart = performance.now();
                    requestIdleCallback(() => {
                        const fid = performance.now() - fidStart;
                        this.trackEvent('first_input_delay_manual', {
                            value: Math.round(fid),
                            input_type: event.type
                        });
                    });
                    isFirstInput = false;
                }
            }, { once: true, passive: true });
        });
    }
    
    initFormTracking() {
        document.querySelectorAll('form').forEach((form, index) => {
            const formId = form.id || `form_${index}`;
            this.userBehavior.formInteractions[formId] = {
                started: false,
                completed: false,
                fields: {}
            };
            
            form.addEventListener('focusin', (event) => {
                if (event.target.matches('input, textarea, select')) {
                    this.userBehavior.formInteractions[formId].started = true;
                    this.trackEvent('form_start', {
                        form_id: formId,
                        field_name: event.target.name || '',
                        field_type: event.target.type || event.target.tagName.toLowerCase()
                    });
                }
            });
            
            form.addEventListener('submit', (event) => {
                this.userBehavior.formInteractions[formId].completed = true;
                this.trackEvent('form_submit', {
                    form_id: formId,
                    form_fields: Object.keys(this.userBehavior.formInteractions[formId].fields).length
                });
            });
        });
    }
    
    throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    log(...args) {
        if (this.config.enableDebug) {
            console.log('[FacePay Analytics]', ...args);
        }
    }
    
    // Public API methods
    
    /**
     * Track custom event
     */
    track(eventName, parameters = {}) {
        this.trackEvent(eventName, parameters);
    }
    
    /**
     * Set user properties
     */
    setUser(userId, properties = {}) {
        this.userId = userId;
        localStorage.setItem('facepay_user_id', userId);
        
        this.trackEvent('user_identify', {
            user_id: userId,
            ...properties
        });
    }
    
    /**
     * Get analytics summary
     */
    getSummary() {
        return {
            sessionId: this.sessionId,
            userId: this.userId,
            timeOnPage: this.userBehavior.timeOnPage,
            pageLoadTime: this.pageLoadTime,
            coreWebVitals: this.coreWebVitals,
            userBehavior: this.userBehavior,
            eventsQueued: this.eventQueue.length
        };
    }
}

// Initialize analytics system
let facePayAnalytics;

// Auto-initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        facePayAnalytics = new FacePayAnalytics();
    });
} else {
    facePayAnalytics = new FacePayAnalytics();
}

// Export for global access
window.facePayAnalytics = facePayAnalytics;

// Integrate with Google Analytics 4
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-FACEPAY2024', {
    send_page_view: false,  // We'll handle this manually
    custom_map: {
        custom_session_id: 'session_id',
        custom_user_id: 'user_id'
    }
});

// Load Google Analytics 4
const gaScript = document.createElement('script');
gaScript.async = true;
gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-FACEPAY2024';
document.head.appendChild(gaScript);

console.log('🎯 FacePay Analytics System loaded successfully');