#!/usr/bin/env node

/**
 * FacePay Visual Testing Orchestrator
 * 
 * Master controller that orchestrates all visual testing systems to provide
 * comprehensive visual validation and reporting for facepay.com.mx.
 * 
 * Integrates:
 * - Multi-viewport screenshot automation
 * - Cross-browser visual testing
 * - Interactive elements testing
 * - User journey simulation
 * - Visual regression detection
 * - Performance + visual correlation
 * 
 * Produces unified comprehensive report with actionable insights.
 */

const path = require('path');
const fs = require('fs').promises;
const VisualTestingAutomation = require('./visual-testing-automation');
const CrossBrowserVisualTesting = require('./cross-browser-visual-testing');
const InteractiveElementsTesting = require('./interactive-elements-testing');
const UserJourneySimulation = require('./user-journey-simulation');
const VisualRegressionDetection = require('./visual-regression-detection');
const PerformanceVisualCorrelation = require('./performance-visual-correlation');

class VisualTestingOrchestrator {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || 'http://localhost:8000';
        this.outputDir = options.outputDir || path.join(__dirname, '../../comprehensive-visual-results');
        this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Testing configuration
        this.config = {
            runBasicVisualTests: true,
            runCrossBrowserTests: true,
            runInteractiveTests: true,
            runUserJourneyTests: true,
            runRegressionTests: true,
            runPerformanceCorrelationTests: true,
            generateUnifiedReport: true,
            ...options.config
        };

        // Initialize test systems
        this.visualTester = new VisualTestingAutomation({ 
            baseUrl: this.baseUrl,
            outputDir: path.join(this.outputDir, this.timestamp, 'basic-visual')
        });

        this.crossBrowserTester = new CrossBrowserVisualTesting({
            baseUrl: this.baseUrl,
            outputDir: path.join(this.outputDir, this.timestamp, 'cross-browser')
        });

        this.interactiveTester = new InteractiveElementsTesting({
            baseUrl: this.baseUrl,
            outputDir: path.join(this.outputDir, this.timestamp, 'interactive')
        });

        this.journeySimulator = new UserJourneySimulation({
            baseUrl: this.baseUrl,
            outputDir: path.join(this.outputDir, this.timestamp, 'user-journeys')
        });

        this.regressionDetector = new VisualRegressionDetection({
            baseUrl: this.baseUrl,
            outputDir: path.join(this.outputDir, this.timestamp, 'regression'),
            baselineDir: path.join(__dirname, '../../visual-baselines')
        });

