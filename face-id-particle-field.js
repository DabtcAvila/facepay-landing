/**
 * FACEPAY ADVANCED FACE ID PARTICLE FIELD SYSTEM V3.0
 * Mesmerizing particle field that surrounds and interacts with Face ID element
 * Features: Canvas-based rendering, physics simulation, Face ID integration, performance optimization
 */

class FaceIDParticleField {
    constructor(options = {}) {
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.particles = [];
        this.connections = [];
        this.isRunning = false;
        this.time = 0;
        this.lastFrameTime = 0;
        this.fps = 60;
        this.targetFPS = 60;
        this.performanceLevel = 'auto';
        this.frameCount = 0;
        
        // Face ID Integration
        this.faceIdElement = null;
        this.faceIdBounds = { x: 0, y: 0, width: 0, height: 0, centerX: 0, centerY: 0, radius: 0 };
        this.faceIdActive = false;
        this.scanningAnimation = false;
        
        // Mouse/Touch Interaction
        this.mouse = {
            x: 0,
            y: 0,
            isActive: false,
            lastMoveTime: 0,
            pressure: 1,
            trail: []
        };
        
        // Advanced Configuration
        this.config = {
            // Particle System
            particleCount: options.particleCount || 250,
            particleSize: { min: 1, max: 3 },
            speed: { min: 0.2, max: 0.8 },
            
            // Face ID Integration
            faceIdAttraction: options.faceIdAttraction !== false,
            faceIdRadius: options.faceIdRadius || 200,
            faceIdForce: options.faceIdForce || 0.002,
            orbitParticles: options.orbitParticles !== false,
            
            // Visual Effects
            glowIntensity: options.glowIntensity || 0.8,
            connectionDistance: options.connectionDistance || 100,
            connectionOpacity: options.connectionOpacity || 0.3,
            trailLength: options.trailLength || 8,
            bloomEffect: options.bloomEffect !== false,
            
            // Colors matching FacePay brand
            colors: {
                primary: [0, 255, 136],      // FacePay Green
                secondary: [16, 185, 129],    // Emerald
                accent: [59, 130, 246],       // Blue
                highlight: [167, 243, 208],   // Light emerald
                glow: [0, 255, 136, 0.1],     // Green glow
                connection: [255, 255, 255, 0.2] // Connection lines
            },
            
            // Physics
            gravity: { x: 0, y: 0.001 },
            friction: 0.995,
            turbulence: 0.008,
            mouseInfluence: 150,
            mouseForce: 0.15,
            
            // Performance
            maxFPS: options.maxFPS || 60,
            adaptivePerformance: options.adaptivePerformance !== false,
            connectionLinesEnabled: true,
            glowEffectEnabled: true
        };
        
        this.init();
    }

    async init() {
        this.detectPerformance();
        this.createCanvas();
        this.findFaceIdElement();
        this.generateParticles();
        this.setupEventListeners();
        this.start();
        
        console.log(`✨ Face ID Particle Field V3.0 initialized`);
        console.log(`📊 Performance: ${this.performanceLevel} | Particles: ${this.config.particleCount}`);
    }

    detectPerformance() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let score = 100;
        
        // Device factors
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android.*Tablet/i.test(navigator.userAgent);
        const cores = navigator.hardwareConcurrency || 2;
        const memory = navigator.deviceMemory || 2;
        
        // Reduce score based on factors
        if (isMobile && !isTablet) score -= 40;
        if (isTablet) score -= 20;
        if (cores < 4) score -= 20;
        if (memory < 4) score -= 15;
        
