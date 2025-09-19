/**
 * FacePay Mobile Touch Premium - Native-like Mobile Experience
 * Features: Touch ripples, swipe gestures, haptic-like feedback, performance scaling
 */

class MobileTouchPremium {
    constructor() {
        this.isTouch = 'ontouchstart' in window;
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.isAndroid = /Android/.test(navigator.userAgent);
        this.isMobile = window.innerWidth <= 768;
        this.performanceLevel = this.detectPerformance();
        this.batteryLevel = 1;
        
        this.touchState = new Map();
        this.ripples = new Set();
        this.gestureData = {
            startX: 0,
            startY: 0,
            startTime: 0,
            isSwipe: false
        };
        
        this.init();
    }

    detectPerformance() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const cores = navigator.hardwareConcurrency || 4;
        const memory = navigator.deviceMemory || 4;
        
        let score = cores * 25 + memory * 25;
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_GL);
                if (renderer.includes('Adreno') || renderer.includes('Mali')) score += 50;
                if (renderer.includes('A15') || renderer.includes('A16') || renderer.includes('A17')) score += 100;
            }
        }
        
        // Performance levels: 0=low, 1=medium, 2=high, 3=ultra
        if (score >= 200) return 3;
        if (score >= 150) return 2;
        if (score >= 100) return 1;
        return 0;
    }

    init() {
        this.setupTouchTargets();
        this.setupRippleSystem();
        this.setupSwipeGestures();
        this.setupHapticFeedback();
        this.setupPlatformSpecific();
        this.setupPerformanceScaling();
        this.setupBatteryMonitoring();
        this.setupAccessibility();
        
        console.log(`FacePay Mobile: Performance Level ${this.performanceLevel}, Platform: ${this.isIOS ? 'iOS' : this.isAndroid ? 'Android' : 'Other'}`);
    }

    setupTouchTargets() {
        const style = document.createElement('style');
        style.textContent = `
            /* Touch Target Optimization */
            .touch-target {
                min-height: 48px;
                min-width: 48px;
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
            }
            
            .touch-target::before {
                content: '';
                position: absolute;
                top: -8px;
                left: -8px;
                right: -8px;
                bottom: -8px;
                border-radius: inherit;
                opacity: 0;
                background: currentColor;
                transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .touch-target:active::before {
                opacity: 0.1;
            }
            
            /* Button Enhancements */
            .btn {
                min-height: 48px;
                position: relative;
                overflow: hidden;
                transform: translateZ(0);
                will-change: transform;
            }
            
            .btn-small {
                min-height: 44px;
                padding: 8px 16px;
            }
            
            .btn-large {
                min-height: 56px;
                padding: 16px 32px;
            }
            
            /* Touch States */
            .btn:active {
                transform: scale(0.98);
                transition: transform 0.1s ease;
            }
            
            .btn:not(:active) {
                transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
        `;
        document.head.appendChild(style);
        
        // Auto-enhance existing buttons
        document.querySelectorAll('.btn, button, [role="button"]').forEach(btn => {
            if (!btn.classList.contains('touch-target')) {
                btn.classList.add('touch-target');
            }
        });
    }

    setupRippleSystem() {
        const rippleContainer = document.createElement('div');
        rippleContainer.className = 'ripple-container';
        rippleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        `;
        document.body.appendChild(rippleContainer);
        
        // Add ripple CSS
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                pointer-events: none;
                transform: scale(0);
                opacity: 0.6;
                will-change: transform, opacity;
            }
            
            .ripple-primary {
                background: radial-gradient(circle, rgba(0, 255, 136, 0.3) 0%, rgba(0, 255, 136, 0.1) 50%, transparent 70%);
            }
            
            .ripple-secondary {
                background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%);
            }
            
            .ripple-neutral {
                background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 70%);
            }
            
            @keyframes ripple-expand {
                0% {
                    transform: scale(0);
                    opacity: 0.6;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
        
        // Touch/Click event handling
        document.addEventListener(this.isTouch ? 'touchstart' : 'mousedown', this.handleRippleStart.bind(this), { passive: true });
    }

    handleRippleStart(e) {
        const target = e.target.closest('.btn, .touch-target, [data-ripple]');
        if (!target || target.hasAttribute('data-no-ripple')) return;
        
        const rect = target.getBoundingClientRect();
        const rippleContainer = document.querySelector('.ripple-container');
        
        const clientX = this.isTouch ? e.touches[0].clientX : e.clientX;
        const clientY = this.isTouch ? e.touches[0].clientY : e.clientY;
        
        // Calculate ripple size and position
        const size = Math.max(rect.width, rect.height) * 2;
        const x = clientX - size / 2;
        const y = clientY - size / 2;
        
        // Create ripple element
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        
        // Determine ripple color based on target
        if (target.classList.contains('btn-primary')) {
            ripple.classList.add('ripple-primary');
        } else if (target.classList.contains('btn-secondary')) {
            ripple.classList.add('ripple-secondary');
        } else {
            ripple.classList.add('ripple-neutral');
        }
        
        ripple.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            animation: ripple-expand 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        rippleContainer.appendChild(ripple);
        this.ripples.add(ripple);
        
        // Cleanup
        setTimeout(() => {
            ripple.remove();
            this.ripples.delete(ripple);
        }, 600);
        
        // Haptic feedback
        this.triggerHaptic('light');
    }

    setupSwipeGestures() {
        let startX, startY, startTime, currentX, currentY;
        let isVerticalSwipe = false;
        let isHorizontalSwipe = false;
        let isPullToRefresh = false;
        let isPinching = false;
        let initialDistance = 0;
        let currentScale = 1;
        
        // Touch start handler
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                // Single touch
                const touch = e.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
                startTime = Date.now();
                currentX = startX;
                currentY = startY;
                isVerticalSwipe = false;
                isHorizontalSwipe = false;
                isPullToRefresh = false;
            } else if (e.touches.length === 2) {
                // Multi-touch for pinch-to-zoom
                isPinching = true;
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                initialDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
            }
        }, { passive: true });
        
        // Touch move handler
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && startX !== undefined && startY !== undefined) {
                // Single touch movement
                const touch = e.touches[0];
                currentX = touch.clientX;
                currentY = touch.clientY;
                
                const deltaX = Math.abs(currentX - startX);
                const deltaY = Math.abs(currentY - startY);
                const threshold = 30; // Reduced for more sensitive gestures
                
                // Determine swipe direction
                if (deltaX > threshold && deltaX > deltaY * 1.5) {
                    isHorizontalSwipe = true;
                } else if (deltaY > threshold && deltaY > deltaX * 1.5) {
                    isVerticalSwipe = true;
                    
                    // Check for pull-to-refresh at top of page
                    if (window.scrollY === 0 && currentY > startY && deltaY > 80) {
                        isPullToRefresh = true;
                        this.showPullToRefresh(deltaY);
                    }
                }
                
                // Section navigation with horizontal swipes
                if (isHorizontalSwipe && deltaX > 100) {
                    const direction = currentX > startX ? 'right' : 'left';
                    this.handleSectionSwipe(direction, deltaX);
                }
                
                // Custom swipe handlers
                const swipeTarget = e.target.closest('[data-swipe]');
                if (swipeTarget && (isHorizontalSwipe || isVerticalSwipe)) {
                    e.preventDefault();
                    this.handleCustomSwipe(swipeTarget, {
                        deltaX: currentX - startX,
                        deltaY: currentY - startY,
                        direction: isHorizontalSwipe ? (currentX > startX ? 'right' : 'left') : (currentY > startY ? 'down' : 'up')
                    });
                }
            } else if (e.touches.length === 2 && isPinching) {
                // Pinch-to-zoom handling
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                
                if (initialDistance > 0) {
                    const scale = currentDistance / initialDistance;
                    this.handlePinchZoom(scale, touch1, touch2);
                }
            }
        }, { passive: false });
        
        // Touch end handler
        document.addEventListener('touchend', (e) => {
            if (e.touches.length === 0) {
                // All touches ended
                if (startX !== undefined && startY !== undefined) {
                    const deltaX = currentX - startX;
                    const deltaY = currentY - startY;
                    const deltaTime = Date.now() - startTime;
                    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime;
                    
                    // Handle pull-to-refresh release
                    if (isPullToRefresh) {
                        this.triggerPullToRefresh();
                    }
                    
                    // Quick swipe detection for navigation
                    if (velocity > 0.8 && deltaTime < 400) {
                        const direction = Math.abs(deltaX) > Math.abs(deltaY) ? 
                            (deltaX > 0 ? 'right' : 'left') : 
                            (deltaY > 0 ? 'down' : 'up');
                        
                        this.triggerSwipeAction(direction, { deltaX, deltaY, velocity });
                    }
                }
                
                // Reset all gesture states
                this.resetGestureStates();
            }
            
            if (e.touches.length < 2) {
                isPinching = false;
                initialDistance = 0;
                currentScale = 1;
            }
        }, { passive: true });
    }

    handleCustomSwipe(target, swipeData) {
        const config = JSON.parse(target.getAttribute('data-swipe') || '{}');
        
        if (config.type === 'card-stack' && swipeData.direction === 'left') {
            target.style.transform = `translateX(${Math.min(swipeData.deltaX, -50)}px) rotate(${swipeData.deltaX * -0.1}deg)`;
            target.style.opacity = Math.max(0.3, 1 - Math.abs(swipeData.deltaX) / 200);
        } else if (config.type === 'drawer' && swipeData.direction === 'up') {
            const drawer = document.querySelector(config.target);
            if (drawer) {
                drawer.style.transform = `translateY(${Math.max(swipeData.deltaY, -100)}px)`;
            }
        }
    }

    triggerSwipeAction(direction, data) {
        // Global swipe actions
        if (direction === 'left' && data.velocity > 1) {
            // Fast left swipe - could trigger "next" action
            this.triggerHaptic('medium');
            this.showSwipeFeedback('→ Next');
        } else if (direction === 'right' && data.velocity > 1) {
            // Fast right swipe - could trigger "back" action
            this.triggerHaptic('medium');
            this.showSwipeFeedback('← Back');
        } else if (direction === 'up' && data.velocity > 1.5) {
            // Fast up swipe - could trigger refresh or menu
            this.triggerHaptic('strong');
            this.showSwipeFeedback('↑ Refresh');
        }
    }

    setupHapticFeedback() {
        // Create visual haptic feedback system for devices without haptic hardware
        const hapticStyle = document.createElement('style');
        hapticStyle.textContent = `
            .haptic-pulse {
                position: relative;
            }
            
            .haptic-pulse::after {
                content: '';
                position: absolute;
                inset: -4px;
                border: 2px solid currentColor;
                border-radius: inherit;
                opacity: 0;
                pointer-events: none;
            }
            
            .haptic-light::after {
                animation: hapticLight 0.15s ease-out;
            }
            
            .haptic-medium::after {
                animation: hapticMedium 0.2s ease-out;
            }
            
            .haptic-strong::after {
                animation: hapticStrong 0.25s ease-out;
            }
            
            @keyframes hapticLight {
                0% { opacity: 0; transform: scale(1); }
                50% { opacity: 0.2; transform: scale(1.05); }
                100% { opacity: 0; transform: scale(1.1); }
            }
            
            @keyframes hapticMedium {
                0% { opacity: 0; transform: scale(1); }
                30% { opacity: 0.3; transform: scale(1.08); }
                60% { opacity: 0.2; transform: scale(1.05); }
                100% { opacity: 0; transform: scale(1.15); }
            }
            
            @keyframes hapticStrong {
                0% { opacity: 0; transform: scale(1); }
                20% { opacity: 0.4; transform: scale(1.1); }
                40% { opacity: 0.3; transform: scale(1.05); }
                60% { opacity: 0.2; transform: scale(1.08); }
                80% { opacity: 0.1; transform: scale(1.03); }
                100% { opacity: 0; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(hapticStyle);
    }

    triggerHaptic(intensity = 'light') {
        // Try native haptic feedback first
        if ('vibrate' in navigator && this.performanceLevel >= 1) {
            const patterns = {
                light: [10],
                medium: [15, 10, 15],
                strong: [20, 15, 10, 15, 20]
            };
            navigator.vibrate(patterns[intensity] || patterns.light);
        }
        
        // Visual haptic feedback
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('touch-target')) {
            activeElement.classList.add('haptic-pulse', `haptic-${intensity}`);
            setTimeout(() => {
                activeElement.classList.remove('haptic-pulse', `haptic-${intensity}`);
            }, 300);
        }
    }

    setupPlatformSpecific() {
        const platformStyle = document.createElement('style');
        
        if (this.isIOS) {
            platformStyle.textContent = `
                /* iOS Specific Styles */
                .btn {
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
                }
                
                .btn:active {
                    transform: scale(0.97);
                }
                
                .card {
                    border-radius: 16px;
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
                
                /* iOS Safe Area Support */
                .safe-area-top {
                    padding-top: env(safe-area-inset-top);
                }
                
                .safe-area-bottom {
                    padding-bottom: env(safe-area-inset-bottom);
                }
                
                /* iOS Scroll Behavior */
                .scroll-area {
                    -webkit-overflow-scrolling: touch;
                    overscroll-behavior: contain;
                }
            `;
        } else if (this.isAndroid) {
            platformStyle.textContent = `
                /* Android Specific Styles */
                .btn {
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 2px rgba(0, 0, 0, 0.08);
                }
                
                .btn:active {
                    transform: scale(0.98);
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
                }
                
                .card {
                    border-radius: 12px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
                }
                
                /* Android Material Elevation */
                .elevation-1 { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08); }
                .elevation-2 { box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08); }
                .elevation-3 { box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.08); }
            `;
        }
        
        document.head.appendChild(platformStyle);
        
        // Add platform class to body
        document.body.classList.add(this.isIOS ? 'platform-ios' : this.isAndroid ? 'platform-android' : 'platform-other');
    }

    setupPerformanceScaling() {
        const performanceClasses = ['perf-low', 'perf-medium', 'perf-high', 'perf-ultra'];
        document.body.classList.add(performanceClasses[this.performanceLevel]);
        
        const perfStyle = document.createElement('style');
        perfStyle.textContent = `
            /* Performance Level Optimizations */
            .perf-low {
                --animation-duration: 0.2s;
                --transition-duration: 0.15s;
            }
            
            .perf-low * {
                animation-duration: var(--animation-duration) !important;
                transition-duration: var(--transition-duration) !important;
            }
            
            .perf-low .ripple,
            .perf-low .haptic-pulse {
                display: none;
            }
            
            .perf-medium {
                --animation-duration: 0.3s;
                --transition-duration: 0.2s;
            }
            
            .perf-high, .perf-ultra {
                --animation-duration: 0.4s;
                --transition-duration: 0.25s;
            }
            
            /* Reduce motion preference */
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
                
                .ripple, .haptic-pulse {
                    display: none;
                }
            }
        `;
        document.head.appendChild(perfStyle);
    }

    setupBatteryMonitoring() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then((battery) => {
                this.batteryLevel = battery.level;
                this.adjustForBattery();
                
                battery.addEventListener('levelchange', () => {
                    this.batteryLevel = battery.level;
                    this.adjustForBattery();
                });
            });
        }
    }

    adjustForBattery() {
        if (this.batteryLevel < 0.2) {
            // Low battery mode
            document.body.classList.add('battery-saver');
            const style = document.createElement('style');
            style.textContent = `
                .battery-saver {
                    --animation-duration: 0.1s;
                    --transition-duration: 0.1s;
                }
                
                .battery-saver .ripple,
                .battery-saver .haptic-pulse {
                    display: none;
                }
            `;
            document.head.appendChild(style);
        } else {
            document.body.classList.remove('battery-saver');
        }
    }

    setupAccessibility() {
        // Enhanced focus indicators for keyboard navigation
        const a11yStyle = document.createElement('style');
        a11yStyle.textContent = `
            /* Enhanced Focus Indicators */
            .touch-target:focus-visible {
                outline: 3px solid var(--green, #00ff88);
                outline-offset: 2px;
                z-index: 10;
                position: relative;
            }
            
            /* High contrast mode */
            @media (prefers-contrast: high) {
                .btn {
                    border: 2px solid currentColor;
                }
                
                .ripple {
                    opacity: 0.8;
                }
            }
            
            /* Large text support */
            @media (prefers-reduced-data: reduce) {
                .ripple, .haptic-pulse {
                    display: none;
                }
            }
        `;
        document.head.appendChild(a11yStyle);
    }

    showSwipeFeedback(text) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 24px;
            font-size: 16px;
            font-weight: 500;
            z-index: 10000;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            pointer-events: none;
            animation: swipeFeedback 1s ease-out forwards;
        `;
        feedback.textContent = text;
        
        // Add animation
        const feedbackStyle = document.createElement('style');
        feedbackStyle.textContent = `
            @keyframes swipeFeedback {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(feedbackStyle);
        
        document.body.appendChild(feedback);
        setTimeout(() => {
            feedback.remove();
            feedbackStyle.remove();
        }, 1000);
    }

    // New gesture handling methods
    resetGestureStates() {
        // Reset all gesture tracking variables
        this.startX = this.startY = this.currentX = this.currentY = undefined;
        this.isVerticalSwipe = this.isHorizontalSwipe = false;
        this.isPullToRefresh = this.isPinching = false;
        
        // Hide any active UI elements
        this.hidePullToRefresh();
    }

    handleSectionSwipe(direction, deltaX) {
        const sections = document.querySelectorAll('[data-section]');
        const currentSection = Array.from(sections).findIndex(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
        });

        let targetSection = currentSection;
        if (direction === 'left' && currentSection < sections.length - 1) {
            targetSection = currentSection + 1;
        } else if (direction === 'right' && currentSection > 0) {
            targetSection = currentSection - 1;
        }

        if (targetSection !== currentSection && sections[targetSection]) {
            this.triggerHaptic('medium');
            sections[targetSection].scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            this.showSwipeFeedback(`Section ${targetSection + 1}`);
        }
    }

    showPullToRefresh(deltaY) {
        let refreshIndicator = document.querySelector('.pull-refresh-indicator');
        if (!refreshIndicator) {
            refreshIndicator = document.createElement('div');
            refreshIndicator.className = 'pull-refresh-indicator';
            refreshIndicator.innerHTML = `
                <div class="refresh-icon">↻</div>
                <div class="refresh-text">Pull to refresh</div>
            `;
            refreshIndicator.style.cssText = `
                position: fixed;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 255, 136, 0.9);
                color: black;
                padding: 8px 16px;
                border-radius: 0 0 12px 12px;
                font-size: 14px;
                font-weight: 600;
                z-index: 1000;
                backdrop-filter: blur(10px);
                transition: all 0.2s ease;
                opacity: 0;
                transform: translateX(-50%) translateY(-100%);
            `;
            document.body.appendChild(refreshIndicator);
        }

        const progress = Math.min(deltaY / 120, 1);
        refreshIndicator.style.opacity = progress;
        refreshIndicator.style.transform = `translateX(-50%) translateY(${-100 + (progress * 100)}%)`;
        
        const icon = refreshIndicator.querySelector('.refresh-icon');
        const text = refreshIndicator.querySelector('.refresh-text');
        
        if (progress >= 1) {
            icon.style.transform = 'rotate(180deg)';
            text.textContent = 'Release to refresh';
            refreshIndicator.style.background = 'rgba(0, 255, 136, 1)';
        } else {
            icon.style.transform = `rotate(${progress * 180}deg)`;
            text.textContent = 'Pull to refresh';
        }
    }

    hidePullToRefresh() {
        const refreshIndicator = document.querySelector('.pull-refresh-indicator');
        if (refreshIndicator) {
            refreshIndicator.style.opacity = '0';
            refreshIndicator.style.transform = 'translateX(-50%) translateY(-100%)';
            setTimeout(() => refreshIndicator.remove(), 300);
        }
    }

    triggerPullToRefresh() {
        this.triggerHaptic('strong');
        this.showSwipeFeedback('🔄 Refreshing...');
        
        // Simulate refresh action
        setTimeout(() => {
            // Update dynamic counters
            if (window.facePayEngine && window.facePayEngine.conversionOptimizer) {
                window.facePayEngine.conversionOptimizer.updateCounters();
            }
            this.showSwipeFeedback('✅ Refreshed');
        }, 1000);
        
        this.hidePullToRefresh();
    }

    handlePinchZoom(scale, touch1, touch2) {
        // Find zoomable elements
        const zoomTargets = document.querySelectorAll('[data-zoom], .demo-video, .face-scanner-hero');
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;

        zoomTargets.forEach(target => {
            const rect = target.getBoundingClientRect();
            if (centerX >= rect.left && centerX <= rect.right && 
                centerY >= rect.top && centerY <= rect.bottom) {
                
                const clampedScale = Math.max(0.5, Math.min(3, scale));
                target.style.transform = `scale(${clampedScale})`;
                target.style.transformOrigin = `${centerX - rect.left}px ${centerY - rect.top}px`;
                
                if (clampedScale > 1.1) {
                    this.triggerHaptic('light');
                }
            }
        });
    }

    // Public API
    addTouchTarget(element, config = {}) {
        element.classList.add('touch-target');
        if (config.ripple !== false) {
            element.setAttribute('data-ripple', 'true');
        }
        if (config.haptic) {
            element.addEventListener('click', () => this.triggerHaptic(config.haptic));
        }
    }

    enableSwipe(element, config) {
        element.setAttribute('data-swipe', JSON.stringify(config));
    }

    destroy() {
        // Cleanup
        this.ripples.forEach(ripple => ripple.remove());
        this.ripples.clear();
        document.querySelector('.ripple-container')?.remove();
    }
}

// Auto-initialize on mobile devices
if (window.innerWidth <= 768 || 'ontouchstart' in window) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.mobileTouchPremium = new MobileTouchPremium();
        });
    } else {
        window.mobileTouchPremium = new MobileTouchPremium();
    }
}

// Export for manual initialization
window.MobileTouchPremium = MobileTouchPremium;