        this.performanceCorrelator = new PerformanceVisualCorrelation({
            baseUrl: this.baseUrl,
            outputDir: path.join(this.outputDir, this.timestamp, 'performance-correlation')
        });
    }

    async runComprehensiveVisualTesting() {
        await this.init();
        
        const masterResults = {
            timestamp: this.timestamp,
            baseUrl: this.baseUrl,
            config: this.config,
            testSuites: {},
            unifiedAnalysis: {},
            criticalIssues: [],
            recommendations: [],
            summary: {
                totalTests: 0,
                passedTests: 0,
                failedTests: 0,
                overallScore: 0,
                visualPerfection: 0,
                confidence: 'low'
            }
        };

        console.log('🎨 STARTING COMPREHENSIVE FACEPAY VISUAL TESTING');
        console.log('=' + '='.repeat(60));
        console.log(`🌐 Target URL: ${this.baseUrl}`);
        console.log(`📁 Output Directory: ${this.outputDir}/${this.timestamp}`);
        console.log('=' + '='.repeat(60));

        // Run all test suites
        const testSuites = [
            { 
                name: 'basic-visual', 
                tester: this.visualTester, 
                method: 'runFullTestSuite',
                enabled: this.config.runBasicVisualTests,
                weight: 0.2
            },
            { 
                name: 'cross-browser', 
                tester: this.crossBrowserTester, 
                method: 'runCrossBrowserTests',
                enabled: this.config.runCrossBrowserTests,
                weight: 0.15
            },
            { 
                name: 'interactive', 
                tester: this.interactiveTester, 
                method: 'runInteractiveTests',
                enabled: this.config.runInteractiveTests,
                weight: 0.15
            },
            { 
                name: 'user-journeys', 
                tester: this.journeySimulator, 
                method: 'runUserJourneySimulations',
                enabled: this.config.runUserJourneyTests,
                weight: 0.2
            },
            { 
                name: 'regression', 
                tester: this.regressionDetector, 
                method: 'runRegressionDetection',
                enabled: this.config.runRegressionTests,
                weight: 0.15
            },
            { 
                name: 'performance-correlation', 
                tester: this.performanceCorrelator, 
                method: 'runPerformanceVisualCorrelation',
                enabled: this.config.runPerformanceCorrelationTests,
                weight: 0.15
            }
        ];

        // Execute each test suite
        for (const suite of testSuites) {
            if (!suite.enabled) {
                console.log(`⏭️  Skipping ${suite.name} (disabled)`);
                continue;
            }

            console.log(`\n🔄 Running ${suite.name} tests...`);
            console.log(`⏱️  Started at: ${new Date().toLocaleTimeString()}`);
            
            try {
                const startTime = Date.now();
                const result = await suite.tester[suite.method]();
                const duration = Date.now() - startTime;
                
                masterResults.testSuites[suite.name] = {
                    ...result,
                    duration,
                    weight: suite.weight,
                    successful: true
                };
                
                console.log(`✅ ${suite.name} completed in ${Math.round(duration / 1000)}s`);
                
            } catch (error) {
                console.error(`❌ ${suite.name} failed:`, error.message);
                
                masterResults.testSuites[suite.name] = {
                    error: error.message,
                    successful: false,
                    weight: suite.weight,
                    duration: 0
                };
                
                masterResults.criticalIssues.push({
                    type: 'test-suite-failure',
                    suite: suite.name,
                    message: `${suite.name} test suite failed: ${error.message}`,
                    severity: 'critical'
                });
            }
        }

        console.log('\n🔍 Analyzing results and generating unified insights...');
        
        // Perform unified analysis
        masterResults.unifiedAnalysis = await this.performUnifiedAnalysis(masterResults.testSuites);
        
        // Extract critical issues and recommendations
        masterResults.criticalIssues.push(...this.extractCriticalIssues(masterResults.testSuites));
        masterResults.recommendations = this.generateRecommendations(masterResults.testSuites, masterResults.unifiedAnalysis);
        
        // Calculate summary metrics
        masterResults.summary = this.calculateSummaryMetrics(masterResults.testSuites, masterResults.unifiedAnalysis);
        
        // Generate comprehensive report
        if (this.config.generateUnifiedReport) {
            await this.generateMasterReport(masterResults);
        }
        
        return masterResults;
    }

    async init() {
        await fs.mkdir(this.outputDir, { recursive: true });
        await fs.mkdir(path.join(this.outputDir, this.timestamp), { recursive: true });
        
        console.log(`🎨 Visual Testing Orchestrator Initialized`);
        console.log(`📁 Master Output Directory: ${this.outputDir}/${this.timestamp}`);
    }

    async performUnifiedAnalysis(testSuites) {
        const analysis = {
            crossSuiteCorrelations: {},
            commonIssues: [],
            deviceConsistency: {},
            browserCompatibility: {},
            userExperience: {},
            performanceImpact: {},
            visualRegression: {}
        };

        // Analyze cross-suite correlations
        analysis.crossSuiteCorrelations = this.analyzeCrossSuiteCorrelations(testSuites);
        
        // Identify common issues across all suites
        analysis.commonIssues = this.identifyCommonIssues(testSuites);
        
        // Analyze device consistency
        if (testSuites['basic-visual'] && testSuites['cross-browser']) {
            analysis.deviceConsistency = this.analyzeDeviceConsistency(
                testSuites['basic-visual'], 
                testSuites['cross-browser']
            );
        }
        
        // Analyze browser compatibility
        if (testSuites['cross-browser']) {
            analysis.browserCompatibility = this.analyzeBrowserCompatibility(testSuites['cross-browser']);
        }
        
        // Analyze user experience
        if (testSuites['user-journeys'] && testSuites['interactive']) {
            analysis.userExperience = this.analyzeUserExperience(
                testSuites['user-journeys'], 
                testSuites['interactive']
            );
        }
        
        // Analyze performance impact
        if (testSuites['performance-correlation']) {
            analysis.performanceImpact = this.analyzePerformanceImpact(testSuites['performance-correlation']);
        }
        
        // Analyze visual regression
        if (testSuites['regression']) {
            analysis.visualRegression = this.analyzeVisualRegression(testSuites['regression']);
        }

        return analysis;
    }

    analyzeCrossSuiteCorrelations(testSuites) {
        const correlations = {
            strongPositiveCorrelations: [],
            strongNegativeCorrelations: [],
            weakCorrelations: []
        };

        // Example correlation: If interactive tests pass well, user journeys should too
        const interactiveSuccess = testSuites['interactive']?.summary?.successful || 0;
        const journeySuccess = testSuites['user-journeys']?.summary?.successfulJourneys || 0;
        const totalJourneys = testSuites['user-journeys']?.summary?.totalJourneys || 1;
        
        if (interactiveSuccess > 0.8 && (journeySuccess / totalJourneys) < 0.6) {
            correlations.strongNegativeCorrelations.push({
                suites: ['interactive', 'user-journeys'],
                description: 'Interactive elements test well but user journeys fail - possible integration issues',
                confidence: 0.7
            });
        }

        // Regression vs performance correlation
        const hasRegression = testSuites['regression']?.summary?.regressionsFound > 0;
        const performanceScore = testSuites['performance-correlation']?.summary?.overallScore || 100;
        
        if (hasRegression && performanceScore < 70) {
            correlations.strongPositiveCorrelations.push({
                suites: ['regression', 'performance-correlation'],
                description: 'Visual regressions correlate with performance issues - optimization breaking visuals',
                confidence: 0.8
            });
        }

        return correlations;
    }

    identifyCommonIssues(testSuites) {
        const issueTracker = {};
        
        // Collect all issues from all suites
        Object.entries(testSuites).forEach(([suiteName, suite]) => {
            const issues = this.extractIssuesFromSuite(suite);
            issues.forEach(issue => {
                const key = this.normalizeIssueKey(issue);
                if (!issueTracker[key]) {
                    issueTracker[key] = { count: 0, suites: [], samples: [] };
                }
                issueTracker[key].count++;
                issueTracker[key].suites.push(suiteName);
                issueTracker[key].samples.push(issue);
            });
        });

        // Return issues that appear in multiple suites
        return Object.entries(issueTracker)
            .filter(([_, data]) => data.count > 1 || data.suites.length > 1)
            .map(([issueKey, data]) => ({
                issue: issueKey,
                frequency: data.count,
                affectedSuites: data.suites,
                severity: this.calculateIssueSeverity(data),
                samples: data.samples.slice(0, 3) // Keep few samples for context
            }));
    }

    extractIssuesFromSuite(suite) {
        const issues = [];
        
        // Extract from different suite structures
        if (suite.issues) issues.push(...suite.issues);
        if (suite.regressions) issues.push(...suite.regressions);
        if (suite.performanceImpacts) issues.push(...suite.performanceImpacts);
        if (suite.visualRegressions) issues.push(...suite.visualRegressions);
        
        // Extract from nested structures
        if (suite.interactionResults) {
            Object.values(suite.interactionResults).forEach(viewport => {
                if (viewport.issues) issues.push(...viewport.issues);
            });
        }
        
        if (suite.journeys) {
            Object.values(suite.journeys).forEach(journey => {
                if (journey.issues) issues.push(...journey.issues);
            });
        }

        return issues;
    }

    normalizeIssueKey(issue) {
        // Normalize issue descriptions to group similar issues
        const message = issue.message || issue.description || issue.type || 'unknown-issue';
        return message.toLowerCase()
            .replace(/\d+/g, 'X') // Replace numbers with X
            .replace(/['"]/g, '') // Remove quotes
            .trim();
    }

    calculateIssueSeverity(issueData) {
        if (issueData.suites.length >= 3) return 'critical';
        if (issueData.count >= 5) return 'high';
        if (issueData.count >= 3) return 'medium';
        return 'low';
    }

    analyzeDeviceConsistency(basicVisual, crossBrowser) {
        const consistency = {
            score: 0,
            issues: [],
            recommendations: []
        };

        // Compare viewport results across suites
        const basicViewports = Object.keys(basicVisual.screenshots || {});
        const browserViewports = Object.keys(crossBrowser.browsers || {});

        // Check if similar viewports have similar success rates
        // This is a simplified analysis - real implementation would be more thorough
        
        if (basicVisual.summary?.failed > crossBrowser.summary?.failed) {
            consistency.issues.push({
                type: 'basic-visual-failing',
                message: 'Basic visual tests failing more than cross-browser tests'
            });
        }

        consistency.score = Math.max(0, 100 - consistency.issues.length * 10);
        
        return consistency;
    }

    analyzeBrowserCompatibility(crossBrowser) {
        const compatibility = {
            overallScore: 0,
            browserScores: {},
            criticalIssues: [],
            recommendations: []
        };

        if (crossBrowser.summary?.browserCompatibility) {
            const browserScores = Object.entries(crossBrowser.summary.browserCompatibility);
            
            compatibility.browserScores = browserScores.reduce((acc, [browser, score]) => {
                acc[browser] = score;
                return acc;
            }, {});
            
            compatibility.overallScore = browserScores.reduce((sum, [_, score]) => sum + score.score, 0) / browserScores.length;
            
            // Identify problematic browsers
            browserScores.forEach(([browser, data]) => {
                if (data.score < 75) {
                    compatibility.criticalIssues.push({
                        browser,
                        score: data.score,
                        message: `${browser} has poor compatibility score (${data.score}%)`
                    });
                }
            });
        }

        return compatibility;
    }

    analyzeUserExperience(userJourneys, interactive) {
        const ux = {
            overallScore: 0,
            journeySuccess: 0,
            interactiveSuccess: 0,
            criticalPaths: [],
            recommendations: []
        };

        // Analyze journey success rates
        if (userJourneys.summary) {
            ux.journeySuccess = Math.round(
                (userJourneys.summary.successfulJourneys / userJourneys.summary.totalJourneys) * 100
            );
        }

        // Analyze interactive success rates
        if (interactive.summary) {
            ux.interactiveSuccess = Math.round(
                (interactive.summary.successful / interactive.summary.totalInteractions) * 100
            );
        }

        ux.overallScore = Math.round((ux.journeySuccess + ux.interactiveSuccess) / 2);

        // Identify critical path failures
        if (userJourneys.journeys) {
            Object.entries(userJourneys.journeys).forEach(([journeyName, journey]) => {
                if (!journey.successful || journey.issues?.length > 0) {
                    ux.criticalPaths.push({
                        journey: journeyName,
                        persona: journey.persona,
                        issues: journey.issues?.length || 0
                    });
                }
            });
        }

        return ux;
    }

    analyzePerformanceImpact(performanceCorrelation) {
        const impact = {
            overallScore: performanceCorrelation.summary?.overallScore || 0,
            criticalCorrelations: [],
            performanceRegression: false,
            recommendations: []
        };

        if (performanceCorrelation.summary?.correlatedIssues > 0) {
            impact.performanceRegression = true;
            impact.criticalCorrelations = performanceCorrelation.performanceImpacts?.slice(0, 5) || [];
        }

        if (impact.overallScore < 70) {
            impact.recommendations.push('Performance optimizations are negatively affecting visual presentation');
        }

        return impact;
    }

    analyzeVisualRegression(regression) {
        const analysis = {
            hasBaseline: regression.hasBaseline || false,
            regressionsFound: regression.summary?.regressionsFound || 0,
            riskLevel: regression.summary?.overallRisk || 'low',
            criticalAreas: [],
            recommendations: []
        };

        if (regression.criticalAreaAnalysis) {
            analysis.criticalAreas = Object.entries(regression.criticalAreaAnalysis)
                .filter(([_, area]) => area.overallRisk !== 'low')
                .map(([name, area]) => ({ name, risk: area.overallRisk }));
        }

        if (!analysis.hasBaseline) {
            analysis.recommendations.push('Baseline created - run again after next deployment to detect regressions');
        } else if (analysis.regressionsFound > 0) {
            analysis.recommendations.push(`${analysis.regressionsFound} visual regressions detected - review changes`);
        }

        return analysis;
    }

    extractCriticalIssues(testSuites) {
        const criticalIssues = [];

        // Extract critical issues from each suite
        Object.entries(testSuites).forEach(([suiteName, suite]) => {
            if (!suite.successful) {
                criticalIssues.push({
                    type: 'suite-failure',
                    suite: suiteName,
                    message: `${suiteName} test suite failed completely`,
                    severity: 'critical'
                });
                return;
            }

            // Suite-specific critical issue extraction
            switch (suiteName) {
                case 'basic-visual':
                    if (suite.summary?.failed > suite.summary?.passed) {
                        criticalIssues.push({
                            type: 'basic-visual-majority-failed',
                            suite: suiteName,
                            message: 'Majority of basic visual tests failed',
                            severity: 'critical'
                        });
                    }
                    break;

                case 'cross-browser':
                    if (suite.summary?.browserCompatibility) {
                        Object.entries(suite.summary.browserCompatibility).forEach(([browser, data]) => {
                            if (data.score < 50) {
                                criticalIssues.push({
                                    type: 'browser-critical-failure',
                                    suite: suiteName,
                                    browser,
                                    message: `${browser} compatibility critically low (${data.score}%)`,
                                    severity: 'critical'
                                });
                            }
                        });
                    }
                    break;

                case 'user-journeys':
                    const failedJourneys = suite.summary?.failedJourneys || 0;
                    const totalJourneys = suite.summary?.totalJourneys || 1;
                    if ((failedJourneys / totalJourneys) > 0.5) {
                        criticalIssues.push({
                            type: 'user-journey-critical',
                            suite: suiteName,
                            message: 'Majority of user journeys failing',
                            severity: 'critical'
                        });
                    }
                    break;

                case 'regression':
                    if (suite.summary?.overallRisk === 'critical') {
                        criticalIssues.push({
                            type: 'critical-regression',
                            suite: suiteName,
                            message: 'Critical visual regressions detected',
                            severity: 'critical'
                        });
                    }
                    break;

                case 'performance-correlation':
                    if (suite.summary?.overallScore < 40) {
                        criticalIssues.push({
                            type: 'performance-visual-breakdown',
                            suite: suiteName,
                            message: 'Performance and visual quality severely compromised',
                            severity: 'critical'
                        });
                    }
                    break;
            }
        });

        return criticalIssues;
    }

    generateRecommendations(testSuites, unifiedAnalysis) {
        const recommendations = [];

        // High-priority recommendations based on critical issues
        if (unifiedAnalysis.commonIssues?.length > 0) {
            const criticalCommonIssues = unifiedAnalysis.commonIssues.filter(i => i.severity === 'critical');
            if (criticalCommonIssues.length > 0) {
                recommendations.push({
                    priority: 'critical',
                    category: 'common-issues',
                    title: 'Fix Common Critical Issues',
                    description: `${criticalCommonIssues.length} critical issues affect multiple test areas`,
                    actions: criticalCommonIssues.slice(0, 3).map(issue => `Fix: ${issue.issue}`)
                });
            }
        }

        // Browser compatibility recommendations
        if (unifiedAnalysis.browserCompatibility?.criticalIssues?.length > 0) {
            recommendations.push({
                priority: 'high',
                category: 'browser-compatibility',
                title: 'Improve Cross-Browser Compatibility',
                description: `${unifiedAnalysis.browserCompatibility.criticalIssues.length} browsers have compatibility issues`,
                actions: unifiedAnalysis.browserCompatibility.criticalIssues.map(
                    issue => `Optimize for ${issue.browser} (current score: ${issue.score}%)`
                )
            });
        }

        // User experience recommendations
        if (unifiedAnalysis.userExperience?.overallScore < 70) {
            recommendations.push({
                priority: 'high',
                category: 'user-experience',
                title: 'Improve User Experience',
                description: `User experience score is low (${unifiedAnalysis.userExperience.overallScore}%)`,
                actions: [
                    'Review and fix user journey failures',
                    'Improve interactive element responsiveness',
                    'Optimize critical conversion paths'
                ]
            });
        }

        // Performance recommendations
        if (unifiedAnalysis.performanceImpact?.performanceRegression) {
            recommendations.push({
                priority: 'high',
                category: 'performance',
                title: 'Fix Performance-Visual Conflicts',
                description: 'Performance optimizations are breaking visual design',
                actions: [
                    'Review recent performance optimizations',
                    'Test visual impact of performance changes',
                    'Balance performance and visual quality'
                ]
            });
        }

        // Visual regression recommendations
        if (unifiedAnalysis.visualRegression?.regressionsFound > 0) {
            recommendations.push({
                priority: 'medium',
                category: 'visual-regression',
                title: 'Address Visual Regressions',
                description: `${unifiedAnalysis.visualRegression.regressionsFound} visual regressions detected`,
                actions: [
                    'Review recent code changes affecting visuals',
                    'Update visual baselines if changes are intentional',
                    'Implement tighter visual change controls'
                ]
            });
        }

        // Device consistency recommendations
        if (unifiedAnalysis.deviceConsistency?.score < 80) {
            recommendations.push({
                priority: 'medium',
                category: 'device-consistency',
                title: 'Improve Device Consistency',
                description: 'Visual presentation varies significantly across devices',
                actions: [
                    'Standardize responsive breakpoints',
                    'Test on real devices more frequently',
                    'Improve CSS grid/flexbox implementation'
                ]
            });
        }

        return recommendations.sort((a, b) => {
            const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }

    calculateSummaryMetrics(testSuites, unifiedAnalysis) {
        const summary = {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            overallScore: 0,
            visualPerfection: 0,
            confidence: 'low'
        };

        let weightedScore = 0;
        let totalWeight = 0;

        // Calculate weighted scores from all suites
        Object.values(testSuites).forEach(suite => {
            if (suite.successful && suite.weight) {
                let suiteScore = 50; // Base score for successful completion
                
                // Extract suite-specific scores
                if (suite.summary?.passed && suite.summary?.totalTests) {
                    suiteScore = (suite.summary.passed / suite.summary.totalTests) * 100;
                } else if (suite.summary?.successfulJourneys && suite.summary?.totalJourneys) {
                    suiteScore = (suite.summary.successfulJourneys / suite.summary.totalJourneys) * 100;
                } else if (suite.summary?.overallScore) {
                    suiteScore = suite.summary.overallScore;
                }

                weightedScore += suiteScore * suite.weight;
                totalWeight += suite.weight;
            }

            // Aggregate test counts
            summary.totalTests += suite.summary?.totalTests || suite.summary?.totalJourneys || suite.summary?.totalScenarios || 0;
            summary.passedTests += suite.summary?.passed || suite.summary?.successfulJourneys || suite.summary?.successful || 0;
            summary.failedTests += suite.summary?.failed || suite.summary?.failedJourneys || suite.summary?.regressionsFound || 0;
        });

        // Calculate overall score
        summary.overallScore = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;

        // Calculate visual perfection score
        const criticalIssueCount = unifiedAnalysis.commonIssues?.filter(i => i.severity === 'critical').length || 0;
        const regressionCount = unifiedAnalysis.visualRegression?.regressionsFound || 0;
        
        summary.visualPerfection = Math.max(0, 100 - (criticalIssueCount * 15) - (regressionCount * 10));

        // Determine confidence level
        const completedSuites = Object.values(testSuites).filter(s => s.successful).length;
        const totalSuites = Object.keys(testSuites).length;
        const completionRate = completedSuites / totalSuites;

        if (completionRate >= 0.9 && summary.overallScore >= 80) {
            summary.confidence = 'high';
        } else if (completionRate >= 0.7 && summary.overallScore >= 60) {
            summary.confidence = 'medium';
        } else {
            summary.confidence = 'low';
        }

        return summary;
    }

    async generateMasterReport(masterResults) {
        const reportPath = path.join(this.outputDir, this.timestamp, 'comprehensive-visual-report.json');
        const htmlReportPath = path.join(this.outputDir, this.timestamp, 'comprehensive-visual-report.html');
        const summaryPath = path.join(this.outputDir, this.timestamp, 'VISUAL_TESTING_SUMMARY.md');
        
        // Save JSON report
        await fs.writeFile(reportPath, JSON.stringify(masterResults, null, 2));
        
        // Generate HTML report
        const htmlReport = this.generateMasterHtmlReport(masterResults);
        await fs.writeFile(htmlReportPath, htmlReport);
        
        // Generate markdown summary
        const markdownSummary = this.generateMarkdownSummary(masterResults);
        await fs.writeFile(summaryPath, markdownSummary);
        
        console.log('\n📊 COMPREHENSIVE VISUAL TESTING REPORTS GENERATED:');
        console.log(`   📄 JSON Report: ${reportPath}`);
        console.log(`   🌐 HTML Report: ${htmlReportPath}`);
        console.log(`   📝 Summary: ${summaryPath}`);
        
        // Print final summary
        this.printFinalSummary(masterResults);
    }

    generateMasterHtmlReport(results) {
        const testSuiteSections = Object.entries(results.testSuites)
            .map(([suiteName, suite]) => {
                const status = suite.successful ? '✅' : '❌';
                const duration = Math.round((suite.duration || 0) / 1000);
                
                return `
                    <div class="test-suite ${suite.successful ? 'success' : 'failed'}">
                        <h3>${suiteName} ${status}</h3>
                        <div class="suite-meta">
                            <span>Duration: ${duration}s</span>
                            <span>Weight: ${Math.round(suite.weight * 100)}%</span>
                        </div>
                        ${suite.error ? `<p class="error">Error: ${suite.error}</p>` : ''}
                        ${this.generateSuiteSummary(suite)}
                    </div>
                `;
            }).join('');

        const recommendationsHtml = results.recommendations.map(rec => `
            <div class="recommendation ${rec.priority}">
                <h4>${rec.title}</h4>
                <p class="category">${rec.category}</p>
                <p>${rec.description}</p>
                <ul>
                    ${rec.actions.map(action => `<li>${action}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        const criticalIssuesHtml = results.criticalIssues.map(issue => `
            <div class="critical-issue">
                <strong>${issue.type}</strong>
                ${issue.suite ? `<span class="suite">[${issue.suite}]</span>` : ''}
                <p>${issue.message}</p>
            </div>
        `).join('');

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>FacePay Comprehensive Visual Testing Report</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; }
                .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
                
                .header { background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899); color: white; padding: 40px; border-radius: 16px; margin-bottom: 40px; text-align: center; }
                .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
                .header .subtitle { font-size: 1.2rem; opacity: 0.9; }
                .header .meta { margin-top: 20px; display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; }
                .header .meta span { background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; }

                .dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin-bottom: 40px; }
                .dashboard-item { background: white; padding: 30px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                .dashboard-number { font-size: 3rem; font-weight: bold; margin-bottom: 10px; }
                .score-excellent { color: #10b981; }
                .score-good { color: #06b6d4; }
                .score-fair { color: #f59e0b; }
                .score-poor { color: #ef4444; }
                .confidence-high { color: #10b981; }
                .confidence-medium { color: #f59e0b; }
                .confidence-low { color: #ef4444; }

                .section { background: white; margin: 30px 0; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                .section h2 { color: #374151; margin-bottom: 25px; }

                .test-suites { display: grid; gap: 20px; }
                .test-suite { border: 2px solid #e5e7eb; border-radius: 10px; padding: 20px; }
                .test-suite.success { border-color: #10b981; background: #f0fdf4; }
                .test-suite.failed { border-color: #ef4444; background: #fef2f2; }
                .suite-meta { display: flex; gap: 15px; margin: 10px 0; font-size: 0.9rem; color: #6b7280; }

                .recommendations { display: grid; gap: 20px; }
                .recommendation { border-left: 5px solid; border-radius: 8px; padding: 20px; }
                .recommendation.critical { border-color: #ef4444; background: #fef2f2; }
                .recommendation.high { border-color: #f59e0b; background: #fffbeb; }
                .recommendation.medium { border-color: #06b6d4; background: #f0f9ff; }
                .category { font-size: 0.85rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }

                .critical-issues { display: grid; gap: 15px; }
                .critical-issue { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; }
                .suite { background: #e5e7eb; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; margin-left: 10px; }

                .footer { text-align: center; margin-top: 50px; padding: 20px; color: #6b7280; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎨 FacePay Comprehensive Visual Testing</h1>
                    <p class="subtitle">Complete Visual Validation & Quality Assurance Report</p>
                    <div class="meta">
                        <span>📅 ${new Date(results.timestamp).toLocaleString()}</span>
                        <span>🌐 ${results.baseUrl}</span>
                        <span>🎯 ${results.summary.confidence.toUpperCase()} Confidence</span>
                    </div>
                </div>

                <div class="dashboard">
                    <div class="dashboard-item">
                        <div class="dashboard-number score-${this.getScoreClass(results.summary.overallScore)}">${results.summary.overallScore}</div>
                        <div>Overall Score</div>
                    </div>
                    <div class="dashboard-item">
                        <div class="dashboard-number score-${this.getScoreClass(results.summary.visualPerfection)}">${results.summary.visualPerfection}</div>
                        <div>Visual Perfection</div>
                    </div>
                    <div class="dashboard-item">
                        <div class="dashboard-number">${results.summary.totalTests}</div>
                        <div>Total Tests</div>
                    </div>
                    <div class="dashboard-item">
                        <div class="dashboard-number confidence-${results.summary.confidence}">${results.summary.confidence.toUpperCase()}</div>
                        <div>Confidence Level</div>
                    </div>
                </div>

                <div class="section">
                    <h2>🧪 Test Suites Results</h2>
                    <div class="test-suites">${testSuiteSections}</div>
                </div>

                ${results.criticalIssues.length > 0 ? `
                    <div class="section">
                        <h2>🚨 Critical Issues</h2>
                        <div class="critical-issues">${criticalIssuesHtml}</div>
                    </div>
                ` : ''}

                <div class="section">
                    <h2>💡 Recommendations</h2>
                    <div class="recommendations">${recommendationsHtml}</div>
                </div>

                <div class="footer">
                    <p>Generated by FacePay Visual Testing Orchestrator</p>
                    <p>🤖 Automated visual quality assurance for perfect user experiences</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    generateSuiteSummary(suite) {
        if (suite.error) return '';
        
        let summary = '<div class="suite-summary">';
        
        if (suite.summary) {
            const s = suite.summary;
            if (s.totalTests) summary += `<span>Tests: ${s.passed}/${s.totalTests}</span>`;
            if (s.totalJourneys) summary += `<span>Journeys: ${s.successfulJourneys}/${s.totalJourneys}</span>`;
            if (s.totalScenarios) summary += `<span>Scenarios: ${s.totalScenarios}</span>`;
            if (s.regressionsFound !== undefined) summary += `<span>Regressions: ${s.regressionsFound}</span>`;
            if (s.overallScore !== undefined) summary += `<span>Score: ${s.overallScore}/100</span>`;
        }
        
        summary += '</div>';
        return summary;
    }

    getScoreClass(score) {
        if (score >= 90) return 'excellent';
        if (score >= 75) return 'good';
        if (score >= 60) return 'fair';
        return 'poor';
    }

    generateMarkdownSummary(results) {
        const timestamp = new Date(results.timestamp).toLocaleString();
        
        return `# 🎨 FacePay Visual Testing Summary

**Generated:** ${timestamp}  
**Target URL:** ${results.baseUrl}  
**Overall Score:** ${results.summary.overallScore}/100  
**Visual Perfection:** ${results.summary.visualPerfection}/100  
**Confidence Level:** ${results.summary.confidence.toUpperCase()}

## 📊 Results Overview

- **Total Tests:** ${results.summary.totalTests}
- **Passed Tests:** ${results.summary.passedTests}
- **Failed Tests:** ${results.summary.failedTests}

## 🧪 Test Suites

${Object.entries(results.testSuites).map(([name, suite]) => `
### ${name} ${suite.successful ? '✅' : '❌'}
- **Status:** ${suite.successful ? 'Completed' : 'Failed'}
- **Duration:** ${Math.round((suite.duration || 0) / 1000)}s
${suite.error ? `- **Error:** ${suite.error}` : ''}
${this.generateMarkdownSuiteSummary(suite)}
`).join('')}

${results.criticalIssues.length > 0 ? `
## 🚨 Critical Issues

${results.criticalIssues.map(issue => `
- **${issue.type}** ${issue.suite ? `[${issue.suite}]` : ''}: ${issue.message}
`).join('')}
` : ''}

## 💡 Priority Recommendations

${results.recommendations.map(rec => `
### ${rec.priority.toUpperCase()}: ${rec.title}
**Category:** ${rec.category}  
**Description:** ${rec.description}

**Actions:**
${rec.actions.map(action => `- ${action}`).join('\n')}
`).join('')}

## 🎯 Next Steps

${results.summary.confidence === 'high' ? 
    '✅ **HIGH CONFIDENCE** - Visual quality is excellent. Monitor for regressions.' :
    results.summary.confidence === 'medium' ?
    '⚠️ **MEDIUM CONFIDENCE** - Some issues found. Address recommendations before production.' :
    '🚨 **LOW CONFIDENCE** - Significant issues detected. Do not deploy until resolved.'
}

---
*Generated by FacePay Visual Testing Orchestrator*
`;
    }

    generateMarkdownSuiteSummary(suite) {
        if (suite.error || !suite.summary) return '';
        
        const s = suite.summary;
        let summary = '';
        
        if (s.totalTests) summary += `- **Tests:** ${s.passed}/${s.totalTests}\n`;
        if (s.totalJourneys) summary += `- **Journeys:** ${s.successfulJourneys}/${s.totalJourneys}\n`;
        if (s.regressionsFound !== undefined) summary += `- **Regressions:** ${s.regressionsFound}\n`;
        if (s.overallScore !== undefined) summary += `- **Score:** ${s.overallScore}/100\n`;
        
        return summary;
    }

    printFinalSummary(results) {
        console.log('\n' + '='.repeat(80));
        console.log('🎨 FACEPAY COMPREHENSIVE VISUAL TESTING COMPLETE');
        console.log('='.repeat(80));
        console.log(`🎯 Overall Score: ${results.summary.overallScore}/100`);
        console.log(`✨ Visual Perfection: ${results.summary.visualPerfection}/100`);
        console.log(`📊 Tests Executed: ${results.summary.totalTests}`);
        console.log(`✅ Tests Passed: ${results.summary.passedTests}`);
        console.log(`❌ Tests Failed: ${results.summary.failedTests}`);
        console.log(`🎭 Confidence Level: ${results.summary.confidence.toUpperCase()}`);
        
        if (results.criticalIssues.length > 0) {
            console.log(`\n🚨 Critical Issues: ${results.criticalIssues.length}`);
            results.criticalIssues.slice(0, 3).forEach(issue => {
                console.log(`   • ${issue.type}: ${issue.message}`);
            });
        }
        
        if (results.recommendations.length > 0) {
            console.log(`\n💡 Priority Recommendations: ${results.recommendations.length}`);
            results.recommendations.slice(0, 3).forEach(rec => {
                console.log(`   • ${rec.priority.toUpperCase()}: ${rec.title}`);
            });
        }
        
        console.log('\n🎊 VISUAL TESTING AUTOMATION SYSTEM READY!');
        console.log('   You now have comprehensive visual validation for facepay.com.mx');
        console.log('   Run this system regularly to ensure perfect visual presentation');
        console.log('='.repeat(80));
    }
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const baseUrl = args[0] || 'http://localhost:8000';
    
    // Parse configuration flags
    const config = {
        runBasicVisualTests: !args.includes('--skip-basic'),
        runCrossBrowserTests: !args.includes('--skip-cross-browser'),
        runInteractiveTests: !args.includes('--skip-interactive'),
        runUserJourneyTests: !args.includes('--skip-journeys'),
        runRegressionTests: !args.includes('--skip-regression'),
        runPerformanceCorrelationTests: !args.includes('--skip-performance')
    };
    
    console.log('🎨 Starting FacePay Comprehensive Visual Testing Orchestrator...');
    
    const orchestrator = new VisualTestingOrchestrator({ baseUrl, config });
    
    orchestrator.runComprehensiveVisualTesting()
        .then(results => {
            const exitCode = results.summary.confidence === 'low' || results.criticalIssues.length > 0 ? 1 : 0;
            console.log(`\n${exitCode === 0 ? '✅' : '❌'} Visual testing orchestrator completed!`);
            process.exit(exitCode);
        })
        .catch(error => {
            console.error('\n💥 Visual testing orchestrator failed:', error);
            process.exit(1);
        });
}

module.exports = VisualTestingOrchestrator;