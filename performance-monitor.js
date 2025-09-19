/**
 * PERFORMANCE MONITOR - Real-time Core Web Vitals tracking
 * Comprehensive performance monitoring, alerting, and optimization
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = [];
        this.alerts = [];
        this.sessionStartTime = performance.now();
        this.isMonitoring = false;
        this.thresholds = {
            LCP: { excellent: 1200, good: 2500 },
            FID: { excellent: 50, good: 100 },
            CLS: { excellent: 0.05, good: 0.1 },
            FCP: { excellent: 900, good: 1800 },
            INP: { excellent: 100, good: 200 },
            TTFB: { excellent: 200, good: 600 }
        };
        
        this.init();
    }

    init() {
        console.log('📊 Performance Monitor initialized');
        
        // Start monitoring immediately
        this.startMonitoring();
        
        // Setup real-time web vitals tracking
        this.setupWebVitalsTracking();
        
        // Setup resource monitoring
        this.setupResourceMonitoring();
        
        // Setup user experience monitoring
        this.setupUXMonitoring();
        
        // Setup automated reporting
        this.setupAutomatedReporting();
        
        // Create performance dashboard
        this.createPerformanceDashboard();
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        this.isMonitoring = true;
        
        // Mark monitoring start
        performance.mark('monitoring-start');
        
        // Track initial page load metrics
        this.trackPageLoadMetrics();
        
        console.log('🎯 Performance monitoring active');
    }

    // CORE WEB VITALS TRACKING
    setupWebVitalsTracking() {
        if (!('PerformanceObserver' in window)) {
            console.warn('PerformanceObserver not supported');
            return;
        }

        // LCP - Largest Contentful Paint
        this.setupLCPTracking();
        
        // FID - First Input Delay  
        this.setupFIDTracking();
        
        // CLS - Cumulative Layout Shift
        this.setupCLSTracking();
        
        // FCP - First Contentful Paint
        this.setupFCPTracking();
        
        // INP - Interaction to Next Paint
        this.setupINPTracking();
        
        // TTFB - Time to First Byte
        this.setupTTFBTracking();
    }

    setupLCPTracking() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lcp = entries[entries.length - 1];
            
            this.recordMetric('LCP', lcp.startTime);
            
            // Mark LCP element for debugging
            if (lcp.element) {
                lcp.element.dataset.lcpElement = 'true';
                lcp.element.dataset.lcpTime = lcp.startTime.toFixed(2);
            }
            
            // Check if LCP is excellent
            if (lcp.startTime < this.thresholds.LCP.excellent) {
                console.log('🎯 LCP EXCELLENT:', lcp.startTime.toFixed(2) + 'ms');
            } else if (lcp.startTime > this.thresholds.LCP.good) {
                this.alertSlowLCP(lcp);
            }
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(observer);
    }

    setupFIDTracking() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                const fid = entry.processingStart - entry.startTime;
                this.recordMetric('FID', fid);
                
                if (fid < this.thresholds.FID.excellent) {
                    console.log('🎯 FID EXCELLENT:', fid.toFixed(2) + 'ms');
                } else if (fid > this.thresholds.FID.good) {
                    this.alertSlowFID(entry, fid);
                }
            }
        });
        
        observer.observe({ entryTypes: ['first-input'] });
        this.observers.push(observer);
    }

    setupCLSTracking() {
        let clsValue = 0;
        let sessionValue = 0;
        let sessionEntries = [];
        
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    const firstSessionEntry = sessionEntries[0];
                    const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

                    if (sessionValue && 
                        entry.startTime - lastSessionEntry.startTime < 1000 &&
                        entry.startTime - firstSessionEntry.startTime < 5000) {
                        sessionValue += entry.value;
                        sessionEntries.push(entry);
                    } else {
                        sessionValue = entry.value;
                        sessionEntries = [entry];
                    }

                    if (sessionValue > clsValue) {
                        clsValue = sessionValue;
                        this.recordMetric('CLS', clsValue);
                        
                        if (clsValue < this.thresholds.CLS.excellent) {
                            console.log('🎯 CLS EXCELLENT:', clsValue.toFixed(4));
                        } else if (clsValue > this.thresholds.CLS.good) {
                            this.alertLayoutShift(entry, clsValue);
                        }
                    }
                }
            }
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(observer);
    }

    setupFCPTracking() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
            
            if (fcp) {
                this.recordMetric('FCP', fcp.startTime);
                
                if (fcp.startTime < this.thresholds.FCP.excellent) {
                    console.log('🎯 FCP EXCELLENT:', fcp.startTime.toFixed(2) + 'ms');
                } else if (fcp.startTime > this.thresholds.FCP.good) {
                    this.alertSlowFCP(fcp);
                }
            }
        });
        
        observer.observe({ entryTypes: ['paint'] });
        this.observers.push(observer);
    }

    setupINPTracking() {
        // Track Interaction to Next Paint
        let interactionCount = 0;
        const interactions = [];
        
        const trackInteraction = (event) => {
            const startTime = performance.now();
            interactionCount++;
            
            requestAnimationFrame(() => {
                const inp = performance.now() - startTime;
                interactions.push(inp);
                
                // Keep last 10 interactions
                if (interactions.length > 10) {
                    interactions.shift();
                }
                
                const avgINP = interactions.reduce((a, b) => a + b, 0) / interactions.length;
                this.recordMetric('INP', avgINP);
                
                if (avgINP < this.thresholds.INP.excellent) {
                    console.log('🎯 INP EXCELLENT:', avgINP.toFixed(2) + 'ms');
                } else if (avgINP > this.thresholds.INP.good) {
                    this.alertSlowINP(event, avgINP);
                }
            });
        };
        
        ['click', 'keydown', 'touchstart'].forEach(eventType => {
            document.addEventListener(eventType, trackInteraction, { passive: true });
        });
    }

    setupTTFBTracking() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const navEntry = entries[0];
            
            if (navEntry && navEntry.responseStart) {
                const ttfb = navEntry.responseStart - navEntry.requestStart;
                this.recordMetric('TTFB', ttfb);
                
                if (ttfb < this.thresholds.TTFB.excellent) {
                    console.log('🎯 TTFB EXCELLENT:', ttfb.toFixed(2) + 'ms');
                } else if (ttfb > this.thresholds.TTFB.good) {
                    this.alertSlowTTFB(navEntry, ttfb);
                }
            }
        });
        
        observer.observe({ entryTypes: ['navigation'] });
        this.observers.push(observer);
    }

    // RESOURCE MONITORING
    setupResourceMonitoring() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            
            entries.forEach(entry => {
                this.analyzeResourceTiming(entry);
            });
        });
        
        observer.observe({ entryTypes: ['resource'] });
        this.observers.push(observer);
        
        console.log('📦 Resource monitoring active');
    }

    analyzeResourceTiming(entry) {
        const duration = entry.responseEnd - entry.requestStart;
        const size = entry.transferSize || 0;
        const resourceType = this.getResourceType(entry.name);
        
        // Track slow resources
        if (duration > 1000) {
            this.alertSlowResource(entry, duration);
        }
        
        // Track large resources
        if (size > 1000000) { // 1MB
            this.alertLargeResource(entry, size);
        }
        
        // Update resource metrics
        const resourceMetrics = this.metrics.get('resources') || [];
        resourceMetrics.push({
            name: entry.name.substring(entry.name.lastIndexOf('/') + 1, entry.name.lastIndexOf('/') + 21),
            type: resourceType,
            duration: Math.round(duration),
            size: Math.round(size / 1024), // KB
            timestamp: Date.now()
        });
        
        // Keep last 50 resources
        if (resourceMetrics.length > 50) {
            resourceMetrics.shift();
        }
        
        this.metrics.set('resources', resourceMetrics);
    }

    getResourceType(url) {
        if (/\.(css)$/i.test(url)) return 'CSS';
        if (/\.(js)$/i.test(url)) return 'JavaScript';
        if (/\.(png|jpg|jpeg|webp|avif|gif|svg)$/i.test(url)) return 'Image';
        if (/\.(mp4|webm|ogg)$/i.test(url)) return 'Video';
        if (/\.(woff2?|ttf|eot)$/i.test(url)) return 'Font';
        return 'Other';
    }

    // USER EXPERIENCE MONITORING
    setupUXMonitoring() {
        // Track user interactions
        this.trackUserInteractions();
        
        // Monitor frame rate
        this.monitorFrameRate();
        
        // Track memory usage
        this.monitorMemoryUsage();
        
        // Monitor network conditions
        this.monitorNetworkConditions();
        
        console.log('👤 UX monitoring active');
    }

    trackUserInteractions() {
        let clickCount = 0;
        let scrollDepth = 0;
        let timeOnPage = Date.now();
        
        document.addEventListener('click', (e) => {
            clickCount++;
            this.recordMetric('clicks', clickCount);
            
            // Track CTA clicks specifically
            if (e.target.matches('.btn, button, .cta')) {
                this.recordEvent('cta_click', {
                    element: e.target.textContent.trim().substring(0, 20),
                    timestamp: Date.now() - timeOnPage
                });
            }
        });
        
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                const currentScrollDepth = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );
                
                if (currentScrollDepth > scrollDepth) {
                    scrollDepth = currentScrollDepth;
                    this.recordMetric('scrollDepth', scrollDepth);
                }
                
                scrollTimeout = null;
            }, 100);
        }, { passive: true });
        
        // Track time on page
        setInterval(() => {
            const timeSpent = Date.now() - timeOnPage;
            this.recordMetric('timeOnPage', Math.round(timeSpent / 1000));
        }, 5000);
    }

    monitorFrameRate() {
        let frames = 0;
        let lastTime = performance.now();
        
        const measureFPS = (currentTime) => {
            frames++;
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                this.recordMetric('FPS', fps);
                
                if (fps < 30) {
                    this.alertLowFPS(fps);
                }
                
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }

    monitorMemoryUsage() {
        if (!('memory' in performance)) return;
        
        const checkMemory = () => {
            const memory = performance.memory;
            const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
            const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576);
            
            this.recordMetric('memoryUsage', usedMB);
            
            if (usedMB > limitMB * 0.8) {
                this.alertHighMemoryUsage(usedMB, limitMB);
            }
        };
        
        setInterval(checkMemory, 10000);
    }

    monitorNetworkConditions() {
        if (!('connection' in navigator)) return;
        
        const connection = navigator.connection;
        
        this.recordMetric('networkType', connection.effectiveType);
        this.recordMetric('downlink', connection.downlink);
        
        connection.addEventListener('change', () => {
            this.recordMetric('networkType', connection.effectiveType);
            this.recordMetric('downlink', connection.downlink);
            
            if (connection.effectiveType === '2g' || connection.effectiveType === '3g') {
                this.alertSlowConnection(connection);
            }
        });
    }

    // METRIC RECORDING
    recordMetric(name, value) {
        const timestamp = Date.now();
        const metric = {
            value,
            timestamp,
            rating: this.getRating(name, value)
        };
        
        this.metrics.set(name, metric);
        
        // Update dashboard
        this.updateDashboard(name, metric);
        
        // Send to analytics if configured
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_metric', {
                metric_name: name,
                metric_value: typeof value === 'number' ? Math.round(value) : value,
                metric_rating: metric.rating
            });
        }
    }

    recordEvent(name, data) {
        const events = this.metrics.get('events') || [];
        events.push({
            name,
            data,
            timestamp: Date.now()
        });
        
        // Keep last 100 events
        if (events.length > 100) {
            events.shift();
        }
        
        this.metrics.set('events', events);
    }

    getRating(metricName, value) {
        const thresholds = this.thresholds[metricName];
        if (!thresholds) return 'unknown';
        
        if (value < thresholds.excellent) return 'excellent';
        if (value < thresholds.good) return 'good';
        return 'poor';
    }

    // ALERTING SYSTEM
    alertSlowLCP(entry) {
        const alert = {
            type: 'LCP_SLOW',
            message: `LCP slow: ${entry.startTime.toFixed(2)}ms`,
            element: entry.element?.tagName || 'unknown',
            timestamp: Date.now(),
            severity: 'high'
        };
        
        this.addAlert(alert);
        console.warn('🐌 LCP Alert:', alert.message, entry.element);
    }

    alertSlowFID(entry, fid) {
        const alert = {
            type: 'FID_SLOW',
            message: `FID slow: ${fid.toFixed(2)}ms`,
            target: entry.target?.tagName || 'unknown',
            timestamp: Date.now(),
            severity: 'high'
        };
        
        this.addAlert(alert);
        console.warn('🐌 FID Alert:', alert.message);
    }

    alertLayoutShift(entry, cls) {
        const alert = {
            type: 'CLS_HIGH',
            message: `Layout shift: ${cls.toFixed(4)}`,
            sources: entry.sources?.map(s => s.node?.tagName).join(', ') || 'unknown',
            timestamp: Date.now(),
            severity: 'medium'
        };
        
        this.addAlert(alert);
        console.warn('📐 CLS Alert:', alert.message);
    }

    alertSlowResource(entry, duration) {
        const alert = {
            type: 'RESOURCE_SLOW',
            message: `Slow resource: ${duration.toFixed(0)}ms`,
            resource: entry.name.substring(entry.name.lastIndexOf('/') + 1, entry.name.lastIndexOf('/') + 21),
            timestamp: Date.now(),
            severity: 'low'
        };
        
        this.addAlert(alert);
        console.warn('📦 Resource Alert:', alert.message, entry.name);
    }

    alertLargeResource(entry, size) {
        const alert = {
            type: 'RESOURCE_LARGE',
            message: `Large resource: ${Math.round(size / 1024)}KB`,
            resource: entry.name.substring(entry.name.lastIndexOf('/') + 1, entry.name.lastIndexOf('/') + 21),
            timestamp: Date.now(),
            severity: 'medium'
        };
        
        this.addAlert(alert);
        console.warn('📦 Size Alert:', alert.message, entry.name);
    }

    addAlert(alert) {
        this.alerts.push(alert);
        
        // Keep last 50 alerts
        if (this.alerts.length > 50) {
            this.alerts.shift();
        }
        
        // Update dashboard alerts
        this.updateDashboardAlerts();
    }

    // DASHBOARD CREATION
    createPerformanceDashboard() {
        if (document.getElementById('perf-dashboard')) return;
        
        const dashboard = document.createElement('div');
        dashboard.id = 'perf-dashboard';
        dashboard.innerHTML = `
            <div id="perf-toggle" style="position:fixed;top:10px;right:10px;z-index:10000;background:rgba(0,0,0,0.8);color:#fff;padding:8px;border-radius:4px;cursor:pointer;font-size:12px;">
                📊 Performance
            </div>
            <div id="perf-panel" style="position:fixed;top:50px;right:10px;width:300px;max-height:400px;overflow-y:auto;z-index:10000;background:rgba(0,0,0,0.9);color:#fff;padding:15px;border-radius:8px;font-family:monospace;font-size:11px;display:none;">
                <h3 style="margin:0 0 10px;color:#00ff88;">Core Web Vitals</h3>
                <div id="perf-metrics"></div>
                <h3 style="margin:15px 0 10px;color:#ff6b6b;">Alerts</h3>
                <div id="perf-alerts"></div>
            </div>
        `;
        
        document.body.appendChild(dashboard);
        
        // Toggle functionality
        document.getElementById('perf-toggle').addEventListener('click', () => {
            const panel = document.getElementById('perf-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });
        
        console.log('📊 Performance dashboard created');
    }

    updateDashboard(metricName, metric) {
        const metricsDiv = document.getElementById('perf-metrics');
        if (!metricsDiv) return;
        
        const metricElement = document.getElementById(`metric-${metricName}`) || document.createElement('div');
        metricElement.id = `metric-${metricName}`;
        
        const value = typeof metric.value === 'number' ? 
            metric.value.toFixed(metricName === 'CLS' ? 4 : 0) : 
            metric.value;
        
        const color = metric.rating === 'excellent' ? '#00ff88' : 
                     metric.rating === 'good' ? '#ffa500' : '#ff6b6b';
        
        metricElement.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin:3px 0;">
                <span>${metricName}:</span>
                <span style="color:${color}">${value}${metricName.includes('Time') || ['LCP','FID','FCP','TTFB','INP'].includes(metricName) ? 'ms' : metricName === 'CLS' ? '' : metricName === 'memoryUsage' ? 'MB' : ''}</span>
            </div>
        `;
        
        if (!document.getElementById(`metric-${metricName}`)) {
            metricsDiv.appendChild(metricElement);
        }
    }

    updateDashboardAlerts() {
        const alertsDiv = document.getElementById('perf-alerts');
        if (!alertsDiv) return;
        
        const recentAlerts = this.alerts.slice(-5).reverse();
        
        alertsDiv.innerHTML = recentAlerts.map(alert => `
            <div style="margin:3px 0;padding:3px;background:rgba(255,107,107,0.2);border-radius:3px;">
                <div style="font-size:10px;opacity:0.8;">${new Date(alert.timestamp).toLocaleTimeString()}</div>
                <div>${alert.message}</div>
            </div>
        `).join('');
    }

    // AUTOMATED REPORTING
    setupAutomatedReporting() {
        // Send report every 30 seconds
        setInterval(() => {
            this.generateReport();
        }, 30000);
        
        // Send report on page unload
        window.addEventListener('beforeunload', () => {
            this.generateFinalReport();
        });
    }

    generateReport() {
        const report = {
            timestamp: Date.now(),
            sessionDuration: Date.now() - this.sessionStartTime,
            metrics: Object.fromEntries(this.metrics),
            alerts: this.alerts.filter(alert => alert.timestamp > Date.now() - 30000),
            url: window.location.href
        };
        
        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_report', {
                event_category: 'performance',
                custom_map: {
                'custom_parameter_1': 'session_duration'
                },
                session_duration: Math.round(report.sessionDuration / 1000)
            });
        }
        
        console.log('📊 Performance report generated:', report);
        return report;
    }

    generateFinalReport() {
        const finalReport = this.generateReport();
        finalReport.type = 'final';
        finalReport.totalAlerts = this.alerts.length;
        
        // Store in localStorage for debugging
        localStorage.setItem('performance-final-report', JSON.stringify(finalReport));
        
        return finalReport;
    }

    // PUBLIC API
    getMetrics() {
        return Object.fromEntries(this.metrics);
    }

    getAlerts() {
        return this.alerts;
    }

    getScore() {
        const lcpScore = this.getMetricScore('LCP');
        const fidScore = this.getMetricScore('FID');
        const clsScore = this.getMetricScore('CLS');
        
        return Math.round((lcpScore + fidScore + clsScore) / 3);
    }

    getMetricScore(metricName) {
        const metric = this.metrics.get(metricName);
        if (!metric) return 0;
        
        switch (metric.rating) {
            case 'excellent': return 100;
            case 'good': return 75;
            case 'poor': return 25;
            default: return 0;
        }
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.isMonitoring = false;
        
        const dashboard = document.getElementById('perf-dashboard');
        if (dashboard) {
            dashboard.remove();
        }
        
        console.log('📊 Performance monitoring stopped');
    }
}

// Initialize Performance Monitor
const performanceMonitor = new PerformanceMonitor();

// Export for global access
window.PerformanceMonitor = performanceMonitor;

// Debug utilities
window.getPerformanceScore = () => performanceMonitor.getScore();
window.getPerformanceMetrics = () => performanceMonitor.getMetrics();
window.getPerformanceAlerts = () => performanceMonitor.getAlerts();

console.log('📊 Performance Monitor v3.0.0 loaded - Real-time Core Web Vitals tracking active!');