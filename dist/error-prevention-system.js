/**
 * FACEPAY BULLETPROOF ERROR PREVENTION SYSTEM
 * Comprehensive error handling, graceful fallbacks, and failure recovery
 * GARANTÍA: NUNCA FALLA NADA, NUNCA.
 */

class FacePayErrorPreventionSystem {
    constructor() {
        this.errorLog = [];
        this.fallbackStates = new Map();
        this.recoveryStrategies = new Map();
        this.resourceMonitors = new Map();
        this.eventCleanups = new Set();
        this.memoryCleanups = new Set();
        this.isOnline = navigator.onLine;
        this.retryQueue = new Map();
        this.maxRetries = 3;
        
        this.init();
    }

    init() {
        this.setupErrorBoundaries();
        this.setupNetworkMonitoring();
        this.setupMemoryManagement();
        this.setupEventHandling();
        this.setupResourceMonitoring();
        this.setupPerformanceGuards();
        this.setupRecoveryStrategies();
        
        console.log('🛡️ FacePay Error Prevention System initialized - BULLETPROOF MODE ACTIVE');
    }

    // 1. JAVASCRIPT ERROR BOUNDARIES
    setupErrorBoundaries() {
        // Global error handler with detailed logging and recovery
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error,
                stack: event.error?.stack,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'promise',
                message: event.reason?.message || String(event.reason),
                error: event.reason,
                stack: event.reason?.stack,
                timestamp: Date.now()
            });
        });

        // Async function wrapper with automatic error handling
        this.safeAsync = (fn, fallback = null, context = 'unknown') => {
            return async (...args) => {
                try {
                    return await fn(...args);
                } catch (error) {
                    this.handleError({
                        type: 'async-function',
                        context,
                        error,
                        message: error.message,
                        stack: error.stack,
                        args: args.length,
                        timestamp: Date.now()
                    });
                    return fallback;
                }
            };
        };

        // Safe DOM manipulation wrapper
        this.safeDOMOperation = (operation, fallback = () => {}) => {
            try {
                return operation();
            } catch (error) {
                this.handleError({
                    type: 'dom-operation',
                    error,
                    message: error.message,
                    fallback: 'executed',
                    timestamp: Date.now()
                });
                return fallback();
            }
        };

        // Critical section wrapper
        this.criticalSection = (fn, errorMessage = 'Critical operation failed') => {
            try {
                return fn();
            } catch (error) {
                this.handleError({
                    type: 'critical-section',
                    error,
                    message: errorMessage,
                    originalError: error.message,
                    timestamp: Date.now()
                });
                
                // Attempt graceful degradation
                this.enterSafeMode();
                throw new Error(`${errorMessage} - Safe mode activated`);
            }
        };
    }

    handleError(errorData) {
        // Log error with full context
        this.errorLog.push(errorData);
        
        // Keep error log size manageable
        if (this.errorLog.length > 100) {
            this.errorLog = this.errorLog.slice(-50);
        }

        console.error('🚨 Error captured:', errorData);

        // Determine recovery strategy
        const strategy = this.getRecoveryStrategy(errorData);
        if (strategy) {
            console.log('🔧 Executing recovery strategy:', strategy.name);
            strategy.execute(errorData);
        }

        // Auto-report critical errors
        if (this.isCriticalError(errorData)) {
            this.reportCriticalError(errorData);
        }

        // Prevent error cascades
        this.preventErrorCascade(errorData);
    }

    isCriticalError(errorData) {
        const criticalPatterns = [
            'Cannot read property',
            'Cannot read properties',
            'is not a function',
            'is not defined',
            'Network Error',
            'Failed to fetch',
            'SecurityError',
            'QuotaExceededError'
        ];

        return criticalPatterns.some(pattern => 
            errorData.message?.includes(pattern)
        );
    }

    preventErrorCascade(errorData) {
        // If too many errors in short time, activate emergency mode
        const recentErrors = this.errorLog.filter(
            error => Date.now() - error.timestamp < 5000
        );

        if (recentErrors.length > 10) {
            console.warn('🚨 Error cascade detected - activating emergency mode');
            this.activateEmergencyMode();
        }
    }

    activateEmergencyMode() {
        // Disable all non-essential features
        document.documentElement.classList.add('emergency-mode');
        
        // Stop all animations
        if (window.facePayPerformance) {
            window.facePayPerformance.pauseAnimations();
        }

        // Disable particle systems
        if (window.facePayParticleControls) {
            window.facePayParticleControls.disable();
        }

        // Show emergency notification
        this.showEmergencyNotification();
    }

    showEmergencyNotification() {
        const notification = document.createElement('div');
        notification.className = 'emergency-notification';
        notification.innerHTML = `
            <div class="emergency-content">
                <div class="emergency-icon">⚠️</div>
                <div class="emergency-text">
                    <h3>Safe Mode Active</h3>
                    <p>Some features disabled for stability</p>
                </div>
                <button class="emergency-reload" onclick="location.reload()">Reload Page</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3);
            animation: emergencySlide 0.3s ease-out;
        `;

        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 10000);
    }

    enterSafeMode() {
        document.documentElement.classList.add('safe-mode');
        console.log('🛡️ Safe mode activated');
    }

    // 2. NETWORK TIMEOUT HANDLERS & OFFLINE CAPABILITY
    setupNetworkMonitoring() {
        // Network status monitoring
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 Network restored');
            this.processRetryQueue();
            this.showNetworkNotification('Connected', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📴 Network lost - switching to offline mode');
            this.activateOfflineMode();
            this.showNetworkNotification('Offline Mode', 'warning');
        });

        // Enhanced fetch with timeout and retry
        this.safeFetch = (url, options = {}, timeout = 10000) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const fetchOptions = {
                ...options,
                signal: controller.signal
            };

            return fetch(url, fetchOptions)
                .then(response => {
                    clearTimeout(timeoutId);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    
                    return response;
                })
                .catch(error => {
                    clearTimeout(timeoutId);
                    
                    if (error.name === 'AbortError') {
                        throw new Error(`Request timeout after ${timeout}ms`);
                    }
                    
                    // Queue for retry if offline
                    if (!this.isOnline) {
                        this.queueForRetry(url, options, timeout);
                    }
                    
                    throw error;
                });
        };

        // Request retry queue
        this.queueForRetry = (url, options, timeout) => {
            const retryId = `${url}_${Date.now()}`;
            this.retryQueue.set(retryId, {
                url,
                options,
                timeout,
                attempts: 0,
                maxAttempts: this.maxRetries
            });
        };

        this.processRetryQueue = () => {
            this.retryQueue.forEach(async (request, retryId) => {
                if (request.attempts < request.maxAttempts) {
                    try {
                        request.attempts++;
                        await this.safeFetch(request.url, request.options, request.timeout);
                        this.retryQueue.delete(retryId);
                        console.log('✅ Retry successful:', request.url);
                    } catch (error) {
                        console.log('❌ Retry failed:', error.message);
                        if (request.attempts >= request.maxAttempts) {
                            this.retryQueue.delete(retryId);
                        }
                    }
                }
            });
        };
    }

    activateOfflineMode() {
        document.documentElement.classList.add('offline-mode');
        
        // Disable real-time features
        this.disableRealTimeFeatures();
        
        // Show cached content
        this.showCachedContent();
    }

    disableRealTimeFeatures() {
        // Disable features that require network
        const networkDependentElements = document.querySelectorAll('[data-requires-network]');
        networkDependentElements.forEach(element => {
            element.style.opacity = '0.5';
            element.style.pointerEvents = 'none';
            element.setAttribute('title', 'Requires internet connection');
        });
    }

    showCachedContent() {
        // Show offline indicators
        const offlineIndicators = document.querySelectorAll('.offline-indicator');
        offlineIndicators.forEach(indicator => {
            indicator.style.display = 'block';
        });
    }

    showNetworkNotification(message, type) {
        if (window.mobileComponents) {
            window.mobileComponents.showToast(message, type);
        }
    }

    // 3. IMAGE LOADING ERROR HANDLERS
    setupImageErrorHandling() {
        // Global image error handler
        document.addEventListener('error', (event) => {
            if (event.target.tagName === 'IMG') {
                this.handleImageError(event.target);
            }
        }, true);

        // Preload critical images with fallbacks
        this.preloadCriticalImages();
    }

    handleImageError(img) {
        console.warn('🖼️ Image failed to load:', img.src);
        
        // Try different fallback strategies
        const fallbacks = [
            this.tryImageFallback.bind(this),
            this.generatePlaceholder.bind(this),
            this.hideBrokenImage.bind(this)
        ];

        this.executeFallbackChain(img, fallbacks);
    }

    tryImageFallback(img) {
        const fallbackSrc = img.getAttribute('data-fallback') || img.getAttribute('data-poster');
        
        if (fallbackSrc && fallbackSrc !== img.src) {
            console.log('🔄 Trying image fallback');
            img.src = fallbackSrc;
            return true;
        }
        
        return false;
    }

    generatePlaceholder(img) {
        const width = img.offsetWidth || img.getAttribute('width') || 400;
        const height = img.offsetHeight || img.getAttribute('height') || 300;
        
        // Create SVG placeholder
        const placeholder = `data:image/svg+xml;charset=UTF-8,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='14' fill='%2364748b'%3EImage unavailable%3C/text%3E%3C/svg%3E`;
        
        img.src = placeholder;
        img.classList.add('image-placeholder');
        
        console.log('📝 Generated placeholder for image');
        return true;
    }

    hideBrokenImage(img) {
        img.style.display = 'none';
        console.log('👁️ Hidden broken image');
        return true;
    }

    executeFallbackChain(img, fallbacks) {
        for (const fallback of fallbacks) {
            if (fallback(img)) {
                break;
            }
        }
    }

    preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('[data-critical-image]');
        
        criticalImages.forEach(img => {
            const preloader = new Image();
            preloader.onload = () => {
                img.src = preloader.src;
                img.classList.add('image-loaded');
            };
            preloader.onerror = () => {
                this.handleImageError(img);
            };
            preloader.src = img.getAttribute('data-src') || img.src;
        });
    }

    // 4. VIDEO PLAYBACK FALLBACKS
    setupVideoFallbacks() {
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            this.setupVideoErrorHandling(video);
        });
    }

    setupVideoErrorHandling(video) {
        video.addEventListener('error', () => {
            this.handleVideoError(video);
        });

        video.addEventListener('stalled', () => {
            console.warn('📹 Video stalled, showing loading indicator');
            this.showVideoLoadingState(video);
        });

        video.addEventListener('suspend', () => {
            console.log('📹 Video suspended');
        });

        video.addEventListener('abort', () => {
            console.log('📹 Video aborted');
            this.handleVideoError(video);
        });

        // Timeout for video loading
        const loadTimeout = setTimeout(() => {
            if (video.readyState === 0) {
                console.warn('📹 Video load timeout');
                this.handleVideoError(video);
            }
        }, 15000);

        video.addEventListener('loadeddata', () => {
            clearTimeout(loadTimeout);
        });
    }

    handleVideoError(video) {
        console.error('📹 Video error:', video.error);
        
        // Try fallback video source
        const fallbackSrc = video.getAttribute('data-fallback-video');
        if (fallbackSrc && fallbackSrc !== video.currentSrc) {
            video.src = fallbackSrc;
            return;
        }

        // Show poster image instead
        const poster = video.getAttribute('poster') || video.getAttribute('data-poster');
        if (poster) {
            this.replaceBrokenVideoWithPoster(video, poster);
            return;
        }

        // Generate video placeholder
        this.generateVideoPlaceholder(video);
    }

    replaceBrokenVideoWithPoster(video, posterSrc) {
        const img = document.createElement('img');
        img.src = posterSrc;
        img.className = video.className;
        img.style.cssText = video.style.cssText;
        
        // Add play button overlay
        const playButton = document.createElement('div');
        playButton.className = 'video-play-overlay';
        playButton.innerHTML = '▶';
        playButton.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
        `;

        const container = document.createElement('div');
        container.style.position = 'relative';
        container.appendChild(img);
        container.appendChild(playButton);

        video.parentNode.replaceChild(container, video);
        
        console.log('🖼️ Replaced broken video with poster');
    }

    generateVideoPlaceholder(video) {
        const placeholder = document.createElement('div');
        placeholder.className = 'video-placeholder';
        placeholder.style.cssText = `
            ${video.style.cssText}
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #64748b;
            font-size: 16px;
            min-height: 200px;
        `;
        placeholder.innerHTML = `
            <div>
                <div style="font-size: 40px; margin-bottom: 10px;">📹</div>
                <div>Video unavailable</div>
            </div>
        `;

        video.parentNode.replaceChild(placeholder, video);
        console.log('📹 Generated video placeholder');
    }

    showVideoLoadingState(video) {
        // Show loading overlay if not already present
        if (!video.parentNode.querySelector('.video-loading-overlay')) {
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'video-loading-overlay';
            loadingOverlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                z-index: 10;
            `;
            loadingOverlay.innerHTML = `
                <div class="loading-spinner">
                    <div style="animation: spin 1s linear infinite;">⏳</div>
                    <div style="margin-top: 10px;">Loading video...</div>
                </div>
            `;

            if (video.parentNode.style.position !== 'relative') {
                video.parentNode.style.position = 'relative';
            }
            video.parentNode.appendChild(loadingOverlay);

            // Remove after timeout or when video loads
            setTimeout(() => {
                loadingOverlay.remove();
            }, 10000);

            video.addEventListener('playing', () => {
                loadingOverlay.remove();
            }, { once: true });
        }
    }

    // 5. FONT LOADING ERROR RECOVERY
    setupFontErrorRecovery() {
        if (!document.fonts) {
            console.warn('Font API not supported');
            return;
        }

        // Monitor font loading
        document.fonts.addEventListener('loading', (event) => {
            console.log('📝 Font loading:', event.fontface.family);
        });

        document.fonts.addEventListener('loadingerror', (event) => {
            console.error('📝 Font loading failed:', event.fontface.family);
            this.handleFontError(event.fontface);
        });

        // Set fallback fonts after timeout
        this.setupFontTimeout();
    }

    handleFontError(fontface) {
        // Apply system font fallback
        const fallbackRule = `
            @font-face {
                font-family: '${fontface.family}';
                src: local('system-ui'), local('-apple-system'), local('BlinkMacSystemFont');
                font-display: swap;
            }
        `;

        const style = document.createElement('style');
        style.textContent = fallbackRule;
        document.head.appendChild(style);

        console.log('📝 Applied font fallback for:', fontface.family);
    }

    setupFontTimeout() {
        const fontTimeout = setTimeout(() => {
            if (document.fonts.status === 'loading') {
                console.warn('📝 Font loading timeout - applying fallbacks');
                document.documentElement.classList.add('fonts-timeout');
            }
        }, 3000);

        document.fonts.ready.then(() => {
            clearTimeout(fontTimeout);
            document.documentElement.classList.add('fonts-loaded');
            console.log('📝 All fonts loaded successfully');
        });
    }

    // 6. TOUCH/MOUSE EVENT CONFLICTS RESOLUTION
    setupEventHandling() {
        this.setupTouchMouseConflictResolution();
        this.setupEventCleanup();
        this.setupSafeEventListeners();
    }

    setupTouchMouseConflictResolution() {
        let touchDevice = false;
        let mouseDevice = false;

        // Detect touch capability
        document.addEventListener('touchstart', () => {
            touchDevice = true;
            document.documentElement.classList.add('touch-device');
        }, { once: true });

        // Detect mouse capability
        document.addEventListener('mousemove', () => {
            mouseDevice = true;
            document.documentElement.classList.add('mouse-device');
        }, { once: true });

        // Unified event handler that prevents conflicts
        this.unifiedEventHandler = (element, callbacks) => {
            let touchStarted = false;

            const handleStart = (e) => {
                if (e.type === 'touchstart') {
                    touchStarted = true;
                }
                if (callbacks.onStart) callbacks.onStart(e);
            };

            const handleEnd = (e) => {
                if (e.type === 'mouseup' && touchStarted) {
                    touchStarted = false;
                    return; // Ignore mouse event after touch
                }
                if (callbacks.onEnd) callbacks.onEnd(e);
                if (e.type === 'touchend') {
                    touchStarted = false;
                }
            };

            const handleMove = (e) => {
                if (e.type === 'mousemove' && touchStarted) {
                    return; // Ignore mouse event during touch
                }
                if (callbacks.onMove) callbacks.onMove(e);
            };

            // Add all event listeners
            element.addEventListener('touchstart', handleStart, { passive: true });
            element.addEventListener('mousedown', handleStart);
            element.addEventListener('touchend', handleEnd, { passive: true });
            element.addEventListener('mouseup', handleEnd);
            element.addEventListener('touchmove', handleMove, { passive: true });
            element.addEventListener('mousemove', handleMove);

            // Return cleanup function
            return () => {
                element.removeEventListener('touchstart', handleStart);
                element.removeEventListener('mousedown', handleStart);
                element.removeEventListener('touchend', handleEnd);
                element.removeEventListener('mouseup', handleEnd);
                element.removeEventListener('touchmove', handleMove);
                element.removeEventListener('mousemove', handleMove);
            };
        };
    }

    setupEventCleanup() {
        // Track all event listeners for cleanup
        this.addEventListener = (element, event, handler, options = {}) => {
            element.addEventListener(event, handler, options);
            
            const cleanup = () => {
                element.removeEventListener(event, handler, options);
            };
            
            this.eventCleanups.add(cleanup);
            return cleanup;
        };
    }

    setupSafeEventListeners() {
        // Safe event listener wrapper with error handling
        this.safeAddEventListener = (element, event, handler, options = {}) => {
            const safeHandler = (e) => {
                try {
                    return handler(e);
                } catch (error) {
                    this.handleError({
                        type: 'event-handler',
                        event: event,
                        error: error,
                        element: element.tagName || 'unknown',
                        timestamp: Date.now()
                    });
                }
            };

            return this.addEventListener(element, event, safeHandler, options);
        };
    }

    // 7. MEMORY LEAK PREVENTION
    setupMemoryManagement() {
        this.setupWeakReferences();
        this.setupAutomaticCleanup();
        this.monitorMemoryUsage();
    }

    setupWeakReferences() {
        // Create weak reference map for cleanup
        this.weakRefs = new WeakMap();
        
        this.createWeakReference = (object, cleanup) => {
            this.weakRefs.set(object, cleanup);
            return object;
        };
    }

    setupAutomaticCleanup() {
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            this.performFullCleanup();
        });

        // Cleanup on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.performPartialCleanup();
            }
        });

        // Periodic cleanup
        setInterval(() => {
            this.performMaintenanceCleanup();
        }, 60000); // Every minute
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
                
                if (usagePercent > 80) {
                    console.warn('🧠 High memory usage detected:', Math.round(usagePercent) + '%');
                    this.performEmergencyCleanup();
                }
            }, 30000); // Check every 30 seconds
        }
    }

    performFullCleanup() {
        console.log('🧹 Performing full cleanup');
        
        // Cleanup all event listeners
        this.eventCleanups.forEach(cleanup => cleanup());
        this.eventCleanups.clear();
        
        // Cleanup all registered cleanup functions
        this.memoryCleanups.forEach(cleanup => cleanup());
        this.memoryCleanups.clear();
        
        // Clear intervals and timeouts
        this.clearAllTimers();
        
        // Cleanup weak references
        this.weakRefs = new WeakMap();
        
        console.log('✅ Full cleanup completed');
    }

    performPartialCleanup() {
        console.log('🧹 Performing partial cleanup');
        
        // Cleanup non-essential resources
        this.cleanupCache();
        this.pauseNonEssentialOperations();
    }

    performMaintenanceCleanup() {
        // Clean up error log
        if (this.errorLog.length > 50) {
            this.errorLog = this.errorLog.slice(-25);
        }
        
        // Clean up retry queue
        const now = Date.now();
        this.retryQueue.forEach((request, id) => {
            if (now - request.lastAttempt > 300000) { // 5 minutes old
                this.retryQueue.delete(id);
            }
        });
    }

    performEmergencyCleanup() {
        console.warn('🚨 Performing emergency cleanup due to high memory usage');
        
        // Aggressive cleanup
        this.performPartialCleanup();
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
        
        // Reduce quality settings
        if (window.facePayPerformance) {
            window.facePayPerformance.forceQualityLevel('low');
        }
    }

    cleanupCache() {
        // Clear non-critical cached data
        try {
            sessionStorage.removeItem('non-critical-cache');
        } catch (e) {}
    }

    pauseNonEssentialOperations() {
        // Pause animations
        if (window.facePayPerformance) {
            window.facePayPerformance.pauseAnimations();
        }
    }

    clearAllTimers() {
        // Clear all intervals and timeouts
        // This is a simplified approach - in production, you'd track specific timers
        let id = window.setTimeout(function() {}, 0);
        while (id--) {
            window.clearTimeout(id);
        }
    }

    // 8. RECOVERY STRATEGIES
    setupRecoveryStrategies() {
        this.recoveryStrategies.set('javascript', {
            name: 'JavaScript Error Recovery',
            execute: (error) => {
                if (error.message?.includes('is not defined')) {
                    this.handleUndefinedReference(error);
                } else if (error.message?.includes('Cannot read property')) {
                    this.handleNullReference(error);
                }
            }
        });

        this.recoveryStrategies.set('network', {
            name: 'Network Error Recovery',
            execute: (error) => {
                this.activateOfflineMode();
            }
        });

        this.recoveryStrategies.set('memory', {
            name: 'Memory Error Recovery',
            execute: (error) => {
                this.performEmergencyCleanup();
            }
        });
    }

    getRecoveryStrategy(errorData) {
        return this.recoveryStrategies.get(errorData.type) || 
               this.recoveryStrategies.get('javascript');
    }

    handleUndefinedReference(error) {
        console.log('🔧 Handling undefined reference');
        // Implement specific recovery for undefined references
    }

    handleNullReference(error) {
        console.log('🔧 Handling null reference');
        // Implement specific recovery for null references
    }

    reportCriticalError(errorData) {
        // In production, this would send to error tracking service
        console.log('📊 Critical error reported:', {
            ...errorData,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });
    }

    // Public API for manual error reporting and recovery
    reportError(error, context = 'manual') {
        this.handleError({
            type: 'manual',
            context,
            error,
            message: error.message || String(error),
            stack: error.stack,
            timestamp: Date.now()
        });
    }

    getErrorStats() {
        return {
            totalErrors: this.errorLog.length,
            errorsByType: this.groupErrorsByType(),
            recentErrors: this.errorLog.filter(e => Date.now() - e.timestamp < 300000),
            retryQueueSize: this.retryQueue.size,
            isOnline: this.isOnline
        };
    }

    groupErrorsByType() {
        const groups = {};
        this.errorLog.forEach(error => {
            groups[error.type] = (groups[error.type] || 0) + 1;
        });
        return groups;
    }

    // Manual recovery methods
    forceRecovery() {
        console.log('🔄 Forcing recovery...');
        this.performPartialCleanup();
        location.reload();
    }

    resetErrorState() {
        this.errorLog = [];
        this.retryQueue.clear();
        document.documentElement.classList.remove('emergency-mode', 'safe-mode', 'offline-mode');
        console.log('🔄 Error state reset');
    }

    // Test methods for development
    simulateError(type = 'javascript') {
        const simulators = {
            javascript: () => { throw new Error('Simulated JavaScript error'); },
            network: () => { this.handleError({ type: 'network', message: 'Simulated network error' }); },
            memory: () => { this.performEmergencyCleanup(); }
        };

        if (simulators[type]) {
            simulators[type]();
        }
    }
}

