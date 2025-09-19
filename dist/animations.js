/**
 * FACEPAY PROFESSIONAL ANIMATIONS - APPLE LEVEL
 * Advanced JavaScript animations with GSAP & Three.js
 * 60fps performance optimized
 */

class FacePayAnimations {
    constructor() {
        this.isLoaded = false;
        this.animations = new Map();
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particleSystem = null;
        
        this.init();
    }

    async init() {
        await this.loadLibraries();
        this.setupEventListeners();
        this.initGSAPAnimations();
        this.initThreeJS();
        this.initParticleSystem();
        this.initMagneticElements();
        this.initScrollAnimations();
        this.initMouseTracking();
        this.isLoaded = true;
        console.log('🎨 FacePay Animations loaded');
    }

    async loadLibraries() {
        // Load GSAP
        if (typeof gsap === 'undefined') {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js');
            gsap.registerPlugin(ScrollTrigger, TextPlugin);
        }

        // Load Three.js
        if (typeof THREE === 'undefined') {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    setupEventListeners() {
        // Mouse movement for magnetic effects
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // Window resize for Three.js
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Page visibility for performance
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    initGSAPAnimations() {
        // Hero section entrance
        this.animateHero();
        
        // Logo morphing
        this.animateLogo();
        
        // Text typewriter effect
        this.animateTypewriter();
        
        // Feature cards stagger
        this.animateFeatureCards();
        
        // Liquid loading effects
        this.animateLiquidEffects();
        
        // Video reveal animation
        this.animateVideoReveal();
    }

    animateHero() {
        const tl = gsap.timeline();
        
        // Hero title animation with 3D effect
        tl.from('.hero-title', {
            duration: 1.5,
            y: 100,
            rotationX: 45,
            opacity: 0,
            ease: 'power4.out',
            stagger: 0.1
        })
        .from('.hero-subtitle', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        }, '-=0.8')
        .from('.hero-cta', {
            duration: 1,
            scale: 0.8,
            opacity: 0,
            ease: 'elastic.out(1, 0.5)'
        }, '-=0.5');

        this.animations.set('hero', tl);
    }

    animateLogo() {
        const logo = document.querySelector('.logo-element');
        if (!logo) return;

        gsap.to(logo, {
            duration: 8,
            rotation: 360,
            scale: 1.1,
            ease: 'none',
            repeat: -1,
            yoyo: true,
            transformOrigin: 'center center'
        });

        // Hover effect
        logo.addEventListener('mouseenter', () => {
            gsap.to(logo, {
                duration: 0.3,
                scale: 1.2,
                rotation: '+=15',
                ease: 'power2.out'
            });
        });

        logo.addEventListener('mouseleave', () => {
            gsap.to(logo, {
                duration: 0.5,
                scale: 1.1,
                rotation: '-=15',
                ease: 'power2.out'
            });
        });
    }

    animateTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter-text');
        
        typewriterElements.forEach((element, index) => {
            const text = element.textContent;
            element.textContent = '';
            
            gsap.to(element, {
                duration: text.length * 0.05,
                text: text,
                ease: 'none',
                delay: index * 0.5,
                onComplete: () => {
                    // Blinking cursor effect
                    gsap.to(element, {
                        duration: 0.5,
                        opacity: 0.5,
                        repeat: -1,
                        yoyo: true,
                        ease: 'power2.inOut'
                    });
                }
            });
        });
    }

    animateFeatureCards() {
        gsap.set('.feature-card', { 
            y: 100, 
            opacity: 0, 
            rotationX: 45 
        });

        ScrollTrigger.create({
            trigger: '.features-section',
            start: 'top 80%',
            onEnter: () => {
                gsap.to('.feature-card', {
                    duration: 1,
                    y: 0,
                    opacity: 1,
                    rotationX: 0,
                    stagger: 0.2,
                    ease: 'power3.out',
                    onComplete: () => {
                        this.addFeatureCardHovers();
                    }
                });
            }
        });
    }

    addFeatureCardHovers() {
        const cards = document.querySelectorAll('.feature-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: 0.3,
                    y: -20,
                    rotationY: 10,
                    scale: 1.05,
                    boxShadow: '0 30px 60px rgba(16, 185, 129, 0.3)',
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.5,
                    y: 0,
                    rotationY: 0,
                    scale: 1,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    ease: 'power2.out'
                });
            });
        });
    }

    animateLiquidEffects() {
        const liquidElements = document.querySelectorAll('.liquid-element');
        
        liquidElements.forEach(element => {
            const tl = gsap.timeline({ repeat: -1 });
            
            tl.to(element, {
                duration: 2,
                morphSVG: "M10,25 Q30,5 50,25 Q30,45 10,25 Z",
                ease: 'power2.inOut'
            })
            .to(element, {
                duration: 2,
                morphSVG: "M10,10 L50,10 L50,50 L10,50 Z",
                ease: 'power2.inOut'
            });
        });
    }

    animateVideoReveal() {
        const video = document.querySelector('#demoVideo');
        if (!video) return;

        ScrollTrigger.create({
            trigger: video,
            start: 'top 90%',
            onEnter: () => {
                gsap.from(video.parentElement, {
                    duration: 1.5,
                    scale: 0.8,
                    opacity: 0,
                    rotationY: 15,
                    ease: 'power3.out',
                    onComplete: () => {
                        video.play().catch(e => console.log('Video autoplay failed'));
                    }
                });
            }
        });
    }

    initThreeJS() {
        // Create Three.js scene for 3D background effects
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.createCanvas(),
            alpha: true,
            antialias: true 
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        // Create 3D background geometry
        this.create3DBackground();
        
        // Start render loop
        this.animate3D();
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.className = 'three-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
        `;
        document.body.appendChild(canvas);
        return canvas;
    }

    create3DBackground() {
        // Floating geometric shapes
        const geometries = [
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(0.5, 32, 32),
            new THREE.ConeGeometry(0.5, 1, 32)
        ];

        const material = new THREE.MeshBasicMaterial({ 
            color: 0x10b981,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });

        for (let i = 0; i < 50; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const mesh = new THREE.Mesh(geometry, material.clone());
            
            mesh.position.x = Math.random() * 200 - 100;
            mesh.position.y = Math.random() * 200 - 100;
            mesh.position.z = Math.random() * 200 - 100;
            
            mesh.rotation.x = Math.random() * 2 * Math.PI;
            mesh.rotation.y = Math.random() * 2 * Math.PI;
            
            this.scene.add(mesh);
        }
        
        this.camera.position.z = 50;
    }

    animate3D() {
        requestAnimationFrame(this.animate3D.bind(this));
        
        // Rotate all objects
        this.scene.children.forEach(child => {
            child.rotation.x += 0.005;
            child.rotation.y += 0.005;
        });
        
        // Mouse parallax effect
        this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouse.y * 0.5 - this.camera.position.y) * 0.05;
        
        this.renderer.render(this.scene, this.camera);
    }

    initParticleSystem() {
        this.createParticleCanvas();
        this.startParticleAnimation();
    }

    createParticleCanvas() {
        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            pointer-events: none;
        `;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        this.particleCanvas = canvas;
        this.particleCtx = canvas.getContext('2d');
        document.body.appendChild(canvas);
    }

    startParticleAnimation() {
        // Create particles
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                opacity: Math.random() * 0.5 + 0.2,
                hue: Math.random() * 60 + 140 // Green hues
            });
        }
        
        this.animateParticles();
    }

    animateParticles() {
        this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around screen
            if (particle.x > window.innerWidth) particle.x = 0;
            if (particle.x < 0) particle.x = window.innerWidth;
            if (particle.y > window.innerHeight) particle.y = 0;
            if (particle.y < 0) particle.y = window.innerHeight;
            
            // Draw particle
            this.particleCtx.globalAlpha = particle.opacity;
            this.particleCtx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
            this.particleCtx.beginPath();
            this.particleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.particleCtx.fill();
        });
        
        requestAnimationFrame(this.animateParticles.bind(this));
    }

    initMagneticElements() {
        const magneticElements = document.querySelectorAll('.magnetic-element');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(element, {
                    duration: 0.3,
                    x: x * 0.2,
                    y: y * 0.2,
                    ease: 'power2.out'
                });
            });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    duration: 0.5,
                    x: 0,
                    y: 0,
                    ease: 'power2.out'
                });
            });
        });
    }

    initScrollAnimations() {
        // Parallax scrolling effects
        gsap.registerPlugin(ScrollTrigger);
        
        // Background elements parallax
        gsap.utils.toArray('.parallax-bg').forEach(element => {
            gsap.to(element, {
                yPercent: -50,
                ease: 'none',
                scrollTrigger: {
                    trigger: element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
        
        // Text reveal on scroll
        gsap.utils.toArray('.reveal-text').forEach(element => {
            gsap.from(element, {
                opacity: 0,
                y: 100,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
        
        // Scale on scroll
        gsap.utils.toArray('.scale-on-scroll').forEach(element => {
            gsap.fromTo(element, 
                { scale: 0.8, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }

    initMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            
            // Update cursor follower
            this.updateCursorFollower(e.clientX, e.clientY);
        });
        
        this.createCursorFollower();
    }

    createCursorFollower() {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-follower';
        cursor.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(16, 185, 129, 0.8), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(cursor);
        this.cursorFollower = cursor;
    }

    updateCursorFollower(x, y) {
        if (this.cursorFollower) {
            gsap.to(this.cursorFollower, {
                duration: 0.2,
                x: x - 10,
                y: y - 10,
                ease: 'power2.out'
            });
        }
    }

    handleMouseMove(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    handleResize() {
        if (this.renderer && this.camera) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        
        if (this.particleCanvas) {
            this.particleCanvas.width = window.innerWidth;
            this.particleCanvas.height = window.innerHeight;
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations when tab is not visible
            gsap.globalTimeline.pause();
        } else {
            // Resume animations when tab becomes visible
            gsap.globalTimeline.resume();
        }
    }

    // Public methods for external use
    playAnimation(name) {
        const animation = this.animations.get(name);
        if (animation) {
            animation.play();
        }
    }

    pauseAnimation(name) {
        const animation = this.animations.get(name);
        if (animation) {
            animation.pause();
        }
    }

    // Morphing SVG paths
    morphSVG(element, newPath, duration = 1) {
        if (typeof gsap !== 'undefined') {
            gsap.to(element, {
                duration: duration,
                morphSVG: newPath,
                ease: 'power2.inOut'
            });
        }
    }

    // Create liquid button effect
    createLiquidButton(element) {
        element.addEventListener('mouseenter', () => {
            gsap.to(element, {
                duration: 0.3,
                scale: 1.05,
                borderRadius: '50px',
                ease: 'power2.out'
            });
        });

        element.addEventListener('mouseleave', () => {
            gsap.to(element, {
                duration: 0.5,
                scale: 1,
                borderRadius: '1rem',
                ease: 'power2.out'
            });
        });

        element.addEventListener('click', () => {
            gsap.timeline()
                .to(element, {
                    duration: 0.1,
                    scale: 0.95,
                    ease: 'power2.out'
                })
                .to(element, {
                    duration: 0.3,
                    scale: 1.05,
                    ease: 'elastic.out(1, 0.5)'
                });
        });
    }

    // Destroy animations (cleanup)
    destroy() {
        this.animations.clear();
        this.particles = [];
        
        if (this.renderer) {
            document.body.removeChild(this.renderer.domElement);
        }
        
        if (this.particleCanvas) {
            document.body.removeChild(this.particleCanvas);
        }
        
        if (this.cursorFollower) {
            document.body.removeChild(this.cursorFollower);
        }
    }
}

    loadFramerMotionEasings() {
        // Framer Motion inspired easing functions
        this.easings = {
            spring: 'M0,0 C0.05,0 0.133,0.17 0.142,0.331 C0.149,0.447 0.181,0.648 0.239,0.743 C0.315,0.879 0.374,0.995 0.43,1.024 C0.491,1.056 0.568,1.056 0.629,1.024 C0.685,0.995 0.744,0.879 0.82,0.743 C0.878,0.648 0.91,0.447 0.917,0.331 C0.926,0.17 0.95,0 1,0',
            
            // Apple-style easings
            apple: {
                easeInOut: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
                easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
                easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
                bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
            },
            
            // Material Design
            material: {
                standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
                decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
                accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
                sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
            },
            
            // Custom physics-based
            physics: {
                spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
                elastic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }
        };
    }
    
    initPerformanceMonitor() {
        const monitor = () => {
            const now = performance.now();
            const delta = now - this.performanceMonitor.lastTime;
            this.performanceMonitor.frameCount++;
            
            if (delta >= 1000) {
                this.performanceMonitor.fps = Math.round((this.performanceMonitor.frameCount * 1000) / delta);
                this.performanceMonitor.frameCount = 0;
                this.performanceMonitor.lastTime = now;
                
                // Adaptive quality based on performance
                if (this.performanceMonitor.adaptiveQuality) {
                    this.adjustQualityBasedOnFPS();
                }
                
                // Debug logging
                if (this.performanceMonitor.fps < 30) {
                    console.warn(`⚠️ FPS dropped to ${this.performanceMonitor.fps}. Reducing quality.`);
                }
            }
            
            requestAnimationFrame(monitor);
        };
        
        monitor();
    }
    
    adjustQualityBasedOnFPS() {
        if (this.performanceMonitor.fps < 30) {
            // Reduce quality
            document.documentElement.style.setProperty('--particle-density', '0.5');
            gsap.globalTimeline.timeScale(0.8);
        } else if (this.performanceMonitor.fps > 55) {
            // Increase quality
            document.documentElement.style.setProperty('--particle-density', '1');
            gsap.globalTimeline.timeScale(1);
        }
    }
    
    initIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px 0px -100px 0px',
            threshold: [0, 0.1, 0.5, 1]
        };
        
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const animationConfig = this.observedElements.get(element);
                
                if (!animationConfig) return;
                
                if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
                    // Element is visible - trigger animation
                    this.triggerLazyAnimation(element, animationConfig);
                } else if (entry.intersectionRatio === 0) {
                    // Element is completely out of view - reset if needed
                    if (animationConfig.reset) {
                        this.resetAnimation(element, animationConfig);
                    }
                }
            });
        }, options);
    }
    
    initMasterTimeline() {
        this.masterTimeline = gsap.timeline({
            paused: false,
            onComplete: () => {
                console.log('🎬 Master animation timeline completed');
            }
        });
        
        // Set global timeline performance settings
        gsap.config({
            force3D: 'auto',
            nullTargetWarn: false,
            autoSleep: 60
        });
    }
    
    initLottieAnimations() {
        if (typeof lottie === 'undefined') return;
        
        // Define Lottie animation configurations
        const lottieConfigs = [
            {
                id: 'face-scan',
                container: '#face-scan-lottie',
                path: '/animations/face-scan.json',
                autoplay: false,
                loop: false
            },
            {
                id: 'success-checkmark',
                container: '#success-checkmark',
                path: '/animations/success.json',
                autoplay: false,
                loop: false
            },
            {
                id: 'loading-spinner',
                container: '#loading-spinner',
                path: '/animations/loading.json',
                autoplay: true,
                loop: true
            },
            {
                id: 'crypto-coin',
                container: '#crypto-coin',
                path: '/animations/coin-flip.json',
                autoplay: false,
                loop: true
            }
        ];
        
        lottieConfigs.forEach(config => {
            const container = document.querySelector(config.container);
            if (container) {
                try {
                    const animation = lottie.loadAnimation({
                        container: container,
                        renderer: 'svg',
                        loop: config.loop,
                        autoplay: config.autoplay,
                        path: config.path,
                        rendererSettings: {
                            progressiveLoad: true,
                            hideOnTransparent: true
                        }
                    });
                    
                    this.lottieAnimations.set(config.id, animation);
                    console.log(`📱 Lottie animation '${config.id}' loaded`);
                } catch (error) {
                    console.warn(`Failed to load Lottie animation '${config.id}':`, error);
                }
            }
        });
    }
    
    initFramerMotionPatterns() {
        // Implement Framer Motion-inspired animation patterns
        this.animationPatterns = {
            // Stagger children animation
            staggerChildren: (elements, options = {}) => {
                const tl = gsap.timeline();
                const stagger = options.stagger || 0.1;
                const duration = options.duration || 0.8;
                const ease = options.ease || this.easings.apple.easeOut;
                
                tl.from(elements, {
                    y: options.y || 50,
                    opacity: options.opacity || 0,
                    scale: options.scale || 0.8,
                    rotation: options.rotation || 0,
                    duration: duration,
                    ease: ease,
                    stagger: stagger
                });
                
                return tl;
            },
            
            // Spring animation
            spring: (element, options = {}) => {
                return gsap.to(element, {
                    ...options,
                    ease: this.easings.physics.spring,
                    duration: options.duration || 1.2
                });
            },
            
            // Magnetic attraction
            magneticAttraction: (element, options = {}) => {
                const strength = options.strength || 0.3;
                const duration = options.duration || 0.4;
                
                element.addEventListener('mouseenter', (e) => {
                    const rect = element.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    gsap.to(element, {
                        x: x * strength,
                        y: y * strength,
                        scale: 1.05,
                        duration: duration,
                        ease: this.easings.physics.elastic
                    });
                });
                
                element.addEventListener('mouseleave', () => {
                    gsap.to(element, {
                        x: 0,
                        y: 0,
                        scale: 1,
                        duration: duration * 1.5,
                        ease: this.easings.physics.spring
                    });
                });
            },
            
            // Morphing path animation
            morphPath: (pathElement, newPath, options = {}) => {
                if (typeof MorphSVGPlugin !== 'undefined') {
                    return gsap.to(pathElement, {
                        morphSVG: newPath,
                        duration: options.duration || 1,
                        ease: options.ease || this.easings.apple.easeInOut,
                        ...options
                    });
                }
            },
            
            // Text reveal animation
            textReveal: (textElement, options = {}) => {
                const text = textElement.textContent;
                const chars = text.split('');
                textElement.innerHTML = chars.map(char => 
                    `<span style="display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
                ).join('');
                
                const spans = textElement.querySelectorAll('span');
                
                return gsap.from(spans, {
                    y: 100,
                    opacity: 0,
                    rotationX: 90,
                    duration: 0.8,
                    stagger: 0.02,
                    ease: this.easings.physics.spring,
                    ...options
                });
            }
        };
    }
    
    startAnimationLoop() {
        const animate = () => {
            // Update master timeline
            if (this.masterTimeline) {
                this.masterTimeline.progress();
            }
            
            // Update Lottie animations based on scroll or interactions
            this.updateLottieAnimations();
            
            // Continue the loop
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    updateLottieAnimations() {
        // Update Lottie animations based on scroll position
        const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        
        this.lottieAnimations.forEach((animation, id) => {
            if (id === 'crypto-coin') {
                // Sync coin flip with scroll
                const frame = Math.floor(scrollProgress * (animation.totalFrames - 1));
                animation.goToAndStop(frame, true);
            }
        });
    }
    
    // Enhanced public API methods
    observeElement(element, animationConfig) {
        this.observedElements.set(element, animationConfig);
        this.intersectionObserver.observe(element);
    }
    
    triggerLazyAnimation(element, config) {
        if (config.triggered) return;
        
        const animation = this.animationPatterns[config.type];
        if (animation) {
            animation(element, config.options);
            config.triggered = true;
        }
    }
    
    resetAnimation(element, config) {
        gsap.set(element, config.resetProps || { opacity: 0, y: 50 });
        config.triggered = false;
    }
    
    playLottieAnimation(id, options = {}) {
        const animation = this.lottieAnimations.get(id);
        if (animation) {
            if (options.frame !== undefined) {
                animation.goToAndPlay(options.frame);
            } else {
                animation.play();
            }
        }
    }
    
    pauseLottieAnimation(id) {
        const animation = this.lottieAnimations.get(id);
        if (animation) {
            animation.pause();
        }
    }
    
    // Performance utilities
    static detectDeviceCapabilities() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        return {
            webGL: !!gl,
            devicePixelRatio: window.devicePixelRatio || 1,
            cores: navigator.hardwareConcurrency || 4,
            mobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
    }
    
    static getOptimalSettings() {
        const capabilities = FacePayAnimations.detectDeviceCapabilities();
        
        if (capabilities.prefersReducedMotion) {
            return { animations: false };
        }
        
        if (capabilities.mobile || capabilities.cores < 4) {
            return {
                particleCount: 100,
                quality: 'performance',
                enableComplexAnimations: false
            };
        }
        
        return {
            particleCount: 500,
            quality: 'high',
            enableComplexAnimations: true
        };
    }
}

// Auto-initialize with optimal settings
document.addEventListener('DOMContentLoaded', () => {
    const settings = FacePayAnimations.getOptimalSettings();
    
    if (settings.animations !== false) {
        window.facePayAnimations = new FacePayAnimations();
        
        // Apply lazy loading to common animation elements
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            window.facePayAnimations.observeElement(element, {
                type: 'staggerChildren',
                options: { y: 30, duration: 0.8 },
                reset: true
            });
        });
        
        document.querySelectorAll('.text-reveal').forEach(element => {
            window.facePayAnimations.observeElement(element, {
                type: 'textReveal',
                options: { duration: 1.2 }
            });
        });
        
        document.querySelectorAll('.magnetic').forEach(element => {
            window.facePayAnimations.animationPatterns.magneticAttraction(element);
        });
    }
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FacePayAnimations;
}