        // Network connection
        if (navigator.connection) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                score -= 30;
            } else if (connection.effectiveType === '3g') {
                score -= 15;
            }
        }
        
        // Set performance level and adjust config
        if (score >= 75) {
            this.performanceLevel = 'high';
            this.config.particleCount = Math.min(this.config.particleCount, 300);
            this.targetFPS = 60;
        } else if (score >= 50) {
            this.performanceLevel = 'medium';
            this.config.particleCount = Math.min(this.config.particleCount, 200);
            this.targetFPS = 45;
            this.config.connectionDistance = 80;
        } else {
            this.performanceLevel = 'low';
            this.config.particleCount = Math.min(this.config.particleCount, 120);
            this.targetFPS = 30;
            this.config.connectionLinesEnabled = false;
            this.config.glowEffectEnabled = false;
            this.config.trailLength = 4;
        }
        
        canvas.remove();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'face-id-particle-field';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 2;
            pointer-events: none;
            opacity: 0.9;
            mix-blend-mode: screen;
        `;
        
        // Set canvas size with device pixel ratio for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(dpr, dpr);
        
        // Enable image smoothing for better quality
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        document.body.appendChild(this.canvas);
    }

    findFaceIdElement() {
        // Look for Face ID scanner element
        this.faceIdElement = document.getElementById('faceScanner') || 
                            document.querySelector('.face-scanner-hero') ||
                            document.querySelector('[data-face-id]');
        
        if (this.faceIdElement) {
            this.updateFaceIdBounds();
            console.log('🎯 Face ID element found and tracked');
        } else {
            console.warn('⚠️ Face ID element not found, using center fallback');
            this.faceIdBounds = {
                x: window.innerWidth * 0.75,
                y: window.innerHeight * 0.5,
                width: 280,
                height: 280,
                centerX: window.innerWidth * 0.75,
                centerY: window.innerHeight * 0.5,
                radius: 140
            };
        }
    }

    updateFaceIdBounds() {
        if (!this.faceIdElement) return;
        
        const rect = this.faceIdElement.getBoundingClientRect();
        this.faceIdBounds = {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
            radius: Math.max(rect.width, rect.height) / 2
        };
        
        // Check if Face ID is in scanning state
        this.faceIdActive = this.faceIdElement.classList.contains('scanning') ||
                          this.faceIdElement.querySelector('.scanning') !== null;
        
        this.scanningAnimation = this.faceIdElement.classList.contains('success') ||
                               this.faceIdElement.querySelector('.success') !== null;
    }

    generateParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            const particle = this.createParticle(i);
            this.particles.push(particle);
        }
    }

    createParticle(id) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * this.config.faceIdRadius + 100;
        
        return {
            id: id,
            // Position
            x: this.faceIdBounds.centerX + Math.cos(angle) * distance,
            y: this.faceIdBounds.centerY + Math.sin(angle) * distance,
            initialX: 0, // Set after positioning
            initialY: 0,
            
            // Velocity
            vx: (Math.random() - 0.5) * this.config.speed.max,
            vy: (Math.random() - 0.5) * this.config.speed.max,
            
            // Visual properties
            size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
            baseSize: 0, // Set after size calculation
            currentSize: 0,
            
            // Color
            colorIndex: Math.floor(Math.random() * 4), // primary, secondary, accent, highlight
            alpha: Math.random() * 0.6 + 0.2,
            baseAlpha: 0, // Set after alpha calculation
            currentAlpha: 0,
            
            // Animation
            life: Math.random() * 1000,
            maxLife: Math.random() * 2000 + 1000,
            oscillation: Math.random() * Math.PI * 2,
            oscillationSpeed: Math.random() * 0.02 + 0.005,
            
            // Physics
            mass: Math.random() * 0.8 + 0.2,
            friction: this.config.friction + Math.random() * 0.01,
            
            // Face ID interaction
            orbitAngle: angle,
            orbitRadius: distance,
            orbitSpeed: (Math.random() - 0.5) * 0.005,
            attractionForce: 0,
            
            // Mouse interaction
            mouseDistance: Infinity,
            mouseInfluence: 0,
            
            // Trail
            trail: [],
            
            // Connection properties
            connections: [],
            
            // State
            isOrbiting: Math.random() < 0.3, // 30% of particles orbit Face ID
            energy: Math.random() * 0.5 + 0.5
        };
    }

    updateParticles(deltaTime) {
        this.updateFaceIdBounds();
        
        const mouseX = this.mouse.x;
        const mouseY = this.mouse.y;
        const faceIdCenterX = this.faceIdBounds.centerX;
        const faceIdCenterY = this.faceIdBounds.centerY;
        const faceIdRadius = this.faceIdBounds.radius;
        
        // Clear connections
        this.connections = [];
        
        this.particles.forEach(particle => {
            // Update life cycle
            particle.life += deltaTime * 0.06;
            particle.oscillation += particle.oscillationSpeed;
            
            // Calculate distances
            const faceIdDx = faceIdCenterX - particle.x;
            const faceIdDy = faceIdCenterY - particle.y;
            const faceIdDistance = Math.sqrt(faceIdDx * faceIdDx + faceIdDy * faceIdDy);
            
            const mouseDx = mouseX - particle.x;
            const mouseDy = mouseY - particle.y;
            particle.mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
            
            // Face ID attraction/orbit behavior
            if (this.config.faceIdAttraction) {
                if (particle.isOrbiting && faceIdDistance > 50) {
                    // Orbital motion around Face ID
                    particle.orbitAngle += particle.orbitSpeed;
                    const targetX = faceIdCenterX + Math.cos(particle.orbitAngle) * particle.orbitRadius;
                    const targetY = faceIdCenterY + Math.sin(particle.orbitAngle) * particle.orbitRadius;
                    
                    particle.vx += (targetX - particle.x) * this.config.faceIdForce;
                    particle.vy += (targetY - particle.y) * this.config.faceIdForce;
                } else if (faceIdDistance > faceIdRadius * 0.5) {
                    // Attraction to Face ID
                    const force = this.config.faceIdForce * (1 / (faceIdDistance * 0.01 + 1));
                    const angle = Math.atan2(faceIdDy, faceIdDx);
                    
                    particle.vx += Math.cos(angle) * force * particle.mass;
                    particle.vy += Math.sin(angle) * force * particle.mass;
                    
                    particle.attractionForce = force;
                } else {
                    particle.attractionForce = 0;
                }
            }
            
            // Mouse interaction
            if (this.mouse.isActive && particle.mouseDistance < this.config.mouseInfluence) {
                const force = (this.config.mouseInfluence - particle.mouseDistance) * this.config.mouseForce;
                const angle = Math.atan2(mouseDy, mouseDx);
                
                // Attraction with slight repulsion at very close distances
                const repulsionThreshold = 30;
                if (particle.mouseDistance < repulsionThreshold) {
                    particle.vx -= Math.cos(angle) * force * 0.5;
                    particle.vy -= Math.sin(angle) * force * 0.5;
                } else {
                    particle.vx += Math.cos(angle) * force * 0.3;
                    particle.vy += Math.sin(angle) * force * 0.3;
                }
                
                particle.mouseInfluence = Math.min(1, force * 2);
            } else {
                particle.mouseInfluence *= 0.95;
            }
            
            // Turbulence and noise
            const turbulenceX = Math.sin(particle.oscillation + this.time * 0.001) * this.config.turbulence;
            const turbulenceY = Math.cos(particle.oscillation * 1.3 + this.time * 0.001) * this.config.turbulence;
            
            particle.vx += turbulenceX;
            particle.vy += turbulenceY;
            
            // Apply gravity
            particle.vx += this.config.gravity.x;
            particle.vy += this.config.gravity.y;
            
            // Apply friction
            particle.vx *= particle.friction;
            particle.vy *= particle.friction;
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Update trail
            if (this.config.trailLength > 0) {
                particle.trail.unshift({ x: particle.x, y: particle.y, alpha: particle.currentAlpha });
                if (particle.trail.length > this.config.trailLength) {
                    particle.trail.pop();
                }
            }
            
            // Boundary conditions - wrap around screen with padding
            const padding = 100;
            if (particle.x > window.innerWidth + padding) {
                particle.x = -padding;
            } else if (particle.x < -padding) {
                particle.x = window.innerWidth + padding;
            }
            
            if (particle.y > window.innerHeight + padding) {
                particle.y = -padding;
            } else if (particle.y < -padding) {
                particle.y = window.innerHeight + padding;
            }
            
            // Update visual properties
            const lifeCycle = Math.min(1, particle.life / particle.maxLife);
            const lifePhase = lifeCycle < 0.5 ? lifeCycle * 2 : (1 - lifeCycle) * 2;
            
            // Enhanced visual effects based on Face ID state
            let energyMultiplier = 1;
            if (this.faceIdActive) {
                energyMultiplier = 1.5 + Math.sin(this.time * 0.005) * 0.3;
            } else if (this.scanningAnimation) {
                energyMultiplier = 2 + Math.sin(this.time * 0.01) * 0.5;
            }
            
            const proximityToFaceId = Math.max(0, 1 - (faceIdDistance / this.config.faceIdRadius));
            const mouseProximity = Math.max(0, 1 - (particle.mouseDistance / this.config.mouseInfluence));
            
            particle.currentAlpha = particle.baseAlpha * lifePhase * energyMultiplier * 
                                  (1 + proximityToFaceId * 0.8 + mouseProximity * 0.6);
            particle.currentSize = particle.baseSize * (1 + proximityToFaceId * 0.5 + mouseProximity * 0.3) * 
                                 (1 + Math.sin(particle.oscillation) * 0.2);
            
            // Respawn particle if life cycle complete
            if (lifeCycle >= 1) {
                this.respawnParticle(particle);
            }
        });
        
        // Calculate connections
        if (this.config.connectionLinesEnabled && this.frameCount % 2 === 0) {
            this.calculateConnections();
        }
    }

    calculateConnections() {
        this.connections = [];
        
        for (let i = 0; i < this.particles.length; i++) {
            const particle1 = this.particles[i];
            
            // Limit connections per particle for performance
            let connectionCount = 0;
            const maxConnections = this.performanceLevel === 'high' ? 4 : 
                                 this.performanceLevel === 'medium' ? 3 : 2;
            
            for (let j = i + 1; j < this.particles.length && connectionCount < maxConnections; j++) {
                const particle2 = this.particles[j];
                
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * 
                                   this.config.connectionOpacity;
                    
                    this.connections.push({
                        particle1,
                        particle2,
                        opacity: opacity * Math.min(particle1.currentAlpha, particle2.currentAlpha),
                        distance
                    });
                    
                    connectionCount++;
                }
            }
        }
    }

    respawnParticle(particle) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * this.config.faceIdRadius + 100;
        
        particle.x = this.faceIdBounds.centerX + Math.cos(angle) * distance;
        particle.y = this.faceIdBounds.centerY + Math.sin(angle) * distance;
        particle.vx = (Math.random() - 0.5) * this.config.speed.max;
        particle.vy = (Math.random() - 0.5) * this.config.speed.max;
        particle.life = 0;
        particle.oscillation = Math.random() * Math.PI * 2;
        particle.orbitAngle = angle;
        particle.orbitRadius = distance;
        particle.isOrbiting = Math.random() < 0.3;
        particle.trail = [];
        
        // Reset visual properties
        particle.size = Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + 
                       this.config.particleSize.min;
        particle.baseSize = particle.size;
        particle.alpha = Math.random() * 0.6 + 0.2;
        particle.baseAlpha = particle.alpha;
        particle.colorIndex = Math.floor(Math.random() * 4);
    }

    render(currentTime) {
        const deltaTime = currentTime - this.lastFrameTime || 16.67;
        this.lastFrameTime = currentTime;
        this.time = currentTime;
        this.frameCount++;
        
        // FPS monitoring
        if (this.frameCount % 60 === 0) {
            this.fps = 1000 / deltaTime;
            
            // Adaptive performance
            if (this.config.adaptivePerformance) {
                this.adaptPerformance();
            }
        }
        
        // Clear canvas with subtle fade effect for trails
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Set up rendering context
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        
        // Render connection lines first (behind particles)
        this.renderConnections();
        
        // Render particle trails
        this.renderTrails();
        
        // Render particles
        this.renderParticles();
        
        // Render special effects around Face ID
        this.renderFaceIdEffects();
        
        this.ctx.restore();
    }

    renderConnections() {
        if (!this.config.connectionLinesEnabled || this.connections.length === 0) return;
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.lineCap = 'round';
        
        this.connections.forEach(connection => {
            const { particle1, particle2, opacity } = connection;
            
            // Create gradient for connection line
            const gradient = this.ctx.createLinearGradient(
                particle1.x, particle1.y,
                particle2.x, particle2.y
            );
            
            const color1 = this.getParticleColor(particle1);
            const color2 = this.getParticleColor(particle2);
            
            gradient.addColorStop(0, `rgba(${color1.join(',')}, ${opacity})`);
            gradient.addColorStop(1, `rgba(${color2.join(',')}, ${opacity})`);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = opacity * 2 + 0.5;
            
            this.ctx.beginPath();
            this.ctx.moveTo(particle1.x, particle1.y);
            this.ctx.lineTo(particle2.x, particle2.y);
            this.ctx.stroke();
        });
        
        this.ctx.restore();
    }

    renderTrails() {
        if (this.config.trailLength === 0) return;
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        this.particles.forEach(particle => {
            if (particle.trail.length < 2) return;
            
            const color = this.getParticleColor(particle);
            
            for (let i = 1; i < particle.trail.length; i++) {
                const current = particle.trail[i];
                const previous = particle.trail[i - 1];
                const trailAlpha = (1 - i / particle.trail.length) * particle.currentAlpha * 0.5;
                
                this.ctx.strokeStyle = `rgba(${color.join(',')}, ${trailAlpha})`;
                this.ctx.lineWidth = particle.currentSize * (1 - i / particle.trail.length) * 0.5;
                this.ctx.lineCap = 'round';
                
                this.ctx.beginPath();
                this.ctx.moveTo(previous.x, previous.y);
                this.ctx.lineTo(current.x, current.y);
                this.ctx.stroke();
            }
        });
        
        this.ctx.restore();
    }

    renderParticles() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        this.particles.forEach(particle => {
            this.renderParticle(particle);
        });
        
        this.ctx.restore();
    }

    renderParticle(particle) {
        if (particle.currentAlpha <= 0.01) return;
        
        const color = this.getParticleColor(particle);
        
        this.ctx.save();
        this.ctx.translate(particle.x, particle.y);
        
        // Enhanced glow effect
        if (this.config.glowEffectEnabled) {
            // Outer glow
            const outerGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, particle.currentSize * 6);
            outerGradient.addColorStop(0, `rgba(${color.join(',')}, ${particle.currentAlpha * 0.3})`);
            outerGradient.addColorStop(0.4, `rgba(${color.join(',')}, ${particle.currentAlpha * 0.1})`);
            outerGradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = outerGradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, particle.currentSize * 6, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Middle glow
            const middleGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, particle.currentSize * 3);
            middleGradient.addColorStop(0, `rgba(${color.join(',')}, ${particle.currentAlpha * 0.6})`);
            middleGradient.addColorStop(0.6, `rgba(${color.join(',')}, ${particle.currentAlpha * 0.2})`);
            middleGradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = middleGradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, particle.currentSize * 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Core particle
        const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, particle.currentSize);
        coreGradient.addColorStop(0, `rgba(${color.join(',')}, ${particle.currentAlpha})`);
        coreGradient.addColorStop(0.7, `rgba(${color.join(',')}, ${particle.currentAlpha * 0.8})`);
        coreGradient.addColorStop(1, `rgba(${color.join(',')}, 0)`);
        
        this.ctx.fillStyle = coreGradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.currentSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }

    renderFaceIdEffects() {
        if (!this.faceIdBounds || (!this.faceIdActive && !this.scanningAnimation)) return;
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        const centerX = this.faceIdBounds.centerX;
        const centerY = this.faceIdBounds.centerY;
        const radius = this.faceIdBounds.radius;
        
        // Pulsing energy ring around Face ID
        const pulseIntensity = 0.5 + Math.sin(this.time * 0.008) * 0.3;
        const energyRadius = radius * 1.2 + Math.sin(this.time * 0.005) * 20;
        
        const energyGradient = this.ctx.createRadialGradient(
            centerX, centerY, radius * 0.8,
            centerX, centerY, energyRadius
        );
        
        const primaryColor = this.config.colors.primary;
        energyGradient.addColorStop(0, 'transparent');
        energyGradient.addColorStop(0.7, `rgba(${primaryColor.join(',')}, ${pulseIntensity * 0.1})`);
        energyGradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = energyGradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, energyRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Scanning beam effect
        if (this.scanningAnimation) {
            const beamAngle = (this.time * 0.01) % (Math.PI * 2);
            const beamLength = radius * 1.5;
            
            this.ctx.strokeStyle = `rgba(${primaryColor.join(',')}, 0.6)`;
            this.ctx.lineWidth = 3;
            this.ctx.lineCap = 'round';
            
            // Create scanning beam
            const beamGradient = this.ctx.createLinearGradient(
                centerX, centerY,
                centerX + Math.cos(beamAngle) * beamLength,
                centerY + Math.sin(beamAngle) * beamLength
            );
            beamGradient.addColorStop(0, `rgba(${primaryColor.join(',')}, 0.8)`);
            beamGradient.addColorStop(1, 'transparent');
            
            this.ctx.strokeStyle = beamGradient;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(
                centerX + Math.cos(beamAngle) * beamLength,
                centerY + Math.sin(beamAngle) * beamLength
            );
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }

    getParticleColor(particle) {
        const colors = [
            this.config.colors.primary,
            this.config.colors.secondary,
            this.config.colors.accent,
            this.config.colors.highlight
        ];
        return colors[particle.colorIndex];
    }

    adaptPerformance() {
        if (this.fps < 25 && this.performanceLevel !== 'low') {
            this.performanceLevel = 'low';
            this.config.particleCount = Math.max(80, this.config.particleCount * 0.7);
            this.config.connectionLinesEnabled = false;
            this.config.glowEffectEnabled = false;
            this.config.trailLength = Math.max(2, Math.floor(this.config.trailLength * 0.5));
            console.log('⚡ Performance adapted to low mode');
        } else if (this.fps > 45 && this.performanceLevel === 'low') {
            this.performanceLevel = 'medium';
            this.config.connectionLinesEnabled = true;
            this.config.glowEffectEnabled = true;
            console.log('⚡ Performance improved to medium mode');
        }
    }

    setupEventListeners() {
        // Enhanced mouse/touch tracking
        let mouseTimeout;
        
        const handleMouseMove = (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.isActive = true;
            this.mouse.lastMoveTime = this.time;
            
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                this.mouse.isActive = false;
            }, 150);
        };
        
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        
        // Touch support
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.mouse.x = touch.clientX;
                this.mouse.y = touch.clientY;
                this.mouse.isActive = true;
                this.mouse.pressure = touch.force || 1;
            }
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            this.mouse.isActive = false;
        });
        
        // Window resize handling
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.handleResize(), 250);
        });
        
        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Reduced motion support
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.config.speed.min *= 0.5;
            this.config.speed.max *= 0.5;
            this.config.turbulence *= 0.3;
            this.config.connectionLinesEnabled = false;
            console.log('♿ Reduced motion mode activated');
        }
    }

    handleResize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.ctx.scale(dpr, dpr);
        
        // Update Face ID bounds
        this.findFaceIdElement();
        
        // Redistribute particles that are now outside bounds
        this.particles.forEach(particle => {
            if (particle.x > window.innerWidth + 100) {
                particle.x = Math.random() * window.innerWidth;
            }
            if (particle.y > window.innerHeight + 100) {
                particle.y = Math.random() * window.innerHeight;
            }
        });
    }

    start() {
        this.isRunning = true;
        this.animate();
    }

    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    animate() {
        if (!this.isRunning) return;
        
        this.render(performance.now());
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    // Public API methods
    addParticlesBurst(x, y, count = 30, color = null) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const velocity = Math.random() * 2 + 1;
            const size = Math.random() * 3 + 1;
            
            const burstParticle = this.createParticle(this.particles.length + i);
            burstParticle.x = x;
            burstParticle.y = y;
            burstParticle.vx = Math.cos(angle) * velocity;
            burstParticle.vy = Math.sin(angle) * velocity;
            burstParticle.size = size;
            burstParticle.baseSize = size;
            burstParticle.maxLife = 100;
            burstParticle.energy = 2;
            
            if (color) {
                burstParticle.colorIndex = 0; // Use primary color
            }
            
            this.particles.push(burstParticle);
        }
        
        // Remove burst particles after their lifetime
        setTimeout(() => {
            this.particles = this.particles.filter(p => p.maxLife > 100 || p.life > 100);
        }, 2000);
    }

    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        
        if (newConfig.particleCount !== undefined) {
            this.generateParticles();
        }
    }

    getStats() {
        return {
            fps: Math.round(this.fps),
            particleCount: this.particles.length,
            connections: this.connections.length,
            performanceLevel: this.performanceLevel,
            faceIdActive: this.faceIdActive,
            scanningAnimation: this.scanningAnimation
        };
    }

    destroy() {
        this.pause();
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        this.particles = [];
        this.connections = [];
        
        console.log('Face ID Particle Field destroyed');
    }
}

// Performance presets for different device capabilities
const FACE_ID_PARTICLE_PRESETS = {
    minimal: {
        particleCount: 80,
        connectionLinesEnabled: false,
        glowEffectEnabled: false,
        trailLength: 0,
        faceIdRadius: 150,
        mouseInfluence: 100
    },
    balanced: {
        particleCount: 150,
        connectionLinesEnabled: true,
        glowEffectEnabled: true,
        trailLength: 4,
        faceIdRadius: 200,
        mouseInfluence: 150
    },
    premium: {
        particleCount: 250,
        connectionLinesEnabled: true,
        glowEffectEnabled: true,
        trailLength: 8,
        faceIdRadius: 250,
        mouseInfluence: 200,
        bloomEffect: true
    },
    ultra: {
        particleCount: 350,
        connectionLinesEnabled: true,
        glowEffectEnabled: true,
        trailLength: 12,
        faceIdRadius: 300,
        mouseInfluence: 250,
        bloomEffect: true,
        connectionDistance: 120
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Face ID element to be initialized
    setTimeout(() => {
        const deviceScore = detectDeviceCapability();
        const preset = getOptimalPreset(deviceScore);
        const config = FACE_ID_PARTICLE_PRESETS[preset];
        
        window.faceIdParticleField = new FaceIDParticleField(config);
        
        console.log(`✨ Face ID Particle Field initialized with ${preset} preset`);
        
        // Global controls for debugging and interaction
        window.faceIdParticleControls = {
            burst: (x, y, count) => window.faceIdParticleField.addParticlesBurst(x, y, count),
            changePreset: (presetName) => {
                if (FACE_ID_PARTICLE_PRESETS[presetName]) {
                    window.faceIdParticleField.updateConfig(FACE_ID_PARTICLE_PRESETS[presetName]);
                    console.log(`🔄 Switched to ${presetName} preset`);
                }
            },
            stats: () => window.faceIdParticleField.getStats(),
            pause: () => window.faceIdParticleField.pause(),
            resume: () => window.faceIdParticleField.resume()
        };
    }, 500);
});

function detectDeviceCapability() {
    let score = 100;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android.*Tablet/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory || 2;
    
    if (isMobile && !isTablet) score -= 40;
    if (isTablet) score -= 20;
    if (cores < 4) score -= 20;
    if (memory < 4) score -= 15;
    
    // GPU test
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (gl) {
        const renderer = gl.getParameter(gl.RENDERER).toLowerCase();
        if (renderer.includes('intel') && !renderer.includes('iris')) score -= 25;
        if (renderer.includes('adreno') || renderer.includes('mali')) score -= 20;
    } else {
        score -= 40;
    }
    
    canvas.remove();
    return score;
}

function getOptimalPreset(deviceScore) {
    if (deviceScore >= 80) return 'ultra';
    if (deviceScore >= 60) return 'premium';
    if (deviceScore >= 40) return 'balanced';
    return 'minimal';
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FaceIDParticleField, FACE_ID_PARTICLE_PRESETS };
}