// FacePay Cinematic Animations Engine - Apple Level
class FacePayAnimations {
    constructor(options = {}) {
        this.config = {
            enableParticles: true,
            enable3D: true,
            particleCount: window.innerWidth < 768 ? 15 : 30,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            ...options
        };
        
        this.elements = {};
        this.animations = new Map();
        this.init();
    }
    
    init() {
        if (this.config.reducedMotion) return this.setupReducedMotion();
        
        this.setupElements();
        this.createParticles();
        this.setupMicroInteractions();
        this.setupScrollAnimations();
        this.setupFaceIDAnimation();
        this.performanceMonitor();
    }
    
    setupElements() {
        this.elements = {
            hero: document.querySelector('.hero'),
            heroTitle: document.querySelector('.hero-title'),
            heroSubtitle: document.querySelector('.hero-subtitle'),
            faceScanners: document.querySelectorAll('.face-scanner'),
            buttons: document.querySelectorAll('.btn'),
            particles: document.querySelector('#particles') || this.createParticlesContainer()
        };
    }
    
    createParticlesContainer() {
        const container = document.createElement('div');
        container.id = 'particles';
        container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
        document.body.insertBefore(container, document.body.firstChild);
        return container;
    }
    
    createParticles() {
        if (!this.config.enableParticles) return;
        
        const container = this.elements.particles;
        
        for (let i = 0; i < this.config.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                background: ${i % 2 ? '#6366f1' : '#10b981'};
                border-radius: 50%;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                left: ${Math.random() * 100}%;
                opacity: 0.6;
                animation: float-particle ${Math.random() * 3 + 8}s infinite linear;
                animation-delay: ${Math.random() * 8}s;
                will-change: transform;
            `;
            
            container.appendChild(particle);
        }
        
        // Add CSS animation keyframes
        if (!document.querySelector('#particle-animations')) {
            const style = document.createElement('style');
            style.id = 'particle-animations';
            style.textContent = `
                @keyframes float-particle {
                    0% { transform: translateY(100vh) translateX(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.6; }
                    90% { opacity: 0.6; }
                    100% { transform: translateY(-100px) translateX(200px) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupMicroInteractions() {
        // Magnetic buttons - Apple level
        this.elements.buttons.forEach(btn => {
            btn.addEventListener('mouseenter', (e) => this.addMagneticEffect(e.target));
            btn.addEventListener('mousemove', (e) => this.updateMagneticEffect(e));
            btn.addEventListener('mouseleave', (e) => this.removeMagneticEffect(e.target));
            btn.addEventListener('click', (e) => this.createRipple(e));
        });
    }
    
    addMagneticEffect(element) {
        element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
        element.style.willChange = 'transform';
    }
    
    updateMagneticEffect(e) {
        const rect = e.target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.1;
        const deltaY = (e.clientY - centerY) * 0.1;
        
        e.target.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }
    
    removeMagneticEffect(element) {
        element.style.transform = 'translate(0px, 0px)';
        setTimeout(() => {
            element.style.willChange = 'auto';
        }, 300);
    }
    
    createRipple(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
        
        // Add haptic feedback
        if ('vibrate' in navigator) navigator.vibrate(10);
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: [0.1, 0.5, 0.9],
            rootMargin: '0px 0px -10% 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for scroll animations
        document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    }
    
    setupFaceIDAnimation() {
        this.elements.faceScanners.forEach(scanner => {
            this.createScanningEffect(scanner);
        });
    }
    
    createScanningEffect(scanner) {
        // Create scanning overlay
        const overlay = document.createElement('div');
        overlay.className = 'scan-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 2px solid #6366f1;
            border-radius: 50%;
            animation: scan-pulse 2s ease-in-out infinite;
        `;
        
        // Create corner brackets
        ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(position => {
            const corner = document.createElement('div');
            corner.className = `scan-corner ${position}`;
            corner.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                border: 2px solid #10b981;
                ${this.getCornerStyles(position)}
                animation: scan-corners 1.5s ease-in-out infinite;
            `;
            scanner.appendChild(corner);
        });
        
        scanner.appendChild(overlay);
    }
    
    getCornerStyles(position) {
        const styles = {
            'top-left': 'top: -2px; left: -2px; border-right: none; border-bottom: none;',
            'top-right': 'top: -2px; right: -2px; border-left: none; border-bottom: none;',
            'bottom-left': 'bottom: -2px; left: -2px; border-right: none; border-top: none;',
            'bottom-right': 'bottom: -2px; right: -2px; border-left: none; border-top: none;'
        };
        return styles[position];
    }
    
    setupReducedMotion() {
        // Fallback for reduced motion
        document.documentElement.classList.add('reduced-motion');
    }
    
    performanceMonitor() {
        let fps = 0;
        let lastTime = performance.now();
        
        const monitor = () => {
            const currentTime = performance.now();
            fps = 1000 / (currentTime - lastTime);
            lastTime = currentTime;
            
            if (fps < 30 && this.config.particleCount > 10) {
                this.optimizePerformance();
            }
            
            requestAnimationFrame(monitor);
        };
        
        requestAnimationFrame(monitor);
    }
    
    optimizePerformance() {
        // Reduce particle count
        this.config.particleCount = Math.max(5, this.config.particleCount * 0.7);
        
        // Disable 3D effects
        this.config.enable3D = false;
        
        console.log('FacePay: Performance optimization activated');
    }
}

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes scan-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.05); }
    }
    
    @keyframes scan-corners {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
    
    @keyframes ripple {
        to { transform: scale(2); opacity: 0; }
    }
    
    .animate-in {
        animation: slideInUp 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
    }
    
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
`;

document.head.appendChild(animationStyles);

// Auto-initialize
window.addEventListener('DOMContentLoaded', () => {
    window.facePayAnimations = new FacePayAnimations();
});