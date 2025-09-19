/**
 * FACEPAY MICRO-ANIMATIONS INTEGRATION
 * Integración perfecta con el sistema existente de animaciones
 * Se conecta con animations.js y se aplica automáticamente al index.html
 */

class FacePayMicroIntegration {
    constructor() {
        this.microAnimations = null;
        this.facePayAnimations = null;
        this.isIntegrated = false;
        
        this.init();
    }

    async init() {
        // Esperar a que ambos sistemas estén listos
        await this.waitForDependencies();
        
        // Integrar con el sistema existente
        this.integrateWithFacePayAnimations();
        
        // Aplicar micro-animaciones a elementos específicos
        this.enhanceExistingElements();
        
        // Configurar observadores inteligentes
        this.setupIntelligentObservers();
        
        this.isIntegrated = true;
        console.log('✨ FacePay Micro-Animations integrated successfully');
    }

    async waitForDependencies() {
        return new Promise(resolve => {
            const checkDependencies = () => {
                if (window.microAnimations && window.facePayAnimations) {
                    this.microAnimations = window.microAnimations;
                    this.facePayAnimations = window.facePayAnimations;
                    resolve();
                } else {
                    setTimeout(checkDependencies, 100);
                }
            };
            checkDependencies();
        });
    }

    integrateWithFacePayAnimations() {
        if (!this.facePayAnimations) return;

        // Extender métodos existentes con micro-animaciones
        const originalAnimateHero = this.facePayAnimations.animateHero;
        this.facePayAnimations.animateHero = () => {
            originalAnimateHero.call(this.facePayAnimations);
            this.enhanceHeroMicroAnimations();
        };

        // Integrar con animaciones de texto existentes
        const originalTypewriter = this.facePayAnimations.animateTypewriter;
        this.facePayAnimations.animateTypewriter = () => {
            this.enhanceTypewriterAnimations();
        };

        // Mejorar animaciones de botones
        this.enhanceButtonAnimations();
        
        // Integrar estados de loading
        this.integrateLoadingStates();
    }

    enhanceHeroMicroAnimations() {
        // Animar el título principal caracter por caracter
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            // Extraer palabras existentes
            const words = heroTitle.querySelectorAll('.word');
            words.forEach((word, index) => {
                setTimeout(() => {
                    this.microAnimations.createTextReveal(word, {
                        type: 'char',
                        stagger: 30,
                        delay: 0
                    });
                }, index * 200);
            });
        }

        // Animar el subtítulo
        const heroSubtitle = document.querySelector('.hero p');
        if (heroSubtitle) {
            setTimeout(() => {
                this.microAnimations.createTextReveal(heroSubtitle, {
                    type: 'char',
                    stagger: 15,
                    delay: 0
                });
            }, 1000);
        }

