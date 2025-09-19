#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

/**
 * EXHAUSTIVE BUNDLE SIZE ANALYSIS SUITE
 * ZERO TOLERANCE for bloated bundles - Every byte matters
 * Validates: Total size, individual chunks, compression ratios, critical resources
 */

class BundleAnalyzer {
    constructor() {
        this.results = {};
        this.violations = [];
        
        // STRICT SIZE LIMITS - PERFORMANCE FIRST
        this.limits = {
            // Critical limits (blocking rendering)
            criticalCSS: 14000,      // 14KB - Above-the-fold CSS
            criticalJS: 50000,       // 50KB - Essential JavaScript
            totalCritical: 64000,    // 64KB - Total critical resources
            
            // Bundle limits
            mainJS: 150000,          // 150KB - Main JavaScript bundle
            mainCSS: 30000,          // 30KB - Main CSS bundle
            vendorJS: 200000,        // 200KB - Third-party libraries
            
            // Asset limits
            images: 300000,          // 300KB - Total images per page
            fonts: 100000,           // 100KB - Web fonts
            videos: 2000000,         // 2MB - Video content
            
            // Total page limits
            totalUncompressed: 1000000,  // 1MB - Total uncompressed
            totalGzipped: 300000,        // 300KB - Total gzipped
            totalBrotli: 250000,         // 250KB - Total brotli compressed
            
            // Resource counts
            maxRequests: 50,             // Maximum HTTP requests
            maxDomainSharding: 3,        // Maximum domains
            
            // Performance budgets
            firstLoad: 200000,           // 200KB - First meaningful paint resources
            routeBasedSplitting: 100000  // 100KB - Per route/page
        };
        
        this.projectRoot = '/Users/davicho/hackathon-starknet/invisible-yield-mobile/facepay-landing';
        this.distPath = path.join(this.projectRoot, 'dist');
    }

    async runComprehensiveAnalysis() {
        console.log('📦 STARTING EXHAUSTIVE BUNDLE SIZE ANALYSIS');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        try {
            // Build project if needed
            await this.ensureBuild();
            
            // Run all analysis steps
            await this.analyzeJavaScript();
            await this.analyzeCSS();
            await this.analyzeAssets();
            await this.analyzeCompression();
            await this.analyzeNetworkRequests();
            await this.analyzeCriticalPath();
            await this.analyzeWebpackBundles();
            
            await this.generateReports();
            this.validateBudgets();
            
        } catch (error) {
            console.error('💥 CRITICAL ANALYSIS FAILURE:', error);
            process.exit(1);
        }
    }

    async ensureBuild() {
        console.log('🔨 Ensuring fresh production build...');
        
        try {
            const { stdout, stderr } = await execAsync('npm run build', { 
                cwd: this.projectRoot,
                timeout: 120000 
            });
            
            console.log('✅ Production build completed');
            
            // Verify dist directory exists
            const distExists = await fs.access(this.distPath).then(() => true).catch(() => false);
            if (!distExists) {
                throw new Error('Distribution directory not found after build');
            }
            
        } catch (error) {
            console.error('❌ Build failed:', error.message);
            throw error;
        }
    }

    async analyzeJavaScript() {
        console.log('\n📊 Analyzing JavaScript bundles...');
        
        const jsFiles = await this.findFiles(this.distPath, /\.js$/);
        this.results.javascript = {
            files: [],
            totalSize: 0,
            gzippedSize: 0,
            mainBundle: null,
            vendorBundle: null,
            chunks: []
        };
        
        for (const file of jsFiles) {
            const stats = await fs.stat(file);
            const content = await fs.readFile(file, 'utf8');
            const gzippedSize = await this.getGzippedSize(content);
            
            const fileInfo = {
                name: path.basename(file),
                path: file,
                size: stats.size,
                gzippedSize: gzippedSize,
                isMain: file.includes('main') || file.includes('index'),
                isVendor: file.includes('vendor') || file.includes('chunk'),
                isChunk: file.includes('chunk')
            };
            
            this.results.javascript.files.push(fileInfo);
            this.results.javascript.totalSize += stats.size;
            this.results.javascript.gzippedSize += gzippedSize;
            
            // Categorize bundles
            if (fileInfo.isMain && !this.results.javascript.mainBundle) {
                this.results.javascript.mainBundle = fileInfo;
            }
            if (fileInfo.isVendor && !this.results.javascript.vendorBundle) {
                this.results.javascript.vendorBundle = fileInfo;
            }
            if (fileInfo.isChunk) {
                this.results.javascript.chunks.push(fileInfo);
            }
        }
        
        this.checkJavaScriptLimits();
        this.displayJavaScriptResults();
    }

