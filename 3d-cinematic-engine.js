/**
 * FacePay 3D Cinematic Engine - Phase 2 WOW Factors
 * Creates immersive 3D depth effects and cinematic experiences
 */

class CinematicEngine {
    constructor() {
        this.isInitialized = false;
        this.performanceLevel = this.detectPerformance();
        this.deviceCapabilities = this.detectDeviceCapabilities();
        this.motionEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // 3D system state
        this.mouseX = 0;
        this.mouseY = 0;
        this.scrollProgress = 0;
        this.currentScene = 0;
        this.scenes = [];
        
        // Learning system
        this.behaviorData = {
            sectionTimeSpent: new Map(),
            interactionPatterns: [],
            devicePreferences: new Map(),
            performanceHistory: []
        };
        
        this.init();
    }
    
    detectPerformance() {
        const cores = navigator.hardwareConcurrency || 4;
        const memory = navigator.deviceMemory || 4;
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        let score = cores * 25 + memory * 25;
        if (gl) {
            const renderer = gl.getParameter(gl.RENDERER) || '';
            // GPU capability detection
            if (renderer.includes('GeForce') || renderer.includes('Radeon') || 
                renderer.includes('Iris') || renderer.includes('UHD')) score += 100;
            if (renderer.includes('A15') || renderer.includes('A16') || 
                renderer.includes('A17') || renderer.includes('M1') || 
                renderer.includes('M2')) score += 150;
        }
        
        if (score >= 400) return 'ultra';
        if (score >= 300) return 'high'; 
        if (score >= 200) return 'medium';
        return 'basic';
    }
    
