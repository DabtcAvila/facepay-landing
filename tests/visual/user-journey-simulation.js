#!/usr/bin/env node

/**
 * FacePay User Journey Visual Simulation
 * 
 * Simulates complete user journeys through the FacePay landing page
 * with visual documentation of each critical step in the conversion funnel.
 * 
 * User Journeys:
 * 1. First-time visitor discovery journey
 * 2. Face ID curious user journey  
 * 3. Mobile-first user journey
 * 4. Video engagement journey
 * 5. Conversion/signup journey
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class UserJourneySimulation {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || 'http://localhost:8000';
        this.outputDir = options.outputDir || path.join(__dirname, '../../user-journey-results');
        this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Define user journey scenarios
        this.userJourneys = [
            {
                name: 'first-time-visitor',
                description: 'New user discovering FacePay for the first time',
                persona: 'Crypto-curious user who has never used Face ID for payments',
                device: 'desktop',
                steps: [
                    { action: 'landing', description: 'Initial page load and first impression', wait: 2000 },
                    { action: 'hero-scan', description: 'User reads hero section and value proposition', wait: 3000 },
                    { action: 'face-id-curiosity', description: 'User notices Face ID scanner and hovers', wait: 1500 },
                    { action: 'scroll-learn-more', description: 'User scrolls to learn more about the concept', wait: 2000 },
                    { action: 'video-interest', description: 'User discovers video demonstration', wait: 1000 },
                    { action: 'social-proof', description: 'User checks testimonials and social proof', wait: 2500 },
                    { action: 'cta-consideration', description: 'User considers main call-to-action', wait: 1500 },
                    { action: 'final-decision', description: 'User makes decision to engage or leave', wait: 1000 }
                ]
            },
            {
                name: 'face-id-power-user',
                description: 'Tech-savvy user familiar with Face ID wanting to explore crypto use case',
                persona: 'iPhone user who uses Face ID daily, interested in crypto innovation',
                device: 'mobile',
                steps: [
                    { action: 'mobile-landing', description: 'Lands on mobile optimized version', wait: 1500 },
                    { action: 'face-id-immediate-recognition', description: 'Immediately recognizes Face ID value', wait: 1000 },
                    { action: 'tap-face-scanner', description: 'Immediately interacts with Face ID scanner', wait: 2000 },
                    { action: 'scan-simulation', description: 'Experiences simulated scan process', wait: 3000 },
                    { action: 'username-concept', description: 'Discovers @username payment concept', wait: 2000 },
                    { action: 'zero-gas-appeal', description: 'Sees zero gas fees benefit', wait: 1500 },
                    { action: 'quick-video-check', description: 'Quick video preview for validation', wait: 2000 },
                    { action: 'mobile-cta-tap', description: 'Ready to sign up immediately', wait: 1000 }
                ]
            },
            {
                name: 'video-engagement-journey',
                description: 'User primarily motivated by video demonstration',
                persona: 'Visual learner who needs to see the product in action',
                device: 'tablet',
                steps: [
                    { action: 'tablet-landing', description: 'Lands on tablet-optimized view', wait: 1500 },
                    { action: 'quick-hero-scan', description: 'Quick scan of hero section', wait: 1000 },
                    { action: 'video-discovery', description: 'Finds and focuses on video element', wait: 1000 },
                    { action: 'video-modal-open', description: 'Opens video in modal/fullscreen', wait: 1500 },
                    { action: 'video-watching', description: 'Actively watching demonstration', wait: 5000 },
                    { action: 'video-paused-reflection', description: 'Pauses video to process information', wait: 2000 },
                    { action: 'video-resume', description: 'Resumes watching to completion', wait: 3000 },
                    { action: 'post-video-exploration', description: 'Explores page with new understanding', wait: 2500 },
                    { action: 'convinced-conversion', description: 'Convinced by video, moves to CTA', wait: 1000 }
                ]
            },
            {
                name: 'mobile-native-journey',
                description: 'Mobile-first user expecting native app-like experience',
                persona: 'Gen Z user who primarily uses mobile for everything',
                device: 'mobile',
                steps: [
                    { action: 'mobile-immediate-load', description: 'Expects instant mobile load', wait: 1000 },
                    { action: 'thumb-scroll-preview', description: 'Quick thumb scroll to preview content', wait: 1500 },
                    { action: 'face-id-tap-test', description: 'Taps Face ID to test responsiveness', wait: 1000 },
                    { action: 'swipe-gestures', description: 'Tests swipe interactions', wait: 1500 },
                    { action: 'social-media-mindset', description: 'Looks for social sharing/proof', wait: 2000 },
                    { action: 'mobile-video-preview', description: 'Quick video preview on mobile', wait: 2000 },
                    { action: 'app-store-expectation', description: 'Looks for app download option', wait: 1500 },
                    { action: 'mobile-form-interaction', description: 'Tests mobile-optimized forms', wait: 2000 },
                    { action: 'share-consideration', description: 'Considers sharing with friends', wait: 1000 }
                ]
            },
            {
                name: 'conversion-focused-journey',
                description: 'User ready to convert, testing the signup flow',
                persona: 'Motivated user ready to try the product',
                device: 'desktop',
                steps: [
                    { action: 'landing-focused', description: 'Lands with conversion intent', wait: 1000 },
                    { action: 'quick-credibility-check', description: 'Quick credibility and trust signals check', wait: 1500 },
                    { action: 'cta-button-focus', description: 'Immediately focuses on main CTA', wait: 1000 },
                    { action: 'form-field-interaction', description: 'Interacts with signup/waitlist form', wait: 2000 },
                    { action: 'email-input', description: 'Enters email address', wait: 2500 },
                    { action: 'validation-feedback', description: 'Sees validation feedback', wait: 1000 },
                    { action: 'submit-attempt', description: 'Attempts to submit form', wait: 1500 },
                    { action: 'success-confirmation', description: 'Receives success confirmation', wait: 2000 },
                    { action: 'post-conversion-experience', description: 'Post-signup experience', wait: 1500 }
                ]
            }
        ];
    }

    async runUserJourneySimulations() {
        await this.init();
        
        const results = {
            timestamp: this.timestamp,
            baseUrl: this.baseUrl,
            journeys: {},
            insights: [],
            summary: {
                totalJourneys: this.userJourneys.length,
                successfulJourneys: 0,
                failedJourneys: 0,
                totalSteps: 0,
                averageJourneyTime: 0
            }
        };

        console.log('🛤️  Starting User Journey Simulations...');

        for (const journey of this.userJourneys) {
            console.log(`\n👤 Simulating: ${journey.name}`);
            console.log(`   Persona: ${journey.persona}`);
            console.log(`   Device: ${journey.device}`);
            
            try {
                const journeyResult = await this.simulateUserJourney(journey);
                results.journeys[journey.name] = journeyResult;
                
                if (journeyResult.successful) {
                    results.summary.successfulJourneys++;
                } else {
                    results.summary.failedJourneys++;
                }
                
                results.summary.totalSteps += journeyResult.steps.length;
                
                // Add journey-specific insights
                results.insights.push(...this.generateJourneyInsights(journey, journeyResult));
                
            } catch (error) {
                console.error(`❌ Journey ${journey.name} failed:`, error);
                results.journeys[journey.name] = {
                    name: journey.name,
                    successful: false,
                    error: error.message,
                    steps: []
                };
                results.summary.failedJourneys++;
            }
        }

        // Calculate average journey time
        const totalTimes = Object.values(results.journeys)
            .filter(j => j.totalTime)
            .map(j => j.totalTime);
            
        results.summary.averageJourneyTime = totalTimes.length > 0 ? 
            Math.round(totalTimes.reduce((a, b) => a + b, 0) / totalTimes.length) : 0;

        // Generate comprehensive insights
        results.insights.push(...this.generateCrossJourneyInsights(results.journeys));

        // Generate reports
        await this.generateJourneyReport(results);
        
        return results;
    }

    async init() {
        await fs.mkdir(this.outputDir, { recursive: true });
        await fs.mkdir(path.join(this.outputDir, this.timestamp), { recursive: true });
        
        console.log(`🛤️  User Journey Simulation Started`);
        console.log(`📁 Output Directory: ${this.outputDir}/${this.timestamp}`);
    }

    async simulateUserJourney(journey) {
        const viewport = this.getViewportForDevice(journey.device);
        
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        });

        const result = {
            name: journey.name,
            description: journey.description,
            persona: journey.persona,
            device: journey.device,
            successful: true,
            startTime: Date.now(),
            totalTime: 0,
            steps: [],
            insights: [],
            issues: []
        };

        try {
            const page = await browser.newPage();
            
            // Configure for the specific device
            await page.setViewport(viewport);
            
            // Set user agent for device
            const userAgent = this.getUserAgentForDevice(journey.device);
            await page.setUserAgent(userAgent);
            
            // Enable request/response monitoring
            const requests = [];
            page.on('request', req => requests.push({ url: req.url(), type: req.resourceType() }));
            
            // Navigate to the page
            console.log(`  🌐 Loading ${this.baseUrl}...`);
            await page.goto(this.baseUrl, { 
                waitUntil: ['domcontentloaded', 'networkidle0'],
                timeout: 30000 
            });

            // Execute each step in the journey
            for (let i = 0; i < journey.steps.length; i++) {
                const step = journey.steps[i];
                console.log(`    ${i + 1}. ${step.action}: ${step.description}`);
                
                try {
                    const stepResult = await this.executeJourneyStep(page, step, journey, i);
                    result.steps.push(stepResult);
                    
                    if (!stepResult.successful) {
                        result.issues.push({
                            step: step.action,
                            issue: stepResult.error
                        });
                    }
                    
                } catch (error) {
                    console.error(`      ❌ Step failed:`, error.message);
                    result.steps.push({
                        action: step.action,
                        successful: false,
                        error: error.message,
                        timestamp: Date.now()
                    });
                    result.issues.push({
                        step: step.action,
                        issue: error.message
                    });
                }
            }

            result.totalTime = Date.now() - result.startTime;
            result.successful = result.issues.length === 0;
            
            await page.close();
            
        } catch (error) {
            console.error(`❌ Major error in journey ${journey.name}:`, error);
            result.successful = false;
            result.error = error.message;
        }

        await browser.close();
        return result;
    }

    async executeJourneyStep(page, step, journey, stepIndex) {
        const stepResult = {
            action: step.action,
            description: step.description,
            successful: true,
            screenshot: null,
            metrics: {},
            timestamp: Date.now()
        };

        try {
            // Pre-step metrics
            const beforeMetrics = await this.captureStepMetrics(page);
            
            // Execute the specific step action
            await this.executeStepAction(page, step, journey);
            
            // Wait for the specified time (simulating user behavior)
            await page.waitForTimeout(step.wait);
            
            // Capture screenshot
            const screenshotPath = path.join(
                this.outputDir,
                this.timestamp,
                `${journey.name}-step-${stepIndex + 1}-${step.action}.png`
            );
            
            await page.screenshot({
                path: screenshotPath,
                type: 'png',
                fullPage: false
            });

            stepResult.screenshot = screenshotPath;
            
            // Post-step metrics
            const afterMetrics = await this.captureStepMetrics(page);
            
            stepResult.metrics = {
                before: beforeMetrics,
                after: afterMetrics,
                duration: step.wait
            };
            
        } catch (error) {
            stepResult.successful = false;
            stepResult.error = error.message;
        }

        return stepResult;
    }

    async executeStepAction(page, step, journey) {
        switch (step.action) {
            // Landing and initial actions
            case 'landing':
            case 'mobile-landing':
            case 'tablet-landing':
            case 'landing-focused':
            case 'mobile-immediate-load':
                await page.waitForSelector('body');
                break;
                
            // Scanning and reading actions
            case 'hero-scan':
            case 'quick-hero-scan':
                await page.evaluate(() => {
                    const hero = document.querySelector('.hero, .hero-section, header');
                    if (hero) hero.scrollIntoView({ behavior: 'smooth' });
                });
                break;
                
            // Face ID interactions
            case 'face-id-curiosity':
                const scanner = await page.$('.face-id-scanner');
                if (scanner && journey.device === 'desktop') {
                    await scanner.hover();
                }
                break;
                
            case 'face-id-immediate-recognition':
            case 'tap-face-scanner':
                const scannerMobile = await page.$('.face-id-scanner');
                if (scannerMobile) {
                    await scannerMobile.click();
                }
                break;
                
            case 'face-id-tap-test':
                const testScanner = await page.$('.face-id-scanner');
                if (testScanner) {
                    await testScanner.tap();
                }
                break;
                
            // Scrolling behaviors
            case 'scroll-learn-more':
                await page.evaluate(() => {
                    window.scrollTo({ 
                        top: window.innerHeight * 0.6, 
                        behavior: 'smooth' 
                    });
                });
                break;
                
            case 'thumb-scroll-preview':
                // Simulate mobile thumb scroll
                await page.evaluate(() => {
                    let currentScroll = 0;
                    const scrollStep = () => {
                        currentScroll += window.innerHeight * 0.3;
                        window.scrollTo({ top: currentScroll, behavior: 'smooth' });
                        if (currentScroll < document.body.scrollHeight) {
                            setTimeout(scrollStep, 300);
                        }
                    };
                    scrollStep();
                });
                await page.waitForTimeout(1500);
                break;
                
            // Video interactions
            case 'video-interest':
            case 'video-discovery':
                const videoTrigger = await page.$('[data-video-trigger]');
                if (videoTrigger) {
                    await page.evaluate(el => el.scrollIntoView({ behavior: 'smooth' }), videoTrigger);
                }
                break;
                
            case 'video-modal-open':
                const openVideo = await page.$('[data-video-trigger]');
                if (openVideo) {
                    await openVideo.click();
                    await page.waitForTimeout(500);
                }
                break;
                
            case 'video-watching':
                // Simulate watching video
                await page.evaluate(() => {
                    const video = document.querySelector('video');
                    if (video) {
                        video.currentTime = 2;
                        video.play();
                    }
                });
                break;
                
            case 'video-paused-reflection':
                await page.evaluate(() => {
                    const video = document.querySelector('video');
                    if (video) video.pause();
                });
                break;
                
            case 'video-resume':
                await page.evaluate(() => {
                    const video = document.querySelector('video');
                    if (video) video.play();
                });
                break;
                
            // Social proof and credibility
            case 'social-proof':
                const testimonials = await page.$('[data-section="testimonials"]');
                if (testimonials) {
                    await page.evaluate(el => el.scrollIntoView({ behavior: 'smooth' }), testimonials);
                }
                break;
                
            case 'quick-credibility-check':
                // Quick scan of trust signals
                const trustElements = await page.$$('.trust-signal, .testimonial, .security-badge');
                if (trustElements.length > 0) {
                    await page.evaluate(el => el.scrollIntoView({ behavior: 'smooth' }), trustElements[0]);
                }
                break;
                
            // CTA and conversion actions
            case 'cta-consideration':
            case 'cta-button-focus':
                const cta = await page.$('.cta, .btn-primary, [data-cta]');
                if (cta) {
                    await page.evaluate(el => el.scrollIntoView({ behavior: 'smooth' }), cta);
                    if (journey.device === 'desktop') {
                        await cta.hover();
                    }
                }
                break;
                
            case 'mobile-cta-tap':
                const mobileCta = await page.$('.cta, .btn-primary, [data-cta]');
                if (mobileCta) {
                    await mobileCta.tap();
                }
                break;
                
            // Form interactions
            case 'form-field-interaction':
                const formField = await page.$('input[type="email"]');
                if (formField) {
                    await formField.focus();
                }
                break;
                
            case 'email-input':
                const emailField = await page.$('input[type="email"]');
                if (emailField) {
                    await emailField.focus();
                    await emailField.type('user@example.com', { delay: 100 });
                }
                break;
                
            case 'validation-feedback':
                await page.keyboard.press('Tab'); // Trigger validation
                break;
                
            case 'submit-attempt':
                const submitBtn = await page.$('button[type="submit"], .submit-btn');
                if (submitBtn) {
                    await submitBtn.click();
                }
                break;
                
            // Mobile-specific actions
            case 'swipe-gestures':
                await page.evaluate(() => {
                    // Simulate touch swipe
                    const startEvent = new TouchEvent('touchstart', {
                        touches: [{ clientX: 200, clientY: 300 }]
                    });
                    const endEvent = new TouchEvent('touchend', {
                        touches: [{ clientX: 100, clientY: 300 }]
                    });
                    document.body.dispatchEvent(startEvent);
                    setTimeout(() => document.body.dispatchEvent(endEvent), 200);
                });
                break;
                
            default:
                // Default action: just wait
                await page.waitForTimeout(100);
        }
    }

    async captureStepMetrics(page) {
        return await page.evaluate(() => {
            return {
                timestamp: Date.now(),
                scrollPosition: window.scrollY,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                activeElement: document.activeElement?.tagName || null,
                visibleElements: {
                    buttons: document.querySelectorAll('button:not([style*="display: none"])').length,
                    forms: document.querySelectorAll('form:not([style*="display: none"])').length,
                    videos: document.querySelectorAll('video:not([style*="display: none"])').length
                },
                performance: {
                    memory: performance.memory ? {
                        usedJSHeapSize: performance.memory.usedJSHeapSize
                    } : null
                }
            };
        });
    }

    getViewportForDevice(device) {
        const viewports = {
            mobile: { width: 375, height: 667, deviceScaleFactor: 2 },
            tablet: { width: 768, height: 1024, deviceScaleFactor: 2 },
            desktop: { width: 1440, height: 900, deviceScaleFactor: 1 }
        };
        return viewports[device] || viewports.desktop;
    }

    getUserAgentForDevice(device) {
        const userAgents = {
            mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            tablet: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            desktop: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        };
        return userAgents[device] || userAgents.desktop;
    }

    generateJourneyInsights(journey, result) {
        const insights = [];
        
        if (!result.successful) {
            insights.push({
                type: 'error',
                journey: journey.name,
                message: `Journey failed: ${result.error}`,
                priority: 'high'
            });
        }
        
        if (result.totalTime > 30000) { // 30 seconds
            insights.push({
                type: 'performance',
                journey: journey.name,
                message: `Journey took ${Math.round(result.totalTime / 1000)}s - consider optimization`,
                priority: 'medium'
            });
        }
        
        if (result.issues.length > 0) {
            insights.push({
                type: 'usability',
                journey: journey.name,
                message: `${result.issues.length} steps had issues in ${journey.name} journey`,
                priority: 'high'
            });
        }
        
        return insights;
    }

    generateCrossJourneyInsights(journeys) {
        const insights = [];
        
        const mobileJourneys = Object.values(journeys).filter(j => j.device === 'mobile');
        const desktopJourneys = Object.values(journeys).filter(j => j.device === 'desktop');
        
        if (mobileJourneys.length > 0 && desktopJourneys.length > 0) {
            const mobileSuccessRate = mobileJourneys.filter(j => j.successful).length / mobileJourneys.length;
            const desktopSuccessRate = desktopJourneys.filter(j => j.successful).length / desktopJourneys.length;
            
            if (Math.abs(mobileSuccessRate - desktopSuccessRate) > 0.2) {
                insights.push({
                    type: 'cross-device',
                    message: `Significant success rate difference between mobile (${Math.round(mobileSuccessRate * 100)}%) and desktop (${Math.round(desktopSuccessRate * 100)}%)`,
                    priority: 'high'
                });
            }
        }
        
        return insights;
    }

    async generateJourneyReport(results) {
        const reportPath = path.join(this.outputDir, this.timestamp, 'user-journey-report.json');
        const htmlReportPath = path.join(this.outputDir, this.timestamp, 'user-journey-report.html');
        
        // Save JSON report
        await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
        
        // Generate HTML report
        const htmlReport = this.generateJourneyHtmlReport(results);
        await fs.writeFile(htmlReportPath, htmlReport);
        
        console.log(`\n📊 User Journey Reports generated:`);
        console.log(`   JSON: ${reportPath}`);
        console.log(`   HTML: ${htmlReportPath}`);
        
        // Print summary
        this.printJourneySummary(results);
    }

    generateJourneyHtmlReport(results) {
        const journeySections = Object.entries(results.journeys)
            .map(([journeyName, journey]) => {
                const stepsHtml = journey.steps?.map((step, index) => {
                    const screenshot = step.screenshot ? 
                        `<img src="${path.basename(step.screenshot)}" alt="${step.action}" loading="lazy">` :
                        '<p>No screenshot</p>';
                    
                    const statusIcon = step.successful ? '✅' : '❌';
                    
                    return `
                        <div class="step ${step.successful ? 'success' : 'failed'}">
                            <div class="step-header">
                                <span class="step-number">${index + 1}</span>
                                <span class="step-status">${statusIcon}</span>
                                <h4>${step.action}</h4>
                            </div>
                            <p>${step.description}</p>
                            <div class="step-screenshot">${screenshot}</div>
                        </div>
                    `;
                }).join('') || '<p>No steps recorded</p>';
                
                const successRate = journey.steps?.length > 0 ? 
                    Math.round((journey.steps.filter(s => s.successful).length / journey.steps.length) * 100) : 0;
                
                return `
                    <div class="journey-section">
                        <div class="journey-header">
                            <h3>${journeyName} ${journey.successful ? '✅' : '❌'}</h3>
                            <div class="journey-meta">
                                <span>Device: ${journey.device}</span>
                                <span>Success Rate: ${successRate}%</span>
                                <span>Duration: ${Math.round((journey.totalTime || 0) / 1000)}s</span>
                            </div>
                        </div>
                        <p class="persona">${journey.persona}</p>
                        <div class="steps-timeline">${stepsHtml}</div>
                    </div>
                `;
            }).join('');

        const insightsHtml = results.insights.map(insight => `
            <div class="insight insight-${insight.priority}">
                <span class="insight-type">${insight.type.toUpperCase()}</span>
                <p>${insight.message}</p>
            </div>
        `).join('');

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>FacePay User Journey Visual Report</title>
            <style>
                body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f8fafc; color: #1e293b; }
                .container { max-width: 1200px; margin: 0 auto; }
                .header { background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
                .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
                .stat { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .stat-number { font-size: 2rem; font-weight: bold; color: #0ea5e9; }
                .journey-section { background: white; margin: 20px 0; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                .journey-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; }
                .journey-meta { display: flex; gap: 15px; font-size: 0.9rem; color: #64748b; }
                .persona { font-style: italic; color: #475569; margin-bottom: 20px; padding: 15px; background: #f1f5f9; border-radius: 6px; }
                .steps-timeline { display: grid; gap: 20px; }
                .step { border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
                .step.success { border-color: #10b981; background: #f0fdf4; }
                .step.failed { border-color: #ef4444; background: #fef2f2; }
                .step-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
                .step-number { background: #3b82f6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; }
                .step-screenshot img { max-width: 300px; border-radius: 6px; margin-top: 10px; }
                .insights { background: white; padding: 25px; border-radius: 12px; margin-top: 30px; }
                .insight { padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid; }
                .insight-high { background: #fef2f2; border-color: #ef4444; }
                .insight-medium { background: #fffbeb; border-color: #f59e0b; }
                .insight-low { background: #f0f9ff; border-color: #0ea5e9; }
                .insight-type { font-weight: bold; font-size: 0.8rem; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🛤️ FacePay User Journey Visual Report</h1>
                    <p>Generated: ${new Date(results.timestamp).toLocaleString()}</p>
                    <p>Comprehensive user journey simulation with visual documentation</p>
                </div>
                
                <div class="summary">
                    <div class="stat">
                        <div class="stat-number">${results.summary.totalJourneys}</div>
                        <div>Total Journeys</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${results.summary.successfulJourneys}</div>
                        <div>Successful</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${results.summary.totalSteps}</div>
                        <div>Total Steps</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${Math.round(results.summary.averageJourneyTime / 1000)}s</div>
                        <div>Avg Duration</div>
                    </div>
                </div>

                ${journeySections}

                ${results.insights.length > 0 ? `
                    <div class="insights">
                        <h2>💡 Journey Insights</h2>
                        ${insightsHtml}
                    </div>
                ` : ''}
            </div>
        </body>
        </html>
        `;
    }

    printJourneySummary(results) {
        console.log('\n' + '='.repeat(70));
        console.log('🛤️  FACEPAY USER JOURNEY SIMULATION SUMMARY');
        console.log('='.repeat(70));
        console.log(`📊 Total Journeys: ${results.summary.totalJourneys}`);
        console.log(`✅ Successful: ${results.summary.successfulJourneys}`);
        console.log(`❌ Failed: ${results.summary.failedJourneys}`);
        console.log(`📱 Total Steps: ${results.summary.totalSteps}`);
        console.log(`⏱️  Average Duration: ${Math.round(results.summary.averageJourneyTime / 1000)}s`);
        
        if (results.insights.length > 0) {
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
    
    const simulator = new UserJourneySimulation({ baseUrl });
    
    simulator.runUserJourneySimulations()
        .then(results => {
            console.log('\n✅ User journey simulations completed!');
            process.exit(results.summary.failedJourneys > 0 ? 1 : 0);
        })
        .catch(error => {
            console.error('\n❌ User journey simulation failed:', error);
            process.exit(1);
        });
}

module.exports = UserJourneySimulation;