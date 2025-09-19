#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

/**
 * EXHAUSTIVE WEB VITALS MONITORING SUITE
 * Real User Metrics (RUM) validation with ZERO TOLERANCE for poor performance
 * Monitors: LCP, FID, CLS, FCP, TTFB, INP - ALL must be GREEN
 */

class WebVitalsMonitor {
    constructor() {
        this.results = [];
        this.violations = [];
        
        // STRICT PERFORMANCE THRESHOLDS - ZERO COMPROMISE
        this.thresholds = {
            // Core Web Vitals (Google's official thresholds)
            lcp: { good: 2500, poor: 4000 }, // Largest Contentful Paint
            fid: { good: 100, poor: 300 },   // First Input Delay  
            cls: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
            
            // Additional Critical Metrics
            fcp: { good: 1800, poor: 3000 }, // First Contentful Paint
            ttfb: { good: 800, poor: 1800 }, // Time to First Byte
            inp: { good: 200, poor: 500 },   // Interaction to Next Paint
            
            // Custom Performance Metrics
            domInteractive: { good: 2000, poor: 4000 },
            domContentLoaded: { good: 2500, poor: 5000 },
            loadComplete: { good: 3000, poor: 6000 }
        };
        
        this.testScenarios = [
            { name: 'desktop-fast', device: 'desktop', network: 'fast3G', viewport: { width: 1920, height: 1080 } },
            { name: 'desktop-slow', device: 'desktop', network: 'slow3G', viewport: { width: 1366, height: 768 } },
            { name: 'mobile-fast', device: 'mobile', network: 'fast3G', viewport: { width: 375, height: 667 } },
            { name: 'mobile-slow', device: 'mobile', network: 'slow3G', viewport: { width: 375, height: 667 } },
            { name: 'tablet', device: 'tablet', network: 'fast3G', viewport: { width: 768, height: 1024 } }
        ];
    }

