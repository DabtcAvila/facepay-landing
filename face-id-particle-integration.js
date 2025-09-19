/**
 * FACEPAY FACE ID PARTICLE INTEGRATION V3.0
 * Seamless integration between Face ID scanner and particle field system
 * Handles state synchronization, visual effects, and user interactions
 */

class FaceIDParticleIntegration {
    constructor() {
        this.particleField = null;
        this.faceIDScanner = null;
        this.integrationActive = false;
        this.syncStates = {
            idle: 'idle',
            scanning: 'scanning',
            success: 'success',
            error: 'error'
        };
        this.currentState = this.syncStates.idle;
        this.observers = new Map();
        this.animationCallbacks = new Map();
        this.interactionZones = [];
        
        this.init();
    }

    async init() {
        await this.waitForComponents();
        this.setupIntegration();
        this.bindEvents();
        this.createInteractionZones();
        this.startSynchronization();
        
        console.log('✨ Face ID Particle Integration V3.0 initialized');
    }

    async waitForComponents() {
        // Wait for particle field to be ready
        const waitForParticleField = () => {
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (window.faceIdParticleField && window.faceIdParticleField.isRunning) {
                        this.particleField = window.faceIdParticleField;
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
                
                // Timeout after 10 seconds
                setTimeout(() => {
                    clearInterval(checkInterval);
                    console.warn('⚠️ Face ID Particle Field not found, continuing without particle integration');
                    resolve();
                }, 10000);
            });
        };

