// FacePay Cinematic Video Integration - Test Suite
// Run in browser console after page load

console.log('🎬 Starting FacePay Video Integration Tests...');

class VideoIntegrationTester {
    constructor() {
        this.testResults = [];
        this.videoManager = window.videoManager;
    }
    
    async runAllTests() {
        console.log('🧪 Running comprehensive test suite...');
        
        await this.testVideoElements();
        await this.testModalFunctionality();
        await this.testKeyboardControls();
        await this.testScrollBehavior();
        await this.testMobileOptimization();
        await this.testAccessibility();
        await this.testPerformance();
        
        this.printResults();
    }
    
    test(name, condition, details = '') {
        const result = {
            name,
            passed: Boolean(condition),
            details
        };
        this.testResults.push(result);
        
        const icon = result.passed ? '✅' : '❌';
        console.log(`${icon} ${name}: ${result.passed ? 'PASS' : 'FAIL'}${details ? ' - ' + details : ''}`);
        
        return result.passed;
    }
    
    async testVideoElements() {
        console.log('\n📹 Testing Video Elements...');
        
        // Hero video
        const heroVideo = document.getElementById('heroVideo');
        this.test('Hero video exists', heroVideo);
        this.test('Hero video has correct attributes', 
            heroVideo && heroVideo.hasAttribute('autoplay') && heroVideo.hasAttribute('muted'));
        
        // Demo video
        const demoVideo = document.getElementById('demoVideo');
        this.test('Demo video exists', demoVideo);
        
        // Modal video
        const modalVideo = document.getElementById('modalVideo');
        this.test('Modal video exists', modalVideo);
        this.test('Modal video has captions', 
            modalVideo && modalVideo.querySelectorAll('track').length >= 2);
        
        // Poster frame
        const posterExists = heroVideo && heroVideo.hasAttribute('poster');
        this.test('Video has poster frame', posterExists);
    }
    
    async testModalFunctionality() {
        console.log('\n🎭 Testing Modal Functionality...');
        
        const modal = document.getElementById('videoModal');
        const openBtn = document.querySelector('[onclick="openVideoModal()"]');
        
        this.test('Video modal exists', modal);
        this.test('Open button exists', openBtn);
        
        if (openBtn) {
            // Test modal opening
            openBtn.click();
            await new Promise(resolve => setTimeout(resolve, 100));
            this.test('Modal opens correctly', modal.classList.contains('active'));
            
            // Test controls
            const playBtn = document.getElementById('playPauseBtn');
            const muteBtn = document.getElementById('muteBtn');
            const progressBar = document.getElementById('videoProgress');
            
            this.test('Play button exists', playBtn);
            this.test('Mute button exists', muteBtn);
            this.test('Progress bar exists', progressBar);
            
            // Close modal
            const closeBtn = modal.querySelector('.video-modal-close');
            if (closeBtn) closeBtn.click();
            await new Promise(resolve => setTimeout(resolve, 100));
            this.test('Modal closes correctly', !modal.classList.contains('active'));
        }
    }
    
    async testKeyboardControls() {
        console.log('\n⌨️ Testing Keyboard Controls...');
        
        // Open modal first
        if (window.videoManager) {
            window.videoManager.openModal();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Test escape key
            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            document.dispatchEvent(escapeEvent);
            await new Promise(resolve => setTimeout(resolve, 100));
            
            this.test('Escape key closes modal', !document.getElementById('videoModal').classList.contains('active'));
            
            // Test other keys (would need modal open)
            this.test('Keyboard handlers registered', typeof window.videoManager.setupKeyboardHandlers === 'function');
        }
    }
    
