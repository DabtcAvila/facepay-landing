/**
 * FACEPAY 3D HERO SCENE - APPLE LEVEL
 * Advanced Three.js scene with interactive elements
 * Professional 3D animations optimized for 60fps
 */

class FacePay3DHero {
    constructor(containerId = '3d-hero-container') {
        this.container = document.getElementById(containerId) || document.body;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;
        this.controls = null;
        
        // 3D Objects
        this.phoneModel = null;
        this.faceScanEffect = null;
        this.hologramCard = null;
        this.particleField = null;
        this.lightSystem = null;
        
        // Animation state
        this.mouse = new THREE.Vector2();
        this.clock = new THREE.Clock();
        this.isVisible = true;
        this.isInitialized = false;
        
        // Performance monitoring
        this.frameCount = 0;
        this.lastFPSCheck = 0;
        this.currentFPS = 60;
        
        this.init();
    }

    async init() {
        await this.loadThreeJS();
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupPostProcessing();
        this.setupLights();
        await this.createModels();
        this.setupInteractions();
        this.setupAnimations();
        this.handleResize();
        this.start();
        
        this.isInitialized = true;
        console.log('🎮 3D Hero Scene initialized');
    }

    async loadThreeJS() {
        if (typeof THREE === 'undefined') {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r150/three.min.js');
        }
        
        // Load additional Three.js modules
        if (!THREE.OrbitControls) {
            await this.loadScript('https://cdn.jsdelivr.net/npm/three@0.150.0/examples/js/controls/OrbitControls.js');
        }
        
        if (!THREE.EffectComposer) {
            await this.loadScript('https://cdn.jsdelivr.net/npm/three@0.150.0/examples/js/postprocessing/EffectComposer.js');
            await this.loadScript('https://cdn.jsdelivr.net/npm/three@0.150.0/examples/js/postprocessing/RenderPass.js');
            await this.loadScript('https://cdn.jsdelivr.net/npm/three@0.150.0/examples/js/postprocessing/UnrealBloomPass.js');
        }
        
        if (!THREE.GLTFLoader) {
            await this.loadScript('https://cdn.jsdelivr.net/npm/three@0.150.0/examples/js/loaders/GLTFLoader.js');
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

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent background
        this.scene.fog = new THREE.Fog(0x000000, 10, 100);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        // Style the canvas
        this.renderer.domElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            z-index: 0;
            pointer-events: none;
        `;
        
        this.container.appendChild(this.renderer.domElement);
    }

    setupPostProcessing() {
        if (!THREE.EffectComposer) return;
        
        this.composer = new THREE.EffectComposer(this.renderer);
        
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Bloom effect for glowing elements
        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.8, // strength
            0.4, // radius
            0.1  // threshold
        );
        this.composer.addPass(bloomPass);
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x10b981, 0.3);
        this.scene.add(ambientLight);
        
        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Accent lights for dramatic effect
        const accentLight1 = new THREE.PointLight(0x10b981, 2, 20);
        accentLight1.position.set(-5, 3, 2);
        this.scene.add(accentLight1);
        
        const accentLight2 = new THREE.PointLight(0x34d399, 1.5, 15);
        accentLight2.position.set(5, -2, 3);
        this.scene.add(accentLight2);
        
        this.lightSystem = {
            ambient: ambientLight,
            directional: directionalLight,
            accent1: accentLight1,
            accent2: accentLight2
        };
    }

    async createModels() {
        // Create phone model
        await this.createPhoneModel();
        
        // Create face scan effect
        this.createFaceScanEffect();
        
        // Create hologram card
        this.createHologramCard();
        
        // Create particle field
        this.createParticleField();
        
        // Create logo sphere
        this.createLogoSphere();
    }

    async createPhoneModel() {
        // Create a stylized phone model
        const phoneGroup = new THREE.Group();
        
        // Phone body
        const phoneGeometry = new THREE.BoxGeometry(2, 4, 0.3);
        const phoneMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.8,
            roughness: 0.2,
            clearcoat: 1,
            clearcoatRoughness: 0.1
        });
        
        const phoneBody = new THREE.Mesh(phoneGeometry, phoneMaterial);
        phoneBody.castShadow = true;
        phoneBody.receiveShadow = true;
        phoneGroup.add(phoneBody);
        
        // Screen
        const screenGeometry = new THREE.PlaneGeometry(1.8, 3.2);
        const screenMaterial = new THREE.MeshBasicMaterial({
            color: 0x10b981,
            opacity: 0.9,
            transparent: true
        });
        
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = 0.16;
        phoneGroup.add(screen);
        
        // Face ID indicator
        const faceIDGeometry = new THREE.CircleGeometry(0.1, 32);
        const faceIDMaterial = new THREE.MeshBasicMaterial({
            color: 0x34d399,
            opacity: 0.8,
            transparent: true
        });
        
        const faceIDIndicator = new THREE.Mesh(faceIDGeometry, faceIDMaterial);
        faceIDIndicator.position.set(0, 1.4, 0.17);
        phoneGroup.add(faceIDIndicator);
        
        phoneGroup.position.set(2, 0, 0);
        this.scene.add(phoneGroup);
        this.phoneModel = phoneGroup;
    }

    createFaceScanEffect() {
        const scanGroup = new THREE.Group();
        
        // Create scanning lines
        const linesMaterial = new THREE.LineBasicMaterial({
            color: 0x10b981,
            opacity: 0.7,
            transparent: true
        });
        
        for (let i = 0; i < 10; i++) {
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-1, -1.5 + i * 0.3, 0),
                new THREE.Vector3(1, -1.5 + i * 0.3, 0)
            ]);
            
            const line = new THREE.Line(geometry, linesMaterial);
            scanGroup.add(line);
        }
        
        // Create face outline
        const faceGeometry = new THREE.RingGeometry(0.8, 1, 32);
        const faceMaterial = new THREE.MeshBasicMaterial({
            color: 0x34d399,
            opacity: 0.3,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const faceOutline = new THREE.Mesh(faceGeometry, faceMaterial);
        scanGroup.add(faceOutline);
        
        scanGroup.position.set(-2, 0, 0);
        this.scene.add(scanGroup);
        this.faceScanEffect = scanGroup;
    }

    createHologramCard() {
        const cardGroup = new THREE.Group();
        
        // Card base
        const cardGeometry = new THREE.BoxGeometry(2.5, 1.5, 0.05);
        const cardMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.1,
            roughness: 0.1,
            transmission: 0.7,
            transparent: true,
            opacity: 0.8
        });
        
        const card = new THREE.Mesh(cardGeometry, cardMaterial);
        card.castShadow = true;
        cardGroup.add(card);
        
        // Holographic elements
        const holoGeometry = new THREE.PlaneGeometry(2.3, 1.3);
        const holoMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0x10b981) },
                color2: { value: new THREE.Color(0x34d399) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                
                void main() {
                    vec2 p = vUv * 2.0 - 1.0;
                    float len = length(p);
                    vec2 ripple = vUv + p/len * cos(len*12.0-time*4.0) * 0.03;
                    float delta = sin(ripple.x*10.0 + time) * sin(ripple.y*10.0 + time);
                    vec3 color = mix(color1, color2, delta);
                    gl_FragColor = vec4(color, 0.6);
                }
            `,
            transparent: true
        });
        
