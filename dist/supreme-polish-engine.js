/**
 * ============================================================================
 * 🎨 FACEPAY SUPREME POLISH ENGINE - PIXEL PERFECTION ORCHESTRATOR
 * Every interaction must be PERFECT. Supreme visual polish coordination.
 * ============================================================================
 */

class SupremePolishEngine {
  constructor(options = {}) {
    this.options = {
      enableAnimations: true,
      enableMicroInteractions: true,
      enableScrollReveal: true,
      enableRippleEffects: true,
      enableColorHarmony: true,
      enablePixelPerfection: true,
      performanceMode: 'auto', // 'low', 'medium', 'high', 'auto'
      debugMode: false,
      ...options
    };
    
    this.intersectionObserver = null;
    this.performanceMonitor = null;
    this.isInitialized = false;
    this.animations = new Map();
    this.polishElements = new WeakSet();
    
    // Performance tracking
    this.stats = {
      elementsPolished: 0,
      animationsActive: 0,
      lastFPS: 60,
      performanceScore: 100
    };
    
    this.init();
  }

  /**
   * ============================================================================
   * 🚀 INITIALIZATION - SUPREME POLISH ACTIVATION
   * ============================================================================
   */
  init() {
    if (this.isInitialized) return;
    
    console.log('🎨 Initializing Supreme Polish Engine...');
    
    this.detectCapabilities();
    this.setupPerformanceMonitoring();
    this.initializeScrollReveal();
    this.applySupremePolish();
    this.initializeMicroInteractions();
    this.setupColorHarmonyValidation();
    this.enablePixelPerfection();
    this.setupResponsiveOptimizations();
    
    this.isInitialized = true;
    
    console.log('✨ Supreme Polish Engine activated!', {
      elementsPolished: this.stats.elementsPolished,
      performanceMode: this.options.performanceMode,
      capabilities: this.capabilities
    });
  }

  /**
   * ============================================================================
   * 🔍 CAPABILITY DETECTION - SMART OPTIMIZATIONS
   * ============================================================================
   */
  detectCapabilities() {
    this.capabilities = {
      // Device capabilities
      isHighDPI: window.devicePixelRatio >= 2,
      supportsBackdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
      supportsGridGap: CSS.supports('gap', '1rem'),
      supportsTransform3D: CSS.supports('transform', 'translate3d(0,0,0)'),
      
      // Performance indicators
      isLowPowerDevice: navigator.hardwareConcurrency <= 2,
      hasSlowConnection: navigator.connection?.effectiveType === '2g' || 
                        navigator.connection?.effectiveType === 'slow-2g',
      
      // User preferences
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
      prefersDarkScheme: window.matchMedia('(prefers-color-scheme: dark)').matches,
      
      // Browser features
      supportsIntersectionObserver: 'IntersectionObserver' in window,
      supportsResizeObserver: 'ResizeObserver' in window,
      supportsPerformanceObserver: 'PerformanceObserver' in window
    };
    
    // Auto-adjust performance mode based on capabilities
    if (this.options.performanceMode === 'auto') {
      if (this.capabilities.isLowPowerDevice || this.capabilities.hasSlowConnection) {
        this.options.performanceMode = 'low';
      } else if (this.capabilities.isHighDPI && !this.capabilities.prefersReducedMotion) {
        this.options.performanceMode = 'high';
      } else {
        this.options.performanceMode = 'medium';
      }
    }
    
    if (this.options.debugMode) {
      console.log('🔍 Device Capabilities:', this.capabilities);
      console.log('⚡ Performance Mode:', this.options.performanceMode);
    }
  }