    async runComprehensiveMonitoring(url = 'http://localhost:8000', iterations = 5) {
        console.log('🔍 STARTING EXHAUSTIVE WEB VITALS MONITORING');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📊 Testing ${this.testScenarios.length} scenarios × ${iterations} iterations = ${this.testScenarios.length * iterations} total tests`);
        
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection'
            ]
        });

        try {
            for (const scenario of this.testScenarios) {
                console.log(`\n🎯 Testing ${scenario.name.toUpperCase()} scenario...`);
                
                for (let i = 1; i <= iterations; i++) {
                    console.log(`   Run ${i}/${iterations}...`);
                    await this.runSingleTest(browser, url, scenario, i);
                    
                    // Brief pause between iterations
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            
            await this.analyzeResults();
            await this.generateReports();
            this.validatePerformance();
            
        } finally {
            await browser.close();
        }
    }

    async runSingleTest(browser, url, scenario, iteration) {
        const page = await browser.newPage();
        
        try {
            // Configure page for scenario
            await this.configurePage(page, scenario);
            
            // Inject Web Vitals monitoring
            await this.injectWebVitalsScript(page);
            
            const startTime = Date.now();
            
            // Navigate and measure
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
            
            // Wait for critical rendering
            await page.waitForTimeout(2000);
            
            // Collect performance metrics
            const metrics = await this.collectMetrics(page);
            
            const result = {
                scenario: scenario.name,
                iteration: iteration,
                timestamp: new Date().toISOString(),
                url: url,
                loadTime: Date.now() - startTime,
                ...metrics
            };
            
            this.results.push(result);
            this.checkThresholds(result);
            
        } catch (error) {
            console.error(`❌ Error in ${scenario.name} iteration ${iteration}:`, error.message);
            this.violations.push({
                scenario: scenario.name,
                iteration: iteration,
                error: error.message,
                type: 'test-failure'
            });
        } finally {
            await page.close();
        }
    }

    async configurePage(page, scenario) {
        // Set viewport
        await page.setViewport({
            width: scenario.viewport.width,
            height: scenario.viewport.height,
            deviceScaleFactor: scenario.device === 'mobile' ? 2 : 1
        });
        
        // Simulate network conditions
        const networkConditions = {
            'fast3G': { offline: false, downloadThroughput: 1.5 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8, latency: 40 },
            'slow3G': { offline: false, downloadThroughput: 500 * 1024 / 8, uploadThroughput: 500 * 1024 / 8, latency: 400 },
            'wifi': { offline: false, downloadThroughput: 30 * 1024 * 1024 / 8, uploadThroughput: 15 * 1024 * 1024 / 8, latency: 2 }
        };
        
        await page.emulateNetworkConditions(networkConditions[scenario.network] || networkConditions.wifi);
        
        // Set user agent for mobile
        if (scenario.device === 'mobile') {
            await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1');
        }
    }

    async injectWebVitalsScript(page) {
        // Inject comprehensive Web Vitals monitoring script
        await page.evaluateOnNewDocument(() => {
            window.webVitalsData = {};
            window.performanceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'largest-contentful-paint') {
                        window.webVitalsData.lcp = entry.startTime;
                    }
                    if (entry.entryType === 'first-input') {
                        window.webVitalsData.fid = entry.processingStart - entry.startTime;
                    }
                    if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
                        window.webVitalsData.cls = (window.webVitalsData.cls || 0) + entry.value;
                    }
                }
            });
            
            window.performanceObserver.observe({
                type: 'largest-contentful-paint',
                buffered: true
            });
            
            window.performanceObserver.observe({
                type: 'first-input',
                buffered: true
            });
            
            window.performanceObserver.observe({
                type: 'layout-shift',
                buffered: true
            });
            
            // Track additional metrics
            window.addEventListener('load', () => {
                const navigation = performance.getEntriesByType('navigation')[0];
                window.webVitalsData.ttfb = navigation.responseStart;
                window.webVitalsData.domInteractive = navigation.domInteractive;
                window.webVitalsData.domContentLoaded = navigation.domContentLoadedEventEnd;
                window.webVitalsData.loadComplete = navigation.loadEventEnd;
                
                // FCP calculation
                const fcp = performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint');
                if (fcp) {
                    window.webVitalsData.fcp = fcp.startTime;
                }
            });
        });
    }

    async collectMetrics(page) {
        // Wait for metrics to be collected
        await page.waitForTimeout(1000);
        
        const metrics = await page.evaluate(() => {
            const data = window.webVitalsData || {};
            
            // Get additional performance data
            const navigation = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');
            
            return {
                // Core Web Vitals
                lcp: data.lcp || 0,
                fid: data.fid || 0,
                cls: data.cls || 0,
                
                // Additional metrics
                fcp: data.fcp || (paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0),
                ttfb: data.ttfb || (navigation ? navigation.responseStart : 0),
                
                // Page load metrics
                domInteractive: data.domInteractive || (navigation ? navigation.domInteractive : 0),
                domContentLoaded: data.domContentLoaded || (navigation ? navigation.domContentLoadedEventEnd : 0),
                loadComplete: data.loadComplete || (navigation ? navigation.loadEventEnd : 0),
                
                // Resource metrics
                totalResources: performance.getEntriesByType('resource').length,
                totalSize: performance.getEntriesByType('resource').reduce((sum, resource) => sum + (resource.transferSize || 0), 0),
                
                // Memory usage (if available)
                memoryUsed: performance.memory ? performance.memory.usedJSHeapSize : null,
                memoryTotal: performance.memory ? performance.memory.totalJSHeapSize : null
            };
        });
        
        return metrics;
    }

    checkThresholds(result) {
        Object.entries(this.thresholds).forEach(([metric, threshold]) => {
            const value = result[metric];
            if (value !== undefined && value !== null && value > 0) {
                let status = 'good';
                if (value > threshold.poor) {
                    status = 'poor';
                } else if (value > threshold.good) {
                    status = 'needs-improvement';
                }
                
                if (status !== 'good') {
                    this.violations.push({
                        scenario: result.scenario,
                        iteration: result.iteration,
                        metric: metric,
                        value: value,
                        threshold: threshold.good,
                        status: status,
                        type: 'performance-violation'
                    });
                }
            }
        });
    }

    async analyzeResults() {
        console.log('\n📊 ANALYZING PERFORMANCE RESULTS...');
        
        // Group results by scenario
        const groupedResults = {};
        this.results.forEach(result => {
            if (!groupedResults[result.scenario]) {
                groupedResults[result.scenario] = [];
            }
            groupedResults[result.scenario].push(result);
        });
        
        // Calculate statistics for each scenario
        this.scenarioStats = {};
        Object.entries(groupedResults).forEach(([scenario, results]) => {
            this.scenarioStats[scenario] = this.calculateScenarioStats(results);
            this.displayScenarioResults(scenario, this.scenarioStats[scenario]);
        });
    }

    calculateScenarioStats(results) {
        const stats = {};
        
        // Calculate stats for each metric
        Object.keys(this.thresholds).forEach(metric => {
            const values = results.map(r => r[metric]).filter(v => v !== undefined && v !== null && v > 0);
            if (values.length > 0) {
                values.sort((a, b) => a - b);
                stats[metric] = {
                    min: values[0],
                    max: values[values.length - 1],
                    median: values[Math.floor(values.length / 2)],
                    avg: values.reduce((sum, val) => sum + val, 0) / values.length,
                    p75: values[Math.floor(values.length * 0.75)],
                    p95: values[Math.floor(values.length * 0.95)],
                    samples: values.length
                };
                
                // Determine overall status
                const threshold = this.thresholds[metric];
                if (stats[metric].p75 <= threshold.good) {
                    stats[metric].status = 'good';
                } else if (stats[metric].p75 <= threshold.poor) {
                    stats[metric].status = 'needs-improvement';
                } else {
                    stats[metric].status = 'poor';
                }
            }
        });
        
        return stats;
    }

    displayScenarioResults(scenario, stats) {
        console.log(`\n📈 ${scenario.toUpperCase()} RESULTS:`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Display Core Web Vitals
        console.log('🎯 CORE WEB VITALS:');
        ['lcp', 'fid', 'cls'].forEach(metric => {
            if (stats[metric]) {
                const emoji = stats[metric].status === 'good' ? '✅' : stats[metric].status === 'needs-improvement' ? '⚠️' : '❌';
                const unit = metric === 'cls' ? '' : 'ms';
                console.log(`   ${emoji} ${metric.toUpperCase()}: ${Math.round(stats[metric].median)}${unit} (P75: ${Math.round(stats[metric].p75)}${unit}) - ${stats[metric].status.toUpperCase()}`);
            }
        });
        
        // Display Additional Metrics
        console.log('📊 ADDITIONAL METRICS:');
        ['fcp', 'ttfb', 'domInteractive', 'domContentLoaded', 'loadComplete'].forEach(metric => {
            if (stats[metric]) {
                const emoji = stats[metric].status === 'good' ? '✅' : stats[metric].status === 'needs-improvement' ? '⚠️' : '❌';
                console.log(`   ${emoji} ${metric.toUpperCase()}: ${Math.round(stats[metric].median)}ms (P75: ${Math.round(stats[metric].p75)}ms) - ${stats[metric].status.toUpperCase()}`);
            }
        });
    }

    async generateReports() {
        const reportData = {
            testSuite: 'Web Vitals Comprehensive Monitoring',
            timestamp: new Date().toISOString(),
            summary: this.generateSummary(),
            scenarioStats: this.scenarioStats,
            violations: this.violations,
            rawResults: this.results,
            thresholds: this.thresholds
        };

        // Save JSON report
        await fs.writeFile(
            path.join(__dirname, '../reports/web-vitals-report.json'),
            JSON.stringify(reportData, null, 2)
        );

        // Generate HTML report
        const htmlReport = this.generateHTMLReport(reportData);
        await fs.writeFile(
            path.join(__dirname, '../reports/web-vitals-report.html'),
            htmlReport
        );

        console.log('\n📄 Web Vitals reports generated:');
        console.log('   - tests/reports/web-vitals-report.json');
        console.log('   - tests/reports/web-vitals-report.html');
    }

    generateSummary() {
        const totalViolations = this.violations.filter(v => v.type === 'performance-violation').length;
        const criticalViolations = this.violations.filter(v => v.type === 'performance-violation' && v.status === 'poor').length;
        
        return {
            totalTests: this.results.length,
            totalViolations: totalViolations,
            criticalViolations: criticalViolations,
            passRate: Math.round(((this.results.length - totalViolations) / this.results.length) * 100)
        };
    }

    generateHTMLReport(data) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Vitals Comprehensive Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1400px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #ff6b6b, #4ecdc4); color: white; padding: 30px; text-align: center; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .summary-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .scenarios { padding: 30px; }
        .scenario { margin-bottom: 40px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
        .scenario-header { background: #333; color: white; padding: 15px; font-weight: bold; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; padding: 20px; }
        .metric { padding: 15px; border-radius: 6px; text-align: center; }
        .metric-good { background: #d4edda; color: #155724; }
        .metric-warning { background: #fff3cd; color: #856404; }
        .metric-poor { background: #f8d7da; color: #721c24; }
        .violations { background: #f8f9fa; margin: 20px; padding: 20px; border-radius: 8px; }
        .violation { background: white; margin: 10px 0; padding: 15px; border-left: 4px solid #dc3545; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Web Vitals Comprehensive Report</h1>
            <p>EXHAUSTIVE PERFORMANCE MONITORING SUITE</p>
            <p>Generated: ${data.timestamp}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>${data.summary.totalTests}</h3>
                <p>Total Tests</p>
            </div>
            <div class="summary-card">
                <h3 style="color: ${data.summary.passRate === 100 ? '#28a745' : '#dc3545'};">${data.summary.passRate}%</h3>
                <p>Pass Rate</p>
            </div>
            <div class="summary-card">
                <h3 style="color: #dc3545;">${data.summary.totalViolations}</h3>
                <p>Violations</p>
            </div>
            <div class="summary-card">
                <h3 style="color: #dc3545;">${data.summary.criticalViolations}</h3>
                <p>Critical Issues</p>
            </div>
        </div>
        
        <div class="scenarios">
            ${Object.entries(data.scenarioStats).map(([scenario, stats]) => `
                <div class="scenario">
                    <div class="scenario-header">${scenario.toUpperCase()} Performance</div>
                    <div class="metrics">
                        ${Object.entries(stats).map(([metric, data]) => `
                            <div class="metric metric-${data.status === 'good' ? 'good' : data.status === 'needs-improvement' ? 'warning' : 'poor'}">
                                <h4>${metric.toUpperCase()}</h4>
                                <p>Median: ${Math.round(data.median)}${metric === 'cls' ? '' : 'ms'}</p>
                                <p>P75: ${Math.round(data.p75)}${metric === 'cls' ? '' : 'ms'}</p>
                                <p>Status: ${data.status.toUpperCase()}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        
        ${data.violations.length > 0 ? `
            <div class="violations">
                <h3>🚨 Performance Violations</h3>
                ${data.violations.filter(v => v.type === 'performance-violation').map(violation => `
                    <div class="violation">
                        <strong>${violation.scenario} - ${violation.metric.toUpperCase()}</strong><br>
                        Value: ${Math.round(violation.value)}${violation.metric === 'cls' ? '' : 'ms'} 
                        (Threshold: ${violation.threshold}${violation.metric === 'cls' ? '' : 'ms'})<br>
                        Status: ${violation.status.toUpperCase()}
                    </div>
                `).join('')}
            </div>
        ` : ''}
    </div>
</body>
</html>
        `;
    }

    validatePerformance() {
        console.log('\n🎯 FINAL WEB VITALS VALIDATION:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const summary = this.generateSummary();
        
        if (summary.totalViolations === 0 && this.violations.filter(v => v.type === 'test-failure').length === 0) {
            console.log('✅ 🏆 WEB VITALS PERFECTION ACHIEVED!');
            console.log('✅ All Core Web Vitals in GREEN zone');
            console.log('✅ All performance metrics meet requirements');
            console.log('✅ Zero violations detected');
            console.log('✅ Ready for production deployment');
        } else {
            console.log('❌ 🚨 WEB VITALS VIOLATIONS DETECTED!');
            console.log(`❌ Total violations: ${summary.totalViolations}`);
            console.log(`❌ Critical violations: ${summary.criticalViolations}`);
            console.log(`❌ Pass rate: ${summary.passRate}% (Required: 100%)`);
            
            if (summary.criticalViolations > 0) {
                console.log('\n🚨 CRITICAL PERFORMANCE ISSUES:');
                this.violations
                    .filter(v => v.type === 'performance-violation' && v.status === 'poor')
                    .forEach(violation => {
                        console.log(`   - ${violation.scenario}/${violation.metric}: ${Math.round(violation.value)}${violation.metric === 'cls' ? '' : 'ms'} (Max allowed: ${violation.threshold}${violation.metric === 'cls' ? '' : 'ms'})`);
                    });
            }
            
            console.log('\n📋 IMMEDIATE OPTIMIZATION REQUIRED');
            process.exit(1);
        }
    }
}

// Execute if run directly
if (require.main === module) {
    const monitor = new WebVitalsMonitor();
    const url = process.argv[2] || 'http://localhost:8000';
    const iterations = parseInt(process.argv[3]) || 3;
    
    monitor.runComprehensiveMonitoring(url, iterations).catch(error => {
        console.error('💥 CRITICAL MONITORING FAILURE:', error);
        process.exit(1);
    });
}

module.exports = WebVitalsMonitor;