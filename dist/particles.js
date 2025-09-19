/**
 * FACEPAY ELEGANTE PARTICLE SYSTEM V2.0
 * Advanced WebGL particle engine with crypto symbols, connections & depth layers
 * Apple-level visual effects with hardware acceleration + Performance adaptive
 * Features: 👤⚡💸@ symbols, connection lines, mouse interaction, parallax
 */

class FacePayParticleSystem {
    constructor(options = {}) {
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.particles = [];
        this.connections = [];
        this.layers = [];
        this.particleBuffer = null;
        this.colorBuffer = null;
        this.isRunning = false;
        this.frameCount = 0;
        this.lastFrameTime = 0;
        this.fps = 60;
        this.mouse = { x: 0, y: 0, isMoving: false, lastMoveTime: 0 };
        this.time = 0;
        this.performanceLevel = 'auto';
        
        // Canvas fallback context
        this.ctx2d = null;
        this.symbolTextures = new Map();
        
        // Advanced Configuration
        this.config = {
            particleCount: options.particleCount || 300,
            particleSize: options.particleSize || 2.0,
            speed: options.speed || 0.3,
            turbulence: options.turbulence || 0.08,
            // FacePay Color Harmony
            colors: options.colors || [
                [0, 255, 136],     // FacePay Green
                [16, 185, 129],    // Emerald
                [52, 211, 153],    // Light emerald
                [167, 243, 208],   // Very light emerald
                [59, 130, 246],    // Blue accent
                [34, 197, 94],     // Success green
            ],
            // Crypto Symbols
            symbols: options.symbols || ['@', '💸', '⚡', '👤', '✨', '🔥', '💎', '🚀'],
            symbolProbability: options.symbolProbability || 0.3,
            // Interaction Features
            interactive: options.interactive !== false,
            mouseAttraction: options.mouseAttraction !== false,
            mouseRepulsion: options.mouseRepulsion || false,
            connectionLines: options.connectionLines !== false,
            connectionDistance: options.connectionDistance || 120,
            // Visual Effects
            glowEffect: options.glowEffect !== false,
            parallaxLayers: options.parallaxLayers !== false,
            depthLayers: options.depthLayers || 3,
            // Performance
            maxFPS: options.maxFPS || 60,
            adaptivePerformance: options.adaptivePerformance !== false
        };
        
        this.init();
    }

    async init() {
        this.createCanvas();
        this.detectPerformance();
        await this.initWebGL();
        this.setupShaders();
        this.initSymbolTextures();
        this.generateLayers();
        this.generateParticles();
        this.setupEventListeners();
        this.start();
        console.log(`✨ FacePay Particle System V2.0 initialized`);
        console.log(`📊 Performance: ${this.performanceLevel} | Particles: ${this.config.particleCount} | Layers: ${this.config.depthLayers}`);
    }

    detectPerformance() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        let score = 100; // Base score
        
        // Check WebGL support
        if (!gl) {
            score -= 40;
            this.performanceLevel = 'low';
            return;
        }
        
        // Device factors
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const cores = navigator.hardwareConcurrency || 2;
        const memory = navigator.deviceMemory || 2;
        
        // GPU information
        const renderer = gl.getParameter(gl.RENDERER).toLowerCase();
        const vendor = gl.getParameter(gl.VENDOR).toLowerCase();
        
        // Reduce score based on factors
        if (isMobile) score -= 30;
        if (cores < 4) score -= 20;
        if (memory < 4) score -= 15;
        if (renderer.includes('intel') && !renderer.includes('iris')) score -= 25;
        if (renderer.includes('adreno') || renderer.includes('mali')) score -= 20;
        
        // Set performance level and adjust config
        if (score >= 80) {
            this.performanceLevel = 'high';
            this.config.particleCount = Math.min(this.config.particleCount, 400);
        } else if (score >= 50) {
            this.performanceLevel = 'medium';
            this.config.particleCount = Math.min(this.config.particleCount, 250);
            this.config.connectionLines = true;
        } else {
            this.performanceLevel = 'low';
            this.config.particleCount = Math.min(this.config.particleCount, 150);
            this.config.connectionLines = false;
            this.config.glowEffect = false;
            this.config.depthLayers = 2;
        }
        
