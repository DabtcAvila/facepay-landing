#!/usr/bin/env node

/**
 * FacePay Interactive Elements Visual Testing
 * 
 * Specialized testing for interactive components including:
 * - Face ID scanner states and animations
 * - Button hover/focus/active states
 * - Video modal interactions
 * - Mobile touch interactions
 * - Micro-animations and transitions
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class InteractiveElementsTesting {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || 'http://localhost:8000';
        this.outputDir = options.outputDir || path.join(__dirname, '../../interactive-test-results');
        this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Interactive test scenarios
        this.interactionTests = [
            {
                name: 'face-id-scanner-states',
                description: 'Test all Face ID scanner states and transitions',
                steps: [
                    { action: 'initial', description: 'Scanner initial state' },
                    { action: 'hover', description: 'Mouse hover state' },
                    { action: 'click', description: 'Scanner activation' },
                    { action: 'scanning', description: 'Active scanning state' },
                    { action: 'success', description: 'Successful scan state' },
                    { action: 'error', description: 'Error state' }
                ]
            },
            {
                name: 'cta-buttons-interactions',
                description: 'Test all CTA button states and animations',
                steps: [
                    { action: 'default', description: 'Default button state' },
                    { action: 'hover', description: 'Hover animation' },
                    { action: 'focus', description: 'Focus state (keyboard)' },
                    { action: 'active', description: 'Active/pressed state' },
                    { action: 'loading', description: 'Loading state animation' }
                ]
            },
            {
                name: 'video-modal-interactions',
                description: 'Test video modal behavior and states',
                steps: [
                    { action: 'closed', description: 'Modal closed state' },
                    { action: 'opening', description: 'Modal opening animation' },
                    { action: 'open', description: 'Modal fully open' },
                    { action: 'playing', description: 'Video playing state' },
                    { action: 'paused', description: 'Video paused state' },
                    { action: 'closing', description: 'Modal closing animation' }
                ]
            },
            {
                name: 'mobile-touch-interactions',
                description: 'Test mobile-specific touch interactions',
                steps: [
                    { action: 'tap-feedback', description: 'Touch tap feedback' },
                    { action: 'swipe-gesture', description: 'Swipe interactions' },
                    { action: 'long-press', description: 'Long press states' },
                    { action: 'scroll-momentum', description: 'Scroll momentum effects' }
                ]
            },
            {
                name: 'form-interactions',
                description: 'Test form elements and validation states',
                steps: [
                    { action: 'empty', description: 'Empty form state' },
                    { action: 'focus', description: 'Input focus state' },
                    { action: 'typing', description: 'Active typing state' },
                    { action: 'validation-error', description: 'Validation error state' },
                    { action: 'validation-success', description: 'Validation success state' }
                ]
            },
            {
                name: 'scroll-animations',
                description: 'Test scroll-triggered animations and effects',
                steps: [
                    { action: 'viewport-enter', description: 'Element entering viewport' },
                    { action: 'viewport-center', description: 'Element in center of viewport' },
                    { action: 'viewport-exit', description: 'Element exiting viewport' },
                    { action: 'parallax-effect', description: 'Parallax scrolling effect' }
                ]
            }
        ];

        // Viewports for interaction testing
        this.viewports = {
            mobile: { width: 375, height: 667, deviceScaleFactor: 2, isMobile: true },
            tablet: { width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true },
            desktop: { width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false }
        };
    }

    async runInteractiveTests() {
        await this.init();
        
        const results = {
            timestamp: this.timestamp,
            baseUrl: this.baseUrl,
            interactionResults: {},
            summary: {
                totalInteractions: 0,
                successful: 0,
                failed: 0,
                warnings: 0
            },
            issues: []
        };

        // Test each viewport
        for (const [viewportName, viewport] of Object.entries(this.viewports)) {
            console.log(`\n📱 Testing interactions on ${viewportName} (${viewport.width}x${viewport.height})`);
            
            const browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--enable-features=TouchEvents'
                ]
            });

            try {
                const viewportResults = await this.testViewportInteractions(browser, viewportName, viewport);
                results.interactionResults[viewportName] = viewportResults;
                
                results.summary.totalInteractions += viewportResults.summary.totalInteractions;
                results.summary.successful += viewportResults.summary.successful;
                results.summary.failed += viewportResults.summary.failed;
                results.summary.warnings += viewportResults.summary.warnings;
                results.issues.push(...viewportResults.issues);
                
            } catch (error) {
                console.error(`❌ Error testing ${viewportName}:`, error);
                results.issues.push({
                    type: 'viewport_error',
                    viewport: viewportName,
                    message: error.message
                });
            }

            await browser.close();
        }

        // Generate comprehensive report
        await this.generateInteractiveReport(results);
        
        return results;
    }

    async init() {
        await fs.mkdir(this.outputDir, { recursive: true });
        await fs.mkdir(path.join(this.outputDir, this.timestamp), { recursive: true });
        
        console.log(`🎮 Interactive Elements Testing Started`);
        console.log(`📁 Output Directory: ${this.outputDir}/${this.timestamp}`);
    }

    async testViewportInteractions(browser, viewportName, viewport) {
        const page = await browser.newPage();
        
        // Configure viewport
        await page.setViewport(viewport);
        
        // Enable touch events for mobile testing
        if (viewport.isMobile) {
            await page.emulateMediaType('screen');
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'maxTouchPoints', { value: 1 });
            });
        }

        const results = {
            viewport: viewportName,
            interactions: {},
            summary: {
                totalInteractions: 0,
                successful: 0,
                failed: 0,
                warnings: 0
            },
            issues: []
        };

        try {
            // Navigate to the page
            await page.goto(this.baseUrl, { 
                waitUntil: ['domcontentloaded', 'networkidle0'],
                timeout: 30000 
            });

            // Wait for critical elements
            await page.waitForSelector('body', { timeout: 10000 });
            
            // Test each interaction scenario
            for (const interactionTest of this.interactionTests) {
                console.log(`  🎬 Testing: ${interactionTest.name}`);
                
                try {
                    const interactionResult = await this.testInteractionScenario(
                        page, 
                        interactionTest, 
                        viewportName,
                        viewport.isMobile
                    );
                    
                    results.interactions[interactionTest.name] = interactionResult;
                    results.summary.totalInteractions += interactionTest.steps.length;
                    results.summary.successful += interactionResult.successfulSteps;
                    results.summary.failed += interactionResult.failedSteps;
                    results.summary.warnings += interactionResult.warnings;
                    
                    if (interactionResult.issues.length > 0) {
                        results.issues.push(...interactionResult.issues);
                    }
                    
                } catch (error) {
                    console.error(`    ❌ Interaction test ${interactionTest.name} failed:`, error);
                    results.summary.failed += interactionTest.steps.length;
                    results.issues.push({
                        type: 'interaction_error',
                        interaction: interactionTest.name,
                        viewport: viewportName,
                        message: error.message
                    });
                }
            }

        } catch (error) {
            console.error(`❌ Major error in viewport ${viewportName}:`, error);
            results.issues.push({
                type: 'critical',
                viewport: viewportName,
                message: error.message
            });
        }

        await page.close();
        return results;
    }

    async testInteractionScenario(page, interactionTest, viewportName, isMobile) {
        const result = {
            name: interactionTest.name,
            description: interactionTest.description,
            steps: {},
            successfulSteps: 0,
            failedSteps: 0,
            warnings: 0,
            issues: []
        };

        // Reset to initial state
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1000);

        for (const step of interactionTest.steps) {
            try {
                console.log(`    🔄 Step: ${step.action}`);
                
                const stepResult = await this.executeInteractionStep(
                    page, 
                    interactionTest.name, 
                    step, 
                    viewportName,
                    isMobile
                );
                
                result.steps[step.action] = stepResult;
                
                if (stepResult.success) {
                    result.successfulSteps++;
                } else {
                    result.failedSteps++;
                    result.issues.push(...stepResult.issues);
                }
                
                if (stepResult.warnings > 0) {
                    result.warnings += stepResult.warnings;
                }
                
            } catch (error) {
                console.error(`      ❌ Step ${step.action} failed:`, error.message);
                result.failedSteps++;
                result.issues.push({
                    type: 'step_error',
                    step: step.action,
                    message: error.message
                });
            }
        }

        return result;
    }

    async executeInteractionStep(page, interactionName, step, viewportName, isMobile) {
        const stepResult = {
            action: step.action,
            success: true,
            screenshot: null,
            metrics: {},
            warnings: 0,
            issues: []
        };

        try {
            // Prepare for the specific interaction step
            await this.prepareInteractionStep(page, interactionName, step, isMobile);
            
            // Wait for animations to complete
            await page.waitForTimeout(500);
            
            // Capture performance metrics before screenshot
            const beforeMetrics = await this.captureInteractionMetrics(page);
            
            // Take screenshot of the interaction state
            const screenshotPath = path.join(
                this.outputDir,
                this.timestamp,
                `${viewportName}-${interactionName}-${step.action}.png`
            );
            
            await page.screenshot({
                path: screenshotPath,
                type: 'png',
                fullPage: false
            });

            stepResult.screenshot = screenshotPath;
            
            // Capture post-interaction metrics
            const afterMetrics = await this.captureInteractionMetrics(page);
            
            stepResult.metrics = {
                before: beforeMetrics,
                after: afterMetrics,
                interaction: interactionName,
                step: step.action
            };

            // Validate the interaction result
            const validation = await this.validateInteractionStep(page, interactionName, step);
            if (!validation.valid) {
                stepResult.success = false;
                stepResult.issues.push(...validation.issues);
            }

            if (validation.warnings > 0) {
                stepResult.warnings = validation.warnings;
            }

        } catch (error) {
            stepResult.success = false;
            stepResult.issues.push({
                type: 'execution_error',
                step: step.action,
                message: error.message
            });
        }

        return stepResult;
    }

    async prepareInteractionStep(page, interactionName, step, isMobile) {
        switch (interactionName) {
            case 'face-id-scanner-states':
                await this.prepareFaceIdScanner(page, step, isMobile);
                break;
                
            case 'cta-buttons-interactions':
                await this.prepareButtonInteractions(page, step, isMobile);
                break;
                
            case 'video-modal-interactions':
                await this.prepareVideoModal(page, step, isMobile);
                break;
                
            case 'mobile-touch-interactions':
                if (isMobile) {
                    await this.prepareMobileTouchInteractions(page, step);
                }
                break;
                
            case 'form-interactions':
                await this.prepareFormInteractions(page, step, isMobile);
                break;
                
            case 'scroll-animations':
                await this.prepareScrollAnimations(page, step, isMobile);
                break;
                
            default:
                // Default preparation
                await page.waitForTimeout(200);
        }
    }

    async prepareFaceIdScanner(page, step, isMobile) {
        const scanner = await page.$('.face-id-scanner');
        if (!scanner) return;

        switch (step.action) {
            case 'initial':
                // Just wait for scanner to be ready
                break;
                
            case 'hover':
                if (!isMobile) {
                    await scanner.hover();
                }
                break;
                
            case 'click':
                await scanner.click();
                break;
                
            case 'scanning':
                await scanner.click();
                await page.waitForTimeout(1000); // Wait for scanning animation
                break;
                
            case 'success':
                // Simulate successful scan
                await page.evaluate(() => {
                    const scannerEl = document.querySelector('.face-id-scanner');
                    if (scannerEl) {
                        scannerEl.classList.add('scan-success');
                        scannerEl.dispatchEvent(new CustomEvent('scan-complete', { detail: { success: true } }));
                    }
                });
                break;
                
            case 'error':
                // Simulate scan error
                await page.evaluate(() => {
                    const scannerEl = document.querySelector('.face-id-scanner');
                    if (scannerEl) {
                        scannerEl.classList.add('scan-error');
                        scannerEl.dispatchEvent(new CustomEvent('scan-complete', { detail: { success: false } }));
                    }
                });
                break;
        }
        
        await page.waitForTimeout(300);
    }

    async prepareButtonInteractions(page, step, isMobile) {
        const buttons = await page.$$('button, .btn, .cta, [role="button"]');
        if (buttons.length === 0) return;

        const button = buttons[0]; // Test first button

        switch (step.action) {
            case 'default':
                // Ensure button is in default state
                await page.evaluate(btn => {
                    btn.blur();
                    btn.classList.remove('hover', 'focus', 'active', 'loading');
                }, button);
                break;
                
            case 'hover':
                if (!isMobile) {
                    await button.hover();
                }
                break;
                
            case 'focus':
                await button.focus();
                break;
                
            case 'active':
                // Simulate active/pressed state
                await page.evaluate(btn => {
                    btn.classList.add('active');
                    btn.dispatchEvent(new MouseEvent('mousedown'));
                }, button);
                break;
                
            case 'loading':
                // Simulate loading state
                await page.evaluate(btn => {
                    btn.classList.add('loading');
                    btn.disabled = true;
                }, button);
                break;
        }
        
        await page.waitForTimeout(300);
    }

    async prepareVideoModal(page, step, isMobile) {
        switch (step.action) {
            case 'closed':
                // Ensure modal is closed
                await page.evaluate(() => {
                    const modal = document.querySelector('[data-video-modal]');
                    if (modal) {
                        modal.style.display = 'none';
                        modal.classList.remove('open');
                    }
                });
                break;
                
            case 'opening':
                const trigger = await page.$('[data-video-trigger]');
                if (trigger) {
                    await trigger.click();
                    await page.waitForTimeout(200); // Catch opening animation
                }
                break;
                
            case 'open':
                const trigger2 = await page.$('[data-video-trigger]');
                if (trigger2) {
                    await trigger2.click();
                    await page.waitForTimeout(800); // Wait for full open
                }
                break;
                
            case 'playing':
                // Simulate video playing
                await page.evaluate(() => {
                    const video = document.querySelector('video');
                    if (video) {
                        video.currentTime = 1;
                        video.play();
                    }
                });
                await page.waitForTimeout(500);
                break;
                
            case 'paused':
                await page.evaluate(() => {
                    const video = document.querySelector('video');
                    if (video) {
                        video.pause();
                    }
                });
                break;
                
            case 'closing':
                const closeBtn = await page.$('[data-video-close]');
                if (closeBtn) {
                    await closeBtn.click();
                    await page.waitForTimeout(200); // Catch closing animation
                }
                break;
        }
    }

    async prepareMobileTouchInteractions(page, step) {
        switch (step.action) {
            case 'tap-feedback':
                const touchTarget = await page.$('[data-touch]') || await page.$('button');
                if (touchTarget) {
                    await touchTarget.tap();
                }
                break;
                
            case 'swipe-gesture':
                // Simulate swipe gesture
                await page.evaluate(() => {
                    const element = document.body;
                    const startEvent = new TouchEvent('touchstart', {
                        touches: [{ clientX: 200, clientY: 300 }]
                    });
                    const endEvent = new TouchEvent('touchend', {
                        touches: [{ clientX: 100, clientY: 300 }]
                    });
                    element.dispatchEvent(startEvent);
                    setTimeout(() => element.dispatchEvent(endEvent), 100);
                });
                break;
                
            case 'long-press':
                const longPressTarget = await page.$('button') || await page.$('[data-touch]');
                if (longPressTarget) {
                    await longPressTarget.click({ delay: 800 });
                }
                break;
                
            case 'scroll-momentum':
                await page.evaluate(() => {
                    window.scrollTo({ top: 500, behavior: 'smooth' });
                });
                await page.waitForTimeout(800);
                break;
        }
    }

    async prepareFormInteractions(page, step, isMobile) {
        const input = await page.$('input[type="email"], input[type="text"], textarea');
        if (!input) return;

        switch (step.action) {
            case 'empty':
                await page.evaluate(inp => inp.value = '', input);
                break;
                
            case 'focus':
                await input.focus();
                break;
                
            case 'typing':
                await input.focus();
                await input.type('test@example.com', { delay: 50 });
                break;
                
            case 'validation-error':
                await input.focus();
                await input.type('invalid-email', { delay: 50 });
                // Trigger validation
                await page.keyboard.press('Tab');
                break;
                
            case 'validation-success':
                await input.focus();
                await page.evaluate(inp => inp.value = '', input);
                await input.type('valid@example.com', { delay: 50 });
                await page.keyboard.press('Tab');
                break;
        }
        
        await page.waitForTimeout(300);
    }

    async prepareScrollAnimations(page, step, isMobile) {
        switch (step.action) {
            case 'viewport-enter':
                await page.evaluate(() => {
                    window.scrollTo({ top: 0, behavior: 'instant' });
                });
                await page.waitForTimeout(200);
                await page.evaluate(() => {
                    window.scrollTo({ top: window.innerHeight * 0.5, behavior: 'smooth' });
                });
                break;
                
            case 'viewport-center':
                await page.evaluate(() => {
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                });
                break;
                
            case 'viewport-exit':
                await page.evaluate(() => {
                    window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' });
                });
                break;
                
            case 'parallax-effect':
                await page.evaluate(() => {
                    for (let i = 0; i < 5; i++) {
                        setTimeout(() => {
                            window.scrollTo({ top: window.innerHeight * (i * 0.3), behavior: 'smooth' });
                        }, i * 200);
                    }
                });
                break;
        }
        
        await page.waitForTimeout(800);
    }

    async captureInteractionMetrics(page) {
        return await page.evaluate(() => {
            return {
                timestamp: Date.now(),
                scrollY: window.scrollY,
                activeElement: document.activeElement?.tagName || null,
                animationsRunning: document.getAnimations().length,
                performance: {
                    memory: performance.memory ? {
                        usedJSHeapSize: performance.memory.usedJSHeapSize,
                        totalJSHeapSize: performance.memory.totalJSHeapSize
                    } : null
                }
            };
        });
    }

    async validateInteractionStep(page, interactionName, step) {
        const validation = { valid: true, warnings: 0, issues: [] };

        try {
            switch (interactionName) {
                case 'face-id-scanner-states':
                    const scanner = await page.$('.face-id-scanner');
                    if (!scanner && step.action !== 'initial') {
                        validation.valid = false;
                        validation.issues.push({
                            type: 'missing_element',
                            message: 'Face ID scanner not found for interaction'
                        });
                    }
                    break;
                    
                case 'video-modal-interactions':
                    if (step.action === 'open') {
                        const modal = await page.$('[data-video-modal]');
                        if (!modal) {
                            validation.warnings++;
                            validation.issues.push({
                                type: 'warning',
                                message: 'Video modal not found or not opening'
                            });
                        }
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

    async generateInteractiveReport(results) {
        const reportPath = path.join(this.outputDir, this.timestamp, 'interactive-test-report.json');
        const htmlReportPath = path.join(this.outputDir, this.timestamp, 'interactive-test-report.html');
        
        // Save JSON report
        await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
        
        // Generate HTML report
        const htmlReport = this.generateInteractiveHtmlReport(results);
        await fs.writeFile(htmlReportPath, htmlReport);
        
        console.log(`\n📊 Interactive Testing Reports generated:`);
        console.log(`   JSON: ${reportPath}`);
        console.log(`   HTML: ${htmlReportPath}`);
        
        // Print summary
        this.printInteractiveSummary(results);
    }

    generateInteractiveHtmlReport(results) {
        // Generate HTML report (simplified version)
        const viewportSections = Object.entries(results.interactionResults)
            .map(([viewport, data]) => {
                const interactionHtml = Object.entries(data.interactions)
                    .map(([interactionName, interaction]) => {
                        const stepsHtml = Object.entries(interaction.steps)
                            .map(([stepName, step]) => {
                                const statusClass = step.success ? 'success' : 'failed';
                                const screenshot = step.screenshot ? 
                                    `<img src="${path.basename(step.screenshot)}" alt="${stepName}" loading="lazy">` : 
                                    '<p>No screenshot available</p>';
                                
                                return `
                                    <div class="step-result ${statusClass}">
                                        <h5>${stepName} ${step.success ? '✅' : '❌'}</h5>
                                        ${screenshot}
                                    </div>
                                `;
                            }).join('');
                        
                        return `
                            <div class="interaction-group">
                                <h4>${interactionName}</h4>
                                <p>${interaction.description}</p>
                                <div class="steps-grid">${stepsHtml}</div>
                            </div>
                        `;
                    }).join('');
                
                return `
                    <div class="viewport-section">
                        <h3>${viewport} - ${data.summary.successful}/${data.summary.totalInteractions} successful</h3>
                        ${interactionHtml}
                    </div>
                `;
            }).join('');

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>FacePay Interactive Elements Testing Report</title>
            <style>
                body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
                .container { max-width: 1400px; margin: 0 auto; }
                .header { background: #4f46e5; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
                .viewport-section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; }
                .interaction-group { margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 6px; }
                .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
                .step-result { padding: 10px; border-radius: 4px; }
                .step-result.success { background: #f0fdf4; border: 1px solid #bbf7d0; }
                .step-result.failed { background: #fef2f2; border: 1px solid #fecaca; }
                .step-result img { width: 100%; border-radius: 4px; }
                .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
                .stat { background: white; padding: 20px; text-align: center; border-radius: 8px; }
                .stat-number { font-size: 2rem; font-weight: bold; color: #4f46e5; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎮 FacePay Interactive Elements Testing</h1>
                    <p>Generated: ${new Date(results.timestamp).toLocaleString()}</p>
                </div>
                
                <div class="summary">
                    <div class="stat">
                        <div class="stat-number">${results.summary.totalInteractions}</div>
                        <div>Total Interactions</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${results.summary.successful}</div>
                        <div>Successful</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${results.summary.failed}</div>
                        <div>Failed</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${results.summary.warnings}</div>
                        <div>Warnings</div>
                    </div>
                </div>

                ${viewportSections}
            </div>
        </body>
        </html>
        `;
    }

    printInteractiveSummary(results) {
        console.log('\n' + '='.repeat(70));
        console.log('🎮 FACEPAY INTERACTIVE ELEMENTS TESTING SUMMARY');
        console.log('='.repeat(70));
        console.log(`📊 Total Interactions: ${results.summary.totalInteractions}`);
        console.log(`✅ Successful: ${results.summary.successful}`);
        console.log(`❌ Failed: ${results.summary.failed}`);
        console.log(`⚠️  Warnings: ${results.summary.warnings}`);
        
        Object.entries(results.interactionResults).forEach(([viewport, data]) => {
            const successRate = Math.round((data.summary.successful / data.summary.totalInteractions) * 100);
            console.log(`📱 ${viewport}: ${successRate}% success rate`);
        });
        
        if (results.issues.length > 0) {
            console.log(`\n🚨 Issues Found: ${results.issues.length}`);
            results.issues.slice(0, 3).forEach(issue => {
                console.log(`   • ${issue.type}: ${issue.message}`);
            });
        }
        
        console.log('='.repeat(70));
    }
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const baseUrl = args[0] || 'http://localhost:8000';
    
    const tester = new InteractiveElementsTesting({ baseUrl });
    
    tester.runInteractiveTests()
        .then(results => {
            console.log('\n✅ Interactive elements testing completed!');
            process.exit(results.summary.failed > 0 ? 1 : 0);
        })
        .catch(error => {
            console.error('\n❌ Interactive testing failed:', error);
            process.exit(1);
        });
}

module.exports = InteractiveElementsTesting;