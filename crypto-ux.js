/**
 * FacePay Crypto UX System - Phantom-Level Excellence
 * Advanced crypto wallet UX with progressive disclosure, security, and mobile optimization
 */

class FacePayCryptoUX {
    constructor() {
        this.state = {
            user: null,
            wallet: null,
            onboarding: { step: 0, completed: false },
            security: { score: 0, faceIdEnabled: false },
            transactions: new Map(),
            gasEstimates: new Map(),
            networkStatus: 'connected'
        };
        
        this.animations = new Map();
        this.securityIndicators = new Map();
        this.touchGestures = new Map();
        
        this.init();
    }

    async init() {
        this.setupMobileOptimizations();
        this.initializeSecuritySystems();
        this.setupErrorHandling();
        this.initializeAnimations();
        this.startNetworkMonitoring();
        
        console.log('🚀 FacePay Crypto UX System initialized');
    }

    // ==================== ONBOARDING EXCELLENCE ====================
    
    async startOnboarding() {
        const onboardingSteps = [
            { id: 'welcome', title: 'Welcome to FacePay', component: 'WelcomeScreen' },
            { id: 'security', title: 'Enable Face ID', component: 'SecuritySetup' },
            { id: 'wallet', title: 'Create Wallet', component: 'WalletCreation' },
            { id: 'backup', title: 'Secure Backup', component: 'BackupPhrase' },
            { id: 'verification', title: 'Verify Backup', component: 'BackupVerification' },
            { id: 'complete', title: 'Ready to Go!', component: 'OnboardingComplete' }
        ];

        return this.progressiveDisclosure(onboardingSteps);
    }

    async progressiveDisclosure(steps) {
        const container = this.createOnboardingContainer();
        
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            this.state.onboarding.step = i;
            
            await this.renderOnboardingStep(container, step, i, steps.length);
            await this.waitForStepCompletion(step);
            
            // Smooth transition animation
            await this.animateStepTransition(container, i, steps.length);
        }
        
