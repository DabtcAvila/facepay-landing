/**
 * COMPREHENSIVE ANALYTICS TRACKING SYSTEM
 * Advanced conversion funnel analysis and behavioral tracking
 * 
 * Features:
 * - Multi-platform tracking (Google Analytics, Mixpanel, custom)
 * - Conversion funnel analysis with step-by-step tracking
 * - User journey mapping and behavioral analytics
 * - Real-time dashboard data
 * - Cohort analysis and retention tracking
 * - Attribution modeling
 * - Heat mapping and interaction tracking
 * - Performance metrics and optimization insights
 */

export class AnalyticsTrackingSystem {
    constructor(options = {}) {
        this.options = {
            googleAnalyticsId: options.googleAnalyticsId || 'GA_MEASUREMENT_ID',
            mixpanelToken: options.mixpanelToken || null,
            customEndpoint: options.customEndpoint || '/api/analytics',
            enableHeatMapping: options.enableHeatMapping || true,
            enableUserRecording: options.enableUserRecording || false,
            enableRealTimeTracking: options.enableRealTimeTracking || true,
            batchSize: options.batchSize || 20,
            flushInterval: options.flushInterval || 30000, // 30 seconds
            debug: options.debug || false,
            ...options
        };

        // Tracking queues
        this.eventQueue = [];
        this.heatMapData = [];
        this.userJourney = [];
        this.performanceMetrics = [];
        
        // User session data
        this.sessionData = this.initializeSession();
        this.userIdentity = this.initializeUserIdentity();
        
        // Conversion funnel configuration
        this.conversionFunnel = this.initializeConversionFunnel();
        
        // Attribution tracking
        this.attributionData = this.initializeAttribution();
        
        // Performance monitoring
        this.performanceObserver = null;
        this.intersectionObserver = null;
        
        this.init();
    }

    init() {
        this.log('📊 Initializing Analytics Tracking System...');
        
        // Initialize tracking platforms
        this.initializeGoogleAnalytics();
        this.initializeMixpanel();
        this.initializeCustomTracking();
        
        // Setup core tracking
        this.setupFunnelTracking();
        this.setupBehavioralTracking();
        this.setupPerformanceTracking();
        this.setupHeatMapping();
        
        // Start real-time tracking
        this.startRealTimeTracking();
        
        // Setup periodic data flush
        this.setupDataFlush();
        
        this.log('✅ Analytics Tracking System Active');
        
        // Track initial page load
        this.trackPageLoad();
    }

