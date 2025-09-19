/* 
======================================================================
🚀 HOLOGRAM FACE ID COMPONENT - STANDALONE VERSION
Easy Integration | Perfect Performance | Incredible Visual Impact
======================================================================
*/

class HologramFaceIDComponent {
    constructor(options = {}) {
        this.options = {
            containerId: options.containerId || 'hologram-faceid',
            size: options.size || 320,
            autoDemo: options.autoDemo !== false,
            autoDemoDelay: options.autoDemoDelay || 5000,
            scanDuration: options.scanDuration || 3500,
            resetDelay: options.resetDelay || 4000,
            enableParticles: options.enableParticles !== false,
            enableSound: options.enableSound || false,
            theme: options.theme || 'default',
            mobile: options.mobile !== false,
            ...options
        };
        
        this.container = null;
        this.elements = {};
        this.state = {
            isScanning: false,
            scanComplete: false,
            autoDemo: this.options.autoDemo
        };
        this.timers = {};
        
        this.init();
    }
    
    init() {
        this.createContainer();
        this.injectStyles();
        this.buildStructure();
        this.bindEvents();
        this.startAutoDemo();
        
        if (this.options.enableSound) {
            this.initAudio();
        }
    }
    
    createContainer() {
        const existingContainer = document.getElementById(this.options.containerId);
        if (existingContainer) {
            this.container = existingContainer;
            this.container.innerHTML = '';
        } else {
            this.container = document.createElement('div');
            this.container.id = this.options.containerId;
            document.body.appendChild(this.container);
        }
        
        // Apply container styles
        this.container.className = 'hologram-faceid-container';
        this.container.style.width = this.options.size + 'px';
        this.container.style.height = this.options.size + 'px';
        
        // Mobile optimization
        if (this.options.mobile && window.innerWidth <= 768) {
            this.container.style.width = Math.min(this.options.size, window.innerWidth - 40) + 'px';
            this.container.style.height = Math.min(this.options.size, window.innerWidth - 40) + 'px';
        }
    }
    
