/**
 * FacePay Professional Theme Switcher System
 * Complete DARK/LIGHT mode implementation with auto-detection, persistence, and smooth transitions
 * Built for production-ready performance and user experience
 */

class FacePayThemeSwitcher {
    constructor() {
        this.currentTheme = null;
        this.systemPreference = null;
        this.userPreference = null;
        this.toggleButton = null;
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Theme configuration
        this.themes = {
            light: {
                name: 'light',
                class: 'theme-light',
                icon: '🌙',
                label: 'Dark Mode'
            },
            dark: {
                name: 'dark',
                class: 'theme-dark',
                icon: '☀️',
                label: 'Light Mode'
            }
        };
        
        // Performance optimization - bind methods
        this.handleSystemChange = this.handleSystemChange.bind(this);
        this.toggle = this.toggle.bind(this);
        
        this.init();
    }

    /**
     * Initialize the theme system
     */
    init() {
        // Detect system preference
        this.detectSystemPreference();
        
        // Load user preference from localStorage
        this.loadUserPreference();
        
        // Determine initial theme
        this.determineInitialTheme();
        
        // Apply theme immediately (before render)
        this.applyTheme(this.currentTheme, false);
        
        // Create toggle button
        this.createToggleButton();
        
        // Setup system preference listener
        this.setupSystemListener();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Announce readiness
        this.dispatchThemeEvent('theme-ready', { theme: this.currentTheme });
        
        console.log('🎨 FacePay Theme Switcher initialized:', {
            currentTheme: this.currentTheme,
            systemPreference: this.systemPreference,
            userPreference: this.userPreference
        });
    }

    /**
     * Detect system color scheme preference
     */
    detectSystemPreference() {
        this.systemPreference = this.mediaQuery.matches ? 'dark' : 'light';
    }

    /**
     * Load user preference from localStorage
     */
    loadUserPreference() {
        try {
            const stored = localStorage.getItem('facepay-theme-preference');
            if (stored && (stored === 'light' || stored === 'dark')) {
                this.userPreference = stored;
            }
        } catch (error) {
            console.warn('Failed to load theme preference from localStorage:', error);
        }
    }

    /**
     * Save user preference to localStorage
     */
    saveUserPreference(theme) {
        try {
            localStorage.setItem('facepay-theme-preference', theme);
            this.userPreference = theme;
        } catch (error) {
            console.warn('Failed to save theme preference to localStorage:', error);
        }
    }

    /**
     * Determine initial theme based on user preference or system preference
     */
    determineInitialTheme() {
        this.currentTheme = this.userPreference || this.systemPreference || 'dark';
    }

    /**
     * Apply theme to document
     */
    applyTheme(theme, animate = true) {
        const html = document.documentElement;
        const body = document.body;
        
        // Remove all theme classes
        Object.values(this.themes).forEach(t => {
            html.classList.remove(t.class);
            body.classList.remove(t.class);
        });
        
        // Add new theme class
        const themeConfig = this.themes[theme];
        if (themeConfig) {
            html.classList.add(themeConfig.class);
            body.classList.add(themeConfig.class);
            
            // Update data attribute for CSS targeting
            html.setAttribute('data-theme', theme);
            
            // Update meta theme-color for mobile browsers
            this.updateMetaThemeColor(theme);
            
            // Add transition class for smooth animation
            if (animate) {
                body.classList.add('theme-transition');
                setTimeout(() => {
                    body.classList.remove('theme-transition');
                }, 300);
            }
        }
        
        this.currentTheme = theme;
    }