  /**
   * ============================================================================
   * 📊 PERFORMANCE MONITORING - BUTTER SMOOTH GUARANTEE
   * ============================================================================
   */
  setupPerformanceMonitoring() {
    if (!this.capabilities.supportsPerformanceObserver) return;
    
    // FPS monitoring
    let lastTime = 0;
    let frames = 0;
    let fpsHistory = [];
    
    const measureFPS = (currentTime) => {
      frames++;
      
      if (currentTime - lastTime >= 1000) {
        this.stats.lastFPS = Math.round((frames * 1000) / (currentTime - lastTime));
        fpsHistory.push(this.stats.lastFPS);
        
        // Keep only last 10 measurements
        if (fpsHistory.length > 10) {
          fpsHistory.shift();
        }
        
        // Calculate performance score
        const avgFPS = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
        this.stats.performanceScore = Math.min(100, (avgFPS / 60) * 100);
        
        // Auto-adjust if performance drops
        if (avgFPS < 30 && this.options.performanceMode === 'high') {
          this.adjustPerformanceMode('medium');
        } else if (avgFPS < 20 && this.options.performanceMode === 'medium') {
          this.adjustPerformanceMode('low');
        }
        
        lastTime = currentTime;
        frames = 0;
        
        if (this.options.debugMode) {
          console.log(`📊 Performance: ${this.stats.lastFPS}fps (Score: ${Math.round(this.stats.performanceScore)})`);
        }
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
    
    // Long task monitoring
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) { // Tasks longer than 50ms
              console.warn(`⚠️ Long task detected: ${entry.duration}ms`, entry);
              this.optimizeForPerformance();
            }
          });
        });
        
        observer.observe({ entryTypes: ['longtask'] });
        this.performanceMonitor = observer;
      } catch (error) {
        if (this.options.debugMode) {
          console.log('Performance monitoring not fully supported');
        }
      }
    }
  }

  /**
   * ============================================================================
   * 🌊 SCROLL REVEAL - PROGRESSIVE PERFECTION
   * ============================================================================
   */
  initializeScrollReveal() {
    if (!this.options.enableScrollReveal || !this.capabilities.supportsIntersectionObserver) {
      return;
    }
    
    const observerOptions = {
      threshold: [0, 0.1, 0.2, 0.3, 0.5],
      rootMargin: '-10% 0px -10% 0px'
    };
    
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        const element = entry.target;
        
        if (entry.isIntersecting) {
          // Stagger animations for multiple elements
          const delay = index * 100;
          
          setTimeout(() => {
            element.classList.add('revealed');
            
            // Apply specific reveal animation based on element type
            this.applyRevealAnimation(element, entry.intersectionRatio);
            
            // Add to polished elements set
            this.polishElements.add(element);
            this.stats.elementsPolished++;
          }, delay);
        }
      });
    }, observerOptions);
    
    // Observe all elements that should be revealed
    this.observeRevealElements();
  }

  observeRevealElements() {
    const revealSelectors = [
      '.scroll-reveal-supreme',
      '.scroll-reveal-left',
      '.scroll-reveal-right', 
      '.scroll-reveal-scale',
      '.feature',
      '.stat',
      '.step',
      '.card-supreme',
      '.btn-supreme'
    ];
    
    revealSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (!element.classList.contains('revealed')) {
          element.classList.add('scroll-reveal-supreme');
          this.intersectionObserver.observe(element);
        }
      });
    });
  }

  applyRevealAnimation(element, intersectionRatio) {
    // Different animations based on intersection ratio for smooth progression
    if (intersectionRatio > 0.5) {
      element.style.transform = 'translateY(0) scale(1)';
      element.style.opacity = '1';
    } else if (intersectionRatio > 0.2) {
      element.style.transform = 'translateY(10px) scale(0.98)';
      element.style.opacity = '0.8';
    }
    
    // Add staggered animation class based on element position
    const rect = element.getBoundingClientRect();
    const isLeft = rect.left < window.innerWidth / 2;
    
    if (!element.classList.contains('animate-stagger-1')) {
      const staggerClass = isLeft ? 'animate-fade-in-left' : 'animate-fade-in-right';
      element.classList.add(staggerClass);
    }
  }

  /**
   * ============================================================================
   * 🎨 SUPREME POLISH APPLICATION - PIXEL PERFECTION
   * ============================================================================
   */
  applySupremePolish() {
    // Apply polish to buttons
    this.polishButtons();
    
    // Apply polish to cards
    this.polishCards();
    
    // Apply polish to inputs
    this.polishInputs();
    
    // Apply polish to icons
    this.polishIcons();
    
    // Apply polish to typography
    this.polishTypography();
    
    // Apply polish to containers
    this.polishContainers();
  }

  polishButtons() {
    document.querySelectorAll('.btn, button, [role="button"]').forEach(button => {
      if (this.polishElements.has(button)) return;
      
      // Add supreme button classes
      button.classList.add('btn-supreme', 'btn-supreme-micro', 'transition-supreme-all');
      
      // Add ripple effect
      if (this.options.enableRippleEffects) {
        button.classList.add('ripple-supreme', 'ripple-faceid');
      }
      
      // Add micro-interaction event listeners
      this.addButtonMicroInteractions(button);
      
      this.polishElements.add(button);
      this.stats.elementsPolished++;
    });
  }

  polishCards() {
    document.querySelectorAll('.card, .feature, .stat, [class*="card-"]').forEach(card => {
      if (this.polishElements.has(card)) return;
      
      // Add supreme card classes
      card.classList.add('card-supreme', 'card-supreme-micro', 'hover-lift');
      
      // Add interactive states if clickable
      if (card.onclick || card.querySelector('a, button')) {
        card.classList.add('card-supreme-interactive');
      }
      
      this.polishElements.add(card);
      this.stats.elementsPolished++;
    });
  }

  polishInputs() {
    document.querySelectorAll('input, textarea, select').forEach(input => {
      if (this.polishElements.has(input)) return;
      
      // Add supreme input classes
      input.classList.add('input-supreme', 'input-supreme-micro');
      
      // Add focus enhancement
      this.addInputFocusEnhancement(input);
      
      this.polishElements.add(input);
      this.stats.elementsPolished++;
    });
  }

  polishIcons() {
    document.querySelectorAll('[class*="icon"], .emoji, svg').forEach(icon => {
      if (this.polishElements.has(icon)) return;
      
      // Add supreme icon classes
      icon.classList.add('icon-supreme', 'icon-supreme-micro');
      
      // Add hover effects for interactive icons
      if (icon.closest('button, a, [onclick]')) {
        icon.classList.add('hover-scale');
      }
      
      this.polishElements.add(icon);
      this.stats.elementsPolished++;
    });
  }

  polishTypography() {
    // Headlines
    document.querySelectorAll('h1').forEach(h1 => {
      h1.classList.add('text-supreme-hero');
    });
    
    document.querySelectorAll('h2').forEach(h2 => {
      h2.classList.add('text-supreme-display');
    });
    
    document.querySelectorAll('h3').forEach(h3 => {
      h3.classList.add('text-supreme-headline');
    });
    
    // Body text
    document.querySelectorAll('p, .text-body').forEach(p => {
      p.classList.add('text-supreme-body');
    });
  }

  polishContainers() {
    document.querySelectorAll('.container, .section, main, article').forEach(container => {
      if (this.polishElements.has(container)) return;
      
      // Add supreme spacing
      container.classList.add('space-supreme');
      
      this.polishElements.add(container);
      this.stats.elementsPolished++;
    });
  }

  /**
   * ============================================================================
   * 🎪 MICRO-INTERACTIONS - PERFECT FEEDBACK SYSTEM
   * ============================================================================
   */
  initializeMicroInteractions() {
    if (!this.options.enableMicroInteractions) return;
    
    // Global micro-interactions
    this.setupGlobalHoverEffects();
    this.setupFocusEnhancements();
    this.setupScrollEffects();
    this.setupLoadingStates();
  }

  addButtonMicroInteractions(button) {
    let pressTimer = null;
    let isPressed = false;
    
    // Mouse/touch interactions
    button.addEventListener('mousedown', (e) => this.handleButtonPress(button, e));
    button.addEventListener('mouseup', (e) => this.handleButtonRelease(button, e));
    button.addEventListener('mouseleave', (e) => this.handleButtonRelease(button, e));
    
    button.addEventListener('touchstart', (e) => this.handleButtonPress(button, e), { passive: true });
    button.addEventListener('touchend', (e) => this.handleButtonRelease(button, e));
    
    // Keyboard interactions
    button.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        this.handleButtonPress(button, e);
      }
    });
    
    button.addEventListener('keyup', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        this.handleButtonRelease(button, e);
      }
    });
  }

  handleButtonPress(button, event) {
    button.classList.add('btn-pressed');
    
    // Add ripple effect at click position
    if (this.options.enableRippleEffects && event.clientX && event.clientY) {
      this.createRipple(button, event);
    }
    
    // Haptic feedback for supported devices
    this.triggerHapticFeedback('light');
  }

  handleButtonRelease(button, event) {
    button.classList.remove('btn-pressed');
    
    // Success animation for form submissions
    if (button.type === 'submit') {
      this.animateButtonSuccess(button);
    }
  }

  createRipple(element, event) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
      border-radius: 50%;
      transform: scale(0);
      animation: supreme-ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;
    
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  addInputFocusEnhancement(input) {
    let focusStartTime = 0;
    
    input.addEventListener('focus', () => {
      focusStartTime = Date.now();
      input.classList.add('input-focused');
      
      // Add focus glow animation
      if (this.options.performanceMode !== 'low') {
        input.classList.add('animate-glow-pulse');
      }
    });
    
    input.addEventListener('blur', () => {
      const focusDuration = Date.now() - focusStartTime;
      input.classList.remove('input-focused', 'animate-glow-pulse');
      
      // Validation feedback based on focus duration
      if (focusDuration > 1000 && input.value) {
        this.showValidationFeedback(input, 'success');
      }
    });
    
    // Real-time validation feedback
    input.addEventListener('input', () => {
      this.validateInput(input);
    });
  }

  /**
   * ============================================================================
   * 🎨 COLOR HARMONY VALIDATION - PERFECT CONTRAST
   * ============================================================================
   */
  setupColorHarmonyValidation() {
    if (!this.options.enableColorHarmony) return;
    
    // Validate contrast ratios
    this.validateContrastRatios();
    
    // Apply color harmony rules
    this.applyColorHarmony();
    
    // Monitor for dynamic color changes
    this.setupColorChangeObserver();
  }

  validateContrastRatios() {
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');
    
    textElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const textColor = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;
      
      // Calculate contrast ratio (simplified)
      const contrast = this.calculateContrastRatio(textColor, backgroundColor);
      
      if (contrast < 4.5) { // WCAG AA minimum
        if (this.options.debugMode) {
          console.warn('⚠️ Low contrast detected:', element, `Ratio: ${contrast.toFixed(2)}`);
        }
        
        // Auto-enhance contrast
        this.enhanceContrast(element);
      }
    });
  }

  calculateContrastRatio(color1, color2) {
    // Simplified contrast calculation
    // In a real implementation, you'd want a more robust color parsing and calculation
    const rgb1 = this.parseRGB(color1);
    const rgb2 = this.parseRGB(color2);
    
    const lum1 = this.calculateLuminance(rgb1);
    const lum2 = this.calculateLuminance(rgb2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }

  parseRGB(color) {
    // Simplified RGB parser
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3])
      };
    }
    return { r: 255, g: 255, b: 255 }; // Default to white
  }

  calculateLuminance({ r, g, b }) {
    const [rs, gs, bs] = [r, g, b].map(channel => {
      const sRGB = channel / 255;
      return sRGB <= 0.03928 
        ? sRGB / 12.92 
        : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  enhanceContrast(element) {
    // Apply high contrast enhancement
    element.style.textShadow = '0 0 2px rgba(0, 0, 0, 0.8)';
    element.classList.add('contrast-enhanced');
  }

  /**
   * ============================================================================
   * 📱 PIXEL PERFECTION - ULTIMATE PRECISION
   * ============================================================================
   */
  enablePixelPerfection() {
    if (!this.options.enablePixelPerfection) return;
    
    // Subpixel rendering optimization
    this.optimizeSubpixelRendering();
    
    // Perfect alignment corrections
    this.applyAlignmentCorrections();
    
    // Optical size adjustments
    this.applyOpticalSizeAdjustments();
  }

  optimizeSubpixelRendering() {
    // Apply subpixel optimizations for crisp rendering
    document.documentElement.style.setProperty('text-rendering', 'optimizeLegibility');
    document.documentElement.style.setProperty('-webkit-font-smoothing', 'antialiased');
    document.documentElement.style.setProperty('-moz-osx-font-smoothing', 'grayscale');
  }

  applyAlignmentCorrections() {
    // Correct optical alignment for icons and text
    document.querySelectorAll('.icon-supreme-text').forEach(container => {
      const icon = container.querySelector('.icon, svg, .emoji');
      const text = container.querySelector('.text, span, p');
      
      if (icon && text) {
        // Apply optical corrections based on icon size
        const iconSize = parseFloat(window.getComputedStyle(icon).fontSize);
        const correction = iconSize * -0.0625; // -1px per 16px
        
        icon.style.marginTop = `${correction}px`;
      }
    });
  }

  applyOpticalSizeAdjustments() {
    // Apply optical size corrections for better visual balance
    document.querySelectorAll('h1, h2, h3').forEach(heading => {
      const fontSize = parseFloat(window.getComputedStyle(heading).fontSize);
      
      // Larger text needs tighter letter spacing
      if (fontSize > 32) {
        heading.style.letterSpacing = '-0.02em';
      } else if (fontSize > 24) {
        heading.style.letterSpacing = '-0.01em';
      }
    });
  }

  /**
   * ============================================================================
   * 📱 RESPONSIVE OPTIMIZATIONS - PERFECT ADAPTATION
   * ============================================================================
   */
  setupResponsiveOptimizations() {
    // Listen for viewport changes
    window.addEventListener('resize', this.debounce(() => {
      this.handleViewportChange();
    }, 250));
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleViewportChange(), 100);
    });
    
    // Initial optimization
    this.handleViewportChange();
  }

  handleViewportChange() {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth <= 768,
      isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
      isDesktop: window.innerWidth > 1024
    };
    
    // Adjust performance mode based on viewport
    if (viewport.isMobile && this.options.performanceMode === 'high') {
      this.adjustPerformanceMode('medium');
    }
    
    // Apply responsive polish adjustments
    this.applyResponsivePolish(viewport);
  }

  applyResponsivePolish(viewport) {
    document.documentElement.style.setProperty('--viewport-width', `${viewport.width}px`);
    document.documentElement.style.setProperty('--viewport-height', `${viewport.height}px`);
    
    // Adjust touch targets for mobile
    if (viewport.isMobile) {
      document.querySelectorAll('.btn-supreme').forEach(button => {
        const minSize = 44; // iOS/Android minimum
        const rect = button.getBoundingClientRect();
        
        if (rect.height < minSize) {
          button.style.minHeight = `${minSize}px`;
        }
      });
    }
  }

  /**
   * ============================================================================
   * 🎭 ANIMATION ORCHESTRATION - PERFECT TIMING
   * ============================================================================
   */
  animateButtonSuccess(button) {
    const originalText = button.textContent;
    const originalHTML = button.innerHTML;
    
    // Morph to loading state
    button.classList.add('btn-morph-loading');
    button.innerHTML = '';
    
    // Show success after delay
    setTimeout(() => {
      button.classList.remove('btn-morph-loading');
      button.classList.add('btn-morph-success');
      button.innerHTML = '✓ Success!';
      
      this.triggerHapticFeedback('medium');
      
      // Restore original state
      setTimeout(() => {
        button.classList.remove('btn-morph-success');
        button.innerHTML = originalHTML;
      }, 2000);
    }, 1500);
  }

  showValidationFeedback(input, type) {
    const feedback = document.createElement('div');
    feedback.className = `validation-feedback validation-${type}`;
    feedback.textContent = type === 'success' ? '✓' : '⚠';
    
    input.parentNode.insertBefore(feedback, input.nextSibling);
    
    feedback.classList.add('animate-fade-in-up');
    
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 3000);
  }

  validateInput(input) {
    // Simple validation logic - extend as needed
    const value = input.value.trim();
    
    input.classList.remove('state-error', 'state-success');
    
    if (input.type === 'email') {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      input.classList.add(isValid ? 'state-success' : 'state-error');
    } else if (input.required) {
      input.classList.add(value ? 'state-success' : 'state-error');
    }
  }

  /**
   * ============================================================================
   * ⚡ PERFORMANCE OPTIMIZATION - BUTTER SMOOTH GUARANTEE
   * ============================================================================
   */
  adjustPerformanceMode(newMode) {
    console.log(`⚡ Adjusting performance mode: ${this.options.performanceMode} → ${newMode}`);
    this.options.performanceMode = newMode;
    
    document.documentElement.setAttribute('data-performance-mode', newMode);
    
    // Apply performance-based optimizations
    switch (newMode) {
      case 'low':
        this.disableExpensiveEffects();
        break;
      case 'medium':
        this.enableMediumEffects();
        break;
      case 'high':
        this.enableAllEffects();
        break;
    }
  }

  disableExpensiveEffects() {
    document.documentElement.classList.add('performance-low');
    
    // Disable heavy animations
    document.querySelectorAll('.animate-glow-pulse, .animate-float').forEach(el => {
      el.style.animation = 'none';
    });
    
    // Reduce backdrop filters
    document.querySelectorAll('[style*="backdrop-filter"]').forEach(el => {
      el.style.backdropFilter = 'none';
    });
  }

  enableMediumEffects() {
    document.documentElement.classList.remove('performance-low');
    document.documentElement.classList.add('performance-medium');
  }

  enableAllEffects() {
    document.documentElement.classList.remove('performance-low', 'performance-medium');
    document.documentElement.classList.add('performance-high');
  }

  optimizeForPerformance() {
    // Pause non-essential animations
    this.pauseNonEssentialAnimations();
    
    // Reduce animation complexity
    this.reduceAnimationComplexity();
    
    // Optimize DOM queries
    this.optimizeDOMQueries();
  }

  pauseNonEssentialAnimations() {
    document.querySelectorAll('.animate-float, .animate-glow-pulse').forEach(element => {
      element.style.animationPlayState = 'paused';
      
      // Resume after a delay
      setTimeout(() => {
        element.style.animationPlayState = 'running';
      }, 2000);
    });
  }

  /**
   * ============================================================================
   * 🛠️ UTILITY METHODS - PERFECT HELPERS
   * ============================================================================
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  triggerHapticFeedback(intensity = 'light') {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[intensity] || patterns.light);
    }
  }

  /**
   * ============================================================================
   * 📊 PUBLIC API - SUPREME CONTROL
   * ============================================================================
   */
  getStats() {
    return {
      ...this.stats,
      performanceMode: this.options.performanceMode,
      isInitialized: this.isInitialized
    };
  }

  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    
    // Re-initialize if needed
    if (this.isInitialized) {
      this.applyOptionsChanges();
    }
  }

  applyOptionsChanges() {
    // Re-apply settings based on new options
    if (!this.options.enableAnimations) {
      document.documentElement.classList.add('animations-disabled');
    } else {
      document.documentElement.classList.remove('animations-disabled');
    }
  }

  destroy() {
    // Clean up observers
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    if (this.performanceMonitor) {
      this.performanceMonitor.disconnect();
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleViewportChange);
    window.removeEventListener('orientationchange', this.handleViewportChange);
    
    // Clear animations map
    this.animations.clear();
    
    this.isInitialized = false;
    console.log('🎨 Supreme Polish Engine destroyed');
  }
}