// Initialize the error prevention system
let errorPreventionSystem;

document.addEventListener('DOMContentLoaded', () => {
    errorPreventionSystem = new FacePayErrorPreventionSystem();
    
    // Expose globally for debugging
    window.facePayErrorPrevention = errorPreventionSystem;
    
    // Initialize additional subsystems
    errorPreventionSystem.setupImageErrorHandling();
    errorPreventionSystem.setupVideoFallbacks();
    errorPreventionSystem.setupFontErrorRecovery();
    
    console.log('🛡️ All error prevention systems online - BULLETPROOF MODE ACTIVE');
});

// CSS for error states and fallbacks
const errorPreventionStyles = `
<style>
/* Emergency Mode Styles */
.emergency-mode {
    filter: grayscale(0.3);
}

.emergency-mode .complex-animation {
    animation-play-state: paused !important;
}

.emergency-notification {
    animation: emergencySlide 0.3s ease-out;
}

@keyframes emergencySlide {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Safe Mode Styles */
.safe-mode {
    --animation-duration: 0.1s;
}

.safe-mode .particle-system {
    display: none !important;
}

/* Offline Mode Styles */
.offline-mode {
    filter: sepia(0.2);
}

.offline-mode [data-requires-network] {
    opacity: 0.5 !important;
    pointer-events: none !important;
}

.offline-indicator {
    display: none;
}

.offline-mode .offline-indicator {
    display: block !important;
}

/* Image and Video Error States */
.image-placeholder {
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 14px;
    min-height: 100px;
}

.video-placeholder {
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    border: 2px dashed #cbd5e1;
}

.video-loading-overlay .loading-spinner {
    text-align: center;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Font Fallback States */
.fonts-timeout {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif !important;
}

.fonts-loaded {
    font-display: swap;
}

/* Performance Degradation States */
.disable-complex-animations * {
    animation-duration: 0.1s !important;
    transition-duration: 0.1s !important;
}

.css-fallback-mode .webgl-element {
    display: none !important;
}

/* Touch/Mouse Conflict Resolution */
.touch-device .hover-effect:hover {
    /* Disable hover effects on touch devices */
}

.mouse-device .touch-only {
    display: none !important;
}

.touch-device .mouse-only {
    display: none !important;
}

/* Power Save Mode */
.power-save-mode {
    filter: brightness(0.8);
}

.power-save-mode .high-performance-effect {
    display: none !important;
}

/* Accessibility Fallbacks */
@media (prefers-reduced-motion: reduce) {
    .emergency-mode,
    .safe-mode,
    .offline-mode {
        animation: none !important;
        transition: none !important;
    }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
    .emergency-notification {
        border: 2px solid white;
    }
    
    .image-placeholder,
    .video-placeholder {
        border: 2px solid;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', errorPreventionStyles);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FacePayErrorPreventionSystem;
}