        canvas.remove();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'facepay-particle-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1;
            pointer-events: none;
            opacity: 0.85;
            mix-blend-mode: screen;
        `;
        
        // Set actual canvas size
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        
        document.body.appendChild(this.canvas);
    }

    initSymbolTextures() {
        if (!this.canvas) return;
        
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = 64;
        tempCanvas.height = 64;
        
        this.config.symbols.forEach(symbol => {
            tempCtx.clearRect(0, 0, 64, 64);
            tempCtx.font = '32px -apple-system, system-ui';
            tempCtx.textAlign = 'center';
            tempCtx.textBaseline = 'middle';
            tempCtx.fillStyle = '#00ff88';
            tempCtx.fillText(symbol, 32, 32);
            
            this.symbolTextures.set(symbol, tempCanvas.toDataURL());
        });
        
        tempCanvas.remove();
    }

    generateLayers() {
        this.layers = [];
        
        for (let i = 0; i < this.config.depthLayers; i++) {
            const layer = {
                id: i,
                depth: (i + 1) / this.config.depthLayers, // 0.33, 0.66, 1.0
                speed: 0.5 + (i * 0.3), // Different speeds for parallax
                opacity: 0.3 + (i * 0.3), // Back layers more transparent
                particleSize: 1 + (i * 1.5), // Larger particles in front
                particles: []
            };
            this.layers.push(layer);
        }
    }

    async initWebGL() {
        this.gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
        
        if (!this.gl) {
            console.warn('WebGL not supported, falling back to Canvas 2D');
            this.fallbackToCanvas2D();
            return;
        }

        // Enable blending for particle effects
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        // Set viewport
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        
        // Clear color (transparent)
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    }

    setupShaders() {
        const vertexShaderSource = `
            attribute vec2 a_position;
            attribute vec3 a_color;
            attribute float a_size;
            attribute float a_alpha;
            
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec2 u_mouse;
            
            varying vec3 v_color;
            varying float v_alpha;
            varying vec2 v_position;
            