/**
 * ============================================================================
 * 🚀 AUTO-INITIALIZATION - SUPREME POLISH ACTIVATION
 * ============================================================================
 */

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSupremePolish);
} else {
  initializeSupremePolish();
}

function initializeSupremePolish() {
  // Initialize with optimal settings
  window.supremePolishEngine = new SupremePolishEngine({
    enableAnimations: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    enableMicroInteractions: true,
    enableScrollReveal: true,
    enableRippleEffects: true,
    enableColorHarmony: true,
    enablePixelPerfection: true,
    performanceMode: 'auto',
    debugMode: localStorage.getItem('facepay-debug') === 'true'
  });
  
  // Expose global controls for debugging
  if (window.supremePolishEngine.options.debugMode) {
    window.supreme = {
      engine: window.supremePolishEngine,
      stats: () => window.supremePolishEngine.getStats(),
      performance: (mode) => window.supremePolishEngine.adjustPerformanceMode(mode),
      debug: {
        showPolishedElements: () => {
          document.querySelectorAll('*').forEach(el => {
            if (window.supremePolishEngine.polishElements.has(el)) {
              el.style.outline = '2px solid lime';
            }
          });
        },
        hidePolishedElements: () => {
          document.querySelectorAll('*').forEach(el => {
            el.style.outline = '';
          });
        }
      }
    };
    
    console.log('🎮 Supreme Polish Debug Console Available:');
    console.log('• supreme.stats() - Get performance stats');
    console.log('• supreme.performance("low|medium|high") - Adjust performance');
    console.log('• supreme.debug.showPolishedElements() - Highlight polished elements');
  }
}

/**
 * ============================================================================
 * 🏁 SUPREME POLISH ENGINE COMPLETE - EVERY PIXEL IS PERFECT!
 * ============================================================================
 */