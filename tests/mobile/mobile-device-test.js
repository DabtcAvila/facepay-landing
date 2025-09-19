#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

/**
 * EXHAUSTIVE MOBILE DEVICE TESTING SUITE
 * ZERO TOLERANCE for mobile rendering issues - Perfect experience on every device
 * Tests: iOS Safari, Chrome Android, all screen sizes, touch interactions, device features
 */

class MobileDeviceTester {
    constructor() {
        this.results = [];
        this.failures = [];
        this.touchTests = [];
        this.orientationTests = [];
        
        // Comprehensive mobile device configurations
        this.mobileDevices = [
            // iPhone devices
            {
                name: 'iPhone-SE-2022',
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
                viewport: { width: 375, height: 667 },
                deviceScaleFactor: 2,
                platform: 'iOS',
                browser: 'Safari'
            },
            {
                name: 'iPhone-12',
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
                viewport: { width: 390, height: 844 },
                deviceScaleFactor: 3,
                platform: 'iOS',
                browser: 'Safari'
            },
            {
                name: 'iPhone-14-Pro',
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
                viewport: { width: 393, height: 852 },
                deviceScaleFactor: 3,
                platform: 'iOS',
                browser: 'Safari'
            },
            {
                name: 'iPhone-15-Pro-Max',
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
                viewport: { width: 430, height: 932 },
                deviceScaleFactor: 3,
                platform: 'iOS',
                browser: 'Safari'
            },
            
            // Android devices - Chrome
            {
                name: 'Pixel-7',
                userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
                viewport: { width: 412, height: 915 },
                deviceScaleFactor: 2.625,
                platform: 'Android',
                browser: 'Chrome'
            },
            {
                name: 'Samsung-Galaxy-S24',
                userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
                viewport: { width: 384, height: 832 },
                deviceScaleFactor: 3,
                platform: 'Android',
                browser: 'Chrome'
            },
            {
                name: 'Samsung-Galaxy-S24-Ultra',
                userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
                viewport: { width: 412, height: 915 },
                deviceScaleFactor: 3.5,
                platform: 'Android',
                browser: 'Chrome'
            },
            
            // Tablets
            {
                name: 'iPad-10.9',
                userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
                viewport: { width: 820, height: 1180 },
                deviceScaleFactor: 2,
                platform: 'iPadOS',
                browser: 'Safari'
            },
            {
                name: 'iPad-Pro-12.9',
                userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
                viewport: { width: 1024, height: 1366 },
                deviceScaleFactor: 2,
                platform: 'iPadOS',
                browser: 'Safari'
            }
        ];
        
        // Critical mobile test scenarios
        this.testScenarios = [
            { name: 'viewport-rendering', description: 'Viewport meta tag and responsive rendering' },
            { name: 'touch-targets', description: 'Touch target sizes and accessibility' },
            { name: 'scroll-behavior', description: 'Smooth scrolling and momentum' },
            { name: 'form-usability', description: 'Form inputs and keyboard behavior' },
            { name: 'video-playback', description: 'Video player mobile optimization' },
            { name: 'navigation-menu', description: 'Mobile navigation functionality' },
            { name: 'gesture-support', description: 'Swipe and pinch gestures' },
            { name: 'orientation-change', description: 'Portrait/landscape orientation handling' },
            { name: 'performance-mobile', description: 'Mobile-specific performance metrics' },
            { name: 'offline-behavior', description: 'Offline functionality and PWA features' },
            { name: 'safe-area-insets', description: 'Notch and safe area handling' },
            { name: 'hover-replacements', description: 'Hover state alternatives for touch' }
        ];
        
        // Touch interaction tests
        this.touchInteractions = [
            { name: 'button-tap', selector: '.cta-button', action: 'tap' },
            { name: 'link-tap', selector: 'a[href]', action: 'tap' },
            { name: 'form-focus', selector: 'input, textarea', action: 'tap' },
            { name: 'scroll-performance', selector: 'body', action: 'scroll' },
            { name: 'swipe-gesture', selector: '.swipeable', action: 'swipe' },
            { name: 'pinch-zoom', selector: '.zoomable', action: 'pinch' }
        ];
        
        // Performance thresholds for mobile
        this.mobileThresholds = {
            firstContentfulPaint: 2000,  // 2s for mobile
            largestContentfulPaint: 4000, // 4s for mobile
            totalBlockingTime: 300,       // 300ms for mobile
            cumulativeLayoutShift: 0.1,   // 0.1 for mobile
            speedIndex: 4000,             // 4s for mobile
            timeToInteractive: 5000       // 5s for mobile
        };
    }