        this.state.onboarding.completed = true;
        await this.celebrateOnboardingComplete();
    }

    createOnboardingContainer() {
        const container = document.createElement('div');
        container.className = 'facepay-onboarding';
        container.innerHTML = `
            <div class="onboarding-header">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="step-indicator"></div>
            </div>
            <div class="onboarding-content"></div>
            <div class="onboarding-actions">
                <button class="btn-secondary" id="back-btn">Back</button>
                <button class="btn-primary" id="continue-btn">Continue</button>
            </div>
        `;
        
        document.body.appendChild(container);
        return container;
    }

    async renderOnboardingStep(container, step, index, total) {
        const content = container.querySelector('.onboarding-content');
        const progressBar = container.querySelector('.progress-fill');
        const stepIndicator = container.querySelector('.step-indicator');
        
        // Update progress
        const progress = ((index + 1) / total) * 100;
        progressBar.style.width = `${progress}%`;
        stepIndicator.textContent = `${index + 1} of ${total}`;
        
        // Render step content
        content.innerHTML = await this.getStepContent(step);
        
        // Add step-specific interactions
        this.addStepInteractions(step, content);
        
        // Animate in
        await this.animateContentIn(content);
    }

    async getStepContent(step) {
        const templates = {
            welcome: `
                <div class="welcome-screen">
                    <div class="hero-icon">👤</div>
                    <h2>Welcome to FacePay</h2>
                    <p>Your face is your wallet. Send crypto as easily as sending a text.</p>
                    <div class="feature-highlights">
                        <div class="feature">
                            <span class="icon">⚡</span>
                            <span>Instant transactions</span>
                        </div>
                        <div class="feature">
                            <span class="icon">🔒</span>
                            <span>Bank-level security</span>
                        </div>
                        <div class="feature">
                            <span class="icon">📱</span>
                            <span>Mobile-first design</span>
                        </div>
                    </div>
                </div>
            `,
            security: `
                <div class="security-setup">
                    <div class="face-id-demo">
                        <div class="face-scan-animation"></div>
                    </div>
                    <h2>Enable Face ID</h2>
                    <p>Use your face to securely authorize transactions and access your wallet.</p>
                    <div class="security-benefits">
                        <div class="benefit">
                            <span class="icon">🛡️</span>
                            <span>Prevents unauthorized access</span>
                        </div>
                        <div class="benefit">
                            <span class="icon">⚡</span>
                            <span>One-tap transaction approval</span>
                        </div>
                    </div>
                    <button class="face-id-enable-btn">Enable Face ID</button>
                </div>
            `,
            wallet: `
                <div class="wallet-creation">
                    <div class="wallet-icon-animated"></div>
                    <h2>Create Your Wallet</h2>
                    <p>Your wallet is being generated with military-grade encryption.</p>
                    <div class="creation-progress">
                        <div class="step active">
                            <span class="icon">🔐</span>
                            <span>Generating keys</span>
                        </div>
                        <div class="step">
                            <span class="icon">🌐</span>
                            <span>Connecting to network</span>
                        </div>
                        <div class="step">
                            <span class="icon">✅</span>
                            <span>Wallet ready</span>
                        </div>
                    </div>
                </div>
            `,
            backup: `
                <div class="backup-setup">
                    <div class="backup-icon">📝</div>
                    <h2>Secure Your Wallet</h2>
                    <p>Write down these 12 words in order. This is your backup phrase.</p>
                    <div class="backup-phrase-container">
                        <div class="backup-phrase"></div>
                        <button class="reveal-phrase-btn">Tap to Reveal</button>
                    </div>
                    <div class="security-tips">
                        <div class="tip">
                            <span class="icon">✍️</span>
                            <span>Write it down on paper</span>
                        </div>
                        <div class="tip">
                            <span class="icon">🔒</span>
                            <span>Store in a safe place</span>
                        </div>
                        <div class="tip">
                            <span class="icon">🚫</span>
                            <span>Never share with anyone</span>
                        </div>
                    </div>
                </div>
            `,
            verification: `
                <div class="backup-verification">
                    <div class="verification-icon">🔍</div>
                    <h2>Verify Your Backup</h2>
                    <p>Tap the words in the correct order to verify your backup phrase.</p>
                    <div class="word-verification">
                        <div class="verification-prompt"></div>
                        <div class="word-options"></div>
                    </div>
                </div>
            `,
            complete: `
                <div class="onboarding-complete">
                    <div class="success-animation"></div>
                    <h2>You're All Set!</h2>
                    <p>Your FacePay wallet is ready. Start sending crypto with just your face.</p>
                    <div class="completion-stats">
                        <div class="stat">
                            <span class="value">100%</span>
                            <span class="label">Secure</span>
                        </div>
                        <div class="stat">
                            <span class="value">⚡</span>
                            <span class="label">Fast</span>
                        </div>
                        <div class="stat">
                            <span class="value">🎉</span>
                            <span class="label">Ready</span>
                        </div>
                    </div>
                    <button class="start-using-btn">Start Using FacePay</button>
                </div>
            `
        };
        
        return templates[step.id] || '<div>Step content not found</div>';
    }

    // ==================== TRANSACTION UX EXCELLENCE ====================
    
    async initiateTransaction(recipient, amount, token = 'ETH') {
        const txId = this.generateTransactionId();
        
        // Real-time gas estimation
        const gasEstimate = await this.estimateGas(recipient, amount, token);
        this.state.gasEstimates.set(txId, gasEstimate);
        
        // Create transaction UI
        const transactionUI = this.createTransactionInterface(txId, recipient, amount, token, gasEstimate);
        
        // Progressive transaction flow
        return this.executeTransactionFlow(txId, transactionUI);
    }

    async estimateGas(recipient, amount, token) {
        // Simulate real-time gas estimation
        const baseGas = 21000;
        const gasPrice = await this.getCurrentGasPrice();
        
        return {
            gasLimit: baseGas + (token !== 'ETH' ? 45000 : 0),
            gasPrice: gasPrice,
            estimatedCost: (baseGas * gasPrice) / 1e18,
            speeds: {
                slow: { price: gasPrice * 0.8, time: '5-10 min' },
                standard: { price: gasPrice, time: '2-5 min' },
                fast: { price: gasPrice * 1.2, time: '< 2 min' }
            }
        };
    }

    createTransactionInterface(txId, recipient, amount, token, gasEstimate) {
        const container = document.createElement('div');
        container.className = 'transaction-interface';
        container.innerHTML = `
            <div class="tx-header">
                <div class="tx-icon">${this.getTokenIcon(token)}</div>
                <h3>Send ${token}</h3>
                <button class="close-btn">×</button>
            </div>
            
            <div class="tx-details">
                <div class="amount-display">
                    <span class="amount">${amount}</span>
                    <span class="token">${token}</span>
                </div>
                
                <div class="recipient-display">
                    <span class="to-label">To:</span>
                    <span class="recipient">${this.formatRecipient(recipient)}</span>
                </div>
                
                <div class="gas-optimizer">
                    <h4>Transaction Speed</h4>
                    <div class="gas-options">
                        ${this.createGasOptions(gasEstimate)}
                    </div>
                </div>
                
                <div class="tx-summary">
                    <div class="summary-row">
                        <span>Amount:</span>
                        <span>${amount} ${token}</span>
                    </div>
                    <div class="summary-row">
                        <span>Network Fee:</span>
                        <span id="selected-fee">${gasEstimate.estimatedCost.toFixed(6)} ETH</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span>${amount} ${token} + fees</span>
                    </div>
                </div>
            </div>
            
            <div class="tx-actions">
                <button class="btn-secondary cancel-btn">Cancel</button>
                <button class="btn-primary confirm-btn" data-tx-id="${txId}">
                    <span class="btn-text">Confirm with Face ID</span>
                    <div class="face-id-icon">👤</div>
                </button>
            </div>
            
            <div class="security-indicator">
                <div class="security-badge">
                    <span class="shield-icon">🛡️</span>
                    <span>Secured by Face ID</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        this.addTransactionInteractions(container, txId);
        
        return container;
    }

    createGasOptions(gasEstimate) {
        const options = ['slow', 'standard', 'fast'];
        return options.map(speed => {
            const option = gasEstimate.speeds[speed];
            return `
                <div class="gas-option ${speed === 'standard' ? 'selected' : ''}" data-speed="${speed}">
                    <div class="speed-info">
                        <span class="speed-name">${speed.charAt(0).toUpperCase() + speed.slice(1)}</span>
                        <span class="speed-time">${option.time}</span>
                    </div>
                    <div class="speed-cost">${(option.price / 1e9).toFixed(1)} gwei</div>
                </div>
            `;
        }).join('');
    }

    async executeTransactionFlow(txId, ui) {
        return new Promise((resolve, reject) => {
            const confirmBtn = ui.querySelector('.confirm-btn');
            
            confirmBtn.addEventListener('click', async () => {
                try {
                    // Start Face ID authentication
                    await this.authenticateWithFaceId();
                    
                    // Show transaction processing
                    this.showTransactionProcessing(ui, txId);
                    
                    // Execute transaction
                    const result = await this.executeTransaction(txId);
                    
                    // Show success animation
                    await this.showTransactionSuccess(ui, result);
                    
                    resolve(result);
                } catch (error) {
                    this.handleTransactionError(ui, error);
                    reject(error);
                }
            });
        });
    }

    async showTransactionProcessing(ui, txId) {
        const content = ui.querySelector('.tx-details');
        content.innerHTML = `
            <div class="processing-screen">
                <div class="processing-animation">
                    <div class="loading-rings">
                        <div class="ring"></div>
                        <div class="ring"></div>
                        <div class="ring"></div>
                    </div>
                </div>
                <h3>Processing Transaction</h3>
                <p>Please wait while your transaction is being processed...</p>
                <div class="processing-steps">
                    <div class="step active">
                        <span class="icon">🔐</span>
                        <span>Authenticating</span>
                    </div>
                    <div class="step">
                        <span class="icon">📡</span>
                        <span>Broadcasting</span>
                    </div>
                    <div class="step">
                        <span class="icon">⛏️</span>
                        <span>Mining</span>
                    </div>
                    <div class="step">
                        <span class="icon">✅</span>
                        <span>Confirmed</span>
                    </div>
                </div>
                <div class="tx-hash">
                    <span>Transaction ID:</span>
                    <span class="hash">${txId.slice(0, 10)}...</span>
                </div>
            </div>
        `;
        
        // Animate processing steps
        this.animateProcessingSteps(ui);
    }

    async showTransactionSuccess(ui, result) {
        const content = ui.querySelector('.tx-details');
        content.innerHTML = `
            <div class="success-screen">
                <div class="success-animation">
                    <div class="checkmark-circle">
                        <div class="checkmark"></div>
                    </div>
                </div>
                <h3>Transaction Successful!</h3>
                <p>Your payment has been sent successfully.</p>
                <div class="success-details">
                    <div class="detail-row">
                        <span>Transaction Hash:</span>
                        <span class="hash">${result.hash}</span>
                    </div>
                    <div class="detail-row">
                        <span>Block Number:</span>
                        <span>${result.blockNumber}</span>
                    </div>
                    <div class="detail-row">
                        <span>Gas Used:</span>
                        <span>${result.gasUsed}</span>
                    </div>
                </div>
                <div class="success-actions">
                    <button class="btn-secondary view-explorer">View on Explorer</button>
                    <button class="btn-primary done-btn">Done</button>
                </div>
            </div>
        `;
        
        // Trigger success animation
        await this.playSuccessAnimation(ui);
        
        // Auto-close after delay
        setTimeout(() => {
            this.closeTransactionInterface(ui);
        }, 3000);
    }

    // ==================== SECURITY UX SYSTEM ====================
    
    async authenticateWithFaceId() {
        if (!this.state.security.faceIdEnabled) {
            throw new Error('Face ID not enabled');
        }
        
        return new Promise((resolve, reject) => {
            const faceIdModal = this.createFaceIdModal();
            
            // Simulate Face ID process
            setTimeout(() => {
                const success = Math.random() > 0.1; // 90% success rate
                
                if (success) {
                    this.animateFaceIdSuccess(faceIdModal);
                    setTimeout(() => {
                        document.body.removeChild(faceIdModal);
                        resolve(true);
                    }, 1000);
                } else {
                    this.animateFaceIdError(faceIdModal);
                    setTimeout(() => {
                        document.body.removeChild(faceIdModal);
                        reject(new Error('Face ID authentication failed'));
                    }, 2000);
                }
            }, 2000);
        });
    }

    createFaceIdModal() {
        const modal = document.createElement('div');
        modal.className = 'face-id-modal';
        modal.innerHTML = `
            <div class="face-id-content">
                <div class="face-id-scanner">
                    <div class="scan-frame"></div>
                    <div class="scan-overlay">
                        <div class="scan-line"></div>
                    </div>
                    <div class="face-outline"></div>
                </div>
                <h3>Authenticate with Face ID</h3>
                <p>Look at the camera to authorize this transaction</p>
                <div class="auth-indicators">
                    <div class="indicator" data-step="position">Position your face</div>
                    <div class="indicator" data-step="scanning">Scanning...</div>
                    <div class="indicator" data-step="complete">Authentication complete</div>
                </div>
                <button class="cancel-auth-btn">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.startFaceIdAnimation(modal);
        
        return modal;
    }

    calculateSecurityScore() {
        let score = 0;
        const factors = {
            faceId: this.state.security.faceIdEnabled ? 30 : 0,
            backupPhrase: this.state.user?.backupVerified ? 25 : 0,
            networkSecurity: this.state.networkStatus === 'connected' ? 20 : 0,
            transactionHistory: this.state.transactions.size > 0 ? 15 : 0,
            appVersion: 10 // Always current
        };
        
        score = Object.values(factors).reduce((a, b) => a + b, 0);
        this.state.security.score = Math.min(100, score);
        
        return this.state.security.score;
    }

    createSecurityIndicator() {
        const score = this.calculateSecurityScore();
        const indicator = document.createElement('div');
        indicator.className = 'security-indicator';
        indicator.innerHTML = `
            <div class="security-score">
                <div class="score-circle">
                    <svg viewBox="0 0 36 36">
                        <path class="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                        <path class="score-fill" stroke-dasharray="${score}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    </svg>
                    <div class="score-text">${score}</div>
                </div>
                <div class="security-status">
                    <h4>Security Score</h4>
                    <p>${this.getSecurityStatusText(score)}</p>
                </div>
            </div>
        `;
        
        return indicator;
    }

    // ==================== ERROR HANDLING & RECOVERY ====================
    
    setupErrorHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            this.handleGlobalError(event.reason);
        });
        
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event.error);
        });
    }

    handleTransactionError(ui, error) {
        const errorTypes = {
            'insufficient_funds': {
                title: 'Insufficient Funds',
                message: 'You don\'t have enough balance for this transaction.',
                recovery: 'Add funds to your wallet',
                icon: '💳'
            },
            'network_error': {
                title: 'Network Error',
                message: 'Unable to connect to the blockchain network.',
                recovery: 'Check your internet connection and try again',
                icon: '📡'
            },
            'gas_estimation_failed': {
                title: 'Gas Estimation Failed',
                message: 'Unable to estimate transaction fees.',
                recovery: 'Try adjusting the transaction amount',
                icon: '⛽'
            },
            'face_id_failed': {
                title: 'Authentication Failed',
                message: 'Face ID authentication was unsuccessful.',
                recovery: 'Try again or use backup authentication',
                icon: '🔐'
            },
            'transaction_rejected': {
                title: 'Transaction Rejected',
                message: 'The transaction was rejected by the network.',
                recovery: 'Check transaction details and try again',
                icon: '❌'
            }
        };
        
        const errorInfo = errorTypes[error.type] || {
            title: 'Transaction Error',
            message: 'An unexpected error occurred.',
            recovery: 'Please try again',
            icon: '⚠️'
        };
        
        this.showErrorInterface(ui, errorInfo, error);
    }

    showErrorInterface(ui, errorInfo, originalError) {
        const content = ui.querySelector('.tx-details');
        content.innerHTML = `
            <div class="error-screen">
                <div class="error-animation">
                    <div class="error-icon">${errorInfo.icon}</div>
                </div>
                <h3>${errorInfo.title}</h3>
                <p>${errorInfo.message}</p>
                <div class="error-recovery">
                    <h4>What you can do:</h4>
                    <p>${errorInfo.recovery}</p>
                </div>
                <div class="error-actions">
                    <button class="btn-secondary details-btn">View Details</button>
                    <button class="btn-primary retry-btn">Try Again</button>
                </div>
                <div class="error-details hidden">
                    <h5>Technical Details:</h5>
                    <pre>${JSON.stringify(originalError, null, 2)}</pre>
                </div>
            </div>
        `;
        
        // Add error-specific recovery flows
        this.addErrorRecoveryActions(ui, errorInfo, originalError);
    }

    // ==================== MOBILE-FIRST CRYPTO INTERACTIONS ====================
    
    setupMobileOptimizations() {
        // Touch-optimized button sizes
        this.addGlobalStyles(`
            .facepay-btn {
                min-height: 48px;
                min-width: 48px;
                touch-action: manipulation;
            }
            
            .touch-target {
                padding: 12px;
                margin: 8px;
            }
            
            @media (max-width: 768px) {
                .transaction-interface {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 9999;
                }
            }
        `);
        
        // Haptic feedback simulation
        this.setupHapticFeedback();
        
        // Gesture recognition
        this.setupGestureRecognition();
        
        // Mobile viewport optimizations
        this.optimizeForMobileViewport();
    }

    setupHapticFeedback() {
        this.haptic = {
            light: () => {
                if (navigator.vibrate) navigator.vibrate(10);
            },
            medium: () => {
                if (navigator.vibrate) navigator.vibrate(20);
            },
            heavy: () => {
                if (navigator.vibrate) navigator.vibrate([30, 10, 30]);
            },
            success: () => {
                if (navigator.vibrate) navigator.vibrate([100, 30, 100]);
            },
            error: () => {
                if (navigator.vibrate) navigator.vibrate([200, 50, 200, 50, 200]);
            }
        };
    }

    setupGestureRecognition() {
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            this.handleGesture();
        }, { passive: true });
        
        const handleGesture = () => {
            const swipeDistance = touchStartY - touchEndY;
            const minSwipeDistance = 50;
            
            if (Math.abs(swipeDistance) < minSwipeDistance) return;
            
            if (swipeDistance > 0) {
                // Swipe up - Quick actions
                this.showQuickActions();
            } else {
                // Swipe down - Close modals
                this.closeTopModal();
            }
        };
    }

    // ==================== USERNAME-BASED SENDING (@username) ====================
    
    async resolveUsername(username) {
        // Remove @ symbol if present
        const cleanUsername = username.replace('@', '');
        
        // Simulate username resolution
        const mockUsers = {
            'alice': '0x742d35Cc6634C0532925a3b8D484Bb1a4e134c52',
            'bob': '0x742d35Cc6634C0532925a3b8D484Bb1a4e134c53',
            'charlie': '0x742d35Cc6634C0532925a3b8D484Bb1a4e134c54'
        };
        
        if (mockUsers[cleanUsername.toLowerCase()]) {
            return {
                username: cleanUsername,
                address: mockUsers[cleanUsername.toLowerCase()],
                verified: true,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`
            };
        }
        
        throw new Error(`Username @${cleanUsername} not found`);
    }

    createUsernameInput() {
        const container = document.createElement('div');
        container.className = 'username-input-container';
        container.innerHTML = `
            <div class="input-group">
                <span class="input-prefix">@</span>
                <input type="text" 
                       class="username-input" 
                       placeholder="username" 
                       autocomplete="off"
                       spellcheck="false">
                <div class="username-suggestions"></div>
            </div>
            <div class="resolved-user hidden">
                <div class="user-avatar"></div>
                <div class="user-info">
                    <span class="username"></span>
                    <span class="address"></span>
                </div>
                <div class="verified-badge">✓</div>
            </div>
        `;
        
        this.addUsernameInputBehavior(container);
        return container;
    }

    addUsernameInputBehavior(container) {
        const input = container.querySelector('.username-input');
        const suggestions = container.querySelector('.username-suggestions');
        const resolvedUser = container.querySelector('.resolved-user');
        
        let debounceTimeout;
        
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimeout);
            const value = e.target.value.trim();
            
            if (value.length < 2) {
                suggestions.classList.add('hidden');
                resolvedUser.classList.add('hidden');
                return;
            }
            
            debounceTimeout = setTimeout(async () => {
                try {
                    const user = await this.resolveUsername(value);
                    this.showResolvedUser(resolvedUser, user);
                    suggestions.classList.add('hidden');
                } catch (error) {
                    this.showUsernameSuggestions(suggestions, value);
                    resolvedUser.classList.add('hidden');
                }
            }, 300);
        });
    }

    // ==================== REAL-TIME STATUS & ANIMATIONS ====================
    
    async playSuccessAnimation(container) {
        const animation = container.querySelector('.success-animation');
        animation.style.transform = 'scale(0)';
        animation.style.opacity = '0';
        
        // Animate in
        await this.animate(animation, {
            transform: 'scale(1)',
            opacity: '1'
        }, 600, 'cubic-bezier(0.68, -0.55, 0.265, 1.55)');
        
        // Pulse effect
        await this.animate(animation, {
            transform: 'scale(1.1)'
        }, 200);
        
        await this.animate(animation, {
            transform: 'scale(1)'
        }, 200);
        
        // Haptic feedback
        this.haptic.success();
    }

    startNetworkMonitoring() {
        setInterval(() => {
            this.checkNetworkStatus();
        }, 5000);
        
        // Real-time gas price monitoring
        setInterval(() => {
            this.updateGasPrices();
        }, 15000);
    }

    async checkNetworkStatus() {
        try {
            const response = await fetch('https://api.etherscan.io/api?module=proxy&action=eth_blockNumber', {
                timeout: 5000
            });
            
            if (response.ok) {
                this.state.networkStatus = 'connected';
                this.updateNetworkIndicator('connected');
            } else {
                throw new Error('Network error');
            }
        } catch (error) {
            this.state.networkStatus = 'disconnected';
            this.updateNetworkIndicator('disconnected');
        }
    }

    updateNetworkIndicator(status) {
        const indicators = document.querySelectorAll('.network-indicator');
        indicators.forEach(indicator => {
            indicator.className = `network-indicator ${status}`;
            indicator.textContent = status === 'connected' ? 'Online' : 'Offline';
        });
    }

    // ==================== UTILITY METHODS ====================
    
    generateTransactionId() {
        return '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0')).join('');
    }

    formatRecipient(recipient) {
        if (recipient.startsWith('@')) {
            return recipient;
        }
        
        if (recipient.length === 42 && recipient.startsWith('0x')) {
            return recipient.slice(0, 6) + '...' + recipient.slice(-4);
        }
        
        return recipient;
    }

    getTokenIcon(token) {
        const icons = {
            'ETH': '⟠',
            'BTC': '₿',
            'USDC': '💵',
            'USDT': '💰'
        };
        return icons[token] || '🪙';
    }

    async getCurrentGasPrice() {
        // Simulate real-time gas price (in wei)
        const basePrice = 20e9; // 20 gwei
        const variation = (Math.random() - 0.5) * 0.3; // ±30% variation
        return Math.floor(basePrice * (1 + variation));
    }

    async animate(element, properties, duration = 300, easing = 'ease') {
        return new Promise((resolve) => {
            const keyframes = [];
            const startStyles = {};
            
            // Get initial values
            for (const prop in properties) {
                startStyles[prop] = getComputedStyle(element)[prop] || '0';
            }
            
            keyframes.push(startStyles);
            keyframes.push(properties);
            
            const animation = element.animate(keyframes, {
                duration,
                easing,
                fill: 'forwards'
            });
            
            animation.onfinish = resolve;
        });
    }

    addGlobalStyles(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Initialize mobile-specific styles
    initializeMobileStyles() {
        this.addGlobalStyles(`
            .facepay-onboarding,
            .transaction-interface,
            .face-id-modal {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                box-sizing: border-box;
            }
            
            .facepay-onboarding {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                color: white;
            }
            
            .onboarding-header {
                padding: 20px;
                text-align: center;
            }
            
            .progress-bar {
                width: 100%;
                height: 4px;
                background: rgba(255,255,255,0.3);
                border-radius: 2px;
                margin-bottom: 10px;
            }
            
            .progress-fill {
                height: 100%;
                background: white;
                border-radius: 2px;
                transition: width 0.3s ease;
            }
            
            .transaction-interface {
                background: white;
                border-radius: 20px 20px 0 0;
                box-shadow: 0 -10px 40px rgba(0,0,0,0.3);
                max-width: 400px;
                margin: 0 auto;
                overflow: hidden;
            }
            
            .face-id-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 11000;
                color: white;
            }
            
            .face-id-scanner {
                width: 200px;
                height: 200px;
                border: 2px solid #007AFF;
                border-radius: 50%;
                position: relative;
                margin: 0 auto 20px;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.7); }
                70% { box-shadow: 0 0 0 20px rgba(0, 122, 255, 0); }
                100% { box-shadow: 0 0 0 0 rgba(0, 122, 255, 0); }
            }
            
            .btn-primary {
                background: #007AFF;
                color: white;
                border: none;
                border-radius: 12px;
                padding: 16px 24px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .btn-primary:hover {
                background: #0056b3;
                transform: translateY(-1px);
            }
            
            .btn-primary:active {
                transform: translateY(0);
            }
            
            .btn-secondary {
                background: #f1f1f1;
                color: #333;
                border: none;
                border-radius: 12px;
                padding: 16px 24px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .processing-animation .loading-rings {
                display: inline-block;
                position: relative;
                width: 80px;
                height: 80px;
            }
            
            .processing-animation .ring {
                box-sizing: border-box;
                display: block;
                position: absolute;
                width: 64px;
                height: 64px;
                margin: 8px;
                border: 8px solid #007AFF;
                border-radius: 50%;
                animation: loading-rings 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                border-color: #007AFF transparent transparent transparent;
            }
            
            .processing-animation .ring:nth-child(1) { animation-delay: -0.45s; }
            .processing-animation .ring:nth-child(2) { animation-delay: -0.3s; }
            .processing-animation .ring:nth-child(3) { animation-delay: -0.15s; }
            
            @keyframes loading-rings {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .success-animation .checkmark-circle {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: #28a745;
                position: relative;
                margin: 0 auto;
                animation: scale-in 0.5s ease-out;
            }
            
            .success-animation .checkmark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 30px;
                height: 15px;
                border: 3px solid white;
                border-top: none;
                border-right: none;
                transform-origin: center;
                animation: checkmark-draw 0.3s ease-out 0.3s both;
                transform: translate(-50%, -60%) rotate(-45deg) scale(0);
            }
            
            @keyframes scale-in {
                from { transform: scale(0); }
                to { transform: scale(1); }
            }
            
            @keyframes checkmark-draw {
                to { transform: translate(-50%, -60%) rotate(-45deg) scale(1); }
            }
        `);
    }

    // Initialize the system
    initializeAnimations() {
        this.initializeMobileStyles();
    }
}

// Initialize the FacePay Crypto UX System
const facePayCryptoUX = new FacePayCryptoUX();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FacePayCryptoUX;
} else if (typeof window !== 'undefined') {
    window.FacePayCryptoUX = FacePayCryptoUX;
    window.facePayCryptoUX = facePayCryptoUX;
}

console.log('✅ FacePay Crypto UX System loaded successfully');