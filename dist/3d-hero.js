/**
 * FACEPAY 3D HERO SCENE - APPLE VISION PRO LEVEL
 * Cinematic Three.js/WebGL experience with advanced effects
 * Holographic face scanning, crypto symbols, biometric UI
 * Optimized for 60fps with auto-quality adjustment
 * 
 * Features:
 * - Real-time holographic face scanning
 * - Floating crypto symbols with physics
 * - Custom shader effects (holographic, glitch, energy fields)
 * - Mouse parallax and touch gesture support
 * - Voice activation easter eggs
 * - Auto-performance optimization
 */

class FacePay3DHero {
    constructor(containerId = '3d-demo-viewport') {
        // Use the 3D demo viewport or fall back to the background container
        this.container = document.getElementById(containerId) || 
                        document.getElementById('3d-hero-container') || 
                        document.body;
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
        this.cryptoSymbols = [];
        this.biometricUI = null;
        this.energyField = null;
        this.glitchEffect = null;
        
        // Animation state
        this.mouse = new THREE.Vector2();
        this.targetMouse = new THREE.Vector2();
        this.clock = new THREE.Clock();
        this.isVisible = true;
        this.isInitialized = false;
        this.isMobile = window.innerWidth < 768;
        
        // Performance monitoring
        this.frameCount = 0;
        this.lastFPSCheck = 0;
        this.currentFPS = 60;
        this.qualityLevel = this.isMobile ? 'medium' : 'high';
        
        // Audio context for voice activation
        this.audioContext = null;
        this.voiceActivated = false;
        
        // Touch gesture tracking
        this.touchStart = { x: 0, y: 0 };
        this.touchCurrent = { x: 0, y: 0 };
        this.isTouch = false;
        
        this.init();
    }

    async init() {
        try {
            await this.loadThreeJS();
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupPostProcessing();
            this.setupLights();
            await this.createModels();
            await this.createCryptoSymbols();
            await this.createBiometricUI();
            await this.createEnergyField();
            this.setupInteractions();
            this.setupVoiceActivation();
            this.setupAnimations();
            this.handleResize();
            this.start();
            
            this.isInitialized = true;
            console.log('🎮 Cinematic 3D Hero Scene initialized - Apple Vision Pro level');
            
            // Trigger entrance animation
            this.playEntranceAnimation();
        } catch (error) {
            console.error('Failed to initialize 3D Hero Scene:', error);
            this.fallbackMode();
        }
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
        // Create phone model with advanced materials
        await this.createPhoneModel();
        
        // Create holographic face scan effect
        this.createFaceScanEffect();
        
        // Create hologram card with custom shaders
        this.createHologramCard();
        
        // Create particle field with physics
        this.createParticleField();
        
        // Create logo sphere with energy effects
        this.createLogoSphere();
    }

