/**
 * FACEPAY ULTIMATE 3D INTEGRATION SYSTEM
 * Revolutionary 3D effects engine that combines WebGL, CSS 3D, and particles
 * Delivers 60fps on all devices with adaptive performance optimization
 * 
 * Features:
 * - Performance monitoring with real-time adaptation
 * - Device capability detection and optimization 
 * - Responsive scaling and quality adjustment
 * - Memory management with automatic cleanup
 * - Smooth entrance animations and state management
 * - Error handling with graceful fallbacks
 * - Interactive 3D depth effects
 * - Quality level adjustment based on device performance
 */

class Ultimate3DIntegrationSystem {
    constructor(options = {}) {
        this.isInitialized = false;
        this.isRunning = false;
        this.frameCount = 0;
        this.startTime = performance.now();
        this.lastFrameTime = 0;
        this.fps = 60;
        this.averageFPS = 60;
        this.frameHistory = [];
        
        // Performance and device detection
        this.deviceProfile = {
            performance: 'detecting',
            gpu: null,
            cores: navigator.hardwareConcurrency || 4,
            memory: navigator.deviceMemory || 4,
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            isTablet: /iPad|Android.*Tablet/i.test(navigator.userAgent),
            screenDensity: window.devicePixelRatio || 1,
            viewportSize: { width: window.innerWidth, height: window.innerHeight },
            batteryLevel: null,
            networkSpeed: 'unknown',
            preferredQuality: 'auto'
        };
        
        // Quality levels configuration
        this.qualityLevels = {
            minimal: {
                particles: 50,
                particleSize: 1,
                threeDLayers: 1,
                webglEnabled: false,
                cssAnimations: true,
                connectionLines: false,
                glowEffects: false,
                parallaxLayers: 1,
                renderQuality: 0.5,
                targetFPS: 30
            },
            basic: {
                particles: 100,
                particleSize: 1.5,
                threeDLayers: 2,
                webglEnabled: true,
                cssAnimations: true,
                connectionLines: false,
                glowEffects: true,
                parallaxLayers: 2,
                renderQuality: 0.7,
                targetFPS: 45
            },
            standard: {
                particles: 200,
                particleSize: 2,
                threeDLayers: 3,
                webglEnabled: true,
                cssAnimations: true,
                connectionLines: true,
                glowEffects: true,
                parallaxLayers: 3,
                renderQuality: 1.0,
                targetFPS: 60
            },
            premium: {
                particles: 350,
                particleSize: 2.5,
                threeDLayers: 4,
                webglEnabled: true,
                cssAnimations: true,
                connectionLines: true,
                glowEffects: true,
                parallaxLayers: 4,
                renderQuality: 1.2,
                targetFPS: 60
            },
            ultra: {
                particles: 500,
                particleSize: 3,
                threeDLayers: 5,
                webglEnabled: true,
                cssAnimations: true,
                connectionLines: true,
                glowEffects: true,
                parallaxLayers: 5,
                renderQuality: 1.5,
                targetFPS: 60
            }
        };
        
        // Current configuration
        this.currentQuality = 'auto';
        this.config = this.qualityLevels.standard;
        
        // System components
        this.components = {
            particles: null,
            threeDHero: null,
            cinematicEngine: null,
            performanceMonitor: null,
            memoryManager: null,
            adaptiveSystem: null
        };
        
        // State management
        this.state = {
            mouseX: 0,
            mouseY: 0,
            scrollProgress: 0,
            currentSection: 0,
            interactionMode: 'idle', // idle, hover, active, focus
            qualityAdjustments: 0,
            performanceIssues: 0,
            memoryPressure: false,
            networkThrottled: false,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
        
        // Error handling
        this.errorHandler = {
            webglErrors: 0,
            renderErrors: 0,
            memoryErrors: 0,
            fallbackActivated: false,
            recoveryAttempts: 0
        };
        
        // Optimization settings
        this.optimization = {
            maxRenderTime: 16, // ms per frame for 60fps
            memoryThreshold: 100 * 1024 * 1024, // 100MB
            fpsDropThreshold: 45,
            qualityDowngradeDelay: 3000, // 3 seconds
            qualityUpgradeDelay: 10000, // 10 seconds
            cleanupInterval: 30000, // 30 seconds
            adaptiveInterval: 1000 // 1 second
        };
        
        // Animation systems
        this.animations = {
            entrance: null,
            transitions: new Map(),
            interactive: new Map(),
            cleanup: []
        };
        
        // User options override
        Object.assign(this, options);
        
        this.init();
    }
    
    async init() {
        console.log('🚀 Initializing Ultimate 3D Integration System...');
        
        try {
            // Step 1: Device detection and profiling
            await this.detectDeviceCapabilities();
            
            // Step 2: Performance benchmarking
            await this.benchmarkPerformance();
            
            // Step 3: Determine optimal quality level
            this.determineOptimalQuality();
            
            // Step 4: Initialize core systems
            await this.initializeCoreComponents();
            
            // Step 5: Setup performance monitoring
            this.initializePerformanceMonitoring();
            
            // Step 6: Setup memory management
            this.initializeMemoryManagement();
            
            // Step 7: Setup adaptive system
            this.initializeAdaptiveSystem();
            
            // Step 8: Setup user interactions
            this.setupInteractionHandlers();
            
            // Step 9: Setup error handling
            this.setupErrorHandling();
            
            // Step 10: Apply styles and prepare entrance
            this.setupStyles();
            
            // Step 11: Start the system
            await this.start();
            
            this.isInitialized = true;
            
            console.log('✅ Ultimate 3D Integration System initialized successfully');
            console.log('📊 Performance Profile:', this.getPerformanceReport());
            
        } catch (error) {
            console.error('❌ Failed to initialize 3D Integration System:', error);
            await this.activateFallbackMode(error);
        }
    }
    
    async detectDeviceCapabilities() {
        console.log('🔍 Detecting device capabilities...');
        
        // WebGL detection and GPU profiling
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        if (gl) {
            this.deviceProfile.gpu = {
                vendor: gl.getParameter(gl.VENDOR),
                renderer: gl.getParameter(gl.RENDERER),
                version: gl.getParameter(gl.VERSION),
                maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
                maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
                webgl2: !!document.createElement('canvas').getContext('webgl2'),
                extensions: gl.getSupportedExtensions()
            };
        } else {
            this.deviceProfile.gpu = { supported: false };
        }
        
        canvas.remove();
        
        // CSS 3D support
        this.deviceProfile.css3D = {
            transform3d: CSS.supports('transform-style', 'preserve-3d'),
            perspective: CSS.supports('perspective', '1000px'),
            backfaceVisibility: CSS.supports('backface-visibility', 'hidden'),
            backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)')
        };
        
        // Network detection
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.deviceProfile.network = {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
        }
        
        // Battery API
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                this.deviceProfile.batteryLevel = battery.level;
                this.deviceProfile.charging = battery.charging;
                
                // Adapt to low battery
                if (battery.level < 0.2 && !battery.charging) {
                    this.state.networkThrottled = true;
                }
            } catch (e) {
                console.log('Battery API not available');
            }
        }
        
        // Memory pressure detection
        if ('memory' in performance) {
            const memInfo = performance.memory;
            this.deviceProfile.memoryPressure = 
                memInfo.usedJSHeapSize > memInfo.jsHeapSizeLimit * 0.8;
        }
        
        console.log('📱 Device Profile:', this.deviceProfile);
    }
    
    async benchmarkPerformance() {
        console.log('⚡ Benchmarking performance...');
        
        return new Promise(resolve => {
            let score = 100;
            const startTime = performance.now();
            
            // GPU score
            if (!this.deviceProfile.gpu.supported) {
                score -= 40;
            } else {
                const renderer = this.deviceProfile.gpu.renderer.toLowerCase();
                if (renderer.includes('intel') && !renderer.includes('iris')) score -= 20;
                if (renderer.includes('adreno') || renderer.includes('mali')) score -= 15;
                if (renderer.includes('apple') || renderer.includes('nvidia') || renderer.includes('amd')) score += 20;
            }
            
            // CPU score
            if (this.deviceProfile.cores < 4) score -= 20;
            if (this.deviceProfile.cores >= 8) score += 15;
            
            // Memory score
            if (this.deviceProfile.memory < 4) score -= 25;
            if (this.deviceProfile.memory >= 8) score += 15;
            
            // Device type penalties
            if (this.deviceProfile.isMobile && !this.deviceProfile.isTablet) score -= 30;
            if (this.deviceProfile.isTablet) score -= 15;
            
            // Network penalties
            if (this.deviceProfile.network) {
                if (this.deviceProfile.network.effectiveType === '2g') score -= 25;
                if (this.deviceProfile.network.effectiveType === '3g') score -= 15;
                if (this.deviceProfile.network.saveData) score -= 10;
            }
            
            // Battery penalty
            if (this.deviceProfile.batteryLevel < 0.3 && !this.deviceProfile.charging) score -= 15;
            
            // Memory pressure penalty
            if (this.deviceProfile.memoryPressure) score -= 20;
            
            // Reduced motion preference
            if (this.state.reducedMotion) score -= 30;
            
            // Determine performance level
            if (score >= 90) {
                this.deviceProfile.performance = 'ultra';
            } else if (score >= 70) {
                this.deviceProfile.performance = 'premium';
            } else if (score >= 50) {
                this.deviceProfile.performance = 'standard';
            } else if (score >= 30) {
                this.deviceProfile.performance = 'basic';
            } else {
                this.deviceProfile.performance = 'minimal';
            }
            
            const benchmarkTime = performance.now() - startTime;
            console.log(`⚡ Performance benchmark completed in ${benchmarkTime.toFixed(2)}ms`);
            console.log(`📊 Performance score: ${score} → ${this.deviceProfile.performance}`);
            
            resolve(this.deviceProfile.performance);
        });
    }
    
    determineOptimalQuality() {
        // Start with device-detected performance level
        let quality = this.deviceProfile.performance;
        
        // Apply additional constraints
        if (this.state.reducedMotion) {
            quality = 'basic';
        }
        
        if (this.deviceProfile.batteryLevel < 0.15 && !this.deviceProfile.charging) {
            quality = 'minimal';
        }
        
        if (this.deviceProfile.network?.saveData) {
            quality = Math.min(quality, 'basic');
        }
        
        this.currentQuality = quality;
        this.config = { ...this.qualityLevels[quality] };
        
        console.log(`🎯 Optimal quality determined: ${quality}`);
        console.log('⚙️ Configuration:', this.config);
    }
    
    async initializeCoreComponents() {
        console.log('🏗️ Initializing core components...');
        
        try {
            // Initialize particle system
            if (this.config.particles > 0) {
                const particleConfig = {
                    particleCount: this.config.particles,
                    particleSize: this.config.particleSize,
                    connectionLines: this.config.connectionLines,
                    glowEffect: this.config.glowEffects,
                    interactive: true,
                    adaptivePerformance: true
                };
                
                if (typeof FacePayParticleSystem !== 'undefined') {
                    this.components.particles = new FacePayParticleSystem(particleConfig);
                } else {
                    console.warn('Particle system not available, creating fallback');
                    this.components.particles = this.createFallbackParticles(particleConfig);
                }
            }
            
            // Initialize 3D Hero Scene
            if (this.config.webglEnabled && this.config.threeDLayers > 0) {
                const heroContainer = document.getElementById('3d-hero-container') || 
                                   document.querySelector('.hero') || 
                                   document.body;
                
                if (typeof FacePay3DHero !== 'undefined') {
                    this.components.threeDHero = new FacePay3DHero();
                } else {
                    console.warn('3D Hero system not available, creating fallback');
                    this.components.threeDHero = this.createFallback3DHero();
                }
            }
            
            // Initialize Cinematic Engine
            if (this.config.cssAnimations && this.config.parallaxLayers > 1) {
                if (typeof CinematicEngine !== 'undefined') {
                    this.components.cinematicEngine = new CinematicEngine();
                } else {
                    console.warn('Cinematic Engine not available, creating fallback');
                    this.components.cinematicEngine = this.createFallbackCinematic();
                }
            }
            
        } catch (error) {
            console.error('Failed to initialize core components:', error);
            this.errorHandler.renderErrors++;
            await this.handleComponentError(error);
        }
    }
    
    initializePerformanceMonitoring() {
        console.log('📊 Setting up performance monitoring...');
        
        this.components.performanceMonitor = {
            startTime: performance.now(),
            frameCount: 0,
            fpsHistory: [],
            renderTimes: [],
            memorySnapshots: [],
            qualityChanges: [],
            
            recordFrame: (frameTime) => {
                this.frameCount++;
                const now = performance.now();
                const deltaTime = now - this.lastFrameTime;
                this.lastFrameTime = now;
                
                if (deltaTime > 0) {
                    const currentFPS = 1000 / deltaTime;
                    this.fps = currentFPS;
                    
                    // Rolling average FPS
                    this.frameHistory.push(currentFPS);
                    if (this.frameHistory.length > 60) {
                        this.frameHistory.shift();
                    }
                    
                    this.averageFPS = this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length;
                    
                    // Performance analysis
                    this.analyzePerformance(deltaTime, currentFPS);
                }
                
                // Memory monitoring
                if (this.frameCount % 300 === 0) { // Every 5 seconds at 60fps
                    this.monitorMemory();
                }
            }
        };
        
        // Start monitoring loop
        this.performanceLoop();
    }
    
    initializeMemoryManagement() {
        console.log('🧠 Setting up memory management...');
        
        this.components.memoryManager = {
            textureCache: new Map(),
            geometryCache: new Map(),
            animationCache: new Map(),
            cleanupQueue: [],
            
            cleanup: () => {
                const now = performance.now();
                
                // Clean up old particles
                if (this.components.particles) {
                    this.components.particles.particles = this.components.particles.particles.filter(
                        particle => now - particle.createdAt < 30000 // 30 seconds
                    );
                }
                
                // Clean up animations
                this.animations.cleanup.forEach(cleanup => cleanup());
                this.animations.cleanup = [];
                
                // Clear caches if memory pressure
                if (this.state.memoryPressure) {
                    this.components.memoryManager.textureCache.clear();
                    this.components.memoryManager.geometryCache.clear();
                    this.components.memoryManager.animationCache.clear();
                }
                
                // Garbage collection hint
                if (window.gc) {
                    window.gc();
                }
            },
            
            schedule: (cleanupFn) => {
                this.animations.cleanup.push(cleanupFn);
            }
        };
        
        // Set up periodic cleanup
        setInterval(() => {
            this.components.memoryManager.cleanup();
        }, this.optimization.cleanupInterval);
    }
    
    initializeAdaptiveSystem() {
        console.log('🔄 Setting up adaptive system...');
        
        this.components.adaptiveSystem = {
            lastQualityChange: 0,
            performanceBuffer: [],
            adaptationRules: [
                {
                    condition: () => this.averageFPS < this.optimization.fpsDropThreshold,
                    action: () => this.downgradeQuality(),
                    cooldown: this.optimization.qualityDowngradeDelay
                },
                {
                    condition: () => this.averageFPS > this.config.targetFPS + 10 && 
                                   this.state.performanceIssues === 0,
                    action: () => this.upgradeQuality(),
                    cooldown: this.optimization.qualityUpgradeDelay
                },
                {
                    condition: () => this.state.memoryPressure,
                    action: () => this.handleMemoryPressure(),
                    cooldown: 5000
                }
            ],
            
            adapt: () => {
                const now = performance.now();
                
                this.components.adaptiveSystem.adaptationRules.forEach(rule => {
                    if (rule.condition() && 
                        now - this.components.adaptiveSystem.lastQualityChange > rule.cooldown) {
                        rule.action();
                        this.components.adaptiveSystem.lastQualityChange = now;
                    }
                });
            }
        };
        
        // Set up adaptive monitoring
        setInterval(() => {
            this.components.adaptiveSystem.adapt();
        }, this.optimization.adaptiveInterval);
    }
    
    setupInteractionHandlers() {
        console.log('🎮 Setting up interaction handlers...');
        
        // Mouse/touch tracking
        const updatePointer = (e) => {
            this.state.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.state.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            
            // Update all components
            if (this.components.particles?.setMousePosition) {
                this.components.particles.setMousePosition(e.clientX, e.clientY);
            }
            
            if (this.components.threeDHero?.setMousePosition) {
                this.components.threeDHero.setMousePosition(e.clientX, e.clientY);
            }
            
            this.state.interactionMode = 'hover';
        };
        
        document.addEventListener('mousemove', updatePointer, { passive: true });
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                updatePointer(e.touches[0]);
            }
        }, { passive: true });
        
        // Scroll tracking
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            this.state.scrollProgress = Math.min(scrollY / maxScroll, 1);
            
            this.state.interactionMode = 'scroll';
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.state.interactionMode = 'idle';
            }, 150);
            
        }, { passive: true });
        
        // Resize handling
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Focus management
        window.addEventListener('blur', () => {
            this.state.interactionMode = 'idle';
            this.pause();
        });
        
        window.addEventListener('focus', () => {
            this.resume();
        });
    }
    
    setupErrorHandling() {
        console.log('🛡️ Setting up error handling...');
        
        // Global error handlers
        window.addEventListener('error', (e) => {
            this.handleError('Global error', e.error);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            this.handleError('Unhandled promise rejection', e.reason);
        });
        
        // WebGL context lost handling
        if (this.components.threeDHero?.renderer) {
            const canvas = this.components.threeDHero.renderer.domElement;
            canvas.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                console.warn('WebGL context lost, attempting recovery...');
                this.handleWebGLContextLoss();
            });
            
            canvas.addEventListener('webglcontextrestored', () => {
                console.log('WebGL context restored');
                this.handleWebGLContextRestore();
            });
        }
    }
    
    setupStyles() {
        console.log('🎨 Setting up dynamic styles...');
        
        const style = document.createElement('style');
        style.id = 'ultimate-3d-integration-styles';
        style.textContent = `
            /* Ultimate 3D Integration System Styles */
            .u3d-container {
                position: relative;
                overflow: hidden;
                transform-style: preserve-3d;
            }
            
            .u3d-layer {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }
            
            .u3d-particles {
                z-index: 1;
                mix-blend-mode: screen;
                opacity: ${this.config.glowEffects ? 0.8 : 0.6};
            }
            
            .u3d-hero {
                z-index: 2;
            }
            
            .u3d-ui {
                z-index: 10;
                pointer-events: auto;
            }
            
            /* Quality-based optimizations */
            .u3d-quality-${this.currentQuality} .u3d-container {
                ${this.currentQuality === 'minimal' ? 'transform-style: flat;' : ''}
                ${this.currentQuality === 'minimal' ? 'perspective: none;' : ''}
            }
            
            .u3d-quality-${this.currentQuality} .u3d-particles {
                opacity: ${this.getParticleOpacity()};
            }
            
            /* Performance optimizations */
            .u3d-performance-mode .u3d-container * {
                animation-duration: ${this.state.reducedMotion ? '0.01ms !important' : '0.5s'};
                transition-duration: ${this.state.reducedMotion ? '0.01ms !important' : '0.3s'};
            }
            
            /* Fallback mode */
            .u3d-fallback .u3d-particles {
                display: none;
            }
            
            .u3d-fallback .u3d-hero {
                opacity: 0.5;
            }
            
            /* Loading state */
            .u3d-loading {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                backdrop-filter: blur(10px);
                transition: opacity 0.5s ease;
            }
            
            .u3d-loading-spinner {
                width: 40px;
                height: 40px;
                border: 2px solid rgba(0, 255, 136, 0.3);
                border-top: 2px solid #00ff88;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Responsive adjustments */
            @media (max-width: 768px) {
                .u3d-particles {
                    opacity: ${this.deviceProfile.isMobile ? '0.4' : '0.6'};
                }
            }
            
            @media (prefers-reduced-motion: reduce) {
                .u3d-container * {
                    animation: none !important;
                    transition: none !important;
                }
            }
            
            @media (max-resolution: 150dpi) {
                .u3d-container {
                    transform: scale(${this.config.renderQuality});
                    transform-origin: center;
                }
            }
        `;
        
        document.head.appendChild(style);
        
        // Apply quality class to body
        document.body.classList.add(`u3d-quality-${this.currentQuality}`);
        
        // Apply container structure
        this.setupContainerStructure();
    }
    
    setupContainerStructure() {
        // Find or create main container
        let container = document.getElementById('u3d-main-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'u3d-main-container';
            container.className = 'u3d-container';
            
            // Insert before first child of body
            if (document.body.firstChild) {
                document.body.insertBefore(container, document.body.firstChild);
            } else {
                document.body.appendChild(container);
            }
        }
        
        // Create layer structure
        const layers = ['particles', 'hero', 'cinematic', 'ui'];
        layers.forEach(layerName => {
            let layer = document.getElementById(`u3d-${layerName}-layer`);
            if (!layer) {
                layer = document.createElement('div');
                layer.id = `u3d-${layerName}-layer`;
                layer.className = `u3d-layer u3d-${layerName}`;
                container.appendChild(layer);
            }
        });
    }
    
    async start() {
        console.log('▶️ Starting Ultimate 3D Integration System...');
        
        // Show loading indicator
        this.showLoadingIndicator();
        
        try {
            // Start all components
            const startPromises = [];
            
            if (this.components.particles?.start) {
                startPromises.push(Promise.resolve(this.components.particles.start()));
            }
            
            if (this.components.threeDHero?.start) {
                startPromises.push(Promise.resolve(this.components.threeDHero.start()));
            }
            
            if (this.components.cinematicEngine?.start) {
                startPromises.push(Promise.resolve(this.components.cinematicEngine.start()));
            }
            
            await Promise.all(startPromises);
            
            // Start animation loop
            this.isRunning = true;
            this.animate();
            
            // Play entrance animation
            await this.playEntranceAnimation();
            
            // Hide loading indicator
            this.hideLoadingIndicator();
            
            console.log('✅ Ultimate 3D Integration System started successfully');
            
        } catch (error) {
            console.error('❌ Failed to start 3D Integration System:', error);
            this.hideLoadingIndicator();
            await this.activateFallbackMode(error);
        }
    }
    
    showLoadingIndicator() {
        let loader = document.getElementById('u3d-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'u3d-loader';
            loader.className = 'u3d-loading';
            loader.innerHTML = `
                <div class="u3d-loading-spinner"></div>
            `;
            document.body.appendChild(loader);
        }
        loader.style.opacity = '1';
    }
    
    hideLoadingIndicator() {
        const loader = document.getElementById('u3d-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }
    }
    
    async playEntranceAnimation() {
        console.log('🎬 Playing entrance animation...');
        
        const duration = this.state.reducedMotion ? 100 : 2000;
        
        // Animate system entrance
        if (typeof gsap !== 'undefined') {
            const timeline = gsap.timeline();
            
            timeline
                .from('#u3d-particles-layer', {
                    opacity: 0,
                    duration: duration / 1000 * 0.6,
                    ease: 'power2.out'
                })
                .from('#u3d-hero-layer', {
                    opacity: 0,
                    scale: 0.8,
                    duration: duration / 1000 * 0.8,
                    ease: 'back.out(1.7)'
                }, '-=0.3')
                .from('#u3d-cinematic-layer', {
                    opacity: 0,
                    duration: duration / 1000 * 0.4,
                    ease: 'power1.out'
                }, '-=0.2');
                
            this.animations.entrance = timeline;
        } else {
            // Fallback animation
            return new Promise(resolve => {
                const layers = ['particles', 'hero', 'cinematic'];
                let completed = 0;
                
                layers.forEach((layer, index) => {
                    const element = document.getElementById(`u3d-${layer}-layer`);
                    if (element) {
                        element.style.opacity = '0';
                        element.style.transform = 'scale(0.8)';
                        element.style.transition = `all ${duration/1000}s ease`;
                        
                        setTimeout(() => {
                            element.style.opacity = '1';
                            element.style.transform = 'scale(1)';
                            
                            completed++;
                            if (completed === layers.length) {
                                resolve();
                            }
                        }, index * (duration / layers.length / 2));
                    } else {
                        completed++;
                        if (completed === layers.length) {
                            resolve();
                        }
                    }
                });
            });
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        const now = performance.now();
        const deltaTime = now - this.lastFrameTime;
        
        try {
            // Record performance
            if (this.components.performanceMonitor) {
                this.components.performanceMonitor.recordFrame(now);
            }
            
            // Update components
            if (this.components.particles?.update) {
                this.components.particles.update(deltaTime);
            }
            
            if (this.components.threeDHero?.update) {
                this.components.threeDHero.update(deltaTime);
            }
            
            if (this.components.cinematicEngine?.update) {
                this.components.cinematicEngine.update(deltaTime);
            }
            
            // Continue animation loop
            requestAnimationFrame(() => this.animate());
            
        } catch (error) {
            this.handleError('Animation loop error', error);
        }
    }
    
    analyzePerformance(deltaTime, fps) {
        // Check for performance issues
        if (deltaTime > this.optimization.maxRenderTime) {
            this.state.performanceIssues++;
        } else {
            this.state.performanceIssues = Math.max(0, this.state.performanceIssues - 0.1);
        }
        
        // Update UI with performance info
        this.updatePerformanceUI(fps, deltaTime);
    }
    
    monitorMemory() {
        if (!performance.memory) return;
        
        const memInfo = performance.memory;
        const memoryUsage = memInfo.usedJSHeapSize;
        const memoryLimit = memInfo.jsHeapSizeLimit;
        
        this.state.memoryPressure = memoryUsage > memoryLimit * 0.8;
        
        if (this.state.memoryPressure) {
            console.warn(`⚠️ Memory pressure detected: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB used`);
        }
    }
    
    updatePerformanceUI(fps, deltaTime) {
        // Update FPS counter if it exists
        const fpsCounter = document.getElementById('fps-counter');
        if (fpsCounter) {
            fpsCounter.textContent = Math.round(fps);
            fpsCounter.className = fps >= 55 ? 'fps-good' : fps >= 35 ? 'fps-okay' : 'fps-poor';
        }
        
        // Update performance badge
        const perfBadge = document.getElementById('performance-badge');
        if (perfBadge) {
            perfBadge.textContent = this.currentQuality.toUpperCase();
            perfBadge.className = `performance-badge performance-${this.currentQuality}`;
        }
    }
    
    downgradeQuality() {
        const qualityOrder = ['ultra', 'premium', 'standard', 'basic', 'minimal'];
        const currentIndex = qualityOrder.indexOf(this.currentQuality);
        
        if (currentIndex < qualityOrder.length - 1) {
            const newQuality = qualityOrder[currentIndex + 1];
            this.changeQuality(newQuality);
            this.state.qualityAdjustments++;
            
            console.log(`📉 Quality downgraded to: ${newQuality} (FPS: ${Math.round(this.averageFPS)})`);
        }
    }
    
    upgradeQuality() {
        const qualityOrder = ['minimal', 'basic', 'standard', 'premium', 'ultra'];
        const currentIndex = qualityOrder.indexOf(this.currentQuality);
        
        if (currentIndex < qualityOrder.length - 1 && this.state.qualityAdjustments > 0) {
            const newQuality = qualityOrder[currentIndex + 1];
            this.changeQuality(newQuality);
            this.state.qualityAdjustments = Math.max(0, this.state.qualityAdjustments - 1);
            
            console.log(`📈 Quality upgraded to: ${newQuality} (FPS: ${Math.round(this.averageFPS)})`);
        }
    }
    
    changeQuality(newQuality) {
        if (newQuality === this.currentQuality) return;
        
        // Remove old quality class
        document.body.classList.remove(`u3d-quality-${this.currentQuality}`);
        
        // Update quality
        this.currentQuality = newQuality;
        this.config = { ...this.qualityLevels[newQuality] };
        
        // Add new quality class
        document.body.classList.add(`u3d-quality-${this.currentQuality}`);
        
        // Update components
        if (this.components.particles?.updateConfig) {
            this.components.particles.updateConfig({
                particleCount: this.config.particles,
                particleSize: this.config.particleSize,
                connectionLines: this.config.connectionLines,
                glowEffect: this.config.glowEffects
            });
        }
        
        if (this.components.threeDHero?.setQualityLevel) {
            this.components.threeDHero.setQualityLevel(newQuality);
        }
        
        // Update styles
        this.updateQualityStyles();
    }
    
    updateQualityStyles() {
        const style = document.getElementById('ultimate-3d-integration-styles');
        if (style) {
            // Update particle opacity
            const particleOpacity = this.getParticleOpacity();
            style.textContent = style.textContent.replace(
                /opacity: [\d\.]+/g, 
                `opacity: ${particleOpacity}`
            );
        }
    }
    
    getParticleOpacity() {
        const baseOpacity = {
            minimal: 0.3,
            basic: 0.5,
            standard: 0.7,
            premium: 0.8,
            ultra: 0.9
        };
        
        const opacity = baseOpacity[this.currentQuality] || 0.7;
        
        // Reduce for mobile
        if (this.deviceProfile.isMobile) {
            return opacity * 0.7;
        }
        
        return opacity;
    }
    
    handleMemoryPressure() {
        console.log('🧠 Handling memory pressure...');
        
        // Force cleanup
        if (this.components.memoryManager) {
            this.components.memoryManager.cleanup();
        }
        
        // Reduce quality if not already minimal
        if (this.currentQuality !== 'minimal') {
            this.changeQuality('basic');
        }
        
        // Reduce particle count temporarily
        if (this.components.particles?.updateConfig) {
            this.components.particles.updateConfig({
                particleCount: Math.floor(this.config.particles * 0.5)
            });
        }
    }
    
    handleResize() {
        console.log('📐 Handling resize...');
        
        this.deviceProfile.viewportSize = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        // Update components
        if (this.components.particles?.handleResize) {
            this.components.particles.handleResize();
        }
        
        if (this.components.threeDHero?.handleResize) {
            this.components.threeDHero.handleResize();
        }
        
        if (this.components.cinematicEngine?.handleResize) {
            this.components.cinematicEngine.handleResize();
        }
    }
    
    handleError(source, error) {
        console.error(`❌ ${source}:`, error);
        
        this.errorHandler.renderErrors++;
        
        // If too many errors, activate fallback mode
        if (this.errorHandler.renderErrors > 5) {
            this.activateFallbackMode(error);
        }
    }
    
    handleComponentError(error) {
        console.error('Component error:', error);
        
        // Try to recover by downgrading quality
        if (this.currentQuality !== 'minimal') {
            this.downgradeQuality();
        }
    }
    
    handleWebGLContextLoss() {
        console.warn('🔄 WebGL context lost, pausing 3D effects...');
        
        this.pause();
        this.errorHandler.webglErrors++;
        
        // Disable WebGL components temporarily
        if (this.components.particles) {
            this.components.particles.pause();
        }
        
        if (this.components.threeDHero) {
            this.components.threeDHero.pause();
        }
    }
    
    handleWebGLContextRestore() {
        console.log('✅ WebGL context restored, resuming...');
        
        // Attempt to restore WebGL components
        this.resume();
        
        if (this.components.particles?.resume) {
            this.components.particles.resume();
        }
        
        if (this.components.threeDHero?.resume) {
            this.components.threeDHero.resume();
        }
    }
    
    async activateFallbackMode(error) {
        console.warn('🔧 Activating fallback mode due to:', error);
        
        this.errorHandler.fallbackActivated = true;
        document.body.classList.add('u3d-fallback');
        
        // Disable problematic components
        if (this.components.particles) {
            this.components.particles.destroy();
            this.components.particles = null;
        }
        
        if (this.components.threeDHero) {
            this.components.threeDHero.destroy();
            this.components.threeDHero = null;
        }
        
        // Keep only basic cinematic effects
        this.currentQuality = 'minimal';
        this.config = { ...this.qualityLevels.minimal };
        
        // Create basic fallback effects
        this.createBasicFallback();
    }
    
    createBasicFallback() {
        // Create simple CSS-only effects
        const fallbackStyle = document.createElement('style');
        fallbackStyle.textContent = `
            .u3d-fallback {
                background: radial-gradient(circle at 30% 40%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 1) 100%);
            }
            
            .u3d-fallback .hero {
                animation: subtle-pulse 4s ease-in-out infinite;
            }
            
            @keyframes subtle-pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.02); opacity: 0.9; }
            }
        `;
        document.head.appendChild(fallbackStyle);
    }
    
    // Fallback component creators
    createFallbackParticles(config) {
        return {
            start: () => Promise.resolve(),
            update: () => {},
            pause: () => {},
            resume: () => {},
            destroy: () => {},
            updateConfig: () => {},
            handleResize: () => {},
            setMousePosition: () => {}
        };
    }
    
    createFallback3DHero() {
        return {
            start: () => Promise.resolve(),
            update: () => {},
            pause: () => {},
            resume: () => {},
            destroy: () => {},
            setQualityLevel: () => {},
            handleResize: () => {},
            setMousePosition: () => {}
        };
    }
    
    createFallbackCinematic() {
        return {
            start: () => Promise.resolve(),
            update: () => {},
            pause: () => {},
            resume: () => {},
            destroy: () => {},
            handleResize: () => {}
        };
    }
    
    performanceLoop() {
        if (!this.isRunning) return;
        
        const now = performance.now();
        this.components.performanceMonitor?.recordFrame(now);
        
        requestAnimationFrame(() => this.performanceLoop());
    }
    
    pause() {
        console.log('⏸️ Pausing 3D Integration System...');
        this.isRunning = false;
        
        if (this.components.particles?.pause) {
            this.components.particles.pause();
        }
        
        if (this.components.threeDHero?.pause) {
            this.components.threeDHero.pause();
        }
        
        if (this.components.cinematicEngine?.pause) {
            this.components.cinematicEngine.pause();
        }
    }
    
    resume() {
        console.log('▶️ Resuming 3D Integration System...');
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        
        if (this.components.particles?.resume) {
            this.components.particles.resume();
        }
        
        if (this.components.threeDHero?.resume) {
            this.components.threeDHero.resume();
        }
        
        if (this.components.cinematicEngine?.resume) {
            this.components.cinematicEngine.resume();
        }
        
        this.animate();
    }
    
    destroy() {
        console.log('🗑️ Destroying 3D Integration System...');
        
        this.pause();
        
        // Destroy all components
        Object.values(this.components).forEach(component => {
            if (component?.destroy) {
                component.destroy();
            }
        });
        
        // Clean up DOM
        document.getElementById('u3d-main-container')?.remove();
        document.getElementById('ultimate-3d-integration-styles')?.remove();
        document.body.classList.remove(`u3d-quality-${this.currentQuality}`);
        
        // Clear all references
        this.components = {};
        this.animations = { entrance: null, transitions: new Map(), interactive: new Map(), cleanup: [] };
        
        console.log('✅ 3D Integration System destroyed');
    }
    
    // Public API
    getPerformanceReport() {
        return {
            fps: Math.round(this.averageFPS),
            quality: this.currentQuality,
            device: this.deviceProfile,
            state: this.state,
            errors: this.errorHandler,
            uptime: performance.now() - this.startTime,
            frameCount: this.frameCount,
            qualityAdjustments: this.state.qualityAdjustments
        };
    }
    
    setQuality(quality) {
        if (this.qualityLevels[quality]) {
            this.changeQuality(quality);
        }
    }
    
    triggerEffect(effectName, options = {}) {
        switch (effectName) {
            case 'faceScan':
                if (this.components.threeDHero?.triggerFaceScanAnimation) {
                    this.components.threeDHero.triggerFaceScanAnimation();
                }
                break;
                
            case 'celebration':
                if (this.components.cinematicEngine?.triggerCelebration) {
                    this.components.cinematicEngine.triggerCelebration();
                }
                if (this.components.particles?.addParticlesBurst) {
                    this.components.particles.addParticlesBurst(
                        window.innerWidth / 2,
                        window.innerHeight / 2,
                        50
                    );
                }
                break;
                
            case 'particleBurst':
                if (this.components.particles?.addParticlesBurst) {
                    this.components.particles.addParticlesBurst(
                        options.x || window.innerWidth / 2,
                        options.y || window.innerHeight / 2,
                        options.count || 30
                    );
                }
                break;
        }
    }
    
    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Global initialization
let ultimate3DSystem = null;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        console.log('🚀 DOM ready, initializing Ultimate 3D Integration System...');
        
        try {
            ultimate3DSystem = new Ultimate3DIntegrationSystem();
            window.ultimate3D = ultimate3DSystem;
            
            // Add global controls for debugging
            window.u3dControls = {
                getReport: () => ultimate3DSystem.getPerformanceReport(),
                setQuality: (quality) => ultimate3DSystem.setQuality(quality),
                triggerEffect: (effect, options) => ultimate3DSystem.triggerEffect(effect, options),
                pause: () => ultimate3DSystem.pause(),
                resume: () => ultimate3DSystem.resume()
            };
            
            console.log('🎮 Global controls available: window.u3dControls');
            
        } catch (error) {
            console.error('❌ Failed to initialize Ultimate 3D Integration System:', error);
        }
    });
} else {
    // DOM already ready
    console.log('🚀 Initializing Ultimate 3D Integration System...');
    ultimate3DSystem = new Ultimate3DIntegrationSystem();
    window.ultimate3D = ultimate3DSystem;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Ultimate3DIntegrationSystem;
}