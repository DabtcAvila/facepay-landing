#!/usr/bin/env node

/**
 * FacePay Cross-Browser Visual Testing System
 * 
 * Extends the visual testing automation with multi-browser support
 * to ensure perfect compatibility across Chrome, Safari, Firefox, and Edge.
 */

const { chromium, firefox, webkit } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

class CrossBrowserVisualTesting {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || 'http://localhost:8000';
        this.outputDir = options.outputDir || path.join(__dirname, '../../cross-browser-results');
        this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Browser configurations
        this.browsers = {
            chromium: { 
                name: 'Chrome',
                engine: chromium,
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            firefox: { 
                name: 'Firefox',
                engine: firefox,
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0'
            },
            webkit: { 
                name: 'Safari',
                engine: webkit,
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
            }
        };

        // Test viewports
        this.viewports = {
            mobile: { width: 375, height: 667 },
            tablet: { width: 768, height: 1024 },
            desktop: { width: 1440, height: 900 }
        };

        // Critical test scenarios
        this.scenarios = [
            'homepage-load',
            'face-id-scanner',
            'video-integration',
            'mobile-navigation',
            'responsive-layout',
            'font-rendering',
            'button-interactions',
            'scroll-animations'
        ];
    }

    async runCrossBrowserTests() {
        await this.init();
        
        const results = {
            timestamp: this.timestamp,
            baseUrl: this.baseUrl,
            browsers: {},
            comparison: {},
            issues: [],
            summary: {
                totalTests: 0,
                passed: 0,
                failed: 0,
                browserCompatibility: {}
            }
        };

        // Test each browser
        for (const [browserKey, browserConfig] of Object.entries(this.browsers)) {
            console.log(`\n🌐 Testing browser: ${browserConfig.name}`);
            
            try {
                const browserResults = await this.testBrowser(browserConfig, browserKey);
                results.browsers[browserKey] = browserResults;
                
                results.summary.totalTests += browserResults.summary.totalTests;
                results.summary.passed += browserResults.summary.passed;
                results.summary.failed += browserResults.summary.failed;
                results.summary.browserCompatibility[browserKey] = browserResults.compatibility;
                
            } catch (error) {
                console.error(`❌ Browser ${browserConfig.name} failed:`, error);
                results.issues.push({
                    type: 'browser_failure',
                    browser: browserKey,
                    message: error.message
                });
            }
        }

        // Generate cross-browser comparison
        results.comparison = await this.generateCrossBrowserComparison(results.browsers);
        
        // Generate reports
        await this.generateCrossBrowserReport(results);
        
        return results;
    }

    async init() {
        await fs.mkdir(this.outputDir, { recursive: true });
        await fs.mkdir(path.join(this.outputDir, this.timestamp), { recursive: true });
        
        console.log(`🚀 Cross-Browser Visual Testing Started`);
        console.log(`📁 Output Directory: ${this.outputDir}/${this.timestamp}`);
    }