    injectStyles() {
        if (!document.getElementById('hologram-faceid-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'hologram-faceid-styles';
            styleSheet.textContent = this.getComponentStyles();
            document.head.appendChild(styleSheet);
        }
    }
    
    getComponentStyles() {
        return `
            /* Hologram Face ID Component Styles */
            :root {
                --holo-primary: #00ff88;
                --holo-secondary: #0088ff;
                --holo-tertiary: #ff0088;
                --holo-cyan: #00ffff;
                --holo-purple: #8800ff;
                --holo-orange: #ff8800;
                --perspective: 1200px;
                --transform-style: preserve-3d;
                --backface-visibility: hidden;
                --will-change: transform, opacity, filter;
                --holo-duration-fast: 0.3s;
                --holo-duration-medium: 0.8s;
                --holo-duration-slow: 2s;
                --holo-easing: cubic-bezier(0.23, 1, 0.320, 1);
                --holo-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            
            .hologram-faceid-container {
                position: relative;
                margin: 2rem auto;
                perspective: var(--perspective);
                perspective-origin: center center;
                transform-style: var(--transform-style);
                cursor: pointer;
                user-select: none;
                will-change: var(--will-change);
                contain: layout style paint;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            
            .holo-energy-field {
                position: absolute;
                width: 150%;
                height: 150%;
                top: -25%;
                left: -25%;
                background: 
                    radial-gradient(circle at 20% 80%, rgba(0, 255, 136, 0.03) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(0, 136, 255, 0.03) 0%, transparent 50%),
                    radial-gradient(circle at 40% 40%, rgba(255, 0, 136, 0.02) 0%, transparent 50%);
                animation: energyField 8s ease-in-out infinite;
                pointer-events: none;
                transform: translateZ(-10px);
            }
            
            @keyframes energyField {
                0%, 100% {
                    transform: translateZ(-10px) rotate(0deg) scale(1);
                    opacity: 0.6;
                }
                50% {
                    transform: translateZ(-5px) rotate(180deg) scale(1.1);
                    opacity: 1;
                }
            }
            
            .holo-particles {
                position: absolute;
                width: 100%;
                height: 100%;
                overflow: hidden;
                pointer-events: none;
                transform: translateZ(200px);
            }
            
            .holo-particle {
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--holo-primary);
                border-radius: 50%;
                animation: particleFloat 6s linear infinite;
                opacity: 0;
            }
            
            .holo-particle:nth-child(odd) {
                background: var(--holo-secondary);
                animation-delay: -2s;
            }
            
            .holo-particle:nth-child(3n) {
                background: var(--holo-cyan);
                animation-delay: -4s;
            }
            
            @keyframes particleFloat {
                0% {
                    transform: translateY(100vh) translateX(0) scale(0) rotate(0deg);
                    opacity: 0;
                }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% {
                    transform: translateY(-20px) translateX(50px) scale(1) rotate(360deg);
                    opacity: 0;
                }
            }
            
            .holo-pulse-ring {
                position: absolute;
                top: 50%;
                left: 50%;
                border: 2px solid var(--holo-primary);
                border-radius: 50%;
                transform-origin: center;
                will-change: var(--will-change);
                opacity: 0;
            }
            
            .holo-pulse-ring:nth-child(1) {
                width: 100%;
                height: 100%;
                transform: translate(-50%, -50%) translateZ(30px);
                animation: holoPulse1 3s ease-out infinite;
            }
            
            .holo-pulse-ring:nth-child(2) {
                width: 120%;
                height: 120%;
                transform: translate(-50%, -50%) translateZ(25px);
                animation: holoPulse2 3s ease-out infinite;
                animation-delay: 0.5s;
                border-color: var(--holo-secondary);
            }
            
            .holo-pulse-ring:nth-child(3) {
                width: 140%;
                height: 140%;
                transform: translate(-50%, -50%) translateZ(20px);
                animation: holoPulse3 3s ease-out infinite;
                animation-delay: 1s;
                border-color: var(--holo-cyan);
            }
            
            .holo-pulse-ring:nth-child(4) {
                width: 160%;
                height: 160%;
                transform: translate(-50%, -50%) translateZ(15px);
                animation: holoPulse4 3s ease-out infinite;
                animation-delay: 1.5s;
                border-color: var(--holo-tertiary);
            }
            
            @keyframes holoPulse1 {
                0% {
                    transform: translate(-50%, -50%) translateZ(30px) scale(0.8) rotateX(0deg);
                    opacity: 1;
                    border-width: 3px;
                }
                100% {
                    transform: translate(-50%, -50%) translateZ(50px) scale(2) rotateX(360deg);
                    opacity: 0;
                    border-width: 1px;
                }
            }
            
            @keyframes holoPulse2 {
                0% {
                    transform: translate(-50%, -50%) translateZ(25px) scale(0.8) rotateY(0deg);
                    opacity: 1;
                    border-width: 2px;
                }
                100% {
                    transform: translate(-50%, -50%) translateZ(45px) scale(1.8) rotateY(360deg);
                    opacity: 0;
                    border-width: 1px;
                }
            }
            
            @keyframes holoPulse3 {
                0% {
                    transform: translate(-50%, -50%) translateZ(20px) scale(0.8) rotateZ(0deg);
                    opacity: 1;
                    border-width: 2px;
                }
                100% {
                    transform: translate(-50%, -50%) translateZ(40px) scale(1.6) rotateZ(360deg);
                    opacity: 0;
                    border-width: 0.5px;
                }
            }
            
            @keyframes holoPulse4 {
                0% {
                    transform: translate(-50%, -50%) translateZ(15px) scale(0.8) rotateX(180deg);
                    opacity: 1;
                    border-width: 1px;
                }
                100% {
                    transform: translate(-50%, -50%) translateZ(35px) scale(1.4) rotateX(540deg);
                    opacity: 0;
                    border-width: 0.5px;
                }
            }
            
            .hologram-base {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                transform-style: var(--transform-style);
                transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px);
                will-change: var(--will-change);
                transition: transform var(--holo-duration-medium) var(--holo-easing);
            }
            
            .hologram-frame {
                position: absolute;
                width: 100%;
                height: 100%;
                border: 3px solid transparent;
                border-radius: 50%;
                background: 
                    linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 136, 255, 0.05)),
                    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1), transparent 50%);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                background-image: 
                    conic-gradient(from 0deg, 
                        var(--holo-primary) 0deg, 
                        var(--holo-secondary) 90deg, 
                        var(--holo-tertiary) 180deg, 
                        var(--holo-cyan) 270deg, 
                        var(--holo-primary) 360deg
                    );
                background-size: 100% 100%;
                background-clip: padding-box;
                transform: translateZ(20px);
                will-change: var(--will-change);
                box-shadow: 
                    inset 0 0 60px rgba(0, 255, 136, 0.1),
                    0 0 80px rgba(0, 255, 136, 0.2),
                    0 0 120px rgba(0, 136, 255, 0.15),
                    0 0 200px rgba(0, 255, 136, 0.08);
                backface-visibility: var(--backface-visibility);
                filter: contrast(1.2);
            }
            
            .hologram-frame::before {
                content: '';
                position: absolute;
                inset: 3px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                z-index: -1;
            }
            
            .holo-scan-layer-1,
            .holo-scan-layer-2,
            .holo-scan-layer-3,
            .holo-scan-layer-4 {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 80%;
                height: 80%;
                border: 2px solid transparent;
                border-radius: 50%;
                transform-origin: center;
                will-change: var(--will-change);
                opacity: 0.8;
            }
            
            .holo-scan-layer-1 {
                transform: translate(-50%, -50%) translateZ(40px) rotateX(15deg);
                border-image: linear-gradient(45deg, var(--holo-primary), var(--holo-secondary)) 1;
                animation: holoRotate1 8s linear infinite;
            }
            
            .holo-scan-layer-2 {
                transform: translate(-50%, -50%) translateZ(30px) rotateY(15deg);
                border-image: linear-gradient(135deg, var(--holo-cyan), var(--holo-purple)) 1;
                animation: holoRotate2 12s linear infinite reverse;
                width: 90%;
                height: 90%;
            }
            
            .holo-scan-layer-3 {
                transform: translate(-50%, -50%) translateZ(50px) rotateX(-10deg) rotateY(10deg);
                border-image: linear-gradient(90deg, var(--holo-tertiary), var(--holo-orange)) 1;
                animation: holoRotate3 10s linear infinite;
                width: 70%;
                height: 70%;
            }
            
            .holo-scan-layer-4 {
                transform: translate(-50%, -50%) translateZ(60px) rotateZ(45deg);
                border-image: linear-gradient(45deg, var(--holo-primary), var(--holo-secondary)) 1;
                animation: holoRotate4 15s linear infinite reverse;
                width: 110%;
                height: 110%;
                opacity: 0.4;
            }
            
            @keyframes holoRotate1 {
                0% { transform: translate(-50%, -50%) translateZ(40px) rotateX(15deg) rotateZ(0deg); }
                100% { transform: translate(-50%, -50%) translateZ(40px) rotateX(15deg) rotateZ(360deg); }
            }
            
            @keyframes holoRotate2 {
                0% { transform: translate(-50%, -50%) translateZ(30px) rotateY(15deg) rotateZ(0deg); }
                100% { transform: translate(-50%, -50%) translateZ(30px) rotateY(15deg) rotateZ(360deg); }
            }
            
            @keyframes holoRotate3 {
                0% { transform: translate(-50%, -50%) translateZ(50px) rotateX(-10deg) rotateY(10deg) rotateZ(0deg); }
                100% { transform: translate(-50%, -50%) translateZ(50px) rotateX(-10deg) rotateY(10deg) rotateZ(360deg); }
            }
            
            @keyframes holoRotate4 {
                0% { transform: translate(-50%, -50%) translateZ(60px) rotateZ(45deg) rotateY(0deg); }
                100% { transform: translate(-50%, -50%) translateZ(60px) rotateZ(45deg) rotateY(360deg); }
            }
            
            .holo-face-outline {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 45%;
                height: 55%;
                transform: translate(-50%, -50%) translateZ(70px) rotateX(5deg);
                border: 2px solid var(--holo-primary);
                border-radius: 50% 50% 60% 60%;
                background: 
                    radial-gradient(ellipse at center, 
                        rgba(0, 255, 136, 0.05) 0%, 
                        transparent 70%
                    );
                box-shadow: 
                    inset 0 0 30px rgba(0, 255, 136, 0.2),
                    0 0 50px rgba(0, 255, 136, 0.4),
                    0 0 100px rgba(0, 255, 136, 0.2);
                will-change: var(--will-change);
                animation: faceOutlinePulse 3s ease-in-out infinite alternate;
            }
            
            @keyframes faceOutlinePulse {
                0% { 
                    transform: translate(-50%, -50%) translateZ(70px) rotateX(5deg) scale(1);
                    opacity: 0.8;
                    filter: hue-rotate(0deg);
                }
                100% { 
                    transform: translate(-50%, -50%) translateZ(70px) rotateX(5deg) scale(1.05);
                    opacity: 1;
                    filter: hue-rotate(30deg);
                }
            }
            
            .holo-biometric-dots {
                position: absolute;
                width: 100%;
                height: 100%;
                transform: translateZ(80px);
                will-change: var(--will-change);
            }
            
            .holo-bio-dot {
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--holo-primary);
                border-radius: 50%;
                transform-style: var(--transform-style);
                will-change: var(--will-change);
                box-shadow: 
                    0 0 20px var(--holo-primary),
                    0 0 40px rgba(0, 255, 136, 0.5),
                    0 0 60px rgba(0, 255, 136, 0.3);
                animation: bioFloating 4s ease-in-out infinite;
                opacity: 0.6;
            }
            
            @keyframes bioFloating {
                0%, 100% { 
                    opacity: 0.6;
                    transform: translate(-50%, -50%) scale(1) rotate(0deg);
                }
                50% { 
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.5) rotate(180deg);
                    filter: hue-rotate(60deg);
                }
            }
            
            .holo-scanning-line {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 75%;
                height: 3px;
                background: linear-gradient(90deg, 
                    transparent 0%, 
                    var(--holo-primary) 20%, 
                    var(--holo-cyan) 50%, 
                    var(--holo-primary) 80%, 
                    transparent 100%
                );
                transform-origin: center;
                transform: translate(-50%, -50%) translateZ(110px);
                will-change: var(--will-change);
                box-shadow: 
                    0 0 20px var(--holo-primary),
                    0 0 40px var(--holo-cyan),
                    0 0 80px rgba(0, 255, 136, 0.3);
                animation: holoScanLine 2s linear infinite;
                opacity: 0.9;
                border-radius: 2px;
            }
            
            @keyframes holoScanLine {
                0% { 
                    transform: translate(-50%, -50%) translateZ(110px) rotateZ(0deg);
                    opacity: 0.5;
                }
                25% { 
                    transform: translate(-50%, -50%) translateZ(120px) rotateZ(90deg);
                    opacity: 1;
                }
                50% { 
                    transform: translate(-50%, -50%) translateZ(110px) rotateZ(180deg);
                    opacity: 0.8;
                }
                75% { 
                    transform: translate(-50%, -50%) translateZ(105px) rotateZ(270deg);
                    opacity: 1;
                }
                100% { 
                    transform: translate(-50%, -50%) translateZ(110px) rotateZ(360deg);
                    opacity: 0.5;
                }
            }
            
            .holo-success-checkmark {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 60px;
                height: 60px;
                transform: translate(-50%, -50%) translateZ(120px) scale(0) rotateY(180deg);
                opacity: 0;
                will-change: var(--will-change);
                transition: all var(--holo-duration-medium) var(--holo-bounce);
            }
            
            .holo-success-checkmark.show {
                transform: translate(-50%, -50%) translateZ(120px) scale(1) rotateY(0deg);
                opacity: 1;
                animation: successCelebration 2s ease-out infinite;
            }
            
            .holo-checkmark-circle {
                width: 100%;
                height: 100%;
                border: 3px solid var(--holo-primary);
                border-radius: 50%;
                background: 
                    radial-gradient(circle at center, 
                        rgba(0, 255, 136, 0.2) 0%, 
                        rgba(0, 255, 136, 0.05) 50%, 
                        transparent 100%
                    );
                display: flex;
                align-items: center;
                justify-content: center;
                transform-style: var(--transform-style);
                box-shadow: 
                    inset 0 0 30px rgba(0, 255, 136, 0.3),
                    0 0 50px var(--holo-primary),
                    0 0 100px rgba(0, 255, 136, 0.4),
                    0 0 150px rgba(0, 255, 136, 0.2);
            }
            
            .holo-checkmark-path {
                width: 24px;
                height: 24px;
                stroke: var(--holo-primary);
                stroke-width: 4;
                stroke-linecap: round;
                stroke-linejoin: round;
                fill: none;
                stroke-dasharray: 30;
                stroke-dashoffset: 30;
                filter: drop-shadow(0 0 10px var(--holo-primary));
            }
            
            .holo-checkmark-path.animate {
                animation: drawHoloCheckmark var(--holo-duration-medium) var(--holo-easing) forwards;
            }
            
            @keyframes drawHoloCheckmark {
                to { stroke-dashoffset: 0; }
            }
            
            @keyframes successCelebration {
                0%, 100% { 
                    transform: translate(-50%, -50%) translateZ(120px) scale(1) rotateY(0deg);
                    filter: hue-rotate(0deg);
                }
                50% { 
                    transform: translate(-50%, -50%) translateZ(140px) scale(1.1) rotateY(180deg);
                    filter: hue-rotate(120deg);
                }
            }
            
            .holo-status-text {
                position: absolute;
                bottom: -60px;
                left: 50%;
                transform: translateX(-50%) translateZ(150px);
                font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
                font-size: 14px;
                font-weight: 600;
                color: var(--holo-primary);
                text-align: center;
                letter-spacing: 2px;
                text-transform: uppercase;
                will-change: var(--will-change);
                text-shadow: 
                    0 0 10px var(--holo-primary),
                    0 0 20px rgba(0, 255, 136, 0.5),
                    0 0 40px rgba(0, 255, 136, 0.3);
                animation: textGlow 2s ease-in-out infinite alternate;
            }
            
            @keyframes textGlow {
                0% { 
                    opacity: 0.8;
                    filter: hue-rotate(0deg);
                    transform: translateX(-50%) translateZ(150px) scale(1);
                }
                100% { 
                    opacity: 1;
                    filter: hue-rotate(60deg);
                    transform: translateX(-50%) translateZ(155px) scale(1.02);
                }
            }
            
            .holo-status-text.scanning {
                color: var(--holo-cyan);
                text-shadow: 
                    0 0 10px var(--holo-cyan),
                    0 0 20px rgba(0, 255, 255, 0.5),
                    0 0 40px rgba(0, 255, 255, 0.3);
            }
            
            .holo-status-text.success {
                color: var(--holo-primary);
                animation: successTextPulse 1s ease-in-out 3;
            }
            
            @keyframes successTextPulse {
                0%, 100% { 
                    transform: translateX(-50%) translateZ(150px) scale(1);
                    opacity: 1;
                }
                50% { 
                    transform: translateX(-50%) translateZ(160px) scale(1.1);
                    opacity: 0.8;
                }
            }
            
            /* Interactive Effects */
            .hologram-faceid-container:hover .hologram-base {
                transform: rotateX(10deg) rotateY(10deg) scale(1.05);
            }
            
            .hologram-faceid-container:hover .hologram-frame {
                box-shadow: 
                    inset 0 0 80px rgba(0, 255, 136, 0.15),
                    0 0 100px rgba(0, 255, 136, 0.3),
                    0 0 150px rgba(0, 136, 255, 0.2),
                    0 0 250px rgba(0, 255, 136, 0.1);
            }
            
            .hologram-faceid-container:active {
                transform: scale(0.98);
                transition: transform var(--holo-duration-fast) ease-out;
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .hologram-faceid-container {
                    margin: 1rem auto;
                }
                
                .holo-status-text {
                    font-size: 12px;
                    bottom: -50px;
                }
            }
            
            /* Accessibility */
            @media (prefers-reduced-motion: reduce) {
                .hologram-faceid-container *,
                .hologram-faceid-container *::before,
                .hologram-faceid-container *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
                
                .hologram-base {
                    transform: none !important;
                }
            }
            
            /* Performance Optimizations */
            .hologram-faceid-container,
            .hologram-faceid-container * {
                will-change: var(--will-change);
                transform: translateZ(0);
                backface-visibility: var(--backface-visibility);
                -webkit-transform-style: preserve-3d;
                -webkit-backface-visibility: hidden;
                -webkit-perspective: var(--perspective);
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
        `;
    }
    
    buildStructure() {
        this.container.innerHTML = `
            <div class="holo-energy-field"></div>
            <div class="holo-particles" id="holo-particles"></div>
            <div class="holo-pulse-ring"></div>
            <div class="holo-pulse-ring"></div>
            <div class="holo-pulse-ring"></div>
            <div class="holo-pulse-ring"></div>
            <div class="hologram-base" id="holo-base">
                <div class="hologram-frame"></div>
                <div class="holo-scan-layer-1"></div>
                <div class="holo-scan-layer-2"></div>
                <div class="holo-scan-layer-3"></div>
                <div class="holo-scan-layer-4"></div>
                <div class="holo-face-outline"></div>
                <div class="holo-biometric-dots" id="holo-bio-dots">
                    ${this.createBiometricDots()}
                </div>
                <div class="holo-scanning-line"></div>
                <div class="holo-success-checkmark" id="holo-checkmark">
                    <div class="holo-checkmark-circle">
                        <svg class="holo-checkmark-path" viewBox="0 0 24 24">
                            <path d="M20 6L9 17l-5-5"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="holo-status-text" id="holo-status">Face ID Ready</div>
        `;
        
        // Store element references
        this.elements = {
            base: this.container.querySelector('#holo-base'),
            statusText: this.container.querySelector('#holo-status'),
            checkmark: this.container.querySelector('#holo-checkmark'),
            bioDots: this.container.querySelector('#holo-bio-dots'),
            particles: this.container.querySelector('#holo-particles')
        };
        
        // Create particles if enabled
        if (this.options.enableParticles) {
            this.createParticles();
        }
    }
    
    createBiometricDots() {
        const positions = [
            { left: '50%', top: '20%', z: 90, delay: 0 },
            { left: '30%', top: '35%', z: 85, delay: 0.5 },
            { left: '70%', top: '35%', z: 95, delay: 1 },
            { left: '25%', top: '50%', z: 88, delay: 1.5 },
            { left: '75%', top: '50%', z: 92, delay: 2 },
            { left: '50%', top: '55%', z: 100, delay: 2.5 },
            { left: '35%', top: '70%', z: 87, delay: 3 },
            { left: '65%', top: '70%', z: 93, delay: 3.5 },
            { left: '50%', top: '80%', z: 85, delay: 4 }
        ];
        
        return positions.map((pos, index) => `
            <div class="holo-bio-dot" 
                 style="left: ${pos.left}; top: ${pos.top}; transform: translate(-50%, -50%) translateZ(${pos.z}px); animation-delay: ${pos.delay}s;">
            </div>
        `).join('');
    }
    
    createParticles() {
        const particleCount = this.options.mobile && window.innerWidth <= 768 ? 10 : 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'holo-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (3 + Math.random() * 3) + 's';
            this.elements.particles.appendChild(particle);
        }
    }
    
