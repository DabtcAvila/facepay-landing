/**
 * MEDIA OPTIMIZER - Image/Video Performance System
 * Optimizes LCP, reduces CLS, implements modern formats (WebP/AVIF)
 */

class MediaOptimizer {
    constructor() {
        this.supportedFormats = this.detectFormatSupport();
        this.loadedMedia = new Set();
        this.observers = new Map();
        this.init();
    }

    init() {
        console.log('🖼️ Media Optimizer initialized. Supported formats:', this.supportedFormats);
        this.setupMediaObservers();
        this.optimizeExistingMedia();
        this.setupVideoOptimizations();
    }

    // DETECT MODERN FORMAT SUPPORT
    detectFormatSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        
        const formats = {
            avif: canvas.toDataURL('image/avif').startsWith('data:image/avif'),
            webp: canvas.toDataURL('image/webp').startsWith('data:image/webp'),
            heic: false // Browser support limited
        };
        
        return formats;
    }

    // SETUP MEDIA INTERSECTION OBSERVERS
    setupMediaObservers() {
        // High priority images (above fold)
        this.observers.set('priority-images', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadPriorityImage(entry.target);
                    this.observers.get('priority-images').unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.01
        }));

        // Standard images (lazy load)
        this.observers.set('images', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observers.get('images').unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        }));

        // Videos (lazy load + autoplay management)
        this.observers.set('videos', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadVideo(entry.target);
                    this.observers.get('videos').unobserve(entry.target);
                    this.setupVideoPlaybackOptimization(entry.target);
                }
            });
        }, {
            rootMargin: '25px 0px',
            threshold: 0.25
        }));
    }

    // OPTIMIZE EXISTING MEDIA
    optimizeExistingMedia() {
        // Priority images (LCP candidates)
        document.querySelectorAll('img[data-priority="high"], img[data-src][data-priority]').forEach(img => {
            this.observers.get('priority-images').observe(img);
        });

        // Standard images
        document.querySelectorAll('img[data-src]:not([data-priority])').forEach(img => {
            this.observers.get('images').observe(img);
        });

        // Videos
        document.querySelectorAll('video[data-src]').forEach(video => {
            this.observers.get('videos').observe(video);
        });

        // Background images
        document.querySelectorAll('[data-bg-src]').forEach(element => {
            this.observers.get('images').observe(element);
        });
    }

    // LOAD PRIORITY IMAGE (LCP Optimization)
    async loadPriorityImage(img) {
        if (this.loadedMedia.has(img)) return;
        this.loadedMedia.add(img);

        const startTime = performance.now();
        const originalSrc = img.dataset.src;
        const srcset = img.dataset.srcset;
        
        // Get optimized source
        const optimizedSrc = await this.getOptimizedImageSrc(originalSrc, 'high');
        
        // Preload for immediate rendering
        const preloader = new Image();
        
        preloader.onload = () => {
            // Set sources
            if (srcset) {
                img.srcset = this.generateOptimizedSrcset(srcset);
            }
            img.src = optimizedSrc;
            
            // Remove lazy loading attributes
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
            
            // Add loaded class for animations
            img.classList.add('loaded');
            
            // Mark as LCP candidate
            img.dataset.lcpCandidate = 'true';
            
            const loadTime = performance.now() - startTime;
            console.log('🚀 Priority image loaded:', loadTime.toFixed(2) + 'ms', optimizedSrc.substring(0, 30) + '...');
            
            // Track LCP timing
            this.trackImagePerformance('priority', loadTime, optimizedSrc);
        };
        
        preloader.onerror = () => {
            // Fallback to original
            img.src = originalSrc;
            img.removeAttribute('data-src');
            console.warn('⚠️ Priority image fallback:', originalSrc);
        };
        
        preloader.src = optimizedSrc;
    }

    // LOAD STANDARD IMAGE
    async loadImage(element) {
        if (this.loadedMedia.has(element)) return;
        this.loadedMedia.add(element);

        const isBackgroundImage = element.dataset.bgSrc;
        const originalSrc = element.dataset.src || element.dataset.bgSrc;
        
        if (!originalSrc) return;
        
        const optimizedSrc = await this.getOptimizedImageSrc(originalSrc, 'standard');
        
        if (isBackgroundImage) {
            // Handle background images
            const img = new Image();
            img.onload = () => {
                element.style.backgroundImage = `url(${optimizedSrc})`;
                element.classList.add('bg-loaded');
                element.removeAttribute('data-bg-src');
            };
            img.src = optimizedSrc;
        } else {
            // Handle regular images
            const srcset = element.dataset.srcset;
            
            if (srcset) {
                element.srcset = this.generateOptimizedSrcset(srcset);
            }
            element.src = optimizedSrc;
            element.removeAttribute('data-src');
            element.removeAttribute('data-srcset');
            element.classList.add('loaded');
        }
        
        console.log('🖼️ Image loaded:', optimizedSrc.substring(0, 30) + '...');
    }

    // GET OPTIMIZED IMAGE SOURCE
    async getOptimizedImageSrc(originalSrc, priority = 'standard') {
        // Check for existing optimized versions
        let optimizedSrc = originalSrc;
        
        // Try AVIF first (best compression)
        if (this.supportedFormats.avif) {
            const avifSrc = originalSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
            if (await this.checkImageExists(avifSrc)) {
                optimizedSrc = avifSrc;
            }
        }
        // Fallback to WebP
        else if (this.supportedFormats.webp) {
            const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            if (await this.checkImageExists(webpSrc)) {
                optimizedSrc = webpSrc;
            }
        }
        
        // Add size hints for better caching
        if (priority === 'high') {
            optimizedSrc += optimizedSrc.includes('?') ? '&priority=high' : '?priority=high';
        }
        
        return optimizedSrc;
    }

    // GENERATE OPTIMIZED SRCSET
    generateOptimizedSrcset(originalSrcset) {
        return originalSrcset.split(',').map(srcItem => {
            const [src, size] = srcItem.trim().split(' ');
            let optimizedSrc = src;
            
            // Apply format optimization
            if (this.supportedFormats.avif) {
                optimizedSrc = src.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
            } else if (this.supportedFormats.webp) {
                optimizedSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            }
            
            return `${optimizedSrc} ${size || ''}`.trim();
        }).join(', ');
    }

    // CHECK IF OPTIMIZED IMAGE EXISTS
    async checkImageExists(src) {
        try {
            const response = await fetch(src, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    // LOAD VIDEO WITH OPTIMIZATION
    loadVideo(video) {
        if (this.loadedMedia.has(video)) return;
        this.loadedMedia.add(video);

        const src = video.dataset.src;
        const poster = video.dataset.poster;
        
        if (poster) {
            // Optimize poster image first
            this.getOptimizedImageSrc(poster, 'high').then(optimizedPoster => {
                video.poster = optimizedPoster;
            });
        }
        
        if (src) {
            // Set up video source
            video.src = src;
            video.removeAttribute('data-src');
            
            // Optimize video loading
            video.preload = 'metadata'; // Only load metadata initially
            video.load();
            
            console.log('📹 Video loaded:', src.substring(0, 30) + '...');
        }
    }

    // VIDEO OPTIMIZATIONS
    setupVideoOptimizations() {
        // Pause off-screen videos to save bandwidth
        this.observers.set('video-playback', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    if (video.autoplay) {
                        video.play().catch(() => {
                            // Autoplay failed, show play button
                            this.showVideoPlayButton(video);
                        });
                    }
                } else {
                    if (!video.paused) {
                        video.pause();
                    }
                }
            });
        }, {
            threshold: 0.5
        }));

        // Apply to all videos
        document.querySelectorAll('video').forEach(video => {
            this.observers.get('video-playback').observe(video);
        });
    }

    setupVideoPlaybackOptimization(video) {
        // Add performance optimizations
        video.addEventListener('loadstart', () => {
            console.log('📹 Video loading started');
        });

        video.addEventListener('canplay', () => {
            console.log('📹 Video can play');
        });

        video.addEventListener('error', (e) => {
            console.error('📹 Video error:', e);
            this.handleVideoError(video);
        });

        // Optimize for mobile
        if ('ontouchstart' in window) {
            this.optimizeVideoForMobile(video);
        }
    }

    optimizeVideoForMobile(video) {
        // Reduce quality on slow connections
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === '2g' || connection.effectiveType === '3g') {
                video.style.filter = 'blur(1px)'; // Slight blur to hide compression
                video.dataset.reducedQuality = 'true';
            }
        }

        // Touch to play for mobile
        video.addEventListener('touchstart', () => {
            if (video.paused) {
                video.play();
            }
        }, { once: true });
    }

    handleVideoError(video) {
        const fallbackPoster = video.dataset.fallbackPoster || '/video-error-placeholder.jpg';
        video.poster = fallbackPoster;
        
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'absolute inset-0 flex items-center justify-center bg-gray-900 text-white';
        errorDiv.innerHTML = `
            <div class="text-center">
                <p class="text-sm opacity-75">Video temporarily unavailable</p>
                <button class="mt-2 px-3 py-1 bg-emerald-500 rounded text-xs" onclick="this.parentElement.parentElement.remove(); this.nextElementSibling.load();">
                    Retry
                </button>
            </div>
        `;
        
        video.parentElement.style.position = 'relative';
        video.parentElement.appendChild(errorDiv);
    }

    showVideoPlayButton(video) {
        const playButton = document.createElement('button');
        playButton.className = 'absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-6xl hover:bg-opacity-70 transition z-10';
        playButton.innerHTML = '▶️';
        playButton.style.position = 'absolute';
        
        playButton.addEventListener('click', () => {
            video.play();
            playButton.remove();
        });
        
        video.parentElement.style.position = 'relative';
        video.parentElement.appendChild(playButton);
    }

    // PERFORMANCE TRACKING
    trackImagePerformance(type, loadTime, src) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'image_performance', {
                image_type: type,
                load_time: Math.round(loadTime),
                format: this.getImageFormat(src),
                size_category: loadTime < 100 ? 'fast' : loadTime < 500 ? 'medium' : 'slow'
            });
        }
    }

    getImageFormat(src) {
        if (src.includes('.avif')) return 'avif';
        if (src.includes('.webp')) return 'webp';
        if (src.includes('.jpg') || src.includes('.jpeg')) return 'jpg';
        if (src.includes('.png')) return 'png';
        return 'unknown';
    }

    // RESPONSIVE IMAGES HELPER
    generateResponsiveSources(baseSrc, sizes = [400, 800, 1200, 1600]) {
        const srcset = sizes.map(width => {
            let responsiveSrc = baseSrc.replace(/(\.[^.]+)$/, `_${width}w$1`);
            
            // Apply format optimization
            if (this.supportedFormats.avif) {
                responsiveSrc = responsiveSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
            } else if (this.supportedFormats.webp) {
                responsiveSrc = responsiveSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            }
            
            return `${responsiveSrc} ${width}w`;
        }).join(', ');

        return {
            srcset,
            sizes: '(max-width: 400px) 100vw, (max-width: 800px) 800px, (max-width: 1200px) 1200px, 1600px'
        };
    }

    // PUBLIC API
    preloadCriticalImage(src, priority = 'high') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        if (priority === 'high') {
            link.fetchPriority = 'high';
        }
        document.head.appendChild(link);
        console.log('🚀 Critical image preloaded:', src);
    }

    // Manually trigger image load
    loadImageNow(img) {
        if (img.dataset.src) {
            this.loadImage(img);
        }
    }

    // Get performance statistics
    getStats() {
        return {
            supportedFormats: this.supportedFormats,
            loadedMediaCount: this.loadedMedia.size,
            observersActive: this.observers.size
        };
    }
}

// Initialize Media Optimizer
const mediaOptimizer = new MediaOptimizer();

// Export for global access
window.MediaOptimizer = mediaOptimizer;

// Utility functions for templates
window.generateWebPSrcset = (src, sizes) => mediaOptimizer.generateResponsiveSources(src, sizes).srcset;
window.preloadHeroImage = (src) => mediaOptimizer.preloadCriticalImage(src, 'high');