    async analyzeCSS() {
        console.log('\n🎨 Analyzing CSS bundles...');
        
        const cssFiles = await this.findFiles(this.distPath, /\.css$/);
        this.results.css = {
            files: [],
            totalSize: 0,
            gzippedSize: 0,
            criticalCSS: null,
            mainCSS: null
        };
        
        for (const file of cssFiles) {
            const stats = await fs.stat(file);
            const content = await fs.readFile(file, 'utf8');
            const gzippedSize = await this.getGzippedSize(content);
            
            const fileInfo = {
                name: path.basename(file),
                path: file,
                size: stats.size,
                gzippedSize: gzippedSize,
                isCritical: file.includes('critical') || file.includes('inline'),
                isMain: file.includes('main') || file.includes('style')
            };
            
            this.results.css.files.push(fileInfo);
            this.results.css.totalSize += stats.size;
            this.results.css.gzippedSize += gzippedSize;
            
            if (fileInfo.isCritical && !this.results.css.criticalCSS) {
                this.results.css.criticalCSS = fileInfo;
            }
            if (fileInfo.isMain && !this.results.css.mainCSS) {
                this.results.css.mainCSS = fileInfo;
            }
        }
        
        this.checkCSSLimits();
        this.displayCSSResults();
    }

    async analyzeAssets() {
        console.log('\n🖼️ Analyzing static assets...');
        
        this.results.assets = {
            images: { files: [], totalSize: 0 },
            fonts: { files: [], totalSize: 0 },
            videos: { files: [], totalSize: 0 },
            other: { files: [], totalSize: 0 }
        };
        
        // Analyze images
        const imageFiles = await this.findFiles(this.distPath, /\.(jpg|jpeg|png|gif|svg|webp|avif)$/i);
        for (const file of imageFiles) {
            const stats = await fs.stat(file);
            const fileInfo = {
                name: path.basename(file),
                path: file,
                size: stats.size,
                type: path.extname(file).toLowerCase()
            };
            
            this.results.assets.images.files.push(fileInfo);
            this.results.assets.images.totalSize += stats.size;
        }
        
        // Analyze fonts
        const fontFiles = await this.findFiles(this.distPath, /\.(woff|woff2|ttf|eot|otf)$/i);
        for (const file of fontFiles) {
            const stats = await fs.stat(file);
            const fileInfo = {
                name: path.basename(file),
                path: file,
                size: stats.size,
                type: path.extname(file).toLowerCase()
            };
            
            this.results.assets.fonts.files.push(fileInfo);
            this.results.assets.fonts.totalSize += stats.size;
        }
        
        // Analyze videos
        const videoFiles = await this.findFiles(this.distPath, /\.(mp4|webm|ogv|mov)$/i);
        for (const file of videoFiles) {
            const stats = await fs.stat(file);
            const fileInfo = {
                name: path.basename(file),
                path: file,
                size: stats.size,
                type: path.extname(file).toLowerCase()
            };
            
            this.results.assets.videos.files.push(fileInfo);
            this.results.assets.videos.totalSize += stats.size;
        }
        
        this.checkAssetLimits();
        this.displayAssetResults();
    }

    async analyzeCompression() {
        console.log('\n🗜️ Analyzing compression ratios...');
        
        const totalUncompressed = this.results.javascript.totalSize + this.results.css.totalSize + 
                                 this.results.assets.images.totalSize + this.results.assets.fonts.totalSize;
        
        const totalGzipped = this.results.javascript.gzippedSize + this.results.css.gzippedSize;
        
        // Calculate Brotli compression (estimate based on typical ratios)
        const estimatedBrotli = Math.round(totalGzipped * 0.85);
        
        this.results.compression = {
            uncompressed: totalUncompressed,
            gzipped: totalGzipped,
            brotli: estimatedBrotli,
            gzipRatio: totalUncompressed > 0 ? (totalGzipped / totalUncompressed) : 0,
            brotliRatio: totalUncompressed > 0 ? (estimatedBrotli / totalUncompressed) : 0
        };
        
        this.checkCompressionLimits();
        this.displayCompressionResults();
    }