        const holoPlane = new THREE.Mesh(holoGeometry, holoMaterial);
        holoPlane.position.z = 0.026;
        cardGroup.add(holoPlane);
        
        cardGroup.position.set(0, 2.5, 0);
        this.scene.add(cardGroup);
        this.hologramCard = cardGroup;
    }

    createParticleField() {
        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const color1 = new THREE.Color(0x10b981);
        const color2 = new THREE.Color(0x34d399);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Position
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;
            
            // Color
            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
            
            // Size
            sizes[i] = Math.random() * 0.05 + 0.01;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    pos.y += sin(time + position.x * 0.5) * 0.1;
                    pos.x += cos(time + position.y * 0.5) * 0.1;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    float r = distance(gl_PointCoord, vec2(0.5, 0.5));
                    if (r > 0.5) discard;
                    float alpha = 1.0 - smoothstep(0.0, 0.5, r);
                    gl_FragColor = vec4(vColor, alpha * 0.6);
                }
            `,
            transparent: true,
            vertexColors: true
        });
        
        this.particleField = new THREE.Points(geometry, material);
        this.scene.add(this.particleField);
    }

    createLogoSphere() {
        const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const sphereMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x10b981,
            metalness: 0.1,
            roughness: 0.1,
            transmission: 0.8,
            transparent: true,
            opacity: 0.7,
            clearcoat: 1,
            clearcoatRoughness: 0.1
        });
        
        const logoSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        logoSphere.position.set(0, -2.5, 0);
        logoSphere.castShadow = true;
        this.scene.add(logoSphere);
        this.logoSphere = logoSphere;
    }

    setupInteractions() {
        // Mouse movement tracking
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Touch support
        window.addEventListener('touchmove', (event) => {
            if (event.touches.length > 0) {
                const touch = event.touches[0];
                this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            }
        });
        
        // Scroll-based interactions
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const scrollProgress = Math.min(scrollY / maxScroll, 1);
            
            // Update camera position based on scroll
            if (this.camera) {
                this.camera.position.y = scrollProgress * -5;
                this.camera.lookAt(0, scrollProgress * -2, 0);
            }
        });
        
        // Performance monitoring
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Visibility change
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
        });
    }

    setupAnimations() {
        // Create main animation timeline
        if (typeof gsap !== 'undefined') {
            this.animationTimeline = gsap.timeline({ repeat: -1 });
            
            // Phone rotation
            if (this.phoneModel) {
                gsap.to(this.phoneModel.rotation, {
                    duration: 8,
                    y: Math.PI * 2,
                    ease: 'none',
                    repeat: -1
                });
                
                gsap.to(this.phoneModel.position, {
                    duration: 6,
                    y: '+=0.5',
                    ease: 'power2.inOut',
                    yoyo: true,
                    repeat: -1
                });
            }
            
            // Hologram card animation
            if (this.hologramCard) {
                gsap.to(this.hologramCard.rotation, {
                    duration: 10,
                    z: Math.PI * 2,
                    ease: 'none',
                    repeat: -1
                });
            }
            
            // Logo sphere pulsing
            if (this.logoSphere) {
                gsap.to(this.logoSphere.scale, {
                    duration: 2,
                    x: 1.2,
                    y: 1.2,
                    z: 1.2,
                    ease: 'power2.inOut',
                    yoyo: true,
                    repeat: -1
                });
            }
        }
    }

    handleResize() {
        if (!this.camera || !this.renderer) return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        if (this.composer) {
            this.composer.setSize(width, height);
        }
    }

    animate() {
        if (!this.isVisible) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        
        const deltaTime = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();
        
        // Update shader uniforms
        if (this.particleField && this.particleField.material.uniforms) {
            this.particleField.material.uniforms.time.value = elapsedTime;
        }
        
        if (this.hologramCard) {
            const holoMaterial = this.hologramCard.children[1]?.material;
            if (holoMaterial && holoMaterial.uniforms) {
                holoMaterial.uniforms.time.value = elapsedTime;
            }
        }
        
        // Mouse interaction effects
        if (this.phoneModel) {
            this.phoneModel.rotation.x += (this.mouse.y * 0.1 - this.phoneModel.rotation.x) * 0.05;
            this.phoneModel.rotation.y += (this.mouse.x * 0.1 - this.phoneModel.rotation.y) * 0.05;
        }
        
        if (this.faceScanEffect) {
            // Animate scanning lines
            this.faceScanEffect.children.forEach((line, index) => {
                if (line.material) {
                    line.material.opacity = 0.3 + Math.sin(elapsedTime * 2 + index * 0.5) * 0.4;
                }
            });
        }
        
        // Rotate particle field
        if (this.particleField) {
            this.particleField.rotation.y = elapsedTime * 0.1;
        }
        
        // Dynamic lighting
        if (this.lightSystem) {
            this.lightSystem.accent1.intensity = 1.5 + Math.sin(elapsedTime * 1.5) * 0.5;
            this.lightSystem.accent2.intensity = 1.0 + Math.cos(elapsedTime * 2) * 0.3;
            
            this.lightSystem.accent1.position.x = Math.sin(elapsedTime * 0.5) * 3;
            this.lightSystem.accent2.position.x = Math.cos(elapsedTime * 0.7) * 3;
        }
        
        // Camera movement
        this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 0.3 - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 0, 0);
        
        // Performance monitoring
        this.frameCount++;
        if (elapsedTime - this.lastFPSCheck > 1) {
            this.currentFPS = this.frameCount;
            this.frameCount = 0;
            this.lastFPSCheck = elapsedTime;
            
            // Adjust quality based on performance
            if (this.currentFPS < 30) {
                this.renderer.setPixelRatio(1);
                if (this.particleField) {
                    this.particleField.visible = false;
                }
            } else if (this.currentFPS > 55) {
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                if (this.particleField) {
                    this.particleField.visible = true;
                }
            }
        }
        
        // Render
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
        
        requestAnimationFrame(() => this.animate());
    }

    start() {
        this.animate();
    }

    // Public API methods
    setMousePosition(x, y) {
        this.mouse.x = (x / window.innerWidth) * 2 - 1;
        this.mouse.y = -(y / window.innerHeight) * 2 + 1;
    }

    toggleParticles(visible = true) {
        if (this.particleField) {
            this.particleField.visible = visible;
        }
    }

    updateColors(primaryColor = 0x10b981, secondaryColor = 0x34d399) {
        // Update materials with new colors
        if (this.phoneModel) {
            const screen = this.phoneModel.children[1];
            if (screen) {
                screen.material.color.setHex(primaryColor);
            }
        }
        
        if (this.lightSystem) {
            this.lightSystem.accent1.color.setHex(primaryColor);
            this.lightSystem.accent2.color.setHex(secondaryColor);
        }
    }

    triggerFaceScanAnimation() {
        if (!this.faceScanEffect) return;
        
        // Animate face scan effect
        if (typeof gsap !== 'undefined') {
            gsap.timeline()
                .to(this.faceScanEffect.scale, {
                    duration: 0.5,
                    x: 1.2,
                    y: 1.2,
                    z: 1.2,
                    ease: 'power2.out'
                })
                .to(this.faceScanEffect.scale, {
                    duration: 0.3,
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: 'power2.in'
                }, '-=0.2')
                .to(this.faceScanEffect.rotation, {
                    duration: 1,
                    z: Math.PI * 2,
                    ease: 'power2.inOut'
                }, 0);
        }
    }

    destroy() {
        // Clean up resources
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }
        
        // Dispose of geometries and materials
        this.scene?.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        console.log('3D Hero Scene destroyed');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if WebGL is supported
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl) {
        window.facePay3DHero = new FacePay3DHero();
        console.log('🎨 3D Hero Scene initialized');
    } else {
        console.warn('WebGL not supported, 3D Hero Scene disabled');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FacePay3DHero;
}