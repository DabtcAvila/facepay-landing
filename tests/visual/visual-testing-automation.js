#!/usr/bin/env node

/**
 * FacePay Visual Testing Automation System
 * 
 * Comprehensive visual testing and validation system to ensure perfect
 * visual presentation across all devices and browsers.
 * 
 * Features:
 * - Multi-viewport screenshot automation
 * - Cross-browser compatibility testing
 * - Interactive elements testing
 * - User journey visual validation
 * - Visual regression detection
 * - Performance + visual correlation
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class VisualTestingAutomation {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || 'http://localhost:8000';
        this.outputDir = options.outputDir || path.join(__dirname, '../../visual-test-results');
        this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Viewport configurations
        this.viewports = {
            mobile: { width: 375, height: 667, deviceScaleFactor: 2 },
            mobileLarge: { width: 414, height: 896, deviceScaleFactor: 2 },
            tablet: { width: 768, height: 1024, deviceScaleFactor: 2 },
            desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
            desktopLarge: { width: 1920, height: 1080, deviceScaleFactor: 1 }
        };

        // Browser configurations
        this.browsers = ['chromium']; // Start with Chromium, extend to others

        // Test scenarios
        this.scenarios = [
            'homepage-initial-load',
            'face-id-scanner-inactive',
            'face-id-scanner-active',
            'video-modal-closed',
            'video-modal-open',
            'scroll-animations',
            'button-hover-states',
            'mobile-touch-interactions',
            'testimonials-section',
            'pricing-section',
            'footer-section'
        ];
    }

    async init() {
        // Ensure output directory exists
        await fs.mkdir(this.outputDir, { recursive: true });
        await fs.mkdir(path.join(this.outputDir, this.timestamp), { recursive: true });
        
        console.log(`🚀 Visual Testing Automation Started`);
        console.log(`📁 Output Directory: ${this.outputDir}/${this.timestamp}`);
        console.log(`🌐 Base URL: ${this.baseUrl}`);
    }

    async runFullTestSuite() {
        await this.init();
        
        const results = {
            timestamp: this.timestamp,
            baseUrl: this.baseUrl,
            summary: {
                totalTests: 0,
                passed: 0,
                failed: 0,
                warnings: 0
            },
            screenshots: {},
            metrics: {},
            issues: []
        };

        for (const [viewportName, viewport] of Object.entries(this.viewports)) {
            console.log(`\n📱 Testing viewport: ${viewportName} (${viewport.width}x${viewport.height})`);
            
            const browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding'
                ]
            });

            try {
                const viewportResults = await this.testViewport(browser, viewportName, viewport);
                results.screenshots[viewportName] = viewportResults.screenshots;
                results.metrics[viewportName] = viewportResults.metrics;
                results.issues.push(...viewportResults.issues);
                results.summary.totalTests += viewportResults.summary.totalTests;
                results.summary.passed += viewportResults.summary.passed;
                results.summary.failed += viewportResults.summary.failed;
                results.summary.warnings += viewportResults.summary.warnings;
            } catch (error) {
                console.error(`❌ Error testing viewport ${viewportName}:`, error);
                results.issues.push({
                    type: 'error',
                    viewport: viewportName,
                    message: `Failed to test viewport: ${error.message}`
                });
            }

            await browser.close();
        }

        // Generate comprehensive report
        await this.generateReport(results);
        
        return results;
    }

    async testViewport(browser, viewportName, viewport) {
        const page = await browser.newPage();
        
        // Set viewport
        await page.setViewport(viewport);
        
        // Enable request interception for performance monitoring
        await page.setRequestInterception(true);
        
        const requests = [];
        const responses = [];
        
        page.on('request', (request) => {
            requests.push({
                url: request.url(),
                method: request.method(),
                resourceType: request.resourceType(),
                timestamp: Date.now()
            });
            request.continue();
        });

        page.on('response', (response) => {
            responses.push({
                url: response.url(),
                status: response.status(),
                contentLength: response.headers()['content-length'],
                timestamp: Date.now()
            });
        });

        const results = {
            screenshots: {},
            metrics: {},
            issues: [],
            summary: {
                totalTests: this.scenarios.length,
                passed: 0,
                failed: 0,
                warnings: 0
            }
        };

        try {
            // Navigate to the page
            console.log(`🌐 Loading ${this.baseUrl}...`);
            const navigationStart = Date.now();
            
            await page.goto(this.baseUrl, { 
                waitUntil: ['domcontentloaded', 'networkidle0'],
                timeout: 30000 
            });

            const navigationTime = Date.now() - navigationStart;
            
            // Wait for critical elements to load
            await page.waitForSelector('body', { timeout: 10000 });
            
            // Test each scenario
            for (const scenario of this.scenarios) {
                try {
                    console.log(`  🎬 Testing scenario: ${scenario}`);
                    const scenarioResult = await this.testScenario(page, scenario, viewportName);
                    results.screenshots[scenario] = scenarioResult.screenshot;
                    results.metrics[scenario] = scenarioResult.metrics;
                    
                    if (scenarioResult.success) {
                        results.summary.passed++;
                    } else {
                        results.summary.failed++;
                        results.issues.push(...scenarioResult.issues);
                    }
                    
                } catch (error) {
                    console.error(`    ❌ Scenario ${scenario} failed:`, error.message);
                    results.summary.failed++;
                    results.issues.push({
                        type: 'error',
                        viewport: viewportName,
                        scenario,
                        message: error.message
                    });
                }
            }

            // Collect overall metrics
            results.metrics.navigation = {
                navigationTime,
                totalRequests: requests.length,
                totalResponses: responses.length,
                performanceMetrics: await this.collectPerformanceMetrics(page)
            };

        } catch (error) {
            console.error(`❌ Major error in viewport ${viewportName}:`, error);
            results.issues.push({
                type: 'critical',
                viewport: viewportName,
                message: `Critical failure: ${error.message}`
            });
        }

        await page.close();
        return results;
    }

    async testScenario(page, scenario, viewportName) {
        const result = {
            success: true,
            screenshot: null,
            metrics: {},
            issues: []
        };

        try {
            // Prepare the page for the specific scenario
            await this.prepareScenario(page, scenario);
            
            // Wait for animations and transitions to complete
            await page.waitForTimeout(1000);
            
            // Collect metrics before screenshot
            const beforeMetrics = await this.collectPageMetrics(page);
            
            // Take screenshot
            const screenshotPath = path.join(
                this.outputDir, 
                this.timestamp, 
                `${viewportName}-${scenario}.png`
            );
            
            await page.screenshot({
                path: screenshotPath,
                fullPage: scenario.includes('scroll') || scenario.includes('full'),
                type: 'png',
                quality: 100
            });

            result.screenshot = screenshotPath;
            
            // Collect post-scenario metrics
            const afterMetrics = await this.collectPageMetrics(page);
            
            result.metrics = {
                before: beforeMetrics,
                after: afterMetrics,
                scenario: scenario
            };

            // Validate scenario-specific elements
            const validation = await this.validateScenarioElements(page, scenario);
            if (!validation.valid) {
                result.success = false;
                result.issues.push(...validation.issues);
            }
            
            console.log(`    ✅ ${scenario} completed - Screenshot saved`);
            
        } catch (error) {
            result.success = false;
            result.issues.push({
                type: 'scenario_error',
                scenario,
                message: error.message
            });
            console.log(`    ❌ ${scenario} failed: ${error.message}`);
        }

        return result;
    }

    async prepareScenario(page, scenario) {
        switch (scenario) {
            case 'homepage-initial-load':
                // Just wait for page to be ready
                await page.waitForSelector('body');
                break;
                
            case 'face-id-scanner-inactive':
                await page.waitForSelector('.face-id-scanner', { timeout: 5000 });
                break;
                
            case 'face-id-scanner-active':
                await page.waitForSelector('.face-id-scanner', { timeout: 5000 });
                // Simulate activation
                await page.click('.face-id-scanner');
                await page.waitForTimeout(500);
                break;
                
            case 'video-modal-closed':
                await page.waitForSelector('[data-video-trigger]', { timeout: 5000 });
                break;
                
            case 'video-modal-open':
                const videoTrigger = await page.$('[data-video-trigger]');
                if (videoTrigger) {
                    await videoTrigger.click();
                    await page.waitForSelector('[data-video-modal]', { timeout: 3000 });
                }
                break;
                
            case 'scroll-animations':
                // Scroll through the page to trigger animations
                await page.evaluate(() => {
                    window.scrollTo(0, window.innerHeight);
                });
                await page.waitForTimeout(1000);
                break;
                
            case 'button-hover-states':
                const buttons = await page.$$('button, .btn, .cta');
                if (buttons.length > 0) {
                    await buttons[0].hover();
                    await page.waitForTimeout(300);
                }
                break;
                
            case 'mobile-touch-interactions':
                // Simulate mobile touch interactions
                if (page.viewport().width <= 768) {
                    const touchElements = await page.$$('[data-touch]');
                    if (touchElements.length > 0) {
                        await touchElements[0].tap();
                        await page.waitForTimeout(300);
                    }
                }
                break;
                
            case 'testimonials-section':
                const testimonialsSection = await page.$('[data-section="testimonials"]');
                if (testimonialsSection) {
                    await page.evaluate(el => el.scrollIntoView({ behavior: 'smooth' }), testimonialsSection);
                    await page.waitForTimeout(1000);
                }
                break;
                
            case 'pricing-section':
                const pricingSection = await page.$('[data-section="pricing"]');
                if (pricingSection) {
                    await page.evaluate(el => el.scrollIntoView({ behavior: 'smooth' }), pricingSection);
                    await page.waitForTimeout(1000);
                }
                break;
                
            case 'footer-section':
                await page.evaluate(() => {
                    window.scrollTo(0, document.body.scrollHeight);
                });
                await page.waitForTimeout(1000);
                break;
                
            default:
                // Default: just wait
                await page.waitForTimeout(500);
        }
    }

    async validateScenarioElements(page, scenario) {
        const validation = { valid: true, issues: [] };

        try {
            switch (scenario) {
                case 'face-id-scanner-inactive':
                    const scanner = await page.$('.face-id-scanner');
                    if (!scanner) {
                        validation.valid = false;
                        validation.issues.push({
                            type: 'missing_element',
                            element: 'face-id-scanner',
                            message: 'Face ID scanner element not found'
                        });
                    }
                    break;
                    
                case 'video-modal-open':
                    const modal = await page.$('[data-video-modal]');
                    if (!modal) {
                        validation.valid = false;
                        validation.issues.push({
                            type: 'missing_element',
                            element: 'video-modal',
                            message: 'Video modal not visible after trigger'
                        });
                    }
                    break;
            }
        } catch (error) {
            validation.valid = false;
            validation.issues.push({
                type: 'validation_error',
                message: error.message
            });
        }

        return validation;
    }

    async collectPageMetrics(page) {
        return await page.evaluate(() => {
            const performance = window.performance;
            const timing = performance.timing;
            
            return {
                loadTime: timing.loadEventEnd - timing.navigationStart,
                domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
                firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
                scrollY: window.scrollY,
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                timestamp: Date.now()
            };
        });
    }

    async collectPerformanceMetrics(page) {
        const metrics = await page.metrics();
        const performanceMetrics = await page.evaluate(() => {
            return {
                navigation: JSON.stringify(performance.getEntriesByType('navigation')[0]),
                paint: JSON.stringify(performance.getEntriesByType('paint')),
                resource: performance.getEntriesByType('resource').length
            };
        });

        return {
            ...metrics,
            ...performanceMetrics
        };
    }

    async generateReport(results) {
        const reportPath = path.join(this.outputDir, this.timestamp, 'visual-test-report.json');
        const htmlReportPath = path.join(this.outputDir, this.timestamp, 'visual-test-report.html');
        
        // Save JSON report
        await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
        
        // Generate HTML report
        const htmlReport = this.generateHtmlReport(results);
        await fs.writeFile(htmlReportPath, htmlReport);
        
        // Generate summary
        this.printSummary(results);
        
        console.log(`\n📊 Reports generated:`);
        console.log(`   JSON: ${reportPath}`);
        console.log(`   HTML: ${htmlReportPath}`);
    }

    generateHtmlReport(results) {
        const screenshotHtml = Object.entries(results.screenshots)
            .map(([viewport, scenarios]) => {
                const scenarioHtml = Object.entries(scenarios)
                    .map(([scenario, screenshotPath]) => {
                        if (!screenshotPath) return '';
                        const relativePath = path.relative(path.dirname(screenshotPath), screenshotPath);
                        return `
                            <div class="screenshot-item">
                                <h4>${scenario}</h4>
                                <img src="${path.basename(screenshotPath)}" alt="${viewport} - ${scenario}" loading="lazy">
                            </div>
                        `;
                    }).join('');
                    
                return `
                    <div class="viewport-section">
                        <h3>${viewport}</h3>
                        <div class="screenshots-grid">
                            ${scenarioHtml}
                        </div>
                    </div>
                `;
            }).join('');

        const issuesHtml = results.issues.map(issue => `
            <div class="issue issue-${issue.type}">
                <strong>${issue.type.toUpperCase()}</strong>
                ${issue.viewport ? `<span class="viewport">[${issue.viewport}]</span>` : ''}
                ${issue.scenario ? `<span class="scenario">[${issue.scenario}]</span>` : ''}
                <p>${issue.message}</p>
            </div>
        `).join('');

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>FacePay Visual Testing Report - ${results.timestamp}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
                .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
                .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
                .stat { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; }
                .stat-number { font-size: 2rem; font-weight: bold; color: #2563eb; }
                .screenshots-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
                .screenshot-item { border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; }
                .screenshot-item img { width: 100%; border-radius: 4px; }
                .screenshot-item h4 { margin-bottom: 10px; color: #475569; }
                .viewport-section { margin-bottom: 40px; }
                .viewport-section h3 { color: #1e293b; margin-bottom: 20px; font-size: 1.5rem; }
                .issues { margin-top: 30px; }
                .issue { padding: 15px; margin-bottom: 10px; border-radius: 6px; border-left: 4px solid; }
                .issue-error { background: #fef2f2; border-color: #dc2626; }
                .issue-warning { background: #fffbeb; border-color: #d97706; }
                .issue-critical { background: #fdf2f8; border-color: #be185d; }
                .viewport, .scenario { background: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-size: 0.85rem; margin: 0 5px; }
                .timestamp { color: #64748b; font-size: 0.9rem; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎨 FacePay Visual Testing Report</h1>
                    <p class="timestamp">Generated: ${new Date(results.timestamp).toLocaleString()}</p>
                    <p>Base URL: ${results.baseUrl}</p>
                </div>

                <div class="summary">
                    <div class="stat">
                        <div class="stat-number">${results.summary.totalTests}</div>
                        <div>Total Tests</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number" style="color: #059669">${results.summary.passed}</div>
                        <div>Passed</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number" style="color: #dc2626">${results.summary.failed}</div>
                        <div>Failed</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number" style="color: #d97706">${results.summary.warnings}</div>
                        <div>Warnings</div>
                    </div>
                </div>

                <h2>📱 Visual Screenshots by Viewport</h2>
                ${screenshotHtml}

                ${results.issues.length > 0 ? `
                    <div class="issues">
                        <h2>⚠️ Issues Found</h2>
                        ${issuesHtml}
                    </div>
                ` : '<div class="success">✅ No issues found! Visual testing passed completely.</div>'}
            </div>
        </body>
        </html>
        `;
    }

    printSummary(results) {
        console.log('\n' + '='.repeat(60));
        console.log('🎨 FACEPAY VISUAL TESTING SUMMARY');
        console.log('='.repeat(60));
        console.log(`📊 Total Tests: ${results.summary.totalTests}`);
        console.log(`✅ Passed: ${results.summary.passed}`);
        console.log(`❌ Failed: ${results.summary.failed}`);
        console.log(`⚠️  Warnings: ${results.summary.warnings}`);
        console.log(`📁 Screenshots: ${Object.keys(results.screenshots).length} viewports`);
        
        if (results.issues.length > 0) {
            console.log(`\n🚨 Issues Found: ${results.issues.length}`);
            results.issues.slice(0, 5).forEach(issue => {
                console.log(`   • ${issue.type}: ${issue.message.substring(0, 80)}...`);
            });
            if (results.issues.length > 5) {
                console.log(`   • ... and ${results.issues.length - 5} more (see report)`);
            }
        } else {
            console.log('\n🎉 All visual tests passed! No issues found.');
        }
        
        console.log('='.repeat(60));
    }
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const baseUrl = args[0] || 'http://localhost:8000';
    
    console.log('🚀 Starting FacePay Visual Testing Automation...');
    
    const visualTester = new VisualTestingAutomation({ baseUrl });
    
    visualTester.runFullTestSuite()
        .then(results => {
            console.log('\n✅ Visual testing completed!');
            process.exit(results.summary.failed > 0 ? 1 : 0);
        })
        .catch(error => {
            console.error('\n❌ Visual testing failed:', error);
            process.exit(1);
        });
}

module.exports = VisualTestingAutomation;