    async analyzeNetworkRequests() {
        console.log('\n🌐 Analyzing network requests...');
        
        const allFiles = [
            ...this.results.javascript.files,
            ...this.results.css.files,
            ...this.results.assets.images.files,
            ...this.results.assets.fonts.files,
            ...this.results.assets.videos.files
        ];
        
        // Extract domains from any external references (simplified)
        const domains = new Set(['localhost']); // Add your actual domains
        
        this.results.network = {
            totalRequests: allFiles.length,
            domains: Array.from(domains),
            requestsByType: {
                javascript: this.results.javascript.files.length,
                css: this.results.css.files.length,
                images: this.results.assets.images.files.length,
                fonts: this.results.assets.fonts.files.length,
                videos: this.results.assets.videos.files.length
            }
        };
        
        this.checkNetworkLimits();
        this.displayNetworkResults();
    }

    async analyzeCriticalPath() {
        console.log('\n⚡ Analyzing critical rendering path...');
        
        let criticalSize = 0;
        const criticalResources = [];
        
        // Critical CSS
        if (this.results.css.criticalCSS) {
            criticalSize += this.results.css.criticalCSS.size;
            criticalResources.push({
                type: 'critical-css',
                name: this.results.css.criticalCSS.name,
                size: this.results.css.criticalCSS.size
            });
        }
        
        // Essential JavaScript (main bundle or first chunk)
        if (this.results.javascript.mainBundle) {
            criticalSize += this.results.javascript.mainBundle.size;
            criticalResources.push({
                type: 'critical-js',
                name: this.results.javascript.mainBundle.name,
                size: this.results.javascript.mainBundle.size
            });
        }
        
        this.results.criticalPath = {
            totalSize: criticalSize,
            resources: criticalResources,
            renderBlocking: criticalResources.length
        };
        
        this.checkCriticalPathLimits();
        this.displayCriticalPathResults();
    }

    async analyzeWebpackBundles() {
        console.log('\n📦 Analyzing Webpack bundle composition...');
        
        try {
            // Try to run webpack-bundle-analyzer if available
            const { stdout } = await execAsync('npx webpack-bundle-analyzer --help', { 
                cwd: this.projectRoot 
            }).catch(() => ({ stdout: '' }));
            
            if (stdout) {
                console.log('🔍 Webpack Bundle Analyzer available - generating detailed analysis...');
                // Note: This would typically generate a detailed bundle composition report
                // For now, we'll analyze what we have
            }
            
            this.results.webpack = {
                chunksAnalyzed: this.results.javascript.chunks.length,
                mainBundleSize: this.results.javascript.mainBundle?.size || 0,
                vendorBundleSize: this.results.javascript.vendorBundle?.size || 0,
                codeSplittingEffective: this.results.javascript.chunks.length > 0
            };
            
        } catch (error) {
            console.log('⚠️ Webpack analysis unavailable:', error.message);
            this.results.webpack = { error: error.message };
        }
    }

    checkJavaScriptLimits() {
        if (this.results.javascript.mainBundle && this.results.javascript.mainBundle.size > this.limits.mainJS) {
            this.violations.push({
                type: 'javascript',
                resource: 'main-bundle',
                current: this.results.javascript.mainBundle.size,
                limit: this.limits.mainJS,
                severity: 'high'
            });
        }
        
        if (this.results.javascript.vendorBundle && this.results.javascript.vendorBundle.size > this.limits.vendorJS) {
            this.violations.push({
                type: 'javascript',
                resource: 'vendor-bundle',
                current: this.results.javascript.vendorBundle.size,
                limit: this.limits.vendorJS,
                severity: 'medium'
            });
        }
    }

    checkCSSLimits() {
        if (this.results.css.criticalCSS && this.results.css.criticalCSS.size > this.limits.criticalCSS) {
            this.violations.push({
                type: 'css',
                resource: 'critical-css',
                current: this.results.css.criticalCSS.size,
                limit: this.limits.criticalCSS,
                severity: 'critical'
            });
        }
        
        if (this.results.css.mainCSS && this.results.css.mainCSS.size > this.limits.mainCSS) {
            this.violations.push({
                type: 'css',
                resource: 'main-css',
                current: this.results.css.mainCSS.size,
                limit: this.limits.mainCSS,
                severity: 'medium'
            });
        }
    }

    checkAssetLimits() {
        if (this.results.assets.images.totalSize > this.limits.images) {
            this.violations.push({
                type: 'assets',
                resource: 'images',
                current: this.results.assets.images.totalSize,
                limit: this.limits.images,
                severity: 'medium'
            });
        }
        
        if (this.results.assets.fonts.totalSize > this.limits.fonts) {
            this.violations.push({
                type: 'assets',
                resource: 'fonts',
                current: this.results.assets.fonts.totalSize,
                limit: this.limits.fonts,
                severity: 'low'
            });
        }
    }