        // Mejorar los botones del hero
        const heroButtons = document.querySelectorAll('.hero .btn');
        heroButtons.forEach((btn, index) => {
            setTimeout(() => {
                this.microAnimations.enhanceButton(btn, {
                    bounceIntensity: 1.2,
                    magneticStrength: 0.3,
                    rippleEnabled: true
                });
            }, 1500 + (index * 200));
        });
    }

    enhanceTypewriterAnimations() {
        const typewriterElements = document.querySelectorAll('.typewriter-text');
        typewriterElements.forEach((element, index) => {
            setTimeout(() => {
                this.microAnimations.createTypewriterReveal(element, {
                    typingSpeed: 60,
                    showCursor: true
                });
            }, index * 500);
        });
    }

    enhanceButtonAnimations() {
        // Mejorar todos los botones existentes
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            this.microAnimations.enhanceButton(btn, {
                bounceIntensity: 1.1,
                magneticStrength: 0.25,
                rippleEnabled: true
            });
        });

        // Agregar estados especiales para botones CTA
        const ctaButtons = document.querySelectorAll('.btn-primary');
        ctaButtons.forEach(btn => {
            // Efecto especial al hacer hover
            btn.addEventListener('mouseenter', () => {
                this.createSuccessParticles(btn);
            });
        });
    }

    integrateLoadingStates() {
        // Interceptar la función downloadApp para agregar loading
        const originalDownloadApp = window.downloadApp;
        if (originalDownloadApp) {
            window.downloadApp = () => {
                const btn = event.target.closest('.btn');
                if (btn) {
                    const enhancement = this.microAnimations.enhanceButton(btn);
                    enhancement.setLoading(true);
                    
                    setTimeout(() => {
                        enhancement.setLoading(false);
                        this.microAnimations.showSuccessToast('¡Descarga iniciada! 🚀', {
                            position: 'top-right',
                            duration: 3000
                        });
                        originalDownloadApp();
                    }, 2000);
                } else {
                    originalDownloadApp();
                }
            };
        }

        // Mejorar la función joinBeta
        const originalJoinBeta = window.joinBeta;
        if (originalJoinBeta) {
            window.joinBeta = () => {
                const email = prompt('Enter your email for exclusive beta access:');
                if (email?.includes('@')) {
                    // Mostrar loading
                    const loader = this.microAnimations.createLiquidLoader(
                        document.body,
                        { size: 40 }
                    );
                    
                    // Simular proceso de registro
                    setTimeout(() => {
                        loader.destroy();
                        this.showBetaSuccessAnimation();
                        originalJoinBeta();
                    }, 2000);
                }
            };
        }
    }

    enhanceExistingElements() {
        // Mejorar estadísticas con animaciones de contador
        this.enhanceStatCounters();
        
        // Mejorar la sección de video
        this.enhanceVideoSection();
        
        // Agregar scroll reveals a las secciones
        this.addScrollReveals();
        
        // Mejorar formularios si existen
        this.enhanceForms();
    }

    enhanceStatCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            // Observar cuando la estadística entra en vista
            this.microAnimations.observeScrollReveal(stat.parentElement, {
                type: 'magnetic',
                duration: 600,
                reset: false,
                onReveal: () => {
                    this.animateCounterWithMicroEffects(stat);
                }
            });
        });
    }

    animateCounterWithMicroEffects(element) {
        const target = parseInt(element.getAttribute('data-count')) || 
                      parseInt(element.textContent.replace(/\D/g, '')) || 
                      0;
        
        if (target === 0) return;

        let current = 0;
        const increment = target / 60; // 1 segundo a 60fps
        const duration = 1500;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function para un efecto más suave
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            current = Math.floor(easeOutQuart * target);
            
            element.textContent = this.formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Efecto final de éxito
                this.createMiniSuccessEffect(element);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    createMiniSuccessEffect(element) {
        const rect = element.getBoundingClientRect();
        const particles = document.createElement('div');
        particles.innerHTML = '✨';
        particles.style.cssText = `
            position: fixed;
            top: ${rect.top - 20}px;
            left: ${rect.left + rect.width/2 - 10}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 9999;
            animation: miniSuccess 1s ease-out forwards;
        `;
        
        document.body.appendChild(particles);
        setTimeout(() => particles.remove(), 1000);
    }

    enhanceVideoSection() {
        const video = document.querySelector('#demoVideo, .demo-video');
        if (!video) return;

        const videoContainer = video.parentElement;
        
        // Agregar overlay de loading elegante
        video.addEventListener('loadstart', () => {
            const loader = this.microAnimations.createLiquidLoader(videoContainer, {
                size: 50
            });
            
            video.addEventListener('canplay', () => {
                loader.destroy();
            }, { once: true });
        });

        // Efecto de success cuando el video está listo
        video.addEventListener('canplaythrough', () => {
            this.createVideoReadyEffect(videoContainer);
        }, { once: true });
    }

    createVideoReadyEffect(container) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 10;
        `;
        
        container.style.position = container.style.position || 'relative';
        container.appendChild(overlay);
        
        this.microAnimations.createSuccessAnimation(overlay, {
            type: 'checkmark',
            size: 40,
            particles: false
        }).then(() => {
            setTimeout(() => overlay.remove(), 2000);
        });
    }

    addScrollReveals() {
        // Secciones principales
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            if (index === 0) return; // Skip hero section
            
            this.microAnimations.observeScrollReveal(section, {
                type: index % 2 === 0 ? 'depth' : 'magnetic',
                duration: 800,
                delay: 100,
                reset: false
            });
        });

        // Cards y elementos individuales
        const cards = document.querySelectorAll('.stat, .feature-card');
        cards.forEach((card, index) => {
            this.microAnimations.observeScrollReveal(card, {
                type: 'cascade',
                duration: 600,
                delay: index * 100,
                reset: false
            });
        });
    }

    enhanceForms() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            this.enhanceFormInput(input);
        });
    }

    enhanceFormInput(input) {
        input.addEventListener('focus', () => {
            this.createInputFocusEffect(input);
        });
        
        input.addEventListener('blur', () => {
            if (input.value.length > 0) {
                this.createInputSuccessEffect(input);
            }
        });
    }

    createInputFocusEffect(input) {
        input.style.transform = 'scale(1.02)';
        input.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            input.style.transform = 'scale(1)';
        }, 200);
    }

    createInputSuccessEffect(input) {
        const checkmark = document.createElement('div');
        checkmark.innerHTML = '✓';
        checkmark.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%) scale(0);
            color: #10b981;
            font-weight: bold;
            animation: checkmarkPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        `;
        
        input.parentElement.style.position = input.parentElement.style.position || 'relative';
        input.parentElement.appendChild(checkmark);
        
        setTimeout(() => checkmark.remove(), 2000);
    }

    setupIntelligentObservers() {
        // Observador de performance para ajustar calidad
        this.setupPerformanceObserver();
        
        // Observador de batería para dispositivos móviles
        this.setupBatteryObserver();
        
        // Observador de conexión de red
        this.setupNetworkObserver();
    }

    setupPerformanceObserver() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const checkPerformance = () => {
            frameCount++;
            const now = performance.now();
            
            if (now - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (now - lastTime));
                
                if (fps < 30) {
                    this.reduceAnimationQuality();
                } else if (fps > 55) {
                    this.increaseAnimationQuality();
                }
                
                frameCount = 0;
                lastTime = now;
            }
            
            requestAnimationFrame(checkPerformance);
        };
        
        checkPerformance();
    }

    setupBatteryObserver() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const checkBattery = () => {
                    if (battery.level < 0.2 && !battery.charging) {
                        this.enablePowerSaveMode();
                    } else {
                        this.disablePowerSaveMode();
                    }
                };
                
                battery.addEventListener('chargingchange', checkBattery);
                battery.addEventListener('levelchange', checkBattery);
                checkBattery();
            });
        }
    }

    setupNetworkObserver() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            const adaptToConnection = () => {
                if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
                    this.enableLowBandwidthMode();
                } else {
                    this.disableLowBandwidthMode();
                }
            };
            
            connection.addEventListener('change', adaptToConnection);
            adaptToConnection();
        }
    }

    reduceAnimationQuality() {
        document.documentElement.style.setProperty('--micro-fast', '0.05s');
        document.documentElement.style.setProperty('--micro-medium', '0.1s');
        console.log('🔋 Reduced animation quality for better performance');
    }

    increaseAnimationQuality() {
        document.documentElement.style.setProperty('--micro-fast', '0.15s');
        document.documentElement.style.setProperty('--micro-medium', '0.25s');
    }

    enablePowerSaveMode() {
        document.body.classList.add('power-save-mode');
        console.log('🔋 Power save mode enabled');
    }

    disablePowerSaveMode() {
        document.body.classList.remove('power-save-mode');
    }

    enableLowBandwidthMode() {
        document.body.classList.add('low-bandwidth-mode');
        console.log('📶 Low bandwidth mode enabled');
    }

    disableLowBandwidthMode() {
        document.body.classList.remove('low-bandwidth-mode');
    }

    // Efectos especiales
    createSuccessParticles(element) {
        const rect = element.getBoundingClientRect();
        const particles = ['✨', '⭐', '💫', '🌟'];
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
                particle.style.cssText = `
                    position: fixed;
                    top: ${rect.top + Math.random() * rect.height}px;
                    left: ${rect.left + Math.random() * rect.width}px;
                    font-size: 16px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: particleFloat 2s ease-out forwards;
                `;
                
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 2000);
            }, i * 100);
        }
    }

    showBetaSuccessAnimation() {
        // Crear animación de éxito para registro beta
        this.microAnimations.createSuccessAnimation(document.body, {
            type: 'celebration',
            size: 80,
            particles: true
        });
        
        this.microAnimations.showSuccessToast('🎉 ¡Bienvenido al futuro! Beta access granted', {
            position: 'top-center',
            duration: 5000
        });
    }

    // API pública
    getStatus() {
        return {
            integrated: this.isIntegrated,
            microAnimations: !!this.microAnimations,
            facePayAnimations: !!this.facePayAnimations
        };
    }

    destroy() {
        this.microAnimations?.destroy();
        this.isIntegrated = false;
    }
}

