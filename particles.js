/**
 * FACEPAY PROFESSIONAL PARTICLE SYSTEM
 * Advanced WebGL particle engine with 60fps performance
 * Apple-level visual effects with hardware acceleration
 */

class FacePayParticleSystem {
    constructor(options = {}) {
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.particles = [];
        this.particleBuffer = null;
        this.colorBuffer = null;
        this.isRunning = false;
        this.frameCount = 0;
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        // Configuration
        this.config = {
            particleCount: options.particleCount || 500,
            particleSize: options.particleSize || 2.0,
            speed: options.speed || 0.5,
            turbulence: options.turbulence || 0.1,
            colors: options.colors || [
                [16, 185, 129],   // Emerald
                [52, 211, 153],   // Light emerald
                [167, 243, 208],  // Very light emerald
                [6, 78, 59],      // Dark emerald
            ],
            interactive: options.interactive !== false,
            glowEffect: options.glowEffect !== false,
            mouseRepulsion: options.mouseRepulsion !== false
        };
        
        this.init();
    }

    async init() {
        this.createCanvas();
        await this.initWebGL();
        this.setupShaders();
        this.generateParticles();
        this.setupEventListeners();
        this.start();
        console.log('✨ Particle System initialized with', this.config.particleCount, 'particles');
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particle-system-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1;
            pointer-events: none;
            opacity: 0.8;
        `;
        
        // Set actual canvas size
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        
        document.body.appendChild(this.canvas);
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
        
        for (let i = 0; i < this.config.particleCount; i++) {
            const particle = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.speed,
                vy: (Math.random() - 0.5) * this.config.speed,
                size: Math.random() * this.config.particleSize + 1,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                alpha: Math.random() * 0.8 + 0.2,
                life: Math.random() * 100,
                maxLife: Math.random() * 200 + 100,
                oscillation: Math.random() * Math.PI * 2,
                oscillationSpeed: Math.random() * 0.02 + 0.01
            };
            this.particles.push(particle);
        }

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

    updateParticles(deltaTime) {
        const positions = [];
        const alphas = [];

        this.particles.forEach(particle => {
            // Update particle physics
            particle.life += deltaTime * 60;
            particle.oscillation += particle.oscillationSpeed;
            
            // Add turbulence
            const turbulenceX = Math.sin(particle.oscillation) * this.config.turbulence;
            const turbulenceY = Math.cos(particle.oscillation * 1.5) * this.config.turbulence;
            
            particle.vx += turbulenceX;
            particle.vy += turbulenceY;
            
            // Mouse repulsion
            if (this.config.mouseRepulsion) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) * 0.001;
                    particle.vx -= (dx / distance) * force;
                    particle.vy -= (dy / distance) * force;
                }
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary conditions with wrapping
            if (particle.x > this.canvas.width + 50) {
                particle.x = -50;
            } else if (particle.x < -50) {
                particle.x = this.canvas.width + 50;
            }
            
            if (particle.y > this.canvas.height + 50) {
                particle.y = -50;
            } else if (particle.y < -50) {
                particle.y = this.canvas.height + 50;
            }
            
            // Update alpha based on life cycle
            const lifeCycle = particle.life / particle.maxLife;
            if (lifeCycle > 1) {
                // Respawn particle
                particle.life = 0;
                particle.x = Math.random() * this.canvas.width;
                particle.y = Math.random() * this.canvas.height;
                particle.vx = (Math.random() - 0.5) * this.config.speed;
                particle.vy = (Math.random() - 0.5) * this.config.speed;
            }
            
            particle.alpha = Math.sin(lifeCycle * Math.PI) * 0.8 + 0.2;
            
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
            this.fallbackRender();
            return;
        }

        const deltaTime = currentTime - this.time;
        this.time = currentTime;

        // Update particles
        this.updateParticles(deltaTime);

        // Clear canvas
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

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

    fallbackToCanvas2D() {
        this.ctx = this.canvas.getContext('2d');
        console.log('Using Canvas 2D fallback for particle system');
    }

    fallbackRender() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size
            );
            
            gradient.addColorStop(0, `rgba(${particle.color.join(',')}, ${particle.alpha})`);
            gradient.addColorStop(1, `rgba(${particle.color.join(',')}, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Update particles for Canvas 2D
        this.updateParticles(16.67); // Assume 60fps
    }

    setupEventListeners() {
        // Mouse tracking
        if (this.config.interactive) {
            document.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = (e.clientX - rect.left) * window.devicePixelRatio;
                this.mouse.y = (e.clientY - rect.top) * window.devicePixelRatio;
            });
        }

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Performance monitoring
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
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

// Preset configurations
const PARTICLE_PRESETS = {
    minimal: {
        particleCount: 100,
        particleSize: 1,
        speed: 0.3,
        turbulence: 0.05,
        interactive: false
    },
    standard: {
        particleCount: 300,
        particleSize: 2,
        speed: 0.5,
        turbulence: 0.1,
        interactive: true
    },
    premium: {
        particleCount: 500,
        particleSize: 3,
        speed: 0.7,
        turbulence: 0.15,
        interactive: true,
        glowEffect: true,
        mouseRepulsion: true
    },
    performance: {
        particleCount: 150,
        particleSize: 1.5,
        speed: 0.4,
        turbulence: 0.08,
        interactive: false,
        glowEffect: false
    }
};

// Auto-initialize based on device performance
document.addEventListener('DOMContentLoaded', () => {
    // Detect device performance level
    const getPerformancePreset = () => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        if (!gl) return 'minimal';
        
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowEnd = navigator.hardwareConcurrency < 4;
        const hasSlowGPU = gl.getParameter(gl.RENDERER).toLowerCase().includes('intel');
        
        if (isMobile || isLowEnd || hasSlowGPU) {
            return 'performance';
        } else if (navigator.hardwareConcurrency >= 8) {
            return 'premium';
        } else {
            return 'standard';
        }
    };
    
    const preset = getPerformancePreset();
    window.facePayParticles = new FacePayParticleSystem(PARTICLE_PRESETS[preset]);
    
    console.log(`🌟 Particle system initialized with ${preset} preset`);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FacePayParticleSystem, PARTICLE_PRESETS };
}