    // Advanced shader materials for cinematic effects
    createHolographicMaterial() {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                opacity: { value: 0.8 },
                color1: { value: new THREE.Color(0x10b981) },
                color2: { value: new THREE.Color(0x34d399) },
                color3: { value: new THREE.Color(0x06ffa5) },
                scanlineIntensity: { value: 0.3 },
                glitchIntensity: { value: 0.1 }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                uniform float time;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    
                    vec3 pos = position;
                    // Add subtle vertex displacement for organic feel
                    pos.z += sin(pos.y * 4.0 + time * 2.0) * 0.02;
                    pos.x += cos(pos.z * 3.0 + time * 1.5) * 0.01;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float opacity;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                uniform float scanlineIntensity;
                uniform float glitchIntensity;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                // Noise functions for organic effects
                float noise(vec2 p) {
                    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
                }
                
                float fbm(vec2 p) {
                    float value = 0.0;
                    float amplitude = 0.5;
                    for (int i = 0; i < 4; i++) {
                        value += amplitude * noise(p);
                        p *= 2.0;
                        amplitude *= 0.5;
                    }
                    return value;
                }
                
                void main() {
                    vec2 p = vUv;
                    
                    // Create holographic interference patterns
                    float scanline = sin(p.y * 50.0 + time * 3.0) * scanlineIntensity;
                    float interference = sin(p.x * 30.0 + time * 2.0) * sin(p.y * 20.0 + time * 1.5) * 0.1;
                    
                    // Add glitch effects
                    float glitch = step(0.95, noise(vec2(time * 0.5))) * glitchIntensity;
                    p.x += glitch * (noise(vec2(time)) - 0.5) * 0.1;
                    
                    // Create energy flow patterns
                    float flow = fbm(p * 3.0 + time * 0.3);
                    
                    // Mix colors based on patterns
                    vec3 color = mix(color1, color2, sin(flow * 3.14159 + time));
                    color = mix(color, color3, scanline + interference);
                    
                    // Add fresnel effect for realistic hologram look
                    vec3 viewDir = normalize(vPosition - cameraPosition);
                    float fresnel = pow(1.0 - dot(vNormal, -viewDir), 2.0);
                    color += fresnel * color3 * 0.5;
                    
                    gl_FragColor = vec4(color, opacity + scanline * 0.2);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
    }

    createBiometricScanMaterial() {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                scanProgress: { value: 0 },
                color: { value: new THREE.Color(0x06ffa5) },
                gridSize: { value: 20.0 },
                pulseIntensity: { value: 1.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                uniform float time;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float scanProgress;
                uniform vec3 color;
                uniform float gridSize;
                uniform float pulseIntensity;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vec2 grid = abs(fract(vUv * gridSize) - 0.5);
                    float line = step(0.4, max(grid.x, grid.y));
                    
                    // Create scanning wave effect
                    float scanLine = smoothstep(0.0, 0.1, scanProgress - vUv.y) * 
                                    smoothstep(0.1, 0.0, scanProgress - vUv.y - 0.1);
                    
                    // Add pulsing effect
                    float pulse = sin(time * 3.0 + vUv.y * 10.0) * pulseIntensity;
                    
                    float alpha = line * (scanLine + pulse * 0.3 + 0.1);
                    vec3 finalColor = color * (1.0 + scanLine * 2.0);
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
    }

    async createCryptoSymbols() {
        const symbolGeometry = new THREE.PlaneGeometry(0.8, 0.8);
        const symbols = [
            { text: 'STRK', color: 0xff6b35, position: { x: -4, y: 2, z: 1 } },
            { text: 'ETH', color: 0x627eea, position: { x: 4, y: -1, z: 2 } },
            { text: '$', color: 0x10b981, position: { x: 0, y: 3, z: -1 } },
            { text: '⚡', color: 0xfbbf24, position: { x: -2, y: -2, z: 1.5 } },
            { text: '🔒', color: 0x34d399, position: { x: 3, y: 1.5, z: -0.5 } }
        ];

        for (const symbol of symbols) {
            // Create canvas texture for symbol
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const context = canvas.getContext('2d');
            
            // Draw symbol
            context.fillStyle = `#${symbol.color.toString(16).padStart(6, '0')}`;
            context.font = 'bold 120px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(symbol.text, 128, 128);
            
            const texture = new THREE.CanvasTexture(canvas);
            
            // Create holographic material for symbol
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    texture: { value: texture },
                    color: { value: new THREE.Color(symbol.color) },
                    opacity: { value: 0.8 }
                },
                vertexShader: `
                    varying vec2 vUv;
                    uniform float time;
                    
                    void main() {
                        vUv = uv;
                        vec3 pos = position;
                        pos.z += sin(time + position.x * 2.0) * 0.1;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform sampler2D texture;
                    uniform vec3 color;
                    uniform float opacity;
                    varying vec2 vUv;
                    
                    void main() {
                        vec4 texColor = texture2D(texture, vUv);
                        vec3 finalColor = color * (1.0 + sin(time * 2.0) * 0.2);
                        float alpha = texColor.r * opacity * (0.8 + sin(time * 1.5) * 0.2);
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });
            
            const symbolMesh = new THREE.Mesh(symbolGeometry, material);
            symbolMesh.position.set(symbol.position.x, symbol.position.y, symbol.position.z);
            symbolMesh.userData = { 
                originalPosition: { ...symbol.position },
                floatOffset: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02
            };
            
            this.scene.add(symbolMesh);
            this.cryptoSymbols.push(symbolMesh);
        }
    }

    async createBiometricUI() {
        const group = new THREE.Group();
        
        // Create face outline with biometric points
        const points = [];
        const pointCount = 32;
        for (let i = 0; i < pointCount; i++) {
            const angle = (i / pointCount) * Math.PI * 2;
            const radius = 1.2 + Math.sin(angle * 3) * 0.1; // Face-like shape
            points.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius * 0.8, // Slightly oval
                0
            ));
        }
        points.push(points[0]); // Close the loop
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = this.createBiometricScanMaterial();
        
        const faceMesh = new THREE.Line(geometry, material);
        group.add(faceMesh);
        
        // Add biometric points
        const pointGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const pointMaterial = new THREE.MeshBasicMaterial({
            color: 0x06ffa5,
            transparent: true,
            opacity: 0.8
        });
        
        const biometricPoints = [
            { x: 0, y: 0.6, z: 0 }, // Forehead
            { x: -0.4, y: 0.2, z: 0 }, // Left eye
            { x: 0.4, y: 0.2, z: 0 }, // Right eye
            { x: 0, y: -0.1, z: 0 }, // Nose
            { x: 0, y: -0.5, z: 0 }, // Mouth
            { x: -0.6, y: -0.2, z: 0 }, // Left cheek
            { x: 0.6, y: -0.2, z: 0 }, // Right cheek
        ];
        
        biometricPoints.forEach((point, index) => {
            const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial.clone());
            pointMesh.position.set(point.x, point.y, point.z);
            pointMesh.userData = { 
                index,
                activationDelay: index * 0.1,
                pulsePhase: Math.random() * Math.PI * 2
            };
            group.add(pointMesh);
        });
        
        group.position.set(-3, 0, 0);
        group.scale.setScalar(0.8);
        
        this.scene.add(group);
        this.biometricUI = group;
    }

    async createEnergyField() {
        const group = new THREE.Group();
        
        // Create energy rings
        for (let i = 0; i < 5; i++) {
            const ringGeometry = new THREE.RingGeometry(1 + i * 0.3, 1.1 + i * 0.3, 32);
            const ringMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x10b981) },
                    opacity: { value: 0.3 - i * 0.05 },
                    ringIndex: { value: i }
                },
                vertexShader: `
                    varying vec2 vUv;
                    uniform float time;
                    uniform float ringIndex;
                    
                    void main() {
                        vUv = uv;
                        vec3 pos = position;
                        pos.z += sin(time + ringIndex * 0.5) * 0.1;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    uniform float opacity;
                    uniform float ringIndex;
                    varying vec2 vUv;
                    
                    void main() {
                        vec2 center = vec2(0.5);
                        float dist = distance(vUv, center);
                        float pulse = sin(time * 2.0 + ringIndex * 0.5) * 0.5 + 0.5;
                        float alpha = opacity * pulse * smoothstep(0.45, 0.35, abs(dist - 0.4));
                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.userData = { 
                rotationSpeed: 0.01 + i * 0.005,
                pulsePhase: i * Math.PI * 0.4
            };
            group.add(ring);
        }
        
        group.position.set(0, 0, -2);
        this.scene.add(group);
        this.energyField = group;
    }

    async createPhoneModel() {
        const phoneGroup = new THREE.Group();
        
        // Enhanced phone body with premium materials
        const phoneGeometry = new THREE.BoxGeometry(2, 4, 0.3);
        const phoneMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x0a0a0a,
            metalness: 0.9,
            roughness: 0.1,
            clearcoat: 1,
            clearcoatRoughness: 0.05,
            reflectivity: 1,
            ior: 1.5
        });
        
        const phoneBody = new THREE.Mesh(phoneGeometry, phoneMaterial);
        phoneBody.castShadow = true;
        phoneBody.receiveShadow = true;
        phoneGroup.add(phoneBody);
        
        // Holographic screen with UI animation
        const screenGeometry = new THREE.PlaneGeometry(1.8, 3.2);
        const screenMaterial = this.createHolographicMaterial();
        
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = 0.16;
        phoneGroup.add(screen);
        
        // Animated Face ID indicator with pulsing effect
        const faceIDGeometry = new THREE.CircleGeometry(0.08, 32);
        const faceIDMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x06ffa5) },
                pulseIntensity: { value: 1.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                uniform float time;
                
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    float pulse = sin(time * 4.0) * 0.02;
                    pos *= (1.0 + pulse);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                uniform float pulseIntensity;
                varying vec2 vUv;
                
                void main() {
                    vec2 center = vec2(0.5);
                    float dist = distance(vUv, center);
                    float pulse = sin(time * 4.0) * pulseIntensity;
                    float ring = smoothstep(0.4, 0.35, abs(dist - 0.3 - pulse * 0.1));
                    float innerGlow = 1.0 - smoothstep(0.0, 0.3, dist);
                    float alpha = ring + innerGlow * 0.5;
                    gl_FragColor = vec4(color, alpha * 0.8);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const faceIDIndicator = new THREE.Mesh(faceIDGeometry, faceIDMaterial);
        faceIDIndicator.position.set(0, 1.4, 0.17);
        phoneGroup.add(faceIDIndicator);
        
        // Add UI elements on screen
        this.createPhoneUI(phoneGroup);
        
        phoneGroup.position.set(2.5, 0, 0);
        phoneGroup.rotation.y = -0.2; // Slight angle for better visibility
        this.scene.add(phoneGroup);
        this.phoneModel = phoneGroup;
    }

    createPhoneUI(phoneGroup) {
        // Create floating UI elements
        const uiElements = [
            { text: '@username', y: 0.8, size: 0.15 },
            { text: 'Balance: $1,247', y: 0.4, size: 0.12 },
            { text: 'Send Money', y: -0.2, size: 0.14, isButton: true },
            { text: 'Face ID Active', y: -0.8, size: 0.1 }
        ];
        
        uiElements.forEach((element, index) => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 128;
            const context = canvas.getContext('2d');
            
            // Draw text
            context.fillStyle = element.isButton ? '#10b981' : '#ffffff';
            context.font = `${element.size * 200}px Arial`;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(element.text, 256, 64);
            
            if (element.isButton) {
                // Add button border
                context.strokeStyle = '#06ffa5';
                context.lineWidth = 4;
                context.strokeRect(20, 20, 472, 88);
            }
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                opacity: 0.8
            });
            
            const geometry = new THREE.PlaneGeometry(1.4, 0.35);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, element.y, 0.17);
            mesh.userData = { 
                animationDelay: index * 0.2,
                isButton: element.isButton
            };
            