    /**
     * Update meta theme-color for mobile browsers
     */
    updateMetaThemeColor(theme) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            const colors = {
                light: '#ffffff',
                dark: '#000000'
            };
            metaThemeColor.setAttribute('content', colors[theme] || colors.dark);
        }
    }

    /**
     * Toggle between light and dark themes
     */
    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme, true);
    }

    /**
     * Set specific theme
     */
    setTheme(theme, savePreference = true) {
        if (!this.themes[theme]) {
            console.warn(`Invalid theme: ${theme}`);
            return;
        }

        const previousTheme = this.currentTheme;
        
        // Apply theme
        this.applyTheme(theme, true);
        
        // Save user preference
        if (savePreference) {
            this.saveUserPreference(theme);
        }
        
        // Update toggle button
        this.updateToggleButton();
        
        // Dispatch theme change event
        this.dispatchThemeEvent('theme-changed', {
            previousTheme,
            currentTheme: this.currentTheme
        });
        
        // Analytics tracking (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                'event_category': 'ui',
                'event_label': theme
            });
        }
    }

    /**
     * Create iOS-style theme toggle button
     */
    createToggleButton() {
        // Create toggle container
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'theme-toggle-container';
        toggleContainer.innerHTML = `
            <button 
                class="theme-toggle-button" 
                type="button" 
                aria-label="Toggle theme"
                title="Toggle between light and dark mode"
            >
                <div class="theme-toggle-track">
                    <div class="theme-toggle-thumb">
                        <span class="theme-toggle-icon">${this.themes[this.currentTheme === 'light' ? 'dark' : 'light'].icon}</span>
                    </div>
                </div>
                <span class="theme-toggle-label">${this.themes[this.currentTheme === 'light' ? 'dark' : 'light'].label}</span>
            </button>
        `;
        
        // Add to header navigation
        const nav = document.querySelector('header nav');
        if (nav) {
            // Insert before the download button
            const downloadButton = nav.querySelector('button[onclick="downloadApp()"]');
            if (downloadButton) {
                nav.insertBefore(toggleContainer, downloadButton);
            } else {
                nav.appendChild(toggleContainer);
            }
        } else {
            // Fallback: add to body
            document.body.appendChild(toggleContainer);
        }
        
        // Store reference
        this.toggleButton = toggleContainer.querySelector('.theme-toggle-button');
        
        // Add event listeners
        this.toggleButton.addEventListener('click', this.toggle);
        
        // Add touch feedback for mobile
        this.toggleButton.addEventListener('touchstart', () => {
            this.toggleButton.classList.add('theme-toggle-pressed');
        });
        
        this.toggleButton.addEventListener('touchend', () => {
            setTimeout(() => {
                this.toggleButton.classList.remove('theme-toggle-pressed');
            }, 150);
        });
        
        // Initial state
        this.updateToggleButton();
    }

    /**
     * Update toggle button appearance
     */
    updateToggleButton() {
        if (!this.toggleButton) return;
        
        const isLight = this.currentTheme === 'light';
        const nextTheme = isLight ? 'dark' : 'light';
        const themeConfig = this.themes[nextTheme];
        
        // Update icon and label
        const icon = this.toggleButton.querySelector('.theme-toggle-icon');
        const label = this.toggleButton.querySelector('.theme-toggle-label');
        
        if (icon) icon.textContent = themeConfig.icon;
        if (label) label.textContent = themeConfig.label;
        
        // Update button state
        this.toggleButton.setAttribute('data-theme', this.currentTheme);
        this.toggleButton.classList.toggle('theme-toggle-light', isLight);
        this.toggleButton.classList.toggle('theme-toggle-dark', !isLight);
    }

    /**
     * Setup system preference change listener
     */
    setupSystemListener() {
        this.mediaQuery.addEventListener('change', this.handleSystemChange);
    }

    /**
     * Handle system preference change
     */
    handleSystemChange(e) {
        this.systemPreference = e.matches ? 'dark' : 'light';
        
        // Only auto-switch if user hasn't set a manual preference
        if (!this.userPreference) {
            this.setTheme(this.systemPreference, false);
        }
        
        this.dispatchThemeEvent('system-preference-changed', {
            systemPreference: this.systemPreference
        });
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + T to toggle theme
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    /**
     * Dispatch custom theme events
     */
    dispatchThemeEvent(eventName, detail) {
        const event = new CustomEvent(eventName, {
            detail,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }

    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Check if current theme is dark
     */
    isDarkMode() {
        return this.currentTheme === 'dark';
    }

    /**
     * Check if current theme is light
     */
    isLightMode() {
        return this.currentTheme === 'light';
    }

    /**
     * Reset to system preference
     */
    resetToSystemPreference() {
        try {
            localStorage.removeItem('facepay-theme-preference');
            this.userPreference = null;
            this.setTheme(this.systemPreference, false);
        } catch (error) {
            console.warn('Failed to reset theme preference:', error);
        }
    }

    /**
     * Destroy theme switcher (cleanup)
     */
    destroy() {
        // Remove event listeners
        this.mediaQuery.removeEventListener('change', this.handleSystemChange);
        
        if (this.toggleButton) {
            this.toggleButton.removeEventListener('click', this.toggle);
        }
        
        // Remove toggle button
        const toggleContainer = document.querySelector('.theme-toggle-container');
        if (toggleContainer) {
            toggleContainer.remove();
        }
        
        // Reset to default theme
        this.applyTheme('dark', false);
        
        console.log('🎨 FacePay Theme Switcher destroyed');
    }
}

// Auto-initialize when DOM is ready
let themeInstance = null;

function initFacePayTheme() {
    if (!themeInstance) {
        themeInstance = new FacePayThemeSwitcher();
        
        // Make available globally for debugging
        window.FacePayTheme = themeInstance;
    }
    return themeInstance;
}

// Initialize immediately if DOM is already ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFacePayTheme);
} else {
    initFacePayTheme();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FacePayThemeSwitcher;
}

// Add to global scope for direct access
window.FacePayThemeSwitcher = FacePayThemeSwitcher;