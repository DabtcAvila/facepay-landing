#!/usr/bin/env node

/**
 * FacePay Performance + Visual Correlation Testing
 * 
 * Correlates performance metrics with visual presentation to ensure
 * optimizations don't break visual design and visual changes don't
 * impact performance.
 * 
 * Features:
 * - Performance metric capture during visual tests
 * - Visual state correlation with Core Web Vitals
 * - Layout shift detection with visual evidence
 * - Loading state visual validation
 * - Performance regression impact on visuals
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class PerformanceVisualCorrelation {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || 'http://localhost:8000';
        this.outputDir = options.outputDir || path.join(__dirname, '../../performance-visual-results');
        this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Performance thresholds for correlation analysis
        this.performanceThresholds = {
            fcp: 1800,      // First Contentful Paint (ms)
            lcp: 2500,      // Largest Contentful Paint (ms) 
            cls: 0.1,       // Cumulative Layout Shift
            fid: 100,       // First Input Delay (ms)
            ttfb: 800,      // Time to First Byte (ms)
            loadTime: 3000  // Total load time (ms)
        };

        // Visual-performance correlation scenarios
        this.correlationScenarios = [
            {
                name: 'initial-load-correlation',
                description: 'Correlate initial page load performance with visual presentation',
                viewport: { width: 1440, height: 900 },
                capturePoints: [
                    { timing: 'domcontentloaded', description: 'DOM Content Loaded visual state' },
                    { timing: 'load', description: 'Page fully loaded visual state' },
                    { timing: 'networkidle', description: 'Network idle visual state' },
                    { timing: 'custom-1s', delay: 1000, description: '1 second after load visual state' },
                    { timing: 'custom-3s', delay: 3000, description: '3 seconds after load visual state' }
                ]
            },
            {
                name: 'mobile-performance-visual',
                description: 'Mobile performance impact on visual presentation',
                viewport: { width: 375, height: 667, deviceScaleFactor: 2 },
                throttling: {
                    cpu: 4,  // 4x CPU slowdown
                    network: 'slow3g'
                },
                capturePoints: [
                    { timing: 'domcontentloaded', description: 'Mobile DOM loaded state' },
                    { timing: 'lcp', description: 'Largest Contentful Paint moment' },
                    { timing: 'custom-2s', delay: 2000, description: 'Mobile 2s loading state' },
                    { timing: 'networkidle', description: 'Mobile network idle state' }
                ]
            },
            {
                name: 'layout-shift-detection',
                description: 'Detect and visualize layout shifts during loading',
                viewport: { width: 1440, height: 900 },
                capturePoints: [
                    { timing: 'immediate', description: 'Immediate load state' },
                    { timing: 'fonts-load', description: 'After web fonts load' },
                    { timing: 'images-load', description: 'After images load' },
                    { timing: 'final', description: 'Final stable state' }
                ]
            },
            {
                name: 'interactive-performance',
                description: 'Performance during interactive element usage',
                viewport: { width: 1440, height: 900 },
                interactions: [
                    { type: 'face-id-click', element: '.face-id-scanner', description: 'Face ID scanner interaction' },
                    { type: 'video-open', element: '[data-video-trigger]', description: 'Video modal opening' },
                    { type: 'scroll-smooth', action: 'scroll', description: 'Smooth scrolling performance' },
                    { type: 'hover-effects', element: '.cta', description: 'Hover effect performance' }
                ]
            },
            {
                name: 'loading-states-visual',
                description: 'Visual presentation of loading states and their performance impact',
                viewport: { width: 1440, height: 900 },
                capturePoints: [
                    { timing: 'skeleton-load', description: 'Skeleton loading state' },
                    { timing: 'progressive-load', description: 'Progressive loading state' },
                    { timing: 'complete-load', description: 'Complete loading state' }
                ]
            }
        ];
    }

    async runPerformanceVisualCorrelation() {
        await this.init();
        
        const results = {
            timestamp: this.timestamp,
            baseUrl: this.baseUrl,
            scenarios: {},
            correlationAnalysis: {},
            performanceImpacts: [],
            visualRegressions: [],
            summary: {
                totalScenarios: this.correlationScenarios.length,
                performanceIssues: 0,
                visualIssues: 0,
                correlatedIssues: 0,
                overallScore: 0
            }
        };

        console.log('📊 Starting Performance + Visual Correlation Testing...');

        for (const scenario of this.correlationScenarios) {
            console.log(`\n🔬 Testing correlation: ${scenario.name}`);
            console.log(`   ${scenario.description}`);
            
            try {
                const scenarioResult = await this.testScenarioCorrelation(scenario);
                results.scenarios[scenario.name] = scenarioResult;
                
                // Analyze correlations
                const correlationAnalysis = await this.analyzePerformanceVisualCorrelation(scenarioResult);
                results.correlationAnalysis[scenario.name] = correlationAnalysis;
                
                // Update summary
                results.summary.performanceIssues += correlationAnalysis.performanceIssues.length;
                results.summary.visualIssues += correlationAnalysis.visualIssues.length;
                results.summary.correlatedIssues += correlationAnalysis.correlatedIssues.length;
                
                results.performanceImpacts.push(...correlationAnalysis.performanceImpacts);
                results.visualRegressions.push(...correlationAnalysis.visualRegressions);
                
            } catch (error) {
                console.error(`❌ Correlation test ${scenario.name} failed:`, error);
                results.scenarios[scenario.name] = {
                    name: scenario.name,
                    error: error.message,
                    successful: false
                };
            }
        }

        // Calculate overall score
        results.summary.overallScore = this.calculateOverallScore(results);
        
        // Generate insights
        results.insights = this.generatePerformanceVisualInsights(results);
        
        // Generate comprehensive report
        await this.generateCorrelationReport(results);
        
        return results;
    }

    async init() {
        await fs.mkdir(this.outputDir, { recursive: true });
        await fs.mkdir(path.join(this.outputDir, this.timestamp), { recursive: true });
        
        console.log(`📊 Performance + Visual Correlation Testing Started`);
        console.log(`📁 Output Directory: ${this.outputDir}/${this.timestamp}`);
    }

    async testScenarioCorrelation(scenario) {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--enable-precise-memory-info'
            ]
        });

        const result = {
            name: scenario.name,
            description: scenario.description,
            successful: true,
            startTime: Date.now(),
            capturePoints: {},
            interactions: {},
            performanceMetrics: {},
            visualStates: {},
            correlations: {}
        };

        try {
            const page = await browser.newPage();
            
            // Configure viewport
            await page.setViewport(scenario.viewport);
            
            // Apply throttling if specified
            if (scenario.throttling) {
                const client = await page.target().createCDPSession();
                
                if (scenario.throttling.cpu) {
                    await client.send('Emulation.setCPUThrottlingRate', {
                        rate: scenario.throttling.cpu
                    });
                }
                
                if (scenario.throttling.network) {
                    await page.emulateNetworkConditions({
                        offline: false,
                        downloadThroughput: scenario.throttling.network === 'slow3g' ? 50000 : 150000,
                        uploadThroughput: scenario.throttling.network === 'slow3g' ? 50000 : 150000,
                        latency: scenario.throttling.network === 'slow3g' ? 2000 : 500
                    });
                }
            }

            // Enable metrics collection
            await page.coverage.startJSCoverage();
            await page.coverage.startCSSCoverage();
            
            const performanceObserver = await this.setupPerformanceObserver(page);
            
            // Navigate and capture correlation points
            if (scenario.capturePoints) {
                await this.capturePerformanceVisualPoints(page, scenario, result);
            }
            
            // Test interactions if specified
            if (scenario.interactions) {
                await this.testInteractivePerformanceCorrelation(page, scenario, result);
            }
            
            // Collect final metrics
            result.performanceMetrics.final = await this.collectFinalMetrics(page);
            
            await page.coverage.stopJSCoverage();
            await page.coverage.stopCSSCoverage();
            
            await page.close();
            
            result.duration = Date.now() - result.startTime;
            
        } catch (error) {
            console.error(`❌ Error in scenario ${scenario.name}:`, error);
            result.successful = false;
            result.error = error.message;
        }

        await browser.close();
        return result;
    }

    async capturePerformanceVisualPoints(page, scenario, result) {
        console.log('  📸 Capturing performance-visual correlation points...');
        
        const navigationStart = Date.now();
        
        // Start navigation
        const response = await page.goto(this.baseUrl, { waitUntil: 'domcontentloaded' });
        
        for (const capturePoint of scenario.capturePoints) {
            try {
                console.log(`    📊 Capturing: ${capturePoint.timing}`);
                
                // Wait for the specific timing point
                await this.waitForCapturePoint(page, capturePoint);
                
                // Capture performance metrics at this point
                const performanceData = await this.capturePointMetrics(page, capturePoint.timing);
                
                // Take screenshot for visual correlation
                const screenshotPath = path.join(
                    this.outputDir,
                    this.timestamp,
                    `${scenario.name}-${capturePoint.timing}.png`
                );
                
                await page.screenshot({
                    path: screenshotPath,
                    type: 'png',
                    fullPage: false
                });

                // Store correlation data
                result.capturePoints[capturePoint.timing] = {
                    description: capturePoint.description,
                    timestamp: Date.now() - navigationStart,
                    screenshot: screenshotPath,
                    performance: performanceData,
                    visualState: await this.analyzeVisualState(page)
                };
                
            } catch (error) {
                console.error(`    ❌ Failed to capture ${capturePoint.timing}:`, error.message);
                result.capturePoints[capturePoint.timing] = {
                    error: error.message,
                    timestamp: Date.now() - navigationStart
                };
            }
        }
    }

    async waitForCapturePoint(page, capturePoint) {
        switch (capturePoint.timing) {
            case 'domcontentloaded':
                // Already waited for this in goto
                break;
                
            case 'load':
                await page.waitForLoadState('load');
                break;
                
            case 'networkidle':
                await page.waitForLoadState('networkidle');
                break;
                
            case 'lcp':
                // Wait for Largest Contentful Paint
                await page.evaluate(() => {
                    return new Promise(resolve => {
                        new PerformanceObserver((list) => {
                            const entries = list.getEntries();
                            if (entries.length > 0) {
                                resolve();
                            }
                        }).observe({ type: 'largest-contentful-paint', buffered: true });
                    });
                });
                break;
                
            case 'fonts-load':
                await page.evaluate(() => document.fonts.ready);
                break;
                
            case 'images-load':
                await page.evaluate(() => {
                    const images = Array.from(document.images);
                    return Promise.all(images.map(img => {
                        if (img.complete) return Promise.resolve();
                        return new Promise(resolve => {
                            img.onload = resolve;
                            img.onerror = resolve;
                        });
                    }));
                });
                break;
                
            case 'immediate':
                // No wait needed
                break;
                
            default:
                if (capturePoint.delay) {
                    await page.waitForTimeout(capturePoint.delay);
                } else if (capturePoint.timing.startsWith('custom-')) {
                    const delay = parseInt(capturePoint.timing.split('-')[1].replace('s', '')) * 1000;
                    await page.waitForTimeout(delay);
                }
        }
    }

    async capturePointMetrics(page, timing) {
        return await page.evaluate((timingPoint) => {
            const performance = window.performance;
            const navigation = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');
            const lcp = performance.getEntriesByType('largest-contentful-paint');
            const cls = performance.getEntriesByType('layout-shift');
            
            return {
                timing: timingPoint,
                timestamp: Date.now(),
                navigation: navigation ? {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    ttfb: navigation.responseStart - navigation.requestStart,
                    domProcessing: navigation.domComplete - navigation.domLoading,
                    resourceLoadTime: navigation.loadEventStart - navigation.domContentLoadedEventEnd
                } : null,
                paint: {
                    firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
                    firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
                },
                lcp: lcp.length > 0 ? lcp[lcp.length - 1].startTime : 0,
                cls: cls.reduce((sum, entry) => sum + entry.value, 0),
                resources: performance.getEntriesByType('resource').length,
                memory: performance.memory ? {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize,
                    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
                } : null,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    scrollY: window.scrollY
                }
            };
        }, timing);
    }

    async analyzeVisualState(page) {
        return await page.evaluate(() => {
            const body = document.body;
            const computedStyle = window.getComputedStyle(body);
            
            return {
                bodyVisible: computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden',
                hasContent: body.innerText.length > 0,
                imageCount: document.images.length,
                loadedImages: Array.from(document.images).filter(img => img.complete && img.naturalHeight > 0).length,
                visibleElements: {
                    total: document.querySelectorAll('*:not([style*="display: none"])').length,
                    withText: document.querySelectorAll('*:not(:empty):not([style*="display: none"])').length,
                    buttons: document.querySelectorAll('button:not([style*="display: none"])').length,
                    videos: document.querySelectorAll('video:not([style*="display: none"])').length
                },
                criticalElements: {
                    faceScanner: document.querySelector('.face-id-scanner') !== null,
                    ctaButton: document.querySelector('.cta, .btn-primary, [data-cta]') !== null,
                    navigation: document.querySelector('nav, .navigation') !== null,
                    hero: document.querySelector('.hero, .hero-section') !== null
                },
                layoutMetrics: {
                    bodyHeight: body.offsetHeight,
                    bodyWidth: body.offsetWidth,
                    scrollHeight: body.scrollHeight,
                    scrollWidth: body.scrollWidth
                }
            };
        });
    }

    async testInteractivePerformanceCorrelation(page, scenario, result) {
        console.log('  🎮 Testing interactive performance correlation...');
        
        for (const interaction of scenario.interactions) {
            try {
                console.log(`    ⚡ Testing: ${interaction.type}`);
                
                const interactionStart = Date.now();
                
                // Capture before state
                const beforeMetrics = await this.capturePointMetrics(page, `${interaction.type}-before`);
                const beforeScreenshot = path.join(
                    this.outputDir,
                    this.timestamp,
                    `${scenario.name}-${interaction.type}-before.png`
                );
                await page.screenshot({ path: beforeScreenshot, type: 'png' });
                
                // Perform interaction
                await this.performInteraction(page, interaction);
                
                // Wait for interaction to complete
                await page.waitForTimeout(500);
                
                // Capture after state
                const afterMetrics = await this.capturePointMetrics(page, `${interaction.type}-after`);
                const afterScreenshot = path.join(
                    this.outputDir,
                    this.timestamp,
                    `${scenario.name}-${interaction.type}-after.png`
                );
                await page.screenshot({ path: afterScreenshot, type: 'png' });
                
                result.interactions[interaction.type] = {
                    description: interaction.description,
                    duration: Date.now() - interactionStart,
                    before: {
                        metrics: beforeMetrics,
                        screenshot: beforeScreenshot
                    },
                    after: {
                        metrics: afterMetrics,
                        screenshot: afterScreenshot
                    }
                };
                
            } catch (error) {
                console.error(`    ❌ Interaction ${interaction.type} failed:`, error.message);
                result.interactions[interaction.type] = {
                    error: error.message
                };
            }
        }
    }

    async performInteraction(page, interaction) {
        switch (interaction.type) {
            case 'face-id-click':
                const scanner = await page.$(interaction.element);
                if (scanner) await scanner.click();
                break;
                
            case 'video-open':
                const videoTrigger = await page.$(interaction.element);
                if (videoTrigger) await videoTrigger.click();
                break;
                
            case 'scroll-smooth':
                await page.evaluate(() => {
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                });
                break;
                
            case 'hover-effects':
                const element = await page.$(interaction.element);
                if (element) await element.hover();
                break;
                
            default:
                console.log(`Unknown interaction type: ${interaction.type}`);
        }
    }

    async setupPerformanceObserver(page) {
        return await page.evaluateOnNewDocument(() => {
            window.performanceEntries = [];
            
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    window.performanceEntries.push(...list.getEntries());
                });
                
                observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
            }
        });
    }

    async collectFinalMetrics(page) {
        return await page.evaluate(() => {
            const entries = window.performanceEntries || [];
            
            return {
                totalEntries: entries.length,
                navigationTiming: entries.filter(e => e.entryType === 'navigation'),
                paintTiming: entries.filter(e => e.entryType === 'paint'),
                lcpEntries: entries.filter(e => e.entryType === 'largest-contentful-paint'),
                layoutShifts: entries.filter(e => e.entryType === 'layout-shift'),
                firstInput: entries.filter(e => e.entryType === 'first-input'),
                resourceTiming: performance.getEntriesByType('resource').length
            };
        });
    }

    async analyzePerformanceVisualCorrelation(scenarioResult) {
        const analysis = {
            performanceIssues: [],
            visualIssues: [],
            correlatedIssues: [],
            performanceImpacts: [],
            visualRegressions: [],
            score: 0
        };

        // Analyze each capture point
        for (const [pointName, pointData] of Object.entries(scenarioResult.capturePoints || {})) {
            if (pointData.error) continue;
            
            const perf = pointData.performance;
            const visual = pointData.visualState;
            
            // Check performance thresholds
            if (perf.paint.firstContentfulPaint > this.performanceThresholds.fcp) {
                analysis.performanceIssues.push({
                    point: pointName,
                    metric: 'FCP',
                    value: perf.paint.firstContentfulPaint,
                    threshold: this.performanceThresholds.fcp,
                    severity: 'high'
                });
            }
            
            if (perf.lcp > this.performanceThresholds.lcp) {
                analysis.performanceIssues.push({
                    point: pointName,
                    metric: 'LCP',
                    value: perf.lcp,
                    threshold: this.performanceThresholds.lcp,
                    severity: 'high'
                });
            }
            
            if (perf.cls > this.performanceThresholds.cls) {
                analysis.performanceIssues.push({
                    point: pointName,
                    metric: 'CLS',
                    value: perf.cls,
                    threshold: this.performanceThresholds.cls,
                    severity: 'medium'
                });
                
                // Correlate layout shift with visual state
                analysis.correlatedIssues.push({
                    type: 'layout-shift-visual',
                    point: pointName,
                    description: `Layout shift of ${perf.cls.toFixed(3)} detected, potentially affecting visual stability`,
                    screenshot: pointData.screenshot,
                    severity: 'high'
                });
            }
            
            // Check visual issues
            if (!visual.bodyVisible) {
                analysis.visualIssues.push({
                    point: pointName,
                    issue: 'body-invisible',
                    description: 'Body element is not visible'
                });
            }
            
            if (!visual.hasContent && pointName !== 'immediate') {
                analysis.visualIssues.push({
                    point: pointName,
                    issue: 'no-content',
                    description: 'No text content visible'
                });
            }
            
            if (!visual.criticalElements.faceScanner && pointName !== 'immediate') {
                analysis.visualIssues.push({
                    point: pointName,
                    issue: 'missing-face-scanner',
                    description: 'Face ID scanner not found in DOM',
                    severity: 'critical'
                });
            }
            
            // Correlate performance with visual completeness
            const visualCompleteness = this.calculateVisualCompleteness(visual);
            if (perf.paint.firstContentfulPaint > 0 && visualCompleteness < 0.5) {
                analysis.correlatedIssues.push({
                    type: 'performance-visual-mismatch',
                    point: pointName,
                    description: `FCP occurred at ${perf.paint.firstContentfulPaint}ms but visual completeness is only ${Math.round(visualCompleteness * 100)}%`,
                    severity: 'medium'
                });
            }
        }

        // Calculate overall score
        analysis.score = this.calculateCorrelationScore(analysis);
        
        return analysis;
    }

    calculateVisualCompleteness(visualState) {
        let score = 0;
        let total = 0;
        
        // Check critical elements (60% of score)
        const criticalWeight = 0.6;
        const criticalCount = Object.keys(visualState.criticalElements).length;
        const criticalPresent = Object.values(visualState.criticalElements).filter(Boolean).length;
        score += (criticalPresent / criticalCount) * criticalWeight;
        
        // Check content presence (20% of score)
        if (visualState.hasContent) score += 0.2;
        
        // Check image loading (10% of score)
        if (visualState.imageCount > 0) {
            score += (visualState.loadedImages / visualState.imageCount) * 0.1;
        } else {
            score += 0.1; // No images to load
        }
        
        // Check body visibility (10% of score)
        if (visualState.bodyVisible) score += 0.1;
        
        return Math.min(score, 1);
    }

    calculateCorrelationScore(analysis) {
        let score = 100;
        
        // Deduct for performance issues
        score -= analysis.performanceIssues.length * 10;
        
        // Deduct for visual issues
        score -= analysis.visualIssues.length * 15;
        
        // Deduct heavily for correlated issues
        score -= analysis.correlatedIssues.length * 20;
        
        return Math.max(score, 0);
    }

    calculateOverallScore(results) {
        const scores = Object.values(results.correlationAnalysis)
            .map(analysis => analysis.score)
            .filter(score => typeof score === 'number');
            
        return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    }

    generatePerformanceVisualInsights(results) {
        const insights = [];
        
        // Analyze common issues across scenarios
        const allIssues = Object.values(results.correlationAnalysis)
            .flatMap(analysis => [
                ...analysis.performanceIssues,
                ...analysis.visualIssues,
                ...analysis.correlatedIssues
            ]);

        const issueTypes = {};
        allIssues.forEach(issue => {
            const key = issue.metric || issue.issue || issue.type;
            issueTypes[key] = (issueTypes[key] || 0) + 1;
        });

        // Generate insights based on patterns
        Object.entries(issueTypes).forEach(([issueType, count]) => {
            if (count > 1) {
                insights.push({
                    type: 'pattern',
                    severity: count > 3 ? 'critical' : 'high',
                    message: `${issueType} issues found across ${count} scenarios - systematic problem detected`
                });
            }
        });

        if (results.summary.correlatedIssues > 0) {
            insights.push({
                type: 'correlation',
                severity: 'high',
                message: `Performance optimizations may be affecting visual presentation (${results.summary.correlatedIssues} correlations found)`
            });
        }

        if (results.summary.overallScore < 70) {
            insights.push({
                type: 'overall',
                severity: 'critical',
                message: `Overall performance-visual correlation score is low (${results.summary.overallScore}/100)`
            });
        }

        return insights;
    }

    async generateCorrelationReport(results) {
        const reportPath = path.join(this.outputDir, this.timestamp, 'performance-visual-report.json');
        const htmlReportPath = path.join(this.outputDir, this.timestamp, 'performance-visual-report.html');
        
        // Save JSON report
        await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
        
        // Generate HTML report
        const htmlReport = this.generateCorrelationHtmlReport(results);
        await fs.writeFile(htmlReportPath, htmlReport);
        
        console.log(`\n📊 Performance-Visual Correlation Reports generated:`);
        console.log(`   JSON: ${reportPath}`);
        console.log(`   HTML: ${htmlReportPath}`);
        
        // Print summary
        this.printCorrelationSummary(results);
    }

    generateCorrelationHtmlReport(results) {
        const scenarioSections = Object.entries(results.scenarios)
            .map(([scenarioName, scenario]) => {
                if (scenario.error) {
                    return `
                        <div class="scenario-section error">
                            <h3>${scenarioName} ❌</h3>
                            <p>Error: ${scenario.error}</p>
                        </div>
                    `;
                }

                const capturePointsHtml = Object.entries(scenario.capturePoints || {})
                    .map(([pointName, pointData]) => {
                        if (pointData.error) return `<div class="capture-point error">${pointName}: ${pointData.error}</div>`;
                        
                        const screenshot = pointData.screenshot ? 
                            `<img src="${path.basename(pointData.screenshot)}" alt="${pointName}" loading="lazy">` :
                            '<p>No screenshot</p>';
                        
                        const perf = pointData.performance;
                        const perfSummary = perf ? `
                            <div class="perf-metrics">
                                <span>FCP: ${perf.paint.firstContentfulPaint}ms</span>
                                <span>LCP: ${perf.lcp}ms</span>
                                <span>CLS: ${perf.cls.toFixed(3)}</span>
                            </div>
                        ` : '';
                        
                        return `
                            <div class="capture-point">
                                <h5>${pointName}</h5>
                                <p>${pointData.description}</p>
                                ${perfSummary}
                                ${screenshot}
                            </div>
                        `;
                    }).join('');

                const analysis = results.correlationAnalysis[scenarioName];
                const analysisHtml = analysis ? `
                    <div class="analysis-summary">
                        <h4>Analysis (Score: ${analysis.score}/100)</h4>
                        <div class="issue-counts">
                            <span class="performance-issues">Performance Issues: ${analysis.performanceIssues.length}</span>
                            <span class="visual-issues">Visual Issues: ${analysis.visualIssues.length}</span>
                            <span class="correlated-issues">Correlated Issues: ${analysis.correlatedIssues.length}</span>
                        </div>
                    </div>
                ` : '';

                return `
                    <div class="scenario-section">
                        <h3>${scenarioName}</h3>
                        <p>${scenario.description}</p>
                        ${analysisHtml}
                        <div class="capture-points-grid">${capturePointsHtml}</div>
                    </div>
                `;
            }).join('');

        const insightsHtml = results.insights?.map(insight => `
            <div class="insight insight-${insight.severity}">
                <strong>${insight.type.toUpperCase()}</strong>
                <p>${insight.message}</p>
            </div>
        `).join('') || '';

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>FacePay Performance + Visual Correlation Report</title>
            <style>
                body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
                .container { max-width: 1400px; margin: 0 auto; }
                .header { background: linear-gradient(135deg, #8b5cf6, #06b6d4); color: white; padding: 25px; border-radius: 12px; margin-bottom: 30px; }
                .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
                .stat { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .stat-number { font-size: 2rem; font-weight: bold; color: #8b5cf6; }
                .scenario-section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .analysis-summary { background: #f1f5f9; padding: 15px; border-radius: 6px; margin: 15px 0; }
                .issue-counts { display: flex; gap: 15px; margin-top: 10px; }
                .issue-counts span { padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; }
                .performance-issues { background: #fef2f2; color: #991b1b; }
                .visual-issues { background: #fffbeb; color: #92400e; }
                .correlated-issues { background: #f0f9ff; color: #1e40af; }
                .capture-points-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
                .capture-point { border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; }
                .capture-point img { width: 100%; border-radius: 4px; }
                .perf-metrics { display: flex; gap: 10px; margin: 10px 0; font-size: 0.9rem; }
                .perf-metrics span { background: #e2e8f0; padding: 2px 6px; border-radius: 4px; }
                .insights { background: white; padding: 25px; border-radius: 12px; margin-top: 30px; }
                .insight { padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid; }
                .insight-critical { background: #fef2f2; border-color: #dc2626; }
                .insight-high { background: #fff7ed; border-color: #ea580c; }
                .insight-medium { background: #fffbeb; border-color: #d97706; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📊 FacePay Performance + Visual Correlation</h1>
                    <p>Generated: ${new Date(results.timestamp).toLocaleString()}</p>
                    <p>Overall Score: ${results.summary.overallScore}/100</p>
                </div>

                <div class="summary">
                    <div class="stat">
                        <div class="stat-number">${results.summary.totalScenarios}</div>
                        <div>Scenarios Tested</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${results.summary.performanceIssues}</div>
                        <div>Performance Issues</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${results.summary.visualIssues}</div>
                        <div>Visual Issues</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${results.summary.correlatedIssues}</div>
                        <div>Correlated Issues</div>
                    </div>
                </div>

                ${scenarioSections}

                ${results.insights?.length > 0 ? `
                    <div class="insights">
                        <h2>💡 Performance-Visual Insights</h2>
                        ${insightsHtml}
                    </div>
                ` : ''}
            </div>
        </body>
        </html>
        `;
    }

    printCorrelationSummary(results) {
        console.log('\n' + '='.repeat(70));
        console.log('📊 FACEPAY PERFORMANCE + VISUAL CORRELATION SUMMARY');
        console.log('='.repeat(70));
        console.log(`📊 Overall Score: ${results.summary.overallScore}/100`);
        console.log(`🔬 Scenarios Tested: ${results.summary.totalScenarios}`);
        console.log(`⚡ Performance Issues: ${results.summary.performanceIssues}`);
        console.log(`🎨 Visual Issues: ${results.summary.visualIssues}`);
        console.log(`🔗 Correlated Issues: ${results.summary.correlatedIssues}`);
        
        if (results.insights?.length > 0) {
            console.log(`\n💡 Key Insights: ${results.insights.length}`);
            results.insights.slice(0, 3).forEach(insight => {
                console.log(`   • ${insight.type.toUpperCase()}: ${insight.message}`);
            });
        }
        
        console.log('='.repeat(70));
    }
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const baseUrl = args[0] || 'http://localhost:8000';
    
    const correlationTester = new PerformanceVisualCorrelation({ baseUrl });
    
    correlationTester.runPerformanceVisualCorrelation()
        .then(results => {
            console.log('\n✅ Performance + visual correlation testing completed!');
            process.exit(results.summary.correlatedIssues > 0 ? 1 : 0);
        })
        .catch(error => {
            console.error('\n❌ Performance + visual correlation testing failed:', error);
            process.exit(1);
        });
}

module.exports = PerformanceVisualCorrelation;