            phoneGroup.add(mesh);
        });
    }

    createFaceScanEffect() {
        const scanGroup = new THREE.Group();
        
        // Enhanced scanning lines with shader effects
        const scanMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                scanProgress: { value: 0 },
                color: { value: new THREE.Color(0x06ffa5) },
                intensity: { value: 1.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                uniform float time;
                uniform float scanProgress;
                
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    // Add scan wave distortion
                    pos.z += sin(pos.y * 10.0 + time * 5.0) * 0.02;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float scanProgress;
                uniform vec3 color;
                uniform float intensity;
                varying vec2 vUv;
                
                void main() {
                    // Create scanning wave effect
                    float wave = sin(vUv.y * 20.0 + time * 8.0) * 0.5 + 0.5;
                    float scanLine = smoothstep(0.9, 1.0, wave);
                    
                    // Add vertical scanning lines
                    float lines = step(0.95, sin(vUv.y * 100.0 + time * 20.0));
                    
                    float alpha = (scanLine + lines * 0.5) * intensity;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        // Create multiple scanning planes
        for (let i = 0; i < 8; i++) {
            const geometry = new THREE.PlaneGeometry(2, 0.05);
            const scanLine = new THREE.Mesh(geometry, scanMaterial.clone());
            scanLine.position.y = -1.5 + i * 0.4;
            scanLine.userData = { 
                scanDelay: i * 0.1,
                originalY: -1.5 + i * 0.4
            };
            scanGroup.add(scanLine);
        }
        
        // Enhanced face outline with holographic effect
        const faceGeometry = new THREE.RingGeometry(0.9, 1.1, 64);
        const faceMaterial = this.createHolographicMaterial();
        
        const faceOutline = new THREE.Mesh(faceGeometry, faceMaterial);
        scanGroup.add(faceOutline);
        
        // Add biometric detection points
        this.addBiometricPoints(scanGroup);
        
        scanGroup.position.set(-3, 0, 0);
        scanGroup.scale.setScalar(1.2);
        this.scene.add(scanGroup);
        this.faceScanEffect = scanGroup;
    }

    addBiometricPoints(parent) {
        const pointPositions = [
            { x: 0, y: 0.8, name: 'forehead' },
            { x: -0.5, y: 0.3, name: 'left_eye' },
            { x: 0.5, y: 0.3, name: 'right_eye' },
            { x: 0, y: 0, name: 'nose' },
            { x: -0.3, y: -0.3, name: 'left_mouth' },
            { x: 0.3, y: -0.3, name: 'right_mouth' },
            { x: 0, y: -0.6, name: 'chin' }
        ];
        
        pointPositions.forEach((point, index) => {
            const geometry = new THREE.SphereGeometry(0.03, 16, 16);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x06ffa5) },
                    detected: { value: 0 }
                },
                vertexShader: `
                    varying vec3 vPosition;
                    uniform float time;
                    
                    void main() {
                        vPosition = position;
                        vec3 pos = position;
                        float pulse = sin(time * 6.0) * 0.1;
                        pos *= (1.0 + pulse);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    uniform float detected;
                    varying vec3 vPosition;
                    
                    void main() {
                        float intensity = 1.0 + sin(time * 4.0) * 0.3;
                        vec3 finalColor = color * intensity;
                        float alpha = 0.8 + detected * 0.2;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });
            
            const pointMesh = new THREE.Mesh(geometry, material);
            pointMesh.position.set(point.x, point.y, 0.05);
            pointMesh.userData = {
                name: point.name,
                detectionDelay: index * 0.3,
                detected: false
            };
            
            parent.add(pointMesh);
        });
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
        // Enhanced mouse movement with smooth interpolation
        window.addEventListener('mousemove', (event) => {
            this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            // Trigger face scan on mouse hover over scan area
            const rect = this.container.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            
            if (mouseX < rect.width * 0.3 && mouseY < rect.height * 0.7) {
                this.triggerFaceScanAnimation();
            }
        });
        
        // Enhanced touch gestures
        window.addEventListener('touchstart', (event) => {
            if (event.touches.length > 0) {
                const touch = event.touches[0];
                this.touchStart.x = touch.clientX;
                this.touchStart.y = touch.clientY;
                this.isTouch = true;
            }
        }, { passive: true });
        
        window.addEventListener('touchmove', (event) => {
            if (event.touches.length > 0) {
                const touch = event.touches[0];
                this.touchCurrent.x = touch.clientX;
                this.touchCurrent.y = touch.clientY;
                
                this.targetMouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
                this.targetMouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
                
                // Detect swipe gestures
                const deltaX = this.touchCurrent.x - this.touchStart.x;
                const deltaY = this.touchCurrent.y - this.touchStart.y;
                
                if (Math.abs(deltaX) > 100 || Math.abs(deltaY) > 100) {
                    this.handleSwipeGesture(deltaX, deltaY);
                }
            }
        }, { passive: true });
        
        window.addEventListener('touchend', () => {
            this.isTouch = false;
        }, { passive: true });
        
        // Pinch to zoom gesture
        window.addEventListener('wheel', (event) => {
            if (event.ctrlKey) {
                event.preventDefault();
                const zoomDelta = event.deltaY * -0.01;
                this.camera.position.z = Math.max(5, Math.min(15, this.camera.position.z + zoomDelta));
            }
        }, { passive: false });
        
        // Enhanced scroll-based interactions
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const scrollProgress = Math.min(scrollY / maxScroll, 1);
            
            // Update camera and scene based on scroll
            if (this.camera) {
                this.camera.position.y = scrollProgress * -3;
                this.camera.lookAt(0, scrollProgress * -1.5, 0);
            }
            
            // Animate crypto symbols based on scroll
            this.cryptoSymbols.forEach((symbol, index) => {
                const offset = index * 0.1;
                symbol.rotation.z = scrollProgress * Math.PI * 2 + offset;
                symbol.position.y = symbol.userData.originalPosition.y + Math.sin(scrollProgress * Math.PI + offset) * 2;
            });
        });
        
        // Keyboard shortcuts for easter eggs
        window.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                this.triggerEasterEgg('space');
            } else if (event.code === 'KeyF') {
                this.triggerFaceScanAnimation();
            } else if (event.code === 'KeyV') {
                this.setupVoiceActivation();
            }
        });
        
        // Performance monitoring
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Visibility change optimization
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            if (this.isVisible) {
                this.resumeAnimations();
            } else {
                this.pauseAnimations();
            }
        });
        
        // Device orientation for mobile
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (event) => {
                if (this.isMobile) {
                    const tiltX = (event.gamma || 0) / 90; // -1 to 1
                    const tiltY = (event.beta || 0) / 90;  // -1 to 1
                    
                    this.targetMouse.x = Math.max(-1, Math.min(1, tiltX));
                    this.targetMouse.y = Math.max(-1, Math.min(1, -tiltY));
                }
            });
        }
    }

    handleSwipeGesture(deltaX, deltaY) {
        const threshold = 100;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > threshold) {
                this.triggerEasterEgg('swipe_right');
            } else if (deltaX < -threshold) {
                this.triggerEasterEgg('swipe_left');
            }
        } else {
            // Vertical swipe
            if (deltaY > threshold) {
                this.triggerEasterEgg('swipe_down');
            } else if (deltaY < -threshold) {
                this.triggerEasterEgg('swipe_up');
            }
        }
    }

    setupVoiceActivation() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.log('Voice recognition not supported');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
            console.log('🎤 Voice activation started');
            this.showVoiceIndicator(true);
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            console.log('🗣️ Voice command:', transcript);
            
            if (transcript.includes('face pay') || transcript.includes('facepay')) {
                this.triggerFaceScanAnimation();
                this.voiceActivated = true;
                
                // Play success sound
                this.playSound('success');
                
                // Show visual feedback
                this.showVoiceSuccess();
            } else if (transcript.includes('crypto') || transcript.includes('bitcoin')) {
                this.animateCryptoSymbols();
            } else if (transcript.includes('scan') || transcript.includes('biometric')) {
                this.startBiometricScan();
            }
        };
        
        recognition.onerror = (event) => {
            console.log('Voice recognition error:', event.error);
            this.showVoiceIndicator(false);
        };
        
        recognition.onend = () => {
            this.showVoiceIndicator(false);
        };
        
        // Auto-start voice recognition after user interaction
        document.addEventListener('click', () => {
            if (!this.voiceActivated) {
                try {
                    recognition.start();
                } catch (e) {
                    console.log('Voice recognition already active');
                }
            }
        }, { once: true });
    }

    showVoiceIndicator(active) {
        // Create visual indicator for voice activation
        let indicator = document.getElementById('voice-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'voice-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #10b981, #34d399);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                z-index: 1000;
                transition: all 0.3s ease;
                opacity: 0;
                transform: scale(0.8);
            `;
            indicator.innerHTML = '🎤';
            document.body.appendChild(indicator);
        }
        
        if (active) {
            indicator.style.opacity = '1';
            indicator.style.transform = 'scale(1)';
            indicator.style.animation = 'pulse 1s infinite';
        } else {
            indicator.style.opacity = '0';
            indicator.style.transform = 'scale(0.8)';
            indicator.style.animation = 'none';
        }
    }

    showVoiceSuccess() {
        // Create success animation
        const success = document.createElement('div');
        success.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            z-index: 1000;
            pointer-events: none;
        `;
        success.innerHTML = '✅';
        document.body.appendChild(success);
        
        // Animate success indicator
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(success, 
                { scale: 0, rotation: -180 },
                { 
                    scale: 1.5, 
                    rotation: 0, 
                    duration: 0.6, 
                    ease: 'back.out(1.7)',
                    onComplete: () => {
                        gsap.to(success, {
                            opacity: 0,
                            scale: 2,
                            duration: 0.5,
                            delay: 1,
                            onComplete: () => success.remove()
                        });
                    }
                }
            );
        } else {
            setTimeout(() => success.remove(), 2000);
        }
    }

    playSound(type) {
        if (typeof Audio === 'undefined') return;
        
        const sounds = {
            success: 'data:audio/wav;base64,UklGRvIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU4AAAA=',
            scan: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDWi3fHWdyoElPu3G',
        };
        
        try {
            const audio = new Audio(sounds[type] || sounds.success);
            audio.volume = 0.3;
            audio.play().catch(e => console.log('Audio play failed'));
        } catch (e) {
            console.log('Audio not supported');
        }
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
        
        // Smooth mouse interpolation for better UX
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.1;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.1;
        
        // Update all shader uniforms
        this.updateShaderUniforms(elapsedTime);
        
        // Enhanced phone model animations
        if (this.phoneModel) {
            // Parallax effect based on mouse position
            this.phoneModel.rotation.x += (this.mouse.y * 0.15 - this.phoneModel.rotation.x) * 0.08;
            this.phoneModel.rotation.y += (this.mouse.x * 0.1 - this.phoneModel.rotation.y - 0.2) * 0.08;
            
            // Floating animation
            this.phoneModel.position.y += Math.sin(elapsedTime * 0.8) * 0.02;
            
            // Update Face ID indicator
            const faceID = this.phoneModel.children[2];
            if (faceID && faceID.material.uniforms) {
                faceID.material.uniforms.time.value = elapsedTime;
                faceID.material.uniforms.pulseIntensity.value = 1.0 + Math.sin(elapsedTime * 2) * 0.3;
            }
        }
        
        // Enhanced face scan animations
        if (this.faceScanEffect) {
            this.animateFaceScan(elapsedTime);
        }
        
        // Animate crypto symbols with physics
        this.animateCryptoSymbols(elapsedTime);
        
        // Biometric UI animations
        if (this.biometricUI) {
            this.animateBiometricUI(elapsedTime);
        }
        
        // Energy field animations
        if (this.energyField) {
            this.animateEnergyField(elapsedTime);
        }
        
        // Particle field physics
        if (this.particleField) {
            this.animateParticleField(elapsedTime);
        }
        
        // Dynamic lighting system
        this.updateLighting(elapsedTime);
        
        // Cinematic camera movement
        this.updateCamera(elapsedTime);
        
        // Performance monitoring and optimization
        this.monitorPerformance(elapsedTime);
        
        // Render with post-processing
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
        
        requestAnimationFrame(() => this.animate());
    }

    updateShaderUniforms(elapsedTime) {
        // Update all materials with time uniform
        this.scene.traverse((object) => {
            if (object.material && object.material.uniforms && object.material.uniforms.time) {
                object.material.uniforms.time.value = elapsedTime;
            }
        });
    }

    animateFaceScan(elapsedTime) {
        // Animate scanning lines
        this.faceScanEffect.children.forEach((child, index) => {
            if (child.material && child.material.uniforms) {
                // Update scan progress for wave effect
                const progress = (Math.sin(elapsedTime * 2 + index * 0.3) + 1) * 0.5;
                child.material.uniforms.scanProgress.value = progress;
                child.material.uniforms.intensity.value = 0.8 + Math.sin(elapsedTime * 3 + index * 0.5) * 0.4;
            }
            
            // Animate biometric points
            if (child.userData && child.userData.name) {
                const pointMaterial = child.material;
                if (pointMaterial && pointMaterial.uniforms) {
                    pointMaterial.uniforms.detected.value = Math.sin(elapsedTime * 2 + child.userData.detectionDelay) > 0.5 ? 1 : 0;
                }
            }
        });
        
        // Global face scan rotation
        this.faceScanEffect.rotation.z = Math.sin(elapsedTime * 0.5) * 0.05;
    }

    animateCryptoSymbols(elapsedTime) {
        this.cryptoSymbols.forEach((symbol, index) => {
            const userData = symbol.userData;
            
            // Floating motion
            symbol.position.y = userData.originalPosition.y + Math.sin(elapsedTime + userData.floatOffset) * 0.3;
            symbol.position.x = userData.originalPosition.x + Math.cos(elapsedTime * 0.7 + userData.floatOffset) * 0.2;
            
            // Rotation animation
            symbol.rotation.z += userData.rotationSpeed;
            
            // Scale pulsing based on mouse proximity
            const distance = Math.sqrt(
                Math.pow(symbol.position.x - this.mouse.x * 3, 2) +
                Math.pow(symbol.position.y - this.mouse.y * 3, 2)
            );
            const scale = 1 + Math.max(0, (1 - distance / 3) * 0.3);
            symbol.scale.setScalar(scale);
            
            // Update shader uniforms
            if (symbol.material && symbol.material.uniforms) {
                symbol.material.uniforms.opacity.value = 0.8 + Math.sin(elapsedTime * 1.5 + index) * 0.2;
            }
        });
    }

    animateBiometricUI(elapsedTime) {
        // Rotate the entire biometric UI slowly
        this.biometricUI.rotation.z = elapsedTime * 0.1;
        
        // Animate individual biometric points
        this.biometricUI.children.forEach((child) => {
            if (child.userData && child.userData.pulsePhase !== undefined) {
                const pulse = Math.sin(elapsedTime * 3 + child.userData.pulsePhase) * 0.5 + 0.5;
                child.scale.setScalar(0.8 + pulse * 0.4);
                
                if (child.material) {
                    child.material.opacity = 0.6 + pulse * 0.4;
                }
            }
        });
    }

    animateEnergyField(elapsedTime) {
        this.energyField.children.forEach((ring, index) => {
            const userData = ring.userData;
            
            // Rotate each ring at different speeds
            ring.rotation.z += userData.rotationSpeed;
            
            // Pulsing effect
            const pulse = Math.sin(elapsedTime * 1.5 + userData.pulsePhase) * 0.5 + 0.5;
            ring.scale.setScalar(1 + pulse * 0.1);
            
            // Update shader uniforms for energy rings
            if (ring.material && ring.material.uniforms) {
                ring.material.uniforms.opacity.value = (0.3 - index * 0.05) * (0.8 + pulse * 0.4);
            }
        });
        
        // Move energy field based on mouse interaction
        this.energyField.position.x = this.mouse.x * 0.5;
        this.energyField.position.y = this.mouse.y * 0.3;
    }

    animateParticleField(elapsedTime) {
        // Rotate particle field
        this.particleField.rotation.y = elapsedTime * 0.05;
        this.particleField.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1;
        
        // Update particle positions for organic movement
        const positions = this.particleField.geometry.attributes.position.array;
        const particleCount = positions.length / 3;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Add wave motion to particles
            positions[i3 + 1] += Math.sin(elapsedTime + i * 0.1) * 0.001;
            positions[i3 + 2] += Math.cos(elapsedTime * 0.5 + i * 0.2) * 0.001;
        }
        
        this.particleField.geometry.attributes.position.needsUpdate = true;
    }

    updateLighting(elapsedTime) {
        if (!this.lightSystem) return;
        
        // Dynamic accent light movement
        this.lightSystem.accent1.intensity = 1.8 + Math.sin(elapsedTime * 1.8) * 0.6;
        this.lightSystem.accent2.intensity = 1.2 + Math.cos(elapsedTime * 2.2) * 0.4;
        
        // Cinematic light positioning
        this.lightSystem.accent1.position.x = Math.sin(elapsedTime * 0.8) * 4;
        this.lightSystem.accent1.position.y = Math.cos(elapsedTime * 0.6) * 2;
        
        this.lightSystem.accent2.position.x = Math.cos(elapsedTime * 0.9) * 3;
        this.lightSystem.accent2.position.z = Math.sin(elapsedTime * 0.4) * 2;
        
        // Mouse-reactive lighting
        const mouseIntensity = Math.sqrt(this.mouse.x * this.mouse.x + this.mouse.y * this.mouse.y);
        this.lightSystem.directional.intensity = 1 + mouseIntensity * 0.3;
    }

    updateCamera(elapsedTime) {
        // Smooth camera movement with parallax
        const targetX = this.mouse.x * 1.2;
        const targetY = this.mouse.y * 0.8;
        
        this.camera.position.x += (targetX - this.camera.position.x) * 0.05;
        this.camera.position.y += (targetY - this.camera.position.y) * 0.05;
        
        // Subtle camera floating motion
        this.camera.position.z = 10 + Math.sin(elapsedTime * 0.5) * 0.2;
        
        // Dynamic look-at point
        const lookAtX = this.mouse.x * 0.5;
        const lookAtY = this.mouse.y * 0.3;
        this.camera.lookAt(lookAtX, lookAtY, 0);
    }

    monitorPerformance(elapsedTime) {
        this.frameCount++;
        
        if (elapsedTime - this.lastFPSCheck > 1) {
            this.currentFPS = this.frameCount;
            this.frameCount = 0;
            this.lastFPSCheck = elapsedTime;
            
            // Update FPS counter in UI
            const fpsElement = document.getElementById('fps-counter');
            if (fpsElement) {
                fpsElement.textContent = this.currentFPS;
                
                // Color-code FPS
                if (this.currentFPS >= 55) {
                    fpsElement.className = 'text-emerald-400';
                } else if (this.currentFPS >= 35) {
                    fpsElement.className = 'text-yellow-400';
                } else {
                    fpsElement.className = 'text-red-400';
                }
            }
            
            // Dynamic quality adjustment
            this.adjustQuality();
            
            console.log(`📊 FPS: ${this.currentFPS}, Quality: ${this.qualityLevel}`);
        }
    }

    adjustQuality() {
        const lowFPSThreshold = this.isMobile ? 25 : 30;
        const highFPSThreshold = this.isMobile ? 45 : 55;
        
        if (this.currentFPS < lowFPSThreshold && this.qualityLevel !== 'low') {
            this.setQualityLevel('low');
        } else if (this.currentFPS > highFPSThreshold && this.qualityLevel !== 'high') {
            this.setQualityLevel('high');
        } else if (this.currentFPS > 35 && this.currentFPS <= highFPSThreshold && this.qualityLevel !== 'medium') {
            this.setQualityLevel('medium');
        }
    }

    setQualityLevel(level) {
        this.qualityLevel = level;
        
        switch (level) {
            case 'low':
                this.renderer.setPixelRatio(1);
                if (this.particleField) this.particleField.visible = false;
                if (this.energyField) this.energyField.visible = false;
                this.cryptoSymbols.forEach(symbol => symbol.visible = false);
                break;
                
            case 'medium':
                this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
                if (this.particleField) this.particleField.visible = true;
                if (this.energyField) this.energyField.visible = false;
                this.cryptoSymbols.forEach(symbol => symbol.visible = true);
                break;
                
            case 'high':
                this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
                if (this.particleField) this.particleField.visible = true;
                if (this.energyField) this.energyField.visible = true;
                this.cryptoSymbols.forEach(symbol => symbol.visible = true);
                break;
        }
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

    // Enhanced API methods for public use
    triggerFaceScanAnimation() {
        if (!this.faceScanEffect) return;
        
        console.log('🔍 Face scan triggered!');
        this.playSound('scan');
        
        // Animate face scan effect with enhanced sequence
        if (typeof gsap !== 'undefined') {
            const timeline = gsap.timeline();
            
            timeline
                .to(this.faceScanEffect.scale, {
                    duration: 0.6,
                    x: 1.3,
                    y: 1.3,
                    z: 1.3,
                    ease: 'back.out(1.7)'
                })
                .to(this.faceScanEffect.children[0].material.uniforms.intensity, {
                    duration: 0.3,
                    value: 2.0,
                    ease: 'power2.out'
                }, 0)
                .to(this.faceScanEffect.scale, {
                    duration: 0.4,
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: 'power2.in'
                }, '-=0.1')
                .to(this.faceScanEffect.rotation, {
                    duration: 1.2,
                    z: Math.PI * 2,
                    ease: 'power2.inOut'
                }, 0)
                .call(() => {
                    // Trigger biometric point activation sequence
                    this.startBiometricScan();
                });
        }
        
        // Flash green success color
        setTimeout(() => {
            if (this.lightSystem) {
                this.lightSystem.accent1.color.setHex(0x06ffa5);
                this.lightSystem.accent2.color.setHex(0x10b981);
                
                setTimeout(() => {
                    this.lightSystem.accent1.color.setHex(0x10b981);
                    this.lightSystem.accent2.color.setHex(0x34d399);
                }, 1000);
            }
        }, 300);
    }

    startBiometricScan() {
        if (!this.biometricUI) return;
        
        console.log('🧬 Biometric scan started');
        
        // Sequentially activate biometric points
        this.biometricUI.children.forEach((point, index) => {
            if (point.userData && point.userData.name) {
                setTimeout(() => {
                    if (point.material && point.material.uniforms) {
                        point.material.uniforms.detected.value = 1;
                        
                        // Visual feedback for detection
                        if (typeof gsap !== 'undefined') {
                            gsap.fromTo(point.scale, 
                                { x: 1, y: 1, z: 1 },
                                { x: 1.5, y: 1.5, z: 1.5, duration: 0.3, ease: 'back.out(2)', yoyo: true, repeat: 1 }
                            );
                        }
                        
                        console.log(`✅ ${point.userData.name} detected`);
                    }
                }, index * 200);
            }
        });
        
        // Complete scan after all points detected
        setTimeout(() => {
            this.showVoiceSuccess();
            console.log('🎉 Biometric scan complete - User authenticated!');
        }, this.biometricUI.children.length * 200 + 500);
    }

    animateCryptoSymbols() {
        if (!this.cryptoSymbols.length) return;
        
        console.log('💰 Crypto symbols animated');
        
        this.cryptoSymbols.forEach((symbol, index) => {
            if (typeof gsap !== 'undefined') {
                gsap.timeline()
                    .to(symbol.scale, {
                        duration: 0.8,
                        x: 1.5,
                        y: 1.5,
                        z: 1.5,
                        ease: 'back.out(1.7)',
                        delay: index * 0.1
                    })
                    .to(symbol.rotation, {
                        duration: 1,
                        z: symbol.rotation.z + Math.PI * 4,
                        ease: 'power2.inOut'
                    }, 0)
                    .to(symbol.scale, {
                        duration: 0.6,
                        x: 1,
                        y: 1,
                        z: 1,
                        ease: 'power2.in'
                    }, '-=0.2');
            }
            
            // Update material opacity for flash effect
            if (symbol.material && symbol.material.uniforms) {
                const originalOpacity = symbol.material.uniforms.opacity.value;
                symbol.material.uniforms.opacity.value = 1.0;
                
                setTimeout(() => {
                    symbol.material.uniforms.opacity.value = originalOpacity;
                }, 800);
            }
        });
    }

    triggerEasterEgg(type) {
        console.log(`🥚 Easter egg triggered: ${type}`);
        
        const effects = {
            space: () => {
                // Matrix digital rain effect
                this.createMatrixRain();
                this.playSound('success');
            },
            swipe_right: () => {
                // Crypto symbols fly right
                this.cryptoSymbols.forEach((symbol, index) => {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(symbol.position, {
                            x: symbol.position.x + 10,
                            duration: 2,
                            ease: 'power2.out',
                            delay: index * 0.1,
                            onComplete: () => {
                                symbol.position.x = symbol.userData.originalPosition.x - 10;
                                gsap.to(symbol.position, {
                                    x: symbol.userData.originalPosition.x,
                                    duration: 1,
                                    ease: 'power2.out'
                                });
                            }
                        });
                    }
                });
            },
            swipe_left: () => {
                // Holographic glitch effect
                this.triggerGlitchEffect();
            },
            swipe_up: () => {
                // All elements float upward
                this.triggerFloatEffect();
            },
            swipe_down: () => {
                // Energy pulse explosion
                this.triggerEnergyPulse();
            }
        };
        
        if (effects[type]) {
            effects[type]();
        }
    }

    createMatrixRain() {
        const rainGroup = new THREE.Group();
        
        for (let i = 0; i < 100; i++) {
            const geometry = new THREE.PlaneGeometry(0.1, 0.3);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: Math.random() * 0.8 + 0.2
            });
            
            const rain = new THREE.Mesh(geometry, material);
            rain.position.set(
                (Math.random() - 0.5) * 20,
                Math.random() * 20 + 10,
                (Math.random() - 0.5) * 10
            );
            
            rainGroup.add(rain);
            
            // Animate falling
            if (typeof gsap !== 'undefined') {
                gsap.to(rain.position, {
                    y: -20,
                    duration: Math.random() * 3 + 2,
                    ease: 'none',
                    repeat: -1,
                    delay: Math.random() * 2
                });
                
                gsap.to(rain.material, {
                    opacity: 0,
                    duration: 0.5,
                    delay: 5,
                    onComplete: () => rain.remove()
                });
            }
        }
        
        this.scene.add(rainGroup);
        
        // Remove after 6 seconds
        setTimeout(() => {
            this.scene.remove(rainGroup);
        }, 6000);
    }

    triggerGlitchEffect() {
        // Temporarily distort all shader materials
        this.scene.traverse((object) => {
            if (object.material && object.material.uniforms && object.material.uniforms.glitchIntensity) {
                const originalIntensity = object.material.uniforms.glitchIntensity.value;
                object.material.uniforms.glitchIntensity.value = 1.0;
                
                setTimeout(() => {
                    object.material.uniforms.glitchIntensity.value = originalIntensity;
                }, 1000);
            }
        });
        
        // Camera shake
        if (typeof gsap !== 'undefined') {
            const originalPosition = { ...this.camera.position };
            
            gsap.timeline()
                .to(this.camera.position, { x: originalPosition.x + 0.1, duration: 0.05, ease: 'none' })
                .to(this.camera.position, { x: originalPosition.x - 0.1, duration: 0.05, ease: 'none' })
                .to(this.camera.position, { y: originalPosition.y + 0.1, duration: 0.05, ease: 'none' })
                .to(this.camera.position, { y: originalPosition.y - 0.1, duration: 0.05, ease: 'none' })
                .to(this.camera.position, { 
                    x: originalPosition.x, 
                    y: originalPosition.y, 
                    duration: 0.1, 
                    ease: 'power2.out' 
                });
        }
    }

    triggerFloatEffect() {
        const objects = [this.phoneModel, this.faceScanEffect, this.hologramCard, ...this.cryptoSymbols];
        
        objects.forEach((obj, index) => {
            if (obj && typeof gsap !== 'undefined') {
                const originalY = obj.position.y;
                
                gsap.timeline()
                    .to(obj.position, {
                        y: originalY + 3,
                        duration: 1.5,
                        ease: 'power2.out',
                        delay: index * 0.1
                    })
                    .to(obj.position, {
                        y: originalY,
                        duration: 1.5,
                        ease: 'bounce.out'
                    });
            }
        });
    }

    triggerEnergyPulse() {
        // Create expanding energy ring
        const ringGeometry = new THREE.RingGeometry(0.1, 0.2, 32);
        const ringMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x06ffa5) }
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
                uniform vec3 color;
                varying vec2 vUv;
                
                void main() {
                    vec2 center = vec2(0.5);
                    float dist = distance(vUv, center);
                    float pulse = sin(time * 10.0) * 0.5 + 0.5;
                    float alpha = (1.0 - dist) * pulse;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const pulseRing = new THREE.Mesh(ringGeometry, ringMaterial);
        this.scene.add(pulseRing);
        
        // Animate expansion
        if (typeof gsap !== 'undefined') {
            gsap.timeline()
                .to(pulseRing.scale, {
                    x: 20,
                    y: 20,
                    z: 20,
                    duration: 2,
                    ease: 'power2.out'
                })
                .to(ringMaterial.uniforms.time, {
                    value: 10,
                    duration: 2,
                    ease: 'none'
                }, 0)
                .to(ringMaterial, {
                    opacity: 0,
                    duration: 0.5,
                    delay: 1.5,
                    onComplete: () => {
                        this.scene.remove(pulseRing);
                        pulseRing.geometry.dispose();
                        pulseRing.material.dispose();
                    }
                });
        }
        
        // Shake all objects
        [this.phoneModel, this.faceScanEffect, this.hologramCard].forEach(obj => {
            if (obj && typeof gsap !== 'undefined') {
                const originalRotation = { ...obj.rotation };
                
                gsap.timeline()
                    .to(obj.rotation, { z: originalRotation.z + 0.1, duration: 0.1, ease: 'none' })
                    .to(obj.rotation, { z: originalRotation.z - 0.1, duration: 0.1, ease: 'none' })
                    .to(obj.rotation, { z: originalRotation.z, duration: 0.2, ease: 'power2.out' });
            }
        });
    }

    playEntranceAnimation() {
        // Hide loading screen
        const loadingScreen = this.container.querySelector('.absolute.inset-0.flex');
        if (loadingScreen) {
            if (typeof gsap !== 'undefined') {
                gsap.to(loadingScreen, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        loadingScreen.style.display = 'none';
                    }
                });
            } else {
                loadingScreen.style.display = 'none';
            }
        }
        
        // Animate 3D elements entrance
        if (typeof gsap !== 'undefined') {
            const timeline = gsap.timeline();
            
            // Animate all major elements in sequence
            timeline
                .fromTo(this.phoneModel.scale, 
                    { x: 0, y: 0, z: 0 },
                    { x: 1, y: 1, z: 1, duration: 1, ease: 'back.out(1.7)' }
                )
                .fromTo(this.faceScanEffect.scale,
                    { x: 0, y: 0, z: 0 },
                    { x: 1.2, y: 1.2, z: 1.2, duration: 0.8, ease: 'back.out(1.7)' },
                    '-=0.5'
                )
                .fromTo(this.cryptoSymbols.map(s => s.scale),
                    { x: 0, y: 0, z: 0 },
                    { x: 1, y: 1, z: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.1 },
                    '-=0.3'
                );
        }
        
        console.log('🎬 Entrance animation complete - 3D scene ready!');
    }

    pauseAnimations() {
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.pause();
        }
    }

    resumeAnimations() {
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.resume();
        }
    }

    fallbackMode() {
        // Create simple 2D fallback
        const fallback = document.createElement('div');
        fallback.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(ellipse at center, rgba(16, 185, 129, 0.1) 0%, rgba(0, 0, 0, 0.8) 70%);
            pointer-events: none;
            z-index: 0;
        `;
        
        const pulse = document.createElement('div');
        pulse.style.cssText = `
            position: absolute;
            top: 50%;
            left: 30%;
            width: 100px;
            height: 100px;
            border: 2px solid #10b981;
            border-radius: 50%;
            animation: pulse 2s infinite;
            transform: translate(-50%, -50%);
        `;
        
        fallback.appendChild(pulse);
        this.container.appendChild(fallback);
        
        console.log('🔧 Fallback mode activated');
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
    // Check if 3D demo container exists
    const demoContainer = document.getElementById('3d-demo-viewport');
    if (!demoContainer) {
        console.log('3D demo container not found, skipping 3D initialization');
        return;
    }
    
    // Check if WebGL is supported
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl) {
        // Initialize with demo viewport container
        window.facePay3DHero = new FacePay3DHero('3d-demo-viewport');
        console.log('🎨 Cinematic 3D Hero Scene initialized in demo viewport');
        
        // Add global keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.code === 'KeyF' && !event.ctrlKey && !event.metaKey) {
                event.preventDefault();
                window.facePay3DHero?.triggerFaceScanAnimation();
            } else if (event.code === 'KeyC' && !event.ctrlKey && !event.metaKey) {
                event.preventDefault();
                window.facePay3DHero?.animateCryptoSymbols();
            } else if (event.code === 'Space' && !event.ctrlKey && !event.metaKey) {
                event.preventDefault();
                window.facePay3DHero?.triggerEasterEgg('space');
            }
        });
        
        console.log('🎮 Global keyboard shortcuts activated:');
        console.log('  F - Trigger face scan');
        console.log('  C - Animate crypto symbols');
        console.log('  Space - Matrix rain effect');
        
    } else {
        console.warn('WebGL not supported, showing fallback video');
        
        // Show fallback video instead
        const fallbackVideo = document.getElementById('fallback-video');
        const demoViewport = document.getElementById('3d-demo-viewport').parentElement;
        
        if (fallbackVideo && demoViewport) {
            demoViewport.style.display = 'none';
            fallbackVideo.classList.remove('hidden');
            
            // Auto-play fallback video
            const video = fallbackVideo.querySelector('video');
            if (video) {
                video.play().catch(e => console.log('Video autoplay prevented'));
            }
        }
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FacePay3DHero;
}