        // Wait for Face ID scanner to be ready
        const waitForFaceIDScanner = () => {
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (window.faceIDScanner) {
                        this.faceIDScanner = window.faceIDScanner;
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
                
                // Timeout after 10 seconds
                setTimeout(() => {
                    clearInterval(checkInterval);
                    console.warn('⚠️ Face ID Scanner not found, continuing without scanner integration');
                    resolve();
                }, 10000);
            });
        };

        await Promise.all([waitForParticleField(), waitForFaceIDScanner()]);
    }

    setupIntegration() {
        if (!this.particleField) return;

        // Apply integration CSS classes
        document.body.classList.add('particle-field-active');
        
        const faceIdElement = document.getElementById('faceScanner') || 
                             document.querySelector('.face-scanner-hero');
        
        if (faceIdElement) {
            faceIdElement.classList.add('particle-enhanced');
            
            // Add particle field integration class
            const particleCanvas = document.querySelector('.face-id-particle-field');
            if (particleCanvas) {
                particleCanvas.classList.add('particle-field-integration');
            }
        }

        this.integrationActive = true;
    }

    bindEvents() {
        if (!this.integrationActive) return;

        // Monitor Face ID scanner state changes
        this.observeFaceIDStates();
        
        // Handle user interactions
        this.setupInteractionHandlers();
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
        
        // Window events
        this.setupWindowEvents();
    }

    observeFaceIDStates() {
        if (!this.faceIDScanner) return;

        const faceIdElement = document.getElementById('faceScanner') || 
                             document.querySelector('.face-scanner-hero');
        
        if (!faceIdElement) return;

        // Use MutationObserver to watch for class changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    this.handleStateChange(faceIdElement);
                }
            });
        });

        observer.observe(faceIdElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        // Also observe scanner frame for scanning state
        const scannerFrame = faceIdElement.querySelector('.scanner-frame');
        if (scannerFrame) {
            const frameObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        this.handleStateChange(faceIdElement);
                    }
                });
            });

            frameObserver.observe(scannerFrame, {
                attributes: true,
                attributeFilter: ['class']
            });
        }

        this.observers.set('faceIdState', observer);
    }

    handleStateChange(faceIdElement) {
        if (!this.particleField || !this.integrationActive) return;

        const scannerFrame = faceIdElement.querySelector('.scanner-frame');
        const statusText = faceIdElement.querySelector('.status-text');
        
        let newState = this.syncStates.idle;
        
        // Determine current state
        if (scannerFrame && scannerFrame.classList.contains('scanning')) {
            newState = this.syncStates.scanning;
        } else if (scannerFrame && scannerFrame.classList.contains('success')) {
            newState = this.syncStates.success;
        } else if (statusText && statusText.textContent.toLowerCase().includes('error')) {
            newState = this.syncStates.error;
        }

        // Only update if state changed
        if (newState !== this.currentState) {
            this.transitionToState(newState);
            this.currentState = newState;
        }
    }

    transitionToState(newState) {
        console.log(`🔄 Face ID state transition: ${this.currentState} → ${newState}`);
        
        // Update CSS classes
        document.body.classList.remove(
            'particle-field-idle',
            'particle-field-scanning', 
            'particle-field-success',
            'particle-field-error'
        );
        document.body.classList.add(`particle-field-${newState}`);

        // Update particle field behavior
        switch (newState) {
            case this.syncStates.scanning:
                this.activateScanningMode();
                break;
            case this.syncStates.success:
                this.activateSuccessMode();
                break;
            case this.syncStates.error:
                this.activateErrorMode();
                break;
            default:
                this.activateIdleMode();
        }
    }

    activateIdleMode() {
        if (!this.particleField) return;

        // Reset particle field to normal behavior
        this.particleField.updateConfig({
            faceIdAttraction: true,
            faceIdForce: 0.002,
            speed: { min: 0.2, max: 0.8 }
        });
        
        // Remove any active animations
        this.clearAnimationCallbacks();
    }

    activateScanningMode() {
        if (!this.particleField) return;

        // Increase particle attraction to Face ID
        this.particleField.updateConfig({
            faceIdAttraction: true,
            faceIdForce: 0.004,
            speed: { min: 0.3, max: 1.2 }
        });

        // Add scanning animation callback
        const scanningAnimation = () => {
            if (this.currentState !== this.syncStates.scanning) return;
            
            // Create particle bursts around Face ID periodically
            if (Math.random() < 0.15) { // 15% chance per frame
                const bounds = this.particleField.faceIdBounds;
                const angle = Math.random() * Math.PI * 2;
                const distance = bounds.radius * (0.8 + Math.random() * 0.4);
                const x = bounds.centerX + Math.cos(angle) * distance;
                const y = bounds.centerY + Math.sin(angle) * distance;
                
                this.particleField.addParticlesBurst(x, y, 5);
            }
            
            this.animationCallbacks.set('scanning', requestAnimationFrame(scanningAnimation));
        };
        
        scanningAnimation();
    }

    activateSuccessMode() {
        if (!this.particleField) return;

        // Dramatic success effect
        this.particleField.updateConfig({
            faceIdAttraction: false, // Release particles
            speed: { min: 0.5, max: 2.0 }
        });

        // Create success burst
        const bounds = this.particleField.faceIdBounds;
        this.particleField.addParticlesBurst(bounds.centerX, bounds.centerY, 50);
        
        // Create expanding rings of particles
        for (let ring = 0; ring < 3; ring++) {
            setTimeout(() => {
                for (let i = 0; i < 20; i++) {
                    const angle = (Math.PI * 2 * i) / 20;
                    const distance = bounds.radius * (1.5 + ring * 0.5);
                    const x = bounds.centerX + Math.cos(angle) * distance;
                    const y = bounds.centerY + Math.sin(angle) * distance;
                    
                    this.particleField.addParticlesBurst(x, y, 3);
                }
            }, ring * 200);
        }

        // Return to idle after success animation
        setTimeout(() => {
            if (this.currentState === this.syncStates.success) {
                this.transitionToState(this.syncStates.idle);
            }
        }, 2000);
    }

    activateErrorMode() {
        if (!this.particleField) return;

        // Error repulsion effect
        this.particleField.updateConfig({
            faceIdAttraction: false,
            faceIdForce: -0.003, // Repulsion
            speed: { min: 0.1, max: 0.5 }
        });

        // Create error particle effect (red particles)
        const bounds = this.particleField.faceIdBounds;
        
        // Modify some particles to red temporarily
        const errorParticles = this.particleField.particles.slice(0, 30);
        errorParticles.forEach(particle => {
            particle.originalColorIndex = particle.colorIndex;
            particle.colorIndex = 2; // Red accent color
            particle.energy = 0.3; // Reduce energy for error state
        });

        // Restore particles after error state
        setTimeout(() => {
            errorParticles.forEach(particle => {
                if (particle.originalColorIndex !== undefined) {
                    particle.colorIndex = particle.originalColorIndex;
                    particle.energy = 1;
                    delete particle.originalColorIndex;
                }
            });
            
            if (this.currentState === this.syncStates.error) {
                this.transitionToState(this.syncStates.idle);
            }
        }, 1500);
    }

    setupInteractionHandlers() {
        // Enhanced mouse interactions
        let lastInteractionTime = 0;
        
        document.addEventListener('mousemove', (e) => {
            if (!this.particleField || !this.integrationActive) return;
            
            const now = Date.now();
            if (now - lastInteractionTime > 100) { // Throttle to 10fps
                // Create subtle particle trail following mouse
                if (Math.random() < 0.1) { // 10% chance
                    this.particleField.addParticlesBurst(e.clientX, e.clientY, 2);
                }
                lastInteractionTime = now;
            }
        });

        // Touch interactions for mobile
        document.addEventListener('touchmove', (e) => {
            if (!this.particleField || !this.integrationActive) return;
            
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                if (Math.random() < 0.2) { // 20% chance on mobile (more responsive)
                    this.particleField.addParticlesBurst(touch.clientX, touch.clientY, 3);
                }
            }
        }, { passive: true });

        // Click/tap interactions
        document.addEventListener('click', (e) => {
            if (!this.particleField || !this.integrationActive) return;
            
            // Create click burst
            this.particleField.addParticlesBurst(e.clientX, e.clientY, 15);
            
            // Add burst trigger animation to clicked element
            const target = e.target.closest('.particle-burst-trigger, .face-scanner-hero, .cta-button');
            if (target) {
                target.classList.add('burst-active');
                setTimeout(() => {
                    target.classList.remove('burst-active');
                }, 600);
            }
        });
    }

    createInteractionZones() {
        // Create invisible interaction zones around key elements
        const keyElements = [
            '.face-scanner-hero',
            '.cta-button',
            '.hero-title',
            '.hero-badge'
        ];

        keyElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && !element.classList.contains('particle-burst-trigger')) {
                    element.classList.add('particle-burst-trigger');
                    this.interactionZones.push(element);
                }
            });
        });
    }

    setupPerformanceMonitoring() {
        if (!this.particleField) return;

        // Monitor FPS and adjust integration intensity
        setInterval(() => {
            const stats = this.particleField.getStats();
            
            // Update performance CSS classes
            document.body.classList.remove(
                'particle-field-low-performance',
                'particle-field-medium-performance', 
                'particle-field-high-performance'
            );
            
            if (stats.fps < 25) {
                document.body.classList.add('particle-field-low-performance');
                // Reduce interaction frequency for low performance
                this.reduceInteractionIntensity();
            } else if (stats.fps < 45) {
                document.body.classList.add('particle-field-medium-performance');
            } else {
                document.body.classList.add('particle-field-high-performance');
                // Enable enhanced interactions for high performance
                this.enhanceInteractionIntensity();
            }

            // Debug logging
            if (window.faceIdParticleControls && typeof window.faceIdParticleControls.stats === 'function') {
                const debugStats = window.faceIdParticleControls.stats();
                if (debugStats.fps < 20) {
                    console.warn(`⚠️ Low FPS detected: ${debugStats.fps}fps, particles: ${debugStats.particleCount}`);
                }
            }
        }, 5000); // Check every 5 seconds
    }

    setupWindowEvents() {
        // Handle window focus/blur
        window.addEventListener('focus', () => {
            if (this.particleField && this.integrationActive) {
                this.particleField.resume();
                document.body.classList.add('particle-field-active');
            }
        });

        window.addEventListener('blur', () => {
            if (this.particleField) {
                // Don't pause completely, just reduce activity
                this.particleField.updateConfig({
                    speed: { min: 0.1, max: 0.3 }
                });
            }
        });

        // Handle resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.integrationActive) {
                    this.updateIntegrationLayout();
                }
            }, 250);
        });
    }

    updateIntegrationLayout() {
        // Recalculate interaction zones positions
        this.interactionZones.forEach(element => {
            if (element.offsetParent) {
                // Element is visible, update its interaction zone if needed
                const rect = element.getBoundingClientRect();
                // Update any position-dependent logic here
            }
        });
    }

    reduceInteractionIntensity() {
        // Reduce particle burst frequencies and counts for better performance
        this.interactionIntensityMultiplier = 0.5;
    }

    enhanceInteractionIntensity() {
        // Enhance particle interactions for high-performance devices
        this.interactionIntensityMultiplier = 1.5;
    }

    clearAnimationCallbacks() {
        this.animationCallbacks.forEach((animationId, key) => {
            cancelAnimationFrame(animationId);
        });
        this.animationCallbacks.clear();
    }

    // Public API methods
    triggerParticleBurst(x, y, intensity = 1) {
        if (!this.particleField) return;
        
        const count = Math.floor(20 * intensity * (this.interactionIntensityMultiplier || 1));
        this.particleField.addParticlesBurst(x, y, count);
    }

    setIntegrationMode(mode) {
        const modes = ['minimal', 'balanced', 'premium', 'ultra'];
        if (!modes.includes(mode) || !this.particleField) return;
        
        const presets = window.FACE_ID_PARTICLE_PRESETS || {};
        if (presets[mode]) {
            this.particleField.updateConfig(presets[mode]);
            console.log(`🎨 Integration mode set to: ${mode}`);
        }
    }

    getIntegrationStats() {
        if (!this.particleField) return null;
        
        return {
            integrationActive: this.integrationActive,
            currentState: this.currentState,
            particleStats: this.particleField.getStats(),
            interactionZones: this.interactionZones.length,
            performanceLevel: this.particleField.performanceLevel
        };
    }

    destroy() {
        // Clear all observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        
        // Clear animation callbacks
        this.clearAnimationCallbacks();
        
        // Remove CSS classes
        document.body.classList.remove(
            'particle-field-active',
            'particle-field-scanning',
            'particle-field-success',
            'particle-field-error',
            'particle-field-low-performance',
            'particle-field-medium-performance',
            'particle-field-high-performance'
        );
        
        // Remove interaction zones
        this.interactionZones.forEach(element => {
            element.classList.remove('particle-burst-trigger', 'particle-enhanced');
        });
        
        this.integrationActive = false;
        
        console.log('Face ID Particle Integration destroyed');
    }
}

// Auto-initialize integration when both components are ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit longer for all components to initialize
    setTimeout(() => {
        window.faceIdParticleIntegration = new FaceIDParticleIntegration();
        
        // Expose global controls for debugging
        window.faceIdIntegrationControls = {
            triggerBurst: (x, y, intensity) => window.faceIdParticleIntegration.triggerParticleBurst(x, y, intensity),
            setMode: (mode) => window.faceIdParticleIntegration.setIntegrationMode(mode),
            stats: () => window.faceIdParticleIntegration.getIntegrationStats(),
            destroy: () => window.faceIdParticleIntegration.destroy()
        };
    }, 1000);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FaceIDParticleIntegration };
}