// CSS adicional para efectos especiales
const INTEGRATION_CSS = `
@keyframes miniSuccess {
    0% {
        opacity: 0;
        transform: translateY(0) scale(0);
    }
    50% {
        opacity: 1;
        transform: translateY(-30px) scale(1.2);
    }
    100% {
        opacity: 0;
        transform: translateY(-60px) scale(0.8);
    }
}

@keyframes checkmarkPop {
    0% {
        transform: translateY(-50%) scale(0);
        opacity: 0;
    }
    50% {
        transform: translateY(-50%) scale(1.3);
        opacity: 1;
    }
    100% {
        transform: translateY(-50%) scale(1);
        opacity: 1;
    }
}

@keyframes particleFloat {
    0% {
        opacity: 0;
        transform: translateY(0) scale(0) rotate(0deg);
    }
    20% {
        opacity: 1;
        transform: translateY(-20px) scale(1) rotate(90deg);
    }
    100% {
        opacity: 0;
        transform: translateY(-100px) scale(0.5) rotate(360deg);
    }
}

/* Power save mode styles */
.power-save-mode * {
    animation-duration: 0.1s !important;
    transition-duration: 0.1s !important;
}

/* Low bandwidth mode styles */
.low-bandwidth-mode .loader-liquid::before,
.low-bandwidth-mode .success-ripple::after {
    display: none;
}
`;

// Inyectar CSS de integración
const integrationStyleSheet = document.createElement('style');
integrationStyleSheet.textContent = INTEGRATION_CSS;
document.head.appendChild(integrationStyleSheet);

// Auto-inicializar cuando el DOM esté listo
let facePayMicroIntegration;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        facePayMicroIntegration = new FacePayMicroIntegration();
        window.facePayMicroIntegration = facePayMicroIntegration;
        
        console.log('🎨 FacePay Micro-Animations Integration ready');
    }, 1000);
});

// Exportar para uso externo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FacePayMicroIntegration;
}

if (typeof window !== 'undefined') {
    window.FacePayMicroIntegration = FacePayMicroIntegration;
}