    async testBrowser(browserConfig, browserKey) {
        const browser = await browserConfig.engine.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-dev-shm-usage']
        });

        const results = {
            browser: browserConfig.name,
            screenshots: {},
            metrics: {},
            compatibility: { score: 0, issues: [] },
            summary: {
                totalTests: this.scenarios.length * Object.keys(this.viewports).length,
                passed: 0,
                failed: 0
            }
        };

        try {
            const context = await browser.newContext({
                userAgent: browserConfig.userAgent,
                ignoreHTTPSErrors: true
            });

            for (const [viewportName, viewport] of Object.entries(this.viewports)) {
                console.log(`  📱 ${browserConfig.name} - ${viewportName} (${viewport.width}x${viewport.height})`);
                
                const page = await context.newPage();
                await page.setViewportSize(viewport);

                // Test each scenario in this viewport
                for (const scenario of this.scenarios) {
                    try {
                        const scenarioResult = await this.testScenario(
                            page, 
                            scenario, 
                            browserKey, 
                            viewportName
                        );
                        
                        if (!results.screenshots[viewportName]) {
                            results.screenshots[viewportName] = {};
                        }
                        
                        results.screenshots[viewportName][scenario] = scenarioResult.screenshot;
                        results.metrics[`${viewportName}_${scenario}`] = scenarioResult.metrics;
                        
                        if (scenarioResult.success) {
                            results.summary.passed++;
                        } else {
                            results.summary.failed++;
                            results.compatibility.issues.push(...scenarioResult.issues);
                        }
                        
                    } catch (error) {
                        console.error(`    ❌ ${scenario} failed:`, error.message);
                        results.summary.failed++;
                        results.compatibility.issues.push({
                            scenario,
                            viewport: viewportName,
                            message: error.message
                        });
                    }
                }

                await page.close();
            }

            await context.close();
            
            // Calculate compatibility score
            results.compatibility.score = Math.round(
                (results.summary.passed / results.summary.totalTests) * 100
            );
            
        } catch (error) {
            console.error(`❌ Major error in ${browserConfig.name}:`, error);
            results.compatibility.issues.push({
                type: 'critical',
                message: `Browser setup failed: ${error.message}`
            });
        }

        await browser.close();
        return results;
    }

    async testScenario(page, scenario, browserKey, viewportName) {
        const result = {
            success: true,
            screenshot: null,
            metrics: {},
            issues: []
        };

        try {
            // Navigate to the page if not already there
            if (page.url() !== this.baseUrl) {
                await page.goto(this.baseUrl, { 
                    waitUntil: 'domcontentloaded',
                    timeout: 30000 
                });
            }

            // Prepare the scenario
            await this.prepareScenario(page, scenario, viewportName);
            
            // Wait for stability
            await page.waitForTimeout(1000);
            
            // Take screenshot
            const screenshotPath = path.join(
                this.outputDir,
                this.timestamp,
                `${browserKey}-${viewportName}-${scenario}.png`
            );
            
            await page.screenshot({
                path: screenshotPath,
                fullPage: scenario.includes('scroll'),
                type: 'png'
            });

            result.screenshot = screenshotPath;
            
            // Collect browser-specific metrics
            result.metrics = await this.collectBrowserMetrics(page, scenario);
            
            // Validate scenario-specific elements
            const validation = await this.validateBrowserCompatibility(page, scenario, browserKey);
            if (!validation.valid) {
                result.success = false;
                result.issues.push(...validation.issues);
            }
            
        } catch (error) {
            result.success = false;
            result.issues.push({
                type: 'scenario_error',
                scenario,
                browser: browserKey,
                viewport: viewportName,
                message: error.message
            });
        }

        return result;
    }

    async prepareScenario(page, scenario, viewportName) {
        switch (scenario) {
            case 'homepage-load':
                await page.waitForSelector('body');
                await page.waitForLoadState('networkidle');
                break;
                
            case 'face-id-scanner':
                try {
                    await page.waitForSelector('.face-id-scanner', { timeout: 5000 });
                    // Test hover/focus states
                    const scanner = page.locator('.face-id-scanner');
                    await scanner.hover();
                    await page.waitForTimeout(300);
                } catch (error) {
                    // Scanner might not be present in all views
                    console.log(`    ⚠️  Face ID scanner not found in ${viewportName}`);
                }
                break;
                
            case 'video-integration':
                try {
                    const videoTrigger = page.locator('[data-video-trigger]');
                    if (await videoTrigger.count() > 0) {
                        await videoTrigger.first().click();
                        await page.waitForTimeout(1000);
                        // Close modal if opened
                        const closeBtn = page.locator('[data-video-close]');
                        if (await closeBtn.count() > 0) {
                            await closeBtn.click();
                        }
                    }
                } catch (error) {
                    // Video integration might not be available
                }
                break;
                
            case 'mobile-navigation':
                if (viewportName === 'mobile') {
                    try {
                        const mobileMenu = page.locator('[data-mobile-menu]');
                        if (await mobileMenu.count() > 0) {
                            await mobileMenu.click();
                            await page.waitForTimeout(500);
                        }
                    } catch (error) {
                        // Mobile menu might not exist
                    }
                }
                break;
                
            case 'responsive-layout':
                // Test responsive breakpoints
                await page.evaluate(() => {
                    window.dispatchEvent(new Event('resize'));
                });
                await page.waitForTimeout(500);
                break;
                
            case 'font-rendering':
                await page.waitForLoadState('networkidle');
                // Wait for web fonts to load
                await page.evaluate(() => document.fonts.ready);
                break;
                
            case 'button-interactions':
                const buttons = page.locator('button, .btn, .cta');
                const buttonCount = await buttons.count();
                if (buttonCount > 0) {
                    // Test first button hover state
                    await buttons.first().hover();
                    await page.waitForTimeout(300);
                }
                break;
                
            case 'scroll-animations':
                await page.evaluate(() => {
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                });
                await page.waitForTimeout(1000);
                await page.evaluate(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                await page.waitForTimeout(1000);
                break;
        }
    }

    async validateBrowserCompatibility(page, scenario, browserKey) {
        const validation = { valid: true, issues: [] };

        try {
            // Check for browser-specific issues
            const browserErrors = await page.evaluate(() => {
                const errors = [];
                
                // Check for console errors
                if (window.console && window.console.error) {
                    // This is a simplified check - in real implementation,
                    // you'd want to capture console errors during page load
                }
                
                // Check for CSS compatibility
                const computedStyles = window.getComputedStyle(document.body);
                if (computedStyles.display === 'none') {
                    errors.push('Body element is not displaying properly');
                }
                
                return errors;
            });

            if (browserErrors.length > 0) {
                validation.valid = false;
                validation.issues.push(...browserErrors.map(error => ({
                    type: 'browser_compatibility',
                    browser: browserKey,
                    message: error
                })));
            }

            // Check specific elements based on scenario
            switch (scenario) {
                case 'face-id-scanner':
                    const hasScanner = await page.locator('.face-id-scanner').count() > 0;
                    if (!hasScanner) {
                        validation.issues.push({
                            type: 'element_missing',
                            element: 'face-id-scanner',
                            browser: browserKey,
                            message: 'Face ID scanner not rendered'
                        });
                    }
                    break;
            }
            
        } catch (error) {
            validation.valid = false;
            validation.issues.push({
                type: 'validation_error',
                browser: browserKey,
                message: error.message
            });
        }

        return validation;
    }

    async collectBrowserMetrics(page, scenario) {
        return await page.evaluate((scenarioName) => {
            const performance = window.performance;
            const navigation = performance.getEntriesByType('navigation')[0];
            
            return {
                scenario: scenarioName,
                loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
                domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
                firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
                firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
                resources: performance.getEntriesByType('resource').length,
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            };
        }, scenario);
    }

    async generateCrossBrowserComparison(browserResults) {
        const comparison = {
            compatibility: {},
            issues: [],
            recommendations: []
        };

        const browsers = Object.keys(browserResults);
        
        // Compare compatibility scores
        for (const browser of browsers) {
            const result = browserResults[browser];
            comparison.compatibility[browser] = {
                score: result.compatibility.score,
                issues: result.compatibility.issues.length,
                status: result.compatibility.score >= 90 ? 'excellent' :
                        result.compatibility.score >= 75 ? 'good' :
                        result.compatibility.score >= 60 ? 'fair' : 'poor'
            };
        }

        // Find common issues
        const allIssues = browsers.flatMap(browser => 
            browserResults[browser].compatibility.issues || []
        );
        
        const issueGroups = {};
        allIssues.forEach(issue => {
            const key = issue.message || issue.type;
            if (!issueGroups[key]) {
                issueGroups[key] = { count: 0, browsers: [] };
            }
            issueGroups[key].count++;
            if (issue.browser && !issueGroups[key].browsers.includes(issue.browser)) {
                issueGroups[key].browsers.push(issue.browser);
            }
        });

        comparison.commonIssues = Object.entries(issueGroups)
            .filter(([_, data]) => data.browsers.length > 1)
            .map(([issue, data]) => ({
                issue,
                affectedBrowsers: data.browsers,
                count: data.count
            }));

        // Generate recommendations
        if (comparison.commonIssues.length > 0) {
            comparison.recommendations.push(
                'Fix common cross-browser issues that affect multiple browsers'
            );
        }

        const lowScoreBrowsers = Object.entries(comparison.compatibility)
            .filter(([_, data]) => data.score < 75)
            .map(([browser]) => browser);

        if (lowScoreBrowsers.length > 0) {
            comparison.recommendations.push(
                `Improve compatibility for: ${lowScoreBrowsers.join(', ')}`
            );
        }

        return comparison;
    }

    async generateCrossBrowserReport(results) {
        const reportPath = path.join(this.outputDir, this.timestamp, 'cross-browser-report.json');
        const htmlReportPath = path.join(this.outputDir, this.timestamp, 'cross-browser-report.html');
        
        // Save JSON report
        await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
        
        // Generate HTML report
        const htmlReport = this.generateHtmlReport(results);
        await fs.writeFile(htmlReportPath, htmlReport);
        
        console.log(`\n📊 Cross-Browser Reports generated:`);
        console.log(`   JSON: ${reportPath}`);
        console.log(`   HTML: ${htmlReportPath}`);
        
        // Print summary
        this.printCrossBrowserSummary(results);
    }

    generateHtmlReport(results) {
        const browserSections = Object.entries(results.browsers)
            .map(([browserKey, browserData]) => {
                const screenshots = Object.entries(browserData.screenshots)
                    .map(([viewport, scenarios]) => {
                        const scenarioHtml = Object.entries(scenarios)
                            .map(([scenario, screenshotPath]) => {
                                if (!screenshotPath) return '';
                                return `
                                    <div class="screenshot">
                                        <h5>${scenario}</h5>
                                        <img src="${path.basename(screenshotPath)}" alt="${browserKey} ${viewport} ${scenario}" loading="lazy">
                                    </div>
                                `;
                            }).join('');
                        
                        return `
                            <div class="viewport-group">
                                <h4>${viewport}</h4>
                                <div class="scenarios-grid">${scenarioHtml}</div>
                            </div>
                        `;
                    }).join('');
                
                const compatibilityClass = browserData.compatibility.score >= 90 ? 'excellent' :
                                           browserData.compatibility.score >= 75 ? 'good' :
                                           browserData.compatibility.score >= 60 ? 'fair' : 'poor';
                
                return `
                    <div class="browser-section">
                        <div class="browser-header">
                            <h3>${browserData.browser}</h3>
                            <div class="compatibility-score ${compatibilityClass}">
                                ${browserData.compatibility.score}% Compatible
                            </div>
                        </div>
                        ${screenshots}
                    </div>
                `;
            }).join('');

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>FacePay Cross-Browser Visual Testing Report - ${results.timestamp}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
                .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
                .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; }
                .stat-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
                .stat-number { font-size: 2.5rem; font-weight: bold; color: #667eea; margin-bottom: 5px; }
                .browser-section { background: white; border-radius: 12px; padding: 25px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .browser-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #e2e8f0; }
                .compatibility-score { padding: 8px 16px; border-radius: 20px; font-weight: bold; }
                .excellent { background: #dcfce7; color: #166534; }
                .good { background: #dbeafe; color: #1d4ed8; }
                .fair { background: #fef3c7; color: #92400e; }
                .poor { background: #fecaca; color: #991b1b; }
                .viewport-group { margin-bottom: 30px; }
                .viewport-group h4 { color: #475569; margin-bottom: 15px; font-size: 1.2rem; }
                .scenarios-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
                .screenshot { border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; background: #fafafa; }
                .screenshot h5 { margin-bottom: 10px; color: #64748b; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; }
                .screenshot img { width: 100%; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .comparison-section { background: white; padding: 25px; border-radius: 12px; margin-top: 30px; }
                .recommendations { background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; }
                .timestamp { opacity: 0.8; font-size: 0.9rem; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🌐 FacePay Cross-Browser Visual Testing</h1>
                    <p class="timestamp">Generated: ${new Date(results.timestamp).toLocaleString()}</p>
                    <p>Testing URL: ${results.baseUrl}</p>
                </div>

                <div class="summary">
                    <div class="stat-card">
                        <div class="stat-number">${results.summary.totalTests}</div>
                        <div>Total Tests</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${results.summary.passed}</div>
                        <div>Passed Tests</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Object.keys(results.browsers).length}</div>
                        <div>Browsers Tested</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${results.comparison.commonIssues?.length || 0}</div>
                        <div>Common Issues</div>
                    </div>
                </div>

                ${browserSections}

                ${results.comparison.recommendations?.length > 0 ? `
                    <div class="comparison-section">
                        <h2>💡 Recommendations</h2>
                        <div class="recommendations">
                            ${results.comparison.recommendations.map(rec => `<p>• ${rec}</p>`).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </body>
        </html>
        `;
    }

    printCrossBrowserSummary(results) {
        console.log('\n' + '='.repeat(70));
        console.log('🌐 FACEPAY CROSS-BROWSER TESTING SUMMARY');
        console.log('='.repeat(70));
        
        Object.entries(results.summary.browserCompatibility).forEach(([browser, compat]) => {
            const emoji = compat.score >= 90 ? '🟢' : compat.score >= 75 ? '🟡' : '🔴';
            console.log(`${emoji} ${browser.toUpperCase()}: ${compat.score}% compatibility`);
        });
        
        console.log(`\n📊 Overall: ${results.summary.passed}/${results.summary.totalTests} tests passed`);
        
        if (results.comparison.commonIssues?.length > 0) {
            console.log(`\n⚠️  Common Issues (${results.comparison.commonIssues.length}):`);
            results.comparison.commonIssues.slice(0, 3).forEach(issue => {
                console.log(`   • ${issue.issue} (affects: ${issue.affectedBrowsers.join(', ')})`);
            });
        }
        
        console.log('='.repeat(70));
    }
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const baseUrl = args[0] || 'http://localhost:8000';
    
    console.log('🚀 Starting Cross-Browser Visual Testing...');
    
    // Check if Playwright browsers are installed
    const tester = new CrossBrowserVisualTesting({ baseUrl });
    
    tester.runCrossBrowserTests()
        .then(results => {
            console.log('\n✅ Cross-browser testing completed!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Cross-browser testing failed:', error);
            console.log('\n💡 Make sure to install Playwright browsers with: npx playwright install');
            process.exit(1);
        });
}

module.exports = CrossBrowserVisualTesting;