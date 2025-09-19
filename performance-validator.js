#!/usr/bin/env node

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs').promises;
const path = require('path');

/**
 * CRITICAL PERFORMANCE VALIDATION SUITE
 * Validates actual performance claims for hackathon submission
 */

class PerformanceValidator {
    constructor() {
        this.results = {};
        this.violations = [];
        this.url = 'https://facepay.com.mx';
        
        // HACKATHON VALIDATION TARGETS
        this.targets = {
            performance: 95,      // Must achieve 95+ for credibility
            accessibility: 100,   // Perfect accessibility required
            bestPractices: 95,    // Best practices compliance
            seo: 100,            // Perfect SEO for professional image
            
            // Core Web Vitals Targets
            lcp: 2500,           // Largest Contentful Paint < 2.5s
            fid: 100,            // First Input Delay < 100ms
            cls: 0.1,            // Cumulative Layout Shift < 0.1
            fcp: 1800,           // First Contentful Paint < 1.8s
            ttfb: 800            // Time to First Byte < 800ms
        };
    }

    async validatePerformance() {
        console.log('🚀 FACEPAY.COM.MX PERFORMANCE VALIDATION');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🎯 Testing: ${this.url}`);
        console.log(`📊 Validation targets: Performance ${this.targets.performance}+, Accessibility ${this.targets.accessibility}, SEO ${this.targets.seo}`);
        
        const chrome = await chromeLauncher.launch({
            chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
        });

        try {
            // Test Desktop Performance
            console.log('\n💻 DESKTOP PERFORMANCE TEST...');
            this.results.desktop = await this.runLighthouseTest(chrome.port, {
                formFactor: 'desktop',
                screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1 },
                throttling: { rttMs: 40, throughputKbps: 10 * 1024, cpuSlowdownMultiplier: 1 }
            });
            
            // Test Mobile Performance
            console.log('\n📱 MOBILE PERFORMANCE TEST...');
            this.results.mobile = await this.runLighthouseTest(chrome.port, {
                formFactor: 'mobile',
                screenEmulation: { mobile: true, width: 375, height: 667, deviceScaleFactor: 2 },
                throttling: { rttMs: 150, throughputKbps: 1.6 * 1024, cpuSlowdownMultiplier: 4 }
            });
            
            // Test Mobile 3G Performance
            console.log('\n🐌 MOBILE 3G PERFORMANCE TEST...');
            this.results.mobile3g = await this.runLighthouseTest(chrome.port, {
                formFactor: 'mobile',
                screenEmulation: { mobile: true, width: 375, height: 667, deviceScaleFactor: 2 },
                throttling: { rttMs: 300, throughputKbps: 700, cpuSlowdownMultiplier: 4 }
            });
            
            await this.analyzeResults();
            await this.generateReports();
            this.validateClaims();
            
        } finally {
            await chrome.kill();
        }
    }

    async runLighthouseTest(port, config) {
        const options = {
            logLevel: 'info',
            output: 'json',
            onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
            port: port,
            formFactor: config.formFactor,
            throttling: config.throttling,
            screenEmulation: config.screenEmulation
        };

        const runnerResult = await lighthouse(this.url, options);
        const lhr = runnerResult.lhr;
        
        const result = {
            timestamp: new Date().toISOString(),
            scores: {
                performance: Math.round(lhr.categories.performance.score * 100),
                accessibility: Math.round(lhr.categories.accessibility.score * 100),
                bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
                seo: Math.round(lhr.categories.seo.score * 100)
            },
            metrics: {
                fcp: lhr.audits['first-contentful-paint'].numericValue,
                lcp: lhr.audits['largest-contentful-paint'].numericValue,
                fid: lhr.audits['first-input-delay'] ? lhr.audits['first-input-delay'].numericValue : 0,
                cls: lhr.audits['cumulative-layout-shift'].numericValue,
                ttfb: lhr.audits['server-response-time'] ? lhr.audits['server-response-time'].numericValue : 0,
                speedIndex: lhr.audits['speed-index'].numericValue,
                totalBlockingTime: lhr.audits['total-blocking-time'].numericValue
            },
            opportunities: Object.keys(lhr.audits)
                .filter(key => lhr.audits[key].details && lhr.audits[key].score < 1)
                .map(key => ({
                    id: key,
                    title: lhr.audits[key].title,
                    description: lhr.audits[key].description,
                    score: lhr.audits[key].score,
                    displayValue: lhr.audits[key].displayValue
                })),
            rawReport: lhr
        };
        
        this.displayTestResults(config.formFactor.toUpperCase(), result);
        return result;
    }

    displayTestResults(testType, result) {
        console.log(`\n📈 ${testType} RESULTS:`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Display Lighthouse Scores
        Object.entries(result.scores).forEach(([category, score]) => {
            const target = this.targets[category] || 90;
            const status = score >= target ? '✅' : '❌';
            const emoji = score >= target ? '🎯' : '🚨';
            console.log(`${status} ${emoji} ${category.toUpperCase()}: ${score}/100 (Target: ${target}+)`);
            
            if (score < target) {
                this.violations.push({
                    testType,
                    category,
                    score,
                    target,
                    gap: target - score
                });
            }
        });
        
        // Display Core Web Vitals
        console.log(`\n⚡ CORE WEB VITALS:`);
        const vitals = [
            { key: 'fcp', name: 'FCP', target: this.targets.fcp, unit: 'ms' },
            { key: 'lcp', name: 'LCP', target: this.targets.lcp, unit: 'ms' },
            { key: 'fid', name: 'FID', target: this.targets.fid, unit: 'ms' },
            { key: 'cls', name: 'CLS', target: this.targets.cls, unit: '' },
            { key: 'ttfb', name: 'TTFB', target: this.targets.ttfb, unit: 'ms' }
        ];
        
        vitals.forEach(vital => {
            const value = result.metrics[vital.key];
            if (value !== undefined) {
                const displayValue = vital.unit === 'ms' ? Math.round(value) : value.toFixed(3);
                const status = value <= vital.target ? '✅' : '❌';
                const emoji = value <= vital.target ? '🚀' : '⚠️';
                console.log(`   ${status} ${emoji} ${vital.name}: ${displayValue}${vital.unit} (Target: ≤${vital.target}${vital.unit})`);
                
                if (value > vital.target) {
                    this.violations.push({
                        testType,
                        category: vital.key,
                        value: displayValue,
                        target: vital.target,
                        unit: vital.unit
                    });
                }
            }
        });
    }

    async analyzeResults() {
        console.log('\n🔍 ANALYZING PERFORMANCE EVIDENCE...');
        
        // Calculate overall performance summary
        const allScores = Object.values(this.results).flatMap(result => 
            Object.entries(result.scores).map(([cat, score]) => ({ category: cat, score }))
        );
        
        const avgScores = {};
        ['performance', 'accessibility', 'bestPractices', 'seo'].forEach(category => {
            const categoryScores = allScores.filter(s => s.category === category).map(s => s.score);
            avgScores[category] = Math.round(categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length);
        });
        
        this.summary = {
            totalTests: Object.keys(this.results).length,
            avgScores,
            violations: this.violations.length,
            claimsValidated: this.violations.length === 0
        };
        
        console.log(`📊 Average Scores: Performance ${avgScores.performance}/100, Accessibility ${avgScores.accessibility}/100, Best Practices ${avgScores.bestPractices}/100, SEO ${avgScores.seo}/100`);
    }

    async generateReports() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Generate JSON report
        const reportData = {
            url: this.url,
            timestamp: new Date().toISOString(),
            summary: this.summary,
            results: this.results,
            violations: this.violations,
            targets: this.targets
        };
        
        await fs.writeFile(
            path.join(__dirname, `performance-report-${timestamp}.json`),
            JSON.stringify(reportData, null, 2)
        );
        
        // Generate comprehensive HTML report
        const htmlReport = await this.generateHTMLReport(reportData);
        await fs.writeFile(
            path.join(__dirname, `PERFORMANCE_VALIDATION_REPORT.html`),
            htmlReport
        );
        
        console.log('\n📄 Reports generated:');
        console.log(`   - performance-report-${timestamp}.json`);
        console.log(`   - PERFORMANCE_VALIDATION_REPORT.html`);
    }

    async generateHTMLReport(data) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FacePay Performance Validation Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f7fa; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; background: white; min-height: 100vh; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; text-align: center; }
        .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .header p { font-size: 1.2rem; opacity: 0.9; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; padding: 2rem; }
        .summary-card { background: #f8f9fa; padding: 1.5rem; border-radius: 8px; text-align: center; border-left: 4px solid #667eea; }
        .summary-card h3 { font-size: 2rem; color: #667eea; margin-bottom: 0.5rem; }
        .summary-card p { color: #666; }
        .results { padding: 2rem; }
        .test-section { margin-bottom: 2rem; border: 1px solid #e1e5e9; border-radius: 8px; overflow: hidden; }
        .test-header { background: #f8f9fa; padding: 1rem; font-weight: bold; color: #495057; }
        .test-content { padding: 1.5rem; }
        .scores { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .score-card { padding: 1rem; border-radius: 6px; text-align: center; }
        .score-pass { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .score-fail { background: #f8d7da; color: #721c24; border: 1px solid #f1aeb5; }
        .vitals { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; }
        .vital-card { background: #f8f9fa; padding: 1rem; border-radius: 6px; text-align: center; }
        .vital-pass { border-left: 4px solid #28a745; }
        .vital-fail { border-left: 4px solid #dc3545; }
        .violations { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 1.5rem; margin: 2rem 0; }
        .violation-item { background: white; margin: 0.5rem 0; padding: 1rem; border-radius: 4px; border-left: 4px solid #ffc107; }
        .footer { background: #343a40; color: white; text-align: center; padding: 2rem; }
        .evidence-section { background: #e3f2fd; padding: 2rem; margin: 2rem 0; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 FacePay Performance Validation</h1>
            <p>Real Performance Testing Results for facepay.com.mx</p>
            <p style="font-size: 1rem; margin-top: 1rem;">Generated: ${data.timestamp}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>${data.summary.avgScores.performance}</h3>
                <p>Average Performance Score</p>
            </div>
            <div class="summary-card">
                <h3>${data.summary.avgScores.accessibility}</h3>
                <p>Accessibility Score</p>
            </div>
            <div class="summary-card">
                <h3>${data.summary.violations}</h3>
                <p>Total Violations</p>
            </div>
            <div class="summary-card">
                <h3>${data.summary.claimsValidated ? '✅' : '❌'}</h3>
                <p>Claims Validated</p>
            </div>
        </div>
        
        <div class="evidence-section">
            <h2>📊 PERFORMANCE EVIDENCE SUMMARY</h2>
            <p><strong>URL Tested:</strong> ${data.url}</p>
            <p><strong>Test Scenarios:</strong> Desktop, Mobile, Mobile 3G</p>
            <p><strong>Validation Status:</strong> ${data.summary.claimsValidated ? 'CLAIMS VALIDATED ✅' : 'OPTIMIZATION NEEDED ❌'}</p>
        </div>
        
        <div class="results">
            ${Object.entries(data.results).map(([testType, result]) => `
                <div class="test-section">
                    <div class="test-header">${testType.toUpperCase()} TEST RESULTS</div>
                    <div class="test-content">
                        <h4>Lighthouse Scores</h4>
                        <div class="scores">
                            ${Object.entries(result.scores).map(([category, score]) => {
                                const target = data.targets[category] || 90;
                                const passed = score >= target;
                                return `
                                    <div class="score-card ${passed ? 'score-pass' : 'score-fail'}">
                                        <strong>${category.replace(/([A-Z])/g, ' $1').toUpperCase()}</strong><br>
                                        ${score}/100<br>
                                        <small>Target: ${target}+</small>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        
                        <h4>Core Web Vitals</h4>
                        <div class="vitals">
                            <div class="vital-card ${result.metrics.fcp <= data.targets.fcp ? 'vital-pass' : 'vital-fail'}">
                                <strong>FCP</strong><br>${Math.round(result.metrics.fcp)}ms<br><small>Target: ≤${data.targets.fcp}ms</small>
                            </div>
                            <div class="vital-card ${result.metrics.lcp <= data.targets.lcp ? 'vital-pass' : 'vital-fail'}">
                                <strong>LCP</strong><br>${Math.round(result.metrics.lcp)}ms<br><small>Target: ≤${data.targets.lcp}ms</small>
                            </div>
                            <div class="vital-card ${result.metrics.cls <= data.targets.cls ? 'vital-pass' : 'vital-fail'}">
                                <strong>CLS</strong><br>${result.metrics.cls.toFixed(3)}<br><small>Target: ≤${data.targets.cls}</small>
                            </div>
                            <div class="vital-card">
                                <strong>Speed Index</strong><br>${Math.round(result.metrics.speedIndex)}ms
                            </div>
                            <div class="vital-card">
                                <strong>TBT</strong><br>${Math.round(result.metrics.totalBlockingTime)}ms
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        ${data.violations.length > 0 ? `
            <div class="violations">
                <h3>🚨 Performance Issues Found</h3>
                ${data.violations.map(violation => `
                    <div class="violation-item">
                        <strong>${violation.testType} - ${violation.category}</strong><br>
                        ${violation.score ? `Score: ${violation.score}/100 (Target: ${violation.target}+)` : 
                          `Value: ${violation.value}${violation.unit} (Target: ≤${violation.target}${violation.unit})`}
                    </div>
                `).join('')}
            </div>
        ` : ''}
        
        <div class="footer">
            <p>🎯 Generated for Hackathon Performance Validation</p>
            <p>Real-time testing results from actual deployment at ${data.url}</p>
        </div>
    </div>
</body>
</html>`;
    }

    validateClaims() {
        console.log('\n🎯 FINAL VALIDATION RESULTS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        if (this.violations.length === 0) {
            console.log('🏆 ✅ PERFORMANCE CLAIMS VALIDATED!');
            console.log('✅ All performance targets met or exceeded');
            console.log('✅ Core Web Vitals in green zone');
            console.log('✅ Ready for hackathon technical review');
            console.log('✅ Optimization claims substantiated with evidence');
        } else {
            console.log('🚨 ❌ PERFORMANCE CLAIMS NOT VALIDATED!');
            console.log(`❌ ${this.violations.length} violations found`);
            console.log('❌ Optimization required before hackathon submission');
            
            console.log('\n📋 CRITICAL ISSUES TO FIX:');
            this.violations.forEach((violation, index) => {
                console.log(`   ${index + 1}. ${violation.testType}/${violation.category}: ${
                    violation.score ? `${violation.score}/100 (need ${violation.gap} more points)` :
                    `${violation.value}${violation.unit} (exceeds ${violation.target}${violation.unit} target)`
                }`);
            });
            
            process.exit(1);
        }
    }
}

// Execute if run directly
if (require.main === module) {
    const validator = new PerformanceValidator();
    validator.validatePerformance().catch(error => {
        console.error('💥 CRITICAL VALIDATION FAILURE:', error);
        process.exit(1);
    });
}

module.exports = PerformanceValidator;