    /**
     * PLATFORM INITIALIZATION
     */
    initializeGoogleAnalytics() {
        if (!this.options.googleAnalyticsId || this.options.googleAnalyticsId === 'GA_MEASUREMENT_ID') {
            this.log('⚠️ Google Analytics ID not configured');
            return;
        }

        // Load Google Analytics
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.options.googleAnalyticsId}`;
        document.head.appendChild(script);

        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', this.options.googleAnalyticsId, {
                send_page_view: false, // We'll send custom page views
                custom_map: {
                    'custom_parameter_1': 'conversion_stage',
                    'custom_parameter_2': 'lead_score',
                    'custom_parameter_3': 'experiment_variant'
                }
            });
            
            // Make gtag available globally
            window.gtag = gtag;
            
            this.log('✅ Google Analytics initialized');
        };
    }

    initializeMixpanel() {
        if (!this.options.mixpanelToken) {
            this.log('⚠️ Mixpanel token not configured');
            return;
        }

        // Load Mixpanel
        (function(c,a){if(!a.__SV){var b=window;try{var d,m,j,k=b.location,f=k.hash;d=function(a,b){return(m=a.match(RegExp(b+"=([^&]*)")))?m[1]:null};f&&d(f,"state")&&(j=JSON.parse(decodeURIComponent(d(f,"state"))),"mpeditor"===j.action&&(b.sessionStorage.setItem("_mpcehash",f),history.replaceState(j.desiredHash||"",c.title,k.pathname+k.search)))}catch(n){}var l,h;window.mixpanel=a;a._i=[];a.init=function(b,d,g){function c(b,i){var a=i.split(".");2==a.length&&(b=b[a[0]],i=a[1]);b[i]=function(){b.push([i].concat(Array.prototype.slice.call(arguments,0)))}}var e=a;"undefined"!==typeof g?e=a[g]=[]:g="mixpanel";e.people=e.people||[];e.toString=function(b){var a="mixpanel";"mixpanel"!==g&&(a+="."+g);b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<l.length;h++)c(e,l[h]);var f="set set_once union unset remove delete".split(" ");e.get_group=function(){function a(c){b[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));e.push([d,call2])}}for(var b={},d=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<f.length;c++)a(f[c]);return b};a._i.push([b,d,g])};a.__SV=1.2;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===c.location.protocol&&"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js";d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d)}})(document,window.mixpanel||[]);
        
        mixpanel.init(this.options.mixpanelToken, {
            debug: this.options.debug,
            track_pageview: false, // We'll track custom page views
            persistence: 'localStorage'
        });

        this.log('✅ Mixpanel initialized');
    }

    initializeCustomTracking() {
        // Custom analytics endpoint setup
        this.customTracker = {
            endpoint: this.options.customEndpoint,
            enabled: !!this.options.customEndpoint,
            queue: [],
            send: (data) => this.sendToCustomEndpoint(data)
        };

        if (this.customTracker.enabled) {
            this.log('✅ Custom tracking initialized');
        }
    }

    /**
     * CONVERSION FUNNEL TRACKING
     */
    initializeConversionFunnel() {
        return {
            stages: [
                {
                    id: 'awareness',
                    name: 'Awareness',
                    triggers: ['page_load', 'first_interaction'],
                    completed: false,
                    timestamp: null,
                    source: null
                },
                {
                    id: 'interest',
                    name: 'Interest',
                    triggers: ['scroll_25', 'video_play', 'feature_hover'],
                    completed: false,
                    timestamp: null,
                    engagementScore: 0
                },
                {
                    id: 'consideration',
                    name: 'Consideration',
                    triggers: ['video_50', 'testimonial_read', 'pricing_view'],
                    completed: false,
                    timestamp: null,
                    touchpoints: []
                },
                {
                    id: 'intent',
                    name: 'Intent',
                    triggers: ['cta_hover', 'email_focus', 'form_interaction'],
                    completed: false,
                    timestamp: null,
                    intentSignals: []
                },
                {
                    id: 'conversion',
                    name: 'Conversion',
                    triggers: ['email_submit', 'signup_complete', 'purchase'],
                    completed: false,
                    timestamp: null,
                    conversionType: null
                }
            ],
            currentStage: 'awareness',
            timeToConvert: null,
            dropOffPoint: null
        };
    }

    setupFunnelTracking() {
        // Setup stage progression tracking
        this.conversionFunnel.stages.forEach(stage => {
            stage.triggers.forEach(trigger => {
                this.setupTriggerTracking(trigger, stage);
            });
        });

        // Track funnel progression
        this.trackFunnelStage('awareness', 'page_load');
    }

    setupTriggerTracking(trigger, stage) {
        switch (trigger) {
            case 'page_load':
                // Already handled in init
                break;
                
            case 'first_interaction':
                this.setupFirstInteractionTracking(stage);
                break;
                
            case 'scroll_25':
                this.setupScrollTracking(25, stage);
                break;
                
            case 'video_play':
                this.setupVideoTracking('play', stage);
                break;
                
            case 'video_50':
                this.setupVideoTracking('50_percent', stage);
                break;
                
            case 'feature_hover':
                this.setupFeatureHoverTracking(stage);
                break;
                
            case 'testimonial_read':
                this.setupTestimonialTracking(stage);
                break;
                
            case 'pricing_view':
                this.setupPricingViewTracking(stage);
                break;
                
            case 'cta_hover':
                this.setupCTAHoverTracking(stage);
                break;
                
            case 'email_focus':
                this.setupEmailFocusTracking(stage);
                break;
                
            case 'form_interaction':
                this.setupFormInteractionTracking(stage);
                break;
                
            case 'email_submit':
                this.setupEmailSubmitTracking(stage);
                break;
        }
    }

    setupFirstInteractionTracking(stage) {
        let firstInteraction = false;
        
        const trackFirstInteraction = () => {
            if (!firstInteraction) {
                firstInteraction = true;
                this.trackFunnelStage(stage.id, 'first_interaction');
            }
        };

        document.addEventListener('click', trackFirstInteraction, { once: true });
        document.addEventListener('scroll', trackFirstInteraction, { once: true });
        document.addEventListener('keydown', trackFirstInteraction, { once: true });
        document.addEventListener('mousemove', trackFirstInteraction, { once: true });
    }

    setupScrollTracking(percentage, stage) {
        let scrollTracked = false;
        
        window.addEventListener('scroll', this.throttle(() => {
            if (scrollTracked) return;
            
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent >= percentage) {
                scrollTracked = true;
                this.trackFunnelStage(stage.id, `scroll_${percentage}`);
            }
        }, 500));
    }

    setupVideoTracking(eventType, stage) {
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            if (eventType === 'play') {
                video.addEventListener('play', () => {
                    this.trackFunnelStage(stage.id, 'video_play', {
                        video_src: video.src,
                        video_duration: video.duration
                    });
                }, { once: true });
            } else if (eventType === '50_percent') {
                video.addEventListener('timeupdate', () => {
                    if (video.currentTime / video.duration >= 0.5 && !video.dataset.tracked50) {
                        video.dataset.tracked50 = 'true';
                        this.trackFunnelStage(stage.id, 'video_50_percent', {
                            video_src: video.src,
                            watch_time: video.currentTime
                        });
                    }
                });
            }
        });
    }

    setupFeatureHoverTracking(stage) {
        const features = document.querySelectorAll('[data-feature], .feature, [data-demo-feature]');
        let hoverTracked = false;
        
        features.forEach(feature => {
            feature.addEventListener('mouseenter', () => {
                if (!hoverTracked) {
                    hoverTracked = true;
                    this.trackFunnelStage(stage.id, 'feature_hover', {
                        feature_name: feature.dataset.feature || feature.textContent.trim().substring(0, 50)
                    });
                }
            });
        });
    }

    setupTestimonialTracking(stage) {
        const testimonials = document.querySelectorAll('[data-testimonial], .testimonial');
        let testimonialTracked = false;
        
        testimonials.forEach(testimonial => {
            this.observeElementVisibility(testimonial, (isVisible) => {
                if (isVisible && !testimonialTracked) {
                    testimonialTracked = true;
                    this.trackFunnelStage(stage.id, 'testimonial_read', {
                        testimonial_id: testimonial.dataset.testimonial
                    });
                }
            }, { threshold: 0.5, duration: 2000 }); // Visible for 2 seconds
        });
    }

    setupPricingViewTracking(stage) {
        const pricingElements = document.querySelectorAll('[data-pricing], .pricing, [data-price]');
        let pricingTracked = false;
        
        pricingElements.forEach(element => {
            this.observeElementVisibility(element, (isVisible) => {
                if (isVisible && !pricingTracked) {
                    pricingTracked = true;
                    this.trackFunnelStage(stage.id, 'pricing_view');
                }
            });
        });
    }

    setupCTAHoverTracking(stage) {
        const ctas = document.querySelectorAll('.btn-primary, [data-cta], .cta-button');
        let ctaTracked = false;
        
        ctas.forEach(cta => {
            cta.addEventListener('mouseenter', () => {
                if (!ctaTracked) {
                    ctaTracked = true;
                    this.trackFunnelStage(stage.id, 'cta_hover', {
                        cta_text: cta.textContent.trim(),
                        cta_position: this.getElementPosition(cta)
                    });
                }
            });
        });
    }

    setupEmailFocusTracking(stage) {
        const emailInputs = document.querySelectorAll('input[type="email"]');
        let emailTracked = false;
        
        emailInputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (!emailTracked) {
                    emailTracked = true;
                    this.trackFunnelStage(stage.id, 'email_focus', {
                        input_id: input.id,
                        input_placeholder: input.placeholder
                    });
                }
            });
        });
    }

    setupFormInteractionTracking(stage) {
        const forms = document.querySelectorAll('form');
        let formTracked = false;
        
        forms.forEach(form => {
            form.addEventListener('input', () => {
                if (!formTracked) {
                    formTracked = true;
                    this.trackFunnelStage(stage.id, 'form_interaction', {
                        form_id: form.id,
                        form_fields: form.querySelectorAll('input, select, textarea').length
                    });
                }
            });
        });
    }

    setupEmailSubmitTracking(stage) {
        // This will be triggered by the micro-conversions system
        document.addEventListener('email_captured', (event) => {
            this.trackFunnelStage(stage.id, 'email_submit', {
                email: event.detail.email,
                source: event.detail.source
            });
        });
    }

    trackFunnelStage(stageId, trigger, additionalData = {}) {
        const stage = this.conversionFunnel.stages.find(s => s.id === stageId);
        
        if (!stage || stage.completed) return;
        
        // Mark stage as completed
        stage.completed = true;
        stage.timestamp = Date.now();
        stage.trigger = trigger;
        
        // Update current stage
        this.conversionFunnel.currentStage = stageId;
        
        // Calculate time to reach this stage
        const timeToStage = Date.now() - this.sessionData.startTime;
        
        // Track the event
        this.trackEvent('funnel_stage_completed', {
            stage_id: stageId,
            stage_name: stage.name,
            trigger: trigger,
            time_to_stage: timeToStage,
            session_id: this.sessionData.sessionId,
            user_id: this.userIdentity.userId,
            ...additionalData
        });

        // Check if this completes the conversion
        if (stageId === 'conversion') {
            this.conversionFunnel.timeToConvert = timeToStage;
            this.trackConversionComplete(additionalData);
        }

        this.log(`🎯 Funnel stage completed: ${stage.name} (${trigger})`);
    }

    trackConversionComplete(data) {
        this.trackEvent('conversion_completed', {
            time_to_convert: this.conversionFunnel.timeToConvert,
            conversion_path: this.conversionFunnel.stages
                .filter(s => s.completed)
                .map(s => s.id),
            session_duration: Date.now() - this.sessionData.startTime,
            touchpoints: this.userJourney.length,
            ...data
        });
    }

    /**
     * BEHAVIORAL TRACKING
     */
    setupBehavioralTracking() {
        this.setupClickTracking();
        this.setupScrollBehaviorTracking();
        this.setupHoverTracking();
        this.setupTimeOnPageTracking();
        this.setupEngagementTracking();
        this.setupExitTracking();
    }

    setupClickTracking() {
        document.addEventListener('click', (event) => {
            const element = event.target;
            const clickData = {
                element_tag: element.tagName.toLowerCase(),
                element_id: element.id,
                element_class: element.className,
                element_text: element.textContent.trim().substring(0, 100),
                element_href: element.href || null,
                click_position: {
                    x: event.clientX,
                    y: event.clientY
                },
                element_position: this.getElementPosition(element),
                timestamp: Date.now()
            };
            
            this.trackEvent('click', clickData);
            this.addToUserJourney('click', clickData);
            
            // Track for heat mapping
            if (this.options.enableHeatMapping) {
                this.addHeatMapPoint(event.clientX, event.clientY, 'click');
            }
        });
    }

    setupScrollBehaviorTracking() {
        let maxScrollDepth = 0;
        let scrollSessions = [];
        let currentScrollSession = null;
        
        const trackScrollBehavior = this.throttle((event) => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollPercent = Math.round(
                (scrollTop / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            // Track maximum scroll depth
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
                
                // Track scroll milestones
                const milestones = [25, 50, 75, 90, 100];
                milestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !this.sessionData.scrollMilestones[milestone]) {
                        this.sessionData.scrollMilestones[milestone] = true;
                        this.trackEvent('scroll_milestone', {
                            milestone: milestone,
                            time_to_milestone: Date.now() - this.sessionData.startTime
                        });
                    }
                });
            }
            
            // Track scroll sessions (periods of continuous scrolling)
            if (!currentScrollSession) {
                currentScrollSession = {
                    start: Date.now(),
                    startPosition: scrollTop,
                    endPosition: scrollTop,
                    direction: null
                };
            } else {
                const direction = scrollTop > currentScrollSession.endPosition ? 'down' : 'up';
                currentScrollSession.direction = direction;
                currentScrollSession.endPosition = scrollTop;
            }
        }, 100);
        
        window.addEventListener('scroll', trackScrollBehavior);
        
        // End scroll session when scrolling stops
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (currentScrollSession) {
                    scrollSessions.push(currentScrollSession);
                    this.trackEvent('scroll_session', {
                        duration: Date.now() - currentScrollSession.start,
                        distance: Math.abs(currentScrollSession.endPosition - currentScrollSession.startPosition),
                        direction: currentScrollSession.direction,
                        max_scroll_depth: maxScrollDepth
                    });
                    currentScrollSession = null;
                }
            }, 1000);
        });
    }

    setupHoverTracking() {
        const importantElements = document.querySelectorAll(
            'button, .btn, a, [data-track], .cta-button, [data-hover-track]'
        );
        
        importantElements.forEach(element => {
            let hoverStart = null;
            
            element.addEventListener('mouseenter', () => {
                hoverStart = Date.now();
            });
            
            element.addEventListener('mouseleave', () => {
                if (hoverStart) {
                    const hoverDuration = Date.now() - hoverStart;
                    
                    if (hoverDuration > 500) { // Only track meaningful hovers
                        this.trackEvent('hover', {
                            element_tag: element.tagName.toLowerCase(),
                            element_id: element.id,
                            element_class: element.className,
                            element_text: element.textContent.trim().substring(0, 50),
                            hover_duration: hoverDuration,
                            element_position: this.getElementPosition(element)
                        });
                    }
                    
                    hoverStart = null;
                }
            });
        });
    }

    setupTimeOnPageTracking() {
        const timeCheckpoints = [10, 30, 60, 120, 300, 600]; // seconds
        
        timeCheckpoints.forEach(seconds => {
            setTimeout(() => {
                this.trackEvent('time_on_page', {
                    seconds: seconds,
                    engaged: this.isUserEngaged(),
                    scroll_depth: this.getScrollDepth(),
                    interactions: this.getInteractionCount()
                });
            }, seconds * 1000);
        });
    }

    setupEngagementTracking() {
        let engagementScore = 0;
        let lastActivityTime = Date.now();
        
        // Track various engagement signals
        const engagementEvents = ['click', 'scroll', 'keydown', 'mousemove', 'focus'];
        
        engagementEvents.forEach(eventType => {
            document.addEventListener(eventType, this.throttle(() => {
                lastActivityTime = Date.now();
                engagementScore++;
                
                // Update session data
                this.sessionData.lastActivity = lastActivityTime;
                this.sessionData.engagementScore = engagementScore;
            }, 1000));
        });
        
        // Check for idle periods
        setInterval(() => {
            const idleTime = Date.now() - lastActivityTime;
            
            if (idleTime > 30000) { // 30 seconds idle
                this.trackEvent('user_idle', {
                    idle_duration: idleTime,
                    engagement_score: engagementScore,
                    time_on_page: Date.now() - this.sessionData.startTime
                });
            }
        }, 30000);
    }

    setupExitTracking() {
        // Track when user is likely to leave
        let exitIntentDetected = false;
        
        document.addEventListener('mouseleave', (event) => {
            if (event.clientY <= 0 && !exitIntentDetected) {
                exitIntentDetected = true;
                this.trackEvent('exit_intent', {
                    time_on_page: Date.now() - this.sessionData.startTime,
                    scroll_depth: this.getScrollDepth(),
                    engagement_score: this.sessionData.engagementScore,
                    funnel_stage: this.conversionFunnel.currentStage
                });
            }
        });
        
        // Track actual page unload
        window.addEventListener('beforeunload', () => {
            this.trackEvent('page_exit', {
                session_duration: Date.now() - this.sessionData.startTime,
                max_scroll_depth: this.getScrollDepth(),
                funnel_stage: this.conversionFunnel.currentStage,
                conversion_completed: this.conversionFunnel.stages
                    .find(s => s.id === 'conversion')?.completed || false
            });
            
            // Flush remaining events
            this.flushEventQueue(true);
        });
    }

    /**
     * PERFORMANCE TRACKING
     */
    setupPerformanceTracking() {
        // Core Web Vitals
        this.trackWebVitals();
        
        // Custom performance metrics
        this.trackCustomPerformance();
        
        // Resource loading
        this.trackResourceLoading();
    }

    trackWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('web-vitals' in window || this.loadWebVitalsLibrary()) {
            import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS((metric) => this.trackPerformanceMetric('CLS', metric));
                getFID((metric) => this.trackPerformanceMetric('FID', metric));
                getFCP((metric) => this.trackPerformanceMetric('FCP', metric));
                getLCP((metric) => this.trackPerformanceMetric('LCP', metric));
                getTTFB((metric) => this.trackPerformanceMetric('TTFB', metric));
            });
        } else {
            // Fallback manual tracking
            this.trackPerformanceManually();
        }
    }

    trackPerformanceManually() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            
            window.addEventListener('load', () => {
                const metrics = {
                    load_time: timing.loadEventEnd - timing.navigationStart,
                    dom_ready: timing.domContentLoadedEventEnd - timing.navigationStart,
                    first_paint: timing.responseEnd - timing.navigationStart,
                    dns_lookup: timing.domainLookupEnd - timing.domainLookupStart,
                    server_response: timing.responseEnd - timing.requestStart
                };
                
                this.trackEvent('performance_metrics', metrics);
            });
        }
    }

    trackCustomPerformance() {
        // Track custom performance markers
        const markLoadComplete = () => {
            performance.mark('page-load-complete');
            
            const entries = performance.getEntriesByType('mark');
            const loadEntry = entries.find(entry => entry.name === 'page-load-complete');
            
            if (loadEntry) {
                this.trackEvent('custom_performance', {
                    page_load_complete: loadEntry.startTime,
                    resource_count: performance.getEntriesByType('resource').length,
                    navigation_type: performance.getEntriesByType('navigation')[0]?.type
                });
            }
        };
        
        if (document.readyState === 'complete') {
            markLoadComplete();
        } else {
            window.addEventListener('load', markLoadComplete);
        }
    }

    trackResourceLoading() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.entryType === 'resource') {
                    // Track slow resources
                    if (entry.duration > 1000) { // Resources taking more than 1 second
                        this.trackEvent('slow_resource', {
                            resource_name: entry.name,
                            resource_type: entry.initiatorType,
                            duration: entry.duration,
                            size: entry.transferSize
                        });
                    }
                }
            });
        });
        
        observer.observe({ entryTypes: ['resource'] });
    }

    trackPerformanceMetric(name, metric) {
        this.trackEvent('web_vital', {
            metric_name: name,
            metric_value: metric.value,
            metric_rating: metric.rating,
            metric_delta: metric.delta
        });
    }

    /**
     * HEAT MAPPING
     */
    setupHeatMapping() {
        if (!this.options.enableHeatMapping) return;
        
        this.heatMapData = [];
        
        // Track clicks for heat map
        document.addEventListener('click', (event) => {
            this.addHeatMapPoint(event.clientX, event.clientY, 'click');
        });
        
        // Track mouse movement for attention mapping
        let mouseMoveThrottled = this.throttle((event) => {
            this.addHeatMapPoint(event.clientX, event.clientY, 'hover');
        }, 1000);
        
        document.addEventListener('mousemove', mouseMoveThrottled);
        
        // Track scroll positions
        window.addEventListener('scroll', this.throttle(() => {
            const scrollPercent = this.getScrollDepth();
            this.addHeatMapPoint(window.innerWidth / 2, scrollPercent * window.innerHeight / 100, 'scroll');
        }, 500));
    }

    addHeatMapPoint(x, y, type) {
        this.heatMapData.push({
            x: x,
            y: y,
            type: type,
            timestamp: Date.now(),
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            url: window.location.href
        });
        
        // Keep only recent heat map data (last 1000 points)
        if (this.heatMapData.length > 1000) {
            this.heatMapData = this.heatMapData.slice(-1000);
        }
    }

    /**
     * EVENT TRACKING AND BATCHING
     */
    trackEvent(eventName, eventData = {}) {
        const event = {
            event: eventName,
            timestamp: Date.now(),
            session_id: this.sessionData.sessionId,
            user_id: this.userIdentity.userId,
            url: window.location.href,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            ...eventData
        };
        
        // Add to event queue
        this.eventQueue.push(event);
        
        // Send to all configured platforms
        this.sendToAllPlatforms(eventName, event);
        
        // Add to user journey
        this.addToUserJourney(eventName, eventData);
        
        // Check if queue needs flushing
        if (this.eventQueue.length >= this.options.batchSize) {
            this.flushEventQueue();
        }
        
        if (this.options.debug) {
            this.log(`📊 Event tracked: ${eventName}`, eventData);
        }
    }

    sendToAllPlatforms(eventName, eventData) {
        // Google Analytics
        if (window.gtag) {
            gtag('event', eventName, {
                event_category: 'user_behavior',
                event_label: eventData.label || eventName,
                value: eventData.value || 1,
                custom_parameter_1: eventData.conversion_stage || this.conversionFunnel.currentStage,
                custom_parameter_2: eventData.lead_score || 0,
                custom_parameter_3: eventData.experiment_variant || 'control'
            });
        }
        
        // Mixpanel
        if (window.mixpanel && window.mixpanel.track) {
            mixpanel.track(eventName, {
                ...eventData,
                session_id: this.sessionData.sessionId,
                user_id: this.userIdentity.userId,
                funnel_stage: this.conversionFunnel.currentStage
            });
        }
        
        // Custom endpoint
        if (this.customTracker.enabled) {
            this.customTracker.queue.push({
                event: eventName,
                data: eventData
            });
        }
    }

    addToUserJourney(eventName, eventData) {
        this.userJourney.push({
            event: eventName,
            timestamp: Date.now(),
            data: eventData
        });
        
        // Keep only last 100 journey events
        if (this.userJourney.length > 100) {
            this.userJourney = this.userJourney.slice(-100);
        }
    }

    /**
     * DATA MANAGEMENT
     */
    setupDataFlush() {
        // Periodic flush
        setInterval(() => {
            this.flushEventQueue();
        }, this.options.flushInterval);
        
        // Flush on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.flushEventQueue(true);
            }
        });
    }

    flushEventQueue(force = false) {
        if (this.eventQueue.length === 0) return;
        
        if (!force && this.eventQueue.length < this.options.batchSize) return;
        
        // Send custom events
        if (this.customTracker.enabled && this.customTracker.queue.length > 0) {
            this.sendToCustomEndpoint(this.customTracker.queue);
            this.customTracker.queue = [];
        }
        
        // Send heat map data
        if (this.options.enableHeatMapping && this.heatMapData.length > 0) {
            this.sendHeatMapData();
        }
        
        // Clear the queue
        const flushedEvents = this.eventQueue.splice(0, this.eventQueue.length);
        
        if (this.options.debug) {
            this.log(`📤 Flushed ${flushedEvents.length} events`);
        }
    }

    sendToCustomEndpoint(data) {
        if (!this.customTracker.enabled) return;
        
        fetch(this.customTracker.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                events: data,
                session: this.sessionData,
                user: this.userIdentity,
                funnel: this.conversionFunnel,
                timestamp: Date.now()
            })
        }).catch(error => {
            if (this.options.debug) {
                console.error('Failed to send analytics data:', error);
            }
        });
    }

    sendHeatMapData() {
        if (!this.options.enableHeatMapping) return;
        
        const heatMapPayload = {
            url: window.location.href,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            data: this.heatMapData,
            timestamp: Date.now()
        };
        
        fetch(`${this.customTracker.endpoint}/heatmap`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(heatMapPayload)
        }).catch(error => {
            if (this.options.debug) {
                console.error('Failed to send heat map data:', error);
            }
        });
        
        // Clear sent data
        this.heatMapData = [];
    }

    /**
     * REAL-TIME TRACKING
     */
    startRealTimeTracking() {
        if (!this.options.enableRealTimeTracking) return;
        
        setInterval(() => {
            this.sendRealTimeUpdate();
        }, 10000); // Every 10 seconds
    }

    sendRealTimeUpdate() {
        const update = {
            session_id: this.sessionData.sessionId,
            user_id: this.userIdentity.userId,
            current_url: window.location.href,
            funnel_stage: this.conversionFunnel.currentStage,
            time_on_page: Date.now() - this.sessionData.startTime,
            scroll_depth: this.getScrollDepth(),
            engagement_score: this.sessionData.engagementScore || 0,
            is_active: this.isUserActive(),
            timestamp: Date.now()
        };
        
        if (this.customTracker.enabled) {
            fetch(`${this.customTracker.endpoint}/realtime`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(update)
            }).catch(() => {
                // Silent fail for real-time updates
            });
        }
    }

    /**
     * PAGE LOAD TRACKING
     */
    trackPageLoad() {
        const loadData = {
            url: window.location.href,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            color_depth: screen.colorDepth,
            pixel_ratio: window.devicePixelRatio,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            platform: navigator.platform,
            connection: this.getConnectionInfo(),
            attribution: this.attributionData
        };
        
        this.trackEvent('page_load', loadData);
        
        // Track funnel stage
        this.trackFunnelStage('awareness', 'page_load');
    }

    /**
     * UTILITY METHODS
     */
    initializeSession() {
        return {
            sessionId: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            startTime: Date.now(),
            lastActivity: Date.now(),
            scrollMilestones: {
                25: false,
                50: false,
                75: false,
                90: false,
                100: false
            },
            engagementScore: 0
        };
    }

    initializeUserIdentity() {
        let userId = localStorage.getItem('analytics_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('analytics_user_id', userId);
        }
        
        return {
            userId: userId,
            isReturning: !!localStorage.getItem('analytics_returning_user'),
            firstVisit: localStorage.getItem('analytics_first_visit') || Date.now(),
            visitCount: parseInt(localStorage.getItem('analytics_visit_count') || '1', 10)
        };
    }

    initializeAttribution() {
        const urlParams = new URLSearchParams(window.location.search);
        
        return {
            utm_source: urlParams.get('utm_source'),
            utm_medium: urlParams.get('utm_medium'),
            utm_campaign: urlParams.get('utm_campaign'),
            utm_term: urlParams.get('utm_term'),
            utm_content: urlParams.get('utm_content'),
            referrer: document.referrer,
            organic_search: this.isOrganicSearch(document.referrer),
            entry_page: window.location.href
        };
    }

    isOrganicSearch(referrer) {
        const searchEngines = ['google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com'];
        return searchEngines.some(engine => referrer.includes(engine));
    }

    observeElementVisibility(element, callback, options = {}) {
        const { threshold = 0.1, duration = 1000 } = options;
        
        let visibilityTimer = null;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visibilityTimer = setTimeout(() => {
                        callback(true);
                    }, duration);
                } else {
                    if (visibilityTimer) {
                        clearTimeout(visibilityTimer);
                        visibilityTimer = null;
                    }
                    callback(false);
                }
            });
        }, { threshold });
        
        observer.observe(element);
        return observer;
    }

    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
        };
    }

    getScrollDepth() {
        if (document.body.scrollHeight <= window.innerHeight) {
            return 100; // Page doesn't scroll
        }
        return Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    }

    isUserEngaged() {
        const timeSinceLastActivity = Date.now() - this.sessionData.lastActivity;
        return timeSinceLastActivity < 30000; // Active in last 30 seconds
    }

    isUserActive() {
        const timeSinceLastActivity = Date.now() - this.sessionData.lastActivity;
        return timeSinceLastActivity < 10000; // Active in last 10 seconds
    }

    getInteractionCount() {
        return this.userJourney.filter(event => 
            ['click', 'scroll', 'hover', 'form_interaction'].includes(event.event)
        ).length;
    }

    getConnectionInfo() {
        if (navigator.connection) {
            return {
                effective_type: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                save_data: navigator.connection.saveData
            };
        }
        return null;
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    log(message, ...args) {
        if (this.options.debug) {
            console.log(`%c[Analytics] ${message}`, 'color: #3b82f6; font-weight: bold;', ...args);
        }
    }

    // PUBLIC API
    identifyUser(userId, traits = {}) {
        this.userIdentity.userId = userId;
        this.userIdentity.traits = traits;
        
        // Update all platforms
        if (window.gtag) {
            gtag('config', this.options.googleAnalyticsId, {
                user_id: userId
            });
        }
        
        if (window.mixpanel) {
            mixpanel.identify(userId);
            mixpanel.people.set(traits);
        }
        
        this.trackEvent('user_identified', { user_id: userId, traits });
    }

    trackCustomEvent(eventName, eventData = {}) {
        this.trackEvent(eventName, eventData);
    }

    getFunnelData() {
        return this.conversionFunnel;
    }

    getUserJourney() {
        return this.userJourney;
    }

    getSessionData() {
        return this.sessionData;
    }

    forceFlush() {
        this.flushEventQueue(true);
    }
}

// Global instance
window.AnalyticsTrackingSystem = AnalyticsTrackingSystem;

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.analyticsTracker = new AnalyticsTrackingSystem({
            debug: true,
            enableHeatMapping: true,
            enableRealTimeTracking: true
        });
    });
} else {
    window.analyticsTracker = new AnalyticsTrackingSystem({
        debug: true,
        enableHeatMapping: true,
        enableRealTimeTracking: true
    });
}

export default AnalyticsTrackingSystem;