    bindEvents() {
        // Mouse tracking for 3D effects (desktop only)
        if (window.innerWidth > 768) {
            this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.container.addEventListener('mouseleave', () => this.handleMouseLeave());
        }
        
        // Click/Touch interaction
        this.container.addEventListener('click', (e) => this.handleClick(e));
        this.container.addEventListener('touchstart', (e) => this.handleTouch(e));
        
        // Intersection Observer for auto-demo
        if (window.IntersectionObserver) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && this.state.autoDemo) {
                        this.startAutoDemo();
                    } else {
                        this.clearAutoDemo();
                    }
                });
            }, { threshold: 0.3 });
            
            this.observer.observe(this.container);
        }
    }
    
    handleMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        const rotateX = (mouseY / rect.height) * 20;
        const rotateY = (mouseX / rect.width) * 20;
        
        this.elements.base.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    handleMouseLeave() {
        if (!this.state.isScanning) {
            this.elements.base.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
    }
    
    handleClick(e) {
        this.createRippleEffect(e);
        this.handleInteraction();
    }
    
    handleTouch(e) {
        e.preventDefault();
        this.createRippleEffect(e.touches[0]);
        this.handleInteraction();
    }
    
    handleInteraction() {
        if (this.state.scanComplete) {
            this.reset();
        } else if (!this.state.isScanning) {
            this.clearAutoDemo();
            this.startScan();
        }
    }
    
    createRippleEffect(event) {
        const rect = this.container.getBoundingClientRect();
        const ripple = document.createElement('div');
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${event.clientX - rect.left - size / 2}px;
            top: ${event.clientY - rect.top - size / 2}px;
            background: radial-gradient(circle, rgba(0, 255, 136, 0.3), transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleExpand 0.8s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        `;
        
        this.container.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    }
    
    startAutoDemo() {
        this.clearAutoDemo();
        if (this.state.autoDemo) {
            this.timers.autoDemo = setTimeout(() => {
                if (!this.state.isScanning && !this.state.scanComplete) {
                    this.startScan();
                }
            }, this.options.autoDemoDelay);
        }
    }
    
    clearAutoDemo() {
        if (this.timers.autoDemo) {
            clearTimeout(this.timers.autoDemo);
            this.timers.autoDemo = null;
        }
    }
    
    startScan() {
        if (this.state.isScanning) return;
        
        this.state.isScanning = true;
        this.state.scanComplete = false;
        
        // Update status
        this.elements.statusText.textContent = 'Scanning Face...';
        this.elements.statusText.className = 'holo-status-text scanning';
        
        // Animate biometric dots
        const dots = this.elements.bioDots.querySelectorAll('.holo-bio-dot');
        dots.forEach((dot, index) => {
            setTimeout(() => {
                if (this.state.isScanning) {
                    dot.style.opacity = '1';
                    dot.style.transform = dot.style.transform.replace(/scale\([^)]*\)/, '') + ' scale(1.5)';
                    dot.style.boxShadow = `
                        0 0 20px var(--holo-primary),
                        0 0 40px rgba(0, 255, 136, 0.8),
                        0 0 60px rgba(0, 255, 136, 0.5)
                    `;
                }
            }, index * 150 + Math.random() * 200);
        });
        
        // 3D scan effect
        this.elements.base.style.transition = 'transform 2s ease-in-out';
        this.elements.base.style.transform = 'rotateX(10deg) rotateY(15deg) rotateZ(5deg) scale(1.02)';
        
        // Play sound if enabled
        if (this.options.enableSound && this.sounds) {
            this.sounds.scan.play().catch(() => {});
        }
        
        // Complete scan
        this.timers.scan = setTimeout(() => {
            this.completeScan();
        }, this.options.scanDuration);
    }
    
    completeScan() {
        this.state.isScanning = false;
        this.state.scanComplete = true;
        
        // Success state
        this.elements.statusText.textContent = 'Authenticated ✓';
        this.elements.statusText.className = 'holo-status-text success';
        
        // Show success checkmark
        this.elements.checkmark.classList.add('show');
        const checkmarkPath = this.elements.checkmark.querySelector('.holo-checkmark-path');
        if (checkmarkPath) {
            checkmarkPath.classList.add('animate');
        }
        
        // Success 3D animation
        this.elements.base.style.transform = 'rotateX(0deg) rotateY(360deg) rotateZ(0deg) scale(1.1)';
        
        // Update biometric dots to success state
        const dots = this.elements.bioDots.querySelectorAll('.holo-bio-dot');
        dots.forEach((dot, index) => {
            setTimeout(() => {
                dot.style.backgroundColor = 'var(--holo-primary)';
                dot.style.boxShadow = `
                    0 0 25px var(--holo-primary),
                    0 0 50px rgba(0, 255, 136, 1),
                    0 0 75px rgba(0, 255, 136, 0.7)
                `;
            }, index * 100);
        });
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 200]);
        }
        
        // Play success sound
        if (this.options.enableSound && this.sounds) {
            this.sounds.success.play().catch(() => {});
        }
        
        // Trigger success callback
        if (this.options.onSuccess) {
            this.options.onSuccess();
        }
        
        // Auto-reset
        this.timers.reset = setTimeout(() => {
            this.reset();
            this.startAutoDemo();
        }, this.options.resetDelay);
    }
    
    reset() {
        this.state.isScanning = false;
        this.state.scanComplete = false;
        
        // Clear timers
        Object.values(this.timers).forEach(timer => {
            if (timer) clearTimeout(timer);
        });
        this.timers = {};
        
        // Reset status
        this.elements.statusText.textContent = 'Face ID Ready';
        this.elements.statusText.className = 'holo-status-text';
        
        // Reset 3D transform
        this.elements.base.style.transition = 'transform 0.8s ease-out';
        this.elements.base.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)';
        
        // Reset checkmark
        this.elements.checkmark.classList.remove('show');
        const checkmarkPath = this.elements.checkmark.querySelector('.holo-checkmark-path');
        if (checkmarkPath) {
            checkmarkPath.classList.remove('animate');
        }
        
        // Reset biometric dots
        const dots = this.elements.bioDots.querySelectorAll('.holo-bio-dot');
        dots.forEach(dot => {
            dot.style.opacity = '0.6';
            dot.style.transform = dot.style.transform.replace(/scale\([^)]*\)/, '') + ' scale(1)';
            dot.style.backgroundColor = 'var(--holo-primary)';
            dot.style.boxShadow = `
                0 0 20px var(--holo-primary),
                0 0 40px rgba(0, 255, 136, 0.5),
                0 0 60px rgba(0, 255, 136, 0.3)
            `;
        });
        
        // Trigger reset callback
        if (this.options.onReset) {
            this.options.onReset();
        }
    }
    
    initAudio() {
        this.sounds = {
            scan: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBjmR2O/GdCYGLIHM8tiJNwgZZ7zs56BPFAxRqODwtWMcBjiS2O/GdCYFLYDO8tiKOQcYZ7vr56JQFAxSqODwtWMdBjmS2e7GdCYGLX/P8tiKOQcYZ7zs56BOEw1Tq+Dwt2McBjqR2e7GdSUGLYDO8tiJOAcZaLvs56JQFAxRp+HvtmQdBjiS2e7GdCYGLYDO8tiJOAcZaLrr56JQFAxSp+DwtmMcBj='), 
            success: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBjmR2O/GdCYGLIHM8tiJNwgZZ7zs56BPFAxRqODwtWMcBjiS2O/GdCYFLYDO8tiKOQcYZ7vr56JQFAxSqODwtWMdBjmS2e7GdCYGLX/P8tiKOQcYZ7zs56BOEw1Tq+Dwt2McBjqR2e7GdSUGLYDO8tiJOAcZaLvs56JQFAxRp+HvtmQdBjiS2e7GdCYGLYDO8tiJOAcZaLrr56JQFAxSp+DwtmMcBj=')
        };
    }
    
    // Public API Methods
    scan() {
        this.startScan();
        return this;
    }
    
    stop() {
        this.reset();
        return this;
    }
    
    toggleAutoDemo() {
        this.state.autoDemo = !this.state.autoDemo;
        if (this.state.autoDemo) {
            this.startAutoDemo();
        } else {
            this.clearAutoDemo();
        }
        return this.state.autoDemo;
    }
    
    destroy() {
        // Clear all timers
        Object.values(this.timers).forEach(timer => {
            if (timer) clearTimeout(timer);
        });
        
        // Disconnect observer
        if (this.observer) {
            this.observer.disconnect();
        }
        
        // Remove event listeners
        this.container.replaceWith(this.container.cloneNode(true));
        
        // Clear references
        this.container = null;
        this.elements = {};
        this.state = {};
        this.timers = {};
    }
    
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        
        // Apply size changes
        if (newOptions.size) {
            this.container.style.width = newOptions.size + 'px';
            this.container.style.height = newOptions.size + 'px';
        }
        
        // Apply auto-demo changes
        if (newOptions.autoDemo !== undefined) {
            this.state.autoDemo = newOptions.autoDemo;
            if (newOptions.autoDemo) {
                this.startAutoDemo();
            } else {
                this.clearAutoDemo();
            }
        }
        
        return this;
    }
}

// Auto-inject ripple animation CSS
if (!document.getElementById('hologram-ripple-animation')) {
    const rippleCSS = document.createElement('style');
    rippleCSS.id = 'hologram-ripple-animation';
    rippleCSS.textContent = `
        @keyframes rippleExpand {
            0% { 
                transform: scale(0);
                opacity: 1;
            }
            100% { 
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleCSS);
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HologramFaceIDComponent;
} else if (typeof define === 'function' && define.amd) {
    define([], () => HologramFaceIDComponent);
} else {
    window.HologramFaceIDComponent = HologramFaceIDComponent;
}

// Quick initialization helper
window.createHologramFaceID = function(options = {}) {
    return new HologramFaceIDComponent(options);
};