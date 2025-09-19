/**
 * FACEPAY TYPOGRAPHY PERFORMANCE OPTIMIZATION
 * Apple/Linear Level Typography Performance
 * Handles font loading, text measurement, and typography animations
 */

class TypographyPerformance {
  constructor() {
    this.fonts = new Map();
    this.textMetrics = new Map();
    this.observer = null;
    this.isHighPerformance = navigator.hardwareConcurrency >= 4;
    this.supportsVariableFonts = this.checkVariableFontSupport();
    
    this.init();
  }

  /**
   * Initialize typography performance system
   */
  init() {
    this.preloadFonts();
    this.optimizeTextRendering();
    this.setupFontDisplay();
    this.initTextBalancing();
    this.handleReducedMotion();
    this.measureTypographicElements();
  }

  /**
   * Check if browser supports variable fonts
   */
  checkVariableFontSupport() {
    try {
      return CSS.supports('font-variation-settings', '"wght" 400');
    } catch (e) {
      return false;
    }
  }

  /**
   * Preload critical fonts with intelligent priority
   */
  async preloadFonts() {
    const criticalFonts = [
      {
        family: 'Inter',
        weight: '400',
        display: 'swap',
        priority: 'high'
      },
      {
        family: 'Inter',
        weight: '600',
        display: 'swap',
        priority: 'high'
      },
      {
        family: 'Inter',
        weight: '700',
        display: 'swap',
        priority: 'medium'
      }
    ];

    // Use variable font if supported
    if (this.supportsVariableFonts) {
      this.preloadVariableFont();
    } else {
      this.preloadStaticFonts(criticalFonts);
    }

    // Monitor font loading
    this.watchFontLoading();
  }

  /**
   * Preload variable font for optimal performance
   */
  async preloadVariableFont() {
    try {
      const font = new FontFace(
        'Inter',
        'url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhiI2B.woff2) format("woff2")',
        {
          weight: '100 900',
          display: 'swap',
          unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
        }
      );

      await font.load();
      document.fonts.add(font);
      
      document.documentElement.classList.add('font-loaded', 'variable-font-loaded');
      console.log('✅ Variable font loaded successfully');
    } catch (error) {
      console.warn('Variable font failed, falling back to static fonts:', error);
      this.preloadStaticFonts();
    }
  }

  /**
   * Preload static fonts as fallback
   */
  async preloadStaticFonts(fonts = []) {
    const defaultFonts = [
      { weight: '400', style: 'normal' },
      { weight: '600', style: 'normal' },
      { weight: '700', style: 'normal' }
    ];

    const fontsToLoad = fonts.length > 0 ? fonts : defaultFonts;
    
    const loadPromises = fontsToLoad.map(async ({ weight, style = 'normal' }) => {
      try {
        const font = new FontFace(
          'Inter',
          `url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7W_T-.woff2) format("woff2")`,
          { weight, style, display: 'swap' }
        );

        await font.load();
        document.fonts.add(font);
        this.fonts.set(`inter-${weight}-${style}`, font);
      } catch (error) {
        console.warn(`Failed to load Inter ${weight} ${style}:`, error);
      }
    });

    try {
      await Promise.allSettled(loadPromises);
      document.documentElement.classList.add('font-loaded');
      console.log('✅ Static fonts loaded successfully');
    } catch (error) {
      console.warn('Some fonts failed to load:', error);
    }
  }