    detectDeviceCapabilities() {
        return {
            hasGPU: !!document.createElement('canvas').getContext('webgl2'),
            supportsBackdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
            supportsTransform3d: CSS.supports('transform-style', 'preserve-3d'),
            hasHaptics: 'vibrate' in navigator,
            hasPointer: window.PointerEvent !== undefined,
            screenDensity: window.devicePixelRatio || 1,
            isTouchDevice: 'ontouchstart' in window,
            viewportSize: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }
    
    init() {
        console.log('🎬 Initializing Cinematic Engine...', {
            performance: this.performanceLevel,
            capabilities: this.deviceCapabilities,
            motionEnabled: this.motionEnabled
        });
        
        this.setupCinematicCSS();
        this.initializeScenes();
        this.setupMouseTracking();
        this.setupScrollCinematography();
        this.initializeSmartDetection();
        this.setupProgressiveEnhancement();
        this.initializeBehaviorLearning();
        this.setupContextualHelp();
        this.initializePerformanceLearning();
        
        this.isInitialized = true;
        console.log('✨ Cinematic Engine ready!');
    }
    
    setupCinematicCSS() {
        const cinematicStyles = document.createElement('style');
        cinematicStyles.id = 'cinematic-engine-styles';
        cinematicStyles.textContent = `
            /* 3D Depth System */
            .cinematic-3d {
                transform-style: preserve-3d;
                perspective: 1000px;
                will-change: transform;
            }
            
            .depth-layer-1 { transform: translateZ(0px); }
            .depth-layer-2 { transform: translateZ(-20px); }
            .depth-layer-3 { transform: translateZ(-40px); }
            .depth-layer-4 { transform: translateZ(-60px); }
            .depth-layer-5 { transform: translateZ(-80px); }
            
            /* Hero 3D Enhancement */
            .hero-3d {
                transform-style: preserve-3d;
                perspective: 1200px;
                perspective-origin: 50% 50%;
            }
            
            .hero-content-3d {
                transform-style: preserve-3d;
                will-change: transform;
                transition: transform 0.1s ease-out;
            }
            
            .hero-bg-layer {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                will-change: transform;
            }
            
            .hero-bg-layer-1 { 
                transform: translateZ(-100px) scale(1.1);
                opacity: 0.8;
            }
            .hero-bg-layer-2 { 
                transform: translateZ(-200px) scale(1.2);
                opacity: 0.6;
            }
            .hero-bg-layer-3 { 
                transform: translateZ(-300px) scale(1.3);
                opacity: 0.4;
            }
            
            /* Face Scanner 3D Enhancement */
            .face-scanner-3d {
                transform-style: preserve-3d;
                perspective: 800px;
                will-change: transform;
            }
            
            .scanner-frame-3d {
                transform-style: preserve-3d;
                will-change: transform;
                transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .scanner-frame-3d.depth-active {
                transform: rotateX(5deg) rotateY(5deg) translateZ(20px);
                box-shadow: 
                    0 10px 40px rgba(0, 255, 136, 0.3),
                    0 0 80px rgba(0, 255, 136, 0.2);
            }
            
            /* Multi-Layer Parallax */
            .parallax-container {
                position: relative;
                transform-style: preserve-3d;
                overflow: hidden;
            }
            
            .parallax-layer {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                will-change: transform;
            }
            
            .parallax-far { transform: translateZ(-500px) scale(1.5); }
            .parallax-mid { transform: translateZ(-250px) scale(1.25); }
            .parallax-near { transform: translateZ(-100px) scale(1.1); }
            .parallax-front { transform: translateZ(0px); }
            
            /* Cinematic Section Transitions */
            .section-cinematic {
                position: relative;
                overflow: hidden;
                transform-style: preserve-3d;
            }
            
            .section-enter {
                animation: sectionEnter 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
            }
            
            .section-exit {
                animation: sectionExit 0.8s cubic-bezier(0.55, 0, 0.1, 1) forwards;
            }
            
            @keyframes sectionEnter {
                0% {
                    opacity: 0;
                    transform: translateZ(-200px) rotateX(15deg);
                    filter: blur(10px);
                }
                50% {
                    opacity: 0.7;
                    transform: translateZ(-50px) rotateX(5deg);
                    filter: blur(2px);
                }
                100% {
                    opacity: 1;
                    transform: translateZ(0px) rotateX(0deg);
                    filter: blur(0px);
                }
            }
            
            @keyframes sectionExit {
                0% {
                    opacity: 1;
                    transform: translateZ(0px) rotateX(0deg);
                }
                100% {
                    opacity: 0;
                    transform: translateZ(-100px) rotateX(-10deg);
                }
            }
            
            /* Enhanced Particle System */
            .particle-3d {
                transform-style: preserve-3d;
                will-change: transform, opacity;
                position: absolute;
                pointer-events: none;
            }
            
            .particle-success-burst {
                animation: successBurst 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
            
            @keyframes successBurst {
                0% {
                    transform: translateZ(0px) scale(0);
                    opacity: 1;
                }
                20% {
                    transform: translateZ(50px) scale(1.2);
                    opacity: 1;
                }
                40% {
                    transform: translateZ(100px) scale(1);
                    opacity: 0.8;
                }
                100% {
                    transform: translateZ(200px) scale(0.5);
                    opacity: 0;
                }
            }
            
            /* Physics-Based Button Magnetism */
            .btn-magnetic {
                position: relative;
                transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .btn-magnetic::before {
                content: '';
                position: absolute;
                inset: -20px;
                border-radius: inherit;
                background: radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, transparent 70%);
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }
            
            .btn-magnetic:hover::before {
                opacity: 1;
            }
            
            .btn-magnetic.magnetized {
                transform: translateZ(10px) scale(1.05);
                box-shadow: 
                    0 10px 40px rgba(0, 255, 136, 0.4),
                    0 0 60px rgba(0, 255, 136, 0.2);
            }
            
            /* Scroll-Triggered Reveals */
            .reveal-element {
                opacity: 0;
                transform: translateY(30px) rotateX(15deg);
                transition: all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
            }
            
            .reveal-element.revealed {
                opacity: 1;
                transform: translateY(0px) rotateX(0deg);
            }
            
            .reveal-cascade .reveal-element:nth-child(1) { transition-delay: 0ms; }
            .reveal-cascade .reveal-element:nth-child(2) { transition-delay: 100ms; }
            .reveal-cascade .reveal-element:nth-child(3) { transition-delay: 200ms; }
            .reveal-cascade .reveal-element:nth-child(4) { transition-delay: 300ms; }
            .reveal-cascade .reveal-element:nth-child(5) { transition-delay: 400ms; }
            
            /* Contextual Help System */
            .help-tooltip {
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 12px 16px;
                border-radius: 12px;
                font-size: 14px;
                max-width: 200px;
                z-index: 1000;
                transform: translateZ(50px);
                opacity: 0;
                pointer-events: none;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 255, 136, 0.3);
            }
            
            .help-tooltip::before {
                content: '';
                position: absolute;
                bottom: -6px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 6px solid rgba(0, 0, 0, 0.9);
            }
            
            .help-tooltip.visible {
                opacity: 1;
                transform: translateZ(50px) translateY(-10px);
            }
            
            /* Performance-Based Optimizations */
            .perf-basic .cinematic-3d,
            .perf-basic .hero-3d,
            .perf-basic .parallax-container {
                transform-style: flat;
                perspective: none;
            }
            
            .perf-basic .depth-layer-1,
            .perf-basic .depth-layer-2,
            .perf-basic .depth-layer-3,
            .perf-basic .depth-layer-4,
            .perf-basic .depth-layer-5 {
                transform: none;
            }
            
            /* Reduced Motion Preferences */
            @media (prefers-reduced-motion: reduce) {
                .cinematic-3d,
                .hero-3d,
                .parallax-container {
                    transform-style: flat;
                    perspective: none;
                }
                
                .hero-content-3d,
                .scanner-frame-3d,
                .parallax-layer {
                    transform: none !important;
                    transition: none !important;
                }
                
                .section-enter,
                .section-exit,
                .reveal-element {
                    animation: none !important;
                    transition: opacity 0.2s ease !important;
                }
            }
        `;
        document.head.appendChild(cinematicStyles);
    }
    
    initializeScenes() {
        this.scenes = [
            {
                id: 'hero',
                element: document.querySelector('.hero'),
                effects: ['3d-depth', 'mouse-parallax', 'particle-ambient'],
                transitionStyle: 'cinematic-zoom'
            },
            {
                id: 'features',
                element: document.querySelector('.features'),
                effects: ['reveal-cascade', 'depth-layers'],
                transitionStyle: 'slide-depth'
            },
            {
                id: 'demo',
                element: document.querySelector('.demo'),
                effects: ['video-3d', 'interactive-zoom'],
                transitionStyle: 'focus-pull'
            },
            {
                id: 'cta',
                element: document.querySelector('.cta-section'),
                effects: ['magnetic-field', 'urgency-pulse'],
                transitionStyle: 'converge'
            }
        ];
        
        // Apply scene enhancements
        this.scenes.forEach(scene => {
            if (scene.element) {
                scene.element.classList.add('section-cinematic');
                this.applySceneEffects(scene);
            }
        });
    }
    
    applySceneEffects(scene) {
        const element = scene.element;
        
        if (scene.effects.includes('3d-depth')) {
            element.classList.add('cinematic-3d');
            this.create3DDepthLayers(element);
        }
        
        if (scene.effects.includes('reveal-cascade')) {
            element.classList.add('reveal-cascade');
            this.setupRevealElements(element);
        }
        
        if (scene.effects.includes('magnetic-field')) {
            this.setupMagneticField(element);
        }
    }
    
    create3DDepthLayers(container) {
        // Create background depth layers
        const layerContainer = document.createElement('div');
        layerContainer.className = 'parallax-container';
        
        for (let i = 1; i <= 3; i++) {
            const layer = document.createElement('div');
            layer.className = `hero-bg-layer hero-bg-layer-${i} parallax-layer`;
            layer.style.background = `radial-gradient(circle at ${30 + i * 20}% ${40 + i * 15}%, rgba(${i === 1 ? '0, 255, 136' : i === 2 ? '59, 130, 246' : '99, 102, 241'}, ${0.1 / i}) 0%, transparent 60%)`;
            layerContainer.appendChild(layer);
        }
        
        container.insertBefore(layerContainer, container.firstChild);
    }
    
    setupMouseTracking() {
        if (this.deviceCapabilities.isTouchDevice) return; // Skip on touch devices
        
        let ticking = false;
        
        const updateMousePosition = (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
                    this.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
                    this.updateMouseParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        document.addEventListener('mousemove', updateMousePosition, { passive: true });
    }
    
    updateMouseParallax() {
        if (this.performanceLevel === 'basic') return;
        
        // Hero 3D effect
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const rotateX = this.mouseY * 5;
            const rotateY = -this.mouseX * 5;
            const translateZ = Math.abs(this.mouseX * this.mouseY) * 10;
            
            heroContent.style.transform = `
                perspective(1200px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(${translateZ}px)
            `;
        }
        
        // Face scanner 3D response
        const faceScanner = document.querySelector('.face-scanner-hero');
        if (faceScanner) {
            const distance = Math.sqrt(this.mouseX * this.mouseX + this.mouseY * this.mouseY);
            if (distance < 0.3) { // Mouse near scanner
                faceScanner.classList.add('scanner-frame-3d', 'depth-active');
                const rotateY = this.mouseX * 10;
                const rotateX = -this.mouseY * 10;
                faceScanner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            } else {
                faceScanner.classList.remove('depth-active');
                faceScanner.style.transform = '';
            }
        }
    }
    
    setupScrollCinematography() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
                    this.updateParallaxLayers();
                    this.checkSectionTransitions();
                    this.updateRevealElements();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', updateScrollEffects, { passive: true });
    }
    