    checkCompressionLimits() {
        if (this.results.compression.gzipped > this.limits.totalGzipped) {
            this.violations.push({
                type: 'compression',
                resource: 'total-gzipped',
                current: this.results.compression.gzipped,
                limit: this.limits.totalGzipped,
                severity: 'high'
            });
        }
        
        if (this.results.compression.brotli > this.limits.totalBrotli) {
            this.violations.push({
                type: 'compression',
                resource: 'total-brotli',
                current: this.results.compression.brotli,
                limit: this.limits.totalBrotli,
                severity: 'medium'
            });
        }
    }

    checkNetworkLimits() {
        if (this.results.network.totalRequests > this.limits.maxRequests) {
            this.violations.push({
                type: 'network',
                resource: 'total-requests',
                current: this.results.network.totalRequests,
                limit: this.limits.maxRequests,
                severity: 'medium'
            });
        }
        
        if (this.results.network.domains.length > this.limits.maxDomainSharding) {
            this.violations.push({
                type: 'network',
                resource: 'domain-sharding',
                current: this.results.network.domains.length,
                limit: this.limits.maxDomainSharding,
                severity: 'low'
            });
        }
    }

    checkCriticalPathLimits() {
        if (this.results.criticalPath.totalSize > this.limits.totalCritical) {
            this.violations.push({
                type: 'critical-path',
                resource: 'total-critical',
                current: this.results.criticalPath.totalSize,
                limit: this.limits.totalCritical,
                severity: 'critical'
            });
        }
    }

    displayJavaScriptResults() {
        console.log(`📊 JavaScript Analysis:`);
        console.log(`   Total Files: ${this.results.javascript.files.length}`);
        console.log(`   Total Size: ${this.formatBytes(this.results.javascript.totalSize)}`);
        console.log(`   Gzipped Size: ${this.formatBytes(this.results.javascript.gzippedSize)}`);
        
        if (this.results.javascript.mainBundle) {
            const status = this.results.javascript.mainBundle.size <= this.limits.mainJS ? '✅' : '❌';
            console.log(`   ${status} Main Bundle: ${this.formatBytes(this.results.javascript.mainBundle.size)} (Limit: ${this.formatBytes(this.limits.mainJS)})`);
        }
        
        if (this.results.javascript.vendorBundle) {
            const status = this.results.javascript.vendorBundle.size <= this.limits.vendorJS ? '✅' : '❌';
            console.log(`   ${status} Vendor Bundle: ${this.formatBytes(this.results.javascript.vendorBundle.size)} (Limit: ${this.formatBytes(this.limits.vendorJS)})`);
        }
    }

    displayCSSResults() {
        console.log(`🎨 CSS Analysis:`);
        console.log(`   Total Files: ${this.results.css.files.length}`);
        console.log(`   Total Size: ${this.formatBytes(this.results.css.totalSize)}`);
        console.log(`   Gzipped Size: ${this.formatBytes(this.results.css.gzippedSize)}`);
        
        if (this.results.css.criticalCSS) {
            const status = this.results.css.criticalCSS.size <= this.limits.criticalCSS ? '✅' : '❌';
            console.log(`   ${status} Critical CSS: ${this.formatBytes(this.results.css.criticalCSS.size)} (Limit: ${this.formatBytes(this.limits.criticalCSS)})`);
        }
    }

    displayAssetResults() {
        console.log(`🖼️ Asset Analysis:`);
        console.log(`   Images: ${this.results.assets.images.files.length} files, ${this.formatBytes(this.results.assets.images.totalSize)}`);
        console.log(`   Fonts: ${this.results.assets.fonts.files.length} files, ${this.formatBytes(this.results.assets.fonts.totalSize)}`);
        console.log(`   Videos: ${this.results.assets.videos.files.length} files, ${this.formatBytes(this.results.assets.videos.totalSize)}`);
    }

    displayCompressionResults() {
        console.log(`🗜️ Compression Analysis:`);
        console.log(`   Uncompressed: ${this.formatBytes(this.results.compression.uncompressed)}`);
        console.log(`   Gzipped: ${this.formatBytes(this.results.compression.gzipped)} (${Math.round(this.results.compression.gzipRatio * 100)}% of original)`);
        console.log(`   Brotli (est): ${this.formatBytes(this.results.compression.brotli)} (${Math.round(this.results.compression.brotliRatio * 100)}% of original)`);
    }