  /**
   * Watch font loading progress
   */
  watchFontLoading() {
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-ready');
        this.optimizeLoadedText();
      });

      // Monitor individual font loads
      document.fonts.addEventListener('loadingdone', (event) => {
        console.log(`✅ Font loaded: ${event.fontface.family}`);
        this.updateTextWithLoadedFont(event.fontface);
      });
    }
  }

  /**
   * Optimize text rendering after fonts load
   */
  optimizeLoadedText() {
    // Re-measure text elements after fonts load
    this.measureTypographicElements();
    
    // Apply progressive enhancement
    document.querySelectorAll('.text-gradient').forEach(el => {
      if (this.isHighPerformance) {
        el.style.textRendering = 'optimizeLegibility';
      }
    });

    // Enable advanced typography features
    if (this.supportsVariableFonts) {
      document.documentElement.style.setProperty('--font-variation-weight', '400');
    }
  }

  /**
   * Update text elements when specific fonts load
   */
  updateTextWithLoadedFont(fontface) {
    const elements = document.querySelectorAll(`[style*="${fontface.family}"]`);
    elements.forEach(el => {
      // Force repaint for better rendering
      el.style.display = 'none';
      el.offsetHeight; // Trigger reflow
      el.style.display = '';
    });
  }

  /**
   * Optimize text rendering globally
   */
  optimizeTextRendering() {
    // Set CSS optimizations
    const style = document.createElement('style');
    style.textContent = `
      /* Performance optimizations */
      .text-optimized {
        text-rendering: ${this.isHighPerformance ? 'optimizeLegibility' : 'optimizeSpeed'};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-kerning: auto;
      }
      
      /* GPU acceleration for text transforms */
      .text-gradient,
      .text-glow,
      .text-shadow-soft {
        will-change: ${this.isHighPerformance ? 'auto' : 'unset'};
        backface-visibility: hidden;
        perspective: 1000px;
      }
      
      /* Optimize large text */
      .hero-title,
      .text-display-1,
      .text-display-2 {
        text-rendering: optimizeLegibility;
        font-kerning: auto;
        ${this.supportsVariableFonts ? 'font-optical-sizing: auto;' : ''}
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Setup font display optimization
   */
  setupFontDisplay() {
    // Add loading states
    document.documentElement.classList.add('font-loading');

    // Remove loading state after timeout
    setTimeout(() => {
      if (!document.documentElement.classList.contains('font-loaded')) {
        document.documentElement.classList.add('font-timeout');
        console.warn('Font loading timeout - using fallback fonts');
      }
    }, 3000);
  }

  /**
   * Initialize text balancing for better readability
   */
  initTextBalancing() {
    // Apply text-wrap: balance for headlines (if supported)
    if (CSS.supports('text-wrap', 'balance')) {
      const headlines = document.querySelectorAll('h1, h2, h3, .hero-title, .cta-headline');
      headlines.forEach(el => {
        el.style.textWrap = 'balance';
      });
    }

    // Apply hanging punctuation (if supported)
    if (CSS.supports('hanging-punctuation', 'first last')) {
      document.body.style.hangingPunctuation = 'first last';
    }
  }

  /**
   * Handle reduced motion preferences
   */
  handleReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Disable text animations
      document.documentElement.classList.add('reduced-motion');
      
      // Remove gradient animations
      const gradientElements = document.querySelectorAll('.text-gradient, .text-gradient-brand');
      gradientElements.forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
      });
    }
  }

  /**
   * Measure typographic elements for layout optimization
   */
  measureTypographicElements() {
    if (!this.isHighPerformance) return;

    const elementsToMeasure = [
      { selector: '.hero-title', name: 'hero-title' },
      { selector: '.stat-number', name: 'stat-number' },
      { selector: '.countdown-timer', name: 'countdown-timer' }
    ];

    elementsToMeasure.forEach(({ selector, name }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const metrics = this.getTextMetrics(el);
        this.textMetrics.set(`${name}-${el.id || 'anonymous'}`, metrics);
        
        // Apply optimizations based on measurements
        this.optimizeElementBasedOnMetrics(el, metrics);
      });
    });
  }

  /**
   * Get text metrics for an element
   */
  getTextMetrics(element) {
    const computedStyle = getComputedStyle(element);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
    
    const text = element.textContent || '';
    const metrics = ctx.measureText(text);
    
    return {
      width: metrics.width,
      height: parseFloat(computedStyle.lineHeight) || parseFloat(computedStyle.fontSize) * 1.2,
      baseline: metrics.actualBoundingBoxAscent,
      descent: metrics.actualBoundingBoxDescent,
      fontSize: parseFloat(computedStyle.fontSize),
      lineHeight: parseFloat(computedStyle.lineHeight),
      letterSpacing: computedStyle.letterSpacing
    };
  }

  /**
   * Optimize element based on its text metrics
   */
  optimizeElementBasedOnMetrics(element, metrics) {
    // Optimize large text elements
    if (metrics.fontSize > 48) {
      element.style.textRendering = 'optimizeLegibility';
      element.style.fontKerning = 'normal';
    }

    // Optimize monospace elements (like countdown)
    if (element.classList.contains('countdown-timer')) {
      element.style.fontVariantNumeric = 'tabular-nums';
      element.style.fontFeatureSettings = '"tnum" 1';
    }

    // Optimize for readability
    if (metrics.width > window.innerWidth * 0.8) {
      element.style.hyphens = 'auto';
      element.style.overflowWrap = 'break-word';
    }
  }

  /**
   * Dynamic font size scaling based on viewport
   */
  setupResponsiveTypography() {
    const updateTypography = () => {
      const vw = window.innerWidth;
      const scaleFactor = Math.max(0.8, Math.min(1.2, vw / 1440));

      // Update CSS custom properties for responsive scaling
      document.documentElement.style.setProperty('--typography-scale', scaleFactor);
      
      // Adjust line heights for different screen sizes
      if (vw < 640) {
        document.documentElement.style.setProperty('--leading-adjustment', '0.1');
      } else if (vw > 1440) {
        document.documentElement.style.setProperty('--leading-adjustment', '-0.05');
      } else {
        document.documentElement.style.setProperty('--leading-adjustment', '0');
      }
    };

    // Initial setup
    updateTypography();

    // Update on resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateTypography, 150);
    });
  }

  /**
   * Setup intersection observer for typography animations
   */
  setupTypographyAnimations() {
    if (!this.isHighPerformance) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateTextElement(entry.target);
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1
    });

    // Observe text elements
    const animatableElements = document.querySelectorAll(
      '.text-display-1, .text-display-2, .hero-title, .stat-number'
    );
    
    animatableElements.forEach(el => {
      this.observer.observe(el);
    });
  }

  /**
   * Animate text element on intersection
   */
  animateTextElement(element) {
    // Skip if reduced motion is preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }

  /**
   * Optimize for print styles
   */
  setupPrintOptimization() {
    const printStyles = `
      @media print {
        .text-gradient,
        .text-gradient-brand,
        .text-gradient-premium {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
          background: none !important;
          color: #000 !important;
          -webkit-text-fill-color: #000 !important;
        }
        
        body {
          font-family: 'Times New Roman', Times, serif !important;
          font-size: 12pt !important;
          line-height: 1.4 !important;
          color: #000 !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: Arial, Helvetica, sans-serif !important;
          color: #000 !important;
          page-break-after: avoid;
        }
        
        .btn, .countdown, .video-container {
          display: none !important;
        }
      }
    `;

    const style = document.createElement('style');
    style.textContent = printStyles;
    document.head.appendChild(style);
  }

  /**
   * Performance monitoring and debugging
   */
  setupPerformanceMonitoring() {
    if (typeof window !== 'undefined' && window.performance) {
      // Monitor font loading performance
      const fontLoadStart = performance.now();
      
      document.fonts.ready.then(() => {
        const fontLoadTime = performance.now() - fontLoadStart;
        console.log(`🎯 Typography Performance: Font loading took ${fontLoadTime.toFixed(2)}ms`);
        
        // Report if fonts took too long
        if (fontLoadTime > 1000) {
          console.warn('⚠️ Typography: Font loading exceeded 1s, consider optimizing');
        }
      });

      // Monitor layout shifts caused by fonts
      if ('LayoutShift' in window) {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.sources) {
              const fontRelated = entry.sources.some(source => 
                source.node && (
                  source.node.tagName === 'H1' ||
                  source.node.tagName === 'H2' ||
                  source.node.classList?.contains('hero-title')
                )
              );
              
              if (fontRelated && entry.value > 0.1) {
                console.warn('⚠️ Typography: Large layout shift detected:', entry.value);
              }
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });
      }
    }
  }

  /**
   * Cleanup when component unmounts
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    this.fonts.clear();
    this.textMetrics.clear();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const typography = new TypographyPerformance();
  typography.setupResponsiveTypography();
  typography.setupTypographyAnimations();
  typography.setupPrintOptimization();
  typography.setupPerformanceMonitoring();
  
  // Make available globally for debugging
  window.FacePayTypography = typography;
  
  console.log('🎨 FacePay Premium Typography System Initialized');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TypographyPerformance;
}