            void main() {
                // Convert from pixels to clip space
                vec2 clipSpace = ((a_position / u_resolution) * 2.0 - 1.0) * vec2(1, -1);
                
                // Mouse interaction
                vec2 mouseInfluence = (u_mouse - a_position) * 0.0001;
                vec2 finalPosition = a_position + mouseInfluence;
                
                gl_Position = vec4(((finalPosition / u_resolution) * 2.0 - 1.0) * vec2(1, -1), 0, 1);
                gl_PointSize = a_size;
                
                v_color = a_color;
                v_alpha = a_alpha;
                v_position = a_position;
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            
            uniform float u_time;
            varying vec3 v_color;
            varying float v_alpha;
            varying vec2 v_position;
            
            void main() {
                // Create circular particle with soft edges
                vec2 center = gl_PointCoord - 0.5;
                float dist = length(center);
                
                if (dist > 0.5) {
                    discard;
                }
                
                // Soft edge falloff
                float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                alpha *= v_alpha;
                
                // Add pulsing glow effect
                float pulse = sin(u_time * 2.0 + v_position.x * 0.01 + v_position.y * 0.01) * 0.3 + 0.7;
                alpha *= pulse;
                
                gl_FragColor = vec4(v_color / 255.0, alpha);
            }
        `;

        this.program = this.createShaderProgram(vertexShaderSource, fragmentShaderSource);
        
        if (this.program) {
            this.gl.useProgram(this.program);
            
            // Get attribute and uniform locations
            this.attributes = {
                position: this.gl.getAttribLocation(this.program, 'a_position'),
                color: this.gl.getAttribLocation(this.program, 'a_color'),
                size: this.gl.getAttribLocation(this.program, 'a_size'),
                alpha: this.gl.getAttribLocation(this.program, 'a_alpha')
            };
            
            this.uniforms = {
                resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
                time: this.gl.getUniformLocation(this.program, 'u_time'),
                mouse: this.gl.getUniformLocation(this.program, 'u_mouse')
            };
            
            // Set resolution
            this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        }
    }

    createShaderProgram(vertexSource, fragmentSource) {
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
        
        if (!vertexShader || !fragmentShader) {
            return null;
        }

        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Error linking shader program:', this.gl.getProgramInfoLog(program));
            return null;
        }

        return program;
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Error compiling shader:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    generateParticles() {
        this.particles = [];
        const particlesPerLayer = Math.floor(this.config.particleCount / this.config.depthLayers);
        
        this.layers.forEach((layer, layerIndex) => {
            layer.particles = [];
            const count = layerIndex === this.layers.length - 1 ? 
                this.config.particleCount - (particlesPerLayer * layerIndex) : particlesPerLayer;
            
            for (let i = 0; i < count; i++) {
                const hasSymbol = Math.random() < this.config.symbolProbability;
                const symbol = hasSymbol ? this.config.symbols[Math.floor(Math.random() * this.config.symbols.length)] : null;
                
                const particle = {
                    id: `${layerIndex}_${i}`,
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * this.config.speed * layer.speed,
                    vy: (Math.random() - 0.5) * this.config.speed * layer.speed,
                    size: (Math.random() * this.config.particleSize + 1) * layer.particleSize,
                    baseSize: (Math.random() * this.config.particleSize + 1) * layer.particleSize,
                    color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                    alpha: (Math.random() * 0.6 + 0.2) * layer.opacity,
                    baseAlpha: (Math.random() * 0.6 + 0.2) * layer.opacity,
                    life: Math.random() * 100,
                    maxLife: Math.random() * 300 + 200,
                    oscillation: Math.random() * Math.PI * 2,
                    oscillationSpeed: Math.random() * 0.015 + 0.005,
                    layer: layerIndex,
                    depth: layer.depth,
                    symbol: symbol,
                    // Connection properties
                    connections: [],
                    connectionOpacity: 0,
                    // Mouse interaction
                    mouseDistance: Infinity,
                    mouseInfluence: 0,
                    targetScale: 1,
                    currentScale: 1
                };
                
                layer.particles.push(particle);
                this.particles.push(particle);
            }
        });

        this.createBuffers();
    }

    createBuffers() {
        if (!this.gl || !this.program) return;

        const positions = [];
        const colors = [];
        const sizes = [];
        const alphas = [];

        this.particles.forEach(particle => {
            positions.push(particle.x, particle.y);
            colors.push(particle.color[0], particle.color[1], particle.color[2]);
            sizes.push(particle.size);
            alphas.push(particle.alpha);
        });

        // Position buffer
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.DYNAMIC_DRAW);

        // Color buffer
        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

        // Size buffer
        this.sizeBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(sizes), this.gl.STATIC_DRAW);

        // Alpha buffer
        this.alphaBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.alphaBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(alphas), this.gl.DYNAMIC_DRAW);
    }

    calculateConnections() {
        if (!this.config.connectionLines) return;
        
        this.connections = [];
        
        for (let i = 0; i < this.particles.length; i++) {
            const particle1 = this.particles[i];
            particle1.connections = [];
            
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle2 = this.particles[j];
                
                // Only connect particles in same or adjacent layers for performance
                if (Math.abs(particle1.layer - particle2.layer) > 1) continue;
                
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = Math.max(0, 1 - (distance / this.config.connectionDistance));
                    const connection = {
                        particle1,
                        particle2,
                        opacity: opacity * 0.3, // Base connection opacity
                        distance
                    };
                    
                    particle1.connections.push(connection);
                    this.connections.push(connection);
                }
            }
        }
    }

    updateParticles(deltaTime) {
        const positions = [];
        const alphas = [];
        const mouseX = this.mouse.x;
        const mouseY = this.mouse.y;
        
        // Calculate connections first
        if (this.frameCount % 3 === 0) { // Update connections every 3 frames for performance
            this.calculateConnections();
        }

        this.particles.forEach(particle => {
            // Update particle physics
            particle.life += deltaTime * 60;
            particle.oscillation += particle.oscillationSpeed;
            
            // Mouse interaction
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            particle.mouseDistance = Math.sqrt(dx * dx + dy * dy);
            
            // Mouse attraction/repulsion
            if (this.config.mouseAttraction && particle.mouseDistance < 150) {
                const force = (150 - particle.mouseDistance) * 0.0008;
                const angle = Math.atan2(dy, dx);
                
                if (this.config.mouseRepulsion) {
                    particle.vx -= Math.cos(angle) * force;
                    particle.vy -= Math.sin(angle) * force;
                } else {
                    particle.vx += Math.cos(angle) * force * 0.3;
                    particle.vy += Math.sin(angle) * force * 0.3;
                }
                
                // Scale effect
                particle.targetScale = 1 + (150 - particle.mouseDistance) * 0.006;
                particle.mouseInfluence = Math.min(1, (150 - particle.mouseDistance) * 0.01);
            } else {
                particle.targetScale = 1;
                particle.mouseInfluence *= 0.95; // Fade out
            }
            
            // Smooth scale animation
            particle.currentScale += (particle.targetScale - particle.currentScale) * 0.1;
            
            // Add turbulence with depth-based variation
            const turbulenceStrength = this.config.turbulence * particle.depth;
            const turbulenceX = Math.sin(particle.oscillation) * turbulenceStrength;
            const turbulenceY = Math.cos(particle.oscillation * 1.3) * turbulenceStrength;
            
            particle.vx += turbulenceX;
            particle.vy += turbulenceY;
            
            // Apply drag
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            // Update position with parallax
            const parallaxFactor = 0.5 + (particle.depth * 0.5);
            particle.x += particle.vx * parallaxFactor;
            particle.y += particle.vy * parallaxFactor;
            
            // Boundary conditions with wrapping
            const margin = 50;
            if (particle.x > this.canvas.width + margin) {
                particle.x = -margin;
            } else if (particle.x < -margin) {
                particle.x = this.canvas.width + margin;
            }
            
            if (particle.y > this.canvas.height + margin) {
                particle.y = -margin;
            } else if (particle.y < -margin) {
                particle.y = this.canvas.height + margin;
            }
            
            // Update alpha based on life cycle and mouse interaction
            const lifeCycle = particle.life / particle.maxLife;
            if (lifeCycle > 1) {
                // Respawn particle
                particle.life = 0;
                particle.x = Math.random() * this.canvas.width;
                particle.y = Math.random() * this.canvas.height;
                const layer = this.layers[particle.layer];
                particle.vx = (Math.random() - 0.5) * this.config.speed * layer.speed;
                particle.vy = (Math.random() - 0.5) * this.config.speed * layer.speed;
                
                // Reassign symbol
                if (Math.random() < this.config.symbolProbability) {
                    particle.symbol = this.config.symbols[Math.floor(Math.random() * this.config.symbols.length)];
                } else {
                    particle.symbol = null;
                }
            }
            
            // Calculate alpha with breathing effect
            const breathing = Math.sin(lifeCycle * Math.PI) * 0.7 + 0.3;
            const mouseGlow = 1 + (particle.mouseInfluence * 0.5);
            particle.alpha = particle.baseAlpha * breathing * mouseGlow;
            particle.size = particle.baseSize * particle.currentScale;
            
            positions.push(particle.x, particle.y);
            alphas.push(particle.alpha);
        });

        // Update buffers
        if (this.gl && this.program) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(positions));
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.alphaBuffer);
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(alphas));
        }
    }

    render(currentTime) {
        if (!this.gl || !this.program) {
            this.fallbackRender(currentTime);
            return;
        }

        const deltaTime = currentTime - this.time;
        this.time = currentTime;

        // FPS monitoring for adaptive performance
        if (this.config.adaptivePerformance) {
            this.monitorFPS(deltaTime);
        }

        // Update particles
        this.updateParticles(deltaTime);

        // Clear canvas
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Render connection lines first (behind particles)
        this.renderConnections();

        // Use shader program
        this.gl.useProgram(this.program);

        // Set uniforms
        this.gl.uniform1f(this.uniforms.time, currentTime * 0.001);
        this.gl.uniform2f(this.uniforms.mouse, this.mouse.x, this.mouse.y);

        // Bind position attribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.enableVertexAttribArray(this.attributes.position);
        this.gl.vertexAttribPointer(this.attributes.position, 2, this.gl.FLOAT, false, 0, 0);

        // Bind color attribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.enableVertexAttribArray(this.attributes.color);
        this.gl.vertexAttribPointer(this.attributes.color, 3, this.gl.FLOAT, false, 0, 0);

        // Bind size attribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer);
        this.gl.enableVertexAttribArray(this.attributes.size);
        this.gl.vertexAttribPointer(this.attributes.size, 1, this.gl.FLOAT, false, 0, 0);

        // Bind alpha attribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.alphaBuffer);
        this.gl.enableVertexAttribArray(this.attributes.alpha);
        this.gl.vertexAttribPointer(this.attributes.alpha, 1, this.gl.FLOAT, false, 0, 0);

        // Draw particles
        this.gl.drawArrays(this.gl.POINTS, 0, this.particles.length);
    }

    renderConnections() {
        if (!this.config.connectionLines || !this.connections.length) return;
        
        // Simple line rendering for WebGL
        this.gl.useProgram(null); // Use fixed function pipeline for lines
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        // Note: In a full implementation, you'd create a separate shader for lines
        // For now, we'll handle this in the canvas fallback
    }

    monitorFPS(deltaTime) {
        const currentFPS = 1000 / deltaTime;
        this.fps = this.fps * 0.9 + currentFPS * 0.1; // Smooth FPS
        
        // Adaptive performance adjustments
        if (this.fps < 30 && this.performanceLevel !== 'low') {
            this.performanceLevel = 'low';
            this.config.particleCount = Math.max(50, this.config.particleCount * 0.7);
            this.config.connectionLines = false;
            this.config.glowEffect = false;
            console.log('🐌 Performance adapted to low mode');
        } else if (this.fps > 50 && this.performanceLevel === 'low') {
            this.performanceLevel = 'medium';
            this.config.connectionLines = true;
            console.log('⚡ Performance improved to medium mode');
        }
    }

    fallbackToCanvas2D() {
        this.ctx2d = this.canvas.getContext('2d');
        console.log('🎨 Using enhanced Canvas 2D fallback for particle system');
    }

    fallbackRender(currentTime) {
        if (!this.ctx2d) return;

        const deltaTime = currentTime - this.time || 16.67;
        this.time = currentTime;

        // Clear canvas with fade effect for trails
        this.ctx2d.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx2d.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx2d.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update particles
        this.updateParticles(deltaTime);

        // Render connections first (behind particles)
        this.renderConnectionLines2D();

        // Render particles by layer (back to front)
        this.layers.forEach(layer => {
            this.renderLayerParticles2D(layer);
        });
    }

    renderConnectionLines2D() {
        if (!this.config.connectionLines || !this.connections.length) return;

        this.ctx2d.save();
        this.ctx2d.globalCompositeOperation = 'lighter';
        
        this.connections.forEach(connection => {
            const { particle1, particle2, opacity } = connection;
            
            // Calculate gradient for connection line
            const gradient = this.ctx2d.createLinearGradient(
                particle1.x, particle1.y, 
                particle2.x, particle2.y
            );
            
            const color1 = `rgba(${particle1.color.join(',')}, ${opacity * particle1.alpha})`;
            const color2 = `rgba(${particle2.color.join(',')}, ${opacity * particle2.alpha})`;
            
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            
            this.ctx2d.strokeStyle = gradient;
            this.ctx2d.lineWidth = 0.5 + (opacity * 2);
            this.ctx2d.lineCap = 'round';
            
            this.ctx2d.beginPath();
            this.ctx2d.moveTo(particle1.x, particle1.y);
            this.ctx2d.lineTo(particle2.x, particle2.y);
            this.ctx2d.stroke();
        });
        
        this.ctx2d.restore();
    }

    renderLayerParticles2D(layer) {
        this.ctx2d.save();
        this.ctx2d.globalCompositeOperation = 'lighter';
        
        layer.particles.forEach(particle => {
            this.ctx2d.save();
            this.ctx2d.translate(particle.x, particle.y);
            this.ctx2d.scale(particle.currentScale, particle.currentScale);
            
            if (particle.symbol) {
                // Render crypto symbol
                this.renderSymbol2D(particle);
            } else {
                // Render regular particle with glow
                this.renderGlowParticle2D(particle);
            }
            
            this.ctx2d.restore();
        });
        
        this.ctx2d.restore();
    }

    renderSymbol2D(particle) {
        const glowSize = particle.size * 3;
        
        // Outer glow
        if (this.config.glowEffect) {
            const glowGradient = this.ctx2d.createRadialGradient(0, 0, 0, 0, 0, glowSize);
            glowGradient.addColorStop(0, `rgba(${particle.color.join(',')}, ${particle.alpha * 0.3})`);
            glowGradient.addColorStop(0.5, `rgba(${particle.color.join(',')}, ${particle.alpha * 0.1})`);
            glowGradient.addColorStop(1, 'transparent');
            
            this.ctx2d.fillStyle = glowGradient;
            this.ctx2d.beginPath();
            this.ctx2d.arc(0, 0, glowSize, 0, Math.PI * 2);
            this.ctx2d.fill();
        }
        
        // Symbol text
        this.ctx2d.font = `${particle.size * 1.2}px -apple-system, system-ui, sans-serif`;
        this.ctx2d.textAlign = 'center';
        this.ctx2d.textBaseline = 'middle';
        
        // Text shadow/glow
        this.ctx2d.shadowColor = `rgba(${particle.color.join(',')}, ${particle.alpha})`;
        this.ctx2d.shadowBlur = particle.size * 0.8;
        this.ctx2d.fillStyle = `rgba(${particle.color.join(',')}, ${particle.alpha})`;
        this.ctx2d.fillText(particle.symbol, 0, 0);
        
        // Clear shadow for next render
        this.ctx2d.shadowBlur = 0;
    }

    renderGlowParticle2D(particle) {
        // Multi-layered glow effect
        if (this.config.glowEffect) {
            // Outer glow
            const outerGradient = this.ctx2d.createRadialGradient(0, 0, 0, 0, 0, particle.size * 4);
            outerGradient.addColorStop(0, `rgba(${particle.color.join(',')}, ${particle.alpha * 0.2})`);
            outerGradient.addColorStop(0.3, `rgba(${particle.color.join(',')}, ${particle.alpha * 0.1})`);
            outerGradient.addColorStop(1, 'transparent');
            
            this.ctx2d.fillStyle = outerGradient;
            this.ctx2d.beginPath();
            this.ctx2d.arc(0, 0, particle.size * 4, 0, Math.PI * 2);
            this.ctx2d.fill();
            
            // Inner glow
            const innerGradient = this.ctx2d.createRadialGradient(0, 0, 0, 0, 0, particle.size * 2);
            innerGradient.addColorStop(0, `rgba(${particle.color.join(',')}, ${particle.alpha * 0.6})`);
            innerGradient.addColorStop(0.7, `rgba(${particle.color.join(',')}, ${particle.alpha * 0.3})`);
            innerGradient.addColorStop(1, 'transparent');
            
            this.ctx2d.fillStyle = innerGradient;
            this.ctx2d.beginPath();
            this.ctx2d.arc(0, 0, particle.size * 2, 0, Math.PI * 2);
            this.ctx2d.fill();
        }
        
        // Core particle
        const coreGradient = this.ctx2d.createRadialGradient(0, 0, 0, 0, 0, particle.size);
        coreGradient.addColorStop(0, `rgba(${particle.color.join(',')}, ${particle.alpha})`);
        coreGradient.addColorStop(0.7, `rgba(${particle.color.join(',')}, ${particle.alpha * 0.8})`);
        coreGradient.addColorStop(1, `rgba(${particle.color.join(',')}, 0)`);
        
        this.ctx2d.fillStyle = coreGradient;
        this.ctx2d.beginPath();
        this.ctx2d.arc(0, 0, particle.size, 0, Math.PI * 2);
        this.ctx2d.fill();
    }

    setupEventListeners() {
        // Enhanced mouse tracking
        if (this.config.interactive) {
            let mouseTimeout;
            
            const handleMouseMove = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = (e.clientX - rect.left) * window.devicePixelRatio;
                this.mouse.y = (e.clientY - rect.top) * window.devicePixelRatio;
                this.mouse.isMoving = true;
                this.mouse.lastMoveTime = performance.now();
                
                // Clear previous timeout
                clearTimeout(mouseTimeout);
                
                // Set mouse as not moving after 100ms of no movement
                mouseTimeout = setTimeout(() => {
                    this.mouse.isMoving = false;
                }, 100);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            
            // Touch support for mobile
            document.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    const touch = e.touches[0];
                    const syntheticEvent = {
                        clientX: touch.clientX,
                        clientY: touch.clientY
                    };
                    handleMouseMove(syntheticEvent);
                }
            }, { passive: true });
            
            // Mouse leave - reset mouse influence
            document.addEventListener('mouseleave', () => {
                this.mouse.isMoving = false;
            });
        }

        // Window resize with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Performance and visibility monitoring
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });

        // Reduced motion support
        if (window.matchMedia) {
            const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            if (motionQuery.matches) {
                this.config.speed *= 0.5;
                this.config.turbulence *= 0.3;
                this.config.connectionLines = false;
                console.log('⚡ Reduced motion mode activated');
            }
        }
    }

    handleResize() {
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';

        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        }

        // Redistribute particles
        this.particles.forEach(particle => {
            if (particle.x > this.canvas.width) particle.x = Math.random() * this.canvas.width;
            if (particle.y > this.canvas.height) particle.y = Math.random() * this.canvas.height;
        });
    }

    start() {
        this.isRunning = true;
        this.animate();
    }

    pause() {
        this.isRunning = false;
    }

    resume() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    animate() {
        if (!this.isRunning) return;

        this.frameCount++;
        this.render(performance.now());

        // FPS limiting for performance
        requestAnimationFrame(() => this.animate());
    }

    // Public API methods
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        if (newConfig.particleCount !== undefined) {
            this.generateParticles();
        }
    }

    setMousePosition(x, y) {
        this.mouse.x = x * window.devicePixelRatio;
        this.mouse.y = y * window.devicePixelRatio;
    }

    addParticlesBurst(x, y, count = 50) {
        const burstParticles = [];
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const velocity = Math.random() * 3 + 1;
            
            const particle = {
                x: x * window.devicePixelRatio,
                y: y * window.devicePixelRatio,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: Math.random() * 4 + 2,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                alpha: 1,
                life: 0,
                maxLife: 120,
                oscillation: Math.random() * Math.PI * 2,
                oscillationSpeed: Math.random() * 0.05 + 0.02
            };
            
            burstParticles.push(particle);
        }
        
        // Add to existing particles temporarily
        this.particles.push(...burstParticles);
        this.createBuffers();
        
        // Remove burst particles after their lifetime
        setTimeout(() => {
            this.particles = this.particles.filter(p => !burstParticles.includes(p));
            this.createBuffers();
        }, 2000);
    }

    destroy() {
        this.pause();
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        if (this.gl) {
            this.gl.deleteProgram(this.program);
            this.gl.deleteBuffer(this.positionBuffer);
            this.gl.deleteBuffer(this.colorBuffer);
            this.gl.deleteBuffer(this.sizeBuffer);
            this.gl.deleteBuffer(this.alphaBuffer);
        }
        
        this.particles = [];
        console.log('Particle system destroyed');
    }
}

// FacePay Elegante Preset Configurations
const FACEPAY_PARTICLE_PRESETS = {
    minimal: {
        particleCount: 80,
        particleSize: 1.2,
        speed: 0.25,
        turbulence: 0.04,
        interactive: false,
        connectionLines: false,
        glowEffect: false,
        depthLayers: 2,
        symbolProbability: 0.2,
        mouseAttraction: false,
        adaptivePerformance: true
    },
    elegante: {
        particleCount: 180,
        particleSize: 1.8,
        speed: 0.35,
        turbulence: 0.08,
        interactive: true,
        connectionLines: true,
        connectionDistance: 100,
        glowEffect: true,
        depthLayers: 3,
        symbolProbability: 0.3,
        mouseAttraction: true,
        mouseRepulsion: false,
        adaptivePerformance: true
    },
    premium: {
        particleCount: 280,
        particleSize: 2.2,
        speed: 0.45,
        turbulence: 0.12,
        interactive: true,
        connectionLines: true,
        connectionDistance: 120,
        glowEffect: true,
        depthLayers: 3,
        symbolProbability: 0.4,
        mouseAttraction: true,
        mouseRepulsion: false,
        parallaxLayers: true,
        adaptivePerformance: true
    },
    impresionante: {
        particleCount: 400,
        particleSize: 2.8,
        speed: 0.6,
        turbulence: 0.15,
        interactive: true,
        connectionLines: true,
        connectionDistance: 140,
        glowEffect: true,
        depthLayers: 4,
        symbolProbability: 0.5,
        mouseAttraction: true,
        mouseRepulsion: false,
        parallaxLayers: true,
        adaptivePerformance: true
    },
    mobile: {
        particleCount: 120,
        particleSize: 1.5,
        speed: 0.3,
        turbulence: 0.06,
        interactive: true,
        connectionLines: true,
        connectionDistance: 80,
        glowEffect: true,
        depthLayers: 2,
        symbolProbability: 0.25,
        mouseAttraction: true,
        adaptivePerformance: true
    }
};

// Auto-initialize based on device performance
document.addEventListener('DOMContentLoaded', () => {
    // Advanced device performance detection
    const getOptimalPreset = () => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        let score = 100;
        
        // WebGL support
        if (!gl) {
            canvas.remove();
            return 'minimal';
        }
        
        // Device detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android.*Tablet/i.test(navigator.userAgent);
        const cores = navigator.hardwareConcurrency || 2;
        const memory = navigator.deviceMemory || 2;
        
        // GPU information
        const renderer = gl.getParameter(gl.RENDERER).toLowerCase();
        const vendor = gl.getParameter(gl.VENDOR).toLowerCase();
        
        // Performance scoring
        if (isMobile && !isTablet) {
            score -= 40;
        } else if (isTablet) {
            score -= 20;
        }
        
        if (cores < 4) score -= 25;
        if (memory < 4) score -= 20;
        if (renderer.includes('intel') && !renderer.includes('iris')) score -= 30;
        if (renderer.includes('adreno') || renderer.includes('mali')) score -= 25;
        
        // Connection speed consideration
        if (navigator.connection) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                score -= 30;
            } else if (connection.effectiveType === '3g') {
                score -= 15;
            }
        }
        
        canvas.remove();
        
        // Return appropriate preset
        if (isMobile && !isTablet) {
            return 'mobile';
        } else if (score >= 85) {
            return 'impresionante';
        } else if (score >= 65) {
            return 'premium';
        } else if (score >= 45) {
            return 'elegante';
        } else {
            return 'minimal';
        }
    };
    
    const preset = getOptimalPreset();
    const config = FACEPAY_PARTICLE_PRESETS[preset];
    
    // Initialize the particle system
    window.facePayParticles = new FacePayParticleSystem(config);
    
    // Log initialization info
    console.log(`✨ FacePay Particle System V2.0 loaded`);
    console.log(`🎨 Preset: ${preset} | Particles: ${config.particleCount} | Layers: ${config.depthLayers}`);
    console.log(`🔗 Features: ${config.connectionLines ? 'Connections' : 'No connections'}, ${config.glowEffect ? 'Glow' : 'Basic'}, ${config.symbolProbability * 100}% symbols`);
    
    // Expose global controls for debugging
    window.facePayParticleControls = {
        changePreset: (presetName) => {
            if (FACEPAY_PARTICLE_PRESETS[presetName]) {
                window.facePayParticles.updateConfig(FACEPAY_PARTICLE_PRESETS[presetName]);
                console.log(`🔄 Switched to ${presetName} preset`);
            }
        },
        addBurst: (x, y, count = 50) => {
            window.facePayParticles.addParticlesBurst(x, y, count);
        },
        getStats: () => {
            const particles = window.facePayParticles;
            return {
                fps: Math.round(particles.fps),
                particleCount: particles.particles.length,
                connections: particles.connections ? particles.connections.length : 0,
                performanceLevel: particles.performanceLevel,
                mouseDistance: Math.round(particles.mouse.x + particles.mouse.y)
            };
        }
    };
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FacePayParticleSystem, FACEPAY_PARTICLE_PRESETS };
}