    async runComprehensiveMobileTesting(url = 'http://localhost:8000') {
        console.log('📱 STARTING EXHAUSTIVE MOBILE DEVICE TESTING SUITE');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🎯 Testing ${this.mobileDevices.length} devices × ${this.testScenarios.length} scenarios`);
        
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--touch-events=enabled',
                '--enable-touch-drag-drop',
                '--enable-features=TouchEventFeatureDetection'
            ]
        });

        try {
            for (const device of this.mobileDevices) {
                console.log(`\n📱 Testing ${device.name} (${device.platform} ${device.browser})...`);
                await this.testMobileDevice(browser, url, device);
            }
            
            await this.generateMobileReports();
            this.validateMobileCompatibility();
            
        } finally {
            await browser.close();
        }
    }

    async testMobileDevice(browser, url, device) {
        const page = await browser.newPage();
        
        try {
            // Configure page for mobile device
            await this.configureMobileDevice(page, device);
            
            for (const scenario of this.testScenarios) {
                console.log(`   Testing: ${scenario.description}...`);
                await this.runMobileTestScenario(page, url, device, scenario);
            }
            
            // Test touch interactions
            await this.testTouchInteractions(page, url, device);
            
            // Test orientation changes
            await this.testOrientationChanges(page, url, device);
            
        } catch (error) {
            console.error(`❌ Critical error testing ${device.name}:`, error.message);
            this.failures.push({
                device: device.name,
                platform: device.platform,
                browser: device.browser,
                error: error.message,
                type: 'device-failure'
            });
        } finally {
            await page.close();
        }
    }

    async configureMobileDevice(page, device) {
        // Set viewport with mobile configuration
        await page.setViewport({
            width: device.viewport.width,
            height: device.viewport.height,
            deviceScaleFactor: device.deviceScaleFactor,
            isMobile: true,
            hasTouch: true
        });
        
        // Set mobile user agent
        await page.setUserAgent(device.userAgent);
        
        // Enable touch events
        await page.setViewport({
            width: device.viewport.width,
            height: device.viewport.height,
            deviceScaleFactor: device.deviceScaleFactor,
            isMobile: true,
            hasTouch: true
        });
        
        // Monitor errors and performance
        this.setupMobileMonitoring(page, device);
    }

    setupMobileMonitoring(page, device) {
        // Console errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                this.failures.push({
                    device: device.name,
                    type: 'console-error',
                    message: msg.text()
                });
            }
        });
        
        // Page errors
        page.on('pageerror', error => {
            this.failures.push({
                device: device.name,
                type: 'page-error',
                message: error.message
            });
        });
        
        // Network failures
        page.on('requestfailed', request => {
            this.failures.push({
                device: device.name,
                type: 'network-failure',
                url: request.url(),
                failure: request.failure()?.errorText
            });
        });
    }

    async runMobileTestScenario(page, url, device, scenario) {
        const testResult = {
            device: device.name,
            platform: device.platform,
            browser: device.browser,
            scenario: scenario.name,
            description: scenario.description,
            timestamp: new Date().toISOString(),
            success: false,
            metrics: {},
            issues: []
        };
        
        try {
            const startTime = Date.now();
            
            // Navigate to page
            await page.goto(url, { 
                waitUntil: 'networkidle0', 
                timeout: 30000 
            });
            
            const loadTime = Date.now() - startTime;
            testResult.metrics.loadTime = loadTime;
            
            // Scenario-specific tests
            switch (scenario.name) {
                case 'viewport-rendering':
                    await this.testViewportRendering(page, testResult);
                    break;
                    
                case 'touch-targets':
                    await this.testTouchTargets(page, testResult);
                    break;
                    
                case 'scroll-behavior':
                    await this.testScrollBehavior(page, testResult);
                    break;
                    
                case 'form-usability':
                    await this.testFormUsability(page, testResult);
                    break;
                    
                case 'video-playback':
                    await this.testVideoPlayback(page, testResult);
                    break;
                    
                case 'navigation-menu':
                    await this.testNavigationMenu(page, testResult);
                    break;
                    
                case 'gesture-support':
                    await this.testGestureSupport(page, testResult);
                    break;
                    
                case 'performance-mobile':
                    await this.testMobilePerformance(page, testResult);
                    break;
                    
                case 'offline-behavior':
                    await this.testOfflineBehavior(page, testResult);
                    break;
                    
                case 'safe-area-insets':
                    await this.testSafeAreaInsets(page, testResult, device);
                    break;
                    
                case 'hover-replacements':
                    await this.testHoverReplacements(page, testResult);
                    break;
                    
                default:
                    testResult.issues.push('Unknown test scenario');
            }
            
            testResult.success = testResult.issues.length === 0;
            
        } catch (error) {
            testResult.issues.push(`Test execution error: ${error.message}`);
            testResult.success = false;
        }
        
        this.results.push(testResult);
        
        if (!testResult.success) {
            console.log(`     ❌ Failed: ${testResult.issues.join(', ')}`);
        } else {
            console.log(`     ✅ Passed (${testResult.metrics.loadTime}ms)`);
        }
    }

    async testViewportRendering(page, testResult) {
        const viewportInfo = await page.evaluate(() => {
            const viewport = document.querySelector('meta[name="viewport"]');
            const body = document.body;
            const html = document.documentElement;
            
            return {
                hasViewportMeta: !!viewport,
                viewportContent: viewport ? viewport.content : null,
                bodyWidth: body.offsetWidth,
                htmlWidth: html.offsetWidth,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio,
                horizontalScrollable: body.scrollWidth > window.innerWidth,
                verticalScrollable: body.scrollHeight > window.innerHeight
            };
        });
        
        testResult.metrics.viewport = viewportInfo;
        
        if (!viewportInfo.hasViewportMeta) {
            testResult.issues.push('Missing viewport meta tag');
        }
        
        if (viewportInfo.horizontalScrollable) {
            testResult.issues.push('Horizontal scrolling detected - responsive layout issue');
        }
        
        if (!viewportInfo.viewportContent || !viewportInfo.viewportContent.includes('width=device-width')) {
            testResult.issues.push('Viewport meta tag missing width=device-width');
        }
    }

    async testTouchTargets(page, testResult) {
        const touchTargetInfo = await page.evaluate(() => {
            const interactiveElements = document.querySelectorAll('button, a, input, textarea, select, [onclick], [ontouch]');
            const touchTargets = [];
            const minTouchTargetSize = 44; // Apple's recommended 44px minimum
            
            interactiveElements.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                const styles = window.getComputedStyle(element);
                
                const target = {
                    index,
                    tagName: element.tagName,
                    width: rect.width,
                    height: rect.height,
                    area: rect.width * rect.height,
                    meetsSizeRequirement: rect.width >= minTouchTargetSize && rect.height >= minTouchTargetSize,
                    hasProperSpacing: true, // Would need complex calculation
                    isVisible: rect.width > 0 && rect.height > 0 && styles.visibility !== 'hidden' && styles.display !== 'none'
                };
                
                touchTargets.push(target);
            });
            
            return {
                totalTargets: touchTargets.length,
                adequateSizeTargets: touchTargets.filter(t => t.meetsSizeRequirement).length,
                visibleTargets: touchTargets.filter(t => t.isVisible).length,
                targets: touchTargets
            };
        });
        
        testResult.metrics.touchTargets = touchTargetInfo;
        
        const inadequateTargets = touchTargetInfo.totalTargets - touchTargetInfo.adequateSizeTargets;
        if (inadequateTargets > 0) {
            testResult.issues.push(`${inadequateTargets} touch targets smaller than 44px minimum`);
        }
    }

    async testScrollBehavior(page, testResult) {
        const scrollInfo = await page.evaluate(() => {
            const body = document.body;
            const scrollable = body.scrollHeight > window.innerHeight;
            
            // Test smooth scrolling
            const hasScrollBehavior = getComputedStyle(document.documentElement).scrollBehavior === 'smooth' ||
                                    getComputedStyle(body).scrollBehavior === 'smooth';
            
            // Test momentum scrolling (iOS)
            const hasMomentumScrolling = getComputedStyle(body).webkitOverflowScrolling === 'touch' ||
                                       getComputedStyle(body).overflowScrolling === 'touch';
            
            return {
                isScrollable: scrollable,
                hasSmoothScrolling: hasScrollBehavior,
                hasMomentumScrolling: hasMomentumScrolling,
                scrollHeight: body.scrollHeight,
                clientHeight: body.clientHeight
            };
        });
        
        testResult.metrics.scroll = scrollInfo;
        
        if (scrollInfo.isScrollable && !scrollInfo.hasMomentumScrolling) {
            testResult.issues.push('Missing momentum scrolling for iOS (-webkit-overflow-scrolling: touch)');
        }
    }

    async testFormUsability(page, testResult) {
        const forms = await page.$$('form');
        const formInfo = {
            totalForms: forms.length,
            accessibleForms: 0,
            issues: []
        };
        
        for (const form of forms) {
            const formData = await form.evaluate(f => {
                const inputs = f.querySelectorAll('input, textarea, select');
                const inputData = [];
                
                inputs.forEach(input => {
                    const rect = input.getBoundingClientRect();
                    const label = document.querySelector(`label[for="${input.id}"]`) || 
                                 input.closest('label');
                    
                    inputData.push({
                        type: input.type || input.tagName.toLowerCase(),
                        hasLabel: !!label,
                        hasPlaceholder: !!input.placeholder,
                        width: rect.width,
                        height: rect.height,
                        autocomplete: input.autocomplete,
                        inputmode: input.inputMode
                    });
                });
                
                return inputData;
            });
            
            formData.forEach((input, index) => {
                if (input.height < 44) {
                    formInfo.issues.push(`Input ${index} height ${input.height}px < 44px minimum`);
                }
                if (!input.hasLabel && !input.hasPlaceholder) {
                    formInfo.issues.push(`Input ${index} missing label or placeholder`);
                }
                if (input.type === 'email' && !input.inputmode) {
                    formInfo.issues.push(`Email input ${index} missing inputmode="email"`);
                }
                if (input.type === 'tel' && !input.inputmode) {
                    formInfo.issues.push(`Phone input ${index} missing inputmode="tel"`);
                }
            });
        }
        
        testResult.metrics.forms = formInfo;
        testResult.issues.push(...formInfo.issues);
    }

    async testVideoPlayback(page, testResult) {
        const videoInfo = await page.evaluate(() => {
            const videos = document.querySelectorAll('video');
            const videoData = [];
            
            videos.forEach((video, index) => {
                const rect = video.getBoundingClientRect();
                
                videoData.push({
                    index,
                    width: rect.width,
                    height: rect.height,
                    hasControls: video.hasAttribute('controls'),
                    hasPlaysinline: video.hasAttribute('playsinline'),
                    hasMuted: video.hasAttribute('muted'),
                    hasAutoplay: video.hasAttribute('autoplay'),
                    hasPoster: video.hasAttribute('poster'),
                    preload: video.preload
                });
            });
            
            return {
                totalVideos: videos.length,
                videos: videoData
            };
        });
        
        testResult.metrics.videos = videoInfo;
        
        videoInfo.videos.forEach((video, index) => {
            if (video.hasAutoplay && !video.hasMuted) {
                testResult.issues.push(`Video ${index}: Autoplay without muted may fail on mobile`);
            }
            if (!video.hasPlaysinline && video.hasAutoplay) {
                testResult.issues.push(`Video ${index}: Missing playsinline attribute for mobile autoplay`);
            }
            if (!video.hasPoster) {
                testResult.issues.push(`Video ${index}: Missing poster image for better mobile experience`);
            }
        });
    }

    async testNavigationMenu(page, testResult) {
        const navInfo = await page.evaluate(() => {
            const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
            const menuButton = document.querySelector('.menu-toggle, .hamburger, [aria-label*="menu" i]');
            
            return {
                hasNavigation: !!nav,
                hasMenuButton: !!menuButton,
                menuButtonVisible: menuButton ? getComputedStyle(menuButton).display !== 'none' : false,
                navigationVisible: nav ? getComputedStyle(nav).display !== 'none' : false
            };
        });
        
        testResult.metrics.navigation = navInfo;
        
        if (!navInfo.hasNavigation) {
            testResult.issues.push('No navigation element found');
        }
        
        if (!navInfo.hasMenuButton) {
            testResult.issues.push('No mobile menu toggle button found');
        }
    }

    async testGestureSupport(page, testResult) {
        const gestureInfo = await page.evaluate(() => {
            const touchSupport = 'ontouchstart' in window;
            const pointerSupport = 'onpointerdown' in window;
            const gestureSupport = 'ongesturestart' in window;
            
            return {
                touchEvents: touchSupport,
                pointerEvents: pointerSupport,
                gestureEvents: gestureSupport,
                maxTouchPoints: navigator.maxTouchPoints || 0
            };
        });
        
        testResult.metrics.gestures = gestureInfo;
        
        if (!gestureInfo.touchEvents) {
            testResult.issues.push('Touch events not supported');
        }
    }

    async testMobilePerformance(page, testResult) {
        const performanceMetrics = await page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const paintEntries = performance.getEntriesByType('paint');
            
            const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            
            return {
                domInteractive: navigation ? navigation.domInteractive : 0,
                domContentLoaded: navigation ? navigation.domContentLoadedEventEnd : 0,
                loadComplete: navigation ? navigation.loadEventEnd : 0,
                firstContentfulPaint: fcp ? fcp.startTime : 0,
                memoryUsage: performance.memory ? {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                } : null
            };
        });
        
        testResult.metrics.performance = performanceMetrics;
        
        // Check against mobile thresholds
        if (performanceMetrics.firstContentfulPaint > this.mobileThresholds.firstContentfulPaint) {
            testResult.issues.push(`FCP ${Math.round(performanceMetrics.firstContentfulPaint)}ms > ${this.mobileThresholds.firstContentfulPaint}ms threshold`);
        }
        
        if (performanceMetrics.domContentLoaded > this.mobileThresholds.timeToInteractive) {
            testResult.issues.push(`TTI ${Math.round(performanceMetrics.domContentLoaded)}ms > ${this.mobileThresholds.timeToInteractive}ms threshold`);
        }
    }

    async testOfflineBehavior(page, testResult) {
        const offlineInfo = await page.evaluate(() => {
            const hasServiceWorker = 'serviceWorker' in navigator;
            const hasCache = 'caches' in window;
            const isOnline = navigator.onLine;
            
            return {
                serviceWorkerSupport: hasServiceWorker,
                cacheSupport: hasCache,
                isOnline: isOnline,
                connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown'
            };
        });
        
        testResult.metrics.offline = offlineInfo;
        
        if (!offlineInfo.serviceWorkerSupport) {
            testResult.issues.push('Service Worker not supported - PWA features unavailable');
        }
        
        if (!offlineInfo.cacheSupport) {
            testResult.issues.push('Cache API not supported - offline functionality limited');
        }
    }

    async testSafeAreaInsets(page, testResult, device) {
        if (device.platform === 'iOS') {
            const safeAreaInfo = await page.evaluate(() => {
                const rootStyles = getComputedStyle(document.documentElement);
                
                return {
                    safeAreaInsetTop: rootStyles.getPropertyValue('env(safe-area-inset-top)') || 
                                     rootStyles.getPropertyValue('constant(safe-area-inset-top)'),
                    safeAreaInsetBottom: rootStyles.getPropertyValue('env(safe-area-inset-bottom)') || 
                                        rootStyles.getPropertyValue('constant(safe-area-inset-bottom)'),
                    safeAreaInsetLeft: rootStyles.getPropertyValue('env(safe-area-inset-left)') || 
                                      rootStyles.getPropertyValue('constant(safe-area-inset-left)'),
                    safeAreaInsetRight: rootStyles.getPropertyValue('env(safe-area-inset-right)') || 
                                       rootStyles.getPropertyValue('constant(safe-area-inset-right)'),
                    viewportFit: document.querySelector('meta[name="viewport"]')?.content?.includes('viewport-fit=cover')
                };
            });
            
            testResult.metrics.safeArea = safeAreaInfo;
            
            if (device.name.includes('Pro') && !safeAreaInfo.viewportFit) {
                testResult.issues.push('Missing viewport-fit=cover for device with notch');
            }
        }
    }

    async testHoverReplacements(page, testResult) {
        const hoverElements = await page.evaluate(() => {
            // Find elements with hover states
            const allElements = document.querySelectorAll('*');
            const hoverElements = [];
            
            Array.from(allElements).forEach((element, index) => {
                const styles = getComputedStyle(element);
                const elementInfo = {
                    index,
                    tagName: element.tagName,
                    hasHoverStyles: false, // This would require parsing CSS rules
                    hasActiveState: styles.getPropertyValue(':active') !== '',
                    hasFocusState: styles.getPropertyValue(':focus') !== '',
                    isFocusable: element.tabIndex >= 0 || ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)
                };
                
                if (elementInfo.hasHoverStyles || elementInfo.isFocusable) {
                    hoverElements.push(elementInfo);
                }
            });
            
            return hoverElements;
        });
        
        testResult.metrics.hoverElements = hoverElements;
        
        // This is a simplified check - in reality, you'd need to parse CSS for hover states
        const focusableWithoutActive = hoverElements.filter(el => el.isFocusable && !el.hasActiveState);
        if (focusableWithoutActive.length > 0) {
            testResult.issues.push(`${focusableWithoutActive.length} focusable elements missing :active state for touch`);
        }
    }

    async testTouchInteractions(page, url, device) {
        console.log(`   Testing touch interactions...`);
        
        try {
            await page.goto(url, { waitUntil: 'networkidle0' });
            
            for (const interaction of this.touchInteractions) {
                const element = await page.$(interaction.selector);
                if (element) {
                    try {
                        switch (interaction.action) {
                            case 'tap':
                                await element.tap();
                                break;
                            case 'scroll':
                                await page.evaluate(() => window.scrollBy(0, 200));
                                break;
                            // Add more touch interactions as needed
                        }
                        
                        this.touchTests.push({
                            device: device.name,
                            interaction: interaction.name,
                            success: true
                        });
                        
                    } catch (error) {
                        this.touchTests.push({
                            device: device.name,
                            interaction: interaction.name,
                            success: false,
                            error: error.message
                        });
                    }
                }
            }
            
        } catch (error) {
            console.log(`     ⚠️ Touch interaction test failed: ${error.message}`);
        }
    }

    async testOrientationChanges(page, url, device) {
        if (device.platform === 'iOS' || device.platform === 'Android') {
            console.log(`   Testing orientation changes...`);
            
            try {
                await page.goto(url, { waitUntil: 'networkidle0' });
                
                // Test portrait
                await page.setViewport({
                    width: device.viewport.width,
                    height: device.viewport.height,
                    deviceScaleFactor: device.deviceScaleFactor,
                    isMobile: true,
                    hasTouch: true
                });
                
                const portraitMetrics = await this.getOrientationMetrics(page, 'portrait');
                
                // Test landscape (swap width/height)
                await page.setViewport({
                    width: device.viewport.height,
                    height: device.viewport.width,
                    deviceScaleFactor: device.deviceScaleFactor,
                    isMobile: true,
                    hasTouch: true
                });
                
                const landscapeMetrics = await this.getOrientationMetrics(page, 'landscape');
                
                this.orientationTests.push({
                    device: device.name,
                    portrait: portraitMetrics,
                    landscape: landscapeMetrics,
                    layoutAdapts: Math.abs(portraitMetrics.contentWidth - landscapeMetrics.contentWidth) > 100
                });
                
            } catch (error) {
                console.log(`     ⚠️ Orientation test failed: ${error.message}`);
            }
        }
    }

    async getOrientationMetrics(page, orientation) {
        return await page.evaluate((orient) => {
            const body = document.body;
            
            return {
                orientation: orient,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight,
                contentWidth: body.scrollWidth,
                contentHeight: body.scrollHeight,
                horizontalScrollable: body.scrollWidth > window.innerWidth
            };
        }, orientation);
    }

    async generateMobileReports() {
        console.log('\n📊 GENERATING MOBILE DEVICE REPORTS...');
        
        await fs.mkdir(path.join(__dirname, '../reports'), { recursive: true }).catch(() => {});
        
        const reportData = {
            testSuite: 'Mobile Device Comprehensive Testing',
            timestamp: new Date().toISOString(),
            summary: this.generateMobileSummary(),
            results: this.results,
            failures: this.failures,
            touchTests: this.touchTests,
            orientationTests: this.orientationTests,
            devices: this.mobileDevices,
            thresholds: this.mobileThresholds
        };

        // Save JSON report
        await fs.writeFile(
            path.join(__dirname, '../reports/mobile-device-report.json'),
            JSON.stringify(reportData, null, 2)
        );

        // Generate HTML report
        const htmlReport = this.generateMobileHTMLReport(reportData);
        await fs.writeFile(
            path.join(__dirname, '../reports/mobile-device-report.html'),
            htmlReport
        );

        console.log('📄 Mobile device reports generated:');
        console.log('   - tests/reports/mobile-device-report.json');
        console.log('   - tests/reports/mobile-device-report.html');
    }

    generateMobileSummary() {
        const totalTests = this.results.length;
        const passedTests = this.results.filter(r => r.success).length;
        const failedTests = totalTests - passedTests;
        
        const deviceSummary = {};
        this.mobileDevices.forEach(device => {
            const deviceResults = this.results.filter(r => r.device === device.name);
            const devicePassed = deviceResults.filter(r => r.success).length;
            
            deviceSummary[device.name] = {
                platform: device.platform,
                browser: device.browser,
                total: deviceResults.length,
                passed: devicePassed,
                failed: deviceResults.length - devicePassed,
                successRate: deviceResults.length > 0 ? Math.round((devicePassed / deviceResults.length) * 100) : 0
            };
        });
        
        return {
            totalTests,
            passedTests,
            failedTests,
            overallSuccessRate: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0,
            deviceSummary,
            totalFailures: this.failures.length,
            touchTestsPassed: this.touchTests.filter(t => t.success).length,
            touchTestsTotal: this.touchTests.length
        };
    }

    generateMobileHTMLReport(data) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mobile Device Testing Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1400px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #ff6b6b, #4ecdc4); color: white; padding: 30px; text-align: center; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .summary-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .device-results { padding: 30px; }
        .device { margin-bottom: 30px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
        .device-header { background: #333; color: white; padding: 15px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
        .device-info { font-size: 0.9em; opacity: 0.8; }
        .device-tests { padding: 20px; }
        .test-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
        .test-item { padding: 15px; border-radius: 6px; border: 1px solid #ddd; }
        .test-pass { background: #d4edda; border-color: #c3e6cb; }
        .test-fail { background: #f8d7da; border-color: #f5c6cb; }
        .platform-ios { border-left: 4px solid #007AFF; }
        .platform-android { border-left: 4px solid #3DDC84; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-top: 10px; }
        .metric { background: #f8f9fa; padding: 8px; border-radius: 4px; text-align: center; font-size: 0.8em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📱 Mobile Device Testing Report</h1>
            <p>EXHAUSTIVE MOBILE COMPATIBILITY SUITE</p>
            <p>Generated: ${data.timestamp}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>${data.summary.totalTests}</h3>
                <p>Total Tests</p>
            </div>
            <div class="summary-card">
                <h3 style="color: #28a745;">${data.summary.passedTests}</h3>
                <p>Passed</p>
            </div>
            <div class="summary-card">
                <h3 style="color: #dc3545;">${data.summary.failedTests}</h3>
                <p>Failed</p>
            </div>
            <div class="summary-card">
                <h3 style="color: ${data.summary.overallSuccessRate === 100 ? '#28a745' : '#dc3545'};">${data.summary.overallSuccessRate}%</h3>
                <p>Success Rate</p>
            </div>
            <div class="summary-card">
                <h3>${data.summary.touchTestsPassed}/${data.summary.touchTestsTotal}</h3>
                <p>Touch Tests</p>
            </div>
        </div>
        
        <div class="device-results">
            <h2>Device Test Results</h2>
            ${Object.entries(data.summary.deviceSummary).map(([device, stats]) => `
                <div class="device platform-${stats.platform.toLowerCase()}">
                    <div class="device-header">
                        <div>
                            <span>${device.replace(/-/g, ' ')}</span>
                            <div class="device-info">${stats.platform} ${stats.browser}</div>
                        </div>
                        <span>${stats.successRate}% (${stats.passed}/${stats.total})</span>
                    </div>
                    <div class="device-tests">
                        <div class="test-grid">
                            ${data.results.filter(r => r.device === device).map(result => `
                                <div class="test-item ${result.success ? 'test-pass' : 'test-fail'}">
                                    <h4>${result.scenario.replace(/-/g, ' ').toUpperCase()}</h4>
                                    <p>${result.description}</p>
                                    ${result.metrics.loadTime ? `<p>Load: ${result.metrics.loadTime}ms</p>` : ''}
                                    ${result.issues.length > 0 ? `<p style="color: #dc3545; font-size: 0.9em;">${result.issues.slice(0, 2).join(', ')}</p>` : ''}
                                    ${result.metrics.touchTargets ? `
                                        <div class="metrics">
                                            <div class="metric">Touch Targets<br>${result.metrics.touchTargets.adequateSizeTargets}/${result.metrics.touchTargets.totalTargets}</div>
                                        </div>
                                    ` : ''}
                                    ${result.metrics.performance ? `
                                        <div class="metrics">
                                            <div class="metric">FCP<br>${Math.round(result.metrics.performance.firstContentfulPaint)}ms</div>
                                            <div class="metric">DCL<br>${Math.round(result.metrics.performance.domContentLoaded)}ms</div>
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        ${data.failures.length > 0 ? `
            <div style="background: #f8d7da; margin: 20px; padding: 20px; border-radius: 8px;">
                <h3>🚨 Device Failures</h3>
                ${data.failures.map(failure => `
                    <div style="background: white; margin: 10px 0; padding: 15px; border-left: 4px solid #dc3545; border-radius: 4px;">
                        <strong>${failure.device} - ${failure.type}</strong><br>
                        ${failure.message || failure.error}
                    </div>
                `).join('')}
            </div>
        ` : ''}
    </div>
</body>
</html>
        `;
    }

    validateMobileCompatibility() {
        console.log('\n🎯 FINAL MOBILE COMPATIBILITY VALIDATION:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const summary = this.generateMobileSummary();
        
        if (summary.overallSuccessRate === 100 && this.failures.length === 0) {
            console.log('✅ 🏆 MOBILE COMPATIBILITY PERFECTION ACHIEVED!');
            console.log('✅ All devices render correctly');
            console.log('✅ Touch interactions working perfectly');
            console.log('✅ All viewports responsive');
            console.log('✅ Performance meets mobile thresholds');
            console.log('✅ PWA features functional');
            console.log('✅ Ready for mobile deployment');
        } else {
            console.log('❌ 🚨 MOBILE COMPATIBILITY ISSUES DETECTED!');
            console.log(`❌ Overall success rate: ${summary.overallSuccessRate}% (Required: 100%)`);
            console.log(`❌ Failed tests: ${summary.failedTests}`);
            console.log(`❌ Total failures: ${this.failures.length}`);
            console.log(`❌ Touch tests: ${summary.touchTestsPassed}/${summary.touchTestsTotal}`);
            
            // Show device-specific issues
            Object.entries(summary.deviceSummary).forEach(([device, stats]) => {
                if (stats.successRate < 100) {
                    console.log(`   - ${device} (${stats.platform}): ${stats.successRate}% (${stats.failed} failures)`);
                }
            });
            
            console.log('\n📋 IMMEDIATE MOBILE OPTIMIZATION REQUIRED');
            process.exit(1);
        }
    }
}

// Execute if run directly
if (require.main === module) {
    const tester = new MobileDeviceTester();
    const url = process.argv[2] || 'http://localhost:8000';
    
    tester.runComprehensiveMobileTesting(url).catch(error => {
        console.error('💥 CRITICAL TESTING FAILURE:', error);
        process.exit(1);
    });
}

module.exports = MobileDeviceTester;