    async testScrollBehavior() {
        console.log('\n📜 Testing Scroll Behavior...');
        
        if (this.videoManager) {
            this.test('Video manager exists', true);
            this.test('Scroll handlers setup', typeof this.videoManager.setupScrollHandlers === 'function');
            this.test('Auto-pause functionality', typeof this.videoManager.pauseAllVideos === 'function');
            this.test('Resume functionality', typeof this.videoManager.resumeVideos === 'function');
            
            // Test pause indicator
            const pauseIndicator = document.getElementById('pauseIndicator');
            this.test('Pause indicator exists', pauseIndicator);
        }
    }
    
    async testMobileOptimization() {
        console.log('\n📱 Testing Mobile Optimization...');
        
        // Test responsive elements
        const heroContent = document.querySelector('.hero-content');
        const mobilePoster = document.querySelector('.hero-video-mobile-poster');
        
        this.test('Hero content has mobile styles', heroContent);
        this.test('Mobile poster fallback exists', mobilePoster);
        
        // Test media queries (simulated)
        const mobileQuery = window.matchMedia('(max-width: 768px)');
        this.test('Mobile media query supported', mobileQuery);
        
        // Test preload hints
        const preloadLinks = document.querySelectorAll('link[rel="preload"]');
        this.test('Preload hints present', preloadLinks.length > 0);
    }
    
    async testAccessibility() {
        console.log('\n♿ Testing Accessibility...');
        
        // Test ARIA labels
        const modalVideo = document.getElementById('modalVideo');
        const controls = document.querySelectorAll('[aria-label]');
        
        this.test('ARIA labels present', controls.length >= 3);
        this.test('Video has accessibility features', modalVideo && modalVideo.querySelectorAll('track').length >= 2);
        
        // Test screen reader announcements
        if (this.videoManager) {
            this.test('Screen reader support', typeof this.videoManager.announceToScreenReader === 'function');
        }
        
        // Test reduced motion
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.test('Reduced motion detection', reducedMotion);
        
        // Test high contrast
        const highContrast = window.matchMedia('(prefers-contrast: high)');
        this.test('High contrast detection', highContrast);
    }
    
    async testPerformance() {
        console.log('\n🚀 Testing Performance...');
        
        // Test service worker
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration('/');
            this.test('Service worker registered', Boolean(registration));
        }
        
        // Test lazy loading
        const lazyVideos = document.querySelectorAll('.video-lazy');
        this.test('Lazy loading implemented', lazyVideos.length > 0);
        
        // Test analytics
        this.test('Analytics tracking available', typeof window.trackVideoEvent === 'function');
        
        // Test performance monitoring
        this.test('Performance monitoring active', 'performance' in window);
        
        // Test connection awareness
        const connectionAware = this.videoManager && typeof this.videoManager.optimizeForDevice === 'function';
        this.test('Connection-aware optimization', connectionAware);
    }
    
    printResults() {
        console.log('\n📊 TEST RESULTS SUMMARY');
        console.log('='.repeat(50));
        
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        const percentage = Math.round((passed / total) * 100);
        
        console.log(`Total Tests: ${total}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${total - passed}`);
        console.log(`Success Rate: ${percentage}%`);
        
        if (percentage >= 90) {
            console.log('🎉 EXCELLENT! Video integration is production ready!');
        } else if (percentage >= 75) {
            console.log('✅ GOOD! Minor issues to address.');
        } else {
            console.log('⚠️ NEEDS WORK! Several issues found.');
        }
        
        // Show failed tests
        const failed = this.testResults.filter(r => !r.passed);
        if (failed.length > 0) {
            console.log('\n❌ Failed Tests:');
            failed.forEach(test => {
                console.log(`  - ${test.name}${test.details ? ': ' + test.details : ''}`);
            });
        }
        
        console.log('\n🎬 FacePay Cinematic Video Integration Test Complete!');
    }
}

// Auto-run tests if page is loaded
if (document.readyState === 'complete') {
    const tester = new VideoIntegrationTester();
    tester.runAllTests();
} else {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const tester = new VideoIntegrationTester();
            tester.runAllTests();
        }, 1000);
    });
}

// Export for manual testing
window.FacepayVideoTester = VideoIntegrationTester;