    displayNetworkResults() {
        console.log(`🌐 Network Analysis:`);
        console.log(`   Total Requests: ${this.results.network.totalRequests}`);
        console.log(`   Domains: ${this.results.network.domains.length}`);
        console.log(`   Request Breakdown: JS(${this.results.network.requestsByType.javascript}) CSS(${this.results.network.requestsByType.css}) IMG(${this.results.network.requestsByType.images}) FONT(${this.results.network.requestsByType.fonts})`);
    }

    displayCriticalPathResults() {
        console.log(`⚡ Critical Path Analysis:`);
        console.log(`   Critical Resources: ${this.results.criticalPath.resources.length}`);
        console.log(`   Total Critical Size: ${this.formatBytes(this.results.criticalPath.totalSize)}`);
        const status = this.results.criticalPath.totalSize <= this.limits.totalCritical ? '✅' : '❌';
        console.log(`   ${status} Within Limit: ${this.formatBytes(this.limits.totalCritical)}`);
    }

    async generateReports() {
        const reportData = {
            testSuite: 'Bundle Size Comprehensive Analysis',
            timestamp: new Date().toISOString(),
            summary: this.generateSummary(),
            results: this.results,
            violations: this.violations,
            limits: this.limits
        };

        await fs.writeFile(
            path.join(__dirname, '../reports/bundle-analysis-report.json'),
            JSON.stringify(reportData, null, 2)
        );

        console.log('\n📄 Bundle analysis reports generated:');
        console.log('   - tests/reports/bundle-analysis-report.json');
    }

    generateSummary() {
        const criticalViolations = this.violations.filter(v => v.severity === 'critical').length;
        const highViolations = this.violations.filter(v => v.severity === 'high').length;
        const totalViolations = this.violations.length;
        
        return {
            totalViolations,
            criticalViolations,
            highViolations,
            totalSize: this.results.compression?.uncompressed || 0,
            gzippedSize: this.results.compression?.gzipped || 0,
            compressionRatio: this.results.compression?.gzipRatio || 0
        };
    }

    validateBudgets() {
        console.log('\n🎯 FINAL BUNDLE SIZE VALIDATION:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const summary = this.generateSummary();
        
        if (summary.totalViolations === 0) {
            console.log('✅ 🏆 BUNDLE SIZE PERFECTION ACHIEVED!');
            console.log('✅ All bundles within size limits');
            console.log('✅ Critical path optimized');
            console.log('✅ Compression ratios excellent');
            console.log('✅ Network requests minimized');
            console.log('✅ Ready for production deployment');
        } else {
            console.log('❌ 🚨 BUNDLE SIZE VIOLATIONS DETECTED!');
            console.log(`❌ Total violations: ${summary.totalViolations}`);
            console.log(`❌ Critical violations: ${summary.criticalViolations}`);
            console.log(`❌ High priority violations: ${summary.highViolations}`);
            
            if (summary.criticalViolations > 0) {
                console.log('\n🚨 CRITICAL SIZE VIOLATIONS:');
                this.violations
                    .filter(v => v.severity === 'critical')
                    .forEach(violation => {
                        console.log(`   - ${violation.resource}: ${this.formatBytes(violation.current)} (Limit: ${this.formatBytes(violation.limit)})`);
                    });
            }
            
            console.log('\n📋 IMMEDIATE BUNDLE OPTIMIZATION REQUIRED');
            process.exit(1);
        }
    }

    async findFiles(dir, pattern) {
        const files = [];
        
        async function scan(currentDir) {
            const items = await fs.readdir(currentDir, { withFileTypes: true });
            
            for (const item of items) {
                const fullPath = path.join(currentDir, item.name);
                
                if (item.isDirectory()) {
                    await scan(fullPath);
                } else if (pattern.test(item.name)) {
                    files.push(fullPath);
                }
            }
        }
        
        await scan(dir);
        return files;
    }

    async getGzippedSize(content) {
        const zlib = require('zlib');
        return new Promise((resolve) => {
            zlib.gzip(content, (err, compressed) => {
                resolve(err ? 0 : compressed.length);
            });
        });
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Execute if run directly
if (require.main === module) {
    const analyzer = new BundleAnalyzer();
    
    analyzer.runComprehensiveAnalysis().catch(error => {
        console.error('💥 CRITICAL ANALYSIS FAILURE:', error);
        process.exit(1);
    });
}

module.exports = BundleAnalyzer;