    updateParallaxLayers() {
        if (this.performanceLevel === 'basic') return;
        
        const parallaxElements = document.querySelectorAll('.parallax-layer');
        parallaxElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(window.scrollY * speed);
            element.style.transform = element.style.transform.replace(
                /translateY\([^)]*\)/,
                `translateY(${yPos}px)`
            ) || `translateY(${yPos}px)`;
        });
    }
    
    checkSectionTransitions() {
        const viewportCenter = window.innerHeight / 2;
        
        this.scenes.forEach((scene, index) => {
            if (!scene.element) return;
            
            const rect = scene.element.getBoundingClientRect();
            const isInView = rect.top < viewportCenter && rect.bottom > viewportCenter;
            
            if (isInView && this.currentScene !== index) {
                this.triggerSceneTransition(this.currentScene, index);
                this.currentScene = index;
                this.trackSectionTime(scene.id);
            }
        });
    }
    
    triggerSceneTransition(fromIndex, toIndex) {
        const fromScene = this.scenes[fromIndex];
        const toScene = this.scenes[toIndex];
        
        if (fromScene && fromScene.element) {
            fromScene.element.classList.add('section-exit');
            setTimeout(() => {
                fromScene.element.classList.remove('section-exit');
            }, 800);
        }
        
        if (toScene && toScene.element) {
            toScene.element.classList.add('section-enter');
            setTimeout(() => {
                toScene.element.classList.remove('section-enter');
            }, 1200);
        }
        
        // Trigger particle effects for transition
        this.createTransitionParticles(toScene);
    }
    
    createTransitionParticles(scene) {
        if (this.performanceLevel === 'basic') return;
        
        const rect = scene.element.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createParticle3D(
                    centerX + (Math.random() - 0.5) * 200,
                    centerY + (Math.random() - 0.5) * 100,
                    ['✨', '⚡', '💫', '🌟'][Math.floor(Math.random() * 4)]
                );
            }, i * 50);
        }
    }
    
    createParticle3D(x, y, symbol) {
        const particle = document.createElement('div');
        particle.className = 'particle-3d';
        particle.textContent = symbol;
        particle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            font-size: ${12 + Math.random() * 8}px;
            color: rgba(0, 255, 136, 0.8);
            animation: particle3DFloat ${2 + Math.random() * 2}s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        // Create animation for this particle
        const animationName = `particle3DFloat${Date.now()}${Math.random()}`;
        const keyframes = `
            @keyframes ${animationName} {
                0% {
                    transform: translateZ(0px) rotateY(0deg);
                    opacity: 1;
                }
                50% {
                    transform: translateZ(${50 + Math.random() * 100}px) rotateY(180deg);
                    opacity: 0.8;
                }
                100% {
                    transform: translateZ(${200 + Math.random() * 200}px) rotateY(360deg);
                    opacity: 0;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
        particle.style.animation = `${animationName} ${2 + Math.random() * 2}s ease-out forwards`;
        
        setTimeout(() => {
            particle.remove();
            style.remove();
        }, 4000);
    }
    
    setupRevealElements(container) {
        const elements = container.querySelectorAll('.feature, .step, .trust-item');
        elements.forEach(el => el.classList.add('reveal-element'));
    }
    
    updateRevealElements() {
        const revealElements = document.querySelectorAll('.reveal-element:not(.revealed)');
        
        revealElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const triggerPoint = window.innerHeight * 0.8;
            
            if (rect.top < triggerPoint) {
                setTimeout(() => {
                    element.classList.add('revealed');
                }, index * 100);
            }
        });
    }
    
    setupMagneticField(container) {
        const buttons = container.querySelectorAll('.btn');
        
        buttons.forEach(btn => {
            btn.classList.add('btn-magnetic');
            
            if (!this.deviceCapabilities.isTouchDevice) {
                btn.addEventListener('mouseenter', () => {
                    this.createMagneticField(btn);
                });
                
                btn.addEventListener('mouseleave', () => {
                    this.removeMagneticField(btn);
                });
                
                btn.addEventListener('mousemove', (e) => {
                    this.updateMagneticAttraction(btn, e);
                });
            }
        });
    }
    
    createMagneticField(button) {
        if (this.performanceLevel === 'basic') return;
        
        button.classList.add('magnetized');
        
        // Create magnetic field particles
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const rect = button.getBoundingClientRect();
                const particle = this.createMagneticParticle(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2
                );
                this.animateMagneticParticle(particle, button);
            }, i * 30);
        }
    }
    
    createMagneticParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'magnetic-particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(0, 255, 136, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${x + (Math.random() - 0.5) * 200}px;
            top: ${y + (Math.random() - 0.5) * 200}px;
            transform: translateZ(0px);
        `;
        document.body.appendChild(particle);
        return particle;
    }
    
    animateMagneticParticle(particle, button) {
        const rect = button.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;
        
        let startTime = null;
        const duration = 1000;
        
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            const currentX = parseFloat(particle.style.left);
            const currentY = parseFloat(particle.style.top);
            
            const newX = currentX + (targetX - currentX) * progress * 0.1;
            const newY = currentY + (targetY - currentY) * progress * 0.1;
            
            particle.style.left = newX + 'px';
            particle.style.top = newY + 'px';
            particle.style.opacity = 1 - progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    removeMagneticField(button) {
        button.classList.remove('magnetized');
        
        // Remove any remaining magnetic particles
        document.querySelectorAll('.magnetic-particle').forEach(particle => {
            particle.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => particle.remove(), 300);
        });
    }
    
    updateMagneticAttraction(button, event) {
        if (this.performanceLevel === 'basic') return;
        
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = event.clientX - centerX;
        const deltaY = event.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < 100) {
            const strength = (100 - distance) / 100 * 0.3;
            button.style.transform = `translateZ(10px) scale(${1 + strength * 0.1}) translate(${deltaX * strength * 0.2}px, ${deltaY * strength * 0.2}px)`;
        }
    }
    
    initializeSmartDetection() {
        // Device capability detection
        this.deviceProfile = {
            performance: this.performanceLevel,
            screenSize: this.deviceCapabilities.viewportSize,
            inputMethod: this.deviceCapabilities.isTouchDevice ? 'touch' : 'mouse',
            gpu: this.deviceCapabilities.hasGPU,
            connectivity: this.detectNetworkSpeed(),
            battery: null
        };
        
        // Detect network speed
        if ('connection' in navigator) {
            this.deviceProfile.connectivity = {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        
        // Battery API
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.deviceProfile.battery = {
                    level: battery.level,
                    charging: battery.charging
                };
                this.adaptToBatteryLevel(battery.level);
            });
        }
        
        // Adapt experience based on detection
        this.adaptExperience();
    }
    
    detectNetworkSpeed() {
        const startTime = Date.now();
        const image = new Image();
        image.onload = () => {
            const loadTime = Date.now() - startTime;
            const speed = loadTime < 500 ? 'fast' : loadTime < 1500 ? 'medium' : 'slow';
            this.adaptToNetworkSpeed(speed);
        };
        image.src = '/facepay-demo-poster.jpg?' + Math.random(); // Cache bust
        
        return 'unknown';
    }
    
    adaptExperience() {
        const body = document.body;
        
        // Performance-based adaptations
        if (this.performanceLevel === 'ultra') {
            body.classList.add('experience-ultra');
            this.enableAllEffects();
        } else if (this.performanceLevel === 'high') {
            body.classList.add('experience-high');
            this.enableMostEffects();
        } else if (this.performanceLevel === 'medium') {
            body.classList.add('experience-medium');
            this.enableEssentialEffects();
        } else {
            body.classList.add('experience-basic');
            this.enableMinimalEffects();
        }
        
        // Input method adaptations
        if (this.deviceCapabilities.isTouchDevice) {
            this.optimizeForTouch();
        } else {
            this.optimizeForMouse();
        }
    }
    
    enableAllEffects() {
        document.documentElement.style.setProperty('--particle-count', '50');
        document.documentElement.style.setProperty('--animation-quality', 'high');
        document.documentElement.style.setProperty('--parallax-layers', '5');
    }
    
    enableMostEffects() {
        document.documentElement.style.setProperty('--particle-count', '30');
        document.documentElement.style.setProperty('--animation-quality', 'medium');
        document.documentElement.style.setProperty('--parallax-layers', '3');
    }
    
    enableEssentialEffects() {
        document.documentElement.style.setProperty('--particle-count', '15');
        document.documentElement.style.setProperty('--animation-quality', 'low');
        document.documentElement.style.setProperty('--parallax-layers', '2');
    }
    
    enableMinimalEffects() {
        document.documentElement.style.setProperty('--particle-count', '5');
        document.documentElement.style.setProperty('--animation-quality', 'minimal');
        document.documentElement.style.setProperty('--parallax-layers', '1');
    }
    
    setupProgressiveEnhancement() {
        // Progressive enhancement based on user behavior
        this.enhancementTimer = setInterval(() => {
            this.analyzeUserBehavior();
            this.applyProgressiveEnhancements();
        }, 10000); // Check every 10 seconds
    }
    
    analyzeUserBehavior() {
        // Analyze scroll patterns
        const scrollBehavior = this.detectScrollPattern();
        
        // Analyze interaction frequency
        const interactionFrequency = this.calculateInteractionFrequency();
        
        // Analyze section engagement
        const sectionEngagement = this.calculateSectionEngagement();
        
        this.behaviorData.currentPattern = {
            scrollBehavior,
            interactionFrequency,
            sectionEngagement,
            timestamp: Date.now()
        };
    }
    
    detectScrollPattern() {
        const scrollEvents = this.behaviorData.interactionPatterns.filter(p => p.type === 'scroll');
        if (scrollEvents.length < 5) return 'exploring';
        
        const speeds = scrollEvents.slice(-10).map(e => e.speed || 0);
        const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
        
        if (avgSpeed > 100) return 'scanning';
        if (avgSpeed > 50) return 'reading';
        return 'detailed';
    }
    
    calculateInteractionFrequency() {
        const recentInteractions = this.behaviorData.interactionPatterns
            .filter(p => Date.now() - p.timestamp < 30000); // Last 30 seconds
        
        return recentInteractions.length / 30; // Interactions per second
    }
    
    calculateSectionEngagement() {
        const engagementMap = new Map();
        this.behaviorData.sectionTimeSpent.forEach((time, section) => {
            engagementMap.set(section, time / 1000); // Convert to seconds
        });
        return engagementMap;
    }
    
    applyProgressiveEnhancements() {
        const pattern = this.behaviorData.currentPattern;
        
        if (pattern.scrollBehavior === 'detailed' && pattern.interactionFrequency > 0.1) {
            // User is engaged - enhance experience
            this.enableEnhancedEffects();
        } else if (pattern.scrollBehavior === 'scanning') {
            // User is quickly scanning - optimize for speed
            this.enableFastMode();
        }
    }
    
    enableEnhancedEffects() {
        if (this.performanceLevel !== 'basic') {
            document.body.classList.add('enhanced-mode');
            this.increaseParticleCount();
            this.enableAdvancedAnimations();
        }
    }
    
    enableFastMode() {
        document.body.classList.add('fast-mode');
        this.reduceAnimationDuration();
        this.preloadNextSections();
    }
    
    initializeBehaviorLearning() {
        // Track user interactions
        ['click', 'touchstart', 'scroll', 'mousemove'].forEach(eventType => {
            document.addEventListener(eventType, (e) => {
                this.recordInteraction(eventType, e);
            }, { passive: true });
        });
        
        // Track section time
        this.sectionStartTime = Date.now();
    }
    
    recordInteraction(type, event) {
        const interaction = {
            type,
            timestamp: Date.now(),
            target: event.target?.className || '',
            position: event.clientX ? { x: event.clientX, y: event.clientY } : null
        };
        
        if (type === 'scroll') {
            interaction.scrollY = window.scrollY;
            interaction.speed = Math.abs(window.scrollY - (this.lastScrollY || 0));
            this.lastScrollY = window.scrollY;
        }
        
        this.behaviorData.interactionPatterns.push(interaction);
        
        // Keep only recent interactions
        if (this.behaviorData.interactionPatterns.length > 100) {
            this.behaviorData.interactionPatterns.shift();
        }
    }
    
    trackSectionTime(sectionId) {
        if (this.currentSectionId && this.sectionStartTime) {
            const timeSpent = Date.now() - this.sectionStartTime;
            const current = this.behaviorData.sectionTimeSpent.get(this.currentSectionId) || 0;
            this.behaviorData.sectionTimeSpent.set(this.currentSectionId, current + timeSpent);
        }
        
        this.currentSectionId = sectionId;
        this.sectionStartTime = Date.now();
    }
    
    setupContextualHelp() {
        // Create help system
        this.helpSystem = {
            tips: new Map([
                ['face-scanner', 'Click to activate Face ID scanner'],
                ['btn-primary', 'Your primary action - this will take you to the next step'],
                ['feature-card', 'Hover for more details about this feature'],
                ['demo-video', 'Click to play/pause the demo video']
            ]),
            shown: new Set(),
            enabled: true
        };
        
        // Setup help triggers
        this.setupHelpTriggers();
    }
    
    setupHelpTriggers() {
        // Mouse hover help (non-touch devices)
        if (!this.deviceCapabilities.isTouchDevice) {
            document.addEventListener('mouseover', (e) => {
                this.maybeShowHelp(e.target);
            });
            
            document.addEventListener('mouseout', () => {
                this.hideHelp();
            });
        }
        
        // Long press help (touch devices)
        if (this.deviceCapabilities.isTouchDevice) {
            let longPressTimer;
            
            document.addEventListener('touchstart', (e) => {
                longPressTimer = setTimeout(() => {
                    this.maybeShowHelp(e.target);
                    if (navigator.vibrate) navigator.vibrate(50);
                }, 800);
            });
            
            document.addEventListener('touchend', () => {
                clearTimeout(longPressTimer);
                setTimeout(() => this.hideHelp(), 2000);
            });
        }
    }
    
    maybeShowHelp(target) {
        if (!this.helpSystem.enabled) return;
        
        const helpKey = this.getHelpKey(target);
        if (!helpKey || this.helpSystem.shown.has(helpKey)) return;
        
        const helpText = this.helpSystem.tips.get(helpKey);
        if (helpText) {
            this.showHelp(target, helpText);
            this.helpSystem.shown.add(helpKey);
        }
    }
    
    getHelpKey(element) {
        if (element.classList.contains('face-scanner-hero')) return 'face-scanner';
        if (element.classList.contains('btn-primary')) return 'btn-primary';
        if (element.classList.contains('feature')) return 'feature-card';
        if (element.tagName === 'VIDEO') return 'demo-video';
        return null;
    }
    
    showHelp(target, text) {
        this.hideHelp(); // Hide any existing help
        
        const tooltip = document.createElement('div');
        tooltip.className = 'help-tooltip visible';
        tooltip.textContent = text;
        
        const rect = target.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - 50) + 'px';
        
        document.body.appendChild(tooltip);
        this.currentTooltip = tooltip;
        
        // Auto-hide after 3 seconds
        setTimeout(() => this.hideHelp(), 3000);
    }
    
    hideHelp() {
        if (this.currentTooltip) {
            this.currentTooltip.classList.remove('visible');
            setTimeout(() => {
                if (this.currentTooltip) {
                    this.currentTooltip.remove();
                    this.currentTooltip = null;
                }
            }, 300);
        }
    }
    
    initializePerformanceLearning() {
        // Monitor performance metrics
        this.performanceMonitor = {
            frameDrops: 0,
            lagSpikes: 0,
            memoryUsage: 0,
            adaptations: []
        };
        
        this.startPerformanceMonitoring();
    }
    
    startPerformanceMonitoring() {
        let lastTime = performance.now();
        let frameCount = 0;
        let frameDropCount = 0;
        
        const monitorFrame = (currentTime) => {
            frameCount++;
            const delta = currentTime - lastTime;
            
            if (delta > 16.67 * 2) { // Dropped frame (should be ~16.67ms for 60fps)
                frameDropCount++;
                if (frameDropCount > 10) {
                    this.adaptPerformance('reduce');
                    frameDropCount = 0;
                }
            }
            
            if (frameCount % 60 === 0) { // Check every 60 frames
                const fps = 1000 / (delta / 60);
                this.recordPerformanceMetric('fps', fps);
            }
            
            lastTime = currentTime;
            requestAnimationFrame(monitorFrame);
        };
        
        requestAnimationFrame(monitorFrame);
        
        // Memory monitoring
        if (performance.memory) {
            setInterval(() => {
                const memoryInfo = performance.memory;
                this.recordPerformanceMetric('memory', memoryInfo.usedJSHeapSize);
                
                if (memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.9) {
                    this.adaptPerformance('memory');
                }
            }, 5000);
        }
    }
    
    recordPerformanceMetric(type, value) {
        this.performanceMonitor[type + 'History'] = this.performanceMonitor[type + 'History'] || [];
        this.performanceMonitor[type + 'History'].push({
            value,
            timestamp: Date.now()
        });
        
        // Keep only recent history
        if (this.performanceMonitor[type + 'History'].length > 100) {
            this.performanceMonitor[type + 'History'].shift();
        }
    }
    
    adaptPerformance(reason) {
        console.log(`🔧 Adapting performance due to: ${reason}`);
        
        const adaptation = {
            reason,
            timestamp: Date.now(),
            previousLevel: this.performanceLevel
        };
        
        if (reason === 'reduce') {
            this.reduceEffectComplexity();
        } else if (reason === 'memory') {
            this.optimizeMemoryUsage();
        }
        
        adaptation.newLevel = this.performanceLevel;
        this.performanceMonitor.adaptations.push(adaptation);
    }
    
    reduceEffectComplexity() {
        document.body.classList.add('performance-reduced');
        
        // Reduce particle count
        const currentCount = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--particle-count')) || 30;
        document.documentElement.style.setProperty('--particle-count', Math.max(5, currentCount - 10));
        
        // Simplify animations
        document.documentElement.style.setProperty('--animation-quality', 'reduced');
        
        // Disable heavy effects temporarily
        document.querySelectorAll('.cinematic-3d').forEach(el => {
            el.style.transformStyle = 'flat';
        });
    }
    
    optimizeMemoryUsage() {
        // Clean up particles
        document.querySelectorAll('.particle-3d, .magnetic-particle').forEach(p => p.remove());
        
        // Clear behavior history
        this.behaviorData.interactionPatterns = this.behaviorData.interactionPatterns.slice(-20);
        
        // Garbage collect animations
        const animationStyles = document.querySelectorAll('style[data-animation]');
        animationStyles.forEach(s => s.remove());
    }
    
    // Enhanced Face ID success animation
    enhanceFaceIDSuccess() {
        const scanner = document.querySelector('.face-scanner-hero');
        if (!scanner) return;
        
        // Create success particle burst
        const rect = scanner.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create celebratory burst
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle-3d particle-success-burst';
                particle.textContent = ['✨', '🎉', '⭐', '💫', '🌟'][Math.floor(Math.random() * 5)];
                
                const angle = (i / 30) * Math.PI * 2;
                const radius = 50 + Math.random() * 100;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                particle.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    font-size: ${16 + Math.random() * 12}px;
                    color: rgba(0, 255, 136, 0.9);
                    z-index: 1000;
                    pointer-events: none;
                `;
                
                document.body.appendChild(particle);
                
                setTimeout(() => particle.remove(), 2000);
            }, i * 20);
        }
        
        // Haptic celebration
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 200]);
        }
    }
    
    // Public API
    triggerCelebration() {
        this.enhanceFaceIDSuccess();
    }
    
    adaptToDevice(capabilities) {
        Object.assign(this.deviceCapabilities, capabilities);
        this.adaptExperience();
    }
    
    getPerformanceReport() {
        return {
            level: this.performanceLevel,
            capabilities: this.deviceCapabilities,
            behavior: this.behaviorData,
            performance: this.performanceMonitor
        };
    }
    
    destroy() {
        clearInterval(this.enhancementTimer);
        document.querySelectorAll('.particle-3d, .magnetic-particle, .help-tooltip').forEach(el => el.remove());
        document.getElementById('cinematic-engine-styles')?.remove();
    }
}

// Global instance
window.cinematicEngine = null;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cinematicEngine = new CinematicEngine();
    });
} else {
    window.cinematicEngine = new CinematicEngine();
}